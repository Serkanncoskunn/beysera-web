import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, UserCheck, ExternalLink, Globe } from 'lucide-react';
import { COMPANY_CONTACT } from '../data/contact_locations';
import { TRANSLATIONS } from '../data/translations';

export default function ContactSection({ lang, onOpenFeedbackModal }) {
  const [selectedRegionKey, setSelectedRegionKey] = useState('genel-merkez');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const t = TRANSLATIONS[lang ? lang : 'TR'].contact;
  const isEn = lang === 'EN';

  // Region options configuration (Physical Facilities & Branches)
  const REGIONS_MAP = {
    'genel-merkez': {
      key: 'genel-merkez',
      title: isEn ? 'HQ & CENTRAL SHOWROOM' : 'GENEL MERKEZ & SHOWROOM',
      titleDisplay: isEn ? 'Tuğla Dünyası Showroom & Headquarters' : 'Tuğla Dünyası Showroom & Genel Merkez',
      address: isEn ? COMPANY_CONTACT.mainHq.addressEn : COMPANY_CONTACT.mainHq.address,
      phone: COMPANY_CONTACT.mainHq.phone,
      phoneClean: COMPANY_CONTACT.mainHq.phoneClean,
      email: COMPANY_CONTACT.mainHq.email,
      whatsappNumber: '905493527200',
      repName: 'Yavuz Kalkan (Genel Merkez - 0549 352 72 00)',
      btnLabel: isEn ? 'Send via WhatsApp (HQ: 0549 352 72 00)' : 'Gönder (WhatsApp - Genel Merkez: 0549 352 72 00)',
      contacts: [
        { label: isEn ? 'Central Sales' : 'Merkez Satış', person: 'Yavuz Kalkan – 0549 352 72 00', phone: '05493527200' },
        { label: isEn ? 'General Manager' : 'Genel Müdür', person: 'İsmail Bilge – 0 533 081 22 02', phone: '05330812202' }
      ],
      mapsLabel: COMPANY_CONTACT.mainHq.mapsAddress,
      mapsEmbedUrl: COMPANY_CONTACT.mainHq.mapsEmbedUrl,
      mapsDirectUrl: COMPANY_CONTACT.mainHq.mapsDirectUrl
    },
    'avrupa-yakasi': {
      key: 'avrupa-yakasi',
      title: isEn ? 'EUROPEAN SIDE REGION' : 'AVRUPA YAKASI BÖLGESİ',
      titleDisplay: isEn ? 'European Side Regional Sales Representation' : 'Avrupa Yakası Bölge Satış Temsilciliği',
      address: isEn ? COMPANY_CONTACT.mainHq.addressEn : COMPANY_CONTACT.mainHq.address,
      phone: '0 535 273 37 12',
      phoneClean: '+905352733712',
      email: 'muratyilmaz@tugladunyasi.com.tr',
      whatsappNumber: '905352733712',
      repName: 'Murat Yılmaz (Avrupa Yakası - 0535 273 37 12)',
      btnLabel: isEn ? 'Send via WhatsApp (European Side: 0535 273 37 12)' : 'Gönder (WhatsApp - Avrupa Yakası: 0535 273 37 12)',
      contacts: [
        { label: isEn ? 'Regional Sales Representative' : 'Bölge Satış Sorumlusu', person: 'Murat Yılmaz – 0 535 273 37 12', phone: '05352733712' },
        { label: isEn ? 'Headquarters Location' : 'Genel Merkez Lokasyonu', person: 'Çekmeköy Showroom – 0 216 669 07 51', phone: '02166690751' }
      ],
      mapsLabel: COMPANY_CONTACT.mainHq.mapsAddress,
      mapsEmbedUrl: COMPANY_CONTACT.mainHq.mapsEmbedUrl,
      mapsDirectUrl: COMPANY_CONTACT.mainHq.mapsDirectUrl
    },
    'anadolu-yakasi': {
      key: 'anadolu-yakasi',
      title: isEn ? 'ANATOLIAN SIDE REGION' : 'ANADOLU YAKASI BÖLGESİ',
      titleDisplay: isEn ? 'Anatolian Side Regional Sales Representation' : 'Anadolu Yakası Bölge Satış Temsilciliği',
      address: isEn ? COMPANY_CONTACT.mainHq.addressEn : COMPANY_CONTACT.mainHq.address,
      phone: '0 533 191 47 55',
      phoneClean: '+905331914755',
      email: 'talhakayra@tugladunyasi.com.tr',
      whatsappNumber: '905331914755',
      repName: 'Talha Kayra (Anadolu Yakası - 0533 191 47 55)',
      btnLabel: isEn ? 'Send via WhatsApp (Anatolian Side: 0533 191 47 55)' : 'Gönder (WhatsApp - Anadolu Yakası: 0533 191 47 55)',
      contacts: [
        { label: isEn ? 'Regional Sales Representative' : 'Bölge Satış Sorumlusu', person: 'Talha Kayra – 0 533 191 47 55', phone: '05331914755' },
        { label: isEn ? 'Headquarters Location' : 'Genel Merkez Lokasyonu', person: 'Çekmeköy Showroom – 0 216 669 07 51', phone: '02166690751' }
      ],
      mapsLabel: COMPANY_CONTACT.mainHq.mapsAddress,
      mapsEmbedUrl: COMPANY_CONTACT.mainHq.mapsEmbedUrl,
      mapsDirectUrl: COMPANY_CONTACT.mainHq.mapsDirectUrl
    },
    'ic-anadolu': {
      key: 'ic-anadolu',
      title: isEn ? 'CENTRAL ANATOLIA REGION & DCK FACTORY' : 'İÇ ANADOLU BÖLGESİ & DCK FABRİKASI',
      titleDisplay: isEn ? 'Central Anatolia Regional Representative & DCK Chemical Factory' : 'İç Anadolu Bölge Temsilciliği & DCK Yapı Kimyasalları Fabrikası',
      address: isEn ? COMPANY_CONTACT.branches[1].addressEn : COMPANY_CONTACT.branches[1].address,
      phone: '0 545 807 09 79',
      phoneClean: '+905458070979',
      email: 'info@tugladunyasi.com.tr',
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
      email: 'cemkuzu@tugladunyasi.com.tr',
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
    const targetWhatsApp = activeRegion.whatsappNumber || '905493527200';
    const whatsappUrl = `https://wa.me/${targetWhatsApp}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.subtitle}</p>
        </div>

        {/* Region Selector Bar */}
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
              <option value="genel-merkez">{isEn ? 'Headquarters' : 'Genel Merkez'}</option>
              <option value="avrupa-yakasi">{isEn ? 'European Side' : 'Avrupa Yakası'}</option>
              <option value="anadolu-yakasi">{isEn ? 'Anatolian Side' : 'Anadolu Yakası'}</option>
              <option value="ic-anadolu">{isEn ? 'Central Anatolia' : 'İç Anadolu'}</option>
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
              onClick={() => setSelectedRegionKey('avrupa-yakasi')}
              className={`region-pill ${selectedRegionKey === 'avrupa-yakasi' ? 'active' : ''}`}
            >
              {isEn ? 'European Side' : 'Avrupa Yakası'}
            </button>
            <button
              onClick={() => setSelectedRegionKey('anadolu-yakasi')}
              className={`region-pill ${selectedRegionKey === 'anadolu-yakasi' ? 'active' : ''}`}
            >
              {isEn ? 'Anatolian Side' : 'Anadolu Yakası'}
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
              {isEn ? 'Mediterranean Region' : 'Akdeniz Bölgesi'}
            </button>
          </div>
        </div>

        {/* Contact Grid with Dynamic Region Content */}
        <div className="contact-grid">
          {/* Dynamic Region Details & Location Card */}
          <div className="contact-info-card">
            <div className="info-card-header">
              <span className="card-region-tag">{activeRegion.title}</span>
              <h3 className="info-card-title">{activeRegion.titleDisplay}</h3>
            </div>

            <div className="info-list">
              <div className="info-row">
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

              <div className="info-row">
                <Phone className="info-icon" />
                <div>
                  <strong>{t.phoneLabel}</strong>
                  <p><a href={`tel:${activeRegion.phoneClean}`}>{activeRegion.phone}</a></p>
                </div>
              </div>

              {activeRegion.contacts && activeRegion.contacts.map((c, idx) => (
                <div key={idx} className="info-row">
                  <UserCheck className="info-icon" />
                  <div>
                    <strong>{c.label}</strong>
                    <p>{c.person}</p>
                  </div>
                </div>
              ))}

              <div className="info-row">
                <Mail className="info-icon" />
                <div>
                  <strong>{t.emailLabel}</strong>
                  <p><a href={`mailto:${activeRegion.email}`}>{activeRegion.email}</a></p>
                </div>
              </div>
            </div>

            {/* Dynamic Map Embed & Direct Link */}
            <div className="map-embed-wrapper">
              <div className="map-top-bar">
                <span className="map-label">
                  <strong>{activeRegion.titleDisplay}</strong> ({activeRegion.mapsLabel})
                </span>
                <a 
                  href={activeRegion.mapsDirectUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="maps-open-btn"
                >
                  <span>{isEn ? 'Open in Google Maps' : 'Google Maps\'te Konumu Aç'}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <iframe
                title={activeRegion.titleDisplay}
                src={activeRegion.mapsEmbedUrl}
                width="100%"
                height="200"
                style={{ border: 0, marginTop: '8px' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-card">
            <h3 className="info-card-title">{t.formTitle}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {isEn 
                ? `Inquiry for ${activeRegion.titleDisplay}:` 
                : `Seçili Bölge (${activeRegion.titleDisplay}) İçin İletişim Formu:`}
            </p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>{t.name}</label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? "John Doe" : "Örn: Ahmet Yılmaz"}
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
                  placeholder={isEn ? "Project Inquiry" : "Konu başlığı"}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{t.message}</label>
                <textarea
                  rows={4}
                  required
                  placeholder={isEn ? "Write your project details or inquiries..." : "İlgilendiğiniz ürün modeli veya proje m² detayları..."}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Send size={16} /> {activeRegion.btnLabel || t.sendBtn}
              </button>

              {onOpenFeedbackModal && (
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <button 
                    type="button"
                    onClick={onOpenFeedbackModal}
                    className="btn-feedback-trigger"
                    style={{ background: "none", border: "none", color: "var(--accent-terracotta)", fontSize: "0.84rem", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }}
                  >
                    ✉️ {isEn ? "Customer Complaints & Suggestions Form" : "Müşteri Memnuniyeti, Şikayet ve Öneri Bildirimi"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .contact-section {
          padding: 90px 0;
          background-color: var(--bg-primary);
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
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .contact-info-card, .contact-form-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 40px;
        }
        .card-region-tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--accent-terracotta);
          margin-bottom: 6px;
        }
        .info-card-title {
          font-size: 1.6rem;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-light);
          line-height: 1.2;
        }
        .info-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        .info-row {
          display: flex;
          gap: 14px;
        }
        .info-icon {
          color: var(--accent-terracotta);
          flex-shrink: 0;
          margin-top: 3px;
        }
        .info-row strong {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .info-row p {
          font-size: 0.92rem;
          color: var(--text-main);
        }
        .info-row a {
          color: var(--text-main);
          text-decoration: none;
        }
        .info-row a:hover {
          color: var(--accent-terracotta);
        }
        .map-embed-wrapper {
          border: 1px solid var(--border-light);
          padding: 14px;
          background-color: var(--bg-primary);
        }
        .map-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .map-label {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .maps-open-btn {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-terracotta);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
        }
        .maps-open-btn:hover {
          color: var(--accent-terracotta-hover);
          text-decoration: underline;
        }
        .contact-form {
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
        @media (max-width: 992px) {
          .region-selector-bar { flex-direction: column; align-items: stretch; }
          .region-dropdown-box { max-width: 100%; }
        }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .contact-info-card, .contact-form-card { padding: 24px; }
          .region-pills { display: none; }
        }
      `}</style>
    </section>
  );
}
