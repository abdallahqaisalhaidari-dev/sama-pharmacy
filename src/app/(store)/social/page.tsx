import Link from "next/link";
import { ChevronLeft, Globe, AtSign, Users, Phone, MapPin, Share2 } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import SocialQr from "@/components/social/social-qr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تابعونا — جميع منصاتنا",
  description:
    "كل منصات صيدلية سما السكر في مكان واحد — انستغرام، فيسبوك، واتساب والموقع الإلكتروني",
};

export const revalidate = 3600;

/** WhatsApp brand mark (lucide has no WhatsApp icon) */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default async function SocialPage() {
  const settings = await getSiteSettings();
  const siteHost = (process.env.NEXT_PUBLIC_SITE_URL || "")
    .replace(/https?:\/\//, "")
    .replace(/\/$/, "");

  const rows = [
    {
      key: "site",
      label: "الموقع الإلكتروني",
      value: siteHost || "تسوقي كل منتجاتنا أونلاين",
      href: "/",
      external: false,
      icon: <Globe className="size-5" />,
      iconBg: "bg-brand-purple-600",
    },
    settings.instagram && {
      key: "instagram",
      label: "إنستغرام",
      value: settings.instagram
        .replace(/https?:\/\/(www\.)?instagram\.com\//, "@")
        .replace(/\/$/, ""),
      href: settings.instagram,
      external: true,
      icon: <AtSign className="size-5" />,
      iconBg: "bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600",
    },
    settings.facebook && {
      key: "facebook",
      label: "فيسبوك",
      value: "صيدلية سما السكر | Sama Pharmacy",
      href: settings.facebook,
      external: true,
      icon: <Users className="size-5" />,
      iconBg: "bg-blue-600",
    },
    {
      key: "whatsapp",
      label: "واتساب",
      value: settings.phone,
      href: `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`,
      external: true,
      icon: <WhatsAppIcon className="size-5" />,
      iconBg: "bg-green-500",
    },
    {
      key: "phone",
      label: "الهاتف",
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\s/g, "")}`,
      external: false,
      icon: <Phone className="size-5" />,
      iconBg: "bg-brand-purple-500",
    },
    {
      key: "address",
      label: "العنوان",
      value: settings.address,
      href: null,
      external: false,
      icon: <MapPin className="size-5" />,
      iconBg: "bg-brand-purple-400",
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    value: string;
    href: string | null;
    external: boolean;
    icon: React.ReactNode;
    iconBg: string;
  }[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream to-brand-purple-50/60">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition-colors hover:text-brand-purple-600">
            الرئيسية
          </Link>
          <ChevronLeft className="size-4 rotate-180" />
          <span className="font-medium text-gray-900">تابعونا</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-2">
          {/* ── Right: brand + links ── */}
          <div>
            {/* Brand header */}
            <div className="mb-8 flex flex-col items-center gap-2 text-center lg:items-start lg:text-right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="صيدلية سما السكر"
                className="h-28 w-auto object-contain"
              />
              <h1 className="font-heading text-2xl font-bold text-brand-purple-900">
                صيدلية سما السكر
              </h1>
              <p className="text-[11px] font-semibold tracking-[0.35em] text-brand-purple-400">
                SAMA PHARMACY
              </p>
            </div>

            {/* Link rows */}
            <ul className="space-y-3">
              {rows.map((row) => {
                const inner = (
                  <>
                    <span
                      className={`flex size-11 shrink-0 items-center justify-center rounded-full text-white shadow-md ${row.iconBg}`}
                    >
                      {row.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-brand-purple-900">
                        {row.label}
                      </span>
                      <span
                        className="block truncate text-sm text-gray-500"
                        dir="ltr"
                        style={{ textAlign: "right" }}
                      >
                        {row.value}
                      </span>
                    </span>
                  </>
                );
                const rowClass =
                  "flex items-center gap-4 rounded-2xl border border-brand-purple-100/60 bg-white/90 p-3.5 shadow-sm transition-all duration-300";
                return (
                  <li key={row.key}>
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.external ? "_blank" : undefined}
                        rel={row.external ? "noopener noreferrer" : undefined}
                        className={`${rowClass} hover:-translate-y-0.5 hover:border-brand-purple-300 hover:shadow-lg hover:shadow-brand-purple-900/10`}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className={rowClass}>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── Left: QR card ── */}
          <div className="flex justify-center lg:sticky lg:top-28">
            <div className="w-full max-w-sm rounded-[2rem] border-2 border-brand-purple-300/70 bg-white/80 p-6 text-center shadow-xl shadow-brand-purple-900/10 backdrop-blur-sm">
              <div className="flex justify-center">
                <SocialQr size={240} />
              </div>
              <div className="mx-auto mt-5 flex w-fit items-center gap-2.5 rounded-full bg-brand-purple-600 px-5 py-2.5 text-white shadow-md shadow-brand-purple-600/25">
                <Share2 className="size-4" />
                <span className="text-sm font-bold leading-snug">
                  امسح الكود للوصول إلى جميع منصاتنا
                </span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-gray-400">
                شارك هذا الرمز مع من تحب — يفتح هذه الصفحة بكل روابطنا
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
