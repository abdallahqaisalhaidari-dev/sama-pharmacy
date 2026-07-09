"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCcw, Home, AlertTriangle } from "lucide-react";

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="size-10 text-red-400" />
      </div>
      <h1 className="mb-3 text-2xl font-bold text-gray-900">
        عذراً، حدث خطأ ما
      </h1>
      <p className="mb-8 max-w-md text-gray-500">
        واجهنا مشكلة أثناء تحميل هذه الصفحة. يرجى المحاولة مرة أخرى، وإذا
        استمرت المشكلة تواصل معنا.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-purple-700"
        >
          <RefreshCcw className="size-4" />
          إعادة المحاولة
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-brand-cream"
        >
          <Home className="size-4" />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
