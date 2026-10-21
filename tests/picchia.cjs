// tests/picchia.cjs - Duello dei Sogni: picchiaduro 1v1 (mosse, speciali di ruolo, round, torneo)
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale", "leone", "campetto", "amico"], diffSet: true, flags: {} };
async function run(w) {
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.campetto": fin } });
  await page.evaluate(() => { const S = window.__sogni; S.sync(); const r = S._load(); ["of_ferro", "pd_zeno"].forEach((id) => { if (!r.own.includes(id)) r.own.push(id); }); r.team = ["of_ferro", "pd_zeno", "cm_bastiano"]; S._save(r); }); 
  await page.evaluate(() => window.__arena.open(() => {})); await page.waitForTimeout(250);
  if (!(await page.evaluate(() => !!document.querySelector('.arOv [data-go="pic"]')))) errors.push("manca il bottone Duello nell'Arena");
  await page.evaluate(() => document.querySelector('.arOv [data-go="pic"]').click()); await page.waitForTimeout(300);
  const mn = await page.evaluate(() => ({ picks: document.querySelectorAll(".pcOv .pcPick .c").length, go: [...document.querySelectorAll(".pcOv [data-go]")].map((b) => b.dataset.go).join() }));
  if (mn.picks < 3 || mn.go !== "tour,quick,train") errors.push("menu Duello: " + JSON.stringify(mn));
  if (w === 390) await L.shot(page, "duello_menu");
  // allenamento: mosse
  await page.evaluate(() => document.querySelector('.pcOv [data-go="train"]').click()); await page.waitForTimeout(500);
  await page.evaluate(() => window.__picchia.pause(true));
  const r = await page.evaluate(() => {
    const P = window.__picchia, G = P.state(); P._fast(true); const out = {};
    for (let i = 0; i < 3; i++) P.tick(); // fine intro
    G.p.x = 150; G.e.x = 180; const h0 = G.e.hp;
    P.press("a", true); for (let i = 0; i < 20; i++) P.tick(); out.punch = h0 - G.e.hp;
    for (let i = 0; i < 30; i++) P.tick(); const h1 = G.e.hp; P.press("b", true); for (let i = 0; i < 30; i++) P.tick(); out.kick = h1 - G.e.hp;
    for (let i = 0; i < 30; i++) P.tick(); G.p.meter = 100; G.e.x = 200; const h2 = G.e.hp; P.press("s", true); for (let i = 0; i < 70; i++) P.tick(); out.spec = h2 - G.e.hp; out.meter = G.p.meter;
    for (let i = 0; i < 30; i++) P.tick(); G.p.meter = 100; const h3 = G.e.hp; P.press("x", true); for (let i = 0; i < 80; i++) P.tick(); out.sup = h3 - G.e.hp;
    out.role = G.p.role; return out;
  });
  if (!(r.punch > 0) || !(r.kick > r.punch) || !(r.spec > 0) || !(r.sup > 0) || r.meter >= 100) errors.push("mosse: " + JSON.stringify(r));
  if (w === 390) await L.shot(page, "duello_lotta");
  // nuove mosse: catena, anti-aereo, presa, scatto, joystick
  const nm = await page.evaluate(() => {
    const P = window.__picchia, G = P.state(); const o = {}; const reset = () => { G.p.st = "idle"; G.e.st = "idle"; G.p.atk = G.e.atk = null; G.p.y = G.e.y = 0; G.p.vy = G.e.vy = 0; G.p.inv = G.e.inv = 0; G.p.x = 150; G.e.x = 176; G.e.hp = G.e.hpMax = 9999; G.p.hits = G.e.hits = 0; for (let i = 0; i < 50; i++) P.tick(); G.p.x = 150; G.e.x = 176; };
    reset(); let h = G.e.hp; P.press("a", true); for (let i = 0; i < 6; i++) P.tick(); P.press("a", true); for (let i = 0; i < 6; i++) P.tick(); P.press("a", true); for (let i = 0; i < 40; i++) P.tick(); o.chain = h - G.e.hp; o.hits = G.p.combo;
    reset(); h = G.e.hp; P.press("t", true); for (let i = 0; i < 12; i++) P.tick(); o.thr = h - G.e.hp; o.thrSt = G.e.st;
    reset(); h = G.e.hp; G.e.st = "block"; G.inp.d = 0; P.press("t", true); for (let i = 0; i < 12; i++) P.tick(); o.thrBlk = h - G.e.hp;
    reset(); h = G.e.hp; G.inp.d = 1; P.press("a", true); for (let i = 0; i < 14; i++) P.tick(); G.inp.d = 0; o.up = h - G.e.hp; o.upAir = G.e.y > 0 || G.e.st === "hit";
    reset(); G.p.x = 100; G.e.x = 300; const x0 = G.p.x; G.stk.set(1, 0); for (let i = 0; i < 20; i++) P.tick(); G.stk.set(0, 0); o.walk = Math.round(G.p.x - x0);
    reset(); G.p.x = 100; G.e.x = 300; const x1 = G.p.x; P.press("h", true); for (let i = 0; i < 12; i++) P.tick(); o.dash = Math.round(G.p.x - x1);
    reset(); G.p.x = 100; G.e.x = 300; G.stk.set(0, -1); for (let i = 0; i < 4; i++) P.tick(); o.jump = G.p.y > 0; G.stk.set(0, 0);
    return o;
  });
  if (!(nm.chain > 0) || nm.hits < 2) errors.push("catena di pugni: " + JSON.stringify(nm));
  if (!(nm.thr > 0) || !(nm.thrBlk > 0)) errors.push("presa: " + JSON.stringify(nm));
  if (!(nm.up > 0) || !nm.upAir) errors.push("anti-aereo: " + JSON.stringify(nm));
  if (nm.walk < 15 || nm.dash < 25 || !nm.jump) errors.push("joystick/scatto/salto: " + JSON.stringify(nm));
  // super per saga: tutti e nove gli effetti fanno danno
  const sx = await page.evaluate(() => {
    const P = window.__picchia, G = P.state(), out = {};
    for (const fx of ["fire", "thunder", "curve", "zig", "spiral", "vanish", "ice", "change", "drill"]) {
      for (let i = 0; i < 60; i++) P.tick(); G.p.st = "idle"; G.e.st = "idle"; G.p.atk = G.e.atk = null; G.p.y = G.e.y = 0; G.p.vy = G.e.vy = 0; G.p.inv = G.e.inv = 0; G.e.ice = 0; G.p.x = 150; G.e.x = 215; G.e.hp = G.e.hpMax = 9999; G.p.meter = 100; G.p.sg = { fx, name: "t", col: "#ffaa00", saga: "" };
      const h = G.e.hp; P.press("x", true); let n = 0, nan = false; for (; n < 120; n++) { P.tick(); if (!isFinite(G.p.x) || !isFinite(G.e.x)) nan = true; } out[fx] = [h - G.e.hp, nan, G.p.st];
    }
    return out;
  });
  Object.keys(sx).forEach((k) => { if (!(sx[k][0] > 0) || sx[k][1]) errors.push("super " + k + ": " + JSON.stringify(sx[k])); });
  // parata
  const bl = await page.evaluate(() => { const P = window.__picchia, G = P.state(); G.e.hp = G.e.hpMax = 9999; G.p.hp = G.p.hpMax; G.p.x = 150; G.e.x = 175; G.e.st = "idle"; G.e.atk = null; G.p.st = "idle"; G.p.atk = null; for (let i = 0; i < 40; i++) P.tick(); const h = G.p.hp; P.press("d", true); G.e.ai = 0; const E = G.e; E.st = "atk"; E.atk = { k: "b", su: 2, ac: 3, rc: 4, dmg: 12, reach: 44, stun: 19, kb: 5 }; E.t = 0; E.hit = false; for (let i = 0; i < 12; i++) P.tick(); P.press("d", false); return [h - G.p.hp, G.p.st]; });
  if (!(bl[0] >= 0 && bl[0] <= 4)) errors.push("la parata non riduce i danni: " + JSON.stringify(bl));
  // incontro rapido: vittoria al meglio di tre
  await page.evaluate(() => window.__picchia.open()); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('.pcOv [data-go="quick"]').click()); await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.pcOv [data-l="1"]').click()); await page.waitForTimeout(400);
  await page.evaluate(() => { window.__picchia.pause(true); });
  const m = await page.evaluate(() => {
    const P = window.__picchia, G = P.state(); P._fast(true);
    for (let k = 0; k < 2; k++) { for (let i = 0; i < 4; i++) P.tick(); G.e.hp = 0; G.e.st = "ko"; G.e.y = 0.1; for (let i = 0; i < 5; i++) P.tick(); }
    return [G.over, G.p.rounds];
  });
  if (m[0] !== "win" || m[1] !== 2) errors.push("partita al meglio di tre: " + JSON.stringify(m));
  await page.waitForTimeout(400);
  const t = await page.evaluate(() => (document.querySelector(".pcOv h3") || {}).textContent); if (t !== "Vittoria!") errors.push("schermata esito: " + t);
  const st = await page.evaluate(() => window.__picchia.load()); if (st.wins !== 1) errors.push("vittorie non salvate: " + JSON.stringify(st));
  // torneo: primo incontro vinto, avanza
  await page.evaluate(() => window.__picchia.open()); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('.pcOv [data-go="tour"]').click()); await page.waitForTimeout(400);
  await page.evaluate(() => { const P = window.__picchia, G = P.state(); window.__picchia.pause(true); P._fast(true); for (let k = 0; k < 2; k++) { for (let i = 0; i < 4; i++) P.tick(); G.e.hp = 0; G.e.st = "ko"; G.e.y = 0.1; for (let i = 0; i < 5; i++) P.tick(); } });
  await page.waitForTimeout(400);
  const nx = await page.evaluate(() => ({ next: !!document.querySelector('.pcOv [data-go="next"]'), tour: window.__picchia.load().tour })); if (!nx.next || nx.tour !== 1) errors.push("torneo: " + JSON.stringify(nx));
  if (w === 390) await L.shot(page, "duello_esito");
  L.check(`Duello dei Sogni (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); })();
