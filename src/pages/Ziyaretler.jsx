import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, LogOut, Minus, RefreshCw, Zap } from 'lucide-react';
import tr from '../i18n/tr';
import { TAKIP_KAPALI_ANAHTARI } from '../lib/takip';

// Şifreli ziyaret analizi paneli (/ziyaretler). Yalnızca Türkçe; arama motorlarına kapalı.
const SIFRE_ANAHTARI = 'beysera-ziyaret-sifre';

const DONEMLER = [
  { id: 'gunluk', ad: 'Günlük', aciklama: 'Son 30 gün' },
  { id: 'haftalik', ad: 'Haftalık', aciklama: 'Son 12 hafta' },
  { id: 'aylik', ad: 'Aylık', aciklama: 'Son 12 ay' },
];

const OLAY_ADLARI = {
  sihirbaz: 'Danışmanlık sihirbazını açtı',
  whatsapp: 'WhatsApp’a yönlendi',
  telegram: 'Telegram’a tıkladı',
  eposta: 'E-posta gönderdi',
  gorusme: 'Görüşme planlamaya tıkladı',
};
const CIHAZ_ADLARI = { mobil: 'Mobil', tablet: 'Tablet', masaustu: 'Masaüstü' };
const DIL_ADLARI = { tr: 'Türkçe', en: 'İngilizce' };

const sayi = new Intl.NumberFormat('tr-TR');
let ulkeAdlari = null;
try {
  ulkeAdlari = new Intl.DisplayNames(['tr'], { type: 'region' });
} catch {
  ulkeAdlari = null;
}
const ulkeAdi = (kod) => {
  if (!kod || kod === '?') return 'Bilinmiyor';
  try {
    return ulkeAdlari?.of(kod) || kod;
  } catch {
    return kod;
  }
};

function oku(depo, anahtar) {
  try {
    return depo.getItem(anahtar) || '';
  } catch {
    return '';
  }
}
function yaz(depo, anahtar, deger) {
  try {
    if (deger === null) depo.removeItem(anahtar);
    else depo.setItem(anahtar, deger);
  } catch {
    // Depolama kapalıysa sorun değil.
  }
}

function tarihEtiketi(iso, donem, uzun = false) {
  const [y, a, g] = iso.split('-').map(Number);
  const d = new Date(Date.UTC(y, a - 1, g));
  const ay = d.toLocaleDateString('tr-TR', { month: uzun ? 'long' : 'short', timeZone: 'UTC' });
  if (donem === 'aylik') return uzun ? `${ay} ${y}` : `${ay} ${String(y).slice(2)}`;
  if (donem === 'haftalik' && uzun) return `${g} ${ay} haftası`;
  return `${g} ${ay}`;
}

function degisim(simdi, once) {
  if (!once) return simdi ? { yon: 'yukari', metin: 'yeni' } : { yon: 'sabit', metin: '0' };
  const oran = ((simdi - once) / once) * 100;
  if (Math.abs(oran) < 0.5) return { yon: 'sabit', metin: '%0' };
  return { yon: oran > 0 ? 'yukari' : 'asagi', metin: `%${Math.abs(oran).toFixed(0)}` };
}

// ---------- Giriş ----------
function Giris({ onGiris, hata, yukleniyor }) {
  const [sifre, setSifre] = useState('');
  return (
    <main className="flex min-h-svh items-center justify-center px-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (sifre) onGiris(sifre);
        }}
        className="w-full max-w-sm rounded-card border border-line bg-surface p-8"
      >
        <div className="mb-8 flex items-center gap-2 text-lg font-medium">
          <Zap className="h-5 w-5 fill-accent text-accent" aria-hidden="true" /> beysera
        </div>
        <h1 className="font-display text-4xl font-semibold leading-none tracking-[-0.04em]">Ziyaretler</h1>
        <p className="mt-2 text-sm text-fg-muted">Devam etmek için panel şifresini girin.</p>
        <label htmlFor="sifre" className="mt-8 block text-sm text-fg-muted">Şifre</label>
        <input
          id="sifre"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
          aria-invalid={Boolean(hata)}
          aria-describedby={hata ? 'sifre-hata' : undefined}
          className="mt-2 w-full rounded-control border border-line-strong bg-page px-4 py-3 text-fg outline-none transition-colors focus:border-accent"
        />
        {hata && (
          <p id="sifre-hata" role="alert" className="mt-3 text-sm text-fg">
            {hata}
          </p>
        )}
        <button
          type="submit"
          disabled={yukleniyor || !sifre}
          className="mt-6 w-full rounded-control bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {yukleniyor ? 'Kontrol ediliyor…' : 'Giriş yap'}
        </button>
      </form>
    </main>
  );
}

