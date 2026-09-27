// src/studio/components/StudioModelViewerCanvas.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import "@google/model-viewer";
import { Download, MapPin, MessageSquare, ZoomIn, ZoomOut, RotateCcw, Sparkles, Sliders } from "lucide-react";
import { PatternEngine } from "../engine/PatternEngine";
import { getGroutColorById } from "../data/groutColors";
import { textureCache } from "../engine/TextureCache";
import StudioSceneSelector from "./StudioSceneSelector";

export default function StudioModelViewerCanvas({
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
  blendItems = null,
  onOpenMobileSidebar = () => {},
  isEn
}) {
  const modelViewerRef = useRef(null);
  const [isSceneStripOpen, setIsSceneStripOpen] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isApplyingTexture, setIsApplyingTexture] = useState(false);

  // Apply Live Texture to <model-viewer>
  const applyTexture = useCallback(async () => {
    const mv = modelViewerRef.current;
    if (!mv || !mv.model || !mv.model.materials) return;

    try {
      setIsApplyingTexture(true);

      const materials = mv.model.materials;
      // Find material named "tugla" or default to first material index 0
      let targetMat = materials.find(
        (m) => m.name && m.name.toLowerCase().includes("tugla")
      ) || materials[0];

      if (!targetMat) {
        setIsApplyingTexture(false);
        return;
      }

      // 1. Create 2048x2048 high-res texture canvas
      const width = 2048;
      const height = 2048;
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const ctx = offscreen.getContext("2d");

      // 2. Fill grout background color
      const groutObj = getGroutColorById(groutColorId);
      const groutColor = groutObj ? groutObj.hex : "#C8BAA8";
      ctx.fillStyle = groutColor;
      ctx.fillRect(0, 0, width, height);

      // 3. Load mix images if blend is active
      let mixImages = null;
      let blendMode = "random";

      const itemsList = Array.isArray(blendItems) ? blendItems : (blendItems?.items || []);
      blendMode = blendItems?.mode || "random";

      if (itemsList.length > 1) {
        const loadedMix = await Promise.all(
          itemsList.map(async (item) => {
            const pPath = textureCache.getProductImagePath(item.product);
            const img = pPath ? await textureCache.loadTexture(pPath) : null;
            return { img: img || textureImg, ratio: item.ratio || 50 };
          })
        );
        mixImages = loadedMix.filter((m) => m.img);
      }

      // Render Pattern with Single or Multi-Brick Blend
      const bounds = { x: 0, y: 0, width, height };
      PatternEngine.renderPattern(ctx, textureImg, bounds, {
        patternId,
        scale: scale * 1.5,
        groutWidthMm,
        groutColorId,
        rotation,
        product: selectedProduct,
        mixImages,
        blendMode
      });

      // 4. Create model-viewer texture
      const dataUrl = offscreen.toDataURL("image/jpeg", 0.94);
      const texture = await mv.createTexture(dataUrl);

      if (targetMat.pbrMetallicRoughness && targetMat.pbrMetallicRoughness.baseColorTexture) {
        targetMat.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
      }
    } catch (err) {
      console.warn("[StudioModelViewer] Error applying texture:", err);
    } finally {
      setIsApplyingTexture(false);
    }
  }, [selectedProduct, textureImg, patternId, scale, groutWidthMm, groutColorId, rotation, blendItems]);

  // Handle Model Load & State Sync
  useEffect(() => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    let isCancelled = false;

    const handleLoad = () => {
      if (!isCancelled) {
        setIsModelLoaded(true);
        applyTexture();
        try {
          mv.cameraOrbit = "0deg 90deg 2.8m";
          mv.fieldOfView = "24deg";
          mv.cameraTarget = "auto auto auto";
          if (typeof mv.jumpCameraToGoal === "function") {
            mv.jumpCameraToGoal();
          }
        } catch (e) {}
      }
    };

    mv.addEventListener("load", handleLoad);

    if (mv.model && mv.model.materials) {
      setIsModelLoaded(true);
      applyTexture();
    }

    const safetyTimer = setTimeout(() => {
      if (!isCancelled) {
        setIsModelLoaded(true);
        applyTexture();
      }
    }, 1200);

    return () => {
      isCancelled = true;
      clearTimeout(safetyTimer);
      mv.removeEventListener("load", handleLoad);
    };
  }, [applyTexture, selectedTemplate]);

  // Update texture whenever textureImg or parameters change
  useEffect(() => {
    if (isModelLoaded) {
      applyTexture();
    }
  }, [isModelLoaded, applyTexture]);

    // Zoom in / out controls for model-viewer
  const handleZoomIn = () => {
    const mv = modelViewerRef.current;
    if (!mv) return;
    try {
      const currentFov = parseFloat(mv.getFieldOfView() || mv.fieldOfView || "24");
      const newFov = Math.max(12, currentFov * 0.85);
      mv.fieldOfView = `${newFov}deg`;

      const orbit = mv.getCameraOrbit();
      if (orbit && orbit.radius) {
        const newRadius = Math.max(1.2, orbit.radius * 0.85);
        mv.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${newRadius}m`;
      }
      if (typeof mv.jumpCameraToGoal === "function") {
        mv.jumpCameraToGoal();
      }
    } catch (e) {}
  };

  const handleZoomOut = () => {
    const mv = modelViewerRef.current;
    if (!mv) return;
    try {
      const currentFov = parseFloat(mv.getFieldOfView() || mv.fieldOfView || "24");
      const newFov = Math.min(45, currentFov * 1.18);
      mv.fieldOfView = `${newFov}deg`;

      const orbit = mv.getCameraOrbit();
      if (orbit && orbit.radius) {
        const newRadius = Math.min(8.0, orbit.radius * 1.18);
        mv.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${newRadius}m`;
      }
      if (typeof mv.jumpCameraToGoal === "function") {
        mv.jumpCameraToGoal();
      }
    } catch (e) {}
  };

  const handleResetView = () => {
    const mv = modelViewerRef.current;
    if (!mv) return;
    try {
      mv.cameraOrbit = "0deg 90deg 2.8m";
      mv.fieldOfView = "24deg";
      mv.cameraTarget = "auto auto auto";
      if (typeof mv.jumpCameraToGoal === "function") {
        mv.jumpCameraToGoal();
      }
    } catch (e) {}
  };

  // Download Snapshot
  const handleDownloadSnapshot = async () => {
    const mv = modelViewerRef.current;
    if (!mv) return;
    try {
      const blob = await mv.toBlob({ idealAspect: true });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const code = selectedProduct && selectedProduct.stokKodu ? selectedProduct.stokKodu : "Design";
      link.download = `Tugla_Dunyasi_Studio_${code}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn("Snapshot download failed:", err);
    }
  };

  const glbSrc = (selectedTemplate && selectedTemplate.glbPath) || "/assets/studio/isiklar/glb/place-bina.glb";

  return (
    <div className="studio-canvas-container studio-isiklar-canvas">
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

      {/* FLOATING MOBILE SIDEBAR BUTTON */}
      <button
        className="btn-floating-mobile-controls"
        onClick={onOpenMobileSidebar}
        title={isEn ? "Pattern & Grout Settings" : "Dizilim & Derz Ayarları"}
      >
        <Sliders size={16} />
        <span>{isEn ? "Settings" : "Dizilim & Derz"}</span>
      </button>

      {/* 2. FLOATING 2D-STYLE ZOOM & PAN CONTROLS */}
      <div className="studio-2d-zoom-controls">
        <button className="btn-zoom-circle" onClick={handleZoomIn} title={isEn ? "Zoom In" : "Yakınlaştır"}>
          <ZoomIn size={15} />
        </button>
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

      {/* 4. GOOGLE MODEL-VIEWER ENGINE (Bundled locally) */}
      <model-viewer
        ref={modelViewerRef}
        id="brickModel"
        src={glbSrc}
        alt="Tuğla Dünyası Studio"
        exposure="1"
        camera-controls="true"
        enable-pan="true"
        touch-action="none"
        camera-orbit="0deg 90deg 2.8m"
        min-camera-orbit="auto auto 1.0m"
        max-camera-orbit="auto auto 8.0m"
        quick-look-browsers="safari chrome"
        shadow-intensity="1"
        shadow-softness="1"
        field-of-view="24deg" min-field-of-view="12deg" max-field-of-view="45deg"
        interaction-prompt="none"
        environment-image="neutral"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          backgroundColor: "#DCE2E8"
        }}
      />

      {/* 5. RIGHT VERTICAL SCENE SELECTOR STRIP */}
      {isSceneStripOpen && (
        <StudioSceneSelector
          selectedTemplate={selectedTemplate}
          onSelectTemplate={(tmpl) => {
            setIsModelLoaded(false);
            onSelectTemplate(tmpl);
            handleResetView();
          }}
          isEn={isEn}
        />
      )}

      {/* 6. PRELOADERS & LOADING OVERLAYS */}
      {(isTextureLoading || isApplyingTexture || !isModelLoaded) && (
        <div className="studio-loading-overlay">
          <div className="loading-spinner" />
          <span>{isEn ? "Preparing architectural scene & texture..." : "Mimari ortam ve tuğla dokusu hazırlanıyor..."}</span>
        </div>
      )}

      {!selectedProduct && !isTextureLoading && isModelLoaded && (
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
