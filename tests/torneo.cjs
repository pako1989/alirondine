// tests/torneo.cjs - «Il Torneo delle Cento Scuole»: capitolo 1 (la Via Lunga, personaggi che camminano, il quarto a Vignette)
const L = require("./lib.cjs");
const MOD = { mod: "__torneo", key: "ali-di-rondine.torneo" };
const vgStart = (p) => p.evaluate(() => { const b = document.querySelector(".vgOv .ov button"); if (b) b.click(); });
const vgEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__vignette.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await vgStart(p); await p.waitForTimeout(200); };
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__torneo.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  for (const z of ["ts_piazza", "ts_spiaggia", "ts_campo"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  // i personaggi camminano davvero
  await page.waitForTimeout(400); const p0 = await page.evaluate(() => window.__tr.TW.z.npcs.find((n) => n.id === "ts_vigile").px); await page.waitForTimeout(1200);
  const p1 = await page.evaluate(() => window.__tr.TW.z.npcs.find((n) => n.id === "ts_vigile").px); if (!(Math.abs(p1 - p0) > 4)) errors.push(`il vigile non cammina: ${p0} → ${p1}`);
  if (w === 390) await L.shot(page, "ts_piazza");
  await L.talk(page, "ts_iole"); await L.advance(page);
  const ga = await L.goAct(page, 8, 8); await L.advance(page); if ((await L.zone(page)) !== "ts_forno") errors.push("non si entra in panetteria: " + ga + " " + (await L.zone(page)) + " " + JSON.stringify((await L.info(page)).step));
  if (w === 390) await L.shot(page, "ts_forno");
  await L.talk(page, "ts_tito"); await L.advance(page, ["In campo si brucia"]); await L.goAct(page, 10, 12); await L.advance(page);
  await L.goAct(page, 31, 8); await L.advance(page); await L.talk(page, "ts_alba"); await L.advance(page, ["Dammi le lettere"]); await L.goAct(page, 10, 12); await L.advance(page);
  for (const id of ["ts_vigile", "ts_turista", "ts_pescatore"]) { await L.talk(page, id); await L.advance(page); }
  await L.goAct(page, 31, 8); await L.advance(page); await L.talk(page, "ts_alba"); await L.advance(page); await L.goAct(page, 10, 12); await L.advance(page);
  await L.goAct(page, 19, 25); await L.advance(page); if ((await L.zone(page)) !== "ts_spiaggia") errors.push("non si scende in spiaggia");
  if (w === 390) await L.shot(page, "ts_spiaggia");
  await L.talk(page, "ts_rocco"); await L.advance(page, ["Non importa"]);
  await L.goAct(page, 19, 0); await L.advance(page); await L.talk(page, "ts_iole"); await L.advance(page, ["Ci fidiamo"]);
  const i0 = await L.info(page); if (i0.step[1] !== 3) errors.push("squadra o tecnica non pronte: " + JSON.stringify(i0.step));
  await L.goAct(page, 0, 12); await L.advance(page); if ((await L.zone(page)) !== "ts_campo") errors.push("non si va al campo");
  await L.talk(page, "ts_gil"); await page.evaluate(() => window.T_.click("Gioca il quarto")); await page.waitForTimeout(500); await vgStart(page); await page.waitForTimeout(2500);
  const tech = await page.evaluate(() => window.__vignette.state && window.__vignette.state.o.techniques); if (!tech || !tech.includes("tiro3")) errors.push("il Tiro a Tre non arriva in partita: " + JSON.stringify(tech));
  if (w === 390) await L.shot(page, "ts_vignette");
  await vgEnd(page, 3, 1); await L.advance(page);
  await L.talk(page, "ts_ettore"); await L.advance(page, ["Perché ci divertiamo"]);
  const i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step)); if (i.flags.tb_q0 !== "La Via Lunga") errors.push("tabellone non aggiornato");
  L.check(`Il Torneo delle Cento Scuole · capitolo 1 (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); })().catch((e) => { console.error("✗ torneo:", e.message); process.exit(1); });
