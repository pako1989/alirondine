// tests/campetto.cjs - «Dal Campetto al Mondiale»: il Duello Cinematico (duelli, grinta, tiri speciali), l'allenamento a tempo
// (K.allena), le partite a scelta, i capitoli e i 4 finali, il cabinato della Sala Giochi
const L = require("./lib.cjs");
const MOD = { mod: "__campetto", key: "ali-di-rondine.campetto" };
const duBtn = (p) => p.evaluate(() => { const b = document.querySelector(".duOv .ov button"); if (b) { b.click(); return true; } return false; });
const duEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__duello.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await duBtn(p); await p.waitForTimeout(250); };
const trainWin = async (p) => { await p.waitForTimeout(300); const ok = await p.evaluate(() => !!document.querySelector(".cmTrain")); await p.evaluate(() => window.__campetto._dbg.K._train.win()); await p.waitForTimeout(300); return ok; };
const info = (p) => L.info(p);
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__campetto.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  { const bad = await L.reachAll(page, "cm_riva"); if (bad.length) errors.push("cm_riva irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "cm_riva");
  // l'allenamento: una lancetta, tre centri di fila (un calcio vero, poi la vittoria)
  await L.talk(page, "cm_bastiano"); await page.evaluate(() => window.T_.click("Insegnamelo")); await page.waitForTimeout(400);
  if (w === 390) await L.shot(page, "cm_allenamento");
  await page.evaluate(() => window.__campetto._dbg.K._train.kick()); await page.waitForTimeout(100);
  if (!(await trainWin(page))) errors.push("l'allenamento non si apre"); await L.advance(page);
  let i = await info(page); if (!i.flags.cm_sp_aquila) errors.push("Tiro dell'Aquila non imparato");
  await L.talk(page, "cm_gino"); await L.advance(page); await L.talk(page, "cm_pio"); await L.advance(page, ["Sono io"]);
  if ((await info(page)).step[1] !== 2) errors.push("la squadra non è pronta");
  // il Duello Cinematico: un duello vero, poi il risultato
  await L.talk(page, "cm_saverio"); await page.evaluate(() => window.T_.click("Gioca contro il Collegio")); await page.waitForTimeout(500); await duBtn(page); await page.waitForTimeout(300);
  const sp = await page.evaluate(() => window.__duello.state.o.specials.map((x) => x.id).join()); if (sp !== "aquila") errors.push("tiri speciali in partita: " + sp);
  if (w === 390) await L.shot(page, "cm_duello");
  await page.evaluate(() => window.__duello.state.act("drib")); await page.waitForTimeout(150);
  const g0 = await page.evaluate(() => window.__duello.state.guts); if (g0 !== 92) errors.push("la grinta non cala col dribbling: " + g0);
  if (w === 390) await L.shot(page, "cm_vignetta");
  await duEnd(page, 2, 0); await L.advance(page);
  await L.talk(page, "cm_bastiano"); await L.advance(page, ["Il Mondiale"]);
  i = await info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  L.check(`Dal Campetto al Mondiale · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "mondiale" }, diffSet: true, intro: { ch1: 1, cm_riva: 1 }, st: {}, flags: { cm_sp_aquila: true, cm_team_gino: true, cm_team_pio: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__campetto.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  for (const z of ["cm_provincia"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await L.goAct(page, 16, 5); await L.advance(page); if ((await L.zone(page)) !== "cm_spogliatoio") errors.push("non si entra nello spogliatoio"); { const bad = await L.reachAll(page, "cm_spogliatoio"); if (bad.length) errors.push("spogliatoio irraggiungibile: " + bad.join(", ")); }
  await L.goAct(page, 10, 12); await L.advance(page);
  if (w === 390) await L.shot(page, "cm_provincia");
  await L.talk(page, "cm_bastiano"); await L.advance(page);
  await L.stubMatch(page, true); await L.talk(page, "cm_ponte_a"); await page.evaluate(() => window.T_.click("Sfida i gemelli Ponte")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  const lm = await page.evaluate(() => window.__lastMatch || {}); if (lm.id !== "cm_ponte" || !/,/.test(lm.alt || "")) errors.push("partita dei gemelli non a scelta: " + JSON.stringify(lm));
  await trainWin(page); await L.advance(page);
  if (!(await info(page)).flags.cm_sp_catapulta) errors.push("Catapulta non imparata");
  await L.talk(page, "cm_leone"); await page.evaluate(() => window.T_.click("Gioca la finale")); await page.waitForTimeout(500); await duBtn(page); await page.waitForTimeout(200);
  const o = await page.evaluate(() => { const S = window.__duello.state; return [S.o.specials.length, S.o.opp.ace && S.o.opp.ace.special]; }); if (o.join() !== "2,Tiro del Leone") errors.push("finale: " + o);
  await duEnd(page, 3, 2); await L.advance(page);
  await L.talk(page, "cm_leone"); await L.advance(page, ["Andiamoci insieme"]);
  const i = await info(page); if (!i.done[2] || !i.flags.cm_leone_amico) errors.push("capitolo 2 non concluso: " + JSON.stringify(i.step));
  L.check(`Dal Campetto al Mondiale · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const fl = { cm_sp_aquila: true, cm_sp_catapulta: true, cm_team_gino: true, cm_team_pio: true, cm_leone_amico: true, cm_rivale_saverio: true };
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "rivale", 2: "insieme" }, diffSet: true, intro: { ch1: 1, ch2: 1, cm_riva: 1, cm_provincia: 1 }, st: { amicizia: 8, sogno: 6 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__campetto.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  { const bad = await L.reachAll(page, "cm_ritiro"); if (bad.length) errors.push("cm_ritiro irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "cm_ritiro");
  await L.talk(page, "cm_ct"); await L.advance(page);
  await L.talk(page, "cm_dario"); await page.evaluate(() => window.T_.click("Prova la Combinazione")); await trainWin(page); await L.advance(page);
  await L.stubMatch(page, true); await L.talk(page, "cm_ct"); await page.evaluate(() => window.T_.click("Gioca la partita del girone")); await page.waitForTimeout(400); await L.advance(page);
  if ((await L.zone(page)) !== "cm_stadio") errors.push("dopo il girone non si va allo stadio: " + (await L.zone(page)));
  { const bad = await L.reachAll(page, "cm_stadio"); if (bad.length) errors.push("cm_stadio irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "cm_barone"); await page.evaluate(() => window.T_.click("Gioca la finale del Mondiale")); await page.waitForTimeout(500); await duBtn(page); await page.waitForTimeout(200);
  const o = await page.evaluate(() => { const S = window.__duello.state; return [S.o.specials.length, S.gutsMax, S.o.keeperName]; }); if (o.join() !== "3,120,Saverio Muro") errors.push("finale del Mondiale: " + o);
  await duEnd(page, 2, 1); await L.advance(page);
  if (w === 390) await L.shot(page, "cm_mondiale");
  await page.evaluate(() => { const A = window.__tr, r = A.trRec(), Z = A.TRZ; ["cm_riva", "cm_provincia", "cm_ritiro"].forEach((z) => { r.got[z] = (Z[z].items || []).map((_, k) => k); }); });
  const ends = ["Prendi il pallone della finale", "Alza la coppa", "Leone, alziamola", "Bastiano, torniamo"];
  for (const e of ends) {
    await page.evaluate(() => { const K = window.__campetto._dbg.K; K.setStep(3, 4); K.enterZone("cm_stadio"); }); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "cm_bastiano"); await L.advance(page, [e]);
  }
  const i = await info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate(() => window.__campetto._dbg.K.mem().ends.length); if (n < 4) errors.push("finali trovati " + n + " su 4");
  const m = await page.evaluate(() => { const x = window.__salone.machine("duello"); return x && x.eng; }); if (m !== "__duello") errors.push("cabinato del Duello mancante");
  L.check(`Dal Campetto al Mondiale · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); })().catch((e) => { console.error("✗ campetto:", e.message); process.exit(1); });
