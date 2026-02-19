"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import MagneticButton from "./MagneticButton";

import type { Variants } from "framer-motion";

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.3 + i * 0.1,
      duration: 0.8,
      ease: "easeOut" as const,
    },
  }),
};

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(180deg, #F7F5F2 0%, #EDE9E3 100%)" }}>
      {/* Parallax decorative elements */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-honey/5 blur-[80px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-honey/3 blur-[100px]" />
        {/* Geometric accent */}
        <svg className="absolute top-32 right-20 opacity-[0.04]" width="300" height="300" viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="140" stroke="#D4850F" strokeWidth="1" fill="none" />
          <circle cx="150" cy="150" r="100" stroke="#D4850F" strokeWidth="1" fill="none" />
          <circle cx="150" cy="150" r="60" stroke="#D4850F" strokeWidth="1" fill="none" />
        </svg>
        <svg className="absolute bottom-40 left-20 opacity-[0.03]" width="200" height="200" viewBox="0 0 200 200">
          <rect x="20" y="20" width="160" height="160" stroke="#1E1E2A" strokeWidth="1" fill="none" transform="rotate(15 100 100)" />
          <rect x="40" y="40" width="120" height="120" stroke="#1E1E2A" strokeWidth="1" fill="none" transform="rotate(30 100 100)" />
        </svg>
      </motion.div>

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #1E1E2A 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-honey/20 bg-honey/5 text-honey-dark text-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-honey glow-pulse" />
          AI-Powered Software Development
        </motion.div>

        {/* Heading — mixed typography */}
        <h1 className="mb-8">
          {["Custom", "Software,"].map((word, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              className="inline-block mr-[0.25em] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] text-charcoal"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {word}
            </motion.span>
          ))}
          <br className="hidden sm:block" />
          {["Made"].map((word, i) => (
            <motion.span
              key={`s-${i}`}
              custom={i + 2}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              className="inline-block mr-[0.25em] text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-charcoal"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}
            >
              {word}
            </motion.span>
          ))}
          <motion.span
            custom={3}
            variants={wordVariants}
            initial="hidden"
            animate="visible"
            className="inline-block mr-[0.25em] text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] animated-gradient-text"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontStyle: "italic" }}
          >
            Fresh
          </motion.span>
          <br className="hidden sm:block" />
          {["for", "Your", "Business"].map((word, i) => (
            <motion.span
              key={`e-${i}`}
              custom={i + 4}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              className="inline-block mr-[0.25em] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] text-charcoal"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-lg md:text-xl text-warm-gray max-w-2xl mx-auto mb-4 font-light"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
        >
          You think it. We build it.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="text-base md:text-lg text-warm-gray-light max-w-xl mx-auto mb-12 font-light"
        >
          Custom internal tools for your business — CRMs, dashboards, booking systems, and more.
          Built fast, built right, powered by AI.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton>
            <span className="relative z-10 flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-honey to-honey-dark text-white font-semibold text-lg shadow-lg shadow-honey/25 hover:shadow-honey/40 transition-shadow duration-300">
              Start Your Project
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </MagneticButton>

          <motion.a
            href="#how-it-works"
            className="px-8 py-4 rounded-full text-charcoal/60 hover:text-charcoal border border-charcoal/10 hover:border-charcoal/20 transition-all duration-300 font-medium"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            See How It Works
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[60px] md:h-[80px]">
          <path d="M0 60L48 55C96 50 192 40 288 42C384 44 480 58 576 65C672 72 768 72 864 65C960 58 1056 44 1152 40C1248 36 1344 42 1392 45L1440 48V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V60Z" fill="#F7F5F2"/>
        </svg>
      </div>
    </section>
  );
}
