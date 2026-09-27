// src/studio/engine/PatternEngine.js
import { getGroutColorById } from '../data/groutColors';

export class PatternEngine {
  /**
   * Render brick pattern onto a canvas context inside a surface bounds with realistic lighting
   */
  static renderPattern(ctx, textureImg, bounds, options = {}) {
    const {
      patternId = 'running-bond',
      scale = 1.0,
      groutWidthMm = 10,
      groutColorId = 'beige-sand',
      rotation = 0,
      perspective = null,
      product = null,
      mixImages = null,
      blendMode = 'random'
    } = options;

    const groutObj = getGroutColorById(groutColorId);
    const groutColor = groutObj ? groutObj.hex : '#C8BAA8';

    // Base facing brick standard dimensions in 2400x1500 base-space
    // Standard European Facing Brick (215mm x 65mm ratio ~ 3.3:1)
    let baseUnitWidth = 140 * scale;
    let baseUnitHeight = 44 * scale;

    // If product specifies custom real millimeter dimensions
    if (product && product.brickWidthMm && product.brickHeightMm) {
      const ratio = product.brickWidthMm / product.brickHeightMm;
      baseUnitHeight = 44 * scale;
      baseUnitWidth = baseUnitHeight * ratio;
    }

    // Pixel grout width relative to brick height
    const groutPx = groutWidthMm === 0 ? 0 : Math.max(1, Math.round((groutWidthMm / 65) * baseUnitHeight * 0.3));

    ctx.save();

    // 1. Draw grout mortar background if grout > 0 mm
    if (groutPx > 0) {
      ctx.fillStyle = groutColor;
      ctx.fillRect(bounds.x - 120, bounds.y - 120, bounds.width + 240, bounds.height + 240);

      // Subtle textured mortar bedding noise/shading
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(bounds.x - 120, bounds.y - 120, bounds.width + 240, bounds.height + 240);
    }

    // 2. Rotation transform
    if (rotation !== 0) {
      const cx = bounds.x + bounds.width / 2;
      const cy = bounds.y + bounds.height / 2;
      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    // 3. Perspective trapezoid transform if enabled
    if (perspective && perspective.enabled) {
      const tl = perspective.topLeft || [bounds.x, bounds.y];
      const tr = perspective.topRight || [bounds.x + bounds.width, bounds.y];
      const br = perspective.bottomRight || [bounds.x + bounds.width, bounds.y + bounds.height];
      const bl = perspective.bottomLeft || [bounds.x, bounds.y + bounds.height];

      const pTopW = (Array.isArray(tr) ? tr[0] : tr.x) - (Array.isArray(tl) ? tl[0] : tl.x);
      const pBottomW = (Array.isArray(br) ? br[0] : br.x) - (Array.isArray(bl) ? bl[0] : bl.x);

      if (pTopW !== pBottomW && bounds.height > 0) {
        const skewFactor = ((pTopW - pBottomW) / bounds.height) * 0.12;
        ctx.transform(1, 0, skewFactor, 1, 0, 0);
      }
    }

    // 4. Pattern rendering branch
    if (patternId === 'herringbone') {
      this.renderHerringbone(ctx, textureImg, bounds, baseUnitWidth, baseUnitHeight, groutPx);
    } else if (patternId === 'flemish-bond') {
      this.renderFlemish(ctx, textureImg, bounds, baseUnitWidth, baseUnitHeight, groutPx);
    } else if (patternId === 'stack-vertical') {
      this.renderVertical(ctx, textureImg, bounds, baseUnitWidth, baseUnitHeight, groutPx);
    } else {
      this.renderStandardGrid(ctx, textureImg, bounds, baseUnitWidth, baseUnitHeight, groutPx, patternId, mixImages, blendMode);
    }

    ctx.restore();
  }

  /**
   * Standard Horizontal Grid Patterns
   */
  static renderStandardGrid(ctx, textureImg, bounds, brickW, brickH, groutPx, patternId, mixImages = null, blendMode = 'random') {
    const stepX = brickW + groutPx;
    const stepY = brickH + groutPx;

    const startX = bounds.x - stepX * 2;
    const endX = bounds.x + bounds.width + stepX * 2;
    const startY = bounds.y - stepY * 2;
    const endY = bounds.y + bounds.height + stepY * 2;

    let rowIndex = 0;
    for (let y = startY; y < endY; y += stepY) {
      let offset = 0;
      if (patternId === 'running-bond') {
        offset = (rowIndex % 2) * (stepX * 0.5);
      } else if (patternId === 'one-third-bond') {
        offset = (rowIndex % 3) * (stepX * 0.3333);
      } else if (patternId === 'stack-horizontal') {
        offset = 0;
      }

      let colIndex = 0;
      for (let x = startX - stepX + offset; x < endX; x += stepX) {
        this.drawSingleBrick(ctx, textureImg, x, y, brickW, brickH, rowIndex, colIndex, groutPx, mixImages, blendMode, bounds);
        colIndex++;
      }
      rowIndex++;
    }
  }

  /**
   * Vertical Stack Bond
   */
  static renderVertical(ctx, textureImg, bounds, brickW, brickH, groutPx) {
    const vBrickW = brickH;
    const vBrickH = brickW;
    const stepX = vBrickW + groutPx;
    const stepY = vBrickH + groutPx;

    const startX = bounds.x - stepX * 2;
    const endX = bounds.x + bounds.width + stepX * 2;
    const startY = bounds.y - stepY * 2;
    const endY = bounds.y + bounds.height + stepY * 2;

    let rowIndex = 0;
    for (let y = startY; y < endY; y += stepY) {
      let colIndex = 0;
      for (let x = startX; x < endX; x += stepX) {
        this.drawSingleBrick(ctx, textureImg, x, y, vBrickW, vBrickH, rowIndex, colIndex, groutPx);
        colIndex++;
      }
      rowIndex++;
    }
  }

  /**
   * Flemish Bond (Alternating header and stretcher)
   */
  static renderFlemish(ctx, textureImg, bounds, brickW, brickH, groutPx) {
    const stretcherW = brickW;
    const headerW = Math.round(brickW * 0.46);
    const unitW = stretcherW + groutPx + headerW + groutPx;
    const stepY = brickH + groutPx;

    const startX = bounds.x - unitW * 2;
    const endX = bounds.x + bounds.width + unitW * 2;
    const startY = bounds.y - stepY * 2;
    const endY = bounds.y + bounds.height + stepY * 2;

    let rowIndex = 0;
    for (let y = startY; y < endY; y += stepY) {
      const rowOffset = (rowIndex % 2) * (stretcherW * 0.5);
      let colIndex = 0;
      for (let x = startX + rowOffset; x < endX; x += unitW) {
        // Draw stretcher
        this.drawSingleBrick(ctx, textureImg, x, y, stretcherW, brickH, rowIndex, colIndex * 2, groutPx);
        // Draw header
        const headerX = x + stretcherW + groutPx;
        this.drawSingleBrick(ctx, textureImg, headerX, y, headerW, brickH, rowIndex, colIndex * 2 + 1, groutPx);
        colIndex++;
      }
      rowIndex++;
    }
  }

  /**
   * Herringbone Pattern
   */
  static renderHerringbone(ctx, textureImg, bounds, brickW, brickH, groutPx) {
    const unitSize = brickW;
    const step = unitSize * 0.707 + groutPx;

    const startX = bounds.x - bounds.width * 0.5;
    const endX = bounds.x + bounds.width * 1.5;
    const startY = bounds.y - bounds.height * 0.5;
    const endY = bounds.y + bounds.height * 1.5;

    let row = 0;
    for (let y = startY; y < endY; y += step) {
      let col = 0;
      for (let x = startX; x < endX; x += step) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((45 * Math.PI) / 180);

        this.drawSingleBrick(ctx, textureImg, 0, 0, brickW, brickH, row, col, groutPx);

        ctx.rotate((90 * Math.PI) / 180);
        this.drawSingleBrick(ctx, textureImg, -brickH - groutPx, 0, brickW, brickH, row + 1, col, groutPx);

        ctx.restore();
        col++;
      }
      row++;
    }
  }

