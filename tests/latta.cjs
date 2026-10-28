// tests/latta.cjs - «Il Pallone di Latta»: zone raggiungibili, capitolo 1 completo (livelli finti), motore «A scorrimento» vero (comandi, pallone, capo)
const L = require("./lib.cjs");
const MOD = { mod: "__latta", key: "ali-di-rondine.latta" };
const K_ = "window.__latta._dbg.K";
const ZONES = ["lt_piazza", "lt_armeria", "lt_taverna"];
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function start(w, save, pick) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => { window.__noSfx = 1; window.__latta.open(); }); await r.page.waitForTimeout(500);
  await L.advance(r.page, pick ? [pick] : []).catch(() => {}); return r;
}
const stubLevel = (p) => p.evaluate(() => { window.__scorri.start = (o) => { (window.__scLog = window.__scLog || []).push({ id: o.level && o.level.id, bonus: o.bonus }); setTimeout(() => o.onDone({ win: true, coins: 12, ban: 1, banTot: 3, banMask: 1, time: 90 }), 10); return true; }; });
async function zonesTest(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1 } });
  for (const z of ZONES) {
    try { await go(page, z); await L.shot(page, "lt_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Pallone di Latta · zone (${w} px)`, errors); await browser.close();
}
async function flow(w, alt) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1 } });
  await stubLevel(page);
  const st = async (n, what) => { const i = await L.info(page); if (i.step[1] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
  try {
    await go(page, "lt_piazza", 14, 7); await L.talk(page, "lt_araldo"); await L.advance(page, [alt ? "Quanto paga" : "Per il Palio"]); await st(1, "dopo l'Araldo");
    await L.goAct(page, 14, 2); await L.advance(page); await st(1, "portone chiuso");
    await go(page, "lt_armeria", 8, 8); await L.talk(page, "lt_ottavia"); await L.advance(page);
    await L.goAct(page, 8, 3); await L.advance(page); await st(2, "dopo l'armatura");
    await L.talk(page, "lt_ottavia"); await L.advance(page, [alt ? "Quanto vale" : "La riporterò"]);
    await go(page, "lt_taverna", 8, 8); await L.talk(page, "lt_bacco"); await L.advance(page);
    await L.talk(page, "lt_mattonaro"); await L.advance(page, [alt ? "Stringi" : "non è in vendita"]);
    await go(page, "lt_piazza", 5, 13); await L.talk(page, "lt_gelsa"); await L.advance(page);
    await page.evaluate(() => { const b = document.querySelector("#bMenu, [data-act=menu]"); return !!b; });
    await go(page, "lt_piazza", 14, 4); await L.goAct(page, 14, 2); await L.advance(page, ["Sali sulle Mura"]); await L.advance(page).catch(() => {});
    await st(3, "dopo le Mura");
    await L.goAct(page, 14, 2); await L.advance(page, ["Sali al Torrione"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
    const lg = await page.evaluate(() => window.__scLog); if (!lg || lg.length !== 2 || lg[0].id !== "mura" || lg[1].id !== "torrione") errors.push("livelli: " + JSON.stringify(lg));
    const k = await page.evaluate((k) => { const K = eval(k); return { sp: K.inv.has("lt_spallaccio"), won: K.scroll.won("mura"), ban: K.scroll.ban("mura"), torta: K.inv.has("lt_torta"), patto: K.F.is("lt_patto") }; }, K_);
    if (!k.sp || !k.won || k.ban !== 1 || !k.torta || k.patto !== !!alt) errors.push("stato finale: " + JSON.stringify(k));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Pallone di Latta · capitolo 1${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// motore vero: si apre dal portone, i tasti muovono, il pallone si calcia e torna, il capo si batte
async function realEngine(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1, lt_armeria: 1 }, ch: 1, step: { 1: 2 }, flags: { lt_armatura: 1, lt_ott1: 1 } });
  try {
    await go(page, "lt_piazza", 14, 4); await L.goAct(page, 14, 2);
    for (let k = 0; k < 10; k++) { const ok = await page.evaluate(() => { if (window.__scorri.state && document.getElementById("scOv")) return 1; const b = [...document.querySelectorAll("#choices button")].find((x) => /Sali sulle Mura|^Continua/.test(x.innerText.trim())); if (b) b.click(); return 0; }); if (ok) break; await page.waitForTimeout(350); }
    await page.waitForTimeout(600);
    if (!(await page.evaluate(() => !!document.getElementById("scOv")))) throw new Error("livello non aperto");
    await L.shot(page, "lt_scorri_tut_" + w);
    await page.evaluate(() => { const b = [...document.querySelectorAll("#scOv .tut button")].find((x) => /Gioca|Salta/.test(x.innerText)); if (b) b.click(); });
    await page.waitForTimeout(300);
    const h0 = await page.evaluate(() => window.__scorri.state.hero);
    await page.evaluate(() => { const b = document.querySelector('#scOv [data-k="R"]'); b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 })); });
    await page.waitForTimeout(700);
    await page.evaluate(() => { const b = document.querySelector('#scOv [data-k="R"]'); b.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1 })); });
    const h1 = await page.evaluate(() => window.__scorri.state.hero); if (!(h1.x > h0.x + 20)) errors.push("▶ non muove l'eroe: " + JSON.stringify([h0.x, h1.x]));
    await page.evaluate(() => window.__scorri.state.press("K", true)); await page.waitForTimeout(80); await page.evaluate(() => window.__scorri.state.press("K", false)); await page.waitForTimeout(150);
    const b1 = await page.evaluate(() => window.__scorri.state.ball.st); if (b1 === "held") errors.push("⚽ non calcia il pallone");
    await L.shot(page, "lt_scorri_mura_" + w);
    await page.evaluate(() => window.__scorri.state.finish("all")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
    const s = await page.evaluate((k) => { const K = eval(k); return { won: K.scroll.won("mura"), ban: K.scroll.ban("mura"), step: K.stepOf(1) }; }, K_);
    if (!s.won || s.ban !== 3 || s.step !== 3) errors.push("dopo le Mura: " + JSON.stringify(s));
    // il capo: si apre il Torrione e si guarda che il Corvo esista e si muova
    await L.goAct(page, 14, 2);
    for (let k = 0; k < 10; k++) { const ok = await page.evaluate(() => { if (window.__scorri.state && document.getElementById("scOv")) return 1; const b = [...document.querySelectorAll("#choices button")].find((x) => /Sali al Torrione|^Continua/.test(x.innerText.trim())); if (b) b.click(); return 0; }); if (ok) break; await page.waitForTimeout(350); }
    await page.waitForTimeout(1500);
    const bo = await page.evaluate(() => window.__scorri.state.boss); if (!bo || bo.hp < 4) errors.push("capo assente: " + JSON.stringify(bo));
    await L.shot(page, "lt_scorri_boss_" + w);
    await page.evaluate(() => window.__scorri.state.finish(true)); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo non chiuso dopo il capo");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Pallone di Latta · A scorrimento vero (${w} px)`, errors); await browser.close();
}
// simulazione: il Corvo Maggiore si batte davvero (si pianta, si salta in testa)
async function bossSim() {
  const { browser, page, errors } = await L.setup({ w: 800, h: 400, ...MOD });
  try {
    const r = await page.evaluate(async () => {
      window.__noSfx = 1; const lv = window.__latta._dbg.K.scroll.levels.torrione; let res = null;
      window.__scorri.start({ level: Object.assign({ id: "torrione" }, lv), tutorial: false, onDone: (x) => { res = x; } });
      const s = window.__scorri.state, sl = (ms) => new Promise((r) => setTimeout(r, ms));
      for (let t = 0; t < 1400 && !res; t++) { const b = s.boss, h = s.hero; if (!b) break; if (b.st === "stuck" && b.y > 150) { if (h.y > 140 || Math.abs(h.x - b.x) > 6) s.warp(b.x, 120); } else if (b.st === "dive") { if (Math.abs(h.x - b.x) < 40) s.warp(b.x > 190 ? 60 : 320, 175); } s.tick(1); if (s.phase === "win") { s.finish(true); break; } if (s.phase === "ko") { s.finish(false); break; } }
      await sl(50); return res || { boss: s.boss };
    });
    if (!r || !r.win) errors.push("capo non battibile: " + JSON.stringify(r));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Pallone di Latta · Corvo Maggiore battibile", errors); await browser.close();
}

// ---------------------------------------------------------------- capitolo 2
const SAVE2 = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1 }, ch: 2, max: 2, done: { 1: "ok" }, step: { 1: 4, 2: 0 }, flags: { lt_armatura: 1, lt_c1_done: 1 } };
async function zones2(w) {
  const { browser, page, errors } = await start(w, SAVE2);
  for (const z of ["lt_vicoli", "lt_bottega", "lt_sacrestia"]) {
    try { await go(page, z); await L.shot(page, "lt_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Pallone di Latta · zone cap.2 (${w} px)`, errors); await browser.close();
}
async function flow2(w, alt) {
  const { browser, page, errors } = await start(w, SAVE2);
  await stubLevel(page);
  const st = async (n, what) => { const i = await L.info(page); if (i.step[2] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
  try {
    await go(page, "lt_vicoli", 20, 11); await L.talk(page, "lt_tobia"); await L.advance(page); await st(1, "dopo Tobia");
    await go(page, "lt_vicoli", 11, 7); await L.goAct(page, 10, 7); await L.advance(page); await st(1, "scala corta");
    await go(page, "lt_vicoli", 8, 15); await L.talk(page, "lt_rina"); await L.advance(page, ["Promesso"]);
    await go(page, "lt_vicoli", 24, 13); await L.talk(page, "lt_mattonaro"); await L.advance(page);
    await go(page, "lt_bottega", 7, 7); await L.talk(page, "lt_zeno"); await L.advance(page, [alt ? "Quanto vale" : "Lasciami"]); await st(2, "dopo Zeno");
    await go(page, "lt_vicoli", 11, 7); await L.goAct(page, 10, 7); await L.advance(page, ["Sali sui tetti"]); await L.advance(page).catch(() => {}); await st(3, "dopo i tetti");
    await go(page, "lt_sacrestia", 12, 4); await L.goAct(page, 13, 2); await L.advance(page, ["Sali nel Campanile", alt ? "Vendilo" : "Torna alla campana"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
    const lg = await page.evaluate(() => window.__scLog); if (!lg || lg.length !== 2 || lg[0].id !== "tetti" || lg[1].id !== "campanile") errors.push("livelli: " + JSON.stringify(lg));
    const k = await page.evaluate((k) => { const K = eval(k); return { pg: K.inv.has("lt_pagina"), bat: K.inv.has("lt_batacchio"), ok: K.F.is("lt_campana_ok"), v: K.F.is("lt_campana_venduta") }; }, K_);
    if (!k.pg || k.bat || k.ok === !!alt || k.v !== !!alt) errors.push("stato finale: " + JSON.stringify(k));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Pallone di Latta · capitolo 2${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// motore: i comignoli spingono su fino alla trave, il primo salto arriva alle travi dei gettoni, Sgrinfia si batte
async function tettiSim() {
  const { browser, page, errors } = await L.setup({ w: 800, h: 400, ...MOD });
  try {
    const r = await page.evaluate(async () => {
      window.__noSfx = 1; const LV = window.__latta._dbg.K.scroll.levels, sl = (ms) => new Promise((r) => setTimeout(r, ms)), out = {};
      window.__scorri.start({ level: Object.assign({ id: "tetti" }, LV.tetti), tutorial: false, onDone: () => {} });
      let s = window.__scorri.state; Object.assign(out, s.counts);
      s.warp(25 * 16 + 8, 150); s.tick(4); s.press("L", true); s.tick(2); s.press("L", false); let minY = 999; for (let i = 0; i < 160; i++) { s.tick(1); minY = Math.min(minY, s.hero.y); } s.press("R", true); s.tick(12); s.press("R", false); s.tick(80); out.vent = [Math.round(minY), Math.round(s.hero.y)];
      s.finish(false); await sl(50);
      let res = null; window.__scorri.start({ level: Object.assign({ id: "campanile" }, LV.campanile), tutorial: false, onDone: (x) => { res = x; } });
      s = window.__scorri.state;
      for (let t = 0; t < 3000 && !res; t++) { const b = s.boss, h = s.hero; if (!b) break; if (b.st === "dizzy" && b.hitT <= 0) { if (h.y > b.y - 30 || Math.abs(h.x - b.x) > 6) s.warp(b.x, b.y - 46); } else if (b.st !== "dizzy" && Math.abs(h.x - b.x) < 60) s.warp(b.x > 200 ? 72 : 344, 120); s.tick(1); if (s.phase === "win") { s.finish(true); break; } if (s.phase === "ko") { s.finish(false); break; } }
      await sl(50); out.boss = res || { boss: s.boss }; return out;
    });
    if (r.vents !== 4 || r.falls < 5 || r.cats < 3) errors.push("tetti: " + JSON.stringify(r));
    if (!(r.vent[0] < 60 && r.vent[1] === 64)) errors.push("comignolo non porta sulla trave: " + JSON.stringify(r.vent));
    if (!r.boss || !r.boss.win) errors.push("Sgrinfia non battibile: " + JSON.stringify(r.boss));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Pallone di Latta · tetti e Sgrinfia", errors); await browser.close();
}

// ---------------------------------------------------------------- capitolo 3
const SAVE3 = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, ch3: 1 }, ch: 3, max: 3, done: { 1: "ok", 2: "tobia" }, step: { 1: 4, 2: 4, 3: 0 }, flags: { lt_armatura: 1, lt_c1_done: 1, lt_c2_done: 1 } };
async function zones3(w) {
  const { browser, page, errors } = await start(w, SAVE3);
  for (const z of ["lt_chiostro", "lt_archivio", "lt_cappella"]) {
    try { await go(page, z); await L.shot(page, "lt_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Pallone di Latta · zone cap.3 (${w} px)`, errors); await browser.close();
}
async function flow3(w, alt) {
  const { browser, page, errors } = await start(w, SAVE3);
  await stubLevel(page);
  const st = async (n, what) => { const i = await L.info(page); if (i.step[3] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
  try {
    await go(page, "lt_chiostro", 15, 11); await L.talk(page, "lt_benedetta"); await L.advance(page); await st(1, "dopo la Badessa");
    await go(page, "lt_chiostro", 6, 17); await L.talk(page, "lt_gelsa"); await L.advance(page);
    await go(page, "lt_chiostro", 21, 12); await L.talk(page, "lt_mattonaro"); await L.advance(page);
    await go(page, "lt_cappella", 12, 4); await L.goAct(page, 13, 2); await L.advance(page); await st(1, "cripta chiusa");
    await go(page, "lt_archivio", 8, 6); await L.goAct(page, 7, 4); await L.advance(page); await st(1, "libro prima di Ottavia");
    await L.talk(page, "lt_ottavia"); await L.advance(page);
    await L.goAct(page, 7, 4); await L.advance(page, [alt ? "Fotografala" : "Leggila"]); await st(2, "dopo il Libro");
    await go(page, "lt_cappella", 12, 4); await L.goAct(page, 13, 2); await L.advance(page, ["Scendi nella cripta"]); await L.advance(page).catch(() => {}); await st(3, "dopo la cripta");
    await L.goAct(page, 13, 2); await L.advance(page, ["Affronta il Custode", alt ? "Vendila" : "A Zeno"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
    const lg = await page.evaluate(() => window.__scLog); if (!lg || lg.length !== 2 || lg[0].id !== "cripta" || lg[1].id !== "custode") errors.push("livelli: " + JSON.stringify(lg));
    const k = await page.evaluate((k) => { const K = eval(k); return { ch: K.inv.has("lt_chiave"), le: K.inv.has("lt_lettera"), z: K.F.is("lt_lettera_zeno"), v: K.F.is("lt_lettera_venduta"), foto: K.F.is("lt_foto") }; }, K_);
    if (!k.ch || k.le || k.z === !!alt || k.v !== !!alt || k.foto !== !!alt) errors.push("stato finale: " + JSON.stringify(k));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Pallone di Latta · capitolo 3${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// motore: le campane aprono le grate, i monaci si fermano se guardati, il Custode di Pietra si batte
async function criptaSim() {
  const { browser, page, errors } = await L.setup({ w: 800, h: 400, ...MOD });
  try {
    const r = await page.evaluate(async () => {
      window.__noSfx = 1; const LV = window.__latta._dbg.K.scroll.levels, sl = (ms) => new Promise((r) => setTimeout(r, ms)), out = {};
      window.__scorri.start({ level: Object.assign({ id: "cripta" }, LV.cripta), tutorial: false, onDone: () => {} });
      let s = window.__scorri.state; out.c0 = s.counts;
      s.warp(17 * 16, 176); s.tick(5); s.press("R", true); s.tick(2); s.press("R", false); s.press("K", true); s.tick(2); s.press("K", false); s.tick(40); out.c1 = s.counts;
      s.warp(80 * 16, 176); s.tick(10); s.ballAt(82 * 16 + 8, 6 * 16 + 10, 1, 0); s.tick(3); out.c2 = s.counts;
      s.finish(false); await sl(50);
      let res = null; window.__scorri.start({ level: Object.assign({ id: "custode" }, LV.custode), tutorial: false, onDone: (x) => { res = x; } });
      s = window.__scorri.state; let sawWave = 0;
      for (let t = 0; t < 4000 && !res; t++) { const b = s.boss, h = s.hero; if (!b) break; if (s.counts.waves) sawWave = 1; if (b.st === "tired" && b.hitT <= 0) { if (h.ground || h.y > b.y - 52 || Math.abs(h.x - b.x) > 6) s.warp(b.x, b.y - 66); } else if (b.st !== "tired" && (Math.abs(h.x - 56) > 4 || h.y > 100)) s.warp(56, 95); s.tick(1); if (s.phase === "win") { s.finish(true); break; } if (s.phase === "ko") { s.finish(false); break; } }
      await sl(50); out.boss = res || { boss: s.boss }; out.wave = sawWave; return out;
    });
    if (r.c0.bells !== 3 || r.c0.ghosts < 4 || r.c0.gates < 20) errors.push("cripta: " + JSON.stringify(r.c0));
    if (r.c1.rung !== 1 || r.c1.gates !== r.c0.gates - 3) errors.push("la prima campana non apre la grata: " + JSON.stringify(r.c1));
    if (r.c2.rung !== 2 || r.c2.gates !== r.c0.gates - 13) errors.push("la seconda campana non apre la grata alta: " + JSON.stringify(r.c2));
    if (!r.wave) errors.push("il Custode non fa l'onda d'urto");
    if (!r.boss || !r.boss.win) errors.push("Custode non battibile: " + JSON.stringify(r.boss));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Pallone di Latta · cripta e Custode di Pietra", errors); await browser.close();
}
// ---------------------------------------------------------------- capitolo 4 e finali
const SAVE4 = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, ch3: 1, ch4: 1 }, ch: 4, max: 4, done: { 1: "ok", 2: "tobia", 3: "zeno" }, step: { 1: 4, 2: 4, 3: 4, 4: 0 }, flags: { lt_armatura: 1, lt_c1_done: 1, lt_c2_done: 1, lt_c3_done: 1, lt_lettera_zeno: 1 } };
async function zones4(w) {
  const { browser, page, errors } = await start(w, SAVE4);
  for (const z of ["lt_rocca", "lt_salone", "lt_studiolo"]) {
    try { await go(page, z); await L.shot(page, "lt_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Pallone di Latta · zone cap.4 (${w} px)`, errors); await browser.close();
}
async function flow4(w, alt) {
  const { browser, page, errors } = await start(w, SAVE4);
  await stubLevel(page);
  const st = async (n, what) => { const i = await L.info(page); if (i.step[4] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
  try {
    await go(page, "lt_rocca", 12, 11); await L.talk(page, "lt_ottavia"); await L.advance(page); await st(1, "dopo Ottavia");
    await go(page, "lt_rocca", 6, 16); await L.talk(page, "lt_gelsa"); await L.advance(page);
    await go(page, "lt_studiolo", 13, 4); await L.goAct(page, 13, 2); await L.advance(page); await st(1, "porta senza sigillo");
    await go(page, "lt_salone", 8, 5); await L.goAct(page, 8, 3); await L.advance(page); await st(1, "sigillo prima di Mattonaro");
    await L.talk(page, "lt_mattonaro"); await L.advance(page, [alt ? "Ne riparliamo in cima" : "Ferro non è arredo"]);
    await L.goAct(page, 8, 3); await L.advance(page); await st(2, "dopo il sigillo");
    await go(page, "lt_studiolo", 13, 4); await L.talk(page, "lt_benedetta"); await L.advance(page);
    await L.goAct(page, 13, 2); await L.advance(page, ["Sali sulla torre"]); await L.advance(page).catch(() => {}); await st(3, "dopo la torre");
    await L.goAct(page, 13, 2); await L.advance(page, ["Affronta il Conestabile", alt ? "Firma con Mattonaro" : "Lascia che Ferro riposi"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (!i.done[4]) errors.push("capitolo 4 non concluso: " + JSON.stringify([i.done, i.step]));
    const lg = await page.evaluate(() => window.__scLog); if (!lg || lg.length !== 2 || lg[0].id !== "torre" || lg[1].id !== "spalti") errors.push("livelli: " + JSON.stringify(lg));
    const k = await page.evaluate((k) => { const K = eval(k); return { r: K.F.is("lt_fine_riposo"), m: K.F.is("lt_fine_resort"), p: K.F.is("lt_patto4"), d: K.F.is("lt_c4_done") }; }, K_);
    if (!k.d || k.r === !!alt || k.m !== !!alt || k.p !== !!alt) errors.push("finale: " + JSON.stringify(k));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Pallone di Latta · capitolo 4 e finale${alt ? " resort" : " riposo"} (${w} px)`, errors); await browser.close();
}
// motore: la torre ha vento e fulmini, il Conestabile si batte saltandogli addosso quando è stordito
async function torreSim() {
  const { browser, page, errors } = await L.setup({ w: 800, h: 400, ...MOD });
  try {
    const r = await page.evaluate(async () => {
      window.__noSfx = 1; const LV = window.__latta._dbg.K.scroll.levels, sl = (ms) => new Promise((r) => setTimeout(r, ms)), out = { wind: 0, bolts: 0 };
      window.__scorri.start({ level: Object.assign({ id: "torre" }, LV.torre), tutorial: false, onDone: () => {} });
      let s = window.__scorri.state;
      for (let t = 0; t < 900; t++) { s.tick(1); const c = s.counts; if (Math.abs(c.wind) > 0.05) out.wind = 1; if (c.bolts) out.bolts = 1; }
      s.finish(false); await sl(50);
      let res = null; window.__scorri.start({ level: Object.assign({ id: "spalti" }, LV.spalti), tutorial: false, onDone: (x) => { res = x; } });
      s = window.__scorri.state; const sts = {}; let side = 0;
      for (let t = 0; t < 6000 && !res; t++) { const b = s.boss, h = s.hero; if (!b) break; sts[b.st] = 1; if (b.st === "stun" && b.hitT <= 0) { const sx = b.x < 200 ? b.x - 12 : b.x + 12; if (h.ground || h.y > b.y - 36 || Math.abs(h.x - sx) > 6) s.warp(sx, b.y - 70); } else if (b.st !== "stun") { if (s.counts.cards && Math.abs(b.x - h.x) < 40) side = 1 - side; const px = side ? 344 : 64; if (Math.abs(h.x - px) > 4 || h.y > 112) s.warp(px, 111); } s.tick(1); if (s.phase === "win") { s.finish(true); break; } if (s.phase === "ko") { s.finish(false); break; } }
      await sl(50); out.boss = res || { boss: s.boss, phase: s.phase }; out.sts = Object.keys(sts); return out;
    });
    if (!r.wind) errors.push("niente raffiche nella torre");
    if (!r.bolts) errors.push("niente fulmini nella torre");
    if (!["float", "aim", "charge", "stun"].every((x) => r.sts.includes(x))) errors.push("stati del Conestabile: " + r.sts.join(","));
    if (!r.boss || !r.boss.win) errors.push("Conestabile non battibile: " + JSON.stringify(r.boss));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Pallone di Latta · torre e Conestabile", errors); await browser.close();
}
(async () => {
  const only = process.argv[2];
  for (const w of [390, 320]) { if (!only || only === "zone") await zonesTest(w); }
  if (!only || only === "flow") { await flow(390, false); await flow(320, true); }
  if (!only || only === "motore") { await realEngine(390); await realEngine(800); }
  if (!only || only === "capo") await bossSim();
  if (!only || only === "zone2") { await zones2(390); await zones2(320); }
  if (!only || only === "flow2") { await flow2(390, false); await flow2(320, true); }
  if (!only || only === "tetti") await tettiSim();
  if (!only || only === "zone3") { await zones3(390); await zones3(320); }
  if (!only || only === "flow3") { await flow3(390, false); await flow3(320, true); }
  if (!only || only === "cripta") await criptaSim();
  if (!only || only === "zone4") { await zones4(390); await zones4(320); }
  if (!only || only === "flow4") { await flow4(390, false); await flow4(320, true); }
  if (!only || only === "torre") await torreSim();
})();
