import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, MapPin, Layers, Tag, Check, MessageSquare, Phone, 
  Download, Maximize2, ChevronLeft, ChevronRight as ChevronRightIcon,
  Building2, ArrowRight, ShieldCheck, Flame, Leaf, HelpCircle, ArrowLeft, FileText, Camera, CheckCircle2
} from 'lucide-react';
import { getProductByStockCode, getRelatedProducts } from '../data/products';
import { TRANSLATIONS } from '../data/translations';
import ProductCard from './ProductCard';
import LightboxModal from './LightboxModal';
import RegionSelectModal from './RegionSelectModal';

export default function ProductDetailPage({ 
  stockCode, 
  lang = 'TR', 
  onNavigate, 
  onSelectProduct,
  onOpenQuoteModal,
  onSelectCategory
}) {
  const [product, setProduct] = useState(null);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  const isEn = lang === 'EN';

  useEffect(() => {
    if (stockCode) {
      const found = getProductByStockCode(stockCode);
      setProduct(found);
      setSelectedImgIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // SEO Document Title
      if (found) {
        document.title = `${found.stokAdi} (${found.stokKodu}) — Tuğla Dünyası`;
      }
    }
  }, [stockCode]);

  if (!product) {
    return (
      <div className="product-not-found container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>
          {isEn ? 'Product Not Found' : 'Ürün Bulunamadı'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          {isEn ? `No product matches stock code "${stockCode}"` : `"${stockCode}" stok koduna ait ürün bulunamadı veya kaldırıldı.`}
        </p>
        <button onClick={() => onNavigate('urunler')} className="btn-primary">
          <ArrowLeft size={16} /> {isEn ? 'Back to All Products' : 'Tüm Ürünlerimize Dön'}
        </button>
      </div>
    );
  }

  const primaryImg = product.gorsel || product.mainImage || product.image || '/images/product_placeholder.png';
  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : [primaryImg];

  const currentImg = images[selectedImgIndex] || images[0];
  const relatedProducts = getRelatedProducts(product, 4);

  // WhatsApp Pre-filled message generator (Req 12)
  const waMsg = encodeURIComponent(
    `Merhaba, ${product.stokAdi} ürünü hakkında bilgi almak istiyorum. Stok kodu: ${product.stokKodu}`
  );
  const waUrl = `https://wa.me/905493527200?text=${waMsg}`;

  const nextImage = () => {
    setSelectedImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openZoom = (imgUrl) => {
    setActiveLightboxImg(imgUrl);
    setLightboxOpen(true);
  };

  const handleCategoryClick = (catName) => {
    if (onSelectCategory) {
      onSelectCategory(catName);
    } else if (onNavigate) {
      onNavigate('urunler');
    }
  };

  return (
    <div className="product-detail-page">
      {/* Breadcrumb Header Bar (Req 20) */}
      <div className="page-header-bar">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a 
              href="/" 
              className="crumb-link"
              onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            >
              {isEn ? 'Home' : 'Ana Sayfa'}
            </a>
            <ChevronRight size={13} />
            <a 
              href="/urunler" 
              className="crumb-link"
              onClick={(e) => { 
                e.preventDefault(); 
                handleCategoryClick('Tümü');
              }}
            >
              {isEn ? 'Products' : 'Ürünler'}
            </a>
            <ChevronRight size={13} />
            <a 
              href={`/urunler?cat=${encodeURIComponent(product.anaKategori)}`}
              className="crumb-link crumb-category"
              onClick={(e) => {
                e.preventDefault();
                handleCategoryClick(product.anaKategori);
              }}
            >
              {product.anaKategori}
            </a>
            {product.altKategori && (
              <>
                <ChevronRight size={13} />
                <a 
                  href={`/urunler?cat=${encodeURIComponent(product.altKategori)}`}
                  className="crumb-link crumb-subcat"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(product.altKategori);
                  }}
                >
                  {product.altKategori}
                </a>
              </>
            )}
            <ChevronRight size={13} />
            <span className="current">{product.stokAdi}</span>
          </nav>

          <div className="header-meta-row">
            <div className="code-pill">
              <span>{isEn ? 'STOCK CODE:' : 'STOK KODU:'}</span>
              <strong>{product.stokKodu}</strong>
            </div>
            <div className="category-pills-row">
              <button 
                className="meta-pill clickable-pill"
                onClick={() => handleCategoryClick(product.anaKategori)}
              >
                {product.anaKategori}
              </button>
              {product.altKategori && (
                <button 
                  className="meta-pill sub clickable-pill"
                  onClick={() => handleCategoryClick(product.altKategori)}
                >
                  {product.altKategori}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Product Layout (Req 7, 8) */}
      <div className="container page-content">
        <div className="product-layout-grid">
          {/* Left Column: High-Res Photo Gallery */}
          <div className="gallery-column">
            <div className="main-viewer-box">
              <img 
                src={currentImg} 
                alt={product.stokAdi} 
                className="main-display-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/product_placeholder.png';
                }}
              />

              

              {/* Prev / Next Controls */}
              {images.length > 1 && (
                <>
                  <button className="nav-arrow prev-arrow" onClick={prevImage} aria-label="Previous image">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="nav-arrow next-arrow" onClick={nextImage} aria-label="Next image">
                    <ChevronRightIcon size={20} />
                  </button>
                </>
              )}

              {/* Zoom Trigger */}
              <button 
                className="zoom-trigger-btn"
                onClick={() => openZoom(currentImg)}
              >
                <Maximize2 size={16} />
                <span>{isEn ? 'Fullscreen Zoom' : 'Tam Ekran Gör'}</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="thumbnail-strip">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumb-btn ${selectedImgIndex === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImgIndex(idx)}
                  >
                    <img 
                      src={img} 
                      alt={`${product.stokAdi} thumb ${idx}`} 
                      className="thumb-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/product_placeholder.png';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Architectural Trust Points */}
            <div className="architectural-trust-box">
              <div className="trust-item">
                <Flame size={18} className="trust-icon" />
                <div>
                  <strong>{isEn ? 'Kiln Fired Natural Clay' : '%100 Doğal Pişmiş Toprak'}</strong>
                  <p>{isEn ? 'Durable, non-combustible material' : 'Uzun ömürlü, yanmaz A1 sınıfı mimari kaplama'}</p>
                </div>
              </div>
              <div className="trust-item">
                <ShieldCheck size={18} className="trust-icon" />
                <div>
                  <strong>{isEn ? 'Freeze & Heat Resistance' : 'Dona ve Isıya Tam Dayanıklı'}</strong>
                  <p>{isEn ? 'Extreme weather resistance F2 standard' : 'Zorlu dış iklim ve termal şok direnci'}</p>
                </div>
              </div>
              <div className="trust-item">
                <Leaf size={18} className="trust-icon" />
                <div>
                  <strong>{isEn ? 'Maintenance Free' : 'Bakımsız ve Sürdürülebilir'}</strong>
                  <p>{isEn ? 'Color retention for decades' : 'Boya gerektirmeden onlarca yıl ilk günkü estetik'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & CTA Actions (Req 7, 8, 11, 12, 13) */}
          <div className="info-column">
            <span 
              className="sub-title-tag clickable-tag"
              onClick={() => handleCategoryClick(product.anaKategori)}
            >
              {product.anaKategori} • {product.altKategori}
            </span>
            <h1 className="product-name-heading">{product.stokAdi}</h1>

            <div className="spec-code-card">
              <span className="code-label">{isEn ? 'Stock Code:' : 'STOK KODU:'}</span>
              <strong className="code-value">{product.stokKodu}</strong>
            </div>

            {/* Primary Action Buttons (Sollu & Sağlı CTA Box - Prime Position) */}
            <div className="main-cta-duo-card">
              <button 
                onClick={() => setIsRegionModalOpen(true)} 
                className="btn-cta-duo btn-cta-whatsapp"
                type="button"
              >
                <Phone size={18} />
                <span>{isEn ? 'WhatsApp Price & Info' : 'WhatsApp ile Bilgi / Fiyat Al'}</span>
              </button>

              <button 
                onClick={() => onOpenQuoteModal && onOpenQuoteModal(product)} 
                className="btn-cta-duo btn-cta-quote"
                type="button"
              >
                <MessageSquare size={18} />
                <span>{isEn ? 'Request Official Offer' : 'Teklif ve Numune Talep Et'}</span>
              </button>
            </div>

            {/* Description Card Box */}
            {product.aciklama && (
              <div className="product-overview-card">
                <h3 className="section-subtitle-heading">{isEn ? 'Product Description' : 'Ürün Açıklaması'}</h3>
                <div className="overview-bullet-list">
                  {product.aciklama.split('\n').filter(Boolean).map((line, idx) => {
                    const cleanLine = line.replace(/^•\s*/, '').trim();
                    const colonIdx = cleanLine.indexOf(':');
                    const label = colonIdx !== -1 ? cleanLine.substring(0, colonIdx + 1) : '';
                    const val = colonIdx !== -1 ? cleanLine.substring(colonIdx + 1).trim() : cleanLine;
                    return (
                      <div key={idx} className="overview-bullet-item">
                        <CheckCircle2 size={16} className="bullet-check-icon" />
                        <div className="bullet-text-box">
                          {label && <strong className="bullet-label">{label} </strong>}
                          <span className="bullet-val">{val}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Technical Specifications Table */}
            <div className="tech-specs-card">
              <h3 className="section-subtitle-heading">{isEn ? 'Technical Specifications' : 'Teknik Özellikler'}</h3>
              
              <table className="tech-specs-table">
                <tbody>
                  <tr>
                    <td>{isEn ? 'Stock Code' : 'Stok Kodu'}</td>
                    <td><strong>{product.stokKodu}</strong></td>
                  </tr>
                  <tr>
                    <td>{isEn ? 'Stock Name' : 'Stok Adı'}</td>
                    <td><strong>{product.stokAdi}</strong></td>
                  </tr>
                  <tr>
                    <td>{isEn ? 'Main Category' : 'Ana Kategori'}</td>
                    <td>
                      <span 
                        className="clickable-table-link"
                        onClick={() => handleCategoryClick(product.anaKategori)}
                      >
                        {product.anaKategori}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>{isEn ? 'Product Group' : 'Ürün Grubu'}</td>
                    <td>
                      <span 
                        className="clickable-table-link"
                        onClick={() => handleCategoryClick(product.altKategori)}
                      >
                        {product.altKategori}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>{isEn ? 'Material' : 'Malzeme Yapısı'}</td>
                    <td>%100 Doğal Kil / Pişmiş Toprak Yapı Malzemesi</td>
                  </tr>
                  <tr>
                    <td>{isEn ? 'Reaction to Fire' : 'Yangın Sınıfı'}</td>
                    <td>Sınıf A1 (Yanmaz Malzeme)</td>
                  </tr>
                  <tr>
                    <td>{isEn ? 'Weather Resistance' : 'İklim Dayanımı'}</td>
                    <td>F2 Tam Don ve Termal Direnç</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* Section: "Bu Ürünle Gerçekleştirilen Projeler" */}
        <div className="product-projects-prominent-section">
          <div className="section-header">
            <Building2 size={24} className="proj-header-icon" />
            <div>
              <h2 className="section-title">
                {isEn ? 'Projects Executed with This Product' : 'Bu Ürünle Gerçekleştirilen Projeler'}
              </h2>
              <p className="section-subtitle">
                {isEn 
                  ? 'Reference architectural applications and real site projects featuring this stock item.' 
                  : `"${product.stokKodu}" stok kodlu ürünümüzün tercih edildiği mimari uygulama ve referans projeler.`}
              </p>
            </div>
          </div>

          {product.hasProjectImages ? (
            <div className="project-images-grid">
              {product.projectImages.map((pImg, pIdx) => (
                <div key={pIdx} className="project-img-card" onClick={() => openZoom(pImg)}>
                  <img 
                    src={pImg} 
                    alt={`${product.stokAdi} Proje Uygulaması ${pIdx + 1}`} 
                    className="project-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/product_placeholder.png';
                    }}
                  />
                  <div className="project-img-overlay">
                    <Camera size={20} className="cam-icon" />
                    <span>{isEn ? 'View Reference Photo' : 'Referans Fotoğrafını Büyüt'}</span>
                  </div>
                  <div className="project-badge-tag">{product.stokKodu} PROJE UYGULAMASI</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="projects-placeholder-card">
              <p>
                {isEn 
                  ? 'No reference photos uploaded yet for this stock item.' 
                  : `"${product.stokKodu}" stok koduna ait henüz referans proje görseli bulunmamaktadır.`}
              </p>
              <button onClick={() => onOpenQuoteModal && onOpenQuoteModal(product)} className="btn-outline" style={{ marginTop: '16px' }}>
                <span>{isEn ? 'Request Sample for Your Project' : 'Projeniz İçin Numune ve Bilgi İsteyin'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Full-Width Architectural Specification Sheet Card Section (100% Width) */}
        {product.aciklama2 && (
          <div className="full-width-spec-card-section">
            <div className="spec-card-header-banner">
              <div className="spec-banner-left">
                <FileText size={22} className="banner-icon" />
                <div>
                  <h3 className="spec-banner-title">
                    {isEn ? 'DETAILED ARCHITECTURAL SPECIFICATION SHEET' : 'DETAYLI MİMARİ SPESİFİKASYON KARTI'}
                  </h3>
                  <span className="spec-banner-sub">{product.stokAdi} — {product.stokKodu}</span>
                </div>
              </div>

              <div className="spec-banner-right">
                <span className="spec-badge-label">TSE / CE CERTIFIED</span>
              </div>
            </div>

            <div className="spec-card-body-content">
              <pre className="spec-formatted-pre">{product.aciklama2}</pre>
            </div>
          </div>
        )}

        {/* Section: "Benzer Ürünler" (Req 9) */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <div className="section-header-flex">
              <div>
                <span className="section-tag">{isEn ? 'RELATED PRODUCTS' : 'BENZER ÜRÜNLER'}</span>
                <h2 className="section-title">
                  {isEn ? `Other Products in ${product.altKategori}` : `${product.altKategori} Kategorisindeki Diğer Ürünler`}
                </h2>
              </div>

              <button 
                onClick={() => handleCategoryClick(product.altKategori)} 
                className="btn-outline"
              >
                <span>{isEn ? 'View All Related Products' : 'Tüm Benzer Ürünleri Gör'}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="products-grid">
              {relatedProducts.map((relProd) => (
                <ProductCard
                  key={relProd.stokKodu}
                  product={relProd}
                  lang={lang}
                  onSelectProduct={(p) => {
                    if (onSelectProduct) onSelectProduct(p);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Zoom Modal */}
      {lightboxOpen && (
        <LightboxModal
          imageSrc={activeLightboxImg || currentImg}
          title={`${product.stokAdi} (${product.stokKodu})`}
          onClose={() => {
            setLightboxOpen(false);
            setActiveLightboxImg(null);
          }}
        />
      )}

      {/* Region Selector Modal for WhatsApp Pricing */}
      <RegionSelectModal
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        product={product}
        lang={lang}
      />

      <style>{`
        .product-detail-page {
          background-color: var(--bg-primary);
          min-height: 80vh;
          padding-bottom: 100px;
        }
        .main-cta-duo-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 28px;
        }
        .btn-cta-duo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 18px;
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.25s ease;
          border: 1px solid transparent;
          box-shadow: 0 4px 14px rgba(0,0,0,0.05);
        }
        .btn-cta-whatsapp {
          background-color: #25D366;
          color: #FFFFFF;
        }
        .btn-cta-whatsapp:hover {
          background-color: #1EBE57;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 211, 102, 0.35);
        }
        .btn-cta-quote {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
        }
        .btn-cta-quote:hover {
          background-color: var(--accent-clay);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(184, 91, 53, 0.35);
        }
        .page-header-bar {
          background-color: var(--bg-dark);
          color: #FFFFFF;
          padding: 32px 0;
          border-bottom: 1px solid var(--border-dark);
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-light-muted);
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .crumb-link {
          color: var(--text-light-muted);
          text-decoration: none;
          transition: color 0.2s, text-decoration 0.2s;
          cursor: pointer;
        }
        .crumb-link:hover {
          color: var(--accent-clay);
          text-decoration: underline;
        }
        .crumb-category, .crumb-subcat {
          color: rgba(255,255,255,0.85);
          font-weight: 500;
        }
        .breadcrumb .current {
          color: var(--accent-clay);
          font-weight: 600;
        }
        .header-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .code-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-light-muted);
        }
        .code-pill strong {
          color: var(--accent-clay);
          font-size: 1.1rem;
          font-family: monospace;
          letter-spacing: 0.05em;
        }
        .category-pills-row {
          display: flex;
          gap: 8px;
        }
        .meta-pill {
          background-color: var(--bg-dark-surface);
          border: 1px solid var(--border-dark);
          color: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .meta-pill.sub {
          color: var(--accent-clay);
          border-color: rgba(226, 114, 91, 0.3);
        }
        .clickable-pill {
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .clickable-pill:hover {
          border-color: var(--accent-clay);
          background-color: rgba(214, 154, 104, 0.15);
        }
        .clickable-tag {
          cursor: pointer;
          transition: color 0.2s;
        }
        .clickable-tag:hover {
          color: var(--accent-clay);
          text-decoration: underline;
        }
        .clickable-table-link {
          color: var(--accent-terracotta);
          cursor: pointer;
          font-weight: 600;
          transition: text-decoration 0.2s;
        }
        .clickable-table-link:hover {
          text-decoration: underline;
        }
        .page-content {
          padding-top: 50px;
        }
        .product-layout-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 50px;
          margin-bottom: 50px;
        }
        .gallery-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .main-viewer-box {
          position: relative;
          width: 100%;
          height: 480px;
          background-color: #FAF8F5;
          border: 1px solid var(--border-light);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .main-display-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 12px;
        }
        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(25, 23, 22, 0.75);
          color: #FFFFFF;
          border: none;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .nav-arrow:hover {
          background-color: var(--accent-terracotta);
        }
        .prev-arrow { left: 12px; }
        .next-arrow { right: 12px; }
        .zoom-trigger-btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background-color: rgba(25, 23, 22, 0.88);
          color: #FFFFFF;
          border: none;
          padding: 8px 16px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .zoom-trigger-btn:hover {
          background-color: var(--accent-terracotta);
        }
        .thumbnail-strip {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 6px;
        }
        .thumb-btn {
          background: none;
          border: 1px solid var(--border-light);
          padding: 2px;
          cursor: pointer;
          width: 80px;
          height: 64px;
          flex-shrink: 0;
          opacity: 0.7;
          transition: var(--transition-smooth);
        }
        .thumb-btn.active, .thumb-btn:hover {
          opacity: 1;
          border-color: var(--accent-terracotta);
        }
        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .architectural-trust-box {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 10px;
        }
        .trust-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .trust-icon {
          color: var(--accent-terracotta);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .trust-item strong {
          font-size: 0.88rem;
          color: var(--text-main);
          display: block;
        }
        .trust-item p {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .info-column {
          display: flex;
          flex-direction: column;
        }
        .sub-title-tag {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--accent-terracotta);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .product-name-heading {
          font-size: 2.8rem;
          line-height: 1.12;
          color: var(--text-main);
          margin-bottom: 16px;
        }
        .spec-code-card {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 10px 16px;
          margin-bottom: 24px;
          width: fit-content;
        }
        .code-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .code-value {
          font-family: monospace;
          font-size: 1.1rem;
          color: var(--accent-terracotta);
          font-weight: 700;
        }
        .product-overview-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 24px;
          border-radius: 6px;
          margin-bottom: 28px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
        }
        .section-subtitle-heading {
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-main);
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--border-light);
        }
        .overview-bullet-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 14px;
        }
        .overview-bullet-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding-bottom: 10px;
          border-bottom: 1px dashed var(--border-light);
        }
        .overview-bullet-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .bullet-check-icon {
          color: var(--accent-terracotta);
          flex-shrink: 0;
          margin-top: 3px;
        }
        .bullet-text-box {
          font-size: 0.92rem;
          line-height: 1.55;
          color: var(--text-main);
        }
        .bullet-label {
          color: var(--accent-terracotta);
          font-weight: 700;
        }
        .bullet-val {
          color: var(--text-muted);
        }
        .tech-specs-card {
          margin-bottom: 28px;
        }
        .tech-specs-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }
        .tech-specs-table td {
          padding: 10px 0;
          border-bottom: 1px dashed var(--border-light);
        }
        .tech-specs-table td:first-child {
          color: var(--text-muted);
          width: 40%;
        }
        .tech-specs-table td:last-child {
          color: var(--text-main);
          text-align: right;
        }

        .product-projects-prominent-section {
          margin-bottom: 60px;
          padding-top: 36px;
          border-top: 1px solid var(--border-light);
        }
        .proj-header-icon {
          color: var(--accent-terracotta);
        }
        .project-images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 24px;
        }
        .project-img-card {
          position: relative;
          height: 240px;
          border: 1px solid var(--border-light);
          overflow: hidden;
          cursor: pointer;
          background-color: var(--bg-surface);
        }
        .project-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .project-img-card:hover .project-img {
          transform: scale(1.08);
        }
        .project-img-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(25, 23, 22, 0.65);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #FFFFFF;
          font-size: 0.85rem;
          font-weight: 600;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .project-img-card:hover .project-img-overlay {
          opacity: 1;
        }
        .project-badge-tag {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background-color: rgba(0,0,0,0.8);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 4px 10px;
        }

        .projects-placeholder-card {
          background-color: var(--bg-surface);
          border: 1px dashed var(--border-light);
          padding: 32px;
          text-align: center;
          color: var(--text-muted);
          margin-top: 24px;
        }

        .full-width-spec-card-section {
          width: 100%;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          margin-bottom: 70px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        }
        .spec-card-header-banner {
          background-color: var(--bg-dark);
          color: #FFFFFF;
          padding: 20px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          border-bottom: 2px solid var(--accent-terracotta);
        }
        .spec-banner-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .banner-icon {
          color: var(--accent-clay);
        }
        .spec-banner-title {
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #FFFFFF;
          margin-bottom: 2px;
        }
        .spec-banner-sub {
          font-size: 0.82rem;
          color: var(--text-light-muted);
        }
        .spec-badge-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--accent-clay);
          background-color: rgba(255,255,255,0.08);
          padding: 6px 14px;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .spec-card-body-content {
          padding: 32px;
          background-color: #FAFAFA;
        }
        .spec-formatted-pre {
          white-space: pre-wrap;
          font-family: inherit;
          font-size: 0.92rem;
          color: var(--text-main);
          line-height: 1.7;
          margin: 0;
          background-color: #FFFFFF;
          padding: 24px 28px;
          border: 1px solid var(--border-light);
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.02);
        }

        .cta-actions-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid var(--border-light);
        }
        .btn-whatsapp-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background-color: #25D366;
          color: #FFFFFF;
          border: 1px solid #25D366;
          padding: 16px 24px;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        .btn-whatsapp-cta:hover {
          background-color: #128C7E;
          border-color: #128C7E;
        }
        .btn-quote-cta {
          width: 100%;
          justify-content: center;
          padding: 16px 24px;
        }
        .related-products-section {
          padding-top: 40px;
          border-top: 1px solid var(--border-light);
        }
        .section-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        @media (max-width: 992px) {
          .product-layout-grid { grid-template-columns: 1fr; }
          .product-name-heading { font-size: 2.2rem; }
          .main-viewer-box { height: 340px; }
          .spec-card-body-content { padding: 16px; }
          .spec-formatted-pre { padding: 16px; }
        }
        @media (max-width: 640px) {
          .product-name-heading { font-size: 1.75rem; }
          .main-viewer-box { height: 260px; }
          .btn-group-2col { grid-template-columns: 1fr; }
          .spec-card-grid-2col { grid-template-columns: 1fr; }
          .spec-banner-left { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
      `}</style>
    </div>
  );
}
