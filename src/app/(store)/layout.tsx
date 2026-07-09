import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SettingsProvider } from "@/components/settings-provider";
import { getSiteSettings } from "@/lib/settings";

// Refresh site settings (phone, texts, socials...) at most every 10 minutes
export const revalidate = 600;

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <SettingsProvider settings={settings}>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} />
    </SettingsProvider>
  );
}
