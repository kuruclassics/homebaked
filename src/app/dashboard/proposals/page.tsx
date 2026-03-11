'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import Modal from '@/components/dashboard/Modal';

interface Proposal {
  id: number;
  leadId: number;
  slug: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  leadName: string | null;
  leadEmail: string | null;
}

export default function ProposalsPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [creating, setCreating] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectTitle, setProjectTitle] = useState('');

  const fetchProposals = useCallback(async () => {
    const res = await fetch('/api/dashboard/proposals');
    if (!res.ok) return;
    setProposals(await res.json());
  }, []);

  useEffect(() => { fetchProposals(); }, [fetchProposals]);

  const filtered = proposals.filter((p) =>
    [p.title, p.leadName, p.leadEmail].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  async function handleCreate() {
    if (!clientName.trim() || !projectTitle.trim()) return;
    setCreating(true);

    // Create a lead first
    const leadRes = await fetch('/api/dashboard/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: clientName.trim(),
        email: clientEmail.trim() || `${clientName.trim().toLowerCase().replace(/\s+/g, '.')}@manual`,
        message: `Manual proposal: ${projectTitle.trim()}`,
        status: 'qualified',
      }),
    });

    if (!leadRes.ok) { setCreating(false); return; }
    const lead = await leadRes.json();

    // Create the proposal
    const propRes = await fetch('/api/dashboard/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId: lead.id, title: projectTitle.trim() }),
    });

    if (propRes.ok) {
      const proposal = await propRes.json();
      router.push(`/dashboard/leads/${lead.id}/scope/${proposal.id}`);
    }
    setCreating(false);
  }

  const columns: Column<Proposal>[] = [
    { key: 'title', label: 'Title', sortable: true },
    {
      key: 'leadName',
      label: 'Client',
      sortable: true,
      render: (row) => <span className="text-warm-gray">{row.leadName || '—'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      sortable: true,
      render: (row) => new Date(row.updatedAt).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-charcoal" style={{ fontFamily: 'var(--font-serif)' }}>
          Proposals
        </h1>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-honey text-white text-sm font-medium hover:bg-honey-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Proposal
        </button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-light" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposals..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark bg-white text-sm text-charcoal placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-honey/30 focus:border-honey transition-all"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => router.push(`/dashboard/leads/${row.leadId}/scope/${row.id}`)}
      />

      <Modal open={showNew} onClose={() => setShowNew(false)} title="New Proposal">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Client Name *</label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="John Smith"
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-cream-dark bg-white text-sm text-charcoal placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-honey/30 focus:border-honey transition-all"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Client Email</label>
            <input
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="john@example.com (optional)"
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-cream-dark bg-white text-sm text-charcoal placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-honey/30 focus:border-honey transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Project Title *</label>
            <input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="E-commerce Platform Redesign"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-cream-dark bg-white text-sm text-charcoal placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-honey/30 focus:border-honey transition-all"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={creating || !clientName.trim() || !projectTitle.trim()}
            className="w-full px-4 py-2.5 rounded-xl bg-honey text-white text-sm font-medium hover:bg-honey-dark transition-colors disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Start Scoping'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
