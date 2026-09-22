import React, { useState } from 'react';
import { 
  ChevronRight, Award, ShieldCheck, Flame, Leaf, Building2, 
  Download, Maximize2, FileCheck, CheckCircle2, History, Target, Sparkles, Layers, FileText
} from 'lucide-react';
import { REFERENCES } from '../data/references_partners';
import { TRANSLATIONS } from '../data/translations';
import LightboxModal from './LightboxModal';
import CERTIFICATES_DATA from '../data/certificates_db.json';
import { TSE_DOCUMENTS_DATA } from '../data/tse_documents';
import DealershipsSection from './DealershipsSection';

export default function CorporatePage({ lang, onNavigate, onOpenCatalog }) {
  const [activeCertModal, setActiveCertModal] = useState(null);
  const [certCategoryTab, setCertCategoryTab] = useState('all');
  const [activeStoryTab, setActiveStoryTab] = useState('history');
  
  const t = TRANSLATIONS[lang ? lang : 'TR'].corporate;
  const isEn = lang === 'EN';

  const tseCerts = CERTIFICATES_DATA.filter(c => c.category === 'TSE Belgelerimiz');
  const kaliteCerts = CERTIFICATES_DATA.filter(c => c.category !== 'TSE Belgelerimiz');

  const displayedSectionCerts = certCategoryTab === 'all' 
    ? CERTIFICATES_DATA 
    : certCategoryTab === 'tse' 
      ? tseCerts 
      : kaliteCerts;

  return (
    <div className="corporate-page-modern">
      {/* Hero & Banner Header */}
      <section className="corp-hero-banner">
        <div className="container">
          <div className="breadcrumb">
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
              {isEn ? 'Home' : 'Anasayfa'}
            </a>
            <ChevronRight size={14} />
            <span className="current">{isEn ? 'Corporate / About Us' : 'Kurumsal'}</span>
          </div>

          <div className="corp-hero-grid">
            <div className="corp-hero-content">
              <span className="hero-section-tag">
                <Sparkles size={14} className="tag-icon" />
                {t.tag}
              </span>
              <h1 className="corp-hero-title">{t.title}</h1>
              <p className="corp-hero-desc">{t.subtitle}</p>

              <div className="corp-hero-actions">
                <button onClick={onOpenCatalog} className="btn-primary-glow">
                  <Download size={18} />
                  <span>{TRANSLATIONS[lang ? lang : 'TR'].catalog.downloadBtn}</span>
                </button>
              </div>
            </div>

            {/* Quick Stat Counter Cards */}
            <div className="corp-stats-grid">
              <div className="stat-card">
                <span className="stat-num">30+</span>
                <span className="stat-label">{isEn ? 'Years of Experience' : 'Yıllık Sektör Tecrübesi'}</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">680+</span>
                <span className="stat-label">{isEn ? 'Product Models' : 'Özel Ürün Çeşidi'}</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">500+</span>
                <span className="stat-label">{isEn ? 'Completed Projects' : 'Prestijli Referans Proje'}</span>
              </div>
              <div className="stat-card accent">
                <span className="stat-num">{CERTIFICATES_DATA.length}</span>
                <span className="stat-label">{isEn ? 'TSE & Quality Certificates' : 'TSE & Kalite Sertifikası'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Corporate Body */}
      <div className="container page-content">
        {/* Interactive Story & Vision Section */}
        <section className="corp-story-section">
          <div className="story-tabs-bar">
            <button 
              className={`story-tab-btn ${activeStoryTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveStoryTab('history')}
            >
              <History size={16} />
              <span>{isEn ? 'Our History & Experience' : 'Tarihçemiz & Tecrübemiz'}</span>
            </button>
            <button 
              className={`story-tab-btn ${activeStoryTab === 'vision' ? 'active' : ''}`}
              onClick={() => setActiveStoryTab('vision')}
            >
              <Target size={16} />
              <span>{isEn ? 'Vision & Mission' : 'Vizyonumuz & Misyonumuz'}</span>
            </button>
            <button 
              className={`story-tab-btn ${activeStoryTab === 'quality' ? 'active' : ''}`}
              onClick={() => setActiveStoryTab('quality')}
            >
              <ShieldCheck size={16} />
              <span>{isEn ? 'Quality & Standards' : 'Kalite & Sürdürülebilirlik'}</span>
            </button>
          </div>

          <div className="story-card-body">
            <div className="story-text-container">
              {activeStoryTab === 'history' && (
                <div className="tab-pane-content fade-in">
                  <span className="sub-tag">{t.whoWeAre}</span>
                  <h2 className="pane-title">{t.storyTitle}</h2>
                  <p className="story-paragraph">{t.storyP1}</p>
                  <p className="story-paragraph">{t.storyP2}</p>
                </div>
              )}

              {activeStoryTab === 'vision' && (
                <div className="tab-pane-content fade-in">
                  <span className="sub-tag">{isEn ? 'OUR DIRECTION' : 'GELECEĞE MİMARİ DOKUNUŞ'}</span>
                  <h2 className="pane-title">{isEn ? 'Architectural Heritage & Modern Vision' : 'Geleneksel Dokuları Modern Mimaride Yaşatıyoruz'}</h2>
                  <p className="story-paragraph">
                    {isEn 
                      ? 'Our vision is to combine centuries-old brickwork craft with modern engineering standards, offering sustainable, aesthetic, and high-performance architectural cladding solutions worldwide.'
                      : 'Amacımız, yüzyıllardır yapılarımıza karakter katan pişmiş kil ve doğal tuğla kültürünü en modern mühendislik standartlarıyla buluşturmak; tarihi restorasyonlardan çağdaş mimari yapılara kadar zamansız çözümler sunmaktır.'}
                  </p>
                  <p className="story-paragraph">
                    {isEn
                      ? 'We continually innovate our production methods to preserve thermal performance, acoustic insulation, and natural durability in every brick product.'
                      : 'Ürün gruplarımızda yüksek ısı ve ses yalıtımı, doğaya saygılı hammadde kullanımı ve solmayan doğal toprak tonları ile yapılara değer katıyoruz.'}
                  </p>
                </div>
              )}

              {activeStoryTab === 'quality' && (
                <div className="tab-pane-content fade-in">
                  <span className="sub-tag">{isEn ? 'CERTIFIED EXCELLENCE' : 'BELGELİ VE YERLİ ÜRETİM GÜVENCESİ'}</span>
                  <h2 className="pane-title">{isEn ? '100% Certified Building Material Quality' : 'Uluslararası Standartlarda Yüksek Dayanım ve Kalite'}</h2>
                  <p className="story-paragraph">
                    {isEn
                      ? `All products are manufactured under rigorous quality control guidelines. We hold ${CERTIFICATES_DATA.length} TSE & ISO quality management certifications.`
                      : `Üretim süreçlerimizin tamamı Türk Standartları Enstitüsü (TSE) şartnamelerine, ISO 9001 Kalite Yönetim Sistemi ve CE standartlarına uygun olarak belgelendirilmiştir (${CERTIFICATES_DATA.length} Adet Aktif Kalite Belgesi).`}
                  </p>
                  <p className="story-paragraph">
                    {isEn
                      ? 'From adhesives and grouts to antique facing bricks and cultured bricks, every product undergoes laboratory resistance testing.'
                      : 'Harç, derz dolgusu, kaplama ve pres tuğlalarımızın her biri laboratuvar ortamında donma-çözülme, su emme ve darbe direnci testlerinden başarıyla geçmektedir.'}
                  </p>
                </div>
              )}

              {/* Core Strengths Grid */}
              <div className="corp-values-modern-grid">
                <div className="value-box">
                  <div className="val-icon-wrap"><ShieldCheck size={22} /></div>
                  <div>
                    <h4>{t.val1Title}</h4>
                    <p>{t.val1Desc}</p>
                  </div>
                </div>
                <div className="value-box">
                  <div className="val-icon-wrap"><Leaf size={22} /></div>
                  <div>
                    <h4>{t.val2Title}</h4>
                    <p>{t.val2Desc}</p>
                  </div>
                </div>
                <div className="value-box">
                  <div className="val-icon-wrap"><Flame size={22} /></div>
                  <div>
                    <h4>{t.val3Title}</h4>
                    <p>{t.val3Desc}</p>
                  </div>
                </div>
                <div className="value-box">
                  <div className="val-icon-wrap"><Award size={22} /></div>
                  <div>
                    <h4>{t.val4Title}</h4>
                    <p>{t.val4Desc}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="story-visual-container">
              <img
                src="/images/project_galata_restoration.png"
                alt="Tuğla Dünyası Kurumsal"
                className="story-visual-img"
              />
              <div className="visual-floating-badge">
                <Layers size={24} className="badge-icon" />
                <div>
                  <span className="badge-big-num">30+</span>
                  <span className="badge-text">{t.badgeText}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dedicated Section: DYNAMIC TSE & KALİTE SERTİFİKALARI */}
        <section className="tse-certificates-section">
          <div className="section-header-center">
            <span className="hero-section-tag" style={{ color: 'var(--accent-terracotta)', display: 'inline-flex' }}>
              <Award size={14} className="tag-icon" />
              {isEn ? 'CERTIFICATES & QUALITY STANDARDS' : 'TSE BELGELERİMİZ VE KALİTE SERTİFİKALARIMIZ'}
            </span>
            <h2 className="section-title">
              {isEn ? `${tseCerts.length} TSE Certificates & ${kaliteCerts.length} Quality Standards Documentation` : `${tseCerts.length} TSE Belgemiz ve ${kaliteCerts.length} Kalite Sertifikamız`}
            </h2>
            <p className="section-subtitle">
              {isEn
                ? 'All our facing bricks, brick slips, adhesives, grouts, and architectural products comply with TSE, ISO 9001:2015, ISO 45001:2018, and CE standards.'
                : 'Tüm pres tuğla, kaplama tuğlası, yapıştırıcı, derz dolgu ve mimari ürünlerimiz Türk Standartları Enstitüsü (TSE), ISO 9001:2015 Kalite Yönetim Sistemi, ISO 45001 ve CE standartlarına tam uygundur.'}
            </p>

            {/* Category Filter Tabs */}
            <div className="cert-filter-tabs">
              <button 
                className={`filter-tab-btn ${certCategoryTab === 'all' ? 'active' : ''}`}
                onClick={() => setCertCategoryTab('all')}
              >
                <CheckCircle2 size={16} />
                <span>{isEn ? `All Certificates (${CERTIFICATES_DATA.length} Documents)` : `Tüm Belgelerimiz (${CERTIFICATES_DATA.length} Adet)`}</span>
              </button>
              <button 
                className={`filter-tab-btn ${certCategoryTab === 'tse' ? 'active' : ''}`}
                onClick={() => setCertCategoryTab('tse')}
              >
                <Award size={16} />
                <span>{isEn ? `${tseCerts.length} TSE Certificates` : `${tseCerts.length} TSE Belgelerimiz`}</span>
              </button>
              <button 
                className={`filter-tab-btn ${certCategoryTab === 'kalite' ? 'active' : ''}`}
                onClick={() => setCertCategoryTab('kalite')}
              >
                <FileCheck size={16} />
                <span>{isEn ? `${kaliteCerts.length} Quality Certificates` : `${kaliteCerts.length} Kalite Sertifikalarımız`}</span>
              </button>
            </div>
          </div>

          {/* Certificate Cards Grid */}
          <div className="certs-full-grid">
            {displayedSectionCerts.map((cert) => (
              <div key={cert.id} className="cert-card-full" onClick={() => setActiveCertModal(cert)}>
                <div className="cert-card-img-wrapper">
                  <img src={cert.thumb} alt={cert.title} className="cert-card-img" />
                  <div className="cert-zoom-overlay">
                    <Maximize2 size={20} />
                    <span>{isEn ? 'View Certificate' : 'Belgeyi Büyüt'}</span>
                  </div>
                  <span className="cert-badge-tag">{cert.category}</span>
                </div>
                <div className="cert-card-info">
                  {cert.category === 'TSE Belgelerimiz' ? (
                    <Award size={18} className="cert-icon" />
                  ) : (
                    <FileCheck size={18} className="cert-icon" />
                  )}
                  <h4 className="cert-card-title">{cert.title}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Dedicated Section: RESMİ TEKNİK ŞARTNAMELER VE TSE DOKÜMANLARI */}
          <div className="tse-specs-download-block">
            <div className="tse-specs-header">
              <div className="tse-specs-badge-box">
                <FileText size={16} className="tag-icon" />
                <span>{isEn ? 'OFFICIAL TSE TECHNICAL SPECIFICATIONS' : 'RESMİ TSE TEKNİK ŞARTNAMELERİ VE UYGULAMA DOKÜMANLARI'}</span>
              </div>
              <h3 className="tse-specs-title">
                {isEn ? 'Download TSE Specification Documents & Technical Guidelines' : 'TSE Teknik Şartnameleri ve Uygulama Kılavuzları'}
              </h3>
              <p className="tse-specs-desc">
                {isEn 
                  ? 'Official architectural specification PDFs and technical application criteria approved according to Turkish Standards (TSE) guidelines.' 
                  : 'Resmi yapı denetim ve proje onay süreçlerine uygun olarak hazırlanmış TSE standartlarındaki mimari teknik şartname ve uygulama dokümanlarını PDF formatında indirebilirsiniz.'}
              </p>
            </div>

            <div className="tse-specs-grid">
              {TSE_DOCUMENTS_DATA.map((doc) => (
                <div key={doc.id} className="tse-spec-card">
                  <a 
                    href={doc.pdfUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="tse-spec-img-link"
                    title={isEn ? "Click to Open PDF Document" : "PDF Dokümanını Açmak İçin Tıklayın"}
                  >
                    <div className="tse-spec-cover-wrap">
                      <img 
                        src={doc.coverImage} 
                        alt={doc.title} 
                        className="tse-spec-cover-img" 
                      />
                      <div className="tse-spec-cover-overlay">
                        <FileText size={28} />
                        <span>{isEn ? 'View Full PDF Document' : 'PDF Dokümanını İncele'}</span>
                      </div>
                      <span className="tse-spec-code-tag">{doc.standard}</span>
                    </div>
                  </a>

                  <div className="tse-spec-card-body">
                    <h4 className="tse-spec-name">{isEn ? (doc.titleEn || doc.title) : doc.title}</h4>
                    <p className="tse-spec-info">{isEn ? (doc.descriptionEn || doc.description) : doc.description}</p>
                    <div className="tse-spec-meta-row">
                      <span>{doc.pages}</span>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                      <span>•</span>
                      <span>{doc.badge}</span>
                    </div>
                    <a 
                      href={doc.pdfUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="tse-spec-btn"
                    >
                      <Download size={15} />
                      <span>{isEn ? 'Download PDF Specification' : 'Şartnameyi İndir (PDF)'}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dealerships Section */}
        <DealershipsSection lang={lang} />

        {/* References Section */}
        <section className="references-section">
          <div className="section-header">
            <span className="hero-section-tag" style={{ color: 'var(--accent-terracotta)', display: 'inline-flex' }}>
              <Building2 size={14} className="tag-icon" />
              {t.refTag}
            </span>
            <h2 className="section-title">{t.refTitle}</h2>
            <p className="section-subtitle">{t.refSub}</p>
          </div>

          <div className="references-grid">
            {REFERENCES.map((ref, idx) => (
              <div key={idx} className="ref-card">
                <Building2 size={16} className="ref-icon" />
                <div>
                  <h4 className="ref-name">{ref.name}</h4>
                  <span className="ref-cat">{isEn ? (ref.categoryEn || ref.category) : ref.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Lightbox Zoom Modal for Individual Certificates */}
      {activeCertModal && (
        <LightboxModal
          imageSrc={activeCertModal.image || activeCertModal.thumb}
          title={activeCertModal.title}
          pdfUrl={activeCertModal.pdfUrl}
          onClose={() => setActiveCertModal(null)}
        />
      )}

      <style>{`
        .corporate-page-modern {
          background-color: var(--bg-primary);
          padding-bottom: 100px;
        }

        /* Hero Banner */
        .corp-hero-banner {
          background: linear-gradient(135deg, #1A1816 0%, #2A2521 100%);
          color: #FFFFFF;
          padding: 60px 0 80px 0;
          border-bottom: 1px solid var(--border-dark);
          position: relative;
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--text-light-muted);
          margin-bottom: 24px;
        }
        .breadcrumb a {
          color: var(--text-light-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .breadcrumb a:hover {
          color: #FFFFFF;
        }
        .breadcrumb .current {
          color: var(--accent-clay);
          font-weight: 600;
        }
        .corp-hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 50px;
          align-items: center;
        }
        .hero-section-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent-clay);
          margin-bottom: 10px;
        }
        .corp-hero-title {
          font-size: 3.4rem;
          line-height: 1.1;
          color: #FFFFFF;
          margin-bottom: 16px;
        }
        .corp-hero-desc {
          font-size: 1.1rem;
          color: var(--text-light-muted);
          line-height: 1.65;
          margin-bottom: 30px;
          max-width: 620px;
        }
        .btn-primary-glow {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
          border: 1px solid var(--accent-terracotta);
          padding: 14px 28px;
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(184, 91, 53, 0.4);
        }
        .btn-primary-glow:hover {
          background-color: var(--accent-clay);
          border-color: var(--accent-clay);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(184, 91, 53, 0.55);
        }

        /* Stat Counter Cards */
        .corp-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .stat-card {
          background-color: var(--bg-dark-surface);
          border: 1px solid var(--border-dark);
          padding: 24px 20px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: border-color 0.3s ease;
        }
        .stat-card:hover {
          border-color: var(--accent-terracotta);
        }
        .stat-card.accent {
          border-left: 4px solid var(--accent-terracotta);
        }
        .stat-num {
          font-size: 2.6rem;
          font-weight: 800;
          color: var(--accent-clay);
          line-height: 1;
        }
        .stat-label {
          font-size: 0.82rem;
          color: var(--text-light-muted);
          font-weight: 500;
          line-height: 1.3;
        }

        .page-content {
          padding-top: 60px;
        }

        /* Story Section */
        .corp-story-section {
          margin-bottom: 90px;
        }
        .story-tabs-bar {
          display: flex;
          gap: 12px;
          border-bottom: 2px solid var(--border-light);
          margin-bottom: 36px;
          flex-wrap: wrap;
        }
        .story-tab-btn {
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          padding: 12px 20px;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.25s ease;
          margin-bottom: -2px;
        }
        .story-tab-btn:hover {
          color: var(--text-main);
        }
        .story-tab-btn.active {
          color: var(--accent-terracotta);
          border-bottom-color: var(--accent-terracotta);
        }
        .story-card-body {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 50px;
          align-items: flex-start;
        }
        .tab-pane-content {
          margin-bottom: 32px;
        }
        .sub-tag {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--accent-terracotta);
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }
        .pane-title {
          font-size: 2.2rem;
          line-height: 1.2;
          color: var(--text-main);
          margin-bottom: 18px;
        }
        .story-paragraph {
          font-size: 1.02rem;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 16px;
        }

        /* Core Strengths Grid */
        .corp-values-modern-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 28px;
        }
        .value-box {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 20px;
          display: flex;
          gap: 16px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        .value-box:hover {
          border-color: var(--accent-terracotta);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          transform: translateY(-2px);
        }
        .val-icon-wrap {
          color: var(--accent-terracotta);
          flex-shrink: 0;
          background-color: #FAF2EE;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }
        .value-box h4 {
          font-size: 1.05rem;
          margin-bottom: 4px;
          color: var(--text-main);
        }
        .value-box p {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.45;
        }

        .story-visual-container {
          position: relative;
        }
        .story-visual-img {
          width: 100%;
          height: 520px;
          object-fit: cover;
          border: 1px solid var(--border-light);
          border-radius: 4px;
        }
        .visual-floating-badge {
          position: absolute;
          bottom: 24px;
          left: 24px;
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 14px 30px rgba(0,0,0,0.25);
          border-radius: 4px;
        }
        .badge-big-num {
          font-size: 2.6rem;
          font-weight: 800;
          line-height: 1;
          display: block;
        }
        .badge-text {
          font-size: 0.85rem;
          font-weight: 600;
          line-height: 1.3;
        }

        /* Certificate Section */
        .tse-specs-download-block {
          margin-top: 60px;
          background: linear-gradient(135deg, #1C1917 0%, #292524 100%);
          border: 1px solid rgba(184, 90, 58, 0.3);
          border-radius: 12px;
          padding: 40px;
          position: relative;
          overflow: hidden;
        }
        .tse-specs-download-block::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--accent-clay, #B85A3A), var(--accent-terracotta, #E07A5F));
        }
        .tse-specs-header {
          margin-bottom: 32px;
        }
        .tse-specs-badge-box {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--accent-terracotta, #E07A5F);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .tse-specs-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 8px;
        }
        .tse-specs-desc {
          color: var(--text-light-muted, #A8A29E);
          font-size: 0.92rem;
          max-width: 800px;
          line-height: 1.6;
        }
        .tse-specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }
        .tse-spec-card {
          background-color: #24201D;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.35s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }
        .tse-spec-card:hover {
          border-color: var(--accent-clay, #B85A3A);
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
        }
        .tse-spec-img-link {
          display: block;
          position: relative;
          text-decoration: none;
          background-color: #161413;
          overflow: hidden;
        }
        .tse-spec-cover-wrap {
          position: relative;
          width: 100%;
          height: 280px;
          background: radial-gradient(circle at center, #2b2724 0%, #151312 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .tse-spec-cover-img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 4px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.65), 0 2px 8px rgba(0,0,0,0.4);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .tse-spec-card:hover .tse-spec-cover-img {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(184, 90, 58, 0.25);
        }
        .tse-spec-cover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(18, 16, 15, 0.7);
          backdrop-filter: blur(2px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #FFFFFF;
          font-size: 0.85rem;
          font-weight: 600;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
        }
        .tse-spec-img-link:hover .tse-spec-cover-overlay {
          opacity: 1;
        }
        .tse-spec-cover-wrap .tse-spec-code-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 3;
        }
        .tse-spec-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .tse-spec-card:hover {
          background-color: rgba(255, 255, 255, 0.07);
          border-color: var(--accent-clay, #B85A3A);
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
        }
        .tse-spec-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .tse-spec-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: rgba(184, 90, 58, 0.15);
          color: var(--accent-terracotta, #E07A5F);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tse-spec-code-tag {
          background-color: rgba(227, 6, 19, 0.15);
          border: 1px solid rgba(227, 6, 19, 0.4);
          color: #FF6B6B;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }
        .tse-spec-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .tse-spec-info {
          font-size: 0.85rem;
          color: var(--text-light-muted, #A8A29E);
          line-height: 1.5;
          margin-bottom: 16px;
          flex-grow: 1;
        }
        .tse-spec-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: #78716C;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .tse-spec-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--accent-clay, #B85A3A) 0%, #9C4528 100%);
          color: #FFFFFF;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .tse-spec-btn:hover {
          background: linear-gradient(135deg, #D36C47 0%, var(--accent-clay, #B85A3A) 100%);
          box-shadow: 0 4px 12px rgba(184, 90, 58, 0.35);
        }
        .tse-certificates-section {
          margin-bottom: 90px;
          padding-top: 20px;
        }
        .section-header-center {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 36px auto;
        }
        .cert-filter-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        .filter-tab-btn {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          color: var(--text-main);
          padding: 10px 20px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 4px;
          transition: all 0.25s ease;
        }
        .filter-tab-btn.active {
          background-color: var(--accent-terracotta);
          border-color: var(--accent-terracotta);
          color: #FFFFFF;
        }
        .certs-full-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
          margin-top: 28px;
        }
        .cert-card-full {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          overflow: hidden;
          cursor: pointer;
          transition: var(--transition-smooth);
          display: flex;
          flex-direction: column;
          border-radius: 4px;
        }
        .cert-card-full:hover {
          border-color: var(--accent-terracotta);
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(0,0,0,0.08);
        }
        .cert-card-img-wrapper {
          position: relative;
          width: 100%;
          height: 340px;
          background-color: #FAF8F5;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid var(--border-light);
        }
        .cert-card-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 12px;
          transition: transform 0.4s ease;
        }
        .cert-card-full:hover .cert-card-img {
          transform: scale(1.05);
        }
        .cert-badge-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: var(--bg-dark);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 3px;
        }
        .cert-zoom-overlay {
          position: absolute;
          inset: 0;
          background: rgba(184, 91, 53, 0.85);
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .cert-card-full:hover .cert-zoom-overlay {
          opacity: 1;
        }
        .cert-title-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 8px;
        }

        .cert-pdf-badge-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(184, 90, 58, 0.1);
          border: 1px solid var(--accent-clay, #B85A3A);
          color: var(--accent-clay, #B85A3A);
          padding: 5px 12px;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          width: fit-content;
        }

        .cert-pdf-badge-btn:hover {
          background-color: var(--accent-clay, #B85A3A);
          color: #FFFFFF;
          transform: translateY(-1px);
        }
        .cert-card-info {
          padding: 18px 20px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .cert-icon {
          color: var(--accent-terracotta);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .cert-card-title {
          font-size: 0.92rem;
          color: var(--text-main);
          line-height: 1.35;
        }
        .references-section {
          margin-bottom: 40px;
        }
        .references-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
          margin-top: 32px;
        }
        .ref-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 4px;
        }
        .ref-icon {
          color: var(--accent-terracotta);
          flex-shrink: 0;
        }
        .ref-name {
          font-size: 0.92rem;
          font-weight: 600;
          line-height: 1.3;
        }
        .ref-cat {
          font-size: 0.78rem;
          color: var(--text-muted);
          display: block;
        }

        .fade-in {
          animation: fadeIn 0.35s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 992px) {
          .corp-hero-grid, .story-card-body { grid-template-columns: 1fr; }
          .corp-hero-title { font-size: 2.6rem; }
          .corp-values-modern-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
