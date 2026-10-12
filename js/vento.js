// js/vento.js - LA VALLE DEL VENTO GENTILE · configurazione della saga sul motore comune (js/saga-core.js)
// Saga calda e malinconica, ispirata ai film dello Studio Ghibli (Nausicaä, Totoro, Il castello errante). Tutto inventato.
// Mulinella è un villaggio di mulini a vento in fondo a una valle. Sul Prato dei Soffi gli spiriti del bosco giocano a calcio
// con chi ha voglia di giocare. Il Campione arriva come nuovo «custode del prato». Ma il vento sta smettendo di soffiare.
// Novità di questa saga (oltre a quelle del motore comune):
//  - IL VENTO: ogni zona ha un vento che cambia direzione. Si vede su erba, alberi, fumo e mulini (le pale girano più o meno forte).
//  - LE FOLATE: in alcune zone arrivano raffiche che spingono il Campione. Ci si ripara dietro rocce, muri e alberi (lato sopravvento).
//    Un segnale avvisa due secondi prima; il vento si legge dai semi di tarassaco che volano.
//  - I SOFFI: piccoli spiriti da trovare (al posto delle piume). Ogni Soffio trovato rende la valle un po' più allegra.
//  - CASE IN CUI SI ENTRA: il mulino di Gualdo, il laboratorio di Selva, la Casa che Cammina (interni veri del motore comune).
// Partita originale: «Col Vento» (js/vento-partita.js). Salvataggio proprio: ali-di-rondine.vento. Ricompense: solo monete e cosmetici.
(function () {
  "use strict";
  if (window.__vento || !window.__sagaCore) return;
  const TS = 16;
  // stato del vento della zona (direzione in radianti, forza 0..1, raffica in corso)
  const WND = { ang: 0, str: 0.5, target: 0, t: 0, gust: 0, warn: 0, gdir: 0, pushed: 0, sheltered: false, seeds: [] };

  const E = window.__sagaCore.create({
    id: "vento", key: "ali-di-rondine.vento", title: "La Valle del Vento Gentile", icon: "🍃", bg: "ve_valle", chapters: 3,
    menuSub: "mulini, spiriti, folate e la partita Col Vento",
    theme: { accent: "#8cc76a", ink: "#fbf6e6", paper: "rgba(28,44,38,.85)", font: "Georgia, serif", chipBg: "#2c4a3cee", chipBorder: "#cfe6b0" },
    stats: { selva: [-9, 9, 0, "Fiducia di Selva"], gioia: [0, 99, 0, "Gioia della valle"], turbine: [0, 99, 0, "Patto con la Compagnia"], ottone: [-9, 9, 0, "Amicizia di Ottone"] },
    travel: true,
    item: ["Soffio", "Soffi"],
    // musiche: un valzerino gentile per la valle, una ninna nanna per il bosco di notte, un tema che sale per il colle
    musicMain: "vento",
    music: {
      vento: { bpm: 84, spb: 12, chords: ["F", "C", "Dm", "Bb", "F", "C", "Bb", "C"], lres: 2, lw: "triangle", lv: 0.085,
        lead: "A5 - C6 - A5 G5 | G5 - - E5 - - | F5 - A5 - D6 C6 | D6 - - - - - | C6 - A5 - F5 G5 | E5 - G5 - C6 - | D6 - C6 - Bb5 A5 | G5 - - - - -",
        bass: "R . . 5 . . R . . 5 . .", bv: 0.09, arp: "1 3 5 8 5 3 1 3 5 8 5 3", aw: "sine", av: 0.028, drum: ". . . h . . . . . h . .", dv: 0.14 },
      vento_notte: { bpm: 68, spb: 12, chords: ["Am", "F", "C", "G"], lres: 2, lw: "sine", lv: 0.075,
        lead: "E5 - - A5 - - | C6 - - - B5 A5 | G5 - - E5 - - | D5 - - - - -",
        bass: "R . . . . . R . . . . .", bv: 0.08, arp: "1 5 8 5 1 5 8 5 1 5 8 5", aw: "triangle", av: 0.03, drum: ". . . . . . . . . . . .", dv: 0 },
      vento_colle: { bpm: 100, chords: ["Dm", "Bb", "F", "C", "Dm", "Bb", "C", "A"], lres: 2, lw: "pulse", lv: 0.05,
        lead: "D5 - F5 - A5 - D6 - | Bb5 - A5 G5 F5 - D5 - | C5 - F5 - A5 - C6 - | E6 - D6 C6 G5 - - - | D5 - F5 - A5 - D6 - | F6 - E6 D6 Bb5 - - - | C6 - D6 - E6 - G6 - | A5 - - - - - - -",
        bass: "R . R . 5 . R . R . R . 5 . 8 .", bv: 0.12, arp: "1 5 8 5 1 5 8 5 1 5 8 5 1 5 8 5", aw: "square", av: 0.014, drum: "k . h . s . h . k k h . s . h h", dv: 0.38 },
    },
    // ospiti da altre saghe (compaiono solo se quella saga l'hai già giocata)
    cameos: [
      { id: "dc_agata", zone: "ve_locanda", at: [12, 10], when: (K) => !!(K.otherSaga("ali-di-rondine.detective") || {}).done?.[1], lines: [
        ["dc_agata", "Assistente! Cioè: custode. Sono in ferie. Le prime in diciannove anni. Il medico ha detto «aria buona». Qui l'aria è buonissima, quando c'è."],
        ["dc_agata", "Nessun caso, giuro. Tranne uno piccolo: un piccione ruba il pane a Nonna Tisi tutte le mattine alle sette e un quarto. Ho già un sospettato. Ha le ali."],
        ["ve_tisi", "Ispettrice, è un piccione."], ["dc_agata", "Tutti i colpevoli sono qualcosa, signora. Liquirizia?"]] },
      { id: "mu_teo", zone: "ve_prato", at: [30, 19], when: (K) => !!(K.otherSaga("ali-di-rondine.muro") || {}).done?.[1], lines: [
        ["mu_teo", "{n}? Sei tu? Sono uscito dal muro, alla fine. Ho camminato tre settimane verso sud, e guarda: un prato dove gli spiriti giocano a pallone."],
        ["mu_teo", "L'avevo sempre detto che fuori il cielo era più grande. Qui è enorme. Torno a casa e non mi crederà nessuno. Nives sì. Nives crede solo alle cose impossibili."]] },
    ],
    musicBg: { ve_bosco: "vento_notte", ve_casa: "vento_notte", ve_colle: "vento_colle", ve_finale: "vento_colle" },
    regions: {
      valle: { grass: ["#7fb35a", "#86ba5f", "#78ad54"], path: ["#d8c08a", "#ccb47e"], stone: ["#b8b0a0", "#aca494"], wall: ["#c8b898", "#bcac8c"], water: ["#4a9ac8", "#54a4d2"], tall: "#6aa04a", tree: ["#3e7a3a", "#4f9444", "#7ab85a"], tint: "255,236,200", tintA: 0.07, fx: "", dark: 0.06 },
      prato: { grass: ["#8cc764", "#94cd6a", "#86c05e"], path: ["#e0cc96", "#d6c28c"], stone: ["#c0b8a8", "#b4ac9c"], wall: ["#8a7a5a", "#7e6e50"], water: ["#5aaad8", "#64b4e2"], tall: "#78b452", tree: ["#3a7838", "#4c9044", "#86c460"], tint: "255,246,210", tintA: 0.06, fx: "", dark: 0.04 },
      bosco: { grass: ["#3a6a3a", "#40723f", "#365f36"], path: ["#7a6a4a", "#706044"], stone: ["#6a7a6a", "#5e6e5e"], wall: ["#3a4a3a", "#324032"], water: ["#2a5a6a", "#306474"], tall: "#4a8040", tree: ["#1f4a2a", "#2a5e34", "#3f7a44"], tint: "170,230,190", tintA: 0.12, fx: "fireflies", dark: 0.3 },
      colle: { grass: ["#a8b86a", "#b0bf70", "#a0b064"], path: ["#c8b080", "#bea676"], stone: ["#a09a8a", "#948e7e"], wall: ["#7a7468", "#6e685c"], water: ["#5a9ac8", "#64a4d2"], tall: "#98aa58", tree: ["#4a6a3a", "#5a7e44", "#7a9a52"], tint: "255,200,150", tintA: 0.1, fx: "", dark: 0.08 },
      casa: { grass: ["#a07850", "#98704a", "#a47c54"], path: ["#b08a5a", "#a88252"], stone: ["#9a8a7a", "#8e7e6e"], wall: ["#c8a87a", "#bc9c6e"], water: ["#4a8ab8", "#5494c2"], tall: "#6a8a4a", tint: "255,210,150", tintA: 0.1, fx: "dust", dark: 0.16 },
    },
    floors: "*", solid: "o",
    rest: { ch: "S", label: "Siediti all'altarino dei Soffi", text: "Ti siedi accanto all'altarino di pietra. Un Soffio ti si arrotola in grembo e fa le fusa come un gatto fatto d'aria. (Il gioco salva da solo: qui puoi rileggere il Quaderno.)" },
    texts: { chestOpen: "Apri la cassetta.", chestEmpty: "La cassetta è vuota. Dentro c'è solo un po' di vento vecchio.", nothing: "Niente di speciale. Solo erba, e vento.", noHero: "La valle aspetta un nuovo custode del prato. Prima crea il tuo Campione.", chapters: "Tre capitoli, una valle. Le scelte restano: cambiano il finale." },
    journal: { name: "Il Quaderno del Custode", sub: "Persone, Soffi trovati, pagine del vecchio custode, finali", html: (K) => quaderno(K) },
    endings: {
      vento: ["IL VENTO TORNA", "Si gioca di nuovo per gioia, e il vento mantiene la sua promessa.", "Sempre possibile, alla fine."],
      turbine: ["LE TURBINE", "La valle diventa ricca e silenziosa. I Soffi se ne vanno, uno alla volta.", "Serve un patto forte con la Compagnia delle Turbine."],
      custode: ["IL NUOVO CUSTODE", "Resti. Il prato ha di nuovo un custode, e tu una casa.", "Resta, quando la valle te lo chiede."],
      soffio: ["L'ULTIMO SOFFIO", "Mormorio gioca un'ultima partita, poi diventa vento.", "Segreto: tutti i Soffi, la piena fiducia di Selva e il Quaderno quasi completo."],
    },
    heroLook: (h, K) => ({ bg: ["#2c4a3c", "#cfe6b0"], shirt: K.F.is("ve_grembiule") ? "#5a8a4a" : h.shirt }),
    heroTitle: (K) => (K.F.is("ve_chiave") ? "custode del prato" : "forestiero"),
    act: { M: "Guarda il mulino", O: "Guarda il grande albero", "*": "Annusa i fiori" },
    paint: {
      // il mulino a vento: base di pietra qui, torre e pale disegnate sopra le tessere (girano con il vento)
      M(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 9);
        const sp = K.ZX.spec, zr = K.zone(K.ZX.id), stop = sp && (typeof sp.millStop === "function" ? K.safe(() => sp.millStop(zr ? K.stepOf(zr.ch) : 0), false) : sp.millStop);
        K.later((g, cx, cy) => mill(g, tx * TS - cx + 8, ty * TS - cy + 15, fr, stop));
      },
      // il grande albero della valle (uno per zona, enorme, sporge sopra)
      O(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => bigTree(g, tx * TS - cx + 8, ty * TS - cy + 16, fr)); },
      // un vecchio pallone di cuoio lasciato sull'erba
      o(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 5); const g = K.g; g.fillStyle = "#c8a070"; g.beginPath(); g.arc(sx + 8, sy + 9, 5, 0, 7); g.fill(); g.strokeStyle = "#6a4a2a"; g.lineWidth = 0.8; g.beginPath(); g.arc(sx + 8, sy + 9, 5, 0, 7); g.moveTo(sx + 3, sy + 9); g.lineTo(sx + 13, sy + 9); g.moveTo(sx + 8, sy + 4); g.quadraticCurveTo(sx + 11, sy + 9, sx + 8, sy + 14); g.stroke(); },
      // l'altarino dei Soffi (punto di riposo)
      S(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 6); const g = K.g;
        K.P(sx + 3, sy + 5, 10, 10, "#9a948a"); K.P(sx + 2, sy + 3, 12, 3, "#7a7468"); K.P(sx + 4, sy + 13, 8, 2, "#6a8a4a"); K.P(sx + 6, sy + 8, 4, 4, "#5a544a");
        const b = Math.sin(fr / 18 + tx) * 1; g.fillStyle = "#f4f4f8"; g.beginPath(); g.arc(sx + 8, sy + 1 + b, 3.4, 0, 7); g.fill(); K.P(sx + 6.5, sy + b, 1, 1.4, "#2a2a2a"); K.P(sx + 9, sy + b, 1, 1.4, "#2a2a2a");
        K.light(sx + 8, sy + 2, 16, "220,240,255", 0.3);
      },
    },
    floorPaint(K, f, sx, sy, tx, ty) {
      if (f !== "*") return false; // prato fiorito: si cammina, i fiori si piegano col vento
      K.floorPaint(",", sx, sy, tx, ty); const g = K.g, sw = (WND.str * Math.cos(WND.ang)) * 1.6;
      for (let i = 0; i < 4; i++) { const x = sx + 2 + ((tx * 5 + i * 4) % 12), y = sy + 4 + ((ty * 3 + i * 5) % 10); g.strokeStyle = "#4a7a34"; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y + 4); g.lineTo(x + sw, y); g.stroke(); K.P(x + sw - 1, y - 1, 2.4, 2.4, ["#fff6f0", "#ffd23f", "#f29ab0", "#c8a8f0"][(tx + ty + i) % 4]); }
      return true;
    },
    drawItem(g, x, y, i, f) { // un Soffio: una pallina di nebbia con due occhi, che saltella
      const b = Math.abs(Math.sin(f / 10 + i)) * 3;
      g.fillStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.ellipse(x, y + 5, 4, 1.4, 0, 0, 7); g.fill();
      g.fillStyle = "#f6f6fa"; g.beginPath(); g.arc(x, y - b, 4.6, 0, 7); g.fill(); for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x + Math.cos(k * 1.26 + f / 30) * 3.6, y - b + Math.sin(k * 1.26 + f / 30) * 3.6, 1.8, 0, 7); g.fill(); }
      g.fillStyle = "#2a2a30"; g.fillRect(x - 2, y - b - 1, 1.2, 1.6); g.fillRect(x + 1, y - b - 1, 1.2, 1.6);
    },
    mood(g, fr, K) { seeds(g, fr, K); },
    plugins: [{ // IL VENTO e LE FOLATE
      enter(zid, spec) { const w = spec.wind || {}; WND.ang = w.ang != null ? w.ang : 0; WND.target = WND.ang; WND.str = w.str != null ? w.str : 0.5; WND.t = 0; WND.gust = 0; WND.warn = 0; WND.pushed = 0; },
      tick(zid, spec, px, py, dt, K) { return windTick(spec, px, py, dt, K); },
      hud(g, zid, spec, K) { windHud(g, spec, K); },
    }],
    zoneMenuExtra: (K) => [{ label: "Che vento tira?", sub: "Guarda i semi di tarassaco", fn: () => K.say([["voce", windTalk(K)]], () => K.done()) }],
  });
  const K = E.K;

  // ------------------------------------------------------------------ il vento della zona
  function windStr(spec) { const w = spec.wind || {}; const st = K.zone(K.ZX.id) ? K.stepOf(K.zone(K.ZX.id).ch) : 0; return typeof w.str === "function" ? K.safe(() => w.str(st), 0.5) : w.str != null ? w.str : 0.5; }
  function solidAt(tx, ty) { const c = K.at(tx, ty); return !K.isFloor(c) && !"><^v".includes(c); }
  function windTick(spec, px, py, dt, K) {
    const w = spec.wind || {}, base = windStr(spec);
    WND.t += dt;
    if (w.turn !== false && WND.t > (w.every || 15)) { WND.t = 0; WND.target = w.dirs ? K.pick(w.dirs) : WND.target + (Math.random() - 0.5) * 2.4; }
    let d = WND.target - WND.ang; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; WND.ang += d * Math.min(1, dt * 0.8);
    WND.str += (base + (WND.gust > 0 ? 1.2 : 0) - WND.str) * Math.min(1, dt * 2);
    K.ZX.wind = Math.cos(WND.ang) * WND.str * 2;
    if (!w.gusts || (w.gustWhen && !K.safe(() => w.gustWhen(K.stepOf(K.zone(K.ZX.id).ch)), true))) return null;
    // le folate: avviso, poi spinta per qualche secondo (ci si ripara dietro un solido sopravvento)
    if (WND.gust <= 0 && WND.warn <= 0) { WND.next = (WND.next == null ? 3 : WND.next) - dt; if (WND.next <= 0) { WND.warn = 2; WND.gdir = w.gustDir != null ? w.gustDir : WND.target; WND.target = WND.gdir; K.SFX.warn(); } return null; }
    if (WND.warn > 0) { WND.warn -= dt; if (WND.warn <= 0) { WND.gust = w.gustLen || 2.6; K.SFX.wind(); } return null; }
    WND.gust -= dt; if (WND.gust <= 0) { WND.next = (w.gustEvery || 6) + Math.random() * 3; return null; }
    const tx = Math.floor(px / TS), ty = Math.floor((py - 4) / TS), ux = -Math.round(Math.cos(WND.gdir)), uy = -Math.round(Math.sin(WND.gdir));
    WND.sheltered = solidAt(tx + ux, ty + uy) || solidAt(tx + ux, ty) && !uy || solidAt(tx, ty + uy) && !ux;
    if (WND.sheltered) return null;
    const f = (w.push || 46) * dt, nx = px + Math.cos(WND.gdir) * f, ny = py + Math.sin(WND.gdir) * f;
    const ok = (x, y) => { const cx = Math.floor(x / TS), cy = Math.floor((y - 4) / TS); return !solidAt(cx, cy) && !solidAt(Math.floor((x - 5) / TS), cy) && !solidAt(Math.floor((x + 5) / TS), cy); };
    const rx = ok(nx, py) ? nx : px, ry = ok(rx, ny) ? ny : py;
    if (rx !== px || ry !== py) { WND.pushed += dt; if (w.onPush) K.safe(() => w.onPush(rx, ry, K)); return [rx, ry]; }
    return null;
  }
  const DIRN = ["da ovest", "da nord-ovest", "da nord", "da nord-est", "da est", "da sud-est", "da sud", "da sud-ovest"];
  const fromName = (a) => { const k = Math.round((((a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 4)) % 8; return DIRN[k]; }; // il vento viene dal lato opposto a dove soffia
  function windTalk(K) {
    const s = WND.str;
    return s < 0.15 ? "Niente. I semi di tarassaco cadono dritti. Non è calma: è il vento che trattiene il fiato." : `Tiri un filo d'erba in aria: il vento viene ${fromName(WND.ang)}, ${s < 0.4 ? "debole, come un pensiero" : s < 0.8 ? "costante, da mulino" : "forte, da aquilone"}. ${K.ZX.spec && K.ZX.spec.wind && K.ZX.spec.wind.gusts ? "Qui arrivano le folate: quando i semi impazziscono, mettiti dietro a qualcosa di solido, dal lato da cui soffia." : ""}`;
  }
  function windHud(g, spec, K) {
    const w = spec.wind; if (!w) return;
    const x = 300, y = 22, a = WND.ang, s = Math.min(1, WND.str);
    g.fillStyle = "rgba(28,44,38,.75)"; g.beginPath(); g.arc(x, y, 12, 0, 7); g.fill(); g.strokeStyle = "#cfe6b0"; g.lineWidth = 1; g.stroke();
    g.save(); g.translate(x, y); g.rotate(a); g.strokeStyle = "#fbf6e6"; g.lineWidth = 1.5 + s * 1.5; g.beginPath(); g.moveTo(-7, 0); g.lineTo(7, 0); g.lineTo(3, -3); g.moveTo(7, 0); g.lineTo(3, 3); g.stroke(); g.restore();
    if (w.gusts) {
      const txt = WND.warn > 0 ? "⚠ arriva una folata!" : WND.gust > 0 ? (WND.sheltered ? "🪨 al riparo" : "🍃 FOLATA!") : "";
      if (txt) { g.font = "bold 8px sans-serif"; const tw = g.measureText(txt).width + 10; g.fillStyle = WND.warn > 0 ? "rgba(120,60,20,.85)" : WND.sheltered ? "rgba(30,70,40,.85)" : "rgba(40,80,120,.85)"; g.fillRect(284 - tw, 14, tw, 13); g.fillStyle = "#fbf6e6"; g.fillText(txt, 289 - tw, 24); }
    }
  }
  // semi di tarassaco: seguono il vento (si legge la direzione guardandoli)
  function seeds(g, fr, K) {
    if (!K.ZX.spec || K.ZX.spec.interior) return;
    const S = WND.seeds; while (S.length < 26) S.push({ x: Math.random() * 320, y: Math.random() * 200, p: Math.random() * 6.28, s: 0.5 + Math.random() });
    const vx = Math.cos(WND.ang) * WND.str * 1.6, vy = Math.sin(WND.ang) * WND.str * 1.2;
    g.strokeStyle = "rgba(255,255,255,.75)"; g.fillStyle = "rgba(255,255,255,.9)"; g.lineWidth = 0.6;
    S.forEach((q) => {
      q.x += vx * q.s + Math.sin(fr / 40 + q.p) * 0.25; q.y += vy * q.s + 0.08 + Math.cos(fr / 50 + q.p) * 0.15;
      if (q.x > 330) q.x = -8; if (q.x < -10) q.x = 328; if (q.y > 205) q.y = -4; if (q.y < -6) q.y = 203;
      g.fillRect(q.x, q.y, 1, 1); for (let k = 0; k < 5; k++) { const a = k * 1.26 + fr / 60; g.beginPath(); g.moveTo(q.x, q.y); g.lineTo(q.x + Math.cos(a) * 2, q.y + Math.sin(a) * 2); g.stroke(); }
    });
  }
  // ------------------------------------------------------------------ disegni grandi (sopra le tessere)
  function mill(g, x, y, fr, stop) {
    g.fillStyle = "rgba(0,0,0,.22)"; g.beginPath(); g.ellipse(x, y, 14, 4, 0, 0, 7); g.fill();
    g.fillStyle = "#e8dcc0"; g.beginPath(); g.moveTo(x - 10, y); g.lineTo(x - 6, y - 38); g.lineTo(x + 6, y - 38); g.lineTo(x + 10, y); g.closePath(); g.fill();
    g.fillStyle = "rgba(0,0,0,.12)"; g.beginPath(); g.moveTo(x + 2, y); g.lineTo(x + 3, y - 38); g.lineTo(x + 6, y - 38); g.lineTo(x + 10, y); g.closePath(); g.fill();
    g.fillStyle = "#a04a32"; g.beginPath(); g.moveTo(x - 9, y - 37); g.lineTo(x, y - 48); g.lineTo(x + 9, y - 37); g.closePath(); g.fill();
    g.fillStyle = "#5a3a22"; g.fillRect(x - 3, y - 9, 6, 9); g.fillStyle = "#7aa0c0"; g.fillRect(x - 2, y - 26, 4, 4);
    const spd = stop ? 0 : Math.max(0.004, WND.str * 0.05), a = (fr * spd) % (Math.PI * 2), hx = x, hy = y - 36;
    g.save(); g.translate(hx, hy); g.rotate(a);
    for (let i = 0; i < 4; i++) { g.rotate(Math.PI / 2); g.fillStyle = "#6a4a2a"; g.fillRect(-1, 0, 2, 22); g.fillStyle = "rgba(244,236,214,.92)"; g.fillRect(1, 5, 6, 16); g.strokeStyle = "rgba(106,74,42,.6)"; g.lineWidth = 0.5; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(1, 7 + k * 4); g.lineTo(7, 7 + k * 4); g.stroke(); } }
    g.restore(); g.fillStyle = "#3a2a1a"; g.beginPath(); g.arc(hx, hy, 2.2, 0, 7); g.fill();
  }
  function bigTree(g, x, y, fr) {
    g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(x, y, 30, 8, 0, 0, 7); g.fill();
    g.fillStyle = "#5a3e26"; g.beginPath(); g.moveTo(x - 10, y); g.quadraticCurveTo(x - 6, y - 24, x - 4, y - 40); g.lineTo(x + 4, y - 40); g.quadraticCurveTo(x + 6, y - 24, x + 10, y); g.closePath(); g.fill();
    g.fillStyle = "#6e4e30"; g.fillRect(x - 3, y - 36, 3, 30);
    const sw = Math.sin(fr / 70) * 1.5 + (K.ZX.wind || 0) * 1.2, C = ["#2f6a32", "#3f8440", "#5aa04e", "#86c460"];
    [[0, -62, 30], [-22, -50, 20], [22, -50, 20], [-12, -72, 18], [14, -72, 18], [0, -84, 14]].forEach(([dx, dy, r], i) => { g.fillStyle = C[i % 3]; g.beginPath(); g.arc(x + dx + sw * (1 + i * 0.1), y + dy, r, 0, 7); g.fill(); });
    [[-8, -76, 6], [10, -66, 7], [-18, -58, 5]].forEach(([dx, dy, r]) => { g.fillStyle = C[3]; g.beginPath(); g.arc(x + dx + sw, y + dy, r, 0, 7); g.fill(); });
    g.fillStyle = "#d84a3a"; g.fillRect(x - 12, y - 30, 24, 2); g.fillStyle = "#f4efe0"; for (let i = 0; i < 4; i++) g.fillRect(x - 10 + i * 6, y - 28, 3, 5 + (i % 2) * 2); // la corda sacra con le strisce di carta
  }

  // ------------------------------------------------------------------ il Quaderno del Custode
  function quaderno(K) {
    const m = K.mem(), h0 = K.hero() || { name: "Campione", num: 9 }, soffi = soffiFound();
    const st = (k) => m.st[k] | 0, bt = (v) => (v >= 5 ? "fortissima" : v >= 3 ? "forte" : v >= 1 ? "c'è" : v <= -3 ? "incrinata" : "ancora niente");
    const lore = K.loreList().map(([k, d]) => (m.lore.includes(k) ? `• <b>${K.esc(d.t)}</b><br><span style="color:var(--dim)">${K.esc(K.T(d.d))}</span>` : "<span style='color:var(--dim)'>• ???</span>")).join("<br>");
    const ends = E.api.endings().map((e) => (e.found ? `✓ <b>${K.esc(e.title)}</b> <span style="color:var(--dim)">${K.esc(e.desc)}</span>` : `<span style='color:var(--dim)'>• ??? · ${K.esc(e.hint)}</span>`)).join("<br>");
    return `<b>${K.esc(h0.name)}</b> · ${K.F.is("ve_chiave") ? "custode del prato" : "forestiero"} · n. ${K.esc(h0.num)}<br>Fiducia di Selva: ${bt(st("selva"))} · Amicizia di Ottone: ${bt(st("ottone"))}<br>Gioia della valle: ${st("gioia")} · Patto con la Compagnia: ${st("turbine")}<br>Soffi trovati: <b>${soffi.got}/${soffi.tot}</b><br><br><b>Pagine del vecchio custode</b> (${m.lore.length}/${K.loreList().length})<br>${lore || "<span style='color:var(--dim)'>Niente, per ora.</span>"}<br><br><b>Finali</b><br>${ends}`;
  }
  function soffiFound() {
    const r = K.safe(() => K.api.trRec(), null), got = r ? Object.keys(r.got || {}).filter((z) => z.startsWith("ve_")).reduce((a, z) => a + (r.got[z] || []).length, 0) : 0;
    const tot = Object.keys(K.api ? K.api.TRZ : {}).filter((z) => z.startsWith("ve_")).reduce((a, z) => a + ((K.api.TRZ[z].items || []).length), 0);
    return { got, tot };
  }
  K.soffi = soffiFound; K.WND = WND; K.fromName = fromName;
  window.__vento = E.api;
})();
