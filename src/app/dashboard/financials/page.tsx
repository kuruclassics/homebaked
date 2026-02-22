'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Clock, Receipt } from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import CostAnalysisTable from '@/components/dashboard/CostAnalysisTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

interface Stats {
  revenueMTD: number;
  totalRevenue: number;
  totalHours: number;
  effectiveRate: number;
  profitability: {
    id: number;
    name: string;
    stage: string;
    hours: number;
    revenue: number;
    effectiveRate: number;
  }[];
}

interface FinancialEntry {
  id: number;
  projectId: number;
  type: string;
  amount: number;
  date: string;
  reference: string | null;
  status: string;
  notes: string | null;
}

export default function FinancialsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentEntries, setRecentEntries] = useState<FinancialEntry[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/stats').then((r) => r.json()).then(setStats);
    fetch('/api/dashboard/financial-entries').then((r) => r.json()).then(setRecentEntries);
  }, []);

  if (!stats) return <div className="text-warm-gray">Loading...</div>;

  const pendingInvoices = recentEntries.filter((e) => e.type === 'invoice' && e.status === 'pending');
  const pendingTotal = pendingInvoices.reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-charcoal mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
        Financials
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon={DollarSign} label="Revenue (MTD)" value={`$${stats.revenueMTD.toLocaleString()}`} />
        <KpiCard icon={DollarSign} label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} />
        <KpiCard icon={TrendingUp} label="Eff. Rate" value={`$${stats.effectiveRate.toFixed(0)}/hr`} />
        <KpiCard icon={Receipt} label="Pending" value={`$${pendingTotal.toLocaleString()}`} sub={`${pendingInvoices.length} invoice(s)`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart data={stats.profitability} />
        <CostAnalysisTable data={stats.profitability} />
      </div>

      <div className="bg-white rounded-xl border border-cream-dark overflow-x-auto">
        <h3 className="text-sm font-semibold text-charcoal p-5 pb-0">Recent Transactions</h3>
        <table className="w-full text-sm mt-3">
          <thead>
            <tr className="border-b border-cream-dark">
              <th className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase">Date</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase">Type</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-warm-gray uppercase">Amount</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase">Reference</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentEntries.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-warm-gray">No transactions yet</td></tr>
            ) : (
              recentEntries.slice(0, 20).map((entry) => (
                <tr key={entry.id} className="border-b border-cream-dark last:border-0">
                  <td className="px-5 py-3 text-charcoal">{entry.date}</td>
                  <td className="px-5 py-3"><StatusBadge status={entry.type} /></td>
                  <td className="px-5 py-3 text-right font-medium text-charcoal">${entry.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-warm-gray">{entry.reference ?? '—'}</td>
                  <td className="px-5 py-3"><StatusBadge status={entry.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
