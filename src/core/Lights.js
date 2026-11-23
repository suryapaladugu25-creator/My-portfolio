// Lights.js — Warm gold key light + cool blue rim + ambient
import * as THREE from 'three';

export function createLights(scene, device) {
  const lights = {};

  // Ambient — dim night
  lights.ambient = new THREE.AmbientLight(0x1a1008, 0.6);
  scene.add(lights.ambient);

  // Warm gold key — from above, like a moon or rising sun
  lights.key = new THREE.DirectionalLight(0xf5c842, 1.8);
  lights.key.position.set(5, 20, 8);
  lights.key.castShadow = !device.isLowEnd;
  if (!device.isLowEnd) {
    lights.key.shadow.mapSize.width  = 2048;
    lights.key.shadow.mapSize.height = 2048;
    lights.key.shadow.camera.near   = 0.5;
    lights.key.shadow.camera.far    = 80;
    lights.key.shadow.camera.left   = -20;
    lights.key.shadow.camera.right  = 20;
    lights.key.shadow.camera.top    = 20;
    lights.key.shadow.camera.bottom = -20;
  }
  scene.add(lights.key);

  // Cool blue rim — moonlight from behind the tree
  lights.rim = new THREE.DirectionalLight(0x2244aa, 0.8);
  lights.rim.position.set(-8, 10, -12);
  scene.add(lights.rim);

  // Ground fill — very subtle warm bounce
  lights.fill = new THREE.HemisphereLight(0x1a0a00, 0x0a0506, 0.4);
  scene.add(lights.fill);

  // Firefly point lights (up to 6 on hi-end devices, 2 on low-end)
  lights.firePointLights = [];
  const count = device.isLowEnd ? 2 : 6;
  for (let i = 0; i < count; i++) {
    const pl = new THREE.PointLight(0xf5c842, 0, 8); // intensity 0 — animated
    pl.position.set(
      (Math.random() - 0.5) * 14,
      Math.random() * 12 + 1,
      (Math.random() - 0.5) * 14
    );
    scene.add(pl);
    lights.firePointLights.push(pl);
  }

  return lights;
}

export function updateLights(lights, time) {
  // Animate firefly point lights
  lights.firePointLights.forEach((pl, i) => {
    pl.intensity = (Math.sin(time * 1.4 + i * 1.7) * 0.5 + 0.5) * 1.2;
    pl.position.x += Math.sin(time * 0.4 + i) * 0.004;
    pl.position.y += Math.cos(time * 0.5 + i * 0.8) * 0.003;
    pl.position.z += Math.sin(time * 0.3 + i * 1.2) * 0.004;
  });

  // Slowly intensify key light as scroll progresses (driven by updateSkyColor)
  // Additional breathing effect on ambient
  lights.ambient.intensity = 0.6 + Math.sin(time * 0.15) * 0.05;
}

