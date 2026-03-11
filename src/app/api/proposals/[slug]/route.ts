import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { proposals, leads } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const rows = await db
    .select({
      title: proposals.title,
      status: proposals.status,
      clientPrd: proposals.clientPrd,
      timeline: proposals.timeline,
      quote: proposals.quote,
      clientTimelineOverride: proposals.clientTimelineOverride,
      clientQuoteOverride: proposals.clientQuoteOverride,
      createdAt: proposals.createdAt,
      leadName: leads.name,
    })
    .from(proposals)
    .leftJoin(leads, eq(proposals.leadId, leads.id))
    .where(and(
      eq(proposals.slug, slug),
      inArray(proposals.status, ['ready', 'sent']),
    ));

  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(rows[0]);
}
