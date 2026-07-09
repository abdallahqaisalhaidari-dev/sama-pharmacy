import { supabase } from "@/lib/supabase";
import type { Product, Category, Testimonial } from "@/lib/types";
import { HeroBanner } from "@/components/home/hero-banner";
import { CategoryStrip } from "@/components/home/category-strip";
import { PromoBanners } from "@/components/home/promo-banners";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ServicesSection } from "@/components/home/services-section";
import { Testimonials } from "@/components/home/testimonials";
import { SubscribeBanner } from "@/components/home/subscribe-banner";

// Re-fetch products/categories at most every 5 minutes (ISR).
// Without this the page is frozen with build-time data.
export const revalidate = 300;

export default async function HomePage() {
  // Fetch featured products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(8);

  // Fetch active categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  // Fetch customer testimonials (admin-managed)
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(3);

  return (
    <div className="space-y-0">
      <HeroBanner />
      <CategoryStrip categories={(categories as Category[]) || []} />
      <PromoBanners />
      <FeaturedProducts products={(products as Product[]) || []} />
      <ServicesSection />
      <Testimonials items={(testimonials as Testimonial[]) || []} />
      <SubscribeBanner />
    </div>
  );
}
