"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { formatPrice } from "@/lib/utils";
import type { Governorate } from "@/lib/types";
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
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface GovFormData {
  name_ar: string;
  name_en: string;
  delivery_fee: string;
  is_active: boolean;
}

const emptyForm: GovFormData = {
  name_ar: "",
  name_en: "",
  delivery_fee: "",
  is_active: true,
};

export default function GovernoratesPage() {
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Governorate | null>(null);
  const [form, setForm] = useState<GovFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchGovernorates = async () => {
    const { data } = await supabase
      .from("governorates")
      .select("*")
      .order("sort_order");
    setGovernorates((data as Governorate[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchGovernorates();
  }, []);

  const showAlert = (type: "success" | "error", msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3000);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (gov: Governorate) => {
    setEditing(gov);
    setForm({
      name_ar: gov.name_ar,
      name_en: gov.name_en,
      delivery_fee: gov.delivery_fee.toString(),
      is_active: gov.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name_ar.trim() || !form.name_en.trim() || !form.delivery_fee) {
      showAlert("error", "يرجى ملء جميع الحقول");
      return;
    }

    setSaving(true);
    const payload = {
      name_ar: form.name_ar.trim(),
      name_en: form.name_en.trim(),
      delivery_fee: parseFloat(form.delivery_fee),
      is_active: form.is_active,
    };

    if (editing) {
      const { error } = await supabase
        .from("governorates")
        .update(payload)
        .eq("id", editing.id);
      if (error) {
        showAlert("error", "خطأ في التحديث");
      } else {
        showAlert("success", "تم التحديث بنجاح");
      }
    } else {
      const { error } = await supabase.from("governorates").insert(payload);
      if (error) {
        showAlert("error", "خطأ في الإضافة");
      } else {
        showAlert("success", "تمت الإضافة بنجاح");
      }
    }

    setSaving(false);
    setDialogOpen(false);
    fetchGovernorates();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    const { error } = await supabase.from("governorates").delete().eq("id", id);
    if (error) {
      showAlert("error", "خطأ في الحذف");
    } else {
      showAlert("success", "تم الحذف بنجاح");
      fetchGovernorates();
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
            <Truck className="w-6 h-6 text-brand-purple-600" />
            المحافظات ورسوم التوصيل
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            إدارة محافظات العراق ورسوم التوصيل لكل محافظة
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-brand-purple-600 hover:bg-brand-purple-700 rounded-xl"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة محافظة
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم (عربي)</TableHead>
              <TableHead>الاسم (إنجليزي)</TableHead>
              <TableHead>رسوم التوصيل</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {governorates.map((gov) => (
              <TableRow key={gov.id}>
                <TableCell className="font-medium">{gov.name_ar}</TableCell>
                <TableCell className="text-gray-500">{gov.name_en}</TableCell>
                <TableCell className="font-semibold text-brand-purple-600">
                  {formatPrice(gov.delivery_fee)}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      gov.is_active
                        ? "bg-brand-purple-100 text-brand-purple-800"
                        : "bg-brand-cream-dark text-gray-600"
                    }`}
                  >
                    {gov.is_active ? "فعال" : "معطل"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(gov)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(gov.id)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "تعديل المحافظة" : "إضافة محافظة جديدة"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>الاسم (عربي)</Label>
              <Input
                value={form.name_ar}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name_ar: e.target.value }))
                }
                placeholder="نينوى"
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
                placeholder="Nineveh"
                dir="ltr"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>رسوم التوصيل (د.ع)</Label>
              <Input
                type="number"
                value={form.delivery_fee}
                onChange={(e) =>
                  setForm((f) => ({ ...f, delivery_fee: e.target.value }))
                }
                placeholder="5000"
                dir="ltr"
                className="rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_active: e.target.checked }))
                }
                className="h-4 w-4 rounded border-gray-300 text-brand-purple-600 focus:ring-brand-purple-500"
              />
              <Label htmlFor="is_active">فعال</Label>
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
