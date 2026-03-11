'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, ExternalLink, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/dashboard/StatusBadge';

interface Lead {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

interface Proposal {
  id: number;
  title: string;
  status: string;
  slug: string;
  createdAt: string;
}

const STATUSES = ['new', 'contacted', 'qualified', 'converted', 'closed'];

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [notes, setNotes] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchLead = useCallback(async () => {
    const res = await fetch(`/api/dashboard/leads/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    setLead(data);
    setNotes(data.notes ?? '');
  }, [id]);

  const fetchProposals = useCallback(async () => {
    const res = await fetch('/api/dashboard/proposals');
    if (!res.ok) return;
    const all = await res.json();
    setProposals(all.filter((p: { leadId: number }) => p.leadId === Number(id)));
  }, [id]);

  useEffect(() => { fetchLead(); fetchProposals(); }, [fetchLead, fetchProposals]);

  async function updateNotes() {
    if (!lead || notes === (lead.notes ?? '')) return;
    await fetch(`/api/dashboard/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, notes }),
    });
    fetchLead();
  }

  async function changeStatus(status: string) {
    if (!lead) return;
    await fetch(`/api/dashboard/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, status }),
    });
    setStatusOpen(false);
    fetchLead();
  }

  async function startScoping() {
    if (!lead) return;
    setCreating(true);
    const res = await fetch('/api/dashboard/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId: lead.id, title: `${lead.name} — Project Proposal` }),
    });
    if (res.ok) {
      const proposal = await res.json();
      router.push(`/dashboard/leads/${id}/scope/${proposal.id}`);
    }
    setCreating(false);
  }

  if (!lead) return <div className="animate-pulse text-warm-gray p-8">Loading...</div>;

  return (
    <div>
      <Link href="/dashboard/leads" className="inline-flex items-center gap-1.5 text-sm text-warm-gray hover:text-charcoal transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Leads
      </Link>

      <div className="bg-white rounded-2xl border border-cream-dark p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: 'var(--font-serif)' }}>
              {lead.name}
            </h1>
            <a href={`mailto:${lead.email}`} className="text-sm text-honey hover:underline">
              {lead.email}
            </a>
          </div>
          <div className="relative">
            <button onClick={() => setStatusOpen(!statusOpen)} className="flex items-center gap-1">
              <StatusBadge status={lead.status} />
              <ChevronDown className="w-3 h-3 text-warm-gray" />
            </button>
            {statusOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
                <div className="absolute top-full right-0 mt-1 z-20 bg-white rounded-xl border border-cream-dark shadow-lg py-1 min-w-[140px]">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => changeStatus(s)}
                      className={`w-full text-left px-3 py-1.5 text-sm hover:bg-cream/50 transition-colors ${
                        s === lead.status ? 'font-semibold text-charcoal' : 'text-warm-gray'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-semibold text-warm-gray uppercase tracking-wider">What they want to build</label>
          <p className="text-charcoal mt-1 whitespace-pre-wrap">{lead.message}</p>
        </div>

        <div className="text-xs text-warm-gray">
          Received {new Date(lead.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-cream-dark p-6 mb-6">
        <label className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Internal Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={updateNotes}
          rows={3}
          placeholder="Add notes..."
          className="w-full mt-2 px-3 py-2 rounded-xl border border-cream-dark bg-white text-sm text-charcoal placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-honey/30 focus:border-honey transition-all resize-none"
        />
      </div>

      <div className="bg-white rounded-2xl border border-cream-dark p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-charcoal">Proposals</h2>
          <button
            onClick={startScoping}
            disabled={creating}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-honey text-white text-sm font-medium hover:bg-honey-dark transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {creating ? 'Creating...' : 'Start Scoping'}
          </button>
        </div>

        {proposals.length === 0 ? (
          <p className="text-sm text-warm-gray">No proposals yet. Click &quot;Start Scoping&quot; to begin.</p>
        ) : (
          <div className="space-y-3">
            {proposals.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/leads/${id}/scope/${p.id}`}
                className="flex items-center justify-between p-4 rounded-xl border border-cream-dark hover:border-honey/30 hover:bg-cream/30 transition-colors group"
              >
                <div>
                  <h3 className="text-sm font-medium text-charcoal group-hover:text-honey transition-colors">{p.title}</h3>
                  <p className="text-xs text-warm-gray mt-0.5">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  <ExternalLink className="w-4 h-4 text-warm-gray-light group-hover:text-honey transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
