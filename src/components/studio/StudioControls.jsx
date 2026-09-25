import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  Grid, 
  Paintbrush, 
  SlidersHorizontal,
  Check
} from 'lucide-react';
import SurfaceSelector from './SurfaceSelector';
import ProductSelector from './ProductSelector';
import PatternSelector from './PatternSelector';
import MortarSelector from './MortarSelector';
import MixBuilder from './MixBuilder';

export default function StudioControls({
  lang = 'TR',
  allProducts = [],
  surface,
  onSelectSurface,
  zone,
  onSelectZone,
  primaryProduct,
  onSelectProduct,
  pattern,
  onSelectPattern,
  rotation,
  onSetRotation,
  mortar,
  onSelectMortar,
  mortarWidth,
  onSelectMortarWidth,
  scale,
  onChangeScale,
  isMixActive,
  onToggleMix,
  mixProducts,
  onUpdateMixProducts,
  onInspectProduct
}) {
  const [activeTab, setActiveTab] = useState('products'); // 'surface', 'products', 'pattern', 'mortar', 'mix'
  const isEn = lang === 'EN';

  return (
    <div className="studio-controls-container">
      {/* Top Segmented Navigation Tabs */}
      <div className="controls-tab-bar">
        <button
          className={`tab-item-btn ${activeTab === 'surface' ? 'active' : ''}`}
          onClick={() => setActiveTab('surface')}
          title={isEn ? 'Architecture Scene' : 'Mimari Sahne'}
        >
          <Building2 size={16} />
          <span>{isEn ? 'Scene' : 'Mimari'}</span>
        </button>

        <button
          className={`tab-item-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
          title={isEn ? 'Product Catalog' : 'Ürün Seçimi'}
        >
          <Layers size={16} />
          <span>{isEn ? 'Product' : 'Ürün'}</span>
        </button>

        <button
          className={`tab-item-btn ${activeTab === 'pattern' ? 'active' : ''}`}
          onClick={() => setActiveTab('pattern')}
          title={isEn ? 'Bond & Layout' : 'Dizilim & Örgü'}
        >
          <Grid size={16} />
          <span>{isEn ? 'Bond' : 'Dizilim'}</span>
        </button>

        <button
          className={`tab-item-btn ${activeTab === 'mortar' ? 'active' : ''}`}
          onClick={() => setActiveTab('mortar')}
          title={isEn ? 'Mortar & Joints' : 'Derz Harcı'}
        >
          <SlidersHorizontal size={16} />
          <span>{isEn ? 'Mortar' : 'Derz'}</span>
        </button>

        <button
          className={`tab-item-btn ${activeTab === 'mix' ? 'active' : ''}`}
          onClick={() => setActiveTab('mix')}
          title={isEn ? 'Material MIX' : 'MIX Karışım'}
        >
          <Paintbrush size={16} />
          <span>{isEn ? 'Mix' : 'MIX'}</span>
          {isMixActive && <span className="active-dot" />}
        </button>
      </div>

      {/* Tab Panels Body */}
      <div className="controls-panel-body">
        {activeTab === 'surface' && (
          <SurfaceSelector
            lang={lang}
            selectedSurface={surface}
            onSelectSurface={onSelectSurface}
            selectedZone={zone}
            onSelectZone={onSelectZone}
          />
        )}

        {activeTab === 'products' && (
          <ProductSelector
            lang={lang}
            allProducts={allProducts}
            selectedProduct={primaryProduct}
            onSelectProduct={onSelectProduct}
            isMixActive={isMixActive}
            onAddToMix={(prod) => {
              if (mixProducts.some(p => p.product.stokKodu === prod.stokKodu)) return;
              if (mixProducts.length >= 3) return;
              const newMix = [...mixProducts, { product: prod, percentage: 30 }];
              const perItem = Math.floor(100 / newMix.length);
              const rebalanced = newMix.map((it, idx) => ({
                ...it,
                percentage: idx === newMix.length - 1 ? 100 - perItem * (newMix.length - 1) : perItem
              }));
              onUpdateMixProducts(rebalanced);
            }}
            onInspectProduct={onInspectProduct}
          />
        )}

        {activeTab === 'pattern' && (
          <PatternSelector
            lang={lang}
            selectedPattern={pattern}
            onSelectPattern={onSelectPattern}
            rotation={rotation}
            onSetRotation={onSetRotation}
            activeProduct={primaryProduct}
          />
        )}

        {activeTab === 'mortar' && (
          <MortarSelector
            lang={lang}
            selectedMortar={mortar}
            onSelectMortar={onSelectMortar}
            selectedWidth={mortarWidth}
            onSelectWidth={onSelectMortarWidth}
            scale={scale}
            onChangeScale={onChangeScale}
          />
        )}

        {activeTab === 'mix' && (
          <MixBuilder
            lang={lang}
            isMixActive={isMixActive}
            onToggleMix={onToggleMix}
            mixProducts={mixProducts}
            onUpdateMixProducts={onUpdateMixProducts}
            onSwitchToProductsTab={() => setActiveTab('products')}
          />
        )}
      </div>

      <style>{`
        .studio-controls-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #181614;
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          color: #FAF8F5;
        }

        .controls-tab-bar {
          display: flex;
          background: #12100E;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          overflow-x: auto;
          flex-shrink: 0;
        }
        .tab-item-btn {
          flex: 1;
          min-width: 70px;
          padding: 14px 6px;
          background: transparent;
          border: none;
          color: #A8A29E;
          font-size: 0.74rem;
          font-weight: 700;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          position: relative;
          transition: all 0.2s ease;
        }
        .tab-item-btn:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.03);
        }
        .tab-item-btn.active {
          color: var(--accent-terracotta);
          border-bottom-color: var(--accent-terracotta);
          background: rgba(224, 90, 48, 0.06);
        }
        .active-dot {
          position: absolute;
          top: 8px;
          right: 16px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-terracotta);
        }

        .controls-panel-body {
          padding: 20px;
          overflow-y: auto;
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
}
