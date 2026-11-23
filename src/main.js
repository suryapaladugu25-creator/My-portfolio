/**
 * main.js — Guided Section Journey with LLM Playground Palette
 * Connects 7 scroll steps, 7-dot indicator, smooth 1.2s camera transitions,
 * per-section tree palette shifts, and internal panel scrolling.
 */

import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';

import { PALETTE }               from './utils/Palette.js';
import { DeviceDetect }         from './utils/DeviceDetect.js';
import { LoadingScreen }         from './ui/LoadingScreen.js';
import { NavbarUI }              from './ui/Navbar.js';
import { createScene, updateSceneClouds } from './core/Scene.js';
import { createRenderer }        from './core/Renderer.js';
import { CameraController }      from './core/Camera.js';
import { createLights, updateLights } from './core/Lights.js';
import { PostFX }                from './core/PostProcessing.js';
import { TreeGenerator }         from './tree/TreeGenerator.js';
import { LeavesSystem }          from './tree/Leaves.js';
import { EnvironmentFX }         from './particles/Environment.js';
import { SectionsManager }       from './sections/Sections.js';

const device = new DeviceDetect();

if (device.prefersReducedMotion) {
  const canvas = document.getElementById('three-canvas');
  if (canvas) canvas.style.display = 'none';
  const ls = document.getElementById('loading-screen');
  if (ls) ls.style.display = 'none';
  const hint = document.getElementById('tree-explore-hint');
  if (hint) hint.style.display = 'none';

  document.querySelectorAll('.card-panel').forEach(p => {
    p.style.position = 'static';
    p.style.opacity  = '1';
    p.style.visibility = 'visible';
    p.style.pointerEvents = 'auto';
  });
  const overlay = document.getElementById('cards-overlay');
  if (overlay) overlay.style.position = 'relative';
  initUIOnly();
} else if (!device.webglSupported) {
  const banner = document.getElementById('no-webgl-banner');
  if (banner) banner.style.display = 'block';
  const fb = document.getElementById('fallback-content');
  if (fb) fb.style.display = 'flex';
  const ls = document.getElementById('loading-screen');
  if (ls) ls.style.display = 'none';
  const overlay = document.getElementById('cards-overlay');
  if (overlay) overlay.style.display = 'none';
  initUIOnly();
} else {
  init3D();
}

