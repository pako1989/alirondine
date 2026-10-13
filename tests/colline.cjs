// tests/colline.cjs - «Master League delle Colline»: la Lavagna Tattica (modulo, caselle, istruzioni, pagelle), il Mercato
// (crediti, figurine, cessioni), la classifica, le partite a scelta, i capitoli e i 4 finali, il cabinato della Sala Giochi
const L = require("./lib.cjs");
const MOD = { mod: "__colline", key: "ali-di-rondine.colline" };
const lvBtn = (p) => p.evaluate(() => { const b = document.querySelector(".lvOv .ov button"); if (b) { b.click(); return true; } return false; });
const lvEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__lavagna.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await lvBtn(p); await p.waitForTimeout(250); };
const closeOv = (p) => p.evaluate(() => { const b = document.querySelector(".mlMkt .done"); if (b) { b.click(); return true; } return false; });
const info = (p) => L.info(p);
// dopo la partita: la scena, poi il tabellone della classifica; lo si chiude e si torna a camminare
const tabella = async (p) => { for (let k = 0; k < 30; k++) { if (await closeOv(p)) { await p.waitForTimeout(300); return true; } await p.evaluate(() => window.T_.click("^Continua")); await p.waitForTimeout(150); } return false; };
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__colline.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  { const bad = await L.reachAll(page, "ml_colle"); if (bad.length) errors.push("ml_colle irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "ml_colle");
  await L.talk(page, "ml_bice"); await L.advance(page);
  if ((await page.evaluate(() => window.__colline._dbg.K.crediti())) !== 300) errors.push("crediti iniziali sbagliati");
  await L.goAct(page, 13, 4); await L.advance(page); if ((await L.zone(page)) !== "ml_bar") errors.push("non si entra nel bar");
  { const bad = await L.reachAll(page, "ml_bar"); if (bad.length) errors.push("ml_bar irraggiungibile: " + bad.join(", ")); }
  // il mercato: Nonno Ermes gratis, Ines a 90 crediti, poi una cessione
  await L.talk(page, "ml_pino"); await page.evaluate(() => window.T_.click("Apri il mercato")); await page.waitForTimeout(300);
  if (w === 390) await L.shot(page, "ml_mercato");
  await page.evaluate(() => { const M = window.__colline._dbg.K._mkt; M.buy("ermes"); M.buy("ines"); M.buy("ottavio"); M.buy("ottavio"); });
  const cr = await page.evaluate(() => window.__colline._dbg.K.crediti()); if (cr !== 300 - 90 - 160 + 80) errors.push("crediti dopo il mercato: " + cr);
  await closeOv(page); await page.waitForTimeout(200); await L.advance(page);
  const rosa = await page.evaluate(() => window.__colline._dbg.K.rosa().map((p) => p.id).join()); if (!/ermes/.test(rosa) || !/ines/.test(rosa) || /ottavio/.test(rosa)) errors.push("rosa: " + rosa);
  await L.goAct(page, 10, 12); await L.advance(page);
  // allenamento e prima partita alla lavagna
  await L.talk(page, "ml_marta"); await page.evaluate(() => window.T_.click("Allenamento al campo")); await page.waitForTimeout(200); await L.advance(page);
  await L.talk(page, "ml_marta"); await page.evaluate(() => window.T_.click("Scendi in campo")); await page.waitForTimeout(500); await lvBtn(page); await page.waitForTimeout(300);
  const sq = await page.evaluate(() => window.__lavagna.state.o.squad.length); if (sq !== 10) errors.push("la rosa in lavagna: " + sq);
  if (w === 390) await L.shot(page, "ml_lavagna");
  await page.evaluate(() => { const S = window.__lavagna.state; S.setInstr("pressing"); S.kickoff(); }); await page.waitForTimeout(1500);
  const seg = await page.evaluate(() => window.__lavagna.state.seg); if (seg !== 1) errors.push("il primo blocco non parte");
  if (w === 390) await L.shot(page, "ml_gesso");
  await lvEnd(page, 2, 1); await page.waitForTimeout(300);
  for (let k = 0; k < 30 && !(await page.evaluate(() => !!document.querySelector(".mlTab"))); k++) { await page.evaluate(() => window.T_.click("^Continua")); await page.waitForTimeout(150); }
  if (w === 390) await L.shot(page, "ml_classifica");
  if (!(await tabella(page))) errors.push("la classifica non compare"); await L.advance(page);
  await L.talk(page, "ml_bice"); await L.advance(page, ["Con i ragazzi del paese"]);
  const i = await info(page); if (!i.done[1] || !i.flags.ml_battuta_pietrafitta) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  L.check(`Master League delle Colline · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "paese" }, diffSet: true, intro: { ch1: 1, ml_colle: 1, ml_bar: 1 }, st: { paese: 4, fiducia: 1 }, flags: { ml_crediti: 300, ml_in_ermes: true, ml_battuta_pietrafitta: true, ml_res_pietrafitta: "v", ml_pino_ascoltato: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__colline.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  { const bad = await L.reachAll(page, "ml_citta"); if (bad.length) errors.push("ml_citta irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "ml_pino"); await page.evaluate(() => window.T_.click("Apri il mercato")); await page.waitForTimeout(300); await page.evaluate(() => window.__colline._dbg.K._mkt.buy("samba")); await closeOv(page); await page.waitForTimeout(200); await L.advance(page);
  if (!(await info(page)).flags.ml_in_samba) errors.push("Samba non comprato");
  await L.stubMatch(page, true); await L.talk(page, "ml_fiera"); await page.evaluate(() => window.T_.click("Gioca l'amichevole")); await page.waitForTimeout(400); await L.advance(page);
  const lm = await page.evaluate(() => window.__lastMatch || {}); if (lm.id !== "ml_fiera" || !/,/.test(lm.alt || "")) errors.push("amichevole non a scelta: " + JSON.stringify(lm));
  if ((await page.evaluate(() => window.__colline._dbg.K.crediti())) !== 300 - 260 + 150) errors.push("incasso della fiera mancante");
  await L.talk(page, "ml_ottone"); await L.advance(page, ["Marta non si vende"]);
  await L.talk(page, "ml_fiera"); await page.evaluate(() => window.T_.click("Gioca contro l'Atletico Valfonda")); await page.waitForTimeout(500); await lvBtn(page); await page.waitForTimeout(200);
  const o = await page.evaluate(() => window.__lavagna.state.o.opp.instr); if (o !== "pressing") errors.push("la Valfonda non gioca in pressing: " + o);
  await lvEnd(page, 1, 0); await page.waitForTimeout(300); if (!(await tabella(page))) errors.push("la classifica non compare"); await L.advance(page);
  await L.talk(page, "ml_bice"); await L.advance(page, ["Una festa in piazza"]);
  const i = await info(page); if (!i.done[2] || !i.flags.ml_marta_resta || !i.flags.ml_battuta_valfonda) errors.push("capitolo 2 non concluso: " + JSON.stringify(i.step));
  L.check(`Master League delle Colline · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const fl = { ml_crediti: 100, ml_in_ermes: true, ml_battuta_pietrafitta: true, ml_battuta_borgofiera: true, ml_battuta_valfonda: true, ml_marta_resta: true, ml_pino_ascoltato: true };
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "paese", 2: "festa" }, diffSet: true, intro: { ch1: 1, ch2: 1, ml_colle: 1, ml_citta: 1 }, st: { paese: 9, fiducia: 5 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__colline.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  { const bad = await L.reachAll(page, "ml_stadio"); if (bad.length) errors.push("ml_stadio irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "ml_stadio");
  await L.talk(page, "ml_pino"); await page.evaluate(() => window.T_.click("Allenamento e via")); await page.waitForTimeout(200); await L.advance(page);
  await L.stubMatch(page, true);
  for (const t of ["Real Monteroso", "Virtus San Gallo"]) { await L.talk(page, "ml_fiera"); await page.evaluate((t) => window.T_.click("Contro .*" + t.split(" ").pop()), t); await page.waitForTimeout(400); await L.advance(page); }
  let i = await info(page); if (!i.flags.ml_battuta_monteroso || !i.flags.ml_battuta_sangallo) errors.push("Coppa del Vino incompleta");
  await L.talk(page, "ml_ottone"); await page.evaluate(() => window.T_.click("Gioca lo spareggio")); await page.waitForTimeout(500); await lvBtn(page); await page.waitForTimeout(200);
  const o = await page.evaluate(() => [window.__lavagna.state.o.opp.instr, window.__lavagna.state.o.opp.ovr]); if (o.join() !== "contropiede,73") errors.push("spareggio: " + o);
  await lvEnd(page, 2, 1); await L.advance(page);
  if (w === 390) await L.shot(page, "ml_fine");
  await page.evaluate(() => { const A = window.__tr, r = A.trRec(), Z = A.TRZ; ["ml_colle", "ml_citta", "ml_stadio"].forEach((z) => { r.got[z] = (Z[z].items || []).map((_, k) => k); }); });
  const ends = ["La Contessa apre una vetrina", "Serie Collina", "È la vittoria del paese", "Mago, torna in panchina"];
  for (const e of ends) {
    await page.evaluate(() => { const K = window.__colline._dbg.K; K.setStep(3, 2); K.enterZone("ml_stadio"); }); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "ml_bice"); await L.advance(page, [e]);
  }
  i = await info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate(() => window.__colline._dbg.K.mem().ends.length); if (n < 4) errors.push("finali trovati " + n + " su 4");
  const m = await page.evaluate(() => { const x = window.__salone.machine("lavagna"); return x && x.eng; }); if (m !== "__lavagna") errors.push("cabinato della Lavagna mancante");
  L.check(`Master League delle Colline · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); })().catch((e) => { console.error("✗ colline:", e.message); process.exit(1); });
