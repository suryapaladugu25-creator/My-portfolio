/**
 * Fireflies.js — Particle system of drifting gold fireflies with point-light effect.
 * Uses a custom shader for glowing soft discs.
 */
import * as THREE from 'three';

const FF_VERT = `
  attribute float aPhase;
  attribute float aSpeed;
  uniform float uTime;
  varying float vBright;

  void main() {
    // Each firefly orbits on a Lissajous-like path
    vec3 pos = position;
    pos.x += sin(uTime * aSpeed       + aPhase * 6.28) * 1.2;
    pos.y += cos(uTime * aSpeed * 0.7 + aPhase * 3.14) * 0.9;
    pos.z += sin(uTime * aSpeed * 0.5 + aPhase * 2.0 ) * 1.1;

    vBright = 0.4 + 0.6 * abs(sin(uTime * 1.4 + aPhase * 5.0));
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = vBright * 6.0 * (280.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const FF_FRAG = `
  precision mediump float;
  uniform vec3 uColor;
  varying float vBright;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float circle = 1.0 - smoothstep(0.3, 1.0, d);
    if (circle < 0.01) discard;
    gl_FragColor = vec4(uColor * vBright, circle * vBright);
  }
`;

export class FirefliesSystem {
  constructor(scene, device) {
    const count = device.isLowEnd ? 40 : 120;

    const positions = new Float32Array(count * 3);
    const phases    = new Float32Array(count);
    const speeds    = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i*3]   = (Math.random() - 0.5) * 20;
      positions[i*3+1] =  Math.random() * 18 - 2;
      positions[i*3+2] = (Math.random() - 0.5) * 20;
      phases[i] = Math.random();
      speeds[i] = 0.3 + Math.random() * 0.6;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1));

    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:  { value: 0 },
        uColor: { value: new THREE.Color(0xf5c842) },
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

