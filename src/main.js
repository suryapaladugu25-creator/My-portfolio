/**
 * main.js — Entry point for Surya Portfolio 3D
 * Refined palette, calm motion, Calm Mode toggle, smooth night→dawn transition
 */

import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { PALETTE }               from './utils/Palette.js';
import { DeviceDetect }         from './utils/DeviceDetect.js';
import { LoadingScreen }         from './ui/LoadingScreen.js';
import { NavbarUI }              from './ui/Navbar.js';
import { CustomCursor }          from './ui/Cursor.js';
import { ScrollVine }            from './ui/ScrollVine.js';
import { createScene }           from './core/Scene.js';
import { createRenderer }        from './core/Renderer.js';
import { CameraController }      from './core/Camera.js';
import { createLights, updateLights } from './core/Lights.js';
import { PostFX }                from './core/PostProcessing.js';
import { TreeGenerator }         from './tree/TreeGenerator.js';
import { LeavesSystem }          from './tree/Leaves.js';
import { FirefliesSystem }       from './particles/Fireflies.js';
import { EnvironmentFX }         from './particles/Environment.js';
import { SectionsManager }       from './sections/Sections.js';

gsap.registerPlugin(ScrollTrigger);

// ── Device detection ─────────────────────────────────────────────────────────
const device = new DeviceDetect();

if (device.prefersReducedMotion) {
  // Simple 2D fallback — no 3D canvas
  const canvas = document.getElementById('three-canvas');
  if (canvas) canvas.style.display = 'none';
  const ls = document.getElementById('loading-screen');
  if (ls) ls.style.display = 'none';
  document.querySelectorAll('.card-panel').forEach(p => {
    p.style.position = 'static';
    p.style.opacity  = '1';
    p.style.visibility = 'visible';
    p.style.pointerEvents = 'auto';
  });
  const overlay = document.getElementById('cards-overlay');
  if (overlay) overlay.style.position = 'relative';
  const proxy = document.getElementById('scroll-proxy');
  if (proxy) proxy.style.display = 'none';
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

// ── Full 3D init ─────────────────────────────────────────────────────────────
async function init3D() {
  const loading = new LoadingScreen();
  loading.setProgress(10);

  // Core Three.js setup
  const canvas   = document.getElementById('three-canvas');
  const scene    = createScene();
  const renderer = createRenderer(canvas, device);
  const camCtrl  = new CameraController(renderer.domElement.width, renderer.domElement.height);
  const lights   = createLights(scene, device);
  const postFX   = new PostFX(renderer, scene, camCtrl.camera, device);

  loading.setProgress(30);

  // ── Procedural tree with bark and 30% max gold veins ──
  const tree = new TreeGenerator(scene, device);
  tree.generate();
  loading.setProgress(55);

  // ── Instanced leaves (emerald shades, gentle sway) ──
  const leaves = new LeavesSystem(scene, tree, device);
  loading.setProgress(70);

  // ── Particles (60% cut, slow soft drift) ──
  const fireflies = new FirefliesSystem(scene, device);
  const envFX     = new EnvironmentFX(scene, device);
  loading.setProgress(85);

  // ── Sections — calm lanterns and skill orbs ──
  const sections = new SectionsManager(scene, camCtrl, tree, device);
  loading.setProgress(95);

  // ── UI ──
  const navbar     = new NavbarUI(camCtrl);
  const cursor     = new CustomCursor();
  const scrollVine = new ScrollVine();
  initUIOnly(postFX, leaves);
  loading.setProgress(100);

  // ── Loading screen complete → gentle camera transition to hero ──
  loading.complete(() => {
    sections.showPanel('hero');
    gsap.to(camCtrl.camera.position, {
      x: 0, y: -5.5, z: 12,
      duration: 1.4,
      ease: 'power2.out',
    });
  });

  // ── Scroll-driven camera ──
  camCtrl.setupScroll(sections);

  // ── Tooltip element ──
  const tooltip = createTooltip();

  // ── Raycaster for interactives ──
  const raycaster = new THREE.Raycaster();
  const mouse     = new THREE.Vector2(-999, -999);
  window.addEventListener('mousemove', (e) => {
    mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    cursor.move(e.clientX, e.clientY);
  });

  renderer.domElement.style.pointerEvents = 'auto';
  renderer.domElement.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camCtrl.camera);
    const hits = raycaster.intersectObjects(sections.interactives, true);
    if (hits.length > 0) {
      const obj = hits[0].object;
      if (obj.userData.section) camCtrl.flyToSection(obj.userData.section);
    }
  });

  // ── Render loop (steady 60 FPS) ──
  const clock = new THREE.Clock();
  let raf;

  function animate() {
    raf = requestAnimationFrame(animate);
    const t  = clock.getElapsedTime();
    const dt = 0.016; // steady clamped delta

    // Update all systems gently
    const prog = camCtrl.scrollProgress;
    tree.update(t, prog);
    leaves.update(t);
    fireflies.update(t);
    envFX.update(t, dt);
    sections.update(t, dt);
    camCtrl.update(dt, mouse);
    updateLights(lights, t);

    // Raycaster hover
    raycaster.setFromCamera(mouse, camCtrl.camera);
    const hits = raycaster.intersectObjects(sections.interactives, true);
    if (hits.length > 0) {
      const obj = hits[0].object;
      cursor.setHover(true);
      showTooltip(tooltip, hits[0], obj.userData.label || '');
    } else {
      cursor.setHover(false);
      hideTooltip(tooltip);
    }

    // Smooth, subtle night-to-dawn sky color transition
    updateSkyColor(scene, prog);

    postFX.render();
  }

  // Tab hidden pause
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); clock.stop(); }
    else { clock.start(); animate(); }
  });

  // Resize
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camCtrl.camera.aspect = window.innerWidth / window.innerHeight;
    camCtrl.camera.updateProjectionMatrix();
    postFX.resize();
  });

  animate();
}

