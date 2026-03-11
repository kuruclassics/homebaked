import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await db.insert(leads).values({
    name: body.name,
    email: body.email,
    message: body.message,
    status: body.status || 'new',
    notes: body.notes || null,
  }).returning();
  return NextResponse.json(result[0], { status: 201 });
}
