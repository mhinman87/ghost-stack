/* ============================================================
   Ghost Stack — script.js
   Cursor, spotlight, parallax, scroll reveal, nav
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initSpotlight();
  initParallax();
  initScrollReveal();
  initWordReveal();
  initNav();
  initContactForm();
  initFooterYear();
});

/* ─────────────────────────────────────────────────────────────
   Custom ghost cursor — dot + trailing ring + hover spin/scale
───────────────────────────────────────────────────────────── */
function initCursor() {
  // Don't run on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot       = document.getElementById('cursor-dot');
  const ring      = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  const dotInner  = dot.querySelector('.cursor-inner');
  const ringInner = ring.querySelector('.cursor-inner');
  const dotSvg    = dot.querySelector('svg');
  const ringSvg   = ring.querySelector('svg');

  // Inject spin keyframe
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes hex-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleEl);

  // Hide native cursor
  document.body.style.cursor = 'none';

  const cursor = { x: -200, y: -200 };
  const ringPos = { x: -200, y: -200 };

  const INTERACTABLES = 'a, button, [role="button"], input, textarea, select, label, .service-card, .why-item';

  document.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  document.documentElement.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  // Hover: scale + spin
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(INTERACTABLES)) {
      dotSvg.style.animation  = 'hex-spin 0.9s linear infinite';
      ringSvg.style.animation = 'hex-spin 1.6s linear infinite reverse';
      dotInner.style.transform  = 'scale(2)';
      ringInner.style.transform = 'scale(2)';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(INTERACTABLES)) {
      dotSvg.style.animation  = 'none';
      ringSvg.style.animation = 'none';
      dotInner.style.transform  = 'scale(1)';
      ringInner.style.transform = 'scale(1)';
    }
  });

  function animateCursor() {
    // Dot: instant (follows mouse exactly) — 22×26px ghost, center at 11,13
    dot.style.transform = `translate(${cursor.x - 11}px, ${cursor.y - 13}px)`;

    // Ring: lerped for trailing effect — 40×46px ghost, center at 20,23
    ringPos.x += (cursor.x - ringPos.x) * 0.1;
    ringPos.y += (cursor.y - ringPos.y) * 0.1;
    ring.style.transform = `translate(${ringPos.x - 20}px, ${ringPos.y - 23}px)`;

    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);
}

/* ─────────────────────────────────────────────────────────────
   Hero spotlight — radial gradient that follows the mouse
───────────────────────────────────────────────────────────── */
function initSpotlight() {
  const hero      = document.getElementById('hero');
  const spotlight = document.getElementById('cursor-spotlight');
  if (!hero || !spotlight) return;

  const target  = { x: 50, y: 50 };
  const current = { x: 50, y: 50 };

  document.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      target.x = ((e.clientX - rect.left) / rect.width)  * 100;
      target.y = ((e.clientY - rect.top)  / rect.height) * 100;
    }
  });

  function animateSpotlight() {
    current.x += (target.x - current.x) * 0.07;
    current.y += (target.y - current.y) * 0.07;
    spotlight.style.background =
      `radial-gradient(ellipse 700px 550px at ${current.x}% ${current.y}%,
        rgba(139,92,246,0.28) 0%,
        rgba(139,92,246,0.07) 45%,
        transparent 70%)`;
    requestAnimationFrame(animateSpotlight);
  }
  requestAnimationFrame(animateSpotlight);
}

