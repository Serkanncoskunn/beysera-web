import React, { useState } from 'react';
import { ChevronRight, MapPin, Phone, Mail, Send, Building, UserCheck, ExternalLink, Globe } from 'lucide-react';
import { COMPANY_CONTACT } from '../data/contact_locations';
import { TRANSLATIONS } from '../data/translations';

export default function ContactPage({ lang, onNavigate, onOpenFeedbackModal }) {
  const [selectedRegionKey, setSelectedRegionKey] = useState('genel-merkez');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const t = TRANSLATIONS[lang ? lang : 'TR'].contact;
  const isEn = lang === 'EN';

  // Region options configuration
  const REGIONS_MAP = {
    'genel-merkez': {
      key: 'genel-merkez',
      title: isEn ? 'HQ & CENTRAL SHOWROOM' : 'GENEL MERKEZ & SHOWROOM',
      titleDisplay: isEn ? 'Tuğla Dünyası Showroom & Headquarters' : 'Tuğla Dünyası Showroom & Genel Merkez',
      address: isEn ? COMPANY_CONTACT.mainHq.addressEn : COMPANY_CONTACT.mainHq.address,
      phone: COMPANY_CONTACT.mainHq.phone,
      phoneClean: COMPANY_CONTACT.mainHq.phoneClean,
      email: COMPANY_CONTACT.mainHq.email,
      whatsappNumber: '905322616519',
      repName: 'Yavuz Kalkan (Genel Merkez - 0532 261 65 19)',
      btnLabel: isEn ? 'Send via WhatsApp (HQ: 0532 261 65 19)' : 'Gönder (WhatsApp - Genel Merkez: 0532 261 65 19)',
      contacts: [
        { label: isEn ? 'Central Sales' : 'Merkez Satış', person: 'Yavuz Kalkan – 0549 352 72 00 / 0532 261 65 19', phone: '05322616519' },
        { label: isEn ? 'General Manager' : 'Genel Müdür', person: 'İsmail Bilge – 0 533 081 22 02', phone: '05330812202' }
      ],
      mapsLabel: COMPANY_CONTACT.mainHq.mapsAddress,
      mapsEmbedUrl: COMPANY_CONTACT.mainHq.mapsEmbedUrl,
      mapsDirectUrl: COMPANY_CONTACT.mainHq.mapsDirectUrl
    },
    'istanbul-anadolu': {
      key: 'istanbul-anadolu',
      title: isEn ? 'ISTANBUL ASIAN SIDE & KURNAKÖY WAREHOUSE' : 'İSTANBUL ANADOLU YAKASI & KURNAKÖY DEPO',
      titleDisplay: isEn ? 'Istanbul Asian Side Regional Office & Kurnaköy Warehouse' : 'İstanbul Anadolu Yakası Bölge Temsilciliği & Kurnaköy Depo',
      address: isEn ? COMPANY_CONTACT.branches[0].addressEn : COMPANY_CONTACT.branches[0].address,
      phone: '0 533 191 47 55',
      phoneClean: '+905331914755',
      email: COMPANY_CONTACT.salesRegions[0].email,
      whatsappNumber: '905331914755',
      repName: 'Talha Sonakalan (İstanbul Anadolu - 0533 191 47 55)',
      btnLabel: isEn ? 'Send via WhatsApp (Asian Side: 0533 191 47 55)' : 'Gönder (WhatsApp - İstanbul Anadolu: 0533 191 47 55)',
      contacts: [
        { label: isEn ? 'Regional Representative' : 'Bölge Sorumlusu', person: 'Talha Sonakalan – 0 533 191 47 55', phone: '05331914755' },
        { label: isEn ? 'Warehouse Manager' : 'Depo Sorumlusu', person: 'Emre Gülen – 0535 273 37 12', phone: '05352733712' }
      ],
      mapsLabel: COMPANY_CONTACT.branches[0].mapsLabel,
      mapsEmbedUrl: COMPANY_CONTACT.branches[0].mapsEmbedUrl,
      mapsDirectUrl: COMPANY_CONTACT.branches[0].mapsDirectUrl
    },
    'ic-anadolu': {
      key: 'ic-anadolu',
      title: isEn ? 'CENTRAL ANATOLIA REGION & DCK FACTORY' : 'İÇ ANADOLU BÖLGESİ & DCK FABRİKASI',
      titleDisplay: isEn ? 'Central Anatolia Regional Representative & DCK Chemical Factory' : 'İç Anadolu Bölge Temsilciliği & DCK Yapı Kimyasalları Fabrikası',
      address: isEn ? COMPANY_CONTACT.branches[1].addressEn : COMPANY_CONTACT.branches[1].address,
      phone: '0 545 807 09 79',
      phoneClean: '+905458070979',
      email: COMPANY_CONTACT.salesRegions[1].email,
      whatsappNumber: '905458070979',
      repName: 'Hüseyin Güneş (İç Anadolu - 0545 807 09 79)',
      btnLabel: isEn ? 'Send via WhatsApp (Central Anatolia: 0545 807 09 79)' : 'Gönder (WhatsApp - İç Anadolu: 0545 807 09 79)',
      contacts: [
        { label: isEn ? 'Regional Representative' : 'Bölge Sorumlusu', person: 'Hüseyin Güneş – 0 545 807 09 79', phone: '05458070979' },
        { label: isEn ? 'Factory Central' : 'Fabrika İletişim', person: 'Niğde Bor OSB Tesisleri – 0545 807 09 79', phone: '05458070979' }
      ],
      mapsLabel: COMPANY_CONTACT.branches[1].mapsLabel,
      mapsEmbedUrl: COMPANY_CONTACT.branches[1].mapsEmbedUrl,
      mapsDirectUrl: COMPANY_CONTACT.branches[1].mapsDirectUrl
    },
    'akdeniz': {
      key: 'akdeniz',
      title: isEn ? 'MEDITERRANEAN REGION & ANTALYA WAREHOUSE' : 'AKDENİZ BÖLGESİ & ANTALYA DEPO',
      titleDisplay: isEn ? 'Mediterranean Regional Office & Antalya Warehouse' : 'Akdeniz Bölge Temsilciliği & Antalya Depo',
      address: isEn ? COMPANY_CONTACT.branches[2].addressEn : COMPANY_CONTACT.branches[2].address,
      phone: '0 533 081 21 34',
      phoneClean: '+905330812134',
      email: COMPANY_CONTACT.salesRegions[2].email,
      whatsappNumber: '905330812134',
      repName: 'Cem Kuzu (Akdeniz Bölgesi - 0533 081 21 34)',
      btnLabel: isEn ? 'Send via WhatsApp (Mediterranean: 0533 081 21 34)' : 'Gönder (WhatsApp - Akdeniz Bölgesi: 0533 081 21 34)',
      contacts: [
        { label: isEn ? 'Regional Representative' : 'Bölge Sorumlusu / Depo Yetkilisi', person: 'Cem Kuzu – 0 533 081 21 34', phone: '05330812134' }
      ],
      mapsLabel: COMPANY_CONTACT.branches[2].mapsLabel,
      mapsEmbedUrl: COMPANY_CONTACT.branches[2].mapsEmbedUrl,
      mapsDirectUrl: COMPANY_CONTACT.branches[2].mapsDirectUrl
    }
  };

  const activeRegion = REGIONS_MAP[selectedRegionKey] || REGIONS_MAP['genel-merkez'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const textMessage = `*${isEn ? 'Contact Form Message' : 'İletişim Formu Mesajı'}*\n\n` +
      `*${isEn ? 'Selected Region' : 'Seçilen Bölge'}:* ${activeRegion.titleDisplay}\n` +
      `*${isEn ? 'Region Representative' : 'Bölge Temsilcisi'}:* ${activeRegion.repName}\n` +
      `*${isEn ? 'Name' : 'Ad Soyad'}:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*${isEn ? 'Phone' : 'Telefon'}:* ${formData.phone}\n` +
      `*${isEn ? 'Subject' : 'Konu'}:* ${formData.subject || 'Bilgi Talebi'}\n` +
      `*${isEn ? 'Message' : 'Mesaj'}:* ${formData.message}`;

    const encodedText = encodeURIComponent(textMessage);
    const targetWhatsApp = activeRegion.whatsappNumber || '905322616519';
    const whatsappUrl = `https://wa.me/${targetWhatsApp}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="contact-page">
      {/* Breadcrumb Header */}
      <div className="page-header-bar">
        <div className="container">
          <div className="breadcrumb">
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
              {isEn ? 'Home' : 'Anasayfa'}
            </a>
            <ChevronRight size={14} />
            <span className="current">{isEn ? 'Contact' : 'İletişim'}</span>
          </div>

          <div className="header-title-box">
            <div>
              <span className="section-tag">{t.tag}</span>
              <h1 className="page-main-title">{t.title}</h1>
              <p className="page-main-sub">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container page-content">
        {/* Region Selector Bar at the top of Contact Page */}
        <div className="region-selector-bar">
          <div className="region-selector-label">
            <Globe size={18} className="region-icon" />
            <span>{isEn ? 'Select Region / Branch:' : 'Bölge / Şube Seçiniz:'}</span>
          </div>

          <div className="region-dropdown-box">
            <select
              value={selectedRegionKey}
              onChange={(e) => setSelectedRegionKey(e.target.value)}
              className="region-select"
            >
              <option value="genel-merkez">{isEn ? 'Headquarters (Showroom & Center)' : 'Genel Merkez'}</option>
              <option value="istanbul-anadolu">{isEn ? 'Istanbul Asian Side' : 'İstanbul Anadolu'}</option>
              <option value="ic-anadolu">{isEn ? 'Central Anatolia Region' : 'İç Anadolu'}</option>
              <option value="akdeniz">{isEn ? 'Mediterranean Region' : 'Akdeniz Bölgesi'}</option>
            </select>
          </div>

          {/* Quick Pill Buttons on Desktop */}
          <div className="region-pills">
            <button
              onClick={() => setSelectedRegionKey('genel-merkez')}
              className={`region-pill ${selectedRegionKey === 'genel-merkez' ? 'active' : ''}`}
            >
              {isEn ? 'Headquarters' : 'Genel Merkez'}
            </button>
            <button
              onClick={() => setSelectedRegionKey('istanbul-anadolu')}
              className={`region-pill ${selectedRegionKey === 'istanbul-anadolu' ? 'active' : ''}`}
            >
              {isEn ? 'Istanbul Asian Side' : 'İstanbul Anadolu'}
            </button>
            <button
              onClick={() => setSelectedRegionKey('ic-anadolu')}
              className={`region-pill ${selectedRegionKey === 'ic-anadolu' ? 'active' : ''}`}
            >
              {isEn ? 'Central Anatolia' : 'İç Anadolu'}
            </button>
            <button
              onClick={() => setSelectedRegionKey('akdeniz')}
              className={`region-pill ${selectedRegionKey === 'akdeniz' ? 'active' : ''}`}
            >
              {isEn ? 'Mediterranean' : 'Akdeniz Bölgesi'}
            </button>
          </div>
        </div>

        {/* Top 2 Columns: Dynamic Region Info & Contact Form */}
        <div className="contact-top-grid">
          {/* Dynamic Region HQ / Branch Card */}
          <div className="contact-card hq-card">
            <span className="card-tag" style={{ color: 'var(--accent-terracotta)', fontWeight: 700 }}>
              {activeRegion.title}
            </span>
            <h3 className="card-title">{activeRegion.titleDisplay}</h3>

            <div className="info-rows-list">
              <div className="info-item">
                <MapPin className="info-icon" />
                <div>
                  <strong>{t.addressLabel}</strong>
                  <p>
                    <a 
                      href={activeRegion.mapsDirectUrl || COMPANY_CONTACT.mainHq.mapsDirectUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title={isEn ? "Open in Google Maps" : "Google Haritalar'da Aç"}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                      className="address-maps-link"
                    >
                      {activeRegion.address}
                    </a>
                  </p>
                </div>
              </div>

              <div className="info-item">
                <Phone className="info-icon" />
                <div>
                  <strong>{t.phoneLabel}</strong>
                  <p><a href={`tel:${activeRegion.phoneClean}`}>{activeRegion.phone}</a></p>
                </div>
              </div>

              {activeRegion.contacts && activeRegion.contacts.map((c, idx) => (
                <div key={idx} className="info-item">
                  <UserCheck className="info-icon" />
                  <div>
                    <strong>{c.label}</strong>
                    <p>{c.person}</p>
                  </div>
                </div>
              ))}

              <div className="info-item">
                <Mail className="info-icon" />
                <div>
                  <strong>{t.emailLabel}</strong>
                  <p><a href={`mailto:${activeRegion.email}`}>{activeRegion.email}</a></p>
                </div>
              </div>
            </div>

            {/* Dynamic Map Embed */}
            <div className="map-embed-wrapper" style={{ marginTop: '24px', padding: '12px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <strong>{activeRegion.titleDisplay}</strong> ({activeRegion.mapsLabel})
                </span>
                <a 
                  href={activeRegion.mapsDirectUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-terracotta)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>{isEn ? 'Open Map' : 'Google Maps\'te Aç'}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <iframe
                title={activeRegion.titleDisplay}
                src={activeRegion.mapsEmbedUrl}
                width="100%"
                height="180"
                style={{ border: 0, marginTop: '4px' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="contact-card form-card">
            <span className="card-tag">{isEn ? 'CONTACT FORM' : 'İLETİŞİM FORMU'}</span>
            <h3 className="card-title">{t.formTitle}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {isEn 
                ? `Inquiry for ${activeRegion.titleDisplay}:` 
                : `Seçili Bölge (${activeRegion.titleDisplay}) İçin İletişim Formu:`}
            </p>

            <form onSubmit={handleSubmit} className="contact-page-form">
              <div className="form-group">
                <label>{t.name}</label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? "John Doe" : "Ad Soyad"}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t.email}</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>{t.phone}</label>
                  <input
                    type="tel"
                    required
                    placeholder="+90 532 000 00 00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t.subject}</label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? "Subject Inquiry" : "Mesaj Konusu"}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{t.message}</label>
                <textarea
                  rows={4}
                  required
                  placeholder={isEn ? "Your message..." : "Mesajınız..."}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary form-submit-btn" style={{ width: '100%', justifyContent: 'center' }}>
                <Send size={16} /> {activeRegion.btnLabel || t.sendBtn}
              </button>
            </form>
          </div>
        </div>

        {/* Dedicated Feedback & Complaint Email Banner */}
        <div className="contact-feedback-banner">
          <div className="feedback-banner-text">
            <span className="card-tag" style={{ color: 'var(--accent-clay)' }}>
              {isEn ? 'CUSTOMER SATISFACTION' : 'MÜŞTERİ MEMNUNİYETİ & GERİ BİLDİRİM'}
            </span>
            <h3>{isEn ? 'Have a Suggestion or Complaint?' : 'Bir Şikayet veya Öneriniz mi Var?'}</h3>
            <p>
              {isEn
                ? 'Send your direct suggestions, issues, or feedback via email directly to info@tugladunyasi.com.tr'
                : 'Görüş, öneri ve şikayetlerinizi doğrudan e-posta aracılığıyla info@tugladunyasi.com.tr adresimize iletebilirsiniz.'}
            </p>
          </div>
          <button onClick={onOpenFeedbackModal} className="btn-primary btn-feedback-open">
            <Mail size={18} />
            <span>{isEn ? 'Send Email Feedback' : 'Şikayet & Öneri Formu (E-posta)'}</span>
          </button>
        </div>

        {/* HQ Map Section: Full Map View */}
        <div className="hq-map-section">
          <div className="section-header">
            <span className="section-tag">{t.mapTag}</span>
            <h2 className="section-title">{t.mapTitle}</h2>
            <p className="section-subtitle">
              {isEn ? 'Address:' : 'Adres:'} <strong>{activeRegion.address}</strong>
            </p>
          </div>

          <div className="map-iframe-container">
            <iframe
              title={activeRegion.titleDisplay}
              src={activeRegion.mapsEmbedUrl}
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Sales and Marketing Section */}
        <div className="sales-regions-section">
          <div className="section-header">
            <span className="section-tag">{t.salesTag}</span>
            <h2 className="section-title">{t.salesTitle}</h2>
            <p className="section-subtitle">{t.salesSub}</p>
          </div>

          <div className="sales-cards-grid">
            {COMPANY_CONTACT.salesRegions.map((region, idx) => (
              <div key={idx} className="sales-region-card">
                <span className="region-tag">{isEn ? region.regionEn : region.region}</span>
                <h4 className="sales-person-name">{region.person}</h4>
                <div className="sales-contact-details">
                  <a href={`tel:${region.phoneClean}`} className="sales-phone-link">
                    <Phone size={14} /> {region.phone}
                  </a>
                  {region.email && (
                    <a href={`mailto:${region.email}`} className="sales-email-link">
                      <Mail size={14} /> {region.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branches Section */}
        <div className="branches-section">
          <div className="section-header">
            <span className="section-tag">{t.branchesTag}</span>
            <h2 className="section-title">{t.branchesTitle}</h2>
          </div>

          <div className="branches-grid">
            {COMPANY_CONTACT.branches.map((branch) => (
              <div key={branch.id} className="branch-card">
                <div className="branch-info-header">
                  <Building size={20} className="branch-icon" />
                  <div>
                    <h3 className="branch-name">{isEn ? branch.nameEn : branch.name}</h3>
                    <span className="branch-maps-label">{branch.mapsLabel}</span>
                  </div>
                </div>

                <div className="branch-details">
                  <p><strong>{isEn ? 'Address:' : 'Adres:'}</strong> {isEn ? branch.addressEn : branch.address}</p>
                  <p><strong>{isEn ? 'Contact Person:' : 'Yetkili / İletişim:'}</strong> {branch.contactPerson}</p>
                  <p><strong>{isEn ? 'Phone:' : 'Telefon:'}</strong> <a href={`tel:${branch.phoneClean}`}>{branch.phone}</a></p>
                </div>

                <div className="branch-map-box">
                  <iframe
                    title={isEn ? branch.nameEn : branch.name}
                    src={branch.mapsEmbedUrl}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .contact-page {
          background-color: var(--bg-primary);
          padding-bottom: 90px;
        }
        .page-header-bar {
          background-color: var(--bg-dark);
          color: #FFFFFF;
          padding: 48px 0;
          border-bottom: 1px solid var(--border-dark);
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--text-light-muted);
          margin-bottom: 20px;
        }
        .breadcrumb a {
          color: var(--text-light-muted);
          text-decoration: none;
        }
        .breadcrumb a:hover {
          color: #FFFFFF;
        }
        .breadcrumb .current {
          color: var(--accent-clay);
          font-weight: 500;
        }
        .page-main-title {
          font-size: 3.2rem;
          line-height: 1.1;
          color: #FFFFFF;
          margin-top: 4px;
          margin-bottom: 12px;
        }
        .page-main-sub {
          font-size: 1.05rem;
          color: var(--text-light-muted);
          max-width: 680px;
        }
        .page-content {
          padding-top: 40px;
        }
        .region-selector-bar {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 18px 24px;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .region-selector-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-main);
        }
        .region-icon {
          color: var(--accent-terracotta);
        }
        .region-dropdown-box {
          flex: 1;
          max-width: 320px;
        }
        .region-select {
          width: 100%;
          padding: 10px 14px;
          background-color: var(--bg-primary);
          border: 1.5px solid var(--accent-terracotta);
          color: var(--text-main);
          font-size: 0.92rem;
          font-weight: 600;
          border-radius: 4px;
          outline: none;
          cursor: pointer;
        }
        .region-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .region-pill {
          padding: 8px 16px;
          font-size: 0.84rem;
          font-weight: 500;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition-smooth);
          border-radius: 4px;
        }
        .region-pill:hover {
          border-color: var(--accent-terracotta);
          color: var(--text-main);
        }
        .region-pill.active {
          background-color: var(--accent-terracotta);
          border-color: var(--accent-terracotta);
          color: #FFFFFF;
          font-weight: 600;
        }
        .contact-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .contact-feedback-banner {
          background-color: var(--bg-dark);
          color: #FFFFFF;
          border: 1px solid var(--border-dark);
          padding: 32px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 80px;
          flex-wrap: wrap;
        }
        .feedback-banner-text h3 {
          font-size: 1.5rem;
          color: #FFFFFF;
          margin-top: 4px;
          margin-bottom: 6px;
        }
        .feedback-banner-text p {
          font-size: 0.92rem;
          color: var(--text-light-muted);
          max-width: 580px;
        }
        .btn-feedback-open {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          padding: 14px 24px;
        }
        .contact-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 40px;
        }
        .card-tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: var(--accent-terracotta);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .card-title {
          font-size: 1.8rem;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-light);
        }
        .info-rows-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .info-item {
          display: flex;
          gap: 14px;
        }
        .info-icon {
          color: var(--accent-terracotta);
          flex-shrink: 0;
          margin-top: 3px;
        }
        .info-item strong {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .info-item p {
          font-size: 0.92rem;
          color: var(--text-main);
        }
        .info-item a {
          color: var(--text-main);
          text-decoration: none;
        }
        .info-item a:hover {
          color: var(--accent-terracotta);
        }
        .contact-page-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-main);
          text-transform: uppercase;
        }
        .form-group input, .form-group textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid var(--border-light);
          background-color: var(--bg-primary);
          font-size: 0.9rem;
          outline: none;
          font-family: inherit;
        }
        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--accent-terracotta);
        }
        .form-submit-btn {
          width: 100%;
          justify-content: center;
          margin-top: 8px;
        }
        .hq-map-section {
          margin-bottom: 80px;
        }
        .map-iframe-container {
          border: 1px solid var(--border-light);
          padding: 12px;
          background-color: var(--bg-surface);
        }
        .sales-regions-section {
          margin-bottom: 80px;
        }
        .sales-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 32px;
        }
        .sales-region-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 24px;
        }
        .region-tag {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-terracotta);
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }
        .sales-person-name {
          font-size: 1.2rem;
          margin-bottom: 16px;
        }
        .sales-contact-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sales-phone-link, .sales-email-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: var(--text-main);
          text-decoration: none;
        }
        .sales-phone-link:hover, .sales-email-link:hover {
          color: var(--accent-terracotta);
        }
        .branches-section {
          margin-bottom: 40px;
        }
        .branches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
          margin-top: 32px;
        }
        .branch-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 24px;
        }
        .branch-info-header {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-light);
        }
        .branch-icon {
          color: var(--accent-terracotta);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .branch-name {
          font-size: 1.1rem;
        }
        .branch-maps-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .branch-details p {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .branch-details a {
          color: var(--text-main);
          text-decoration: none;
        }
        .branch-map-box {
          margin-top: 14px;
          border: 1px solid var(--border-light);
          padding: 6px;
          background-color: var(--bg-primary);
        }
        @media (max-width: 992px) {
          .region-selector-bar { flex-direction: column; align-items: stretch; }
          .region-dropdown-box { max-width: 100%; }
        }
        @media (max-width: 768px) {
          .contact-top-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .contact-card { padding: 24px; }
          .page-main-title { font-size: 2.4rem; }
          .region-pills { display: none; }
        }
      `}</style>
    </div>
  );
}
