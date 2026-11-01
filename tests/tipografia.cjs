// tests/tipografia.cjs — «La Tipografia di Mezzanotte · L'Ultima Edizione»:
// 1. Avvio fresco dal menu della saga (390, 320, 1000 px), 14 sfondi animati tp_* con ≥3 punti cliccabili e 12 zone raggiungibili (L.reachAll);
// 2. Meccanica comune K.press (Il Bancone d'Impaginazione / Prima Pagina: 3 tagli, edizioni, copie, Verità/Tiratura, buff e civette dinamiche);
// 3. Motore originale 2D window.__flash68 («Flash & Contropiede '68»: movimento, Mirino d'Oro + Flash al magnesio, Rotativa 3/3, ombrelli del Capo e partita intera senza stalli);
// 4. Capitoli 1-4 completi, scelta a tempo alla telescrivente (sia scadenza K.timedFire sia scelta), Dossier + Verdetto pubblico e tutti e 4 i finali (nando, cooperativa, settantamila, riunita);
// 5. Ecosistema: Salone, Sala Giochi (cabinato flash68 + corona boss), Squadra dei Sogni (7 carte tp_* + motore flash68), Carte del Destino (mazzo tp + ospite clara), Guardaroba (tp_c1..c4 + sm_tipografia) e ospite nel Borgo (tp_tino).
const L = require("./lib.cjs");
const MOD = { mod: "__tipografia", key: "ali-di-rondine.tipografia" };
const K_ = "window.__tipografia._dbg.K";

const Z1 = ["tp_edicole", "tp_linotype", "tp_barsport"];
const Z2 = ["tp_acacie", "tp_spogliatoio", "tp_cameraoscura"];
const Z3 = ["tp_galleria", "tp_legatoria", "tp_stampamoderna"];
const Z4 = ["tp_largo", "tp_consiglio", "tp_rotativa"];
const BGS = [
  "tp_titolo", "tp_edicole", "tp_linotype", "tp_barsport",
  "tp_acacie", "tp_spogliatoio", "tp_cameraoscura",
  "tp_galleria", "tp_stampamoderna", "tp_legatoria",
  "tp_largo", "tp_consiglio", "tp_rotativa", "tp_finale"
];

async function go(p, z, x, y) {
  await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]);
  await p.waitForTimeout(420);
  await L.advance(p).catch(() => {});
}

async function start(w, save, prefs) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => { window.__noSfx = 1; window.__tipografia.open(); });
  await r.page.waitForTimeout(420);
  if (save) await L.advance(r.page, prefs || []).catch(() => {});
  return r;
}

const stubFlash = (p) => p.evaluate(() => {
  window.__flash68.start = (o) => {
    (window.__flLog = window.__flLog || []).push({
      venue: o.venue,
      boss: !!o.boss,
      umbrellas: !!o.umbrellas,
      buffs: o.buffs || []
    });
    const cb = o.onDone || o.done;
    queueMicrotask(() => cb && cb({ win: true, a: 3, b: 1, score: [3, 1], perfectShots: 3, dazzled: 4, boss: !!o.boss }));
    return true;
  };
});

// 1. Avvio fresco + 14 sfondi tp_* + raggiungibilità di tutte le zone del Cap.1 (390, 320, 1000 px)
async function freshAndZones(w) {
  const { browser, page, errors } = await start(w, null);
  try {
    await page.evaluate(() => window.T_.click("^Inizia la storia"));
    await page.waitForTimeout(150);
    await L.advance(page, ["^Normale"]);
    const z0 = await L.zone(page);
    if (z0 !== "tp_edicole") errors.push("zona iniziale attesa tp_edicole, trovata: " + z0);
    if (w === 390) await L.shot(page, "tp_edicole_390");
    if (w === 320) await L.shot(page, "tp_edicole_320");

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
            const ok = window.renderDetailedBg ? window.renderDetailedBg(id, g, 320, 200, 14) : (def.draw(g, 320, 200, 14), true);
            if (!ok) bad.push(id + " render=false");
            const h = Array.isArray(def.hot) ? def.hot : [];
            if (h.length < 3) bad.push(id + " hot=" + h.length);
          } catch (e) { bad.push(id + " err=" + e.message); }
        }
        return bad;
      }, BGS);
      if (bgRes.length) errors.push("sfondi tp_*: " + bgRes.join(", "));
    }

    for (const z of Z1) {
      await go(page, z);
      const bad = await L.reachAll(page, z);
      if (bad.length) errors.push(z + " (" + w + "px): " + bad.join(", "));
    }
  } catch (e) { errors.push(e.message.slice(0, 280)); }
  L.check(`Tipografia · avvio fresco e zone cap.1 (${w} px)`, errors);
  await browser.close();
}

