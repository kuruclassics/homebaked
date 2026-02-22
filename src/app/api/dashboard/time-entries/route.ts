import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { timeEntries } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('projectId');
  const query = db.select().from(timeEntries);
  if (projectId) {
    const rows = await query.where(eq(timeEntries.projectId, Number(projectId))).orderBy(desc(timeEntries.date));
    return NextResponse.json(rows);
  }
  const rows = await query.orderBy(desc(timeEntries.date));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await db.insert(timeEntries).values({
    projectId: body.projectId,
    date: body.date,
    hours: body.hours,
    source: body.source || 'manual',
    commitHash: body.commitHash || null,
    sessionId: body.sessionId || null,
    notes: body.notes || null,
  }).returning();
  return NextResponse.json(result[0], { status: 201 });
}
