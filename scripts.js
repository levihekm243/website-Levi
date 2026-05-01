// ================================
// Levi Hekman Portfolio — scripts.js
// ================================


// ── 1. ACTIVE NAV LINK ON SCROLL ────────────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});


// ── 2. SCROLL FADE-UP ANIMATIONS ────────────────────────────────────────────
const faders = document.querySelectorAll('.fade-up');

const fadeObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

faders.forEach(el => fadeObserver.observe(el));


// ── 3. ANIMATED BACKGROUND GRID (Canvas) ────────────────────────────────────
(function initGrid() {
  const canvas = document.getElementById('hero-grid');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const SPACING    = 44;
  const DOT_R      = 1.2;
  const COLOR      = 'rgba(0, 220, 180, ';
  const WAVE_SPEED = 0.0012;
  const WAVE_AMP   = 0.18;

  let W, H, cols, rows, startTime = null;

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
    cols = Math.ceil(W / SPACING) + 1;
    rows = Math.ceil(H / SPACING) + 1;
  }

  function draw(ts) {
    if (!startTime) startTime = ts;
    const t = (ts - startTime) * WAVE_SPEED;

    ctx.clearRect(0, 0, W, H);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x    = c * SPACING;
        const y    = r * SPACING;
        const wave = Math.sin(t + (c + r) * 0.35) * 0.5 + 0.5;
        const alpha = 0.07 + wave * WAVE_AMP;

        ctx.beginPath();
        ctx.arc(x, y, DOT_R, 0, Math.PI * 2);
        ctx.fillStyle = COLOR + alpha.toFixed(3) + ')';
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
})();


// ── 4. GLITCH EFFECT on hero name ───────────────────────────────────────────
(function initGlitch() {
  const el = document.getElementById('hero-name-accent');
  if (!el) return;

  const original = 'Hekman';
  const chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

  function randomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
  }

  function glitch() {
    let iterations = 0;
    const interval = setInterval(() => {
      el.textContent = original
        .split('')
        .map((char, i) => (i < iterations ? char : randomChar()))
        .join('');

      iterations += 0.4;

      if (iterations >= original.length + 1) {
        el.textContent = original;
        clearInterval(interval);
      }
    }, 40);
  }

  setTimeout(glitch, 900);
  setInterval(glitch, 6000);
})();


// ── 5. COUNTER ANIMATION on stats ───────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el       = entry.target;
      const target   = parseInt(el.dataset.count, 10);
      const duration = 1200;
      const start    = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }

      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
})();
