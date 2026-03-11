import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { proposalFiles } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { del } from '@vercel/blob';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  const { id, fileId } = await params;

  const rows = await db
    .select()
    .from(proposalFiles)
    .where(and(eq(proposalFiles.id, Number(fileId)), eq(proposalFiles.proposalId, Number(id))));

  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    await del(rows[0].blobUrl);
  } catch {
    // Blob may already be deleted
  }

  await db.delete(proposalFiles).where(eq(proposalFiles.id, Number(fileId)));
  return NextResponse.json({ ok: true });
}
