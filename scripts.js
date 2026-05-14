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
  { id:1,  ref:"A.9.1.2",   cat:"Toegangsbeheer",         w:5, q:"Heeft elk personeelslid een eigen account? (Geen gedeelde wachtwoorden)" },
  { id:2,  ref:"A.9.2.6",   cat:"Toegangsbeheer",         w:5, q:"Worden accounts van medewerkers direct uitgeschakeld na uitdiensttreding?" },
  { id:3,  ref:"A.9.4.3",   cat:"Toegangsbeheer",         w:4, q:"Gebruikt u twee-factor authenticatie (2FA) voor e-mail en cloudopslag?" },
  { id:4,  ref:"A.9.4.3",   cat:"Toegangsbeheer",         w:3, q:"Heeft u een wachtwoordbeleid met minimale lengte en geen hergebruik?" },
  { id:5,  ref:"A.9.2.3",   cat:"Toegangsbeheer",         w:4, q:"Zijn admin-rechten beperkt tot medewerkers die deze écht nodig hebben?" },
  { id:6,  ref:"AVG Art.30", cat:"Gegevens & AVG",          w:5, q:"Weet u welke persoonsgegevens u verwerkt en waar deze zijn opgeslagen?" },
  { id:7,  ref:"AVG Art.28", cat:"Gegevens & AVG",          w:5, q:"Heeft u een verwerkersovereenkomst met leveranciers die klantdata verwerken?" },
  { id:8,  ref:"A.8.2.3",    cat:"Gegevens & AVG",          w:4, q:"Worden gevoelige bestanden versleuteld opgeslagen?" },
  { id:9,  ref:"AVG Art.33", cat:"Gegevens & AVG",          w:5, q:"Heeft u een procedure voor datalekmelding binnen 72 uur?" },
  { id:10, ref:"AVG Art.17", cat:"Gegevens & AVG",          w:4, q:"Worden persoonsgegevens verwijderd als een betrokkene dit verzoekt?" },
  { id:11, ref:"A.12.3.1",   cat:"Back-up & Continuïteit", w:5, q:"Maakt u regelmatig back-ups van uw bedrijfsdata?" },
  { id:12, ref:"A.12.3.1",   cat:"Back-up & Continuïteit", w:4, q:"Worden back-ups opgeslagen op een andere locatie dan de primaire data?" },
  { id:13, ref:"A.12.3.1",   cat:"Back-up & Continuïteit", w:5, q:"Test u uw back-ups? (herstel uitgevoerd afgelopen 6 maanden?)" },
  { id:14, ref:"A.17.1.1",   cat:"Back-up & Continuïteit", w:3, q:"Kunt u de bedrijfsvoering voortzetten als uw primaire systeem 24 uur uitvalt?" },
  { id:15, ref:"A.13.1.1",   cat:"Netwerk & Apparaten",    w:4, q:"Is uw wifi beveiligd met WPA2 of WPA3 en een sterk wachtwoord?" },
  { id:16, ref:"A.13.1.3",   cat:"Netwerk & Apparaten",    w:2, q:"Is er een apart gastnetwerk voor bezoekers en klanten?" },
  { id:17, ref:"A.11.2.8",   cat:"Netwerk & Apparaten",    w:3, q:"Zijn alle apparaten (laptops, telefoons) voorzien van schermvergrendeling?" },
  { id:18, ref:"A.12.6.1",   cat:"Netwerk & Apparaten",    w:4, q:"Worden software-updates en patches automatisch geïnstalleerd?" },
  { id:19, ref:"A.12.2.1",   cat:"Netwerk & Apparaten",    w:3, q:"Heeft u antivirussoftware op alle werkstations?" },
  { id:20, ref:"A.7.2.2",    cat:"Medewerkers & Bewustzijn", w:5, q:"Zijn medewerkers getraind om phishing-e-mails te herkennen?" },
  { id:21, ref:"A.16.1.2",   cat:"Medewerkers & Bewustzijn", w:4, q:"Weten medewerkers wat ze moeten doen bij een verdacht incident?" },
  { id:22, ref:"A.11.2.9",   cat:"Medewerkers & Bewustzijn", w:2, q:"Heeft u een clean-desk beleid? (Geen vertrouwelijke info zichtbaar op bureau)" },
  { id:23, ref:"A.6.2.1",    cat:"Medewerkers & Bewustzijn", w:3, q:"Zijn er afspraken over het gebruik van privé-apparaten voor werk? (BYOD)" },
  { id:24, ref:"A.6.2.2",    cat:"Thuiswerken & Cloud",    w:4, q:"Gebruiken medewerkers een VPN bij thuiswerken?" },
  { id:25, ref:"A.15.1.1",   cat:"Thuiswerken & Cloud",    w:3, q:"Weet u bij welke cloudproviders uw data staat? (Google Drive, Dropbox, etc.)" },
  { id:26, ref:"A.6.2.1",    cat:"Thuiswerken & Cloud",    w:3, q:"Zijn zakelijke en privé cloudomgevingen gescheiden?" },
  { id:27, ref:"A.9.2.1",    cat:"Thuiswerken & Cloud",    w:4, q:"Heeft u inzicht in wie toegang heeft tot gedeelde cloudomgevingen?" },
  { id:28, ref:"A.11.1.2",   cat:"Fysieke Beveiliging",    w:3, q:"Is toegang tot serverruimtes of netwerkkastjes beperkt?" },
  { id:29, ref:"A.11.2.7",   cat:"Fysieke Beveiliging",    w:4, q:"Worden afgedankte apparaten veilig vernietigd met data-wissing?" },
  { id:30, ref:"A.11.2.9",   cat:"Fysieke Beveiliging",    w:2, q:"Zijn gevoelige documenten achter slot als niemand aanwezig is?" },
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
          <button class="opt-btn" onclick="pick(${v.idx},'ja',this)">JA</button>
          <button class="opt-btn" onclick="pick(${v.idx},'deels',this)">DEELS</button>
          <button class="opt-btn" onclick="pick(${v.idx},'nee',this)">NEE</button>
        </div>
      </div>`).join('');

    const group = document.createElement('div');
    group.className = 'cat-group';
    group.innerHTML = `
      <div class="cat-header">
        <span class="cat-num">${numStr}</span>
        <span class="cat-name">${cat}</span>
        <span class="cat-count">${vragen.length} vragen</span>
      </div>
      <div class="cat-questions">${qHtml}</div>`;
    container.appendChild(group);
  }
}

function pick(idx, val, btn) {
  answers[idx] = val;
  const row = document.getElementById(`qrow-${idx}`);
  row.classList.add('answered');
  row.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('sel-ja','sel-deels','sel-nee'));
  btn.classList.add(`sel-${val}`);
  updateProgress();
}

function updateProgress() {
  const n = Object.keys(answers).length;
  const pct = Math.round(n / VRAGEN.length * 100);
  document.getElementById('prog-label').textContent = `${n} / ${VRAGEN.length} beantwoord`;
  document.getElementById('prog-fill').style.width = pct + '%';
}

function runScan() {
  const n = Object.keys(answers).length;
  if (n < 15) {
    alert('Beantwoord minimaal 15 vragen voor een betrouwbare score.');
    return;
  }

  let totaal = 0, behaald = 0;
  const acties = [];

  VRAGEN.forEach((v, i) => {
    const w = answers[i] || 'nee';
    totaal += v.w;
    if (w === 'ja') {
      behaald += v.w;
    } else if (w === 'deels') {
      behaald += v.w * 0.5;
      acties.push({ prio: 'middel', ref: v.ref, q: v.q });
    } else {
      acties.push({ prio: v.w >= 4 ? 'hoog' : 'laag', ref: v.ref, q: v.q });
    }
  });

  const score = totaal > 0 ? Math.round(behaald / totaal * 100) : 0;
  const cfg = score >= 80
    ? { niveau: 'Goed', kleur: '#4ade80' }
    : score >= 60
    ? { niveau: 'Voldoende', kleur: '#fbbf24' }
    : score >= 40
    ? { niveau: 'Matig', kleur: '#fb923c' }
    : { niveau: 'Onvoldoende', kleur: '#f87171' };

  const company = document.getElementById('company-input').value.trim() || 'Uw bedrijf';

  document.getElementById('result-score').textContent = score + '%';
  document.getElementById('result-score').style.color = cfg.kleur;
  document.getElementById('result-bar').style.background = cfg.kleur;
  document.getElementById('result-niveau').textContent = `Niveau: ${cfg.niveau} — ${company}`;

  setTimeout(() => {
    document.getElementById('result-bar').style.width = score + '%';
  }, 80);

  const order = { hoog: 0, middel: 1, laag: 2 };
  acties.sort((a, b) => order[a.prio] - order[b.prio]);

  const list = document.getElementById('findings-list');
  if (acties.length === 0) {
    list.innerHTML = `<div class="finding">
      <span class="f-prio p-ok">COMPLIANT</span>
      <span class="f-text">Geen kritieke bevindingen. Uitstekende beveiligingshouding.</span>
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
        <span class="f-text" style="color:#444">+ ${acties.length - 8} verdere bevindingen in het volledige rapport.</span>
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
  document.getElementById('prog-label').textContent = '0 / 30 beantwoord';
  document.querySelectorAll('.opt-btn').forEach(b =>
    b.classList.remove('sel-ja','sel-deels','sel-nee'));
  document.querySelectorAll('.q-row').forEach(r => r.classList.remove('answered'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

buildQuestions();