/**
 * Leaves.js — Natural Foliage Canopy
 * Full canopy of green leaves in several shades (#2F8F4E, #3FA65F, #5CBF72),
 * with a few lighter sun-catching leaves (#7CD98E).
 * Gentle wind sway on branches and leaves (small, slow).
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
    vUv    = uv;
    vColor = aColor;

    // Gentle realistic wind sway: small amplitude, slow frequency
    vec3 pos = position;
    float sway = sin(uTime * 0.45 + aPhase * 6.28) * uWind;
    float swayY = cos(uTime * 0.35 + aPhase * 3.14) * uWind * 0.4;
    pos.x += sway;
    pos.y += swayY;

    vec4 mvPos = modelViewMatrix * instanceMatrix * vec4(pos * aScale, 1.0);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const LEAF_FRAG = `
  precision mediump float;
  varying vec2 vUv;
  varying vec3 vColor;

  void main() {
    // Natural almond leaf silhouette
    vec2 uv2 = vUv * 2.0 - 1.0;
    float dist = length(uv2 * vec2(0.65, 1.0));
    float mask = 1.0 - smoothstep(0.7, 0.98, dist);
    if (mask < 0.05) discard;

    // Organic matte finish without plastic shine or neon
    gl_FragColor = vec4(vColor, mask * 0.92);
  }
`;

export class LeavesSystem {
  constructor(scene, tree, device) {
    this.device = device;
    const count = device.isLowEnd ? 750 : 1800;

    const geo = new THREE.PlaneGeometry(0.35, 0.52, 1, 1);

    const phases = new Float32Array(count);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    // Realistic leaf color palette: 3 green shades + sunlit highlight
    const leafColors = [
      new THREE.Color(PALETTE.hex.leaf1),    // #2F8F4E
      new THREE.Color(PALETTE.hex.leaf2),    // #3FA65F
      new THREE.Color(PALETTE.hex.leaf3),    // #5CBF72
      new THREE.Color(PALETTE.hex.leafSun),  // #7CD98E (sunlit)
    ];

    for (let i = 0; i < count; i++) {
      phases[i] = Math.random();
      scales[i] = 0.75 + Math.random() * 0.5;

      // Weighted distribution: majority mid & rich green, ~15% sunlit
      const rand = Math.random();
      let chosenColor;
      if (rand < 0.35)      chosenColor = leafColors[0];
      else if (rand < 0.70) chosenColor = leafColors[1];
      else if (rand < 0.88) chosenColor = leafColors[2];
      else                  chosenColor = leafColors[3];

      colors[i * 3]     = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1));
    geo.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1));
    geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(colors, 3));

    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        // Gentle, calm wind
        uWind: { value: device.isLowEnd ? 0.015 : 0.024 },
      },
      vertexShader:   LEAF_VERT,
      fragmentShader: LEAF_FRAG,
      transparent: true,
      depthWrite:  false,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.InstancedMesh(geo, this.mat, count);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Distribute leaves organically in spherical volumes around branch tips
    const tips = tree.tipPositions.length > 0 ? tree.tipPositions : [new THREE.Vector3(0, 8, 0)];
    const dummy = new THREE.Object3D();
    const spread = 3.2;

    for (let i = 0; i < count; i++) {
      const tip = tips[i % tips.length];
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * spread;

      dummy.position.set(
        tip.x + r * Math.sin(phi) * Math.cos(theta),
        tip.y + r * Math.sin(phi) * Math.sin(theta) * 0.7 + 0.4,
        tip.z + r * Math.cos(phi)
      );

      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    scene.add(this.mesh);
  }

  setCalm(isCalm) {
    if (this.mat && this.mat.uniforms.uWind) {
      this.mat.uniforms.uWind.value = isCalm ? 0.01 : (this.device.isLowEnd ? 0.015 : 0.024);
    }
  }

  update(time) {
    if (this.mat && this.mat.uniforms.uTime) {
      this.mat.uniforms.uTime.value = time;
    }
  }
}
