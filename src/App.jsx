import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Cpu, 
  Bot, 
  Camera, 
  Database, 
  ExternalLink, 
  Send, 
  Mail, 
  Zap,
  Menu,
  X,
  ArrowUpRight,
  Workflow,
  Sparkles,
  TrendingUp,
  Target,
  CheckCircle2,
  Rocket,
  MessageCircle,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Danışmanlık Sihirbazı State Yönetimi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    purpose: '',
    detail: ''
  });

  const whatsappNumber = "905076182520";

  // Danışmanlık Seçenekleri Yapısı
  const consultancySteps = {
    purposes: [
      { id: 'web', label: 'Web Sitesi Kurulumu', icon: <Globe className="w-5 h-5" /> },
      { id: 'instagram', label: 'Instagram AI Agent', icon: <Bot className="w-5 h-5" /> },
      { id: 'optimization', label: 'Mevcut Site Geliştirme', icon: <Zap className="w-5 h-5" /> },
      { id: 'bot', label: 'Özel Bot / Scraper', icon: <Database className="w-5 h-5" /> },
      { id: 'ai', label: 'AI Entegrasyonu (Face Swap vb.)', icon: <Sparkles className="w-5 h-5" /> }
    ],
    details: {
      web: ['E-Ticaret Çözümü', 'Kurumsal Tanıtım', 'Özel Web Uygulaması', 'Portfolyo Sitesi'],
      instagram: ['Otomatik Yanıt Sistemi', 'İçerik Üretim Botu', 'DM Satış Asistanı'],
      optimization: ['Hız & SEO Optimizasyonu', 'Tasarım Yenileme', 'Yeni Özellik Ekleme'],
      bot: ['Pazar Yeri Veri Çekme', 'Stok/Fiyat Takip Botu', 'Otomatik Form Doldurma'],
      ai: ['Face Swap / VTON Projesi', 'LLM (ChatGPT) Entegrasyonu', 'AI Görsel Üretim Sistemi']
    }
  };

  const handlePurposeSelect = (purpose) => {
    setSelection({ ...selection, purpose });
    setStep(2);
  };

  const handleDetailSelect = (detail) => {
    const finalSelection = { ...selection, detail };
    setSelection(finalSelection);
    
    // WhatsApp Mesajını Oluştur
    const message = `Merhaba Hakan Bey, danışmanlık almak istiyorum.%0A%0A*Hizmet:* ${finalSelection.purpose}%0A*Detay:* ${detail}`;
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    window.open(url, '_blank');
    setIsModalOpen(false);
    // Reset modal
    setTimeout(() => {
      setStep(1);
      setSelection({ purpose: '', detail: '' });
    }, 500);
  };

  useEffect(() => {
    const handleScrollEvent = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScrollEvent);
    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, []);

  const projects = [
    {
      id: 1,
      category: 'web',
      title: 'Premium Web Tasarımı & Geliştirme',
      description: 'İşletmeniz için modern, SEO uyumlu ve satış odaklı web siteleri tasarlıyor, dijital kimliğinizi zirveye taşıyoruz.',
      tech: ['Next.js', 'Tailwind', 'Vercel'],
      impact: 'Dönüşüm Odaklı Mimari',
      color: 'text-cyan-500',
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" 
    },
    {
      id: 2,
      category: 'bot',
      title: 'E-Ticaret Veri Madenciliği',
      description: 'Pazaryeri verilerini stratejik kazanca dönüştürün. Anlık stok ve fiyat takibi ile rakiplerinizin önüne geçin.',
      tech: ['Python', 'Playwright', 'Docker'],
      impact: 'Stratejik Pazar Analizi',
      color: 'text-fuchsia-500',
      image: "https://images.unsplash.com/photo-1551288049-bbdac8626ad1?auto=format&fit=crop&q=80&w=1200"
    },
    {
      id: 3,
      category: 'ai',
      title: 'n8n Otonom İş Akışları',
      description: 'Manuel süreçleri geride bırakın. Yapay zeka destekli otonom akışlarla operasyonel yükünüzü %85 azaltın.',
      tech: ['n8n', 'OpenAI', 'Automate'],
      impact: 'Otonom Operasyon Gücü',
      color: 'text-indigo-500',
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200"
    },
    {
      id: 4,
      category: 'bot',
      title: 'Instagram İçerik Motoru',
      description: 'Markanız 7/24 içerik üretsin. AI ile reels üretimi, otomatik paylaşım, yorum ve DM’lere anında yanıt — hepsi tek platformda.',
      tech: ['Python', 'Insta API', 'GenAI'],
      impact: 'Otonom Organik Büyüme',
      color: 'text-pink-500',
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1200"
    },
    {
      id: 5,
      category: 'ai',
      title: 'AI Face Swap & Sanal Deneme',
      description: 'Web sitelerinize  özel geliştirmeler , AI ajanlar ve otomasyonlar  entegre ederek kullanıcı deneyimini ve satış performansını artırıyoruz.',
      tech: ['SDXL', 'ComfyUI', 'fal.ai'],
      impact: 'Yeni Nesil Satış Deneyimi',
      color: 'text-violet-500',
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-cyan-100 selection:text-cyan-900 overflow-x-hidden scroll-smooth">
      {/* Danışmanlık Sihirbazı Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-8">
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-400" />
                  </button>
                )}
                <div className="text-center flex-grow">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                    {step === 1 ? 'Neye ihtiyacınız var?' : 'Hangi detayda yardımcı olalım?'}
                  </h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {step === 1 ? (
                <div className="grid grid-cols-1 gap-3">
                  {consultancySteps.purposes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handlePurposeSelect(p.label)}
                      className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-cyan-500 hover:bg-cyan-50 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-white group-hover:text-cyan-600 transition-colors">
                          {p.icon}
                        </div>
                        <span className="font-bold text-slate-700">{p.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-cyan-500" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {consultancySteps.details[Object.keys(consultancySteps.details).find(key => consultancySteps.purposes.find(p => p.label === selection.purpose)?.id === key)].map((d, i) => (
                    <button
                      key={i}
                      onClick={() => handleDetailSelect(d)}
                      className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-fuchsia-500 hover:bg-fuchsia-50 transition-all group"
                    >
                      <span className="font-bold text-slate-700">{d}</span>
                      <MessageCircle className="w-5 h-5 text-slate-300 group-hover:text-fuchsia-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 Seçiminizden sonra doğrudan WhatsApp sohbeti başlatılacaktır.
               </p>
            </div>
          </div>
        </div>
      )}

      {/* Arka Plan Tasarımı */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[100%] md:w-[60%] h-[60%] bg-cyan-50/60 rounded-full blur-[120px] opacity-80"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[90%] md:w-[50%] h-[50%] bg-fuchsia-50/60 rounded-full blur-[120px] opacity-80"></div>
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }}></div>
      </div>

      {/* Navigasyon */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-2xl py-3 border-b border-slate-100 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="text-xl md:text-2xl font-black italic tracking-tighter flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-6">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent uppercase tracking-tighter text-2xl">HAKAN ÇAĞ</span>
          </div>

          <div className="hidden md:flex items-center space-x-10 text-[11px] font-black uppercase tracking-[0.2em]">
            <a href="#vitrin" className="hover:text-cyan-600 transition-colors">Projeler</a>
            <a href="#how-it-works" className="hover:text-fuchsia-600 transition-colors">Süreç</a>
            <a href="#skills" className="hover:text-indigo-600 transition-colors">Teknoloji</a>
            <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-cyan-600 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all active:scale-95 flex items-center gap-2 font-bold tracking-widest">
              <MessageCircle className="w-4 h-4" /> İLETİŞİME GEÇİN
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-900">
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobil Menü */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-3xl border-b border-slate-100 p-8 flex flex-col space-y-6 shadow-2xl animate-in slide-in-from-top-4 duration-500">
            <a href="#vitrin" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-slate-600">PROJELER</a>
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-slate-600">SÜREÇ</a>
            <a href="#skills" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-slate-600">TEKNOLOJİ</a>
            <button onClick={() => { setIsMenuOpen(false); setIsModalOpen(true); }} className="text-sm font-black uppercase tracking-widest text-cyan-600 font-bold flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> WHATSAPP İLETİŞİM
            </button>
          </div>
        )}
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-24">
          <div className="max-w-6xl">
            <h1 className="text-6xl md:text-[10rem] font-black mb-10 leading-[0.85] tracking-tighter text-slate-900 uppercase">
              İŞİNİZİ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-500 italic">OTONOM GÜCE</span> <br />
              DÖNÜŞTÜRÜN.
            </h1>
            <p className="text-xl md:text-3xl text-slate-500 max-w-3xl leading-relaxed font-bold mb-16 mx-auto md:mx-0">
              Manuel süreçlere veda edin. Veri madenciliği ve yapay zeka entegrasyonu ile operasyonel hızınızı 10 katına çıkarın.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 items-center md:items-start md:justify-start justify-center">
               <a href="#vitrin" className="px-12 py-7 bg-slate-900 text-white font-black rounded-[2.5rem] hover:bg-slate-700 transition-all flex items-center justify-center gap-4 group text-base tracking-widest active:scale-95 shadow-2xl">
                 PROJELERİ GÖR <ArrowUpRight className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
               </a>
               <button onClick={() => setIsModalOpen(true)} className="px-12 py-7 bg-white border-2 border-slate-900 text-slate-900 font-black rounded-[2.5rem] hover:bg-slate-900 hover:text-white transition-all text-base tracking-widest active:scale-95 flex items-center gap-3">
                 <MessageCircle className="w-6 h-6" /> PROJENİZİ KONUŞALIM
               </button>
            </div>
          </div>
        </section>

        {/* Vitrin Section */}
        <section id="vitrin" className="container mx-auto px-6 md:px-12 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase text-slate-900 leading-none text-center md:text-left">DİJİTAL VİTRİN</h2>
              <div className="w-20 h-2 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full mt-4 mx-auto md:mx-0"></div>
            </div>
            
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto no-scrollbar max-w-full">
              {['all', 'web', 'bot', 'ai'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'bg-white text-slate-900 shadow-md border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab === 'all' ? 'Tümü' : tab === 'web' ? 'Sektörel Web' : tab === 'bot' ? 'Bot / Scraper' : 'Yapay Zeka'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="group bg-white rounded-[3.5rem] border border-slate-100 p-3 hover:border-cyan-200 transition-all duration-700 hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col"
              >
                <div className="bg-slate-50 rounded-[3rem] h-full flex flex-col overflow-hidden">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
                  </div>

                  <div className="p-8 md:p-10 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-5">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      <span className={`text-[12px] font-black uppercase tracking-widest ${project.color} font-bold`}>
                        {project.impact}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black mb-4 tracking-tighter group-hover:text-cyan-600 transition-colors uppercase italic leading-none text-slate-900">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
                      "{project.description}"
                    </p>
                    
                    <div className="mt-auto pt-4">
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.tech.map((t, idx) => (
                          <span key={idx} className="px-4 py-1.5 bg-white border border-slate-100 text-[9px] font-black text-slate-400 rounded-lg uppercase tracking-widest group-hover:border-cyan-100 transition-colors">
                            {t}
                          </span>
                        ))}
                      </div>
                      <button className="w-full py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 group-hover:bg-cyan-600 transition-all active:scale-[0.98] shadow-2xl group-hover:shadow-cyan-500/30 font-bold tracking-widest">
                        PROJE DETAYLARI <ArrowUpRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Süreç Section */}
        <section id="how-it-works" className="py-32 bg-slate-50/50 relative">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase text-slate-900 mb-20 leading-none">STRATEJİK AKIŞ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { step: "01", title: "ANALİZ", desc: "Dijital süreçlerinizde görünmeyen verimsizlikleri ortaya çıkarır, büyümenizi yavaşlatan noktaları netleştiririz.", icon: <Target className="w-7 h-7 text-cyan-500" /> },
                { step: "02", title: "KURGU", desc: "Veri ve yapay zeka entegrasyonu ile yatırımınızın en yüksek geri dönüşünü sağlayacak stratejik yol haritasını oluşturuyoruz.", icon: <Sparkles className="w-7 h-7 text-fuchsia-500" /> },
                { step: "03", title: "MİMARİ", desc: "Ölçeklenebilir ve yüksek performanslı dijital sistemler tasarlayıp iş süreçlerinizi sürdürülebilir hale getiriyoruz.", icon: <Workflow className="w-7 h-7 text-indigo-500" /> },
                { step: "04", title: "YAYIN", desc: "Sistemi devreye alır, performans ve büyümeyi gerçek zamanlı olarak takip ederiz.", icon: <Rocket className="w-7 h-7 text-emerald-500" /> }
              ].map((item, idx) => (
                <div key={idx} className="relative p-12 bg-white border border-slate-100 rounded-[3rem] group hover:border-cyan-200 transition-all duration-700 hover:shadow-2xl text-left shadow-sm">
                  <div className="text-6xl font-black text-slate-50 mb-8 group-hover:text-cyan-50 transition-colors tracking-tighter leading-none">{item.step}</div>
                  <div className="mb-8">{item.icon}</div>
                  <h4 className="text-2xl font-black mb-5 uppercase tracking-tight italic text-slate-900">{item.title}</h4>
                  <p className="text-slate-500 text-sm font-semibold leading-relaxed opacity-80">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kapasite Section */}
        <section id="skills" className="py-32">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-24 gap-16 text-center lg:text-left">
              <div className="max-w-2xl">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase text-slate-900 mb-8 leading-none">KAPASİTE</h2>
                <p className="text-slate-400 font-bold tracking-[0.4em] text-[12px] uppercase mb-10 leading-relaxed italic">Karmaşık Veri ve AI Sorunlarına Mühendislik Çözümleri</p>
              </div>
              <div className="grid grid-cols-2 gap-10">
                 <div className="p-12 bg-slate-50 rounded-[3rem] border border-slate-100 text-center shadow-sm">
                    <div className="text-5xl font-black italic mb-2 text-slate-900">%85</div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Maliyet Verimi</div>
                 </div>
                 <div className="p-12 bg-slate-50 rounded-[3rem] border border-slate-100 text-center shadow-sm">
                    <div className="text-5xl font-black italic mb-2 text-slate-900">10X</div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Süreç Hızı</div>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { label: "Veri Madenciliği", items: ["Python", "Playwright", "Docker"], icon: <Database /> },
                { label: "AI & Derin Öğrenme", items: ["SDXL", "ComfyUI", "LLMs"], icon: <Cpu /> },
                { label: "Akıllı Otomasyon", items: ["n8n", "FastAPI", "Redis"], icon: <Workflow /> },
                { label: "Modern Altyapı", items: ["React", "Next.js", "Vercel"], icon: <Globe /> }
              ].map((skill, i) => (
                <div key={i} className="group bg-white border border-slate-100 p-12 rounded-[3.5rem] text-center shadow-sm hover:shadow-3xl transition-all duration-700 hover:-translate-y-4">
                  <div className="w-16 h-16 mx-auto mb-10 rounded-3xl flex items-center justify-center text-white bg-slate-900 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                    {skill.icon}
                  </div>
                  <h4 className="font-black mb-8 uppercase tracking-widest text-[12px] text-slate-900 italic underline decoration-cyan-500/20 underline-offset-8 decoration-4">{skill.label}</h4>
                  <div className="flex flex-col gap-4">
                    {skill.items.map((item, j) => (
                      <span key={j} className="text-slate-400 text-[13px] font-bold uppercase tracking-tight opacity-70 group-hover:opacity-100">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* İletişim Section */}
        <section id="contact" className="py-32 container mx-auto px-6 md:px-12 text-center">
          <div className="bg-slate-900 rounded-[5rem] p-16 md:p-32 relative overflow-hidden flex flex-col items-center shadow-[0_100px_150px_-40px_rgba(15,23,42,0.4)]">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/10 blur-[150px]"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-fuchsia-500/10 blur-[150px]"></div>
            
            <div className="relative z-10 max-w-5xl mx-auto">
              <h2 className="text-6xl md:text-[10rem] font-black text-white mb-12 tracking-tighter leading-[0.85] uppercase italic text-center">
                STRATEJİ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400 underline decoration-white/10 decoration-8 underline-offset-[24px]">BAŞLATIN.</span>
              </h2>
              <p className="text-slate-400 mb-20 text-2xl md:text-3xl font-bold max-w-3xl mx-auto italic leading-relaxed opacity-90">
                İşinizi yapay zeka ve otomasyonun gücüyle yeniden tanımlayın. Bugün iletişime geçin, yarını otonom yapalım.
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-10 w-full px-4">
                <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto px-16 py-8 bg-white text-slate-900 font-black rounded-[3rem] hover:bg-cyan-600 hover:text-white hover:scale-105 transition-all flex items-center justify-center gap-5 text-lg tracking-widest shadow-3xl active:scale-95 group">
                  <MessageCircle className="w-7 h-7 group-hover:animate-bounce" /> PROJENİZİ KONUŞALIM
                </button>
                <div className="flex gap-8">
                <a 
                  href="https://t.me/Serkanncoskunn" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-8 bg-white/5 border border-white/10 rounded-[3rem] text-white hover:bg-sky-500/20 hover:border-sky-500 transition-all hover:rotate-12 active:scale-90 shadow-2xl group flex items-center justify-center"
                >
                  <Send className="w-8 h-8 text-sky-400 group-hover:animate-pulse" />
                </a>
                <a 
                  href={`https://wa.me/${whatsappNumber}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-8 bg-white/5 border border-white/10 rounded-[3rem] text-white hover:bg-emerald-500/20 hover:border-emerald-500 transition-all hover:-rotate-12 active:scale-90 shadow-2xl group flex items-center justify-center"
                >
                  <svg 
                    className="w-8 h-8 text-emerald-400 group-hover:animate-pulse" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-24 container mx-auto px-6 md:px-12 border-t border-slate-100 bg-white text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-4">
            <div className="text-slate-900 font-black text-4xl italic uppercase tracking-tighter leading-none">HAKAN ÇAĞ</div>
            <div className="text-slate-400 text-[11px] font-black uppercase tracking-[0.5em] opacity-80">
              OTOMASYON & AI MÜHENDİSLİĞİ © 2024
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-12 text-[12px] font-black uppercase tracking-widest text-slate-400">
            <a 
            href={`https://wa.me/${whatsappNumber}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-green-500 transition-colors underline decoration-transparent hover:decoration-green-400 underline-offset-8 decoration-4"
          >
            WHATSAPP
          </a>
            <a 
            href="https://t.me/Serkanncoskunn" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-sky-500 transition-colors underline decoration-transparent hover:decoration-sky-400 underline-offset-8 decoration-4"
          >
            TELEGRAM
          </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;