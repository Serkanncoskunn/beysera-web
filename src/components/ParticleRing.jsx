import { useEffect, useRef } from 'react';

// Hero arkasındaki parçacık halkası. Renkler index.css'teki token'lardan okunur.
// Fare (ya da parmak) yaklaşınca noktalar itilip dağılır, sonra yaylanarak yerlerine döner.
// Hareket bilinçli olarak sürekli: yalnızca hero ekrandayken ve sekme açıkken çalışır,
// "azaltılmış hareket" tercihinde tek kare statik çizilir ve etkileşim kapalıdır
// (enerji kuralı için açık istisna).
const readToken = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// Etkileşim ayarları
const POINTER_RADIUS = 120; // px: imlecin etkilediği alan
const PUSH = 2.6; // itme gücü
const SPRING = 0.035; // yerine dönme hızı
const DAMPING = 0.86; // sönümleme (1'e yaklaştıkça daha uzun salınır)

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
      // Fareyle itilme durumu: yerinden sapma (dx, dy) ve hız (vx, vy)
      dx: 0,
      dy: 0,
      vx: 0,
      vy: 0,
      // Her nokta biraz farklı tepki verir; dağılma daha doğal görünür.
      mass: 0.6 + Math.random() * 0.8,
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
    // İmleç konumu (canvas'a göre); ekran dışındayken etkisiz.
    const pointer = { x: -9999, y: -9999, active: false };

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
      const r2 = POINTER_RADIUS * POINTER_RADIUS;

      for (const p of particles) {
        const angle = p.theta + t + p.drift * frame;
        const k = 1 + p.offset + 0.015 * Math.sin(angle * 5 + t * 6);
        const baseX = cx + rx * k * Math.cos(angle);
        const baseY = cy + ry * k * Math.sin(angle);

        // İmlece yakınsa dışarı doğru it.
        if (pointer.active) {
          const ox = baseX + p.dx - pointer.x;
          const oy = baseY + p.dy - pointer.y;
          const d2 = ox * ox + oy * oy;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = ((1 - d / POINTER_RADIUS) ** 2 * PUSH) / p.mass;
            p.vx += (ox / d) * force;
            p.vy += (oy / d) * force;
          }
        }
        // Yay: yerine dön; sönümleme: salınımı azalt.
        p.vx = (p.vx - p.dx * SPRING) * DAMPING;
        p.vy = (p.vy - p.dy * SPRING) * DAMPING;
        p.dx += p.vx;
        p.dy += p.vy;

        // Halkanın arka yarısı daha sönük çizilir; derinlik hissi.
        const depth = 0.55 + 0.45 * ((Math.sin(angle) + 1) / 2);
        ctx.globalAlpha = p.alpha * depth;
        ctx.fillStyle = tones[p.tone];
        ctx.fillRect(baseX + p.dx, baseY + p.dy, p.size, p.size);
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

    // Canvas metnin arkasında olduğu için olayları pencereden dinliyoruz.
    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointer.x = x;
      pointer.y = y;
    };
    const onPointerLeave = () => {
      pointer.active = false;
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
    if (!reduceMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('blur', onPointerLeave);
    }
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
