/**
 * Scene.js — Daytime Blue Sky Gradient & Drifting Clouds
 * Sky gradient from #4A90D9 (top) to #BFE3FF (horizon).
 * Soft white clouds drifting gently across the scene.
 * Seamless transitions to teal or sunset atmospheres.
 */
import * as THREE from 'three';
import { PALETTE } from '../utils/Palette.js';

export function createScene() {
  const scene = new THREE.Scene();

  // Sky dome / background gradient
  const skyGeo = new THREE.SphereGeometry(180, 32, 16);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      uTopColor:     { value: new THREE.Color(PALETTE.hex.skyTopDay) },
      uBottomColor:  { value: new THREE.Color(PALETTE.hex.skyHorizonDay) },
      uOffset:       { value: 15.0 },
      uExponent:     { value: 0.65 },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uOffset;
      uniform float uExponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + vec3(0.0, uOffset, 0.0)).y;
        gl_FragColor = vec4(mix(uBottomColor, uTopColor, max(pow(max(h, 0.0), uExponent), 0.0)), 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
  });

  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  scene.add(skyDome);
  scene.userData.skyMat = skyMat;

  // Soft atmospheric fog matching the horizon
  scene.fog = new THREE.Fog(PALETTE.hex.skyHorizonDay, 30, 160);

  // Soft white clouds
  scene.userData.clouds = createClouds(scene);

  return scene;
}

function createClouds(scene) {
  const cloudGroup = new THREE.Group();
  const cloudGeo   = new THREE.DodecahedronGeometry(2.5, 1);
  const cloudMat   = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.95,
    metalness: 0.0,
    transparent: true,
    opacity: 0.82,
    flatShading: true,
  });

  const clouds = [];
  const configs = [
    { x: -28, y: 16, z: -35, scale: 2.2, speed: 0.25 },
    { x:  14, y: 22, z: -45, scale: 2.8, speed: 0.18 },
    { x:  36, y: 14, z: -30, scale: 1.8, speed: 0.32 },
    { x: -10, y: 28, z: -55, scale: 3.4, speed: 0.15 },
  ];

  configs.forEach(cfg => {
    const puffGroup = new THREE.Group();
    // Composite puff from 3-4 spheres
    const p1 = new THREE.Mesh(cloudGeo, cloudMat);
    const p2 = new THREE.Mesh(cloudGeo, cloudMat);
    p2.position.set(1.8, -0.4, 0.5);
    p2.scale.set(0.75, 0.75, 0.75);
    const p3 = new THREE.Mesh(cloudGeo, cloudMat);
    p3.position.set(-1.6, -0.3, -0.4);
    p3.scale.set(0.8, 0.8, 0.8);

    puffGroup.add(p1);
    puffGroup.add(p2);
    puffGroup.add(p3);

    puffGroup.position.set(cfg.x, cfg.y, cfg.z);
    puffGroup.scale.setScalar(cfg.scale);

    cloudGroup.add(puffGroup);
    clouds.push({ mesh: puffGroup, speed: cfg.speed });
  });

  scene.add(cloudGroup);
  return clouds;
}

export function updateSceneClouds(clouds, dt) {
  if (!clouds) return;
  clouds.forEach(c => {
    c.mesh.position.x += c.speed * dt * 2.0;
    // Wrap around horizontally
    if (c.mesh.position.x > 60) {
      c.mesh.position.x = -60;
    }
  });
}
