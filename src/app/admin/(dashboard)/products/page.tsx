"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { formatPrice } from "@/lib/utils";
import type { Product, Category } from "@/lib/types";
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
  Package,
  CheckCircle,
  XCircle,
  Pill,
} from "lucide-react";
import { motion } from "framer-motion";

interface ProductFormData {
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string;
  price: string;
  compare_at_price: string;
  stock_quantity: string;
  category_id: string;
  is_active: boolean;
  is_featured: boolean;
  image_url: string;
}

const emptyForm: ProductFormData = {
  name_ar: "",
  name_en: "",
  slug: "",
  description_ar: "",
  price: "",
  compare_at_price: "",
  stock_quantity: "0",
  category_id: "",
  is_active: true,
  is_featured: false,
  image_url: "",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const fetchData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from("products")
        .select("*, category:categories(name_ar)")
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    setProducts((productsRes.data as Product[]) || []);
    setCategories((categoriesRes.data as Category[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
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

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name_ar: product.name_ar,
      name_en: product.name_en || "",
      slug: product.slug,
      description_ar: product.description_ar || "",
      price: product.price.toString(),
      compare_at_price: product.compare_at_price?.toString() || "",
      stock_quantity: product.stock_quantity.toString(),
      category_id: product.category_id || "",
      is_active: product.is_active,
      is_featured: product.is_featured,
      image_url: product.images?.[0] || "",
    });
    setDialogOpen(true);
  };

  const handleNameChange = (value: string) => {
    setForm((f) => ({
      ...f,
      name_en: value,
      slug: editing ? f.slug : slugify(value),
    }));
  };

  const handleSave = async () => {
    if (!form.name_ar.trim() || !form.price) {
      showAlert("error", "يرجى ملء الحقول المطلوبة");
      return;
    }

    setSaving(true);
    const payload = {
      name_ar: form.name_ar.trim(),
      name_en: form.name_en.trim() || null,
      slug: form.slug || slugify(form.name_en || form.name_ar),
      description_ar: form.description_ar.trim() || null,
      price: parseFloat(form.price),
      compare_at_price: form.compare_at_price
        ? parseFloat(form.compare_at_price)
        : null,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      category_id: form.category_id || null,
      is_active: form.is_active,
      is_featured: form.is_featured,
      images: form.image_url ? [form.image_url] : [],
    };

    if (editing) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editing.id);
      if (error) {
        showAlert("error", "خطأ في التحديث: " + error.message);
      } else {
        showAlert("success", "تم تحديث المنتج بنجاح");
      }
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        showAlert("error", "خطأ في الإضافة: " + error.message);
      } else {
        showAlert("success", "تمت إضافة المنتج بنجاح");
      }
    }

    setSaving(false);
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      showAlert("error", "خطأ في الحذف");
    } else {
      showAlert("success", "تم حذف المنتج");
      fetchData();
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
            <Package className="w-6 h-6 text-brand-purple-600" />
            إدارة المنتجات
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} منتج في المتجر
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-brand-purple-600 hover:bg-brand-purple-700 rounded-xl"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة منتج
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {products.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد منتجات بعد</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">صورة</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>المخزون</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>مميز</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-cream-dark">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name_ar}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-purple-300">
                          <Pill className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{product.name_ar}</p>
                    {product.name_en && (
                      <p className="text-xs text-gray-400">{product.name_en}</p>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-brand-purple-600">
                    {formatPrice(product.price)}
                    {product.compare_at_price && (
                      <span className="block text-xs text-gray-400 line-through">
                        {formatPrice(product.compare_at_price)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        product.stock_quantity <= product.low_stock_threshold
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {product.stock_quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.is_active
                          ? "bg-brand-purple-100 text-brand-purple-800"
                          : "bg-brand-cream-dark text-gray-600"
                      }`}
                    >
                      {product.is_active ? "فعال" : "معطل"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.is_featured && (
                      <span className="inline-flex items-center rounded-full bg-brand-purple-100 text-brand-purple-800 px-2.5 py-0.5 text-xs font-medium">
                        ⭐ مميز
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "تعديل المنتج" : "إضافة منتج جديد"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  الاسم (عربي) <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.name_ar}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name_ar: e.target.value }))
                  }
                  placeholder="سيروم فيتامين سي"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>الاسم (إنجليزي)</Label>
                <Input
                  value={form.name_en}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Vitamin C Serum"
                  dir="ltr"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>الرابط (slug)</Label>
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="vitamin-c-serum"
                dir="ltr"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>الوصف (عربي)</Label>
              <Textarea
                value={form.description_ar}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description_ar: e.target.value }))
                }
                placeholder="وصف المنتج..."
                rows={3}
                className="rounded-xl resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>
                  السعر (د.ع) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="25000"
                  dir="ltr"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>السعر قبل الخصم</Label>
                <Input
                  type="number"
                  value={form.compare_at_price}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      compare_at_price: e.target.value,
                    }))
                  }
                  placeholder="35000"
                  dir="ltr"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>الكمية</Label>
                <Input
                  type="number"
                  value={form.stock_quantity}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      stock_quantity: e.target.value,
                    }))
                  }
                  dir="ltr"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>القسم</Label>
              <select
                value={form.category_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category_id: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm"
              >
                <option value="">بدون قسم</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_ar}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>رابط الصورة</Label>
              <Input
                value={form.image_url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image_url: e.target.value }))
                }
                placeholder="https://..."
                dir="ltr"
                className="rounded-xl"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_active: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-brand-purple-600"
                />
                <Label htmlFor="is_active">فعال</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={form.is_featured}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_featured: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-brand-purple-500"
                />
                <Label htmlFor="is_featured">منتج مميز</Label>
              </div>
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
