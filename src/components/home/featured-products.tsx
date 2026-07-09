"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";

interface FeaturedProductsProps {
  products: Product[];
}

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

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        {/* Section Header — centered, mockup style */}
        <div className="flex items-center justify-center relative mb-3">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 tracking-wide">
            تشكيلات مميزة
          </h2>
          <Link
            href="/shop"
            className="absolute left-0 hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-purple-400 hover:text-brand-purple-600 transition-colors"
          >
            <span>عرض الكل</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
        <p className="text-sm text-brand-purple-400 text-center mb-9">
          اخترناها لكم بعناية من أفضل الماركات
        </p>

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
