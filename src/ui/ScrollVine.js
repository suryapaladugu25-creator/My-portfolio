/**
 * ScrollVine.js — Scroll progress vine indicator.
 * The actual update (filling the vine height and moving the leaf dot)
 * is driven directly by Camera.js during the scroll callback.
 * This class handles initial setup and exports the DOM references.
 */

export class ScrollVine {
  constructor() {
    this.vine    = document.getElementById('scroll-vine-fill');
    this.leaf    = document.getElementById('scroll-leaf');
    this.wrapper = document.getElementById('scroll-vine');

    // Show the vine wrapper (hidden via CSS until JS runs)
    if (this.wrapper) {
      this.wrapper.style.opacity = '1';
    }
  }

  /** Update vine fill and leaf position (0–1) */
  setProgress(progress) {
    if (!this.vine || !this.leaf) return;
    const pct = Math.max(0, Math.min(1, progress));
    this.vine.style.height = `${pct * 100}%`;
    this.leaf.style.top    = `${pct * 100}%`;
    this.leaf.style.opacity = pct > 0.02 ? '1' : '0';
  }
}

