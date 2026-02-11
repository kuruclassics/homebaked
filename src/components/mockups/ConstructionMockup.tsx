"use client";

export default function ConstructionMockup() {
  return (
    <div className="w-full h-full bg-[#111318] flex text-[10px]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar - Dark industrial */}
      <div className="w-[170px] bg-[#0c0e12] border-r border-white/5 flex flex-col shrink-0">
        <div className="px-3 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-[10px]">SB</div>
            <div>
              <div className="text-white font-bold text-[10px]">SiteBook</div>
              <div className="text-zinc-500 text-[7px]">Morrison Contracting</div>
            </div>
          </div>
        </div>
        <nav className="p-2 space-y-0.5 flex-1">
          {[
            { label: "Overview", icon: "📊", active: false },
            { label: "Jobs", icon: "🏗️", active: true },
            { label: "Crew", icon: "👷", active: false },
            { label: "Materials", icon: "📦", active: false },
            { label: "Invoices", icon: "📄", active: false },
            { label: "Photos", icon: "📸", active: false },
            { label: "Reports", icon: "📈", active: false },
          ].map((item) => (
            <div key={item.label} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[9px] cursor-pointer ${item.active ? "bg-orange-500/15 text-orange-400 font-semibold" : "text-zinc-500 hover:text-zinc-300"}`}>
              <span className="text-[10px]">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        {/* Mini crew status */}
        <div className="p-3 border-t border-white/5">
          <div className="text-zinc-500 text-[7px] uppercase tracking-wider mb-2 font-medium">Crew on Site</div>
          <div className="flex -space-x-1.5">
            {["JM", "RK", "TP", "AL", "BC"].map((initials, i) => (
              <div key={initials} className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-[6px] text-white font-bold border border-[#0c0e12]" style={{ zIndex: 5 - i }}>
                {initials}
              </div>
            ))}
            <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[6px] text-zinc-300 font-bold border border-[#0c0e12]">+7</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="h-11 border-b border-white/5 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-xs">Job #2847</span>
            <span className="text-zinc-600">—</span>
            <span className="text-zinc-400 text-[10px]">Riverside Kitchen Renovation</span>
            <span className="text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full text-[8px] font-medium">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 px-2 rounded-md bg-orange-500 text-white flex items-center text-[9px] font-medium">📸 Add Update</div>
          </div>
        </div>

        <div className="p-4">
          {/* Budget & Timeline */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Budget */}
            <div className="bg-[#161920] rounded-xl border border-white/5 p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-zinc-400 text-[9px] font-medium">Budget</span>
                <span className="text-green-400 text-[8px]">On Track</span>
              </div>
              <div className="flex items-end gap-3 mb-2">
                <div>
                  <div className="text-2xl font-bold text-white">$34,200</div>
                  <div className="text-zinc-500 text-[8px]">of $48,000 spent</div>
                </div>
                <div className="text-amber-400 text-sm font-bold">71%</div>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-amber-400" style={{ width: "71%" }} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { label: "Labor", amount: "$18,400", pct: "54%" },
                  { label: "Materials", amount: "$12,800", pct: "37%" },
                  { label: "Other", amount: "$3,000", pct: "9%" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-white text-[9px] font-semibold">{item.amount}</div>
                    <div className="text-zinc-500 text-[7px]">{item.label} · {item.pct}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-[#161920] rounded-xl border border-white/5 p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-zinc-400 text-[9px] font-medium">Timeline</span>
                <span className="text-amber-400 text-[8px]">2 days behind</span>
              </div>
              <div className="space-y-2">
                {[
                  { phase: "Demolition", start: "Jan 15", end: "Jan 22", progress: 100, color: "bg-green-500" },
                  { phase: "Plumbing", start: "Jan 23", end: "Feb 2", progress: 100, color: "bg-green-500" },
                  { phase: "Electrical", start: "Feb 3", end: "Feb 12", progress: 75, color: "bg-orange-500" },
                  { phase: "Cabinets", start: "Feb 13", end: "Feb 20", progress: 0, color: "bg-zinc-600" },
                  { phase: "Finishes", start: "Feb 21", end: "Feb 28", progress: 0, color: "bg-zinc-600" },
                ].map((phase) => (
                  <div key={phase.phase} className="flex items-center gap-2">
                    <span className="w-16 text-[8px] text-zinc-400 shrink-0">{phase.phase}</span>
                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${phase.color}`} style={{ width: `${phase.progress}%` }} />
                    </div>
                    <span className="text-[7px] text-zinc-500 w-8 text-right">{phase.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity & Materials */}
          <div className="grid grid-cols-5 gap-3">
            {/* Activity */}
            <div className="col-span-3 bg-[#161920] rounded-xl border border-white/5 p-3">
              <div className="text-zinc-400 text-[9px] font-medium mb-2">Recent Activity</div>
              <div className="space-y-2">
                {[
                  { time: "2h ago", user: "Jake M.", action: "Uploaded 4 photos", detail: "Electrical rough-in complete", color: "bg-blue-500" },
                  { time: "4h ago", user: "Rob K.", action: "Updated progress", detail: "Electrical: 75% → 80%", color: "bg-orange-500" },
                  { time: "Yesterday", user: "System", action: "Material delivered", detail: "Cabinet order #4521 received", color: "bg-green-500" },
                  { time: "Yesterday", user: "Tim P.", action: "Added note", detail: "Client approved backsplash tile selection", color: "bg-purple-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${item.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white/80 font-medium text-[9px]">{item.user}</span>
                        <span className="text-zinc-500 text-[8px]">{item.action}</span>
                        <span className="text-zinc-600 text-[7px] ml-auto">{item.time}</span>
                      </div>
                      <div className="text-zinc-400 text-[8px]">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div className="col-span-2 bg-[#161920] rounded-xl border border-white/5 p-3">
              <div className="text-zinc-400 text-[9px] font-medium mb-2">Pending Materials</div>
              <div className="space-y-1.5">
                {[
                  { item: "Quartz Countertop", supplier: "StoneWorks", eta: "Feb 14", status: "🟡" },
                  { item: "Pendant Lights ×3", supplier: "LightCo", eta: "Feb 12", status: "🟢" },
                  { item: "Sink + Fixtures", supplier: "PlumbPro", eta: "Feb 15", status: "🟡" },
                  { item: "Backsplash Tile", supplier: "TileMax", eta: "Feb 18", status: "🔴" },
                ].map((m) => (
                  <div key={m.item} className="flex items-center gap-2 bg-white/[0.02] rounded-lg p-1.5">
                    <span className="text-[8px]">{m.status}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white/80 text-[9px] font-medium truncate">{m.item}</div>
                      <div className="text-zinc-500 text-[7px]">{m.supplier} · ETA {m.eta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
