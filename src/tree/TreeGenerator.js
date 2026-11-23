/**
 * TreeGenerator.js — Natural Realistic Tree
 * Thick brown trunk (#5A3E2B to #3B2B20) with procedural bark texture & natural tapering,
 * organic branching structure, roots, grassy ground with rocks and flowers,
 * plus interactive markers (roots, trunk, branches, canopy clusters, mailbox/signboard).
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
    this._buildGround();
    this._buildRoots();
    this._buildTrunk();
    this._buildBranches();
    this._buildProps();
  }

  _createBarkMaterial() {
    // Procedural organic bark shader material with natural striations & warm earthy tones
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
        // Vertical bark grooves
        float n1 = noise(vUv * vec2(4.0, 32.0));
        float n2 = noise(vUv * vec2(8.0, 64.0) + 2.5);
        float pattern = n1 * 0.7 + n2 * 0.3;

        // Subtle color modulation between #3B2B20 and #5A3E2B
        vec3 bark = mix(uBarkDark, uBarkLight, pattern);

        // Diffuse light directional approximation
        vec3 lightDir = normalize(vec3(0.5, 0.8, 0.6));
        float diff = max(dot(vNormal, lightDir), 0.25);

        // Ground ambient shading
        float groundAo = smoothstep(-6.0, 0.0, vWorldPos.y);
        gl_FragColor = vec4(bark * (diff * 0.75 + 0.35) * (0.65 + 0.35 * groundAo), 1.0);
      }
    `;

    this.barkMat = new THREE.ShaderMaterial({
      uniforms: {
        uBarkDark:  { value: new THREE.Color(PALETTE.hex.barkDark) },
        uBarkLight: { value: new THREE.Color(PALETTE.hex.barkLight) },
        uTime:      { value: 0 },
      },
      vertexShader:   barkVert,
      fragmentShader: barkFrag,
    });
  }

  _buildGround() {
    // Soft grassy mound with gentle elevation
    const groundGeo = new THREE.CylinderGeometry(18, 22, 2, 48);
    // Displace vertices slightly for natural terrain
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > 0) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const r = Math.sqrt(x * x + z * z);
        const mound = Math.max(0, 1.4 - r * 0.08);
        pos.setY(i, y + mound);
      }
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: PALETTE.hex.grassGround,
      roughness: 0.9,
      metalness: 0.05,
      flatShading: true,
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -6.5;
    ground.receiveShadow = true;
    this.group.add(ground);

    // Soft tree shadow contact ring under tree
    const shadowGeo = new THREE.RingGeometry(0.5, 6.5, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0A2012,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -5.45;
    this.group.add(shadowMesh);

    // Rocks scattered around base
    const rockGeo = new THREE.DodecahedronGeometry(0.45, 1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: PALETTE.hex.rockStone,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true,
    });

    const rockCoords = [
      { x: 3.2, z: 2.1, s: 1.2 },
      { x: -2.8, z: 3.5, s: 0.85 },
      { x: 4.0, z: -1.8, s: 1.0 },
      { x: -3.5, z: -2.5, s: 1.3 },
      { x: 1.5, z: 4.2, s: 0.7 },
    ];
    rockCoords.forEach(c => {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.set(c.x, -5.2, c.z);
      rock.scale.set(c.s, c.s * 0.7, c.s);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      rock.receiveShadow = true;
      this.group.add(rock);
    });

    // Small wildflowers around base
    const flowerGeo = new THREE.SphereGeometry(0.12, 6, 6);
    const whiteMat  = new THREE.MeshBasicMaterial({ color: PALETTE.hex.flowerWhite });
    const yellowMat = new THREE.MeshBasicMaterial({ color: PALETTE.hex.flowerYellow });

    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2 + Math.sin(i);
      const rad   = 3.5 + (i % 5) * 0.8;
      const flower = new THREE.Mesh(flowerGeo, i % 3 === 0 ? yellowMat : whiteMat);
      flower.position.set(
        Math.cos(angle) * rad,
        -5.15 + (Math.random() * 0.1),
        Math.sin(angle) * rad
      );
      flower.scale.set(1, 0.6, 1);
      this.group.add(flower);
    }
  }

  _buildRoots() {
    // Natural spreading root base — clickable for "Beyond the Screen"
    const rootBaseGroup = new THREE.Group();
    const rootConfigs = [
      { angle: 0.2, len: 4.2, r: 0.65 },
      { angle: 1.4, len: 3.8, r: 0.60 },
      { angle: 2.6, len: 4.5, r: 0.70 },
      { angle: 3.9, len: 4.0, r: 0.58 },
      { angle: 5.2, len: 4.4, r: 0.62 },
    ];

    rootConfigs.forEach(rc => {
      const start = new THREE.Vector3(0, -4.5, 0);
      const mid = new THREE.Vector3(
        Math.cos(rc.angle) * rc.len * 0.5,
        -5.0,
        Math.sin(rc.angle) * rc.len * 0.5
      );
      const end = new THREE.Vector3(
        Math.cos(rc.angle) * rc.len,
        -5.4,
        Math.sin(rc.angle) * rc.len
      );
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const geo = new THREE.TubeGeometry(curve, 16, rc.r, 8, false);

      // Taper roots into the ground
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const factor = Math.max(0.2, 1.0 - (i / pos.count));
        pos.setX(i, pos.getX(i) * factor);
        pos.setZ(i, pos.getZ(i) * factor);
      }
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, this.barkMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      rootBaseGroup.add(mesh);
    });

    // Root click target collider
    const rootColliderGeo = new THREE.CylinderGeometry(3.6, 4.4, 1.8, 16);
    const colliderMat = new THREE.MeshBasicMaterial({ visible: false });
    const rootCollider = new THREE.Mesh(rootColliderGeo, colliderMat);
    rootCollider.position.set(0, -4.8, 0);
    rootCollider.userData = {
      section: 'beyond',
      label: 'Roots & Earth — Beyond the Screen',
      cameraFocus: new THREE.Vector3(0, -3.2, 7.5),
      cameraLook:  new THREE.Vector3(0, -4.6, 0),
    };

    rootBaseGroup.add(rootCollider);
    this.group.add(rootBaseGroup);
    this.interactives.push(rootCollider);
  }

  _buildTrunk() {
    // Thick realistic trunk tapering upwards
    const trunkPoints = [
      new THREE.Vector3(0.0, -5.2,  0.0),
      new THREE.Vector3(0.1, -2.5,  0.1),
      new THREE.Vector3(-0.1,  0.0, -0.05),
      new THREE.Vector3(0.15,  2.5,  0.1),
      new THREE.Vector3(0.0,   5.0,  0.0),
      new THREE.Vector3(-0.1,  7.5, -0.1),
      new THREE.Vector3(0.0,  10.0,  0.0),
    ];
    const trunkCurve = new THREE.CatmullRomCurve3(trunkPoints);
    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 48, 1.4, 16, false);

    // Realistic taper
    const pos = trunkGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const factor = Math.max(0.35, 1.0 - (y + 5.2) / 19);
      pos.setX(i, pos.getX(i) * factor);
      pos.setZ(i, pos.getZ(i) * factor);
    }
    pos.needsUpdate = true;
    trunkGeo.computeVertexNormals();

    const trunkMesh = new THREE.Mesh(trunkGeo, this.barkMat);
    trunkMesh.castShadow = true;
    trunkMesh.receiveShadow = true;
    this.group.add(trunkMesh);

    // Trunk is clickable for "About"
    const trunkColliderGeo = new THREE.CylinderGeometry(1.6, 2.0, 7.5, 16);
    const trunkCollider = new THREE.Mesh(trunkColliderGeo, new THREE.MeshBasicMaterial({ visible: false }));
    trunkCollider.position.set(0, 0.5, 0);
    trunkCollider.userData = {
      section: 'about',
      label: 'Trunk — About Surya',
      cameraFocus: new THREE.Vector3(3.2, 1.5, 7.0),
      cameraLook:  new THREE.Vector3(0, 1.0, 0),
    };
    this.group.add(trunkCollider);
    this.interactives.push(trunkCollider);
  }

  _buildBranches() {
    // Natural spreading branches dividing upwards into canopy
    const branchConfigs = [
      // Primary lower-left branch -> "Skills"
      { id: 'skills-branch', y: 3.2, angle: Math.PI * 0.75, len: 4.8, r: 0.52, tilt: 0.35, section: 'skills', label: 'Main Branch — Skills & Tech Stack' },
      // Primary right upper branch -> "Hacktoberfest"
      { id: 'hacktoberfest-branch', y: 6.2, angle: Math.PI * 0.15, len: 5.2, r: 0.44, tilt: 0.45, section: 'hacktoberfest', label: 'Spreading Branch — Hacktoberfest & Open Source' },

      // Canopy structural branches (full organic spread)
      { y: 4.5, angle: Math.PI * 1.45, len: 4.5, r: 0.46, tilt: 0.4 },
      { y: 7.2, angle: Math.PI * 0.95, len: 4.2, r: 0.38, tilt: 0.5 },
      { y: 8.0, angle: Math.PI * 1.85, len: 4.6, r: 0.36, tilt: 0.55 },
      { y: 9.2, angle: Math.PI * 0.45, len: 3.8, r: 0.32, tilt: 0.6 },
      { y: 10.2, angle: Math.PI * 1.25, len: 3.5, r: 0.28, tilt: 0.65 },
      { y: 11.0, angle: Math.PI * 0.0, len: 3.2, r: 0.24, tilt: 0.7 },
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
      end.y += 0.4;

      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const geo = new THREE.TubeGeometry(curve, 18, cfg.r, 8, false);

      const branchMesh = new THREE.Mesh(geo, this.barkMat);
      branchMesh.castShadow = true;
      branchMesh.receiveShadow = true;
      this.group.add(branchMesh);

      // If branch is interactive section
      if (cfg.section) {
        const colGeo = new THREE.CylinderGeometry(1.2, 1.2, cfg.len * 0.9, 8);
        const colMesh = new THREE.Mesh(colGeo, new THREE.MeshBasicMaterial({ visible: false }));
        colMesh.position.copy(mid);
        colMesh.userData = {
          section: cfg.section,
          label: cfg.label,
          cameraFocus: new THREE.Vector3(end.x * 1.3, end.y + 0.5, end.z * 1.3 + 4.5),
          cameraLook:  end.clone(),
        };
        this.group.add(colMesh);
        this.interactives.push(colMesh);
      }

      this.tipPositions.push(end);
    });

    // Canopy Fruit / Foliage cluster for "Projects"
    this._buildProjectCluster();
  }

  _buildProjectCluster() {
    // A lush cluster of apples/peaches hanging from the canopy
    const fruitGroup = new THREE.Group();
    const clusterCenter = new THREE.Vector3(2.5, 7.8, 2.2);

    const fruitGeo = new THREE.SphereGeometry(0.32, 10, 10);
    const fruitMat = new THREE.MeshStandardMaterial({
      color: 0xE05342, // natural ripe red/amber fruit
      roughness: 0.4,
      metalness: 0.05,
    });

    const offsets = [
      { x: 0, y: 0, z: 0 },
      { x: 0.5, y: -0.3, z: 0.3 },
      { x: -0.4, y: -0.2, z: 0.4 },
      { x: 0.2, y: -0.5, z: -0.3 },
    ];

    offsets.forEach(off => {
      const fruit = new THREE.Mesh(fruitGeo, fruitMat);
      fruit.position.set(clusterCenter.x + off.x, clusterCenter.y + off.y, clusterCenter.z + off.z);
      fruit.scale.set(1, 1.1, 1);
      fruit.castShadow = true;
      fruitGroup.add(fruit);
    });

    const clusterColliderGeo = new THREE.SphereGeometry(1.4, 8, 8);
    const clusterCollider = new THREE.Mesh(clusterColliderGeo, new THREE.MeshBasicMaterial({ visible: false }));
    clusterCollider.position.copy(clusterCenter);
    clusterCollider.userData = {
      section: 'projects',
      label: 'Canopy Orchard — Featured Projects',
      cameraFocus: new THREE.Vector3(clusterCenter.x + 1.2, clusterCenter.y + 0.3, clusterCenter.z + 4.2),
      cameraLook:  clusterCenter.clone(),
    };

    fruitGroup.add(clusterCollider);
    this.group.add(fruitGroup);
    this.interactives.push(clusterCollider);
  }

  _buildProps() {
    // Natural wooden signboard / birdhouse attached to trunk base for "Contact"
    const propGroup = new THREE.Group();
    propGroup.position.set(-1.6, -1.8, 1.4);
    propGroup.rotation.y = 0.45;

    // Post
    const postGeo = new THREE.CylinderGeometry(0.08, 0.09, 2.8, 8);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x6E4C33, roughness: 0.85 });
    const post = new THREE.Mesh(postGeo, woodMat);
    propGroup.add(post);

    // Signboard plank
    const plankGeo = new THREE.BoxGeometry(1.2, 0.45, 0.1);
    const plank = new THREE.Mesh(plankGeo, woodMat);
    plank.position.set(0, 0.8, 0);
    propGroup.add(plank);

    // Little bird resting on top of signboard
    const birdBodyGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const birdMat = new THREE.MeshStandardMaterial({ color: 0x3B82F6, roughness: 0.6 });
    const bird = new THREE.Mesh(birdBodyGeo, birdMat);
    bird.position.set(0.3, 1.12, 0);
    bird.scale.set(1, 0.8, 1.4);
    propGroup.add(bird);

    // Collider for Contact
    const contactColGeo = new THREE.BoxGeometry(1.6, 2.8, 1.2);
    const contactCollider = new THREE.Mesh(contactColGeo, new THREE.MeshBasicMaterial({ visible: false }));
    contactCollider.userData = {
      section: 'contact',
      label: 'Signboard & Bird — Get In Touch',
      cameraFocus: new THREE.Vector3(-0.5, -1.2, 4.5),
      cameraLook:  new THREE.Vector3(-1.4, -1.5, 1.2),
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
