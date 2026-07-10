-- ═══════════════════════════════════════════════════════════════
-- تتبع الطلب للزبائن — شغّل هذا الملف مرة واحدة في Supabase SQL Editor
-- يسمح للزائر بالاستعلام عن حالة طلبه برقم الطلب فقط،
-- دون كشف أي بيانات عملاء أخرى (الجدول نفسه يبقى غير مقروء للعموم).
-- ═══════════════════════════════════════════════════════════════

create or replace function public.track_order(p_order_number text)
returns table (
  order_number text,
  status text,
  created_at timestamptz,
  governorate_name text,
  total numeric
)
language sql
security definer
set search_path = public
stable
as $$
  select
    o.order_number,
    o.status,
    o.created_at,
    o.governorate_name,
    o.total
  from public.orders o
  where o.order_number = 'SP-' || lpad(
    regexp_replace(trim(coalesce(p_order_number, '')), '\D', '', 'g'),
    greatest(length(regexp_replace(trim(coalesce(p_order_number, '')), '\D', '', 'g')), 5),
    '0'
  )
  limit 1;
$$;

-- الزائر (anon) يستطيع تنفيذ الدالة فقط — لا قراءة مباشرة للجدول
grant execute on function public.track_order(text) to anon, authenticated;
