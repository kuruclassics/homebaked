import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  title: string;
  clientName: string;
  date: string;
  clientPrd: string | null;
  timeline: string | null;
  quote: string | null;
}

interface Phase {
  phase: string;
  description: string;
  weeks: number;
  milestones: string[];
}

interface QuoteData {
  lineItems: { name: string; description: string; amount: number }[];
  notes: string;
}

export default function ProposalPrintView({ title, clientName, date, clientPrd, timeline, quote }: Props) {
  let phases: Phase[] = [];
  let quoteData: QuoteData | null = null;
  let totalWeeks = 0;
  let totalAmount = 0;

  try {
    if (timeline) {
      phases = JSON.parse(timeline);
      totalWeeks = phases.reduce((sum, p) => sum + p.weeks, 0);
    }
  } catch { /* */ }

  try {
    if (quote) {
      quoteData = JSON.parse(quote);
      totalAmount = quoteData!.lineItems.reduce((sum, item) => sum + item.amount, 0);
    }
  } catch { /* */ }

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Cover Page */}
      <div className="print-cover" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="HomeBaked" style={{ height: '48px', marginBottom: '3rem' }} />
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: '#1E1E2A', marginBottom: '1.5rem', lineHeight: 1.2 }}>
          {title}
        </h1>
        <div style={{ width: '80px', height: '3px', background: '#D4850F', margin: '0 auto 1.5rem' }} />
        <p style={{ fontSize: '1.125rem', color: '#6B6B7B' }}>
          Prepared for <span style={{ fontWeight: 600, color: '#1E1E2A' }}>{clientName}</span>
        </p>
        <p style={{ fontSize: '0.875rem', color: '#9494A0', marginTop: '0.5rem' }}>{formattedDate}</p>
      </div>

      {/* Project Overview */}
      {clientPrd && (
        <div className="print-section" style={{ padding: '2rem 0' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: '#1E1E2A', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid #EDE9E3' }}>
            Project Overview
          </h2>
          <div className="prose prose-sm max-w-none" style={{ color: '#1E1E2A' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{clientPrd}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Timeline */}
      {phases.length > 0 && (
        <div className="print-section" style={{ padding: '2rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid #EDE9E3' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: '#1E1E2A' }}>
              Timeline
            </h2>
            <span style={{ fontSize: '0.875rem', color: '#6B6B7B' }}>{totalWeeks} weeks total</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {phases.map((phase, i) => (
              <div key={i} className="print-no-break" style={{ padding: '1.25rem', border: '1px solid #EDE9E3', borderLeft: '3px solid #D4850F' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#D4850F', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
                      {i + 1}
                    </span>
                    <h3 style={{ fontWeight: 600, color: '#1E1E2A', fontSize: '1rem' }}>{phase.phase}</h3>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#D4850F', whiteSpace: 'nowrap' }}>
                    {phase.weeks} week{phase.weeks !== 1 ? 's' : ''}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6B6B7B', marginBottom: phase.milestones.length > 0 ? '0.75rem' : '0' }}>
                  {phase.description}
                </p>
                {phase.milestones.length > 0 && (
                  <div style={{ borderTop: '1px solid #EDE9E3', paddingTop: '0.75rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#9494A0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                      Milestones
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                      {phase.milestones.map((m, j) => (
                        <li key={j} style={{ fontSize: '0.8rem', color: '#6B6B7B', marginBottom: '0.25rem' }}>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Investment */}
      {quoteData && (
        <div className="print-section" style={{ padding: '2rem 0' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: '#1E1E2A', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid #EDE9E3' }}>
            Investment
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EDE9E3' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#9494A0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Item
                </th>
                <th style={{ textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#9494A0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {quoteData.lineItems.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #EDE9E3' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 500, color: '#1E1E2A' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6B6B7B', marginTop: '0.125rem' }}>{item.description}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 500, color: '#1E1E2A' }}>
                    ${item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#1E1E2A' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'white' }}>Total Investment</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: '#D4850F', fontSize: '1.25rem' }}>
                  ${totalAmount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
          {quoteData.notes && (
            <p style={{ fontSize: '0.8rem', color: '#6B6B7B', marginTop: '1rem', fontStyle: 'italic' }}>
              {quoteData.notes}
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid #EDE9E3', marginTop: '2rem' }}>
        <p style={{ fontSize: '0.8rem', color: '#9494A0' }}>
          Prepared by <span style={{ fontWeight: 600, color: '#D4850F' }}>HomeBaked</span>
        </p>
      </div>
    </div>
  );
}
