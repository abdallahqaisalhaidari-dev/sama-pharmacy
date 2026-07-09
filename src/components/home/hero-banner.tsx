"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/utils";
import { useSettings } from "@/components/settings-provider";

/** Hand-drawn lavender sprig (SVG, brand colors) */
function LavenderSprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 260"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* stem */}
      <path
        d="M60 255C58 200 56 150 60 95"
        stroke="#8FA382"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* leaves */}
      <path
        d="M60 200c-14-4-24-14-26-28 14 2 24 12 26 28zM60 175c14-4 24-14 26-28-14 2-24 12-26 28z"
        fill="#A8BC9A"
      />
      {/* flower cluster */}
      {[
        [60, 88],
        [48, 74],
        [72, 74],
        [55, 58],
        [66, 58],
        [48, 44],
        [71, 44],
        [56, 30],
        [65, 30],
        [60, 14],
      ].map(([cx, cy], i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx="9"
          ry="12"
          fill={i % 2 === 0 ? "#9C77AA" : "#B79EC2"}
          opacity="0.9"
        />
      ))}
    </svg>
  );
}

export function HeroBanner() {
  const settings = useSettings();

  return (
    <section className="container mx-auto px-4 pt-4 md:pt-6">
      <div className="relative overflow-hidden rounded-[2rem] min-h-[420px] md:min-h-[500px] flex items-center justify-center bg-gradient-to-b from-[#E9DFF2] via-[#F2EBF7] to-[#FBF9FD]">
        {/* ── Soft photographic atmosphere ── */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 right-[15%] w-80 h-80 rounded-full bg-brand-purple-300/30 blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-[#D9C9E8]/50 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[30rem] h-64 rounded-full bg-white/70 blur-2xl" />
        </div>

        {/* ── Botanical sprigs ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="pointer-events-none absolute bottom-0 right-4 md:right-14 hidden sm:flex items-end gap-0"
        >
          <LavenderSprig className="w-16 md:w-24 h-auto rotate-[8deg]" />
          <LavenderSprig className="w-12 md:w-16 h-auto -rotate-[10deg] -mr-6 opacity-70" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.75, y: 0 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="pointer-events-none absolute bottom-0 left-4 md:left-16 hidden sm:flex items-end"
        >
          <LavenderSprig className="w-14 md:w-20 h-auto -rotate-[6deg]" />
          <LavenderSprig className="w-10 md:w-14 h-auto rotate-[12deg] -ml-6 opacity-60" />
        </motion.div>

        {/* ── Centered content ── */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-heading text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-brand-purple-900 leading-[1.3] mb-6"
          >
            {settings.hero_title_line1}
            <br />
            {settings.hero_title_line2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="text-sm md:text-lg text-brand-purple-800/70 leading-relaxed mb-9 max-w-xl mx-auto"
          >
            {settings.hero_subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-brand-purple-400 px-9 py-3.5 text-sm md:text-base font-bold text-white tracking-wide shadow-lg shadow-brand-purple-400/30 hover:bg-brand-purple-500 transition-all duration-300"
            >
              <span>اكتشف التشكيلة</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <a
              href={generateWhatsAppLink(
                "مرحباً، أود استشارة الصيدلي",
                settings.whatsapp
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-7 py-3.5 text-sm md:text-base font-bold text-brand-purple-700 ring-1 ring-brand-purple-200 hover:bg-white transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              <span>استشارة الصيدلي</span>
            </a>
          </motion.div>
        </div>

        {/* ── Carousel-style dots (decorative) ── */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="w-6 h-1.5 rounded-full bg-brand-purple-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-200" />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-200" />
        </div>
      </div>
    </section>
  );
}
