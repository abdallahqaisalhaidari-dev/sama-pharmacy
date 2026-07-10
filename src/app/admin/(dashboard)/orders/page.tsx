"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import type { Order, OrderItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  Search,
  Eye,
  ChevronDown,
  ClipboardList,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import OrderInvoice from "@/components/admin/order-invoice";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders((data as Order[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showAlert = (type: "success" | "error", msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      showAlert("error", "خطأ في تحديث الحالة");
    } else {
      showAlert("success", "تم تحديث حالة الطلب");
      fetchOrders();
    }
  };

  const viewOrderDetail = async (order: Order) => {
    setDetailOrder(order);
    setLoadingItems(true);
    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);
    setOrderItems((data as OrderItem[]) || []);
    setLoadingItems(false);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !search ||
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_name.includes(search) ||
      order.customer_phone.includes(search);
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-brand-purple-600" />
          إدارة الطلبات
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          عرض وإدارة جميع طلبات العملاء
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث برقم الطلب أو اسم العميل..."
            className="pr-10 rounded-xl"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm"
        >
          <option value="all">جميع الحالات</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABELS[status].label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد طلبات</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الطلب</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>المحافظة</TableHead>
                <TableHead>المجموع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const statusInfo =
                  ORDER_STATUS_LABELS[order.status] ||
                  ORDER_STATUS_LABELS["pending"];
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      {order.order_number}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.customer_name}
                    </TableCell>
                    <TableCell dir="ltr" className="text-gray-500 text-sm">
                      {order.customer_phone}
                    </TableCell>
                    <TableCell>{order.governorate_name}</TableCell>
                    <TableCell className="font-semibold text-brand-purple-600">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                          <ChevronDown className="w-3 h-3" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" dir="rtl">
                          {STATUS_OPTIONS.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() =>
                                handleStatusChange(order.id, status)
                              }
                              className={
                                order.status === status ? "font-bold" : ""
                              }
                            >
                              <span
                                className={`w-2 h-2 rounded-full ml-2 ${
                                  ORDER_STATUS_LABELS[status].color
                                    .split(" ")[0]
                                }`}
                              />
                              {ORDER_STATUS_LABELS[status].label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleDateString("ar-IQ")}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => viewOrderDetail(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog
        open={!!detailOrder}
        onOpenChange={() => setDetailOrder(null)}
      >
        <DialogContent
          className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle>
              فاتورة الطلب {detailOrder?.order_number}
            </DialogTitle>
          </DialogHeader>

          {detailOrder &&
            (loadingItems ? (
              <div className="py-16 text-center">
                <Loader2 className="mx-auto w-6 h-6 animate-spin text-brand-purple-600" />
              </div>
            ) : (
              <OrderInvoice order={detailOrder} items={orderItems} />
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
