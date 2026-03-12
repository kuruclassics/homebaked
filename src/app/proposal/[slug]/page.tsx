import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { proposals, leads } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import ProposalView from '@/components/proposal/ProposalView';

export default async function PublicProposalPage({ params }: { params: Promise<{ slug: string }> }) {
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

  if (!rows.length) notFound();

  const proposal = rows[0];

  // Merge ongoingSupport from original quote if override is missing it
  const mergedQuote = (() => {
    const base = proposal.clientQuoteOverride || proposal.quote;
    if (!base || !proposal.quote) return base;
    try {
      const parsed = JSON.parse(base);
      if (!parsed.ongoingSupport) {
        const original = JSON.parse(proposal.quote);
        if (original.ongoingSupport) {
          parsed.ongoingSupport = original.ongoingSupport;
          return JSON.stringify(parsed);
        }
      }
    } catch { /* */ }
    return base;
  })();

  return (
    <ProposalView
      title={proposal.title}
      clientName={proposal.leadName ?? 'Client'}
      date={proposal.createdAt}
      clientPrd={proposal.clientPrd}
      timeline={proposal.clientTimelineOverride || proposal.timeline}
      quote={mergedQuote}
    />
  );
}