async function init3D() {
  const loading = new LoadingScreen();
  loading.setProgress(15);

  const canvas   = document.getElementById('three-canvas');
  const scene    = createScene();
  const renderer = createRenderer(canvas, device);
  const camCtrl  = new CameraController(window.innerWidth, window.innerHeight);
  const lights   = createLights(scene, device);
  const postFX   = new PostFX(renderer, scene, camCtrl.camera, device);

  loading.setProgress(35);

  // Storybook tree
  const tree = new TreeGenerator(scene, device);
  tree.generate();
  loading.setProgress(60);

  // Dynamic color-shifting leaves system
  const leaves = new LeavesSystem(scene, tree, device);
  loading.setProgress(75);

  // Environment (meadow, cobblestones, grass, butterflies, rays)
  const env = new EnvironmentFX(scene, device);
  loading.setProgress(88);

  // Setup per-section dynamic transitions
  setupSectionColorManager(scene, lights, leaves);

  // Guided scroll & section journey manager
  const sections = new SectionsManager(scene, camCtrl, tree);
  const navbar   = new NavbarUI(sections);
  initUIOnly(sections);
  loading.setProgress(100);

  loading.complete(() => {
    // Initial hero section is shown
  });

  // Tooltip element
  const tooltip = createTooltip();

  // Raycaster for clicking tree parts
  const raycaster = new THREE.Raycaster();
  const mouse     = new THREE.Vector2(-999, -999);

  window.addEventListener('mousemove', (e) => {
    mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  canvas.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camCtrl.camera);
    const hits = raycaster.intersectObjects(sections.interactives, true);
    if (hits.length > 0) {
      let targetObj = hits[0].object;
      while (targetObj && !targetObj.userData.section && targetObj.parent) {
        targetObj = targetObj.parent;
      }
      if (targetObj && targetObj.userData.section) {
        sections.goToSection(targetObj.userData.section);
      }
    }
  });

  const hint = document.getElementById('tree-explore-hint');
  hint?.addEventListener('click', () => {
    sections.goToSection('about');
  });

  // Render loop
  const clock = new THREE.Clock();
  let raf;

  function animate() {
    raf = requestAnimationFrame(animate);
    const t  = clock.getElapsedTime();
    const dt = 0.016;

    tree.update(t);
    leaves.update(t);
    env.update(t, dt);
    camCtrl.update(dt, mouse);
    updateSceneClouds(scene.userData.clouds, dt);
    updateLights(lights, t);

    // Hover detection
    raycaster.setFromCamera(mouse, camCtrl.camera);
    const hits = raycaster.intersectObjects(sections.interactives, true);
    if (hits.length > 0) {
      let targetObj = hits[0].object;
      while (targetObj && !targetObj.userData.section && targetObj.parent) {
        targetObj = targetObj.parent;
      }
      if (targetObj && targetObj.userData.label) {
        document.body.style.cursor = 'pointer';
        showTooltip(tooltip, targetObj.userData.label);
      } else {
        document.body.style.cursor = 'default';
        hideTooltip(tooltip);
      }
    } else {
      document.body.style.cursor = 'default';
      hideTooltip(tooltip);
    }

    postFX.render();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); clock.stop(); }
    else { clock.start(); animate(); }
  });

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camCtrl.camera.aspect = window.innerWidth / window.innerHeight;
    camCtrl.camera.updateProjectionMatrix();
    postFX.resize();
  });

  animate();
}

/**
 * Manages per-section color shifts for sky, fog, lights, and foliage (~1.2s smooth transitions)
 */
function setupSectionColorManager(scene, lights, leaves) {
  window.__setSectionColors = function(sectionId) {
    const secCfg = PALETTE.sections[sectionId] || PALETTE.sections.hero;
    const skyMat = scene.userData.skyMat;

    // 1. Shift Leaves
    leaves.setSectionColors(secCfg);

    // 2. Shift Sky Dome
    if (skyMat) {
      const topCol = new THREE.Color(secCfg.skyTop);
      const btmCol = new THREE.Color(secCfg.skyHorizon);

      gsap.to(skyMat.uniforms.uTopColor.value, {
        r: topCol.r, g: topCol.g, b: topCol.b,
        duration: 1.2,
        ease: 'power2.out',
      });
      gsap.to(skyMat.uniforms.uBottomColor.value, {
        r: btmCol.r, g: btmCol.g, b: btmCol.b,
        duration: 1.2,
        ease: 'power2.out',
      });
    }

    // 3. Shift Fog
    if (scene.fog) {
      const fogCol = new THREE.Color(secCfg.fog);
      gsap.to(scene.fog.color, {
        r: fogCol.r, g: fogCol.g, b: fogCol.b,
        duration: 1.2,
      });
    }

    // 4. Shift Sun / Key Light
    if (lights.sun) {
      const sunCol = new THREE.Color(secCfg.sunColor);
      gsap.to(lights.sun.color, {
        r: sunCol.r, g: sunCol.g, b: sunCol.b,
        duration: 1.2,
      });
      gsap.to(lights.sun, {
        intensity: secCfg.sunIntensity,
        duration: 1.2,
      });
    }

    // 5. Crown glow shift
    if (lights.crownGlow) {
      const pCol = new THREE.Color(secCfg.particleColor);
      gsap.to(lights.crownGlow.color, {
        r: pCol.r, g: pCol.g, b: pCol.b,
        duration: 1.2,
      });
    }
  };
}

