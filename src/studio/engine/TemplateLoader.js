// src/studio/engine/TemplateLoader.js

/**
 * TemplateLoader & Geometry Validator
 * Manages loading, memory caching, schema validation, and coordinate scaling
 * for photo-realistic architectural templates.
 */
export class TemplateLoader {
  constructor() {
    this.imageCache = new Map();
    this.pendingLoads = new Map();
  }

  /**
   * Validate a template object against the architectural geometry schema
   * @param {Object} template
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  static validateTemplate(template) {
    const errors = [];
    if (!template || typeof template !== 'object') {
      return { isValid: false, errors: ['Template is null or not an object'] };
    }

    const id = template.id || template.templateId;
    if (!id || typeof id !== 'string') {
      errors.push('Template missing valid id/templateId string');
    }

    const canvasWidth = (template.canvas && template.canvas.width) || template.sceneWidth;
    const canvasHeight = (template.canvas && template.canvas.height) || template.sceneHeight;
    if (!canvasWidth || !canvasHeight || canvasWidth <= 0 || canvasHeight <= 0) {
      errors.push(`Invalid template canvas dimensions: ${canvasWidth}x${canvasHeight}`);
    }

    const surfaces = template.surfaces || template.applicationAreas;
    if (!Array.isArray(surfaces) || surfaces.length === 0) {
      errors.push('Template contains no surfaces array');
    } else {
      surfaces.forEach((surface, sIdx) => {
        if (!surface.id) {
          errors.push(`Surface at index ${sIdx} missing id`);
        }
        if (!Array.isArray(surface.polygon) || surface.polygon.length < 3) {
          errors.push(`Surface "${surface.id || sIdx}" must have a polygon with at least 3 vertices`);
        } else {
          // Check coordinate structure
          surface.polygon.forEach((pt, pIdx) => {
            const x = Array.isArray(pt) ? pt[0] : pt.x;
            const y = Array.isArray(pt) ? pt[1] : pt.y;
            if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
              errors.push(`Surface "${surface.id}" polygon vertex ${pIdx} has invalid coordinates: (${x}, ${y})`);
            }
          });
        }

        // Validate cutouts if present
        if (Array.isArray(surface.cutouts)) {
          surface.cutouts.forEach((cutout, cIdx) => {
            const cutoutPoly = cutout.polygon || (Array.isArray(cutout) ? cutout : null);
            if (!Array.isArray(cutoutPoly) || cutoutPoly.length < 3) {
              errors.push(`Cutout at index ${cIdx} in surface "${surface.id}" has invalid polygon`);
            }
          });
        }

        // Validate perspective 4-points if present
        if (surface.perspective) {
          const { topLeft, topRight, bottomRight, bottomLeft } = surface.perspective;
          if (topLeft && (!Array.isArray(topLeft) || topLeft.length < 2)) {
            errors.push(`Surface "${surface.id}" perspective.topLeft is malformed`);
          }
          if (topRight && (!Array.isArray(topRight) || topRight.length < 2)) {
            errors.push(`Surface "${surface.id}" perspective.topRight is malformed`);
          }
          if (bottomRight && (!Array.isArray(bottomRight) || bottomRight.length < 2)) {
            errors.push(`Surface "${surface.id}" perspective.bottomRight is malformed`);
          }
          if (bottomLeft && (!Array.isArray(bottomLeft) || bottomLeft.length < 2)) {
            errors.push(`Surface "${surface.id}" perspective.bottomLeft is malformed`);
          }
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Load an image asset with deduplication and memory caching
   * @param {string} url
   * @returns {Promise<HTMLImageElement|null>}
   */
  loadAsset(url) {
    if (!url) return Promise.resolve(null);

    // Return cached image if already loaded
    if (this.imageCache.has(url)) {
      const cached = this.imageCache.get(url);
      if (cached.complete && cached.naturalWidth > 0) {
        return Promise.resolve(cached);
      }
    }

    // Reuse pending promise if currently loading
    if (this.pendingLoads.has(url)) {
      return this.pendingLoads.get(url);
    }

    const loadPromise = new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        this.imageCache.set(url, img);
        this.pendingLoads.delete(url);
        resolve(img);
      };

      img.onerror = () => {
        // Fallback gracefully without console pollution
        this.pendingLoads.delete(url);
        resolve(null);
      };

      img.src = url;
    });

    this.pendingLoads.set(url, loadPromise);
    return loadPromise;
  }

  /**
   * Normalize any point representation {x, y} or [x, y] to {x, y}
   * @param {Object|Array} pt
   * @returns {{x: number, y: number}}
   */
  static normalizePoint(pt) {
    if (Array.isArray(pt)) {
      return { x: pt[0], y: pt[1] };
    }
    return { x: pt.x, y: pt.y };
  }

  /**
   * Map coordinates from base image natural space to active viewport space
   * @param {Array<{x: number, y: number}>|Array<[number, number]>} polygon
   * @param {number} scaleFactor
   * @param {number} offsetX
   * @param {number} offsetY
   * @returns {Array<{x: number, y: number}>}
   */
  static transformPolygon(polygon, scaleFactor = 1, offsetX = 0, offsetY = 0) {
    if (!Array.isArray(polygon)) return [];
    return polygon.map((pt) => {
      const norm = this.normalizePoint(pt);
      return {
        x: norm.x * scaleFactor + offsetX,
        y: norm.y * scaleFactor + offsetY
      };
    });
  }

  /**
   * Clear all cached images
   */
  clearCache() {
    this.imageCache.clear();
    this.pendingLoads.clear();
  }
}

export const templateLoader = new TemplateLoader();
