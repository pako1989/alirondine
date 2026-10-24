// tests/diga.cjs - «La Diga di Valpiana»: zone ad ogni livello dell'acqua, Argine, capitoli, finali
const L = require("./lib.cjs");
const MOD = { mod: "__diga", key: "ali-di-rondine.diga" };
const K_ = "window.__diga._dbg.K";
const BASE = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, ch3: 1, ch4: 1, vp_paese: 1, vp_diga: 1, vp_vecchia: 1, vp_cresta: 1 }, st: { fiducia: 3, argine: 2 } };
const CH = { 1: ["vp_paese", "vp_locanda", "vp_municipio", "vp_riva"], 2: ["vp_diga", "vp_sala", "vp_galleria"], 3: ["vp_vecchia", "vp_chiesa"], 4: ["vp_cresta"] };
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
const setLv = (p, n) => p.evaluate(([k, n]) => eval(k).flood.set(n), [K_, n]);
async function zonesTest(w, maxCh) {
  for (const n of [1, 2, 3, 4].filter((x) => CH[x] && x <= (maxCh || 4))) {
    for (const lv of [0, 2, 4]) {
      const save = Object.assign({}, BASE, { ch: n, step: { 1: 3, 2: 3, 3: 3, 4: 0 }, done: { 1: "ok", 2: n > 2 ? "ok" : undefined, 3: n > 3 ? "ok" : undefined }, flags: { vp_c1_done: 1, vp_int: 1 } });
      const { browser, page, errors } = await L.setup({ w, ...MOD, save });
      await page.evaluate(() => window.__diga.open()); await page.waitForTimeout(500); await L.advance(page).catch(() => {});
      await setLv(page, lv);
      for (const z of CH[n]) {
        try { await go(page, z); } catch (e) { errors.push("go " + z + ": " + e.message.slice(0, 120)); continue; }
        if (w === 390 && lv === 0) await L.shot(page, "vp_" + z);
        try {
          let bad = await L.reachAll(page, z);
          const real = await page.evaluate(([z, bad]) => { const Z = window.__borgoApi.TRZ[z], m = window.__tr.trMap(Z); return bad.filter((b) => { const q = /^oggetto (.) (\d+),(\d+)$/.exec(b); if (!q) return true; const x = +q[2], y = +q[3]; return [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => { const c = m[y + dy] && m[y + dy][x + dx]; return c !== undefined && !window.T_.solidAt(m, Z, x + dx, y + dy); }); }); }, [z, bad]);
          bad = real; if (bad.length) errors.push(z + " (acqua " + lv + "): " + bad.join(", "));
        } catch (e) { errors.push("reach " + z + ": " + e.message.slice(0, 160)); }
      }
      L.check(`Valpiana · capitolo ${n} zone, acqua ${lv} (${w} px)`, errors); await browser.close();
    }
  }
}
const info = (p) => L.info(p);
const stubArgine = (p, win = true) => p.evaluate((win) => { window.__argLog = []; window.__argine.start = (o) => { window.__argLog.push(o.level); setTimeout(() => o.onDone({ win, level: o.level, damage: 0, stars: 3 }), 30); }; }, win);
const flagSet = (p, fl) => p.evaluate(([k, fl]) => { const F = eval(k).F; Object.keys(fl).forEach((x) => F.set(x, fl[x])); }, [K_, fl]);
async function start(w, save, btn) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => window.__diga.open()); await r.page.waitForTimeout(300);
  if (btn) { await r.page.evaluate((b) => window.T_.click(b), btn); await L.advance(r.page).catch(() => {}); }
  await stubArgine(r.page); await L.stubMatch(r.page, true); return r;
}
async function flow1(w) {
  const { browser, page, errors } = await start(w, Object.assign({}, BASE), "Inizia la storia");
  await go(page, "vp_paese", 16, 9);
  await L.talk(page, "vp_tilde"); await L.advance(page, ["Ci sono, Sindaca"]);
  let i = await info(page); if (i.step[1] !== 1) errors.push("dopo Tilde: " + JSON.stringify(i.step));
  await L.talk(page, "vp_gino"); await L.advance(page, ["Provi l'Argine"]);
  i = await info(page); if (i.step[1] !== 2) errors.push("dopo Argine 1: " + JSON.stringify(i.step));
  await go(page, "vp_locanda", 9, 10); await L.talk(page, "vp_lorenza"); await L.advance(page, ["Per la diga"]);
  await go(page, "vp_riva", 3, 11); await L.talk(page, "vp_zattera"); await L.advance(page, ["Mangi e ascolti"]);
  i = await info(page); if (i.step[1] !== 3) errors.push("dopo Zattera: " + JSON.stringify(i.step));
  await go(page, "vp_municipio", 10, 11); await L.talk(page, "vp_tilde"); await L.advance(page); await L.advance(page).catch(() => {});
  i = await info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Valpiana · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function flow2(w, verdetto) {
  const save = Object.assign({}, BASE, { ch: 2, step: { 1: 3 }, done: { 1: "ok" }, flags: { vp_c1_done: 1, vp_int: 1 } });
  const { browser, page, errors } = await start(w, save, "Inizia il Capitolo 2");
  await go(page, "vp_diga", 2, 10); await L.talk(page, "vp_ermete"); await L.advance(page);
  let i = await info(page); if (i.step[2] !== 1) errors.push("dopo Ermete: " + JSON.stringify(i.step));
  await go(page, "vp_sala", 11, 11); await L.goAct(page, 10, 3); await L.advance(page); await L.goAct(page, 19, 3); await L.advance(page);
  await go(page, "vp_diga", 20, 10); await L.talk(page, "vp_valvola"); await L.advance(page);
  await go(page, "vp_riva", 9, 14); await L.talk(page, "vp_zattera"); await L.advance(page);
  const n4 = await page.evaluate((k) => eval(k).dossier.list("piena").length, K_); if (n4 !== 4) errors.push("dossier " + n4 + "/4");
  await go(page, "vp_diga", 12, 10); await L.talk(page, "vp_ermete"); await L.advance(page);
  i = await info(page); if (i.step[2] !== 2) errors.push("dopo la chiave: " + JSON.stringify(i.step));
  await go(page, "vp_galleria", 10, 12); await L.goAct(page, 10, 3); await L.advance(page);
  i = await info(page); if (i.step[2] !== 3) errors.push("dopo la crepa: " + JSON.stringify(i.step));
  const lg = await page.evaluate(() => window.__argLog.slice()); if (!lg.includes(2)) errors.push("Argine 2 non partito: " + lg);
  await go(page, "vp_diga", 12, 10); await L.talk(page, "vp_ermete"); await L.advance(page, ["Subito il verdetto"]);
  await go(page, "vp_paese", 12, 9); await L.talk(page, "vp_gino"); await L.advance(page, ["Giochi l'amichevole"]); await L.advance(page).catch(() => {});
  i = await info(page); if (i.step[2] !== 4) errors.push("dopo l'amichevole: " + JSON.stringify(i.step));
  await page.evaluate((k) => { const F = eval(k).F; [0, 1, 2].forEach((j) => F.set("dl_piena_" + j, true)); }, K_);
  await go(page, "vp_diga", 12, 10); await L.talk(page, "vp_ermete"); await L.advance(page, ["Decidi cosa fare", verdetto.label]); await L.advance(page).catch(() => {});
  i = await info(page); if (i.done[2] !== verdetto.id) errors.push("capitolo 2 " + verdetto.id + ": " + JSON.stringify([i.done, i.step]));
  L.check(`Valpiana · capitolo 2 ${verdetto.id} (${w} px)`, errors); await browser.close();
}
async function flow3(w) {
  const save = Object.assign({}, BASE, { ch: 3, step: { 1: 3, 2: 5 }, done: { 1: "ok", 2: "radio" }, flags: { vp_c1_done: 1, vp_int: 1, vp_verdict: "radio" } });
  const { browser, page, errors } = await start(w, save, "Inizia il Capitolo 3");
  await go(page, "vp_paese", 20, 15); await L.talk(page, "vp_zita"); await L.advance(page);
  let i = await info(page); if (i.step[3] !== 1) errors.push("dopo Zita: " + JSON.stringify(i.step));
  await go(page, "vp_diga", 13, 10); await L.talk(page, "vp_ermete"); await L.advance(page, ["Provi l'Argine"]);
  i = await info(page); if (i.step[3] !== 2) errors.push("dopo lo scarico: " + JSON.stringify(i.step));
  const lv = await page.evaluate((k) => eval(k).flood.get(), K_); if (lv > 2) errors.push("lago non sceso: " + lv);
  await go(page, "vp_vecchia", 2, 11);
  for (const [x, y] of [[6, 12], [20, 11], [29, 8], [4, 13], [10, 12], [26, 13]]) { await L.goAct(page, x, y); await L.advance(page); }
  const mem = await page.evaluate((k) => eval(k).stat("memoria"), K_); if (mem < 5) errors.push("memoria " + mem);
  await go(page, "vp_chiesa", 8, 12); await L.goAct(page, 8, 3); await L.advance(page);
  i = await info(page); if (i.step[3] !== 3) errors.push("dopo il pallone: " + JSON.stringify(i.step));
  const lg = await page.evaluate(() => window.__argLog.slice()); if (!lg.includes(3) || !lg.includes(4)) errors.push("Argine 3/4: " + lg);
  await go(page, "vp_paese", 20, 15); await L.talk(page, "vp_zita"); await L.advance(page); await L.advance(page).catch(() => {});
  i = await info(page); if (i.done[3] !== "ok") errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Valpiana · capitolo 3 (${w} px)`, errors); await browser.close();
}
async function flow4(w, fin) {
  const fl = { vp_c1_done: 1, vp_int: 1, vp_c3_done: 1, vp_verdict: "ente", vp_c4_open: 1 };
  const save = Object.assign({}, BASE, { ch: 4, step: { 1: 3, 2: 5, 3: 4, 4: 1 }, done: { 1: "ok", 2: "ente", 3: "ok" }, flags: Object.assign({}, fl, fin.fl || {}), st: Object.assign({ fiducia: 3, argine: 2, memoria: 0 }, fin.st || {}) });
  const { browser, page, errors } = await start(w, save, "Inizia il Capitolo 4");
  await go(page, "vp_cresta", 21, 7);
  if (fin.inv) await page.evaluate(([k, id]) => eval(k).inv.give(id), [K_, fin.inv]);
  await L.talk(page, "vp_ermete"); await L.advance(page, ["Decidi", fin.label]); await L.advance(page).catch(() => {}); await L.advance(page).catch(() => {});
  const i = await info(page); if (i.done[4] !== fin.id || !i.ends.includes(fin.id)) errors.push("finale " + fin.id + ": " + JSON.stringify([i.done, i.ends]));
  L.check(`Valpiana · finale ${fin.id} (${w} px)`, errors); await browser.close();
}
async function argine(w) {
  const save = Object.assign({}, BASE, { ch: 2, step: { 1: 3 }, done: { 1: "ok" }, flags: { vp_c1_done: 1 } });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__salone.salaGiochi(() => {})); await page.waitForTimeout(500);
  const open = await page.evaluate(() => { const b = document.querySelector('[data-m="argine"]'); if (b) b.click(); return !!b; });
  if (!open) errors.push("cabinato Argine assente");
  await page.waitForTimeout(300);
  await page.evaluate(() => { const o = document.querySelector("[data-o]"); if (o) o.click(); });
  for (let i = 0; i < 60 && !(await page.evaluate(() => !!(window.Phaser && window.__argine && window.__argine.scene))); i++) await page.waitForTimeout(250);
  const ok = await page.evaluate(() => !!(window.__argine && window.__argine.scene && window.Phaser)); if (!ok) errors.push("Argine/Phaser non partiti");
  await page.waitForTimeout(800);
  if (w === 390) await L.shot(page, "vp_argine");
  const placed = await page.evaluate(() => { const S = window.__argine.state; try { S.place(60, 250, 180, 280); } catch (e) { return "ERR " + e.message; } return "ok"; });
  if (placed !== "ok") errors.push("posa sacchi: " + placed);
  await page.evaluate(() => window.__argine.state.finish(true)); await page.waitForTimeout(600);
  L.check(`Valpiana · cabinato Argine con Phaser (${w} px)`, errors); await browser.close();
}
(async () => {
  const only = process.argv[2];
  if (!only || only === "zone") await zonesTest(390, 4);
  if (!only || only === "argine") { await argine(390); await argine(320); }
  if (!only || only === "flow") {
    await flow1(390); await flow1(320);
    await flow2(390, { id: "ente", label: "Segnala tutto all'Ente" }); await flow2(320, { id: "radio", label: "Racconta tutto alla radio" }); await flow2(390, { id: "ermete", label: "Parla prima con Ermete" });
    await flow3(390); await flow3(320);
    await flow4(390, { id: "scarichi", label: "Apri gli scarichi" });
    await flow4(390, { id: "diga", label: "La Diga Tiene", st: { argine: 6, fiducia: 6 } });
    await flow4(390, { id: "sommerso", label: "Lascia andare", st: { memoria: 3 } });
    await flow4(320, { id: "campo", label: "Il Campo di Zita", st: { memoria: 5, fiducia: 5 }, inv: "vp_pallone" });
  }
})();
