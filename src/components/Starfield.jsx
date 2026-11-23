import { useEffect, useRef } from 'react';

// Hero arkasındaki evren.
// Katmanlar (arkadan öne): Samanyolu bandı ve nebula bulutları (bir kez çizilir, önbellekte tutulur),
// üç derinlikte yıldızlar, kırınım çizgili parlak yıldızlar, kayan yıldız.
// Fare hareket ettikçe katmanlar farklı hızda kayar (paralaks); imlecin yakınındaki yıldızlar
// parlar ve birbirine ince "takımyıldız" çizgileriyle bağlanır.
// Renkler index.css'teki token'lardan okunur. Yalnızca hero ekrandayken ve sekme açıkken çalışır;
// "azaltılmış hareket" tercihinde tek kare statik çizilir (enerji kuralı için bilinçli istisna).
const readToken = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// Token'daki #RRGGBB rengini saydamlıkla kullan (canvas'ta color-mix her tarayıcıda yok).
const rgba = (hex, a) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const LINK_RADIUS = 190; // px: imlecin çevresinde bağlanan yıldızların alanı
const LINK_DISTANCE = 115; // px: iki yıldız bu mesafeden yakınsa çizgiyle bağlanır
const PARALLAX = [6, 14, 28]; // px: her katmanın fareyle en fazla kayma miktarı
const SKY_PAD = 24; // px: nebula katmanı kayarken kenar boşluk görünmesin

function gaussian() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Parlak yıldız için önceden çizilen sprite: hale + çekirdek + dört kırınım çizgisi.
function makeSprite(color, spikes) {
  const s = 64;
  const c = document.createElement('canvas');
  c.width = s;
  c.height = s;
  const g = c.getContext('2d');
  const m = s / 2;
  const halo = g.createRadialGradient(m, m, 0, m, m, m);
  halo.addColorStop(0, color);
  halo.addColorStop(0.08, color);
  halo.addColorStop(0.22, rgba(color, 0.35));
  halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
  g.fillStyle = halo;
  g.fillRect(0, 0, s, s);
  if (spikes) {
    g.globalCompositeOperation = 'lighter';
    for (const [dx, dy] of [[1, 0], [0, 1]]) {
      const lg = g.createLinearGradient(m - dx * m, m - dy * m, m + dx * m, m + dy * m);
      lg.addColorStop(0, 'rgba(0, 0, 0, 0)');
      lg.addColorStop(0.5, color);
      lg.addColorStop(1, 'rgba(0, 0, 0, 0)');
      g.strokeStyle = lg;
      g.lineWidth = 1.2;
      g.globalAlpha = 0.7;
      g.beginPath();
      g.moveTo(m - dx * m, m - dy * m);
      g.lineTo(m + dx * m, m + dy * m);
      g.stroke();
    }
  }
  return c;
}

