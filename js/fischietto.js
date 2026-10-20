// js/fischietto.js - «IL FISCHIETTO» · configurazione della saga sul motore comune (js/saga-core.js)
// 1998. Arbitro di provincia e membro del Giurì sportivo: tre casi, tre verdetti, una finale. Ironia di base, episodi seri.
// Usa dal core: Dossier (cfg.cases, K.dossier), Rapporti (cfg.bonds), Inventario (cfg.inv), orologio (cfg.clock), interni automatici,
// scene a soglia. Nessun motore di partita: il campo è sullo sfondo, la partita si decide con i verdetti.
(function () {
  "use strict";
  if (window.__fischietto || !window.__sagaCore) return;
  const CASES = {
    gomito: {
      t: "Il Gomito di Ponterosso", q: "Dante Lupi ha colpito Sirio Bassi con un gomito al 31'?",
      items: {
        g_ref: { t: "Il tuo referto", icon: "📝", kind: "prova", d: "«Gomito alto di Lupi alla nuca di Bassi, a palla lontana.»" },
        g_med: { t: "Referto dell'infermeria", icon: "🩹", kind: "prova", d: "Ferita al sopracciglio sinistro. Nessun colpo alla nuca." },
        g_vhs: { t: "Cassetta del Telecolor", icon: "📼", kind: "prova", d: "Il fotogramma del 31' è rovinato: si vede Lupi che arretra a braccia larghe." },
        g_pino: { t: "Pino, guardalinee", icon: "🚩", kind: "testimonianza", d: "«L'ho visto benissimo, dalla linea. Gomito volontario.»" },
        g_ott: { t: "Ottavio, Bar Sport", icon: "🍺", kind: "testimonianza", d: "«Bassi è inciampato da solo. L'ho visto alla tv del bar.»" },
        g_blk: { t: "Avviso Enel", icon: "💡", kind: "prova", d: "Senza corrente in zona Bar Sport, 15:30-17:30." }
      },
      links: [["g_ref", "g_med", "Hai scritto «nuca»; il medico scrive «sopracciglio». L'errore è tuo."], ["g_pino", "g_vhs", "Pino dice di aver visto da vicino, ma sulla cassetta è a quaranta metri, voltato."], ["g_ott", "g_blk", "Il bar era senza corrente: la tv era spenta, Ottavio non ha visto niente."]],
      verdicts: [{ id: "assolvi", label: "Assolvo Lupi", sub: "Nessuna sanzione" }, { id: "ammonisci", label: "Ammonizione", sub: "Una via di mezzo" }, { id: "squalifica", label: "Squalifica di due turni", sub: "Colpo volontario" }]
    },
    troppo: {
      t: "La Partita Finita Troppo Bene", q: "Il portiere Ivano Reggi ha subito 7 gol per caso o per accordo?",
      items: {
        t_ref: { t: "Referto della partita", icon: "📝", kind: "prova", d: "Borgo Alto 7-0 Marinella. Cinque gol su tiri centrali, a mezza altezza." },
        t_ivano: { t: "Ivano, il portiere", icon: "🧤", kind: "testimonianza", d: "«Ero fuori forma. Mi faceva male la schiena.»" },
        t_allen: { t: "Mister Rocco", icon: "📋", kind: "testimonianza", d: "«Fino al giorno prima parava anche i cori.»" },
        t_sched: { t: "Schedina del Totosport", icon: "🎫", kind: "prova", d: "Esito esatto 7-0, giocata alle 11:40 della domenica." },
        t_tel: { t: "Tabulato del cercapersone", icon: "📟", kind: "prova", d: "Primo messaggio alle 11:38 dal numero della ricevitoria." },
        t_diario: { t: "Taccuino di Ivano", icon: "📒", kind: "prova", d: "«Debito: tre milioni. Scadenza: lunedì.»" },
        t_ric: { t: "Ricevuta del molo", icon: "🧾", kind: "prova", d: "Pagamento di tre milioni in contanti, lunedì mattina." }
      },
      links: [["t_ivano", "t_allen", "Ivano dice di essere stato male; il mister lo ha visto allenarsi alla perfezione fino al giorno prima."], ["t_sched", "t_tel", "La schedina è stata giocata due minuti dopo il messaggio: qualcuno sapeva prima del calcio d'inizio."], ["t_diario", "t_ric", "Il debito di tre milioni è stato pagato il lunedì dopo: con quali soldi, in un giorno?"]],
      verdicts: [{ id: "squalifica", label: "Squalifica Ivano", sub: "Chiudi il caso sul campo" }, { id: "procura", label: "Segnala alla Procura federale", sub: "Più rischi, più verità" }, { id: "archivia", label: "Archivia", sub: "Il campo ha già parlato" }]
    },
    finale: {
      t: "L'Esposto", q: "Qualcuno sostiene che il Fischietto sia comprato. Chi lo dice, e perché ora?",
      items: {
        f_lettera: { t: "La lettera anonima", icon: "✉️", kind: "prova", d: "«L'arbitro della finale ha già accettato.» Scritta a mano, con la «t» a gancio." },
        f_pres: { t: "Gualtiero, il presidente", icon: "🎩", kind: "testimonianza", d: "«Io non c'entro. Non scrivo nemmeno gli assegni.»" },
        f_cron: { t: "Livia, la cronista", icon: "🗞️", kind: "testimonianza", d: "«L'ho ricevuta martedì, a mano, al giornale.»" },
        f_firma: { t: "Il blocchetto degli assegni", icon: "🧾", kind: "prova", d: "Una firma di Gualtiero con la «t» a gancio." },
        f_edv: { t: "Edvige, la segretaria", icon: "🗂️", kind: "testimonianza", d: "«La lettera è arrivata alla Federazione prima che al giornale.»" }
      },
      links: [["f_lettera", "f_firma", "La «t» a gancio è la stessa: la lettera è del presidente."], ["f_cron", "f_edv", "La cronista l'ha ricevuta martedì a mano; la Federazione la aveva già lunedì: l'ha inviata prima a chi poteva agire."], ["f_pres", "f_firma", "Gualtiero dice di non scrivere assegni: ma la sua firma è sul blocco."]],
      verdicts: [{ id: "denuncia", label: "Denuncio il presidente", sub: "Con le prove in mano" }, { id: "silenzio", label: "Resto in silenzio", sub: "Fischi la finale e basta" }, { id: "ritira", label: "Mi ritiro dalla finale", sub: "Lasci il campo a un altro" }]
    }
  };
  const E = window.__sagaCore.create({
    id: "fischietto", key: "ali-di-rondine.fischietto", title: "Il Fischietto", icon: "🟨", bg: "fi_titolo", chapters: 3,
    menuSub: "1998. Arbitro di provincia e giudice del Giurì: raccogli prove, confronta le testimonianze, emetti verdetti. E poi fischia la finale.",
    theme: { accent: "#facc15", ink: "#1c1917", paper: "rgba(250,246,230,.96)", font: "Georgia, 'Times New Roman', serif", chipBg: "#fef08a", chipBorder: "#854d0e" },
    stats: { integrita: [0, 9, 3, "Integrità"], fama: [0, 9, 0, "Reputazione"] },
    regions: {
      citta: { grass: ["#8aa66a", "#7e9a5e", "#96b276"], path: ["#cbb98f", "#bfad84"], stone: ["#a39d90", "#968f82"], wall: ["#d6c4a0", "#c8b690"], water: ["#4a86b0", "#417aa4"], tree: "#3e6a38", tint: "255,226,170", tintA: 0.06 },
      campo: { grass: ["#3f8a4a", "#388043", "#47944f"], path: ["#c9b98a", "#bda97a"], stone: ["#8a8a8a", "#7a7a7a"], wall: ["#54545e", "#484852"], water: ["#4a86b0", "#417aa4"], tree: "#2e5a2a", tint: "255,240,200", tintA: 0.05 },
      sede: { grass: ["#8a7a5a", "#7e6e50", "#968660"], path: ["#cbb98f", "#bfad84"], stone: ["#a39d90", "#968f82"], wall: ["#4a3a28", "#3e3020"], water: ["#3a6a80", "#316074"], tree: "#3e5a38", tint: "255,226,170", tintA: 0.08 }
    },
    floors: ".",
    act: { n: "Leggi l'avviso", q: "Entra", v: "Esci" },
    travel: true,
    item: ["Cartellino di cortesia", "Cartellini di cortesia"],
    journal: { name: "Il Registro del Giurì", sub: "Casi, dossier e verdetti" },
    cases: CASES,
    bonds: {
      per: 4, talk: 2, max: 4, names: ["Sconosciuti", "Conoscenti", "Colleghi", "Fidati", "Complici"],
      scenes: {
        fi_edvige: [{ lv: 2, id: "edv2", lines: [["fi_edvige", "Una cosa che non dico mai: ho fatto l'arbitro anch'io, fino al '79. Mi hanno dato dello «scarso» in trentasei borghi."], ["fi_edvige", "Poi ho scoperto che il fischietto non fa rumore se non ci credi. Tu ci credi, a modo tuo. Non smettere."]], reward: (K) => K.bond("integrita", 1) }, { lv: 3, id: "edv3", prize: "+2 Reputazione e +1 Integrità", lines: [["fi_edvige", "Ti do il mio vecchio fischietto, quello del '79. Non fischia più. Però quando lo stringi, tutti sentono."], ["fi_edvige", "Anche gli arbitri hanno bisogno di un portafortuna. Il mio era scarso, come me."]], reward: (K) => { K.bond("fama", 2); K.bond("integrita", 1); } }],
        fi_livia: [{ lv: 2, id: "liv2", lines: [["fi_livia", "Il giornale mi paga a riga. Ogni verità in meno è una riga in meno, quindi capirai che ho un conflitto d'interessi."], ["fi_livia", "Ti dico una cosa gratis: non c'è niente di più noioso di un arbitro onesto. E niente di più raro."]], reward: (K) => K.bond("fama", 1) }, { lv: 3, id: "liv3", prize: "+3 Reputazione e 50 monete", lines: [["fi_livia", "Ti scrivo un pezzo che non ti farà fare brutta figura. Ho tolto tre aggettivi e un'accusa. Considerala una mancia."], ["fi_livia", "Il giornale mi paga a riga: oggi ne ho scritte quaranta per te e nessuna a pagamento."]], reward: (K) => { K.bond("fama", 3); K.reward("fi_liv3", { coins: 50 }); } }],
        fi_dante: [{ lv: 2, id: "dan2", lines: [["fi_dante", "Mio padre mi ha insegnato che si gioca duro, ma mai con il gomito. Mi ha insegnato pure a non rispondere. Forse l'ho preso troppo alla lettera."], ["fi_dante", "Qualunque cosa decidi, grazie di averci pensato. Nessuno ci pensa, di solito."]], reward: (K) => K.bond("integrita", 1) }, { lv: 3, id: "dan3", prize: "+2 Integrità", lines: [["fi_dante", "Ti dico dove metto il gomito, la prossima volta: da nessuna parte. Promesso. Una promessa non vale, ma per me sì."], ["fi_dante", "Con un arbitro così, mi fido persino dei miei difensori."]], reward: (K) => { K.bond("integrita", 2); } }]
      }
    },
    inv: {
      items: {
        fi_busta: { n: "Busta del presidente", icon: "💼", d: "Gualtiero l'ha lasciata «per il disturbo». Non l'hai ancora aperta. Pesa più del dovuto.", giftAny: 0 },
        fi_cartellino: { n: "Cartellino giallo del nonno", icon: "🟨", d: "Il vecchio cartellino di cartone di tuo nonno, che arbitrava a piedi nudi.", gift: { fi_dante: 8, fi_livia: 3 }, giftAny: 2 },
        fi_cassetta: { n: "Cassetta della finale 1976", icon: "📼", d: "Una copia della finale del '76: l'ultima partita arbitrata senza moviola.", gift: { fi_edvige: 8, fi_livia: 5 }, react: { fi_edvige: "La finale del '76! C'ero. Ho il fischietto di quella sera ancora in cassetto." } }
      }
    },
    clock: {
      slots: ["Mattina", "Pomeriggio", "Sera"], hud: true, tint: [null, null, "rgba(251,146,60,.14)"],
      onSlot(K, giorno, fascia, nome) { return nome === "Sera" ? [["voce", "Cala la sera su Ponterosso. Nei bar si riaprono i processi, quelli senza avvocato."]] : null; }
    },
    endings: {
      argento: ["Il Fischietto d'Argento", "Integro fino in fondo: la finale è tua, e il silenzio dello stadio vale più di un applauso.", "Integrità 7 o più, senza aver tenuto la busta."],
      silenzio: ["Il Silenzio", "Hai fischiato la finale senza gloria e senza macchia. Nessuno sa cosa pensi. Meglio così.", "Resta in silenzio."],
      riscatto: ["Il Riscatto", "Hai preso la busta, hai sbagliato, hai confessato. Poi hai fischiato. Il tuo nome è nei registri, ma da solo.", "Tieni la busta e confessa."],
      spento: ["Il Fischietto Spento", "Il fischietto suona ancora. Ma non fa più rumore: sai tu perché.", "Tieni la busta e tacciono tutti."]
    },
    heroLook: (h) => ({ bg: ["#1c1917", "#facc15"], shirt: "#111827" }),
    heroTitle: () => "arbitro di provincia",
    musicMain: "fischietto",
    music: { fischietto: { bpm: 96, chords: ["Am", "F", "C", "G", "Am", "F", "E", "Am"], lres: 2, lw: "triangle", lv: 0.04,
      lead: "A4 - C5 - E5 - D5 - | C5 - B4 - A4 - - - | C5 - E5 - G5 - F5 - | E5 - - - D5 - - - | A4 - C5 - E5 - D5 - | E5 - G5 - E5 - C5 - | B4 - D5 - B4 - G4 - | A4 - - - - - - -",
      bass: "R . . 5 . . R . . 5 . . R . 5 .", bv: 0.08, arp: "1 5 1 5 1 5 1 5", aw: "triangle", av: 0.012, drum: "k . . h . . s . . h . . k . h .", dv: 0.1 } },
    cameos: [],
    stadium: { azPitch: "campo", cageField: 1, cageMut: "heavy", venue: { ads: [["PONTEROSSO", "#b91c1c"], ["BAR SPORT", "#16a34a"], ["TELECOLOR", "#1d4ed8"], ["MOVIOLA VIDEO", "#a16207"]], crowd: ["#b91c1c", "#f4f0e4", "#1d4ed8"], ground: ["#2f7d3e", "#2a7438"], line: "#f4f0e4", sky: ["#7ec0ee", "#fde7b8"], wall: ["#5a5a64", "#4a4a54"], glow: "255,240,200" } }
  });
  window.__fischietto = E.api; window.__fischiettoCore = E;
})();
