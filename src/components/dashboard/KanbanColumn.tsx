'use client';

import ProjectCard from './ProjectCard';

interface Project {
  id: number;
  name: string;
  clientName: string | null;
  type: string;
  stage: string;
}

interface KanbanColumnProps {
  stage: string;
  projects: Project[];
}

const stageLabels: Record<string, string> = {
  lead: 'Lead',
  proposal: 'Proposal',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  maintenance: 'Maintenance',
};

export default function KanbanColumn({ stage, projects }: KanbanColumnProps) {
  return (
    <div className="flex-shrink-0 w-64">
      <div className="flex items-center gap-2 mb-3 px-1">
        <h3 className="text-sm font-semibold text-charcoal">{stageLabels[stage] ?? stage}</h3>
        <span className="text-xs text-warm-gray bg-cream-dark px-2 py-0.5 rounded-full">
          {projects.length}
        </span>
      </div>
      <div className="space-y-2 min-h-[100px] p-2 rounded-xl bg-cream/50 border border-cream-dark">
        {projects.length === 0 ? (
          <p className="text-xs text-warm-gray-light text-center py-8">No projects</p>
        ) : (
          projects.map((p) => <ProjectCard key={p.id} project={p} />)
        )}
      </div>
    </div>
  );
}
