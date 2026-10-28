// tests/tattica.cjs - Campo di Guerra (motore tattico a griglia): menu in Arena, regole, IA, battaglia completa con pilota automatico, tocco sulla griglia
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale"], diffSet: true, flags: {} };

async function run(w) {
  const { browser, page, errors } = await L.setup({ w, h: 800, extra: { "ali-di-rondine.campetto": fin } });
  await page.evaluate(() => {
    const S = window.__sogni; S.sync(); const r = S._load();
    ["leo", "nico", "tommy", "dario", "sara", "ruggeri"].forEach((id) => { if (S.BY[id] && !r.own.includes(id)) r.own.push(id); });
    r.team = ["leo", "nico", "sara", "ruggeri", "dario"]; S._save(r);
    localStorage.setItem("ali-di-rondine.mini.tattica", "1");
    const st = window.setTimeout; window.setTimeout = (f, d, ...a) => st(f, Math.min(d || 0, 4), ...a);
  });
  // menu
  await page.evaluate(() => window.__tattica.open());
  const menu = await page.evaluate(() => ({ n: document.querySelectorAll("#taMenu [data-lv]").length, over: document.documentElement.scrollWidth - innerWidth }));
  if (menu.n !== 4 || menu.over > 1) errors.push(`menu tattica (${w}px): ` + JSON.stringify(menu));
  await page.screenshot({ path: `${L.OUT}/ta-menu-${w}.png` });
  await page.click('#taMenu [data-lv="1"][data-boss="0"]');
  await page.waitForTimeout(300);
  const st0 = await page.evaluate(() => { const T = window.__tattica, s = T.state(); return { n: s.units.length, mine: s.units.filter((u) => u.side === "m").length, mode: s.mode, hp: s.units.every((u) => u.hp > 0) }; });
  if (st0.mine !== 5 || st0.n < 8 || st0.mode !== "idle" || !st0.hp) errors.push(`avvio tattica (${w}px): ` + JSON.stringify(st0));
  // tocco: seleziona un tuo giocatore dal canvas e mostra l'area di movimento
  const tap = await page.evaluate(() => {
    const T = window.__tattica, s = T.state(), u = s.units.find((x) => x.side === "m"), cv = document.querySelector("#taOv canvas"), rc = cv.getBoundingClientRect();
    const px = u.px, py = u.py + 11; // centro della tessera
    cv.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: rc.left + (px / 380) * rc.width, clientY: rc.top + (py / 230) * rc.height, pointerType: "touch" }));
    return { sel: !!s.sel, mode: s.mode, reach: s.moveSet ? Object.keys(s.moveSet).length : 0 };
  });
  if (!tap.sel || tap.mode !== "move" || tap.reach < 4) errors.push(`tocco su unità (${w}px): ` + JSON.stringify(tap));
  await page.evaluate(() => window.__tattica.api.moveTo(...(Object.keys(window.__tattica.state().moveSet).filter((k) => k !== (window.__tattica.state().sel.c + "," + window.__tattica.state().sel.r)).pop().split(",").map(Number))));
  await page.screenshot({ path: `${L.OUT}/ta-play-${w}.png` });
  // pilota automatico: deve finire entro 40 turni
  const res = await page.evaluate(async () => {
    const T = window.__tattica, A = T.api, s = T.state(); let guard = 0;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const nearest = (u) => s.units.filter((x) => x.side === "o" && x.hp > 0).sort((a, b) => Math.abs(a.c - u.c) + Math.abs(a.r - u.r) - (Math.abs(b.c - u.c) + Math.abs(b.r - u.r)))[0];
    while (!s.over && guard++ < 400) {
      if (s.phase !== "m" || s.busy) { await sleep(20); continue; }
      const mine = s.units.filter((u) => u.side === "m" && u.hp > 0 && !u.acted);
      if (!mine.length) { A.endTurn(); await sleep(20); continue; }
      const u = mine[0]; if (!A.select(u)) { u.acted = true; continue; }
      const e = nearest(u);
      if (e && s.moveSet) { const best = Object.keys(s.moveSet).map((k) => k.split(",").map(Number)).filter(([c, r]) => !A.unitAt(c, r) || A.unitAt(c, r) === u).sort((p, q) => (Math.abs(p[0] - e.c) + Math.abs(p[1] - e.r)) - (Math.abs(q[0] - e.c) + Math.abs(q[1] - e.r)))[0]; if (best && (best[0] !== u.c || best[1] !== u.r)) A.moveTo(best[0], best[1]); else A.stay(); }
      if (s.over || !s.sel) continue;
      let done = false;
      for (const k of ["sk", "atk"]) { if (A.targetsOf(u, k).length && A.act(k)) { const t = A.targetsOf(u, k)[0]; A.target(t); done = true; break; } }
      if (!done && s.sel === u && u.role === "P") { A.act("sk"); done = true; }
      if (!done && s.sel === u && !u.acted) A.act("wait");
      await sleep(5);
    }
    return { over: s.over, win: s.win, turn: s.turn, guard, hp: s.units.map((u) => u.hp).every((h) => Number.isFinite(h)) };
  });
  if (!res.over || res.turn > 45 || !res.hp) errors.push(`battaglia automatica (${w}px): ` + JSON.stringify(res));
  await page.waitForTimeout(150);
  await page.screenshot({ path: `${L.OUT}/ta-end-${w}.png` });
  const hasBtn = await page.evaluate(() => !!document.querySelector("#taRe"));
  if (!hasBtn) errors.push(`fine battaglia senza pulsanti (${w}px)`);
  await browser.close();
  return errors;
}
(async () => {
  let fails = 0;
  for (const w of [390, 320]) {
    const errs = await run(w);
    if (errs.length) { fails++; console.log("✗ Campo di Guerra a " + w + " px"); errs.forEach((e) => console.log("  " + e)); } else console.log("✓ Campo di Guerra a " + w + " px");
  }
  process.exit(fails ? 1 : 0);
})();
