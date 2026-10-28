// tests/gabbia7.cjs - Calcio 3D 7 contro 7 (motore Gabbia): campo grande, 14 giocatori, IA, controllo, gol
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale"], diffSet: true, flags: {} };

async function run(w) {
  const { browser, page, errors } = await L.setup({ w, h: 800, extra: { "ali-di-rondine.campetto": fin } });
  await page.evaluate(() => {
    const S = window.__sogni; S.sync(); const r = S._load();
    ["leo", "nico", "tommy", "dario", "sara", "ruggeri", "cv_letizia", "cv_lupo"].forEach((id) => { if (S.BY[id] && !r.own.includes(id)) r.own.push(id); });
    r.team = ["leo", "nico", "sara", "ruggeri", "dario", "tommy", "cv_lupo"]; S._save(r);
    window.__gabbia3d.save(Object.assign(window.__gabbia3d.load(), { fmt: 7 }));
    window.__gabbia3d.open(() => {});
  });
  const lobby = await page.evaluate(() => ({ units: document.querySelectorAll(".g3dOv .g3dUnit").length, over: document.documentElement.scrollWidth - innerWidth, fmt: !!document.querySelector('[data-fmt="7"].active'), q: !!document.querySelector("[data-q]") }));
  if (lobby.units !== 7 || !lobby.fmt || !lobby.q || lobby.over > 1) errors.push(`lobby 7v7 (${w}px): ` + JSON.stringify(lobby));
  await page.screenshot({ path: L.OUT ? `${L.OUT}/g7-lobby-${w}.png` : `tests/shots/g7-lobby-${w}.png` });
  await page.evaluate(() => { const g = window.__gabbia3d; g.startMatch({ mode: "quick", opp: g.OPP_TIERS[0], arenaId: g.load().arena }); });
  await page.waitForTimeout(1500);
  const st = await page.evaluate(() => {
    const G = window.__gabbia3d.state();
    return { n: G.n, mine: G.myTeam.length, opp: G.oppTeam.length, win: G.winGoals, hx: 0, owner: !!G.ball.owner, ctrl: G.ctrlIdx };
  });
  if (st.n !== 7 || st.mine !== 7 || st.opp !== 7 || st.win !== 5 || !st.owner) errors.push(`stato 7v7 (${w}px): ` + JSON.stringify(st));
  // 30s simulati: nessuna NaN, giocatori nei limiti, la palla si muove, qualcuno ha la palla ogni tanto
  const sim = await page.evaluate(() => {
    const g = window.__gabbia3d; const G = g.state(); let bad = 0, moved = 0, owners = 0, maxX = 0;
    const x0 = G.ball.x;
    for (let i = 0; i < 1800; i++) {
      g.step(1 / 60);
      if (i % 90 === 0 && G.myTeam[G.ctrlIdx]) { g.doPassOrSwitch(); }
      if (i % 200 === 0) g.doShootOrTackle();
      G.all.forEach((p) => { if (!isFinite(p.x) || !isFinite(p.z)) bad++; });
      if (!isFinite(G.ball.x) || !isFinite(G.ball.z)) bad++;
      if (G.ball.owner) owners++;
      maxX = Math.max(maxX, Math.abs(G.ball.x));
      if (Math.abs(G.ball.x - x0) > 3) moved = 1;
    }
    return { bad, moved, owners, maxX, score: G.score.slice(), over: G.over };
  });
  if (sim.bad || !sim.moved || !sim.owners) errors.push(`sim 7v7 (${w}px): ` + JSON.stringify(sim));
  // tiro caricabile: tieni premuto Tira, la barra sale, rilascio = tiro; recupero palla non è mai garantito a catena
  const chg = await page.evaluate(() => {
    const g = window.__gabbia3d; const G = g.state(); const me = G.myTeam[G.ctrlIdx];
    G.noShootUntil = 0; G.ball.owner = me; G.over = false; G.paused = false; G.goalFreeze = 0; me.x = 0; me.z = 0; me.facing = 0;
    const b = document.querySelector('.g3dAct[data-btn="shoot"]');
    b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, cancelable: true, pointerId: 31, pointerType: "touch" }));
    const started = G.chg >= 0;
    for (let i = 0; i < 60; i++) { G.ball.owner = G.myTeam[G.ctrlIdx] === me ? me : G.ball.owner; g.step(1 / 60); G.ball.owner = me; G.ball.pickupLock = 1; G.goalFreeze = 0; me.x = 0; me.z = 0; }
    const mid = G.chg;
    b.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, cancelable: true, pointerId: 31, pointerType: "touch" }));
    return { started, mid, after: G.chg, released: G.ball.owner === null, vx: G.ball.vx };
  });
  if (!chg.started || chg.mid < 0.8 || chg.after !== -1 || !chg.released || chg.vx < 12) errors.push(`tiro caricabile (${w}px): ` + JSON.stringify(chg));
  await page.evaluate(() => { window.__gabbia3d.pause(true); window.__gabbia3d.tick(0.001); });
  await page.screenshot({ timeout: 90000, path: L.OUT ? `${L.OUT}/g7-match-${w}.png` : `tests/shots/g7-match-${w}.png` });
  await page.evaluate(() => window.__gabbia3d.close());
  await browser.close();
  return errors;
}
(async () => {
  let fails = 0;
  for (const w of [390, 320]) {
    const errs = await run(w);
    if (errs.length) { fails++; console.log("✗ Calcio 3D 7v7 a " + w + " px"); errs.forEach((e) => console.log("  " + e)); } else console.log("✓ Calcio 3D 7v7 a " + w + " px");
  }
  process.exit(fails ? 1 : 0);
})();
