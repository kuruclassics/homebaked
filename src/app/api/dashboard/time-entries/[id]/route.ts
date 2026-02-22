import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { timeEntries } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const result = await db.update(timeEntries).set({
    date: body.date,
    hours: body.hours,
    notes: body.notes || null,
  }).where(eq(timeEntries.id, Number(id))).returning();
  if (!result.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(timeEntries).where(eq(timeEntries.id, Number(id)));
  return NextResponse.json({ ok: true });
}
