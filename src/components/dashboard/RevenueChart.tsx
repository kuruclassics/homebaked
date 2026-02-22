'use client';

interface ProjectProfit {
  name: string;
  revenue: number;
  hours: number;
}

export default function RevenueChart({ data }: { data: ProjectProfit[] }) {
  const filtered = data.filter((d) => d.revenue > 0 || d.hours > 0);
  if (filtered.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-cream-dark p-8 text-center text-warm-gray text-sm">
        No revenue data yet
      </div>
    );
  }

  const maxRevenue = Math.max(...filtered.map((d) => d.revenue), 1);
  const barHeight = 32;
  const gap = 8;
  const labelWidth = 120;
  const chartWidth = 400;
  const svgHeight = filtered.length * (barHeight + gap);

  return (
    <div className="bg-white rounded-xl border border-cream-dark p-5 overflow-x-auto">
      <h3 className="text-sm font-semibold text-charcoal mb-4">Revenue by Project</h3>
      <svg width={labelWidth + chartWidth + 80} height={svgHeight} className="text-sm">
        {filtered.map((d, i) => {
          const y = i * (barHeight + gap);
          const barWidth = (d.revenue / maxRevenue) * chartWidth;
          return (
            <g key={d.name}>
              <text x={labelWidth - 8} y={y + barHeight / 2 + 4} textAnchor="end" className="fill-warm-gray text-xs">
                {d.name.length > 15 ? d.name.slice(0, 15) + '...' : d.name}
              </text>
              <rect x={labelWidth} y={y} width={Math.max(barWidth, 2)} height={barHeight} rx={6} className="fill-honey/80" />
              <text x={labelWidth + Math.max(barWidth, 2) + 8} y={y + barHeight / 2 + 4} className="fill-charcoal text-xs font-medium">
                ${d.revenue.toLocaleString()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
