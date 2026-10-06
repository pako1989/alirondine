// ================= SAGA: FUTURAMA · CHAMPIONS 3000 (girone a punti + finale + Cyber Shop + consegne) =================
// Struttura: girone con 4 giornate (andata e ritorno contro Vergon 6 e Omicron Persei 8), classifica vera,
// finale contro Bender se la Rondine e' tra le prime due. Gravita' scelta in briefing (cambia davvero il campo),
// schieramento dei compagni (abilita' reali del Calcio d'Azione), potenziamenti che abbassano la difficolta',
// consegne Planet Express per guadagnare crediti. Salvataggio: "ali-di-rondine.futurama-v3" (campi nuovi con default).
(function () {
  const K_FUT = "ali-di-rondine.futurama-v3";
  const DIFFS = ["facile", "norm", "duro", "leggenda"];
  const DIFF_N = { facile: "Facile", norm: "Normale", duro: "Duro", leggenda: "Leggenda" };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const num = (v, d) => (typeof v === "number" && isFinite(v) ? v : d);

  const GRAV = [
    { id: "bassa", n: "Bassa", pitch: "molo", d: "Scatti e tiri più veloci, per tutti" },
    { id: "norm", n: "Normale", pitch: "erba", d: "Il campo di sempre" },
    { id: "alta", n: "Alta", pitch: "campo", d: "Campo stretto, contrasti duri" }
  ];
  const FORMS = [
    { n: "Equilibrato", roles: ["nico", "tommy", "fede"], d: "Muro, Filtrante, Mira" },
    { n: "Assalto", roles: ["bruno", "fede", "tommy"], d: "Bomba, Mira, Filtrante" },
    { n: "Bastione", roles: ["nico", "gigi", "tommy"], d: "Muro, Finta, Filtrante" }
  ];
  const UPGRADES = [
    { id: "boots", name: "🚀 Scarpini Gravitazionali", cost: 50, desc: "Difficoltà -1 contro i Nibbloniani (Vergon 6)", icon: "🚀" },
    { id: "shin", name: "🤖 Parastinchi di Titanio", cost: 60, desc: "Difficoltà -1 contro i Giganti di Omicron 8", icon: "🤖" },
    { id: "matter", name: "🔋 Batteria Materia Oscura", cost: 70, desc: "Difficoltà -1 nella Finale contro Bender", icon: "🔋" }
  ];
  const BEER = { cost: 30, name: "🍺 Robobirra della Vecchia Terra" };

  // Giornate del girone + finale. "pts" salvati per fixture in prog.fx[id] = migliore risultato { pts, gf, ga }.
  const FIX = [
    { id: "v1", opp: "vergon", name: "Giornata 1 · Vergon 6", rival: "Nibbloniani di Vergon 6", captain: "Lord Nibbler", teamKey: "vergon6", grav: "norm", reward: 40, up: "boots",
      lore: "Vergon 6 sta per collassare su se stesso, e i Nibbloniani lo sanno: ti guardano come un buffet. Sono bassi, rapidissimi e hanno la fastidiosa abitudine di mangiare il pallone.",
      pre: "«Goo-goo gaga!» (Dal visore di Leela: «Terrestri, il vostro pallone è già un antipasto. Scendete pure.»)",
      post: "Leela: «Lord Nibbler mi ha appena stretto la zampa. In segno di rispetto. O di fame. Non so, la traduzione è ambigua.»" },
    { id: "o1", opp: "omicron", name: "Giornata 2 · Omicron Persei 8", rival: "Giganti di Omicron Persei 8", captain: "Lrrr", teamKey: "omicron8", grav: "norm", reward: 50, up: "shin",
      lore: "Tre metri di muscoli verdi, perennemente arrabbiati con i palinsesti terrestri. Tirano forte e fanno male. Per Lrrr ogni fallo è una questione di principio.",
      pre: "«IO SONO LRRR, SOVRANO DI OMICRON PERSEI 8! QUESTO VOSTRO 'CONTRASTO REGOLARE' CI OFFENDE E CI FA ARRABBIARE!»",
      post: "Lrrr, dopo il fischio, siede da solo in panchina: «NESSUNO VIENE PIÙ A GUARDARE LE MIE PARTITE.» Fry gli porta un panino. Lrrr non risponde, ma non lo butta." },
    { id: "v2", opp: "vergon", name: "Giornata 3 · Ritorno a Vergon", rival: "Nibbloniani di Vergon 6", captain: "Lord Nibbler", teamKey: "vergon6", grav: "bassa", reward: 40, up: "boots",
      lore: "I Nibbloniani hanno studiato la prima partita e hanno imparato tre nuovi modi di mordere. Il campo, stavolta, è a bassa gravità: i tiri volano.",
      pre: "«Goo-goo GAGA!» (Leela: «Questa volta niente buffet: abbiamo portato le posate.»)",
      post: "Nibbler pensa a come riscattarsi e si addormenta. Fry: «Quasi quasi lo adotto.» Leela: «Non adottare Nibbler.»" },
    { id: "o2", opp: "omicron", name: "Giornata 4 · Rivincita di Lrrr", rival: "Giganti di Omicron Persei 8", captain: "Lrrr", teamKey: "omicron8", grav: "alta", reward: 50, up: "shin",
      lore: "A gravità alta i Giganti pesano ancora di più. Lrrr ha scritto la rivincita sul calendario e l'ha cerchiata tre volte con un pennarello indelebile.",
      pre: "«QUESTA VOLTA VI SCHIACCERÒ CON UN ARGOMENTO MOLTO PIÙ GRANDE: IL MIO PIEDE!»",
      post: "Lrrr ha perso, ma stasera cena con voi. Ha portato una torta. Che è una televisione ricoperta di glassa. È la cosa più gentile che abbia mai fatto." }
  ];
  const FINAL = { id: "fin", opp: "bender", name: "Finale · New New York 3000", rival: "All-Star Mecha di Bender", captain: "Bender 'Titanio Lucido' Rodriguez", teamKey: "mecha_bender", grav: "norm", reward: 100, up: "matter",
    lore: "Stadio orbitale di New New York. Bender ha corrotto gli arbitri robot, installato pistoni illegali e ingaggiato Don Bot. Se vinci, la Coppa del 31° secolo va a Borgo Marino.",
    pre: "«Ehi, sacchi di carne! Gli scarpini di ricambio li avete? I miei difensori al titanio vi strapperanno le zolle da sotto i piedi. Mordete il mio lucido parastinchi metallico!»",
    post: "" };

  function defaults() {
    return { planetsCleared: [], cyberCredits: 80, trophyPlanetExpress: false, upgrades: {}, fx: {}, beer: 0, useBeer: false,
      form: 0, grav: {}, runs: 2, ending: "", trophyCoins: false, goals: 0, played: 0 };
  }
  function getProgress() {
    const p = defaults();
    try {
      const d = JSON.parse(localStorage.getItem(K_FUT));
      if (d && typeof d === "object") {
        if (Array.isArray(d.planetsCleared)) p.planetsCleared = d.planetsCleared.filter((x) => typeof x === "string");
        p.cyberCredits = Math.max(0, num(d.cyberCredits, 80));
        p.trophyPlanetExpress = !!d.trophyPlanetExpress;
        if (d.upgrades && typeof d.upgrades === "object") UPGRADES.forEach((u) => { if (d.upgrades[u.id]) p.upgrades[u.id] = true; });
        if (d.fx && typeof d.fx === "object") {
          FIX.concat([FINAL]).forEach((f) => {
            const r = d.fx[f.id];
            if (r && typeof r === "object") p.fx[f.id] = { pts: clamp(num(r.pts, 0), 0, 3), gf: num(r.gf, 0), ga: num(r.ga, 0) };
          });
        }
        p.beer = Math.max(0, Math.floor(num(d.beer, 0))); p.useBeer = !!d.useBeer && p.beer > 0;
        p.form = clamp(Math.floor(num(d.form, 0)), 0, FORMS.length - 1);
        if (d.grav && typeof d.grav === "object") FIX.concat([FINAL]).forEach((f) => { if (GRAV.some((g) => g.id === d.grav[f.id])) p.grav[f.id] = d.grav[f.id]; });
        p.runs = clamp(Math.floor(num(d.runs, 2)), 0, 5);
        p.ending = typeof d.ending === "string" ? d.ending : ""; p.trophyCoins = !!d.trophyCoins;
        p.goals = num(d.goals, 0); p.played = num(d.played, 0);
        // migrazione dal vecchio salvataggio (3 match): le vittorie contano come girone/finale vinti
        if (!Object.keys(p.fx).length) {
          if (p.planetsCleared.includes("vergon")) { p.fx.v1 = { pts: 3, gf: 1, ga: 0 }; }
          if (p.planetsCleared.includes("omicron")) { p.fx.o1 = { pts: 3, gf: 1, ga: 0 }; }
          if (p.planetsCleared.includes("mecha_bender")) { p.fx.fin = { pts: 3, gf: 1, ga: 0 }; }
        }
      }
    } catch (e) {}
    p.trophyPlanetExpress = p.trophyPlanetExpress || (p.fx.fin && p.fx.fin.pts === 3) || false;
    return p;
  }
  function saveProgress(p) {
    p.planetsCleared = [];
    if (p.fx.v1 && p.fx.v1.pts === 3) p.planetsCleared.push("vergon");
    if (p.fx.o1 && p.fx.o1.pts === 3) p.planetsCleared.push("omicron");
    if (p.fx.fin && p.fx.fin.pts === 3) p.planetsCleared.push("mecha_bender");
    try { localStorage.setItem(K_FUT, JSON.stringify(p)); } catch (e) {}
  }

  // ---- Classifica ----
  // Risultati fissi tra i due rivali (non li giochiamo noi): Vergon-Omicron 1-1 e Vergon-Omicron 2-0.
  function standings(p) {
    const t = { rondine: { n: "Rondine FC", pts: 0, g: 0 }, vergon: { n: "Nibbloniani", pts: 4, g: 2 }, omicron: { n: "Giganti Omicron", pts: 1, g: 2 } };
    FIX.forEach((f) => {
      const r = p.fx[f.id];
      if (!r) return;
      t.rondine.pts += r.pts; t.rondine.g++; t[f.opp].g++;
      t[f.opp].pts += r.pts === 3 ? 0 : r.pts === 1 ? 1 : 3;
    });
    const rows = Object.keys(t).map((k) => ({ id: k, ...t[k] }));
    rows.sort((a, b) => b.pts - a.pts || (a.id === "rondine" ? -1 : b.id === "rondine" ? 1 : 0));
    return rows;
  }
  const played = (p) => FIX.every((f) => p.fx[f.id]);
  const qualified = (p) => played(p) && standings(p).findIndex((r) => r.id === "rondine") <= 1;
  const ptsTot = (p) => FIX.reduce((s, f) => s + (p.fx[f.id] ? p.fx[f.id].pts : 0), 0);

  function effectiveDiff(p, f) {
    const base = window.getGlobalAzDiff ? window.getGlobalAzDiff() : "norm";
    let bi = DIFFS.indexOf(base); if (bi < 0) bi = 1;
    let d = 0; const why = [];
    if (p.upgrades[f.up]) { d--; why.push(UPGRADES.find((u) => u.id === f.up).name.slice(3) + " -1"); }
    if (p.useBeer && p.beer > 0) { d--; why.push("Robobirra -1"); }
    if (f.id === "fin") { d++; why.push("Arbitri corrotti +1"); }
    return { diff: DIFFS[clamp(bi + d, 0, 3)], why };
  }

  // ---- UI ----
  let onExitCallback = null;
  let styled = false;
  function injectStyle() {
    if (styled || document.getElementById("fl-style")) { styled = true; return; }
    styled = true;
    const st = document.createElement("style");
    st.id = "fl-style";
    st.textContent = `.fl-wrap{position:absolute;inset:0;background:radial-gradient(circle at 60% 30%,#003049 0%,#001219 100%);overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:8px 10px;box-sizing:border-box;color:#e0fbfc}
    .fl-top{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}
    .fl-title{font-family:var(--display);font-size:15px;line-height:1.1;color:#fee440;text-shadow:2px 2px 0 #000,0 0 10px #00f5d4}
    .fl-sub{font-size:10.5px;font-weight:700;margin-top:2px}
    .fl-res{background:rgba(0,18,25,.88);border:1.5px solid #00f5d4;border-radius:6px;padding:3px 7px;font-size:11px;text-align:right;white-space:nowrap}
    .fl-tab{background:rgba(0,18,25,.88);border:1px solid #00f5d444;border-radius:6px;padding:3px 6px;font-size:11px;width:100%;border-collapse:collapse}
    .fl-tab td,.fl-tab th{padding:1px 4px;text-align:center}.fl-tab td:first-child,.fl-tab th:first-child{text-align:left}
    .fl-tab tr.me td{color:#fee440;font-weight:800}
    .fl-dots{display:flex;gap:5px}.fl-dot{flex:1;text-align:center;font-size:10px;border-radius:5px;padding:2px 0;background:#ffffff14;border:1px solid #ffffff22}
    .fl-dot.w{background:#06d6a033;border-color:#06d6a0}.fl-dot.d{background:#fee44033;border-color:#fee440}.fl-dot.l{background:#ff006e33;border-color:#ff006e}
    .fl-star{position:absolute;width:2px;height:2px;background:#fff;top:12%;left:20%;box-shadow:60px 40px #fff,140px 80px #00f5d4,240px 30px #fee440,90px 130px #f72585,200px 140px #fff;pointer-events:none}
    .fl-vs{display:flex;align-items:center;justify-content:space-around;text-align:center}`;
    document.head.appendChild(st);
  }
  function showText(who, html) {
    const el = document.getElementById("text");
    if (el) {
      el.innerHTML = `<span class="who" style="background:#00f5d4; color:#0b092b; font-weight:900; letter-spacing:0.5px;">${who}</span><span class="t">${html}</span>`;
      el.scrollTop = 0;
    }
    if (window.addDialogueLog) window.addDialogueLog(who, html);
  }
  function showButtons(list, one) {
    const c = document.getElementById("choices");
    if (!c) return;
    c.innerHTML = "";
    c.className = "choices" + (one ? " one" : "");
    list.forEach((o) => {
      if (o.head) { const h = document.createElement("div"); h.className = "head"; h.textContent = o.head; c.appendChild(h); return; }
      const b = document.createElement("button");
      b.type = "button"; b.textContent = o.label;
      if (o.cls) b.className = o.cls;
      if (o.disabled) b.disabled = true;
      if (o.sub) { const s = document.createElement("small"); s.textContent = o.sub; b.appendChild(s); }
      b.onclick = () => { if (window.haptic) window.haptic(15); if (o.fn) o.fn(); };
      c.appendChild(b);
    });
  }
  function playSynth(freq, type = "sine", dur = 0.12, vol = 0.15) {
    try {
      const actx = window.audioCtx || (window.AudioContext && new window.AudioContext());
      if (!actx) return;
      if (actx.state === "suspended") actx.resume();
      const osc = actx.createOscillator(), gain = actx.createGain();
      osc.type = type; osc.frequency.setValueAtTime(freq, actx.currentTime);
      gain.gain.setValueAtTime(vol, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
      osc.connect(gain); gain.connect(actx.destination);
      osc.start(); osc.stop(actx.currentTime + dur);
    } catch (e) {}
  }
  const toast = (m, k, i) => { if (window.toast) window.toast(m, k || "success", i || "🛸"); };
  function activateStage() {
    injectStyle();
    if (window.setView) window.setView({ kind: "futurama" });
    const cv = document.getElementById("cv");
    if (cv) cv.hidden = true;
    const alt = document.getElementById("stageAlt");
    if (alt) {
      alt.hidden = false; alt.style.display = "block"; alt.style.position = "relative";
      alt.style.overflow = "hidden"; alt.style.zIndex = "10"; alt.innerHTML = "";
    }
    return alt;
  }
  function renderHub(p) {
    const alt = activateStage();
    if (!alt) return;
    const rows = standings(p);
    const tr = rows.map((r) => `<tr class="${r.id === "rondine" ? "me" : ""}"><td>${r.id === "rondine" ? "🦅 " : ""}${r.n}</td><td>${r.g}</td><td><b>${r.pts}</b></td></tr>`).join("");
    const dots = FIX.map((f, i) => {
      const r = p.fx[f.id];
      return `<div class="fl-dot ${r ? (r.pts === 3 ? "w" : r.pts === 1 ? "d" : "l") : ""}">G${i + 1} ${r ? (r.pts === 3 ? "V" : r.pts === 1 ? "P" : "S") : "·"}</div>`;
    }).join("") + `<div class="fl-dot ${p.fx.fin ? (p.fx.fin.pts === 3 ? "w" : "l") : ""}">🏆 ${p.fx.fin ? (p.fx.fin.pts === 3 ? "V" : "S") : "·"}</div>`;
    alt.innerHTML = `<div class="fl-wrap"><div class="fl-star"></div>
      <div class="fl-top"><div><div class="fl-title">🛸 CHAMPIONS 3000</div><div class="fl-sub">Pianeta Express Inc. · Lega Galattica</div></div>
        <div class="fl-res">⍟ <b style="color:#fee440">${p.cyberCredits}</b> crediti${p.beer ? `<br>🍺 ×${p.beer}` : ""}</div></div>
      <table class="fl-tab"><tr><th>Girone</th><th>G</th><th>Pt</th></tr>${tr}</table>
      <div class="fl-dots">${dots}</div></div>`;
  }

  function openFuturamaLeagueMenu(onBack) { onExitCallback = onBack; showHub(); }
  function exitSaga() { if (onExitCallback) onExitCallback(); else if (window.title) window.title(); }

  // ---- HUB ----
  function showHub() {
    if (window.setChapter) window.setChapter("Futurama 3000 · Champions Galattica");
    const p = getProgress();
    renderHub(p);
    const q = qualified(p), done = played(p);
    if (p.trophyPlanetExpress && !p.ending) { showEnding(); return; }
    if (p.trophyPlanetExpress) {
      showText("Prof. Farnsworth", `«Buone notizie: abbiamo la Coppa e un mutuo. Se volete, la lega concede amichevoli di rivincita, utili per i crediti.»`);
    } else if (!done) {
      showText("Prof. Farnsworth", `«Buone notizie, ciurma! Ho ipotecato la navetta sulla Rondine FC. Il girone ha <b>4 giornate</b> (andata e ritorno contro Vergon 6 e Omicron Persei 8): chi chiude tra i primi due va in finale contro Bender. Ogni risultato si può migliorare rigiocando.»`);
    } else if (q) {
      showText("Prof. Farnsworth", `«Siete tra i primi due! La <b>Finale</b> vi aspetta a New New York 3000. Bender ha già comprato il biglietto, e anche l'arbitro.»`);
    } else {
      showText("Prof. Farnsworth", `«Girone concluso, ma non siamo nei primi due. Rigiocate una giornata per migliorare il risultato: conta il punteggio migliore.»`);
    }
    const b = [{ head: "Girone" }];
    FIX.forEach((f, i) => {
      const r = p.fx[f.id];
      b.push({ label: `${r ? (r.pts === 3 ? "✓" : r.pts === 1 ? "=" : "✗") : "🚀"} G${i + 1} · ${f.opp === "vergon" ? "Vergon 6" : "Omicron 8"}`, sub: r ? `Miglior risultato ${r.gf}–${r.ga} · rigioca` : f.id === "v2" || f.id === "o2" ? "Ritorno · gravità " + GRAV.find((g) => g.id === f.grav).n.toLowerCase() : "Andata", cls: r ? "" : "hot", fn: () => briefing(f) });
    });
    b.push({ head: "Finale" });
    if (done && q) b.push({ label: p.fx.fin ? "🏆 Rigioca la Finale" : "🏆 FINALE · Bender All-Stars", sub: "New New York 3000", cls: "hot", fn: () => briefing(FINAL) });
    else b.push({ label: "🔒 Finale", sub: done ? "Serve un posto tra i primi due" : `Gioca le 4 giornate (${FIX.filter((f) => p.fx[f.id]).length}/4)`, disabled: true });
    b.push({ head: "Planet Express" },
      { label: "🛍️ Cyber Shop", sub: "Potenziamenti e Robobirra", cls: "hot", fn: showCyberShop },
      { label: `📦 Consegne (${p.runs})`, sub: "Corse per guadagnare crediti", disabled: p.runs <= 0, fn: showRuns },
      { label: "🍺 Bar Cosmico", sub: "Consigli strampalati", fn: showBenderTactics },
      { label: "◂ Menu Principale", cls: "pick", fn: exitSaga });
    showButtons(b, false);
  }

  function showCyberShop() {
    const p = getProgress();
    renderHub(p);
    showText("Bender", `«Benvenuti al Cyber Shop (illegale ma con scontrino). Hai <b>${p.cyberCredits} ⍟</b>. Ogni potenziamento abbassa di un gradino la difficoltà contro il rivale indicato. La birra vale una partita sola.»`);
    const b = UPGRADES.map((u) => {
      const owned = !!p.upgrades[u.id];
      return { label: `${owned ? "✓ " : ""}${u.name} · ${u.cost} ⍟`, sub: u.desc, cls: owned ? "" : "hot", disabled: owned || p.cyberCredits < u.cost, fn: () => {
        const q = getProgress(); if (q.cyberCredits < u.cost) return;
        q.cyberCredits -= u.cost; q.upgrades[u.id] = true; saveProgress(q);
        playSynth(780, "sine", 0.3, 0.3); toast(`Acquistato: ${u.name}`, "success", u.icon); showCyberShop();
      } };
    });
    b.push({ label: `${BEER.name} · ${BEER.cost} ⍟`, sub: `Difficoltà -1 per una partita · in dispensa: ${p.beer}`, disabled: p.cyberCredits < BEER.cost || p.beer >= 5, fn: () => {
      const q = getProgress(); if (q.cyberCredits < BEER.cost) return;
      q.cyberCredits -= BEER.cost; q.beer++; saveProgress(q); playSynth(520, "triangle", 0.25, 0.25); showCyberShop();
    } });
    b.push({ label: "◂ Torna all'Hangar", cls: "pick", fn: showHub });
    showButtons(b, false);
  }

  // ---- Consegne: scelte con rischio ----
  const RUNS = [
    { l: "📦 Pacco per Marte", s: "Sicuro: +12 ⍟", r: () => ({ cr: 12, t: "Consegna filata liscia. Il cliente firma con un tentacolo e lascia una mancia unta di olio." }) },
    { l: "☄️ Consegna tra gli asteroidi", s: "Rischio: 50% +40 ⍟, 50% -10 ⍟", r: () => Math.random() < 0.5 ? { cr: 40, t: "Slalom perfetto tra gli asteroidi! Fry ha urlato per tutto il viaggio, ma di gioia." } : { cr: -10, t: "L'asteroide ha vinto. Il pacco, per fortuna, era vuoto: dentro c'era solo un biglietto d'auguri." } },
    { l: "🐾 Il pacco di Nibbler", s: "Sorpresa: ⍟ o Robobirra", r: () => Math.random() < 0.5 ? { cr: 20, t: "Nibbler ha lasciato una busta: dentro ci sono venti crediti e una foglia secca. Probabile mancia." } : { beer: 1, t: "Nibbler ha lasciato una cassetta: una Robobirra. Ti fissa con aria misteriosa. Poi dorme." } }
  ];
  function showRuns() {
    const p = getProgress();
    renderHub(p);
    showText("Leela", `«Abbiamo ${p.runs} consegne in calendario (se ne guadagna una a ogni partita). Scegli il pacco, io piloto, Fry tiene le dita fuori dai comandi.»`);
    const b = RUNS.map((r) => ({ label: r.l, sub: r.s, cls: "hot", fn: () => {
      const q = getProgress(); if (q.runs <= 0) { showHub(); return; }
      q.runs--; const o = r.r();
      if (o.cr) q.cyberCredits = Math.max(0, q.cyberCredits + o.cr);
      if (o.beer) q.beer = Math.min(5, q.beer + o.beer);
      saveProgress(q); playSynth(o.cr < 0 ? 220 : 700, "sine", 0.3, 0.25);
      renderHub(q);
      showText("Planet Express", `${o.t}<br><b>${o.cr ? (o.cr > 0 ? "+" : "") + o.cr + " ⍟" : "+1 🍺"}</b>`);
      showButtons([{ label: "Torna all'Hangar ▸", cls: "hot", fn: showHub }], true);
    } }));
    b.push({ label: "◂ Torna all'Hangar", cls: "pick", fn: showHub });
    showButtons(b, false);
  }

  function showBenderTactics() {
    showText("Bender & Fry", `«Io di calcio capisco poco, ma di arbitri comprabili moltissimo!<br>1. Tieni premuto il <b>Tiro</b> a lungo: parte più forte.<br>2. Il tasto <b>Finta</b> manda per terra i difensori che scivolano.<br>3. Su gravità <b>bassa</b> si corre di più (anche i rivali), su gravità <b>alta</b> si lotta.<br>4. Cambia <b>schieramento</b>: Muro per i portieri, Bomba per i tiri.»`);
    showButtons([{ label: "◂ Torna all'Hangar", fn: showHub }], true);
  }

  function renderPreview(f, eff, g) {
    const alt = activateStage();
    if (!alt) return;
    alt.innerHTML = `<div class="fl-wrap"><div style="text-align:center;font-family:var(--display);font-size:13px;color:#fee440;text-shadow:0 0 8px #00f5d4">🛸 ${f.name.toUpperCase()}</div>
      <div class="fl-vs"><div><div style="font-size:30px">🦅</div><div style="color:#3fa7ff;font-weight:bold;font-size:12px">RONDINE FC</div><div style="color:#a2d2ff;font-size:10px">Leo &amp; Nico</div></div>
      <div style="font-family:var(--display);font-size:20px;color:#fee440">VS</div>
      <div><div style="font-size:30px">${f.id === "fin" ? "🤖" : "👽"}</div><div style="color:#00f5d4;font-weight:bold;font-size:12px">${f.rival.toUpperCase()}</div><div style="font-size:10px">${f.captain}</div></div></div>
      <div style="background:rgba(0,18,25,.85);border:1px solid #00f5d4;border-radius:6px;padding:3px 8px;font-size:10px;text-align:center">Gravità: <b>${g.n.toUpperCase()}</b> · Difficoltà: <b>${DIFF_N[eff.diff]}</b></div></div>`;
  }

  // ---- Briefing ----
  function briefing(f) {
    const p = getProgress();
    const g = GRAV.find((x) => x.id === (p.grav[f.id] || f.grav)) || GRAV[1];
    const eff = effectiveDiff(p, f);
    renderPreview(f, eff, g);
    showText(f.captain, `<i>${f.pre}</i><br><b>Difficoltà: ${DIFF_N[eff.diff]}</b>${eff.why.length ? " (" + eff.why.join(", ") + ")" : ""}.<br><small>Gravità ${g.n.toLowerCase()}: ${g.d}.</small>`);
    const b = [
      { label: "⚽ FISCHIO D'INIZIO", sub: `3v3 · ${f.id === "fin" ? "finale" : "giornata"}`, cls: "hot", fn: () => launch(f) },
      { label: `🌍 Gravità: ${g.n}`, sub: g.d, fn: () => { const q = getProgress(); const i = GRAV.indexOf(g); q.grav[f.id] = GRAV[(i + 1) % GRAV.length].id; saveProgress(q); briefing(f); } },
      { label: `🛡️ Schieramento: ${FORMS[p.form].n}`, sub: FORMS[p.form].d, fn: () => { const q = getProgress(); q.form = (q.form + 1) % FORMS.length; saveProgress(q); briefing(f); } },
      { label: `🍺 Robobirra${p.useBeer ? " ✓" : ""}`, sub: p.beer ? (p.useBeer ? "Attiva: difficoltà -1 (tocca per annullare)" : `Difficoltà -1 · in dispensa ${p.beer}`) : "Nessuna in dispensa", disabled: !p.beer, fn: () => { const q = getProgress(); q.useBeer = !q.useBeer; saveProgress(q); briefing(f); } },
      { label: "📜 Dossier", sub: "Lore del rivale", fn: () => { showText(f.captain, `<b>${f.rival.toUpperCase()}</b><br>${f.lore}`); showButtons([{ label: "⚽ Gioca ▸", cls: "hot", fn: () => launch(f) }, { label: "◂ Preparazione", fn: () => briefing(f) }], true); } },
      { label: "◂ Hangar", fn: showHub }
    ];
    showButtons(b, false);
  }

  function launch(f) {
    if (!window.azStartSagaMatch) { toast("Motore di gioco non pronto!", "error", "⚠️"); showHub(); return; }
    const p = getProgress();
    const g = GRAV.find((x) => x.id === (p.grav[f.id] || f.grav)) || GRAV[1];
    const eff = effectiveDiff(p, f);
    if (p.useBeer && p.beer > 0) { p.beer--; }
    p.useBeer = false;
    saveProgress(p);
    toast(`🛸 RONDINE FC vs ${f.rival.toUpperCase()} · ${DIFF_N[eff.diff]}`, "success", "🛸");
    window.azStartSagaMatch(f.teamKey, {
      mode: "amic", pitch: g.pitch, diff: eff.diff, customDiff: true, pu: true, roles: FORMS[p.form].roles
    }, (mine, theirs) => result(f, mine, theirs));
  }

  function result(f, mine, theirs) {
    if (mine === 0 && theirs === 0) { // uscita dalla partita (o 0-0): nessun effetto sulla classifica
      renderHub(getProgress());
      showText("Arbitro robot", `<b>Partita sospesa (0–0).</b> Nessun punto assegnato: il fischietto laser è tornato nella custodia.`);
      showButtons([{ label: "Preparazione ▸", cls: "hot", fn: () => briefing(f) }, { label: "◂ Hangar", fn: showHub }], true);
      return;
    }
    const p = getProgress();
    const pts = mine > theirs ? 3 : mine === theirs ? 1 : 0;
    const prev = p.fx[f.id];
    const first = !prev;
    const firstWin = pts === 3 && (!prev || prev.pts < 3);
    if (!prev || pts > prev.pts || (pts === prev.pts && mine - theirs > prev.gf - prev.ga)) p.fx[f.id] = { pts, gf: mine, ga: theirs };
    p.goals += mine; p.played++;
    p.runs = Math.min(5, p.runs + 1);
    let gain = 0;
    if (firstWin) { gain = f.reward; if (window.addCoins) window.addCoins(f.id === "fin" ? 2 : 1); }
    else if (pts === 3) gain = 10;
    p.cyberCredits += gain;
    if (f.id === "fin" && pts === 3) p.trophyPlanetExpress = true;
    saveProgress(p);
    renderHub(p);
    const sc = `${mine} – ${theirs}`;
    if (pts === 3) {
      playSynth(980, "sine", 0.45, 0.4);
      toast(`🌟 Vittoria ${sc}!`, "success", "🌟");
      const extra = firstWin ? ` Incasso: <b>+${gain} ⍟</b>.` : ` Vittoria bis: +${gain} ⍟.`;
      if (f.id === "fin") {
        showText("Prof. Farnsworth", `<b style="color:var(--gold)">TRIPLICE FISCHIO! ${sc}</b><br>«Abbiamo vinto davvero?! Fry, spegni la pompa della materia oscura: non serve più suicidarci!»${extra}`);
        showButtons([{ label: "🏆 Ritira la Coppa ▸", cls: "hot", fn: showEnding }], true);
      } else {
        const q = qualified(p);
        showText(f.captain, `<b style="color:var(--gold)">VITTORIA ${sc}!</b><br>${f.post}${extra}${played(p) ? (q ? "<br><b>Girone concluso: siete in Finale!</b>" : "<br>Girone concluso: ancora fuori dai primi due. Migliorate un risultato.") : ""}`);
        showButtons([{ label: played(p) && q ? "Verso la Finale ▸" : "Torna all'Hangar ▸", cls: "hot", fn: showHub }], true);
      }
    } else if (pts === 1) {
      showText("Leela", `<b style="color:#4cc9f0">PAREGGIO ${sc}.</b><br>«Un punto è un punto. Il portiere alieno ha fatto miracoli: ricarichiamo e riproviamo, il risultato migliore resta.»`);
      showButtons([{ label: "Rigioca ▸", cls: "hot", fn: () => briefing(f) }, { label: "◂ Hangar", fn: showHub }], true);
    } else {
      showText(f.captain, `<b style="color:#ff0054">SCONFITTA ${sc}.</b><br>${f.id === "fin" ? "«Ehi, sacchi di carne, si è visto chi ha il titanio!» (Bender, in privato, ammette che il tuo tiro l'ha spaventato.)" : "«AVETE PERSO! TORNATE A MANGIARE LA VOSTRA FOCACCIA PRIMORDIALE!»"}`);
      showButtons([{ label: "Rivincita ▸", cls: "hot", fn: () => briefing(f) }, { label: "◂ Hangar", fn: showHub }], true);
    }
  }

  function showEnding() {
    const p = getProgress();
    renderHub(p);
    if (p.ending) { showHub(); return; }
    showText("Leela", `La Coppa del 31° secolo pesa come una teglia di lasagne. Il Professore chiede a chi dedicarla: «Siete la squadra, decidete voi.»`);
    const pick = (id, line, cr) => () => {
      const q = getProgress(); q.ending = id; q.cyberCredits += cr;
      if (!q.trophyCoins) { q.trophyCoins = true; if (window.addCoins) window.addCoins(8); }
      saveProgress(q); playSynth(880, "sine", 0.5, 0.35); toast("Coppa dedicata!", "success", "🏆"); renderHub(q);
      showText("Epilogo", line); showButtons([{ label: "Torna all'Hangar ▸", cls: "hot", fn: showHub }], true);
    };
    showButtons([
      { label: "A Bender", sub: "+20 ⍟", fn: pick("bender", "Bender fissa la coppa. Per un secondo gli occhi gli si spengono: «Nessuno mi aveva mai dedicato niente.» Poi la ruba. Ma, a mezzanotte, la rimette sul tavolo con un bigliettino: «Ok, forse mi sei simpatico.»", 20) },
      { label: "Ai Nibbloniani", sub: "+20 ⍟", fn: pick("nibbler", "Lord Nibbler la accarezza con la zampa e poi la lascia: è il primo trofeo che non ha mai provato a mangiare. Il suo popolo canta fino all'alba.", 20) },
      { label: "A Lrrr", sub: "+20 ⍟", fn: pick("lrrr", "Lrrr prende la coppa con due dita come fosse di vetro. «NON SO COSA DIRE», dice, a voce molto bassa. È la prima volta che parla piano.", 20) }
    ], false);
  }

  window.openFuturamaLeagueMenu = openFuturamaLeagueMenu;
})();
