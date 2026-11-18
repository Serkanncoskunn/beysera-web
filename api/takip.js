// Ziyaret kaydı: sitedeki takip kodu her sayfa açılışında ve önemli tıklamalarda buraya POST eder.
// IP adresi saklanmaz. Ülke ve şehir, Vercel'in istek başlıklarından okunur.
import { supabaseAyarlari, supabaseIstek } from './_supabase.js';

const OLAYLAR = new Set(['sayfa', 'sihirbaz', 'whatsapp', 'telegram', 'eposta', 'gorusme']);
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly|monitor|curl|wget|python-requests/i;

// Yönlendiren siteyi okunur bir kaynağa çevirir. Sıra önemli: e-posta kuralları Google'dan önce.
const KAYNAK_KURALLARI = [
  [/(^|\.)mail\.google\.|outlook\.|mail\.yahoo\.|mail\.yandex\./, 'E-posta'],
  [/(^|\.)google\./, 'Google'],
  [/(^|\.)bing\.com$/, 'Bing'],
  [/(^|\.)yandex\./, 'Yandex'],
  [/duckduckgo\.com$/, 'DuckDuckGo'],
  [/(^|\.)(chatgpt\.com|openai\.com)$/, 'ChatGPT'],
  [/(^|\.)perplexity\.ai$/, 'Perplexity'],
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/(^|\.)(facebook\.com|fb\.me|fb\.com)$/, 'Facebook'],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'LinkedIn'],
  [/^(t\.co|twitter\.com|x\.com)$/, 'X (Twitter)'],
  [/(^|\.)whatsapp\.(com|net)$|^wa\.me$/, 'WhatsApp'],
  [/^(t\.me|web\.telegram\.org)$/, 'Telegram'],
  [/(^|\.)youtube\.com$|^youtu\.be$/, 'YouTube'],
  [/(^|\.)github\.com$/, 'GitHub'],
];

const UTM_KAYNAKLARI = {
  google: 'Google', instagram: 'Instagram', ig: 'Instagram', facebook: 'Facebook', fb: 'Facebook',
  linkedin: 'LinkedIn', twitter: 'X (Twitter)', x: 'X (Twitter)', whatsapp: 'WhatsApp',
  telegram: 'Telegram', gmail: 'E-posta', email: 'E-posta', mail: 'E-posta', newsletter: 'E-posta',
};

const kirp = (deger, uzunluk) => {
  if (typeof deger !== 'string') return null;
  const temiz = deger.trim().slice(0, uzunluk);
  return temiz || null;
};

function alanAdi(adres) {
  try {
    return new URL(adres).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
}

export function kaynakBul(referans, utmSource, siteAlanAdi) {
  if (utmSource) {
    return UTM_KAYNAKLARI[utmSource.toLowerCase()] || utmSource.slice(0, 80);
  }
  const alan = alanAdi(referans);
  if (!alan) return 'Doğrudan';
  // Sitenin kendi sayfaları arasındaki geçiş dış kaynak sayılmaz.
  if (siteAlanAdi && (alan === siteAlanAdi || alan.endsWith(`.${siteAlanAdi}`))) return 'Doğrudan';
  for (const [kural, ad] of KAYNAK_KURALLARI) {
    if (kural.test(alan)) return ad;
  }
  return alan.slice(0, 80);
}

export function cihazBul(ua = '') {
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return 'tablet';
  if (/Mobi|iPhone|Android/i.test(ua)) return 'mobil';
  return 'masaustu';
}

function baslikCoz(deger) {
  if (!deger) return null;
  try {
    return decodeURIComponent(deger);
  } catch {
    return deger;
  }
}

export async function POST(request) {
  const bos = new Response(null, { status: 204 });
  const ua = request.headers.get('user-agent') || '';
  if (BOT.test(ua)) return bos;

  let veri;
  try {
    const metin = await request.text();
    if (metin.length > 4000) return bos;
    veri = JSON.parse(metin);
  } catch {
    return new Response(null, { status: 400 });
  }

  const olay = OLAYLAR.has(veri?.olay) ? veri.olay : null;
  const ziyaretciId = kirp(veri?.ziyaretci_id, 64);
  const oturumId = kirp(veri?.oturum_id, 64);
  if (!olay || !ziyaretciId || ziyaretciId.length < 8 || !oturumId || oturumId.length < 8) {
    return new Response(null, { status: 400 });
  }

  const ayar = supabaseAyarlari();
  if (!ayar) return bos; // Kurulum tamamlanmadıysa sessizce geç; site etkilenmez.

  const siteAlanAdi = alanAdi(`https://${request.headers.get('host') || ''}`);
  const utm = veri.utm || {};
  const kayit = {
    ziyaretci_id: ziyaretciId,
    oturum_id: oturumId,
    olay,
    detay: kirp(veri.detay, 120),
    yol: kirp(veri.yol, 200),
    kaynak: kaynakBul(veri.referans, kirp(utm.source, 80), siteAlanAdi),
    referans_alan: kirp(alanAdi(veri.referans) || '', 120),
    utm_source: kirp(utm.source, 80),
    utm_medium: kirp(utm.medium, 80),
    utm_campaign: kirp(utm.campaign, 80),
    ulke: kirp(request.headers.get('x-vercel-ip-country'), 8),
    sehir: kirp(baslikCoz(request.headers.get('x-vercel-ip-city')), 80),
    cihaz: cihazBul(ua),
    dil: kirp(veri.dil, 8),
  };

  try {
    const yanit = await supabaseIstek(ayar, 'ziyaretler', kayit);
    if (!yanit.ok) console.error('takip: supabase hatası', yanit.status, await yanit.text());
  } catch (hata) {
    console.error('takip: istek hatası', hata);
  }
  return bos;
}
