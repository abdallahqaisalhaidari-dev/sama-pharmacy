-- ============================================================
-- SAMA PHARMACY — Complete Database Schema
-- شغّل هذا الملف كاملاً مرة واحدة في Supabase → SQL Editor
-- ينشئ كل الجداول + الصلاحيات + البيانات الجاهزة من الصفر.
-- آمن لإعادة التشغيل (idempotent) — لا يحذف بيانات موجودة.
-- ============================================================

-- ── دالة تحديث updated_at تلقائياً ──────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ============================================================
-- 1) الأقسام
-- ============================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text,
  slug text not null unique,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2) المنتجات
-- ============================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name_ar text not null,
  name_en text,
  slug text not null unique,
  description_ar text,
  description_en text,
  price numeric not null default 0,
  compare_at_price numeric,
  sku text,
  stock_quantity integer not null default 0,
  low_stock_threshold integer not null default 5,
  images text[] not null default '{}',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  requires_prescription boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ============================================================
-- 3) المحافظات ورسوم التوصيل
-- ============================================================
create table if not exists public.governorates (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  delivery_fee numeric not null default 0,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 4) الطلبات
-- ============================================================
create sequence if not exists public.order_number_seq;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  governorate_id uuid references public.governorates(id) on delete set null,
  governorate_name text not null,
  subtotal numeric not null default 0,
  delivery_fee numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'pending'
    check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ترقيم تلقائي للطلبات: SP-00001, SP-00002...
create or replace function public.set_order_number()
returns trigger language plpgsql as $$
begin
  if new.order_number is null then
    new.order_number := 'SP-' || lpad(nextval('public.order_number_seq')::text, 5, '0');
  end if;
  return new;
end $$;

drop trigger if exists orders_set_order_number on public.orders;
create trigger orders_set_order_number
  before insert on public.orders
  for each row execute function public.set_order_number();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ============================================================
-- 5) عناصر الطلب
-- ============================================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_price numeric not null default 0,
  quantity integer not null default 1,
  line_total numeric not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 6) إعدادات الموقع
-- ============================================================
create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 7) آراء العملاء
-- ============================================================
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null default '',
  quote text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 8) الصلاحيات (RLS)
-- ============================================================
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.governorates enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.site_settings enable row level security;
alter table public.testimonials enable row level security;

-- الزوار: قراءة العناصر الفعالة فقط
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (is_active = true);

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (is_active = true);

drop policy if exists "governorates_public_read" on public.governorates;
create policy "governorates_public_read" on public.governorates
  for select using (is_active = true);

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
  for select using (true);

drop policy if exists "testimonials_public_read" on public.testimonials;
create policy "testimonials_public_read" on public.testimonials
  for select using (is_active = true);

-- الزوار: إنشاء الطلبات (الدفع عند الاستلام)
drop policy if exists "orders_public_insert" on public.orders;
create policy "orders_public_insert" on public.orders
  for insert with check (true);

drop policy if exists "order_items_public_insert" on public.order_items;
create policy "order_items_public_insert" on public.order_items
  for insert with check (true);

-- الأدمن (مستخدم مسجّل): كل الصلاحيات
drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all" on public.categories
  for all to authenticated using (true) with check (true);

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all" on public.products
  for all to authenticated using (true) with check (true);

drop policy if exists "governorates_admin_all" on public.governorates;
create policy "governorates_admin_all" on public.governorates
  for all to authenticated using (true) with check (true);

drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all" on public.orders
  for all to authenticated using (true) with check (true);

drop policy if exists "order_items_admin_all" on public.order_items;
create policy "order_items_admin_all" on public.order_items
  for all to authenticated using (true) with check (true);

drop policy if exists "site_settings_admin_all" on public.site_settings;
create policy "site_settings_admin_all" on public.site_settings
  for all to authenticated using (true) with check (true);

drop policy if exists "testimonials_admin_all" on public.testimonials;
create policy "testimonials_admin_all" on public.testimonials
  for all to authenticated using (true) with check (true);

-- ============================================================
-- 9) البيانات الجاهزة (تُزرع فقط إذا كانت الجداول فارغة)
-- ============================================================

-- الأقسام
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

-- المحافظات
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

-- إعدادات الموقع
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

-- آراء العملاء
insert into public.testimonials (name, location, quote, sort_order)
select * from (values
  ('زينب م.', 'الموصل', 'خدمة ممتازة وتوصيل سريع، والصيدلي جاوبني على كل استفساراتي قبل الطلب. أنصح الجميع بالتعامل معهم.', 1),
  ('رغد ع.', 'أربيل', 'المنتجات أصلية والأسعار مناسبة جداً مقارنة بالسوق. صار مصدري الأساسي لمستحضرات العناية.', 2),
  ('أحمد س.', 'بغداد', 'طلبت فيتامينات لوالدتي ووصلت بنفس اليوم مع شرح كامل عن طريقة الاستخدام. تعامل راقٍ جداً.', 3)
) as t(name, location, quote, sort_order)
where not exists (select 1 from public.testimonials);

