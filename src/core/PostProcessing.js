// PostProcessing.js — Bloom, vignette, film grain, depth-of-field (lite on mobile)
import * as THREE from 'three';
import { EffectComposer }   from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }       from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass }  from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass }       from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FilmPass }         from 'three/examples/jsm/postprocessing/FilmPass.js';

// Custom vignette + film grain GLSL pass
const VignetteGrainShader = {
  uniforms: {
    tDiffuse:   { value: null },
    uTime:      { value: 0 },
    uVigOffset: { value: 0.6 },
    uVigDark:   { value: 1.0 },
    uGrain:     { value: 0.04 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uVigOffset;
    uniform float uVigDark;
    uniform float uGrain;
    varying vec2 vUv;

    float rand(vec2 co) { return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453); }

    void main() {
      vec4 col = texture2D(tDiffuse, vUv);

      // Vignette
      vec2 uv2 = vUv * (1.0 - vUv.yx);
      float vig = uv2.x * uv2.y * 15.0;
      vig = pow(vig, uVigOffset);
      col.rgb *= mix(1.0 - uVigDark, 1.0, vig);

      // Film grain
      float grain = rand(vUv + fract(uTime * 0.017)) * uGrain;
      col.rgb += (grain - uGrain * 0.5);

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

    // Bloom — gold glow
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      device.isLowEnd ? 0.6 : 1.2,  // strength
      0.5,                           // radius
      device.isLowEnd ? 0.9 : 0.75  // threshold
    );
    this.composer.addPass(bloom);
    this.bloom = bloom;

    // Film grain + vignette
    if (!device.isLowEnd) {
      const vigPass = new ShaderPass(VignetteGrainShader);
      this.composer.addPass(vigPass);
      this.vigPass = vigPass;
    }

    // Subtle film noise (scanlines = 0, grayscale = false, nointensity = 0)
    if (!device.isLowEnd) {
      const film = new FilmPass(0.25, false);
      this.composer.addPass(film);
    }
  }

  render() {
    if (this.vigPass) this.vigPass.uniforms.uTime.value = performance.now() * 0.001;
    this.composer.render();
  }

  resize() {
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.bloom.resolution.set(window.innerWidth, window.innerHeight);
  }
}

