'use client';

import { useState } from 'react';

interface TimeEntryFormProps {
  projectId: number;
  onSubmit: () => void;
}

export default function TimeEntryForm({ projectId, onSubmit }: TimeEntryFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/dashboard/time-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, date, hours: Number(hours), source: 'manual', notes }),
    });
    setLoading(false);
    setHours('');
    setNotes('');
    onSubmit();
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-cream-dark bg-cream/30 text-charcoal placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-honey/30 focus:border-honey transition-all text-sm';

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 p-4 bg-white rounded-xl border border-cream-dark">
      <div className="flex-1">
        <label className="block text-xs font-medium text-warm-gray mb-1">Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
      </div>
      <div className="w-24">
        <label className="block text-xs font-medium text-warm-gray mb-1">Hours</label>
        <input type="number" step="0.25" min="0.25" value={hours} onChange={(e) => setHours(e.target.value)} className={inputClass} placeholder="2.5" required />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-warm-gray mb-1">Notes</label>
        <input value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} placeholder="What did you work on?" />
      </div>
      <button
        type="submit"
        disabled={loading || !hours}
        className="px-4 py-2.5 rounded-xl bg-charcoal text-cream text-sm font-medium hover:bg-charcoal-light transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {loading ? 'Adding...' : 'Add Entry'}
      </button>
    </form>
  );
}
