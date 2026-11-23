/**
 * Leaves.js — Instanced leaf meshes with wind-sway shader
 * Thousands of leaves at branch tip positions, running at 60 fps.
 */
import * as THREE from 'three';

const LEAF_VERT = `
  attribute float aPhase;
  attribute float aScale;
  uniform float uTime;
  uniform float uWind;
  varying vec2 vUv;
  varying float vBright;

  void main() {
    vUv = uv;

    // Wind sway via sine on instance position
    vec3 pos = position;
    float sway = sin(uTime * 1.3 + aPhase * 6.28) * uWind;
    pos.x += sway;
    pos.y += cos(uTime * 1.1 + aPhase * 3.14) * uWind * 0.5;

    vec4 mvPos = modelViewMatrix * instanceMatrix * vec4(pos * aScale, 1.0);
    vBright = 0.5 + 0.5 * sin(uTime * 0.8 + aPhase * 4.0);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const LEAF_FRAG = `
  precision mediump float;
  uniform vec3  uGold;
  uniform vec3  uGreen;
  uniform float uTime;
  varying vec2  vUv;
  varying float vBright;

  void main() {
    // Leaf shape mask (ellipse)
    vec2 uv2 = vUv * 2.0 - 1.0;
    float mask = 1.0 - smoothstep(0.5, 1.0, length(uv2 * vec2(0.6, 1.0)));
    if (mask < 0.01) discard;

    // Blend green → gold based on brightness (like autumn glow)
    vec3 col = mix(uGreen, uGold, vBright * 0.6);
    // Edge translucency
    float alpha = mask * (0.6 + vBright * 0.4);
    gl_FragColor = vec4(col, alpha);
  }
`;

export class LeavesSystem {
  constructor(scene, tree, device) {
    this.device = device;
    const count = device.isLowEnd ? 600 : 2200;

    // Geometry — simple plane for each leaf
    const geo = new THREE.PlaneGeometry(0.3, 0.45, 1, 1);

    // Per-instance random attributes
    const phases = new Float32Array(count);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      phases[i] = Math.random();
      scales[i] = 0.6 + Math.random() * 0.8;
    }
    geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1));
    geo.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1));

    // Shader material
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:  { value: 0 },
        uWind:  { value: device.isLowEnd ? 0.04 : 0.08 },
        uGold:  { value: new THREE.Color(0xf5c842) },
        uGreen: { value: new THREE.Color(0x1e3d14) },
      },
      vertexShader:   LEAF_VERT,
      fragmentShader: LEAF_FRAG,
      transparent: true,
      depthWrite:  false,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.InstancedMesh(geo, this.mat, count);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Scatter leaves around branch tips
    const tips   = tree.tipPositions;
    const dummy  = new THREE.Object3D();
    const spread = 2.5;

    for (let i = 0; i < count; i++) {
      const tip = tips[i % tips.length];
      dummy.position.set(
        tip.x + (Math.random() - 0.5) * spread,
        tip.y + Math.random() * spread * 0.6,
        tip.z + (Math.random() - 0.5) * spread
      );
      dummy.rotation.set(
        (Math.random() - 0.5) * Math.PI,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * Math.PI
      );
      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;

    scene.add(this.mesh);
  }

  update(time, dt) {
    this.mat.uniforms.uTime.value = time;
    // Wind gust — slow sine variation
    this.mat.uniforms.uWind.value = (this.device.isLowEnd ? 0.04 : 0.08)
      + Math.sin(time * 0.22) * 0.03;
  }
}

