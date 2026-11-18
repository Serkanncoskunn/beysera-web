-- Beysera ziyaret takibi
-- Supabase > SQL Editor'de bir kez çalıştırın. Tekrar çalıştırmak güvenlidir.
-- Yazma ve okuma yalnızca sunucu fonksiyonlarından (service_role anahtarıyla) yapılır;
-- tarayıcıdaki anon anahtarın bu tabloya hiçbir erişimi yoktur.
-- Kişisel veri tutulmaz: IP adresi saklanmaz, ziyaretçi kimliği tarayıcıda üretilen rastgele bir değerdir.

create table if not exists public.ziyaretler (
  id            bigint generated always as identity primary key,
  olusturma     timestamptz not null default now(),
  ziyaretci_id  text not null check (char_length(ziyaretci_id) between 8 and 64),
  oturum_id     text not null check (char_length(oturum_id) between 8 and 64),
  olay          text not null default 'sayfa'
                check (olay in ('sayfa', 'sihirbaz', 'whatsapp', 'telegram', 'eposta', 'gorusme')),
  detay         text check (char_length(detay) <= 120),
  yol           text check (char_length(yol) <= 200),
  kaynak        text not null default 'Doğrudan' check (char_length(kaynak) <= 80),
  referans_alan text check (char_length(referans_alan) <= 120),
  utm_source    text check (char_length(utm_source) <= 80),
  utm_medium    text check (char_length(utm_medium) <= 80),
  utm_campaign  text check (char_length(utm_campaign) <= 80),
  ulke          text check (char_length(ulke) <= 8),
  sehir         text check (char_length(sehir) <= 80),
  cihaz         text check (cihaz in ('mobil', 'tablet', 'masaustu')),
  dil           text check (char_length(dil) <= 8)
);

create index if not exists ziyaretler_olusturma_idx on public.ziyaretler (olusturma desc);

alter table public.ziyaretler enable row level security;
revoke all on public.ziyaretler from anon, authenticated;

-- Analiz: günlük (son 30 gün), haftalık (son 12 hafta) ya da aylık (son 12 ay).
-- Saatler İstanbul saatine göre gruplanır. Bir önceki eşit dönemle karşılaştırma da döner.
-- "ziyaret" = oturum sayısı, "tekil" = farklı ziyaretçi, "donusum" = sihirbazı açan ya da
-- WhatsApp / Telegram / e-posta / görüşme bağlantısına tıklayan oturum.
create or replace function public.ziyaret_ozeti(p_donem text default 'gunluk')
returns jsonb
language plpgsql
stable
set search_path = public
as $$
declare
  tz       constant text := 'Europe/Istanbul';
  v_birim  text;
  v_adim   interval;
  v_adet   int;
  v_simdi  timestamp := now() at time zone tz;
  v_bas    timestamp;
  v_son    timestamp;
  v_onceki timestamp;
  v_sonuc  jsonb;
