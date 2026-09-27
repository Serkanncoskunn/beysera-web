// src/studio/engine/Studio3DEngine.js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PBRTextureGenerator } from "./PBRTextureGenerator";

/**
 * Studio3DEngine
 * High-performance, photo-realistic Architectural Material Visualizer.
 * 
 * DESIGN PRINCIPLES:
 * - Fixed architectural camera perspective per scene (no orbit tumble/rotation)
 * - 2D-style Panning (drag mouse across facade) and Zooming (mouse wheel / zoom controls)
 * - True PBR dynamic brick mapping to the 'tugla' material of real GLB architectural models
 * - Seamless support for multi-material arrays and instant live swatch switching
 */
export class Studio3DEngine {
  constructor() {
    this.container = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.animId = null;
    this.gltfLoader = new GLTFLoader();
    this.modelCache = new Map();

    // Lighting refs
    this.sunLight = null;
    this.ambientLight = null;
    this.hemiLight = null;

    // Current State
    this.currentModelRoot = null;
    this.currentTemplateId = "modern-commercial-corner";
    this.brickMeshes = [];
    this.brickMaterial = null;
    this.cachedTextureImg = null;
    this.cachedOptions = {};
    this.isLoadingModel = false;

    // Default Camera Presets per scene (Fixed architectural perspective)
    this.sceneCameraDefaults = {
      "modern-commercial-corner": { target: new THREE.Vector3(0, 1.9, 0), radius: 9.6, theta: 0.52, phi: 1.28 },
      "modern-living-room": { target: new THREE.Vector3(0, 1.25, 0), radius: 6.8, theta: 0.08, phi: 1.38 },
      "modern-kitchen-dining": { target: new THREE.Vector3(0, 1.2, 0), radius: 6.5, theta: 0.22, phi: 1.36 },
      "modern-villa-01": { target: new THREE.Vector3(0, 1.45, 0), radius: 8.6, theta: 0.35, phi: 1.32 },
      "modern-hotel": { target: new THREE.Vector3(0, 2.1, 0), radius: 10.2, theta: 0.48, phi: 1.26 },
      "modern-plaza": { target: new THREE.Vector3(0, 2.2, 0), radius: 10.5, theta: 0.55, phi: 1.24 },
      "modern-factory": { target: new THREE.Vector3(0, 1.8, 0), radius: 9.8, theta: 0.42, phi: 1.30 },
      "modern-university": { target: new THREE.Vector3(0, 2.0, 0), radius: 10.0, theta: 0.45, phi: 1.28 },
      "modern-hospital": { target: new THREE.Vector3(0, 2.0, 0), radius: 10.2, theta: 0.50, phi: 1.26 },
      "modern-logistics": { target: new THREE.Vector3(0, 1.9, 0), radius: 9.8, theta: 0.44, phi: 1.29 }
    };

    // Camera Interactive State (Pan & Zoom only - fixed angle)
    this.defaultTarget = new THREE.Vector3(0, 1.9, 0);
    this.cameraTarget = new THREE.Vector3(0, 1.9, 0);
    this.targetCameraTarget = new THREE.Vector3(0, 1.9, 0);

    this.defaultRadius = 9.6;
    this.currentRadius = 9.6;
    this.targetRadius = 9.6;
    this.minRadius = 2.5;
    this.maxRadius = 14.0;

    this.fixedTheta = 0.52;
    this.fixedPhi = 1.28;

    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };

