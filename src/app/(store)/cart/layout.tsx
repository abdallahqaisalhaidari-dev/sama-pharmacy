import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سلة المشتريات",
  description: "راجع منتجاتك وأكمل طلبك من صيدلية سما السكر",
  robots: { index: false },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
