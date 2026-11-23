/**
 * TreeGenerator.js — Storybook Tree (Painterly, Warm, Hand-Crafted)
 * Features:
 *  - Thick curving trunk with wide buttress root flares
 *  - Procedural bark texture & normal perturbations (#5A3E2B to #3B2B20)
 *  - Moss patches on lower trunk and roots (#3E7843)
 *  - Knots and bark whorls on the trunk
 *  - Spreading curved branches with secondary branches
 *  - Hanging wooden sign & rope swing with tire
 *  - Interactive collision zones for all 7 sections
 */
import * as THREE from 'three';
import { PALETTE } from '../utils/Palette.js';

export class TreeGenerator {
  constructor(scene, device) {
    this.scene  = scene;
    this.device = device;

    this.group        = new THREE.Group();
    this.interactives = []; // clickable objects for sections
    this.tipPositions = []; // for canopy foliage placement

    scene.add(this.group);
  }

  generate() {
    this._createBarkMaterial();
    this._buildRootFlareAndGround();
    this._buildTrunkWithKnots();
    this._buildBranches();
    this._buildRopeSwing();
    this._buildSignboardAndBird();
  }

  _createBarkMaterial() {
    // Rich painterly bark shader with vertical fissures, knots, normal perturbation & moss blending
    const barkVert = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const barkFrag = `
      precision mediump float;
      uniform vec3 uBarkDark;
      uniform vec3 uBarkLight;
      uniform vec3 uMossColor;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f*f*(3.0-2.0*f);
        return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
                   mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
      }

      void main() {
        // Vertical bark grooves & painterly ridges
        float n1 = noise(vUv * vec2(6.0, 38.0));
        float n2 = noise(vUv * vec2(14.0, 72.0) + 1.7);
        float barkPattern = n1 * 0.7 + n2 * 0.3;

        // Base wood tone
        vec3 wood = mix(uBarkDark, uBarkLight, barkPattern);

        // Warm directional sunlight
        vec3 sunDir = normalize(vec3(0.55, 0.75, 0.45));
        float diff = max(dot(vNormal, sunDir), 0.22);

        // Soft painterly wrap light
        float wrap = max(dot(vNormal, sunDir) * 0.5 + 0.5, 0.0);
        vec3 litWood = wood * (diff * 0.75 + wrap * 0.35 + 0.15);

        // Moss accumulation on north/lower damp surfaces
        float mossNoise = noise(vWorldPos.xz * 0.8 + vec2(vWorldPos.y * 0.4, 0.0));
        float heightFactor = smoothstep(1.5, -4.5, vWorldPos.y);
        float angleFactor = max(0.0, vNormal.y * 0.6 - vNormal.z * 0.4);
        float mossMask = smoothstep(0.42, 0.75, mossNoise * heightFactor + angleFactor * 0.4);

        vec3 finalColor = mix(litWood, uMossColor * (diff * 0.6 + 0.45), mossMask * 0.75);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    this.barkMat = new THREE.ShaderMaterial({
      uniforms: {
        uBarkDark:  { value: new THREE.Color(PALETTE.hex.barkDark) },
        uBarkLight: { value: new THREE.Color(PALETTE.hex.barkLight) },
        uMossColor: { value: new THREE.Color(0x3B6B38) },
        uTime:      { value: 0 },
      },
      vertexShader:   barkVert,
      fragmentShader: barkFrag,
    });
  }

  _buildRootFlareAndGround() {
    // 6 prominent buttress root flares that grip into the ground
    const rootFlareConfigs = [
      { angle: 0.15, len: 4.8, r: 0.95 },
      { angle: 1.15, len: 4.4, r: 0.85 },
      { angle: 2.15, len: 5.2, r: 1.05 },
      { angle: 3.35, len: 4.6, r: 0.90 },
      { angle: 4.45, len: 5.0, r: 0.98 },
      { angle: 5.45, len: 4.3, r: 0.82 },
    ];

    rootFlareConfigs.forEach(rc => {
      const start = new THREE.Vector3(0, -2.5, 0);
      const mid = new THREE.Vector3(
        Math.cos(rc.angle) * rc.len * 0.5,
        -4.2,
        Math.sin(rc.angle) * rc.len * 0.5
      );
      const end = new THREE.Vector3(
        Math.cos(rc.angle) * rc.len,
        -5.6,
        Math.sin(rc.angle) * rc.len
      );
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const geo = new THREE.TubeGeometry(curve, 20, rc.r, 10, false);

      // Taper roots outward
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const factor = Math.max(0.25, 1.0 - (i / pos.count) * 0.75);
        pos.setX(i, pos.getX(i) * factor);
        pos.setZ(i, pos.getZ(i) * factor);
      }
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, this.barkMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.group.add(mesh);
    });

    // Root click target for "Beyond the Screen"
    const rootColliderGeo = new THREE.CylinderGeometry(4.2, 5.2, 2.2, 16);
    const colliderMat = new THREE.MeshBasicMaterial({ visible: false });
    const rootCollider = new THREE.Mesh(rootColliderGeo, colliderMat);
    rootCollider.position.set(0, -4.8, 0);
    rootCollider.userData = {
      section: 'beyond',
      label: 'Roots & Earth — Beyond the Screen',
      cameraFocus: new THREE.Vector3(0, -2.6, 11.5),
      cameraLook:  new THREE.Vector3(0, -4.8, 0),
    };
    this.group.add(rootCollider);
    this.interactives.push(rootCollider);
  }

  _buildTrunkWithKnots() {
    // Thick organic trunk curve with subtle bends and character
    const trunkPoints = [
      new THREE.Vector3( 0.0, -5.2,  0.0),
      new THREE.Vector3( 0.25, -2.5,  0.15),
      new THREE.Vector3(-0.20,  0.5, -0.15),
      new THREE.Vector3( 0.30,  3.5,  0.20),
      new THREE.Vector3(-0.15,  6.8, -0.10),
      new THREE.Vector3( 0.10,  9.5,  0.15),
      new THREE.Vector3( 0.0,  12.0,  0.0),
    ];
    const trunkCurve = new THREE.CatmullRomCurve3(trunkPoints);
    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 56, 1.85, 18, false);

    // Tapering
    const pos = trunkGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const factor = Math.max(0.42, 1.0 - (y + 5.2) / 22);
      pos.setX(i, pos.getX(i) * factor);
      pos.setZ(i, pos.getZ(i) * factor);
    }
    pos.needsUpdate = true;
    trunkGeo.computeVertexNormals();

    const trunkMesh = new THREE.Mesh(trunkGeo, this.barkMat);
    trunkMesh.castShadow = true;
    trunkMesh.receiveShadow = true;
    this.group.add(trunkMesh);

    // Tree Knots (small bulging whorls on the trunk for organic detail)
    const knotGeo = new THREE.SphereGeometry(0.35, 8, 8);
    const knotOffsets = [
      { x: -0.9, y: 1.2, z: 0.5, sx: 0.8, sy: 1.2, sz: 0.5 },
      { x: 0.85, y: -0.6, z: 0.7, sx: 0.9, sy: 1.4, sz: 0.6 },
      { x: 0.2, y: 3.8, z: -0.9, sx: 0.7, sy: 1.1, sz: 0.5 },
    ];
    knotOffsets.forEach(k => {
      const knot = new THREE.Mesh(knotGeo, this.barkMat);
      knot.position.set(k.x, k.y, k.z);
      knot.scale.set(k.sx, k.sy, k.sz);
      knot.rotation.set(0.3, 0.4, 0.2);
      this.group.add(knot);
    });

    // Trunk click collider for "About"
    const trunkColliderGeo = new THREE.CylinderGeometry(2.0, 2.4, 8.5, 16);
    const trunkCollider = new THREE.Mesh(trunkColliderGeo, new THREE.MeshBasicMaterial({ visible: false }));
    trunkCollider.position.set(0, 1.0, 0);
    trunkCollider.userData = {
      section: 'about',
      label: 'Trunk — About Surya',
      cameraFocus: new THREE.Vector3(4.5, 1.8, 12.0),
      cameraLook:  new THREE.Vector3(0, 1.0, 0),
    };
    this.group.add(trunkCollider);
    this.interactives.push(trunkCollider);
  }

  _buildBranches() {
    // Spreading canopy branches that split naturally
    const mainBranches = [
      // Major left branch -> "Skills"
      { id: 'skills-branch', y: 4.2, angle: Math.PI * 0.78, len: 6.2, r: 0.65, tilt: 0.38, section: 'skills', label: 'Main Branch — Skills & Tech Stack' },
      // Major upper-right branch -> "Hacktoberfest"
      { id: 'hacktoberfest-branch', y: 7.4, angle: Math.PI * 0.16, len: 6.5, r: 0.55, tilt: 0.46, section: 'hacktoberfest', label: 'Spreading Branch — Hacktoberfest & Open Source' },

      // Canopy structural limbs
      { y: 5.5, angle: Math.PI * 1.42, len: 5.8, r: 0.58, tilt: 0.42 },
      { y: 8.5, angle: Math.PI * 0.92, len: 5.4, r: 0.46, tilt: 0.52 },
      { y: 9.6, angle: Math.PI * 1.82, len: 5.6, r: 0.44, tilt: 0.56 },
      { y: 11.0, angle: Math.PI * 0.48, len: 4.8, r: 0.38, tilt: 0.62 },
      { y: 11.8, angle: Math.PI * 1.25, len: 4.5, r: 0.34, tilt: 0.66 },
      { y: 12.6, angle: Math.PI * 0.05, len: 4.2, r: 0.30, tilt: 0.72 },
    ];

    mainBranches.forEach(cfg => {
      const start = new THREE.Vector3(0, cfg.y, 0);
      const dir = new THREE.Vector3(
        Math.cos(cfg.angle),
        cfg.tilt,
        Math.sin(cfg.angle)
      ).normalize();

      const mid = start.clone().add(dir.clone().multiplyScalar(cfg.len * 0.5));
      mid.x += (Math.random() - 0.5) * 0.5;
      mid.z += (Math.random() - 0.5) * 0.5;

      const end = start.clone().add(dir.clone().multiplyScalar(cfg.len));
      end.y += 0.5;

      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const geo = new THREE.TubeGeometry(curve, 22, cfg.r, 8, false);

      const branchMesh = new THREE.Mesh(geo, this.barkMat);
      branchMesh.castShadow = true;
      branchMesh.receiveShadow = true;
      this.group.add(branchMesh);

      // Secondary twig offshoots for natural canopy volume
      const subDir1 = new THREE.Vector3(dir.z * 0.6, 0.4, -dir.x * 0.6).normalize();
      const subEnd1 = mid.clone().add(subDir1.multiplyScalar(2.6));
      const subCurve1 = new THREE.CatmullRomCurve3([mid, subEnd1]);
      const subGeo1 = new THREE.TubeGeometry(subCurve1, 10, cfg.r * 0.5, 6, false);
      const subMesh1 = new THREE.Mesh(subGeo1, this.barkMat);
      this.group.add(subMesh1);
      this.tipPositions.push(subEnd1);

      if (cfg.section) {
        const colGeo = new THREE.CylinderGeometry(1.6, 1.6, cfg.len * 0.9, 8);
        const colMesh = new THREE.Mesh(colGeo, new THREE.MeshBasicMaterial({ visible: false }));
        colMesh.position.copy(mid);
        colMesh.userData = {
          section: cfg.section,
          label: cfg.label,
          cameraFocus: new THREE.Vector3(end.x * 1.35, end.y + 0.5, end.z * 1.35 + 5.5),
          cameraLook:  end.clone(),
        };
        this.group.add(colMesh);
        this.interactives.push(colMesh);
      }

      this.tipPositions.push(end);
    });

    // Canopy Fruit Orchard for "Projects"
    this._buildProjectCluster();
  }

  _buildProjectCluster() {
    // Beautiful storybook apples with brown stems, small leaves, and soft highlights
    const fruitGroup = new THREE.Group();
    const clusterCenter = new THREE.Vector3(3.2, 8.4, 2.5);

    const appleGeo = new THREE.SphereGeometry(0.36, 14, 14);
    // Depress top of apple slightly for authentic shape
    const pos = appleGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > 0.25) {
        pos.setY(i, y * 0.85);
      }
    }
    appleGeo.computeVertexNormals();

    const appleMat = new THREE.MeshStandardMaterial({
      color: 0xD83A32, // rich apple crimson
      roughness: 0.28,
      metalness: 0.08,
    });

    const stemGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.22, 6);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x4A2E18, roughness: 0.8 });

    const appleLeafGeo = new THREE.PlaneGeometry(0.18, 0.12);
    const appleLeafMat = new THREE.MeshStandardMaterial({
      color: 0x3FA65F,
      side: THREE.DoubleSide,
      roughness: 0.4,
    });

    const offsets = [
      { x:  0.0, y:  0.0, z:  0.0, s: 1.05 },
      { x:  0.65, y: -0.35, z:  0.35, s: 0.95 },
      { x: -0.55, y: -0.25, z:  0.45, s: 1.00 },
      { x:  0.25, y: -0.65, z: -0.35, s: 0.90 },
      { x: -0.20, y:  0.45, z: -0.25, s: 0.85 },
    ];

    offsets.forEach(off => {
      const singleApple = new THREE.Group();

      const appleMesh = new THREE.Mesh(appleGeo, appleMat);
      appleMesh.castShadow = true;
      singleApple.add(appleMesh);

      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.35;
      stem.rotation.z = 0.15;
      singleApple.add(stem);

      const leaf = new THREE.Mesh(appleLeafGeo, appleLeafMat);
      leaf.position.set(0.08, 0.42, 0);
      leaf.rotation.set(0.4, 0.2, 0.6);
      singleApple.add(leaf);

      singleApple.position.set(clusterCenter.x + off.x, clusterCenter.y + off.y, clusterCenter.z + off.z);
      singleApple.scale.setScalar(off.s);

      fruitGroup.add(singleApple);
    });

    const clusterColliderGeo = new THREE.SphereGeometry(1.8, 8, 8);
    const clusterCollider = new THREE.Mesh(clusterColliderGeo, new THREE.MeshBasicMaterial({ visible: false }));
    clusterCollider.position.copy(clusterCenter);
    clusterCollider.userData = {
      section: 'projects',
      label: 'Canopy Apples — Featured Projects',
      cameraFocus: new THREE.Vector3(clusterCenter.x + 1.6, clusterCenter.y + 0.3, clusterCenter.z + 5.2),
      cameraLook:  clusterCenter.clone(),
    };

    fruitGroup.add(clusterCollider);
    this.group.add(fruitGroup);
    this.interactives.push(clusterCollider);
  }

  _buildRopeSwing() {
    // Storybook detail: rope swing hanging from the low left branch with a wooden seat
    const swingGroup = new THREE.Group();
    swingGroup.position.set(-3.2, 3.8, 0.8);

    const ropeGeo = new THREE.CylinderGeometry(0.02, 0.02, 3.6, 6);
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0x9B8065, roughness: 0.9 });

    const ropeL = new THREE.Mesh(ropeGeo, ropeMat);
    ropeL.position.set(-0.35, -1.8, 0);
    swingGroup.add(ropeL);

    const ropeR = new THREE.Mesh(ropeGeo, ropeMat);
    ropeR.position.set(0.35, -1.8, 0);
    swingGroup.add(ropeR);

    // Wooden plank seat
    const seatGeo = new THREE.BoxGeometry(0.9, 0.08, 0.3);
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x6E4C33, roughness: 0.85 });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.set(0, -3.6, 0);
    seat.castShadow = true;
    swingGroup.add(seat);

    this.group.add(swingGroup);
  }

  _buildSignboardAndBird() {
    // Hanging wooden rustic signboard & little bird for "Contact"
    const propGroup = new THREE.Group();
    propGroup.position.set(-2.2, -1.6, 1.8);
    propGroup.rotation.y = 0.45;

    // Wooden post
    const postGeo = new THREE.CylinderGeometry(0.09, 0.11, 3.2, 8);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5C3E26, roughness: 0.85 });
    const post = new THREE.Mesh(postGeo, woodMat);
    post.castShadow = true;
    propGroup.add(post);

    // Cross beam & hanging signboard plank
    const plankGeo = new THREE.BoxGeometry(1.4, 0.55, 0.1);
    const plank = new THREE.Mesh(plankGeo, woodMat);
    plank.position.set(0, 0.9, 0);
    plank.castShadow = true;
    propGroup.add(plank);

    // Cute storybook bird on the signboard
    const birdGroup = new THREE.Group();
    birdGroup.position.set(0.35, 1.25, 0);

    const bodyGeo = new THREE.SphereGeometry(0.14, 8, 8);
    const birdMat = new THREE.MeshStandardMaterial({ color: 0x2563EB, roughness: 0.5 });
    const birdBody = new THREE.Mesh(bodyGeo, birdMat);
    birdBody.scale.set(1, 0.8, 1.4);
    birdGroup.add(birdBody);

    const beakGeo = new THREE.ConeGeometry(0.04, 0.12, 4);
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B });
    const beak = new THREE.Mesh(beakGeo, beakMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0, 0.18);
    birdGroup.add(beak);

    propGroup.add(birdGroup);

    // Contact Collider
    const contactColGeo = new THREE.BoxGeometry(2.0, 3.4, 1.4);
    const contactCollider = new THREE.Mesh(contactColGeo, new THREE.MeshBasicMaterial({ visible: false }));
    contactCollider.userData = {
      section: 'contact',
      label: 'Signboard & Bird — Get In Touch',
      cameraFocus: new THREE.Vector3(-1.8, -0.6, 8.5),
      cameraLook:  new THREE.Vector3(-2.2, -1.2, 1.4),
    };
    propGroup.add(contactCollider);

    this.group.add(propGroup);
    this.interactives.push(contactCollider);
  }

  update(time) {
    if (this.barkMat && this.barkMat.uniforms) {
      this.barkMat.uniforms.uTime.value = time;
    }
  }
}