  /**
   * Draw an individual brick with organic texture sampling and natural kiln depth
   */
  static drawSingleBrick(ctx, textureImg, x, y, w, h, rowIndex = 0, colIndex = 0, groutPx = 0, mixImages = null, blendMode = 'random', bounds = null) {
    let activeImg = textureImg;
    if (Array.isArray(mixImages) && mixImages.length > 0) {
      if (blendMode === 'alternating') {
        // Alternating individual bricks: [A][B][A][B]... next row starts [B][A][B][A]...
        const idx = Math.abs(rowIndex + colIndex) % mixImages.length;
        activeImg = mixImages[idx]?.img || activeImg;
      } else if (blendMode === 'split-left-right') {
        // Split Left / Right (Sol taraf tuğla 1, Sağ taraf tuğla 2)
        const midX = bounds ? (bounds.x + bounds.width * 0.5) : 1024;
        const stagger = (rowIndex % 2 === 0 ? w * 0.5 : 0);
        if (x + stagger < midX) {
          activeImg = mixImages[0]?.img || activeImg;
        } else {
          activeImg = (mixImages[1] || mixImages[0])?.img || activeImg;
        }
      } else if (blendMode === 'split-top-bottom') {
        // Split Top / Bottom (Alt kat / Baza tuğla 1, Üst katlar tuğla 2)
        const splitY = bounds ? (bounds.y + bounds.height * 0.55) : 1100;
        if (y >= splitY) {
          activeImg = mixImages[0]?.img || activeImg;
        } else {
          activeImg = (mixImages[1] || mixImages[0])?.img || activeImg;
        }
      } else if (blendMode === 'accent-pillar') {
        // Center Pillar / Accent Feature (Merkez kolon vurgusu)
        const minX = bounds ? (bounds.x + bounds.width * 0.35) : 700;
        const maxX = bounds ? (bounds.x + bounds.width * 0.65) : 1350;
        if (x >= minX && x <= maxX) {
          activeImg = mixImages[0]?.img || activeImg;
        } else {
          activeImg = (mixImages[1] || mixImages[0])?.img || activeImg;
        }
      } else {
        // Default 'random': Proportional Brick-by-Brick Scattering (Aralara serpiştirilmiş harman)
        const totalRatio = mixImages.reduce((sum, m) => sum + (m.ratio || 0), 0) || 100;
        
        // High-entropy integer hash for row and col for natural brick-by-brick scattering
        let h = (rowIndex * 397) ^ (colIndex * 719);
        h = ((h >> 16) ^ h) * 0x45d9f3b;
        h = ((h >> 16) ^ h) * 0x45d9f3b;
        h = (h >> 16) ^ h;
        const hash = Math.abs(h % totalRatio);

        let cumulative = 0;
        for (const item of mixImages) {
          cumulative += item.ratio || 0;
          if (hash < cumulative) {
            activeImg = item.img || activeImg;
            break;
          }
        }
      }
    }
    if (!textureImg) {
      ctx.fillStyle = '#8C2D19';
      ctx.fillRect(x, y, w, h);
      return;
    }

    const naturalW = activeImg.naturalWidth || activeImg.width || 400;
    const naturalH = textureImg.naturalHeight || textureImg.height || 300;

    // Organic sampling offsets across the texture photo to simulate real kiln tone variations
    const seed = (rowIndex * 19 + colIndex * 43) % 100;
    const cropX = Math.floor((seed / 100) * (naturalW * 0.45));
    const cropY = Math.floor(((seed * 11) % 100 / 100) * (naturalH * 0.45));
    const cropW = Math.max(60, Math.floor(naturalW * 0.5));
    const cropH = Math.max(25, Math.floor(naturalH * 0.5));

    ctx.save();

    // 1. Draw real brick texture
    try {
      ctx.drawImage(activeImg,
        cropX, cropY, cropW, cropH,
        x, y, w, h
      );
    } catch {
      ctx.fillStyle = '#8C2D19';
      ctx.fillRect(x, y, w, h);
    }

    // 2. Subtle organic kiln luminance variance (+/- 3% without altering product color)
    const varianceSeed = (rowIndex * 7 + colIndex * 13) % 10;
    if (varianceSeed > 6) {
      // Very slight ambient warm highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.fillRect(x, y, w, h);
    } else if (varianceSeed < 3) {
      // Very slight kiln smoke tone
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(x, y, w, h);
    }

    // 3. Subtle 3D Edge Bevel & Contact Depth (Natural, not plastic CGI)
    if (groutPx > 0) {
      // Top rim ambient light
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y + h);
      ctx.lineTo(x, y);
      ctx.lineTo(x + w, y);
      ctx.stroke();

      // Bottom-Right Contact Shadow (mortar bed depth)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath();
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.stroke();
    }

    ctx.restore();
  }
}
