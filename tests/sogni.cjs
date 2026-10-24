// tests/sogni.cjs - «La Squadra dei Sogni»: le carte che si sbloccano giocando, la bustina, la squadra e l'intesa, il Torneo dei Sogni
// nei motori delle saghe (con i vantaggi della squadra), la carta del Campione dei Sogni e la Maglia nel guardaroba
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale", "leone", "campetto", "amico"], diffSet: true, flags: {} };
const uno = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "a" }, ends: [], diffSet: true, flags: {} };
async function run(w) {
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.campetto": fin, "ali-di-rondine.trono": uno } });
  await page.evaluate(() => window.__salone.open(() => {})); await page.waitForTimeout(300);
  if (!(await page.evaluate(() => !!document.querySelector('.salOv [data-go="sogni"]')))) errors.push("manca la Squadra dei Sogni nel Salone");
  await page.evaluate(() => document.querySelector('.salOv [data-go="sogni"]').click()); await page.waitForTimeout(400);
  const own = await page.evaluate(() => window.__sogni._load().own);
  ["cm_saverio", "cm_pio", "cm_leone", "cm_bastiano", "tc_brunilde", "tc_gualtiero"].forEach((id) => { if (!own.includes(id)) errors.push("carta non sbloccata: " + id); });
  if (own.includes("tc_ardo")) errors.push("carta rara del Trono sbloccata con un solo capitolo");
  if (w === 390) await L.shot(page, "sogni");
  // la squadra e l'intesa: quattro del Campetto (6 coppie) + Brunilde
  for (const id of ["cm_bastiano", "cm_leone", "cm_saverio", "cm_pio", "tc_brunilde"]) { await page.evaluate((id) => document.querySelector(`.sgOv .coll [data-c="${id}"]`).click(), id); await page.waitForTimeout(80); }
  const I = await page.evaluate(() => window.__sogni.intesa(window.__sogni._load().team).n); if (I !== 8) errors.push("intesa: " + I);
  // la bustina
  await page.evaluate(() => window.addCoins(500)); await page.evaluate(() => window.__sogni.open()); await page.waitForTimeout(200);
  const n0 = (await page.evaluate(() => window.__sogni._load().own)).length; await page.evaluate(() => document.querySelector('.sgOv [data-go="pack"]').click()); await page.waitForTimeout(300);
  if (!(await page.evaluate(() => !!document.querySelector(".sgOv .sgPackStage:not(.torn) .sgFoilWrap")))) errors.push("manca involucro bustina a strappo");
  await page.evaluate(() => { const b = document.querySelector(".sgOv [data-tear]"); if (b) b.click(); }); await page.waitForTimeout(200);
  if (!(await page.evaluate(() => !!document.querySelector(".sgOv .sgPackStage.torn")))) errors.push("la bustina non si strappa");
  if (w === 390) await L.shot(page, "sogni_bustina");
  const n1 = (await page.evaluate(() => window.__sogni._load().own)).length; if (n1 !== n0 + 1) errors.push("la bustina non dà una carta");
  await page.evaluate(() => document.querySelector(".sgOv [data-ok]").click()); await page.waitForTimeout(200);
  // il Torneo dei Sogni: il Concilio (credibilità e corvi dalla squadra) e il Duello (grinta dall'intesa)
  await page.evaluate(() => document.querySelector('.sgOv [data-go="tour"]').click()); await page.waitForTimeout(200);
  if (w === 390) await L.shot(page, "sogni_torneo");
  await page.evaluate(() => document.querySelector('.sgOv [data-i="4"]').click()); await page.waitForTimeout(400);
  const co = await page.evaluate(() => { const S = window.__concilio.state; return S ? [S.cred, S.ravens] : null; }); if (!co || co.join() !== "8,3") errors.push("Concilio dei Sogni: " + co);
  await page.evaluate(() => document.querySelector(".coOv .ov button").click()); await page.waitForTimeout(100);
  await page.evaluate(() => { const S = window.__concilio.state; S.a = 2; S.b = 0; S.finish(); }); await page.waitForTimeout(200); await page.evaluate(() => document.querySelector(".coOv .ov button").click()); await page.waitForTimeout(300);
  if (!(await page.evaluate(() => window.__sogni._load().won.includes(4)))) errors.push("sfida del Concilio non registrata");
  await page.evaluate(() => { const b = document.querySelector(".sgOv [data-ok]"); if (b) b.click(); }); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('.sgOv [data-i="6"]').click()); await page.waitForTimeout(400);
  const du = await page.evaluate(() => { const S = window.__duello.state; return S ? S.gutsMax : null; }); if (du !== 148) errors.push("Duello dei Sogni, grinta: " + du);
  await page.evaluate(() => document.querySelector(".duOv .ov button").click()); await page.waitForTimeout(100); await page.evaluate(() => window.__duello.state.finish(true)); await page.waitForTimeout(200); await page.evaluate(() => document.querySelector(".duOv .ov button").click()); await page.waitForTimeout(300);
  // le stelle: esperienza alle carte che giocano, a tre stelle la frase
  const xp = await page.evaluate(() => window.__sogni._load().xp); if (!(xp.cm_bastiano >= 1)) errors.push("nessuna esperienza alle carte dopo le sfide: " + JSON.stringify(xp));
  await page.evaluate(() => { const b = document.querySelector(".sgOv [data-ok]"); if (b) b.click(); }); await page.waitForTimeout(150);
  await page.evaluate(() => { const r = window.__sogni._load(); r.xp.cm_bastiano = 15; localStorage.setItem("ali-di-rondine.sogni", JSON.stringify(r)); window.__sogni.open(); }); await page.waitForTimeout(200);
  if (!(await page.evaluate(() => window.__sogni.stars("cm_bastiano") === 3 && !!document.querySelector('.sgOv .team .sgCard.s3[data-c="cm_bastiano"] .stars')))) errors.push("carta a tre stelle non mostrata");
  // la Stagione dei Sogni: una giornata simulata, una giocata nel Concilio, poi fino alla fine
  await page.evaluate(() => document.querySelector('.sgOv [data-go="season"]').click()); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector(".sgOv [data-sim]").click()); await page.waitForTimeout(200);
  await page.evaluate(() => { const b = document.querySelector(".sgOv [data-ok]"); if (b) b.click(); }); await page.waitForTimeout(150);
  let se = await page.evaluate(() => window.__sogni._load().season); if (!se || se.day !== 1 || Object.values(se.tab).some((R) => R[0] !== 1)) errors.push("Stagione: giornata simulata non registrata");
  await page.evaluate(() => { const r = window.__sogni._load(); r.season.eng[1] = "concilio"; localStorage.setItem("ali-di-rondine.sogni", JSON.stringify(r)); window.__sogni.stagione(); }); await page.waitForTimeout(200);
  if (w === 390) await L.shot(page, "sogni_stagione");
  await page.evaluate(() => document.querySelector(".sgOv [data-play]").click()); await page.waitForTimeout(400);
  if (!(await page.evaluate(() => /Stagione dei Sogni/.test(document.querySelector(".coOv").textContent)))) errors.push("Stagione: il Concilio non parte");
  await page.evaluate(() => document.querySelector(".coOv .ov button").click()); await page.waitForTimeout(100);
  await page.evaluate(() => { const S = window.__concilio.state; S.a = 2; S.b = 0; S.finish(); }); await page.waitForTimeout(200); await page.evaluate(() => document.querySelector(".coOv .ov button").click()); await page.waitForTimeout(300);
  for (let k = 0; k < 3; k++) { await page.evaluate(() => { const b = document.querySelector(".sgOv [data-ok]"); if (b) b.click(); }); await page.waitForTimeout(120); }
  se = await page.evaluate(() => window.__sogni._load().season); if (!se || se.day !== 2 || se.tab[-1][1] < 1) errors.push("Stagione: la partita giocata non conta: " + JSON.stringify(se && se.tab[-1]));
  for (let k = 0; k < 60; k++) { const go = await page.evaluate(() => { const b = document.querySelector(".sgOv [data-ok]") || document.querySelector(".sgOv [data-sim]"); if (b) b.click(); return !!b; }); if (!go) break; await page.waitForTimeout(100); }
  if (!(await page.evaluate(() => window.__sogni._load().season.day === 7 && !!document.querySelector(".sgOv [data-new]")))) errors.push("Stagione: non arriva alla fine");
  if (w === 390) await L.shot(page, "sogni_stagione_fine");
  // il Draft: cinque scelte, un turno di coppa nel Duello, la carta da tenere
  await page.evaluate(() => window.__sogni.draft()); await page.waitForTimeout(200);
  for (let k = 0; k < 5; k++) { await page.evaluate(() => document.querySelector(".sgOv .pick .sgCard").click()); await page.waitForTimeout(120); }
  const dr = await page.evaluate(() => window.__sogni._load().draft); if (!dr || dr.picks.length !== 5 || new Set(dr.picks).size !== 5) errors.push("Draft: scelte sbagliate");
  if (w === 390) await L.shot(page, "sogni_draft");
  await page.evaluate(() => { const r = window.__sogni._load(); r.draft.eng[0] = "duello"; localStorage.setItem("ali-di-rondine.sogni", JSON.stringify(r)); window.__sogni.draft(); }); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector(".sgOv [data-play]").click()); await page.waitForTimeout(400);
  await page.evaluate(() => document.querySelector(".duOv .ov button").click()); await page.waitForTimeout(100); await page.evaluate(() => { const S = window.__duello.state; S.a = 2; S.b = 0; S.finish(); }); await page.waitForTimeout(200); await page.evaluate(() => document.querySelector(".duOv .ov button").click()); await page.waitForTimeout(300);
  for (let k = 0; k < 6; k++) { await page.evaluate(() => { const b = document.querySelector(".sgOv [data-ok]"); if (b) b.click(); }); await page.waitForTimeout(120); }
  if ((await page.evaluate(() => window.__sogni._load().draft.round)) !== 1) errors.push("Draft: il turno vinto non conta " + JSON.stringify(await page.evaluate(() => [window.__sogni._load().draft, document.querySelector(".sgOv h2") && document.querySelector(".sgOv h2").textContent, window.__duello.state && [window.__duello.state.a, window.__duello.state.b]])));
  await page.evaluate(() => { const r = window.__sogni._load(); r.draft.over = "win"; r.draft.picks[0] = "cc_re"; r.own = r.own.filter((x) => x !== "cc_re"); localStorage.setItem("ali-di-rondine.sogni", JSON.stringify(r)); window.__sogni.draft(); }); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('.sgOv .pick.keep .sgCard[data-c="cc_re"]').click()); await page.waitForTimeout(250);
  if (!(await page.evaluate(() => window.__sogni._load().own.includes("cc_re")))) errors.push("Draft: la carta vinta non entra in collezione");
  // tutte vinte: la carta del Campione dei Sogni e la Maglia
  await page.evaluate(() => { const r = window.__sogni._load(); r.won = [0, 1, 2, 3, 4, 5, 6, 7]; localStorage.setItem("ali-di-rondine.sogni", JSON.stringify(r)); window.__sogni.open(); }); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('.sgOv [data-go="tour"]').click()); await page.waitForTimeout(200); await page.evaluate(() => document.querySelector(".sgOv [data-hero]").click()); await page.waitForTimeout(300);
  if (w === 390) await L.shot(page, "sogni_campione");
  if (!(await page.evaluate(() => window.__borgoApi.cosOwned().includes("sg_maglia")))) errors.push("Maglia dei Sogni non sbloccata");
  // carte della Storia Principale e Legami di Borgo Marino
  const borgoCheck = await page.evaluate(() => {
    localStorage.setItem("ali-di-rondine.stagione1", JSON.stringify({ st: { tiro: 10 }, f: { end: "alba" } }));
    localStorage.setItem("ali-di-rondine.stagione2", JSON.stringify({ st: { tiro: 15 }, f: { end2: "tavola" } }));
    const { r } = window.__sogni.sync();
    const cb = window.__sogni.combo(["leo", "dario"]);
    const sk = window.__arena && window.__arena.UNIQUE_SKILLS && window.__arena.UNIQUE_SKILLS.leo;
    return {
      s12: ["leo", "nico", "tommy", "sara", "ruggeri", "baciccia", "dario", "lina"].every((id) => r.own.includes(id)),
      noS3: !r.own.includes("jojo"),
      combo: cb && cb.title === "I Fratelli Moretti",
      skill: !!(sk && sk.name === "Volo della Rondine"),
    };
  });
  if (!borgoCheck.s12 || !borgoCheck.noS3 || !borgoCheck.combo || !borgoCheck.skill) errors.push("Carte Borgo Marino: " + JSON.stringify(borgoCheck));
  // Dialoghi d'Intesa «Voci dallo Spogliatoio»: 3 partite col Legame, archivio, messa in squadra, scena a battute e premio unico
  const vociPre = await page.evaluate(() => {
    window.__sogni.open();
    const btn = document.querySelector('.sgOv [data-go="voci"]');
    if (btn) btn.click();
    const hasTitle = !!(document.querySelector(".sgOv h2") && /Voci dallo Spogliatoio/.test(document.querySelector(".sgOv h2").textContent));
    // schiera coppia pronta (es. leo|dario) col bottone rapido
    const fb = document.querySelector('.sgOv [data-field-pair="leo|dario"]') || document.querySelector(".sgOv [data-field-pair]");
    if (fb) fb.click();
    const tm = window.__sogni._load().team;
    const pk = window.__sogni.pairKey("leo", "dario");
    const u1 = window.__sogni.recordVoci(["leo", "dario"]);
    const u2 = window.__sogni.recordVoci(["leo", "dario"]);
    const u3 = window.__sogni.recordVoci(["leo", "dario"]);
    // carte non possedute non devono sbloccare voci né rivelare nomi
    const uLock = window.__sogni.recordVoci(["jojo", "mg_tico"]);
    return {
      hasBtn: !!btn,
      hasTitle,
      fielded: tm.includes("leo") && tm.includes("dario"),
      prog: [u1.length, u2.length, u3.length],
      unlockedTitle: u3[0] && u3[0].title,
      cnt: window.__sogni._load().voci[pk],
      noSpoilerUnlock: uLock.length === 0,
    };
  });
  if (!vociPre.hasBtn || !vociPre.hasTitle || !vociPre.fielded || vociPre.prog.join(",") !== "0,0,1" || vociPre.unlockedTitle !== "I Fratelli Moretti" || vociPre.cnt !== 3 || !vociPre.noSpoilerUnlock) {
    errors.push("Voci dallo Spogliatoio (sblocco): " + JSON.stringify(vociPre));
  }
  await page.evaluate(() => window.__sogni.openVoci()); await page.waitForTimeout(150);
  if (w === 390) await L.shot(page, "sogni_voci_archivio");
  const cBefore = await page.evaluate(() => window.__borgoApi.coins());
  await page.evaluate(() => { const b = document.querySelector('.sgOv [data-play-voce="dario|leo"]'); if (b) b.click(); }); await page.waitForTimeout(150);
  if (w === 390) await L.shot(page, "sogni_voce_scena");
  const sceneCheck = await page.evaluate(() => {
    const step1 = document.querySelector(".sgVoceBubble .bbStep") && document.querySelector(".sgVoceBubble .bbStep").textContent;
    const txt1 = document.querySelector(".sgVoceBubble .bbTxt") && document.querySelector(".sgVoceBubble .bbTxt").textContent;
    const nxt = document.querySelector("[data-voce-next]");
    if (nxt) nxt.click();
    const step2 = document.querySelector(".sgVoceBubble .bbStep") && document.querySelector(".sgVoceBubble .bbStep").textContent;
    const allB = document.querySelector("[data-voce-all]");
    if (allB) allB.click();
    const linesCnt = document.querySelectorAll(".sgVoceTranscript .sgVoceLine").length;
    return { step1, hasTxt: !!(txt1 && txt1.length > 10), step2, linesCnt };
  });
  const cAfter1 = await page.evaluate(() => window.__borgoApi.coins());
  await page.evaluate(() => window.__sogni.openVoceScene("dario|leo")); await page.waitForTimeout(80);
  const cAfter2 = await page.evaluate(() => window.__borgoApi.coins());
  if (sceneCheck.step1 !== "1/4" || !sceneCheck.hasTxt || sceneCheck.step2 !== "2/4" || sceneCheck.linesCnt !== 4 || cAfter1 !== cBefore + 25 || cAfter2 !== cAfter1) {
    errors.push("Voci dallo Spogliatoio (scena/premio): " + JSON.stringify({ sceneCheck, cBefore, cAfter1, cAfter2 }));
  }
  L.check(`La Squadra dei Sogni (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); })().catch((e) => { console.error("✗ sogni:", e.message); process.exit(1); });
