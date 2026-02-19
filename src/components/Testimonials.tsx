"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "We needed a custom booking system and HomeBaked delivered in two weeks. It would have taken our last agency three months and cost five times more.",
    name: "Sarah Chen",
    role: "Owner, Bloom & Branch Floristry",
  },
  {
    quote: "Our inventory was managed in spreadsheets for years. Now we have a real system that alerts us before we run out of stock. Game changer.",
    name: "Marcus Rivera",
    role: "Operations Manager, Rivera Auto Parts",
  },
  {
    quote: "I described what I wanted in a 20-minute call. A week later, I had a working CRM that actually fits how we sell. Unbelievable.",
    name: "David Okonkwo",
    role: "Founder, Clearpath Consulting",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Testimonials() {
  return (
    <section className="py-32 px-6 relative">
      {/* Section number watermark */}
      <div className="absolute top-16 left-8 section-number">05</div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-honey text-sm font-medium tracking-widest uppercase mb-4">Testimonials</p>
          <h2 className="text-4xl md:text-5xl text-charcoal" style={{ fontFamily: "var(--font-serif)" }}>
            Loved by <span className="gradient-text italic">business owners</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-white border border-charcoal/5 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Stars — custom SVG */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 16 16" fill="#D4850F">
                    <path d="M8 1l2.2 4.4L15 6.3l-3.5 3.4.8 4.9L8 12.4 3.7 14.6l.8-4.9L1 6.3l4.8-.9L8 1z"/>
                  </svg>
                ))}
              </div>
              {/* Quote mark */}
              <div className="text-5xl text-honey/15 leading-none mb-2" style={{ fontFamily: "var(--font-serif)" }}>&ldquo;</div>
              <p className="text-warm-gray text-sm leading-relaxed mb-6 flex-1">{t.quote}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-charcoal/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-honey/20 to-honey-dark/10 flex items-center justify-center text-honey-dark font-semibold text-sm" style={{ fontFamily: "var(--font-serif)" }}>
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-charcoal text-sm font-medium">{t.name}</p>
                  <p className="text-warm-gray-light text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-[50px]">
          <path d="M0 20C360 60 720 0 1080 40C1260 55 1380 30 1440 20V80H0V20Z" fill="#EDE9E3"/>
        </svg>
      </div>
    </section>
  );
}
