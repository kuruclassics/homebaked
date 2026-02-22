'use client';

import { useState, useEffect } from 'react';

interface ProjectData {
  id?: number;
  name: string;
  description: string;
  clientId: number | null;
  type: string;
  stage: string;
  githubRepoUrl: string;
  hourlyRate: number | null;
  fixedPrice: number | null;
}

interface ClientOption {
  id: number;
  name: string;
}

interface ProjectFormProps {
  initial?: ProjectData;
  clients: ClientOption[];
  onSubmit: (data: ProjectData) => Promise<void>;
  loading?: boolean;
}

const STAGES = ['lead', 'proposal', 'active', 'paused', 'completed', 'maintenance'];

const emptyProject: ProjectData = {
  name: '', description: '', clientId: null, type: 'client_project', stage: 'lead',
  githubRepoUrl: '', hourlyRate: null, fixedPrice: null,
};

export default function ProjectForm({ initial, clients, onSubmit, loading }: ProjectFormProps) {
  const [data, setData] = useState<ProjectData>(initial ?? emptyProject);

  useEffect(() => {
    if (initial) setData(initial);
  }, [initial]);

  function set<K extends keyof ProjectData>(field: K, value: ProjectData[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(data);
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-cream-dark bg-cream/30 text-charcoal placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-honey/30 focus:border-honey transition-all text-sm';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">Project Name *</label>
        <input required value={data.name} onChange={(e) => set('name', e.target.value)} className={inputClass} placeholder="My Project" />
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
        <textarea value={data.description} onChange={(e) => set('description', e.target.value)} className={`${inputClass} resize-none`} rows={2} placeholder="Brief description..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Client</label>
          <select value={data.clientId ?? ''} onChange={(e) => set('clientId', e.target.value ? Number(e.target.value) : null)} className={inputClass}>
            <option value="">No client</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Type</label>
          <select value={data.type} onChange={(e) => set('type', e.target.value)} className={inputClass}>
            <option value="client_project">Client Project</option>
            <option value="public_product">Public Product</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">Stage</label>
        <select value={data.stage} onChange={(e) => set('stage', e.target.value)} className={inputClass}>
          {STAGES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">GitHub Repo URL</label>
        <input value={data.githubRepoUrl} onChange={(e) => set('githubRepoUrl', e.target.value)} className={inputClass} placeholder="https://github.com/owner/repo" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Hourly Rate ($)</label>
          <input type="number" step="0.01" value={data.hourlyRate ?? ''} onChange={(e) => set('hourlyRate', e.target.value ? Number(e.target.value) : null)} className={inputClass} placeholder="150.00" />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Fixed Price ($)</label>
          <input type="number" step="0.01" value={data.fixedPrice ?? ''} onChange={(e) => set('fixedPrice', e.target.value ? Number(e.target.value) : null)} className={inputClass} placeholder="5000.00" />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading || !data.name}
        className="w-full py-2.5 rounded-xl bg-charcoal text-cream font-medium hover:bg-charcoal-light transition-colors disabled:opacity-50 text-sm"
      >
        {loading ? 'Saving...' : initial?.id ? 'Update Project' : 'Create Project'}
      </button>
    </form>
  );
}
