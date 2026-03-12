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

function SectionDivider({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="h-px flex-1 bg-honey/30" />
      <h2 className="text-xs font-bold tracking-[0.2em] text-honey uppercase italic">
        {number}. {label}
      </h2>
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

  // Dynamic section numbering — only count sections that have data
  let sectionCounter = 0;
  const sectionNumbers: Record<string, string> = {};
  if (clientPrd) sectionNumbers.overview = String(++sectionCounter).padStart(2, '0');
  if (quoteData) sectionNumbers.deliverables = String(++sectionCounter).padStart(2, '0');
  if (phases.length > 0) sectionNumbers.timeline = String(++sectionCounter).padStart(2, '0');
  if (quoteData) sectionNumbers.investment = String(++sectionCounter).padStart(2, '0');
  if (quoteData?.ongoingSupport) sectionNumbers.ongoingSupport = String(++sectionCounter).padStart(2, '0');

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
      {/* ── Header ── */}
      <header className="p-8 md:p-12 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-cream/30">
        <div className="flex items-center gap-2 mb-6 md:mb-0">
          <div className="w-8 h-8 bg-honey rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full opacity-50" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-charcoal">HomeBaked</span>
        </div>
        <div className="text-right">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-charcoal uppercase mb-1">
            Project Proposal
          </h1>
          <p className="text-warm-gray text-sm">Ref: {refNumber} &bull; {formattedDate}</p>
        </div>
      </header>

      <div className="p-8 md:p-12 space-y-16">
        {/* ── 01. Overview ── */}
        {clientPrd && (
          <section>
            <SectionDivider number={sectionNumbers.overview} label="Overview" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-3xl font-semibold mb-4 text-charcoal">{title}</h3>
                <div className="prose prose-sm max-w-none prose-headings:text-charcoal prose-p:text-warm-gray prose-li:text-warm-gray prose-strong:text-charcoal [&_p]:leading-relaxed [&_p]:mb-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{clientPrd}</ReactMarkdown>
                </div>
              </div>
              <div className="bg-cream p-6 rounded-lg border border-honey/10">
                <h4 className="text-sm font-bold mb-3 uppercase tracking-wider">Prepared For</h4>
                <p className="text-charcoal font-medium">{clientName}</p>
                <p className="text-sm text-warm-gray mt-4">Project: {title}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── 02. Deliverables ── */}
        {quoteData && (
          <section>
            <SectionDivider number={sectionNumbers.deliverables} label="Deliverables" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {quoteData.lineItems.map((item, i) => (
                <div key={i} className="border border-gray-100 p-6 rounded-lg hover:border-honey/50 transition-colors">
                  <div className="w-10 h-10 bg-cream rounded flex items-center justify-center mb-4">
                    <span className="text-sm font-bold text-honey">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h4 className="font-bold text-charcoal mb-2">{item.name}</h4>
                  <p className="text-sm text-warm-gray">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 03. Timeline ── */}
        {phases.length > 0 && (
          <section>
            <SectionDivider number={sectionNumbers.timeline} label="Project Timeline" />
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100 md:left-1/2" />
              <div className="space-y-12">
                {phases.map((phase, i) => {
                  const isEven = i % 2 === 0;
                  const dotColor = isEven ? 'bg-honey' : 'bg-charcoal';
                  return (
                    <div key={i} className="relative flex flex-col md:flex-row items-center">
                      {isEven ? (
                        <>
                          <div className="flex-1 w-full md:text-right md:pr-12">
                            <h4 className="font-bold text-charcoal">{phase.phase}</h4>
                            <p className="text-sm text-warm-gray">{phase.description}</p>
                          </div>
                          <div className={`absolute left-4 md:left-1/2 w-4 h-4 ${dotColor} rounded-full -translate-x-1.5 md:-translate-x-2 border-4 border-white`} />
                          <div className="flex-1 w-full pl-12 md:pl-12 mt-2 md:mt-0">
                            <span className="text-xs font-bold text-honey uppercase tracking-widest bg-cream px-2 py-1 rounded">
                              {phaseWeekRanges[i]}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex-1 w-full order-2 md:order-1 md:text-right md:pr-12 mt-2 md:mt-0">
                            <span className="text-xs font-bold text-honey uppercase tracking-widest bg-cream px-2 py-1 rounded">
                              {phaseWeekRanges[i]}
                            </span>
                          </div>
                          <div className={`absolute left-4 md:left-1/2 w-4 h-4 ${dotColor} rounded-full -translate-x-1.5 md:-translate-x-2 border-4 border-white`} />
                          <div className="flex-1 w-full order-1 md:order-2 pl-12 md:pl-12">
                            <h4 className="font-bold text-charcoal">{phase.phase}</h4>
                            <p className="text-sm text-warm-gray">{phase.description}</p>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── 04. Investment ── */}
        {quoteData && (
          <section>
            <SectionDivider number={sectionNumbers.investment} label="Investment" />
            <div className="overflow-hidden border border-gray-100 rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-cream border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-charcoal uppercase tracking-widest">Description</th>
                    <th className="px-6 py-4 text-xs font-bold text-charcoal uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {quoteData.lineItems.map((item, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-charcoal">{item.name}</div>
                        <div className="text-xs text-warm-gray">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-charcoal text-white">
                  <tr>
                    <td className="px-6 py-6 text-lg font-bold">Total Project Estimate</td>
                    <td className="px-6 py-6 text-right text-2xl font-bold text-honey">{formatCurrency(totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        )}

        {/* ── Ongoing Support ── */}
        {quoteData?.ongoingSupport && (
          <section>
            <SectionDivider number={sectionNumbers.ongoingSupport} label="Ongoing Support" />
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Option 1 — Monthly Retainer */}
              <div className="bg-cream rounded-lg border-t-4 border-honey/30 p-6">
                <p className="text-xs font-bold tracking-[0.15em] text-warm-gray uppercase mb-4">
                  &#9790; Option 1
                </p>
                <p className="text-3xl font-bold text-honey mb-1">
                  {formatCurrency(quoteData.ongoingSupport.monthlyRetainerAmount)}
                  <span className="text-base font-normal text-warm-gray">/mo</span>
                </p>
                <p className="text-sm font-semibold text-charcoal mt-3 mb-1">Monthly Retainer</p>
                <p className="text-sm text-warm-gray">
                  Full technical support, hosting &amp; database storage
                </p>
              </div>
              {/* Option 2 — Self-Hosted */}
              <div className="bg-cream rounded-lg border-t-4 border-charcoal/30 p-6">
                <p className="text-xs font-bold tracking-[0.15em] text-warm-gray uppercase mb-4">
                  &#9790; Option 2
                </p>
                <p className="text-3xl font-bold text-charcoal mb-1">
                  {formatCurrency(quoteData.ongoingSupport.hourlyRate)}
                  <span className="text-base font-normal text-warm-gray">/hr</span>
                </p>
                <p className="text-sm font-semibold text-charcoal mt-3 mb-1">Self-Hosted</p>
                <p className="text-sm text-warm-gray">
                  Client-owned hosting, support billed hourly
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── Terms & Conditions ── */}
        <section className="pt-8 border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-xs font-bold text-honey uppercase tracking-widest mb-4">Terms &amp; Conditions</h4>
              <div className="text-[10px] text-warm-gray space-y-2 leading-relaxed uppercase">
                <p>1. Payment: 30% Deposit required to begin, 40% at Mid-point milestone, 30% upon final delivery.</p>
                <p>2. Validity: This quotation is valid for 30 days from the date of issue.</p>
                <p>3. Intellectual Property: All custom code becomes the property of the client upon final payment.</p>
                <p>4. Scope Change: Any additions to the scope listed above will be billed at $150/hr.</p>
              </div>
            </div>
            <div className="flex flex-col justify-end items-end space-y-6">
              <div className="text-right">
                <p className="text-xs text-warm-gray mb-6" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  Signature indicates acceptance of this proposal.
                </p>
                <div className="w-64 h-px bg-charcoal mb-2" />
                <p className="text-sm font-bold text-charcoal">Authorized Client Signature</p>
              </div>
              <button className="bg-honey hover:bg-honey/90 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition active:scale-95 flex items-center gap-2">
                Accept Proposal
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-cream/50 p-8 border-t border-gray-100 text-center">
        <p className="text-warm-gray text-xs">HomeBaked &bull; hello@homebaked.dev</p>
      </footer>
    </main>
  );
}
