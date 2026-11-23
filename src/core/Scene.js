/**
 * Scene.js — LLM Playground Style Night Sky with Deep Gradient, Soft Stars & Subtle Moon
 */
import * as THREE from 'three';
import { gsap } from 'gsap';
import { PALETTE } from '../utils/Palette.js';

export function createScene() {
  const scene = new THREE.Scene();

  const heroCfg = PALETTE.sections.hero;

  // Sky dome / background gradient
  const skyGeo = new THREE.SphereGeometry(180, 32, 16);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      uTopColor:    { value: new THREE.Color(heroCfg.skyTop) },
      uBottomColor: { value: new THREE.Color(heroCfg.skyHorizon) },
      uOffset:      { value: 12.0 },
      uExponent:    { value: 0.70 },
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

  // Soft stars in upper sky
  const starGeo = new THREE.BufferGeometry();
  const starCount = 380;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 0.75 + 0.25); // upper hemisphere
    const r = 160;
    starPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.cos(phi);
    starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xE8ECF3,
    size: 0.8,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: false,
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // Soft faint moon
  const moonGeo = new THREE.SphereGeometry(3.5, 16, 16);
  const moonMat = new THREE.MeshBasicMaterial({
    color: 0xE2E8F0,
    transparent: true,
    opacity: 0.65,
  });
  const moon = new THREE.Mesh(moonGeo, moonMat);
  moon.position.set(-35, 42, -90);
  scene.add(moon);

  // Low fog
  scene.fog = new THREE.Fog(heroCfg.fog, 25, 140);

  // Soft drifting mist layers
  scene.userData.clouds = createMist(scene);

  return scene;
}

function createMist(scene) {
  const mistGroup = new THREE.Group();
  const mistGeo   = new THREE.PlaneGeometry(32, 8);
  const mistMat   = new THREE.MeshBasicMaterial({
    color: 0x1A2236,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const mists = [];
  const configs = [
    { x: -15, y: -2.0, z: -15, scale: 1.0, speed: 0.15 },
    { x:  18, y: -1.5, z: -20, scale: 1.2, speed: 0.12 },
    { x:  -8, y: -3.0, z: -10, scale: 0.8, speed: 0.18 },
  ];

  configs.forEach(cfg => {
    const m = new THREE.Mesh(mistGeo, mistMat);
    m.position.set(cfg.x, cfg.y, cfg.z);
    m.scale.setScalar(cfg.scale);
    mistGroup.add(m);
    mists.push({ mesh: m, speed: cfg.speed });
  });

  scene.add(mistGroup);
  return mists;
}

export function updateSceneClouds(mists, dt) {
  if (!mists) return;
  mists.forEach(m => {
    m.mesh.position.x += m.speed * dt * 2.0;
    if (m.mesh.position.x > 35) {
      m.mesh.position.x = -35;
    }
  });
}
