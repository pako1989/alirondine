// tests/fischietto.cjs - «Il Fischietto»: Dossier (prove, confronto di due voci, contraddizioni, verdetto), Rapporti, Inventario, orologio, buste
const L = require("./lib.cjs");
const MOD = { mod: "__fischietto", key: "ali-di-rondine.fischietto" };
const K_ = "window.__fischietto._dbg.K";
const info = (p) => L.info(p);
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__fischietto.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  if (w === 390) await L.shot(page, "fi_citta");
  for (const z of ["fi_citta"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await go(page, "fi_citta_i0", 10, 10); { const bad = await L.reachAll(page, "fi_citta_i0"); if (bad.length) errors.push("sede: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "fi_sede");
  await L.talk(page, "fi_edvige"); await L.advance(page);
  let i = await info(page); if (i.step[1] !== 1) errors.push("dopo Edvige: " + JSON.stringify(i.step));
  const n0 = await page.evaluate((k) => eval(k).dossier.list("gomito").length, K_); if (n0 !== 2) errors.push("dossier iniziale " + n0);
  // l'avviso in piazza
  await go(page, "fi_citta", 12, 13); await L.goAct(page, 12, 12); await L.advance(page);
  await go(page, "fi_citta_i2", 10, 10); { const bad = await L.reachAll(page, "fi_citta_i2"); if (bad.length) errors.push("videoteca: " + bad.join(", ")); }
  await L.talk(page, "fi_tullio"); await L.advance(page, ["Aspetta il pomeriggio"]); await L.talk(page, "fi_tullio"); await L.advance(page);
  await go(page, "fi_citta_i1", 10, 10);
  await page.evaluate((k) => eval(k).clock.set(1, 0), K_); await page.waitForTimeout(300);
  await L.talk(page, "fi_ottavio"); await L.advance(page);
  await go(page, "fi_campo", 2, 10); { const bad = await L.reachAll(page, "fi_campo"); if (bad.length) errors.push("campo: " + bad.join(", ")); }
  await L.talk(page, "fi_pino"); await L.advance(page);
  const n1 = await page.evaluate((k) => eval(k).dossier.list("gomito").length, K_); if (n1 !== 6) errors.push("dossier " + n1 + "/6");
  // confronto reale tra due voci dalla schermata del dossier
  await page.evaluate((k) => eval(k).dossier.open("gomito", () => {}, true), K_); await page.waitForTimeout(300);
  if (w === 390) await L.shot(page, "fi_dossier");
  await page.evaluate(() => { window.T_.click("Il tuo referto"); }); await page.waitForTimeout(250);
  await page.evaluate(() => { window.T_.click("Referto dell'infermeria"); }); await page.waitForTimeout(250);
  const f1 = await page.evaluate((k) => eval(k).dossier.found("gomito"), K_); if (f1 !== 1) errors.push("confronto non riuscito: " + f1);
  await page.evaluate((k) => { const F = eval(k).F; F.set("dl_gomito_1", true); F.set("dl_gomito_2", true); }, K_);
  await page.evaluate(() => { window.T_.click("Indietro"); }); await page.waitForTimeout(250); await L.advance(page).catch(() => {});
  await go(page, "fi_citta_i0", 10, 10);
  await L.talk(page, "fi_edvige"); await L.advance(page, ["Emetti il verdetto", "Assolvo Lupi"]); await L.advance(page).catch(() => {});
  i = await info(page); if (i.done[1] !== "assolvi") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step, i.st]));
  if (i.st.integrita < 5) errors.push("integrità " + i.st.integrita);
  L.check(`Il Fischietto · capitolo 1 (${w} px)`, errors); await browser.close();
}
const BASE = { v: 1, diffSet: true, intro: { ch1: 1, fi_citta: 1, fi_campo: 1 }, st: { integrita: 4, fama: 1 } };
async function c2(w) {
  const save = Object.assign({}, BASE, { ch: 2, step: { 1: 2 }, done: { 1: "assolvi" } });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__fischietto.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  await go(page, "fi_citta_i0", 10, 10); await L.talk(page, "fi_edvige"); await L.advance(page);
  let i = await info(page); if (i.step[2] !== 1) errors.push("dopo Edvige c2: " + JSON.stringify(i.step));
  await go(page, "fi_citta", 16, 19); { const bad = await L.reachAll(page, "fi_citta"); if (bad.length) errors.push("fi_citta (patch c2): " + bad.join(", ")); }
  await go(page, "fi_molo", 16, 2); if (w === 390) await L.shot(page, "fi_molo");
  { const bad = await L.reachAll(page, "fi_molo"); if (bad.length) errors.push("fi_molo irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "fi_ivano"); await L.advance(page, ["Gli offri un caffè"]);
  await L.talk(page, "fi_rocco"); await L.advance(page);
  await go(page, "fi_molo_i0", 10, 10); { const bad = await L.reachAll(page, "fi_molo_i0"); if (bad.length) errors.push("totosport: " + bad.join(", ")); }
  await L.talk(page, "fi_nilde"); await L.advance(page);
  await go(page, "fi_molo", 16, 3); await page.evaluate((k) => eval(k).clock.set(1, 1), K_); await page.waitForTimeout(300);
  await L.talk(page, "fi_gigio"); await L.advance(page);
  const n = await page.evaluate((k) => eval(k).dossier.list("troppo").length, K_); if (n !== 7) errors.push("dossier " + n + "/7");
  await page.evaluate((k) => { const F = eval(k).F; [0, 1, 2].forEach((j) => F.set("dl_troppo_" + j, true)); }, K_);
  await go(page, "fi_citta_i0", 10, 10); await L.talk(page, "fi_edvige"); await L.advance(page, ["Emetti il verdetto", "Segnala alla Procura"]); await L.advance(page).catch(() => {});
  i = await info(page); if (i.done[2] !== "procura") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Il Fischietto · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w, busta) {
  const save = Object.assign({}, BASE, { ch: 3, step: { 1: 2, 2: 2 }, done: { 1: "assolvi", 2: "procura" }, flags: Object.assign({ rel_fi_livia: 6 }, busta ? { fi_busta: true } : {}) });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__fischietto.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  await go(page, "fi_citta_i0", 10, 10); await L.talk(page, "fi_edvige"); await L.advance(page);
  let i = await info(page); if (i.step[3] !== 1) errors.push("dopo Edvige c3: " + JSON.stringify(i.step));
  await go(page, "fi_campo", 15, 17); await go(page, "fi_stadio", 16, 2); if (w === 390) await L.shot(page, "fi_stadio");
  { const bad = await L.reachAll(page, "fi_stadio"); if (bad.length) errors.push("fi_stadio: " + bad.join(", ")); }
  await L.talk(page, "fi_livia"); await L.advance(page);
  await go(page, "fi_stadio_i0", 10, 10); { const bad = await L.reachAll(page, "fi_stadio_i0"); if (bad.length) errors.push("palco: " + bad.join(", ")); }
  await L.talk(page, "fi_gualtiero"); await L.advance(page);
  await go(page, "fi_stadio_i1", 10, 10); await L.talk(page, "fi_edvige"); await L.advance(page);
  const n = await page.evaluate((k) => eval(k).dossier.list("finale").length, K_); if (n !== 5) errors.push("dossier " + n + "/5");
  await page.evaluate((k) => { const F = eval(k).F; [0, 1, 2].forEach((j) => F.set("dl_finale_" + j, true)); }, K_);
  await L.talk(page, "fi_edvige"); await L.advance(page, ["Decidi cosa fare", "Denuncio il presidente"]); await L.advance(page).catch(() => {});
  i = await info(page); if (i.step[3] !== 2) errors.push("dopo il verdetto: " + JSON.stringify(i.step));
  await go(page, "fi_stadio_i2", 10, 10); { const bad = await L.reachAll(page, "fi_stadio_i2"); if (bad.length) errors.push("spogliatoio: " + bad.join(", ")); }
  await L.talk(page, "fi_quarto"); await L.advance(page, ["Entra in campo", "Cartellino giallo", "Ignori il segno", "Lasci correre"]).catch(() => {}); await L.advance(page).catch(() => {});
  const want = busta ? "riscatto" : "argento";
  i = await info(page); if (i.done[3] !== want || !i.ends.includes(want)) errors.push("finale atteso " + want + ": " + JSON.stringify([i.done, i.ends, i.st]));
  L.check(`Il Fischietto · capitolo 3 ${want} (${w} px)`, errors); await browser.close();
}
async function c4(w, verdetto) {
  const save = Object.assign({}, BASE, { ch: 4, step: { 1: 2, 2: 2, 3: 3 }, done: { 1: "assolvi", 2: "procura", 3: "argento" }, flags: { rel_fi_livia: 6 } });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__fischietto.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 4")); await L.advance(page);
  await go(page, "fi_citta_i0", 10, 10); await L.talk(page, "fi_edvige"); await L.advance(page);
  let i = await info(page); if (i.step[4] !== 1) errors.push("dopo Edvige c4: " + JSON.stringify(i.step));
  await go(page, "fi_citta", 15, 17); if (w === 390) await L.shot(page, "fi_ponte");
  { const bad = await L.reachAll(page, "fi_citta"); if (bad.length) errors.push("fi_citta: " + bad.join(", ")); }
  await go(page, "fi_citta_i5", 10, 10); { const bad = await L.reachAll(page, "fi_citta_i5"); if (bad.length) errors.push("albergo: " + bad.join(", ")); }
  await L.talk(page, "dz_sterling"); await L.advance(page);
  await L.talk(page, "dz_eva"); await L.advance(page); await L.talk(page, "dz_eva"); await L.advance(page);
  const n = await page.evaluate((k) => eval(k).dossier.list("ponte").length, K_); if (n !== 6) errors.push("dossier ponte " + n + "/6");
  await page.evaluate((k) => { const F = eval(k).F; [0, 1, 2].forEach((j) => F.set("dl_ponte_" + j, true)); }, K_);
  await L.talk(page, "dz_eva"); await L.advance(page, ["Decidi cosa fare", verdetto.label]); await L.advance(page).catch(() => {});
  i = await info(page); if (i.done[4] !== verdetto.id) errors.push("capitolo ponte " + verdetto.id + ": " + JSON.stringify([i.done, i.ends]));
  if (verdetto.id !== "archivia" && !i.ends.includes("doppio")) errors.push("finale doppio non registrato");
  L.check(`Il Fischietto · capitolo ponte ${verdetto.id} (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390, false); await c3(320, true); await c4(390, { id: "agente", label: "Consegno tutto a Sterling" }); await c4(320, { id: "procura", label: "Porto tutto alla Procura" }); await c4(390, { id: "archivia", label: "Archivio la cartolina" }); })();
