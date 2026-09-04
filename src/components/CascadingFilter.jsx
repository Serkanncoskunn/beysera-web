import React from 'react';
import { Filter, RotateCcw, ChevronDown, Layers, Tag, Search, Check } from 'lucide-react';
import { getMainCategories, getSubcategories, getStockCodes } from '../data/products';

export default function CascadingFilter({
  anaKategori,
  setAnaKategori,
  altKategori,
  setAltKategori,
  stokKodu,
  setStokKodu,
  searchQuery,
  setSearchQuery,
  onReset,
  lang = 'TR',
  resultCount = 0
}) {
  const isEn = lang === 'EN';
  const mainCategories = Array.isArray(getMainCategories()) ? getMainCategories() : [];
  const subCategories = Array.isArray(getSubcategories(anaKategori)) ? getSubcategories(anaKategori) : [];
  const stockCodeOptions = Array.isArray(getStockCodes(anaKategori, altKategori)) ? getStockCodes(anaKategori, altKategori) : [];

  const handleAnaKategoriChange = (e) => {
    const val = e.target.value;
    setAnaKategori(val);
    setAltKategori('Tümü');
    setStokKodu('Tümü');
  };

  const handleAltKategoriChange = (e) => {
    const val = e.target.value;
    setAltKategori(val);
    setStokKodu('Tümü');
  };

  const handleStokKoduChange = (e) => {
    setStokKodu(e.target.value);
  };

  const isFiltered = (anaKategori && anaKategori !== 'Tümü' && anaKategori !== 'All') ||
                     (altKategori && altKategori !== 'Tümü' && altKategori !== 'All') ||
                     (stokKodu && stokKodu !== 'Tümü' && stokKodu !== 'All') ||
                     (searchQuery && searchQuery.trim() !== '');

  return (
    <div className="cascading-filter-wrapper">
      <div className="filter-header-bar">
        <div className="filter-header-left">
          <Filter size={18} className="filter-title-icon" />
          <span className="filter-header-title">
            {isEn ? 'DEPENDENT PRODUCT FILTERS' : 'MİMARİ KATEGORİ VE STOK FİLTRESİ'}
          </span>
        </div>

        <div className="filter-header-right">
          <span className="result-badge">
            {resultCount} {isEn ? 'Products Found' : 'Ürün Bulundu'}
          </span>
          {isFiltered && (
            <button onClick={onReset} className="reset-filter-btn">
              <RotateCcw size={13} />
              <span>{isEn ? 'Clear All Filters' : 'Tümünü Temizle'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="cascading-grid">
        {/* Dropdown 1: Ana Kategori */}
        <div className="filter-select-group">
          <label className="select-label">
            <Layers size={13} />
            <span>1. {isEn ? 'Main Category' : 'Ana Kategori'}</span>
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

        {/* Dropdown 2: Alt Kategori (Dependent) */}
        <div className="filter-select-group">
          <label className="select-label">
            <Tag size={13} />
            <span>2. {isEn ? 'Subcategory' : 'Alt Kategori'}</span>
          </label>
          <div className="select-input-wrap">
            <select
              value={altKategori}
              onChange={handleAltKategoriChange}
              className="cascading-select"
              disabled={subCategories.length === 0}
            >
              <option value="Tümü">
                {anaKategori !== 'Tümü' && anaKategori !== 'All'
                  ? (isEn ? `All ${anaKategori} Subcategories` : `Tüm ${anaKategori} Alt Kategorileri`)
                  : (isEn ? 'All Subcategories' : 'Tüm Alt Kategoriler')}
              </option>
              {subCategories.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            <ChevronDown size={14} className="select-chevron" />
          </div>
        </div>

        {/* Dropdown 3: Stok Kodu (Dependent) */}
        <div className="filter-select-group">
          <label className="select-label">
            <Check size={13} />
            <span>3. {isEn ? 'Stock Code' : 'Stok Kodu'}</span>
          </label>
          <div className="select-input-wrap">
            <select
              value={stokKodu}
              onChange={handleStokKoduChange}
              className="cascading-select"
            >
              <option value="Tümü">{isEn ? 'All Stock Codes' : 'Tüm Stok Kodları'}</option>
              {stockCodeOptions.slice(0, 150).map((item) => {
                if (!item) return null;
                const code = typeof item === 'string' ? item : (item.stokKodu || '');
                const name = typeof item === 'string' ? item : (item.stokAdi || code);
                return (
                  <option key={code} value={code}>
                    {code} {name && name !== code ? `— ${name.length > 28 ? name.substring(0, 28) + '...' : name}` : ''}
                  </option>
                );
              })}
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
                placeholder={isEn ? "e.g. STK-554, Kandıra..." : "Örn: STK-554, Kandıra..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cascading-text-input"
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        .cascading-filter-wrapper {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 24px;
          margin-bottom: 40px;
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
        }
        .reset-filter-btn:hover {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
        }
        .cascading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
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
          padding: 10px 14px 10px 36px;
          font-size: 0.88rem;
          color: var(--text-main);
          outline: none;
          transition: border-color 0.2s;
        }
        @media (max-width: 768px) {
          .cascading-grid { grid-template-columns: 1fr; }
          .filter-header-bar { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
