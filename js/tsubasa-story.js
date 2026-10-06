// ================= TSUBASA · IL TIRO COMBINATO DELLA SCOGLIERA (v2) =================
// Torneo a 4 tappe contro squadre rivali, con partite vere (Calcio d'Azione Pro) e un minigioco
// tutto suo: il TIRO COMBINATO. Due indicatori (Leo e Nico) vanno fermati in sintonia, poi si tocca
// la porta per scegliere dove calciare: la qualità della sintonia decide quanto è preciso il tiro,
// il portiere finta e legge. Il livello di Sintonia (1-5) cresce con gli allenamenti e le vittorie
// e rende il tiro più preciso e sblocca uno slot mossa in più nel Piano di Gioco.
// Salvataggio: "ali-di-rondine.tsubasa-v3" (campi vecchi compatibili: stage, cleared, syncLevel, goals).
(function () {
  const K_TSU = "ali-di-rondine.tsubasa-v3";
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const XP_AT = [0, 3, 7, 12, 18]; // XP necessari per i livelli 1..5

  function defaults() {
    return { stage: 0, cleared: [], syncLevel: 1, goals: 0, syncXp: 0, paid: {}, pending: false, cup: false, slot: false, losses: 0, best: 0 };
  }
  function getProgress() {
    const d0 = defaults();
    try {
      const d = JSON.parse(localStorage.getItem(K_TSU));
      if (d && typeof d === "object") {
        const o = Object.assign(d0, d);
        o.stage = typeof d.stage === "number" ? clamp(d.stage, 0, 4) : 0;
        o.cleared = Array.isArray(d.cleared) ? d.cleared.filter((x) => TEAMS_DATA.some((t) => t.id === x)) : [];
        o.paid = Object.assign({}, d.paid || {});
        if (d.cup === undefined) o.cup = o.stage >= 4; // vecchi salvataggi: tutte e 4 le tappe = coppa
        if (!d.syncXp) o.syncXp = XP_AT[clamp((d.syncLevel || 1) - 1, 0, 4)];
        o.syncLevel = levelOf(o.syncXp, o);
        return o;
      }
    } catch (e) {}
    return d0;
  }
  function levelOf(xp, p) {
    let l = 1;
    for (let i = 1; i < 5; i++) if (xp >= XP_AT[i]) l = i + 1;
    if (l >= 5 && p && p.cleared.length < 3) l = 4; // il livello 5 si guadagna con il torneo
    return l;
  }
  function saveProgress(p) {
    try { localStorage.setItem(K_TSU, JSON.stringify(p)); } catch (e) {}
  }
  function addXp(p, n) {
    const before = p.syncLevel;
    p.syncXp = Math.min(30, (p.syncXp || 0) + n);
    p.syncLevel = levelOf(p.syncXp, p);
    return p.syncLevel > before;
  }
  function pay(p, key, n) {
    if (p.paid[key]) return 0;
    p.paid[key] = true;
    try { if (window.addCoins && n > 0) window.addCoins(n); } catch (e) {}
    return n;
  }

  // rec = mosse consigliate (id abilità di Calcio d'Azione: tommy=Filtrante, nico=Muro, gigi=Finta, fede=Mira, bruno=Bomba)
  const MOVES = {
    tommy: { n: "Filtrante", d: "Palla veloce al compagno più avanti" },
    nico: { n: "Muro", d: "Per 4 secondi il portiere para quasi tutto" },
    gigi: { n: "Finta", d: "Due avversari restano incantati un secondo" },
    fede: { n: "Mira", d: "Il prossimo tiro è preciso e più forte" },
    bruno: { n: "Bomba", d: "Tiro da lontano come uno speciale" }
  };
  const TEAMS_DATA = [
    {
      id: "muppet", name: "La Muppet della Riviera", captain: "Brando 'Il Tigre' De Marchi", gkName: "Gino Baroni", teamKey: "muppet", pitch: "molo",
      rec: ["gigi", "nico"], gkReach: 17, fb: 0.2,
      quote: "«Il calcio è una zuffa per la sopravvivenza. Chi ha paura dell'impatto si sieda in panchina!»",
      lore: "Arrivano con un furgone scassato che puzza di gasolio. Si allenano sui ciottoli della falesia per spaccare le zolle ad ogni scatto.",
      dialogueIntro: "Leo Moretti! Ti credi un fenomeno perché il borgo ti applaude mentre mangi la focaccia? Io mi sveglio alle quattro a scaricare casse di palamite per pagarmi gli scarpini! In campo non esistono amici: se ti metti tra me e la porta, ti travolgo insieme alla rete!",
      hint: "Entrano duro e sporcano ogni contrasto: la Finta li incanta, il Muro tiene il portiere in piedi quando arrivano a valanga.",
      win: ["Il Tigre si siede sul pallone, a testa bassa. «Quattro del mattino, sempre... Mio padre mi diceva: chi si sveglia presto, perde di meno.»", "Gli porgi la mano. Non la prende subito, poi la stringe come si stringe un cavo d'ormeggio. «Domani mi alleno alle cinque.»"]
    },
    {
      id: "gemelli", name: "I Gemelli della Falesia", captain: "Dario & Mirko Trabucco", gkName: "Balzo Felino", teamKey: "gemelli", pitch: "sabbia", rec: ["tommy", "fede"], gkReach: 18, fb: 0.26,
      quote: "«Guardate verso l'alto se volete vederci giocare. La nostra catapulta parte dal cielo!»",
      lore: "Due fratelli cresciuti sui trabucchi che hanno sviluppato un'intesa aerea telepatica. Saltano l'uno sulle spalle dell'altro.",
      dialogueIntro: "Benvenuti sulla spiaggia della Falesia! Qui la palla non rimbalza come sul vostro campetto curato. Noi non corriamo sulla sabbia: noi VOLIAMO! Vedrete il pallone solo quando si infila sotto l'incrocio!",
      hint: "Sono forti di testa e di salto: tenete la palla bassa, con il Filtrante rasoterra, e puntate la Mira dove non arrivano a saltare.",
      win: ["Mirko e Dario si guardano e parlano insieme, identici come sempre: «Ci avete battuto a terra.» Poi ridono insieme. Nessuno dei due ha mai spiegato come si fa.", "«La prossima volta voleremo anche noi sulla sabbia», dice uno. «Con le ali», aggiunge l'altro. Alla fine ce ne sarà una sola, e nessuno ricorderà di chi è."]
    },
    {
      id: "flynet", name: "La Flynet del Monte Turchino", captain: "Matteo 'Gelo' Neve", gkName: "Walter Muraglia", teamKey: "flynet", pitch: "campo", rec: ["tommy", "bruno"], gkReach: 19, fb: 0.28,
      quote: "«Il vento del nord tempra i muscoli. La vostra focaccia non vi salverà dalla bufera.»",
      lore: "Una squadra di montagna abituata al gelo e al fango. Hanno una ragnatela di passaggi corti che sfianca qualsiasi attaccante.",
      dialogueIntro: "A quota mille metri l'aria è rarefatta e i polmoni bruciano dopo dieci minuti. Voi della costa siete abituati alla brezza tiepida. Oggi vi mostriamo cosa significa il sacrificio: undici uomini che si muovono come un solo blocco di ghiaccio!",
      hint: "Una ragnatela di passaggi corti e un blocco compatto: il Filtrante la spezza, e dalla distanza la Bomba è l'unico modo per bucare la muraglia.",
      win: ["Gelo si toglie un guanto. «Il ghiaccio si scioglie, a un certo punto. Non l'avevamo mai verificato.»", "In fondo al pullman, qualcuno canta un coro di montagna. Sbaglia tutte le note. È il coro più bello che il Borgo abbia sentito da tempo."]
    },
    {
      id: "sanfrancis", name: "Il San Francis del Molo Vecchio", captain: "Julian 'Il Principe' Riva", gkName: "Beniamino 'Benji' Costantini", teamKey: "sanfrancis", pitch: "erba", rec: ["fede", "bruno"], gkReach: 20, fb: 0.34,
      quote: "«Da fuori area non si passa. Non ho mai preso un gol oltre i sedici metri in tutta la mia vita.»",
      lore: "I campioni aristocratici della scogliera. Benji Costantini è il portiere imbattuto per antonomasia.",
      dialogueIntro: "Ti stavo aspettando, Moretti. Ho analizzato ogni tuo gol in campionato: hai talento, ma ti manca l'impatto decisivo contro un vero portiere. Io difendo questa porta come un tempio sacro. Se vuoi segnarmi, devi inventare qualcosa che la fisica del calcio non ha mai visto!",
      hint: "Benji para tutto ciò che vede partire. Mira e Bomba per sorprenderlo, e per il finale serve il Tiro Combinato: più è sincronizzato, più è imprendibile.",
      win: ["Julian ti guarda a lungo, poi dice piano: «Il Principe non perde mai. Ma i principi, a volte, imparano.»", "Alle sue spalle Benji si toglie i guanti: «Quel tiro mi ha tolto il sonno. Rifacciamolo domani. Cioè... domani no, ho il dentista. Dopodomani.»"]
    }
  ];

  let onExitCallback = null;

  // ---------- UI helpers ----------
  function showText(who, html) {
    const el = document.getElementById("text");
    if (el) {
      el.innerHTML = `<span class="who" style="background:#ff0054; color:#fff; font-weight:800; text-transform:uppercase;">${E(who)}</span><span class="t">${html}</span>`;
    }
    try { if (window.addDialogueLog) window.addDialogueLog(who, html); } catch (e) {}
  }
  function showButtons(list, one) {
    const c = document.getElementById("choices");
    if (!c) return;
    c.innerHTML = "";
    c.className = "choices" + (one ? " one" : "");
    list.forEach((o) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = o.label;
      if (o.cls) b.className = o.cls;
      if (o.disabled) b.disabled = true;
      if (o.sub) { const s = document.createElement("small"); s.textContent = o.sub; b.appendChild(s); }
      b.onclick = () => { try { if (window.haptic) window.haptic(15); } catch (e) {} if (o.fn) o.fn(); };
      c.appendChild(b);
    });
  }
  function playSynth(freq, type, dur, vol) {
    try {
      const actx = window.audioCtx || (window.AudioContext && new window.AudioContext());
      if (!actx) return;
      if (actx.state === "suspended") actx.resume();
      const osc = actx.createOscillator(), gain = actx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      gain.gain.setValueAtTime(vol || 0.15, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + (dur || 0.12));
      osc.connect(gain); gain.connect(actx.destination);
      osc.start(); osc.stop(actx.currentTime + (dur || 0.12));
    } catch (e) {}
  }
  function injectStyle() {
    if (document.getElementById("tsxStyle")) return;
    const s = document.createElement("style");
    s.id = "tsxStyle";
    s.textContent = `
      .tsx-st{position:absolute;inset:0;background:linear-gradient(135deg,#1b0429 0%,#3a0ca3 55%,#7a1b5a 100%);color:#fff;font:600 13px system-ui,sans-serif;display:flex;flex-direction:column;padding:6px 8px 8px;box-sizing:border-box;user-select:none;-webkit-user-select:none}
      .tsx-hud{display:flex;justify-content:space-between;gap:6px;font-size:12px;color:#ffd23f;padding:0 2px 3px}
      .tsx-m{display:flex;align-items:center;gap:6px;margin:2px 0}
      .tsx-m label{width:38px;font-size:11px;color:#9be2ff;font-weight:800}
      .tsx-track{position:relative;flex:1;height:18px;border-radius:9px;background:rgba(255,255,255,.14);border:1.5px solid rgba(255,255,255,.5);overflow:hidden}
      .tsx-zone{position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);background:rgba(125,255,166,.38);border-left:2px solid #7dffa6;border-right:2px solid #7dffa6}
      .tsx-mk{position:absolute;top:1px;bottom:1px;width:8px;margin-left:-4px;border-radius:4px;background:#ffd23f;box-shadow:0 0 8px #ffd23f}
      .tsx-mk.lock{background:#fff;box-shadow:0 0 10px #00f5d4}
      .tsx-goal{position:relative;flex:1;min-height:0;margin-top:3px;border:3px solid #fff;border-bottom:none;border-radius:4px 4px 0 0;overflow:hidden;background:repeating-linear-gradient(0deg,rgba(255,255,255,.10) 0 1px,transparent 1px 12px),repeating-linear-gradient(90deg,rgba(255,255,255,.10) 0 1px,transparent 1px 12px),rgba(0,0,0,.35);touch-action:none}
      .tsx-goal.on{box-shadow:0 0 14px #00f5d4 inset;cursor:crosshair}
      .tsx-gk{position:absolute;bottom:0;width:15%;height:62%;transform:translateX(-50%);transition:left .3s ease-out;font-size:24px;text-align:center;line-height:1;background:linear-gradient(#3fa7ff,#1d3fa3);border-radius:12px 12px 2px 2px;border:2px solid #fff;padding-top:2px;box-sizing:border-box}
      .tsx-x{position:absolute;transform:translate(-50%,-50%);font-size:16px;color:#00f5d4;pointer-events:none;font-weight:900}
      .tsx-ball{position:absolute;font-size:22px;transform:translate(-50%,-50%);pointer-events:none;text-shadow:0 0 10px #ff0054}
      .tsx-msg{min-height:19px;text-align:center;font-size:13px;padding-top:3px;font-weight:800}
      .tsx-ok{color:#7dffa6}.tsx-ko{color:#ff8a8a}
    `;
    document.head.appendChild(s);
  }
  function activateTsubasaStage() {
    injectStyle();
    try { if (window.setView) window.setView({ kind: "tsubasa" }); } catch (e) {}
    const cv = document.getElementById("cv");
    if (cv) cv.hidden = true;
    const alt = document.getElementById("stageAlt");
    if (alt) { alt.hidden = false; alt.style.display = "block"; alt.style.position = "relative"; alt.style.overflow = "hidden"; alt.style.zIndex = "10"; alt.innerHTML = ""; }
    return alt;
  }
  function leaveStage() {
    try { if (window.closeAltStage) window.closeAltStage(); } catch (e) {}
  }

  function pips(prog) {
    return TEAMS_DATA.map((t, i) => {
      const done = prog.cleared.includes(t.id);
      const cur = !done && i === Math.min(prog.stage, 3);
      return `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;margin:0 2px;border:2px solid ${done ? "#7dffa6" : cur ? "#ffd23f" : "#ffffff66"};background:${done ? "#7dffa6" : "transparent"}"></span>`;
    }).join("");
  }
  function stars(n) { return "★".repeat(n) + "☆".repeat(5 - n); }

  function renderHubStage(prog, team) {
    const alt = activateTsubasaStage();
    if (!alt) return;
    const next = prog.cup ? "Coppa della Scogliera conquistata!" : prog.pending ? "Finale: il duello con Benji" : `Prossimo: ${E(team.name)}`;
    alt.innerHTML = `
      <div style="position:absolute; inset:0; background:linear-gradient(135deg, #1b0429 0%, #3a0ca3 45%, #ff0054 100%); overflow:hidden;">
        <svg style="position:absolute; inset:0; width:100%; height:100%; opacity:0.3; pointer-events:none;" viewBox="0 0 320 200" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="320" y2="200" stroke="#fff" stroke-width="2" stroke-dasharray="14 20" />
          <line x1="320" y1="0" x2="0" y2="200" stroke="#fff" stroke-width="2" stroke-dasharray="16 22" />
        </svg>
        <div style="position:absolute; bottom:-50px; left:50%; margin-left:-90px; width:180px; height:180px; border-radius:50%; background:radial-gradient(circle, #ffd23f 30%, #ff5400 70%, transparent 80%); opacity:0.8;"></div>
        <div style="position:absolute; bottom:14px; left:calc(50% - 56px); width:34px; height:55px; background:#3fa7ff; border-radius:6px 6px 2px 2px; border:2px solid #fff; box-shadow:0 0 15px #3fa7ff; transform:skewX(-12deg);"><div style="position:absolute;top:8px;left:5px;font-weight:bold;font-size:11px;color:#fff;">10</div></div>
        <div style="position:absolute; bottom:14px; left:calc(50% + 22px); width:34px; height:55px; background:#ffd23f; border-radius:6px 6px 2px 2px; border:2px solid #fff; box-shadow:0 0 15px #ffd23f; transform:skewX(-12deg);"><div style="position:absolute;top:8px;left:5px;font-weight:bold;font-size:11px;color:#000;">1</div></div>
        <div style="position:absolute; bottom:50px; left:calc(50% - 11px); width:22px; height:22px; background:#fff; border-radius:50%; border:2px solid #000; box-shadow:0 0 20px #00f5d4, 0 0 35px #ff0054;"></div>
        <div style="position:relative; z-index:5; height:100%; padding:10px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
            <div>
              <div style="font-family:var(--display); font-size:15px; color:#ffd23f; text-shadow:2px 2px 0 #900, 0 0 12px #ffd23f;">⚡ IL TORNEO DELLA SCOGLIERA</div>
              <div style="font-size:11px; color:#f3e5f5; font-weight:bold;">Il Tiro Combinato · ${pips(prog)}</div>
            </div>
            <div style="background:rgba(10,5,25,0.85); border:1.5px solid #ff0054; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; text-align:right; white-space:nowrap;">
              <div>Sintonia <b style="color:#ffd23f">${stars(prog.syncLevel)}</b></div>
              <div style="font-size:10px; color:#9be2ff;">Gol: <b>${prog.goals}</b></div>
            </div>
          </div>
          <div style="background:rgba(12,4,28,0.88); border:1.5px solid rgba(255,255,255,0.3); border-radius:6px; padding:4px 8px; font-size:11px; color:#fff;">
            ⚽ <b style="color:#ffd23f;">${next}</b>${prog.cup ? "" : `<br><span style="font-size:10px; color:#4cc9f0;">Capitano: ${E(team.captain)}</span>`}
          </div>
        </div>
      </div>`;
  }

  // ================= TIRO COMBINATO: MINIGIOCO =================
  // cfg: {title, shots, level, gkReach, fb, hint, need}
  // done({goals, shots, res:[bool], qs:[number], quit})
  function twinGame(cfg, done, quit) {
    const alt = activateTsubasaStage();
    if (!alt) { done({ goals: 0, shots: 0, res: [], qs: [] }); return; }
    alt.innerHTML = `<div class="tsx-st"><div class="tsx-hud"><span id="tsxT"></span><span id="tsxS"></span></div>
      <div id="tsxMeters"><div class="tsx-m"><label>LEO</label><div class="tsx-track"><div class="tsx-zone" id="tsxZL"></div><div class="tsx-mk" id="tsxL"></div></div></div>
      <div class="tsx-m"><label>NICO</label><div class="tsx-track"><div class="tsx-zone" id="tsxZN"></div><div class="tsx-mk" id="tsxN"></div></div></div></div>
      <div class="tsx-goal" id="tsxG"><div class="tsx-gk" id="tsxGk">🧤</div></div>
      <div class="tsx-msg" id="tsxM"></div></div>`;
    const $ = (i) => document.getElementById(i);
    const G = $("tsxG");
    const lv = cfg.level || 1, zh = 9 + lv * 2.2;
    showText("Tiro Combinato", "Tocca <b>LEO</b> e <b>NICO</b> per fermare i due indicatori nella zona verde (meglio se quasi insieme): la <b>sintonia</b> decide la precisione. Poi <b>tocca la porta</b> dove vuoi calciare. Il portiere si sposta e a volte finta: leggilo.");
    $("tsxT").textContent = cfg.title || "Tiro Combinato";
    ["tsxZL", "tsxZN"].forEach((i) => { $(i).style.width = zh * 2 + "%"; });
    let raf = 0, over = false, n = 0, goals = 0, res = [], qs = [];
    let pL = 50, pN = 50, tL = 0, tN = 0, lockL = false, lockN = false, ts = 0, aL = 0, aN = 0, q = 0, phase = "sync", gkTell = 50, tapped = false;
    const sL = 74, sN = 97;

    function hud() { $("tsxS").textContent = `Tiro ${n}/${cfg.shots} · Gol ${goals}${cfg.need ? "/" + cfg.need : ""}`; }
    function msg(t, cls) { const m = $("tsxM"); if (m) { m.textContent = t; m.className = "tsx-msg " + (cls || ""); } }
    function tri(t, sp, off) { let p = (((t / 1000) * sp + off) % 200 + 200) % 200; return p > 100 ? 200 - p : p; }
    function stop() { over = true; if (raf) cancelAnimationFrame(raf); raf = 0; }
    function setSyncBtns() {
      showButtons([
        { label: lockL ? "✓ LEO" : "⚡ LEO", sub: lockL ? "bloccato" : "ferma al centro", cls: lockL ? "" : "hot", disabled: lockL, fn: () => lock("L") },
        { label: lockN ? "✓ NICO" : "⚡ NICO", sub: lockN ? "bloccato" : "ferma al centro", cls: lockN ? "" : "hot", disabled: lockN, fn: () => lock("N") },
        { label: "◂ Abbandona", fn: () => { stop(); if (quit) quit(); else done({ goals, shots: n, res, qs, quit: true }); } }
      ], false);
    }
    function nextShot() {
      if (over) return;
      n++; phase = "sync"; lockL = lockN = false; tapped = false; ts = performance.now();
      const o1 = rnd(0, 200), o2 = rnd(0, 200);
      nextShot.o1 = o1; nextShot.o2 = o2;
      $("tsxL").classList.remove("lock"); $("tsxN").classList.remove("lock");
      $("tsxMeters").style.opacity = "1"; G.className = "tsx-goal";
      [...G.querySelectorAll(".tsx-x,.tsx-ball")].forEach((e) => e.remove());
      const spots = [28, 50, 72]; gkTell = spots[Math.floor(Math.random() * 3)];
      $("tsxGk").style.left = gkTell + "%";
      hud();
      msg(n === 1 && cfg.hint ? cfg.hint : "Ferma Leo e Nico sulla zona verde, quasi insieme", "");
      setSyncBtns();
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function tick(now) {
      if (over || !$("tsxG")) { stop(); return; }
      const t = now - ts;
      if (phase === "sync") {
        if (!lockL) { pL = tri(t, sL, nextShot.o1); $("tsxL").style.left = pL + "%"; }
        if (!lockN) { pN = tri(t, sN, nextShot.o2); $("tsxN").style.left = pN + "%"; }
      }
      raf = requestAnimationFrame(tick);
    }
    function lock(who) {
      if (over || phase !== "sync") return;
      const now = performance.now();
      if (who === "L" && !lockL) { lockL = true; tL = now; $("tsxL").classList.add("lock"); }
      else if (who === "N" && !lockN) { lockN = true; tN = now; $("tsxN").classList.add("lock"); }
      else return;
      try { playSynth(520 + (lockL && lockN ? 200 : 0), "triangle", 0.09, 0.12); } catch (e) {}
      if (lockL && lockN) {
        aL = clamp(1 - Math.abs(pL - 50) / (zh * 2), 0, 1);
        aN = clamp(1 - Math.abs(pN - 50) / (zh * 2), 0, 1);
        const uni = Math.abs(tL - tN) < 420 ? 0.12 : 0;
        q = clamp((aL + aN) / 2 + uni, 0, 1);
        phase = "aim";
        G.className = "tsx-goal on";
        msg(`Sintonia ${Math.round(q * 100)}%${uni ? " · all'unisono!" : ""} — tocca la porta dove vuoi tirare`, q >= 0.6 ? "tsx-ok" : "");
        showButtons([{ label: "◂ Abbandona", fn: () => { stop(); if (quit) quit(); else done({ goals, shots: n, res, qs, quit: true }); } }], true);
      } else setSyncBtns();
    }
    G.addEventListener("pointerdown", (e) => {
      if (over || phase !== "aim" || tapped) return;
      e.preventDefault();
      tapped = true; phase = "res";
      const r = G.getBoundingClientRect();
      const x = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100), y = clamp(((e.clientY - r.top) / r.height) * 100, 0, 100);
      resolve(x, y);
    });
    function resolve(x, y) {
      G.className = "tsx-goal";
      const mk = document.createElement("div"); mk.className = "tsx-x"; mk.textContent = "✕"; mk.style.left = x + "%"; mk.style.top = y + "%"; G.appendChild(mk);
      // dispersione: più la sintonia è bassa più il tiro devia
      const ang = rnd(0, Math.PI * 2), rad = (1 - q) * 28 * Math.sqrt(Math.random());
      const ax = x + Math.cos(ang) * rad, ay = y + Math.sin(ang) * rad * 0.7;
      const b = document.createElement("div"); b.className = "tsx-ball"; b.textContent = "⚽"; b.style.left = ax + "%"; b.style.top = ay + "%"; G.appendChild(b);
      let fin = gkTell;
      if (Math.random() < (cfg.fb == null ? 0.25 : cfg.fb)) { const o = [28, 50, 72].filter((v) => v !== gkTell); fin = o[Math.floor(Math.random() * o.length)]; }
      $("tsxGk").style.left = fin + "%";
      const reach = Math.max(7, (cfg.gkReach || 18) - lv * 0.9) * (1.3 - q * 0.7) * (ay < 36 ? 0.72 : 1);
      let ok = false, text;
      if (ax < 3 || ax > 97 || ay < 3) text = "Fuori!";
      else if (ax < 8 || ax > 92 || ay < 9) text = "PALO!";
      else if (Math.abs(ax - fin) < reach) text = "Parato!";
      else { ok = true; text = q >= 0.75 ? "TIRO COMBINATO! GOOOL!" : "GOOOL!"; }
      msg(text, ok ? "tsx-ok" : "tsx-ko");
      try { if (window.sfx) window.sfx(ok ? "goal" : "kick"); } catch (e) {}
      res.push(ok); qs.push(q); if (ok) goals++;
      hud();
      showButtons([{ label: "…", disabled: true, fn: () => {} }], true);
      setTimeout(() => {
        if (over || !$("tsxG")) return;
        if (n >= cfg.shots) { stop(); done({ goals, shots: n, res, qs }); } else nextShot();
      }, 1150);
    }
    nextShot();
  }

  // ================= HUB =================
  function openTsubasaMenu(onBack) {
    onExitCallback = onBack;
    showHub();
  }

  function curIdx(prog) { return Math.min(prog.stage, TEAMS_DATA.length - 1); }

  function showHub() {
    leaveStageSoft();
    if (window.setChapter) window.setChapter("Il Torneo della Scogliera");
    const prog = getProgress();
    const idx = curIdx(prog), curTeam = TEAMS_DATA[idx];
    renderHubStage(prog, curTeam);
    const nextLv = prog.syncLevel < 5 ? XP_AT[prog.syncLevel] - prog.syncXp : 0;

    if (prog.cup) {
      showText("Roberto Sedinho", `«La Coppa della Scogliera è nostra, Leo. Ma i campioni non si fermano: rigioca le sfide, allena la sintonia, batti il tuo record col Tiro Combinato.»<br><span style="color:var(--dim)">Sintonia ${stars(prog.syncLevel)} · Record allenamento: ${prog.best}/3</span>`);
    } else if (prog.pending) {
      showText("Roberto Sedinho", `«Hai battuto il San Francis in campo, ma la porta di Benji è ancora lì. Il Tiro Combinato è l'ultima prova: servono due gol su tre. Allenati, poi fatti sentire.»<br><span style="color:var(--dim)">Sintonia ${stars(prog.syncLevel)}</span>`);
    } else {
      showText("Roberto Sedinho", `«Leo, oggi tocca a <b>${E(curTeam.name)}</b>. Prepara il Piano di Gioco con le mosse giuste e allena il <b>Tiro Combinato</b>: più sei in sintonia con Nico, più sei preciso.»<br><span style="color:var(--dim)">Sintonia ${stars(prog.syncLevel)}${nextLv ? ` · ${nextLv} punti al prossimo livello` : " · massima"}</span>`);
    }

    const b = [];
    if (prog.pending) {
      b.push({ label: "👑 Duello finale con Benji", sub: "Tiro Combinato · servono 2 gol su 3", cls: "hot", fn: () => finalDuel(true) });
    } else if (!prog.cup) {
      b.push({ label: `⚽ Gioca contro ${curTeam.name}`, sub: `Piano di Gioco, poi partita vera sul ${curTeam.pitch}`, cls: "hot", fn: () => planScreen(idx) });
    }
    b.push({ label: "⚡ Allenamento Tiro Combinato", sub: "3 tiri · fa salire la Sintonia", cls: prog.cup ? "hot" : "", fn: () => startTraining() });
    if (!prog.cup && !prog.pending) b.push({ label: "📖 Spogliatoio di Sedinho", sub: prog.paid["lk" + idx] ? "Hai già fatto la scelta di oggi" : "Un consiglio, una scelta", fn: () => showLockerRoomTalk(curTeam, idx) });
    if (prog.cleared.length > 0) b.push({ label: "🏆 Rivincita con le squadre battute", sub: "Rigioca le partite del torneo", fn: showRematchMenu });
    b.push({ label: "◂ Torna al Menu Principale", cls: "pick", fn: () => { leaveStage(); if (onExitCallback) onExitCallback(); else if (window.title) window.title(); } });
    showButtons(b, true);
  }
  function leaveStageSoft() { /* il palco viene riattivato da renderHubStage */ }

  // ---------- spogliatoio con scelta ----------
  function showLockerRoomTalk(team, idx) {
    const prog = getProgress(), done = !!prog.paid["lk" + idx];
    showText("Roberto Sedinho", `«Guardati attorno, Leo. <i>${E(team.lore)}</i><br><br><b>${E(team.captain)} ti ha detto:</b><br>«${E(team.dialogueIntro)}»<br><br><b>Il consiglio:</b> ${E(team.hint)}»`);
    if (done) {
      showButtons([{ label: "◂ Torna al torneo", fn: showHub }], true);
      return;
    }
    showButtons([
      { label: "🔍 Studia l'avversario con Sedinho", sub: "Prossima partita: uno slot mossa in più", cls: "hot", fn: () => { const p = getProgress(); p.paid["lk" + idx] = true; p.slot = true; saveProgress(p); toastOk("Slot mossa extra per la prossima partita"); showHub(); } },
      { label: "🤝 Rincuora Nico, che non dorme", sub: "+1 punto Sintonia", fn: () => { const p = getProgress(); p.paid["lk" + idx] = true; const up = addXp(p, 1); saveProgress(p); toastOk(up ? "Sintonia salita di livello!" : "+1 punto Sintonia"); showHub(); } },
      { label: "◂ Torna al torneo", fn: showHub }
    ], true);
  }
  function toastOk(t) { try { if (window.toast) window.toast(t, "success", "⚡"); } catch (e) {} }

  function showRematchMenu() {
    const prog = getProgress();
    const b = prog.cleared.map((id) => {
      const t = TEAMS_DATA.find((x) => x.id === id) || TEAMS_DATA[0];
      return { label: `Rivincita: ${t.name}`, sub: `Capitano: ${t.captain}`, fn: () => planScreen(TEAMS_DATA.indexOf(t)) };
    });
    b.push({ label: "◂ Torna al torneo", fn: showHub });
    showButtons(b, true);
  }

  // ---------- allenamento ----------
  function startTraining() {
    const prog = getProgress();
    twinGame({ title: "Allenamento · Sintonia", shots: 3, level: prog.syncLevel, gkReach: 18, fb: 0.2, hint: "Fermali dentro la zona verde, poi tocca dove tirare" }, (r) => {
      if (r.quit) return showHub();
      const p = getProgress();
      const gain = r.goals + (r.qs.length && r.qs.reduce((a, b) => a + b, 0) / r.qs.length > 0.7 ? 1 : 0);
      const up = addXp(p, gain);
      if (r.goals > p.best) p.best = r.goals;
      saveProgress(p);
      const avg = r.qs.length ? Math.round((r.qs.reduce((a, b) => a + b, 0) / r.qs.length) * 100) : 0;
      showText("Roberto Sedinho", `«${r.goals} gol su 3, sintonia media ${avg}%.» ${up ? `<b style="color:var(--gold)">SINTONIA LIVELLO ${p.syncLevel}!</b>` : `+${gain} punti Sintonia.`}<br><span style="color:var(--dim)">${p.syncLevel >= 4 && p.cleared.length < 3 && p.syncLevel < 5 ? "Il livello 5 si guadagna battendo tre squadre del torneo." : ""}</span>`);
      showButtons([
        { label: "⚡ Ancora un allenamento", cls: "hot", fn: startTraining },
        { label: "◂ Torna al torneo", fn: showHub }
      ], false);
    }, showHub);
  }

  // ---------- Piano di Gioco ----------
  function planScreen(stageIdx, picked) {
    const team = TEAMS_DATA[stageIdx], prog = getProgress();
    renderPreview(team);
    const slots = 2 + (prog.syncLevel >= 4 ? 1 : 0) + (prog.slot ? 1 : 0);
    picked = picked || [];
    showText("Roberto Sedinho", `«<b>Piano di Gioco</b> contro ${E(team.name)}: scegli ${slots} mosse (${picked.length}/${slots}).»<br><i>${E(team.hint)}</i>`);
    const b = Object.keys(MOVES).map((id) => {
      const on = picked.includes(id);
      return {
        label: `${on ? "✓ " : ""}${MOVES[id].n}`,
        sub: MOVES[id].d,
        cls: on ? "hot" : "",
        fn: () => {
          const np = on ? picked.filter((x) => x !== id) : picked.length < slots ? picked.concat([id]) : picked.slice(1).concat([id]);
          planScreen(stageIdx, np);
        }
      };
    });
    b.push({ label: picked.length ? "⚽ FISCHIO D'INIZIO!" : "⚽ Scendi in campo (senza mosse)", sub: `Partita vera sul ${team.pitch}`, cls: "hot", fn: () => launchActualMatch(stageIdx, picked) });
    b.push({ label: "◂ Torna al torneo", fn: showHub });
    showButtons(b, false);
  }
  function renderPreview(team) {
    const alt = activateTsubasaStage();
    if (!alt) return;
    alt.innerHTML = `
      <div style="position:absolute; inset:0; background:linear-gradient(135deg, #1b0429 0%, #3a0ca3 45%, #ff0054 100%); display:flex; flex-direction:column; justify-content:space-between; padding:10px; box-sizing:border-box;">
        <div style="text-align:center; font-family:var(--display); font-size:13px; color:#ffd23f; text-shadow:0 0 8px #ffd23f;">⚡ SFIDA DEL CAMPIONATO DELLA SCOGLIERA</div>
        <div style="display:flex; align-items:center; justify-content:space-around;">
          <div style="text-align:center;"><div style="font-size:30px;">🦅</div><div style="color:#3fa7ff; font-weight:bold; font-size:12px;">RONDINE FC</div><div style="color:#a2d2ff; font-size:10px;">Leo & Nico</div></div>
          <div style="font-family:var(--display); font-size:20px; color:#ffd23f; text-shadow:0 0 10px #ff0054;">VS</div>
          <div style="text-align:center; max-width:45%;"><div style="font-size:30px;">🐯</div><div style="color:#ffd23f; font-weight:bold; font-size:12px;">${E(team.name.toUpperCase())}</div><div style="color:#f8edeb; font-size:10px;">${E(team.captain)}</div></div>
        </div>
        <div style="background:rgba(12,4,28,0.85); border:1px solid #ffd23f; border-radius:6px; padding:3px 8px; font-size:10px; color:#fff; text-align:center;">Campo: <b>${E(team.pitch.toUpperCase())}</b> · Portiere: ${E(team.gkName)}</div>
      </div>`;
  }

  // ================= PARTITA =================
  function launchActualMatch(stageIdx, moves) {
    const team = TEAMS_DATA[stageIdx];
    if (!window.azStartSagaMatch) {
      try { if (window.toast) window.toast("Motore di gioco partita non pronto!", "error", "⚠️"); } catch (e) {}
      showHub();
      return;
    }
    const prog = getProgress();
    const perfect = !!(moves && moves.length && moves.every((m) => team.rec.includes(m)));
    if (prog.slot) { prog.slot = false; saveProgress(prog); }
    try { if (window.toast) window.toast(`⚽ FISCHIO D'INIZIO: RONDINE FC vs ${team.name.toUpperCase()}!`, "success", "🏟️"); } catch (e) {}
    const curDiff = window.getGlobalAzDiff ? window.getGlobalAzDiff() : "norm";
    window.azStartSagaMatch(team.teamKey, { mode: "amic", pitch: team.pitch, diff: curDiff, pu: true, roles: (moves || []).slice(0, 4) }, (myGoals, rivalGoals) => {
      handleMatchResult(stageIdx, myGoals, rivalGoals, perfect, moves);
    });
  }

  function handleMatchResult(stageIdx, myGoals, rivalGoals, perfect, moves) {
    const team = TEAMS_DATA[stageIdx];
    const prog = getProgress();
    renderHubStage(prog, team);
    const again = () => launchActualMatch(stageIdx, moves);
    if (myGoals > rivalGoals) return winFlow(stageIdx, myGoals, rivalGoals, perfect);

    if (myGoals === rivalGoals) {
      showText("Roberto Sedinho", `<b style="color:#4cc9f0;">${myGoals} – ${rivalGoals}!</b><br>«Pari. Oppure hai lasciato il campo, non lo so, io guardavo il gabbiano. Se vuoi lo spareggio, decidiamo col <b>Tiro Combinato</b>: due gol su tre e passiamo lo stesso.»`);
      showButtons([
        { label: "⚡ Spareggio col Tiro Combinato", sub: `Contro ${team.gkName} · 2 gol su 3`, cls: "hot", fn: () => tieBreak(stageIdx, perfect) },
        { label: "🔁 Rigioca la partita", fn: again },
        { label: "◂ Torna al torneo", fn: showHub }
      ], true);
      return;
    }
    // sconfitta
    const p = getProgress(); p.losses = (p.losses || 0) + 1; addXp(p, 1); saveProgress(p);
    showText(team.captain, `<b style="color:#ff0054;">SCONFITTA ${myGoals} – ${rivalGoals}</b><br>«Te l'avevo detto, Moretti! Qui vince chi non ha paura di farsi male!»<br><br><b>ROBERTO SEDINHO:</b> <i>«Rialza la testa. Un bomber impara più da una sconfitta che da dieci passeggiate: ti ho segnato +1 Sintonia. Rivedi il Piano e riprova.»</i>`);
    showButtons([
      { label: "🔁 Rivincita subito", sub: "Stesse mosse del piano", cls: "hot", fn: again },
      { label: "📋 Rivedi il Piano di Gioco", fn: () => planScreen(stageIdx) },
      { label: "◂ Torna al torneo", fn: showHub }
    ], true);
  }

  function tieBreak(stageIdx, perfect) {
    const team = TEAMS_DATA[stageIdx], prog = getProgress();
    twinGame({ title: `Spareggio · ${team.gkName}`, shots: 3, need: 2, level: prog.syncLevel, gkReach: team.gkReach, fb: team.fb, hint: `${team.gkName} para tutto: serve sintonia` }, (r) => {
      if (r.quit) return showHub();
      if (r.goals >= 2) winFlow(stageIdx, r.goals, 0, perfect, true);
      else {
        const p = getProgress(); addXp(p, 1); saveProgress(p);
        showText("Roberto Sedinho", `«${r.goals} su 3. Non basta. Ma ci eravamo quasi: ho visto il portiere sudare, e lui non suda mai. Ritenta.»`);
        showButtons([{ label: "⚡ Riprova lo spareggio", cls: "hot", fn: () => tieBreak(stageIdx, perfect) }, { label: "◂ Torna al torneo", fn: showHub }], true);
      }
    }, showHub);
  }

  function winFlow(stageIdx, myGoals, rivalGoals, perfect, viaTie) {
    const team = TEAMS_DATA[stageIdx];
    const p = getProgress();
    const last = stageIdx === TEAMS_DATA.length - 1;
    if (!p.cleared.includes(team.id)) p.cleared.push(team.id);
    if (p.stage === stageIdx) p.stage++;
    p.goals += viaTie ? 0 : myGoals;
    const up = addXp(p, 2 + (perfect ? 1 : 0));
    let coins = 0;
    if (!last) coins = pay(p, "w" + stageIdx, stageIdx === 2 ? 2 : 1);
    if (last && !p.cup) p.pending = true;
    saveProgress(p);
    playSynth(950, "sine", 0.45, 0.4);
    try { if (window.triggerGoalCelebration) window.triggerGoalCelebration(true); } catch (e) {}
    try { if (window.toast) window.toast(`🏆 ${viaTie ? "Spareggio vinto" : `${myGoals} – ${rivalGoals}`} contro ${team.name}!${coins ? ` +${coins} 🪙` : ""}`, "success", "🌟"); } catch (e) {}
    renderHubStage(p, team);
    const score = viaTie ? "Vinto lo spareggio col Tiro Combinato!" : `RONDINE FC ${myGoals} – ${rivalGoals} ${E(team.name.toUpperCase())}`;
    showText(team.captain, `<b style="color:var(--gold); font-size:14px;">${score}</b><br><br>${team.win.map((l) => "«" + E(l.replace(/^«|»$/g, "")) + "»").join("<br><br>")}<br><br><span style="color:var(--dim)">${perfect ? "Piano Perfetto: +3 Sintonia. " : "+2 Sintonia. "}${up ? "Sintonia salita di livello! " : ""}${coins ? `+${coins} moneta/e.` : ""}</span>`);
    showButtons([
      last && p.pending ? { label: "👑 Il Duello finale con Benji", sub: "Tiro Combinato · 2 gol su 3", cls: "hot", fn: () => finalDuel(false) } : { label: "Avanti con il torneo ▸", cls: "hot", fn: showHub },
      { label: "⚡ Tiro Combinato di festeggiamento", sub: "Allenamento rapido", fn: startTraining },
      { label: "◂ Torna al torneo", fn: showHub }
    ], true);
  }

  // ---------- finale ----------
  function finalDuel(retry) {
    const team = TEAMS_DATA[3], prog = getProgress();
    renderPreview(team);
    showText("Benji Costantini", retry ? `«Sei tornato. Bene. Stesso tempio, stessi guanti. Fatti sentire.»` : `«Hai battuto il mio San Francis in campo, Moretti. Ma Benji non ha ancora preso un gol dal Tiro Combinato. Siete in due, e io sono uno solo: facciamo che sia equilibrato?»<br><span style="color:var(--dim)">Sintonia ${stars(prog.syncLevel)}: più è alta, più il tiro è preciso. Servono 2 gol su 3.</span>`);
    showButtons([
      { label: "⚡ Tira il Tiro Combinato!", sub: "Leo e Nico contro Benji", cls: "hot", fn: runFinal },
      { label: "◂ Torna al torneo (allenati prima)", fn: showHub }
    ], true);
  }
  function runFinal() {
    const team = TEAMS_DATA[3], prog = getProgress();
    twinGame({ title: "FINALE · Benji Costantini", shots: 3, need: 2, level: prog.syncLevel, gkReach: team.gkReach, fb: team.fb, hint: "Benji legge i tiri: la sintonia è la tua arma" }, (r) => {
      if (r.quit) return showHub();
      const p = getProgress();
      if (r.goals >= 2) {
        p.cup = true; p.pending = false;
        let coins = pay(p, "cup", 4);
        saveProgress(p);
        try { if (window.triggerTrophyCelebration) window.triggerTrophyCelebration(); } catch (e) {}
        playSynth(1100, "sine", 0.6, 0.4);
        renderHubStage(p, team);
        showText("Benji Costantini", `<b style="color:var(--gold); font-size:14px;">${r.goals} GOL SU 3: LA COPPA DELLA SCOGLIERA È DEL BORGO!</b><br><br>«Ho parato per anni. Oggi ho capito che non si para quello che non si può leggere: due ragazzi che pensano la stessa cosa nello stesso istante. Non è fisica, Moretti. È amicizia.»<br><br>Leo e Nico si guardano e dicono insieme, in perfetta sintonia: «Ma io avevo il pallone.»${coins ? `<br><span style="color:var(--dim)">+${coins} monete.</span>` : ""}`);
        showButtons([{ label: "🏆 Alza la Coppa!", cls: "hot", fn: showHub }], true);
      } else {
        addXp(p, 1); saveProgress(p);
        showText("Benji Costantini", `<b style="color:#ff0054;">${r.goals} su 3</b><br>«Quasi. Il portiere ringrazia. Torna quando saprai pensare in due.»<br><span style="color:var(--dim)">Allenati per salire di Sintonia: la porta di Benji si fa più piccola.</span>`);
        showButtons([{ label: "🔁 Riprova subito", cls: "hot", fn: runFinal }, { label: "⚡ Allenati prima", fn: startTraining }, { label: "◂ Torna al torneo", fn: showHub }], true);
      }
    }, showHub);
  }

  window.openTsubasaMenu = openTsubasaMenu;
  try { if (/[?&]debug/.test(location.search)) window.__tsu = { getProgress, saveProgress, twinGame, handleMatchResult, winFlow, planScreen, showHub, finalDuel, TEAMS_DATA }; } catch (e) {}
})();
