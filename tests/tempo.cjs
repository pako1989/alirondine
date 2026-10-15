// tests/tempo.cjs - «Rondine 1938-2038»: capitolo 1 (Le 22:04), il motore Palla del Tempo, le tre epoche
const L = require("./lib.cjs");
const MOD = { mod: "__tempo", key: "ali-di-rondine.tempo" };
const SAVE = (o) => Object.assign({ v: 1, ch: 1, step: {}, done: {}, intro: {} }, o);
const goB = (p) => p.evaluate(() => { const b = document.querySelector(".ptOv .ov .goB"); if (b) { b.click(); return b.textContent; } return null; });
// una partita Palla del Tempo vera: schede, comandi reali (trascinamento, TIRA, TEMPO), poi risultato forzato con finish()
async function gioca(page, a, b, errors, shotName) {
  for (let i = 0; i < 6 && !(await page.evaluate(() => !!document.querySelector(".ptOv"))); i++) await page.waitForTimeout(300);
  if (!(await page.evaluate(() => !!document.querySelector(".ptOv")))) { errors.push("la Palla del Tempo non si è aperta"); return; }
  await goB(page); await page.waitForTimeout(300);
  await page.evaluate(() => { window.__pallatempo.state.count = 2; }); await page.waitForTimeout(500);
  const box = await page.evaluate(() => { const r = document.querySelector(".ptOv canvas").getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  const p0 = await page.evaluate(() => { const S = window.__pallatempo.state; return [S.hero.x, S.hero.y]; });
  await page.mouse.move(box.x + box.w / 2, box.y + box.h * 0.7); await page.mouse.down(); await page.mouse.move(box.x + box.w / 2 + 70, box.y + box.h * 0.5, { steps: 6 }); await page.waitForTimeout(500); await page.mouse.up();
  const p1 = await page.evaluate(() => { const S = window.__pallatempo.state; return [S.hero.x, S.hero.y]; });
  if (Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) < 3) errors.push("il trascinamento non muove l'eroe");
  if (shotName) await L.shot(page, shotName);
  await page.evaluate(() => [".shoot", ".pass", ".tmp"].forEach((q) => { const b = document.querySelector(".ptOv " + q); if (b && !b.disabled) b.click(); })); await page.waitForTimeout(300);
  if (shotName) await L.shot(page, shotName + "_tempo");
  // salta i periodi: ogni fine periodo apre la scheda dell'epoca dopo
  for (let k = 0; k < 8; k++) {
    const st = await page.evaluate(() => { const S = window.__pallatempo.state; return S ? { ph: S.phase, ei: S.ei, n: S.era && S.era.name } : null; });
    if (!st) break;
    const more = await page.evaluate(() => { const S = window.__pallatempo.state; return S.ei < S.nEra - 1; }).catch(() => false);
    if (await page.evaluate(() => !!document.querySelector(".ptOv .ov .goB"))) { await goB(page); await page.waitForTimeout(200); await page.evaluate(() => { const S = window.__pallatempo.state; if (S && S.phase === "count") S.count = 2; }); await page.waitForTimeout(300); continue; }
    if (more) { await page.evaluate(() => window.__pallatempo.state.skip()); await page.waitForTimeout(1200); continue; }
    break;
  }
  await page.evaluate(([a, b]) => { const S = window.__pallatempo.state; if (!S) return; S.a = a; S.b = b; S.finish(); }, [a, b]);
  await page.waitForTimeout(300); if (shotName) await L.shot(page, shotName + "_fine");
  await goB(page); await page.waitForTimeout(500);
}
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__tempo.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  for (const z of ["rt_piazzale", "rt_campo", "rt_officina"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "rt_piazzale_2038");
  await L.talk(page, "rt_tilly"); await L.advance(page);
  await L.talk(page, "rt_nonna"); await L.advance(page);
  if (!(await page.evaluate(() => window.__tempo._dbg.F.is("rt_seme")))) errors.push("Nonna non ha dato il seme");
  await L.goAct(page, 25, 9); await L.advance(page);
  await L.talk(page, "rt_tosta"); await L.advance(page);
  await L.goAct(page, 5, 6); await L.advance(page); if ((await L.zone(page)) !== "rt_officina") errors.push("non si entra nell'Officina");
  if (w === 390) await L.shot(page, "rt_officina");
  await L.goAct(page, 7, 4); await L.advance(page); // Pullman prima del Professore: rifiuta
  await L.talk(page, "rt_quarzo"); await L.advance(page);
  await L.goAct(page, 7, 4); await L.advance(page, ["^1938"]); await page.waitForTimeout(400);
  const ep = await page.evaluate(() => window.__tempo._dbg.K.ep()); if (ep !== 1938) errors.push("il Pullman non porta al 1938: " + ep);
  if ((await L.zone(page)) !== "rt_piazzale") errors.push("dopo il Pullman non si è in piazzale");
  if (w === 390) await L.shot(page, "rt_piazzale_1938");
  await L.talk(page, "rt_madre38"); await L.advance(page);
  await L.talk(page, "rt_baldo"); await L.advance(page);
  await L.goAct(page, 14, 14); await L.advance(page, ["Pianta il seme"]);
  if (!(await page.evaluate(() => window.__tempo._dbg.F.is("rt_pianta")))) errors.push("il seme non è stato piantato");
  await L.talk(page, "rt_dorino"); await L.advance(page, ["Dal futuro"]);
  await L.goAct(page, 29, 10); await L.advance(page); if ((await L.zone(page)) !== "rt_campo") errors.push("non si va al campo");
  if (w === 390) await L.shot(page, "rt_campo_1938");
  await L.talk(page, "rt_dorino"); await page.evaluate(() => window.T_.click("Gioca l'inaugurazione")); await page.waitForTimeout(600);
  await gioca(page, 1, 0, errors, w === 390 ? "rt_palla" : null); await L.advance(page);
  const ep2 = await page.evaluate(() => window.__tempo._dbg.K.ep()); if (ep2 !== 2038) errors.push("dopo la partita non si è nel 2038: " + ep2);
  if (w === 390) await L.shot(page, "rt_piazzale_2038_albero");
  await L.goAct(page, 25, 9); await L.advance(page, ["unico campo"]);
  const i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  L.check(`Rondine 1938-2038 · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const save = SAVE({ ch: 2, step: { 1: 5 }, done: { 1: "campo" }, intro: { ch1: 1, rt_piazzale: 1, rt_campo: 1, rt_officina: 1 }, flags: { rt_foto: true, rt_pianta: true, rt_foto_ok: true, rt_titolo: true } });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__tempo.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  if ((await L.zone(page)) !== "rt_officina") errors.push("il capitolo 2 non parte in Officina: " + (await L.zone(page)));
  await L.talk(page, "rt_quarzo"); await L.advance(page);
  await L.goAct(page, 7, 4); await L.advance(page, ["^1978"]); await page.waitForTimeout(400);
  if ((await page.evaluate(() => window.__tempo._dbg.K.ep())) !== 1978) errors.push("il Pullman non porta al 1978");
  for (const z of ["rt_piazzale", "rt_campo", "rt_bar"]) { if (z === "rt_bar") continue; const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "rt_piazzale_1978");
  await L.goAct(page, 23, 5); await L.advance(page); if ((await L.zone(page)) !== "rt_bar") errors.push("non si entra nel Bar da Ines: " + (await L.zone(page)));
  { const bad = await L.reachAll(page, "rt_bar"); if (bad.length) errors.push("rt_bar irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "rt_bar_1978");
  await L.talk(page, "rt_ines78"); await L.advance(page);
  if (!(await page.evaluate(() => window.__tempo._dbg.F.is("rt_gettone")))) errors.push("il gettone non è stato dato");
  await L.goAct(page, 11, 2); await L.advance(page, ["Gioca una pallina"]);
  await L.goAct(page, 6, 9); await L.advance(page); if ((await L.zone(page)) !== "rt_piazzale") errors.push("non si esce dal Bar");
  await L.talk(page, "rt_rino"); await L.advance(page);
  await L.goAct(page, 29, 10); await L.advance(page);
  await L.talk(page, "rt_mister"); await page.evaluate(() => window.T_.click("Gioca la finale")); await page.waitForTimeout(600);
  await gioca(page, 1, 0, errors, w === 390 ? "rt_palla2" : null); await L.advance(page);
  await L.talk(page, "rt_quarzo78"); await L.advance(page, ["Insegnagli il dubbio"]);
  const i = await L.info(page); if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify(i.step));
  if (!(await page.evaluate(() => window.__tempo._dbg.F.get("rt_occhio")))) errors.push("scelta dell'Occhio non registrata");
  L.check(`Rondine 1938-2038 · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const tracce = { rt_seg_pietra: true, rt_seg_cavo: true, rt_seg_idrante: true };
  const save = SAVE({ ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "campo", 2: "mite" }, intro: { ch1: 1, ch2: 1, rt_piazzale: 1, rt_campo: 1, rt_officina: 1, rt_bar: 1 }, st: { vera: 2, club: 7 }, flags: Object.assign({ rt_foto: true, rt_pianta: true, rt_foto_ok: true, rt_titolo: true, rt_detto: true, rt_occhio: "spento", rt_gettone: true, rt_ep: 2038 }, tracce) });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  const K = (f, ...a) => page.evaluate(([f, a]) => window.__tempo._dbg.K[f](...a), [f, a]);
  await page.evaluate(() => window.__tempo.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  if ((await L.zone(page)) !== "rt_piazzale") errors.push("il capitolo 3 non parte in piazzale");
  await L.talk(page, "rt_tilly"); await L.advance(page);
  await L.goAct(page, 29, 10); await L.advance(page); if ((await L.zone(page)) !== "rt_campo") errors.push("non si va al campo");
  if (w === 390) await L.shot(page, "rt_campo_porta");
  for (const ep of [2038, 1978, 1938]) {
    await K("viaggia", ep); await K("enterZone", "rt_campo"); await page.waitForTimeout(500); await L.advance(page);
    await L.goAct(page, 4, 6); await L.advance(page); if ((await L.zone(page)) !== "rt_spogliatoio") errors.push("non si entra nello spogliatoio " + ep);
    if (ep === 2038) { const bad = await L.reachAll(page, "rt_spogliatoio"); if (bad.length) errors.push("spogliatoio irraggiungibile: " + bad.join(", ")); if (w === 390) await L.shot(page, "rt_spogliatoio"); }
    await L.goAct(page, 11, 2); await L.advance(page);
  }
  for (const f of ["rt_fascia", "rt_fischio", "rt_orologio"]) if (!(await page.evaluate((f) => window.__tempo._dbg.F.is(f), f))) errors.push("oggetto mancante " + f);
  if ((await page.evaluate(() => window.__tempo._dbg.K.stepOf(3))) !== 2) errors.push("passo 2 non raggiunto");
  await K("viaggia", 2038); await K("enterZone", "rt_campo"); await page.waitForTimeout(500); await L.advance(page);
  await L.talk(page, "rt_vera"); await page.evaluate(() => window.T_.click("Comincia la Revisione")); await page.waitForTimeout(600);
  await gioca(page, 2, 1, errors, w === 390 ? "rt_palla3" : null); await L.advance(page, ["Il gol c.è stato"]);
  let i = await L.info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const ends = ["Capelli|Che il tempo si può", "custodiscono", "forestiero ha segnato", "rondine, piccola|Sul tabellone"];
  for (const e of ends) {
    await page.evaluate(() => { const K = window.__tempo._dbg.K; K.viaggia(2038); K.setStep(3, 3); K.enterZone("rt_campo"); }); await page.waitForTimeout(500); await L.advance(page);
    await L.talk(page, "rt_vera"); await L.advance(page, [e.split("|").pop()]); if (w === 390 && e === ends[3]) await L.shot(page, "rt_finale");
  }
  const n = await page.evaluate(() => window.__tempo._dbg.K.mem().ends.length); if (n < 5) errors.push("finali trovati " + n + " su 5");
  L.check(`Rondine 1938-2038 · capitolo 3 e i 5 finali (${w} px)`, errors); await browser.close();
}
async function mac(w) {
  const fin = SAVE({ ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "campo", 2: "mite", 3: "gol" }, ends: ["gol"], diffSet: true, flags: {} });
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.tempo": fin } });
  await page.evaluate(() => window.__salone.salaGiochi(() => {})); await page.waitForTimeout(300);
  const st = await page.evaluate(() => { const b = document.querySelector('.salOv [data-m="pallatempo"]'); return b ? b.querySelector(".pe").textContent : null; });
  if (st === null) errors.push("cabinato Palla del Tempo assente"); else if (st === "🔒") errors.push("cabinato bloccato a saga finita");
  await page.evaluate(() => document.querySelector('.salOv [data-m="pallatempo"]').click()); await page.waitForTimeout(200);
  if (!(await page.evaluate(() => !!document.querySelector('.salOv [data-o="9"]')))) errors.push("manca il boss del cabinato");
  await page.evaluate(() => document.querySelector('.salOv [data-o="1"]').click()); await page.waitForTimeout(500);
  if (w === 390) await L.shot(page, "rt_cabinato");
  await goB(page); await page.waitForTimeout(300);
  await page.evaluate(() => { const S = window.__pallatempo.state; S.a = 2; S.b = 0; S.finish(); }); await page.waitForTimeout(300); await goB(page); await page.waitForTimeout(400);
  const rec = await page.evaluate(() => JSON.parse(localStorage.getItem("ali-di-rondine.salagiochi") || "{}")); if (!rec.w || rec.w.pallatempo !== 1) errors.push("record non salvato: " + JSON.stringify(rec));
  L.check(`Palla del Tempo · cabinato della Sala Giochi (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); await mac(390); await mac(320); })().catch((e) => { console.error("✗ tempo:", e.message); process.exit(1); });
