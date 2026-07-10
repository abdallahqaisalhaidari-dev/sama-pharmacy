import type { Metadata, Viewport } from "next";
import { Noto_Sans_Arabic, El_Messiri } from "next/font/google";
import "./globals.css";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-sans",
  display: "swap",
});

const elMessiri = El_Messiri({
  subsets: ["arabic"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "صيدلية سما السكر | الموصل",
    template: "%s | صيدلية سما السكر",
  },
  description:
    "صيدلية سما السكر في الموصل - كل ما تحتاجه من أدوية ومستحضرات تجميل ومنتجات العناية الشخصية بأفضل الأسعار مع خدمة التوصيل السريع لجميع محافظات العراق",
  keywords: [
    "صيدلية",
    "الموصل",
    "أدوية",
    "مستحضرات تجميل",
    "العناية الشخصية",
    "توصيل أدوية",
    "صيدلية سما",
    "العراق",
  ],
  openGraph: {
    type: "website",
    locale: "ar_IQ",
    url: siteUrl,
    siteName: "صيدلية سما السكر",
    title: "صيدلية سما السكر | الموصل",
    description:
      "كل ما تحتاجه من أدوية ومستحضرات تجميل ومنتجات العناية الشخصية مع التوصيل لجميع محافظات العراق",
  },
  twitter: {
    card: "summary_large_image",
    title: "صيدلية سما السكر | الموصل",
    description:
      "كل ما تحتاجه من أدوية ومستحضرات تجميل ومنتجات العناية الشخصية مع التوصيل لجميع محافظات العراق",
  },
  robots: {
    index: true,
    follow: true,
  },
  // ── PWA / installable app ──
  applicationName: "صيدلية سما السكر",
  appleWebApp: {
    capable: true,
    title: "سما السكر",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#7C4F88",
};

import { SplashScreen } from "@/components/splash-screen";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${notoSansArabic.variable} ${elMessiri.variable}`}
    >
      <body className={`${notoSansArabic.className} bg-background antialiased`}>
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
