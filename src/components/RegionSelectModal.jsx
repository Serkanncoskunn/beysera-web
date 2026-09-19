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
    id: 'avrupa-yakasi',
    title: 'Avrupa Yakası Bölgesi',
    titleEn: 'European Side Region',
    person: 'Murat Yılmaz – Bölge Satış Sorumlusu',
    phone: '0 535 273 37 12',
    phoneClean: '905352733712',
    email: 'muratyilmaz@tugladunyasi.com.tr',
    icon: '🏛'
  },
  {
    id: 'anadolu-yakasi',
    title: 'Anadolu Yakası Bölgesi',
    titleEn: 'Anatolian Side Region',
    person: 'Talha Kayra – Bölge Satış Sorumlusu',
    phone: '0 533 191 47 55',
    phoneClean: '905331914755',
    email: 'talhakayra@tugladunyasi.com.tr',
    icon: '🌲'
  },
  {
    id: 'ic-anadolu',
    title: 'İç Anadolu Bölgesi',
    titleEn: 'Central Anatolia Region',
    person: 'Hüseyin Güneş – Bölge Sorumlusu',
    phone: '0 545 807 09 79',
    phoneClean: '905458070979',
    email: 'info@tugladunyasi.com.tr',
    icon: '🏗'
  },
  {
    id: 'akdeniz',
    title: 'Akdeniz Bölgesi',
    titleEn: 'Mediterranean Region',
    person: 'Cem Kuzu – Bölge Sorumlusu',
    phone: '0 533 081 21 34',
    phoneClean: '905330812134',
    email: 'cemkuzu@tugladunyasi.com.tr',
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
          <X size={18} />
        </button>

        <div className="region-modal-header">
          <div className="region-header-icon-box">
            <MessageSquare size={20} className="header-wa-icon" />
          </div>
          <div className="region-header-text">
            <span className="region-modal-tag">{isEn ? 'WHATSAPP DIRECT CONNECT' : 'WHATSAPP ANINDA BÖLGE İLETİŞİMİ'}</span>
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
                <h4 className="reg-name">{isEn ? reg.titleEn : reg.title}</h4>
                <div className="reg-sub-info">
                  <span className="reg-person">{reg.person}</span>
                  <span className="reg-dot">•</span>
                  <span className="reg-phone"><Phone size={11} /> {reg.phone}</span>
                </div>
              </div>

              <div className="reg-card-right">
                <span className="wa-pill">
                  <MessageSquare size={13} />
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
          padding: 16px;
        }
        .region-modal-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          width: 100%;
          max-width: 620px;
          padding: 22px 24px;
          border-radius: 8px;
          position: relative;
          box-shadow: 0 20px 45px rgba(0,0,0,0.35);
          animation: regionModalIn 0.22s ease-out;
          box-sizing: border-box;
        }
        @keyframes regionModalIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .region-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          width: 32px;
          height: 32px;
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
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-light);
          padding-right: 36px;
        }
        .region-header-icon-box {
          background-color: rgba(37, 211, 102, 0.12);
          border: 1px solid rgba(37, 211, 102, 0.3);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 6px;
        }
        .header-wa-icon {
          color: #25D366;
        }
        .region-header-text {
          flex: 1;
        }
        .region-modal-tag {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #128C7E;
          display: block;
          margin-bottom: 2px;
        }
        .region-modal-title {
          font-size: 1.12rem;
          line-height: 1.25;
          color: var(--text-main);
          margin-bottom: 2px;
        }
        .region-modal-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.2;
        }
        .regions-list-grid {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .region-select-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          padding: 8px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 5px;
          width: 100%;
          box-sizing: border-box;
        }
        .region-select-card:hover {
          border-color: #25D366;
          background-color: #FFFFFF;
          transform: translateX(3px);
          box-shadow: 0 3px 10px rgba(37, 211, 102, 0.18);
        }
        .region-card-left {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .reg-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.25;
        }
        .reg-sub-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          flex-wrap: wrap;
        }
        .reg-person {
          color: var(--text-muted);
        }
        .reg-dot {
          color: var(--border-medium, #999);
          font-size: 0.7rem;
        }
        .reg-phone {
          font-weight: 600;
          color: #128C7E;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .wa-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background-color: #25D366;
          color: #FFFFFF;
          padding: 5px 11px;
          border-radius: 4px;
          font-size: 0.76rem;
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(37, 211, 102, 0.25);
          flex-shrink: 0;
        }
        @media (max-width: 540px) {
          .region-modal-card {
            padding: 16px 14px;
          }
          .region-select-card {
            padding: 8px 10px;
          }
          .reg-name {
            font-size: 0.82rem;
          }
          .reg-sub-info {
            font-size: 0.72rem;
          }
        }
      `}</style>
    </div>
  );
}
