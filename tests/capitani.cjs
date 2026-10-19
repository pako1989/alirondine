// tests/capitani.cjs - «Capitani di Ventura»: capitolo 1 (accampamento, borgo con locanda/fucina/convento, ponte), la Compagnia (K.crew:
// reclutamento, schieramento, registro), la partita al ponte, i 3 finali e il capitolo 2 provvisorio
const L = require("./lib.cjs");
const MOD = { mod: "__capitani", key: "ali-di-rondine.capitani" };
const K_ = "window.__capitani._dbg.K";
const info = (p) => L.info(p);
const crew = (p) => p.evaluate((k) => eval(k).crew.list(), K_);
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function run(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__capitani.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  if (w === 390) await L.shot(page, "cv_campo");
  for (const z of ["cv_campo"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "cv_isotta"); await L.advance(page);
  let i = await info(page); if (i.step[1] !== 1) errors.push("dopo Isotta: " + JSON.stringify(i.step));
  if ((await crew(page)).length !== 3) errors.push("compagni iniziali: " + (await crew(page)).join(","));
  await go(page, "cv_borgo", 2, 11); if (w === 390) await L.shot(page, "cv_borgo");
  { const bad = await L.reachAll(page, "cv_borgo"); if (bad.length) errors.push("cv_borgo irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "cv_oddone"); await L.advance(page);
  i = await info(page); if (i.step[1] !== 2) errors.push("dopo Oddone: " + JSON.stringify(i.step));
  // reclutamenti: ognuno con la sua scena e una scelta
  const RC = [["cv_gemma", "Le lasci il vantaggio"], ["cv_piccarda", "La fai restituire"], ["cv_zanna", "Spingi con lui"]];
  for (const [id, lab] of RC) { await L.talk(page, id); await L.advance(page, [lab]); }
  for (const [z, id, lab] of [["cv_borgo_i0", "cv_cunegonda", "Le dici di giocare"], ["cv_borgo_i1", "cv_dario", "Gli chiedi di cantare"], ["cv_borgo_i1", "cv_tancredi", "Offri una causa"], ["cv_borgo_i2", "cv_letizia", "Aiuti in cucina"]]) {
    await go(page, z, 10, 10); if (w === 390 && id === "cv_dario") await L.shot(page, "cv_locanda");
    { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
    await L.talk(page, id); await L.advance(page, [lab]);
  }
  const n = (await crew(page)).length; if (n < 9) errors.push("reclutati " + n + "/9 attesi almeno");
  await go(page, "cv_ponte", 14, 2); if (w === 390) await L.shot(page, "cv_ponte");
  { const bad = await L.reachAll(page, "cv_ponte"); if (bad.length) errors.push("cv_ponte irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "cv_piero"); await L.advance(page, ["Aiuti a sistemarlo"]);
  await go(page, "cv_campo", 4, 9);
  await L.talk(page, "cv_isotta"); await L.advance(page, ["Vinceremo"]);
  i = await info(page); if (i.step[1] !== 3) errors.push("dopo il falò: " + JSON.stringify(i.step));
  // schieramento: massimo 4 in campo
  const fl = await page.evaluate((k) => eval(k).crew.field().length, K_); if (fl > 4) errors.push("schierati " + fl);
  await go(page, "cv_ponte", 14, 2); await L.stubMatch(page, true);
  await L.talk(page, "cv_oddone"); await L.advance(page, ["Sì, si gioca"]).catch(() => {}); await page.waitForTimeout(500);
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "cv_ponte") errors.push("partita al ponte non partita");
  await L.advance(page, ["Metà al villaggio"]);
  i = await info(page); if (!i.done[1] || i.done[1] !== "villaggio") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Capitani di Ventura · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const save = { v: 1, ch: 2, step: { 1: 4 }, done: { 1: "villaggio" }, diffSet: true, intro: { ch1: 1, cv_campo: 1, cv_borgo: 1, cv_ponte: 1 }, st: { onore: 4, fama: 2, scudi: 60 }, flags: { cr_cv_isotta: 1, cf_cv_isotta: 1, cr_cv_ambrogio: 2, cf_cv_ambrogio: 1, cr_cv_brenno: 3, cf_cv_brenno: 1, cr_cv_gemma: 4, cf_cv_gemma: 1, cr_n: 4 } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__capitani.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  await L.talk(page, "cv_isotta"); await L.advance(page);
  let i = await info(page); if (i.step[2] !== 1) errors.push("dopo Isotta c2: " + JSON.stringify(i.step));
  await go(page, "cv_borgo", 15, 3); { const bad = await L.reachAll(page, "cv_borgo"); if (bad.length) errors.push("cv_borgo (patch) " + bad.join(", ")); }
  await go(page, "cv_castello", 15, 19); if (w === 390) await L.shot(page, "cv_castello");
  { const bad = await L.reachAll(page, "cv_castello"); if (bad.length) errors.push("cv_castello irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "cv_fulvio"); await L.advance(page, ["Gli offri una quota"]);
  await L.talk(page, "cv_tiburzio"); await L.advance(page, ["Gli dai il ritmo"]);
  await go(page, "cv_castello_i1", 10, 10); { const bad = await L.reachAll(page, "cv_castello_i1"); if (bad.length) errors.push("infermeria: " + bad.join(", ")); }
  await L.talk(page, "cv_ilaria"); await L.advance(page, ["Reggi la bacinella"]);
  await go(page, "cv_castello_i0", 10, 10); { const bad = await L.reachAll(page, "cv_castello_i0"); if (bad.length) errors.push("sala: " + bad.join(", ")); }
  await L.talk(page, "cv_conte"); await L.advance(page, ["La Torre dei Corvi"]);
  i = await info(page); if (i.step[2] !== 2 || i.flags.cv2_path !== "assedio") errors.push("dopo il Conte: " + JSON.stringify([i.step, i.flags.cv2_path]));
  await go(page, "cv_castello", 15, 19);
  await L.talk(page, "cv_oddone"); await L.advance(page, ["Sì, andiamo"]).catch(() => {}); await page.waitForTimeout(500);
  if (!(await page.evaluate(() => !!document.getElementById("scOv")))) errors.push("Schiere non si apre");
  if (w === 390) await L.shot(page, "cv_schiere");
  // un turno vero, poi chiusura programmata
  await page.evaluate(() => document.getElementById("scGo").click()); await page.waitForTimeout(200);
  if (w === 390) await L.shot(page, "cv_schiere2");
  await page.evaluate(() => window.__schiere.state.finish(3, 1)); await page.waitForTimeout(200);
  await page.evaluate(() => document.getElementById("scGo").click()); await page.waitForTimeout(400);
  await L.advance(page, ["Lo curi e lo lasci andare"]);
  i = await info(page); if (!i.done[2] || i.done[2] !== "clemenza") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  const n = (await crew(page)).length; if (n < 7) errors.push("compagni " + n);
  L.check(`Capitani di Ventura · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w, via) {
  const fl = { cr_cv_isotta: 1, cf_cv_isotta: 1, cr_cv_dario: 2, cf_cv_dario: 1, cr_cv_piero: 3, cf_cv_piero: 1, cr_cv_letizia: 4, cf_cv_letizia: 1, cr_n: 4 };
  const save = { v: 1, ch: 3, step: { 1: 4, 2: 3 }, done: { 1: "villaggio", 2: "clemenza" }, diffSet: true, intro: { ch1: 1, cv_campo: 1, cv_borgo: 1, cv_ponte: 1, cv_castello: 1 }, st: { onore: 4, fama: 3, scudi: 40 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__capitani.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  await L.talk(page, "cv_isotta"); await L.advance(page);
  let i = await info(page); if (i.step[3] !== 1) errors.push("dopo Isotta c3: " + JSON.stringify(i.step));
  await go(page, "cv_borgo", 29, 11); { const bad = await L.reachAll(page, "cv_borgo"); if (bad.length) errors.push("cv_borgo (patch c3) " + bad.join(", ")); }
  await go(page, "cv_fiera", 2, 10); if (w === 390) await L.shot(page, "cv_fiera");
  { const bad = await L.reachAll(page, "cv_fiera"); if (bad.length) errors.push("cv_fiera irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "cv_marta"); await L.advance(page);
  await L.talk(page, "cv_bertoldo"); await L.advance(page, ["Lo ascolti seduto"]);
  await L.talk(page, "cv_oddone"); await L.advance(page, ["Lo incalzi"]);
  await go(page, "cv_fiera_i0", 10, 10); { const bad = await L.reachAll(page, "cv_fiera_i0"); if (bad.length) errors.push("botte piena: " + bad.join(", ")); }
  await L.talk(page, "cv_lupo"); await L.advance(page).catch(() => {});
  await page.evaluate((k) => eval(k).setStep(3, 2), K_);
  await go(page, "cv_bosco", 2, 9); if (w === 390) await L.shot(page, "cv_bosco");
  { const bad = await L.reachAll(page, "cv_bosco"); if (bad.length) errors.push("cv_bosco irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "cv_lupo"); await L.advance(page, via === "accordo" ? ["Doppio gioco"] : ["Resto col Conte"]).catch(() => {}); await page.waitForTimeout(500);
  if (via !== "accordo") {
    if (!(await page.evaluate(() => !!document.getElementById("scOv")))) errors.push("Schiere non si apre");
    await page.evaluate(() => window.__schiere.state.finish(3, 1)); await page.waitForTimeout(200);
    await page.evaluate(() => document.getElementById("scGo").click()); await page.waitForTimeout(400); await L.advance(page);
  }
  i = await info(page); if (!i.done[3] || i.done[3] !== (via || "conte")) errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step, i.flags.cv3_path]));
  L.check(`Capitani di Ventura · capitolo 3 ${via || "conte"} (${w} px)`, errors); await browser.close();
}
async function c4(w, opt, end) {
  const fl = { cr_cv_isotta: 1, cf_cv_isotta: 1, cr_cv_dario: 2, cf_cv_dario: 1, cr_cv_pellegrino: 3, cf_cv_pellegrino: 1, cr_cv_gemma: 4, cf_cv_gemma: 1, cr_n: 4, cv3_path: "accordo" };
  const save = { v: 1, ch: 4, step: { 1: 4, 2: 3, 3: 4 }, done: { 1: "villaggio", 2: "clemenza", 3: "accordo" }, diffSet: true, intro: { ch1: 1, cv_campo: 1, cv_borgo: 1, cv_ponte: 1, cv_castello: 1 }, st: { onore: 4, fama: 3, scudi: 40 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__capitani.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 4")); await L.advance(page);
  await L.talk(page, "cv_isotta"); await L.advance(page);
  let i = await info(page); if (i.step[4] !== 1) errors.push("dopo Isotta c4: " + JSON.stringify(i.step));
  await go(page, "cv_castello", 27, 15); { const bad = await L.reachAll(page, "cv_castello"); if (bad.length) errors.push("castello (patch c4) " + bad.join(", ")); }
  await go(page, "cv_castello_i0", 10, 10);
  await L.talk(page, "cv_conte"); await L.advance(page, [opt]);
  i = await info(page); if (i.step[4] !== 2) errors.push("dopo il Conte: " + JSON.stringify(i.step));
  await go(page, "cv_valico", 2, 10); if (w === 390) await L.shot(page, "cv_valico");
  { const bad = await L.reachAll(page, "cv_valico"); if (bad.length) errors.push("cv_valico irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "cv_pellegrino"); await L.advance(page, ["Gli offri un posto"]);
  await L.talk(page, "cv_araldo"); await L.advance(page, ["Sì, si combatte"]).catch(() => {}); await page.waitForTimeout(500);
  if (!(await page.evaluate(() => !!document.getElementById("scOv")))) errors.push("Schiere non si apre");
  await page.evaluate(() => window.__schiere.state.finish(3, 1)); await page.waitForTimeout(200);
  await page.evaluate(() => document.getElementById("scGo").click()); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  i = await info(page); if (i.done[4] !== end || !i.ends.includes(end)) errors.push("finale atteso " + end + ": " + JSON.stringify([i.done, i.ends]));
  L.check(`Capitani di Ventura · capitolo 4 ${end} (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); await c2(390); await c2(320); await c3(390, "conte"); await c3(320, "accordo"); await c4(390, "Accetto l'incarico", "capitano"); await c4(320, "Rifiuto", "libera"); })();
