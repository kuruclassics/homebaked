'use client';

import { AlertTriangle } from 'lucide-react';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <AlertTriangle className="w-12 h-12 text-honey mb-4" />
      <h2 className="text-xl font-bold text-charcoal mb-2">Something went wrong</h2>
      <p className="text-warm-gray mb-6 max-w-md text-sm">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-2.5 rounded-xl bg-charcoal text-cream text-sm font-medium hover:bg-charcoal-light transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
