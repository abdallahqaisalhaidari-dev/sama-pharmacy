import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اتصل بنا",
  description:
    "تواصل مع صيدلية سما السكر في الموصل - هاتف، واتساب، والعنوان وساعات العمل",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
