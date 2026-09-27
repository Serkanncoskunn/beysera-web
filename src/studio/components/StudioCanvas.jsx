// src/studio/components/StudioCanvas.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StudioEngine } from '../engine/StudioEngine';
import { Download, MapPin, MessageSquare, ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';
import StudioSceneSelector from './StudioSceneSelector';

export default function StudioCanvas({
  selectedProduct,
  selectedTemplate,
  onSelectTemplate,
  activeSurfaceId,
  textureImg,
  isTextureLoading,
  baseImageElement,
  shadowImageElement,
  isTemplateLoading,
  patternId,
  scale,
  groutWidthMm,
  groutColorId,
  rotation,
  onOpenQuoteModal,
  onSelectQuickProduct,
  isEn
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // 2D Zoom & Pan Interactive State
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSceneStripOpen, setIsSceneStripOpen] = useState(true);

  // Re-render 2D Scene
  const renderCurrentScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedTemplate) return;

    StudioEngine.renderScene(canvas, selectedTemplate, textureImg, {
      patternId,
      scale,
      groutWidthMm,
      groutColorId,
      rotation,
      zoom,
      pan,
      activeSurfaceId,
      baseImageElement,
      shadowImageElement,
      product: selectedProduct
    });
  }, [
    selectedTemplate,
    textureImg,
    patternId,
    scale,
    groutWidthMm,
    groutColorId,
    rotation,
    zoom,
    pan,
    activeSurfaceId,
    baseImageElement,
    shadowImageElement,
    selectedProduct
  ]);

  useEffect(() => {
    renderCurrentScene();
  }, [renderCurrentScene]);

  // Handle Resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      renderCurrentScene();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [renderCurrentScene]);

  // Interactive Mouse Drag to Pan
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newPanX = e.clientX - dragStart.x;
    const newPanY = e.clientY - dragStart.y;
    setPan({ x: newPanX, y: newPanY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Interactive Mouse Wheel to Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    setZoom((prev) => {
      const nextZoom = Math.min(3.8, Math.max(1.0, prev * zoomFactor));
      if (nextZoom === 1.0) {
        setPan({ x: 0, y: 0 });
      }
      return nextZoom;
    });
  };

  // Zoom Button Controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.25, 3.8));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev * 0.8, 1.0);
      if (next === 1.0) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Download Snapshot
  const handleDownloadSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    const code = selectedProduct && selectedProduct.stokKodu ? selectedProduct.stokKodu : 'Design';
    link.download = `Tugla_Dunyasi_Studio_${code}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      className="studio-canvas-container studio-isiklar-canvas"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
    >
      {/* 1. TOP RIGHT ACTIONS (Matches Screenshot!) */}
      <div className="studio-canvas-top-actions">
        <button
          className="btn-top-action-terracotta"
          onClick={handleDownloadSnapshot}
          title={isEn ? 'Download Design' : 'Tasarımı İndir'}
        >
          <Download size={15} />
          <span>{isEn ? 'Download Design' : 'Tasarımı İndir'}</span>
        </button>

        <button
          className={`btn-top-action-terracotta ${isSceneStripOpen ? 'active' : ''}`}
          onClick={() => setIsSceneStripOpen(!isSceneStripOpen)}
          title={isEn ? 'Select Environment' : 'Ortam Seçimi'}
        >
          <MapPin size={15} />
          <span>{isEn ? 'Environment' : 'Ortam Seçimi'}</span>
        </button>

        <button
          className="btn-top-action-terracotta quote-highlight"
          onClick={onOpenQuoteModal}
          disabled={!selectedProduct}
          title={isEn ? 'Get WhatsApp Quote' : 'Teklif Al'}
        >
          <MessageSquare size={15} />
          <span>{isEn ? 'Get Quote' : 'Teklif Al'}</span>
        </button>
      </div>

      {/* 2. FLOATING 2D ZOOM CONTROLS (Bottom Left of Canvas) */}
      <div className="studio-2d-zoom-controls">
        <button className="btn-zoom-circle" onClick={handleZoomIn} title={isEn ? 'Zoom In' : 'Yakınlaştır'}>
          <ZoomIn size={15} />
        </button>
        <span className="zoom-level-indicator">{Math.round(zoom * 100)}%</span>
        <button className="btn-zoom-circle" onClick={handleZoomOut} title={isEn ? 'Zoom Out' : 'Uzaklaştır'}>
          <ZoomOut size={15} />
        </button>
        {zoom > 1.0 && (
          <button className="btn-zoom-circle reset" onClick={handleResetView} title={isEn ? 'Reset View' : 'Sıfırla'}>
            <RotateCcw size={13} />
          </button>
        )}
      </div>

      {/* 3. 2D NAVIGATION HINT */}
      <div className="studio-2d-pan-hint">
        <span>{isEn ? 'Scroll wheel to zoom • Drag to pan across the facade' : 'Fare tekerleğiyle yakınlaştırın • Sürükleyerek cephe üzerinde gezin'}</span>
      </div>

      {/* 4. MAIN FULL-BLEED CANVAS */}
      <canvas ref={canvasRef} className="studio-main-canvas" />

      {/* 5. RIGHT VERTICAL SCENE SELECTOR STRIP */}
      {isSceneStripOpen && (
        <StudioSceneSelector
          selectedTemplate={selectedTemplate}
          onSelectTemplate={(tmpl) => {
            onSelectTemplate(tmpl);
            setZoom(1.0);
            setPan({ x: 0, y: 0 });
          }}
          isEn={isEn}
        />
      )}

      {/* LOADING STATES */}
      {isTemplateLoading && (
        <div className="studio-loading-overlay">
          <div className="loading-spinner" />
          <span>{isEn ? 'Preparing architectural scene...' : 'Mimari ortam yükleniyor...'}</span>
        </div>
      )}

      {isTextureLoading && !isTemplateLoading && (
        <div className="studio-loading-overlay">
          <div className="loading-spinner" />
          <span>{isEn ? 'Applying brick texture...' : 'Tuğla dokusu uygulanıyor...'}</span>
        </div>
      )}

      {!selectedProduct && !isTextureLoading && !isTemplateLoading && (
        <div className="studio-unselected-overlay">
          <div className="unselected-modal-card">
            <div className="icon-pulse">
              <Sparkles size={28} />
            </div>
            <h3>{isEn ? 'Welcome to Tuğla Dünyası Studio' : 'Tuğla Dünyası Studio\'ya Hoş Geldiniz'}</h3>
            <p>
              {isEn
                ? 'Select a brick model from the bottom catalog to apply it directly onto this architectural facade.'
                : 'Alttaki katalogdan bir tuğla modeli seçerek mimari cepheye anında uygulayabilirsiniz.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
