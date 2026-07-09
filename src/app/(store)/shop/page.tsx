import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, Store } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Category, Product } from "@/lib/types";
import CategoryFilter from "@/components/shop/category-filter";
import ProductGrid from "@/components/shop/product-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المتجر",
  description: "تسوق جميع المنتجات والأدوية من صيدلية سما",
};

interface ShopPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

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

async function getProducts(
  categorySlug?: string,
  searchTerm?: string
): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (searchTerm) {
    // Escape characters that break PostgREST or-syntax
    const safe = searchTerm.replace(/[,()%]/g, " ").trim();
    if (safe) {
      query = query.or(
        `name_ar.ilike.%${safe}%,name_en.ilike.%${safe}%,description_ar.ilike.%${safe}%`
      );
    }
  }

  if (categorySlug) {
    // Filter by category slug via a subquery
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (catData) {
      query = query.eq("category_id", catData.id);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data || [];
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categorySlug = params.category || null;
  const searchTerm = params.q?.trim() || null;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(categorySlug || undefined, searchTerm || undefined),
  ]);

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
          <span className="font-medium text-gray-900">المتجر</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-purple-100">
            <Store className="size-6 text-brand-purple-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              المتجر
            </h1>
            <p className="text-sm text-gray-500">
              {products.length} منتج
              {categorySlug
                ? ` في ${categories.find((c) => c.slug === categorySlug)?.name_ar || "هذا القسم"}`
                : ""}
              {searchTerm ? ` — نتائج البحث عن «${searchTerm}»` : ""}
            </p>
            {searchTerm && (
              <Link
                href={categorySlug ? `/shop?category=${categorySlug}` : "/shop"}
                className="mt-1 inline-block text-xs font-medium text-brand-purple-600 hover:text-brand-purple-800"
              >
                ✕ مسح البحث
              </Link>
            )}
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Sidebar (desktop) / Horizontal scroll (mobile) */}
          <aside className="shrink-0 lg:w-56">
            <div className="sticky top-24">
              <Suspense fallback={<div className="h-10 animate-pulse rounded-xl bg-gray-200" />}>
                <CategoryFilter
                  categories={categories}
                  activeSlug={categorySlug}
                />
              </Suspense>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <ProductGrid products={products} />
          </main>
        </div>
      </div>
    </div>
  );
}
