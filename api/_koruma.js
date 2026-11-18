// Basit kötüye kullanım koruması (sunucu tarafı).
// Not: Vercel'de her sunucu örneğinin belleği ayrıdır; bu sınır "en iyi çaba" düzeyindedir.
// Asıl koruma güçlü şifre ve veritabanı kilitleridir; bu katman toplu denemeyi yavaşlatır.

const kovalar = new Map();

// Belirli bir anahtar (ör. IP + amaç) için zaman penceresi içindeki istek sayısını sınırlar.
export function sinirAsildiMi(anahtar, limit, pencereMs) {
  const simdi = Date.now();
  const kova = kovalar.get(anahtar);
  if (!kova || simdi - kova.bas > pencereMs) {
    kovalar.set(anahtar, { bas: simdi, sayi: 1 });
  } else {
    kova.sayi += 1;
    if (kova.sayi > limit) return true;
  }
  // Bellek şişmesin: arada bir eski kayıtları temizle.
  if (kovalar.size > 5000) {
    for (const [k, v] of kovalar) if (simdi - v.bas > pencereMs) kovalar.delete(k);
  }
  return false;
}

export function istemciIp(request) {
  const ileri = request.headers.get('x-forwarded-for') || '';
  return ileri.split(',')[0].trim() || request.headers.get('x-real-ip') || 'bilinmiyor';
}

// İstek sitenin kendisinden mi geliyor? (Origin ya da Referer aynı alan adı olmalı.)
export function ayniSitedenMi(request) {
  const host = (request.headers.get('host') || '').toLowerCase();
  if (!host) return false;
  const kaynak = request.headers.get('origin') || request.headers.get('referer');
  if (!kaynak) return false;
  try {
    return new URL(kaynak).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

export const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
