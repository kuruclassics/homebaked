'use client';

interface ProjectProfit {
  id: number;
  name: string;
  stage: string;
  hours: number;
  revenue: number;
  effectiveRate: number;
}

export default function CostAnalysisTable({ data }: { data: ProjectProfit[] }) {
  const sorted = [...data].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="bg-white rounded-xl border border-cream-dark overflow-x-auto">
      <h3 className="text-sm font-semibold text-charcoal p-5 pb-0">Project Profitability</h3>
      <table className="w-full text-sm mt-3">
        <thead>
          <tr className="border-b border-cream-dark">
            <th className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase">Project</th>
            <th className="text-right px-5 py-3 text-xs font-semibold text-warm-gray uppercase">Hours</th>
            <th className="text-right px-5 py-3 text-xs font-semibold text-warm-gray uppercase">Revenue</th>
            <th className="text-right px-5 py-3 text-xs font-semibold text-warm-gray uppercase">Eff. $/hr</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr><td colSpan={4} className="px-5 py-12 text-center text-warm-gray">No data</td></tr>
          ) : (
            sorted.map((p) => (
              <tr key={p.id} className="border-b border-cream-dark last:border-0">
                <td className="px-5 py-3 font-medium text-charcoal">{p.name}</td>
                <td className="px-5 py-3 text-right text-warm-gray">{p.hours.toFixed(1)}h</td>
                <td className="px-5 py-3 text-right text-charcoal font-medium">${p.revenue.toLocaleString()}</td>
                <td className={`px-5 py-3 text-right font-semibold ${p.effectiveRate >= 100 ? 'text-green-600' : p.effectiveRate > 0 ? 'text-honey' : 'text-warm-gray'}`}>
                  {p.effectiveRate > 0 ? `$${p.effectiveRate.toFixed(0)}/hr` : '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
