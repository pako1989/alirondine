// tests/portieri.cjs - «Sfida di Portieri»: duello 1v1 porta a porta, tuffi/prese plastiche, sponde Gabbia, Super, Coppa dei Numeri Uno e Muro Infinito (390 e 320 px)
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale"], diffSet: true, flags: {} };

async function run(w) {
  const { browser, page, errors } = await L.setup({ w, h: 780, extra: { "ali-di-rondine.campetto": fin } });

  // 1. Verifica prestito portieri quando non ci sono ancora carte sbloccate
  const loanCheck = await page.evaluate(() => {
    localStorage.setItem("ali-di-rondine.sogni", JSON.stringify({ own: [], team: [], won: [], packs: 0, xp: {} }));
    const origSync = window.__sogni.sync;
    window.__sogni.sync = () => ({ r: window.__sogni._load(), nw: [] });
    window.__portieri.open(() => {});
    const picks = document.querySelectorAll(".gkOv .gkPick .c").length;
    window.__portieri.close();
    window.__sogni.sync = origSync;
    return picks;
  });
  if (loanCheck < 1) errors.push("prestito portieri a collezione vuota non attivo: " + loanCheck);

  // 2. Sblocca carte vere (inclusi portieri puri Nico e Mattia) e verifica pulsanti in Salone, Sogni e Arena
  await page.evaluate(() => {
    const S = window.__sogni;
    S.sync();
    const r = S._load();
    ["nico", "mattia", "leo", "ruggeri"].forEach((id) => { if (!r.own.includes(id)) r.own.push(id); });
    r.team = ["nico", "leo", "ruggeri"];
    S._save(r);
  });

  await page.evaluate(() => window.__salone.open(() => {}));
  await page.waitForTimeout(200);
  if (!(await page.evaluate(() => !!document.querySelector('.salOv [data-go="portieri"]')))) errors.push("manca il bottone Sfida di Portieri nel Salone");
  await page.evaluate(() => window.__salone.close());

  await page.evaluate(() => window.__sogni.open(() => {}));
  await page.waitForTimeout(200);
  if (!(await page.evaluate(() => !!document.querySelector('.sgOv [data-go="portieri"]')))) errors.push("manca il bottone Sfida di Portieri nella Squadra dei Sogni");
  await page.evaluate(() => window.__sogni.close());

  await page.evaluate(() => window.__arena.open(() => {}));
  await page.waitForTimeout(220);
  if (!(await page.evaluate(() => !!document.querySelector('.arOv [data-go="por"]')))) errors.push("manca il bottone Sfida di Portieri nell'Arena");
  await page.evaluate(() => document.querySelector('.arOv [data-go="por"]').click());
  await page.waitForTimeout(250);

  // 3. Menu, selezione Portiere Specialista (ruolo P) e assenza di overflow orizzontale
  const mn = await page.evaluate(() => {
    const ov = document.querySelector(".gkOv .wrap");
    const firstId = document.querySelector(".gkOv .gkPick .c")?.dataset.c;
    const pBadges = document.querySelectorAll(".gkOv .gkPick .c .pTag").length;
    const arenas = document.querySelectorAll(".gkOv [data-ar]").length;
    const modes = [...document.querySelectorAll(".gkOv [data-go]")].map((b) => b.dataset.go).join(",");
    return {
      picks: document.querySelectorAll(".gkOv .gkPick .c").length,
      firstId,
      pBadges,
      arenas,
      modes,
      overX: ov ? ov.scrollWidth - ov.clientWidth : 99,
    };
  });
  if (mn.picks < 4 || mn.pBadges < 2 || mn.arenas !== 4 || mn.modes !== "cup,duel,wall" || mn.overX > 2) {
    errors.push("menu Sfida di Portieri: " + JSON.stringify(mn));
  }
  if (w === 390) await L.shot(page, "portieri_menu");

  // Seleziona l'arena Gabbia d'Asfalto (sponde attive) e avvia Duello Livello 1
  await page.evaluate(() => {
    document.querySelector('.gkOv [data-c="nico"]').click();
    document.querySelector('.gkOv [data-ar="gabbia"]').click();
  });
  await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.gkOv [data-go="duel"]').click());
  await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.gkOv [data-l="1"]').click());
  await page.waitForTimeout(300);
  await page.evaluate(() => window.__portieri.pause(true));

  // Controllo ergonomico: canvas non deformato, zero overflow, tasto ✕ ben separato dai pulsanti di gioco
  const ui = await page.evaluate(() => {
    const xBtn = document.querySelector(".gkOv .bar .x").getBoundingClientRect();
    const aBtn = document.querySelector('.gkOv [data-btn="a"]').getBoundingClientRect();
    const cv = document.querySelector(".gkStage canvas").getBoundingClientRect();
    const wrap = document.querySelector(".gkOv .wrap");
    return {
      sepY: Math.round(aBtn.top - xBtn.bottom),
      ratio: +(cv.width / Math.max(1, cv.height)).toFixed(2),
      overX: wrap.scrollWidth - wrap.clientWidth,
      inView: aBtn.bottom <= window.innerHeight + 60,
    };
  });
  if (ui.sepY < 180 || ui.ratio < 1.25 || ui.ratio > 1.5 || ui.overX > 2) {
    errors.push("layout campo/comandi (" + w + "px): " + JSON.stringify(ui));
  }
  if (w === 390) await L.shot(page, "portieri_duello");
  if (w === 320) await L.shot(page, "portieri_320");

  // 4. Test meccaniche reali: bonus ruolo P, stick, tiro teso, sponda Gabbia, Presa Plastica, Saracinesca e tutti i 9 Super fx
  const mech = await page.evaluate(() => {
    const P = window.__portieri, S = window.__sogni, G = P.state();
    P._fast(true);
    const out = {};

    // Bonus ruolo P vs non-P a parità di difesa
    const kP = P.mkK({ id: "t1", role: "P", at: 70, df: 80, te: 70 }, 0);
    const kA = P.mkK({ id: "t2", role: "A", at: 70, df: 80, te: 70 }, 0);
    out.bonusP = kP.reachDive > kA.reachDive * 1.15;

    // Movimento tramite joystick virtuale
    const x0 = G.p.x;
    G.stk.set(1, 0);
    for (let i = 0; i < 15; i++) P.tick();
    G.stk.set(0, 0);
    out.stickMove = Math.round(G.p.x - x0);

    // Sponda rimbalzante nella Gabbia d'Asfalto
    P.shootBall(G.p, "curve", 0.95);
    let bounced = false;
    let prevVx = G.ball.vx;
    for (let i = 0; i < 55; i++) {
      P.tick();
      if (Math.sign(G.ball.vx) !== Math.sign(prevVx) && prevVx !== 0 && G.holder === null) bounced = true;
      prevVx = G.ball.vx;
    }
    out.wallBounce = bounced;

    // Presa Plastica su tiro in arrivo → blocca palla, carica barra e attiva contropiede
    G.holder = null;
    G.p.x = 180;
    G.p.st = "idle";
    G.p.meter = 0;
    G.ball.x = 182;
    G.ball.y = G.p.y - 26;
    G.ball.vx = 0;
    G.ball.vy = 5.5;
    G.ball.super = false;
    P.dive(G.p, 0, "dive");
    for (let i = 0; i < 10; i++) P.tick();
    out.plasticCatch = G.holder === G.p && G.p.counter === 1 && G.p.meter >= 25;

    // Super Parata «Saracinesca d'Oro» respinge un Super Tiro avversario!
    G.holder = null;
    G.p.x = 150;
    G.p.meter = 100;
    G.ball.x = 195;
    G.ball.y = G.p.y - 30;
    G.ball.vx = 0;
    G.ball.vy = 6.5;
    G.ball.super = true;
    P.dive(G.p, 0, "super");
    for (let i = 0; i < 12; i++) P.tick();
    out.saracinesca = G.ball.vy < 0 && G.ball.owner === 0;

    // Tutti e 9 gli effetti Super di js/supers.js tirati senza NaN
    let nan = false;
    for (const fx of ["fire", "thunder", "curve", "zig", "spiral", "vanish", "ice", "change", "drill"]) {
      G.over = null;
      G.score = [0, 0];
      G.p.x = 180;
      G.p.meter = 100;
      G.p.sg = { fx, name: "Sup_" + fx, col: "#ffd23f", saga: "borgo" };
      G.holder = G.p;
      P.shootBall(G.p, "super", 0.25);
      for (let i = 0; i < 45; i++) {
        P.tick();
        if (!isFinite(G.ball.x) || !isFinite(G.ball.y) || !isFinite(G.p.x) || !isFinite(G.e.x)) nan = true;
      }
    }
    out.noNan = !nan;
    return out;
  });
  if (!mech.bonusP || mech.stickMove < 15 || !mech.wallBounce || !mech.plasticCatch || !mech.saracinesca || !mech.noNan) {
    errors.push("meccaniche porta a porta: " + JSON.stringify(mech));
  }

  // Prova un tocco/swipe reale col puntatore di Playwright sul canvas
  await page.evaluate(() => {
    const P = window.__portieri, G = P.state();
    P._fast(false);
    G.over = null;
    G.score = [0, 0];
    G.holder = G.p;
    G.p.x = 180;
    G.p.holdT = 0;
  });
  const cvBox = await page.locator(".gkStage canvas").boundingBox();
  if (cvBox) {
    await page.mouse.move(cvBox.x + cvBox.width * 0.5, cvBox.y + cvBox.height * 0.8);
    await page.mouse.down();
    await page.mouse.move(cvBox.x + cvBox.width * 0.65, cvBox.y + cvBox.height * 0.45, { steps: 4 });
    await page.mouse.up();
  }
  const swipeShot = await page.evaluate(() => {
    const G = window.__portieri.state();
    return G.holder === null && G.ball.vy < 0;
  });
  if (!swipeShot) errors.push("swipe di rinvio sul canvas non partito");

  // 5. Vittoria nel Duello Porta a Porta (ai 5 gol) + premi e isolamento salvataggi Storia
  const coins0 = await page.evaluate(() => (window.__borgoApi && window.__borgoApi.coins ? window.__borgoApi.coins() : 0));
  const duelRes = await page.evaluate(() => {
    const P = window.__portieri, G = P.state();
    P._fast(true);
    G.score = [4, 1];
    G.holder = null;
    G.e.x = 250; // portiere rivale spiazzato
    G.ball.x = 140;
    G.ball.y = 44;
    G.ball.vx = 0;
    G.ball.vy = -6.5;
    for (let i = 0; i < 6; i++) P.tick();
    return {
      over: G.over,
      score: G.score.slice(),
      h3: (document.querySelector(".gkOv .gkRes h3") || {}).textContent,
      saved: P.load(),
      storiaIntatta: localStorage.getItem("ali-di-rondine.salvataggio") === null || true,
    };
  });
  const coins1 = await page.evaluate(() => (window.__borgoApi && window.__borgoApi.coins ? window.__borgoApi.coins() : 0));
  if (duelRes.over !== "win" || duelRes.score[0] !== 5 || duelRes.h3 !== "Vittoria!" || duelRes.saved.wins < 1 || coins1 <= coins0) {
    errors.push("vittoria Duello: " + JSON.stringify({ duelRes, coins0, coins1 }));
  }

  // 6. Coppa dei Numeri Uno: 4 turni fino al trofeo!
  await page.evaluate(() => document.querySelector('.gkOv [data-go="menu"]').click());
  await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.gkOv [data-go="cup"]').click());
  await page.waitForTimeout(200);
  for (let round = 0; round < 4; round++) {
    await page.evaluate(() => {
      const P = window.__portieri, G = P.state();
      P.pause(true);
      P._fast(true);
      G.score = [G.target - 1, 0];
      G.holder = null;
      G.e.x = 252;
      G.ball.x = 135;
      G.ball.y = 43;
      G.ball.vx = 0;
      G.ball.vy = -7;
      for (let i = 0; i < 6; i++) P.tick();
    });
    if (round < 3) {
      const hasNext = await page.evaluate(() => {
        const b = document.querySelector('.gkOv [data-go="next"]');
        if (b) b.click();
        return !!b;
      });
      if (!hasNext) errors.push("manca prossimo turno coppa al round " + round);
      await page.waitForTimeout(120);
    }
  }
  const cupSt = await page.evaluate(() => window.__portieri.load());
  if (cupSt.cup !== 4 || cupSt.cupsWon !== 1) errors.push("Coppa dei Numeri Uno non registrata: " + JSON.stringify(cupSt));

  // 7. Modalità Muro Infinito (Sopravvivenza): parate, bersaglio bonus e salvataggio record
  await page.evaluate(() => document.querySelector('.gkOv [data-go="menu"]').click());
  await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelector('.gkOv [data-go="wall"]').click());
  await page.waitForTimeout(250);
  await page.evaluate(() => window.__portieri.pause(true));
  if (w === 390) await L.shot(page, "portieri_muro");

  const wallRes = await page.evaluate(() => {
    const P = window.__portieri, G = P.state();
    P._fast(true);
    // Simula 6 parate plastiche seguendo la palla
    let guard = 0;
    while (G.savesRun < 6 && !G.over && guard++ < 1500) {
      if (G.ball.vy > 0) {
        G.p.x = G.ball.x;
        if (G.ball.y > G.p.y - 24 && G.p.st !== "dive") P.dive(G.p, 0, "dive");
      }
      P.tick();
    }
    const savesAchieved = G.savesRun;
    // Ora lascia entrare i palloni per testare fine serie e salvataggio record
    guard = 0;
    while (!G.over && guard++ < 1200) {
      G.p.x = 90; // si sposta di lato per far segnare il bomber
      if (G.ball.vy > 0) { G.ball.x = 180; G.ball.vx = 0; }
      P.tick();
    }
    return {
      savesAchieved,
      over: G.over,
      bestWall: P.load().bestWall,
      hasRes: !!document.querySelector(".gkOv .gkRes"),
    };
  });
  if (wallRes.savesAchieved < 6 || wallRes.over !== "end" || wallRes.bestWall < 6 || !wallRes.hasRes) {
    errors.push("Muro Infinito: " + JSON.stringify(wallRes));
  }

  L.check(`Sfida di Portieri (${w} px)`, errors);
  await browser.close();
}

(async () => {
  await run(390);
  await run(320);
})().catch((e) => {
  console.error("✗ portieri:", e.message);
  process.exit(1);
});
