'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Printer, X } from 'lucide-react';
import ProposalPrintView from '@/components/proposal/ProposalPrintView';

interface Proposal {
  id: number;
  title: string;
  status: string;
  clientPrd: string | null;
  timeline: string | null;
  quote: string | null;
  clientTimelineOverride: string | null;
  clientQuoteOverride: string | null;
  leadName: string;
  createdAt: string;
}

export default function PrintPage() {
  const { proposalId } = useParams<{ id: string; proposalId: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/dashboard/proposals/${proposalId}`);
      if (res.ok) setProposal(await res.json());
    })();
  }, [proposalId]);

  useEffect(() => {
    if (!proposal) return;
    document.fonts.ready.then(() => {
      setTimeout(() => window.print(), 500);
    });
  }, [proposal]);

  if (!proposal) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#6B6B7B' }}>
        Loading proposal...
      </div>
    );
  }

  return (
    <>
      {/* Floating toolbar - hidden in print */}
      <div className="print-hide" style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 50, display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => window.print()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#D4850F', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}
        >
          <Printer style={{ width: '16px', height: '16px' }} />
          Print
        </button>
        <button
          onClick={() => window.close()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', color: '#1E1E2A', border: '1px solid #EDE9E3', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}
        >
          <X style={{ width: '16px', height: '16px' }} />
          Close
        </button>
      </div>

      <ProposalPrintView
        title={proposal.title}
        clientName={proposal.leadName}
        date={proposal.createdAt}
        clientPrd={proposal.clientPrd}
        timeline={proposal.clientTimelineOverride || proposal.timeline}
        quote={(() => {
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
        })()}
      />
    </>
  );
}
