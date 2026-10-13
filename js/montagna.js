// js/montagna.js - PICCOLO BORGO DI MONTAGNA · configurazione della saga sul motore comune (js/saga-core.js)
// Saga COMICA e satirica, nello spirito delle commedie animate di montagna (tutto inventato, nessun minore in pericolo).
// Nel Piccolo Borgo di Montagna, un paesino alpino dove fa freddo tutto l'anno, gli adulti residenti vivono di stranezze
// e tradizioni surreali: il venerato "Pallone Sacro" di cartone, le multe del vigile Sbruffo, le megalomanie del sindaco Valanga
// e le cioccolate calde del Barista Boris. Tu sei il Campione forestiero sceso dalla corriera delle 8:00.
// Novità di questa saga:
//  - RITAGLI (js/ritagli.js): la partita originale a marionette di carta ritagliata, animazioni stop-motion a 12 fps,
//    caricamento a molla di cartoncino, contrasti a forbice e tiri a rimbalzo secco.
//  - LA BACHECA DELLE EMERGENZE (K.emergenza): un volantino ciclostilato che si apre sul campo dopo le scelte del consiglio,
//    con timbro e bollettino comunale che muta fiducia e assurdità cittadina.
//  - LA GRAFICA DI CARTONE E NEVE: tessere a découpage, pupazzi di neve sbilenchi, stufette fumanti a scatti e steccati di cartoncino.
(function () {
  "use strict";
  if (window.__montagna || !window.__sagaCore) return;

  // I bollettini comunali delle emergenze cittadine
  const EMERGENZE = {
    corriera: ["Bollettino Comunale · Edizione Straordinaria", "«ARRIVATO IL FORESTIERO DELLE 8:00»", "Il Sindaco dichiara lo stato di emergenza sportiva. Boris offre cioccolata a tutti."],
    boscaioli: ["Avviso di Pubblica Sicurezza", "«I BOSCAIOLI DEL PASSO SFIDANO IL BORGO»", "Partita sul ghiaccio parrocchiale. Il vigile Sbruffo annuncia multe preventive."],
    scaldabagno: ["Scoop della Gazzetta Alpina", "«IL PALLONE SACRO È UN BOILER DEL 1984?»", "Tensione alle stelle in municipio. La cittadinanza chiede spiegazioni a Valanga."],
    rivolta: ["Volantino Autogestito", "«NASCE LA POLISPORTIVA LIBERA»", "Wendy e Boris guidano la squadra senza bandiere politiche. Valanga minaccia sanzioni."],
    finale: ["Manifesto della Grande Sfida", "«FINALE SOTTO LA BUFERA DI CARTA»", "Tutto il borgo accorre sugli spalti di compensato. Chi vince alza la Coppa di Cartone."],
  };

  const E = window.__sagaCore.create({
    id: "montagna",
    key: "ali-di-rondine.montagna",
    title: "Piccolo Borgo di Montagna",
    icon: "🏔️",
    bg: "bm_titolo",
    chapters: 3,
    menuSub: "Un paesino innevato, un pallone di cartone e una coppa contesa tra boscaioli e folli residenti",
    theme: {
      accent: "#38bdf8",
      ink: "#0f172a",
      paper: "rgba(248,250,252,.96)",
      font: "'Trebuchet MS', system-ui, sans-serif",
      chipBg: "#f1f5f9ee",
      chipBorder: "#0f172a"
    },
    stats: {
      fiducia: [0, 99, 0, "Fiducia del Borgo"],
      assurdo: [0, 99, 0, "Livello Assurdo"],
      boris: [0, 99, 0, "Amicizia Boris"]
    },
    travel: true,
    item: ["Ritaglio di Cartoncino", "Ritagli di Cartoncino"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.5);
      g.fillStyle = "#cbd5e1";
      g.fillRect(-6, -6, 12, 12);
      g.strokeStyle = "#0f172a";
      g.lineWidth = 1.2;
      g.strokeRect(-6, -6, 12, 12);
      g.fillStyle = "#38bdf8";
      g.beginPath();
      g.arc(0, 0, 3, 0, Math.PI * 2);
      g.fill();
      g.restore();
    },
    stadium: {
      azPitch: "lago",
      cageField: 1,
      cageMut: "slippery",
      weather: "snow",
      venue: {
        ads: [["LEGNAME VALANGA", "#ef4444"], ["CIOCCOLATA BORIS", "#b45309"], ["MULTE SBRUFFO", "#0284c7"], ["SCUOLA WENDY", "#10b981"]],
        crowd: ["#fde047", "#f97316", "#ef4444", "#38bdf8", "#4ade80"],
        ground: ["#f1f5f9", "#e2e8f0"],
        line: "#94a3b8dd",
        grid: "rgba(148,163,184,.12)",
        tint: "rgba(224,242,254,.08)",
        glow: "186,230,253",
        sky: ["#bae6fd", "#e0f2fe"],
        wall: ["#64748b", "#475569"],
        fx: { fr: 0.94, spd: 0.92, wind: 1.1 }
      }
    },
    regions: {
      borgo: { grass: ["#f1f5f9", "#e2e8f0", "#f8fafc"], path: ["#cbd5e1", "#94a3b8"], stone: ["#64748b", "#475569"], wall: ["#475569", "#334155"], water: ["#38bdf8", "#0284c7"], tall: "#cbd5e1", tree: ["#15803d", "#166534", "#14532d"], tint: "224,242,254", tintA: 0.08, fx: "snow", dark: 0 },
      municipio: { grass: ["#fed7aa", "#fdba74", "#fb923c"], path: ["#e2e8f0", "#cbd5e1"], stone: ["#94a3b8", "#64748b"], wall: ["#78350f", "#451a03"], water: ["#38bdf8", "#0284c7"], tall: "#fed7aa", tree: ["#166534", "#14532d"], tint: "254,243,199", tintA: 0.06, fx: "", dark: 0.02 },
      campo: { grass: ["#e0f2fe", "#bae6fd", "#7dd3fc"], path: ["#f1f5f9", "#e2e8f0"], stone: ["#475569", "#334155"], wall: ["#334155", "#1e293b"], water: ["#0284c7", "#0369a1"], tall: "#bae6fd", tree: ["#14532d", "#052e16"], tint: "186,230,253", tintA: 0.1, fx: "snow", dark: 0.01 },
    },
    floors: "",
    solid: "SPFTBA#wW",
    rest: {
      ch: "s",
      label: "Scaldati alla stufetta",
      text: "Ti siedi sulla panca di legno vicino alla stufetta fumante. L'aria odora di pino e cioccolata calda. (Il gioco salva da solo: qui puoi rileggere la Bacheca del Borgo.)"
    },
    texts: {
      chestOpen: "Apri la cassetta del kit alpino.",
      chestEmpty: "Dentro c'è solo un rotolo di nastro adesivo e un pon-pon di lana smarrito.",
      nothing: "Niente, solo cumuli di neve fresca e tracce di scarponi.",
      noHero: "Il Piccolo Borgo attende il suo centravanti. Crea prima il tuo Campione."
    },
    journal: {
      name: "La Bacheca del Gelo",
      sub: "I bollettini, le emergenze",
      html: (K) => {
        const ks = Object.keys(EMERGENZE).filter((id) => K.F.is("bm_e_" + id));
        return ks.length
          ? ks.map((id) => `<p style="margin:6px 0"><small style="opacity:.7">${EMERGENZE[id][0]}</small><br><b>${EMERGENZE[id][1]}</b><br><span style="opacity:.8">${EMERGENZE[id][2]}</span></p>`).join("")
          : "<p>Nessun bollettino affisso in bacheca.</p>";
      }
    },
    endings: {
      scaldabagno: ["IL SEGRETO DELLO SCALDABAGNO", "Hai svelato che il Pallone Sacro era un boiler del 1984, ma la squadra di cartone vince la Coppa e il borgo elegge il boiler a mascotte ufficiale.", "Serve aver trovato l'etichetta del boiler nel Capitolo 2 e vinto la finale."],
      politica: ["LA RIVOLTA DEI CITTADINI", "Il Sindaco Valanga viene sfiduciato all'unanimità dopo il suo tentativo di sabotaggio. Nasce la Polisportiva Libera di Montagna, autogestita da Boris e Wendy.", "Serve aver contestato il Sindaco in municipio e ottenuto almeno 7 di fiducia."],
      cartone: ["CAMPIONI DEL MONDO DI CARTA", "Accetti in pieno la folle logica del borgo: la coppa di cartone viene sollevata tra fuochi d'artificio di carta crespa e coriandoli sul ghiaccio.", "Sempre possibile, vincendo la finale secondo lo spirito del borgo."],
      segreto: ["LA PALLA DI NEVE PERFETTA", "Boris rivela il leggendario tiro a palla di neve comprimibile. Nessun portiere della regione potrà mai più fermare il Piccolo Borgo.", "Segreto: tutti i ritagli di cartone raccolti, 5 stelle di precisione in Ritagli e la fiducia piena di Boris."],
    },
    heroLook: () => ({ bg: ["#e0f2fe", "#0284c7"], shirt: "#0284c7" }),
    heroTitle: (K) => (K.stat("assurdo") > 5 ? "il cittadino onorario più strambo" : "il centravanti di cartone del borgo"),
    act: {
      q: "Entra",
      n: "Leggi il cartello",
      S: "Guarda lo steccato",
      P: "Saluta il pupazzo",
      F: "Scaldati alla stufetta",
      T: "Ammira il pallone sacro",
      B: "Guarda lo scuolabus",
      A: "Guarda l'abete",
      "^": "Cambia zona",
      v: "Cambia zona",
      "<": "Cambia zona",
      ">": "Cambia zona"
    },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        const t = {
          S: "Uno steccato fatto con assi di cartoncino pressato. C'è scritto a matita: «Proprietà di Boris: non appoggiarsi».",
          P: "Un pupazzo di neve sbilenco con una carota al posto del naso e un vecchio berretto di lana blu. Sembra sorridere.",
          F: "Una stufetta di ghisa fumante accesa all'aperto. La legna scoppietta diffondendo un tepore rassicurante.",
          T: "Una teca di vetro protetta da un lucchetto arrugginito. Al centro troneggia il leggendario Pallone di Cartone del Borgo.",
          B: "Lo scuolabus arancione del borgo, con catene da neve grosse come ancore. Non parte mai prima delle nove.",
          A: "Un grande abete carico di neve soffice. Sotto i rami si riparano passerotti di montagna."
        }[ch];
        if (!t) return false;
        K.say([["voce", t]]);
        return true;
      },
    }],
    musicMain: "montagna",
    music: {
      montagna: {
        bpm: 124,
        chords: ["F", "C", "Dm", "Bb", "F", "C", "Bb", "C"],
        lres: 2,
        lw: "triangle",
        lv: 0.04,
        lead: "A4 - C5 F5 - E5 D5 - | C5 - - A4 - F4 - - | D5 - F5 Bb5 - A5 G5 - | F5 - A5 C6 - - - - | A4 - C5 F5 - A5 G5 - | E5 - C5 - G4 - - - | F4 - A4 C5 - D5 C5 - | Bb4 - D5 - C5 - - -",
        bass: "F2 . . C3 . D3 . Bb2",
        bv: 0.12,
        arp: "",
        av: 0,
        drum: "k . h s . k h s k . h s . k h h",
        dv: 0.12
      },
    },
    paint: {
      // Steccato di cartoncino grezzo
      S(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#b45309";
        g.fillRect(sx + 2, sy + 3, 12, 10);
        g.strokeStyle = "#451a03";
        g.lineWidth = 1.2;
        g.strokeRect(sx + 2.5, sy + 3.5, 11, 9);
        g.fillStyle = "#78350f";
        g.fillRect(sx + 5, sy, 2, 16);
        g.fillRect(sx + 11, sy, 2, 16);
      },
      // Pupazzo di neve sbilenco
      P(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#ffffff";
        g.strokeStyle = "#475569";
        g.lineWidth = 1;
        // Palla inferiore
        g.beginPath(); g.arc(sx + 8, sy + 11, 5, 0, 7); g.fill(); g.stroke();
        // Palla superiore
        g.beginPath(); g.arc(sx + 8, sy + 5, 3.5, 0, 7); g.fill(); g.stroke();
        // Carota
        g.fillStyle = "#f97316";
        g.fillRect(sx + 8, sy + 4, 3, 1.5);
        // Sciarpetta rossa che ondeggia
        g.fillStyle = "#ef4444";
        g.fillRect(sx + 6, sy + 7, 5, 2);
      },
      // Stufetta di ghisa fumante
      F(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#1e293b";
        g.fillRect(sx + 3, sy + 5, 10, 10);
        g.fillStyle = "#f97316";
        // Fiammella viva
        if ((fr >> 4) % 2 === 0) g.fillRect(sx + 6, sy + 8, 4, 4);
        else g.fillRect(sx + 7, sy + 9, 2, 3);
        // Tubo di scarico con fumo
        g.fillStyle = "#334155";
        g.fillRect(sx + 7, sy, 2, 5);
        g.fillStyle = "rgba(241,245,249,0.7)";
        const fY = (fr % 30) / 6;
        g.beginPath(); g.arc(sx + 8, sy - 2 - fY, 2, 0, 7); g.fill();
      },
      // Teca del Pallone di Cartone
      T(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#78350f";
        g.fillRect(sx + 2, sy + 10, 12, 6);
        g.fillStyle = "rgba(186,230,253,0.5)";
        g.fillRect(sx + 3, sy + 2, 10, 8);
        g.strokeStyle = "#0284c7";
        g.lineWidth = 1;
        g.strokeRect(sx + 3.5, sy + 2.5, 9, 7);
        // Pallone dentro
        g.fillStyle = "#fef08a";
        g.beginPath(); g.arc(sx + 8, sy + 6, 2.5, 0, 7); g.fill();
      },
      // Scuolabus arancione fermo nella neve
      B(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#f97316";
        g.fillRect(sx + 1, sy + 2, 14, 11);
        g.strokeStyle = "#7c2d12";
        g.lineWidth = 1;
        g.strokeRect(sx + 1.5, sy + 2.5, 13, 10);
        g.fillStyle = "#e0f2fe";
        g.fillRect(sx + 3, sy + 4, 4, 3);
        g.fillRect(sx + 9, sy + 4, 4, 3);
        g.fillStyle = "#0f172a";
        g.fillRect(sx + 3, sy + 12, 3, 3);
        g.fillRect(sx + 10, sy + 12, 3, 3);
      },
      // Abete di carta ritagliata a triangoli
      A(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#78350f";
        g.fillRect(sx + 7, sy + 10, 2, 6);
        g.fillStyle = "#15803d";
        g.beginPath();
        g.moveTo(sx + 8, sy + 1); g.lineTo(sx + 3, sy + 6); g.lineTo(sx + 13, sy + 6);
        g.closePath(); g.fill();
        g.beginPath();
        g.moveTo(sx + 8, sy + 5); g.lineTo(sx + 2, sy + 11); g.lineTo(sx + 14, sy + 11);
        g.closePath(); g.fill();
      }
    },
    guest: {
      id: "bm_boris",
      lines: [["bm_boris", "[felice] {n}! Mamma mia che caldo qui al Borgo Marino. Ho dovuto togliere la terza sciarpa. Boris vuole una granita al limone grande come un pallone da calcio. Offri tu?"]]
    },
    cameos: [
      {
        id: "cs_baldo",
        zone: "bm_bar",
        at: [14, 8],
        when: (K) => !!(K.otherSaga("ali-di-rondine.cavallo") || {}).done?.[1],
        lines: [["cs_baldo", "[ride] Brr! Altro che Lustrino... qui gli zoccoli mi si congelano sul pavimento! Boris fa un caffè che risveglia anche un attore in pensione."]]
      },
      {
        id: "rz_ferruccio",
        zone: "bm_piazza",
        at: [6, 12],
        when: (K) => !!(K.otherSaga("ali-di-rondine.razzo") || {}).done?.[1],
        lines: [["rz_ferruccio", "[sorpreso] BIP. Dal 3011 con consegna speciale: cinquanta chilogrammi di carta igienica e una stufa al plasma per il Sindaco Valanga. Timbro qui?"]]
      }
    ],
  });

  const K = E.K;
  K.EMERGENZE = EMERGENZE;

  // ------------------------------------------------------------ LA BACHECA DELLE EMERGENZE
  K.emergenza = (id, d, then) => {
    const T = EMERGENZE[id];
    if (!T) return (then || K.done)();
    K.F.set("bm_e_" + id, true);
    if (d && d.fiducia) K.bond("fiducia", d.fiducia);
    if (d && d.assurdo) K.bond("assurdo", d.assurdo);

    if (!document.getElementById("bmCss")) {
      const st = document.createElement("style");
      st.id = "bmCss";
      st.textContent = `
.bmNews{position:fixed;inset:0;z-index:260;background:rgba(15,23,42,.65);display:flex;align-items:center;justify-content:center;padding:14px;font-family:'Trebuchet MS',sans-serif}
.bmNews .pg{width:min(100%,400px);background:#f8fafc;color:#0f172a;border:3px dashed #0284c7;box-shadow:8px 8px 0 rgba(0,0,0,.35);padding:14px;border-radius:8px;animation:bmPop .4s cubic-bezier(.2,.8,.3,1) both}
@keyframes bmPop{0%{transform:scale(.7);opacity:0}100%{transform:scale(1);opacity:1}}
.bmNews .ts{text-align:center;font:900 12px sans-serif;text-transform:uppercase;color:#0284c7;letter-spacing:1px;border-bottom:2px solid #cbd5e1;padding-bottom:4px}
.bmNews h4{margin:8px 0;font:900 18px sans-serif;text-align:center;color:#b91c1c;line-height:1.2}
.bmNews .stamp{display:inline-block;border:2px solid #b91c1c;color:#b91c1c;font-weight:900;font-size:11px;padding:2px 8px;border-radius:4px;transform:rotate(-4deg);margin-bottom:6px}
.bmNews p{font-size:13px;line-height:1.4;margin:6px 0;color:#334155}
.bmNews button{width:100%;margin-top:10px;min-height:44px;border:2px solid #0f172a;background:#38bdf8;font:900 14px sans-serif;border-radius:8px;cursor:pointer;color:#0f172a;box-shadow:0 3px 0 #0284c7}
.bmNews button:active{transform:translateY(2px);box-shadow:none}
`;
      document.head.appendChild(st);
    }

    const ov = document.createElement("div");
    ov.className = "bmNews";
    ov.innerHTML = `
      <div class="pg">
        <div class="ts">${K.esc(T[0])}</div>
        <div style="text-align:center;margin-top:6px"><span class="stamp">APPROVATO DAL BORGO</span></div>
        <h4>${K.esc(T[1])}</h4>
        <p>${K.esc(T[2])}</p>
        <button type="button">Prendi Nota ▸</button>
      </div>
    `;
    document.body.appendChild(ov);
    K.tone(520, 0.4, "triangle", 0.05, 0, 780);
    ov.querySelector("button").onclick = () => {
      ov.remove();
      (then || K.done)();
    };
  };

  // ------------------------------------------------------------ Partita originale Ritagli
  K.ritagliMatch = (o, done) => {
    const h = (K.hero && K.hero()) || {};
    return K.ownMatch(window.__ritagli.start, Object.assign({
      usColor: "#0284c7",
      us: "Piccolo Borgo",
      hero: { name: h.name || "Tu" },
      mates: [{ name: "Boris" }, { name: "Wendy" }]
    }, o, {
      done: (r) => {
        if (r && r.quit) K.F.set("bm_lasciato", true);
        if (typeof done === "function") done(r);
      }
    }));
  };

  window.__montagna = E.api;
})();
