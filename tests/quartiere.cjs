// tests/quartiere.cjs - «Gli Straordinari di Quartiere»: il motore Combo di Squadra (coppie di eroi, combo scoperte che restano
// nel Libro, stanchezza), il Copione (cambio di potere, strade diverse, niente cambio sopra l'acqua), le partite a scelta,
// i 3 capitoli e i 4 finali, il cabinato della Sala Giochi
const L = require("./lib.cjs");
const MOD = { mod: "__quartiere", key: "ali-di-rondine.quartiere" };
const K_ = "window.__quartiere._dbg.K";
const info = (p) => L.info(p);
const cbStart = async (p) => { await p.waitForTimeout(300); const ok = await p.evaluate(() => { const b = document.querySelector(".cbOv .ov .goB"); if (b) { b.click(); return true; } return false; }); await p.waitForTimeout(250); return ok; };
const cbEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__combo.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await p.evaluate(() => { const b = document.querySelector(".cbOv .ov .goB"); if (b) b.click(); }); await p.waitForTimeout(250); };
const pow = (p, k) => p.evaluate(([k, kk]) => { const K = eval(kk); K.F.set("sq_pow", k); K.refreshZone && K.refreshZone(); }, [k, K_]);
const tp = (p, x, y) => p.evaluate(([x, y]) => { const TW = window.__tr.TW; TW.x = x * 16 + 8; TW.y = y * 16 + 12; }, [x, y]);
// un potere di prova che attraversa tutto, per controllare in un colpo solo che ogni cosa sia raggiungibile
const allPass = (p) => p.evaluate((kk) => { const K = eval(kk); K.POTERI.tutti = { e: "", n: "Tutti", pass: "wJXKI", col: "#fff", d: "" }; K.F.set("sq_pow", "tutti"); }, K_);
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__quartiere.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  if (w === 390) await L.shot(page, "sq_quartiere");
  await L.goAct(page, 4, 5); await L.advance(page); if ((await L.zone(page)) !== "sq_garage") errors.push("non si entra nel garage");
  { const bad = await L.reachAll(page, "sq_garage"); if (bad.length) errors.push("sq_garage irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "sq_ines"); await L.advance(page);
  await page.evaluate((k) => eval(k).go("sq_quartiere", 4, 7), K_); await page.waitForTimeout(400); await L.advance(page);
  await L.talk(page, "sq_brina"); await L.advance(page);
  let i = await info(page); if (i.flags.sq_pow !== "ghiaccio" || !i.flags.sq_in_ghiaccio) errors.push("Brina, il ghiaccio: " + JSON.stringify(i.flags));
  // sopra l'acqua gelata non si cambia potere (si finirebbe nel canale)
  await tp(page, 12, 10); await page.evaluate((k) => eval(k).cambia("vento"), K_); await page.waitForTimeout(200); await L.advance(page);
  if ((await info(page)).flags.sq_pow !== "ghiaccio") errors.push("cambio di potere sopra l'acqua non bloccato");
  if (w === 390) await L.shot(page, "sq_ghiaccio");
  await tp(page, 16, 10); await L.talk(page, "sq_soffio"); await L.advance(page);
  await L.talk(page, "sq_gommo"); await L.advance(page);
  i = await info(page); if (i.step[1] !== 2) errors.push("la squadra non è pronta: " + JSON.stringify(i.step));
  await allPass(page); { const bad = await L.reachAll(page, "sq_quartiere"); if (bad.length) errors.push("sq_quartiere irraggiungibile: " + bad.join(", ")); }
  await pow(page, "scatto"); await page.evaluate((k) => eval(k).go("sq_quartiere", 5, 19), K_); await page.waitForTimeout(400); await L.advance(page);
  await L.stubMatch(page, true); await L.talk(page, "sq_brina"); await page.evaluate(() => window.T_.click("La sfida dei gelati")); await page.waitForTimeout(200); await page.evaluate(() => window.T_.click("Un'altra modalità")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "sq_gelati") errors.push("sfida dei gelati non a scelta");
  await L.talk(page, "sq_geometra"); await page.evaluate(() => window.T_.click("Sfida i Geometri")); await page.waitForTimeout(500);
  if (!(await cbStart(page))) errors.push("Combo di Squadra non si apre");
  // un comando vero: due eroi (scatto + vento = Raffica), il pulsante, la combo scoperta e gli eroi stanchi
  await page.evaluate(() => { const S = window.__combo.state; const hs = [...document.querySelectorAll(".cbOv .team button")]; [0, 2].forEach((k) => hs[k].dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))); });
  await page.waitForTimeout(150); if (w === 390) await L.shot(page, "sq_combo");
  await page.evaluate(() => document.querySelector(".cbOv .pad button.go").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))); await page.waitForTimeout(300);
  const st = await page.evaluate(() => { const S = window.__combo.state; return [S.data.turni, S.data.nuove.join(), S.tired.join()]; }); if (st[0] !== 1 || st[1] !== "raffica" || st[2] !== "0,2") errors.push("Combo di Squadra, la Raffica: " + JSON.stringify(st));
  await cbEnd(page, 2, 0); await L.advance(page);
  i = await info(page); if (i.step[1] !== 3 || !i.flags.sq_cb_raffica) errors.push("dopo i Geometri: " + JSON.stringify([i.step, i.flags.sq_cb_raffica]));
  await L.goAct(page, 4, 5); await L.advance(page);
  await L.talk(page, "sq_ines"); await L.advance(page, [w === 390 ? "Maschere" : "Faccia scoperta"]);
  i = await info(page); if (!i.done[1] || !(w === 390 ? i.flags.sq_maschere : i.flags.sq_volti)) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  L.check(`Gli Straordinari di Quartiere · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const fl = { sq_in_calamita: true, sq_in_ghiaccio: true, sq_in_vento: true, sq_in_elastico: true, sq_pow: "scatto", sq_cb_raffica: true, [w === 390 ? "sq_maschere" : "sq_volti"]: true };
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "maschere" }, diffSet: true, intro: { ch1: 1, sq_quartiere: 1, sq_garage: 1 }, st: { squadra: 3 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__quartiere.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  await L.talk(page, "sq_scintilla"); await L.advance(page);
  let i = await info(page); if (i.flags.sq_pow !== "fuoco" || i.step[2] !== 1) errors.push("Scintilla, il fuoco: " + JSON.stringify([i.flags.sq_pow, i.step]));
  if (w === 390) await L.shot(page, "sq_cantiere");
  // col fuoco si passa il ghiaccio ma non i cassoni; con tutti i poteri si arriva ovunque
  const reach = await page.evaluate(() => { const T = window.T_, TW = window.__tr.TW; return [!!T.reachAdj(12, 12), !!T.reachAdj(20, 12)]; });
  if (!reach[0] || reach[1]) errors.push("col fuoco: ghiaccio passabile, cassoni no: " + JSON.stringify(reach));
  await allPass(page); { const bad = await L.reachAll(page, "sq_cantiere"); if (bad.length) errors.push("sq_cantiere irraggiungibile: " + bad.join(", ")); }
  await L.stubMatch(page, true); await L.talk(page, "sq_scintilla"); await page.evaluate(() => window.T_.click("La partita della pizza")); await page.waitForTimeout(200); await page.evaluate(() => window.T_.click("Un'altra modalità")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "sq_pizza") errors.push("partita della pizza non a scelta");
  await L.talk(page, "sq_cemento");
  if (w === 390) { await page.evaluate(() => window.T_.click("Perché proprio un parcheggio")); await page.waitForTimeout(200); await L.advance(page).catch(() => {}); }
  else await page.evaluate(() => window.T_.click("Basta chiacchiere"));
  await page.waitForTimeout(500);
  const hs = await page.evaluate(() => window.__combo.state && window.__combo.state.o.heroes.map((h) => h.power).join()); if (hs !== "scatto,fuoco,calamita,elastico") errors.push("le Ruspe, eroi: " + hs);
  await cbStart(page); await cbEnd(page, 2, 1); await L.advance(page);
  await L.talk(page, "sq_cemento"); await L.advance(page, [w === 390 ? "Accettiamo" : "Il campetto resta"]);
  i = await info(page); if (!i.done[2] || (w === 390 && !i.flags.sq_cemento_ascoltato)) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.flags.sq_cemento_ascoltato]));
  L.check(`Gli Straordinari di Quartiere · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const fl = { sq_in_calamita: true, sq_in_ghiaccio: true, sq_in_vento: true, sq_in_elastico: true, sq_in_fuoco: true, sq_pow: "scatto", sq_maschere: true, sq_cemento_ascoltato: true, sq_rifiuto: true };
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "maschere", 2: "rifiuto" }, diffSet: true, intro: { ch1: 1, ch2: 1, sq_quartiere: 1, sq_cantiere: 1 }, st: { squadra: 5, quartiere: 4 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__quartiere.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  { const bad = await L.reachAll(page, "sq_campetto"); if (bad.length) errors.push("sq_campetto irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "sq_campetto");
  await L.talk(page, "sq_cemento"); await L.advance(page);
  await L.talk(page, "sq_ines"); await L.advance(page, [w === 390 ? "Brina, Soffio, Scintilla" : "Gommo, Nonna Ines, Scintilla"]);
  await L.talk(page, "sq_cemento"); await page.evaluate(() => window.T_.click("Gioca la partita del campetto")); await page.waitForTimeout(500);
  const hs = await page.evaluate(() => window.__combo.state && window.__combo.state.o.heroes.map((h) => h.power).join()); if (hs !== (w === 390 ? "scatto,ghiaccio,vento,fuoco" : "scatto,elastico,calamita,fuoco")) errors.push("finale, formazione: " + hs);
  await cbStart(page); await cbEnd(page, 3, 1); await L.advance(page);
  if (w === 390) await L.shot(page, "sq_finale");
  await page.evaluate(() => { const A = window.__tr, r = A.trRec(), Z = A.TRZ; ["sq_quartiere", "sq_cantiere", "sq_campetto"].forEach((z) => { r.got[z] = ((Z[z] && Z[z].items) || []).map((_, k) => k); }); });
  await page.evaluate((k) => { const K = eval(k); Object.values(window.__combo.COMBO).slice(0, 10).forEach((c) => K.F.set("sq_cb_" + c.id, true)); }, K_);
  const ends = [["Brina… cos'è quel quaderno", {}], ["Ponterotto, siamo noi", { sq_volti: true }], ["Sparite prima", {}], ["Dottore, un posto", {}]];
  for (const [e, f] of ends) {
    await page.evaluate(([k, f]) => { const K = eval(k); Object.keys(f).forEach((x) => K.F.set(x, f[x])); K.setStep(3, 3); K.enterZone("sq_campetto"); }, [K_, f]); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "sq_ines"); await L.advance(page, [e]);
  }
  const i = await info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate((k) => eval(k).mem().ends.length, K_); if (n < 4) errors.push("finali trovati " + n + " su 4");
  const m = await page.evaluate(() => { const x = window.__salone.machine("combo"); return x && x.eng; }); if (m !== "__combo") errors.push("cabinato di Combo di Squadra mancante");
  L.check(`Gli Straordinari di Quartiere · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); })().catch((e) => { console.error("✗ quartiere:", e.stack); process.exit(1); });
