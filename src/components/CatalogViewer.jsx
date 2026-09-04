import React from "react";
import { Download, ExternalLink, CheckCircle2 } from "lucide-react";
import { TRANSLATIONS } from "../data/translations";

export default function CatalogViewer({ lang }) {
  const pdfPath = "/assets/catalog/katalog.pdf";
  const coverImage = "/images/catalog_cover.png";
  const t = TRANSLATIONS[lang ? lang : "TR"].catalog;
  const isEn = lang === "EN";

  return (
    <section id="catalog-section" className="catalog-section">
      <div className="container">
        <div className="catalog-card-banner">
          <div className="catalog-text-col">
            <span className="section-tag" style={{ color: "var(--accent-clay)" }}>{t.tag}</span>
            <h2 className="catalog-banner-title">{t.title}</h2>
            <p className="catalog-banner-desc">{t.desc}</p>

            <div className="catalog-highlights">
              <div className="hl-item">
                <CheckCircle2 size={16} className="hl-icon" />
                <span>{t.hl1}</span>
              </div>
              <div className="hl-item">
                <CheckCircle2 size={16} className="hl-icon" />
                <span>{t.hl2}</span>
              </div>
              <div className="hl-item">
                <CheckCircle2 size={16} className="hl-icon" />
                <span>{t.hl3}</span>
              </div>
            </div>

            <div className="catalog-action-btns">
              <a 
                href={pdfPath} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-primary catalog-download-btn"
              >
                <Download size={18} />
                <span>{t.downloadBtn}</span>
              </a>

              <a 
                href={pdfPath} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-outline-light"
              >
                <ExternalLink size={16} />
                <span>{t.openNewTab}</span>
              </a>
            </div>
          </div>

          <div className="catalog-preview-col">
            <div className="catalog-book-cover">
              <img 
                src={coverImage} 
                alt={t.title} 
                className="catalog-cover-img" 
              />
              <div className="book-shadow"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .catalog-section {
          padding: 60px 0;
          background-color: var(--bg-primary);
        }
        .catalog-card-banner {
          background-color: var(--bg-dark);
          border-radius: 12px;
          padding: 60px 50px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: center;
          color: #FFFFFF;
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        .catalog-banner-title {
          font-size: 2.2rem;
          margin: 12px 0 16px 0;
          color: #FFFFFF;
        }
        .catalog-banner-desc {
          font-size: 0.95rem;
          color: var(--text-light-muted);
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .catalog-highlights {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 32px;
        }
        .hl-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: #E0DDD8;
        }
        .hl-icon { color: var(--accent-clay); }
        .catalog-action-btns {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .catalog-book-cover {
          position: relative;
          max-width: 320px;
          margin: 0 auto;
        }
        .catalog-cover-img {
          width: 100%;
          border-radius: 6px;
          box-shadow: 0 15px 30px rgba(0,0,0,0.3);
          transform: perspective(1000px) rotateY(-5deg);
        }
        @media (max-width: 992px) {
          .catalog-card-banner { grid-template-columns: 1fr; padding: 40px 30px; }
        }
      `}</style>
    </section>
  );
}
