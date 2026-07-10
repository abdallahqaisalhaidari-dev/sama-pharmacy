import Link from "next/link";
import { ChevronLeft, PackageSearch } from "lucide-react";
import TrackOrderForm from "@/components/shop/track-order-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تتبع الطلب",
  description:
    "تتبع حالة طلبك من صيدلية سما السكر — أدخل رقم الطلب لمعرفة حالته لحظة بلحظة",
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link
            href="/"
            className="transition-colors hover:text-brand-purple-600"
          >
            الرئيسية
          </Link>
          <ChevronLeft className="size-4 rotate-180" />
          <span className="font-medium text-gray-900">تتبع الطلب</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-purple-100">
            <PackageSearch className="size-6 text-brand-purple-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              تتبع الطلب
            </h1>
            <p className="text-sm text-gray-500">
              أدخل رقم طلبك لمعرفة حالته الحالية
            </p>
          </div>
        </div>

        <TrackOrderForm />
      </div>
    </div>
  );
}
