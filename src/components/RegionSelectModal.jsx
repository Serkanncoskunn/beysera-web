import React from 'react';
import { X, Globe, Phone, MessageSquare, ChevronRight } from 'lucide-react';

export const REGIONS_LIST = [
  {
    id: 'genel-merkez',
    title: 'Genel Merkez (Showroom & Merkez Satış)',
    titleEn: 'Headquarters (Showroom & Central Sales)',
    person: 'Yavuz Kalkan – Merkez Satış',
    phone: '0549 352 72 00',
    phoneClean: '905493527200',
    icon: '🏢'
  },
  {
    id: 'ic-anadolu',
    title: 'İç Anadolu Bölgesi',
    titleEn: 'Central Anatolia Region',
    person: 'Hüseyin Güneş – Bölge Sorumlusu',
    phone: '0 545 807 09 79',
    phoneClean: '905458070979',
    icon: '🏗'
  },
  {
    id: 'akdeniz',
    title: 'Akdeniz Bölgesi',
    titleEn: 'Mediterranean Region',
    person: 'Cem Kuzu – Bölge Sorumlusu',
    phone: '0 533 081 21 34',
    phoneClean: '905330812134',
    icon: '🏖'
  }
];

export default function RegionSelectModal({ isOpen, onClose, product, lang }) {
  if (!isOpen || !product) return null;

  const isEn = lang === 'EN';
  const stockName = product.stokAdi || product.name || '';
  const stockCode = product.stokKodu || product.code || '';

  const handleSelectRegion = (region) => {
    const textMessage = isEn
      ? `Hello, I would like to get price and stock information for "${stockName}" (Stock Code: ${stockCode}) for the ${region.titleEn} region via WhatsApp.`
      : `Merhaba, "${stockName}" (Stok Kodu: ${stockCode}) ürünü hakkında ${region.title} bölgeniz için WhatsApp üzerinden fiyat teklifi ve numune bilgisi almak istiyorum.`;

    const encodedText = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/${region.phoneClean}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="region-modal-overlay" onClick={onClose}>
      <div className="region-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="region-modal-close" onClick={onClose} aria-label={isEn ? "Close" : "Kapat"}>
          <X size={20} />
        </button>

        <div className="region-modal-header">
          <div className="region-header-icon-box">
            <MessageSquare size={24} className="header-wa-icon" />
          </div>
          <div>
            <span className="region-modal-tag">{isEn ? 'WHATSAPP DIRECT REGION CONNECT' : 'WHATSAPP ANINDA BÖLGE İLETİŞİMİ'}</span>
            <h3 className="region-modal-title">{isEn ? 'Select Region to Connect via WhatsApp' : 'Hangi Bölge Temsilcimiz İle WhatsApp Görüşmesi Başlatılsın?'}</h3>
            <p className="region-modal-sub">
              {isEn 
                ? `Selected Product: ${stockName} (${stockCode})` 
                : `Seçilen Ürün: ${stockName} (${stockCode})`}
            </p>
          </div>
        </div>

        <div className="regions-list-grid">
          {REGIONS_LIST.map((reg) => (
            <button
              key={reg.id}
              onClick={() => handleSelectRegion(reg)}
              className="region-select-card"
            >
              <div className="region-card-left">
                <div>
                  <h4 className="reg-name">{isEn ? reg.titleEn : reg.title}</h4>
                  <span className="reg-person">{reg.person}</span>
                  <span className="reg-phone"><Phone size={12} /> {reg.phone}</span>
                </div>
              </div>

              <div className="reg-card-right">
                <span className="wa-pill">
                  <MessageSquare size={14} />
                  <span>WhatsApp</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .region-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 14, 13, 0.82);
          backdrop-filter: blur(6px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .region-modal-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          width: 100%;
          max-width: 620px;
          padding: 32px 36px;
          border-radius: 8px;
          position: relative;
          box-shadow: 0 24px 48px rgba(0,0,0,0.35);
          animation: regionModalIn 0.25s ease-out;
        }
        @keyframes regionModalIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .region-modal-close {
          position: absolute;
          top: 18px;
          right: 18px;
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-main);
          transition: var(--transition-smooth);
          border-radius: 4px;
        }
        .region-modal-close:hover {
          background: #25D366;
          color: #FFFFFF;
          border-color: #25D366;
        }
        .region-modal-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-light);
        }
        .region-header-icon-box {
          background-color: rgba(37, 211, 102, 0.12);
          border: 1px solid rgba(37, 211, 102, 0.3);
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 8px;
        }
        .header-wa-icon {
          color: #25D366;
        }
        .region-modal-tag {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #128C7E;
          display: block;
          margin-bottom: 4px;
        }
        .region-modal-title {
          font-size: 1.35rem;
          line-height: 1.25;
          color: var(--text-main);
          margin-bottom: 4px;
        }
        .region-modal-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .regions-list-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .region-select-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s ease;
          border-radius: 6px;
          width: 100%;
        }
        .region-select-card:hover {
          border-color: #25D366;
          background-color: #FFFFFF;
          transform: translateX(4px);
          box-shadow: 0 4px 14px rgba(37, 211, 102, 0.2);
        }
        .region-card-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .region-emoji {
          font-size: 1.6rem;
          line-height: 1;
        }
        .reg-name {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 2px;
        }
        .reg-person {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: block;
        }
        .reg-phone {
          font-size: 0.78rem;
          font-weight: 600;
          color: #128C7E;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }
        .wa-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: #25D366;
          color: #FFFFFF;
          padding: 8px 14px;
          border-radius: 4px;
          font-size: 0.82rem;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
        }
      `}</style>
    </div>
  );
}
