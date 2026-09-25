import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Download, 
  MessageSquare, 
  ArrowRight, 
  ExternalLink,
  Sparkles,
  Columns,
  RotateCcw,
  Check
} from 'lucide-react';
import { 
  STUDIO_SURFACES, 
  STUDIO_PATTERNS, 
  STUDIO_MORTARS, 
  STUDIO_MORTAR_WIDTHS, 
  getStudioProducts,
  decodeDesignFromUrl
} from './studioData';
import StudioCanvas from './StudioCanvas';
import CanvasToolbar from './CanvasToolbar';
import StudioControls from './StudioControls';
import DesignSummary from './DesignSummary';
import SaveDesignModal from './SaveDesignModal';
import StudioBeforeAfterSlider from './StudioBeforeAfterSlider';

export default function StudioPage({ lang = 'TR', onNavigate }) {
  const isEn = lang === 'EN';
  const allProducts = getStudioProducts();

  // Central Design State
  const [surface, setSurface] = useState(STUDIO_SURFACES[0]);
  const [zone, setZone] = useState(STUDIO_SURFACES[0].zones[0]);
  const [primaryProduct, setPrimaryProduct] = useState(allProducts[0] || null);
  const [pattern, setPattern] = useState(STUDIO_PATTERNS[0]);
  const [rotation, setRotation] = useState(0);
  const [mortar, setMortar] = useState(STUDIO_MORTARS[1]);
  const [mortarWidth, setMortarWidth] = useState(STUDIO_MORTAR_WIDTHS[2]);
  const [scale, setScale] = useState(1.0);

  // Mix State
  const [isMixActive, setIsMixActive] = useState(false);
  const [mixProducts, setMixProducts] = useState(
    allProducts.slice(0, 2).map((p, idx) => ({
      product: p,
      percentage: idx === 0 ? 60 : 40
    }))
  );

  // Viewport State
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(false);
  const [isBeforeAfter, setIsBeforeAfter] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals & Canvas Ref
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [canvasDataUrl, setCanvasDataUrl] = useState('');
  const [canvasElement, setCanvasElement] = useState(null);

  const containerRef = useRef(null);

  // Parse URL on load for shared design or target product
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const designParam = searchParams.get('design');
      const prodParam = searchParams.get('product') || searchParams.get('stok');

      if (designParam) {
        const decoded = decodeDesignFromUrl(designParam, allProducts);
        if (decoded) {
          if (decoded.surface) setSurface(decoded.surface);
          if (decoded.zone) setZone(decoded.zone);
          if (decoded.primaryProduct) setPrimaryProduct(decoded.primaryProduct);
          if (decoded.pattern) setPattern(decoded.pattern);
          if (decoded.rotation !== undefined) setRotation(decoded.rotation);
          if (decoded.mortar) setMortar(decoded.mortar);
          if (decoded.mortarWidth) setMortarWidth(decoded.mortarWidth);
          if (decoded.scale) setScale(decoded.scale);
          if (decoded.isMixActive) {
            setIsMixActive(true);
            setMixProducts(decoded.mixProducts);
          }
        }
      } else if (prodParam) {
        const found = allProducts.find(p => p.stokKodu?.toLowerCase() === prodParam.toLowerCase() || p.id === prodParam);
        if (found) {
          setPrimaryProduct(found);
        }
      }

      // Check onboarding cookie/localStorage
      const seen = localStorage.getItem('tugla_studio_onboard_v2');
      if (!seen && !designParam) {
        setShowOnboarding(true);
      }
    } catch (e) {}
  }, []);

  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
    try {
      localStorage.setItem('tugla_studio_onboard_v2', 'true');
    } catch (e) {}
  };

  // Pan Mouse Handlers
  const handleMouseDown = (e) => {
    if (isBeforeAfter) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isBeforeAfter) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Zoom Controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleRotate = () => {
    setRotation(prev => (prev === 0 ? 90 : 0));
  };

  const handleCanvasReady = (canvas) => {
    setCanvasElement(canvas);
    try {
      setCanvasDataUrl(canvas.toDataURL('image/jpeg', 0.92));
    } catch (e) {}
  };

  // Direct PNG Download
  const handleDownloadPng = () => {
    if (!canvasElement) return;
    const a = document.createElement('a');
    a.href = canvasElement.toDataURL('image/png');
    a.download = `Tugla-Dunyasi-Studio-${primaryProduct?.stokKodu || 'Design'}.png`;
    a.click();
  };

  // Load design from saved modal
  const handleLoadSavedDesign = (saved) => {
    if (!saved) return;
    if (saved.surface) setSurface(saved.surface);
    if (saved.zone) setZone(saved.zone);
    if (saved.primaryProduct) setPrimaryProduct(saved.primaryProduct);
    if (saved.pattern) setPattern(saved.pattern);
    if (saved.rotation !== undefined) setRotation(saved.rotation);
    if (saved.mortar) setMortar(saved.mortar);
    if (saved.mortarWidth) setMortarWidth(saved.mortarWidth);
    if (saved.scale) setScale(saved.scale);
    if (saved.isMixActive !== undefined) {
      setIsMixActive(saved.isMixActive);
      setMixProducts(saved.mixProducts || []);
    }
  };

  // Navigate to product detail
  const handleInspectProduct = (prod) => {
    if (onNavigate) {
      if (window.history && prod?.stokKodu) {
        window.history.pushState({ tab: 'urun-detay', product: prod }, '', `/urunler/${encodeURIComponent(prod.stokKodu)}`);
      }
      onNavigate('urunler');
    }
  };

  return (
    <div className="studio-main-container" ref={containerRef}>
      <div className="studio-split-layout">
        {/* Left Side: Canvas Visualization Area */}
        <div className="canvas-interactive-panel">
          {/* Toolbar Header */}
          <CanvasToolbar
            lang={lang}
            isBeforeAfter={isBeforeAfter}
            onToggleBeforeAfter={() => setIsBeforeAfter(!isBeforeAfter)}
            showGrid={showGrid}
            onToggleGrid={() => setShowGrid(!showGrid)}
            rotation={rotation}
            onRotate={handleRotate}
            supportedRotations={pattern?.supportedRotations || [0, 90]}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            surfaceTitle={isEn ? surface?.nameEn : surface?.name}
            productTitle={isMixActive ? (isEn ? 'MIX Blend' : 'MIX Karışımı') : primaryProduct?.stokAdi}
          />

          {/* Canvas Viewport */}
          <div
            className={`canvas-stage-wrapper ${isDragging ? 'grabbing' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {isBeforeAfter ? (
              <StudioBeforeAfterSlider
                beforeImage={surface?.thumbnail}
                afterCanvasDataUrl={canvasDataUrl}
                lang={lang}
              />
            ) : (
              <StudioCanvas
                surface={surface}
                primaryProduct={primaryProduct}
                pattern={pattern}
                rotation={rotation}
                mortar={mortar}
                mortarWidth={mortarWidth}
                scale={scale}
                zone={zone}
                isMixActive={isMixActive}
                mixProducts={mixProducts}
                zoom={zoom}
                pan={pan}
                showGrid={showGrid}
                onCanvasReady={handleCanvasReady}
              />
            )}

            {/* Floating Technical Design Summary Badge */}
            <div className="floating-summary-pos">
              <DesignSummary
                lang={lang}
                surface={surface}
                primaryProduct={primaryProduct}
                pattern={pattern}
                rotation={rotation}
                mortar={mortar}
                mortarWidth={mortarWidth}
                isMixActive={isMixActive}
                mixProducts={mixProducts}
                zone={zone}
              />
            </div>

            {/* Pan Hint */}
            {!isBeforeAfter && (
              <div className="pan-hint-pill">
                <span>{isEn ? 'Drag to pan • Scroll or buttons to zoom' : 'Kaydırmak için sürükleyin • Yakınlaştırmak için butonları kullanın'}</span>
              </div>
            )}
          </div>

          {/* Bottom Action Command Bar */}
          <div className="canvas-bottom-bar">
            <div className="command-left-actions">
              <button onClick={() => setShowSaveModal(true)} className="cmd-btn secondary">
                <Save size={15} />
                <span>{isEn ? 'Save / Share' : 'Projeyi Kaydet & Paylaş'}</span>
              </button>

              <button onClick={handleDownloadPng} className="cmd-btn secondary">
                <Download size={15} />
                <span>{isEn ? 'Download Render' : 'Görseli İndir (PNG)'}</span>
              </button>

              {!isMixActive && primaryProduct && (
                <button onClick={() => handleInspectProduct(primaryProduct)} className="cmd-btn subtle">
                  <ExternalLink size={14} />
                  <span>{isEn ? 'Inspect Brick Details' : 'Ürünü İncele'}</span>
                </button>
              )}
            </div>

            <div className="command-right-actions">
              <button
                onClick={() => setShowSaveModal(true)}
                className="cmd-btn primary-cta"
              >
                <MessageSquare size={16} />
                <span>{isEn ? 'Request Quote for This Design' : 'Bu Tasarım İçin Teklif Al'}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Studio Controls Panel */}
        <div className="controls-sidebar-panel">
          <StudioControls
            lang={lang}
            allProducts={allProducts}
            surface={surface}
            onSelectSurface={(s) => {
              setSurface(s);
              if (s.zones && s.zones.length > 0) setZone(s.zones[0]);
            }}
            zone={zone}
            onSelectZone={setZone}
            primaryProduct={primaryProduct}
            onSelectProduct={setPrimaryProduct}
            pattern={pattern}
            onSelectPattern={setPattern}
            rotation={rotation}
            onSetRotation={setRotation}
            mortar={mortar}
            onSelectMortar={setMortar}
            mortarWidth={mortarWidth}
            onSelectMortarWidth={setMortarWidth}
            scale={scale}
            onChangeScale={setScale}
            isMixActive={isMixActive}
            onToggleMix={() => setIsMixActive(!isMixActive)}
            mixProducts={mixProducts}
            onUpdateMixProducts={setMixProducts}
            onInspectProduct={handleInspectProduct}
          />
        </div>
      </div>

      {/* Save / Share / Quote Modal */}
      {showSaveModal && (
        <SaveDesignModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          lang={lang}
          designData={{
            surface,
            primaryProduct,
            pattern,
            rotation,
            mortar,
            mortarWidth,
            scale,
            zone,
            isMixActive,
            mixProducts
          }}
          canvasElement={canvasElement}
          onLoadSavedDesign={handleLoadSavedDesign}
        />
      )}

      {/* Onboarding Welcome Splash */}
      {showOnboarding && (
        <div className="onboarding-splash-overlay" onClick={handleDismissOnboarding}>
          <div className="onboarding-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="onboarding-tag">
              <Sparkles size={16} />
              <span>TUĞLA DÜNYASI ARCHITECTURAL STUDIO</span>
            </div>
            <h2 className="onboarding-heading">
              {isEn ? 'Design Your Architectural Brick Facade' : 'Hayalinizdeki Cepheyi İnteraktif Tasarlayın'}
            </h2>
            <p className="onboarding-subtitle">
              {isEn
                ? 'Experience Tuğla Dünyası authentic bricks, cladding tiles, and klinker products on photorealistic architectural structures.'
                : 'Tuğla Dünyası ürünlerini villalar, müstakil konutlar, loft mekanlar ve bahçe duvarları üzerinde dilediğiniz dizilim ve derz seçenekleriyle interaktif olarak deneyin.'}
            </p>

            <div className="onboarding-features-list">
              <div className="feat-step">
                <span className="step-circle">1</span>
                <div>
                  <h5>{isEn ? 'Select Architectural Scene' : 'Mimari Yapıyı Seçin'}</h5>
                  <p>{isEn ? 'Choose from villas, residences, restaurants, and landscape walls.' : 'Modern villa, konut, loft restoran veya bahçe duvarlarından projenize uygun olanı seçin.'}</p>
                </div>
              </div>

              <div className="feat-step">
                <span className="step-circle">2</span>
                <div>
                  <h5>{isEn ? 'Apply Bricks & MIX Blends' : 'Tuğla & MIX Karışımları Belirleyin'}</h5>
                  <p>{isEn ? 'Filter from real catalog products, customize bonds, rotations, and grout colors.' : 'Gerçek ürün kataloğumuzdan seçim yapın; dizilim, yön ve derz harcı rengini özelleştirin.'}</p>
                </div>
              </div>

              <div className="feat-step">
                <span className="step-circle">3</span>
                <div>
                  <h5>{isEn ? 'Inspect, Save & Get Quotation' : 'İnceleyin, Kaydedin ve Teklif Alın'}</h5>
                  <p>{isEn ? 'Compare before/after, download renders, or send specifications directly to WhatsApp advisors.' : 'Önce/sonra farkını görün, render indirin ve doğrudan WhatsApp bölge sorumlunuza teklif gönderin.'}</p>
                </div>
              </div>
            </div>

            <button className="btn-begin-design" onClick={handleDismissOnboarding}>
              <span>{isEn ? 'Start Designing' : 'Tasarıma Başla'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .studio-main-container {
          width: 100%;
          min-height: calc(100vh - 76px);
          background: #141210;
          color: #FAF8F5;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .studio-split-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          flex-grow: 1;
          height: calc(100vh - 76px);
          overflow: hidden;
        }

        .canvas-interactive-panel {
          display: flex;
          flex-direction: column;
          background: #0E0D0C;
          position: relative;
          overflow: hidden;
        }

        .canvas-stage-wrapper {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #0E0D0C;
          overflow: hidden;
          cursor: grab;
          padding: 16px;
        }
        .canvas-stage-wrapper.grabbing {
          cursor: grabbing;
        }

        .floating-summary-pos {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 10;
        }

        .pan-hint-pill {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(20, 18, 16, 0.8);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 0.72rem;
          color: #A8A29E;
          pointer-events: none;
        }

        .canvas-bottom-bar {
          height: 68px;
          background: #181614;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          z-index: 10;
        }
        .command-left-actions, .command-right-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cmd-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cmd-btn.secondary {
          background: #25221F;
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
        }
        .cmd-btn.secondary:hover {
          background: #302C28;
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }
        .cmd-btn.subtle {
          background: none;
          border: 1px solid transparent;
          color: #A8A29E;
          font-weight: 600;
        }
        .cmd-btn.subtle:hover {
          color: #FFFFFF;
          border-color: rgba(255, 255, 255, 0.15);
        }
        .cmd-btn.primary-cta {
          background: var(--accent-terracotta);
          border: 1.5px solid var(--accent-terracotta);
          color: #FFFFFF;
          box-shadow: 0 6px 20px rgba(224, 90, 48, 0.35);
        }
        .cmd-btn.primary-cta:hover {
          background: #FF6E38;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(224, 90, 48, 0.5);
        }

        .controls-sidebar-panel {
          background: #181614;
          height: 100%;
          overflow: hidden;
        }

        /* Onboarding Splash */
        .onboarding-splash-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.86);
          backdrop-filter: blur(10px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .onboarding-modal-card {
          background: #1C1A18;
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          max-width: 580px;
          width: 100%;
          padding: 38px 36px;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.85);
          color: #FAF8F5;
        }
        .onboarding-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          font-weight: 800;
          color: var(--accent-terracotta);
          letter-spacing: 0.12em;
          margin-bottom: 12px;
        }
        .onboarding-heading {
          font-size: 2rem;
          font-weight: 900;
          color: #FFFFFF;
          margin: 0 0 12px 0;
          font-family: var(--font-heading);
          line-height: 1.2;
        }
        .onboarding-subtitle {
          font-size: 0.92rem;
          color: #A8A29E;
          line-height: 1.6;
          margin: 0 0 28px 0;
        }
        .onboarding-features-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 30px;
        }
        .feat-step {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .step-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(224, 90, 48, 0.15);
          color: var(--accent-terracotta);
          border: 1px solid rgba(224, 90, 48, 0.35);
          font-weight: 800;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .feat-step h5 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 3px 0;
        }
        .feat-step p {
          font-size: 0.82rem;
          color: #A8A29E;
          margin: 0;
          line-height: 1.4;
        }
        .btn-begin-design {
          width: 100%;
          padding: 14px;
          background: var(--accent-terracotta);
          border: none;
          border-radius: 10px;
          color: #FFFFFF;
          font-size: 1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 8px 24px rgba(224, 90, 48, 0.35);
        }
        .btn-begin-design:hover {
          background: #FF6E38;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(224, 90, 48, 0.5);
        }

        @media (max-width: 1080px) {
          .studio-split-layout {
            grid-template-columns: 1fr;
            grid-template-rows: 55vh 1fr;
            height: auto;
          }
          .canvas-interactive-panel {
            height: 55vh;
          }
          .canvas-bottom-bar {
            padding: 0 14px;
          }
          .controls-sidebar-panel {
            height: 520px;
          }
        }
      `}</style>
    </div>
  );
}
