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
  initTileStrip();
  initPixelTitle();
  initProcessTimeline();
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
    const isCard = el.classList.contains('service-card');
    const dist = isCard ? '80px' : '40px';
    const dur  = isCard ? '1.2s' : '0.75s';
    el.style.opacity   = '0';
    el.style.transform = `translateY(${dist})`;
    const delay = el.dataset.delay || '0';
    el.style.transition = [
      `opacity ${dur} cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      `transform ${dur} cubic-bezier(0.16,1,0.3,1) ${delay}s`,
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

/* ── Pixel title (service pages) ──────────────────────────── */
function initPixelTitle() {
  const hero = document.querySelector('.pixel-hero');
  const grid = document.getElementById('pixel-title-grid');
  if (!hero || !grid) return;

  const titleEl = hero.querySelector('.pixel-hero-title');
  const titleText = titleEl ? titleEl.textContent.trim() : 'DESIGN';

  const cellSize = 8;
  const gap = 2;
  const step = cellSize + gap;
  let cols = 0;
  let rows = 0;
  let tileMap = {};  // key: "col,row" → tile element
  function build() {
    grid.innerHTML = '';
    tileMap = {};

    const w = hero.offsetWidth;
    const h = hero.offsetHeight;
    cols = Math.floor(w / step);
    rows = Math.floor(h / step);

    // Offscreen canvas to sample text shape
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Draw text matching the CSS title — scale font to fit viewport width
    const padding = w * 0.08; // 4% each side
    let fontSize = Math.min(w * 0.18, 320);
    ctx.font = `700 ${fontSize}px Outfit, sans-serif`;
    let measured = ctx.measureText(titleText).width;
    if (measured > w - padding) {
      fontSize *= (w - padding) / measured;
    }
    ctx.font = `700 ${fontSize}px Outfit, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText(titleText, w / 2, h / 2);

    const imageData = ctx.getImageData(0, 0, w, h).data;

    grid.style.setProperty('--cell', cellSize + 'px');

    // Create tiles only where text pixels exist
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = c * step + Math.floor(step / 2);
        const py = r * step + Math.floor(step / 2);
        const idx = (py * w + px) * 4;
        const alpha = imageData[idx + 3];

        if (alpha > 128) {
          const tile = document.createElement('div');
          tile.className = 'ptile';
          tile.style.left = (c * step) + 'px';
          tile.style.top = (r * step) + 'px';
          tile.innerHTML =
            '<div class="ptile-inner">' +
              '<div class="ptile-front"></div>' +
              '<div class="ptile-back"></div>' +
            '</div>';
          tile.dataset.col = c;
          tile.dataset.row = r;
          grid.appendChild(tile);
          tileMap[c + ',' + r] = tile;
        }
      }
    }

    // Sync CSS title font size so the fallback text matches before grid appears
    if (titleEl) titleEl.style.fontSize = fontSize + 'px';

    hero.classList.add('pixels-active');
  }

  function flipTile(tile, delay) {
    if (!tile || tile.classList.contains('flipped')) return;
    setTimeout(() => {
      tile.classList.add('flipped');
      setTimeout(() => {
        tile.classList.remove('flipped');
      }, 900 + delay);
    }, delay);
  }

  function flipAt(c, r, delay) {
    const tile = tileMap[c + ',' + r];
    if (tile) flipTile(tile, delay);
  }

  // Track mouse position and flip tiles under cursor + neighbors
  grid.addEventListener('mousemove', (e) => {
    const rect = grid.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const c = Math.floor(mx / step);
    const r = Math.floor(my / step);

    // Flip hovered tile
    flipAt(c, r, 0);

    // Flip neighbors
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        flipAt(c + dc, r + dr, 40 + Math.random() * 60);
      }
    }
  });

  build();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
}


/* ── Process timeline (scroll-driven dotted line) ─────────── */
function initProcessTimeline() {
  const stepsWrap = document.getElementById('process-steps');
  const lineFill = document.getElementById('process-line-fill');
  const ctaWrap = document.querySelector('.process-cta-wrap');
  if (!stepsWrap || !lineFill) return;

  const steps = stepsWrap.querySelectorAll('.process-step');
  const thresholds = [0.05, 0.3, 0.55, 0.8];

  function onScroll() {
    const rect = stepsWrap.getBoundingClientRect();
    const vh = window.innerHeight;
    // Progress: 0 when section enters bottom of viewport, 1 when top reaches mid-screen
    const start = vh;          // bottom edge enters viewport
    const end = vh * 0.3;      // top of section reaches 30% from top
    const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));

    // Reveal the dotted line left-to-right
    const clipRight = Math.max(0, 100 - progress * 100);
    lineFill.style.clipPath = `inset(0 ${clipRight}% 0 0)`;

    // Reveal steps as line reaches them
    steps.forEach((step, i) => {
      if (progress >= thresholds[i]) {
        step.classList.add('reached');
      } else {
        step.classList.remove('reached');
      }
    });

    // Show CTA when line is complete
    if (ctaWrap) {
      if (progress >= 0.95) {
        ctaWrap.classList.add('visible');
      } else {
        ctaWrap.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Footer year ──────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
