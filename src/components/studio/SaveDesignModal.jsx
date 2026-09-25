import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Share2, 
  Download, 
  MessageSquare, 
  Check, 
  Copy, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  MapPin
} from 'lucide-react';
import { REGIONS_LIST } from '../RegionSelectModal';
import { encodeDesignToUrl } from './studioData';

export default function SaveDesignModal({
  isOpen,
  onClose,
  lang = 'TR',
  designData,
  canvasElement,
  onLoadSavedDesign
}) {
  if (!isOpen) return null;
  const isEn = lang === 'EN';

  const [activeTab, setActiveTab] = useState('quote'); // 'quote', 'save', 'share'
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [designName, setDesignName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(REGIONS_LIST[0]);

  const {
    surface,
    primaryProduct,
    pattern,
    rotation,
    mortar,
    mortarWidth,
    isMixActive,
    mixProducts = [],
    zone
  } = designData || {};

  // Load saved designs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tugla_studio_saved_designs_list');
      if (stored) {
        setSavedDesigns(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  // Save current design to localStorage
  const handleSaveToStorage = () => {
    const title = designName.trim() || `${surface?.name || 'Tasarım'} - ${primaryProduct?.stokAdi || 'Pres Tuğla'}`;
    const newEntry = {
      id: Date.now(),
      title,
      date: new Date().toLocaleDateString(isEn ? 'en-US' : 'tr-TR'),
      data: designData
    };

    const updated = [newEntry, ...savedDesigns.slice(0, 9)];
    setSavedDesigns(updated);
    try {
      localStorage.setItem('tugla_studio_saved_designs_list', JSON.stringify(updated));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      setDesignName('');
    } catch (e) {}
  };

  const handleDeleteSaved = (id) => {
    const filtered = savedDesigns.filter(d => d.id !== id);
    setSavedDesigns(filtered);
    try {
      localStorage.setItem('tugla_studio_saved_designs_list', JSON.stringify(filtered));
    } catch (e) {}
  };

  // Generate shareable URL
  const shareableUrl = (() => {
    const code = encodeDesignToUrl(designData);
    const origin = window.location.origin;
    return `${origin}/studio?design=${code}`;
  })();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  // High resolution PNG Download
  const handleDownloadPng = () => {
    if (!canvasElement) return;
    const a = document.createElement('a');
    a.href = canvasElement.toDataURL('image/png');
    a.download = `Tugla-Dunyasi-Studio-${primaryProduct?.stokKodu || 'Design'}.png`;
    a.click();
  };

  // WhatsApp Quote Dispatch
  const handleSendWhatsapp = (reg) => {
    const targetRegion = reg || selectedRegion;
    let msg = isEn ? 'Hello Tuğla Dünyası Studio Team,\n\n' : 'Merhaba Tuğla Dünyası Studio Ekibi,\n\n';

    if (isEn) {
      msg += 'I have designed a custom brick facade in Tuğla Dünyası Studio and would like to request an official quotation, material calculation, and physical samples.\n\n';
      msg += '📐 DESIGN SPECIFICATIONS:\n';
      msg += `• Architecture / Scene: ${surface?.nameEn || surface?.name}\n`;
      msg += `• Zone: ${zone?.nameEn || zone?.name}\n`;
      if (isMixActive && mixProducts.length > 0) {
        msg += `• Material Mix: ${mixProducts.map(p => `${p.product?.stokAdi} (${p.percentage}%)`).join(', ')}\n`;
      } else {
        msg += `• Selected Brick: ${primaryProduct?.stokAdi} (Code: ${primaryProduct?.stokKodu})\n`;
      }
      msg += `• Bond & Rotation: ${pattern?.nameEn || pattern?.name} (${rotation}°)\n`;
      msg += `• Mortar Spec: ${mortar?.name} (${mortarWidth?.label})\n\n`;
      msg += `Link: ${shareableUrl}\n\n`;
      msg += `Please connect me with ${targetRegion.titleEn} representative.`;
    } else {
      msg += 'Tuğla Dünyası Studio üzerinden mimari cephe tasarımı oluşturdum. Projemiz için metraj hesabı, fiyat teklifi ve numune talebinde bulunmak istiyorum.\n\n';
      msg += '📐 MİMARİ TASARIM DETAYLARI:\n';
      msg += `• Mimari Sahne: ${surface?.name || 'Modern Villa'}\n`;
      msg += `• Uygulama Alanı: ${zone?.name || 'Tüm Cephe'}\n`;
      if (isMixActive && mixProducts.length > 0) {
        msg += `• Malzeme Karışımı (MIX): ${mixProducts.map(p => `${p.product?.stokAdi} (%${p.percentage})`).join(', ')}\n`;
      } else {
        msg += `• Seçilen Ürün: ${primaryProduct?.stokAdi || 'Pres / Kaplama Tuğlası'} (Stok Kodu: ${primaryProduct?.stokKodu || '-' })\n`;
      }
      msg += `• Dizilim & Yön: ${pattern?.name || 'Yatay Yarım Örgü'} (${rotation}°)\n`;
      msg += `• Derz Özelliği: ${mortar?.name} (${mortarWidth?.label})\n\n`;
      msg += `Tasarım Linki: ${shareableUrl}\n\n`;
      msg += `Lütfen ${targetRegion.title} bölge sorumlunuz üzerinden geri dönüş sağlayınız.`;
    }

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${targetRegion.phoneClean}?text=${encoded}`, '_blank');
    onClose();
  };

  return (
    <div className="studio-modal-backdrop" onClick={onClose}>
      <div className="studio-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Modal Navigation Tabs */}
        <div className="modal-nav-tabs">
          <button
            className={`modal-tab-btn ${activeTab === 'quote' ? 'active' : ''}`}
            onClick={() => setActiveTab('quote')}
          >
            <MessageSquare size={15} />
            <span>{isEn ? 'Get Quote' : 'Teklif Al'}</span>
          </button>
          <button
            className={`modal-tab-btn ${activeTab === 'save' ? 'active' : ''}`}
            onClick={() => setActiveTab('save')}
          >
            <Save size={15} />
            <span>{isEn ? 'Save Project' : 'Projeyi Kaydet'}</span>
          </button>
          <button
            className={`modal-tab-btn ${activeTab === 'share' ? 'active' : ''}`}
            onClick={() => setActiveTab('share')}
          >
            <Share2 size={15} />
            <span>{isEn ? 'Share & Export' : 'Paylaş & İndir'}</span>
          </button>
        </div>

        {/* Tab 1: Get Quote via WhatsApp */}
        {activeTab === 'quote' && (
          <div className="modal-tab-pane">
            <div className="pane-header">
              <span className="pane-tag">
                <ShieldCheck size={14} />
                {isEn ? 'DIRECT REGIONAL QUOTATION' : 'BÖLGE SORUMLUSUNDAN TEKLİF ALIN'}
              </span>
              <h3 className="pane-title">{isEn ? 'Request Quote for This Design' : 'Bu Tasarım İçin Teklif Alın'}</h3>
              <p className="pane-desc">
                {isEn
                  ? 'Your designed brick model, bond pattern, and mortar specs will be packaged and delivered directly to your regional advisor on WhatsApp.'
                  : 'Tasarladığınız tuğla modeli, dizilim örgüsü, derz rengi ve uygulama alanı bilgileri otomatik olarak WhatsApp temsilcinize aktarılır.'}
              </p>
            </div>

            {/* Design Specifications Card */}
            <div className="specs-summary-card">
              <div className="spec-item-row">
                <span className="spec-k">{isEn ? 'Architecture:' : 'Mimari Sahne:'}</span>
                <span className="spec-v">{surface?.name}</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-k">{isEn ? 'Material / Mix:' : 'Tuğla / Karışım:'}</span>
                <span className="spec-v highlight">
                  {isMixActive && mixProducts.length > 0
                    ? mixProducts.map(p => `${p.product?.stokAdi} (%${p.percentage})`).join(' + ')
                    : (primaryProduct?.stokAdi || 'Pres Tuğla')}
                </span>
              </div>
              <div className="spec-item-row">
                <span className="spec-k">{isEn ? 'Bond & Orientation:' : 'Dizilim & Yön:'}</span>
                <span className="spec-v">{pattern?.name} ({rotation}°)</span>
              </div>
              <div className="spec-item-row">
                <span className="spec-k">{isEn ? 'Mortar:' : 'Derz Harcı:'}</span>
                <span className="spec-v">{mortar?.name} • {mortarWidth?.label}</span>
              </div>
            </div>

            {/* Region Selector Pills */}
            <div className="regional-buttons-grid">
              {REGIONS_LIST.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => handleSendWhatsapp(reg)}
                  className="region-whatsapp-btn"
                >
                  <div className="reg-text-left">
                    <span className="reg-name">{isEn ? reg.titleEn : reg.title}</span>
                    <span className="reg-tel">{reg.phoneDisplay}</span>
                  </div>
                  <MessageSquare size={16} className="whatsapp-icon-green" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Save Project (LocalStorage) */}
        {activeTab === 'save' && (
          <div className="modal-tab-pane">
            <div className="pane-header">
              <h3 className="pane-title">{isEn ? 'Save Project to Browser' : 'Projeyi Tarayıcınıza Kaydedin'}</h3>
              <p className="pane-desc">
                {isEn
                  ? 'Save this design configuration to revisit or modify later on this device without logging in.'
                  : 'Giriş yapmaya gerek olmadan bu tasarımı tarayıcınıza kaydedip daha sonra tekrar açabilirsiniz.'}
              </p>
            </div>

            <div className="save-input-row">
              <input
                type="text"
                placeholder={isEn ? 'Project name (e.g. Bodrum Villa Facade)...' : 'Proje adı (örn. Çekmeköy Villa Dış Cephe)...'}
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className="modal-text-input"
              />
              <button onClick={handleSaveToStorage} className="btn-primary-save">
                <Save size={14} />
                <span>{isEn ? 'Save' : 'Kaydet'}</span>
              </button>
            </div>

            {saveSuccess && (
              <div className="save-success-banner">
                <Check size={15} />
                <span>{isEn ? 'Project successfully saved!' : 'Tasarımınız başarıyla kaydedildi!'}</span>
              </div>
            )}

            {/* Saved Designs List */}
            {savedDesigns.length > 0 && (
              <div className="saved-list-container">
                <h5 className="saved-list-title">{isEn ? 'Previously Saved Designs:' : 'Daha Önce Kaydedilen Tasarımlar:'}</h5>
                <div className="saved-items-scroll">
                  {savedDesigns.map((item) => (
                    <div key={item.id} className="saved-entry-card">
                      <div className="entry-left" onClick={() => {
                        if (onLoadSavedDesign) onLoadSavedDesign(item.data);
                        onClose();
                      }}>
                        <h6 className="entry-title">{item.title}</h6>
                        <span className="entry-date">{item.date}</span>
                      </div>
                      <div className="entry-actions">
                        <button
                          className="btn-load-entry"
                          onClick={() => {
                            if (onLoadSavedDesign) onLoadSavedDesign(item.data);
                            onClose();
                          }}
                          title={isEn ? 'Load' : 'Yükle'}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          className="btn-del-entry"
                          onClick={() => handleDeleteSaved(item.id)}
                          title={isEn ? 'Delete' : 'Sil'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Share & Export */}
        {activeTab === 'share' && (
          <div className="modal-tab-pane">
            <div className="pane-header">
              <h3 className="pane-title">{isEn ? 'Share & Export Design' : 'Tasarımı Paylaş & İndir'}</h3>
              <p className="pane-desc">
                {isEn
                  ? 'Export a high-resolution PNG render or generate a direct link containing your exact design parameters.'
                  : 'Tasarımınızı yüksek çözünürlüklü PNG görseli olarak indirin veya doğrudan aynı tasarımı açan linki kopyalayın.'}
              </p>
            </div>

            {/* PNG Render Download */}
            <div className="export-action-block">
              <div className="export-text">
                <h5>{isEn ? 'High Resolution Render (PNG)' : 'Yüksek Çözünürlüklü Render (PNG)'}</h5>
                <p>{isEn ? 'Download a clean visual export of your designed architecture.' : 'Mimari cephenizin tamamlanmış görselini bilgisayarınıza indirin.'}</p>
              </div>
              <button onClick={handleDownloadPng} className="btn-export-action">
                <Download size={15} />
                <span>{isEn ? 'Download PNG' : 'PNG İndir'}</span>
              </button>
            </div>

            {/* Shareable URL */}
            <div className="export-action-block">
              <div className="export-text">
                <h5>{isEn ? 'Shareable Link' : 'Paylaşılabilir Tasarım Linki'}</h5>
                <p>{isEn ? 'Anyone with this link will view this exact material configuration.' : 'Bu linki mimarınıza veya müşterinize göndererek aynı tasarımı görüntülemesini sağlayabilirsiniz.'}</p>
              </div>
              <div className="copy-link-input-group">
                <input
                  type="text"
                  readOnly
                  value={shareableUrl}
                  className="modal-text-input link-readonly"
                />
                <button onClick={handleCopyLink} className="btn-copy-link">
                  {copiedLink ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copiedLink ? (isEn ? 'Copied' : 'Kopyalandı') : (isEn ? 'Copy' : 'Kopyala')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .studio-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.84);
          backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .studio-modal-box {
          background: #1C1A18;
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          max-width: 640px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8);
          color: #FAF8F5;
          display: flex;
          flex-direction: column;
        }
        .modal-close-icon-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FFFFFF;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .modal-close-icon-btn:hover {
          background: var(--accent-terracotta);
          border-color: var(--accent-terracotta);
        }

        .modal-nav-tabs {
          display: flex;
          background: #141210;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0 20px;
        }
        .modal-tab-btn {
          padding: 16px 16px;
          background: none;
          border: none;
          color: #A8A29E;
          font-size: 0.82rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }
        .modal-tab-btn:hover {
          color: #FFFFFF;
        }
        .modal-tab-btn.active {
          color: var(--accent-terracotta);
          border-bottom-color: var(--accent-terracotta);
        }

        .modal-tab-pane {
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .pane-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pane-tag {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--accent-terracotta);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        .pane-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          font-family: var(--font-heading);
        }
        .pane-desc {
          font-size: 0.86rem;
          color: #A8A29E;
          line-height: 1.5;
          margin: 0;
        }

        .specs-summary-card {
          background: #24211E;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .spec-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
        }
        .spec-k {
          color: #A8A29E;
        }
        .spec-v {
          color: #FFFFFF;
          font-weight: 700;
          text-align: right;
        }
        .spec-v.highlight {
          color: var(--accent-terracotta);
        }

        .regional-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .region-whatsapp-btn {
          background: #24211E;
          border: 1.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: left;
        }
        .region-whatsapp-btn:hover {
          border-color: #25D366;
          background: #1C3322;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(37, 211, 102, 0.18);
        }
        .reg-text-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .reg-name {
          font-weight: 700;
          font-size: 0.86rem;
        }
        .reg-tel {
          font-size: 0.74rem;
          color: #A8A29E;
        }
        .whatsapp-icon-green {
          color: #25D366;
        }

        /* Save & Share Inputs */
        .save-input-row {
          display: flex;
          gap: 10px;
        }
        .modal-text-input {
          flex-grow: 1;
          background: #24211E;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 10px 14px;
          color: #FFFFFF;
          font-size: 0.85rem;
          outline: none;
        }
        .modal-text-input:focus {
          border-color: var(--accent-terracotta);
        }
        .btn-primary-save {
          padding: 10px 18px;
          background: var(--accent-terracotta);
          border: none;
          color: #FFFFFF;
          font-weight: 700;
          font-size: 0.85rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .save-success-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22C55E;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .saved-list-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 16px;
        }
        .saved-list-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }
        .saved-items-scroll {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 180px;
          overflow-y: auto;
        }
        .saved-entry-card {
          background: #24211E;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .entry-left {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .entry-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }
        .entry-date {
          font-size: 0.7rem;
          color: #A8A29E;
        }
        .entry-actions {
          display: flex;
          gap: 6px;
        }
        .btn-load-entry {
          background: var(--accent-terracotta);
          border: none;
          color: #FFFFFF;
          border-radius: 4px;
          padding: 5px;
          cursor: pointer;
        }
        .btn-del-entry {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #F87171;
          border-radius: 4px;
          padding: 5px;
          cursor: pointer;
        }

        .export-action-block {
          background: #24211E;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .export-text h5 {
          font-size: 0.9rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 3px 0;
        }
        .export-text p {
          font-size: 0.78rem;
          color: #A8A29E;
          margin: 0;
        }
        .btn-export-action {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          background: var(--accent-terracotta);
          border: none;
          color: #FFFFFF;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
        }
        .copy-link-input-group {
          display: flex;
          gap: 8px;
        }
        .link-readonly {
          font-size: 0.75rem;
          color: #A8A29E;
        }
        .btn-copy-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 16px;
          background: #332F2B;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FFFFFF;
          font-size: 0.8rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
        }
        .btn-copy-link:hover {
          background: var(--accent-terracotta);
        }

        @media (max-width: 600px) {
          .regional-buttons-grid {
            grid-template-columns: 1fr;
          }
          .modal-tab-pane {
            padding: 20px 16px;
          }
        }
      `}</style>
    </div>
  );
}
