import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { proposalFiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { put } from '@vercel/blob';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(proposalFiles)
    .where(eq(proposalFiles.proposalId, Number(id)));
  return NextResponse.json(rows);
}

async function extractText(file: File): Promise<string | null> {
  const name = file.name.toLowerCase();
  const type = file.type;

  // Plain text / markdown / csv / json
  if (
    type.startsWith('text/') ||
    type === 'application/json' ||
    type === 'application/csv' ||
    name.endsWith('.md') || name.endsWith('.txt') || name.endsWith('.csv')
  ) {
    return await file.text();
  }

  // PDF
  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    try {
      const { PDFParse } = await import('pdf-parse');
      const buffer = Buffer.from(await file.arrayBuffer());
      const pdf = new PDFParse({ data: buffer });
      const result = await pdf.getText();
      return result.text;
    } catch (e) {
      console.error('PDF extraction failed:', e);
      return null;
    }
  }

  // DOCX
  if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')
  ) {
    try {
      const mammoth = await import('mammoth');
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (e) {
      console.error('DOCX extraction failed:', e);
      return null;
    }
  }

  // DOC (old format) — limited support
  if (type === 'application/msword' || name.endsWith('.doc')) {
    // mammoth doesn't support .doc, just note it
    return '[Binary .doc file — please convert to .docx for text extraction]';
  }

  // XLSX / XLS
  if (
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    type === 'application/vnd.ms-excel' ||
    name.endsWith('.xlsx') || name.endsWith('.xls')
  ) {
    try {
      const XLSX = await import('xlsx');
      const buffer = Buffer.from(await file.arrayBuffer());
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheets: string[] = [];
      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const csv = XLSX.utils.sheet_to_csv(sheet);
        sheets.push(`## Sheet: ${sheetName}\n${csv}`);
      }
      return sheets.join('\n\n');
    } catch (e) {
      console.error('XLSX extraction failed:', e);
      return null;
    }
  }

  return null;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formData = await request.formData();
  const files = formData.getAll('file') as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }

  const results = [];
  const errors = [];
  for (const file of files) {
    try {
      const blob = await put(`proposals/${id}/${file.name}`, file, {
        access: 'public',
      });

      let textContent: string | null = null;
      try {
        textContent = await extractText(file);
      } catch (e) {
        console.error(`Text extraction failed for ${file.name}:`, e);
      }

      const result = await db.insert(proposalFiles).values({
        proposalId: Number(id),
        filename: file.name,
        blobUrl: blob.url,
        contentType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        textContent,
      }).returning();

      results.push(result[0]);
    } catch (e) {
      console.error(`Upload failed for ${file.name}:`, e);
      errors.push(file.name);
    }
  }

  if (results.length === 0) {
    return NextResponse.json({ error: `Upload failed for: ${errors.join(', ')}` }, { status: 500 });
  }

  return NextResponse.json(results.length === 1 ? results[0] : results, { status: 201 });
}
