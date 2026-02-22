import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { financialEntries } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const result = await db.update(financialEntries).set({
    type: body.type,
    amount: body.amount,
    date: body.date,
    reference: body.reference || null,
    status: body.status,
    notes: body.notes || null,
  }).where(eq(financialEntries.id, Number(id))).returning();
  if (!result.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(financialEntries).where(eq(financialEntries.id, Number(id)));
  return NextResponse.json({ ok: true });
}
