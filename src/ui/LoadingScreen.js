/**
 * LoadingScreen.js — Controls the loading splash screen.
 * Manages the seed sprout animation and transition to 3D scene.
 */

export class LoadingScreen {
  constructor() {
    this.el      = document.getElementById('loading-screen');
    this.bar     = document.getElementById('ls-bar');
    this.pctNum  = document.getElementById('ls-pct-num');
    this.seed    = document.getElementById('ls-seed');
    this._pct    = 0;
  }

  /** Update progress bar 0–100 */
  setProgress(pct) {
    this._pct = Math.min(100, Math.max(0, pct));
    if (this.bar)    this.bar.style.width    = `${this._pct}%`;
    if (this.pctNum) this.pctNum.textContent = `${Math.round(this._pct)}%`;
  }

  /**
   * Animate seed → sprout → fade out, then call callback.
   * @param {Function} callback — called once loading screen is hidden
   */
  complete(callback) {
    if (!this.el) { callback?.(); return; }

    // Phase 1: glow the seed brighter
    if (this.seed) {
      this.seed.style.transition  = 'transform 0.6s ease, box-shadow 0.6s ease';
      this.seed.style.transform   = 'scale(1.5)';
      this.seed.style.boxShadow   = '0 0 60px 20px #f5c842, 0 0 120px 40px rgba(245,200,66,0.4)';
    }

    // Phase 2 (500ms): sprout rays
    setTimeout(() => {
      if (this.seed) {
        this.seed.style.transform = 'scale(0.3)';
        this.seed.style.opacity   = '0';
      }
      // Show sprout text
      const sprout = document.getElementById('ls-sprout');
      if (sprout) {
        sprout.style.opacity    = '1';
        sprout.style.transform  = 'translateY(0)';
      }
    }, 500);

    // Phase 3 (1200ms): fade out entire loading screen
    setTimeout(() => {
      if (this.el) {
        this.el.classList.add('ls-done');
        this.el.addEventListener('transitionend', () => {
          this.el.style.display = 'none';
          callback?.();
        }, { once: true });

        // Fallback in case transition doesn't fire
        setTimeout(() => {
          if (this.el.style.display !== 'none') {
            this.el.style.display = 'none';
            callback?.();
          }
        }, 1200);
      } else {
        callback?.();
      }
    }, 1200);
  }
}

