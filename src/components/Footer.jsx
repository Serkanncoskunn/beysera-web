import React from 'react';
import { Phone, Mail, MapPin, Download, ArrowUp } from 'lucide-react';
import { COMPANY_CONTACT } from '../data/contact_locations';
import { TRANSLATIONS } from '../data/translations';
import { MAIN_CATEGORIES_DATA } from '../data/products';

export default function Footer({ lang, onNavigate, setActiveTab, onOpenFeedbackModal, onSelectCategory }) {
  const t = TRANSLATIONS[lang ? lang : 'TR'].footer;
  const isEn = lang === 'EN';
  const categories = MAIN_CATEGORIES_DATA;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (id) => {
    if (onNavigate) {
      onNavigate(id);
    } else if (setActiveTab) {
      setActiveTab(id);
    }
    scrollToTop();
  };

  const handleCategoryClick = (catName) => {
    if (onSelectCategory) {
      onSelectCategory(catName);
    } else if (onNavigate) {
      onNavigate('urunler');
    } else if (setActiveTab) {
      setActiveTab('urunler');
    }
    scrollToTop();
  };

  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Info Column */}
          <div className="footer-brand-col">
            <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className="footer-logo">
              <span className="footer-brand-name"><strong className="brand-part-tugla">TUĞLA</strong> <strong className="brand-part-dunyasi">DÜNYASI</strong></span>
              <span className="footer-brand-sub">ARCHITECTURAL BRICKS</span>
            </a>
            <p className="footer-brand-desc">{t.desc}</p>
            <div className="footer-actions">
              <a href="/assets/catalog/katalog.pdf" target="_blank" rel="noreferrer" className="btn-outline-light btn-sm">
                <Download size={14} /> {isEn ? 'PDF Catalog' : 'PDF Katalog'}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">{t.quickLinks}</h4>
            <ul className="footer-nav-list">
              <li><a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>{isEn ? 'Home' : 'Ana Sayfa'}</a></li>
              <li><a href="/urunler" onClick={(e) => { e.preventDefault(); handleNavClick('urunler'); }}>{isEn ? 'Products' : 'Ürünlerimiz'}</a></li>
              <li><a href="/projeler" onClick={(e) => { e.preventDefault(); handleNavClick('projeler'); }}>{isEn ? 'Projects' : 'Projelerimiz'}</a></li>
              <li><a href="/kurumsal" onClick={(e) => { e.preventDefault(); handleNavClick('kurumsal'); }}>{isEn ? 'About Us' : 'Kurumsal'}</a></li>
              <li><a href="/iletisim" onClick={(e) => { e.preventDefault(); handleNavClick('iletisim'); }}>{isEn ? 'Contact' : 'İletişim'}</a></li>
              <li>
                <button
                  onClick={onOpenFeedbackModal}
                  className="footer-feedback-link"
                >
                  ✉️ {isEn ? 'Suggestions & Complaints' : 'Şikayet & Öneri Bildir'}
                </button>
              </li>
            </ul>
          </div>

          {/* Ana Kategoriler (Excel Başlıkları) */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">{isEn ? "Main Categories" : "Ana Kategoriler"}</h4>
            <ul className="footer-nav-list">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a 
                    href="/urunler" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      handleCategoryClick(cat.id); 
                    }}
                  >
                    {isEn ? cat.nameEn : cat.nameTr}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="footer-contact-col">
            <h4 className="footer-col-title">{t.hq}</h4>
            <div className="footer-contact-list">
              <a 
                href={COMPANY_CONTACT.mainHq.mapsDirectUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-contact-item footer-address-link"
                title={isEn ? "Open HQ Location in Google Maps" : "Genel Merkez Konumunu Google Haritalar'da Aç"}
              >
                <MapPin size={16} className="fc-icon" />
                <span>{isEn ? COMPANY_CONTACT.mainHq.addressEn : COMPANY_CONTACT.mainHq.address}</span>
              </a>
              <div className="footer-contact-item">
                <Phone size={16} className="fc-icon" />
                <span>{isEn ? 'Landline:' : 'Sabit:'} <a href="tel:+902166690751">0 216 669 07 51</a></span>
              </div>
              <div className="footer-contact-item">
                <Phone size={16} className="fc-icon" />
                <span>{isEn ? 'Sales:' : 'Satış:'} <a href="tel:+905493527200">0549 352 72 00</a></span>
              </div>
              <div className="footer-contact-item">
                <Mail size={16} className="fc-icon" />
                <a href="mailto:info@tugladunyasi.com.tr">info@tugladunyasi.com.tr</a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Tuğla Dünyası. {t.copyright}</p>

          <button onClick={scrollToTop} className="scroll-top-btn">
            <span>{t.scrollTop}</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background-color: #12100F;
          color: #FFFFFF;
          padding-top: 70px;
          padding-bottom: 30px;
          border-top: 1px solid var(--border-dark);
        }
        .footer-top-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 40px;
          padding-bottom: 50px;
          border-bottom: 1px solid var(--border-dark);
        }
        .footer-brand-name {
          font-family: "Outfit", "Inter", sans-serif;
          font-size: 2.1rem;
          letter-spacing: 0.02em;
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          text-transform: uppercase;
        }
        .footer-brand-name .brand-part-tugla {
          color: #FFFFFF;
          font-weight: 900;
        }
        .footer-brand-name .brand-part-dunyasi {
          color: #E05A30;
          font-weight: 900;
        }
        .footer-brand-sub {
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          color: var(--accent-clay);
          font-weight: 600;
          display: block;
          margin-top: 2px;
          margin-bottom: 16px;
        }
        .footer-brand-desc {
          font-size: 0.9rem;
          color: var(--text-light-muted);
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .footer-actions {
          display: flex;
          gap: 12px;
        }
        .btn-sm {
          padding: 8px 16px;
          font-size: 0.8rem;
        }
        .footer-col-title {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #FFFFFF;
          margin-bottom: 20px;
        }
        .footer-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-nav-list a {
          color: var(--text-light-muted);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .footer-nav-list a:hover {
          color: var(--accent-clay);
        }
        .footer-feedback-link {
          background: transparent;
          border: none;
          padding: 0;
          color: var(--accent-clay);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
          text-align: left;
        }
        .footer-feedback-link:hover {
          opacity: 0.8;
          text-decoration: underline;
        }
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          font-size: 0.88rem;
        }
        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: var(--text-light-muted);
        }
        .footer-contact-item a {
          color: var(--text-light-muted);
          text-decoration: none;
        }
        .footer-contact-item a:hover {
          color: #FFFFFF;
        }
        .fc-icon {
          color: var(--accent-clay);
          flex-shrink: 0;
          margin-top: 3px;
        }
        .footer-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 30px;
          font-size: 0.82rem;
          color: var(--text-light-muted);
        }
        .scroll-top-btn {
          background: none;
          border: 1px solid var(--border-dark);
          color: var(--text-light-muted);
          padding: 6px 14px;
          font-size: 0.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition-smooth);
        }
        .scroll-top-btn:hover {
          color: #FFFFFF;
          border-color: #FFFFFF;
        }
        @media (max-width: 992px) {
          .footer-top-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .footer-top-grid { grid-template-columns: 1fr; }
          .footer-bottom-bar { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
