"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Home, MessageCircle } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order") || "---";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center max-w-md"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-brand-purple-100 flex items-center justify-center"
        >
          <CheckCircle className="w-14 h-14 text-brand-purple-600" />
        </motion.div>

        <h1 className="font-heading text-3xl font-bold text-brand-purple-900 mb-3">
          تم إرسال طلبك بنجاح
        </h1>

        <p className="text-gray-500 mb-2">
          شكراً لك! تم حفظ طلبك وإرساله عبر واتساب
        </p>

        <div className="bg-brand-purple-50 rounded-xl p-4 mb-6 border border-brand-purple-100">
          <p className="text-sm text-gray-600 mb-1">رقم الطلب</p>
          <p className="text-2xl font-bold text-brand-purple-700 tracking-wider" dir="ltr">
            {orderNumber}
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-8">
          سيتواصل معك فريقنا عبر واتساب لتأكيد الطلب وتحديد موعد التوصيل
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-brand-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-purple-700 transition-all shadow-lg shadow-brand-purple-200"
          >
            <Home className="w-4 h-4" />
            الصفحة الرئيسية
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 border-2 border-brand-purple-600 text-brand-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-brand-purple-50 transition-all"
          >
            متابعة التسوق
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="animate-pulse text-gray-400">جاري التحميل...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
