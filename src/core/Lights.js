// Lights.js — Warm Key Light + Cool Rim Light + Warm Bark Light (No harsh bloom)
import * as THREE from 'three';
import { PALETTE } from '../utils/Palette.js';

export function createLights(scene, device) {
  const lights = {};
  const heroCfg = PALETTE.sections.hero;

  // Ambient — matches dark horizon with soft navy fill
  lights.ambient = new THREE.AmbientLight(heroCfg.skyHorizon, 0.85);
  scene.add(lights.ambient);

  // Warm key light — directional sunlight/moonlight
  lights.sun = new THREE.DirectionalLight(heroCfg.sunColor, heroCfg.sunIntensity);
  lights.sun.position.set(10, 24, 12);
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

  // Cool rim light from behind so the tree silhouette never looks flat black
  lights.rim = new THREE.DirectionalLight(0x40608A, 0.75);
  lights.rim.position.set(-8, 14, -12);
  scene.add(lights.rim);

  // Warm bark fill light from low angle — highlights bark details (#8A6244)
  lights.barkFill = new THREE.PointLight(PALETTE.hex.accentAmber, 0.65, 14);
  lights.barkFill.position.set(2, 0.5, 4.5);
  scene.add(lights.barkFill);

  // Orange crown glow for tree canopy
  lights.crownGlow = new THREE.PointLight(PALETTE.hex.accentOrange, 0.5, 16);
  lights.crownGlow.position.set(0, 11, 2);
  scene.add(lights.crownGlow);

  return lights;
}

export function updateLights(lights, time) {
  // Gentle breathing of point lights
  if (lights.barkFill) {
    lights.barkFill.intensity = 0.55 + Math.sin(time * 0.8) * 0.12;
  }
}
