"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import { Zap, Clock, DollarSign, HeartHandshake } from "lucide-react";

const stats = [
  { value: 10, suffix: "x", label: "Faster than traditional development" },
  { value: 80, suffix: "%", label: "Cost reduction vs. agencies" },
  { value: 48, suffix: "h", label: "Average time to first prototype" },
  { value: 100, suffix: "%", label: "Custom-built for your workflow" },
];

const benefits = [
  { icon: DollarSign, title: "10x More Affordable", description: "AI lets us build faster and pass the savings to you. Enterprise-quality tools at SMB prices." },
  { icon: Clock, title: "Days, Not Months", description: "Traditional dev takes months. We deliver working prototypes in 48 hours and launch in weeks." },
  { icon: Zap, title: "Perfectly Custom", description: "No forcing your process into rigid software. We build tools that match how YOU work." },
  { icon: HeartHandshake, title: "Ongoing Partnership", description: "We don't disappear after launch. Continuous support, updates, and improvements included." },
];

export default function WhyHomeBaked() {
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-amber-500 text-sm font-medium tracking-widest uppercase mb-4">Why HomeBaked</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Software that&apos;s <span className="gradient-text">actually built for you</span>
          </h2>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6 glass-card">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-white/40 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Benefits grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card p-7 flex gap-5"
            >
              <div className="w-12 h-12 shrink-0 rounded-xl bg-amber-500/10 border border-amber-500/10 flex items-center justify-center">
                <benefit.icon className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{benefit.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
