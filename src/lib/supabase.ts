import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Public (anonymous) Supabase client.
 *
 * Used for storefront reads (products, categories, governorates) and
 * anonymous order inserts. It never holds an auth session — auth for
 * the admin panel lives in `supabase-browser.ts` (cookie-based, so the
 * middleware can protect /admin routes).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
