import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import type { Metadata } from "next";
import ProductDetail from "@/components/product-detail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "المنتج غير موجود" };
  }

  const description =
    product.description_ar?.slice(0, 160) ||
    `اشتري ${product.name_ar} من صيدلية سما بأفضل الأسعار`;

  return {
    title: product.name_ar,
    description,
    openGraph: {
      title: product.name_ar,
      description,
      type: "website",
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link
            href="/"
            className="transition-colors hover:text-brand-purple-600"
          >
            الرئيسية
          </Link>
          <ChevronLeft className="size-4 rotate-180" />
          <Link
            href="/shop"
            className="transition-colors hover:text-brand-purple-600"
          >
            المتجر
          </Link>
          <ChevronLeft className="size-4 rotate-180" />
          {product.category && (
            <>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="transition-colors hover:text-brand-purple-600"
              >
                {product.category.name_ar}
              </Link>
              <ChevronLeft className="size-4 rotate-180" />
            </>
          )}
          <span className="line-clamp-1 font-medium text-gray-900">
            {product.name_ar}
          </span>
        </nav>

        {/* Product Detail */}
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
