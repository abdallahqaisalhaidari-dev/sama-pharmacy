"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import type { Testimonial } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Quote,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface TestimonialFormData {
  name: string;
  location: string;
  quote: string;
  sort_order: string;
  is_active: boolean;
}

const emptyForm: TestimonialFormData = {
  name: "",
  location: "",
  quote: "",
  sort_order: "0",
  is_active: true,
};

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<TestimonialFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order");
    if (error) {
      setAlert({
        type: "error",
        msg: "تعذر جلب البيانات — تأكد من تشغيل ملف supabase/admin-extension.sql",
      });
    }
    setItems((data as Testimonial[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const showAlert = (type: "success" | "error", msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: String(items.length + 1) });
    setDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      name: t.name,
      location: t.location || "",
      quote: t.quote,
      sort_order: String(t.sort_order),
      is_active: t.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.quote.trim()) {
      showAlert("error", "يرجى إدخال الاسم ونص الرأي");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      location: form.location.trim(),
      quote: form.quote.trim(),
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    };

    if (editing) {
      const { error } = await supabase
        .from("testimonials")
        .update(payload)
        .eq("id", editing.id);
      if (error) {
        showAlert("error", `خطأ في التحديث: ${error.message}`);
      } else {
        showAlert("success", "تم التحديث بنجاح");
        setDialogOpen(false);
      }
    } else {
      const { error } = await supabase.from("testimonials").insert(payload);
      if (error) {
        showAlert("error", `خطأ في الإضافة: ${error.message}`);
      } else {
        showAlert("success", "تمت الإضافة بنجاح");
        setDialogOpen(false);
      }
    }

    setSaving(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      showAlert("error", `خطأ في الحذف: ${error.message}`);
    } else {
      showAlert("success", "تم الحذف بنجاح");
      fetchItems();
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
            <Quote className="w-6 h-6 text-brand-purple-600" />
            آراء العملاء
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            الآراء الفعالة تظهر في الصفحة الرئيسية (أول 3 حسب الترتيب)
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-brand-purple-600 hover:bg-brand-purple-700 rounded-xl"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة رأي
        </Button>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-500 text-sm">
          لا توجد آراء بعد. أضف أول رأي من الزر أعلاه.
        </div>
      )}

      {/* Table */}
      {items.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>المدينة</TableHead>
                <TableHead className="w-1/2">الرأي</TableHead>
                <TableHead>الترتيب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-gray-500">
                    {t.location || "—"}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    <span className="line-clamp-2">{t.quote}</span>
                  </TableCell>
                  <TableCell>{t.sort_order}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        t.is_active
                          ? "bg-brand-purple-100 text-brand-purple-800"
                          : "bg-brand-cream-dark text-gray-600"
                      }`}
                    >
                      {t.is_active ? "ظاهر" : "مخفي"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(t)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
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
              {editing ? "تعديل الرأي" : "إضافة رأي جديد"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>اسم العميل *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="زينب م."
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>المدينة</Label>
              <Input
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
                placeholder="الموصل"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>نص الرأي *</Label>
              <Textarea
                value={form.quote}
                onChange={(e) =>
                  setForm((f) => ({ ...f, quote: e.target.value }))
                }
                placeholder="خدمة ممتازة وتوصيل سريع..."
                rows={4}
                className="rounded-xl"
              />
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
                id="t_is_active"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_active: e.target.checked }))
                }
                className="h-4 w-4 rounded border-gray-300 text-brand-purple-600 focus:ring-brand-purple-500"
              />
              <Label htmlFor="t_is_active">ظاهر في الموقع</Label>
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
