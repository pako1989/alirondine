// tests/cavallo.cjs - «Il Cavallo Star»: il motore Ciak! Si Gioca (copione o improvvisa, il ciak a tempo, le papere e i ciak
// di riserva, le stelle del regista), la Rassegna Stampa (il giornale che gira e i titoli nel diario), le sagome animali,
// le partite a scelta, i 3 capitoli e i 4 finali, il cabinato della Sala Giochi
const L = require("./lib.cjs");
const MOD = { mod: "__cavallo", key: "ali-di-rondine.cavallo" };
const K_ = "window.__cavallo._dbg.K";
const info = (p) => L.info(p);
const ckStart = async (p) => { await p.waitForTimeout(300); const ok = await p.evaluate(() => { const b = document.querySelector(".ckOv .ov .goB"); if (b) { b.click(); return true; } return false; }); await p.waitForTimeout(250); return ok; };
const ckEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__ciak.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await p.evaluate(() => { const b = document.querySelector(".ckOv .ov .goB"); if (b) b.click(); }); await p.waitForTimeout(250); };
// il giornale: aspetta che esca (gira), lo fotografa se serve, e lo chiude
async function news(p, shotName) { for (let i = 0; i < 40 && !(await p.evaluate(() => !!document.querySelector(".csNews"))); i++) await p.waitForTimeout(100); const ok = await p.evaluate(() => !!document.querySelector(".csNews")); if (shotName) { await p.waitForTimeout(1200); await L.shot(p, shotName); } await p.evaluate(() => { const b = document.querySelector(".csNews button"); if (b) b.click(); }); await p.waitForTimeout(250); return ok; }
const pick = async (p, re) => { await p.waitForTimeout(150); const r = await p.evaluate((re) => window.T_.click(re), re); await p.waitForTimeout(250); return r; };
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__cavallo.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  if (w === 390) await L.shot(page, "cs_colle");
  { const bad = await L.reachAll(page, "cs_colle"); if (bad.length) errors.push("cs_colle irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "cs_lucilla"); await L.advance(page);
  await L.goAct(page, 21, 11); await L.advance(page); if ((await L.zone(page)) !== "cs_villa") errors.push("non si entra nella villa");
  { const bad = await L.reachAll(page, "cs_villa"); if (bad.length) errors.push("cs_villa irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "cs_villa");
  await L.talk(page, "cs_baldo"); await page.evaluate(() => window.T_.click("Gira il provino")); await page.waitForTimeout(500);
  if (!(await ckStart(page))) errors.push("Ciak! Si Gioca non si apre");
  // un comando vero: «Segui il copione», poi CIAK! con il segno nella zona verde
  await page.evaluate(() => document.querySelector(".ckOv .pad .go").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))); await page.waitForTimeout(200);
  if (w === 390) await L.shot(page, "cs_ciak");
  await page.evaluate(() => { const S = window.__ciak.state; S.bar = (S.zone[0] + S.zone[1]) / 2; S.spd = 0; document.querySelector(".ckOv .pad .go").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); }); await page.waitForTimeout(250);
  { const st = await page.evaluate(() => { const S = window.__ciak.state; return [S.data.scene, S.data.copione, S.stars[0], S.i]; }); if (st[0] !== 1 || st[1] !== 1 || !(st[2] >= 4) || st[3] !== 1) errors.push("Ciak! Si Gioca, scena col copione: " + JSON.stringify(st)); }
  // e una papera: il ciak fuori tempo si rifà (un ciak di riserva in meno)
  await page.evaluate(() => { window.__ciak.state.next(); }); await page.waitForTimeout(150); await page.evaluate(() => { const S = window.__ciak.state; S.follow(); S.ciak(false); }); await page.waitForTimeout(200);
  { const st = await page.evaluate(() => { const S = window.__ciak.state; return [S.takes, S.data.papere, S.phase]; }); if (st[0] !== 2 || st[1] !== 1) errors.push("Ciak! Si Gioca, la papera: " + JSON.stringify(st)); }
  await ckEnd(page, 2, 1); await L.advance(page);
  let i = await info(page); if (i.step[1] !== 2) errors.push("dopo il provino: " + JSON.stringify(i.step));
  await page.evaluate((k) => eval(k).go("cs_colle", 21, 12), K_); await page.waitForTimeout(500); await L.advance(page);
  await L.stubMatch(page, true); await L.talk(page, "cs_ugo"); await page.evaluate(() => window.T_.click("Un'altra modalità")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "cs_piscina") errors.push("partitella in piscina non a scelta");
  await L.talk(page, "cs_nina"); await pick(page, w === 390 ? "È bravo" : "il più grande");
  if (!(await news(page, w === 390 ? "cs_giornale" : null))) errors.push("il giornale non esce");
  await L.advance(page);
  i = await info(page); if (!i.done[1] || !(w === 390 ? i.flags.cs_t_onesto : i.flags.cs_t_lodi)) errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Il Cavallo Star · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const fl = { [w === 390 ? "cs_onesto" : "cs_lodi"]: true, [w === 390 ? "cs_t_onesto" : "cs_t_lodi"]: true };
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: w === 390 ? "onesto" : "lodi" }, diffSet: true, intro: { ch1: 1, cs_colle: 1, cs_villa: 1 }, st: { fama: 2, verita: 3 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__cavallo.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  if (w === 390) await L.shot(page, "cs_studios");
  { const bad = await L.reachAll(page, "cs_studios"); if (bad.length) errors.push("cs_studios irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "cs_regista"); await L.advance(page);
  await L.goAct(page, 28, 6); await L.advance(page); if ((await L.zone(page)) !== "cs_mensa") errors.push("non si entra in mensa");
  { const bad = await L.reachAll(page, "cs_mensa"); if (bad.length) errors.push("cs_mensa irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "cs_viola"); await L.advance(page);
  await page.evaluate((k) => eval(k).go("cs_studios", 17, 19), K_); await page.waitForTimeout(500); await L.advance(page);
  await L.stubMatch(page, true); await L.talk(page, "cs_ugo"); await page.evaluate(() => window.T_.click("Un'altra modalità")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "cs_comparse") errors.push("partita contro le comparse non a scelta");
  await L.talk(page, "cs_max"); await page.evaluate(() => window.T_.click("Gioca la partita di beneficenza")); await page.waitForTimeout(500);
  if (!(await ckStart(page))) errors.push("la partita di beneficenza non si apre");
  await ckEnd(page, 2, 1); if (!(await news(page))) errors.push("il giornale della beneficenza non esce"); await L.advance(page);
  let i = await info(page); if (i.step[2] !== 3 || !i.flags.cs_t_beneficenza) errors.push("dopo la beneficenza: " + JSON.stringify([i.step, i.flags.cs_t_beneficenza]));
  await L.talk(page, "cs_lucilla"); await pick(page, w === 390 ? "verità, con Viola" : "Era una battuta");
  await news(page); await L.advance(page);
  i = await info(page); if (!i.done[2] || !(w === 390 ? i.flags.cs_verita : i.flags.cs_copre)) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  // la Rassegna Stampa nel diario
  const j = await page.evaluate(() => { const K = window.__cavallo._dbg.K; return K.F.is("cs_t_verita") || K.F.is("cs_t_copre"); }); if (!j) errors.push("il titolo non finisce nella rassegna stampa");
  L.check(`Il Cavallo Star · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const fl = { [w === 390 ? "cs_verita" : "cs_copre"]: true, cs_onesto: true };
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 9 }, done: { 1: "onesto", 2: w === 390 ? "verita" : "copre" }, diffSet: true, intro: { ch1: 1, ch2: 1, cs_colle: 1, cs_studios: 1 }, st: { fama: 4, verita: 6 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__cavallo.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  if (w === 390) await L.shot(page, "cs_teatro");
  { const bad = await L.reachAll(page, "cs_teatro"); if (bad.length) errors.push("cs_teatro irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "cs_lucilla"); await news(page); await L.advance(page);
  await L.goAct(page, 25, 11); await L.advance(page); if ((await L.zone(page)) !== "cs_camerino") errors.push("non si entra nel camerino");
  if (w === 390) await L.shot(page, "cs_camerino");
  await L.talk(page, "cs_baldo"); await L.advance(page, [w === 390 ? "Improvvisiamo" : "Segui il copione"]);
  await page.evaluate((k) => eval(k).go("cs_teatro", 15, 19), K_); await page.waitForTimeout(500); await L.advance(page);
  await L.talk(page, "cs_regista"); await page.evaluate(() => window.T_.click("Vai in onda")); await page.waitForTimeout(500);
  const tk = await page.evaluate(() => window.__ciak.state && [window.__ciak.state.takes, window.__ciak.state.script.length]); if (!tk || tk[0] !== (w === 390 ? 2 : 1) || tk[1] !== 7) errors.push("la diretta: ciak di riserva e copione: " + JSON.stringify(tk));
  await ckStart(page); await ckEnd(page, w === 390 ? 3 : 1, w === 390 ? 1 : 3); await L.advance(page);
  if (w === 390) await L.shot(page, "cs_finale");
  let i = await info(page); if (i.step[3] !== 3 || !!i.flags.cs_vinta !== (w === 390)) errors.push("dopo la diretta: " + JSON.stringify([i.step, i.flags.cs_vinta]));
  await page.evaluate(() => { const A = window.__tr, r = A.trRec(), Z = A.TRZ; ["cs_colle", "cs_studios", "cs_teatro"].forEach((z) => { r.got[z] = ((Z[z] && Z[z].items) || []).map((_, k) => k); }); });
  const ends = [["cosa c'è nell'ultima cassetta", { cs_media: 4 }], ["Abbiamo vinto davvero", { cs_vinta: true }], ["Gli ascolti sono altissimi", { cs_vinta: false }], ["il libro è pronto", { cs_verita: true }]];
  for (const [e, f] of ends) {
    await page.evaluate(([k, f]) => { const K = eval(k); Object.keys(f).forEach((x) => K.F.set(x, f[x])); K.setStep(3, 3); K.enterZone("cs_teatro"); }, [K_, f]); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "cs_lucilla"); await L.advance(page, [e]);
  }
  i = await info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate((k) => eval(k).mem().ends.length, K_); if (n < 4) errors.push("finali trovati " + n + " su 4");
  const m = await page.evaluate(() => { const x = window.__salone.machine("ciak"); return x && x.eng; }); if (m !== "__ciak") errors.push("cabinato di Ciak! Si Gioca mancante");
  L.check(`Il Cavallo Star · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); })().catch((e) => { console.error("✗ cavallo:", e.stack); process.exit(1); });
