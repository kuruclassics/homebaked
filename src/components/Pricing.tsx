"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    price: "2,500",
    description: "Perfect for a single internal tool",
    features: ["1 custom tool", "Up to 5 users", "Basic integrations", "30 days of support", "2 revision rounds", "Company website — $499"],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "5,000",
    description: "For growing teams with multiple needs",
    features: ["Up to 3 custom tools", "Up to 25 users", "Advanced integrations", "90 days of support", "Unlimited revisions", "Priority development", "Company website included"],
    highlighted: true,
  },
  {
    name: "Scale",
    price: "10,000",
    description: "Full digital transformation",
    features: ["Unlimited tools", "Unlimited users", "Custom API development", "12 months of support", "Unlimited revisions", "Dedicated account manager", "SLA guarantee", "Company website included"],
    highlighted: false,
  },
];

export default function Pricing() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(1);

  return (
    <section id="pricing" className="py-32 px-6 relative" style={{ background: "#EDE9E3" }}>
      {/* Section number watermark */}
      <div className="absolute top-16 right-8 section-number">06</div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-honey text-sm font-medium tracking-widest uppercase mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl text-charcoal" style={{ fontFamily: "var(--font-serif)" }}>
            Simple, <span className="gradient-text italic">transparent</span> pricing
          </h2>
          <p className="mt-4 text-warm-gray max-w-lg mx-auto">
            No hourly rates. No surprises. One price for your complete custom tool.
          </p>
        </motion.div>

        {/* Horizontal cards */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => {
            const isActive = hoveredIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                onMouseEnter={() => setHoveredIndex(i)}
                className={`relative p-8 rounded-2xl transition-all duration-500 cursor-pointer ${
                  isActive
                    ? "bg-charcoal text-white shadow-2xl shadow-charcoal/20 scale-[1.02]"
                    : "bg-white text-charcoal shadow-sm"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-honey to-honey-dark text-white text-xs font-bold">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${isActive ? "text-white" : "text-charcoal"}`} style={{ fontFamily: "var(--font-serif)" }}>{plan.name}</h3>
                  <p className={`text-sm ${isActive ? "text-white/50" : "text-warm-gray"}`}>{plan.description}</p>
                </div>

                <div className="mb-8">
                  <span className="text-5xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>${plan.price}</span>
                  <span className={`text-sm ml-2 ${isActive ? "text-white/40" : "text-warm-gray-light"}`}>starting</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className={`flex items-center gap-3 text-sm ${isActive ? "text-white/70" : "text-warm-gray"}`}>
                      {/* Custom check SVG */}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                        <path d="M3 8L6.5 11.5L13 4.5" stroke={isActive ? "#E8A435" : "#D4850F"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-honey to-honey-dark text-white shadow-lg shadow-honey/20"
                      : "border border-charcoal/10 text-charcoal hover:border-charcoal/20"
                  }`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
