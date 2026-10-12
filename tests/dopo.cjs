// tests/dopo.cjs - «Dopo il Campione»: capitolo 1 (echi, il campo nel 1928, la partita in bianco e nero)
const L = require("./lib.cjs");
const MOD = { mod: "__dopo", key: "ali-di-rondine.dopo" };
const leave = (p) => p.evaluate(() => [...document.querySelectorAll(".scPitch .ov button")].forEach((b) => b.click()));
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__dopo.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  for (const z of ["ep_valdorsa", "ep_campo"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "ep_valdorsa");
  await L.talk(page, "ep_ada"); await L.advance(page);
  await L.goAct(page, 7, 8); await L.advance(page); await L.talk(page, "ep_tecla"); await L.advance(page); if (w === 390) await L.shot(page, "ep_casa"); await L.goAct(page, 10, 12); await L.advance(page);
  await L.goAct(page, 30, 8); await L.advance(page); await L.talk(page, "ep_carlo"); await L.advance(page); await L.goAct(page, 10, 12); await L.advance(page);
  await L.goAct(page, 39, 12); await L.advance(page); if (w === 390) await L.shot(page, "ep_campo");
  await L.talk(page, "ep_ada"); await L.advance(page);
  for (const [x, y] of [[14, 8], [22, 15], [4, 16]]) { await L.goAct(page, x, y); await L.advance(page); }
  await L.talk(page, "ep_ada"); await L.advance(page, ["Mostrami il 1928"]); await page.waitForTimeout(400);
  const era = await page.evaluate(() => window.__dopo._dbg.K.eraOf("ep_campo")); if (era !== "1928") errors.push("il campo non è tornato al 1928: " + era);
  if (w === 390) await L.shot(page, "ep_campo_1928");
  await L.talk(page, "ep_bruno"); await page.evaluate(() => window.T_.click("Gioca la partita del 1928")); await page.waitForTimeout(500); await leave(page); await page.waitForTimeout(1600);
  if (w === 390) await L.shot(page, "ep_match_1928");
  await page.evaluate(() => { const S = window.__sagaCore.pitchState; S.a = 1; S.b = 0; S.finish(); }); await page.waitForTimeout(200); await leave(page); await L.advance(page);
  const era2 = await page.evaluate(() => window.__dopo._dbg.K.eraOf("ep_campo")); if (era2) errors.push("il campo è rimasto nel passato");
  await L.talk(page, "ep_ada"); await L.advance(page, ["Lui ti guardava"]);
  const i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  L.check(`Dopo il Campione · capitolo 1 (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); })().catch((e) => { console.error("✗ dopo:", e.message); process.exit(1); });
