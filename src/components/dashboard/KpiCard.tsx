import { type LucideIcon } from 'lucide-react';

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
}

export default function KpiCard({ icon: Icon, label, value, sub }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-cream-dark p-5">
      <div className="flex items-center gap-2 text-warm-gray mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-charcoal">{value}</p>
      {sub && <p className="text-xs text-warm-gray mt-1">{sub}</p>}
    </div>
  );
}
