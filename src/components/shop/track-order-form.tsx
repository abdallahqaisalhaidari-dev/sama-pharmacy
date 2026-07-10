"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  PackageSearch,
  Clock,
  BadgeCheck,
  Package,
  Truck,
  Home,
  XCircle,
  Receipt,
} from "lucide-react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";

interface TrackedOrder {
  order_number: string;
  status: string;
  created_at: string;
  governorate_name: string;
  total: number;
}

/** Delivery journey (cancelled is handled separately) */
const STEPS = [
  { key: "pending", label: "قيد الانتظار", icon: Clock },
  { key: "confirmed", label: "مؤكد", icon: BadgeCheck },
  { key: "processing", label: "قيد التحضير", icon: Package },
  { key: "shipped", label: "تم الشحن", icon: Truck },
  { key: "delivered", label: "تم التوصيل", icon: Home },
] as const;

export default function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = orderNumber.trim();
    if (!value) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    const { data, error: rpcError } = await supabase.rpc("track_order", {
      p_order_number: value,
    });

    setSearched(true);
    setLoading(false);

    if (rpcError) {
      setError("تعذر الاستعلام حالياً، يرجى المحاولة بعد قليل.");
      console.error("track_order RPC error:", rpcError.message);
      return;
    }

    const found = Array.isArray(data) ? data[0] : data;
    if (!found) {
      setError(
        "لم نعثر على طلب بهذا الرقم. تأكد من الرقم الموجود في رسالة تأكيد الطلب (مثال: SP-00005)."
      );
      return;
    }

    setOrder(found as TrackedOrder);
  };

  const currentStep = order
    ? STEPS.findIndex((s) => s.key === order.status)
    : -1;
  const isCancelled = order?.status === "cancelled";
  const statusInfo = order
    ? ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]
    : null;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Search card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleTrack} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Receipt className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-brand-purple-300" />
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="رقم الطلب — مثال: SP-00005"
              className="h-12 w-full rounded-xl border border-brand-purple-100 bg-brand-purple-50/50 pr-12 pl-4 text-sm font-medium text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple-300/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !orderNumber.trim()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-purple-600 px-6 text-sm font-bold text-white shadow-md shadow-brand-purple-600/20 transition-colors hover:bg-brand-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            تتبع الطلب
          </button>
        </form>
        <p className="mt-3 text-xs text-gray-400">
          تجد رقم الطلب في رسالة تأكيد الطلب بعد إتمام الشراء.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Error / not found */}
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex items-start gap-3 rounded-2xl bg-white p-6 shadow-sm"
          >
            <PackageSearch className="size-6 shrink-0 text-brand-purple-300" />
            <p className="text-sm leading-relaxed text-gray-600">{error}</p>
          </motion.div>
        )}

        {/* Result */}
        {order && (
          <motion.div
            key={order.order_number + order.status}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            {/* Order summary strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-purple-100/60 bg-brand-purple-50/50 px-6 py-4">
              <div>
                <p className="font-mono text-sm font-bold text-brand-purple-800">
                  {order.order_number}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {new Date(order.created_at).toLocaleDateString("ar-IQ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" — "}
                  {order.governorate_name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-brand-purple-700">
                  {formatPrice(order.total)}
                </span>
                {statusInfo && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {isCancelled ? (
                /* Cancelled banner */
                <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
                  <XCircle className="size-6 shrink-0 text-red-500" />
                  <div>
                    <p className="text-sm font-bold text-red-700">
                      هذا الطلب ملغي
                    </p>
                    <p className="mt-0.5 text-xs text-red-600/80">
                      إن كان لديك استفسار تواصل معنا عبر واتساب وسنساعدك فوراً.
                    </p>
                  </div>
                </div>
              ) : (
                /* Progress timeline */
                <ol className="flex items-start justify-between">
                  {STEPS.map((step, i) => {
                    const done = i <= currentStep;
                    const isCurrent = i === currentStep;
                    const Icon = step.icon;
                    return (
                      <li
                        key={step.key}
                        className="relative flex flex-1 flex-col items-center gap-2"
                      >
                        {/* Connector line (to the previous step, RTL flows right→left) */}
                        {i > 0 && (
                          <span
                            className={`absolute right-[-50%] top-5 h-0.5 w-full ${
                              i <= currentStep
                                ? "bg-brand-purple-500"
                                : "bg-gray-200"
                            }`}
                          />
                        )}
                        <span
                          className={`relative z-10 flex size-10 items-center justify-center rounded-full ring-4 ring-white transition-colors ${
                            done
                              ? "bg-brand-purple-600 text-white"
                              : "bg-gray-100 text-gray-400"
                          } ${isCurrent ? "shadow-lg shadow-brand-purple-600/30" : ""}`}
                        >
                          <Icon className="size-5" strokeWidth={1.75} />
                        </span>
                        <span
                          className={`text-center text-[11px] font-medium leading-tight sm:text-xs ${
                            done ? "text-brand-purple-800" : "text-gray-400"
                          } ${isCurrent ? "font-bold" : ""}`}
                        >
                          {step.label}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </motion.div>
        )}

        {/* First-visit hint */}
        {!order && !error && !searched && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-sm text-gray-400"
          >
            أدخل رقم طلبك أعلاه لمعرفة حالته لحظة بلحظة
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
