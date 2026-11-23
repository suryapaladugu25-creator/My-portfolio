// Lights.js — Warm Natural Sunlight + Soft Sky Fill + Shadows
import * as THREE from 'three';
import { PALETTE } from '../utils/Palette.js';

export function createLights(scene, device) {
  const lights = {};

  // Ambient sky bounce — matches the light blue horizon
  lights.ambient = new THREE.AmbientLight(PALETTE.hex.ambientDay, 0.75);
  scene.add(lights.ambient);

  // Warm sunlight (#FFF4D6) from high-angle
  lights.sun = new THREE.DirectionalLight(PALETTE.hex.sunlightWarm, 1.4);
  lights.sun.position.set(12, 28, 14);
  lights.sun.castShadow = !device.isLowEnd;

  if (!device.isLowEnd) {
    lights.sun.shadow.mapSize.width  = 1024;
    lights.sun.shadow.mapSize.height = 1024;
    lights.sun.shadow.camera.near   = 0.5;
    lights.sun.shadow.camera.far    = 70;
    lights.sun.shadow.camera.left   = -16;
    lights.sun.shadow.camera.right  = 16;
    lights.sun.shadow.camera.top    = 18;
    lights.sun.shadow.camera.bottom = -16;
    lights.sun.shadow.bias          = -0.0008;
  }
  scene.add(lights.sun);

  // Soft sky-fill hemisphere light (sky blue from above, soft grass green bounce from below)
  lights.hemi = new THREE.HemisphereLight(
    PALETTE.hex.skyHorizonDay,
    0x2E6038, // grass bounce
    0.5
  );
  scene.add(lights.hemi);

  return lights;
}

export function updateLights(lights, time) {
  // Sunlight stays steady and natural
}
