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
  ongoingSupport?: {
    monthlyRetainerAmount: number;
    hourlyRate: number;
  };
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

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 style={{ fontFamily: FONTS.serif, fontSize: '0.95rem', fontWeight: 700, color: COLORS.charcoal, marginTop: '0.6rem', marginBottom: '0.3rem' }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{ fontFamily: FONTS.serif, fontSize: '0.85rem', fontWeight: 700, color: COLORS.charcoal, marginTop: '0.5rem', marginBottom: '0.25rem' }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontFamily: FONTS.serif, fontSize: '0.8rem', fontWeight: 700, color: COLORS.charcoal, marginTop: '0.4rem', marginBottom: '0.2rem' }}>{children}</h3>
  ),
  p: ({ children }) => (
    <p style={{ fontSize: '0.75rem', lineHeight: 1.5, color: COLORS.muted, marginBottom: '0.35rem' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{ paddingLeft: '1rem', marginBottom: '0.35rem' }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ paddingLeft: '1rem', marginBottom: '0.35rem' }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ fontSize: '0.75rem', lineHeight: 1.5, color: COLORS.muted, marginBottom: '0.1rem' }}>{children}</li>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: 600, color: COLORS.charcoal }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ fontStyle: 'italic', color: COLORS.muted }}>{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: `2px solid ${COLORS.honey}`, paddingLeft: '0.5rem', margin: '0.4rem 0', color: COLORS.muted }}>{children}</blockquote>
  ),
  table: ({ children }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0.5rem', fontSize: '0.7rem' }}>{children}</table>
  ),
  th: ({ children }) => (
    <th style={{ textAlign: 'left', padding: '0.25rem 0.5rem', borderBottom: `2px solid ${COLORS.creamDark}`, fontWeight: 600, color: COLORS.charcoal, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{ padding: '0.25rem 0.5rem', borderBottom: `1px solid ${COLORS.creamDark}`, color: COLORS.charcoal }}>{children}</td>
  ),
  code: ({ children }) => (
    <code style={{ background: COLORS.cream, padding: '0.1rem 0.25rem', borderRadius: '2px', fontSize: '0.7em', fontFamily: 'monospace' }}>{children}</code>
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: `1px solid ${COLORS.creamDark}`, margin: '0.5rem 0' }} />
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
      quoteData!.lineItems = quoteData!.lineItems.filter(item => item.amount > 0);
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

        {/* ═══════════════════════════════════════════════
            PAGE 1 — Overview + Deliverables
        ═══════════════════════════════════════════════ */}
        <div className="print-cover">
          {/* Header */}
          <header style={{
            padding: '1.5rem 2rem',
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: `${COLORS.cream}4D`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '1.75rem',
                height: '1.75rem',
                background: COLORS.honey,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ width: '0.875rem', height: '0.875rem', background: COLORS.white, borderRadius: '50%', opacity: 0.5 }} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em', color: COLORS.charcoal }}>HomeBaked</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 300,
                letterSpacing: '-0.025em',
                color: COLORS.charcoal,
                textTransform: 'uppercase',
                margin: 0,
              }}>
                Project Proposal
              </h1>
              <p style={{ color: COLORS.muted, fontSize: '0.75rem', margin: 0 }}>
                Ref: {refNumber} &bull; {formattedDate}
              </p>
            </div>
          </header>

          <div style={{ padding: '1.5rem 2rem' }}>
            {/* Title + Prepared For — side by side compact */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: COLORS.charcoal, margin: 0, flex: 1 }}>
                {title}
              </h3>
              <div style={{
                background: COLORS.cream,
                padding: '0.6rem 1rem',
                borderRadius: '0.375rem',
                border: `1px solid ${COLORS.honey}1A`,
                marginLeft: '1.5rem',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: COLORS.muted }}>
                  Prepared For
                </span>
                <p style={{ color: COLORS.charcoal, fontWeight: 500, margin: '0.15rem 0 0 0', fontSize: '0.85rem' }}>{clientName}</p>
              </div>
            </div>

            {/* PRD Content — 2-column condensed */}
            {clientPrd && (
              <div style={{ columns: 2, columnGap: '1.5rem', marginBottom: '1.25rem' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {clientPrd}
                </ReactMarkdown>
              </div>
            )}

            {/* Deliverables Grid */}
            {quoteData && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ height: '1px', flex: 1, background: `${COLORS.honey}4D` }} />
                  <span style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: COLORS.honey,
                    textTransform: 'uppercase',
                  }}>
                    Deliverables
                  </span>
                  <span style={{ height: '1px', flex: 1, background: `${COLORS.honey}4D` }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {quoteData.lineItems.map((item, i) => (
                    <div key={i} style={{
                      border: `1px solid ${COLORS.border}`,
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                    }}>
                      <div style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        background: COLORS.cream,
                        borderRadius: '0.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.4rem',
                      }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: COLORS.honey }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h4 style={{ fontWeight: 700, color: COLORS.charcoal, fontSize: '0.8rem', margin: '0 0 0.2rem 0' }}>{item.name}</h4>
                      <p style={{ fontSize: '0.7rem', color: COLORS.muted, margin: 0, lineHeight: 1.4 }}>{item.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            PAGE 2 — Project Timeline
        ═══════════════════════════════════════════════ */}
        {phases.length > 0 && (
          <div className="print-section" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{ height: '1px', flex: 1, background: `${COLORS.honey}4D` }} />
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: COLORS.honey,
                textTransform: 'uppercase',
              }}>
                Project Timeline
              </span>
              <span style={{ height: '1px', flex: 1, background: `${COLORS.honey}4D` }} />
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: '2px',
                background: COLORS.border,
              }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {phases.map((phase, i) => {
                  const isEven = i % 2 === 0;
                  const dotColor = isEven ? COLORS.honey : COLORS.charcoal;
                  return (
                    <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      {isEven ? (
                        <>
                          <div style={{ flex: 1, textAlign: 'right', paddingRight: '2.5rem' }}>
                            <h4 style={{ fontWeight: 700, color: COLORS.charcoal, margin: '0 0 0.2rem 0', fontSize: '0.9rem' }}>{phase.phase}</h4>
                            <p style={{ fontSize: '0.8rem', color: COLORS.muted, margin: 0 }}>{phase.description}</p>
                            {phase.milestones && phase.milestones.length > 0 && (
                              <div style={{ marginTop: '0.4rem' }}>
                                {phase.milestones.map((m, mi) => (
                                  <span key={mi} style={{
                                    display: 'inline-block',
                                    fontSize: '0.6rem',
                                    color: COLORS.muted,
                                    background: COLORS.cream,
                                    padding: '0.1rem 0.35rem',
                                    borderRadius: '0.2rem',
                                    marginRight: '0.25rem',
                                    marginBottom: '0.15rem',
                                  }}>
                                    {m}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div style={{
                            position: 'absolute',
                            left: '50%',
                            width: '0.875rem',
                            height: '0.875rem',
                            background: dotColor,
                            borderRadius: '50%',
                            transform: 'translateX(-50%)',
                            border: `3px solid ${COLORS.white}`,
                            boxSizing: 'content-box',
                          }} />
                          <div style={{ flex: 1, paddingLeft: '2.5rem' }}>
                            <span style={{
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              color: COLORS.honey,
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              background: COLORS.cream,
                              padding: '0.2rem 0.4rem',
                              borderRadius: '0.2rem',
                            }}>
                              {phaseWeekRanges[i]}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ flex: 1, textAlign: 'right', paddingRight: '2.5rem' }}>
                            <span style={{
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              color: COLORS.honey,
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              background: COLORS.cream,
                              padding: '0.2rem 0.4rem',
                              borderRadius: '0.2rem',
                            }}>
                              {phaseWeekRanges[i]}
                            </span>
                          </div>
                          <div style={{
                            position: 'absolute',
                            left: '50%',
                            width: '0.875rem',
                            height: '0.875rem',
                            background: dotColor,
                            borderRadius: '50%',
                            transform: 'translateX(-50%)',
                            border: `3px solid ${COLORS.white}`,
                            boxSizing: 'content-box',
                          }} />
                          <div style={{ flex: 1, paddingLeft: '2.5rem' }}>
                            <h4 style={{ fontWeight: 700, color: COLORS.charcoal, margin: '0 0 0.2rem 0', fontSize: '0.9rem' }}>{phase.phase}</h4>
                            <p style={{ fontSize: '0.8rem', color: COLORS.muted, margin: 0 }}>{phase.description}</p>
                            {phase.milestones && phase.milestones.length > 0 && (
                              <div style={{ marginTop: '0.4rem' }}>
                                {phase.milestones.map((m, mi) => (
                                  <span key={mi} style={{
                                    display: 'inline-block',
                                    fontSize: '0.6rem',
                                    color: COLORS.muted,
                                    background: COLORS.cream,
                                    padding: '0.1rem 0.35rem',
                                    borderRadius: '0.2rem',
                                    marginRight: '0.25rem',
                                    marginBottom: '0.15rem',
                                  }}>
                                    {m}
                                  </span>
                                ))}
                              </div>
                            )}
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
            PAGE 3 — Investment + Support + Terms + Footer
        ═══════════════════════════════════════════════ */}
        {quoteData && (
          <div className="print-section" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ height: '1px', flex: 1, background: `${COLORS.honey}4D` }} />
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: COLORS.honey,
                textTransform: 'uppercase',
              }}>
                Investment
              </span>
              <span style={{ height: '1px', flex: 1, background: `${COLORS.honey}4D` }} />
            </div>

            {/* Investment Table */}
            <div style={{ overflow: 'hidden', border: `1px solid ${COLORS.border}`, borderRadius: '0.375rem', marginBottom: '1.5rem' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: COLORS.cream, borderBottom: `1px solid ${COLORS.border}` }}>
                    <th style={{ padding: '0.6rem 1rem', fontSize: '0.65rem', fontWeight: 700, color: COLORS.charcoal, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Description
                    </th>
                    <th style={{ padding: '0.6rem 1rem', fontSize: '0.65rem', fontWeight: 700, color: COLORS.charcoal, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quoteData.lineItems.map((item, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <td style={{ padding: '0.5rem 1rem' }}>
                        <div style={{ fontWeight: 500, color: COLORS.charcoal, fontSize: '0.85rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.7rem', color: COLORS.muted }}>{item.description}</div>
                      </td>
                      <td style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: 500, fontSize: '0.85rem' }}>
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: COLORS.charcoal, color: COLORS.white }}>
                    <td style={{ padding: '1rem', fontSize: '0.95rem', fontWeight: 700 }}>Total Project Estimate</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontSize: '1.25rem', fontWeight: 700, color: COLORS.honey }}>
                      {formatCurrency(totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Ongoing Support — inline below table, no section divider */}
            {quoteData.ongoingSupport && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  background: COLORS.cream,
                  borderRadius: '0.375rem',
                  borderTop: `3px solid ${COLORS.honey}4D`,
                  padding: '1rem',
                }}>
                  <p style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: COLORS.muted,
                    textTransform: 'uppercase',
                    margin: '0 0 0.5rem 0',
                  }}>
                    &#9790; Option 1
                  </p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 700, color: COLORS.honey, margin: '0 0 0.15rem 0' }}>
                    {formatCurrency(quoteData.ongoingSupport.monthlyRetainerAmount)}
                    <span style={{ fontSize: '0.8rem', fontWeight: 400, color: COLORS.muted }}>/mo</span>
                  </p>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.charcoal, margin: '0.4rem 0 0.15rem 0' }}>
                    Monthly Retainer
                  </p>
                  <p style={{ fontSize: '0.7rem', color: COLORS.muted, margin: 0 }}>
                    Full technical support, hosting &amp; database storage
                  </p>
                </div>
                <div style={{
                  background: COLORS.cream,
                  borderRadius: '0.375rem',
                  borderTop: `3px solid ${COLORS.charcoal}4D`,
                  padding: '1rem',
                }}>
                  <p style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: COLORS.muted,
                    textTransform: 'uppercase',
                    margin: '0 0 0.5rem 0',
                  }}>
                    &#9790; Option 2
                  </p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 700, color: COLORS.charcoal, margin: '0 0 0.15rem 0' }}>
                    {formatCurrency(quoteData.ongoingSupport.hourlyRate)}
                    <span style={{ fontSize: '0.8rem', fontWeight: 400, color: COLORS.muted }}>/hr</span>
                  </p>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.charcoal, margin: '0.4rem 0 0.15rem 0' }}>
                    Self-Hosted
                  </p>
                  <p style={{ fontSize: '0.7rem', color: COLORS.muted, margin: 0 }}>
                    Client-owned hosting, support billed hourly
                  </p>
                </div>
              </div>
            )}

            {/* Terms & Conditions + Signature */}
            <section style={{ paddingTop: '1rem', borderTop: `1px solid ${COLORS.border}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h4 style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: COLORS.honey,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    margin: '0 0 0.6rem 0',
                  }}>
                    Terms &amp; Conditions
                  </h4>
                  <div style={{ fontSize: '9px', color: COLORS.muted, textTransform: 'uppercase', lineHeight: 1.5 }}>
                    <p style={{ marginBottom: '0.3rem' }}>1. Payment: 30% Deposit required to begin, 40% at Mid-point milestone, 30% upon final delivery.</p>
                    <p style={{ marginBottom: '0.3rem' }}>2. Validity: This quotation is valid for 30 days from the date of issue.</p>
                    <p style={{ marginBottom: '0.3rem' }}>3. Intellectual Property: All custom code becomes the property of the client upon final payment.</p>
                    <p style={{ marginBottom: '0.3rem' }}>4. Scope Change: Any additions to the scope listed above will be billed at $150/hr.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontSize: '0.65rem',
                      color: COLORS.muted,
                      fontFamily: FONTS.serif,
                      fontStyle: 'italic',
                      margin: '0 0 1rem 0',
                    }}>
                      Signature indicates acceptance of this proposal.
                    </p>
                    <div style={{ width: '14rem', height: '1px', background: COLORS.charcoal, marginBottom: '0.35rem' }} />
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.charcoal, margin: 0 }}>
                      Authorized Client Signature
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Footer — last page only */}
        <footer style={{
          background: `${COLORS.cream}80`,
          padding: '1.25rem',
          borderTop: `1px solid ${COLORS.border}`,
          textAlign: 'center',
        }}>
          <p style={{ color: COLORS.muted, fontSize: '0.65rem', margin: 0 }}>
            HomeBaked &bull; hello@homebaked.dev
          </p>
        </footer>
      </div>
    </div>
  );
}
