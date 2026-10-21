// tests/eroi.cjs - Calcio d'Azione Eroi: partita 3v3 con abilità di ruolo, tiro, passaggio, portieri, coppa
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale", "leone", "campetto", "amico"], diffSet: true, flags: {} };
async function run(w) {
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.campetto": fin } });
  await page.evaluate(() => window.__sogni.sync()); await page.evaluate(() => { const S = window.__sogni, r = S._load(); ["of_ferro", "pd_zeno"].forEach((id) => { if (!r.own.includes(id)) r.own.push(id); }); r.team = ["of_ferro", "pd_zeno", "cm_bastiano"]; S._save(r); });
  await page.evaluate(() => window.__arena.open(() => {})); await page.waitForTimeout(250);
  if (!(await page.evaluate(() => !!document.querySelector('.arOv [data-go="ero"]')))) errors.push("manca il bottone Calcio nell'Arena");
  await page.evaluate(() => document.querySelector('.arOv [data-go="ero"]').click()); await page.waitForTimeout(300);
  const mn = await page.evaluate(() => ({ l: document.querySelectorAll(".erOv [data-l]").length, c: !!document.querySelector('.erOv [data-go="cup"]') })); if (mn.l !== 5 || !mn.c) errors.push("menu Calcio: " + JSON.stringify(mn));
  if (w === 390) await L.shot(page, "eroi_menu");
  await page.evaluate(() => document.querySelector('.erOv [data-l="1"]').click()); await page.waitForTimeout(700);
  await page.evaluate(() => window.__eroi.pause(true));
  if (w === 390) await L.shot(page, "eroi_via");
  const r = await page.evaluate(() => {
    const E = window.__eroi; let M = E.state(); E._fast(true); const o = {};
    o.n = [M.p.length, M.q.length]; for (let i = 0; i < 200; i++) E.tick();
    // il giocatore tira: porta la palla al centro-destra e tira
    const me = M.ctl; M.ball.owner = me; me.x = 300; me.y = 115; M.ball.x = me.x; M.ball.y = me.y; M.q[3].stun = 999; // portiere avversario KO per il tiro di prova
    const g0 = M.score[0]; E.press("b", true); for (let i = 0; i < 30; i++) E.tick(); E.press("b", false); for (let i = 0; i < 120 && M.score[0] === g0; i++) E.tick(); o.shot = M.score[0] - g0;
    { const q = M.p[1]; M.ctl = M.p[0]; const c = M.ctl; M.ball.owner = null; const x0 = c.x; M.stick && M.stick.set(1, 0); for (let i = 0; i < 30; i++) E.tick(); o.mv = Math.round(c.x - x0); M.stick && M.stick.set(0, 0); }
    return o;
  });
  if (r.n.join() !== "4,4") errors.push("giocatori: " + JSON.stringify(r));
  if (r.shot !== 1) errors.push("il tiro a porta vuota non fa gol: " + JSON.stringify(r));
  // abilità: Tiro Fuoco / Regia / Muro / Magnete
  const ab = await page.evaluate(() => {
    const E = window.__eroi, M = E.state(), out = {}; for (let i = 0; i < 200; i++) E.tick(); // finisce l'esultanza e riparte
    for (const role of ["A", "C", "D", "P"]) {
      M.energy[0] = 100; const p = M.p[0]; p.role = role; p.stun = 0; M.ctl = p; if (role === "A" || role === "C") { M.ball.owner = p; p.x = 200; p.y = 115; } else { M.ball.owner = null; M.ball.x = p.x + 30; M.ball.y = p.y; M.ball.vx = M.ball.vy = 0; M.q[0].x = p.x + 20; M.q[0].y = p.y; }
      const e0 = M.energy[0], ok = E.ability(p); out[role] = [ok, Math.round(e0 - M.energy[0]), role === "A" ? Math.round(Math.hypot(M.ball.vx, M.ball.vy)) : role === "D" ? M.q[0].stun : role === "P" ? (M.ball.owner === p) : Math.round(Math.hypot(M.ball.vx, M.ball.vy))];
    }
    return out;
  });
  if (!ab.A[0] || ab.A[1] !== 40 || ab.A[2] < 8) errors.push("Tiro Fuoco: " + JSON.stringify(ab.A));
  if (!ab.C[0] || ab.C[2] < 6) errors.push("Regia: " + JSON.stringify(ab.C));
  if (!ab.D[0] || ab.D[2] < 30) errors.push("Muro: " + JSON.stringify(ab.D));
  if (!ab.P[0] || !ab.P[2]) errors.push("Magnete: " + JSON.stringify(ab.P));
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
