'use client';

import { LayoutList, Kanban } from 'lucide-react';

interface ViewToggleProps {
  view: 'table' | 'board';
  onChange: (view: 'table' | 'board') => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-xl border border-cream-dark bg-white overflow-hidden">
      <button
        onClick={() => onChange('table')}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
          view === 'table' ? 'bg-charcoal text-cream' : 'text-warm-gray hover:text-charcoal'
        }`}
      >
        <LayoutList className="w-4 h-4" />
        Table
      </button>
      <button
        onClick={() => onChange('board')}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
          view === 'board' ? 'bg-charcoal text-cream' : 'text-warm-gray hover:text-charcoal'
        }`}
      >
        <Kanban className="w-4 h-4" />
        Board
      </button>
    </div>
  );
}