// Samanyolu ve nebula: sol alttan sağ üste uzanan toz bandı, üzerinde yumuşak renk bulutları.
function buildSky(width, height, dpr, colors) {
  const w = width + SKY_PAD * 2;
  const h = height + SKY_PAD * 2;
  const c = document.createElement('canvas');
  c.width = Math.round(w * dpr);
  c.height = Math.round(h * dpr);
  const g = c.getContext('2d');
  g.scale(dpr, dpr);

  // Bandın ekseni: sol alt köşeden sağ üste
  const ax = -w * 0.05;
  const ay = h * 0.95;
  const bx = w * 1.05;
  const by = h * 0.1;
  const len = Math.hypot(bx - ax, by - ay);
  const ux = (bx - ax) / len;
  const uy = (by - ay) / len;
  const nx = -uy;
  const ny = ux;
  const bandWidth = Math.min(w, h) * 0.22;

  // Nebula bulutları
  g.globalCompositeOperation = 'lighter';
  const cloudColors = [colors.accent, colors.mint, colors.amber, colors.mint, colors.accent];
  for (let i = 0; i < 14; i += 1) {
    const t = Math.random();
    const off = gaussian() * bandWidth * 0.6;
    const x = ax + ux * len * t + nx * off;
    const y = ay + uy * len * t + ny * off;
    const r = bandWidth * (0.6 + Math.random() * 1.1);
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    const col = cloudColors[i % cloudColors.length];
    grad.addColorStop(0, rgba(col, 0.1 + Math.random() * 0.1));
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    g.fillStyle = grad;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Bandın içindeki karanlık toz şeritleri: bulutların üzerine yumuşak gölge
  g.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 9; i += 1) {
    const t = Math.random();
    const off = gaussian() * bandWidth * 0.25;
    const x = ax + ux * len * t + nx * off;
    const y = ay + uy * len * t + ny * off;
    const r = bandWidth * (0.3 + Math.random() * 0.5);
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, rgba(colors.band, 0.55));
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    g.fillStyle = grad;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Toz yıldızlar: bandın çevresinde yoğunlaşan çok sayıda sönük nokta
  const dust = Math.round((w * h) / 380);
  for (let i = 0; i < dust; i += 1) {
    const t = Math.random();
    const inBand = Math.random() < 0.75;
    const off = inBand ? gaussian() * bandWidth * 0.55 : (Math.random() - 0.5) * h * 2;
    const x = ax + ux * len * t + nx * off;
    const y = ay + uy * len * t + ny * off;
    if (x < 0 || y < 0 || x > w || y > h) continue;
    g.globalAlpha = inBand ? 0.12 + Math.random() * 0.4 : 0.08 + Math.random() * 0.2;
    g.fillStyle = Math.random() < 0.15 ? colors.mint : colors.star;
    const size = Math.random() < 0.9 ? 0.6 : 1;
    g.fillRect(x, y, size, size);
  }
  g.globalAlpha = 1;
  return c;
}

function buildStars(width, height) {
  const density = (width * height) / 4200;
  const stars = [];
  for (let i = 0; i < density; i += 1) {
    const layer = Math.random() < 0.6 ? 0 : Math.random() < 0.75 ? 1 : 2;
    const roll = Math.random();
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      layer,
      r: [0.6, 1, 1.5][layer] * (0.7 + Math.random() * 0.6),
      base: [0.35, 0.55, 0.85][layer] * (0.6 + Math.random() * 0.4),
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.4,
      // 0: beyazımsı, 1: nane, 2: sıcak (kehribar)
      tint: roll < 0.72 ? 0 : roll < 0.88 ? 1 : 2,
      glow: 0,
    });
  }
  // Az sayıda öne çıkan parlak yıldız: hale ve kırınım çizgileriyle çizilir.
  const bright = Math.max(6, Math.round((width * height) / 90000));
  for (let i = 0; i < bright; i += 1) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      layer: 2,
      r: 1.6,
      base: 0.9,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.8,
      tint: Math.random() < 0.6 ? 0 : Math.random() < 0.5 ? 1 : 2,
      glow: 0,
      sprite: 10 + Math.random() * 16,
    });
  }
  return stars;
}

