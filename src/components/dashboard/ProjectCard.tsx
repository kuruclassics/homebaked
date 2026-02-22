'use client';

import Link from 'next/link';
import StatusBadge from './StatusBadge';

interface Project {
  id: number;
  name: string;
  clientName: string | null;
  type: string;
  stage: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="block p-3 bg-white rounded-xl border border-cream-dark hover:border-honey/30 hover:shadow-sm transition-all"
    >
      <p className="font-medium text-sm text-charcoal truncate">{project.name}</p>
      {project.clientName && (
        <p className="text-xs text-warm-gray mt-1 truncate">{project.clientName}</p>
      )}
      <div className="mt-2">
        <StatusBadge status={project.type === 'public_product' ? 'product' : project.stage} />
      </div>
    </Link>
  );
}
