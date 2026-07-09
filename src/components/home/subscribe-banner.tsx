"use client";

import { motion } from "framer-motion";
import { MessageCircle, BellRing } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/utils";
import { useSettings } from "@/components/settings-provider";

export function SubscribeBanner() {
  const settings = useSettings();

  return (
    <section className="container mx-auto px-4 pb-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-bl from-brand-purple-500 via-brand-purple-600 to-brand-purple-700 px-8 py-12 md:px-14 md:py-14 text-center"
      >
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-brand-purple-300/20 blur-3xl" />

        <div className="relative max-w-xl mx-auto">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/15 ring-1 ring-white/25 text-white mb-5">
            <BellRing className="w-6 h-6" strokeWidth={1.75} />
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
            كوني أول من يعرف بالعروض
          </h2>
          <p className="text-sm md:text-base text-white/75 leading-relaxed mb-8">
            انضمي إلى قائمة عملائنا على واتساب ليصلك كل جديد من العروض
            والمنتجات — بدون إزعاج، ويمكنك الإلغاء في أي وقت.
          </p>
          <a
            href={generateWhatsAppLink(
              "مرحباً، أود الانضمام إلى قائمة عروض صيدلية سما",
              settings.whatsapp
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-9 py-3.5 text-sm md:text-base font-bold text-brand-purple-700 shadow-lg hover:bg-brand-purple-50 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            <span>اشتركي عبر واتساب</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
