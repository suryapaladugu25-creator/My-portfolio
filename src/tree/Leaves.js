/**
 * Leaves.js — Instanced leaf meshes with calm wind-sway shader
 * Three distinct emerald tones (#2F8F6F, #4FB58F, #7FD3B0), small amplitude, slow sway
 */
import * as THREE from 'three';
import { PALETTE } from '../utils/Palette.js';

const LEAF_VERT = `
  attribute float aPhase;
  attribute float aScale;
  attribute vec3  aColor;
  uniform float uTime;
  uniform float uWind;
  varying vec2  vUv;
  varying vec3  vColor;

  void main() {
    vUv = uv;
    vColor = aColor;

    // Very gentle and slow wind sway: small amplitude (0.015-0.03), slow frequency
    vec3 pos = position;
    float sway = sin(uTime * 0.5 + aPhase * 6.28) * uWind;
    pos.x += sway;
    pos.y += cos(uTime * 0.4 + aPhase * 3.14) * uWind * 0.35;

    vec4 mvPos = modelViewMatrix * instanceMatrix * vec4(pos * aScale, 1.0);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const LEAF_FRAG = `
  precision mediump float;
  varying vec2 vUv;
  varying vec3 vColor;

  void main() {
    // Soft organic oval leaf shape
    vec2 uv2 = vUv * 2.0 - 1.0;
    float dist = length(uv2 * vec2(0.65, 1.0));
    float mask = 1.0 - smoothstep(0.65, 0.98, dist);
    if (mask < 0.05) discard;

    // Clean matte emerald tone (no loud glowing gold flip)
    gl_FragColor = vec4(vColor, mask * 0.85);
  }
`;

export class LeavesSystem {
  constructor(scene, tree, device) {
    this.device = device;
    // Reduced count: calm foliage
    const count = device.isLowEnd ? 300 : 900;

    const geo = new THREE.PlaneGeometry(0.28, 0.42, 1, 1);

    const phases = new Float32Array(count);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const emeraldShades = [
      new THREE.Color(PALETTE.hex.emerald1), // #2F8F6F (dark emerald)
      new THREE.Color(PALETTE.hex.emerald2), // #4FB58F (soft emerald)
      new THREE.Color(PALETTE.hex.emerald3), // #7FD3B0 (light emerald)
    ];

    for (let i = 0; i < count; i++) {
      phases[i] = Math.random();
      scales[i] = 0.65 + Math.random() * 0.55;
      const shade = emeraldShades[i % 3];
      colors[i * 3]     = shade.r;
      colors[i * 3 + 1] = shade.g;
      colors[i * 3 + 2] = shade.b;
    }

    geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1));
    geo.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1));
    geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(colors, 3));

    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        // Small wind amplitude: 0.02 - 0.03
        uWind: { value: device.isLowEnd ? 0.015 : 0.025 },
      },
      vertexShader:   LEAF_VERT,
      fragmentShader: LEAF_FRAG,
      transparent: true,
      depthWrite:  false,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.InstancedMesh(geo, this.mat, count);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const tips = tree.tipPositions;
    const dummy = new THREE.Object3D();
    const spread = 2.2;

    for (let i = 0; i < count; i++) {
      const tip = tips[i % tips.length];
      dummy.position.set(
        tip.x + (Math.random() - 0.5) * spread,
        tip.y + Math.random() * spread * 0.5,
        tip.z + (Math.random() - 0.5) * spread
      );
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.8,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 0.8
      );
      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    scene.add(this.mesh);
  }

  setCalm(isCalm) {
    if (this.mat && this.mat.uniforms.uWind) {
      this.mat.uniforms.uWind.value = isCalm ? 0.01 : (this.device.isLowEnd ? 0.015 : 0.025);
    }
  }

  update(time) {
    if (this.mat && this.mat.uniforms.uTime) {
      this.mat.uniforms.uTime.value = time;
    }
  }
}
