"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Menu, X, Pill } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import AnimatedLogo from "@/components/logo/AnimatedLogo";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المتجر" },
  { href: "/categories", label: "الأقسام" },
  { href: "/track-order", label: "تتبع الطلب" },
  { href: "/about", label: "عن الصيدلية" },
  { href: "/contact", label: "اتصل بنا" },
];

export function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setMobileOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };
  // Avoid hydration mismatch: cart count comes from localStorage,
  // so only show the badge after the component mounts on the client.
  const [hydrated, setHydrated] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());

  useEffect(() => {
    setHydrated(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 pt-3 px-4"
    >
      {/* ── Floating header card ── */}
      <div
        className={`container mx-auto rounded-3xl bg-white/90 backdrop-blur-md transition-shadow duration-500 ${
          scrolled
            ? "shadow-lg shadow-brand-purple-900/10"
            : "shadow-sm shadow-brand-purple-900/5"
        }`}
      >
        <div className="px-4 md:px-6">
          {/* Top row */}
          <div className="flex items-center justify-between h-16 gap-3 md:gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md shadow-brand-purple-600/25 bg-brand-cream-dark flex items-center justify-center p-1">
                <AnimatedLogo className="w-full h-full" />
              </div>
              <span>
                <span className="block font-heading text-lg md:text-xl font-bold text-brand-purple-900 leading-tight">
                  صيدلية سما السكر
                </span>
                <span className="block text-[9px] md:text-[10px] tracking-[0.25em] text-brand-purple-400 uppercase">
                  Sama Pharmacy
                </span>
              </span>
            </Link>

            {/* Search bar — desktop (pill) */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg">
              <div className="relative w-full">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحثي عن منتجات الصحة والجمال..."
                  className="w-full h-11 rounded-full bg-brand-purple-50 border border-brand-purple-100/60 pr-5 pl-11 text-sm text-brand-purple-900 placeholder-brand-purple-300 focus:outline-none focus:ring-2 focus:ring-brand-purple-300/40 focus:bg-white transition-all duration-300"
                />
                <button
                  type="submit"
                  aria-label="بحث"
                  className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full text-brand-purple-400 hover:text-brand-purple-700 hover:bg-brand-purple-100 transition-all duration-300"
                >
                  <Search className="w-4.5 h-4.5" />
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              {/* Cart */}
              <Link
                href="/cart"
                aria-label="سلة المشتريات"
                className="relative flex items-center justify-center w-11 h-11 rounded-full bg-brand-purple-50 hover:bg-brand-purple-100 text-brand-purple-700 transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" strokeWidth={1.75} />
                {hydrated && totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -left-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-brand-purple-600 text-white text-[10px] font-bold ring-2 ring-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex items-center justify-center w-11 h-11 rounded-full bg-brand-purple-50 hover:bg-brand-purple-100 text-brand-purple-700 transition-all duration-300"
                aria-label="القائمة"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center justify-center gap-1 pb-2.5 pt-0.5 border-t border-brand-purple-100/50">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-1.5 mt-2 rounded-full text-sm font-medium text-brand-purple-800/70 hover:text-brand-purple-700 hover:bg-brand-purple-50 transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-brand-purple-900/30 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                {/* Drawer header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm bg-brand-cream-dark flex items-center justify-center p-1">
                      <AnimatedLogo className="w-full h-full" />
                    </div>
                    <span className="font-heading font-bold text-brand-purple-900">
                      صيدلية سما السكر
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-purple-50 text-brand-purple-500 hover:text-brand-purple-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search — mobile */}
                <form onSubmit={handleSearch} className="relative mb-6">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحثي عن منتج..."
                    className="w-full h-11 rounded-full bg-brand-purple-50 border border-brand-purple-100/60 pr-5 pl-11 text-sm text-brand-purple-900 placeholder-brand-purple-300 focus:outline-none focus:ring-2 focus:ring-brand-purple-300/40"
                  />
                  <button
                    type="submit"
                    aria-label="بحث"
                    className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full text-brand-purple-400 hover:text-brand-purple-700 hover:bg-brand-purple-100 transition-all duration-300"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>

                {/* Nav links */}
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-brand-purple-800 hover:bg-brand-purple-50 hover:text-brand-purple-600 transition-all duration-300 font-medium"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
