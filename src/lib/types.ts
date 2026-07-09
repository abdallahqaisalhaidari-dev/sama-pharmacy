// ============================================================
// SAMA PHARMACY — TypeScript Types
// ============================================================

export interface Category {
  id: string;
  name_ar: string;
  name_en: string | null;
  slug: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name_ar: string;
  name_en: string | null;
  slug: string;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  requires_prescription: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Governorate {
  id: string;
  name_ar: string;
  name_en: string;
  delivery_fee: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  governorate_id: string;
  governorate_name: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
  line_total: number;
  created_at: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutFormData {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  governorate_id: string;
  notes?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}
