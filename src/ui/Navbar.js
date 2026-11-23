/**
 * Navbar.js — Hooks nav links to CameraController.flyToSection()
 * Most navbar logic (hamburger, shadow, theme) is handled in initUIOnly() in main.js.
 */

export class NavbarUI {
  constructor(camCtrl) {
    this.camCtrl = camCtrl;

    // Expose flyTo globally so data-fly buttons and other modules can use it
    window.__camFlyTo = (section) => camCtrl.flyToSection(section);

    // Wire nav links to camera fly
    document.querySelectorAll('.nb-link[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const hash = link.getAttribute('href').slice(1); // e.g. "about" from "#about"
        if (hash && camCtrl.flyToSection) {
          e.preventDefault();
          camCtrl.flyToSection(hash);
        }
      });
    });

    // Resume CTA button
    const resumeBtn = document.getElementById('resume-btn');
    resumeBtn?.addEventListener('click', () => {
      // Open resume PDF or link (placeholder)
      const resumeUrl = 'assets/resume.pdf';
      window.open(resumeUrl, '_blank');
    });
  }
}

