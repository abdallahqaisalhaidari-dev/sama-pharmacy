"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  activeSlug: string | null;
}

export default function CategoryFilter({
  categories,
  activeSlug,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Desktop: Vertical sidebar list */}
      <div className="hidden lg:flex lg:flex-col lg:gap-1.5">
        <h3 className="mb-2 text-sm font-bold text-gray-500">الأقسام</h3>
        <CategoryButton
          label="الكل"
          isActive={!activeSlug}
          onClick={() => handleCategoryClick(null)}
          icon={<LayoutGrid className="size-4" />}
        />
        {categories.map((cat) => (
          <CategoryButton
            key={cat.id}
            label={cat.name_ar}
            isActive={activeSlug === cat.slug}
            onClick={() => handleCategoryClick(cat.slug)}
          />
        ))}
      </div>

      {/* Mobile: Horizontal scrollable pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden scrollbar-none">
        <CategoryPill
          label="الكل"
          isActive={!activeSlug}
          onClick={() => handleCategoryClick(null)}
        />
        {categories.map((cat) => (
          <CategoryPill
            key={cat.id}
            label={cat.name_ar}
            isActive={activeSlug === cat.slug}
            onClick={() => handleCategoryClick(cat.slug)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Desktop sidebar button ────────────────────────────────────
function CategoryButton({
  label,
  isActive,
  onClick,
  icon,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
        isActive
          ? "bg-brand-purple-600 text-white shadow-md shadow-brand-purple-600/25"
          : "bg-white text-gray-700 hover:bg-brand-purple-50 hover:text-brand-purple-700"
      }`}
    >
      {icon}
      {label}
    </motion.button>
  );
}

// ─── Mobile pill ───────────────────────────────────────────────
function CategoryPill({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
        isActive
          ? "bg-brand-purple-600 text-white shadow-md shadow-brand-purple-600/25"
          : "bg-white text-gray-700 shadow-sm hover:bg-brand-purple-50 hover:text-brand-purple-700"
      }`}
    >
      {label}
    </motion.button>
  );
}
