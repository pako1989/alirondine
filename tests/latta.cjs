// tests/latta.cjs - «Il Pallone di Latta»: zone raggiungibili, capitolo 1 completo (livelli finti), motore «A scorrimento» vero (comandi, pallone, capo)
const L = require("./lib.cjs");
const MOD = { mod: "__latta", key: "ali-di-rondine.latta" };
const K_ = "window.__latta._dbg.K";
const ZONES = ["lt_piazza", "lt_armeria", "lt_taverna"];
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function start(w, save, pick) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => { window.__noSfx = 1; window.__latta.open(); }); await r.page.waitForTimeout(500);
  await L.advance(r.page, pick ? [pick] : []).catch(() => {}); return r;
}
const stubLevel = (p) => p.evaluate(() => { window.__scorri.start = (o) => { (window.__scLog = window.__scLog || []).push({ id: o.level && o.level.id, bonus: o.bonus }); setTimeout(() => o.onDone({ win: true, coins: 12, ban: 1, banTot: 3, banMask: 1, time: 90 }), 10); return true; }; });
async function zonesTest(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1 } });
  for (const z of ZONES) {
    try { await go(page, z); await L.shot(page, "lt_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Pallone di Latta · zone (${w} px)`, errors); await browser.close();
}
async function flow(w, alt) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1 } });
  await stubLevel(page);
  const st = async (n, what) => { const i = await L.info(page); if (i.step[1] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
  try {
    await go(page, "lt_piazza", 14, 7); await L.talk(page, "lt_araldo"); await L.advance(page, [alt ? "Quanto paga" : "Per il Palio"]); await st(1, "dopo l'Araldo");
    await L.goAct(page, 14, 2); await L.advance(page); await st(1, "portone chiuso");
    await go(page, "lt_armeria", 8, 8); await L.talk(page, "lt_ottavia"); await L.advance(page);
    await L.goAct(page, 8, 3); await L.advance(page); await st(2, "dopo l'armatura");
    await L.talk(page, "lt_ottavia"); await L.advance(page, [alt ? "Quanto vale" : "La riporterò"]);
    await go(page, "lt_taverna", 8, 8); await L.talk(page, "lt_bacco"); await L.advance(page);
    await L.talk(page, "lt_mattonaro"); await L.advance(page, [alt ? "Stringi" : "non è in vendita"]);
    await go(page, "lt_piazza", 5, 13); await L.talk(page, "lt_gelsa"); await L.advance(page);
    await page.evaluate(() => { const b = document.querySelector("#bMenu, [data-act=menu]"); return !!b; });
    await go(page, "lt_piazza", 14, 4); await L.goAct(page, 14, 2); await L.advance(page, ["Sali sulle Mura"]); await L.advance(page).catch(() => {});
    await st(3, "dopo le Mura");
    await L.goAct(page, 14, 2); await L.advance(page, ["Sali al Torrione"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
    const lg = await page.evaluate(() => window.__scLog); if (!lg || lg.length !== 2 || lg[0].id !== "mura" || lg[1].id !== "torrione") errors.push("livelli: " + JSON.stringify(lg));
    const k = await page.evaluate((k) => { const K = eval(k); return { sp: K.inv.has("lt_spallaccio"), won: K.scroll.won("mura"), ban: K.scroll.ban("mura"), torta: K.inv.has("lt_torta"), patto: K.F.is("lt_patto") }; }, K_);
    if (!k.sp || !k.won || k.ban !== 1 || !k.torta || k.patto !== !!alt) errors.push("stato finale: " + JSON.stringify(k));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Pallone di Latta · capitolo 1${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// motore vero: si apre dal portone, i tasti muovono, il pallone si calcia e torna, il capo si batte
async function realEngine(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1, lt_armeria: 1 }, ch: 1, step: { 1: 2 }, flags: { lt_armatura: 1, lt_ott1: 1 } });
  try {
    await go(page, "lt_piazza", 14, 4); await L.goAct(page, 14, 2);
    for (let k = 0; k < 10; k++) { const ok = await page.evaluate(() => { if (window.__scorri.state && document.getElementById("scOv")) return 1; const b = [...document.querySelectorAll("#choices button")].find((x) => /Sali sulle Mura|^Continua/.test(x.innerText.trim())); if (b) b.click(); return 0; }); if (ok) break; await page.waitForTimeout(350); }
    await page.waitForTimeout(600);
    if (!(await page.evaluate(() => !!document.getElementById("scOv")))) throw new Error("livello non aperto");
    await L.shot(page, "lt_scorri_tut_" + w);
    await page.evaluate(() => { const b = [...document.querySelectorAll("#scOv .tut button")].find((x) => /Gioca|Salta/.test(x.innerText)); if (b) b.click(); });
    await page.waitForTimeout(300);
    const h0 = await page.evaluate(() => window.__scorri.state.hero);
    await page.evaluate(() => { const b = document.querySelector('#scOv [data-k="R"]'); b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 })); });
    await page.waitForTimeout(700);
    await page.evaluate(() => { const b = document.querySelector('#scOv [data-k="R"]'); b.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1 })); });
    const h1 = await page.evaluate(() => window.__scorri.state.hero); if (!(h1.x > h0.x + 20)) errors.push("▶ non muove l'eroe: " + JSON.stringify([h0.x, h1.x]));
    await page.evaluate(() => window.__scorri.state.press("K", true)); await page.waitForTimeout(80); await page.evaluate(() => window.__scorri.state.press("K", false)); await page.waitForTimeout(150);
    const b1 = await page.evaluate(() => window.__scorri.state.ball.st); if (b1 === "held") errors.push("⚽ non calcia il pallone");
    await L.shot(page, "lt_scorri_mura_" + w);
    await page.evaluate(() => window.__scorri.state.finish("all")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
    const s = await page.evaluate((k) => { const K = eval(k); return { won: K.scroll.won("mura"), ban: K.scroll.ban("mura"), step: K.stepOf(1) }; }, K_);
    if (!s.won || s.ban !== 3 || s.step !== 3) errors.push("dopo le Mura: " + JSON.stringify(s));
    // il capo: si apre il Torrione e si guarda che il Corvo esista e si muova
    await L.goAct(page, 14, 2);
    for (let k = 0; k < 10; k++) { const ok = await page.evaluate(() => { if (window.__scorri.state && document.getElementById("scOv")) return 1; const b = [...document.querySelectorAll("#choices button")].find((x) => /Sali al Torrione|^Continua/.test(x.innerText.trim())); if (b) b.click(); return 0; }); if (ok) break; await page.waitForTimeout(350); }
    await page.waitForTimeout(1500);
    const bo = await page.evaluate(() => window.__scorri.state.boss); if (!bo || bo.hp < 4) errors.push("capo assente: " + JSON.stringify(bo));
    await L.shot(page, "lt_scorri_boss_" + w);
    await page.evaluate(() => window.__scorri.state.finish(true)); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo non chiuso dopo il capo");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Pallone di Latta · A scorrimento vero (${w} px)`, errors); await browser.close();
}
// simulazione: il Corvo Maggiore si batte davvero (si pianta, si salta in testa)
async function bossSim() {
  const { browser, page, errors } = await L.setup({ w: 800, h: 400, ...MOD });
  try {
    const r = await page.evaluate(async () => {
      window.__noSfx = 1; const lv = window.__latta._dbg.K.scroll.levels.torrione; let res = null;
      window.__scorri.start({ level: Object.assign({ id: "torrione" }, lv), tutorial: false, onDone: (x) => { res = x; } });
      const s = window.__scorri.state, sl = (ms) => new Promise((r) => setTimeout(r, ms));
      for (let t = 0; t < 1400 && !res; t++) { const b = s.boss, h = s.hero; if (!b) break; if (b.st === "stuck" && b.y > 150) { if (h.y > 140 || Math.abs(h.x - b.x) > 6) s.warp(b.x, 120); } else if (b.st === "dive") { if (Math.abs(h.x - b.x) < 40) s.warp(b.x > 190 ? 60 : 320, 175); } s.tick(1); if (s.phase === "win") { s.finish(true); break; } if (s.phase === "ko") { s.finish(false); break; } }
      await sl(50); return res || { boss: s.boss };
    });
    if (!r || !r.win) errors.push("capo non battibile: " + JSON.stringify(r));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Pallone di Latta · Corvo Maggiore battibile", errors); await browser.close();
}
(async () => {
  const only = process.argv[2];
  for (const w of [390, 320]) { if (!only || only === "zone") await zonesTest(w); }
  if (!only || only === "flow") { await flow(390, false); await flow(320, true); }
  if (!only || only === "motore") { await realEngine(390); await realEngine(800); }
  if (!only || only === "capo") await bossSim();
})();
