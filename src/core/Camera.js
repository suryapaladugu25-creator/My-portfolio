// Camera.js — Smooth Camera with Overview and Focus Targets
import * as THREE from 'three';
import { gsap } from 'gsap';

// Default full-tree overview
export const DEFAULT_CAMERA = {
  pos:  new THREE.Vector3(0.0, 3.5, 17.0),
  look: new THREE.Vector3(0.0, 3.0, 0.0),
};

// Section focus viewpoints (camera flies ~1s smoothly to focus on each tree part)
export const SECTION_TARGETS = {
  overview: {
    pos:  new THREE.Vector3(0.0, 3.5, 17.0),
    look: new THREE.Vector3(0.0, 3.0, 0.0),
  },
  hero: {
    pos:  new THREE.Vector3(0.0, 2.5, 15.5),
    look: new THREE.Vector3(0.0, 2.2, 0.0),
  },
  about: {
    pos:  new THREE.Vector3(2.8, 1.8, 8.5),
    look: new THREE.Vector3(0.0, 1.2, 0.0),
  },
  skills: {
    pos:  new THREE.Vector3(-4.5, 5.0, 9.0),
    look: new THREE.Vector3(-1.8, 4.2, 0.5),
  },
  projects: {
    pos:  new THREE.Vector3(4.2, 8.5, 7.8),
    look: new THREE.Vector3(2.5, 7.8, 2.2),
  },
  hacktoberfest: {
    pos:  new THREE.Vector3(3.8, 7.5, 9.2),
    look: new THREE.Vector3(1.8, 6.8, 0.5),
  },
  beyond: {
    pos:  new THREE.Vector3(0.0, -3.2, 8.5),
    look: new THREE.Vector3(0.0, -4.6, 0.0),
  },
  contact: {
    pos:  new THREE.Vector3(-1.0, -0.6, 5.5),
    look: new THREE.Vector3(-1.6, -1.2, 1.4),
  },
};

export class CameraController {
  constructor(w, h) {
    this.camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 400);
    this.camera.position.copy(DEFAULT_CAMERA.pos);

    this.currentLook = DEFAULT_CAMERA.look.clone();
    this.targetLook  = DEFAULT_CAMERA.look.clone();

    // Subtle parallax (disabled when focusing on a panel)
    this._parallax = new THREE.Vector2(0, 0);

    // Current active section
    this.activeSection = null;
    this._tween = null;

    this.camera.lookAt(this.currentLook);
  }

  /**
   * Fly camera smoothly to a section target in ~1s
   */
  flyTo(targetConfig, duration = 1.0, onComplete = null) {
    if (!targetConfig) return;

    if (this._tween) this._tween.kill();

    const targetPos = targetConfig.pos || targetConfig.cameraFocus || DEFAULT_CAMERA.pos;
    const targetLook = targetConfig.look || targetConfig.cameraLook || DEFAULT_CAMERA.look;

    this.targetLook.copy(targetLook);

    this._tween = gsap.to(this.camera.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: duration,
      ease: 'power2.out',
      onUpdate: () => {
        this.currentLook.lerp(this.targetLook, 0.08);
        this.camera.lookAt(this.currentLook);
      },
      onComplete: () => {
        this.currentLook.copy(this.targetLook);
        this.camera.lookAt(this.currentLook);
        if (onComplete) onComplete();
      }
    });
  }

  /**
   * Return camera smoothly to the full tree overview
   */
  resetToOverview(duration = 1.0, onComplete = null) {
    this.activeSection = null;
    this.flyTo(DEFAULT_CAMERA, duration, onComplete);
  }

  update(dt, mouse) {
    // Subtle mouse parallax only when in overview mode
    if (!this.activeSection && mouse && !window.__calmMode) {
      this._parallax.x += (mouse.x * 0.25 - this._parallax.x) * 0.04;
      this._parallax.y += (mouse.y * 0.15 - this._parallax.y) * 0.04;

      this.camera.position.x = DEFAULT_CAMERA.pos.x + this._parallax.x;
      this.camera.position.y = DEFAULT_CAMERA.pos.y + this._parallax.y;
    }

    this.camera.lookAt(this.currentLook);
  }
}
