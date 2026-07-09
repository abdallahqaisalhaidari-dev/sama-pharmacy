"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Pill,
  Droplets,
  Citrus,
  Baby,
  SprayCan,
  Stethoscope,
  Leaf,
  Scissors,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/types";

// Icon mapping per category slug
const categoryIcons: Record<string, LucideIcon> = {
  medicines: Pill,
  skincare: Droplets,
  vitamins: Citrus,
  baby: Baby,
  personal_care: SprayCan,
  medical_devices: Stethoscope,
  supplements: Leaf,
  hair_care: Scissors,
};

const fallbackIcons: LucideIcon[] = [
  Pill,
  Droplets,
  Leaf,
  Stethoscope,
  SprayCan,
  Citrus,
];

interface CategoryStripProps {
  categories: Category[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
} as const;

export function CategoryStrip({ categories }: CategoryStripProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section header — centered, mockup style */}
        <div className="flex items-center justify-center relative mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 tracking-wide">
            تسوقي حسب القسم
          </h2>
          <Link
            href="/categories"
            className="absolute left-0 hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-purple-400 hover:text-brand-purple-600 transition-colors"
          >
            <span>عرض الكل</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Category grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {categories.map((category, i) => {
            const Icon =
              categoryIcons[category.slug] ||
              fallbackIcons[i % fallbackIcons.length];

            return (
              <motion.div key={category.id} variants={itemVariants}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="flex items-center gap-4 p-4 md:p-5 bg-white rounded-2xl border border-brand-purple-100/50 shadow-sm hover:shadow-xl hover:shadow-brand-purple-900/8 hover:-translate-y-0.5 hover:border-brand-purple-200 transition-all duration-400 group"
                >
                  {category.image_url ? (
                    <span className="relative block w-13 h-13 md:w-14 md:h-14 shrink-0 overflow-hidden rounded-full ring-1 ring-brand-purple-100 group-hover:ring-brand-purple-300 transition-all duration-400">
                      <Image
                        src={category.image_url}
                        alt={category.name_ar}
                        fill
                        sizes="56px"
                        className="object-cover transition-transform duration-400 group-hover:scale-110"
                      />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center w-13 h-13 md:w-14 md:h-14 shrink-0 rounded-full bg-brand-purple-50 text-brand-purple-500 ring-1 ring-brand-purple-100 group-hover:bg-brand-purple-100 group-hover:text-brand-purple-700 transition-all duration-400">
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </span>
                  )}
                  <span className="text-sm md:text-base font-bold text-brand-purple-900 group-hover:text-brand-purple-600 transition-colors duration-400">
                    {category.name_ar}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
