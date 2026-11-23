import { useState, useEffect, useRef, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import {
  Globe,
  Cpu,
  Database,
  Palette,
  BotMessageSquare,
  Gauge,
  Menu,
  X,
  ArrowRight,
  Workflow,
  Sparkles,
  MessageCircle,
  ChevronRight,
  ArrowLeft,
  ChartColumn,
  Mail,
  CalendarDays,
  LayoutGrid,
  Server,
  Plus
} from 'lucide-react';

import { useLanguage, LANGUAGES } from './i18n/context';
import { CONTACT } from './config';
import HeroFlow from './components/HeroFlow';
import Starfield from './components/Starfield';
import Planets from './components/Planets';
import { takip } from './lib/takip';

// Ortak buton stilleri: tek kaynaktan gelir, her bölüm aynı durumları (hover/focus/press) kullanır.
const btnBase = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-5 py-3 text-sm font-semibold transition-colors duration-200 ease-out-soft active:translate-y-px';
const btnPrimary = `${btnBase} bg-accent text-accent-ink hover:bg-accent-strong`;
const btnSecondary = `${btnBase} border border-line-strong text-fg hover:border-fg hover:bg-surface`;
// Koyu band üzerindeki butonlar
const btnOnBand = `${btnBase} bg-band-accent text-band hover:bg-on-band`;
const btnGhostOnBand = `${btnBase} border border-band-line text-on-band hover:border-on-band-muted hover:bg-band-raised`;

const WhatsAppIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

// Marka işareti: üst üste binen iki kare, "iki katman tek sistem" fikri. Renkler token'dan gelir.
const Wordmark = ({ onBand = false }) => (
  <span className={`flex items-center gap-2.5 text-lg font-semibold tracking-[-0.03em] ${onBand ? 'text-on-band' : 'text-fg'}`}>
    <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
      <rect x="1" y="1" width="12" height="12" rx="2.5" className={onBand ? 'fill-band-accent' : 'fill-accent'} />
      <rect x="7" y="7" width="12" height="12" rx="2.5" fill="none" strokeWidth="2" className={onBand ? 'stroke-on-band' : 'stroke-fg'} />
    </svg>
    beysera
  </span>
);

const LanguageSwitch = ({ lang, setLang, label, onBand = false }) => (
  <div role="group" aria-label={label} className={`flex items-center rounded-full border p-0.5 transition-colors ${onBand ? 'border-band-line bg-band-raised' : 'border-line bg-surface'}`}>
    {LANGUAGES.map((code) => (
      <button
        key={code}
        type="button"
        onClick={() => setLang(code)}
        aria-pressed={lang === code}
        className={`min-h-8 min-w-9 rounded-full px-2.5 text-xs font-semibold uppercase transition-colors duration-200 ${
          lang === code
            ? onBand ? 'bg-on-band text-band' : 'bg-fg text-page'
            : onBand ? 'text-on-band-muted hover:text-on-band' : 'text-fg-subtle hover:text-fg'
        }`}
      >
        {code}
      </button>
    ))}
  </div>
);

const App = () => {
  const { lang, t, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dialogRef = useRef(null);

  // Danışmanlık Sihirbazı State Yönetimi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    purpose: '',
    detail: ''
  });

  const { whatsappNumber, email, calendlyUrl } = CONTACT;

  // Hizmetler: hem "Hizmetler" bölümü hem danışmanlık sihirbazı bu listeyi kullanır.
  // Metinler i18n dosyalarında services.items[id] ve wizard.details[id] altında.
  const services = [
    { id: 'website', icon: <Globe className="h-5 w-5" /> },
    { id: 'design', icon: <Palette className="h-5 w-5" /> },
    { id: 'chatbot', icon: <BotMessageSquare className="h-5 w-5" /> },
    { id: 'assistant', icon: <Sparkles className="h-5 w-5" /> },
    { id: 'booking', icon: <CalendarDays className="h-5 w-5" /> },
    { id: 'data', icon: <ChartColumn className="h-5 w-5" /> },
    { id: 'automation', icon: <Workflow className="h-5 w-5" /> },
    { id: 'optimization', icon: <Gauge className="h-5 w-5" /> }
  ].map((s) => ({ ...s, ...t.services.items[s.id] }));
  const purposes = services.map(({ id, title, icon }) => ({ id, label: title, icon }));

  // purpose kimlik (website, chatbot…) olarak tutuluyor; dil değişse de detay listesi bozulmuyor.
  const handlePurposeSelect = (purposeId) => {
    setSelection({ ...selection, purpose: purposeId });
    setStep(2);
  };

  // Genel "konuşalım" butonları: sihirbazı ilk adımdan aç.
  const openWizard = () => {
    setIsModalOpen(true);
    takip('sihirbaz', { dil: lang });
  };

  // Hizmet satırından: sihirbazı o hizmet seçili olarak ikinci adımda aç.
  const openService = (serviceId) => {
    setSelection({ purpose: serviceId, detail: '' });
    setStep(2);
    setIsModalOpen(true);
    takip('sihirbaz', { detay: serviceId, dil: lang });
  };

  // Dış bağlantı tıklamaları (WhatsApp, Calendly, e-posta)
  const linkTakip = (olay) => () => takip(olay, { detay: 'baglanti', dil: lang });

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setSelection({ purpose: '', detail: '' });
    }, 300);
  }, []);

  // İhtiyaç seçilince son adıma geç: ziyaretçi WhatsApp ya da Gmail'i kendisi seçer.
  const handleDetailSelect = (detail) => {
    setSelection({ ...selection, detail });
    setStep(3);
  };

  // Seçilen hizmet ve ihtiyaçtan hazır mesaj metni ve bağlantılar.
  const m = t.wizard.message;
  const secilenHizmet = t.services.items[selection.purpose]?.title || '';
  const mesajKonusu = `${m.subject}: ${secilenHizmet}`;
  const mesajMetni = `${m.greeting}\n\n${m.service}: ${secilenHizmet}\n${m.detail}: ${selection.detail}`;
  const whatsappLinki = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `${m.greeting}\n\n*${m.service}:* ${secilenHizmet}\n*${m.detail}:* ${selection.detail}`
  )}`;
  const gmailLinki = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(mesajKonusu)}&body=${encodeURIComponent(mesajMetni)}`;
  const epostaLinki = `mailto:${email}?subject=${encodeURIComponent(mesajKonusu)}&body=${encodeURIComponent(mesajMetni)}`;

  // Kanal seçildiğinde: kaydı tut, bağlantı yeni sekmede açılırken pencereyi kapat.
  const kanalSecildi = (olay) => {
    takip(olay, { detay: `${selection.purpose}/${selection.detail}`, dil: lang });
    closeModal();
  };

  // Sayfa açılışını bir kez kaydet (ilk açıldığı dildeki hâliyle).
  const sayfaKaydedildi = useRef(false);
  useEffect(() => {
    if (sayfaKaydedildi.current) return;
    sayfaKaydedildi.current = true;
    takip('sayfa', { dil: lang });
  }, [lang]);

  useEffect(() => {
    const handleScrollEvent = () => {
      setScrolled(window.scrollY > 8);
    };
    handleScrollEvent();
    window.addEventListener('scroll', handleScrollEvent, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, []);

  // Modal açıkken: odak diyaloğa taşınır, Esc ile kapanır.
  useEffect(() => {
    if (!isModalOpen) return undefined;
    dialogRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen, closeModal]);

  const skillGroups = [
    { items: ['Power BI', 'SQL Server', 'Excel'], icon: <ChartColumn className="h-5 w-5" /> },
    { items: ['Python', 'Playwright', 'Docker'], icon: <Database className="h-5 w-5" /> },
    { items: ['SDXL', 'ComfyUI', 'LLMs'], icon: <Cpu className="h-5 w-5" /> },
    { items: ['n8n', 'FastAPI', 'Redis'], icon: <Workflow className="h-5 w-5" /> },
    { items: ['React', 'Next.js', '3D / GLB'], icon: <LayoutGrid className="h-5 w-5" /> },
    { items: ['Supabase', 'Vercel', 'WordPress'], icon: <Server className="h-5 w-5" /> }
  ];

  const navLinks = [
    { href: '#hizmetler', label: t.nav.projects },
    { href: '#surec', label: t.nav.process },
    { href: '#araclar', label: t.nav.tech },
    { href: '#sss', label: t.nav.faq }
  ];

  // Sayfa en üstteyken menü koyu evren kapağının üzerinde durur; açık renk yazı kullanılır.
  const navOnDark = !scrolled && !isMenuOpen;

  const sectionTitle ='text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em]';

  return (
    <div className="min-h-screen overflow-x-hidden bg-page font-sans text-fg">
      <Analytics />

      {/* Danışmanlık Sihirbazı Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-band/50 backdrop-blur-[2px]" onClick={closeModal} aria-hidden="true"></div>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wizard-title"
            tabIndex={-1}
            className="relative max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-card border border-line bg-surface shadow-[0_32px_64px_-24px_color-mix(in_oklab,var(--color-band)_45%,transparent)] outline-none"
          >
            <div className="p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                {step > 1 && (
                  <button onClick={() => setStep(step - 1)} aria-label={t.wizard.back} className="grid h-10 w-10 place-items-center rounded-full text-fg-subtle transition-colors hover:bg-surface-raised hover:text-fg">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <h3 id="wizard-title" className="flex-grow text-xl font-semibold tracking-[-0.02em]">
                  {step === 1 ? t.wizard.step1 : step === 2 ? t.wizard.step2 : t.wizard.step3}
                </h3>
                <button onClick={closeModal} aria-label={t.wizard.close} className="grid h-10 w-10 place-items-center rounded-full text-fg-subtle transition-colors hover:bg-surface-raised hover:text-fg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Adım göstergesi */}
              <div className="mb-6 grid grid-cols-3 gap-1.5" aria-hidden="true">
                {[1, 2, 3].map((n) => (
                  <span key={n} className={`h-1 rounded-full ${n <= step ? 'bg-accent' : 'bg-surface-raised'}`}></span>
                ))}
              </div>

              {step === 1 ? (
                <div className="grid grid-cols-1 gap-2">
                  {purposes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handlePurposeSelect(p.id)}
                      className="group flex items-center justify-between rounded-control border border-line p-3.5 text-left transition-colors hover:border-accent hover:bg-page"
                    >
                      <span className="flex items-center gap-3.5">
                        <span className="rounded-control bg-accent-soft p-2 text-accent">{p.icon}</span>
                        <span className="font-medium text-fg">{p.label}</span>
                      </span>
                      <ChevronRight className="h-5 w-5 text-fg-subtle transition-colors group-hover:text-accent" />
                    </button>
                  ))}
                </div>
              ) : step === 3 ? (
                <div>
                  <dl className="mb-5 rounded-control border border-line bg-page p-4 text-sm">
                    <dt className="text-fg-subtle">{m.service}</dt>
                    <dd className="font-medium text-fg">{secilenHizmet}</dd>
                    <dt className="mt-2 text-fg-subtle">{m.detail}</dt>
                    <dd className="font-medium text-fg">{selection.detail}</dd>
                  </dl>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <a
                      href={whatsappLinki}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => kanalSecildi('whatsapp')}
                      className={btnPrimary}
                    >
                      <WhatsAppIcon className="h-4 w-4" /> {t.wizard.viaWhatsapp}
                    </a>
                    {email && (
                      <a
                        href={gmailLinki}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => kanalSecildi('eposta')}
                        className={btnSecondary}
                      >
                        <Mail className="h-4 w-4" /> {t.wizard.viaGmail}
                      </a>
                    )}
                  </div>
                  {email && (
                    <p className="mt-4 text-center text-xs text-fg-subtle">
                      {t.wizard.mailApp}{' '}
                      <a href={epostaLinki} onClick={() => kanalSecildi('eposta')} className="text-fg-muted underline underline-offset-2 hover:text-accent">
                        {email}
                      </a>
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {(t.wizard.details[selection.purpose] || []).map((d, i) => (
                    <button
                      key={i}
                      onClick={() => handleDetailSelect(d)}
                      className="group flex items-center justify-between rounded-control border border-line p-4 text-left transition-colors hover:border-accent hover:bg-page"
                    >
                      <span className="font-medium text-fg">{d}</span>
                      <MessageCircle className="h-5 w-5 text-fg-subtle transition-colors group-hover:text-accent" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-line bg-page px-6 py-4 text-center">
              <p className="text-xs text-fg-subtle">{t.wizard.note}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigasyon */}
      <nav className={`fixed z-50 w-full transition-colors duration-300 ${navOnDark ? 'on-band border-b border-transparent' : 'border-b border-line bg-page/90 backdrop-blur-md'}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-[4.5rem] md:px-10">
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Beysera">
            <Wordmark onBand={navOnDark} />
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className={`text-sm transition-colors ${navOnDark ? 'text-on-band-muted hover:text-on-band' : 'text-fg-muted hover:text-fg'}`}>{l.label}</a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitch lang={lang} setLang={setLang} label={t.nav.language} onBand={navOnDark} />
            <button onClick={openWizard} className={`${navOnDark ? btnOnBand : btnPrimary} min-h-10 px-4 py-2.5`}>
              {t.nav.contact}
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitch lang={lang} setLang={setLang} label={t.nav.language} onBand={navOnDark} />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? t.menu.close : t.menu.open} aria-expanded={isMenuOpen} className={`grid h-11 w-11 place-items-center rounded-control ${navOnDark ? 'text-on-band' : 'text-fg'}`}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobil Menü */}
        {isMenuOpen && (
          <div className="flex flex-col border-t border-line bg-page px-5 pb-6 pt-2 lg:hidden">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setIsMenuOpen(false)} className="border-b border-line py-3.5 text-lg text-fg">{l.label}</a>
            ))}
            <button onClick={() => { setIsMenuOpen(false); openWizard(); }} className={`${btnPrimary} mt-5`}>
              <MessageCircle className="h-4 w-4" /> {t.nav.contactMobile}
            </button>
          </div>
        )}
      </nav>

      <main id="top">
        {/* Hero: koyu evren kapağı. Fareyle gezdikçe yıldızlar kayar, imlecin çevresinde takımyıldız çizilir. */}
        <section className="on-band relative isolate overflow-hidden bg-band text-on-band">
          <Starfield className="absolute inset-0 -z-10 h-full w-full" />
          {/* Ufukta hafif bir ışık: yıldız alanına derinlik verir, metnin okunurluğunu bozmaz */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[radial-gradient(60%_80%_at_70%_110%,color-mix(in_oklab,var(--color-band-accent)_22%,transparent),transparent_70%)]"></div>
          {/* Fırlatılabilir gezegenler: yazıların arkasından geçer, WhatsApp kartına çarpıp seker */}
          <Planets hint={t.hero.planetHint} />
          {/* İçerik katmanı yalnızca butonlarda ve kartta tıklama yakalar; yazıların altındaki gezegen de tutulabilir. */}
          <div className="pointer-events-none relative z-10 mx-auto grid min-h-[min(100svh,62rem)] max-w-7xl items-center gap-12 px-5 pb-24 pt-28 md:px-10 md:pb-28 md:pt-36 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h1 className="max-w-[18ch] text-[clamp(2.5rem,6.2vw,5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-on-band">
                {t.hero.title}
              </h1>
              <p className="mt-8 max-w-[56ch] text-lg leading-relaxed text-on-band-muted">
                {t.hero.subtitle}
              </p>
              <div className="pointer-events-auto mt-9 flex flex-col gap-3 sm:flex-row">
                <button onClick={openWizard} className={btnOnBand}>
                  {t.hero.ctaTalk} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <a href="#hizmetler" className={btnGhostOnBand}>
                  {t.hero.ctaProjects}
                </a>
              </div>
            </div>
            <div className="pointer-events-auto lg:col-span-5" data-planet-obstacle>
              <HeroFlow demo={t.hero.demo} />
            </div>
          </div>
        </section>

        {/* Hizmetler: fotoğraflı kartlar. Üstte iki geniş kart, altında üçlü sıralar; boş hücre kalmaz. */}
        <section id="hizmetler" className="border-t border-line bg-surface">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 className={sectionTitle}>{t.services.title}</h2>
              <p className="max-w-[48ch] leading-relaxed text-fg-muted">{t.services.subtitle}</p>
            </div>

            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
              {services.map((service, index) => {
                const wide = index < 2;
                return (
                  <li key={service.id} className={wide ? 'lg:col-span-3' : 'lg:col-span-2'}>
                    <button
                      type="button"
                      onClick={() => openService(service.id)}
                      className="group flex h-full w-full flex-col overflow-hidden rounded-card border border-line bg-page text-left transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-[0_24px_48px_-32px_color-mix(in_oklab,var(--color-fg)_40%,transparent)]"
                    >
                      <span className="relative block overflow-hidden">
                        <img
                          src={`/images/hizmet-${service.id}.webp`}
                          alt=""
                          aria-hidden="true"
                          width="1200"
                          height="750"
                          loading="lazy"
                          decoding="async"
                          className={`w-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04] ${wide ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
                        />
                        <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-control bg-surface/95 text-accent shadow-sm" aria-hidden="true">
                          {service.icon}
                        </span>
                      </span>
                      <span className="flex flex-1 flex-col p-6">
                        <span className={`block font-semibold tracking-[-0.02em] text-fg ${wide ? 'text-2xl' : 'text-xl'}`}>{service.title}</span>
                        <span className="mt-2 block max-w-[60ch] leading-relaxed text-fg-muted">{service.description}</span>
                        <span className="mt-4 flex flex-wrap gap-2">
                          {service.highlights.map((h) => (
                            <span key={h} className="rounded-full border border-line bg-surface px-3 py-1 text-[0.8125rem] text-fg-muted">{h}</span>
                          ))}
                        </span>
                        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-accent">
                          {t.services.cta}
                          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Süreç: koyu band, gerçek bir sıra olduğu için numaralı */}
        <section id="surec" className="on-band bg-band text-on-band">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 className={`${sectionTitle} text-on-band`}>{t.process.title}</h2>
              <p className="max-w-[40ch] text-on-band-muted">{t.process.subtitle}</p>
            </div>
            <ol className="mt-14 grid gap-px overflow-hidden rounded-card border border-band-line bg-band-line sm:grid-cols-2 lg:grid-cols-4">
              {t.process.steps.map((item, idx) => (
                <li key={item.title} className="flex flex-col bg-band p-7 md:p-8">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-band-accent text-sm font-semibold tabular-nums text-band-accent">
                    {idx + 1}
                  </span>
                  <h3 className="mt-10 text-xl font-semibold tracking-[-0.02em] text-on-band">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-on-band-muted">{item.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Araçlar: başlık üstte, altta sıkı bir ızgara */}
        <section id="araclar" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-16">
            <h2 className={`${sectionTitle} lg:col-span-5`}>{t.skills.title}</h2>
            <p className="max-w-[56ch] text-lg leading-relaxed text-fg-muted lg:col-span-7 lg:pt-2">{t.skills.subtitle}</p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((skill, i) => (
              <div key={t.skills.groups[i]} className="bg-surface p-6 md:p-7">
                <div className="flex items-center gap-3">
                  <span className="text-accent" aria-hidden="true">{skill.icon}</span>
                  <h3 className="font-semibold text-fg">{t.skills.groups[i]}</h3>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <li key={item} className="rounded-control bg-page px-3 py-1.5 text-sm text-fg-muted">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* SSS: dar, editoryal sütun */}
        <section id="sss" className="border-t border-line bg-surface">
          <div className="mx-auto max-w-3xl px-5 py-20 md:px-10 md:py-28">
            <h2 className={sectionTitle}>{t.faq.title}</h2>
            <div className="mt-10 border-t border-line">
              {t.faq.items.map((item) => (
                <details key={item.q} className="group border-b border-line">
                  <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-6 py-5 text-lg font-medium text-fg transition-colors hover:text-accent">
                    {item.q}
                    <Plus className="faq-icon h-5 w-5 shrink-0 text-fg-subtle transition-transform duration-200" aria-hidden="true" />
                  </summary>
                  <p className="max-w-[60ch] pb-6 leading-relaxed text-fg-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* İletişim: koyu band */}
        <section id="iletisim" className="px-3 pb-3 pt-3 md:px-6 md:pb-6">
          <div className="on-band mx-auto max-w-7xl rounded-[1.25rem] bg-band px-6 py-16 text-on-band md:px-14 md:py-24">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <h2 className="max-w-[16ch] text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-on-band">
                  {t.contact.title}
                </h2>
                <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-on-band-muted">
                  {t.contact.subtitle}
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:col-span-5">
                <button onClick={openWizard} className={btnOnBand}>
                  <MessageCircle className="h-4 w-4" /> {t.contact.cta}
                </button>
                {calendlyUrl && (
                  <a href={calendlyUrl} onClick={linkTakip('gorusme')} target="_blank" rel="noopener noreferrer" className={btnGhostOnBand}>
                    <CalendarDays className="h-4 w-4" /> {t.contact.book}
                  </a>
                )}
                <p className="mt-4 text-sm text-on-band-muted">{t.contact.direct}</p>
                <div className={`grid gap-3 ${email ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
                  <a href={`https://wa.me/${whatsappNumber}`} onClick={linkTakip('whatsapp')} target="_blank" rel="noopener noreferrer" className={btnGhostOnBand}>
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                  {email && (
                    <a href={`mailto:${email}`} onClick={linkTakip('eposta')} className={btnGhostOnBand}>
                      <Mail className="h-4 w-4" /> {email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Wordmark />
            <span className="text-sm text-fg-subtle">{t.footer.tagline} © {new Date().getFullYear()}</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
            <a href={`https://wa.me/${whatsappNumber}`} onClick={linkTakip('whatsapp')} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">
              WhatsApp
            </a>
            {email && (
              <a href={`mailto:${email}`} onClick={linkTakip('eposta')} className="transition-colors hover:text-fg">
                {email}
              </a>
            )}
          </div>
        </div>
        <p className="mx-auto max-w-7xl px-5 pb-8 text-xs text-fg-subtle md:px-10">{t.footer.privacy}</p>
      </footer>
    </div>
  );
};

export default App;
