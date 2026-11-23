// DeviceDetect.js — Capability detection for adaptive quality
export class DeviceDetect {
  constructor() {
    this.webglSupported      = this._checkWebGL();
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    this.isMobile            = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isLowEnd            = this._checkLowEnd();
  }

  _checkWebGL() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  _checkLowEnd() {
    if (this.isMobile) return true;
    // Heuristic: logical CPU cores < 4 or memory < 4GB
    const cores  = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    return cores < 4 || memory < 4;
  }
}

