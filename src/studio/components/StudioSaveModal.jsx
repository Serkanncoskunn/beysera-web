// src/studio/components/StudioSaveModal.jsx
import React from 'react';
import { X, CheckCircle2, MessageSquare } from 'lucide-react';

export default function StudioSaveModal({ isOpen, onClose, quoteData, onOpenQuoteModal, isEn }) {
  if (!isOpen || !quoteData) return null;

  return (
    <div className="studio-modal-overlay" onClick={onClose}>
      <div className="studio-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-icon-badge">
            <CheckCircle2 size={24} />
          </div>
          <h3>{isEn ? 'Architectural Design Configured' : 'Mimari Tasarımınız Hazır'}</h3>
          <p>
            {isEn
              ? 'Your custom brick configuration has been saved. You can request an official price quote and sample delivery via WhatsApp.'
              : 'Seçtiğiniz tuğla dizilim ve derz parametreleri hazırlandı. WhatsApp üzerinden yetkili bölge temsilcimizden fiyat ve numune talep edebilirsiniz.'}
          </p>
        </div>

        <div className="config-summary-box">
          <div className="summary-row">
            <span className="slabel">{isEn ? 'Product Name:' : 'Ürün Adı:'}</span>
            <strong className="sval">{quoteData.stokAdi}</strong>
          </div>
          <div className="summary-row">
            <span className="slabel">{isEn ? 'Stock Code:' : 'Stok Kodu:'}</span>
            <strong className="sval code-badge">{quoteData.stokKodu}</strong>
          </div>
          <div className="summary-row">
            <span className="slabel">{isEn ? 'Template:' : 'Mimari Şablon:'}</span>
            <span className="sval">{quoteData.templateName}</span>
          </div>
          <div className="summary-row">
            <span className="slabel">{isEn ? 'Laying Pattern:' : 'Döşeme Deseni:'}</span>
            <span className="sval">{quoteData.patternName}</span>
          </div>
          <div className="summary-row">
            <span className="slabel">{isEn ? 'Scale & Grout:' : 'Ölçek & Derz:'}</span>
            <span className="sval">{quoteData.scale} • {quoteData.groutWidth} ({quoteData.groutColor})</span>
          </div>
        </div>

        <div className="modal-actions-grid">
          <button
            className="btn-modal-primary"
            onClick={() => {
              onClose();
              if (onOpenQuoteModal) onOpenQuoteModal();
            }}
          >
            <MessageSquare size={16} />
            <span>{isEn ? 'Request Price Quote via WhatsApp' : 'WhatsApp ile Teklif & Numune İste'}</span>
          </button>
          <button className="btn-modal-outline" onClick={onClose}>
            {isEn ? 'Continue Designing' : 'Tasarımı Düzenlemeye Devam Et'}
          </button>
        </div>
      </div>
    </div>
  );
}
