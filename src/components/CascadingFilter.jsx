import React, { useMemo } from 'react';
import { Filter, RotateCcw, ChevronDown, Layers, Tag, Search, X, Check, Sparkles } from 'lucide-react';
import { getMainCategories, getSubcategoriesWithSample } from '../data/products';

export default function CascadingFilter({
  anaKategori = 'Tümü',
  setAnaKategori,
  altKategori = 'Tümü',
  setAltKategori,
  searchQuery = '',
  setSearchQuery,
  onReset,
  lang = 'TR',
  resultCount = 0
}) {
  const isEn = lang === 'EN';
  const mainCategories = Array.isArray(getMainCategories()) ? getMainCategories() : [];

  // Get subcategories with representative sample product images dynamically
  const subCategoriesWithSample = useMemo(() => {
    if (!anaKategori || anaKategori === 'Tümü' || anaKategori === 'All') {
      return [];
    }
    return Array.isArray(getSubcategoriesWithSample(anaKategori)) 
      ? getSubcategoriesWithSample(anaKategori) 
      : [];
  }, [anaKategori]);

  const handleAnaKategoriChange = (e) => {
    const val = e.target.value;
    setAnaKategori(val);
    setAltKategori('Tümü');
  };

  const handleAltKategoriSelect = (sub) => {
    // Toggle: If clicked on already selected subcategory, reset to 'Tümü'
    if (altKategori === sub) {
      setAltKategori('Tümü');
    } else {
      setAltKategori(sub);
    }
  };

  const isFiltered = (anaKategori && anaKategori !== 'Tümü' && anaKategori !== 'All') ||
                     (altKategori && altKategori !== 'Tümü' && altKategori !== 'All') ||
                     (searchQuery && searchQuery.trim() !== '');

  return (
    <div className="cascading-filter-wrapper">
      {/* Header Bar */}
      <div className="filter-header-bar">
        <div className="filter-header-left">
          <Filter size={18} className="filter-title-icon" />
          <span className="filter-header-title">
            {isEn ? 'ARCHITECTURAL PRODUCT FILTER' : 'MİMARİ KATEGORİ VE ÜRÜN FİLTRESİ'}
          </span>
        </div>

        <div className="filter-header-right">
          <span className="result-badge">
            {resultCount} {isEn ? 'Products Found' : 'Ürün Listeleniyor'}
          </span>
          {isFiltered && (
            <button onClick={onReset} className="reset-filter-btn" title={isEn ? 'Reset All Filters' : 'Tüm Filtreleri Sıfırla'}>
              <RotateCcw size={13} />
              <span>{isEn ? 'Clear Filters' : 'Filtreleri Temizle'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Filter Grid: Ana Kategori & Arama */}
      <div className="cascading-grid">
        {/* Dropdown: Ana Kategori */}
        <div className="filter-select-group">
          <label className="select-label">
            <Layers size={13} />
            <span>{isEn ? 'Main Category' : 'Ana Kategori Seçimi'}</span>
          </label>
          <div className="select-input-wrap">
            <select
              value={anaKategori}
              onChange={handleAnaKategoriChange}
              className="cascading-select"
            >
              <option value="Tümü">{isEn ? 'All Main Categories (Show All)' : 'Tüm Ana Kategoriler (Genel Liste)'}</option>
              {mainCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>
        </div>

        {/* Search Input Box */}
        {setSearchQuery && (
          <div className="filter-select-group search-group">
            <label className="select-label">
              <Search size={13} />
              <span>{isEn ? 'Search Product Name / Stock Code' : 'Ürün Adı veya Stok Kodu ile Ara'}</span>
            </label>
            <div className="search-input-wrap">
              <Search size={14} className="search-icon-inside" />
              <input
                type="text"
                placeholder={isEn ? "e.g. DCK-DRZ, KPL01, Pres, Klinker..." : "Örn: DCK-DRZ, KPL01, Pres, Klinker..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cascading-text-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="search-clear-btn"
                  title="Temizle"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Visual Subcategories Grid: ONLY the visual brick/texture swatch cards without 'Tümü' card */}
      {subCategoriesWithSample.length > 0 && anaKategori !== 'Tümü' && anaKategori !== 'All' && (
        <div className="subcategory-visual-selection-section">
          <div className="subcat-section-header">
            <div className="subcat-header-title-box">
              <Tag size={16} className="subcat-header-icon" />
              <div>
                <h3 className="subcat-header-title">
                  {isEn ? `Product Groups in "${anaKategori}"` : `"${anaKategori}" Alt Kategori & Doku Seçimi`}
                </h3>
                <span className="subcat-header-sub">
                  {isEn 
                    ? 'Click any texture card below to filter products:' 
                    : 'Filtrelemek istediğiniz ürün grubu dokusunu seçiniz:'}
                </span>
              </div>
            </div>

            {altKategori !== 'Tümü' && altKategori !== 'All' && (
              <div className="active-filter-indicator-pill">
                <span>{isEn ? 'Active:' : 'Seçili Doku:'} <strong>{altKategori}</strong></span>
                <button 
                  type="button" 
                  onClick={() => handleAltKategoriSelect('Tümü')} 
                  className="btn-clear-active-subcat"
                  title={isEn ? 'Clear Group Filter' : 'Doku Filtresini Kaldır'}
                >
                  <X size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Sadece Estetik Alt Kategori Görsel Kartları (Tümü Kartı Kaldırıldı) */}
          <div className="subcat-visual-grid">
            {subCategoriesWithSample.map((sub) => {
              const isActive = altKategori === sub.name;
              return (
                <button
                  key={sub.name}
                  type="button"
                  onClick={() => handleAltKategoriSelect(sub.name)}
                  className={`subcat-visual-card ${isActive ? 'active' : ''}`}
                  title={isEn ? `Filter by ${sub.name}` : `${sub.name} ürünlerini listele`}
                >
                  <div className="subcat-card-img-wrap">
                    <img 
                      src={sub.sampleImage} 
                      alt={sub.name} 
                      className="subcat-card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/product_placeholder.png';
                      }}
                    />
                    <span className="subcat-count-tag">{sub.count} {isEn ? 'Products' : 'Çeşit'}</span>
                    {isActive && (
                      <span className="subcat-active-check">
                        <Check size={14} />
                      </span>
                    )}
                  </div>
                  <div className="subcat-card-info">
                    <span className="subcat-card-name">{sub.name}</span>
                    <span className="subcat-card-desc">
                      {sub.firstProduct?.stokKodu ? `${sub.firstProduct.stokKodu} Serisi` : (isEn ? 'View Products' : 'Ürünleri Gör')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .cascading-filter-wrapper {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 24px;
          margin-bottom: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
        }
        .filter-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-light);
          flex-wrap: wrap;
          gap: 12px;
        }
        .filter-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .filter-title-icon {
          color: var(--accent-clay);
        }
        .filter-header-title {
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-main);
          text-transform: uppercase;
        }
        .filter-header-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .result-badge {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent-clay);
          background-color: rgba(184, 91, 53, 0.08);
          padding: 5px 14px;
          border: 1px solid rgba(184, 91, 53, 0.2);
          border-radius: 4px;
        }
        .reset-filter-btn {
          background: none;
          border: 1px solid var(--accent-clay);
          color: var(--accent-clay);
          padding: 6px 14px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 4px;
        }
        .reset-filter-btn:hover {
          background-color: var(--accent-clay);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(184, 91, 53, 0.2);
        }
        .cascading-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .filter-select-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .select-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .select-input-wrap, .search-input-wrap {
          position: relative;
          width: 100%;
        }
        .cascading-select {
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          padding: 12px 36px 12px 14px;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-main);
          outline: none;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          border-radius: 6px;
        }
        .cascading-select:focus, .cascading-text-input:focus {
          border-color: var(--accent-clay);
          box-shadow: 0 0 0 3px rgba(184, 91, 53, 0.12);
        }
        .select-chevron {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--text-muted);
        }
        .search-icon-inside {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .cascading-text-input {
          width: 100%;
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          padding: 12px 36px 12px 38px;
          font-size: 0.92rem;
          color: var(--text-main);
          outline: none;
          transition: all 0.2s ease;
          border-radius: 6px;
        }
        .search-clear-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: #E5E7EB;
          border: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #4B5563;
        }
        .search-clear-btn:hover {
          background: #D1D5DB;
        }

        /* Subcategory Visual Selection Section */
        .subcategory-visual-selection-section {
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px dashed var(--border-light);
        }
        .subcat-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .subcat-header-title-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .subcat-header-icon {
          color: var(--accent-clay);
          flex-shrink: 0;
        }
        .subcat-header-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
          line-height: 1.3;
        }
        .subcat-header-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: block;
          margin-top: 2px;
        }
        .active-filter-indicator-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(184, 91, 53, 0.08);
          border: 1px solid rgba(184, 91, 53, 0.25);
          color: var(--accent-clay);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.82rem;
        }
        .btn-clear-active-subcat {
          background: #FFFFFF;
          border: 1px solid rgba(184, 91, 53, 0.3);
          color: var(--accent-clay);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-clear-active-subcat:hover {
          background: var(--accent-clay);
          color: #FFFFFF;
        }

        /* Subcategory Visual Grid (Estetik Doku Kartları) */
        .subcat-visual-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 18px;
        }
        .subcat-visual-card {
          background: #FFFFFF;
          border: 1.5px solid var(--border-light);
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          text-align: left;
          padding: 0;
          position: relative;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        }
        .subcat-visual-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-clay);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.09);
        }
        .subcat-visual-card.active {
          border-color: var(--accent-clay);
          box-shadow: 0 0 0 2px var(--accent-clay), 0 12px 28px rgba(184, 91, 53, 0.18);
          background: #FFFFFF;
        }
        .subcat-card-img-wrap {
          position: relative;
          width: 100%;
          height: 125px;
          background-color: #F8FAFC;
          overflow: hidden;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
        .subcat-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.45s ease;
          display: block;
        }
        .subcat-visual-card:hover .subcat-card-img {
          transform: scale(1.08);
        }
        .subcat-card-info {
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: #FFFFFF;
          border-top: 1px solid var(--border-light);
          flex-grow: 1;
        }
        .subcat-card-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .subcat-visual-card.active .subcat-card-name {
          color: var(--accent-clay);
        }
        .subcat-card-desc {
          font-size: 0.74rem;
          color: var(--text-muted);
        }
        .subcat-count-tag {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(22, 20, 19, 0.82);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 4px;
          backdrop-filter: blur(4px);
        }
        .subcat-active-check {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--accent-clay);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        }

        @media (max-width: 768px) {
          .cascading-grid {
            grid-template-columns: 1fr;
          }
          .subcat-visual-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
          }
          .subcat-card-img-wrap {
            height: 95px;
          }
          .subcat-card-name {
            font-size: 0.8rem;
          }
          .subcat-card-info {
            padding: 10px 12px;
          }
        }
      `}</style>
    </div>
  );
}
