// src/studio/hooks/useStudioState.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ARCHITECTURAL_TEMPLATES, getTemplateById } from '../data/templates';
import { PATTERNS } from '../data/patterns';
import { GROUT_COLORS } from '../data/groutColors';
import { textureCache } from '../engine/TextureCache';
import { templateLoader } from '../engine/TemplateLoader';
import { getProductByStockCode, safeGetStudioProducts } from '../../data/products';

const STORAGE_KEY = 'tuğla-dunyasi-studio-designs';

export function useStudioState(initialStockCode = null, initialTemplateId = null) {
  const allProducts = useMemo(() => safeGetStudioProducts() || [], []);

  // 1. Initial product resolution
  const [selectedProduct, setSelectedProduct] = useState(() => {
    if (initialStockCode) {
      const found = getProductByStockCode(initialStockCode);
      if (found && (found.studio === 1 || found.isStudio)) return found;
    }
    const ant = getProductByStockCode("ANT01");
    if (ant && (ant.studio === 1 || ant.isStudio)) return ant;
    return (allProducts && allProducts[0]) || null;
  });

  // 2. Initial template resolution
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    if (initialTemplateId) {
      return getTemplateById(initialTemplateId);
    }
    return ARCHITECTURAL_TEMPLATES[0];
  });

  // Active surface on multi-surface templates
  const [activeSurfaceId, setActiveSurfaceId] = useState(null);

  // Material & Layout Parameters
  const [patternId, setPatternId] = useState(() => selectedTemplate.defaultPattern || 'running-bond');
  const [scale, setScale] = useState(() => selectedTemplate.defaultScale || 1.0);
  const [groutWidthMm, setGroutWidthMm] = useState(() => selectedTemplate.defaultGroutWidth || 10);
  const [groutColorId, setGroutColorId] = useState(() => selectedTemplate.defaultGroutColor || 'beige-sand');
  const [rotation, setRotation] = useState(0);

  // Viewport Controls
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Left Sidebar UI state
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState('all');
  const [productCategoryFilter, setProductCategoryFilter] = useState('Tümü');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [activeLeftTab, setActiveLeftTab] = useState('products'); // 'products' | 'templates'

  // Loaded Product Texture
  const [textureImg, setTextureImg] = useState(null);
  const [isTextureLoading, setIsTextureLoading] = useState(false);

  // Loaded Template Visual Assets
  const [baseImageElement, setBaseImageElement] = useState(null);
  const [shadowImageElement, setShadowImageElement] = useState(null);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);

  // Saved Designs State
  const [savedDesigns, setSavedDesigns] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync initialStockCode when props change
  useEffect(() => {
    if (initialStockCode) {
      const found = getProductByStockCode(initialStockCode);
      if (found) {
        setSelectedProduct(found);
      }
    }
  }, [initialStockCode]);

  // Lazy load product texture when selectedProduct changes
  useEffect(() => {
    let isCancelled = false;
    if (!selectedProduct) {
      setTextureImg(null);
      return;
    }

    const imgPath = textureCache.getProductImagePath(selectedProduct);
    if (!imgPath) {
      setTextureImg(null);
      return;
    }

    setIsTextureLoading(true);
    textureCache.loadTexture(imgPath).then((img) => {
      if (!isCancelled) {
        setTextureImg(img);
        setIsTextureLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedProduct]);

  // Lazy load template visual assets (base image & shadow layer)
  useEffect(() => {
    let isCancelled = false;
    if (!selectedTemplate) {
      setBaseImageElement(null);
      setShadowImageElement(null);
      return;
    }

    const baseImgPath = selectedTemplate.asset ? selectedTemplate.asset.baseImage : selectedTemplate.baseImagePath;
    const shadowImgPath = selectedTemplate.asset ? selectedTemplate.asset.shadowLayer : selectedTemplate.shadowImagePath;

    if (!baseImgPath && !shadowImgPath) {
      setBaseImageElement(null);
      setShadowImageElement(null);
      return;
    }

    setIsTemplateLoading(true);

    Promise.all([
      baseImgPath ? templateLoader.loadAsset(baseImgPath) : Promise.resolve(null),
      shadowImgPath ? templateLoader.loadAsset(shadowImgPath) : Promise.resolve(null)
    ]).then(([baseImg, shadowImg]) => {
      if (!isCancelled) {
        setBaseImageElement(baseImg);
        setShadowImageElement(shadowImg);
        setIsTemplateLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedTemplate]);

  // Product Selection handler
  const handleSelectProduct = useCallback((product) => {
    setSelectedProduct(product);
    if (product && product.stokKodu) {
      const url = new URL(window.location.href);
      url.searchParams.set('product', product.stokKodu);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Template Selection handler
  const handleSelectTemplate = useCallback((template) => {
    setSelectedTemplate(template);
    setActiveSurfaceId(null);
    if (template.defaultPattern) setPatternId(template.defaultPattern);
    if (template.defaultScale) setScale(template.defaultScale);
    if (template.defaultGroutWidth !== undefined) setGroutWidthMm(template.defaultGroutWidth);
    if (template.defaultGroutColor) setGroutColorId(template.defaultGroutColor);
  }, []);

  // Viewport Zoom & Pan Handlers
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.15, 2.5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.15, 0.65));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setScale(selectedTemplate.defaultScale || 1.0);
    setRotation(0);
  }, [selectedTemplate]);

  // Reset all parameters
  const handleResetAll = useCallback(() => {
    if (selectedTemplate) {
      setPatternId(selectedTemplate.defaultPattern || 'running-bond');
      setScale(selectedTemplate.defaultScale || 1.0);
      setGroutWidthMm(selectedTemplate.defaultGroutWidth || 10);
      setGroutColorId(selectedTemplate.defaultGroutColor || 'beige-sand');
      setRotation(0);
      setZoom(1.0);
      setPan({ x: 0, y: 0 });
      setActiveSurfaceId(null);
    }
  }, [selectedTemplate]);

  // Clean serializable configuration object
  const getSerializableConfig = useCallback(() => {
    if (!selectedProduct) return null;
    return {
      productCode: selectedProduct.stokKodu,
      productName: selectedProduct.stokAdi,
      templateId: selectedTemplate.id,
      surfaceId: activeSurfaceId || 'all-surfaces',
      pattern: patternId,
      scale,
      groutWidth: groutWidthMm,
      groutColor: groutColorId,
      rotation
    };
  }, [selectedProduct, selectedTemplate, activeSurfaceId, patternId, scale, groutWidthMm, groutColorId, rotation]);

  // Save current design
  const handleSaveDesign = useCallback(() => {
    if (!selectedProduct) return null;
    const config = getSerializableConfig();
    const newDesign = {
      id: 'design_' + Date.now(),
      createdAt: new Date().toISOString(),
      ...config
    };

    try {
      const updated = [newDesign, ...savedDesigns.slice(0, 19)];
      setSavedDesigns(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return newDesign;
    } catch {
      return null;
    }
  }, [selectedProduct, getSerializableConfig, savedDesigns]);

  // Get structured summary for WhatsApp Quote
  const getStudioQuoteData = useCallback(() => {
    if (!selectedProduct) return null;
    const currentPattern = PATTERNS.find((p) => p.id === patternId);
    const currentGrout = GROUT_COLORS.find((g) => g.id === groutColorId);

    return {
      product: selectedProduct,
      stokKodu: selectedProduct.stokKodu,
      stokAdi: selectedProduct.stokAdi,
      templateName: selectedTemplate.nameTr,
      patternName: currentPattern ? currentPattern.nameTr : patternId,
      scale: `${Math.round(scale * 100)}%`,
      groutWidth: `${groutWidthMm} mm`,
      groutColor: currentGrout ? currentGrout.nameTr : groutColorId,
      rotation: `${rotation}°`
    };
  }, [selectedProduct, selectedTemplate, patternId, scale, groutWidthMm, groutColorId, rotation]);

  return {
    allProducts,
    selectedProduct,
    selectedTemplate,
    activeSurfaceId,
    patternId,
    scale,
    groutWidthMm,
    groutColorId,
    rotation,
    zoom,
    pan,
    isFullscreen,
    templateCategoryFilter,
    productCategoryFilter,
    productSearchQuery,
    activeLeftTab,
    textureImg,
    isTextureLoading,
    baseImageElement,
    shadowImageElement,
    isTemplateLoading,
    savedDesigns,
    setSelectedProduct: handleSelectProduct,
    setSelectedTemplate: handleSelectTemplate,
    setActiveSurfaceId,
    setPatternId,
    setScale,
    setGroutWidthMm,
    setGroutColorId,
    setRotation,
    setZoom,
    setPan,
    setIsFullscreen,
    setTemplateCategoryFilter,
    setProductCategoryFilter,
    setProductSearchQuery,
    setActiveLeftTab,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    handleResetAll,
    handleSaveDesign,
    getStudioQuoteData,
    getSerializableConfig
  };
}
