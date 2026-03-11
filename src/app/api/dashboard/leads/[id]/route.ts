import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(leads).where(eq(leads.id, Number(id)));
  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const result = await db.update(leads).set({
    name: body.name,
    email: body.email,
    message: body.message,
    status: body.status,
    notes: body.notes ?? null,
  }).where(eq(leads.id, Number(id))).returning();
  if (!result.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(leads).where(eq(leads.id, Number(id)));
  return NextResponse.json({ ok: true });
}
