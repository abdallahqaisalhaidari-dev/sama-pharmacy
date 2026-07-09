"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types";

const fallbackTestimonials: Pick<
  Testimonial,
  "id" | "name" | "location" | "quote"
>[] = [
  {
    id: "f1",
    quote:
      "خدمة ممتازة وتوصيل سريع، والصيدلي جاوبني على كل استفساراتي قبل الطلب. أنصح الجميع بالتعامل معهم.",
    name: "زينب م.",
    location: "الموصل",
  },
  {
    id: "f2",
    quote:
      "المنتجات أصلية والأسعار مناسبة جداً مقارنة بالسوق. صار مصدري الأساسي لمستحضرات العناية.",
    name: "رغد ع.",
    location: "أربيل",
  },
  {
    id: "f3",
    quote:
      "طلبت فيتامينات لوالدتي ووصلت بنفس اليوم مع شرح كامل عن طريقة الاستخدام. تعامل راقٍ جداً.",
    name: "أحمد س.",
    location: "بغداد",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
} as const;

interface TestimonialsProps {
  items?: Testimonial[];
}

export function Testimonials({ items }: TestimonialsProps) {
  const list = items && items.length > 0 ? items : fallbackTestimonials;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-transparent via-brand-purple-50/40 to-transparent">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 text-center tracking-wide mb-10">
          آراء عملائنا
        </h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {list.map((t) => (
            <motion.div
              key={t.id}
              variants={itemVariants}
              className="relative bg-white rounded-3xl p-7 ring-1 ring-brand-purple-100/50 shadow-sm hover:shadow-lg hover:shadow-brand-purple-900/5 transition-shadow duration-400"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-purple-50 text-brand-purple-400 mb-4">
                <Quote className="w-4 h-4" />
              </span>
              <p className="text-sm text-brand-purple-800/80 leading-relaxed mb-5">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-bl from-brand-purple-400 to-brand-purple-600 text-white text-xs font-bold">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-xs font-bold text-brand-purple-900">
                    {t.name}
                  </span>
                  <span className="block text-[10px] text-brand-purple-400">
                    {t.location}
                  </span>
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
