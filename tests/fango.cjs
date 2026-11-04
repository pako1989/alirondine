// tests/fango.cjs - «Dal Fango alla Leggenda»: carriera intera (5 tappe) con partite simulate, Il Momento e partita intera finta,
// scelte, finali (mito, ritorno, mister segreto), integrazione (Sogni, Salone, mazzo, ospite) e minigioco giocato davvero.
// Uso: python3 -m http.server 8765 &  node tests/fango.cjs [shots]
const L = require("./lib.cjs");
const KEY = "ali-di-rondine.fango";
const SHOTS = process.argv.includes("shots");
async function btns(p) { return p.evaluate(() => window.T_.btns().map((o) => o.t)); }
async function click(p, re) { const r = await p.evaluate((re) => window.T_.click(re), re); if (!r) throw new Error("manca pulsante " + re + " in " + JSON.stringify(await btns(p))); await p.waitForTimeout(40); return r; }
// avanza nei dialoghi fino al menu della settimana (o a un pulsante voluto); prefs = scelte preferite nell'ordine
async function until(p, stop, prefs = [], max = 400) {
  for (let i = 0; i < max; i++) {
    await p.waitForTimeout(30);
    const b = await btns(p);
    if (b.some((t) => new RegExp(stop).test(t))) return b;
    let done = false;
    for (const re of prefs.concat(["^▸$", "^Continua ▸", "^Classifica ▸"])) { if (b.some((t) => new RegExp(re).test(t))) { await click(p, re); done = true; break; } }
    if (!done) { if (!b.length) { await p.waitForTimeout(250); continue; } throw new Error("bloccato su " + JSON.stringify(b)); }
  }
  throw new Error("troppi passi verso " + stop);
}
const S = (p) => p.evaluate(() => JSON.parse(JSON.stringify(window.__fango._dbg.S)));
async function season(p, errors, prefs, how, tag) {
  for (let g = 0; g < 5; g++) {
    await until(p, "^⚽ Gioca contro", prefs);
    if (g === 4) await p.evaluate(() => { window.__fango._dbg.S.season.table.us.pts += 60; }); // promozione sicura per arrivare in fondo
    if (g === 0) await click(p, "^🏋️ Allenamento").then(() => click(p, "Tiro")).then(() => until(p, "^⚽ Gioca contro"));
    if (g === 1) await click(p, "^🍻 Serata").then(() => until(p, "^⚽ Gioca contro"));
    if (g === 2) await click(p, "^🛌 Riposo").then(() => until(p, "^⚽ Gioca contro"));
    if (SHOTS && g === 0) await L.shot(p, "fango_hub_" + tag);
    await click(p, "^⚽ Gioca contro");
    const kind = how[g] || "sim";
    if (kind === "mom") {
      await click(p, "^🥾 Il Momento"); await p.waitForTimeout(400);
      const ok = await p.evaluate(() => !!document.getElementById("fmOv") && !!window.__fangoMomento.state);
      if (!ok) errors.push("Il Momento non si apre (" + tag + ")");
      if (SHOTS && g === 3) { await p.evaluate(() => window.__fangoMomento.state.tick(1.3)); await L.shot(p, "fango_momento_" + tag); }
      await p.evaluate(() => window.__fangoMomento.state.finish(true, 2)); await p.waitForTimeout(100);
      await p.evaluate(() => document.getElementById("fmGo").click()); await p.waitForTimeout(200);
    } else if (kind === "full") {
      await L.stubMatch(p, true); await click(p, "^🎮 Partita intera"); await p.waitForTimeout(250);
    } else await click(p, "^⏩ Simula");
    await until(p, "^Classifica ▸"); await click(p, "^Classifica ▸");
  }
}
async function career(w, path, prefs, expect) {
  const { browser, page, errors } = await L.setup({ w, key: KEY, extra: { "ali-di-rondine.fango.opt": { on: true, cut: true } } });
  try {
    await page.evaluate(() => window.__fango.open()); await page.waitForTimeout(300);
    if (SHOTS) await L.shot(page, "fango_titolo");
    await click(page, "Comincia la carriera");
    for (let t = 1; t <= 5; t++) {
      await season(page, errors, prefs, t === 2 ? ["mom", "full", "sim", "mom", "sim"] : ["sim", "mom", "sim", "sim", "sim"], t + (t === 5 ? path : ""));
      const s = await S(page); if (s.season && s.season.round !== 5) errors.push(`tappa ${t}: giornate ${s.season.round}`);
      if (t === 4) await page.evaluate((path) => { const S = window.__fango._dbg.S; if (path === "p") { S.gol = Math.max(S.gol, 35); S.onore = Math.max(S.onore, 7); } }, path);
      if (t < 5) { await until(page, "^⚽ Gioca contro", prefs.concat(t === 4 ? [path === "p" ? "Torni alla Pozzanghera" : "Resti all'Aurelia"] : [])); const s2 = await S(page); if (s2.tappa !== t + 1) errors.push(`dopo tappa ${t}: tappa ${s2.tappa}`); }
    }
    await until(page, "^▶ Comincia|^Nuova carriera", prefs, 600);
    const s = await S(page), i = await page.evaluate(() => window.__fango.info());
    if (JSON.stringify(s.ends.sort()) !== JSON.stringify(expect.sort())) errors.push("finali: " + JSON.stringify(s.ends) + " attesi " + JSON.stringify(expect));
    if (Object.keys(i.done).length !== 5) errors.push("tappe concluse: " + JSON.stringify(i.done));
    // integrazione: carte dei Sogni sbloccate, Salone, mazzo del Destino, ospite al Borgo
    const integ = await page.evaluate(() => {
      const so = window.__sogni, cards = so.CARDS.filter((c) => c.saga === "fango").map((c) => c.id), pr = so._progress ? so._progress("fango") : null;
      const sal = window.__salone.concluded("ali-di-rondine.fango"), g = window.__borgoGuests.list().find((x) => x.id === "mf_bava");
      const deck = window.__carteDecks && window.__carteDecks.list ? window.__carteDecks.list().map((d) => d.id) : null;
      return { cards, pr, sal, guest: g && g.on, deck: deck ? deck.includes("mf") : "?", cast: ["mf_me", "mf_ruggine", "mf_pupa"].every((k) => !!window.__borgoApi.CAST[k]) };
    });
    if (integ.cards.length !== 8) errors.push("carte Sogni: " + integ.cards.length);
    if (!integ.sal) errors.push("Salone: saga non conclusa");
    if (!integ.guest) errors.push("ospite al Borgo spento");
    if (integ.deck === false) errors.push("mazzo del Destino mancante");
    if (!integ.cast) errors.push("personaggi non registrati");
    if (SHOTS) await L.shot(page, "fango_fine_" + path);
  } catch (e) { errors.push(e.message.slice(0, 500)); if (SHOTS) await L.shot(page, "fango_errore"); }
  L.check(`Dal Fango alla Leggenda · carriera ${path === "p" ? "Pozzanghera" : "Aurelia"} (${w} px)`, errors); await browser.close();
}
// Il Momento giocato davvero: azione con levetta e tiro, punizione, rigore (nessun errore, esiti coerenti)
async function minigame(w) {
  const { browser, page, errors } = await L.setup({ w, key: KEY });
  try {
    const out = await page.evaluate(async () => {
      const F = window.__fangoMomento; let done = null;
      F.start({ title: "Prova", moments: [{ kind: "azione" }, { kind: "punizione" }, { kind: "rigore" }], lv: 1, ovr: 70, tutorial: false, onDone: (r) => { done = r; } });
      const s = F.state, log = [];
      s.tick(1.3); log.push(s.phase);
      s.move(190, 70); s.press(); s.tick(0.2); s.press(); s.tick(1.0); log.push(s.cur.out); s.tick(1.6); s.tick(1.2); log.push(s.i);
      s.press(); s.tick(0.3); s.press(); s.tick(0.5); s.press(); s.tick(1.0); log.push(s.cur.out); s.tick(1.6); s.tick(1.2);
      s.press(); s.tick(0.3); s.press(); s.tick(1.0); log.push(s.cur.out); s.tick(2);
      log.push(s.phase);
      document.getElementById("fmGo") && document.getElementById("fmGo").click();
      return { log, done };
    });
    if (out.log[0] !== "play") errors.push("non parte: " + out.log);
    if (out.log[out.log.length - 1] !== "end" || !out.done || out.done.b !== 3) errors.push("serie non finita: " + JSON.stringify(out));
    console.log("  esiti momenti: " + out.log.join(" "));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Il Momento · minigioco (${w} px)`, errors); await browser.close();
}
// menu Partite e modalità, opzione in Impostazioni (con cut-in), Salone e cabinato in Sala Giochi
async function menus(w) {
  const { browser, page, errors } = await L.setup({ w, key: KEY, save: { v: 1, tappa: 2, done: { 1: 1 }, ends: [], st: { tiro: 50, drib: 50, fis: 50 }, f: {}, seen: {}, log: [] }, extra: { "ali-di-rondine.fango.opt": { on: true, cut: true } } });
  try {
    await page.evaluate(() => window.title()); await page.waitForTimeout(200);
    await click(page, "^Partite e modalità"); await page.waitForTimeout(200);
    if (!(await btns(page)).some((t) => /Dal Fango alla Leggenda/.test(t))) errors.push("manca nel menu Modalità");
    await page.evaluate(() => window.__fango.setOn(false)); await page.evaluate(() => window.title()); await click(page, "^Partite e modalità");
    if ((await btns(page)).some((t) => /Dal Fango alla Leggenda/.test(t))) errors.push("spenta ma ancora nel menu");
    const sal = await page.evaluate(() => window.__salone.summary && JSON.stringify(window.__salone.summary()).includes("Fango"));
    await page.evaluate(() => window.__fango.setOn(true));
    // cabinato: aperto perché la tappa 1 è conclusa
    const ok = await page.evaluate(() => window.__salone.playMachine("momento", () => { window.__mDone = 1; }));
    if (!ok) errors.push("cabinato Il Momento chiuso"); else { await page.waitForTimeout(300); await page.evaluate(() => { const s = window.__fangoMomento.state; if (s.tut()) s.finish(true, 3); else s.finish(true, 3); }); await page.waitForTimeout(100); await page.evaluate(() => document.getElementById("fmGo").click()); await page.waitForTimeout(200); if (!(await page.evaluate(() => window.__mDone))) errors.push("cabinato: esito non restituito"); }
    if (SHOTS) await L.shot(page, "fango_menu");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Dal Fango alla Leggenda · menu, opzione e cabinato (${w} px)`, errors); await browser.close();
}
(async () => {
  await menus(390);
  await minigame(390);
  if (process.argv.includes("mini")) return;
  await career(390, "a", ["Te lo dico in campo", "Firmi con Ugo", "Scrivi a Tonino", "«No.»", "Ti fermi e fai", "Vai al funerale", "porchetta", "perdoni", "Rialzati prima"], ["mito"]);
  await career(390, "p", ["tunnel col tacco", "Ci vai da solo", "foto con l'autografo", "Registri tutto", "Telefoni a Ruggine", "Vai al funerale", "Rifiuti", "perdoni"], ["ritorno", "mister"]);
})();
