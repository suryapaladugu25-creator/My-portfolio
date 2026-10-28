/**
 * ============================================================
 * SURYA — Portfolio JavaScript
 * Features:
 *  0. ✨ Cinematic gold splash screen + particle sparkles
 *  1. Theme toggle (dark / light) with localStorage persistence
 *  2. Mobile hamburger menu + accessibility
 *  3. Sticky nav: shadow on scroll + active-link ScrollSpy
 *  4. Smooth scrolling for all in-page anchor links
 *  5. Project category filter
 *  6. Contact form: client-side validation + mock submission
 *  7. Back-to-top button
 *  8. Dynamic copyright year
 *  9. Scroll-reveal animation for cards / sections
 * 10. Section header in-view trigger
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     0. ✨ CINEMATIC SPLASH SCREEN + GOLD SPARKLES
  ────────────────────────────────────────────────────────── */
  const splash = document.getElementById('intro-splash');
  const sparkContainer = document.getElementById('spark-container');

  // Generate floating gold particle sparkles
  if (sparkContainer) {
    const sparkCount = 28;
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      spark.classList.add('spark');

      const x  = Math.random() * 100;  // % left
      const y  = Math.random() * 100;  // % top
      const tx = (Math.random() - 0.5) * 180;  // x travel
      const ty = -(Math.random() * 200 + 60);   // y travel (up)
      const dur   = (Math.random() * 2 + 2).toFixed(2) + 's';
      const delay = (Math.random() * 2.2).toFixed(2) + 's';
      const size  = Math.random() * 4 + 2;

      spark.style.cssText = `
        left:${x}%;
        top:${y}%;
        width:${size}px;
        height:${size}px;
        --tx:${tx}px;
        --ty:${ty}px;
        --dur:${dur};
        --delay:${delay};
        opacity:${Math.random() * 0.6 + 0.4};
      `;
      sparkContainer.appendChild(spark);
    }
  }

  // Mark splash as done after CSS animation finishes (3.3s exit)
  if (splash) {
    setTimeout(() => {
      splash.classList.add('done');
      document.body.style.animation = 'none'; // prevent re-trigger
    }, 3400);
  }


  /* ──────────────────────────────────────────────────────────
     1. THEME TOGGLE
  ────────────────────────────────────────────────────────── */
  const html      = document.documentElement;
  const themeBtn  = document.getElementById('theme-btn');
  const themeIcon = document.getElementById('theme-icon');

  const applyTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('surya-theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark'
        ? 'fa-solid fa-moon'
        : 'fa-solid fa-sun';
    }
  };

  const saved = localStorage.getItem('surya-theme');
  const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(saved || system);

  themeBtn?.addEventListener('click', () => {
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });


  /* ──────────────────────────────────────────────────────────
     2. MOBILE HAMBURGER MENU
  ────────────────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  const closeMenu = () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  };

  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks?.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!navLinks?.contains(e.target) && !hamburger?.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  /* ──────────────────────────────────────────────────────────
     3. STICKY NAV: shadow + ScrollSpy
  ────────────────────────────────────────────────────────── */
  const header   = document.getElementById('site-header');
  const sections = document.querySelectorAll('section[id]');
  const allLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 20);

    const offset = 72 + 80;
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY + offset >= sec.offsetTop) current = sec.id;
    });
    allLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ──────────────────────────────────────────────────────────
     4. SMOOTH SCROLLING
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ──────────────────────────────────────────────────────────
     5. PROJECT FILTER
  ────────────────────────────────────────────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display   = match ? 'flex' : 'none';
        card.style.animation = match ? 'card-in .35s ease forwards' : '';
      });
    });
  });


  /* ──────────────────────────────────────────────────────────
     6. CONTACT FORM — validation + mock submit
  ────────────────────────────────────────────────────────── */
  const form        = document.getElementById('contact-form');
  const nameInput   = document.getElementById('cf-name');
  const emailInput  = document.getElementById('cf-email');
  const msgInput    = document.getElementById('cf-message');
  const submitBtn   = document.getElementById('cf-submit');
  const submitLabel = document.getElementById('submit-label');
  const submitIcon  = document.getElementById('submit-icon');
  const submitSpin  = document.getElementById('submit-spin');
  const toast       = document.getElementById('form-toast');

  const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const validate = (input, condition) => {
    input?.closest('.form-field')?.classList.toggle('has-err', !condition);
    return condition;
  };

  [nameInput, emailInput, msgInput].forEach(inp => {
    inp?.addEventListener('input', () => {
      inp.closest('.form-field')?.classList.remove('has-err');
      if (toast) toast.style.display = 'none';
    });
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const okName  = validate(nameInput,  (nameInput?.value.trim().length  ?? 0) > 1);
    const okEmail = validate(emailInput, isEmail(emailInput?.value.trim() ?? ''));
    const okMsg   = validate(msgInput,   (msgInput?.value.trim().length   ?? 0) >= 10);

    if (!okName || !okEmail || !okMsg) return;

    submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = 'Sending...';
    if (submitIcon)  submitIcon.style.display = 'none';
    if (submitSpin)  submitSpin.style.display = 'inline-block';

    await new Promise(res => setTimeout(res, 1400));

    submitBtn.disabled = false;
    if (submitLabel) submitLabel.textContent = 'Send Message';
    if (submitIcon)  submitIcon.style.display = 'inline-block';
    if (submitSpin)  submitSpin.style.display = 'none';

    if (toast) {
      toast.className  = 'form-toast ok';
      toast.textContent = '🏆 Message sent! I\'ll get back to you soon.';
    }
    form.reset();
    setTimeout(() => { if (toast) toast.style.display = 'none'; }, 6000);
  });


  /* ──────────────────────────────────────────────────────────
     7. BACK-TO-TOP
  ────────────────────────────────────────────────────────── */
  document.getElementById('back-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ──────────────────────────────────────────────────────────
     8. DYNAMIC YEAR
  ────────────────────────────────────────────────────────── */
  const yrEl = document.getElementById('yr');
  if (yrEl) yrEl.textContent = new Date().getFullYear();


  /* ──────────────────────────────────────────────────────────
     9. SCROLL-REVEAL for cards (IntersectionObserver)
  ────────────────────────────────────────────────────────── */
  const revealCSS = `
    @keyframes card-in {
      from { opacity:0; transform:translateY(22px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .rv-hidden { opacity:0; transform:translateY(22px); transition:none; }
    .rv-show   { animation:card-in .6s cubic-bezier(.16,1,.3,1) forwards; }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = revealCSS;
  document.head.appendChild(styleTag);

  const revealTargets = document.querySelectorAll(
    '.mini-stat-card, .skill-cat, .project-card, .beyond-card, .os-card, .hf-spotlight, .cinfo-card'
  );

  let idx = 0;
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.animationDelay = `${(idx % 5) * 70}ms`;
        el.classList.remove('rv-hidden');
        el.classList.add('rv-show');
        idx++;
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -36px 0px' });

  revealTargets.forEach(el => {
    el.classList.add('rv-hidden');
    revealObserver.observe(el);
  });


  /* ──────────────────────────────────────────────────────────
     10. SECTION HEADERS — fade-in on scroll
  ────────────────────────────────────────────────────────── */
  const sectionLabels = document.querySelectorAll('.section-label');
  const labelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        labelObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  sectionLabels.forEach(el => labelObserver.observe(el));

});
