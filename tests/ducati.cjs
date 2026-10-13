// tests/ducati.cjs - «La Guerra dei Tre Ducati»: il Calcio Tattico Isometrico (iniziativa, mossa vera su una casella, fine partita),
// la Bilancia delle Convinzioni (argomenti trovati esplorando, compagni convinti o no, il voto), il diorama, le partite a scelta,
// i 3 capitoli e i 4 finali, il cabinato della Sala Giochi
const L = require("./lib.cjs");
const MOD = { mod: "__ducati", key: "ali-di-rondine.ducati" };
const K_ = "window.__ducati._dbg.K";
const info = (p) => L.info(p);
const isStart = async (p) => { await p.waitForTimeout(300); const ok = await p.evaluate(() => { const b = document.querySelector(".isOv .ov .goB"); if (b) { b.click(); return true; } return false; }); await p.waitForTimeout(250); return ok; };
const isEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__iso.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await p.evaluate(() => { const b = document.querySelector(".isOv .ov .goB"); if (b) b.click(); }); await p.waitForTimeout(250); };
// la Bilancia: convince chi serve (coppie [compagno, argomento]), poi pesa
const bilancia = async (p, pers) => {
  await p.waitForTimeout(250); if (!(await p.evaluate(() => !!document.querySelector(".tdBil")))) return "la Bilancia non si apre";
  for (const [v, a] of pers) { await p.evaluate((v) => document.querySelector(`.tdBil [data-v="${v}"]`).click(), v); await p.waitForTimeout(80); const ok = await p.evaluate((a) => { const b = document.querySelector(`.tdBil [data-a="${a}"]`); if (b) { b.click(); return true; } return false; }, a); if (!ok) return "argomento non disponibile: " + a; await p.waitForTimeout(80); }
  const lean = await p.evaluate(() => Object.assign({}, window.__ducati._dbg.K._bil.lean));
  await p.evaluate((k) => { eval(k)._fastBil = true; document.querySelector(".tdBil .go").click(); }, K_); await p.waitForTimeout(300);
  return lean;
};
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__ducati.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  { const bad = await L.reachAll(page, "td_salinella"); if (bad.length) errors.push("td_salinella irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "td_salinella");
  await L.talk(page, "td_corrado"); await L.advance(page);
  await L.talk(page, "td_chiodo"); await page.evaluate(() => window.T_.click("Gioca contro Ruggine")); await page.waitForTimeout(500);
  if (w === 390) await L.shot(page, "td_iso_intro");
  if (!(await isStart(page))) errors.push("il Calcio Tattico non si apre");
  // un comando vero: aspetta il turno di un tuo giocatore, muovilo su una casella azzurra, poi attendi
  let mv = null; for (let k = 0; k < 30 && !mv; k++) { mv = await page.evaluate(() => { const S = window.__iso.state; if (!S || !S.act || S.act.side || S.phase !== "move") return null; const ks = Object.keys(S.reachOf()).map((x) => x.split(",").map(Number)).filter(([x, y]) => !(x === S.act.x && y === S.act.y)); const t = ks[0]; const ok = S.move(t[0], t[1]); return ok && S.act.x === t[0] && S.act.y === t[1] ? t.join() : "no"; }); if (!mv) await page.waitForTimeout(300); }
  if (!mv || mv === "no") errors.push("Calcio Tattico: la mossa su una casella non funziona: " + mv);
  if (w === 390) await L.shot(page, "td_iso");
  await page.evaluate(() => window.__iso.state.doAct("wait")); await page.waitForTimeout(200);
  await isEnd(page, 2, 0); await L.advance(page);
  if ((await info(page)).step[1] !== 1) errors.push("dopo la partita con Ruggine: " + JSON.stringify((await info(page)).step));
  await L.talk(page, "td_ottone"); await L.advance(page);
  // gli argomenti: Anselmo, la bacheca del municipio, Bruna nella miniera
  await L.talk(page, "td_anselmo"); await L.advance(page);
  await L.goAct(page, 26, 7); await L.advance(page);
  await L.goAct(page, 33, 18); await L.advance(page); if ((await L.zone(page)) !== "td_miniera") errors.push("non si entra nella miniera");
  { const bad = await L.reachAll(page, "td_miniera"); if (bad.length) errors.push("td_miniera irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "td_miniera");
  await L.talk(page, "td_bruna"); await L.advance(page);
  await L.goAct(page, 0, 10); await L.advance(page);
  const args = await page.evaluate((k) => eval(k).args().join(), K_); if (args !== "casse,giuramento,paga") errors.push("argomenti: " + args);
  // la partita secondaria: a scelta
  await L.stubMatch(page, true); await L.talk(page, "td_lia"); await page.evaluate(() => window.T_.click("Allenamento sul sale")); await page.waitForTimeout(200); await page.evaluate(() => window.T_.click("Un'altra modalità")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "td_allenamento") errors.push("allenamento non a scelta");
  // la Bilancia: a 390 px un argomento sbagliato con Ottone (la Morale non gli importa) e uno giusto con Anselmo (Libertà)
  await L.talk(page, "td_corrado"); await page.evaluate(() => window.T_.click("Alla Bilancia"));
  if (w === 390) { await page.waitForTimeout(300); await L.shot(page, "td_bilancia"); }
  const lean = await bilancia(page, w === 390 ? [["td_ottone", "giuramento"], ["td_anselmo", "paga"]] : []);
  if (w === 390 && (lean.td_ottone !== "vendi" || lean.td_anselmo !== "minatori")) errors.push("Bilancia, convincere: " + JSON.stringify(lean));
  await L.advance(page);
  const i = await info(page); const want = w === 390 ? "minatori" : "rifiuta"; if (i.done[1] !== want || i.flags.td_v1 !== want) errors.push("capitolo 1, voto: " + JSON.stringify([i.done, i.flags.td_v1]));
  // la pagina Personaggi della saga: chi hai incontrato, con ritratto e descrizione
  await page.evaluate(() => window.__ducati.open()); await page.waitForTimeout(200); await page.evaluate(() => window.T_.click("Personaggi")); await page.waitForTimeout(300);
  const per = await page.evaluate(() => { const t = document.body.innerText; const m = t.match(/Incontrati: (\d+) su (\d+)/); return m ? [+m[1], +m[2]] : null; });
  if (!per || per[0] < 5 || per[1] < 6) errors.push("pagina Personaggi: " + JSON.stringify(per));
  if (w === 390) await L.shot(page, "td_personaggi");
  await page.evaluate(() => document.querySelector(".scPers .x").click()); await page.waitForTimeout(150);
  L.check(`La Guerra dei Tre Ducati · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const fl = { td_v1: "rifiuta", td_v1_conv: "morale", td_arg_casse: true, td_arg_giuramento: true, td_arg_paga: true };
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "rifiuta" }, diffSet: true, intro: { ch1: 1, td_salinella: 1, td_miniera: 1 }, st: { morale: 3 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__ducati.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  { const bad = await L.reachAll(page, "td_vetrara"); if (bad.length) errors.push("td_vetrara irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "td_vetrara");
  await L.goAct(page, 16, 5); await L.advance(page); if ((await L.zone(page)) !== "td_palazzo") errors.push("non si entra nel palazzo");
  { const bad = await L.reachAll(page, "td_palazzo"); if (bad.length) errors.push("td_palazzo irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "td_isotta"); await L.advance(page);
  await page.evaluate((k) => eval(k).go("td_vetrara", 16, 7), K_); await page.waitForTimeout(400); await L.advance(page);
  await L.talk(page, "td_marchesa"); await page.evaluate(() => window.T_.click("Gioca la semifinale")); await page.waitForTimeout(500);
  const terr = await page.evaluate(() => window.__iso.state && window.__iso.state.o.terrain); if (terr !== "vetro") errors.push("semifinale, terreno: " + terr);
  await isStart(page); await isEnd(page, 2, 1); await L.advance(page);
  if ((await info(page)).step[2] !== 2) errors.push("dopo la semifinale: " + JSON.stringify((await info(page)).step));
  await L.talk(page, "td_vetraio"); await L.advance(page);
  await L.talk(page, "td_barcaiolo"); await L.advance(page);
  await L.stubMatch(page, true); await L.talk(page, "td_barcaiolo"); await page.evaluate(() => window.T_.click("La partita sul ponte")); await page.waitForTimeout(200); await page.evaluate(() => window.T_.click("Un'altra modalità")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "td_ponti") errors.push("partita sul ponte non a scelta");
  await L.goAct(page, 16, 5); await L.advance(page); await L.goAct(page, 3, 1); await L.advance(page);
  if (w === 390) await L.shot(page, "td_palazzo");
  await page.evaluate((k) => eval(k).go("td_vetrara", 16, 7), K_); await page.waitForTimeout(400); await L.advance(page);
  const args = await page.evaluate((k) => eval(k).args().length, K_); if (args !== 6) errors.push("argomenti del capitolo 2: " + args);
  await L.talk(page, "td_corrado"); await page.evaluate(() => window.T_.click("Alla Bilancia"));
  await bilancia(page, w === 390 ? [] : [["td_anselmo", "citta"]]); await L.advance(page);
  const i = await info(page); const want = w === 390 ? "proteggi" : "fuga"; if (i.done[2] !== want || !i.flags.td_isotta_con) errors.push("capitolo 2, voto: " + JSON.stringify([i.done, i.flags.td_isotta_con]));
  L.check(`La Guerra dei Tre Ducati · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const fl = { td_v1: "rifiuta", td_v1_conv: "morale", td_v2: "proteggi", td_v2_conv: "morale", td_isotta_con: w === 390, td_arg_casse: true, td_arg_giuramento: true, td_arg_paga: true, td_arg_tregua: true, td_arg_parola: true, td_arg_citta: true };
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "rifiuta", 2: "proteggi" }, diffSet: true, intro: { ch1: 1, ch2: 1, td_salinella: 1, td_vetrara: 1 }, st: { morale: 6 }, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__ducati.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  { const bad = await L.reachAll(page, "td_ruggine"); if (bad.length) errors.push("td_ruggine irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "td_ruggine");
  await L.talk(page, "td_duca"); await L.advance(page);
  await L.goAct(page, 4, 3); await L.advance(page); if ((await L.zone(page)) !== "td_forgia") errors.push("non si entra nella forgia");
  { const bad = await L.reachAll(page, "td_forgia"); if (bad.length) errors.push("td_forgia irraggiungibile: " + bad.join(", ")); }
  await L.talk(page, "td_fabbro"); await L.advance(page);
  await page.evaluate((k) => eval(k).go("td_ruggine", 16, 18), K_); await page.waitForTimeout(400); await L.advance(page);
  await L.talk(page, "td_anselmo"); await L.advance(page); await L.talk(page, "td_bruna"); await L.advance(page);
  await L.talk(page, "td_corrado"); await page.evaluate(() => window.T_.click("Alla Bilancia"));
  const lean = await bilancia(page, w === 390 ? [["td_lia", "onore"]] : []); await L.advance(page);
  if (w === 390 && !lean.td_isotta) errors.push("Isotta non vota alla Bilancia");
  let i = await info(page); if (i.step[3] !== 2 || i.flags.td_v3 !== "ruggine") errors.push("ultima Bilancia: " + JSON.stringify([i.step, i.flags.td_v3]));
  await L.talk(page, "td_duca"); await page.evaluate(() => window.T_.click("Gioca la finale")); await page.waitForTimeout(500);
  const o = await page.evaluate(() => { const S = window.__iso.state; return S && [S.o.terrain, S.o.mates.map((m) => m.name).join()]; }); if (!o || o[0] !== "ruggine" || o[1] !== (w === 390 ? "Corrado,Isotta" : "Corrado,Lia")) errors.push("finale: " + JSON.stringify(o));
  await isStart(page); await isEnd(page, 3, 2); await L.advance(page);
  if (w === 390) await L.shot(page, "td_finale");
  const ends = [["pari", "Guarda la Bilancia della piazza", ["morale", "utile", "liberta"]], ["corona", "Alza la corona", ["morale", "morale", "utile"]], ["patto", "Firma il patto", ["utile", "utile", "morale"]], ["saline", "Porta la Coppa in piazza", ["liberta", "morale", "liberta"]]];
  await page.evaluate(() => { const A = window.__tr, r = A.trRec(), Z = A.TRZ; ["td_salinella", "td_miniera", "td_vetrara", "td_ruggine"].forEach((z) => { r.got[z] = ((Z[z] && Z[z].items) || []).map((_, k) => k); }); });
  for (const [kind, label, cv] of ends) {
    await page.evaluate(([k, cv]) => { const K = eval(k); ["v1", "v2", "v3"].forEach((v, j) => K.F.set("td_" + v + "_conv", cv[j])); ["td_corrado", "td_lia", "td_ottone"].forEach((v) => K.F.set("td_pers_" + v, true)); K.setStep(3, 3); K.enterZone("td_ruggine"); }, [K_, cv]); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "td_corrado"); await L.advance(page, [label]);
  }
  i = await info(page); if (!i.done[3]) errors.push("capitolo 3 non concluso: " + JSON.stringify(i.step));
  const n = await page.evaluate((k) => eval(k).mem().ends.length, K_); if (n < 4) errors.push("finali trovati " + n + " su 4");
  const m = await page.evaluate(() => { const x = window.__salone.machine("iso"); return x && x.eng; }); if (m !== "__iso") errors.push("cabinato del Calcio Tattico mancante");
  L.check(`La Guerra dei Tre Ducati · capitolo 3 e i 4 finali (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390); await c3(320); })().catch((e) => { console.error("✗ ducati:", e.message); process.exit(1); });
