// js/arena-2d-hd.js - Hub "Arena 2D HD": presenta le 4 modalità della suite e le lancia
// Entry: window.openArena2DHDModal(onExit)
(function () {
  "use strict";

  const LAST_KEY = "ali-di-rondine.arena-hd-last";
  const DIR_KEY = "ali-di-rondine.director-hd-v1";
  const STYLE_ID = "arx-style";

  let modal = null;
  let onExitCallback = null;
  let keyFn = null;

  const MODES = [
    { id: "emblem", fn: "openTacticalEmblemMode", ico: "🛡️", t: "Rondine Emblem", tag: "Tattica a turni", col: "#38bdf8", time: "~10 min", ctrl: "Tocco o mouse", d: "Muovi la squadra su una griglia, tocca i rivali e scegli le mosse. Contano portata e ruoli: pensa prima di muoverti.", btn: "Gioca" },
    { id: "action", fn: "openActionSoccerHD", ico: "⚽", t: "Action Soccer", tag: "Calcio d'azione 5v5", col: "#4ade80", time: "~5 min", ctrl: "Joystick o tocco", d: "Partita rapida vista dall'alto: corri, passa, tira. Calci a effetto con l'aftertouch e uno scatto speciale per i momenti caldi.", btn: "Gioca" },
    { id: "street", fn: "openStreetCageMode", ico: "👟", t: "Gabbia del Molo", tag: "Calcio da strada 3v3", col: "#fb923c", time: "~4 min", ctrl: "Tocco, frecce o WASD", d: "Campetto recintato: i muri restituiscono la palla, usali per sponde e uno-due. Riempi la Grinta per il tiro speciale.", btn: "Entra" },
    { id: "director", fn: "openMatchDirectorHD", ico: "📋", t: "Matchday Director", tag: "Gestionale dal vivo", col: "#c084fc", time: "~3 min a partita", ctrl: "Solo tocco: nessun riflesso", d: "Sei il Mister: modulo, mentalità, pressing, cambi e discorso dell'intervallo. 5 avversari, progressione e pagella.", btn: "Siediti" }
  ];

  const CSS = `
  .arx-root{position:fixed;inset:0;z-index:999999;background:radial-gradient(120% 60% at 50% 0%,#0f2542 0%,#060d1a 60%);color:#e5edf8;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;overflow-y:auto;-webkit-overflow-scrolling:touch;font-size:14px}
  .arx-root *{box-sizing:border-box}
  .arx-wrap{max-width:820px;margin:0 auto;padding:12px 14px 22px}
  .arx-head{display:flex;gap:10px;align-items:flex-start;justify-content:space-between}
  .arx-head h1{margin:2px 0 0;font-size:21px;font-weight:800;color:#fff;letter-spacing:-.3px;text-shadow:none}
  .arx-head p{margin:4px 0 0;font-size:12.5px;line-height:1.45;color:#93a4bd}
  .arx-x{flex:none;min-width:48px;min-height:44px;border:1px solid #ef4444;background:#7f1d1d;color:#fff;border-radius:10px;font:800 15px system-ui;cursor:pointer}
  .arx-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}
  .arx-card{display:flex;flex-direction:column;background:#0d1a2e;border:1px solid #223653;border-top:3px solid var(--c);border-radius:14px;padding:11px 11px 12px;position:relative;min-width:0}
  .arx-card .ic{font-size:30px;line-height:1}
  .arx-card h2{margin:6px 0 1px;font-size:15px;font-weight:800;color:var(--c);line-height:1.2;text-shadow:none}
  .arx-card .tg{font-size:10.5px;font-weight:700;color:#93a4bd;letter-spacing:.3px;text-transform:uppercase}
  .arx-card p{margin:7px 0 8px;font-size:12px;line-height:1.45;color:#c4d1e6;flex:1}
  .arx-meta{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:9px}
  .arx-meta span{font-size:10.5px;font-weight:700;padding:2px 7px;border-radius:10px;background:#16253e;color:#a9bbd6}
  .arx-play{min-height:46px;width:100%;border:0;border-radius:10px;font:800 14px system-ui;color:#08111f;background:var(--c);cursor:pointer;touch-action:manipulation}
  .arx-play:active{transform:scale(.97)}
  .arx-play[disabled]{opacity:.4}
  .arx-last{position:absolute;top:8px;right:8px;font-size:9.5px;font-weight:800;padding:2px 6px;border-radius:9px;background:#facc15;color:#241a02}
  .arx-info{margin-top:12px;padding:10px 12px;border:1px solid #223653;border-radius:12px;background:rgba(13,26,46,.7);font-size:12px;line-height:1.5;color:#93a4bd}
  .arx-info b{color:#e5edf8}
  @media (min-width:700px){.arx-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
  `;

  function readLast() { try { return localStorage.getItem(LAST_KEY) || ""; } catch (e) { return ""; } }
  function writeLast(id) { try { localStorage.setItem(LAST_KEY, id); } catch (e) { /* ignora */ } }
  function directorLine() {
    try {
      const r = JSON.parse(localStorage.getItem(DIR_KEY) || "null");
      if (r && r.played) return `Il tuo Matchday Director: ${Number(r.wins) || 0} vittorie, ${Number(r.draws) || 0} pareggi, ${Number(r.losses) || 0} sconfitte, ${Number(r.pts) || 0} punti Mister.`;
    } catch (e) { /* default */ }
    return "Il Matchday Director conserva i tuoi record su questo dispositivo.";
  }

  function closeHub() {
    if (keyFn) { document.removeEventListener("keydown", keyFn); keyFn = null; }
    if (modal) { modal.remove(); modal = null; }
    const st = document.getElementById(STYLE_ID); if (st) st.remove();
  }

  function launch(mode) {
    const fn = window[mode.fn];
    if (typeof fn !== "function") {
      try { if (window.toast) window.toast("Modalità non disponibile in questa versione.", "warn", "⚠️"); } catch (e) { /* noop */ }
      return;
    }
    writeLast(mode.id);
    const exit = onExitCallback;
    closeHub();
    // all'uscita della modalità riapriamo l'hub, con lo stesso onExit originale
    try {
      fn(function () { window.openArena2DHDModal(exit); });
    } catch (e) {
      console.error(e);
      window.openArena2DHDModal(exit);
    }
  }

  window.openArena2DHDModal = function (onExit) {
    closeHub();
    onExitCallback = onExit;
    const st = document.createElement("style");
    st.id = STYLE_ID; st.textContent = CSS;
    document.head.appendChild(st);

    const last = readLast();
    modal = document.createElement("div");
    modal.id = "arena2dModal";
    modal.className = "arx-root";
    modal.innerHTML = `<div class="arx-wrap">
      <div class="arx-head">
        <div><h1>✨ Arena 2D HD</h1>
        <p>Quattro modi diversi di vivere il calcio del Borgo. Sono indipendenti dalla storia principale: provali nell'ordine che vuoi.</p></div>
        <button class="arx-x" id="arenaCloseBtn" aria-label="Chiudi">✕</button>
      </div>
      <div class="arx-grid">${MODES.map((m) => `
        <div class="arx-card" style="--c:${m.col}">
          ${last === m.id ? '<span class="arx-last">ULTIMA</span>' : ""}
          <div class="ic">${m.ico}</div>
          <h2>${m.t}</h2>
          <div class="tg">${m.tag}</div>
          <p>${m.d}</p>
          <div class="arx-meta"><span>⏱ ${m.time}</span><span>🎮 ${m.ctrl}</span></div>
          <button class="arx-play" data-mode="${m.id}" ${typeof window[m.fn] === "function" ? "" : "disabled"}>${m.btn} ${m.ico}</button>
        </div>`).join("")}
      </div>
      <div class="arx-info">🌊 <b>Nota:</b> ${directorLine()} Alcune modalità offrono piccole monete alla prima vittoria; niente tocca le statistiche della Carriera.</div>
    </div>`;
    document.body.appendChild(modal);

    modal.querySelector("#arenaCloseBtn").onclick = function () {
      closeHub();
      if (typeof onExitCallback === "function") onExitCallback();
    };
    modal.querySelectorAll("[data-mode]").forEach((b) => {
      b.onclick = function () { const m = MODES.find((x) => x.id === b.dataset.mode); if (m) launch(m); };
    });
    keyFn = function (e) { if (e.key === "Escape" && modal) { closeHub(); if (typeof onExitCallback === "function") onExitCallback(); } };
    document.addEventListener("keydown", keyFn);
  };
})();
