"use client";

/**
 * OrderInvoice — branded, printable invoice for admin order preview.
 * Print uses a dedicated window so the invoice prints clean on
 * A4 or A5 regardless of the dialog/portal it is displayed in.
 */

import { useEffect, useState } from "react";
import { Printer, ClipboardList, Phone, MapPin } from "lucide-react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderItem } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import BrandQr from "@/components/qr-code";

interface OrderInvoiceProps {
  order: Order;
  items: OrderItem[];
}

interface ContactInfo {
  phone: string;
  address: string;
}

const PRINT_AREA_ID = "invoice-print-area";

export default function OrderInvoice({ order, items }: OrderInvoiceProps) {
  const [contact, setContact] = useState<ContactInfo>({
    phone: DEFAULT_SETTINGS.phone,
    address: DEFAULT_SETTINGS.address,
  });
  // Origin is browser-only; the QR links to the /social hub page
  const [socialUrl, setSocialUrl] = useState<string | null>(null);
  useEffect(() => {
    setSocialUrl(`${window.location.origin}/social`);
  }, []);

  // Pull live contact details from site settings (public-read table)
  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["phone", "address"])
      .then(({ data }) => {
        if (!data) return;
        setContact((c) => {
          const next = { ...c };
          for (const row of data) {
            if (row.key === "phone" && row.value) next.phone = row.value;
            if (row.key === "address" && row.value) next.address = row.value;
          }
          return next;
        });
      });
  }, []);

  const invoiceDate = new Date(order.created_at).toLocaleDateString("ar-IQ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /** Open a clean window containing only the invoice and print it
   *  on the requested paper size. */
  const printInvoice = (size: "A4" | "A5") => {
    const el = document.getElementById(PRINT_AREA_ID);
    if (!el) return;

    const win = window.open("", "_blank", "width=900,height=1100");
    if (!win) return;

    // Clone the app's stylesheets so Tailwind classes render identically
    const headHtml = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]')
    )
      .map((n) => n.outerHTML)
      .join("");

    win.document.write(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<base href="${window.location.origin}/">
<title>فاتورة ${order.order_number}</title>
${headHtml}
<style>
  @page { size: ${size}; margin: ${size === "A5" ? "8mm" : "12mm"}; }
  html, body { background: #ffffff !important; }
  #${PRINT_AREA_ID} { max-width: ${size === "A5" ? "500px" : "760px"}; margin: 0 auto; box-shadow: none !important; ${size === "A5" ? "font-size: 12px;" : ""} }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head>
<body>${el.outerHTML}</body>
</html>`);
    win.document.close();
    win.focus();
    // Give fonts/logo a moment to load before printing
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  };

  return (
    <div className="space-y-4">
      {/* Print actions (never printed themselves) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => printInvoice("A4")}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-purple-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-purple-700"
        >
          <Printer className="size-4" />
          طباعة A4
        </button>
        <button
          onClick={() => printInvoice("A5")}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-brand-purple-600 px-4 py-2 text-sm font-bold text-brand-purple-700 transition-colors hover:bg-brand-purple-50"
        >
          <Printer className="size-4" />
          طباعة A5
        </button>
      </div>

      {/* ─────────────── The invoice ─────────────── */}
      <div
        id={PRINT_AREA_ID}
        dir="rtl"
        className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-purple-100/60 sm:p-8"
      >
        {/* Brand header */}
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="صيدلية سما السكر"
            className="h-24 w-auto object-contain"
          />
          <h2 className="text-xl font-bold text-brand-purple-800">
            صيدلية سما السكر
          </h2>
          <p className="text-[10px] font-semibold tracking-[0.35em] text-brand-purple-400">
            SAMA PHARMACY
          </p>
        </div>

        {/* Invoice meta + customer */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Invoice title / number / date */}
          <div className="shrink-0 space-y-2">
            <h3 className="text-2xl font-extrabold text-brand-purple-800">
              فاتورة
            </h3>
            <div className="text-sm">
              <span className="text-gray-500">رقم الفاتورة: </span>
              <span className="font-mono font-bold text-brand-purple-700">
                {order.order_number}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">تاريخ الفاتورة: </span>
              <span className="font-medium text-brand-purple-700">
                {invoiceDate}
              </span>
            </div>
          </div>

          {/* Customer card */}
          <div className="relative flex-1 rounded-2xl border border-brand-purple-100 bg-white p-4 pt-5 sm:max-w-sm">
            <span className="absolute -top-3 right-4 rounded-lg bg-brand-purple-500 px-3 py-1 text-xs font-bold text-white">
              بيانات العميل
            </span>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">العميل</dt>
                <dd className="font-medium text-gray-900">
                  {order.customer_name}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">الهاتف</dt>
                <dd dir="ltr" className="font-medium text-gray-900">
                  {order.customer_phone}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">المحافظة</dt>
                <dd className="font-medium text-gray-900">
                  {order.governorate_name}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">العنوان</dt>
                <dd className="max-w-[220px] text-left font-medium text-gray-900">
                  {order.customer_address}
                </dd>
              </div>
              {order.notes && (
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-500">ملاحظات</dt>
                  <dd className="max-w-[220px] text-left text-gray-700">
                    {order.notes}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Products */}
        <div className="mb-2 flex items-center gap-2">
          <ClipboardList className="size-5 text-brand-purple-600" />
          <h4 className="text-base font-bold text-brand-purple-800">
            تفاصيل المنتجات
          </h4>
        </div>
        <div className="mb-6 overflow-hidden rounded-xl border border-brand-purple-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-purple-500 text-white">
                <th className="px-4 py-2.5 text-right font-bold">المنتج</th>
                <th className="px-4 py-2.5 text-center font-bold">الكمية</th>
                <th className="px-4 py-2.5 text-center font-bold">السعر</th>
                <th className="px-4 py-2.5 text-center font-bold">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={item.id}
                  className={i % 2 === 1 ? "bg-brand-purple-50/40" : ""}
                >
                  <td className="border-t border-brand-purple-100/60 px-4 py-2.5 font-medium text-gray-900">
                    {item.product_name}
                  </td>
                  <td className="border-t border-brand-purple-100/60 px-4 py-2.5 text-center text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="border-t border-brand-purple-100/60 px-4 py-2.5 text-center text-gray-700">
                    {formatPrice(item.product_price)}
                  </td>
                  <td className="border-t border-brand-purple-100/60 px-4 py-2.5 text-center font-semibold text-gray-900">
                    {formatPrice(item.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mb-8 rounded-2xl border border-brand-purple-100 p-4">
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-500">المجموع الفرعي</span>
            <span className="font-medium">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-500">رسوم التوصيل</span>
            <span className="font-medium">
              {formatPrice(order.delivery_fee)}
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t border-brand-purple-100 pt-3 text-lg font-extrabold text-brand-purple-700">
            <span>الإجمالي</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Thank-you divider */}
        <div className="mb-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-l from-brand-purple-300 to-transparent" />
          <p className="text-sm font-medium text-brand-purple-800">
            شكراً لاختياركم صيدلية سما السكر
          </p>
          <span className="h-px flex-1 bg-gradient-to-r from-brand-purple-300 to-transparent" />
        </div>

        {/* Contact footer: QR to all platforms + phone/address */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-purple-100 px-5 py-4">
          <div className="space-y-2 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <Phone className="size-3.5 text-brand-purple-500" />
              <span dir="ltr">{contact.phone}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-brand-purple-500" />
              {contact.address}
            </span>
          </div>
          {socialUrl && (
            <div className="flex items-center gap-3">
              <p className="max-w-[120px] text-left text-[11px] font-bold leading-snug text-brand-purple-700">
                امسح الكود للوصول إلى جميع منصاتنا
              </p>
              <div className="rounded-xl border border-brand-purple-200 p-1">
                <BrandQr value={socialUrl} size={88} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
