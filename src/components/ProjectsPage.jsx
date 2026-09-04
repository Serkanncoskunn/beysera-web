import React, { useState } from 'react';
import { 
  ChevronRight, Play, Maximize2, Building2, MapPin, Calendar, 
  ArrowRight, Video, Layers, ShieldCheck, Filter, User, CheckCircle2, MessageSquare, Phone
} from 'lucide-react';
import { PROJECTS, PROJECT_VIDEOS, PROJECT_CATEGORIES_TR, PROJECT_CATEGORIES_EN } from '../data/projects';
import { TRANSLATIONS } from '../data/translations';
import LightboxModal from './LightboxModal';

export default function ProjectsPage({ lang, onSelectProject, onNavigate, onOpenQuoteModal }) {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [activeProjectDetail, setActiveProjectDetail] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const currentLang = lang || 'TR';
  const isEn = currentLang === 'EN';
  const t = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang].projects) ? TRANSLATIONS[currentLang].projects : {};

  const safeProjects = Array.isArray(PROJECTS) ? PROJECTS : [];
  const safeVideos = Array.isArray(PROJECT_VIDEOS) ? PROJECT_VIDEOS : [];

  // Category counts map
  const categoryCounts = {
    'Tümü': safeProjects.length,
    'All': safeProjects.length
  };
  safeProjects.forEach((p) => {
    if (p && p.category) {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    }
    if (p && p.categoryEn) {
      categoryCounts[p.categoryEn] = (categoryCounts[p.categoryEn] || 0) + 1;
    }
  });

  const categoriesList = isEn ? (PROJECT_CATEGORIES_EN || []) : (PROJECT_CATEGORIES_TR || []);

  const filteredProjects = safeProjects.filter((proj) => {
    if (!proj) return false;
    const projCat = isEn ? (proj.categoryEn || proj.category) : proj.category;
    return selectedCategory === 'Tümü' || selectedCategory === 'All' ||
      projCat === selectedCategory || proj.category === selectedCategory;
  });

  const featuredProject = safeProjects[0] || null;

  return (
    <div className="projects-page-premium">
      {/* 1. Hero Editorial Header */}
      <div className="editorial-hero-header">
        <div className="hero-grid-overlay" />
        <div className="container hero-content-inner">
          <div className="breadcrumb">
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('home'); }}>
              {isEn ? 'Home' : 'Anasayfa'}
            </a>
            <ChevronRight size={14} />
            <span className="current">{isEn ? 'Architectural Portfolio' : 'Mimari Portföy & Şantiye İşleri'}</span>
          </div>

          <div className="hero-main-flex">
            <div className="hero-text-col">
              <span className="hero-tag-badge">
                <Building2 size={14} />
                {isEn ? 'CURATED ARCHITECTURAL PORTFOLIO' : 'SEÇKİN MİMARİ UYGULAMA DOKÜMANTASYONU'}
              </span>
              <h1 className="hero-title">
                {isEn ? 'Architectural Masterpieces & Site Works' : 'Mimari Referanslar ve Tuğla Uygulamaları'}
              </h1>
              <p className="hero-subtitle">
                {isEn 
                  ? 'Discover prestigious luxury villas, historical restorations, and commercial landmark projects featuring Tuğla Dünyası authentic handmade bricks and vitrified klinker systems.'
                  : 'Tuğla Dünyası fırınlanmış el yapımı antik tuğlaları, klinker pres sistemleri ve doğayla barışık kaplamalarıyla yükselen prestijli konut, otel ve restorasyon projelerimiz.'}
              </p>

              {/* Stats Bar */}
              <div className="hero-stats-row">
                <div className="stat-pill">
                  <strong>500+</strong>
                  <span>{isEn ? 'Completed Projects' : 'Tamamlanan Proje'}</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-pill">
                  <strong>{safeProjects.length}</strong>
                  <span>{isEn ? 'Featured References' : 'Özel Referans'}</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-pill">
                  <strong>{safeVideos.length}</strong>
                  <span>{isEn ? 'Site Videos' : 'Şantiye Videosu'}</span>
                </div>
              </div>
            </div>

            {/* Featured Spotlight Card */}
            {featuredProject && (
              <div className="featured-spotlight-card" onClick={() => setActiveProjectDetail(featuredProject)}>
                <div className="spotlight-badge">
                  <Building2 size={12} />
                  <span>{isEn ? 'SPOTLIGHT PROJECT' : 'ÖNE ÇIKAN MİMARİ PROJE'}</span>
                </div>
                <img 
                  src={featuredProject.mainImage || '/images/product_placeholder.png'} 
                  alt={featuredProject.title || 'Spotlight Project'} 
                  className="spotlight-img" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/product_placeholder.png';
                  }}
                />
                <div className="spotlight-overlay">
                  <span className="spotlight-cat">{featuredProject.category}</span>
                  <h3 className="spotlight-title">{featuredProject.title}</h3>
                  {featuredProject.location && (
                    <span className="spotlight-loc"><MapPin size={13} /> {featuredProject.location}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Video Showcase Lounge (15-20s Short Videos) */}
      {safeVideos.length > 0 && (
        <div className="video-lounge-section">
          <div className="container">
            <div className="section-head-bar">
              <div className="section-head-info">
                <div className="section-badge-pill gold">
                  <Video size={15} />
                  <span>{isEn ? 'SITE & APPLICATION VIDEOS' : 'ŞANTİYE VİDEO SERİSİ (15-20 SN)'}</span>
                </div>
                <h2 className="section-title-large">
                  {isEn ? 'Craftsmanship & Construction Video Highlights' : 'Usta İşçiliği & Şantiye İnceleme Videoları'}
                </h2>
                <p className="section-title-desc">
                  {isEn 
                    ? 'Short video highlights demonstrating bricklaying, klinker wall cladding, and traditional grout craftsmanship in real site projects.'
                    : 'Tuğla örme, klinker kaplama, derz dolgu ve restorasyon işçiliğini canlı şantiye ortamında sergileyen 15-20 saniyelik videolarımız.'}
                </p>
              </div>
            </div>

            <div className="video-cards-wrapper">
              {safeVideos.map((vid) => (
                <div key={vid.id || vid.filename} className="video-card-premium">
                  <div className="video-thumb-container">
                    <video 
                      src={vid.videoUrl} 
                      className="video-preview-player"
                      muted 
                      loop 
                      playsInline
                      preload="metadata"
                      onMouseOver={(e) => { try { e.target.play(); } catch(err){} }}
                      onMouseOut={(e) => { try { e.target.pause(); e.target.currentTime = 0; } catch(err){} }}
                    />
                    <div className="video-card-glass-overlay">
                      <span className="duration-chip">{vid.duration || '0:18'}</span>
                      <button 
                        className="play-pulse-btn"
                        onClick={() => setActiveVideoModal(vid)}
                        title={isEn ? 'Watch Video' : 'Videoyu İzle'}
                      >
                        <Play size={22} className="play-svg" />
                      </button>
                    </div>
                  </div>
                  <div className="video-card-meta">
                    {vid.category && <span className="vid-cat">{isEn ? (vid.categoryEn || vid.category) : vid.category}</span>}
                    <h3 className="vid-heading">{isEn ? (vid.titleEn || vid.title) : vid.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Project Portfolio Grid */}
      <div className="portfolio-gallery-section">
        <div className="container">
          <div className="section-head-bar flex-between">
            <div>
              <div className="section-badge-pill gold">
                <Building2 size={15} />
                <span>{isEn ? 'REFERENCED PORTFOLIO' : 'TAMAMLANAN MIMARİ PROJELERİ'}</span>
              </div>
              <h2 className="section-title-large">
                {isEn ? 'Architectural References & Case Studies' : 'Seçkin Proje Portföyü ve Referanslar'}
              </h2>
            </div>
          </div>

          {/* Projects Adaptive Grid */}
          <div className="portfolio-grid-adaptive">
            {filteredProjects.map((project) => (
              <div key={project.id || project.title} className="portfolio-item-card">
                <div className="portfolio-card-img-box" onClick={() => setActiveProjectDetail(project)}>
                  <img 
                    src={project.mainImage || '/images/product_placeholder.png'} 
                    alt={isEn ? (project.titleEn || project.title) : project.title} 
                    className="portfolio-card-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/product_placeholder.png';
                    }}
                  />
                  <div className="portfolio-card-glass-hover">
                    <button className="view-detail-btn">
                      <Maximize2 size={16} />
                      <span>{isEn ? 'Inspect Project' : 'Projeyi İncele'}</span>
                    </button>
                  </div>
                  <div className="portfolio-category-tag">
                    {isEn ? (project.categoryEn || project.category) : project.category}
                  </div>
                </div>

                <div className="portfolio-card-body">
                  <div className="portfolio-meta-tags">
                    {project.location && <span className="meta-tag"><MapPin size={13} /> {project.location}</span>}
                    {project.year && <span className="meta-tag"><Calendar size={13} /> {project.year}</span>}
                  </div>
                  <h3 className="portfolio-card-title">{isEn ? (project.titleEn || project.title) : project.title}</h3>
                  
                  {project.architect && (
                    <div className="architect-row">
                      <User size={13} className="arch-icon" />
                      <span>{project.architect}</span>
                    </div>
                  )}

                  <div className="card-footer-action">
                    <button 
                      className="btn-card-inspect"
                      onClick={() => setActiveProjectDetail(project)}
                    >
                      <span>{isEn ? 'View Case Study' : 'Proje Detayları & Görseller'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Architectural Consultation & Sample Request Banner */}
      <div className="architectural-cta-banner">
        <div className="container">
          <div className="cta-banner-card">
            <div className="cta-text-content">
              <span className="cta-subtitle-tag">{isEn ? 'ARCHITECTURAL CONSULTATION' : 'MİMARİ PROJE DANIŞMANLIĞI'}</span>
              <h2 className="cta-main-heading">
                {isEn ? 'Planning a New Facade or Restoration Project?' : 'Projeniz İçin Özel Tuğla Çözümleri ve Numune Talebi'}
              </h2>
              <p className="cta-sub-paragraph">
                {isEn 
                  ? 'Send your blueprints or project specifications to our technical architectural team. Receive custom size, texture, and physical sample support.'
                  : 'Proje paftalarınızı veya detaylarınızı teknik mimari ekibimize iletin; özel harman doku, numune ve fiyat teklifi desteği alın.'}
              </p>
            </div>
            <div className="cta-btn-duo">
              <button 
                className="btn-cta-gold"
                onClick={() => onOpenQuoteModal && onOpenQuoteModal({ stokKodu: 'PROJE-TALEP', stokAdi: 'Proje Özel Teklif & Numune Talebi' })}
              >
                <MessageSquare size={18} />
                <span>{isEn ? 'Request Sample or Project Quote' : 'Numune veya Proje Talebinde Bulun'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Fullscreen Player Modal */}
      {activeVideoModal && (
        <div className="video-modal-backdrop" onClick={() => setActiveVideoModal(null)}>
          <div className="video-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-x" onClick={() => setActiveVideoModal(null)}>×</button>
            <div className="video-dialog-header">
              {activeVideoModal.category && <span className="dialog-cat">{isEn ? activeVideoModal.categoryEn : activeVideoModal.category}</span>}
              <h3 className="dialog-title">{isEn ? activeVideoModal.titleEn : activeVideoModal.title}</h3>
            </div>
            <div className="video-dialog-player">
              <video 
                src={activeVideoModal.videoUrl} 
                controls 
                autoPlay 
                className="modal-video-element"
              />
            </div>
          </div>
        </div>
      )}

      {/* Project Case Study Detail Dossier Modal */}
      {activeProjectDetail && (
        <div className="project-dossier-backdrop" onClick={() => setActiveProjectDetail(null)}>
          <div className="project-dossier-modal" onClick={(e) => e.stopPropagation()}>
            <button className="dossier-close-btn" onClick={() => setActiveProjectDetail(null)}>×</button>

            <div className="dossier-header-bar">
              <span className="dossier-cat">{isEn ? (activeProjectDetail.categoryEn || activeProjectDetail.category) : activeProjectDetail.category}</span>
              <h2 className="dossier-title">{isEn ? (activeProjectDetail.titleEn || activeProjectDetail.title) : activeProjectDetail.title}</h2>
              <div className="dossier-meta-row">
                {activeProjectDetail.location && <span><MapPin size={14} /> {activeProjectDetail.location}</span>}
                {activeProjectDetail.year && <span><Calendar size={14} /> {activeProjectDetail.year}</span>}
                {activeProjectDetail.architect && <span><User size={14} /> {activeProjectDetail.architect}</span>}
              </div>
            </div>

            <div className="dossier-body-grid">
              <div className="dossier-gallery-col">
                <div 
                  className="dossier-main-img-box" 
                  onClick={() => setLightboxImage(activeProjectDetail.mainImage)}
                >
                  <img 
                    src={activeProjectDetail.mainImage || '/images/product_placeholder.png'} 
                    alt={activeProjectDetail.title} 
                    className="dossier-main-img" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/product_placeholder.png';
                    }}
                  />
                  <button className="zoom-hint-btn">
                    <Maximize2 size={16} />
                    <span>{isEn ? 'Full Screen' : 'Tam Ekran Gör'}</span>
                  </button>
                </div>
              </div>

              <div className="dossier-info-col">
                <div className="dossier-highlights-card">
                  <h4 className="card-subtitle">{isEn ? 'PROJECT SPECIFICATIONS' : 'MİMARİ DETAYLAR'}</h4>
                  <div className="spec-row-item">
                    <CheckCircle2 size={16} className="spec-check" />
                    <span>{isEn ? 'Material: 100% Fired Natural Clay Facing Bricks' : 'Malzeme: %100 Fırınlanmış Doğal Kil Kaplama Tuğlası'}</span>
                  </div>
                  <div className="spec-row-item">
                    <CheckCircle2 size={16} className="spec-check" />
                    <span>{isEn ? 'Weather Resistance: F2 Extreme Frost & Heat Resistant' : 'İklim Dayanımı: F2 Tam Don ve Ağır Hava Direnci'}</span>
                  </div>
                  <div className="spec-row-item">
                    <CheckCircle2 size={16} className="spec-check" />
                    <span>{isEn ? 'Maintenance: Zero Paint, Lifetime Natural Color Fading Resistance' : 'Bakım: Sıfır Boya, Ömür Boyu Solmaz Yüzey'}</span>
                  </div>
                </div>

                <div className="dossier-cta-row">
                  <button 
                    className="btn-dossier-cta"
                    onClick={() => {
                      const projTitle = activeProjectDetail.title;
                      setActiveProjectDetail(null);
                      onOpenQuoteModal && onOpenQuoteModal({ stokKodu: 'REFERANS-PROJE', stokAdi: `Proje Referansı: ${projTitle}` });
                    }}
                  >
                    <MessageSquare size={18} />
                    <span>{isEn ? 'Inquire About Similar Project' : 'Benzer Proje İçin Teklif Al'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox for dossier images */}
      {lightboxImage && (
        <LightboxModal 
          isOpen={!!lightboxImage}
          image={lightboxImage}
          alt="Project Photo"
          onClose={() => setLightboxImage(null)}
        />
      )}

      <style>{`
        .projects-page-premium {
          background-color: var(--bg-primary);
          min-height: 80vh;
          padding-bottom: 120px;
        }

        /* Hero Editorial Header */
        .editorial-hero-header {
          position: relative;
          background-color: var(--bg-dark);
          color: #FFFFFF;
          padding: 60px 0 80px 0;
          border-bottom: 1px solid var(--border-dark);
          overflow: hidden;
        }
        .hero-grid-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(214, 154, 104, 0.12) 1px, transparent 1px);
          background-size: 32px 32px;
          opacity: 0.6;
          pointer-events: none;
        }
        .hero-content-inner {
          position: relative;
          z-index: 2;
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
          color: var(--accent-terracotta);
          font-weight: 600;
        }
        .hero-main-flex {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 48px;
          align-items: center;
        }
        .hero-tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(214, 154, 104, 0.15);
          border: 1px solid rgba(214, 154, 104, 0.3);
          color: var(--accent-terracotta);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          padding: 6px 14px;
          border-radius: 4px;
          margin-bottom: 16px;
        }
        .hero-title {
          font-size: 3.4rem;
          line-height: 1.1;
          color: #FFFFFF;
          margin-bottom: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-light-muted);
          line-height: 1.65;
          margin-bottom: 32px;
        }
        .hero-stats-row {
          display: flex;
          align-items: center;
          gap: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px 24px;
          border-radius: 6px;
          width: fit-content;
        }
        .stat-pill {
          display: flex;
          flex-direction: column;
        }
        .stat-pill strong {
          font-size: 1.6rem;
          color: var(--accent-terracotta);
          font-weight: 800;
          line-height: 1;
        }
        .stat-pill span {
          font-size: 0.78rem;
          color: var(--text-light-muted);
          margin-top: 4px;
        }
        .stat-divider {
          width: 1px;
          height: 32px;
          background: rgba(255, 255, 255, 0.15);
        }

        .featured-spotlight-card {
          position: relative;
          height: 320px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
          transition: transform 0.4s ease;
        }
        .featured-spotlight-card:hover {
          transform: translateY(-4px) scale(1.02);
        }
        .spotlight-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: var(--accent-clay);
          color: #FFF;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 4px 10px;
          border-radius: 4px;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .spotlight-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background-color: #121110;
          transition: transform 0.6s ease;
        }
        .featured-spotlight-card:hover .spotlight-img {
          transform: scale(1.08);
        }
        .spotlight-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 20%, rgba(0,0,0,0.85) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px;
          color: #FFF;
        }
        .spotlight-cat {
          font-size: 0.75rem;
          color: var(--accent-terracotta);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
        }
        .spotlight-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 4px;
          margin-bottom: 4px;
        }
        .spotlight-loc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.75);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Section Styling */
        .video-lounge-section {
          padding: 80px 0 60px 0;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-light);
        }
        .section-head-bar {
          margin-bottom: 36px;
        }
        .section-head-bar.flex-between {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .section-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          padding: 4px 12px;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        .section-badge-pill.gold {
          background-color: rgba(214, 154, 104, 0.15);
          color: var(--accent-terracotta);
        }
        .section-title-large {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.01em;
          margin-bottom: 8px;
        }
        .section-title-desc {
          font-size: 1rem;
          color: var(--text-muted);
          max-width: 700px;
          line-height: 1.6;
        }

        /* Video Cards Grid */
        .video-cards-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 28px;
        }
        .video-card-premium {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .video-card-premium:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
          border-color: rgba(140, 45, 25, 0.35);
        }
        .video-thumb-container {
          position: relative;
          width: 100%;
          height: 210px;
          background: #000;
          overflow: hidden;
        }
        .video-preview-player {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background-color: #000;
        }
        .video-card-glass-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .duration-chip {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.8);
          color: #FFF;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .play-pulse-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: var(--accent-terracotta);
          color: #FFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.25s ease, background-color 0.25s ease;
          box-shadow: 0 6px 20px rgba(140, 45, 25, 0.45);
        }
        .play-pulse-btn:hover {
          transform: scale(1.15);
          background-color: var(--accent-terracotta-hover);
        }
        .video-card-meta {
          padding: 18px;
        }
        .vid-cat {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--accent-terracotta);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
          display: block;
        }
        .vid-heading {
          font-size: 1.02rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.4;
        }

        /* Portfolio Gallery Section */
        .portfolio-gallery-section {
          padding: 80px 0;
        }
        .category-filter-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-light);
        }
        .filter-pill-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 10px 20px;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.25s ease;
          border-radius: 6px;
        }
        .count-badge {
          background: rgba(0,0,0,0.06);
          color: var(--text-muted);
          font-size: 0.75rem;
          padding: 2px 7px;
          border-radius: 10px;
          font-weight: 700;
        }
        .filter-pill-btn:hover, .filter-pill-btn.active {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
          border-color: var(--accent-terracotta);
          box-shadow: 0 6px 18px rgba(214, 154, 104, 0.3);
        }
        .filter-pill-btn.active .count-badge {
          background: rgba(255,255,255,0.25);
          color: #FFF;
        }

        /* Portfolio Grid Adaptive */
        .portfolio-grid-adaptive {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 32px;
        }
        .portfolio-item-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.35s ease;
        }
        .portfolio-item-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
          border-color: rgba(140, 45, 25, 0.35);
        }
        .portfolio-card-img-box {
          position: relative;
          width: 100%;
          height: 250px;
          background-color: #FAF8F5;
          overflow: hidden;
          cursor: pointer;
        }
        .portfolio-card-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background-color: #FAF8F5;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .portfolio-item-card:hover .portfolio-card-img {
          transform: scale(1.08);
        }
        .portfolio-card-glass-hover {
          position: absolute;
          inset: 0;
          background: rgba(25, 23, 22, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .portfolio-item-card:hover .portfolio-card-glass-hover {
          opacity: 1;
        }
        .view-detail-btn {
          background-color: var(--accent-terracotta);
          color: #FFF;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 0.88rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        }
        .portfolio-category-tag {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background-color: rgba(25, 23, 22, 0.88);
          color: #FFF;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }
        .portfolio-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .portfolio-meta-tags {
          display: flex;
          gap: 14px;
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 10px;
        }
        .meta-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        }
        .portfolio-card-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 8px;
          line-height: 1.35;
        }
        .architect-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--accent-terracotta);
          font-weight: 600;
          margin-bottom: 20px;
          padding-top: 8px;
          border-top: 1px dashed var(--border-light);
        }
        .card-footer-action {
          margin-top: auto;
        }
        .btn-card-inspect {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          padding: 12px;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .btn-card-inspect:hover {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
          border-color: var(--accent-terracotta);
        }

        /* CTA Banner */
        .architectural-cta-banner {
          margin-top: 40px;
        }
        .cta-banner-card {
          background-color: var(--bg-dark);
          color: #FFFFFF;
          padding: 48px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
          border: 1px solid var(--border-dark);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
        }
        .cta-subtitle-tag {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--accent-terracotta);
          letter-spacing: 0.15em;
          margin-bottom: 8px;
          display: block;
        }
        .cta-main-heading {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .cta-sub-paragraph {
          font-size: 1rem;
          color: var(--text-light-muted);
          max-width: 680px;
          line-height: 1.6;
        }
        .btn-cta-gold {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
          border: none;
          padding: 18px 32px;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.25s ease;
          box-shadow: 0 8px 24px rgba(140, 45, 25, 0.35);
        }
        .btn-cta-gold:hover {
          background-color: var(--accent-terracotta-hover);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(140, 45, 25, 0.45);
        }

        /* Modals */
        .video-modal-backdrop, .project-dossier-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(6px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .video-modal-dialog {
          position: relative;
          background: #111;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          width: 100%;
          max-width: 940px;
          padding: 28px;
          color: #FFF;
        }
        .modal-close-x {
          position: absolute;
          top: 14px;
          right: 20px;
          background: none;
          border: none;
          color: #FFF;
          font-size: 2.2rem;
          cursor: pointer;
          opacity: 0.8;
        }
        .dialog-cat {
          font-size: 0.75rem;
          color: var(--accent-terracotta);
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .dialog-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-top: 4px;
          margin-bottom: 20px;
        }
        .video-dialog-player {
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000;
          border-radius: 6px;
          overflow: hidden;
        }
        .modal-video-element {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* Project Dossier Modal */
        .project-dossier-modal {
          position: relative;
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          width: 100%;
          max-width: 1040px;
          padding: 40px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .dossier-close-btn {
          position: absolute;
          top: 20px;
          right: 24px;
          background: none;
          border: none;
          font-size: 2.2rem;
          cursor: pointer;
          color: var(--text-main);
        }
        .dossier-header-bar {
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-light);
        }
        .dossier-cat {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--accent-terracotta);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 6px;
          display: block;
        }
        .dossier-title {
          font-size: 2.4rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 10px;
        }
        .dossier-meta-row {
          display: flex;
          gap: 20px;
          font-size: 0.85rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }
        .dossier-meta-row span {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dossier-body-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
        }
        .dossier-main-img-box {
          position: relative;
          width: 100%;
          height: 380px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
        }
        .dossier-main-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background-color: #121110;
        }
        .zoom-hint-btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background: rgba(25, 23, 22, 0.85);
          color: #FFF;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .dossier-highlights-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .card-subtitle {
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--accent-terracotta);
          margin-bottom: 10px;
        }
        .spec-row-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.88rem;
          color: var(--text-main);
          margin-bottom: 10px;
        }
        .spec-row-item:last-child {
          margin-bottom: 0;
        }
        .spec-check {
          color: var(--accent-terracotta);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .btn-dossier-cta {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
          border: none;
          padding: 16px;
          font-size: 0.95rem;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-dossier-cta:hover {
          background-color: var(--accent-terracotta-hover);
        }

        @media (max-width: 992px) {
          .hero-main-flex { grid-template-columns: 1fr; }
          .dossier-body-grid { grid-template-columns: 1fr; }
          .cta-banner-card { flex-direction: column; text-align: center; padding: 32px; }
        }
        @media (max-width: 640px) {
          .hero-title { font-size: 2.2rem; }
          .section-title-large { font-size: 1.6rem; }
          .portfolio-grid-adaptive, .video-cards-wrapper { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
