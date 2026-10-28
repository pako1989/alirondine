// js/gala.js - «IL RAPIMENTO DEL PALLONE D'ORO · CENA ALLA VILLA DELMONTE» · configurazione della saga sul motore comune (js/saga-core.js)
// Giallo corale alla Knives Out: gala nella villa del Presidente, il Pallone d'Oro sparisce al blackout, il ponte è crollato e nessuno esce. Otto sospettati, tutti con un segreto.
// Novità: REGISTRO DELLE PRESENZE (cfg.alibi nel core): griglia persone x fasce con avvistamenti (tuoi o riferiti da testimoni) e alibi dichiarati; dove non coincidono, mentono.
// Minigioco: Ping-Pong da Salone (js/gala-pp.js), anche in Sala Giochi. Dal core: Orologio, Dossier, Inventario, Rapporti, interni a mano.
// Tessere proprie: P facciata · S siepe · F fontana · T tavola · D credenza · H camino · L libreria · W finestra/quadro · B letto · G pianoforte · A pianta · Y ping-pong
//   K fornello · R botte · O statua · U divano · Z scrivania · pavimenti: l parquet · s scacchi · c cucina · t tappeto · g ghiaia · w pietra · v serra · b parquet scuro · m moquette
(function () {
  "use strict";
  if (window.__gala || !window.__sagaCore) return;
  const TS = 16;
  const rn = (a, b, k) => { const s = Math.sin(a * 127.1 + b * 311.7 + (k || 0) * 74.7) * 43758.5453; return s - Math.floor(s); };
  const PEOPLE = { pd_delmonte: "Il Presidente", pd_livia: "Livia", pd_zeno: "Zeno Bassi", pd_teresa: "Teresa", pd_arturo: "Arturo", pd_clio: "Clio", pd_gualtiero: "Gualtiero", pd_ospite: "L'Ospite" };
  const ORDER = Object.keys(PEOPLE);
  // dove sta ogni persona in ogni fascia: 0 Cena · 1 Blackout · 2 Mezzanotte · 3 Alba
  const SCHED = {
    pd_delmonte: ["pd_pranzo", "pd_cantina", "pd_studio", "pd_salone"], pd_livia: ["pd_pranzo", "pd_biblioteca", "pd_boudoir", "pd_salone"],
    pd_zeno: ["pd_pranzo", "pd_serra", "pd_pingpong", "pd_salone"], pd_teresa: ["pd_cucina", "pd_cucina", "pd_cucina", "pd_salone"],
    pd_arturo: ["pd_pranzo", "pd_cantina", "pd_cantina", "pd_salone"], pd_clio: ["pd_pranzo", "pd_serra", "pd_giardino", "pd_salone"],
    pd_gualtiero: ["pd_pranzo", "pd_studio", "pd_biblioteca", "pd_salone"], pd_ospite: ["pd_pranzo", "pd_giardino", "pd_salone", "pd_salone"]
  };
  const who = (zid, slot) => ORDER.filter((p) => SCHED[p][slot] === zid);
  const CASES = {
    pallone: {
      t: "Il Rapimento del Pallone d'Oro", q: "Il Pallone non è stato rubato come sembra. Confronta le prove.",
      items: {
        polizza: { t: "Polizza del Pallone", d: "Assicurazione triplicata un mese fa. Beneficiario: Delmonte.", icon: "📄", kind: "prova" },
        ricevuta: { t: "Ricevuta di vendita", d: "Il Pallone d'Oro, venduto a un collezionista per una cifra enorme. Firma: Delmonte.", icon: "🧾", kind: "prova" },
        replica: { t: "Pallone di replica", d: "Trovato in cantina: cuciture troppo nuove, peso sbagliato. Una copia.", icon: "⚽", kind: "prova" },
        chiave: { t: "Chiave della cantina", d: "Teresa la custodisce; solo Arturo e il Presidente ne hanno una copia.", icon: "🗝️", kind: "testimonianza" },
        lettera: { t: "Lettera di Livia", d: "Livia scopre la vendita e scrive a un avvocato: «Se lo dico, perdo tutto».", icon: "✉️", kind: "testimonianza" }
      },
      links: [["polizza", "ricevuta", "Perché assicurare al triplo un pallone già venduto?"], ["replica", "ricevuta", "La replica serve a far credere che il vero Pallone fosse ancora in villa."], ["chiave", "replica", "Se solo due persone hanno la chiave, la replica l'hanno portata loro."], ["lettera", "polizza", "Livia lo sapeva prima del furto: ha taciuto per paura o per interesse."]],
      verdicts: [{ id: "accusa", label: "Accusa il Presidente davanti a tutti", sub: "La verità, in pubblico" }, { id: "discreto", label: "Parla in privato con Livia", sub: "La verità, senza scandalo" }]
    }
  };
  const E = window.__sagaCore.create({
    id: "gala", key: "ali-di-rondine.gala", title: "Il Rapimento del Pallone d'Oro", icon: "🏆", bg: "pd_titolo", chapters: 3,
    menuSub: "Cena di gala alla villa del Presidente: il Pallone d'Oro sparisce al blackout, il ponte è crollato, otto sospettati. Chi mente? Guarda dove erano.",
    theme: { accent: "#d4a73a", ink: "#fdf6e3", paper: "rgba(36,22,16,.92)", font: "Georgia, 'Times New Roman', serif", chipBg: "#3b2314", chipBorder: "#d4a73a" },
    stats: { intuito: [0, 100, 20, "Intuito"], garbo: [0, 100, 15, "Garbo"] },
    item: ["Gettone d'oro", "Gettone d'oro"],
    drawItem(g, x, y, i, f) { g.save(); g.translate(x, y + Math.sin(f / 14 + i) * 1.2); g.fillStyle = "#b8860b"; g.beginPath(); g.arc(0, 0, 4.5, 0, 7); g.fill(); g.fillStyle = "#facc15"; g.beginPath(); g.arc(0, -0.5, 3.6, 0, 7); g.fill(); g.fillStyle = "#a16207"; g.fillRect(-1, -3, 2, 5); g.restore(); },
    regions: {
      giardino: { grass: ["#15281d", "#122418", "#183022"], path: ["#8f8671", "#827a66"], stone: ["#6b6657", "#5f5b4d"], wall: ["#2b2a26", "#232220"], water: ["#1e3a5f", "#1d4f7a"], tall: "#14301f", tree: ["#0f2a1a", "#163a24", "#1d4a2e"], tint: "90,110,190", tintA: 0.12, fx: "rain", dark: 0.3 },
      salone: { grass: ["#7c5a2c", "#6e5026", "#85622f"], path: ["#8a6a3a", "#7d5e30"], stone: ["#c9bfa6", "#b9ae92"], wall: ["#3d2a1c", "#2f2016"], water: ["#1e3a5f", "#1d4f7a"], tall: "#7c5a2c", tint: "255,200,110", tintA: 0.1, fx: "", dark: 0.12 },
      pranzo: { grass: ["#5a2a2a", "#502424", "#633030"], path: ["#7a3a3a", "#6e3232"], stone: ["#b9a77c", "#a8966b"], wall: ["#2d1612", "#24100d"], water: ["#1e3a5f", "#1d4f7a"], tall: "#5a2a2a", tint: "255,180,90", tintA: 0.12, fx: "", dark: 0.14 },
      cucina: { grass: ["#d8dbd6", "#cfd2cc", "#dde0db"], path: ["#9aa5a8", "#8e999c"], stone: ["#b6bdbd", "#a8b0b0"], wall: ["#e4e0d4", "#d8d3c5"], water: ["#1e3a5f", "#1d4f7a"], tall: "#d8dbd6", tint: "255,235,190", tintA: 0.08, fx: "", dark: 0.06 },
      biblioteca: { grass: ["#3b2616", "#33200f", "#442c1a"], path: ["#5a3b22", "#4f331c"], stone: ["#6a5236", "#5c462e"], wall: ["#24160c", "#1a100a"], water: ["#1e3a5f", "#1d4f7a"], tall: "#3b2616", tint: "255,170,70", tintA: 0.12, fx: "", dark: 0.2 },
      studio: { grass: ["#2c3a2e", "#263228", "#33423a"], path: ["#4a5a4c", "#415144"], stone: ["#5c6a58", "#505d4d"], wall: ["#16201a", "#101712"], water: ["#1e3a5f", "#1d4f7a"], tall: "#2c3a2e", tint: "180,220,150", tintA: 0.1, fx: "", dark: 0.2 },
      cantina: { grass: ["#2a2622", "#24201c", "#302b26"], path: ["#4a423a", "#40392f"], stone: ["#554c40", "#493f35"], wall: ["#16130f", "#0f0d0a"], water: ["#1e3a5f", "#1d4f7a"], tall: "#2a2622", tint: "255,150,60", tintA: 0.1, fx: "dust", dark: 0.34 },
      serra: { grass: ["#1f4a2e", "#1b4228", "#255536"], path: ["#8a5a3a", "#7d5032"], stone: ["#4a7a5a", "#42705a"], wall: ["#1a3a2a", "#14301f"], water: ["#1e3a5f", "#1d4f7a"], tall: "#1f4a2e", tint: "120,230,160", tintA: 0.1, fx: "petals", dark: 0.16 },
      boudoir: { grass: ["#7a3a55", "#6e3350", "#84405f"], path: ["#a35a7a", "#964f70"], stone: ["#c98aa8", "#b97c9a"], wall: ["#3d1830", "#30112a"], water: ["#1e3a5f", "#1d4f7a"], tall: "#7a3a55", tint: "255,170,210", tintA: 0.1, fx: "", dark: 0.14 },
      pingpong: { grass: ["#1f3b2a", "#1a3324", "#244631"], path: ["#2f5a40", "#2a5038"], stone: ["#4a7a5a", "#42705a"], wall: ["#12261a", "#0d1c12"], water: ["#1e3a5f", "#1d4f7a"], tall: "#1f3b2a", tint: "200,255,200", tintA: 0.08, fx: "", dark: 0.12 }
    },
    floors: "lsctgwvbm", solid: "PSFTDHLWBGAYKROUZX",
    act: { X: "Siediti al tuo posto", F: "Guarda la fontana", D: "Guarda la credenza", H: "Guarda il camino", L: "Guarda la libreria", B: "Guarda il letto", G: "Guarda il pianoforte", A: "Guarda la pianta", Y: "Guarda il tavolo da ping-pong", K: "Guarda i fornelli", R: "Guarda le botti", O: "Guarda la statua", U: "Guarda il divano", Z: "Guarda la scrivania", q: "Entra", v: "Esci", s: "Siediti un momento", n: "Leggi il cartello" },
    rest: { ch: "s", label: "Siediti un momento", text: "Ti siedi un istante. La villa scricchiola come una nave in tempesta: il vento, o qualcuno che cammina piano. (Il gioco salva da solo: qui puoi rileggere il Taccuino.)" },
    texts: { nothing: "Niente di utile. Solo polvere e silenzi educati.", noHero: "La villa vuole un Campione invitato al gala: crea prima il tuo personaggio." },
    journal: { name: "Il Taccuino", sub: "Prove, Registro delle presenze, legami e finali" },
    cases: CASES,
    alibi: { name: "Registro delle Presenze", people: PEOPLE, places: { pd_giardino: "Giardino", pd_salone: "Salone", pd_pranzo: "Sala da pranzo", pd_cucina: "Cucina", pd_biblioteca: "Biblioteca", pd_studio: "Studio", pd_cantina: "Cantina", pd_serra: "Serra", pd_boudoir: "Camera di Livia", pd_pingpong: "Sala giochi" }, onFound: (p, s, K) => { K.bond("intuito", 3); } },
    bonds: {
      per: 4, talk: 2, max: 4, names: ["Sconosciuti", "Conoscenti", "Confidenti", "Fidati", "Complici"],
      scenes: {
        pd_livia: [{ lv: 2, id: "liv2", lines: [["pd_livia", "Sposare un presidente è come sposare una squadra: non è mai a casa, e le sconfitte si pagano tutte insieme."], ["pd_livia", "Non dirgli che ho parlato. È orgoglioso, e gli orgogliosi non sbagliano mai in pubblico."]], reward: (K) => K.bond("intuito", 4) },
          { lv: 3, id: "liv3", prize: "+10 Intuito e il ventaglio di Livia", lines: [["pd_livia", "Il ventaglio di mia madre. Dentro c'è un biglietto: «Mai fidarsi di chi dice la verità troppo in fretta»."], ["pd_livia", "Tienilo. A me non serve più: io ho già sbagliato in fretta."]], reward: (K) => K.bond("intuito", 10) }],
        pd_teresa: [{ lv: 2, id: "ter2", lines: [["pd_teresa", "In cucina si sa tutto. Chi mangia troppo, chi beve per dimenticare, chi sale in cantina a sera tardi senza ricordare perché."], ["pd_teresa", "Io non dico niente. Cucino. Ma ho buona memoria per le impronte."]], reward: (K) => K.bond("garbo", 4) },
          { lv: 3, id: "ter3", prize: "+10 Garbo e la ricetta di Teresa", lines: [["pd_teresa", "La ricetta delle polpette del Presidente. Il segreto è un pizzico di bugia: la gente se ne accorge solo quando manca."], ["pd_teresa", "Ora hai un'arma in più. Usala solo in cucina."]], reward: (K) => K.bond("garbo", 10) }],
        pd_clio: [{ lv: 2, id: "cli2", lines: [["pd_clio", "Faccio la giornalista perché è l'unico lavoro in cui puoi chiedere «perché?» tutta la vita e farti pagare."], ["pd_clio", "Stanotte non scrivo niente. Stanotte ascolto. Posso?"]], reward: (K) => K.bond("garbo", 4) },
          { lv: 3, id: "cli3", prize: "+10 Intuito e il taccuino di Clio", lines: [["pd_clio", "Il mio taccuino. Quindici anni di domande senza risposta. Ti metto in prima pagina, se risolvi."], ["pd_clio", "E se non risolvi, ti metto in seconda. Con una bella foto."]], reward: (K) => K.bond("intuito", 10) }]
      }
    },
    inv: {
      items: {
        pd_chiave: { n: "Chiave della cantina", icon: "🗝️", d: "Chiave di ferro con un nastro rosso. Apre la botola della cantina, in giardino.", gift: { pd_teresa: 8 }, giftAny: 1 },
        pd_polizza: { n: "Polizza del Pallone", icon: "📄", d: "Assicurazione triplicata un mese fa, sul Pallone d'Oro. Beneficiario: Delmonte.", gift: { pd_clio: 10, pd_gualtiero: 8 }, giftAny: 2 },
        pd_lettera: { n: "Lettera di Livia", icon: "✉️", d: "Una lettera non spedita a un avvocato, scritta con mano tesa. Parla di una vendita.", gift: { pd_livia: 12 }, giftAny: 1 },
        pd_replica: { n: "Pallone di replica", icon: "⚽", d: "Cuciture troppo nuove, peso sbagliato. Una copia del Pallone d'Oro.", gift: { pd_arturo: 10, pd_zeno: 6 }, giftAny: 2 },
        pd_gettone: { n: "Gettone del Presidente", icon: "🪙", d: "Un gettone d'oro che apre la sala giochi: un invito a una partita.", gift: { pd_zeno: 8 }, giftAny: 1 }
      }
    },
    clock: {
      slots: ["Cena", "Blackout", "Mezzanotte", "Alba"], hud: true, tint: [null, "rgba(2,4,20,.5)", "rgba(10,10,40,.32)", "rgba(255,170,90,.16)"],
      onSlot(K, giorno, fascia, nome) { return nome === "Blackout" ? [["voce", "Tutte le luci si spengono insieme. Un bicchiere cade, qualcuno ride, poi nessuno ride più."]] : nome === "Mezzanotte" ? [["voce", "Mezzanotte alla villa. La tempesta si calma, la gente no."]] : nome === "Alba" ? [["voce", "Un chiarore grigio entra dalle finestre: l'alba, e il momento di dire chi è stato."]] : null; }
    },
    endings: {
      giustizia: ["La Verità sul Tavolo", "Accusi il Presidente davanti a tutti, con le prove in fila: il Pallone era già venduto e il furto serviva all'assicurazione. Il Pallone vero torna; Delmonte, no.", "Smaschera il vero colpevole con almeno quattro contraddizioni scoperte e tre prove."],
      capro: ["Il Capro Espiatorio", "Accusi l'ex socio. Sembra tutto a posto, la polizia arriva a ponte riparato e arresta l'uomo sbagliato. Il vero colpevole stringe la mano e offre da bere.", "Accusa Gualtiero e vai via con un sospetto in tasca."],
      silenzio: ["Il Silenzio di Livia", "Accetti il patto di Livia: il Pallone torna in sordina, il Presidente si dimette per «motivi di salute», lo scandalo non esce. Il Borgo dorme tranquillo.", "Parla in privato con Livia e accetta il suo patto."],
      segreto: ["Il Mistero Completo", "Sei contraddizioni, una partita a ping-pong vinta e l'identità dell'Ospite: il Pallone vero ricompare nella cantina dove tutto è cominciato, con il collezionista in manette.", "Scopri tutte e sei le contraddizioni e batti Zeno a ping-pong."]
    },
    guest: { id: "pd_arturo", lines: [["pd_arturo", "[serio] {n}. Il Presidente mi ha concesso un giorno libero. Il primo in venticinque anni. Non so cosa si fa, quindi ho lucidato le panchine del molo."], ["pd_arturo", "Se le serve qualcosa, sono qui fino al tramonto. Poi torno in villa: le posate d'argento non si contano da sole, e a volte non tornano i conti."]] },
    heroLook: () => ({ bg: ["#3b2314", "#d4a73a"], shirt: "#1e293b" }),
    heroTitle: () => "Ospite d'Onore",
    musicMain: "gala",
    music: { gala: { bpm: 84, chords: ["Dm", "Bb", "F", "A", "Dm", "Gm", "A", "Dm"], lres: 3, lw: "triangle", lv: 0.03,
      lead: "D5 - - F5 - A5 - - | G5 - - Bb5 - A5 - - | F5 - - A5 - C6 - - | A5 - G5 - E5 - - - | D5 - - F5 - A5 - - | G5 - - Bb5 - D6 - - | C#6 - - A5 - E5 - - | D5 - - - - - - -",
      bass: "R . . . 5 . . . R . . . 5 . 8 .", bv: 0.12, arp: "1 5 8 5 3 5 8 5", aw: "sine", av: 0.01, drum: "k . . . s . . . k . . . s . h .", dv: 0.07 } },
    plugins: [{
      enter(zid, spec, K) { // chi vedi nella stanza, lo annoti nel Registro
        if (!K.alibi || !spec) return; K.alibi.scan(zid, who(zid, K.clock.slot()));
      },
      hud(g, zid, spec, K) {
        if (!spec || spec.interior && !spec.hud) return; g.save(); g.font = "700 8px Georgia, serif";
        const s = `🔎 ${K.stat("intuito")}  🎩 ${K.stat("garbo")}`, w = g.measureText(s).width + 10; g.fillStyle = "rgba(30,18,10,.8)"; g.fillRect(4, 4, w, 13); g.fillStyle = "#facc15"; g.fillText(s, 9, 13.5); g.restore();
      }
    }],
    paint: (window.__galaTiles || {}).paint || {}, floorPaint: (window.__galaTiles || {}).floorPaint,
    cameos: []
  });
  const K = E.K;
  window.__gala = E.api; window.__galaCore = E; window.__galaK = K; window.__galaWho = who; window.__galaPeople = PEOPLE; window.__galaOrder = ORDER; window.__galaSched = SCHED;
  window.__galaH = (K) => {
    let QL = [];
    const H = {
      say: (who2, txt) => { QL.push([who2, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn, disabled: o.disabled }))); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio),
      // chi c'è nella stanza in questa fascia, nei posti della stanza (spec.spots)
      crowd(zid) {
        const z = K.zone(zid), spots = (z && z.spec && z.spec.spots) || [], ids = who(zid, K.clock.slot()), out = [];
        ids.forEach((id, i) => { if (spots[i]) out.push({ id, at: spots[i], face: "down" }); });
        return out;
      },
      // partita di ping-pong: i gettoni e gli oggetti di inventario danno un vantaggio
      play(level, opp, title, cb) {
        K.say(H.flush(), () => K.ownMatch(window.__pingpong.start, { level, oppName: opp, title, te: K.inv.bonus("te"), df: K.inv.bonus("df"), at: K.inv.bonus("at"), done: cb }));
      },
      plaque(g, txt, x, y, col) { g.font = "bold 7px Georgia, serif"; const w = g.measureText(txt).width + 10; g.fillStyle = "rgba(30,16,8,.9)"; g.fillRect(x - w / 2, y - 8, w, 11); g.fillStyle = col || "#facc15"; g.fillRect(x - w / 2, y + 2, w, 1); g.fillStyle = "#fdf6e3"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; },
      people() {
        H.cast("pd_delmonte", "Il Presidente Delmonte", "Padrone della villa", { style: "slick", hair: "#cbd5e1", beard: "baffi", shirt: "#1e293b", skin: "#e0b890", bg: ["#3b2314", "#fde68a"] }, "Presidente della squadra e padrone di casa. Ha una stretta di mano che somiglia a una firma.");
        H.cast("pd_livia", "Livia Delmonte", "Moglie del Presidente", { style: "ponytail", hair: "#7c2d12", shirt: "#9d174d", skin: "#e8c3a0", bg: ["#4a1d2f", "#fbcfe8"] }, "Elegante e malinconica. Sa più di quello che dice, e dice più di quello che vorrebbe.");
        H.cast("pd_zeno", "Zeno Bassi", "Campione arrogante", { style: "undercut", hair: "#111827", shirt: "#1d4ed8", skin: "#d9a679", bg: ["#1e3a5f", "#bfdbfe"] }, "Il Pallone d'Oro in persona, o quasi. Ha un'opinione su tutto e due agenti per giustificarla.");
        H.cast("pd_teresa", "Teresa", "Cuoca della villa", { style: "bun", hair: "#a8a29e", shirt: "#f5f5f4", skin: "#d9a679", bg: ["#44403c", "#e7e5e4"] }, "La cuoca che nutre una squadra intera. Vede tutto dal passavivande e non lo dice a nessuno, se non a un buon piatto vuoto.");
        H.cast("pd_arturo", "Arturo", "Maggiordomo", { style: "slick", hair: "#1f2937", beard: "baffi", shirt: "#111827", skin: "#e0b890", bg: ["#1f2937", "#d1d5db"] }, "Venticinque anni di servizio, mai una parola fuori posto. Anche il silenzio, in lui, è impeccabile.");
        H.cast("pd_clio", "Clio", "Giornalista", { style: "bob", hair: "#92400e", acc: ["occhiali"], shirt: "#0f766e", skin: "#e8c3a0", bg: ["#134e4a", "#99f6e4"] }, "Cronista sportiva con un taccuino che scrive più di lei. Cerca lo scoop da quindici anni.");
        H.cast("pd_gualtiero", "Gualtiero", "Ex socio", { style: "messy", hair: "#6b7280", beard: "pizzetto", shirt: "#78350f", skin: "#d9a679", bg: ["#451a03", "#fde68a"] }, "Ex socio del Presidente, cacciato dieci anni fa con una stretta di mano e una causa persa. Torna ogni anno, come le zanzare.");
        H.cast("pd_ospite", "L'Ospite", "Nessuno l'ha invitato", { style: "short", hair: "#334155", acc: ["occhiali"], shirt: "#334155", skin: "#e0b890", bg: ["#1e293b", "#cbd5e1"] }, "Un signore sobrio con un biglietto d'invito che nessuno ricorda di aver spedito. Sorride poco e osserva molto.");
      }
    };
    return H;
  };
})();