begin
  case p_donem
    when 'gunluk'   then v_birim := 'day';   v_adim := interval '1 day';   v_adet := 30;
    when 'haftalik' then v_birim := 'week';  v_adim := interval '1 week';  v_adet := 12;
    when 'aylik'    then v_birim := 'month'; v_adim := interval '1 month'; v_adet := 12;
    else raise exception 'Geçersiz dönem: %', p_donem;
  end case;

  v_son    := date_trunc(v_birim, v_simdi) + v_adim;          -- dönemin bitişi (hariç)
  v_bas    := date_trunc(v_birim, v_simdi) - v_adim * (v_adet - 1);
  v_onceki := v_bas - (v_son - v_bas);                         -- bir önceki eşit uzunlukta dönem

  with z as (
    select *, (olusturma at time zone tz) as yerel
    from ziyaretler
    where olusturma >= (v_onceki at time zone tz)
  ),
  simdi as (select * from z where yerel >= v_bas),
  once  as (select * from z where yerel <  v_bas)
  select jsonb_build_object(
    'donem', p_donem,
    'baslangic', to_char(v_bas, 'YYYY-MM-DD'),
    'toplam', (
      select jsonb_build_object(
        'ziyaret', count(distinct oturum_id),
        'tekil',   count(distinct ziyaretci_id),
        'sayfa',   count(*) filter (where olay = 'sayfa'),
        'donusum', count(distinct oturum_id) filter (where olay <> 'sayfa')
      ) from simdi
    ),
    'onceki', (
      select jsonb_build_object(
        'ziyaret', count(distinct oturum_id),
        'tekil',   count(distinct ziyaretci_id),
        'sayfa',   count(*) filter (where olay = 'sayfa'),
        'donusum', count(distinct oturum_id) filter (where olay <> 'sayfa')
      ) from once
    ),
    'seri', (
      select coalesce(jsonb_agg(jsonb_build_object(
               't', to_char(g, 'YYYY-MM-DD'),
               'ziyaret', coalesce(s.ziyaret, 0),
               'tekil', coalesce(s.tekil, 0)) order by g), '[]'::jsonb)
      from generate_series(v_bas, v_son - v_adim, v_adim) g
      left join (
        select date_trunc(v_birim, yerel) as d,
               count(distinct oturum_id) as ziyaret,
               count(distinct ziyaretci_id) as tekil
        from simdi group by 1
      ) s on s.d = g
    ),
    'kaynaklar', (
      select coalesce(jsonb_agg(jsonb_build_object('ad', ad, 'ziyaret', n) order by n desc, ad), '[]'::jsonb)
      from (
        -- Her ziyaretin kaynağı, o oturumdaki ilk sayfa açılışından alınır.
        select kaynak as ad, count(*) as n
        from (
          select distinct on (oturum_id) oturum_id, kaynak
          from simdi where olay = 'sayfa'
          order by oturum_id, olusturma
        ) ilk
        group by 1 order by 2 desc limit 10
      ) x
    ),
    'ulkeler', (
      select coalesce(jsonb_agg(jsonb_build_object('ad', ad, 'ziyaret', n) order by n desc, ad), '[]'::jsonb)
      from (select coalesce(ulke, '?') as ad, count(distinct oturum_id) as n from simdi group by 1 order by 2 desc limit 10) x
    ),
    'sehirler', (
      select coalesce(jsonb_agg(jsonb_build_object('ad', ad, 'ziyaret', n) order by n desc, ad), '[]'::jsonb)
      from (
        select concat_ws(', ', nullif(sehir, ''), ulke) as ad, count(distinct oturum_id) as n
        from simdi where sehir is not null and sehir <> ''
        group by 1 order by 2 desc limit 10
      ) x
    ),
    'cihazlar', (
      select coalesce(jsonb_agg(jsonb_build_object('ad', ad, 'ziyaret', n) order by n desc, ad), '[]'::jsonb)
      from (select coalesce(cihaz, '?') as ad, count(distinct oturum_id) as n from simdi group by 1) x
    ),
    'diller', (
      select coalesce(jsonb_agg(jsonb_build_object('ad', ad, 'ziyaret', n) order by n desc, ad), '[]'::jsonb)
      from (select coalesce(dil, '?') as ad, count(distinct oturum_id) as n from simdi group by 1) x
    ),
    'kampanyalar', (
      select coalesce(jsonb_agg(jsonb_build_object('ad', ad, 'ziyaret', n) order by n desc, ad), '[]'::jsonb)
      from (
        select concat_ws(' / ', utm_source, utm_campaign) as ad, count(distinct oturum_id) as n
        from simdi where olay = 'sayfa' and (utm_source is not null or utm_campaign is not null)
        group by 1 order by 2 desc limit 10
      ) x
    ),
    'etkilesimler', (
      select coalesce(jsonb_agg(jsonb_build_object('ad', ad, 'ziyaret', n) order by n desc, ad), '[]'::jsonb)
      from (select olay as ad, count(*) as n from simdi where olay <> 'sayfa' group by 1) x
    ),
    'hizmetler', (
      select coalesce(jsonb_agg(jsonb_build_object('ad', ad, 'ziyaret', n) order by n desc, ad), '[]'::jsonb)
      from (
        select split_part(detay, '/', 1) as ad, count(distinct oturum_id) as n
        from simdi where olay in ('sihirbaz', 'whatsapp', 'eposta') and detay is not null and detay <> '' and detay <> 'baglanti'
        group by 1 order by 2 desc limit 10
      ) x
    )
  )
  into v_sonuc;

  return v_sonuc;
end;
$$;

revoke execute on function public.ziyaret_ozeti(text) from public, anon, authenticated;
grant execute on function public.ziyaret_ozeti(text) to service_role;
