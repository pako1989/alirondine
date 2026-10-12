// tests/detective.cjs - «Detective di Campo»: capitolo 1 (moviola, interrogatorio, ricostruzione) e i quattro finali
const L = require("./lib.cjs");
const MOD = { mod: "__detective", key: "ali-di-rondine.detective" };
const leave = (p) => p.evaluate(() => [...document.querySelectorAll(".scPitch .ov button")].forEach((b) => b.click()));
const tap = (page, f, a) => page.evaluate(([f, a]) => { const M = window.__moviola.state; M.f = f; const an = M.o.anomalies.find((x) => x.id === a); const p = M.posOf(an); const r = M.cv.getBoundingClientRect(); M.cv.dispatchEvent(new PointerEvent("pointerdown", { clientX: r.left + p[0] / 320 * r.width, clientY: r.top + p[1] / 200 * r.height, bubbles: true })); return M.found.length; }, [f, a]);
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__detective.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  for (const z of ["dc_citta", "dc_stadio"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await L.goAct(page, 7, 9); await L.advance(page); await L.talk(page, "dc_agata"); await L.advance(page); await L.goAct(page, 10, 12); await L.advance(page);
  await L.goAct(page, 39, 12); await L.advance(page); await L.goAct(page, 4, 9); await L.advance(page); await L.talk(page, "dc_ugo"); await page.evaluate(() => window.T_.click("Avvia la moviola")); await page.waitForTimeout(400);
  for (const [f, a] of [[140, "guardalinee"], [230, "pallone"], [260, "numeri"]]) await tap(page, f, a);
  await page.waitForTimeout(1200); await page.evaluate(() => document.querySelector("#movOv .ov button").click()); await L.advance(page);
  await L.goAct(page, 10, 12); await L.advance(page); await L.goAct(page, 35, 9); await L.advance(page); await L.talk(page, "dc_sereno"); await L.advance(page, ["Il guardalinee distratto", "Lo prendo io"]);
  await L.goAct(page, 10, 12); await L.advance(page); await L.talk(page, "dc_agata"); await page.evaluate(() => window.T_.click("Rigioca")); await page.waitForTimeout(500); await leave(page); await page.waitForTimeout(300);
  await page.evaluate(() => { const S = window.__sagaCore.pitchState; S.a = 1; S.b = 0; S.finish(); }); await page.waitForTimeout(200); await leave(page); await L.advance(page);
  await L.talk(page, "dc_agata"); await L.advance(page, ["esca"]);
  const i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  L.check(`Detective · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function finale(end) {
  const fl = { dc_distintivo: true, dc_m1: 0, dc_m3: 0, dc_sereno: "esca" };
  ["cucitura", "guardalinee", "pallone", "numeri", "ombrello", "biglietto", "nastro87", "ricevute", "contratto", "tribuna", "pallone3", "guardalinee3"].forEach((k) => (fl["ev_" + k] = true));
  if (end === "vendetta") fl.dc_agata_rabbia = true; if (end !== "campo") fl.dc_wrong = 1;
  const save = { v: 1, ch: 3, step: { 1: 6, 2: 6, 3: 3 }, done: { 1: "esca", 2: "metodo" }, flags: fl, intro: { ch1: 1, ch2: 1, ch3: 1, dc_citta: 1, dc_stadio: 1, dc_porto: 1, dc_consiglio: 1 }, zone: "dc_citta", st: { fiuto: end === "campo" ? 13 : 10, agata: end === "pulita" ? 5 : 3, lega: 3 } };
  const { browser, page, errors } = await L.setup({ w: 390, ...MOD, save });
  await page.evaluate(() => window.__detective.open()); await page.evaluate(() => window.T_.click("Continua la storia")); await L.advance(page);
  await L.goAct(page, 33, 9); await L.advance(page); await L.talk(page, "dc_vanni");
  for (const ev of ["Le ricevute della Lega", "L'ombrello in tribuna", "Il contratto televisivo"]) for (let k = 0; k < 40; k++) { await page.waitForTimeout(120); const r = await page.evaluate((ev) => (window.T_.click(ev) ? "ok" : window.T_.click("^Continua") ? "c" : "-"), ev); if (r === "ok") break; }
  await L.advance(page); await L.talk(page, "dc_agata");
  await L.advance(page, [end === "pulita" ? "Porta tutte le prove" : end === "vendetta" ? "Lascia che sia Agata" : end === "campo" ? "ginocchio" : "Fai arrestare Vanni"]);
  const i = await L.info(page); if (!i.ends.includes(end)) errors.push("finale non trovato: " + end + " · " + JSON.stringify(i.ends));
  L.check(`Detective · finale «${end}»`, errors); await browser.close();
}
async function c4(w) {
  const all = ["cucitura", "guardalinee", "pallone", "numeri", "ombrello", "biglietto", "nastro87", "ricevute", "contratto", "tribuna", "pallone3", "guardalinee3"];
  const fl = {}; all.forEach((k) => (fl["clue_" + k] = true));
  const save = { v: 1, ch: 4, step: { 1: 9, 2: 9, 3: 9 }, done: { 1: "a", 2: "b", 3: "chiuso" }, ends: ["chiuso"], diffSet: true, intro: { ch1: 1, ch2: 1, ch3: 1 }, st: { fiuto: 6 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, mod: "__detective", key: "ali-di-rondine.detective", save });
  await page.evaluate(() => { const K = window.__detective._dbg.K; ["cucitura", "guardalinee", "pallone", "numeri", "ombrello", "biglietto", "nastro87", "ricevute", "contratto", "tribuna", "pallone3", "guardalinee3"].forEach((k) => K.giveClue(k)); });
  await page.evaluate(() => window.__detective.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 4")); await L.advance(page);
  { const bad = await L.reachAll(page, "dc_tribunale"); if (bad.length) errors.push("dc_tribunale irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "dc_agata"); await L.advance(page);
  await L.talk(page, "dc_valli"); await page.waitForTimeout(250);
  // una prova sbagliata (si riprova), poi le tre giuste
  const pick = async (re) => { const r = await page.evaluate((re) => window.T_.click(re), re); await page.waitForTimeout(200); await L.advance(page, []).catch(() => {}); return r; };
  const tryPick = async (re) => { for (let k = 0; k < 30; k++) { const r = await page.evaluate((re) => window.T_.click(re), re); if (r) return r; await page.evaluate(() => window.T_.click("^Continua|^Avanti|^Ok")); await page.waitForTimeout(150); } return false; };
  if (!(await tryPick("Il pallone chiaro della finale"))) errors.push("le prove non si presentano");
  for (const re of ["Il contratto televisivo", "Il nastro del 1987", "L'ombrello rosso in tribuna"]) { if (!(await tryPick(re))) errors.push("prova non disponibile: " + re); }
  await L.advance(page).catch(() => {});
  if (w === 390) await L.shot(page, "dc_tribunale");
  let i = await L.info(page); if ((i.step[4] || 0) < 2) errors.push("Valli non confessa: " + JSON.stringify(i.step));
  await L.talk(page, "dc_giudice"); await L.advance(page, ["finale del 1987"]);
  i = await L.info(page); if (!i.done[4]) errors.push("capitolo 4 non concluso: " + JSON.stringify(i.step));
  L.check(`Detective · capitolo 4 «L'udienza» (${w} px)`, errors); await browser.close();
}
(async () => { await c4(390); await c4(320); await c1(390); await c1(320); for (const e of ["chiuso", "pulita", "vendetta", "campo"]) await finale(e); })().catch((e) => { console.error("✗ detective:", e.message); process.exit(1); });
