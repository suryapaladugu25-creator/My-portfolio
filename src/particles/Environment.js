/**
 * Environment.js — Falling leaves, ground mist, and floating dust particles.
 */

import * as THREE from 'three';

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

  // ── Falling leaves ─────────────────────────────────────────────────────────
  _buildFallingLeaves() {
    const count = this.device.isLowEnd ? 60 : 180;
    const geo   = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const phases    = new Float32Array(count);
    const speeds    = new Float32Array(count);
    const sizes     = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = Math.random() * 20 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      phases[i]  = Math.random() * Math.PI * 2;
      speeds[i]  = 0.3 + Math.random() * 0.5;
      sizes[i]   = 4 + Math.random() * 8;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(phases,    1));
    geo.setAttribute('aSpeeds',  new THREE.BufferAttribute(speeds,    1));

    this._leafPositions = positions;
    this._leafCount     = count;
    this._leafSpeeds    = speeds;
    this._leafPhases    = phases;

    const mat = new THREE.PointsMaterial({
      color: 0xa0c060,
      size:  0.18,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this._leafPoints = new THREE.Points(geo, mat);
    this.scene.add(this._leafPoints);
    this._objects.push(this._leafPoints);
  }

  // ── Ground mist plane ─────────────────────────────────────────────────────
  _buildGroundMist() {
    // Simple large semi-transparent plane at ground level
    const geo = new THREE.PlaneGeometry(40, 40, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x1a1a2e,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mist = new THREE.Mesh(geo, mat);
    mist.rotation.x = -Math.PI / 2;
    mist.position.y = -8.5;
    this.scene.add(mist);
    this._objects.push(mist);

    // Second thinner layer with slight offset
    const mat2 = new THREE.MeshBasicMaterial({
      color: 0x06060f,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mist2 = new THREE.Mesh(geo.clone(), mat2);
    mist2.rotation.x = -Math.PI / 2;
    mist2.position.y = -7.8;
    this.scene.add(mist2);
    this._objects.push(mist2);
  }

  // ── Floating dust motes near the camera ───────────────────────────────────
  _buildFloatingDust() {
    const count = 300;
    const geo   = new THREE.BufferGeometry();
    const pos   = new Float32Array(count * 3);
    const ph    = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 16 - 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      ph[i] = Math.random() * Math.PI * 2;
    }

    this._dustPos    = pos;
    this._dustPhases = ph;
    this._dustCount  = count;

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xf5c842,
      size:  0.045,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this._dustPoints = new THREE.Points(geo, mat);
    this.scene.add(this._dustPoints);
    this._objects.push(this._dustPoints);
  }

  // ── Update every frame ────────────────────────────────────────────────────
  update(time, dt) {
    // Falling leaves: drift down and sway
    if (this._leafPoints) {
      const pos = this._leafPositions;
      const n   = this._leafCount;
      for (let i = 0; i < n; i++) {
        const spd = this._leafSpeeds[i];
        const ph  = this._leafPhases[i];
        // Fall
        pos[i * 3 + 1] -= spd * dt;
        // Sway
        pos[i * 3]     += Math.sin(time * 0.5 + ph) * dt * 0.2;
        // Respawn at top
        if (pos[i * 3 + 1] < -10) {
          pos[i * 3]     = (Math.random() - 0.5) * 24;
          pos[i * 3 + 1] = 18;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
      }
      this._leafPoints.geometry.attributes.position.needsUpdate = true;
    }

    // Floating dust: gentle random drift
    if (this._dustPoints) {
      const pos = this._dustPos;
      const n   = this._dustCount;
      for (let i = 0; i < n; i++) {
        const ph = this._dustPhases[i];
        pos[i * 3]     += Math.sin(time * 0.3 + ph * 1.3) * dt * 0.08;
        pos[i * 3 + 1] += Math.cos(time * 0.2 + ph * 0.9) * dt * 0.05;
        pos[i * 3 + 2] += Math.sin(time * 0.4 + ph * 1.1) * dt * 0.06;
        // Keep within bounds
        if (Math.abs(pos[i * 3])     > 7)  pos[i * 3]     *= -0.98;
        if (pos[i * 3 + 1] > 16 || pos[i * 3 + 1] < -4) pos[i * 3 + 1] *= -0.98;
        if (Math.abs(pos[i * 3 + 2]) > 4)  pos[i * 3 + 2] *= -0.98;
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

