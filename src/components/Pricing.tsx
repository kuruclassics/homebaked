"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "2,500",
    description: "Perfect for a single internal tool",
    features: ["1 custom tool", "Up to 5 users", "Basic integrations", "30 days of support", "2 revision rounds"],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "5,000",
    description: "For growing teams with multiple needs",
    features: ["Up to 3 custom tools", "Up to 25 users", "Advanced integrations", "90 days of support", "Unlimited revisions", "Priority development"],
    highlighted: true,
  },
  {
    name: "Scale",
    price: "10,000",
    description: "Full digital transformation",
    features: ["Unlimited tools", "Unlimited users", "Custom API development", "12 months of support", "Unlimited revisions", "Dedicated account manager", "SLA guarantee"],
    highlighted: false,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-amber-500 text-sm font-medium tracking-widest uppercase mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h2>
          <p className="mt-4 text-white/40 max-w-lg mx-auto">
            No hourly rates. No surprises. One price for your complete custom tool.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants as any}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-6 items-start"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={cardVariants as any}
              whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className={`relative p-8 rounded-2xl border transition-all duration-500 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-amber-500/10 to-transparent border-amber-500/30 shadow-lg shadow-amber-500/5"
                  : "glass-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-black text-xs font-bold">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-white/40 text-sm mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-white/35 text-sm ml-1">starting</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-white/55">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-lg shadow-amber-500/20"
                    : "border border-white/10 text-white/70 hover:border-white/20 hover:text-white"
                }`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
