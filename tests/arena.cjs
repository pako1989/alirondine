// tests/arena.cjs - Arena dei Sogni (scontri, arena del giorno) e Torre dei Duelli: motore a turni, abilità, vittoria/sconfitta, progressi
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale", "leone", "campetto", "amico"], diffSet: true, flags: {} };
const uno = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "a" }, ends: [], diffSet: true, flags: {} };
async function run(w) {
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.campetto": fin, "ali-di-rondine.trono": uno } });
  await page.evaluate(() => { const S = window.__sogni; S.sync(); const r = S._load(); ["of_ferro", "pd_zeno"].forEach((id) => { if (!r.own.includes(id)) r.own.push(id); }); r.team = ["of_ferro", "cm_bastiano", "cm_leone", "pd_zeno", "tc_brunilde"].filter((id) => r.own.includes(id)); S._save(r); });
  // dalla Squadra dei Sogni c'è il bottone
  await page.evaluate(() => window.__sogni.open(() => {})); await page.waitForTimeout(300);
  if (!(await page.evaluate(() => !!document.querySelector('.sgOv [data-go="arena"]')))) errors.push("manca il bottone Arena nella Squadra dei Sogni");
  await page.evaluate(() => document.querySelector('.sgOv [data-go="arena"]').click()); await page.waitForTimeout(300);
  const menu = await page.evaluate(() => ({ tiers: document.querySelectorAll(".arOv [data-tier]").length, dis: [...document.querySelectorAll(".arOv [data-tier]")].filter((b) => b.disabled).length, t: !!document.querySelector('.arOv [data-go="torre"]'), d: !!document.querySelector('.arOv [data-go="daily"]') }));
  if (menu.tiers !== 5 || menu.dis !== 4 || !menu.t || !menu.d) errors.push("menu Arena: " + JSON.stringify(menu));
  if (w === 390) await L.shot(page, "arena_menu");
  // scontro 1: battaglia a vista, abilità con cut-in
  await page.evaluate(() => document.querySelector('.arOv [data-tier="1"]').click()); await page.waitForTimeout(900);
  const bt = await page.evaluate(() => ({ foes: document.querySelectorAll('.arOv [data-r="e"] .arU').length, mine: document.querySelectorAll('.arOv [data-r="p"] .arU').length, acts: document.querySelectorAll(".arOv [data-a]").length }));
  if (bt.foes !== 5 || bt.mine < 1) errors.push("battaglia: " + JSON.stringify(bt));
  if (w === 390) await L.shot(page, "arena_battaglia");
  // fino al primo turno del giocatore (sono turni a tempo)
  for (let i = 0; i < 40 && !(await page.evaluate(() => document.querySelectorAll(".arOv [data-a]").length)); i++) await page.waitForTimeout(250);
  await page.evaluate(() => { const B = window.__arena.state(); B.cur.cd = 0; B.cur.role = "D"; document.querySelector('.arOv [data-a="ability"]') && 0; });
  await page.evaluate(() => window.__arena.state().cur.cd = 0); await page.waitForTimeout(120);
  await page.evaluate(() => { const b = document.querySelector('.arOv [data-a="ability"]'); if (b) b.click(); });
  await page.waitForTimeout(250);
  if (w === 390) await L.shot(page, "arena_cutin");
  // il resto in modo veloce
  await page.evaluate(() => { const B = window.__arena.state(); clearTimeout(B.wait); window.__arena._fast(true); });
  // forza la vittoria: nemici a 1 PV, il giocatore attacca
  const win = await page.evaluate(() => {
    const A = window.__arena; let B = A.state(); B.foes.forEach((u) => (u.hp = 1));
    for (let i = 0; i < 80 && !B.over; i++) { if (B.cur && B.cur.side === "p") A.act("attack"); else { B.cur = null; break; } }
    return B.over;
  });
  if (win !== "win") {
    // se il turno nemico era in corso, prosegui
    const w2 = await page.evaluate(() => { const A = window.__arena; let B = A.state(); for (let i = 0; i < 200 && !B.over; i++) { if (B.cur && B.cur.side === "p") { B.foes.forEach((u) => (u.hp = Math.min(u.hp, 1))); A.act("attack"); } else break; } return B.over; });
    if (w2 !== "win") errors.push("scontro: esito " + w2);
  }
  await page.waitForTimeout(400);
  const r1 = await page.evaluate(() => ({ t: document.querySelector(".arOv h3") && document.querySelector(".arOv h3").textContent, a: window.__arena.load() }));
  if (r1.t !== "Vittoria!") errors.push("schermata esito: " + r1.t);
  if (r1.a.tier !== 2 || r1.a.wins !== 1) errors.push("progressi scontro: " + JSON.stringify(r1.a));
  if (Object.keys(r1.a.xp).length < 1) errors.push("nessuna esperienza di Arena");
  if (w === 390) await L.shot(page, "arena_vittoria");
  // sconfitta: squadra a terra
  await page.evaluate(() => window.__arena.open()); await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.arOv [data-tier="1"]').click()); await page.waitForTimeout(200);
  await page.evaluate(() => { const A = window.__arena; A._fast(true); const B = A.state(); clearTimeout(B.wait); B.team.forEach((u) => (u.hp = 1)); B.foes.forEach((u) => (u.at = 400)); let n = 0; while (!B.over && n++ < 200) { if (B.cur && B.cur.side === "p") A.act("defend"); else { B.cur = null; break; } } });
  await page.waitForTimeout(300);
  const lo = await page.evaluate(() => (document.querySelector(".arOv h3") || {}).textContent || window.__arena.state().over); if (lo !== "Sconfitta" && lo !== "lose") errors.push("sconfitta: " + lo);
  // arena del giorno
  await page.evaluate(() => window.__arena.open()); await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.arOv [data-go="daily"]').click()); await page.waitForTimeout(300);
  const dsub = await page.evaluate(() => (document.querySelector(".arHd span") || {}).textContent || ""); if (!dsub) errors.push("arena del giorno senza modificatore");
  // Torre: piano 1 vinto, scelta potenziamento, piano 2
  await page.evaluate(() => window.__arena.open()); await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.arOv [data-go="torre"]').click()); await page.waitForTimeout(300);
  await page.evaluate(() => { const A = window.__arena; A._fast(true); const B = A.state(); clearTimeout(B.wait); B.foes.forEach((u) => (u.hp = 1)); let n = 0; while (!B.over && n++ < 100) { if (B.cur && B.cur.side === "p") A.act("attack"); else break; } });
  await page.waitForTimeout(300);
  const pk = await page.evaluate(() => document.querySelectorAll(".arOv [data-p]").length); if (pk !== 3) errors.push("potenziamenti: " + pk);
  if (w === 390) await L.shot(page, "arena_torre");
  await page.evaluate(() => document.querySelector('.arOv [data-p="fuoco"],.arOv [data-p]').click()); await page.waitForTimeout(300);
  const dr = await page.evaluate(() => [...document.querySelectorAll(".arOv [data-d]")].map((b) => b.dataset.d)); if (dr.length !== 3) errors.push("bivio: " + dr);
  if (w === 390) await L.shot(page, "arena_bivio");
  await page.evaluate(() => { const A = window.__arena, a = A.load(); a.run.hp[a.run.team[0]] = 5; A.save(a); });
  await page.evaluate(() => { const b = document.querySelector('.arOv [data-d="riposo"]') || document.querySelector('.arOv [data-d="salita"]') || document.querySelector(".arOv [data-d]"); b.click(); }); await page.waitForTimeout(400);
  if (dr.includes("riposo")) { const h = await page.evaluate(() => window.__arena.load().run.hp[window.__arena.load().run.team[0]]); if (!(h > 5)) errors.push("riposo non cura: " + h); }
  const tt = await page.evaluate(() => ({ h: document.querySelector(".bar h2").textContent, run: window.__arena.load().run }));
  if (!/piano 2/.test(tt.h) || !tt.run || tt.run.floor !== 2) errors.push("Torre piano 2: " + JSON.stringify(tt));
  // Battaglia a fondo: intenzioni, stati, Super, fasi del boss, eventi
  await page.evaluate(() => { window.__arena.close(); window.__arena._fast(true); });
  const dp = await page.evaluate(() => {
    const A = window.__arena, out = {}; A.open(); document.querySelector('.arOv [data-tier="1"]').click(); const B = A.state(); clearTimeout(B.wait); A._fast(true);
    out.deep = B.deep; out.intents = B.foes.filter((f) => f.intent).length;
    // stordito: salta il turno senza agire; colpo >=30% PV interrompe
    B.foes.forEach((f) => (f.hp = f.maxhp = 9999)); const f0 = B.foes[0], f1 = B.foes[1]; f0.stun = 1; f0.intent = { k: "atk", t: B.team[0].id };
    f1.hp = f1.maxhp = 100; f1.intent = { k: "atk", t: B.team[0].id }; B.team[0].at = 400; B.cur = B.team[0]; A.act("attack", f1.id);
    out.broken = f1.hp > 0 ? f1.broken === true && f1.intent === null : true;
    out.stunSet = f0.stun === 1;
    return out;
  });
  if (!dp.deep || dp.intents < 1 || !dp.broken) errors.push("battaglia a fondo: " + JSON.stringify(dp));
  // boss a fasi
  const ph = await page.evaluate(() => {
    const A = window.__arena; A._fast(true); A.close(); const f = A.floorFoes(10);
    A.start({ title: "t", sub: "s", foes: f.foes, boss: true, tierM: 1, onEnd() {}, deep: true }); const B = A.state(); clearTimeout(B.wait);
    const boss = B.foes[0], at0 = boss.at; B.cur = B.team[0]; boss.hp = Math.round(boss.maxhp * 0.45); B.deep = true;
    // un colpo qualunque porta alla fase 2
    B.team[0].at = 300; B.cur = B.team[0]; A.act("attack", boss.id);
    const p2 = boss.ph; boss.hp = Math.round(boss.maxhp * 0.15); const bt = boss.hp; boss.shield = 0; if (B.cur && B.cur.side === "p") A.act("attack", boss.id); else { B.cur = B.team[0]; A.act("attack", boss.id); }
    return { p2, p3: boss.ph, grew: boss.at > at0, bt };
  });
  if (ph.p2 < 2 || ph.p3 < 3 || !ph.grew) errors.push("boss a fasi: " + JSON.stringify(ph));
  // Super: carica e colpisce tutti
  const su = await page.evaluate(() => {
    const A = window.__arena; A.close(); A.start({ title: "t", sub: "s", foes: A.floorFoes(3).foes, tierM: 1, onEnd() {}, deep: true }); const B = A.state(); clearTimeout(B.wait);
    B.foes.forEach((f) => (f.hp = f.maxhp = 5000)); B.cur = B.team[0]; B.gauge = 50; const no = A.act("super"); B.gauge = 100; B.cur = B.team[0]; const ok = A.act("super");
    return { no, ok, g: B.gauge, burning: B.foes.filter((f) => f.burn > 0 || f.hp < 5000).length };
  });
  if (su.no || !su.ok || su.g > 30 || su.burning < 3) errors.push("Colpo di squadra: " + JSON.stringify(su));
  // eventi (tutti) e opzione spenta
  const evs = await page.evaluate(() => { const A = window.__arena, bad = []; A.EVENTS.forEach((ev) => ev.o.forEach((o, i) => { const run = { floor: 3, perks: [], hp: {}, team: A.load().run ? A.load().run.team : window.__sogni._load().team }; try { const t = o[2](run, Math.random); if (typeof t !== "string" || !t) bad.push(ev.t + i); } catch (e) { bad.push(ev.t + i + ":" + e.message); } })); return bad; });
  if (evs.length) errors.push("eventi: " + evs);
  const off = await page.evaluate(() => { const A = window.__arena, a = A.load(); a.deep = false; A.save(a); A.close(); A.start({ title: "t", sub: "s", foes: A.floorFoes(3).foes, tierM: 1, onEnd() {} }); const B = A.state(); clearTimeout(B.wait); const r = { d: B.deep, it: B.foes.filter((f) => f.intent).length, sup: !!document.querySelector('.arOv [data-a="super"]') }; a.deep = true; A.save(a); A.close(); return r; });
  if (off.d || off.it || off.sup) errors.push("opzione spenta: " + JSON.stringify(off));
  // boss al piano 10
  const f10 = await page.evaluate(() => window.__arena.floorFoes(10)); if (!f10.boss || f10.foes.length < 3) errors.push("boss piano 10: " + JSON.stringify(f10.boss));
  await page.evaluate(() => { const A = window.__arena, a = A.load(); a.run = null; A.save(a); });

  // Staffetta dei Dieci: panchina in Squadra dei Sogni, bestTen, subentro KO automatico, cambio tattico, intervallo e 4 ondate
  await page.evaluate(() => {
    window.__arena._fast(false);
    const S = window.__sogni, r = S._load();
    ["leo", "dario", "nico", "tommy", "sara", "ruggeri", "cm_bastiano", "cm_leone", "cm_saverio", "cm_pio", "tc_brunilde", "of_ferro"].forEach((id) => {
      if (S.BY[id] && !r.own.includes(id)) r.own.push(id);
    });
    S._save(r);
  });
  const stfPrep = await page.evaluate(() => {
    const S = window.__sogni, A = window.__arena;
    S.open();
    const hasBenchBox = !!document.querySelector(".sgOv .sgBenchBox");
    const picked = A.bestTen();
    A.openStaffetta();
    return {
      hasBenchBox,
      teamLen: picked.team.length,
      benchLen: picked.bench.length,
      disjoint: picked.team.every((id) => !picked.bench.includes(id)),
      hasStartBtn: !!document.querySelector('.arOv [data-stf="start"]')
    };
  });
  if (!stfPrep.hasBenchBox || stfPrep.teamLen !== 5 || stfPrep.benchLen !== 5 || !stfPrep.disjoint || !stfPrep.hasStartBtn) {
    errors.push("Staffetta preparazione: " + JSON.stringify(stfPrep));
  }
  if (w === 390) await L.shot(page, "arena_staffetta_lobby");

  // Avvia Ondata 1 con cut-in e verifica striscia panchina + subentro KO automatico e cambio tattico
  await page.evaluate(() => document.querySelector('.arOv [data-stf="start"]').click());
  await page.waitForTimeout(250);
  if (w === 390) await L.shot(page, "arena_staffetta_cutin");
  const stfSubCheck = await page.evaluate(() => {
    const A = window.__arena;
    let B = A.state();
    clearTimeout(B.wait);
    const hasStrip = !!document.querySelector(".arOv .arBenchStrip");
    const b0 = B.bench.length;
    const firstBenchId = B.bench[0].c.id;
    const fallenId = B.team[0].id;
    // Simula KO del primo titolare: deve entrare subito la prima riserva con +25 scudo
    B.team[0].hp = 0;
    // Forza turno di un alleato vivo per verificare cambio tattico e subentro
    B.cur = B.team[1];
    A.act("defend");
    const entered = B.team[0].id === firstBenchId && B.team[0].hp > 0 && B.team[0].shield >= 25;
    const cutBoard = !!document.querySelector(".arSubBoard");
    A._fast(true);
    clearTimeout(B.wait);
    // Verifica cambio volante (1 per round)
    B.swappedRound = false;
    B.cur = B.team[2];
    const outTact = B.cur.id, inTact = B.bench[0].c.id;
    const okSwap1 = A.act("sub", inTact);
    const blockedSwap2 = A.act("sub");
    return {
      hasStrip,
      b0,
      entered,
      cutBoard,
      fallenTracked: B.fallen.includes(fallenId),
      okSwap1: okSwap1 && B.team[2].id === inTact && B.bench.some((x) => x.c.id === outTact),
      blockedSwap2: blockedSwap2 === false
    };
  });
  if (!stfSubCheck.hasStrip || stfSubCheck.b0 !== 5 || !stfSubCheck.entered || !stfSubCheck.cutBoard || !stfSubCheck.fallenTracked || !stfSubCheck.okSwap1 || !stfSubCheck.blockedSwap2) {
    errors.push("Staffetta subentri: " + JSON.stringify(stfSubCheck));
  }

  // Completa Ondata 1 -> Intervallo spogliatoio (scambio tra campo e panchina) -> Completa Ondate 2, 3 e 4
  const stfRunRes = await page.evaluate(() => {
    const A = window.__arena;
    A._fast(true);
    const winCurrentBattle = () => {
      const B = A.state();
      if (!B) return false;
      clearTimeout(B.wait);
      B.foes.forEach((f) => { f.ph = 3; f.shield = 0; f.hp = 1; });
      for (let k = 0; k < 40 && !B.over; k++) {
        if (!B.cur || B.cur.side !== "p") B.cur = B.team.find((u) => u.hp > 0);
        A.act("attack");
      }
      return B.over === "win";
    };
    const coins0 = window.__borgoApi.coins();
    const w1 = winCurrentBattle();
    return { w1, coins0 };
  });
  await page.waitForTimeout(120);
  if (w === 390) await L.shot(page, "arena_staffetta_intervallo");
  const stfFinish = await page.evaluate(async (coins0) => {
    const A = window.__arena;
    const rn1 = A.load().relayRun;
    const hasIntervallo = !!(rn1 && rn1.wave === 2 && document.querySelector('[data-iv="go"]'));
    // Scambia un titolare con una riserva nello spogliatoio
    const t0 = rn1 && rn1.team[0], b0 = rn1 && rn1.bench[0];
    const tEl = document.querySelector('[data-iv-team="1"] .arU[data-u]');
    const bEl = document.querySelector('[data-iv-bench="1"] .arU[data-u]');
    if (tEl && bEl) { tEl.click(); bEl.click(); }
    const rnSwapped = A.load().relayRun;
    const swappedOk = !!(rnSwapped && b0 && rnSwapped.team[0] === b0 && rnSwapped.bench[0] === t0);
    // Gioca Ondate 2, 3, 4 fino al trionfo
    for (let wv = 2; wv <= 4; wv++) {
      const goBtn = document.querySelector('[data-iv="go"]');
      if (goBtn) goBtn.click();
      const B = A.state();
      if (B) {
        clearTimeout(B.wait);
        B.foes.forEach((f) => { f.ph = 3; f.shield = 0; f.hp = 1; });
        for (let k = 0; k < 40 && !B.over; k++) {
          if (!B.cur || B.cur.side !== "p") B.cur = B.team.find((u) => u.hp > 0);
          A.act("attack");
        }
      }
      await new Promise((r) => setTimeout(r, 25));
    }
    const arEnd = A.load();
    const coins1 = window.__borgoApi.coins();
    return {
      hasIntervallo,
      swappedOk,
      relayBest: arEnd.relayBest,
      relayWins: arEnd.relayWins,
      runCleared: arEnd.relayRun === null,
      coinsGain: coins1 - coins0
    };
  }, stfRunRes.coins0);
  if (!stfRunRes.w1 || !stfFinish.hasIntervallo || !stfFinish.swappedOk || stfFinish.relayBest !== 4 || stfFinish.relayWins < 1 || !stfFinish.runCleared || stfFinish.coinsGain !== 150) {
    errors.push("Staffetta corsa 4 ondate: " + JSON.stringify({ stfRunRes, stfFinish }));
  }

  L.check(`Arena dei Sogni e Torre (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); })();

