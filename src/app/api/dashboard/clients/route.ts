import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  const rows = await db.select().from(clients).orderBy(desc(clients.createdAt));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await db.insert(clients).values({
    name: body.name,
    email: body.email || null,
    phone: body.phone || null,
    company: body.company || null,
    notes: body.notes || null,
    status: body.status || 'active',
  }).returning();
  return NextResponse.json(result[0], { status: 201 });
}
