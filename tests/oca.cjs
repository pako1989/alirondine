// tests/oca.cjs - «Il Gioco dell'Oca del Conte»: zone raggiungibili, capitoli giocati col Tabellone finto, un Tabellone vero (lancio a tempo, caselle, carte-storia), i finali
const L = require("./lib.cjs");
const MOD = { mod: "__oca", key: "ali-di-rondine.oca" };
const K_ = "window.__oca._dbg.K";
const ONLY = process.argv[2] || "";
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(450); await L.advance(p).catch(() => {}); }
async function start(w, save) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => window.__oca.open()); await r.page.waitForTimeout(500);
  await L.advance(r.page, []).catch(() => {}); return r;
}
// il Tabellone finto: risponde subito e registra con cosa è stato chiamato
const stub = (p, res) => p.evaluate((res) => { window.__tbLog = []; window.__tabellone.start = (o) => { window.__tbLog.push({ from: o.from, to: o.to, rivals: (o.rivals || []).map((r) => r.ai), hand: o.hand, story: Object.keys(o.story || {}) }); const picks = {}, flags = {}; Object.keys(o.story || {}).forEach((c) => { const i = (res.pick || 0) % o.story[c].opts.length; picks[c] = i; Object.assign(flags, ((o.story[c].opts[i] || {}).eff || {}).flag ? { [o.story[c].opts[i].eff.flag]: true } : {}); }); setTimeout(() => o.onDone(Object.assign({ win: true, rank: 1, pos: o.to, turns: 9, used: [], hand: (o.hand || []).slice(), picks, flags, caught: 0, sfide: { ok: 1, ko: 0 } }, res.r || {})), 10); return true; }; }, res || {});
const st = async (p, errors, ch, n, what) => { const i = await L.info(p); if (i.step[ch] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
async function zones(w, save, list, tag) {
  const { browser, page, errors } = await start(w, save);
  for (const z of list) {
    try { await go(page, z); if (w === 390) await L.shot(page, "oc_" + z + "_" + tag.replace(/\W/g, "")); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Oca del Conte · zone ${tag} (${w} px)`, errors); await browser.close();
}
const S1 = { v: 1, diffSet: true, intro: { ch1: 1, oc_parco: 1, oc_salone: 1, oc_cucina: 1, oc_serra: 1, oc_capanno: 1 } };
async function flow1(w, alt) {
  const { browser, page, errors } = await start(w, S1);
  try {
    await stub(page, { pick: alt ? 1 : 0, r: alt ? { win: false, rank: 3 } : { caught: 1 } });
    await go(page, "oc_parco", 22, 9); await L.talk(page, "oc_gilda"); await L.advance(page); await st(page, errors, 1, 1, "dopo Gilda");
    await go(page, "oc_salone", 9, 3); await L.talk(page, "oc_gilda"); await L.advance(page, [alt ? "vedere chi bara" : "per il Conte"]); await st(page, errors, 1, 2, "dopo il testamento");
    await L.talk(page, "oc_arrigo"); await L.advance(page);
    await go(page, "oc_cucina", 4, 5); await L.talk(page, "oc_ernestina"); await L.advance(page);
    await go(page, "oc_capanno", 4, 4); await L.talk(page, "oc_teo"); await L.advance(page);
    if (!(await page.evaluate((k) => eval(k).inv.has("oc_santino"), K_))) errors.push("santino non dato");
    await go(page, "oc_serra", 7, 4); await L.talk(page, "oc_ofelia"); await L.advance(page); await st(page, errors, 1, 3, "dopo tre eredi");
    await go(page, "oc_parco", 22, 17); await L.talk(page, "oc_gilda"); await L.advance(page, ["Si comincia"]);
    await page.waitForTimeout(300); await L.advance(page).catch(() => {});
    const log = await page.evaluate(() => window.__tbLog); if (!log.length || log[0].to !== 19 || log[0].rivals.join() !== "notaio,cuoca,medium" || !log[0].hand.includes("santino")) errors.push("tabellone chiamato male: " + JSON.stringify(log));
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
    const ax = await page.evaluate((k) => [eval(k).stat("cuore"), eval(k).stat("astuzia"), eval(k).F.get("oc_vinte", 0), eval(k).F.get("oc_beccato", 0)], K_);
    if (alt ? !(ax[1] > ax[0]) || ax[2] : !(ax[0] > ax[1]) || ax[2] !== 1 || ax[3] !== 1) errors.push("stato sbagliato: " + JSON.stringify(ax));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Oca del Conte · capitolo 1${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
const S2 = { v: 1, diffSet: true, intro: Object.assign({ ch2: 1, oc_cantina: 1 }, S1.intro), ch: 2, step: { 1: 4 }, done: { 1: "ok" }, flags: { oc_c1_done: 1, oc_vinte: 1, inv_oc_santino: 1 } };
const stubP = (p, win) => p.evaluate((win) => { window.__ocaPartita.start = (o) => { setTimeout(() => o.onDone({ a: win ? 3 : 1, b: win ? 1 : 2, win }), 10); return true; }; }, win);
async function flow2(w, alt) {
  const { browser, page, errors } = await start(w, S2);
  try {
    await stub(page, { pick: alt ? 1 : 0 }); await stubP(page, !alt);
    await go(page, "oc_cucina", 4, 5); await L.talk(page, "oc_ernestina"); await L.advance(page); await st(page, errors, 2, 1, "dopo Ernestina");
    await go(page, "oc_cantina", 8, 8); const bad = await L.reachAll(page, "oc_cantina"); if (bad.length) errors.push("cantina: " + bad.join(","));
    await page.evaluate((k) => eval(k).inv.give("oc_barolo"), K_);
    await go(page, "oc_cucina", 4, 5); await L.talk(page, "oc_ernestina"); await L.advance(page, [alt ? "Arrigo, chi" : "Un ladro non"]); await st(page, errors, 2, 2, "dopo la cena");
    await go(page, "oc_serra", 7, 4); await L.talk(page, "oc_ofelia"); await L.advance(page, [alt ? "Reggi il gioco" : "Guardi sotto"]); await st(page, errors, 2, 3, "dopo la seduta");
    await go(page, "oc_parco", 31, 13); await L.talk(page, "oc_cosimo"); await L.advance(page, ["Si gioca", alt ? "Ritiratelo" : "Il rigore del 2004"]).catch((e) => errors.push("dopo partita: " + e.message.slice(0, 120)));
    await st(page, errors, 2, 4, "dopo la partita");
    if (!(await page.evaluate((k) => eval(k).inv.has("oc_gessetto"), K_))) errors.push("gessetto non dato");
    await go(page, "oc_parco", 22, 17); await L.talk(page, "oc_gilda"); await L.advance(page, ["Si comincia"]); await page.waitForTimeout(300); await L.advance(page).catch(() => {});
    const log = await page.evaluate(() => window.__tbLog); if (!log.length || log[0].from !== 19 || log[0].to !== 42 || log[0].rivals.join() !== "terzino,gemello,gemello,notaio" || log[0].story.join() !== "26,33,39") errors.push("tabellone 2 chiamato male: " + JSON.stringify(log));
    const i = await L.info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
    const f = await page.evaluate((k) => [eval(k).F.is("oc_gemelli_pace"), eval(k).F.is("oc_rigore_ritirato")], K_); if (alt ? !f[1] || f[0] : !f[0]) errors.push("flag gemelli: " + JSON.stringify(f));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Oca del Conte · capitolo 2${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
const S3 = { v: 1, diffSet: true, intro: Object.assign({ ch3: 1, oc_cappella: 1 }, S2.intro), ch: 3, step: { 1: 4, 2: 5 }, done: { 1: "ok", 2: "ok" }, flags: Object.assign({}, S2.flags, { oc_c2_done: 1, oc_gemelli_pace: 1 }) };
async function flow3(w, alt) {
  const { browser, page, errors } = await start(w, S3);
  try {
    await stub(page, { pick: alt ? 1 : 0 });
    await go(page, "oc_parco", 22, 17); await L.talk(page, "oc_gilda"); await L.advance(page, ["Si comincia"]); await page.waitForTimeout(300); await L.advance(page).catch(() => {});
    await st(page, errors, 3, 1, "dopo la terza tirata");
    const log = await page.evaluate(() => window.__tbLog); if (!log.length || log[0].from !== 42 || log[0].to !== 52) errors.push("tabellone 3: " + JSON.stringify(log));
    await go(page, "oc_cappella", 7, 9); const bad = await L.reachAll(page, "oc_cappella"); if (bad.length) errors.push("cappella: " + bad.join(","));
    for (const [x, y, tx, ty] of [[6, 2, 6, 1], [3, 2, 3, 1], [12, 7, 13, 7]]) { await go(page, "oc_cappella", x, y); await page.evaluate(([k, tx, ty]) => eval(k).zone("oc_cappella").spec.objects[tx + "," + ty]({}, eval(k)), [K_, tx, ty]); await page.waitForTimeout(250); await L.advance(page).catch(() => {}); }
    await st(page, errors, 3, 2, "dopo la cappella");
    if (!(await page.evaluate((k) => eval(k).inv.has("oc_lettera"), K_))) errors.push("lettera non data");
    await go(page, "oc_cucina", 4, 5); await L.talk(page, "oc_ernestina"); await L.advance(page, [alt ? "Gliela do alla 63" : "Le dai la lettera"]); await st(page, errors, 3, 3, "dopo Ernestina");
    await go(page, "oc_parco", 24, 9); await L.talk(page, "oc_arrigo"); await L.advance(page, [alt ? "Se all'ultima" : "Gli dici la verità"]);
    const i = await L.info(page); if (i.done[3] !== "ok") errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
    const f = await page.evaluate((k) => ["oc_verita_ernestina", "oc_lettera_tenuta", "oc_arrigo_sa", "oc_ricatto"].filter((x) => eval(k).F.is(x)), K_); if (f.join() !== (alt ? "oc_lettera_tenuta,oc_ricatto" : "oc_verita_ernestina,oc_arrigo_sa")) errors.push("flag cap. 3: " + f);
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Oca del Conte · capitolo 3${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
const S4 = (extra) => ({ v: 1, diffSet: true, intro: Object.assign({ ch4: 1, oc_studio: 1, oc_cappella4: 1 }, S3.intro), ch: 4, step: { 1: 4, 2: 5, 3: 4 }, done: { 1: "ok", 2: "ok", 3: "ok" }, flags: Object.assign({}, S3.flags, { oc_c3_done: 1 }, extra || {}) });
async function flow4(w, end, extra, res, st0) {
  const { browser, page, errors } = await start(w, Object.assign(S4(extra), st0 ? { st: st0 } : {}));
  try {
    await stub(page, { r: res || {} });
    await go(page, "oc_studio", 6, 3); const bad = await L.reachAll(page, "oc_studio"); if (bad.length) errors.push("studio: " + bad.join(","));
    await page.evaluate((k) => eval(k).zone("oc_studio").spec.objects["5,2"]({}, eval(k)), K_); await page.waitForTimeout(250); await L.advance(page).catch(() => {});
    await st(page, errors, 4, 1, "dopo lo studio");
    const lab = { vivi: "La villa a tutti", casella: "Apri la Busta", notaio: res && res.win === false ? "Lascia la Busta" : "Dai la Busta", bara: "Posa i sette" }[end];
    await go(page, "oc_parco", 22, 17); await L.talk(page, "oc_gilda"); await L.advance(page, ["Si comincia", lab]); await page.waitForTimeout(300); await L.advance(page).catch(() => {});
    const log = await page.evaluate(() => window.__tbLog); if (!log.length || log[0].from !== 52 || log[0].to !== 63) errors.push("tabellone 4: " + JSON.stringify(log));
    const i = await L.info(page); if (i.done[4] !== end) errors.push("finale atteso " + end + ": " + JSON.stringify([i.done, i.step]));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Oca del Conte · capitolo 4, finale ${end} (${w} px)`, errors); await browser.close();
}
// il cabinato «Oca Express» in Sala Giochi (Tabellone vero, corsa) e una tirata vera dentro il capitolo 1
async function cab(w) {
  const extra = { "ali-di-rondine.oca": { v: 1, ch: 4, step: { 1: 4, 2: 5, 3: 4, 4: 3 }, done: { 1: "ok", 2: "ok", 3: "ok", 4: "vivi" }, ends: ["vivi"], diffSet: true, flags: {} } };
  const { browser, page, errors } = await L.setup({ w, extra });
  await page.evaluate(() => window.__salone.salaGiochi(() => {})); await page.waitForTimeout(300);
  const stt = await page.evaluate(() => { const b = document.querySelector('.salOv [data-m="ocaexpress"]'); return b ? b.querySelector(".pe").textContent : null; }); if (stt === null || stt === "🔒") errors.push("cabinato Oca Express non aperto: " + stt);
  await page.evaluate(() => document.querySelector('.salOv [data-m="ocaexpress"]').click()); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('.salOv [data-o="9"]').click()); await page.waitForTimeout(500);
  if (!(await page.evaluate(() => !!document.querySelector("#tbOv")))) errors.push("il Tabellone non parte dal cabinato");
  const n = await page.evaluate(() => window.__tabellone.state.players().length); if (n !== 7) errors.push("giocatori nel boss: " + n);
  if (w === 390) await L.shot(page, "oc_cabinato");
  await page.evaluate(() => window.__tabellone.state.finish(true)); await page.waitForTimeout(300); await page.click("#tbGo"); await page.waitForTimeout(400);
  const rec = await page.evaluate(() => JSON.parse(localStorage.getItem("ali-di-rondine.salagiochi") || "{}")); if (!rec.p || rec.p.ocaexpress !== 1) errors.push("partita non registrata: " + JSON.stringify(rec.p));
  L.check(`Oca del Conte · cabinato Oca Express (${w} px)`, errors); await browser.close();
}
async function vero(w) {
  const save = Object.assign({}, S1, { ch: 1, step: { 1: 3 }, flags: { inv_oc_santino: 1, inv_oc_lente: 1 } });
  const { browser, page, errors } = await start(w, save);
  try {
    await go(page, "oc_parco", 22, 17); await L.talk(page, "oc_gilda"); await L.advance(page, ["Si comincia"]).catch(() => {}); await page.waitForTimeout(600);
    if (!(await page.evaluate(() => !!document.querySelector("#tbOv")))) throw new Error("Tabellone non aperto");
    const h = await page.evaluate(() => window.__tabellone.state.hand); if (!h || h.join() !== "santino,lente") errors.push("mano: " + JSON.stringify(h));
    await page.evaluate(() => { const s = window.__tabellone.state; s.fast(); s.timed(true); s.force(3, 3); s.roll(); }); await page.waitForTimeout(400);
    await page.evaluate(() => window.__tabellone.state.stop()); await page.waitForTimeout(900);
    if (w === 390) await L.shot(page, "oc_tirata_vera");
    await page.evaluate(() => window.__tabellone.state.finish(true)); await page.waitForTimeout(300); await page.click("#tbGo"); await page.waitForTimeout(500); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non chiuso dopo la tirata vera: " + JSON.stringify([i.done, i.step]));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Oca del Conte · tirata vera (${w} px)`, errors); await browser.close();
}
module.exports = { go, start, stub, stubP, st, zones, S1, S2, K_ };
if (require.main === module) (async () => {
  const want = (k) => !ONLY || ONLY === k;
  if (want("zone1")) { await zones(390, S1, ["oc_parco", "oc_salone", "oc_cucina", "oc_serra", "oc_capanno"], "cap. 1"); await zones(320, S1, ["oc_parco"], "cap. 1"); }
  if (want("zone2")) await zones(390, S2, ["oc_parco", "oc_cantina", "oc_serra"], "cap. 2");
  if (want("c2")) { await flow2(390, false); await flow2(320, true); }
  if (want("zone3")) await zones(390, S3, ["oc_parco", "oc_cappella"], "cap. 3");
  if (want("c3")) { await flow3(390, false); await flow3(320, true); }
  if (want("zone4")) await zones(390, S4(), ["oc_parco", "oc_studio"], "cap. 4");
  if (want("c4")) {
    const dadi = { inv_oc_dado: 7 }, amici = { oc_verita_ernestina: 1 };
    await flow4(390, "casella", amici); await flow4(320, "notaio", {}, { win: false, rank: 2 });
    await flow4(390, "bara", Object.assign({ oc_beccato: 2 }, dadi)); await flow4(390, "vivi", {}, null, { cuore: 6 });
  }
  if (want("cab")) { await cab(390); await cab(320); }
  if (want("vero")) { await vero(390); await vero(320); }
  if (want("c1")) { await flow1(390, false); await flow1(320, true); }
})();
