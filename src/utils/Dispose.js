/**
 * Dispose.js — Utility to recursively dispose Three.js objects
 * preventing memory leaks when removing objects from the scene.
 */

import * as THREE from 'three';

/**
 * Recursively disposes geometries, materials, and textures of a Three.js object.
 * @param {THREE.Object3D} obj
 * @param {THREE.Scene} [scene] — if provided, removes obj from scene
 */
export function disposeObject(obj, scene) {
  obj.traverse(child => {
    // Dispose geometry
    if (child.geometry) {
      child.geometry.dispose();
    }

    // Dispose material(s)
    if (child.material) {
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach(mat => {
        // Dispose all texture maps
        [
          'map', 'normalMap', 'roughnessMap', 'metalnessMap',
          'emissiveMap', 'aoMap', 'alphaMap', 'envMap',
          'lightMap', 'specularMap', 'bumpMap', 'displacementMap',
        ].forEach(key => {
          if (mat[key] instanceof THREE.Texture) {
            mat[key].dispose();
          }
        });
        mat.dispose();
      });
    }

    // Dispose render targets
    if (child.isWebGLRenderTarget) {
      child.dispose();
    }
  });

  if (scene) scene.remove(obj);
}

/**
 * Dispose an array of objects.
 * @param {THREE.Object3D[]} objects
 * @param {THREE.Scene} [scene]
 */
export function disposeAll(objects, scene) {
  objects.forEach(obj => disposeObject(obj, scene));
}

