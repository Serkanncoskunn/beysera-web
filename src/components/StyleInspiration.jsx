import React, { useState } from 'react';
import { INSPIRATIONS } from '../data/inspiration';
import { TRANSLATIONS } from '../data/translations';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function StyleInspiration({ lang, onExploreProducts }) {
  const [activeStyle, setActiveStyle] = useState(INSPIRATIONS[0]);
  const t = TRANSLATIONS[lang].inspiration;
  const isEn = lang === 'EN';

  return (
    <section id="inspiration" className="inspiration-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.subtitle}</p>
        </div>

        {/* 5 Tabs on a Single Row on Desktop (Requirement 5) */}
        <div className="style-tabs">
          {INSPIRATIONS.map((insp) => (
            <button
              key={insp.id}
              className={`style-tab-btn ${activeStyle.id === insp.id ? 'active' : ''}`}
              onClick={() => setActiveStyle(insp)}
            >
              <span className="style-tag-label">{isEn ? insp.tagEn : insp.tag}</span>
              <span className="style-tab-title">{isEn ? insp.titleEn : insp.title}</span>
            </button>
          ))}
        </div>

        {/* Active Style Feature Box */}
        <div className="active-style-card">
          <div className="style-img-side">
            <img 
              src={activeStyle.image} 
              alt={isEn ? activeStyle.titleEn : activeStyle.title} 
              className="style-img" 
            />
          </div>
          <div className="style-info-side">
            <span className="style-badge">
              <Sparkles size={14} /> {isEn ? 'ARCHITECTURAL VIBE' : 'MİMARİ MİZAÇ'}
            </span>
            <h3 className="style-main-title">{isEn ? activeStyle.titleEn : activeStyle.title}</h3>
            <p className="style-subtitle-text">{isEn ? activeStyle.subtitleEn : activeStyle.subtitle}</p>
            <p className="style-desc">{isEn ? activeStyle.descriptionEn : activeStyle.description}</p>

            <button onClick={onExploreProducts} className="btn-primary" style={{ marginTop: '24px' }}>
              <span>{isEn ? 'Explore Products in This Style' : 'Bu Stildeki Ürünleri Filtrele'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .inspiration-section {
          padding: 90px 0;
          background-color: var(--bg-primary);
        }
        .style-tabs {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 32px;
        }
        .style-tab-btn {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          cursor: pointer;
          transition: var(--transition-smooth);
          text-align: left;
        }
        .style-tab-btn:hover, .style-tab-btn.active {
          border-color: var(--accent-terracotta);
          background-color: var(--accent-slate);
          color: #FFFFFF;
        }
        .style-tag-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--accent-clay);
          margin-bottom: 4px;
          white-space: nowrap;
        }
        .style-tab-title {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }
        .active-style-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          box-shadow: 0 16px 40px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .style-img-side {
          height: 420px;
          overflow: hidden;
          background-color: #F0EEEA;
        }
        .style-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        .style-info-side {
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .style-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--accent-terracotta);
          font-weight: 600;
          letter-spacing: 0.15em;
          margin-bottom: 12px;
        }
        .style-main-title {
          font-size: 2.6rem;
          line-height: 1.1;
          margin-bottom: 8px;
        }
        .style-subtitle-text {
          font-size: 1.05rem;
          color: var(--accent-clay);
          font-weight: 500;
          margin-bottom: 16px;
        }
        .style-desc {
          color: var(--text-muted);
          line-height: 1.6;
        }
        @media (max-width: 992px) {
          .style-tabs {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
          .style-tab-title { white-space: normal; }
          .active-style-card { grid-template-columns: 1fr; }
          .style-img-side { height: 260px; }
          .style-info-side { padding: 24px; }
        }
      `}</style>
    </section>
  );
}
