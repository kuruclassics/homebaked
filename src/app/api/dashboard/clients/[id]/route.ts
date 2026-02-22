import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(clients).where(eq(clients.id, Number(id)));
  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const result = await db.update(clients).set({
    name: body.name,
    email: body.email || null,
    phone: body.phone || null,
    company: body.company || null,
    notes: body.notes || null,
    status: body.status,
    updatedAt: new Date().toISOString(),
  }).where(eq(clients.id, Number(id))).returning();
  if (!result.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(clients).where(eq(clients.id, Number(id)));
  return NextResponse.json({ ok: true });
}
