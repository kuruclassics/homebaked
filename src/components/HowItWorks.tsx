"use client";

import { motion } from "framer-motion";
import { MessageSquare, Cpu, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Tell Us What You Need",
    description: "Describe your workflow, pain points, and dream tool. No technical knowledge required — just tell us how your business works.",
  },
  {
    icon: Cpu,
    title: "We Build It with AI",
    description: "Our AI-augmented team designs and develops your custom tool in days, not months. You get updates throughout.",
  },
  {
    icon: Rocket,
    title: "Launch & Iterate",
    description: "Your tool goes live. We train your team, gather feedback, and iterate until it's perfect for your workflow.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-amber-500 text-sm font-medium tracking-widest uppercase mb-4">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            From idea to launch in <span className="gradient-text">three steps</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants as any}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative grid md:grid-cols-3 gap-8"
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-[16.66%] right-[16.66%] h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-amber-500/0 via-amber-500/40 to-amber-500/0 origin-left"
            />
          </div>

          {steps.map((step, i) => (
            <motion.div key={i} variants={itemVariants as any} className="relative text-center">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/20 flex items-center justify-center"
              >
                <step.icon className="w-8 h-8 text-amber-500" />
              </motion.div>
              <div className="text-amber-500/60 text-sm font-mono mb-2">0{i + 1}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-white/45 leading-relaxed text-sm">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
