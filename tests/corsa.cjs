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
  await page.evaluate(() => { const C = window.__corsa, R = C.state(), me = R.me; for (let i = 0; i < 900; i++) { const a = C.at(R.T, me.prog + 70 + me.v * 20), want = a.k > 0.0006 ? 0.6 : a.k < -0.0006 ? -0.6 : 0, d = want - me.lat; R.inp = { l: d < -0.08 ? 1 : 0, r: d > 0.08 ? 1 : 0 }; C.tick(); } R.inp = {}; });
  await page.waitForTimeout(200); if (w === 390) await L.shot(page, "corsa_gara");
  const rv = await page.evaluate(() => { const R = window.__corsa.state(); return [R.cfg.view, !!R.stk]; }); if (rv[0] !== "rear" || !rv[1]) errors.push("visuale da dietro/joystick: " + JSON.stringify(rv));
  { const sx = await page.evaluate(() => { const C = window.__corsa, R = C.state(), me = R.me, l0 = me.lat; R.stk.set(1, 0); for (let i = 0; i < 25; i++) C.tick(); R.stk.set(0, 0); const dr = me.lat - l0; R.stk.set(-0.4, 0); const l1 = me.lat; for (let i = 0; i < 25; i++) C.tick(); R.stk.set(0, 0); return [dr, l1 - me.lat]; }); if (!(sx[0] > 0.1) || !(sx[1] > 0)) errors.push("sterzo analogico: " + JSON.stringify(sx)); }
  const r = await page.evaluate(() => {
    const C = window.__corsa; let R = C.state(); C._fast(true); const out = {}; out.n = R.racers.length; out.teams = R.racers.map((x) => x.team).join("");
    for (let i = 0; i < 200; i++) C.tick(); // via
    // abilità: carica l'energia e usala
    const me = R.me; me.stun = 0; me.energy = 100; const e0 = me.energy; C.press("t", true); C.tick(); out.turbo = e0 - me.energy; me.cd = 0; const e1 = me.energy; C.press("a", true); C.tick(); out.abil = e1 - me.energy;
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
  // visuale dall'alto (la classica)
  await page.evaluate(() => window.__corsa.open()); await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.crOv [data-view]').click()); await page.waitForTimeout(150);
  const vt = await page.evaluate(() => ({ s: window.__corsa.load().view, n: document.querySelectorAll(".crOv [data-t]").length })); if (vt.s !== "top" || vt.n !== 3) errors.push("cambio visuale: " + JSON.stringify(vt));
  await page.evaluate(() => document.querySelector('.crOv [data-t="1"]').click()); await page.waitForTimeout(400); await page.evaluate(() => window.__corsa.pause(true));
  const tv = await page.evaluate(() => { const C = window.__corsa, R = C.state(); C._fast(true); let n = 0; const me = R.me; while (!R.over && n++ < 14000) { const a = C.at(R.T, me.prog + 70 + me.v * 20), want = a.k > 0.0006 ? 0.6 : a.k < -0.0006 ? -0.6 : 0, d = want - me.lat; R.inp = { l: d < -0.08 ? 1 : 0, r: d > 0.08 ? 1 : 0 }; C.tick(); } return [R.cfg.view, !!R.over]; });
  if (tv[0] !== "top" || !tv[1]) errors.push("gara dall'alto: " + JSON.stringify(tv));
  await page.evaluate(() => { const x = window.__corsa.load(); x.view = "rear"; window.__corsa.save(x); });
  // oggetti a tema saga, ostacoli, scorciatoie e leva
  await page.evaluate(() => window.__corsa.open()); await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.crOv [data-t="0"]').click()); await page.waitForTimeout(500); await page.evaluate(() => window.__corsa.pause(true));
  const fe = await page.evaluate(() => {
    const C = window.__corsa, R = C.state(), me = R.me, out = {}; C._fast(true); const T = R.T; for (let i = 0; i < 200; i++) C.tick(); // via
    out.has = R.items.some((i) => i.k === "x") && R.obs.length > 4 && R.zones.length === 2 && R.pads.length === 1; out.btn = !!document.querySelector(".crOv .it");
    // oggetto: raccolta
    const x = R.items.find((i) => i.k === "x"); me.prog = x.s - 2; me.lat = x.lat; me.stun = 0; C.tick(); out.held = me.held === me.fxk && !!me.held;
    // uso di ogni oggetto, nessuna eccezione e un effetto
    const ks = ["fire", "thunder", "curve", "zig", "spiral", "vanish", "ice", "change", "drill"], fx = []; R.racers.forEach((r, i) => { if (r !== me) { r.prog = me.prog + 60 + i * 5; r.lat = me.lat; r.stun = 0; r.shield = 0; r.inv = 0; r.v = 1; } });
    ks.forEach((k) => { me.held = k; me.stun = 0; const o = R.racers.find((r) => r !== me); o.stun = 0; o.shield = 0; o.inv = 0; o.lat = me.lat; o.prog = me.prog + 60; const p0 = me.prog, st0 = R.racers.reduce((a, r) => a + r.stun, 0), oi = R.oils.length; C.press("o", true); C.tick(); const ch = me.boost > 0 || me.sure > 0 || me.inv > 0 || me.ghost > 0 || me.shield > 0 || R.oils.length > oi || R.racers.reduce((a, r) => a + r.stun, 0) > st0 || me.prog > p0 + 40; fx.push([k, !!ch, me.held === null]); });
    out.fx = fx.filter((f) => !f[1] || !f[2]).map((f) => f[0]);
    // scorciatoia aperta: bonus di strada
    const z0 = R.zones[0]; me.stun = 0; me.v = 1.5; me.prog = z0.a + 5; me.lat = 0.8; me.zc = 0; const pa = me.prog; C.tick(); out.open = me.prog - pa > me.v * 1 + 0.4;
    // cancello chiuso: botta; con la leva: bonus
    const z1 = R.zones[1]; me.stun = 0; me.v = 1.5; me.prog = z1.a + 5; me.lat = -0.8; me.zc = 0; z1.open = 0; C.tick(); out.gate = me.stun > 0 && me.v < 1; 
    me.stun = 0; me.v = 1.5; const pd = R.pads[0]; me.prog = pd.s - 1; me.lat = 0; C.tick(); out.pad = z1.open > 0; me.prog = z1.a + 5; me.lat = -0.8; me.zc = 0; me.v = 1.5; const pb = me.prog; C.tick(); out.gateOpen = me.stun === 0 && me.prog - pb > me.v + 0.4;
    // ostacolo
    const bm = R.obs.find((o) => o.k === "bump" && o.on); me.stun = 0; me.v = 1.5; me.inv = 0; me.shield = 0; me.bc = 0; me.prog = bm.s - 3; me.lat = bm.lat; C.tick(); out.bump = me.stun > 0;
    // gara completa con tutto attivo (bot), senza eccezioni
    R.t = 0; let n = 0; while (!R.over && n++ < 14000) { const a = C.at(T, me.prog + 70 + me.v * 20), want = a.k > 0.0006 ? 0.6 : a.k < -0.0006 ? -0.6 : 0, d = want - me.lat; R.inp = { r: d > 0.06 ? 1 : 0, l: d < -0.06 ? 1 : 0 }; if (me.held && n % 40 === 0) C.press("o", true); C.tick(); } out.end = R.over;
    return out;
  });
  if (!fe.has || !fe.btn || !fe.held || fe.fx.length || !fe.open || !fe.gate || !fe.pad || !fe.gateOpen || !fe.bump || !fe.end) errors.push("oggetti/scorciatoie: " + JSON.stringify(fe));
  await page.evaluate(() => { const x = window.__corsa.load(); x.fun = false; window.__corsa.save(x); window.__corsa.open(); }); await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.crOv [data-t="0"]').click()); await page.waitForTimeout(400); await page.evaluate(() => window.__corsa.pause(true));
  const nf = await page.evaluate(() => { const R = window.__corsa.state(); return [R.fun, R.obs.length, R.zones.length, !!document.querySelector(".crOv .it")]; }); if (nf[0] || nf[1] || nf[2] || nf[3]) errors.push("opzione oggetti spenta: " + JSON.stringify(nf));
  await page.evaluate(() => { const x = window.__corsa.load(); x.fun = true; window.__corsa.save(x); });
  L.check(`Gran Premio dei Sogni (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); })();
