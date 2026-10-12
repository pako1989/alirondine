// tests/spazio.cjs - «Calcio Spaziale: Stazione Orbitale 7»: capitolo 1 (la squadra, la gravità invertita, la palestra a gravità zero)
const L = require("./lib.cjs");
const MOD = { mod: "__spazio", key: "ali-di-rondine.spazio" };
const leave = (p) => p.evaluate(() => [...document.querySelectorAll(".scPitch .ov button")].forEach((b) => b.click()));
const K = (p, fn, arg) => p.evaluate(([f, a]) => new Function("K", "a", f)(window.__spazio._dbg.K, a), [fn, arg]);
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__spazio.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  for (const z of ["so_hangar", "so_anello", "so_palestra"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "so_hangar");
  await L.talk(page, "so_gru"); await L.advance(page);
  // l'esame di ARBI-9 (risposte giuste)
  await L.talk(page, "so_arbi"); await L.advance(page, ["Fai l'esame", "Undici", "oltre l'ultimo difensore", "Non per forza"]);
  // Blop in mensa
  await L.goAct(page, 24, 7); await L.advance(page); if ((await L.zone(page)) !== "so_mensa") errors.push("non si entra in mensa");
  if (w === 390) await L.shot(page, "so_mensa");
  await L.talk(page, "so_blop"); await L.advance(page, ["Le Comete Ribelli"]); await L.goAct(page, 10, 12); await L.advance(page);
  // l'Anello: oltre la linea gialla la gravità si gira
  await L.goAct(page, 33, 9); await L.advance(page); if ((await L.zone(page)) !== "so_anello") errors.push("non si va nell'Anello: " + (await L.zone(page)));
  await L.talk(page, "so_quattro"); await page.waitForTimeout(150); await L.advance(page, ["Da ogni parte"]);
  await page.waitForTimeout(900); const gv = await K(page, "return [K.gravity(), K.GRV.ang]"); if (gv[0] !== "flip" || gv[1] < 1) errors.push("la gravità non si è girata nel Settore B: " + JSON.stringify(gv));
  if (w === 390) await L.shot(page, "so_anello_b");
  // camminando a sinistra (sullo schermo) nel Settore B, il Campione va verso destra nel mondo
  const x0 = await page.evaluate(() => window.__tr.TW.x); await page.evaluate(() => { window.__borgoApi.trKeys().left = true; }); await page.waitForTimeout(500); await page.evaluate(() => { window.__borgoApi.trKeys().left = false; });
  const x1 = await page.evaluate(() => window.__tr.TW.x); if (!(x1 > x0 + 4)) errors.push(`comandi capovolti sbagliati: ${x0} → ${x1}`);
  const st = await L.info(page); if (st.step[1] !== 2) errors.push("squadra non completa: " + JSON.stringify(st.step));
  // la Palestra a gravità zero
  await L.goAct(page, 43, 6); await L.advance(page); if ((await L.zone(page)) !== "so_palestra") errors.push("non si va in Palestra");
  await page.evaluate(() => { window.__borgoApi.trKeys().right = true; }); await page.waitForTimeout(400); await page.evaluate(() => { window.__borgoApi.trKeys().right = false; });
  const p0 = await page.evaluate(() => window.__tr.TW.x); await page.waitForTimeout(400); const p1 = await page.evaluate(() => window.__tr.TW.x); if (!(p1 > p0 + 2)) errors.push(`a gravità zero non si scivola: ${p0} → ${p1}`);
  if (w === 390) await L.shot(page, "so_palestra");
  for (const [x, y] of [[6, 4], [17, 6], [11, 12]]) { await L.goAct(page, x, y); await L.advance(page); }
  await L.talk(page, "so_bullone"); await L.advance(page);
  await L.talk(page, "so_arbi"); await page.evaluate(() => window.T_.click("Gioca contro I Bulloni")); await page.waitForTimeout(500); await leave(page); await page.waitForTimeout(1500);
  if (w === 390) await L.shot(page, "so_match");
  await page.evaluate(() => { const S = window.__sagaCore.pitchState; S.t = 24 * 60 - 1; }); await page.waitForTimeout(1200); if (w === 390) await L.shot(page, "so_match_flip");
  await page.evaluate(() => { const S = window.__sagaCore.pitchState; S.a = 3; S.b = 1; S.finish(); }); await page.waitForTimeout(200); await leave(page); await L.advance(page);
  await page.evaluate(() => window.__spazio._dbg.K.enterZone("so_hangar")); await page.waitForTimeout(400); await L.advance(page);
  await L.goAct(page, 22, 17); await L.advance(page);
  await L.talk(page, "so_gru"); await L.advance(page, ["Festa in mensa"]);
  const i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step)); if (!i.flags.cartoline) errors.push("cartolina non presa");
  L.check(`Calcio Spaziale · capitolo 1 (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); })().catch((e) => { console.error("✗ spazio:", e.message); process.exit(1); });
