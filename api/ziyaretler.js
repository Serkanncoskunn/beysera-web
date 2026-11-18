/* global Buffer, process */
// /ziyaretler panelinin veri ucu. Şifre "x-sifre" başlığıyla gelir.
// Koda şifrenin kendisi değil, tuzlanmış SHA-256 özeti yazılır.
// Daha güvenlisi: özeti Vercel'de ZIYARET_SIFRE_OZETI ortam değişkenine koyun; tanımlıysa
// koddaki değer yerine o kullanılır (böylece herkese açık repoda hiçbir iz kalmaz).
// Yeni özet üretmek için:
//   node -e "console.log(require('crypto').createHash('sha256').update('beysera-ziyaretler:' + 'YENI_SIFRE').digest('hex'))"
import { createHash, timingSafeEqual } from 'node:crypto';
import { supabaseAyarlari, supabaseIstek } from './_supabase.js';
import { bekle, istemciIp, sinirAsildiMi } from './_koruma.js';

const TUZ = 'beysera-ziyaretler:';
const VARSAYILAN_OZET = '6e42f5823697e0a9bdde12f65ea8e789ed7659b9c736c984e8be8115e7164bd3';
const DONEMLER = new Set(['gunluk', 'haftalik', 'aylik']);

// Şifre deneme sınırı: bir IP'den 15 dakikada en fazla 10 yanlış deneme.
const DENEME_LIMITI = 10;
const DENEME_PENCERESI = 15 * 60 * 1000;

const json = (govde, status = 200) =>
  new Response(JSON.stringify(govde), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

function beklenenOzet() {
  const ortam = (process.env.ZIYARET_SIFRE_OZETI || '').trim().toLowerCase();
  return /^[0-9a-f]{64}$/.test(ortam) ? ortam : VARSAYILAN_OZET;
}

export function sifreDogruMu(sifre) {
  if (typeof sifre !== 'string' || !sifre || sifre.length > 200) return false;
  const gelen = createHash('sha256').update(TUZ + sifre).digest();
  const beklenen = Buffer.from(beklenenOzet(), 'hex');
  return gelen.length === beklenen.length && timingSafeEqual(gelen, beklenen);
}

export async function GET(request) {
  const ip = istemciIp(request);
  const kilitAnahtari = `sifre:${ip}`;

  if (!sifreDogruMu(request.headers.get('x-sifre'))) {
    // Her yanlış denemede biraz beklet; sınır aşılınca bir süre tamamen kilitle.
    await bekle(600);
    if (sinirAsildiMi(kilitAnahtari, DENEME_LIMITI, DENEME_PENCERESI)) {
      return json({ hata: 'cok_deneme' }, 429);
    }
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
