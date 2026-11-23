/**
 * Navbar.js — Wires navigation items directly to open tree section panels
 */
export class NavbarUI {
  constructor(sections) {
    this.sections = sections;

    document.querySelectorAll('.nb-link[data-section]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.dataset.section;
        if (sectionId) {
          sections.openSection(sectionId);
        }
      });
    });

    const brand = document.getElementById('nb-brand');
    brand?.addEventListener('click', (e) => {
      e.preventDefault();
      sections.closeActivePanel();
    });

    const resumeBtn = document.getElementById('resume-btn');
    resumeBtn?.addEventListener('click', (e) => {
      // Keep existing resume action
    });
  }
}
