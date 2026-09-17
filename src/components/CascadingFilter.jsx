import React, { useMemo } from 'react';
import { Filter, RotateCcw, ChevronDown, Layers, Tag, Search, X } from 'lucide-react';
import { getMainCategories, getSubcategories } from '../data/products';

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

  // Get subcategories dynamically for the selected main category
  const subCategories = useMemo(() => {
    if (!anaKategori || anaKategori === 'Tümü' || anaKategori === 'All') {
      return [];
    }
    return Array.isArray(getSubcategories(anaKategori)) ? getSubcategories(anaKategori) : [];
  }, [anaKategori]);

  const handleAnaKategoriChange = (e) => {
    const val = e.target.value;
    setAnaKategori(val);
    setAltKategori('Tümü');
  };

  const handleAltKategoriSelect = (sub) => {
    setAltKategori(sub);
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
            {resultCount} {isEn ? 'Products Found' : 'Ürün Bulundu'}
          </span>
          {isFiltered && (
            <button onClick={onReset} className="reset-filter-btn">
              <RotateCcw size={13} />
              <span>{isEn ? 'Clear Filters' : 'Tümünü Temizle'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Filter Grid: Ana Kategori & Arama (Alt Kategori ve Stok Kodu kutuları kaldırıldı) */}
      <div className="cascading-grid">
        {/* Dropdown: Ana Kategori */}
        <div className="filter-select-group">
          <label className="select-label">
            <Layers size={13} />
            <span>{isEn ? 'Main Category' : 'Ana Kategori'}</span>
          </label>
          <div className="select-input-wrap">
            <select
              value={anaKategori}
              onChange={handleAnaKategoriChange}
              className="cascading-select"
            >
              <option value="Tümü">{isEn ? 'All Main Categories' : 'Tüm Ana Kategoriler'}</option>
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
              <span>{isEn ? 'Search Product / Code' : 'Ürün / Stok Ara'}</span>
            </label>
            <div className="search-input-wrap">
              <Search size={14} className="search-icon-inside" />
              <input
                type="text"
                placeholder={isEn ? "e.g. STK-554, Antik, Klinker..." : "Örn: STK-554, Antik, Klinker..."}
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

      {/* Subcategory Row: Appears dynamically under the main category when a Main Category is selected */}
      {subCategories.length > 0 && anaKategori !== 'Tümü' && anaKategori !== 'All' && (
        <div className="subcategory-selection-bar">
          <div className="subcat-bar-header">
            <Tag size={13} className="subcat-tag-icon" />
            <span>{isEn ? `Subcategories for "${anaKategori}":` : `"${anaKategori}" Alt Kategorileri:`}</span>
          </div>

          <div className="subcat-buttons-list">
            <button
              type="button"
              onClick={() => handleAltKategoriSelect('Tümü')}
              className={`subcat-pill-btn ${altKategori === 'Tümü' || altKategori === 'All' ? 'active' : ''}`}
            >
              {isEn ? 'All in this Category' : 'Tümü'}
            </button>

            {subCategories.map((sub) => {
              const isActive = altKategori === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleAltKategoriSelect(sub)}
                  className={`subcat-pill-btn ${isActive ? 'active' : ''}`}
                >
                  {sub}
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
          border-radius: 4px;
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
          color: var(--accent-terracotta);
        }
        .filter-header-title {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.1em;
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
          font-weight: 600;
          color: var(--accent-terracotta);
          background-color: var(--bg-primary);
          padding: 4px 12px;
          border: 1px solid var(--border-light);
          border-radius: 2px;
        }
        .reset-filter-btn {
          background: none;
          border: 1px solid var(--accent-terracotta);
          color: var(--accent-terracotta);
          padding: 5px 12px;
          font-size: 0.78rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: var(--transition-smooth);
          border-radius: 2px;
        }
        .reset-filter-btn:hover {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
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
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
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
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          padding: 10px 32px 10px 14px;
          font-size: 0.88rem;
          color: var(--text-main);
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          border-radius: 3px;
        }
        .cascading-select:focus, .cascading-text-input:focus {
          border-color: var(--accent-terracotta);
          background-color: #FFFFFF;
        }
        .select-chevron {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .search-icon-inside {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .cascading-text-input {
          width: 100%;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          padding: 10px 32px 10px 36px;
          font-size: 0.88rem;
          color: var(--text-main);
          outline: none;
          transition: border-color 0.2s;
          border-radius: 3px;
          box-sizing: border-box;
        }
        .search-clear-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .search-clear-btn:hover {
          color: var(--accent-terracotta);
        }

        /* Subcategory Dynamic Selection Bar */
        .subcategory-selection-bar {
          margin-top: 18px;
          padding: 14px 18px;
          background-color: var(--bg-primary);
          border: 1px dashed var(--accent-terracotta);
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          animation: subcatFadeIn 0.25s ease-out;
        }
        @keyframes subcatFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .subcat-bar-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--accent-terracotta);
          white-space: nowrap;
        }
        .subcat-tag-icon {
          color: var(--accent-terracotta);
        }
        .subcat-buttons-list {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .subcat-pill-btn {
          padding: 6px 14px;
          font-size: 0.82rem;
          font-weight: 500;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          color: var(--text-main);
          cursor: pointer;
          transition: var(--transition-smooth);
          border-radius: 3px;
        }
        .subcat-pill-btn:hover {
          border-color: var(--accent-terracotta);
          color: var(--accent-terracotta);
        }
        .subcat-pill-btn.active {
          background-color: var(--accent-terracotta);
          border-color: var(--accent-terracotta);
          color: #FFFFFF;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .cascading-grid { grid-template-columns: 1fr; }
          .filter-header-bar { flex-direction: column; align-items: flex-start; }
          .subcategory-selection-bar { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
