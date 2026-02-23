'use client';

import { Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface TimeEntry {
  id: number;
  date: string;
  hours: number;
  source: string;
  notes: string | null;
  sessionId: string | null;
}

interface TimeEntryTableProps {
  entries: TimeEntry[];
  onDelete: (id: number) => void;
}

export default function TimeEntryTable({ entries, onDelete }: TimeEntryTableProps) {
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-warm-gray">
          {entries.length} entries — <span className="font-semibold text-charcoal">{totalHours.toFixed(1)}h</span> total
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-cream-dark bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-dark">
              <th className="text-left px-4 py-3 text-xs font-semibold text-warm-gray uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-warm-gray uppercase">Hours</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-warm-gray uppercase">Source</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-warm-gray uppercase">Notes</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-warm-gray">No time entries yet</td></tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="border-b border-cream-dark last:border-0">
                  <td className="px-4 py-3 text-charcoal">{entry.date}</td>
                  <td className="px-4 py-3 font-medium text-charcoal">{entry.hours}h</td>
                  <td className="px-4 py-3"><StatusBadge status={entry.source} /></td>
                  <td className="px-4 py-3 text-warm-gray max-w-xs truncate">{entry.notes ?? '—'}</td>
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
