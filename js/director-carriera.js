// js/director-carriera.js - Modalità "Director · Carriera del Golfo"
// Gestionale stagionale mobile-first (320px/390px) con campionato a 3 categorie, gestione rosa, mercato e conferenze.
// Salvataggio proprio: "ali-di-rondine.director-carriera"
(function () {
  "use strict";

  const SAVE_KEY = "ali-di-rondine.director-carriera";
  const STADIO_KEY = "ali-di-rondine.stadio-borgo";
  const STYLE_ID = "carriera-style";

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let root = null;
  let onExitCb = null;
  let tab = "ufficio"; // ufficio, settimana, squadra, classifica, mercato
  let state = null;
  let selPlayerId = null;

  function getStadiumStage() {
    try {
      const o = JSON.parse(localStorage.getItem(STADIO_KEY) || "{}");
      return Math.max(0, Math.min(4, Number(o.stage) || 0));
    } catch (e) {
      return 0;
    }
  }

  // squadre del campionato di una divisione: la Rondine c'e' sempre (in B e A prende il posto dell'ultima della lista)
  function teamsOf(divId) {
    const D = window.__carrieraDati.DIVISIONS, d = D[divId];
    if (d.teams.some((t) => t.id === "rondine")) return d.teams;
    const r = D[0].teams.find((t) => t.id === "rondine");
    const others = d.teams.filter((t) => t.id !== "rondine");
    return [r].concat(others.slice(0, others.length - 1));
  }
  const SPONSOR = [60, 80, 100];

  function defaultState() {
    const core = window.__carrieraCore;
    const dati = window.__carrieraDati;
    const divId = 0;
    const div = dati.DIVISIONS[divId];
    const teamIds = div.teams.map((t) => t.id);

    return {
      version: 1,
      season: 1,
      divId,
      round: 1,
      funds: 120,
      presTrust: 80,
      fans: 65,
      sponsorWeekly: 60,
      trainingDone: false,
      pressDone: false,
      lastMatchRes: null,
      trophies: [],
      records: { won: 0, drawn: 0, lost: 0, titles: 0 },
      form: "4-3-3",
      ment: "equil",
      press: "medio",
      squad: JSON.parse(JSON.stringify(dati.DEFAULT_SQUAD)),
      table: core.initTable(div.teams),
      schedule: core.generateSchedule(teamIds)
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.version === 1 && s.squad && s.table) {
          // riparazione: stagioni nuove create senza la Rondine (bug promozione) e sponsor vecchio troppo basso
          if (!s.table.rondine) {
            const core = window.__carrieraCore, tm = teamsOf(s.divId);
            s.table = core.initTable(tm); s.schedule = core.generateSchedule(tm.map((t) => t.id)); s.round = 1; s.lastMatchRes = null;
          }
          if (!s.sponsorFix) { s.sponsorFix = 1; s.sponsorWeekly = Math.max(s.sponsorWeekly || 0, SPONSOR[s.divId] || 60); if (s.funds < 60) s.funds = 60; }
          return ensure(s);
        }
      }
    } catch (e) { /* ignora */ }
    return ensure(defaultState());
  }

  function saveState() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) { /* ignora */ }
  }

  const CSS = `
  .car-root{position:fixed;inset:0;background:#0b1322;color:#f1f5f9;z-index:99990;display:flex;flex-direction:column;font-family:system-ui,-apple-system,sans-serif;-webkit-tap-highlight-color:transparent;user-select:none;overflow:hidden}
  .car-header{flex:none;background:linear-gradient(180deg,#1e293b,#0f172a);border-bottom:1px solid #253349;padding:8px 12px;display:flex;align-items:center;justify-content:space-between}
  .car-h-title b{font-size:14px;color:#facc15;display:block;line-height:1.2}
  .car-h-title small{font-size:11px;color:#94a3b8}
  .car-h-stats{display:flex;gap:6px;font-size:11px;font-weight:700}
  .car-chip{background:#162032;padding:3px 6px;border-radius:6px;border:1px solid #253349;display:flex;align-items:center;gap:3px}
  .car-chip.gold{border-color:#eab308;color:#fde047}
  .car-chip.green{border-color:#22c55e;color:#86efac}
  .car-close{background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;padding:4px 8px}
  .car-content{flex:1;overflow-y:auto;overflow-x:hidden;padding:12px;display:flex;flex-direction:column;gap:12px}
  .car-nav{flex:none;background:#0f172a;border-top:1px solid #253349;display:grid;grid-template-columns:repeat(5,1fr);padding:4px 2px}
  .car-tab{background:transparent;border:none;color:#94a3b8;padding:6px 2px;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;font-weight:700;cursor:pointer}
  .car-tab.on{color:#facc15}
  .car-tab .ico{font-size:18px}
  .car-card{background:#162032;border:1px solid #253349;border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:8px}
  .car-card h3{margin:0;font-size:13px;color:#93c5fd;font-weight:800;display:flex;align-items:center;gap:6px}
  .car-next-match{background:linear-gradient(135deg,#1e293b,#162032);border:1px solid #3b82f6;border-radius:10px;padding:10px;display:flex;align-items:center;justify-content:space-between}
  .car-btn{background:#1e293b;border:1px solid #3b82f6;color:#f8fafc;padding:10px 12px;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer;text-align:center;display:flex;align-items:center;justify-content:center;gap:6px}
  .car-btn:active{transform:scale(.98)}
  .car-btn.gold{background:linear-gradient(135deg,#eab308,#ca8a04);border-color:#fde047;color:#0f172a}
  .car-btn[disabled]{opacity:.5;cursor:not-allowed}
  .car-pl-row{display:grid;grid-template-columns:26px 1fr 35px 60px;align-items:center;gap:6px;padding:6px 0;border-bottom:1px solid #1e293b;font-size:12px}
  .car-pl-row.bench{opacity:.85}
  .car-num{background:#1d4ed8;color:#fff;border-radius:4px;padding:1px 4px;font-weight:800;font-size:10px;text-align:center}
  .car-pl-info b{display:block;font-size:12px;color:#f1f5f9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .car-pl-info small{font-size:10.5px;color:#94a3b8}
  .car-st-bar{height:6px;background:#1e293b;border-radius:3px;overflow:hidden}
  .car-st-fill{height:100%;border-radius:3px}
  .car-tbl{width:100%;border-collapse:collapse;font-size:11.5px;text-align:center}
  .car-tbl th{color:#94a3b8;font-weight:700;padding:4px 2px;border-bottom:1px solid #253349}
  .car-tbl td{padding:5px 2px;border-bottom:1px solid #162032}
  .car-tbl tr.us{background:rgba(30,58,138,.4);font-weight:800;color:#facc15}
  .car-tbl tr.promo{border-left:3px solid #22c55e}
  .car-tbl tr.releg{border-left:3px solid #ef4444}
  .car-dlg{position:absolute;inset:0;background:rgba(2,6,23,.72);display:flex;align-items:flex-end;justify-content:center;padding:12px;z-index:5;animation:carFade .25s ease}
  .car-dlg-box{width:100%;max-width:460px;background:linear-gradient(180deg,#1e293b,#0f172a);border:2px solid #facc15;border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px;box-shadow:0 10px 40px rgba(0,0,0,.6);animation:carUp .3s cubic-bezier(.2,1.4,.4,1)}
  .car-dlg-who{display:flex;align-items:center;gap:8px}
  .car-dlg-who img{width:46px;height:46px;border-radius:10px;border:2px solid #facc15;background:#0b1322;object-fit:cover}
  .car-dlg-who b{color:#facc15;font-size:13px}
  .car-dlg-ico{width:46px;height:46px;border-radius:10px;background:#1e3a8a;display:flex;align-items:center;justify-content:center;font-size:22px}
  .car-dlg-txt{font-size:13px;line-height:1.45;color:#f1f5f9}
  .car-dlg-bt{display:flex;flex-direction:column;gap:6px}
  .car-sede{width:100%;height:auto;aspect-ratio:320/120;border-radius:10px;display:block;image-rendering:pixelated}
  .car-trust{height:7px;background:#1e293b;border-radius:4px;overflow:hidden}
  .car-trust i{display:block;height:100%;border-radius:4px}
  .car-cup{background:linear-gradient(135deg,#422006,#162032);border:1px solid #f59e0b;border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:8px}
  .car-rival{border-color:#a5b4fc!important;box-shadow:0 0 0 1px rgba(165,180,252,.35) inset}
  @keyframes carFade{from{opacity:0}to{opacity:1}}
  @keyframes carUp{from{transform:translateY(30px);opacity:0}to{transform:none;opacity:1}}
  `;

  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function open(onExit) {
    onExitCb = onExit || null;
    injectCSS();
    state = loadState();

    castAll();
    if (!root) {
      root = document.createElement("div");
      root.className = "car-root";
      document.body.appendChild(root);
    }
    tab = "ufficio";
    render();
    const intro = () => {
      if (!state.flags.intro) {
        say([
          ["spigola", "Mister! Benvenuto alla sede ai Trabucchi. Qui teniamo i soldi in un barattolo di acciughe: non per tirchieria, per tradizione. La tradizione costa meno."],
          ["dina", "Io sono Dina, la segretaria. Tengo i registri, le cartelle e i nervi di tutti. Le cartelle sono colorate. I nervi no."],
          ["ruspa", "Ruspa, magazziniere. Le maglie le lavo io, a mano. Lei vinca, che io stendo."],
          ["livore", "(al telefono, voce lontana) Mister della Rondine? Gualtiero Livore. Alleno i Corsari. Volevo solo presentarmi. E dirle che la sua squadra la conosco già. Tutta. Buona stagione."],
          ["dina", "Chi era? … Ah, Livore. Lo trovi su ogni panchina che sta un gradino sopra la nostra. Sempre. Non chiedere perché: neanche lui lo sa."],
        ], () => { state.flags.intro = 1; saveState(); if (!state.goal) chooseGoal(); else render(); });
      } else if (!state.goal) chooseGoal();
    };
    const o = optGet();
    if (!o.cut) { optSet({ cut: true }); if (window.__presa && window.__presa.cutin) return window.__presa.cutin("CARRIERA DEL GOLFO", "Obiettivi, Coppa, rivale e una rosa che invecchia", intro); }
    intro();
  }

  function close() {
    saveState();
    if (root) {
      root.remove();
      root = null;
    }
    dlgQ.length = 0;
    if (typeof onExitCb === "function") {
      try { onExitCb(); } catch (e) { console.error(e); }
    }
  }

  function render() {
    if (!root) return;
    const dati = window.__carrieraDati;
    const div = dati.DIVISIONS[state.divId];
    const stadioLevel = getStadiumStage();
    const stadioLabels = ["Rovina", "Spalti", "Prato e Tribuna", "Torri Faro", "Inaugurato"];

    const keepDlg = root.querySelector(".car-dlg");
    root.innerHTML = `
      <div class="car-header">
        <div class="car-h-title">
          <b>🕊️ Rondine FC · Carriera</b>
          <small>${esc(div.name)} · Stagione ${state.season}</small>
        </div>
        <div class="car-h-stats">
          <span class="car-chip gold" title="Cassa">🐟 ${state.funds}</span>
          <span class="car-chip green" title="Fiducia Spigola">👔 ${state.presTrust}%</span>
          <span class="car-chip" title="Tifosi">📣 ${state.fans}%</span>
        </div>
        <button class="car-close" id="carCloseBtn" aria-label="Chiudi">✕</button>
      </div>

      <div class="car-content" id="carContent"></div>

      <div class="car-nav">
        <button class="car-tab ${tab === "ufficio" ? "on" : ""}" data-tab="ufficio"><span class="ico">🏢</span>Scrivania</button>
        <button class="car-tab ${tab === "settimana" ? "on" : ""}" data-tab="settimana"><span class="ico">📅</span>Settimana</button>
        <button class="car-tab ${tab === "squadra" ? "on" : ""}" data-tab="squadra"><span class="ico">👕</span>Rosa</button>
        <button class="car-tab ${tab === "classifica" ? "on" : ""}" data-tab="classifica"><span class="ico">📊</span>Classifica</button>
        <button class="car-tab ${tab === "mercato" ? "on" : ""}" data-tab="mercato"><span class="ico">🤝</span>Mercato</button>
      </div>
    `;

    if (keepDlg) root.appendChild(keepDlg);
    root.querySelector("#carCloseBtn").onclick = close;
    root.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.onclick = () => {
        tab = btn.dataset.tab;
        render();
      };
    });

    const cEl = root.querySelector("#carContent");
    if (tab === "ufficio") renderUfficio(cEl, div, stadioLabels[stadioLevel]);
    else if (tab === "settimana") renderSettimana(cEl, div);
    else if (tab === "squadra") renderSquadra(cEl);
    else if (tab === "classifica") renderClassifica(cEl, div);
    else if (tab === "mercato") renderMercato(cEl);
  }

  function getNextMatch() {
    if (state.round > state.schedule.length) return null;
    const roundMatches = state.schedule[state.round - 1];
    return roundMatches.find((m) => m.home === "rondine" || m.away === "rondine") || null;
  }

  function renderUfficio(el, div, stadioName) {
    const nextMatch = getNextMatch();
    const oppTeam = nextMatch ? div.teams.find((t) => t.id === (nextMatch.home === "rondine" ? nextMatch.away : nextMatch.home)) : null;
    const ev = nextMatch ? weekEvent() : null, cup = cupDue() ? state.cup : null, cupOpp = cup ? teamAny(cup.opps[cup.stage]) : null;
    const isRival = oppTeam && oppTeam.id === rivalId(), g = state.goal, tr = state.presTrust;
    const trCol = tr > 60 ? "#22c55e" : tr > 30 ? "#f59e0b" : "#ef4444";
    el.innerHTML = `
      <canvas class="car-sede" id="carSede" width="640" height="240"></canvas>
      <div class="car-card">
        <h3>📍 Sede ai Trabucchi · Scrivania del Mister</h3>
        <div style="font-size:11.5px;display:flex;gap:12px;flex-wrap:wrap">
          <span>🏟️ Stadio: <b>${esc(stadioName)}</b></span>
          <span>📅 Giornata: <b>${Math.min(state.round, 7)}/7</b></span>
          ${state.cup ? `<span>🏆 Coppa: <b>${state.cup.won ? "vinta" : state.cup.alive ? CUP_ST[Math.min(state.cup.stage, 2)] : "fuori"}</b></span>` : ""}
        </div>
        <div style="font-size:11px;color:#94a3b8">👔 Fiducia del Presidente ${tr <= 25 ? "<b style='color:#f87171'>· a rischio esonero</b>" : ""}</div>
        <div class="car-trust"><i style="width:${tr}%;background:${trCol}"></i></div>
        ${g ? `<div style="font-size:11.5px">🎯 Obiettivo: <b>${esc(g.t)}</b> <small style="color:#94a3b8">(${esc(g.s)})</small></div>` : `<button class="car-btn gold" id="carGoal">🎯 Scegli l'obiettivo della stagione</button>`}
        ${state.funds < 0 ? `<div style="font-size:11.5px;color:#f87171">⚠️ Cassa in rosso: due giornate così e Dina comincia a vendere.</div>` : ""}
      </div>
      ${state.news && state.news.length ? `<div class="car-card"><h3>📰 Dalla Voce della Costa</h3><div style="font-size:11.5px;line-height:1.5">${state.news.map(esc).join("<br>")}</div></div>` : ""}
      ${ev ? `<div class="car-card" style="border-color:#38bdf8"><h3>📨 ${esc(ev.title)}</h3><button class="car-btn" id="carEvent">Ascolta ❯</button></div>` : ""}
      ${cup ? `
        <div class="car-cup">
          <h3 style="margin:0;font-size:13px;color:#fde68a">🏆 Coppa del Golfo · ${CUP_ST[cup.stage]}</h3>
          <div style="font-size:12px">Rondine contro <b>${cupOpp ? esc(cupOpp.ico || "⚽") + " " + esc(cupOpp.name) : "?"}</b> · gara secca, pari = rigori</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <button class="car-btn gold" id="carCupPlay">🎮 Gioca la Coppa</button>
            <button class="car-btn" id="carCupSim">⚡ Simula</button>
          </div>
        </div>` : oppTeam ? `
        <div class="car-next-match ${isRival ? "car-rival" : ""}">
          <div style="text-align:center"><div style="font-size:26px">🕊️</div><b style="font-size:12px">Rondine</b></div>
          <div style="text-align:center">
            <span style="font-size:13px;font-weight:900;color:#f59e0b">${nextMatch.home === "rondine" ? "IN CASA" : "IN TRASFERTA"}</span>
            <div style="font-size:10.5px;color:#94a3b8">G. ${state.round} di 7${isRival ? " · ⚔️ Livore in panchina" : ""}</div>
          </div>
          <div style="text-align:center"><div style="font-size:26px">${oppTeam.ico || "⚽"}</div><b style="font-size:12px">${esc(oppTeam.short)}</b></div>
        </div>
        <div style="font-size:11px;color:#94a3b8">Disponibili: ${avail().length}/${state.squad.length}${state.squad.some((p) => p.injured || p.suspended) ? " · " + state.squad.filter((p) => p.injured || p.suspended).map((p) => esc(p.name) + (p.injured ? " 🏥" : " 🟥")).join(", ") : ""}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <button class="car-btn gold" id="carPlayDirector"><span>🎮 Gioca (Director)</span></button>
          <button class="car-btn" id="carSimMatch"><span>⚡ Simula subito</span></button>
        </div>` : `
        <div class="car-card" style="text-align:center;padding:16px">
          <div style="font-size:24px">🏆</div>
          <b>Campionato terminato!</b>
          <p style="font-size:12px;color:#94a3b8">Il Presidente aspetta in sede per il bilancio della stagione.</p>
          <button class="car-btn gold" id="carNewSeasonBtn">Bilancio e nuova stagione ❯</button>
        </div>`}
      ${state.lastMatchRes ? `
        <div class="car-card">
          <h3>Ultimo risultato${state.lastMatchRes.cup ? " · Coppa" : ""}</h3>
          <div style="font-size:16px;font-weight:900;text-align:center">${state.lastMatchRes.scoreA} - ${state.lastMatchRes.scoreB}${state.lastMatchRes.pens ? ` <small style="font-size:11px;color:#fde68a">(rigori ${esc(state.lastMatchRes.pens)})</small>` : ""}</div>
          <div style="font-size:11.5px;color:#94a3b8;text-align:center">${state.lastMatchRes.scorers && state.lastMatchRes.scorers.length ? "Marcatori: " + esc(state.lastMatchRes.scorers.join(", ")) : "Nessun gol"}</div>
        </div>` : ""}
      <div class="car-card"><h3>📜 Albo d'oro della Rondine</h3>${alboHTML()}${state.trophies.length ? `<div style="font-size:11px;color:#fde68a">${state.trophies.slice(-4).map(esc).join(" · ")}</div>` : ""}</div>
    `;
    sedeLoop(el.querySelector("#carSede"));
    const need = () => { if (!state.goal) { chooseGoal(); return true; } if (ev) { runEvent(ev); return true; } return false; };
    const q = (id, fn) => { const b = el.querySelector(id); if (b) b.onclick = fn; };
    q("#carGoal", chooseGoal);
    q("#carEvent", () => runEvent(ev));
    q("#carPlayDirector", () => { if (!need()) preMatch(oppTeam, () => startMatchday(false)); });
    q("#carSimMatch", () => { if (!need()) preMatch(oppTeam, () => startMatchday(true)); });
    q("#carCupPlay", () => { if (!need()) playCup(false); });
    q("#carCupSim", () => { if (!need()) playCup(true); });
    q("#carNewSeasonBtn", () => advanceSeason());
  }
  function preMatch(opp, go) {
    if (opp && opp.id === rivalId()) { const i = (state.flags.livN = (state.flags.livN | 0) + 1); saveState(); return say([["livore", LIV[(i - 1) % LIV.length]]], go); }
    go();
  }
  const avail = () => state.squad.filter((p) => !p.injured && !p.suspended);
  const xiOf = () => avail().slice(0, 11);
  // una partita contro opp: Director HD giocata oppure simulata. done(res) con res.scoreA = gol Rondine
  function playVs(opp, isHome, sim, done) {
    const core = window.__carrieraCore, xi = xiOf(), ids = xi.map((p) => p.id);
    let lvl = opp.lvl || 1.0; if (opp.id === rivalId()) lvl += 0.04; if (state.flags.finta && opp.id === rivalId()) { lvl -= 0.08; state.flags.finta = 0; }
    const o = Object.assign({}, opp, { lvl });
    if (sim || !window.__directorHd) {
      const us = { name: "Rondine FC", lvl: 0.98 + ((xi.reduce((a, p) => a + p.r, 0) / Math.max(1, xi.length)) - 70) * 0.02 - (11 - xi.length) * 0.03, atk: 1.0, def: 0.98, names: xi.slice().sort((p, q) => "ATTCENDIFPOR".indexOf(p.grp) - "ATTCENDIFPOR".indexOf(q.grp)).map((p) => p.name) };
      const r = core.simMatch(isHome ? us : o, isHome ? o : us);
      const a = isHome ? r.scoreA : r.scoreB, b = isHome ? r.scoreB : r.scoreA;
      return done({ scoreA: a, scoreB: b, win: a > b, draw: a === b, scorers: (isHome ? r.scorersA : r.scorersB) || [] }, ids);
    }
    const tit = xi.map((p) => Object.assign({}, p, { bench: false })), pan = avail().slice(11).map((p) => Object.assign({}, p, { bench: true }));
    window.__directorHd.start({
      mode: "career", squad: tit.concat(pan),
      opp: { id: o.id, name: o.name, short: o.short, ico: o.ico, col: o.col, col2: o.col2, lvl: o.lvl, form: "4-4-2", style: "Campionato del Golfo", names: o.names || [], blurb: `La sfida contro ${o.name}.`, hint: "Fai attenzione alla stanchezza dei tuoi giocatori.", goal: "Vinci", mod: { atk: 1, mid: 1, def: 1, pressWeak: 1, foul: 0.03, ctr: 1, wall: 1, tire: 1 } },
      form: state.form, ment: state.ment, press: state.press,
      onDone: (res) => { if (res) done(res, ids); else render(); }
    });
  }
  function playCup(sim) {
    const c = state.cup, opp = teamAny(c.opps[c.stage]); if (!opp) { c.alive = false; saveState(); return render(); }
    playVs(opp, c.stage !== 1, sim, (res, ids) => {
      let win = res.win, pens = "";
      if (res.draw) { const us = 3 + Math.floor(rnd() * 3), them = Math.max(0, us + (rnd() < 0.5 ? 1 : -1)); win = us > them; pens = `${us}-${them}`; }
      res = Object.assign({}, res, { cup: 1, pens, win });
      state.lastMatchRes = res; state.squad.filter((p) => ids.includes(p.id)).forEach((p) => { p.st = Math.max(15, p.st - 15); p.matches = (p.matches || 0) + 1; });
      (res.scorers || []).forEach((n) => { const p = state.squad.find((x) => x.name === n); if (p) { p.goals = (p.goals || 0) + 1; p.sg = (p.sg || 0) + 1; } });
      const st = CUP_ST[c.stage]; c.log.push(`${st}: ${res.scoreA}-${res.scoreB}${pens ? " (rig. " + pens + ")" : ""} ${opp.short}`);
      if (win) { c.stage++; state.fans = clamp(state.fans + 4, 0, 100); state.funds += 15 * c.stage; if (c.stage >= 3) { c.won = true; state.funds += 60; state.presTrust = clamp(state.presTrust + 8, 0, 100); state.trophies.push(`Coppa del Golfo (Stagione ${state.season})`); } }
      else { c.alive = false; state.presTrust = clamp(state.presTrust - 3, 0, 100); }
      saveState(); render();
      say([[c.won ? "spigola" : win ? "arturo" : "mina", c.won ? "LA COPPA! Mister, la Coppa del Golfo! La metto nel barattolo. Non ci sta. Compro un barattolo più grande. Anzi, due." : win ? `Qui Radio Molo! La Rondine passa il turno: ${esc(st)} superati${pens ? ", ai rigori, con mia zia svenuta due volte" : ""}! Prossimo turno tra due giornate!` : `Fuori dalla Coppa ai ${esc(st.toLowerCase())}. Domanda per il Mister: è vero che preferiva concentrarsi sul campionato? Sì? Lo scrivo così, che è più elegante.`]], render);
    });
  }

  function renderSettimana(el, div) {
    const dati = window.__carrieraDati;
    const q = dati.PRESS_QUESTIONS[(state.round - 1) % dati.PRESS_QUESTIONS.length];

    el.innerHTML = `
      <div class="car-card">
        <h3>🏋️ Allenamento Settimanale</h3>
        <p style="font-size:12px;color:#94a3b8;margin:0">
          ${state.trainingDone ? "✔ Seduta completata per questa settimana." : "Scegli il focus di allenamento prima del match:"}
        </p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:4px">
          <button class="car-btn" id="trainFisico" ${state.trainingDone ? "disabled" : ""}>
            <span>⚡ Fisico</span>
            <small style="display:block;font-size:9.5px;color:#94a3b8">+Resistenza</small>
          </button>
          <button class="car-btn" id="trainTattico" ${state.trainingDone ? "disabled" : ""}>
            <span>📋 Tattico</span>
            <small style="display:block;font-size:9.5px;color:#94a3b8">+Intesa</small>
          </button>
          <button class="car-btn" id="trainTecnico" ${state.trainingDone ? "disabled" : ""}>
            <span>⚽ Giovani</span>
            <small style="display:block;font-size:9.5px;color:#94a3b8">Crescita U21</small>
          </button>
          <button class="car-btn" id="trainRiposo" ${state.trainingDone ? "disabled" : ""}>
            <span>☕ Riposo</span>
            <small style="display:block;font-size:9.5px;color:#94a3b8">+Recupero stanchezza</small>
          </button>
        </div>
      </div>

      <div class="car-card">
        <h3>🎙️ Sala Stampa & Interviste</h3>
        <div style="background:#1e293b;border-left:3px solid #38bdf8;padding:8px 10px;border-radius:6px;font-size:12.5px">
          <b>${esc(q.who)} (${esc(q.tag)})</b>
          <div style="margin-top:2px">${esc(q.q)}</div>
        </div>

        ${!state.pressDone ? `
          <div style="display:flex;flex-direction:column;gap:6px;margin-top:4px">
            ${q.opts.map((opt, i) => `
              <button class="car-btn" data-popt="${i}" style="text-align:left;font-size:11.5px;padding:8px">
                <span>${esc(opt.t)}</span>
                <small style="display:block;color:#facc15;font-size:10px">${esc(opt.eff)}</small>
              </button>
            `).join("")}
          </div>
        ` : `
          <div style="font-size:12px;color:#86efac;text-align:center;padding:6px">
            ✔ Conferenza stampa conclusa.
          </div>
        `}
      </div>
    `;

    if (!state.trainingDone) {
      ["Fisico", "Tattico", "Tecnico", "Riposo"].forEach((t) => {
        const btn = el.querySelector("#train" + t);
        if (btn) {
          btn.onclick = () => {
            const core = window.__carrieraCore;
            const wk = core.processWeek(state, t.toLowerCase());
            payWeek(wk.wageTotal);
            state.trainingDone = true;
            saveState();
            render();
          };
        }
      });
    }

    if (!state.pressDone) {
      el.querySelectorAll("[data-popt]").forEach((btn) => {
        btn.onclick = () => {
          const idx = Number(btn.dataset.popt);
          const opt = q.opts[idx];
          if (opt && opt.stat) {
            if (opt.stat.presTrust) state.presTrust = clamp(state.presTrust + opt.stat.presTrust, 0, 100);
            if (opt.stat.fans) state.fans = clamp(state.fans + opt.stat.fans, 0, 100);
            if (opt.stat.teamMor) state.squad.forEach((p) => { p.mor = clamp(p.mor + opt.stat.teamMor, 0, 100); });
          }
          state.pressDone = true;
          saveState();
          render();
        };
      });
    }
  }

  function renderSquadra(el) {
    const rows = state.squad.map((p, i) => {
      const isTit = i < 11;
      const isSel = selPlayerId === p.id;
      const stCol = p.st > 75 ? "#22c55e" : p.st > 45 ? "#f59e0b" : "#ef4444";
      const statusBadge = p.injured ? `<span style="color:#ef4444">🏥 ${p.injWeeks}w</span>` : p.suspended ? `<span style="color:#f59e0b">🟨 Squal.</span>` : "";

      return `
        <div class="car-pl-row ${isTit ? "" : "bench"}" data-plid="${p.id}" style="${isSel ? "background:rgba(250,204,21,.15);border-radius:6px;" : ""}cursor:pointer">
          <span class="car-num">${p.num}</span>
          <div class="car-pl-info">
            <b>${esc(p.name)} ${statusBadge}</b>
            <small>${p.grp} · Val ${p.r} · ${p.age}a</small>
          </div>
          <div style="font-size:11px;font-weight:700;color:${p.mor > 75 ? "#86efac" : "#cbd5e1"}">
            ${p.mor > 75 ? "▲" : p.mor < 50 ? "▼" : "▶"} ${p.mor}
          </div>
          <div>
            <div class="car-st-bar">
              <div class="car-st-fill" style="width:${p.st}%;background:${stCol}"></div>
            </div>
            <small style="font-size:9.5px;color:#94a3b8">${p.st}%</small>
          </div>
        </div>
      `;
    }).join("");

    el.innerHTML = `
      <div class="car-card">
        <h3>👕 Formazione & Convocati</h3>
        <p style="font-size:11.5px;color:#94a3b8;margin:0">
          I primi 11 sono titolari. Tocca un titolare e poi una riserva per scambiarli.
        </p>

        <div style="display:flex;gap:8px;margin-top:4px">
          <select id="carFormSelect" style="background:#1e293b;border:1px solid #334155;color:#fff;border-radius:6px;padding:4px 8px;font-size:12px;font-weight:700">
            ${["4-3-3", "4-4-2", "3-5-2", "5-4-1", "4-5-1", "3-4-3"].map((f) => `<option value="${f}" ${state.form === f ? "selected" : ""}>Modulo: ${f}</option>`).join("")}
          </select>
          <select id="carMentSelect" style="background:#1e293b;border:1px solid #334155;color:#fff;border-radius:6px;padding:4px 8px;font-size:12px;font-weight:700">
            ${["prudente", "equil", "offensiva", "allin"].map((m) => `<option value="${m}" ${state.ment === m ? "selected" : ""}>Attitudine: ${m}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="car-card">
        <div style="font-size:11px;font-weight:800;color:#94a3b8">TITOLARI (1-11) & RISERVE</div>
        ${rows}
      </div>
    `;

    el.querySelector("#carFormSelect").onchange = (e) => {
      state.form = e.target.value;
      saveState();
    };
    el.querySelector("#carMentSelect").onchange = (e) => {
      state.ment = e.target.value;
      saveState();
    };

    el.querySelectorAll("[data-plid]").forEach((row) => {
      row.onclick = () => {
        const id = Number(row.dataset.plid);
        if (selPlayerId == null) {
          selPlayerId = id;
          renderSquadra(el);
        } else {
          if (selPlayerId !== id) {
            const idxA = state.squad.findIndex((p) => p.id === selPlayerId);
            const idxB = state.squad.findIndex((p) => p.id === id);
            if (idxA >= 0 && idxB >= 0) {
              const temp = state.squad[idxA];
              state.squad[idxA] = state.squad[idxB];
              state.squad[idxB] = temp;
              saveState();
            }
          }
          selPlayerId = null;
          renderSquadra(el);
        }
      };
    });
  }

  function renderClassifica(el, div) {
    const core = window.__carrieraCore;
    const sorted = core.sortTable(state.table);

    const rows = sorted.map((t, i) => {
      const isUs = t.id === "rondine";
      const isPromo = i < div.promotion;
      const isReleg = div.relegation && i >= sorted.length - div.relegation;
      const cls = (isUs ? "us " : "") + (isPromo ? "promo " : "") + (isReleg ? "releg " : "");

      return `
        <tr class="${cls}">
          <td>${i + 1}</td>
          <td style="text-align:left;white-space:nowrap">${t.ico || "⚽"} ${esc(t.short)}</td>
          <td><b>${t.pts}</b></td>
          <td>${t.played}</td>
          <td>${t.won}</td>
          <td>${t.drawn}</td>
          <td>${t.lost}</td>
          <td>${t.gd > 0 ? "+" + t.gd : t.gd}</td>
        </tr>
      `;
    }).join("");

    el.innerHTML = `
      <div class="car-card">
        <h3>📊 Classifica · ${esc(div.name)}</h3>
        <div style="font-size:11px;color:#94a3b8;display:flex;gap:10px">
          <span style="color:#86efac">■ Zona Promozione (top ${div.promotion})</span>
          ${div.relegation ? `<span style="color:#f87171">■ Zona Retrocessione (ultime ${div.relegation})</span>` : ""}
        </div>
        <table class="car-tbl" style="margin-top:6px">
          <thead>
            <tr>
              <th>#</th>
              <th style="text-align:left">Club</th>
              <th>PT</th>
              <th>G</th>
              <th>V</th>
              <th>N</th>
              <th>P</th>
              <th>DR</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderMercato(el) {
    const freeAgents = [
      { id: 101, name: "Vito Sciabica", grp: "ATT", r: 72, age: 24, cost: 25, wage: 6, blurb: "Svincolato dal molo vecchio. Rapido e affamato." },
      { id: 102, name: "Berto la Trave", grp: "DIF", r: 74, age: 29, cost: 35, wage: 7, blurb: "Difensore d'esperienza. Pochi complimenti e tanta sostanza." },
      { id: 103, name: "Giotto Boa", grp: "CEN", r: 71, age: 21, cost: 20, wage: 5, blurb: "Giovane regista delle baie. Visione di gioco pura." }
    ];

    const cards = freeAgents.map((fa) => {
      const alreadyHas = state.squad.some((p) => p.name === fa.name);
      return `
        <div class="car-card" style="padding:10px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <b style="font-size:13px">${esc(fa.name)}</b>
              <div style="font-size:11px;color:#94a3b8">${fa.grp} · Valutazione ${fa.r} · ${fa.age} anni</div>
            </div>
            <div style="text-align:right">
              <span class="car-chip gold">${fa.cost} 🐟</span>
            </div>
          </div>
          <p style="font-size:11.5px;color:#cbd5e1;margin:4px 0">${esc(fa.blurb)}</p>
          <button class="car-btn gold" data-tratt="${fa.id}" ${alreadyHas || state.funds < fa.cost * 0.7 ? "disabled" : ""}>
            ${alreadyHas ? "Già in rosa" : "Tratta al Barcone ❯"}
          </button>
        </div>
      `;
    }).join("");

    el.innerHTML = `
      <div class="car-card">
        <h3>🤝 Calciomercato del Golfo</h3>
        <p style="font-size:12px;color:#94a3b8;margin:0">
          Usa le tue capacità dialettiche nel minigioco al barcone per abbassare il prezzo del cartellino.
        </p>
      </div>
      ${cards}
    `;

    el.querySelectorAll("[data-tratt]").forEach((btn) => {
      btn.onclick = () => {
        const id = Number(btn.dataset.tratt);
        const fa = freeAgents.find((f) => f.id === id);
        if (!fa || !window.__directorTrattativa) return;

        window.__directorTrattativa.start({
          playerName: fa.name,
          initialPrice: fa.cost,
          onDone: (res) => {
            if (res.win) {
              state.funds -= res.finalPrice;
              state.squad.push({
                id: Date.now() % 10000,
                name: fa.name,
                num: state.squad.length + 1,
                grp: fa.grp,
                sec: fa.grp,
                r: fa.r,
                age: fa.age,
                wage: fa.wage,
                st: 100,
                mor: 80,
                bench: true
              });
              saveState();
              render();
            }
          }
        });
      };
    });
  }

  function startMatchday(simulateOnly) {
    const nextMatch = getNextMatch();
    if (!nextMatch) return;
    const div = window.__carrieraDati.DIVISIONS[state.divId];
    const isHome = nextMatch.home === "rondine";
    const oppTeam = div.teams.find((t) => t.id === (isHome ? nextMatch.away : nextMatch.home));
    playVs(oppTeam, isHome, simulateOnly, (res, ids) => applyMatchResults(res, ids));
  }

  // stipendi della settimana: pagati una volta per giornata (con l'allenamento o, se salti la Settimana, al fischio finale).
  // In B e in Eccellenza gli stipendi salgono del 20% e del 40%: categoria nuova, pretese nuove.
  function payWeek(baseWages) {
    if (state.paidRound === state.round + "_" + state.season) return;
    const w = baseWages != null ? baseWages : state.squad.reduce((a, p) => a + (p.wage || 6), 0);
    const extra = Math.round(w * 0.2 * state.divId);
    if (baseWages != null) state.funds -= extra; // processWeek ha già pagato stipendi base e sponsor
    else state.funds += (state.sponsorWeekly || 60) - w - extra;
    state.paidRound = state.round + "_" + state.season; state.lastWages = w + extra;
  }
  function applyMatchResults(res, xiIds) {
    payWeek();
    xiIds = xiIds || xiOf().map((p) => p.id);
    const core = window.__carrieraCore;
    const dati = window.__carrieraDati;
    const div = dati.DIVISIONS[state.divId];
    const roundMatches = state.schedule[state.round - 1];

    roundMatches.forEach((m) => {
      if (m.home === "rondine") {
        m.scoreA = res.scoreA;
        m.scoreB = res.scoreB;
        m.played = true;
        core.applyMatchToTable(state.table, m.home, m.away, m.scoreA, m.scoreB);
      } else if (m.away === "rondine") {
        m.scoreA = res.scoreB;
        m.scoreB = res.scoreA;
        m.played = true;
        core.applyMatchToTable(state.table, m.home, m.away, m.scoreA, m.scoreB);
      } else {
        const tA = div.teams.find((t) => t.id === m.home) || { lvl: 1.0 };
        const tB = div.teams.find((t) => t.id === m.away) || { lvl: 1.0 };
        const sim = core.simMatch(tA, tB);
        m.scoreA = sim.scoreA;
        m.scoreB = sim.scoreB;
        m.played = true;
        core.applyMatchToTable(state.table, m.home, m.away, m.scoreA, m.scoreB);
      }
    });

    state.squad.filter((p) => xiIds.includes(p.id)).forEach((p) => {
      p.st = Math.max(15, p.st - 22);
    });

    state.lastMatchRes = res;
    if (res.win) {
      state.presTrust = clamp(state.presTrust + 6, 0, 100);
      state.fans = clamp(state.fans + 8, 0, 100);
      state.records.won++;
    } else if (res.draw) {
      state.presTrust = clamp(state.presTrust + 1, 0, 100);
      state.records.drawn++;
    } else {
      state.presTrust = clamp(state.presTrust - 7, 0, 100);
      state.fans = clamp(state.fans - 5, 0, 100);
      state.records.lost++;
    }

    const isHome = roundMatches.some((m) => m.home === "rondine");
    if (isHome) {
      const stadiumMult = 1.0 + getStadiumStage() * 0.25;
      const gate = Math.round(40 * stadiumMult);
      state.funds += gate;
    } else {
      state.funds += 12; // quota incasso in trasferta
    }
    state.funds += res.win ? 25 : res.draw ? 10 : 0; // premio partita della Lega
    const oppId = (roundMatches.find((m) => m.home === "rondine" || m.away === "rondine") || {});
    const vsRival = (oppId.home === "rondine" ? oppId.away : oppId.home) === rivalId();
    if (vsRival && res.win) { state.fans = clamp(state.fans + 5, 0, 100); state.presTrust = clamp(state.presTrust + 3, 0, 100); state.flags.beatLivore = (state.flags.beatLivore | 0) + 1; }
    afterMatchExtras(res, xiIds);
    if (vsRival && res.win) state.news.unshift("⚔️ Battuto Livore! In sala stampa si è aggiustato il cappotto tre volte.");
    state.news.push(`💰 Stipendi −${state.lastWages || 0} 🐟 · sponsor +${state.sponsorWeekly || 60} 🐟`);
    if (state.funds < 0) state.news.push(`💸 Cassa in rosso: ${state.funds} 🐟.`);

    state.round++;
    state.trainingDone = false;
    state.pressDone = false;

    saveState();
    render();
    crisis();
  }

  function advanceSeason() {
    if (state.epi !== state.season) { state.epi = state.season; return seasonEpilogue(advanceSeasonGo); }
    advanceSeasonGo();
  }
  function advanceSeasonGo() {
    const core = window.__carrieraCore;
    const dati = window.__carrieraDati;
    const sorted = core.sortTable(state.table);
    const ourPos = sorted.findIndex((t) => t.id === "rondine") + 1;
    const div = dati.DIVISIONS[state.divId];

    if (ourPos > 0 && ourPos <= div.promotion && state.divId < 2) {
      state.divId++;
      state.presTrust = 95;
      state.trophies.push(`Promozione in ${dati.DIVISIONS[state.divId].name} (Stagione ${state.season})`);
    } else if (div.relegation && ourPos > sorted.length - div.relegation && state.divId > 0) {
      state.divId--;
      state.presTrust = 50;
    }

    state.season++;
    state.round = 1;
    const newDiv = dati.DIVISIONS[state.divId];
    const newTeams = teamsOf(state.divId);
    const newTeamIds = newTeams.map((t) => t.id);
    state.table = core.initTable(newTeams);
    state.sponsorWeekly = Math.max(state.sponsorWeekly || 0, SPONSOR[state.divId] || 60);
    state.schedule = core.generateSchedule(newTeamIds);
    state.lastMatchRes = null;
    state.trainingDone = false;
    state.pressDone = false;
    state.goal = null; state.news = []; state.cupSeason = state.season; state.cup = newCup(state);

    saveState();
    render();
    if (state.ends.length) { const last = state.ends[state.ends.length - 1]; if (state.lastEndSeen !== last && window.__presa && window.__presa.cutin && ENDS[last]) { state.lastEndSeen = last; saveState(); return window.__presa.cutin("TRAGUARDO · " + ENDS[last][0].toUpperCase(), ENDS[last][1], () => { if (!state.goal) chooseGoal(); }); } }
    chooseGoal();
  }


  // =====================================================================================================
  // BLOCCO «SOCIETÀ E STORIA» (2026-11-04): obiettivi del Presidente, fiducia ed esonero, cassa in rosso, Coppa del Golfo,
  // infortuni e squalifiche dopo le partite, rosa che invecchia (crescita, ritiri, giovanili), rivale fisso Gualtiero Livore,
  // eventi della settimana, episodio serio di Ruspa, epilogo di stagione con albo d'oro, sede animata (lo stadio cambia con le tappe).
  // Opzione in Impostazioni: window.__directorCarriera.on() / setOn(v) (accesa di base), chiave SAVE_KEY + ".opt".
  // =====================================================================================================
  const OPT_KEY = SAVE_KEY + ".opt";
  const optGet = () => { try { return Object.assign({ on: true, cut: false }, JSON.parse(localStorage.getItem(OPT_KEY) || "{}")); } catch (e) { return { on: true, cut: false }; } };
  const optSet = (o) => { try { localStorage.setItem(OPT_KEY, JSON.stringify(Object.assign(optGet(), o))); } catch (e) {} };
  const rnd = Math.random, pick = (a) => a[Math.floor(rnd() * a.length)];
  function ensure(s) {
    s.albo = s.albo || []; s.evDone = s.evDone || {}; s.flags = s.flags || {}; s.done = s.done || {}; s.ends = s.ends || [];
    s.esoneri = s.esoneri | 0; s.redRounds = s.redRounds | 0; if (s.cup === undefined) s.cup = null; if (s.goal === undefined) s.goal = null; s.news = s.news || [];
    if (!s.cupSeason) { s.cupSeason = s.season; s.cup = newCup(s); }
    return s;
  }
  const RIVAL = ["corsari", "nebbia", "mareggiata"];
  const ENDS = { promoB: ["Su in Serie B", "La Rondine sale dalla Serie C del Golfo.", "Chiudi la Serie C nelle prime due."], promoA: ["Su in Eccellenza", "La Rondine arriva nell'Eccellenza del Golfo, la massima serie.", "Chiudi la Serie B nelle prime due."], scudetto: ["Lo Scudetto del Golfo", "Primi in Eccellenza. Spigola apre il barattolo delle acciughe, finalmente.", "Vinci l'Eccellenza del Golfo."], coppa: ["La Coppa del Golfo", "La coppa a eliminazione, alzata davanti al Faro.", "Vinci la Coppa del Golfo."] };

  // ---------------------------------------------------------------- personaggi nuovi (ritratti flat)
  const PEOPLE = {
    gf_livore: ["Gualtiero Livore", "Mister rivale", { style: "slick", hair: "#111111", shirt: "#0f172a", skin: "#e6b98f", eye: "#2a1a0a", beard: "pizzetto", bg: ["#1e1b4b", "#a5b4fc"] }, "Allenatore dal cappotto nero e dal sorriso a mezza bocca. Ogni volta che la Rondine sale di categoria, lui è già lì, su un'altra panchina, ad aspettarla. Dice che non è una persecuzione: è una vocazione."],
    gf_mina: ["Mina Truciolo", "Cronista della Voce della Costa", { style: "bob", hair: "#b8452a", shirt: "#0e7490", skin: "#f2c9a0", eye: "#16a34a", acc: ["taccuino"], bg: ["#155e75", "#cffafe"] }, "Scrive per la Voce della Costa e per il Corriere del Tirreno quando la pagano. Domande taglienti, matita morsicata, un debole per le conferenze stampa finite male."],
    gf_ruspa: ["Ruspa", "Magazziniere da quarantun anni", { style: "bald", hair: "#d6d3d1", shirt: "#57534e", skin: "#c8956a", eye: "#2a1a0a", beard: "baffi", bg: ["#44403c", "#e7e5e4"] }, "Magazziniere della Rondine da quarantun anni. Sa a memoria il numero di scarpa di ogni giocatore passato dal Borgo. Lava le maglie a mano, «perché la lavatrice non le conosce»."],
    gf_pulcino: ["Tito Pulcino", "Giovanili del Borgo", { style: "messy", hair: "#e8d08a", shirt: "#1d4ed8", skin: "#f5d6b8", eye: "#2563eb", bg: ["#1e3a8a", "#bfdbfe"] }, "Diciassette anni, le giovanili del Borgo e un sinistro che fa girare la testa ai pescatori. Arrossisce quando lo chiamano per nome. Non quando tira."],
    gf_mister: ["Il Mister", "Rondine FC · Carriera del Golfo", { style: "slick", hair: "#2b1d14", shirt: "#1d4ed8", skin: "#e9be95", eye: "#2a1a0a", bg: ["#1e3a8a", "#fde68a"] }, "Il Mister della Rondine FC: titolo onorario, panchina vera. Ha preso una squadra di paese e l'ha portata a giocarsela con chiunque, un barattolo di acciughe alla volta."],
  };
  function castAll() {
    const A = window.__borgoApi; if (!A || !A.CAST) return false;
    Object.keys(PEOPLE).forEach((id) => { const [name, sub, o, bio] = PEOPLE[id]; if (!A.CAST[id]) A.CAST[id] = Object.assign({ name, sub, tag: "" }, o); if (bio && A.BIO && !A.BIO[id]) A.BIO[id] = bio; });
    try { const h = JSON.parse(localStorage.getItem("ali-di-rondine.campione") || "null"); if (h && h.name) Object.assign(A.CAST.gf_mister, { hair: h.hair || A.CAST.gf_mister.hair, skin: h.skin || A.CAST.gf_mister.skin, style: h.style || "slick" }); } catch (e) {}
    return true;
  }
  const PORT = (id) => { try { const A = window.__borgoApi; return A && A.portraitImg ? A.portraitImg(id) : ""; } catch (e) { return ""; } };
  const WHO = { spigola: ["presidente_spigola", "Presidente Spigola"], dina: ["dina_cartella", "Dina Cartella"], arturo: ["arturo_molo", "Arturo (Radio Molo)"], livore: ["gf_livore", "Gualtiero Livore"], mina: ["gf_mina", "Mina Truciolo"], ruspa: ["gf_ruspa", "Ruspa"], tito: ["gf_pulcino", "Tito Pulcino"], voce: ["", ""] };

  // ---------------------------------------------------------------- dialoghi in sovrimpressione (ritratto flat + battuta)
  const dlgQ = [];
  function dlg(html, buttons) {
    if (!root) return; let d = root.querySelector(".car-dlg"); if (d) { dlgQ.push([html, buttons]); return; } // un dialogo alla volta: gli altri aspettano in fila
    d = document.createElement("div"); d.className = "car-dlg"; d.innerHTML = `<div class="car-dlg-box">${html}<div class="car-dlg-bt">${buttons.map((b, i) => `<button class="car-btn ${b.gold ? "gold" : ""}" data-dlg="${i}"><span>${esc(b.t)}</span>${b.s ? `<small style="display:block;font-size:10px;color:${b.gold ? "#1e293b" : "#facc15"}">${esc(b.s)}</small>` : ""}</button>`).join("")}</div></div>`;
    root.appendChild(d);
    d.querySelectorAll("[data-dlg]").forEach((b) => (b.onclick = () => { d.remove(); const x = buttons[Number(b.dataset.dlg)]; x && x.fn && x.fn(); if (root && !root.querySelector(".car-dlg") && dlgQ.length) dlg(...dlgQ.shift()); }));
  }
  const line = (w, t) => { const p = WHO[w] || [w, ""], img = p[0] ? PORT(p[0]) : ""; return `<div class="car-dlg-who">${img ? `<img src="${img}" alt="">` : `<span class="car-dlg-ico">🎙️</span>`}<b>${esc(p[1] || "")}</b></div><div class="car-dlg-txt">${t}</div>`; };
  function say(lines, cb) { let i = 0; const nx = () => { if (i >= lines.length) return cb && cb(); const [w, t] = lines[i++]; dlg(line(w, t), [{ t: "▸", gold: true, fn: nx }]); }; nx(); }
  function ask(w, t, opts) { dlg(line(w, t), opts); }

  // ---------------------------------------------------------------- obiettivi del Presidente
  function goals() {
    const d = state.divId;
    if (d === 2) return [{ id: "salvo", t: "Salvarsi senza patemi", s: "Prime 6 · premio 40 🐟", pos: 6, cash: 40, trust: 8, fail: -15 }, { id: "europa", t: "Il podio del Golfo", s: "Prime 3 · premio 90 🐟", pos: 3, cash: 90, trust: 14, fail: -20 }, { id: "scudetto", t: "Lo Scudetto o la vergogna", s: "Primi · premio 160 🐟 · fallire costa −30 fiducia", pos: 1, cash: 160, trust: 22, fail: -30 }];
    return [{ id: "tranquilla", t: "Una stagione tranquilla", s: "Prime 6 · premio 30 🐟", pos: 6, cash: 30, trust: 8, fail: -15 }, { id: "lotta", t: "Lottare per salire", s: "Prime 3 · premio 70 🐟", pos: 3, cash: 70, trust: 14, fail: -20 }, { id: "promo", t: "Promozione o niente", s: "Prime 2 · premio 120 🐟 · fallire costa −30 fiducia", pos: 2, cash: 120, trust: 20, fail: -30 }];
  }
  function chooseGoal() {
    const hd = ["«Mister, ogni stagione un patto. Io prometto di non vendere lo stadio, lei mi promette qualcosa di sportivo. Scelga lei, che io mi agito.»", "«Nuova stagione, nuovo barattolo. Cosa scriviamo sull'etichetta, Mister?»", "«Mi dica un obiettivo. Lo scrivo sul muro della sede, così lo leggono anche i muri.»"];
    ask("spigola", state.season === 1 ? hd[0] : pick(hd.slice(1)), goals().map((g) => ({ t: g.t, s: g.s, gold: g.id === "lotta" || g.id === "europa", fn: () => { state.goal = g; saveState(); say([["dina", `Segnato: <b>${esc(g.t)}</b>. Nella cartella «Promesse», che è grossa quanto la cartella «Varie».`]], render); } })));
  }

  // ---------------------------------------------------------------- Coppa del Golfo (8 squadre, eliminazione: dopo le giornate 2, 4, 6)
  function newCup(s) {
    const D = window.__carrieraDati.DIVISIONS, pool = [];
    D.forEach((d) => d.teams.forEach((t) => { if (t.id !== "rondine" && !pool.some((x) => x.id === t.id)) pool.push(t.id); }));
    pool.sort(() => rnd() - 0.5);
    return { season: s.season, stage: 0, alive: true, opps: pool.slice(0, 3), won: false, log: [] };
  }
  const CUP_ST = ["Quarti", "Semifinale", "Finale"];
  const teamAny = (id) => { const D = window.__carrieraDati.DIVISIONS; for (const d of D) { const t = d.teams.find((x) => x.id === id); if (t) return t; } return null; };
  const cupDue = () => { const c = state.cup; return !!(c && c.alive && !c.won && c.stage < 3 && state.round - 1 >= (c.stage + 1) * 2); };

  // ---------------------------------------------------------------- rivale fisso
  const rivalId = () => RIVAL[state.divId] || RIVAL[0];
  const LIV = [
    "Ci rivediamo, Mister. Io cambio squadra, lei cambia categoria: sembriamo due treni sulla stessa linea. Il mio, però, arriva in orario.",
    "Ho studiato la sua squadra. Ottima. Per una gita.",
    "Lo sa cosa ci differenzia? Io dormo la notte prima della partita. Lei conta le acciughe.",
    "Mi hanno detto che il suo Presidente tiene i soldi in un barattolo. Io tengo i miei in un barattolo più grande.",
  ];

  // ---------------------------------------------------------------- eventi della settimana (uno per giornata)
  const EV = [
    { id: "lavatrice", title: "La lavatrice di Ruspa", who: "ruspa", text: "«Mister, la lavatrice s'è rotta. Io le maglie le lavo a mano lo stesso, ma per domenica non asciugano. O le mettiamo umide, o compriamo una lavatrice, o usiamo quelle vecchie del '92.»", choices: [
      { t: "Comprate una lavatrice nuova", s: "Cassa −20 · morale +3", go: (S) => { S.funds -= 20; S.squad.forEach((p) => { p.mor = clamp(p.mor + 3, 0, 100); }); return "Ruspa la guarda come si guarda un nemico. Poi la accarezza. Poi la chiama «la Signora»."; } },
      { t: "Le maglie del '92", s: "Tifosi +6 · morale −2 (pizzicano)", go: (S) => { S.fans = clamp(S.fans + 6, 0, 100); S.squad.forEach((p) => { p.mor = clamp(p.mor - 2, 0, 100); }); return "In curva piangono per la nostalgia. In campo grattano per la lana."; } },
      { t: "Umide: si asciugano correndo", s: "Condizione −4", go: (S) => { S.squad.forEach((p) => { p.st = clamp(p.st - 4, 0, 100); }); return "Primo tempo a vapore. Sembrate una squadra di fantasmi molto sudati."; } }] },
    { id: "sponsor_gelati", title: "Lo sponsor dei ghiaccioli", who: "dina", text: "«Una ditta di ghiaccioli vuole il suo nome sulla maglia. Il ghiacciolo si chiama Gelo Rondinella e sa di menta e catrame. Pagano bene.»", choices: [
      { t: "Accettate", s: "Sponsor +10 a settimana · tifosi −4", go: (S) => { S.sponsorWeekly = (S.sponsorWeekly || 60) + 10; S.fans = clamp(S.fans - 4, 0, 100); return "La maglia nuova ha un ghiacciolo che fa l'occhiolino. Nessuno sa perché."; } },
      { t: "Rifiutate", s: "Fiducia Spigola −4 · tifosi +3", go: (S) => { S.presTrust = clamp(S.presTrust - 4, 0, 100); S.fans = clamp(S.fans + 3, 0, 100); return "Spigola sospira nel barattolo. La curva canta «la maglia non si vende», anche se nessuno l'aveva chiesto."; } }] },
    { id: "radio_pronostico", title: "Il pronostico di Radio Molo", who: "arturo", text: "«Qui Radio Molo! Mister, in diretta: quanti gol fa la Rondine domenica? Il pubblico da casa vuole un numero. Il pubblico da casa è mia zia, ma conta.»", choices: [
      { t: "«Tre, e uno di tacco.»", s: "Tifosi +6 · se perdi, fiducia −4", go: (S) => { S.fans = clamp(S.fans + 6, 0, 100); S.flags.bet = 1; return "La zia di Arturo telefona in radio: «Bravo! Ma di tacco no, che poi si fanno male.»"; } },
      { t: "«Il numero giusto è uno più di loro.»", s: "Fiducia +3", go: (S) => { S.presTrust = clamp(S.presTrust + 3, 0, 100); return "Arturo dice che è la risposta più da Mister che abbia mai sentito. Spigola la fa incorniciare."; } }] },
    { id: "prete_campo", title: "La benedizione del campo", who: "dina", text: "«Don Aurelio vuole benedire il campo prima della partita. Con l'acqua santa e, dice, con la canna dell'irrigazione, perché il campo è grande.»", choices: [
      { t: "Benedizione completa", s: "Morale +5 · campo bagnato (condizione −3)", go: (S) => { S.squad.forEach((p) => { p.mor = clamp(p.mor + 5, 0, 100); p.st = clamp(p.st - 3, 0, 100); }); return "Il campo è benedetto e allagato. I ragazzi si fanno il segno della croce e poi scivolano."; } },
      { t: "Solo le porte", s: "Morale +2", go: (S) => { S.squad.forEach((p) => { p.mor = clamp(p.mor + 2, 0, 100); }); return "Don Aurelio benedice i pali con tale convinzione che il portiere avversario, a fine partita, lo andrà a cercare."; } }] },
    { id: "bambino_maglia", title: "Il bambino senza maglia", who: "mina", text: "«Mister, c'è un bambino davanti ai cancelli con una maglia della Rondine fatta col pennarello su una canottiera. Il numero dieci è scritto storto. Scrivo un pezzo?»", choices: [
      { t: "Gli regali una maglia vera e lo fai entrare a bordo campo", s: "Tifosi +8 · cassa −5", go: (S) => { S.fans = clamp(S.fans + 8, 0, 100); S.funds -= 5; return "Il bambino non parla per tutta la partita. A fine gara chiede a Leo di firmargli la canottiera, non la maglia. «Questa l'ho fatta io.»"; } },
      { t: "«Scriva pure: è più bella di quelle vere.»", s: "Fiducia +2 · tifosi +4", go: (S) => { S.presTrust = clamp(S.presTrust + 2, 0, 100); S.fans = clamp(S.fans + 4, 0, 100); return "Il pezzo di Mina va in prima pagina. Il giorno dopo, in curva, ci sono trenta canottiere scritte a pennarello."; } }] },
    { id: "spia_livore", title: "Un cappotto nero in tribuna", who: "dina", text: "«Mister, all'allenamento c'era un uomo col cappotto nero che prendeva appunti. Ha chiesto il bagno, poi le formazioni. Gli ho dato solo il bagno.»", choices: [
      { t: "Allenamento a porte chiuse", s: "Condizione +3 · tifosi −3", go: (S) => { S.squad.forEach((p) => { p.st = clamp(p.st + 3, 0, 100); }); S.fans = clamp(S.fans - 3, 0, 100); return "Porte chiuse. I pensionati del molo guardano dalle barche, col binocolo. Tanto vale."; } },
      { t: "Fate finta di provare un modulo assurdo", s: "Morale +4 · prossimo rivale confuso", go: (S) => { S.squad.forEach((p) => { p.mor = clamp(p.mor + 4, 0, 100); }); S.flags.finta = 1; return "Provate un 1-1-8 con il portiere in attacco. L'uomo col cappotto scrive per mezz'ora. Ridete per una settimana."; } }] },
  ];
  // l'episodio serio: Ruspa, quarantun anni di maglie lavate a mano
  function ruspaEvent(cb) {
    say([["ruspa", "Mister, le devo dire una cosa e la dico una volta sola, che poi mi vergogno. A fine stagione smetto. Quarantun anni. Le mani non chiudono più bene le borse."], ["ruspa", "Non voglio feste. Non voglio niente. Volevo solo che lo sapesse lei per primo. Prima della lavatrice, almeno."]], () => ask("ruspa", "Ruspa piega una maglia numero dieci, lentissimo, come se fosse l'ultima.", [
      { t: "Domenica porta lui la squadra in campo, con la fascia", s: "Morale +8 a tutti", gold: true, fn: () => { state.squad.forEach((p) => { p.mor = clamp(p.mor + 8, 0, 100); }); state.flags.ruspa = "fascia"; saveState(); say([["voce", "Domenica Ruspa esce dal tunnel per primo, con la fascia sul braccio della tuta. Lo stadio si alza in piedi. Lui guarda per terra e conta i fili d'erba, per non piangere. Non ci riesce."]], cb); } },
      { t: "Una partita d'addio vera, coi vecchi della Rondine", s: "Cassa −15 · tifosi +10", fn: () => { state.funds -= 15; state.fans = clamp(state.fans + 10, 0, 100); state.flags.ruspa = "addio"; saveState(); say([["voce", "Trenta ex giocatori, alcuni coi capelli, alcuni senza. Ognuno ha una maglia che Ruspa ha lavato almeno cento volte. A fine partita gliela restituiscono tutte, firmate."]], cb); } },
      { t: "Rispetti la sua volontà: niente feste", s: "Fiducia +3", fn: () => { state.presTrust = clamp(state.presTrust + 3, 0, 100); state.flags.ruspa = "zitto"; saveState(); say([["voce", "Niente feste. Ma l'ultimo giorno trovi nel magazzino tutte le maglie piegate per numero, e un biglietto: «Il 10 va lavato al rovescio. Ricordatevelo.»"]], cb); } },
    ]));
  }
  function ruspaLetter(cb) {
    say([["dina", "Mister… Ruspa se n'è andato quest'inverno. Nel sonno, a casa sua, con la radio accesa su Radio Molo. Arturo dice che stava trasmettendo la Rondine."], ["dina", "Ha lasciato le chiavi del magazzino. Non a me, non al Presidente: al più giovane della rosa. Con un biglietto: «Al rovescio, il 10.»"], ["voce", "La domenica dopo la Rondine gioca col lutto al braccio. Nessuno lo ha deciso: le fasce nere erano già piegate, nel magazzino, per numero."]], () => { state.flags.ruspaGone = 1; state.squad.forEach((p) => { p.mor = clamp(p.mor + 4, 0, 100); }); saveState(); cb(); });
  }
  function weekEvent() {
    if (state.season === 1 && state.round === 5 && !state.flags.ruspa) return { special: "ruspa", title: "Ruspa deve dirle una cosa", who: "ruspa" };
    if (state.season === 3 && state.round === 1 && state.flags.ruspa && !state.flags.ruspaGone) return { special: "ruspaGone", title: "Una lettera nel magazzino", who: "dina" };
    const key = state.season + "_" + state.round; if (state.evDone[key]) return null;
    const all = EV.concat((window.__carrieraDati.WEEK_EVENTS || []).map((e) => ({ id: e.id, title: e.title, who: "dina", text: e.text, choices: e.choices })));
    return Object.assign({ key }, all[(state.season * 7 + state.round * 3) % all.length]);
  }
  function runEvent(e) {
    if (e.special === "ruspa") return ruspaEvent(render);
    if (e.special === "ruspaGone") return ruspaLetter(render);
    ask(e.who || "dina", `<b>${esc(e.title)}</b><br>${esc(e.text)}`, e.choices.map((c) => ({ t: c.t, s: c.s, fn: () => { const msg = c.go(state); state.evDone[e.key] = 1; saveState(); say([["voce", esc(msg || "")]], render); } })));
  }

  // ---------------------------------------------------------------- dopo la partita: infortuni, squalifiche, statistiche, crisi
  function heal() { state.squad.forEach((p) => { if (p.injWeeks > 0 && --p.injWeeks === 0) p.injured = false; if (p.suspWeeks > 0 && --p.suspWeeks === 0) p.suspended = false; }); }
  function afterMatchExtras(res, xiIds) {
    const news = [], xi = state.squad.filter((p) => xiIds.includes(p.id));
    xi.forEach((p) => { p.matches = (p.matches || 0) + 1; });
    (res.scorers || []).forEach((n) => { const p = state.squad.find((x) => x.name === n || String(n).indexOf(x.name.replace(/ \(C\)$/, "")) === 0); if (p) { p.goals = (p.goals || 0) + 1; p.sg = (p.sg || 0) + 1; } });
    if (!state.trainingDone) heal();
    if (xi.length && rnd() < 0.16) { const p = pick(xi), w = 1 + Math.floor(rnd() * 3); p.injured = true; p.injWeeks = w; news.push(`🏥 ${p.name} si è fatto male: fuori ${w} giornat${w > 1 ? "e" : "a"}.`); }
    if (xi.length && rnd() < 0.18) { const p = pick(xi.filter((x) => !x.injured).length ? xi.filter((x) => !x.injured) : xi); p.suspended = true; p.suspWeeks = 1; news.push(`🟥 ${p.name} è squalificato per una giornata.`); }
    if (state.flags.bet) { if (!res.win) { state.presTrust = clamp(state.presTrust - 4, 0, 100); news.push("📻 Il pronostico in radio è andato male: Spigola ha spento la radio."); } state.flags.bet = 0; }
    state.funds < 0 ? state.redRounds++ : (state.redRounds = 0);
    state.news = news;
  }
  function crisis() {
    if (state.presTrust <= 10) {
      state.esoneri++; saveState();
      return say([["spigola", "Mister… si sieda. No, sulla sedia buona. Le devo dire una cosa che non ho mai detto a nessuno, tranne a mio cognato, a una partita a carte. È esonerato."], ["dina", "Ho già preparato la cartella. Si chiama «Arrivederci». È piccolissima: speriamo serva poco."]], () => ask("voce", "Sei fuori. Il Borgo, però, ha la memoria corta e il cuore lungo.", [
        { t: "Aspetti la telefonata", s: "Ti richiamano: fiducia 45, penale −20 🐟", gold: true, fn: () => { state.presTrust = 45; state.funds -= 20; saveState(); say([["spigola", "(una settimana dopo, al telefono) Mister? Il sostituto ha perso pure a briscola col magazziniere. Torni. Non lo dica a nessuno. Lo sanno già tutti."]], render); } },
        { t: "Ricominci da capo", s: "Nuova carriera dalla Serie C (albo d'oro e traguardi restano)", fn: () => { const keep = { albo: state.albo, ends: state.ends, done: state.done, esoneri: state.esoneri, flags: { ruspa: state.flags.ruspa, ruspaGone: state.flags.ruspaGone } }; state = ensure(Object.assign(defaultState(), keep)); saveState(); render(); } },
      ]));
    }
    if (state.redRounds >= 2) {
      state.redRounds = 0; const bench = state.squad.slice(11).filter((p) => !/^Leo/.test(p.name)).sort((a, b) => (b.wage || 0) - (a.wage || 0));
      const sell = bench[0];
      return ask("dina", `Mister, il barattolo è vuoto da due settimane. Cassa <b>${state.funds} 🐟</b>. O vendiamo qualcuno o il Presidente comincia a vendere le sedie della sede.`, [
        ...(sell ? [{ t: `Cedi ${sell.name} (${sell.grp}, val ${sell.r})`, s: `Cassa +${Math.round(sell.r * 0.5)} 🐟 · morale −3`, gold: true, fn: () => { state.funds += Math.round(sell.r * 0.5); state.squad = state.squad.filter((p) => p.id !== sell.id); state.squad.forEach((p) => { p.mor = clamp(p.mor - 3, 0, 100); }); saveState(); say([["voce", `${esc(sell.name)} saluta lo spogliatoio con una pacca a ciascuno. Ruspa gli lava la maglia un'ultima volta.`]], render); } }] : []),
        { t: "Tieni duro", s: "Fiducia −12", fn: () => { state.presTrust = clamp(state.presTrust - 12, 0, 100); saveState(); render(); } },
      ]);
    }
  }

  // ---------------------------------------------------------------- fine stagione: epilogo, obiettivo, rosa che invecchia, giovanili, albo d'oro
  const YOUTH = ["Nando Seppia", "Lillo Bitta", "Ciro Scoglio", "Mattia Vela", "Gegè Remo", "Totò Libeccio", "Rocco Pinna", "Elia Gozzo"];
  function ageSquad() {
    const out = [];
    state.squad.forEach((p) => {
      p.age = (p.age || 24) + 1; const a = p.age, g = a <= 21 ? 1 + Math.floor(rnd() * 4) : a <= 27 ? Math.floor(rnd() * 3) : a <= 30 ? 0 : a <= 33 ? -1 - Math.floor(rnd() * 2) : -2 - Math.floor(rnd() * 3);
      p.r = clamp((p.r || 65) + g, 45, 95); p.sg = 0; p.st = 100; p.injured = false; p.injWeeks = 0; p.suspended = false; p.suspWeeks = 0;
    });
    const ret = state.squad.filter((p) => p.age >= 35 && !/^Leo/.test(p.name) && rnd() < 0.6);
    ret.forEach((p) => out.push(`👋 ${p.name} si ritira a ${p.age} anni.`)); state.squad = state.squad.filter((p) => !ret.includes(p));
    const ids = state.squad.map((p) => p.id), nid = () => { let i = 30; while (ids.includes(i)) i++; ids.push(i); return i; };
    if (state.season === 1 && !state.squad.some((p) => p.name === "Tito Pulcino")) { state.squad.push({ id: nid(), name: "Tito Pulcino", num: 27, grp: "ATT", sec: "CEN", r: 66, age: 17, wage: 2, st: 100, mor: 80, bench: true, goals: 0, assists: 0, matches: 0, pulcino: 1 }); out.push("🐣 Dalle giovanili sale Tito Pulcino, diciassette anni e un sinistro che fa girare la testa ai pescatori."); }
    else { const n = YOUTH.find((y) => !state.squad.some((p) => p.name === y)); if (n) { state.squad.push({ id: nid(), name: n, num: 30 + (state.season % 20), grp: pick(["DIF", "CEN", "ATT"]), sec: "CEN", r: 60 + Math.floor(rnd() * 7), age: 17, wage: 2, st: 100, mor: 75, bench: true, goals: 0, assists: 0, matches: 0 }); out.push(`🐣 Dalle giovanili del Borgo: ${n}, diciassette anni.`); } }
    return out;
  }
  function seasonEpilogue(next) {
    const core = window.__carrieraCore, sorted = core.sortTable(state.table), pos = sorted.findIndex((t) => t.id === "rondine") + 1, div = window.__carrieraDati.DIVISIONS[state.divId];
    const g = state.goal, met = g ? pos <= g.pos : null, top = state.squad.slice().sort((a, b) => (b.sg || 0) - (a.sg || 0))[0];
    if (g) { state.presTrust = clamp(state.presTrust + (met ? g.trust : g.fail), 0, 100); if (met) state.funds += g.cash; }
    if (state.divId === 0 && pos <= div.promotion && !state.ends.includes("promoB")) state.ends.push("promoB");
    if (state.divId === 1 && pos <= div.promotion && !state.ends.includes("promoA")) state.ends.push("promoA");
    if (state.divId === 2 && pos === 1) { if (!state.ends.includes("scudetto")) state.ends.push("scudetto"); state.trophies.push(`Scudetto del Golfo (Stagione ${state.season})`); state.records.titles++; }
    if (state.cup && state.cup.won && !state.ends.includes("coppa")) state.ends.push("coppa");
    state.done[state.season] = 1;
    state.albo.push({ s: state.season, div: div.short, pos, cup: state.cup ? (state.cup.won ? "vinta" : CUP_ST[Math.min(state.cup.stage, 2)]) : "-", top: top && top.sg ? `${top.name} (${top.sg})` : "-" });
    const aged = ageSquad(); saveState();
    const epi = pos === 1 ? "La Rondine chiude prima. Al Borgo suonano le campane, anche quelle che non funzionano." : pos <= 3 ? "Una stagione da ricordare. Spigola compra un barattolo nuovo, più grande, per fiducia." : pos <= 6 ? "Una stagione onesta. Ruspa dice che le maglie, almeno, sono state lavate bene." : "Una stagione da dimenticare. Ma al Borgo non si dimentica niente: si racconta peggio, col tempo.";
    say([
      ["voce", `<b>Fine stagione ${state.season}</b> · ${esc(div.name)}: <b>${pos}° posto</b>.<br>${epi}`],
      ...(g ? [["spigola", met ? `Obiettivo «${esc(g.t)}» centrato. Premio ${g.cash} 🐟, fiducia +${g.trust}. Mister, mi commuovo: è la prima volta che una promessa nella cartella si avvera.` : `Obiettivo «${esc(g.t)}» mancato. Fiducia ${g.fail}. Non sono arrabbiato. Sono deluso. Che è peggio, perché dura di più.`]] : []),
      ["dina", `Capocannoniere: ${top && top.sg ? `<b>${esc(top.name)}</b> con ${top.sg} gol` : "nessuno, ma tutti hanno provato"}.${state.cup ? ` Coppa del Golfo: ${state.cup.won ? "<b>vinta</b>!" : CUP_ST[Math.min(state.cup.stage, 2)].toLowerCase()}.` : ""}<br>${aged.map(esc).join("<br>")}`],
    ], next);
  }
  function alboHTML() {
    if (!state.albo.length) return `<p style="font-size:11.5px;color:#94a3b8;margin:0">Ancora vuoto. Dina ha già comprato la cornice.</p>`;
    return `<table class="car-tbl"><tr><th>St.</th><th>Serie</th><th>Pos</th><th>Coppa</th><th style="text-align:left">Bomber</th></tr>${state.albo.slice(-6).map((a) => `<tr><td>${a.s}</td><td>${esc(a.div)}</td><td><b>${a.pos}°</b></td><td>${esc(a.cup)}</td><td style="text-align:left;white-space:nowrap;overflow:hidden;max-width:90px;text-overflow:ellipsis">${esc(a.top)}</td></tr>`).join("")}</table>`;
  }

  // ---------------------------------------------------------------- la sede animata: ufficio ai Trabucchi + stadio che cambia con le tappe del Borgo
  function drawSede(g, W, H, f, stage) {
    const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); }, C = (x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
    let gr = g.createLinearGradient(0, 0, 0, H * 0.6); gr.addColorStop(0, "#1e3a8a"); gr.addColorStop(1, "#f59e0b"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    C(W * 0.82, H * 0.28, 14, "#fde68a"); for (let i = 0; i < 3; i++) { const x = ((f * 0.2 + i * 130) % (W + 80)) - 40; g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.arc(x, 24 + i * 10, 9, 0, 7); g.arc(x + 11, 27 + i * 10, 7, 0, 7); g.fill(); }
    // mare con onde
    R(0, H * 0.52, W, H * 0.12, "#0e7490"); for (let x = 0; x < W; x += 14) R(x + (f / 2) % 14, H * 0.55 + (x % 3) * 3, 7, 1, "rgba(255,255,255,.5)");
    // lo stadio: cambia con le tappe (0 rovina … 4 inaugurato)
    const sx = W * 0.46, sy = H * 0.3, sw = W * 0.5, sh = H * 0.24;
    if (stage === 0) { for (let i = 0; i < 6; i++) R(sx + i * sw / 6, sy + sh * (0.4 + (i % 2) * 0.2), sw / 7, sh * (0.6 - (i % 2) * 0.2), "#78716c"); g.font = "8px system-ui"; g.fillStyle = "#fef3c7"; g.fillText("🚧", sx + sw / 2, sy + sh * 0.5); }
    else { R(sx, sy + sh * 0.25, sw, sh * 0.75, stage >= 2 ? "#cbd5e1" : "#a8a29e"); for (let r = 0; r < 3; r++) for (let x = sx + 3; x < sx + sw - 3; x += 4) R(x, sy + sh * 0.35 + r * 6 - Math.max(0, Math.sin(f / 5 + x)) * (stage >= 3 ? 1.5 : 0.5), 2.5, 3, ["#1d4ed8", "#f8fafc", "#facc15"][(x + r) % 3 | 0]);
      if (stage >= 2) R(sx - 4, sy + sh * 0.18, sw + 8, 4, "#7c2d12");
      if (stage >= 3) [sx + 4, sx + sw - 4].forEach((x) => { R(x - 1, sy - 14, 2, sh * 0.4 + 14, "#334155"); R(x - 6, sy - 18, 12, 5, "#fffbe0"); const gl = g.createRadialGradient(x, sy - 16, 0, x, sy - 16, 30); gl.addColorStop(0, `rgba(255,250,210,${0.45 + Math.sin(f / 20) * 0.08})`); gl.addColorStop(1, "rgba(255,250,210,0)"); g.fillStyle = gl; g.fillRect(x - 30, sy - 46, 60, 60); });
      if (stage >= 4) { for (let i = 0; i < 8; i++) R(sx + i * sw / 8, sy + sh * 0.08 + Math.sin(f / 10 + i) * 1.5, 3, 5, ["#ef4444", "#facc15", "#3b82f6"][i % 3]); } }
    // la sede ai Trabucchi: casa di pescatori con la finestra accesa e Spigola che conta
    R(W * 0.06, H * 0.32, W * 0.32, H * 0.34, "#e7c9a0"); g.fillStyle = "#9a3412"; g.beginPath(); g.moveTo(W * 0.04, H * 0.33); g.lineTo(W * 0.22, H * 0.16); g.lineTo(W * 0.4, H * 0.33); g.fill();
    R(W * 0.1, H * 0.4, W * 0.1, H * 0.12, "#fde68a"); const sb = Math.sin(f / 12) * 1.2; C(W * 0.15, H * 0.46 + sb, 3.5, "#e9be95"); R(W * 0.135, H * 0.49 + sb, 9, 5, "#7c2d12"); R(W * 0.17, H * 0.5, 5, 4, "#cbd5e1");
    R(W * 0.26, H * 0.44, W * 0.08, H * 0.22, "#78350f"); g.font = "700 7px system-ui"; g.fillStyle = "#7c2d12"; g.fillText("RONDINE FC · SEDE", W * 0.085, H * 0.37);
    // il trabucco
    g.strokeStyle = "#5b3a22"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(W * 0.38, H * 0.6); g.lineTo(W * 0.46, H * 0.36); g.moveTo(W * 0.46, H * 0.36); g.lineTo(W * 0.56, H * 0.48 + Math.sin(f / 30) * 2); g.stroke();
    // molo, bandierina e gabbiano
    R(0, H * 0.64, W, H * 0.36, "#a8a29e"); for (let x = 0; x < W; x += 18) R(x, H * 0.64, 1, H * 0.36, "rgba(0,0,0,.15)");
    R(W * 0.42, H * 0.66, 1.5, 22, "#334155"); g.fillStyle = "#1d4ed8"; g.beginPath(); g.moveTo(W * 0.42 + 1.5, H * 0.66); g.lineTo(W * 0.42 + 14 + Math.sin(f / 7) * 2, H * 0.66 + 4); g.lineTo(W * 0.42 + 1.5, H * 0.66 + 8); g.fill();
    const gx = (f * 0.7) % (W + 40) - 20, gy = H * 0.2 + Math.sin(f / 15) * 5; g.strokeStyle = "#f8fafc"; g.lineWidth = 1.3; g.beginPath(); g.moveTo(gx - 5, gy); g.lineTo(gx, gy + Math.sin(f / 4) * 2); g.lineTo(gx + 5, gy); g.stroke();
    // Ruspa che stende le maglie
    if (!(state && state.flags && state.flags.ruspaGone)) { for (let i = 0; i < 4; i++) R(W * 0.62 + i * 12, H * 0.72 + Math.sin(f / 9 + i) * 1.2, 8, 9, i % 2 ? "#f8fafc" : "#1d4ed8"); g.strokeStyle = "#57534e"; g.lineWidth = 0.8; g.beginPath(); g.moveTo(W * 0.6, H * 0.72); g.lineTo(W * 0.62 + 48, H * 0.72); g.stroke(); }
    else { R(W * 0.66, H * 0.74, 28, 10, "#1c1917"); g.font = "700 6px system-ui"; g.fillStyle = "#f8fafc"; g.fillText("CIAO RUSPA", W * 0.665, H * 0.74 + 7); }
  }
  let sedeRaf = 0;
  function sedeLoop(cv) {
    cancelAnimationFrame(sedeRaf); if (!cv) return; const g = cv.getContext("2d"), st = getStadiumStage(); let f = 0;
    const lp = () => { if (!cv.isConnected) return; f++; g.setTransform(2, 0, 0, 2, 0, 0); drawSede(g, 320, 120, f, st); sedeRaf = requestAnimationFrame(lp); }; lp();
  }
  (function regBg(n) { const B = window.__lbBg; if (B && B.register) B.register("gf_sede", { draw: (g, W, H, f) => drawSede(g, W, H, f, getStadiumStage()), hot: [[10, 60, 110, 70, "🏠 La sede della Rondine FC ai Trabucchi. Il Presidente conta le acciughe alla finestra."], [150, 60, 160, 50, "🏟️ Lo stadio del Borgo: cambia a ogni tappa ricostruita."], [180, 130, 120, 40, "👕 Le maglie stese ad asciugare. Il 10 va lavato al rovescio."]] }); else if (n < 80) setTimeout(() => regBg(n + 1), 150); })(0);

  // ---------------------------------------------------------------- integrazione: ospite al Borgo, Salone/Sogni/Destino (info, finali)
  (function regGuest(n) {
    if (window.__borgoGuests && castAll()) window.__borgoGuests.add({ id: "gf_livore", saga: "Director · Carriera del Golfo", when: () => { try { const m = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); return !!(m && m.ends && m.ends.length); } catch (e) { return false; } }, lines: [
      "Gualtiero Livore, allenatore. No, non sono qui per spiare la Rondine. Sono qui per il fritto. Spiare viene dopo, a stomaco pieno.",
      "Il vostro Mister mi ha battuto una volta. Una. Ce l'ho scritta su un foglio in tasca, così non dimentico di vendicarmi.",
      "Al Borgo avete un muro che rimanda il pallone dritto. Dalle mie parti i muri rimandano solo le bollette.",
    ] });
    else if (n < 80) setTimeout(() => regGuest(n + 1), 250);
  })(0);
  function careerInfo() { let m = null; try { m = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); } catch (e) {} m = m || {}; const done = Object.assign({}, m.done || {}); return { ch: Object.keys(done).length, done, ends: (m.ends || []).slice(), season: m.season || 0 }; }
  function careerEndings() { const got = careerInfo().ends; return Object.keys(ENDS).map((k) => ({ id: k, title: ENDS[k][0], desc: ENDS[k][1], hint: ENDS[k][2], found: got.includes(k) })); }

  window.openDirectorCarriera = open;
  window.__directorCarriera = {
    open,
    close,
    state: () => state,
    on: () => optGet().on !== false, setOn: (v) => { const first = v && !optGet().seenOn; optSet({ on: !!v, seenOn: true }); return first; },
    info: careerInfo, endings: careerEndings, castAll, SAVE_KEY,
    menuEntry: (back) => { const m = careerInfo(); return { label: "🏆 Carriera del Golfo", sub: m.season ? `Stagione ${m.season}${m.ends.length ? ` · traguardi ${m.ends.length}/4` : ""} · obiettivi, Coppa, rivale` : "Manageriale: dalla Serie C del Golfo allo Scudetto · obiettivi, Coppa, rivale, rosa che invecchia", cls: "hot", fn: () => open(back) }; },
    reset: () => {
      state = ensure(defaultState());
      saveState();
      render();
    }
  };
})();
