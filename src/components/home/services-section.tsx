"use client";

import { motion } from "framer-motion";
import {
  Gem,
  ClipboardCheck,
  Truck,
  Stethoscope,
  MessageCircle,
  Award,
  BadgeCheck,
  HeartHandshake,
} from "lucide-react";
import { generateWhatsAppLink } from "@/lib/utils";
import { useSettings } from "@/components/settings-provider";

const whyUs = [
  {
    icon: Gem,
    title: "منتجات أصلية",
    description: "من مصادر موثوقة ومعتمدة",
  },
  {
    icon: ClipboardCheck,
    title: "تشكيلة منسّقة",
    description: "مختارة بعناية صيدلانية",
  },
  {
    icon: Truck,
    title: "توصيل آمن وسريع",
    description: "لجميع محافظات العراق",
  },
  {
    icon: Stethoscope,
    title: "إرشاد خبير",
    description: "استشارة صيدلانية مجانية",
  },
];

const badges = [
  { icon: Award, label: "صيدلي مرخّص" },
  { icon: BadgeCheck, label: "منتجات موثوقة" },
  { icon: HeartHandshake, label: "عناية شخصية" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
} as const;

export function ServicesSection() {
  const settings = useSettings();

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 space-y-16">
        {/* ── Why choose us — minimal icon row ── */}
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 text-center tracking-wide mb-10">
            لماذا تختارين صيدلية سما؟
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 max-w-4xl mx-auto"
          >
            {whyUs.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="flex flex-col items-center text-center"
                >
                  <span className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-white ring-1 ring-brand-purple-100 shadow-sm text-brand-purple-500">
                    <Icon className="w-7 h-7" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-heading text-sm md:text-base font-bold text-brand-purple-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-brand-purple-400 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Pharmacist consultation card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] bg-white shadow-lg shadow-brand-purple-900/5 ring-1 ring-brand-purple-100/50"
        >
          {/* Decorative corner orb */}
          <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full bg-brand-purple-100/50 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-10 p-8 md:p-12">
            {/* Text + CTA */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-purple-50 px-4 py-1.5 text-xs font-semibold text-brand-purple-600 mb-5">
                <MessageCircle className="w-3.5 h-3.5" />
                استشارة مجانية
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-3 leading-snug">
                استشيري الصيدلي قبل الشراء
              </h2>
              <p className="text-sm md:text-base text-brand-purple-400 leading-relaxed mb-7 max-w-md">
                فريقنا الصيدلاني جاهز للإجابة على استفساراتكم حول الأدوية
                ومستحضرات العناية، واختيار الأنسب لاحتياجاتكم — مجاناً وعبر
                واتساب مباشرة.
              </p>
              <a
                href={generateWhatsAppLink(
                  "مرحباً، أود استشارة الصيدلي حول منتج",
                  settings.whatsapp
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-purple-500 px-8 py-3.5 text-sm md:text-base font-bold text-white shadow-lg shadow-brand-purple-500/25 hover:bg-brand-purple-600 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ابدأ الاستشارة الآن</span>
              </a>
            </div>

            {/* Credential badges */}
            <div className="grid grid-cols-3 gap-4">
              {badges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
                    className="flex flex-col items-center gap-3 rounded-2xl bg-brand-purple-50/60 p-5 ring-1 ring-brand-purple-100/60 text-center"
                  >
                    <span className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-bl from-brand-purple-400 to-brand-purple-600 text-white shadow-md shadow-brand-purple-500/25">
                      <Icon className="w-6 h-6" strokeWidth={1.75} />
                    </span>
                    <span className="text-xs font-bold text-brand-purple-900 leading-snug">
                      {badge.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
