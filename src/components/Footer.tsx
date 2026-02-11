"use client";

import { Flame } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500" />
          <span className="font-bold gradient-text">HomeBaked</span>
        </div>
        <div className="flex items-center gap-8 text-sm text-white/30">
          <a href="#how-it-works" className="hover:text-white/60 transition-colors">How It Works</a>
          <a href="#services" className="hover:text-white/60 transition-colors">Services</a>
          <a href="#pricing" className="hover:text-white/60 transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-white/60 transition-colors">Contact</a>
        </div>
        <p className="text-white/20 text-sm">© 2026 HomeBaked. All rights reserved.</p>
      </div>
    </footer>
  );
}
