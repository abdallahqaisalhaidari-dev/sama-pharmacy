"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Tag,
} from "lucide-react";
import type { Product } from "@/lib/types";
import {
  formatPrice,
  calcDiscount,
  generateWhatsAppLink,
} from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const discount = calcDiscount(product.price, product.compare_at_price ?? 0);
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["https://placehold.co/600x600/f3f4f6/9ca3af?text=صيدلية+سما"];

  const inStock = product.stock_quantity > 0;
  const lowStock =
    inStock && product.stock_quantity <= product.low_stock_threshold;

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem(product, quantity);
    setQuantity(1);
  };

  const whatsappMessage = `مرحباً، أرغب باستشارة الصيدلي حول هذا المنتج:\n\n📦 ${product.name_ar}${product.sku ? `\n🔖 رمز المنتج: ${product.sku}` : ""}\n\nلدي استفسار حول طريقة الاستخدام والجرعة المناسبة.`;
  const whatsappLink = generateWhatsAppLink(whatsappMessage);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="grid gap-8 lg:grid-cols-2 lg:gap-12"
    >
      {/* ───── Image Gallery ───── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-4"
      >
        {/* Main Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-cream shadow-lg">
          {discount > 0 && (
            <div className="absolute top-4 start-4 z-10 rounded-full bg-red-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg">
              خصم {discount}%
            </div>
          )}
          {product.requires_prescription && (
            <div className="absolute top-4 end-4 z-10 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-800 shadow">
              يحتاج وصفة طبية
            </div>
          )}
          <Image
            src={images[selectedImage]}
            alt={product.name_ar}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  selectedImage === idx
                    ? "border-brand-purple-600 shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name_ar} - ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* ───── Product Info ───── */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col gap-5"
      >
        {/* Category Badge */}
        {product.category && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-purple-100 px-3 py-1 text-xs font-semibold text-brand-purple-800">
            <Tag className="size-3.5" />
            {product.category.name_ar}
          </span>
        )}

        {/* Name */}
        <h1 className="text-3xl font-bold leading-snug text-gray-900">
          {product.name_ar}
        </h1>

        {/* Price Section */}
        <div className="flex items-center gap-4">
          <span className="text-3xl font-extrabold text-brand-purple-700">
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price &&
            product.compare_at_price > product.price && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          {discount > 0 && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-600">
              وفّر {discount}%
            </span>
          )}
        </div>

        {/* Description */}
        {product.description_ar && (
          <div className="rounded-2xl bg-brand-cream p-5">
            <h3 className="mb-2 text-sm font-bold text-gray-500">
              وصف المنتج
            </h3>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {product.description_ar}
            </p>
          </div>
        )}

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          {inStock ? (
            lowStock ? (
              <>
                <AlertTriangle className="size-5 text-amber-500" />
                <span className="text-sm font-medium text-amber-600">
                  الكمية محدودة — متبقي {product.stock_quantity} فقط
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-5 text-brand-purple-600" />
                <span className="text-sm font-medium text-brand-purple-700">
                  متوفر في المخزن
                </span>
              </>
            )
          ) : (
            <>
              <XCircle className="size-5 text-red-500" />
              <span className="text-sm font-medium text-red-600">
                غير متوفر حالياً
              </span>
            </>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-gray-700">الكمية:</span>
          <div className="flex items-center gap-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex size-10 items-center justify-center text-gray-600 transition-colors hover:bg-brand-cream-dark disabled:text-gray-300"
            >
              <Minus className="size-4" />
            </motion.button>
            <span className="flex w-12 items-center justify-center text-center text-base font-bold text-gray-900">
              {quantity}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setQuantity((q) =>
                  Math.min(product.stock_quantity, q + 1)
                )
              }
              disabled={quantity >= product.stock_quantity}
              className="flex size-10 items-center justify-center text-gray-600 transition-colors hover:bg-brand-cream-dark disabled:text-gray-300"
            >
              <Plus className="size-4" />
            </motion.button>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            disabled={!inStock}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-purple-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-brand-purple-600/25 transition-colors hover:bg-brand-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
          >
            <ShoppingCart className="size-5" />
            أضف للسلة
          </motion.button>

          <motion.a
            whileTap={{ scale: 0.97 }}
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-green-500 px-6 py-4 text-base font-bold text-green-600 transition-colors hover:bg-green-50"
          >
            {/* WhatsApp Icon */}
            <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            استشر الصيدلي حول المنتج
          </motion.a>
        </div>

        {/* SKU */}
        {product.sku && (
          <p className="text-xs text-gray-400">
            رمز المنتج: {product.sku}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
