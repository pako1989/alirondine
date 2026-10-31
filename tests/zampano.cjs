// tests/zampano.cjs - «Il Circo Zampanò · La Pista di Segatura»: avvio fresco, 12 zone raggiungibili, 14 sfondi ci_* coi punti cliccabili,
// Cartellone (K.billboard: sblocchi, 3 slot, deduplica, sinergie, benefici), motore «A scorrimento» col kit «circo» (trampolino T, piroetta aerea, anello O, 4 capi),
// capitoli 1-4 completi, Dossier + verdetto, scelta a tempo, tutti i 4 finali e integrazioni nel Salone / Sala Giochi / Sogni / Carte.
const L = require("./lib.cjs");
const MOD = { mod: "__zampano", key: "ali-di-rondine.zampano" };
const K_ = "window.__zampano._dbg.K";

const Z1 = ["ci_spiazzo", "ci_tendone", "ci_carro"];
const Z2 = ["ci_fiera", "ci_serraglio", "ci_biglietteria"];
const Z3 = ["ci_retro", "ci_sartoria", "ci_cupola"];
const Z4 = ["ci_ingresso", "ci_camerini", "ci_arena"];
const BGS = ["ci_titolo", "ci_spiazzo", "ci_tendone", "ci_carro", "ci_fiera", "ci_serraglio", "ci_biglietteria", "ci_retro", "ci_sartoria", "ci_cupola", "ci_ingresso", "ci_camerini", "ci_arena", "ci_finale"];

async function go(p, z, x, y) {
  await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]);
  await p.waitForTimeout(450);
  await L.advance(p).catch(() => {});
}

async function start(w, save, prefs) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => { window.__noSfx = 1; window.__zampano.open(); });
  await r.page.waitForTimeout(450);
  if (save) await L.advance(r.page, prefs || []).catch(() => {});
  return r;
}

const stubLevel = (p) => p.evaluate(() => {
  window.__scorri.start = (o) => {
    (window.__scLog = window.__scLog || []).push({
      id: o.level && o.level.id,
      kit: o.level && o.level.kit,
      bonus: o.bonus,
      buffs: o.buffs || []
    });
    setTimeout(() => o.onDone({ win: true, coins: 15, ban: 3, banTot: 3, banMask: 7, time: 65 }), 15);
    return true;
  };
});

// 1. Partita davvero nuova dal menu principale della saga + 14 sfondi ci_* + raggiungibilità di tutte le 12 zone (390, 320, 1000 px)
async function freshAndZones(w) {
  const { browser, page, errors } = await start(w, null);
  try {
    // Menu della saga -> Inizia la storia -> difficoltà -> intro cap.1 -> camminata nello spiazzo
    await page.evaluate(() => window.T_.click("^Inizia la storia"));
    await page.waitForTimeout(150);
    await L.advance(page, ["^Normale"]);
    const z0 = await L.zone(page);
    if (z0 !== "ci_spiazzo") errors.push("zona iniziale attesa ci_spiazzo, trovata: " + z0);
    if (w === 390) await L.shot(page, "ci_spiazzo_390");

    // Verifica tutti i 14 sfondi animati ci_* e almeno 3 hotspot ciascuno
    if (w === 390) {
      const bgRes = await page.evaluate((bgs) => {
        const LB = (window.__lbBg && window.__lbBg.LB) || {};
        const c = document.createElement("canvas"); c.width = 320; c.height = 200;
        const g = c.getContext("2d"), bad = [];
        for (const id of bgs) {
          const def = LB[id];
          if (!def || typeof def.draw !== "function") { bad.push("manca " + id); continue; }
          try {
            g.clearRect(0, 0, 320, 200);
            const ok = window.renderDetailedBg ? window.renderDetailedBg(id, g, 320, 200, 12) : (def.draw(g, 320, 200, 12), true);
            if (!ok) bad.push(id + " render=false");
            const h = Array.isArray(def.hot) ? def.hot : [];
            if (h.length < 3) bad.push(id + " hot=" + h.length);
          } catch (e) { bad.push(id + " err=" + e.message); }
        }
        return bad;
      }, BGS);
      if (bgRes.length) errors.push("sfondi ci_*: " + bgRes.join(", "));
    }

    // Raggiungibilità completa delle 3 zone del cap.1
    for (const z of Z1) {
      await go(page, z);
      const bad = await L.reachAll(page, z);
      if (bad.length) errors.push(z + " (" + w + "px): " + bad.join(", "));
    }
  } catch (e) { errors.push(e.message.slice(0, 260)); }
  L.check(`Circo Zampanò · avvio fresco e zone cap.1 (${w} px)`, errors);
  await browser.close();
}

