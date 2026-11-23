/**
 * Sections.js — Guided Section Journey Controller
 *
 * Ordered sections:
 * [ 'hero', 'about', 'skills', 'projects', 'hacktoberfest', 'beyond', 'contact' ]
 *
 * Controls:
 * - One scroll step (wheel, trackpad, touch swipe, Arrow Up/Down, PageUp/PageDown) moves section by section
 * - 800ms cooldown + input locking during animation (~1.2s)
 * - Panels with scrollable content scroll internally; transitions only trigger at top/bottom bounds
 * - 7 vertical dots stay in sync
 * - URL hash sync (#hero, #about, #skills, #projects, #hacktoberfest, #beyond, #contact)
 * - Escape closes open panel and returns to overview
 */
import { SECTION_TARGETS } from '../core/Camera.js';

export const SECTION_LIST = [
  'hero',
  'about',
  'skills',
  'projects',
  'hacktoberfest',
  'beyond',
  'contact'
];

export class SectionsManager {
  constructor(scene, camCtrl, tree) {
    this.scene   = scene;
    this.camCtrl = camCtrl;
    this.tree    = tree;

    this.currentIndex = 0;
    this.activeSection = SECTION_LIST[0];
    this.isLocked = false;
    this.lastTransitionTime = 0;
    this.COOLDOWN_MS = 800;

    this.interactives = tree ? tree.interactives : [];

    this._bindEvents();
    this._initFromHash();
  }

  _bindEvents() {
    // Wheel / Trackpad scroll detection
    window.addEventListener('wheel', (e) => this._handleWheel(e), { passive: false });

    // Touch swipe detection
    let touchStartY = 0;
    let touchStartTime = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const touchEndY = e.touches[0].clientY;
      const diffY = touchStartY - touchEndY;
      const timeDiff = Date.now() - touchStartTime;

      if (timeDiff < 600 && Math.abs(diffY) > 40) {
        if (diffY > 0) {
          this.nextSection();
        } else {
          this.prevSection();
        }
      }
    }, { passive: true });

    // Keyboard navigation (Arrow keys, PageUp/PageDown, Space)
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        this.nextSection();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        this.prevSection();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.closeToOverview();
      }
    });

    // Hash change handler
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '').replace('-section', '');
      if (SECTION_LIST.includes(hash) && hash !== this.activeSection) {
        this.goToSection(hash);
      }
    });

    // Close buttons on panels
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeToOverview();
      });
    });

    // 7 Dots click events
    document.querySelectorAll('#section-dots .nav-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const sec = dot.dataset.section;
        if (sec) this.goToSection(sec);
      });
    });

    window.__openSection  = this.goToSection.bind(this);
    window.__closeSection = this.closeToOverview.bind(this);
  }

  _handleWheel(e) {
    const now = Date.now();
    if (this.isLocked || (now - this.lastTransitionTime) < this.COOLDOWN_MS) {
      e.preventDefault();
      return;
    }

    // Check if the wheel event occurred inside an active panel content container
    const activePanelEl = document.getElementById(`${this.activeSection}-section`);
    const panelContent = activePanelEl?.querySelector('.panel-content');

    if (panelContent && activePanelEl.classList.contains('cp-visible')) {
      const targetIsInsidePanel = panelContent.contains(e.target);
      if (targetIsInsidePanel) {
        const scrollTop = panelContent.scrollTop;
        const scrollHeight = panelContent.scrollHeight;
        const clientHeight = panelContent.clientHeight;
        const isScrollable = scrollHeight > clientHeight + 4;

        if (isScrollable) {
          const atTop = scrollTop <= 2;
          const atBottom = (scrollTop + clientHeight) >= (scrollHeight - 4);

          // If scrolling down and not at bottom, let the panel scroll normally
          if (e.deltaY > 0 && !atBottom) {
            return;
          }
          // If scrolling up and not at top, let the panel scroll normally
          if (e.deltaY < 0 && !atTop) {
            return;
          }
        }
      }
    }

    // Otherwise, transition section
    if (Math.abs(e.deltaY) > 20) {
      e.preventDefault();
      if (e.deltaY > 0) {
        this.nextSection();
      } else {
        this.prevSection();
      }
    }
  }

  nextSection() {
    if (this.currentIndex < SECTION_LIST.length - 1) {
      this.goToIndex(this.currentIndex + 1);
    }
  }

  prevSection() {
    if (this.currentIndex > 0) {
      this.goToIndex(this.currentIndex - 1);
    }
  }

  goToSection(sectionName) {
    const idx = SECTION_LIST.indexOf(sectionName);
    if (idx !== -1) {
      this.goToIndex(idx);
    }
  }

  goToIndex(index) {
    const now = Date.now();
    if (this.isLocked || (now - this.lastTransitionTime) < this.COOLDOWN_MS) return;

    this.isLocked = true;
    this.lastTransitionTime = now;

    // Hide old panel
    const prevSection = this.activeSection;
    this.setPanelVisible(prevSection, false);

    this.currentIndex = index;
    this.activeSection = SECTION_LIST[index];

    // Update URL hash without jumping page
    history.replaceState(null, '', `#${this.activeSection}`);

    // Update Dots & Navbar
    this._updateSyncUI(this.activeSection);

    // Hide explore hint when past hero
    const hint = document.getElementById('tree-explore-hint');
    if (hint) {
      hint.classList.toggle('hint-hidden', this.currentIndex > 0);
    }

    // Trigger per-section tree & sky color shift (~1.2s)
    if (window.__setSectionColors) {
      window.__setSectionColors(this.activeSection);
    }

    // Camera fly to section target (1.2s, power2.out)
    const targetConfig = SECTION_TARGETS[this.activeSection] || SECTION_TARGETS.overview;
    this.camCtrl.flyTo(targetConfig, 1.2, () => {
      this.setPanelVisible(this.activeSection, true);
      this.isLocked = false;
    });

    // Reveal panel slightly ahead for snappy feel
    setTimeout(() => {
      this.setPanelVisible(this.activeSection, true);
    }, 350);

    // Safety release lock after 1.3s
    setTimeout(() => {
      this.isLocked = false;
    }, 1300);
  }

  closeToOverview() {
    this.setPanelVisible(this.activeSection, false);
    this.camCtrl.resetToOverview(1.2);

    // Clear dots active state
    document.querySelectorAll('#section-dots .nav-dot').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.nb-link').forEach(l => l.classList.remove('nb-active'));

    const hint = document.getElementById('tree-explore-hint');
    if (hint) hint.classList.remove('hint-hidden');

    history.replaceState(null, '', ' ');
  }

  setPanelVisible(name, visible) {
    if (!name) return;
    const el = document.getElementById(`${name}-section`);
    if (!el) return;
    if (visible) {
      el.classList.add('cp-visible');
    } else {
      el.classList.remove('cp-visible');
    }
  }

  _updateSyncUI(sectionName) {
    // Sync 7 dots
    document.querySelectorAll('#section-dots .nav-dot').forEach(dot => {
      dot.classList.toggle('active', dot.dataset.section === sectionName);
    });

    // Sync navbar links
    document.querySelectorAll('.nb-link').forEach(link => {
      link.classList.toggle('nb-active', link.dataset.section === sectionName);
    });
  }

  _initFromHash() {
    const hash = window.location.hash.replace('#', '').replace('-section', '');
    if (SECTION_LIST.includes(hash)) {
      setTimeout(() => this.goToSection(hash), 150);
    } else {
      // Default to Hero
      this._updateSyncUI('hero');
      setTimeout(() => this.setPanelVisible('hero', true), 300);
    }
  }
}
