'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Trash2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import Modal from '@/components/dashboard/Modal';
import ProjectForm from '@/components/dashboard/ProjectForm';
import ViewToggle from '@/components/dashboard/ViewToggle';
import KanbanBoard from '@/components/dashboard/KanbanBoard';

interface Project {
  id: number;
  name: string;
  description: string | null;
  clientId: number | null;
  clientName: string | null;
  type: string;
  stage: string;
  githubRepoUrl: string | null;
  hourlyRate: number | null;
  fixedPrice: number | null;
  createdAt: string;
}

interface ClientOption {
  id: number;
  name: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'table' | 'board'>('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchProjects = useCallback(async () => {
    const res = await fetch('/api/dashboard/projects');
    setProjects(await res.json());
  }, []);

  const fetchClients = useCallback(async () => {
    const res = await fetch('/api/dashboard/clients');
    const data = await res.json();
    setClientOptions(data.map((c: ClientOption) => ({ id: c.id, name: c.name })));
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, [fetchProjects, fetchClients]);

  const filtered = projects.filter((p) =>
    [p.name, p.clientName, p.description].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSubmit(data: any) {
    setLoading(true);
    if (editing) {
      await fetch(`/api/dashboard/projects/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      await fetch('/api/dashboard/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
    setLoading(false);
    setModalOpen(false);
    setEditing(null);
    fetchProjects();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/dashboard/projects/${id}`, { method: 'DELETE' });
    fetchProjects();
  }

  const columns: Column<Project>[] = [
    { key: 'name', label: 'Project', sortable: true },
    { key: 'clientName', label: 'Client', sortable: true },
    { key: 'stage', label: 'Stage', render: (row) => <StatusBadge status={row.stage} /> },
    { key: 'type', label: 'Type', render: (row) => (
      <span className="text-xs text-warm-gray">{row.type === 'public_product' ? 'Product' : 'Client'}</span>
    )},
    { key: 'hourlyRate', label: 'Rate', render: (row) => (
      <span className="text-sm">{row.hourlyRate ? `$${row.hourlyRate}/hr` : row.fixedPrice ? `$${row.fixedPrice.toLocaleString()} fixed` : '—'}</span>
    )},
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
          Projects
        </h1>
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onChange={setView} />
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-charcoal text-cream text-sm font-medium hover:bg-charcoal-light transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-light" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark bg-white text-sm text-charcoal placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-honey/30 focus:border-honey transition-all"
          />
        </div>
      </div>

      {view === 'table' ? (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) => router.push(`/dashboard/projects/${row.id}`)}
        />
      ) : (
        <KanbanBoard projects={filtered} />
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Edit Project' : 'New Project'}
      >
        <ProjectForm
          clients={clientOptions}
          initial={editing ? {
            id: editing.id,
            name: editing.name,
            description: editing.description ?? '',
            clientId: editing.clientId,
            type: editing.type,
            stage: editing.stage,
            githubRepoUrl: editing.githubRepoUrl ?? '',
            hourlyRate: editing.hourlyRate,
            fixedPrice: editing.fixedPrice,
          } : undefined}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
