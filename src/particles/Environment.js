/**
 * Environment.js — Falling leaves, ground mist, and floating dust particles.
 * 60% particle count reduction, slow, gentle drift.
 */
import * as THREE from 'three';
import { PALETTE } from '../utils/Palette.js';

export class EnvironmentFX {
  constructor(scene, device) {
    this.scene  = scene;
    this.device = device;
    this._objects = [];

    this._buildFallingLeaves();
    this._buildGroundMist();
    if (!device.isLowEnd) {
      this._buildFloatingDust();
    }
  }

  // ── Falling leaves (Reduced count, gentle descent) ─────────────────────────
  _buildFallingLeaves() {
    // 60% reduction: 24 (low-end) / 65 (standard) vs previous 60 / 180
    const count = this.device.isLowEnd ? 24 : 65;
    const geo   = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const phases    = new Float32Array(count);
    const speeds    = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = Math.random() * 20 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      phases[i]  = Math.random() * Math.PI * 2;
      speeds[i]  = 0.12 + Math.random() * 0.18; // Very slow fall
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this._leafPositions = positions;
    this._leafCount     = count;
    this._leafSpeeds    = speeds;
    this._leafPhases    = phases;

    const mat = new THREE.PointsMaterial({
      color: PALETTE.hex.secondaryEmerald, // #4FB58F soft emerald
      size:  0.14,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    this._leafPoints = new THREE.Points(geo, mat);
    this.scene.add(this._leafPoints);
    this._objects.push(this._leafPoints);
  }

  // ── Ground mist plane (Calm matching deep dark tones) ─────────────────────
  _buildGroundMist() {
    const geo = new THREE.PlaneGeometry(36, 36, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: PALETTE.hex.bgDeep,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mist = new THREE.Mesh(geo, mat);
    mist.rotation.x = -Math.PI / 2;
    mist.position.y = -8.2;
    this.scene.add(mist);
    this._objects.push(mist);
  }

  // ── Floating dust motes (Reduced count, slow soft drift) ───────────────────
  _buildFloatingDust() {
    // 60% reduction: 110 vs previous 300
    const count = 110;
    const geo   = new THREE.BufferGeometry();
    const pos   = new Float32Array(count * 3);
    const ph    = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 16 - 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      ph[i] = Math.random() * Math.PI * 2;
    }

    this._dustPos    = pos;
    this._dustPhases = ph;
    this._dustCount  = count;

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: PALETTE.hex.accentGold,
      size:  0.035,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.22, // Soft, non-distracting
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this._dustPoints = new THREE.Points(geo, mat);
    this.scene.add(this._dustPoints);
    this._objects.push(this._dustPoints);
  }

  update(time, dt) {
    // Falling leaves: very slow descent
    if (this._leafPoints) {
      const pos = this._leafPositions;
      const n   = this._leafCount;
      for (let i = 0; i < n; i++) {
        const spd = this._leafSpeeds[i];
        const ph  = this._leafPhases[i];
        pos[i * 3 + 1] -= spd * dt;
        pos[i * 3]     += Math.sin(time * 0.2 + ph) * dt * 0.08;
        if (pos[i * 3 + 1] < -9) {
          pos[i * 3]     = (Math.random() - 0.5) * 22;
          pos[i * 3 + 1] = 16;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
      }
      this._leafPoints.geometry.attributes.position.needsUpdate = true;
    }

    // Floating dust: barely-moving gentle float
    if (this._dustPoints) {
      const pos = this._dustPos;
      const n   = this._dustCount;
      for (let i = 0; i < n; i++) {
        const ph = this._dustPhases[i];
        pos[i * 3]     += Math.sin(time * 0.15 + ph) * dt * 0.025;
        pos[i * 3 + 1] += Math.cos(time * 0.12 + ph) * dt * 0.02;
        pos[i * 3 + 2] += Math.sin(time * 0.18 + ph) * dt * 0.02;
      }
      this._dustPoints.geometry.attributes.position.needsUpdate = true;
    }
  }

  dispose() {
    this._objects.forEach(obj => {
      obj.geometry?.dispose();
      if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
      else obj.material?.dispose();
      this.scene.remove(obj);
    });
  }
}
