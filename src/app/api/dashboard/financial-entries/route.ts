import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { financialEntries } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('projectId');
  const query = db.select().from(financialEntries);
  if (projectId) {
    const rows = await query.where(eq(financialEntries.projectId, Number(projectId))).orderBy(desc(financialEntries.date));
    return NextResponse.json(rows);
  }
  const rows = await query.orderBy(desc(financialEntries.date));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await db.insert(financialEntries).values({
    projectId: body.projectId,
    type: body.type,
    amount: body.amount,
    date: body.date,
    reference: body.reference || null,
    status: body.status || 'pending',
    notes: body.notes || null,
  }).returning();
  return NextResponse.json(result[0], { status: 201 });
}
