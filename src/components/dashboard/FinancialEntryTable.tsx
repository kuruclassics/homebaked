'use client';

import { Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface FinancialEntry {
  id: number;
  type: string;
  amount: number;
  date: string;
  reference: string | null;
  status: string;
  notes: string | null;
}

interface FinancialEntryTableProps {
  entries: FinancialEntry[];
  onDelete: (id: number) => void;
}

export default function FinancialEntryTable({ entries, onDelete }: FinancialEntryTableProps) {
  const totalInvoiced = entries.filter((e) => e.type === 'invoice').reduce((s, e) => s + e.amount, 0);
  const totalPaid = entries.filter((e) => e.type === 'payment').reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <div className="flex items-center gap-6 mb-3">
        <p className="text-sm text-warm-gray">
          Invoiced: <span className="font-semibold text-charcoal">${totalInvoiced.toLocaleString()}</span>
        </p>
        <p className="text-sm text-warm-gray">
          Paid: <span className="font-semibold text-green-600">${totalPaid.toLocaleString()}</span>
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-cream-dark bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-dark">
              <th className="text-left px-4 py-3 text-xs font-semibold text-warm-gray uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-warm-gray uppercase">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-warm-gray uppercase">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-warm-gray uppercase">Reference</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-warm-gray uppercase">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-warm-gray">No financial entries yet</td></tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="border-b border-cream-dark last:border-0">
                  <td className="px-4 py-3 text-charcoal">{entry.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={entry.type} /></td>
                  <td className="px-4 py-3 font-medium text-charcoal">${entry.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-warm-gray">{entry.reference ?? '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={entry.status} /></td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-warm-gray hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
