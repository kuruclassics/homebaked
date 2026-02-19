"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";

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

export default function Showcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    
    // Determine active card based on scroll position
    const cardWidth = el.clientWidth * 0.75;
    const gap = 24;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(idx, projects.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const scrollTo = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth * 0.75 + 24;
    el.scrollBy({ left: direction === "right" ? cardWidth : -cardWidth, behavior: "smooth" });
  };

  const scrollToIndex = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth * 0.75 + 24;
    el.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Section number watermark */}
      <div className="absolute top-16 left-8 section-number">03</div>

      {/* Header */}
      <div className="px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-honey text-sm font-medium tracking-widest uppercase mb-4 block">
              Our Work
            </span>
            <h2 className="text-4xl md:text-5xl text-charcoal" style={{ fontFamily: "var(--font-serif)" }}>
              Built for businesses{" "}
              <span className="gradient-text italic">like yours</span>
            </h2>
            <p className="text-warm-gray text-lg max-w-xl mt-4">
              Every tool we build solves a real problem. Swipe through our portfolio.
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => scrollTo("left")}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                canScrollLeft
                  ? "border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal cursor-pointer"
                  : "border-charcoal/8 text-charcoal/20 cursor-not-allowed"
              }`}
              aria-label="Previous project"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => scrollTo("right")}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                canScrollRight
                  ? "border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal cursor-pointer"
                  : "border-charcoal/8 text-charcoal/20 cursor-not-allowed"
              }`}
              aria-label="Next project"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-sm text-warm-gray-light ml-2 font-medium tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Horizontal scroll carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            paddingLeft: "max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))",
            paddingRight: "2rem",
          }}
        >
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="shrink-0 snap-start"
              style={{ width: "min(75vw, 640px)" }}
            >
              <div
                className="rounded-2xl overflow-hidden bg-white border border-charcoal/5 shadow-lg hover:shadow-xl transition-all duration-500 group h-full flex flex-col"
                style={{ boxShadow: `0 4px 30px ${project.color}10` }}
              >
                {/* Browser chrome + image */}
                <div className="relative overflow-hidden" style={{ height: "280px" }}>
                  {/* Browser bar */}
                  <div className="absolute top-0 left-0 right-0 z-10 h-8 bg-gradient-to-b from-black/40 to-transparent flex items-center px-3 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <div className="flex-1 mx-4">
                      <div className="h-4 bg-white/10 rounded-md max-w-[200px] mx-auto flex items-center justify-center text-[9px] text-white/50">
                        app.{project.title.toLowerCase()}.io
                      </div>
                    </div>
                  </div>
                  <Image
                    src={project.image}
                    alt={`${project.title} dashboard`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    quality={85}
                  />
                  {/* Industry badge */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span
                      className="px-3 py-1 rounded-full text-[11px] font-semibold text-white backdrop-blur-md"
                      style={{ backgroundColor: `${project.color}DD` }}
                    >
                      {project.industry}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3
                        className="text-2xl font-bold text-charcoal"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {project.title}
                      </h3>
                      <p className="text-warm-gray-light text-xs mt-0.5">
                        Built for {project.client}
                      </p>
                    </div>
                    <span className="text-4xl font-bold text-charcoal/5 shrink-0" style={{ fontFamily: "var(--font-serif)" }}>
                      0{index + 1}
                    </span>
                  </div>
                  <p className="text-warm-gray text-sm leading-relaxed flex-1">
                    {project.description}
                  </p>

                  {/* Stats row */}
                  <div className="flex gap-6 mt-5 pt-5 border-t border-charcoal/5">
                    {project.stats.map((stat) => (
                      <div key={stat.label}>
                        <div className="text-lg font-bold text-charcoal">{stat.value}</div>
                        <div className="text-warm-gray-light text-[10px] uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "w-8 bg-honey"
                  : "w-2 bg-charcoal/10 hover:bg-charcoal/20"
              }`}
              aria-label={`Go to project ${idx + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
