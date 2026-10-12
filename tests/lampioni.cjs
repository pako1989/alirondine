// tests/lampioni.cjs - «La Notte dei Lampioni»: il buio e i lampioni (luce dinamica), Luci (la partita al buio), capitoli e finali
const L = require("./lib.cjs");
const MOD = { mod: "__lampioni", key: "ali-di-rondine.lampioni" };
const luStart = (p) => p.evaluate(() => { const b = document.querySelector(".luOv .ov button"); if (b) b.click(); });
const luEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__luci.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await luStart(p); await p.waitForTimeout(200); };
const lamps = (p) => p.evaluate(() => window.__lampioni._dbg.K.lampsIn(window.__borgoApi.trZone()));
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__lampioni.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  for (const z of ["nl_borgo", "nl_bottega"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "nl_buio");
  await L.talk(page, "nl_clelia"); await L.advance(page);
  // senza lanterna il lampione non si accende
  await L.goAct(page, 12, 8); await L.advance(page); if ((await lamps(page)) !== 0) errors.push("lampione acceso senza lanterna");
  await L.goAct(page, 6, 7); await L.advance(page); await L.talk(page, "nl_fiammetta"); await L.advance(page, ["Proviamo insieme"]); await L.goAct(page, 10, 12); await L.advance(page);
  for (const [x, y] of [[12, 8], [22, 8], [12, 16], [22, 16]]) for (let k = 0; k < 6; k++) { const n0 = await lamps(page); await L.goAct(page, x, y); await L.advance(page); if ((await lamps(page)) > n0) break; await page.waitForTimeout(700); } // Tobia passeggia: se il pulsante parla con lui, si riprova
  await page.waitForTimeout(400); await L.advance(page);
  if ((await lamps(page)) !== 4) errors.push("lampioni accesi: " + (await lamps(page)));
  if (w === 390) await L.shot(page, "nl_luce");
  await L.talk(page, "nl_leandro"); await page.evaluate(() => window.T_.click("Gioca con le Ombre")); await page.waitForTimeout(500); await luStart(page); await page.waitForTimeout(400);
  // un turno vero: una lanterna e un passo avanti
  await page.evaluate(() => document.querySelector(".luOv .lan").dispatchEvent(new PointerEvent("pointerdown"))); const box = await (await page.$(".luOv canvas")).boundingBox();
  await page.mouse.click(box.x + box.width * (3.5 / 7), box.y + box.height * (4.5 / 9)); await page.waitForTimeout(200);
  if (w === 390) await L.shot(page, "nl_partita");
  const d = await page.evaluate(() => window.__luci.state.data.lanterne); if (d !== 1) errors.push("la lanterna non si posa: " + d);
  await luEnd(page, 2, 1); await L.advance(page);
  await L.talk(page, "nl_leandro"); await L.advance(page, ["Accenderemo tutti"]);
  const i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  L.check(`La Notte dei Lampioni · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "promessa" }, diffSet: true, intro: { ch1: 1, nl_borgo: 1, nl_bottega: 1 }, st: { luce: 5, ombre: 5 }, flags: { nl_lanterna: true, lamp_nl_borgo_12_8: true, lamp_nl_borgo_22_8: true, lamp_nl_borgo_12_16: true, lamp_nl_borgo_22_16: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__lampioni.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  await L.stubMatch(page, true); await L.talk(page, "nl_tobia"); await page.evaluate(() => window.T_.click("Un'altra partita")); await page.waitForTimeout(300); await L.advance(page);
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "nl_sagrato") errors.push("partitella del sagrato non avviata");
  await L.goAct(page, 17, 0); await L.advance(page); if ((await L.zone(page)) !== "nl_bosco") errors.push("non si entra nel bosco: " + (await L.zone(page)));
  for (const z of ["nl_bosco", "nl_capanna"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  for (const [x, y] of [[16, 21], [8, 15], [20, 10], [26, 10], [13, 7]]) { await L.goAct(page, x, y); await L.advance(page); }
  if ((await lamps(page)) !== 5) errors.push("lampioni del bosco: " + (await lamps(page)));
  if (w === 390) await L.shot(page, "nl_bosco");
  for (const id of ["nl_ombra1", "nl_ombra2", "nl_ombra3"]) { await L.talk(page, id); await L.advance(page); }
  await L.goAct(page, 27, 7); await L.advance(page); if ((await L.zone(page)) !== "nl_capanna") errors.push("non si entra nella capanna");
  await L.talk(page, "nl_lucia"); await L.advance(page, ["Torni in paese"]);
  const i = await L.info(page); if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify(i.step)); if (!i.flags.nl_fiammella) errors.push("niente fiammella madre");
  L.check(`La Notte dei Lampioni · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const fl = { nl_lanterna: true, nl_fiammella: true, nl_lucia_torna: true }; [["nl_borgo", [[12, 8], [22, 8], [12, 16], [22, 16]]], ["nl_bosco", [[16, 21], [8, 15], [20, 10], [26, 10], [13, 7]]]].forEach(([z, l]) => l.forEach(([x, y]) => (fl[`lamp_${z}_${x}_${y}`] = true)));
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "promessa", 2: "torna" }, diffSet: true, intro: { ch1: 1, ch2: 1, nl_borgo: 1, nl_bottega: 1, nl_bosco: 1, nl_capanna: 1 }, st: { luce: 14, ombre: 9 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__lampioni.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  await L.goAct(page, 17, 0); await L.advance(page); if ((await L.zone(page)) !== "nl_campo") errors.push("non si sale al vecchio campo: " + (await L.zone(page)));
  { const bad = await L.reachAll(page, "nl_campo"); if (bad.length) errors.push("nl_campo irraggiungibile: " + bad.join(", ")); }
  // il tredicesimo lampione non si accende senza tutti i fiammiferi
  await L.goAct(page, 15, 10); await L.advance(page); if ((await L.info(page)).flags.nl_tredici) errors.push("tredicesimo acceso senza fiammiferi");
  for (const [x, y] of [[3, 9], [26, 9], [15, 3]]) { await L.goAct(page, x, y); await L.advance(page); } await page.waitForTimeout(400); await L.advance(page);
  if (w === 390) await L.shot(page, "nl_campo");
  await L.talk(page, "nl_leandro"); await page.evaluate(() => window.T_.click("Gioca la partita della festa")); await page.waitForTimeout(500); await luStart(page); await page.waitForTimeout(300);
  const lu = await page.evaluate(() => [window.__luci.state.o.actions, window.__luci.state.o.oppStyle]); if (lu.join() !== "8,pressing") errors.push("finale sbagliata: " + lu);
  await luEnd(page, 3, 2); await L.advance(page);
  await page.evaluate(() => { const A = window.__tr, r = A.trRec(), Z = A.TRZ; ["nl_borgo", "nl_bosco", "nl_campo"].forEach((z) => { r.got[z] = (Z[z].items || []).map((_, k) => k); }); });
  await L.goAct(page, 15, 10); await L.advance(page); if (!(await L.info(page)).flags.nl_tredici) errors.push("il tredicesimo lampione non si accende");
  const ends = ["Il tredicesimo lampione brilla", "È l'alba", "Fiammetta, i lampioni", "Restate. Una notte"];
  for (const e of ends) {
    await page.evaluate(() => { const K = window.__lampioni._dbg.K; K.setStep(3, 2); K.enterZone("nl_campo"); }); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "nl_leandro"); await L.advance(page, [e]); if (w === 390 && e === ends[0]) await L.shot(page, "nl_fine");
  }
  const i = await L.info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate(() => window.__lampioni._dbg.K.mem().ends.length); if (n < 4) errors.push("finali trovati " + n + " su 4");
  L.check(`La Notte dei Lampioni · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); })().catch((e) => { console.error("✗ lampioni:", e.message); process.exit(1); });
