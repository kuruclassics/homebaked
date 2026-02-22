'use client';

import { useState } from 'react';

interface FinancialEntryFormProps {
  projectId: number;
  onSubmit: () => void;
}

export default function FinancialEntryForm({ projectId, onSubmit }: FinancialEntryFormProps) {
  const [type, setType] = useState<'invoice' | 'payment'>('invoice');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState('pending');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/dashboard/financial-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, type, amount: Number(amount), date, reference, status, notes }),
    });
    setLoading(false);
    setAmount('');
    setReference('');
    setNotes('');
    onSubmit();
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-cream-dark bg-cream/30 text-charcoal placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-honey/30 focus:border-honey transition-all text-sm';

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-xl border border-cream-dark space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as 'invoice' | 'payment')} className={inputClass}>
            <option value="invoice">Invoice</option>
            <option value="payment">Payment</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1">Amount ($)</label>
          <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} placeholder="1000.00" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1">Reference</label>
          <input value={reference} onChange={(e) => setReference(e.target.value)} className={inputClass} placeholder="INV-001" />
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1">Notes</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} placeholder="Optional notes" />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading || !amount}
        className="px-4 py-2.5 rounded-xl bg-charcoal text-cream text-sm font-medium hover:bg-charcoal-light transition-colors disabled:opacity-50"
      >
        {loading ? 'Adding...' : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
      </button>
    </form>
  );
}
