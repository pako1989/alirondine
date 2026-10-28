// tests/onde.cjs - «Radio Fuorigioco · Onde Corte sul Golfo (1977)»
// Verifica: 12 zone 2D raggiungibili (reachAll), 14 sfondi rf_* + 3 hotspot, Sintonizzatore AM/FM (portanti + 6 QSL),
// Zaino + Dossier + Orologio + Rapporti, 4 capitoli completi, 4 finali (incluso bobina1096), minigioco 2D Onde d'Urto
// su 320x640, 390x844 e 1000x700, e integrazioni Salone / Sala Giochi / Squadra dei Sogni / Carte del Destino.
const L = require("./lib.cjs");
const MOD = { mod: "__onde", key: "ali-di-rondine.onde" };
const K_ = "window.__onde._dbg.K";
const info = (p) => L.info(p);
const adv = (p, prefs) => L.advance(p, prefs).catch((e) => { if (!/Torna a camminare/.test(e.message)) throw e; });

async function go(p, z, x, y) {
  await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]);
  await p.waitForTimeout(450);
  await L.advance(p).catch(() => {});
}

async function tuneAt(p, freq, prefs) {
  await p.evaluate(([k, f]) => {
    const K = eval(k);
    K.radio.set(f);
    K.radio.open(() => {}, true);
  }, [K_, freq]);
  await p.waitForTimeout(250);
  const clicked = await p.evaluate(() => {
    const btns = [...document.querySelectorAll("#choices button")];
    const b = btns.find((x) => /📡 (?:Riascolta|Ascolta):/.test(x.innerText) && !x.disabled);
    if (b) { b.click(); return true; }
    return false;
  });
  if (!clicked) throw new Error("Portante non agganciata su " + freq + " MHz");
  await p.waitForTimeout(300);
  await adv(p, prefs);
}

async function finishUrto(p, us, op, clean = true) {
  await p.waitForSelector("#urtoOv", { timeout: 6000 });
  await p.waitForTimeout(250);
  await p.evaluate(([u, o, c]) => window.__urto.finishTest(u, o, c), [us, op, clean]);
  await p.waitForTimeout(350);
  await adv(p);
}

const SAVE = (ch, step, done, flags, st, extra) => Object.assign({
  v: 1,
  diffSet: true,
  intro: { ch1: 1, ch2: 1, ch3: 1, ch4: 1 },
  ch,
  step,
  done,
  flags: Object.assign({}, flags || {}),
  st: Object.assign({ libero: 2, prudenza: 1, verita: 2, mito: 1, sintonia: 2 }, st || {})
}, extra || {});

