import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "صيدلية سما السكر — Sama Pharmacy",
    short_name: "سما السكر",
    description:
      "صيدلية سما السكر في الموصل — أدوية، مستحضرات تجميل وعناية، مع توصيل لجميع المحافظات",
    id: "/",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    dir: "rtl",
    lang: "ar",
    background_color: "#F1F5F6",
    theme_color: "#7C4F88",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
