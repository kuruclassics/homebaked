"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Building2, Stethoscope, HardHat, Scale } from "lucide-react";

const projects = [
  {
    industry: "Restaurant & Hospitality",
    icon: UtensilsCrossed,
    title: "OrderFlow",
    client: "Casa Bella Restaurant Group",
    description:
      "Real-time kitchen display system with order routing, prep time tracking, and integrated POS sync. Reduced average ticket time by 34% across 3 locations.",
    color: "#f59e0b",
    mockup: "restaurant",
  },
  {
    industry: "Real Estate",
    icon: Building2,
    title: "PropPulse",
    client: "Greenfield Property Management",
    description:
      "Tenant portal with maintenance requests, automated rent collection, lease tracking, and owner reporting. Managing 340 units with a 2-person team.",
    color: "#3b82f6",
    mockup: "realestate",
  },
  {
    industry: "Healthcare",
    icon: Stethoscope,
    title: "IntakeIQ",
    client: "Lakeside Dental Clinic",
    description:
      "Digital patient intake, insurance verification, appointment scheduling, and treatment plan builder. Cut front-desk admin time by 60%.",
    color: "#10b981",
    mockup: "healthcare",
  },
  {
    industry: "Construction & Trades",
    icon: HardHat,
    title: "SiteBook",
    client: "Morrison Contracting Ltd.",
    description:
      "Job costing, crew scheduling, material tracking, and client-facing progress reports with photo documentation. From spreadsheets to one dashboard.",
    color: "#f97316",
    mockup: "construction",
  },
  {
    industry: "Legal Services",
    icon: Scale,
    title: "CaseVault",
    client: "Patel & Associates LLP",
    description:
      "Matter management with time tracking, document assembly, client portal, and trust accounting integration. Built for a 12-person firm.",
    color: "#8b5cf6",
    mockup: "legal",
  },
];

