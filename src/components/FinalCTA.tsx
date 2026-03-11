"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function FinalCTA() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section id="contact" className="py-20 md:py-32 px-6 relative overflow-hidden">
      {/* Warm gradient background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1E1E2A 0%, #2D2D3D 50%, #1E1E2A 100%)" }} />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-honey/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-honey/3 blur-[100px]" />
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
        className="max-w-2xl mx-auto relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-6xl text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
            Ready to bake{" "}
            <span className="animated-gradient-text italic">something great</span>?
          </h2>
          <p className="text-white/45 text-base md:text-lg max-w-xl mx-auto">
            Tell us about your business and the tool you need. We&apos;ll get back to you within 24 hours with a plan and timeline.
          </p>
        </div>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-honey/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-honey" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl text-white font-semibold mb-2" style={{ fontFamily: "var(--font-serif)" }}>
              Thank you!
            </h3>
            <p className="text-white/50">
              We&apos;ll review your project and get back to you within 24 hours.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-honey/40 focus:border-honey/40 transition-all text-sm"
              />
              <input
                type="email"
                placeholder="Your email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-honey/40 focus:border-honey/40 transition-all text-sm"
              />
            </div>
            <textarea
              placeholder="What do you want to build?"
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-honey/40 focus:border-honey/40 transition-all text-sm resize-none"
            />

            {status === "error" && (
              <p className="text-red-400 text-sm">{errorMsg}</p>
            )}

            <div className="text-center">
              <motion.button
                type="submit"
                disabled={status === "submitting"}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 md:px-10 md:py-5 rounded-full bg-gradient-to-r from-honey to-honey-dark text-white font-semibold text-base md:text-lg shadow-lg shadow-honey/25 hover:shadow-honey/40 transition-shadow duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? (
                  "Sending..."
                ) : (
                  <>
                    Let&apos;s Talk About Your Project
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </motion.button>
              <p className="mt-6 text-white/25 text-sm">No commitment required. Free consultation.</p>
            </div>
          </form>
        )}
      </motion.div>
    </section>
  );
}
