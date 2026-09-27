// src/studio/components/StudioMobileDrawer.jsx
import React, { useState } from 'react';
import { Layers, LayoutTemplate, Sliders, ChevronUp, ChevronDown, MessageSquare } from 'lucide-react';
import StudioSidebarLeft from './StudioSidebarLeft';
import StudioSidebarRight from './StudioSidebarRight';

export default function StudioMobileDrawer({
  allProducts,
  selectedProduct,
  onSelectProduct,
  selectedTemplate,
  onSelectTemplate,
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
  onOpenQuoteModal,
  onSaveDesign,
  isEn
}) {
  const [activeTab, setActiveTab] = useState('products');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tümü');

  return (
    <div className={`studio-mobile-drawer ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="drawer-handle-bar" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="handle-pill" />
        <div className="handle-summary">
          <span className="handle-prod-name">
            {selectedProduct ? `${selectedProduct.stokKodu} • ${selectedProduct.stokAdi}` : (isEn ? 'Select a Brick' : 'Bir Tuğla Seçin')}
          </span>
          <button className="expand-toggle-btn">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      <div className="drawer-nav-tabs">
        <button
          className={`dnav-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('products');
            setIsExpanded(true);
          }}
        >
          <Layers size={16} />
          <span>{isEn ? 'Bricks' : 'Tuğlalar'}</span>
        </button>

        <button
          className={`dnav-tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('templates');
            setIsExpanded(true);
          }}
        >
          <LayoutTemplate size={16} />
          <span>{isEn ? 'Templates' : 'Şablonlar'}</span>
        </button>

        <button
          className={`dnav-tab ${activeTab === 'controls' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('controls');
            setIsExpanded(true);
          }}
        >
          <Sliders size={16} />
          <span>{isEn ? 'Pattern & Grout' : 'Dizilim & Derz'}</span>
        </button>
      </div>

      <div className="drawer-scroll-body">
        {activeTab === 'products' && (
          <StudioSidebarLeft
            allProducts={allProducts}
            selectedProduct={selectedProduct}
            onSelectProduct={(p) => {
              onSelectProduct(p);
              setIsExpanded(false);
            }}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={onSelectTemplate}
            activeTab="products"
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            isEn={isEn}
          />
        )}

        {activeTab === 'templates' && (
          <StudioSidebarLeft
            allProducts={allProducts}
            selectedProduct={selectedProduct}
            onSelectProduct={onSelectProduct}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={(t) => {
              onSelectTemplate(t);
              setIsExpanded(false);
            }}
            activeTab="templates"
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            isEn={isEn}
          />
        )}

        {activeTab === 'controls' && (
          <StudioSidebarRight
            patternId={patternId}
            setPatternId={setPatternId}
            scale={scale}
            setScale={setScale}
            groutWidthMm={groutWidthMm}
            setGroutWidthMm={setGroutWidthMm}
            groutColorId={groutColorId}
            setGroutColorId={setGroutColorId}
            rotation={rotation}
            setRotation={setRotation}
            selectedProduct={selectedProduct}
            isEn={isEn}
          />
        )}
      </div>

      <div className="drawer-action-footer">
        <button
          className="btn-drawer-quote"
          onClick={onOpenQuoteModal}
          disabled={!selectedProduct}
        >
          <MessageSquare size={16} />
          <span>{isEn ? 'Get WhatsApp Quote' : 'Teklif Al'}</span>
        </button>
      </div>
    </div>
  );
}
