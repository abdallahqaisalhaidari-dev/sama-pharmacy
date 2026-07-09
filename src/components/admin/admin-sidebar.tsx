"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Package,
  MapPin,
  ClipboardList,
  LogOut,
  Menu,
  Pill,
  FolderOpen,
  Quote,
  Settings,
} from "lucide-react";

const navItems = [
  {
    label: "لوحة التحكم",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "المنتجات",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "الأقسام",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    label: "الطلبات",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    label: "المحافظات والتوصيل",
    href: "/admin/governorates",
    icon: MapPin,
  },
  {
    label: "آراء العملاء",
    href: "/admin/testimonials",
    icon: Quote,
  },
  {
    label: "إعدادات الموقع",
    href: "/admin/settings",
    icon: Settings,
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Full navigation so the middleware re-runs with cleared cookies.
    window.location.assign("/admin/login");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-brand-purple-500/20">
          <img src="/logo.png" alt="صيدلية سما" className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">صيدلية سما</h1>
          <p className="text-xs text-gray-400">لوحة الإدارة</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-brand-purple-600 text-white shadow-lg shadow-brand-purple-600/25"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 overflow-hidden rounded-md">
            <img src="/logo.png" alt="صيدلية سما" className="h-full w-full object-cover" />
          </div>
          <span className="font-bold text-gray-900">صيدلية سما</span>
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent
            side="right"
            className="w-72 bg-[#1A1A2E] p-0"
            showCloseButton={false}
          >
            <SheetTitle className="sr-only">قائمة التنقل</SheetTitle>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-64 bg-[#1A1A2E] lg:block">
        <SidebarContent />
      </aside>
    </>
  );
}
