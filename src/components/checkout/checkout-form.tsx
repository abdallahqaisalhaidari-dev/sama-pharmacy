"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  MapPin,
  User,
  FileText,
  Truck,
  Loader2,
  CheckCircle2,
  MessageCircle,
  Banknote,
  Pill,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import type { Governorate, CheckoutFormData } from "@/lib/types";

interface Props {
  governorates: Governorate[];
  whatsappNumber?: string;
}

export default function CheckoutForm({ governorates, whatsappNumber }: Props) {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Cart lives in localStorage — render after mount to avoid hydration mismatch
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [formData, setFormData] = useState<CheckoutFormData>({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    governorate_id: "",
    notes: "",
  });

  // Find selected governorate and its fee
  const selectedGovernorate = useMemo(
    () => governorates.find((g) => g.id === formData.governorate_id),
    [formData.governorate_id, governorates]
  );

  const subtotal = getSubtotal();
  const deliveryFee = selectedGovernorate?.delivery_fee || 0;
  const total = subtotal + deliveryFee;

  // Form validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "يرجى إدخال الاسم الكامل";
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = "يرجى إدخال رقم الهاتف";
    } else if (!/^07[3-9]\d{8}$/.test(formData.customer_phone.replace(/\s/g, ""))) {
      newErrors.customer_phone = "يرجى إدخال رقم هاتف عراقي صحيح (مثال: 07701234567)";
    }

    if (!formData.governorate_id) {
      newErrors.governorate_id = "يرجى اختيار المحافظة";
    }

    if (!formData.customer_address.trim()) {
      newErrors.customer_address = "يرجى إدخال العنوان التفصيلي";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      // 1+2. Create the order + items atomically via secure RPC
      // (prices are computed server-side from the products table)
      const { data: order, error: orderError } = await supabase
        .rpc("create_order", {
          p_customer_name: formData.customer_name.trim(),
          p_customer_phone: formData.customer_phone.trim(),
          p_customer_address: formData.customer_address.trim(),
          p_governorate_id: formData.governorate_id,
          p_notes: formData.notes?.trim() || "",
          p_items: items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
        })
        .single<{ order_id: string; order_number: string; total: number }>();

      if (orderError || !order) {
        throw orderError || new Error("no order returned");
      }

      // 3. Build WhatsApp message
      const itemsList = items
        .map(
          (item) =>
            `• ${item.product.name_ar} × ${item.quantity} = ${formatPrice(
              item.product.price * item.quantity
            )}`
        )
        .join("\n");

      const whatsappMessage = `🛒 *طلب جديد من صيدلية سما السكر*

📋 *رقم الطلب:* ${order.order_number}
👤 *الاسم:* ${formData.customer_name}
📱 *الهاتف:* ${formData.customer_phone}
📍 *المحافظة:* ${selectedGovernorate!.name_ar}
🏠 *العنوان:* ${formData.customer_address}

━━━━━━━━━━━━━━━
📦 *المنتجات:*
${itemsList}
━━━━━━━━━━━━━━━
💰 المجموع الفرعي: ${formatPrice(subtotal)}
🚚 رسوم التوصيل: ${formatPrice(deliveryFee)}
✅ *الإجمالي: ${formatPrice(total)}*

💵 الدفع: عند الاستلام
${formData.notes ? `\n📝 ملاحظات: ${formData.notes}` : ""}`;

      // 4. Clear cart
      clearCart();

      // 5. Redirect to WhatsApp
      const whatsappLink = generateWhatsAppLink(whatsappMessage, whatsappNumber);
      window.open(whatsappLink, "_blank");

      // 6. Navigate to success-like state or stay with confirmation
      router.push(`/checkout/success?order=${order.order_number}`);
    } catch (error) {
      console.error("Checkout error:", error);
      const detail =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message || "";
      alert(
        `حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.${
          detail ? `\n(${detail})` : ""
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hydrated) {
    return <div className="min-h-[60vh]" />;
  }

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-brand-purple-50 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-brand-purple-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            السلة فارغة
          </h1>
          <p className="text-gray-500 mb-6">أضف منتجات قبل إتمام الطلب</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-brand-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-purple-700 transition-all"
          >
            تصفح المتجر
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">إتمام الطلب</h1>
        <p className="text-gray-500 mt-1">أكمل بياناتك لإرسال الطلب عبر واتساب</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Personal Info Section */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-purple-600" />
                المعلومات الشخصية
              </h2>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="أدخل اسمك الكامل"
                    className={`w-full px-4 py-3 rounded-xl border bg-brand-cream focus:bg-white focus:ring-2 focus:ring-brand-purple-500 focus:border-brand-purple-500 outline-none transition-all ${
                      errors.customer_name ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.customer_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    placeholder="07701234567"
                    dir="ltr"
                    className={`w-full px-4 py-3 rounded-xl border bg-brand-cream focus:bg-white focus:ring-2 focus:ring-brand-purple-500 focus:border-brand-purple-500 outline-none transition-all text-left ${
                      errors.customer_phone ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.customer_phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Info Section */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-purple-600" />
                معلومات التوصيل
              </h2>

              <div className="space-y-4">
                {/* Governorate Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    المحافظة <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="governorate_id"
                    value={formData.governorate_id}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border bg-brand-cream focus:bg-white focus:ring-2 focus:ring-brand-purple-500 focus:border-brand-purple-500 outline-none transition-all appearance-none ${
                      errors.governorate_id ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  >
                    <option value="">اختر المحافظة</option>
                    {governorates.map((gov) => (
                      <option key={gov.id} value={gov.id}>
                        {gov.name_ar} — رسوم التوصيل: {formatPrice(gov.delivery_fee)}
                      </option>
                    ))}
                  </select>
                  {errors.governorate_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.governorate_id}</p>
                  )}

                  {/* Dynamic delivery fee display */}
                  <AnimatePresence>
                    {selectedGovernorate && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 px-4 py-2 bg-brand-purple-50 rounded-lg border border-brand-purple-100"
                      >
                        <p className="text-brand-purple-700 text-sm font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          رسوم التوصيل إلى {selectedGovernorate.name_ar}:{" "}
                          <span className="font-bold">
                            {formatPrice(selectedGovernorate.delivery_fee)}
                          </span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    العنوان التفصيلي <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="customer_address"
                    value={formData.customer_address}
                    onChange={handleChange}
                    placeholder="الحي، الشارع، أقرب نقطة دالة..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border bg-brand-cream focus:bg-white focus:ring-2 focus:ring-brand-purple-500 focus:border-brand-purple-500 outline-none transition-all resize-none ${
                      errors.customer_address ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.customer_address && (
                    <p className="text-red-500 text-sm mt-1">{errors.customer_address}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    ملاحظات (اختياري)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="أي ملاحظات إضافية على الطلب..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-brand-cream focus:bg-white focus:ring-2 focus:ring-brand-purple-500 focus:border-brand-purple-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-purple-600" />
                طريقة الدفع
              </h2>
              <div className="flex items-center gap-3 p-4 bg-brand-purple-50 rounded-xl border border-brand-purple-100">
                <div className="w-10 h-10 rounded-full bg-brand-purple-100 flex items-center justify-center text-brand-purple-700">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">الدفع عند الاستلام</p>
                  <p className="text-sm text-gray-500">
                    ادفع نقداً عند استلام طلبك
                  </p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-brand-purple-500 mr-auto" />
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-28">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                ملخص الطلب
              </h2>

              {/* Items List */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-cream-dark flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name_ar}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-purple-300">
                          <Pill className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.product.name_ar}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>رسوم التوصيل</span>
                  <span>
                    {selectedGovernorate
                      ? formatPrice(deliveryFee)
                      : "اختر المحافظة"}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>الإجمالي</span>
                    <motion.span
                      key={total}
                      initial={{ scale: 1.2, color: "#059669" }}
                      animate={{ scale: 1, color: "#059669" }}
                      className="text-brand-purple-600"
                    >
                      {formatPrice(total)}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-brand-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-purple-700 transition-all duration-300 shadow-lg shadow-brand-purple-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري إرسال الطلب...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    تأكيد الطلب عبر واتساب
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                سيتم حفظ طلبك وإرساله عبر واتساب للتأكيد
              </p>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