async function checkZonesAndBgs(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__onde.open());
  await page.evaluate(() => window.T_.click("Inizia la storia"));
  await adv(page);

  const ZONES = [
    "rf_pontile", "rf_bottega", "rf_cabina",
    "rf_cortili", "rf_bar", "rf_furgone",
    "rf_ponte", "rf_macchine", "rf_bobine",
    "rf_stadio", "rf_spogliatoio", "rf_torretta"
  ];
  for (const zid of ZONES) {
    const bad = await L.reachAll(page, zid);
    if (bad.length) errors.push(zid + ": " + bad.join(", "));
  }

  // Verifica 14 sfondi rf_* e 3 hotspot ciascuno
  const bgErrs = await page.evaluate(() => {
    const BGS = [
      "rf_titolo", "rf_pontile", "rf_cabina", "rf_bottega",
      "rf_cortili", "rf_furgone", "rf_bar", "rf_ponte",
      "rf_macchine", "rf_bobine", "rf_stadio", "rf_spogliatoio",
      "rf_torretta", "rf_finale"
    ];
    const errs = [];
    const lb = (window.__lbBg && window.__lbBg.LB) || {};
    const cv = document.createElement("canvas");
    cv.width = 320; cv.height = 200;
    const g = cv.getContext("2d");
    for (const id of BGS) {
      const def = lb[id];
      if (!def || typeof def.draw !== "function") { errs.push("sfondo mancante: " + id); continue; }
      g.clearRect(0, 0, 320, 200);
      let ok = false;
      try { ok = window.renderDetailedBg(id, g, 320, 200, 12) === true; } catch (e) { errs.push("errore draw " + id + ": " + e.message); continue; }
      if (!ok) { errs.push("renderDetailedBg false: " + id); continue; }
      const d = g.getImageData(0, 0, 320, 200).data;
      let lit = 0;
      for (let i = 0; i < d.length; i += 400) if (d[i] + d[i + 1] + d[i + 2] > 30) lit++;
      if (lit < 25) errs.push("sfondo vuoto: " + id);
      const spots = def.hot || [];
      if (!Array.isArray(spots) || spots.length < 3) errs.push("hotspot < 3 su " + id);
    }
    return errs;
  });
  errors.push(...bgErrs);

  // Verifica Guida del Menu (include Sintonizzatore + Dossier + Zaino + Orologio + Rapporti)
  await go(page, "rf_pontile", 6, 13);
  await page.evaluate(() => window.T_.click("Menu"));
  await page.waitForTimeout(250);
  await page.evaluate(() => window.T_.click("Guida"));
  await page.waitForTimeout(250);
  const guideTxt = await page.evaluate(() => [...document.querySelectorAll("#choices button")].map((b) => b.innerText).join("|"));
  for (const k of ["Rapporti", "Zaino", "Orologio", "Dossier", "Sintonizzatore"]) {
    if (!guideTxt.includes(k)) errors.push("Guida senza " + k + ": " + guideTxt);
  }

  L.check(`Radio Fuorigioco · 12 zone, 14 sfondi e Guida (${w} px)`, errors);
  await browser.close();
}

