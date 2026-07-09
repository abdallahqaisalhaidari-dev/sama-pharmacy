"use client";

import { useEffect } from "react";
import { RefreshCcw, AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="size-8 text-red-400" />
      </div>
      <h1 className="mb-3 text-xl font-bold text-gray-900">
        حدث خطأ في لوحة الإدارة
      </h1>
      <p className="mb-6 max-w-md text-sm text-gray-500">
        تعذر تحميل هذه الصفحة. حاول مرة أخرى أو تحقق من اتصالك بالإنترنت.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-xl bg-brand-purple-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-purple-700"
      >
        <RefreshCcw className="size-4" />
        إعادة المحاولة
      </button>
    </div>
  );
}
