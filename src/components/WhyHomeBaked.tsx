"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
  { value: 10, suffix: "x", label: "Faster than traditional development" },
  { value: 80, suffix: "%", label: "Cost reduction vs. agencies" },
  { value: 48, suffix: "h", label: "Average time to first prototype" },
  { value: 100, suffix: "%", label: "Custom-built for your workflow" },
];

const benefits = [
  {
    title: "10x More Affordable",
    description: "AI lets us build faster and pass the savings to you. Enterprise-quality tools at SMB prices.",
    svg: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="14" stroke="#D4850F" strokeWidth="2" fill="none"/>
        <path d="M18 10V26M14 14C14 12 16 10 18 10S22 12 22 14C22 17 14 17 14 20C14 22 16 24 18 24S22 22 22 24" stroke="#D4850F" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Days, Not Months",
    description: "Traditional dev takes months. We deliver working prototypes in 48 hours and launch in weeks.",
    svg: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="14" stroke="#D4850F" strokeWidth="2" fill="none"/>
        <path d="M18 10V18L24 22" stroke="#E8A435" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="18" cy="18" r="2" fill="#D4850F"/>
      </svg>
    ),
  },
  {
    title: "Perfectly Custom",
    description: "No forcing your process into rigid software. We build tools that match how YOU work.",
    svg: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 4L32 12V24L18 32L4 24V12L18 4Z" stroke="#D4850F" strokeWidth="2" fill="none"/>
        <path d="M12 18L16 22L24 14" stroke="#E8A435" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Ongoing Partnership",
    description: "We don't disappear after launch. Continuous support, updates, and improvements included.",
    svg: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 6C12 6 8 12 8 16C8 24 18 32 18 32C18 32 28 24 28 16C28 12 24 6 18 6Z" stroke="#D4850F" strokeWidth="2" fill="none"/>
        <path d="M14 16C14 14 16 12 18 12S22 14 22 16C22 20 18 22 18 22" stroke="#E8A435" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
  },
];

export default function WhyHomeBaked() {
  return (
    <section className="py-32 px-6 relative" style={{ background: "linear-gradient(180deg, #F7F5F2 0%, #EDE9E3 50%, #F7F5F2 100%)" }}>
      {/* Section number watermark */}
      <div className="absolute top-16 right-8 section-number">04</div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-honey text-sm font-medium tracking-widest uppercase mb-4">Why HomeBaked</p>
          <h2 className="text-4xl md:text-5xl text-charcoal" style={{ fontFamily: "var(--font-serif)" }}>
            Software that&apos;s <span className="gradient-text italic">actually built for you</span>
          </h2>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
              className="text-center p-8 rounded-2xl bg-white border border-charcoal/5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-warm-gray text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits — 2x2 with custom SVGs */}
        <div className="grid sm:grid-cols-2 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl bg-white border border-charcoal/5 flex gap-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-honey/5 border border-honey/10 flex items-center justify-center">
                {benefit.svg}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-charcoal mb-1" style={{ fontFamily: "var(--font-serif)" }}>{benefit.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
