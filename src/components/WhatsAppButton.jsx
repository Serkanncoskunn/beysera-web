import React from 'react';
import { MessageCircle } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function WhatsAppButton({ lang, activeTab = 'home' }) {
  const isEn = lang === 'EN';
  const t = TRANSLATIONS[lang ? lang : 'TR'].whatsapp;

  let pageMessage = 'Merhaba, Tuğla Dünyası web siteniz üzerinden mimari tuğla ürünleriniz, fiyat teklifi ve numune detayları hakkında bilgi almak istiyorum.';

  if (activeTab === 'urunler') {
    pageMessage = 'Merhaba, Ürün Kataloğunuzu inceledim. Mimari projemizde kullanmak üzere tuğla ve kaplama modellerinizin güncel fiyat listesi ve numune tedariği hakkında bilgi rica ediyorum.';
  } else if (activeTab === 'projeler') {
    pageMessage = 'Merhaba, Projeler sayfanızdaki tamamlanan mimari restorasyon ve cephe uygulamalarınızı inceledim. Kendi projemiz için tuğla ve kaplama çözümleriniz hakkında bilgi ve teklif almak istiyorum.';
  } else if (activeTab === 'kurumsal') {
    pageMessage = 'Merhaba, Kurumsal sayfanız üzerinden firmanız, üretim kapasiteniz ve mimari proje çözüm ortaklığınız hakkında bilgi almak istiyorum.';
  } else if (activeTab === 'iletisim') {
    pageMessage = 'Merhaba, İletişim sayfanız üzerinden doğrudan yetkili bölge satış müdürünüz ile projemiz için teklif ve numune görüşmesi başlatmak istiyorum.';
  }

  const encodedMsg = encodeURIComponent(pageMessage);
  const whatsappUrl = `https://wa.me/905493527200?text=${encodedMsg}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-floating-btn"
      aria-label="WhatsApp"
      title={isEn ? "Contact via WhatsApp" : "WhatsApp İle Bağlan"}
    >
      <div className="wa-icon-box">
        <MessageCircle size={24} />
      </div>
      <span className="wa-btn-text">{t.btnText}</span>

      <style>{`
        .whatsapp-floating-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: #25D366;
          color: #FFFFFF;
          padding: 8px 18px 8px 10px;
          border-radius: 50px;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .whatsapp-floating-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 28px rgba(37, 211, 102, 0.55);
          background-color: #128C7E;
        }
        .wa-icon-box {
          width: 38px;
          height: 38px;
          background-color: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wa-btn-text {
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .whatsapp-floating-btn {
            bottom: 20px;
            right: 16px;
            padding: 8px 14px 8px 8px;
          }
        }
      `}</style>
    </a>
  );
}
