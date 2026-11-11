// tests/foto58.cjs - «La Foto del '58»: zone raggiungibili, capitoli giocati con Camera Oscura e partita finte, Taccuino vero (terne), Camera Oscura vera, finali, cabinato
const L = require("./lib.cjs");
const MOD = { mod: "__foto58", key: "ali-di-rondine.foto58" };
const K_ = "window.__foto58._dbg.K";
const ONLY = process.argv[2] || "";
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(450); await L.advance(p).catch(() => {}); }
async function start(w, save) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => window.__foto58.open()); await r.page.waitForTimeout(500);
  await L.advance(r.page, []).catch(() => {}); return r;
}
// Camera Oscura e partita finte: rispondono subito
const stub = (p, win) => p.evaluate(([k, win]) => { window.__coLog = []; window.__cameraOscura.start = (o) => { window.__coLog.push({ n: (o.people || []).length, diff: o.diff }); setTimeout(() => o.onDone({ win, a: win ? 1 : 0, b: win ? 0 : 1 }), 10); return true; }; const K = eval(k); K.playMatch = (o) => { window.__pmLog = o.id; setTimeout(() => o.done({ win, a: 2, b: 1 }), 10); }; }, [K_, win]);
const st = async (p, errors, ch, n, what) => { const i = await L.info(p); if (i.step[ch] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
const talk = async (p, id, labels) => { await L.talk(p, id); await L.advance(p, labels || []); };
const obj = (p, z, key) => p.evaluate(([k, z, key]) => { const K = eval(k), [tx, ty] = /,/.test(key) ? key.split(",").map(Number) : [0, 0], O = K.zone(z).spec.objects, ch = /,/.test(key) ? K.at(tx, ty) : key, o = O[key] || O[ch]; o({ ch, tx, ty, zid: z }, K); }, [K_, z, key]).then(() => p.waitForTimeout(250)).then(() => L.advance(p).catch(() => {}));
const hear = (p, z, n) => p.evaluate(([k, z, n]) => { const K = eval(k), FZ = window.__foto58FZ[z]; FZ.list.slice(0, n).forEach(([id]) => { K.F.set("f5_h_" + z + "_" + id.slice(3), true); if (K.deduce) K.deduce.note(id, z, true); }); }, [K_, z, n]);
// conferma nel Taccuino i volti i cui destini sono già noti (come farebbe chi gioca)
const solve = (p) => p.evaluate((k) => { const K = eval(k), H = window.__f5H(K); Object.keys(H.P58).forEach((f) => { if (!K.deduce.known("fate", H.ANS[f]) || !K.deduce.known("who", H.WHO[f])) return; K.deduce.set(f, "who", H.WHO[f]); K.deduce.set(f, "fate", H.ANS[f]); }); return K.deduce.count(); }, K_);
async function zones(w, save, list, tag) {
  const { browser, page, errors } = await start(w, save);
  for (const z of list) {
    try { await go(page, z); if (w === 390) await L.shot(page, "f5_" + z + "_" + tag.replace(/\W/g, "")); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Foto del '58 · zone ${tag} (${w} px)`, errors); await browser.close();
}
const INTRO = { ch1: 1, ch2: 1, ch3: 1, ch4: 1, f5_borgo: 1, f5_archivio: 1, f5_bar: 1, f5_piazza58: 1, f5_curva: 1, f5_albergo: 1, f5_hall: 1, f5_galleria: 1, f5_neve: 1, f5_ritorno: 1, f5_cimitero: 1 };
const S1 = { v: 1, diffSet: true, intro: INTRO };
async function flow1(w) {
  const { browser, page, errors } = await start(w, S1);
  try {
    await stub(page, true);
    await go(page, "f5_borgo", 6, 8); await talk(page, "f5_viola"); await st(page, errors, 1, 1, "dopo Viola in piazza");
    await go(page, "f5_archivio", 7, 7); await page.evaluate((k) => { const K = eval(k); K.zone("f5_archivio").spec.objects.T({ ch: "T" }, K); }, K_); await page.waitForTimeout(300); for (let i = 0; i < 4 && !(await page.evaluate(() => !!document.querySelector("#ddOv"))); i++) { await page.evaluate(() => window.T_.click(".")); await page.waitForTimeout(250); }
    if (!(await page.evaluate(() => !!document.querySelector("#ddOv")))) errors.push("la foto non apre il Taccuino");
    else { if (w === 390) await L.shot(page, "f5_taccuino_c1"); await page.evaluate(() => { const b = [...document.querySelectorAll("#ddOv button")].find((x) => /Indietro|Chiudi|◂/.test(x.textContent)); if (b) b.click(); else document.querySelector("#ddOv").remove(); }); await page.waitForTimeout(300); await L.advance(page).catch(() => {}); }
    await talk(page, "f5_viola"); await st(page, errors, 1, 2, "dopo la foto");
    await obj(page, "f5_archivio", "J"); await L.advance(page, ["La partenza"]).catch(() => {}); await page.waitForTimeout(300);
    const z = await page.evaluate((k) => eval(k).api.trZone(), K_); if (z !== "f5_piazza58") errors.push("il mirino non apre la partenza: " + z);
    if (w === 390) await L.shot(page, "f5_negativo_partenza");
    await L.talk(page, "f5_rocco"); await L.advance(page);
    await hear(page, "f5_piazza58", 6);
    await go(page, "f5_archivio", 7, 7); await talk(page, "f5_viola"); await page.waitForTimeout(300); await L.advance(page).catch(() => {}); await st(page, errors, 1, 3, "dopo lo sviluppo della curva");
    const log = await page.evaluate(() => window.__coLog); if (!log.length || log[0].n !== 6) errors.push("camera oscura chiamata male: " + JSON.stringify(log));
    await hear(page, "f5_curva", 8); await talk(page, "f5_viola"); await st(page, errors, 1, 4, "dopo la curva");
    await go(page, "f5_bar", 12, 3); await talk(page, "f5_ilario", ["sei nella foto"]).catch(() => L.advance(page, ["nella foto"])); await st(page, errors, 1, 5, "dopo Ilario");
    await go(page, "f5_archivio", 7, 7); await obj(page, "f5_archivio", "L");
    const n = await solve(page); if (n < 3) errors.push("volti confermati dopo il registro: " + n);
    await talk(page, "f5_viola");
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Foto del '58 · capitolo 1 (${w} px)`, errors); await browser.close();
}
const F1 = { f5_c1_done: 1, f5_neg_partenza: 1, f5_dev_curva: 1, dd_o_fate_argentina: 1, dd_o_fate_belgio: 1, dd_o_fate_torino: 1, dd_o_fate_vivo: 1, dd_o_fate_barbiere: 1, inv_f5_registro: 1 };
const S2 = Object.assign({}, S1, { ch: 2, step: { 1: 6 }, done: { 1: "ok" }, flags: F1 });
async function flow2(w, alt) {
  const { browser, page, errors } = await start(w, S2);
  try {
    await stub(page, true);
    await go(page, "f5_borgo", 8, 12); await talk(page, "f5_rina"); await st(page, errors, 2, 1, "dopo Rina");
    await go(page, "f5_archivio", 7, 7); await talk(page, "f5_viola"); await page.waitForTimeout(300); await L.advance(page).catch(() => {}); await st(page, errors, 2, 2, "dopo lo sviluppo dell'albergo");
    await hear(page, "f5_albergo", 8); await go(page, "f5_albergo", 27, 15); await obj(page, "f5_albergo", "28,14"); await page.waitForTimeout(300); await L.advance(page).catch(() => {});
    await st(page, errors, 2, 3, "dopo la semifinale");
    const lk = await page.evaluate((k) => eval(k).zone("f5_albergo").spec.doors["9,6"].locked(eval(k)), K_); if (lk) errors.push("porta dell'albergo ancora chiusa");
    await go(page, "f5_hall", 9, 9); await hear(page, "f5_hall", 8); await obj(page, "f5_hall", "12,5");
    await page.evaluate((k) => eval(k).F.set("f5_hall_ok", true), K_);
    await go(page, "f5_archivio", 7, 7); await talk(page, "f5_viola"); await st(page, errors, 2, 4, "dopo la hall");
    if (!(await page.evaluate((k) => eval(k).inv.has("f5_busta"), K_))) errors.push("busta non data");
    await obj(page, "f5_archivio", "L");
    await go(page, "f5_bar", 5, 4); await talk(page, "f5_nello");
    await go(page, "f5_bar", 12, 3); await talk(page, "f5_ilario", [alt ? "Tieni la busta" : "Giri la busta"]); await st(page, errors, 2, 5, "dopo Ilario");
    const n = await solve(page); if (n < 6) errors.push("volti confermati: " + n);
    await go(page, "f5_archivio", 7, 7); await talk(page, "f5_viola");
    const i = await L.info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
    const f = await page.evaluate((k) => eval(k).F.get("f5_c2_scelta"), K_); if (f !== (alt ? "pieta" : "verita")) errors.push("scelta cap. 2: " + f);
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Foto del '58 · capitolo 2${alt ? " (pietà)" : ""} (${w} px)`, errors); await browser.close();
}
const F2 = Object.assign({}, F1, { f5_c2_done: 1, f5_dev_albergo: 1, f5_semi_done: 1, dd_o_fate_sposato: 1, dd_o_fate_maestro: 1, dd_o_fate_allenatore: 1, dd_o_fate_serieb: 1, inv_f5_busta: 1, f5_c2_scelta: "pieta" });
const S3 = Object.assign({}, S1, { ch: 3, step: { 1: 6, 2: 6 }, done: { 1: "ok", 2: "ok" }, flags: F2 });
async function flow3(w, alt) {
  const { browser, page, errors } = await start(w, S3);
  try {
    await stub(page, true);
    await go(page, "f5_borgo", 30, 14); await talk(page, "f5_mauro"); await st(page, errors, 3, 1, "dopo Mauro");
    await go(page, "f5_archivio", 7, 7); await talk(page, "f5_viola"); await page.waitForTimeout(300); await L.advance(page).catch(() => {}); await st(page, errors, 3, 2, "dopo lo sviluppo della galleria");
    await hear(page, "f5_galleria", 10); await go(page, "f5_neve", 24, 4); await L.talk(page, "f5_renzo"); await L.advance(page); await hear(page, "f5_neve", 4);
    const seen = await page.evaluate((k) => eval(k).deduce.seen("f5_renzo"), K_); if (!seen) errors.push("il volto del Nove non entra nel Taccuino");
    await go(page, "f5_archivio", 7, 7); await talk(page, "f5_viola"); await st(page, errors, 3, 3, "dopo la galleria");
    await go(page, "f5_borgo", 26, 10); await obj(page, "f5_borgo", "N");
    await go(page, "f5_borgo", 30, 14); await talk(page, "f5_mauro", [alt ? "La verità che si può" : "Tutta la verità"]); await st(page, errors, 3, 4, "dopo Mauro (scelta)");
    const n = await solve(page); if (n < 9) errors.push("volti confermati: " + n);
    await go(page, "f5_archivio", 7, 7); await talk(page, "f5_viola");
    const i = await L.info(page); if (i.done[3] !== "ok") errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
    const f = await page.evaluate((k) => [eval(k).F.is("f5_c3_verita"), eval(k).F.is("f5_c3_pieta")], K_); if (alt ? !f[1] : !f[0]) errors.push("scelta cap. 3: " + f);
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Foto del '58 · capitolo 3${alt ? " (pietà)" : ""} (${w} px)`, errors); await browser.close();
}
const F3 = Object.assign({}, F2, { f5_c3_done: 1, f5_dev_galleria: 1, f5_lapide: 1, dd_o_fate_galleria: 1, dd_o_fate_prete: 1, dd_o_who_renzo: 1, dd_s_f5_renzo: 1, f5_c3_verita: 1 });
const S4 = (extra, st0) => Object.assign({}, S1, { ch: 4, step: { 1: 6, 2: 6, 3: 5 }, done: { 1: "ok", 2: "ok", 3: "ok" }, flags: Object.assign({}, F3, extra || {}) }, st0 ? { st: st0 } : {});
async function flow4(w, end, extra, st0, frames) {
  const { browser, page, errors } = await start(w, S4(extra, st0));
  try {
    await stub(page, true);
    if (frames) await page.evaluate(([k, n]) => { for (let i = 0; i < n; i++) eval(k).inv.give("f5_frame"); }, [K_, frames]);
    await go(page, "f5_archivio", 7, 7); await talk(page, "f5_viola"); await page.waitForTimeout(300); await L.advance(page).catch(() => {}); await st(page, errors, 4, 1, "dopo lo sviluppo del ritorno");
    await hear(page, "f5_ritorno", 12); await talk(page, "f5_viola"); await st(page, errors, 4, 2, "dopo il ritorno");
    await go(page, "f5_cimitero", 15, 19);
    for (const t of ["5,6", "7,6", "11,18"]) await obj(page, "f5_cimitero", t);
    await go(page, "f5_bar", 9, 1); await obj(page, "f5_bar", "9,0");
    await go(page, "f5_bar", 12, 3); await talk(page, "f5_ilario", [end === "scatola" ? "Non deve niente" : "Lo dica lei"]); await st(page, errors, 4, 3, "dopo Ilario");
    if (!(await page.evaluate((k) => eval(k).inv.has("f5_lettera"), K_))) errors.push("lettera non data");
    await go(page, "f5_archivio", 7, 7); await talk(page, "f5_viola"); await st(page, errors, 4, 4, "dopo la lettera");
    const n = await solve(page); if (n < 14) errors.push("volti confermati a fine saga: " + n);
    const lab = { bacheca: "La Foto in Bacheca", lettera: "Una Lettera ai Nipoti", scatola: "La Scatola Chiusa", volto: "Il Quindicesimo Volto" }[end];
    await go(page, "f5_archivio", 8, 8); await obj(page, "f5_archivio", "c"); await L.advance(page, [lab]).catch((e) => errors.push("bacheca: " + e.message.slice(0, 120)));
    const i = await L.info(page); if (i.done[4] !== end) errors.push("finale atteso " + end + ": " + JSON.stringify([i.done, i.step]));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Foto del '58 · capitolo 4, finale ${end} (${w} px)`, errors); await browser.close();
}
// la Camera Oscura vera (dentro la storia) e il cabinato in Sala Giochi
async function camera(w) {
  const save = Object.assign({}, S1, { ch: 1, step: { 1: 2 }, flags: { f5_neg_partenza: 1 } });
  const { browser, page, errors } = await start(w, save);
  try {
    await hear(page, "f5_piazza58", 6);
    await go(page, "f5_archivio", 7, 7); await L.talk(page, "f5_viola"); await L.advance(page).catch(() => {}); await page.waitForTimeout(800);
    const s = await page.evaluate(() => { const S = window.__cameraOscura.state; return S ? { phase: S.phase, faces: S.faces().length, clues: S.clues().length } : null; });
    if (!s || s.faces !== 6 || !s.clues) throw new Error("Camera Oscura non aperta: " + JSON.stringify(s));
    if (w === 390) await L.shot(page, "f5_camera_oscura");
    await page.evaluate(() => window.__cameraOscura.state.solve()); await page.waitForTimeout(700);
    if (w === 390) await L.shot(page, "f5_camera_risolta");
    await page.evaluate(() => { const b = document.querySelector("#coGo"); if (b) b.click(); }); await page.waitForTimeout(500); await L.advance(page).catch(() => {});
    await st(page, errors, 1, 3, "dopo la Camera Oscura vera");
    await page.evaluate((k) => eval(k).deduce.open(() => {}, true), K_); await page.waitForTimeout(400); if (w === 390) await L.shot(page, "f5_taccuino");
    if (!(await page.evaluate(() => !!document.querySelector("#ddOv")))) errors.push("Taccuino non aperto");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Foto del '58 · Camera Oscura e Taccuino veri (${w} px)`, errors); await browser.close();
}
async function cab(w) {
  const extra = { "ali-di-rondine.foto58": { v: 1, ch: 4, step: { 1: 6, 2: 6, 3: 5, 4: 5 }, done: { 1: "ok", 2: "ok", 3: "ok", 4: "scatola" }, ends: ["scatola"], diffSet: true, flags: {} } };
  const { browser, page, errors } = await L.setup({ w, extra });
  await page.evaluate(() => window.__salone.salaGiochi(() => {})); await page.waitForTimeout(300);
  const stt = await page.evaluate(() => { const b = document.querySelector('.salOv [data-m="cameraoscura"]'); return b ? b.querySelector(".pe").textContent : null; }); if (stt === null || stt === "🔒") errors.push("cabinato Camera Oscura non aperto: " + stt);
  await page.evaluate(() => document.querySelector('.salOv [data-m="cameraoscura"]').click()); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('.salOv [data-o="9"]').click()); await page.waitForTimeout(600);
  const n = await page.evaluate(() => window.__cameraOscura.state && window.__cameraOscura.state.faces().length); if (n !== 8) errors.push("volti nel boss: " + n);
  if (w === 390) await L.shot(page, "f5_cabinato");
  await page.evaluate(() => window.__cameraOscura.state.solve()); await page.waitForTimeout(700); await page.click("#coGo"); await page.waitForTimeout(400);
  const rec = await page.evaluate(() => JSON.parse(localStorage.getItem("ali-di-rondine.salagiochi") || "{}")); if (!rec.p || rec.p.cameraoscura !== 1) errors.push("partita non registrata: " + JSON.stringify(rec.p));
  L.check(`Foto del '58 · cabinato Camera Oscura (${w} px)`, errors); await browser.close();
}
module.exports = { go, start, stub, S1, K_ };
if (require.main === module) (async () => {
  const want = (k) => !ONLY || ONLY === k;
  if (want("zone1")) { await zones(390, S1, ["f5_borgo", "f5_archivio", "f5_bar", "f5_piazza58", "f5_curva"], "cap. 1"); await zones(320, S1, ["f5_borgo"], "cap. 1"); }
  if (want("c1")) { await flow1(390); await flow1(320); }
  if (want("zone2")) await zones(390, S2, ["f5_borgo", "f5_albergo", "f5_hall"], "cap. 2");
  if (want("c2")) { await flow2(390, false); await flow2(320, true); }
  if (want("zone3")) await zones(390, S3, ["f5_borgo", "f5_galleria", "f5_neve"], "cap. 3");
  if (want("c3")) { await flow3(390, false); await flow3(320, true); }
  if (want("zone4")) await zones(390, S4(), ["f5_borgo", "f5_ritorno", "f5_cimitero", "f5_bar"], "cap. 4");
  if (want("c4")) {
    await flow4(390, "scatola"); await flow4(320, "lettera");
    await flow4(390, "bacheca", { f5_c2_scelta: "pieta" }, { pieta: 4 });
    await flow4(390, "volto", {}, { pieta: 4 }, 7);
  }
  if (want("camera")) { await camera(390); await camera(320); }
  if (want("cab")) { await cab(390); await cab(320); }
})();
