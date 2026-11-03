// tests/saghe_profondita.cjs - verifica le 27 Leggendarie delle Saghe e la Scrittura di Carta (comparse nei Sogni)
const L = require("./lib.cjs");

async function run(w) {
  const montFin = { v: 1, ch: 3, done: { 1: "a", 2: "b", 3: "c" }, ends: ["neve", "vetta"] };
  const romaFin = { v: 1, ch: 3, done: { 1: "a", 2: "b", 3: "c" }, ends: ["gladiatore", "trionfo"] };
  const extra = {
    "ali-di-rondine.montagna": montFin,
    "ali-di-rondine.roma": romaFin,
    "ali-di-rondine.album": ["pescatore_vecchio", "ostessa_maria"],
    "ali-di-rondine.scrittura-carta": { on: true }
  };
  const { browser, page, errors } = await L.setup({ w, extra });

  const res = await page.evaluate(() => {
    const s = window.__sogni;
    const cards = s.CARDS;
    const leg27Ids = [
      "bm_valanga_l", "pr_colonnello", "rm_massimo", "sq_prof", "rz_vega",
      "cs_oro", "td_duca", "ts_ettore", "mg_fuorigioco", "nl_ombra",
      "tc_ferroquercia", "ml_mister", "dc_zeno", "so_capitano", "ve_soffio",
      "ep_carlo", "vp_capo", "gp_direttore", "dg_cenere", "chr_alter_hero",
      "omb_kaelen", "rag_custode_vuoto", "pg_genesis", "mu_baluardo",
      "dt_maestro", "alc_joe", "nf_fiorenzo"
    ];
    const missing = leg27Ids.filter((id) => !cards.some((c) => c.id === id && c.rar === "l"));
    
    // Test sblocco montagna e roma dai finali completati
    const syncRes = s.sync();
    const own = syncRes.r.own;
    const hasMont = own.includes("bm_valanga_l");
    const hasRoma = own.includes("rm_massimo");

    // Test Scrittura di Carta: pescatore_vecchio e ostessa_maria devono comparire come carte bronzo
    // Mock bio se non presenti in CAST
    window.__borgoApi.BIO = window.__borgoApi.BIO || {};
    window.__borgoApi.BIO.pescatore_vecchio = "Un vecchio pescatore del molo estivo.";
    window.__borgoApi.BIO.ostessa_maria = "L'ostessa della trattoria che non fa sconti a nessuno.";
    
    s.sync();
    const own2 = s._load().own;
    const hasComp1 = own2.includes("pescatore_vecchio");
    const hasComp2 = own2.includes("ostessa_maria");
    const cardComp1 = s.BY.pescatore_vecchio;

    // Test toggle Scrittura di Carta: se spento, non sono presenti in own
    s.scrittura.setOn(false);
    const ownOff = s._load().own;
    const hasCompOff = ownOff.includes("pescatore_vecchio");

    // Ripristina toggle on
    s.scrittura.setOn(true);

    return {
      totCards: cards.length,
      missing,
      hasMont,
      hasRoma,
      hasComp1,
      hasComp2,
      compRole: cardComp1 && cardComp1.role,
      compRar: cardComp1 && cardComp1.rar,
      hasCompOff
    };
  });

  if (res.missing.length > 0) errors.push("Mancano le leggendarie: " + res.missing.join(", "));
  if (!res.hasMont) errors.push("Sindaco Valanga (bm_valanga_l) non sbloccato dai finali");
  if (!res.hasRoma) errors.push("Massimo il Gladiatore (rm_massimo) non sbloccato dai finali");
  if (!res.hasComp1 || !res.hasComp2) errors.push("Comparse non generate da Scrittura di Carta");
  if (res.compRar !== "c") errors.push("Comparsa non è rarità bronzo comune: " + res.compRar);
  if (res.hasCompOff) errors.push("Comparsa ancora in own con toggle spento");

  L.check(`Saghe: 27 Leggendarie e Scrittura di Carta (${w} px)`, errors);
  await browser.close();
}

(async () => {
  await run(390);
  await run(320);
})().catch((e) => {
  console.error("✗ saghe_profondita:", e.message);
  process.exit(1);
});
