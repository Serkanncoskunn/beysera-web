// src/studio/components/StudioSidebarLeft.jsx
import React from "react";
import { Layers } from "lucide-react";
import { GROUT_COLORS } from "../data/groutColors";

export default function StudioSidebarLeft({
  selectedProduct,
  patternId,
  setPatternId,
  rotation,
  setRotation,
  groutWidthMm,
  setGroutWidthMm,
  groutColorId,
  setGroutColorId,
  onOpenMixModal,
  isEn
}) {
  const patternsList = [
    {
      id: "running-bond",
      label: "Running",
      sub: isEn ? "Half Shift" : "Yarım Kaydırma",
      icon: (
        <svg viewBox="0 0 48 32" className="pattern-svg-icon" fill="currentColor">
          <rect x="2" y="2" width="20" height="7" rx="1" />
          <rect x="24" y="2" width="22" height="7" rx="1" />
          <rect x="2" y="11" width="10" height="7" rx="1" />
          <rect x="14" y="11" width="20" height="7" rx="1" />
          <rect x="36" y="11" width="10" height="7" rx="1" />
          <rect x="2" y="20" width="20" height="7" rx="1" />
          <rect x="24" y="20" width="22" height="7" rx="1" />
        </svg>
      )
    },
    {
      id: "one-third-bond",
      label: "Stepped",
      sub: isEn ? "1/3 Offset" : "1/3 Şaşırtma",
      icon: (
        <svg viewBox="0 0 48 32" className="pattern-svg-icon" fill="currentColor">
          <rect x="2" y="2" width="20" height="7" rx="1" />
          <rect x="24" y="2" width="22" height="7" rx="1" />
          <rect x="2" y="11" width="7" height="7" rx="1" />
          <rect x="11" y="11" width="20" height="7" rx="1" />
          <rect x="33" y="11" width="13" height="7" rx="1" />
          <rect x="2" y="20" width="14" height="7" rx="1" />
          <rect x="18" y="20" width="20" height="7" rx="1" />
          <rect x="40" y="20" width="6" height="7" rx="1" />
        </svg>
      )
    },
    {
      id: "stack-horizontal",
      label: "Grid",
      sub: isEn ? "Stack Bond" : "Düz Hizalı",
      icon: (
        <svg viewBox="0 0 48 32" className="pattern-svg-icon" fill="currentColor">
          <rect x="2" y="2" width="13" height="7" rx="1" />
          <rect x="17" y="2" width="13" height="7" rx="1" />
          <rect x="32" y="2" width="14" height="7" rx="1" />
          <rect x="2" y="11" width="13" height="7" rx="1" />
          <rect x="17" y="11" width="13" height="7" rx="1" />
          <rect x="32" y="11" width="14" height="7" rx="1" />
          <rect x="2" y="20" width="13" height="7" rx="1" />
          <rect x="17" y="20" width="13" height="7" rx="1" />
          <rect x="32" y="20" width="14" height="7" rx="1" />
        </svg>
      )
    },
    {
      id: "basketweave",
      label: "Basket",
      sub: isEn ? "Cross Weave" : "Sepet Örgü",
      icon: (
        <svg viewBox="0 0 48 32" className="pattern-svg-icon" fill="currentColor">
          <rect x="2" y="2" width="19" height="6" rx="1" />
          <rect x="2" y="10" width="19" height="6" rx="1" />
          <rect x="24" y="2" width="6" height="14" rx="1" />
          <rect x="32" y="2" width="6" height="14" rx="1" />
          <rect x="40" y="2" width="6" height="14" rx="1" />
          <rect x="2" y="18" width="6" height="12" rx="1" />
          <rect x="10" y="18" width="6" height="12" rx="1" />
          <rect x="18" y="18" width="6" height="12" rx="1" />
          <rect x="26" y="18" width="20" height="5.5" rx="1" />
          <rect x="26" y="25" width="20" height="5.5" rx="1" />
        </svg>
      )
    },
    {
      id: "flemish-bond",
      label: "Flemish",
      sub: isEn ? "Flemish Bond" : "Flaman Örgüsü",
      icon: (
        <svg viewBox="0 0 48 32" className="pattern-svg-icon" fill="currentColor">
          <rect x="2" y="2" width="20" height="7" rx="1" />
          <rect x="24" y="2" width="8" height="7" rx="1" />
          <rect x="34" y="2" width="12" height="7" rx="1" />
          <rect x="2" y="11" width="8" height="7" rx="1" />
          <rect x="12" y="11" width="20" height="7" rx="1" />
          <rect x="34" y="11" width="12" height="7" rx="1" />
          <rect x="2" y="20" width="20" height="7" rx="1" />
          <rect x="24" y="20" width="8" height="7" rx="1" />
          <rect x="34" y="20" width="12" height="7" rx="1" />
        </svg>
      )
    },
    {
      id: "herringbone",
      label: "Creative",
      sub: isEn ? "Herringbone" : "Balıksırtı",
      icon: (
        <svg viewBox="0 0 48 32" className="pattern-svg-icon" fill="currentColor">
          <path d="M10 4L22 14L18 18L6 8Z" />
          <path d="M22 14L34 4L38 8L26 18Z" />
          <path d="M10 16L22 26L18 30L6 20Z" />
          <path d="M22 26L34 16L38 20L26 30Z" />
        </svg>
      )
    }
  ];

  return (
    <aside className="studio-isiklar-left-panel">
      {/* 1. Header with Brand & Active Product */}
      <div className="panel-brand-header">
        <svg className="brick-fan-icon" viewBox="0 0 40 28" fill="none">
          <path d="M4 24L8 8L16 10L12 26L4 24Z" fill="#8C2D19" />
          <path d="M14 26L18 6L26 6L22 26L14 26Z" fill="#A3351E" />
          <path d="M24 26L28 8L36 10L32 24L24 26Z" fill="#B83F24" />
        </svg>
        <div className="brand-product-meta">
          <h2 className="active-prod-title">
            {selectedProduct ? selectedProduct.stokAdi : isEn ? "Select Product" : "Ürün Seçin"}
          </h2>
          <span className="active-prod-category">
            {selectedProduct ? selectedProduct.anaKategori : isEn ? "Architectural Facing Bricks" : "Naturel Kaplama Tuğlalar"}
          </span>
        </div>
      </div>

      {/* 2. Terracotta Mix Button */}
      <button
        className="btn-terracotta-mix"
        onClick={onOpenMixModal}
        title="Karışım Hazırla Ekranını Aç"
      >
        <Layers size={16} />
        <span>{isEn ? "Prepare Brick Blend" : "Karışım Hazırla"}</span>
      </button>

      <hr className="panel-divider" />

      {/* 3. Dizilim Çeşitleri (Bonding Patterns) */}
      <div className="panel-section">
        <h3 className="section-heading">{isEn ? "Bonding Patterns" : "Dizilim Çeşitleri"}</h3>
        <div className="pattern-grid-3x2">
          {patternsList.map((p) => {
            const isSelected = patternId === p.id;
            return (
              <button
                key={p.id}
                className={`pattern-card-item ${isSelected ? "selected" : ""}`}
                onClick={() => setPatternId(p.id)}
                title={p.sub}
              >
                <div className="pattern-card-icon-frame">{p.icon}</div>
                <span className="pattern-card-label">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Açı / Rotation (0° vs 90°) */}
      <div className="panel-section">
        <h3 className="section-heading">{isEn ? "Orientation Angle" : "Açı"}</h3>
        <div className="segmented-pills-row">
          {[
            { angle: 0, label: "0° (Yatay)" },
            { angle: 90, label: "90° (Dikey)" }
          ].map((opt) => (
            <button
              key={opt.angle}
              className={`segmented-pill-btn ${rotation === opt.angle ? "selected" : ""}`}
              onClick={() => setRotation(opt.angle)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Derz Kalınlığı (Joint Thickness) */}
      <div className="panel-section">
        <h3 className="section-heading">{isEn ? "Joint Thickness" : "Derz Kalınlığı"}</h3>
        <div className="segmented-pills-row four-cols">
          {[
            { width: 0, label: "0 mm" },
            { width: 8, label: "8 mm" },
            { width: 10, label: "10 mm" },
            { width: 12, label: "12 mm" }
          ].map((g) => (
            <button
              key={g.width}
              className={`segmented-pill-btn ${groutWidthMm === g.width ? "selected" : ""}`}
              onClick={() => setGroutWidthMm(g.width)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Derz Rengi (Mortar Colors) */}
      <div className="panel-section">
        <h3 className="section-heading">{isEn ? "Mortar Color" : "Derz Rengi"}</h3>
        <div className="grout-colors-palette">
          {GROUT_COLORS.map((gc) => (
            <button
              key={gc.id}
              className={`grout-circle-swatch ${groutColorId === gc.id ? "selected" : ""}`}
              style={{ backgroundColor: gc.hex }}
              onClick={() => setGroutColorId(gc.id)}
              title={isEn ? gc.nameEn : gc.nameTr}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
