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
  honeyLight: '#E8A435',
  charcoal: '#1E1E2A',
  cream: '#F7F5F2',
  creamDark: '#EDE9E3',
  warmGray: '#6B6B7B',
  warmGrayLight: '#9494A0',
  white: '#FFFFFF',
};

const FONTS = {
  sans: "'Inter', system-ui, -apple-system, sans-serif",
  serif: "'Playfair Display', Georgia, serif",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '1rem', borderLeft: `3px solid ${COLORS.honey}` }}>
        <span style={{ fontFamily: FONTS.serif, fontSize: '1rem', fontWeight: 700, color: COLORS.honey, letterSpacing: '0.05em' }}>
          {number}
        </span>
        <h2 style={{ fontFamily: FONTS.serif, fontSize: '1.75rem', fontWeight: 700, color: COLORS.charcoal, margin: 0 }}>
          {title}
        </h2>
      </div>
      <div style={{ height: '1px', background: COLORS.creamDark, marginTop: '1rem' }} />
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
    <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: COLORS.charcoal, marginBottom: '0.75rem' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: COLORS.charcoal, marginBottom: '0.25rem' }}>{children}</li>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: 600, color: COLORS.charcoal }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ fontStyle: 'italic', color: COLORS.warmGray }}>{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: `3px solid ${COLORS.honey}`, paddingLeft: '1rem', margin: '1rem 0', color: COLORS.warmGray }}>{children}</blockquote>
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
    if (timeline) {
      phases = JSON.parse(timeline);
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

  // Dynamic section numbering — only count sections that have data
  const sections: { key: string; number: string }[] = [];
  let sectionIndex = 0;
  if (clientPrd) {
    sectionIndex++;
    sections.push({ key: 'overview', number: String(sectionIndex).padStart(2, '0') });
  }
  if (phases.length > 0) {
    sectionIndex++;
    sections.push({ key: 'timeline', number: String(sectionIndex).padStart(2, '0') });
  }
  if (quoteData) {
    sectionIndex++;
    sections.push({ key: 'deliverables', number: String(sectionIndex).padStart(2, '0') });
    sectionIndex++;
    sections.push({ key: 'investment', number: String(sectionIndex).padStart(2, '0') });
  }

  const getNumber = (key: string) => sections.find(s => s.key === key)?.number ?? '00';

  return (
    <div style={{ fontFamily: FONTS.sans, color: COLORS.charcoal }}>
      {/* ── Cover Page ── */}
      <div
        className="print-cover"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '3rem 2rem',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="HomeBaked" style={{ height: '56px', marginBottom: '3rem' }} />

        <h1
          style={{
            fontFamily: FONTS.serif,
            fontSize: '2.75rem',
            fontWeight: 700,
            color: COLORS.charcoal,
            lineHeight: 1.15,
            marginBottom: '1.75rem',
            maxWidth: '600px',
          }}
        >
          {title}
        </h1>

        <div style={{ width: '80px', height: '3px', background: COLORS.honey, margin: '0 auto 1.75rem' }} />

        <p style={{ fontSize: '1.125rem', color: COLORS.warmGray, marginBottom: '0.5rem' }}>
          Prepared for <span style={{ fontWeight: 600, color: COLORS.charcoal }}>{clientName}</span>
        </p>
        <p style={{ fontSize: '0.9rem', color: COLORS.warmGrayLight }}>{formattedDate}</p>

        <p
          style={{
            marginTop: 'auto',
            fontSize: '0.8rem',
            color: COLORS.warmGrayLight,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Confidential &mdash; Prepared by HomeBaked
        </p>
      </div>

      {/* ── Section: Project Overview ── */}
      {clientPrd && (
        <div className="print-section" style={{ padding: '2.5rem 0' }}>
          <SectionHeader number={getNumber('overview')} title="Project Overview" />
          <div className="print-prose" style={{ color: COLORS.charcoal }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {clientPrd}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* ── Section: Project Timeline ── */}
      {phases.length > 0 && (
        <div className="print-section" style={{ padding: '2.5rem 0' }}>
          <SectionHeader number={getNumber('timeline')} title="Project Timeline" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {phases.map((phase, i) => (
              <div
                key={i}
                className="print-no-break"
                style={{
                  padding: '1.25rem 1.5rem',
                  border: `1px solid ${COLORS.creamDark}`,
                  borderLeft: `4px solid ${COLORS.honey}`,
                  borderRadius: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.625rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: COLORS.honey,
                        color: COLORS.white,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <h3 style={{ fontWeight: 600, color: COLORS.charcoal, fontSize: '1.05rem', margin: 0 }}>{phase.phase}</h3>
                  </div>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: COLORS.honey,
                      background: `${COLORS.honey}14`,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {phase.weeks} week{phase.weeks !== 1 ? 's' : ''}
                  </span>
                </div>

                <p style={{ fontSize: '0.9rem', color: COLORS.warmGray, lineHeight: 1.6, margin: 0, marginBottom: phase.milestones.length > 0 ? '0.875rem' : 0 }}>
                  {phase.description}
                </p>

                {phase.milestones.length > 0 && (
                  <div style={{ borderTop: `1px solid ${COLORS.creamDark}`, paddingTop: '0.75rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.warmGrayLight, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                      Milestones
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                      {phase.milestones.map((m, j) => (
                        <li key={j} style={{ fontSize: '0.85rem', color: COLORS.warmGray, marginBottom: '0.25rem', lineHeight: 1.5 }}>
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

      {/* ── Section: Project Deliverables ── */}
      {quoteData && (
        <div className="print-section" style={{ padding: '2.5rem 0' }}>
          <SectionHeader number={getNumber('deliverables')} title="Project Deliverables" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {quoteData.lineItems.map((item, i) => (
              <div key={i} className="print-no-break" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: FONTS.serif,
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: COLORS.creamDark,
                    flexShrink: 0,
                    width: '2rem',
                    textAlign: 'right',
                    lineHeight: 1.4,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: COLORS.charcoal, fontSize: '1rem', margin: 0, marginBottom: '0.25rem' }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: COLORS.warmGray, lineHeight: 1.6, margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section: Investment ── */}
      {quoteData && (
        <div className="print-section" style={{ padding: '2.5rem 0' }}>
          <SectionHeader number={getNumber('investment')} title="Investment" />
          <table className="print-table-together" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.charcoal }}>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: COLORS.white, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Item
                </th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: COLORS.white, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Description
                </th>
                <th style={{ textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: COLORS.white, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {quoteData.lineItems.map((item, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.creamDark}` }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 500, color: COLORS.charcoal, verticalAlign: 'top' }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: COLORS.warmGray, verticalAlign: 'top', lineHeight: 1.5 }}>
                    {item.description}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right', fontWeight: 500, color: COLORS.charcoal, whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: COLORS.charcoal }}>
                <td colSpan={2} style={{ padding: '0.875rem 1rem', fontWeight: 600, color: COLORS.white, fontSize: '1rem' }}>
                  Total Investment
                </td>
                <td style={{ padding: '0.875rem 1rem', textAlign: 'right', fontWeight: 700, color: COLORS.honey, fontSize: '1.25rem' }}>
                  {formatCurrency(totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
          {quoteData.notes && (
            <p style={{ fontSize: '0.85rem', color: COLORS.warmGray, marginTop: '1.25rem', fontStyle: 'italic', lineHeight: 1.6 }}>
              {quoteData.notes}
            </p>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <div
        style={{
          textAlign: 'center',
          paddingTop: '2rem',
          borderTop: `1px solid ${COLORS.creamDark}`,
          marginTop: '3rem',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="HomeBaked" style={{ height: '24px', marginBottom: '0.75rem', opacity: 0.5 }} />
        <p style={{ fontSize: '0.8rem', color: COLORS.warmGrayLight }}>
          Prepared by <span style={{ fontWeight: 600, color: COLORS.honey }}>HomeBaked</span>
        </p>
      </div>
    </div>
  );
}
