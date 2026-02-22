'use client';

import { useState, useEffect } from 'react';

interface ClientData {
  id?: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  status: string;
}

interface ClientFormProps {
  initial?: ClientData;
  onSubmit: (data: ClientData) => Promise<void>;
  loading?: boolean;
}

const emptyClient: ClientData = {
  name: '', email: '', phone: '', company: '', notes: '', status: 'active',
};

export default function ClientForm({ initial, onSubmit, loading }: ClientFormProps) {
  const [data, setData] = useState<ClientData>(initial ?? emptyClient);

  useEffect(() => {
    if (initial) setData(initial);
  }, [initial]);

  function set(field: keyof ClientData, value: string) {
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
        <label className="block text-sm font-medium text-charcoal mb-1">Name *</label>
        <input required value={data.name} onChange={(e) => set('name', e.target.value)} className={inputClass} placeholder="Client name" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
          <input type="email" value={data.email} onChange={(e) => set('email', e.target.value)} className={inputClass} placeholder="email@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Phone</label>
          <input value={data.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} placeholder="(555) 123-4567" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">Company</label>
        <input value={data.company} onChange={(e) => set('company', e.target.value)} className={inputClass} placeholder="Company name" />
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">Status</label>
        <select value={data.status} onChange={(e) => set('status', e.target.value)} className={inputClass}>
          <option value="active">Active</option>
          <option value="lead">Lead</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">Notes</label>
        <textarea value={data.notes} onChange={(e) => set('notes', e.target.value)} className={`${inputClass} resize-none`} rows={3} placeholder="Any notes..." />
      </div>
      <button
        type="submit"
        disabled={loading || !data.name}
        className="w-full py-2.5 rounded-xl bg-charcoal text-cream font-medium hover:bg-charcoal-light transition-colors disabled:opacity-50 text-sm"
      >
        {loading ? 'Saving...' : initial?.id ? 'Update Client' : 'Create Client'}
      </button>
    </form>
  );
}