async function allChaptersZones(w) {
  const mk = (ch) => ({
    v: 1, diffSet: true,
    intro: { ch1: 1, ch2: 1, ch3: 1, ch4: 1 },
    ch, max: ch,
    done: { 1: "ok", 2: "ok", 3: "ok" },
    step: { 1: 4, 2: 4, 3: 4, 4: 0 },
    flags: {}
  });
  for (const [ch, list] of [[2, Z2], [3, Z3], [4, Z4]]) {
    const { browser, page, errors } = await start(w, mk(ch));
    try {
      for (const z of list) {
        await go(page, z);
        if (w === 390 && z === list[0]) await L.shot(page, z + "_390");
        const bad = await L.reachAll(page, z);
        if (bad.length) errors.push(z + ": " + bad.join(", "));
      }
    } catch (e) { errors.push(e.message.slice(0, 240)); }
    L.check(`Tipografia · zone cap.${ch} (${w} px)`, errors);
    await browser.close();
  }
}

// 2. Meccanica comune K.press (Il Bancone d'Impaginazione / Prima Pagina)
async function pressMechanicTest() {
  const { browser, page, errors } = await start(390, { v: 1, diffSet: true, intro: { ch1: 1 } });
  try {
    const r = await page.evaluate((k) => {
      const K = eval(k), P = K.press, out = {};
      P.clear();
      P.unlock("lead_v1", true);
      P.unlock("lead_t1", true);
      P.unlock("photo_1", true);
      P.unlock("col_1", true);
      out.unlocked = P.list();
      out.wrongSlot = P.assign("lead", "photo_1"); // deve rifiutare taglio errato
      P.assign("lead", "lead_v1");
      P.assign("photo", "photo_1");
      P.assign("col", "col_1");
      out.ready = P.ready();
      const v0 = K.stat("verita"), c0 = K.stat("copie");
      const ed1 = P.publish(1);
      out.ed1 = ed1;
      out.veritaDelta = K.stat("verita") - v0;
      out.copieDelta = K.stat("copie") - c0;
      out.buffs = P.activeBuffs();
      out.headline = P.latestHeadline();
      out.pubHeadline = window.__tipografia.latestHeadline();
      out.journalHas = P.html().includes("Numero 1");
      return out;
    }, K_);

    if (r.unlocked.length !== 4) errors.push("sblocco pezzi errato: " + JSON.stringify(r.unlocked));
    if (r.wrongSlot !== false) errors.push("assign ha accettato uno slot sbagliato");
    if (!r.ready || !r.ed1) errors.push("edizione 1 non pronta/pubblicata: " + JSON.stringify(r));
    if (!(r.veritaDelta >= 2) || !(r.copieDelta >= 7)) errors.push("pesi/copie non aggiornati alla stampa: " + JSON.stringify(r));
    if (!r.buffs.includes("flash_extra") || !r.buffs.includes("scatto_strilloni")) {
      errors.push("buff tipografici mancanti: " + JSON.stringify(r.buffs));
    }
    if (!r.headline.includes("ACACIE: PERIZIA SENZA SOPRALLUOGO") || r.pubHeadline !== r.headline) {
      errors.push("titolo dinamico non propagato: " + JSON.stringify([r.headline, r.pubHeadline]));
    }
    if (!r.journalHas) errors.push("K.press.html() non elenca l'archivio nel diario");

    // Verifica apertura reale del Bancone di Piombo (A) in Sala Linotype e civetta dinamica (P)
    await go(page, "tp_linotype", 6, 4);
    await L.goAct(page, 6, 3);
    await L.shot(page, "tp_bancone_press_390");
    await L.advance(page, ["Indietro"]);
    await go(page, "tp_linotype", 10, 4);
    await L.goAct(page, 10, 3);
    const txt = await page.evaluate(() => (document.getElementById("text") || {}).innerText || "");
    if (!txt.includes("ACACIE: PERIZIA SENZA SOPRALLUOGO")) errors.push("civetta P non legge il titolo dinamico: " + txt);
    await L.advance(page);
  } catch (e) { errors.push(e.message.slice(0, 280)); }
  L.check("Tipografia · Bancone d'Impaginazione e civette dinamiche (K.press)", errors);
  await browser.close();
}

