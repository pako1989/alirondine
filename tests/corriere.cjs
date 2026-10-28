// tests/corriere.cjs - «Il Corriere del Pallone» (Città 3D): apertura, orari dei PNG, collisioni, consegne e capitolo 1
const L = require("./lib.cjs");
const MOD = { mod: "__corriere", key: "ali-di-rondine.corriere" };
const D = "window.__corriere._dbg";
async function start(w, save) {
  const r = await L.setup({ w, key: MOD.key, save }); await r.page.waitForFunction(() => window.__corriere && window.__corriere._dbg, null, { timeout: 20000 });
  await r.page.evaluate(() => window.__corriere.open()); await r.page.waitForTimeout(800);
  await r.page.evaluate((d) => { const K = eval(d).K; K.say = (l, cb) => { (K.__log = K.__log || []).push(l); if (cb) cb(); }; }, D);
  return r;
}
const run = (p, js, arg) => p.evaluate(([d, js, arg]) => { const D_ = eval(d); return new Function("D", "arg", "return (" + js + ")")(D_, arg); }, [D, js, arg]);
async function main(w) {
  const { browser, page, errors } = await start(w, { v: 1, flags: { intro_done: 1 }, hour: 10 });
  const st = await run(page, "!!D.state()");
  if (!st) errors.push("scena non creata");
  // PNG presenti per orario
  const hrs = await run(page, "(() => { const o = {}; const S = D.state(); [10, 16, 20].forEach((h) => { S.hour = h; o[h] = S.npcs.filter((n) => { const m = D.NPCS[n.cfg.id]; return m.sched.some((x) => (x.h[0] <= x.h[1] ? h >= x.h[0] && h < x.h[1] : h >= x.h[0] || h < x.h[1]) && !x.away); }).map((n) => n.cfg.id); }); return o; })()");
  if (!hrs[10].includes("pina") || hrs[10].includes("ruggero")) errors.push("orari alle 10: " + hrs[10]);
  if (hrs[16].includes("pina")) errors.push("Pina alle 16 dovrebbe essere assente: " + hrs[16]);
  if (!hrs[20].includes("ruggero")) errors.push("Ruggero alle 20 assente");
  // camminata: stick avanti sposta, muri bloccano
  const mv = await run(page, "(() => { const S = D.state(); const x0 = S.p.x, z0 = S.p.z; S.stk.y = -1; for (let i = 0; i < 60; i++) D.step(1 / 30); S.stk.y = 0; return Math.hypot(S.p.x - x0, S.p.z - z0); })()");
  if (mv < 5) errors.push("il giocatore non si muove: " + mv);
  const bad = await run(page, "(() => { const S = D.state(), sol = D.solids(); let n = 0; for (let k = 0; k < 400; k++) { S.p.x = 3 + (k * 37) % 260; S.p.z = 3 + (k * 53) % 170; S.stk.y = -1; S.stk.x = 0.6; for (let i = 0; i < 4; i++) D.step(1 / 20); if (sol.some((s) => S.p.x > s[0] + 0.1 && S.p.x < s[2] - 0.1 && S.p.z > s[1] + 0.1 && S.p.z < s[3] - 0.1)) n++; } S.stk.y = 0; S.stk.x = 0; return n; })()");
  if (bad > 12) errors.push("troppi attraversamenti di muri: " + bad);
  // giorno / notte
  const lum = await run(page, "(() => { const S = D.state(); S.hour = 12; D.step(0.4); const a = S.sun.intensity; S.hour = 1; D.step(0.4); const b = S.sun.intensity; return [a, b]; })()");
  if (!(lum[0] > lum[1] + 0.5)) errors.push("giorno/notte: " + lum);
  L.check(`Corriere 3D · mondo (${w} px)`, errors); await browser.close();
}
async function flow(w) {
  const { browser, page, errors } = await start(w, { v: 1, flags: { intro_done: 1 }, hour: 10 });
  const talk = async (id) => { await run(page, "(() => { const S = D.state(); const o = S.npcs.find((n) => n.cfg.id === arg); const o2 = o; S.p.x = o2.x + 1.5; S.p.z = o2.z + 0.5; D.step(0.5); D.near2(); D.act(); })()", id); await page.waitForTimeout(150); };
  const info = () => run(page, "D.mem().step[1] + ':' + JSON.stringify(D.mem().flags)");
  await talk("marta"); let i = await info(); if (!/^1:/.test(i)) errors.push("dopo Marta: " + i);
  await run(page, "D.state().hour = 10.0");
  await talk("pina"); await talk("ettore");
  await run(page, "D.state().hour = 18.0"); await run(page, "D.step(0.1)");
  await talk("ruggero"); i = await info(); if (!/^2:/.test(i)) errors.push("dopo 3 consegne: " + i);
  await talk("marta"); i = await info(); if (!/^3:/.test(i)) errors.push("dopo secondo giro Marta: " + i);
  await run(page, "(() => { D.K.tp('sotterranei', 45, 55.5); D.step(0.5); D.near2(); D.act(); })()"); i = await info(); if (!/^4:/.test(i)) errors.push("dopo il pacco: " + i);
  await talk("marta"); const done = await run(page, "JSON.stringify(D.mem().done)"); if (!/"1":"ok"/.test(done)) errors.push("capitolo 1 non concluso: " + done);
  await page.waitForTimeout(200); await run(page, "D.render()"); await L.shot(page, "corriere_" + w);
  L.check(`Corriere 3D · capitolo 1 (${w} px)`, errors); await browser.close();
}
(async () => { for (const w of [390, 1000]) { await main(w); await flow(w); } })().catch((e) => { console.error("✗ corriere:", e.message); process.exit(1); });
