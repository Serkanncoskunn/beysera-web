import { useState, useEffect, useRef, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import {
  Globe,
  Cpu,
  Bot,
  Database,
  Send,
  Zap,
  Menu,
  X,
  ArrowRight,
  Workflow,
  Sparkles,
  TrendingUp,
  Target,
  Rocket,
  MessageCircle,
  ChevronRight,
  ArrowLeft,
  ChartColumn,
  Mail,
  CalendarDays,
  Check,
  LayoutGrid,
  Server
} from 'lucide-react';

import { useLanguage, LANGUAGES } from './i18n/context';
import { CONTACT } from './config';
import ParticleRing from './components/ParticleRing';
import ProjectVisual from './components/ProjectVisual';

// Ortak buton stilleri: tek kaynaktan gelir, her bölüm aynı durumları (hover/focus/press) kullanır.
const btnBase = 'inline-flex items-center justify-center gap-2 rounded-control px-6 py-3.5 text-sm font-semibold transition-colors duration-200 ease-out-soft active:translate-y-px';
const btnPrimary = `${btnBase} bg-accent text-accent-ink hover:bg-accent-strong`;
const btnLight = `${btnBase} bg-fg text-page hover:bg-fg-muted`;
// Koyu yeşil bant üzerinde kenarlık 3:1 kontrastı korusun diye daha açık kenarlık.
const btnGhostOnBand = `${btnBase} border border-fg-subtle text-fg hover:border-fg hover:bg-page/20`;

const WhatsAppIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const LanguageSwitch = ({ lang, setLang, label }) => (
  <div role="group" aria-label={label} className="flex items-center rounded-full border border-line p-1">
    {LANGUAGES.map((code) => (
      <button
        key={code}
        type="button"
        onClick={() => setLang(code)}
        aria-pressed={lang === code}
        className={`min-w-9 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] transition-colors duration-200 ${lang === code ? 'bg-surface-raised text-fg' : 'text-fg-subtle hover:text-fg'}`}
      >
        {code}
      </button>
    ))}
  </div>
);

const App = () => {
  const { lang, t, setLang } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
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

  const { whatsappNumber, telegramUrl, email, calendlyUrl } = CONTACT;
  // İngilizce ziyaretçiye e-posta adresi tanımlıysa e-posta, değilse WhatsApp.
  const useEmail = lang === 'en' && Boolean(email);

  // Danışmanlık Seçenekleri Yapısı (metinler i18n dosyalarında)
  const purposeIcons = {
    web: <Globe className="h-5 w-5" />,
    data: <ChartColumn className="h-5 w-5" />,
    instagram: <Bot className="h-5 w-5" />,
    optimization: <Zap className="h-5 w-5" />,
    bot: <Database className="h-5 w-5" />,
    ai: <Sparkles className="h-5 w-5" />
  };
  const purposes = Object.keys(purposeIcons).map((id) => ({
    id,
    label: t.wizard.purposes[id],
    icon: purposeIcons[id]
  }));

  // purpose kimlik (web, bot…) olarak tutuluyor; dil değişse de detay listesi bozulmuyor.
  const handlePurposeSelect = (purposeId) => {
    setSelection({ ...selection, purpose: purposeId });
    setStep(2);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setSelection({ purpose: '', detail: '' });
    }, 300);
  }, []);

  const handleDetailSelect = (detail) => {
    const finalSelection = { ...selection, detail };
    setSelection(finalSelection);

    const m = t.wizard.message;
    const service = t.wizard.purposes[finalSelection.purpose];
    if (useEmail) {
      // E-posta taslağı (İngilizce ve e-posta tanımlıysa)
      const subject = encodeURIComponent(`${m.subject}: ${service}`);
      const body = encodeURIComponent(`${m.greeting}\n\n${m.service}: ${service}\n${m.detail}: ${detail}`);
      window.location.assign(`mailto:${email}?subject=${subject}&body=${body}`);
    } else {
      // WhatsApp Mesajını Oluştur
      const message = encodeURIComponent(`${m.greeting}\n\n*${m.service}:* ${service}\n*${m.detail}:* ${detail}`);
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    }
    closeModal();
  };

  useEffect(() => {
    const handleScrollEvent = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScrollEvent);
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

  // Başlık, açıklama ve öne çıkanlar i18n dosyalarındaki projects[key] altında.
  const projects = [
    { key: 'fashion', category: 'web', visual: 'store', tech: ['React', 'Vite', '3D / GLB'] },
    { key: 'procurement', category: 'data', visual: 'dashboard', tech: ['Power BI', 'DAX', 'Excel'] },
    { key: 'piano', category: 'web', visual: 'booking', tech: ['React', 'Supabase', 'Tailwind'] },
    { key: 'brick', category: 'web', visual: 'catalog', tech: ['WordPress', 'SEO', 'TR / EN'] },
    { key: 'erp', category: 'data', visual: 'database', tech: ['SQL Server', 'T-SQL', 'SSMS'] },
    { key: 'mining', category: 'bot', visual: 'scraper', tech: ['Python', 'Playwright', 'Docker'] },
    { key: 'instagram', category: 'bot', visual: 'social', tech: ['Python', 'Insta API', 'GenAI'] },
    { key: 'workflows', category: 'ai', visual: 'workflow', tech: ['n8n', 'OpenAI', 'Webhooks'] },
    { key: 'tryon', category: 'ai', visual: 'tryon', tech: ['SDXL', 'ComfyUI', 'fal.ai'] }
  ].map((p) => ({ ...p, ...t.projects[p.key] }));

  const filteredProjects = activeTab === 'all'
    ? projects
    : projects.filter(p => p.category === activeTab);

  // Izgarada boş hücre kalmasın: ilk proje öne çıkar, kalan boşluğu son kart doldurur.
  // md: 2 sütun, lg: 3 sütun. Öne çıkan kart md'de tam satır, lg'de 2 ya da 3 sütun.
  const cardSpan = (index, count) => {
    const leadLg = (count + 1) % 3 === 1 || count === 1 ? 3 : 2;
    const usedLg = leadLg + (count - 1);
    const lastLg = usedLg % 3 === 0 ? 1 : 1 + (3 - (usedLg % 3));
    const lastMd = (count - 1) % 2 === 1 ? 2 : 1;
    if (index === 0) return leadLg === 3 ? 'md:col-span-2 lg:col-span-3' : 'md:col-span-2 lg:col-span-2';
    if (index !== count - 1) return '';
    const md = lastMd === 2 ? 'md:col-span-2' : '';
    const lg = { 1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3' }[lastLg];
    return `${md} ${lg}`;
  };

  const processIcons = [
    <Target className="h-5 w-5" />,
    <Sparkles className="h-5 w-5" />,
    <Workflow className="h-5 w-5" />,
    <Rocket className="h-5 w-5" />
  ];

  const skillGroups = [
    { items: ["Power BI", "SQL Server", "Excel"], icon: <ChartColumn className="h-5 w-5" /> },
    { items: ["Python", "Playwright", "Docker"], icon: <Database className="h-5 w-5" /> },
    { items: ["SDXL", "ComfyUI", "LLMs"], icon: <Cpu className="h-5 w-5" /> },
    { items: ["n8n", "FastAPI", "Redis"], icon: <Workflow className="h-5 w-5" /> },
    { items: ["React", "Next.js", "3D / GLB"], icon: <LayoutGrid className="h-5 w-5" /> },
    { items: ["Supabase", "Vercel", "WordPress"], icon: <Server className="h-5 w-5" /> }
  ];

  const navLinks = [
    { href: '#vitrin', label: t.nav.projects },
    { href: '#how-it-works', label: t.nav.process },
    { href: '#skills', label: t.nav.tech }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-page font-sans text-fg">
      <Analytics />

      {/* Danışmanlık Sihirbazı Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-page/80 backdrop-blur-sm" onClick={closeModal} aria-hidden="true"></div>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wizard-title"
            tabIndex={-1}
            className="relative max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-card border border-line bg-surface outline-none"
          >
            <div className="p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                {step === 2 && (
                  <button onClick={() => setStep(1)} aria-label={t.wizard.back} className="rounded-full p-2 text-fg-subtle transition-colors hover:bg-surface-raised hover:text-fg">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <h3 id="wizard-title" className="flex-grow text-xl font-medium tracking-[-0.01em]">
                  {step === 1 ? t.wizard.step1 : t.wizard.step2}
                </h3>
                <button onClick={closeModal} aria-label={t.wizard.close} className="rounded-full p-2 text-fg-subtle transition-colors hover:bg-surface-raised hover:text-fg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {step === 1 ? (
                <div className="grid grid-cols-1 gap-2">
                  {purposes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handlePurposeSelect(p.id)}
                      className="group flex items-center justify-between rounded-control border border-line p-4 text-left transition-colors hover:border-accent hover:bg-surface-raised"
                    >
                      <span className="flex items-center gap-4">
                        <span className="rounded-control bg-surface-raised p-2.5 text-accent">{p.icon}</span>
                        <span className="font-medium text-fg">{p.label}</span>
                      </span>
                      <ChevronRight className="h-5 w-5 text-fg-subtle transition-colors group-hover:text-accent" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {(t.wizard.details[selection.purpose] || []).map((d, i) => (
                    <button
                      key={i}
                      onClick={() => handleDetailSelect(d)}
                      className="group flex items-center justify-between rounded-control border border-line p-4 text-left transition-colors hover:border-accent hover:bg-surface-raised"
                    >
                      <span className="font-medium text-fg">{d}</span>
                      <MessageCircle className="h-5 w-5 text-fg-subtle transition-colors group-hover:text-accent" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-line bg-page/40 px-6 py-4 text-center">
              <p className="text-xs text-fg-subtle">{useEmail ? t.wizard.noteEmail : t.wizard.note}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigasyon */}
      <nav className={`fixed z-50 w-full transition-colors duration-300 ${scrolled || isMenuOpen ? 'border-b border-line bg-page/85 backdrop-blur-md' : 'border-b border-transparent'}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20 md:px-10">
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 text-xl font-medium tracking-[-0.02em] text-fg">
            <Zap className="h-6 w-6 fill-accent text-accent" aria-hidden="true" />
            beysera
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-fg-muted transition-colors hover:text-fg">{l.label}</a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitch lang={lang} setLang={setLang} label={t.nav.language} />
            <button onClick={() => setIsModalOpen(true)} className={`${btnLight} px-4 py-2.5`}>
              {t.nav.contact}
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitch lang={lang} setLang={setLang} label={t.nav.language} />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? t.menu.close : t.menu.open} aria-expanded={isMenuOpen} className="rounded-control p-2 text-fg">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobil Menü */}
        {isMenuOpen && (
          <div className="flex flex-col gap-1 border-t border-line bg-page px-6 pb-6 pt-2 md:hidden">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setIsMenuOpen(false)} className="py-3 text-lg text-fg-muted hover:text-fg">{l.label}</a>
            ))}
            <button onClick={() => { setIsMenuOpen(false); setIsModalOpen(true); }} className={`${btnPrimary} mt-3`}>
              <MessageCircle className="h-4 w-4" /> {t.nav.contactMobile}
            </button>
          </div>
        )}
      </nav>

      <main id="top">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden">
          <ParticleRing className="absolute inset-0 -z-10 h-full w-full" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_60%,var(--color-page)_98%)]"></div>
          <div className="mx-auto flex min-h-[min(92svh,58rem)] max-w-5xl flex-col items-center justify-center px-6 pb-20 pt-28 text-center">
            <h1 className="max-w-[16ch] text-[clamp(2.5rem,7vw,5.75rem)] font-medium leading-[1.04] tracking-[-0.035em] text-fg">
              {t.hero.line1} <span className="text-accent">{t.hero.highlight}</span> {t.hero.line3}
            </h1>
            <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-fg-muted md:text-lg">
              {t.hero.subtitle}
            </p>
            <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button onClick={() => setIsModalOpen(true)} className={btnPrimary}>
                {t.hero.ctaTalk} <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#vitrin" className={btnLight}>
                {t.hero.ctaProjects}
              </a>
            </div>
          </div>
        </section>

        {/* Vitrin Section */}
        <section id="vitrin" className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.025em]">{t.showcase.title}</h2>

            <div role="tablist" aria-label={t.showcase.title} className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full border border-line p-1">
              {['all', 'web', 'data', 'bot', 'ai'].map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors duration-200 ${activeTab === tab ? 'bg-fg text-page' : 'text-fg-muted hover:text-fg'}`}
                >
                  {t.showcase.tabs[tab]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => {
              const lead = index === 0;
              return (
                <article
                  key={project.key}
                  className={`group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors duration-300 hover:border-line-strong ${lead ? 'lg:flex-row' : ''} ${cardSpan(index, filteredProjects.length)}`}
                >
                  <div className={`relative overflow-hidden ${lead ? 'lg:w-1/2' : ''}`}>
                    <ProjectVisual
                      kind={project.visual}
                      className={`aspect-[4/3] w-full transition-transform duration-700 ease-out-soft group-hover:scale-[1.03] ${lead ? 'lg:aspect-auto lg:h-full' : ''}`}
                    />
                  </div>

                  <div className={`flex flex-grow flex-col p-6 md:p-8 ${lead ? 'lg:w-1/2 lg:p-10' : ''}`}>
                    <div className="mb-4 flex items-center gap-2 text-accent">
                      <TrendingUp className="h-4 w-4" aria-hidden="true" />
                      <span className="text-xs font-semibold uppercase tracking-[0.14em]">{project.type}</span>
                    </div>
                    <h3 className={`font-medium leading-tight tracking-[-0.015em] text-fg ${lead ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                      {project.title}
                    </h3>
                    <p className={`mt-3 leading-relaxed text-fg-muted ${lead ? 'max-w-[52ch] text-base' : 'text-sm'}`}>
                      {project.description}
                    </p>

                    <ul className="mt-5 space-y-2">
                      {project.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-sm text-fg">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                      {project.tech.map((tech) => (
                        <li key={tech} className="rounded-full border border-line px-3 py-1 text-xs text-fg-subtle">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Süreç Section */}
        <section id="how-it-works" className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-12">
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.025em] lg:col-span-4">{t.process.title}</h2>
            <ol className="divide-y divide-line border-y border-line lg:col-span-8">
              {t.process.steps.map((item, idx) => (
                <li key={item.title} className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-2 py-8 md:grid-cols-[3rem_14rem_1fr] md:items-baseline">
                  <span className="text-sm font-medium tabular-nums text-accent">{String(idx + 1).padStart(2, '0')}</span>
                  <h3 className="flex items-center gap-3 text-xl font-medium text-fg">
                    <span className="text-fg-subtle" aria-hidden="true">{processIcons[idx]}</span>
                    {item.title}
                  </h3>
                  <p className="col-start-2 max-w-[60ch] leading-relaxed text-fg-muted md:col-start-3">{item.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Kapasite Section */}
        <section id="skills" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.025em]">{t.skills.title}</h2>
            <p className="mt-4 max-w-[40ch] text-lg leading-relaxed text-fg-muted">{t.skills.subtitle}</p>
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8">
              <div>
                <dt className="text-sm text-fg-subtle">{t.skills.stat1}</dt>
                <dd className="mt-1 text-5xl font-medium tabular-nums tracking-[-0.03em] text-fg">{projects.length}</dd>
              </div>
              <div>
                <dt className="text-sm text-fg-subtle">{t.skills.stat2}</dt>
                <dd className="mt-1 text-5xl font-medium tabular-nums tracking-[-0.03em] text-fg">{skillGroups.length}</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:col-span-7">
            {skillGroups.map((skill, i) => (
              <div key={t.skills.groups[i]} className="bg-page p-8">
                <div className="mb-6 inline-flex rounded-control bg-surface-raised p-2.5 text-accent" aria-hidden="true">
                  {skill.icon}
                </div>
                <h3 className="text-lg font-medium text-fg">{t.skills.groups[i]}</h3>
                <ul className="mt-3 space-y-1.5">
                  {skill.items.map((item) => (
                    <li key={item} className="text-sm text-fg-muted">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* İletişim Section */}
        <section id="contact" className="px-4 pb-16 md:px-6">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-band px-6 py-16 md:px-16 md:py-24">
            <div className="grid items-end gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <h2 className="max-w-[14ch] text-[clamp(2.25rem,6vw,5rem)] font-medium leading-[1.02] tracking-[-0.035em] text-fg">
                  {t.contact.line1} <span className="text-accent-strong">{t.contact.line2}</span>
                </h2>
                <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-fg-muted">
                  {t.contact.subtitle}
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:col-span-4">
                <button onClick={() => setIsModalOpen(true)} className={btnPrimary}>
                  <MessageCircle className="h-4 w-4" /> {t.contact.cta}
                </button>
                {(email || calendlyUrl) && (
                  <div className={`grid gap-3 ${email && calendlyUrl ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {calendlyUrl && (
                      <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className={btnLight}>
                        <CalendarDays className="h-4 w-4" /> {t.contact.book}
                      </a>
                    )}
                    {email && (
                      <a href={`mailto:${email}`} className={btnGhostOnBand}>
                        <Mail className="h-4 w-4" /> {t.contact.email}
                      </a>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className={btnGhostOnBand}>
                    <Send className="h-4 w-4" /> Telegram
                  </a>
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={btnGhostOnBand}>
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row md:px-10">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 fill-accent text-accent" aria-hidden="true" />
            <span className="text-lg font-medium text-fg">beysera</span>
            <span className="text-sm text-fg-subtle">{t.footer.tagline} © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-fg-muted">
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">
              WhatsApp
            </a>
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">
              Telegram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
