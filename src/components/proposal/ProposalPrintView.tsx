import ReactMarkdown, { Components } from 'react-markdown';
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

const COLORS = {
  honey: '#D4850F',
  charcoal: '#1E1E2A',
  cream: '#F7F5F2',
  creamDark: '#EDE9E3',
  muted: '#71717A',
  white: '#FFFFFF',
  border: '#F3F4F6',
};

const FONTS = {
  sans: "'Inter', system-ui, -apple-system, sans-serif",
  serif: "'Georgia', serif",
};

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
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
      <span style={{ height: '1px', flex: 1, background: `${COLORS.honey}4D` }} />
      <h2 style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.2em',
        color: COLORS.honey,
        textTransform: 'uppercase',
        fontStyle: 'italic',
        margin: 0,
        whiteSpace: 'nowrap',
      }}>
        {number}. {label}
      </h2>
    </div>
  );
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 style={{ fontFamily: FONTS.serif, fontSize: '1.5rem', fontWeight: 700, color: COLORS.charcoal, marginTop: '1.5rem', marginBottom: '0.75rem' }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{ fontFamily: FONTS.serif, fontSize: '1.25rem', fontWeight: 700, color: COLORS.charcoal, marginTop: '1.25rem', marginBottom: '0.625rem' }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontFamily: FONTS.serif, fontSize: '1.1rem', fontWeight: 700, color: COLORS.charcoal, marginTop: '1rem', marginBottom: '0.5rem' }}>{children}</h3>
  ),
  p: ({ children }) => (
    <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: COLORS.muted, marginBottom: '0.75rem' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: COLORS.muted, marginBottom: '0.25rem' }}>{children}</li>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: 600, color: COLORS.charcoal }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ fontStyle: 'italic', color: COLORS.muted }}>{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: `3px solid ${COLORS.honey}`, paddingLeft: '1rem', margin: '1rem 0', color: COLORS.muted }}>{children}</blockquote>
  ),
  table: ({ children }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem', fontSize: '0.875rem' }}>{children}</table>
  ),
  th: ({ children }) => (
    <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderBottom: `2px solid ${COLORS.creamDark}`, fontWeight: 600, color: COLORS.charcoal, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{ padding: '0.5rem 0.75rem', borderBottom: `1px solid ${COLORS.creamDark}`, color: COLORS.charcoal }}>{children}</td>
  ),
  code: ({ children }) => (
    <code style={{ background: COLORS.cream, padding: '0.125rem 0.375rem', borderRadius: '3px', fontSize: '0.85em', fontFamily: 'monospace' }}>{children}</code>
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: `1px solid ${COLORS.creamDark}`, margin: '1.5rem 0' }} />
  ),
};

