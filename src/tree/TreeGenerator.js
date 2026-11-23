/**
 * TreeGenerator.js
 * Procedural L-system style recursive tree with:
 *  - Tapering TubeGeometry branches
 *  - Custom gold-vein shader on trunk
 *  - Tip positions exported for skill leaves, project lanterns, etc.
 *  - Slight random variation each visit
 */
import * as THREE from 'three';

// ── Gold vein shader for trunk ───────────────────────────────────────────────
const TRUNK_VERT = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vUv       = uv;
    vNormal   = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const TRUNK_FRAG = `
  precision mediump float;
  uniform float uTime;
  uniform float uScrollProg;
  uniform vec3  uGold;
  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vWorldPos;

  /* cheap 2D value noise */
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
  }

  void main() {
    /* dark bark base */
    vec3 bark = vec3(0.10, 0.065, 0.028);

    /* circuit-like gold veins */
    float v1 = noise(vUv * vec2(3.0, 18.0));
    float v2 = noise(vUv * vec2(2.0, 12.0) + 3.7);
    float vein = pow(max(v1, v2), 5.0);

    /* travelling pulse along y */
    float pulse = smoothstep(0.3, 0.7, sin(vUv.y * 25.0 - uTime * 2.2) * 0.5 + 0.5);
    float grow  = smoothstep(0.0, 1.0, uScrollProg);

    vec3 color = mix(bark, uGold, vein * pulse * grow * 0.85);

    /* soft fresnel rim */
    float rim = 1.0 - max(dot(vNormal, vec3(0,0,1)), 0.0);
    color += uGold * rim * 0.07;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ── Branch material (simple bark) ────────────────────────────────────────────
function makeBranchMat() {
  return new THREE.MeshStandardMaterial({
    color:     0x2d1a09,
    roughness: 0.92,
    metalness: 0.04,
  });
}

// ── Shared trunk shader material ──────────────────────────────────────────────
function makeTrunkMat() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime:       { value: 0 },
      uScrollProg: { value: 0 },
      uGold:       { value: new THREE.Color(0xf5c842) },
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

    this.tipPositions = []; // used for leaves / lanterns
    this._branchData  = []; // { start, end, radius, depth, isTrunk }
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  generate() {
    const maxDepth = this.device.isLowEnd ? 5 : 7;
    this._branchData = [];
    this.tipPositions = [];

    // Seed slightly different each visit
    this._rng = this._makeRNG(Date.now() % 9973 + 1);

    // Trunk starts below ground (roots hidden by mist)
    this._recurse(
      new THREE.Vector3(0, -8, 0),
      new THREE.Vector3(0,  1, 0),
      18,          // trunk height
      0.9,         // radius multiplier (absolute radius = mult * 0.08 in mesh)
      maxDepth,
      true
    );

    // Build meshes
    this._branchData.forEach((b, i) => this._buildMesh(b, i));

    // Ground plane (mist reference)
    const groundGeo = new THREE.CircleGeometry(30, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x060400, roughness: 1, metalness: 0,
      transparent: true, opacity: 0.8,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -8;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  getTrunkTopY() { return 10; } // approx top of trunk in world space

  update(time) {
    this.trunkMat.uniforms.uTime.value = time;
    // Scroll progress hooked externally via updateScrollProg
  }

  updateScrollProg(prog) {
    this.trunkMat.uniforms.uScrollProg.value = prog;
  }

  // ── Private: recursive branching ──────────────────────────────────────────
  _recurse(start, dir, length, radius, depth, isTrunk) {
    if (depth <= 0 || length < 0.25) return;

    // Slight organic wander
    const wanderDir = dir.clone().add(
      new THREE.Vector3(
        (this._rng() - 0.5) * 0.25,
        0,
        (this._rng() - 0.5) * 0.25
      )
    ).normalize();

    const end = start.clone().addScaledVector(wanderDir, length);
    this._branchData.push({ start: start.clone(), end: end.clone(), radius, depth, isTrunk });

    if (depth === 1) {
      // Leaf tip
      this.tipPositions.push(end.clone());
      return;
    }

    const childCount = isTrunk
      ? (depth > 5 ? 1 : 3)   // trunk grows mostly straight then splits
      : 2;
    const childLen  = length  * (0.58 + this._rng() * 0.14);
    const childRad  = radius  * 0.65;

    for (let i = 0; i < childCount; i++) {
      const baseAngleY = isTrunk && depth > 5
        ? Math.PI * 2 * (i / childCount)
        : Math.PI * 2 * (i / childCount) + this._rng() * 0.4;
      const tiltAngle = isTrunk && depth > 5
        ? 0.08
        : (0.3 + this._rng() * 0.4);

      const childDir = new THREE.Vector3(
        Math.sin(tiltAngle) * Math.cos(baseAngleY),
        Math.cos(tiltAngle),
        Math.sin(tiltAngle) * Math.sin(baseAngleY)
      ).normalize();

      this._recurse(end.clone(), childDir, childLen, childRad, depth - 1, false);
    }
  }

  // ── Build tube geometry for one branch ────────────────────────────────────
  _buildMesh(branch, idx) {
    const { start, end, radius, isTrunk } = branch;

    // Mid-point displacement for organic curve
    const mid = start.clone().lerp(end, 0.5).add(
      new THREE.Vector3(
        (this._rng() - 0.5) * 0.4,
        0,
        (this._rng() - 0.5) * 0.4
      )
    );

    const path = new THREE.CatmullRomCurve3([start, mid, end]);
    const seg  = isTrunk ? 14 : 7;
    const rad  = isTrunk ? 8  : 6;
    const r    = Math.max(radius * 0.09, 0.015);

    const geo  = new THREE.TubeGeometry(path, seg, r, rad, false);
    const mat  = isTrunk ? this.trunkMat : this.branchMat;
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow    = !this.device.isLowEnd;
    mesh.receiveShadow = !this.device.isLowEnd;

    if (isTrunk) this.trunkGroup.add(mesh);
    else         this.branchGroup.add(mesh);
  }

  // ── Seeded LCG RNG so the shape varies each visit ────────────────────────
  _makeRNG(seed) {
    let s = seed;
    return () => {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 0xffffffff;
    };
  }
}

