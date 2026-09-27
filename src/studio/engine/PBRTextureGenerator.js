// src/studio/engine/PBRTextureGenerator.js
import * as THREE from "three";
import { PatternEngine } from "./PatternEngine";
import { getGroutColorById } from "../data/groutColors";

export class PBRTextureGenerator {
  static generatePBRMaps(textureImg, options = {}) {
    const {
      patternId = "running-bond",
      scale = 1.0,
      groutWidthMm = 10,
      groutColorId = "beige-sand",
      rotation = 0,
      resolution = 2048,
      product = null,
      mixImages = null,
      blendMode = 'random'
    } = options;

    const width = resolution;
    const height = resolution;

    const albedoCanvas = document.createElement("canvas");
    albedoCanvas.width = width;
    albedoCanvas.height = height;
    const ctx = albedoCanvas.getContext("2d", { willReadFrequently: true });

    const groutObj = getGroutColorById(groutColorId);
    const groutColor = groutObj ? groutObj.hex : "#C8BAA8";

    ctx.fillStyle = groutColor;
    ctx.fillRect(0, 0, width, height);

    const bounds = { x: 0, y: 0, width, height };
    PatternEngine.renderPattern(ctx, textureImg, bounds, {
      patternId,
      scale: scale * 1.5,
      groutWidthMm,
      groutColorId,
      rotation,
      product,
      mixImages,
      blendMode
    });

    const normalCanvas = document.createElement("canvas");
    normalCanvas.width = width;
    normalCanvas.height = height;
    const normCtx = normalCanvas.getContext("2d");

    const roughnessCanvas = document.createElement("canvas");
    roughnessCanvas.width = width;
    roughnessCanvas.height = height;
    const roughCtx = roughnessCanvas.getContext("2d");

    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      const normImgData = normCtx.createImageData(width, height);
      const normData = normImgData.data;

      const roughImgData = roughCtx.createImageData(width, height);
      const roughData = roughImgData.data;

      const strength = 2.8;

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;

          const l00 = (data[((y - 1) * width + (x - 1)) * 4] * 0.299 + data[((y - 1) * width + (x - 1)) * 4 + 1] * 0.587 + data[((y - 1) * width + (x - 1)) * 4 + 2] * 0.114);
          const l01 = (data[((y - 1) * width + x) * 4] * 0.299 + data[((y - 1) * width + x) * 4 + 1] * 0.587 + data[((y - 1) * width + x) * 4 + 2] * 0.114);
          const l02 = (data[((y - 1) * width + (x + 1)) * 4] * 0.299 + data[((y - 1) * width + (x + 1)) * 4 + 1] * 0.587 + data[((y - 1) * width + (x + 1)) * 4 + 2] * 0.114);

          const l10 = (data[(y * width + (x - 1)) * 4] * 0.299 + data[(y * width + (x - 1)) * 4 + 1] * 0.587 + data[(y * width + (x - 1)) * 4 + 2] * 0.114);
          const l12 = (data[(y * width + (x + 1)) * 4] * 0.299 + data[(y * width + (x + 1)) * 4 + 1] * 0.587 + data[(y * width + (x + 1)) * 4 + 2] * 0.114);

          const l20 = (data[((y + 1) * width + (x - 1)) * 4] * 0.299 + data[((y + 1) * width + (x - 1)) * 4 + 1] * 0.587 + data[((y + 1) * width + (x - 1)) * 4 + 2] * 0.114);
          const l21 = (data[((y + 1) * width + x) * 4] * 0.299 + data[((y + 1) * width + x) * 4 + 1] * 0.587 + data[((y + 1) * width + x) * 4 + 2] * 0.114);
          const l22 = (data[((y + 1) * width + (x + 1)) * 4] * 0.299 + data[((y + 1) * width + (x + 1)) * 4 + 1] * 0.587 + data[((y + 1) * width + (x + 1)) * 4 + 2] * 0.114);

          const dx = (l02 + 2 * l12 + l22) - (l00 + 2 * l10 + l20);
          const dy = (l20 + 2 * l21 + l22) - (l00 + 2 * l01 + l02);

          const nx = (-dx / 255.0) * strength;
          const ny = (-dy / 255.0) * strength;
          const nz = 1.0;

          const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
          normData[idx] = Math.floor(((nx / len) * 0.5 + 0.5) * 255);
          normData[idx + 1] = Math.floor(((ny / len) * 0.5 + 0.5) * 255);
          normData[idx + 2] = Math.floor(((nz / len) * 0.5 + 0.5) * 255);
          normData[idx + 3] = 255;

          const lum = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
          const roughVal = Math.min(245, Math.max(180, Math.floor(210 + (255 - lum) * 0.15)));
          roughData[idx] = roughVal;
          roughData[idx + 1] = roughVal;
          roughData[idx + 2] = roughVal;
          roughData[idx + 3] = 255;
        }
      }

      normCtx.putImageData(normImgData, 0, 0);
      roughCtx.putImageData(roughImgData, 0, 0);
    } catch (e) {
      console.warn("Could not generate normal/roughness map:", e);
    }

    const albedoTex = new THREE.CanvasTexture(albedoCanvas);
    albedoTex.colorSpace = THREE.SRGBColorSpace;
    albedoTex.wrapS = THREE.RepeatWrapping;
    albedoTex.wrapT = THREE.RepeatWrapping;
    albedoTex.repeat.set(2, 2);
    albedoTex.generateMipmaps = true;
    albedoTex.minFilter = THREE.LinearMipmapLinearFilter;
    albedoTex.magFilter = THREE.LinearFilter;
    albedoTex.needsUpdate = true;

    const normalTex = new THREE.CanvasTexture(normalCanvas);
    normalTex.wrapS = THREE.RepeatWrapping;
    normalTex.wrapT = THREE.RepeatWrapping;
    normalTex.repeat.set(2, 2);
    normalTex.generateMipmaps = true;
    normalTex.minFilter = THREE.LinearMipmapLinearFilter;
    normalTex.magFilter = THREE.LinearFilter;
    normalTex.needsUpdate = true;

    const roughTex = new THREE.CanvasTexture(roughnessCanvas);
    roughTex.wrapS = THREE.RepeatWrapping;
    roughTex.wrapT = THREE.RepeatWrapping;
    roughTex.repeat.set(2, 2);
    roughTex.generateMipmaps = true;
    roughTex.minFilter = THREE.LinearMipmapLinearFilter;
    roughTex.magFilter = THREE.LinearFilter;
    roughTex.needsUpdate = true;

    return { albedoTex, normalTex, roughTex };
  }
}
