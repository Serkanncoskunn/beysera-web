import React, { useState, useEffect } from 'react';
import { Phone, Globe, Download, Menu, X, ChevronRight, MapPin, FileText, ChevronDown } from 'lucide-react';
import { CATEGORIES_TR, CATEGORIES_EN } from '../data/products';
import { TRANSLATIONS } from '../data/translations';

export default function Header({ lang, setLang, activeTab, setActiveTab, onOpenQuoteModal, onSelectCategory }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[lang ? lang : 'TR'].nav;
  const isEn = lang === 'EN';
  const categoriesList = isEn ? CATEGORIES_EN.slice(1) : CATEGORIES_TR.slice(1); // 14 categories
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=TU%C4%9ELA+D%C3%9CNYASI+SHOWROOM+Ek%C5%9Fio%C4%9Flu+86.+Sk.+No%3A2+34794+%C3%87ekmek%C3%B6y%2F%C4%B0stanbul';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="header-wrapper">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-left">
            <a 
              href={mapsUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="top-info top-link" 
              title={isEn ? "Open in Google Maps" : "Google Maps'te Aç"}
            >
              <MapPin size={13} /> 
              <span>{isEn ? 'Cumhuriyet, Sile Otoyolu Yanyolu No:14/B Cekmekoy/Istanbul' : 'Cumhuriyet, Şile Otoyolu Yanyolu No:14/B Çekmeköy/İstanbul'}</span>
            </a>
            <span className="top-divider">|</span>
            <a href="tel:+902166690751" className="top-link">
              <Phone size={13} /> 0 216 669 07 51
            </a>
          </div>

          <div className="top-right">
            <a 
              href="/assets/catalog/katalog.pdf" 
              target="_blank" 
              rel="noreferrer" 
              className="top-catalog-btn"
            >
              <Download size={13} /> {t.catalogDownload}
            </a>

            <button onClick={onOpenQuoteModal} className="top-quote-btn">
              <FileText size={13} /> {t.quoteBtn}
            </button>
            
            {/* Language Switcher */}
            <div className="lang-switcher">
              <Globe size={13} />
              <button 
                className={`lang-btn ${lang === 'TR' ? 'active' : ''}`}
                onClick={() => setLang('TR')}
              >
                TR
              </button>
              <span>/</span>
              <button 
                className={`lang-btn ${lang === 'EN' ? 'active' : ''}`}
                onClick={() => setLang('EN')}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`main-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className="brand-logo">
            <span className="brand-name">TUĞLA DÜNYASI</span>
            <span className="brand-sub">ARCHITECTURAL BRICKS</span>
          </a>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <a
              href="#home"
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
            >
              {t.home}
            </a>

            {/* Ürünlerimiz Dropdown on Hover (Vertical List from Top to Bottom) */}
            <div className="nav-item-dropdown-wrap">
              <a
                href="#urunler"
                className={`nav-link ${activeTab === 'urunler' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectCategory) onSelectCategory('Tümü');
                  handleNavClick('urunler');
                }}
              >
                <span>{t.products}</span>
                <ChevronDown size={14} className="nav-chevron-icon" />
              </a>

              {/* Hover Dropdown Panel - 14 Categories Listed Top to Bottom */}
              <div className="nav-dropdown-menu">
                <a
                  href="#urunler"
                  className="nav-dropdown-item all-item"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onSelectCategory) onSelectCategory('Tümü');
                    handleNavClick('urunler');
                  }}
                >
                  <strong>{isEn ? 'All Products' : 'Tüm Ürünlerimiz'}</strong>
                </a>
                {categoriesList.map((cat) => (
                  <a
                    key={cat}
                    href="#urunler"
                    className="nav-dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onSelectCategory) onSelectCategory(cat);
                      handleNavClick('urunler');
                    }}
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="#projeler"
              className={`nav-link ${activeTab === 'projeler' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('projeler'); }}
            >
              {t.projects}
            </a>

            <a
              href="#kurumsal"
              className={`nav-link ${activeTab === 'kurumsal' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('kurumsal'); }}
            >
              {t.corporate}
            </a>

            <a
              href="#iletisim"
              className={`nav-link ${activeTab === 'iletisim' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('iletisim'); }}
            >
              {t.contact}
            </a>
          </nav>

          {/* Mobile Menu Trigger */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <a
            href="#home"
            className={`mobile-nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
          >
            <span>{t.home}</span>
            <ChevronRight size={16} />
          </a>
          <a
            href="#urunler"
            className={`mobile-nav-link ${activeTab === 'urunler' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('urunler'); }}
          >
            <span>{t.products}</span>
            <ChevronRight size={16} />
          </a>
          <a
            href="#projeler"
            className={`mobile-nav-link ${activeTab === 'projeler' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('projeler'); }}
          >
            <span>{t.projects}</span>
            <ChevronRight size={16} />
          </a>
          <a
            href="#kurumsal"
            className={`mobile-nav-link ${activeTab === 'kurumsal' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('kurumsal'); }}
          >
            <span>{t.corporate}</span>
            <ChevronRight size={16} />
          </a>
          <a
            href="#iletisim"
            className={`mobile-nav-link ${activeTab === 'iletisim' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('iletisim'); }}
          >
            <span>{t.contact}</span>
            <ChevronRight size={16} />
          </a>

          <div className="mobile-drawer-actions">
            <a 
              href="/assets/catalog/katalog.pdf" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-outline" 
              style={{ justifyContent: 'center' }}
            >
              <Download size={14} /> {t.catalogDownload}
            </a>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenQuoteModal(); }} 
              className="btn-primary" 
              style={{ justifyContent: 'center' }}
            >
              <FileText size={14} /> {t.quoteBtn}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .header-wrapper {
          position: sticky;
          top: 0;
          z-index: 900;
          background-color: var(--bg-primary);
        }
        .top-bar {
          background-color: var(--bg-dark);
          color: var(--text-light-muted);
          font-size: 0.8rem;
          padding: 8px 0;
          border-bottom: 1px solid var(--border-dark);
        }
        .top-bar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .top-left, .top-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .top-info {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .top-divider {
          color: #444;
        }
        .top-link {
          color: var(--text-light-muted);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }
        .top-link:hover {
          color: #FFFFFF;
        }
        .top-catalog-btn, .top-quote-btn {
          background: none;
          border: none;
          color: var(--accent-clay);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: color 0.2s;
        }
        .top-quote-btn {
          color: #FFFFFF;
        }
        .top-catalog-btn:hover, .top-quote-btn:hover {
          color: var(--accent-clay);
        }
        .lang-switcher {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: var(--bg-dark-surface);
          padding: 2px 8px;
          border: 1px solid var(--border-dark);
        }
        .lang-btn {
          background: none;
          border: none;
          color: var(--text-light-muted);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          padding: 2px 4px;
        }
        .lang-btn.active {
          color: var(--accent-terracotta);
        }
        .main-navbar {
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border-light);
          transition: var(--transition-smooth);
        }
        .main-navbar.scrolled {
          background-color: rgba(250, 248, 245, 0.96);
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .navbar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 76px;
        }
        .brand-logo {
          text-decoration: none;
          display: flex;
          flex-direction: column;
        }
        .brand-name {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-main);
          line-height: 1;
        }
        .brand-sub {
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          color: var(--accent-terracotta);
          font-weight: 600;
          margin-top: 2px;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .nav-link {
          text-decoration: none;
          color: var(--text-main);
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          padding: 26px 0;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          position: relative;
          transition: color 0.2s;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--accent-terracotta);
        }
        .nav-chevron-icon {
          transition: transform 0.2s;
        }
        .nav-item-dropdown-wrap:hover .nav-chevron-icon {
          transform: rotate(180deg);
        }
        /* Top-to-Bottom Vertical Hover Dropdown Menu */
        .nav-item-dropdown-wrap {
          position: relative;
        }
        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 260px;
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          box-shadow: 0 16px 36px rgba(0,0,0,0.12);
          display: none;
          flex-direction: column;
          z-index: 1000;
          max-height: 480px;
          overflow-y: auto;
        }
        .nav-item-dropdown-wrap:hover .nav-dropdown-menu {
          display: flex;
        }
        .nav-dropdown-item {
          padding: 10px 18px;
          border-bottom: 1px solid var(--border-light);
          color: var(--text-main);
          font-size: 0.88rem;
          text-decoration: none;
          transition: background-color 0.15s, padding-left 0.15s, color 0.15s;
          display: block;
        }
        .nav-dropdown-item:last-child {
          border-bottom: none;
        }
        .nav-dropdown-item:hover {
          background-color: rgba(140, 45, 25, 0.06);
          color: var(--accent-terracotta);
          padding-left: 24px;
        }
        .nav-dropdown-item.all-item {
          background-color: var(--bg-primary);
          border-bottom: 2px solid var(--border-light);
        }
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-main);
        }
        .mobile-drawer {
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border-light);
          padding: 16px 24px;
          display: flex;
          flex-direction: column;
        }
        .mobile-nav-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid var(--border-light);
          color: var(--text-main);
          text-decoration: none;
          font-weight: 500;
        }
        .mobile-drawer-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }
        @media (max-width: 992px) {
          .desktop-nav { display: none; }
          .mobile-toggle { display: block; }
          .top-info { display: none; }
        }
      `}</style>
    </header>
  );
}
