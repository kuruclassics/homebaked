'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, RotateCcw, Save } from 'lucide-react';
import Link from 'next/link';

interface Phase {
  phase: string;
  description: string;
  weeks: number;
  milestones: string[];
}

interface LineItem {
  name: string;
  description: string;
  amount: number;
}

interface OngoingSupport {
  monthlyRetainerAmount: number;
  hourlyRate: number;
}

interface Quote {
  lineItems: LineItem[];
  notes: string;
  ongoingSupport?: OngoingSupport;
}

export default function ProposalEditPage() {
  const { id: leadId, proposalId } = useParams<{ id: string; proposalId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // AI-generated originals
  const [aiTimeline, setAiTimeline] = useState<Phase[] | null>(null);
  const [aiQuote, setAiQuote] = useState<Quote | null>(null);

  // Editable versions
  const [timeline, setTimeline] = useState<Phase[]>([]);
  const [quote, setQuote] = useState<Quote>({ lineItems: [], notes: '' });

  const fetchProposal = useCallback(async () => {
    const res = await fetch(`/api/dashboard/proposals/${proposalId}`);
    if (!res.ok) return;
    const data = await res.json();

    // Parse AI originals
    const parsedTimeline = data.timeline ? JSON.parse(data.timeline) : null;
    const parsedQuote = data.quote ? JSON.parse(data.quote) : null;
    setAiTimeline(parsedTimeline);
    setAiQuote(parsedQuote);

    // Use overrides if they exist, otherwise use AI versions
    const overrideTimeline = data.clientTimelineOverride ? JSON.parse(data.clientTimelineOverride) : null;
    const overrideQuote = data.clientQuoteOverride ? JSON.parse(data.clientQuoteOverride) : null;

    setTimeline(overrideTimeline || parsedTimeline || []);
    setQuote(overrideQuote || parsedQuote || { lineItems: [], notes: '' });
    setLoading(false);
  }, [proposalId]);

  useEffect(() => { fetchProposal(); }, [fetchProposal]);

  async function handleSave() {
    setSaving(true);
    // Omit ongoingSupport if both values are 0 or empty
    const quoteToSave = { ...quote };
    if (quoteToSave.ongoingSupport &&
        !quoteToSave.ongoingSupport.monthlyRetainerAmount &&
        !quoteToSave.ongoingSupport.hourlyRate) {
      delete quoteToSave.ongoingSupport;
    }
    const res = await fetch(`/api/dashboard/proposals/${proposalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientTimelineOverride: JSON.stringify(timeline),
        clientQuoteOverride: JSON.stringify(quoteToSave),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      alert('Failed to save changes. Please try again.');
      return;
    }
    // Bust the Next.js router cache so the scope page re-fetches fresh data
    router.refresh();
    router.push(`/dashboard/leads/${leadId}/scope/${proposalId}`);
  }

  function resetTimeline() {
    if (aiTimeline) setTimeline([...aiTimeline.map(p => ({ ...p, milestones: [...p.milestones] }))]);
  }

  function resetQuote() {
    if (aiQuote) setQuote({
      lineItems: aiQuote.lineItems.map(i => ({ ...i })),
      notes: aiQuote.notes,
      ongoingSupport: aiQuote.ongoingSupport ? { ...aiQuote.ongoingSupport } : undefined,
    });
  }

  // Timeline helpers
  function updatePhase(index: number, updates: Partial<Phase>) {
    setTimeline(prev => prev.map((p, i) => i === index ? { ...p, ...updates } : p));
  }

  function addPhase() {
    setTimeline(prev => [...prev, { phase: 'New Phase', description: '', weeks: 1, milestones: [] }]);
  }

  function removePhase(index: number) {
    setTimeline(prev => prev.filter((_, i) => i !== index));
  }

  function addMilestone(phaseIndex: number) {
    setTimeline(prev => prev.map((p, i) =>
      i === phaseIndex ? { ...p, milestones: [...p.milestones, ''] } : p
    ));
  }

  function updateMilestone(phaseIndex: number, milestoneIndex: number, value: string) {
    setTimeline(prev => prev.map((p, i) =>
      i === phaseIndex ? { ...p, milestones: p.milestones.map((m, j) => j === milestoneIndex ? value : m) } : p
    ));
  }

  function removeMilestone(phaseIndex: number, milestoneIndex: number) {
    setTimeline(prev => prev.map((p, i) =>
      i === phaseIndex ? { ...p, milestones: p.milestones.filter((_, j) => j !== milestoneIndex) } : p
    ));
  }

  // Quote helpers
  function updateLineItem(index: number, updates: Partial<LineItem>) {
    setQuote(prev => ({
      ...prev,
      lineItems: prev.lineItems.map((item, i) => i === index ? { ...item, ...updates } : item),
    }));
  }

  function addLineItem() {
    setQuote(prev => ({ ...prev, lineItems: [...prev.lineItems, { name: '', description: '', amount: 0 }] }));
  }

  function removeLineItem(index: number) {
    setQuote(prev => ({ ...prev, lineItems: prev.lineItems.filter((_, i) => i !== index) }));
  }

  const total = quote.lineItems.reduce((sum, item) => sum + item.amount, 0);
  const totalWeeks = timeline.reduce((sum, p) => sum + p.weeks, 0);

  if (loading) return <div className="animate-pulse text-warm-gray p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/dashboard/leads/${leadId}/scope/${proposalId}`}
          className="inline-flex items-center gap-1.5 text-sm text-warm-gray hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Scope
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-honey text-white text-sm font-medium hover:bg-honey-dark transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Timeline Editor */}
      <div className="bg-white rounded-2xl border border-cream-dark p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-charcoal">Timeline</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-warm-gray">Total: {totalWeeks} weeks</span>
            {aiTimeline && (
              <button onClick={resetTimeline} className="inline-flex items-center gap-1 text-xs text-warm-gray hover:text-honey transition-colors">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {timeline.map((phase, i) => (
            <div key={i} className="border border-cream-dark rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-1 space-y-2">
                  <input
                    value={phase.phase}
                    onChange={(e) => updatePhase(i, { phase: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-cream-dark text-sm font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-honey/30"
                    placeholder="Phase name"
                  />
                  <textarea
                    value={phase.description}
                    onChange={(e) => updatePhase(i, { description: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-cream-dark text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-honey/30 resize-none"
                    placeholder="Description"
                    rows={2}
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    value={phase.weeks}
                    onChange={(e) => updatePhase(i, { weeks: Number(e.target.value) })}
                    className="w-16 px-2 py-1.5 rounded-lg border border-cream-dark text-sm text-center text-charcoal focus:outline-none focus:ring-2 focus:ring-honey/30"
                    min={1}
                  />
                  <span className="text-xs text-warm-gray">wk</span>
                  <button onClick={() => removePhase(i)} className="p-1.5 text-warm-gray hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Milestones */}
              <div className="pl-2 space-y-1.5">
                {phase.milestones.map((m, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="text-xs text-warm-gray">-</span>
                    <input
                      value={m}
                      onChange={(e) => updateMilestone(i, j, e.target.value)}
                      className="flex-1 px-2 py-1 rounded-lg border border-cream-dark text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-honey/30"
                      placeholder="Milestone"
                    />
                    <button onClick={() => removeMilestone(i, j)} className="p-1 text-warm-gray hover:text-red-500">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addMilestone(i)}
                  className="text-xs text-honey hover:text-honey-dark transition-colors"
                >
                  + Add milestone
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addPhase}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-honey hover:text-honey-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Phase
        </button>
      </div>

      {/* Quote Editor */}
      <div className="bg-white rounded-2xl border border-cream-dark p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-charcoal">Quote</h2>
          <div className="flex items-center gap-3">
            {aiQuote && (
              <button onClick={resetQuote} className="inline-flex items-center gap-1 text-xs text-warm-gray hover:text-honey transition-colors">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
            <button
              onClick={async () => {
                if (!confirm('This will remove your manual edits and allow AI to regenerate the quote. Continue?')) return;
                await fetch(`/api/dashboard/proposals/${proposalId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ clientQuoteOverride: null }),
                });
                router.refresh();
                router.push(`/dashboard/leads/${leadId}/scope/${proposalId}`);
              }}
              className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Discard manual edits
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {quote.lineItems.map((item, i) => (
            <div key={i} className="flex items-start gap-3 border border-cream-dark rounded-xl p-3">
              <div className="flex-1 space-y-2">
                <input
                  value={item.name}
                  onChange={(e) => updateLineItem(i, { name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-cream-dark text-sm font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-honey/30"
                  placeholder="Line item name"
                />
                <input
                  value={item.description}
                  onChange={(e) => updateLineItem(i, { description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-cream-dark text-sm text-warm-gray focus:outline-none focus:ring-2 focus:ring-honey/30"
                  placeholder="Description"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-warm-gray">$</span>
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => { if (e.target.value !== '') updateLineItem(i, { amount: Number(e.target.value) }); }}
                  className={`w-24 px-2 py-1.5 rounded-lg border border-cream-dark text-sm text-right focus:outline-none focus:ring-2 focus:ring-honey/30 ${item.amount < 0 ? 'text-red-500' : 'text-charcoal'}`}
                />
                <button onClick={() => removeLineItem(i)} className="p-1.5 text-warm-gray hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addLineItem}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-honey hover:text-honey-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Line Item
        </button>

        <div className="mt-4 pt-4 border-t border-cream-dark flex items-center justify-between">
          <span className="text-sm font-semibold text-charcoal">Total</span>
          <span className="text-lg font-bold text-honey">${total.toLocaleString()}</span>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Notes & Assumptions</label>
          <textarea
            value={quote.notes}
            onChange={(e) => setQuote(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            placeholder="Add any assumptions, caveats, or notes..."
            className="w-full mt-2 px-3 py-2 rounded-xl border border-cream-dark text-sm text-charcoal placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-honey/30 resize-none"
          />
        </div>
      </div>

      {/* Ongoing Support Editor */}
      <div className="bg-white rounded-2xl border border-cream-dark p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-charcoal">Ongoing Support</h2>
          {quote.ongoingSupport && (
            <button
              onClick={() => setQuote(prev => {
                const { ongoingSupport: _, ...rest } = prev;
                return rest as Quote;
              })}
              className="inline-flex items-center gap-1 text-xs text-warm-gray hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          )}
        </div>

        {quote.ongoingSupport ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Monthly Retainer ($)</label>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-warm-gray">$</span>
                <input
                  type="number"
                  value={quote.ongoingSupport.monthlyRetainerAmount}
                  onChange={(e) => setQuote(prev => ({
                    ...prev,
                    ongoingSupport: { ...prev.ongoingSupport!, monthlyRetainerAmount: Number(e.target.value) },
                  }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-cream-dark text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-honey/30"
                  min={0}
                  placeholder="500"
                />
                <span className="text-xs text-warm-gray">/mo</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Hourly Rate ($)</label>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-warm-gray">$</span>
                <input
                  type="number"
                  value={quote.ongoingSupport.hourlyRate}
                  onChange={(e) => setQuote(prev => ({
                    ...prev,
                    ongoingSupport: { ...prev.ongoingSupport!, hourlyRate: Number(e.target.value) },
                  }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-cream-dark text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-honey/30"
                  min={0}
                  placeholder="150"
                />
                <span className="text-xs text-warm-gray">/hr</span>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setQuote(prev => ({
              ...prev,
              ongoingSupport: { monthlyRetainerAmount: 0, hourlyRate: 0 },
            }))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-honey hover:text-honey-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Ongoing Support
          </button>
        )}
      </div>
    </div>
  );
}
