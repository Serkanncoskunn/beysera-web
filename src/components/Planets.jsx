import { useEffect, useRef, useState } from 'react';
import { Hand } from 'lucide-react';

// Hero'daki fırlatılabilir gezegenler.
//
// Görünüm: her gezegenin yüzeyi açılışta prosedürel gürültüyle bir kez üretilir (gaz devlerinde
// bulut bantları ve girdaplar, kehribar gezegende fırtına lekesi, ayda kraterler). Doku yatayda
// kesintisiz tekrar eder; gezegen "dönerken" ışık sabit kalır, yüzey altından akar.
// Işık katmanı: sol üstten gelen güneş, sağ altta gece tarafı, kenarda atmosfer ışıltısı.
//
// Etkileşim: basılı tutup sürükleyin, bırakınca son hareket hızıyla fırlar. Kapağın kenarlarından
// ve [data-planet-obstacle] işaretli öğelerden (WhatsApp kartı) seker, birbirine çarpar,
// uzay boşluğunda yavaşça durur. Yazıların arkasından geçer ama oradayken de tutulabilir.
//
// Fizik React render'ı dışında, requestAnimationFrame ile doğrudan transform üzerinden çalışır.
// Döngü yalnızca kapak ekrandayken ve sekme açıkken döner. "Azaltılmış hareket" tercihinde
// gezegenler yine sürüklenebilir ama fırlatma ataleti, dönme ve süzülme kapalıdır.
// Renkler index.css'teki --planet-* değişkenlerinden gelir.

const PLANETS = [
  // x, y: kapak alanına göre başlangıç konumu (0-1). size: px çap (masaüstü).
  // mx: telefonda yatay konum; telefonda hepsi kartın altındaki boş şeritte başlar.
  { id: 'ringed', size: 132, x: 0.6, y: 0.17, mx: 0.74, tone: 'mint', kind: 'gas', ring: true, seed: 11, bands: 7 },
  { id: 'giant', size: 108, x: 0.07, y: 0.8, mx: 0.16, tone: 'petrol', kind: 'gas', seed: 23, bands: 11 },
  { id: 'ember', size: 70, x: 0.93, y: 0.84, mx: 0.44, tone: 'amber', kind: 'gas', storm: true, seed: 37, bands: 9 },
  { id: 'moon', size: 44, x: 0.47, y: 0.9, mx: 0.93, tone: 'moon', kind: 'rock', seed: 51 },
];

const MOBILE = 640; // px: bu genişliğin altında telefon yerleşimi
const RING_SCALE = 180 / 100; // halkalı gezegenin kutusu, gövdenin bu katı
const BOUNCE = 0.82; // çarpışmada korunan hız oranı
const FRICTION = 0.994; // her karede kalan hız (uzayda sürtünme çok az)
const MAX_SPEED = 42; // px/kare
const THROW_BOOST = 1.15; // fırlatmayı biraz daha tatmin edici yapar
const TEX_W = 512; // doku çözünürlüğü (yatayda tekrar eder)
const TEX_H = 256;

// ---------- Prosedürel doku ----------

