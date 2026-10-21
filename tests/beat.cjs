// tests/beat.cjs - Rissa dei Sogni: beat 'em up a scorrimento (ondate, attacchi, super per saga, stadi)
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale", "leone", "campetto", "amico"], diffSet: true, flags: {} };
async function run(w) {
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.campetto": fin } });
  await page.evaluate(() => { const S = window.__sogni; S.sync(); const r = S._load(); ["of_ferro", "pd_zeno"].forEach((id) => { if (!r.own.includes(id)) r.own.push(id); }); r.team = ["of_ferro", "pd_zeno", "cm_bastiano"]; S._save(r); });
  await page.evaluate(() => window.__arena.open(() => {})); await page.waitForTimeout(250);
  if (!(await page.evaluate(() => !!document.querySelector('.arOv [data-go="bea"]')))) errors.push("manca il bottone Rissa nell'Arena");
  await page.evaluate(() => document.querySelector('.arOv [data-go="bea"]').click()); await page.waitForTimeout(300);
  const mn = await page.evaluate(() => ({ picks: document.querySelectorAll(".btOv .btPick .c").length, go: [...document.querySelectorAll(".btOv [data-go]")].map((b) => b.dataset.go).join() }));
  if (mn.picks < 3 || mn.go !== "run,one") errors.push("menu Rissa: " + JSON.stringify(mn));
  if (w === 390) await L.shot(page, "rissa_menu");
  await page.evaluate(() => document.querySelector('.btOv [data-go="run"]').click()); await page.waitForTimeout(600); await page.evaluate(() => window.__beat.pause(true));
  const r = await page.evaluate(() => {
    const B = window.__beat, G = B.state(); B._fast(true); const out = {}, P = G.P;
    for (let i = 0; i < 130; i++) B.tick(); // via
    // catena di pugni su un nemico
    const e = B.mkE("thug", G.pool[0], 0, 0); e.x = P.x + 24; e.y = P.y; e.hp = e.hpMax = 999; e.cool = 999; G.en.push(e); G.lock = G.cam; const h0 = e.hp;
    B.press("a", true); for (let i = 0; i < 40; i++) { B.tick(); if (i === 8 || i === 18) B.press("a", true); } out.chain = h0 - e.hp; out.hit = e.hits;
    // joystick e profondità
    G.en = []; for (let i = 0; i < 80; i++) B.tick(); G.lock = null; const x0 = P.x, y0 = P.y; G.stk.set(1, 0.6); for (let i = 0; i < 20; i++) B.tick(); G.stk.set(0, 0); out.mx = Math.round(P.x - x0); out.my = Math.round(P.y - y0);
    // salto
    B.press("j", true); B.tick(); B.tick(); out.jump = P.z > 0; for (let i = 0; i < 60; i++) B.tick();
    // speciale
    P.meter = 100; P.st = "idle"; const e2 = B.mkE("thug", G.pool[0], 0, 0); e2.x = P.x + 40; e2.y = P.y; e2.hp = e2.hpMax = 999; e2.cool = 999; G.en.push(e2); const h2 = e2.hp; B.press("s", true); for (let i = 0; i < 50; i++) B.tick(); out.spec = h2 - e2.hp; out.meter = P.meter;
    return out;
  });
  if (!(r.chain > 12)) errors.push("catena: " + JSON.stringify(r));
  if (r.mx < 12 || r.my < 4) errors.push("joystick: " + JSON.stringify(r));
  if (!r.jump) errors.push("salto: " + JSON.stringify(r));
  if (!(r.spec > 0 || r.meter < 100)) errors.push("speciale: " + JSON.stringify(r));
  // tutti i super
  const sp = await page.evaluate(() => {
    const B = window.__beat, G = B.state(), P = G.P, out = {};
    for (const fx of ["fire", "thunder", "curve", "zig", "spiral", "vanish", "ice", "change", "drill"]) {
      for (let i = 0; i < 80; i++) B.tick(); G.en = []; G.proj = []; P.st = "idle"; P.hp = P.hpMax; P.inv = 0; P.z = 0; P.x = G.cam + 100; P.y = 182; P.dir = 1; P.ghost = 0; P.sg = { fx, name: "t", col: "#ffaa00", saga: "" }; P.meter = 100; G.lock = G.cam;
      const e = B.mkE("heavy", G.pool[0], 0, 0); e.x = P.x + 60; e.y = 182; e.hp = e.hpMax = 999; e.cool = 999; G.en.push(e); const h = e.hp; B.press("x", true); let nan = false; for (let i = 0; i < 120; i++) { B.tick(); if (!isFinite(P.x) || !isFinite(P.y) || !isFinite(e.x)) nan = true; } out[fx] = [h - e.hp, nan, P.st];
    }
    return out;
  });
  Object.keys(sp).forEach((k) => { if (!(sp[k][0] > 0) || sp[k][1] || sp[k][2] === "spec") errors.push("super " + k + ": " + JSON.stringify(sp[k])); });
  if (w === 390) await L.shot(page, "rissa_lotta");
  // simulazione con bot: avanza, attacca, usa il super; lo stadio finisce (vittoria o K.O.), niente NaN
  await page.evaluate(() => window.__beat.open()); await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.btOv [data-go="run"]').click()); await page.waitForTimeout(400); await page.evaluate(() => window.__beat.pause(true));
  const bot = await page.evaluate(() => {
    const B = window.__beat; const G = B.state(); B._fast(true); const P = G.P; let n = 0, nan = false; G.t = 0;
    while (!G.over && n++ < 60000) {
      const es = G.en.filter((e) => e.hp > 0), t = es.sort((a, b) => Math.abs(a.x - P.x) + Math.abs(a.y - P.y) * 2 - Math.abs(b.x - P.x) - Math.abs(b.y - P.y) * 2)[0];
      let x = 1, y = 0; if (t) { x = Math.abs(t.x - P.x) > 26 ? Math.sign(t.x - P.x) : 0; y = Math.abs(t.y - P.y) > 6 ? Math.sign(t.y - P.y) : 0; if (!x) P.dir = t.x >= P.x ? 1 : -1; }
      G.inp = { l: x < 0 ? 1 : 0, r: x > 0 ? 1 : 0, u: y < 0 ? 1 : 0, d: y > 0 ? 1 : 0 }; if (n % 9 === 0) G.edge.a = 1; if (P.meter >= 100 && es.length > 1) G.edge.x = 1; if (P.hp < P.hpMax * 0.4 && P.meter >= 50 && n % 30 === 0) G.edge.s = 1;
      B.tick(); if (!isFinite(P.x) || es.some((e) => !isFinite(e.x))) nan = true;
    }
    return { over: G.over, n, nan, kills: G.kills, hp: Math.round(P.hp), score: G.score };
  });
  if (!bot.over || bot.nan) errors.push("stadio col bot: " + JSON.stringify(bot));
  if (bot.kills < 3) errors.push("il bot non batte nessuno: " + JSON.stringify(bot));
  await page.waitForTimeout(400);
  const rs = await page.evaluate(() => ({ h: (document.querySelector(".btOv h3") || {}).textContent, b: document.querySelectorAll(".btOv .one").length })); if (!rs.h || rs.b < 2) errors.push("schermata esito: " + JSON.stringify(rs));
  if (w === 390) await L.shot(page, "rissa_esito");
  // landscape
  await page.evaluate(() => window.__beat.open()); await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.btOv [data-go="run"]').click()); await page.waitForTimeout(500); await page.evaluate(() => window.__beat.pause(true));
  await page.setViewportSize({ width: 844, height: 390 }); await page.waitForTimeout(400);
  const ls = await page.evaluate(() => { const c = document.querySelector(".btOv canvas").getBoundingClientRect(); return { land: document.querySelector(".btOv").classList.contains("land"), h: Math.round(c.height) }; }); if (!ls.land || ls.h < 340) errors.push("landscape: " + JSON.stringify(ls));
  if (w === 390) await L.shot(page, "rissa_land");
  L.check(`Rissa dei Sogni (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); })();
