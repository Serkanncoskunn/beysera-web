import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Columns, 
  Grid as GridIcon, 
  RotateCw,
  Sparkles
} from 'lucide-react';

export default function CanvasToolbar({
  lang = 'TR',
  isBeforeAfter,
  onToggleBeforeAfter,
  showGrid,
  onToggleGrid,
  rotation,
  onRotate,
  supportedRotations = [0, 90],
  onZoomIn,
  onZoomOut,
  onResetView,
  isFullscreen,
  onToggleFullscreen,
  surfaceTitle,
  productTitle
}) {
  const isEn = lang === 'EN';

  return (
    <div className="canvas-toolbar-container">
      {/* Left: Scene Status Badge */}
      <div className="toolbar-status-left">
        <span className="studio-brand-pill">
          <Sparkles size={13} className="sparkle-anim" />
          <span>STUDIO 2.5D</span>
        </span>
        <h3 className="toolbar-scene-name">{surfaceTitle || 'Modern Villa'}</h3>
        <span className="toolbar-product-name">{productTitle || 'Pres Tuğla'}</span>
      </div>

      {/* Right: Interactive Action Tools */}
      <div className="toolbar-actions-right">
        {/* Before / After Slider Toggle */}
        <button
          className={`toolbar-btn ${isBeforeAfter ? 'active' : ''}`}
          onClick={onToggleBeforeAfter}
          title={isEn ? 'Before / After Comparison' : 'Önce / Sonra Karşılaştırma'}
        >
          <Columns size={15} />
          <span className="btn-text-label">{isEn ? 'Before/After' : 'Önce/Sonra'}</span>
        </button>

        {/* Rotation Button (0° / 90°) if supported */}
        {supportedRotations.length > 1 && (
          <button
            className={`toolbar-btn ${rotation !== 0 ? 'active' : ''}`}
            onClick={onRotate}
            title={isEn ? `Rotate Pattern (${rotation}°)` : `Dizilimi Döndür (${rotation}°)`}
          >
            <RotateCw size={15} />
            <span className="btn-text-label">{rotation}°</span>
          </button>
        )}

        {/* Grid Toggle */}
        <button
          className={`toolbar-btn ${showGrid ? 'active' : ''}`}
          onClick={onToggleGrid}
          title={isEn ? 'Architectural Grid' : 'Mimari Izgara'}
        >
          <GridIcon size={15} />
        </button>

        {/* Zoom In */}
        <button className="toolbar-btn" onClick={onZoomIn} title={isEn ? 'Zoom In' : 'Yakınlaştır'}>
          <ZoomIn size={15} />
        </button>

        {/* Zoom Out */}
        <button className="toolbar-btn" onClick={onZoomOut} title={isEn ? 'Zoom Out' : 'Uzaklaştır'}>
          <ZoomOut size={15} />
        </button>

        {/* Reset View */}
        <button className="toolbar-btn" onClick={onResetView} title={isEn ? 'Reset View' : 'Görünümü Sıfırla'}>
          <RotateCcw size={15} />
        </button>

        {/* Fullscreen */}
        <button className="toolbar-btn" onClick={onToggleFullscreen} title={isEn ? 'Fullscreen' : 'Tam Ekran'}>
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>

      <style>{`
        .canvas-toolbar-container {
          height: 60px;
          background: #181614;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          z-index: 20;
          color: #FAF8F5;
        }
        .toolbar-status-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .studio-brand-pill {
          background: rgba(224, 90, 48, 0.15);
          color: var(--accent-terracotta);
          border: 1px solid rgba(224, 90, 48, 0.35);
          padding: 4px 9px;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .sparkle-anim {
          animation: spinPulse 2.5s infinite ease-in-out;
        }
        @keyframes spinPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        .toolbar-scene-name {
          font-size: 1.05rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          font-family: var(--font-heading);
        }
        .toolbar-product-name {
          font-size: 0.78rem;
          color: #A8A29E;
          background: rgba(255, 255, 255, 0.05);
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .toolbar-actions-right {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .toolbar-btn {
          background: #25221F;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #D6D3D1;
          padding: 7px 11px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 0.78rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .toolbar-btn:hover {
          color: #FFFFFF;
          border-color: rgba(255, 255, 255, 0.25);
          background: #2D2A26;
        }
        .toolbar-btn.active {
          background: var(--accent-terracotta);
          border-color: var(--accent-terracotta);
          color: #FFFFFF;
        }
        .btn-text-label {
          font-size: 0.76rem;
        }

        @media (max-width: 900px) {
          .canvas-toolbar-container {
            padding: 0 12px;
          }
          .toolbar-product-name {
            display: none;
          }
          .btn-text-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
