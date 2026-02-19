"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.9]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.08]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
      style={{
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(247, 245, 242, ${v})`),
        borderBottom: useTransform(borderOpacity, (v) => `1px solid rgba(30,30,42,${v})`),
        backdropFilter: useTransform(scrollY, [0, 100], ["blur(0px)", "blur(20px)"]),
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.a
          href="#"
          className="flex items-center gap-2 text-xl font-bold"
          whileHover={{ scale: 1.02 }}
        >
          {/* Custom flame SVG */}
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 2C16 2 6 14 6 20a10 10 0 0020 0C26 14 16 2 16 2z" fill="#D4850F" opacity="0.9"/>
            <path d="M16 10c0 0-5 6-5 10a5 5 0 0010 0c0-4-5-10-5-10z" fill="#E8A435"/>
          </svg>
          <span className="gradient-text" style={{ fontFamily: "var(--font-serif)" }}>HomeBaked</span>
        </motion.a>

        <div className="hidden md:flex items-center gap-8 text-sm text-warm-gray">
          {["How It Works", "Services", "Pricing"].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="hover:text-charcoal transition-colors duration-300"
              whileHover={{ y: -1 }}
            >
              {item}
            </motion.a>
          ))}
        </div>

        <motion.a
          href="#contact"
          className="px-5 py-2 rounded-full text-sm font-medium bg-honey/10 text-honey-dark border border-honey/20 hover:bg-honey/20 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Get Started
        </motion.a>
      </div>
    </motion.nav>
  );
}
