// tests/lampioni.cjs - «La Notte dei Lampioni»: il buio e i lampioni (luce dinamica), Luci (la partita al buio), capitoli e finali
const L = require("./lib.cjs");
const MOD = { mod: "__lampioni", key: "ali-di-rondine.lampioni" };
const luStart = (p) => p.evaluate(() => { const b = document.querySelector(".luOv .ov button"); if (b) b.click(); });
const luEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__luci.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await luStart(p); await p.waitForTimeout(200); };
const lamps = (p) => p.evaluate(() => window.__lampioni._dbg.K.lampsIn(window.__borgoApi.trZone()));
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__lampioni.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  for (const z of ["nl_borgo", "nl_bottega"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "nl_buio");
  await L.talk(page, "nl_clelia"); await L.advance(page);
  // senza lanterna il lampione non si accende
  await L.goAct(page, 12, 8); await L.advance(page); if ((await lamps(page)) !== 0) errors.push("lampione acceso senza lanterna");
  await L.goAct(page, 6, 7); await L.advance(page); await L.talk(page, "nl_fiammetta"); await L.advance(page, ["Proviamo insieme"]); await L.goAct(page, 10, 12); await L.advance(page);
  for (const [x, y] of [[12, 8], [22, 8], [12, 16], [22, 16]]) for (let k = 0; k < 6; k++) { const n0 = await lamps(page); await L.goAct(page, x, y); await L.advance(page); if ((await lamps(page)) > n0) break; await page.waitForTimeout(700); } // Tobia passeggia: se il pulsante parla con lui, si riprova
  await page.waitForTimeout(400); await L.advance(page);
  if ((await lamps(page)) !== 4) errors.push("lampioni accesi: " + (await lamps(page)));
  if (w === 390) await L.shot(page, "nl_luce");
  await L.talk(page, "nl_leandro"); await page.evaluate(() => window.T_.click("Gioca con le Ombre")); await page.waitForTimeout(500); await luStart(page); await page.waitForTimeout(400);
  // un turno vero: una lanterna e un passo avanti
  await page.evaluate(() => document.querySelector(".luOv .lan").dispatchEvent(new PointerEvent("pointerdown"))); const box = await (await page.$(".luOv canvas")).boundingBox();
  await page.mouse.click(box.x + box.width * (3.5 / 7), box.y + box.height * (4.5 / 9)); await page.waitForTimeout(200);
  if (w === 390) await L.shot(page, "nl_partita");
  const d = await page.evaluate(() => window.__luci.state.data.lanterne); if (d !== 1) errors.push("la lanterna non si posa: " + d);
  await luEnd(page, 2, 1); await L.advance(page);
  await L.talk(page, "nl_leandro"); await L.advance(page, ["Accenderemo tutti"]);
  const i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  L.check(`La Notte dei Lampioni · capitolo 1 (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); })().catch((e) => { console.error("✗ lampioni:", e.message); process.exit(1); });
