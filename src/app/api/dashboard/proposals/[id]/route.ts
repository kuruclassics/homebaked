import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { proposals, leads, scopeMessages, proposalFiles } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db
    .select({
      id: proposals.id,
      leadId: proposals.leadId,
      slug: proposals.slug,
      title: proposals.title,
      status: proposals.status,
      internalPrd: proposals.internalPrd,
      clientPrd: proposals.clientPrd,
      timeline: proposals.timeline,
      quote: proposals.quote,
      clientTimelineOverride: proposals.clientTimelineOverride,
      clientQuoteOverride: proposals.clientQuoteOverride,
      createdAt: proposals.createdAt,
      updatedAt: proposals.updatedAt,
      leadName: leads.name,
      leadEmail: leads.email,
      leadMessage: leads.message,
    })
    .from(proposals)
    .leftJoin(leads, eq(proposals.leadId, leads.id))
    .where(eq(proposals.id, Number(id)));

  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [msgCount] = await db.select({ count: count() }).from(scopeMessages).where(eq(scopeMessages.proposalId, Number(id)));
  const [fileCount] = await db.select({ count: count() }).from(proposalFiles).where(eq(proposalFiles.proposalId, Number(id)));

  return NextResponse.json({
    ...rows[0],
    messageCount: msgCount.count,
    fileCount: fileCount.count,
  });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const result = await db.update(proposals).set({
    ...(body.title !== undefined && { title: body.title }),
    ...(body.status !== undefined && { status: body.status }),
    ...(body.internalPrd !== undefined && { internalPrd: body.internalPrd }),
    ...(body.clientPrd !== undefined && { clientPrd: body.clientPrd }),
    ...(body.timeline !== undefined && { timeline: body.timeline }),
    ...(body.quote !== undefined && { quote: body.quote }),
    ...(body.clientTimelineOverride !== undefined && { clientTimelineOverride: body.clientTimelineOverride }),
    ...(body.clientQuoteOverride !== undefined && { clientQuoteOverride: body.clientQuoteOverride }),
    updatedAt: new Date().toISOString(),
  }).where(eq(proposals.id, Number(id))).returning();
  if (!result.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(proposals).where(eq(proposals.id, Number(id)));
  return NextResponse.json({ ok: true });
}
