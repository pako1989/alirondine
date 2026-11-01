// js/staffetta.js - «LA STAFFETTA DEI LEGAMI» (Arena dei Sogni & Squadra dei Sogni)
// Modalità a turni dinamica incentrata sulle coppie titolari, la gestione attiva della panchina (cambio volante)
// e l'attivazione della «Risonanza di Coppia» con cut-in animato quando due atleti condividono un Legame storico.
(function () {
  "use strict";

  if (window.__staffetta) return;

  const KEY = "ali-di-rondine.staffetta";
  const S = () => window.__sogni;
  const AR = () => window.__arena;

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };

  // Salvataggio dedicato retrocompatibile
  function load() {
    const d = {
      on: true,
      maxTier: 1,
      wins: 0,
      combosUsed: [],
      highscore: 0,
      team: [],  // [id1, id2] titolari
      bench: []  // [id3, id4, id5] riserve
    };
    try {
      return Object.assign(d, JSON.parse(localStorage.getItem(KEY) || "{}"));
    } catch (e) {
      return d;
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {}
  }

  // Cerca un legame esplicito tra due carte nell'archivio storico LINKS della Squadra dei Sogni
  function getPairLink(id1, id2) {
    if (!id1 || !id2 || id1 === id2) return null;
    const sObj = S();
    const links = (sObj && sObj.LINKS) || [];
    const match = links.find(([x, y]) => (x === id1 && y === id2) || (x === id2 && y === id1));
    if (match) {
      return { id1, id2, title: match[2], isCanonical: true };
    }
    // Fallback sinergico: stessa saga
    if (sObj && sObj.BY && sObj.BY[id1] && sObj.BY[id2]) {
      const c1 = sObj.BY[id1], c2 = sObj.BY[id2];
      if (c1.saga && c1.saga === c2.saga) {
        const sagaName = (sObj.SAGHE && sObj.SAGHE[c1.saga] && sObj.SAGHE[c1.saga][1]) || "Bandiera di Saga";
        return { id1, id2, title: `Spirito di ${sagaName}`, isCanonical: false };
      }
    }
    return null;
  }

  // Definizione effetti e attributi delle Mosse di Risonanza
  const RESONANCE_EFFECTS = {
    "La Coppa del '34": { mult: 3.2, shield: 60, cleanse: true, desc: "Danno 3.2× + Barriera metallica 60🛡️ a tutta la squadra" },
    "Ferro & Ottone": { mult: 2.8, burn: 3, shield: 45, desc: "Danno 2.8×, bruciatura 🔥 e scudo protettivo +45🛡️" },
    "Ferro e ottone": { mult: 2.8, burn: 3, shield: 45, desc: "Danno 2.8×, bruciatura 🔥 e scudo protettivo +45🛡️" },
    "Moviola & Deduzioni": { mult: 2.6, interrupt: true, stun: true, desc: "Danno 2.6×, interrompe il nemico e lo stordisce ⏳" },
    "Le Gatte tra i Pali": { mult: 2.4, teamShield: 65, cleanse: true, desc: "Scudo impenetrabile +65🛡️ e cura ogni alterazione" },
    "Bomber d'Acciaio": { mult: 3.4, pierce: true, burn: 3, desc: "Danno 3.4× perforante che ignora gli scudi nemici" },
    "Mastri Orafi e Stagnini": { mult: 3.0, shield: 50, gauge: 30, desc: "Danno 3.0×, crea +50🛡️ e ricarica +30% barra squadra" },
    "I Fratelli Moretti": { mult: 3.1, aoe: true, gauge: 25, desc: "Tiro a giro che colpisce tutti i rivali e carica +25%" },
    "Dal Muro del Porto": { mult: 2.7, interrupt: true, shield: 55, desc: "Interrompe i colpi avversari e blinda la difesa con +55🛡️" },
    "Il Volo degli Arata": { mult: 3.3, pierce: true, desc: "Tiro aereo in picchiata da 3.3× che annulla la guardia" },
    "Panchine di Riviera": { mult: 2.5, buffDmg: 1.35, teamShield: 40, desc: "Aumenta i danni del +35% e distribuisce +40🛡️" }
  };

  function getResonanceData(id1, id2) {
    const link = getPairLink(id1, id2);
    if (!link) return null;
    const eff = RESONANCE_EFFECTS[link.title] || {
      mult: 2.8,
      shield: 40,
      cleanse: true,
      desc: `Attacco Sinergico 2.8× tra compagni affiatati con barriera +40🛡️`
    };
    return Object.assign({}, link, eff);
  }

  // 5 Ondate progressive della Staffetta
  const WAVES = [
    { wave: 1, name: "I Ragazzi del Vecchio Molo", sub: "Ondata 1/5 · Campo di terra battuta", hp: 120, atk: 18, foes: ["Panchina Popolare", "Mediano di Spinta"] },
    { wave: 2, name: "I Fabbri e gli Scaricatori", sub: "Ondata 2/5 · Fonderia e banchina", hp: 170, atk: 24, foes: ["Maglio di Ghisa", "Gancio d'Acciaio"] },
    { wave: 3, name: "La Guardia Nobiliare", sub: "Ondata 3/5 · Giardino dei Marmi", hp: 220, atk: 30, foes: ["Cavaliere del Fischio", "Cerimoniere"] },
    { wave: 4, name: "I Mercenari della Morosini", sub: "Ondata 4/5 · Palco del Banditore", hp: 280, atk: 36, foes: ["Ruspa Pesante", "Ingegnere Tattico"] },
    { wave: 5, name: "I Mastri della Coppa 1934", sub: "Ondata 5/5 · Finale Storico", hp: 350, atk: 44, foes: ["Vanni l'Orafo", "Capitano d'Oro '34"] }
  ];

  // CSS dedicato per l'interfaccia mobile-first della Staffetta dei Legami
  const CSS = `
  .stfRoot {
    position: fixed; inset: 0; z-index: 99992;
    background: radial-gradient(120% 85% at 50% 0%, #1e1138 0%, #080314 70%);
    color: #ede9fe; font-family: system-ui, -apple-system, sans-serif;
    overflow-y: auto; -webkit-overflow-scrolling: touch; font-size: 14px;
    padding-bottom: 30px;
  }
  .stfRoot * { box-sizing: border-box; }
  .stfW { max-width: 600px; margin: 0 auto; padding: 12px 16px; }
  .stfHd { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
  .stfHd h1 { margin: 0; font-size: 20px; font-weight: 800; color: #fbbf24; letter-spacing: -0.3px; }
  .stfHd p { margin: 4px 0 0; font-size: 12.5px; line-height: 1.45; color: #c4b5fd; }
  .stfClose {
    min-width: 44px; min-height: 44px; border-radius: 10px;
    border: 1px solid #7c3aed; background: #2e1065; color: #fff;
    font: 800 16px system-ui; cursor: pointer; flex: none;
  }
  .stfSection {
    margin: 16px 0 8px; font-size: 11px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.5px; color: #a78bfa;
  }
  .stfDuoRow {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    margin-bottom: 8px;
  }
  .stfCardSlot {
    background: #180b2e; border: 1.5px dashed #6d28d9; border-radius: 12px;
    padding: 10px; text-align: center; cursor: pointer; position: relative;
    min-height: 110px; display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .stfCardSlot.filled {
    border-style: solid; border-color: #8b5cf6; background: #241242;
  }
  .stfCardSlot .im {
    width: 52px; height: 52px; border-radius: 8px; image-rendering: pixelated;
    background: #3b1b6d; margin-bottom: 6px; display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: bold; color: #a78bfa;
  }
  .stfCardSlot .nm { font-weight: 800; font-size: 13px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
  .stfCardSlot .role { font-size: 11px; color: #fde047; font-weight: 700; }
  .stfCardSlot .remove {
    position: absolute; top: 4px; right: 4px; width: 22px; height: 22px;
    border-radius: 50%; background: #ef4444; color: #fff; border: none;
    font: 800 11px sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .stfLinkBanner {
    background: linear-gradient(90deg, #451a03 0%, #78350f 50%, #451a03 100%);
    border: 1.5px solid #f59e0b; border-radius: 10px; padding: 10px 14px;
    margin: 8px 0 14px; display: flex; align-items: center; gap: 10px;
    animation: stfPulse 2s infinite ease-in-out;
  }
  @keyframes stfPulse {
    0%, 100% { box-shadow: 0 0 10px rgba(245, 158, 11, 0.2); }
    50% { box-shadow: 0 0 18px rgba(245, 158, 11, 0.45); }
  }
  .stfLinkIcon { font-size: 24px; flex: none; }
  .stfLinkTxt h4 { margin: 0; font-size: 13.5px; font-weight: 800; color: #fef08a; }
  .stfLinkTxt p { margin: 2px 0 0; font-size: 11.5px; color: #fde68a; line-height: 1.35; }

  .stfBenchRow {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px;
  }
  .stfPoolGrid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px;
    max-height: 220px; overflow-y: auto; padding: 6px; background: rgba(0,0,0,0.25); border-radius: 10px;
  }
  .stfPoolCard {
    background: #1a0f30; border: 1px solid #4c1d95; border-radius: 8px;
    padding: 6px; text-align: center; cursor: pointer;
  }
  .stfPoolCard.inTeam { border-color: #22c55e; background: #064e3b; opacity: 0.6; }
  .stfPoolCard .im { width: 40px; height: 40px; margin: 0 auto 4px; border-radius: 6px; background: #2e1065; font-size: 16px; display: flex; align-items: center; justify-content: center; }
  .stfPoolCard .nm { font-size: 11px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #e9d5ff; }

  .stfActions { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
  .stfBtn {
    width: 100%; min-height: 48px; border-radius: 10px; border: 1.5px solid #8b5cf6;
    background: linear-gradient(180deg, #6d28d9 0%, #4c1d95 100%); color: #fff;
    font: 800 15px system-ui; cursor: pointer; display: flex; flex-direction: column;
    align-items: center; justify-content: center; padding: 6px 12px; text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  }
  .stfBtn:disabled { opacity: 0.45; cursor: not-allowed; border-color: #4b5563; background: #1f2937; }
  .stfBtn small { font-size: 11px; font-weight: 500; color: #d8b4fe; margin-top: 1px; }
  .stfBtn.gold {
    border-color: #eab308; background: linear-gradient(180deg, #ca8a04 0%, #854d0e 100%);
  }
  .stfBtn.gold small { color: #fef08a; }

  /* Cutin Grafico Risonanza */
  .stfCutOverlay {
    position: fixed; inset: 0; z-index: 99998; background: rgba(8, 3, 20, 0.94);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    overflow: hidden; pointer-events: none;
  }
  .stfCutStripeLeft {
    position: absolute; top: 15%; left: -30%; width: 160%; height: 80px;
    background: linear-gradient(90deg, #7c3aed, #fbbf24 60%, #7c3aed);
    transform: rotate(-6deg); opacity: 0.85; animation: stfStripeL 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .stfCutStripeRight {
    position: absolute; bottom: 20%; left: -30%; width: 160%; height: 70px;
    background: linear-gradient(90deg, #b45309, #f59e0b 60%, #b45309);
    transform: rotate(-6deg); opacity: 0.85; animation: stfStripeR 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .stfCutBox {
    position: relative; z-index: 2; text-align: center; padding: 0 20px;
    animation: stfBoxPop 0.5s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .stfCutBox h2 {
    font-size: 26px; font-weight: 900; color: #fff; margin: 0; letter-spacing: 1px;
    text-shadow: 0 0 20px #f59e0b, 0 3px 0 #78350f;
  }
  .stfCutBox .duoNames {
    display: flex; justify-content: center; gap: 16px; margin: 12px 0 6px;
  }
  .stfCutBox .duoCard {
    text-align: center; font-size: 12px; font-weight: 800; color: #fef08a;
  }
  .stfCutBox .duoCard img, .stfCutBox .duoCard .av {
    width: 60px; height: 60px; border-radius: 12px; border: 2.5px solid #fbbf24;
    background: #2e1065; margin-bottom: 4px; display: flex; align-items: center; justify-content: center;
    font-size: 22px; image-rendering: pixelated;
  }
  .stfCutBox .sub { font-size: 13px; font-weight: 700; color: #ddd6fe; text-shadow: 0 1px 2px #000; }

  @keyframes stfStripeL { from { transform: translateX(-100%) rotate(-6deg); } to { transform: translateX(0) rotate(-6deg); } }
  @keyframes stfStripeR { from { transform: translateX(100%) rotate(-6deg); } to { transform: translateX(0) rotate(-6deg); } }
  @keyframes stfBoxPop { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }

  /* Arena Battaglia Staffetta */
  .stfBattleRoot {
    position: fixed; inset: 0; z-index: 99993; background: #0c051a;
    color: #ede9fe; font-family: system-ui, sans-serif; display: flex;
    flex-direction: column; overflow: hidden;
  }
  .stfBTop {
    padding: 10px 14px; background: rgba(30, 16, 54, 0.85); border-bottom: 1.5px solid #4c1d95;
    display: flex; justify-content: space-between; align-items: center;
  }
  .stfBTop h3 { margin: 0; font-size: 15px; font-weight: 800; color: #fbbf24; }
  .stfBTop .waveBadge { font-size: 12px; font-weight: 800; color: #a78bfa; background: #2e1065; padding: 3px 8px; border-radius: 6px; }

  .stfBField {
    flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; justify-content: space-around;
  }
  .stfBRow { display: flex; justify-content: center; gap: 14px; }
  .stfUnitCard {
    background: #180b2e; border: 1.5px solid #6d28d9; border-radius: 12px;
    padding: 10px; width: 140px; text-align: center; position: relative;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  }
  .stfUnitCard.foe { border-color: #ef4444; background: #2a0b18; }
  .stfUnitCard.activeHero { border-color: #3b82f6; box-shadow: 0 0 14px rgba(59, 130, 246, 0.5); }
  .stfUnitCard .uName { font-size: 12px; font-weight: 800; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .stfUnitCard .uHpBar { height: 8px; background: #374151; border-radius: 4px; overflow: hidden; margin: 6px 0 2px; }
  .stfUnitCard .uHpFill { height: 100%; background: #22c55e; transition: width 0.3s; }
  .stfUnitCard.foe .uHpFill { background: #ef4444; }
  .stfUnitCard .uShield { font-size: 10px; font-weight: 800; color: #38bdf8; }

  .stfResonanceGauge {
    margin: 8px 12px; background: #1f1438; border: 1.5px solid #8b5cf6; border-radius: 8px; padding: 6px 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .stfResonanceGauge .rTitle { font-size: 11px; font-weight: 800; color: #fde047; flex: none; }
  .stfResonanceGauge .gTrack { flex: 1; height: 10px; background: #374151; border-radius: 5px; overflow: hidden; }
  .stfResonanceGauge .gFill { height: 100%; background: linear-gradient(90deg, #ca8a04, #facc15); width: 0%; transition: width 0.3s; }

  .stfBControls {
    background: #120724; border-top: 1.5px solid #4c1d95; padding: 10px 14px;
  }
  .stfBenchDock {
    display: flex; justify-content: center; gap: 8px; margin-bottom: 8px;
  }
  .stfBenchBtn {
    background: #1c0f33; border: 1px solid #7c3aed; border-radius: 8px;
    padding: 4px 8px; font-size: 11px; font-weight: 700; color: #ddd6fe;
    cursor: pointer; display: flex; align-items: center; gap: 4px;
  }
  .stfBenchBtn:disabled { opacity: 0.4; cursor: not-allowed; }
  .stfActionGrid {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;
  }
  .stfActBtn {
    min-height: 44px; border-radius: 8px; border: 1px solid #7c3aed;
    background: #2e1065; color: #fff; font: 800 13px system-ui; cursor: pointer;
  }
  .stfActBtn.special {
    grid-column: span 3; background: linear-gradient(90deg, #b45309, #d97706);
    border-color: #f59e0b; color: #fef08a; font-size: 14px; min-height: 48px;
  }
  .stfActBtn:disabled { opacity: 0.45; cursor: not-allowed; }
  `;

  let OV = null;
  let BACK = null;

  function css() {
    if (document.getElementById("stfStyle")) return;
    const el = document.createElement("style");
    el.id = "stfStyle";
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  // Cut-in animato a due strisce contrapposte
  function cutin(duo, cb, customTitle) {
    css();
    const st = load();
    if (st.cutin === "off" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (cb) cb();
      return;
    }

    const sObj = S();
    let name1 = "Atleta 1", name2 = "Atleta 2", pUrl1 = null, pUrl2 = null;
    if (duo && duo[0] && duo[1]) {
      name1 = safe(() => sObj.name(duo[0]), duo[0]);
      name2 = safe(() => sObj.name(duo[1]), duo[1]);
      pUrl1 = safe(() => sObj.port(duo[0]), null);
      pUrl2 = safe(() => sObj.port(duo[1]), null);
    }

    const cutEl = document.createElement("div");
    cutEl.className = "stfCutOverlay";
    cutEl.id = "stfCutOverlay";
    cutEl.innerHTML = `
      <div class="stfCutStripeLeft"></div>
      <div class="stfCutStripeRight"></div>
      <div class="stfCutBox">
        <h2>⚡ ${esc(customTitle || "RISONANZA DI COPPA")}</h2>
        <div class="duoNames">
          <div class="duoCard">
            ${pUrl1 ? `<img src="${pUrl1}" alt="">` : `<div class="av">★</div>`}
            <div>${esc(name1)}</div>
          </div>
          <div class="duoCard">
            ${pUrl2 ? `<img src="${pUrl2}" alt="">` : `<div class="av">★</div>`}
            <div>${esc(name2)}</div>
          </div>
        </div>
        <div class="sub">La forza dei legami scuote il campo da gioco!</div>
      </div>
    `;
    document.body.appendChild(cutEl);

    setTimeout(() => {
      cutEl.remove();
      if (cb) cb();
    }, 1500);
  }

  function renderSlot(id, label, isBench, onRemove) {
    const sObj = S();
    const c = id && sObj && sObj.BY && sObj.BY[id];
    if (!c) {
      return `
        <div class="stfCardSlot" data-slot="${label}">
          <div class="im">+</div>
          <div class="nm">${label}</div>
          <div class="role">Tocca carta sotto</div>
        </div>`;
    }
    const nm = safe(() => sObj.name(id), id);
    const pUrl = safe(() => sObj.port(id), null);
    const imgHtml = pUrl ? `<img class="im" src="${pUrl}" alt="${esc(nm)}">` : `<div class="im">${esc(c.role || "C")}</div>`;
    return `
      <div class="stfCardSlot filled" data-card="${id}">
        ${onRemove ? `<button type="button" class="remove" data-rm="${id}">✕</button>` : ""}
        ${imgHtml}
        <div class="nm">${esc(nm)}</div>
        <div class="role">${esc(c.role ? c.role : "Giocatore")} · Liv. ${safe(() => sObj.lvOf ? sObj.lvOf(id) : 1, 1)}</div>
      </div>`;
  }

  function open(back) {
    if (back) BACK = back;
    const st = load();
    const sObj = S();
    if (!sObj) return;

    css();

    if (OV) OV.remove();
    OV = document.createElement("div");
    OV.className = "stfRoot";

    const sLoad = safe(() => sObj._load(), { own: [], team: [] });
    let own = (sLoad.own || []).filter((id) => sObj.BY && sObj.BY[id]);

    // Roster predefinito se vuoto
    if (!st.team || st.team.length < 2) {
      st.team = (sLoad.team && sLoad.team.slice(0, 2)) || own.slice(0, 2);
      save(st);
    }
    if (!st.bench || st.bench.length === 0) {
      const free = own.filter((id) => !st.team.includes(id));
      st.bench = free.slice(0, 3);
      save(st);
    }

    const t1 = st.team[0], t2 = st.team[1];
    const resData = getResonanceData(t1, t2);

    let html = `
    <div class="stfW">
      <div class="stfHd">
        <div>
          <h1>⚡ La Staffetta dei Legami</h1>
          <p>Schiera <b>2 titolari</b> e <b>3 riserve</b>. Se i due atleti in campo condividono un legame, scatenano la <b>Mossa di Risonanza</b>!</p>
        </div>
        <button type="button" class="stfClose" data-act="close">✕</button>
      </div>

      <div class="stfSection">⚽ Coppia Titolare in Campo (2)</div>
      <div class="stfDuoRow">
        ${renderSlot(t1, "Titolare 1", false, true)}
        ${renderSlot(t2, "Titolare 2", false, true)}
      </div>

      ${resData ? `
        <div class="stfLinkBanner">
          <div class="stfLinkIcon">⚡</div>
          <div class="stfLinkTxt">
            <h4>RISONANZA ATTIVA: «${esc(resData.title)}»</h4>
            <p>${esc(resData.desc)}</p>
          </div>
        </div>
      ` : `
        <div style="background:#171126;border:1px dashed #4c1d95;border-radius:10px;padding:8px 12px;margin:8px 0 14px;color:#a78bfa;font-size:12px;text-align:center;">
          ℹ️ <em>Nessun Legame attivo tra i due titolari: schiera due compagni storici per la Risonanza!</em>
        </div>
      `}

      <div class="stfSection">🪑 Panchina di Staffetta (3 riserve al cambio rapido)</div>
      <div class="stfBenchRow">
        ${renderSlot(st.bench[0], "Riserva 1", true, true)}
        ${renderSlot(st.bench[1], "Riserva 2", true, true)}
        ${renderSlot(st.bench[2], "Riserva 3", true, true)}
      </div>

      <div class="stfSection">🃏 Le tue Carte (${own.length}) · Tocca per inserire</div>
      <div class="stfPoolGrid">
        ${own.map((id) => {
          const inT = st.team.includes(id);
          const inB = st.bench.includes(id);
          const c = sObj.BY[id];
          const nm = safe(() => sObj.name(id), id);
          return `
            <div class="stfPoolCard${inT || inB ? " inTeam" : ""}" data-pick="${id}">
              <div class="im">${esc(c.role || "C")}</div>
              <div class="nm">${esc(nm)}</div>
              <small style="color:${inT ? "#4ade80" : inB ? "#facc15" : "#a78bfa"}">${inT ? "Campo" : inB ? "Panca" : "+"}</small>
            </div>
          `;
        }).join("")}
      </div>

      <div class="stfActions">
        <button type="button" class="stfBtn gold" data-act="start" ${st.team.filter(Boolean).length < 2 ? "disabled" : ""}>
          ▶ Inizia la Staffetta dei Legami
          <small>Affronta le 5 ondate con cambio volante e risonanze</small>
        </button>
        <button type="button" class="stfBtn" data-act="auto">
          ✨ Trova Miglior Coppia con Legame
          <small>Assegna in automatico due carte affiatate</small>
        </button>
      </div>
    </div>
    `;

    OV.innerHTML = html;
    document.body.appendChild(OV);

    // Event listener
    OV.querySelector('[data-act="close"]').onclick = close;

    // Rimuovi carta da slot
    OV.querySelectorAll("[data-rm]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const cid = btn.dataset.rm;
        st.team = st.team.filter((x) => x !== cid);
        st.bench = st.bench.filter((x) => x !== cid);
        save(st);
        open();
      };
    });

    // Seleziona carta dalla collezione
    OV.querySelectorAll("[data-pick]").forEach((cardEl) => {
      cardEl.onclick = () => {
        const cid = cardEl.dataset.pick;
        if (st.team.includes(cid)) {
          st.team = st.team.filter((x) => x !== cid);
        } else if (st.bench.includes(cid)) {
          st.bench = st.bench.filter((x) => x !== cid);
        } else {
          if (st.team.length < 2) {
            st.team.push(cid);
          } else if (st.bench.length < 3) {
            st.bench.push(cid);
          } else {
            st.bench[st.bench.length - 1] = cid;
          }
        }
        save(st);
        open();
      };
    });

    // Auto-coppia migliore
    const autoBtn = OV.querySelector('[data-act="auto"]');
    if (autoBtn) {
      autoBtn.onclick = () => {
        const links = (sObj && sObj.LINKS) || [];
        let bestPair = null;
        for (const [x, y, tit] of links) {
          if (own.includes(x) && own.includes(y)) {
            bestPair = [x, y];
            break;
          }
        }
        if (bestPair) {
          st.team = bestPair;
          st.bench = own.filter((id) => !bestPair.includes(id)).slice(0, 3);
          save(st);
          open();
        } else {
          if (window.toast) window.toast("Nessuna coppia con legame canonico trovata nella collezione.");
        }
      };
    }

    // Avvio Battaglia Staffetta
    const startBtn = OV.querySelector('[data-act="start"]');
    if (startBtn) {
      startBtn.onclick = () => {
        close();
        startBattle(st.team, st.bench, () => open());
      };
    }
  }

  function close() {
    if (OV) {
      OV.remove();
      OV = null;
    }
    if (BACK) {
      const b = BACK;
      BACK = null;
      b();
    }
  }

  // ------------------------------------------------------------
  // MOTORE DI BATTAGLIA STAFFETTA A 5 ONDATE
  // ------------------------------------------------------------
  let B = null;

  function startBattle(starters, benchList, onDone) {
    css();
    const sObj = S();
    const st = load();

    const tmUnits = starters.map((id) => {
      const c = (sObj && sObj.BY && sObj.BY[id]) || { at: 60, df: 60, te: 60, role: "A" };
      const maxHp = 100 + (c.df || 50) * 1.5;
      return { id, n: safe(() => sObj.name(id), id), hp: maxHp, maxHp, shield: 0, c };
    });

    const bnUnits = benchList.map((id) => {
      const c = (sObj && sObj.BY && sObj.BY[id]) || { at: 60, df: 60, te: 60, role: "C" };
      const maxHp = 100 + (c.df || 50) * 1.5;
      return { id, n: safe(() => sObj.name(id), id), hp: maxHp, maxHp, shield: 0, c };
    });

    B = {
      waveIdx: 0,
      team: tmUnits,
      bench: bnUnits,
      gauge: 0,
      onDone,
      foes: []
    };

    setupWave(0);
  }

  function setupWave(wIdx) {
    const W = WAVES[Math.min(WAVES.length - 1, wIdx)];
    B.waveIdx = wIdx;
    B.foes = [
      { id: "foe1", n: W.foes[0], hp: W.hp, maxHp: W.hp, shield: 0, atk: W.atk },
      { id: "foe2", n: W.foes[1], hp: W.hp, maxHp: W.hp, shield: 0, atk: W.atk }
    ];

    // Se la coppia attuale ha un legame, doniamo +40% barra sinergia all'inizio dell'ondata!
    const link = getPairLink(B.team[0] && B.team[0].id, B.team[1] && B.team[1].id);
    if (link) {
      B.gauge = Math.min(100, B.gauge + 40);
    }

    renderBattle();
  }

  function renderBattle() {
    const W = WAVES[B.waveIdx];
    const link = getResonanceData(B.team[0] && B.team[0].id, B.team[1] && B.team[1].id);

    let bOv = document.getElementById("stfBattleRoot");
    if (!bOv) {
      bOv = document.createElement("div");
      bOv.className = "stfBattleRoot";
      bOv.id = "stfBattleRoot";
      document.body.appendChild(bOv);
    }

    const aliveFoes = B.foes.filter((f) => f.hp > 0);
    const aliveTeam = B.team.filter((u) => u.hp > 0);

    let html = `
      <div class="stfBTop">
        <div>
          <h3>⚡ ${esc(W.name)}</h3>
          <span class="waveBadge">${esc(W.sub)}</span>
        </div>
        <button type="button" class="stfClose" data-bact="quit" style="min-width:36px;min-height:36px;font-size:13px">Abbandona</button>
      </div>

      <div class="stfBField">
        <!-- Nemici in alto -->
        <div class="stfBRow">
          ${B.foes.map((f) => `
            <div class="stfUnitCard foe" data-foe="${f.id}">
              <div class="uName">${esc(f.n)}</div>
              <div class="uHpBar">
                <div class="uHpFill" style="width:${Math.max(0, Math.round((f.hp / f.maxHp) * 100))}%"></div>
              </div>
              <small>${Math.max(0, Math.round(f.hp))}/${f.maxHp} PV</small>
              ${f.shield > 0 ? `<div class="uShield">+${f.shield} 🛡️</div>` : ""}
            </div>
          `).join("")}
        </div>

        <!-- Titolari alleati al centro -->
        <div class="stfBRow">
          ${B.team.map((u, i) => `
            <div class="stfUnitCard activeHero" data-hero="${u.id}">
              <div class="uName">${esc(u.n)}</div>
              <div class="uHpBar">
                <div class="uHpFill" style="width:${Math.max(0, Math.round((u.hp / u.maxHp) * 100))}%"></div>
              </div>
              <small>${Math.max(0, Math.round(u.hp))}/${u.maxHp} PV</small>
              ${u.shield > 0 ? `<div class="uShield">+${u.shield} 🛡️</div>` : ""}
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Barra Sinergia / Risonanza -->
      <div class="stfResonanceGauge">
        <div class="rTitle">⚡ SINERGIA: ${link ? `«${esc(link.title)}»` : "Coppia"}</div>
        <div class="gTrack">
          <div class="gFill" style="width:${B.gauge}%"></div>
        </div>
        <span style="font-size:11px;font-weight:800;color:#fde047">${Math.round(B.gauge)}%</span>
      </div>

      <!-- Controlli e Dock Panchina -->
      <div class="stfBControls">
        <div class="stfBenchDock">
          ${B.bench.map((bn, bIdx) => `
            <button type="button" class="stfBenchBtn" data-swap="${bn.id}" ${bn.hp <= 0 ? "disabled" : ""}>
              🪑 ${esc(bn.n)} (${Math.round(bn.hp)} PV)
            </button>
          `).join("")}
        </div>

        <div class="stfActionGrid">
          <button type="button" class="stfActBtn" data-bact="atk">⚔️ Attacco (+20% ⚡)</button>
          <button type="button" class="stfActBtn" data-bact="def">🛡️ Difesa (+35 🛡️)</button>
          <button type="button" class="stfActBtn" data-bact="swapHelp">🪑 Staffetta</button>
          <button type="button" class="stfActBtn special" data-bact="reso" ${B.gauge < 100 ? "disabled" : ""}>
            ⚡ ${link ? `MOSSA DI RISONANZA: «${esc(link.title)}»` : "COLPO DI STAFFETTA"}
          </button>
        </div>
      </div>
    `;

    bOv.innerHTML = html;

    bOv.querySelector('[data-bact="quit"]').onclick = () => {
      bOv.remove();
      if (B.onDone) B.onDone();
    };

    bOv.querySelector('[data-bact="atk"]').onclick = () => doAction("atk");
    bOv.querySelector('[data-bact="def"]').onclick = () => doAction("def");
    bOv.querySelector('[data-bact="swapHelp"]').onclick = () => {
      if (window.toast) window.toast("Tocca una carta della panchina in alto per effettuare il cambio volante!");
    };
    bOv.querySelector('[data-bact="reso"]').onclick = () => doAction("reso");

    bOv.querySelectorAll("[data-swap]").forEach((btn) => {
      btn.onclick = () => {
        const swapId = btn.dataset.swap;
        doSwap(swapId);
      };
    });
  }

  function doSwap(swapId) {
    const bIdx = B.bench.findIndex((x) => x.id === swapId);
    if (bIdx < 0 || B.bench[bIdx].hp <= 0) return;

    // Sostituisce il primo titolare vivo (o quello più ferito)
    let tIdx = 0;
    if (B.team[0].hp > B.team[1].hp && B.team[1].hp > 0) tIdx = 1;

    const outHero = B.team[tIdx];
    const inHero = B.bench.splice(bIdx, 1, outHero)[0];
    inHero.shield += 35; // Scudo d'ingresso al subentro
    B.team[tIdx] = inHero;

    if (window.toast) window.toast(`Subentra ${inHero.n} con +35🛡️ di Scudo d'ingresso!`);
    renderBattle();
  }

  function doAction(actType) {
    const sObj = S();
    const link = getResonanceData(B.team[0] && B.team[0].id, B.team[1] && B.team[1].id);

    if (actType === "reso") {
      // Attivazione Risonanza con Cut-in
      const tIds = [B.team[0].id, B.team[1].id];
      const rTitle = link ? link.title : "Carica di Staffetta";

      // Ricorda combo sbloccata
      const st = load();
      if (link && !st.combosUsed.includes(rTitle)) {
        st.combosUsed.push(rTitle);
        save(st);
      }

      cutin(tIds, () => {
        // Infligge danno devastante ad entrambi i nemici
        const baseDmg = 75;
        const mult = (link && link.mult) || 3.0;
        const totalDmg = Math.round(baseDmg * mult);

        B.foes.forEach((f) => {
          if (f.hp > 0) f.hp = Math.max(0, f.hp - totalDmg);
        });
        B.team.forEach((u) => {
          if (u.hp > 0) u.shield += (link && link.shield) || 50;
        });

        B.gauge = 0;
        afterPlayerTurn();
      }, rTitle);
      return;
    }

    if (actType === "atk") {
      // Danno singolo al primo nemico vivo
      const tgt = B.foes.find((f) => f.hp > 0);
      if (tgt) {
        tgt.hp = Math.max(0, tgt.hp - 45);
      }
      B.gauge = Math.min(100, B.gauge + 25);
    } else if (actType === "def") {
      // Scudo ai compagni
      B.team.forEach((u) => {
        if (u.hp > 0) u.shield += 35;
      });
      B.gauge = Math.min(100, B.gauge + 15);
    }

    afterPlayerTurn();
  }

  function afterPlayerTurn() {
    // Controlla se ondata sconfitta
    const foesAlive = B.foes.some((f) => f.hp > 0);
    if (!foesAlive) {
      if (B.waveIdx + 1 < WAVES.length) {
        if (window.toast) window.toast(`✓ Ondata ${B.waveIdx + 1} superata! Avanti alla prossima.`);
        // Recupero PV del 30% per la squadra
        B.team.forEach((u) => {
          if (u.hp > 0) u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.3);
        });
        setupWave(B.waveIdx + 1);
        return;
      } else {
        // Vittoria Totale!
        const bOv = document.getElementById("stfBattleRoot");
        if (bOv) bOv.remove();

        const st = load();
        st.wins = (st.wins || 0) + 1;
        st.maxTier = Math.max(st.maxTier || 1, 5);
        save(st);

        safe(() => {
          if (window.addCoins) window.addCoins(60);
          if (window.toast) window.toast("🏆 VITTORIA NELLA STAFFETTA DEI LEGAMI! +60 monete!", "info", "⚡");
        });

        if (B.onDone) B.onDone();
        return;
      }
    }

    // Risposta dei nemici
    setTimeout(() => {
      B.foes.forEach((f) => {
        if (f.hp > 0) {
          // Attacca un titolare casuale
          const aliveHero = B.team.find((u) => u.hp > 0);
          if (aliveHero) {
            let dmg = f.atk || 20;
            if (aliveHero.shield > 0) {
              const absorbed = Math.min(aliveHero.shield, dmg);
              aliveHero.shield -= absorbed;
              dmg -= absorbed;
            }
            aliveHero.hp = Math.max(0, aliveHero.hp - dmg);
          }
        }
      });

      // Controlla sconfitta squadra
      const heroesAlive = B.team.some((u) => u.hp > 0);
      if (!heroesAlive) {
        // Se ci sono riserve, subentrano automaticamente!
        const freeBench = B.bench.find((bn) => bn.hp > 0);
        if (freeBench) {
          doSwap(freeBench.id);
        } else {
          const bOv = document.getElementById("stfBattleRoot");
          if (bOv) bOv.remove();
          if (window.toast) window.toast("Sconfitta nella Staffetta dei Legami. Rinforza la rosa e riprova!");
          if (B.onDone) B.onDone();
          return;
        }
      }

      renderBattle();
    }, 400);
  }

  window.__staffetta = {
    open,
    close,
    load,
    save,
    setRoster: (team, bench) => {
      const s = load();
      if (Array.isArray(team)) {
        if (team.length > 2 && !bench) {
          s.team = team.slice(0, 2);
          s.bench = team.slice(2, 5);
        } else {
          s.team = team.slice(0, 2);
        }
      }
      if (Array.isArray(bench)) s.bench = bench.slice(0, 3);
      save(s);
    },
    getPairLink,
    getResonanceData,
    cutin,
    startBattle,
    on: () => load().on !== false,
    setOn: (v) => {
      const s = load();
      s.on = !!v;
      save(s);
    }
  };
})();
