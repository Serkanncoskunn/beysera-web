// src/studio/StudioView.jsx
import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, RotateCcw } from 'lucide-react';
import { useStudioState } from './hooks/useStudioState';
import { useResponsiveStudio } from './hooks/useResponsiveStudio';
import StudioModelViewerCanvas from './components/StudioModelViewerCanvas';
import StudioSidebarLeft from './components/StudioSidebarLeft';
import StudioBottomBar from './components/StudioBottomBar';
import StudioMixModal from './components/StudioMixModal';
import './styles/studio.css';

export default function StudioView({
  initialProductCode = null,
  initialTemplateId = null,
  lang = 'TR',
  onNavigate,
  onOpenQuoteModal
}) {
  const isEn = lang === 'EN';
  const { isMobile } = useResponsiveStudio();

  const {
    allProducts,
    selectedProduct,
    selectedTemplate,
    patternId,
    scale,
    groutWidthMm,
    groutColorId,
    rotation,
    productCategoryFilter,
    productSearchQuery,
    textureImg,
    isTextureLoading,
    baseImageElement,
    shadowImageElement,
    isTemplateLoading,
    activeSurfaceId,
    isFullscreen,
    setSelectedProduct,
    setSelectedTemplate,
    setPatternId,
    setScale,
    setGroutWidthMm,
    setGroutColorId,
    setRotation,
    setIsFullscreen,
    setProductCategoryFilter,
    setProductSearchQuery,
    handleResetAll,
    handleSaveDesign,
    getStudioQuoteData
  } = useStudioState(initialProductCode, initialTemplateId);

  const [blendItems, setBlendItems] = useState(null);
  const [isMixModalOpen, setIsMixModalOpen] = useState(false);
  

  
  const handleQuoteClick = () => {
    if (onOpenQuoteModal && selectedProduct) {
      onOpenQuoteModal(selectedProduct);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleApplyMix = (mixConfig) => {
    if (!mixConfig) return;
    const items = Array.isArray(mixConfig) ? mixConfig : (mixConfig.items || []);
    const mode = mixConfig.mode || "random";
    if (items.length > 0) {
      setBlendItems({ items, mode });
      if (items[0].product) {
        setSelectedProduct(items[0].product);
      }
    }
    setIsMixModalOpen(false);
  };

  return (
    <div className={`studio-root-isiklar-layout ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {/* 1. TOP BRAND HEADER */}
      <header className="studio-top-isiklar-header">
        <div className="header-left-brand">
          <button
            className="btn-back-to-site"
            onClick={() => onNavigate && onNavigate('home')}
            title={isEn ? 'Back to Tuğla Dünyası' : 'Ana Sayfaya Dön'}
          >
            <ArrowLeft size={16} />
            <span>{isEn ? 'Back to Site' : 'Siteye Dön'}</span>
          </button>

          <div className="brand-logo-text-group">
            <span className="brand-primary-name">TUĞLA DÜNYASI</span>
            <span className="brand-studio-badge">DESIGN STUDIO</span>
          </div>
        </div>

        <div className="header-right-actions">
          <button
            className="btn-header-ghost"
            onClick={() => {
              setBlendItems(null);
              handleResetAll();
            }}
            title={isEn ? 'Reset All Settings' : 'Ayarları Sıfırla'}
          >
            <RotateCcw size={14} />
            <span className="hide-on-mobile">{isEn ? 'Reset' : 'Sıfırla'}</span>
          </button>

          <button
            className="btn-header-primary-quote"
            onClick={handleQuoteClick}
            disabled={!selectedProduct}
          >
            <MessageSquare size={15} />
            <span>{isEn ? 'Get WhatsApp Quote' : 'Fiyat Teklifi Al'}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN CENTER BODY (LEFT CONTROLS + 3D VIEWPORT) */}
      <div className="studio-main-body-row">
        {/* Left Side: Patterns, Mortar & Angle Controls */}
        <StudioSidebarLeft
          selectedProduct={selectedProduct}
          patternId={patternId}
          setPatternId={setPatternId}
          rotation={rotation}
          setRotation={setRotation}
          groutWidthMm={groutWidthMm}
          setGroutWidthMm={setGroutWidthMm}
          groutColorId={groutColorId}
          setGroutColorId={setGroutColorId}
          onOpenMixModal={() => setIsMixModalOpen(true)}
          isEn={isEn}
        />

        {/* Center: 3D Architectural Scene & Vertical Scene Switcher */}
        <main className="studio-canvas-stage">
          <StudioModelViewerCanvas
            selectedProduct={selectedProduct}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
            textureImg={textureImg}
            isTextureLoading={isTextureLoading}
            patternId={patternId}
            scale={scale}
            groutWidthMm={groutWidthMm}
            groutColorId={groutColorId}
            rotation={rotation}
            onOpenQuoteModal={handleQuoteClick}
            blendItems={blendItems}
            isEn={isEn}
          />
        </main>
      </div>

      {/* 3. BOTTOM CAROUSEL (CATEGORIES + PRODUCT SWATCHES) */}
      <StudioBottomBar
        allProducts={allProducts}
        selectedProduct={selectedProduct}
        onSelectProduct={(prod) => {
          setBlendItems(null);
          setSelectedProduct(prod);
        }}
        categoryFilter={productCategoryFilter}
        setCategoryFilter={setProductCategoryFilter}
        searchQuery={productSearchQuery}
        setSearchQuery={setProductSearchQuery}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        isEn={isEn}
      />

      {/* 4. COMPACT MIX MODAL POPUP */}
      {isMixModalOpen && (
        <StudioMixModal
          isOpen={isMixModalOpen}
          onClose={() => setIsMixModalOpen(false)}
          allProducts={allProducts}
          currentProduct={selectedProduct}
          onApplyMix={handleApplyMix}
          isEn={isEn}
        />
      )}

      </div>
  );
}
