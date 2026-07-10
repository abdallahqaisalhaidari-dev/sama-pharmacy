import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Grid3X3 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/types";
import { getCategoryIcon } from "@/lib/category-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "أقسام الصيدلية",
  description: "تصفح أقسام صيدلية سما - جميع الفئات والمنتجات الطبية",
};

// Refresh categories at most every hour (ISR)
export const revalidate = 3600;

async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data || [];
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link
            href="/"
            className="transition-colors hover:text-brand-purple-600"
          >
            الرئيسية
          </Link>
          <ChevronLeft className="size-4 rotate-180" />
          <span className="font-medium text-gray-900">أقسام الصيدلية</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-purple-100">
            <Grid3X3 className="size-6 text-brand-purple-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              أقسام الصيدلية
            </h1>
            <p className="text-sm text-gray-500">
              تصفح {categories.length} قسم من منتجاتنا
            </p>
          </div>
        </div>

        {/* Categories Grid — same card language as the home page */}
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white py-20 shadow-sm">
            <div className="flex size-20 items-center justify-center rounded-full bg-brand-cream-dark">
              <Grid3X3 className="size-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">
              لا توجد أقسام حالياً
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, i) => {
              const Icon = getCategoryIcon(category.slug, i);
              return (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-brand-purple-100/50 bg-white p-4 shadow-sm transition-all duration-400 hover:-translate-y-0.5 hover:border-brand-purple-200 hover:shadow-xl hover:shadow-brand-purple-900/8 md:p-5"
                >
                  {category.image_url ? (
                    <span className="relative block size-13 shrink-0 overflow-hidden rounded-full ring-1 ring-brand-purple-100 transition-all duration-400 group-hover:ring-brand-purple-300 md:size-14">
                      <Image
                        src={category.image_url}
                        alt={category.name_ar}
                        fill
                        sizes="56px"
                        className="object-cover transition-transform duration-400 group-hover:scale-110"
                      />
                    </span>
                  ) : (
                    <span className="flex size-13 shrink-0 items-center justify-center rounded-full bg-brand-purple-50 text-brand-purple-500 ring-1 ring-brand-purple-100 transition-all duration-400 group-hover:bg-brand-purple-100 group-hover:text-brand-purple-700 md:size-14">
                      <Icon className="size-6" strokeWidth={1.5} />
                    </span>
                  )}
                  <span className="text-sm font-bold text-brand-purple-900 transition-colors duration-400 group-hover:text-brand-purple-600 md:text-base">
                    {category.name_ar}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
