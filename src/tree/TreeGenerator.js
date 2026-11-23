/**
 * TreeGenerator.js
 * Procedural tree with bark (#3B2B20) and gold veins at 30% opacity max.
 */
import * as THREE from 'three';
import { PALETTE } from '../utils/Palette.js';

// ── Gold vein shader for trunk ───────────────────────────────────────────────
const TRUNK_VERT = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv       = uv;
    vNormal   = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const TRUNK_FRAG = `
  precision mediump float;
  uniform float uTime;
  uniform float uScrollProg;
  uniform vec3  uGold;
  uniform vec3  uBark;
  varying vec2  vUv;
  varying vec3  vNormal;

  /* 2D noise for organic veins */
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
  }

  void main() {
    /* Bark base: #3B2B20 */
    vec3 bark = uBark;

    /* Circuit/tree veins */
    float v1 = noise(vUv * vec2(2.5, 14.0));
    float v2 = noise(vUv * vec2(1.8, 10.0) + 3.2);
    float vein = pow(max(v1, v2), 4.5);

    /* Slow pulse along y (no rushing or flashing) */
    float pulse = smoothstep(0.2, 0.8, sin(vUv.y * 18.0 - uTime * 0.8) * 0.5 + 0.5);
    float grow  = smoothstep(0.0, 1.0, uScrollProg);

    /* Gold veins at only 30% max opacity */
    float veinIntensity = vein * (0.15 + 0.15 * pulse) * grow;
    vec3 color = mix(bark, uGold, clamp(veinIntensity, 0.0, 0.30));

    /* Very subtle edge definition */
    float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    color += uGold * rim * 0.03;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function makeBranchMat() {
  return new THREE.MeshStandardMaterial({
    color:     PALETTE.hex.barkTrunk, // #3B2B20
    roughness: 0.94,
    metalness: 0.02,
  });
}

function makeTrunkMat() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime:       { value: 0 },
      uScrollProg: { value: 0 },
      uGold:       { value: new THREE.Color(PALETTE.hex.accentGold) },
      uBark:       { value: new THREE.Color(PALETTE.hex.barkTrunk) },
    },
    vertexShader:   TRUNK_VERT,
    fragmentShader: TRUNK_FRAG,
  });
}

export class TreeGenerator {
  constructor(scene, device) {
    this.scene  = scene;
    this.device = device;

    this.trunkMat  = makeTrunkMat();
    this.branchMat = makeBranchMat();

    this.trunkGroup  = new THREE.Group();
    this.branchGroup = new THREE.Group();
    scene.add(this.trunkGroup);
    scene.add(this.branchGroup);

    this.tipPositions = [];
  }

  generate() {
    this._buildTrunk();
    this._buildBranches();
  }

  _buildTrunk() {
    // Smooth CatmullRom curve for tapering trunk
    const points = [
      new THREE.Vector3( 0.0, -8.0,  0.0),
      new THREE.Vector3( 0.2, -4.0,  0.1),
      new THREE.Vector3(-0.2,  0.0, -0.1),
      new THREE.Vector3( 0.1,  4.0,  0.2),
      new THREE.Vector3(-0.1,  8.0,  0.0),
      new THREE.Vector3( 0.0, 12.0, -0.1),
      new THREE.Vector3( 0.1, 16.0,  0.0),
      new THREE.Vector3( 0.0, 20.0,  0.0),
      new THREE.Vector3( 0.0, 24.0,  0.0),
    ];
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.9, 12, false);

    // Taper trunk along height
    const pos = tubeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const factor = Math.max(0.18, 1.0 - (y + 8) / 36);
      pos.setX(i, pos.getX(i) * factor);
      pos.setZ(i, pos.getZ(i) * factor);
    }
    pos.needsUpdate = true;
    tubeGeo.computeVertexNormals();

    const trunkMesh = new THREE.Mesh(tubeGeo, this.trunkMat);
    trunkMesh.castShadow    = !this.device.isLowEnd;
    trunkMesh.receiveShadow = !this.device.isLowEnd;
    this.trunkGroup.add(trunkMesh);
  }

  _buildBranches() {
    const branchConfigs = [
      // yBase, angle, length, radius, tiltUp
      { y:  2.0, angle: 0.2,              len: 3.8, r: 0.35, tilt: 0.4 },
      { y:  3.5, angle: Math.PI * 0.65,    len: 4.2, r: 0.32, tilt: 0.35 },
      { y:  5.0, angle: Math.PI * 1.3,     len: 4.0, r: 0.30, tilt: 0.45 },
      { y:  7.0, angle: Math.PI * 0.15,    len: 4.5, r: 0.28, tilt: 0.4 },
      { y:  8.5, angle: Math.PI * 0.85,    len: 4.2, r: 0.26, tilt: 0.5 },
      { y: 10.0, angle: Math.PI * 1.55,    len: 4.6, r: 0.24, tilt: 0.45 },
      { y: 12.0, angle: Math.PI * 0.4,     len: 4.0, r: 0.22, tilt: 0.55 },
      { y: 13.5, angle: Math.PI * 1.1,     len: 3.8, r: 0.20, tilt: 0.5 },
      { y: 15.0, angle: Math.PI * 1.8,     len: 3.5, r: 0.18, tilt: 0.6 },
      { y: 17.0, angle: Math.PI * 0.55,    len: 3.2, r: 0.16, tilt: 0.65 },
      { y: 19.0, angle: Math.PI * 1.25,    len: 2.8, r: 0.14, tilt: 0.7 },
      { y: 21.0, angle: Math.PI * 0.1,     len: 2.4, r: 0.12, tilt: 0.75 },
    ];

    branchConfigs.forEach(cfg => {
      const start = new THREE.Vector3(0, cfg.y, 0);
      const dir = new THREE.Vector3(
        Math.cos(cfg.angle),
        cfg.tilt,
        Math.sin(cfg.angle)
      ).normalize();

      const mid = start.clone().add(dir.clone().multiplyScalar(cfg.len * 0.5));
      mid.x += (Math.random() - 0.5) * 0.4;
      mid.z += (Math.random() - 0.5) * 0.4;

      const end = start.clone().add(dir.clone().multiplyScalar(cfg.len));
      end.y += 0.3;

      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const geo = new THREE.TubeGeometry(curve, 16, cfg.r, 8, false);

      const mesh = new THREE.Mesh(geo, this.branchMat);
      mesh.castShadow = !this.device.isLowEnd;
      this.branchGroup.add(mesh);

      this.tipPositions.push(end);
    });
  }

  update(time, scrollProg) {
    if (this.trunkMat && this.trunkMat.uniforms) {
      this.trunkMat.uniforms.uTime.value = time;
      if (scrollProg !== undefined) {
        this.trunkMat.uniforms.uScrollProg.value = scrollProg;
      }
    }
  }
}
