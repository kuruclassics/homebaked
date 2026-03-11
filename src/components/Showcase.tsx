"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useCallback } from "react";

const projects = [
  {
    industry: "Restaurant & Hospitality",
    title: "OrderFlow",
    client: "Casa Bella Restaurant Group",
    description:
      "Real-time kitchen display system with order routing, prep time tracking, and integrated POS sync. Reduced average ticket time by 34% across 3 locations.",
    stats: [
      { label: "Ticket Time", value: "-34%" },
      { label: "Order Accuracy", value: "99.2%" },
      { label: "Locations", value: "3" },
    ],
    color: "#D4850F",
    image: "/mockup-orderflow.png",
  },
  {
    industry: "Real Estate",
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
    image: "/mockup-proppulse.png",
  },
  {
    industry: "Healthcare",
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
    image: "/mockup-intakeiq.png",
  },
  {
    industry: "Construction & Trades",
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
    image: "/mockup-sitebook.png",
  },
  {
    industry: "Legal Services",
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
    image: "/mockup-casevault.png",
  },
];

function getCardStyle(offset: number, isMobile: boolean): React.CSSProperties {
  const absOffset = Math.abs(offset);
  const sign = offset > 0 ? 1 : offset < 0 ? -1 : 0;

  if (isMobile) {
    if (absOffset === 0) {
      return { transform: "translateX(0) scale(1)", zIndex: 10, opacity: 1 };
    }
    if (absOffset === 1) {
      return {
        transform: `translateX(${sign * 85}%) scale(0.85)`,
        zIndex: 8,
        opacity: 0.5,
        filter: "brightness(0.9)",
      };
    }
    return { transform: `translateX(${sign * 150}%) scale(0.7)`, zIndex: 2, opacity: 0, pointerEvents: "none" as const };
  }

  if (absOffset === 0) {
    return { transform: "perspective(1200px) rotateY(0deg) translateX(0) scale(1)", zIndex: 10, opacity: 1, filter: "brightness(1)" };
  }
  if (absOffset === 1) {
    return {
      transform: `perspective(1200px) rotateY(${sign * -35}deg) translateX(${sign * 280}px) scale(0.8)`,
      zIndex: 8,
      opacity: 0.7,
      filter: "brightness(0.85)",
    };
  }
  if (absOffset === 2) {
    return {
      transform: `perspective(1200px) rotateY(${sign * -45}deg) translateX(${sign * 420}px) scale(0.65)`,
      zIndex: 6,
      opacity: 0.4,
      filter: "brightness(0.7)",
    };
  }
  return {
    transform: `perspective(1200px) rotateY(${sign * -50}deg) translateX(${sign * 500}px) scale(0.5)`,
    zIndex: 2,
    opacity: 0,
    filter: "brightness(0.5)",
    pointerEvents: "none" as const,
  };
}

export default function Showcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useCallback((direction: "left" | "right") => {
    setActiveIndex((prev) => {
      if (direction === "right") return Math.min(prev + 1, projects.length - 1);
      return Math.max(prev - 1, 0);
    });
  }, []);

  const active = projects[activeIndex];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Section number watermark */}
      <div className="absolute top-12 left-8 section-number hidden md:block">03</div>

      {/* Header */}
      <div className="px-6 max-w-6xl mx-auto mb-10 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="text-honey text-sm font-medium tracking-widest uppercase mb-4 block">
            Our Work
          </span>
          <h2 className="text-3xl md:text-5xl text-charcoal" style={{ fontFamily: "var(--font-serif)" }}>
            Built for businesses{" "}
            <span className="gradient-text italic">like yours</span>
          </h2>
          <p className="text-warm-gray text-base md:text-lg max-w-2xl mx-auto mt-4">
            Every tool we build solves a real problem. Browse our portfolio.
          </p>
        </motion.div>
      </div>

      {/* Cover Flow Carousel */}
      <div className="relative" style={{ height: "340px" }}>
        {/* Cards container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {projects.map((project, index) => {
            const offset = index - activeIndex;
            const isActive = index === activeIndex;

            return (
              <div
                key={project.title}
                onClick={() => {
                  if (offset === -1) navigate("left");
                  else if (offset === 1) navigate("right");
                }}
                className="absolute transition-all duration-700 ease-[cubic-bezier(0.25,0.4,0.25,1)] w-[min(500px,80vw)] md:w-[min(500px,70vw)]"
                style={{
                  ...getCardStyle(offset, false),
                  cursor: Math.abs(offset) === 1 ? "pointer" : "default",
                  transformStyle: "preserve-3d",
                  transition: "all 0.7s cubic-bezier(0.25, 0.4, 0.25, 1)",
                }}
              >
                <div
                  className="rounded-2xl overflow-hidden bg-white shadow-2xl border border-charcoal/5"
                  style={{
                    boxShadow: isActive
                      ? `0 25px 60px -15px ${project.color}30, 0 15px 30px -10px rgba(0,0,0,0.15)`
                      : "0 10px 30px -10px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* Browser chrome */}
                  <div className="h-6 md:h-7 bg-[#f1f1f1] border-b border-black/5 flex items-center px-2 md:px-3 gap-1.5">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#ff5f57]" />
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#febc2e]" />
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#28c840]" />
                    <div className="flex-1 mx-4 md:mx-6">
                      <div className="h-3.5 md:h-4 bg-white rounded-md max-w-[140px] md:max-w-[180px] mx-auto flex items-center justify-center text-[8px] md:text-[9px] text-black/30 border border-black/5">
                        app.{project.title.toLowerCase()}.io
                      </div>
                    </div>
                  </div>
                  {/* Screenshot */}
                  <div className="relative h-[240px] md:h-[300px]">
                    <Image
                      src={project.image}
                      alt={`${project.title} dashboard`}
                      fill
                      className="object-cover object-top"
                      quality={85}
                      sizes="(max-width: 768px) 80vw, 500px"
                    />
                    {/* Industry badge */}
                    <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-semibold text-white backdrop-blur-md shadow-lg"
                        style={{ backgroundColor: `${project.color}DD` }}
                      >
                        {project.industry}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={() => navigate("left")}
          disabled={activeIndex === 0}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur border border-charcoal/10 flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Previous project"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#1E1E2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => navigate("right")}
          disabled={activeIndex === projects.length - 1}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur border border-charcoal/10 flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Next project"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4L12 9L7 14" stroke="#1E1E2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Project details below carousel */}
      <div className="max-w-2xl mx-auto px-6 mt-8 md:mt-12">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center"
        >
          <h3
            className="text-2xl md:text-3xl font-bold text-charcoal mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {active.title}
          </h3>
          <p className="text-warm-gray-light text-sm mb-3 md:mb-4">
            Built for {active.client}
          </p>
          <p className="text-warm-gray text-sm md:text-base leading-relaxed mb-5 md:mb-6">
            {active.description}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 md:gap-10">
            {active.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-xl md:text-2xl font-bold text-charcoal">{stat.value}</div>
                <div className="text-warm-gray-light text-[9px] md:text-[10px] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8 md:mt-10">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "w-8 bg-honey"
                  : "w-2 bg-charcoal/10 hover:bg-charcoal/20"
              }`}
              aria-label={`Go to project ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