function createTooltip() {
  let el = document.getElementById('tooltip-3d');
  if (!el) {
    el = document.createElement('div');
    el.id = 'tooltip-3d';
    document.body.appendChild(el);
  }
  return el;
}
function showTooltip(el, label) {
  if (!label) return;
  el.textContent = label;
  el.classList.add('tt-visible');
}
function hideTooltip(el) { el.classList.remove('tt-visible'); }

window.addEventListener('mousemove', (e) => {
  const el = document.getElementById('tooltip-3d');
  if (el && el.classList.contains('tt-visible')) {
    el.style.left = `${Math.min(e.clientX + 14, window.innerWidth - 220)}px`;
    el.style.top  = `${Math.max(e.clientY - 30, 15)}px`;
  }
});

function initUIOnly(sections) {
  const html      = document.documentElement;
  const themeBtn  = document.getElementById('theme-btn');
  const themeIcon = document.getElementById('theme-icon');
  const saved     = localStorage.getItem('surya-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  if (themeIcon) themeIcon.className = saved === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';

  themeBtn?.addEventListener('click', () => {
    const t = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', t);
    localStorage.setItem('surya-theme', t);
    if (themeIcon) themeIcon.className = t === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  });

  const calmBtn = document.getElementById('calm-mode-btn');
  if (calmBtn) {
    calmBtn.addEventListener('click', () => {
      const active = document.body.classList.toggle('calm-mode');
      calmBtn.classList.toggle('is-active', active);
      window.__calmMode = active;
    });
  }

  const hamburger = document.getElementById('hamburger');
  const nbLinks   = document.getElementById('nb-links');
  hamburger?.addEventListener('click', () => {
    const open = nbLinks.classList.toggle('nb-open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.nb-link').forEach(l => l.addEventListener('click', () => {
    nbLinks?.classList.remove('nb-open');
    hamburger?.classList.remove('open');
  }));

  document.querySelectorAll('[data-fly]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.fly;
      if (sections) sections.goToSection(target);
    });
  });

  document.querySelectorAll('.contact-orb[data-href]').forEach(orb => {
    orb.addEventListener('click', () => window.open(orb.dataset.href, '_blank'));
  });

  initContactForm();
}

function initContactForm() {
  const form      = document.getElementById('contact-form');
  const nameInput = document.getElementById('cf-name');
  const emailInp  = document.getElementById('cf-email');
  const msgInp    = document.getElementById('cf-msg');
  const submitBtn = document.getElementById('cf-submit');
  const label     = document.getElementById('cf-label');
  const icon      = document.getElementById('cf-icon');
  const spin      = document.getElementById('cf-spin');
  const toast     = document.getElementById('cf-toast');
  if (!form) return;

  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validate = (inp, ok) => { inp.closest('.cf-field')?.classList.toggle('has-err', !ok); return ok; };
  [nameInput, emailInp, msgInp].forEach(i => i?.addEventListener('input', () => {
    i.closest('.cf-field')?.classList.remove('has-err');
    if (toast) toast.style.display = 'none';
  }));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const okN = validate(nameInput,  nameInput.value.trim().length > 1);
    const okE = validate(emailInp,   isEmail(emailInp.value.trim()));
    const okM = validate(msgInp,     msgInp.value.trim().length >= 10);
    if (!okN || !okE || !okM) return;
    submitBtn.disabled = true;
    label.textContent  = 'Sending…';
    if (icon) icon.style.display = 'none';
    if (spin) spin.style.display = 'inline-block';
    await new Promise(r => setTimeout(r, 900));
    submitBtn.disabled = false;
    label.textContent  = 'Send Message';
    if (icon) icon.style.display = 'inline-block';
    if (spin) spin.style.display = 'none';
    if (toast) {
      toast.className    = 'cf-toast ok';
      toast.textContent  = 'Message sent! I\'ll get back to you soon.';
      form.reset();
      setTimeout(() => { toast.style.display = 'none'; }, 5000);
    }
  });
}
