'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

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

  const fetchProposals = useCallback(async () => {
    const res = await fetch('/api/dashboard/proposals');
    if (!res.ok) return;
    setProposals(await res.json());
  }, []);

  useEffect(() => { fetchProposals(); }, [fetchProposals]);

  const filtered = proposals.filter((p) =>
    [p.title, p.leadName, p.leadEmail].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const columns: Column<Proposal>[] = [
    { key: 'title', label: 'Title', sortable: true },
    {
      key: 'leadName',
      label: 'Lead',
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
    </div>
  );
}
