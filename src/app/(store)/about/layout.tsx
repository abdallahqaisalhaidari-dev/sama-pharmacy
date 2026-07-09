import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "عن الصيدلية",
  description:
    "تعرف على صيدلية سما السكر في الموصل - رؤيتنا، خدماتنا، والتزامنا بصحتك",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
