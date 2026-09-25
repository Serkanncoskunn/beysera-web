import React, { useRef, useEffect, useCallback } from 'react';

/**
 * High Performance HTML5 2D Canvas Engine for Tuğla Dünyası Studio
 */
export default function StudioCanvas({
  surface,
  primaryProduct,
  pattern,
  rotation = 0,
  mortar,
  mortarWidth,
  scale = 1,
  zone,
  isMixActive = false,
  mixProducts = [],
  zoom = 1,
  pan = { x: 0, y: 0 },
  showGrid = false,
  onCanvasReady
}) {
  const canvasRef = useRef(null);
  const textureCacheRef = useRef(new Map());

  // Helper to load or fetch image from cache
  const getTextureImage = useCallback((url) => {
    if (!url) return null;
    if (textureCacheRef.current.has(url)) {
      return textureCacheRef.current.get(url);
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      textureCacheRef.current.set(url, img);
      renderScene();
    };
    textureCacheRef.current.set(url, img);
    return img;
  }, []);

  // Helper: Draw a single brick with realistic lighting, bevel, and texture offset
  const drawBrick = (ctx, x, y, width, height, baseColor, textureImg, seed = 1) => {
    ctx.save();
    
    // Draw real texture or procedural fallback
    if (textureImg && textureImg.complete && textureImg.naturalWidth > 0) {
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.clip();
      
      const sOffset = (seed * 53) % (Math.max(1, textureImg.naturalWidth - 40));
      ctx.drawImage(
        textureImg,
        sOffset,
        0,
        textureImg.naturalWidth - sOffset,
        textureImg.naturalHeight,
        x,
        y,
        width,
        height
      );

      // Ambient 3D surface bevel
      const bevel = ctx.createLinearGradient(x, y, x, y + height);
      bevel.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
      bevel.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
      bevel.addColorStop(1, 'rgba(0, 0, 0, 0.32)');
      ctx.fillStyle = bevel;
      ctx.fillRect(x, y, width, height);
    } else {
      ctx.fillStyle = baseColor || '#9E3824';
      ctx.fillRect(x, y, width, height);

      // Micro tone variation
      const jitter = ((seed % 10) - 5) * 2;
      ctx.fillStyle = jitter > 0 ? `rgba(255, 255, 255, ${jitter * 0.02})` : `rgba(0, 0, 0, ${Math.abs(jitter) * 0.03})`;
      ctx.fillRect(x, y, width, height);

      // Procedural clay porosity grain
      const grain = ctx.createLinearGradient(x, y, x + width, y + height);
      grain.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
      grain.addColorStop(0.5, 'rgba(0, 0, 0, 0.05)');
      grain.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
      ctx.fillStyle = grain;
      ctx.fillRect(x, y, width, height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);
    }

    ctx.restore();
  };

  // Helper: Generate offscreen pattern canvas
  const generatePatternCanvas = useCallback(() => {
    const offCanvas = document.createElement('canvas');
    const width = 1400;
    const height = 1000;
    offCanvas.width = width;
    offCanvas.height = height;
    const ctx = offCanvas.getContext('2d');

    // 1. Mortar background
    ctx.fillStyle = mortar?.hex || '#C4BDB7';
    ctx.fillRect(0, 0, width, height);

    // Mortar texture noise
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    for (let i = 0; i < 500; i++) {
      const rx = (i * 137.5) % width;
      const ry = (i * 293.7) % height;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // Brick unit size calculation
    const baseW = Math.round(92 * scale);
    const baseH = Math.round(32 * scale);
    const gw = Math.max(3, Math.round((mortarWidth?.id || 10) * (scale * 0.4)));

    // Deterministic product selector for MIX
    const pickMixProduct = (r, c) => {
      if (!isMixActive || !mixProducts || mixProducts.length === 0) {
        return {
          color: primaryProduct?.colorHex || '#A63A22',
          img: getTextureImage(primaryProduct?.studioImg)
        };
      }
      if (mixProducts.length === 1) {
        return {
          color: mixProducts[0].product?.colorHex || '#A63A22',
          img: getTextureImage(mixProducts[0].product?.studioImg)
        };
      }

      const hash = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 100;
      let acc = 0;
      for (const item of mixProducts) {
        acc += item.percentage;
        if (hash <= acc) {
          return {
            color: item.product?.colorHex || '#A63A22',
            img: getTextureImage(item.product?.studioImg)
          };
        }
      }
      return {
        color: mixProducts[0].product?.colorHex || '#A63A22',
        img: getTextureImage(mixProducts[0].product?.studioImg)
      };
    };

    let seed = 1;
    const patId = pattern?.id || 'stretcher';

    ctx.save();
    if (rotation === 90) {
      ctx.translate(width / 2, height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.translate(-height / 2, -width / 2);
    }

    if (patId === 'stretcher') {
      const stepX = baseW + gw;
      const stepY = baseH + gw;
      const rows = Math.ceil(height / stepY) + 3;
      const cols = Math.ceil(width / stepX) + 3;

      for (let r = -2; r < rows; r++) {
        const offset = (r % 2 === 0) ? 0 : -stepX / 2;
        for (let c = -2; c < cols; c++) {
          const bx = c * stepX + offset;
          const by = r * stepY;
          const pData = pickMixProduct(r, c);
          seed++;
          drawBrick(ctx, bx, by, baseW, baseH, pData.color, pData.img, seed);
        }
      }
    } else if (patId === 'stack') {
      const stepX = baseW + gw;
      const stepY = baseH + gw;
      const rows = Math.ceil(height / stepY) + 3;
      const cols = Math.ceil(width / stepX) + 3;

      for (let r = -2; r < rows; r++) {
        for (let c = -2; c < cols; c++) {
          const bx = c * stepX;
          const by = r * stepY;
          const pData = pickMixProduct(r, c);
          seed++;
          drawBrick(ctx, bx, by, baseW, baseH, pData.color, pData.img, seed);
        }
      }
    } else if (patId === 'soldier') {
      const vertW = baseH;
      const vertH = baseW;
      const stepX = vertW + gw;
      const stepY = vertH + gw;
      const rows = Math.ceil(height / stepY) + 3;
      const cols = Math.ceil(width / stepX) + 3;

      for (let r = -2; r < rows; r++) {
        for (let c = -2; c < cols; c++) {
          const bx = c * stepX;
          const by = r * stepY;
          const pData = pickMixProduct(r, c);
          seed++;
          drawBrick(ctx, bx, by, vertW, vertH, pData.color, pData.img, seed);
        }
      }
    } else if (patId === 'herringbone') {
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate((45 * Math.PI) / 180);
      ctx.translate(-width, -height);

      const hW = Math.round(baseW * 0.9);
      const hH = Math.round(baseH * 0.9);
      const step = hW + gw;

      for (let y = -height; y < height * 2.5; y += hW + hH + gw * 2) {
        for (let x = -width; x < width * 2.5; x += step) {
          seed++;
          const p1 = pickMixProduct(Math.round(y / 10), Math.round(x / 10));
          drawBrick(ctx, x, y, hW, hH, p1.color, p1.img, seed);

          seed++;
          const p2 = pickMixProduct(Math.round(y / 10) + 1, Math.round(x / 10) + 1);
          drawBrick(ctx, x + hW + gw, y, hH, hW, p2.color, p2.img, seed);
        }
      }
      ctx.restore();
    } else if (patId === 'flemish') {
      const stretcherW = baseW;
      const headerW = Math.round(baseW * 0.45);
      const stepY = baseH + gw;
      const unitW = stretcherW + gw + headerW + gw;
      const rows = Math.ceil(height / stepY) + 3;
      const cols = Math.ceil(width / unitW) + 3;

      for (let r = -2; r < rows; r++) {
        const offset = (r % 2 === 0) ? 0 : -unitW / 2;
        for (let c = -2; c < cols; c++) {
          const sx = c * unitW + offset;
          const by = r * stepY;

          const p1 = pickMixProduct(r, c * 2);
          seed++;
          drawBrick(ctx, sx, by, stretcherW, baseH, p1.color, p1.img, seed);

          const p2 = pickMixProduct(r, c * 2 + 1);
          seed++;
          drawBrick(ctx, sx + stretcherW + gw, by, headerW, baseH, p2.color, p2.img, seed);
        }
      }
    }

    ctx.restore();
    return offCanvas;
  }, [pattern, mortar, mortarWidth, scale, rotation, isMixActive, mixProducts, primaryProduct, getTextureImage]);

  // Main Render Scene
  const renderScene = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Generate Brick Pattern
    const patternCanvas = generatePatternCanvas();

    // Pan & Zoom Matrix
    ctx.save();
    ctx.translate(w / 2 + pan.x, h / 2 + pan.y);
    ctx.scale(zoom, zoom);
    ctx.translate(-w / 2, -h / 2);

    // 1. Sky & Atmosphere
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    sky.addColorStop(0, '#7BA4C6');
    sky.addColorStop(0.4, '#B3D2EB');
    sky.addColorStop(0.8, '#DCE7F2');
    sky.addColorStop(1, '#EDE8DF');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Sun radiance
    const sun = ctx.createRadialGradient(w * 0.85, h * 0.15, 10, w * 0.85, h * 0.15, 300);
    sun.addColorStop(0, 'rgba(255, 250, 230, 0.45)');
    sun.addColorStop(0.6, 'rgba(255, 240, 200, 0.12)');
    sun.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, w, h);

    // 2. Ground & Hardscape
    const ground = ctx.createLinearGradient(0, h * 0.65, 0, h);
    ground.addColorStop(0, '#3A4434');
    ground.addColorStop(0.08, '#262D22');
    ground.addColorStop(0.12, '#383532');
    ground.addColorStop(1, '#1A1918');
    ctx.fillStyle = ground;
    ctx.fillRect(0, h * 0.65, w, h * 0.35);

    // 3. Facade Cladding Surface with Architectural Masks
    ctx.save();
    const surfaceId = surface?.id || 'modern-villa';

    if (surfaceId === 'modern-villa') {
      ctx.beginPath();
      ctx.moveTo(w * 0.12, h * 0.72);
      ctx.lineTo(w * 0.12, h * 0.22);
      ctx.lineTo(w * 0.88, h * 0.18);
      ctx.lineTo(w * 0.88, h * 0.72);
      ctx.closePath();
      ctx.clip();

      const pat = ctx.createPattern(patternCanvas, 'repeat');
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, w, h);

      // Atmospheric Facade Gradient
      const wallShadow = ctx.createLinearGradient(w * 0.12, 0, w * 0.88, 0);
      wallShadow.addColorStop(0, 'rgba(0, 0, 0, 0.18)');
      wallShadow.addColorStop(0.3, 'rgba(255, 255, 255, 0.08)');
      wallShadow.addColorStop(0.8, 'rgba(255, 240, 200, 0.12)');
      wallShadow.addColorStop(1, 'rgba(0, 0, 0, 0.26)');
      ctx.fillStyle = wallShadow;
      ctx.fillRect(0, 0, w, h);

      // Cantilever roof shadow
      const roofShadow = ctx.createLinearGradient(0, h * 0.18, 0, h * 0.32);
      roofShadow.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
      roofShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = roofShadow;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();

      // Villa Architectural Overlays
      ctx.fillStyle = '#181716';
      ctx.beginPath();
      ctx.moveTo(w * 0.08, h * 0.22);
      ctx.lineTo(w * 0.92, h * 0.17);
      ctx.lineTo(w * 0.92, h * 0.19);
      ctx.lineTo(w * 0.08, h * 0.24);
      ctx.closePath();
      ctx.fill();

      // Glass Windows
      drawWindow(ctx, w * 0.22, h * 0.28, w * 0.32, h * 0.16);
      drawWindow(ctx, w * 0.60, h * 0.27, w * 0.22, h * 0.16);
      drawWindow(ctx, w * 0.38, h * 0.48, w * 0.44, h * 0.24, true);

      // Wood Entry Door
      ctx.fillStyle = '#422817';
      ctx.fillRect(w * 0.20, h * 0.50, w * 0.12, h * 0.22);
      ctx.fillStyle = '#22140A';
      ctx.fillRect(w * 0.195, h * 0.495, w * 0.13, h * 0.01);
      ctx.fillStyle = '#D4D4D4';
      ctx.fillRect(w * 0.295, h * 0.58, 4, h * 0.07);

      // Plinth Base
      ctx.fillStyle = '#22201E';
      ctx.fillRect(w * 0.10, h * 0.718, w * 0.80, h * 0.04);

    } else if (surfaceId === 'mustakil-konut') {
      ctx.beginPath();
      ctx.moveTo(w * 0.18, h * 0.72);
      ctx.lineTo(w * 0.18, h * 0.38);
      ctx.lineTo(w * 0.50, h * 0.16);
      ctx.lineTo(w * 0.82, h * 0.38);
      ctx.lineTo(w * 0.82, h * 0.72);
      ctx.closePath();
      ctx.clip();

      const pat = ctx.createPattern(patternCanvas, 'repeat');
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, w, h);

      const gableShadow = ctx.createLinearGradient(0, h * 0.16, 0, h * 0.40);
      gableShadow.addColorStop(0, 'rgba(0,0,0,0.5)');
      gableShadow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gableShadow;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();

      // Pitched Roof
      ctx.fillStyle = '#1D1C1B';
      ctx.beginPath();
      ctx.moveTo(w * 0.14, h * 0.39);
      ctx.lineTo(w * 0.50, h * 0.14);
      ctx.lineTo(w * 0.86, h * 0.39);
      ctx.lineTo(w * 0.84, h * 0.41);
      ctx.lineTo(w * 0.50, h * 0.17);
      ctx.lineTo(w * 0.16, h * 0.41);
      ctx.closePath();
      ctx.fill();

      drawWindow(ctx, w * 0.25, h * 0.44, w * 0.18, h * 0.16, false, '#F0EDE8');
      drawWindow(ctx, w * 0.57, h * 0.44, w * 0.18, h * 0.16, false, '#F0EDE8');

      // Round Attic Window
      ctx.fillStyle = '#181716';
      ctx.beginPath();
      ctx.arc(w * 0.50, h * 0.28, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Door Porch
      ctx.fillStyle = '#3E2E23';
      ctx.fillRect(w * 0.44, h * 0.54, w * 0.12, h * 0.18);

    } else if (surfaceId === 'loft-restaurant') {
      ctx.beginPath();
      ctx.rect(w * 0.05, h * 0.08, w * 0.90, h * 0.70);
      ctx.closePath();
      ctx.clip();

      const pat = ctx.createPattern(patternCanvas, 'repeat');
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, w, h);

      // Warm spotlights
      const spot1 = ctx.createRadialGradient(w * 0.30, h * 0.12, 10, w * 0.30, h * 0.45, 250);
      spot1.addColorStop(0, 'rgba(255, 210, 140, 0.45)');
      spot1.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
      ctx.fillStyle = spot1;
      ctx.fillRect(0, 0, w, h);

      const spot2 = ctx.createRadialGradient(w * 0.70, h * 0.12, 10, w * 0.70, h * 0.45, 250);
      spot2.addColorStop(0, 'rgba(255, 210, 140, 0.45)');
      spot2.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
      ctx.fillStyle = spot2;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();

      // Bar and pipes
      ctx.fillStyle = '#161616';
      ctx.fillRect(w * 0.05, h * 0.06, w * 0.90, 14);

      ctx.fillStyle = '#38221B';
      ctx.fillRect(w * 0.15, h * 0.62, w * 0.70, h * 0.18);
      ctx.fillStyle = '#523429';
      ctx.fillRect(w * 0.12, h * 0.60, w * 0.76, 12);

    } else if (surfaceId === 'fireplace-living') {
      ctx.beginPath();
      ctx.rect(w * 0.22, h * 0.10, w * 0.56, h * 0.68);
      ctx.closePath();
      ctx.clip();

      const pat = ctx.createPattern(patternCanvas, 'repeat');
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, w, h);

      const fireGlow = ctx.createRadialGradient(w * 0.50, h * 0.64, 20, w * 0.50, h * 0.55, 270);
      fireGlow.addColorStop(0, 'rgba(255, 120, 30, 0.45)');
      fireGlow.addColorStop(0.6, 'rgba(255, 180, 70, 0.12)');
      fireGlow.addColorStop(1, 'rgba(0, 0, 0, 0.38)');
      ctx.fillStyle = fireGlow;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();

      // Fireplace box
      ctx.fillStyle = '#121212';
      ctx.fillRect(w * 0.38, h * 0.52, w * 0.24, h * 0.22);
      ctx.strokeStyle = '#282828';
      ctx.lineWidth = 4;
      ctx.strokeRect(w * 0.38, h * 0.52, w * 0.24, h * 0.22);

      // Flames
      ctx.fillStyle = '#FF5722';
      ctx.beginPath();
      ctx.moveTo(w * 0.44, h * 0.72);
      ctx.quadraticCurveTo(w * 0.50, h * 0.56, w * 0.50, h * 0.60);
      ctx.quadraticCurveTo(w * 0.56, h * 0.72, w * 0.56, h * 0.72);
      ctx.fill();

      // Wood mantel
      ctx.fillStyle = '#4E342E';
      ctx.fillRect(w * 0.26, h * 0.46, w * 0.48, 18);

    } else if (surfaceId === 'garden-landscape') {
      ctx.beginPath();
      ctx.rect(w * 0.10, h * 0.34, w * 0.80, h * 0.38);
      ctx.closePath();
      ctx.clip();

      const pat = ctx.createPattern(patternCanvas, 'repeat');
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, w, h);

      const gardenSun = ctx.createLinearGradient(0, h * 0.34, 0, h * 0.72);
      gardenSun.addColorStop(0, 'rgba(255, 255, 240, 0.2)');
      gardenSun.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      ctx.fillStyle = gardenSun;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();

      // Stone Cap
      ctx.fillStyle = '#D2CCC4';
      ctx.fillRect(w * 0.08, h * 0.32, w * 0.84, 16);

      // Green foliage overhang
      ctx.fillStyle = '#2D591E';
      for (let i = 0; i < 18; i++) {
        const fx = w * 0.12 + (i * w * 0.042);
        const fy = h * 0.32 + Math.sin(i * 1.5) * 8;
        ctx.beginPath();
        ctx.arc(fx, fy, 14, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (surfaceId === 'commercial-plaza') {
      ctx.beginPath();
      ctx.rect(w * 0.10, h * 0.12, w * 0.80, h * 0.62);
      ctx.closePath();
      ctx.clip();

      const pat = ctx.createPattern(patternCanvas, 'repeat');
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, w, h);

      const commShadow = ctx.createLinearGradient(w * 0.10, 0, w * 0.90, 0);
      commShadow.addColorStop(0, 'rgba(0,0,0,0.18)');
      commShadow.addColorStop(0.5, 'rgba(255,255,255,0.06)');
      commShadow.addColorStop(1, 'rgba(0,0,0,0.24)');
      ctx.fillStyle = commShadow;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();

      drawWindow(ctx, w * 0.18, h * 0.44, w * 0.64, h * 0.30, true);

      // Commercial Signage Band
      ctx.fillStyle = '#141312';
      ctx.fillRect(w * 0.15, h * 0.36, w * 0.70, h * 0.07);
      ctx.fillStyle = '#FAF8F5';
      ctx.font = 'bold 18px "Outfit", "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TUĞLA DÜNYASI ARCHITECTURAL STUDIO', w * 0.50, h * 0.405);
    }

    // Grid Overlay
    if (showGrid) {
      ctx.strokeStyle = 'rgba(224, 90, 48, 0.22)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 50) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += 50) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
      }
    }

    ctx.restore();

    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [surface, generatePatternCanvas, zoom, pan, showGrid, onCanvasReady]);

  // Window helper
  const drawWindow = (ctx, x, y, width, height, isPortal = false, frameColor = '#141414') => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(x - 3, y - 3, width + 6, height + 6);

    ctx.fillStyle = frameColor;
    ctx.fillRect(x, y, width, height);

    const gm = 7;
    const gx = x + gm;
    const gy = y + gm;
    const gw = width - gm * 2;
    const gh = height - gm * 2;

    const glass = ctx.createLinearGradient(gx, gy, gx + gw, gy + gh);
    glass.addColorStop(0, '#0E1C26');
    glass.addColorStop(0.4, '#182E3D');
    glass.addColorStop(0.7, '#264257');
    glass.addColorStop(1, '#0B151C');
    ctx.fillStyle = glass;
    ctx.fillRect(gx, gy, gw, gh);

    // Glass Reflection
    ctx.save();
    ctx.beginPath();
    ctx.rect(gx, gy, gw, gh);
    ctx.clip();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.beginPath();
    ctx.moveTo(gx, gy + gh * 0.7);
    ctx.lineTo(gx + gw * 0.6, gy);
    ctx.lineTo(gx + gw * 0.85, gy);
    ctx.lineTo(gx, gy + gh);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 3;
    if (!isPortal) {
      ctx.beginPath();
      ctx.moveTo(gx + gw / 2, gy); ctx.lineTo(gx + gw / 2, gy + gh);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(gx + gw * 0.33, gy); ctx.lineTo(gx + gw * 0.33, gy + gh);
      ctx.moveTo(gx + gw * 0.66, gy); ctx.lineTo(gx + gw * 0.66, gy + gh);
      ctx.stroke();
    }
    ctx.restore();
  };

  useEffect(() => {
    renderScene();
  }, [renderScene]);

  return (
    <canvas
      ref={canvasRef}
      width={1280}
      height={800}
      className="studio-interactive-canvas"
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        display: 'block',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
        borderRadius: '6px'
      }}
    />
  );
}