async function playChapters1To3(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__onde.open());
  await page.evaluate(() => window.T_.click("Inizia la storia"));
  await adv(page);
  if (w === 390) await L.shot(page, "rf_pontile");

  // --- CAPITOLO 1 ---
  // QSL #1 a sud-ovest del pontile (88.6 MHz)
  await go(page, "rf_pontile", 5, 18);
  await tuneAt(page, 88.6);
  // Entra nella Bottega Dischi & Valvole: parla con Lupo e sintonizza QSL #2 (105.4 MHz)
  await go(page, "rf_bottega", 10, 10);
  await L.talk(page, "rf_lupo");
  await adv(page);
  await go(page, "rf_bottega", 5, 6);
  await tuneAt(page, 105.4);
  // Torna al molo est, sintonizza 91.2 MHz per il varco del gozzo
  await go(page, "rf_pontile", 24, 16);
  await tuneAt(page, 91.2);
  let i = await info(page);
  if (i.step[1] !== 2) errors.push("C1 varco 91.2 non sbloccato: " + JSON.stringify(i.step));

  // Sali a bordo della Cabina 99.9 e scegli la diretta integrale
  await go(page, "rf_cabina", 10, 10);
  await L.talk(page, "rf_nilde");
  await adv(page, [/diretta integrale/]);
  i = await info(page);
  if (i.step[1] !== 3) errors.push("C1 dopo scelta Nilde: " + JSON.stringify(i.step));

  // Torna al Pontile e vinci la partita del Capitolo 1
  await go(page, "rf_pontile", 18, 15);
  await L.talk(page, "rf_nilde");
  await adv(page, [/Scendi in campo/]);
  await finishUrto(page, 3, 1, true);
  i = await info(page);
  if (i.done[1] !== "ok") errors.push("C1 non concluso: " + JSON.stringify(i.done));

  // --- CAPITOLO 2 ---
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 2"));
  await adv(page);
  // Bar Eldorado: parla con Wanda + QSL #4 (107.2 MHz)
  await go(page, "rf_bar", 10, 10);
  await L.talk(page, "rf_wanda");
  await adv(page);
  await go(page, "rf_bar", 5, 5);
  await tuneAt(page, 107.2);
  // Cortili: QSL #3 (96.8 MHz) + Unità 04 (94.6 MHz)
  await go(page, "rf_cortili", 16, 6);
  await tuneAt(page, 96.8);
  await go(page, "rf_cortili", 28, 9);
  await tuneAt(page, 94.6);
  i = await info(page);
  if (i.step[2] !== 2) errors.push("C2 Unità 04 non sbloccata: " + JSON.stringify(i.step));

  // Entra nel furgone Unità 04 ed esamina il tavolo cartografico (10,6)
  await go(page, "rf_furgone", 10, 10);
  await L.goAct(page, 10, 6);
  await adv(page);
  i = await info(page);
  if (i.step[2] !== 3) errors.push("C2 mappa furgone non raccolta: " + JSON.stringify(i.step));

  // Torna nei Cortili: parla con Tullio (rifiuta sponsor Specchio) e sfida Valli
  await go(page, "rf_cortili", 9, 12);
  await L.talk(page, "rf_tullio");
  await adv(page, [/radiofaro/]);
  await L.talk(page, "rf_valli");
  await adv(page, [/Gioca contro il G\.S\. Poste/]);
  await finishUrto(page, 3, 1, true);
  i = await info(page);
  if (i.done[2] !== "ok") errors.push("C2 non concluso: " + JSON.stringify(i.done));

  // --- CAPITOLO 3 ---
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 3"));
  await adv(page);
  // QSL #5 sul ponte (90.4 MHz)
  await go(page, "rf_ponte", 16, 7);
  await tuneAt(page, 90.4);
  // Sala Macchine -> Tullio
  await go(page, "rf_macchine", 10, 8);
  await L.talk(page, "rf_tullio");
  await adv(page);
  // Archivio Bobine -> Nilde + 101.8 MHz banco bobine
  await go(page, "rf_bobine", 10, 8);
  await L.talk(page, "rf_nilde");
  await adv(page);
  await go(page, "rf_bobine", 10, 6);
  await tuneAt(page, 101.8, [/Rivela in diretta/]);
  i = await info(page);
  if (i.step[3] !== 3) errors.push("C3 dopo Bobina 000: " + JSON.stringify(i.step));

  // Torna sul Ponte e vinci contro la Guardiacoste
  await go(page, "rf_ponte", 18, 12);
  await L.talk(page, "rf_nilde");
  await adv(page, [/Gioca sul Ponte/]);
  await finishUrto(page, 4, 2, true);
  i = await info(page);
  if (i.done[3] !== "ok") errors.push("C3 non concluso: " + JSON.stringify(i.done));

  const qslCount = await page.evaluate((k) => eval(k).radio.tagCount("qsl"), K_);
  if (qslCount !== 5) errors.push("QSL dopo Cap.3 attese 5, trovate: " + qslCount);

  L.check(`Radio Fuorigioco · Capitoli 1–3 completi (${w} px)`, errors);
  await browser.close();
}

