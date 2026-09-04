import React, { useState } from 'react';
import { Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { REFERENCES } from '../data/references_partners';

export default function ReferencesSection({ lang }) {
  const [showAll, setShowAll] = useState(false);
  const isEn = lang === 'EN';

  // Display initial 12 references, expandable to full list
  const displayedRefs = showAll ? REFERENCES : REFERENCES.slice(0, 12);

  return (
    <section className="references-home-section">
      <div className="container">
        <div className="section-header text-center" style={{ textAlign: 'center' }}>
          <span className="section-tag">
            {isEn ? 'OUR REFERENCES' : 'REFERANSLARIMIZ'}
          </span>
          <h2 className="section-title">
            {isEn ? 'Major Reference Projects' : 'Başlıca Referanslarımız'}
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '680px' }}>
            {isEn
              ? 'Landmark public institutions, municipalities, retail chains, and luxury estates built with Tuğla Dünyası products.'
              : 'Türkiye genelinde zincir mağazalar, belediyeler, kamu kurumları, eğitim vakıfları ve prestijli projeler.'}
          </p>
        </div>

        <div className="references-home-grid">
          {displayedRefs.map((ref, idx) => (
            <div key={idx} className="ref-home-card">
              <Building2 size={20} className="ref-home-icon" />
              <div className="ref-home-content">
                <h4 className="ref-home-name">{ref.name}</h4>
                <span className="ref-home-cat">
                  {isEn ? (ref.categoryEn || ref.category) : ref.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {REFERENCES.length > 12 && (
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn-outline-ref"
            >
              {showAll
                ? (isEn ? 'Show Less' : 'Daha Az Göster')
                : (isEn ? `Show All References (${REFERENCES.length})` : `Tüm Referansları Göster (${REFERENCES.length})`)}
              {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .references-home-section {
          padding: 80px 0;
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
        }
        .references-home-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }
        .ref-home-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: var(--transition-smooth);
          border-radius: 4px;
        }
        .ref-home-card:hover {
          border-color: var(--accent-terracotta);
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.06);
        }
        .ref-home-icon {
          color: var(--accent-terracotta);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .ref-home-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ref-home-name {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.3;
        }
        .ref-home-cat {
          font-size: 0.76rem;
          color: var(--text-muted);
        }
        .btn-outline-ref {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: transparent;
          border: 1.5px solid var(--accent-terracotta);
          color: var(--accent-terracotta);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--transition-smooth);
          border-radius: 4px;
        }
        .btn-outline-ref:hover {
          background: var(--accent-terracotta);
          color: #FFFFFF;
        }
      `}</style>
    </section>
  );
}
