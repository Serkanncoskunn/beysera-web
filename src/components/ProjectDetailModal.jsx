import React, { useState } from 'react';
import { X, MapPin, Calendar, User, ArrowRight, Layers } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { TRANSLATIONS } from '../data/translations';

export default function ProjectDetailModal({ project, lang, onClose, onSelectProduct }) {
  if (!project) return null;
  const [selectedImg, setSelectedImg] = useState(project.mainImage || (project.gallery && project.gallery[0]) || '');
  const t = TRANSLATIONS[lang ? lang : 'TR'].projects;
  const isEn = lang === 'EN';

  const title = isEn ? (project.titleEn || project.title) : project.title;
  const location = isEn ? (project.locationEn || project.location) : project.location;
  const description = isEn ? (project.descriptionEn || project.description) : project.description;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content project-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Hero Gallery */}
        <div className="proj-hero-gallery">
          <div className="proj-main-img-box">
            <img src={selectedImg} alt={title} className="proj-main-img" />
          </div>

          {project.gallery && project.gallery.length > 1 && (
            <div className="proj-thumb-row">
              {project.gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Project ${i}`}
                  className={`proj-thumb ${selectedImg === img ? 'active' : ''}`}
                  onClick={() => setSelectedImg(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Project Meta Info */}
        <div className="proj-detail-body">
          <div className="proj-meta-pills">
            <span className="meta-pill"><MapPin size={14} /> {location}</span>
            <span className="meta-pill"><Calendar size={14} /> {project.year}</span>
            <span className="meta-pill"><User size={14} /> {project.architect}</span>
          </div>

          <h2 className="proj-detail-title">{title}</h2>
          <p className="proj-detail-desc">{description}</p>

          {/* Used Products Section */}
          {project.usedProducts && project.usedProducts.length > 0 && (
            <div className="used-products-section">
              <div className="used-header">
                <Layers size={20} className="used-icon" />
                <h3 className="used-title">{t.usedProductsTitle}</h3>
              </div>

              <div className="used-products-grid">
                {project.usedProducts.map((prodItem) => {
                  const fullProd = PRODUCTS.find((p) => p.id === prodItem.id);
                  const prodName = isEn ? (prodItem.nameEn || prodItem.name) : prodItem.name;
                  return (
                    <div 
                      key={prodItem.id} 
                      className="used-product-card"
                      onClick={() => {
                        onClose();
                        if (fullProd) onSelectProduct(fullProd);
                      }}
                    >
                      <img src={prodItem.image} alt={prodName} className="used-prod-img" />
                      <div className="used-prod-info">
                        <span className="used-prod-cat">{isEn ? 'BRICK USED' : 'KULLANILAN TUĞLA'}</span>
                        <h4 className="used-prod-name">{prodName}</h4>
                        <span className="used-prod-cta">
                          {isEn ? 'View Product Details' : 'Ürün Detayına Git'} <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .project-detail-modal {
          max-width: 1040px;
          padding: 0;
          overflow: hidden;
        }
        .proj-hero-gallery {
          background-color: #191716;
          padding: 24px;
        }
        .proj-main-img-box {
          width: 100%;
          min-height: 380px;
          max-height: 600px;
          height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0E0D0C;
          border-radius: 8px;
          overflow: hidden;
        }
        .proj-main-img {
          width: 100%;
          height: 100%;
          max-height: 520px;
          object-fit: contain;
        }
        .proj-thumb-row {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }
        .proj-thumb {
          width: 90px;
          height: 64px;
          object-fit: cover;
          cursor: pointer;
          opacity: 0.6;
          border: 1px solid rgba(255,255,255,0.2);
          transition: var(--transition-smooth);
        }
        .proj-thumb.active, .proj-thumb:hover {
          opacity: 1;
          border-color: var(--accent-clay);
        }
        .proj-detail-body {
          padding: 40px;
        }
        .proj-meta-pills {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .meta-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          padding: 6px 14px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .proj-detail-title {
          font-size: 2.4rem;
          line-height: 1.15;
          margin-bottom: 16px;
        }
        .proj-detail-desc {
          font-size: 1.05rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 36px;
        }
        .used-products-section {
          padding-top: 28px;
          border-top: 2px solid var(--border-light);
        }
        .used-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .used-icon {
          color: var(--accent-terracotta);
        }
        .used-title {
          font-size: 1.5rem;
        }
        .used-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .used-product-card {
          display: flex;
          gap: 16px;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          padding: 16px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .used-product-card:hover {
          border-color: var(--accent-terracotta);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }
        .used-prod-img {
          width: 80px;
          height: 80px;
          object-fit: cover;
        }
        .used-prod-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .used-prod-cat {
          font-size: 0.7rem;
          color: var(--accent-terracotta);
          font-weight: 600;
          text-transform: uppercase;
        }
        .used-prod-name {
          font-size: 1.1rem;
          line-height: 1.2;
          color: var(--text-main);
          margin-bottom: 4px;
        }
        .used-prod-cta {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
