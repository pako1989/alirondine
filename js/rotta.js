// js/rotta.js - «ROTTA 66 · IL GIGANTE STANCO» · configurazione della saga sul motore comune (js/saga-core.js)
// Una squadra di Terza Categoria e un pullman scassato verso la finale della Coppa dei Borghi. Ironia di base, qualche pausa seria.
// Usa dal core: Rotta (cfg.route, NOVITÀ: viaggio a tappe con risorse), statistiche come risorse, Rapporti, Inventario, orologio, interni automatici, K.playMatch.
(function () {
  "use strict";
  if (window.__rotta || !window.__sagaCore) return;
  const E = window.__sagaCore.create({
    id: "rotta", key: "ali-di-rondine.rotta", title: "Rotta 66", icon: "🚌", bg: "ro_titolo", chapters: 3,
    menuSub: "Un pullman scassato, una squadra di Terza Categoria e una finale lontana. Benzina, umore e cassa: decidi tu come arrivarci.",
    theme: { accent: "#f59e0b", ink: "#1c1917", paper: "rgba(253,246,227,.96)", font: "'Trebuchet MS', Georgia, serif", chipBg: "#fde68a", chipBorder: "#92400e" },
    stats: { benza: [0, 9, 6, "Benzina"], umore: [0, 9, 6, "Umore"], cassa: [0, 99, 40, "Cassa"] },
    regions: {
      paese: { grass: ["#7a9a5a", "#6e8e50", "#86a666"], path: ["#cbb98f", "#bfad84"], stone: ["#a39d90", "#968f82"], wall: ["#d6c4a0", "#c8b690"], water: ["#3a86b8", "#337aab"], tree: "#3e6a38", tint: "255,226,170", tintA: 0.06 },
      monte: { grass: ["#8aa89a", "#7e9c8e", "#96b4a6"], path: ["#b8b0a2", "#aca498"], stone: ["#8a929a", "#7e868e"], wall: ["#6a727a", "#5e666e"], water: ["#3a76a8", "#316c9c"], tree: "#2e5a3a", tint: "210,225,255", tintA: 0.1, fx: "fog" },
      lago: { grass: ["#6aa27a", "#5e966e", "#76ae86"], path: ["#d0c298", "#c4b68c"], stone: ["#a8a8a0", "#9c9c94"], wall: ["#d9c9a8", "#cbbb9a"], water: ["#3a86b8", "#337aab"], tree: "#2e6a3a", tint: "255,206,150", tintA: 0.08 },
      stadio: { grass: ["#3f8a4a", "#388043", "#47944f"], path: ["#c9b98a", "#bda97a"], stone: ["#8a8a8a", "#7a7a7a"], wall: ["#54545e", "#484852"], water: ["#3a86b8", "#337aab"], tree: "#2e5a2a", tint: "255,240,200", tintA: 0.05 }
    },
    floors: ".",
    act: { q: "Entra", v: "Esci" },
    item: ["Spillette del Gigante", "Spillette del Gigante"],
    journal: { name: "Il Libro di Bordo", sub: "Rotta, risorse e compagni di viaggio" },
    route: {
      start: "ro_paese",
      nodes: {
        ro_paese: { t: "Sant'Anselmo", icon: "🏠", zone: "ro_paese" },
        ro_passo: { t: "Passo del Gigante", icon: "⛰️", zone: "ro_passo" },
        ro_autogrill: { t: "Autogrill Il Tordo", icon: "⛽", zone: "ro_autogrill" },
        ro_lago: { t: "Pontile del Lago", icon: "⚓", zone: "ro_lago" },
        ro_borgo: { t: "Borgo del Lago", icon: "🏘️", zone: "ro_borgo" },
        ro_valle: { t: "Valcampo", icon: "🏟️", zone: "ro_valle" },
        ro_stadio: { t: "Stadio della Finale", icon: "🏆", zone: "ro_stadio" }
      },
      edges: [
        ["ro_paese", "ro_passo", { benza: 2 }, { when: (K) => K.stepOf(1) >= 1, ev: (K) => [["voce", "Il pullman affronta la salita come un anziano il tram: borbottando, ma con dignità. I tornanti diventano sette, poi nove, poi un sospetto."]] }],
        ["ro_passo", "ro_autogrill", { benza: 1 }, { when: (K) => K.stepOf(1) >= 2, ev: (K) => [["voce", "In discesa il Gigante ritrova la giovinezza. Frena un po' meno e russa un po' di più."]] }],
        ["ro_autogrill", "ro_lago", { benza: 2 }, { when: (K) => K.stepOf(2) >= 1, ev: (K) => [["voce", "La strada costeggia una pianura piatta. Poi, dietro una curva, il lago: grande, tranquillo, e per niente un mare."]] }],
        ["ro_lago", "ro_borgo", { cassa: 10 }, { when: (K) => K.stepOf(2) >= 1, ev: (K) => [["voce", "Il traghetto parte quando è pronto. Per quaranta minuti la squadra si dimentica che esiste una partita."]] }],
        ["ro_lago", "ro_borgo", { benza: 2, umore: 1 }, { when: (K) => K.stepOf(2) >= 1 && !K.F.is("ro_traghetto_ok"), ev: (K) => [["voce", "La strada del lago ha più curve che argomenti. Dopo l'ottava, Tino cede e chiede scusa al finestrino."]] }],
        ["ro_borgo", "ro_valle", { benza: 2 }, { when: (K) => K.stepOf(2) >= 2, ev: (K) => [["voce", "Ultimo tratto. Il paesaggio si appiattisce, i cartelli si moltiplicano e uno di questi ha il nome della finale."]] }],
        ["ro_valle", "ro_stadio", {}, { when: (K) => K.stepOf(3) >= 1 }]
      ],
      rescue: { label: "Fai l'autostop per la benzina", stat: "benza", n: 2, cost: { umore: 2 }, text: "Un camionista di passaggio vi regala due taniche di benzina e una predica sulla manutenzione. L'umore ne risente, la benzina no." }
    },
    bonds: {
      per: 6, max: 4, names: ["Compagni", "Colleghi", "Amici", "Fidati", "Famiglia"],
      scenes: {
        ro_fiamma: [{ lv: 2, id: "fia2", lines: [["ro_fiamma", "Una cosa che non dico a nessuno: dopo questa finale lascio il calcio. Mi trasferisco, per lavoro. Ho già il biglietto."], ["ro_fiamma", "Non dirlo agli altri. Voglio una partita normale. Poi, quando si torna, vedo io."]], reward: (K) => K.bond("umore", 1) }, { lv: 3, id: "fia3", prize: "+2 Umore e +1 Benzina", lines: [["ro_fiamma", "Non lascio più. Il biglietto l'ho cambiato: lavoro e calcio si possono fare insieme, basta litigare con il capo."], ["ro_fiamma", "Per festeggiare, ti regalo i guanti di scorta. Portano fortuna, o almeno si lamentano meno."]], reward: (K) => { K.bond("umore", 2); K.bond("benza", 1); } }],
        ro_tino: [{ lv: 2, id: "tin2", lines: [["ro_tino", "Faccio il buffone perché mio padre faceva il serio. Ora è serio da solo, e io sto qui, in un pullman, con altri sbagliati."], ["ro_tino", "Ma tu lo sai, vero? Che qui mi sento a casa."]], reward: (K) => K.bond("umore", 1) }, { lv: 3, id: "tin3", prize: "+20 Cassa e +1 Umore", lines: [["ro_tino", "Mio padre mi ha scritto. Una riga: «Bravo». La tengo nel portafoglio, accanto alle cose che non spendo."], ["ro_tino", "E tieni questi venti: li avevo nascosti nei calzini. Non farmi domande, e non odorarli."]], reward: (K) => { K.bond("cassa", 20); K.bond("umore", 1); } }],
        ro_osvaldo: [{ lv: 2, id: "osv2", lines: [["ro_osvaldo", "Il Gigante era di mio padre. Faceva la linea Sant'Anselmo-Valcampo ogni domenica. Poi lui non c'è più stato, e io ho preso il volante."], ["ro_osvaldo", "Non l'ho mai portato fino a Valcampo. Stavolta sì. Non dirlo al pullman: si monta la testa."]], reward: (K) => K.bond("benza", 1) }, { lv: 3, id: "osv3", prize: "+4 Benzina", lines: [["ro_osvaldo", "Ho riempito il serbatoio fino all'orlo. Il Gigante ha ringraziato: ha tossito una volta sola."], ["ro_osvaldo", "Se vuoi guidare tu, domani, un chilometro. Uno solo. Poi lo riprendo."]], reward: (K) => { K.bond("benza", 4); } }],
        ro_ersilia: [{ lv: 2, id: "ers2", lines: [["ro_ersilia", "Mio marito ha fondato questa squadra nel '62. Non è mai arrivato in finale. Io lo porto, a modo mio: nel bagagliaio."], ["ro_ersilia", "Non è una cosa per cui ridere. Anche se, un pochino, lo è."]], reward: (K) => K.bond("umore", 2) }, { lv: 3, id: "ers3", prize: "+20 Cassa e +1 Umore", lines: [["ro_ersilia", "Mio marito avrebbe voluto vederti giocare. Ti lascio il suo portafoglio di fondatore: dentro ci sono due banconote e una foto."], ["ro_ersilia", "Le banconote spendile. La foto, no."]], reward: (K) => { K.bond("cassa", 20); K.bond("umore", 1); } }]
      }
    },
    inv: {
      items: {
        ro_cornetto: { n: "Cornetto del Bar Anselmo", icon: "🥐", d: "Ancora caldo. Un buon argomento per Tino.", gift: { ro_tino: 6, ro_ersilia: 3 }, giftAny: 2 },
        ro_sciarpa: { n: "Sciarpa di Sant'Anselmo", icon: "🧣", d: "Rossa e blu, lavorata a mano da qualcuno che sapeva calcio e non maglia.", gift: { ro_fiamma: 6, ro_ersilia: 6 }, giftAny: 2 },
        ro_cartina: { n: "Cartina del 1974", icon: "🗺️", d: "Segna strade che non esistono più. Osvaldo la considera ancora affidabile.", gift: { ro_osvaldo: 8 }, react: { ro_osvaldo: "La cartina di mio padre! Con le sue note a margine. Grazie. Davvero." } }
      }
    },
    clock: {
      slots: ["Mattina", "Pomeriggio", "Sera", "Notte"], hud: true, tint: [null, null, "rgba(251,146,60,.14)", "rgba(15,23,60,.30)"],
      onSlot(K, giorno, fascia, nome) { return nome === "Notte" ? [["voce", "Cala la notte. Nel pullman qualcuno russa a tempo, qualcuno sogna una rete e qualcuno controlla il serbatoio con lo sguardo."]] : null; }
    },
    endings: {
      coppa: ["La Coppa sul Pullman", "Vittoria, e il Gigante torna a Sant'Anselmo con la coppa sul sedile accanto all'autista.", "Vinci la finale con Umore 7 o più."],
      stanca: ["La Vittoria Stanca", "Hai vinto, ma il viaggio ti è costato più di quello che vale una coppa.", "Vinci la finale con Umore sotto 7."],
      onore: ["Sconfitti, Insieme", "Battuti in finale, ma il pullman torna cantando. Per ora, basta.", "Perdi la finale con Umore 6 o più."],
      strada: ["Il Ritorno in Silenzio", "Sconfitta e silenzio. Il Gigante, almeno, non si lamenta.", "Perdi la finale con Umore basso."]
    },
    heroLook: () => ({ bg: ["#78350f", "#fbbf24"], shirt: "#b91c1c" }),
    heroTitle: () => "tuttofare dell'FC Sant'Anselmo",
    musicMain: "rotta",
    music: { rotta: { bpm: 112, chords: ["C", "G", "Am", "F", "C", "G", "F", "C"], lres: 2, lw: "triangle", lv: 0.04,
      lead: "E5 - G5 - C6 - B5 - | A5 - G5 - E5 - - - | F5 - A5 - C6 - A5 - | G5 - - - E5 - - - | E5 - G5 - C6 - B5 - | C6 - E6 - C6 - G5 - | A5 - F5 - A5 - C6 - | C6 - - - - - - -",
      bass: "R . . 5 . . R . . 5 . . R . 5 .", bv: 0.09, arp: "1 5 1 5 1 5 1 5", aw: "triangle", av: 0.012, drum: "k . . h . . s . . h . . k . h .", dv: 0.11 } },
    cameos: [],
    stadium: { azPitch: "campo", cageField: 1, cageMut: "heavy", venue: { ads: [["SANT'ANSELMO", "#1d4ed8"], ["BAR ANSELMO", "#b91c1c"], ["IL GIGANTE STANCO", "#d97706"], ["COPPA DEI BORGHI", "#16a34a"]], crowd: ["#1d4ed8", "#b91c1c", "#f4f0e4"], ground: ["#2f7d3e", "#2a7438"], line: "#f4f0e4", sky: ["#7ec0ee", "#fde7b8"], wall: ["#5a5a64", "#4a4a54"], glow: "255,240,200" } }
  });
  window.__rotta = E.api; window.__rottaCore = E;
})();
