(function(){
  var VRAGEN = [
    {t:"Staat er tweestapsverificatie op je e-mail en cloudopslag?", s:"De meeste inbraken bij kleine bedrijven beginnen bij een gestolen wachtwoord.", g:"Toegangsbeveiliging", a:"Zet tweestapsverificatie aan op e-mail, cloudopslag en je boekhoudpakket. Dit is de goedkoopste maatregel met het grootste effect."},
    {t:"Heb je het afgelopen jaar een back-up daadwerkelijk teruggezet?", s:"Een back-up die je nooit getest hebt, is een aanname.", g:"Herstel na incident", a:"Zet één keer per jaar een back-up terug in een testomgeving. Pas dan weet je of je hem echt hebt."},
    {t:"Is vastgelegd wie toegang heeft tot welke systemen?", s:"Denk ook aan oud-medewerkers, stagiairs en leveranciers.", g:"Toegangsrechten", a:"Maak een overzicht van accounts per systeem en loop het elk kwartaal na. Oud-medewerkers zijn het vaakst vergeten risico."},
    {t:"Weet je welke persoonsgegevens je verwerkt en waar die staan?", s:"Dit is de basis van de AVG — en de eerste vraag bij een datalek.", g:"AVG / persoonsgegevens", a:"Leg vast welke persoonsgegevens je verwerkt, waarom, en waar ze staan. Zonder dat overzicht kun je een datalek niet goed en op tijd melden — en dat moet binnen 72 uur."},
    {t:"Heb je afspraken met leveranciers over beveiliging en datalekken?", s:"Je websitebouwer en je boekhouder verwerken vaak jouw klantgegevens.", g:"Leveranciers", a:"Leg per leverancier vast wie waarvoor verantwoordelijk is en binnen hoeveel tijd zij een incident melden."},
    {t:"Is er een plan voor als het misgaat — wie belt wie, en hoe snel?", s:"Op het moment zelf is er geen tijd om dit te bedenken.", g:"Incidentplan", a:"Schrijf één A4: wie beslist, wie belt de klanten, wie de verzekeraar, en binnen welke termijn. Meer is het niet."}
  ];
  var antw = {}, qs = document.getElementById('qs');
  if (!qs) return;              // de check staat alleen op de homepage

  VRAGEN.forEach(function(v, i){
    var row = document.createElement('div');
    row.className = 'q';
    var left = document.createElement('div');
    left.innerHTML = '<span class="qt">' + v.t + '</span><span class="qs">' + v.s + '</span>';
    var opts = document.createElement('div');
    opts.className = 'opts';
    opts.setAttribute('role','group');
    opts.setAttribute('aria-label', v.t);
    [['Ja',2],['Deels',1],['Nee',0]].forEach(function(o){
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = o[0];
      b.setAttribute('aria-pressed','false');
      b.addEventListener('click', function(){
        Array.prototype.forEach.call(opts.children, function(c){ c.setAttribute('aria-pressed','false'); });
        b.setAttribute('aria-pressed','true');
        antw[i] = o[1];
        update();
      });
      opts.appendChild(b);
    });
    row.appendChild(left); row.appendChild(opts); qs.appendChild(row);
  });

  var go = document.getElementById('go'), fill = document.getElementById('fill'), count = document.getElementById('count');
  function update(){
    var n = Object.keys(antw).length;
    count.textContent = n + ' van ' + VRAGEN.length;
    fill.style.width = (n / VRAGEN.length * 100) + '%';
    go.disabled = n < VRAGEN.length;
  }

  function toon(){
    var totaal = 0;
    for (var k in antw) totaal += antw[k];
    var pct = Math.round(totaal / (VRAGEN.length * 2) * 100);

    var band, oordeel;
    if (pct >= 80){ band = 'Je staat er goed voor.';
      oordeel = 'De basis is op orde. De winst zit nu in vastleggen en aantoonbaar maken — zodat je het ook kunt laten zien aan een klant, auditor of verzekeraar.'; }
    else if (pct >= 50){ band = 'De basis staat, de afwerking niet.';
      oordeel = 'Je hebt de belangrijkste dingen geregeld, maar er zitten gaten waar in de praktijk juist incidenten door ontstaan. Met een paar gerichte stappen is dit snel een stuk steviger.'; }
    else if (pct >= 25){ band = 'Hier valt veel te winnen.';
      oordeel = 'Een aantal fundamenten ontbreekt. Dat is geen ramp en ook niet ongewoon voor een klein bedrijf — maar het betekent wel dat één fout nu een groot probleem kan worden.'; }
    else { band = 'Dit vraagt op korte termijn aandacht.';
      oordeel = 'Op dit moment is er weinig dat je beschermt als er iets misgaat. Het goede nieuws: de eerste twee maatregelen hieronder kosten vrijwel niets en halen het grootste risico er al af.'; }

    document.getElementById('band').textContent = band;
    document.getElementById('verdict').textContent = oordeel;
    document.getElementById('pct').innerHTML = pct + '<i>%</i>';
    document.getElementById('ring').style.setProperty('--deg', (pct * 3.6) + 'deg');

    var zwak = VRAGEN.map(function(v,i){ return {v:v, s:antw[i]}; })
                     .filter(function(x){ return x.s < 2; })
                     .sort(function(a,b){ return a.s - b.s; })
                     .slice(0,2);
    var gaps = document.getElementById('gaps');
    gaps.innerHTML = '';
    if (!zwak.length){
      gaps.innerHTML = '<p class="gap-leeg">Op deze zes punten scoor je volledig. De logische vervolgstap is de uitgebreide check van dertig controls.</p>';
    } else {
      zwak.forEach(function(x){
        var el = document.createElement('div');
        el.className = 'gap';
        el.innerHTML = '<span class="sev ' + (x.s === 0 ? 'hoog' : 'midden') + '">' + (x.s === 0 ? 'hoog' : 'midden') + '</span>' +
                       '<span><b>' + x.v.g + '</b><span>' + x.v.a + '</span></span>';
        gaps.appendChild(el);
      });
    }
    document.getElementById('qs').style.display = 'none';
    document.getElementById('foot').style.display = 'none';
    document.getElementById('result').classList.add('on');
    document.getElementById('result').focus();
  }

  go.addEventListener('click', toon);
  document.getElementById('again').addEventListener('click', function(){
    antw = {};
    Array.prototype.forEach.call(document.querySelectorAll('.opts button'), function(b){ b.setAttribute('aria-pressed','false'); });
    document.getElementById('qs').style.display = '';
    document.getElementById('foot').style.display = '';
    document.getElementById('result').classList.remove('on');
    document.getElementById('ring').style.setProperty('--deg','0deg');
    document.getElementById('pct').innerHTML = '0<i>%</i>';
    document.getElementById('gaps').innerHTML = '';
    update();
    var kop = document.getElementById('check-kop');
    if (kop) { kop.focus(); }
    document.getElementById('check').scrollIntoView({block:'start'});
  });
  update();
})();

