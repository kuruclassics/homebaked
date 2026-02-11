"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Users, Package, CalendarCheck, BarChart3, FileText } from "lucide-react";

const services = [
  { icon: Users, title: "Custom CRMs", description: "Track leads, customers, and deals with a system built around your sales process." },
  { icon: LayoutDashboard, title: "Internal Dashboards", description: "Real-time visibility into your metrics. KPIs, reports, and insights at a glance." },
  { icon: Package, title: "Inventory Systems", description: "Track stock, orders, and suppliers. Automated alerts and reorder workflows." },
  { icon: CalendarCheck, title: "Booking & Scheduling", description: "Let customers book online. Manage appointments, staff, and availability effortlessly." },
  { icon: BarChart3, title: "Reporting Tools", description: "Turn raw data into actionable reports. Custom analytics for your business needs." },
  { icon: FileText, title: "Workflow Automation", description: "Automate repetitive tasks. Approvals, notifications, data entry — all handled." },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Services() {
  return (
    <section id="services" className="py-32 px-6 relative">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[150px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-amber-500 text-sm font-medium tracking-widest uppercase mb-4">What We Build</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Tools that fit <span className="gradient-text">your business</span>
          </h2>
          <p className="mt-4 text-white/40 max-w-xl mx-auto">
            Every business is different. That&apos;s why off-the-shelf software never quite works. We build exactly what you need.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants as any}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service, i) => (
            <motion.div
              key={i}
              variants={cardVariants as any}
              whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="glass-card p-7 group cursor-pointer transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/10 flex items-center justify-center mb-5 group-hover:bg-amber-500/20 group-hover:border-amber-500/20 transition-all duration-500">
                <service.icon className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
