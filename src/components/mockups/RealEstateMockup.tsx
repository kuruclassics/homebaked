"use client";

export default function RealEstateMockup() {
  return (
    <div className="w-full h-full bg-[#fafbfc] flex text-[10px]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar - Light blue theme */}
      <div className="w-[68px] bg-[#0f172a] flex flex-col items-center py-3 gap-2 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm mb-3">P</div>
        {[
          { icon: "⬜", active: false },
          { icon: "🏢", active: true },
          { icon: "🔧", active: false },
          { icon: "💰", active: false },
          { icon: "📄", active: false },
          { icon: "👤", active: false },
        ].map((item, i) => (
          <div key={i} className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${item.active ? "bg-blue-600/30 ring-1 ring-blue-400/40" : "opacity-50 hover:opacity-80"}`}>
            {item.icon}
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="h-11 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 font-semibold text-xs">Properties</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-500 text-[10px]">Greenfield Portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 px-2.5 rounded-md bg-blue-600 text-white flex items-center text-[9px] font-medium">+ Add Property</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "Total Units", value: "340", sub: "across 8 properties", icon: "🏢", bg: "bg-blue-50 border-blue-100", text: "text-blue-700" },
              { label: "Occupancy", value: "96.2%", sub: "+1.4% vs last month", icon: "📊", bg: "bg-green-50 border-green-100", text: "text-green-700" },
              { label: "Monthly Revenue", value: "$418,200", sub: "collected this month", icon: "💰", bg: "bg-amber-50 border-amber-100", text: "text-amber-700" },
              { label: "Open Requests", value: "23", sub: "7 urgent, 16 routine", icon: "🔧", bg: "bg-red-50 border-red-100", text: "text-red-700" },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl border p-3 ${stat.bg}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-500 text-[9px] font-medium">{stat.label}</span>
                  <span className="text-sm">{stat.icon}</span>
                </div>
                <div className={`text-base font-bold ${stat.text}`}>{stat.value}</div>
                <div className="text-gray-400 text-[8px] mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
              <span className="text-gray-700 font-semibold text-[11px]">Properties</span>
              <div className="flex gap-1.5">
                <div className="h-5 w-16 rounded bg-gray-100 text-gray-400 flex items-center px-1.5 text-[8px]">Filter</div>
                <div className="h-5 w-16 rounded bg-gray-100 text-gray-400 flex items-center px-1.5 text-[8px]">Sort</div>
              </div>
            </div>
            {/* Table header */}
            <div className="grid grid-cols-6 gap-2 px-3 py-1.5 bg-gray-50 text-[8px] text-gray-400 font-medium uppercase tracking-wider border-b border-gray-100">
              <span>Property</span><span>Units</span><span>Occupancy</span><span>Revenue</span><span>Requests</span><span>Status</span>
            </div>
            {/* Rows */}
            {[
              { name: "Riverside Towers", units: 84, occ: "98%", rev: "$126,400", req: 3, status: "Excellent", statusColor: "bg-green-100 text-green-700" },
              { name: "Parkview Commons", units: 62, occ: "95%", rev: "$89,200", req: 8, status: "Good", statusColor: "bg-blue-100 text-blue-700" },
              { name: "Oak Street Lofts", units: 48, occ: "100%", rev: "$72,000", req: 2, status: "Excellent", statusColor: "bg-green-100 text-green-700" },
              { name: "Harbor Point", units: 56, occ: "93%", rev: "$58,600", req: 5, status: "Attention", statusColor: "bg-amber-100 text-amber-700" },
              { name: "The Birch", units: 40, occ: "95%", rev: "$44,000", req: 3, status: "Good", statusColor: "bg-blue-100 text-blue-700" },
              { name: "Elm Gardens", units: 50, occ: "96%", rev: "$28,000", req: 2, status: "Good", statusColor: "bg-blue-100 text-blue-700" },
            ].map((row) => (
              <div key={row.name} className="grid grid-cols-6 gap-2 px-3 py-2 border-b border-gray-50 hover:bg-blue-50/30 items-center text-[9px]">
                <span className="text-gray-800 font-medium">{row.name}</span>
                <span className="text-gray-600">{row.units}</span>
                <div className="flex items-center gap-1">
                  <div className="w-10 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: row.occ }} />
                  </div>
                  <span className="text-gray-600">{row.occ}</span>
                </div>
                <span className="text-gray-700 font-medium">{row.rev}</span>
                <span className="text-gray-600">{row.req}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium w-fit ${row.statusColor}`}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