export default function ProposalPrintView({ title, clientName, date, clientPrd, timeline, quote }: Props) {
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

  // Dynamic section numbering
  let sectionCounter = 0;
  const sectionNumbers: Record<string, string> = {};
  if (clientPrd) sectionNumbers.overview = String(++sectionCounter).padStart(2, '0');
  if (quoteData) sectionNumbers.deliverables = String(++sectionCounter).padStart(2, '0');
  if (phases.length > 0) sectionNumbers.timeline = String(++sectionCounter).padStart(2, '0');
  if (quoteData) sectionNumbers.investment = String(++sectionCounter).padStart(2, '0');

  // Cumulative week ranges
  let cumulativeWeeks = 0;
  const phaseWeekRanges = phases.map(phase => {
    const start = cumulativeWeeks + 1;
    const end = cumulativeWeeks + phase.weeks;
    cumulativeWeeks = end;
    return start === end ? `Week ${start}` : `Week ${start}-${end}`;
  });

  return (
    <div style={{ fontFamily: FONTS.sans, color: COLORS.charcoal, maxWidth: '64rem', margin: '0 auto' }}>
      <div style={{
        background: COLORS.white,
        borderRadius: '0.75rem',
        overflow: 'hidden',
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      }}>
        {/* ── Header ── */}
        <header style={{
          padding: '3rem',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: `${COLORS.cream}4D`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              background: COLORS.honey,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ width: '1rem', height: '1rem', background: COLORS.white, borderRadius: '50%', opacity: 0.5 }} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em', color: COLORS.charcoal }}>HomeBaked</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 300,
              letterSpacing: '-0.025em',
              color: COLORS.charcoal,
              textTransform: 'uppercase',
              marginBottom: '0.25rem',
              margin: 0,
            }}>
              Project Proposal
            </h1>
            <p style={{ color: COLORS.muted, fontSize: '0.875rem', margin: 0 }}>
              Ref: {refNumber} &bull; {formattedDate}
            </p>
          </div>
        </header>

        <div style={{ padding: '3rem' }}>
          {/* ── 01. Overview ── */}
          {clientPrd && (
            <section style={{ marginBottom: '4rem' }}>
              <SectionDivider number={sectionNumbers.overview} label="Overview" />
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.875rem', fontWeight: 600, marginBottom: '1rem', color: COLORS.charcoal, margin: '0 0 1rem 0' }}>
                    {title}
                  </h3>
                  <div>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {clientPrd}
                    </ReactMarkdown>
                  </div>
                </div>
                <div style={{
                  background: COLORS.cream,
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${COLORS.honey}1A`,
                  alignSelf: 'start',
                }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0' }}>
                    Prepared For
                  </h4>
                  <p style={{ color: COLORS.charcoal, fontWeight: 500, margin: '0 0 0.25rem 0' }}>{clientName}</p>
                  <p style={{ fontSize: '0.875rem', color: COLORS.muted, margin: '1rem 0 0 0' }}>Project: {title}</p>
                </div>
              </div>
            </section>
          )}

          {/* ── 02. Deliverables ── */}
          {quoteData && (
            <section style={{ marginBottom: '4rem' }}>
              <SectionDivider number={sectionNumbers.deliverables} label="Deliverables" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {quoteData.lineItems.map((item, i) => (
                  <div key={i} style={{
                    border: `1px solid ${COLORS.border}`,
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                  }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      background: COLORS.cream,
                      borderRadius: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                    }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: COLORS.honey }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h4 style={{ fontWeight: 700, color: COLORS.charcoal, marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>{item.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: COLORS.muted, margin: 0, lineHeight: 1.6 }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── 03. Timeline ── */}
          {phases.length > 0 && (
            <section className="print-section" style={{ marginBottom: '4rem' }}>
              <SectionDivider number={sectionNumbers.timeline} label="Project Timeline" />
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  background: COLORS.border,
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  {phases.map((phase, i) => {
                    const isEven = i % 2 === 0;
                    const dotColor = isEven ? COLORS.honey : COLORS.charcoal;
                    return (
                      <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        {isEven ? (
                          <>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: '3rem' }}>
                              <h4 style={{ fontWeight: 700, color: COLORS.charcoal, margin: '0 0 0.25rem 0' }}>{phase.phase}</h4>
                              <p style={{ fontSize: '0.875rem', color: COLORS.muted, margin: 0 }}>{phase.description}</p>
                            </div>
                            <div style={{
                              position: 'absolute',
                              left: '50%',
                              width: '1rem',
                              height: '1rem',
                              background: dotColor,
                              borderRadius: '50%',
                              transform: 'translateX(-50%)',
                              border: `4px solid ${COLORS.white}`,
                              boxSizing: 'content-box',
                            }} />
                            <div style={{ flex: 1, paddingLeft: '3rem' }}>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: COLORS.honey,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                background: COLORS.cream,
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                              }}>
                                {phaseWeekRanges[i]}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: '3rem' }}>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: COLORS.honey,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                background: COLORS.cream,
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                              }}>
                                {phaseWeekRanges[i]}
                              </span>
                            </div>
                            <div style={{
                              position: 'absolute',
                              left: '50%',
                              width: '1rem',
                              height: '1rem',
                              background: dotColor,
                              borderRadius: '50%',
                              transform: 'translateX(-50%)',
                              border: `4px solid ${COLORS.white}`,
                              boxSizing: 'content-box',
                            }} />
                            <div style={{ flex: 1, paddingLeft: '3rem' }}>
                              <h4 style={{ fontWeight: 700, color: COLORS.charcoal, margin: '0 0 0.25rem 0' }}>{phase.phase}</h4>
                              <p style={{ fontSize: '0.875rem', color: COLORS.muted, margin: 0 }}>{phase.description}</p>
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
            <section className="print-section" style={{ marginBottom: '4rem' }}>
              <SectionDivider number={sectionNumbers.investment} label="Investment" />
              <div style={{ overflow: 'hidden', border: `1px solid ${COLORS.border}`, borderRadius: '0.5rem' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: COLORS.cream, borderBottom: `1px solid ${COLORS.border}` }}>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: COLORS.charcoal, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Description
                      </th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: COLORS.charcoal, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteData.lineItems.map((item, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ fontWeight: 500, color: COLORS.charcoal }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: COLORS.muted }}>{item.description}</div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 500 }}>
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: COLORS.charcoal, color: COLORS.white }}>
                      <td style={{ padding: '1.5rem', fontSize: '1.125rem', fontWeight: 700 }}>Total Project Estimate</td>
                      <td style={{ padding: '1.5rem', textAlign: 'right', fontSize: '1.5rem', fontWeight: 700, color: COLORS.honey }}>
                        {formatCurrency(totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          )}

          {/* ── Terms & Conditions ── */}
          <section style={{ paddingTop: '2rem', borderTop: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div>
                <h4 style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: COLORS.honey,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '1rem',
                  margin: '0 0 1rem 0',
                }}>
                  Terms &amp; Conditions
                </h4>
                <div style={{ fontSize: '10px', color: COLORS.muted, textTransform: 'uppercase', lineHeight: 1.6 }}>
                  <p style={{ marginBottom: '0.5rem' }}>1. Payment: 30% Deposit required to begin, 40% at Mid-point milestone, 30% upon final delivery.</p>
                  <p style={{ marginBottom: '0.5rem' }}>2. Validity: This quotation is valid for 30 days from the date of issue.</p>
                  <p style={{ marginBottom: '0.5rem' }}>3. Intellectual Property: All custom code becomes the property of the client upon final payment.</p>
                  <p style={{ marginBottom: '0.5rem' }}>4. Scope Change: Any additions to the scope listed above will be billed at $150/hr.</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: '0.75rem',
                    color: COLORS.muted,
                    marginBottom: '1.5rem',
                    fontFamily: FONTS.serif,
                    fontStyle: 'italic',
                    margin: '0 0 1.5rem 0',
                  }}>
                    Signature indicates acceptance of this proposal.
                  </p>
                  <div style={{ width: '16rem', height: '1px', background: COLORS.charcoal, marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: COLORS.charcoal, margin: 0 }}>
                    Authorized Client Signature
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── Footer ── */}
        <footer style={{
          background: `${COLORS.cream}80`,
          padding: '2rem',
          borderTop: `1px solid ${COLORS.border}`,
          textAlign: 'center',
        }}>
          <p style={{ color: COLORS.muted, fontSize: '0.75rem', margin: 0 }}>
            HomeBaked &bull; hello@homebaked.dev
          </p>
        </footer>
      </div>
    </div>
  );
}
