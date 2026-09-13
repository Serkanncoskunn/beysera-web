import React, { useState } from 'react';
import { X, Download, Maximize2, CheckCircle2, ArrowRight, Building2, Phone, MessageSquare } from 'lucide-react';
import { PROJECTS } from '../data/projects';
import { TRANSLATIONS } from '../data/translations';
import LightboxModal from './LightboxModal';
import RegionSelectModal from './RegionSelectModal';

export default function ProductDetailModal({ product, lang, onClose, onSelectProject, onOpenQuoteModal }) {
  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : (product.galleryImages && product.galleryImages.length > 0)
      ? product.galleryImages 
      : [product.mainImage || product.image || '/images/product_placeholder.png'];

  const [selectedImg, setSelectedImg] = useState(images[0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  const t = TRANSLATIONS[lang ? lang : 'TR'].productDetail;
  const isEn = lang === 'EN';

  const name = isEn ? (product.stokAdi || product.nameEn || product.name) : (product.stokAdi || product.name);
  const category = isEn ? (product.anaKategori || product.categoryEn || product.category) : (product.anaKategori || product.category);
  const description = isEn ? (product.aciklama || product.descriptionEn || product.description) : (product.aciklama || product.description);
  const usageAreas = isEn ? (product.aciklama2 || product.usageAreasEn || product.usageAreas) : (product.aciklama2 || product.usageAreas);

  const relatedProjects = PROJECTS.filter((proj) =>
    product.projectsUsedIn?.includes(proj.id)
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-body-grid">
          {/* Left Column: Gallery & Lightbox Trigger */}
          <div className="modal-gallery-col">
            <div className="main-image-box">
              <img 
                src={selectedImg} 
                alt={name} 
                className="modal-main-img" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/product_placeholder.png';
                }}
              />

              
              <button 
                className="zoom-trigger-btn"
                onClick={() => setLightboxOpen(true)}
              >
                <Maximize2 size={16} />
                <span>{t.viewFullscreen}</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="thumb-strip">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${name} gallery ${idx + 1}`}
                    className={`thumb-img ${selectedImg === img ? 'active' : ''}`}
                    onClick={() => setSelectedImg(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specs & Overview */}
          <div className="modal-info-col">
            <span className="modal-category-tag">{category}</span>
            <h2 className="modal-product-title">{name}</h2>

            {/* Side-by-Side Action Bar (Prime Position) */}
            <div className="modal-top-actions-duo">
              <button 
                onClick={() => setIsRegionModalOpen(true)} 
                className="btn-modal-action btn-modal-whatsapp"
                type="button"
              >
                <Phone size={16} />
                <span>{isEn ? 'WhatsApp Price & Info' : 'WhatsApp ile Bilgi / Fiyat Al'}</span>
              </button>

              <button 
                onClick={() => onOpenQuoteModal && onOpenQuoteModal(product)} 
                className="btn-modal-action btn-modal-quote"
                type="button"
              >
                <MessageSquare size={16} />
                <span>{isEn ? 'Offer & Sample Request' : 'Teklif ve Numune Al'}</span>
              </button>
            </div>
            
            {/* Overview Card Box */}
            {description && (
              <div className="modal-overview-card">
                <h4 className="specs-heading">{isEn ? 'Product Description' : 'Ürün Açıklaması'}</h4>
                <div className="overview-bullet-list">
                  {description.split('\n').filter(Boolean).map((line, idx) => {
                    const cleanLine = line.replace(/^•\s*/, '').trim();
                    const colonIdx = cleanLine.indexOf(':');
                    const label = colonIdx !== -1 ? cleanLine.substring(0, colonIdx + 1) : '';
                    const val = colonIdx !== -1 ? cleanLine.substring(colonIdx + 1).trim() : cleanLine;
                    return (
                      <div key={idx} className="overview-bullet-item">
                        <CheckCircle2 size={15} className="bullet-check-icon" />
                        <div className="bullet-text-box">
                          {label && <strong className="bullet-label">{label} </strong>}
                          <span className="bullet-val">{val}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Specs Table */}
            <div className="specs-container">
              <h4 className="specs-heading">{t.specsTitle}</h4>
              <table className="specs-table">
                <tbody>
                  <tr>
                    <td>{t.dimensions}</td>
                    <td><strong>{product.dimensions}</strong></td>
                  </tr>
                  <tr>
                    <td>{t.weight}</td>
                    <td><strong>{product.weight}</strong></td>
                  </tr>
                  <tr>
                    <td>{t.pcsPerM2}</td>
                    <td><strong>{product.pcsPerM2} {isEn ? 'pcs' : 'adet'}</strong></td>
                  </tr>
                  <tr>
                    <td>{t.waterAbsorption}</td>
                    <td><strong>{product.waterAbsorption}</strong></td>
                  </tr>
                  <tr>
                    <td>{t.frostResistance}</td>
                    <td><strong>{product.frostResistance}</strong></td>
                  </tr>
                  <tr>
                    <td>{t.fireClass}</td>
                    <td><strong>{product.fireClass}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Usage Areas */}
            {usageAreas && (
              <div className="usage-areas-box">
                <h4 className="specs-heading">{t.usageTitle}</h4>
                <ul className="usage-list">
                  {usageAreas.map((area, i) => (
                    <li key={i}>
                      <CheckCircle2 size={14} className="check-icon" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Action Buttons Group */}
            <div className="modal-cta-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={() => setIsRegionModalOpen(true)} 
                className="btn-whatsapp-cta"
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify-content: 'center',
                  gap: '8px',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  padding: '12px 18px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                <Phone size={16} />
                <span>{isEn ? 'Order / Ask via WhatsApp' : 'WhatsApp ile Bilgi / Fiyat Al'}</span>
              </button>

              <button 
                onClick={() => onOpenQuoteModal && onOpenQuoteModal(product)} 
                className="btn-primary"
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify-content: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                <MessageSquare size={16} />
                <span>{isEn ? 'Request Official Offer & Sample' : 'Teklif ve Numune Talep Et'}</span>
              </button>

              {/* Download PDF button */}
              <a 
                href="/assets/catalog/katalog.pdf"
                target="_blank" 
                rel="noreferrer" 
                className="btn-outline download-btn"
              >
                <Download size={16} />
                <span>{t.downloadPdf}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Section: "Bu Ürünü Projelerde Görün" */}
        {relatedProjects.length > 0 && (
          <div className="in-projects-section">
            <div className="in-projects-header">
              <Building2 size={22} className="header-icon" />
              <div>
                <h3 className="in-projects-title">{t.inProjectsTitle}</h3>
                <p className="in-projects-sub">{t.inProjectsSubtitle}</p>
              </div>
            </div>

            <div className="projects-mini-grid">
              {relatedProjects.map((proj) => (
                <div 
                  key={proj.id} 
                  className="project-mini-card"
                  onClick={() => {
                    onClose();
                    onSelectProject(proj);
                  }}
                >
                  <img src={proj.mainImage} alt={isEn ? proj.titleEn : proj.title} className="proj-mini-img" />
                  <div className="proj-mini-overlay">
                    <span className="proj-mini-tag">{isEn ? proj.categoryEn : proj.category}</span>
                    <h4 className="proj-mini-title">{isEn ? proj.titleEn : proj.title}</h4>
                    <span className="proj-mini-loc">{isEn ? proj.locationEn : proj.location}</span>
                    <div className="proj-mini-cta">
                      <span>{t.showProject}</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <LightboxModal
          imageSrc={selectedImg}
          title={name}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Region Selector Modal for WhatsApp Pricing */}
      <RegionSelectModal
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        product={product}
        lang={lang}
      />

      <style>{`
        .product-detail-modal {
          max-width: 1080px;
          padding: 40px;
        }
        .modal-top-actions-duo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 24px;
          margin-top: 10px;
        }
        .btn-modal-action {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 20px;
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.25s ease;
          border: 1px solid transparent;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .btn-modal-whatsapp {
          background-color: #25D366;
          color: #FFFFFF;
        }
        .btn-modal-whatsapp:hover {
          background-color: #1EBE57;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);
        }
        .btn-modal-quote {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
        }
        .btn-modal-quote:hover {
          background-color: var(--accent-clay);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(184, 91, 53, 0.3);
        }
        .modal-body-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .modal-gallery-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .main-image-box {
          position: relative;
          width: 100%;
          height: 380px;
          background-color: #FAF8F5;
          border: 1px solid var(--border-light);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        
        .modal-main-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 10px;
        }
        .zoom-trigger-btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background-color: rgba(25, 23, 22, 0.85);
          color: #FFFFFF;
          border: none;
          padding: 8px 14px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .zoom-trigger-btn:hover {
          background-color: var(--accent-terracotta);
        }
        .thumb-strip {
          display: flex;
          gap: 10px;
        }
        .thumb-img {
          width: 70px;
          height: 60px;
          object-fit: cover;
          border: 1px solid var(--border-light);
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s, border-color 0.2s;
        }
        .thumb-img.active, .thumb-img:hover {
          opacity: 1;
          border-color: var(--accent-terracotta);
        }
        .modal-category-tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: var(--accent-terracotta);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .modal-product-title {
          font-size: 2.2rem;
          line-height: 1.15;
          margin-bottom: 16px;
        }
        .modal-overview-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 24px;
        }
        .overview-bullet-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 12px;
        }
        .overview-bullet-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding-bottom: 8px;
          border-bottom: 1px dashed var(--border-light);
        }
        .overview-bullet-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .bullet-check-icon {
          color: var(--accent-terracotta);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .bullet-text-box {
          font-size: 0.86rem;
          line-height: 1.45;
          color: var(--text-main);
        }
        .bullet-label {
          color: var(--accent-terracotta);
          font-weight: 700;
        }
        .bullet-val {
          color: var(--text-muted);
        }
        .specs-heading {
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
          color: var(--text-main);
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 6px;
        }
        .specs-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
          margin-bottom: 24px;
        }
        .specs-table td {
          padding: 8px 0;
          border-bottom: 1px dashed var(--border-light);
        }
        .specs-table td:first-child {
          color: var(--text-muted);
        }
        .specs-table td:last-child {
          text-align: right;
        }
        .usage-list {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 24px;
        }
        .usage-list li {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-main);
        }
        .check-icon {
          color: var(--accent-terracotta);
          flex-shrink: 0;
        }
        .download-btn {
          width: 100%;
          justify-content: center;
        }
        .in-projects-section {
          margin-top: 40px;
          padding-top: 32px;
          border-top: 2px solid var(--border-light);
        }
        .in-projects-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .header-icon {
          color: var(--accent-terracotta);
        }
        .in-projects-title {
          font-size: 1.6rem;
          line-height: 1.1;
        }
        .in-projects-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .projects-mini-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .project-mini-card {
          position: relative;
          height: 180px;
          border: 1px solid var(--border-light);
          overflow: hidden;
          cursor: pointer;
        }
        .proj-mini-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .project-mini-card:hover .proj-mini-img {
          transform: scale(1.08);
        }
        .proj-mini-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 70%);
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          color: #FFFFFF;
        }
        .proj-mini-tag {
          font-size: 0.65rem;
          color: var(--accent-clay);
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .proj-mini-title {
          font-size: 1.1rem;
          line-height: 1.2;
          color: #FFFFFF;
        }
        .proj-mini-loc {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
        }
        .proj-mini-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-clay);
          margin-top: 6px;
        }
        @media (max-width: 768px) {
          .modal-body-grid { grid-template-columns: 1fr; }
          .product-detail-modal { padding: 24px; }
        }
      `}</style>
    </div>
  );
}
