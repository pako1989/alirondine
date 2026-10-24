// tests/eroi.cjs - Calcio d'Azione Eroi: partita 3v3 con abilità di ruolo, tiro, passaggio, portieri, coppa
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale", "leone", "campetto", "amico"], diffSet: true, flags: {} };
async function run(w) {
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.campetto": fin } });
  await page.evaluate(() => window.__sogni.sync()); await page.evaluate(() => { const S = window.__sogni, r = S._load(); ["of_ferro", "pd_zeno"].forEach((id) => { if (!r.own.includes(id)) r.own.push(id); }); r.team = ["of_ferro", "pd_zeno", "cm_bastiano"]; S._save(r); });
  await page.evaluate(() => window.__arena.open(() => {})); await page.waitForTimeout(250);
  if (!(await page.evaluate(() => !!document.querySelector('.arOv [data-go="ero"]')))) errors.push("manca il bottone Calcio nell'Arena");
  await page.evaluate(() => document.querySelector('.arOv [data-go="ero"]').click()); await page.waitForTimeout(300);
  await page.evaluate(() => { const S = window.__sogni, r = S._load(); window.__gkId = r.team.find((id) => S.BY[id] && S.BY[id].role === "P") || null; });
  const mn = await page.evaluate(() => ({ l: document.querySelectorAll(".erOv [data-l]").length, c: !!document.querySelector('.erOv [data-go="cup"]') })); if (mn.l !== 5 || !mn.c) errors.push("menu Calcio: " + JSON.stringify(mn));
  if (w === 390) await L.shot(page, "eroi_menu");
  await page.evaluate(() => document.querySelector('.erOv [data-l="1"]').click()); await page.waitForTimeout(700);
  await page.evaluate(() => window.__eroi.pause(true));
  if (w === 390) await L.shot(page, "eroi_via");
  const r = await page.evaluate(() => {
    const E = window.__eroi; let M = E.state(); E._fast(true); const o = {};
    o.n = [M.p.length, M.q.length]; for (let i = 0; i < 200; i++) E.tick();
    // il giocatore tira: porta la palla al centro-destra e tira
    const me = M.ctl; M.ball.owner = me; me.x = 300; me.y = 115; M.ball.x = me.x; M.ball.y = me.y; M.q[M.q.length - 1].stun = 999; // portiere avversario KO per il tiro di prova
    const g0 = M.score[0]; E.press("b", true); for (let i = 0; i < 30; i++) E.tick(); E.press("b", false); for (let i = 0; i < 120 && M.score[0] === g0; i++) E.tick(); o.shot = M.score[0] - g0;
    { const q = M.p[1]; M.ctl = M.p[0]; const c = M.ctl; M.ball.owner = null; const x0 = c.x; M.stick && M.stick.set(1, 0); for (let i = 0; i < 30; i++) E.tick(); o.mv = Math.round(c.x - x0); M.stick && M.stick.set(0, 0); }
    return o;
  });
  { const kp = await page.evaluate(() => { const M = window.__eroi.state(), k = M.p[M.p.length - 1], f = M.p.slice(0, -1); return { keeper: k.keeper, gk: window.__gkId, id: k.id, fieldKeeper: f.some((p) => p.keeper), mine: M.cfg.mine.length }; }); if (!kp.keeper || kp.fieldKeeper || kp.mine !== 2 || (kp.gk && kp.id !== kp.gk)) errors.push("portiere dalla carta: " + JSON.stringify(kp)); }
  if (r.n.join() !== "3,3") errors.push("giocatori: " + JSON.stringify(r));
  if (r.shot !== 1) errors.push("il tiro a porta vuota non fa gol: " + JSON.stringify(r));
  // abilità: Tiro Fuoco / Regia / Muro / Magnete
  const ab = await page.evaluate(() => {
    const E = window.__eroi, M = E.state(), out = {}; M.opt.combo = false; for (let i = 0; i < 200; i++) E.tick(); // finisce l'esultanza e riparte
    for (const role of ["A", "C", "D", "P"]) {
      M.energy[0] = 100; const p = M.p[0]; p.role = role; p.stun = 0; M.ctl = p; if (role === "A" || role === "C") { M.ball.owner = p; p.x = 200; p.y = 115; } else { M.ball.owner = null; M.ball.x = p.x + 30; M.ball.y = p.y; M.ball.vx = M.ball.vy = 0; M.q[0].x = p.x + 20; M.q[0].y = p.y; }
      const e0 = M.energy[0], ok = E.ability(p); out[role] = [ok, Math.round(e0 - M.energy[0]), role === "A" ? (M.ball.sup ? 99 : Math.round(Math.hypot(M.ball.vx, M.ball.vy))) : role === "D" ? M.q[0].stun : role === "P" ? (M.ball.owner === p) : Math.round(Math.hypot(M.ball.vx, M.ball.vy))];
    }
    return out;
  });
  // tiro combinato (compagno vicino, +25 energia) e telecronaca
  const cb = await page.evaluate(() => {
    const E = window.__eroi, M = E.state(); M.opt.combo = true; M.opt.tele = true; M.fast = false; const p = M.p[0], m = M.p[1]; p.role = "A"; p.stun = 0; m.stun = 0; M.ctl = p; M.ball.owner = p; p.x = 200; p.y = 115; m.x = 215; m.y = 120; M.energy[0] = 100; M.stop = 0;
    const e0 = M.energy[0], ok = E.ability(p), out = { ok, cost: Math.round(e0 - M.energy[0]), twin: !!M.ball.twin, say: M.cm && M.cm.t }; M.fast = true; M.opt.combo = false; return out;
  });
  if (!cb.ok || cb.cost !== 65 || !cb.twin || !/COMBINATO|insieme|serve|campioni|solo tiro/.test(cb.say || "")) errors.push("tiro combinato: " + JSON.stringify(cb));
  if (!ab.A[0] || ab.A[1] !== 40 || ab.A[2] < 8) errors.push("Tiro Fuoco: " + JSON.stringify(ab.A));
  if (!ab.C[0] || ab.C[2] < 6) errors.push("Regia: " + JSON.stringify(ab.C));
  if (!ab.D[0] || ab.D[2] < 30) errors.push("Muro: " + JSON.stringify(ab.D));
  if (!ab.P[0] || !ab.P[2]) errors.push("Magnete: " + JSON.stringify(ab.P));
  // super tiri per saga: ogni saga ha un effetto, la palla lo porta e poi si pulisce
  const sp = await page.evaluate(() => {
    const E = window.__eroi, M = E.state(), out = {}; M.cfg.auto = false; E._fast(true);
    for (const fx of ["fire", "thunder", "curve", "zig", "spiral", "vanish", "ice", "change", "drill"]) {
      for (let i = 0; i < 200; i++) E.tick(); const p = M.p[0]; p.stun = 0; M.ctl = p; M.ball.owner = p; p.x = 250; p.y = M.ball.y = 115; M.energy[0] = 100; M.q[M.q.length - 1].stun = 999;
      E.shoot(p, { aim: 115, mult: 1.75, power: p.shoot, sup: { fx, col: "#ffaa00", name: "t" } }); const s0 = M.ball.sup; let g0 = M.score[0], n = 0, nan = false; while (M.score[0] === g0 && n++ < 150) { E.tick(); if (!isFinite(M.ball.x) || !isFinite(M.ball.y)) nan = true; } out[fx] = [s0, M.score[0] - g0, nan];
      M.score[0] = 0; M.goalT = 0; M.over = null; M.t = 100;
    }
    return out;
  });
  Object.keys(sp).forEach((k) => { if (sp[k][0] !== k || sp[k][2]) errors.push("super " + k + ": " + JSON.stringify(sp[k])); });
  if (Object.values(sp).filter((v) => v[1] === 1).length < 7) errors.push("super: pochi gol su porta vuota: " + JSON.stringify(sp));
  // 5 contro 5, campo grande, landscape
  await page.evaluate(() => window.__eroi.open()); await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.erOv [data-mode]').click()); await page.waitForTimeout(120);
  await page.evaluate(() => document.querySelector('.erOv [data-l="3"]').click()); await page.waitForTimeout(500); await page.evaluate(() => window.__eroi.pause(true));
  const f5 = await page.evaluate(() => { const E = window.__eroi, M = E.state(); return { p: M.p.length, q: M.q.length, vw: M.vw, mode: E.load().mode, ctl: !!M.ctl }; });
  if (f5.p !== 5 || f5.q !== 5 || f5.mode !== 5 || f5.vw > 412) errors.push("5 contro 5: " + JSON.stringify(f5));
  if (w === 390) await L.shot(page, "eroi_5v5");
  await page.setViewportSize({ width: 844, height: 390 }); await page.waitForTimeout(400);
  const ls = await page.evaluate(() => { const M = window.__eroi.state(), c = document.querySelector(".erOv canvas"); const r = c.getBoundingClientRect(); return { land: document.querySelector(".erOv").classList.contains("land"), vw: M.vw, cw: c.width, h: Math.round(r.height), w: Math.round(r.width) }; });
  if (!ls.land || ls.vw < 500 || ls.h < 340) errors.push("landscape: " + JSON.stringify(ls));
  if (w === 390) await L.shot(page, "eroi_land");
  await page.evaluate(() => { const E = window.__eroi, M = E.state(); E._fast(true); M.cfg.auto = true; let n = 0; while (!M.over && n++ < 40000) E.tick(); window.__r5 = { over: M.over, nan: M.all.some((p) => !isFinite(p.x) || !isFinite(p.y)), shots: M.stat.shots.join("-") }; });
  const r5 = await page.evaluate(() => window.__r5); if (!r5.over || r5.nan || r5.shots === "0-0") errors.push("partita 5v5 IA: " + JSON.stringify(r5));
  await page.setViewportSize({ width: w, height: 844 });
  await page.evaluate(() => { const x = window.__eroi.load(); x.mode = 3; window.__eroi.save(x); });
  // partita IA contro IA completa: finisce, niente NaN, ci sono tiri
  await page.evaluate(() => window.__eroi.open()); await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.erOv [data-l="3"]').click()); await page.waitForTimeout(400); await page.evaluate(() => window.__eroi.pause(true));
  const full = await page.evaluate(() => { const E = window.__eroi, M = E.state(); E._fast(true); M.cfg.auto = true; let n = 0; while (!M.over && n++ < 30000) E.tick(); const nan = M.all.some((p) => !isFinite(p.x) || !isFinite(p.y)) || !isFinite(M.ball.x); return { over: M.over, n, score: M.score.join("-"), shots: M.stat.shots.join("-"), saves: M.stat.saves.join("-"), nan }; });
  if (!full.over || full.nan) errors.push("partita IA: " + JSON.stringify(full));
  if (full.shots === "0-0") errors.push("nessun tiro in una partita intera: " + JSON.stringify(full));
  await page.waitForTimeout(400);
  const rs = await page.evaluate(() => ({ h: (document.querySelector(".erOv h3") || {}).textContent, b: document.querySelectorAll(".erOv .one").length })); if (!/\d+ - \d+/.test(rs.h || "") || rs.b < 2) errors.push("risultato: " + JSON.stringify(rs));
  if (w === 390) await L.shot(page, "eroi_risultato");
  // coppa: vittoria 3-0 e turno successivo
  await page.evaluate(() => window.__eroi.open()); await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.erOv [data-go="cup"]').click()); await page.waitForTimeout(400); await page.evaluate(() => window.__eroi.pause(true));
  await page.evaluate(() => { const E = window.__eroi, M = E.state(); E._fast(true); M.score = [3, 0]; M.t = 4799; M.ball.owner = null; for (let i = 0; i < 5; i++) E.tick(); });
  await page.waitForTimeout(400);
  const nx = await page.evaluate(() => ({ next: !!document.querySelector('.erOv [data-go="next"]'), c: window.__eroi.load() })); if (!nx.next || nx.c.wins < 1) errors.push("coppa: " + JSON.stringify(nx));
  L.check(`Calcio d'Azione Eroi (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); })();
