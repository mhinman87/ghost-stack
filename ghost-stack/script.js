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
  initTileStrip();
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

  const cursorSize = 50;

  const cursor = document.createElement('div');
  cursor.className = 'snowflake-cursor';
  cursor.innerHTML = `<img src="yeti-hand-pointer.png" width="${cursorSize}" alt="" draggable="false" style="pointer-events:none; height:auto;">`;
  cursor.style.display = 'none';

  document.body.appendChild(cursor);

  // Only hide default cursor on hoverable elements
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = 'a, button, input, textarea, select, [role="button"], .service-card, .service-block, .why-item, .process-step, .nav-cta, .nav-mobile-cta, .btn-primary, .social-icon { cursor: none !important; }';
  document.head.appendChild(cursorStyle);

  let hovering = false;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = (e.clientX - cursorSize * 0.55) + 'px';
    cursor.style.top  = (e.clientY - cursorSize * 0.15) + 'px';

    const target = e.target.closest('a, button, input, textarea, select, [role="button"], .service-card, .service-block, .why-item, .process-step, .nav-cta, .nav-mobile-cta, .btn-primary, .social-icon');
    const isHovering = !!target;
    if (isHovering !== hovering) {
      hovering = isHovering;
      cursor.style.display = hovering ? '' : 'none';
    }
  });
}

/* ── Tile strip ──────────────────────────────────────────── */
function initTileStrip() {
  const grid = document.getElementById('tile-grid');
  if (!grid) return;

  const symbols = ['×', '○', 'W', '>', '✳', '⊕'];
  const cellSize = 40;
  const gap = 4;
  let cols = 0;
  let rows = 0;
  let tiles = [];

  function build() {
    grid.innerHTML = '';
    const rect = grid.getBoundingClientRect();
    cols = Math.floor((rect.width + gap) / (cellSize + gap));
    rows = Math.floor((rect.height + gap) / (cellSize + gap));
    tiles = [];

    for (let i = 0; i < cols * rows; i++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      tile.innerHTML =
        '<div class="tile-inner">' +
          '<div class="tile-front"></div>' +
          '<div class="tile-back">' + symbol + '</div>' +
        '</div>';
      tile.dataset.index = i;
      grid.appendChild(tile);
      tiles.push(tile);
    }
  }

  function flipTile(tile, delay) {
    if (tile.classList.contains('flipped')) return;
    setTimeout(() => {
      tile.classList.add('flipped');
      setTimeout(() => {
        tile.classList.remove('flipped');
      }, 800 + delay);
    }, delay);
  }

  function getNeighbors(idx) {
    const r = Math.floor(idx / cols);
    const c = idx % cols;
    const neighbors = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          neighbors.push(nr * cols + nc);
        }
      }
    }
    return neighbors;
  }

  grid.addEventListener('mouseover', (e) => {
    const tile = e.target.closest('.tile');
    if (!tile) return;
    const idx = +tile.dataset.index;

    // Flip the hovered tile immediately
    flipTile(tile, 0);

    // Flip neighbors with a slight stagger
    const neighbors = getNeighbors(idx);
    neighbors.forEach((ni) => {
      flipTile(tiles[ni], 60 + Math.random() * 80);
    });
  });

  build();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
}

/* ── Footer year ──────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
