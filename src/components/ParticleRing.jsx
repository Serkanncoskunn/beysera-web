import { useEffect, useRef } from 'react';

// Hero arkasındaki parçacık halkası. Renkler index.css'teki token'lardan okunur.
// Hareket bilinçli olarak sürekli: yalnızca hero ekrandayken ve sekme açıkken çalışır,
// "azaltılmış hareket" tercihinde tek kare statik çizilir (enerji kuralı için açık istisna).
const readToken = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function gaussian() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function buildParticles(count) {
  const particles = [];
  for (let i = 0; i < count; i += 1) {
    const theta = Math.random() * Math.PI * 2;
    // Halka kalınlığı açıya göre dalgalanır; organik, "nefes alan" bir görünüm verir.
    const spread = 0.07 + 0.05 * Math.sin(theta * 3 + 1.2);
    const offset = gaussian() * spread;
    const roll = Math.random();
    particles.push({
      theta,
      offset,
      size: Math.random() < 0.7 ? 1.5 : 2.5,
      tone: roll < 0.62 ? 0 : roll < 0.86 ? 1 : 2,
      alpha: Math.max(0.15, 1 - Math.abs(offset) / (spread * 2.6)) * (0.7 + Math.random() * 0.3),
      drift: (Math.random() - 0.5) * 0.00035,
    });
  }
  return particles;
}

export default function ParticleRing({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const tones = [
      readToken('--color-accent'),
      readToken('--color-fg-muted'),
      readToken('--color-band-strong'),
    ];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;
    let rafId = 0;
    let visible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = buildParticles(width < 640 ? 1400 : 2600);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      // Yatay ekranda yatık elips; dikey ekranda (telefon) metnin etrafından geçen dikey elips.
      const portrait = height > width * 1.1;
      const rx = portrait ? width * 0.47 : Math.min(width * 0.4, height * 0.56);
      const ry = portrait ? height * 0.36 : rx * 0.6;
      const t = frame * 0.0009;
      for (const p of particles) {
        const angle = p.theta + t + p.drift * frame;
        const k = 1 + p.offset + 0.015 * Math.sin(angle * 5 + t * 6);
        const x = cx + rx * k * Math.cos(angle);
        const y = cy + ry * k * Math.sin(angle);
        // Halkanın arka yarısı daha sönük çizilir; derinlik hissi.
        const depth = 0.55 + 0.45 * ((Math.sin(angle) + 1) / 2);
        ctx.globalAlpha = p.alpha * depth;
        ctx.fillStyle = tones[p.tone];
        ctx.fillRect(x, y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      frame += 1;
      draw();
      rafId = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduceMotion || rafId || !visible || document.hidden) return;
      rafId = window.requestAnimationFrame(loop);
    };
    const stop = () => {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    };

    resize();
    draw();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    intersection.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
