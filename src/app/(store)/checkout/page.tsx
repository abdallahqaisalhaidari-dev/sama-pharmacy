import { supabase } from "@/lib/supabase";
import type { Governorate } from "@/lib/types";
import { getSiteSettings } from "@/lib/settings";
import CheckoutForm from "@/components/checkout/checkout-form";

export const metadata = {
  title: "إتمام الطلب",
  description: "أكمل طلبك من صيدلية سما السكر - توصيل لجميع محافظات العراق",
};

// Governorates/delivery fees refresh at most every 10 minutes (ISR),
// so admin fee changes reach the checkout without a redeploy.
export const revalidate = 600;

export default async function CheckoutPage() {
  const [{ data: governorates }, settings] = await Promise.all([
    supabase
      .from("governorates")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
    getSiteSettings(),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CheckoutForm
        governorates={(governorates as Governorate[]) || []}
        whatsappNumber={settings.whatsapp}
      />
    </div>
  );
}
