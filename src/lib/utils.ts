import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================
// SAMA PHARMACY — Utility Functions
// ============================================================

/**
 * WhatsApp phone number for the pharmacy (configurable via env)
 */
export const PHARMACY_WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9647701234567";

/**
 * Format a number as Iraqi Dinar (IQD) currency string.
 * Example: 25000 → "25,000 د.ع"
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString("en-US")} د.ع`;
}

/**
 * Calculate discount percentage between compare_at_price and price.
 * Returns a whole number, e.g. 20 for 20% off.
 */
export function calcDiscount(price: number, compareAtPrice: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/**
 * Generate a WhatsApp link with a pre-filled message.
 * Pass `number` (from site settings) to override the env default.
 */
export function generateWhatsAppLink(message: string, number?: string): string {
  const encoded = encodeURIComponent(message);
  const target = (number || PHARMACY_WHATSAPP).replace(/[^0-9]/g, "");
  return `https://wa.me/${target}?text=${encoded}`;
}

/**
 * Status label mapping (Arabic)
 */
export const ORDER_STATUS_LABELS: Record<
  string,
  { label: string; color: string }
> = {
  pending: { label: "قيد الانتظار", color: "bg-amber-100 text-amber-800" },
  confirmed: { label: "مؤكد", color: "bg-blue-100 text-blue-800" },
  processing: { label: "قيد التحضير", color: "bg-purple-100 text-purple-800" },
  shipped: { label: "تم الشحن", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "تم التوصيل", color: "bg-brand-purple-100 text-brand-purple-800" },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-800" },
};
