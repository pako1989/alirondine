// tests/regno.cjs - «Cronache del Regno Ultimo»: il motore Duello di Corona, le Casate, i capitoli, i luoghi, i finali
const L = require("./lib.cjs");
const MOD = { mod: "__regno", key: "ali-di-rondine.regno" };
const cnEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__corona.state; if (!S) return; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(300); };
const cnBtn = (p) => p.evaluate(() => { const b = document.querySelector(".cnOv .btns button"); if (b) { b.click(); return true; } return false; });
// gioca davvero la partita: la fa passare per i consigli e poi chiude con il risultato voluto
async function duello(page, a, b, errors) {
  await page.waitForTimeout(500);
  if (!(await page.evaluate(() => !!window.__corona.state))) { errors.push("il Duello di Corona non parte"); return; }
  await cnEnd(page, a, b); await page.waitForTimeout(300);
  for (let k = 0; k < 12 && (await cnBtn(page)); k++) await page.waitForTimeout(250);
}
async function reach(page, errors, z, skip) { const bad = (await L.reachAll(page, z)).filter((b) => !(skip && skip.test(b))); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
// sceglie una voce di menu dopo aver fatto scorrere il dialogo, poi lascia che advance chiuda il resto
async function pick(page, re) { for (let k = 0; k < 25; k++) { await page.waitForTimeout(120); if (await page.evaluate((re) => window.T_.click(re), re)) { await page.waitForTimeout(150); return true; } await page.evaluate(() => window.T_.click("^Continua")); } return false; }
const SAVE1 = (o = {}) => Object.assign({ v: 1, ch: 1, step: {}, done: {}, diffSet: true, intro: {}, st: {}, flags: {} }, o);

async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__regno.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  await reach(page, errors, "re_cortile"); if (w === 390) await L.shot(page, "re_cortile");
  await L.talk(page, "re_fiorino"); if (!(await pick(page, "Cantami"))) errors.push("menu Fiorino"); await L.advance(page, ["A dopo"]);
  await L.talk(page, "re_mirta"); await L.advance(page);
  await L.talk(page, "re_evaristo"); await pick(page, "Vado"); await L.advance(page);
  await L.talk(page, "re_evaristo"); if (!(await pick(page, "Che cos.è il Patto"))) errors.push("menu Evaristo"); await pick(page, "Come funziona"); await L.advance(page, ["Vado"]);
  let i = await L.info(page); if (i.step[1] !== 1) errors.push("il Consiglio non si apre: " + JSON.stringify(i.step));
  // la Sala del Trono: si entra dal portone del palazzo
  await page.evaluate(() => window.__regno._dbg.K.go("re_trono", 10, 12)); await page.waitForTimeout(500); await L.advance(page);
  if ((await L.zone(page)) !== "re_trono") errors.push("non si entra nel Palazzo");
  await reach(page, errors, "re_trono"); if (w === 390) await L.shot(page, "re_trono");
  for (const id of ["re_gatto", "re_perla", "re_cedro", "re_mirta"]) { await L.talk(page, id); await L.advance(page); }
  await L.talk(page, "re_anselmo"); await L.advance(page, ["Al Generale"]);
  i = await L.info(page); if (i.step[1] !== 2) errors.push("il Re non manda alle Mura: " + JSON.stringify(i.step));
  if ((await page.evaluate(() => window.__regno._dbg.K.liv("lupi"))) < 1) errors.push("favore dei Lupi non assegnato");
  await page.evaluate(() => window.__regno._dbg.K.go("re_mura", 2, 8)); await page.waitForTimeout(500); await L.advance(page);
  await reach(page, errors, "re_mura"); if (w === 390) await L.shot(page, "re_mura");
  await L.talk(page, "re_brando"); if (!(await pick(page, "Gioca la Partita"))) errors.push("menu Brando");
  await duello(page, 3, 1, errors); await L.advance(page);
  i = await L.info(page); if (i.step[1] !== 3) errors.push("la Partita d'Assedio non sblocca Oriele: " + JSON.stringify(i.step));
  await L.talk(page, "re_oriele"); await pick(page, "Come stai"); await pick(page, "Che cosa vuole"); await L.advance(page, ["Finiamo la giornata"]);
  i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  const m = await page.evaluate(() => { const x = window.__salone.machine("corona"); return x && x.eng; }); if (m !== "__corona") errors.push("cabinato del Duello di Corona mancante");
  L.check(`Cronache del Regno Ultimo · capitolo 1 (${w} px)`, errors); await browser.close();
}
// salvataggio del capitolo 2 (primo capitolo concluso); st: favori delle Casate
const SAVE2 = (st = {}, flags = {}, step = {}) => ({ v: 1, ch: 2, step: Object.assign({ 1: 5 }, step), done: { 1: "stendardo" }, diffSet: true, intro: { ch1: 1, re_cortile: 1, re_trono: 1, re_mura: 1 }, st, flags: Object.assign({ re_prima: "lupi", re_info_lupi: true, re_info_gabbiani: true, re_info_cervi: true }, flags) });
const toLink = (page, x, y) => page.evaluate(([x, y]) => { const TW = window.__tr.TW; TW.x = x * 16 + 8; TW.y = y * 16 + 12; }, [x, y]);
async function c2(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE2() });
  await page.evaluate(() => window.__regno.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  if ((await L.zone(page)) !== "re_cortile") errors.push("il capitolo 2 non parte dal Cortile");
  await L.talk(page, "re_oriele"); await L.advance(page);
  let i = await L.info(page); if (i.step[2] !== 1) errors.push("Oriele non apre il giro: " + JSON.stringify(i.step));
  // le uscite vere: si cammina sulle tessere di passaggio, andata e ritorno
  const hops = [["re_cortile", [16, 21], "re_strada"], ["re_strada", [0, 10], "re_forte"], ["re_forte", [29, 9], "re_strada"], ["re_strada", [29, 10], "re_porto"], ["re_porto", [0, 9], "re_strada"], ["re_strada", [15, 21], "re_bosco"], ["re_bosco", [14, 19], "re_strada"], ["re_strada", [15, 0], "re_cortile"]];
  for (const [from, [x, y], to] of hops) {
    if ((await L.zone(page)) !== from) { await page.evaluate(([f]) => window.__regno._dbg.K.go(f, 15, 3), [from]); await page.waitForTimeout(400); await L.advance(page); }
    await page.waitForTimeout(250); await toLink(page, x, y); await page.waitForTimeout(700); await L.advance(page);
    if ((await L.zone(page)) !== to) errors.push(`uscita ${from} ${x},${y} non porta a ${to}: ${await L.zone(page)}`);
  }
  await page.evaluate(() => window.__regno._dbg.K.go("re_strada", 15, 3)); await page.waitForTimeout(500); await L.advance(page);
  await reach(page, errors, "re_strada"); if (w === 390) await L.shot(page, "re_strada");
  await L.talk(page, "re_fiorino"); await L.advance(page, ["A dopo"]);
  // il tavolo della mappa
  await L.goAct(page, 17, 4); await page.waitForTimeout(300);
  const mp = await page.evaluate(() => window.T_.btns().map((o) => o.t).join("|")); if (!/Forte dei Lupi/.test(mp) || !/Bosco dei Cervi/.test(mp)) errors.push("la mappa non elenca le Casate: " + mp);
  await page.evaluate(() => window.T_.click("Forte dei Lupi")); await page.waitForTimeout(600); await L.advance(page);
  if ((await L.zone(page)) !== "re_forte") errors.push("la mappa non porta al Forte");
  // Forte: gli amici contano: il cancello è chiuso (E) finché la Casata non è alleata
  const gate = await page.evaluate(() => window.__tr.trMap(window.__borgoApi.TRZ.re_forte)[5][14]); if (gate !== "E") errors.push("il cancello dei Lupi dovrebbe essere chiuso: " + gate);
  await L.talk(page, "re_tarsia"); await L.advance(page);
  await L.talk(page, "re_brando"); if (!(await pick(page, "Una casa per i tuoi soldati"))) errors.push("opzione di Brando assente"); await L.advance(page, ["Non ora"]);
  i = await L.info(page); if (i.st.lupi < 3) errors.push("favore dei Lupi " + i.st.lupi);
  const g2 = await page.evaluate(() => window.__tr.trMap(window.__borgoApi.TRZ.re_forte)[5][14]); if (g2 === "E") errors.push("il cancello dei Lupi non si apre con l'alleanza");
  await reach(page, errors, "re_forte"); if (w === 390) await L.shot(page, "re_forte");
  await L.goAct(page, 14, 2); await L.advance(page);
  if (!(await page.evaluate(() => window.__borgoApi.cosOwned().includes("re_lupi")))) errors.push("cotta dei Lupi non ottenuta");
  await L.talk(page, "re_ulderico"); if (!(await pick(page, "Duello di Corona"))) errors.push("scelta di Ulderico"); await duello(page, 3, 1, errors); await L.advance(page);
  if (!(await L.info(page)).flags.re_t_lupi) errors.push("prova dei Lupi non conclusa");
  // Porto
  await page.evaluate(() => window.__regno._dbg.K.go("re_porto", 1, 9)); await page.waitForTimeout(500); await L.advance(page);
  await reach(page, errors, "re_porto", /oggetto [xE] (23,2|23,7)/); if (w === 390) await L.shot(page, "re_porto");
  await L.talk(page, "re_nereo"); if (!(await pick(page, "Che cosa ricordi"))) errors.push("menu di Nereo"); await L.advance(page, ["Grazie, Nereo"]);
  await L.talk(page, "re_scilla"); await L.advance(page);
  await L.talk(page, "re_perla"); if (!(await pick(page, "Il terzo"))) errors.push("prova di Perla"); await L.advance(page);
  if (!(await L.info(page)).flags.re_t_gabbiani) errors.push("prova dei Gabbiani non conclusa");
  // Bosco
  await page.evaluate(() => window.__regno._dbg.K.go("re_bosco", 14, 18)); await page.waitForTimeout(500); await L.advance(page);
  await reach(page, errors, "re_bosco", /oggetto [xE] (14,2|14,6)/); if (w === 390) await L.shot(page, "re_bosco");
  await L.talk(page, "re_selvano"); await L.advance(page);
  await L.talk(page, "re_bruna"); if (!(await pick(page, "Che cosa hai trovato"))) errors.push("menu di Bruna"); await L.advance(page, ["Torno al sentiero"]);
  await L.goAct(page, 26, 6); await L.advance(page); if (!(await L.info(page)).lore.includes("l_palla")) errors.push("pagina della Palla non trovata");
  await L.talk(page, "re_cedro"); if (!(await pick(page, "Chi gioca, risponde"))) errors.push("prova di Cedro"); await L.advance(page);
  i = await L.info(page); if (!i.flags.re_t_cervi || i.step[2] !== 2) errors.push("giro non concluso: " + JSON.stringify(i.step));
  // ritorno a Castelalto: il biglietto e la scelta su Mirta
  await page.evaluate(() => window.__regno._dbg.K.go("re_cortile", 16, 19)); await page.waitForTimeout(500); await L.advance(page);
  await L.talk(page, "re_evaristo"); if (!(await pick(page, "Chiedere tempo"))) errors.push("scelta su Mirta assente"); await L.advance(page);
  i = await L.info(page); if (i.step[2] !== 3 || i.flags.re_mirta !== "indaga") errors.push("la scelta su Mirta non conta: " + JSON.stringify(i.step));
  await L.talk(page, "re_mirta"); await L.advance(page);
  await page.evaluate(() => window.__regno._dbg.K.go("re_trono", 10, 12)); await page.waitForTimeout(500); await L.advance(page);
  await L.talk(page, "re_oriele"); await L.advance(page);
  i = await L.info(page); if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify(i.step));
  if (!(await page.evaluate(() => window.__borgoApi.cosOwned().includes("re_c2")))) errors.push("mantello del capitolo 2 non ottenuto");
  L.check(`Cronache del Regno Ultimo · capitolo 2 (${w} px)`, errors); await browser.close();
}
// il capitolo 2 a Casate alleate: tutti i cancelli, i forzieri, la partita a scelta con una normale, le tre risposte su Mirta
async function c2b(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE2({ lupi: 4, gabbiani: 4, cervi: 4 }, {}, { 2: 1 }) });
  await page.evaluate(() => window.__regno.open()); await page.evaluate(() => window.T_.click("Continua|Inizia il Capitolo 2")); await L.advance(page);
  for (const [z, ch] of [["re_forte", [14, 2]], ["re_porto", [23, 2]], ["re_bosco", [14, 2]]]) {
    await page.evaluate((z) => window.__regno._dbg.K.go(z, 14, 18), z); await page.waitForTimeout(500); await L.advance(page);
    await reach(page, errors, z);
    const gt = await page.evaluate(([z, a]) => { const m = window.__tr.trMap(window.__borgoApi.TRZ[z]); return [m[a[1] + 3] ? "" : "", m.flat().includes("E")]; }, [z, ch]); if (gt[1]) errors.push(z + ": cancello ancora chiuso a Casate alleate");
    await L.goAct(page, ch[0], ch[1]); await L.advance(page);
  }
  const own = await page.evaluate(() => window.__borgoApi.cosOwned()); ["re_lupi", "re_gabbiani", "re_cervi"].forEach((c) => { if (!own.includes(c)) errors.push("cosmetico mancante " + c); });
  const sc = await page.evaluate(() => window.__borgoApi.TRZ.re_forte && 1);
  // scorta di casata: tre soldati ghost in fila
  const gh = await page.evaluate(() => (window.__tr.TW.z.npcs || []).filter((n) => n.ghost).length); if (gh !== 3) errors.push("scorte delle Casate: " + gh);
  // partita normale a scelta con Ulderico
  await page.evaluate(() => window.__regno._dbg.K.go("re_forte", 28, 9)); await page.waitForTimeout(500); await L.advance(page);
  await L.stubMatch(page, true); await L.talk(page, "re_ulderico"); if (!(await pick(page, "Una partita normale"))) errors.push("partita normale assente"); await page.waitForTimeout(500); await L.advance(page);
  const lm = await page.evaluate(() => window.__lastMatch || {}); if (lm.id !== "re_forte" || !/,/.test(lm.alt || "")) errors.push("partita non a scelta: " + JSON.stringify(lm));
  if (!(await L.info(page)).flags.re_t_lupi) errors.push("prova dei Lupi (partita normale) non conclusa");
  L.check(`Cronache del Regno Ultimo · capitolo 2, Casate alleate (${w} px)`, errors); await browser.close();
}
async function mirta(w, label, re, flag) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE2({}, { re_t_lupi: true, re_t_gabbiani: true, re_t_cervi: true }, { 2: 2 }) });
  await page.evaluate(() => window.__regno.open()); await page.evaluate(() => window.T_.click("Continua|Inizia il Capitolo 2")); await L.advance(page);
  await page.evaluate(() => window.__regno._dbg.K.setStep(2, 2)); await page.evaluate(() => window.__regno._dbg.K.api.trGo("re_cortile")); await page.waitForTimeout(600);
  await L.talk(page, "re_evaristo"); if (!(await pick(page, re))) errors.push("scelta assente " + label); await L.advance(page);
  const i = await L.info(page); if (i.flags.re_mirta !== flag) errors.push(label + ": " + JSON.stringify(i.flags));
  L.check(`Cronache del Regno Ultimo · Mirta: ${label} (${w} px)`, errors); await browser.close();
}
const ONLY = process.argv[2] || "";
const RUN = [["c1", () => c1(390)], ["c1", () => c1(320)], ["c2", () => c2(390)], ["c2", () => c2(320)], ["c2b", () => c2b(390)], ["c2b", () => c2b(320)], ["mirta", () => mirta(390, "accusata", "Accusare Mirta", "accusata")], ["mirta", () => mirta(390, "difesa", "Difendere Mirta", "difesa")]];
(async () => { for (const [n, f] of RUN) if (!ONLY || n === ONLY) await f(); })().catch((e) => { console.error("✗ regno:", e.message); process.exit(1); });
