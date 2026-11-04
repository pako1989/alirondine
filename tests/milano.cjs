// tests/milano.cjs - «Operazione Fuorigioco Noir · Milano 1954» (restaurata, 5 capitoli): zone raggiungibili, parla con tutti,
// storia giocata fino in fondo con le scelte, finali (gating del Peso e dei flag), partita Pedinamento simulata.
const L = require("./lib.cjs");
const MOD = { mod: "__milano", key: "ali-di-rondine.milano" };
const K_ = "window.__milano._dbg.K";
const mock = (p, w = true) => p.evaluate((w) => { window.__pedinamento.start = (o) => { setTimeout(() => (o.onDone || o.done)({ a: w ? 2 : 0, b: w ? 1 : 2, win: w, quit: false, data: {} }), 30); return true; }; }, w);
async function reach(page, zid, maxStep = 6) {
  await page.evaluate(([k, z]) => eval(k).enterZone(z), [K_, zid]); await page.waitForTimeout(400);
  return page.evaluate(([zid, maxStep]) => {
    const D = window.__milano._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z), T = window.T_, st = spec.start, bad = [];
    const npcs = (z.npcs || []).filter((n) => !n.ghost).map((n) => n.at), seen = T.bfs(m, z, st[0], st[1], npcs);
    const adj = (x, y) => [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => seen[y + dy] && seen[y + dy][x + dx]);
    if (T.solidAt(m, z, st[0], st[1])) bad.push("partenza su solido");
    (spec.items || []).forEach(([x, y]) => { if (T.solidAt(m, z, x, y) || !(seen[y] && seen[y][x])) bad.push("oggetto " + x + "," + y); });
    for (let s = 0; s <= maxStep; s++) (spec.npcs ? spec.npcs(s, D.K) : []).forEach((n) => { if (!adj(n.at[0], n.at[1])) bad.push("png " + n.id + " " + n.at + " passo " + s); });
    for (let y = 0; y < m.length; y++) for (let x = 0; x < m[0].length; x++) if ((m[y][x] === "q" || m[y][x] === "v") && !adj(x, y)) bad.push("porta " + x + "," + y);
    return bad;
  }, [zid, maxStep]);
}
const step = (p, n) => p.evaluate(([n]) => window.__milano.info().step[n] || 0, [n]);
async function go(page, z) { await page.evaluate(([k, z]) => eval(k).enterZone(z), [K_, z]); await page.waitForTimeout(350); }
async function talkAdv(page, id, prefs = []) { await L.talk(page, id); await L.advance(page, prefs); }

