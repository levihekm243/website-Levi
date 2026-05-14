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

const VRAGEN = [
  { id:1,  ref:"A.9.1.2",    cat:"Access Control",          w:5, q:"Does every employee have their own account? (No shared passwords)" },
  { id:2,  ref:"A.9.2.6",    cat:"Access Control",          w:5, q:"Are accounts immediately disabled when an employee leaves?" },
  { id:3,  ref:"A.9.4.3",    cat:"Access Control",          w:4, q:"Do you use two-factor authentication (2FA) for email and cloud storage?" },
  { id:4,  ref:"A.9.4.3",    cat:"Access Control",          w:3, q:"Do you have a password policy with minimum length and no reuse?" },
  { id:5,  ref:"A.9.2.3",    cat:"Access Control",          w:4, q:"Are admin rights restricted to employees who genuinely need them?" },
  { id:6,  ref:"AVG Art.30", cat:"Data & GDPR",             w:5, q:"Do you know what personal data you process and where it is stored?" },
  { id:7,  ref:"AVG Art.28", cat:"Data & GDPR",             w:5, q:"Do you have data processing agreements with vendors who handle customer data?" },
  { id:8,  ref:"A.8.2.3",    cat:"Data & GDPR",             w:4, q:"Are sensitive files stored in encrypted form?" },
  { id:9,  ref:"AVG Art.33", cat:"Data & GDPR",             w:5, q:"Do you have a procedure for reporting data breaches within 72 hours?" },
  { id:10, ref:"AVG Art.17", cat:"Data & GDPR",             w:4, q:"Are personal data deleted when a subject requests this?" },
  { id:11, ref:"A.12.3.1",   cat:"Backup & Continuity",    w:5, q:"Do you make regular backups of your business data?" },
  { id:12, ref:"A.12.3.1",   cat:"Backup & Continuity",    w:4, q:"Are backups stored at a different location than the primary data?" },
  { id:13, ref:"A.12.3.1",   cat:"Backup & Continuity",    w:5, q:"Do you test your backups? (Restore performed in the last 6 months?)" },
  { id:14, ref:"A.17.1.1",   cat:"Backup & Continuity",    w:3, q:"Can you continue operations if your primary system is down for 24 hours?" },
  { id:15, ref:"A.13.1.1",   cat:"Network & Devices",      w:4, q:"Is your Wi-Fi secured with WPA2 or WPA3 and a strong password?" },
  { id:16, ref:"A.13.1.3",   cat:"Network & Devices",      w:2, q:"Is there a separate guest network for visitors and clients?" },
  { id:17, ref:"A.11.2.8",   cat:"Network & Devices",      w:3, q:"Are all devices (laptops, phones) protected with a screen lock?" },
  { id:18, ref:"A.12.6.1",   cat:"Network & Devices",      w:4, q:"Are software updates and patches installed automatically?" },
  { id:19, ref:"A.12.2.1",   cat:"Network & Devices",      w:3, q:"Do you have antivirus software on all workstations?" },
  { id:20, ref:"A.7.2.2",    cat:"People & Awareness",     w:5, q:"Have employees been trained to recognise phishing emails?" },
  { id:21, ref:"A.16.1.2",   cat:"People & Awareness",     w:4, q:"Do employees know what to do when they suspect a security incident?" },
  { id:22, ref:"A.11.2.9",   cat:"People & Awareness",     w:2, q:"Do you have a clean-desk policy? (No sensitive info visible on desks)" },
  { id:23, ref:"A.6.2.1",    cat:"People & Awareness",     w:3, q:"Are there agreements about using personal devices for work? (BYOD)" },
  { id:24, ref:"A.6.2.2",    cat:"Remote Work & Cloud",    w:4, q:"Do employees use a VPN when working from home?" },
  { id:25, ref:"A.15.1.1",   cat:"Remote Work & Cloud",    w:3, q:"Do you know which cloud providers hold your data? (Google Drive, Dropbox, etc.)" },
  { id:26, ref:"A.6.2.1",    cat:"Remote Work & Cloud",    w:3, q:"Are business and personal cloud environments separated?" },
  { id:27, ref:"A.9.2.1",    cat:"Remote Work & Cloud",    w:4, q:"Do you have oversight of who has access to shared cloud environments?" },
  { id:28, ref:"A.11.1.2",   cat:"Physical Security",      w:3, q:"Is access to server rooms or network cabinets restricted?" },
  { id:29, ref:"A.11.2.7",   cat:"Physical Security",      w:4, q:"Are decommissioned devices securely wiped before disposal?" },
  { id:30, ref:"A.11.2.9",   cat:"Physical Security",      w:2, q:"Are sensitive documents locked away when no one is present?" },
];

const answers = {};

