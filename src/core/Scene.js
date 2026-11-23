// Scene.js — Three.js scene with fog and background
import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060608); // near-black night sky
  scene.fog = new THREE.FogExp2(0x060608, 0.028); // exponential forest fog
  return scene;
}