    // Bound listeners
    this._onMouseDown = this.onMouseDown.bind(this);
    this._onMouseMove = this.onMouseMove.bind(this);
    this._onMouseUp = this.onMouseUp.bind(this);
    this._onWheel = this.onWheel.bind(this);
    this._onTouchStart = this.onTouchStart.bind(this);
    this._onTouchMove = this.onTouchMove.bind(this);
    this._onTouchEnd = this.onTouchEnd.bind(this);
    this._onResize = this.resize.bind(this);
  }

  /**
   * Initialize WebGL renderer and 3D architectural viewport
   */
  init(container) {
    if (!container) return;
    this.container = container;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene & Environment
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#DCE2E8");
    this.scene.fog = new THREE.FogExp2("#CBD3DA", 0.012);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    this.updateCameraPosition();

    // 3. WebGL Renderer with PBR settings
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(this.renderer.domElement);

    // 4. Setup Lighting
    this.setupLighting();

    // 5. Default Brick Material
    this.brickMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.86,
      metalness: 0.03
    });

    // 6. Build Initial Scene
    this.buildArchitecturalScene(this.currentTemplateId);

    // 7. Attach Interactive Pan/Zoom Listeners
    this.attachEventListeners();

    // 8. Start Animation Loop
    this.animate();
  }

  /**
   * Setup dynamic sun and architectural lighting
   */
  setupLighting() {
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x443833, 0.85);
    this.scene.add(this.hemiLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfffaee, 2.5);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 50;
    this.sunLight.shadow.camera.left = -16;
    this.sunLight.shadow.camera.right = 16;
    this.sunLight.shadow.camera.top = 16;
    this.sunLight.shadow.camera.bottom = -16;
    this.sunLight.shadow.bias = -0.0003;
    this.sunLight.position.set(16, 18, 12);
    this.sunLight.target.position.set(0, 1.8, 0);
    this.scene.add(this.sunLight);
    this.scene.add(this.sunLight.target);
  }

  /**
   * Build or Load GLB Architectural Scene
   */
  buildArchitecturalScene(templateId) {
    this.currentTemplateId = templateId;
    this.brickMeshes = [];

    const glbMap = {
      "modern-commercial-corner": "/assets/studio/isiklar/glb/place-bina.glb",
      "modern-living-room": "/assets/studio/isiklar/glb/place-salon.glb",
      "modern-kitchen-dining": "/assets/studio/isiklar/glb/place-mutfak.glb",
      "modern-villa-01": "/assets/studio/isiklar/glb/place-villa.glb",
      "modern-hotel": "/assets/studio/isiklar/glb/place-otel.glb",
      "modern-plaza": "/assets/studio/isiklar/glb/place-plaza.glb",
      "modern-factory": "/assets/studio/isiklar/glb/place-fabrika.glb",
      "modern-university": "/assets/studio/isiklar/glb/place-university.glb",
      "modern-hospital": "/assets/studio/isiklar/glb/place-hastane.glb",
      "modern-logistics": "/assets/studio/isiklar/glb/place-lojistik.glb"
    };

    const targetGLB = glbMap[templateId] || glbMap["modern-commercial-corner"];

    // Set Scene Camera Presets
    const preset = this.sceneCameraDefaults[templateId] || this.sceneCameraDefaults["modern-commercial-corner"];
    this.defaultTarget.copy(preset.target);
    this.cameraTarget.copy(preset.target);
    this.targetCameraTarget.copy(preset.target);

    this.defaultRadius = preset.radius;
    this.currentRadius = preset.radius;
    this.targetRadius = preset.radius;

    this.fixedTheta = preset.theta;
    this.fixedPhi = preset.phi;

    // Remove previous model
    if (this.currentModelRoot) {
      this.scene.remove(this.currentModelRoot);
      this.currentModelRoot = null;
    }

    this.isLoadingModel = true;

    // Load GLB Model
    if (this.modelCache.has(targetGLB)) {
      const cachedScene = this.modelCache.get(targetGLB);
      this.setupLoadedModel(cachedScene.clone(true));
      this.isLoadingModel = false;
    } else {
      this.gltfLoader.load(
        targetGLB,
        (gltf) => {
          this.modelCache.set(targetGLB, gltf.scene);
          this.setupLoadedModel(gltf.scene);
          this.isLoadingModel = false;
        },
        undefined,
        (err) => {
          console.warn("[Studio3DEngine] Could not load GLB model:", err);
          this.isLoadingModel = false;
        }
      );
    }
  }

  /**
   * Traverse model and attach this.brickMaterial to all 'tugla' material slots
   */
  setupLoadedModel(modelScene) {
    this.currentModelRoot = modelScene;
    this.brickMeshes = [];

    modelScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (Array.isArray(child.material)) {
          child.material = child.material.map((mat) => {
            if (mat && mat.name && mat.name.toLowerCase().includes("tugla")) {
              this.brickMeshes.push(child);
              return this.brickMaterial;
            }
            return mat;
          });
        } else if (child.material) {
          if (child.material.name && child.material.name.toLowerCase().includes("tugla")) {
            child.material = this.brickMaterial;
            this.brickMeshes.push(child);
          }
        }
      }
    });

    this.scene.add(modelScene);

    // Live update with cached texture
    if (this.cachedTextureImg) {
      this.updateBrickMaterial(this.cachedTextureImg, this.cachedOptions);
    }
  }

  /**
   * Update PBR Brick Material with dynamic Albedo, Normal & Roughness textures
   */
  updateBrickMaterial(textureImg, options = {}) {
    if (!textureImg) return;
    this.cachedTextureImg = textureImg;
    this.cachedOptions = options;

    const maps = PBRTextureGenerator.generatePBRMaps(textureImg, {
      ...options,
      resolution: 2048
    });
    if (!maps) return;

    if (!this.brickMaterial) {
      this.brickMaterial = new THREE.MeshStandardMaterial({
        roughness: 0.86,
        metalness: 0.03
      });
    }

    this.brickMaterial.map = maps.albedoTex;
    this.brickMaterial.normalMap = maps.normalTex;
    this.brickMaterial.normalScale = new THREE.Vector2(1.8, 1.8);
    this.brickMaterial.roughnessMap = maps.roughTex;
    this.brickMaterial.roughness = 0.86;
    this.brickMaterial.metalness = 0.03;
    this.brickMaterial.needsUpdate = true;

    // Ensure all target meshes have updated material
    this.brickMeshes.forEach((mesh) => {
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((m) => {
          if (m === this.brickMaterial || (m && m.name && m.name.toLowerCase().includes("tugla"))) {
            return this.brickMaterial;
          }
          return m;
        });
      } else {
        mesh.material = this.brickMaterial;
      }
      mesh.material.needsUpdate = true;
    });
  }

  /**
   * Camera Position Update based on Fixed Angle + Pan & Zoom
   */
  updateCameraPosition() {
    const theta = this.fixedTheta;
    const phi = this.fixedPhi;
    const r = this.currentRadius;

    const x = this.cameraTarget.x + r * Math.sin(phi) * Math.sin(theta);
    const y = this.cameraTarget.y + r * Math.cos(phi);
    const z = this.cameraTarget.z + r * Math.sin(phi) * Math.cos(theta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.cameraTarget);
  }

  /**
   * Event Listeners for 2D Pan and Zoom (Fixed Angle)
   */
  attachEventListeners() {
    const el = this.renderer.domElement;
    el.addEventListener("mousedown", this._onMouseDown);
    window.addEventListener("mousemove", this._onMouseMove);
    window.addEventListener("mouseup", this._onMouseUp);
    el.addEventListener("wheel", this._onWheel, { passive: false });

    el.addEventListener("touchstart", this._onTouchStart, { passive: false });
    window.addEventListener("touchmove", this._onTouchMove, { passive: false });
    window.addEventListener("touchend", this._onTouchEnd);
    window.addEventListener("resize", this._onResize);
  }

  onMouseDown(e) {
    if (e.button !== 0 && e.button !== 1 && e.button !== 2) return;
    this.isDragging = true;
    this.prevMousePos = { x: e.clientX, y: e.clientY };
  }

  onMouseMove(e) {
    if (!this.isDragging) return;
    const deltaX = e.clientX - this.prevMousePos.x;
    const deltaY = e.clientY - this.prevMousePos.y;

    // Pan along camera right and up vectors (2D panning across facade)
    const panFactor = (this.currentRadius / 10.0) * 0.005;

    // Camera right vector in XZ plane
    const rightX = Math.cos(this.fixedTheta);
    const rightZ = -Math.sin(this.fixedTheta);

    this.targetCameraTarget.x -= rightX * deltaX * panFactor;
    this.targetCameraTarget.z -= rightZ * deltaX * panFactor;
    this.targetCameraTarget.y += deltaY * panFactor;

    // Smooth clamping around center
    this.targetCameraTarget.x = Math.max(this.defaultTarget.x - 6, Math.min(this.defaultTarget.x + 6, this.targetCameraTarget.x));
    this.targetCameraTarget.y = Math.max(this.defaultTarget.y - 4, Math.min(this.defaultTarget.y + 4, this.targetCameraTarget.y));
    this.targetCameraTarget.z = Math.max(this.defaultTarget.z - 6, Math.min(this.defaultTarget.z + 6, this.targetCameraTarget.z));

    this.prevMousePos = { x: e.clientX, y: e.clientY };
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onWheel(e) {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.005;
    this.targetRadius = Math.max(this.minRadius, Math.min(this.maxRadius, this.targetRadius + zoomDelta));
  }

  onTouchStart(e) {
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }

  onTouchMove(e) {
    if (!this.isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const deltaX = e.touches[0].clientX - this.prevMousePos.x;
    const deltaY = e.touches[0].clientY - this.prevMousePos.y;

    const panFactor = (this.currentRadius / 10.0) * 0.006;
    const rightX = Math.cos(this.fixedTheta);
    const rightZ = -Math.sin(this.fixedTheta);

    this.targetCameraTarget.x -= rightX * deltaX * panFactor;
    this.targetCameraTarget.z -= rightZ * deltaX * panFactor;
    this.targetCameraTarget.y += deltaY * panFactor;

    this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  onTouchEnd() {
    this.isDragging = false;
  }

  // Zoom Controls
  zoomIn() {
    this.targetRadius = Math.max(this.minRadius, this.targetRadius - 1.5);
  }

  zoomOut() {
    this.targetRadius = Math.min(this.maxRadius, this.targetRadius + 1.5);
  }

  resetView() {
    this.targetCameraTarget.copy(this.defaultTarget);
    this.targetRadius = this.defaultRadius;
  }

  getZoomPercent() {
    const range = this.maxRadius - this.minRadius;
    const progress = 1.0 - (this.currentRadius - this.minRadius) / range;
    return Math.round(100 + progress * 200);
  }

  /**
   * Main Render Loop
   */
  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    const damping = 0.12;
    this.currentRadius += (this.targetRadius - this.currentRadius) * damping;
    this.cameraTarget.lerp(this.targetCameraTarget, damping);

    this.updateCameraPosition();
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Resize viewport
   */
  resize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Capture high-res snapshot
   */
  getSnapshotDataURL() {
    if (!this.renderer) return null;
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL("image/png");
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);

    const el = this.renderer && this.renderer.domElement;
    if (el) {
      el.removeEventListener("mousedown", this._onMouseDown);
      el.removeEventListener("wheel", this._onWheel);
      el.removeEventListener("touchstart", this._onTouchStart);
      if (el.parentNode) el.parentNode.removeChild(el);
    }

    window.removeEventListener("mousemove", this._onMouseMove);
    window.removeEventListener("mouseup", this._onMouseUp);
    window.removeEventListener("touchmove", this._onTouchMove);
    window.removeEventListener("touchend", this._onTouchEnd);
    window.removeEventListener("resize", this._onResize);

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}
