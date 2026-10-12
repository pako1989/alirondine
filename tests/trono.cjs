// tests/trono.cjs - «Il Trono di Cuoio»: il Concilio (patti, corvi, tradimenti), la credibilità che passa da una partita
// all'altra, il voto del Consiglio, le partite a scelta, i capitoli e i 4 finali, il cabinato della Sala Giochi
const L = require("./lib.cjs");
const MOD = { mod: "__trono", key: "ali-di-rondine.trono" };
const coBtn = (p) => p.evaluate(() => { const b = document.querySelector(".coOv .ov button"); if (b) { b.click(); return true; } return false; });
const coEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__concilio.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await coBtn(p); await p.waitForTimeout(250); };
const vote = async (p) => { await p.waitForTimeout(300); const n = await p.evaluate(() => document.querySelectorAll(".tcVote .seat i.si").length); await p.evaluate(() => document.querySelector(".tcVote button").click()); await p.waitForTimeout(200); return n; };
const info = (p) => L.info(p);
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__trono.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  { const bad = await L.reachAll(page, "tc_rocca"); if (bad.length) errors.push("tc_rocca irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "tc_rocca");
  await L.goAct(page, 15, 7); await L.advance(page); if ((await L.zone(page)) !== "tc_sala") errors.push("non si entra nella Sala Grande: " + (await L.zone(page)));
  { const bad = await L.reachAll(page, "tc_sala"); if (bad.length) errors.push("tc_sala irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "tc_ubaldo"); await L.advance(page);
  if ((await page.evaluate(() => window.__trono._dbg.K.cred())) !== 5) errors.push("credibilità iniziale sbagliata");
  await L.goAct(page, 10, 12); await L.advance(page);
  await L.talk(page, "tc_brunilde"); await L.advance(page, ["Insegnami"]);
  // la partita secondaria: la modalità la sceglie il giocatore
  await L.stubMatch(page, true); await L.talk(page, "tc_gualtiero"); await page.evaluate(() => window.T_.click("Allenamento nel cortile")); await page.waitForTimeout(300); await L.advance(page);
  const lm = await page.evaluate(() => window.__lastMatch || {}); if (lm.id !== "tc_cortile" || !/,/.test(lm.alt || "")) errors.push("allenamento non a scelta: " + JSON.stringify(lm));
  // il Concilio: un patto al tavolo, il corvo, poi il campo
  await L.talk(page, "tc_ardo"); await page.evaluate(() => window.T_.click("Siedi al tavolo del Concilio")); await page.waitForTimeout(500); await coBtn(page); await page.waitForTimeout(200);
  const ravens = await page.evaluate(() => window.__concilio.state.ravens); if (ravens !== 1) errors.push("il corvo di Brunilde non c'è: " + ravens);
  await page.evaluate(() => window.__concilio.state.propose("centro")); await page.waitForTimeout(100);
  if (w === 390) await L.shot(page, "tc_tavolo");
  await page.evaluate(() => { const S = window.__concilio.state; S.toField(); S.play(0); }); await page.waitForTimeout(200);
  const st = await page.evaluate(() => { const S = window.__concilio.state; return [S.pacts.join(), S.turn, S.data.tradimenti]; }); if (st.join("|") !== "centro|1|0") errors.push("Concilio: " + st.join("|"));
  if (w === 390) await L.shot(page, "tc_campo");
  await coEnd(page, 2, 0); await L.advance(page);
  let i = await info(page); if (!i.flags.tc_pietra_amica) errors.push("Pietrabruna non è amica dopo un Concilio leale");
  await L.goAct(page, 15, 7); await L.advance(page); await L.talk(page, "tc_ubaldo"); await L.advance(page, ["Lo porterò io"]);
  i = await info(page); if (!i.done[1] || !i.flags.tc_riconosciuto) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  if ((await page.evaluate(() => window.__trono._dbg.K.cred())) !== 6) errors.push("credibilità dopo il capitolo 1: " + (await page.evaluate(() => window.__trono._dbg.K.cred())));
  L.check(`Il Trono di Cuoio · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "nome" }, diffSet: true, intro: { ch1: 1, tc_rocca: 1, tc_sala: 1 }, st: {}, flags: { tc_cred: 6, tc_corvo: true, tc_pietra_amica: true, tc_riconosciuto: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__trono.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  { const bad = await L.reachAll(page, "tc_capitale"); if (bad.length) errors.push("tc_capitale irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "tc_capitale");
  await L.goAct(page, 16, 7); await L.advance(page); if ((await L.zone(page)) !== "tc_consiglio") errors.push("non si entra nel Consiglio");
  { const bad = await L.reachAll(page, "tc_consiglio"); if (bad.length) errors.push("tc_consiglio irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "tc_ottavia"); await L.advance(page);
  // il voto, subito: solo Pietrabruna dice sì → respinto
  await L.talk(page, "tc_ottavia"); await page.evaluate(() => window.T_.click("Convoca il Consiglio")); await page.waitForTimeout(400);
  if (w === 390) { await page.waitForTimeout(4500); await L.shot(page, "tc_voto"); }
  let n = await vote(page); if (n !== 1) errors.push("primo voto: sì " + n); await L.advance(page);
  if ((await info(page)).step[2] !== 1) errors.push("il Consiglio doveva respingere");
  await L.goAct(page, 10, 12); await L.advance(page);
  await L.talk(page, "tc_inverno"); await L.advance(page, ["Raccontami"]);
  await L.talk(page, "tc_ysolde"); await L.advance(page, ["Non vendo"]);
  await L.talk(page, "tc_marino"); await page.evaluate(() => window.T_.click("Siedi al tavolo del Concilio")); await page.waitForTimeout(500); await coBtn(page); await page.waitForTimeout(200);
  const hand = await page.evaluate(() => [window.__concilio.state.ravens, window.__concilio.state.o.cards.join()]); if (hand[0] !== 2 || !/ostaggio/.test(hand[1])) errors.push("Salmastra: " + hand);
  await coEnd(page, 3, 1); await L.advance(page);
  await L.stubMatch(page, true); await L.talk(page, "tc_fiamma"); await page.evaluate(() => window.T_.click("Sfida Rovoardente")); await page.waitForTimeout(300); await L.advance(page);
  const f = (await info(page)).flags; if (!f.tc_salm_vinta || !f.tc_fiamma_vinta || !f.tc_barriera || !f.tc_ysolde_ok) errors.push("voti mancanti: " + JSON.stringify(f));
  await L.goAct(page, 16, 7); await L.advance(page); await L.talk(page, "tc_ottavia"); await page.evaluate(() => window.T_.click("Convoca il Consiglio")); await page.waitForTimeout(400);
  n = await vote(page); if (n !== 5) errors.push("secondo voto: sì " + n); await L.advance(page);
  await L.talk(page, "tc_ysolde"); await L.advance(page, ["Accetto il patto"]);
  const i = await info(page); if (!i.done[2] || !i.flags.tc_ysolde_patto) errors.push("capitolo 2 non concluso: " + JSON.stringify(i.step));
  L.check(`Il Trono di Cuoio · capitolo 2 e il voto del Consiglio (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "nome", 2: "corvo" }, diffSet: true, intro: { ch1: 1, ch2: 1, tc_rocca: 1, tc_sala: 1, tc_capitale: 1, tc_consiglio: 1 }, st: {}, flags: { tc_cred: 8, tc_corvo: true, tc_pietra_amica: true, tc_riconosciuto: true, tc_barriera: true, tc_ysolde_patto: true, tc_brunilde_alleata: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__trono.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  { const bad = await L.reachAll(page, "tc_arena"); if (bad.length) errors.push("tc_arena irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "tc_arena");
  await L.stubMatch(page, true); await L.talk(page, "tc_araldo"); await page.evaluate(() => window.T_.click("Gioca la semifinale")); await page.waitForTimeout(300); await L.advance(page);
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "tc_semi") errors.push("semifinale non avviata");
  await L.talk(page, "tc_ottavia"); await page.evaluate(() => window.T_.click("Siedi al tavolo della finale")); await page.waitForTimeout(500); await coBtn(page); await page.waitForTimeout(200);
  const o = await page.evaluate(() => { const S = window.__concilio.state; return [S.ravens, S.spied, !!S.o.foresee, S.nT]; }); if (o.join() !== "4,true,true,10") errors.push("finale: " + o);
  // la piuma di Ysolde: in difesa, se la reggente tradisce, il messaggio lo dice
  await page.evaluate(() => { const S = window.__concilio.state; S.propose("centro"); S.toField(); S.play(0); }); await page.waitForTimeout(100);
  await page.evaluate(() => document.querySelector(".coOv .pad button").dispatchEvent(new PointerEvent("pointerdown"))); await page.waitForTimeout(100);
  await coEnd(page, 2, 1); await L.advance(page);
  if ((await L.zone(page)) !== "tc_trono") errors.push("dopo la finale non si sale al Trono: " + (await L.zone(page)));
  { const bad = await L.reachAll(page, "tc_trono"); if (bad.length) errors.push("tc_trono irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "tc_trono");
  await page.evaluate(() => { const A = window.__tr, r = A.trRec(), Z = A.TRZ; ["tc_rocca", "tc_capitale", "tc_arena"].forEach((z) => { r.got[z] = (Z[z].items || []).map((_, k) => k); }); });
  const ends = ["Prendi l'ago", "Siediti sul Trono", "Il Trono può aspettare", "Nessuno siederà qui"];
  for (const e of ends) {
    await page.evaluate(() => { const K = window.__trono._dbg.K; K.setStep(3, 2); K.enterZone("tc_trono"); }); await page.waitForTimeout(400); await L.advance(page);
    await L.goAct(page, 10, 3); await L.advance(page, [e]); if (w === 390 && e === ends[0]) await L.shot(page, "tc_fine");
  }
  const i = await info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate(() => window.__trono._dbg.K.mem().ends.length); if (n < 4) errors.push("finali trovati " + n + " su 4");
  // il cabinato della Sala Giochi
  const m = await page.evaluate(() => { const x = window.__salone.machine("concilio"); return x && x.eng; }); if (m !== "__concilio") errors.push("cabinato del Concilio mancante");
  L.check(`Il Trono di Cuoio · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); })().catch((e) => { console.error("✗ trono:", e.message); process.exit(1); });
