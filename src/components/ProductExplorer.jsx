import React, { useState, useMemo } from "react";
import { ArrowRight, Layers } from "lucide-react";
import { filterProducts, safeGetProducts } from "../data/products";
import { TRANSLATIONS } from "../data/translations";
import CascadingFilter from "./CascadingFilter";
import ProductCard from "./ProductCard";

export default function ProductExplorer({ lang, onSelectProduct, onNavigateToProducts, onOpenQuoteModal }) {
  const [anaKategori, setAnaKategori] = useState("Tümü");
  const [altKategori, setAltKategori] = useState("Tümü");
  const [stokKodu, setStokKodu] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");

  const t = TRANSLATIONS[lang ? lang : "TR"].products;
  const isEn = lang === "EN";

  const allProducts = useMemo(() => safeGetProducts() || [], []);

  const filteredProducts = useMemo(() => {
    return filterProducts({
      anaKategori,
      altKategori,
      stokKodu,
      searchQuery
    });
  }, [anaKategori, altKategori, stokKodu, searchQuery]);

  const handleResetFilters = () => {
    setAnaKategori("Tümü");
    setAltKategori("Tümü");
    setStokKodu("Tümü");
    setSearchQuery("");
  };

  const isMainCategorySelected = Boolean(anaKategori && anaKategori !== "Tümü" && anaKategori !== "All");
  const isSubcategorySelected = Boolean(altKategori && altKategori !== "Tümü" && altKategori !== "All");
  const isSearchActive = Boolean(searchQuery && searchQuery.trim() !== "");

  // 1. Initial State ("Tümü"): Default product catalog is shown
  // 2. Main Category Selected: Products hidden, ONLY visual subcategory cards are shown
  // 3. Subcategory Selected (or Search): Matching products are shown
  const shouldShowProducts = isSearchActive || !isMainCategorySelected || isSubcategorySelected;

  // Limit display to 4 items on homepage preview
  const displayedProducts = filteredProducts.slice(0, 4);

  return (
    <section id="products" className="products-section">
      <div className="container">
        {/* Top Header Row */}
        <div className="section-header-flex">
          <div className="header-left-col">
            <span className="section-tag">{t.tag}</span>
            <h2 className="section-title">{t.title}</h2>
            <p className="section-subtitle">
              {isEn 
                ? "Ancient facing, handmade klinker, culture brick, fire brick and facing solutions across 18 main product groups in our PDF Catalog."
                : "PDF Kataloğumuzda yer alan 18 temel ürün grubundaki antik kaplama, el yapımı klinker, kültür tuğlası, ateş tuğlası ve kaplama çözümleri."}
            </p>
          </div>

          <button onClick={onNavigateToProducts} className="btn-primary btn-catalog-link">
            <Layers size={16} />
            <span>{isEn ? "ALL PRODUCTS PAGE" : "TÜM ÜRÜNLERİMİZ SAYFASI"}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Embedded Cascading Filter Bar */}
        <div style={{ marginTop: "28px", marginBottom: "32px" }}>
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
            resultCount={filteredProducts.length}
          />
        </div>

        {/* Product Cards 4-Grid - Controlled by 3-step hierarchy */}
        {shouldShowProducts && (
          displayedProducts.length > 0 ? (
            <div className="homepage-products-4grid">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.stokKodu || product.id}
                  product={product}
                  lang={lang}
                  onSelectProduct={onSelectProduct}
                  onOpenQuoteModal={onOpenQuoteModal}
                  showInspect={false}
                />
              ))}
            </div>
          ) : (
            <div className="no-results-box text-center">
              <p>{t.noResults}</p>
              <button className="btn-outline-dark" onClick={handleResetFilters} style={{ marginTop: "14px" }}>
                {t.resetFilters}
              </button>
            </div>
          )
        )}


      </div>

      <style>{`
        .products-section {
          padding: 90px 0;
          background-color: var(--bg-primary);
        }
        .section-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          flex-wrap: wrap;
        }
        .header-left-col {
          max-width: 720px;
        }
        .section-tag {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--accent-terracotta);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }
        .section-title {
          font-size: 2.3rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.25;
          margin-bottom: 12px;
          font-family: var(--font-heading);
        }
        .section-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .btn-catalog-link {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
          font-weight: 700;
          padding: 14px 24px;
          border-radius: 6px;
          letter-spacing: 0.04em;
          transition: background-color 0.25s ease;
        }
        .btn-catalog-link:hover {
          background-color: var(--accent-terracotta-hover);
        }
        .homepage-products-4grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .btn-outline-dark {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 6px;
          border: 2px solid var(--text-main);
          background: none;
          color: var(--text-main);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .btn-outline-dark:hover {
          background-color: var(--text-main);
          color: #FFFFFF;
        }
        .no-results-box {
          padding: 40px;
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 8px;
        }
        .text-center { text-align: center; }

        @media (max-width: 1200px) {
          .homepage-products-4grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .homepage-products-4grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .homepage-products-4grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
