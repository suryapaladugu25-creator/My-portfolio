/**
 * Environment.js — Storybook Environment (Rolling Grassy Hills, Swaying Grass Blades,
 * Stone Pathway, Butterflies, Birds, and Volumetric Light Shafts)
 */
import * as THREE from 'three';
import { PALETTE } from '../utils/Palette.js';

export class EnvironmentFX {
  constructor(scene, device) {
    this.scene  = scene;
    this.device = device;
    this._objects = [];

    this._buildTerrainAndPath();
    this._buildInstancedGrass();
    this._buildButterflies();
    this._buildLightShafts();
  }

  _buildTerrainAndPath() {
    // Rolling green meadow terrain
    const terrainGeo = new THREE.CylinderGeometry(28, 34, 3.5, 48);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > 0) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const r = Math.sqrt(x * x + z * z);
        // Soft rolling hill with depression for a winding path
        const hill = Math.sin(x * 0.12) * Math.cos(z * 0.12) * 0.8;
        const mound = Math.max(0, 1.6 - r * 0.06);
        pos.setY(i, y + mound + hill);
      }
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x3D7F48,
      roughness: 0.9,
      metalness: 0.05,
      flatShading: true,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.y = -6.8;
    terrain.receiveShadow = true;
    this.scene.add(terrain);
    this._objects.push(terrain);

    // Stone pathway winding around the tree toward the front
    const pathGeo = new THREE.DodecahedronGeometry(0.38, 1);
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0xD4C5A9, // warm storybook cobblestone
      roughness: 0.85,
      flatShading: true,
    });

    const pathPoints = [
      { x: -0.5, z: 2.2 },
      { x:  0.2, z: 3.2 },
      { x: -0.3, z: 4.4 },
      { x:  0.6, z: 5.6 },
      { x:  0.1, z: 6.8 },
      { x:  0.8, z: 8.2 },
      { x:  0.4, z: 9.6 },
      { x:  1.2, z: 11.0 },
    ];

    pathPoints.forEach((pt, idx) => {
      // 2-3 stones per step
      for (let s = 0; s < 2; s++) {
        const stone = new THREE.Mesh(pathGeo, pathMat);
        stone.position.set(
          pt.x + (s === 0 ? -0.35 : 0.35) + (Math.random() - 0.5) * 0.2,
          -5.25,
          pt.z + (Math.random() - 0.5) * 0.3
        );
        stone.scale.set(1.1 + Math.random() * 0.4, 0.28, 0.9 + Math.random() * 0.3);
        stone.rotation.y = Math.random() * Math.PI;
        stone.receiveShadow = true;
        this.scene.add(stone);
        this._objects.push(stone);
      }
    });
  }

  _buildInstancedGrass() {
    // Swaying instanced grass blades across the meadow
    const count = this.device.isLowEnd ? 400 : 1200;
    const bladeGeo = new THREE.PlaneGeometry(0.08, 0.45, 1, 2);
    // Taper grass blade tip
    const pos = bladeGeo.attributes.position;
    pos.setX(2, -0.01);
    pos.setX(3, 0.01);
    bladeGeo.computeVertexNormals();

    const grassVert = `
      attribute float aPhase;
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 p = position;
        // Sway top of blade with wind
        if (p.y > 0.0) {
          float sway = sin(uTime * 1.2 + aPhase * 6.28) * 0.12;
          p.x += sway * (p.y / 0.45);
        }
        vec4 mvPos = modelViewMatrix * instanceMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPos;
      }
    `;

    const grassFrag = `
      precision mediump float;
      uniform vec3 uBaseColor;
      uniform vec3 uTipColor;
      varying vec2 vUv;
      void main() {
        vec3 col = mix(uBaseColor, uTipColor, vUv.y);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    this._grassMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:      { value: 0 },
        uBaseColor: { value: new THREE.Color(0x286333) },
        uTipColor:  { value: new THREE.Color(0x60BA52) },
      },
      vertexShader:   grassVert,
      fragmentShader: grassFrag,
      side: THREE.DoubleSide,
    });

    const grassMesh = new THREE.InstancedMesh(bladeGeo, this._grassMat, count);
    const phases = new Float32Array(count);
    const dummy  = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      phases[i] = Math.random();
      const r = 2.5 + Math.random() * 14.0;
      const angle = Math.random() * Math.PI * 2;
      dummy.position.set(
        Math.cos(angle) * r,
        -5.18,
        Math.sin(angle) * r
      );
      dummy.scale.set(0.8 + Math.random() * 0.6, 0.7 + Math.random() * 0.7, 1);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();
      grassMesh.setMatrixAt(i, dummy.matrix);
    }

    bladeGeo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1));
    grassMesh.instanceMatrix.needsUpdate = true;
    this.scene.add(grassMesh);
    this._objects.push(grassMesh);
  }

  _buildButterflies() {
    // 3 animated fluttering butterflies looping gently near the flowers & tree base
    this._butterflies = [];
    const wingGeo = new THREE.PlaneGeometry(0.16, 0.22);
    const wingColors = [0xFBBF24, 0x60A5FA, 0xF472B6];

    for (let i = 0; i < 3; i++) {
      const bGroup = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({
        color: wingColors[i],
        side: THREE.DoubleSide,
      });

      const wingL = new THREE.Mesh(wingGeo, mat);
      wingL.position.x = -0.08;
      const wingR = new THREE.Mesh(wingGeo, mat);
      wingR.position.x = 0.08;

      bGroup.add(wingL);
      bGroup.add(wingR);

      bGroup.position.set(
        (i - 1) * 3.2 + 1.0,
        -3.5 + i * 0.8,
        3.0 + i * 1.5
      );

      this.scene.add(bGroup);
      this._objects.push(bGroup);

      this._butterflies.push({
        group: bGroup,
        wingL: wingL,
        wingR: wingR,
        basePos: bGroup.position.clone(),
        phase: i * 2.1,
      });
    }
  }

  _buildLightShafts() {
    // Soft semi-transparent sun shafts (god rays) streaming down from the sun
    const rayGeo = new THREE.CylinderGeometry(0.8, 4.5, 26, 8, 1, true);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xFFFBEB,
      transparent: true,
      opacity: 0.09,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const rays = new THREE.Group();
    rays.position.set(8, 14, 6);
    rays.rotation.z = 0.35;
    rays.rotation.x = -0.22;

    for (let r = 0; r < 3; r++) {
      const ray = new THREE.Mesh(rayGeo, rayMat);
      ray.position.set((r - 1) * 2.5, 0, (r - 1) * 1.8);
      ray.scale.set(1 + r * 0.3, 1, 1 + r * 0.2);
      rays.add(ray);
    }

    this.scene.add(rays);
    this._objects.push(rays);
    this._lightRays = rays;
  }

  update(time, dt) {
    if (this._grassMat && this._grassMat.uniforms.uTime) {
      this._grassMat.uniforms.uTime.value = time;
    }

    // Butterfly fluttering and gentle orbit
    if (this._butterflies) {
      this._butterflies.forEach(b => {
        // Fast wing flap
        const flap = Math.sin(time * 16.0 + b.phase) * 0.8;
        b.wingL.rotation.y = flap;
        b.wingR.rotation.y = -flap;

        // Slow figure-eight flight path
        b.group.position.x = b.basePos.x + Math.sin(time * 0.8 + b.phase) * 1.2;
        b.group.position.y = b.basePos.y + Math.cos(time * 1.4 + b.phase) * 0.5;
        b.group.position.z = b.basePos.z + Math.cos(time * 0.7 + b.phase) * 0.9;
        b.group.rotation.y = time * 0.8 + b.phase;
      });
    }

    // Slow subtle breathing on god rays
    if (this._lightRays) {
      this._lightRays.rotation.y = Math.sin(time * 0.05) * 0.04;
    }
  }

  dispose() {
    this._objects.forEach(obj => {
      obj.geometry?.dispose();
      this.scene.remove(obj);
    });
  }
}
