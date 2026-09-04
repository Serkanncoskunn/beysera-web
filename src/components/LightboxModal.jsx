import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function LightboxModal({ imageSrc, image, title, alt, onClose, isOpen }) {
  const [zoomLevel, setZoomLevel] = useState(1);

  if (isOpen === false) return null;
  const src = imageSrc || image;
  const displayTitle = title || alt || '';

  if (!src) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  const handleReset = () => setZoomLevel(1);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      {/* Lightbox Header Bar */}
      <div className="lightbox-header" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-title-box">
          <span className="lightbox-title">{displayTitle}</span>
        </div>

        <div className="lightbox-controls">
          <button onClick={handleZoomIn} className="lightbox-btn" title="Yakınlaştır">
            <ZoomIn size={18} />
          </button>
          <button onClick={handleZoomOut} className="lightbox-btn" title="Uzaklaştır">
            <ZoomOut size={18} />
          </button>
          <button onClick={handleReset} className="lightbox-btn" title="Sıfırla">
            <RotateCcw size={18} />
          </button>
          <button onClick={onClose} className="lightbox-close-btn" title="Kapat">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Image View */}
      <div className="lightbox-img-container" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt={displayTitle}
          className="lightbox-img"
          style={{ transform: `scale(${zoomLevel})` }}
        />
      </div>

      <style>{`
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          flex-direction: column;
        }
        .lightbox-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .lightbox-title-box {
          display: flex;
          align-items: center;
        }
        .lightbox-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #FFFFFF;
        }
        .lightbox-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .lightbox-btn, .lightbox-close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          width: 36px;
          height: 36px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .lightbox-btn:hover, .lightbox-close-btn:hover {
          background-color: var(--accent-terracotta);
          border-color: var(--accent-terracotta);
        }
        .lightbox-img-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 24px;
        }
        .lightbox-img {
          max-width: 90vw;
          max-height: 85vh;
          object-fit: contain;
          transition: transform 0.3s ease-out;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
