/**
 * Fireflies.js — Soft, slow-drifting gold fireflies (cut count ~60%, calm motion)
 */
import * as THREE from 'three';
import { PALETTE } from '../utils/Palette.js';

const FF_VERT = `
  attribute float aPhase;
  attribute float aSpeed;
  uniform float uTime;
  varying float vAlpha;

  void main() {
    // Very slow drift (no fast orbital swings)
    vec3 pos = position;
    pos.x += sin(uTime * aSpeed * 0.35 + aPhase * 6.28) * 0.45;
    pos.y += cos(uTime * aSpeed * 0.28 + aPhase * 3.14) * 0.35;
    pos.z += sin(uTime * aSpeed * 0.22 + aPhase * 2.0 ) * 0.40;

    // Slow, soft breathing alpha (0.25 to 0.65)
    vAlpha = 0.25 + 0.4 * (sin(uTime * 0.6 + aPhase * 4.0) * 0.5 + 0.5);

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (18.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const FF_FRAG = `
  precision mediump float;
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float circle = 1.0 - smoothstep(0.2, 1.0, d);
    if (circle < 0.01) discard;
    gl_FragColor = vec4(uColor, circle * vAlpha);
  }
`;

export class FirefliesSystem {
  constructor(scene, device) {
    // 60% reduction: 16 (low-end) / 48 (standard) vs previous 40 / 120
    const count = device.isLowEnd ? 16 : 48;

    const positions = new Float32Array(count * 3);
    const phases    = new Float32Array(count);
    const speeds    = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] =  Math.random() * 16 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      phases[i] = Math.random();
      speeds[i] = 0.15 + Math.random() * 0.25; // slow speeds
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1));

    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:  { value: 0 },
        uColor: { value: new THREE.Color(PALETTE.hex.accentGold) },
      },
      vertexShader:   FF_VERT,
      fragmentShader: FF_FRAG,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geo, this.mat);
    scene.add(this.points);
  }

  update(time) {
    this.mat.uniforms.uTime.value = time;
  }
}
