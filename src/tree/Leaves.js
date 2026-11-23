/**
 * Leaves.js — Storybook Painterly Leaves
 * Features:
 *  - Small instanced leaf cards layered in clusters for depth
 *  - 4 distinct leaf color variations (deep forest, mid green, fresh spring, sunlit golden-green)
 *  - Fake subsurface scattering shader: light shines warmly through back of leaves
 *  - Gentle organic wind sway (small amplitude, slow frequency)
 *  - Procedural leaf alpha shape (soft hand-painted contour)
 */
import * as THREE from 'three';
import { PALETTE } from '../utils/Palette.js';

const LEAF_VERT = `
  attribute float aPhase;
  attribute float aScale;
  attribute vec3  aColor;
  attribute float aSunlit;
  uniform float uTime;
  uniform float uWind;
  varying vec2  vUv;
  varying vec3  vColor;
  varying vec3  vNormal;
  varying vec3  vWorldPos;
  varying float vSunlit;

  void main() {
    vUv     = uv;
    vColor  = aColor;
    vSunlit = aSunlit;

    // Gentle slow wind sway with per-instance phase
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
  uniform vec3  uSunDir;
  uniform vec3  uSunColor;
  varying vec2  vUv;
  varying vec3  vColor;
  varying vec3  vNormal;
  varying vec3  vWorldPos;
  varying float vSunlit;

  void main() {
    // Hand-painted organic oval leaf contour
    vec2 p = vUv * 2.0 - 1.0;
    // Taper top and base of leaf
    float r = length(vec2(p.x * 1.35, p.y + p.x * p.x * 0.15));
    float alpha = 1.0 - smoothstep(0.72, 0.98, r);
    if (alpha < 0.05) discard;

    // Fake Subsurface Scattering (Backlight transmission)
    // When looking at leaves with the sun behind them, warm light glows through
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 sunDir  = normalize(uSunDir);
    float dotSunView = dot(-sunDir, viewDir);
    float sss = pow(max(dotSunView, 0.0), 2.2) * 0.65;

    // Front diffuse sunlight
    float diff = max(dot(vNormal, sunDir), 0.0);
    // Soft ambient wrap light
    float wrap = max(dot(vNormal, sunDir) * 0.5 + 0.5, 0.0);

    // Warm golden transmission through leaves
    vec3 sssColor = uSunColor * (vColor + vec3(0.12, 0.18, 0.02)) * sss;

    // Shading with depth: sunny exterior vs shaded interior
    vec3 finalColor = vColor * (diff * 0.55 + wrap * 0.45 + 0.18) + sssColor;

    gl_FragColor = vec4(finalColor, alpha * 0.94);
  }
`;

export class LeavesSystem {
  constructor(scene, tree, device) {
    this.device = device;
    // High density clusters for painterly volume
    const count = device.isLowEnd ? 900 : 2600;

    // Small leaf card geometry
    const geo = new THREE.PlaneGeometry(0.38, 0.52, 1, 1);

    const phases  = new Float32Array(count);
    const scales  = new Float32Array(count);
    const colors  = new Float32Array(count * 3);
    const sunlits = new Float32Array(count);

    // Rich storybook palette: 4 layered shades
    const leafPalette = [
      new THREE.Color(0x236838), // Deep inner shadow green
      new THREE.Color(0x358D4B), // Rich classic foliage
      new THREE.Color(0x4FA862), // Mid fresh green
      new THREE.Color(0x82D468), // Bright sun-kissed golden-green
    ];

    for (let i = 0; i < count; i++) {
      phases[i] = Math.random();
      scales[i] = 0.70 + Math.random() * 0.55;

      const rand = Math.random();
      let chosenColor;
      let isSunlit = 0.0;

      if (rand < 0.25) {
        chosenColor = leafPalette[0]; // deep inner
      } else if (rand < 0.58) {
        chosenColor = leafPalette[1]; // mid
      } else if (rand < 0.82) {
        chosenColor = leafPalette[2]; // fresh
      } else {
        chosenColor = leafPalette[3]; // sunlit highlight
        isSunlit = 1.0;
      }

      colors[i * 3]     = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
      sunlits[i]        = isSunlit;
    }

    geo.setAttribute('aPhase',  new THREE.InstancedBufferAttribute(phases, 1));
    geo.setAttribute('aScale',  new THREE.InstancedBufferAttribute(scales, 1));
    geo.setAttribute('aColor',  new THREE.InstancedBufferAttribute(colors, 3));
    geo.setAttribute('aSunlit', new THREE.InstancedBufferAttribute(sunlits, 1));

    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:     { value: 0 },
        uWind:     { value: device.isLowEnd ? 0.012 : 0.022 },
        uSunDir:   { value: new THREE.Vector3(12, 28, 14).normalize() },
        uSunColor: { value: new THREE.Color(PALETTE.hex.sunlightWarm) },
      },
      vertexShader:   LEAF_VERT,
      fragmentShader: LEAF_FRAG,
      transparent: true,
      depthWrite:  false,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.InstancedMesh(geo, this.mat, count);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Group leaves into full layered spheres/clouds around branch tip positions
    const tips = tree.tipPositions.length > 0 ? tree.tipPositions : [new THREE.Vector3(0, 9, 0)];
    const dummy = new THREE.Object3D();
    const clusterSpread = 3.6;

    for (let i = 0; i < count; i++) {
      const tip = tips[i % tips.length];

      // Volume distribution with concentration toward outer rim
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

      // Painterly leaf orientation (billboard-leaning with variety)
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