// ── Smooth night-to-dawn sky transition ──────────────────────────────────────
// Deep Night: #0B0F14 → Dawn Sky: #1B2A41 → Soft Warm Glow: #2A2528
function updateSkyColor(scene, prog) {
  const night = new THREE.Color(PALETTE.hex.bgDeep);        // #0B0F14
  const dawn  = new THREE.Color(PALETTE.hex.dawnDark);      // #1B2A41
  const warmDawn = new THREE.Color(0x231E20);                // soft subtle dark warm

  let sky;
  if (prog < 0.60) {
    sky = night.clone().lerp(dawn, prog / 0.60);
  } else {
    sky = dawn.clone().lerp(warmDawn, (prog - 0.60) / 0.40);
  }
  scene.background = sky;
  if (scene.fog) scene.fog.color = sky;
}

// ── Tooltip helpers ──────────────────────────────────────────────────────────
function createTooltip() {
  let el = document.getElementById('tooltip-3d');
  if (!el) {
    el = document.createElement('div');
    el.id = 'tooltip-3d';
    document.body.appendChild(el);
  }
  return el;
}
function showTooltip(el, hit, label) {
  if (!label) return;
  const sx = (hit.object.position.x + 1) / 2 * window.innerWidth;
  const sy = (-hit.object.position.y + 1) / 2 * window.innerHeight;
  el.textContent = label;
  el.style.left = `${Math.min(sx, window.innerWidth - 180)}px`;
  el.style.top  = `${Math.max(sy - 35, 15)}px`;
  el.classList.add('tt-visible');
}
function hideTooltip(el) { el.classList.remove('tt-visible'); }

// ── UI-only init (forms, theme, calm-mode toggle, navbar) ────────────────────
function initUIOnly(postFX, leaves) {
  // Theme toggle
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

  // Calm Mode toggle (visible in nav)
  const calmBtn = document.getElementById('calm-mode-btn') || document.getElementById('reduce-3d-btn');
  if (calmBtn) {
    const isCalmStored = localStorage.getItem('surya-calm-mode') === 'true';
    if (isCalmStored) {
      document.body.classList.add('calm-mode');
      calmBtn.classList.add('is-active');
      window.__calmMode = true;
      postFX?.setCalm?.(true);
      leaves?.setCalm?.(true);
    }
    calmBtn.addEventListener('click', () => {
      const active = document.body.classList.toggle('calm-mode');
      calmBtn.classList.toggle('is-active', active);
      window.__calmMode = active;
      localStorage.setItem('surya-calm-mode', String(active));
      postFX?.setCalm?.(active);
      leaves?.setCalm?.(active);
    });
  }

  // Sound toggle (stub)
  let soundOn = false;
  const soundBtn = document.getElementById('sound-btn');
  soundBtn?.addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn.innerHTML = soundOn ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
    soundBtn.title = soundOn ? 'Sound (On)' : 'Sound (Off)';
  });

  // Mobile hamburger
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

  // Nav scroll border
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('nb-scrolled', window.scrollY > 20);
  }, { passive: true });

  // Contact form
  initContactForm();

  // CTA buttons → fly camera
  document.querySelectorAll('[data-fly]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.fly;
      window.__camFlyTo?.(target);
    });
  });

  // Contact orbs
  document.querySelectorAll('.contact-orb[data-href]').forEach(orb => {
    orb.addEventListener('click', () => window.open(orb.dataset.href, '_blank'));
  });

  // Footer year
  const yrEl = document.getElementById('yr');
  if (yrEl) yrEl.textContent = new Date().getFullYear();
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
    await new Promise(r => setTimeout(r, 1000));
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