/* ─────────────────────────────────────────────────────────────
   Parallax — 3-layer floating ghost shapes
───────────────────────────────────────────────────────────── */
function initParallax() {
  const container = document.getElementById('parallax-container');
  if (!container) return;

  // Ghost body path — viewBox 0 0 100 115
  // Dome top, straight sides, 3-scallop wavy bottom
  const ghostBody = 'M14 50 Q14 8 50 8 Q86 8 86 50 L86 95 Q76 85 66 95 Q50 105 34 95 Q24 85 14 95 Z';

  // Scale factor by viewport width
  const scaleFactor = window.innerWidth < 640  ? 0.5
                    : window.innerWidth < 768  ? 0.65
                    : window.innerWidth < 1024 ? 0.8
                    : 1;

  // 3-layer shape definitions — eyes: true shows pupils
  const shapes = [
    // ── Background layer (large, slow, very faint)
    { size: 305, x:  6, y: 10, opacity: 0.10, speed: -0.14, eyes: true  },
    { size: 280, x: 80, y: 28, opacity: 0.11, speed: -0.17, eyes: false },
    { size: 315, x: 44, y: 65, opacity: 0.10, speed: -0.15, eyes: true  },
    { size: 295, x: 16, y: 88, opacity: 0.11, speed: -0.16, eyes: false },
    { size: 290, x: 74, y:118, opacity: 0.10, speed: -0.14, eyes: true  },

    // ── Middle layer
    { size: 205, x: 22, y: 22, opacity: 0.16, speed: -0.33, eyes: true  },
    { size: 220, x: 84, y: 48, opacity: 0.15, speed: -0.30, eyes: false },
    { size: 210, x: 54, y: 14, opacity: 0.18, speed: -0.36, eyes: true  },
    { size: 215, x: 30, y: 75, opacity: 0.16, speed: -0.31, eyes: true  },
    { size: 200, x: 68, y: 98, opacity: 0.17, speed: -0.34, eyes: false },

    // ── Foreground layer (small, fast, most visible)
    { size: 132, x: 14, y: 18, opacity: 0.22, speed: -0.68, eyes: true  },
    { size: 148, x: 74, y: 36, opacity: 0.20, speed: -0.63, eyes: true  },
    { size: 136, x: 44, y: 55, opacity: 0.24, speed: -0.72, eyes: true  },
    { size: 142, x: 88, y: 66, opacity: 0.21, speed: -0.70, eyes: false },
    { size: 150, x: 28, y: 85, opacity: 0.23, speed: -0.65, eyes: true  },
  ];

  const svgNS = 'http://www.w3.org/2000/svg';

  const elements = shapes.map((cfg) => {
    const sz = cfg.size * scaleFactor;
    const wrapper = document.createElement('div');
    wrapper.className = 'parallax-shape';
    wrapper.dataset.speed = String(cfg.speed);
    wrapper.style.cssText = [
      'position:absolute',
      `left:${cfg.x}%`,
      `top:${cfg.y}%`,
      'transform:translate(-50%,-50%) translateY(0px)',
      'will-change:transform',
      'pointer-events:none',
    ].join(';');

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', sz);
    svg.setAttribute('height', Math.round(sz * 1.15));  // ghost is taller than wide
    svg.setAttribute('viewBox', '0 0 100 115');
    svg.setAttribute('fill', 'none');
    svg.style.opacity = String(cfg.opacity);

    // Ghost body
    const body = document.createElementNS(svgNS, 'path');
    body.setAttribute('d', ghostBody);
    body.setAttribute('stroke', '#8b5cf6');
    body.setAttribute('stroke-width', '2.5');
    body.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(body);

    // Eyes
    if (cfg.eyes) {
      const eyeL = document.createElementNS(svgNS, 'circle');
      eyeL.setAttribute('cx', '38'); eyeL.setAttribute('cy', '50'); eyeL.setAttribute('r', '5');
      eyeL.setAttribute('fill', '#8b5cf6');
      svg.appendChild(eyeL);

      const eyeR = document.createElementNS(svgNS, 'circle');
      eyeR.setAttribute('cx', '62'); eyeR.setAttribute('cy', '50'); eyeR.setAttribute('r', '5');
      eyeR.setAttribute('fill', '#8b5cf6');
      svg.appendChild(eyeR);
    }

    wrapper.appendChild(svg);
    container.appendChild(wrapper);
    return wrapper;
  });

  // rAF loop — only update when scroll position changes
  let lastScrollY = -1;

  function animateParallax() {
    const scrollY = window.pageYOffset;
    if (scrollY !== lastScrollY) {
      lastScrollY = scrollY;
      elements.forEach((el) => {
        const speed = parseFloat(el.dataset.speed);
        el.style.transform = `translate(-50%,-50%) translateY(${scrollY * speed}px)`;
      });
    }
    requestAnimationFrame(animateParallax);
  }
  requestAnimationFrame(animateParallax);
}

/* ─────────────────────────────────────────────────────────────
   Scroll Reveal — fade + slide up via IntersectionObserver
───────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // Set initial invisible state
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

/* ─────────────────────────────────────────────────────────────
   Word Reveal — each word slides up from clip mask
───────────────────────────────────────────────────────────── */
function initWordReveal() {
  const headings = document.querySelectorAll('.word-reveal');
  if (!headings.length) return;

  headings.forEach((el) => {
    const text      = el.textContent.trim();
    const words     = text.split(/\s+/);
    const baseDelay = parseFloat(el.dataset.delay || '0');

    // Replace text with word-wrapped spans
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

/* ─────────────────────────────────────────────────────────────
   Navigation — scroll class + mobile menu toggle
───────────────────────────────────────────────────────────── */
function initNav() {
  const nav    = document.getElementById('site-nav');
  const burger = document.getElementById('nav-burger');
  const menu   = document.getElementById('nav-mobile-menu');
  if (!nav || !burger || !menu) return;

  // Scrolled state
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile menu toggle
  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    nav.classList.toggle('menu-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close on link click
  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      nav.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   Contact form — mailto fallback for static site
───────────────────────────────────────────────────────────── */
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

    // Opens the user's mail client pre-addressed to Ghost Stack
    const subject = encodeURIComponent('Hello from Ghost Stack website');
    const body    = encodeURIComponent(
      `Hi Ghost Stack team,\n\nI found you through your website and wanted to connect.\n\nMy email: ${email}\n\n`
    );
    window.location.href = `mailto:hello@ghoststack.io?subject=${subject}&body=${body}`;
  });
}

/* ─────────────────────────────────────────────────────────────
   Footer year
───────────────────────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
