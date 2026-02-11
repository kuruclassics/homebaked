"use client";

export default function LegalMockup() {
  return (
    <div className="w-full h-full bg-[#0e0e14] flex text-[10px]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar - Deep purple/indigo */}
      <div className="w-[170px] bg-[#0a0a10] border-r border-purple-500/10 flex flex-col shrink-0">
        <div className="px-3 py-3 border-b border-purple-500/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-[10px]">CV</div>
            <div>
              <div className="text-white font-bold text-[10px]">CaseVault</div>
              <div className="text-zinc-500 text-[7px]">Patel & Associates</div>
            </div>
          </div>
        </div>
        <nav className="p-2 space-y-0.5 flex-1">
          {[
            { label: "Dashboard", icon: "📊", active: false },
            { label: "Matters", icon: "📁", active: true },
            { label: "Time Tracking", icon: "⏱️", active: false },
            { label: "Documents", icon: "📄", active: false },
            { label: "Client Portal", icon: "👥", active: false },
            { label: "Trust Accounts", icon: "🏦", active: false },
            { label: "Calendar", icon: "📅", active: false },
            { label: "Reports", icon: "📈", active: false },
          ].map((item) => (
            <div key={item.label} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[9px] cursor-pointer ${item.active ? "bg-purple-500/15 text-purple-300 font-semibold" : "text-zinc-500 hover:text-zinc-300"}`}>
              <span className="text-[10px]">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div className="p-2 border-t border-purple-500/10">
          <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-2">
            <div className="text-purple-300 text-[8px] font-semibold mb-1">⏱ Active Timer</div>
            <div className="text-white text-sm font-bold">01:42:18</div>
            <div className="text-zinc-500 text-[7px]">Singh v. Metro Corp</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="h-11 border-b border-white/5 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold text-xs">Active Matters</span>
            <span className="text-zinc-500 text-[10px]">24 matters · 6 attorneys</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-28 rounded-md bg-white/5 border border-white/10 text-zinc-500 flex items-center px-2 text-[9px]">🔍 Search matters...</div>
            <div className="h-6 px-2 rounded-md bg-purple-600 text-white flex items-center text-[9px] font-medium">+ New Matter</div>
          </div>
        </div>

        <div className="p-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "Active Matters", value: "24", sub: "3 new this week", gradient: "from-purple-500/20 to-violet-500/20", border: "border-purple-500/20", text: "text-purple-300" },
              { label: "Billable Hours (MTD)", value: "186.5", sub: "$74,600 value", gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/20", text: "text-amber-300" },
              { label: "Trust Balance", value: "$89,240", sub: "across 8 accounts", gradient: "from-green-500/20 to-emerald-500/20", border: "border-green-500/20", text: "text-green-300" },
              { label: "Pending Invoices", value: "$42,800", sub: "12 outstanding", gradient: "from-red-500/20 to-rose-500/20", border: "border-red-500/20", text: "text-red-300" },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl border ${stat.border} bg-gradient-to-br ${stat.gradient} p-3`}>
                <div className="text-zinc-400 text-[8px] font-medium mb-1">{stat.label}</div>
                <div className={`text-lg font-bold ${stat.text}`}>{stat.value}</div>
                <div className="text-zinc-500 text-[8px] mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Matters Table */}
          <div className="bg-[#12121a] rounded-xl border border-white/5 overflow-hidden">
            <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-[11px]">All Matters</span>
                <div className="flex gap-1">
                  {["All", "Litigation", "Corporate", "Estates", "IP"].map((f, i) => (
                    <button key={f} className={`px-2 py-0.5 rounded-md text-[8px] ${i === 0 ? "bg-purple-500/15 text-purple-300 border border-purple-500/25" : "text-zinc-500"}`}>{f}</button>
                  ))}
                </div>
              </div>
            </div>
            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-2 px-3 py-1.5 bg-white/[0.02] text-[8px] text-zinc-500 font-medium uppercase tracking-wider border-b border-white/5">
              <span>Matter</span><span>Type</span><span>Attorney</span><span>Hours</span><span>Value</span><span>Status</span>
            </div>
            {/* Rows */}
            {[
              { matter: "Singh v. Metro Corp", client: "Raj Singh", type: "Litigation", typeBg: "bg-red-500/10 text-red-400", attorney: "A. Patel", hours: "42.5", value: "$17,000", status: "Active", statusBg: "bg-green-500/15 text-green-400" },
              { matter: "Oakwood Acquisition", client: "Oakwood Dev Corp", type: "Corporate", typeBg: "bg-blue-500/10 text-blue-400", attorney: "M. Torres", hours: "28.0", value: "$14,000", status: "Review", statusBg: "bg-amber-500/15 text-amber-400" },
              { matter: "Chen Family Estate", client: "Wei Chen", type: "Estates", typeBg: "bg-purple-500/10 text-purple-400", attorney: "S. Kim", hours: "12.5", value: "$5,000", status: "Active", statusBg: "bg-green-500/15 text-green-400" },
              { matter: "Rivera IP Filing", client: "Rivera Labs Inc", type: "IP", typeBg: "bg-teal-500/10 text-teal-400", attorney: "J. Nakamura", hours: "8.0", value: "$4,000", status: "Pending", statusBg: "bg-blue-500/15 text-blue-400" },
              { matter: "Thompson Divorce", client: "Claire Thompson", type: "Family", typeBg: "bg-pink-500/10 text-pink-400", attorney: "A. Patel", hours: "18.0", value: "$7,200", status: "Active", statusBg: "bg-green-500/15 text-green-400" },
              { matter: "GreenTech Compliance", client: "GreenTech Solar", type: "Corporate", typeBg: "bg-blue-500/10 text-blue-400", attorney: "D. Okafor", hours: "6.5", value: "$3,250", status: "New", statusBg: "bg-purple-500/15 text-purple-400" },
            ].map((row) => (
              <div key={row.matter} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-2 px-3 py-2 border-b border-white/[0.03] hover:bg-purple-500/[0.03] items-center">
                <div>
                  <div className="text-white/90 font-medium text-[9px]">{row.matter}</div>
                  <div className="text-zinc-500 text-[7px]">{row.client}</div>
                </div>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-md w-fit ${row.typeBg}`}>{row.type}</span>
                <span className="text-zinc-300 text-[9px]">{row.attorney}</span>
                <span className="text-zinc-300 text-[9px] font-mono">{row.hours}h</span>
                <span className="text-zinc-200 text-[9px] font-semibold">{row.value}</span>
                <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-medium w-fit ${row.statusBg}`}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
