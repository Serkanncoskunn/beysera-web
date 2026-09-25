import React from 'react';
import { Check, Layers } from 'lucide-react';
import { STUDIO_SURFACES } from './studioData';

export default function SurfaceSelector({
  lang = 'TR',
  selectedSurface,
  onSelectSurface,
  selectedZone,
  onSelectZone
}) {
  const isEn = lang === 'EN';

  return (
    <div className="surface-selector-wrap">
      <div className="section-intro-text">
        <h4>{isEn ? '1. Select Architectural Scene' : '1. Mimari Sahne Seçimi'}</h4>
        <p>{isEn ? 'Choose an architectural environment to test brick facades.' : 'Tuğla Dünyası ürünlerini denemek istediğiniz mimari yapıyı seçin.'}</p>
      </div>

      <div className="surface-cards-list">
        {STUDIO_SURFACES.map((surf) => {
          const isSelected = selectedSurface?.id === surf.id;
          return (
            <div
              key={surf.id}
              className={`surface-card-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectSurface(surf)}
            >
              <div className="surface-thumb-box">
                <img src={surf.thumbnail} alt={surf.name} className="surface-thumb-img" />
                {isSelected && (
                  <div className="surface-selected-badge">
                    <Check size={14} />
                  </div>
                )}
              </div>

              <div className="surface-info-box">
                <span className="surface-tag-label">{isEn ? surf.tagEn : surf.tag}</span>
                <h5 className="surface-name-heading">{isEn ? surf.nameEn : surf.name}</h5>
                <p className="surface-desc-text">{isEn ? surf.descriptionEn : surf.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Surface Application Zones */}
      {selectedSurface?.zones && selectedSurface.zones.length > 1 && (
        <div className="surface-zones-section">
          <h5 className="zones-header-title">
            <Layers size={14} />
            <span>{isEn ? 'Application Zone on Structure:' : 'Yapı Üzerindeki Uygulama Alanı:'}</span>
          </h5>

          <div className="zones-grid">
            {selectedSurface.zones.map((zone) => {
              const isZoneSelected = selectedZone?.id === zone.id;
              return (
                <button
                  key={zone.id}
                  className={`zone-pill-btn ${isZoneSelected ? 'active' : ''}`}
                  onClick={() => onSelectZone(zone)}
                >
                  <span>{isEn ? zone.nameEn : zone.name}</span>
                  {isZoneSelected && <Check size={12} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .surface-selector-wrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .section-intro-text h4 {
          font-size: 1rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 4px 0;
          font-family: var(--font-heading);
        }
        .section-intro-text p {
          font-size: 0.8rem;
          color: #A8A29E;
          margin: 0;
          line-height: 1.4;
        }

        .surface-cards-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .surface-card-item {
          display: flex;
          gap: 12px;
          background: #201D1A;
          border: 1.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          padding: 10px;
          transition: all 0.25s ease;
        }
        .surface-card-item:hover {
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }
        .surface-card-item.selected {
          border-color: var(--accent-terracotta);
          background: #282420;
          box-shadow: 0 4px 16px rgba(224, 90, 48, 0.18);
        }

        .surface-thumb-box {
          width: 100px;
          height: 75px;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }
        .surface-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .surface-selected-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: var(--accent-terracotta);
          color: #FFFFFF;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .surface-info-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2px;
        }
        .surface-tag-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--accent-terracotta);
          text-transform: uppercase;
        }
        .surface-name-heading {
          font-size: 0.95rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }
        .surface-desc-text {
          font-size: 0.74rem;
          color: #A8A29E;
          margin: 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .surface-zones-section {
          background: #201D1A;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .zones-header-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .zones-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .zone-pill-btn {
          padding: 6px 12px;
          background: #282420;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #D6D3D1;
          font-size: 0.74rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .zone-pill-btn:hover {
          border-color: var(--accent-terracotta);
          color: #FFFFFF;
        }
        .zone-pill-btn.active {
          background: var(--accent-terracotta);
          border-color: var(--accent-terracotta);
          color: #FFFFFF;
        }
      `}</style>
    </div>
  );
}
