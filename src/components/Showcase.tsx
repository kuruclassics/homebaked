"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

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

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative"
    >
      {/* Full-width card */}
      <div className="rounded-3xl overflow-hidden bg-white border border-charcoal/5 shadow-xl shadow-charcoal/5 hover:shadow-2xl hover:shadow-charcoal/8 transition-shadow duration-500">
        {/* Image section with parallax */}
        <div className="relative overflow-hidden" style={{ height: "clamp(300px, 40vw, 500px)" }}>
          <motion.div style={{ y: imgY }} className="absolute inset-[-30px]">
            <Image
              src={project.image}
              alt={`${project.title} - ${project.industry} dashboard`}
              fill
              className="object-cover"
              quality={90}
            />
          </motion.div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          {/* Industry badge */}
          <div className="absolute top-6 left-6">
            <span
              className="px-4 py-1.5 rounded-full text-xs font-medium text-white backdrop-blur-md"
              style={{ backgroundColor: `${project.color}CC` }}
            >
              {project.industry}
            </span>
          </div>
          {/* Index number */}
          <div className="absolute top-6 right-6 text-6xl font-bold opacity-20 text-white" style={{ fontFamily: "var(--font-serif)" }}>
            0{index + 1}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-charcoal mb-1" style={{ fontFamily: "var(--font-serif)" }}>{project.title}</h3>
              <p className="text-warm-gray-light text-sm mb-4">Built for {project.client}</p>
              <p className="text-warm-gray leading-relaxed max-w-xl">{project.description}</p>
            </div>

            {/* Stats */}
            <div className="flex md:flex-col gap-6 md:gap-4 md:text-right shrink-0">
              {project.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-charcoal">{stat.value}</div>
                  <div className="text-warm-gray-light text-xs uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Showcase() {
  return (
    <section className="relative py-32 px-6">
      {/* Section number watermark */}
      <div className="absolute top-16 left-8 section-number">03</div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-honey text-sm font-medium tracking-widest uppercase mb-4 block">
            Our Work
          </span>
          <h2 className="text-4xl md:text-5xl text-charcoal mb-6" style={{ fontFamily: "var(--font-serif)" }}>
            Built for businesses{" "}
            <span className="gradient-text italic">like yours</span>
          </h2>
          <p className="text-warm-gray text-lg max-w-2xl mx-auto">
            Every tool we build solves a real problem. Here&apos;s a look at what we&apos;ve
            delivered for businesses across industries.
          </p>
        </motion.div>

        <div className="space-y-16">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
