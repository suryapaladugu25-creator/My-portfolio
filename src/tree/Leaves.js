/**
 * Leaves.js — Leaves with dynamic per-section palette shifts (~1.2s smooth GSAP transitions)
 */
import * as THREE from 'three';
import { gsap } from 'gsap';
import { PALETTE } from '../utils/Palette.js';

const LEAF_VERT = `
  attribute float aPhase;
  attribute float aScale;
  attribute float aToneIdx;
  uniform float uTime;
  uniform float uWind;
  varying vec2  vUv;
  varying float vToneIdx;
  varying vec3  vNormal;
  varying vec3  vWorldPos;

  void main() {
    vUv      = uv;
    vToneIdx = aToneIdx;

    vec3 pos = position;
    float swayX = sin(uTime * 0.40 + aPhase * 6.28) * uWind;
    float swayY = cos(uTime * 0.30 + aPhase * 3.14) * uWind * 0.45;
    float swayZ = sin(uTime * 0.35 + aPhase * 4.71) * uWind * 0.35;
    pos.x += swayX;
    pos.y += swayY;
    pos.z += swayZ;

    vec4 worldPos = instanceMatrix * vec4(pos * aScale, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal   = normalize((instanceMatrix * vec4(normal, 0.0)).xyz);

    gl_Position = projectionMatrix * modelViewMatrix * worldPos;
  }
`;

const LEAF_FRAG = `
  precision mediump float;
  uniform vec3  uColor0;
  uniform vec3  uColor1;
  uniform vec3  uColor2;
  uniform vec3  uColor3;
  uniform vec3  uSunDir;
  uniform vec3  uSunColor;
  varying vec2  vUv;
  varying float vToneIdx;
  varying vec3  vNormal;
  varying vec3  vWorldPos;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(vec2(p.x * 1.35, p.y + p.x * p.x * 0.15));
    float alpha = 1.0 - smoothstep(0.72, 0.98, r);
    if (alpha < 0.05) discard;

    // Pick leaf color based on instance tone index (0, 1, 2, or 3)
    vec3 baseColor = uColor1;
    if (vToneIdx < 0.5)      baseColor = uColor0;
    else if (vToneIdx < 1.5) baseColor = uColor1;
    else if (vToneIdx < 2.5) baseColor = uColor2;
    else                     baseColor = uColor3;

    // Subsurface glow & sunlight
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 sunDir  = normalize(uSunDir);
    float dotSunView = dot(-sunDir, viewDir);
    float sss = pow(max(dotSunView, 0.0), 2.2) * 0.65;

    float diff = max(dot(vNormal, sunDir), 0.0);
    float wrap = max(dot(vNormal, sunDir) * 0.5 + 0.5, 0.0);

    vec3 sssColor = uSunColor * (baseColor + vec3(0.14, 0.10, 0.02)) * sss;
    vec3 finalColor = baseColor * (diff * 0.55 + wrap * 0.45 + 0.20) + sssColor;

    gl_FragColor = vec4(finalColor, alpha * 0.94);
  }
`;

export class LeavesSystem {
  constructor(scene, tree, device) {
    this.device = device;
    const count = device.isLowEnd ? 900 : 2600;

    const geo = new THREE.PlaneGeometry(0.38, 0.52, 1, 1);

    const phases   = new Float32Array(count);
    const scales   = new Float32Array(count);
    const toneIdxs = new Float32Array(count);

    const initHero = PALETTE.sections.hero.leaves;

    for (let i = 0; i < count; i++) {
      phases[i] = Math.random();
      scales[i] = 0.70 + Math.random() * 0.55;

      const rand = Math.random();
      if (rand < 0.25)      toneIdxs[i] = 0.0;
      else if (rand < 0.60) toneIdxs[i] = 1.0;
      else if (rand < 0.85) toneIdxs[i] = 2.0;
      else                  toneIdxs[i] = 3.0;
    }

    geo.setAttribute('aPhase',   new THREE.InstancedBufferAttribute(phases, 1));
    geo.setAttribute('aScale',   new THREE.InstancedBufferAttribute(scales, 1));
    geo.setAttribute('aToneIdx', new THREE.InstancedBufferAttribute(toneIdxs, 1));

    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:     { value: 0 },
        uWind:     { value: device.isLowEnd ? 0.012 : 0.022 },
        uSunDir:   { value: new THREE.Vector3(12, 28, 14).normalize() },
        uSunColor: { value: new THREE.Color(PALETTE.sections.hero.sunColor) },
        uColor0:   { value: new THREE.Color(initHero[0]) },
        uColor1:   { value: new THREE.Color(initHero[1]) },
        uColor2:   { value: new THREE.Color(initHero[2]) },
        uColor3:   { value: new THREE.Color(initHero[3]) },
      },
      vertexShader:   LEAF_VERT,
      fragmentShader: LEAF_FRAG,
      transparent: true,
      depthWrite:  false,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.InstancedMesh(geo, this.mat, count);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const tips = tree.tipPositions.length > 0 ? tree.tipPositions : [new THREE.Vector3(0, 9, 0)];
    const dummy = new THREE.Object3D();
    const clusterSpread = 3.6;

    for (let i = 0; i < count; i++) {
      const tip = tips[i % tips.length];
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi   = Math.acos(2.0 * v - 1.0);
      const r     = Math.cbrt(Math.random()) * clusterSpread;

      dummy.position.set(
        tip.x + r * Math.sin(phi) * Math.cos(theta),
        tip.y + r * Math.sin(phi) * Math.sin(theta) * 0.75 + 0.3,
        tip.z + r * Math.cos(phi)
      );

      dummy.rotation.set(
        (Math.random() - 0.5) * 1.2,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 1.2
      );

      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    scene.add(this.mesh);
  }

  /**
   * Smoothly shift leaf colors to target section palette (~1.2s)
   */
  setSectionColors(sectionConfig) {
    if (!sectionConfig || !sectionConfig.leaves) return;
    const leaves = sectionConfig.leaves;

    for (let c = 0; c < 4; c++) {
      const targetCol = new THREE.Color(leaves[c]);
      const uniformCol = this.mat.uniforms[`uColor${c}`].value;

      gsap.to(uniformCol, {
        r: targetCol.r,
        g: targetCol.g,
        b: targetCol.b,
        duration: 1.2,
        ease: 'power2.out',
      });
    }

    if (sectionConfig.sunColor) {
      const targetSun = new THREE.Color(sectionConfig.sunColor);
      gsap.to(this.mat.uniforms.uSunColor.value, {
        r: targetSun.r,
        g: targetSun.g,
        b: targetSun.b,
        duration: 1.2,
      });
    }
  }

  setCalm(isCalm) {
    if (this.mat && this.mat.uniforms.uWind) {
      this.mat.uniforms.uWind.value = isCalm ? 0.008 : (this.device.isLowEnd ? 0.012 : 0.022);
    }
  }

  update(time) {
    if (this.mat && this.mat.uniforms.uTime) {
      this.mat.uniforms.uTime.value = time;
    }
  }
}
