/* global Buffer */
// /ziyaretler panelinin veri ucu. Şifre "x-sifre" başlığıyla gelir.
// Koda şifrenin kendisi değil, tuzlanmış SHA-256 özeti yazılır (repo herkese açık).
// Şifreyi değiştirmek için: yeni özeti üretip SIFRE_OZETI'ni güncelleyin
//   node -e "console.log(require('crypto').createHash('sha256').update('beysera-ziyaretler:' + 'YENI_SIFRE').digest('hex'))"
import { createHash, timingSafeEqual } from 'node:crypto';
import { supabaseAyarlari, supabaseIstek } from './_supabase.js';

const TUZ = 'beysera-ziyaretler:';
const SIFRE_OZETI = '6e42f5823697e0a9bdde12f65ea8e789ed7659b9c736c984e8be8115e7164bd3';
const DONEMLER = new Set(['gunluk', 'haftalik', 'aylik']);

const json = (govde, status = 200) =>
  new Response(JSON.stringify(govde), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export function sifreDogruMu(sifre) {
  if (typeof sifre !== 'string' || !sifre) return false;
  const gelen = createHash('sha256').update(TUZ + sifre).digest();
  const beklenen = Buffer.from(SIFRE_OZETI, 'hex');
  return gelen.length === beklenen.length && timingSafeEqual(gelen, beklenen);
}

export async function GET(request) {
  if (!sifreDogruMu(request.headers.get('x-sifre'))) {
    return json({ hata: 'sifre' }, 401);
  }

  const donem = new URL(request.url).searchParams.get('donem') || 'gunluk';
  if (!DONEMLER.has(donem)) return json({ hata: 'donem' }, 400);

  const ayar = supabaseAyarlari();
  if (!ayar) return json({ hata: 'kurulum' }, 503);

  try {
    const yanit = await supabaseIstek(ayar, 'rpc/ziyaret_ozeti', { p_donem: donem });
    if (!yanit.ok) {
      console.error('ziyaretler: supabase hatası', yanit.status, await yanit.text());
      return json({ hata: 'veritabani' }, 502);
    }
    return json(await yanit.json());
  } catch (hata) {
    console.error('ziyaretler: istek hatası', hata);
    return json({ hata: 'veritabani' }, 502);
  }
}