// 3. Motore reale window.__flash68 («Flash & Contropiede '68»): Mirino d'Oro, Flash, Rotativa 3/3, Ombrelli del Capo, proporzioni e zero stalli
async function flash68EngineTest() {
  for (const w of [390, 320, 1000]) {
    const { browser, page, errors } = await L.setup({ w, h: w === 1000 ? 640 : 780, ...MOD });
    try {
      const r = await page.evaluate(async (vw) => {
        window.__noSfx = 1;
        const sl = (ms) => new Promise((res) => setTimeout(res, ms)), out = {};

        let done1 = null;
        window.__flash68.start({
          venue: "edicole",
          tutorial: false,
          durSec: 16,
          buffs: ["effetto_piombo", "flash_extra", "scatto_strilloni", "muro_calce"],
          onDone: (x) => { done1 = x; }
        });
        const s = window.__flash68.state;
        const cv = document.querySelector("#f68Cv");
        const rect = cv.getBoundingClientRect();
        out.ratioDiff = Math.abs((rect.width / rect.height) - (360 / 220));
        out.fitsViewport = rect.width <= vw + 1 && rect.height > 80;

        // 1) Movimento del controllato
        const x0 = s.ctrl.x;
        s.pressMove(1, 0, 14);
        s.tick(14);
        out.movedDx = +(s.ctrl.x - x0).toFixed(2);

        // 2) Porta un rivale e il pallone dentro il Riquadro d'Obiettivo dorato di Clara e scatta 📸 FLASH
        s.ball.owner = s.ctrl;
        s.ctrl.x = s.clara.viewX - 4;
        s.ctrl.y = s.clara.viewY;
        s.ball.x = s.clara.viewX;
        s.ball.y = s.clara.viewY;
        s.away[1].x = s.clara.viewX + 6;
        s.away[1].y = s.clara.viewY;
        s.away[1].stun = 0;
        s.actFlash();
        out.dazzledStun = s.away[1].stun;
        out.perfectAfterFlash = s.perfectShots;
        out.rotativaAfter1 = s.rotativa;

        // 3) Carica 3/3 segmenti della Rotativa e spara il Tiro Edizione Straordinaria
        s.setRotativa(3);
        s.ball.owner = s.ctrl;
        s.ctrl.x = 250;
        s.ctrl.y = 116;
        s.actShoot();
        out.superShot = !!s.ball.super && s.rotativa === 0 && s.ball.vx > 5;

        // 4) Simula l'intera partita fino alla conclusione naturale (incluso eventuale Golden Goal / spareggio: mai stallo!)
        for (let i = 0; i < 3200 && s.phase === "play"; i++) {
          if (i % 45 === 0 && s.ball.owner && s.ball.owner.team === 0) s.actShoot();
          s.tick(1);
        }
        const endBtn = document.getElementById("f68EndBtn");
        if (endBtn) endBtn.click();
        await sl(30);
        out.finished1 = !!done1 && !s.active;

        // 5) Verifica meccanica del Capo Finale (ombrelli neri anti-flash in stadio: parata frontale vs smistamento laterale)
        if (vw === 390) {
          window.__flash68.start({
            venue: "stadio",
            boss: true,
            umbrellas: true,
            tutorial: false,
            durSec: 20,
            onDone: () => {}
          });
          const sb = window.__flash68.state;
          sb.ball.owner = sb.ctrl;
          sb.ctrl.x = sb.clara.viewX - 6;
          sb.ctrl.y = sb.clara.viewY;
          sb.ball.x = sb.clara.viewX - 2;
          sb.ball.y = sb.clara.viewY;
          sb.away[1].x = sb.clara.viewX + 6;
          sb.away[1].y = sb.clara.viewY;
          sb.away[1].vy = 0;
          sb.away[1].stun = 0;
          // Senza passaggio recente l'ombrello nero para il lampo frontale
          sb.actFlash();
          out.bossBlockedStun = sb.away[1].stun;
          // Dopo ricarica del rullino + ⚽ PASSA rapido l'ombrello resta scoperto sul fianco e il Flash abbaglia in pieno!
          sb.tick(145);
          sb.ball.owner = sb.home[2];
          sb.home[2].x = sb.clara.viewX - 28;
          sb.home[2].y = sb.clara.viewY + 6;
          sb.home[3].x = sb.clara.viewX + 4;
          sb.home[3].y = sb.clara.viewY;
          sb.actPass();
          sb.ball.x = sb.clara.viewX;
          sb.ball.y = sb.clara.viewY;
          sb.away[1].x = sb.clara.viewX + 6;
          sb.away[1].y = sb.clara.viewY;
          sb.away[1].stun = 0;
          sb.actFlash();
          out.bossFlankedStun = sb.away[1].stun;
          sb.finish(2, 0);
        }
        return out;
      }, w);

      if (w === 390) {
        await page.evaluate(() => {
          window.__flash68.start({ venue: "stadio", boss: true, umbrellas: true, tutorial: false, onDone: () => {} });
        });
        await L.shot(page, "tp_flash68_stadio_390");
        await page.evaluate(() => window.__flash68.finishTest(2, 0));
      }

      if (r.ratioDiff > 0.06 || !r.fitsViewport) errors.push(`proporzioni canvas errate (${w}px): ` + JSON.stringify(r));
      if (!(r.movedDx > 4)) errors.push("il calciatore non risponde ai comandi di movimento: " + r.movedDx);
      if (!(r.dazzledStun >= 80) || r.perfectAfterFlash < 1 || r.rotativaAfter1 < 1) {
        errors.push("il Flash di Clara non abbaglia / non carica la Rotativa: " + JSON.stringify(r));
      }
      if (!r.superShot) errors.push("il Tiro Edizione Straordinaria non parte a Rotativa 3/3");
      if (!r.finished1) errors.push("la partita non termina da sola entro il tempo massimo (stallo)");
      if (w === 390 && (r.bossBlockedStun !== 0 || !(r.bossFlankedStun >= 80))) {
        errors.push("meccanica ombrelli del Capo non funzionante: " + JSON.stringify([r.bossBlockedStun, r.bossFlankedStun]));
      }
    } catch (e) { errors.push(e.message.slice(0, 300)); }
    L.check(`Tipografia · motore Flash & Contropiede '68 (${w} px)`, errors);
    await browser.close();
  }
}

