import React, { useState, useEffect, useRef } from 'react';
import { FastForward } from 'lucide-react';

export default function IntroVideoOverlay({ isOpen, onFinished, lang }) {
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const isEn = lang === 'EN';

  useEffect(() => {
    if (!isOpen) return;

    setIsFading(false);
    setProgress(0);

    // Auto fallback if video fails or finishes
    const fallbackTimer = setTimeout(() => {
      handleComplete();
    }, 3500);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [isOpen]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleComplete = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      if (onFinished) onFinished();
    }, 800); // 800ms smooth fade transition
  };

  if (!isOpen) return null;

  return (
    <div className={`intro-video-overlay ${isFading ? 'fading-out' : ''}`}>
      {/* Background Video */}
      <video
        ref={videoRef}
        src="/background/intro_video.mp4"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleComplete}
        className="intro-video-element"
      />

      {/* Subtle Bottom Progress Bar */}
      <div className="intro-progress-track">
        <div 
          className="intro-progress-fill" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Skip Button */}
      <button 
        onClick={handleComplete} 
        className="intro-skip-btn"
        aria-label={isEn ? 'Skip Intro' : 'Girişi Geç'}
      >
        <span>{isEn ? 'Skip' : 'Geç'}</span>
        <FastForward size={16} />
      </button>

      <style>{`
        .intro-video-overlay {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background-color: #0b0704;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          opacity: 1;
          visibility: visible;
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .intro-video-overlay.fading-out {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .intro-video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }

        .intro-progress-track {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.15);
          z-index: 10;
        }

        .intro-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ea580c, #f97316);
          transition: width 0.1s linear;
        }

        .intro-skip-btn {
          position: absolute;
          top: 32px;
          right: 32px;
          z-index: 20;
          background: rgba(18, 14, 11, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);
          color: #f8fafc;
          padding: 8px 18px;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .intro-skip-btn:hover {
          background: rgba(234, 88, 12, 0.85);
          border-color: #ea580c;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(234, 88, 12, 0.4);
        }

        @media (max-width: 768px) {
          .intro-skip-btn {
            top: 20px;
            right: 20px;
            padding: 6px 14px;
            font-size: 0.78rem;
          }
        }
      `}</style>
    </div>
  );
}
