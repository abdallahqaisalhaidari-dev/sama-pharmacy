-- ============================================================
-- SAMA PHARMACY — Checkout RPC (شغّله مرة واحدة في SQL Editor)
-- ينشئ الطلب وعناصره بعملية واحدة آمنة ويعيد رقم الطلب.
-- الأسعار تُحسب من قاعدة البيانات (لا يمكن التلاعب بها من المتصفح).
-- ============================================================

create or replace function public.create_order(
  p_customer_name text,
  p_customer_phone text,
  p_customer_address text,
  p_governorate_id uuid,
  p_notes text,
  p_items jsonb  -- [{"product_id": "...", "quantity": 2}, ...]
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
  -- تحقق من المدخلات
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

  -- المحافظة ورسوم التوصيل (من قاعدة البيانات)
  select * into v_gov
  from public.governorates
  where id = p_governorate_id and is_active = true;
  if not found then
    raise exception 'governorate not found';
  end if;

  -- إنشاء الطلب (المجاميع تُحدّث بعد إدخال العناصر)
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

  -- إدخال العناصر بأسعار من جدول المنتجات
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

  -- تحديث المجاميع
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
