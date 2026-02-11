"use client";

import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

export default function FinalCTA() {
  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="orb-1 absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[120px]" />
        <div className="orb-2 absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-orange-600/6 blur-[100px]" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Ready to bake <span className="animated-gradient-text">something great</span>?
        </h2>
        <p className="text-white/45 text-lg mb-10 max-w-xl mx-auto">
          Tell us about your business and the tool you need. We&apos;ll get back to you within 24 hours with a plan and timeline.
        </p>
        <MagneticButton>
          <span className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-semibold text-lg shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-shadow duration-300 cursor-pointer">
            Let&apos;s Talk About Your Project
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </MagneticButton>
        <p className="mt-6 text-white/25 text-sm">No commitment required. Free consultation.</p>
      </motion.div>
    </section>
  );
}
