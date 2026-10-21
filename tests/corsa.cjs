// tests/corsa.cjs - Gran Premio dei Sogni: corsa a squadre (piste, abilità, scia, risultati, campionato)
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale", "leone", "campetto", "amico"], diffSet: true, flags: {} };
async function run(w) {
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.campetto": fin } });
  await page.evaluate(() => window.__sogni.sync()); await page.evaluate(() => { const S = window.__sogni, r = S._load(); ["of_ferro", "pd_zeno"].forEach((id) => { if (!r.own.includes(id)) r.own.push(id); }); r.team = ["of_ferro", "pd_zeno", "cm_bastiano"]; S._save(r); });
  await page.evaluate(() => window.__arena.open(() => {})); await page.waitForTimeout(250);
  if (!(await page.evaluate(() => !!document.querySelector('.arOv [data-go="cor"]')))) errors.push("manca il bottone Corsa nell'Arena");
  await page.evaluate(() => document.querySelector('.arOv [data-go="cor"]').click()); await page.waitForTimeout(300);
  const mn = await page.evaluate(() => ({ t: document.querySelectorAll(".crOv [data-t]").length, c: !!document.querySelector('.crOv [data-go="champ"]') })); if (mn.t !== 3 || !mn.c) errors.push("menu Corsa: " + JSON.stringify(mn));
  if (w === 390) await L.shot(page, "corsa_menu");
  // piste: lunghezza e curvatura sensate
  const tr = await page.evaluate(() => window.__corsa.TRACKS.map((T) => { window.__corsa.build(T); return [Math.round(T.len), Math.max(...T.k.map(Math.abs)).toFixed(4)]; })); tr.forEach((t, i) => { if (t[0] < 1800 || t[0] > 9000) errors.push("pista " + i + " lunghezza " + t); });
  // gara singola (Lungomare): partenza e vista
  await page.evaluate(() => document.querySelector('.crOv [data-t="0"]').click()); await page.waitForTimeout(500);
  await page.evaluate(() => window.__corsa.pause(true));
  if (w === 390) await L.shot(page, "corsa_via");
  const r = await page.evaluate(() => {
    const C = window.__corsa; let R = C.state(); C._fast(true); const out = {}; out.n = R.racers.length; out.teams = R.racers.map((x) => x.team).join("");
    for (let i = 0; i < 200; i++) C.tick(); // via
    // abilità: carica l'energia e usala
    const me = R.me; me.energy = 100; const e0 = me.energy; C.press("t", true); C.tick(); out.turbo = e0 - me.energy; me.cd = 0; const e1 = me.energy; C.press("a", true); C.tick(); out.abil = e1 - me.energy;
    // guida semplice: segui il bersaglio dell'IA di chi guida (stessa logica ma sul giocatore)
    let n = 0; const steer = () => { const a = C.at(R.T, me.prog + 70 + me.v * 20); const want = a.k > 0.0006 ? 0.6 : a.k < -0.0006 ? -0.6 : 0, d = want - me.lat; R.inp = { l: d < -0.08 ? 1 : 0, r: d > 0.08 ? 1 : 0 }; };
    while (!R.over && n++ < 12000) { steer(); C.tick(); }
    out.frames = n; out.over = R.over; out.myPos = R.myPos; out.fin = R.racers.filter((x) => x.fin).length; out.wall = R.racers.filter((x) => x.prog < 100).length;
    return out;
  });
  if (r.n !== 8 || r.teams !== "00011122") errors.push("piloti: " + JSON.stringify(r));
  if (!(r.turbo >= 24 && r.turbo <= 26)) errors.push("turbo: " + JSON.stringify(r));
  if (!(r.abil > 0)) errors.push("abilità: " + JSON.stringify(r));
  if (!r.over || r.frames > 11000) errors.push("la gara non finisce: " + JSON.stringify(r));
  await page.waitForTimeout(500);
  const rs = await page.evaluate(() => ({ rows: document.querySelectorAll(".crOv .crTab tr").length, h: (document.querySelector(".crOv h3") || {}).textContent })); if (rs.rows !== 8 || !/posto/.test(rs.h)) errors.push("risultati: " + JSON.stringify(rs));
  if (w === 390) await L.shot(page, "corsa_risultati");
  // le altre piste
  for (const ti of [1, 2]) {
    await page.evaluate((ti) => window.__corsa.open(), ti); await page.waitForTimeout(150);
    await page.evaluate((ti) => document.querySelector(`.crOv [data-t="${ti}"]`).click(), ti); await page.waitForTimeout(300); await page.evaluate(() => window.__corsa.pause(true));
    const o = await page.evaluate(() => { const C = window.__corsa, R = C.state(); C._fast(true); let n = 0; const me = R.me; while (!R.over && n++ < 14000) { const a = C.at(R.T, me.prog + 70 + me.v * 20), want = a.k > 0.0006 ? 0.6 : a.k < -0.0006 ? -0.6 : 0, d = want - me.lat; R.inp = { l: d < -0.08 ? 1 : 0, r: d > 0.08 ? 1 : 0 }; C.tick(); } return [R.over, n, R.racers.filter((x) => x.fin).length]; });
    if (!o[0]) errors.push("pista " + ti + ": " + JSON.stringify(o));
    if (ti === 2 && w === 390) await L.shot(page, "corsa_neon");
  }
  // campionato: gara 1 → gara 2
  await page.evaluate(() => window.__corsa.open()); await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.crOv [data-go="champ"]').click()); await page.waitForTimeout(300); await page.evaluate(() => window.__corsa.pause(true));
  await page.evaluate(() => { const C = window.__corsa, R = C.state(); C._fast(true); let n = 0; const me = R.me; while (!R.over && n++ < 14000) { const a = C.at(R.T, me.prog + 70 + me.v * 20), want = a.k > 0.0006 ? 0.6 : a.k < -0.0006 ? -0.6 : 0, d = want - me.lat; R.inp = { l: d < -0.08 ? 1 : 0, r: d > 0.08 ? 1 : 0 }; C.tick(); } });
  await page.waitForTimeout(500);
  const nx = await page.evaluate(() => !!document.querySelector('.crOv [data-go="next"]')); if (!nx) errors.push("campionato: manca la gara successiva");
  L.check(`Gran Premio dei Sogni (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); })();
