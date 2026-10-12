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
async function c2(w) {
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "guardava" }, intro: { ch1: 1, ep_valdorsa: 1, ep_campo: 1 }, st: { ada: 3, squadra: 2 } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__dopo.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  const bad = await L.reachAll(page, "ep_riva"); if (bad.length) errors.push("ep_riva irraggiungibile: " + bad.join(", "));
  if (w === 390) await L.shot(page, "ep_riva");
  await L.talk(page, "ep_ada"); await L.advance(page);
  await L.goAct(page, 12, 18); await L.advance(page); await L.talk(page, "ep_sandro"); await L.advance(page); await L.goAct(page, 10, 12); await L.advance(page);
  await L.talk(page, "ep_ada"); await L.advance(page, ["Mostrami il 1974"]); if (w === 390) await L.shot(page, "ep_riva_leggenda");
  for (const [x, y] of [[34, 14], [39, 8], [33, 6]]) { await L.goAct(page, x, y); await L.advance(page); }
  await page.waitForTimeout(300); await L.advance(page);
  await L.goAct(page, 12, 18); await L.advance(page); await L.talk(page, "ep_sandro"); await L.advance(page, ["Mostracelo"]); await L.goAct(page, 10, 12); await L.advance(page);
  await L.talk(page, "ep_sandro"); await L.advance(page, ["Guarda con gli occhi di Sandro"]); if (w === 390) await L.shot(page, "ep_riva_verita");
  await L.talk(page, "ep_sandro74"); await page.evaluate(() => window.T_.click("Gioca il secondo tempo")); await page.waitForTimeout(500); await leave(page); await page.waitForTimeout(1500);
  if (w === 390) await L.shot(page, "ep_match_1974");
  await page.evaluate(() => { const S = window.__sagaCore.pitchState; S.a = 1; S.b = 2; S.finish(); }); await page.waitForTimeout(200); await leave(page); await L.advance(page);
  await L.talk(page, "ep_sandro"); await L.advance(page); await L.goAct(page, 26, 17); await L.advance(page); await L.goAct(page, 18, 10); await L.advance(page); await L.goAct(page, 10, 12); await L.advance(page);
  await L.talk(page, "ep_sandro"); await L.advance(page);
  await L.talk(page, "ep_ada"); await L.advance(page, ["Diciamo la verità"]);
  const i = await L.info(page); if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify(i.step)); if (!i.flags.ep_pallone74_dato) errors.push("commissione del pallone non chiusa");
  L.check(`Dopo il Campione · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "guardava", 2: "verita" }, intro: { ch1: 1, ch2: 1, ep_valdorsa: 1, ep_campo: 1, ep_riva: 1 }, st: { ada: 7, squadra: 6 }, flags: { echi: 6 } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__dopo.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  const bad = await L.reachAll(page, "ep_stazione"); if (bad.length) errors.push("ep_stazione irraggiungibile: " + bad.join(", "));
  if (w === 390) await L.shot(page, "ep_stazione");
  await L.talk(page, "ep_ada"); await L.advance(page);
  await L.goAct(page, 20, 14); await L.advance(page); if ((await L.zone(page)) !== "ep_sala") errors.push("non si entra nella sala giochi");
  await L.talk(page, "ep_rita"); await L.advance(page);
  await L.talk(page, "ep_ada"); await L.advance(page, ["Mostrami il 1989"]); await page.waitForTimeout(300); if (w === 390) await L.shot(page, "ep_sala_1989");
  await L.talk(page, "ep_bruno89"); await L.advance(page);
  for (const [x, y] of [[8, 8], [16, 5], [4, 9]]) { await L.goAct(page, x, y); await L.advance(page); }
  await page.waitForTimeout(300); await L.advance(page);
  if (await page.evaluate(() => window.__dopo._dbg.K.eraOf("ep_sala"))) errors.push("la sala è rimasta nel 1989");
  await L.goAct(page, 10, 2); await page.evaluate(() => window.T_.click("Inserisci il gettone")); await page.waitForTimeout(500); await leave(page); await page.waitForTimeout(1500);
  if (w === 390) await L.shot(page, "ep_match_1989");
  await page.evaluate(() => { const S = window.__sagaCore.pitchState; S.a = 2; S.b = 1; S.finish(); }); await page.waitForTimeout(200); await leave(page); await L.advance(page);
  await L.goAct(page, 10, 12); await L.advance(page); await page.evaluate(() => window.__dopo._dbg.K.enterZone("ep_campo")); await page.waitForTimeout(400); await L.advance(page);
  await L.talk(page, "ep_ada"); await page.evaluate(() => window.T_.click("Gioca l'ultima partita")); await page.waitForTimeout(500); await leave(page); await page.waitForTimeout(1200);
  if (w === 390) await L.shot(page, "ep_match_oggi");
  await page.evaluate(() => { const S = window.__sagaCore.pitchState; S.a = 3; S.b = 2; S.finish(); }); await page.waitForTimeout(200); await leave(page); await L.advance(page);
  const ends = ["Sotto l'incisione", "Continua il tuo viaggio", "Resta. Nino", "E se lasciassi"];
  for (const e of ends) {
    await page.evaluate(() => { const K = window.__dopo._dbg.K; K.setStep(3, 4); K.enterZone("ep_campo"); }); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "ep_ada"); await L.advance(page, [e]); if (w === 390 && e === ends[0]) await L.shot(page, "ep_finale");
  }
  const i = await L.info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate(() => window.__dopo._dbg.K.mem().ends.length); if (n < 4) errors.push("finali trovati " + n + " su 4");
  L.check(`Dopo il Campione · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); })().catch((e) => { console.error("✗ dopo:", e.message); process.exit(1); });
