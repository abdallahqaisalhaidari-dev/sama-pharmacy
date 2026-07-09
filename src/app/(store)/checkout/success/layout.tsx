import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تم استلام طلبك",
  robots: { index: false },
};

export default function CheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
