// js/spogliatoio-campione.js - SPOGLIATOIO DEL CAMPIONE (Rinnovamento & Espansione «Il mio campione»)
// Hub visuale interattivo a schede per il Campione:
//  1. Anteprima Live doppia: Ritratto HD + Sprite Campo animato (camminata 4 direzioni / esultanza al gol).
//  2. Scheda «Identità & Tattica»: Nome, Numero (1-99 con scorciatoie), Ruolo (Bomber, Regista, Ala, Baluardo),
//     Piede preferito (Destro, Sinistro, Ambidestro), Soprannome Curva.
//  3. Scheda «Aspetto & Volto»: Volto (1-12), Carnagione, Occhi (palette estesa), Capelli & Colore (inclusi tagli delle saghe), Barba, Segni, Fascia, Ciocca.
//  4. Scheda «Divisa & Stile»: Maglia base, Seconda maglia (trasferta), Fantasia (tinta unita, strisce verticali, banda orizzontale, maniche contrasto), Fascia Capitano, Esultanza personale.
//  5. Scheda «Laboratorio Tiro»: Selezione tiro speciale, Nome personalizzato, Scia energetica (colore primario/secondario), Frase cut-in cinematografico.
//  6. Scheda «Guardaroba»: Griglia cosmetici sbloccati categorizzati (maglie, tagli, tiri, accessori) con indizi per i bloccati.
//  7. Gestione 3 Preset Look: Titolare (Casa), Trasferta, Speciale/Notte.
//  8. Carta Eroe Evolutiva: Sincronizzazione in tempo reale per Squadra dei Sogni e Calcio d'Azione Eroi.
(function () {
  "use strict";

  const HERO_KEY = "ali-di-rondine.campione";
  const PRESETS_KEY = "ali-di-rondine.campione.presets";

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const readJSON = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } };
  const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  // Archetipi tattici con bonus dedicati
  const RUOLI = {
    A: { id: "A", name: "Bomber d'Area", icon: "⚽", desc: "Finalizzatore implacabile. +Tiro e freddezza sotto porta.", bias: { tiro: 3, drib: 1, pass: -1, contr: -1 } },
    C: { id: "C", name: "Regista di Centrocampo", icon: "🎯", desc: "Visione di gioco totale. +Passaggio, +Regia e lanci millimetrici.", bias: { pass: 3, tiro: -1, drib: 1, contr: 0 } },
    W: { id: "W", name: "Ala Funambola", icon: "⚡", desc: "Velocità e dribbling nello stretto per saltare l'uomo sulla fascia.", bias: { drib: 3, tiro: 1, pass: 0, contr: -2 } },
    D: { id: "D", name: "Baluardo Difensivo", icon: "🛡️", desc: "Roccia difensiva insuperabile. +Contrasto, scivolate e muro.", bias: { contr: 4, tiro: -2, pass: 0, drib: -1 } },
  };

  const PIEDI = {
    dx: { id: "dx", label: "Destro", sub: "Piede naturale destro" },
    sx: { id: "sx", label: "Sinistro", sub: "Mancino puro, traiettorie a uscire" },
    ambi: { id: "ambi", label: "Ambidestro", sub: "Equilibrio perfetto con entrambi i piedi" },
  };

  const FANTASIE = {
    unita: { id: "unita", label: "Tinta Unita", sub: "Classica tinta unita tradizionale" },
    strisce: { id: "strisce", label: "Pali Verticali", sub: "Strisce bicolore stile Lanterna" },
    banda: { id: "banda", label: "Banda al Petto", sub: "Banda orizzontale al centro del petto" },
    maniche: { id: "maniche", label: "Maniche a Contrasto", sub: "Corpo maglia e maniche bicolore" },
  };

  const SCIE = {
    fuoco: { id: "fuoco", label: "Fiamma Viva", c1: "#ff4d20", c2: "#ffd23f", fx: "fire" },
    fulmine: { id: "fulmine", label: "Fulmine Elettrico", c1: "#38bdf8", c2: "#ffffff", fx: "thunder" },
    smeraldo: { id: "smeraldo", label: "Vento di Smeraldo", c1: "#10b981", c2: "#86efac", fx: "curve" },
    ombra: { id: "ombra", label: "Ombra Notturna", c1: "#8b5cf6", c2: "#1e1b4b", fx: "vanish" },
    sole: { id: "sole", label: "Luce d'Oro Solare", c1: "#f59e0b", c2: "#fef08a", fx: "drill" },
    ghiaccio: { id: "ghiaccio", label: "Ghiaccio Polare", c1: "#06b6d4", c2: "#e0f2fe", fx: "ice" },
  };

  const FRASE_DEFAULT = "Questa la dedico a chi non molla mai!";

  // Calcolo grado evolutivo della Carta Eroe
  function getHeroTier() {
    let score = 0;
    try {
      // Saghe completate
      for (let i = 1; i <= 12; i++) {
        if (localStorage.getItem("ali-di-rondine.stagione" + i)) score += 2;
      }
      // Carriera record
      const cr = readJSON("ali-di-rondine.carriera.record", null);
      if (cr && cr.titles > 0) score += 5;
      if (cr && cr.seasons > 0) score += 2;
      // Sogni tornei
      const sg = readJSON("ali-di-rondine.sogni", null);
      if (sg && Array.isArray(sg.won)) score += sg.won.length;
      // Storie Campione
      if (localStorage.getItem("ali-di-rondine.hero-story")) score += 3;
      if (localStorage.getItem("ali-di-rondine.storia-campione")) score += 3;
      if (localStorage.getItem("ali-di-rondine.campione-ombre")) score += 3;
    } catch {}

    if (score >= 18) return { rar: "l", label: "Leggendaria", star: 4, col: "#ffd23f", border: "#ffd23f", title: "Leggenda della Rondine", baseAt: 92, baseDf: 85, baseTe: 94 };
    if (score >= 9) return { rar: "e", label: "Epica", star: 3, col: "#c084fc", border: "#a855f7", title: "Fuoriclasse Accreditato", baseAt: 86, baseDf: 78, baseTe: 88 };
    if (score >= 3) return { rar: "r", label: "Rara", star: 2, col: "#38bdf8", border: "#0284c7", title: "Promessa del Golfo", baseAt: 80, baseDf: 72, baseTe: 82 };
    return { rar: "c", label: "Comune", star: 1, col: "#94a3b8", border: "#64748b", title: "Talento Emergente", baseAt: 74, baseDf: 68, baseTe: 76 };
  }

  function getHeroStats(h, tier) {
    const t = tier || getHeroTier();
    let at = t.baseAt, df = t.baseDf, te = t.baseTe;
    const rKey = h.role || "A";
    const r = RUOLI[rKey] || RUOLI.A;
    at += (r.bias.tiro || 0) * 2;
    df += (r.bias.contr || 0) * 2;
    te += (r.bias.pass || 0) + (r.bias.drib || 0);

    // Tiro speciale bias
    const H_SHOTS = (window.__borgoApi && window.__borgoApi.H_SHOTS) || {};
    const st = H_SHOTS[h.shot];
    if (st && st.bias) {
      at += (st.bias.tiro || 0);
      df += (st.bias.contr || 0);
      te += (st.bias.drib || 0) + (st.bias.pass || 0);
    }
    return {
      at: Math.max(50, Math.min(99, at)),
      df: Math.max(45, Math.min(99, df)),
      te: Math.max(50, Math.min(99, te)),
      role: rKey === "W" ? "A" : rKey
    };
  }

  // Costruttore Campione con tutti i nuovi campi
  function completeHero(raw) {
    const def = {
      v: 1,
      name: "Luca",
      nick: "La Saetta",
      num: 9,
      style: "spiky",
      hair: "#2b1d14",
      eye: "#2a1a0a",
      skin: "#f2c9a0",
      shirt: "#ff4d5a",
      shirt2: "#1f5fbf",
      pattern: "unita",
      armband: "#ffd23f",
      role: "A",
      foot: "dx",
      acc: "none",
      face: "",
      beard: "",
      scar: "",
      streak: "",
      band: "",
      cel: "corsa",
      shot: "saetta",
      shotName: "SAETTA DI LUCA",
      trail: "fuoco",
      quote: FRASE_DEFAULT
    };
    return { ...def, ...(raw || {}) };
  }

  // Sincronizza i dati globali per game.js e gli altri moduli
  function syncGlobalHero(h) {
    if (!h) return;
    writeJSON(HERO_KEY, h);
    if (typeof window.heroCast === "function") {
      window.heroCast(h);
    } else if (window.__borgoApi && typeof window.__borgoApi.heroCast === "function") {
      window.__borgoApi.heroCast(h);
    }
    // Sincronizza CAST.hero
    const CAST = (window.__borgoApi && window.__borgoApi.CAST) || window.CAST;
    if (CAST) {
      CAST.hero = {
        name: h.name,
        tag: h.nick ? `«${h.nick}»` : "",
        hair: h.hair,
        style: h.style,
        skin: h.skin,
        eye: h.eye || "#2a1a0a",
        bg: [h.shirt, h.shirt2 || "#ffd23f"],
        shirt: h.shirt,
        shirt2: h.shirt2,
        pattern: h.pattern,
        armband: h.armband,
        role: h.role,
        foot: h.foot,
        num: String(h.num),
        face: h.face || "",
        acc: h.acc,
        beard: h.beard || undefined,
        scar: h.scar || undefined,
        streak: h.streak || undefined,
        band: h.band || undefined,
        nick: h.nick || undefined,
        quote: h.quote || FRASE_DEFAULT,
        trail: h.trail || "fuoco"
      };
    }
    // Sincronizza supers.js per il tiro nel calcio d'azione
    if (window.__supers && window.__supers.SUP) {
      const sc = SCIE[h.trail] || SCIE.fuoco;
      window.__supers.SUP.hero = [sc.fx, h.shotName || "Tiro del Campione"];
    }
  }

  // Interfaccia Spogliatoio Visuale
  let SPOG = null;

  function openSpogliatoio(back) {
    if (typeof window.hairUnlocks === "function") window.hairUnlocks();
    const rawH = readJSON(HERO_KEY, null);
    const hero = completeHero(rawH);
    const presets = readJSON(PRESETS_KEY, [
      { name: "Look Casa", hero: { ...hero } },
      { name: "Look Trasferta", hero: { ...hero, shirt: hero.shirt2 || "#1f5fbf", shirt2: hero.shirt, pattern: "strisce" } },
      { name: "Look Notturno", hero: { ...hero, shirt: "#18181b", shirt2: "#38bdf8", pattern: "banda", trail: "ombra" } }
    ]);

    SPOG = {
      h: hero,
      presets,
      activePreset: 0,
      tab: "identita", // identita, aspetto, divisa, tiro, guardaroba, carta
      back: back || window.title || (() => {}),
      animDir: 0,
      animFrame: 0,
      animTimer: null,
      previewMode: "walk" // walk, cel
    };

    syncGlobalHero(SPOG.h);
    injectCss();
    renderSpogliatoio();
    startPreviewLoop();
  }

  function injectCss() {
    if (document.getElementById("spogCss")) return;
    const st = document.createElement("style");
    st.id = "spogCss";
    st.textContent = `
      .spogOverlay { position: fixed; inset: 0; z-index: 320; background: #0c0a14; color: #f4f0e4; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; overflow: hidden; }
      .spogTopBar { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: #141024; border-bottom: 1px solid #2e2648; flex-shrink: 0; }
      .spogTopBar h2 { margin: 0; font-size: 19px; font-weight: 900; color: #ffd23f; display: flex; align-items: center; gap: 8px; letter-spacing: 0.3px; }
      .spogTopBar .closeBtn { background: #231b3c; border: 1px solid #44356a; color: #f4f0e4; padding: 6px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; transition: background .15s; }
      .spogTopBar .closeBtn:hover { background: #352a5a; color: #ffd23f; }
      
      .spogContent { display: flex; flex: 1; overflow: hidden; }
      @media (max-width: 820px) { .spogContent { flex-direction: column; overflow-y: auto; min-height: 0; -webkit-overflow-scrolling: touch; } }

      /* COLONNA SINISTRA: ANTEPRIMA LIVE */
      .spogLeftCol { width: 330px; flex-shrink: 0; background: #100d1e; border-right: 1px solid #241d38; padding: 16px; display: flex; flex-direction: column; gap: 14px; align-items: center; overflow-y: auto; }
      @media (max-width: 820px) { .spogLeftCol { width: 100%; border-right: none; border-bottom: 1px solid #241d38; } }

      .spogCardPreviewBox { background: #19142b; border: 1px solid #3a2e58; border-radius: 14px; padding: 12px; width: 100%; box-sizing: border-box; text-align: center; box-shadow: 0 4px 18px rgba(0,0,0,.4); }
      .spogCanvasWrap { display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 10px; }
      .spogPortraitCanvas { border-radius: 12px; border: 2px solid #ffd23f; background: #000; box-shadow: 0 0 12px rgba(255,210,63,.25); }
      .spogSpriteCanvas { border-radius: 12px; border: 1px solid #473a6a; background: #1f5028; background-image: repeating-linear-gradient(0deg, #1f5028, #1f5028 10px, #23582d 10px, #23582d 20px); }

      .spogHeroBadge { font-size: 15px; font-weight: 900; color: #fff; margin-bottom: 2px; }
      .spogHeroSub { font-size: 12px; color: #c0b8d8; margin-bottom: 8px; }
      .spogTierPill { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid currentColor; margin-bottom: 6px; }

      .spogMiniStats { display: flex; justify-content: space-around; background: #0e0b18; border-radius: 8px; padding: 6px 4px; margin-top: 6px; font-size: 12px; font-weight: 800; }
      .spogMiniStats span { color: #ffd23f; }

      /* PRESETS BAR */
      .spogPresetBar { width: 100%; display: flex; flex-direction: column; gap: 6px; background: #161226; border: 1px solid #2f254c; border-radius: 10px; padding: 8px; box-sizing: border-box; }
      .spogPresetHeader { display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 800; color: #a99dc4; text-transform: uppercase; }
      .spogPresetBtns { display: flex; gap: 6px; }
      .spogPresetBtn { flex: 1; padding: 6px 4px; border-radius: 6px; background: #221b36; border: 1px solid #3c305c; color: #ddd; font-size: 11px; font-weight: 700; cursor: pointer; text-align: center; transition: all .15s; }
      .spogPresetBtn.active { background: #ffd23f; color: #111; border-color: #ffd23f; box-shadow: 0 0 8px rgba(255,210,63,.4); }

      /* COLONNA DESTRA: TABS & CONTROLLI */
      .spogRightCol { flex: 1; display: flex; flex-direction: column; background: #0e0b18; overflow: hidden; }
      .spogTabs { display: flex; overflow-x: auto; background: #141024; border-bottom: 1px solid #2b2344; flex-shrink: 0; padding: 0 8px; }
      .spogTab { padding: 12px 16px; border: none; background: transparent; color: #9f93bf; font-size: 13px; font-weight: 800; cursor: pointer; border-bottom: 3px solid transparent; white-space: nowrap; transition: color .15s, border-color .15s; display: flex; align-items: center; gap: 6px; }
      .spogTab:hover { color: #f4f0e4; }
      .spogTab.active { color: #ffd23f; border-bottom-color: #ffd23f; }

      .spogTabBody { flex: 1; overflow-y: auto; padding: 20px; box-sizing: border-box; }
      .spogSticky { flex-shrink: 0; }
      .spogMini { display: none; }

      /* FORM SEZIONI & CONTROLLI */
      .spogSecTitle { font-size: 14px; font-weight: 800; color: #c4b5fd; text-transform: uppercase; letter-spacing: 0.5px; margin: 16px 0 10px; border-bottom: 1px solid #261f3a; padding-bottom: 4px; }
      .spogSecTitle:first-child { margin-top: 0; }
      .spogGrid2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
      .spogGrid3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
      .spogFieldGroup { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
      .spogLabel { font-size: 12px; font-weight: 700; color: #b7abd2; }
      .spogInput { background: #181328; border: 1px solid #3a2e58; border-radius: 8px; padding: 8px 12px; color: #fff; font-size: 14px; font-weight: 600; outline: none; transition: border-color .15s; }
      .spogInput:focus { border-color: #ffd23f; }

      /* CHIP SELEZIONABILI */
      .spogChipGrid { display: flex; flex-wrap: wrap; gap: 6px; }
      .spogChip { background: #19142b; border: 1px solid #352b52; border-radius: 8px; padding: 6px 12px; color: #d0c8e4; font-size: 12px; font-weight: 700; cursor: pointer; transition: all .15s; display: inline-flex; align-items: center; gap: 6px; }
      .spogChip:hover { background: #251e3e; border-color: #55447c; color: #fff; }
      .spogChip.active { background: #ffd23f; color: #111; border-color: #ffd23f; font-weight: 800; box-shadow: 0 0 6px rgba(255,210,63,.3); }

      /* COLOR PICKER PALETTE RAPIDA */
      .spogColorRow { display: flex; flex-wrap: wrap; gap: 8px; margin: 6px 0; }
      .spogColorDot { width: 32px; height: 32px; border-radius: 8px; border: 2px solid #332750; cursor: pointer; transition: transform .1s, border-color .1s; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #fff; box-sizing: border-box; }
      .spogColorDot:hover { transform: scale(1.1); }
      .spogColorDot.active { border-color: #ffd23f; box-shadow: 0 0 8px rgba(255,210,63,.5); }

      /* CARTA SCHIERATA */
      .spogHeroCardBox { background: radial-gradient(circle at 50% 30%, #20173e 0%, #0d091a 100%); border: 2px solid #ffd23f; border-radius: 16px; padding: 16px; max-width: 380px; margin: 0 auto; box-shadow: 0 8px 30px rgba(0,0,0,.6); text-align: center; }
      
      /* FOOTER CONFERMA */
      .spogFooter { padding: 12px 20px; background: #141024; border-top: 1px solid #2b2344; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
      .spogSaveBtn { background: linear-gradient(135deg, #ffd23f 0%, #f59e0b 100%); border: none; border-radius: 10px; color: #111; padding: 10px 22px; font-size: 14px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 14px rgba(245,158,11,.35); transition: transform .1s; }
      .spogSaveBtn:hover { transform: translateY(-1px); }
      .spogDiscardBtn { background: transparent; border: 1px solid #44356a; border-radius: 8px; color: #b7abd2; padding: 8px 16px; font-size: 13px; font-weight: 700; cursor: pointer; }
      .spogDiscardBtn:hover { background: #221b36; color: #fff; }
      @media (max-width: 820px) {
        .spogLeftCol { overflow: visible; flex-shrink: 0; }
        .spogRightCol { flex: none; overflow: visible; }
        .spogSticky { position: sticky; top: 0; z-index: 2; background: #141024; }
        .spogMini { display: none; position: absolute; top: 100%; left: 0; right: 0; align-items: center; gap: 8px; padding: 6px 12px; background: #141024; border-bottom: 1px solid #2b2344; box-shadow: 0 6px 12px rgba(0,0,0,.4); }
        .spogMini.on { display: flex; }
        .spogMini canvas { width: 64px; height: 64px; border-radius: 10px; border: 1px solid #473a6a; background: #000; }
        .spogMini canvas + canvas { background: #1f5028; }
        .spogMini span { font-size: 13px; font-weight: 800; color: #ffd23f; }
        .spogTabBody { flex: none; overflow: visible; padding: 14px 14px 90px; }
        .spogFooter { position: fixed; left: 0; right: 0; bottom: 0; z-index: 3; padding: 10px 12px calc(10px + env(safe-area-inset-bottom)); gap: 10px; }
        .spogSaveBtn { flex: 1; padding: 10px 12px; font-size: 13px; }
      }
    `;
    document.body.appendChild(st);
  }

  function startPreviewLoop() {
    if (SPOG.animTimer) clearInterval(SPOG.animTimer);
    SPOG.animTimer = setInterval(() => {
      SPOG.animFrame++;
      if (SPOG.animFrame % 60 === 0) {
        SPOG.animDir = (SPOG.animDir + 1) % 4;
      }
      drawLivePreviews();
    }, 1000 / 30);
  }

  function stopPreviewLoop() {
    if (SPOG.animTimer) {
      clearInterval(SPOG.animTimer);
      SPOG.animTimer = null;
    }
  }

  function drawLivePreviews() {
    const pCanvas = document.getElementById("spogPortraitCanvas");
    const sCanvas = document.getElementById("spogSpriteCanvas");
    if (!pCanvas || !sCanvas || !SPOG) return;

    // Disegna Ritratto HD (96x96)
    const pctx = pCanvas.getContext("2d");
    pctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    const api = window.__borgoApi;
    if (api && typeof api.portraitTo === "function" && api.CAST && api.CAST.hero) {
      api.portraitTo(pctx, "hero", 48, 50, 0.72);
    } else {
      // Fallback semplice
      pctx.fillStyle = SPOG.h.shirt || "#ff4d5a";
      pctx.fillRect(0, 0, pCanvas.width, pCanvas.height);
    }

    // Disegna Sprite Campo (96x96)
    const sctx = sCanvas.getContext("2d");
    sctx.clearRect(0, 0, sCanvas.width, sCanvas.height);
    // esultanza di prova: ~3 secondi di animazione nel riquadro dello sprite
    const celT = SPOG.celStart ? (SPOG.animFrame - SPOG.celStart) / 30 : -1;
    const celOn = celT >= 0 && celT < 3.2;
    if (!celOn && SPOG.celStart) SPOG.celStart = 0;
    const dirNames = ["down", "left", "up", "right"];
    let curDir = dirNames[SPOG.animDir], ph = SPOG.animFrame / 5, tx = 48, ty = 64, rot = 0, sc = 2.4;
    if (celOn) {
      const k = SPOG.h.cel || "corsa", t = celT;
      curDir = "down"; ph = 0;
      if (k === "corsa") { curDir = t < 1.6 ? "right" : "left"; ph = SPOG.animFrame / 2; tx = 48 + Math.sin(t * 2) * 26; }
      else if (k === "salto") { ty = 64 - Math.abs(Math.sin(t * 3.2)) * 30; }
      else if (k === "ginocchia") { curDir = "right"; tx = Math.min(70, 14 + t * 40); rot = 0.35; ty = 70; }
      else if (k === "aeroplano") { ph = SPOG.animFrame / 3; tx = 48 + Math.sin(t * 2.4) * 22; rot = Math.cos(t * 2.4) * 0.35; curDir = Math.cos(t * 2.4) > 0 ? "right" : "left"; }
      else if (k === "capriola") { ty = 56 - Math.sin(Math.min(1, t / 1.2) * Math.PI) * 18; rot = Math.min(1, t / 1.2) * Math.PI * 2; }
      else if (k === "trenino") { ph = SPOG.animFrame / 3; curDir = "right"; tx = ((t * 40) % 120) - 12; }
      else { ty = 64 + Math.sin(t * 6) * 2; }
    }
    if (celOn) {
      sctx.fillStyle = "rgba(255,210,63,.18)"; sctx.fillRect(0, 0, 96, 96);
      for (let i = 0; i < 14; i++) { const cx = (i * 37 + 11) % 96, cy = ((i * 23 + SPOG.animFrame * (1 + i % 3)) % 110) - 10; sctx.fillStyle = ["#ffd23f", "#ff4d5a", "#38bdf8", "#10b981"][i % 4]; sctx.fillRect(cx, cy, 3, 3); }
      sctx.fillStyle = "#fff"; sctx.font = "900 16px system-ui, sans-serif"; sctx.textAlign = "center"; sctx.fillText("GOL!", 48, 91); sctx.textAlign = "left";
    }
    sctx.save();
    sctx.translate(tx, ty);
    if (rot) { sctx.translate(0, -12 * sc); sctx.rotate(rot); sctx.translate(0, 12 * sc); }
    sctx.scale(sc, sc);

    // Usa chibi globale di game.js
    if (api && typeof api.chibiTo === "function" && api.CAST && api.CAST.hero) {
      api.chibiTo(sctx, 0, 0, { ...api.CAST.hero }, curDir, ph);
    } else if (typeof window.chibi === "function" && api && api.CAST && api.CAST.hero) {
      // Configurazione sprite con pattern
      const heroSpec = { ...api.CAST.hero };
      window.chibi(0, 0, heroSpec, curDir, ph);
    } else if (api && typeof api.chibi === "function") {
      api.chibi(0, 0, api.CAST.hero, curDir, ph);
    }
    sctx.restore();
    if (celOn && ["orecchio", "bacio", "trenino"].includes(SPOG.h.cel)) {
      sctx.font = "18px sans-serif"; sctx.textAlign = "center";
      sctx.fillText({ orecchio: "👂", bacio: "😘", trenino: "🚂" }[SPOG.h.cel], SPOG.h.cel === "trenino" ? Math.max(10, tx - 22) : 72, 40); sctx.textAlign = "left";
    }
    // anteprima piccola fissa in alto (telefono), visibile quando quella grande esce dallo schermo
    const mini = document.getElementById("spogMini");
    if (mini) {
      const cont = document.querySelector(".spogContent"), left = document.querySelector(".spogLeftCol");
      const show = !!(cont && left && window.innerWidth <= 820 && cont.scrollTop > left.offsetHeight - 120);
      mini.classList.toggle("on", show); SPOG.miniOn = show;
      if (show) {
        [["spogMiniP", pCanvas], ["spogMiniS", sCanvas]].forEach(([id, src]) => { const m = document.getElementById(id); if (m) { const mc = m.getContext("2d"); mc.clearRect(0, 0, 96, 96); mc.drawImage(src, 0, 0); } });
        const nm = document.getElementById("spogMiniName"); if (nm && nm.textContent !== SPOG.h.name) nm.textContent = SPOG.h.name;
      }
    }
  }

  function renderSpogliatoio() {
    let ov = document.getElementById("spogOverlay");
    if (!ov) {
      ov = document.createElement("div");
      ov.id = "spogOverlay";
      ov.className = "spogOverlay";
      document.body.appendChild(ov);
    }

    const keepScroll = [".spogContent", ".spogTabBody", ".spogLeftCol"].map((q) => { const el = ov.querySelector(q); return [q, el ? el.scrollTop : 0]; });
    const h = SPOG.h;
    const tier = getHeroTier();
    const stats = getHeroStats(h, tier);
    const rKey = h.role || "A";
    const curRuolo = RUOLI[rKey] || RUOLI.A;

    ov.innerHTML = `
      <div class="spogTopBar">
        <h2>🧑 Spogliatoio Ufficiale del Campione</h2>
        <div style="display:flex;gap:8px">
          <button type="button" class="closeBtn" id="spogCloseBtn">Esci</button>
        </div>
      </div>

      <div class="spogContent">
        <!-- COLONNA SINISTRA: ANTEPRIMA -->
        <div class="spogLeftCol">
          <div class="spogCardPreviewBox">
            <div class="spogCanvasWrap">
              <div>
                <canvas id="spogPortraitCanvas" class="spogPortraitCanvas" width="96" height="96"></canvas>
                <div style="font-size:10px;color:#a99dc4;margin-top:3px">Ritratto HD</div>
              </div>
              <div>
                <canvas id="spogSpriteCanvas" class="spogSpriteCanvas" width="96" height="96"></canvas>
                <div style="font-size:10px;color:#a99dc4;margin-top:3px">Sprite Campo</div>
              </div>
            </div>

            <div class="spogHeroBadge">${esc(h.name)} ${h.nick ? `«${esc(h.nick)}»` : ""}</div>
            <div class="spogHeroSub">N. ${h.num} · ${curRuolo.icon} ${curRuolo.name}</div>
            
            <div>
              <span class="spogTierPill" style="color:${tier.col}">
                ★ ${tier.label} · ${tier.title}
              </span>
            </div>

            <div class="spogMiniStats">
              <div>ATK <span>${stats.at}</span></div>
              <div>DIF <span>${stats.df}</span></div>
              <div>TEC <span>${stats.te}</span></div>
            </div>

            <div style="margin-top:10px">
              <button type="button" class="spogPresetBtn" id="spogTestGoalBtn" style="width:100%;background:#2a1f48;border-color:#533e84;color:#ffd23f">
                🎉 Prova Esultanza Gol
              </button>
            </div>
          </div>

          <!-- GESTIONE PRESET LOOK -->
          <div class="spogPresetBar">
            <div class="spogPresetHeader">
              <span>Slot Preset Look</span>
              <span style="color:#ffd23f">#${SPOG.activePreset + 1}</span>
            </div>
            <div class="spogPresetBtns">
              ${SPOG.presets.map((p, i) => `
                <button type="button" class="spogPresetBtn ${i === SPOG.activePreset ? "active" : ""}" data-preset-idx="${i}">
                  ${esc(p.name || `Look ${i + 1}`)}
                </button>
              `).join("")}
            </div>
            <div style="display:flex;gap:4px;margin-top:4px">
              <button type="button" class="spogPresetBtn" id="spogSaveToPresetBtn" style="font-size:10px">💾 Salva su questo Slot</button>
            </div>
          </div>

          <div style="font-size:11px;color:#8d81a8;text-align:center;line-height:1.4">
            Il Campione scende in campo al posto di Leo in <b>Carriera</b>, <b>Rigori</b>, <b>Borgo</b>, <b>Squadra dei Sogni</b> e <b>Arena</b>!
          </div>
        </div>

        <!-- COLONNA DESTRA: TABS & OPZIONI -->
        <div class="spogRightCol">
          <div class="spogSticky">
          <div class="spogMini${SPOG.miniOn ? " on" : ""}" id="spogMini"><canvas id="spogMiniP" width="96" height="96"></canvas><canvas id="spogMiniS" width="96" height="96"></canvas><span id="spogMiniName"></span></div>
          <div class="spogTabs">
            <button type="button" class="spogTab ${SPOG.tab === "identita" ? "active" : ""}" data-tab="identita">📋 Identità & Tattica</button>
            <button type="button" class="spogTab ${SPOG.tab === "aspetto" ? "active" : ""}" data-tab="aspetto">💇 Aspetto & Volto</button>
            <button type="button" class="spogTab ${SPOG.tab === "divisa" ? "active" : ""}" data-tab="divisa">👕 Divisa & Fantasia</button>
            <button type="button" class="spogTab ${SPOG.tab === "tiro" ? "active" : ""}" data-tab="tiro">⚡ Laboratorio Tiro</button>
            <button type="button" class="spogTab ${SPOG.tab === "guardaroba" ? "active" : ""}" data-tab="guardaroba">🏆 Guardaroba & Saghe</button>
            <button type="button" class="spogTab ${SPOG.tab === "carta" ? "active" : ""}" data-tab="carta">🃏 Carta Eroe</button>
          </div>

          </div>
          <div class="spogTabBody" id="spogTabBody">
            ${renderCurrentTabContent()}
          </div>

          <div class="spogFooter">
            <button type="button" class="spogDiscardBtn" id="spogResetBtn">Ripristina</button>
            <button type="button" class="spogSaveBtn" id="spogConfirmBtn">✓ Salva Campione ed Entra in Campo</button>
          </div>
        </div>
      </div>
    `;

    keepScroll.forEach(([q, y]) => { const el = ov.querySelector(q); if (el && y) el.scrollTop = y; });
    bindEventListeners();
    drawLivePreviews();
  }

  function renderCurrentTabContent() {
    const h = SPOG.h;
    switch (SPOG.tab) {
      case "identita":
        return renderTabIdentita(h);
      case "aspetto":
        return renderTabAspetto(h);
      case "divisa":
        return renderTabDivisa(h);
      case "tiro":
        return renderTabTiro(h);
      case "guardaroba":
        return renderTabGuardaroba(h);
      case "carta":
        return renderTabCarta(h);
      default:
        return "";
    }
  }

  function renderTabIdentita(h) {
    return `
      <div class="spogSecTitle">Dati Personali</div>
      <div class="spogGrid2">
        <div class="spogFieldGroup">
          <label class="spogLabel" for="spogInpName">Nome di Battesimo</label>
          <input type="text" id="spogInpName" class="spogInput" maxlength="14" value="${esc(h.name)}">
        </div>
        <div class="spogFieldGroup">
          <label class="spogLabel" for="spogInpNick">Soprannome Curva / Grido del Borgo</label>
          <input type="text" id="spogInpNick" class="spogInput" maxlength="16" placeholder="Es. La Saetta, Il Falco..." value="${esc(h.nick || "")}">
        </div>
      </div>

      <div class="spogSecTitle">Numero di Maglia</div>
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
        <input type="number" id="spogInpNum" class="spogInput" min="1" max="99" style="width:80px;font-size:18px;text-align:center" value="${h.num}">
        <div class="spogChipGrid">
          ${[7, 9, 10, 11, 23, 99].map((n) => `
            <button type="button" class="spogChip ${h.num === n ? "active" : ""}" data-quick-num="${n}">N. ${n}</button>
          `).join("")}
        </div>
      </div>

      <div class="spogSecTitle">Ruolo Tattico sul Prato</div>
      <div class="spogGrid2">
        ${Object.values(RUOLI).map((r) => `
          <div class="spogCardPreviewBox ${h.role === r.id ? "active" : ""}" data-role-id="${r.id}" style="cursor:pointer;text-align:left;border-color:${h.role === r.id ? "#ffd23f" : "#30264d"};background:${h.role === r.id ? "#231a3d" : "#141022"}">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-weight:900;color:${h.role === r.id ? "#ffd23f" : "#fff"};font-size:14px">${r.icon} ${r.name}</span>
              ${h.role === r.id ? `<span style="font-size:11px;color:#ffd23f">✓ ATTIVO</span>` : ""}
            </div>
            <div style="font-size:12px;color:#b2a6cc">${r.desc}</div>
          </div>
        `).join("")}
      </div>

      <div class="spogSecTitle">Piede Naturale</div>
      <div class="spogChipGrid">
        ${Object.values(PIEDI).map((f) => `
          <button type="button" class="spogChip ${h.foot === f.id ? "active" : ""}" data-foot-id="${f.id}">
            🦶 ${f.label} (${f.sub})
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderTabAspetto(h) {
    const H_STYLES = (window.__borgoApi && window.__borgoApi.H_STYLES) || { spiky: "Spettinati", messy: "Ribelli", buzz: "Rasati", slick: "Tirati indietro", long: "Lunghi", bun: "Chignon" };
    const H_HAIR = { "#2b1d14": "Castano", "#111111": "Nero", "#e8d08a": "Biondo", "#b8452a": "Rosso", "#9a9a9a": "Grigio", "#ffffff": "Bianco", "#38bdf8": "Azzurro", "#10b981": "Smeraldo" };
    const H_EYE = { "#2a1a0a": "Castano", "#5a3818": "Nocciola", "#2563eb": "Azzurro", "#16a34a": "Smeraldo", "#d97706": "Ambra", "#9333ea": "Viola", "#111827": "Nero" };
    const H_SKIN = ["#f5d6b8", "#f2c9a0", "#e0ac7e", "#b9804f", "#8a5a3a"];

    return `
      <div class="spogSecTitle">Forma del Viso & Espressione</div>
      <div class="spogChipGrid">
        <button type="button" class="spogChip ${!h.face ? "active" : ""}" data-set-face="">Volto 1 (Classico)</button>
        ${[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => `
          <button type="button" class="spogChip ${h.face === "v" + n ? "active" : ""}" data-set-face="v${n}">Volto ${n}</button>
        `).join("")}
      </div>

      <div class="spogSecTitle">Carnagione / Tonalità Pelle</div>
      <div class="spogColorRow">
        ${H_SKIN.map((c, i) => `
          <div class="spogColorDot ${h.skin === c ? "active" : ""}" data-set-skin="${c}" style="background:${c}" title="Tono ${i + 1}"></div>
        `).join("")}
      </div>

      <div class="spogSecTitle">Colore degli Occhi</div>
      <div class="spogColorRow">
        ${Object.entries(H_EYE).map(([c, lbl]) => `
          <div class="spogColorDot ${h.eye === c ? "active" : ""}" data-set-eye="${c}" style="background:${c}" title="${lbl}"></div>
        `).join("")}
      </div>

      <div class="spogSecTitle">Taglio di Capelli</div>
      <div class="spogChipGrid">
        ${Object.entries(H_STYLES).slice(0, 14).map(([k, lbl]) => `
          <button type="button" class="spogChip ${h.style === k ? "active" : ""}" data-set-style="${k}">${lbl}</button>
        `).join("")}
      </div>

      <div class="spogSecTitle">Colore dei Capelli</div>
      <div class="spogColorRow">
        ${Object.entries(H_HAIR).map(([c, lbl]) => `
          <div class="spogColorDot ${h.hair === c ? "active" : ""}" data-set-hair="${c}" style="background:${c}" title="${lbl}"></div>
        `).join("")}
      </div>

      <div class="spogSecTitle">Tratti Speciali & Dettagli</div>
      <div class="spogGrid3">
        <div class="spogFieldGroup">
          <label class="spogLabel">Barba & Baffi</label>
          <div class="spogChipGrid">
            ${[["", "Nessuna"], ["incolta", "Incolta"], ["folta", "Folta"], ["pizzetto", "Pizzetto"], ["baffi", "Baffi"]].map(([k, lbl]) => `
              <button type="button" class="spogChip ${h.beard === k ? "active" : ""}" data-set-beard="${k}">${lbl}</button>
            `).join("")}
          </div>
        </div>
        <div class="spogFieldGroup">
          <label class="spogLabel">Segni Particolari</label>
          <div class="spogChipGrid">
            <button type="button" class="spogChip ${!h.scar ? "active" : ""}" data-set-scar="">Nessuno</button>
            <button type="button" class="spogChip ${h.scar === "1" ? "active" : ""}" data-set-scar="1">Cicatrice Sopracciglio</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderTabDivisa(h) {
    const H_SHIRTS = { "#ff4d5a": "Rosso Rondine", "#1f5fbf": "Blu Riviera", "#f2f2f2": "Bianco Mare", "#1e9e4a": "Verde Collina", "#ffd23f": "Oro Faro", "#111111": "Nero Falesia", "#a855f7": "Viola Tramonto", "#ea580c": "Arancio Scoglio" };
    const ARMBANDS = { "#ffd23f": "Oro", "#ff4d5a": "Rossa", "#1f5fbf": "Blu", "#f2f2f2": "Bianca", "#111111": "Nera" };

    return `
      <div class="spogSecTitle">Colore Maglia</div>
      <div class="spogColorRow">
        ${Object.entries(H_SHIRTS).map(([c, lbl]) => `
          <div class="spogColorDot ${h.shirt === c ? "active" : ""}" data-set-shirt="${c}" style="background:${c}" title="${lbl}"></div>
        `).join("")}
      </div>

      <div class="spogSecTitle">Secondo Colore (strisce, banda, maniche)</div>
      <div style="font-size:11px;color:#8d81a8;margin:-4px 0 4px">Si vede solo con una fantasia diversa da Tinta Unita.</div>
      <div class="spogColorRow">
        ${Object.entries(H_SHIRTS).map(([c, lbl]) => `
          <div class="spogColorDot ${h.shirt2 === c ? "active" : ""}" data-set-shirt2="${c}" style="background:${c}" title="${lbl}"></div>
        `).join("")}
      </div>

      <div class="spogSecTitle">Fantasia & Motivo della Divisa</div>
      <div class="spogGrid2">
        ${Object.values(FANTASIE).map((f) => `
          <div class="spogCardPreviewBox ${h.pattern === f.id ? "active" : ""}" data-set-pattern="${f.id}" style="cursor:pointer;text-align:left;border-color:${h.pattern === f.id ? "#ffd23f" : "#30264d"};background:${h.pattern === f.id ? "#231a3d" : "#141022"}">
            <div style="font-weight:800;color:${h.pattern === f.id ? "#ffd23f" : "#fff"}">${f.label}</div>
            <div style="font-size:12px;color:#a99dc4">${f.sub}</div>
          </div>
        `).join("")}
      </div>

      <div class="spogSecTitle">Fascia da Capitano</div>
      <div class="spogColorRow">
        ${Object.entries(ARMBANDS).map(([c, lbl]) => `
          <div class="spogColorDot ${h.armband === c ? "active" : ""}" data-set-armband="${c}" style="background:${c}" title="${lbl}"></div>
        `).join("")}
      </div>

      <div class="spogSecTitle">Esultanza al Gol</div>
      <div class="spogChipGrid">
        ${[["corsa", "Corsa alla bandierina"], ["salto", "Salto nel cielo"], ["ginocchia", "Scivolata in ginocchio"], ["aeroplano", "L'Aeroplano"], ["capriola", "Capriola acrobatica"], ["orecchio", "Mano all'orecchio"], ["trenino", "Il Trenino col gruppo"], ["bacio", "Bacio allo stemma"]].map(([k, lbl]) => `
          <button type="button" class="spogChip ${h.cel === k ? "active" : ""}" data-set-cel="${k}">🎉 ${lbl}</button>
        `).join("")}
      </div>
    `;
  }

  function renderTabTiro(h) {
    const H_SHOTS = (window.__borgoApi && window.__borgoApi.H_SHOTS) || {};
    return `
      <div class="spogSecTitle">Archetipo Balistico del Tiro Speciale</div>
      <div class="spogGrid2">
        ${Object.entries(H_SHOTS).slice(0, 8).map(([k, s]) => `
          <div class="spogCardPreviewBox ${h.shot === k ? "active" : ""}" data-set-shot="${k}" style="cursor:pointer;text-align:left;border-color:${h.shot === k ? "#ffd23f" : "#30264d"};background:${h.shot === k ? "#231a3d" : "#141022"}">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-weight:900;color:${h.shot === k ? "#ffd23f" : "#fff"}">⚽ ${s.label}</span>
              ${h.shot === k ? `<span style="font-size:11px;color:#ffd23f">✓ SCELTO</span>` : ""}
            </div>
            <div style="font-size:12px;color:#b2a6cc;margin-top:3px">${s.sub}</div>
          </div>
        `).join("")}
      </div>

      <div class="spogSecTitle">Nome Personalizzato del Super Tiro</div>
      <div class="spogFieldGroup">
        <label class="spogLabel" for="spogInpShotName">Nome che appare sul tabellone durante la conclusione</label>
        <input type="text" id="spogInpShotName" class="spogInput" maxlength="24" value="${esc(h.shotName || "")}">
      </div>

      <div class="spogSecTitle">Scia & Effetto Energetico sulla Palla</div>
      <div class="spogGrid2">
        ${Object.values(SCIE).map((sc) => `
          <div class="spogCardPreviewBox ${h.trail === sc.id ? "active" : ""}" data-set-trail="${sc.id}" style="cursor:pointer;text-align:left;border-color:${h.trail === sc.id ? "#ffd23f" : "#30264d"};background:${h.trail === sc.id ? "#231a3d" : "#141022"}">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="display:inline-block;width:16px;height:16px;border-radius:4px;background:linear-gradient(45deg, ${sc.c1}, ${sc.c2})"></span>
              <span style="font-weight:800;color:${h.trail === sc.id ? "#ffd23f" : "#fff"}">${sc.label}</span>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="spogSecTitle">Frase Gridata nel Cut-In Cinematografico</div>
      <div class="spogFieldGroup">
        <label class="spogLabel" for="spogInpQuote">La battuta gridata a schermo prima del rilascio</label>
        <input type="text" id="spogInpQuote" class="spogInput" maxlength="50" placeholder="Es. Questa la dedico al molo!" value="${esc(h.quote || FRASE_DEFAULT)}">
      </div>
    `;
  }

  function renderTabGuardaroba(h) {
    const COSM = (window.__borgoApi && window.__borgoApi.COSM) || {};
    const api = window.__borgoApi;
    let ownSet = null; try { ownSet = api && api.cosOwned ? new Set(api.cosOwned()) : null; } catch (e) { ownSet = null; } // stesso elenco del Guardaroba: __borgoApi non espone borgoLoad, prima ogni capo non-storia risultava bloccato
    const isOwned = (k) => {
      const c = COSM[k];
      if (!c) return false;
      if (ownSet) return ownSet.has(k);
      if (c.story) return c.story();
      const b = (api && api.borgoLoad) ? api.borgoLoad() : null;
      return b && b.cos && b.cos.includes(k);
    };

    const maglie = Object.entries(COSM).filter(([, c]) => c.kind === "shirt");
    const acconciature = Object.entries(COSM).filter(([, c]) => c.kind === "hair" || c.kind === "hairc");
    const tiri = Object.entries(COSM).filter(([, c]) => c.kind === "shot");
    const acc = Object.entries(COSM).filter(([, c]) => c.kind === "acc");

    const renderList = (items, curVal, onSelectAttr) => `
      <div class="spogGrid2">
        ${items.slice().sort((x, y) => (isOwned(y[0]) ? 1 : 0) - (isOwned(x[0]) ? 1 : 0)).map(([k, c]) => { // sbloccati in cima, poi i bloccati
          const own = isOwned(k);
          const active = curVal === c.val;
          return `
            <div class="spogCardPreviewBox ${active ? "active" : ""}" ${own ? `${onSelectAttr}="${c.val}" style="cursor:pointer;text-align:left;border-color:${active ? "#ffd23f" : "#30264d"};background:${active ? "#231a3d" : "#141022"}"` : `style="text-align:left;opacity:.55;border-color:#201833"`}>
              <div style="display:flex;justify-content:space-between">
                <span style="font-weight:800;color:${active ? "#ffd23f" : own ? "#fff" : "#999"}">${c.label}</span>
                <span style="font-size:11px">${own ? (active ? "✓ IN USO" : "✓ SBLOCCATO") : "🔒 BLOCCATO"}</span>
              </div>
              <div style="font-size:11px;color:#a99dc4;margin-top:2px">${c.from || "Gioca le saghe per sbloccarlo"}</div>
            </div>
          `;
        }).join("")}
      </div>
    `;

    return `
      <div class="spogSecTitle">Maglie Speciali delle Saghe · ${maglie.filter(([k]) => isOwned(k)).length}/${maglie.length}</div>
      <div style="font-size:11.5px;color:#a99dc4;margin:-4px 0 8px">Una maglia sbloccata imposta il <b>colore principale</b> della divisa. Fantasia e secondo colore della scheda Divisa restano sopra: se li cambi dopo, vince l'ultima scelta.</div>
      ${renderList(maglie, h.shirt, 'data-equip-shirt')}

      <div class="spogSecTitle">Tagli & Acconciature Sbloccate</div>
      ${renderList(acconciature, h.style, 'data-equip-style')}

      <div class="spogSecTitle">Tiri Segreti Riconosciuti</div>
      ${renderList(tiri, h.shot, 'data-equip-shot')}

      <div class="spogSecTitle">Accessori Storici</div>
      ${renderList(acc, h.acc, 'data-equip-acc')}
    `;
  }

  function renderTabCarta(h) {
    const tier = getHeroTier();
    const stats = getHeroStats(h, tier);
    const rKey = h.role || "A";
    const curRuolo = RUOLI[rKey] || RUOLI.A;

    return `
      <div class="spogSecTitle">La Tua Carta Ufficiale nella Squadra dei Sogni</div>
      <div class="spogHeroCardBox" style="border-color:${tier.border}">
        <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:900;text-transform:uppercase;color:${tier.col};margin-bottom:8px">
          <span>★ ${tier.label}</span>
          <span>${curRuolo.icon} ${curRuolo.name}</span>
        </div>
        
        <div style="width:120px;height:120px;margin:0 auto 12px;border-radius:12px;background:#000;border:2px solid ${tier.col};overflow:hidden;box-shadow:0 0 15px ${tier.col}44">
          <canvas id="spogCardFaceCanvas" width="120" height="120"></canvas>
        </div>

        <div style="font-size:18px;font-weight:900;color:#fff">${esc(h.name)}</div>
        <div style="font-size:12px;color:#c0b8d8;margin-bottom:12px">«${esc(h.nick || "Il Campione del Borgo")}» · N. ${h.num}</div>

        <div style="display:flex;justify-content:space-around;background:#0b0816;border-radius:10px;padding:8px 6px;margin-bottom:12px">
          <div><span style="font-size:10px;color:#8a7ea6">ATTACCO</span><div style="font-size:16px;font-weight:900;color:#ffd23f">${stats.at}</div></div>
          <div><span style="font-size:10px;color:#8a7ea6">DIFESA</span><div style="font-size:16px;font-weight:900;color:#ffd23f">${stats.df}</div></div>
          <div><span style="font-size:10px;color:#8a7ea6">TECNICA</span><div style="font-size:16px;font-weight:900;color:#ffd23f">${stats.te}</div></div>
        </div>

        <div style="font-size:12px;color:#d5cee8;line-height:1.4;margin-bottom:12px;text-align:left;background:#141026;border-radius:8px;padding:8px 10px">
          <b>Frase di Intesa:</b> «${esc(h.quote || FRASE_DEFAULT)}»<br>
          <b>Super Mossa:</b> ⚽ ${esc(h.shotName || "Tiro del Campione")}
        </div>

        <div style="font-size:11px;color:#a89bc4">
          Schierabile immediatamente nella cinquina titolare o in panchina dalla sezione <b>🃏 La Squadra dei Sogni</b>!
        </div>
      </div>
    `;
  }

  function bindEventListeners() {
    const ov = document.getElementById("spogOverlay");
    if (!ov) return;

    // Chiudi
    const closeBtn = document.getElementById("spogCloseBtn");
    if (closeBtn) closeBtn.onclick = closeSpogliatoio;

    // Reset
    const resetBtn = document.getElementById("spogResetBtn");
    if (resetBtn) {
      resetBtn.onclick = () => {
        SPOG.h = completeHero(readJSON(HERO_KEY, null));
        syncGlobalHero(SPOG.h);
        renderSpogliatoio();
      };
    }

    // Conferma
    const confirmBtn = document.getElementById("spogConfirmBtn");
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        syncGlobalHero(SPOG.h);
        if (window.toast) window.toast("Campione salvato con successo!", "info", "⚽");
        closeSpogliatoio();
      };
    }

    // Switch Tabs
    ov.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.onclick = () => {
        SPOG.tab = btn.dataset.tab;
        renderSpogliatoio();
      };
    });

    // Test Esultanza
    const testGoalBtn = document.getElementById("spogTestGoalBtn");
    if (testGoalBtn) {
      testGoalBtn.onclick = () => {
        SPOG.celStart = SPOG.animFrame || 1;
        const cont = document.querySelector(".spogContent"); if (cont && window.innerWidth <= 820) cont.scrollTo({ top: 0, behavior: "smooth" });
      };
    }

    // Preset Switch
    ov.querySelectorAll("[data-preset-idx]").forEach((btn) => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.presetIdx, 10);
        SPOG.activePreset = idx;
        const p = SPOG.presets[idx];
        if (p && p.hero) {
          SPOG.h = { ...p.hero };
          syncGlobalHero(SPOG.h);
          renderSpogliatoio();
        }
      };
    });

    // Salva su Preset Corrente
    const saveToPresetBtn = document.getElementById("spogSaveToPresetBtn");
    if (saveToPresetBtn) {
      saveToPresetBtn.onclick = () => {
        SPOG.presets[SPOG.activePreset] = {
          name: SPOG.presets[SPOG.activePreset].name || `Look ${SPOG.activePreset + 1}`,
          hero: { ...SPOG.h }
        };
        writeJSON(PRESETS_KEY, SPOG.presets);
        if (window.toast) window.toast(`Look salvato nello slot #${SPOG.activePreset + 1}`, "info", "💾");
      };
    }

    // Inputs Text
    const inpName = document.getElementById("spogInpName");
    if (inpName) {
      inpName.oninput = () => {
        SPOG.h.name = inpName.value.trim() || "Campione";
        syncGlobalHero(SPOG.h);
      };
    }
    const inpNick = document.getElementById("spogInpNick");
    if (inpNick) {
      inpNick.oninput = () => {
        SPOG.h.nick = inpNick.value.trim().slice(0, 16);
        syncGlobalHero(SPOG.h);
      };
    }
    const inpNum = document.getElementById("spogInpNum");
    if (inpNum) {
      inpNum.oninput = () => {
        SPOG.h.num = Math.max(1, Math.min(99, parseInt(inpNum.value, 10) || 1));
        syncGlobalHero(SPOG.h);
      };
    }
    const inpShotName = document.getElementById("spogInpShotName");
    if (inpShotName) {
      inpShotName.oninput = () => {
        SPOG.h.shotName = inpShotName.value.trim().toUpperCase() || "TIRO";
        syncGlobalHero(SPOG.h);
      };
    }
    const inpQuote = document.getElementById("spogInpQuote");
    if (inpQuote) {
      inpQuote.oninput = () => {
        SPOG.h.quote = inpQuote.value.trim() || FRASE_DEFAULT;
        syncGlobalHero(SPOG.h);
      };
    }

    // Quick Num
    ov.querySelectorAll("[data-quick-num]").forEach((btn) => {
      btn.onclick = () => {
        SPOG.h.num = parseInt(btn.dataset.quickNum, 10);
        syncGlobalHero(SPOG.h);
        renderSpogliatoio();
      };
    });

    // Ruolo
    ov.querySelectorAll("[data-role-id]").forEach((box) => {
      box.onclick = () => {
        SPOG.h.role = box.dataset.roleId;
        syncGlobalHero(SPOG.h);
        renderSpogliatoio();
      };
    });

    // Piede
    ov.querySelectorAll("[data-foot-id]").forEach((btn) => {
      btn.onclick = () => {
        SPOG.h.foot = btn.dataset.footId;
        syncGlobalHero(SPOG.h);
        renderSpogliatoio();
      };
    });

    // Aspetto: Face, Skin, Eye, Style, Hair, Beard, Scar
    ov.querySelectorAll("[data-set-face]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.face = btn.dataset.setFace; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });
    ov.querySelectorAll("[data-set-skin]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.skin = btn.dataset.setSkin; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });
    ov.querySelectorAll("[data-set-eye]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.eye = btn.dataset.setEye; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });
    ov.querySelectorAll("[data-set-style]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.style = btn.dataset.setStyle; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });
    ov.querySelectorAll("[data-set-hair]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.hair = btn.dataset.setHair; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });
    ov.querySelectorAll("[data-set-beard]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.beard = btn.dataset.setBeard; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });
    ov.querySelectorAll("[data-set-scar]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.scar = btn.dataset.setScar; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });

    // Divisa: Shirt, Shirt2, Pattern, Armband, Cel
    ov.querySelectorAll("[data-set-shirt]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.shirt = btn.dataset.setShirt; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });
    ov.querySelectorAll("[data-set-shirt2]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.shirt2 = btn.dataset.setShirt2; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });
    ov.querySelectorAll("[data-set-pattern]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.pattern = btn.dataset.setPattern; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });
    ov.querySelectorAll("[data-set-armband]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.armband = btn.dataset.setArmband; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });
    ov.querySelectorAll("[data-set-cel]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.cel = btn.dataset.setCel; SPOG.celStart = SPOG.animFrame || 1; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });

    // Tiro: Shot, Trail
    ov.querySelectorAll("[data-set-shot]").forEach((btn) => {
      btn.onclick = () => {
        SPOG.h.shot = btn.dataset.setShot;
        const H_SHOTS = (window.__borgoApi && window.__borgoApi.H_SHOTS) || {};
        const st = H_SHOTS[SPOG.h.shot];
        if (st) SPOG.h.shotName = `${st.label.toUpperCase()} DI ${SPOG.h.name.toUpperCase()}`;
        syncGlobalHero(SPOG.h);
        renderSpogliatoio();
      };
    });
    ov.querySelectorAll("[data-set-trail]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.trail = btn.dataset.setTrail; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });

    // Guardaroba Equip
    ov.querySelectorAll("[data-equip-shirt]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.shirt = btn.dataset.equipShirt; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });
    ov.querySelectorAll("[data-equip-style]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.style = btn.dataset.equipStyle; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });
    ov.querySelectorAll("[data-equip-shot]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.shot = btn.dataset.equipShot; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });
    ov.querySelectorAll("[data-equip-acc]").forEach((btn) => {
      btn.onclick = () => { SPOG.h.acc = btn.dataset.equipAcc; syncGlobalHero(SPOG.h); renderSpogliatoio(); };
    });

    // Se siamo nel tab carta, disegna la carta
    if (SPOG.tab === "carta") {
      const cCanvas = document.getElementById("spogCardFaceCanvas");
      if (cCanvas) {
        const cctx = cCanvas.getContext("2d");
        const api = window.__borgoApi;
        if (api && typeof api.portraitTo === "function" && api.CAST && api.CAST.hero) {
          api.portraitTo(cctx, "hero", 60, 66, 0.9);
        }
      }
    }
  }

  function closeSpogliatoio() {
    stopPreviewLoop();
    const ov = document.getElementById("spogOverlay");
    if (ov) ov.remove();
    const back = (SPOG && SPOG.back) || window.title;
    SPOG = null;
    if (typeof back === "function") back();
  }

  // Registrazione Globale
  window.openSpogliatoio = openSpogliatoio;
  // Sostituisce heroEditor con lo Spogliatoio visuale
  window.heroEditor = function (back) {
    openSpogliatoio(back);
  };

  // Integrazione Carta Eroe in Squadra dei Sogni (sogni.js)
  function setupSogniHeroIntegration() {
    if (!window.__sogni) return;
    const S = window.__sogni;
    // Se la carta hero non è ancora stata iniettata
    if (S.BY && !S.BY.hero) {
      const heroGetter = {
        get id() { return "hero"; },
        get saga() { return "borgo"; },
        get role() {
          const h = readJSON(HERO_KEY, null);
          const r = (h && h.role) || "A";
          return r === "W" ? "A" : r;
        },
        get rar() { return getHeroTier().rar; },
        get at() {
          const h = readJSON(HERO_KEY, null);
          return getHeroStats(h || {}, getHeroTier()).at;
        },
        get df() {
          const h = readJSON(HERO_KEY, null);
          return getHeroStats(h || {}, getHeroTier()).df;
        },
        get te() {
          const h = readJSON(HERO_KEY, null);
          return getHeroStats(h || {}, getHeroTier()).te;
        },
        get n() { return 1; },
        isHero: true
      };
      S.BY.hero = heroGetter;
    }
  }

  // Ascolta quando sogni.js è pronto
  window.addEventListener("DOMContentLoaded", setupSogniHeroIntegration);
  setTimeout(setupSogniHeroIntegration, 500);

  window.__spogliatoioCampione = {
    open: openSpogliatoio,
    getHeroTier,
    getHeroStats,
    completeHero
  };
})();
