"use client";

import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.9]);
  const bgColor = useTransform(bgOpacity, (v) => `rgba(247, 245, 242, ${v})`);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.08]);
  const borderColor = useTransform(borderOpacity, (v) => `1px solid rgba(30,30,42,${v})`);
  const blur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(20px)"]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 50));

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
      style={{
        backgroundColor: mobileOpen ? "rgba(247, 245, 242, 1)" : bgColor,
        borderBottom: borderColor,
        backdropFilter: mobileOpen || scrolled ? "blur(20px)" : blur,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.a
          href="#"
          className="flex items-center gap-2 text-xl font-bold"
          whileHover={{ scale: 1.02 }}
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 2C16 2 6 14 6 20a10 10 0 0020 0C26 14 16 2 16 2z" fill="#D4850F" opacity="0.9"/>
            <path d="M16 10c0 0-5 6-5 10a5 5 0 0010 0c0-4-5-10-5-10z" fill="#E8A435"/>
          </svg>
          <span className="gradient-text" style={{ fontFamily: "var(--font-serif)" }}>HomeBaked</span>
        </motion.a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-warm-gray">
          {navLinks.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="hover:text-charcoal transition-colors duration-300"
              whileHover={{ y: -1 }}
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.a
            href="#contact"
            className="hidden sm:inline-flex px-5 py-2 rounded-full text-sm font-medium bg-honey/10 text-honey-dark border border-honey/20 hover:bg-honey/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Get Started
          </motion.a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-charcoal/5 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-0.5 bg-charcoal rounded-full"
              transition={{ duration: 0.25 }}
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              className="block w-5 h-0.5 bg-charcoal rounded-full mt-1.5"
              transition={{ duration: 0.2 }}
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-0.5 bg-charcoal rounded-full mt-1.5"
              transition={{ duration: 0.25 }}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="pt-4 pb-4 flex flex-col gap-1 border-t border-charcoal/5 mt-4">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-charcoal hover:bg-honey/5 transition-colors text-base font-medium"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="sm:hidden mt-2 mx-4 px-5 py-3 rounded-full text-center text-sm font-semibold bg-gradient-to-r from-honey to-honey-dark text-white shadow-sm"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
