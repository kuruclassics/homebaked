"use client";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-charcoal/5 bg-cream">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path d="M16 2C16 2 6 14 6 20a10 10 0 0020 0C26 14 16 2 16 2z" fill="#D4850F" opacity="0.9"/>
            <path d="M16 10c0 0-5 6-5 10a5 5 0 0010 0c0-4-5-10-5-10z" fill="#E8A435"/>
          </svg>
          <span className="font-bold gradient-text" style={{ fontFamily: "var(--font-serif)" }}>HomeBaked</span>
        </div>
        <div className="flex items-center gap-8 text-sm text-warm-gray">
          <a href="#how-it-works" className="hover:text-charcoal transition-colors">How It Works</a>
          <a href="#services" className="hover:text-charcoal transition-colors">Services</a>
          <a href="#pricing" className="hover:text-charcoal transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-charcoal transition-colors">Contact</a>
        </div>
        <p className="text-warm-gray-light text-sm">© 2026 HomeBaked. All rights reserved.</p>
      </div>
    </footer>
  );
}
