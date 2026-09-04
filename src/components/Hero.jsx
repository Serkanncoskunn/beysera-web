import React, { useState, useEffect, useRef } from 'react';
import { Layers, Eye, FileText, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import backgroundsData from '../data/backgrounds.json';

const DEFAULT_BACKGROUNDS = [
  '/background/bg1.png',
  '/background/bg2.png',
  '/background/bg3.png',
  '/background/bg4.png'
];

export default function Hero({ lang, onExploreProducts, onExploreProjects, onOpenQuoteModal }) {
  const t = TRANSLATIONS[lang ? lang : 'TR'].hero;
  const isEn = lang === 'EN';
  
  const bgImages = (backgroundsData && backgroundsData.length > 0) 
    ? backgroundsData 
    : DEFAULT_BACKGROUNDS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  // Auto-play interval - runs continuously every 4 seconds
  useEffect(() => {
    if (bgImages.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bgImages.length);
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [bgImages.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bgImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + bgImages.length) % bgImages.length);
  };

  return (
    <section 
      id="hero" 
      className="hero-section"
    >
      {/* Background Slideshow */}
      <div className="hero-bg-container">
        {bgImages.map((bgUrl, idx) => (
          <div
            key={idx}
            className={`hero-bg-slide ${idx === currentIndex ? 'active' : ''}`}
          >
            <img 
              src={bgUrl} 
              alt={`Tuğla Dünyası Mimari Arka Plan ${idx + 1}`} 
              className="hero-bg-img"
            />
          </div>
        ))}
        <div className="hero-overlay-gradient"></div>
      </div>

      {/* Slider Controls: Left/Right Arrows */}
      {bgImages.length > 1 && (
        <>
          <button 
            onClick={handlePrev} 
            className="hero-slider-arrow arrow-left" 
            aria-label="Önceki Görsel"
          >
            <ChevronLeft size={24} />
          </button>

          <button 
            onClick={handleNext} 
            className="hero-slider-arrow arrow-right" 
            aria-label="Sonraki Görsel"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Hero Content */}
      <div className="container hero-content-wrapper">
        <div className="hero-box">
          <span className="hero-tag">{t.tag}</span>
          <h1 className="hero-title">{t.title}</h1>
          <p className="hero-subtitle">{t.subtitle}</p>

          <div className="hero-actions">
            {/* 1. Ürünleri Keşfet */}
            <button onClick={onExploreProducts} className="btn-primary">
              <Layers size={18} />
              <span>{t.btnProducts}</span>
            </button>

            {/* 2. Projeleri İncele */}
            <button onClick={onExploreProjects} className="btn-outline-light">
              <Eye size={18} />
              <span>{t.btnProjects}</span>
            </button>

            {/* 3. Bizimle İletişime Geçin (WhatsApp Logosu ile) */}
            <button onClick={onOpenQuoteModal} className="btn-quote-hero">
              <MessageCircle size={18} />
              <span>{isEn ? "Contact Us on WhatsApp" : "Bizimle İletişime Geçin"}</span>
            </button>
          </div>
        </div>

        {/* Slider Navigation Dots */}
        {bgImages.length > 1 && (
          <div className="hero-dots-wrapper">
            {bgImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`hero-dot ${idx === currentIndex ? 'active' : ''}`}
                aria-label={`Görsel ${idx + 1}`}
              >
                <span className="hero-dot-inner"></span>
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 86vh;
          display: flex;
          align-items: center;
          background-color: var(--bg-dark);
          overflow: hidden;
        }
        .hero-bg-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .hero-bg-slide {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          visibility: hidden;
          transition: opacity 1.2s ease-in-out, visibility 1.2s ease-in-out;
          z-index: 1;
        }
        .hero-bg-slide.active {
          opacity: 1;
          visibility: visible;
          z-index: 2;
        }
        .hero-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transform: scale(1.02);
          transition: transform 12s ease-out;
        }
        .hero-bg-slide.active .hero-bg-img {
          transform: scale(1.06);
        }
        .hero-overlay-gradient {
          position: absolute;
          inset: 0;
          z-index: 3;
          background: linear-gradient(
            to right,
            rgba(20, 18, 17, 0.90) 0%,
            rgba(20, 18, 17, 0.65) 45%,
            rgba(20, 18, 17, 0.25) 100%
          );
        }
        .hero-slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 12;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
          border-radius: 50%;
        }
        .hero-slider-arrow.arrow-left {
          left: 24px;
        }
        .hero-slider-arrow.arrow-right {
          right: 24px;
        }
        .hero-slider-arrow:hover {
          background: var(--accent-terracotta);
          border-color: var(--accent-terracotta);
          transform: translateY(-50%) scale(1.1);
        }
        .hero-content-wrapper {
          position: relative;
          z-index: 10;
          padding-top: 60px;
          padding-bottom: 60px;
          width: 100%;
        }
        .hero-box {
          max-width: 900px;
          color: #FFFFFF;
        }
        .hero-tag {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: var(--accent-clay);
          margin-bottom: 16px;
        }
        .hero-title {
          font-size: 4.2rem;
          line-height: 1.08;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 36px;
          font-weight: 300;
          max-width: 720px;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: nowrap;
        }
        .hero-actions .btn-primary,
        .hero-actions .btn-outline-light,
        .hero-actions .btn-quote-hero {
          white-space: nowrap;
          padding: 14px 22px;
          font-size: 0.9rem;
        }
        .btn-quote-hero {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: var(--accent-clay);
          color: var(--bg-dark);
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: 1px solid var(--accent-clay);
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .btn-quote-hero:hover {
          background-color: #FFFFFF;
          border-color: #FFFFFF;
          color: var(--bg-dark);
        }
        .hero-dots-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 48px;
        }
        .hero-dot {
          background: transparent;
          border: none;
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .hero-dot-inner {
          width: 32px;
          height: 4px;
          background-color: rgba(255, 255, 255, 0.35);
          border-radius: 2px;
          transition: all 0.4s ease;
        }
        .hero-dot.active .hero-dot-inner {
          width: 56px;
          background-color: var(--accent-clay);
        }
        @media (max-width: 992px) {
          .hero-actions {
            flex-wrap: wrap;
          }
          .hero-slider-arrow {
            width: 40px;
            height: 40px;
          }
          .hero-slider-arrow.arrow-left { left: 12px; }
          .hero-slider-arrow.arrow-right { right: 12px; }
        }
        @media (max-width: 768px) {
          .hero-section { min-height: 70vh; }
          .hero-title { font-size: 2.5rem; }
          .hero-subtitle { font-size: 0.95rem; }
          .hero-actions { flex-direction: column; width: 100%; }
          .hero-actions button { width: 100%; justify-content: center; }
          .hero-slider-arrow { display: none; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 2.0rem; }
        }
      `}</style>
    </section>
  );
}
