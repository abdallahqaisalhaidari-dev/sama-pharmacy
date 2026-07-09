"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, Leaf } from "lucide-react";

const banners = [
  {
    title: "مجموعة العناية بالبشرة",
    subtitle: "خصومات تصل إلى 30%",
    href: "/shop?category=skincare",
    icon: Sparkles,
    gradient: "from-brand-purple-400 via-brand-purple-500 to-brand-purple-600",
  },
  {
    title: "الفيتامينات والمكملات",
    subtitle: "عروض خاصة هذا الأسبوع",
    href: "/shop?category=vitamins",
    icon: Leaf,
    gradient: "from-[#9C8AB8] via-brand-purple-500 to-brand-purple-700",
  },
];

export function PromoBanners() {
  return (
    <section className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {banners.map((banner, i) => {
          const Icon = banner.icon;
          return (
            <motion.div
              key={banner.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Link
                href={banner.href}
                className={`relative flex items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-bl ${banner.gradient} p-7 md:p-9 min-h-[9rem] group shadow-lg shadow-brand-purple-600/15 hover:shadow-xl hover:shadow-brand-purple-600/25 transition-shadow duration-400`}
              >
                {/* Decorative glass circles */}
                <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-md" />
                <div className="pointer-events-none absolute -bottom-14 left-1/3 w-44 h-44 rounded-full bg-white/10 blur-xl" />

                <div className="relative">
                  <h3 className="font-heading text-lg md:text-2xl font-bold text-white mb-1.5">
                    {banner.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/80 mb-4">
                    {banner.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-white/95 group-hover:gap-3 transition-all duration-300">
                    <span>تسوقي الآن</span>
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                </div>

                <span className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/25 text-white group-hover:scale-105 transition-transform duration-400">
                  <Icon className="w-8 h-8 md:w-9 md:h-9" strokeWidth={1.5} />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
