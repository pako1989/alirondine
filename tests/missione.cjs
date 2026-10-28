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
(async () => {
  for (const w of [390, 320]) { await zonesTest(w); await flow(w, false); }
  await flow(390, true);
  await realFight(390);
})();
