"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Building2, Stethoscope, HardHat, Scale } from "lucide-react";
import RestaurantMockup from "./mockups/RestaurantMockup";
import RealEstateMockup from "./mockups/RealEstateMockup";
import HealthcareMockup from "./mockups/HealthcareMockup";
import ConstructionMockup from "./mockups/ConstructionMockup";
import LegalMockup from "./mockups/LegalMockup";

const projects = [
  {
    industry: "Restaurant & Hospitality",
    icon: UtensilsCrossed,
    title: "OrderFlow",
    client: "Casa Bella Restaurant Group",
    description:
      "Real-time kitchen display system with order routing, prep time tracking, and integrated POS sync. Reduced average ticket time by 34% across 3 locations.",
    stats: [
      { label: "Ticket Time", value: "-34%" },
      { label: "Order Accuracy", value: "99.2%" },
      { label: "Locations", value: "3" },
    ],
    color: "#f59e0b",
    Mockup: RestaurantMockup,
  },
  {
    industry: "Real Estate",
    icon: Building2,
    title: "PropPulse",
    client: "Greenfield Property Management",
    description:
      "Tenant portal with maintenance requests, automated rent collection, lease tracking, and owner reporting. Managing 340 units with a 2-person team.",
    stats: [
      { label: "Units Managed", value: "340" },
      { label: "Team Size", value: "2" },
      { label: "Collection Rate", value: "98%" },
    ],
    color: "#3b82f6",
    Mockup: RealEstateMockup,
  },
  {
    industry: "Healthcare",
    icon: Stethoscope,
    title: "IntakeIQ",
    client: "Lakeside Dental Clinic",
    description:
      "Digital patient intake, insurance verification, appointment scheduling, and treatment plan builder. Cut front-desk admin time by 60%.",
    stats: [
      { label: "Admin Time", value: "-60%" },
      { label: "No-shows", value: "-45%" },
      { label: "Patient NPS", value: "92" },
    ],
    color: "#10b981",
    Mockup: HealthcareMockup,
  },
  {
    industry: "Construction & Trades",
    icon: HardHat,
    title: "SiteBook",
    client: "Morrison Contracting Ltd.",
    description:
      "Job costing, crew scheduling, material tracking, and client-facing progress reports with photo documentation. From spreadsheets to one dashboard.",
    stats: [
      { label: "Budget Accuracy", value: "97%" },
      { label: "Time Saved", value: "12h/wk" },
      { label: "Active Jobs", value: "18" },
    ],
    color: "#f97316",
    Mockup: ConstructionMockup,
  },
  {
    industry: "Legal Services",
    icon: Scale,
    title: "CaseVault",
    client: "Patel & Associates LLP",
    description:
      "Matter management with time tracking, document assembly, client portal, and trust accounting integration. Built for a 12-person firm.",
    stats: [
      { label: "Billing Captured", value: "+28%" },
      { label: "Firm Size", value: "12" },
      { label: "Active Matters", value: "24" },
    ],
    color: "#8b5cf6",
    Mockup: LegalMockup,
  },
];

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

        <div className="space-y-32">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
              >
                {/* Info row */}
                <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 items-center mb-8`}>
                  <div className="w-full lg:w-1/2 space-y-5">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
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
                      <p className="text-zinc-300 text-base leading-relaxed mb-6">
                        {project.description}
                      </p>
                      {/* Stats */}
                      <div className="flex gap-6">
                        {project.stats.map((stat) => (
                          <div key={stat.label}>
                            <div className="text-xl font-bold text-white">{stat.value}</div>
                            <div className="text-zinc-500 text-xs">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                  <div className="w-full lg:w-1/2" />
                </div>

                {/* Full-width mockup */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                  style={{
                    boxShadow: `0 0 120px -30px ${project.color}15, 0 25px 50px -12px rgba(0,0,0,0.5)`,
                  }}
                >
                  {/* Browser chrome */}
                  <div className="h-8 bg-[#1e1e1e] border-b border-white/5 flex items-center px-3 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 mx-8">
                      <div className="h-5 bg-white/5 rounded-md flex items-center px-3 text-[10px] text-zinc-500 max-w-md mx-auto">
                        <span className="text-green-400 mr-1">🔒</span> app.{project.title.toLowerCase()}.io
                      </div>
                    </div>
                  </div>
                  {/* App content */}
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <project.Mockup />
                  </div>
                  {/* Shine overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
