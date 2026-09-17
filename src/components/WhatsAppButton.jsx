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
      aria-label="WhatsApp İletişim"
      title={isEn ? "Contact via WhatsApp (+90 549 352 72 00)" : "WhatsApp İle Bizimle İletişime Geçin"}
    >
      <div className="wa-icon-box">
        <MessageCircle size={24} />
      </div>
      <span className="wa-btn-text">{t.btnText}</span>

      <style>{`
        .whatsapp-floating-btn {
          position: fixed;
          bottom: clamp(20px, 3.5vw, 32px);
          right: clamp(16px, 3.5vw, 32px);
          z-index: 9999;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: #FFFFFF;
          padding: 10px 20px 10px 10px;
          border-radius: 50px;
          text-decoration: none;
          box-shadow: 0 10px 28px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0,0,0,0.18);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(8px);
        }
        .whatsapp-floating-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 14px 34px rgba(37, 211, 102, 0.6), 0 4px 10px rgba(0,0,0,0.22);
          background: linear-gradient(135deg, #20ba5a 0%, #0e7266 100%);
        }
        .wa-icon-box {
          width: 40px;
          height: 40px;
          background-color: rgba(255,255,255,0.22);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: inset 0 0 4px rgba(255,255,255,0.3);
        }
        .wa-btn-text {
          font-size: clamp(0.92rem, 1.1vw, 1.02rem);
          font-weight: 700;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .whatsapp-floating-btn {
            bottom: calc(18px + env(safe-area-inset-bottom, 0px));
            right: 16px;
            padding: 8px 16px 8px 8px;
            gap: 8px;
          }
          .wa-icon-box {
            width: 36px;
            height: 36px;
          }
          .wa-btn-text {
            font-size: 0.88rem;
          }
        }
      `}</style>
    </a>
  );
}
