import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { timeEntries } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';

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

export async function DELETE(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('projectId');
  const source = request.nextUrl.searchParams.get('source');
  if (!projectId || !source) {
    return NextResponse.json({ error: 'projectId and source are required' }, { status: 400 });
  }
  const deleted = await db
    .delete(timeEntries)
    .where(and(eq(timeEntries.projectId, Number(projectId)), eq(timeEntries.source, source as 'git_auto' | 'manual' | 'claude_session')))
    .returning();
  return NextResponse.json({ deleted: deleted.length });
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