// ---------- Göstergeler ----------
function Gosterge({ baslik, deger, onceki, alt }) {
  const d = degisim(deger, onceki);
  const Ikon = d.yon === 'yukari' ? ArrowUpRight : d.yon === 'asagi' ? ArrowDownRight : Minus;
  const yonMetni = d.yon === 'yukari' ? 'artış' : d.yon === 'asagi' ? 'düşüş' : 'değişim yok';
  return (
    <div className="rounded-card border border-line bg-surface p-5 md:p-6">
      <p className="text-sm text-fg-muted">{baslik}</p>
      <p className="mt-2 font-display text-5xl font-semibold leading-none tracking-[-0.03em] tabular-nums text-fg">{sayi.format(deger)}</p>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-fg-subtle">
        <Ikon className={`h-3.5 w-3.5 ${d.yon === 'yukari' ? 'text-accent' : 'text-fg-muted'}`} aria-hidden="true" />
        <span className="text-fg-muted">{d.metin}</span>
        <span className="sr-only">{yonMetni}</span>
        <span>önceki döneme göre</span>
      </p>
      {alt && <p className="mt-1 text-xs text-fg-subtle">{alt}</p>}
    </div>
  );
}

// ---------- Zaman grafiği (tek seri çubuk) ----------
function ZamanGrafigi({ seri, donem }) {
  const [odak, setOdak] = useState(null);
  const G = 720;
  const Y = 240;
  const sol = 36;
  const alt = 28;
  const ust = 12;
  const enBuyuk = Math.max(1, ...seri.map((s) => s.ziyaret));
  // Okunur ızgara: 0, yarı, tam (yuvarlatılmış)
  const adim = Math.max(1, Math.ceil(enBuyuk / 2));
  const tavan = adim * 2;
  const genislik = (G - sol) / seri.length;
  const bosluk = 2;
  const cubuk = Math.max(2, genislik - bosluk);
  const yuks = (v) => ((Y - alt - ust) * v) / tavan;
  const etiketAraligi = Math.ceil(seri.length / 6);
  const toplam = seri.reduce((a, s) => a + s.ziyaret, 0);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${G} ${Y}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Dönem boyunca ziyaret sayısı, toplam ${sayi.format(toplam)}`}
        onMouseLeave={() => setOdak(null)}
      >
        {[0, adim, tavan].map((v) => (
          <g key={v}>
            <line x1={sol} x2={G} y1={Y - alt - yuks(v)} y2={Y - alt - yuks(v)} className="stroke-line" strokeWidth="1" />
            <text x={sol - 8} y={Y - alt - yuks(v)} dy="0.32em" textAnchor="end" className="fill-fg-subtle text-xs tabular-nums">
              {sayi.format(v)}
            </text>
          </g>
        ))}
        {seri.map((s, i) => {
          const x = sol + i * genislik + bosluk / 2;
          const h = yuks(s.ziyaret);
          const r = Math.min(4, cubuk / 2, h);
          const y0 = Y - alt;
          const secili = odak === i;
          return (
            <g key={s.t}>
              {h > 0 && (
                <path
                  d={`M${x},${y0} V${y0 - h + r} Q${x},${y0 - h} ${x + r},${y0 - h} H${x + cubuk - r} Q${x + cubuk},${y0 - h} ${x + cubuk},${y0 - h + r} V${y0} Z`}
                  className={secili ? 'fill-accent-strong' : 'fill-accent'}
                />
              )}
              {i % etiketAraligi === 0 && (
                <text x={x + cubuk / 2} y={Y - 8} textAnchor="middle" className="fill-fg-subtle text-xs">
                  {tarihEtiketi(s.t, donem)}
                </text>
              )}
              {/* Geniş, görünmez dokunma alanı */}
              <rect
                x={sol + i * genislik}
                y={ust}
                width={genislik}
                height={Y - alt - ust}
                fill="transparent"
                onMouseEnter={() => setOdak(i)}
                onFocus={() => setOdak(i)}
                onBlur={() => setOdak(null)}
                tabIndex={0}
                aria-label={`${tarihEtiketi(s.t, donem, true)}: ${s.ziyaret} ziyaret, ${s.tekil} tekil ziyaretçi`}
              />
            </g>
          );
        })}
      </svg>
      {odak !== null && seri[odak] && (
        <div
          className="pointer-events-none absolute top-0 rounded-control border border-line bg-surface-raised px-3 py-2 text-xs shadow-lg"
          style={{ left: `${Math.min(80, Math.max(0, ((sol + (odak + 0.5) * genislik) / G) * 100 - 8))}%` }}
        >
          <p className="font-medium text-fg">{tarihEtiketi(seri[odak].t, donem, true)}</p>
          <p className="mt-1 text-fg-muted">
            <span className="tabular-nums text-fg">{seri[odak].ziyaret}</span> ziyaret ·{' '}
            <span className="tabular-nums text-fg">{seri[odak].tekil}</span> tekil
          </p>
        </div>
      )}
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-fg-muted hover:text-fg">Tablo olarak göster</summary>
        <div className="mt-3 max-h-64 overflow-auto rounded-control border border-line">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-surface-raised text-fg-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Dönem</th>
                <th className="px-3 py-2 text-right font-medium">Ziyaret</th>
                <th className="px-3 py-2 text-right font-medium">Tekil</th>
              </tr>
            </thead>
            <tbody>
              {[...seri].reverse().map((s) => (
                <tr key={s.t} className="border-t border-line">
                  <td className="px-3 py-2 text-fg">{tarihEtiketi(s.t, donem, true)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-fg">{s.ziyaret}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-fg-muted">{s.tekil}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

// ---------- Kırılım listesi (yatay çubuk) ----------
function Kirilim({ baslik, aciklama, satirlar, adCevir = (x) => x, bosMetin = 'Bu dönemde veri yok.', className = '' }) {
  const enBuyuk = Math.max(1, ...satirlar.map((s) => s.ziyaret));
  const toplam = satirlar.reduce((a, s) => a + s.ziyaret, 0);
  return (
    <section className={`rounded-card border border-line bg-surface p-5 md:p-6 ${className}`}>
      <h2 className="text-lg font-medium text-fg">{baslik}</h2>
      {aciklama && <p className="mt-1 text-sm text-fg-subtle">{aciklama}</p>}
      {satirlar.length === 0 ? (
        <p className="mt-6 text-sm text-fg-muted">{bosMetin}</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {satirlar.map((s) => {
            const pay = toplam ? Math.round((s.ziyaret / toplam) * 100) : 0;
            return (
              <li key={s.ad} title={`${adCevir(s.ad)}: ${s.ziyaret} (%${pay})`}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate text-fg">{adCevir(s.ad)}</span>
                  <span className="shrink-0 tabular-nums text-fg-muted">
                    {sayi.format(s.ziyaret)} <span className="text-fg-subtle">· %{pay}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-surface-raised" aria-hidden="true">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(2, (s.ziyaret / enBuyuk) * 100)}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// ---------- Panel ----------
export default function Ziyaretler() {
  const [sifre, setSifre] = useState(() => oku(window.sessionStorage, SIFRE_ANAHTARI));
  const [donem, setDonem] = useState('gunluk');
  const [veri, setVeri] = useState(null);
  const [durum, setDurum] = useState(sifre ? 'yukleniyor' : 'giris');
  const [hata, setHata] = useState('');

  useEffect(() => {
    document.title = 'Ziyaretler | Beysera';
    document.documentElement.lang = 'tr';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  // Hızlı dönem değişiminde geç gelen eski yanıt yenisinin üzerine yazmasın.
  const sonIstek = useRef(0);

  const yukle = useCallback(async (sifreDegeri, donemDegeri) => {
    const istekNo = ++sonIstek.current;
    setDurum('yukleniyor');
    setHata('');
    try {
      const yanit = await fetch(`/api/ziyaretler?donem=${donemDegeri}`, {
        headers: { 'x-sifre': sifreDegeri },
        cache: 'no-store',
      });
      if (istekNo !== sonIstek.current) return;
      if (yanit.status === 401 || yanit.status === 429) {
        yaz(window.sessionStorage, SIFRE_ANAHTARI, null);
        setSifre('');
        setHata(yanit.status === 429 ? 'Çok fazla yanlış deneme. 15 dakika sonra tekrar deneyin.' : 'Şifre yanlış.');
        setDurum('giris');
        return;
      }
      const govde = await yanit.json().catch(() => ({}));
      if (istekNo !== sonIstek.current) return;
      if (yanit.status === 503 && govde.hata === 'kurulum') {
        setDurum('kurulum');
        return;
      }
      if (!yanit.ok) throw new Error(govde.hata || `HTTP ${yanit.status}`);
      yaz(window.sessionStorage, SIFRE_ANAHTARI, sifreDegeri);
      // Bu tarayıcıdaki kendi ziyaretlerinizi sayma.
      yaz(window.localStorage, TAKIP_KAPALI_ANAHTARI, '1');
      setSifre(sifreDegeri);
      setVeri(govde);
      setDurum('hazir');
    } catch {
      if (istekNo !== sonIstek.current) return;
      setHata('Veriler alınamadı. Biraz sonra tekrar deneyin.');
      setDurum((d) => (d === 'giris' ? 'giris' : 'hata'));
    }
  }, []);

  useEffect(() => {
    if (sifre) yukle(sifre, donem);
    // Yalnızca dönem değişince yeniden yükle; şifre girişte ayrıca yüklenir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donem]);

  const cikis = () => {
    yaz(window.sessionStorage, SIFRE_ANAHTARI, null);
    setSifre('');
    setVeri(null);
    setDurum('giris');
  };

  const hizmetAdi = useMemo(() => (id) => tr.services.items[id]?.title || id, []);

  if (durum === 'giris' || (!sifre && !veri)) {
    return <Giris onGiris={(s) => yukle(s, donem)} hata={hata} yukleniyor={durum === 'yukleniyor'} />;
  }

  // Etiketler ekrandaki verinin kendi döneminden gelir; yeni veri yüklenirken tutarsızlık olmaz.
  const gosterilenDonem = veri?.donem || donem;
  const secili = DONEMLER.find((d) => d.id === gosterilenDonem);
  const t = veri?.toplam;
  const o = veri?.onceki;

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-10 border-b border-line bg-page/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2 font-medium text-fg">
              <Zap className="h-5 w-5 fill-accent text-accent" aria-hidden="true" /> beysera
            </a>
            <span className="text-fg-subtle">/</span>
            <span className="text-fg-muted">ziyaretler</span>
          </div>
          <div className="flex items-center gap-2">
            <div role="group" aria-label="Dönem" className="flex rounded-full border border-line p-1">
              {DONEMLER.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={donem === d.id}
                  onClick={() => setDonem(d.id)}
                  className={`rounded-full px-3 py-1.5 text-sm transition-colors ${donem === d.id ? 'bg-fg text-page' : 'text-fg-muted hover:text-fg'}`}
                >
                  {d.ad}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => yukle(sifre, donem)} aria-label="Yenile" className="rounded-full border border-line p-2 text-fg-muted hover:text-fg">
              <RefreshCw className={`h-4 w-4 ${durum === 'yukleniyor' ? 'animate-spin' : ''}`} />
            </button>
            <button type="button" onClick={cikis} aria-label="Çıkış" className="rounded-full border border-line p-2 text-fg-muted hover:text-fg">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8">
          <h1 className="font-display text-5xl font-semibold leading-none tracking-[-0.04em] md:text-6xl">Ziyaretler</h1>
          <p className="mt-2 text-fg-muted">
            {secili.aciklama}
            {veri && <> · {tarihEtiketi(veri.baslangic, 'gunluk', true)} itibarıyla · İstanbul saati</>}
          </p>
        </div>

        {durum === 'kurulum' && (
          <div role="status" className="rounded-card border border-line-strong bg-surface p-6">
            <h2 className="text-lg font-medium">Kurulum tamamlanmadı</h2>
            <p className="mt-2 max-w-[65ch] text-fg-muted">
              Şifre doğru, ancak veritabanı bağlantısı bulunamadı. Vercel projesine <code className="text-fg">SUPABASE_URL</code> ve{' '}
              <code className="text-fg">SUPABASE_SERVICE_ROLE_KEY</code> ortam değişkenlerini ekleyip siteyi yeniden yayınlayın.
            </p>
          </div>
        )}

        {durum === 'hata' && (
          <div role="alert" className="rounded-card border border-line-strong bg-surface p-6 text-fg-muted">
            {hata}
          </div>
        )}

        {veri && durum !== 'kurulum' && (
          <div className={durum === 'yukleniyor' ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Gosterge baslik="Ziyaret" deger={t.ziyaret} onceki={o.ziyaret} />
              <Gosterge baslik="Tekil ziyaretçi" deger={t.tekil} onceki={o.tekil} />
              <Gosterge baslik="Sayfa görüntüleme" deger={t.sayfa} onceki={o.sayfa} />
              <Gosterge
                baslik="Dönüşüm"
                deger={t.donusum}
                onceki={o.donusum}
                alt={t.ziyaret ? `Ziyaretlerin %${((t.donusum / t.ziyaret) * 100).toFixed(1)}’i iletişime geçmeye çalıştı` : null}
              />
            </div>

            <section className="mt-3 rounded-card border border-line bg-surface p-5 md:p-6">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-medium">Ziyaretler ({secili.ad.toLowerCase()})</h2>
                <p className="text-sm text-fg-subtle">Çubuğun üzerine gelince ayrıntı görünür</p>
              </div>
              {t.ziyaret === 0 ? (
                <p className="py-10 text-center text-fg-muted">Bu dönemde henüz ziyaret yok.</p>
              ) : (
                <ZamanGrafigi seri={veri.seri} donem={gosterilenDonem} />
              )}
            </section>

            <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <Kirilim
                className="lg:row-span-2"
                baslik="Nereden geldiler"
                aciklama="Yönlendiren site ya da bağlantıdaki utm_source etiketi"
                satirlar={veri.kaynaklar}
              />
              <Kirilim baslik="Şehirler" satirlar={veri.sehirler} adCevir={(ad) => {
                const [sehir, ulke] = ad.split(', ');
                return ulke ? `${sehir}, ${ulkeAdi(ulke)}` : ad;
              }} />
              <Kirilim baslik="Ülkeler" satirlar={veri.ulkeler} adCevir={ulkeAdi} />
              <Kirilim baslik="Cihaz" satirlar={veri.cihazlar} adCevir={(x) => CIHAZ_ADLARI[x] || x} />
              <Kirilim baslik="Site dili" satirlar={veri.diller} adCevir={(x) => DIL_ADLARI[x] || x} />
              <Kirilim
                baslik="İlgilenilen hizmetler"
                aciklama="Sihirbazda seçilen hizmet"
                satirlar={veri.hizmetler}
                adCevir={hizmetAdi}
              />
              <Kirilim
                baslik="Etkileşimler"
                aciklama="Toplam tıklama sayısı"
                satirlar={veri.etkilesimler}
                adCevir={(x) => OLAY_ADLARI[x] || x}
              />
              <Kirilim
                baslik="Kampanyalar"
                aciklama="utm_source / utm_campaign etiketli bağlantılar"
                satirlar={veri.kampanyalar}
                bosMetin="Etiketli bağlantıdan gelen yok. Aşağıdaki örneği kullanın."
              />
            </div>

            <section className="mt-3 rounded-card border border-line bg-surface p-5 md:p-6">
              <h2 className="text-lg font-medium">Kampanya bağlantısı nasıl hazırlanır</h2>
              <p className="mt-2 max-w-[70ch] text-sm text-fg-muted">
                Müşterilere gönderdiğiniz bağlantının sonuna etiket ekleyin; kim nereden geldi burada ayrı görünür.
              </p>
              <code className="mt-3 block overflow-x-auto rounded-control bg-page px-4 py-3 text-sm text-accent">
                {`${window.location.origin}/?utm_source=gmail&utm_campaign=istanbul-kuafor-kasim`}
              </code>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
