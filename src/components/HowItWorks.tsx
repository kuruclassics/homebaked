"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Tell Us What You Need",
    description: "Describe your workflow, pain points, and dream tool. No technical knowledge required — just tell us how your business works.",
    svg: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="10" width="36" height="28" rx="4" stroke="#D4850F" strokeWidth="2" fill="none"/>
        <path d="M14 22L22 28L34 18" stroke="#E8A435" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="38" cy="10" r="6" fill="#D4850F" opacity="0.15"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "We Build It with AI",
    description: "Our AI-augmented team designs and develops your custom tool in days, not months. You get updates throughout.",
    svg: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 4L44 14V34L24 44L4 34V14L24 4Z" stroke="#D4850F" strokeWidth="2" fill="none"/>
        <path d="M24 4V44M4 14L44 34M44 14L4 34" stroke="#E8A435" strokeWidth="1" opacity="0.4"/>
        <circle cx="24" cy="24" r="5" fill="#D4850F" opacity="0.2"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Launch & Iterate",
    description: "Your tool goes live. We train your team, gather feedback, and iterate until it's perfect for your workflow.",
    svg: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 6L28 18H40L30 26L34 38L24 30L14 38L18 26L8 18H20L24 6Z" stroke="#D4850F" strokeWidth="2" fill="none"/>
        <path d="M24 14L26 20H32L27 24L29 30L24 26L19 30L21 24L16 20H22L24 14Z" fill="#D4850F" opacity="0.15"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 relative">
      {/* Section number watermark */}
      <div className="absolute top-16 left-8 section-number">01</div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <p className="text-honey text-sm font-medium tracking-widest uppercase mb-4">How It Works</p>
          <h2 className="text-4xl md:text-5xl text-charcoal" style={{ fontFamily: "var(--font-serif)" }}>
            From idea to launch in <span className="gradient-text italic">three steps</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connecting line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px origin-top"
            style={{ background: "linear-gradient(180deg, transparent, #D4850F40, #D4850F40, transparent)" }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-24 last:mb-0 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Content side */}
              <div className={`flex-1 ${i % 2 === 1 ? "md:text-right" : "md:text-left"}`}>
                <div className={`flex items-center gap-4 mb-4 ${i % 2 === 1 ? "md:justify-end" : ""}`}>
                  {step.svg}
                  <span className="text-6xl font-bold text-honey/10" style={{ fontFamily: "var(--font-serif)" }}>{step.num}</span>
                </div>
                <h3 className="text-2xl font-bold text-charcoal mb-3" style={{ fontFamily: "var(--font-serif)" }}>{step.title}</h3>
                <p className="text-warm-gray leading-relaxed max-w-md">{step.description}</p>
              </div>

              {/* Center node */}
              <div className="hidden md:flex relative z-10 w-14 h-14 rounded-full bg-cream border-2 border-honey/30 items-center justify-center shrink-0">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.2, type: "spring", stiffness: 200 }}
                  className="w-5 h-5 rounded-full bg-honey"
                />
              </div>

              {/* Empty side for layout */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-[50px]">
          <path d="M0 40C240 70 480 10 720 40C960 70 1200 10 1440 40V80H0V40Z" fill="#EDE9E3"/>
        </svg>
      </div>
    </section>
  );
}
