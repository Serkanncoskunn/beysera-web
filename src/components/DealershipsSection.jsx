import React from 'react';
import { ExternalLink } from 'lucide-react';
import { DEALERSHIPS } from '../data/dealerships';

export default function DealershipsSection({ lang = 'TR' }) {
  const isEn = lang === 'EN';

  return (
    <section className="dealerships-section" id="bayiliklerimiz">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <h2 className="section-main-title">
            {isEn ? 'BAYİLİKLERİMİZ' : 'BAYİLİKLERİMİZ'}
          </h2>
          <p className="section-sub-desc">
            {isEn 
              ? "As the authorized dealer of Turkey's most established and high-quality brick, clay tile, and refractory manufacturers, we provide certified materials for your architectural projects." 
              : "Türkiye'nin en köklü ve kaliteli tuğla, kiremit ve refrakter üreticilerinin yetkili bayisi olarak mimari ve yapı projelerinize en üstün standartlarda malzeme güvencesi sunuyoruz."}
          </p>
        </div>

        {/* Dealership Cards Grid */}
        <div className="dealerships-grid">
          {DEALERSHIPS.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="dealership-card"
              title={isEn ? `Visit ${item.nameEn || item.name} Official Website` : `${item.name} Resmi Web Sitesini Ziyaret Et`}
            >
              {/* Logo Area */}
              <div className="dealership-logo-wrapper">
                <img
                  src={item.logo}
                  alt={item.name}
                  className="dealership-logo-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    if (item.id === 'yaylaoglu') {
                      e.target.src = '/assets/bayiliklerimiz/yaylaoglu.png';
                    }
                  }}
                />
              </div>

              {/* Card Body */}
              <div className="dealership-card-body">
                <h3 className="dealership-title">{item.name}</h3>

                <p className="dealership-desc">
                  {isEn ? (item.descriptionEn || item.description) : item.description}
                </p>

                <div className="dealership-link-action">
                  <span>{isEn ? 'Resmi Web Sitesini İncele' : 'Resmi Web Sitesini İncele'}</span>
                  <ExternalLink size={14} className="external-link-icon" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .dealerships-section {
          padding: 85px 0;
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
        }
        .section-header-center {
          text-align: center;
          max-width: 780px;
          margin: 0 auto 45px auto;
        }
        .section-main-title {
          font-size: 2.8rem;
          font-weight: 900;
          color: var(--accent-terracotta);
          line-height: 1.15;
          margin: 0 0 16px 0;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-family: var(--font-heading);
        }
        .section-sub-desc {
          font-size: 1.02rem;
          color: var(--text-muted);
          line-height: 1.65;
          margin: 0;
        }

        .dealerships-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .dealership-card {
          background: #FFFFFF;
          border: 1.5px solid var(--border-light);
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          position: relative;
        }
        .dealership-card:hover {
          transform: translateY(-7px);
          border-color: var(--accent-terracotta);
          box-shadow: 0 16px 36px rgba(235, 88, 40, 0.12);
        }
        .dealership-logo-wrapper {
          width: 100%;
          height: 140px;
          background: #FAFAFA;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 24px;
          transition: background-color 0.25s ease;
        }
        .dealership-card:hover .dealership-logo-wrapper {
          background-color: #FFFFFF;
        }
        .dealership-logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.35s ease;
          display: block;
        }
        .dealership-card:hover .dealership-logo-img {
          transform: scale(1.08);
        }
        .dealership-card-body {
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .dealership-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0 0 10px 0;
          line-height: 1.3;
          transition: color 0.2s ease;
        }
        .dealership-card:hover .dealership-title {
          color: var(--accent-terracotta);
        }
        .dealership-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0 0 20px 0;
          flex-grow: 1;
        }
        .dealership-link-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--accent-terracotta);
          padding-top: 14px;
          border-top: 1px dashed var(--border-light);
          transition: gap 0.2s ease;
        }
        .dealership-card:hover .dealership-link-action {
          gap: 10px;
          color: var(--accent-terracotta-dark);
        }
        .external-link-icon {
          transition: transform 0.2s ease;
        }
        .dealership-card:hover .external-link-icon {
          transform: translate(2px, -2px);
        }

        @media (max-width: 1100px) {
          .dealerships-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        @media (max-width: 600px) {
          .dealerships-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          .section-main-title {
            font-size: 2.1rem;
          }
        }
      `}</style>
    </section>
  );
}
