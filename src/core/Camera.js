// Camera.js — Smooth, slow scroll-driven camera with high damping & subtle parallax
import * as THREE from 'three';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Camera path waypoints: smooth upward traversal, gentle curves, no sudden turns
const PATH_POSITIONS = [
  new THREE.Vector3(0.0, -5.5, 12.0), // 0.00 — Hero (calm view of sapling)
  new THREE.Vector3(1.2,  2.0, 10.5), // 0.14 — About (trunk lower)
  new THREE.Vector3(-1.5, 8.5, 10.0), // 0.28 — Skills (lower branches)
  new THREE.Vector3(2.0, 15.0,  9.5), // 0.42 — Projects (canopy)
  new THREE.Vector3(-1.0, 21.0, 8.5), // 0.57 — Hacktoberfest (upper branch)
  new THREE.Vector3(0.0, 14.0, 22.0), // 0.71 — Beyond (gently pulled back for dawn)
  new THREE.Vector3(0.0, 25.0, 11.0), // 0.86 — Contact (soft crown)
  new THREE.Vector3(0.0, 26.5, 12.0), // 1.00 — End
];

const LOOK_AT_TARGETS = [
  new THREE.Vector3(0,  -4.0, 0), // Hero — sapling
  new THREE.Vector3(0,   3.5, 0), // About — trunk mid
  new THREE.Vector3(0,   9.5, 0), // Skills — branch center
  new THREE.Vector3(0,  15.5, 0), // Projects — canopy
  new THREE.Vector3(0,  21.0, 0), // Hacktoberfest
  new THREE.Vector3(0,  10.0, 0), // Beyond — tree center in dawn sky
  new THREE.Vector3(0,  24.0, 0), // Contact — top
  new THREE.Vector3(0,  25.0, 0), // End
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
    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 350);
    this.camera.position.copy(PATH_POSITIONS[0]);

    this.posSpline  = new THREE.CatmullRomCurve3(PATH_POSITIONS, false, 'centripetal', 0.5);
    this.lookSpline = new THREE.CatmullRomCurve3(LOOK_AT_TARGETS, false, 'centripetal', 0.5);

    this.scrollProgress = 0;
    this._targetProgress = 0;

    // Strongly damped camera for butter-smooth movement
    this._pos  = PATH_POSITIONS[0].clone();
    this._look = LOOK_AT_TARGETS[0].clone();

    // Mouse parallax — extremely subtle
    this._parallax = new THREE.Vector2(0, 0);

    window.__camFlyTo = this.flyToSection.bind(this);
    this._sections = null;
  }

  setupScroll(sections) {
    this._sections = sections;
    const proxy = document.getElementById('scroll-proxy');

    ScrollTrigger.create({
      trigger: proxy,
      start: 'top top',
      end:   'bottom bottom',
      scrub: 2.2, // Generous scrub damping for ultra-smooth scrolling
      onUpdate: (self) => {
        this._targetProgress = self.progress;
        this._updateActiveNav(self.progress);
        // Update vine indicator
        const fill = document.getElementById('vine-fill');
        const leaf = document.getElementById('vine-leaf');
        if (fill) fill.style.height = `${self.progress * 100}%`;
        if (leaf) leaf.style.top = `${self.progress * 100}%`;
        this._updatePanels(self.progress);
      },
    });
  }

  _updatePanels(prog) {
    if (!this._sections) return;
    const order = ['hero','about','skills','projects','hacktoberfest','beyond','contact'];
    // Distinct non-overlapping bands so only one panel shows at a time
    const bands = [
      [0.00, 0.08],
      [0.10, 0.22],
      [0.24, 0.36],
      [0.38, 0.51],
      [0.53, 0.65],
      [0.67, 0.80],
      [0.82, 1.00]
    ];
    for (let i = 0; i < order.length; i++) {
      const inView = prog >= bands[i][0] && prog <= bands[i][1];
      this._sections.setPanelVisible(order[i], inView);
    }
  }

  _updateActiveNav(prog) {
    const order = ['hero','about','skills','projects','hacktoberfest','beyond','contact'];
    const thresholds = [0, 0.12, 0.26, 0.40, 0.55, 0.69, 0.84];
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
    const totalH  = document.getElementById('scroll-proxy')?.offsetHeight || window.innerHeight * 7;
    const scrollY = prog * (totalH - window.innerHeight);
    window.scrollTo({ top: scrollY, behavior: 'smooth' });
  }

  update(dt, mouse) {
    // Heavy damping for smooth, relaxed progression
    this.scrollProgress += (this._targetProgress - this.scrollProgress) * Math.min(dt * 2.2, 1);
    const t = Math.max(0, Math.min(1, this.scrollProgress));

    const targetPos  = this.posSpline.getPoint(t);
    const targetLook = this.lookSpline.getPoint(t);

    // Mouse parallax: very subtle (0.15 max factor)
    if (mouse && !window.__calmMode) {
      this._parallax.x += (mouse.x * 0.15 - this._parallax.x) * 0.03;
      this._parallax.y += (mouse.y * 0.08 - this._parallax.y) * 0.03;
    } else {
      this._parallax.set(0, 0);
    }

    // Camera damping
    this._pos.lerp(targetPos, dt * 2.2);
    this._look.lerp(targetLook, dt * 2.5);

    this.camera.position.copy(this._pos);
    this.camera.position.x += this._parallax.x;
    this.camera.position.y += this._parallax.y;
    this.camera.lookAt(this._look);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}
