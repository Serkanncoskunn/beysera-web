import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, MapPin, Layers, Tag, Check, MessageSquare, Phone, 
  Download, Maximize2, ChevronLeft, ChevronRight as ChevronRightIcon,
  Building2, ArrowRight, ShieldCheck, Flame, Leaf, HelpCircle, ArrowLeft, FileText, Camera, CheckCircle2,
  Palette, Sparkles
} from 'lucide-react';

const DCK_COLORS = [
  { id: 'siyah', name: 'Siyah', en: 'Black', hex: '#1C1C1C', textLight: true },
  { id: 'antrasit', name: 'Antrasit', en: 'Anthracite', hex: '#383E42', textLight: true },
  { id: 'koyu-gri', name: 'Koyu Gri (Kurşuni)', en: 'Dark Grey (Lead)', hex: '#5A5F64', textLight: true },
  { id: 'gri', name: 'Gri', en: 'Grey', hex: '#9DA2A6', textLight: false },
  { id: 'kahverengi', name: 'Kahverengi', en: 'Brown', hex: '#543828', textLight: true },
  { id: 'sutlu-kahve', name: 'Sütlü Kahve', en: 'Mocha / Latte', hex: '#A28C7A', textLight: false },
  { id: 'eflatun', name: 'Eflatun', en: 'Lilac', hex: '#A58D9E', textLight: false },
  { id: 'krem', name: 'Krem', en: 'Cream', hex: '#DFD5C6', textLight: false },
  { id: 'sampanya', name: 'Şampanya', en: 'Champagne', hex: '#E5CDB2', textLight: false },
  { id: 'fildisi', name: 'Fildişi', en: 'Ivory', hex: '#EFECE1', textLight: false },
  { id: 'bej', name: 'Bej', en: 'Beige', hex: '#D8CBB7', textLight: false },
  { id: 'beyaz', name: 'Beyaz', en: 'Pure White', hex: '#F7F7F5', textLight: false },
  { id: 'gok-mavi', name: 'Gök Mavi', en: 'Sky Blue', hex: '#96B9D0', textLight: false },
  { id: 'buz-mavi', name: 'Buz Mavi', en: 'Ice Blue', hex: '#B8C9D0', textLight: false },
  { id: 'gul-kurusu', name: 'Gül Kurusu', en: 'Dusty Rose', hex: '#B86358', textLight: true }
];
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
  const [selectedColor, setSelectedColor] = useState(null);

  const isEn = lang === 'EN';

  useEffect(() => {
    if (stockCode) {
      const found = getProductByStockCode(stockCode);
      setProduct(found);
      setSelectedImgIndex(0);
      setSelectedColor(null);
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
  const hasColorOptions = Boolean(product?.renk === 1 || product?.hasColors || product?.colorImage);
  const colorChartImage = product?.colorImage || (hasColorOptions ? `/assets/products/colors/${product?.stokKodu}.jpg` : null);

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
          <div className="breadcrumb-nav-row">
            {/* Geri Dön Butonu - Bir Önceki Sayfaya / Filtrelere Geri Götürür */}
            <button 
              type="button" 
              className="btn-detail-back"
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  if (onSelectCategory && product.anaKategori) {
                    onSelectCategory(product.anaKategori);
                  } else if (onNavigate) {
                    onNavigate('urunler');
                  }
                }
              }}
              title={isEn ? "Go back to previous page" : "Bir önceki sayfaya / filtrelenmiş listeye geri dön"}
            >
              <ArrowLeft size={16} />
              <span>{isEn ? "Back" : "Geri Dön"}</span>
            </button>

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
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    handleCategoryClick(product.anaKategori || 'Tümü');
                  }
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
          </div>

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
        {hasColorOptions ? (
          /* ========================================================================= */
          /* RENK İÇEREN ÜRÜNLER İÇİN ÖZEL DÜZEN:                                     */
          /* 1. ÜSTTE: Kategori, Ürün Adı, Stok Kodu ve WhatsApp / Teklif Butonları  */
          /* 2. ORTADA: Solda Ürün Görseli, Sağda Renk Kataloğu                       */
          /* 3. ALTTA: Ürün Açıklaması ve Teknik Özellikler Tablosu                  */
          /* ========================================================================= */
          <div className="color-product-custom-layout">
            {/* 1. ÜST BÖLÜM: Başlık, Kod ve CTA Butonları */}
            <div className="color-product-top-header">
              <div className="color-top-header-info">
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
              </div>

              {/* WhatsApp ve Teklif Butonları (Üstte Yan Yana) */}
              <div className="main-cta-duo-card top-cta-duo">
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
            </div>

            {/* 2. GÖRSEL BLOĞU: Solda Ürün Görseli, Sağda Renk Kataloğu */}
            <div className="product-duo-visual-grid">
              {/* SOL KOLON: Ürün Görseli & Galerisi */}
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

                  <button 
                    className="zoom-trigger-btn"
                    onClick={() => openZoom(currentImg)}
                  >
                    <Maximize2 size={16} />
                    <span>{isEn ? 'Fullscreen Zoom' : 'Tam Ekran Gör'}</span>
                  </button>
                </div>

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

              {/* SAĞ KOLON: Renk Kataloğu Görseli */}
              <div className="color-catalog-column">
                <div className="product-color-catalog-hero-card">
                  <div className="catalog-hero-header">
                    <div className="catalog-header-left">
                      <Palette size={20} className="catalog-icon" />
                      <div>
                        <h3 className="catalog-title">{isEn ? '15 Architectural Colors Catalog' : '15 Mimari Renk Kataloğu'}</h3>
                        <span className="catalog-subtitle">{isEn ? 'Click image to inspect full screen' : 'Büyütmek için görsele tıklayın'}</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="catalog-zoom-action-btn"
                      onClick={() => openZoom(colorChartImage)}
                      title={isEn ? 'Enlarge Catalog' : 'Kataloğu Büyüt'}
                    >
                      <Maximize2 size={15} />
                      <span>{isEn ? 'Full Screen' : 'Tam Ekran'}</span>
                    </button>
                  </div>

                  <div className="catalog-hero-img-wrap" onClick={() => openZoom(colorChartImage)}>
                    <img 
                      src={colorChartImage} 
                      alt={`${product.stokAdi} Renk Kataloğu`}
                      className="catalog-hero-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/product_placeholder.png';
                      }}
                    />
                    <div className="catalog-hero-overlay">
                      <Maximize2 size={28} />
                      <span>{isEn ? 'Click to Enlarge Color Catalog' : 'Renk Kataloğunu Tam Ekran Büyüt'}</span>
                    </div>
                    <div className="catalog-hero-badge">{product.stokKodu} 15 RENK KATALOĞU</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. ALT BÖLÜM: Ürün Açıklaması ve Teknik Özellikler */}
            <div className="product-color-details-bottom-grid">
              {product.aciklama && (
                <div className="product-overview-card bottom-overview-card">
                  <h3 className="section-subtitle-heading">{isEn ? 'Product Description & Performance' : 'Ürün Açıklaması ve Performans Bilgileri'}</h3>
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

              <div className="tech-specs-card bottom-specs-card">
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
        ) : (
          /* ========================================================================= */
          /* STANDART ÜRÜNLER İÇİN ORİJİNAL DÜZEN (Renk == 0)                          */
          /* ========================================================================= */
          <div className="product-layout-grid">
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

                <button 
                  className="zoom-trigger-btn"
                  onClick={() => openZoom(currentImg)}
                >
                  <Maximize2 size={16} />
                  <span>{isEn ? 'Fullscreen Zoom' : 'Tam Ekran Gör'}</span>
                </button>
              </div>

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
        )}

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
        .breadcrumb-nav-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .btn-detail-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-detail-back:hover {
          background: var(--accent-clay);
          border-color: var(--accent-clay);
          transform: translateX(-3px);
        }

        /* Color Product Custom Layout Styles */
        .color-product-top-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 32px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-light);
          flex-wrap: wrap;
        }
        .color-top-header-info {
          flex: 1;
          min-width: 300px;
        }
        .top-cta-duo {
          margin-bottom: 0;
          min-width: 420px;
          align-self: center;
        }
        .product-duo-visual-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 40px;
          align-items: start;
        }
        .color-catalog-column {
          display: flex;
          flex-direction: column;
        }
        .color-catalog-column .product-color-catalog-hero-card {
          margin-bottom: 0;
          height: 100%;
        }
        @media (max-width: 992px) {
          .color-product-top-header {
            flex-direction: column;
            gap: 20px;
          }
          .top-cta-duo {
            width: 100%;
            min-width: unset;
          }
          .product-duo-visual-grid {
            grid-template-columns: 1fr;
          }
        }

        .product-detail-page {
          background-color: var(--bg-primary);
          min-height: 80vh;
          padding-bottom: 100px;
        }
        .main-cta-duo-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
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
        .category-pills-row {
          display: flex;
          gap: 8px;
        }
        .meta-pill {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #FFFFFF;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .clickable-pill {
          cursor: pointer;
          transition: all 0.2s;
        }
        .clickable-pill:hover {
          background: var(--accent-clay);
          border-color: var(--accent-clay);
        }
        .page-content {
          padding-top: 40px;
        }
        .product-layout-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
          align-items: start;
        }
        .main-viewer-box {
          position: relative;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 24px;
          height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .main-display-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.9);
          border: 1px solid var(--border-light);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .prev-arrow { left: 16px; }
        .next-arrow { right: 16px; }
        .nav-arrow:hover { background: #FFFFFF; color: var(--accent-clay); }
        .zoom-trigger-btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background: rgba(255,255,255,0.95);
          border: 1px solid var(--border-light);
          padding: 8px 14px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .zoom-trigger-btn:hover { background: #FFFFFF; color: var(--accent-clay); }
        .thumbnail-strip {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          overflow-x: auto;
          padding-bottom: 6px;
        }
        .thumb-btn {
          width: 76px;
          height: 76px;
          background: #FFFFFF;
          border: 2px solid var(--border-light);
          border-radius: 6px;
          padding: 4px;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .thumb-btn.active { border-color: var(--accent-clay); }
        .thumb-img { width: 100%; height: 100%; object-fit: contain; }
        .architectural-trust-box {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 16px;
          margin-top: 20px;
        }
        .trust-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .trust-icon { color: var(--accent-clay); flex-shrink: 0; margin-top: 2px; }
        .trust-item strong { display: block; font-size: 0.82rem; margin-bottom: 2px; }
        .trust-item p { font-size: 0.72rem; color: var(--text-muted); margin: 0; line-height: 1.3; }

        .sub-title-tag {
          font-size: 0.85rem;
          color: var(--accent-clay);
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 8px;
        }
        .product-name-heading {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.2;
          margin: 0 0 16px 0;
        }
        .spec-code-card {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F4F4F4;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.85rem;
          margin-bottom: 20px;
        }
        .product-overview-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .section-subtitle-heading {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0 0 16px 0;
        }
        .overview-bullet-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .overview-bullet-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .bullet-check-icon {
          color: var(--accent-clay);
          flex-shrink: 0;
          margin-top: 3px;
        }
        .bullet-text-box {
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--text-main);
        }
        .bullet-label {
          color: #1A1A1A;
          font-weight: 700;
        }
        .bullet-val {
          color: var(--text-muted);
        }
        .tech-specs-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .tech-specs-table {
          width: 100%;
          border-collapse: collapse;
        }
        .tech-specs-table td {
          padding: 10px 12px;
          border-bottom: 1px solid var(--border-light);
          font-size: 0.88rem;
        }
        .tech-specs-table tr:last-child td {
          border-bottom: none;
        }
        .tech-specs-table td:first-child {
          color: var(--text-muted);
          width: 38%;
        }

        /* Right Column Catalog Hero Card (Ürün Görselinin Sağındaki Konum) */
        .product-color-catalog-hero-card {
          background: #FFFFFF;
          border: 1.5px solid var(--accent-clay);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 24px;
          box-shadow: 0 4px 16px rgba(184, 91, 53, 0.08);
        }
        .catalog-hero-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #FAFAFA;
          border-bottom: 1px solid var(--border-light);
          gap: 10px;
        }
        .catalog-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .catalog-icon {
          color: var(--accent-clay);
          flex-shrink: 0;
        }
        .catalog-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
        }
        .catalog-subtitle {
          font-size: 0.74rem;
          color: var(--text-muted);
          display: block;
        }
        .catalog-zoom-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.2s;
        }
        .catalog-zoom-action-btn:hover {
          border-color: var(--accent-clay);
          color: var(--accent-clay);
        }
        .catalog-hero-img-wrap {
          position: relative;
          cursor: pointer;
          background: #F8FAFC;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .catalog-hero-img {
          width: 100%;
          height: auto;
          border-radius: 6px;
          transition: transform 0.35s ease;
          display: block;
        }
        .catalog-hero-img-wrap:hover .catalog-hero-img {
          transform: scale(1.02);
        }
        .catalog-hero-overlay {
          position: absolute;
          inset: 10px;
          background: rgba(22, 20, 19, 0.5);
          backdrop-filter: blur(2px);
          opacity: 0;
          transition: opacity 0.25s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #FFFFFF;
          font-weight: 600;
          font-size: 0.88rem;
          border-radius: 6px;
        }
        .catalog-hero-img-wrap:hover .catalog-hero-overlay {
          opacity: 1;
        }
        .catalog-hero-badge {
          position: absolute;
          top: 18px;
          left: 18px;
          background: rgba(22, 20, 19, 0.85);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
          backdrop-filter: blur(4px);
        }

        /* Bottom Grid for Description & Specs when hasColorOptions */
        .product-color-details-bottom-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 28px;
          margin: 40px 0;
        }
        .bottom-overview-card, .bottom-specs-card {
          margin-bottom: 0;
          height: 100%;
        }

        .product-projects-prominent-section {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 36px;
          margin: 48px 0;
        }
        .section-header {
          display: flex;
          gap: 16px;
          margin-bottom: 28px;
        }
        .proj-header-icon {
          color: var(--accent-clay);
          flex-shrink: 0;
          margin-top: 4px;
        }
        .section-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0 0 6px 0;
        }
        .section-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin: 0;
        }
        .project-images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .project-img-card {
          position: relative;
          height: 220px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
        }
        .project-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }
        .project-img-card:hover .project-img {
          transform: scale(1.06);
        }
        .project-img-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          opacity: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #FFFFFF;
          font-weight: 600;
          transition: opacity 0.3s;
        }
        .project-img-card:hover .project-img-overlay {
          opacity: 1;
        }
        .project-badge-tag {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(0,0,0,0.75);
          color: #FFF;
          font-size: 0.72rem;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .projects-placeholder-card {
          background: #FAFAFA;
          border: 1px dashed var(--border-light);
          border-radius: 8px;
          padding: 32px;
          text-align: center;
          color: var(--text-muted);
        }
        .full-width-spec-card-section {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: 12px;
          margin: 48px 0;
          overflow: hidden;
        }
        .spec-card-header-banner {
          background: var(--bg-dark);
          color: #FFFFFF;
          padding: 24px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .spec-banner-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .banner-icon { color: var(--accent-clay); }
        .spec-banner-title { margin: 0; font-size: 1.1rem; }
        .spec-banner-sub { font-size: 0.8rem; color: var(--text-light-muted); }
        .spec-badge-label {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: var(--accent-clay);
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .spec-card-body-content {
          padding: 28px 32px;
          background: #FAFAFA;
        }
        .spec-formatted-pre {
          white-space: pre-wrap;
          font-family: inherit;
          font-size: 0.92rem;
          color: var(--text-main);
          line-height: 1.7;
          margin: 0;
          background: #FFFFFF;
          padding: 24px;
          border: 1px solid var(--border-light);
          border-radius: 6px;
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
        .section-tag {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--accent-clay);
          display: block;
          margin-bottom: 6px;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        @media (max-width: 992px) {
          .product-layout-grid { grid-template-columns: 1fr; }
          .product-color-details-bottom-grid { grid-template-columns: 1fr; }
          .product-name-heading { font-size: 1.85rem; }
          .main-viewer-box { height: 340px; }
          .architectural-trust-box { grid-template-columns: 1fr; }
        }

      `}</style>
    </div>
  );
}
