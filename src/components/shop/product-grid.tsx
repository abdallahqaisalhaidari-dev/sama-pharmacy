"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white py-20 shadow-sm"
      >
        <div className="flex size-20 items-center justify-center rounded-full bg-brand-cream-dark">
          <PackageSearch className="size-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700">لا توجد منتجات</h3>
        <p className="text-sm text-gray-500">
          لم يتم العثور على منتجات في هذا القسم
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </AnimatePresence>
    </div>
  );
}