function buildQuestions() {
  const cats = {};
  VRAGEN.forEach((v, i) => {
    if (!cats[v.cat]) cats[v.cat] = [];
    cats[v.cat].push({ ...v, idx: i });
  });

  const container = document.getElementById('questions-container');
  let catIdx = 0;

  for (const [cat, vragen] of Object.entries(cats)) {
    catIdx++;
    const numStr = catIdx < 10 ? '0' + catIdx : '' + catIdx;

    const qHtml = vragen.map(v => `
      <div class="q-row" id="qrow-${v.idx}">
        <span class="q-ref">${v.ref}</span>
        <span class="q-text">${v.q}</span>
        <div class="q-opts">
          <button class="opt-btn" onclick="pick(${v.idx},'yes',this)">YES</button>
          <button class="opt-btn" onclick="pick(${v.idx},'partial',this)">PARTIAL</button>
          <button class="opt-btn" onclick="pick(${v.idx},'no',this)">NO</button>
        </div>
      </div>`).join('');

    const group = document.createElement('div');
    group.className = 'cat-group';
    group.innerHTML = `
      <div class="cat-header">
        <span class="cat-num">${numStr}</span>
        <span class="cat-name">${cat}</span>
        <span class="cat-count">${vragen.length} questions</span>
      </div>
      <div class="cat-questions">${qHtml}</div>`;
    container.appendChild(group);
  }
}

function pick(idx, val, btn) {
  answers[idx] = val;
  const row = document.getElementById(`qrow-${idx}`);
  row.classList.add('answered');
  row.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('sel-yes','sel-partial','sel-no'));
  btn.classList.add(`sel-${val}`);
  updateProgress();
}

function updateProgress() {
  const n = Object.keys(answers).length;
  const pct = Math.round(n / VRAGEN.length * 100);
  document.getElementById('prog-label').textContent = `${n} / ${VRAGEN.length} answered`;
  document.getElementById('prog-fill').style.width = pct + '%';
}

function runScan() {
  const n = Object.keys(answers).length;
  if (n < 15) {
    alert('Please answer at least 15 questions for a reliable score.');
    return;
  }

  let totaal = 0, behaald = 0;
  const acties = [];

  VRAGEN.forEach((v, i) => {
    const w = answers[i] || 'no';
    totaal += v.w;
    if (w === 'yes') {
      behaald += v.w;
    } else if (w === 'partial') {
      behaald += v.w * 0.5;
      acties.push({ prio: 'medium', ref: v.ref, q: v.q });
    } else {
      acties.push({ prio: v.w >= 4 ? 'high' : 'low', ref: v.ref, q: v.q });
    }
  });

  const score = totaal > 0 ? Math.round(behaald / totaal * 100) : 0;
  const cfg = score >= 80
    ? { niveau: 'Good', kleur: '#4ade80' }
    : score >= 60
    ? { niveau: 'Sufficient', kleur: '#fbbf24' }
    : score >= 40
    ? { niveau: 'Moderate', kleur: '#fb923c' }
    : { niveau: 'Insufficient', kleur: '#f87171' };

  const company = document.getElementById('company-input').value.trim() || 'Your organisation';

  document.getElementById('result-score').textContent = score + '%';
  document.getElementById('result-score').style.color = cfg.kleur;
  document.getElementById('result-bar').style.background = cfg.kleur;
  document.getElementById('result-niveau').textContent = `Rating: ${cfg.niveau} — ${company}`;

  setTimeout(() => {
    document.getElementById('result-bar').style.width = score + '%';
  }, 80);

  const order = { high: 0, medium: 1, low: 2 };
  acties.sort((a, b) => order[a.prio] - order[b.prio]);

  const list = document.getElementById('findings-list');
  if (acties.length === 0) {
    list.innerHTML = `<div class="finding">
      <span class="f-prio p-ok">COMPLIANT</span>
      <span class="f-text">No critical findings. Strong security posture.</span>
      <span class="f-ref"></span>
    </div>`;
  } else {
    list.innerHTML = acties.slice(0, 8).map(a => `
      <div class="finding">
        <span class="f-prio p-${a.prio}">${a.prio.toUpperCase()}</span>
        <span class="f-text">${a.q}</span>
        <span class="f-ref">${a.ref}</span>
      </div>`).join('')
      + (acties.length > 8 ? `<div class="finding">
        <span class="f-prio" style="visibility:hidden">—</span>
        <span class="f-text" style="color:var(--muted)">+ ${acties.length - 8} additional findings in the full report.</span>
        <span></span></div>` : '');
  }

  document.getElementById('form-view').style.display = 'none';
  document.getElementById('result-view').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetScan() {
  Object.keys(answers).forEach(k => delete answers[k]);
  document.getElementById('form-view').style.display = 'block';
  document.getElementById('result-view').style.display = 'none';
  document.getElementById('company-input').value = '';
  document.getElementById('prog-fill').style.width = '0%';
  document.getElementById('prog-label').textContent = '0 / 30 answered';
  document.querySelectorAll('.opt-btn').forEach(b =>
    b.classList.remove('sel-yes','sel-partial','sel-no'));
  document.querySelectorAll('.q-row').forEach(r => r.classList.remove('answered'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

buildQuestions();