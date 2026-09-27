// src/studio/components/StudioBottomBar.jsx
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Maximize2, Minimize2, Check, Plus, Filter } from 'lucide-react';
import { MAIN_CATEGORIES_DATA } from '../../data/products';

export default function StudioBottomBar({
  allProducts,
  selectedProduct,
  onSelectProduct,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
  isFullscreen,
  onToggleFullscreen,
  isBlendModeActive = false,
  blendItems = null,
  activeSlotIndex = 0,
  isEn
}) {
  const scrollContainerRef = useRef(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const filteredProducts = allProducts.filter((p) => {
    if (!p) return false;
    const matchesCategory =
      categoryFilter === 'Tümü' ||
      categoryFilter === 'All' ||
      p.anaKategori === categoryFilter ||
      p.altKategori === categoryFilter;

    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const codeMatch = p.stokKodu && p.stokKodu.toLowerCase().includes(q);
    const nameMatch = p.stokAdi && p.stokAdi.toLowerCase().includes(q);
    return codeMatch || nameMatch;
  });

  const handleScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const offset = direction === 'left' ? -420 : 420;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  // Helper to check if a product is in the active blend list
  const isProductInBlend = (prod) => {
    if (!isBlendModeActive || !blendItems || !Array.isArray(blendItems.items)) return false;
    return blendItems.items.some(it => it.product && it.product.stokKodu === prod.stokKodu);
  };

  return (
    <footer className="studio-bottom-catalog-bar">
      {/* 1. TOP CONTROLS ROW */}
      <div className="bottom-bar-header-row">
        <div className="bottom-header-left">
          {/* Categories Button */}
          <div className="category-dropdown-wrap">
            <button
              className="btn-categories-terracotta"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <span>Kategoriler</span>
            </button>

            {isCategoryDropdownOpen && (
              <div className="categories-flyout-menu">
                <button
                  className={`cat-menu-item ${categoryFilter === 'Tümü' ? 'active' : ''}`}
                  onClick={() => {
                    setCategoryFilter('Tümü');
                    setIsCategoryDropdownOpen(false);
                  }}
                >
                  Tüm Kategoriler
                </button>
                {MAIN_CATEGORIES_DATA.map((cat) => (
                  <button
                    key={cat.id}
                    className={`cat-menu-item ${categoryFilter === cat.id ? 'active' : ''}`}
                    onClick={() => {
                      setCategoryFilter(cat.id);
                      setIsCategoryDropdownOpen(false);
                    }}
                  >
                    {cat.nameTr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Category Display */}
          <span className="active-category-text">
            {categoryFilter === 'Tümü' ? 'Naturel Kaplama Tuğlalar' : categoryFilter}
          </span>
        </div>

        <div className="bottom-header-right">
          {/* Search Input */}
          <div className="studio-bottom-search-wrap">
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bottom-search-input"
            />
          </div>

          {/* Fullscreen Button */}
          <button
            className="btn-bottom-icon"
            onClick={onToggleFullscreen}
            title="Tam Ekran"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* 2. HORIZONTAL PRODUCT CAROUSEL */}
      <div className="product-carousel-wrapper">
        <div className="product-carousel-track" ref={scrollContainerRef}>
          {filteredProducts.map((p) => {
            const isBlendSelected = isBlendModeActive && isProductInBlend(p);
            const isSingleSelected = !isBlendModeActive && selectedProduct && selectedProduct.stokKodu === p.stokKodu;
            const isSelected = isBlendSelected || isSingleSelected;
            const imgUrl = p.mainImage || (p.images && p.images[0]) || '/images/product_placeholder.png';

            return (
              <div
                key={p.stokKodu || p.id}
                className={`product-swatch-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectProduct(p)}
              >
                <div className="swatch-img-box">
                  <img src={imgUrl} alt={p.stokAdi} loading="lazy" />
                  {isSelected ? (
                    <div className="swatch-check-badge-green">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="swatch-plus-badge">
                      <Plus size={12} strokeWidth={2.5} />
                    </div>
                  )}
                </div>
                <span className="swatch-title">{p.stokAdi}</span>
              </div>
            );
          })}
        </div>

        <button
          className="carousel-nav-btn next"
          onClick={() => handleScroll('right')}
          title="Sonraki"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </footer>
  );
}
