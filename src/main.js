/**
 * main.js — Natural 3D Tree Portfolio with Click-To-Open Sections
 * Daytime blue sky, realistic tree, instanced green canopy,
 * click tree parts or nav links to focus camera & open panels.
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

  // Realistic natural tree with bark, roots, branches, and props
  const tree = new TreeGenerator(scene, device);
  tree.generate();
  loading.setProgress(60);

  // Instanced multi-toned green foliage canopy
  const leaves = new LeavesSystem(scene, tree, device);
  loading.setProgress(75);

  // Storybook environment: rolling hills, stone path, swaying grass, butterflies, god rays
  const env = new EnvironmentFX(scene, device);
  loading.setProgress(88);

  // Sections and interaction manager
  const sections = new SectionsManager(scene, camCtrl, tree);
  const navbar   = new NavbarUI(sections);
  initUIOnly(sections, scene, lights);
  loading.setProgress(100);

  loading.complete(() => {
    // Start at overview; user can click the tree or navbar
  });

  // Tooltip element for hovering clickable parts
  const tooltip = createTooltip();

  // Raycaster for clicking & hovering tree parts
  const raycaster = new THREE.Raycaster();
  const mouse     = new THREE.Vector2(-999, -999);

  window.addEventListener('mousemove', (e) => {
    mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Canvas interaction
  canvas.addEventListener('click', (e) => {
    raycaster.setFromCamera(mouse, camCtrl.camera);
    const hits = raycaster.intersectObjects(sections.interactives, true);
    if (hits.length > 0) {
      // Find nearest hit with section data
      let targetObj = hits[0].object;
      while (targetObj && !targetObj.userData.section && targetObj.parent) {
        targetObj = targetObj.parent;
      }
      if (targetObj && targetObj.userData.section) {
        sections.openSection(targetObj.userData.section, targetObj.userData);
      }
    }
  });

  // Explore hint click opens hero
  const hint = document.getElementById('tree-explore-hint');
  hint?.addEventListener('click', () => {
    sections.openSection('hero');
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

    // Hover detection on tree parts
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

// ── Sky Atmosphere Handler (Smooth Transitions) ─────────────────────────────
function setupSkyAtmosphere(scene, lights) {
  window.__setSkyAtmosphere = function(section) {
    const skyMat = scene.userData.skyMat;
    if (!skyMat) return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    let topHex    = PALETTE.hex.skyTopDay;
    let bottomHex = PALETTE.hex.skyHorizonDay;

    if (isDark) {
      topHex    = PALETTE.hex.skyTopDark;
      bottomHex = PALETTE.hex.skyHorizonDark;
    } else {
      if (section === 'about' || section === 'skills') {
        topHex    = PALETTE.hex.skyTealTop;
        bottomHex = PALETTE.hex.skyTealHorizon;
      } else if (section === 'beyond') {
        topHex    = PALETTE.hex.skySunsetTop;
        bottomHex = PALETTE.hex.skySunsetHorizon;
      }
    }

    gsap.to(skyMat.uniforms.uTopColor.value, {
      r: new THREE.Color(topHex).r,
      g: new THREE.Color(topHex).g,
      b: new THREE.Color(topHex).b,
      duration: 1.2,
      ease: 'power2.out',
    });

    gsap.to(skyMat.uniforms.uBottomColor.value, {
      r: new THREE.Color(bottomHex).r,
      g: new THREE.Color(bottomHex).g,
      b: new THREE.Color(bottomHex).b,
      duration: 1.2,
      ease: 'power2.out',
    });

    if (scene.fog) {
      gsap.to(scene.fog.color, {
        r: new THREE.Color(bottomHex).r,
        g: new THREE.Color(bottomHex).g,
        b: new THREE.Color(bottomHex).b,
        duration: 1.2,
      });
    }
  };
}

// ── Tooltip ──────────────────────────────────────────────────────────────────
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

// ── UI-only init (Theme toggle, Calm Mode, Contact Form, Fly buttons) ─────────
function initUIOnly(sections, scene, lights) {
  const html      = document.documentElement;
  const themeBtn  = document.getElementById('theme-btn');
  const themeIcon = document.getElementById('theme-icon');
  const saved     = localStorage.getItem('surya-theme') || 'light';
  html.setAttribute('data-theme', saved);
  if (themeIcon) themeIcon.className = saved === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';

  if (scene && lights) {
    setupSkyAtmosphere(scene, lights);
  }

  themeBtn?.addEventListener('click', () => {
    const t = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', t);
    localStorage.setItem('surya-theme', t);
    if (themeIcon) themeIcon.className = t === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    if (window.__setSkyAtmosphere && sections) {
      window.__setSkyAtmosphere(sections.activeSection || 'overview');
    }
  });

  const calmBtn = document.getElementById('calm-mode-btn');
  if (calmBtn) {
    calmBtn.addEventListener('click', () => {
      const active = document.body.classList.toggle('calm-mode');
      calmBtn.classList.toggle('is-active', active);
      window.__calmMode = active;
    });
  }

  // Hamburger
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

  // CTA buttons inside panels
  document.querySelectorAll('[data-fly]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.fly;
      if (sections) sections.openSection(target);
    });
  });

  // Contact links
  document.querySelectorAll('.contact-orb[data-href]').forEach(orb => {
    orb.addEventListener('click', () => window.open(orb.dataset.href, '_blank'));
  });

  // Contact form
  initContactForm();

  // Scroll shadow on navbar
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('nb-scrolled', window.scrollY > 10);
  });
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
