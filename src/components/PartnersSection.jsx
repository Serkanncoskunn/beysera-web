import React from 'react';
import { PARTNERS } from '../data/references_partners';
import { TRANSLATIONS } from '../data/translations';

export default function PartnersSection({ lang }) {
  const t = TRANSLATIONS[lang ? lang : 'TR'].partners;

  return (
    <section className="partners-section">
      <div className="container">
        <div className="section-header text-center" style={{ textAlign: 'center' }}>
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            {t.subtitle}
          </p>
        </div>

        <div className="partners-grid">
          {PARTNERS.map((partner, index) => (
            <div key={index} className="partner-card">
              <div className="partner-logo-box">
                <span className="partner-logo-text">{partner.logo}</span>
              </div>
              <h4 className="partner-name">{partner.name}</h4>
              <span className="partner-tag">{lang === 'EN' ? (partner.tagEn || partner.tag) : partner.tag}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .partners-section {
          padding: 80px 0;
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
        }
        .partners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }
        .partner-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          padding: 24px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }
        .partner-card:hover {
          border-color: var(--accent-terracotta);
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.05);
        }
        .partner-logo-box {
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          margin-bottom: 14px;
        }
        .partner-logo-text {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: 0.05em;
          color: var(--accent-slate);
        }
        .partner-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 4px;
        }
        .partner-tag {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>
    </section>
  );
}