-- منتجات تجريبية (لرؤية المتجر يعمل — يمكن حذفها من لوحة الإدارة)
insert into public.products
  (category_id, name_ar, name_en, slug, description_ar, price, compare_at_price, stock_quantity, is_active, is_featured)
select c.id, t.name_ar, t.name_en, t.slug, t.description_ar, t.price, t.compare_at_price, 50, true, true
from (values
  ('skincare',    'سيروم فيتامين سي للوجه',      'Vitamin C Serum',      'vitamin-c-serum',    'سيروم مركّز بفيتامين سي لتفتيح البشرة وتوحيد لونها.', 25000, 30000),
  ('skincare',    'كريم مرطب ليلي',              'Night Cream',          'night-cream',        'كريم ليلي غني يرطب البشرة بعمق أثناء النوم.',           18000, null::numeric),
  ('vitamins',    'فيتامين د3 5000 وحدة',        'Vitamin D3 5000IU',    'vitamin-d3-5000',    'مكمل فيتامين د3 لدعم صحة العظام والمناعة.',             15000, 20000),
  ('supplements', 'أوميغا 3 زيت السمك',          'Omega 3 Fish Oil',     'omega-3-fish-oil',   'كبسولات أوميغا 3 عالية النقاء لصحة القلب والدماغ.',     22000, null::numeric)
) as t(cat_slug, name_ar, name_en, slug, description_ar, price, compare_at_price)
join public.categories c on c.slug = t.cat_slug
where not exists (select 1 from public.products);

-- ============================================================
-- 10) دالة إنشاء الطلب (آمنة وذرّية — انظر checkout-rpc.sql)
-- ============================================================
create or replace function public.create_order(
  p_customer_name text,
  p_customer_phone text,
  p_customer_address text,
  p_governorate_id uuid,
  p_notes text,
  p_items jsonb
)
returns table (order_id uuid, order_number text, total numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_gov public.governorates;
  v_order public.orders;
  v_subtotal numeric;
  v_item_count integer;
  v_inserted_count integer;
begin
  if coalesce(trim(p_customer_name), '') = '' then
    raise exception 'customer_name is required';
  end if;
  if coalesce(trim(p_customer_phone), '') = '' then
    raise exception 'customer_phone is required';
  end if;
  if coalesce(trim(p_customer_address), '') = '' then
    raise exception 'customer_address is required';
  end if;

  select count(*) into v_item_count from jsonb_array_elements(p_items);
  if v_item_count = 0 or v_item_count > 50 then
    raise exception 'invalid items count';
  end if;

  select * into v_gov
  from public.governorates
  where id = p_governorate_id and is_active = true;
  if not found then
    raise exception 'governorate not found';
  end if;

  insert into public.orders (
    customer_name, customer_phone, customer_address,
    governorate_id, governorate_name,
    subtotal, delivery_fee, total, notes, status
  ) values (
    trim(p_customer_name), trim(p_customer_phone), trim(p_customer_address),
    v_gov.id, v_gov.name_ar,
    0, v_gov.delivery_fee, 0, nullif(trim(coalesce(p_notes, '')), ''), 'pending'
  )
  returning * into v_order;

  insert into public.order_items (
    order_id, product_id, product_name, product_price, quantity, line_total
  )
  select
    v_order.id, p.id, p.name_ar, p.price, x.qty, p.price * x.qty
  from (
    select
      (i->>'product_id')::uuid as pid,
      greatest(1, least(coalesce((i->>'quantity')::int, 1), 99)) as qty
    from jsonb_array_elements(p_items) i
  ) x
  join public.products p on p.id = x.pid and p.is_active = true;

  get diagnostics v_inserted_count = row_count;
  if v_inserted_count <> v_item_count then
    raise exception 'one or more products not found or inactive';
  end if;

  select coalesce(sum(line_total), 0) into v_subtotal
  from public.order_items where public.order_items.order_id = v_order.id;

  update public.orders o
  set subtotal = v_subtotal, total = v_subtotal + v_gov.delivery_fee
  where o.id = v_order.id;

  return query
    select v_order.id, v_order.order_number, v_subtotal + v_gov.delivery_fee;
end $$;

revoke all on function public.create_order(text, text, text, uuid, text, jsonb) from public;
grant execute on function public.create_order(text, text, text, uuid, text, jsonb) to anon, authenticated;