export default function Starfield({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const palette = {
      star: readToken('--color-on-band'),
      mint: readToken('--color-band-accent'),
      accent: readToken('--color-accent'),
      amber: readToken('--planet-amber-hi'),
      band: readToken('--color-band'),
    };
    const tints = [palette.star, palette.mint, palette.amber];
    const sprites = tints.map((col) => makeSprite(col, true));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let stars = [];
    let sky = null;
    let rafId = 0;
    let visible = true;
    let time = 0;
    let shooting = null;
    // Fare: hedef konum ve yumuşatılmış konum (paralaks sarsıntısız olsun diye).
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, px: -9999, py: -9999, active: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = buildStars(width, height);
      sky = buildSky(width, height, dpr, palette);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      // Samanyolu ve nebula: en arkada, en yavaş kayan katman
      if (sky) {
        ctx.drawImage(
          sky,
          -SKY_PAD - pointer.x * 3,
          -SKY_PAD - pointer.y * 3,
          width + SKY_PAD * 2,
          height + SKY_PAD * 2
        );
      }

      const near = [];
      const r2 = LINK_RADIUS * LINK_RADIUS;

      for (const s of stars) {
        const shift = PARALLAX[s.layer];
        const x = s.x - pointer.x * shift;
        const y = s.y - pointer.y * shift;
        const twinkle = reduceMotion ? 1 : 0.65 + 0.35 * Math.sin(time * s.speed + s.phase);

        // İmlece yakın yıldızlar parlar, uzaklaşınca yavaşça söner.
        let target = 0;
        if (pointer.active) {
          const dx = x - pointer.px;
          const dy = y - pointer.py;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2) {
            target = 1 - Math.sqrt(d2) / LINK_RADIUS;
            near.push({ x, y, k: target });
          }
        }
        s.glow += (target - s.glow) * 0.12;

        if (s.sprite) {
          const size = s.sprite * (0.85 + 0.25 * twinkle) * (1 + s.glow * 0.5);
          ctx.globalAlpha = Math.min(1, s.base * twinkle + s.glow * 0.4);
          ctx.drawImage(sprites[s.tint], x - size / 2, y - size / 2, size, size);
          continue;
        }

        ctx.globalAlpha = Math.min(1, s.base * twinkle + s.glow * 0.6);
        ctx.fillStyle = s.glow > 0.25 ? palette.mint : tints[s.tint];
        ctx.beginPath();
        ctx.arc(x, y, s.r * (1 + s.glow * 0.8), 0, Math.PI * 2);
        ctx.fill();
      }

      // Takımyıldız çizgileri: imlecin çevresindeki yakın yıldız çiftleri.
      if (near.length > 1) {
        ctx.strokeStyle = palette.mint;
        ctx.lineWidth = 0.8;
        for (let i = 0; i < near.length; i += 1) {
          for (let j = i + 1; j < near.length; j += 1) {
            const a = near[i];
            const b = near[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < LINK_DISTANCE) {
              ctx.globalAlpha = Math.min(1, (1 - d / LINK_DISTANCE) * Math.min(a.k, b.k) * 1.6);
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // Kayan yıldız: birkaç saniyede bir, rastgele bir açıdan; başında parlak bir çekirdek.
      if (!reduceMotion) {
        if (!shooting && Math.random() < 0.004) {
          shooting = {
            x: Math.random() * width * 0.8,
            y: Math.random() * height * 0.4,
            vx: 7 + Math.random() * 4,
            vy: 2.5 + Math.random() * 2,
            life: 1,
          };
        }
        if (shooting) {
          const tail = 16;
          const tx = shooting.x - shooting.vx * tail;
          const ty = shooting.y - shooting.vy * tail;
          const grad = ctx.createLinearGradient(shooting.x, shooting.y, tx, ty);
          grad.addColorStop(0, palette.star);
          grad.addColorStop(0.3, rgba(palette.mint, 0.6));
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.globalAlpha = shooting.life;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(shooting.x, shooting.y);
          ctx.lineTo(tx, ty);
          ctx.stroke();
          ctx.drawImage(sprites[0], shooting.x - 7, shooting.y - 7, 14, 14);
          shooting.x += shooting.vx;
          shooting.y += shooting.vy;
          shooting.life -= 0.018;
          if (shooting.life <= 0 || shooting.x > width + 100) shooting = null;
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      time += 0.016;
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

    // Canvas metnin arkasında; olayları pencereden dinliyoruz.
    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointer.px = x;
      pointer.py = y;
      // -0.5 ... 0.5 aralığında normalize konum: paralaks yönü
      pointer.tx = x / rect.width - 0.5;
      pointer.ty = y / rect.height - 0.5;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.tx = 0;
      pointer.ty = 0;
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
