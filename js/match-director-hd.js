// js/match-director-hd.js - Matchday Director 2D HD: il gestionale live del Mister del Rondine FC
// Entry: window.openMatchDirectorHD(onExit)
(function () {
  "use strict";

  const SAVE_KEY = "ali-di-rondine.director-hd-v1";
  const STYLE_ID = "mdx-style";
  const W = 400, H = 380; // coordinate logiche del campo (verticale, noi attacchiamo verso l'alto)
  const STEP_MS = { 1: 1400, 2: 700, 4: 330 };

  // ---------------------------------------------------------------- util
  const rnd = Math.random;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const snd = (n, a) => { try { if (window.HD2DAudio && window.HD2DAudio[n]) window.HD2DAudio[n](a); } catch (e) { /* audio opzionale */ } };

  // ---------------------------------------------------------------- dati
  const FORMS = {
    "4-3-3": { n: { DIF: 4, CEN: 3, ATT: 3 }, prof: { atk: 1.05, mid: 1.0, def: 0.97 }, info: "Tre punte: più occasioni, meno filtro." },
    "4-4-2": { n: { DIF: 4, CEN: 4, ATT: 2 }, prof: { atk: 0.98, mid: 1.05, def: 1.0 }, info: "Equilibrato e ordinato, nessun colpo di genio." },
    "3-5-2": { n: { DIF: 3, CEN: 5, ATT: 2 }, prof: { atk: 0.98, mid: 1.13, def: 0.92 }, info: "Domini il centrocampo, ma dietro ballano in tre.", unlock: { wins: 1, label: "1 vittoria" } },
    "5-4-1": { n: { DIF: 5, CEN: 4, ATT: 1 }, prof: { atk: 0.84, mid: 0.98, def: 1.13 }, info: "Pullman davanti alla porta. Brutto ma efficace.", unlock: { wins: 3, label: "3 vittorie" } }
  };
  const MENT = {
    prudente: { ico: "🛡️", t: "Cauta", atk: 0.92, def: 1.08, ctr: 0.8, st: 0.9, info: "Meno rischi: pochi contropiedi subiti, meno occasioni." },
    equil: { ico: "⚖️", t: "Equil.", atk: 1, def: 1, ctr: 1, st: 1, info: "Nessun rischio particolare. Nessuna gloria particolare." },
    offensiva: { ico: "🔥", t: "Attacco", atk: 1.08, def: 0.94, ctr: 1.25, st: 1.08, info: "Più occasioni, ma sei esposto al contropiede." },
    allin: { ico: "🎲", t: "All-in", atk: 1.2, def: 0.82, ctr: 1.6, st: 1.2, info: "Tutti avanti! Se perdi palla, preghi." }
  };
  const PRESS = {
    basso: { ico: "🧱", t: "Basso", mid: 0.96, st: 0.72, info: "Risparmi fiato, regali metri di campo." },
    medio: { ico: "↔️", t: "Medio", mid: 1, st: 1, info: "Pressione normale." },
    alto: { ico: "⚡", t: "Alto", mid: 1.06, st: 1.45, info: "Recuperi palla alta e soffoca i palleggiatori, ma ti svuota." }
  };

  const OPPS = [
    {
      id: "gabbiani", name: "Gabbiani del Porto", short: "Gabbiani", ico: "🕊️", col: "#e2e8f0", col2: "#64748b", lvl: 0.97, form: "4-3-3", style: "Palleggio",
      blurb: "Belli da vedere, un po' svenevoli. Tengono palla come se pagasse la società.",
      hint: "Soffrono il pressing alto: costringili a sbagliare.",
      goal: "Recupera palla alta almeno 2 volte (pressing alto)",
      mod: { atk: 0.95, mid: 1.08, def: 0.92, pressWeak: 0.86, foul: 0.02, ctr: 0.9, wall: 1, tire: 1 },
      names: ["Pippo Sala", "Remo Vento", "Orso Bini", "Gigi Ancora", "Tullio Nasse", "Biagio Salsa", "Cesco Lima", "Nino Rete", "Ettore Faro", "Zeno Pinna", "Lollo Bruma"],
      twist: (S) => {
        if (S.min === 60 && S.scoreB >= S.scoreA) { S.oppBuff.mid = 1.12; S.oppBuff.atk = 0.92; addLog("🕊️ I Gabbiani fanno melina: palleggio a oltranza, il pubblico sbadiglia.", "opp"); }
      }
    },
    {
      id: "corsari", name: "Corsari di Scoglio Nero", short: "Corsari", ico: "🏴‍☠️", col: "#fca5a5", col2: "#7f1d1d", lvl: 0.96, form: "4-4-2", style: "Fisici e rissosi",
      blurb: "Gomiti larghi, barbe larghe, sorrisi stretti. Il pallone è un dettaglio.",
      hint: "Letali in contropiede: se ti sbilanci, ti puniscono.",
      goal: "Vinci senza prendere nemmeno un cartellino rosso e al massimo 1 giallo",
      mod: { atk: 1.0, mid: 0.97, def: 1.0, pressWeak: 1, foul: 0.07, ctr: 1.25, wall: 1, tire: 1 },
      names: ["Capitan Uncino", "Brando Ruggine", "Tizzo Ancora", "Moro Catena", "Bruno Randa", "Siro Fune", "Tonno Duro", "Nerio Sale", "Ciro Gancio", "Pelo Rosso", "Dante Nodo"],
      twist: (S) => {
        if (S.min === 55) { S.oppBuff.atk = 1.08; S.oppBuff.foul = 0.12; addLog("🏴‍☠️ I Corsari alzano la voce (e i gomiti). Si fa dura.", "opp"); }
      }
    },
    {
      id: "dragoni", name: "Dragoni della Diga", short: "Dragoni", ico: "🐉", col: "#86efac", col2: "#14532d", lvl: 0.97, form: "5-4-1", style: "Muro di cemento",
      blurb: "Cinque dietro, quattro davanti ai cinque, uno che prega in avanti. Il cemento non fa gol, ma nemmeno ne prende.",
      hint: "Si sfonda con pazienza, mentalità d'attacco e gambe fresche nel finale.",
      goal: "Segna almeno 2 gol dopo il 60'",
      mod: { atk: 0.86, mid: 0.98, def: 1.14, pressWeak: 1, foul: 0.03, ctr: 1, wall: 0.82, tire: 1.25 },
      names: ["Gorgo Muro", "Piero Diga", "Ugo Molo", "Sasso Bianco", "Tano Cemento", "Rocco Pila", "Fabio Argine", "Nanni Chiusa", "Dino Sbarra", "Cosimo Lastra", "Giotto Fondo"],
      twist: (S) => {
        if (S.min === 70) {
          if (S.scoreB < S.scoreA) { S.oppBuff.def = 0.86; S.oppBuff.atk = 1.2; addLog("🐉 I Dragoni sono costretti a scoprirsi: la diga ha una crepa.", "opp"); }
          else { S.oppBuff.def = 1.08; addLog("🐉 I Dragoni si chiudono ancora di più. Sembra un muro del pianto.", "opp"); }
        }
      }
    },
    {
      id: "fanfara", name: "Fanfara del Mercato", short: "Fanfara", ico: "🎺", col: "#fcd34d", col2: "#92400e", lvl: 1.0, form: "3-5-2", style: "Imprevedibili",
      blurb: "Squadra di fruttivendoli, cugini e un trombettista in panchina. Non sai mai cosa suonano.",
      hint: "Cambiano spartito ogni tanto: segnano e subiscono tanto. Tieni i nervi saldi.",
      goal: "Vinci subendo al massimo 1 gol",
      mod: { atk: 1.06, mid: 1.0, def: 0.9, pressWeak: 1, foul: 0.03, ctr: 1.1, wall: 1, tire: 1 },
      names: ["Gaspare Cassetta", "Totò Banco", "Rino Arancia", "Mimmo Bilancia", "Lucio Sedano", "Pino Trombone", "Carmine Nasello", "Ninni Pesca", "Vito Zucca", "Peppe Ciliegia", "Alfio Tamburo"],
      twist: (S) => {
        if (S.min === 30 || S.min === 62) {
          if (rnd() < 0.5) { S.oppBuff.atk = 1.2; S.oppBuff.def = 0.82; addLog("🎺 La Fanfara cambia spartito: tutti all'attacco, trombone compreso!", "opp"); }
          else { S.oppBuff.atk = 0.9; S.oppBuff.def = 1.12; addLog("🎺 La Fanfara cambia spartito: marcia funebre difensiva.", "opp"); }
        }
      }
    },
    {
      id: "mareggiata", name: "Real Mareggiata", short: "Mareggiata", ico: "🌊", col: "#7dd3fc", col2: "#1e3a8a", lvl: 1.04, form: "4-3-3", style: "Gli squadroni",
      blurb: "Maglie di seta, sponsor sul petto, un allenatore che sembra uscito da una rivista. La sfida finale del Borgo.",
      hint: "Nessun punto debole, ma leggono i tuoi ordini: variali al momento giusto.",
      goal: "Vinci usando al massimo 2 cambi",
      mod: { atk: 1.04, mid: 1.04, def: 1.04, pressWeak: 0.97, foul: 0.03, ctr: 1.1, wall: 0.95, tire: 0.9 },
      names: ["Fausto Marea", "Ruggero Onda", "Leandro Corrente", "Tancredi Risacca", "Ettore Spuma", "Orlando Baia", "Ludo Scirocco", "Silvano Bonaccia", "Gualtiero Maestrale", "Ivo Libeccio", "Cesare Tramonto"],
      twist: (S) => {
        if (S.min === 50) {
          if (S.ment === "offensiva" || S.ment === "allin") { S.oppBuff.ctr = 1.2; addLog("🌊 Il Mareggiata ha letto il tuo assalto: preparano il contropiede.", "opp"); }
          else { S.oppBuff.mid = 1.06; addLog("🌊 Il Mareggiata studia il tuo ordine e prende il centrocampo.", "opp"); }
        }
      }
    }
  ];

  // obiettivi (terza stella) valutati a fine partita
  const GOAL_CHECK = {
    gabbiani: (S) => S.stats.recups >= 2,
    corsari: (S) => S.stats.reds === 0 && S.stats.cards <= 1,
    dragoni: (S) => S.stats.lateGoals >= 2,
    fanfara: (S) => S.scoreB <= 1,
    mareggiata: (S) => S.subsUsed <= 2
  };

  const RANKS = [
    { pts: 0, t: "Allenatore da Oratorio" },
    { pts: 6, t: "Mister del Molo" },
    { pts: 14, t: "Stratega di Borgo" },
    { pts: 26, t: "Volpe della Panchina" },
    { pts: 40, t: "Leggenda del Faro" }
  ];

  const SQUAD = [
    { name: "Sandro", num: 1, grp: "POR", r: 74 },
    { name: "Gino", num: 2, grp: "DIF", r: 70 },
    { name: "Mino", num: 3, grp: "DIF", r: 69 },
    { name: "Chicco", num: 4, grp: "DIF", r: 73 },
    { name: "Baciccia Jr", num: 5, grp: "DIF", r: 71 },
    { name: "Don Aurelio Jr", num: 6, grp: "CEN", r: 72 },
    { name: "Nico", num: 7, grp: "ATT", r: 71 },
    { name: "Leo (C)", num: 8, grp: "CEN", r: 76 },
    { name: "Dario", num: 9, grp: "ATT", r: 77 },
    { name: "Sara", num: 10, grp: "CEN", r: 73 },
    { name: "Ricky", num: 11, grp: "ATT", r: 70 },
    { name: "Tano", num: 13, grp: "DIF", r: 68, bench: true },
    { name: "Ugo", num: 14, grp: "CEN", r: 69, bench: true },
    { name: "Fabio", num: 15, grp: "ATT", r: 72, bench: true },
    { name: "Tina", num: 16, grp: "CEN", r: 70, bench: true },
    { name: "Pia", num: 17, grp: "ATT", r: 69, bench: true }
  ];

  // ---------------------------------------------------------------- progressi
  function defaultProg() {
    return { v: 1, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, pts: 0, opp: {}, coins: {}, lastForm: "4-3-3", lastMent: "equil", lastPress: "medio" };
  }
  function loadProg() {
    const d = defaultProg();
    try {
      const r = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      if (r && typeof r === "object") {
        ["played", "wins", "draws", "losses", "gf", "ga", "pts"].forEach((k) => { d[k] = Math.max(0, Number(r[k]) || 0); });
        if (r.opp && typeof r.opp === "object") {
          OPPS.forEach((o) => {
            const e = r.opp[o.id];
            if (e && typeof e === "object") d.opp[o.id] = { stars: clamp(Number(e.stars) || 0, 0, 3), wins: Math.max(0, Number(e.wins) || 0), played: Math.max(0, Number(e.played) || 0), best: typeof e.best === "string" ? e.best.slice(0, 8) : "" };
          });
        }
        if (r.coins && typeof r.coins === "object") OPPS.forEach((o) => { if (r.coins[o.id]) d.coins[o.id] = true; });
        if (FORMS[r.lastForm]) d.lastForm = r.lastForm;
        if (MENT[r.lastMent]) d.lastMent = r.lastMent;
        if (PRESS[r.lastPress]) d.lastPress = r.lastPress;
      }
    } catch (e) { /* default sicuro */ }
    return d;
  }
  function saveProg(p) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(p)); } catch (e) { /* ignora */ } }
  function rankOf(pts) { let r = 0; RANKS.forEach((x, i) => { if (pts >= x.pts) r = i; }); return r; }
  function oppUnlocked(prog, i) { return i === 0 || ((prog.opp[OPPS[i - 1].id] || {}).stars || 0) >= 1; }
  function formUnlocked(prog, f) { const u = FORMS[f].unlock; return !u || prog.wins >= u.wins; }

  // ---------------------------------------------------------------- stato modulo
  let root = null, style = null, canvas = null, ctx = null, rafId = 0, onExitCb = null;
  let prog = defaultProg();
  let S = null; // partita
  let tab = "ordini";
  let lastT = 0, cw = 0;
  let sheetEl = null;
  const listeners = [];

  function listen(t, ev, fn, opt) { t.addEventListener(ev, fn, opt); listeners.push([t, ev, fn, opt]); }

  // ---------------------------------------------------------------- CSS
  const CSS = `
  .mdx-root{position:fixed;inset:0;z-index:999999;background:#060d1a;color:#e5edf8;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;display:flex;flex-direction:column;height:100vh;height:100dvh;overflow:hidden;font-size:14px;-webkit-tap-highlight-color:transparent}
  .mdx-root *{box-sizing:border-box}.mdx-root h1,.mdx-root h2{text-shadow:none;margin-top:0}
  .mdx-scr{flex:1;min-height:0;display:flex;flex-direction:column;position:relative}
  .mdx-btn{min-height:44px;border:1px solid #2a3b57;background:#14233b;color:#e5edf8;border-radius:10px;font:700 13px system-ui,sans-serif;padding:6px 8px;cursor:pointer;touch-action:manipulation;line-height:1.15}
  .mdx-btn:active{transform:scale(.97)}
  .mdx-btn.on{background:#1d4ed8;border-color:#7dd3fc;color:#fff;box-shadow:0 0 0 1px #7dd3fc inset}
  .mdx-btn.gold{background:linear-gradient(135deg,#f59e0b,#d97706);border-color:#fcd34d;color:#1b1203}
  .mdx-btn.red{background:#7f1d1d;border-color:#ef4444}
  .mdx-btn[disabled]{opacity:.4;cursor:default}
  .mdx-menu{overflow-y:auto;padding:12px 14px 24px}
  .mdx-h1{margin:0;font-size:21px;font-weight:800;color:#fff;letter-spacing:-.3px}
  .mdx-sub{margin:3px 0 0;color:#93a4bd;font-size:12.5px;line-height:1.4}
  .mdx-card{background:#0d1a2e;border:1px solid #223653;border-radius:12px;padding:11px 12px;margin-top:10px}
  .mdx-rank{display:flex;gap:10px;align-items:center}
  .mdx-bar{height:7px;border-radius:5px;background:#1c2b44;overflow:hidden}
  .mdx-bar>i{display:block;height:100%;background:linear-gradient(90deg,#38bdf8,#818cf8)}
  .mdx-opp{display:flex;gap:10px;align-items:center;text-align:left;width:100%;min-height:76px;padding:10px 12px;border-radius:12px;border:1px solid #223653;background:#0d1a2e;color:#e5edf8;margin-top:8px;cursor:pointer;font-family:inherit}
  .mdx-opp.lock{opacity:.45;cursor:default}
  .mdx-opp .ic{font-size:30px;width:44px;text-align:center;flex:none}
  .mdx-opp b{display:block;font-size:15px}
  .mdx-opp small{display:block;color:#93a4bd;font-size:11.5px;line-height:1.35;margin-top:2px}
  .mdx-stars{color:#fbbf24;letter-spacing:1px;font-size:13px}
  .mdx-stars span{color:#334155}
  .mdx-top{display:flex;gap:6px;align-items:center;padding:6px 8px;background:#0a1424;border-bottom:1px solid #1b2a43;flex:none}
  .mdx-top .mdx-btn{min-width:44px;padding:4px 6px}
  .mdx-sb{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:6px;padding:6px 10px 4px;background:#0a1424;flex:none}
  .mdx-sb .tn{font-weight:800;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .mdx-sb .tn.r{text-align:right}
  .mdx-sb .sc{font:800 24px ui-monospace,Menlo,monospace;color:#fff;text-align:center;min-width:92px}
  .mdx-sb .sc small{display:block;font:700 11px system-ui;color:#facc15;margin-top:-2px}
  .mdx-prog{height:3px;background:#1c2b44;flex:none}.mdx-prog>i{display:block;height:100%;background:#facc15;width:0}
  .mdx-cv{display:block;margin:0 auto;height:min(94vw,37vh);width:auto;aspect-ratio:${W}/${H};max-width:100%;flex:none;background:#14301f}
  .mdx-strip{display:grid;grid-template-columns:1.3fr 1fr 1.1fr 1fr;gap:4px;padding:4px 8px;background:#0a1424;font-size:11px;color:#b6c4da;flex:none;align-items:center;text-align:center}
  .mdx-strip .pb{height:6px;border-radius:4px;background:#b91c1c;overflow:hidden;margin-top:2px}.mdx-strip .pb>i{display:block;height:100%;background:#2563eb}
  .mdx-tick{padding:5px 10px;background:#08111f;color:#cbd8ec;font-size:12px;line-height:1.35;min-height:38px;flex:none;border-top:1px solid #15233a}
  .mdx-tick div:first-child{color:#fff}.mdx-tick div+div{color:#7d8da6}
  .mdx-tabs{display:grid;grid-template-columns:repeat(3,1fr);flex:none;background:#0a1424;border-top:1px solid #1b2a43}
  .mdx-tabs button{min-height:42px;background:none;border:0;border-bottom:3px solid transparent;color:#93a4bd;font:700 13px system-ui;cursor:pointer}
  .mdx-tabs button.on{color:#fff;border-bottom-color:#38bdf8}
  .mdx-pan{flex:1;min-height:0;overflow-y:auto;padding:6px 10px 12px;background:#08111f}
  .mdx-lbl{font-size:11px;color:#93a4bd;font-weight:700;margin:8px 0 3px;display:flex;justify-content:space-between;gap:6px}
  .mdx-lbl em{font-style:normal;color:#64748b;font-weight:500;text-align:right}
  .mdx-g4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}
  .mdx-g3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
  .mdx-g2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:6px}
  .mdx-fx{font-size:11.5px;color:#a8b8d0;margin-top:3px;line-height:1.35}
  .mdx-row{display:flex;flex-direction:column;align-items:stretch;gap:4px;min-height:48px;padding:5px 8px;border-radius:9px;border:1px solid #223653;background:#0d1a2e;color:#e5edf8;font:600 12.5px system-ui;text-align:left;cursor:pointer;width:100%}
  .mdx-row.sel{border-color:#facc15;background:#2a2308}
  .mdx-row .top,.mdx-row .bot{display:flex;align-items:center;gap:5px;min-width:0}.mdx-row .n{width:22px;color:#7d8da6;font-size:11px;flex:none}
  .mdx-row .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .mdx-row .sb{flex:1;height:6px;border-radius:4px;background:#1c2b44;overflow:hidden;flex:none}.mdx-row .sb>i{display:block;height:100%}
  .mdx-row .pc{width:30px;text-align:right;font-size:11px;color:#93a4bd;flex:none}
  .mdx-row .gp{font-size:10px;padding:1px 4px;border-radius:5px;background:#1c2b44;color:#93a4bd;flex:none}
  .mdx-log div{padding:5px 2px;border-bottom:1px solid #13213a;font-size:12.5px;line-height:1.4}
  .mdx-log .goal{color:#fde68a;font-weight:700}.mdx-log .opp{color:#fda4af}.mdx-log .tip{color:#7dd3fc}.mdx-log .ev{color:#c4b5fd}
  .mdx-log b{color:#7d8da6;font-weight:600;margin-right:4px}
  .mdx-sheet{position:absolute;inset:0;z-index:5;background:rgba(3,8,16,.78);display:flex;align-items:flex-end;justify-content:center}
  .mdx-sheet.full{align-items:stretch}
  .mdx-sh{width:100%;max-width:560px;max-height:100%;overflow-y:auto;background:#0e1b31;border-top:2px solid #38bdf8;border-radius:16px 16px 0 0;padding:14px 14px 18px;animation:mdxup .22s ease-out}
  .mdx-sheet.full .mdx-sh{border-radius:0;border-top:0;max-width:640px;margin:0 auto}
  @keyframes mdxup{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
  .mdx-sh h2{margin:0 0 4px;font-size:18px;color:#fff}
  .mdx-sh p{margin:4px 0 8px;font-size:13.5px;line-height:1.5;color:#cfdbee}
  .mdx-ch{display:block;width:100%;text-align:left;margin-top:7px;min-height:50px}
  .mdx-ch small{display:block;font-weight:500;color:#9db0cc;margin-top:2px;font-size:11.5px}
  .mdx-res{background:#13243f;border-radius:10px;padding:9px 11px;margin:8px 0;font-size:13.5px;line-height:1.5;color:#e8f0fc}
  .mdx-pg{display:grid;grid-template-columns:28px 1fr auto;gap:6px;align-items:center;padding:4px 0;border-bottom:1px solid #162540;font-size:12.5px}
  .mdx-pg i{font-style:normal;font-weight:800;color:#fff;background:#1d4ed8;border-radius:6px;padding:1px 6px;font-size:12px}
  .mdx-pg i.hi{background:#16a34a}.mdx-pg i.lo{background:#b91c1c}.mdx-pg i.mvp{background:#d97706}
  .mdx-pg small{color:#8ea0bc}
  .mdx-big{font:800 38px ui-monospace,Menlo,monospace;text-align:center;color:#fff;margin:2px 0}
  .mdx-chip{display:inline-block;padding:2px 8px;border-radius:12px;background:#1c2b44;color:#bcd0ec;font-size:11px;font-weight:700;margin:2px 3px 2px 0}
  .mdx-chip.g{background:#14532d;color:#bbf7d0}.mdx-chip.y{background:#713f12;color:#fde68a}
  `;

  // ---------------------------------------------------------------- creazione partita
  function makeSquad() {
    return SQUAD.map((s, i) => ({ id: i, name: s.name, num: s.num, grp: s.grp, r: s.r, st: 100, slotGrp: s.grp, x: W / 2, y: H - 20, tx: 0, ty: 0, goals: 0, assists: 0, saves: 0, bonus: 0, mins: 0, eco: false, bench: !!s.bench, off: false, side: 0 }));
  }

  function slotCounts(form) { return FORMS[form].n; }

  // assegna i giocatori in campo (esclusi portiere) agli slot della formazione
  function reassign(form) {
    const field = S.xi.filter((p) => p.grp !== "POR" || p.slotGrp !== "POR");
    const gk = S.xi.filter((p) => p.slotGrp === "POR");
    const n = Object.assign({}, slotCounts(form));
    let total = n.DIF + n.CEN + n.ATT;
    while (total > field.length) {
      if (n.ATT > 1) n.ATT--; else if (n.CEN > 1) n.CEN--; else n.DIF--;
      total--;
    }
    const left = field.slice();
    const out = [];
    ["DIF", "ATT", "CEN"].forEach((g) => {
      const mine = left.filter((p) => p.grp === g).sort((a, b) => b.r - a.r).slice(0, n[g]);
      mine.forEach((p) => { p.slotGrp = g; out.push(p); left.splice(left.indexOf(p), 1); n[g]--; });
    });
    ["CEN", "DIF", "ATT"].forEach((g) => {
      while (n[g] > 0 && left.length) {
        left.sort((a, b) => pen(b.grp, g) * b.r - pen(a.grp, g) * a.r);
        const p = left.shift(); p.slotGrp = g; out.push(p); n[g]--;
      }
    });
    S.xi = gk.concat(out).sort((a, b) => a.id - b.id);
  }

  function pen(nat, slot) {
    if (nat === slot) return 1;
    if (nat === "POR" || slot === "POR") return 0.6;
    if (nat === "CEN" || slot === "CEN") return 0.95;
    return 0.84;
  }

  function makeOppXI(o) {
    const n = FORMS[o.form].n;
    const list = [];
    let k = 0;
    list.push({ name: o.names[k], num: 1, grp: "POR", slotGrp: "POR" }); k++;
    ["DIF", "CEN", "ATT"].forEach((g) => { for (let i = 0; i < n[g]; i++) { list.push({ name: o.names[k % o.names.length], num: 2 + k - 1 + (k > 8 ? 1 : 0), grp: g, slotGrp: g }); k++; } });
    list.forEach((p) => { p.x = W / 2; p.y = 40; p.st = 100; });
    return list;
  }

  function newMatch(opp, form, ment, press) {
    S = {
      opp, min: 0, scoreA: 0, scoreB: 0, shotsA: 0, shotsB: 0, sotA: 0, sotB: 0, xgA: 0, xgB: 0, posA: 0, posTotal: 0, poss: "A",
      form, ment, press, morale: 55, oppStam: 100, confuse: 0, buff: { atk: 1, mid: 1, def: 1, until: 0 },
      oppBuff: { atk: 1, mid: 1, def: 1, ctr: 1, foul: 0 },
      log: [], run: false, speed: 1, acc: 0, frac: 0, needStep: true, started: false, over: false, ended: false,
      pend: [], path: null, rest: { x: W / 2, y: H / 2 }, ball: { x: W / 2, y: H / 2 }, carrier: null,
      banner: null, parts: [], shake: 0, passTrail: [], dive: null,
      subsUsed: 0, timeouts: 2, htDone: false, oppSubDone: false, selOut: null, evIdx: 0, lastTip: 0,
      stats: { recups: 0, lateGoals: 0, cards: 0, reds: 0 }, gkSaves: 0, lineFx: 0
    };
    const squad = makeSquad();
    S.squad = squad;
    S.bench = squad.filter((p) => p.bench);
    S.xi = squad.filter((p) => !p.bench);
    reassign(form);
    S.oppXI = makeOppXI(opp);
    S.events = scheduleEvents();
    // posizioni iniziali immediate
    layout(); S.xi.concat(S.oppXI).forEach((p) => { p.x = p.tx; p.y = p.ty; });
    S.log.unshift({ m: 0, t: `Il Rondine FC riceve i ${opp.name}. ${opp.blurb}`, c: "" });
  }

  // ---------------------------------------------------------------- potenza squadre
  function moraleF() { return 0.94 + S.morale * 0.0012; }
  function effA(p) { return (p.r / 72) * (0.55 + 0.45 * p.st / 100) * pen(p.grp, p.slotGrp) * moraleF(); }
  function avg(a, d) { return a.length ? a.reduce((x, y) => x + y, 0) / a.length : d; }
  function powerA() {
    const g = { DIF: [], CEN: [], ATT: [], POR: [] };
    S.xi.forEach((p) => g[p.slotGrp].push(effA(p)));
    const d = avg(g.DIF, 0.6), c = avg(g.CEN, 0.6), a = avg(g.ATT, 0.6), k = avg(g.POR, 0.8);
    const f = FORMS[S.form].prof, M = MENT[S.ment], P = PRESS[S.press];
    const conf = S.confuse > 0 ? 0.92 : 1;
    const b = S.buff.until > S.min ? S.buff : { atk: 1, mid: 1, def: 1 };
    return {
      atk: (0.65 * a + 0.35 * c) * f.atk * M.atk * conf * b.atk,
      mid: (0.7 * c + 0.15 * a + 0.15 * d) * f.mid * P.mid * conf * b.mid,
      def: (0.6 * d + 0.2 * c + 0.2 * k) * f.def * M.def * b.def,
      gk: k
    };
  }
  function powerB() {
    const o = S.opp, m = o.mod, f = FORMS[o.form].prof, b = S.oppBuff;
    const st = 0.55 + 0.45 * S.oppStam / 100;
    return {
      atk: o.lvl * m.atk * f.atk * st * b.atk,
      mid: o.lvl * m.mid * f.mid * st * b.mid * (S.press === "alto" ? m.pressWeak : 1),
      def: o.lvl * m.def * f.def * st * b.def,
      gk: o.lvl
    };
  }

  // ---------------------------------------------------------------- log / ticker
  function addLog(t, c) {
    if (!S) return;
    S.log.unshift({ m: S.min, t, c: c || "" });
    if (S.log.length > 90) S.log.pop();
    updateTicker();
    if (tab === "log") renderPanel();
  }

  // ---------------------------------------------------------------- tiri
  function weightedPlayer(list, wf) {
    let tot = 0; const w = list.map((p) => { const v = Math.max(0.01, wf(p)); tot += v; return v; });
    let r = rnd() * tot;
    for (let i = 0; i < list.length; i++) { r -= w[i]; if (r <= 0) return list[i]; }
    return list[list.length - 1];
  }
  function pickShooterA() {
    const f = S.xi.filter((p) => p.slotGrp !== "POR");
    return weightedPlayer(f, (p) => ({ ATT: 5, CEN: 2.2, DIF: 0.5 }[p.slotGrp]) * (p.r / 72));
  }
  function pickAssistA(ex) {
    const f = S.xi.filter((p) => p.slotGrp !== "POR" && p !== ex);
    return weightedPlayer(f, (p) => ({ ATT: 2, CEN: 3, DIF: 1 }[p.slotGrp]));
  }
  function ourGK() { return S.xi.find((p) => p.slotGrp === "POR"); }

  function rollShot(team, q, bonus) {
    const A = powerA(), B = powerB();
    const gkf = team === "A" ? clamp(B.gk, 0.85, 1.2) : clamp(A.gk, 0.85, 1.2);
    const pGoal = clamp(q * (1 + (bonus || 0)) / gkf, 0.02, 0.9);
    const r = rnd();
    let kind;
    if (r < pGoal) kind = "goal";
    else {
      const x = rnd();
      kind = x < 0.5 ? "save" : x < 0.75 ? "miss" : x < 0.85 ? "post" : "block";
    }
    let shooter, assist = null;
    if (team === "A") { shooter = pickShooterA(); if (kind === "goal" && rnd() < 0.7) assist = pickAssistA(shooter); }
    else { shooter = pick(S.oppXI.filter((p) => p.slotGrp !== "POR")); }
    return { team, kind, q, shooter, assist };
  }

  const TXT = {
    goalA: [(s, a) => `⚽ GOOOL! ${s} la mette dentro${a ? ` su assist di ${a}` : ""}. Il molo esplode!`, (s, a) => `⚽ ${s} non perdona${a ? `: assist di ${a}` : ""}. 1 a zero per la poesia.`, (s) => `⚽ Rete di ${s}! Il vice abbraccia il fisioterapista, che non c'entrava niente.`, (s, a) => `⚽ Azione da manuale${a ? `, ${a} apre` : ""}, ${s} chiude. Applausi a scena aperta!`],
    goalB: [(s) => `💥 Gol subito: ${s} ci punisce. Silenzio in panchina.`, (s) => `💥 ${s} trova l'angolo. Sandro guarda il cielo cercando spiegazioni.`, (s) => `💥 Rete avversaria di ${s}. Il Mister si morde la penna.`],
    save: [(s) => `🧤 Occasione Rondine: ${s} calcia, il portiere si allunga!`, (s) => `🧤 ${s} ci prova da posizione invitante: parata strepitosa.`],
    miss: [(s) => `😬 ${s} spara alto. La Madonna del Faro ringrazia.`, (s) => `😬 Tiro di ${s}: fuori di un soffio.`],
    post: [(s) => `🥁 PALO di ${s}! Il rumore si sente fino alla darsena.`],
    block: [(s) => `🧱 ${s} calcia, un difensore si immola sul tiro.`],
    saveB: [(s) => `🧤 Sandro vola e salva sul tiro di ${s}!`, (s) => `🧤 ${s} calcia: Sandro respinge di pugno. Sarà il pesce di ieri.`],
    missB: [(s) => `😮‍💨 ${s} tira alto. Respiriamo.`, (s) => `😮‍💨 ${s} fuori di un soffio. Ancora tutti vivi.`],
    postB: [(s) => `🥁 Palo avversario con ${s}! Ci è andata di lusso.`],
    blockB: [(s) => `🛡️ Chicco mura il tiro di ${s} sulla linea!`]
  };

  function applyShot(res) {
    const t = res.team, s = res.shooter.name.replace(" (C)", "");
    const k = res.kind;
    if (t === "A") { S.shotsA++; S.xgA += res.q * 0.8; if (k === "goal" || k === "save") S.sotA++; }
    else { S.shotsB++; S.xgB += res.q * 0.8; if (k === "goal" || k === "save") S.sotB++; }
    if (k === "goal") {
      if (t === "A") {
        S.scoreA++; res.shooter.goals++; if (res.assist) res.assist.assists++;
        if (S.min > 60) S.stats.lateGoals++;
        S.morale = clamp(S.morale + 7, 0, 100);
        addLog(`${pick(TXT.goalA)(s, res.assist ? res.assist.name.replace(" (C)", "") : "")}`, "goal");
        S.banner = { t: "GOOOL!", sub: s, col: "#fde047", life: 2.2 };
        confetti();
        S.shake = 10;
      } else {
        S.scoreB++; S.morale = clamp(S.morale - 7, 0, 100);
        addLog(pick(TXT.goalB)(s), "opp");
        S.banner = { t: "GOL SUBITO", sub: s, col: "#fb7185", life: 2 };
        S.shake = 6;
      }
      S.rest = { x: W / 2, y: H / 2 };
      snd("playGoal");
    } else {
      if (t === "B" && k === "save") { const g = ourGK(); if (g) g.saves++; S.gkSaves++; }
      const key = t === "A" ? k : k + "B";
      addLog(pick(TXT[key])(s), "");
      snd(k === "post" ? "playPost" : k === "block" ? "playTackle" : "playBounce");
    }
    updateScoreboard();
  }

  function confetti() {
    for (let i = 0; i < 40; i++) S.parts.push({ x: W / 2 + (rnd() - 0.5) * 60, y: 30, vx: (rnd() - 0.5) * 220, vy: rnd() * 120 + 30, life: 1.4 + rnd(), c: pick(["#fde047", "#38bdf8", "#f472b6", "#fff", "#4ade80"]) });
  }

  // ---------------------------------------------------------------- simulazione di un minuto
  function stepMinute() {
    S.min++;
    S.xi.forEach((p) => { p.mins++; });
    if (S.confuse > 0) S.confuse--;
    // stanchezza
    const M = MENT[S.ment], P = PRESS[S.press];
    S.xi.forEach((p) => {
      if (p.slotGrp === "POR") { p.st = Math.max(25, p.st - 0.08); return; }
      const g = p.slotGrp === "CEN" ? 1.12 : p.slotGrp === "DIF" ? 0.92 : 1;
      p.st = Math.max(8, p.st - 0.52 * M.st * P.st * g * (p.eco ? 0.5 : 1));
    });
    S.oppStam = Math.max(15, S.oppStam - 0.48 * S.opp.mod.tire * (S.press === "alto" ? 1.35 : 1) * (S.oppBuff.atk > 1.1 ? 1.1 : 1));
    S.oppXI.forEach((p) => { p.st = S.oppStam; });

    // sostituzioni avversarie e twist
    if (S.min === 60 && !S.oppSubDone) { S.oppSubDone = true; S.oppStam = Math.min(100, S.oppStam + (S.opp.id === "dragoni" ? 8 : 22)); addLog(`🔁 ${S.opp.short} inserisce forze fresche.`, "opp"); }
    S.opp.twist(S);
    if (S.min === 75 && S.scoreB < S.scoreA && S.opp.id !== "dragoni" && S.opp.id !== "fanfara") { S.oppBuff.atk = Math.max(S.oppBuff.atk, 1.14); S.oppBuff.def = Math.min(S.oppBuff.def, 0.9); addLog(`📣 ${S.opp.short} si butta in avanti negli ultimi minuti.`, "opp"); }

    const A = powerA(), B = powerB();
    const ex = 1.3;
    const pa = Math.pow(A.mid, ex) / (Math.pow(A.mid, ex) + Math.pow(B.mid, ex));
    const ours = rnd() < pa;
    S.poss = ours ? "A" : "B";
    S.posTotal++; if (ours) S.posA++;

    let shot = null;
    // recupero palla alta con pressing alto
    if (S.press === "alto" && !ours && rnd() < 0.06) {
      S.stats.recups++;
      addLog(`⚡ Pressing alto! Palla recuperata nella loro metà: il Rondine riparte subito.`, "tip");
      shot = rollShot("A", 0.16 + rnd() * 0.12, 0.1);
      S.poss = "A";
    } else if (ours) {
      const pc = 0.135 * Math.pow(clamp(A.atk / B.def, 0.5, 1.8), 1.35);
      if (rnd() < pc) shot = rollShot("A", clamp((0.07 + rnd() * 0.2 + (A.atk / B.def - 1) * 0.12) * S.opp.mod.wall, 0.04, 0.55), 0);
    } else {
      const ctr = M.ctr * S.opp.mod.ctr * S.oppBuff.ctr;
      const pc = 0.135 * Math.pow(clamp(B.atk / A.def, 0.5, 1.8), 1.35) * ctr;
      if (rnd() < pc) {
        const q = clamp(0.07 + rnd() * 0.2 + (B.atk / A.def - 1) * 0.12 + (ctr > 1.3 ? 0.05 : 0), 0.04, 0.55);
        shot = rollShot("B", q, 0);
        if (ctr > 1.3 && (S.ment === "offensiva" || S.ment === "allin")) addLog(`↩️ Contropiede! Il nostro assalto lascia spazi enormi.`, "opp");
      }
    }
    // falli
    const foulP = S.opp.mod.foul + S.oppBuff.foul;
    if (!shot && rnd() < foulP) {
      addLog(`🟨 Fallo duro dei ${S.opp.short}: punizione per noi.`, "");
      shot = rollShot("A", 0.1 + rnd() * 0.06, 0);
      S.poss = "A";
    }
    buildPath(S.poss, shot);
    // consigli del vice
    if (S.min % 9 === 0 && S.min - S.lastTip >= 8) viceTip();
    updateScoreboard();
    refreshLive();
  }

  function viceTip() {
    S.lastTip = S.min;
    const tired = S.xi.filter((p) => p.slotGrp !== "POR").sort((a, b) => a.st - b.st)[0];
    if (tired && tired.st < 42 && S.subsUsed < 3) addLog(`🧑‍🏫 Rob (il vice): "Mister, ${tired.name.replace(" (C)", "")} è a ${Math.round(tired.st)}% di energia. Un cambio?"`, "tip");
    else if (S.min > 65 && S.scoreA < S.scoreB) addLog(`🧑‍🏫 Rob: "Siamo sotto e il tempo scappa. Forse è ora di osare."`, "tip");
    else if (S.min > 65 && S.scoreA > S.scoreB && S.ment === "allin") addLog(`🧑‍🏫 Rob: "Vinciamo, Mister, e giochiamo all-in? Respiri."`, "tip");
    else if (S.xgB > S.xgA + 0.9) addLog(`🧑‍🏫 Rob: "Ci stanno schiacciando. Più filtro a centrocampo?"`, "tip");
  }

  // costruzione del percorso del pallone nel minuto
  function buildPath(team, shot) {
    const xi = team === "A" ? S.xi : S.oppXI;
    const field = xi.filter((p) => p.slotGrp !== "POR");
    const byG = (gs) => { const l = field.filter((p) => gs.includes(p.slotGrp)); return l.length ? pick(l) : pick(field); };
    const chain = [byG(["DIF", "CEN"]), byG(["CEN"]), byG(["CEN", "ATT"]), byG(["ATT", "CEN"])];
    if (shot) chain.push(shot.shooter.slotGrp ? shot.shooter : chain[3]);
    const nodes = [];
    chain.forEach((p, i) => nodes.push({ f: 0.08 + i * (shot ? 0.15 : 0.2), p }));
    S.path = { team, nodes, start: { x: S.rest.x, y: S.rest.y }, shot: null };
    S.pend = [];
    if (shot) {
      const down = team === "B";
      const gy = down ? H - 8 : 8;
      let gx = W / 2 + (rnd() - 0.5) * 50, ey = gy;
      if (shot.kind === "miss") { gx = W / 2 + (rnd() < 0.5 ? -1 : 1) * (50 + rnd() * 30); }
      if (shot.kind === "post") gx = W / 2 + (rnd() < 0.5 ? -1 : 1) * 34;
      if (shot.kind === "block") { const defs = (team === "A" ? S.oppXI : S.xi).filter((p) => p.slotGrp === "DIF"); const d = defs.length ? pick(defs) : null; if (d) { gx = d.tx; ey = d.ty; } }
      S.path.shot = { f: 0.86, x: gx, y: ey, kind: shot.kind };
      S.dive = { team: team === "A" ? "B" : "A", x: gx, on: shot.kind === "save" || shot.kind === "goal" };
      S.pend.push({ f: 0.82, fn: () => snd("playKick", 1) });
      S.pend.push({ f: 0.9, fn: () => applyShot(shot) });
    } else { S.dive = null; }
  }

  function ballPos() {
    const P = S.path;
    if (!P) return S.rest;
    let prev = P.start, pf = 0;
    const f = S.frac;
    const nodes = P.nodes.map((n) => ({ f: n.f, x: n.p.x, y: n.p.y, p: n.p }));
    if (P.shot) nodes.push({ f: P.shot.f, x: P.shot.x, y: P.shot.y });
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (f < n.f) {
        const t = (f - pf) / Math.max(0.001, n.f - pf);
        const e = t * t * (3 - 2 * t);
        S.carrier = nodes[i].p || null;
        return { x: prev.x + (n.x - prev.x) * e, y: prev.y + (n.y - prev.y) * e };
      }
      prev = n; pf = n.f;
    }
    S.carrier = P.shot ? null : (nodes[nodes.length - 1].p || null);
    return { x: prev.x, y: prev.y };
  }

  // ---------------------------------------------------------------- layout giocatori
  const BASEY = { POR: 348, DIF: 292, CEN: 224, ATT: 160 };
  function layout() {
    ["A", "B"].forEach((team) => {
      const xi = team === "A" ? S.xi : S.oppXI;
      const groups = { POR: [], DIF: [], CEN: [], ATT: [] };
      xi.forEach((p) => groups[p.slotGrp].push(p));
      let shiftC = 0, shiftA = 0, shiftD = 0;
      if (team === "A") {
        const m = { prudente: [10, 14, 6], equil: [0, 0, 0], offensiva: [-12, -14, -8], allin: [-24, -28, -16] }[S.ment];
        shiftC = m[0]; shiftA = m[1]; shiftD = m[2];
        if (S.press === "alto") { shiftD -= 10; shiftC -= 6; } else if (S.press === "basso") { shiftD += 8; shiftC += 8; }
      } else {
        const m = S.opp.id === "dragoni" ? [14, 20, 18] : S.opp.id === "gabbiani" ? [-4, -4, -6] : [0, 0, 0];
        shiftC = m[0]; shiftA = m[1]; shiftD = m[2];
        if (S.oppBuff.atk > 1.1) { shiftC -= 10; shiftA -= 10; shiftD -= 8; } else if (S.oppBuff.def > 1.08) { shiftC += 8; shiftA += 8; shiftD += 8; }
      }
      const pf = S.poss === team ? -9 : 8; // chi ha palla avanza
      const by = S.ball ? (S.ball.y - H / 2) : 0, bx = S.ball ? (S.ball.x - W / 2) : 0;
      Object.keys(groups).forEach((g) => {
        const arr = groups[g];
        arr.forEach((p, i) => {
          const n = arr.length;
          const margin = g === "POR" ? 150 : 46;
          let x = margin + (W - 2 * margin) * (i + 1) / (n + 1);
          let y = BASEY[g] + (g === "POR" ? 0 : (g === "DIF" ? shiftD : g === "CEN" ? shiftC : shiftA) + pf * (g === "DIF" ? 0.5 : 1));
          if (g !== "POR") { x += bx * 0.1; y += by * 0.1; }
          else x += bx * 0.12;
          const wob = Math.sin(performance.now() / 700 + p.num * 1.7) * 3;
          x += wob; y += Math.cos(performance.now() / 900 + p.num) * 2;
          if (team === "B") { y = H - y; x = W - x; }
          p.tx = x; p.ty = clamp(y, 18, H - 18);
        });
      });
    });
    // portiere in tuffo
    if (S.dive && S.dive.on && S.frac > 0.78) {
      const gk = (S.dive.team === "A" ? S.xi : S.oppXI).find((p) => p.slotGrp === "POR");
      if (gk) gk.tx = clamp(S.dive.x, W / 2 - 55, W / 2 + 55);
    }
  }

  // ---------------------------------------------------------------- eventi a scelta
  function scheduleEvents() {
    const ids = ["rigore", "giallo", "contropiede", "punizione", "nonna", "gambe", "pioggia", "arbitro"];
    for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    const mins = [9 + Math.floor(rnd() * 6), 20 + Math.floor(rnd() * 8), 33 + Math.floor(rnd() * 8), 52 + Math.floor(rnd() * 6), 65 + Math.floor(rnd() * 6), 78 + Math.floor(rnd() * 8)];
    return mins.map((m, i) => ({ min: m, id: ids[i] }));
  }

  function forcedShot(team, kind, shooter, q) {
    const res = { team, kind, q, shooter: shooter || (team === "A" ? pickShooterA() : pick(S.oppXI.filter((p) => p.slotGrp !== "POR"))), assist: null };
    applyShot(res);
    return res;
  }
  function byName(n) { return S.xi.find((p) => p.name.indexOf(n) === 0); }
  function weakest() { return S.xi.filter((p) => p.slotGrp !== "POR").sort((a, b) => a.st - b.st)[0]; }
  function penalty(name, prob, extraMorale) {
    const shooter = byName(name) || pickShooterA();
    if (rnd() < prob) { forcedShot("A", "goal", shooter, 0.78); if (extraMorale) S.morale = clamp(S.morale + extraMorale, 0, 100); return `Rete! ${shooter.name.replace(" (C)", "")} spiazza il portiere.`; }
    S.morale = clamp(S.morale - 4, 0, 100);
    forcedShot("A", rnd() < 0.5 ? "save" : "post", shooter, 0.78);
    return `Sbagliato! ${shooter.name.replace(" (C)", "")} si prende il lutto sulle spalle. Morale -4.`;
  }
  function theirChance(q, bonus) { const r = rollShot("B", q, bonus || 0); applyShot(r); return r; }

  const EVENTS = {
    rigore: {
      ico: "🎯", title: "RIGORE PER IL RONDINE!", text: () => "Fallo in area, l'arbitro indica il dischetto. Il pallone pesa come un'ancora. Chi lo calcia?",
      ch: [
        { t: "Dario dal dischetto", s: "Il bomber · circa 80%", go: () => penalty("Dario", 0.8, 0) },
        { t: "Leo, il capitano", s: "Se segna, la squadra decolla · circa 72%", go: () => penalty("Leo", 0.72, 5) },
        { t: "Sandro, il portiere (!)", s: "Leggenda o disastro · circa 25%", go: () => { const r = penalty("Sandro", 0.25, 0); if (r.startsWith("Rete")) { S.morale = clamp(S.morale + 12, 0, 100); return r + " La storia del Borgo è cambiata. Morale +12."; } S.morale = clamp(S.morale - 4, 0, 100); return r + " Almeno ci ha provato. Il Mister si guarda le scarpe."; } }
      ]
    },
    giallo: {
      ico: "🟨", title: "Chicco è sul filo", text: () => "Chicco ha già un giallo e continua a entrare duro. Il fischietto lo guarda con sospetto.",
      ch: [
        { t: "Richiamalo a bordo campo", s: "Più prudente: difesa leggermente meno aggressiva", go: () => { S.buff = { atk: 1, mid: 1, def: 0.97, until: S.min + 12 }; return "Chicco annuisce e smette di fare il boscaiolo. Difesa un filo più morbida per 12'."; } },
        { t: "Lascialo giocare: serve grinta", s: "Difesa più dura, ma 30% di rischio rosso", go: () => { S.buff = { atk: 1, mid: 1, def: 1.04, until: S.min + 12 }; if (rnd() < 0.3) { const c = byName("Chicco") || weakest(); S.xi = S.xi.filter((p) => p !== c); S.stats.reds++; S.stats.cards++; S.morale = clamp(S.morale - 6, 0, 100); reassign(S.form); addLog(`🟥 ESPULSO ${c.name}! Il Rondine resta in dieci.`, "opp"); S.banner = { t: "ROSSO", sub: c.name, col: "#f87171", life: 2 }; return "Il rischio non ha pagato: rosso a Chicco, si gioca in dieci. Morale -6."; } S.stats.cards++; return "Chicco gioca al limite e sopravvive. Difesa più cattiva per 12'."; } },
        { t: "Sostituiscilo ora", s: "Usa un cambio: scegli dalla scheda Squadra", dis: () => S.subsUsed >= 3, go: () => { const c = byName("Chicco"); if (c) S.selOut = c.id; tab = "squadra"; return "Apri la scheda Squadra e scegli chi entra al suo posto."; } }
      ]
    },
    contropiede: {
      ico: "🏃", title: "Palla persa a centrocampo!", text: () => `${S.opp.short}: un rivale è lanciato a rete e davanti a lui c'è solo spazio. Cosa fai?`,
      ch: [
        { t: "Fallo tattico", s: "Giallo certo, ma il pericolo si spegne", go: () => { S.stats.cards++; S.morale = clamp(S.morale - 2, 0, 100); const r = theirChance(0.08, 0); return "Mino lo butta giù: giallo, punizione lontana." + (r.kind === "goal" ? " Ma sulla punizione ci castigano lo stesso!" : ""); } },
        { t: "Rincorri e speri", s: "40% recupero, altrimenti tiro pesante", go: () => { if (rnd() < 0.4) { addLog("🛡️ Chicco recupera in scivolata con un tackle da cinema!", ""); snd("playTackle"); S.morale = clamp(S.morale + 3, 0, 100); return "Scivolata perfetta! Pallone nostro, morale +3."; } theirChance(0.34, 0); return "Troppo tardi: l'attaccante calcia a botta sicura."; } },
        { t: "Sandro esce a valanga", s: "50% lo ferma, altrimenti porta vuota", go: () => { if (rnd() < 0.5) { const g = ourGK(); if (g) { g.saves++; g.bonus += 0.4; } S.gkSaves++; S.morale = clamp(S.morale + 5, 0, 100); addLog("🧤 Sandro esce e gli ruba il pallone dai piedi!", "goal"); return "Sandro vince il duello! Morale +5."; } theirChance(0.62, 0); return "L'attaccante lo salta e la porta è semivuota..."; } }
      ]
    },
    punizione: {
      ico: "🎯", title: "Punizione dal limite", text: () => "Fallo a 22 metri dalla porta, posizione invitante. Il muro è schierato e qualcuno ha già chiuso gli occhi.",
      ch: [
        { t: "Tiro diretto di Leo", s: "Pulito e senza fronzoli", go: () => { const r = rollShot("A", 0.15, 0); r.shooter = byName("Leo") || r.shooter; applyShot(r); return r.kind === "goal" ? "Parabola da urlo, nell'angolino!" : "Non è bastato, ma il boato era già partito."; } },
        { t: "Schema: sponda di Dario", s: "Più pericoloso, ma 40% si inceppa", go: () => { if (rnd() < 0.4) { addLog("😅 Lo schema si inceppa: Leo e Dario si scontrano.", ""); return "Il muro ha riso. Si riparte."; } const r = rollShot("A", 0.26, 0); r.shooter = byName("Dario") || r.shooter; applyShot(r); return r.kind === "goal" ? "Lo schema funziona alla perfezione!" : "Schema riuscito, finale sfortunato."; } },
        { t: "Cross per Chicco in area", s: "Colpo di testa di un difensore", go: () => { const r = rollShot("A", 0.19, 0); r.shooter = byName("Chicco") || r.shooter; applyShot(r); return r.kind === "goal" ? "Colpo di testa vincente! Chicco corre senza fermarsi." : "Svetta Chicco, ma il portiere c'è."; } }
      ]
    },
    nonna: {
      ico: "🧣", title: "In tribuna c'è Nonna Teresa", text: () => "Nonna Teresa, 84 anni, è venuta a vedere il Rondine con la sciarpa del '71 sulle ginocchia. Non ha mai mancato una partita. Il capitano ti guarda: dedicare la partita a lei?",
      ch: [
        { t: "Sì, a gran voce", s: "Morale +9", go: () => { S.morale = clamp(S.morale + 9, 0, 100); S.banner = { t: "PER TERESA", sub: "", col: "#f9a8d4", life: 2 }; return "Tutta la squadra alza la sciarpa verso la tribuna. Vecchi tifosi si asciugano gli occhi. Morale +9."; } },
        { t: "Zitto: si vince in silenzio", s: "Concentrazione: difesa +5% per 12'", go: () => { S.buff = { atk: 1, mid: 1, def: 1.05, until: S.min + 12 }; return "Un cenno col capo e basta. La squadra stringe i denti. Difesa +5% per 12'."; } },
        { t: "Fai suonare il coro del molo", s: "Morale +4, energia +4 a tutti", go: () => { S.morale = clamp(S.morale + 4, 0, 100); S.xi.forEach((p) => { p.st = Math.min(100, p.st + 4); }); return "Il coro parte dal molo e arriva fino al campo. Morale +4, energia +4."; } }
      ]
    },
    gambe: {
      ico: "🥵", title: "Gambe di piombo", text: () => { const w = weakest(); return `${w.name.replace(" (C)", "")} è al ${Math.round(w.st)}% di energia: si trascina sul campo e fa cenno alla panchina.`; },
      ch: [
        { t: "Cambialo", s: "Usa un cambio: scegli dalla scheda Squadra", dis: () => S.subsUsed >= 3, go: () => { const w = weakest(); S.selOut = w.id; tab = "squadra"; return `Apri la scheda Squadra: ${w.name} è già selezionato. Scegli chi entra.`; } },
        { t: "Stringi i denti", s: "Resta, ma -8% energia e +2 morale", go: () => { const w = weakest(); w.st = Math.max(8, w.st - 8); S.morale = clamp(S.morale + 2, 0, 100); return `${w.name} stringe i denti. Il pubblico apprezza, le sue gambe un po' meno.`; } },
        { t: "Gioca a risparmio", s: "Consuma metà energia, ma rende il 95%", go: () => { const w = weakest(); w.eco = true; w.r = Math.round(w.r * 0.96); return `${w.name} ora cammina con intelligenza. Perderà meno fiato per il resto della partita.`; } }
      ]
    },
    pioggia: {
      ico: "🌧️", title: "Piove sul molo", text: () => "Un temporale arriva da mare: il pallone diventa un sapone e il campo una pista di pattinaggio. Come cambi il gioco?",
      ch: [
        { t: "Palla a terra, tocchi brevi", s: "Centrocampo +8% per 15'", go: () => { S.buff = { atk: 1, mid: 1.08, def: 1, until: S.min + 15 }; return "Passaggi corti e nessuna follia. Centrocampo +8% per 15'."; } },
        { t: "Lanci lunghi per gli attaccanti", s: "Attacco +10%, difesa -4% per 12'", go: () => { S.buff = { atk: 1.1, mid: 1, def: 0.96, until: S.min + 12 }; return "Palloni alti e speranza. Attacco +10%, difesa -4% per 12'."; } },
        { t: "Tutti sotto la pioggia, cantando", s: "Morale +6, energia -3", go: () => { S.morale = clamp(S.morale + 6, 0, 100); S.xi.forEach((p) => { p.st = Math.max(8, p.st - 3); }); return "Una squadra che canta sotto l'acqua è una squadra che non ha paura. Morale +6, energia -3."; } }
      ]
    },
    arbitro: {
      ico: "📣", title: "L'arbitro non convince", text: () => "Il direttore di gara, nella vita pescivendolo, ha appena fischiato un fallo che non esisteva. La panchina ribolle.",
      ch: [
        { t: "Vai a protestare", s: "45% giallo al Mister, +5 morale", go: () => { S.morale = clamp(S.morale + 5, 0, 100); if (rnd() < 0.45) { S.stats.cards++; return "Giallo per te, ma i ragazzi ti hanno visto lottare. Morale +5 (e una brutta figura)."; } return "Protesta vibrante e nessuna conseguenza. Morale +5."; } },
        { t: "Resta seduto, respira", s: "Nessun rischio, morale -2", go: () => { S.morale = clamp(S.morale - 2, 0, 100); return "Mister zen, ma i ragazzi sbuffano. Morale -2."; } },
        { t: "Ironizza: «Le compro io gli occhiali»", s: "50% ridono tutti (+5), 50% gelo (-3)", go: () => { if (rnd() < 0.5) { S.morale = clamp(S.morale + 5, 0, 100); return "L'arbitro sorride: l'ironia ha sciolto il clima. Morale +5."; } S.morale = clamp(S.morale - 3, 0, 100); return "Silenzio di tomba. L'arbitro annota qualcosa. Morale -3."; } }
      ]
    }
  };

  // ---------------------------------------------------------------- UI: schermate
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function stars(n) { return `<span class="mdx-stars">${"★".repeat(n)}<span>${"★".repeat(3 - n)}</span></span>`; }

  function showMenu() {
    stopLoop();
    S = null;
    prog = loadProg();
    const rk = rankOf(prog.pts);
    const nxt = RANKS[rk + 1];
    const pct = nxt ? Math.round(((prog.pts - RANKS[rk].pts) / (nxt.pts - RANKS[rk].pts)) * 100) : 100;
    root.innerHTML = `<div class="mdx-scr mdx-menu">
      <div style="display:flex;gap:10px;align-items:flex-start;justify-content:space-between">
        <div><h1 class="mdx-h1">📋 Matchday Director</h1>
        <p class="mdx-sub">Tu sei il Mister del Rondine FC. Il pallone lo calciano gli altri: tu decidi modulo, mentalità, pressing, cambi e che cosa urlare all'intervallo.</p></div>
        <button class="mdx-btn red" id="mdxExit" style="flex:none;min-width:48px" aria-label="Chiudi">✕</button>
      </div>
      <div class="mdx-card">
        <div class="mdx-rank"><div style="font-size:30px">🧢</div><div style="flex:1;min-width:0">
          <b style="font-size:15px">${esc(RANKS[rk].t)}</b>
          <div style="font-size:11.5px;color:#93a4bd;margin:1px 0 5px">${prog.wins}V · ${prog.draws}N · ${prog.losses}P &nbsp;·&nbsp; gol ${prog.gf}-${prog.ga} &nbsp;·&nbsp; ${prog.pts} punti</div>
          <div class="mdx-bar"><i style="width:${pct}%"></i></div>
          <div style="font-size:11px;color:#64748b;margin-top:3px">${nxt ? `Prossimo grado: ${esc(nxt.t)} (${nxt.pts} punti)` : "Grado massimo raggiunto. Il Faro è fiero di te."}</div>
        </div></div>
        <div style="margin-top:6px">${Object.keys(FORMS).map((f) => `<span class="mdx-chip ${formUnlocked(prog, f) ? "g" : ""}">${formUnlocked(prog, f) ? "✔" : "🔒"} ${f}${formUnlocked(prog, f) ? "" : " (" + FORMS[f].unlock.label + ")"}</span>`).join("")}</div>
      </div>
      <div style="margin:14px 0 2px;font-weight:800;font-size:13px;color:#93a4bd;letter-spacing:.5px">SCEGLI L'AVVERSARIO · prima vittoria su ognuno: +3 monete</div>
      ${OPPS.map((o, i) => {
        const e = prog.opp[o.id] || { stars: 0, played: 0, wins: 0, best: "" };
        const un = oppUnlocked(prog, i);
        return `<button class="mdx-opp ${un ? "" : "lock"}" data-opp="${i}" ${un ? "" : "disabled"}>
          <div class="ic">${un ? o.ico : "🔒"}</div>
          <div style="flex:1;min-width:0"><b>${esc(o.name)}</b>
          <small>${un ? esc(o.style) + " · " + esc(o.hint) : "Sblocca battendo " + esc(OPPS[i - 1].short)}</small></div>
          <div style="text-align:right;flex:none">${stars(e.stars)}<small>${e.played ? "Record " + esc(e.best || "-") : "Mai giocata"}</small></div>
        </button>`;
      }).join("")}
      <p class="mdx-sub" style="margin-top:12px">Una partita dura circa 3 minuti (puoi accelerare). Stelle: ★ vittoria · ★★ con 2 gol di scarto o porta inviolata · ★★★ obiettivo speciale del match.</p>
    </div>`;
    root.querySelector("#mdxExit").onclick = exitAll;
    root.querySelectorAll("[data-opp]").forEach((b) => { b.onclick = () => { snd("playSelect"); startPrep(OPPS[Number(b.dataset.opp)]); }; });
  }

  function startPrep(opp) {
    newMatch(opp, formUnlocked(prog, prog.lastForm) ? prog.lastForm : "4-3-3", prog.lastMent, prog.lastPress);
    tab = "ordini";
    buildMatchUI();
    openKickoff();
    startLoop();
  }

  function buildMatchUI() {
    root.innerHTML = `<div class="mdx-scr" id="mdxMatch">
      <div class="mdx-top">
        <button class="mdx-btn" id="mdxX" aria-label="Esci">✕</button>
        <button class="mdx-btn" id="mdxTO" style="min-width:64px">⏱ 2</button>
        <div style="flex:1"></div>
        <button class="mdx-btn gold" id="mdxPlay" style="min-width:52px">▶</button>
        <button class="mdx-btn" data-sp="1">1×</button><button class="mdx-btn" data-sp="2">2×</button><button class="mdx-btn" data-sp="4">4×</button>
      </div>
      <div class="mdx-sb"><div class="tn" id="mdxTA">Rondine FC</div><div class="sc"><span id="mdxSc">0 - 0</span><small id="mdxMin">0'</small></div><div class="tn r" id="mdxTB"></div></div>
      <div class="mdx-prog"><i id="mdxPr"></i></div>
      <canvas class="mdx-cv" id="mdxCv"></canvas>
      <div class="mdx-strip" id="mdxStrip"></div>
      <div class="mdx-tick" id="mdxTick"></div>
      <div class="mdx-tabs"><button data-tab="ordini">📋 Ordini</button><button data-tab="squadra">👕 Squadra</button><button data-tab="log">📜 Cronaca</button></div>
      <div class="mdx-pan" id="mdxPan"></div>
      <div class="mdx-sheet" id="mdxSheet" style="display:none"></div>
    </div>`;
    canvas = root.querySelector("#mdxCv");
    ctx = canvas.getContext("2d");
    sheetEl = root.querySelector("#mdxSheet");
    cw = 0;
    root.querySelector("#mdxTB").textContent = S.opp.name;
    root.querySelector("#mdxX").onclick = confirmExit;
    root.querySelector("#mdxPlay").onclick = toggleRun;
    root.querySelector("#mdxTO").onclick = useTimeout;
    root.querySelectorAll("[data-sp]").forEach((b) => { b.onclick = () => { S.speed = Number(b.dataset.sp); snd("playSelect"); refreshLive(); }; });
    root.querySelectorAll("[data-tab]").forEach((b) => { b.onclick = () => { tab = b.dataset.tab; renderPanel(); snd("playSelect"); }; });
    renderPanel(); refreshLive(); updateScoreboard(); updateTicker();
  }

  function toggleRun() {
    if (!S || S.over || S.ended) return;
    if (!S.started) { S.started = true; snd("playWhistle", true); addLog("🔔 Fischio d'inizio! Si comincia.", "tip"); }
    S.run = !S.run;
    refreshLive();
  }

  function useTimeout() {
    if (!S || S.ended || S.over || S.timeouts <= 0 || !S.started || S.min >= 89) return;
    S.timeouts--; S.run = false;
    S.xi.forEach((p) => { p.st = Math.min(100, p.st + 10); });
    S.morale = clamp(S.morale + 3, 0, 100);
    S.oppStam = Math.min(100, S.oppStam + 3);
    addLog("⏱ TIMEOUT! Energia +10 a tutti e morale +3. Rifiata e ragiona.", "tip");
    tab = "ordini"; renderPanel(); refreshLive(); snd("playWhistle", false);
  }

  function confirmExit() {
    if (!S) { exitAll(); return; }
    if (S.ended) { showMenu(); return; }
    const was = S.run; S.run = false; S.over = true;
    openSheet(`<h2>Lasciare la panchina?</h2><p>La partita in corso <b>non verrà registrata</b>: niente punti, niente premi.</p>
      <div class="mdx-g2"><button class="mdx-btn" id="mdxStay">Resta</button><button class="mdx-btn red" id="mdxLeave">Esci</button></div>`);
    sheetEl.querySelector("#mdxStay").onclick = () => { closeSheet(); S.over = false; S.run = was; refreshLive(); };
    sheetEl.querySelector("#mdxLeave").onclick = () => { closeSheet(); showMenu(); };
  }

  function openSheet(html, full) {
    sheetEl.className = "mdx-sheet" + (full ? " full" : "");
    sheetEl.innerHTML = `<div class="mdx-sh">${html}</div>`;
    sheetEl.style.display = "flex";
  }
  function closeSheet() { if (sheetEl) { sheetEl.style.display = "none"; sheetEl.innerHTML = ""; } }

  function openKickoff() {
    const o = S.opp;
    S.over = true;
    openSheet(`<h2>${o.ico} Rondine FC vs ${esc(o.name)}</h2>
      <p>${esc(o.blurb)}</p>
      <div><span class="mdx-chip y">Stile: ${esc(o.style)}</span><span class="mdx-chip">Modulo: ${o.form}</span></div>
      <div class="mdx-res">💡 <b>Dritta del vice:</b> ${esc(o.hint)}<br>🎯 <b>Obiettivo ★★★:</b> ${esc(o.goal)}</div>
      <p style="font-size:12.5px;color:#93a4bd">Scegli modulo, mentalità e pressing nella scheda Ordini. Puoi cambiarli quando vuoi (anche in pausa). Hai 3 cambi e 2 timeout.</p>
      <div class="mdx-g2"><button class="mdx-btn" id="mdxSet">Imposta la squadra</button><button class="mdx-btn gold" id="mdxGo">Fischio d'inizio!</button></div>`);
    sheetEl.querySelector("#mdxSet").onclick = () => { closeSheet(); S.over = false; };
    sheetEl.querySelector("#mdxGo").onclick = () => { closeSheet(); S.over = false; toggleRun(); };
  }

  // ---------------------------------------------------------------- pannello
  function staminaCol(v) { return v > 60 ? "#4ade80" : v > 35 ? "#facc15" : "#f87171"; }

  function renderPanel() {
    const pan = root && root.querySelector("#mdxPan");
    if (!pan || !S) return;
    root.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
    if (tab === "ordini") {
      pan.innerHTML = `
        <div class="mdx-lbl">Modulo <em>${esc(FORMS[S.form].info)}</em></div>
        <div class="mdx-g4">${Object.keys(FORMS).map((f) => { const ok = formUnlocked(prog, f); return `<button class="mdx-btn ${S.form === f ? "on" : ""}" data-form="${f}" ${ok ? "" : "disabled"}>${ok ? f : "🔒 " + f}</button>`; }).join("")}</div>
        <div class="mdx-lbl">Mentalità <em></em></div>
        <div class="mdx-g4">${Object.keys(MENT).map((k) => `<button class="mdx-btn ${S.ment === k ? "on" : ""}" data-ment="${k}">${MENT[k].ico}<br>${MENT[k].t}</button>`).join("")}</div>
        <div class="mdx-fx">${esc(MENT[S.ment].info)}</div>
        <div class="mdx-lbl">Pressing <em></em></div>
        <div class="mdx-g3">${Object.keys(PRESS).map((k) => `<button class="mdx-btn ${S.press === k ? "on" : ""}" data-press="${k}">${PRESS[k].ico} ${PRESS[k].t}</button>`).join("")}</div>
        <div class="mdx-fx">${esc(PRESS[S.press].info)}</div>
        <div class="mdx-fx" style="margin-top:8px;color:#64748b">⏱ Timeout: ${S.timeouts} · Cambi: ${3 - S.subsUsed}/3${S.confuse > 0 ? " · ⚠️ squadra disorientata dal cambio modulo" : ""}</div>`;
      pan.querySelectorAll("[data-form]").forEach((b) => { b.onclick = () => setForm(b.dataset.form); });
      pan.querySelectorAll("[data-ment]").forEach((b) => { b.onclick = () => { S.ment = b.dataset.ment; snd("playSelect"); addLog(`📢 Mentalità: ${MENT[S.ment].t.toUpperCase()}.`, "tip"); renderPanel(); }; });
      pan.querySelectorAll("[data-press]").forEach((b) => { b.onclick = () => { S.press = b.dataset.press; snd("playSelect"); addLog(`📢 Pressing: ${PRESS[S.press].t.toUpperCase()}.`, "tip"); renderPanel(); }; });
    } else if (tab === "squadra") {
      const row = (p, kind) => `<button class="mdx-row ${S.selOut === p.id ? "sel" : ""}" data-${kind}="${p.id}"><span class="top"><span class="n">${p.num}</span><span class="nm">${esc(p.name)}</span><span class="gp">${p.slotGrp === p.grp ? p.grp : p.slotGrp + "*"}</span></span><span class="bot"><span class="sb"><i data-st="${p.id}" style="width:${Math.round(p.st)}%;background:${staminaCol(p.st)}"></i></span><span class="pc" data-stt="${p.id}">${Math.round(p.st)}</span></span></button>`;
      const out = S.xi.slice().sort((a, b) => ["POR", "DIF", "CEN", "ATT"].indexOf(a.slotGrp) - ["POR", "DIF", "CEN", "ATT"].indexOf(b.slotGrp));
      const bench = S.bench.filter((p) => !p.off);
      pan.innerHTML = `<div class="mdx-lbl">In campo <em>Tocca chi esce, poi chi entra · cambi ${3 - S.subsUsed}/3</em></div>
        <div class="mdx-g2">${out.map((p) => row(p, "xi")).join("")}</div>
        <div class="mdx-lbl">In panchina <em>* = fuori ruolo (rende meno)</em></div>
        <div class="mdx-g2">${bench.length ? bench.map((p) => row(p, "bn")).join("") : '<div class="mdx-fx">Panchina vuota.</div>'}</div>`;
      pan.querySelectorAll("[data-xi]").forEach((b) => { b.onclick = () => { const p = S.xi.find((x) => x.id === Number(b.dataset.xi)); if (p.slotGrp === "POR") { toastMsg("Il portiere titolare non si cambia."); return; } S.selOut = S.selOut === p.id ? null : p.id; snd("playSelect"); renderPanel(); }; });
      pan.querySelectorAll("[data-bn]").forEach((b) => { b.onclick = () => doSub(Number(b.dataset.bn)); });
    } else {
      pan.innerHTML = `<div class="mdx-log">${S.log.map((l) => `<div class="${l.c}"><b>${l.m}'</b>${esc(l.t)}</div>`).join("")}</div>`;
    }
  }

  function toastMsg(t) { try { if (window.toast) window.toast(t, "info", "📋"); } catch (e) { /* noop */ } addLog(t, "tip"); }

  function setForm(f) {
    if (f === S.form || !formUnlocked(prog, f)) return;
    S.form = f; reassign(f);
    S.confuse = 3;
    snd("playSelect");
    const adapted = S.xi.filter((p) => p.slotGrp !== p.grp && p.slotGrp !== "POR").map((p) => p.name.replace(" (C)", ""));
    addLog(`🔄 Nuovo modulo: ${f}.${adapted.length ? " Adattati fuori ruolo: " + adapted.join(", ") + "." : ""} La squadra è un po' disorientata (3').`, "tip");
    renderPanel();
  }

  function doSub(benchId) {
    if (S.selOut == null) { toastMsg("Scegli prima chi esce (tocca un giocatore in campo)."); return; }
    if (S.subsUsed >= 3) { toastMsg("Hai finito i cambi."); return; }
    const out = S.xi.find((p) => p.id === S.selOut), inn = S.bench.find((p) => p.id === benchId);
    if (!out || !inn) return;
    inn.slotGrp = out.slotGrp; inn.x = out.x; inn.y = out.y; inn.st = Math.min(100, Math.max(inn.st, 92));
    out.off = true; S.bench.push(Object.assign(out, { off: true }));
    S.xi[S.xi.indexOf(out)] = inn;
    inn.bench = false; S.bench = S.bench.filter((p) => p !== inn);
    S.subsUsed++; S.selOut = null;
    S.morale = clamp(S.morale + 1, 0, 100);
    const oop = inn.grp !== inn.slotGrp ? " (fuori ruolo)" : "";
    addLog(`🔁 Cambio: esce ${out.name.replace(" (C)", "")}, entra ${inn.name}${oop}.`, "tip");
    snd("playSelect");
    renderPanel(); refreshLive();
  }

  // ---------------------------------------------------------------- aggiornamenti UI
  function updateScoreboard() {
    if (!root || !S) return;
    const sc = root.querySelector("#mdxSc"); if (!sc) return;
    sc.textContent = `${S.scoreA} - ${S.scoreB}`;
    root.querySelector("#mdxMin").textContent = S.ended ? "FINE" : `${S.min}'`;
    root.querySelector("#mdxPr").style.width = (S.min / 90 * 100) + "%";
  }
  function updateTicker() {
    const t = root && root.querySelector("#mdxTick"); if (!t || !S) return;
    t.innerHTML = S.log.slice(0, 2).map((l) => `<div>${l.m}' ${esc(l.t)}</div>`).join("");
  }
  function refreshLive() {
    if (!root || !S) return;
    const play = root.querySelector("#mdxPlay"); if (!play) return;
    play.textContent = S.run ? "❚❚" : "▶";
    root.querySelectorAll("[data-sp]").forEach((b) => b.classList.toggle("on", Number(b.dataset.sp) === S.speed));
    const to = root.querySelector("#mdxTO");
    to.textContent = "⏱ " + S.timeouts; to.disabled = !(S.timeouts > 0 && S.started && S.min < 89 && !S.ended);
    const pa = S.posTotal ? Math.round(S.posA / S.posTotal * 100) : 50;
    const strip = root.querySelector("#mdxStrip");
    strip.innerHTML = `<div>Possesso ${pa}%<div class="pb"><i style="width:${pa}%"></i></div></div><div>Tiri ${S.shotsA}-${S.shotsB}</div><div>xG ${S.xgA.toFixed(1)}-${S.xgB.toFixed(1)}</div><div>Morale ${Math.round(S.morale)}<div class="pb" style="background:#1c2b44"><i style="width:${S.morale}%;background:${S.morale > 60 ? "#4ade80" : S.morale > 35 ? "#facc15" : "#f87171"}"></i></div></div>`;
    if (tab === "squadra") S.xi.concat(S.bench).forEach((p) => {
      const b = root.querySelector(`[data-st="${p.id}"]`); if (b) { b.style.width = Math.round(p.st) + "%"; b.style.background = staminaCol(p.st); }
      const t = root.querySelector(`[data-stt="${p.id}"]`); if (t) t.textContent = Math.round(p.st);
    });
  }

  // ---------------------------------------------------------------- loop
  function startLoop() { stopLoop(); lastT = performance.now(); rafId = requestAnimationFrame(loop); }
  function stopLoop() { if (rafId) cancelAnimationFrame(rafId); rafId = 0; }

  function loop(t) {
    rafId = requestAnimationFrame(loop);
    if (!S || !ctx) return;
    const dt = Math.min(0.05, (t - lastT) / 1000); lastT = t;
    tick(dt);
    draw(dt);
  }

  function tick(dt) {
    if (S.run && !S.over && !S.ended) {
      const ms = STEP_MS[S.speed] || 1400;
      if (S.needStep) {
        const ev = S.events[S.evIdx];
        if (ev && ev.min <= S.min + 1) { S.evIdx++; openEvent(ev); return; }
        stepMinute(); S.needStep = false; S.acc = 0;
      }
      S.acc += dt * 1000;
      S.frac = clamp(S.acc / ms, 0, 1);
      S.pend = S.pend.filter((e) => { if (S.frac >= e.f) { e.fn(); return false; } return true; });
      if (S.frac >= 1) endMinute();
    }
    // movimento
    layout();
    const k = Math.min(1, dt * (S.run ? 3.2 : 2));
    S.xi.concat(S.oppXI).forEach((p) => { p.x += (p.tx - p.x) * k; p.y += (p.ty - p.y) * k; });
    S.ball = ballPos();
    // coriandoli e testi
    S.parts = S.parts.filter((p) => { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 260 * dt; return p.life > 0; });
    if (S.banner) { S.banner.life -= dt; if (S.banner.life <= 0) S.banner = null; }
    if (S.shake > 0) S.shake = Math.max(0, S.shake - dt * 22);
  }

  function endMinute() {
    S.pend.forEach((e) => e.fn()); S.pend = [];
    S.rest = { x: S.ball.x, y: S.ball.y };
    S.needStep = true; S.frac = 0; S.acc = 0;
    if (S.min >= 90) { finishMatch(); return; }
    if (S.min === 45 && !S.htDone) { S.htDone = true; openHalftime(); }
  }

  // ---------------------------------------------------------------- eventi/intervallo
  function openEvent(ev) {
    const def = EVENTS[ev.id];
    S.over = true;
    snd("playWhistle", false);
    S.banner = { t: def.title.length < 20 ? def.title : "EPISODIO", sub: "", col: "#c4b5fd", life: 1.6 };
    addLog(`${def.ico} ${def.title}`, "ev");
    openSheet(`<h2>${def.ico} ${esc(def.title)}</h2><p>${esc(def.text())}</p>
      ${def.ch.map((c, i) => `<button class="mdx-btn mdx-ch" data-c="${i}" ${c.dis && c.dis() ? "disabled" : ""}>${esc(c.t)}<small>${esc(typeof c.s === "string" ? c.s : "")}</small></button>`).join("")}`);
    sheetEl.querySelectorAll("[data-c]").forEach((b) => {
      b.onclick = () => {
        const c = def.ch[Number(b.dataset.c)];
        snd("playSelect");
        const prevTab = tab;
        let res = "";
        try { res = c.go(); } catch (e) { res = "Il Mister ha deciso. Si riparte."; }
        if (res) addLog(res, "ev");
        updateScoreboard(); refreshLive();
        openSheet(`<h2>${def.ico} ${esc(def.title)}</h2><div class="mdx-res">${esc(res)}</div>
          <p style="color:#93a4bd;font-size:12.5px">Morale squadra: ${Math.round(S.morale)}/100</p>
          <button class="mdx-btn gold mdx-ch" id="mdxCont">Avanti</button>`);
        sheetEl.querySelector("#mdxCont").onclick = () => { closeSheet(); S.over = false; renderPanel(); };
        void prevTab;
      };
    });
  }

  function openHalftime() {
    S.over = true; S.run = true; // resta "run" per ripartire dopo la scelta
    snd("playWhistle", true);
    S.xi.forEach((p) => { p.st = Math.min(100, p.st + 8); });
    S.oppStam = Math.min(100, S.oppStam + 8);
    const lose = S.scoreA < S.scoreB, win = S.scoreA > S.scoreB;
    addLog(`🔔 Intervallo: Rondine ${S.scoreA}-${S.scoreB} ${S.opp.short}.`, "tip");
    const speeches = [
      { t: "«Calma. Rifacciamo tutto con ordine.»", s: "Sicuro: morale +4", go: () => { S.morale = clamp(S.morale + 4, 0, 100); return "Voce bassa, schemi chiari. La squadra rientra concentrata. Morale +4."; } },
      { t: "«Che vi siete mangiati, il pesce di ieri?»", s: "Funziona se sei sotto o pari (+10), se vinci li irrita (-3)", go: () => { if (win) { S.morale = clamp(S.morale - 3, 0, 100); return "Ma stiamo vincendo, Mister... I ragazzi ti guardano storto. Morale -3."; } S.morale = clamp(S.morale + 10, 0, 100); return "Il ceffone verbale funziona: occhi di brace. Morale +10."; } },
      { t: "«Ricordate perché giochiamo: Tonino al molo.»", s: "Commovente: morale +6, energia +4", go: () => { S.morale = clamp(S.morale + 6, 0, 100); S.xi.forEach((p) => { p.st = Math.min(100, p.st + 4); }); return "Tonino, il vecchio custode del molo, ripeteva sempre: «Il pallone è di tutti, anche di chi non lo prende». Qualcuno si soffia il naso. Morale +6, energia +4."; } },
      { t: "Battuta sul fischietto dell'arbitro", s: "60% scoppiano a ridere (+8), 40% gelo (-2)", go: () => { if (rnd() < 0.6) { S.morale = clamp(S.morale + 8, 0, 100); return "Risate liberatorie nello spogliatoio. Morale +8."; } S.morale = clamp(S.morale - 2, 0, 100); return "Nessuno ride. Sandro tossisce. Morale -2."; } }
    ];
    openSheet(`<h2>🔔 Intervallo · ${S.scoreA}-${S.scoreB}</h2>
      <div><span class="mdx-chip">Tiri ${S.shotsA}-${S.shotsB}</span><span class="mdx-chip">xG ${S.xgA.toFixed(1)}-${S.xgB.toFixed(1)}</span><span class="mdx-chip">Possesso ${S.posTotal ? Math.round(S.posA / S.posTotal * 100) : 50}%</span><span class="mdx-chip g">Energia +8</span></div>
      <p>${lose ? "Siamo sotto e lo spogliatoio è muto." : win ? "Si vince, ma nessuno si fida." : "Pari e patta: chi la spunta nel secondo tempo?"} Cosa dici alla squadra?</p>
      ${speeches.map((c, i) => `<button class="mdx-btn mdx-ch" data-c="${i}">${esc(c.t)}<small>${esc(c.s)}</small></button>`).join("")}
      <p style="font-size:12px;color:#93a4bd;margin-top:10px">Puoi anche modificare Ordini e Squadra dopo il discorso, prima di far ripartire.</p>`);
    sheetEl.querySelectorAll("[data-c]").forEach((b) => {
      b.onclick = () => {
        snd("playSelect");
        const res = speeches[Number(b.dataset.c)].go();
        addLog("🗣️ " + res, "ev");
        openSheet(`<h2>🗣️ Il discorso</h2><div class="mdx-res">${esc(res)}</div><p style="font-size:12.5px;color:#93a4bd">Morale: ${Math.round(S.morale)}/100. Cambi o ordini? Chiudi questa finestra, poi tocca ▶ quando sei pronto.</p>
          <div class="mdx-g2"><button class="mdx-btn" id="mdxPause2">Rivedo la squadra</button><button class="mdx-btn gold" id="mdxResume">Secondo tempo!</button></div>`);
        sheetEl.querySelector("#mdxPause2").onclick = () => { closeSheet(); S.over = false; S.run = false; tab = "squadra"; renderPanel(); refreshLive(); };
        sheetEl.querySelector("#mdxResume").onclick = () => { closeSheet(); S.over = false; S.run = true; snd("playWhistle", false); addLog("🔔 Si riparte!", "tip"); renderPanel(); refreshLive(); };
      };
    });
  }

  // ---------------------------------------------------------------- fine partita
  function finishMatch() {
    S.ended = true; S.run = false; S.over = true;
    stopLoopSoft();
    snd("playWhistle", true);
    const o = S.opp;
    const win = S.scoreA > S.scoreB, draw = S.scoreA === S.scoreB;
    const before = { rank: rankOf(prog.pts), wins: prog.wins, opps: OPPS.map((_, i) => oppUnlocked(prog, i)) };
    const margin = S.scoreA - S.scoreB;
    const s2 = win && (margin >= 2 || S.scoreB === 0);
    const goalMet = !!GOAL_CHECK[o.id](S);
    const s3 = win && goalMet;
    const nStars = (win ? 1 : 0) + (s2 ? 1 : 0) + (s3 ? 1 : 0);
    const e = prog.opp[o.id] || { stars: 0, wins: 0, played: 0, best: "" };
    const oldStars = e.stars;
    e.played++; if (win) e.wins++;
    const score = `${S.scoreA}-${S.scoreB}`;
    if (win && (!e.best || (S.scoreA - S.scoreB) > bestMargin(e.best))) e.best = score; else if (!e.best) e.best = score;
    e.stars = Math.max(e.stars, nStars);
    prog.opp[o.id] = e;
    prog.played++; prog.gf += S.scoreA; prog.ga += S.scoreB;
    if (win) prog.wins++; else if (draw) prog.draws++; else prog.losses++;
    const gained = (win ? 3 : draw ? 1 : 0) + Math.max(0, nStars - oldStars);
    prog.pts += gained;
    prog.lastForm = S.form; prog.lastMent = S.ment; prog.lastPress = S.press;
    let coin = 0;
    if (win && !prog.coins[o.id] && typeof window.addCoins === "function") { try { window.addCoins(3); coin = 3; prog.coins[o.id] = true; } catch (er) { /* noop */ } }
    saveProg(prog);

    // pagella
    const played = S.squad.filter((p) => p.mins >= 15 || (p.grp === "POR"));
    const cleanSheet = S.scoreB === 0;
    const ratings = played.map((p) => {
      let v = 6 + p.goals * 1.1 + p.assists * 0.6 + p.saves * 0.2 + p.bonus + (win ? 0.4 : draw ? 0.1 : -0.3) + (rnd() - 0.5) * 0.7;
      if (p.slotGrp === "POR" && cleanSheet) v += 0.6;
      if (p.slotGrp === "DIF" && cleanSheet) v += 0.3;
      if (p.slotGrp === "DIF" && S.scoreB >= 3) v -= 0.5;
      if (p.mins < 40 && p.grp !== "POR") v = 5.8 + (v - 6) * 0.5;
      return { p, v: clamp(Math.round(v * 10) / 10, 4.5, 10) };
    }).sort((a, b) => b.v - a.v);
    const mvp = ratings[0];

    const afterRank = rankOf(prog.pts);
    const news = [];
    if (afterRank > before.rank) news.push(`🧢 Promozione: ora sei <b>${esc(RANKS[afterRank].t)}</b>!`);
    Object.keys(FORMS).forEach((f) => { const u = FORMS[f].unlock; if (u && before.wins < u.wins && prog.wins >= u.wins) news.push(`🔓 Nuovo modulo sbloccato: <b>${f}</b>`); });
    OPPS.forEach((op, i) => { if (!before.opps[i] && oppUnlocked(prog, i)) news.push(`🔓 Nuova sfida: <b>${esc(op.name)}</b>`); });
    if (coin) news.push(`🪙 Prima vittoria su ${esc(o.short)}: <b>+${coin} monete</b>`);

    const headline = win ? pick(["VITTORIA! Il Borgo canta.", "TRE PUNTI! Il molo applaude.", "Vittoria da Mister vero."]) : draw ? pick(["Pareggio: nessuno è contento, nessuno è triste.", "Un punto a testa e tanto fiatone."]) : pick(["Sconfitta. Domani si riparte.", "Ko. Le lacrime però sono pulite."]);
    openSheet(`<div style="font-size:12px;color:#93a4bd;text-align:center">${esc(o.name)} · Fischio finale</div>
      <div class="mdx-big">${S.scoreA} - ${S.scoreB}</div>
      <h2 style="text-align:center">${esc(headline)}</h2>
      <div style="text-align:center;font-size:24px;margin:2px 0">${stars(nStars)}</div>
      <div style="text-align:center">
        <span class="mdx-chip ${win ? "g" : ""}">★ Vittoria</span><span class="mdx-chip ${s2 ? "g" : ""}">★★ 2 gol di scarto o porta inviolata</span><span class="mdx-chip ${s3 ? "g" : ""}">★★★ ${esc(o.goal)}</span>
      </div>
      ${news.length ? `<div class="mdx-res">${news.join("<br>")}</div>` : ""}
      <div class="mdx-res">+${gained} punti Mister · Tiri ${S.shotsA}-${S.shotsB} · xG ${S.xgA.toFixed(1)}-${S.xgB.toFixed(1)} · Possesso ${S.posTotal ? Math.round(S.posA / S.posTotal * 100) : 50}%</div>
      <div class="mdx-lbl">Pagella</div>
      ${ratings.map((r, i) => `<div class="mdx-pg"><i class="${i === 0 ? "mvp" : r.v >= 7 ? "hi" : r.v < 5.5 ? "lo" : ""}">${r.v.toFixed(1)}</i><span>${esc(r.p.name)}${i === 0 ? " ⭐ MVP" : ""}</span><small>${r.p.goals ? "⚽" + r.p.goals + " " : ""}${r.p.assists ? "🅰️" + r.p.assists + " " : ""}${r.p.saves && r.p.slotGrp === "POR" ? "🧤" + r.p.saves : ""}</small></div>`).join("")}
      <div class="mdx-g2" style="margin-top:12px"><button class="mdx-btn" id="mdxMenu">Menu sfide</button><button class="mdx-btn gold" id="mdxAgain">Rivincita</button></div>
      <button class="mdx-btn" id="mdxLeave2" style="width:100%;margin-top:8px">Esci</button>`, true);
    void mvp;
    sheetEl.querySelector("#mdxMenu").onclick = showMenu;
    sheetEl.querySelector("#mdxAgain").onclick = () => startPrep(o);
    sheetEl.querySelector("#mdxLeave2").onclick = exitAll;
    updateScoreboard();
    refreshLive();
  }
  function bestMargin(s) { const m = /^(\d+)-(\d+)$/.exec(s || ""); return m ? Number(m[1]) - Number(m[2]) : -99; }
  function stopLoopSoft() { /* il loop continua per animare il campo finale */ }

  // ---------------------------------------------------------------- disegno
  function draw(dt) {
    const cssW = canvas.clientWidth, cssH = canvas.clientHeight;
    if (!cssW) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cw !== cssW * dpr) { canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr); cw = cssW * dpr; }
    const sc = cssW / W;
    ctx.setTransform(dpr * sc, 0, 0, dpr * sc, 0, 0);
    ctx.save();
    if (S.shake > 0) ctx.translate((rnd() - 0.5) * S.shake, (rnd() - 0.5) * S.shake);
    drawPitch();
    drawZones();
    // scia passaggi
    const P = S.path;
    if (P && S.run) {
      ctx.strokeStyle = P.team === "A" ? "rgba(125,211,252,.55)" : "rgba(252,165,165,.5)";
      ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath();
      ctx.moveTo(P.start.x, P.start.y);
      P.nodes.forEach((n) => { if (S.frac >= n.f - 0.001) ctx.lineTo(n.p.x, n.p.y); });
      ctx.stroke(); ctx.setLineDash([]);
    }
    S.oppXI.forEach((p) => drawPlayer(p, "B"));
    S.xi.forEach((p) => drawPlayer(p, "A"));
    // palla
    const b = S.ball;
    ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(b.x + 1, b.y + 5, 5, 2, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(b.x, b.y, 5, 0, 7); ctx.fill();
    ctx.strokeStyle = "#111"; ctx.lineWidth = 1.2; ctx.stroke();
    // coriandoli
    S.parts.forEach((p) => { ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 4, 4); });
    ctx.restore();
    // banner
    if (S.banner) {
      const bn = S.banner, a = clamp(bn.life / 0.5, 0, 1), sz = 30 + Math.max(0, bn.life - 1.6) * 20;
      ctx.globalAlpha = a; ctx.textAlign = "center";
      ctx.fillStyle = "rgba(0,0,0,.55)"; ctx.fillRect(0, H / 2 - 34, W, 68);
      ctx.fillStyle = bn.col; ctx.font = `900 ${sz}px system-ui,sans-serif`; ctx.fillText(bn.t, W / 2, H / 2 + 6);
      if (bn.sub) { ctx.fillStyle = "#fff"; ctx.font = "700 14px system-ui,sans-serif"; ctx.fillText(bn.sub, W / 2, H / 2 + 26); }
      ctx.globalAlpha = 1;
    }
    // etichetta in pausa
    if (!S.run && !S.over && !S.ended) {
      ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fillRect(W / 2 - 80, 8, 160, 22);
      ctx.fillStyle = "#facc15"; ctx.font = "800 12px system-ui,sans-serif"; ctx.textAlign = "center"; ctx.fillText(S.started ? "⏸ PAUSA · puoi dare ordini" : "▶ tocca play per iniziare", W / 2, 23);
    }
  }

  function drawPitch() {
    ctx.fillStyle = "#1c4a2c"; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 9; i++) { if (i % 2) { ctx.fillStyle = "#215633"; ctx.fillRect(0, i * H / 9, W, H / 9); } }
    ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 2;
    ctx.strokeRect(10, 8, W - 20, H - 16);
    ctx.beginPath(); ctx.moveTo(10, H / 2); ctx.lineTo(W - 10, H / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 38, 0, 7); ctx.stroke();
    ctx.strokeRect(W / 2 - 80, 8, 160, 52); ctx.strokeRect(W / 2 - 80, H - 60, 160, 52);
    ctx.strokeRect(W / 2 - 34, 8, 68, 20); ctx.strokeRect(W / 2 - 34, H - 28, 68, 20);
    ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(W / 2 - 28, 2, 56, 7); ctx.fillRect(W / 2 - 28, H - 9, 56, 7);
  }

  function drawZones() {
    // pressing e mentalità visibili
    const t = performance.now() / 1000;
    if (S.press === "alto") {
      ctx.fillStyle = "rgba(56,189,248,.10)"; ctx.fillRect(10, 8, W - 20, H / 2 - 8);
      ctx.fillStyle = "rgba(125,211,252,.55)"; ctx.font = "800 15px system-ui"; ctx.textAlign = "center";
      for (let i = 0; i < 4; i++) ctx.fillText("▲", 60 + i * 93, 52 + ((t * 20 + i * 9) % 18) * -1 + 18);
    } else if (S.press === "basso") {
      ctx.fillStyle = "rgba(148,163,184,.10)"; ctx.fillRect(10, H / 2, W - 20, H / 2 - 8);
    }
    if (S.ment === "allin" || S.ment === "offensiva") {
      ctx.fillStyle = "rgba(251,146,60,.07)"; ctx.fillRect(10, 8, W - 20, H - 16);
    }
    ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.font = "700 9px system-ui"; ctx.textAlign = "left";
    ctx.fillText(`${S.form} · ${MENT[S.ment].t} · press ${PRESS[S.press].t}`, 14, H - 12);
    ctx.textAlign = "right"; ctx.fillText(S.opp.short + " " + S.opp.form, W - 14, 18);
  }

  function drawPlayer(p, team) {
    const o = S.opp;
    const col = team === "A" ? "#1d4ed8" : o.col2, ring = team === "A" ? "#bae6fd" : o.col;
    const r = 10;
    const isGK = p.slotGrp === "POR";
    ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(p.x, p.y + 8, 9, 3, 0, 0, 7); ctx.fill();
    // anello energia
    if (team === "A" && !isGK) {
      ctx.strokeStyle = staminaCol(p.st); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(p.x, p.y, r + 2.5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (p.st / 100)); ctx.stroke();
    }
    ctx.fillStyle = isGK ? (team === "A" ? "#ca8a04" : "#475569") : col;
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.fill();
    ctx.strokeStyle = ring; ctx.lineWidth = 1.6; ctx.stroke();
    if (S.selOut === p.id) { ctx.strokeStyle = "#facc15"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(p.x, p.y, r + 6, 0, 7); ctx.stroke(); }
    ctx.fillStyle = "#fff"; ctx.font = "800 10px system-ui,sans-serif"; ctx.textAlign = "center";
    ctx.fillText(String(p.num), p.x, p.y + 3.5);
    if (team === "A" && S.carrier === p && S.run) {
      ctx.fillStyle = "#fff"; ctx.font = "700 9px system-ui"; ctx.fillText(p.name.replace(" (C)", ""), p.x, p.y - 15);
    }
  }

  // ---------------------------------------------------------------- uscita / apertura
  function onKey(e) { if (e.key === "Escape" && root) { if (S && !S.ended) confirmExit(); else exitAll(); } }
  function onVis() { if (document.hidden && S && S.run) { S.run = false; refreshLive(); } }

  function teardown() {
    stopLoop();
    listeners.splice(0).forEach(([t, ev, fn, opt]) => { try { t.removeEventListener(ev, fn, opt); } catch (e) { /* noop */ } });
    if (root) { root.remove(); root = null; }
    const st = document.getElementById(STYLE_ID); if (st) st.remove();
    style = null; canvas = null; ctx = null; sheetEl = null; S = null;
  }

  function exitAll() {
    const cb = onExitCb; onExitCb = null;
    teardown();
    if (typeof cb === "function") { try { cb(); } catch (e) { console.error(e); } }
  }

  window.openMatchDirectorHD = function (onExit) {
    if (root) teardown(); // riapertura: niente doppio callback
    onExitCb = onExit;
    injectStyle();
    prog = loadProg();
    root = document.createElement("div");
    root.id = "matchDirectorModal";
    root.className = "mdx-root";
    document.body.appendChild(root);
    listen(document, "keydown", onKey);
    listen(document, "visibilitychange", onVis);
    showMenu();
  };
})();
