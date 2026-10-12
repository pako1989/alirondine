// tests/spazio.cjs - «Calcio Spaziale: Stazione Orbitale 7»: capitolo 1 (la squadra, la gravità invertita, la palestra a gravità zero)
const L = require("./lib.cjs");
const MOD = { mod: "__spazio", key: "ali-di-rondine.spazio" };
const leave = (p) => p.evaluate(() => [...document.querySelectorAll(".scPitch .ov button")].forEach((b) => b.click()));
const K = (p, fn, arg) => p.evaluate(([f, a]) => new Function("K", "a", f)(window.__spazio._dbg.K, a), [fn, arg]);
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__spazio.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  for (const z of ["so_hangar", "so_anello", "so_palestra"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "so_hangar");
  await L.talk(page, "so_gru"); await L.advance(page);
  // l'esame di ARBI-9 (risposte giuste)
  await L.talk(page, "so_arbi"); await L.advance(page, ["Fai l'esame", "Undici", "oltre l'ultimo difensore", "Non per forza"]);
  // Blop in mensa
  await L.goAct(page, 24, 7); await L.advance(page); if ((await L.zone(page)) !== "so_mensa") errors.push("non si entra in mensa");
  if (w === 390) await L.shot(page, "so_mensa");
  await L.talk(page, "so_blop"); await L.advance(page, ["Le Comete Ribelli"]); await L.goAct(page, 10, 12); await L.advance(page);
  // l'Anello: oltre la linea gialla la gravità si gira
  await L.goAct(page, 33, 9); await L.advance(page); if ((await L.zone(page)) !== "so_anello") errors.push("non si va nell'Anello: " + (await L.zone(page)));
  await L.talk(page, "so_quattro"); await page.waitForTimeout(150); await L.advance(page, ["Da ogni parte"]);
  await page.waitForTimeout(900); const gv = await K(page, "return [K.gravity(), K.GRV.ang]"); if (gv[0] !== "flip" || gv[1] < 1) errors.push("la gravità non si è girata nel Settore B: " + JSON.stringify(gv));
  if (w === 390) await L.shot(page, "so_anello_b");
  // camminando a sinistra (sullo schermo) nel Settore B, il Campione va verso destra nel mondo
  const x0 = await page.evaluate(() => window.__tr.TW.x); await page.evaluate(() => { window.__borgoApi.trKeys().left = true; }); await page.waitForTimeout(500); await page.evaluate(() => { window.__borgoApi.trKeys().left = false; });
  const x1 = await page.evaluate(() => window.__tr.TW.x); if (!(x1 > x0 + 4)) errors.push(`comandi capovolti sbagliati: ${x0} → ${x1}`);
  const st = await L.info(page); if (st.step[1] !== 2) errors.push("squadra non completa: " + JSON.stringify(st.step));
  // la Palestra a gravità zero
  await L.goAct(page, 43, 6); await L.advance(page); if ((await L.zone(page)) !== "so_palestra") errors.push("non si va in Palestra");
  await page.evaluate(() => { window.__borgoApi.trKeys().right = true; }); await page.waitForTimeout(400); await page.evaluate(() => { window.__borgoApi.trKeys().right = false; });
  const p0 = await page.evaluate(() => window.__tr.TW.x); await page.waitForTimeout(400); const p1 = await page.evaluate(() => window.__tr.TW.x); if (!(p1 > p0 + 2)) errors.push(`a gravità zero non si scivola: ${p0} → ${p1}`);
  if (w === 390) await L.shot(page, "so_palestra");
  for (const [x, y] of [[6, 4], [17, 6], [11, 12]]) { await L.goAct(page, x, y); await L.advance(page); }
  await L.talk(page, "so_bullone"); await L.advance(page);
  await L.talk(page, "so_arbi"); await page.evaluate(() => window.T_.click("Gioca contro I Bulloni")); await page.waitForTimeout(500); await leave(page); await page.waitForTimeout(1500);
  if (w === 390) await L.shot(page, "so_match");
  await page.evaluate(() => { const S = window.__sagaCore.pitchState; S.t = 24 * 60 - 1; }); await page.waitForTimeout(1200); if (w === 390) await L.shot(page, "so_match_flip");
  await page.evaluate(() => { const S = window.__sagaCore.pitchState; S.a = 3; S.b = 1; S.finish(); }); await page.waitForTimeout(200); await leave(page); await L.advance(page);
  await page.evaluate(() => window.__spazio._dbg.K.enterZone("so_hangar")); await page.waitForTimeout(400); await L.advance(page);
  await L.goAct(page, 22, 17); await L.advance(page);
  await L.talk(page, "so_gru"); await L.advance(page, ["Festa in mensa"]);
  const i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step)); if (!i.flags.cartoline) errors.push("cartolina non presa");
  L.check(`Calcio Spaziale · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "festa" }, intro: { ch1: 1, so_hangar: 1, so_anello: 1, so_palestra: 1, so_mensa: 1 }, st: { squadra: 5, arbi: 3 }, flags: { so_nome: "Le Comete Ribelli", cartoline: 1, so_cart_so_hangar: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await L.stubMatch(page, true);
  await page.evaluate(() => window.__spazio.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  for (const z of ["so_serra", "so_macchine", "so_hangar", "so_anello"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "so_gru"); await L.advance(page);
  await L.goAct(page, 33, 9); await L.advance(page); await L.goAct(page, 20, 1); await L.advance(page);
  if ((await L.zone(page)) !== "so_macchine") errors.push("non si scende in Sala Macchine: " + (await L.zone(page)));
  await page.waitForTimeout(900); if ((await K(page, "return K.gravity()")) !== "zeroflip") errors.push("in Sala Macchine la gravità non è zero e capovolta");
  if (w === 390) await L.shot(page, "so_macchine");
  await L.talk(page, "so_mira"); await L.advance(page);
  await L.goAct(page, 12, 15); await L.advance(page); await L.goAct(page, 0, 5); await L.advance(page); await L.goAct(page, 16, 19); await L.advance(page);
  if ((await L.zone(page)) !== "so_serra") errors.push("non si scende nella Serra: " + (await L.zone(page)));
  if (w === 390) await L.shot(page, "so_serra");
  await L.talk(page, "so_primula"); await L.advance(page);
  for (const [x, y] of [[9, 7], [26, 11], [6, 17], [33, 19], [3, 11]]) { await L.goAct(page, x, y); await L.advance(page); }
  await L.goAct(page, 18, 1); await L.advance(page); await page.evaluate(() => window.__spazio._dbg.K.go("so_macchine", 12, 13)); await page.waitForTimeout(400); await L.advance(page);
  await L.goAct(page, 3, 3); await L.advance(page); await L.goAct(page, 12, 3); await L.advance(page);
  await page.waitForTimeout(300); if ((await K(page, "return K.gravity()")) !== "") errors.push("la gravità non è tornata normale");
  await L.talk(page, "so_mira"); await L.advance(page);
  await page.evaluate(() => window.__spazio._dbg.K.go("so_hangar", 8, 10)); await page.waitForTimeout(400); await L.advance(page);
  await L.talk(page, "so_gru"); await L.advance(page);
  await L.talk(page, "so_fattorina"); await L.advance(page, ["Gioca contro I Fattorini"]); await page.waitForTimeout(300); await L.advance(page);
  const lm = await page.evaluate(() => window.__lastMatch); if (!lm || lm.azPitch !== "orbita" || lm.mate !== "Blop") errors.push("partita dei Fattorini sbagliata: " + JSON.stringify(lm));
  await L.goAct(page, 11, 3); await L.advance(page, ["Resta tra noi"]);
  const i = await L.info(page); if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify(i.step)); if ((i.flags.cartoline | 0) < 2) errors.push("cartolina 2 non presa");
  L.check(`Calcio Spaziale · capitolo 2 (${w} px)`, errors); await browser.close();
}
// le partite vere del gioco avviate da una saga (senza sostituirle): devono partire senza errori in tutti e tre i modi
async function c3(w) {
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 7 }, done: { 1: "festa", 2: "segreto" }, intro: { ch1: 1, ch2: 1, so_hangar: 1, so_anello: 1, so_palestra: 1, so_mensa: 1 }, st: { squadra: 6, arbi: 5 }, flags: { so_nome: "I Senzapeso", cartoline: 2, so_cart_so_hangar: true, so_cart_so_serra: true, so_gen_ok: true, so_nonna_amica: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__spazio.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  for (const z of ["so_cupola", "so_palestra", "so_hangar"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "so_gru"); await L.advance(page);
  await L.goAct(page, 33, 9); await L.advance(page); await L.goAct(page, 43, 6); await L.advance(page); await L.goAct(page, 12, 1); await L.advance(page);
  if ((await L.zone(page)) !== "so_cupola") errors.push("non si sale nella Cupola: " + (await L.zone(page)));
  if (w === 390) await L.shot(page, "so_cupola");
  await L.goAct(page, 6, 16); await L.advance(page);
  await L.talk(page, "so_gru"); await L.advance(page, ["Leggile ad alta voce"]);
  await L.talk(page, "so_zorgo"); await L.advance(page);
  await L.talk(page, "so_arbi"); await L.advance(page, ["Nessuno ti spegne"]);
  await L.talk(page, "so_arbi"); await page.evaluate(() => window.T_.click("Gioca la finale")); await page.waitForTimeout(500); await leave(page); await page.waitForTimeout(1500);
  const mate = await page.evaluate(() => window.__sagaCore.pitchState.o.mate.name); if (mate !== "Gru") errors.push("in finale non gioca la Comandante: " + mate);
  if (w === 390) await L.shot(page, "so_finale_match");
  await page.evaluate(() => { const S = window.__sagaCore.pitchState; S.a = 2; S.b = 1; S.finish(); }); await page.waitForTimeout(200); await leave(page); await L.advance(page);
  const ends = ["ARBI-9 alza la mano", "Torno sulla Terra", "Resto. Sono", "NONNA, la prossima"];
  for (const e of ends) {
    await page.evaluate(() => { const K = window.__spazio._dbg.K; K.setStep(3, 3); K.enterZone("so_cupola"); }); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "so_gru"); await L.advance(page, [e]); if (w === 390 && e === ends[0]) await L.shot(page, "so_fine");
  }
  const i = await L.info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate(() => window.__spazio._dbg.K.mem().ends.length); if (n < 4) errors.push("finali trovati " + n + " su 4");
  L.check(`Calcio Spaziale · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
// la difficoltà della saga (si sceglie al primo avvio) e il carattere degli avversari nelle partite del kit
async function diff(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__spazio.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await page.waitForTimeout(200);
  if (w === 390) await L.shot(page, "so_difficolta");
  await page.evaluate(() => window.T_.click("^Sfida")); await L.advance(page);
  const d = await K(page, "return K.mem().diff"); if (d !== "sfida") errors.push("difficoltà non salvata: " + d);
  const msg = await K(page, "return K.reward('prova_diff', { coins: 10 })"); if (!msg.some((m) => /\+15 monete/.test(m))) errors.push("in Sfida le monete non sono × 1,5: " + JSON.stringify(msg));
  await K(page, "K.ownMatch(window.__gravita.start, { oppStyle: 'difensiva', title: 'prova', done: () => {} })"); await page.waitForTimeout(500); await leave(page); await page.waitForTimeout(300);
  const st = await page.evaluate(() => { const S = window.__sagaCore.pitchState; const a = S.styleNow(); S.half = 1; S.t = S.dur * 0.8; S.a = 2; S.b = 0; const b = S.styleNow(); return [a, b]; });
  if (st[0] !== "difensiva" || st[1] !== "pressing") errors.push("carattere degli avversari sbagliato: " + JSON.stringify(st));
  if (w === 390) await L.shot(page, "so_difficolta_partita");
  await page.evaluate(() => window.__sagaCore.pitchState.finish()); await page.waitForTimeout(200); await leave(page); await page.waitForTimeout(300);
  L.check(`Difficoltà Sfida e carattere degli avversari (${w} px)`, errors); await browser.close();
}
// i comandi nuovi del kit di partita: tiro caricato, a effetto, pallonetto, dai e vai, compagno guidato
async function comandi(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__spazio.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  const start = async () => { await K(page, "K.ownMatch(window.__gravita.start, { title: 'prova', flips: false, done: () => {} })"); await page.waitForTimeout(400); await leave(page); await page.waitForTimeout(300); };
  const S = (fn) => page.evaluate(new Function("return (function (S) { " + fn + " })(window.__sagaCore.pitchState)"));
  await start();
  const give = "S.ball.own = S.hero; S.ball.cd = 0; S.hero.y = S.WH / 2; S.opp.forEach((q) => { q.x = 30; q.y = 40; q.stun = 400; });";
  // tiro a effetto: carica e tieni la levetta di lato
  await S(give + " S.press('tira'); S.ptr = { ax: 100, ay: 200, x: 130, y: 200 };"); await page.waitForTimeout(500);
  const cv = await S("S.release('tira'); const r = S.ball.curve; S.ptr = null; return r;"); if (!(Math.abs(cv) > 0.05)) errors.push("tiro a effetto senza effetto: " + cv);
  // pallonetto: levetta indietro
  await page.waitForTimeout(300); await S(give + " S.press('tira'); S.ptr = { ax: 100, ay: 200, x: 100, y: 230 };"); await page.waitForTimeout(500);
  const vz = await S("S.release('tira'); S.ptr = null; return S.ball.vz;"); if (!(vz > 3)) errors.push("pallonetto troppo basso: " + vz);
  // dai e vai: PASSA tenuto con la palla
  await page.waitForTimeout(300); await S(give + " S.mate.x = S.hero.x + 30; S.mate.y = S.hero.y - 40; S.press('passa');"); await page.waitForTimeout(600);
  const dv = await S("const r = [S.fx.some((f) => f.txt === 'DAI E VAI!')]; S.release('passa'); return r;"); if (!dv[0]) errors.push("il dai e vai non è partito");
  // compagno guidato: PASSA tenuto senza palla
  await S("S.ball.own = S.opp[0]; S.opp[0].stun = 0; S.press('passa');"); await page.waitForTimeout(400);
  const m0 = await S("S.ptr = { ax: 100, ay: 200, x: 100, y: 170 }; return [S.mate.y, S.hero.y, !!(S.ph && S.ph.ctrl)];"); await page.waitForTimeout(500);
  const m1 = await S("const r = [S.mate.y, S.hero.y]; S.ptr = null; S.release('passa'); return r;");
  if (!m0[2] || !(m1[0] < m0[0] - 10) || Math.abs(m1[1] - m0[1]) > 6) errors.push("il compagno non si guida: " + JSON.stringify([m0, m1]));
  // contrasto: senza palla, avversario vicino → il pulsante diventa CONTRASTO e la scivolata ruba il pallone
  await S("S.opp.forEach((q) => { q.stun = 0; }); const q = S.opp[0]; S.ball.own = q; S.ball.cd = 0; q.x = S.hero.x; q.y = S.hero.y - 30; S.ball.x = q.x; S.ball.y = q.y + 7; S.ph = null; S.chg = null;"); await page.waitForTimeout(200);
  const lb = await page.evaluate(() => document.querySelector(".scPitch .tira").textContent); if (lb !== "CONTRASTO") errors.push("senza palla il pulsante non dice CONTRASTO: " + lb);
  if (w === 390) await L.shot(page, "so_contrasto");
  await page.evaluate(() => { window.__rnd = Math.random; Math.random = () => 0.1; }); await S("S.hero.stun = 0; S.hero.slide = 0; S.ph = null; S.chg = null; const q = S.opp[0]; S.opp[1].x = S.XL + 10; S.opp[1].y = S.GY0 + 20; S.mate.x = S.XR - 10; S.mate.y = S.GY0 + 30; q.stun = 0; q.x = S.hero.x; q.y = S.hero.y - 20; S.ball.own = q; S.ball.x = q.x; S.ball.y = q.y + 7; S.press('tira');"); await page.waitForTimeout(450);
  const tk = await S("Math.random = window.__rnd; return [S.ball.own === S.hero, S.data.tackles | 0];"); if (!tk[0] || tk[1] < 1) errors.push("il contrasto non ruba il pallone: " + JSON.stringify(tk));
  if (w === 390) await L.shot(page, "so_comandi");
  await S("S.finish();"); await page.waitForTimeout(200); await leave(page);
  L.check(`Comandi nuovi delle partite del kit (${w} px)`, errors); await browser.close();
}
async function vere(w) {
  for (const alt of ["az", "cage", "hd"]) {
    const { browser, page, errors } = await L.setup({ w, ...MOD });
    await page.evaluate(() => window.__spazio.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
    await page.evaluate((alt) => window.__spazio._dbg.K.playMatch({ alt, azPitch: "orbita", mate: "Blop", squad: ["Quattrobraccia"], us: "Le Comete", oppTeam: "I Fattorini", oppNames: ["Margherita", "Diavola", "Capricciosa", "Marinara", "Quattro Stagioni"], intro: "prova", bg: "so_ponte", done: () => {} }), alt);
    await page.waitForTimeout(1500); const b = await page.evaluate(() => window.T_.btns().map((x) => x.t).join(" | "));
    if (!b) errors.push(alt + ": nessun comando a schermo"); if (w === 390) await L.shot(page, "so_vera_" + alt);
    L.check(`Partita vera del gioco avviata da una saga: ${alt} (${w} px)`, errors); await browser.close();
  }
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); await vere(390); await diff(390); await diff(320); await comandi(390); await comandi(320); })().catch((e) => { console.error("✗ spazio:", e.message); process.exit(1); });
