// Scene.js — Three.js scene with calm background and subtle low-intensity fog
import * as THREE from 'three';
import { PALETTE } from '../utils/Palette.js';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.hex.bgDeep);
  // Low-intensity fog matching the deep dark background
  scene.fog = new THREE.FogExp2(PALETTE.hex.bgDeep, 0.022);
  return scene;
}
