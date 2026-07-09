import { supabase } from "@/lib/supabase";

/**
 * Site-wide settings, editable from /admin/settings.
 * Every key has a hard-coded default so the site keeps working
 * even before the `site_settings` table exists.
 */
export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  working_hours: string;
  facebook: string;
  instagram: string;
  hero_title_line1: string;
  hero_title_line2: string;
  hero_subtitle: string;
  footer_about: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  phone: "+964 770 123 4567",
  whatsapp: "9647701234567",
  email: "info@sama-pharmacy.iq",
  address: "الموصل، نينوى، العراق",
  working_hours: "يومياً 9 صباحاً — 11 مساءً",
  facebook: "",
  instagram: "",
  hero_title_line1: "ارتقي بصحتكِ،",
  hero_title_line2: "وتألّقي بجمالكِ",
  hero_subtitle:
    "رحلة منسّقة بعناية من منتجات الصحة والجمال، مع شريككم الموثوق — صيدلية سما السكر في الموصل.",
  footer_about:
    "صيدلية متكاملة في مدينة الموصل نقدم لكم أفضل الأدوية والمستحضرات الطبية والتجميلية بأسعار مناسبة مع خدمة توصيل سريعة وموثوقة.",
};

/** Arabic labels for the admin settings page */
export const SETTING_LABELS: Record<keyof SiteSettings, string> = {
  phone: "رقم الهاتف",
  whatsapp: "رقم واتساب (بدون + مع رمز الدولة، مثال: 9647701234567)",
  email: "البريد الإلكتروني",
  address: "العنوان",
  working_hours: "ساعات العمل",
  facebook: "رابط صفحة فيسبوك",
  instagram: "رابط حساب انستغرام",
  hero_title_line1: "عنوان الواجهة — السطر الأول",
  hero_title_line2: "عنوان الواجهة — السطر الثاني",
  hero_subtitle: "النص التعريفي في الواجهة",
  footer_about: "نبذة الصيدلية (أسفل الموقع)",
};

/** Server-side fetch, merged over defaults. Never throws. */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data } = await supabase.from("site_settings").select("key, value");
    const settings: SiteSettings = { ...DEFAULT_SETTINGS };
    for (const row of data || []) {
      if (row.key in settings && typeof row.value === "string" && row.value !== "") {
        settings[row.key as keyof SiteSettings] = row.value;
      }
      // Empty string is a valid value for hideable links
      if ((row.key === "facebook" || row.key === "instagram") && row.value === "") {
        settings[row.key as "facebook" | "instagram"] = "";
      }
    }
    return settings;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}
