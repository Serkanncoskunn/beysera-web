import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const SCENES = [
  {
    id: 1,
    title: "DOĞAL KİLİN ZAMANSIZ DOKUSU",
    subtitle: "Özenle seçilmiş ham maddeler ve el işçiliği tuğla dokusu",
    image: "/assets/intro/scene1.jpg",
    duration: 1250,
    tag: "ÜRÜN TANITIMI"
  },
  {
    id: 2,
    title: "MİMARİYE DÖNÜŞEN ESTETİK",
    subtitle: "Doğal kaplama tuğlanın çağdaş villa mimarisiyle kusursuz uyumu",
    image: "/assets/intro/scene2.jpg",
    duration: 1250,
    tag: "MİMARİ DÖNÜŞÜM"
  },
  {
    id: 3,
    title: "YAŞAYAN MEKÂNLAR & GÖRKEMLİ DETAYLAR",
    subtitle: "Işık, gölge ve tuğlanın zamana meydan okuyan harmonisi",
    image: "/assets/intro/scene3.jpg",
    duration: 1250,
    tag: "SİNEMATİK BAKIŞ"
  },
  {
    id: 4,
    title: "TUĞLA DÜNYASI",
    subtitle: "Mimaride Doğallık & Estetiğin Güvenilir İmzası",
    image: "/assets/intro/scene4.jpg",
    duration: 1450,
    tag: "MARKA DENEYİMİ"
  }
];

export default function IntroCinematicOverlay({ onComplete, isVisible }) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Preload all images on mount
  useEffect(() => {
    SCENES.forEach(scene => {
      const img = new Image();
      img.src = scene.image;
    });
  }, []);

  const totalDuration = SCENES.reduce((acc, s) => acc + s.duration, 0);

  useEffect(() => {
    if (!isVisible) return;

    setCurrentSceneIndex(0);
    setProgress(0);
    setIsFadingOut(false);

    const startTime = Date.now();
    const intervalTime = 25;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(pct);

      let cumulative = 0;
      let activeIndex = 0;
      for (let i = 0; i < SCENES.length; i++) {
        cumulative += SCENES[i].duration;
        if (elapsed < cumulative) {
          activeIndex = i;
          break;
        }
        activeIndex = SCENES.length - 1;
      }
      setCurrentSceneIndex(activeIndex);

      if (elapsed >= totalDuration) {
        clearInterval(timer);
        handleFinish();
      }
    }, intervalTime);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
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
    }, 500);
  };

  if (!isVisible) return null;

  const currentScene = SCENES[currentSceneIndex] || SCENES[0];

  return (
    <div 
      className={`cinematic-intro-overlay ${isFadingOut ? 'fade-out' : ''}`}
      onClick={handleFinish}
    >
      {/* Background Scenes with Ken-Burns animations */}
      {SCENES.map((scene, idx) => (
        <div
          key={scene.id}
          className={`cinematic-scene-layer ${idx === currentSceneIndex ? 'active' : ''} ${idx < currentSceneIndex ? 'passed' : ''}`}
          style={{
            backgroundImage: `url(${scene.image})`,
          }}
        />
      ))}

      {/* Cinematic Vignette and Gradient Overlay */}
      <div className="cinematic-gradient-vignette" />

      {/* Top Header Controls & Progress */}
      <div className="cinematic-top-bar" onClick={(e) => e.stopPropagation()}>
        <div className="cinematic-progress-container">
          {SCENES.map((scene, idx) => {
            const isCompleted = idx < currentSceneIndex;
            const isCurrent = idx === currentSceneIndex;
            let barFill = 0;
            if (isCompleted) barFill = 100;
            else if (isCurrent) {
              const prevDurations = SCENES.slice(0, idx).reduce((acc, s) => acc + s.duration, 0);
              const sceneElapsed = (progress / 100) * totalDuration - prevDurations;
              barFill = Math.min(100, Math.max(0, (sceneElapsed / scene.duration) * 100));
            }
            return (
              <div key={scene.id} className="cinematic-progress-track">
                <div 
                  className="cinematic-progress-fill" 
                  style={{ width: `${barFill}%` }} 
                />
              </div>
            );
          })}
        </div>

        <div className="cinematic-top-actions">
          <div className="cinematic-tag">
            <span className="live-dot" />
            <span>{currentScene.tag}</span>
          </div>

          <button 
            type="button" 
            className="cinematic-skip-btn" 
            onClick={handleFinish}
            title="ESC tuşuna basarak geçebilirsiniz"
          >
            <span>Geç</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Center Cinematic Scene Captions */}
      <div className="cinematic-content-box" onClick={(e) => e.stopPropagation()}>
        <div key={currentSceneIndex} className="cinematic-text-anim">
          <span className="cinematic-scene-badge">
            <Sparkles size={13} className="sparkle-icon" /> 
            TUĞLA DÜNYASI MİMARİ VİTRİN
          </span>
          <h1 className="cinematic-scene-title">{currentScene.title}</h1>
          <p className="cinematic-scene-subtitle">{currentScene.subtitle}</p>
        </div>
      </div>

      {/* Bottom Cinematic Letterbox Hint */}
      <div className="cinematic-bottom-bar" onClick={(e) => e.stopPropagation()}>
        <div className="cinematic-brand-micro">
          <span className="brand-dot" />
          <span>EST. 2024 • PREMIUM ARCHITECTURAL CERAMICS & BRICKS</span>
        </div>
        <div className="cinematic-skip-hint">
          Ekrana tıklayarak veya ESC ile ana sayfaya geçebilirsiniz
        </div>
      </div>
    </div>
  );
}
