"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Pill } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  // Cart lives in localStorage — render after mount to avoid hydration mismatch
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return <div className="min-h-[60vh]" />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-brand-purple-50 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-brand-purple-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            سلة المشتريات فارغة
          </h1>
          <p className="text-gray-500 mb-8">
            لم تضف أي منتجات بعد. تصفح متجرنا واختر ما يناسبك
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-brand-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-purple-700 transition-all duration-300 shadow-lg shadow-brand-purple-200"
          >
            تصفح المتجر
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">سلة المشتريات</h1>
        <p className="text-gray-500 mt-1">
          {items.length} {items.length === 1 ? "منتج" : "منتجات"} في السلة
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-4 shadow-md flex gap-4 items-center"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-brand-cream-dark flex-shrink-0">
                  {item.product.images?.[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name_ar}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-purple-300">
                      <Pill className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2">
                    {item.product.name_ar}
                  </h3>
                  <p className="text-brand-purple-600 font-bold mt-1">
                    {formatPrice(item.product.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-lg bg-brand-cream-dark flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-lg bg-brand-cream-dark flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Line Total & Remove */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <p className="font-bold text-gray-900 text-sm md:text-base">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl p-6 shadow-md sticky top-28">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              ملخص الطلب
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>المجموع الفرعي</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>رسوم التوصيل</span>
                <span className="text-sm text-gray-400">
                  تحدد عند الطلب
                </span>
              </div>
              <div className="h-px bg-gray-200 my-3" />
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>المجموع</span>
                <span className="text-brand-purple-600">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-brand-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-purple-700 transition-all duration-300 shadow-lg shadow-brand-purple-200"
            >
              إتمام الطلب
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <Link
              href="/shop"
              className="w-full flex items-center justify-center gap-2 mt-3 text-brand-purple-600 py-3 rounded-xl font-semibold hover:bg-brand-purple-50 transition-all duration-300"
            >
              متابعة التسوق
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
