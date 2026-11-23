// PostProcessing.js — Subtle bloom, high threshold, no film grain or screen shake
import * as THREE from 'three';
import { EffectComposer }   from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }       from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass }  from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass }       from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Extremely subtle, clean vignette only — zero film noise, zero grain jitter
const SoftVignetteShader = {
  uniforms: {
    tDiffuse:   { value: null },
    uVigOffset: { value: 0.8 },
    uVigDark:   { value: 0.35 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uVigOffset;
    uniform float uVigDark;
    varying vec2 vUv;

    void main() {
      vec4 col = texture2D(tDiffuse, vUv);
      vec2 uv2 = vUv * (1.0 - vUv.yx);
      float vig = uv2.x * uv2.y * 15.0;
      vig = pow(clamp(vig, 0.0, 1.0), uVigOffset);
      col.rgb *= mix(1.0 - uVigDark, 1.0, vig);
      gl_FragColor = col;
    }
  `,
};

export class PostFX {
  constructor(renderer, scene, camera, device) {
    this.renderer = renderer;
    this.device   = device;

    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));

    // Bloom — subtle, gentle glow (0.35 - 0.45) with higher threshold (0.85)
    // so only true accent lights glow, not everything
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      device.isLowEnd ? 0.25 : 0.38,  // gentle strength
      0.4,                            // radius
      0.86                            // threshold - high so only accents glow
    );
    this.composer.addPass(bloom);
    this.bloom = bloom;

    // Soft smooth vignette pass (no grain)
    if (!device.isLowEnd) {
      const vigPass = new ShaderPass(SoftVignetteShader);
      this.composer.addPass(vigPass);
    }
  }

  setCalm(isCalm) {
    if (this.bloom) {
      this.bloom.strength = isCalm ? 0.2 : (this.device.isLowEnd ? 0.25 : 0.38);
    }
  }

  render() {
    this.composer.render();
  }

  resize() {
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.bloom.resolution.set(window.innerWidth, window.innerHeight);
  }
}
