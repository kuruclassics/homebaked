'use client';

import Link from 'next/link';
import StatusBadge from './StatusBadge';

interface Project {
  id: number;
  name: string;
  clientName: string | null;
  stage: string;
}

const STAGES = ['lead', 'proposal', 'active', 'paused', 'completed', 'maintenance'];

const stageLabels: Record<string, string> = {
  lead: 'Lead',
  proposal: 'Proposal',
  active: 'Active',
  paused: 'Paused',
  completed: 'Done',
  maintenance: 'Maint.',
};

export default function PipelineBoard({ projects }: { projects: Project[] }) {
  return (
    <div className="bg-white rounded-xl border border-cream-dark p-5">
      <h3 className="text-sm font-semibold text-charcoal mb-4">Pipeline</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {STAGES.map((stage) => {
          const stageProjects = projects.filter((p) => p.stage === stage);
          return (
            <div key={stage} className="flex-shrink-0 w-40">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs font-semibold text-warm-gray">{stageLabels[stage]}</span>
                <span className="text-xs text-warm-gray-light bg-cream-dark px-1.5 py-0.5 rounded-full">
                  {stageProjects.length}
                </span>
              </div>
              <div className="space-y-1.5 min-h-[60px]">
                {stageProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/projects/${p.id}`}
                    className="block p-2 bg-cream/50 rounded-lg border border-cream-dark hover:border-honey/30 transition-all"
                  >
                    <p className="text-xs font-medium text-charcoal truncate">{p.name}</p>
                    {p.clientName && <p className="text-[10px] text-warm-gray truncate">{p.clientName}</p>}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
