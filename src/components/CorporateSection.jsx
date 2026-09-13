import React, { useState } from 'react';
import { Award, ShieldCheck, Flame, Leaf, Maximize2, FileCheck } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import LightboxModal from './LightboxModal';
import CERTIFICATES_DATA from '../data/certificates_db.json';

export const DYNAMIC_CERTIFICATES = CERTIFICATES_DATA;
export const DYNAMIC_TSE_CERTIFICATES = CERTIFICATES_DATA.filter(c => c.category === 'TSE Belgelerimiz');
export const DYNAMIC_KALITE_CERTIFICATES = CERTIFICATES_DATA.filter(c => c.category !== 'TSE Belgelerimiz');

export default function CorporateSection({ lang }) {
  const [activeCert, setActiveCert] = useState(null);
  const [activeTab, setActiveTab] = useState('tse');
  const t = TRANSLATIONS[lang ? lang : 'TR'].corporate;
  const isEn = lang === 'EN';

  const tseCerts = DYNAMIC_TSE_CERTIFICATES.length > 0 ? DYNAMIC_TSE_CERTIFICATES : CERTIFICATES_DATA;
  const kaliteCerts = DYNAMIC_KALITE_CERTIFICATES.length > 0 ? DYNAMIC_KALITE_CERTIFICATES : CERTIFICATES_DATA;

  const displayedCertificates = activeTab === 'tse' ? tseCerts : kaliteCerts;

  return (
    <section id="corporate" className="corporate-section">
      <div className="container">
        <div className="corporate-grid">
          {/* Left Text Column */}
          <div className="corp-text-col">
            <span className="section-tag" style={{ color: "var(--accent-terracotta)" }}>{isEn ? "ROOTED ARCHITECTURAL HERITAGE" : "KÖKLÜ MİMARİ MİRAS & USTA GELENEĞİ"}</span>
            <h2 className="section-title" style={{ color: "#FFFFFF" }}>{isEn ? "The Centuries-Old Story of Brick Born from Clay, Water & Fire" : "Toprağın Ateşle Buluştuğu Yüzyıllık Tuğla Hikâyesi"}</h2>
            <p className="corp-desc">
              {isEn 
                ? `Carrying forward the thousand-year tradition that began in Mesopotamia when clay and water met fire, we combine the craftsmanship heritage of \"Taşçı Durmuş\" with the modern architectural vision of Tuğla Dünyası. We deliver premium handmade klinker, antique facing, and restoration bricks sourced from Europe and Turkey, backed by expert on-site craftsmanship.`
                : `Kil ve suyun ateşe kavuşmasıyla başlayan binlerce yıllık kadim tuğla geleneğini; \"Taşçı Durmuş\" köklerimizden aldığımız usta tecrübesi ve Tuğla Dünyası’nın kurumsal kimliğiyle buluşturuyoruz. Avrupa’nın ve ülkemizin seçkin üreticilerinden temin ettiğimiz el yapımı klinker, antik kaplama ve restorasyon tuğlalarını, \"Kaliteli ürün, usta ellerle buluştuğunda değer kazanır\" anlayışıyla projelendirip yerinde titizlikle uyguluyoruz.`}
            </p>

            {/* Key Advantages Checklist */}
            <div className="corp-advantages">
              <div className="adv-item">
                <Flame className="adv-icon" />
                <div>
                  <h4>{t.val1Title}</h4>
                  <p>{t.val1Desc}</p>
                </div>
              </div>

              <div className="adv-item">
                <Leaf className="adv-icon" />
                <div>
                  <h4>{t.val2Title}</h4>
                  <p>{t.val2Desc}</p>
                </div>
              </div>

              <div className="adv-item">
                <ShieldCheck className="adv-icon" />
                <div>
                  <h4>{t.val3Title}</h4>
                  <p>{t.val3Desc}</p>
                </div>
              </div>
            </div>

            {/* Certificate Tabs & Thumbnails Strip on Homepage */}
            <div className="corp-certs-strip">
              <div className="certs-tab-bar">
                <button 
                  className={`cert-tab-btn ${activeTab === 'tse' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tse')}
                >
                  <Award size={15} />
                  <span>{isEn ? `${tseCerts.length} TSE Certificates` : `${tseCerts.length} TSE Belgesi`}</span>
                </button>
                <button 
                  className={`cert-tab-btn ${activeTab === 'kalite' ? 'active' : ''}`}
                  onClick={() => setActiveTab('kalite')}
                >
                  <FileCheck size={15} />
                  <span>{isEn ? `${kaliteCerts.length} Quality Certificates` : `${kaliteCerts.length} Kalite Sertifikası`}</span>
                </button>
              </div>

              <div className="certs-thumbs-grid">
                {displayedCertificates.map((cert) => (
                  <div key={cert.id} className="cert-thumb-item" onClick={() => setActiveCert(cert)}>
                    <img src={cert.thumb} alt={cert.title} className="cert-thumb-img" />
                    <div className="cert-thumb-overlay">
                      <Maximize2 size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="corp-img-col">
            <img 
              src="/images/project_galata_restoration.png" 
              alt="Tuğla Dünyası Kurumsal Yapı & Tarihi Dokular" 
              className="corp-main-img" 
            />
            <div className="cert-badge-box">
              <Award size={28} className="badge-icon" />
              <div>
                <h5>{CERTIFICATES_DATA.length} KALİTE BELGELİ</h5>
                <p>{isEn ? 'TSE, ISO 9001 & CE Certified Standards' : 'Türk Standartları Enstitüsü (TSE), ISO & CE Belgeli'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Modal for Individual Certificates */}
      {activeCert && (
        <LightboxModal
          imageSrc={activeCert.image || activeCert.thumb}
          title={activeCert.title}
          pdfUrl={activeCert.pdfUrl}
          onClose={() => setActiveCert(null)}
        />
      )}

      <style>{`
        .corporate-section {
          padding: 100px 0;
          background-color: var(--bg-dark);
          color: #FFFFFF;
        }
        .corporate-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .corp-desc {
          font-size: 1.1rem;
          color: var(--text-light-muted);
          line-height: 1.6;
          margin-bottom: 36px;
        }
        .corp-advantages {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 28px;
        }
        .adv-item {
          display: flex;
          gap: 16px;
        }
        .adv-icon {
          color: var(--accent-clay);
          flex-shrink: 0;
          width: 28px;
          height: 28px;
        }
        .adv-item h4 {
          font-size: 1.2rem;
          color: #FFFFFF;
          margin-bottom: 4px;
        }
        .adv-item p {
          font-size: 0.9rem;
          color: var(--text-light-muted);
        }
        .corp-certs-strip {
          background-color: var(--bg-dark-surface);
          border: 1px solid var(--border-dark);
          padding: 18px 20px;
          margin-top: 10px;
        }
        .certs-tab-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 14px;
          border-bottom: 1px solid var(--border-dark);
          padding-bottom: 10px;
        }
        .cert-tab-btn {
          background: none;
          border: none;
          color: var(--text-light-muted);
          font-size: 0.84rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        .cert-tab-btn.active {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
        }
        .certs-thumbs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          gap: 10px;
        }
        .cert-thumb-item {
          position: relative;
          height: 85px;
          background-color: #FFFFFF;
          border: 1px solid var(--border-dark);
          overflow: hidden;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cert-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 4px;
          transition: transform 0.3s ease;
        }
        .cert-thumb-item:hover .cert-thumb-img {
          transform: scale(1.08);
        }
        .cert-thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(184, 91, 53, 0.75);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .cert-thumb-item:hover .cert-thumb-overlay {
          opacity: 1;
        }
        .corp-img-col {
          position: relative;
        }
        .corp-main-img {
          width: 100%;
          height: 520px;
          object-fit: cover;
          border: 1px solid var(--border-dark);
        }
        .cert-badge-box {
          position: absolute;
          bottom: -24px;
          left: -24px;
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 16px 36px rgba(0,0,0,0.3);
        }
        .cert-badge-box h5 {
          font-size: 1.1rem;
          line-height: 1.2;
        }
        .cert-badge-box p {
          font-size: 0.75rem;
          opacity: 0.85;
        }
        @media (max-width: 992px) {
          .corporate-grid { grid-template-columns: 1fr; }
          .cert-badge-box { position: relative; bottom: 0; left: 0; margin-top: 16px; }
        }
      `}</style>
    </section>
  );
}
