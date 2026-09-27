// src/studio/components/StudioSidebarRight.jsx
import React, { useState } from 'react';
import { Sliders, Grid3X3, Palette, Maximize, ExternalLink, ChevronDown, ChevronUp, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { PATTERNS } from '../data/patterns';
import { GROUT_COLORS, GROUT_WIDTHS } from '../data/groutColors';

export default function StudioSidebarRight({
  patternId,
  setPatternId,
  scale,
  setScale,
  groutWidthMm,
  setGroutWidthMm,
  groutColorId,
  setGroutColorId,
  rotation,
  setRotation,
  selectedProduct,
  onNavigateToProduct,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  isEn
}) {
  // Collapsible accordion state for right panel
  const [openSections, setOpenSections] = useState({
    pattern: true,
    material: true,
    view: true
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="studio-sidebar studio-sidebar-right">
      <div className="sidebar-right-header">
        <Sliders size={16} />
        <h3>{isEn ? 'Architectural Configurator' : 'Mimari Yapılandırma'}</h3>
      </div>

      <div className="sidebar-content-scroll">
        {/* ACCORDION 1: DİZİLİM & FORM */}
        <div className="studio-accordion-card">
          <div className="accordion-header" onClick={() => toggleSection('pattern')}>
            <div className="sec-title-flex">
              <Grid3X3 size={15} />
              <h4>{isEn ? '1. Laying & Geometry' : '1. Döşeme & Dizilim'}</h4>
            </div>
            <button className="acc-toggle-icon">
              {openSections.pattern ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {openSections.pattern && (
            <div className="accordion-body">
              {/* Pattern Grid */}
              <div className="patterns-selection-grid">
                {PATTERNS.map((pat) => {
                  const isSelected = patternId === pat.id;
                  return (
                    <button
                      key={pat.id}
                      className={`pattern-option-card ${isSelected ? 'active' : ''}`}
                      onClick={() => setPatternId(pat.id)}
                      title={isEn ? pat.descEn : pat.descTr}
                    >
                      <span className="pat-name">{isEn ? pat.nameEn : pat.nameTr}</span>
                    </button>
                  );
                })}
              </div>

              {/* Relative Scale Slider */}
              <div className="control-subblock">
                <div className="label-with-value">
                  <span className="sublabel">{isEn ? 'Brick Scale (Relative Size)' : 'Tuğla Ölçeği (Boyut)'}</span>
                  <span className="value-badge">{Math.round(scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="studio-slider"
                />
                <div className="slider-presets-row">
                  {[0.75, 1.0, 1.25, 1.5].map((preset) => (
                    <button
                      key={preset}
                      className={`preset-btn ${scale === preset ? 'active' : ''}`}
                      onClick={() => setScale(preset)}
                    >
                      {preset}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Angle / Rotation */}
              <div className="control-subblock">
                <span className="sublabel">{isEn ? 'Laying Angle' : 'Döşeme Açısı'}</span>
                <div className="rotation-buttons-row">
                  {[
                    { val: 0, labelTr: '0° Yatay', labelEn: '0° Horiz.' },
                    { val: 90, labelTr: '90° Dikey', labelEn: '90° Vert.' },
                    { val: 45, labelTr: '45° Çapraz', labelEn: '45° Diag.' }
                  ].map((rot) => (
                    <button
                      key={rot.val}
                      className={`rot-btn ${rotation === rot.val ? 'active' : ''}`}
                      onClick={() => setRotation(rot.val)}
                    >
                      {isEn ? rot.labelEn : rot.labelTr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 2: MALZEME & DERZ */}
        <div className="studio-accordion-card">
          <div className="accordion-header" onClick={() => toggleSection('material')}>
            <div className="sec-title-flex">
              <Palette size={15} />
              <h4>{isEn ? '2. Material & Grout' : '2. Malzeme & Derz'}</h4>
            </div>
            <button className="acc-toggle-icon">
              {openSections.material ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {openSections.material && (
            <div className="accordion-body">
              {/* Selected Material Card */}
              {selectedProduct && (
                <div className="studio-active-product-card">
                  <span className="card-top-tag">{isEn ? 'ACTIVE BRICK' : 'SEÇİLİ TUĞLA'}</span>
                  <div className="card-top-flex">
                    <img
                      src={selectedProduct.mainImage || (selectedProduct.images && selectedProduct.images[0])}
                      alt={selectedProduct.stokAdi}
                      className="prod-card-thumb"
                    />
                    <div className="prod-card-info">
                      <span className="prod-stock-code">{selectedProduct.stokKodu}</span>
                      <h5 className="prod-name">{selectedProduct.stokAdi}</h5>
                      <span className="prod-cat">{selectedProduct.anaKategori}</span>
                    </div>
                  </div>
                  {onNavigateToProduct && (
                    <button
                      className="btn-view-product-spec"
                      onClick={() => onNavigateToProduct(selectedProduct)}
                    >
                      <span>{isEn ? 'Technical Details' : 'Teknik Föyü İncele'}</span>
                      <ExternalLink size={13} />
                    </button>
                  )}
                </div>
              )}

              {/* Grout Width */}
              <div className="control-subblock">
                <div className="label-with-value">
                  <span className="sublabel">{isEn ? 'Grout Width' : 'Derz Kalınlığı'}</span>
                  <span className="value-badge">{groutWidthMm === 0 ? (isEn ? 'No Grout' : 'Derzsiz') : `${groutWidthMm} mm`}</span>
                </div>
                <div className="grout-widths-grid">
                  {GROUT_WIDTHS.map((gw) => (
                    <button
                      key={gw.value}
                      className={`gw-btn ${groutWidthMm === gw.value ? 'active' : ''}`}
                      onClick={() => setGroutWidthMm(gw.value)}
                    >
                      {gw.labelShort}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grout Color */}
              <div className="control-subblock">
                <span className="sublabel">{isEn ? 'Grout Color' : 'Derz Harcı Rengi'}</span>
                <div className="grout-colors-row">
                  {GROUT_COLORS.map((gc) => {
                    const isSelected = groutColorId === gc.id;
                    return (
                      <button
                        key={gc.id}
                        className={`grout-color-swatch ${isSelected ? 'active' : ''}`}
                        onClick={() => setGroutColorId(gc.id)}
                        title={isEn ? gc.nameEn : gc.nameTr}
                        style={{ backgroundColor: gc.hex }}
                      >
                        {isSelected && <span className="swatch-check">✓</span>}
                      </button>
                    );
                  })}
                </div>
                <div className="active-grout-color-label">
                  {GROUT_COLORS.find((c) => c.id === groutColorId)?.[isEn ? 'nameEn' : 'nameTr']}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 3: GÖRÜNÜM & VIEWPORT */}
        <div className="studio-accordion-card">
          <div className="accordion-header" onClick={() => toggleSection('view')}>
            <div className="sec-title-flex">
              <Maximize size={15} />
              <h4>{isEn ? '3. View & Zoom' : '3. Görünüm & Zoom'}</h4>
            </div>
            <button className="acc-toggle-icon">
              {openSections.view ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {openSections.view && (
            <div className="accordion-body">
              <div className="view-actions-grid">
                <button className="btn-view-action" onClick={onZoomOut} title="Zoom Out">
                  <ZoomOut size={15} />
                  <span>{isEn ? 'Zoom Out' : 'Uzaklaş'}</span>
                </button>
                <div className="zoom-indicator-pill">{Math.round((zoom || 1) * 100)}%</div>
                <button className="btn-view-action" onClick={onZoomIn} title="Zoom In">
                  <ZoomIn size={15} />
                  <span>{isEn ? 'Zoom In' : 'Yakınlaş'}</span>
                </button>
              </div>
              <button className="btn-view-reset" onClick={onResetView}>
                <RotateCcw size={14} />
                <span>{isEn ? 'Reset Scene View' : 'Görünümü Sıfırla'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
