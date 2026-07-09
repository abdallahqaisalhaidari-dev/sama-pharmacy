"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import {
  DEFAULT_SETTINGS,
  SETTING_LABELS,
  type SiteSettings,
} from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Loader2,
  CheckCircle,
  XCircle,
  Phone,
  Share2,
  Type,
} from "lucide-react";
import { motion } from "framer-motion";

const groups: {
  title: string;
  icon: typeof Phone;
  keys: (keyof SiteSettings)[];
}[] = [
  {
    title: "معلومات التواصل",
    icon: Phone,
    keys: ["phone", "whatsapp", "email", "address", "working_hours"],
  },
  {
    title: "مواقع التواصل الاجتماعي",
    icon: Share2,
    keys: ["facebook", "instagram"],
  },
  {
    title: "نصوص الموقع",
    icon: Type,
    keys: [
      "hero_title_line1",
      "hero_title_line2",
      "hero_subtitle",
      "footer_about",
    ],
  },
];

const textareaKeys: (keyof SiteSettings)[] = ["hero_subtitle", "footer_about"];
const ltrKeys: (keyof SiteSettings)[] = [
  "phone",
  "whatsapp",
  "email",
  "facebook",
  "instagram",
];

export default function SettingsPage() {
  const [values, setValues] = useState<SiteSettings>({ ...DEFAULT_SETTINGS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");
      if (error) {
        setAlert({
          type: "error",
          msg: "تعذر جلب الإعدادات — تأكد من تشغيل ملف supabase/admin-extension.sql",
        });
      } else {
        setValues((prev) => {
          const next = { ...prev };
          for (const row of data || []) {
            if (row.key in next) {
              next[row.key as keyof SiteSettings] = row.value ?? "";
            }
          }
          return next;
        });
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const showAlert = (type: "success" | "error", msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    const rows = (Object.keys(values) as (keyof SiteSettings)[]).map(
      (key) => ({
        key,
        value: values[key],
        updated_at: new Date().toISOString(),
      })
    );

    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });

    if (error) {
      showAlert("error", `خطأ في الحفظ: ${error.message}`);
    } else {
      showAlert(
        "success",
        "تم الحفظ بنجاح — التغييرات تظهر في الموقع خلال 10 دقائق كحد أقصى"
      );
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Alert */}
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border px-4 py-3 text-sm flex items-center gap-2 ${
            alert.type === "success"
              ? "bg-brand-purple-50 border-brand-purple-200 text-brand-purple-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 shrink-0" />
          )}
          {alert.msg}
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-purple-600" />
            إعدادات الموقع
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            عدّل معلومات التواصل والنصوص الأساسية — بدون الحاجة لمبرمج
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-purple-600 hover:bg-brand-purple-700 rounded-xl"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "حفظ التغييرات"
          )}
        </Button>
      </div>

      {/* Groups */}
      {groups.map((group) => {
        const GroupIcon = group.icon;
        return (
          <div
            key={group.title}
            className="bg-white rounded-2xl shadow-md p-6 space-y-5"
          >
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <GroupIcon className="w-5 h-5 text-brand-purple-600" />
              {group.title}
            </h2>

            {group.keys.map((key) => (
              <div key={key} className="space-y-2">
                <Label className="text-sm text-gray-600">
                  {SETTING_LABELS[key]}
                </Label>
                {textareaKeys.includes(key) ? (
                  <Textarea
                    value={values[key]}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [key]: e.target.value }))
                    }
                    rows={3}
                    className="rounded-xl"
                  />
                ) : (
                  <Input
                    value={values[key]}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [key]: e.target.value }))
                    }
                    dir={ltrKeys.includes(key) ? "ltr" : undefined}
                    className="rounded-xl"
                  />
                )}
              </div>
            ))}
          </div>
        );
      })}

      {/* Bottom save */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-purple-600 hover:bg-brand-purple-700 rounded-xl px-8"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "حفظ التغييرات"
          )}
        </Button>
      </div>
    </div>
  );
}
