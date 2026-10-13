// js/sogni.js - LA SQUADRA DEI SOGNI (Salone delle Saghe → 🃏 La Squadra dei Sogni)
// Un premio nuovo da collezionare: le CARTE DEI SOGNI, una per ogni personaggio importante delle saghe, con il ritratto,
// la rarità (comune, rara, epica, leggendaria), tre valori (attacco, difesa, tecnica) e l'effetto olografico.
//  - Le carte si sbloccano giocando: un capitolo concluso sblocca le comuni della saga, due le rare, la saga finita le
//    epiche, tutti i finali le leggendarie. Le BUSTINE (monete) danno una carta a sorpresa delle saghe che hai cominciato.
//  - La SQUADRA: cinque carte. L'INTESA sale con due personaggi della stessa saga (+1) e con i LEGAMI speciali tra
//    personaggi di saghe diverse (+3): maestri, rivali, chi sa tutto, chi ha visto il '52…
//  - Il TORNEO DEI SOGNI: otto sfide, ognuna nel motore originale di una saga (Vignette, ATB, Super-Bottoni, il Nastro,
//    Luci, il Concilio, il Duello Cinematico, la Lavagna Tattica). La squadra dà vantaggi diversi in ogni motore: grinta,
//    credibilità, tiri, lanterne, riavvolgimenti, giocatori in lavagna. Vincere tutto vale la carta del Campione dei Sogni.
// Salvataggio proprio: ali-di-rondine.sogni { own:[id], team:[id×5], won:[sfida], packs }.
(function () {
  "use strict";
  if (window.__sogni) return;
  const KEY = "ali-di-rondine.sogni", PACK = 120;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  // le saghe da cui vengono le carte: chiave di salvataggio, nome, colore
  const SAGHE = {
    torneo: ["ali-di-rondine.torneo", "Il Torneo delle Cento Scuole", "#c83a3a"], cronache: ["ali-di-rondine.cronache", "Le Cronache del Pallone di Cristallo", "#7a4ab0"], mantello: ["ali-di-rondine.mantello", "Il Mantello Granata", "#8a1a2a"],
    stagione: ["ali-di-rondine.stagione", "Stagione Infinita", "#ff5a7a"], lampioni: ["ali-di-rondine.lampioni", "La Notte dei Lampioni", "#ffd27a"], trono: ["ali-di-rondine.trono", "Il Trono di Cuoio", "#8a5a2a"],
    campetto: ["ali-di-rondine.campetto", "Dal Campetto al Mondiale", "#1f5fbf"], colline: ["ali-di-rondine.colline", "Master League delle Colline", "#2a6a3a"], detective: ["ali-di-rondine.detective", "Detective di Campo", "#3a4a5a"],
    spazio: ["ali-di-rondine.spazio", "Calcio Spaziale", "#2a6ac8"], vento: ["ali-di-rondine.vento", "La Valle del Vento Gentile", "#5a9a7a"], dopo: ["ali-di-rondine.dopo", "Dopo il Campione", "#a8622a"], mondi: ["ali-di-rondine.mondi", "Il Torneo dei Mondi", "#2a1a4a"],
  };
  // [id, saga, rarità (c r e l), attacco, difesa, tecnica, ruolo]
  const CARDS = [
    ["ts_tito", "torneo", "c", 66, 52, 60, "A"], ["ts_alba", "torneo", "c", 58, 60, 64, "C"], ["ts_lume", "torneo", "r", 70, 58, 66, "A"], ["ts_iole", "torneo", "e", 50, 64, 76, "C"],
    ["cc_lyra", "cronache", "c", 58, 72, 60, "D"], ["cc_fosco", "cronache", "c", 52, 50, 74, "C"], ["cc_rubi", "cronache", "r", 72, 54, 66, "A"], ["cc_re", "cronache", "l", 74, 80, 78, "D"],
    ["mg_tilde", "mantello", "c", 46, 60, 70, "C"], ["mg_bullone", "mantello", "c", 54, 74, 58, "D"], ["mg_brace", "mantello", "r", 70, 64, 60, "A"], ["mg_dottore", "mantello", "e", 64, 70, 76, "C"],
    ["sf_ada", "stagione", "c", 54, 60, 70, "C"], ["sf_teo", "stagione", "c", 66, 56, 62, "A"], ["sf_mira", "stagione", "r", 60, 58, 72, "C"], ["sf_gatto", "stagione", "l", 78, 66, 82, "A"],
    ["nl_fiammetta", "lampioni", "c", 56, 62, 66, "C"], ["nl_tobia", "lampioni", "c", 52, 66, 56, "D"], ["nl_leandro", "lampioni", "e", 76, 60, 74, "A"], ["nl_lucia", "lampioni", "r", 48, 72, 74, "D"],
    ["tc_brunilde", "trono", "c", 62, 70, 60, "D"], ["tc_gualtiero", "trono", "c", 58, 68, 62, "D"], ["tc_ysolde", "trono", "e", 66, 62, 80, "C"], ["tc_ardo", "trono", "r", 56, 78, 60, "P"],
    ["cm_saverio", "campetto", "c", 40, 80, 60, "P"], ["cm_pio", "campetto", "c", 54, 56, 72, "C"], ["cm_leone", "campetto", "r", 80, 52, 64, "A"], ["cm_bastiano", "campetto", "l", 84, 64, 86, "A"],
    ["ml_marta", "colline", "c", 58, 62, 70, "C"], ["ml_rino", "colline", "c", 68, 50, 56, "A"], ["ml_bice", "colline", "r", 50, 70, 74, "D"], ["ml_pino", "colline", "e", 60, 66, 84, "C"],
    ["dc_agata", "detective", "c", 56, 70, 72, "P"], ["dc_nina", "detective", "c", 62, 56, 68, "C"], ["dc_vanni", "detective", "r", 54, 66, 72, "D"],
    ["so_blop", "spazio", "c", 60, 64, 62, "D"], ["so_mira", "spazio", "c", 58, 58, 74, "C"], ["so_zorgo", "spazio", "r", 74, 56, 66, "A"],
    ["ve_selva", "vento", "c", 60, 60, 66, "C"], ["ve_sbuffo", "vento", "c", 56, 66, 60, "D"], ["ve_mormorio", "vento", "r", 66, 58, 72, "A"],
    ["ep_ada", "dopo", "c", 54, 62, 70, "C"], ["ep_bruno", "dopo", "r", 72, 62, 70, "A"], ["ep_tecla", "dopo", "c", 56, 66, 64, "D"],
    ["tm_custode", "mondi", "e", 70, 70, 80, "C"], ["tm_eclisse", "mondi", "l", 80, 76, 76, "A"],
  ].map(([id, saga, rar, at, df, te, role]) => ({ id, saga, rar, at, df, te, role }));
  const BY = Object.fromEntries(CARDS.map((c) => [c.id, c]));
  const RAR = { c: ["Comune", "#9aa5b1", 1], r: ["Rara", "#3a8ad8", 2], e: ["Epica", "#a85ad8", 3], l: ["Leggendaria", "#ffd23f", 4] };
  // i legami tra saghe diverse: +3 di intesa se entrambi in squadra
  const LINKS = [
    ["cm_bastiano", "ml_pino", "Vecchi maestri"], ["cm_bastiano", "nl_leandro", "Il '52 e il '78"], ["tc_ysolde", "dc_agata", "Chi sa tutto"], ["cm_leone", "ts_lume", "Rivali di fuoco"],
    ["mg_bullone", "so_blop", "Ferraglia amica"], ["sf_gatto", "nl_lucia", "Le notti lunghe"], ["cc_re", "tm_eclisse", "Il silenzio e il buio"], ["ml_marta", "nl_fiammetta", "Fiori e lanterne"],
    ["tc_brunilde", "cc_lyra", "Cavaliere"], ["cm_saverio", "tc_ardo", "Muri di pietra"], ["sf_ada", "ep_ada", "Le due Ade"], ["ve_selva", "mg_tilde", "Mani gentili"], ["tm_custode", "cm_bastiano", "Chi aspetta"],
  ];
  // le otto sfide del Torneo dei Sogni: cabinato della Sala Giochi (motore) e avversario
  const SFIDE = [
    { m: "vignette", saga: "torneo", opp: { name: "I Sogni delle Cento Scuole", color: "#c83a3a", style: "equilibrata" } },
    { m: "bottoni", saga: "mantello", opp: { name: "I Sogni di Metropolenta", color: "#8a1a2a", style: "contropiede", players: [{ name: "Tonno" }, { name: "Ciuffo" }, { name: "Colla" }, { name: "Mastice" }] } },
    { m: "luci", saga: "lampioni", opp: { name: "Le Ombre dei Sogni", color: "#6a7ab8", style: "equilibrata" } },
    { m: "nastro", saga: "stagione", opp: { name: "La Domenica dei Sogni", color: "#ff5a7a", style: "pressing" } },
    { m: "concilio", saga: "trono", opp: { name: "La Casata dei Sogni", color: "#8a6a1a", sigil: "🌳", honor: 0.4, style: "pressing" } },
    { m: "lavagna", saga: "colline", opp: { name: "La Lega dei Sogni", color: "#a83a2a", style: "pressing", ovr: 68, instr: "pressing" } },
    { m: "duello", saga: "campetto", opp: { name: "La Nazionale dei Sogni", color: "#e8e8f0", style: "pressing", players: [{ name: "Il Barone", pow: 14 }, { name: "Gelo", pow: 12 }], keeper: { name: "Il Muro dei Sogni", pow: 16 }, ace: { name: "Il Barone", special: "Fuoco del Nord" } } },
    { m: "atb", saga: "cronache", opp: null },
  ];
  // ---------------------------------------------------------------- salvataggio
  const load = () => { const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {}; return { own: Array.isArray(r.own) ? r.own.filter((x) => BY[x]) : [], team: Array.isArray(r.team) ? r.team.filter((x) => BY[x]).slice(0, 5) : [], won: Array.isArray(r.won) ? r.won.filter((x) => typeof x === "number") : [], packs: r.packs | 0, hero: !!r.hero }; };
  const save = (r) => safe(() => localStorage.setItem(KEY, JSON.stringify(r)), 0);
  const sagaMem = (k) => safe(() => JSON.parse(localStorage.getItem(SAGHE[k][0]) || "null"), null);
  function progress(k) { const m = sagaMem(k); if (!m) return { ch: 0, ends: 0 }; return { ch: Object.keys(m.done || {}).length, ends: Array.isArray(m.ends) ? m.ends.length : 0 }; }
  const earned = (c) => { const p = progress(c.saga); return c.rar === "c" ? p.ch >= 1 : c.rar === "r" ? p.ch >= 2 : c.rar === "e" ? p.ch >= 3 || p.ends >= 1 : p.ends >= 4; };
  function sync() { const r = load(); let nw = []; CARDS.forEach((c) => { if (!r.own.includes(c.id) && earned(c)) { r.own.push(c.id); nw.push(c.id); } }); if (nw.length) save(r); return { r, nw }; }
  // ---------------------------------------------------------------- intesa e forza
  function intesa(team) {
    let n = 0; const why = [];
    for (let i = 0; i < team.length; i++) for (let j = i + 1; j < team.length; j++) { const a = BY[team[i]], b = BY[team[j]]; if (!a || !b) continue; if (a.saga === b.saga) n += 1; const L = LINKS.find(([x, y]) => (x === a.id && y === b.id) || (x === b.id && y === a.id)); if (L) { n += 3; why.push(L[2]); } }
    return { n: Math.min(15, n), why };
  }
  const forza = (team) => { const cs = team.map((id) => BY[id]).filter(Boolean); if (!cs.length) return 40; return Math.round(cs.reduce((s, c) => s + (c.at + c.df + c.te) / 3, 0) / cs.length); };
  const name = (id) => { const C = window.__borgoApi && window.__borgoApi.CAST; return (C && C[id] && C[id].name) || id; };
  const port = (id) => safe(() => window.__borgoApi.portraitImg(id), null);
  // ---------------------------------------------------------------- la carta (HTML)
  function cardHtml(id, opts) {
    const c = BY[id], R = RAR[c.rar], own = !opts || opts.own !== false, img = own ? port(id) : null, S = SAGHE[c.saga];
    return `<div class="sgCard r${c.rar}${own ? "" : " lock"}${opts && opts.sel ? " sel" : ""}" data-c="${id}" style="--rc:${R[1]};--sc:${S[2]}"><div class="hd"><span>${R[0]}</span><b>${c.role}</b></div><div class="img">${img ? `<img alt="" src="${img}">` : `<span>?</span>`}</div><div class="nm">${own ? esc(name(id)) : "???"}</div><div class="st"><span>ATT <b>${own ? c.at : "–"}</b></span><span>DIF <b>${own ? c.df : "–"}</b></span><span>TEC <b>${own ? c.te : "–"}</b></span></div><div class="sg">${esc(S[1])}</div></div>`;
  }
  // ---------------------------------------------------------------- le schermate
  let OV = null, BACK = null;
  function shell(title) { css(); if (OV) OV.remove(); OV = document.createElement("div"); OV.className = "sgOv"; OV.innerHTML = `<div class="wrap"><div class="bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="body"></div></div>`; OV.querySelector(".x").onclick = () => { const b = BACK; closeAll(); if (typeof b === "function") b(); }; document.body.appendChild(OV); return OV.querySelector(".body"); }
  function closeAll() { if (OV) { OV.remove(); OV = null; } }
  function open(back) {
    if (back) BACK = back; const { r, nw } = sync(); const body = shell("🃏 La Squadra dei Sogni");
    const I = intesa(r.team), coins = safe(() => window.__borgoApi.coins(), 0);
    let h = `<p class="sum">Le carte dei personaggi di tutte le saghe. Si sbloccano giocando, o con le bustine. Carte: <b>${r.own.length}/${CARDS.length}</b> · monete: <b>${coins}</b>${nw.length ? ` · <b class="new">nuove: ${nw.length}</b>` : ""}</p>`;
    h += `<div class="sec">La tua squadra · forza <b>${forza(r.team)}</b> · intesa <b>${I.n}</b>/15${I.why.length ? ` <span class="why">(${I.why.map(esc).join(", ")})</span>` : ""}</div><div class="team">${[0, 1, 2, 3, 4].map((k) => (r.team[k] ? cardHtml(r.team[k]) : `<div class="sgCard empty" data-slot="${k}"><span>+</span></div>`)).join("")}</div>`;
    h += `<div class="big"><button type="button" data-go="tour">🏆 Torneo dei Sogni<small>${r.won.length}/8 sfide vinte · ogni sfida in un motore diverso</small></button><button type="button" data-go="pack" ${coins < PACK ? "disabled" : ""}>🎴 Bustina<small>${PACK} monete · una carta a sorpresa</small></button></div>`;
    h += `<div class="sec">Collezione · tocca una carta per metterla in squadra o toglierla</div><div class="coll">${CARDS.slice().sort((a, b) => r.own.includes(b.id) - r.own.includes(a.id)).map((c) => cardHtml(c.id, { own: r.own.includes(c.id), sel: r.team.includes(c.id) })).join("")}</div>`;
    h += `<div class="sec">Legami tra saghe (+3 di intesa)</div><div class="links">${LINKS.map(([a, b, t]) => `<span class="${r.own.includes(a) && r.own.includes(b) ? "ok" : ""}"><b>${esc(t)}</b> ${r.own.includes(a) ? esc(name(a)) : "???"} + ${r.own.includes(b) ? esc(name(b)) : "???"}</span>`).join("")}</div>`;
    body.innerHTML = h;
    body.querySelectorAll(".coll .sgCard:not(.lock)").forEach((el) => (el.onclick = () => toggle(el.dataset.c)));
    body.querySelectorAll(".team .sgCard[data-c]").forEach((el) => (el.onclick = () => toggle(el.dataset.c)));
    body.querySelector('[data-go="tour"]').onclick = torneo;
    body.querySelector('[data-go="pack"]').onclick = pack;
  }
  function toggle(id) { const r = load(); if (r.team.includes(id)) r.team = r.team.filter((x) => x !== id); else if (r.team.length < 5 && r.own.includes(id)) r.team.push(id); save(r); open(); }
  function pack() {
    const coins = safe(() => window.__borgoApi.coins(), 0); if (coins < PACK) return;
    const r = load(), started = Object.keys(SAGHE).filter((k) => progress(k).ch >= 1), pool = CARDS.filter((c) => !r.own.includes(c.id) && (started.includes(c.saga) || c.rar === "c"));
    if (!pool.length) return;
    safe(() => window.addCoins(-PACK), 0);
    const w = pool.flatMap((c) => Array(5 - RAR[c.rar][2]).fill(c)), got = w[Math.floor(Math.random() * w.length)];
    r.own.push(got.id); r.packs++; save(r); reveal(got.id, "Dalla bustina", open);
  }
  function reveal(id, title, then) {
    const body = shell("🎴 " + esc(title));
    body.innerHTML = `<div class="reveal">${cardHtml(id)}</div><p class="sum" style="text-align:center"><b>${esc(name(id))}</b> · ${RAR[BY[id].rar][0]} · ${esc(SAGHE[BY[id].saga][1])}</p><div class="big"><button type="button" data-ok="1">Nella collezione ▸<small>La trovi tra le carte</small></button></div>`;
    try { const A = new (window.AudioContext || window.webkitAudioContext)(); [523, 659, 784, 1046].forEach((f, i) => { const o = A.createOscillator(), g = A.createGain(); o.frequency.value = f; g.gain.value = 0.04; g.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + 0.2 + i * 0.1); o.connect(g); g.connect(A.destination); o.start(A.currentTime + i * 0.1); o.stop(A.currentTime + 0.3 + i * 0.1); }); } catch (e) {}
    body.querySelector("[data-ok]").onclick = then;
  }
  // ---------------------------------------------------------------- il Torneo dei Sogni
  function torneo() {
    const r = load(), body = shell("🏆 Torneo dei Sogni"), I = intesa(r.team), f = forza(r.team);
    let h = `<p class="sum">Otto sfide, otto motori. La tua squadra (forza ${f}, intesa ${I.n}) dà vantaggi diversi in ogni motore. ${r.team.length < 5 ? "<b>Servono cinque carte in squadra.</b>" : ""}</p>`;
    h += SFIDE.map((s, i) => { const M = safe(() => window.__salone.machine(s.m), null), won = r.won.includes(i); return `<div class="sf${won ? " won" : ""}" data-i="${i}"><div class="e">${M ? M.e : "⚽"}</div><div><b>${i + 1}. ${esc(M ? M.t : s.m)}</b><span>${esc(s.opp ? s.opp.name : "I Sogni del Cristallo")} · ${esc(bonusTxt(s.m, r.team))}</span></div><div class="n">${won ? "✓" : "▶"}</div></div>`; }).join("");
    if (r.won.length >= 8) h += `<div class="big"><button type="button" data-hero="1">${r.hero ? "✓ Il Campione dei Sogni è tuo" : "🌟 Ritira la carta del Campione dei Sogni"}<small>La carta leggendaria del tuo Campione · e la Maglia dei Sogni</small></button></div>`;
    h += `<div class="big"><button type="button" data-back="1">◂ La squadra<small>Carte e collezione</small></button></div>`;
    body.innerHTML = h;
    body.querySelectorAll("[data-i]").forEach((el) => (el.onclick = () => { if (load().team.length >= 5) play(+el.dataset.i); }));
    body.querySelector("[data-back]").onclick = () => open();
    const hb = body.querySelector("[data-hero]"); if (hb) hb.onclick = heroCard;
  }
  const count = (team, saga) => team.filter((id) => BY[id] && BY[id].saga === saga).length;
  function bonusTxt(m, team) {
    const I = intesa(team).n;
    return { vignette: `azioni +${Math.floor(I / 5)}`, bottoni: `tiri +${I >= 6 ? 1 : 0}${count(team, "mantello") ? ", superpoteri a turno" : ""}`, luci: `lanterne +${I >= 8 ? 1 : 0}`, nastro: `riavvolgimenti +${I >= 8 ? 1 : 0}`, concilio: `credibilità ${Math.min(9, 5 + Math.floor(I / 3))}, corvi ${1 + count(team, "trono")}`, lavagna: "le tue carte in lavagna", duello: `grinta ${100 + I * 4}`, atb: `statistiche +${Math.floor(I / 3)}` }[m] || "";
  }
  function play(i) {
    const s = SFIDE[i], M = safe(() => window.__salone.machine(s.m), null), eng = M && window[M.eng]; if (!M || !eng || !eng.start) return;
    const r = load(), I = intesa(r.team).n, f = forza(r.team), h = safe(() => window.__salone.heroLook(), { name: "Campione" }), diff = i >= 6 ? 1.05 : 1;
    const opp = s.opp || M.boss, base = M.opts(opp || M.opp[0], h, i >= 6), names = r.team.map((id) => ({ name: String(name(id)).split(/[ ,]/)[0], skin: (window.__borgoApi.CAST[id] || {}).skin, hair: (window.__borgoApi.CAST[id] || {}).hair }));
    const extra = {
      vignette: { actions: (base.actions || 8) + Math.floor(I / 5) },
      bottoni: { shots: (base.shots || 6) + (I >= 6 ? 1 : 0), powers: count(r.team, "mantello") ? ["fulmine", "gigante", "calamita", "gelo", "doppio"] : undefined, mates: names.slice(0, 3) },
      luci: { lanterns: (base.lanterns || 3) + (I >= 8 ? 1 : 0), mates: names.slice(0, 2) },
      nastro: { rewinds: (base.rewinds || 2) + (I >= 8 ? 1 : 0), mates: names.slice(0, 2) },
      concilio: { cred: Math.min(9, 5 + Math.floor(I / 3)), ravens: 1 + count(r.team, "trono"), us: "La Squadra dei Sogni" },
      lavagna: { us: "La Squadra dei Sogni", squad: r.team.map((id) => ({ name: name(id), role: BY[id].role, ovr: Math.round((BY[id].at + BY[id].df + BY[id].te) / 3 + I / 3) })).concat([{ name: h.name || "Il Campione", role: "A", ovr: f + 2 }, { name: "Il Portiere dei Sogni", role: "P", ovr: f }]) },
      duello: { guts: 100 + I * 4, mates: names.slice(0, 3), us: "La Squadra dei Sogni" },
      atb: { heroSt: { tiro: 16 + Math.floor(I / 3), pass: 14 + Math.floor(I / 3), dif: 12 + Math.floor(I / 3), vel: 15 + Math.floor(I / 3) } },
    }[s.m] || {};
    closeAll(); const C = window.__sagaCore; if (C && C.setCur) C.setCur(diff > 1 ? "sfida" : "normale", opp && opp.style);
    const o = Object.assign({}, base, extra, { title: `Torneo dei Sogni ${i + 1}/8 · ${M.t}`, heroLook: h, winTitle: "SFIDA DEI SOGNI VINTA!", onDone: (res) => {
      const r2 = load(); let msg = res.win ? "Sfida vinta!" : "Sfida persa: si può rigiocare.";
      if (res.win && !r2.won.includes(i)) { r2.won.push(i); safe(() => window.addCoins(40), 0); const pool = CARDS.filter((c) => !r2.own.includes(c.id)); if (pool.length) { const got = pool[Math.floor(Math.random() * pool.length)]; r2.own.push(got.id); save(r2); return reveal(got.id, "Premio della sfida · +40 monete", torneo); } }
      save(r2); torneo(); const sm = OV && OV.querySelector(".sum"); if (sm) sm.insertAdjacentHTML("afterbegin", `<b>${msg}</b> `);
    } });
    if (safe(() => eng.start(o), false) === false) { if (C && C.endMatch) C.endMatch(); torneo(); }
  }
  function heroCard() {
    const r = load(); if (r.hero || r.won.length < 8) return; r.hero = true; save(r);
    safe(() => { const A = window.__borgoApi; A.bCos && A.bCos("sg_maglia"); }, 0);
    const body = shell("🌟 Il Campione dei Sogni"), img = port("hero");
    body.innerHTML = `<div class="reveal"><div class="sgCard rl hero" style="--rc:#ffd23f;--sc:#7a5ad8"><div class="hd"><span>Leggendaria</span><b>★</b></div><div class="img">${img ? `<img alt="" src="${img}">` : ""}</div><div class="nm">Il Campione dei Sogni</div><div class="st"><span>ATT <b>99</b></span><span>DIF <b>99</b></span><span>TEC <b>99</b></span></div><div class="sg">Tutte le saghe</div></div></div><p class="sum" style="text-align:center">Otto sfide, otto motori, una squadra di sogni. Questa carta è la tua. E nel Guardaroba c'è la <b>Maglia dei Sogni</b>.</p><div class="big"><button type="button" data-ok="1">◂ Torna al torneo<small></small></button></div>`;
    body.querySelector("[data-ok]").onclick = torneo;
  }
  function css() {
    if (document.getElementById("sgCss")) return; const st = document.createElement("style"); st.id = "sgCss";
    st.textContent = `.sgOv{position:fixed;inset:0;z-index:310;background:#120e1e;color:#f4f0e4;font-family:system-ui,sans-serif;overflow:auto}
.sgOv .wrap{max-width:560px;margin:0 auto;padding:10px 10px 30px}.sgOv .bar{display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#120e1e;padding:6px 0;z-index:2}.sgOv h2{margin:0;font:900 20px system-ui;color:#ffd23f}.sgOv .x{width:40px;height:40px;border-radius:8px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font-size:16px}
.sgOv .sum{font-size:13px;line-height:1.45;opacity:.9}.sgOv .sum .new{color:#7ad87a}.sgOv .sec{margin:12px 0 6px;font-weight:800;font-size:13px;color:#c8b8ff}.sgOv .why{font-weight:400;opacity:.8}
.sgOv .team{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.sgOv .coll{display:grid;grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:8px}
.sgCard{position:relative;border-radius:10px;padding:5px;background:linear-gradient(160deg,var(--sc),#120e1e 75%);border:2px solid var(--rc);box-shadow:0 2px 0 rgba(0,0,0,.5);cursor:pointer;overflow:hidden;font-size:10px;min-height:92px}
.sgCard.empty{display:flex;align-items:center;justify-content:center;border-style:dashed;border-color:#4a3a6a;background:#1a1428;font-size:22px;color:#4a3a6a}
.sgCard .hd{display:flex;justify-content:space-between;font-weight:800;font-size:8.5px;color:var(--rc);text-transform:uppercase}.sgCard .img{aspect-ratio:1;border-radius:6px;background:#0a0814;overflow:hidden;margin:3px 0;display:flex;align-items:center;justify-content:center}.sgCard .img img{width:100%;height:100%;object-fit:cover}.sgCard .img span{font:900 26px system-ui;color:#4a3a6a}
.sgCard .nm{font-weight:800;font-size:10px;line-height:1.15;min-height:2.3em}.sgCard .st{display:flex;justify-content:space-between;font-size:8px;opacity:.9}.sgCard .st b{color:#ffd23f}.sgCard .sg{font-size:7.5px;opacity:.65;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sgCard.lock{filter:grayscale(1) brightness(.5);cursor:default}.sgCard.sel{outline:3px solid #7ad87a;outline-offset:1px}
.sgCard.re::after,.sgCard.rl::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.35) 45%,rgba(255,180,255,.25) 50%,transparent 62%);background-size:250% 100%;animation:sgHolo 3.2s linear infinite;pointer-events:none;mix-blend-mode:screen}
.sgCard.rl{box-shadow:0 0 12px rgba(255,210,63,.5)}@keyframes sgHolo{from{background-position:120% 0}to{background-position:-130% 0}}
@media (prefers-reduced-motion:reduce){.sgCard::after{animation:none!important}}
.sgOv .big{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}.sgOv .big button{min-height:56px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 14px system-ui;text-align:left;padding:8px 10px}.sgOv .big button small{display:block;font-weight:400;font-size:11px;opacity:.8;margin-top:3px}.sgOv .big button:disabled{opacity:.4}
.sgOv .links{display:grid;gap:4px;font-size:11.5px}.sgOv .links span{background:#1a1428;border-radius:6px;padding:5px 8px;opacity:.6}.sgOv .links span.ok{opacity:1;border-left:3px solid #7ad87a}.sgOv .links b{color:#c8b8ff}
.sgOv .sf{display:grid;grid-template-columns:40px 1fr 30px;gap:8px;align-items:center;background:#1a1428;border:1px solid #4a3a6a;border-radius:10px;padding:8px;margin:6px 0;cursor:pointer}.sgOv .sf .e{font-size:24px;text-align:center}.sgOv .sf b{display:block;font-size:13.5px}.sgOv .sf span{font-size:11.5px;opacity:.8}.sgOv .sf .n{font:900 18px system-ui;color:#ffd23f;text-align:center}.sgOv .sf.won{border-color:#7ad87a}.sgOv .sf.won .n{color:#7ad87a}
.sgOv .reveal{display:flex;justify-content:center;margin:20px 0}.sgOv .reveal .sgCard{width:180px;font-size:13px;animation:sgFlip .7s ease-out}.sgOv .reveal .sgCard .nm{font-size:15px}.sgOv .reveal .sgCard .st{font-size:11px}.sgOv .reveal .sgCard .hd{font-size:11px}
@keyframes sgFlip{from{transform:perspective(600px) rotateY(180deg) scale(.6)}to{transform:none}}`;
    document.head.appendChild(st);
  }
  // la Maglia dei Sogni nel guardaroba (si registra all'avvio, così resta anche dopo aver ricaricato la pagina)
  (function reg() { const A = window.__borgoApi; if (!A || !A.COSM) return setTimeout(reg, 200); if (!A.COSM.sg_maglia) A.COSM.sg_maglia = { kind: "shirt", label: "Maglia dei Sogni", val: "#7a5ad8", from: "Vinci il Torneo dei Sogni (Salone delle Saghe)" }; })();
  window.__sogni = { open, close: closeAll, CARDS, LINKS, SFIDE, intesa, forza, sync, _load: load };
})();
