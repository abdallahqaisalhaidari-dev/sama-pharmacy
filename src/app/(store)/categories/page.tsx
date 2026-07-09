import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Grid3X3 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "أقسام الصيدلية",
  description: "تصفح أقسام صيدلية سما - جميع الفئات والمنتجات الطبية",
};

// Refresh categories at most every hour (ISR)
export const revalidate = 3600;

// Gradient presets for cards without images
const gradients = [
  "from-brand-purple-400 to-teal-600",
  "from-violet-400 to-purple-600",
  "from-blue-400 to-indigo-600",
  "from-rose-400 to-pink-600",
  "from-amber-400 to-orange-600",
  "from-cyan-400 to-sky-600",
  "from-fuchsia-400 to-purple-600",
  "from-lime-400 to-green-600",
];

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
            <Grid3X3 className="size-6 text-violet-700" />
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

        {/* Categories Grid */}
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
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Card Background */}
                <div className="relative aspect-[4/3]">
                  {category.image_url ? (
                    <>
                      <Image
                        src={category.image_url}
                        alt={category.name_ar}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Dark overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </>
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        gradients[index % gradients.length]
                      } transition-all duration-500 group-hover:scale-110`}
                    />
                  )}

                  {/* Category Name */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
                    <div className="rounded-xl bg-white/20 px-4 py-2 backdrop-blur-md transition-all group-hover:bg-white/30">
                      <h2 className="text-center text-lg font-bold text-white">
                        {category.name_ar}
                      </h2>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
