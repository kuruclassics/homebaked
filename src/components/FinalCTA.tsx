"use client";

import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

export default function FinalCTA() {
  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      {/* Warm gradient background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1E1E2A 0%, #2D2D3D 50%, #1E1E2A 100%)" }} />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-honey/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-honey/3 blur-[100px]" />
        {/* Geometric */}
        <svg className="absolute top-10 right-10 opacity-[0.03]" width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="1" fill="none"/>
          <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="1" fill="none"/>
          <circle cx="100" cy="100" r="30" stroke="white" strokeWidth="1" fill="none"/>
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <h2 className="text-4xl md:text-6xl text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
          Ready to bake{" "}
          <span className="animated-gradient-text italic">something great</span>?
        </h2>
        <p className="text-white/45 text-lg mb-10 max-w-xl mx-auto">
          Tell us about your business and the tool you need. We&apos;ll get back to you within 24 hours with a plan and timeline.
        </p>
        <MagneticButton>
          <span className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-gradient-to-r from-honey to-honey-dark text-white font-semibold text-lg shadow-lg shadow-honey/25 hover:shadow-honey/40 transition-shadow duration-300 cursor-pointer">
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
