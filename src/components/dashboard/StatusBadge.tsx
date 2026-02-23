const statusColors: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  inactive: 'bg-gray-50 text-gray-600 border-gray-200',
  lead: 'bg-honey/10 text-honey-dark border-honey/20',
  proposal: 'bg-blue-50 text-blue-700 border-blue-200',
  paused: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  maintenance: 'bg-purple-50 text-purple-700 border-purple-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  paid: 'bg-green-50 text-green-700 border-green-200',
  overdue: 'bg-red-50 text-red-600 border-red-200',
  invoice: 'bg-blue-50 text-blue-700 border-blue-200',
  payment: 'bg-green-50 text-green-700 border-green-200',
  claude_session: 'bg-orange-50 text-orange-700 border-orange-200',
  git_auto: 'bg-green-50 text-green-700 border-green-200',
  manual: 'bg-honey/10 text-honey-dark border-honey/20',
};

export default function StatusBadge({ status }: { status: string }) {
  const colors = statusColors[status] ?? 'bg-gray-50 text-gray-600 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
