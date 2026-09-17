import React from "react";
import { X, MessageSquare, CheckCircle2, Phone } from "lucide-react";
import { TRANSLATIONS } from "../data/translations";
import { REGIONS_LIST } from "./RegionSelectModal";

export default function QuoteModal({ isOpen, onClose, lang, product, activeTab = "home" }) {
  if (!isOpen) return null;

  const isEn = lang === "EN";

  const handleSelectRegion = (region) => {
    let textMessage = "";
    
    if (product) {
      const stockName = product.stokAdi || product.name || "";
      const stockCode = product.stokKodu || product.code || "";
      textMessage = isEn
        ? `Hello, I would like to request a price quote and sample for "${stockName}" (Stock Code: ${stockCode}) for the ${region.titleEn} region via WhatsApp.`
        : `Merhaba, "${stockName}" (Stok Kodu: ${stockCode}) ürünü için ${region.title} bölgenizden WhatsApp üzerinden fiyat teklifi ve numune talep ediyorum.`;
    } else if (activeTab === "urunler") {
      textMessage = isEn
        ? `Hello, I reviewed your Product Catalog. I would like to get pricing and sample delivery details for our project from ${region.titleEn}.`
        : `Merhaba, Ürün Kataloğunuzu inceledim. ${region.title} bölgenizden mimari projemiz için tuğla fiyat listesi ve numune tedariği hakkında bilgi almak istiyorum.`;
    } else if (activeTab === "projeler") {
      textMessage = isEn
        ? `Hello, I reviewed your architectural reference projects. I would like to discuss brick solutions and request a quote for our project from ${region.titleEn}.`
        : `Merhaba, Projeler sayfanızdaki uygulamaları inceledim. ${region.title} bölgenizden projemize özel tuğla kaplama çözümleri ve teklif almak istiyorum.`;
    } else if (activeTab === "kurumsal") {
      textMessage = isEn
        ? `Hello, I would like to inquire about corporate partnership and product supply from ${region.titleEn}.`
        : `Merhaba, Kurumsal sayfanız üzerinden ${region.title} temsilciliğinizle firmamız için mimari çözüm ortaklığı ve tedarik hakkında görüşmek istiyorum.`;
    } else if (activeTab === "iletisim") {
      textMessage = isEn
        ? `Hello, I would like to discuss project specifications and request a quote from your ${region.titleEn} regional manager.`
        : `Merhaba, İletişim sayfanız üzerinden ${region.title} bölge sorumlumuz ile projemize özel fiyat teklifi ve numune detaylarını görüşmek istiyorum.`;
    } else {
      textMessage = isEn
        ? `Hello, I would like to get information regarding brick products, price quotes and samples from ${region.titleEn}.`
        : `Merhaba, Tuğla Dünyası web siteniz üzerinden ${region.title} bölgeniz için mimari tuğla ürünleri, fiyat teklifi ve numune hakkında bilgi almak istiyorum.`;
    }

    const encodedText = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/${region.phoneClean}?text=${encodedText}`;

    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <div className="quote-modal-overlay" onClick={onClose}>
      <div className="quote-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="quote-close-btn" onClick={onClose} aria-label={isEn ? "Close" : "Kapat"}>
          <X size={18} />
        </button>

        <div className="quote-modal-header">
          <span className="quote-tag">
            {isEn ? "WHATSAPP REGION SELECTION" : "WHATSAPP BÖLGE TEMSİLCİSİ SEÇİNİZ"}
          </span>
          <h2 className="quote-title">
            {isEn ? "Select Region to Connect via WhatsApp" : "Hangi Bölge Temsilcimizle Görüşmek İstersiniz?"}
          </h2>
          <p className="quote-subtitle">
            {isEn 
              ? "Select your region to start a direct WhatsApp conversation with our regional manager:" 
              : "Yetkili bölge müdürümüzle doğrudan WhatsApp görüşmesi başlatmak için bölgenizi seçiniz:"}
          </p>

          {product && (
            <div className="prefilled-product-badge">
              <CheckCircle2 size={14} className="badge-check" />
              <span>
                {isEn ? "Selected Product:" : "Seçilen Ürün:"} <strong>{product.stokAdi || product.name}</strong> ({product.stokKodu || product.code})
              </span>
            </div>
          )}
        </div>

        <div className="quote-regions-grid">
          {REGIONS_LIST.map((reg) => (
            <div
              key={reg.id}
              className="quote-region-card"
              onClick={() => handleSelectRegion(reg)}
            >
              <div className="quote-region-left">
                <h4 className="qreg-name">{isEn ? reg.titleEn : reg.title}</h4>
                <div className="qreg-sub-info">
                  <span className="qreg-person">{reg.person}</span>
                  <span className="qreg-dot">•</span>
                  <span className="qreg-phone"><Phone size={11} /> {reg.phone}</span>
                </div>
              </div>

              <div className="quote-region-actions">
                <button
                  type="button"
                  className="btn-wa-direct"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRegion(reg);
                  }}
                  title="WhatsApp"
                >
                  <MessageSquare size={13} />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .quote-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(22, 20, 19, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 16px;
        }
        .quote-modal-card {
          background-color: var(--bg-surface);
          border-radius: 8px;
          max-width: 620px;
          width: 100%;
          padding: 22px 24px;
          position: relative;
          box-shadow: 0 20px 45px rgba(0,0,0,0.25);
          border: 1px solid var(--border-light);
          max-height: 96vh;
          box-sizing: border-box;
        }
        .quote-close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          color: var(--text-main);
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: var(--transition-smooth);
        }
        .quote-close-btn:hover {
          background: #25D366;
          color: #FFFFFF;
          border-color: #25D366;
        }
        .quote-modal-header {
          margin-bottom: 14px;
          text-align: left;
          padding-right: 36px;
        }
        .quote-tag {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-terracotta);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 3px;
        }
        .quote-title {
          font-size: 1.15rem;
          color: var(--text-main);
          font-weight: 700;
          margin-bottom: 3px;
          line-height: 1.25;
        }
        .quote-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.3;
        }
        .prefilled-product-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(140, 45, 25, 0.08);
          border: 1px solid rgba(140, 45, 25, 0.2);
          color: var(--accent-terracotta);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.78rem;
          margin-top: 8px;
        }
        .badge-check { color: var(--accent-terracotta); }
        .quote-regions-grid {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .quote-region-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .quote-region-card:hover {
          border-color: #25D366;
          background-color: #FFFFFF;
          transform: translateX(3px);
          box-shadow: 0 3px 10px rgba(37, 211, 102, 0.18);
        }
        .quote-region-left {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .qreg-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.25;
        }
        .qreg-sub-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          flex-wrap: wrap;
        }
        .qreg-person {
          color: var(--text-muted);
        }
        .qreg-dot {
          color: var(--border-medium, #999);
          font-size: 0.7rem;
        }
        .qreg-phone {
          font-size: 0.76rem;
          color: var(--accent-terracotta);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .btn-wa-direct {
          display: flex;
          align-items: center;
          gap: 5px;
          background-color: #25D366;
          color: #FFFFFF;
          border: none;
          padding: 5px 11px;
          border-radius: 4px;
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.2s;
          box-shadow: 0 2px 6px rgba(37, 211, 102, 0.25);
          flex-shrink: 0;
        }
        .btn-wa-direct:hover {
          background-color: #128C7E;
        }
        @media (max-width: 540px) {
          .quote-modal-card {
            padding: 16px 14px;
          }
          .quote-region-card {
            padding: 8px 10px;
          }
          .qreg-name {
            font-size: 0.82rem;
          }
          .qreg-sub-info {
            font-size: 0.72rem;
          }
        }
      `}</style>
    </div>
  );
}
