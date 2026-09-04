import React, { useState, useMemo } from 'react';
import { Search, RefreshCw, Download, ChevronRight, Layers, ArrowRight } from 'lucide-react';
import { filterProducts, getMainCategories } from '../data/products';
import { TRANSLATIONS } from '../data/translations';
import ProductCard from './ProductCard';
import CascadingFilter from './CascadingFilter';

const ITEMS_PER_PAGE = 24;

export default function ProductsPage({ 
  lang = 'TR', 
  selectedCategory: propCategory, 
  setSelectedCategory: propSetCategory, 
  onSelectProduct, 
  onNavigate 
}) {
  const [anaKategori, setAnaKategori] = useState('Tümü');
  const [altKategori, setAltKategori] = useState('Tümü');
  const [stokKodu, setStokKodu] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const t = TRANSLATIONS[lang ? lang : 'TR'].products;
  const isEn = lang === 'EN';

  // If selectedCategory prop came from Header dropdown or Breadcrumb navigation
  React.useEffect(() => {
    if (propCategory && propCategory !== 'Tümü' && propCategory !== 'All') {
      const mainCats = getMainCategories();
      if (mainCats.includes(propCategory)) {
        setAnaKategori(propCategory);
        setAltKategori('Tümü');
      } else {
        setAnaKategori('Tümü');
        setAltKategori(propCategory);
      }
      setStokKodu('Tümü');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [propCategory]);

  const filteredList = useMemo(() => {
    try {
      const res = filterProducts({
        anaKategori,
        altKategori,
        stokKodu,
        searchQuery
      });
      return Array.isArray(res) ? res : [];
    } catch (err) {
      console.error('Error filtering products in ProductsPage:', err);
      return [];
    }
  }, [anaKategori, altKategori, stokKodu, searchQuery]);

  const handleResetFilters = () => {
    setAnaKategori('Tümü');
    setAltKategori('Tümü');
    setStokKodu('Tümü');
    setSearchQuery('');
    setVisibleCount(ITEMS_PER_PAGE);
    if (propSetCategory) propSetCategory('Tümü');
  };

  const displayedProducts = (Array.isArray(filteredList) ? filteredList : []).slice(0, visibleCount);
  const hasMore = visibleCount < (Array.isArray(filteredList) ? filteredList.length : 0);

  return (
    <div className="products-page">
      {/* Breadcrumb Header Bar */}
      <div className="page-header-bar">
        <div className="container">
          <div className="breadcrumb">
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
              {isEn ? 'Home' : 'Ana Sayfa'}
            </a>
            <ChevronRight size={14} />
            <span className="current">{isEn ? 'Products Catalog' : 'Ürün Kataloğumuz'}</span>
          </div>

          <div className="header-title-box">
            <div>
              <span className="section-tag">{t.tag}</span>
              <h1 className="page-main-title">
                {altKategori !== 'Tümü' && altKategori !== 'All' 
                  ? altKategori 
                  : (anaKategori !== 'Tümü' && anaKategori !== 'All' ? anaKategori : t.title)}
              </h1>
              <p className="page-main-sub">{t.subtitle}</p>
            </div>

            <div className="header-cta-group">
              <a 
                href="/assets/catalog/katalog.pdf" 
                target="_blank" 
                rel="noreferrer" 
                className="btn-outline-light"
              >
                <Download size={16} /> {TRANSLATIONS[lang ? lang : 'TR'].catalog.downloadBtn}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Container */}
      <div className="container page-content">
        {/* Cascading / Dependent Filter (Ana Kategori -> Alt Kategori -> Stok Kodu) */}
        <CascadingFilter
          anaKategori={anaKategori}
          setAnaKategori={setAnaKategori}
          altKategori={altKategori}
          setAltKategori={setAltKategori}
          stokKodu={stokKodu}
          setStokKodu={setStokKodu}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onReset={handleResetFilters}
          lang={lang}
          resultCount={filteredList.length}
        />

        {/* Product Grid */}
        {displayedProducts.length > 0 ? (
          <>
            <div className="products-grid">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.stokKodu}
                  product={product}
                  lang={lang}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>

            {/* Load More Pagination Button */}
            {hasMore && (
              <div className="load-more-container">
                <button
                  onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                  className="btn-primary load-more-btn"
                >
                  <span>{isEn ? 'Load More Products' : 'Daha Fazla Ürün Yükle'}</span>
                  <span className="load-count-badge">({filteredList.length - visibleCount} {isEn ? 'remaining' : 'kaldı'})</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-results-box">
            <p>{t.noResults}</p>
            <button
              className="btn-outline"
              onClick={handleResetFilters}
              style={{ marginTop: '16px' }}
            >
              <RefreshCw size={14} /> {t.resetFilters}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .products-page {
          background-color: var(--bg-primary);
          min-height: 80vh;
          padding-bottom: 90px;
        }
        .page-header-bar {
          background-color: var(--bg-dark);
          color: #FFFFFF;
          padding: 48px 0;
          border-bottom: 1px solid var(--border-dark);
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--text-light-muted);
          margin-bottom: 20px;
        }
        .breadcrumb a {
          color: var(--text-light-muted);
          text-decoration: none;
        }
        .breadcrumb a:hover {
          color: #FFFFFF;
        }
        .breadcrumb .current {
          color: var(--accent-clay);
          font-weight: 500;
        }
        .header-title-box {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 32px;
          flex-wrap: wrap;
        }
        .page-main-title {
          font-size: 3.2rem;
          line-height: 1.1;
          color: #FFFFFF;
          margin-top: 4px;
          margin-bottom: 12px;
        }
        .page-main-sub {
          font-size: 1.05rem;
          color: var(--text-light-muted);
          max-width: 680px;
        }
        .header-cta-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .page-content {
          padding-top: 40px;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 28px;
        }
        .load-more-container {
          display: flex;
          justify-content: center;
          margin-top: 50px;
        }
        .load-more-btn {
          padding: 16px 36px;
          font-size: 0.95rem;
        }
        .load-count-badge {
          font-size: 0.8rem;
          opacity: 0.8;
          font-weight: 400;
        }
        .no-results-box {
          text-align: center;
          padding: 80px 20px;
          background-color: var(--bg-surface);
          border: 1px dashed var(--border-light);
          color: var(--text-muted);
        }
        @media (max-width: 768px) {
          .page-main-title { font-size: 2.2rem; }
          .header-title-box { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
