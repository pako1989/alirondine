// tests/cronache.cjs - «Le Cronache del Pallone di Cristallo»: capitolo 1 (il gruppo che segue, la mappa del mondo, la partita ATB)
const L = require("./lib.cjs");
const MOD = { mod: "__cronache", key: "ali-di-rondine.cronache" };
const atbStart = (p) => p.evaluate(() => { const b = document.querySelector(".atbOv .ov button"); if (b) b.click(); });
const atbEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__atb.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await atbStart(p); await p.waitForTimeout(200); };
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__cronache.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  for (const z of ["cc_prato", "cc_mondo", "cc_bosco"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "cc_ermete"); await L.advance(page);
  await L.talk(page, "cc_lyra"); await L.advance(page, ["Basta e avanza"]);
  const g = await page.evaluate(() => (window.__tr.TW.z.npcs.find((n) => n.id === "cc_lyra") || {}).ghost); if (!g) errors.push("Lyra non segue il Campione");
  // il gruppo segue: cammina e guarda dove va Lyra
  const l0 = await page.evaluate(() => { const n = window.__tr.TW.z.npcs.find((n) => n.id === "cc_lyra"); return [n.px, n.py]; });
  await page.evaluate(() => { window.__borgoApi.trKeys().down = true; }); await page.waitForTimeout(700); await page.evaluate(() => { window.__borgoApi.trKeys().down = false; }); await page.waitForTimeout(200);
  const l1 = await page.evaluate(() => { const n = window.__tr.TW.z.npcs.find((n) => n.id === "cc_lyra"); return [n.px, n.py, window.__tr.TW.y]; });
  if (!(l1[1] > l0[1] + 4) || !(l1[1] < l1[2])) errors.push("Lyra non cammina dietro al Campione: " + JSON.stringify([l0, l1]));
  if (w === 390) await L.shot(page, "cc_prato");
  await L.goAct(page, 17, 0); await L.advance(page); if ((await L.zone(page)) !== "cc_mondo") errors.push("non si esce sulla mappa del mondo");
  if (w === 390) await L.shot(page, "cc_mondo");
  await L.goAct(page, 30, 8); await L.advance(page); if ((await L.zone(page)) !== "cc_torre") errors.push("non si entra nella torre");
  await L.talk(page, "cc_fosco"); await L.advance(page); if (w === 390) await L.shot(page, "cc_torre");
  await L.goAct(page, 10, 12); await L.advance(page);
  await L.goAct(page, 36, 23); await L.advance(page); if ((await L.zone(page)) !== "cc_bosco") errors.push("non si entra nel bosco");
  await L.goAct(page, 4, 19); await L.advance(page); await L.goAct(page, 17, 23); await L.advance(page);
  await L.goAct(page, 30, 8); await L.advance(page); await L.talk(page, "cc_fosco"); await L.advance(page); await L.goAct(page, 10, 12); await L.advance(page);
  const party = await page.evaluate(() => window.__tr.TW.z.npcs.filter((n) => n.ghost).map((n) => n.id)); if (party.length !== 2) errors.push("il gruppo non è di tre: " + JSON.stringify(party));
  await L.goAct(page, 36, 23); await L.advance(page); if (w === 390) await L.shot(page, "cc_bosco");
  await L.talk(page, "cc_rovo"); await page.evaluate(() => window.T_.click("Accetta la sfida")); await page.waitForTimeout(500); await atbStart(page); await page.waitForTimeout(2500);
  const st = await page.evaluate(() => window.__atb.state.party.map((m) => m.name)); if (st.length !== 3) errors.push("in partita non c'è il gruppo: " + JSON.stringify(st));
  if (w === 390) await L.shot(page, "cc_atb");
  await atbEnd(page, 2, 0); await L.advance(page);
  await page.evaluate(() => window.__cronache._dbg.K.go("cc_prato", 17, 12)); await page.waitForTimeout(400); await L.advance(page);
  await L.talk(page, "cc_ermete"); await L.advance(page, ["Prima una festa"]);
  const i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step)); if (!i.flags.cristallo_cc_bosco) errors.push("cristallo non acceso");
  L.check(`Le Cronache del Pallone di Cristallo · capitolo 1 (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); })().catch((e) => { console.error("✗ cronache:", e.message); process.exit(1); });
