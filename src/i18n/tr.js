// Türkçe metinler. Yeni metin eklerken aynı anahtarı en.js dosyasına da ekleyin.
const tr = {
  meta: {
    title: 'Beysera | Otomasyon & AI Mühendisliği',
    description: 'Web tasarım, web sitesi, AI botlar ve AI asistanlarla işinizi daha hızlı ve daha az hatayla yürütün.',
  },
  nav: {
    projects: 'Hizmetler',
    process: 'Süreç',
    tech: 'Teknoloji',
    contact: 'İletişime geçin',
    contactMobile: 'WhatsApp iletişim',
    language: 'Dil',
  },
  hero: {
    line1: 'İşinizi',
    highlight: 'otonom güce',
    line3: 'dönüştürün.',
    subtitle: 'Manuel süreçlere veda edin. Web, veri analizi ve yapay zeka ile işinizi daha hızlı ve daha az hatayla yürütün.',
    ctaProjects: 'Hizmetleri gör',
    ctaTalk: 'Projenizi konuşalım',
  },
  manifesto: {
    before: 'İşletmenizi sadece yöneten değil,',
    highlight: 'büyüten',
    after: ' sistemler kuruyoruz.',
  },
  services: {
    title: 'Neler yapıyoruz',
    subtitle: 'Fikirden yayına: tasarım, yazılım ve yapay zeka tek elden.',
    cta: 'Bu hizmeti konuşalım',
    items: {
      website: {
        title: 'Web Sitesi Oluşturma',
        description: 'Kurumsal siteden e-ticaret mağazasına, işinizi anlatan ve satış getiren siteleri sıfırdan kuruyoruz.',
        highlights: ['Kurumsal site ve landing page', 'E-ticaret mağazası', 'SEO ve hız optimizasyonu dahil'],
      },
      design: {
        title: 'Web Tasarım',
        description: 'Markanıza özel, mobilde de kusursuz görünen arayüzler.',
        highlights: ['UX ve arayüz tasarımı', 'Mobil öncelikli', 'Marka diline uyum'],
      },
      chatbot: {
        title: 'AI Sohbet Botları',
        description: 'WhatsApp, Instagram ve web sitenizde 7/24 cevap veren botlar.',
        highlights: ['WhatsApp ve Instagram DM', 'Sık sorulara anında yanıt', 'Satış ve randevuya yönlendirme'],
      },
      assistant: {
        title: 'AI Yardımcı Asistan',
        description: 'Şirketinizin bilgisiyle çalışan, ekibinize ve müşterilerinize yardım eden asistan.',
        highlights: ['Dokümanlardan cevap bulur', 'E-posta ve teklif taslağı yazar', 'Müşteri hizmetlerine destek'],
      },
      booking: {
        title: 'Randevu & Yönetim Sistemleri',
        description: 'Online randevu, müşteri takibi ve tahsilat tek panelde.',
        highlights: ['Online randevu takvimi', 'Müşteri / öğrenci takibi', 'Tahsilat ve borç takibi'],
      },
      data: {
        title: 'Veri Analizi & Dashboard',
        description: 'Dağınık verinizi karar verdiren raporlara çeviriyoruz.',
        highlights: ['Power BI dashboard', 'SQL raporlama', 'Excel otomasyonu'],
      },
      automation: {
        title: 'İş Akışı Otomasyonu',
        description: 'Tekrar eden işleri n8n ve yapay zeka ile otomatiğe bağlıyoruz.',
        highlights: ['Form, e-posta, CRM entegrasyonu', 'Sipariş ve fatura akışları', 'Pazaryeri veri çekme'],
      },
      optimization: {
        title: 'Mevcut Site Geliştirme',
        description: 'Var olan sitenizi hızlandırıyor, yeniliyor ve yeni özellikler ekliyoruz.',
        highlights: ['Hız ve SEO iyileştirme', 'Tasarım yenileme', 'Yeni özellik ekleme'],
      },
    },
  },
  process: {
    title: 'Stratejik akış',
    steps: [
      { title: 'Analiz', desc: 'Dijital süreçlerinizde görünmeyen verimsizlikleri ortaya çıkarır, büyümenizi yavaşlatan noktaları netleştiririz.' },
      { title: 'Kurgu', desc: 'Veri ve yapay zeka entegrasyonu ile yatırımınızın en yüksek geri dönüşünü sağlayacak yol haritasını oluştururuz.' },
      { title: 'Mimari', desc: 'Ölçeklenebilir ve yüksek performanslı dijital sistemler tasarlayıp iş süreçlerinizi sürdürülebilir hale getiririz.' },
      { title: 'Yayın', desc: 'Sistemi devreye alır, performans ve büyümeyi gerçek zamanlı olarak takip ederiz.' },
    ],
  },
  skills: {
    title: 'Kapasite',
    subtitle: 'Veri, web ve yapay zeka sorunlarına mühendislik çözümleri',
    stat1: 'Hizmet',
    stat2: 'Uzmanlık alanı',
    groups: ['Veri & BI', 'Veri Madenciliği', 'AI & Derin Öğrenme', 'Akıllı Otomasyon', 'Web & E-ticaret', 'Altyapı'],
  },
  contact: {
    line1: 'Strateji',
    line2: 'başlatın.',
    subtitle: 'İşinizi yapay zeka ve otomasyonun gücüyle yeniden tanımlayın. Bugün iletişime geçin, yarını otonom yapalım.',
    cta: 'Projenizi konuşalım',
    email: 'Gmail',
    book: 'Görüşme planla',
  },
  footer: {
    tagline: 'Otomasyon & AI mühendisliği',
    privacy: 'Bu site anonim ziyaret istatistiği tutar; IP adresi ya da kişisel veri saklanmaz.',
  },
  wizard: {
    step1: 'Neye ihtiyacınız var?',
    step2: 'Hangi detayda yardımcı olalım?',
    note: 'Seçiminizden sonra doğrudan WhatsApp sohbeti başlatılacaktır.',
    noteEmail: 'Seçiminizden sonra hazır bir e-posta taslağı açılacaktır.',
    back: 'Geri',
    close: 'Kapat',
    details: {
      website: ['Kurumsal Site', 'E-Ticaret Mağazası', 'Landing Page', 'Özel Web Uygulaması'],
      design: ['Yeni Site Tasarımı', 'Mevcut Siteyi Yeniden Tasarla', 'Marka Uyumlu Arayüz'],
      chatbot: ['WhatsApp Botu', 'Instagram DM Botu', 'Web Sitesi Sohbet Botu'],
      assistant: ['Şirket İçi Bilgi Asistanı', 'Müşteri Hizmetleri Asistanı', 'E-posta ve Teklif Asistanı'],
      booking: ['Online Randevu', 'Müşteri / Öğrenci Takibi', 'Tahsilat Takibi'],
      data: ['Power BI Dashboard', 'SQL Raporlama', 'Excel Otomasyonu'],
      automation: ['n8n İş Akışı', 'CRM / E-posta Entegrasyonu', 'Pazaryeri Veri Çekme'],
      optimization: ['Hız & SEO Optimizasyonu', 'Tasarım Yenileme', 'Yeni Özellik Ekleme'],
    },
    message: {
      greeting: 'Merhaba Serkan Bey, danışmanlık almak istiyorum.',
      service: 'Hizmet',
      detail: 'Detay',
      subject: 'Danışmanlık talebi',
    },
  },
  menu: { open: 'Menüyü aç', close: 'Menüyü kapat' },
};

export default tr;
