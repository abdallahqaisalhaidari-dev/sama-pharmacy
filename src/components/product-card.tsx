"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const hasDiscount =
    product.compare_at_price !== null &&
    product.compare_at_price > product.price;

  const discountPercent = hasDiscount
    ? calcDiscount(product.price, product.compare_at_price!)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="group bg-white rounded-[1.25rem] shadow-sm hover:shadow-2xl hover:shadow-brand-purple-900/10 border border-brand-purple-100/30 overflow-hidden transition-all duration-500"
    >
      {/* Image container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-brand-cream"
      >
        {/* Placeholder gradient when no image */}
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name_ar}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-purple-50 to-brand-cream-dark flex items-center justify-center">
            <Sparkles
              className="w-12 h-12 text-brand-purple-200"
              strokeWidth={1.25}
            />
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-[#8B0000] text-white text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded-full shadow-md">
            -{discountPercent}%
          </div>
        )}

        {/* Prescription badge */}
        {product.requires_prescription && (
          <div className="absolute top-4 right-4 bg-brand-purple-800/90 backdrop-blur-md text-white text-[10px] tracking-wider font-bold px-3 py-1.5 rounded-full shadow-sm">
            بوصفة طبية
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Product name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-brand-purple-900 line-clamp-2 mb-4 leading-relaxed min-h-[2.75rem] transition-colors group-hover:text-brand-purple-600">
            {product.name_ar}
          </h3>
        </Link>

        {/* Price section */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-lg font-bold text-brand-purple-900">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-brand-purple-300 line-through">
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>

        {/* Add to cart button — purple pill (mockup style) */}
        <button
          onClick={() => addItem(product)}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-full bg-brand-purple-500 hover:bg-brand-purple-600 text-white text-sm font-bold shadow-md shadow-brand-purple-500/20 transition-all duration-300 active:scale-[0.98]"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>أضف للسلة</span>
        </button>
      </div>
    </motion.div>
  );
}
