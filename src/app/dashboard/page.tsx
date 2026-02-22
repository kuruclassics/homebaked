'use client';

import { useState, useEffect } from 'react';
import { FolderKanban, Users, Clock, DollarSign, TrendingUp } from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import PipelineBoard from '@/components/dashboard/PipelineBoard';
import CostAnalysisTable from '@/components/dashboard/CostAnalysisTable';

interface Stats {
  activeProjects: number;
  totalClients: number;
  hoursMTD: number;
  revenueMTD: number;
  totalHours: number;
  totalRevenue: number;
  effectiveRate: number;
  profitability: {
    id: number;
    name: string;
    stage: string;
    hours: number;
    revenue: number;
    effectiveRate: number;
  }[];
  projects: {
    id: number;
    name: string;
    clientName: string | null;
    type: string;
    stage: string;
  }[];
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/stats').then((r) => {
      if (!r.ok) return null;
      return r.json();
    }).then((data) => { if (data) setStats(data); });
  }, []);

  if (!stats) {
    return <div className="text-warm-gray">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-charcoal mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
        Overview
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <KpiCard icon={FolderKanban} label="Active Projects" value={String(stats.activeProjects)} />
        <KpiCard icon={Users} label="Total Clients" value={String(stats.totalClients)} />
        <KpiCard icon={Clock} label="Hours (MTD)" value={`${stats.hoursMTD.toFixed(1)}h`} sub={`${stats.totalHours.toFixed(1)}h all time`} />
        <KpiCard icon={DollarSign} label="Revenue (MTD)" value={`$${stats.revenueMTD.toLocaleString()}`} sub={`$${stats.totalRevenue.toLocaleString()} all time`} />
        <KpiCard icon={TrendingUp} label="Eff. Rate" value={`$${stats.effectiveRate.toFixed(0)}/hr`} sub="Weighted average" />
      </div>

      <div className="mb-8">
        <PipelineBoard projects={stats.projects} />
      </div>

      <CostAnalysisTable data={stats.profitability} />
    </div>
  );
}
