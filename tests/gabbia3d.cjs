// tests/gabbia3d.cjs - Verifica completa a 390 e 320 px:
// 1) Ricerca Globale Rapida (Ctrl+K, #searchGlobalBtn, zero-spoiler, salto diretto)
// 2) 5 Mazzi Tattici salvabili + Filtro Sinergie in Squadra dei Sogni / Arena / Gabbia 3D
// 3) Gabbia 3D 3v3 in Three.js (prestito, 4 arene, sponde +24% Super, Super-Tiro, Coppa e rilascio WebGL)
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale"], diffSet: true, flags: {} };

async function run(w) {
  const { browser, page, errors } = await L.setup({ w, h: 800, extra: { "ali-di-rondine.campetto": fin } });

  // 1. Topbar #searchGlobalBtn e assenza overflow orizzontale sulla Home
  const topCheck = await page.evaluate(() => {
    const btn = document.getElementById("searchGlobalBtn");
    const topr = document.querySelector(".topr");
    return {
      hasBtn: !!btn,
      docOver: document.documentElement.scrollWidth - window.innerWidth,
      topOver: topr ? topr.scrollWidth - topr.clientWidth : 99,
    };
  });
  if (!topCheck.hasBtn || topCheck.docOver > 1 || topCheck.topOver > 2) {
    errors.push(`topbar (${w}px): ` + JSON.stringify(topCheck));
  }

  // 2. Prestito automatico Gabbia 3D con collezione vuota
  const loanOk = await page.evaluate(() => {
    localStorage.setItem("ali-di-rondine.sogni", JSON.stringify({ own: [], team: [], won: [], packs: 0, xp: {} }));
    const origSync = window.__sogni.sync;
    window.__sogni.sync = () => ({ r: window.__sogni._load(), nw: [] });
    window.__gabbia3d.open(() => {});
    const units = document.querySelectorAll(".g3dOv .g3dTrio .g3dUnit").length;
    window.__gabbia3d.close();
    window.__sogni.sync = origSync;
    return units === 3;
  });
  if (!loanOk) errors.push("prestito Gabbia 3D a collezione vuota non attivo");

  // 3. Prepara carte sbloccate (con coppia Legame leo + nico e tommy) e verifica Zero-Spoiler in Ricerca Globale
  await page.evaluate(() => {
    const S = window.__sogni;
    S.sync();
    const r = S._load();
    ["leo", "nico", "tommy", "dario", "sara", "ruggeri"].forEach((id) => {
      if (S.BY[id] && !r.own.includes(id)) r.own.push(id);
    });
    r.team = ["leo", "nico", "sara", "ruggeri", "dario"];
    r.modulo = "rombo";
    S._save(r);
  });

  // Apri Ricerca Globale dal pulsante in alto e verifica zero-spoiler + assenza overflow
  await page.click("#searchGlobalBtn");
  await page.waitForTimeout(180);
  const rcCheck = await page.evaluate(() => {
    const panel = document.querySelector(".rcPanel");
    const idx = window.__ricerca.buildIndex();
    const hasLeoCard = idx.some((x) => x.id === "cd_leo");
    // Una carta non posseduta (es. qd_raito) NON deve comparire nell'indice!
    const leaksLockedCard = idx.some((x) => x.id === "cd_qd_raito");
    const hasGabbia = idx.some((x) => x.id === "gm_gabbia3d");
    const overX = panel ? panel.scrollWidth - panel.clientWidth : 99;
    return { open: !!panel, hasLeoCard, leaksLockedCard, hasGabbia, overX };
  });
  if (!rcCheck.open || !rcCheck.hasLeoCard || rcCheck.leaksLockedCard || !rcCheck.hasGabbia || rcCheck.overX > 2) {
    errors.push(`ricerca globale (${w}px): ` + JSON.stringify(rcCheck));
  }
  if (w === 390) await L.shot(page, "ricerca_globale");

  // Filtra in Ricerca Globale per "Gabbia 3D" e salta direttamente al gioco
  await page.fill(".rcOv .rcInp", "Gabbia 3D");
  await page.waitForTimeout(100);
  await page.click(".rcOv .rcRow");
  await page.waitForTimeout(200);
  if (!(await page.evaluate(() => !!document.querySelector(".g3dOv")))) {
    errors.push("salto da Ricerca Globale a Gabbia 3D fallito");
  }
  await page.evaluate(() => window.__gabbia3d.close());

  // 4. Test 5 Mazzi Tattici salvabili + Filtro Sinergie in Squadra dei Sogni
  await page.evaluate(() => window.__sogni.open(() => {}));
  await page.waitForTimeout(220);
  const presetsAndSyn = await page.evaluate(() => {
    const S = window.__sogni;
    const wrap = document.querySelector(".sgOv .wrap");
    const overBefore = wrap ? wrap.scrollWidth - wrap.clientWidth : 99;

    // Rinomina Mazzo 1 e passa a Mazzo 2 con formazione diversa
    S.renamePreset(0, "Titolari Coppa");
    S.switchPreset(1);
    const r2 = S._load();
    r2.team = ["tommy", "nico", "leo"];
    r2.modulo = "tridente";
    S._save(r2);
    S.renamePreset(1, "Gabbia Veloci");

    // Torna a Mazzo 1 e verifica che squadra e modulo siano intatti
    const back0 = S.switchPreset(0);
    const okSlot0 = back0.team.length === 5 && back0.modulo === "rombo" && back0.presets[0].name === "Titolari Coppa";
    const back1 = S.switchPreset(1);
    const okSlot1 = back1.team.length === 3 && back1.team[0] === "tommy" && back1.modulo === "tridente" && back1.presets[1].name === "Gabbia Veloci";
    S.switchPreset(0);
    S.open(() => {});

    // Verifica filtro Sinergia: "link" (Legame coi titolari: tommy ha legame con leo che è in squadra!)
    const synLinkChip = document.querySelector('.sgOv [data-filt-group="syn"] [data-val="link"]');
    if (synLinkChip) synLinkChip.click();
    const linkCards = [...document.querySelectorAll(".sgOv .coll .sgCard")].map((el) => el.dataset.c);
    const hasTommyLink = linkCards.includes("tommy");

    const synVociChip = document.querySelector('.sgOv [data-filt-group="syn"] [data-val="voci"]');
    if (synVociChip) synVociChip.click();
    const vociCards = [...document.querySelectorAll(".sgOv .coll .sgCard")].map((el) => el.dataset.c);

    // Azzera filtro
    const rst = document.querySelector(".sgOv .sgCollReset");
    if (rst) rst.click();

    const overAfter = document.querySelector(".sgOv .wrap").scrollWidth - document.querySelector(".sgOv .wrap").clientWidth;
    const hasG3dBtn = !!document.querySelector('.sgOv [data-go="gabbia3d"]');
    return { overBefore, overAfter, okSlot0, okSlot1, hasTommyLink, vociCnt: vociCards.length, hasG3dBtn };
  });
  if (
    presetsAndSyn.overBefore > 2 ||
    presetsAndSyn.overAfter > 2 ||
    !presetsAndSyn.okSlot0 ||
    !presetsAndSyn.okSlot1 ||
    !presetsAndSyn.hasTommyLink ||
    presetsAndSyn.vociCnt < 2 ||
    !presetsAndSyn.hasG3dBtn
  ) {
    errors.push(`mazzi tattici / filtro sinergie (${w}px): ` + JSON.stringify(presetsAndSyn));
  }
  if (w === 390) await L.shot(page, "sogni_mazzi_sinergie");
  await page.evaluate(() => window.__sogni.close());

  // 5. Verifica barra Mazzo Tattico compatta e bottone Gabbia 3D in Arena e Salone
  await page.evaluate(() => window.__salone.open(() => {}));
  await page.waitForTimeout(180);
  const salBtns = await page.evaluate(() => ({
    rc: !!document.querySelector('.salOv [data-go="ricerca"]'),
    g3d: !!document.querySelector('.salOv [data-go="gabbia3d"]'),
  }));
  if (!salBtns.rc || !salBtns.g3d) errors.push("pulsanti Salone mancanti: " + JSON.stringify(salBtns));
  await page.evaluate(() => window.__salone.close());

  await page.evaluate(() => window.__arena.open(() => {}));
  await page.waitForTimeout(180);
  const arCheck = await page.evaluate(() => {
    const wrap = document.querySelector(".arOv .wrap");
    return {
      presets: document.querySelectorAll(".arOv [data-preset-idx]").length,
      g3d: !!document.querySelector('.arOv [data-go="g3d"]'),
      overX: wrap ? wrap.scrollWidth - wrap.clientWidth : 99,
    };
  });
  if (arCheck.presets !== 5 || !arCheck.g3d || arCheck.overX > 2) {
    errors.push(`arena presets/g3d (${w}px): ` + JSON.stringify(arCheck));
  }

  // Entra in Gabbia 3D dall'Arena
  await page.click('.arOv [data-go="g3d"]');
  await page.waitForTimeout(220);
  const lobbyCheck = await page.evaluate(() => {
    const wrap = document.querySelector(".g3dOv .wrap");
    return {
      trio: document.querySelectorAll(".g3dOv .g3dTrio .g3dUnit").length,
      arenas: document.querySelectorAll(".g3dOv [data-ar]").length,
      presets: document.querySelectorAll(".g3dOv [data-preset-idx]").length,
      overX: wrap ? wrap.scrollWidth - wrap.clientWidth : 99,
    };
  });
  if (lobbyCheck.trio !== 3 || lobbyCheck.arenas !== 4 || lobbyCheck.presets !== 5 || lobbyCheck.overX > 2) {
    errors.push(`lobby Gabbia 3D (${w}px): ` + JSON.stringify(lobbyCheck));
  }
  if (w === 390) await L.shot(page, "gabbia3d_lobby");

  // 6. Avvia Partita 3D in Cupola Neo-2099, verifica layout ergonomico, fisica sponde, Super e vittoria
  await page.click('.g3dOv [data-ar="cupola"]');
  await page.waitForTimeout(100);
  await page.click('.g3dOv [data-tier="1"]');
  await page.waitForTimeout(350);
  await page.evaluate(() => window.__gabbia3d.pause(true));

  const matchUi = await page.evaluate(() => {
    const xBtn = document.querySelector(".g3dOv .bar .x").getBoundingClientRect();
    const passBtn = document.querySelector('.g3dOv [data-btn="pass"]').getBoundingClientRect();
    const cv = document.querySelector("#g3dCanvas").getBoundingClientRect();
    const wrap = document.querySelector(".g3dOv .wrap");
    return {
      sepY: Math.round(passBtn.top - xBtn.bottom),
      ratio: +(cv.width / Math.max(1, cv.height)).toFixed(2),
      overX: wrap ? wrap.scrollWidth - wrap.clientWidth : 99,
    };
  });
  if (matchUi.sepY < 160 || matchUi.ratio < 1.35 || matchUi.ratio > 1.85 || matchUi.overX > 2) {
    errors.push(`partita Gabbia 3D UI (${w}px): ` + JSON.stringify(matchUi));
  }
  if (w === 390) await L.shot(page, "gabbia3d_partita");
  if (w === 320) await L.shot(page, "gabbia3d_320");

  // Test meccaniche 3D: movimento stick, uno-due di sponda (+24% Super), Super-Tiro e completamento a 3 gol
  const mech = await page.evaluate(() => {
    const P = window.__gabbia3d;
    P._fast(true);
    const G = P.state();
    const out = {};

    // 1. Movimento atleta tramite stick
    const me = G.myTeam[G.ctrlIdx];
    const x0 = me.x;
    G.stk.set(1, 0);
    for (let i = 0; i < 12; i++) P.tick(1 / 30);
    G.stk.set(0, 0);
    out.moved = +(me.x - x0).toFixed(2) > 0.3;

    // 2. Uno-due di sponda: tira contro la parete Nord e raccogli col compagno -> +24% Super
    G.superPct = 40;
    G.ball.owner = me;
    G.stk.set(0, -1); // mira sponda superiore
    P.doPassOrSwitch();
    G.stk.set(0, 0);
    let wallHit = false;
    for (let i = 0; i < 45; i++) {
      P.tick(1 / 30);
      if (G.ball.wallBounced) wallHit = true;
    }
    out.wallHit = wallHit;

    // Simula ricezione compagno dopo sponda
    const mate = G.myTeam[2];
    G.ball.owner = null;
    G.ball.lastSide = "m";
    G.ball.wallBounced = true;
    G.ball.pickupLock = 0;
    G.ball.x = mate.x;
    G.ball.y = 0.31;
    G.ball.z = mate.z;
    const supBefore = G.superPct;
    P.tick(1 / 30);
    out.spondaCharge = G.superPct >= supBefore + 20;

    // 3. Super-Tiro della saga al 100%
    G.superPct = 100;
    G.ball.owner = G.myTeam[1];
    P.doSuperShot();
    out.superFired = G.superPct === 0 && !!G.ball.superFx;

    // 4. Segna 3 reti per concludere la partita e assegnare ricompense
    G.score = [2, 0];
    G.oppTeam[0].z = 2.1; // sposta portiere
    G.ball.owner = null;
    G.ball.x = 10.6;
    G.ball.y = 0.5;
    G.ball.z = 0;
    G.ball.vx = 18;
    G.ball.vy = 0;
    G.ball.vz = 0;
    for (let i = 0; i < 10 && !G.over; i++) P.tick(1 / 30);
    out.finished = !!document.querySelector("[data-rematch]");
    out.wins = P.load().wins;

    P.close();
    out.disposed = P.state() === null && !document.querySelector(".g3dOv");
    P._fast(false);
    return out;
  });

  if (!mech.moved || !mech.wallHit || !mech.spondaCharge || !mech.superFired || !mech.finished || mech.wins < 1 || !mech.disposed) {
    errors.push(`meccaniche Gabbia 3D (${w}px): ` + JSON.stringify(mech));
  }

  L.check(`Gabbia 3D, 5 Mazzi Tattici, Sinergie e Ricerca Globale a ${w} px`, errors);
  await browser.close();
}

(async () => {
  for (const w of [390, 320]) await run(w);
})().catch((e) => {
  console.error("✗ gabbia3d:", e.message);
  process.exit(1);
});
