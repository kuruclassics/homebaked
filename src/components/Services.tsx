"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const services = [
  {
    title: "Custom CRMs",
    description: "Track leads, customers, and deals with a system built around your sales process.",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="14" cy="14" r="8" stroke="#D4850F" strokeWidth="2" fill="none"/>
        <circle cx="26" cy="14" r="8" stroke="#D4850F" strokeWidth="2" fill="none" opacity="0.5"/>
        <circle cx="20" cy="24" r="8" stroke="#E8A435" strokeWidth="2" fill="none" opacity="0.3"/>
        <circle cx="20" cy="16" r="2" fill="#D4850F"/>
      </svg>
    ),
  },
  {
    title: "Internal Dashboards",
    description: "Real-time visibility into your metrics. KPIs, reports, and insights at a glance.",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="4" y="20" width="8" height="16" rx="2" fill="#D4850F" opacity="0.3"/>
        <rect x="16" y="12" width="8" height="24" rx="2" fill="#D4850F" opacity="0.5"/>
        <rect x="28" y="6" width="8" height="30" rx="2" fill="#D4850F" opacity="0.8"/>
        <path d="M6 18L20 8L34 4" stroke="#E8A435" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Inventory Systems",
    description: "Track stock, orders, and suppliers. Automated alerts and reorder workflows.",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 4L36 12V28L20 36L4 28V12L20 4Z" stroke="#D4850F" strokeWidth="2" fill="none"/>
        <path d="M20 4V36" stroke="#D4850F" strokeWidth="1.5" opacity="0.3"/>
        <path d="M4 12L36 28M36 12L4 28" stroke="#E8A435" strokeWidth="1" opacity="0.2"/>
      </svg>
    ),
  },
  {
    title: "Booking & Scheduling",
    description: "Let customers book online. Manage appointments, staff, and availability effortlessly.",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="6" y="8" width="28" height="28" rx="4" stroke="#D4850F" strokeWidth="2" fill="none"/>
        <path d="M6 16H34" stroke="#D4850F" strokeWidth="1.5"/>
        <line x1="14" y1="4" x2="14" y2="12" stroke="#E8A435" strokeWidth="2" strokeLinecap="round"/>
        <line x1="26" y1="4" x2="26" y2="12" stroke="#E8A435" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="20" cy="26" r="4" fill="#D4850F" opacity="0.2"/>
        <path d="M18 26L20 28L23 24" stroke="#D4850F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Reporting Tools",
    description: "Turn raw data into actionable reports. Custom analytics for your business needs.",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="14" stroke="#D4850F" strokeWidth="2" fill="none"/>
        <path d="M20 6A14 14 0 0120 34" fill="#D4850F" opacity="0.1"/>
        <path d="M20 20L30 10" stroke="#E8A435" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="3" fill="#D4850F"/>
      </svg>
    ),
  },
  {
    title: "Workflow Automation",
    description: "Automate repetitive tasks. Approvals, notifications, data entry — all handled.",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="8" cy="20" r="4" stroke="#D4850F" strokeWidth="2" fill="none"/>
        <circle cx="20" cy="10" r="4" stroke="#D4850F" strokeWidth="2" fill="none"/>
        <circle cx="20" cy="30" r="4" stroke="#D4850F" strokeWidth="2" fill="none"/>
        <circle cx="32" cy="20" r="4" stroke="#E8A435" strokeWidth="2" fill="none"/>
        <path d="M12 20H16M24 12L28 18M24 28L28 22" stroke="#D4850F" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
  },
];

export default function Services() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="services" className="py-32 px-6 relative" style={{ background: "#EDE9E3" }}>
      {/* Section number watermark */}
      <div className="absolute top-16 right-8 section-number">02</div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p className="text-honey text-sm font-medium tracking-widest uppercase mb-4">What We Build</p>
          <h2 className="text-4xl md:text-5xl text-charcoal mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            Tools that fit <span className="gradient-text italic">your business</span>
          </h2>
          <p className="text-warm-gray max-w-xl">
            Every business is different. That&apos;s why off-the-shelf software never quite works. We build exactly what you need.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {services.map((service, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <motion.button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={`w-full flex items-center gap-5 p-6 rounded-2xl text-left transition-all duration-300 ${
                    isOpen
                      ? "bg-white shadow-lg shadow-honey/5 border border-honey/10"
                      : "bg-white/50 hover:bg-white/80 border border-transparent"
                  }`}
                  whileHover={{ x: isOpen ? 0 : 4 }}
                >
                  <div className="shrink-0">{service.svg}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-charcoal">{service.title}</h3>
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-8 h-8 rounded-full border border-charcoal/10 flex items-center justify-center shrink-0 ml-4"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 2V12M2 7H12" stroke="#1E1E2A" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </motion.button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 ml-[60px]">
                        <p className="text-warm-gray leading-relaxed">{service.description}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Diagonal divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-[40px]">
          <path d="M0 60L1440 0V60H0Z" fill="#F7F5F2"/>
        </svg>
      </div>
    </section>
  );
}
