"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import type { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  FolderOpen,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface CategoryFormData {
  name_ar: string;
  name_en: string;
  slug: string;
  image_url: string;
  sort_order: string;
  is_active: boolean;
}

const emptyForm: CategoryFormData = {
  name_ar: "",
  name_en: "",
  slug: "",
  image_url: "",
  sort_order: "0",
  is_active: true,
};

/** Slugs known by the storefront icon map */
const knownSlugs = [
  "medicines",
  "skincare",
  "vitamins",
  "baby",
  "personal_care",
  "medical_devices",
  "supplements",
  "hair_care",
];

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    setCategories((data as Category[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showAlert = (type: "success" | "error", msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: String(categories.length + 1) });
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      name_ar: cat.name_ar,
      name_en: cat.name_en || "",
      slug: cat.slug,
      image_url: cat.image_url || "",
      sort_order: String(cat.sort_order),
      is_active: cat.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name_ar.trim()) {
      showAlert("error", "يرجى إدخال اسم القسم");
      return;
    }

    const slug = slugify(form.slug || form.name_en || form.name_ar);
    if (!slug) {
      showAlert("error", "يرجى إدخال معرّف (slug) بأحرف إنجليزية");
      return;
    }

    setSaving(true);
    const payload = {
      name_ar: form.name_ar.trim(),
      name_en: form.name_en.trim() || null,
      slug,
      image_url: form.image_url.trim() || null,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    };

    if (editing) {
      const { error } = await supabase
        .from("categories")
        .update(payload)
        .eq("id", editing.id);
      if (error) {
        showAlert("error", `خطأ في التحديث: ${error.message}`);
      } else {
        showAlert("success", "تم التحديث بنجاح");
        setDialogOpen(false);
      }
    } else {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) {
        showAlert("error", `خطأ في الإضافة: ${error.message}`);
      } else {
        showAlert("success", "تمت الإضافة بنجاح");
        setDialogOpen(false);
      }
    }

    setSaving(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "هل أنت متأكد من الحذف؟ المنتجات المرتبطة بهذا القسم ستبقى بدون قسم."
      )
    )
      return;

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      showAlert("error", `خطأ في الحذف: ${error.message}`);
    } else {
      showAlert("success", "تم الحذف بنجاح");
      fetchCategories();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`rounded-xl border px-4 py-3 text-sm flex items-center gap-2 ${
            alert.type === "success"
              ? "bg-brand-purple-50 border-brand-purple-200 text-brand-purple-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {alert.msg}
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-brand-purple-600" />
            الأقسام
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            إدارة أقسام المتجر — المنتجات تُصنّف حسب هذه الأقسام
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-brand-purple-600 hover:bg-brand-purple-700 rounded-xl"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة قسم
        </Button>
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-500 text-sm">
          لا توجد أقسام بعد. أضف قسماً من الزر أعلاه، أو شغّل ملف
          <code className="mx-1 px-2 py-0.5 rounded bg-brand-purple-50 text-brand-purple-700" dir="ltr">
            supabase/admin-extension.sql
          </code>
          لزرع الأقسام الافتراضية.
        </div>
      )}

      {/* Table */}
      {categories.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم (عربي)</TableHead>
                <TableHead>الاسم (إنجليزي)</TableHead>
                <TableHead>المعرّف (slug)</TableHead>
                <TableHead>الترتيب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {cat.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cat.image_url}
                          alt={cat.name_ar}
                          className="h-10 w-10 rounded-lg border border-gray-100 object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-purple-50">
                          <FolderOpen className="h-4 w-4 text-brand-purple-300" />
                        </span>
                      )}
                      {cat.name_ar}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {cat.name_en || "—"}
                  </TableCell>
                  <TableCell className="text-gray-500" dir="ltr">
                    {cat.slug}
                  </TableCell>
                  <TableCell>{cat.sort_order}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        cat.is_active
                          ? "bg-brand-purple-100 text-brand-purple-800"
                          : "bg-brand-cream-dark text-gray-600"
                      }`}
                    >
                      {cat.is_active ? "فعال" : "معطل"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "تعديل القسم" : "إضافة قسم جديد"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>الاسم (عربي) *</Label>
              <Input
                value={form.name_ar}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name_ar: e.target.value }))
                }
                placeholder="العناية بالبشرة"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>الاسم (إنجليزي)</Label>
              <Input
                value={form.name_en}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name_en: e.target.value }))
                }
                placeholder="Skincare"
                dir="ltr"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>المعرّف (slug) — أحرف إنجليزية بدون مسافات</Label>
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="skincare"
                dir="ltr"
                className="rounded-xl"
              />
              <p className="text-[11px] text-gray-400 leading-relaxed">
                المعرّفات التالية لها أيقونات جاهزة في الموقع:{" "}
                <span dir="ltr">{knownSlugs.join(", ")}</span>
              </p>
            </div>
            <div className="space-y-2">
              <Label>رابط صورة القسم (اختياري)</Label>
              <Input
                value={form.image_url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image_url: e.target.value }))
                }
                placeholder="https://example.com/category.jpg"
                dir="ltr"
                className="rounded-xl"
              />
              <p className="text-[11px] text-gray-400 leading-relaxed">
                تظهر الصورة في صفحة الأقسام وواجهة المتجر. إن تُركت فارغة تُستخدم
                أيقونة/تدرّج لوني تلقائياً.
              </p>
              {form.image_url.trim() && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.image_url.trim()}
                  alt="معاينة صورة القسم"
                  className="h-20 w-28 rounded-xl border border-gray-200 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).style.display = "";
                  }}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>الترتيب</Label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sort_order: e.target.value }))
                }
                dir="ltr"
                className="rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cat_is_active"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_active: e.target.checked }))
                }
                className="h-4 w-4 rounded border-gray-300 text-brand-purple-600 focus:ring-brand-purple-500"
              />
              <Label htmlFor="cat_is_active">فعال (يظهر في الموقع)</Label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="rounded-xl"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-brand-purple-600 hover:bg-brand-purple-700 rounded-xl"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editing ? (
                "تحديث"
              ) : (
                "إضافة"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
