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
(async () => { await run(390); await run(320); })();
