import React, { useState, useEffect } from 'react';

const INTRO_IMAGE = "/assets/intro/single_brand_intro.jpg";
const INTRO_DURATION = 3000; // 3.0 seconds

export default function IntroCinematicOverlay({ onComplete, isVisible }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Preload image on mount
  useEffect(() => {
    const img = new Image();
    img.src = INTRO_IMAGE;
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    setIsFadingOut(false);

    const timer = setTimeout(() => {
      handleFinish();
    }, INTRO_DURATION);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`cinematic-intro-overlay ${isFadingOut ? 'fade-out' : ''}`}
      onClick={handleFinish}
      aria-label="Tuğla Dünyası"
    >
      {/* Background Image with Slow Ambient Ken-Burns Zoom */}
      <div
        className="cinematic-single-scene"
        style={{
          backgroundImage: `url(${INTRO_IMAGE})`,
        }}
      />

      {/* Cinematic Soft Light Sweep & Vignette */}
      <div className="cinematic-light-sweep" />
      <div className="cinematic-radial-vignette" />
    </div>
  );
}
