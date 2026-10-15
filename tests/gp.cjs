// tests/gp.cjs - «Gran Premio del Pallone»: capitolo 1, il motore Giro e Gol (comandi veri), veicolo, cabinato
const L = require("./lib.cjs");
const MOD = { mod: "__gp", key: "ali-di-rondine.gp" };
const SAVE = (o) => Object.assign({ v: 1, ch: 1, step: {}, done: {}, intro: {} }, o);
const goB = (p) => p.evaluate(() => { const b = document.querySelector(".gpOv .ov .goB"); if (b) { b.click(); return b.textContent; } return null; });
const S = (p, f) => p.evaluate(`(() => { const S = window.__giroegol.state; return S ? (${f})(S) : null; })()`);
// una gara Giro e Gol vera: scheda, trascinamento, ◀ ▶, TURBO, TIRA; poi risultato forzato con finish()
async function gara(page, a, b, errors, shot) {
  for (let i = 0; i < 8 && !(await page.evaluate(() => !!document.querySelector(".gpOv"))); i++) await page.waitForTimeout(300);
  if (!(await page.evaluate(() => !!document.querySelector(".gpOv")))) { errors.push("Giro e Gol non si è aperto"); return; }
  await goB(page); await page.waitForTimeout(500);
  const box = await page.evaluate(() => { const r = document.querySelector(".gpOv canvas").getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  const p0 = await S(page, "(S) => [S.pos, S.x]");
  await page.mouse.move(box.x + box.w * 0.5, box.y + box.h * 0.7); await page.mouse.down(); await page.mouse.move(box.x + box.w * 0.9, box.y + box.h * 0.7, { steps: 5 });
  const dr = await S(page, "(S) => S.drag"); await page.waitForTimeout(900); const p1 = await S(page, "(S) => [S.pos, S.x]"); await page.mouse.up();
  if (!(dr > 0.5)) errors.push("il trascinamento non sterza: drag=" + dr);
  if (!(p1[0] > p0[0] + 5)) errors.push("la macchina non avanza");
  if (shot) await L.shot(page, shot + "_strada");
  const t0 = await S(page, "(S) => S.tur"); await page.evaluate(() => document.querySelector(".gpOv .act").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))); await page.waitForTimeout(200);
  const t1 = await S(page, "(S) => [S.tur, S.turT]"); if (!(t1[0] === t0 - 1 && t1[1] > 0)) errors.push("il TURBO non parte: " + JSON.stringify([t0, t1]));
  await page.evaluate(() => document.querySelector(".gpOv .bl").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))); await page.waitForTimeout(300);
  if (!(await S(page, "(S) => S.keys.left"))) errors.push("il tasto ◀ non registra"); await page.evaluate(() => document.querySelector(".gpOv .bl").dispatchEvent(new PointerEvent("pointerup", { bubbles: true })));
  await page.evaluate(() => window.__giroegol.state.skip()); await page.waitForTimeout(400);
  if ((await S(page, "(S) => S.phase")) !== "shoot") errors.push("non si passa al tiro");
  if (shot) await L.shot(page, shot + "_tiro");
  await page.evaluate(() => document.querySelector(".gpOv .act").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))); await page.waitForTimeout(700);
  if ((await S(page, "(S) => S.sh && S.sh.state")) === "aim") errors.push("TIRA non parte");
  await page.evaluate(([a, b]) => { const S = window.__giroegol.state; S.a = a; S.b = b; S.finish(); }, [a, b]);
  await page.waitForTimeout(300); await goB(page); await page.waitForTimeout(500);
}
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__gp.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  if ((await L.zone(page)) !== "gp_paddock") errors.push("non si parte dal paddock");
  for (const z of ["gp_paddock", "gp_pista", "gp_box"]) { await page.evaluate((z) => { const K = window.__gp._dbg.K; K.F.set("gp_auto", true); K.F.set("gp_drive", z === "gp_pista"); }, z); const bad = z === "gp_pista" ? [] : await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await page.evaluate(() => { const K = window.__gp._dbg.K; K.F.set("gp_auto", false); K.F.set("gp_drive", false); });
  if (w === 390) await L.shot(page, "gp_paddock");
  await L.talk(page, "gp_gridoni"); await L.advance(page);
  await L.goAct(page, 5, 6); await L.advance(page); if ((await L.zone(page)) !== "gp_box") errors.push("non si entra nel box");
  if (w === 390) await L.shot(page, "gp_box");
  await L.talk(page, "gp_bullone"); await L.advance(page);
  if (!(await page.evaluate(() => window.__gp._dbg.F.is("gp_auto")))) errors.push("la Rondinella non è stata data");
  await L.goAct(page, 12, 3); await L.advance(page, ["Grip"]); if (await page.evaluate(() => window.__gp._dbg.K.gomme()) !== "grip") errors.push("gomme non scelte");
  await L.goAct(page, 6, 3); await L.advance(page);
  await L.goAct(page, 8, 11); await L.advance(page); if ((await L.zone(page)) !== "gp_paddock") errors.push("non si esce dal box");
  await L.goAct(page, 29, 10); await L.advance(page); if ((await L.zone(page)) !== "gp_pista") errors.push("non si va in pista");
  await page.evaluate(() => { const K = window.__gp._dbg.K; K.F.set("gp_auto", true); K.F.set("gp_drive", true); }); { const bad = await L.reachAll(page, "gp_pista"); if (bad.length) errors.push("pista: " + bad.join(", ")); } await page.evaluate(() => { const K = window.__gp._dbg.K; K.F.set("gp_auto", true); K.F.set("gp_drive", false); });
  await L.talk(page, "gp_nembo"); await L.advance(page);
  if (w === 390) await L.shot(page, "gp_pista");
  // la macchina: a piedi il fosso blocca, in macchina si salta e non si scende sopra l'acqua
  const r1 = await page.evaluate(() => window.T_.reachAdj(20, 10)); if (r1) errors.push("a piedi l'isola dovrebbe essere irraggiungibile");
  await page.evaluate(() => window.__gp._dbg.K.setDrive(true)); await page.waitForTimeout(200);
  const r2 = await page.evaluate(() => window.T_.reachAdj(20, 10)); if (!r2) errors.push("in macchina l'isola dovrebbe essere raggiungibile");
  await page.evaluate(() => { const TW = window.__tr.TW; TW.x = 13 * 16 + 8; TW.y = 9 * 16 + 12; }); await page.waitForTimeout(100);
  await page.evaluate(() => window.__gp._dbg.K.setDrive(false)); await page.waitForTimeout(400);
  if (!(await page.evaluate(() => window.__gp._dbg.K.drive()))) errors.push("si è scesi sopra il fosso"); await L.advance(page);
  await page.evaluate(() => { const TW = window.__tr.TW; TW.x = 6 * 16 + 8; TW.y = 10 * 16 + 12; }); await page.evaluate(() => window.__gp._dbg.K.setDrive(false)); await page.waitForTimeout(200);
  if (await page.evaluate(() => window.__gp._dbg.K.drive())) errors.push("non si scende a riva");
  await L.talk(page, "gp_rosalba"); await page.evaluate(() => window.T_.click("Gioca la prima tappa")); await page.waitForTimeout(600);
  await gara(page, 2, 1, errors, w === 390 ? "gp_gara" : null); await L.advance(page, ["Stringerle la mano"]);
  if (w === 390) await L.shot(page, "gp_podio");
  const i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  // il Giardino dei Trofei: solo in macchina, oltre il fosso
  await page.evaluate(() => { const K = window.__gp._dbg.K; K.F.set("gp_auto", true); K.F.set("gp_drive", true); K.enterZone("gp_pista"); }); await page.waitForTimeout(500); await L.advance(page).catch(() => 0);
  await L.goAct(page, 20, 10); await L.advance(page); if ((await L.zone(page)) !== "gp_giardino") errors.push("non si entra nel Giardino: " + (await L.zone(page)));
  { const bad = await L.reachAll(page, "gp_giardino"); if (bad.length) errors.push("giardino: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "gp_giardino");
  await L.goAct(page, 6, 2); await L.advance(page); if (!(await page.evaluate(() => window.__gp._dbg.F.is("gp_giardino")))) errors.push("la Coppa del Giardino non si trova");
  L.check(`Gran Premio del Pallone · capitolo 1 (${w} px)`, errors); await browser.close();
}

const F0 = { gp_auto: true, gp_gomme_set: true, gp_titolo: true, gp_tuta: true, gp_gomme: "grip" };
async function c2(w) {
  const save = SAVE({ ch: 2, step: { 1: 5 }, done: { 1: "mano" }, intro: { ch1: 1, gp_paddock: 1, gp_pista: 1, gp_box: 1 }, st: { rosa: 2, team: 3 }, flags: F0, diffSet: true });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  const accetta = w === 390;
  await page.evaluate(() => window.__gp.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  if ((await L.zone(page)) !== "gp_paddock") errors.push("il capitolo 2 non parte in paddock");
  await L.talk(page, "gp_gridoni"); await L.advance(page);
  await L.goAct(page, 14, 6); await L.advance(page); if ((await L.zone(page)) !== "gp_salotto") errors.push("non si entra in Gommalux");
  { const bad = await L.reachAll(page, "gp_salotto"); if (bad.length) errors.push("salotto: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "gp_salotto");
  await L.talk(page, "gp_gommino"); await L.advance(page, [accetta ? "Accetto lo sponsor" : "Rifiuto: resto con Tonino"]);
  const sp = await page.evaluate(() => window.__gp._dbg.F.get("gp_spons")); if (sp !== (accetta ? "si" : "no")) errors.push("sponsor non registrato: " + sp);
  if (accetta && !(await page.evaluate(() => window.__gp._dbg.F.is("gp_turbo")))) errors.push("turbo dello sponsor assente");
  await L.goAct(page, 7, 9); await L.advance(page); if ((await L.zone(page)) !== "gp_paddock") errors.push("non si esce da Gommalux");
  await L.goAct(page, 23, 6); await L.advance(page); if ((await L.zone(page)) !== "gp_cabina") errors.push("non si entra in cabina");
  { const bad = await L.reachAll(page, "gp_cabina"); if (bad.length) errors.push("cabina: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "gp_cabina");
  await L.talk(page, "gp_gridoni"); await L.advance(page);
  await L.goAct(page, 10, 2); await L.advance(page); if (!(await page.evaluate(() => window.__gp._dbg.F.is("gp_c3")))) errors.push("indizio della canna mancante");
  await L.goAct(page, 7, 9); await L.advance(page);
  await L.goAct(page, 29, 10); await L.advance(page);
  await L.goAct(page, 9, 9); await L.advance(page); if (!(await page.evaluate(() => window.__gp._dbg.F.is("gp_c1")))) errors.push("indizio del gel mancante");
  await L.talk(page, "gp_smeraldo"); await page.evaluate(() => window.T_.click("^Giro e Gol")); await page.waitForTimeout(600);
  await gara(page, 2, 1, errors, w === 390 ? "gp_gara2" : null); await L.advance(page);
  if ((await L.zone(page)) !== "gp_paddock") errors.push("dopo la tappa 2 non si è in paddock: " + (await L.zone(page)));
  await L.talk(page, "gp_nembo"); await L.advance(page, ["Dirlo a tutti"]);
  const i = await L.info(page); if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify(i.step));
  if (!(await page.evaluate(() => window.__gp._dbg.F.is("gp_patto")))) errors.push("scelta del patto non registrata");
  L.check(`Gran Premio del Pallone · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const flags = Object.assign({}, F0, { gp_c1: true, gp_c2: true, gp_c3: true, gp_patto: true, gp_spons: "no", gp_giardino: true, gp_mirino: true });
  const save = SAVE({ ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "mano", 2: "x" }, intro: { ch1: 1, ch2: 1, gp_paddock: 1, gp_pista: 1, gp_box: 1, gp_cabina: 1, gp_salotto: 1 }, st: { rosa: 3, team: 5 }, flags, diffSet: true });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__gp.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  if ((await L.zone(page)) !== "gp_paddock") errors.push("il capitolo 3 non parte in paddock");
  await L.talk(page, "gp_nembo"); await L.advance(page);
  if (await page.evaluate(() => window.__gp._dbg.K.stepOf(3)) !== 1) errors.push("passo 1 non raggiunto");
  await L.talk(page, "gp_nembo"); await L.advance(page, ["^Rosalba"]);
  await L.talk(page, "gp_nembo"); await L.advance(page, ["Gommino"]);
  await L.talk(page, "gp_gommino"); await L.advance(page);
  await L.talk(page, "gp_nembo"); await L.advance(page, ["Cesare Gridoni", "Parlargli in privato"]);
  if (w === 390) await L.shot(page, "gp_confronto");
  if (!(await page.evaluate(() => window.__gp._dbg.F.is("gp_perdono")))) errors.push("perdono non registrato");
  if ((await L.zone(page)) !== "gp_paddock") errors.push("dopo il confronto non si è in paddock");
  await L.talk(page, "gp_rosalba"); await page.evaluate(() => window.T_.click("Gioca il Gran Premio")); await page.waitForTimeout(600);
  await gara(page, 2, 1, errors, w === 390 ? "gp_finale" : null); await L.advance(page);
  await L.talk(page, "gp_nembo"); await L.advance(page, ["Dividere la Coppa"]);
  let i = await L.info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso");
  if (!(i.ends || []).includes("giro")) errors.push("il finale segreto non scatta: " + JSON.stringify(i.ends));
  if (w === 390) await L.shot(page, "gp_bandiera");
  L.check(`Gran Premio del Pallone · capitolo 3 (${w} px)`, errors); await browser.close();
}
// i finali: ogni bandiera con le sue condizioni (una sessione per caso)
async function finali() {
  const base = { gp_auto: true, gp_titolo: true };
  const casi = [
    ["scacchi", { gp_patto: false }, { rosa: 0, team: 0 }, "Alzare la Coppa"],
    ["condivisa", { gp_patto: true, gp_spons: "si" }, { rosa: 3, team: 1 }, "Dividere la Coppa"],
    ["voce", { gp_patto: false, gp_perdono: true }, { rosa: 0, team: 0 }, "Alzare la Coppa"],
    ["officina", { gp_patto: false, gp_spons: "no" }, { rosa: 0, team: 5 }, "Alzare la Coppa"],
    ["giro", { gp_patto: true, gp_spons: "no", gp_giardino: true, gp_c1: true, gp_c2: true, gp_c3: true }, { rosa: 3, team: 5 }, "Dividere la Coppa"],
  ];
  for (const [id, fl, st, pick] of casi) {
    const save = SAVE({ ch: 3, step: { 1: 5, 2: 5, 3: 3 }, done: { 1: "x", 2: "x" }, intro: { ch1: 1, ch2: 1, ch3: 1, gp_paddock: 1 }, st, flags: Object.assign({}, base, fl), diffSet: true });
    const { browser, page, errors } = await L.setup({ w: 390, ...MOD, save });
    await page.evaluate(() => window.__gp.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3|Continua")); await L.advance(page).catch(() => 0);
    await page.evaluate(() => { const K = window.__gp._dbg.K; K.setStep(3, 3); K.enterZone("gp_paddock"); }); await page.waitForTimeout(500); await L.advance(page).catch(() => 0);
    await L.talk(page, "gp_nembo"); await L.advance(page, [pick]);
    const e = (await L.info(page)).ends || []; if (!e.includes(id)) errors.push(`finale ${id} non scatta: ${JSON.stringify(e)}`);
    L.check(`Gran Premio del Pallone · bandiera «${id}»`, errors); await browser.close();
  }
}
async function mac(w) {
  const fin = SAVE({ ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "mano", 2: "x", 3: "scacchi" }, ends: ["scacchi"], diffSet: true, flags: {} });
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.gp": fin } });
  await page.evaluate(() => window.__salone.salaGiochi(() => {})); await page.waitForTimeout(300);
  const st = await page.evaluate(() => { const b = document.querySelector('.salOv [data-m="giroegol"]'); return b ? b.querySelector(".pe").textContent : null; });
  if (st === null) errors.push("cabinato Giro e Gol assente"); else if (st === "🔒") errors.push("cabinato bloccato a saga finita");
  await page.evaluate(() => document.querySelector('.salOv [data-m="giroegol"]').click()); await page.waitForTimeout(200);
  if (!(await page.evaluate(() => !!document.querySelector('.salOv [data-o="9"]')))) errors.push("manca il boss del cabinato");
  await page.evaluate(() => document.querySelector('.salOv [data-o="1"]').click()); await page.waitForTimeout(500);
  if (w === 390) await L.shot(page, "gp_cabinato");
  await goB(page); await page.waitForTimeout(300);
  await page.evaluate(() => { const S = window.__giroegol.state; S.a = 2; S.b = 0; S.finish(); }); await page.waitForTimeout(300); await goB(page); await page.waitForTimeout(400);
  const rec = await page.evaluate(() => JSON.parse(localStorage.getItem("ali-di-rondine.salagiochi") || "{}")); if (!rec.w || rec.w.giroegol !== 1) errors.push("record non salvato: " + JSON.stringify(rec));
  L.check(`Giro e Gol · cabinato della Sala Giochi (${w} px)`, errors); await browser.close();
}
const only = process.argv[2] || "";
(async () => {
  if (!only || only === "c1") { await c1(390); await c1(320); }
  if (!only || only === "c2") { await c2(390); await c2(320); }
  if (!only || only === "mac") { await mac(390); await mac(320); }
})().catch((e) => { console.error("✗ gp:", e.message); process.exit(1); });
