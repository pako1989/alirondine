// tests/missione.cjs - «Missione Senza Ritorno»: zone raggiungibili, capitolo 1 completo, scontro «Squadra in Pausa» vero (apertura, comandi, vittoria)
const L = require("./lib.cjs");
const MOD = { mod: "__missione", key: "ali-di-rondine.missione" };
const K_ = "window.__missione._dbg.K";
const ZONES = ["ms_normanna", "ms_sala", "ms_omega", "ms_aldila", "ms_lab"];
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function start(w, save, pick) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => window.__missione.open()); await r.page.waitForTimeout(500);
  await L.advance(r.page, pick ? [pick] : []).catch(() => {}); return r;
}
const stubFight = (p) => p.evaluate(() => { window.__pausa.start = (o) => { window.__paLog = { mates: (o.mates || []).length, waves: (o.waves || []).length, bonus: o.bonus }; setTimeout(() => o.onDone({ win: true, a: 9, b: 0 }), 10); return true; }; });
async function zonesTest(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1 } });
  for (const z of ZONES) {
    try { await go(page, z); await L.shot(page, "ms_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Missione · zone (${w} px)`, errors); await browser.close();
}
async function flow(w, alt) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1 } });
  await stubFight(page);
  const st = async (n, what) => { const i = await L.info(page); if (i.step[1] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
  try {
    await go(page, "ms_normanna", 7, 11); await L.talk(page, "ms_miranda"); await L.advance(page, [alt ? "Lavoro per me" : "Grazie"]); await st(1, "dopo Miranda");
    await L.talk(page, "ms_jacopo"); await L.advance(page, [alt ? "Ti fidi" : "Ci riprendiamo"]);
    await L.talk(page, "ms_edi"); await L.advance(page);
    await go(page, "ms_sala", 7, 7); await L.talk(page, "ms_fumo"); await L.advance(page, [alt ? "cosa ci guadagna" : "Perché proprio"]); await st(2, "dopo Fumo");
    await go(page, "ms_omega", 3, 10); await L.talk(page, "ms_vecchio"); await L.advance(page, [alt ? "Farò" : "Lo riporto"]);
    await go(page, "ms_aldila", 8, 9); await L.talk(page, "ms_aria"); await L.advance(page);
    if (alt) { await L.talk(page, "ms_barista"); await L.advance(page, ["Sbatti"]); } else { await L.talk(page, "ms_aria"); await L.advance(page, ["Il taccuino serve"]); }
    await go(page, "ms_lab", 7, 7); await L.talk(page, "ms_mordini"); await L.advance(page, [alt ? "Cerbero paga" : "squadre sparite"]);
    await L.talk(page, "ms_cinzia"); await L.advance(page);
    await go(page, "ms_omega", 22, 10); await L.talk(page, "ms_recluta"); await L.advance(page, [alt ? "pretendi" : "nome vero", "Vai sul ponte"]); await L.advance(page).catch(() => {});
    await st(3, "dopo il ponte");
    const lg = await page.evaluate(() => window.__paLog); if (!lg || lg.mates < 1 || lg.waves !== 3 || lg.bonus < 1) errors.push("scontro mal configurato: " + JSON.stringify(lg));
    await go(page, "ms_normanna", 6, 10); await L.talk(page, "ms_jolly"); await L.advance(page, ["Si parte"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
    const c = await page.evaluate((k) => eval(k).crew.count(), K_); if (c !== 4) errors.push("squadra: " + c + " invece di 4");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Missione · capitolo 1${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
async function realFight(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1, ms_omega: 1 }, ch: 1, step: { 1: 2 }, flags: { ms_firmato: 1, cr_n: 2, cr_ms_miranda: 1, cf_ms_miranda: 1, cr_ms_jacopo: 2, cf_ms_jacopo: 1 } });
  try {
    await go(page, "ms_omega", 22, 10); await L.talk(page, "ms_recluta");
    for (let k = 0; k < 8; k++) { const hit = await page.evaluate(() => { const b = [...document.querySelectorAll("#choices button")].find((x) => /Vai sul ponte/.test(x.innerText)); if (b) { b.click(); return 1; } const c = [...document.querySelectorAll("#choices button")].find((x) => /^Continua/.test(x.innerText.trim())); if (c) c.click(); return 0; }); if (hit) break; await page.waitForTimeout(400); }
    for (let k = 0; k < 6; k++) { const ok = await page.evaluate(() => !!(window.__pausa.state)); if (ok) break; await page.evaluate(() => { const c = [...document.querySelectorAll("#choices button")].find((x) => /^Continua/.test(x.innerText.trim())); if (c) c.click(); }); await page.waitForTimeout(400); }
    await page.waitForTimeout(800);
    let s = await page.evaluate(() => window.__pausa.state && { tut: window.__pausa.state.tut(), phase: window.__pausa.state.phase });
    if (!s) throw new Error("scontro vero non aperto");
    await L.shot(page, "ms_pausa_tut_" + w);
    if (s.tut) await page.evaluate(() => { const b = [...document.querySelectorAll("#paOv .tut button")].find((x) => /Gioca|Salta/.test(x.innerText)); if (b) b.click(); });
    await page.waitForTimeout(300);
    const h0 = await page.evaluate(() => window.__pausa.state.hero);
    await page.evaluate(() => window.__pausa.state.tap(30, 60)); await page.waitForTimeout(400);
    const h1 = await page.evaluate(() => window.__pausa.state.hero); if (!(h1.ty < h0.ty - 10)) errors.push("tocco sul terreno non sposta il Campione: " + JSON.stringify([h0, h1]));
    await page.waitForTimeout(2500); const nf = await page.evaluate(() => window.__pausa.state.foes); if (nf < 1) errors.push("nessun nemico in campo");
    await page.evaluate(() => document.querySelector("#paWh").click()); await page.waitForTimeout(200);
    const pz = await page.evaluate(() => window.__pausa.state.paused); if (!pz) errors.push("la Ruota non ferma il tempo");
    await L.shot(page, "ms_pausa_ruota_" + w);
    await page.evaluate(() => window.__pausa.state.finish(true)); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
    const g = await page.evaluate((k) => eval(k).crew.has("ms_garro"), K_); if (!g) errors.push("Arcangelo non reclutato dopo la vittoria");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Missione · Squadra in Pausa vera (${w} px)`, errors); await browser.close();
}
const CREW1 = { cr_n: 4, cr_ms_miranda: 1, cf_ms_miranda: 1, cr_ms_jacopo: 2, cf_ms_jacopo: 1, cr_ms_mordini: 3, cr_ms_garro: 4, ms_c1_done: 1 };
const S2 = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, ms_purgatorio: 1, ms_illio: 1, ms_isola: 1, ms_orizzonte: 1, ms_omega: 1 }, ch: 2, step: { 1: 4 }, done: { 1: "ok" }, flags: CREW1 };
async function zones2(w) {
  const { browser, page, errors } = await start(w, S2, "Inizia il Capitolo 2");
  for (const z of ["ms_purgatorio", "ms_cella", "ms_illio", "ms_torre", "ms_isola", "ms_orizzonte"]) {
    try { await page.evaluate((k) => { const K = eval(k); K.F.set("ms_purg_vinto", true); K.F.set("ms_torre_vinta", true); }, K_); await go(page, z); await L.shot(page, "ms2_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Missione · capitolo 2 zone (${w} px)`, errors); await browser.close();
}
async function flow2(w, alt) {
  const { browser, page, errors } = await start(w, S2, "Inizia il Capitolo 2");
  await stubFight(page);
  const st = async (n, what) => { const i = await L.info(page); if (i.step[2] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
  const jolly = async (dest) => { await go(page, "ms_normanna", 6, 10); await L.talk(page, "ms_jolly"); await L.advance(page, [dest]); await page.waitForTimeout(400); await L.advance(page).catch(() => {}); };
  try {
    await go(page, "ms_sala", 7, 7); await L.talk(page, "ms_fumo"); await L.advance(page, [alt ? "Cosa c'è nei dati" : "Una detenuta"]); await st(1, "dopo Fumo");
    await jolly("Il Purgatorio"); if ((await L.zone(page)) !== "ms_purgatorio") errors.push("viaggio al Purgatorio fallito");
    await L.talk(page, "ms_curiale"); await L.advance(page, ["Combatti"]); await L.advance(page).catch(() => {});
    await L.talk(page, "ms_guardia"); await L.advance(page);
    await go(page, "ms_cella", 7, 7); await L.talk(page, "ms_zero"); await L.advance(page, [alt ? "Ti do i file" : "Vieni per le squadre"]);
    await jolly("Porto Illio"); await L.talk(page, "ms_liara"); await L.advance(page, [alt ? "Quanto ti devo" : "Mi sei mancata"]);
    await go(page, "ms_torre", 8, 9); await L.talk(page, "ms_capo"); await L.advance(page, ["Passa con la forza"]); await L.advance(page).catch(() => {});
    await L.talk(page, "ms_nassana"); await L.advance(page, [alt ? "Lascia che Tano" : "Consegnala"]);
    await jolly("Isola Bianca"); await L.talk(page, "ms_tali"); await L.advance(page, ["Proteggi Tali", alt ? "Li prende Cerbero" : "Tienili tu"]); await L.advance(page).catch(() => {});
    await st(2, "dopo i tre reclutamenti");
    await jolly("Borgo Orizzonte"); await st(3, "arrivo a Orizzonte");
    await L.talk(page, "ms_sindaca"); await L.advance(page);
    for (const [x, y] of [[14, 2], [27, 11], [14, 19]]) { await L.goAct(page, x, y); await L.advance(page); }
    await st(4, "dopo le torri");
    await L.talk(page, "ms_prelato"); await L.advance(page, ["Difendi Orizzonte"]); await L.advance(page).catch(() => {}); await st(5, "dopo il Prelato");
    await L.talk(page, "ms_ascanio"); await L.advance(page, [alt ? "Faccio quello che serve" : "Ho bisogno delle loro navi"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
    const c = await page.evaluate((k) => eval(k).crew.count(), K_); if (c !== 7) errors.push("squadra: " + c + " invece di 7");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Missione · capitolo 2${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
const CREW2 = Object.assign({}, CREW1, { cr_n: 7, cr_ms_zero: 5, cr_ms_tano: 6, cr_ms_tali: 7, ms_c2_done: 1 });
const S3 = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, ch3: 1, ms_purgatorio: 1, ms_illio: 1, ms_isola: 1, ms_orizzonte: 1, ms_omega: 1, ms_flotta: 1, ms_pragia: 1, ms_relitto: 1 }, ch: 3, step: { 1: 4, 2: 6 }, done: { 1: "ok", 2: "ok" }, st: { risorse: 12, esempio: 7, spregio: 7 }, flags: CREW2 };
async function zones3(w) {
  const { browser, page, errors } = await start(w, S3, "Inizia il Capitolo 3");
  for (const z of ["ms_flotta", "ms_pragia", "ms_relitto", "ms_illio", "ms_omega", "ms_purgatorio"]) {
    try { await page.evaluate((k) => { const K = eval(k); ["ms_lm_ms_miranda", "ms_lm_ms_tano", "ms_lm_ms_garro", "ms_lm_ms_jacopo", "ms_talidi_detto"].forEach((f) => K.F.set(f, true)); K.clock.set(1, 2); }, K_); await go(page, z); await L.shot(page, "ms3_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Missione · capitolo 3 zone (${w} px)`, errors); await browser.close();
}
async function flow3(w, alt) {
  const { browser, page, errors } = await start(w, S3, "Inizia il Capitolo 3");
  await stubFight(page);
  const st = async (n, what) => { const i = await L.info(page); if (i.step[3] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
  const jolly = async (dest) => { await go(page, "ms_normanna", 6, 10); await L.talk(page, "ms_jolly"); await L.advance(page, [dest]); await page.waitForTimeout(400); await L.advance(page).catch(() => {}); };
  const F = (f) => page.evaluate(([k, f]) => eval(k).F.get(f), [K_, f]);
  try {
    await go(page, "ms_sala", 7, 7); await L.talk(page, "ms_fumo"); await L.advance(page, [alt ? "Leali a me" : "Non li compro"]); await st(1, "dopo Fumo");
    await go(page, "ms_normanna", 25, 5); await L.goAct(page, 25, 4); await L.advance(page, ["Corazza"]);
    if (!(await F("ms_upg"))) errors.push("miglioria non installata");
    await jolly("Miranda"); if ((await L.zone(page)) !== "ms_illio") errors.push("viaggio Miranda fallito");
    await L.talk(page, "ms_niko"); await L.advance(page, ["Proteggi Oriana", alt ? "Consegnalo" : "Lascialo andare"]);
    await L.talk(page, "ms_oriana"); await L.advance(page, [alt ? "Lasciala partire" : "Miranda, vai tu"]);
    await jolly("Garro"); await L.talk(page, "ms_sidonio"); await L.advance(page, ["Libera il vicolo"]); await L.advance(page).catch(() => {});
    await L.talk(page, "ms_sidonio"); await L.advance(page, [alt ? "Spostati" : "Resta in mezzo"]);
    await jolly("Zero"); if ((await L.zone(page)) !== "ms_pragia") errors.push("viaggio Pragia fallito");
    for (const [x, y] of [[9, 8], [25, 9], [17, 16]]) { await L.goAct(page, x, y); await L.advance(page); }
    await L.goAct(page, 22, 8); await L.advance(page, ["Abbatti gli automi", alt ? "Prima scarichiamo" : "Fallo saltare"]); await L.advance(page).catch(() => {});
    await st(2, "dopo tre conti");
    await jolly("Tali"); await L.talk(page, "ms_rana"); await L.advance(page);
    await L.talk(page, "ms_koris"); await L.advance(page, ["Sali sulla nave"]); await L.advance(page).catch(() => {});
    await L.talk(page, "ms_koris"); await L.advance(page, [alt ? "Mostra il diario" : "Il nemico sono"]);
    await jolly("Tano"); await L.talk(page, "ms_liara"); await L.advance(page, ["Aspetta la notte"]); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
    await L.talk(page, "ms_talidi"); await L.advance(page, ["Ferma le guardie"]); await L.advance(page).catch(() => {});
    await L.talk(page, "ms_talidi"); await L.advance(page, [alt ? "Lascia che Tano" : "Ti proteggiamo"]);
    await L.talk(page, "ms_nicola"); await L.advance(page, [alt ? "Disarmalo" : "parlagli"]);
    await jolly("Jacopo"); await L.talk(page, "ms_ferro"); await L.advance(page, [alt ? "Fagli dire" : "Registra tutto"]);
    await jolly("Mordini"); await go(page, "ms_lab", 7, 7); await L.talk(page, "ms_cinzia"); await L.advance(page, ["Scendi nel seminterrato", alt ? "Tienili" : "Distruggili"]); await L.advance(page).catch(() => {});
    const loy = await page.evaluate((k) => ["ms_miranda", "ms_garro", "ms_zero", "ms_tali", "ms_tano", "ms_jacopo", "ms_mordini"].filter((id) => eval(k).F.get("ms_loy_" + id)), K_);
    if (loy.length !== (alt ? 5 : 7)) errors.push("leali: " + loy.join(","));
    await jolly("relitto"); await st(3, "arrivo al relitto"); await L.goAct(page, 26, 10); await L.advance(page, ["Stacca il trasponditore"]); await L.advance(page).catch(() => {});
    await L.talk(page, "ms_legione"); await L.advance(page, [alt ? "Spediscilo" : "Attivalo"]); await st(4, "dopo Legione");
    await go(page, "ms_sala", 7, 7); await L.talk(page, "ms_fumo"); await L.advance(page, [alt ? "Riporterò la vittoria" : "Riporterò indietro"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[3] !== "ok") errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
    const c = await page.evaluate((k) => eval(k).crew.count(), K_); if (c !== (alt ? 7 : 8)) errors.push("squadra: " + c);
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Missione · capitolo 3${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
(async () => {
  if (process.env.ONLY === "3") { await zones3(390); await flow3(390, false); await flow3(390, true); return; }
  for (const w of [390, 320]) { await zonesTest(w); await flow(w, false); }
  await flow(390, true);
  for (const w of [390, 320]) { await zones2(w); await flow2(w, false); }
  await flow2(390, true);
  for (const w of [390, 320]) { await zones3(w); await flow3(w, false); }
  await flow3(390, true);
  await realFight(390);
})();
