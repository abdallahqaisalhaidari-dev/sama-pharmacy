-- ============================================================
-- SAMA PHARMACY — Admin Extension (run once in Supabase SQL Editor)
-- يضيف: جدول إعدادات الموقع، جدول آراء الزبائن،
-- يصلّح صلاحيات الإضافة/التعديل، ويزرع الأقسام والمحافظات.
-- آمن لإعادة التشغيل (idempotent).
-- ============================================================

-- ── 1) جدول إعدادات الموقع ──────────────────────────────────
create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read"
  on public.site_settings for select using (true);

drop policy if exists "site_settings_admin_write" on public.site_settings;
create policy "site_settings_admin_write"
  on public.site_settings for all
  to authenticated using (true) with check (true);

insert into public.site_settings (key, value) values
  ('phone',            '+964 770 123 4567'),
  ('whatsapp',         '9647701234567'),
  ('email',            'info@sama-pharmacy.iq'),
  ('address',          'الموصل، نينوى، العراق'),
  ('working_hours',    'يومياً 9 صباحاً — 11 مساءً'),
  ('facebook',         ''),
  ('instagram',        ''),
  ('hero_title_line1', 'ارتقي بصحتكِ،'),
  ('hero_title_line2', 'وتألّقي بجمالكِ'),
  ('hero_subtitle',    'رحلة منسّقة بعناية من منتجات الصحة والجمال، مع شريككم الموثوق — صيدلية سما السكر في الموصل.'),
  ('footer_about',     'صيدلية متكاملة في مدينة الموصل نقدم لكم أفضل الأدوية والمستحضرات الطبية والتجميلية بأسعار مناسبة مع خدمة توصيل سريعة وموثوقة.')
on conflict (key) do nothing;

-- ── 2) جدول آراء الزبائن ────────────────────────────────────
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null default '',
  quote text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "testimonials_public_read" on public.testimonials;
create policy "testimonials_public_read"
  on public.testimonials for select using (true);

drop policy if exists "testimonials_admin_write" on public.testimonials;
create policy "testimonials_admin_write"
  on public.testimonials for all
  to authenticated using (true) with check (true);

insert into public.testimonials (name, location, quote, sort_order)
select * from (values
  ('زينب م.', 'الموصل', 'خدمة ممتازة وتوصيل سريع، والصيدلي جاوبني على كل استفساراتي قبل الطلب. أنصح الجميع بالتعامل معهم.', 1),
  ('رغد ع.', 'أربيل', 'المنتجات أصلية والأسعار مناسبة جداً مقارنة بالسوق. صار مصدري الأساسي لمستحضرات العناية.', 2),
  ('أحمد س.', 'بغداد', 'طلبت فيتامينات لوالدتي ووصلت بنفس اليوم مع شرح كامل عن طريقة الاستخدام. تعامل راقٍ جداً.', 3)
) as t(name, location, quote, sort_order)
where not exists (select 1 from public.testimonials);

-- ── 3) إصلاح صلاحيات الكتابة للجداول الموجودة ───────────────
-- (سبب "لا يقبل يضيف"): سياسات الكتابة للمستخدم المسجّل
drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write"
  on public.categories for all
  to authenticated using (true) with check (true);

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write"
  on public.products for all
  to authenticated using (true) with check (true);

drop policy if exists "governorates_admin_write" on public.governorates;
create policy "governorates_admin_write"
  on public.governorates for all
  to authenticated using (true) with check (true);

drop policy if exists "orders_admin_write" on public.orders;
create policy "orders_admin_write"
  on public.orders for all
  to authenticated using (true) with check (true);

drop policy if exists "order_items_admin_read" on public.order_items;
create policy "order_items_admin_read"
  on public.order_items for select
  to authenticated using (true);

-- ── 4) زرع الأقسام الافتراضية (فقط إذا كان الجدول فارغاً) ──
insert into public.categories (name_ar, name_en, slug, sort_order, is_active)
select * from (values
  ('الأدوية',           'Medicines',        'medicines',        1, true),
  ('العناية بالبشرة',   'Skincare',         'skincare',         2, true),
  ('الفيتامينات',       'Vitamins',         'vitamins',         3, true),
  ('عناية الأطفال',     'Baby Care',        'baby',             4, true),
  ('العناية الشخصية',   'Personal Care',    'personal_care',    5, true),
  ('الأجهزة الطبية',    'Medical Devices',  'medical_devices',  6, true),
  ('المكملات الغذائية', 'Supplements',      'supplements',      7, true),
  ('العناية بالشعر',    'Hair Care',        'hair_care',        8, true)
) as t(name_ar, name_en, slug, sort_order, is_active)
where not exists (select 1 from public.categories);

-- ── 5) زرع المحافظات العراقية (فقط إذا كان الجدول فارغاً) ──
insert into public.governorates (name_ar, name_en, delivery_fee, sort_order, is_active)
select * from (values
  ('نينوى',      'Nineveh',      3000, 1,  true),
  ('بغداد',      'Baghdad',      5000, 2,  true),
  ('أربيل',      'Erbil',        5000, 3,  true),
  ('البصرة',     'Basra',        6000, 4,  true),
  ('كركوك',      'Kirkuk',       5000, 5,  true),
  ('دهوك',       'Duhok',        5000, 6,  true),
  ('السليمانية', 'Sulaymaniyah', 5000, 7,  true),
  ('الأنبار',    'Anbar',        6000, 8,  true),
  ('بابل',       'Babylon',      6000, 9,  true),
  ('كربلاء',     'Karbala',      6000, 10, true),
  ('النجف',      'Najaf',        6000, 11, true),
  ('القادسية',   'Al-Qadisiyyah',6000, 12, true),
  ('ذي قار',     'Dhi Qar',      6000, 13, true),
  ('ميسان',      'Maysan',       6000, 14, true),
  ('المثنى',     'Al-Muthanna',  6000, 15, true),
  ('واسط',       'Wasit',        6000, 16, true),
  ('صلاح الدين', 'Saladin',      5000, 17, true),
  ('ديالى',      'Diyala',       5000, 18, true)
) as t(name_ar, name_en, delivery_fee, sort_order, is_active)
where not exists (select 1 from public.governorates);
