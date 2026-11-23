// Lights.js — Warm gold key light + cool dim rim light + subtle ambient
import * as THREE from 'three';
import { PALETTE } from '../utils/Palette.js';

export function createLights(scene, device) {
  const lights = {};

  // Ambient — calm, dim deep background tone
  lights.ambient = new THREE.AmbientLight(PALETTE.hex.bgGradientMid, 0.55);
  scene.add(lights.ambient);

  // Warm key light — gentle warm gold (#E6B450), soft intensity
  lights.key = new THREE.DirectionalLight(PALETTE.hex.accentGold, 1.15);
  lights.key.position.set(5, 18, 8);
  lights.key.castShadow = !device.isLowEnd;
  if (!device.isLowEnd) {
    lights.key.shadow.mapSize.width  = 1024;
    lights.key.shadow.mapSize.height = 1024;
    lights.key.shadow.camera.near   = 0.5;
    lights.key.shadow.camera.far    = 70;
    lights.key.shadow.camera.left   = -18;
    lights.key.shadow.camera.right  = 18;
    lights.key.shadow.camera.top    = 18;
    lights.key.shadow.camera.bottom = -18;
  }
  scene.add(lights.key);

  // Cool, dim rim light — soft sky blue (#8FB8E8), not oversaturated
  lights.rim = new THREE.DirectionalLight(PALETTE.hex.tertiarySky, 0.45);
  lights.rim.position.set(-8, 12, -12);
  scene.add(lights.rim);

  // Ground bounce fill — very quiet dark tone
  lights.fill = new THREE.HemisphereLight(0x182028, 0x0B0F14, 0.3);
  scene.add(lights.fill);

  // Firefly point lights — reduced count, very subtle warmth
  lights.firePointLights = [];
  const count = device.isLowEnd ? 1 : 3;
  for (let i = 0; i < count; i++) {
    const pl = new THREE.PointLight(PALETTE.hex.accentGold, 0.3, 6);
    pl.position.set(
      (Math.random() - 0.5) * 12,
      Math.random() * 10 + 2,
      (Math.random() - 0.5) * 12
    );
    scene.add(pl);
    lights.firePointLights.push(pl);
  }

  return lights;
}

export function updateLights(lights, time) {
  // Gentle, slow breathing of firefly lights
  lights.firePointLights.forEach((pl, i) => {
    pl.intensity = 0.2 + (Math.sin(time * 0.5 + i * 1.8) * 0.5 + 0.5) * 0.25;
    pl.position.x += Math.sin(time * 0.15 + i) * 0.001;
    pl.position.y += Math.cos(time * 0.2 + i * 0.8) * 0.001;
  });
}
