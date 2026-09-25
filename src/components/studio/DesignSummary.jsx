import React from 'react';
import { Layers, CheckCircle2, Paintbrush, Sliders } from 'lucide-react';

export default function DesignSummary({
  lang = 'TR',
  surface,
  primaryProduct,
  pattern,
  rotation,
  mortar,
  mortarWidth,
  isMixActive,
  mixProducts = [],
  zone
}) {
  const isEn = lang === 'EN';

  return (
    <div className="design-summary-badge">
      <div className="summary-col">
        <span className="summary-label">{isEn ? 'Architecture' : 'Mimari Sahne'}</span>
        <strong className="summary-value">{isEn ? surface?.nameEn : surface?.name}</strong>
      </div>

      <div className="summary-divider" />

      <div className="summary-col">
        <span className="summary-label">{isEn ? 'Material' : 'Tuğla Modeli'}</span>
        <strong className="summary-value highlight">
          {isMixActive && mixProducts.length > 0
            ? mixProducts.map(p => `${p.product?.stokAdi || p.product?.stokKodu} (%${p.percentage})`).join(' + ')
            : (primaryProduct?.stokAdi || 'Pres Tuğla')}
        </strong>
      </div>

      <div className="summary-divider" />

      <div className="summary-col">
        <span className="summary-label">{isEn ? 'Bond & Grout' : 'Dizilim & Derz'}</span>
        <strong className="summary-value">
          {isEn ? pattern?.nameEn : pattern?.name} ({rotation}°) • {mortar?.name} ({mortarWidth?.label})
        </strong>
      </div>

      <style>{`
        .design-summary-badge {
          background: rgba(20, 18, 16, 0.88);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          color: #FAF8F5;
          pointer-events: none;
        }
        .summary-col {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .summary-label {
          font-size: 0.65rem;
          color: #A8A29E;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .summary-value {
          font-size: 0.78rem;
          font-weight: 700;
          color: #FFFFFF;
          white-space: nowrap;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .summary-value.highlight {
          color: var(--accent-terracotta);
        }
        .summary-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .design-summary-badge {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
