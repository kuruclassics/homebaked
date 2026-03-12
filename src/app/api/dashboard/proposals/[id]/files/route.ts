import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { proposalFiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(proposalFiles)
    .where(eq(proposalFiles.proposalId, Number(id)));
  return NextResponse.json(rows);
}

async function extractTextFromUrl(blobUrl: string, filename: string, contentType: string): Promise<string | null> {
  const name = filename.toLowerCase();

  // Plain text / markdown / csv / json
  if (
    contentType.startsWith('text/') ||
    contentType === 'application/json' ||
    contentType === 'application/csv' ||
    name.endsWith('.md') || name.endsWith('.txt') || name.endsWith('.csv')
  ) {
    const res = await fetch(blobUrl);
    return await res.text();
  }

  // PDF
  if (contentType === 'application/pdf' || name.endsWith('.pdf')) {
    try {
      const res = await fetch(blobUrl);
      const buffer = Buffer.from(await res.arrayBuffer());
      const { PDFParse } = await import('pdf-parse');
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
    contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')
  ) {
    try {
      const mammoth = await import('mammoth');
      const res = await fetch(blobUrl);
      const buffer = Buffer.from(await res.arrayBuffer());
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (e) {
      console.error('DOCX extraction failed:', e);
      return null;
    }
  }

  // DOC (old format)
  if (contentType === 'application/msword' || name.endsWith('.doc')) {
    return '[Binary .doc file — please convert to .docx for text extraction]';
  }

  // XLSX / XLS
  if (
    contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    contentType === 'application/vnd.ms-excel' ||
    name.endsWith('.xlsx') || name.endsWith('.xls')
  ) {
    try {
      const XLSX = await import('xlsx');
      const res = await fetch(blobUrl);
      const buffer = Buffer.from(await res.arrayBuffer());
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

// POST accepts JSON metadata after client-side blob upload
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const files: { blobUrl: string; filename: string; contentType: string; sizeBytes: number }[] =
    Array.isArray(body) ? body : [body];

  if (files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }

  const results = [];
  const errors = [];
  for (const file of files) {
    try {
      let textContent: string | null = null;
      try {
        textContent = await extractTextFromUrl(file.blobUrl, file.filename, file.contentType);
      } catch (e) {
        console.error(`Text extraction failed for ${file.filename}:`, e);
      }

      const result = await db.insert(proposalFiles).values({
        proposalId: Number(id),
        filename: file.filename,
        blobUrl: file.blobUrl,
        contentType: file.contentType || 'application/octet-stream',
        sizeBytes: file.sizeBytes,
        textContent,
      }).returning();

      results.push(result[0]);
    } catch (e) {
      console.error(`Save failed for ${file.filename}:`, e);
      errors.push(file.filename);
    }
  }

  if (results.length === 0) {
    return NextResponse.json({ error: `Failed for: ${errors.join(', ')}` }, { status: 500 });
  }

  return NextResponse.json(results.length === 1 ? results[0] : results, { status: 201 });
}
