// js/moviola-c3.js - «L'Ombra della Moviola · Tele-Rondine '84»
// Capitolo 3: «La Diretta delle 20:30: La guerra dell'etere per il primato d'ascolti»
(function () {
  "use strict";

  function boot() {
    const E = window.__moviolaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }

  function chapter3(K) {
    const H = window.__moviolaH, { setStep, quest, F } = K;
    const N = 3, S = () => K.stepOf(N);
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };

    H.cast(K);
    K.cos("mov_c3", { kind: "shirt", label: "Blazer Elegante da Studio TV", val: "#1e3a8a", from: "Capitolo 3 di L'Ombra della Moviola" });

    const goal = (s) => ({
      0: "Scala il Campanile dei Corvi per raggiungere la cella campanaria.",
      1: "Sostituisci il fusibile termoionico nel rack di trasmissione.",
      2: "Rientra nello Studio TV di Tele-Rondine per la trasmissione delle 20:30.",
      3: "Affronta Gian Maria Brando e il commendator Valeri in diretta.",
      4: "Prendi la decisione morale sull'assegno da cento milioni di lire."
    }[s] || "Il capitolo 3 è concluso.");

    function fin(scelta) {
      F.set("mov_c3_done", true);
      K.reward("mov_c3", { coins: 100, cos: "mov_c3" });
      K.finishChapter(N, scelta || "ok");
      K.scene([
        ["voce", "La sigla di chiusura sfuma nel silenzio mentre la polizia bussa ai portoni degli studi con un decreto di sequestro."],
        ["mov_daria", "[sussurrando] Walter, prendi la bobina master! Salta dalla finestra sul retro con la Vespa!"],
        ["mov_walter", "[rombando] Ci vediamo domani sera al Gran Galà del Teatro Comunale. Se la verità deve morire, morirà sul grande schermo!"],
        ["voce", `<b>FINE DEL CAPITOLO 3.</b> Chiarezza ${K.stat("chiarezza")} · Etica ${K.stat("etica")} · Ascolti ${K.stat("ascolti")}.`],
        ["voce", "Il Capitolo 4, «Fermo Immagine sul Fato», ti aspetta."]
      ], () => K.openMain(), "mov_foyer");
    }

    const talk = {
      mov_silvano() {
        if (K.rel.scene("mov_silvano")) return;
        const s = S();
        if (s === 0) {
          say("mov_silvano", "[ansimante] Il vento da nord ha tranciato i tiranti dell'antenna sul campanile! Se non riallineiamo il dipolo prima delle 20:30, la diretta salta.");
          say("mov_silvano", "Sali nella Cella Campanaria. C'è il vecchio trasmettitore valvolare: serve inserire un nuovo fusibile di silicio prima che scocchi l'ora!");
          setStep(N, 1);
          quest("mov_c3_fusibile", "Il Ponte Radio", "Entra nella cella campanaria e ripristina le valvole.");
          return done();
        }
        say("mov_silvano", "Il segnale sul campanile tiene! Ora corri in studio prima che cominci la trasmissione!");
        done();
      },

      mov_corrado() {
        const s = S();
        if (s === 2) {
          say("mov_corrado", "[isterico] TVA sta annunciando su tutti i canali che il nostro filmato è un fotomontaggio fatto al computer!");
          say("mov_corrado", "Gian Maria Brando è collegato in studio e il Commendator Valeri è seduto sul divanetto degli ospiti d'onore!");
          say("mov_corrado", "Se non mostriamo subito la prova nel confronto diretto, la gente brucerà i nostri furgoni per strada!");
          setStep(N, 3);
          quest("mov_c3_diretta", "Scontro in Diretta", "Parla con Daria Ferri e affronta Brando davanti a centomila telespettatori.");
          return done();
        }
        say("mov_corrado", "La telecamera è accesa! Sei in onda tra tre... due... uno...");
        done();
      },

      mov_brando() {
        say("mov_brando", "[beffardo] Cari telespettatori, Tele-Rondine è solo una bottega di provincia che specula sul dolore di una città per vendere batterie di pentole!");
        say("mov_brando", "Il nostro stimato presidente Valeri non ha mai messo piede in quel furgone. Siete solo dei diffamatori da quattro soldi!");
        done();
      },

      mov_daria() {
        if (K.rel.scene("mov_daria")) return;
        const s = S();
        if (s === 3) {
          say("mov_daria", "[furente] È il momento di mandare in onda l'intercettazione del minuto 93, adesso!");
          return ask("Mandare in onda l'audio isolato della voce di Valeri?", [
            {
              label: "Trasmessone Audio in Diretta",
              sub: "Sbugiarda Brando e Valeri davanti a tutta la regione",
              big: true, cls: "hot",
              fn: () => {
                K.bond("ascolti", 25);
                K.bond("etica", 15);
                K.dossier.add("tele_rondine", "agenda_valeri");
                say("voce", "Dagli altoparlanti dello studio risuona limpida la voce di Valeri: «Fosco, cinquanta milioni se fischi al primo contatto».");
                say("mov_brando", "[pallido] I-io... la linea da studio è disturbata... dobbiamo mandare la pubblicità!");
                setStep(N, 4);
                quest("mov_c3_valeri", "La Proposta Indecente", "Affronta il Commendator Valeri dietro le quinte.");
                done();
              }
            }
          ]);
        }
        say("mov_daria", "Non arretriamo di un millimetro!");
        done();
      },

      mov_valeri() {
        const s = S();
        if (s === 4) {
          say("mov_valeri", "[gelido] Avete fatto molto rumore, ragazzi. Ammiro il coraggio. Ma il mondo reale non funziona con i sentimenti.");
          say("mov_valeri", "Questa è una busta con un assegno circolare da cento milioni di lire, intestato a Tele-Rondine. Copre tutti i debiti di Maspero e vi garantisce dieci anni di sponsorizzazione.");
          say("mov_valeri", "In cambio mi consegnate la bobina originale e mandate una smentita ufficiale domani mattina. O prendete i soldi, o vi schiaccio come zanzare.");
          return ask("Cosa fare con l'assegno da 100 milioni del Commendatore?", [
            {
              label: "Opzione A: Rifiuto e Straccio",
              sub: "+30 Etica, +20 Ascolti (Straccia l'assegno davanti alle telecamere accese)",
              big: true, cls: "hot",
              fn: () => {
                K.bond("etica", 30);
                K.bond("ascolti", 20);
                K.rel.add("mov_daria", 6);
                say("mov_daria", "[trionfante] L'ha strappato in quattro pezzi in mondovisione! Sei il nostro eroe!");
                say("mov_valeri", "[furioso] Ve ne pentirete... la finanza chiuderà questo buco prima di notte!");
                fin("straccio");
              }
            },
            {
              label: "Opzione B: Tatticismo Commerciale",
              sub: "-30 Etica, +30 Ascolti (Trattieni l'assegno per coprire i debiti dei dipendenti)",
              big: true, cls: "hot",
              fn: () => {
                K.bond("etica", -30);
                K.bond("ascolti", 30);
                say("mov_corrado", "[sollevato] Gli stipendi sono salvi... non finiremo sulla strada.");
                say("mov_walter", "[deluso] Ma la verità è finita in cassaforte. Speriamo di poterci guardare ancora allo specchio.");
                fin("patto");
              }
            }
          ]);
        }
        say("mov_valeri", "Prendete i soldi o ve ne pentirete.");
        done();
      }
    };

    const zones = {
      mov_campanile: {
        region: "colle",
        name: "Piazza e Campanile dei Corvi",
        short: "Campanile",
        sub: "Pietra secolare, vento sferzante e gabbie di trasmissione",
        bg: "mov_campanile",
        time: "notte",
        w: 32, h: 22, base: "+", start: [4, 15],
        itemCos: "mov_c3",
        items: [[3, 10], [28, 17], [15, 18]],
        areas: [[0, 0, 31, 21, "La vetta ventosa della collina dominata dal campanile"]],
        npcs: () => [
          { id: "mov_silvano", at: [8, 14] }
        ],
        doors: {
          "16,8": { to: "mov_cella", at: [4, 12] },
          "28,15": { to: "mov_studio_tv", at: [4, 14] }
        },
        loot: {
          "18,16": {
            id: "mov_giornale",
            text: "Su una panchina di pietra: una copia del quotidiano «La Voce della Valle» sullo scandalo.",
            empty: "Sulla panchina ci sono solo foglie bagnate."
          }
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 8, "r");
          lay(0, 9, 31, 21, "+");
          // Campanile
          lay(14, 4, 18, 8, "y");
          put(16, 8, "q");
          // Ingresso verso studio Tele-Rondine
          lay(26, 12, 30, 15, "y");
          put(28, 15, "q");
        },
        intro: [
          ["voce", "La tramontana fischia tra le campane di pietra. Il ponte radio verso la città deve partire adesso."]
        ]
      },

      mov_cella: {
        region: "colle",
        interior: true,
        name: "Cella Campanaria e Ponte Radio",
        short: "Cella",
        sub: "Campane di bronzo, valvole termoioniche accese e brezza fredda",
        bg: "mov_cella",
        time: "notte",
        w: 22, h: 16, base: "=", start: [4, 12],
        npcs: () => [],
        objects: {
          "12,8": () => {
            if (S() === 1) {
              say("voce", "Inserisci il fusibile di silicio nel circuito termoionico. Le valvole si accendono di una luce arancione brillante!");
              say("voce", "Il VU-meter del segnale schizza al 100%! Il ponte radio è agganciato!");
              K.bond("chiarezza", 15);
              setStep(N, 2);
              quest("mov_c3_studio", "Rientro in Studio", "Raggiungi lo Studio TV di Tele-Rondine per la trasmissione.");
              return done();
            }
            say("voce", "Il rack delle valvole trasmette a pieno regime verso tutta la vallata.");
            done();
          }
        },
        exits: { "4,13": { to: "mov_campanile", at: [16, 9] } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 21, 1, "a");
          lay(0, 0, 0, 15, "a");
          lay(21, 0, 21, 15, "a");
          lay(0, 15, 21, 15, "a");
          lay(1, 2, 20, 14, "=");
          put(4, 14, "v");
          // Campana e rack trasmettitore
          lay(14, 6, 18, 9, "r");
          put(12, 8, "Z");
        }
      },

      mov_studio_tv: {
        region: "studio",
        interior: true,
        name: "Salotto TV di «Polenta e Rigori»",
        short: "Studio TV",
        sub: "Moquette blu elettrico, telecamere pesanti e riflettori accesi",
        bg: "mov_studio_tv",
        time: "notte",
        w: 24, h: 18, base: "=", start: [4, 14],
        npcs: () => [
          { id: "mov_corrado", at: [6, 8] },
          { id: "mov_daria", at: [10, 8] },
          { id: "mov_brando", at: [16, 8] },
          { id: "mov_valeri", at: [20, 8] }
        ],
        exits: { "4,15": { to: "mov_campanile", at: [28, 16] } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 23, 1, "a");
          lay(0, 0, 0, 17, "a");
          lay(23, 0, 23, 17, "a");
          lay(0, 17, 23, 17, "a");
          lay(1, 2, 22, 16, "=");
          put(4, 16, "v");
          // Divanetto ospiti
          lay(8, 6, 18, 7, "T");
          // Telecamere
          put(6, 12, "Z");
          put(18, 12, "Z");
        }
      }
    };

    return {
      n: N,
      title: "La Diretta delle 20:30",
      sub: "La guerra dell'etere per il primato d'ascolti",
      goal,
      intro: () => [
        ["voce", "Tutta la provincia è sintonizzata sui televisori di casa. È la notte della grande diretta."]
      ],
      start: "mov_campanile",
      zones,
      talk
    };
  }

  boot();
})();
