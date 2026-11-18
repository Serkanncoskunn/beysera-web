// Anonim ziyaret takibi. Kişisel veri göndermez: ziyaretçi kimliği tarayıcıda üretilen rastgele bir
// değerdir. Hata olursa sessizce geçer; sitenin çalışmasını asla etkilemez.
// Kendi ziyaretlerinizi saymamak için /ziyaretler sayfasına bir kez giriş yapmanız yeterli
// (o tarayıcıda takip kapanır).

const ZIYARETCI_ANAHTARI = 'beysera-ziyaretci';
const OTURUM_ANAHTARI = 'beysera-oturum';
export const TAKIP_KAPALI_ANAHTARI = 'beysera-takip-kapali';

function rastgeleKimlik() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

function kimlikAl(depo, anahtar) {
  try {
    let deger = depo.getItem(anahtar);
    if (!deger) {
      deger = rastgeleKimlik();
      depo.setItem(anahtar, deger);
    }
    return deger;
  } catch {
    return rastgeleKimlik();
  }
}

function takipKapaliMi() {
  if (import.meta.env.DEV) return true; // Yerel geliştirmede kayıt tutma.
  if (typeof window === 'undefined') return true;
  if (navigator.webdriver) return true;
  if (window.location.pathname.startsWith('/ziyaretler')) return true;
  try {
    return window.localStorage.getItem(TAKIP_KAPALI_ANAHTARI) === '1';
  } catch {
    return false;
  }
}

export function takip(olay, { detay, dil } = {}) {
  try {
    if (takipKapaliMi()) return;
    const parametreler = new URLSearchParams(window.location.search);
    const veri = {
      olay,
      detay: detay || undefined,
      dil,
      yol: window.location.pathname,
      referans: document.referrer || '',
      utm: {
        source: parametreler.get('utm_source') || undefined,
        medium: parametreler.get('utm_medium') || undefined,
        campaign: parametreler.get('utm_campaign') || undefined,
      },
      ziyaretci_id: kimlikAl(window.localStorage, ZIYARETCI_ANAHTARI),
      oturum_id: kimlikAl(window.sessionStorage, OTURUM_ANAHTARI),
    };
    const govde = JSON.stringify(veri);
    const blob = new Blob([govde], { type: 'application/json' });
    if (!(navigator.sendBeacon && navigator.sendBeacon('/api/takip', blob))) {
      fetch('/api/takip', { method: 'POST', body: govde, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
    }
  } catch {
    // Takip hiçbir zaman siteyi bozmamalı.
  }
}
