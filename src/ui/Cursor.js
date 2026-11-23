/**
 * Cursor.js — Custom gold cursor with lag ring effect.
 */

export class CustomCursor {
  constructor() {
    this.dot  = document.getElementById('cursor-dot');
    this.ring = document.getElementById('cursor-ring');

    // Ring lags behind dot using lerp
    this._ringX = window.innerWidth  / 2;
    this._ringY = window.innerHeight / 2;
    this._dotX  = this._ringX;
    this._dotY  = this._ringY;

    // Hide default cursor on desktop
    if (this.dot && this.ring && !('ontouchstart' in window)) {
      document.body.style.cursor = 'none';
      this._startLerpLoop();
    }
  }

  /** Set cursor position instantly (dot) */
  move(x, y) {
    this._dotX = x;
    this._dotY = y;
    if (this.dot) {
      this.dot.style.left = `${x}px`;
      this.dot.style.top  = `${y}px`;
    }
  }

  /** Toggle hover state (ring expands on hover) */
  setHover(isHover) {
    if (this.dot)  this.dot.classList.toggle('cursor-hover',  isHover);
    if (this.ring) this.ring.classList.toggle('cursor-hover', isHover);
  }

  /** Lerp the ring toward the dot position */
  _startLerpLoop() {
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      this._ringX = lerp(this._ringX, this._dotX, 0.12);
      this._ringY = lerp(this._ringY, this._dotY, 0.12);
      if (this.ring) {
        this.ring.style.left = `${this._ringX}px`;
        this.ring.style.top  = `${this._ringY}px`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