(function(){
  var els = [].slice.call(document.querySelectorAll('.reveal'));
  if (!els.length) return;

  function inBeeld(el){
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }
  function direct(el){ el.classList.add('instant', 'in'); }

  // Wat al in beeld staat bij het laden (ook na een sprong via #anker)
  // verschijnt meteen, zonder fade. Anders zie je een donker vlak.
  els.filter(inBeeld).forEach(direct);

  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px 15% 0px' });   // iets eerder dan de vouw

  els.forEach(function(el){ if (!el.classList.contains('in')) io.observe(el); });

  // Na een ankersprong staat er ineens ander materiaal in beeld.
  window.addEventListener('hashchange', function(){
    setTimeout(function(){
      els.forEach(function(el){
        if (!el.classList.contains('in') && inBeeld(el)){ direct(el); io.unobserve(el); }
      });
    }, 0);
  });
})();


// ── MOBIEL MENU ─────────────────────────────────────────────────────────────
// Geen inline handlers: die worden door de CSP geblokkeerd.
(function(){
  var btn = document.querySelector('.nav-toggle');
  if (!btn) return;
  var balk = btn.closest('.nav-in') || btn.closest('.nav');  // portfolio.html heeft een eigen navigatie
  var menu = document.getElementById('nav-menu');
  function zet(open){
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    balk.classList.toggle('is-open', open);
  }
  btn.addEventListener('click', function(){
    zet(btn.getAttribute('aria-expanded') !== 'true');
  });
  if (menu) menu.addEventListener('click', function(e){
    if (e.target.tagName === 'A') zet(false);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true'){
      zet(false); btn.focus();
    }
  });
})();
