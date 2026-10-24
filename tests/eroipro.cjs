// tests/eroipro.cjs - Calcio Eroi «Gameplay pro»: contrasto a tempo, cambio sul pallone in arrivo, passaggi che evitano i marcatori, filtrante
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale", "leone", "campetto", "amico"], diffSet: true, flags: {} };
async function run(w) {
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.campetto": fin } });
  await page.evaluate(() => { window.__sogni.sync(); const S = window.__sogni, r = S._load(); ["of_ferro", "pd_zeno"].forEach((id) => { if (!r.own.includes(id)) r.own.push(id); }); r.team = ["of_ferro", "pd_zeno", "cm_bastiano"]; S._save(r); });
  await page.evaluate(() => window.__eroi.game(1, null)); await page.waitForTimeout(500);
  await page.evaluate(() => window.__eroi.pause(true));
  const o = await page.evaluate(() => {
    const E = window.__eroi, M = E.state(); E._fast(true); M.opt.pro = true; for (let i = 0; i < 260; i++) E.tick(); const res = {};
    const q = M.q.filter((x) => !x.keeper)[0], me = M.p.filter((x) => !x.keeper)[0], mate = M.p.filter((x) => !x.keeper)[1];
    // contrasto: dentro la finestra (hold>=30 di 50) riesce, fuori no (con r fisso 0.4)
    const tk = (hold) => { M.q.concat(M.p).forEach((x) => { x.stun = 0; x.slide = 0; }); q.x = 300; q.y = 100; q.fx = 1; q.fy = 0; q.dribble = 60; M.ctl = me; me.x = 318; me.y = 100; me.tack = 60; me.stun = 0; M.ball.owner = q; q.hold = hold; M.r = () => 0.4; const ok = (E.tackle(me), M.ball.owner !== q); return ok; };
    res.inWin = tk(35); res.outWin = tk(5);
    // cambio automatico sul ricevente
    M.ball.owner = null; M.ball.kick = 0; M.ball.to = mate; M.ctl = me; M.ball.x = 200; M.ball.y = 100; M.ball.vx = 3; M.ball.vy = 0; E.tick(); res.sw = M.ctl === mate; res.dbg = [M.t, M.stop, M.goalT, M.over, M.ctl.id, mate.id, M.opt.pro];
    // passaggio: un avversario sulla linea verso il compagno vicino, l'altro libero -> sceglie il libero
    const f = M.p.filter((x) => !x.keeper), a = f[0], b = f[1]; M.ball.to = null; M.q.forEach((x) => { x.x = 900; x.y = 900; });
    a.x = 100; a.y = 115; b.x = 200; b.y = 115; const cands = M.p.filter((x) => !x.keeper && x !== a && x !== b);
    res.nm = cands.length; M.ball.owner = a; a.hold = 0; M.ball.cool = 0; b.vx = 0; b.vy = 0; E.pass(a, b, { through: 1 }); res.th = [M.ball.owner === null, Math.round(M.ball.vx * 10) / 10, b.vx > 0.3];
    return res;
  });
  const ring = await page.evaluate(() => { const E = window.__eroi, M = E.state(); E._fast(false); const q = M.q.find((x) => !x.keeper), me = M.p.find((x) => !x.keeper); M.t = 500; q.x = me.x + 18; q.y = me.y; M.ctl = me; M.ball.owner = q; q.hold = 35; M.draw(); const c = document.querySelector(".erStage canvas"), d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - 122) < 12 && Math.abs(d[i + 1] - 216) < 12 && Math.abs(d[i + 2] - 122) < 12) n++; return n; });
  if (ring < 10) errors.push("anello verde non disegnato: " + ring);
  if (!o.inWin) errors.push("contrasto nella finestra fallito"); if (o.outWin) errors.push("contrasto fuori finestra riuscito: " + JSON.stringify(o));
  if (!o.sw) errors.push("niente cambio sul ricevente " + JSON.stringify(o.dbg));
  if (!o.th[0] || !o.th[2] || o.th[1] < 6) errors.push("passaggio filtrante: " + JSON.stringify(o.th));
  L.check(`Calcio Eroi · Gameplay pro (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); })();
