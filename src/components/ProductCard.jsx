import React, { useState, useEffect } from "react";
import { Maximize2 } from "lucide-react";
import { TRANSLATIONS } from "../data/translations";

export default function ProductCard({ product, lang, onSelectProduct, onOpenQuoteModal, isSquare = false }) {
  if (!product) return null;
  const t = TRANSLATIONS[lang ? lang : "TR"].products;
  const isEn = lang === "EN";

  const title = product.stokAdi || product.name || "Tuğla Dünyası Ürünü";
  const stockCode = product.stokKodu || product.code || "";
  const mainCat = product.anaKategori || product.category || "";
  const subCat = product.altKategori || product.categoryEn || "";
  
  const targetImage = product.gorsel || product.mainImage || product.image || "/images/product_placeholder.png";
  const [imgSrc, setImgSrc] = useState(targetImage);

  useEffect(() => {
    setImgSrc(product.gorsel || product.mainImage || product.image || "/images/product_placeholder.png");
  }, [product.stokKodu, product.gorsel, product.mainImage, product.image]);

  const handleImageError = () => {
    if (imgSrc !== "/images/product_placeholder.png") {
      setImgSrc("/images/product_placeholder.png");
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <div className={`product-card ${isSquare ? "square-card" : ""}`} onClick={handleClick}>
      <div className="card-img-wrap">
        <img 
          src={imgSrc} 
          alt={title} 
          className="card-img" 
          loading="lazy"
          onError={handleImageError}
        />
        <div className="card-badge">{stockCode}</div>
        <div className="card-stamps-group">
          {product.isOwnProduction && (
            <img 
              src="/assets/kendi_uretimimiz_stamp.png" 
              alt="Kendi Üretimimiz" 
              className="own-production-stamp-img"
              title={isEn ? "Our Own Production - Yerli Üretim" : "Kendi Üretimimiz - Yerli Üretim"}
            />
          )}
          {product.hasTse && (
            <img 
              src="/assets/tse_stamp.png" 
              alt="TSE Belgeli" 
              className="tse-stamp-img"
              title={isEn ? "TSE Certified - Turkish Standards" : "TSE Belgeli - Türk Standartları Uygunluk"}
            />
          )}
        </div>
        <button className="card-zoom-btn" title={isEn ? "View Product Details" : "Ürün Detaylarını İncele"}>
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="card-content">
        <div className="card-meta">
          <span className="card-category">{mainCat}</span>
          {subCat && <span className="card-subcategory">• {subCat}</span>}
        </div>

        <h3 className="card-title">{title}</h3>


      </div>

      <style>{`
        .product-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
          border-color: var(--accent-clay);
        }

        .card-img-wrap {
          position: relative;
          width: 100%;
          padding-top: 68%;
          background-color: #FFFFFF;
          overflow: hidden;
        }

        .card-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 10px;
          transition: transform 0.4s ease;
        }
        .product-card:hover .card-img {
          transform: scale(1.06);
        }

        .card-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background-color: rgba(22, 20, 19, 0.85);
          color: #FFFFFF;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          backdrop-filter: blur(4px);
          z-index: 2;
        }

        .card-stamps-group {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: flex-end;
          z-index: 3;
          pointer-events: none;
        }

        .own-production-stamp-img, .tse-stamp-img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .card-zoom-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.9);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.3s ease;
          z-index: 2;
        }
        .product-card:hover .card-zoom-btn {
          opacity: 1;
          transform: scale(1);
        }

        .card-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--accent-clay);
          font-weight: 600;
          margin-bottom: 6px;
        }
        .card-subcategory {
          color: var(--text-muted);
          font-weight: 400;
        }

        .card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.4;
          margin-bottom: 14px;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        
        

        .card-footer-action {
          padding-top: 12px;
          border-top: 1px solid var(--border-light);
        }

        .btn-card-inspect {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
          transition: color 0.2s;
        }
        .btn-arrow {
          transition: transform 0.2s;
        }
        .product-card:hover .btn-card-inspect {
          color: var(--accent-clay);
        }
        .product-card:hover .btn-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
