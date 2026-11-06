// js/dossier/replica.js - DOSSIER INCOMPIUTI di «Eroi in Replica»: SOLI DATI, letti da js/dossier-dati.js.
// Punto di vista: Teodora, l'archivista della Lega Celeste. Cap. 5 «Il Nastro Tagliato» (la stessa notte della fine del cap. 3:
// la luce dell'Archivio accesa, il fascicolo spostato di un centimetro), cap. 6 «Frequenza d'Emergenza» (la diretta della finale allo Stadio del Cielo).
// Brief di altra IA (docs/brief-dossier-replica.txt). Correzione di coerenza: nella saga i poteri di Zenit sono veri e gli alieni sono attori;
// le «repliche» del Progetto Paladino sono quindi CONTROFIGURE UMANE di Zenit (nel '94 lui non sapeva ancora volare), non cloni.
// Minigiochi: «Il banco di montaggio» (prova a tempo, cap. 5) e «I firewall della Sala Master» (prova a tempo, cap. 6).
(function () {
  "use strict";
  const LOOK = { name: "Teodora", style: "bun", hair: "#d1d5db", eye: "#2a2a2a", skin: "#e0b890", acc: ["occhiali"] };
  const TEO = { name: "Teodora", num: 4, cast: Object.assign({ sub: "Archivista capo, turno di notte", shirt: "#52525b" }, LOOK) };
  const TEO6 = { name: "Teodora", num: 4, cast: Object.assign({ sub: "Archivista capo, in fuga", shirt: "#3f3f46" }, LOOK) };
  const BORDER = (w, h, c) => [["lay", 0, 0, w - 1, 0, c || "a"], ["lay", 0, h - 1, w - 1, h - 1, c || "a"], ["lay", 0, 0, 0, h - 1, c || "a"], ["lay", w - 1, 0, w - 1, h - 1, c || "a"]];
  const ROOM = (w, h, exitX) => [["lay", 0, 0, w - 1, h - 1, "+"], ...BORDER(w, h), ["put", exitX, h - 1, "v"]];
  const CAST = {
    rp_corrado: { name: "Corrado «L'Antennista»", desc: "Quarant'anni di cuffie monitor nella sala montaggio della Lega. In pensione dal '95, ma il badge non gliel'ha mai ritirato nessuno. Dice che ogni eroe ha un rumore di fondo che nessun mixer può cancellare.",
      look: { style: "bald", hair: "#e5e7eb", beard: "baffi", eye: "#2a2a2a", skin: "#d9a679", shirt: "#4b5563", acc: ["cuffie"], bg: ["#1f2937", "#7af0c8"] } },
    rp_morosini: { name: "Ispettore Morosini", desc: "Responsabile della Bonifica d'Immagine della Lega Celeste. Completo scuro, sorriso da comunicato stampa, un fascicolo con la vita di tutti i dipendenti. Non alza mai la voce perché non ne ha bisogno.",
      look: { style: "short", hair: "#111827", eye: "#1a1a1a", skin: "#e8c9a0", shirt: "#111827", bg: ["#0b0f1a", "#94a3b8"] } },
  };
  const ENDS = ["teodora_diretta", "teodora_patto"];
  window.__dossierDati.add({
    saga: "replica", after: 4,
    guest: { id: "rp_teodora", saga: "Eroi in Replica · Il Dossier di Teodora", ends: ENDS, lines: [["rp_teodora", "[pensa] Borgo Marino. Niente telecamere, niente nastri, niente Ispettori. (Si sfila la matita dai capelli, li lascia cadere.) Avete un archivio, qui? No? Meglio. Le cose che nessuno scrive restano vere più a lungo."]] },
    deck: {
      id: "rpt", t: "Il Dossier di Teodora", e: "📼", ends: ENDS, lock: "Trova un finale del Dossier di Eroi in Replica",
      d: "Un'archivista, una bobina senza etichetta e dodici eroi che nessuno ha mai visto in faccia.",
      pg: { id: "rp_zero", n: "Replica Zero", i: "🥉", tr: "cuore", d: "La prima controfigura di Zenit. Nel '94 volava appeso a un cavo, al posto suo. La medaglia di ferro ce l'ha ancora lui.", greet: "Una partita a {a}? (Si toglie il mantello sbiadito.) Nessuna telecamera? Allora gioco con la mia faccia.", win: "Gol. Il primo che segno senza che qualcuno lo firmi al posto mio.", lose: "Fa niente. Ho perso di peggio: il nome, per esempio." },
      ev: { n: "La Bobina Senza Etichetta", i: "📼", d: "Una bobina Betacam trovata sotto una panchina, con un nastro adesivo al posto del titolo.", setup: ["Sotto la panchina c'è una bobina Betacam, senza etichetta. Sul nastro adesivo qualcuno ha scritto solo una data: 1994.", "Ogni archivio ha una regola: quello che non ha etichetta non esiste. Ma esiste. Che facciamo?"],
        ch: [["Guardala subito", "audacia", "La verità non aspetta il lunedì.", "Sul monitor scorre un uomo appeso a un cavo che ride, a dieci metri d'altezza, mentre tutti credono che voli. Ridi anche tu: ha l'aria di uno che si diverte.", "Il lettore si mangia il nastro. Ne esce un groviglio marrone che sembra un nido. Lo tieni lo stesso."], ["Cataloga prima", "furbizia", "Data, formato, provenienza.", "Il numero di serie porta a un tecnico in pensione che ti offre il caffè e una storia lunga quarant'anni. La bobina finisce nel registro, con un'etichetta finalmente.", "Il registro dice che la bobina non esiste. Discutere con un registro non porta lontano."], ["Riportala dov'era", "cuore", "Qualcuno l'ha nascosta per un motivo.", "Il giorno dopo, sotto la panchina, al posto della bobina c'è una medaglietta di ferro e un biglietto: «Grazie per non aver guardato».", "La bobina sparisce lo stesso. Il giorno dopo la vedi in diretta, in un servizio sulla «fedeltà degli eroi»."]] },
      tw: { n: "Il Nastro Riavvolto", i: "⏪", d: "Riavvolgi e rifai.", win: "Il nastro riavvolto mostra la versione giusta: il premio sale.", lose: "Il nastro si è smagnetizzato: parte del premio sparisce nel rumore di fondo.", mulWin: 1.3, mulLose: 0.85 },
    },
    chapters: [
      {
        n: 5, title: "Il Nastro Tagliato", sub: "Dossier Incompiuto: la notte dell'Archivio, dal punto di vista di Teodora",
        avatar: TEO, start: "rp_t_archivio", introBg: "rp_archivio",
        intro: [["voce", "<b>DOSSIER INCOMPIUTO · EROI IN REPLICA</b>. L'Archivio della Lega Celeste, la stessa notte in cui il figlio di Zenit ha portato via il registro degli allarmi."], ["rp_teodora", "[pensa] Ventisei anni di turni di notte. So dove sta ogni cosa, e perché non andrebbe trovata. (Si infila la matita nei capelli.) Stanotte qualcuno ha spostato un fascicolo di un centimetro. Io me ne accorgo, dei centimetri."]],
        goal: { 0: "Giro di controllo: la cassa dei nastri da macero, in fondo al Corridoio C (a destra, in basso).", 1: "La bobina «Incidente 1994». Il banco di montaggio è nella Sala Montaggio (in basso a sinistra).", 2: "Qualcuno è sceso nell'Archivio. Passi lenti, scarpe che costano.", 3: "Il codice porta a un tecnico che non dovrebbe più essere qui: cercalo tra gli scaffali alti (in alto a destra)." },
        goalDone: "Il Dossier continua: puoi aprire il Capitolo 6.",
        cast: {
          ...CAST,
        },
        cos: { rp_t_giacca: { kind: "shirt", label: "Giacca dell'Archivista", val: "#52525b", from: "Dossier di Eroi in Replica · Capitolo 5" } },
        lore: { l_paladino: { t: "Il Progetto Paladino", d: "Nel 1994 Zenit aveva poteri veri ma non sapeva ancora volare. Per le riprese dei voli la Lega assunse dodici controfigure, truccate e pettinate come lui, appese a cavi d'acciaio. Contratti a vita, clausola di silenzio. Nei registri ufficiali non sono mai esistite." } },
        zones: {
          rp_t_archivio: {
            region: "archivio", name: "Dossier Replica · L'Archivio Sotterraneo dei Nastri", short: "Archivio dei Nastri", sub: "Scaffali di sei metri, luce verde dei monitor, odore di nastro e ozono", bg: "rp_archivio", time: "notte", travel: [15, 19],
            w: 32, h: 22, start: [15, 19], areas: [[1, 12, 10, 17, "La Sala Montaggio"], [22, 12, 30, 20, "Il Corridoio C · nastri da macero"], [17, 1, 30, 10, "Gli scaffali alti"], [0, 0, 31, 21, "L'Archivio Sotterraneo dei Nastri"]],
            act: { L: "Guarda gli scaffali", n: "Leggi il cartello", T: "Guarda il tavolo", z: "Guarda le casse", x: "Apri la cassa", l: "Guarda la lampada", D: "Guarda l'armadio", b: "Guarda la panca", p: "Guarda il pilastro" },
            flavor: {
              L: "Bobine Betacam numerate fino al soffitto. Ogni numero ha una scheda; ogni scheda ha una data; tre date su quattro sono state corrette a matita. La matita è la tua.",
              n: "Un cartello smaltato: «TROMBA DELL'ASCENSORE 3 · SIGILLATA NEL 1994 · NON APRIRE». Qualcuno, sotto, ha grattato con un'unghia: «ZERO».",
              T: "Il tavolo di lettura. Un registro aperto, una lente, una tazza di caffè freddo da tre turni.",
              z: "Casse di nastro vergine. Odorano di plastica nuova e di cose che ancora non sono successe.",
              l: "Un neon che ronza in si bemolle. Corrado diceva che è l'unica nota onesta di tutta la Lega.",
              D: "L'armadio delle chiavi. Ogni chiave ha un cartellino d'inventario. Una ha solo un nome: «Paladino».",
              b: "Una panca d'acciaio. Ci hai dormito, una notte del '98, durante uno sciopero. Nessuno se n'è accorto.",
              p: "Un pilastro di cemento con le tacche dell'allagamento dell'89. La più alta arriva al tuo mento.",
            },
            intro: [["voce", "L'Archivio Sotterraneo: corridoi di scaffali alti sei metri, il ronzio dei neon, la luce verde dei monitor CRT lasciati accesi. Sopra, la Lega dorme. Sotto, la Lega ricorda."]],
            npcs: [{ id: "rp_ilario", at: [11, 18], when: { step: [0, 1] } }, { id: "rp_morosini", at: [12, 18], when: { step: [2, 9] } }, { id: "rp_corrado", at: [28, 5], when: { step: [3, 9] } }],
            layout: [...BORDER(32, 22),
              ["lay", 14, 1, 16, 20, "+"], ["lay", 1, 11, 30, 11, "+"], ["lay", 17, 19, 30, 19, ":"],
              ["lay", 2, 2, 12, 2, "L"], ["lay", 2, 5, 7, 5, "L"], ["lay", 9, 5, 12, 5, "L"], ["lay", 2, 8, 12, 8, "L"],
              ["lay", 18, 2, 29, 2, "L"], ["lay", 18, 5, 22, 5, "L"], ["lay", 24, 5, 26, 5, "L"], ["lay", 18, 8, 29, 8, "L"],
              ["put", 13, 3, "l"], ["put", 17, 3, "l"], ["put", 13, 9, "l"], ["put", 17, 9, "l"], ["put", 30, 6, "l"], ["put", 1, 6, "l"],
              ["house", 2, 13, 7, 4, { door: [5, 16], roof: "#334155", wall: "#475569", rr: 1, enter: { to: "rp_t_montaggio", at: [7, 9] } }],
              ["lay", 24, 13, 29, 15, "a"], ["put", 26, 16, "n"], ["put", 23, 13, "p"], ["put", 30, 13, "p"],
              ["put", 29, 20, "x"], ["put", 27, 20, "z"], ["put", 28, 17, "z"], ["put", 23, 17, "z"], ["put", 22, 20, "z"],
              ["lay", 9, 19, 10, 19, "T"], ["put", 3, 19, "b"], ["put", 6, 20, "D"], ["put", 20, 14, "l"], ["put", 11, 15, "l"], ["put", 13, 20, "p"], ["put", 17, 20, "p"]],
            trees: [],
          },
          rp_t_montaggio: {
            interior: true, region: "interno", name: "Dossier Replica · La Sala Montaggio", short: "Sala Montaggio", sub: "Due moviole, sei monitor, una sedia girevole che cigola", bg: "rp_archivio", w: 16, h: 12, start: [7, 9], outside: ["rp_t_archivio", 5, 17],
            act: { T: "Usa il banco di montaggio", L: "Guarda le bobine", D: "Guarda l'armadietto", b: "Guarda la sedia", l: "Guarda la lampada", v: "Esci" },
            flavor: { L: "Bobine montate e mai trasmesse: «Zenit salva un gatto (versione con gatto vero)», «Invasione 3, ciak 14», «Applausi assortiti, 1991».", D: "L'armadietto di Corrado. Dentro: un paio di cuffie con l'imbottitura consumata a forma di orecchio, e una foto di dodici uomini identici in posa, tutti con lo stesso mantello.", b: "La sedia girevole di Corrado. Cigola su un lato solo: quello da cui ascoltava.", l: "Una lampada da tavolo col paralume bruciacchiato. Qui dentro le notti erano più lunghe." },
            intro: [["voce", "La Sala Montaggio: due moviole, sei monitor in fila, nastri adesivi colorati sulle manopole. Su ogni manopola, una parola a pennarello. Su quella del volume: «PIANO»."]],
            npcs: [],
            layout: [...ROOM(16, 12, 7), ["lay", 4, 3, 11, 3, "T"], ["lay", 1, 1, 5, 1, "L"], ["lay", 10, 1, 14, 1, "L"], ["put", 14, 5, "D"], ["put", 2, 6, "b"], ["put", 1, 9, "l"], ["put", 14, 9, "l"], ["put", 1, 4, "L"]],
          },
        },
        talk: {
          rp_ilario: [
            { when: { step: 0 }, do: [{ say: [["rp_ilario", "[pensa] (Seduto al tavolo, un copione in mano.) Teodora. Non dormo neanche io. Il ragazzo, il figlio di Zenit, ha portato via il registro. Domani c'è la finale in diretta e io devo suggerire a un padre cosa dire a un figlio. (Gira pagina.) Non c'è scritto."], ["rp_teodora", "Faccio il giro, Ilario. Il Corridoio C lo controllo sempre per ultimo."], ["rp_ilario", "[sorpreso] Il C? Quello del macero? (Abbassa la voce.) Una volta ci ho visto entrare Corrado, l'Antennista, con una bobina sotto la giacca. Era il '95. Non l'ho mai suggerito a nessuno."]] }] },
            { when: { step: 1 }, do: [{ say: [["rp_ilario", "Quella bobina… (Guarda l'etichetta, poi guarda altrove.) Io suggerisco battute, Teodora. Non le leggo. Il banco di montaggio è di là, se proprio vuoi saperlo."]] }] },
          ],
          rp_morosini: [
            { when: { step: 2 }, do: [
              { say: [["rp_morosini", "[felice] (Completo scuro, una cartella sotto il braccio. Il sorriso arriva un attimo prima di lui.) Signora Teodora. Ventisei anni di servizio, tre richiami per «eccesso di precisione», nessuna ferie non godute. (Pausa.) Lo so perché è scritto qui."], ["rp_morosini", "Bonifica d'Immagine. Morosini. Stanotte qualcuno ha consultato il registro degli allarmi. E un minuto fa, la Sala Montaggio ha acceso un lettore Betacam. A quest'ora. Mi dica lei."]] },
              { ask: { who: "rp_morosini", prompt: "(Non alza la voce. Aspetta. Sotto la tua giacca, la bobina pesa come un mattone.) Allora, signora?", secs: 10, def: 1, options: [
                { label: "«Inventario notturno, Ispettore»", sub: "Menti con calma: i registri li hai scritti tu", big: true, do: [{ flag: { rp_t_risposta: "inventario" } }, { bond: ["colpa", 1] }, { say: [["rp_morosini", "[pensa] Inventario. Ma certo. (Annota qualcosa.) Lei è l'unica persona della Lega che mente con la stessa calligrafia con cui scrive la verità. È un complimento, signora. Più o meno."]] }, { call: "dopo_morosini" }] },
                { label: "(Gli porgi un'altra bobina)", sub: "«Zenit salva un gatto», versione con gatto vero", big: true, do: [{ flag: { rp_t_risposta: "scambio" } }, { bond: ["rabbia", 1] }, { say: [["rp_morosini", "[sorpreso] (Legge l'etichetta.) «Zenit salva un gatto. Versione con gatto vero». (Sorride, per la prima volta senza comunicato stampa.) La porto via lo stesso. Non si sa mai che anche il gatto fosse un attore."]] }, { call: "dopo_morosini" }] },
                { label: "«Cerco un nastro che non esiste»", sub: "Mezza verità, guardandolo negli occhi", do: [{ flag: { rp_t_risposta: "verita" } }, { bond: ["fiducia", 1] }, { say: [["rp_morosini", "[pensa] Un nastro che non esiste. (Chiude la cartella.) Allora non lo troverà, signora. E se lo trova, si ricordi: le cose che non esistono non si possono trasmettere. Si possono solo perdere."]] }, { call: "dopo_morosini" }] },
              ] } },
            ] },
            { when: { step: [3, 9] }, do: [{ say: [["rp_morosini", "[felice] Prosegua pure con il suo… inventario. Io resto qui. Mi piace l'odore dei nastri: sa di cose che si possono ancora tagliare."]] }] },
          ],
          rp_corrado: [
            { when: { step: 3 }, do: [
              { if: { flag: "rp_t_codice" },
                then: [{ say: [["rp_teodora", "[serio] CRD-77. La matricola sul nastro era la tua, Corrado. L'hai cucita dentro il segnale, tra un fotogramma e l'altro."], ["rp_corrado", "[felice] (Si sfila una cuffia. Una sola: dall'altra parte non sente più da vent'anni.) L'hai trovata. Lo sapevo che eri tu, quella giusta. Gli altri archivisti guardano le etichette. Tu guardi il rumore."]] }, { call: "corrado" }],
                else: [{ say: [["rp_teodora", "[serio] Il codice era mezzo cancellato. Ma Ilario ti ha visto, nel '95, nel Corridoio C. E la tua sedia cigola ancora su un lato solo."], ["rp_corrado", "[ride] (Si sfila una cuffia. Una sola.) Ilario. Il suggeritore che non suggerisce mai la cosa importante. Va bene, archivista: ci sei arrivata a orecchio. È il modo migliore."]] }, { call: "corrado" }] },
            ] },
            { do: [{ say: [["rp_corrado", "Domani la finale. Tutta la Lega in diretta. (Si rimette la cuffia.) È l'unica sera in cui la Sala Master guarda lo stadio e non guarda dietro di sé."]] }] },
          ],
        },
        obj: {
          "rp_t_archivio:x": [
            { when: { step: 0 }, do: [
              { say: [["voce", "La cassa dei nastri da macero: bobine smagnetizzate, nastri spezzati, scarti di regia. Sul fondo, sotto un doppio fondo di cartone, una bobina Betacam con un'etichetta battuta a macchina."], ["voce", "«INCIDENTE 1994 · NON TRASMETTERE». Sotto, a penna: «Né distruggere».", ], ["rp_teodora", "[pensa] Il macero passa ogni venerdì da ventisei anni. E da ventisei anni questa bobina non ci finisce. (La soppesi.) Qualcuno la sposta. Ogni settimana. Di un centimetro."]] },
              { quest: ["rp_t_nastro", "Il Nastro Tagliato", "Il banco di montaggio, nella Sala Montaggio."] }, { step: 1 }, { done: true },
            ] },
            { do: [{ say: [["voce", "La cassa del macero. Il doppio fondo è vuoto. Il cartone ha ancora la forma della bobina."]] }] },
          ],
          "rp_t_montaggio:T": [
            { when: { step: 1 }, do: [
              { say: [["voce", "Il banco di montaggio. Infili la bobina. Sul monitor: righe, neve, un fischio acuto. Il nastro è stato «sporcato» apposta: audio e video sfasati, e sopra un disturbo a frequenza fissa, quello che la sicurezza della Lega usa per rendere illeggibili i nastri riservati."], ["rp_teodora", "[pensa] Allineare le tracce, tagliare il disturbo. Prima che la sicurezza veda il lettore acceso sui suoi monitor. (Guardi l'orologio del banco.) Pochi secondi a passaggio."]] },
              { trial: { title: "Il banco di montaggio", bg: "rp_archivio", secs: 7, need: 3, rounds: [
                { prompt: "Traccia video: il quadro scorre in verticale. Cosa regoli?", options: [{ label: "Il tracking del lettore", ok: true }, { label: "Il volume" }, { label: "La luminosità del monitor" }], good: "Il quadro si ferma. Un corridoio, un ascensore, un uomo in mantello.", bad: "Il quadro continua a scorrere. Vedi solo un mantello che sale e scende." },
                { prompt: "Traccia audio: la voce arriva mezzo secondo dopo le labbra. Come la rimetti a sincrono?", options: [{ label: "Sposti l'audio di 12 fotogrammi in avanti", ok: true }, { label: "Alzi il volume" }, { label: "Togli l'audio" }], good: "Le labbra e la voce si ritrovano. Ora senti cosa dice.", bad: "La voce resta indietro, come un'eco di se stessa." },
                { prompt: "Il fischio di sicurezza: 15.734 hertz, fisso. Dove tagli?", options: [{ label: "Filtro stretto, solo su quella frequenza", ok: true }, { label: "Abbassi tutti gli acuti" }, { label: "Lo lasci: non si sente quasi" }], good: "Il fischio sparisce. Sotto, c'era un respiro.", bad: "Con il fischio se ne va anche metà della voce." },
                { prompt: "Nell'angolo, tra due fotogrammi, un codice che lampeggia per un istante. Cosa fai?", options: [{ label: "Fermo immagine, fotogramma per fotogramma", ok: true }, { label: "Riavvolgi tutto" }, { label: "Lo ignori: è un difetto" }], good: "«CRD-77». Una matricola della sala montaggio.", bad: "Il codice passa. Resta solo una scia bianca." },
              ], win: [{ flag: { rp_t_codice: true } }, { call: "video" }], lose: [{ call: "video" }] } },
            ] },
            { do: [{ say: [["voce", "Il banco di montaggio. Sul monitor, fermo, l'ultimo fotogramma: una porta d'ascensore aperta sul buio."]] }] },
          ],
        },
        blocks: {
          video: [
            { say: [["voce", "Il nastro. 1994, il primo Torneo della Lega. Un corridoio di servizio sotto la Torre. Un uomo con il mantello di Zenit, la stessa mascella, lo stesso ciuffo, ma un'altra voce: più bassa, più stanca."], ["voce", "«Io non lo dico, quel testo», dice l'uomo alla telecamera. «Non dico che gli alieni sono cattivi. Li conosco: uno fa il ragioniere, l'altro suona in una banda.» Una voce fuori campo: «Paladino Uno, è contratto». L'uomo si toglie il microfono. Entra nella tromba dell'ascensore 3. Le porte si chiudono. Il nastro finisce."], ["rp_teodora", "[triste] (Fermi il nastro. Le dita sono nere di polvere magnetica.) Paladino Uno. Una controfigura. Nel '94 Zenit non sapeva ancora volare. Qualcuno volava al posto suo, appeso a un cavo. (Pausa.) E poi è sparito in un ascensore sigillato."]] },
            { step: 2 }, { quest: ["rp_t_nastro", "Passi nell'Archivio", "Qualcuno è sceso. Esci dalla Sala Montaggio."] }, { done: true },
          ],
          dopo_morosini: [
            { say: [["rp_morosini", "Domani c'è la finale, signora. Una sera importante per tutti. (Si sistema la cravatta.) Le consiglio di passarla a casa. La Bonifica, domani, lavora."]] },
            { step: 3 }, { quest: ["rp_t_nastro", "Il tecnico che non c'è", "Tra gli scaffali alti, in fondo a destra."] }, { done: true },
          ],
          corrado: [
            { say: [["rp_corrado", "[serio] Progetto Paladino. Dodici controfigure, dodici Zenit di ricambio. Zenit aveva la forza, la faccia, il cuore. Il volo no: quello è arrivato a trent'anni. Fino ad allora volavano loro, sui cavi, e io coprivo il cigolio delle carrucole col vento finto."], ["rp_corrado", "Il primo, Paladino Uno, nel '94 si è rifiutato di recitare l'invasione. Non è caduto, nella tromba: ci è salito. Vive nei condotti della Torre Celeste da trent'anni. Lo chiamiamo Zero. Gli altri undici, quando la Lega ha deciso che non servivano più, li ha messi sotto contratto e sotto terra. Letteralmente: sotto la tribuna."], ["rp_teodora", "[serio] E tu hai tenuto il nastro."], ["rp_corrado", "[triste] Ogni eroe ha un rumore di fondo, Teodora. Nessun mixer lo cancella. (Ti dà un foglietto unto.) La frequenza d'emergenza della Sala Master. Domani, durante la premiazione, la Lega è in onda su tutti i canali. Chi tocca quel selettore, parla a tutti."]] },
            { step: 4 }, { bond: ["fiducia", 1] }, { finish: "dossier_c5" }, { reward: { key: "rp_c5_dossier", give: { coins: 180, cos: ["rp_t_giacca"] } } },
            { scene: [["rp_teodora", "[pensa] (Rimetti la bobina sotto la giacca. Pesa meno, adesso che sai cosa c'è dentro.) Domani, Corrado. Alla Torre."], ["rp_corrado", "[felice] Porta le cuffie. Lassù il rumore di fondo è più forte."], ["voce", "<b>CAPITOLO 5 DEL DOSSIER CONCLUSO</b> {reward}<br>Quella notte, al piano di sopra, il figlio di Zenit dorme con un registro sotto il cuscino. Sotto i suoi piedi, un'archivista non dorme affatto."]], openMain: true, bg: "rp_archivio" },
          ],
        },
      },
      {
        n: 6, title: "Frequenza d'Emergenza", sub: "Dossier Incompiuto: la diretta della finale, dalla Sala Master della Torre Celeste",
        avatar: TEO6, start: "rp_t_torre", introBg: "rp_stadio",
        intro: [["voce", "<b>DOSSIER INCOMPIUTO · EROI IN REPLICA</b>. Lo Stadio del Cielo, la sera della finale. Metà tribuna per Zenit, metà per suo figlio. Diretta su tutti i canali."], ["rp_teodora", "[pensa] Il badge me l'hanno sospeso alle otto di stamattina. Alle otto e un quarto ho preso quello di Corrado. (La bobina è nella borsa degli attrezzi, tra due cacciaviti.) La sicurezza cerca un'archivista. Stasera io sono un tecnico."]],
        goal: { 0: "Corrado ti aspetta ai piedi della Torre, vicino alle panche (in basso a sinistra).", 1: "Le griglie di ventilazione, dietro le casse a destra: Zero vive lì.", 2: "Morosini ha lasciato la porta della Torre. Sali alla Sala Master e passa i firewall.", 3: "La premiazione sta per andare in onda. Morosini è nella Sala Master: decidi." },
        goalDone: "Il Dossier di Eroi in Replica è concluso.",
        cast: {
          ...CAST,
          rp_zero: { name: "Replica Zero", desc: "Paladino Uno, la prima controfigura di Zenit. Nel 1994 volava al posto suo, appeso a un cavo. Si è rifiutato di recitare l'invasione ed è sparito nella tromba dell'ascensore. Vive nei condotti della Torre Celeste. Ha ancora la medaglia di ferro del primo torneo: quella vera.",
            look: { style: "spiky", hair: "#a8a29e", beard: "folta", eye: "#2a2a2a", skin: "#e0b890", shirt: "#3b4f7a", bg: ["#1e293b", "#a8a29e"] } },
        },
        lore: { l_medaglia_ferro: { t: "La medaglia di ferro", d: "Il primo Torneo della Lega, 1994: il volo finale lo fece una controfigura, Paladino Uno. La medaglia la ritirò Zenit, poi la Lega gliene fece fare una copia d'oro per le foto. L'originale, di ferro, è rimasta a chi aveva volato." } },
        zones: {
          rp_t_torre: {
            region: "stadio", name: "Dossier Replica · Ai piedi della Torre Celeste", short: "La Torre Celeste", sub: "La finale in diretta, le tribune piene, la Torre di Trasmissione", bg: "rp_stadio", time: "notte", travel: [4, 19],
            w: 32, h: 22, start: [4, 19], areas: [[11, 7, 20, 14, "La Torre di Trasmissione"], [23, 14, 30, 20, "Le griglie di ventilazione"], [1, 1, 30, 3, "Le tribune dello Stadio del Cielo"], [0, 0, 31, 21, "Ai piedi della Torre Celeste"]],
            act: { j: "Guarda le tribune", n: "Leggi il cartello", z: "Guarda le casse", b: "Guarda la panca", l: "Guarda il faro", p: "Guarda il traliccio", D: "Guarda la griglia" },
            flavor: {
              j: "Le tribune piene. Metà canta per Zenit, metà per suo figlio. Nessuno, da lassù, guarda la Torre.",
              n: "«TORRE CELESTE · ACCESSO RISERVATO AL PERSONALE DI REGIA». Sotto, più piccolo: «La Lega vi ringrazia per il vostro silenzio».",
              z: "Casse di cavi e di riflettori. Una è aperta: dentro, trentadue costumi da invasore, piegati con cura.",
              b: "Una panca da bordo campo. Ci si siedono i tecnici, durante gli spot. Stasera non ci sono spot: c'è la verità, o la sua replica.",
              l: "Un faro dello stadio. Illumina il campo e lascia la Torre al buio: è stato progettato così.",
              p: "Un traliccio d'antenna. Corrado dice che ci ha lasciato sopra un udito e mezzo.",
              D: "Una griglia di ventilazione. Dall'interno arriva un fischio lento, umano: qualcuno, là dentro, fischietta l'inno della Lega. Stonato apposta.",
            },
            intro: [["voce", "Ai piedi della Torre di Trasmissione: cavi grossi come braccia, casse di riflettori, il boato dello stadio che arriva a ondate. In cima alla Torre, la Sala Master: vetrate illuminate, e dentro, chi decide cosa vede il mondo."]],
            npcs: [{ id: "rp_corrado", at: [6, 17], when: { step: [0, 1] } }, { id: "rp_morosini", at: [15, 14], when: { step: [0, 1] } }, { id: "rp_zero", at: [26, 17], when: { step: [0, 2] } }],
            layout: [...BORDER(32, 22, "a"), ["lay", 1, 1, 30, 2, "j"], ["lay", 1, 3, 30, 3, ":"],
              ["house", 12, 8, 8, 6, { door: [15, 13], roof: "#38bdf8", wall: "#cbd5e1", rr: 3, enter: { to: "rp_t_master", at: [7, 9] } }],
              ["lay", 15, 14, 15, 20, ":"], ["lay", 3, 19, 28, 19, ":"], ["lay", 4, 4, 4, 19, ":"],
              ["put", 11, 13, "n"], ["put", 10, 7, "p"], ["put", 21, 7, "p"],
              ["lay", 24, 15, 29, 15, "z"], ["put", 24, 16, "z"], ["put", 24, 18, "z"], ["put", 29, 16, "z"], ["put", 29, 18, "z"], ["lay", 25, 14, 28, 14, "D"],
              ["put", 3, 16, "b"], ["put", 8, 16, "b"], ["put", 20, 17, "b"],
              ["put", 2, 5, "l"], ["put", 29, 5, "l"], ["put", 9, 20, "l"], ["put", 22, 20, "l"], ["put", 15, 5, "l"], ["put", 7, 10, "z"], ["put", 8, 10, "z"]],
            trees: [[2, 9], [29, 10], [7, 5], [24, 6], [2, 13], [11, 17], [19, 12]],
          },
          rp_t_master: {
            interior: true, region: "interno", name: "Dossier Replica · La Sala Master della Torre Celeste", short: "Sala Master", sub: "Consolle illuminate a giorno, vetrate sullo stadio, una cupola di vetro rosso", bg: "rp_stadio", w: 16, h: 12, start: [7, 9], outside: ["rp_t_torre", 15, 14],
            act: { T: "Usa la consolle", W: "Guarda dalle vetrate", x: "Il selettore d'emergenza", L: "Guarda i nastri", D: "Guarda il rack", v: "Esci" },
            flavor: { W: "Dalle vetrate, lo stadio intero: le due metà della tribuna, il cerchio di centro, un padre e un figlio piccoli come soldatini.", L: "I nastri della serata, già montati: «Premiazione · versione A», «Premiazione · versione B», «Premiazione · versione in caso di imprevisti». Sono tutte uguali.", D: "Il rack dei segnali. Una spia rossa per ogni canale nazionale. Stasera sono tutte accese." },
            intro: [["voce", "La Sala Master: consolle illuminate a giorno, cento monitor, la diretta che passa davanti a tutti come un fiume. In fondo, sotto una cupola di vetro rosso, il banco dei selettori d'emergenza. Una sola leva, per tutti i canali."]],
            npcs: [{ id: "rp_corrado", at: [3, 6], when: { step: [2, 9] } }, { id: "rp_zero", at: [12, 8], when: { step: [3, 9] } }, { id: "rp_morosini", at: [9, 6], when: { step: [3, 9] } }],
            layout: [...ROOM(16, 12, 7), ["lay", 3, 0, 12, 0, "W"], ["lay", 2, 3, 13, 3, "T"], ["put", 13, 6, "x"], ["put", 1, 1, "D"], ["put", 14, 1, "D"], ["lay", 1, 9, 1, 10, "L"], ["lay", 14, 9, 14, 10, "L"]],
          },
        },
        talk: {
          rp_corrado: [
            { when: { step: 0 }, do: [
              { say: [["rp_corrado", "[felice] (Tuta da tecnico, cuffie al collo, un rotolo di cavo sulla spalla.) Bel badge. Chi è quel vecchio nella foto? Ah, io. Ero bello, nel '79."], ["rp_corrado", "[serio] Morosini è sulla porta della Torre, da un'ora. Non entra, non esce: aspetta te. (Indica le casse a destra.) Ma c'è una strada che lui non conosce, perché non è su nessun registro. Chiedi a Zero. Fischietta stonato: lo riconosci."]] },
              { quest: ["rp_t_frequenza", "Frequenza d'Emergenza", "Le griglie di ventilazione dietro le casse, a destra."] }, { step: 1 }, { done: true },
            ] },
            { when: { step: 1 }, do: [{ say: [["rp_corrado", "Zero ha paura delle telecamere, non delle persone. Parlagli come a un collega. Lo è."]] }] },
            { when: { step: 2 }, do: [{ say: [["rp_corrado", "[serio] Firewall audiovisivi: tre cancelli, uno dopo l'altro. Li ho visti installare. Ero sordo da un orecchio, ma ci vedevo benissimo. La consolle è davanti a te."]] }] },
            { do: [{ say: [["rp_corrado", "Qualunque cosa decidi, Teodora, io stasera non ho sentito niente. (Si tocca la cuffia.) Per una volta è vero solo a metà."]] }] },
          ],
          rp_morosini: [
            { when: { step: [0, 1] }, do: [{ say: [["rp_morosini", "[felice] Un tecnico! A quest'ora! (Guarda il badge, poi te, poi il badge.) Corrado Ferri, classe 1941. Si conserva benissimo, signor Ferri. (Non si sposta di un centimetro.) La Torre è chiusa fino alla premiazione. Ordini della Bonifica."]] }] },
            { when: { step: 3 }, do: [
              { say: [["rp_morosini", "[serio] (È entrato senza far rumore. Ha la cartella aperta.) Signora Teodora. Si sieda, la prego. Non ho bisogno di alzare la voce, e lei non ha bisogno di toccare quella leva."]] },
              { if: { flag: "rp_t_visti" },
                then: [{ say: [["rp_morosini", "I firewall hanno mandato un allarme sui miei monitor tre minuti fa. Lei lavora bene, ma non in silenzio. (Sorride.) Ho avuto il tempo di preparare un'offerta."]] }, { call: "offerta" }],
                else: [{ say: [["rp_morosini", "[sorpreso] Nessun allarme. Tre firewall, e nessuno se n'è accorto. (Chiude la cartella.) Lei è pericolosa, signora. Per questo le faccio un'offerta, invece di una minaccia."]] }, { call: "offerta" }] },
            ] },
            { do: [{ say: [["rp_morosini", "[pensa] Domani i giornali scriveranno qualcosa. Io scrivo i giornali da vent'anni. Per la prima volta, non so cosa."]] }] },
          ],
          rp_zero: [
            { when: { step: 0 }, do: [{ say: [["rp_zero", "(Dalla griglia, un fischio stonato si interrompe.) …Chi è? Non sei della Bonifica: quelli non fischiettano mai. Torna con il vecchio Corrado. Di lui mi fido."]] }] },
            { when: { step: 1 }, do: [
              { say: [["rp_zero", "[pensa] (La griglia si apre da dentro. Esce un uomo di sessant'anni con il mantello di Zenit, sbiadito, rammendato con filo da pesca. Ha la stessa mascella. Gli occhi no.) Paladino Uno. Gli amici, quando ne avevo, dicevano Zero. Perché ero il primo, e perché nei registri valgo quello."], ["rp_teodora", "[serio] Ho visto il nastro. L'ascensore."], ["rp_zero", "[triste] Il cavo era agganciato in cima alla tromba. Sono salito. Da trent'anni vivo nei condotti: conosco la Torre meglio di chi l'ha costruita. Gli altri undici sono sotto la tribuna est. Hanno un contratto che dice «a vita». Non dice di chi."], ["rp_zero", "(Apre il pugno. Dentro c'è una medaglia di ferro, annerita.) Il primo Torneo, 1994. Il volo finale l'ho fatto io. Lui ha ritirato la medaglia, e la Lega gliene ha fatta una d'oro per le foto. Questa è quella vera. (Pausa.) Non ce l'ho con lui. Non sapeva volare. Nessuno sapeva niente. Era il bello e il brutto."]] },
              { ask: { who: "rp_zero", prompt: "Morosini sta sulla porta. Io ti porto su dai condotti, fino alla Sala Master. Ma prima dimmi una cosa, archivista: lassù, cosa vuoi fare con quel nastro?", options: [
                { label: "«Mostrarlo. A tutti»", sub: "La verità, anche se fa male", big: true, do: [{ flag: { rp_t_zero: "mostra" } }, { bond: ["rabbia", 1] }, { call: "condotti" }] },
                { label: "«Usarlo. Per tirarvi fuori»", sub: "Le vite prima della verità", big: true, do: [{ flag: { rp_t_zero: "usa" } }, { bond: ["fiducia", 1] }, { call: "condotti" }] },
                { label: "«Non lo so ancora»", sub: "Lo decidi lassù", do: [{ flag: { rp_t_zero: "dubbio" } }, { bond: ["colpa", 1] }, { call: "condotti" }] },
              ] } },
            ] },
            { when: { step: 2 }, do: [{ say: [["rp_zero", "Morosini l'ho mandato via io: ho fatto cadere un riflettore dall'altra parte dello stadio. Nessun ferito, molto rumore. Sali. Io vi raggiungo dai condotti."]] }] },
            { when: { step: 3 }, do: [{ say: [["rp_zero", "[pensa] (Guarda lo stadio dalle vetrate. Il figlio di Zenit, piccolo come un soldatino, sta per volare davvero.) Trent'anni che non vedo una partita dal vivo. (Sorride.) Fai tu, archivista. Io guardo."]] }] },
          ],
        },
        obj: {
          "rp_t_master:T": [
            { when: { step: 2 }, do: [
              { say: [["voce", "La consolle principale. Sul monitor di controllo, tre righe verdi: «FIREWALL 1 · INGRESSO SEGNALE», «FIREWALL 2 · RITARDO DI SICUREZZA», «FIREWALL 3 · SELETTORE D'EMERGENZA». Ogni passaggio ha un timer: se scade, l'allarme parte sui monitor della Bonifica."], ["rp_corrado", "[serio] Io leggo i numeri, tu scegli. Come ai vecchi tempi, quando i vecchi tempi non c'erano ancora."]] },
              { trial: { title: "I firewall della Sala Master", bg: "rp_stadio", secs: 6, need: 2, rounds: [
                { who: "rp_corrado", prompt: "Firewall 1: il lettore Betacam non è autorizzato. Il sistema accetta solo segnali con il marchio della Lega in sovrimpressione. Come lo fai passare?", options: [{ label: "Fai girare la bobina dentro il rullo «Applausi assortiti»", ok: true }, { label: "Stacchi il cavo del marchio" }, { label: "Riavvii la consolle" }], good: "Passa. Il sistema vede applausi. Applaude anche lui.", bad: "Spia gialla. Sui monitor della Bonifica, una riga in più." },
                { who: "rp_corrado", prompt: "Firewall 2: la diretta ha otto secondi di ritardo di sicurezza, per tagliare gli imprevisti. Come lo aggiri?", options: [{ label: "Colleghi il nastro dopo il ritardo, sull'uscita finale", ok: true }, { label: "Allunghi il ritardo a un minuto" }, { label: "Speri che nessuno guardi" }], good: "Otto secondi spariti. Quello che passa, passa subito.", bad: "Il ritardo resta: qualcuno, di sotto, avrà otto secondi per tagliare." },
                { who: "rp_corrado", prompt: "Firewall 3: la cupola rossa chiede un codice a quattro cifre. Corrado dice: «È l'anno in cui hanno smesso di avere paura».", options: [{ label: "1994", ok: true }, { label: "1979" }, { label: "0000" }], good: "La cupola si apre con un sospiro di aria compressa. Sotto, una leva sola.", bad: "La cupola si apre lo stesso, con un allarme muto. Corrado la forza col cacciavite." },
              ], win: [{ call: "firewall" }], lose: [{ flag: { rp_t_visti: true } }, { call: "firewall" }] } },
            ] },
            { do: [{ say: [["voce", "La consolle. Sui monitor, la diretta: il cerchio di centro, il padre, il figlio, il pubblico che non sa niente."]] }] },
          ],
          "rp_t_master:x": [
            { when: { step: [0, 2] }, do: [{ say: [["voce", "Il banco dei selettori d'emergenza, sotto una cupola di vetro rosso. Chiusa. Prima i firewall, sulla consolle."]] }] },
            { when: { step: 3 }, do: [{ say: [["rp_teodora", "[pensa] (La mano sulla cupola aperta. Morosini, alle tue spalle, aspetta.) Prima lo ascolto. Le cose si decidono dopo aver sentito tutte le versioni. È la prima regola di un archivio."]] }] },
            { do: [{ say: [["voce", "La cupola rossa è aperta. La leva è dove l'hai lasciata."]] }] },
          ],
        },
        endings: {
          teodora_diretta: ["LA DIRETTA NAZIONALE", "Dossier Incompiuto: Teodora abbassa la leva della frequenza d'emergenza. Durante la premiazione, su tutti i canali, va in onda il nastro del '94: Paladino Uno che si toglie il microfono e dice no. Il castello di finzioni della Lega Celeste crolla in diretta. Le undici controfigure escono da sotto la tribuna est, davanti alle telecamere, con la loro faccia. È caro, il prezzo. Ma per la prima volta la verità è libera.", "Nel Dossier, manda in onda il nastro."],
          teodora_patto: ["IL PATTO NEL BUIO", "Dossier Incompiuto: Teodora non tocca la leva. Mette la bobina sulla cartella di Morosini e detta le condizioni: liberazione delle undici controfigure, nuove identità, una pensione vera, e un posto in prima fila allo stadio per Zero. La Lega firma. Il nastro torna nell'Archivio, con un'etichetta nuova scritta a matita: «Da trasmettere quando nessuno ne avrà più bisogno».", "Nel Dossier, usa il nastro per patteggiare."],
        },
        blocks: {
          condotti: [
            { say: [["rp_zero", "[felice] Va bene. Chi non sa ancora è il più onesto di tutti. (Si rimette il mantello.) Dammi due minuti: faccio cadere un riflettore dall'altra parte dello stadio. Morosini corre sempre verso il rumore. È il suo mestiere."], ["voce", "Poco dopo, dall'altra parte dello stadio, un riflettore scivola giù da un traliccio con un fracasso enorme. Nessun ferito. Morosini, dalla porta della Torre, sparisce verso la tribuna ovest, camminando. Non corre mai."]] },
            { step: 2 }, { quest: ["rp_t_frequenza", "La Sala Master", "La porta della Torre è libera. Sali alla consolle."] }, { done: true },
          ],
          firewall: [
            { step: 3 },
            { say: [["rp_corrado", "[felice] Tre su tre, o quasi. (Si sfila le cuffie.) La leva è lì. Stadio, nazione, canali: tutto passa da quel pezzo di plastica rossa."], ["voce", "Una porta si apre alle tue spalle. Passi lenti. Scarpe che costano. Dalla griglia del soffitto, intanto, scende Zero, impolverato fino ai capelli."]] },
            { quest: ["rp_t_frequenza", "La leva", "Morosini è nella Sala Master. Ascoltalo, poi decidi."] }, { done: true },
          ],
          offerta: [
            { say: [["rp_morosini", "[pensa] Se manda in onda quel nastro, la Lega cade. Con lei cadono anche le pensioni di trecento dipendenti, gli ospedali che finanziamo, e la fiducia di un paese che per trent'anni ha dormito tranquillo. (Pausa.) Gli undici sotto la tribuna diventano un'inchiesta. Le inchieste durano dieci anni."], ["rp_morosini", "Se invece lei mi dà la bobina, io le do quello che vuole. Nuove identità, una pensione, una casa per ciascuno. Domattina. Firmo qui, davanti a lei e a… (guarda Zero) al signor Zero."], ["rp_zero", "[serio] Non guardare me, archivista. Io ho già detto no una volta. Tocca a te."]] },
            { ask: { who: "rp_morosini", prompt: "(La diretta scorre sui monitor. Il padre e il figlio stanno per salire sul podio. Mancano trenta secondi alla premiazione.) Allora, signora Teodora?", options: [
              { label: "Abbassa la leva", sub: "Finale: La Diretta Nazionale", cls: "hot", big: true, do: [{ call: "finale_diretta" }] },
              { label: "Metti la bobina sulla sua cartella", sub: "Finale: Il Patto nel Buio", big: true, do: [{ call: "finale_patto" }] },
            ] } },
          ],
          finale_diretta: [
            { end: "teodora_diretta" }, { unlock: ["rp_corrado", "rp_zero"] }, { finish: "teodora_diretta" }, { step: 9 }, { bond: ["rabbia", 1] }, { reward: { key: "end:teodora_diretta", give: { coins: 300 } } },
            { scene: [["voce", "La leva scende con un clic piccolo, quasi ridicolo. Su cento monitor la premiazione si ferma. Al suo posto: un corridoio del 1994, un uomo con il mantello di Zenit che si toglie il microfono. «Io non lo dico, quel testo.»"], ["rp_morosini", "[triste] (Chiude la cartella. Per la prima volta, alza la voce. Di poco.) Lei ha appena licenziato un paese intero, signora."], ["rp_teodora", "[serio] No, Ispettore. Gli ho solo dato la versione integrale. Il resto lo decidono loro."], ["rp_zero", "[felice] (Dalle vetrate guarda la tribuna est: le porte di servizio si aprono, undici uomini in mantello sbiadito escono sul prato, sotto i fari.) Guarda, archivista. Hanno ancora tutti la stessa mascella. Ma stasera hanno anche un nome."], ["voce", "<b>DOSSIER CONCLUSO: LA DIRETTA NAZIONALE!</b> {reward}<br>Hai sbloccato le carte <b>«Replica Zero»</b> e <b>«Corrado l'Antennista»</b> nella Squadra dei Sogni! Teodora ora passa anche al Borgo Marino, e nelle Carte del Destino c'è il mazzo «Il Dossier di Teodora»."]], openMain: true, bg: "rp_stadio" },
          ],
          finale_patto: [
            { end: "teodora_patto" }, { unlock: ["rp_corrado", "rp_zero"] }, { finish: "teodora_patto" }, { step: 9 }, { bond: ["fiducia", 1] }, { reward: { key: "end:teodora_patto", give: { coins: 300 } } },
            { scene: [["rp_morosini", "[sorpreso] (Guarda la bobina sulla cartella. Poi te.) Lei poteva far cadere tutto. E sceglie undici persone. (Firma, senza leggere.) Non lo scriverò in nessun comunicato. Ma lo ricorderò."], ["rp_teodora", "[pensa] Firmi anche il punto dodici, Ispettore. Un posto in prima fila, allo stadio, per il signor Zero. A vita. E stavolta «a vita» vuol dire la sua."], ["rp_zero", "[felice] (Si gira la medaglia di ferro tra le dita.) Prima fila. Trent'anni a guardare dai condotti. (Ride, stonato come il suo fischio.) Mi porto il thermos."], ["voce", "Sui monitor, la premiazione va in onda come da copione. Nessuno, in tutto il paese, nota l'archivista che esce dalla Torre con una borsa degli attrezzi vuota e un sorriso che non è in nessun registro."], ["voce", "<b>DOSSIER CONCLUSO: IL PATTO NEL BUIO!</b> {reward}<br>Hai sbloccato le carte <b>«Replica Zero»</b> e <b>«Corrado l'Antennista»</b> nella Squadra dei Sogni! Teodora ora passa anche al Borgo Marino, e nelle Carte del Destino c'è il mazzo «Il Dossier di Teodora»."]], openMain: true, bg: "rp_stadio" },
          ],
        },
      },
    ],
  });
})();
