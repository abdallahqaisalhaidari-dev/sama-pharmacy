"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client (cookie-based session).
 *
 * Use this in ALL client components that deal with auth or
 * authenticated CRUD (the admin panel). Because the session is
 * stored in cookies, the middleware can protect /admin routes
 * server-side before any page renders.
 */
export const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
