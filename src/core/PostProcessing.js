// PostProcessing.js — Clean, natural rendering without bloom glow or distortion
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }     from 'three/examples/jsm/postprocessing/RenderPass.js';

export class PostFX {
  constructor(renderer, scene, camera, device) {
    this.renderer = renderer;
    this.device   = device;

    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));
    // Clean and clear — no neon bloom, no film grain, no chromatic aberration
  }

  setCalm(isCalm) {
    // Already completely calm
  }

  render() {
    this.composer.render();
  }

  resize() {
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }
}
