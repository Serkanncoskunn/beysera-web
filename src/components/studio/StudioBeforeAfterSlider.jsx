import React, { useState, useRef, useCallback } from 'react';
import { Columns } from 'lucide-react';

export default function StudioBeforeAfterSlider({ beforeImage, afterCanvasDataUrl, lang = 'TR' }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const isEn = lang === 'EN';

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      className="before-after-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      {/* Cladded Studio Render (Bottom Layer) */}
      <img
        src={afterCanvasDataUrl}
        alt="Tuğla Dünyası Cladding"
        className="slider-layer-img"
      />

      {/* Before / Raw Architecture (Top Layer, Clipped to sliderPos) */}
      <div
        className="slider-before-wrap"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeImage}
          alt="Raw Architecture"
          className="slider-before-img"
        />
        <div className="slider-label before-label">
          {isEn ? 'ORIGINAL / RAW' : 'HAM MİMARİ'}
        </div>
      </div>

      <div className="slider-label after-label">
        {isEn ? 'TUĞLA DÜNYASI STUDIO' : 'TUĞLA DÜNYASI STUDIO'}
      </div>

      {/* Divider Bar & Handle */}
      <div
        className="slider-handle-line"
        style={{ left: `${sliderPos}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={() => setIsDragging(true)}
      >
        <div className="slider-handle-button">
          <Columns size={16} />
        </div>
      </div>

      <style>{`
        .before-after-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          user-select: none;
          background: #141210;
          cursor: ew-resize;
          border-radius: 6px;
        }
        .slider-layer-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .slider-before-wrap {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          overflow: hidden;
          z-index: 2;
          border-right: 2px solid #FFFFFF;
        }
        .slider-before-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          min-width: 100%;
          object-fit: cover;
          filter: grayscale(80%) brightness(0.9);
        }
        .slider-label {
          position: absolute;
          top: 16px;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          z-index: 4;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          pointer-events: none;
        }
        .before-label {
          left: 16px;
          background: rgba(20, 18, 16, 0.88);
          color: #D6D3D1;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .after-label {
          right: 16px;
          background: var(--accent-terracotta);
          color: #FFFFFF;
        }
        .slider-handle-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #FFFFFF;
          z-index: 10;
          transform: translateX(-50%);
          box-shadow: 0 0 14px rgba(0,0,0,0.7);
        }
        .slider-handle-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #FFFFFF;
          color: #141210;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          border: 2px solid var(--accent-terracotta);
          cursor: grab;
        }
        .slider-handle-button:active {
          cursor: grabbing;
          transform: translate(-50%, -50%) scale(1.1);
        }
      `}</style>
    </div>
  );
}