async function allChaptersZones(w) {
  const mk = (ch) => ({ v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, ch3: 1, ch4: 1 }, ch, max: ch, done: { 1: "ok", 2: "ok", 3: "ok" }, step: { 1: 4, 2: 4, 3: 4, 4: 0 }, flags: {} });
  for (const [ch, list] of [[2, Z2], [3, Z3], [4, Z4]]) {
    const { browser, page, errors } = await start(w, mk(ch));
    try {
      for (const z of list) {
        await go(page, z);
        const bad = await L.reachAll(page, z);
        if (bad.length) errors.push(z + ": " + bad.join(", "));
      }
    } catch (e) { errors.push(e.message.slice(0, 220)); }
    L.check(`Circo Zampanò · zone cap.${ch} (${w} px)`, errors);
    await browser.close();
  }
}

// 2. Meccanica comune K.billboard (sblocco, 3 slot, niente doppioni, sinergie + dialogo, interfaccia al leggio)
async function billboardTest() {
  const { browser, page, errors } = await start(390, { v: 1, diffSet: true, intro: { ch1: 1 } });
  try {
    const r = await page.evaluate((k) => {
      const K = eval(k), B = K.billboard, out = {};
      B.clear();
      B.unlock("trapezio"); B.unlock("fanfara"); B.unlock("pesi"); B.unlock("clave");
      out.list = B.list();
      B.assign(0, "trapezio");
      B.assign(1, "trapezio"); // deve spostarlo senza duplicarlo
      out.dedup = B.lineup().slice();
      B.assign(0, "trapezio");
      B.assign(1, "fanfara");
      B.assign(2, "clave");
      out.syns = B.activeSynergies().map((s) => s.id);
      out.buffs = B.activeBuffs();
      out.applause = B.applause();
      out.seenCount = B.seenSynergyCount();
      return out;
    }, K_);
    if (r.list.length !== 4) errors.push("sblocco numeri: " + JSON.stringify(r.list));
    if (r.dedup.filter((x) => x === "trapezio").length !== 1) errors.push("duplicato in scaletta: " + JSON.stringify(r.dedup));
    if (!r.syns.includes("aria_musica") || !r.syns.includes("gran_parata")) errors.push("sinergie attive errate: " + JSON.stringify(r.syns));
    if (!r.buffs.includes("piuma") || !r.buffs.includes("monete") || !r.buffs.includes("calamita")) errors.push("buff attivi errati: " + JSON.stringify(r.buffs));
    if (!(r.applause >= 12) || r.seenCount < 2) errors.push("applausi/sinergie viste: " + JSON.stringify(r));

    // Apertura reale del Cartellone dal leggio A nel tendone
    await go(page, "ci_tendone", 12, 3);
    await L.goAct(page, 12, 2);
    await L.advance(page, ["Chiudi", "Torna"]).catch(() => {});
    await L.shot(page, "ci_tendone_390");
  } catch (e) { errors.push(e.message.slice(0, 260)); }
  L.check("Circo Zampanò · Cartellone e Sinergie (K.billboard)", errors);
  await browser.close();
}

