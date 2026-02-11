"use client";

export default function RestaurantMockup() {
  return (
    <div className="w-full h-full bg-[#0f0f0f] flex text-[10px]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <div className="w-[72px] bg-[#1a1a1a] border-r border-white/5 flex flex-col items-center py-3 gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm mb-2">O</div>
        {["📊", "🍽️", "📋", "👥", "⚙️"].map((icon, i) => (
          <div key={i} className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm cursor-pointer transition-colors ${i === 1 ? "bg-amber-500/15 ring-1 ring-amber-500/30" : "hover:bg-white/5"}`}>
            {icon}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <div className="h-11 border-b border-white/5 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold text-xs">Kitchen Display</span>
            <span className="text-[9px] bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">● Live</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 rounded-md bg-white/5 border border-white/10 text-zinc-500 flex items-center px-2 text-[9px]">Search...</div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[8px] text-white font-bold">CB</div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-4 pt-3 pb-2">
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: "Active Orders", value: "18", change: "+3", up: true, color: "text-amber-400" },
              { label: "Avg Ticket Time", value: "8.2m", change: "-1.4m", up: false, color: "text-green-400" },
              { label: "Completed Today", value: "147", change: "+23", up: true, color: "text-blue-400" },
              { label: "Revenue Today", value: "$4,820", change: "+12%", up: true, color: "text-emerald-400" },
              { label: "Staff On Floor", value: "12", change: "", up: true, color: "text-purple-400" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#161616] rounded-lg border border-white/5 p-2">
                <div className="text-zinc-500 text-[8px] mb-1">{stat.label}</div>
                <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
                {stat.change && (
                  <div className={`text-[8px] mt-0.5 ${stat.up ? "text-green-400" : "text-green-400"}`}>
                    {stat.change}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        <div className="px-4 pt-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1.5">
              {[
                { label: "All", count: 18, active: true },
                { label: "New", count: 4, active: false },
                { label: "Preparing", count: 8, active: false },
                { label: "Ready", count: 6, active: false },
              ].map((tab) => (
                <button key={tab.label} className={`px-2 py-1 rounded-md text-[9px] font-medium transition-colors ${tab.active ? "bg-amber-500/15 text-amber-400 border border-amber-500/25" : "text-zinc-500 hover:text-zinc-300"}`}>
                  {tab.label} <span className="opacity-60">{tab.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "#1042", table: "T-7", items: [{ name: "Margherita Pizza", qty: 2, mod: "Extra basil" }, { name: "Caesar Salad", qty: 1, mod: "" }, { name: "Sparkling Water", qty: 2, mod: "" }], time: "6:42", status: "preparing", color: "border-amber-500/40 bg-amber-500/[0.04]", badge: "bg-amber-500/20 text-amber-400" },
              { id: "#1043", table: "T-3", items: [{ name: "Grilled Salmon", qty: 1, mod: "No capers" }, { name: "Wild Mushroom Risotto", qty: 1, mod: "" }, { name: "Tiramisu", qty: 2, mod: "" }], time: "3:15", status: "preparing", color: "border-amber-500/40 bg-amber-500/[0.04]", badge: "bg-amber-500/20 text-amber-400" },
              { id: "#1044", table: "Bar", items: [{ name: "Carbonara", qty: 1, mod: "Sub penne" }, { name: "Bruschetta", qty: 3, mod: "" }], time: "0:48", status: "new", color: "border-blue-500/40 bg-blue-500/[0.04]", badge: "bg-blue-500/20 text-blue-400" },
              { id: "#1045", table: "T-12", items: [{ name: "Osso Buco", qty: 1, mod: "" }, { name: "Burrata Salad", qty: 2, mod: "Dressing side" }, { name: "Panna Cotta", qty: 1, mod: "" }], time: "9:20", status: "ready", color: "border-green-500/40 bg-green-500/[0.04]", badge: "bg-green-500/20 text-green-400" },
            ].map((order) => (
              <div key={order.id} className={`rounded-xl border p-2.5 ${order.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-white font-bold text-[11px]">{order.id}</span>
                    <span className="text-zinc-500 text-[8px] ml-1.5">{order.table}</span>
                  </div>
                  <span className={`text-[7px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full ${order.badge}`}>{order.status}</span>
                </div>
                <div className="space-y-1.5 mb-2">
                  {order.items.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between">
                        <span className="text-white/80 text-[9px]">{item.name}</span>
                        <span className="text-zinc-500 text-[8px]">×{item.qty}</span>
                      </div>
                      {item.mod && <div className="text-amber-400/60 text-[7px] italic">↳ {item.mod}</div>}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
                  <span className="text-zinc-500 text-[8px]">⏱ {order.time}</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded bg-white/5 flex items-center justify-center text-[8px] hover:bg-white/10 cursor-pointer">▶</div>
                    <div className="w-4 h-4 rounded bg-white/5 flex items-center justify-center text-[8px] hover:bg-white/10 cursor-pointer">✓</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
