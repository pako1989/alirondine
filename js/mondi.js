// js/mondi.js - IL TORNEO DEI MONDI · l'incontro tra le saghe (motore comune: js/saga-core.js)
// Un'eclissi apre tredici porte nell'Atrio, una piazza fuori dal tempo. Dietro ogni porta c'è il mondo di una saga:
// la porta si apre solo se quella saga l'hai finita (almeno un finale). Il campione di ogni mondo ti sfida nel SUO motore
// di partita (Vignette, ATB, Super-Bottoni, Il Nastro, Luci; il campo classico per le altre), e si ricorda di te:
// legge il salvataggio della sua saga e sa come l'hai finita.
// Novità: la SQUADRA MISTA (compagni presi da mondi diversi, ognuno con il suo vantaggio nel motore del suo mondo),
// la FINALE A STAFFETTA (tre frazioni, tre motori diversi, un punteggio solo) e i SIGILLI dei mondi.
// Salvataggio proprio: ali-di-rondine.mondi. Ricompense: monete, cosmetici, Cineteca e Sala Giochi.
(function () {
  "use strict";
  if (window.__mondi || !window.__sagaCore) return;
  const TS = 16;
  // i tredici mondi: chiave di salvataggio, modulo, motore, campione, alleato, colore della porta
  const WORLDS = [
    { id: "torneo", t: "Il Torneo delle Cento Scuole", e: "🏆", key: "ali-di-rondine.torneo", mod: "__torneo", eng: "vignette", champ: "ts_ettore", ally: "ts_iole", col: "#e83a3a", bg: "ts_porto", perk: "Vignette: due azioni in più", line: "Ho imparato a perdere senza vergogna, ricordi? Adesso vediamo se tu hai imparato a vincere fuori dal tuo mondo." },
    { id: "cronache", t: "Le Cronache del Pallone di Cristallo", e: "💠", key: "ali-di-rondine.cronache", mod: "__cronache", eng: "atb", champ: "cc_re", ally: "cc_lyra", col: "#9ad8ff", bg: "cc_titolo", perk: "ATB: più cristallo per le magie", line: "(Il Re del Silenzio alza i guanti.) …Questa volta esulterò io. Per te, se segni. Promesso." },
    { id: "mantello", t: "Il Mantello Granata", e: "🦸", key: "ali-di-rondine.mantello", mod: "__mantello", eng: "bottoni", champ: "mg_dottore", ally: "mg_bullone", col: "#d82a3a", bg: "mg_titolo", perk: "Super-Bottoni: un tiro in più", line: "[furbo] Regolare. Tutto regolare. Ma in un altro mondo, chissà: forse il fuorigioco è a destra." },
    { id: "stagione", t: "Stagione Infinita", e: "📼", key: "ali-di-rondine.stagione", mod: "__stagione", eng: "nastro", champ: "sf_teo", ally: "sf_ada", col: "#e8c84a", bg: "sf_titolo", perk: "Il Nastro: un riavvolgimento in più", line: "Ehi, rivale. Qui non è domenica e non è lunedì. È un giorno nuovo. Giochiamolo una volta sola." },
    { id: "lampioni", t: "La Notte dei Lampioni", e: "🏮", key: "ali-di-rondine.lampioni", mod: "__lampioni", eng: "luci", champ: "nl_leandro", ally: "nl_fiammetta", col: "#ffd27a", bg: "nl_titolo", perk: "Luci: una lanterna in più", line: "[ride] Un'eclissi! Per noi Ombre è come una festa a sorpresa. Giochiamo al buio, come piace a noi." },
    { id: "vento", t: "La Valle del Vento Gentile", e: "🍃", key: "ali-di-rondine.vento", mod: "__vento", eng: "kit", champ: "ve_ottone", ally: "ve_sbuffo", col: "#7ab86a", bg: "ve_valle", line: "Il vento delle porte è strano, viene da tredici parti insieme. Ma un buon mago gioca anche col vento contro." },
    { id: "detective", t: "Detective di Campo", e: "🔎", key: "ali-di-rondine.detective", mod: "__detective", eng: "kit", champ: "dc_vanni", ally: "dc_agata", col: "#d8b46a", bg: "dc_porto", line: "Ci rivediamo. Qui non ci sono prove, solo il campo. E sul campo, lo sai, non si può truccare niente." },
    { id: "dopo", t: "Dopo il Campione", e: "⏳", key: "ali-di-rondine.dopo", mod: "__dopo", eng: "kit", champ: "ep_bruno", ally: "ep_tecla", col: "#c8a878", bg: "ep_campo", line: "Nel 1928 giocavamo con le scarpe chiodate e i palloni di cuoio pesanti come mattoni. Vediamo come te la cavi con un vecchio." },
    { id: "spazio", t: "Calcio Spaziale", e: "🚀", key: "ali-di-rondine.spazio", mod: "__spazio", eng: "kit", champ: "so_gru", ally: "so_blop", col: "#5a8ad8", bg: "so_stazione", line: "Comandante Gru. Qui la gravità è normale, che noia. Allora vinciamo con la tattica." },
    { id: "muro", t: "Il Muro", e: "🧱", key: "ali-di-rondine.muro", mod: "__muro", eng: "kit", champ: "mu_saverio", ally: "mu_nives", col: "#8a8a9a", bg: "mu_muro", line: "Oltre il muro c'era un mondo. Oltre le porte ce ne sono tredici. Una partita per ogni muro che abbiamo buttato giù." },
    { id: "cristalli", t: "Cristalli del Campo", e: "💎", key: "ali-di-rondine.cristalli", mod: "__cristalli", eng: "kit", champ: "cr_bram", ally: "cr_aira", col: "#b88aff", bg: "cr_borgo", line: "Livello massimo raggiunto. Nuova sfida sbloccata: tu. Premi INIZIO per giocare." },
    { id: "doppio", t: "Doppio Turno", e: "🪞", key: "ali-di-rondine.doppio-turno", mod: "__doppioTurno", eng: "kit", champ: "dt_valtorre", ally: "dt_nina", col: "#6a6aaa", bg: "dt_atrio", line: "Due metà dello stesso campione, e adesso tredici porte. Ti riconosco: sei quello intero." },
    { id: "libro", t: "Il Libro che Mangiava i Finali", e: "📖", key: "ali-di-rondine.libro-finali", mod: "__libroFinali", eng: "kit", champ: "lb_lupo", ally: "lb_virgola", col: "#c8742a", bg: "lb_copertina", line: "C'era una volta un lupo che giocava a pallone. Questa volta il finale lo scriviamo in campo. Niente da mangiare, giuro." },
  ];
  const POS = { "4,3": "torneo", "8,3": "cronache", "12,3": "mantello", "17,3": "stagione", "21,3": "lampioni", "25,3": "vento", "4,18": "detective", "8,18": "dopo", "12,18": "spazio", "17,18": "muro", "21,18": "cristalli", "25,18": "doppio", "28,10": "libro" };
  const E = window.__sagaCore.create({
    id: "mondi", key: "ali-di-rondine.mondi", title: "Il Torneo dei Mondi", icon: "🌒", bg: "tm_titolo", chapters: 3,
    menuSub: "Un'eclissi apre tredici porte: i campioni di tutte le saghe che hai finito ti sfidano nel loro modo di giocare",
    theme: { accent: "#ffd23f", ink: "#f4f0ff", paper: "rgba(14,10,30,.9)", font: "'Trebuchet MS', sans-serif", chipBg: "#1a1030ee", chipBorder: "#ffd23f" },
    stats: { sigilli: [0, 99, 0, "Sigilli dei mondi"], legami: [0, 99, 0, "Legami tra i mondi"] },
    travel: false,
    item: ["Frammento d'eclissi", "Frammenti"],
    party: (K) => WORLDS.map((w) => w.ally).filter((id) => K.F.is("ally_" + id)).slice(0, 3),
    regions: {
      atrio: { grass: ["#3a2a5a", "#3e2e5e", "#362656"], path: ["#8a7aa8", "#8274a0"], stone: ["#9a8ab8", "#9484b2"], wall: ["#2a1a4a", "#241644"], water: ["#3a2a8a", "#40309a"], tall: "#5a4a8a", tree: ["#2a1a4a", "#3a2a5a", "#1a1030"], tint: "200,170,255", tintA: 0.1, fx: "fireflies", dark: 0.12 },
    },
    floors: "", solid: "P",
    rest: { ch: "s", label: "Siediti sulla panchina dell'Atrio", text: "Ti siedi. Dalle porte arrivano suoni di tredici mondi diversi: un fischietto, un carillon, un tram, una campana, un drago che starnutisce. (Il gioco salva da solo.)" },
    texts: { chestOpen: "Apri lo scrigno.", chestEmpty: "Lo scrigno è vuoto. Sul fondo, tredici graffi, come tredici chiavi.", nothing: "Niente. Solo l'eco delle porte.", noHero: "Le porte aspettano un campione. Prima crea il tuo Campione.", chapters: "Tre capitoli. Più saghe hai finito, più porte si aprono." },
    journal: { name: "Il Registro dei Mondi", sub: "Porte, sigilli, squadra mista, finali" },
    endings: {
      ritorno: ["IL RITORNO", "L'eclissi finisce, le porte si chiudono una a una. Torni al Borgo Marino con le tasche piene di ricordi di tredici mondi. Ogni tanto, la notte, senti ancora un carillon.", "Sempre possibile, alla fine."],
      ponte: ["I PONTI TRA I MONDI", "Le porte non si chiudono: diventano ponti. Il Borgo Marino diventa la piazza di tutti i mondi, e la domenica c'è sempre qualcuno nuovo al campetto.", "Serve il sigillo di ogni porta che hai aperto (almeno cinque)."],
      squadra: ["LA SQUADRA MISTA", "La tua squadra di tre mondi diversi non si scioglie: diventa la prima squadra interdimensionale della storia. Si allena il giovedì, in un mondo diverso ogni settimana.", "Serve una squadra di tre compagni da tre mondi diversi."],
      tutti: ["TUTTI I MONDI", "Tredici sigilli, tredici mondi, una sola eclissi. Il Custode delle Porte si toglie il cappuccio: sotto c'è un volto che conosci benissimo. È il tuo. Il te di tutte le saghe, che ti aspettava qui.", "Segreto: tutte le tredici saghe finite e tutti i tredici sigilli."],
    },
    heroLook: (h, K) => ({ bg: ["#1a1030", "#ffd23f"] }),
    heroTitle: (K) => `${sealCount(K)} sigilli`,
    act: { P: "Guarda la porta", "^": "Cambia zona", v: "Cambia zona" },
    musicMain: "mondi",
    music: {
      // un tema da torneo cosmico: archi solenni, un carillon che cita i temi delle saghe, timpani
      mondi: { bpm: 100, chords: ["Em", "C", "G", "D", "Em", "C", "Am", "B"], lres: 2, lw: "triangle", lv: 0.045,
        lead: "E5 - G5 - B5 - - - | C6 - B5 - G5 - - - | D5 - G5 - B5 - D6 - | F#5 - - - - - - - | E5 - G5 - B5 - E6 - | G6 - E6 - C6 - - - | A5 - C6 - E6 - D6 - | B5 - - - - - - -",
        bass: "R . . . 5 . . . R . . . 5 . 8 .", bv: 0.1, arp: "1 5 8 12 1 5 8 12 1 5 8 12 1 5 8 12", aw: "sine", av: 0.018, drum: "k . . . s . . . k . k . s . . .", dv: 0.22 },
    },
    paint: {
      // la porta di un mondo: anello di luce con il colore della saga (spenta se la saga non è finita, d'oro se hai il sigillo)
      P(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const w = worldAt(tx, ty), x = tx * TS - cx + 8, y = ty * TS - cy + 2; if (!w) return; const op = isOpen(K, w), sg = K.F.is("sig_" + w.id);
        g.fillStyle = "#1a1030"; g.fillRect(x - 9, y - 18, 18, 30); g.strokeStyle = sg ? "#ffd23f" : op ? w.col : "#5a5a6a"; g.lineWidth = sg ? 3 : 2; g.beginPath(); g.ellipse(x, y - 4, 7, 12, 0, 0, 7); g.stroke();
        if (op) { for (let i = 0; i < 3; i++) { g.strokeStyle = w.col + "99"; g.lineWidth = 1; g.beginPath(); g.ellipse(x, y - 4, 5 - i * 1.5, 10 - i * 3, (fr / 30 + i) % 6.28, 0, 4); g.stroke(); } K.light(x, y - 4, 18, sg ? "255,210,63" : "200,170,255", 0.35); }
        g.font = "8px sans-serif"; g.textAlign = "center"; g.fillText(op ? w.e : "🔒", x, y - 20); g.textAlign = "left"; }); },
    },
    cameos: [],
  });
  const K = E.K;
  function worldAt(tx, ty) { const id = POS[tx + "," + ty]; return id ? WORLDS.find((w) => w.id === id) : null; }
  function saveOf(k, w) { return (k || K).otherSaga(w.key) || {}; }
  function isOpen(k, w) { const s = saveOf(k, w); return Array.isArray(s.ends) && s.ends.length > 0; }
  function sealCount(k) { return WORLDS.filter((w) => (k || K).F.is("sig_" + w.id)).length; }
  function openWorlds(k) { return WORLDS.filter((w) => isOpen(k, w)); }
  // come hai finito quella saga: il titolo del primo finale trovato (letto dalla saga stessa)
  function endTitle(w) { try { const m = window[w.mod]; const e = m && m.endings ? m.endings().find((x) => x.found) : null; return e ? e.title : ""; } catch (e) { return ""; } }
  Object.assign(K, { WORLDS, POS, worldAt, isOpen: (w) => isOpen(K, w), openWorlds: () => openWorlds(K), sealCount: () => sealCount(K), endTitle });
  window.__mondi = E.api;
})();
