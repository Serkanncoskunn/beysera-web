import React, { useState } from 'react';
import { X, Mail, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { COMPANY_CONTACT } from '../data/contact_locations';

export default function FeedbackModal({ isOpen, onClose, lang }) {
  const isEn = lang === 'EN';

  const [feedbackType, setFeedbackType] = useState('Oneri');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const typeLabel = feedbackType === 'Sikayet' 
      ? (isEn ? 'COMPLAINT' : 'ŞİKAYET') 
      : feedbackType === 'Oneri' 
      ? (isEn ? 'SUGGESTION' : 'ÖNERİ') 
      : feedbackType === 'Tesekkur' 
      ? (isEn ? 'THANK YOU' : 'TEŞEKKÜR') 
      : (isEn ? 'FEEDBACK' : 'BİLDİRİM');

    const emailSubject = `[TUĞLA DÜNYASI ${typeLabel}] ${formData.subject || (isEn ? 'Customer Feedback' : 'Müşteri Bildirimi')}`;
    
    const emailBody = 
      `TUĞLA DÜNYASI MÜŞTERİ BİLDİRİM FORMU\n` +
      `----------------------------------------\n` +
      `Bildirim Tipi: ${typeLabel}\n` +
      `Ad Soyad: ${formData.name}\n` +
      `E-posta Adresi: ${formData.email}\n` +
      `Telefon Numarası: ${formData.phone}\n` +
      `Konu: ${formData.subject}\n\n` +
      `DETAYLI MESAJ / GÖRÜŞ:\n` +
      `${formData.message}\n` +
      `----------------------------------------\n` +
      `Tarih: ${new Date().toLocaleString('tr-TR')}`;

    // Construct mailto link
    const mailtoUrl = `mailto:${COMPANY_CONTACT.mainHq.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open default mail app
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    onClose();
  };

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="feedback-modal-header">
          <div className="header-title-flex">
            <MessageSquare className="header-icon" />
            <div>
              <h3>{isEn ? 'Suggestions & Complaints Form' : 'Şikayet ve Öneri Formu'}</h3>
              <p>{isEn ? 'Direct email notification to Tuğla Dünyası Management' : 'Doğrudan Tuğla Dünyası Yönetimine E-posta İletimi'}</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {submitted ? (
          <div className="feedback-success-box">
            <CheckCircle className="success-icon" size={48} />
            <h4>{isEn ? 'Email Prepared & Sent Successfully!' : 'E-posta Başarıyla Hazırlandı ve İletildi!'}</h4>
            <p>
              {isEn
                ? 'Your feedback has been routed to info@tugladunyasi.com.tr via your email client. Thank you for helping us improve our quality.'
                : 'Geri bildiriminiz e-posta programınız üzerinden info@tugladunyasi.com.tr adresimize iletilmiştir. Hizmet kalitemizi artırmamıza katkı sağladığınız için teşekkür ederiz.'}
            </p>
            <button onClick={handleReset} className="btn-primary">
              {isEn ? 'Close' : 'Kapat'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            {/* Feedback Type Selector */}
            <div className="form-group">
              <label>{isEn ? 'Notification Category *' : 'Bildirim Türü Seçiniz *'}</label>
              <div className="type-selector-grid">
                <button
                  type="button"
                  className={`type-btn ${feedbackType === 'Oneri' ? 'active' : ''}`}
                  onClick={() => setFeedbackType('Oneri')}
                >
                  💡 {isEn ? 'Suggestion / Idea' : 'Öneri & Fikir'}
                </button>
                <button
                  type="button"
                  className={`type-btn ${feedbackType === 'Sikayet' ? 'active' : ''}`}
                  onClick={() => setFeedbackType('Sikayet')}
                >
                  ⚠️ {isEn ? 'Complaint / Issue' : 'Şikayet & Sorun'}
                </button>
                <button
                  type="button"
                  className={`type-btn ${feedbackType === 'Tesekkur' ? 'active' : ''}`}
                  onClick={() => setFeedbackType('Tesekkur')}
                >
                  👏 {isEn ? 'Thank You / Review' : 'Teşekkür & Görüş'}
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{isEn ? 'Full Name *' : 'Adınız Soyadınız *'}</label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? "John Doe" : "Ad Soyad"}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{isEn ? 'Email Address *' : 'E-posta Adresiniz *'}</label>
                <input
                  type="email"
                  required
                  placeholder="ornek@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{isEn ? 'Phone Number *' : 'Telefon Numaranız *'}</label>
                <input
                  type="tel"
                  required
                  placeholder="+90 532 000 00 00"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{isEn ? 'Subject *' : 'Konu Başlığı *'}</label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? "Subject of notification" : "Bildirim konusu"}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>{isEn ? 'Detailed Message / Feedback *' : 'Görüş, Öneri veya Şikayet Detayınız *'}</label>
              <textarea
                rows={4}
                required
                placeholder={isEn ? "Please describe your feedback in detail..." : "Lütfen görüş veya talebinizi detaylıca belirtiniz..."}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <div className="form-notice">
              <AlertCircle size={15} />
              <span>
                {isEn 
                  ? 'Your notification will be sent directly to info@tugladunyasi.com.tr'
                  : 'Geri bildiriminiz doğrudan info@tugladunyasi.com.tr e-posta adresimize iletilecektir.'}
              </span>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-outline-cancel">
                {isEn ? 'Cancel' : 'İptal'}
              </button>
              <button type="submit" className="btn-primary flex-submit">
                <Mail size={16} />
                <span>{isEn ? 'Send via Email' : 'E-posta İle Gönder'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .feedback-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(15, 14, 13, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .feedback-modal-content {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          width: 100%;
          max-width: 620px;
          border-radius: 8px;
          box-shadow: 0 24px 48px rgba(0,0,0,0.3);
          overflow: hidden;
          animation: modalFadeIn 0.3s ease;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .feedback-modal-header {
          background-color: var(--bg-dark);
          color: #FFFFFF;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-dark);
        }
        .header-title-flex {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .header-icon {
          color: var(--accent-clay);
          width: 28px;
          height: 28px;
        }
        .feedback-modal-header h3 {
          font-size: 1.25rem;
          margin-bottom: 2px;
          color: #FFFFFF;
        }
        .feedback-modal-header p {
          font-size: 0.8rem;
          color: var(--text-light-muted);
        }
        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-light-muted);
          cursor: pointer;
          padding: 4px;
          transition: var(--transition-smooth);
        }
        .close-btn:hover {
          color: #FFFFFF;
        }
        .feedback-form {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .type-selector-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 6px;
        }
        .type-btn {
          padding: 10px;
          font-size: 0.84rem;
          font-weight: 500;
          border: 1px solid var(--border-light);
          background-color: var(--bg-primary);
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition-smooth);
          border-radius: 4px;
        }
        .type-btn:hover {
          border-color: var(--accent-terracotta);
          color: var(--text-main);
        }
        .type-btn.active {
          background-color: var(--accent-terracotta);
          border-color: var(--accent-terracotta);
          color: #FFFFFF;
          font-weight: 600;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px 14px;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          color: var(--text-main);
          font-size: 0.9rem;
          border-radius: 4px;
          outline: none;
          transition: var(--transition-smooth);
        }
        .form-group input:focus,
        .form-group textarea:focus {
          border-color: var(--accent-terracotta);
        }
        .form-notice {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--text-muted);
          background-color: var(--bg-primary);
          padding: 10px 14px;
          border: 1px solid var(--border-light);
          border-radius: 4px;
        }
        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }
        .btn-outline-cancel {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          font-size: 0.88rem;
          cursor: pointer;
          transition: var(--transition-smooth);
          border-radius: 4px;
        }
        .btn-outline-cancel:hover {
          border-color: var(--text-main);
          color: var(--text-main);
        }
        .flex-submit {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .feedback-success-box {
          padding: 40px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .success-icon {
          color: #2e7d32;
        }
        .feedback-success-box h4 {
          font-size: 1.3rem;
          color: var(--text-main);
        }
        .feedback-success-box p {
          font-size: 0.92rem;
          color: var(--text-muted);
          max-width: 480px;
          line-height: 1.5;
        }
        @media (max-width: 600px) {
          .type-selector-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
