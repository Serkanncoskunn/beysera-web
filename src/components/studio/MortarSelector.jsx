import React from 'react';
import { STUDIO_MORTARS, STUDIO_MORTAR_WIDTHS } from './studioData';

export default function MortarSelector({
  lang = 'TR',
  selectedMortar,
  onSelectMortar,
  selectedWidth,
  onSelectWidth,
  scale = 1,
  onChangeScale
}) {
  const isEn = lang === 'EN';

  return (
    <div className="mortar-selector-wrap">
      <div className="section-intro-text">
        <h4>{isEn ? '4. Mortar & Joint Settings' : '4. Derz Harcı & Aralık Ayarları'}</h4>
        <p>{isEn ? 'Customize mortar color, joint width, and brick scaling.' : 'Derz harcının rengini, milimetrik aralığını ve tuğla ölçeğini özelleştirin.'}</p>
      </div>

      {/* Mortar Colors */}
      <div className="mortar-group">
        <h5 className="group-heading">{isEn ? 'Mortar / Joint Color:' : 'Derz / Harç Rengi:'}</h5>
        <div className="mortar-colors-grid">
          {STUDIO_MORTARS.map((m) => {
            const isSelected = selectedMortar?.id === m.id;
            return (
              <button
                key={m.id}
                className={`mortar-color-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectMortar(m)}
              >
                <span
                  className="mortar-color-swatch-circle"
                  style={{
                    backgroundColor: m.hex,
                    boxShadow: `inset 0 1px 3px ${m.darkHex}`
                  }}
                />
                <span className="mortar-color-name">{m.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Joint Thickness */}
      <div className="mortar-group">
        <h5 className="group-heading">{isEn ? 'Joint Thickness (Width):' : 'Derz Genişliği (Aralığı):'}</h5>
        <div className="mortar-widths-row">
          {STUDIO_MORTAR_WIDTHS.map((w) => {
            const isSelected = selectedWidth?.id === w.id;
            return (
              <button
                key={w.id}
                className={`mortar-width-chip ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectWidth(w)}
              >
                <span className="width-num-label">{w.label}</span>
                <span className="width-sub-label">{w.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scaling */}
      <div className="mortar-group">
        <div className="scale-header-row">
          <h5 className="group-heading">{isEn ? 'Texture Scale Ratio:' : 'Tuğla Dokusu Ölçek Oranı:'}</h5>
          <span className="scale-pct-badge">{Math.round(scale * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.75"
          max="1.45"
          step="0.05"
          value={scale}
          onChange={(e) => onChangeScale(parseFloat(e.target.value))}
          className="studio-slider-input"
        />
        <div className="scale-limits-text">
          <span>{isEn ? 'Fine / Small' : 'İnce Ölçek'}</span>
          <span>{isEn ? 'Standard (1:1)' : 'Standart (1:1)'}</span>
          <span>{isEn ? 'Large Accent' : 'Büyük Vurgu'}</span>
        </div>
      </div>

      <style>{`
        .mortar-selector-wrap {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .mortar-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .group-heading {
          font-size: 0.84rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }

        .mortar-colors-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .mortar-color-btn {
          background: #201D1A;
          border: 1.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #FAF8F5;
          text-align: left;
        }
        .mortar-color-btn:hover {
          border-color: rgba(255, 255, 255, 0.25);
          background: #26221E;
        }
        .mortar-color-btn.selected {
          border-color: var(--accent-terracotta);
          background: #282420;
          box-shadow: 0 4px 14px rgba(224, 90, 48, 0.16);
        }
        .mortar-color-swatch-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.3);
          flex-shrink: 0;
        }
        .mortar-color-name {
          font-size: 0.76rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mortar-widths-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
        }
        .mortar-width-chip {
          background: #201D1A;
          border: 1.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 8px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          color: #FFFFFF;
          transition: all 0.2s ease;
        }
        .mortar-width-chip:hover {
          border-color: rgba(255, 255, 255, 0.25);
        }
        .mortar-width-chip.selected {
          border-color: var(--accent-terracotta);
          background: var(--accent-terracotta);
        }
        .width-num-label {
          font-size: 0.85rem;
          font-weight: 800;
        }
        .width-sub-label {
          font-size: 0.6rem;
          color: #A8A29E;
        }
        .mortar-width-chip.selected .width-sub-label {
          color: #FFFFFF;
        }

        .scale-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .scale-pct-badge {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--accent-terracotta);
        }
        .studio-slider-input {
          width: 100%;
          accent-color: var(--accent-terracotta);
          cursor: pointer;
        }
        .scale-limits-text {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: #78716C;
        }
      `}</style>
    </div>
  );
}
