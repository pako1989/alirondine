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
      sponsorWeekly: 35,
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
        if (s && s.version === 1 && s.squad && s.table) return s;
      }
    } catch (e) { /* ignora */ }
    return defaultState();
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

    if (!root) {
      root = document.createElement("div");
      root.className = "car-root";
      document.body.appendChild(root);
    }
    render();
  }

  function close() {
    saveState();
    if (root) {
      root.remove();
      root = null;
    }
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
    const dati = window.__carrieraDati;
    const oppTeam = nextMatch ? div.teams.find((t) => t.id === (nextMatch.home === "rondine" ? nextMatch.away : nextMatch.home)) : null;

    el.innerHTML = `
      <div class="car-card">
        <h3>📍 Sede ai Trabucchi · Scrivania del Mister</h3>
        <p style="font-size:12px;color:#94a3b8;margin:0;line-height:1.4">
          Dina compila i registri con cura. Il Presidente Spigola conta i fondi nel barattolo e chiede la vittoria.
        </p>
        <div style="font-size:11.5px;display:flex;gap:12px;margin-top:2px">
          <span>🏟️ Stadio: <b>${esc(stadioName)}</b></span>
          <span>📅 Giornata: <b>${state.round}/7</b></span>
        </div>
      </div>

      ${oppTeam ? `
        <div class="car-next-match">
          <div style="text-align:center">
            <div style="font-size:26px">🕊️</div>
            <b style="font-size:12px">Rondine</b>
          </div>
          <div style="text-align:center">
            <span style="font-size:13px;font-weight:900;color:#f59e0b">${nextMatch.home === "rondine" ? "IN CASA" : "IN TRASFERTA"}</span>
            <div style="font-size:10.5px;color:#94a3b8">G. ${state.round} di 7</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:26px">${oppTeam.ico || "⚽"}</div>
            <b style="font-size:12px">${esc(oppTeam.short)}</b>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <button class="car-btn gold" id="carPlayDirector">
            <span>🎮 Gioca (Director)</span>
          </button>
          <button class="car-btn" id="carSimMatch">
            <span>⚡ Simula subito</span>
          </button>
        </div>
      ` : `
        <div class="car-card" style="text-align:center;padding:16px">
          <div style="font-size:24px">🏆</div>
          <b>Campionato terminato!</b>
          <p style="font-size:12px;color:#94a3b8">Verifica la classifica finale per promozioni o retrocessioni.</p>
          <button class="car-btn gold" id="carNewSeasonBtn">Nuova Stagione ❯</button>
        </div>
      `}

      ${state.lastMatchRes ? `
        <div class="car-card">
          <h3>Ultimo risultato</h3>
          <div style="font-size:16px;font-weight:900;text-align:center">
            ${state.lastMatchRes.scoreA} - ${state.lastMatchRes.scoreB}
          </div>
          <div style="font-size:11.5px;color:#94a3b8;text-align:center">
            ${state.lastMatchRes.scorers && state.lastMatchRes.scorers.length ? "Marcatori: " + esc(state.lastMatchRes.scorers.join(", ")) : "Nessun gol"}
          </div>
        </div>
      ` : ""}
    `;

    const playBtn = el.querySelector("#carPlayDirector");
    if (playBtn) playBtn.onclick = () => startMatchday(false);

    const simBtn = el.querySelector("#carSimMatch");
    if (simBtn) simBtn.onclick = () => startMatchday(true);

    const newSeas = el.querySelector("#carNewSeasonBtn");
    if (newSeas) newSeas.onclick = () => advanceSeason();
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
            core.processWeek(state, t.toLowerCase());
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

    const core = window.__carrieraCore;
    const dati = window.__carrieraDati;
    const div = dati.DIVISIONS[state.divId];
    const isHome = nextMatch.home === "rondine";
    const oppId = isHome ? nextMatch.away : nextMatch.home;
    const oppTeam = div.teams.find((t) => t.id === oppId);

    if (simulateOnly) {
      const ourTeamObj = {
        name: "Rondine FC",
        lvl: 0.98 + (state.squad.slice(0, 11).reduce((acc, p) => acc + p.r, 0) / 11 - 70) * 0.02,
        atk: 1.0,
        def: 0.98
      };
      const res = core.simMatch(isHome ? ourTeamObj : oppTeam, isHome ? oppTeam : ourTeamObj);
      const scoreRondine = isHome ? res.scoreA : res.scoreB;
      const scoreOpp = isHome ? res.scoreB : res.scoreA;

      applyMatchResults({
        scoreA: scoreRondine,
        scoreB: scoreOpp,
        win: scoreRondine > scoreOpp,
        draw: scoreRondine === scoreOpp,
        scorers: isHome ? res.scorersA : res.scorersB
      });
    } else {
      if (!window.__directorHd) return;
      const titolari = state.squad.slice(0, 11).map((p) => Object.assign({}, p, { bench: false }));
      const panchina = state.squad.slice(11).map((p) => Object.assign({}, p, { bench: true }));

      window.__directorHd.start({
        mode: "career",
        squad: titolari.concat(panchina),
        opp: {
          id: oppTeam.id,
          name: oppTeam.name,
          short: oppTeam.short,
          ico: oppTeam.ico,
          col: oppTeam.col,
          col2: oppTeam.col2,
          lvl: oppTeam.lvl || 1.0,
          form: "4-4-2",
          style: "Campionato del Golfo",
          names: oppTeam.names || [],
          blurb: `La sfida di campionato contro ${oppTeam.name}.`,
          hint: "Fai attenzione alla stanchezza dei tuoi giocatori.",
          goal: "Vinci per la classifica",
          mod: { atk: 1, mid: 1, def: 1, pressWeak: 1, foul: 0.03, ctr: 1, wall: 1, tire: 1 }
        },
        form: state.form,
        ment: state.ment,
        press: state.press,
        onDone: (res) => {
          if (res) {
            applyMatchResults(res);
          }
        }
      });
    }
  }

  function applyMatchResults(res) {
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

    state.squad.slice(0, 11).forEach((p) => {
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
      const gate = Math.round(18 * stadiumMult);
      state.funds += gate;
    }

    state.round++;
    state.trainingDone = false;
    state.pressDone = false;

    saveState();
    render();
  }

  function advanceSeason() {
    const core = window.__carrieraCore;
    const dati = window.__carrieraDati;
    const sorted = core.sortTable(state.table);
    const ourPos = sorted.findIndex((t) => t.id === "rondine") + 1;
    const div = dati.DIVISIONS[state.divId];

    if (ourPos <= div.promotion && state.divId < 2) {
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
    const newTeamIds = newDiv.teams.map((t) => t.id);
    state.table = core.initTable(newDiv.teams);
    state.schedule = core.generateSchedule(newTeamIds);
    state.lastMatchRes = null;
    state.trainingDone = false;
    state.pressDone = false;

    saveState();
    render();
  }

  window.openDirectorCarriera = open;
  window.__directorCarriera = {
    open,
    close,
    state: () => state,
    reset: () => {
      state = defaultState();
      saveState();
      render();
    }
  };
})();
