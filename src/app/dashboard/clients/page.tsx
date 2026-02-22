'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Trash2, Pencil } from 'lucide-react';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import Modal from '@/components/dashboard/Modal';
import ClientForm from '@/components/dashboard/ClientForm';

interface Client {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchClients = useCallback(async () => {
    const res = await fetch('/api/dashboard/clients');
    setClients(await res.json());
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const filtered = clients.filter((c) =>
    [c.name, c.email, c.company].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSubmit(data: any) {
    setLoading(true);
    if (editing) {
      await fetch(`/api/dashboard/clients/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      await fetch('/api/dashboard/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
    setLoading(false);
    setModalOpen(false);
    setEditing(null);
    fetchClients();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this client?')) return;
    await fetch(`/api/dashboard/clients/${id}`, { method: 'DELETE' });
    fetchClients();
  }

  const columns: Column<Client>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'company', label: 'Company', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setEditing(row); setModalOpen(true); }}
            className="p-1.5 rounded-lg hover:bg-cream-dark text-warm-gray hover:text-charcoal transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-warm-gray hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-charcoal" style={{ fontFamily: 'var(--font-serif)' }}>
          Clients
        </h1>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-charcoal text-cream text-sm font-medium hover:bg-charcoal-light transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-light" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark bg-white text-sm text-charcoal placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-honey/30 focus:border-honey transition-all"
          />
        </div>
      </div>

      <DataTable columns={columns} data={filtered} />

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Edit Client' : 'New Client'}
      >
        <ClientForm
          initial={editing ? {
            id: editing.id,
            name: editing.name,
            email: editing.email ?? '',
            phone: editing.phone ?? '',
            company: editing.company ?? '',
            notes: editing.notes ?? '',
            status: editing.status,
          } : undefined}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
