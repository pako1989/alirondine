// js/onde.js — «Radio Fuorigioco · Onde Corte sul Golfo (1977)»
// Saga in 4 capitoli a bordo del rimorchiatore pirata «Rondine Rossa» (99.9 MHz).
// Riusa 5 funzioni del motore comune (weight, bonds, inv, cases/dossier, clock) + la novità comune «radio» (Sintonizzatore AM/FM)
// + il nuovo minigioco calcistico 2D «Onde d'Urto · Calcio su Frequenza» (window.__urto).
(function () {
  "use strict";
  if (window.__onde || !window.__sagaCore || !window.__hd) return;
  const C = window.__sagaCore, HD = window.__hd, FX = HD.F;

  function registerPeopleAndCos(K) {
    K.cast("rf_nilde", { name: "Nilde Marini", sub: "Regista di Radio Fuorigioco", style: "messy", hair: "#9a3412", acc: ["cuffie"], skin: "#edbfa0", eye: "#15803d", shirt: "#b45309", bg: ["#451a03", "#f59e0b"] }, "Ventidue anni, regista del mixer di Radio Fuorigioco 99.9 e ala destra fulminea. Figlia di Capitan Libeccio: lingua tagliente, zero retorica e orecchio infallibile.");
    K.cast("rf_lupo", { name: "Lupo Zappa", sub: "Il Reverendo dei 45 Giri", style: "afro", hair: "#4b5563", beard: "pizzetto", acc: ["occhiali"], skin: "#e0b187", eye: "#4a3520", shirt: "#ca8a04", bg: ["#451a03", "#fbbf24"] }, "Quarantadue anni, proprietario di Dischi & Valvole Zappa, DJ notturno ed ex portiere acrobatico di provincia.");
    K.cast("rf_tullio", { name: "Tullio «Saldatore» Brega", sub: "Motorista capo & Stopper", style: "bald", hair: "#6b7280", beard: "baffi", acc: ["cappellino"], skin: "#d99b72", eye: "#334155", shirt: "#1e3a8a", bg: ["#0f172a", "#38bdf8"] }, "Sessant'anni suonati, motorista della Rondine Rossa e stopper vecchia maniera. Per lui ogni guasto umano o calcistico dipende da una guarnizione lenta.");
    K.cast("rf_valli", { name: "Ispettore Aristide Valli", sub: "Ispettorato Radioelettrico", style: "slick", hair: "#64748b", skin: "#e5bfa6", eye: "#0284c7", shirt: "#475569", bg: ["#1e293b", "#94a3b8"] }, "Commissario Capo del Ministero delle Poste ed ex mediano sinistro del Borgo 1958. Rigoroso, malinconico, allergico agli arroganti.");
    K.cast("rf_wanda", { name: "Wanda «Gettone» Bellini", sub: "Centralinista & Regista", style: "bun", hair: "#1c1917", acc: ["foulard"], skin: "#e8b892", eye: "#3f2a1d", shirt: "#881337", bg: ["#4c0519", "#2dd4bf"] }, "Barista del Bar Eldorado e regista di centrocampo dai lanci calibrati al millimetro. Conosce ogni telefonata del quartiere.");
    K.cast("rf_valvola", { name: "Giacomo «Valvola» Corti", sub: "Radioamatore dall'orecchio assoluto", style: "wavy", hair: "#d6c59a", acc: ["occhiali"], skin: "#f1ccb0", eye: "#2563eb", shirt: "#14532d", bg: ["#052e16", "#4ade80"] }, "Radioamatore ventunenne ipovedente e libero d'anticipo: riconosce dal sibilo delle cuciture l'effetto di ogni cross a trenta metri.");
    K.cast("rf_specchio", { name: "Commendator Glauco Specchio", sub: "Presidente Consorzio Costa Nuova", style: "pompadour", hair: "#5c3a21", skin: "#eab68c", eye: "#334155", shirt: "#38bdf8", bg: ["#0c4a6e", "#facc15"] }, "Presidente del Consorzio Edilizio Costa Nuova e patron dello Specchio Sporting Club: vuole spianare lo Stadio del Molo Vecchio per farne un parcheggio motoscafi.");
    K.cast("rf_cesare", { name: "Cesare «Capitan Libeccio» Marini", sub: "Fondatore di Radio Fuorigioco", style: "side", hair: "#3b2314", acc: ["sciarpa"], skin: "#dfb088", eye: "#1e3a5f", shirt: "#991b1b", bg: ["#450a0a", "#fde68a"] }, "Storico numero 10 del Molo Vecchio e voce leggendaria de «L'Ultimo Supplementare» di mezzanotte sui 99.9 MHz.");
    // Cameo cast fallback se le altre saghe non sono ancora state aperte in questa sessione
    K.cast("sf_mira", { name: "Mira", sub: "Voce di Radio Lago", style: "ponytail", hair: "#7c2d12", acc: ["cuffie"], skin: "#e8b88c", eye: "#3a2a1a", shirt: "#e11d48", bg: ["#4c0519", "#fb7185"] }, "Cronista radiofonica di Stagione sul Lago.");
    K.cast("mn_desantis", { name: "Commissario De Santis", sub: "Questura di Milano", style: "slick", hair: "#334155", acc: ["cappello"], skin: "#ddb08a", eye: "#1e293b", shirt: "#475569", bg: ["#0f172a", "#64748b"] }, "Commissario investigativo della Milano del '54.");

    K.cos("rf_giubbotto", { kind: "shirt", label: "Velluto Ruggine 99.9", val: "#b45309", from: "Completa il Capitolo 1 di «Radio Fuorigioco»" });
    K.cos("rf_occhiali", { kind: "acc", label: "Occhiali Ambrati di Lupo", val: "occhiali", from: "Completa il Capitolo 2 di «Radio Fuorigioco»" });
    K.cos("rf_cuffie", { kind: "acc", label: "Cuffie da Cabina Radio", val: "cuffie", from: "Completa il Capitolo 3 di «Radio Fuorigioco»" });
    K.cos("rf_maglia99", { kind: "shirt", label: "Maglia Storica Molo '58", val: "#991b1b", from: "Concludi «Radio Fuorigioco»" });
    K.cos("rf_sciarpa58", { kind: "acc", label: "Sciarpa Bianca di Libeccio", val: "sciarpa", from: "Sblocca il Finale Segreto «La Bobina 1.096» in «Radio Fuorigioco»" });

    K.lore("qsl_1", { t: "Cartolina QSL #1 · Peschereccio Albatros (88.6 MHz)", d: "«Vi sentiamo forte tra le reti a strascico al largo di Punta Scura: mettete un altro pezzo rock per chi rientra col mare grosso!»" });
    K.lore("qsl_2", { t: "Cartolina QSL #2 · Guardiano del Faro Est (105.4 MHz)", d: "«La lanterna gira ogni dodici secondi, i vostri 45 giri tengono sveglia tutta la scogliera.»" });
    K.lore("qsl_3", { t: "Cartolina QSL #3 · Soffitta di Via del Gasometro (96.8 MHz)", d: "«Due apprendisti tipografi ascoltano le formazioni di Nilde col volume al minimo sotto le coperte.»" });
    K.lore("qsl_4", { t: "Cartolina QSL #4 · Casello Ferroviario Riviera (107.2 MHz)", d: "«Anche il rapido delle ventidue saluta col fischio quando Lupo manda la sigla dell'Ultimo Supplementare!»" });
    K.lore("qsl_5", { t: "Cartolina QSL #5 · Rimorchiatore Libeccio II (90.4 MHz)", d: "«Da marinai a marinai: tenete calda la valvola maestro, Cesare sarebbe fiero di questa ciurma.»" });
    K.lore("qsl_6", { t: "Cartolina QSL #6 · Gradinata Vecchia del '58 (103.6 MHz)", d: "«Siamo qui dietro la rete con trenta radioline accese all'unisono: il Molo Vecchio non si tocca!»" });
  }

  const E = C.create({
    id: "onde",
    key: "ali-di-rondine.onde",
    title: "Radio Fuorigioco · Onde Corte sul Golfo",
    icon: "📻",
    bg: "rf_titolo",
    chapters: 4,
    travel: true,
    menuSub: "Ottobre 1977. Un ex rimorchiatore carboniero a dodici miglia e mezzo dal Borgo, un trasmettitore pirata sui 99.9 MHz, furgoni ministeriali nella nebbia e uno stadio sul mare da salvare a colpi di rock e pallone.",
    heroLook: () => ({ bg: ["#451a03", "#f59e0b"], shirt: "#b45309" }),
    heroTitle: () => "voce in campo di Radio 99.9",
    theme: {
      accent: "#f59e0b",
      ink: "#1c130a",
      paper: "rgba(254,248,232,.97)",
      font: "'Trebuchet MS', 'M PLUS Rounded 1c', system-ui",
      chipBg: "#fde68a",
      chipBorder: "#b45309"
    },
    stats: {
      libero: [0, 12, 1, "Segnale Libero"],
      prudenza: [0, 12, 1, "Prudenza"],
      verita: [0, 12, 1, "Verità"],
      mito: [0, 12, 1, "Mito"],
      sintonia: [0, 10, 1, "Sintonia"]
    },
    item: ["Gettone 99.9", "Gettoni 99.9"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 11 + i) * 1.4);
      g.fillStyle = "#d97706";
      g.beginPath(); g.arc(0, 0, 4.5, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#fef3c7"; g.lineWidth = 1; g.stroke();
      g.fillStyle = "#78350f";
      g.fillRect(-3, -1.2, 6, 0.9);
      g.fillRect(-3, 0.8, 6, 0.9);
      g.restore();
    },
    weight: {
      name: "Linea Editoriale",
      axes: {
        libero: ["Segnale Libero", "📡"],
        prudenza: ["Prudenza", "🔇"],
        verita: ["Verità", "🎙️"],
        mito: ["Mito", "📼"]
      }
    },
    bonds: {
      per: 4,
      talk: 2,
      max: 5,
      names: ["Sconosciuti", "Ascoltatori", "Complici", "Soci d'Onda", "Equipaggio", "Famiglia dei 99.9"],
      scenes: {
        rf_nilde: [
          { lv: 2, id: "nil2", prize: "+1 Sintonia", lines: [["rf_nilde", "Quando mio padre accendeva il microfono rosso, io avevo dieci anni e reggevo il cronometro seduta su una cassa di arance."], ["rf_nilde", "Non dirlo a Lupo, ma stasera al mixer avevi il tempo giusto. Tre dita dal microfono, zero fruscio."]], reward: (K) => K.bond("sintonia", 1) },
          { lv: 4, id: "nil4", prize: "+1 Verità", lines: [["rf_nilde", "Per due inverni ho avuto il terrore del silenzio dopo mezzanotte. Credevo che senza i nastri di papà questa barca sarebbe affondata in un minuto."], ["rf_nilde", "Invece guardaci: il golfo intero batte il tempo sulle ringhiere. Forse posso parlare anch'io con la mia voce."]], reward: (K) => K.bond("verita", 1) }
        ],
        rf_lupo: [
          { lv: 2, id: "lup2", prize: "+1 Segnale Libero", lines: [["rf_lupo", "Vedi questi guanti consumati? Finale regionale del '64: parai un rigore buttandomi dalla parte dove cantava il jukebox del bar dietro la porta."], ["rf_lupo", "Il calcio e il rock a 45 giri sono la stessa identica arte: chi entra fuori tempo prende gol!"]], reward: (K) => K.bond("libero", 1) },
          { lv: 4, id: "lup4", prize: "+1 Sintonia", lines: [["rf_lupo", "Quando Cesare comprò questo rimorchiatore arrugginito avevamo in tasca tremila lire e due scatoloni di dischi bagnati."], ["rf_lupo", "Qualunque cosa succeda domenica coi sigilli del Ministero, grazie per averci fatto risentire una squadra vera, {n}."]], reward: (K) => K.bond("sintonia", 1) }
        ],
        rf_tullio: [
          { lv: 2, id: "tul2", prize: "+1 Prudenza", lines: [["rf_tullio", "Senti il cilindro numero tre? Fa tlac-tlac-pum. È un valzer lento, basta non mettergli fretta."], ["rf_tullio", "Prendi pure una sedia vicino alla caldaia quando hai freddo: il diesel brontola ma non tradisce mai."]], reward: (K) => K.bond("prudenza", 1) },
          { lv: 4, id: "tul4", prize: "+1 Verità", lines: [["rf_tullio", "Cesare mi fece giurare sul banco motore di non dire niente a nessuno finché Nilde non avesse imparato a tenere il timone nella burrasca."], ["rf_tullio", "Ho mantenuto il segreto per settecento notti. Ora che ci sei anche tu a darle spalla, questo vecchio stopper può finalmente respirare."]], reward: (K) => K.bond("verita", 1) }
        ],
        rf_wanda: [
          { lv: 2, id: "wan2", prize: "+1 Sintonia", lines: [["rf_wanda", "Dietro il bancone dell'Eldorado passano tutte le bugie della Riviera, ma i gettoni scanalati dicono sempre la verità."], ["rf_wanda", "Quando ti smarchi largo sulla fascia mi ricordi i ragazzi del '58: testa alta e zero paura del fango."]], reward: (K) => K.bond("sintonia", 1) },
          { lv: 4, id: "wan4", prize: "+1 Segnale Libero", lines: [["rf_wanda", "Ho tenuto da parte un gettone del primo anno dello stadio per diciannove inverni, aspettando una serata che valesse la chiamata."], ["rf_wanda", "Domenica non cadrà nessuna linea, te lo promette Wanda Bellini."]], reward: (K) => K.bond("libero", 1) }
        ],
        rf_valvola: [
          { lv: 2, id: "val2", prize: "+1 Sintonia", lines: [["rf_valvola", "Da tre metri vedo solo ombre colorate, ma se calci il pallone sento dal sibilo delle cuciture se stai mirando al primo o al secondo palo."], ["rf_valvola", "In campo fidati del mio fischio corto: dove c'è fruscio per gli altri, per noi c'è un corridoio spalancato."]], reward: (K) => K.bond("sintonia", 1) },
          { lv: 4, id: "val4", prize: "+1 Segnale Libero", lines: [["rf_valvola", "Prima di Radio Fuorigioco passavo le sere chiuso in soffitta a parlare in codice Morse coi mercantili di passaggio."], ["rf_valvola", "Adesso ho una maglia addosso e tutto il quartiere in cuffia. Non spegneranno mai quello che abbiamo acceso."]], reward: (K) => K.bond("libero", 1) }
        ],
        rf_valli: [
          { lv: 2, id: "vll2", prize: "+1 Verità", lines: [["rf_valli", "Non fraintenda la cortesia d'ufficio, giovanotto: il codice postale non prevede deroghe per i bei cross sul secondo palo."], ["rf_valli", "Però ammetto che vedere dei ragazzi difendere un campo di sabbia e scogli senza chiedere una lira… è merce rara, nel settantasette."]], reward: (K) => K.bond("verita", 1) },
          { lv: 4, id: "vll4", prize: "+1 Verità", lines: [["rf_valli", "Per diciannove anni non sono più passato davanti ai cancelli del Molo Vecchio. Giravo al largo persino in macchina."], ["rf_valli", "Credevo che Cesare si fosse dimenticato di quel pomeriggio del '58. Forse siamo stati soltanto due testardi troppo orgogliosi per alzare il telefono."]], reward: (K) => K.bond("verita", 1) }
        ]
      }
    },
    inv: {
      items: {
        rf_vinile: {
          n: "Vinile 45 Giri «Rondine Rock»",
          icon: "🎵",
          d: "Vinile rosso trasparente con etichetta scritta a pennarello; finché lo tieni nello zaino allarga la finestra ritmica in Onde d'Urto.",
          match: { te: 1 },
          gift: { rf_lupo: 6, rf_nilde: 3 },
          giftAny: 1,
          react: { rf_lupo: "La prima stampa della notte in cui comprammo il rimorchiatore! Credevo fosse finita in mare!" }
        },
        rf_gettone: {
          n: "Gettone Telefonico Fortunato del '58",
          icon: "🪙",
          d: "Vecchio gettone in bronzo a doppia scanalatura con un piccolo 8 inciso sul bordo.",
          match: { at: 1 },
          gift: { rf_wanda: 6, rf_valli: 4 },
          giftAny: 1,
          react: { rf_wanda: "Il gettone col numero otto! Lo custodivo per le chiamate che non devono cadere mai." }
        },
        rf_valvola_ambra: {
          n: "Valvola Termoionica d'Ambra",
          icon: "💡",
          d: "Tubo sottovuoto che tintinna in La maggiore; nello zaino attenua il disturbo statico sulla banda 99.9.",
          match: { df: 1 },
          gift: { rf_valvola: 6, rf_tullio: 3 },
          giftAny: 1,
          react: { rf_valvola: "Una ECC82 d'ambra! Senti come canta limpida appena la scaldi tra le mani!" }
        },
        rf_chiave: {
          n: "Chiave Inglese del Cantiere Vecchio",
          icon: "🔧",
          d: "Acciaio forgiato a mano pesante quanto un pallone bagnato, con tre tacche sul manico.",
          gift: { rf_tullio: 6, rf_lupo: 2 },
          giftAny: 1,
          react: { rf_tullio: "Finalmente qualcuno in questa barca di poeti e chitarristi capisce cos'è un regalo utile!" }
        },
        rf_nastro: {
          n: "Nastro Magnetico di Giunzione",
          icon: "📼",
          d: "Rotolino azzurro da montatore radiofonico per unire due spezzoni di voce senza far sentire il taglio.",
          gift: { rf_nilde: 6, rf_valvola: 3 },
          giftAny: 1,
          react: { rf_nilde: "Con uno identico papà mi insegnò a montare il mio primo jingle a dieci anni. Grazie davvero." }
        },
        rf_tazza: {
          n: "Tazza di Smalto al Caffè d'Orzo",
          icon: "☕",
          d: "Tazza bianca col bordo blu leggermente sbeccato che tiene caldo l'orzo amaro nei turni di nebbia.",
          gift: { rf_valli: 6, rf_wanda: 3 },
          giftAny: 1,
          react: { rf_valli: "Orzo bollente nella tazza col bordo blu… era quello che bevevamo nello spogliatoio del Molo prima delle trasferte d'inverno." }
        }
      }
    },
    cases: {
      appalto: {
        t: "Appalto Stadio del Molo Vecchio",
        q: "Dimostra che l'ordinanza di demolizione del Consorzio Costa Nuova è basata su un falso.",
        items: {
          perizia_falsa: { t: "Ordinanza di Sgombero Specchio", icon: "📄", kind: "prova", d: "Dichiara un cedimento dei piloni lato mare verificato dai tecnici il «14 ottobre alle ore 15:00»." },
          nota_gruista: { t: "Testimonianza del Gruista", icon: "🏗️", kind: "testimonianza", d: "Il 14 ottobre nessun tecnico è sceso sotto le tribune: i cancelli erano sbarrati e il gruista fu licenziato per aver chiesto il verbale." },
          mappa_frequenze: { t: "Mappa del Furgone Unità 04", icon: "📍", kind: "prova", d: "Appunto riservato: il Consorzio Costa Nuova ha prenotato le ruspe già il 2 ottobre, dodici giorni prima della presunta perizia." },
          registro_geometra: { t: "Registro Contabile del Geometra", icon: "📓", kind: "prova", d: "Collaudo originale firmato e custodito da Cesare Marini: i piloni in granito del Molo Vecchio sono solidi e privi di lesioni." }
        },
        links: [
          ["perizia_falsa", "nota_gruista", "Sopralluogo fantasma: il 14 ottobre i cancelli erano chiusi a chiave e nessun perito ha mai ispezionato i piloni!"],
          ["mappa_frequenze", "registro_geometra", "Demolizione premeditata: Specchio aveva noleggiato le ruspe dodici giorni prima della finta perizia, ignorando il collaudo sano!"]
        ],
        verdicts: [
          { id: "annullamento", label: "Chiedi al notaio l'annullamento immediato dell'appalto per falso", sub: "Smaschera pubblicamente il Consorzio Specchio", big: true },
          { id: "vincolo", label: "Chiedi il vincolo storico comunale sullo Stadio del Molo Vecchio", sub: "Tutela istituzionale per le tribune del '58", big: true }
        ]
      }
    },
    clock: {
      slots: ["Pomeriggio · Fascia Rock", "Sera · Radiocronaca", "Notte · L'Ultimo Supplementare"],
      hud: true,
      tint: [null, "rgba(245,158,11,.08)", "rgba(15,23,42,.24)"],
      onSlot(K, d, sl, nm) {
        if (sl === 2) return [["voce", "Scende la notte sul golfo: dal pennone della Rondine Rossa lampeggia la spia rossa di mezzanotte."]];
        return null;
      }
    },
    radio: {
      min: 88.0,
      max: 108.0,
      step: 0.1,
      start: 99.9,
      name: "Sintonizzatore AM/FM",
      icon: "📻",
      hud: true,
      presets(K) {
        const p = [[99.9, "99.9 Radio Fuorigioco"]];
        const ch = (K && K.mem && K.mem().ch) || 1;
        if (ch >= 1) p.push([91.2, "91.2 Ronda Banchina"], [88.6, "88.6 Peschereccio QSL"], [105.4, "105.4 Faro Est QSL"]);
        if (ch >= 2) p.push([94.6, "94.6 Portante Unità 04"], [96.8, "96.8 Soffitta QSL"], [107.2, "107.2 Casello QSL"]);
        if (ch >= 3) p.push([101.8, "101.8 Banco Magnetico"], [90.4, "90.4 Rimorchiatore QSL"]);
        if (ch >= 4) p.push([103.6, "103.6 Gradinata '58 QSL"]);
        return p;
      }
    },
    regions: {
      porto: { grass: ["#1e293b", "#263346", "#1a2436"], path: ["#475569", "#3b4758"], stone: ["#64748b", "#526074"], wall: ["#7c2d12", "#5c200d"], water: ["#0f2942", "#153454"], tall: "#334155", tree: ["#1e3a2f", "#27493b", "#162c24"], tint: "245,158,11", tintA: 0.07, fx: "dust", dark: 0.08 },
      studio: { grass: ["#3a4838", "#323f30", "#425240"], path: ["#5c3a21", "#4e301b"], stone: ["#475569", "#3b4758"], wall: ["#1f2937", "#111827"], water: ["#0f172a", "#1e293b"], tall: "#323f30", tree: ["#4b5563", "#374151"], tint: "251,191,36", tintA: 0.08, dark: 0.1 },
      bottega: { grass: ["#78350f", "#682d0c", "#853b12"], path: ["#92400e", "#7c360c"], stone: ["#44403c", "#383430"], wall: ["#451a03", "#2e1002"], water: ["#1c1917", "#292524"], tall: "#682d0c", tree: ["#b45309", "#92400e"], tint: "245,158,11", tintA: 0.09, dark: 0.12 },
      cortili: { grass: ["#475569", "#3f4c5e", "#516075"], path: ["#64748b", "#56657a"], stone: ["#94a3b8", "#7f90a6"], wall: ["#9a3412", "#7c2d12"], water: ["#1e3a5f", "#172d4a"], tall: "#3f4c5e", tree: ["#365314", "#3f6212", "#4d7c0f"], tint: "203,213,225", tintA: 0.06, fx: "dust", dark: 0.06 },
      furgone: { grass: ["#2c3e36", "#25352e", "#33473e"], path: ["#374151", "#2d3644"], stone: ["#4b5563", "#3f4854"], wall: ["#111827", "#090d16"], water: ["#064e3b", "#022c22"], tall: "#25352e", tree: ["#10b981", "#059669"], tint: "52,211,153", tintA: 0.07, dark: 0.14 },
      nave: { grass: ["#334155", "#2c3849", "#3b495e"], path: ["#7f1d1d", "#691717"], stone: ["#475569", "#3c4859"], wall: ["#451a03", "#292524"], water: ["#0b1930", "#13294b"], tall: "#2c3849", tree: ["#991b1b", "#7f1d1d"], tint: "56,189,248", tintA: 0.08, fx: "rain", dark: 0.12 },
      archivio: { grass: ["#3b2114", "#321b10", "#452718"], path: ["#5c3a21", "#4d301b"], stone: ["#44403c", "#363330"], wall: ["#1f110a", "#140b06"], water: ["#0f172a", "#1e293b"], tall: "#321b10", tree: ["#059669", "#047857"], tint: "251,191,36", tintA: 0.09, dark: 0.14 },
      stadio: { grass: ["#15803d", "#166534", "#188c43"], path: ["#475569", "#3c4859"], stone: ["#64748b", "#546275"], wall: ["#1e293b", "#0f172a"], water: ["#082f49", "#0c4a6e"], tall: "#166534", tree: ["#14532d", "#166534", "#15803d"], tint: "253,224,71", tintA: 0.06, dark: 0.04 }
    },
    floors: ",:+",
    floorPaint(K, f, sx, sy, tx, ty, fr) {
      if (f === ",") { FX.cobble(K.g, sx, sy, tx, ty, fr, K, ["#334155", "#293548"]); return true; }
      if (f === ":") { FX.planks(K.g, sx, sy, tx, ty, fr, K, ["#6b4423", "#59371c"]); return true; }
      if (f === "+") { FX.gravel(K.g, sx, sy, tx, ty, fr, K, ["#1e293b", "#273549"]); return true; }
      return false;
    },
    solid: "AMVRKPJGS",
    paint: {
      A(K, sx, sy, tx, ty, fr) { // Traliccio / antenna radio con spia rossa pulsante
        K.ground(sx, sy, tx, ty); const g = K.g;
        HD.R(g, sx + 3, sy + 13, 10, 2.5, "rgba(0,0,0,.35)");
        HD.R(g, sx + 6, sy + 1, 4, 14, "#cbd5e1");
        HD.R(g, sx + 2, sy + 4, 12, 1.5, "#94a3b8");
        HD.R(g, sx + 4, sy + 8, 8, 1.5, "#94a3b8");
        const on = Math.sin(fr / 14 + tx) > 0;
        HD.R(g, sx + 6.5, sy, 3, 3, on ? "#ef4444" : "#fde68a");
        if (on) K.light(sx + 8, sy + 2, 34, "251,191,36", 0.32);
      },
      M(K, sx, sy, tx, ty, fr) { // Banco mixer analogico con VU-meter e piatti
        K.ground(sx, sy, tx, ty); const g = K.g;
        HD.R(g, sx, sy + 4, 16, 11, "#5c3a21");
        HD.R(g, sx + 1, sy + 3, 14, 6, "#1e293b");
        HD.R(g, sx + 2, sy + 4, 4, 3, "#fef3c7");
        HD.R(g, sx + 10, sy + 4, 4, 3, "#dc2626");
        const rot = (fr >> 2) % 2;
        HD.R(g, sx + 6 + rot, sy + 5, 3, 2, "#34d399");
      },
      V(K, sx, sy, tx, ty) { // Scaffale di vinili 45 giri o casellario bobine
        K.ground(sx, sy, tx, ty); const g = K.g;
        const arch = K.ZX.rk === "archivio";
        HD.R(g, sx + 1, sy + 1, 14, 14, arch ? "#3b2114" : "#92400e");
        for (let r = 0; r < 2; r++) {
          HD.R(g, sx + 2, sy + 3 + r * 6, 12, 4, "#1c1917");
          for (let i = 0; i < 4; i++) {
            HD.R(g, sx + 2.5 + i * 3, sy + 3.5 + r * 6, 2, 3, arch ? "#fef3c7" : ["#ef4444", "#eab308", "#38bdf8", "#f8fafc"][(tx + i + r) % 4]);
          }
        }
      },
      R(K, sx, sy, tx, ty, fr) { // Apparecchio oscilloscopio / radio a valvole
        K.ground(sx, sy, tx, ty); const g = K.g;
        HD.R(g, sx + 1, sy + 3, 14, 11, "#374151");
        HD.R(g, sx + 2, sy + 4, 8, 6, "#022c22");
        HD.R(g, sx + 3, sy + 6 + Math.round(Math.sin(fr / 8 + tx)), 6, 1.5, "#34d399");
        HD.R(g, sx + 11, sy + 5, 3, 3, "#f59e0b");
      },
      K(K, sx, sy, tx, ty) { // Cabina telefonica SIP arancione / telefono a gettoni
        K.ground(sx, sy, tx, ty); const g = K.g;
        HD.R(g, sx + 2, sy + 1, 12, 14, "#ea580c");
        HD.R(g, sx + 4, sy + 3, 8, 7, "#fef08a");
        HD.R(g, sx + 1, sy, 14, 2, "#c2410c");
        K.light(sx + 8, sy + 6, 32, "245,158,11", 0.28);
      },
      P(K, sx, sy, tx, ty, fr) { // Lampione al sodio anni '70 / torre faro
        K.ground(sx, sy, tx, ty); const g = K.g;
        HD.R(g, sx + 6.5, sy + 2, 3, 13, "#64748b");
        HD.R(g, sx + 4, sy, 8, 3, "#fde68a");
        K.light(sx + 8, sy + 2, 56, "245,158,11", 0.34 + Math.sin(fr / 22) * 0.03);
      },
      J(K, sx, sy, tx, ty) { // Furgone giallo ministeriale / ruspa del Consorzio
        K.ground(sx, sy, tx, ty); const g = K.g;
        HD.R(g, sx, sy + 3, 16, 11, "#eab308");
        HD.R(g, sx + 2, sy + 4, 12, 4, "#bae6fd");
        HD.R(g, sx + 2, sy + 12, 4, 3, "#0f172a");
        HD.R(g, sx + 10, sy + 12, 4, 3, "#0f172a");
      },
      G(K, sx, sy, tx, ty, fr) { // Motore diesel / generatore navale caldo
        K.ground(sx, sy, tx, ty); const g = K.g;
        const vib = (fr >> 1) % 2;
        HD.R(g, sx + 1, sy + 3 + vib * 0.5, 14, 11, "#44403c");
        HD.R(g, sx + 3, sy + 1 + vib, 4, 4, "#cbd5e1");
        HD.R(g, sx + 9, sy + 2 - vib * 0.5, 4, 4, "#f97316");
      },
      S(K, sx, sy, tx, ty) { // Bitta d'ormeggio / cumulo di sacchi di carbone
        K.ground(sx, sy, tx, ty); const g = K.g;
        HD.R(g, sx + 2, sy + 6, 12, 8, "#0f172a");
        HD.R(g, sx + 4, sy + 4, 8, 4, "#334155");
        HD.R(g, sx + 6, sy + 5, 4, 1.5, "#f8fafc");
      }
    },
    act: {
      A: "Guarda l'antenna",
      M: "Usa il banco mixer",
      V: "Sfoglia dischi e bobine",
      R: "Osserva l'oscilloscopio",
      K: "Usa il telefono a gettoni",
      P: "Guarda il lampione",
      J: "Ispeziona il mezzo",
      G: "Controlla il generatore",
      S: "Guarda l'ormeggio",
      n: "Leggi l'avviso",
      x: "Apri la cassa",
      s: "Siediti un momento"
    },
    rest: {
      ch: "s",
      label: "Fermati in ascolto",
      text: "Ti appoggi un istante ad ascoltare il fruscio del mare e dei 99.9 MHz. I progressi si salvano da soli; da qui puoi sfogliare il Giornale di Bordo."
    },
    texts: {
      nothing: "Solo salsedine, cavi di rame e il ronzio lontano di un trasformatore.",
      noHero: "Per salire a bordo della Rondine Rossa serve un nome in distinta. Crea prima il tuo Campione.",
      chestOpen: "Apri la cassa da stiva.",
      chestEmpty: "La cassa è già stata svuotata."
    },
    journal: {
      name: "Il Giornale di Bordo 99.9",
      sub: "Frequenze QSL, Dossier Specchio, rapporti e finali"
    },
    musicMain: "onde",
    music: {
      onde: {
        bpm: 116,
        chords: ["Am", "F", "C", "G", "Am", "F", "G", "Am"],
        lres: 2,
        lw: "triangle",
        lv: 0.042,
        lead: "A4 - C5 - E5 - D5 - | C5 - A4 - G4 - - - | E4 - G4 - C5 - B4 - | D5 - B4 - G4 - - - | A4 - C5 - E5 - G5 - | F5 - E5 - C5 - A4 - | B4 - C5 - D5 - B4 - | A4 - - - - - - -",
        bass: "R . . R . . 5 . R . . R . 5 . .",
        bv: 0.09,
        arp: "1 3 5 3 1 3 5 3",
        aw: "sine",
        av: 0.014,
        drum: "k . h . s . h . k . k h s . h .",
        dv: 0.1
      }
    },
    guide: () => [
      ["💿 Onde d'Urto · Calcio su Frequenza", "Nel minigioco 2D muovi il giocatore col pad o WASD/Frecce, scegli tra le <b>3 Bande MHz</b> (<i>88.4 Bassi</i>, <i>99.9 Onda Pirata</i>, <i>104.2 Acuto</i>) per evitare i coni di fruscio statico e tocca <b>Passa</b> o <b>Tira</b> quando l'anello si chiude sul battito del 45 giri per scatenare l'<b>Onda d'Urto</b>!"]
    ],
    endings: {
      cooperativa: [
        "Cooperativa Onde del Golfo (FM 100.0)",
        "L'appalto truccato viene annullato davanti al notaio: lo Stadio del Molo Vecchio diventa bene storico comunale e la Rondine Rossa ottiene regolare concessione al molo. A mezzanotte Nilde inaugura i 100.0 MHz parlando per la prima volta con la propria voce.",
        "Vinci la finale dopo aver smascherato l'appalto con il Dossier e un equilibrio tra Segnale Libero e Verità."
      ],
      pirati: [
        "I Corsari delle Dodici Miglia",
        "La folla salva i cancelli dello stadio e Specchio fugge sotto i fischi, ma l'ingresso non autorizzato in porto fa scattare il sequestro. Un minuto prima dei sigilli, Tullio molla le cime: la Rondine Rossa riprende il largo salutata dalle torce della Curva.",
        "Vinci la finale spingendo al massimo il Segnale Libero o diffondendo la Bobina 000 dagli altoparlanti."
      ],
      ciclostile: [
        "Il Ciclostile del Lunedì",
        "I sigilli di piombo spengono il trasmettitore dopo un ultimo pezzo rock suonato a finestre spalancate. Ma l'indomani nello scantinato di Lupo Zappa parte un ciclostile a inchiostro blu: nasce «Fuorigioco Stampato», distribuito davanti allo stadio presidiato dal quartiere.",
        "Scegli la via della Prudenza, accetta lo sponsor del Consorzio o cedi nella sfida finale allo Stadio."
      ],
      bobina1096: [
        "La Bobina 1.096 · Il Terzo Tempo di Cesare e Aristide",
        "All'alba di lunedì, l'Ispettore Valli — andato in pensione anticipata — sale sulla Rondine Rossa senza impermeabile ministeriale, con un nastro vergine e le vecchie scarpe del '58. Insieme a Nilde, Lupo, Tullio e al Campione incidete dal vivo la Bobina 1.096 mentre sul golfo spunta il sole.",
        "Segreto: sintonizza tutte e 6 le Cartoline QSL, rifiuta lo sponsor di Specchio, porta a 4+ cuori Nilde e Valli, porgi le cuffie in privato nella Torretta e vinci la finale senza errori nell'ultimo giro di vinile."
      ]
    },
    guest: {
      id: "rf_lupo",
      lines: [
        ["rf_lupo", "Ehi {n}, tieni d'occhio i gabbiani sul lampione: quando sbattono le ali in quattro quarti vuol dire che sui 99.9 sta per partire un contropiede coi fiocchi!"],
        ["rf_lupo", "Mi hanno offerto una radio moderna che non gracchia mai… l'ho restituita subito: senza un pizzico di fruscio di mare, un gol al novantesimo perde metà del sapore."]
      ]
    },
    cameos: [
      {
        id: "sf_mira",
        zone: "rf_cabina",
        at: [15, 9],
        when: (K) => { const s = K.otherSaga("ali-di-rondine.stagione"); return !!(s && s.ends && s.ends.length); },
        talk(K) {
          K.say([["sf_mira", "Prendevo i vostri 99.9 MHz di rimbalzo fin sulle colline di Radio Lago! Dì a Nilde che una voce vera in diretta vale più di mille repliche."]], () => {
            const m = K.reward("cam_rf_mira", { coins: 25 });
            if (m.length) K.say([["voce", "<b>" + m.join(" · ") + "</b>"]], K.done); else K.done();
          });
        }
      },
      {
        id: "mn_desantis",
        zone: "rf_bar",
        at: [5, 9],
        when: (K) => { const s = K.otherSaga("ali-di-rondine.milano"); return !!(s && s.ends && s.ends.length); },
        talk(K) {
          K.say([["mn_desantis", "Conosco Aristide Valli dai tempi dei tornei interforze del '56. Uomo tutto d'un pezzo: se vi lascia novanta minuti, fateli bastare."]], () => {
            const m = K.reward("cam_rf_desantis", { coins: 25 });
            if (m.length) K.say([["voce", "<b>" + m.join(" · ") + "</b>"]], K.done); else K.done();
          });
        }
      }
    ],
    onReady(K) {
      registerPeopleAndCos(K);
    }
  });

  window.__ondeH = function (K) {
    registerPeopleAndCos(K);
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts, bg) => {
        const l = H.flush();
        const go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn })), bg);
        if (l.length) K.say(l, go); else go();
      },
      wask: (who, prompt, opts, bg) => {
        const l = H.flush();
        const go = () => K.weight.ask(who || "voce", prompt, opts, bg);
        if (l.length) K.say(l, go); else go();
      },
      plaque(g, txt, x, y, col) {
        g.save();
        g.font = "700 6px 'Trebuchet MS', sans-serif";
        const w = g.measureText(txt).width + 8;
        g.fillStyle = "rgba(18,12,6,.88)";
        g.fillRect(x - w / 2, y - 4, w, 9);
        g.strokeStyle = col || "#f59e0b";
        g.lineWidth = 1;
        g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8);
        g.fillStyle = col || "#fde68a";
        g.textAlign = "center";
        g.fillText(txt, x, y + 3);
        g.restore();
      },
      playUrto(opts, after) {
        const l = H.flush();
        const launch = () => {
          const bonus = {
            beatTol: (K.inv.has("rf_vinile") ? 0.03 : 0) + (K.stat("sintonia") >= 4 ? 0.02 : 0),
            staticResist: K.inv.has("rf_valvola_ambra")
          };
          K.ownMatch(window.__urto.start, Object.assign({ bonus }, opts, { done: after }));
        };
        if (l.length) K.say(l, launch); else launch();
      }
    };
    return H;
  };

  window.__onde = E.api;
  window.__ondeCore = E;
})();
