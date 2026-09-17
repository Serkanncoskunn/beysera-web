import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const INTRO_IMAGE = "/assets/intro/single_brand_intro.jpg";
const INTRO_DURATION = 2800; // 2.8 seconds

export default function IntroCinematicOverlay({ onComplete, isVisible }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Preload image on mount
  useEffect(() => {
    const img = new Image();
    img.src = INTRO_IMAGE;
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    setProgress(0);
    setIsFadingOut(false);

    const startTime = Date.now();
    const intervalTime = 20;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / INTRO_DURATION) * 100);
      setProgress(pct);

      if (elapsed >= INTRO_DURATION) {
        clearInterval(timer);
        handleFinish();
      }
    }, intervalTime);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 450);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`cinematic-intro-overlay ${isFadingOut ? 'fade-out' : ''}`}
      onClick={handleFinish}
      title="Atlamak için tıklayın"
    >
      {/* Background Image with Slow Ambient Ken-Burns Zoom */}
      <div
        className="cinematic-single-scene"
        style={{
          backgroundImage: `url(${INTRO_IMAGE})`,
        }}
      />

      {/* Cinematic Golden Light Sweep & Radial Vignette */}
      <div className="cinematic-light-sweep" />
      <div className="cinematic-radial-vignette" />

      {/* Top Bar: Progress Line & Skip Button */}
      <div className="cinematic-single-top" onClick={(e) => e.stopPropagation()}>
        <div className="cinematic-single-track">
          <div 
            className="cinematic-single-progress" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        <div className="cinematic-single-actions">
          <div className="cinematic-single-brand-tag">
            <Sparkles size={13} className="sparkle-gold" />
            <span>MİMARİ KAPLAMA VE KLİNKER TUĞLA</span>
          </div>

          <button 
            type="button" 
            className="cinematic-skip-btn" 
            onClick={handleFinish}
            title="ESC veya tık ile geç"
          >
            <span>Geç</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Bottom Subtitle / Brand Signature */}
      <div className="cinematic-single-bottom" onClick={(e) => e.stopPropagation()}>
        <div className="cinematic-motto-wrap">
          <span className="cinematic-motto-title">DOĞALLIK • ESTETİK • GÜVEN</span>
          <span className="cinematic-motto-sub">EST. 2024 • İSTANBUL</span>
        </div>
        <div className="cinematic-skip-subhint">
          Tıklayarak veya ESC ile ana sayfaya geçebilirsiniz
        </div>
      </div>
    </div>
  );
}
