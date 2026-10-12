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
async function c2(w) {
  const save = { v: 1, ch: 2, step: { 1: 7 }, done: { 1: "festa" }, diffSet: true, intro: { ch1: 1, cc_prato: 1, cc_mondo: 1, cc_torre: 1, cc_bosco: 1 }, st: { gruppo: 5, luce: 2 }, flags: { party_cc_lyra: true, party_cc_fosco: true, cristallo_cc_bosco: true, cc_mantello: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__cronache.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  for (const z of ["cc_porto", "cc_isola"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await L.goAct(page, 5, 10); await L.advance(page); if ((await L.zone(page)) !== "cc_porto") errors.push("non si entra nel porto");
  if (w === 390) await L.shot(page, "cc_porto");
  await L.talk(page, "cc_capitana"); await L.advance(page);
  await L.talk(page, "cc_rubi"); await L.advance(page, ["Ti credo"]);
  await L.talk(page, "cc_capitana"); await L.advance(page);
  await L.goAct(page, 16, 0); await L.advance(page); if ((await L.zone(page)) !== "cc_mondo") errors.push("non si torna sulla mappa");
  const sea = await page.evaluate(() => window.__tr.TW.map[6][2]); if (sea !== "U") errors.push("l'isola non compare sulla mappa: " + sea);
  await page.evaluate(() => { const TW = window.__tr.TW; TW.x = 2 * 16 + 8; TW.y = 9 * 16 + 12; }); await page.waitForTimeout(500);
  if (w === 390) await L.shot(page, "cc_nave");
  await L.goAct(page, 2, 6); await L.advance(page); if ((await L.zone(page)) !== "cc_isola") errors.push("non si sbarca sull'isola: " + (await L.zone(page)));
  const party = await page.evaluate(() => window.__tr.TW.z.npcs.filter((n) => n.ghost).map((n) => n.id)); if (party.length !== 3) errors.push("il gruppo non è di quattro: " + JSON.stringify(party));
  if (w === 390) await L.shot(page, "cc_isola");
  await L.talk(page, "cc_muto"); await page.evaluate(() => window.T_.click("Gioca contro i Silenti")); await page.waitForTimeout(500); await atbStart(page); await page.waitForTimeout(800);
  await atbEnd(page, 2, 1); await L.advance(page);
  await L.talk(page, "cc_muto"); await L.advance(page, ["Raccontami del tuo re"]);
  const i = await L.info(page); if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify(i.step)); if (!i.flags.cristallo_cc_isola) errors.push("cristallo del mare non acceso");
  L.check(`Le Cronache del Pallone di Cristallo · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const save = { v: 1, ch: 3, step: { 1: 7, 2: 7 }, done: { 1: "festa", 2: "re" }, diffSet: true, intro: { ch1: 1, ch2: 1, cc_prato: 1, cc_mondo: 1, cc_torre: 1, cc_bosco: 1, cc_porto: 1, cc_isola: 1 }, st: { gruppo: 9, luce: 5 }, flags: { party_cc_lyra: true, party_cc_fosco: true, party_cc_rubi: true, cristallo_cc_bosco: true, cristallo_cc_isola: true, cc_mantello: true, cc_nave: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__cronache.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  await L.talk(page, "cc_ermete"); await L.advance(page);
  await page.evaluate(() => window.__cronache._dbg.K.go("cc_mondo", 10, 21)); await page.waitForTimeout(400); await L.advance(page);
  const m = await page.evaluate(() => [window.__tr.TW.map[5][40], window.__tr.TW.map[3][22]]); if (m.join("") !== "FC") errors.push("vulcano e castello non sulla mappa: " + m.join(""));
  for (const z of ["cc_vulcano", "cc_stelle"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await L.goAct(page, 22, 3); await L.advance(page); if ((await L.zone(page)) !== "cc_mondo") errors.push("il castello si apre prima del fuoco");
  await L.goAct(page, 40, 5); await L.advance(page); if ((await L.zone(page)) !== "cc_vulcano") errors.push("non si entra nel vulcano: " + (await L.zone(page)));
  if (w === 390) await L.shot(page, "cc_vulcano");
  await L.talk(page, "cc_fabbra"); await L.advance(page, ["Lyra. Tiralo tu"]);
  let i = await L.info(page); if (!i.flags.cristallo_cc_vulcano || !i.flags.cc_lyra_tira) errors.push("rigore di Lyra non registrato");
  await L.goAct(page, 15, 19); await L.advance(page); await L.goAct(page, 22, 3); await L.advance(page); if ((await L.zone(page)) !== "cc_stelle") errors.push("non si sale allo stadio delle stelle: " + (await L.zone(page)));
  if (w === 390) await L.shot(page, "cc_stelle");
  await L.talk(page, "cc_re"); await page.evaluate(() => window.T_.click("Gioca la partita finale")); await page.waitForTimeout(500); await atbStart(page); await page.waitForTimeout(800);
  const pn = await page.evaluate(() => window.__atb.state.party.length); if (pn !== 4) errors.push("in finale il gruppo non è di quattro: " + pn);
  await atbEnd(page, 1, 0); await L.advance(page);
  i = await L.info(page); if (!i.flags.cristallo_cc_stelle) errors.push("cristallo delle stelle non acceso");
  // il segreto: tutte le schegge del mondo
  await page.evaluate(() => { const A = window.__tr, r = A.trRec(), Z = A.TRZ; ["cc_mondo", "cc_prato", "cc_bosco", "cc_porto", "cc_isola", "cc_vulcano", "cc_stelle"].forEach((z) => { r.got[z] = (Z[z].items || []).map((_, k) => k); }); });
  const ends = ["Le schegge che hai raccolto", "Le stagioni ripartono", "Lyra, resta", "Le abbiamo viste tutte"];
  for (const e of ends) {
    await page.evaluate(() => { const K = window.__cronache._dbg.K; K.setStep(3, 3); K.enterZone("cc_stelle"); }); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "cc_re"); await L.advance(page, [e]); if (w === 390 && e === ends[0]) await L.shot(page, "cc_fine");
  }
  i = await L.info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate(() => window.__cronache._dbg.K.mem().ends.length); if (n < 4) errors.push("finali trovati " + n + " su 4");
  // la grotta segreta: si apre dopo aver finito la saga, con il boss ATB
  await page.evaluate(() => window.__cronache._dbg.K.go("cc_mondo", 31, 15)); await page.waitForTimeout(400); await L.advance(page);
  await L.goAct(page, 31, 14); await L.advance(page); if ((await L.zone(page)) !== "cc_grotta") errors.push("la grotta non si apre: " + (await L.zone(page)));
  { const bad = await L.reachAll(page, "cc_grotta"); if (bad.length) errors.push("cc_grotta irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "cc_grotta");
  await L.talk(page, "cc_eco"); await page.evaluate(() => window.T_.click("Sfida il Guardiano")); await page.waitForTimeout(500); await atbStart(page); await page.waitForTimeout(300);
  await atbEnd(page, 2, 1); await L.advance(page);
  if (!(await L.info(page)).flags.cc_eco_vinto) errors.push("boss dell'Eco non registrato");
  L.check(`Le Cronache del Pallone di Cristallo · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); })().catch((e) => { console.error("✗ cronache:", e.message); process.exit(1); });
