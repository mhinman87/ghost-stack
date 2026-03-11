/* ============================================================
   Ice Cap Labs — script.js
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initScrollReveal();
  initWordReveal();
  initNav();
  initContactForm();
  initFooterYear();
  initSnowflakeCursor();
});


/* ── Parallax ─────────────────────────────────────────────── */
function initParallax() {
  const layers = document.querySelectorAll('[data-speed]');
  if (!layers.length) return;

  // Trim main height to account for parallax compression.
  const main = document.querySelector('main');
  const hero = document.getElementById('hero');

  function trimMain() {
    if (!main || !hero) return;
    // Temporarily remove fixed height so we can measure true scrollHeight
    main.style.height = '';
    const contentBelow = main.scrollHeight - hero.offsetHeight;
    const trimmed = hero.offsetHeight + contentBelow * 0.55;
    main.style.height = trimmed + 'px';
    main.style.overflow = 'hidden';
  }

  trimMain();
  window.addEventListener('hashchange', trimMain);

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    for (let i = 0; i < layers.length; i++) {
      const speed = +layers[i].dataset.speed;
      if (speed) layers[i].style.transform = `translate3d(0, ${-(y * speed) | 0}px, 0)`;
    }
  }, { passive: true });
}

/* ── Scroll Reveal ────────────────────────────────────────── */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  items.forEach((el) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(40px)';
    const delay = el.dataset.delay || '0';
    el.style.transition = [
      `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      `transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    ].join(', ');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:   0.1,
    rootMargin:  '0px 0px -60px 0px',
  });

  items.forEach((el) => observer.observe(el));
}

/* ── Word Reveal ──────────────────────────────────────────── */
function initWordReveal() {
  const headings = document.querySelectorAll('.word-reveal');
  if (!headings.length) return;

  headings.forEach((el) => {
    const text      = el.textContent.trim();
    const words     = text.split(/\s+/);
    const baseDelay = parseFloat(el.dataset.delay || '0');

    el.innerHTML = words.map((word, i) => `\
<span style="overflow:hidden;display:inline-block;margin-right:0.28em;line-height:1.15">\
<span class="word-inner" style="\
display:inline-block;\
transform:translateY(115%);\
transition:transform 0.65s cubic-bezier(0.16,1,0.3,1) ${(baseDelay + i * 0.07).toFixed(3)}s">\
${word}\
</span>\
</span>`).join('');

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.word-inner').forEach((w) => {
          w.style.transform = 'translateY(0%)';
        });
        observer.unobserve(el);
      }
    }, {
      threshold:  0.1,
      rootMargin: '0px 0px -60px 0px',
    });

    observer.observe(el);
  });
}

/* ── Navigation ───────────────────────────────────────────── */
function initNav() {
  const nav    = document.getElementById('site-nav');
  const burger = document.getElementById('nav-burger');
  const menu   = document.getElementById('nav-mobile-menu');
  if (!nav || !burger || !menu) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    nav.classList.toggle('menu-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
  });

  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      nav.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ── Contact form ─────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    const email      = emailInput ? emailInput.value.trim() : '';

    if (!email) {
      emailInput && emailInput.focus();
      return;
    }

    const subject = encodeURIComponent('Hello from Ice Cap Labs website');
    const body    = encodeURIComponent(
      `Hi Ice Cap Labs team,\n\nI found you through your website and wanted to connect.\n\nMy email: ${email}\n\n`
    );
    window.location.href = `mailto:hello@icecaplabs.com?subject=${subject}&body=${body}`;
  });
}

/* ── Snowflake cursor ────────────────────────────────────── */
function initSnowflakeCursor() {
  // Skip on touch-only devices
  if (!window.matchMedia('(hover: hover)').matches) return;

  const flakeSVG = (size) => {
    const s = size;
    const h = s / 2;
    // 6-pointed snowflake: 3 crossing lines + small branches
    const arm = h * 0.85;
    const br = arm * 0.45;  // branch length
    const ba = arm * 0.6;   // branch start distance from center
    let d = '';
    for (let i = 0; i < 6; i++) {
      const a = (i * 60) * Math.PI / 180;
      const cos = Math.cos(a);
      const sin = Math.sin(a);
      // Main arm
      d += `M${h},${h} L${h + cos * arm},${h + sin * arm} `;
      // Branch
      const bx = h + cos * ba;
      const by = h + sin * ba;
      const la = a + 0.55;
      const ra = a - 0.55;
      d += `M${bx},${by} L${bx + Math.cos(la) * br},${by + Math.sin(la) * br} `;
      d += `M${bx},${by} L${bx + Math.cos(ra) * br},${by + Math.sin(ra) * br} `;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><path d="${d}" stroke="currentColor" stroke-width="${s * 0.07}" stroke-linecap="round" fill="none"/></svg>`;
  };

  const cursor = document.createElement('div');
  cursor.className = 'snowflake-cursor';
  cursor.innerHTML = flakeSVG(36);

  const trail = document.createElement('div');
  trail.className = 'snowflake-trail';
  trail.innerHTML = flakeSVG(60);

  document.body.appendChild(trail);
  document.body.appendChild(cursor);

  // Hide default cursor everywhere
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = '*, *::before, *::after { cursor: none !important; }';
  document.head.appendChild(cursorStyle);

  let mx = -100, my = -100;
  let tx = -100, ty = -100;
  let hovering = false;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = (mx - 18) + 'px';
    cursor.style.top  = (my - 18) + 'px';

    // Detect if over a clickable/hoverable element
    const target = e.target.closest('a, button, input, textarea, select, [role="button"], .service-card, .service-block, .why-item, .process-step, .nav-cta, .nav-mobile-cta, .btn-primary, .social-icon');
    const isHovering = !!target;
    if (isHovering !== hovering) {
      hovering = isHovering;
      cursor.classList.toggle('hovering', hovering);
      trail.classList.toggle('hovering', hovering);
    }
  });

  // Trail follows with easing
  function animate() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = (tx - 30) + 'px';
    trail.style.top  = (ty - 30) + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  // Hide when cursor leaves the window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity  = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '0.9';
    trail.style.opacity  = '0.35';
  });
}

/* ── Footer year ──────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
