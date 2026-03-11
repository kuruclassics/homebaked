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

const TEXT_TYPES = ['text/', 'application/json', 'application/csv', 'text/csv', 'text/markdown'];

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const blob = await put(`proposals/${id}/${file.name}`, file, {
    access: 'public',
  });

  let textContent: string | null = null;
  const isTextFile = TEXT_TYPES.some(t => file.type.startsWith(t)) ||
    file.name.endsWith('.md') || file.name.endsWith('.txt') || file.name.endsWith('.csv');

  if (isTextFile) {
    textContent = await file.text();
  }

  const result = await db.insert(proposalFiles).values({
    proposalId: Number(id),
    filename: file.name,
    blobUrl: blob.url,
    contentType: file.type || 'application/octet-stream',
    sizeBytes: file.size,
    textContent,
  }).returning();

  return NextResponse.json(result[0], { status: 201 });
}