const readToken = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// Tohumlu rastgele sayı: her açılışta aynı gezegen aynı görünür.
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Yatayda periyodik değer gürültüsü + fBm: doku kenarları dikişsiz birleşir.
function makeFbm(seed, octaves = 5, period = 8) {
  const rand = mulberry32(seed);
  const layers = [];
  for (let o = 0; o < octaves; o += 1) {
    const w = period * 2 ** o;
    const h = 8 * 2 ** o + 2;
    const grid = new Float32Array(w * h);
    for (let i = 0; i < grid.length; i += 1) grid[i] = rand();
    layers.push({ w, h, grid, f: 2 ** o });
  }
  const smooth = (t) => t * t * (3 - 2 * t);
  const sample = ({ w, h, grid }, x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = smooth(x - xi);
    const yf = smooth(y - yi);
    const x0 = ((xi % w) + w) % w;
    const x1 = (x0 + 1) % w;
    const y0 = Math.min(Math.max(yi, 0), h - 1);
    const y1 = Math.min(y0 + 1, h - 1);
    const a = grid[y0 * w + x0];
    const b = grid[y0 * w + x1];
    const c = grid[y1 * w + x0];
    const d = grid[y1 * w + x1];
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
  // u, v: 0-1 aralığında doku koordinatı
  return (u, v) => {
    let sum = 0;
    let amp = 0.5;
    let norm = 0;
    for (const L of layers) {
      sum += sample(L, u * period * L.f, v * 8 * L.f) * amp;
      norm += amp;
      amp *= 0.5;
    }
    return sum / norm;
  };
}

function paintTexture(planet) {
  const canvas = document.createElement('canvas');
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(TEX_W, TEX_H);
  const data = img.data;

  const hi = hexToRgb(readToken(`--planet-${planet.tone}-hi`));
  const mid = hexToRgb(readToken(`--planet-${planet.tone}`));
  const lo = hexToRgb(readToken(`--planet-${planet.tone}-lo`));
  const fbm = makeFbm(planet.seed);
  const detail = makeFbm(planet.seed + 7, 4, 16);
  const rand = mulberry32(planet.seed + 99);

  // Ay için kraterler: konum, yarıçap (doku pikseli)
  const craters = [];
  if (planet.kind === 'rock') {
    for (let i = 0; i < 38; i += 1) {
      const big = i < 6;
      craters.push({
        x: rand() * TEX_W,
        y: TEX_H * (0.12 + rand() * 0.76),
        r: big ? 14 + rand() * 18 : 3 + rand() * 8,
      });
    }
  }

  for (let y = 0; y < TEX_H; y += 1) {
    const v = y / TEX_H;
    for (let x = 0; x < TEX_W; x += 1) {
      const u = x / TEX_W;
      let col;

      if (planet.kind === 'gas') {
        // Bulut bantları: enleme göre sinüs, gürültüyle bükülür (türbülans).
        const warp = fbm(u, v) * 2.4;
        const band = Math.sin((v * planet.bands + warp) * Math.PI);
        const fine = detail(u, v) - 0.5;
        let t = 0.5 + 0.38 * band + fine * 0.35;
        // Kutuplara doğru renk koyulaşır
        const pole = Math.abs(v - 0.5) * 2;
        t -= pole ** 3 * 0.35;
        t = Math.min(Math.max(t, 0), 1);
        col = t < 0.5 ? mix(lo, mid, t * 2) : mix(mid, hi, (t - 0.5) * 2);

        // Fırtına lekesi: oval, içinde dönen halkalar
        if (planet.storm) {
          const sx = (u - 0.3) / 0.11;
          const sy = (v - 0.62) / 0.07;
          const d = Math.sqrt(sx * sx + sy * sy);
          if (d < 1.25) {
            const swirl = Math.sin(d * 9 - Math.atan2(sy, sx) * 2 + fine * 4) * 0.5 + 0.5;
            const k = (1 - Math.min(d / 1.25, 1)) ** 1.4;
            const storm = mix(lo, mix(mid, hi, 0.35), swirl);
            col = mix(col, storm, k * 0.85);
          }
        }
      } else {
        // Kayalık yüzey: lekeli bazalt düzlükleri ve aydınlık yaylalar
        const n = fbm(u, v);
        const maria = n < 0.45 ? 0.35 : 0;
        let t = 0.25 + n * 0.75 - maria + (detail(u, v) - 0.5) * 0.25;
        for (const c of craters) {
          let dx = Math.abs(x - c.x);
          dx = Math.min(dx, TEX_W - dx);
          const dy = y - c.y;
          const d = Math.sqrt(dx * dx + dy * dy) / c.r;
          if (d < 1.25) {
            if (d < 0.85) t -= 0.22 * (1 - d / 0.85); // çanak
            else if (d < 1.05) t += dy < 0 ? 0.18 : -0.08; // aydınlık / gölgeli kenar
            else t += 0.05 * (1.25 - d) * 4; // fırlatılmış toz
          }
        }
        t = Math.min(Math.max(t, 0), 1);
        col = t < 0.5 ? mix(lo, mid, t * 2) : mix(mid, hi, (t - 0.5) * 2);
      }

      const i = (y * TEX_W + x) * 4;
      data[i] = col[0];
      data[i + 1] = col[1];
      data[i + 2] = col[2];
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL('image/webp', 0.9);
}

// ---------- Halka ----------

// Çok katmanlı halka: farklı yoğunlukta şeritler ve aralarında boşluklar (Cassini aralığı gibi).
const RING_BANDS = [
  { r: 58, w: 3, o: 0.35, tone: 'mint' },
  { r: 63, w: 5, o: 0.6, tone: 'mint-hi' },
  { r: 69, w: 4, o: 0.85, tone: 'mint' },
  { r: 73.5, w: 1.5, o: 0.25, tone: 'mint-hi' },
  { r: 78, w: 5, o: 0.7, tone: 'mint-hi' },
  { r: 83, w: 2, o: 0.4, tone: 'mint' },
];

function Ring({ half }) {
  // half: 'back' gezegenin arkasında kalan üst yarı, 'front' önünden geçen alt yarı
  const sweep = half === 'back' ? 1 : 0;
  return (
    <svg viewBox="-90 -90 180 180" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <g transform="rotate(-18)">
        {RING_BANDS.map((b) => (
          <path
            key={b.r}
            d={`M ${-b.r} 0 A ${b.r} ${b.r * 0.24} 0 0 ${sweep} ${b.r} 0`}
            fill="none"
            style={{ stroke: `var(--planet-${b.tone})` }}
            strokeWidth={b.w}
            opacity={half === 'back' ? b.o * 0.55 : b.o}
          />
        ))}
      </g>
    </svg>
  );
}

// ---------- Bileşen ----------

export default function Planets({ hint }) {
  const layerRef = useRef(null);
  const nodeRefs = useRef({});
  const surfaceRefs = useRef({});
  const [thrown, setThrown] = useState(false);
  const [textures, setTextures] = useState({});

  // Dokular ilk boyamayı geciktirmesin diye tarayıcı boşa çıkınca üretilir.
  useEffect(() => {
    const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 60));
    const cancel = window.cancelIdleCallback || window.clearTimeout;
    const handle = idle(() => {
      const out = {};
      for (const p of PLANETS) out[p.id] = paintTexture(p);
      setTextures(out);
    });
    return () => cancel(handle);
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = layer.parentElement;

    let width = layer.clientWidth;
    let height = layer.clientHeight;
    const scaleFor = (w) => (w < MOBILE ? 0.5 : w < 1024 ? 0.8 : 1);
    const phone = width < MOBILE;

    // Engeller: kapakta [data-planet-obstacle] işaretli öğelerin katmana göre dikdörtgenleri.
    let obstacles = [];
    const measureObstacles = () => {
      const base = layer.getBoundingClientRect();
      obstacles = [...hero.querySelectorAll('[data-planet-obstacle]')].map((el) => {
        const r = el.getBoundingClientRect();
        return { l: r.left - base.left, t: r.top - base.top, r: r.right - base.left, b: r.bottom - base.top };
      });
    };

    // Daireyi dikdörtgenin dışına it; hareket ediyorsa hızını yüzeyden yansıt.
    const resolveObstacles = (b) => {
      for (const o of obstacles) {
        const cx = Math.min(Math.max(b.x, o.l), o.r);
        const cy = Math.min(Math.max(b.y, o.t), o.b);
        const ox = b.x - cx;
        const oy = b.y - cy;
        const dist = Math.hypot(ox, oy);
        if (dist >= b.r) continue;
        let nx;
        let ny;
        if (dist === 0) {
          // Merkez kutunun içinde: en kısa kenardan dışarı çık
          const pens = [b.x - o.l, o.r - b.x, b.y - o.t, o.b - b.y];
          const m = pens.indexOf(Math.min(...pens));
          nx = [-1, 1, 0, 0][m];
          ny = [0, 0, -1, 1][m];
          b.x = [o.l - b.r, o.r + b.r, b.x, b.x][m];
          b.y = [b.y, b.y, o.t - b.r, o.b + b.r][m];
        } else {
          nx = ox / dist;
          ny = oy / dist;
          b.x = cx + nx * b.r;
          b.y = cy + ny * b.r;
        }
        const vn = b.vx * nx + b.vy * ny;
        if (vn < 0) {
          b.vx -= (1 + BOUNCE) * vn * nx;
          b.vy -= (1 + BOUNCE) * vn * ny;
        }
      }
    };

    const clampToLayer = (b) => {
      if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * BOUNCE; }
      if (b.x + b.r > width) { b.x = width - b.r; b.vx = -Math.abs(b.vx) * BOUNCE; }
      if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy) * BOUNCE; }
      if (b.y + b.r > height) { b.y = height - b.r; b.vy = -Math.abs(b.vy) * BOUNCE; }
    };

    const bodies = PLANETS.map((p, i) => ({
      ...p,
      r: (p.size * scaleFor(width)) / 2,
      x: (phone ? p.mx : p.x) * width,
      // Telefonda metin ve kart tüm genişliği kaplar; gezegenler alttaki boş şeritte başlar.
      y: phone ? height - 52 : p.y * height,
      vx: 0,
      vy: 0,
      spin: i * 137, // px: dokunun yatay kayması
      phase: i * 1.7,
      dragging: false,
      history: [],
      grabDx: 0,
      grabDy: 0,
      pointerId: null,
    }));

    let rafId = 0;
    let visible = true;
    let time = 0;
    let frame = 0;

    const render = () => {
      for (const b of bodies) {
        const el = nodeRefs.current[b.id];
        if (!el) continue;
        const resting = !b.dragging && Math.hypot(b.vx, b.vy) < 0.4;
        // Durgun gezegenler hafifçe süzülür; hareket eden ya da tutulan gezegen süzülmez.
        const bob = resting && !reduceMotion ? Math.sin(time * 0.9 + b.phase) * 4 : 0;
        const box = (b.ring ? RING_SCALE : 1) * b.r * 2;
        el.style.width = `${box}px`;
        el.style.height = `${box}px`;
        el.style.transform = `translate3d(${b.x - box / 2}px, ${b.y - box / 2 + bob}px, 0)`;
        const surface = surfaceRefs.current[b.id];
        // Doku gövdenin iki katı genişlikte; kaydıkça gezegen dönüyor görünür.
        if (surface) surface.style.backgroundPosition = `${b.spin % (b.r * 4)}px 0`;
      }
    };

    const step = () => {
      time += 0.016;
      frame += 1;
      if (frame % 30 === 0) measureObstacles();
      for (const b of bodies) {
        if (b.dragging) continue;
        b.vx *= FRICTION;
        b.vy *= FRICTION;
        b.x += b.vx;
        b.y += b.vy;
        // Kendi ekseninde yavaş dönüş + fırlatma yönünde ek dönme
        b.spin += 0.12 + b.vx * 0.5;
        clampToLayer(b);
        resolveObstacles(b);
      }

      // Gezegenler arası çarpışma: kütle alanla orantılı, esnek çarpışma.
      for (let i = 0; i < bodies.length; i += 1) {
        for (let j = i + 1; j < bodies.length; j += 1) {
          const a = bodies[i];
          const c = bodies[j];
          const dx = c.x - a.x;
          const dy = c.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.01;
          const min = a.r + c.r;
          if (dist >= min) continue;
          const nx = dx / dist;
          const ny = dy / dist;
          const ma = a.dragging ? 1e6 : a.r * a.r;
          const mc = c.dragging ? 1e6 : c.r * c.r;
          const overlap = min - dist;
          // Üst üste binmeyi kütleye göre ayır
          a.x -= nx * overlap * (mc / (ma + mc));
          a.y -= ny * overlap * (mc / (ma + mc));
          c.x += nx * overlap * (ma / (ma + mc));
          c.y += ny * overlap * (ma / (ma + mc));
          const rel = (a.vx - c.vx) * nx + (a.vy - c.vy) * ny;
          if (rel <= 0) continue;
          const impulse = ((2 * rel) / (ma + mc)) * BOUNCE;
          if (!a.dragging) { a.vx -= impulse * mc * nx; a.vy -= impulse * mc * ny; }
          if (!c.dragging) { c.vx += impulse * ma * nx; c.vy += impulse * ma * ny; }
        }
      }
      render();
    };

    const loop = () => {
      step();
      rafId = window.requestAnimationFrame(loop);
    };
    const start = () => {
      if (rafId || !visible || document.hidden) return;
      rafId = window.requestAnimationFrame(loop);
    };
    const stop = () => {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    };

    // Sürükle ve fırlat. Olayları gövde (daire) yakalar; halkanın boş köşeleri tıklamayı geçirir.
    const local = (e) => {
      const rect = layer.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handlers = bodies.map((b) => {
      const el = nodeRefs.current[b.id];
      const grip = el.querySelector('.planet-body');
      const down = (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        e.preventDefault();
        const p = local(e);
        b.dragging = true;
        b.pointerId = e.pointerId;
        b.grabDx = b.x - p.x;
        b.grabDy = b.y - p.y;
        b.vx = 0;
        b.vy = 0;
        b.history = [{ ...p, t: performance.now() }];
        grip.setPointerCapture?.(e.pointerId);
        el.dataset.dragging = 'true';
        measureObstacles();
        start();
      };
      const move = (e) => {
        if (!b.dragging || e.pointerId !== b.pointerId) return;
        const p = local(e);
        const prevX = b.x;
        b.x = Math.min(Math.max(p.x + b.grabDx, b.r), width - b.r);
        b.y = Math.min(Math.max(p.y + b.grabDy, b.r), height - b.r);
        // Tutulan gezegen de kartın içine giremez, kenarında kayar.
        resolveObstacles(b);
        if (!reduceMotion) b.spin += (b.x - prevX) * 0.5;
        const now = performance.now();
        b.history.push({ ...p, t: now });
        // Son 90 ms'lik hareket fırlatma hızını belirler.
        while (b.history.length > 2 && now - b.history[0].t > 90) b.history.shift();
        if (reduceMotion) render();
      };
      const up = (e) => {
        if (!b.dragging || e.pointerId !== b.pointerId) return;
        b.dragging = false;
        el.dataset.dragging = 'false';
        const h = b.history;
        // Bırakmadan önce bir süre hareketsiz tutulduysa fırlatma yok, olduğu yerde kalır.
        const heldStill = h.length > 0 && performance.now() - h[h.length - 1].t > 70;
        if (!reduceMotion && h.length > 1 && !heldStill) {
          const first = h[0];
          const last = h[h.length - 1];
          const dt = Math.max(last.t - first.t, 1) / 16.67; // kare cinsinden
          let vx = ((last.x - first.x) / dt) * THROW_BOOST;
          let vy = ((last.y - first.y) / dt) * THROW_BOOST;
          const speed = Math.hypot(vx, vy);
          if (speed > MAX_SPEED) {
            vx = (vx / speed) * MAX_SPEED;
            vy = (vy / speed) * MAX_SPEED;
          }
          b.vx = vx;
          b.vy = vy;
          if (speed > 3) setThrown(true);
        }
        render();
      };
      grip.addEventListener('pointerdown', down);
      grip.addEventListener('pointermove', move);
      grip.addEventListener('pointerup', up);
      grip.addEventListener('pointercancel', up);
      return () => {
        grip.removeEventListener('pointerdown', down);
        grip.removeEventListener('pointermove', move);
        grip.removeEventListener('pointerup', up);
        grip.removeEventListener('pointercancel', up);
      };
    });

    const resizeObserver = new ResizeObserver(() => {
      const nw = layer.clientWidth;
      const nh = layer.clientHeight;
      const s = scaleFor(nw);
      for (const b of bodies) {
        // Konumu oransal koru, boyutu ekran genişliğine göre ayarla
        b.x = width ? (b.x / width) * nw : b.x;
        b.y = height ? (b.y / height) * nh : b.y;
        b.r = (b.size * s) / 2;
      }
      width = nw;
      height = nh;
      measureObstacles();
      for (const b of bodies) {
        clampToLayer(b);
        resolveObstacles(b);
      }
      render();
    });
    resizeObserver.observe(layer);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduceMotion) start();
      else stop();
    });
    intersection.observe(layer);
    const onVisibility = () => (document.hidden ? stop() : !reduceMotion && start());
    document.addEventListener('visibilitychange', onVisibility);

    measureObstacles();
    for (const b of bodies) resolveObstacles(b);
    render();
    if (!reduceMotion) start();

    return () => {
      stop();
      handlers.forEach((off) => off());
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PLANETS.map((p) => (
        <div
          key={p.id}
          ref={(el) => { nodeRefs.current[p.id] = el; }}
          className="planet absolute left-0 top-0 select-none will-change-transform"
        >
          {p.ring && <Ring half="back" />}
          <div
            className={`planet-body pointer-events-auto absolute cursor-grab touch-none overflow-hidden rounded-full ${p.ring ? 'inset-[22.2%]' : 'inset-0'}`}
          >
            {/* Yüzey dokusu: yatayda kayarak dönme hissi verir */}
            <div
              ref={(el) => { surfaceRefs.current[p.id] = el; }}
              className="absolute inset-0 bg-repeat-x"
              style={{
                backgroundImage: textures[p.id] ? `url(${textures[p.id]})` : undefined,
                backgroundColor: `var(--planet-${p.tone})`,
                backgroundSize: '200% 100%',
              }}
            ></div>
            {/* Sabit ışık: güneş sol üstte */}
            <div className="planet-light absolute inset-0 rounded-full"></div>
          </div>
          {p.ring && <Ring half="front" />}
        </div>
      ))}
      {hint && (
        <p
          className={`pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-band-line bg-band/70 px-3.5 py-1.5 text-xs text-on-band-muted backdrop-blur-sm transition-opacity duration-700 sm:flex ${thrown ? 'opacity-0' : 'opacity-100'}`}
        >
          <Hand className="h-3.5 w-3.5" aria-hidden="true" />
          {hint}
        </p>
      )}
    </div>
  );
}
