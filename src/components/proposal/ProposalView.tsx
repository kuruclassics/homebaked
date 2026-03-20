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
  ongoingSupport?: {
    monthlyRetainerAmount: number;
    hourlyRate: number;
  };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function InlineDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="h-px flex-1 bg-honey/30" />
      <span className="text-[0.65rem] font-bold tracking-[0.15em] text-honey uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-honey/30" />
    </div>
  );
}

export default function ProposalView({ title, clientName, date, clientPrd, timeline, quote }: Props) {
  let phases: Phase[] = [];
  let quoteData: QuoteData | null = null;
  let totalAmount = 0;

  try {
    if (timeline) phases = JSON.parse(timeline);
  } catch { /* */ }

  try {
    if (quote) {
      quoteData = JSON.parse(quote);
      quoteData!.lineItems = quoteData!.lineItems.filter(item => item.amount !== 0);
      totalAmount = quoteData!.lineItems.reduce((sum, item) => sum + item.amount, 0);
    }
  } catch { /* */ }

  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const refNumber = `HB-${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}${String(dateObj.getDate()).padStart(2, '0')}`;

  // Cumulative week ranges for timeline
  let cumulativeWeeks = 0;
  const phaseWeekRanges = phases.map(phase => {
    const start = cumulativeWeeks + 1;
    const end = cumulativeWeeks + phase.weeks;
    cumulativeWeeks = end;
    return start === end ? `Week ${start}` : `Week ${start}-${end}`;
  });

  return (
    <main className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">

      {/* ═══════════════════════════════════════════════
          SECTION 1 — Header + Overview + Deliverables
      ═══════════════════════════════════════════════ */}
      <header className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-cream/30">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="w-7 h-7 bg-honey rounded-full flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-white rounded-full opacity-50" />
          </div>
          <span className="text-xl font-bold tracking-tight text-charcoal">HomeBaked</span>
        </div>
        <div className="text-right">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-charcoal uppercase mb-0.5">
            Project Proposal
          </h1>
          <p className="text-warm-gray text-xs">Ref: {refNumber} &bull; {formattedDate}</p>
        </div>
      </header>

      <div className="p-6 md:p-8">
        {/* Title + Prepared For — side by side */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h3 className="text-2xl font-semibold text-charcoal">{title}</h3>
          <div className="bg-cream px-4 py-3 rounded-md border border-honey/10 shrink-0">
            <span className="text-[0.6rem] font-bold uppercase tracking-wider text-warm-gray">Prepared For</span>
            <p className="text-charcoal font-medium text-sm mt-0.5">{clientName}</p>
          </div>
        </div>

        {/* PRD Content — 2-column on desktop */}
        {clientPrd && (
          <div className="md:columns-2 md:gap-6 mb-6 prose prose-sm max-w-none prose-headings:text-charcoal prose-p:text-warm-gray prose-li:text-warm-gray prose-strong:text-charcoal [&_p]:leading-relaxed [&_p]:mb-2 [&_p]:text-[0.8rem] [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_li]:text-[0.8rem]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{clientPrd}</ReactMarkdown>
          </div>
        )}

      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — Project Timeline
      ═══════════════════════════════════════════════ */}
      {phases.length > 0 && (
        <div className="p-6 md:p-8 border-t border-gray-100">
          <InlineDivider label="Project Timeline" />
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100 md:left-1/2" />
            <div className="space-y-6">
              {phases.map((phase, i) => {
                const isEven = i % 2 === 0;
                const dotColor = isEven ? 'bg-honey' : 'bg-charcoal';
                return (
                  <div key={i} className="relative flex flex-col md:flex-row items-center">
                    {isEven ? (
                      <>
                        <div className="flex-1 w-full md:text-right md:pr-10">
                          <h4 className="font-bold text-charcoal text-sm">{phase.phase}</h4>
                          <p className="text-xs text-warm-gray">{phase.description}</p>
                        </div>
                        <div className={`absolute left-4 md:left-1/2 w-3.5 h-3.5 ${dotColor} rounded-full -translate-x-1.5 md:-translate-x-2 border-[3px] border-white`} />
                        <div className="flex-1 w-full pl-10 md:pl-10 mt-1.5 md:mt-0">
                          <span className="text-[0.65rem] font-bold text-honey uppercase tracking-widest bg-cream px-2 py-1 rounded">
                            {phaseWeekRanges[i]}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 w-full order-2 md:order-1 md:text-right md:pr-10 mt-1.5 md:mt-0">
                          <span className="text-[0.65rem] font-bold text-honey uppercase tracking-widest bg-cream px-2 py-1 rounded">
                            {phaseWeekRanges[i]}
                          </span>
                        </div>
                        <div className={`absolute left-4 md:left-1/2 w-3.5 h-3.5 ${dotColor} rounded-full -translate-x-1.5 md:-translate-x-2 border-[3px] border-white`} />
                        <div className="flex-1 w-full order-1 md:order-2 pl-10 md:pl-10">
                          <h4 className="font-bold text-charcoal text-sm">{phase.phase}</h4>
                          <p className="text-xs text-warm-gray">{phase.description}</p>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          SECTION 3 — Investment + Support + Terms
      ═══════════════════════════════════════════════ */}
      {quoteData && (
        <div className="p-6 md:p-8 border-t border-gray-100">
          <InlineDivider label="Investment" />

          {/* Investment Table */}
          <div className="overflow-hidden border border-gray-100 rounded-md mb-6">
            <table className="w-full text-left">
              <thead className="bg-cream border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-[0.65rem] font-bold text-charcoal uppercase tracking-widest">Description</th>
                  <th className="px-4 py-3 text-[0.65rem] font-bold text-charcoal uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quoteData.lineItems.map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-charcoal text-sm">{item.name}</div>
                      <div className="text-[0.7rem] text-warm-gray">{item.description}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-sm">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-charcoal text-white">
                <tr>
                  <td className="px-4 py-4 text-base font-bold">Total Project Estimate</td>
                  <td className="px-4 py-4 text-right text-xl font-bold text-honey">{formatCurrency(totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ongoing Support */}
          {quoteData.ongoingSupport && (
            <InlineDivider label="Ongoing Support" />
          )}
          {quoteData.ongoingSupport && (
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-cream rounded-md border-t-[3px] border-honey/30 p-4">
                <p className="text-[0.6rem] font-bold tracking-[0.15em] text-warm-gray uppercase mb-2">
                  &#9790; Option 1
                </p>
                <p className="text-2xl font-bold text-honey mb-0.5">
                  {formatCurrency(quoteData.ongoingSupport.monthlyRetainerAmount)}
                  <span className="text-sm font-normal text-warm-gray">/mo</span>
                </p>
                <p className="text-xs font-semibold text-charcoal mt-2 mb-0.5">Monthly Retainer</p>
                <p className="text-xs text-warm-gray">
                  Full technical support, hosting &amp; database storage
                </p>
              </div>
              <div className="bg-cream rounded-md border-t-[3px] border-charcoal/30 p-4">
                <p className="text-[0.6rem] font-bold tracking-[0.15em] text-warm-gray uppercase mb-2">
                  &#9790; Option 2
                </p>
                <p className="text-2xl font-bold text-charcoal mb-0.5">
                  {formatCurrency(quoteData.ongoingSupport.hourlyRate)}
                  <span className="text-sm font-normal text-warm-gray">/hr</span>
                </p>
                <p className="text-xs font-semibold text-charcoal mt-2 mb-0.5">Self-Hosted</p>
                <p className="text-xs text-warm-gray">
                  Client-owned hosting, support billed hourly
                </p>
              </div>
            </div>
          )}

          {/* Terms & Conditions + Signature */}
          <section className="pt-4 border-t border-gray-100">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[0.65rem] font-bold text-honey uppercase tracking-widest mb-3">Terms &amp; Conditions</h4>
                <div className="text-[9px] text-warm-gray space-y-1.5 leading-relaxed uppercase">
                  <p>1. Payment: 30% Deposit required to begin, 40% at Mid-point milestone, 30% upon final delivery.</p>
                  <p>2. Validity: This quotation is valid for 30 days from the date of issue.</p>
                  <p>3. Intellectual Property: All custom code becomes the property of the client upon final payment.</p>
                  <p>4. Scope Change: Any additions to the scope listed above will be billed at $150/hr.</p>
                </div>
              </div>
              <div className="flex flex-col justify-end items-end space-y-4">
                <div className="text-right">
                  <p className="text-[0.65rem] text-warm-gray mb-4" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    Signature indicates acceptance of this proposal.
                  </p>
                  <div className="w-56 h-px bg-charcoal mb-1.5" />
                  <p className="text-xs font-bold text-charcoal">Authorized Client Signature</p>
                </div>
                <button className="bg-honey hover:bg-honey/90 text-white font-bold py-2.5 px-6 rounded-full shadow-lg transform transition active:scale-95 flex items-center gap-2 text-sm print-hide">
                  Accept Proposal
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-cream/50 p-6 border-t border-gray-100 text-center">
        <p className="text-warm-gray text-[0.65rem]">HomeBaked &bull; hello@homebaked.dev</p>
      </footer>
    </main>
  );
}
