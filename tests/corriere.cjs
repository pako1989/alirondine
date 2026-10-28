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
  await run(page, "D.state().hour = 18.0"); await run(page, "(D.snap(), D.step(0.1))");
  await talk("ruggero"); i = await info(); if (!/^2:/.test(i)) errors.push("dopo 3 consegne: " + i);
  await talk("marta"); i = await info(); if (!/^3:/.test(i)) errors.push("dopo secondo giro Marta: " + i);
  await run(page, "(() => { D.K.tp('sotterranei', 45, 55.5); D.step(0.5); D.near2(); D.act(); })()"); i = await info(); if (!/^4:/.test(i)) errors.push("dopo il pacco: " + i);
  await talk("marta"); const done = await run(page, "JSON.stringify(D.mem().done)"); if (!/"1":"ok"/.test(done)) errors.push("capitolo 1 non concluso: " + done);
  await page.waitForTimeout(200); await run(page, "D.render()"); await L.shot(page, "corriere_" + w);
  L.check(`Corriere 3D · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function flow2(w) {
  const { browser, page, errors } = await start(w, { v: 1, flags: { intro_done: 1 }, hour: 9, ch: 2, step: { 1: 5 }, done: { 1: "ok" } });
  await page.evaluate((d) => { const K = eval(d).K; K.ask = (p, opts) => { opts[0].fn && opts[0].fn(); }; K.match = (o, cb) => { window.__matchOpts = o; cb({ win: true, my: 3, opp: 1 }); }; }, D);
  const hr = (h) => run(page, "(() => { D.state().hour = arg; D.snap(); D.step(0.05); })()", h);
  const talk = async (id) => { await run(page, "(() => { const S = D.state(); const o = S.npcs.find((n) => n.cfg.id === arg); S.p.x = o.x + 1.5; S.p.z = o.z + 0.5; D.step(0.5); D.near2(); D.act(); })()", id); await page.waitForTimeout(120); };
  const step = () => run(page, "D.mem().step[2]");
  await talk("marta"); if ((await step()) !== 1) errors.push("dopo Marta: " + (await step()));
  await hr(18); await talk("ruggero"); if ((await step()) !== 2) errors.push("dopo Ruggero: " + (await step()));
  await hr(10); await talk("lia"); await hr(16); await talk("tito");
  const fl = await run(page, "JSON.stringify(D.mem().flags)"); if (!/c2_lia/.test(fl) || !/c2_tito/.test(fl)) errors.push("squadra incompleta: " + fl);
  await hr(21); await talk("ruggero"); await talk("ruggero"); if ((await step()) !== 4) errors.push("dopo la partita: " + (await step()));
  const mo = await run(page, "window.__matchOpts && window.__matchOpts.n"); if (mo !== 3) errors.push("opzioni partita: " + mo);
  await hr(12); await talk("marta"); const done = await run(page, "JSON.stringify(D.mem().done)"); if (!/"2":"ok"/.test(done)) errors.push("capitolo 2 non concluso: " + done);
  L.check(`Corriere 3D · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function flow3(w) {
  const { browser, page, errors } = await start(w, { v: 1, flags: { intro_done: 1 }, hour: 8, ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "ok", 2: "ok" } });
  await page.evaluate((d) => { const K = eval(d).K; K.ask = (p, opts) => { opts[0].fn && opts[0].fn(); }; }, D);
  const hr = (h) => run(page, "(() => { D.state().hour = arg; D.snap(); D.step(0.05); })()", h);
  const talk = async (id) => { await run(page, "(() => { const S = D.state(); const o = S.npcs.find((n) => n.cfg.id === arg); S.p.x = o.x + 1.5; S.p.z = o.z + 0.5; D.step(0.5); D.near2(); D.act(); })()", id); await page.waitForTimeout(120); };
  const step = () => run(page, "D.mem().step[3]");
  await talk("marta"); if ((await step()) !== 1) errors.push("dopo Marta: " + (await step()));
  await hr(10); await talk("pina"); await talk("lia"); if ((await step()) !== 2) errors.push("dopo due indizi: " + (await step()));
  // inseguimento fallito: la Volpe arriva in fondo
  await hr(23); await run(page, "(() => { D.K.tp('sotterranei', 45, 52); D.step(0.5); D.near2(); D.act(); })()");
  const ch1 = await run(page, "!!D.state().chase"); if (!ch1) errors.push("inseguimento non partito");
  await run(page, "(() => { const S = D.state(); S.p.x = 5; S.p.z = 5; for (let i = 0; i < 4000 && S.chase; i++) D.step(0.05); })()");
  if ((await step()) !== 2) errors.push("fuga: step " + (await step()));
  // riprova: cattura
  await run(page, "(() => { D.K.tp('sotterranei', 45, 52); D.step(0.5); D.near2(); D.act(); })()");
  await run(page, "(() => { const S = D.state(); S.p.x = S.chase.o.x + 1; S.p.z = S.chase.o.z; D.step(0.05); })()");
  if ((await step()) !== 3) errors.push("dopo la cattura: " + (await step()));
  await hr(14); await talk("ettore"); if ((await step()) !== 4) errors.push("dopo Ettore: " + (await step()));
  await talk("marta"); const done = await run(page, "JSON.stringify(D.mem().done)"); if (!/"3":"ok"/.test(done)) errors.push("capitolo 3 non concluso: " + done);
  L.check(`Corriere 3D · capitolo 3 (${w} px)`, errors); await browser.close();
}
(async () => { for (const w of [390, 1000]) { await main(w); await flow(w); await flow2(w); await flow3(w); } })().catch((e) => { console.error("✗ corriere:", e.message); process.exit(1); });
