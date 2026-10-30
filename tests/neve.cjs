// tests/neve.cjs - «Il Guardiano di Neve»: zone raggiungibili, Termometro, capitolo 1 completo (livelli finti), motore «A scorrimento» col kit guanti (parata, planata, capo)
const L = require("./lib.cjs");
const MOD = { mod: "__neve", key: "ali-di-rondine.neve" };
const K_ = "window.__neve._dbg.K";
const ZONES = ["gn_paese", "gn_bar", "gn_casa"];
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function start(w, save, pick) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => { window.__noSfx = 1; window.__neve.open(); }); await r.page.waitForTimeout(500);
  await L.advance(r.page, pick ? [pick] : []).catch(() => {}); return r;
}
const stubLevel = (p) => p.evaluate(() => { window.__scorri.start = (o) => { (window.__scLog = window.__scLog || []).push({ id: o.level && o.level.id, kit: o.level && o.level.kit, bonus: o.bonus }); setTimeout(() => o.onDone({ win: true, coins: 12, ban: 1, banTot: 3, banMask: 1, time: 90 }), 10); return true; }; });
async function zonesTest(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1 } });
  for (const z of ZONES) {
    try { await go(page, z); await L.shot(page, "gn_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Guardiano di Neve · zone (${w} px)`, errors); await browser.close();
}
// il Termometro: all'aperto il Calore scende, vicino al braciere risale, a zero si torna in piazza al caldo
async function coldTest() {
  const { browser, page, errors } = await start(390, { v: 1, diffSet: true, intro: { ch1: 1 } });
  try {
    await go(page, "gn_paese", 15, 19);
    const r = await page.evaluate((k) => { const K = eval(k), C = K.cold, sp = K.zone("gn_paese").spec || K.zone("gn_paese"), o = {}; C.set(C.max); for (let i = 0; i < 30; i++) C.tick("gn_paese", sp, 15 * 16 + 8, 19 * 16 + 8, 1); o.cold = C.get(); for (let i = 0; i < 20; i++) C.tick("gn_paese", sp, 14 * 16 + 8, 12 * 16 + 8, 1); o.warm = C.get(); C.set(1); for (let i = 0; i < 14; i++) C.tick("gn_paese", sp, 15 * 16 + 8, 19 * 16 + 8, 1); o.zero = C.get(); o.max = C.max; return o; }, K_);
    if (!(r.cold < r.max)) errors.push("il Calore non scende all'aperto: " + JSON.stringify(r));
    if (!(r.warm > r.cold)) errors.push("il braciere non scalda: " + JSON.stringify(r));
    if (r.zero !== r.max) errors.push("a zero non si torna al caldo: " + JSON.stringify(r));
    await page.waitForTimeout(400); await L.advance(page).catch(() => {}); await page.waitForTimeout(500);
    await L.shot(page, "gn_freddo_390");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Guardiano di Neve · Termometro", errors); await browser.close();
}
async function flow(w, alt) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1 } });
  await stubLevel(page);
  const st = async (n, what) => { const i = await L.info(page); if ((i.step[1] || 0) !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
  try {
    await go(page, "gn_paese", 14, 4); await L.goAct(page, 14, 2); await L.advance(page); await st(0, "cancello chiuso");
    await go(page, "gn_bar", 4, 5); await L.talk(page, "gn_tecla"); await L.advance(page); await st(1, "dopo Tecla");
    await go(page, "gn_casa", 6, 7); await L.talk(page, "gn_olmo"); await L.advance(page, [alt ? "Perché non vuole" : "Prendo i guanti"]); await st(2, "dopo Olmo");
    await go(page, "gn_paese", 8, 18); await L.talk(page, "gn_lilli"); await L.advance(page);
    await go(page, "gn_paese", 5, 15); await L.talk(page, "gn_fulvio"); await L.advance(page, [alt ? "Che spiegazione" : "Le parate impossibili"]);
    await go(page, "gn_paese", 14, 4); await L.goAct(page, 14, 2); await L.advance(page, ["Sali nel bosco"]); await L.advance(page).catch(() => {}); await st(3, "dopo il bosco");
    await L.goAct(page, 14, 2); await L.advance(page, ["Sali alla radura", alt ? "Chi è la Regina" : "Torna nel bosco"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
    const lg = await page.evaluate(() => window.__scLog); if (!lg || lg.length !== 2 || lg[0].id !== "bosco" || lg[1].id !== "radura" || lg[0].kit !== "guanti") errors.push("livelli: " + JSON.stringify(lg));
    const k = await page.evaluate((k) => { const K = eval(k); return { g: K.inv.has("gn_guanti"), br: K.inv.has("gn_brule"), sc: K.inv.has("gn_sciarpa"), won: K.scroll.won("bosco"), a: K.F.is("gn_a_chiesto"), b: K.F.is("gn_fiocco_bosco"), d: K.F.is("gn_c1_done") }; }, K_);
    if (!k.g || !k.sc || !k.won || !k.d || k.br !== !!alt || k.a !== !!alt || k.b === !!alt) errors.push("stato finale: " + JSON.stringify(k));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Guardiano di Neve · capitolo 1${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// motore vero: si apre dal cancello, kit guanti (pulsante 🧤, niente pallone), il capo c'è
async function realEngine(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1, gn_casa: 1, gn_bar: 1 }, ch: 1, step: { 1: 2 }, flags: { gn_guanti: 1 } });
  try {
    await go(page, "gn_paese", 14, 4); await L.goAct(page, 14, 2);
    for (let k = 0; k < 10; k++) { const ok = await page.evaluate(() => { if (window.__scorri.state && document.getElementById("scOv")) return 1; const b = [...document.querySelectorAll("#choices button")].find((x) => /Sali nel bosco|^Continua/.test(x.innerText.trim())); if (b) b.click(); return 0; }); if (ok) break; await page.waitForTimeout(350); }
    await page.waitForTimeout(600);
    if (!(await page.evaluate(() => !!document.getElementById("scOv")))) throw new Error("livello non aperto");
    await L.shot(page, "gn_scorri_tut_" + w);
    await page.evaluate(() => { const b = [...document.querySelectorAll("#scOv .tut button")].find((x) => /Gioca|Salta/.test(x.innerText)); if (b) b.click(); });
    await page.waitForTimeout(300);
    const kk = await page.evaluate(() => ({ kit: window.__scorri.state.kit, btn: (document.querySelector('#scOv [data-k="K"]') || {}).innerText, ball: window.__scorri.state.ball && window.__scorri.state.ball.st }));
    if (kk.kit !== "guanti" || kk.btn !== "🧤") errors.push("kit guanti: " + JSON.stringify(kk));
    const h0 = await page.evaluate(() => window.__scorri.state.hero);
    await page.evaluate(() => { const b = document.querySelector('#scOv [data-k="R"]'); b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 })); });
    await page.waitForTimeout(700);
    await page.evaluate(() => { const b = document.querySelector('#scOv [data-k="R"]'); b.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1 })); });
    const h1 = await page.evaluate(() => window.__scorri.state.hero); if (!(h1.x > h0.x + 20)) errors.push("▶ non muove l'eroe: " + JSON.stringify([h0.x, h1.x]));
    await page.evaluate(() => window.__scorri.state.press("K", true)); await page.waitForTimeout(60);
    const pr = await page.evaluate(() => window.__scorri.state.parry); await page.evaluate(() => window.__scorri.state.press("K", false));
    if (!(pr > 0)) errors.push("🧤 non para");
    await page.evaluate(() => { const s = window.__scorri.state; s.warp(13 * 16, 176); }); await page.waitForTimeout(900);
    await L.shot(page, "gn_scorri_bosco_" + w);
    await page.evaluate(() => window.__scorri.state.finish("all")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
    const s = await page.evaluate((k) => { const K = eval(k); return { won: K.scroll.won("bosco"), ban: K.scroll.ban("bosco"), step: K.stepOf(1) }; }, K_);
    if (!s.won || s.ban !== 3 || s.step !== 3) errors.push("dopo il bosco: " + JSON.stringify(s));
    await L.goAct(page, 14, 2);
    for (let k = 0; k < 10; k++) { const ok = await page.evaluate(() => { if (window.__scorri.state && document.getElementById("scOv")) return 1; const b = [...document.querySelectorAll("#choices button")].find((x) => /Sali alla radura|^Continua/.test(x.innerText.trim())); if (b) b.click(); return 0; }); if (ok) break; await page.waitForTimeout(350); }
    await page.waitForTimeout(1500);
    const bo = await page.evaluate(() => window.__scorri.state.boss); if (!bo || bo.hp < 6) errors.push("capo assente: " + JSON.stringify(bo));
    await L.shot(page, "gn_scorri_boss_" + w);
    // game over vero: col Ko il capo torna con l'energia piena; finite le 3 vite il livello ricomincia da capo
    const gov = await page.evaluate(async () => {
      const s = window.__scorri.state, sl = (ms) => new Promise((r) => setTimeout(r, ms)), out = {}; const full = s.boss.hp;
      s.bossHit(4); await sl(100); out.hit = s.boss.hp; s.ko(); await sl(300); out.lives1 = s.lives; out.btn = (document.getElementById("scGo") || {}).innerText;
      document.getElementById("scGo").click(); await sl(300); out.after = window.__scorri.state.boss.hp; out.full = full;
      window.__scorri.state.ko(); await sl(200); document.getElementById("scGo").click(); await sl(200); window.__scorri.state.ko(); await sl(300);
      out.lives0 = window.__scorri.state.lives; out.btn0 = (document.getElementById("scGo") || {}).innerText; document.getElementById("scGo").click(); await sl(400);
      out.restart = { lives: window.__scorri.state.lives, phase: window.__scorri.state.phase }; return out;
    });
    if (!(gov.hit < gov.full) || gov.after !== gov.full) errors.push("dopo il Ko il capo non torna pieno: " + JSON.stringify(gov));
    if (gov.lives1 !== 2 || !/gonfalone/.test(gov.btn || "") || gov.lives0 !== 0 || !/Ricomincia/.test(gov.btn0 || "") || gov.restart.lives !== 3 || gov.restart.phase !== "play") errors.push("game over: " + JSON.stringify(gov));
    await page.evaluate(() => window.__scorri.state.finish(true)); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
    await L.advance(page, ["Torna nel bosco"]).catch(() => {});
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo non chiuso dopo il capo");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Guardiano di Neve · A scorrimento vero (${w} px)`, errors); await browser.close();
}
// simulazione: la parata respinge, la planata passa i crepacci, il Raccattapalle si batte
async function sims() {
  const { browser, page, errors } = await L.setup({ w: 800, h: 400, ...MOD });
  try {
    const r = await page.evaluate(async () => {
      window.__noSfx = 1; const LV = window.__neve._dbg.K.scroll.levels, sl = (ms) => new Promise((r) => setTimeout(r, ms)), out = {};
      const open = (id, cb) => { window.__scorri.start({ level: Object.assign({ id, kit: "guanti" }, LV[id]), tutorial: false, onDone: cb || (() => {}) }); return window.__scorri.state; };
      // parata: uno yeti (colonna 14) tira, si para quando la palla è vicina
      let s = open("bosco"); out.kit = s.kit; s.warp(9 * 16, 176); s.press("R", true); s.tick(2); s.press("R", false);
      for (let t = 0; t < 600 && !s.parries; t++) { const h = s.hero, near = s.snow.some((b) => !b.mine && Math.abs(b.x - h.x) < 18 && b.y > h.y - 28 && b.y < h.y + 2); s.press("K", near); s.tick(1); if (s.hero.hp < 3) s.warp(9 * 16, 176); }
      out.parries = s.parries; s.press("K", false);
      // planata: crepaccio largo 8 e 10 tessere
      let jumpGap = (x0) => { s.warp(x0, 176); s.tick(6); s.press("R", true); s.tick(4); s.press("J", true); let g = 0, maxVy = 0; for (let t = 0; t < 200; t++) { s.tick(1); if (s.glide) { g = 1; maxVy = Math.max(maxVy, s.hero.vy); } if (s.hero.ground && t > 10) break; } s.press("J", false); s.press("R", false); return { x: Math.round(s.hero.x), y: Math.round(s.hero.y), g, maxVy: +maxVy.toFixed(2) }; };
      s.finish(false); await sl(50); s = open("bosco"); out.gap1 = jumpGap(45 * 16 + 4); s.finish(false); await sl(50); s = open("bosco"); out.gap2 = jumpGap(77 * 16 + 4);
      s.finish(false); await sl(50);
      // capo: in piedi a sinistra, para le palle; quando è stanco gli si salta in testa; durante il salto si sta sulla trave
      let res = null; s = open("radura", (x) => { res = x; }); const sts = {}, log = [];
      s.warp(60, 176); s.press("R", true); s.tick(1); s.press("R", false);
      for (let t = 0; t < 8000 && !res; t++) {
        const b = s.boss, h = s.hero; if (!b) break; sts[b.st] = 1;
        if (b.st === "tired" && !(b.hitT > 0)) { if (h.ground || h.y > b.y - 50 || Math.abs(h.x - b.x) > 6) s.warp(b.x, b.y - 66); s.press("K", false); }
        else if (b.st === "jump") { if (Math.abs(h.x - 64) > 4 || h.y > 112) s.warp(64, 111); s.press("K", false); }
        else { if (h.y < 170 || Math.abs(h.x - 60) > 30) s.warp(60, 176); const near = s.snow.some((x) => !x.mine && x.x > h.x - 4 && x.x - h.x < 20 && x.y > h.y - 28 && x.y < h.y + 2); s.press("K", near); }
        if (t % 20 === 0) log.push([t, b.st, b.hp, s.hero.hp, Math.round(s.hero.x), Math.round(s.hero.y), s.parries]); s.tick(1); if (s.phase === "win") { s.finish(true); break; } if (s.phase === "ko") { s.finish(false); break; }
      }
      await sl(50); out.boss = res || { boss: s.boss, hp: s.hero && s.hero.hp }; out.log = log; out.sts = Object.keys(sts); out.bossParries = s && s.parries; return out;
    });
    if (r.kit !== "guanti") errors.push("kit: " + r.kit);
    if (!(r.parries > 0)) errors.push("la parata non respinge le palle di neve");
    for (const k of ["gap1", "gap2"]) { const g = r[k]; if (!g.g || g.maxVy > 1 || g.y > 176) errors.push("planata " + k + ": " + JSON.stringify(g)); }
    if (!(r.gap1.x > 54 * 16) || !(r.gap2.x > 80 * 16)) errors.push("crepacci non superati: " + JSON.stringify([r.gap1, r.gap2]));
    if (!["throw", "jump", "tired"].every((x) => r.sts.includes(x))) errors.push("stati del Raccattapalle: " + r.sts.join(","));
    if (!r.boss || !r.boss.win) errors.push("Raccattapalle non battibile: " + JSON.stringify(r.boss) + "\n" + r.log.map((x) => JSON.stringify(x)).join(" "));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Guardiano di Neve · parata, planata e Raccattapalle", errors); await browser.close();
}

// ---------------------------------------------------------------- capitolo 2
const SAVE2 = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1 }, ch: 2, max: 2, done: { 1: "ok" }, step: { 1: 4, 2: 0 }, flags: { gn_guanti: 1, gn_c1_done: 1, gn_fiocco_paese: 1 } };
async function zones2(w) {
  const { browser, page, errors } = await start(w, SAVE2);
  for (const z of ["gn_campo", "gn_chiesa", "gn_proloco"]) {
    try { await go(page, z); await L.shot(page, "gn_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Guardiano di Neve · zone cap.2 (${w} px)`, errors); await browser.close();
}
async function flow2(w, alt) {
  const { browser, page, errors } = await start(w, SAVE2);
  await stubLevel(page);
  const st = async (n, what) => { const i = await L.info(page); if ((i.step[2] || 0) !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
  try {
    await go(page, "gn_campo", 14, 3); await L.goAct(page, 14, 1); await L.advance(page); await st(0, "cancello chiuso");
    await go(page, "gn_campo", 6, 10); await L.talk(page, "gn_olmo"); await L.advance(page, [alt ? "Riporto la Coppa" : "Perché Ilde"]); await st(1, "dopo Olmo");
    await go(page, "gn_proloco", 5, 5); await L.talk(page, "gn_lilli"); await L.advance(page, ["Guardate la cassetta"]);
    await go(page, "gn_chiesa", 8, 4); await L.talk(page, "gn_fulvio"); await L.advance(page, [alt ? "Sono passati" : "Non lo dica a me"]); await st(2, "dopo Fulvio");
    await go(page, "gn_campo", 14, 3); await L.goAct(page, 14, 1); await L.advance(page, ["Sali nel canalone"]); await L.advance(page).catch(() => {}); await st(3, "dopo il canalone");
    await L.goAct(page, 14, 1); await L.advance(page, ["Sali verso il rifugio", alt ? "Solo firme vecchie" : "Leggi tutto"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
    const lg = await page.evaluate(() => window.__scLog); if (!lg || lg.length !== 2 || lg[0].id !== "canalone" || lg[1].id !== "valanga") errors.push("livelli: " + JSON.stringify(lg));
    const k = await page.evaluate((k) => { const K = eval(k); return { ch: K.inv.has("gn_chiave"), pg: K.inv.has("gn_pagina"), n12: K.F.is("gn_n12"), cas: K.inv.has("gn_cassetta"), lo: K.F.is("gn_letto_olmo"), ta: K.F.is("gn_taciuto"), fi: K.F.is("gn_ful_ilde"), d: K.F.is("gn_c2_done") }; }, K_);
    if (!k.ch || !k.pg || !k.n12 || !k.cas || !k.d || k.lo === !!alt || k.ta !== !!alt || k.fi === !!alt) errors.push("stato finale: " + JSON.stringify(k));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Guardiano di Neve · capitolo 2${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// giocatore automatico: corre a destra, salta muri, buchi e nemici, plana sui crepacci, para le palle vicine
async function autoplay(page, id, bonus) {
  return page.evaluate(async ([id, bonus]) => {
    window.__noSfx = 1; const LV = window.__neveLV; let res = null, pj = false, maxX = 0;
    window.__scorri.start({ level: Object.assign({ id, kit: "guanti" }, LV[id]), tutorial: false, bonus: bonus || 0, onDone: (x) => { res = x; } });
    const s = window.__scorri.state, TS = 16, solid = (t) => "#B~%u".includes(t), sl = (ms) => new Promise((r) => setTimeout(r, ms)), seen = { aval: 0, crumb: 0, r: 0 };
    for (let t = 0; t < 9000 && !res; t++) {
      const h = s.hero; if (!h) break; maxX = Math.max(maxX, h.x);
      const fx = Math.floor(h.x / TS), fy = Math.floor((h.y + 2) / TS), hy = Math.floor((h.y - 4) / TS); let jump = false;
      if (h.ground) { for (let d = 1; d <= 2; d++) { if (solid(s.tileAt(fx + d, hy)) || solid(s.tileAt(fx + d, hy - 1))) jump = true; if (!solid(s.tileAt(fx + d, fy)) && s.tileAt(fx + d, fy) !== "=") jump = true; } }
      if (h.ground && s.foeList.some((e) => e.t !== "a" && e.t !== "Z" && e.x - h.x > 4 && e.x - h.x < (s.sled ? 44 : 30) && Math.abs(e.y + e.h - h.y) < 20)) jump = true;
      let pit = true; for (let d = 0; d < 13; d++) if (solid(s.tileAt(fx, fy + d)) || s.tileAt(fx, fy + d) === "=") pit = false;
      const want = h.ground ? jump && !pj : h.vy < -1 ? pj : pit; s.press("J", want); pj = want; s.press("R", true);
      s.press("K", s.snow.some((b) => !b.mine && Math.abs(b.x - h.x) < 18 && b.y > h.y - 28 && b.y < h.y + 2));
      s.tick(1); if (s.aval && s.aval.x !== null) seen.aval = 1; if (s.crumbs.some((c) => c.gone)) seen.crumb = 1; if (s.foeList.some((e) => e.t === "r" && e.on)) seen.r = 1;
      if (s.phase === "win") { s.finish(true); break; } if (s.phase === "ko") { s.finish(false); break; }
    }
    await sl(30); return { res, maxX: Math.round(maxX / TS), seen };
  }, [id, bonus]);
}
async function levels2() {
  const { browser, page, errors } = await L.setup({ w: 800, h: 400, ...MOD });
  try {
    for (const id of ["canalone", "valanga"]) { const r = await autoplay(page, id, 2); if (!r.res || !r.res.win) errors.push(id + " non completato: " + JSON.stringify(r)); if (id === "valanga" && !r.seen.aval) errors.push("la valanga non parte"); if (id === "canalone" && !r.seen.r) errors.push("niente palle di valanga"); }
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Guardiano di Neve · canalone e valanga completabili", errors); await browser.close();
}
// ---------------------------------------------------------------- capitolo 3
const SAVE3 = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, ch3: 1 }, ch: 3, max: 3, done: { 1: "ok", 2: "ok" }, step: { 1: 4, 2: 4, 3: 0 }, flags: { gn_guanti: 1, gn_c1_done: 1, gn_c2_done: 1, gn_fiocco_paese: 1 } };
async function zones3(w) {
  const { browser, page, errors } = await start(w, SAVE3);
  for (const z of ["gn_rifugio", "gn_rifugio_in", "gn_funivia"]) {
    try { await go(page, z); await L.shot(page, "gn_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Guardiano di Neve · zone cap.3 (${w} px)`, errors); await browser.close();
}
async function flow3(w, alt) {
  const { browser, page, errors } = await start(w, SAVE3);
  await stubLevel(page);
  const st = async (n, what) => { const i = await L.info(page); if ((i.step[3] || 0) !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
  try {
    await go(page, "gn_rifugio", 14, 3); await L.goAct(page, 14, 1); await L.advance(page); await st(0, "cancello chiuso");
    await go(page, "gn_funivia", 11, 6); await L.goAct(page, 11, 5); await L.advance(page); await st(0, "lettere troppo presto");
    await go(page, "gn_rifugio_in", 5, 9); await L.goAct(page, 5, 8); await L.advance(page, [alt ? "Era una bugia" : "Domenica lo deve dire"]); await st(1, "dopo l'armadietto");
    await go(page, "gn_funivia", 11, 6); await L.goAct(page, 11, 5); await L.advance(page, [alt ? "Le lasci" : "Le porterai a Olmo"]); await st(2, "dopo le lettere");
    await go(page, "gn_rifugio", 14, 3); await L.goAct(page, 14, 1); await L.advance(page, ["Sali sul ghiacciaio"]); await L.advance(page).catch(() => {}); await st(3, "dopo i seracchi");
    await L.goAct(page, 14, 1); await L.advance(page, ["Entra nella conca", alt ? "Vado io" : "Olmo, domani"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
    const lg = await page.evaluate(() => window.__scLog); if (!lg || lg.length !== 2 || lg[0].id !== "seracchi" || lg[1].id !== "conca") errors.push("livelli: " + JSON.stringify(lg));
    const k = await page.evaluate((k) => { const K = eval(k); return { m: K.inv.has("gn_maglia12"), l: K.inv.has("gn_lettere"), od: K.F.is("gn_olmo_dire"), sp: K.F.is("gn_storia_paese"), lo: K.F.is("gn_lettere_olmo"), inv: K.F.is("gn_olmo_invito"), d: K.F.is("gn_c3_done") }; }, K_);
    if (!k.m || !k.d || k.l === !!alt || k.lo === !!alt || k.od === !!alt || k.sp !== !!alt || k.inv === !!alt) errors.push("stato finale: " + JSON.stringify(k));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Guardiano di Neve · capitolo 3${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// seracchi completabili (i ponti crollano davvero) e Stambecco battibile: aspetta, para la carica, saltagli in testa da stordito
async function levels3() {
  const { browser, page, errors } = await L.setup({ w: 800, h: 400, ...MOD });
  try {
    const r = await autoplay(page, "seracchi", 2); if (!r.res || !r.res.win) errors.push("seracchi non completati: " + JSON.stringify(r)); if (!r.seen.crumb) errors.push("i ponti di neve non crollano");
    const b = await page.evaluate(async () => {
      window.__noSfx = 1; let res = null; window.__scorri.start({ level: Object.assign({ id: "conca", kit: "guanti" }, window.__neveLV.conca), tutorial: false, onDone: (x) => { res = x; } });
      const s = window.__scorri.state, sts = {}; let side = 60; s.warp(60, 176); s.press("R", true); s.tick(1); s.press("R", false);
      for (let t = 0; t < 6000 && !res; t++) {
        const b = s.boss, h = s.hero; if (!b) break; sts[b.st] = 1;
        if (b.st === "stun" && !(b.hitT > 0)) { if (h.ground || Math.abs(h.x - b.x) > 6) s.warp(b.x, b.y - 52); s.press("K", false); }
        else if (b.st !== "stun") { if (b.st === "paw") side = b.x > 200 ? 60 : 350; if (h.y < 170 || Math.abs(h.x - side) > 10) { s.warp(side, 176); s.press(side < 200 ? "R" : "L", true); s.tick(1); s.press("R", false); s.press("L", false); } s.press("K", b.st === "charge" && Math.abs(b.x - h.x) < 34); }
        s.tick(1); if (s.phase === "win") { s.finish(true); break; } if (s.phase === "ko") { s.finish(false); break; }
      }
      await new Promise((r) => setTimeout(r, 30)); return { res, sts: Object.keys(sts) };
    });
    if (!b.res || !b.res.win) errors.push("Stambecco non battibile: " + JSON.stringify(b)); if (!["paw", "charge", "stun"].every((x) => b.sts.includes(x))) errors.push("stati dello Stambecco: " + b.sts.join(","));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Guardiano di Neve · seracchi e Stambecco", errors); await browser.close();
}
// ---------------------------------------------------------------- capitolo 4 e finali
const SAVE4 = (fl) => ({ v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, ch3: 1, ch4: 1 }, ch: 4, max: 4, done: { 1: "ok", 2: "ok", 3: "ok" }, step: { 1: 4, 2: 4, 3: 4, 4: 0 }, flags: Object.assign({ gn_guanti: 1, gn_c1_done: 1, gn_c2_done: 1, gn_c3_done: 1 }, fl || {}) });
async function zones4(w) {
  const { browser, page, errors } = await start(w, SAVE4({ gn_olmo_vetta: 1 }));
  for (const z of ["gn_morena", "gn_grotta", "gn_cima", "gn_capanna"]) {
    try { await go(page, z); await L.shot(page, "gn_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Guardiano di Neve · zone cap.4 (${w} px)`, errors); await browser.close();
}
async function flow4(w, alt) {
  const { browser, page, errors } = await start(w, SAVE4(alt ? { gn_olmo_invito: 1 } : { gn_olmo_dire: 1 }));
  await stubLevel(page);
  const st = async (n, what) => { const i = await L.info(page); if ((i.step[4] || 0) !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
  try {
    await go(page, "gn_morena", 14, 3); await L.goAct(page, 14, 1); await L.advance(page); await st(0, "cancello chiuso");
    await go(page, "gn_grotta", 11, 3); await L.goAct(page, 12, 2); await L.advance(page); await st(0, "cassa prima di Fiocco");
    await go(page, "gn_morena", 22, 16); await L.talk(page, "gn_fiocco"); await L.advance(page);
    await go(page, "gn_grotta", 11, 3); await L.goAct(page, 12, 2); await L.advance(page, [alt ? "Lo porto a Olmo" : "Lo porto a Ilde"]); await st(1, "dopo la cassa");
    await go(page, "gn_morena", 14, 3); await L.goAct(page, 14, 1); await L.advance(page, ["Sali sulla slitta"]); await L.advance(page).catch(() => {}); await st(2, "dopo la slitta");
    await go(page, "gn_cima", 15, 9); await L.talk(page, "gn_ilde"); await L.advance(page, [alt ? "Valdigelo ha bisogno" : "Olmo lo sa"]); await st(3, "dopo Ilde");
    await go(page, "gn_cima", 14, 4); await L.goAct(page, 15, 4); await L.advance(page, ["Para i rigori", alt ? "In vetrina" : "Giù in paese"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[4] !== (alt ? "leggenda" : "verita")) errors.push("finale: " + JSON.stringify([i.done, i.step]));
    const lg = await page.evaluate(() => window.__scLog); if (!lg || lg.length !== 2 || lg[0].id !== "slitta" || lg[1].id !== "vetta") errors.push("livelli: " + JSON.stringify(lg));
    const k = await page.evaluate((k) => { const K = eval(k); return { c: K.inv.has("gn_coppa"), p: K.inv.has("gn_pallone79"), pi: K.F.is("gn_pallone_ilde"), ov: K.F.is("gn_olmo_vetta"), fv: K.F.is("gn_fine_verita"), fl: K.F.is("gn_fine_leggenda"), d: K.F.is("gn_c4_done") }; }, K_);
    if (!k.c || !k.p || !k.d || k.pi === !!alt || k.ov !== !!alt || k.fv === !!alt || k.fl !== !!alt) errors.push("stato finale: " + JSON.stringify(k));
    await L.shot(page, "gn_fine_" + w);
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Guardiano di Neve · capitolo 4 e finale ${alt ? "leggenda" : "verità"} (${w} px)`, errors); await browser.close();
}
// slitta completabile e Regina battibile: para i rigori vicini, salta le onde della tempesta
async function levels4() {
  const { browser, page, errors } = await L.setup({ w: 800, h: 400, ...MOD });
  try {
    const r = await autoplay(page, "slitta", 2); if (!r.res || !r.res.win) errors.push("slitta non completata: " + JSON.stringify(r));
    const b = await page.evaluate(async () => {
      window.__noSfx = 1; let res = null; window.__scorri.start({ level: Object.assign({ id: "vetta", kit: "guanti" }, window.__neveLV.vetta), tutorial: false, onDone: (x) => { res = x; } });
      const s = window.__scorri.state, sts = {}; let pj = false; s.warp(60, 176); s.press("R", true); s.tick(1); s.press("R", false);
      for (let t = 0; t < 8000 && !res; t++) {
        const b = s.boss, h = s.hero; if (!b) break; sts[b.st] = 1;
        s.press("K", s.snow.some((x) => !x.mine && x.x > h.x - 4 && x.x - h.x < 16 && x.y > h.y - 30 && x.y < h.y + 4));
        const want = h.ground ? (b.st === "storm" && !pj && t % 2 === 0) : pj; s.press("J", want); pj = want;
        s.tick(1); if (s.phase === "win") { s.finish(true); break; } if (s.phase === "ko") { s.finish(false); break; }
      }
      await new Promise((r) => setTimeout(r, 30)); return { res, sts: Object.keys(sts) };
    });
    if (!b.res || !b.res.win) errors.push("Regina non battibile: " + JSON.stringify(b)); if (!["aim", "storm"].every((x) => b.sts.includes(x))) errors.push("stati della Regina: " + b.sts.join(","));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Guardiano di Neve · slitta e Regina del Gelo", errors); await browser.close();
}
(async () => {
  const only = process.argv[2];
  for (const w of [390, 320]) { if (!only || only === "zone") await zonesTest(w); }
  if (!only || only === "freddo") await coldTest();
  if (!only || only === "flow") { await flow(390, false); await flow(320, true); }
  if (!only || only === "motore") { await realEngine(390); await realEngine(800); }
  if (!only || only === "sim") await sims();
  if (!only || only === "zone2") { await zones2(390); await zones2(320); }
  if (!only || only === "flow2") { await flow2(390, false); await flow2(320, true); }
  if (!only || only === "livelli2") await levels2();
  if (!only || only === "zone3") { await zones3(390); await zones3(320); }
  if (!only || only === "flow3") { await flow3(390, false); await flow3(320, true); }
  if (!only || only === "livelli3") await levels3();
  if (!only || only === "zone4") { await zones4(390); await zones4(320); }
  if (!only || only === "flow4") { await flow4(390, false); await flow4(320, true); }
  if (!only || only === "livelli4") await levels4();
})();
