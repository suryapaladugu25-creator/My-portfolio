// Camera.js — Scroll-driven camera along a CatmullRom spline + mouse parallax
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Camera path waypoints: ground → trunk → branches → canopy → sky → contact
const PATH_POSITIONS = [
  new THREE.Vector3(0,   -6,  12),  // 0.00 — Hero (looking at sapling)
  new THREE.Vector3(2,    2,  10),  // 0.14 — About (trunk lower)
  new THREE.Vector3(-3,   9,   9),  // 0.28 — Skills (branch level)
  new THREE.Vector3(4,   16,   8),  // 0.42 — Projects (canopy)
  new THREE.Vector3(-2,  22,   7),  // 0.57 — Hacktoberfest (upper)
  new THREE.Vector3(0,   12,  28),  // 0.71 — Beyond (pulled back for dawn)
  new THREE.Vector3(0,   26,  10),  // 0.86 — Contact (tree top)
  new THREE.Vector3(0,   28,  12),  // 1.00 — End
];

const LOOK_AT_TARGETS = [
  new THREE.Vector3(0,  -4,  0),  // Hero — sapling
  new THREE.Vector3(0,   4,  0),  // About — trunk mid
  new THREE.Vector3(-1,  11, 0),  // Skills — branches
  new THREE.Vector3(2,   18, 0),  // Projects — canopy fruits
  new THREE.Vector3(0,   22, 0),  // Hacktoberfest
  new THREE.Vector3(0,   8,  0),  // Beyond — tree silhouette
  new THREE.Vector3(0,   24, 0),  // Contact — crown
  new THREE.Vector3(0,   26, 0),  // End
];

const SECTION_PROGRESS = {
  hero:          0.00,
  about:         0.14,
  skills:        0.28,
  projects:      0.42,
  hacktoberfest: 0.57,
  beyond:        0.71,
  contact:       0.86,
};

export class CameraController {
  constructor(w, h) {
    this.camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 400);
    this.camera.position.copy(PATH_POSITIONS[0]);

    this.posSpline    = new THREE.CatmullRomCurve3(PATH_POSITIONS, false, 'centripetal', 0.5);
    this.lookSpline   = new THREE.CatmullRomCurve3(LOOK_AT_TARGETS, false, 'centripetal', 0.5);

    this.scrollProgress = 0;
    this._targetProgress = 0;

    // Damped values for smooth camera
    this._pos  = PATH_POSITIONS[0].clone();
    this._look = LOOK_AT_TARGETS[0].clone();

    // Mouse parallax
    this._parallax = new THREE.Vector2(0, 0);

    // Expose flyTo for nav clicks
    window.__camFlyTo = this.flyToSection.bind(this);

    // Sections manager ref (set later)
    this._sections = null;
  }

  setupScroll(sections) {
    this._sections = sections;
    const proxy = document.getElementById('scroll-proxy');

    ScrollTrigger.create({
      trigger: proxy,
      start: 'top top',
      end:   'bottom bottom',
      scrub: 1.4,
      onUpdate: (self) => {
        this._targetProgress = self.progress;
        // Update active nav link
        this._updateActiveNav(self.progress);
        // Update vine
        document.getElementById('vine-fill')?.style.setProperty('height', `${self.progress * 100}%`);
        document.getElementById('vine-leaf')?.style.setProperty('top', `${self.progress * 100}%`);
        // Show/hide content panels
        this._updatePanels(self.progress);
      },
    });
  }

  _updatePanels(prog) {
    if (!this._sections) return;
    const order = ['hero','about','skills','projects','hacktoberfest','beyond','contact'];
    const thresholds = [0, 0.14, 0.28, 0.42, 0.57, 0.71, 0.86, 1.01];
    for (let i = 0; i < order.length; i++) {
      const inView = prog >= thresholds[i] && prog < thresholds[i + 1];
      this._sections.setPanelVisible(order[i], inView);
    }
  }

  _updateActiveNav(prog) {
    const order = ['hero','about','skills','projects','hacktoberfest','beyond','contact'];
    const thresholds = [0, 0.14, 0.28, 0.42, 0.57, 0.71, 0.86];
    let active = 'hero';
    for (let i = 0; i < order.length; i++) {
      if (prog >= thresholds[i]) active = order[i];
    }
    document.querySelectorAll('.nb-link').forEach(l => {
      l.classList.toggle('nb-active', l.dataset.section === active);
    });
  }

  flyToSection(sectionName) {
    const prog = SECTION_PROGRESS[sectionName];
    if (prog === undefined) return;
    const totalH  = document.getElementById('scroll-proxy')?.offsetHeight || window.innerHeight * 8;
    const scrollY = prog * (totalH - window.innerHeight);
    window.scrollTo({ top: scrollY, behavior: 'smooth' });
  }

  update(dt, mouse) {
    // Smooth scroll progress
    this.scrollProgress += (this._targetProgress - this.scrollProgress) * Math.min(dt * 4, 1);

    const t = Math.max(0, Math.min(1, this.scrollProgress));

    // Camera position from spline
    const targetPos  = this.posSpline.getPoint(t);
    const targetLook = this.lookSpline.getPoint(t);

    // Mouse parallax (subtle)
    if (mouse) {
      this._parallax.x += (mouse.x * 0.6 - this._parallax.x) * 0.05;
      this._parallax.y += (mouse.y * 0.3 - this._parallax.y) * 0.05;
    }

    // Damped lerp
    this._pos.lerp(targetPos, dt * 3.5);
    this._look.lerp(targetLook, dt * 4);

    this.camera.position.copy(this._pos);
    // Parallax offset
    this.camera.position.x += this._parallax.x * 0.4;
    this.camera.position.y += this._parallax.y * 0.2;
    this.camera.lookAt(this._look);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}

