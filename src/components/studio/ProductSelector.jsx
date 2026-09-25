import React, { useState, useMemo } from 'react';
import { Search, Check, Plus, ExternalLink, Info, ChevronRight } from 'lucide-react';
import { MAIN_CATEGORIES_DATA, getSubcategories } from '../../data/products';

export default function ProductSelector({
  lang = 'TR',
  allProducts = [],
  selectedProduct,
  onSelectProduct,
  isMixActive,
  onAddToMix,
  onInspectProduct
}) {
  const [selectedMainCat, setSelectedMainCat] = useState('Tümü');
  const [selectedSubCat, setSelectedSubCat] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const isEn = lang === 'EN';

  // Subcategories for active main category
  const subcategoriesList = useMemo(() => {
    if (selectedMainCat === 'Tümü') return [];
    return getSubcategories(selectedMainCat);
  }, [selectedMainCat]);

  // 3-step filtering
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (!p) return false;

      // Direct search query overrides category filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const codeMatch = p.stokKodu && p.stokKodu.toLowerCase().includes(q);
        const nameMatch = p.stokAdi && p.stokAdi.toLowerCase().includes(q);
        const catMatch = p.anaKategori && p.anaKategori.toLowerCase().includes(q);
        const subMatch = p.altKategori && p.altKategori.toLowerCase().includes(q);
        return codeMatch || nameMatch || catMatch || subMatch;
      }

      // Step 1: All products
      if (selectedMainCat === 'Tümü') {
        return true;
      }

      // Step 2: Main category selected, but subcategory not yet selected -> Hide products
      if (selectedMainCat && !selectedSubCat) {
        return false;
      }

      // Step 3: Main + Sub category selected
      return p.anaKategori === selectedMainCat && p.altKategori === selectedSubCat;
    });
  }, [allProducts, selectedMainCat, selectedSubCat, searchQuery]);

  const handleSelectMainCat = (catId) => {
    setSelectedMainCat(catId);
    setSelectedSubCat('');
    setSearchQuery('');
  };

  const handleSelectSubCat = (subCat) => {
    setSelectedSubCat(subCat);
    setSearchQuery('');
  };

  return (
    <div className="product-selector-wrapper">
      {/* Search Bar */}
      <div className="search-bar-wrap">
        <Search size={15} className="search-icon" />
        <input
          type="text"
          placeholder={isEn ? 'Search by stock code or product name...' : 'Stok kodu veya ürün adı ile ara (örn. ANT01, KPL01, Rustik)...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input-field"
        />
        {searchQuery && (
          <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
        )}
      </div>

      {/* Horizontal Main Category Badges */}
      <div className="main-categories-scroll">
        <button
          className={`main-cat-badge ${selectedMainCat === 'Tümü' ? 'active' : ''}`}
          onClick={() => handleSelectMainCat('Tümü')}
        >
          {isEn ? 'All Products' : 'Tüm Ürünler'}
        </button>
        {MAIN_CATEGORIES_DATA.map((cat) => (
          <button
            key={cat.id}
            className={`main-cat-badge ${selectedMainCat === cat.id ? 'active' : ''}`}
            onClick={() => handleSelectMainCat(cat.id)}
          >
            {isEn ? cat.nameEn : cat.nameTr}
          </button>
        ))}
      </div>

      {/* Step 2: Subcategory Selection Screen when Main Category is selected */}
      {selectedMainCat !== 'Tümü' && !selectedSubCat && !searchQuery && (
        <div className="subcategory-selection-step">
          <div className="step-alert-box">
            <Info size={15} />
            <span>{isEn ? 'Step 2: Please select a subcategory below to reveal products.' : '2. Aşama: Lütfen ürünleri görüntülemek için bir alt kategori seçin.'}</span>
          </div>

          <div className="subcat-cards-grid">
            {subcategoriesList.map((sub, idx) => (
              <button
                key={idx}
                className="subcat-card-btn"
                onClick={() => handleSelectSubCat(sub)}
              >
                <span className="subcat-card-name">{sub}</span>
                <ChevronRight size={15} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Subcategory Breadcrumb */}
      {selectedSubCat && !searchQuery && (
        <div className="active-subcat-bar">
          <div className="breadcrumb-tags">
            <span>{selectedMainCat}</span>
            <ChevronRight size={12} />
            <strong>{selectedSubCat}</strong>
          </div>
          <button className="btn-change-subcat" onClick={() => setSelectedSubCat('')}>
            {isEn ? 'Change' : 'Değiştir'}
          </button>
        </div>
      )}

      {/* Step 3 & Step 1: Products Grid */}
      {((selectedMainCat === 'Tümü') || selectedSubCat || searchQuery) && (
        <div className="products-grid-scroll">
          {filteredProducts.length === 0 ? (
            <div className="no-products-empty">
              <p>{isEn ? 'No products match your search.' : 'Aramanızla eşleşen ürün bulunamadı.'}</p>
            </div>
          ) : (
            filteredProducts.slice(0, 60).map((prod) => {
              const isSelected = selectedProduct?.stokKodu === prod.stokKodu;
              const imgUrl = prod.studioImg || prod.mainImage || (prod.images && prod.images[0]) || '/assets/brand/hero-bg.jpg';

              return (
                <div
                  key={prod.stokKodu || prod.id}
                  className={`studio-product-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="card-image-box">
                    <img
                      src={imgUrl}
                      alt={prod.stokAdi}
                      className="card-thumb-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/brand/hero-bg.jpg';
                      }}
                    />
                    {isSelected && (
                      <div className="applied-pill">
                        <Check size={12} /> {isEn ? 'Active' : 'Seçildi'}
                      </div>
                    )}
                  </div>

                  <div className="card-info-box">
                    <div className="card-header-row">
                      <span className="product-stock-code">{prod.stokKodu}</span>
                      {onInspectProduct && (
                        <button
                          className="btn-inspect-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectProduct(prod);
                          }}
                          title={isEn ? 'Inspect Product Details' : 'Ürünü İncele'}
                        >
                          <ExternalLink size={12} />
                        </button>
                      )}
                    </div>

                    <h4 className="product-stock-name" title={prod.stokAdi}>
                      {prod.stokAdi}
                    </h4>

                    <div className="card-btn-actions">
                      <button
                        className={`btn-apply-wall ${isSelected ? 'active' : ''}`}
                        onClick={() => onSelectProduct(prod)}
                      >
                        {isSelected ? (isEn ? 'Applied' : 'Uygulandı') : (isEn ? 'Apply' : 'Uygula')}
                      </button>

                      {isMixActive && onAddToMix && (
                        <button
                          className="btn-add-to-mix"
                          onClick={() => onAddToMix(prod)}
                          title={isEn ? 'Add to MIX Blend' : 'MIX Karışımına Ekle'}
                        >
                          <Plus size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <style>{`
        .product-selector-wrapper {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .search-bar-wrap {
          position: relative;
        }
        .search-icon {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          color: #A8A29E;
        }
        .search-input-field {
          width: 100%;
          background: #201D1A;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 10px 32px 10px 34px;
          color: #FFFFFF;
          font-size: 0.82rem;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .search-input-field:focus {
          border-color: var(--accent-terracotta);
        }
        .clear-search-btn {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #A8A29E;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .main-categories-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 6px;
        }
        .main-cat-badge {
          padding: 6px 13px;
          background: #201D1A;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          color: #D6D3D1;
          font-size: 0.74rem;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .main-cat-badge:hover {
          border-color: rgba(255, 255, 255, 0.22);
          color: #FFFFFF;
        }
        .main-cat-badge.active {
          background: var(--accent-terracotta);
          border-color: var(--accent-terracotta);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(224, 90, 48, 0.25);
        }

        .subcategory-selection-step {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .step-alert-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(224, 90, 48, 0.1);
          border: 1px solid rgba(224, 90, 48, 0.25);
          padding: 8px 12px;
          border-radius: 6px;
          color: #FF8A65;
          font-size: 0.76rem;
        }
        .subcat-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .subcat-card-btn {
          background: #201D1A;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        .subcat-card-btn:hover {
          border-color: var(--accent-terracotta);
          background: #282420;
          transform: translateY(-2px);
        }
        .subcat-card-name {
          font-size: 0.82rem;
          font-weight: 600;
        }

        .active-subcat-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #201D1A;
          padding: 7px 12px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.78rem;
        }
        .breadcrumb-tags {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #A8A29E;
        }
        .breadcrumb-tags strong {
          color: var(--accent-terracotta);
        }
        .btn-change-subcat {
          background: none;
          border: none;
          color: #FFFFFF;
          text-decoration: underline;
          cursor: pointer;
          font-size: 0.72rem;
        }

        .products-grid-scroll {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .no-products-empty {
          grid-column: span 2;
          padding: 24px;
          text-align: center;
          color: #A8A29E;
          font-size: 0.85rem;
        }
        .studio-product-card {
          background: #201D1A;
          border: 1.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
        }
        .studio-product-card:hover {
          border-color: rgba(255, 255, 255, 0.22);
          transform: translateY(-2px);
        }
        .studio-product-card.selected {
          border-color: var(--accent-terracotta);
          background: #282420;
          box-shadow: 0 4px 16px rgba(224, 90, 48, 0.2);
        }

        .card-image-box {
          height: 100px;
          background: #FFFFFF;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
        }
        .card-thumb-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .applied-pill {
          position: absolute;
          top: 6px;
          right: 6px;
          background: var(--accent-terracotta);
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .card-info-box {
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .card-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .product-stock-code {
          font-size: 0.7rem;
          color: var(--accent-terracotta);
          font-weight: 700;
        }
        .btn-inspect-link {
          background: none;
          border: none;
          color: #A8A29E;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
        }
        .btn-inspect-link:hover {
          color: #FFFFFF;
        }
        .product-stock-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-btn-actions {
          display: flex;
          gap: 6px;
          margin-top: 6px;
        }
        .btn-apply-wall {
          flex-grow: 1;
          padding: 6px 10px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 700;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-apply-wall:hover, .btn-apply-wall.active {
          background: var(--accent-terracotta);
          border-color: var(--accent-terracotta);
        }
        .btn-add-to-mix {
          padding: 6px 8px;
          background: #2E2A27;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FFFFFF;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-add-to-mix:hover {
          background: var(--accent-terracotta);
        }
      `}</style>
    </div>
  );
}
