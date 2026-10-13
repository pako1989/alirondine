// tests/grigio.cjs - «Il Cavaliere della Notte»: il motore Ombre e Gadget (turni, caselle, intenzioni, cintura), le guardie
// del furtivo (cono di vista, si torna all'ingresso), l'officina dei gadget (K.officina), il rampino sui tetti,
// le partite a scelta, i 3 capitoli e i 4 finali, il cabinato della Sala Giochi
const L = require("./lib.cjs");
const MOD = { mod: "__grigio", key: "ali-di-rondine.grigio" };
const K_ = "window.__grigio._dbg.K";
const gdStart = async (p) => { await p.waitForTimeout(300); const ok = await p.evaluate(() => { const b = document.querySelector(".gdOv .ov .goB"); if (b) { b.click(); return true; } return false; }); await p.waitForTimeout(200); return ok; };
const gdEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__gadget.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await p.evaluate(() => { const b = document.querySelector(".gdOv .ov .goB"); if (b) b.click(); }); await p.waitForTimeout(250); };
const offClose = async (p) => { await p.waitForTimeout(250); const ok = await p.evaluate(() => !!document.querySelector(".grOff")); await p.evaluate(() => { const b = document.querySelector(".grOff .go"); if (b) b.click(); }); await p.waitForTimeout(200); return ok; };
const info = (p) => L.info(p);
// la scena di Alfio finisce aprendo l'officina: si preme «Continua» finché non compare
const toOff = async (p) => { for (let k = 0; k < 20; k++) { if (await p.evaluate(() => !!document.querySelector(".grOff"))) return; await p.evaluate(() => window.T_.click("Continua")); await p.waitForTimeout(200); } };
const noGuards = (p, on) => p.evaluate((on) => { window.__noGuards = on; }, on);
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await noGuards(page, true);
  await page.evaluate(() => window.__grigio.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  for (const z of ["gr_piazza"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "gr_piazza");
  await L.talk(page, "gr_marisa"); await L.advance(page, ["Ci vado subito"]);
  if ((await info(page)).step[1] !== 1) errors.push("Marisa non manda da Alfio");
  // la partita secondaria: a scelta
  await L.stubMatch(page, true); await L.talk(page, "gr_marisa"); await page.evaluate(() => window.T_.click("Allenamento sotto la pioggia")); await page.waitForTimeout(200); await page.evaluate(() => window.T_.click("Un'altra modalità")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  const lm = await page.evaluate(() => window.__lastMatch || {}); if (lm.id !== "gr_allenamento" || !/,/.test(lm.alt || "")) errors.push("allenamento non a scelta: " + JSON.stringify(lm));
  // l'officina sotto la tribuna, la foto, Alfio e la cintura
  await L.goAct(page, 14, 6); await L.advance(page); if ((await L.zone(page)) !== "gr_magazzino") errors.push("non si entra nell'officina");
  { const bad = await L.reachAll(page, "gr_magazzino"); if (bad.length) errors.push("officina irraggiungibile: " + bad.join(", ")); }
  await L.goAct(page, 12, 1); await L.advance(page); if (!(await info(page)).flags.gr_foto) errors.push("la foto dell'officina non si guarda");
  await L.talk(page, "gr_alfio"); await toOff(page); await page.waitForTimeout(300);
  if (w === 390) await L.shot(page, "gr_officina");
  const belt0 = await page.evaluate(() => [...document.querySelectorAll(".grOff .list button.on")].map((b) => b.dataset.k).join());
  if (belt0 !== "visore,fumo,scudo") errors.push("cintura iniziale: " + belt0);
  await page.evaluate(() => document.querySelector('.grOff [data-k="scudo"]').click()); await page.waitForTimeout(100);
  if (!(await offClose(page))) errors.push("l'officina non si apre"); await L.advance(page);
  let i = await info(page); if (i.flags.gr_belt !== "visore,fumo" || !i.flags.gr_mantello || i.step[1] !== 2) errors.push("officina/mantello: " + JSON.stringify([i.flags.gr_belt, i.step]));
  await page.evaluate((k) => eval(k).go("gr_piazza", 27, 15), K_); await page.waitForTimeout(400); await L.advance(page);
  await L.goAct(page, 29, 15); await L.advance(page); if ((await L.zone(page)) !== "gr_moli") errors.push("non si va ai Moli");
  { const bad = await L.reachAll(page, "gr_moli"); if (bad.length) errors.push("gr_moli irraggiungibile: " + bad.join(", ")); }
  // il furtivo: davanti alla sentinella che si gira, prima o poi ti vede e torni all'ingresso
  await noGuards(page, false); await page.evaluate(() => { const TW = window.__tr.TW; TW.x = 29 * 16 + 8; TW.y = 11 * 16 + 12; }); await page.waitForTimeout(200);
  if (w === 390) await L.shot(page, "gr_moli");
  let caught = false; for (let k = 0; k < 60 && !caught; k++) { await page.waitForTimeout(250); caught = await page.evaluate(() => window.__tr.TW.x < 6 * 16); }
  if (!caught) errors.push("la sentinella non vede il Campione");
  await L.advance(page); await noGuards(page, true);
  await L.goAct(page, 31, 3); await L.advance(page); if (!(await info(page)).flags.gr_registro) errors.push("registro non trovato");
  await L.talk(page, "gr_gancio"); await page.evaluate(() => window.T_.click("Gioca contro i Portuali")); await page.waitForTimeout(500);
  const belt = await page.evaluate(() => window.__gadget.state && window.__gadget.state.belt.join()); if (belt !== "visore,fumo") errors.push("cintura in partita: " + belt);
  if (w === 390) await L.shot(page, "gr_gadget_cintura");
  if (!(await gdStart(page))) errors.push("Ombre e Gadget non si apre");
  // un comando vero: il pulsante «Avanti» sposta il portatore, e i difensori annunciano le intenzioni
  const x0 = await page.evaluate(() => { const S = window.__gadget.state; return S.us[S.car].x; });
  await page.evaluate(() => { const b = [...document.querySelectorAll(".gdOv .pad button")].find((x) => /Avanti/.test(x.textContent)); b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); }); await page.waitForTimeout(200);
  const st = await page.evaluate(() => { const S = window.__gadget.state; return [S.turn, S.us[0].x, S.ds.every((d) => d.int || d.stun || S.phase !== "att"), S.phase]; });
  if (st[0] !== 1 || (st[3] === "att" && !st[2])) errors.push("Ombre e Gadget, comando Avanti: " + JSON.stringify([x0, st]));
  await page.evaluate(() => { const S = window.__gadget.state; if (S.phase === "att") S.act("g", "visore"); }); await page.waitForTimeout(100);
  const vis = await page.evaluate(() => { const S = window.__gadget.state; return S.phase !== "att" || S.visor === 3; }); if (!vis) errors.push("il Visore non funziona");
  if (w === 390) await L.shot(page, "gr_gadget");
  await gdEnd(page, 2, 0); await L.advance(page);
  if ((await L.zone(page)) !== "gr_piazza" || (await info(page)).step[1] !== 3) errors.push("dopo la partita col molo: " + (await L.zone(page)));
  await L.talk(page, "gr_dora"); await L.advance(page, [w === 390 ? "Dalle il registro" : "Non so di cosa"]);
  i = await info(page); if (!i.done[1] || !(w === 390 ? i.flags.gr_registro_dora : i.flags.gr_registro_tuo)) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  L.check(`Il Cavaliere della Notte · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const fl = { gr_mantello: true, gr_g_visore: true, gr_g_fumo: true, gr_g_scudo: true, gr_registro: true, gr_registro_dora: true, gr_foto: true, gr_gancio_visto: true };
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "dora" }, diffSet: true, intro: { ch1: 1, gr_piazza: 1, gr_moli: 1 }, st: { fiducia: 4 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await noGuards(page, true);
  await page.evaluate(() => window.__grigio.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  if ((await L.zone(page)) !== "gr_tetti") errors.push("il capitolo 2 non parte dai tetti");
  await L.talk(page, "gr_alfio"); await toOff(page); if (!(await offClose(page))) errors.push("officina del capitolo 2"); await L.advance(page);
  let i = await info(page); if (!i.flags.gr_g_rampino || i.step[2] !== 1) errors.push("rampino non dato: " + JSON.stringify(i.step));
  { const bad = await L.reachAll(page, "gr_tetti"); if (bad.length) errors.push("gr_tetti irraggiungibile col rampino: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "gr_tetti");
  await L.talk(page, "gr_vela"); await L.advance(page, ["Insieme"]);
  await L.talk(page, "gr_vela"); await page.evaluate(() => window.T_.click("Partita sul tetto")); await page.waitForTimeout(200); await page.evaluate(() => window.T_.click("Di notte, a turni")); await page.waitForTimeout(500);
  if (!(await gdStart(page))) errors.push("partita sul tetto non parte"); await gdEnd(page, 3, 1); await L.advance(page);
  i = await info(page); if (!i.flags.gr_g_bolas || !i.flags.gr_vela_alleata) errors.push("bolas di Vela: " + JSON.stringify(i.flags));
  await L.goAct(page, 33, 12); await L.advance(page); if ((await L.zone(page)) !== "gr_deposito") errors.push("non si va al deposito");
  { const bad = await L.reachAll(page, "gr_deposito"); if (bad.length) errors.push("gr_deposito irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "gr_deposito");
  await L.goAct(page, 27, 2); await L.advance(page); if (!(await info(page)).flags.gr_contratto) errors.push("contratto non trovato");
  await L.talk(page, "gr_gancio");
  if (w === 390) await L.advance(page, ["Pensa ai tuoi uomini"]);
  else { await page.evaluate(() => window.T_.click("Gioca contro i Portuali")); await page.waitForTimeout(500); await gdStart(page); await gdEnd(page, 2, 1); await L.advance(page); }
  i = await info(page); if (i.step[2] !== 3 || (w === 390 && !i.flags.gr_gancio_amico)) errors.push("Gancio: " + JSON.stringify([i.step, i.flags.gr_gancio_amico]));
  await L.talk(page, "gr_dora"); await L.advance(page, [w === 390 ? "Lo smascheriamo" : "Lo fermi la legge"]);
  i = await info(page); if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify(i.step));
  L.check(`Il Cavaliere della Notte · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const fl = { gr_mantello: true, gr_g_visore: true, gr_g_fumo: true, gr_g_scudo: true, gr_g_rampino: true, gr_g_bolas: true, gr_registro: true, gr_registro_dora: true, gr_foto: true, gr_gancio_visto: true, gr_vela_alleata: true, gr_vela_fid: 3, gr_gancio_amico: true, gr_gancio_deciso: true, gr_contratto: true, gr_piano_faro: true };
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "dora", 2: "faro" }, diffSet: true, intro: { ch1: 1, ch2: 1, gr_piazza: 1, gr_moli: 1, gr_tetti: 1, gr_deposito: 1 }, st: { fiducia: 6, leggenda: 6 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await noGuards(page, true);
  await page.evaluate(() => window.__grigio.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  { const bad = await L.reachAll(page, "gr_stadio"); if (bad.length) errors.push("gr_stadio irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "gr_stadio");
  await L.stubMatch(page, true); await L.talk(page, "gr_marisa"); await page.evaluate(() => window.T_.click("L'ultimo allenamento")); await page.waitForTimeout(200); await page.evaluate(() => window.T_.click("Un'altra modalità")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "gr_amichevole") errors.push("ultimo allenamento non a scelta");
  await L.talk(page, "gr_alfio"); await L.advance(page, ["Qual è il piano"]);
  await L.talk(page, "gr_alfio"); await L.advance(page, ["La foto nell'officina"]);
  let i = await info(page); if (i.step[3] !== 1 || !i.flags.gr_foto_chiesto) errors.push("piano e foto: " + JSON.stringify([i.step, i.flags.gr_foto_chiesto]));
  await L.goAct(page, 29, 19); await L.advance(page); if ((await L.zone(page)) !== "gr_torre") errors.push("non si va al faro");
  { const bad = await L.reachAll(page, "gr_torre"); if (bad.length) errors.push("gr_torre irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "gr_torre");
  await L.goAct(page, 13, 1); await L.advance(page); if ((await info(page)).step[3] !== 2) errors.push("la radio del faro non trasmette");
  await L.goAct(page, 0, 18); await L.advance(page);
  await L.talk(page, "gr_capitano"); await page.evaluate(() => window.T_.click("Gioca la finale")); await page.waitForTimeout(500);
  const mates = await page.evaluate(() => window.__gadget.state && window.__gadget.state.o.mates.map((m) => m.name).join()); if (mates !== "Marisa,Gancio") errors.push("finale, compagni: " + mates);
  await gdStart(page); await gdEnd(page, 2, 1); await L.advance(page);
  if (w === 390) await L.shot(page, "gr_finale");
  await page.evaluate(() => { const A = window.__tr, r = A.trRec(), Z = A.TRZ; ["gr_piazza", "gr_moli", "gr_tetti", "gr_deposito", "gr_torre"].forEach((z) => { r.got[z] = ((Z[z] && Z[z].items) || []).map((_, k) => k); }); });
  const ends = ["la foto dell'officina", "Commissaria, tocca a lei", "Sparisci prima", "Guarda verso il tetto"];
  for (const e of ends) {
    await page.evaluate((k) => { const K = eval(k); K.setStep(3, 3); K.enterZone("gr_stadio"); }, K_); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "gr_alfio"); await L.advance(page, [e]);
  }
  i = await info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate((k) => eval(k).mem().ends.length, K_); if (n < 4) errors.push("finali trovati " + n + " su 4");
  const m = await page.evaluate(() => { const x = window.__salone.machine("gadget"); return x && x.eng; }); if (m !== "__gadget") errors.push("cabinato di Ombre e Gadget mancante");
  L.check(`Il Cavaliere della Notte · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); })().catch((e) => { console.error("✗ grigio:", e.message); process.exit(1); });
