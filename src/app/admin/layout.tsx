import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "لوحة الإدارة | صيدلية سما",
    template: "%s | لوحة الإدارة",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
