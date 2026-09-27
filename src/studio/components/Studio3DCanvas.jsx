// src/studio/components/Studio3DCanvas.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Studio3DEngine } from "../engine/Studio3DEngine";
import { Download, MapPin, MessageSquare, ZoomIn, ZoomOut, RotateCcw, Sparkles } from "lucide-react";
import StudioSceneSelector from "./StudioSceneSelector";

export default function Studio3DCanvas({
  selectedProduct,
  selectedTemplate,
  onSelectTemplate,
  textureImg,
  isTextureLoading,
  patternId,
  scale,
  groutWidthMm,
  groutColorId,
  rotation,
  onOpenQuoteModal,
  onOpenProductPicker,
  onSelectQuickProduct,
  isEn
}) {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const [isSceneStripOpen, setIsSceneStripOpen] = useState(true);
  const [zoomPercent, setZoomPercent] = useState(100);

  // Initialize 3D Engine on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = new Studio3DEngine();
    engine.init(container);
    engineRef.current = engine;

    const interval = setInterval(() => {
      if (engineRef.current) {
        setZoomPercent(engineRef.current.getZoomPercent());
      }
    }, 200);

    const observer = new ResizeObserver(() => {
      if (engineRef.current) {
        engineRef.current.resize();
      }
    });
    observer.observe(container);

    return () => {
      clearInterval(interval);
      observer.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Update 3D Scene when template changes
  useEffect(() => {
    if (engineRef.current && selectedTemplate) {
      engineRef.current.buildArchitecturalScene(selectedTemplate.id);
      if (textureImg) {
        engineRef.current.updateBrickMaterial(textureImg, {
          patternId,
          scale,
          groutWidthMm,
          groutColorId,
          rotation,
          product: selectedProduct
        });
      }
    }
  }, [selectedTemplate]);

  // Update PBR Material when texture or layout parameters change
  useEffect(() => {
    if (engineRef.current && textureImg) {
      engineRef.current.updateBrickMaterial(textureImg, {
        patternId,
        scale,
        groutWidthMm,
        groutColorId,
        rotation,
        product: selectedProduct
      });
    }
  }, [textureImg, patternId, scale, groutWidthMm, groutColorId, rotation, selectedProduct]);

  // Zoom Controls
  const handleZoomIn = () => {
    if (engineRef.current) {
      engineRef.current.zoomIn();
      setZoomPercent(engineRef.current.getZoomPercent());
    }
  };

  const handleZoomOut = () => {
    if (engineRef.current) {
      engineRef.current.zoomOut();
      setZoomPercent(engineRef.current.getZoomPercent());
    }
  };

  const handleResetView = () => {
    if (engineRef.current) {
      engineRef.current.resetView();
      setZoomPercent(100);
    }
  };

  // Download Snapshot
  const handleDownloadSnapshot = () => {
    if (!engineRef.current) return;
    const dataUrl = engineRef.current.getSnapshotDataURL();
    if (!dataUrl) return;

    const link = document.createElement("a");
    const code = selectedProduct && selectedProduct.stokKodu ? selectedProduct.stokKodu : "Design";
    link.download = `Tugla_Dunyasi_Studio_${code}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="studio-canvas-container studio-isiklar-canvas" ref={containerRef}>
      {/* 1. TOP RIGHT ACTION BUTTONS */}
      <div className="studio-canvas-top-actions">
        <button
          className="btn-top-action-terracotta"
          onClick={handleDownloadSnapshot}
          title={isEn ? "Download Design" : "Tasarımı İndir"}
        >
          <Download size={15} />
          <span>{isEn ? "Download Design" : "Tasarımı İndir"}</span>
        </button>

        <button
          className={`btn-top-action-terracotta ${isSceneStripOpen ? "active" : ""}`}
          onClick={() => setIsSceneStripOpen(!isSceneStripOpen)}
          title={isEn ? "Select Environment" : "Ortam Seçimi"}
        >
          <MapPin size={15} />
          <span>{isEn ? "Environment" : "Ortam Seçimi"}</span>
        </button>

        <button
          className="btn-top-action-terracotta quote-highlight"
          onClick={onOpenQuoteModal}
          disabled={!selectedProduct}
          title={isEn ? "Get WhatsApp Quote" : "Teklif Al"}
        >
          <MessageSquare size={15} />
          <span>{isEn ? "Get Quote" : "Teklif Al"}</span>
        </button>
      </div>

      {/* 2. FLOATING 2D-STYLE ZOOM & PAN CONTROLS */}
      <div className="studio-2d-zoom-controls">
        <button className="btn-zoom-circle" onClick={handleZoomIn} title={isEn ? "Zoom In" : "Yakınlaştır"}>
          <ZoomIn size={15} />
        </button>
        <span className="zoom-level-indicator">{zoomPercent}%</span>
        <button className="btn-zoom-circle" onClick={handleZoomOut} title={isEn ? "Zoom Out" : "Uzaklaştır"}>
          <ZoomOut size={15} />
        </button>
        <button className="btn-zoom-circle reset" onClick={handleResetView} title={isEn ? "Reset View" : "Görünümü Sıfırla"}>
          <RotateCcw size={13} />
        </button>
      </div>

      {/* 3. 2D NAVIGATION HINT */}
      <div className="studio-2d-pan-hint">
        <span>{isEn ? "Scroll wheel to zoom • Drag to pan across the facade" : "Fare tekerleğiyle yakınlaştırın • Sürükleyerek cephe üzerinde gezin"}</span>
      </div>

      {/* 4. RIGHT VERTICAL SCENE SELECTOR STRIP */}
      {isSceneStripOpen && (
        <StudioSceneSelector
          selectedTemplate={selectedTemplate}
          onSelectTemplate={(tmpl) => {
            onSelectTemplate(tmpl);
            handleResetView();
          }}
          isEn={isEn}
        />
      )}

      {/* 5. LOADING STATES */}
      {isTextureLoading && (
        <div className="studio-loading-overlay">
          <div className="loading-spinner" />
          <span>{isEn ? "Applying brick texture..." : "Tuğla dokusu uygulanıyor..."}</span>
        </div>
      )}

      {!selectedProduct && !isTextureLoading && (
        <div className="studio-unselected-overlay">
          <div className="unselected-modal-card">
            <div className="icon-pulse">
              <Sparkles size={28} />
            </div>
            <h3>{isEn ? "Welcome to Tuğla Dünyası Studio" : "Tuğla Dünyası Studio'ya Hoş Geldiniz"}</h3>
            <p>
              {isEn
                ? "Select a brick model from the bottom catalog to apply it directly onto this architectural facade."
                : "Alttaki katalogdan bir tuğla modeli seçerek mimari cepheye anında uygulayabilirsiniz."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