function RestaurantMockup() {
  return (
    <div className="w-full h-full bg-[#1a1a1a] rounded-lg overflow-hidden p-3 text-[10px] font-mono">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-zinc-500 ml-2">OrderFlow — Kitchen Display</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: "#1042", items: ["Margherita ×2", "Caesar Salad"], time: "3:42", status: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
          { id: "#1043", items: ["Grilled Salmon", "Risotto", "Tiramisu"], time: "1:15", status: "bg-green-500/20 text-green-400 border-green-500/30" },
          { id: "#1044", items: ["Pasta Carbonara", "Bruschetta ×3"], time: "0:28", status: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
        ].map((order) => (
          <div key={order.id} className={`rounded-md border p-2 ${order.status}`}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold">{order.id}</span>
              <span className="text-[8px] opacity-70">{order.time}</span>
            </div>
            {order.items.map((item, i) => (
              <div key={i} className="text-[9px] opacity-80 leading-relaxed">{item}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <div className="flex-1 bg-white/5 rounded p-1.5 text-center">
          <div className="text-amber-400 font-bold text-sm">12</div>
          <div className="text-zinc-500 text-[8px]">Active</div>
        </div>
        <div className="flex-1 bg-white/5 rounded p-1.5 text-center">
          <div className="text-green-400 font-bold text-sm">47</div>
          <div className="text-zinc-500 text-[8px]">Completed</div>
        </div>
        <div className="flex-1 bg-white/5 rounded p-1.5 text-center">
          <div className="text-blue-400 font-bold text-sm">8m</div>
          <div className="text-zinc-500 text-[8px]">Avg Time</div>
        </div>
      </div>
    </div>
  );
}

function RealEstateMockup() {
  return (
    <div className="w-full h-full bg-[#1a1a1a] rounded-lg overflow-hidden p-3 text-[10px] font-mono">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-zinc-500 ml-2">PropPulse — Dashboard</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {[
          { label: "Units", value: "340", color: "text-blue-400" },
          { label: "Occupied", value: "96%", color: "text-green-400" },
          { label: "Revenue", value: "$418K", color: "text-amber-400" },
          { label: "Requests", value: "23", color: "text-red-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 rounded p-1.5 text-center">
            <div className={`font-bold text-xs ${stat.color}`}>{stat.value}</div>
            <div className="text-zinc-500 text-[8px]">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <div className="text-zinc-400 text-[8px] uppercase tracking-wider mb-1">Recent Requests</div>
        {[
          { unit: "Unit 4B", issue: "Leaking faucet", priority: "bg-amber-500" },
          { unit: "Unit 12A", issue: "HVAC not cooling", priority: "bg-red-500" },
          { unit: "Unit 7C", issue: "Lock replacement", priority: "bg-blue-500" },
        ].map((req) => (
          <div key={req.unit} className="flex items-center gap-2 bg-white/5 rounded p-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${req.priority}`} />
            <span className="text-white/80 font-medium">{req.unit}</span>
            <span className="text-zinc-500 flex-1">{req.issue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HealthcareMockup() {
  return (
    <div className="w-full h-full bg-[#1a1a1a] rounded-lg overflow-hidden p-3 text-[10px] font-mono">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-zinc-500 ml-2">IntakeIQ — Schedule</span>
      </div>
      <div className="grid grid-cols-5 gap-0.5 mb-2">
        {["9:00", "9:30", "10:00", "10:30", "11:00"].map((t) => (
          <div key={t} className="text-center text-[8px] text-zinc-500">{t}</div>
        ))}
      </div>
      <div className="space-y-1">
        {[
          { name: "Dr. Chen", slots: [true, false, true, true, false], color: "bg-emerald-500/30 border-emerald-500/40" },
          { name: "Dr. Patel", slots: [true, true, false, true, true], color: "bg-blue-500/30 border-blue-500/40" },
          { name: "Hygienist", slots: [false, true, true, false, true], color: "bg-purple-500/30 border-purple-500/40" },
        ].map((row) => (
          <div key={row.name} className="flex items-center gap-1">
            <div className="w-14 text-zinc-400 text-[8px] truncate">{row.name}</div>
            {row.slots.map((filled, i) => (
              <div key={i} className={`flex-1 h-5 rounded-sm border ${filled ? row.color : "bg-white/5 border-white/5"}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 bg-emerald-500/10 border border-emerald-500/20 rounded p-2">
        <div className="text-emerald-400 font-medium text-[9px]">Next: Sarah M. — 10:00 AM</div>
        <div className="text-zinc-500 text-[8px]">Crown prep · Insurance verified ✓</div>
      </div>
    </div>
  );
}

function ConstructionMockup() {
  return (
    <div className="w-full h-full bg-[#1a1a1a] rounded-lg overflow-hidden p-3 text-[10px] font-mono">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-zinc-500 ml-2">SiteBook — Job #2847</span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/90 font-medium text-[11px]">Riverside Kitchen Reno</span>
        <span className="text-orange-400 bg-orange-500/15 px-1.5 py-0.5 rounded text-[8px]">In Progress</span>
      </div>
      <div className="mb-2">
        <div className="flex justify-between text-[8px] text-zinc-400 mb-0.5">
          <span>Progress</span><span>68%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" style={{ width: "68%" }} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 mb-2">
        <div className="bg-white/5 rounded p-1 text-center">
          <div className="text-amber-400 font-bold text-[11px]">$34.2K</div>
          <div className="text-zinc-500 text-[7px]">Budget Used</div>
        </div>
        <div className="bg-white/5 rounded p-1 text-center">
          <div className="text-green-400 font-bold text-[11px]">$48K</div>
          <div className="text-zinc-500 text-[7px]">Total Budget</div>
        </div>
        <div className="bg-white/5 rounded p-1 text-center">
          <div className="text-blue-400 font-bold text-[11px]">12d</div>
          <div className="text-zinc-500 text-[7px]">Remaining</div>
        </div>
      </div>
      <div className="space-y-1">
        {[
          { task: "Demolition", done: true },
          { task: "Plumbing rough-in", done: true },
          { task: "Electrical", done: false },
          { task: "Cabinet install", done: false },
        ].map((t) => (
          <div key={t.task} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${t.done ? "bg-green-500/20 border-green-500/40" : "border-zinc-600"}`}>
              {t.done && <span className="text-green-400 text-[8px]">✓</span>}
            </div>
            <span className={`text-[9px] ${t.done ? "text-zinc-500 line-through" : "text-white/80"}`}>{t.task}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegalMockup() {
  return (
    <div className="w-full h-full bg-[#1a1a1a] rounded-lg overflow-hidden p-3 text-[10px] font-mono">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-zinc-500 ml-2">CaseVault — Matters</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        {[
          { label: "Active", value: "24", color: "text-purple-400" },
          { label: "Billable Hrs", value: "186", color: "text-amber-400" },
          { label: "Trust Bal.", value: "$89K", color: "text-green-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 rounded p-1.5 text-center">
            <div className={`font-bold text-xs ${s.color}`}>{s.value}</div>
            <div className="text-zinc-500 text-[8px]">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="space-y-1">
        {[
          { matter: "Singh v. Metro Corp", type: "Litigation", hours: "42.5h", status: "text-red-400" },
          { matter: "Oakwood Acquisition", type: "Corporate", hours: "28.0h", status: "text-blue-400" },
          { matter: "Chen Estate Plan", type: "Estates", hours: "12.5h", status: "text-green-400" },
          { matter: "Rivera IP Filing", type: "IP", hours: "8.0h", status: "text-purple-400" },
        ].map((m) => (
          <div key={m.matter} className="flex items-center gap-2 bg-white/5 rounded p-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${m.status.replace("text-", "bg-")}`} />
            <div className="flex-1 min-w-0">
              <div className="text-white/80 font-medium text-[9px] truncate">{m.matter}</div>
              <div className="text-zinc-500 text-[8px]">{m.type}</div>
            </div>
            <span className="text-zinc-400 text-[8px]">{m.hours}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const mockupComponents: Record<string, React.FC> = {
  restaurant: RestaurantMockup,
  realestate: RealEstateMockup,
  healthcare: HealthcareMockup,
  construction: ConstructionMockup,
  legal: LegalMockup,
};

export default function Showcase() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-4 block">
            Our Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built for businesses{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              like yours
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Every tool we build solves a real problem. Here&apos;s a look at what we&apos;ve
            delivered for businesses across industries.
          </p>
        </motion.div>

        <div className="space-y-24">
          {projects.map((project, index) => {
            const MockupComponent = mockupComponents[project.mockup];
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}
              >
                {/* Mockup */}
                <motion.div
                  className="w-full lg:w-1/2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                    style={{
                      boxShadow: `0 0 80px -20px ${project.color}20`,
                    }}
                  >
                    <div className="aspect-[4/3] relative">
                      <MockupComponent />
                    </div>
                    {/* Reflection effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                  </div>
                </motion.div>

                {/* Info */}
                <div className="w-full lg:w-1/2 space-y-5">
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${project.color}15`, border: `1px solid ${project.color}30` }}
                      >
                        <project.icon size={20} style={{ color: project.color }} />
                      </div>
                      <span className="text-zinc-500 text-sm font-medium">{project.industry}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{project.title}</h3>
                    <p className="text-zinc-500 text-sm mb-4">Built for {project.client}</p>
                    <p className="text-zinc-300 text-base leading-relaxed">
                      {project.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