async function run(w, choices) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  const err = (m) => errors.push(`[${choices.tag}] ` + m);
  await page.evaluate(() => window.__milano.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  await mock(page, true);
  const chk = async (n, v, why) => { const s = await step(page, n); if (s !== v) err(why + ": passo " + s + " invece di " + v); };
  const zonesOf = (n) => page.evaluate((n) => Object.keys(window.__milano._dbg.ZONES).filter((z) => window.__milano._dbg.ZONES[z].ch === n), n);
  const talkAll = async (n) => { // parla con tutti i PNG di tutte le zone del capitolo: nessun errore, il passo non cambia
    for (const z of await zonesOf(n)) { const bad = await reach(page, z); if (bad.length) err(z + ": " + bad.join(", ")); }
  };
  const shot = async (n) => { if (w === 390) await L.shot(page, n); };
  // CAPITOLO 1
  await talkAll(1);
  await go(page, "mn_bastioni"); await shot("mn_bastioni");
  for (const id of ["mn_scotti", "mn_brogio", "mn_ines", "mn_gaspare", "mn_celestino"]) await talkAdv(page, id);
  await talkAdv(page, "mn_desantis"); await chk(1, 1, "De Santis c1");
  await go(page, "mn_osteria"); await shot("mn_osteria");
  for (const id of ["mn_carlo", "mn_tino", "mn_pinin"]) await talkAdv(page, id);
  await talkAdv(page, "mn_oste"); await chk(1, 2, "Battista c1");
  await go(page, "mn_deposito"); await talkAdv(page, "mn_peppino", [choices.pep]); await chk(1, 3, "Peppino c1");
  await go(page, "mn_bastioni"); await talkAdv(page, "mn_nando", [/Gioca contro la Banda/]);
  { const i = await L.info(page); if (!i.done[1] || i.ch !== 2) err("capitolo 1 non concluso: " + JSON.stringify([i.done, i.ch])); }
  for (let n = 2; n <= 5; n++) {
    const hook = choices["c" + n]; if (!hook) break;
    await talkAll(n); await hook(page, { go, talkAdv, chk, shot, err, L });
    const i = await L.info(page); if (!i.done[n]) { err("capitolo " + n + " non concluso: " + JSON.stringify([i.done, i.step])); break; }
  }
  const i = await L.info(page);
  await browser.close();
  return { errors, info: i };
}
module.exports = { run, mock, reach, go, talkAdv };
if (require.main === module) (async () => {
  const C2 = async (page, h) => {
    await h.go(page, "mn_viatorino"); await h.shot("mn_viatorino");
    for (const id of ["mn_ciccio", "mn_scotti", "mn_celestino"]) await h.talkAdv(page, id);
    await h.talkAdv(page, "mn_desantis"); await h.chk(2, 1, "De Santis c2");
    await h.go(page, "mn_lucciola"); await h.shot("mn_lucciola");
    for (const id of ["mn_tullio", "mn_ugo", "mn_contessa", "mn_wanda", "mn_balestrini", "mn_ines"]) await h.talkAdv(page, id, [/Pareggio/]);
    await h.talkAdv(page, "mn_mara"); await h.chk(2, 2, "Mara c2");
    await h.go(page, "mn_camerino"); await h.shot("mn_camerino"); await h.talkAdv(page, "mn_mara", [/Strappo/, /lascio la busta/]); await h.chk(2, 3, "valigia c2");
    await h.go(page, "mn_vicolo"); await h.talkAdv(page, "mn_carmine", [/Tirapiedi/]);
  };
  const C3 = async (page, h) => {
    await h.go(page, "mn_arena"); await h.shot("mn_arena");
    for (const id of ["mn_boffi", "mn_tino", "mn_pinin", "mn_gaspare", "mn_scotti", "mn_pavesi"]) await h.talkAdv(page, id);
    await h.talkAdv(page, "mn_desantis"); await h.chk(3, 1, "De Santis c3");
    await h.go(page, "mn_spogliatoio"); await h.shot("mn_spogliatoio"); for (const id of ["mn_gioann", "mn_nando"]) await h.talkAdv(page, id);
    await h.talkAdv(page, "mn_arbitro", [/fischia onesto/]); await h.chk(3, 2, "Brambilla c3");
    await h.go(page, "mn_stampa"); for (const id of ["mn_ines", "mn_rino", "mn_marietto"]) await h.talkAdv(page, id);
    await h.go(page, "mn_tribuna"); for (const id of ["mn_balestrini", "mn_carmine", "mn_contessa"]) await h.talkAdv(page, id);
    await h.talkAdv(page, "mn_mara"); await h.chk(3, 3, "Mara c3");
    await h.go(page, "mn_arena"); await h.talkAdv(page, "mn_pavesi", [/Ferrovieri contro/]);
  };
  const C4 = async (page, h) => {
    await h.go(page, "mn_alzaia"); await h.shot("mn_alzaia");
    for (const id of ["mn_sangalli", "mn_ines", "mn_tino", "mn_pinin", "mn_remo"]) await h.talkAdv(page, id);
    await h.talkAdv(page, "mn_desantis"); await h.chk(4, 1, "De Santis c4");
    await h.go(page, "mn_lavatoio"); await h.shot("mn_lavatoio"); await h.talkAdv(page, "mn_teresa");
    await h.go(page, "mn_ringhiera"); await h.shot("mn_ringhiera"); await h.talkAdv(page, "mn_rosetta"); await h.chk(4, 2, "testimoni c4");
    await h.go(page, "mn_questura"); await h.shot("mn_questura"); await h.talkAdv(page, "mn_vitali", [/referto/i]); await h.chk(4, 3, "Vitali c4");
    await h.talkAdv(page, "mn_scotti"); await h.chk(4, 4, "Scotti c4");
    await h.go(page, "mn_alzaia"); await h.talkAdv(page, "mn_peppino"); await h.talkAdv(page, "mn_remo", [/partita della Darsena/]);
  };
  const C5 = async (page, h) => {
    await h.go(page, "mn_piazza"); await h.shot("mn_piazza");
    for (const id of ["mn_ines", "mn_marietto", "mn_scotti", "mn_peppino", "mn_arbitro", "mn_carmine"]) await h.talkAdv(page, id);
    await h.talkAdv(page, "mn_desantis"); await h.chk(5, 1, "De Santis c5");
    await h.talkAdv(page, "mn_fausto", [/aria lunga/]);
    await h.go(page, "mn_sartoria"); await h.shot("mn_sartoria"); await h.talkAdv(page, "mn_elvira"); await h.chk(5, 2, "Elvira c5");
    await h.go(page, "mn_foyer"); await h.shot("mn_foyer"); await h.talkAdv(page, "mn_contessa"); await h.talkAdv(page, "mn_ernesto", [/bottone/i]); await h.chk(5, 3, "Ernesto c5");
    await h.go(page, "mn_palco"); await h.shot("mn_palco"); await h.talkAdv(page, "mn_balestrini", [/bottone/i, /Riprendo il bottone/]); await h.chk(5, 4, "Balestrini c5");
    await h.go(page, "mn_piazza"); await h.talkAdv(page, "mn_pavesi", [/XI del Tondino/, /Giustizia|Alla Procura/]);
  };
  const r = await run(390, { tag: "A", pep: /lavorerà per me/, c2: C2, c3: C3, c4: C4, c5: C5 });
  console.log(r.errors.length ? "ERRORI:\n" + r.errors.join("\n") : "milano OK", JSON.stringify(r.info.st), JSON.stringify(r.info.done), JSON.stringify(r.info.ends));
  process.exit(r.errors.length ? 1 : 0);
})();
