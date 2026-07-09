# Sama Pharmacy — Production Deployment Guide

Follow these phases in order. Total time: ~30 minutes.

---

## Phase 0 — Verify locally (5 min)

Dependencies changed (`@supabase/ssr` added, `lucide-react` pinned to `1.22.0` because `1.23.0` was published without TypeScript types and breaks `next build`). Run:

```bash
npm install
npm run build
```

The build must finish with no errors. Then test the auth flow locally:

```bash
npm run dev
```

**Auth test checklist** (all enforced by the new `src/middleware.ts`):

| # | Action | Expected result |
|---|--------|-----------------|
| 1 | Open `/admin` while logged out | Instant redirect to `/admin/login?redirect=/admin` — no flash of the dashboard |
| 2 | Open `/admin/orders` while logged out | Redirect to login; after logging in you land back on `/admin/orders` |
| 3 | Log in with wrong password | Arabic error message, stays on login page |
| 4 | Log in with correct credentials | Lands on `/admin`, no storefront header/footer visible |
| 5 | Open `/admin/login` while logged in | Instant redirect to `/admin` |
| 6 | Click تسجيل الخروج (logout) | Back to login; pressing Back does not show the dashboard |
| 7 | Open `/` and `/shop` | Storefront works, header/footer present, no admin chrome |

---

## Phase 1 — Lock down Supabase for production (10 min)

Do this **before** the site goes public.

### 1.1 Disable public sign-ups (critical)

The middleware lets in *any* authenticated Supabase user. If sign-ups stay open, anyone could create an account via the API and reach `/admin`.

- Dashboard → **Authentication → Sign In / Up** → turn **OFF** "Allow new users to sign up".
- Your admin account already exists, so this only blocks strangers.

### 1.2 Verify RLS policies

Dashboard → **Database → Policies**. Confirm:

- `products`, `categories`, `governorates`: public **SELECT** (only `is_active` rows if that's your policy), write access restricted to `authenticated`.
- `orders`, `order_items`: public **INSERT** (checkout is anonymous), **SELECT/UPDATE** restricted to `authenticated`.
- No table has RLS disabled.

Quick test from an incognito browser console on your deployed site: anonymous users must NOT be able to read `orders`.

### 1.3 Auth URL configuration

Dashboard → **Authentication → URL Configuration**:

- **Site URL**: your production URL (e.g. `https://sama-pharmacy.vercel.app`), replace later with your custom domain.

---

## Phase 2 — Push to GitHub (5 min)

```bash
git add -A
git commit -m "Polish: route groups, SSR auth middleware, skeletons, SEO"
```

Create a **private** repository on GitHub, then:

```bash
git remote add origin https://github.com/<your-username>/sama-pharmacy.git
git branch -M main
git push -u origin main
```

`.env.local` is in `.gitignore` — verify it is NOT in the pushed repo.

---

## Phase 3 — Deploy on Vercel (10 min)

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **Add New → Project** → import `sama-pharmacy`.
2. Framework preset: **Next.js** (auto-detected). Leave build settings as default.
3. Before clicking Deploy, expand **Environment Variables** and add all four:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` (from `.env.local`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key (from `.env.local`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | pharmacy number with country code, no `+` (e.g. `9647xxxxxxxxx`) |
| `NEXT_PUBLIC_SITE_URL` | leave as `https://sama-pharmacy.vercel.app` for now; update after you know the final domain |

4. Click **Deploy** and wait for the build to go green.
5. After the first deploy, copy the real production URL, update `NEXT_PUBLIC_SITE_URL` in Vercel → Settings → Environment Variables, and **redeploy** (env vars are baked in at build time).
6. Update the Supabase **Site URL** (Phase 1.3) to match.

---

## Phase 4 — Post-deploy smoke test (5 min)

On the production URL:

- [ ] `/` loads with products and categories
- [ ] `/shop?category=...` filter works
- [ ] Product page → add to cart → cart persists after refresh
- [ ] Full checkout: order appears in Supabase `orders` + WhatsApp opens pre-filled
- [ ] `/admin` redirects to login; login works; orders/products/governorates CRUD works
- [ ] `/sitemap.xml` lists the static pages + products
- [ ] `/robots.txt` shows `Disallow: /admin`
- [ ] Share the homepage link in WhatsApp — Arabic title + description preview appears

---

## Phase 5 — Custom domain (optional)

1. Vercel → Project → Settings → **Domains** → add your domain, follow the DNS instructions.
2. Update `NEXT_PUBLIC_SITE_URL` to the custom domain → redeploy.
3. Update Supabase Auth **Site URL** to the custom domain.

---

## Known non-blocking notes

- **Checkout atomicity**: the order and its items are inserted in two separate calls. If the second fails, an order row without items remains. Low risk for current volume; the proper fix is a Postgres RPC function doing both in one transaction — can be added later without UI changes.
- **ESLint**: `npm run lint` reports 3 `react-hooks/set-state-in-effect` errors in the admin CRUD pages (a strict new rule about calling fetch-then-setState directly in `useEffect`). They do not affect `next build` or runtime; safe to clean up later.
- **`middleware.ts` naming**: Next 16 prefers the new name `proxy.ts`; `middleware.ts` still works. If a future Next upgrade complains, rename `src/middleware.ts` → `src/proxy.ts` and the exported function `middleware` → `proxy`.
