// src/studio/engine/TextureCache.js

class TextureCacheManager {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
  }

  async loadTexture(src) {
    if (!src) return null;
    if (this.cache.has(src)) {
      return this.cache.get(src);
    }
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    const loadPromise = new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        this.cache.set(src, img);
        this.loadingPromises.delete(src);
        resolve(img);
      };
      img.onerror = (err) => {
        this.loadingPromises.delete(src);
        console.warn("Failed to load image texture:", src, err);
        resolve(null);
      };
      img.src = src;
      if (img.complete && img.naturalWidth > 0) {
        this.cache.set(src, img);
        this.loadingPromises.delete(src);
        resolve(img);
      }
    });

    this.loadingPromises.set(src, loadPromise);
    return loadPromise;
  }

  getProductImagePath(product) {
    if (!product) return null;
    return product.mainImage || (product.images && product.images[0]) || product.gorsel || product.image || null;
  }

  clear() {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}

export const textureCache = new TextureCacheManager();
