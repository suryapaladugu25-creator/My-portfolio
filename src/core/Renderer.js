// Renderer.js — WebGL renderer with pixel-ratio cap and shadow maps
import * as THREE from 'three';

export function createRenderer(canvas, device) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !device.isLowEnd,
    alpha: false,
    powerPreference: 'high-performance',
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap at 2
  renderer.shadowMap.enabled = !device.isLowEnd;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  renderer.toneMapping       = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  renderer.outputColorSpace  = THREE.SRGBColorSpace;

  return renderer;
}

