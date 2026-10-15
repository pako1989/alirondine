// js/treno.js - «L'ESPRESSO DELLE OMBRE · INTRIGO SUL TRENO DELLE NEVI» · Configurazione della saga su js/saga-core.js
// Spy-story d'epoca / Giallo internazionale anni '60 ispirato a Hitchcock, Assassinio sull'Orient Express e La Talpa.
// Sul lussuoso convoglio notturno «Nord-Sud Star», bloccato da una bufera tra le gole alpine,
// una valigetta diplomatica con documenti tattici scompare nel nulla.
// Novità di questa saga:
//  - IL CORRIDOIO D'ACCIAIO (js/corridoio.js): motore di partita originale 2v2 a scorrimento nella carrozza passeggeri,
//    con sobbalzi delle curve alpine che deviano le traiettorie e sponde rimbalzanti sulle porte degli scompartimenti.
//  - IL DOSSIER DELL'INTELLIGENCE (K.dossier): schedari segreti, microfilm cifrati e perquisizione dei compartimenti.
//  - ESTETICA NOIR FERROVIARIA: vagoni in mogano lucido, finestrini con bufera alpina in parallasse, abat-jour in ottone e bauli blindati.
(function () {
  "use strict";
  if (window.__treno || !window.__sagaCore) return;

  const INDIZI = {
    microfilm1: [
      "DOSSIER RISERVATO N° 1 · CIFRARIO DEL VAGONE LETTO",
      "REPERTO: Rocchetto di microfilm 16mm nascosto in una scatola di sigari d'Avana",
      "«IL DISPACCIO DELLE 23:15»",
      "La valigetta diplomatica conteneva schemi tattici rivoluzionari destinati al vertice di frontiera. Una firma sul registro delle carrozze non corrisponde a nessun passeggero della lista ufficiale."
    ],
    passepartout: [
      "DOSSIER RISERVATO N° 2 · PASSE-PARTOUT IN OTTONE",
      "REPERTO: Chiave maestra numerata della Compagnia Internazionale Carrozze Letti",
      "«L'APERTURA DELLA CARROZZA B»",
      "La serratura dello scompartimento diplomatico non è stata forzata. Solo tre persone a bordo possiedono la chiave d'ottone: il capotreno Klaus, il medico Morozov e un passeggero misterioso."
    ],
    cinepresa: [
      "DOSSIER RISERVATO N° 3 · MICRO-CINEPRESA MINOX",
      "REPERTO: Apparecchio fotografico in alluminio satinato celato nel beauty-case della Contessa",
      "«IL FOTOGRAMMA DEL VIADOTTO»",
      "Gli scatti mostrano il momento esatto in cui il treno ha rallentato prima del ponte: qualcuno ha azionato la leva del freno per permettere un segnale luminoso verso la vallata."
    ],
    spartito: [
      "DOSSIER RISERVATO N° 4 · MAPPA DEL CARRELLO DI CODA",
      "REPERTO: Schema tecnico dei ganci di trazione con annotazioni a matita blu",
      "«IL PIANO DI SGANCIO»",
      "I sabotatori vogliono disconnettere l'ultimo vagone prima della stazione di confine. Chi conosce la composizione del convoglio può anticipare la mossa e salvare l'intera delegazione."
    ]
  };

  const E = window.__sagaCore.create({
    id: "treno",
    key: "ali-di-rondine.treno",
    title: "L'Espresso delle Ombre · Intrigo sul Treno delle Nevi",
    icon: "🚂",
    bg: "te_titolo",
    chapters: 3,
    menuSub: "Spie, carrozze in mogano e una valigetta scomparsa tra le Alpi innevate.",
    theme: {
      accent: "#38bdf8",
      ink: "#0f172a",
      paper: "rgba(241,245,249,.96)",
      font: "'Courier New', monospace, system-ui",
      chipBg: "#e2e8f0",
      chipBorder: "#64748b"
    },
    stats: {
      microfilm: [0, 4, 1, "Microfilm Cifrati (📼)"],
      freddezza: [0, 99, 20, "Freddezza da Agente"],
      sospetto: [0, 99, 10, "Sospetto della Frontiera"]
    },
    travel: true,
    item: ["Microfilm Cifrato", "Microfilm Cifrati"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.5);
      // Profilo rocchetto metallico microfilm
      g.fillStyle = "#334155";
      g.beginPath();
      g.arc(0, 0, 6, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#38bdf8";
      g.lineWidth = 1.2;
      g.stroke();

      // Fori bobina
      g.fillStyle = "#0f172a";
      for (let a = 0; a < 4; a++) {
        const rad = (a * Math.PI) / 2 + f * 0.05;
        g.beginPath();
        g.arc(Math.cos(rad) * 3, Math.sin(rad) * 3, 1.2, 0, Math.PI * 2);
        g.fill();
      }
      // Nastro magnetico lucido
      g.fillStyle = "#38bdf8";
      g.fillRect(-1.5, -1.5, 3, 3);
      g.restore();
    },
    stadium: {
      azPitch: "lizza",
      cageField: 2,
      cageMut: "narrow",
      weather: "snow",
      venue: {
        ads: [
          ["NORD-SUD STAR · ESPRESSO ALPINO", "#38bdf8"],
          ["COMPAGNIA INTERNAZIONALE VAGONI", "#f59e0b"],
          ["ISPETTORATO DELLE ALPI", "#94a3b8"],
          ["VALICO DEL GHIACCIAIO · QUOTA 2100m", "#0284c7"]
        ],
        crowd: ["#1e293b", "#334155", "#0f172a", "#38bdf8", "#64748b"],
        ground: ["#1e293b", "#0f172a"],
        line: "rgba(56,189,248,.65)",
        grid: "rgba(56,189,248,.15)",
        sky: ["#020617", "#0f172a"],
        wall: ["#475569", "#334155"],
        fx: { fr: 0.92, spd: 0.95, wind: 0.8 }
      }
    },
    regions: {
      vagone: {
        grass: ["#1e293b", "#0f172a", "#020617"],
        path: ["#92400e", "#78350f"],
        stone: ["#334155", "#1e293b"],
        wall: ["#451a03", "#292524"],
        water: ["#0284c7", "#0369a1"],
        tall: "#b45309",
        tree: ["#0f172a", "#020617"],
        tint: "56,189,248",
        tintA: 0.05,
        fx: "",
        dark: 0.04
      },
      stazione: {
        grass: ["#f8fafc", "#e2e8f0", "#cbd5e1"],
        path: ["#475569", "#334155"],
        stone: ["#64748b", "#475569"],
        wall: ["#1e293b", "#0f172a"],
        water: ["#38bdf8", "#0284c7"],
        tall: "#94a3b8",
        tree: ["#1e293b", "#0f172a"],
        tint: "241,245,249",
        tintA: 0.08,
        fx: "snow",
        dark: 0.02
      }
    },
    floors: "",
    solid: "SPFTBA#wWCcKkV",
    rest: {
      ch: "s",
      label: "Riposa nel Vagone Ristorante",
      text: "Ti siedi a un tavolino riservato con abat-jour in ottone. Tra una tazza di caffè nero bollente e il panorama delle cime innevate, consulti il dossier dei microfilm cifrati. (Il gioco salva in automatico.)"
    },
    texts: {
      chestOpen: "Apri il baule da viaggio rinforzato in cuoio.",
      chestEmpty: "Solo etichette di vecchi alberghi europei e cinghie d'ancoraggio.",
      nothing: "Il corridoio silenzioso sferraglia dolcemente sui giunti dei binari.",
      noHero: "La delegazione del Nord-Sud Star cerca il suo capitano. Crea prima il tuo Campione."
    },
    journal: {
      name: "Il Dossier dell'Intelligence Alpina",
      sub: "Rapporti d'indagine, microfilm e identità dei passeggeri",
      html: (K) => {
        const ks = Object.keys(INDIZI).filter((id) => K.F.is("te_i_" + id));
        return ks.length
          ? ks.map((id) => `<p style="margin:8px 0;border-bottom:1px dashed #38bdf8;padding-bottom:6px"><small style="color:#0284c7;font-weight:900">${INDIZI[id][0]}</small><br><b style="color:#0f172a;font-size:14px">${INDIZI[id][2]}</b><br><span style="color:#0369a1;font-weight:700">${INDIZI[id][1]}</span><br><span style="opacity:.85;font-size:12px">${INDIZI[id][3]}</span></p>`).join("")
          : "<p>Nessun documento cifrato ancora archiviato nel dossier.</p>";
      }
    },
    endings: {
      diplomazia: [
        "LA CONSEGNA DIPLOMATICA",
        "Consegni la valigetta intatta all'Ispettore Valenti prima del valico: il complotto viene sventato senza incidenti internazionali e la squadra disputa il match trionfale a Ginevra!",
        "Serve aver collaborato lealmente con Valenti e vinto la finale."
      ],
      verita: [
        "IL DOPPIO GIOCO SVELATO",
        "Smascheri la Contessa Elena e il medico Morozov recuperando la micro-cinepresa: l'intrigo fa il giro delle cancellerie europee e assicuri giustizia e rispetto sui binari!",
        "Serve aver perquisito il vagone letto e affrontato la Contessa nel Capitolo 2."
      ],
      ombre: [
        "IL CALCIO OLTRE LA CORTINA",
        "Decidi di trattenere il dossier per proteggere il futuro dei giovani calciatori di frontiera: nasce una rete segreta di talenti che supera ogni barriera politica.",
        "Serve scegliere l'indipendenza tattica nel bivio del Capitolo 3."
      ],
      maestro: [
        "L'AGENTE PERFETTO DEL NORD-SUD STAR",
        "Trovi tutti i 4 microfilm cifrati e vinci la finalissima nel corridoio senza subire alcuna rete durante la bufera: sei nominato Comandante delle Ombre!",
        "Segreto: tutti i 4 microfilm raccolti e clean sheet nella sfida finale."
      ]
    },
    heroLook: () => ({ bg: ["#1e293b", "#0f172a"], shirt: "#1e293b" }),
    heroTitle: (K) => (K.stat("freddezza") > 50 ? "l'agente d'acciaio del Nord-Sud Star" : "il centravanti investigatore delle Alpi"),
    act: {
      q: "Entra nello scompartimento",
      n: "Esamina il dossier",
      B: "Ispeziona la valigetta diplomatica",
      K: "Ispeziona il freno d'emergenza",
      V: "Guarda fuori dal finestrino",
      P: "Siediti in poltrona",
      F: "Scaldati alla stufa a carbone",
      "^": "Passa al vagone successivo",
      v: "Passa al vagone precedente",
      "<": "Passa al vagone precedente",
      ">": "Passa al vagone successivo"
    },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        const t = {
          B: "La valigetta diplomatica metallica piombata: reca sigilli in ceralacca rossa e chiusura a combinazione a quattro cifre.",
          K: "La maniglia scarlatta del freno d'emergenza del convoglio: piombata con filo di piombo e targhetta in smalto.",
          V: "Il finestrino della carrozza: i fari della locomotiva squarciano la bufera di neve mentre le abetaie alpine scorrono veloci.",
          P: "Una comoda poltrona in velluto cardinale con poggiatesta in pizzo ricamato con lo stemma del Nord-Sud Star.",
          F: "La stufa in ghisa del vagone bagagli: diffonde un calore asciutto e profumo di carbone fossile.",
          T: "Un tavolino di noce con tovaglia di lino damascata, servizio d'argento e una caraffa d'acqua minerale frizzante."
        }[ch];
        if (!t) return false;
        K.say([["voce", t]]);
        return true;
      }
    }],
    musicMain: "treno",
    music: {
      treno: {
        bpm: 124,
        chords: ["Dm", "Bb", "Gm", "A7", "Dm", "F", "Gm", "A7"],
        lres: 2,
        lw: "sawtooth",
        lv: 0.05,
        lead: "D4 - F4 - A4 - D5 | Bb4 - D5 - F5 - E5 | D5 - - - A4 - F4 - | G4 - Bb4 - A4 - - | D4 - F4 - G4 - A4 | Bb4 - A4 - G4 - F4 | E4 - G4 - F4 - E4 | D4 - - - - - - -",
        bass: "D2 . . D2 . Bb1 . A1",
        bv: 0.16,
        arp: "",
        av: 0,
        drum: "k . h s . k h s k . h s . k h h",
        dv: 0.14
      }
    },
    paint: {
      // V: Finestrino con neve in corsa
      V(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#451a03";
        g.fillRect(sx + 1, sy + 1, 14, 14);
        g.fillStyle = "#020617";
        g.fillRect(sx + 3, sy + 3, 10, 10);
        g.fillStyle = "rgba(56,189,248,0.3)";
        g.fillRect(sx + 3, sy + 8, 10, 5);
        g.fillStyle = "#ffffff";
        g.fillRect(sx + 5, sy + 5, 2, 2);
        g.fillRect(sx + 9, sy + 9, 2, 2);
      },
      // B: Valigetta diplomatica metallica
      B(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#475569";
        g.fillRect(sx + 2, sy + 4, 12, 9);
        g.fillStyle = "#94a3b8";
        g.fillRect(sx + 3, sy + 5, 10, 7);
        // Chiusure in ottone
        g.fillStyle = "#f59e0b";
        g.fillRect(sx + 4, sy + 7, 2, 3);
        g.fillRect(sx + 10, sy + 7, 2, 3);
        // Maniglia
        g.strokeStyle = "#1e293b";
        g.lineWidth = 1;
        g.strokeRect(sx + 6, sy + 2, 4, 3);
      },
      // K: Freno d'emergenza
      K(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#64748b";
        g.fillRect(sx + 3, sy + 2, 10, 12);
        g.fillStyle = "#dc2626";
        g.fillRect(sx + 5, sy + 4, 6, 8);
        g.fillStyle = "#fef2f2";
        g.fillRect(sx + 7, sy + 6, 2, 4);
      },
      // P: Poltrona velluto rosso
      P(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#78350f";
        g.fillRect(sx + 2, sy + 3, 12, 11);
        g.fillStyle = "#991b1b";
        g.fillRect(sx + 3, sy + 4, 10, 8);
        g.fillStyle = "#b91c1c";
        g.fillRect(sx + 4, sy + 7, 8, 5);
      },
      // F: Stufa in ghisa
      F(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#1e293b";
        g.fillRect(sx + 3, sy + 2, 10, 12);
        g.fillStyle = "#f97316";
        g.fillRect(sx + 5, sy + 7, 6, 5);
        g.fillStyle = "#fde047";
        g.fillRect(sx + 7, sy + 9, 2, 2);
      }
    },
    guest: {
      id: "te_valenti",
      lines: [
        ["te_valenti", "[avvolto nel cappotto scuro mentre osserva il mare di Borgo Marino] Eccellente sangue freddo sul viadotto del ghiacciaio, {n}. I nostri archivi di frontiera custodiscono il vostro nome con il massimo rispetto. Ricordate: sul campo come sui binari, chi controlla il corridoio controlla la partita."]
      ]
    },
    cameos: [
      {
        id: "dc_detective",
        zone: "te_ristorante",
        at: [13, 5],
        when: (K) => !!(K.otherSaga("ali-di-rondine.detective") || {}).done?.[1],
        lines: [
          ["dc_detective", "[sorseggia un tè guardando i passeggeri con la lente] Questo Ispettore Valenti ha un metodo impeccabile. Ma attento: chi si siede vicino al finestrino sul lato destro ha sempre un secondo passaporto nella fodera del cappotto!"]
        ]
      },
      {
        id: "alc_joe",
        zone: "te_bagagliaio",
        at: [4, 8],
        when: (K) => !!(K.otherSaga("ali-di-rondine.alcatraz") || {}).done?.[1],
        lines: [
          ["alc_joe", "[sbuca da dietro un baule di cuoio con aria furtiva] Psst! Se hai bisogno di far sparire una valigetta senza che i controllori di dogana se ne accorgano, chiedi a chi ha scavato nei condotti di San Francisco. Questo treno è una fortezza, ma ogni serratura cede al tocco giusto!"]
        ]
      }
    ]
  });

  const K = E.K;
  K.INDIZI = INDIZI;

  // ------------------------------------------------------------ IL DOSSIER DELL'INTELLIGENCE
  K.dossier = (id, d, then) => {
    const M = INDIZI[id];
    if (!M) return (then || K.done)();
    K.F.set("te_i_" + id, true);
    if (d && d.microfilm) K.bond("microfilm", d.microfilm);
    if (d && d.freddezza) K.bond("freddezza", d.freddezza);
    if (d && d.sospetto) K.bond("sospetto", d.sospetto);

    if (!document.getElementById("teCss")) {
      const st = document.createElement("style");
      st.id = "teCss";
      st.textContent = `
.teScroll { position:fixed; inset:0; z-index:270; background:rgba(3,7,18,.88); display:flex; align-items:center; justify-content:center; padding:16px; font-family:'Courier New',monospace,sans-serif; }
.teScroll .sheet { width:min(100%,390px); background:#0f172a; color:#f1f5f9; border:2px solid #38bdf8; box-shadow:0 0 25px rgba(56,189,248,.35); padding:16px; border-radius:6px; animation:tePop .3s ease both; position:relative; }
@keyframes tePop { 0%{transform:scale(.8);opacity:0} 100%{transform:scale(1);opacity:1} }
.teScroll .head { text-align:center; font:900 12px monospace; text-transform:uppercase; color:#38bdf8; letter-spacing:2px; border-bottom:1px solid #334155; padding-bottom:6px; }
.teScroll h3 { margin:10px 0 6px; font:900 16px monospace; text-align:center; color:#f8fafc; line-height:1.2; text-transform:uppercase; letter-spacing:1px; }
.teScroll .stamp { display:inline-block; border:1px solid #f59e0b; color:#f59e0b; font-weight:900; font-size:11px; padding:2px 8px; border-radius:3px; margin:6px 0; background:rgba(245,158,11,.1); text-transform:uppercase; }
.teScroll p { font-size:12.5px; line-height:1.45; margin:8px 0; color:#cbd5e1; }
.teScroll button { width:100%; margin-top:12px; min-height:42px; border:none; background:#38bdf8; font:900 13px monospace; border-radius:4px; cursor:pointer; color:#0f172a; text-transform:uppercase; letter-spacing:1px; box-shadow:0 0 15px rgba(56,189,248,.3); }
.teScroll button:active { transform:translateY(2px); box-shadow:none; }
`;
      document.head.appendChild(st);
    }

    const ov = document.createElement("div");
    ov.className = "teScroll";
    ov.innerHTML = `
      <div class="sheet">
        <div class="head">${K.esc(M[0])}</div>
        <div style="text-align:center"><span class="stamp">${K.esc(M[1])}</span></div>
        <h3>${K.esc(M[2])}</h3>
        <p>${K.esc(M[3])}</p>
        <button type="button">Archivia nel Dossier ▸</button>
      </div>
    `;
    document.body.appendChild(ov);
    K.tone(440, 0.3, "sine", 0.08, 0, 880);
    ov.querySelector("button").onclick = () => {
      ov.remove();
      (then || K.done)();
    };
  };

  // ------------------------------------------------------------ Partita originale Il Corridoio d'Acciaio
  K.corridoioMatch = (o, done) => {
    const h = (K.hero && K.hero()) || {};
    return K.ownMatch(window.__corridoio.start, Object.assign({
      homeTeam: "Agenti di Bordo",
      awayTeam: "Ispettorato Alpino",
      hero: { name: h.name || "Tu" }
    }, o, {
      done: (r) => {
        if (r && r.quit) K.F.set("te_lasciato", true);
        if (typeof done === "function") done(r);
      }
    }));
  };

  window.__treno = E.api;
})();
