// tests/cavaliere.cjs - «Il Cavaliere del Fischio»: tetti (rampino, salti, cadute), guardie, vicolo, Interrogatorio, capitoli, finali
const L = require("./lib.cjs");
const MOD = { mod: "__cavaliere", key: "ali-di-rondine.cavaliere" };
const K_ = "window.__cavaliere._dbg.K";
const info = (p) => L.info(p);
const adv = (p, prefs) => L.advance(p, prefs).catch((e) => { if (!/Torna a camminare/.test(e.message)) throw e; });
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
const SAVE = (zone, ch, step, done, flags, st) => ({ v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, ch3: 1, [zone]: 1 }, ch, step, done, flags: Object.assign({}, flags || {}), st: Object.assign({ agilita: 40, timore: 20, vigore: 100 }, st || {}) });
// raggiungibilità con i salti e i rampini: ogni collegamento [x, y, atterraggioX, atterraggioY] estende l'area percorribile
async function reachLinks(page, zid, links) {
  return page.evaluate(([zid, links]) => {
    const D = window.__cavaliere._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z), T = window.T_, bad = [];
    const npcs = (spec.npcs ? spec.npcs(0) : []).filter((n) => !n.ghost).map((n) => n.at);
    const H = m.length, W = m[0].length, seen = Array.from({ length: H }, () => Array(W).fill(false)), seeds = [spec.start.slice()];
    const merge = (a) => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (a[y][x]) seen[y][x] = true; };
    const done = new Set(); let grew = true;
    while (grew) { grew = false; seeds.slice().forEach((s) => { const k = s.join(","); if (done.has(k)) return; done.add(k); merge(T.bfs(m, z, s[0], s[1], npcs)); grew = true; });
      links.forEach(([x, y, tx, ty]) => { const adj = [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => seen[y + dy] && seen[y + dy][x + dx]); if (adj && !done.has(tx + "," + ty) && !seeds.some((s) => s[0] === tx && s[1] === ty)) { seeds.push([tx, ty]); grew = true; } }); }
    const adj = (x, y) => [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => seen[y + dy] && seen[y + dy][x + dx]);
    (spec.items || []).forEach(([x, y]) => { if (!(seen[y] && seen[y][x])) bad.push("goccia " + x + "," + y); });
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = m[y][x]; if (z.act[c] && "_zQ".indexOf(c) < 0 && !adj(x, y) && !(seen[y] && seen[y][x])) bad.push("oggetto " + c + " " + x + "," + y); }
    (spec.npcs ? spec.npcs(0) : []).forEach((n) => { if (!adj(n.at[0], n.at[1]) && !(seen[n.at[1]] && seen[n.at[1]][n.at[0]])) bad.push("png " + n.id + " " + n.at); });
    return bad;
  }, [zid, links]);
}
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__cavaliere.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await adv(page);
  if (w === 390) await L.shot(page, "cf_rifugio");
  { const bad = await L.reachAll(page, "cf_rifugio"); if (bad.length) errors.push("rifugio: " + bad.join(", ")); }
  await L.talk(page, "cf_fulgenzio"); await adv(page);
  let i = await info(page); if (i.step[1] !== 1) errors.push("dopo Fulgenzio: " + JSON.stringify(i.step));
  for (const [z, x, y, n] of [["cf_tetti", 3, 12, "tetti"], ["cf_vicolo", 30, 18, "vicolo"]]) { await go(page, z, x, y); if (w === 390) await L.shot(page, z); const bad = n === "tetti" ? await reachLinks(page, z, [[8, 10, 14, 10], [8, 15, 14, 15], [13, 12, 7, 12], [22, 14, 28, 14], [22, 6, 28, 6], [27, 5, 21, 5], [30, 10, 30, 13], [31, 12, 31, 9], [27, 15, 21, 15]]) : await L.reachAll(page, z); if (bad.length) errors.push(n + ": " + bad.join(", ")); }
  // salto riuscito, poi caduta, poi rampino
  await go(page, "cf_tetti", 3, 12);
  await page.evaluate(() => { window.__roofRoll = 0.01; });
  await L.goAct(page, 8, 10).catch((e) => errors.push("salto: " + e.message)); await adv(page);
  let z = await L.zone(page); let pos = await page.evaluate(() => [Math.floor(window.__tr.TW.x / 16), Math.floor((window.__tr.TW.y - 4) / 16)]);
  if (!(pos[0] >= 13 && pos[0] <= 15)) errors.push("salto non atterrato: " + pos);
  await page.evaluate(() => { window.__roofRoll = 0.99; });
  await L.goAct(page, 22, 14).catch((e) => errors.push("salto2: " + e.message)); await adv(page);
  const v = await page.evaluate(([k]) => eval(k).roof.vigor(), [K_]); if (v !== 85) errors.push("caduta: vigore " + v);
  pos = await page.evaluate(() => [Math.floor(window.__tr.TW.x / 16), Math.floor((window.__tr.TW.y - 4) / 16)]); if (pos[0] > 8) errors.push("dopo la caduta non sei all'inizio: " + pos);
  await go(page, "cf_tetti", 21, 6); await L.goAct(page, 22, 6).catch((e) => errors.push("rampino: " + e.message)); await adv(page);
  pos = await page.evaluate(() => [Math.floor(window.__tr.TW.x / 16), Math.floor((window.__tr.TW.y - 4) / 16)]); if (pos[0] < 27) errors.push("rampino non atterrato: " + pos);
  await L.talk(page, "cf_brandi"); await adv(page);
  i = await info(page); if (i.step[1] !== 2) errors.push("dopo Brandi: " + JSON.stringify(i.step));
  await go(page, "cf_vicolo", 30, 18);
  await page.evaluate(() => { window.__noGuards = true; });
  for (const [x, y] of [[7, 10], [22, 12], [28, 8]]) { await L.goAct(page, x, y).catch((e) => errors.push("gancio " + x + ": " + e.message)); await adv(page); }
  await page.evaluate(() => { window.__noGuards = false; });
  const ng = await page.evaluate(([k]) => ({ n: window.__tr.TW.z.npcs.filter((n) => /thug/.test(n.id)).map((n) => n.id), d: ["cf_thug1", "cf_thug2", "cf_thug3"].map((i) => eval(k).roof.down(i)) }), [K_]); if (ng.n.length) errors.push("scagnozzi ancora in piedi: " + JSON.stringify(ng));
  await L.talk(page, "cf_zeppa"); await adv(page);
  i = await info(page); if (i.step[1] !== 3) errors.push("dopo Zeppa: " + JSON.stringify(i.step));
  await go(page, "cf_rifugio", 8, 10); await L.talk(page, "cf_fulgenzio"); await adv(page);
  i = await info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Cavaliere · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("cf_porto", 2, { 1: 3, 2: 0 }, { 1: "ok" }, { cf_c1_done: true }) });
  await page.evaluate(() => window.__cavaliere.open()); await page.evaluate(() => window.T_.click("Continua")).catch(() => {}); await adv(page);
  await go(page, "cf_porto", 2, 18); if (w === 390) await L.shot(page, "cf_porto");
  { const bad = await reachLinks(page, "cf_porto", [[24, 6, 26, 6], [25, 5, 23, 5]]); if (bad.length) errors.push("porto: " + bad.join(", ")); }
  await L.talk(page, "cf_micia"); await adv(page);
  let i = await info(page); if (i.step[2] !== 1) errors.push("dopo Micia: " + JSON.stringify(i.step));
  await page.evaluate(() => { window.__noGuards = true; });
  await go(page, "cf_porto", 23, 6); await L.goAct(page, 24, 6).catch((e) => errors.push("rampino porto: " + e.message)); await adv(page);
  await L.goAct(page, 29, 4).catch((e) => errors.push("cassa: " + e.message)); await adv(page);
  i = await info(page); if (i.step[2] !== 2) errors.push("dopo cassa: " + JSON.stringify(i.step));
  await go(page, "cf_porto", 5, 17); await L.talk(page, "cf_micia"); await adv(page);
  i = await info(page); if (i.step[2] !== 3) errors.push("dopo tessera: " + JSON.stringify(i.step));
  await page.evaluate(() => { window.__noGuards = false; });
  for (const z of ["cf_manicomio", "cf_spillo"]) { await go(page, z, z === "cf_manicomio" ? 2 : 7, 8); if (w === 390) await L.shot(page, z); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
  await L.talk(page, "cf_spillo").catch((e) => errors.push("spillo: " + e.message)); await adv(page, ["Interrogatorio"]).catch(() => {});
  await page.waitForFunction(() => window.__interrogatorio && window.__interrogatorio.state, null, { timeout: 5000 }).catch(() => errors.push("interrogatorio non partito"));
  await page.evaluate(() => window.__interrogatorio.state && window.__interrogatorio.state.finish(true)); await page.waitForTimeout(300); await page.evaluate(() => document.querySelector("#ivGo") && document.querySelector("#ivGo").click()); await page.waitForTimeout(400); await adv(page);
  i = await info(page); if (i.step[2] !== 4) errors.push("dopo Spillo: " + JSON.stringify(i.step));
  await go(page, "cf_porto", 29, 16); await L.talk(page, "cf_micia"); await adv(page);
  i = await info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Cavaliere · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("cf_opera", 3, { 1: 3, 2: 4, 3: 0 }, { 1: "ok", 2: "ok" }, { cf_c1_done: true, cf_c2_done: true }) });
  await page.evaluate(() => window.__cavaliere.open()); await page.evaluate(() => window.T_.click("Continua")).catch(() => {}); await adv(page);
  await go(page, "cf_opera", 2, 17); if (w === 390) await L.shot(page, "cf_opera");
  { const bad = await reachLinks(page, "cf_opera", [[22, 6, 24, 6], [22, 5, 20, 5]]); if (bad.length) errors.push("opera: " + bad.join(", ")); }
  await L.talk(page, "cf_diva"); await adv(page);
  let i = await info(page); if (i.step[3] !== 1) errors.push("dopo Diva: " + JSON.stringify(i.step));
  await page.evaluate(() => { window.__noGuards = true; });
  await go(page, "cf_opera", 20, 6); await L.goAct(page, 22, 6).catch((e) => errors.push("lampadario: " + e.message)); await adv(page);
  await L.goAct(page, 28, 7).catch((e) => errors.push("palco: " + e.message)); await adv(page);
  await L.goAct(page, 27, 4).catch((e) => errors.push("cassa: " + e.message)); await adv(page);
  i = await info(page); if (i.step[3] !== 2) errors.push("dopo cassa: " + JSON.stringify(i.step));
  await go(page, "cf_opera", 23, 5); await L.goAct(page, 22, 5).catch((e) => errors.push("ritorno: " + e.message)); await adv(page);
  await go(page, "cf_opera", 10, 7); await L.talk(page, "cf_diva"); await adv(page);
  i = await info(page); if (i.step[3] !== 3) errors.push("dopo Diva 2: " + JSON.stringify(i.step));
  await page.evaluate(() => { window.__noGuards = false; });
  for (const [z, x, y] of [["cf_banca", 2, 16], ["cf_ufficio", 8, 8], ["cf_caveau", 7, 8]]) { await go(page, z, x, y); if (w === 390) await L.shot(page, z); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
  await go(page, "cf_ufficio", 8, 6); await L.talk(page, "cf_lucre").catch((e) => errors.push("lucre: " + e.message)); await adv(page);
  await page.waitForFunction(() => window.__interrogatorio && window.__interrogatorio.state, null, { timeout: 5000 }).catch(() => errors.push("interrogatorio non partito"));
  await page.evaluate(() => window.__interrogatorio.state && window.__interrogatorio.state.finish(true)); await page.waitForTimeout(300); await page.evaluate(() => document.querySelector("#ivGo") && document.querySelector("#ivGo").click()); await page.waitForTimeout(400); await adv(page);
  i = await info(page); if (i.step[3] !== 4) errors.push("dopo Lucre: " + JSON.stringify(i.step));
  await go(page, "cf_caveau", 7, 8); await L.goAct(page, 11, 2).catch((e) => errors.push("fischietto: " + e.message)); await adv(page);
  await L.goAct(page, 6, 2).catch((e) => errors.push("libro: " + e.message)); await adv(page);
  i = await info(page); if (i.step[3] !== 5) errors.push("dopo libro: " + JSON.stringify(i.step));
  await go(page, "cf_banca", 2, 16); await page.evaluate(() => { window.__noGuards = true; }); await L.talk(page, "cf_brandi"); await adv(page);
  i = await info(page); if (i.done[3] !== "ok") errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Cavaliere · capitolo 3 (${w} px)`, errors); await browser.close();
}
async function c4(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("cf_cimitero", 4, { 1: 3, 2: 4, 3: 5, 4: 0 }, { 1: "ok", 2: "ok", 3: "ok" }, { cf_c1_done: true, cf_c2_done: true, cf_c3_done: true }) });
  await page.evaluate(() => window.__cavaliere.open()); await page.evaluate(() => window.T_.click("Continua")).catch(() => {}); await adv(page);
  await go(page, "cf_cimitero", 2, 20); if (w === 390) await L.shot(page, "cf_cimitero");
  { const bad = await reachLinks(page, "cf_cimitero", [[31, 14, 33, 14], [32, 13, 30, 13]]); if (bad.length) errors.push("cimitero: " + bad.join(", ")); }
  await L.talk(page, "cf_brandi"); await adv(page);
  let i = await info(page); if (i.step[4] !== 1) errors.push("dopo Brandi: " + JSON.stringify(i.step));
  await page.evaluate(() => { window.__noGuards = true; });
  await go(page, "cf_cimitero", 30, 14); await L.goAct(page, 31, 14).catch((e) => errors.push("rampino cappella: " + e.message)); await adv(page);
  await L.goAct(page, 35, 14).catch((e) => errors.push("cassa cappella: " + e.message)); await adv(page);
  await go(page, "cf_cimitero", 28, 13); await L.goAct(page, 28, 12).catch((e) => errors.push("lapide: " + e.message)); await adv(page);
  i = await info(page); if (i.step[4] !== 2) errors.push("dopo lapide: " + JSON.stringify(i.step));
  await page.evaluate(() => { window.__noGuards = false; });
  for (const [z, x, y] of [["cf_mausoleo", 9, 9]]) { await go(page, z, x, y); if (w === 390) await L.shot(page, z); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
  await go(page, "cf_mausoleo", 9, 7); await L.talk(page, "cf_pierrot").catch((e) => errors.push("pierrot: " + e.message)); await adv(page);
  await page.waitForFunction(() => window.__interrogatorio && window.__interrogatorio.state, null, { timeout: 5000 }).catch(() => errors.push("interrogatorio non partito"));
  await page.evaluate(() => window.__interrogatorio.state && window.__interrogatorio.state.finish(true)); await page.waitForTimeout(300); await page.evaluate(() => document.querySelector("#ivGo") && document.querySelector("#ivGo").click()); await page.waitForTimeout(400); await adv(page);
  i = await info(page); if (i.step[4] !== 3) errors.push("dopo Pierrot: " + JSON.stringify(i.step));
  L.check(`Cavaliere · capitolo 4 (${w} px)`, errors); await browser.close();
}
async function ending(w, id, label, pre, st) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("cf_mausoleo", 4, { 1: 3, 2: 4, 3: 5, 4: 3 }, { 1: "ok", 2: "ok", 3: "ok" }, { cf_c1_done: true, cf_c2_done: true, cf_c3_done: true }, st) });
  await page.evaluate(() => window.__cavaliere.open()); await page.evaluate(() => window.T_.click("Continua")).catch(() => {}); await adv(page);
  await go(page, "cf_mausoleo", 9, 7);
  await page.evaluate(([k, pre]) => { const K = eval(k); pre.forEach((c) => K.dossier.add("fischio", c)); }, [K_, pre]);
  await L.talk(page, "cf_pierrot"); await adv(page, [new RegExp(label)]).catch(() => {}); await page.waitForTimeout(300); await adv(page).catch(() => {});
  const i = await info(page); if (!(i.ends || []).includes(id)) errors.push("finale " + id + " non registrato: " + JSON.stringify(i.ends));
  L.check(`Cavaliere · finale ${id} (${w} px)`, errors); await browser.close();
}
(async () => {
  await c1(390);
  await c2(390);
  await c3(390);
  await c4(390);
  await ending(390, "pieta", "Ascoltalo", [], {});
  await ending(390, "giustizia", "Consegna il Pierrot", ["libro", "fischietto", "cartella"], {});
  await ending(390, "ombra", "Lascialo cadere", [], { timore: 70 });
  await ending(390, "segreto", "Sistema i sei", ["carta1", "carta2", "carta3", "carta4", "carta5", "carta6", "libro"], {});
})().catch((e) => { console.error("✗ cavaliere:", e.message); process.exit(1); });
