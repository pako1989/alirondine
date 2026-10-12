// tests/torneo.cjs - «Il Torneo delle Cento Scuole»: capitolo 1 (la Via Lunga, personaggi che camminano, il quarto a Vignette)
const L = require("./lib.cjs");
const MOD = { mod: "__torneo", key: "ali-di-rondine.torneo" };
const vgStart = (p) => p.evaluate(() => { const b = document.querySelector(".vgOv .ov button"); if (b) b.click(); });
const vgEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__vignette.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await vgStart(p); await p.waitForTimeout(200); };
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__torneo.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  for (const z of ["ts_piazza", "ts_spiaggia", "ts_campo"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  // i personaggi camminano davvero
  await page.waitForTimeout(400); const p0 = await page.evaluate(() => window.__tr.TW.z.npcs.find((n) => n.id === "ts_vigile").px); await page.waitForTimeout(1200);
  const p1 = await page.evaluate(() => window.__tr.TW.z.npcs.find((n) => n.id === "ts_vigile").px); if (!(Math.abs(p1 - p0) > 4)) errors.push(`il vigile non cammina: ${p0} → ${p1}`);
  if (w === 390) await L.shot(page, "ts_piazza");
  await L.talk(page, "ts_iole"); await L.advance(page);
  const ga = await L.goAct(page, 8, 8); await L.advance(page); if ((await L.zone(page)) !== "ts_forno") errors.push("non si entra in panetteria: " + ga + " " + (await L.zone(page)) + " " + JSON.stringify((await L.info(page)).step));
  if (w === 390) await L.shot(page, "ts_forno");
  await L.talk(page, "ts_tito"); await L.advance(page, ["In campo si brucia"]); await L.goAct(page, 10, 12); await L.advance(page);
  await L.goAct(page, 31, 8); await L.advance(page); await L.talk(page, "ts_alba"); await L.advance(page, ["Dammi le lettere"]); await L.goAct(page, 10, 12); await L.advance(page);
  for (const id of ["ts_vigile", "ts_turista", "ts_pescatore"]) { await L.talk(page, id); await L.advance(page); }
  await L.goAct(page, 31, 8); await L.advance(page); await L.talk(page, "ts_alba"); await L.advance(page); await L.goAct(page, 10, 12); await L.advance(page);
  await L.goAct(page, 19, 25); await L.advance(page); if ((await L.zone(page)) !== "ts_spiaggia") errors.push("non si scende in spiaggia");
  if (w === 390) await L.shot(page, "ts_spiaggia");
  await L.talk(page, "ts_rocco"); await L.advance(page, ["Non importa"]);
  await L.goAct(page, 19, 0); await L.advance(page); await L.talk(page, "ts_iole"); await L.advance(page, ["Ci fidiamo"]);
  const i0 = await L.info(page); if (i0.step[1] !== 3) errors.push("squadra o tecnica non pronte: " + JSON.stringify(i0.step));
  await L.goAct(page, 0, 12); await L.advance(page); if ((await L.zone(page)) !== "ts_campo") errors.push("non si va al campo");
  await L.talk(page, "ts_gil"); await page.evaluate(() => window.T_.click("Gioca il quarto")); await page.waitForTimeout(500); await vgStart(page); await page.waitForTimeout(2500);
  const tech = await page.evaluate(() => window.__vignette.state && window.__vignette.state.o.techniques); if (!tech || !tech.includes("tiro3")) errors.push("il Tiro a Tre non arriva in partita: " + JSON.stringify(tech));
  if (w === 390) await L.shot(page, "ts_vignette");
  await vgEnd(page, 3, 1); await L.advance(page);
  await L.talk(page, "ts_ettore"); await L.advance(page, ["Perché ci divertiamo"]);
  const i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step)); if (i.flags.tb_q0 !== "La Via Lunga") errors.push("tabellone non aggiornato");
  L.check(`Il Torneo delle Cento Scuole · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "mano" }, diffSet: true, intro: { ch1: 1, ts_piazza: 1, ts_spiaggia: 1, ts_campo: 1 }, st: { squadra: 5, rivale: 2 }, flags: { ts_tec_tiro3: true, ts_maglia: true, tb_q0: "La Via Lunga", tb_q2: "Collegio San Biagio", tb_q3: "Accademia del Faro", ts_lettere: true, ts_l_vigile: true, ts_l_turista: true, ts_l_pescatore: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await L.stubMatch(page, true);
  await page.evaluate(() => window.__torneo.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  for (const z of ["ts_mercato", "ts_faro", "ts_piazza", "ts_spiaggia"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "ts_nadia"); await L.advance(page);
  await L.goAct(page, 19, 25); await L.advance(page); await L.talk(page, "ts_rocco"); await L.advance(page, ["In fila"]);
  await L.goAct(page, 39, 10); await L.advance(page); if ((await L.zone(page)) !== "ts_faro") errors.push("non si va al faro");
  if (w === 390) await L.shot(page, "ts_faro");
  await L.talk(page, "ts_ettore"); await L.advance(page, ["Gioca l'amichevole"]); await page.waitForTimeout(200); await L.advance(page);
  const lm = await page.evaluate(() => window.__lastMatch); if (!lm || lm.mate !== "Alba Corsi, postina") errors.push("amichevole sbagliata: " + JSON.stringify(lm));
  await page.evaluate(() => window.__torneo._dbg.K.go("ts_mercato", 2, 9)); await page.waitForTimeout(500); await L.advance(page);
  if (w === 390) await L.shot(page, "ts_mercato");
  await L.talk(page, "ts_alba"); await L.advance(page, ["Insegnamela"]);
  for (const id of ["ts_venditore", "ts_fioraia"]) { await L.talk(page, id); await L.advance(page); }
  await L.talk(page, "ts_bruna"); await L.advance(page, ["Prendetelo"]);
  const i1 = await L.info(page); if (i1.flags.tb_q1 !== "Ragazzi del Mercato") errors.push("il prestito del campo non cambia il tabellone: " + i1.flags.tb_q1);
  await L.goAct(page, 0, 8); await L.advance(page); await L.goAct(page, 0, 12); await L.advance(page);
  await L.talk(page, "ts_iole"); await page.evaluate(() => window.T_.click("Gioca la semifinale")); await page.waitForTimeout(500); await vgStart(page); await page.waitForTimeout(800);
  const st = await page.evaluate(() => window.__vignette.state.o); if (st.opp.name !== "Ragazzi del Mercato" || !st.techniques.includes("muro") || !st.techniques.includes("ombra")) errors.push("semifinale sbagliata: " + JSON.stringify([st.opp.name, st.techniques]));
  await vgEnd(page, 2, 1); await L.advance(page);
  await page.evaluate(() => window.__torneo._dbg.K.go("ts_faro", 2, 10)); await page.waitForTimeout(500); await L.advance(page);
  await L.talk(page, "ts_ettore"); await L.advance(page, ["Stasera vieni a cena"]);
  const i = await L.info(page); if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify(i.step)); if (i.flags.tb_s0 !== "La Via Lunga") errors.push("tabellone della semifinale non aggiornato");
  L.check(`Il Torneo delle Cento Scuole · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 7 }, done: { 1: "mano", 2: "cena" }, diffSet: true, intro: { ch1: 1, ch2: 1, ts_piazza: 1, ts_spiaggia: 1, ts_campo: 1, ts_mercato: 1, ts_faro: 1 }, st: { squadra: 6, rivale: 5 }, flags: { ts_tec_tiro3: true, ts_tec_muro: true, ts_tec_ombra: true, ts_maglia: true, tb_q0: "La Via Lunga", tb_q1: "Ragazzi del Mercato", tb_q2: "Collegio San Biagio", tb_q3: "Accademia del Faro", tb_s0: "La Via Lunga", tb_s1: "Accademia del Faro", ts_l2_venditore: true, ts_l2_fioraia: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__torneo.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  for (const z of ["ts_finale", "ts_piazza"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "ts_iole"); await L.advance(page);
  await L.goAct(page, 0, 12); await L.advance(page); if ((await L.zone(page)) !== "ts_finale") errors.push("non si va alla finale: " + (await L.zone(page)));
  if (w === 390) await L.shot(page, "ts_finale");
  await L.goAct(page, 9, 17); await L.advance(page); if ((await L.zone(page)) !== "ts_spogl") errors.push("non si entra nello spogliatoio: " + (await L.zone(page)));
  if (w === 390) await L.shot(page, "ts_spogliatoio");
  await L.talk(page, "ts_tito"); await L.advance(page, ["nessuno passa"]); await L.talk(page, "ts_alba"); await L.advance(page, ["la partita più bella"]); await L.talk(page, "ts_remo"); await L.advance(page, ["la Via Lunga, e basta"]);
  await L.goAct(page, 10, 12); await L.advance(page);
  await L.talk(page, "ts_ettore"); await L.advance(page);
  await L.talk(page, "ts_iole"); await page.evaluate(() => window.T_.click("Gioca la finale")); await page.waitForTimeout(500); await vgStart(page); await page.waitForTimeout(800);
  await page.evaluate(() => { const S = window.__vignette.state; S.data.usate = { tiro3: 1, muro: 1, ombra: 1 }; }); await vgEnd(page, 3, 2); await L.advance(page);
  const ends = ["Nadia ha un'idea", "Facciamo festa", "Ettore, l'anno prossimo", "Maestra, riapra"];
  for (const e of ends) {
    await page.evaluate(() => { const K = window.__torneo._dbg.K; K.setStep(3, 3); K.enterZone("ts_finale"); }); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "ts_iole"); await L.advance(page, [e]); if (w === 390 && e === ends[0]) await L.shot(page, "ts_fine");
  }
  const i = await L.info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate(() => window.__torneo._dbg.K.mem().ends.length); if (n < 4) errors.push("finali trovati " + n + " su 4");
  L.check(`Il Torneo delle Cento Scuole · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); })().catch((e) => { console.error("✗ torneo:", e.message); process.exit(1); });
