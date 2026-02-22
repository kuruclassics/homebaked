'use client';

import KanbanColumn from './KanbanColumn';

interface Project {
  id: number;
  name: string;
  clientName: string | null;
  type: string;
  stage: string;
}

const STAGES = ['lead', 'proposal', 'active', 'paused', 'completed', 'maintenance'];

export default function KanbanBoard({ projects }: { projects: Project[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => (
        <KanbanColumn
          key={stage}
          stage={stage}
          projects={projects.filter((p) => p.stage === stage)}
        />
      ))}
    </div>
  );
}
