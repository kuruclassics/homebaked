'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Trash2, ChevronDown } from 'lucide-react';
import DataTable, { Column } from '@/components/dashboard/DataTable';
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

const STATUSES = ['new', 'contacted', 'qualified', 'converted', 'closed'];

function StatusDropdown({ lead, onUpdate }: { lead: Lead; onUpdate: () => void }) {
  const [open, setOpen] = useState(false);

  async function changeStatus(status: string) {
    await fetch(`/api/dashboard/leads/${lead.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, status }),
    });
    setOpen(false);
    onUpdate();
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="flex items-center gap-1"
      >
        <StatusBadge status={lead.status} />
        <ChevronDown className="w-3 h-3 text-warm-gray" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
          <div className="absolute top-full left-0 mt-1 z-20 bg-white rounded-xl border border-cream-dark shadow-lg py-1 min-w-[140px]">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={(e) => { e.stopPropagation(); changeStatus(s); }}
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
  );
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');

  const fetchLeads = useCallback(async () => {
    const res = await fetch('/api/dashboard/leads');
    if (!res.ok) return;
    setLeads(await res.json());
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const filtered = leads.filter((l) =>
    [l.name, l.email, l.message].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  async function handleDelete(id: number) {
    if (!confirm('Delete this lead?')) return;
    await fetch(`/api/dashboard/leads/${id}`, { method: 'DELETE' });
    fetchLeads();
  }

  const columns: Column<Lead>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'message',
      label: 'Message',
      render: (row) => (
        <span className="text-warm-gray truncate block max-w-[200px]" title={row.message}>
          {row.message.length > 60 ? row.message.slice(0, 60) + '...' : row.message}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusDropdown lead={row} onUpdate={fetchLeads} />,
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
          className="p-1.5 rounded-lg hover:bg-red-50 text-warm-gray hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-charcoal" style={{ fontFamily: 'var(--font-serif)' }}>
          Leads
        </h1>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-light" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark bg-white text-sm text-charcoal placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-honey/30 focus:border-honey transition-all"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => router.push(`/dashboard/leads/${row.id}`)}
      />
    </div>
  );
}
