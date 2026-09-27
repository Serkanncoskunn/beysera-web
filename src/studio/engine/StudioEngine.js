// src/studio/engine/StudioEngine.js
import { PatternEngine } from './PatternEngine';
import { TemplateLoader } from './TemplateLoader';

export class StudioEngine {
  /**
   * Main 2D photo-realistic render pipeline with layered composition
   * 
   * LAYER ORDER:
   * 1. Base High-Resolution Architectural Photo
   * 2. Configurable Surface Polygons (with cutout subtraction)
   * 3. Real Brick Matrix (PatternEngine with perspective mapping)
   * 4. Shadow Layer Blend & Ambient Occlusion Preservation
   * 5. Foreground Fixtures & Glass Reflections
   */
  static renderScene(canvas, template, textureImg, options = {}) {
    if (!canvas || !template) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const {
      patternId = 'running-bond',
      scale = 1.0,
      groutWidthMm = 8,
      groutColorId = 'beige-sand',
      rotation = 0,
      zoom = 1.0,
      pan = { x: 0, y: 0 },
      activeSurfaceId = null,
      baseImageElement = null,
      shadowImageElement = null,
      product = null
    } = options;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Clean neutral canvas backdrop
    ctx.fillStyle = '#1A1D20';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Natural template resolution
    const baseW = (baseImageElement && baseImageElement.naturalWidth) || (template.canvas && template.canvas.width) || 2400;
    const baseH = (baseImageElement && baseImageElement.naturalHeight) || (template.canvas && template.canvas.height) || 1350;

    // Full-bleed edge-to-edge cover fit scale
    // Uses Math.max so the architectural photo completely covers the viewport without black bars
    const baseFitScale = Math.max(displayWidth / baseW, displayHeight / baseH);
    const fitScale = baseFitScale * zoom;

    const scaledW = baseW * fitScale;
    const scaledH = baseH * fitScale;

    // Clamp pan so user stays within the architectural photo
    const maxPanX = Math.max(0, (scaledW - displayWidth) / 2);
    const maxPanY = Math.max(0, (scaledH - displayHeight) / 2);
    const clampedPanX = Math.max(-maxPanX, Math.min(maxPanX, pan.x));
    const clampedPanY = Math.max(-maxPanY, Math.min(maxPanY, pan.y));

    const offsetX = (displayWidth - scaledW) / 2 + clampedPanX;
    const offsetY = (displayHeight - scaledH) / 2 + clampedPanY;

    ctx.translate(offsetX, offsetY);
    ctx.scale(fitScale, fitScale);

    // -------------------------------------------------------------
    // LAYER 1: BASE ARCHITECTURAL PHOTO ASSET
    // -------------------------------------------------------------
    if (baseImageElement && baseImageElement.complete && baseImageElement.naturalWidth > 0) {
      ctx.drawImage(baseImageElement, 0, 0, baseW, baseH);
    } else {
      this.drawEnvironment(ctx, template, baseW, baseH);
    }

    // -------------------------------------------------------------
    // LAYER 2 & 3 & 4: CONFIGURABLE ARCHITECTURAL SURFACES
    // -------------------------------------------------------------
    const surfacesToRender = template.surfaces || template.applicationAreas || [];
    if (Array.isArray(surfacesToRender) && surfacesToRender.length > 0) {
      surfacesToRender.forEach((surf) => {
        this.renderSurface(ctx, surf, textureImg, {
          patternId,
          scale,
          groutWidthMm,
          groutColorId,
          rotation,
          isActive: !activeSurfaceId || activeSurfaceId === surf.id,
          shadowImageElement,
          product,
          baseW,
          baseH
        });
      });
    }

    // -------------------------------------------------------------
    // LAYER 5: ARCHITECTURAL FIXTURES & GLASS OVERLAYS (if procedural)
    // -------------------------------------------------------------
    if (!baseImageElement || !baseImageElement.complete) {
      this.drawArchitecturalFixtures(ctx, template, baseW, baseH);
    }

    ctx.restore();
  }

  /**
   * Render individual surface using Polygon Masking, Cutout Subtraction & Perspective Engine
   */
  static renderSurface(ctx, surface, textureImg, options) {
    if (!surface.polygon || surface.polygon.length < 3) return;

    const polyPoints = surface.polygon.map(TemplateLoader.normalizePoint);

    ctx.save();

    // 1. Build surface polygon path
    ctx.beginPath();
    ctx.moveTo(polyPoints[0].x, polyPoints[0].y);
    for (let i = 1; i < polyPoints.length; i++) {
      ctx.lineTo(polyPoints[i].x, polyPoints[i].y);
    }
    ctx.closePath();

    // 2. Subtract Cutouts (windows, doors, openings, niches)
    if (Array.isArray(surface.cutouts) && surface.cutouts.length > 0) {
      surface.cutouts.forEach((cutout) => {
        const rawPoints = cutout.polygon || (Array.isArray(cutout) ? cutout : null);
        if (Array.isArray(rawPoints) && rawPoints.length >= 3) {
          const cPoints = rawPoints.map(TemplateLoader.normalizePoint);
          ctx.moveTo(cPoints[0].x, cPoints[0].y);
          for (let j = 1; j < cPoints.length; j++) {
            ctx.lineTo(cPoints[j].x, cPoints[j].y);
          }
          ctx.closePath();
        }
      });
      ctx.clip('evenodd');
    } else {
      ctx.clip();
    }

    // 3. Compute surface bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    polyPoints.forEach((pt) => {
      minX = Math.min(minX, pt.x);
      minY = Math.min(minY, pt.y);
      maxX = Math.max(maxX, pt.x);
      maxY = Math.max(maxY, pt.y);
    });

    const bounds = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };

    // 4. Render Real Brick Pattern
    PatternEngine.renderPattern(ctx, textureImg, bounds, {
      ...options,
      perspective: surface.perspective
    });

    // 5. Shadow Layer Integration
    const { shadowImageElement } = options;
    if (shadowImageElement && shadowImageElement.complete && shadowImageElement.naturalWidth > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(shadowImageElement, 0, 0, options.baseW || 2400, options.baseH || 1350);
      ctx.restore();
    }

    // Procedural lighting / ambient shadow fallback
    const light = surface.lighting || {};
    if (light.topShadowHeight) {
      const topShadow = ctx.createLinearGradient(0, bounds.y, 0, bounds.y + light.topShadowHeight);
      topShadow.addColorStop(0, `rgba(0, 0, 0, ${light.ambientOcclusion || 0.38})`);
      topShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = topShadow;
      ctx.fillRect(bounds.x - 40, bounds.y, bounds.width + 80, light.topShadowHeight);
    }

    ctx.restore();
  }

  /**
   * Draw atmospheric scene background fallback
   */
  static drawEnvironment(ctx, template, sceneW, sceneH) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, sceneH * 0.7);
    skyGrad.addColorStop(0, '#232A34');
    skyGrad.addColorStop(0.5, '#35404E');
    skyGrad.addColorStop(1, '#5C6A7A');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, sceneW, sceneH);

    ctx.fillStyle = '#1B1C20';
    ctx.fillRect(0, sceneH * 0.78, sceneW, sceneH * 0.22);
  }

  /**
   * Draw surrounding architectural fixtures fallback
   */
  static drawArchitecturalFixtures(ctx, template, sceneW, sceneH) {
    const el = template.architecturalElements;
    if (!el) return;

    ctx.save();
    if (el.ground) {
      ctx.fillStyle = el.ground.color || '#24201E';
      ctx.fillRect(0, el.ground.y, sceneW, el.ground.height);
    }
    ctx.restore();
  }
}