// 4. Capitoli 1 -> 4 completi + scelta a tempo + Dossier/Verdetto + tutti e 4 i finali + Ecosistema
async function fullSagaEndingsAndEcosystem() {
  const { browser, page, errors } = await start(390, { v: 1, diffSet: true, intro: { ch1: 1 } });
  await stubFlash(page);
  await L.stubMatch(page, true);
  try {
    // --- CAPITOLO 1 ---
    await go(page, "tp_edicole", 19, 11);
    await L.goAct(page, 19, 12); await L.advance(page); // loot caldarroste
    await go(page, "tp_linotype", 8, 8);
    await L.talk(page, "tp_ada"); await L.advance(page);
    await go(page, "tp_edicole", 11, 14);
    await L.talk(page, "tp_clara"); await L.advance(page);
    await go(page, "tp_barsport", 6, 6);
    await L.talk(page, "tp_beppe"); await L.advance(page);
    await go(page, "tp_linotype", 6, 4);
    await L.goAct(page, 6, 3);
    await L.advance(page, ["Visto, si stampi"]);
    await go(page, "tp_edicole", 27, 17);
    await L.goAct(page, 28, 17);
    await L.advance(page, ["Gioca Flash & Contropiede", "Pubblicheremo ogni riga"]);
    const i1 = await L.info(page);
    if (!i1.done[1]) errors.push("Cap.1 non completato: " + JSON.stringify(i1));
    await page.evaluate(() => window.T_.click("Inizia il Capitolo 2|Continua la storia"));
    await page.waitForTimeout(150);
    await L.advance(page);

    // --- CAPITOLO 2 (Trave segata + Rullino di Nando + Sviluppo Camera Oscura + Numero 2) ---
    await go(page, "tp_acacie", 12, 11);
    await L.goAct(page, 11, 11); await L.advance(page); // perizia_falsa
    await go(page, "tp_spogliatoio", 7, 7);
    await L.talk(page, "tp_beppe"); await L.advance(page); // tp_rullino + col_2
    await L.goAct(page, 13, 3); await L.advance(page); // bauletto monete
    await go(page, "tp_cameraoscura", 8, 7);
    await L.talk(page, "tp_clara"); await L.advance(page); // sviluppo rullino Nando + link Dossier 1
    await go(page, "tp_acacie", 17, 11);
    await L.talk(page, "tp_livia");
    await L.advance(page, ["Tutela la fonte di Livia"]);
    await go(page, "tp_acacie", 15, 11);
    await L.goAct(page, 15, 10);
    await L.advance(page, ["Visto, si stampi"]);
    await go(page, "tp_acacie", 27, 17);
    await L.goAct(page, 28, 17);
    await L.advance(page, ["Gioca Flash & Contropiede"]);
    const i2 = await L.info(page);
    if (!i2.done[2]) errors.push("Cap.2 non completato: " + JSON.stringify(i2));
    await page.evaluate(() => window.T_.click("Inizia il Capitolo 3|Continua la storia"));
    await page.waitForTimeout(150);
    await L.advance(page);

    // --- CAPITOLO 3 (Rogito 1921 + Scelta a tempo sulla telescrivente + Numero 3) ---
    await go(page, "tp_legatoria", 12, 4);
    await L.goAct(page, 12, 3); await L.advance(page); // atto_1921 + scena Goffredo
    await go(page, "tp_stampamoderna", 13, 4);

    // Verifica anche lo scadere del timer con K.timedFire() su uno snapshot volatile, poi scegliamo l'opzione silenziosa
    const preTimedSnap = await page.evaluate(() => localStorage.getItem("ali-di-rondine.tipografia"));
    await L.goAct(page, 13, 3);
    await page.waitForTimeout(120);
    await page.evaluate((k) => eval(k).timedFire(), K_);
    await L.advance(page);
    const timedFiredOk = await page.evaluate((k) => eval(k).F.is("tp_c3_velina") && !eval(k).F.is("tp_c3_clean"), K_);
    if (!timedFiredOk) errors.push("la scadenza della scelta a tempo (timedFire) non ha scelto l'opzione predefinita");

    // Ripristina appena prima della telescrivente per testare la macro silenziosa
    await page.evaluate((s) => { localStorage.setItem("ali-di-rondine.tipografia", s); window.__tipografia.open(); }, preTimedSnap);
    await page.waitForTimeout(220);
    await page.evaluate(() => window.T_.click("Continua la storia|Inizia il Capitolo 3"));
    await page.waitForTimeout(150);
    await L.advance(page).catch(() => {});
    await stubFlash(page);
    await go(page, "tp_stampamoderna", 13, 4);
    await L.goAct(page, 13, 3);
    await L.advance(page, ["Scatta una macro silenziosa"]);

    await go(page, "tp_galleria", 14, 13);
    await L.talk(page, "tp_ada");
    await L.advance(page, ["Cestina i pettegolezzi"]);
    await go(page, "tp_galleria", 15, 13);
    await L.goAct(page, 15, 12);
    await L.advance(page, ["Visto, si stampi"]);
    await go(page, "tp_galleria", 27, 17);
    await L.goAct(page, 28, 17);
    await L.advance(page, ["Gioca Flash & Contropiede"]);
    const i3 = await L.info(page);
    if (!i3.done[3]) errors.push("Cap.3 non completato: " + JSON.stringify(i3));
    await page.evaluate(() => window.T_.click("Inizia il Capitolo 4|Continua la storia"));
    await page.waitForTimeout(150);
    await L.advance(page);

    // --- CAPITOLO 4 (Verdetto pubblico in Consiglio + Rotativa Numero 4 + tutti e 4 i finali!) ---
    const dosCheck = await page.evaluate((k) => {
      const K = eval(k);
      K.rel.add("tp_clara", 12, true);
      K.rel.add("tp_goffredo", 12, true);
      return { items: K.dossier.list("acacie").length, found: K.dossier.found("acacie"), solid: K.dossier.solid("acacie") };
    }, K_);
    if (dosCheck.items !== 4 || dosCheck.found !== 2) errors.push("Dossier acacie incompleto prima del Consiglio: " + JSON.stringify(dosCheck));

    await go(page, "tp_consiglio", 7, 6);
    await L.talk(page, "tp_ada");
    await L.advance(page, ["Pronuncia il Verdetto", "Il rogito 1921 e il sabotaggio"]);

    await go(page, "tp_rotativa", 5, 7);
    await L.talk(page, "tp_goffredo");
    await L.advance(page, ["Avvia la Marinoni"]);

    const snapBeforeBoss = await page.evaluate(() => localStorage.getItem("ali-di-rondine.tipografia"));
    const endChoices = [
      ["nando", "Apri il telegramma dell'alba"],
      ["cooperativa", "Fonda la Cooperativa Popolare"],
      ["settantamila", "Rilancia la rotativa Marinoni"],
      ["riunita", "Firma il Patto Civico"]
    ];
    const unlockedEnds = new Set();
    for (const [eid, label] of endChoices) {
      await page.evaluate(([s, ends]) => {
        const d = JSON.parse(s);
        d.ends = ends;
        localStorage.setItem("ali-di-rondine.tipografia", JSON.stringify(d));
        window.__tipografia.open();
      }, [snapBeforeBoss, [...unlockedEnds]]);
      await page.waitForTimeout(240);
      await page.evaluate(() => window.T_.click("Continua la storia|Inizia il Capitolo 4"));
      await page.waitForTimeout(150);
      await L.advance(page).catch(() => {});
      await stubFlash(page);
      await go(page, "tp_largo", 25, 7);
      await L.goAct(page, 25, 6);
      await L.advance(page, ["Gioca la Finale", label]);
      await page.waitForTimeout(240);
      const endsNow = await page.evaluate(() => window.__tipografia.endings().filter((e) => e.found).map((e) => e.id));
      endsNow.forEach((x) => unlockedEnds.add(x));
      if (!unlockedEnds.has(eid)) errors.push("finale non sbloccato: " + eid + " -> " + JSON.stringify(endsNow));
    }

    // 5. Ecosistema: Salone, Sala Giochi (cabinato flash68 + boss oro), Squadra dei Sogni, Carte del Destino, Guardaroba e Borgo
    const eco = await page.evaluate(() => {
      window.__salone.open(() => {});
      const salTxt = (document.querySelector(".salOv") || {}).innerText || "";
      const card = !!document.querySelector('.salOv [data-saga="tipografia"], .salOv [data-id="tipografia"]') || salTxt.includes("La Tipografia di Mezzanotte");
      window.__salone.salaGiochi(() => {});
      const mEl = document.querySelector('.salOv [data-m="flash68"]');
      const mOpen = !!(mEl && mEl.querySelector(".pe").textContent !== "🔒" && mEl.classList.contains("gold"));
      window.__sogni.open(() => {});
      const own = window.__sogni._load().own;
      const cardsOk = ["tp_tino", "tp_oreste", "tp_beppe", "tp_clara", "tp_livia", "tp_goffredo", "tp_ada"].every((c) => own.includes(c));
      const cosOwned = window.__borgoApi.cosOwned();
      const cosOk = ["tp_c1", "tp_c2", "tp_c3", "tp_c4", "sm_tipografia"].every((c) => cosOwned.includes(c));
      const decks = (window.__carteDecks && window.__carteDecks.list && window.__carteDecks.list()) || [];
      const deckOk = decks.some((d) => d.id === "tp" && d.unlocked);
      return { card, mOpen, cardsOk, cosOk, deckOk };
    });
    if (!eco.card) errors.push("La Tipografia di Mezzanotte non compare nel Salone");
    if (!eco.mOpen) errors.push("Cabinato «flash68» non aperto o senza corona d'oro in Sala Giochi");
    if (!eco.cardsOk) errors.push("Le 7 carte tp_* non sono tutte sbloccate in Squadra dei Sogni");
    if (!eco.cosOk) errors.push("Cosmetici tp_c1..c4 / sm_tipografia non tutti sbloccati");
    if (!eco.deckOk) errors.push("Mazzo «tp» assente da Carte del Destino");
    await L.shot(page, "tp_salone_finale_390");
  } catch (e) { errors.push(e.message.slice(0, 340)); }
  L.check("Tipografia · capitoli 1-4, scelta a tempo, Dossier, 4 finali ed ecosistema", errors);
  await browser.close();
}

(async () => {
  for (const w of [390, 320, 1000]) await freshAndZones(w);
  await allChaptersZones(390);
  await pressMechanicTest();
  await flash68EngineTest();
  await fullSagaEndingsAndEcosystem();
})().catch((e) => { console.error("✗ tipografia:", e.message); process.exit(1); });
