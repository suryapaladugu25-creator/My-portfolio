/**
 * Sections.js — Manages content panels beside the tree,
 * handles open/close animations, and coordinates with CameraController.
 */
import { SECTION_TARGETS } from '../core/Camera.js';

export class SectionsManager {
  constructor(scene, camCtrl, tree) {
    this.scene   = scene;
    this.camCtrl = camCtrl;
    this.tree    = tree;

    this.activeSection = null;
    this.interactives  = tree ? tree.interactives : [];

    this._bindEvents();
  }

  _bindEvents() {
    // Close buttons on all panels
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeActivePanel();
      });
    });

    // Escape key closes open panel and returns camera to full tree view
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeSection) {
        this.closeActivePanel();
      }
    });

    // Expose globally
    window.__openSection  = this.openSection.bind(this);
    window.__closeSection = this.closeActivePanel.bind(this);
  }

  openSection(sectionId, targetConfig = null) {
    if (!sectionId) return;

    // Hide explore hint when viewing a panel
    const hint = document.getElementById('tree-explore-hint');
    if (hint) hint.classList.add('hint-hidden');

    // Deselect prior
    this.setPanelVisible(this.activeSection, false);

    this.activeSection = sectionId;
    this.camCtrl.activeSection = sectionId;

    // Camera fly target
    const target = targetConfig || SECTION_TARGETS[sectionId] || SECTION_TARGETS.overview;
    this.camCtrl.flyTo(target, 1.0, () => {
      this.setPanelVisible(sectionId, true);
    });

    // Also reveal panel during movement for responsiveness
    this.setPanelVisible(sectionId, true);

    // Update active nav link
    document.querySelectorAll('.nb-link').forEach(link => {
      link.classList.toggle('nb-active', link.dataset.section === sectionId);
    });

    // Trigger sky color change for section atmosphere
    if (window.__setSkyAtmosphere) {
      window.__setSkyAtmosphere(sectionId);
    }
  }

  closeActivePanel() {
    if (!this.activeSection) return;

    this.setPanelVisible(this.activeSection, false);
    this.activeSection = null;

    // Return camera to full tree view smoothly (~1s)
    this.camCtrl.resetToOverview(1.0);

    // Reset nav active states
    document.querySelectorAll('.nb-link').forEach(link => {
      link.classList.remove('nb-active');
    });

    // Restore hint
    const hint = document.getElementById('tree-explore-hint');
    if (hint) hint.classList.remove('hint-hidden');

    // Restore daytime sky
    if (window.__setSkyAtmosphere) {
      window.__setSkyAtmosphere('overview');
    }
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

  update(time, dt) {
    // Optional periodic updates
  }
}
