"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import type { Order } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  Package,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalProducts: number;
}

const cardAnimation: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Fetch total orders + revenue
        const { data: orders } = await supabase
          .from("orders")
          .select("id, total, status");

        const totalOrders = orders?.length || 0;
        const totalRevenue =
          orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
        const pendingOrders =
          orders?.filter((o) => o.status === "pending").length || 0;

        // Fetch total products
        const { count: productsCount } = await supabase
          .from("products")
          .select("id", { count: "exact", head: true });

        // Fetch recent orders
        const { data: recent } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          totalOrders,
          totalRevenue,
          pendingOrders,
          totalProducts: productsCount || 0,
        });

        setRecentOrders((recent as Order[]) || []);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple-600" />
      </div>
    );
  }

  const kpiCards = [
    {
      title: "الطلبات",
      value: stats.totalOrders.toLocaleString("en-US"),
      icon: ShoppingCart,
      color: "bg-blue-500/10 text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "الإيرادات",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-brand-purple-500/10 text-brand-purple-600",
      iconBg: "bg-brand-purple-100",
    },
    {
      title: "طلبات معلقة",
      value: stats.pendingOrders.toLocaleString("en-US"),
      icon: Clock,
      color: "bg-amber-500/10 text-amber-600",
      iconBg: "bg-amber-100",
    },
    {
      title: "المنتجات",
      value: stats.totalProducts.toLocaleString("en-US"),
      icon: Package,
      color: "bg-purple-500/10 text-purple-600",
      iconBg: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="mt-1 text-sm text-gray-500">
          نظرة عامة على أداء الصيدلية
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardAnimation}
              className="rounded-2xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg}`}
                >
                  <Icon className={`h-6 w-6 ${card.color.split(" ")[1]}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="rounded-2xl bg-white p-6 shadow-md"
      >
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">أحدث الطلبات</h2>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            لا توجد طلبات بعد
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الطلب</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>المحافظة</TableHead>
                <TableHead>المجموع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => {
                const statusInfo =
                  ORDER_STATUS_LABELS[order.status] ||
                  ORDER_STATUS_LABELS["pending"];
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      {order.order_number}
                    </TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>{order.governorate_name}</TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("ar-IQ")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </div>
  );
}