async function testEnding(w, wantEnd, cfg) {
  const save = SAVE(4, { 1: 4, 2: 5, 3: 4, 4: 0 }, { 1: "ok", 2: "ok", 3: "ok" }, cfg.flags || {}, cfg.st || {});
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__onde.open());
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 4")).catch(async () => {
    await page.evaluate(() => window.T_.click("Continua")).catch(() => {});
  });
  await adv(page);

  await page.evaluate(([k, cfg]) => {
    const K = eval(k);
    ["perizia_falsa", "nota_gruista", "mappa_frequenze", "registro_geometra"].forEach((id) => K.dossier.add("appalto", id));
    if (cfg.allQsl) {
      ["qsl_1", "qsl_2", "qsl_3", "qsl_4", "qsl_5"].forEach((id) => {
        K.F.set("rad_t_" + id, true);
        K.F.set("rad_tag_qsl_" + id, true);
      });
    }
    if (cfg.bondsHigh) {
      K.rel.add("rf_nilde", 20);
      K.rel.add("rf_valli", 20);
    }
  }, [K_, cfg]);

  if (cfg.allQsl) {
    await go(page, "rf_stadio", 19, 7);
    await tuneAt(page, 103.6);
  }

  // Confronto con Specchio + Verdetto del Dossier
  await go(page, "rf_stadio", 16, 9);
  await L.talk(page, "rf_specchio");
  await adv(page, [/Consegna il verdetto/, /Annullamento/]);
  let i = await info(page);
  if (i.step[4] !== 1) errors.push(wantEnd + " · step dopo Specchio: " + JSON.stringify(i.step));

  // Torretta del Cronista -> Valli e scelta Bobina 000
  await go(page, "rf_torretta", 10, 8);
  await L.talk(page, "rf_valli");
  await adv(page, [cfg.valliChoice]);
  i = await info(page);
  if (i.step[4] !== 2) errors.push(wantEnd + " · step dopo Valli: " + JSON.stringify(i.step));

  // Scendi sul prato e gioca la finale
  await go(page, "rf_stadio", 19, 14);
  await L.talk(page, "rf_nilde");
  await adv(page, [/Fischio d'inizio/]);
  await finishUrto(page, cfg.win ? 3 : 0, cfg.win ? 1 : 3, cfg.clean !== false);

  i = await info(page);
  if (i.done[4] !== wantEnd) errors.push(`Finale atteso ${wantEnd}, ottenuto ${i.done[4]} (${JSON.stringify(i)})`);

  L.check(`Radio Fuorigioco · Finale «${wantEnd}» (${w} px)`, errors);
  await browser.close();
}

async function testUrtoResponsiveAndEcosystem() {
  for (const [w, h] of [[320, 640], [390, 844], [1000, 700]]) {
    const { browser, page, errors } = await L.setup({ w, ...MOD });
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(200);

    // Avvia una vera partita Onde d'Urto
    await page.evaluate(() => {
      window.__urtoRes = null;
      window.__urto.start({
        title: "Test Onde d'Urto",
        us: "Radio 99.9",
        opp: "Specchio SC",
        oppColor: "#38bdf8",
        venue: "stadio",
        track: "finale",
        staticCount: 3,
        halfSec: 20,
        done: (r) => { window.__urtoRes = r; }
      });
    });
    await page.waitForSelector("#urtoOv.scPitch", { timeout: 5000 });
    await page.waitForTimeout(350);

    const layout = await page.evaluate(() => {
      const ov = document.getElementById("urtoOv");
      const cv = ov && ov.querySelector("#urtoCv");
      const bands = [...(ov ? ov.querySelectorAll("[data-band]") : [])];
      if (!ov || !cv || bands.length !== 3) return { bad: "elementi mancanti" };
      const r = cv.getBoundingClientRect();
      const ratio = r.width / Math.max(1, r.height);
      const expected = 360 / 220;
      // Cambia banda a 104.2
      bands[2].click();
      return {
        w: r.width,
        h: r.height,
        ratioDiff: Math.abs(ratio - expected),
        band: window.__urto.state && window.__urto.state.band,
        inViewport: r.bottom <= window.innerHeight + 2 && r.right <= window.innerWidth + 2 && r.width >= 200
      };
    });
    if (layout.bad) errors.push(`Urto ${w}x${h}: ${layout.bad}`);
    if (layout.ratioDiff > 0.08) errors.push(`Urto ${w}x${h} canvas deformato: diff=${layout.ratioDiff.toFixed(3)}`);
    if (!layout.inViewport) errors.push(`Urto ${w}x${h} fuori schermo: ${JSON.stringify(layout)}`);
    if (layout.band !== "104.2") errors.push(`Urto ${w}x${h} cambio banda fallito: ${layout.band}`);
    if (w === 390) await L.shot(page, "rf_urto_390");

    await page.evaluate(() => window.__urto.finishTest(2, 0, true));
    await page.waitForTimeout(250);
    const res = await page.evaluate(() => window.__urtoRes);
    if (!res || !res.win || res.gUs !== 2 || !res.cleanVinylLap) errors.push(`Urto ${w}x${h} risultato errato: ${JSON.stringify(res)}`);

    // Se w === 390 verifica anche tutto l'ecosistema
    if (w === 390) {
      const eco = await page.evaluate(() => {
        const errs = [];
        // Salone + Sala Giochi
        if (!window.__onde) errs.push("__onde assente");
        if (!window.__urto) errs.push("__urto assente");
        const cosm = Object.keys((window.__borgoApi && window.__borgoApi.COSM) || {}).filter((k) => k.startsWith("rf_"));
        if (cosm.length < 5) errs.push("cosmetici rf_* < 5: " + cosm.length);
        const cast = Object.keys((window.__borgoApi && window.__borgoApi.CAST) || {}).filter((k) => k.startsWith("rf_"));
        if (cast.length < 8) errs.push("cast rf_* < 8: " + cast.length);
        // Carte del Destino mazzo rf (10 carte)
        const decks = window.__carteDecks ? window.__carteDecks.list() : [];
        if (!decks.some((d) => d.id === "rf")) errs.push("mazzo rf assente in Carte del Destino");
        return errs;
      });
      errors.push(...eco);

      // Verifica giocabilità reale del mazzo rf in Carte del Destino una volta conclusa la saga
      await page.evaluate(() => {
        const real = window.__salone.concluded;
        window.__salone.concluded = (k) => k === "ali-di-rondine.onde" || real(k);
        localStorage.setItem("ali-di-rondine.onde", '{"v":1,"done":{"1":"ok","2":"ok","3":"ok","4":"cooperativa"}}');
      });
      await page.evaluate(() => window.__carte.open());
      await page.evaluate(() => window.T_.click("Inizia la storia"));
      await L.advance(page);
      await page.evaluate(() => {
        const K = window.__carte._dbg.K;
        K.F.set("cd_amb", "rf_cabina");
        K.F.set("cd_pg", "rf_lupo");
        K.F.set("cd_ev", "rf_dedica");
        K.F.set("cd_sf", "rf_vinile");
        K.F.set("cd_tw", "rf_lato_b");
        K.setStep(1, 1);
        K.enterZone("cd_cantiere");
      });
      await page.waitForTimeout(450);
      await L.advance(page);
      await L.talk(page, "rf_lupo");
      await L.advance(page, [/^Mandala senza tagli/]);
      await page.waitForSelector("#cdProva", { timeout: 6000 }).catch(() => errors.push("prova rf_vinile non comparsa"));
      await page.evaluate(() => document.getElementById("cdPg").click());
      await page.waitForTimeout(400);
      await page.evaluate(() => window.__carteProva.finish(0.9));
      await page.waitForTimeout(1200);
      await L.advance(page);
    }

    L.check(`Onde d'Urto & Ecosistema (${w}x${h})`, errors);
    await browser.close();
  }
}

(async () => {
  await checkZonesAndBgs(390);
  await playChapters1To3(390);
  await testEnding(390, "cooperativa", {
    flags: {},
    st: { libero: 4, prudenza: 3, verita: 5, mito: 2, sintonia: 4 },
    valliChoice: /Porgi le cuffie/,
    win: true,
    clean: true
  });
  await testEnding(390, "pirati", {
    flags: {},
    st: { libero: 8, prudenza: 1, verita: 4, mito: 3, sintonia: 4 },
    valliChoice: /Diffondi la Bobina 000/,
    win: true,
    clean: true
  });
  await testEnding(390, "ciclostile", {
    flags: { rf_specchio_sponsor: true },
    st: { libero: 2, prudenza: 7, verita: 3, mito: 2, sintonia: 3 },
    valliChoice: /Consegna spontaneamente/,
    win: true,
    clean: true
  });
  await testEnding(390, "bobina1096", {
    flags: {},
    st: { libero: 6, prudenza: 2, verita: 6, mito: 4, sintonia: 8 },
    allQsl: true,
    bondsHigh: true,
    valliChoice: /Porgi le cuffie/,
    win: true,
    clean: true
  });
  await testUrtoResponsiveAndEcosystem();
})();
