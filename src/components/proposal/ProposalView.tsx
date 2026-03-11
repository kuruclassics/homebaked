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

export default function ProposalView({ title, clientName, date, clientPrd, timeline, quote }: Props) {
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
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="text-center mb-12">
        <p className="text-sm font-medium text-honey tracking-wider uppercase mb-4">HomeBaked</p>
        <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
          {title}
        </h1>
        <p className="text-warm-gray">
          Prepared for <span className="font-medium text-charcoal">{clientName}</span>
        </p>
        <p className="text-sm text-warm-gray-light mt-1">{formattedDate}</p>
      </header>

      {/* Client PRD / Overview */}
      {clientPrd && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-charcoal mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Project Overview
          </h2>
          <div className="bg-white rounded-2xl border border-cream-dark p-6 md:p-8">
            <div className="prose prose-sm max-w-none prose-headings:text-charcoal prose-headings:font-semibold prose-p:text-charcoal/80 prose-li:text-charcoal/80 prose-strong:text-charcoal">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{clientPrd}</ReactMarkdown>
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      {phases.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-charcoal" style={{ fontFamily: 'var(--font-serif)' }}>
              Timeline
            </h2>
            <span className="text-sm text-warm-gray">{totalWeeks} weeks total</span>
          </div>
          <div className="space-y-4">
            {phases.map((phase, i) => (
              <div key={i} className="bg-white rounded-2xl border border-cream-dark p-6 relative">
                {/* Phase number indicator */}
                <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-honey text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-charcoal">{phase.phase}</h3>
                  <span className="text-sm font-medium text-honey shrink-0 ml-4">{phase.weeks} week{phase.weeks !== 1 ? 's' : ''}</span>
                </div>
                <p className="text-sm text-charcoal/70 mb-3">{phase.description}</p>
                {phase.milestones.length > 0 && (
                  <div className="border-t border-cream-dark pt-3">
                    <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-2">Milestones</p>
                    <ul className="space-y-1.5">
                      {phase.milestones.map((m, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-charcoal/70">
                          <span className="text-honey mt-0.5">-</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quote / Investment */}
      {quoteData && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-charcoal mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Investment
          </h2>
          <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-dark bg-cream/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider">Item</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody>
                {quoteData.lineItems.map((item, i) => (
                  <tr key={i} className="border-b border-cream-dark last:border-0">
                    <td className="px-6 py-4">
                      <div className="font-medium text-charcoal">{item.name}</div>
                      <div className="text-sm text-charcoal/60 mt-0.5">{item.description}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-charcoal">
                      ${item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-charcoal">
                  <td className="px-6 py-4 font-semibold text-white">Total Investment</td>
                  <td className="px-6 py-4 text-right font-bold text-honey text-xl">
                    ${totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {quoteData.notes && (
            <p className="text-sm text-warm-gray mt-4 italic">{quoteData.notes}</p>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="text-center pt-8 border-t border-cream-dark">
        <p className="text-sm text-warm-gray">
          Prepared by <span className="font-medium text-honey">HomeBaked</span>
        </p>
      </footer>
    </div>
  );
}
