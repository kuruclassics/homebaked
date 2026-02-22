'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, DollarSign, GitBranch } from 'lucide-react';
import Link from 'next/link';
import Tabs from '@/components/dashboard/Tabs';
import StatusBadge from '@/components/dashboard/StatusBadge';
import TimeEntryForm from '@/components/dashboard/TimeEntryForm';
import TimeEntryTable from '@/components/dashboard/TimeEntryTable';
import FinancialEntryForm from '@/components/dashboard/FinancialEntryForm';
import FinancialEntryTable from '@/components/dashboard/FinancialEntryTable';
import GitAnalysisPanel from '@/components/dashboard/GitAnalysisPanel';

interface Project {
  id: number;
  name: string;
  description: string | null;
  clientName: string | null;
  type: string;
  stage: string;
  githubRepoUrl: string | null;
  hourlyRate: number | null;
  fixedPrice: number | null;
  totalHours: number;
  totalRevenue: number;
}

interface TimeEntry {
  id: number;
  date: string;
  hours: number;
  source: string;
  notes: string | null;
  sessionId: string | null;
}

interface FinancialEntry {
  id: number;
  type: string;
  amount: number;
  date: string;
  reference: string | null;
  status: string;
  notes: string | null;
}

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'time', label: 'Time' },
  { key: 'financials', label: 'Financials' },
  { key: 'git', label: 'Git Analysis' },
];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tab, setTab] = useState('overview');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>([]);

  const fetchProject = useCallback(async () => {
    const res = await fetch(`/api/dashboard/projects/${id}`);
    if (!res.ok) { router.push('/dashboard/projects'); return; }
    setProject(await res.json());
  }, [id, router]);

  const fetchTime = useCallback(async () => {
    const res = await fetch(`/api/dashboard/time-entries?projectId=${id}`);
    setTimeEntries(await res.json());
  }, [id]);

  const fetchFinancials = useCallback(async () => {
    const res = await fetch(`/api/dashboard/financial-entries?projectId=${id}`);
    setFinancialEntries(await res.json());
  }, [id]);

  useEffect(() => {
    fetchProject();
    fetchTime();
    fetchFinancials();
  }, [fetchProject, fetchTime, fetchFinancials]);

  async function deleteTimeEntry(entryId: number) {
    await fetch(`/api/dashboard/time-entries/${entryId}`, { method: 'DELETE' });
    fetchTime();
    fetchProject();
  }

  async function deleteFinancialEntry(entryId: number) {
    await fetch(`/api/dashboard/financial-entries/${entryId}`, { method: 'DELETE' });
    fetchFinancials();
    fetchProject();
  }

  if (!project) {
    return <div className="text-warm-gray">Loading...</div>;
  }

  const effectiveRate = project.totalHours > 0 ? project.totalRevenue / project.totalHours : 0;

  return (
    <div>
      <Link href="/dashboard/projects" className="inline-flex items-center gap-1.5 text-sm text-warm-gray hover:text-charcoal transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" />
        Projects
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-charcoal" style={{ fontFamily: 'var(--font-serif)' }}>
            {project.name}
          </h1>
          {project.clientName && (
            <p className="text-warm-gray mt-1">{project.clientName}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={project.stage} />
            <StatusBadge status={project.type === 'public_product' ? 'product' : 'client_project'} />
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-cream-dark p-4">
          <div className="flex items-center gap-2 text-warm-gray mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Hours</span>
          </div>
          <p className="text-2xl font-bold text-charcoal">{project.totalHours.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark p-4">
          <div className="flex items-center gap-2 text-warm-gray mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-charcoal">${project.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark p-4">
          <div className="flex items-center gap-2 text-warm-gray mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Eff. Rate</span>
          </div>
          <p className="text-2xl font-bold text-charcoal">${effectiveRate.toFixed(0)}<span className="text-sm font-normal text-warm-gray">/hr</span></p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark p-4">
          <div className="flex items-center gap-2 text-warm-gray mb-1">
            <GitBranch className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Repo</span>
          </div>
          <p className="text-sm text-charcoal truncate">{project.githubRepoUrl ? 'Connected' : 'None'}</p>
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="mt-6">
        {tab === 'overview' && (
          <div className="bg-white rounded-xl border border-cream-dark p-6">
            <h3 className="font-semibold text-charcoal mb-2">Description</h3>
            <p className="text-warm-gray text-sm">{project.description || 'No description.'}</p>
            {project.hourlyRate && (
              <p className="text-sm text-warm-gray mt-4">Hourly Rate: <span className="font-medium text-charcoal">${project.hourlyRate}/hr</span></p>
            )}
            {project.fixedPrice && (
              <p className="text-sm text-warm-gray mt-1">Fixed Price: <span className="font-medium text-charcoal">${project.fixedPrice.toLocaleString()}</span></p>
            )}
          </div>
        )}

        {tab === 'time' && (
          <div className="space-y-4">
            <TimeEntryForm projectId={project.id} onSubmit={() => { fetchTime(); fetchProject(); }} />
            <TimeEntryTable entries={timeEntries} onDelete={deleteTimeEntry} />
          </div>
        )}

        {tab === 'financials' && (
          <div className="space-y-4">
            <FinancialEntryForm projectId={project.id} onSubmit={() => { fetchFinancials(); fetchProject(); }} />
            <FinancialEntryTable entries={financialEntries} onDelete={deleteFinancialEntry} />
          </div>
        )}

        {tab === 'git' && (
          <GitAnalysisPanel
            projectId={project.id}
            repoUrl={project.githubRepoUrl}
            onNewEntries={() => { fetchTime(); fetchProject(); }}
          />
        )}
      </div>
    </div>
  );
}
