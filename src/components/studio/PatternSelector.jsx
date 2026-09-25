import React from 'react';
import { Check, RotateCw } from 'lucide-react';
import { STUDIO_PATTERNS } from './studioData';

export default function PatternSelector({
  lang = 'TR',
  selectedPattern,
  onSelectPattern,
  rotation = 0,
  onSetRotation,
  activeProduct
}) {
  const isEn = lang === 'EN';

  return (
    <div className="pattern-selector-wrap">
      <div className="section-intro-text">
        <h4>{isEn ? '3. Masonry Bond & Layout' : '3. Dizilim & Örgü Biçimi'}</h4>
        <p>{isEn ? 'Select authentic masonry bond patterns and orientation.' : 'Tuğlaların mimarideki örgü düzenini ve dizilim yönünü belirleyin.'}</p>
      </div>

      <div className="patterns-list-grid">
        {STUDIO_PATTERNS.map((pat) => {
          const isSelected = selectedPattern?.id === pat.id;
          const isComp = pat.isCompatible ? pat.isCompatible(activeProduct) : true;

          return (
            <button
              key={pat.id}
              disabled={!isComp}
              className={`pattern-card-btn ${isSelected ? 'selected' : ''} ${!isComp ? 'disabled' : ''}`}
              onClick={() => onSelectPattern(pat)}
            >
              <div className="pattern-header-row">
                <span className="pattern-name-title">{isEn ? pat.nameEn : pat.name}</span>
                {isSelected && <Check size={14} className="pat-check-icon" />}
              </div>
              <p className="pattern-desc-text">{pat.description}</p>
              {!isComp && (
                <span className="incompatible-warning">
                  {isEn ? 'Not compatible with current material' : 'Seçili ürün formu için uygun değil'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Rotation Control */}
      {selectedPattern?.supportedRotations && selectedPattern.supportedRotations.length > 1 && (
        <div className="rotation-control-box">
          <div className="rot-header">
            <RotateCw size={14} />
            <span>{isEn ? 'Pattern Orientation / Rotation:' : 'Dizilim Yönü / Rotasyon:'}</span>
          </div>
          <div className="rot-btn-group">
            <button
              className={`rot-btn ${rotation === 0 ? 'active' : ''}`}
              onClick={() => onSetRotation(0)}
            >
              0° {isEn ? 'Horizontal (Standard)' : 'Yatay (Standart)'}
            </button>
            <button
              className={`rot-btn ${rotation === 90 ? 'active' : ''}`}
              onClick={() => onSetRotation(90)}
            >
              90° {isEn ? 'Vertical (Soldier)' : 'Dikey (Dik)'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .pattern-selector-wrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .patterns-list-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        .pattern-card-btn {
          background: #201D1A;
          border: 1.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          color: #FAF8F5;
        }
        .pattern-card-btn:hover:not(.disabled) {
          border-color: rgba(255, 255, 255, 0.25);
          background: #26221E;
        }
        .pattern-card-btn.selected {
          border-color: var(--accent-terracotta);
          background: #282420;
          box-shadow: 0 4px 14px rgba(224, 90, 48, 0.16);
        }
        .pattern-card-btn.disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .pattern-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pattern-name-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #FFFFFF;
        }
        .pat-check-icon {
          color: var(--accent-terracotta);
        }
        .pattern-desc-text {
          font-size: 0.74rem;
          color: #A8A29E;
          margin: 0;
          line-height: 1.35;
        }
        .incompatible-warning {
          font-size: 0.65rem;
          color: #F87171;
          font-weight: 600;
          margin-top: 2px;
        }

        .rotation-control-box {
          background: #201D1A;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .rot-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #FFFFFF;
        }
        .rot-btn-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .rot-btn {
          padding: 8px 10px;
          background: #282420;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #D6D3D1;
          font-size: 0.74rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .rot-btn:hover {
          border-color: var(--accent-terracotta);
          color: #FFFFFF;
        }
        .rot-btn.active {
          background: var(--accent-terracotta);
          border-color: var(--accent-terracotta);
          color: #FFFFFF;
        }
      `}</style>
    </div>
  );
}
