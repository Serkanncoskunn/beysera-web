// Türkçe metinler. Yeni metin eklerken aynı anahtarı en.js dosyasına da ekleyin.
const tr = {
  meta: {
    title: 'Beysera | Web, yapay zeka ve otomasyon',
    description: 'İşletmeler için web siteleri, WhatsApp ve Instagram botları, AI asistanlar, randevu sistemleri, veri panoları ve iş akışı otomasyonları.',
  },
  nav: {
    projects: 'Hizmetler',
    process: 'Süreç',
    tech: 'Araçlar',
    faq: 'SSS',
    contact: 'Projenizi anlatın',
    contactMobile: 'Projenizi anlatın',
    language: 'Dil',
  },
  hero: {
    title: 'Web siteleri, yapay zeka botları ve iş otomasyonları.',
    subtitle: 'Beysera işletmeniz için siteyi kurar, müşteri mesajlarını yanıtlayan botu bağlar ve elle yapılan tekrar işleri otomatiğe alır. Projenizi ilk görüşmeden yayına kadar uzman ekibimiz yürütür.',
    ctaProjects: 'Hizmetlere bakın',
    ctaTalk: 'Projenizi anlatın',
    planetHint: 'Gezegenleri basılı tutup fırlatın',
    demo: {
      label: 'Örnek akış',
      title: 'WhatsApp randevu botu',
      channel: 'WhatsApp',
      customer: 'Müşteri',
      bot: 'Bot',
      messages: [
        { from: 'customer', text: 'Merhaba, cumartesi saç kesimi için yer var mı?', time: '21:42' },
        { from: 'bot', text: 'Cumartesi 11:00 ve 14:30 boş. Hangisini ayıralım?', time: '21:42' },
        { from: 'customer', text: '14:30 olsun.', time: '21:43' },
      ],
      events: ['Randevu takvime eklendi', 'Cuma 18:00 için hatırlatma planlandı'],
      result: 'Mesai dışında gelen mesaj, siz telefona bakmadan randevuya dönüştü.',
    },
  },
  services: {
    title: 'Hizmetler',
    subtitle: 'Sekiz alanda çalışıyoruz. Hepsinin hedefi aynı: işinizde elle yapılan ve hataya açık adımları azaltmak.',
    cta: 'Bu hizmeti konuşalım',
    items: {
      website: {
        title: 'Web Sitesi Oluşturma',
        description: 'Kurumsal siteden e-ticaret mağazasına, işinizi anlatan ve satış getiren siteleri sıfırdan kuruyoruz.',
        highlights: ['Kurumsal site ve landing page', 'E-ticaret mağazası', 'SEO ve hız optimizasyonu dahil'],
      },
      design: {
        title: 'Web Tasarım',
        description: 'Markanıza özel, mobilde de düzgün görünen arayüzler.',
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
    title: 'Bir proje nasıl ilerler',
    subtitle: 'İlk mesajdan yayına kadar dört adım.',
    steps: [
      { title: 'Tanışma', desc: 'İşinizi, bugün nasıl yürüdüğünü ve en çok nerede zaman kaybettiğinizi konuşuruz.' },
      { title: 'Plan', desc: 'Neyin yapılacağını ve hangi sırayla teslim edileceğini birlikte netleştiririz.' },
      { title: 'Geliştirme', desc: 'Sistemi kurarız. Ara sürümleri size gösterir, geri bildiriminizle ilerleriz.' },
      { title: 'Yayın', desc: 'Sistemi devreye alırız ve ilk haftalarda nasıl çalıştığını birlikte izleriz.' },
    ],
  },
  skills: {
    title: 'Kullandığımız araçlar',
    subtitle: 'Aracı işe göre seçiyoruz. Web, veri ve yapay zeka aynı elde birleştiği için parçalar birbirine uyumlu çalışır.',
    groups: ['Veri & BI', 'Veri Madenciliği', 'AI & Derin Öğrenme', 'Akıllı Otomasyon', 'Web & E-ticaret', 'Altyapı'],
  },
  faq: {
    title: 'Sık sorulanlar',
    items: [
      {
        q: 'Kiminle çalışacağım?',
        a: 'Projenizi web, yapay zeka ve veri alanlarında çalışan uzman ekibimiz yürütür. Sorularınızı aracı olmadan, işi yapan ekip yanıtlar.',
      },
      {
        q: 'Nasıl başlıyoruz?',
        a: '"Projenizi anlatın" butonundan ihtiyacınızı seçin. Mesajınız WhatsApp ya da Gmail üzerinde hazır yazılmış olarak açılır, göndermeniz yeterli.',
      },
      {
        q: 'Mevcut sitemi elden geçirebilir misiniz?',
        a: 'Evet. Var olan sitenizi hızlandırma, tasarımını yenileme ve yeni özellik ekleme işlerini de yapıyoruz.',
      },
      {
        q: 'Türkçe ve İngilizce çalışıyor musunuz?',
        a: 'Evet. Siteleri, botları ve asistanları iki dilde kurabiliriz. Görüşmeleri de Türkçe ya da İngilizce yapabiliriz.',
      },
      {
        q: 'Bu site hakkımda veri topluyor mu?',
        a: 'Yalnızca anonim ziyaret istatistiği tutulur. IP adresiniz ya da kişisel bir veriniz saklanmaz.',
      },
    ],
  },
  contact: {
    title: 'Projenizi anlatın.',
    subtitle: 'Ne yapmak istediğinizi birkaç tıkla seçin, mesajınız hazır yazılmış olarak açılsın. Mesajınızı uzman ekibimiz inceler ve size dönüş yapar.',
    cta: 'Projenizi anlatın',
    email: 'Gmail',
    book: 'Görüşme planla',
    direct: 'Ya da doğrudan yazın',
  },
  footer: {
    tagline: 'Web, yapay zeka ve otomasyon',
    privacy: 'Bu site anonim ziyaret istatistiği tutar; IP adresi ya da kişisel veri saklanmaz.',
  },
  wizard: {
    step1: 'Neye ihtiyacınız var?',
    step2: 'Hangi detayda yardımcı olalım?',
    step3: 'Size nasıl ulaşalım?',
    note: 'Seçtiğiniz kanalda mesajınız hazır yazılmış olarak açılır.',
    viaWhatsapp: 'WhatsApp ile yaz',
    viaGmail: 'Gmail ile yaz',
    mailApp: 'E-posta uygulaman varsa:',
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
      greeting: 'Merhaba Beysera ekibi, danışmanlık almak istiyorum.',
      service: 'Hizmet',
      detail: 'Detay',
      subject: 'Danışmanlık talebi',
    },
  },
  menu: { open: 'Menüyü aç', close: 'Menüyü kapat' },
};

export default tr;