// 3. Motore reale window.__scorri col kit «circo»: trampolino T, piroetta aerea, anello del trapezio O e tutti i 4 boss circensi
async function scorriCircoEngine() {
  const { browser, page, errors } = await L.setup({ w: 800, h: 450, ...MOD });
  try {
    const r = await page.evaluate(async () => {
      window.__noSfx = 1;
      const LV = window.__zampanoLV, sl = (ms) => new Promise((r) => setTimeout(r, ms)), out = {};
      const open = (id, buffs, cb) => {
        window.__scorri.start({ level: Object.assign({ id, kit: "circo" }, LV[id]), buffs: buffs || ["piuma", "monete", "vita", "calamita"], bonus: 1, tutorial: false, onDone: cb || (() => {}) });
        return window.__scorri.state;
      };
      // Pista 1: verifica pulsante 🎪, buff vita/monete, conteggio trampolini e anelli, rimbalzo trampolino, piroetta aerea e anello O
      let s = open("pista1");
      out.kit = s.kit;
      out.btn = (document.querySelector('#scOv [data-k="K"]') || {}).innerText;
      out.counts = s.counts;
      out.startCoins = s.coins;
      out.startMaxHp = s.hero.maxHp;

      // Calpesta il primo trampolino T in pista1 -> rimbalza verso l'alto
      const tr0 = s.tramps[0];
      s.warp(tr0.x, tr0.y - 16);
      let minVyTramp = 0;
      for (let t = 0; t < 25; t++) { s.tick(1); minVyTramp = Math.min(minVyTramp, s.hero.vy); }
      out.minVyTramp = +minVyTramp.toFixed(2);

      // In aria lontano da anelli: premi K -> parte la piroetta aerea (twirl > 0)
      s.warp(10 * 16, 5 * 16);
      s.press("K", true); s.tick(2);
      out.twirl = s.twirl;
      s.press("K", false); s.tick(20);

      // Vicino al primo anello del trapezio O in pista1: premi K in aria -> slancio verso l'alto
      const rg0 = s.rings[0];
      s.warp(rg0.x, rg0.y + 8);
      s.press("K", true); s.tick(2);
      out.ringVy = +s.hero.vy.toFixed(2);
      s.press("K", false);
      s.finish(false); await sl(40);

      // Verifica che tutti e 4 i boss circensi espongano la finestra vulnerabile e siano battibili saltandogli in testa
      out.bosses = {};
      for (const bid of ["ercole", "frusta", "specchio", "orloff"]) {
        let res = null;
        s = open(bid, ["piuma", "vita"], (x) => { res = x; });
        let sawVul = false;
        for (let t = 0; t < 6000 && !res; t++) {
          const b = s.boss, h = s.hero; if (!b) break;
          if (b.vul && !(b.hitT > 0)) {
            sawVul = true;
            if (h.ground || Math.abs(h.x - b.x) > 5 || h.y > b.y - b.h + 8) s.warp(b.x, b.y - b.h - 12);
          } else {
            if (h.y > 56 || Math.abs(h.x - 200) > 16) s.warp(200, 44);
          }
          s.tick(1);
          if (s.phase === "win") { s.finish(true); break; }
          if (s.phase === "ko") { s.finish(false); break; }
        }
        await sl(30);
        out.bosses[bid] = { win: !!(res && res.win), sawVul };
      }
      return out;
    });

    if (r.kit !== "circo" || r.btn !== "🎪") errors.push("kit/pulsante circo errato: " + JSON.stringify([r.kit, r.btn]));
    if (!(r.counts && r.counts.tramps >= 2 && r.counts.rings >= 2)) errors.push("trampolini/anelli non letti in pista1: " + JSON.stringify(r.counts));
    if (!(r.startCoins >= 5) || !(r.startMaxHp >= 5)) errors.push("buff monete/vita non applicati: " + JSON.stringify([r.startCoins, r.startMaxHp]));
    if (!(r.minVyTramp < -6.5)) errors.push("il trampolino T non fa rimbalzare in alto: " + r.minVyTramp);
    if (!(r.twirl > 0)) errors.push("la piroetta aerea non parte col tasto K");
    if (!(r.ringVy < -6)) errors.push("l'anello del trapezio O non dà slancio: " + r.ringVy);
    for (const [bid, br] of Object.entries(r.bosses || {})) {
      if (!br.sawVul || !br.win) errors.push("capo " + bid + " non vulnerabile o non battibile: " + JSON.stringify(br));
    }
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Circo Zampanò · motore scorri kit «circo» e 4 capi", errors);
  await browser.close();
}

// 4. Flusso narrativo completo Capitoli 1 -> 4 + Dossier + scelta a tempo + tutti i 4 finali (carovana, stabile, imperiale, stellare)
async function fullSagaAndEndings() {
  const { browser, page, errors } = await start(390, { v: 1, diffSet: true, intro: { ch1: 1 } });
  await stubLevel(page);
  await L.stubMatch(page, true);
  try {
    // --- CAPITOLO 1 ---
    await go(page, "ci_carro", 8, 9);
    await L.talk(page, "ci_miranda"); await L.advance(page);
    await L.goAct(page, 13, 2); await L.advance(page); // bauletto con zucchero filato
    await go(page, "ci_tendone", 8, 9);
    await L.talk(page, "ci_zampano"); await L.advance(page);
    await go(page, "ci_spiazzo", 15, 15);
    await L.talk(page, "ci_pippo"); await L.advance(page, ["Partitella nello spiazzo"]); await L.advance(page).catch(() => {});
    await L.talk(page, "ci_tonio"); await L.advance(page, ["Suona per i bambini"]);
    await go(page, "ci_tendone", 8, 4);
    await L.goAct(page, 7, 1); await L.advance(page, ["Entra in pista"]); await L.advance(page).catch(() => {});
    await L.goAct(page, 7, 1); await L.advance(page, ["Affronta Ercole", "Resto con chi divide"]);
    const i1 = await L.info(page);
    if (!i1.done[1]) errors.push("Cap.1 non completato: " + JSON.stringify(i1));
    await page.evaluate(() => window.T_.click("Inizia il Capitolo 2|Continua la storia"));
    await page.waitForTimeout(150);
    await L.advance(page);

    // --- CAPITOLO 2 (Dossier 4 indizi + 2 contraddizioni) ---
    await go(page, "ci_fiera", 15, 14);
    await L.talk(page, "ci_zampano"); await L.advance(page);
    await L.talk(page, "ci_pippo"); await L.advance(page); // avanza anche l'orologio a Sera
    await L.talk(page, "ci_wanda"); await L.advance(page);
    await go(page, "ci_serraglio", 8, 8);
    await L.talk(page, "ci_ercole"); await L.advance(page);
    await L.goAct(page, 3, 2); await L.advance(page); // prova cesoia + sblocca step 2
    await go(page, "ci_biglietteria", 8, 8);
    await L.goAct(page, 3, 2); await L.advance(page); // prova ricevuta

    // Collega le due contraddizioni nel Dossier
    const dos = await page.evaluate((k) => {
      const K = eval(k);
      K.dossier.pair("cavo", "cesoia", "ricevuta");
      K.dossier.pair("cavo", "turno_pippo", "testimone_wanda");
      return { items: K.dossier.list("cavo").length, found: K.dossier.found("cavo"), solid: K.dossier.solid("cavo") };
    }, K_);
    if (dos.items !== 4 || dos.found !== 2) errors.push("Dossier cavo incompleto: " + JSON.stringify(dos));

    await go(page, "ci_fiera", 14, 3);
    await L.goAct(page, 14, 1); await L.advance(page, ["Insegui tra i carri"]); await L.advance(page).catch(() => {});
    await L.goAct(page, 14, 1); await L.advance(page, ["Affronta Monsieur Frusta", "Mostriamo a Bacci"]);
    const i2 = await L.info(page);
    if (!i2.done[2]) errors.push("Cap.2 non completato: " + JSON.stringify(i2));
    await page.evaluate(() => window.T_.click("Inizia il Capitolo 3|Continua la storia"));
    await page.waitForTimeout(150);
    await L.advance(page);

    // --- CAPITOLO 3 (scelta a tempo + 6 numeri nel Cartellone + almeno 2 sinergie) ---
    await go(page, "ci_retro", 15, 14);
    await L.talk(page, "ci_orloff"); await L.advance(page, ["Balza sul picchetto"]);
    await go(page, "ci_sartoria", 8, 8);
    await L.talk(page, "ci_wanda"); await L.advance(page);
    await L.talk(page, "ci_miranda"); await L.advance(page);
    // Scopri almeno 2 sinergie nel Cartellone e porta Lila e Tonio a lv >= 2 (8 punti)
    await page.evaluate((k) => {
      const K = eval(k), B = K.billboard;
      B.assign(0, "trapezio"); B.assign(1, "fanfara"); B.assign(2, "clave");
      B.assign(0, "tarocchi"); B.assign(1, "filo"); B.assign(2, "pesi");
      K.rel.add("ci_lila", 8); K.rel.add("ci_tonio", 8);
    }, K_);
    await go(page, "ci_cupola", 8, 8);
    await L.talk(page, "ci_lila"); await L.advance(page);
    await L.goAct(page, 7, 1); await L.advance(page, ["Vola nell'intreccio"]); await L.advance(page).catch(() => {});
    await L.goAct(page, 7, 1); await L.advance(page, ["Affronta Il Grande Specchio", "Lo piego in un aeroplanino"]);
    const i3 = await L.info(page);
    if (!i3.done[3]) errors.push("Cap.3 non completato: " + JSON.stringify(i3));
    await page.evaluate(() => window.T_.click("Inizia il Capitolo 4|Continua la storia"));
    await page.waitForTimeout(150);
    await L.advance(page);

    // --- CAPITOLO 4 (verdetto a Bacci + conferma Cartellone a 3 slot + tutti i 4 finali) ---
    await go(page, "ci_ingresso", 15, 14);
    await L.talk(page, "ci_bacci");
    await L.advance(page, ["Barone Orloff"]);

    await go(page, "ci_arena", 8, 8);
    await L.talk(page, "ci_zampano");
    await L.advance(page, ["Conferma la Scaletta"]);

    await L.goAct(page, 7, 1); await L.advance(page, ["Apri il sipario"]); await L.advance(page).catch(() => {});

    // Salva uno snapshot appena prima di battere Orloff per sbloccare tutti e 4 i finali!
    const snap = await page.evaluate(() => localStorage.getItem("ali-di-rondine.zampano"));
    const choices = [
      ["stellare", "Salto delle Rondini d'Oro"],
      ["carovana", "Ripartire liberi"],
      ["stabile", "Fondare il Teatro Tenda"],
      ["imperiale", "Firmare la fusione"]
    ];
    const unlockedEnds = new Set();
    for (const [eid, label] of choices) {
      await page.evaluate(([s, ends]) => {
        const d = JSON.parse(s);
        d.ends = ends;
        localStorage.setItem("ali-di-rondine.zampano", JSON.stringify(d));
        window.__zampano.open();
      }, [snap, [...unlockedEnds]]);
      await page.waitForTimeout(250);
      await page.evaluate(() => window.T_.click("Continua la storia|Inizia il Capitolo 4"));
      await page.waitForTimeout(150);
      await L.advance(page).catch(() => {});
      await go(page, "ci_arena", 7, 2);
      await L.goAct(page, 7, 1);
      await L.advance(page, ["Affronta il Barone Orloff", label]);
      await page.waitForTimeout(250);
      const endsNow = await page.evaluate(() => window.__zampano.endings().filter((e) => e.found).map((e) => e.id));
      endsNow.forEach((x) => unlockedEnds.add(x));
      if (!unlockedEnds.has(eid)) errors.push("finale non sbloccato: " + eid + " -> " + JSON.stringify(endsNow));
    }

    // 5. Verifica integrazioni: Salone, Sala Giochi (cabinato pista + boss), Squadra dei Sogni, Guardaroba e Carte del Destino
    const eco = await page.evaluate(() => {
      window.__salone.open(() => {});
      const card = !!document.querySelector('.salOv [data-saga="zampano"], .salOv [data-id="zampano"]') || document.querySelector(".salOv").innerText.includes("Il Circo Zampanò");
      window.__salone.salaGiochi(() => {});
      const mEl = document.querySelector('.salOv [data-m="pista"]');
      const mOpen = !!(mEl && mEl.querySelector(".pe").textContent !== "🔒" && mEl.classList.contains("gold"));
      window.__sogni.open(() => {});
      const own = window.__sogni._load().own;
      const cardsOk = ["ci_tonio", "ci_ercole", "ci_lila", "ci_zampano", "ci_orloff"].every((c) => own.includes(c));
      const cosOwned = window.__borgoApi.cosOwned();
      const cosOk = ["ci_c1", "ci_c2", "ci_c3", "ci_c4"].every((c) => cosOwned.includes(c));
      return { card, mOpen, cardsOk, cosOk };
    });
    if (!eco.card) errors.push("Il Circo Zampanò non compare nel Salone");
    if (!eco.mOpen) errors.push("Cabinato «pista» non aperto/oro in Sala Giochi");
    if (!eco.cardsOk) errors.push("Carte di Zampanò non tutte sbloccate in Squadra dei Sogni");
    if (!eco.cosOk) errors.push("Cosmetici ci_c1..c4 non tutti sbloccati");
    await L.shot(page, "ci_finale_salone_390");
  } catch (e) { errors.push(e.message.slice(0, 320)); }
  L.check("Circo Zampanò · capitoli 1-4, 4 finali ed ecosistema", errors);
  await browser.close();
}

(async () => {
  for (const w of [390, 320, 1000]) await freshAndZones(w);
  await allChaptersZones(390);
  await billboardTest();
  await scorriCircoEngine();
  await fullSagaAndEndings();
})().catch((e) => { console.error("✗ zampano:", e.message); process.exit(1); });
