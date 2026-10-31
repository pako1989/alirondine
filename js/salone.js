// js/salone.js - IL SALONE DELLE SAGHE, L'ALBUM DEI FINALI e IL GUARDAROBA
// Tre schermate a tutto schermo, disegnate in HTML sopra al gioco:
//  - SALONE: tutte le saghe a schede, con copertina (disegnata dagli sfondi della saga stessa), genere, avanzamento,
//    finali trovati, «nuova» e «continua l'ultima». Filtri per stato e per genere, scheda di dettaglio con «Gioca».
//  - ALBUM DEI FINALI: un timbro per ogni finale trovato (Storia principale e saghe con finali), indizi vaghi per quelli mancanti.
//  - GUARDAROBA: anteprima grande del Campione (nello stile dei volti scelto), tutti i capi e i colori per tipo e per provenienza,
//    «prova» e «indossa», ultimi sblocchi, e come si sblocca quello che manca.
//  - ALBUM DEI PERSONAGGI: una carta-figurina per ogni personaggio di tutto il gioco (storia, Borgo, ogni saga), con ritratto,
//    numero e descrizione. Chi non hai ancora incontrato è una sagoma nera. Finisci una saga e le sue carte diventano d'oro.
// Dati: solo lettura dai moduli delle saghe (info(), endings()) e da window.__borgoApi. Salvataggio proprio: ali-di-rondine.salone
// (solo «già visto» e «ultima saga aperta»).
(function () {
  "use strict";
  if (window.__salone) return;
  const KEY = "ali-di-rondine.salone";
  const api = () => window.__borgoApi;
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const rec = () => { const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "{}"), {}); return { v: 1, seen: r.seen && typeof r.seen === "object" ? r.seen : {}, last: typeof r.last === "string" ? r.last : "", favs: Array.isArray(r.favs) ? r.favs : [] }; };
  const recSave = (r) => safe(() => localStorage.setItem(KEY, JSON.stringify(r)));
  const hero = () => safe(() => window.heroLoad && window.heroLoad(), null);

  // ---------------------------------------------------------------- il catalogo delle saghe
  const GEN = { fantasy: ["Fantasy", "#7a4ab0"], mistero: ["Mistero", "#2c6a9a"], scifi: ["Fantascienza", "#1f8a8a"], storico: ["Storico", "#a8622a"], commedia: ["Commedia", "#c9921a"], sport: ["Sport anime", "#c0392b"], avventura: ["Avventura", "#3f8a3f"], dramma: ["Drammatico", "#6a5a7a"], tattica: ["Tattica", "#5a6a3a"], satira: ["Satira", "#0284c7"] };
  // mod: oggetto window con menuEntry/info · fn: funzione window da chiamare con (indietro) · ch: capitoli totali (se noti)
  const SAGAS = [
    { id: "falsari", t: "I Falsari della Coppa", e: "🏆", g: ["commedia", "mistero", "storico"], mod: "__falsari", key: "ali-di-rondine.falsari", ch: 4, cover: "fa_titolo", d: "Una coppa storica del 1934 all'asta, un vecchio orafo e lo stadio da salvare dalle ruspe della Morosini. Fabbrica la replica perfetta, bilancia la lega al millimetro e inganna la contessa prima del colpo di maglio. Quattro capitoli, quattro finali. Novità: Il Banco del Falsario & Forgia Artigianale. Minigioco: Il Banco del Falsario.",
      hints: {
        olmo: "Trova la pergamena demaniale del 1934 nel caveau e fai valere il vincolo pubblico.",
        montecarlo: "Completa lo scambio perfetto della coppa senza far scattare i sensori di peso.",
        rigore: "La bilancia oscilla fuori tolleranza ma la condanna si trasforma in cura dello stadio.",
        segreto: "Segreto: scopri che la coppa del 1934 era già un falso forgiato dagli operai per finanziare il club."
      } },
    { id: "moviola", t: "L'Ombra della Moviola · Tele-Rondine '84", e: "📼", g: ["mistero", "satira", "dramma"], mod: "__moviola", key: "ali-di-rondine.moviola", ch: 4, cover: "mov_titolo", d: "Novembre 1984: tra furgoni di regia nascosti nel torrente, ripetitori clandestini sul Campanile dei Corvi e banchi di montaggio U-matic, ricostruisci il fotogramma incriminato del rigore del 94° minuto. Quattro capitoli, quattro finali. Novità: il Banco Moviola U-matic (jog/shuttle e tracking). Minigioco: Moviola '84 (cabinato CRT).",
      hints: {
        scoop: "Manda in onda il nastro integrale al massimo degli ascolti per battere la concorrenza.",
        patto: "Accetta il compromesso economico del Commendatore per salvare Tele-Rondine.",
        giustizia: "Consegna il dossier completo alla magistratura proteggendo la famiglia di Banti.",
        segreto: "Segreto: trova il Nastro Zero del 1964 e proietta la verità storica totale al teatro."
      } },
    { id: "burattini", t: "La Giostra dei Burattini · Il Teatro di Legno e l'Arbitro di Paglia", e: "🎭", g: ["storico", "avventura", "commedia"], mod: "__burattini", key: "ali-di-rondine.burattini", ch: 4, cover: "bur_titolo", d: "La notte del Solstizio al Gran Teatro Ducale: impara l'arte del bilancino nella bottega di Maestro Taddeo, supera i mercanti alla Loggia e l'Arbitro di Paglia, e guida le marionette di pioppo fino al derby contro i burattini d'ebano della corte. Novità: il Calcio a Fili '74 (fisica del pendolo a trefoli, tiro A, colpo aereo B e contatore grovigli). Quattro capitoli, quattro finali.",
      hints: { popolare: "Consacra il teatro al popolo e rifiuta i privilegi ducali.", accademia: "Firma il patto dell'Accademia Ducale per guidare la scuola di corte.", carovana: "Parti con il carrozzone nomade di Gervaso verso le fiere del mondo.", segreto: "Segreto: raccogli tutti i manufatti, accumula almeno 25 di Arte e libera l'Anima di Pioppo." } },
    { id: "onde", t: "Radio Fuorigioco · Onde Corte sul Golfo", e: "📻", g: ["storico", "dramma", "commedia"], mod: "__onde", key: "ali-di-rondine.onde", ch: 4, cover: "rf_titolo", d: "Ottobre 1977: a dodici miglia dal Borgo, sul rimorchiatore arrugginito «Rondine Rossa», Nilde, Lupo e Tullio difendono i 99.9 MHz e lo Stadio del Molo Vecchio dalle ruspe del Consorzio Specchio e dai furgoni goniometrici. Quattro capitoli, quattro finali. Novità: il Sintonizzatore AM/FM (portanti e Cartoline QSL). Minigioco: Onde d'Urto (calcio 2D a tempo di vinile su 3 bande MHz).",
      hints: { cooperativa: "Smaschera l'appalto col Dossier e vinci la finale con equilibrio tra Segnale Libero e Verità.", pirati: "Vinci la finale spingendo al massimo il Segnale Libero o diffondendo la Bobina 000 dagli altoparlanti.", ciclostile: "Scegli la Prudenza, accetta lo sponsor del Consorzio o cedi nella sfida finale.", bobina1096: "Segreto: sintonizza tutte e 6 le Cartoline QSL, rifiuta lo sponsor di Specchio, porta a 4+ cuori Nilde e Valli, porgi le cuffie in privato nella Torretta e vinci la finale senza errori nell'ultimo giro di vinile." } },
    { id: "sigilli", t: "L'Accademia dei Sigilli · Esami di Magia del Pallone", e: "📜", g: ["fantasy", "avventura"], mod: "__sigilli", key: "ali-di-rondine.sigilli", ch: 3, cover: "sg_titolo", d: "Supera gli esami di ammissione dell'antica Accademia Arcana, svela le rune segrete celate nella Biblioteca Proibita e padroneggia i Quattro Sigilli nella notte della Grande Congiunzione. Il nuovo motore Traccia-Runa (parabole a spirale, saette a zig-zag e barriere magiche), i Frammenti di Pergamena del 1492 e 4 finali leggendari.",
      hints: { luce: "Serve consacrare la magia alla difesa comune del collegio e degli studenti.", tempesta: "Serve scegliere la potenza offensiva del tuono per vincere ogni torneo.", specchio: "Serve proporre a Valerian un patto paritario di rispetto e cooperazione.", arcano: "Segreto: trova tutti i frammenti di pergamena e sblocca il Quinto Sigillo del 1492." } },
    { id: "figurine", t: "Cacciatori di Figurine", e: "🃏", g: ["avventura", "fantasy", "commedia"], mod: "__figurine", key: "ali-di-rondine.figurine", ch: 4, cover: "fg_titolo", d: "Figure viventi da catturare, allenare e schierare. Avvicinale nel modo giusto (parlare, sfidare, esca o gioco), costruisci una squadra di tre con il triangolo dei tipi e arriva alla Lega. Novità: l'Album (cattura, squadra, evoluzioni, lotta a turni). Minigioco: Lotta di Figure.", hints: { custode: "Serve liberare le figure delle vetrine nel Capitolo 3 e vincere la finale.", album: "Serve completare l'Album con le dodici specie, anche evolute." } },
    { id: "gala", t: "Il Rapimento del Pallone d'Oro", e: "🏆", g: ["mistero", "commedia", "avventura"], mod: "__gala", key: "ali-di-rondine.gala", ch: 3, cover: "pd_titolo", d: "Gala alla villa del Presidente: il Pallone d'Oro sparisce al blackout, il ponte è crollato e nessuno può uscire. Otto sospettati, tutti con un segreto. Interroga, osserva chi c'è in ogni stanza e confronta dove dicevano di essere con dove erano davvero. Quattro finali. Novità: il Registro delle Presenze. Minigioco: Ping-Pong da Salone.", hints: { giustizia: "Con quattro contraddizioni e tre prove, accusa il Presidente.", capro: "Accusa Gualtiero: il colpevole comodo.", silenzio: "Fai confessare Livia e accetta il suo patto.", segreto: "Segreto: sei contraddizioni, tutte le prove, la confessione di Livia e Zeno battuto a ping-pong." } },
    { id: "cavaliere", t: "Il Cavaliere del Fischio", e: "🦇", g: ["mistero", "avventura", "dramma"], mod: "__cavaliere", key: "ali-di-rondine.cavaliere", ch: 4, cover: "cf_titolo", d: "Borgo Gotico sotto la pioggia: un ex portiere miliardario veste di notte un mantello e dà la caccia a chi trucca le partite. Il Pierrot Bianco ruba i palloni e lascia indovinelli. Rampino sui tetti, salti a rischio, guardie da evitare nell'ombra, interrogatori. Quattro capitoli, quattro finali. Novità: i Tetti. Minigioco: Interrogatorio.", hints: { giustizia: "Raccogli Libro Mastro, fischietto d'oro e cartella clinica, poi consegna tutto al Commissario.", pieta: "Ascolta il Pierrot fino alla fine e lascialo andare.", ombra: "Con Timore 40 o più, lascia cadere il Pierrot.", segreto: "Segreto: tutti e sei gli indovinelli e il Libro Mastro." } },
    { id: "mondiale", t: "Ali di Rondine · Mondiale Giovanile", e: "🌍", g: ["sport", "avventura", "commedia"], mod: "__mondiale", key: "ali-di-rondine.mondiale", ch: 4, cover: "mg_titolo", d: "La nazionale under-16 al Mondiale: raduno in Italia, samba a Rio, neve al Nord, finale a Tokyo. Recluta la squadra (due vie per ognuno), allenala e passa la palla. Quattro capitoli, quattro finali. Novità: la Catena (ruoli e sinergie). Minigioco: Catena d'attacco.", hints: { oro: "Vinci la finale.", argento: "Perdi la finale, a testa alta.", squadra: "Vinci la finale con Intesa 50 o più.", segreto: "Segreto: vinci la finale con Intesa 50 e almeno 3 catene perfette." } },
    { id: "corriere", t: "Il Corriere del Pallone", e: "🚲", g: ["avventura", "commedia", "mistero"], mod: "__corriere", key: "ali-di-rondine.corriere", ch: 4, cover: "cr_titolo", d: "Una città aperta in 3D: sei quartieri da girare in bici, giorno e notte, persone che ci sono solo a certi orari. Consegna i pacchi in tempo e scopri a chi spetta quello senza indirizzo. Novità: la Città 3D (orologio, orari dei personaggi, quartieri).", hints: {} },
    { id: "tifosi", t: "La Notte dei Tifosi Morti", e: "🧟", g: ["commedia", "dramma", "avventura"], mod: "__tifosi", key: "ali-di-rondine.tifosi", ch: 4, cover: "zt_titolo", d: "Novantesimo più tre del derby contro il Valtorta: un fumogeno verde sale dalla curva ospite e ventimila tifosi si rialzano senza fiato, ma ancora a tempo di coro. Tu, il numero dieci, con un gruppo di sopravvissuti, devi arrivare all'alba. Novità: L'Assedio a ondate (sopravvivenza: corri, il Campione calcia da solo, a ogni livello scegli un potere fra tre, i compagni con poteri propri, un capo per notte) e Il Bivio dei Poteri (poteri che si guadagnano tra i capitoli e restano per tutta la saga).", hints: {} },
    { id: "sasso", t: "Sette per Sasso Nero", e: "🏯", g: ["storico", "tattica", "dramma"], mod: "__sasso", key: "ali-di-rondine.sasso", ch: 5, cover: "sn_titolo", d: "Ogni raccolto i predoni di Corvo Rosso scendono dal passo e si prendono il riso di Sasso Nero. Tu, ronin col pallone da kemari, hai sei sacchi di riso per trovare sei compagni fra dieci candidati, ognuno col suo prezzo. Poi si prepara il villaggio e si regge l'ultima notte. Novità: L'Ultima Notte (difesa del villaggio a ondate: quattro porte, il granaio, i compagni alle porte) e Le Costruzioni (palizzate, fossati, trappole e torrette che restano tra i capitoli).", hints: {} },
    { id: "banda", t: "Banda di Piazza", e: "🥁", g: ["commedia", "dramma", "sport"], mod: "__banda", key: "ali-di-rondine.banda", ch: 5, cover: "bp_titolo", d: "La banda dello stadio di Borgo Marino sta per essere sostituita da un altoparlante. Tu, col ginocchio fasciato, finisci alla grancassa: un maestro geniale e crudele, una tromba muta dal funerale del figlio, Venezia e una marcia che nessuno sa finire. Novità: Ritmo (brani a tempo su quattro strumenti, sfilate col passo, duello contro la cassa) e il Repertorio. Ispirata a Whiplash e Coco.", hints: {} },
    { id: "neve", t: "Il Guardiano di Neve", e: "🧤", g: ["avventura", "dramma", "commedia"], mod: "__neve", key: "ali-di-rondine.neve", ch: 4, cover: "gn_titolo", d: "Val di Gelo, inverno. Dalla vetrina del bar sparisce il pallone del 1979 e il vecchio portiere Olmo ti presta i suoi guanti. Novità: livelli a scorrimento da portiere (parata che respinge, tuffo planato, ghiaccio) e il Termometro: il freddo cala, i fuochi scaldano.", hints: {} },
    { id: "latta", t: "Il Pallone di Latta", e: "🛡️", g: ["avventura", "commedia", "fantasy"], mod: "__latta", key: "ali-di-rondine.latta", ch: 4, cover: "lt_titolo", d: "La sera del Palio indossi per scherzo un'armatura del 1527: si chiude, parla a cigolii e ha un pallone di latta nel petto. Il castello si sveglia. Novità: livelli a scorrimento in pixel art (il pallone è arma e molla). Ispirata a Shovel Knight.", hints: {} },
    { id: "missione", t: "Missione Senza Ritorno", e: "🚀", g: ["avventura", "scifi", "dramma"], mod: "__missione", key: "ali-di-rondine.missione", ch: 4, cover: "ms_titolo", d: "Squadre di paese che spariscono la notte prima delle finali. Una nave nuova, un elenco di nomi: recluta i migliori, conquista la loro lealtà e attraversa il Passo d'Omega. Novità: Squadra in Pausa (scontri in tempo reale con la ruota dei poteri). Ispirata a Mass Effect 2.", hints: {} },
    { id: "compagnia", t: "La Compagnia del Pallone Spezzato", e: "⚔️", g: ["avventura", "tattica", "sport"], mod: "__compagnia", key: "ali-di-rondine.compagnia", ch: 4, cover: "cp_titolo", d: "Una compagnia di ventura che gioca a pallone per pagarsi il pane. Accampamento, borgo, locanda: recluta la squadra e guidala sulla griglia, turno per turno, tra passaggi, tackle e contropiedi. Novità: il Campo di Guerra (battaglie tattiche a griglia). Quattro capitoli, tre finali: il Guado, il Fortino, il convento di San Pallone e il Campo Grande.", hints: {} },
    { id: "diga", t: "La Diga di Valpiana", e: "🌊", g: ["avventura", "dramma", "sport"], mod: "__diga", key: "ali-di-rondine.diga", ch: 4, cover: "dg_titolo", d: "Un paese di montagna, una diga di quarant'anni e un lago che sale: gioca la Coppa della Piena per pagare la riparazione, prima che arrivi l'acqua. Ermete custodisce un registro, Zita un pallone sepolto, Gino una teoria sui sacchi. Novità: il livello dell'acqua, che sale con le ore e allaga davvero le mappe. Minigioco: Argine (Phaser).", hints: { diga: "Serve Argine 6, Fiducia 6 e vincere l'ultima prova dell'Argine.", scarichi: "Sempre possibile: apri gli scarichi verso i Prati.", sommerso: "Serve Memoria 2: lascia andare il vecchio paese.", campo: "Segreto: Memoria 5, Fiducia 5 e il Pallone di Zita." } },
    { id: "vuota", t: "Operazione Scatola Vuota", e: "📦", g: ["avventura", "mistero", "sport"], mod: "__vuota", key: "ali-di-rondine.vuota", ch: 4, cover: "vs_titolo", d: "Un'isola-fortezza, una squadra dimenticata e un Rapporto che nessuno deve leggere. Ottone, ex capitano con una scatola di cartone, ti insegna a non farti vedere: guardie con il cono di luce, ombre da usare, una scatola dove infilarti. Novità: l'Allerta (Calma, Sospetto, Allarme, Caccia) e il nascondiglio. Minigioco: Infiltrazione.", hints: { pubblico: "Serve Fiducia 5 o più e diffondere il Rapporto.", fuoco: "Serve bruciare il Rapporto.", scatola: "Serve Fiducia 7, Silenzio 6 e la Foto degli Aironi.", silenzio: "Succede se vieni scoperto all'ultima infiltrazione (Allerta massima)." } },
    { id: "circuiti", t: "Neo-Rondine 2099", e: "⚡", g: ["scifi", "sport", "avventura"], mod: "__circuiti", key: "ali-di-rondine.circuiti", ch: 4, cover: "nr_titolo", d: "Sotto la pioggia acida, la Vektor Corp possiede ogni luce e ogni risultato. Nei sotterranei vive una lega clandestina: la sfera conduttrice dei Circuiti d'Oro. Terminali da hackerare, droni che pattugliano i vicoli, piastre elettrificate, laser sui varchi e tre finali. Novità: i Terminali di Hacking. Minigioco: Circuito EMP.", hints: { libero: "Carica il virus di K1-RA nel server centrale.", corporativo: "Firma il contratto del Barone sulla consolle.", segreto: "Segreto: raccogli i sei Datapad nascosti e inserisci la sequenza antica." } },
    { id: "replica", t: "Eroi in Replica", e: "🦸", g: ["scifi", "dramma"], mod: "__replica", key: "ali-di-rondine.replica", ch: 4, cover: "rp_titolo", d: "Tuo padre è il più grande eroe della Terra. A diciannove anni arrivano i tuoi poteri, e con loro una verità: le «invasioni aliene» della Lega Celeste sono uno spettacolo. Ogni scelta lascia un Peso (Fiducia, Colpa, Rabbia) che decide come finisce. Novità: il Peso. Minigioco: Sparring Volante.", hints: { figlio: "Vinci il duello finale con più Fiducia che Rabbia.", cielo: "Vinci il duello finale con più Rabbia che Fiducia.", terza: "Segreto: Fiducia e Rabbia a 3 o più, tutte le contraddizioni del Dossier e vittoria finale." } },
    { id: "officina", t: "L'Officina dei Giganti di Ruggine", e: "⚙️", g: ["scifi", "sport", "avventura"], mod: "__officina", key: "ali-di-rondine.officina", ch: 4, cover: "of_titolo", d: "Una fonderia abbandonata, colossi a vapore e un torneo di calcio corazzato contro la Corporazione. Dosa la pressione della caldaia: poca ti ferma, troppa fa stallo. Novità: Pressione e Sfiato. Minigioco: Steam Strikers.", hints: { vapore: "Vinci la finale dopo aver rifiutato il Patto.", patto: "Vinci la finale dopo aver accettato il Patto.", nucleo: "Segreto: tre ingranaggi d'oro (nessuno stallo nei capitoli 1 e 2, Patto rifiutato) e vittoria in finale." } },
    { id: "rotta", t: "Rotta 66 · Il Gigante Stanco", e: "🚌", g: ["commedia", "avventura", "sport"], mod: "__rotta", key: "ali-di-rondine.rotta", ch: 3, cover: "ro_titolo", d: "Una squadra di Terza Categoria, un pullman del 1981 e duecento chilometri fino alla finale della Coppa dei Borghi. Benzina, umore e cassa: apri la Rotta, scegli ogni tappa e arriva a Valcampo. Novità: la Rotta (viaggio a tappe con risorse). Una sola partita, la finale.", hints: {} },
    { id: "fischietto", t: "Il Fischietto · Arbitro di Provincia", e: "🟨", g: ["mistero", "storico", "commedia"], mod: "__fischietto", key: "ali-di-rondine.fischietto", ch: 4, cover: "fi_titolo", d: "1998. Arbitro di provincia e giudice del Giurì: raccogli prove e testimonianze, confrontale nel Dossier, scopri le contraddizioni, emetti verdetti che cambiano chi sei. Poi fischia la finale. Novità: il Dossier (prove, confronti, verdetto). Nessuna partita da giocare.",
      hints: { argento: "Serve Integrità 7 o più senza aver tenuto la busta.", riscatto: "Serve aver preso la busta e averlo denunciato.", spento: "Serve aver preso la busta e aver taciuto." } },
    { id: "capitani", t: "Capitani di Ventura · La Rondine Scalza", e: "🏰", g: ["storico", "commedia", "avventura"], mod: "__capitani", key: "ali-di-rondine.capitani", ch: 4, cover: "cv_titolo", d: "1427. Le guerre si decidono con una partita di pallone di cuoio. Capitano di una compagnia di ventura senza paga, recluta i compagni nei borghi (ognuno con la sua storia), schiera la rosa, firma i contratti e difendi i ponti. Novità: la Compagnia (reclutamento e schieramento).",
      hints: {} },
    { id: "fortino", t: "Colpo al Fortino · La Notte del Trofeo Scomparso", e: "🏦", g: ["avventura", "mistero"], mod: "__fortino", key: "ali-di-rondine.fortino", ch: 3, cover: "fo_titolo", d: "Infiltrati nei sotterranei blindati dello Stadio Metropolitano durante la finale: disattiva i laser, aggira i fari di ronda e sventa il complotto del Trofeo Scomparso. Il nuovo motore Laser & Rimbalzo (prismi orientabili in ottone, barriere laser e nodi del caveau).",
      hints: { incastro: "Serve aver collaborato lealmente con Loris e Daria e consegnato il dossier alla giustizia.", popolo: "Serve decidere di lanciare il trofeo direttamente nella Curva Sud dei tifosi in festa.", notte: "Sempre possibile vincendo la finale: fuga solitaria sui tetti col deltaplano stealth.", segreto: "Segreto: tutti i 6 microchip raccolti e codice del fondatore 1912 inserito nel caveau." } },
    { id: "note", t: "Tactics Note · Il Quaderno del Giudizio", e: "📓", g: ["mistero", "tattica"], mod: "__note", key: "ali-di-rondine.note", ch: 3, cover: "qd_titolo", d: "Uno strano taccuino nero cade dagli spalti del Liceo Daikoku: 'Il calciatore il cui nome viene scritto su queste pagine subirà un fallo tattico o verrà neutralizzato entro 40 secondi'. Il duello intellettuale tra Raito Yagami ed Elle Lawliet sul destino del campionato studentesco. Il nuovo motore Tactics Note (lavagna di deduzione in tempo reale con contromosse a tempo), le Deduzioni Logiche e 4 finali per il destino del calcio.",
      hints: { giustizia_pura: "Serve collaborare con Elle e rifiutare i trucchi occulti.", nuovo_mondo: "Serve allearsi con Raito e usare il potere delle pagine nere in finale.", patto_demone: "Serve offrire tutte le mele rosse a Ryu durante l'intervallo.", calcio_puro: "Segreto: trova tutte le 12 Mele Rosse, mantieni l'intuito al massimo e brucia il quaderno." } },
    { id: "cenere", t: "Cenere e Gloria", e: "🏜️", g: ["dramma", "avventura"], mod: "__cenere", key: "ali-di-rondine.cenere", ch: 3, cover: "ce_titolo", d: "Dopo il Crollo, un pallone ritrovato in un bunker riaccende i villaggi di rottami. Razionare le borracce, attraversare le tempeste di sabbia e giocare al Campo di Rottami: lamiere mobili, vento e fionda a molla.",
      hints: { pace: "Serve guidare il pallone fino al Cratere e dividerlo tra i villaggi.", solitaria: "Serve lasciare i villaggi alle loro scelte e riprendere la strada.", reliquia: "Serve lasciare il pallone nella Torre del Predicatore.", segreto: "Segreto: legami e speranza almeno a 50 e almeno 3 borracce d'acqua rimaste, poi fidarsi di tutti fino in fondo." } },
    { id: "carte", t: "Carte del Destino · Cronache del Molo", e: "🎴", g: ["avventura", "commedia"], mod: "__carte", key: "ali-di-rondine.carte", ch: 1, cover: "ct_titolo", d: "Modalità a mini-storie: pesca 5 carte (luogo, personaggio, evento, prova, twist), vivi la storia che ne esce camminando per il molo, scegli come affrontarla e gioca una prova vera. Premi: monete e cosmetici. Si rigioca all'infinito.", hints: {} },
    { id: "quattordici", t: "Il Torneo dei Quattordici", e: "🎭", g: ["dramma", "mistero"], mod: "__quattordici", key: "ali-di-rondine.quattordici", ch: 3, cover: "qt_titolo", d: "Tre giorni in un albergo di lusso con quattordici squadre. Ogni giorno scegli come spendere mattina e sera, il pomeriggio si gioca a Zona Rossa (un 2 contro 2 su un campo che si restringe) e la notte qualcuno sparisce.",
      hints: { sipario: "Serve prendere il Premio per te.", rivolta: "Serve la chiave di Luce e smascherare il Banditore.", patto: "Serve prendere il posto del Banditore.", quattordici: "Segreto: alleanze e verità almeno a 35, la chiave di Luce, poi chiedere la libertà di tutti." } },
    { id: "spia", t: "Operazione Doppio Zero · Licenza di Cross", e: "🍸", g: ["mistero", "avventura"], mod: "__spia", key: "ali-di-rondine.spia", ch: 3, cover: "dz_titolo", d: "Nei panni dell'Agente 00 tra smoking di Montegol, inseguimenti in funivia sulle Alpi e il covo vulcanico del Barone von Kalt. Tavolo da Gioco & Tiri a Effetto: panno verde d'azzardo, difensori-fiches, raggi laser mobili e carambole sulle sponde dorate.",
      hints: { diplomatico: "Serve aver superato la Sala VIP e scelto la via della giustizia sportiva con il Ministero.", ombra: "Serve decidere di svanire nella notte di Montegol senza reclamare la gloria.", spettacolo: "Sempre possibile vincendo la finale: festeggia con una parata trionfale al Casinò Royale.", segreto: "Segreto: tutte le 6 microspie d'oro piazzate e sangue freddo al massimo per il Protocollo 00." } },
    { id: "fiume", t: "La Carovana del Fiume d'Argento", e: "⛵", g: ["avventura", "dramma"], mod: "__fiume", key: "ali-di-rondine.fiume", ch: 3, cover: "fa_titolo", d: "Naviga il Grande Fiume a bordo del Nautilus di Latta, recluta i maestri del timone e sfida la dogana a Corrente & Rinvio: pontili oscillanti, spinta vettoriale dell'acqua e rinvii a vortice.",
      hints: { mercantile: "Serve aver stretto accordi con i mercanti delle Chiuse nel Capitolo 2 e vinto la finale.", franca: "Serve aver proclamato il fiume libero per tutti i battellieri e alta intesa (>50).", sentinella: "Sempre possibile vincendo la finale: sigilla il patto di difesa congiunta con Malacarne.", segreto: "Segreto: tutte le bussole d'argento raccolte e idrologia fluviale altissima." } },
    { id: "treno", t: "L'Espresso delle Ombre · Intrigo sul Treno delle Nevi", e: "🚂", g: ["mistero", "storico"], mod: "__treno", key: "ali-di-rondine.treno", ch: 3, cover: "te_titolo", d: "Spie, carrozze in mogano e una valigetta scomparsa tra le Alpi innevate. Il Corridoio d'Acciaio: match a scorrimento, pendenza delle curve che devia il pallone e sponde sulle porte degli scompartimenti.",
      hints: { diplomazia: "Serve aver collaborato lealmente con Valenti e vinto la finale.", verita: "Serve aver perquisito il vagone letto e affrontato la Contessa nel Capitolo 2.", ombre: "Serve scegliere l'indipendenza tattica nel bivio del Capitolo 3.", maestro: "Segreto: tutti i 4 microfilm raccolti e clean sheet nella sfida finale." } },
    { id: "piramide", t: "La Piramide del Sole · Il Segreto dei Maya del Pallone", e: "☀️", g: ["avventura", "storico"], mod: "__piramide", key: "ali-di-rondine.piramide", ch: 3, cover: "my_titolo", d: "Yucatán, 1936: una spedizione archeologica, trappole a scatto e il sacro Pok-ta-pok, la palla di caucciù da infilare negli anelli di pietra." },
    { id: "alcatraz", t: "Fuga da Alcatraz FC · La Grande Evasione", e: "⛓️", g: ["avventura", "commedia"], mod: "__alcatraz", key: "ali-di-rondine.alcatraz", ch: 4, cover: "alc_titolo", d: "Sull'isola spazzata dai fari, il Campione scambiato per un galeotto guida la squadra dei detenuti. Calcio a Parete: sponde elastiche metalliche, tiri d'anticipo e riflettori delle guardie da evitare. Ora con il Capitolo Ponte con Operazione Scatola Vuota.",
      hints: { evasione: "Serve aver completato la galleria nel Capitolo 2 e vinto la finale.", patto: "Serve aver stretto l'accordo col Direttore e giocato leale.", barbiere: "Sempre possibile: vittoria e gestione della barberia clandestina.", scatola: "Nel capitolo ponte con Operazione Scatola Vuota: libera Dario insieme a Ottone e salpa sul barchino.", segreto: "Segreto: tutti i grimaldelli raccolti, allarme mai scattato al massimo e tunnel scoperto." } },
    { id: "alcatraz2", t: "Fuga da Alcatraz FC 2 · L'Ultimo Rientro", e: "🌊", g: ["avventura", "mistero"], mod: "__alcatraz2", key: "ali-di-rondine.alcatraz2", ch: 4, cover: "alc2_titolo", d: "Un messaggio in una bottiglia di nafta raggiunge il porto di Marsiglia: il penitenziario dei fari non ha ancora finito di raccontare la sua storia. Calcio a parete semisommerso, nuove paratie e la sfida definitiva al Consorzio Cerbero.",
      hints: { marsiglia: "Serve completare l'evacuazione sul motoscafo di Dario lasciando l'isola.", guardia: "Serve stringere l'alleanza tra detenuti ed ex guardie ripristinando l'onore di Tonelli.", porto_franco: "Serve sabotare le turbine industriali e proclamare il bastione autonomo.", segreto: "Segreto: allarme Cerbero sotto quota 35, tutti i grimaldelli di titanio e piena grazia presidenziale." } },
    { id: "milano", t: "Operazione Fuorigioco Noir · Milano 1954", e: "🕵️", g: ["mistero", "storico"], mod: "__milano", key: "ali-di-rondine.milano", ch: 3, cover: "mn_titolo", d: "Nebbia fitta sui Bastioni di Porta Ticinese, bische clandestine e il mistero delle partite truccate nell'autunno del 1954. Il nuovo motore Pedinamento Tattico (coni d'ombra dei riflettori, marcature serrate e ripartenze nel fango), il Taccuino dei Verbali della Questura e quattro finali nel fango dell'Arena Civica.",
      hints: { legge: "Serve aver consegnato tutte le prove al Commissario De Santis e vinto la finale.", riscatto: "Serve aver stretto il patto con Don Carmine e Mara per salvare la società dei ferrovieri.", solitario: "Sempre possibile, alla fine: allontanati sui binari nella nebbia fedele solo al pallone.", verita: "Segreto: tutti i 12 biglietti punzonati raccolti e verbali completi al 100% per il Cappello Borsalino Noir d'Oro." } },
    { id: "roma", t: "Ave Calcio! · I Gladiatori del Pallone", e: "🏛️", g: ["storico", "commedia"], mod: "__roma", key: "ali-di-rondine.roma", ch: 3, cover: "rm_titolo", d: "Sabbia dorata, senatori furbi e ludi circensi nell'Urbe del 75 d.C. Tu sei il Legionario dal Piede Alato, scambiato per errore con uno schiavo e gettato nell'arena. Il nuovo motore Circo Massimo (campo ovale con spina centrale, scatti a biga, muri di scudi e catapulte per superare l'obelisco), gli Editti Imperiali e quattro finali per la corona d'alloro.",
      hints: { plebe: "Serve aver difeso la Plebe di Spartaco e vinto la finale.", cesare: "Serve aver ottenuto il massimo favore di Cesare (>70) e accettato la toga d'onore.", sabbia: "Sempre possibile, alla fine: rifiuta la politica e resta il campione libero delle arene.", segreto: "Segreto: tutte le foglie d'alloro raccolte e trionfo assoluto nei ludi con la catapulta." } },
    { id: "regno", t: "Cronache del Regno Ultimo", e: "👑", g: ["fantasy", "storico"], mod: "__regno", key: "ali-di-rondine.regno", ch: 3, cover: "re_titolo", d: "Dopo la caduta dell'Impero dei Cento Troni resta un re di ottantadue anni, una principessa e tre Casate che si odiano con molta educazione. Per non farsi la guerra decidono tutto a pallone: il Duello di Corona, giocato senza stendardo da un Campione che non appartiene a nessuno. Il nuovo motore Duello di Corona (corri al portone, tira a tempo, leggi la difesa e, tra un tempo e l'altro, tratta con il Consiglio delle Casate per avere in prestito i loro poteri), il Libro delle Casate e quattro finali per la Corona.",
      hints: { regina: "Sempre possibile, dopo aver vinto il Duello.", consiglio: "Serve aver visto la Cripta e avere un po' di favore da tutte e tre le Casate.", ferro: "Serve un grande favore dei Lupi, o aver giurato fedeltà al Generale.", perpetuo: "Segreto: tre Casate alleate, tutte le pagine di cronaca, la verità sulla spia e la fiducia della Principessa." } },
    { id: "naufraghi", t: "Naufraghi del Pallone", e: "🏝️", g: ["mistero", "avventura"], mod: "__naufraghi", key: "ali-di-rondine.naufraghi", ch: 3, cover: "nf_titolo", d: "L'aereo dei Rondine cade su un'isola dove il giorno e la notte durano pochi minuti e la marea cambia la mappa: di giorno affiorano le secche, di notte si accendono le pietre luminose. Una capitana che non ammette di avere paura, un medico con un nome latino per tutto, un magazziniere con il registro, un ragazzo sparito con la telecamera e una voce alla radio che non dovrebbe esserci. Il nuovo motore Marea (il campo si allaga mentre si gioca: passa, tira e alza pedane prima che sparisca la tua metà) e il Giornale di Bordo.",
      hints: { rotta: "Serve la fiducia della squadra e aver vinto la finale.", custodi: "Serve essere diventati amici dell'isola e aver vinto la finale.", squadra: "Sempre possibile, se si pensa prima alla squadra che a se stessi.", zattera: "Sempre possibile, con una scelta decisa all'ultimo.", lunga: "Segreto: tutte le conchiglie dell'isola raccolte e un legame molto forte con la Voce." } },
    { id: "campana", t: "La Notte dei Cento Rintocchi · Il Furto della Campana d'Oro", e: "🔔", g: ["mistero", "commedia"], mod: "__campana", key: "ali-di-rondine.campana", ch: 3, cover: "cp_titolo", d: "Il borgo medievale di Rocca Campanaria perde la sua campana d'oro alla vigilia del Torneo delle Contrade. Don Crispino grida al sacrilegio, il Maresciallo Cacace indaga con alibi assurdi e i «Soliti Ignoti» del paese si passano la refurtiva. Il nuovo motore I Cento Rintocchi (tempismo del rintocco, furtività sul sagrato e rintoccometro), il Taccuino degli Alibi e i battacchi d'ottone.",
      hints: { banda: "Serve aver protetto i Soliti Ignoti nel Capitolo 2 e una grande fama tra i paesani.", legge: "Serve aver consegnato tutte le prove al Maresciallo Cacace e vinto la finale.", doncamillo: "Sempre possibile vincendo la finale e riconciliando Don Crispino col Sindaco.", cento: "Segreto: tutti i 12 battacchi d'ottone raccolti e rintoccometro mai al massimo in finale." } },
    { id: "galletta", t: "S.O.S. Galletta: I Bucanieri del Biscotto", e: "🏴‍☠️", g: ["commedia", "avventura"], mod: "__galletta", key: "ali-di-rondine.galletta", ch: 3, cover: "gl_titolo", d: "Arrembaggi sul ponte, pontili basculanti e la leggenda del Grande Forno tra i flutti dell'Oceano della Melassa. Arrembaggio sul Ponte: mini-calcio su un galeone in movimento che rolla e beccheggia, vento marino e rimbalzi burrosi. E il Ricettario Corsaro.",
      hints: { reale: "Serve aver stretto il patto diplomatico col Commodoro nel Capitolo 2 e vinto la finale.", bucaniere: "Serve aver issato la bandiera corsara e una grande reputazione piratesca (>50).", cuoco: "Sempre possibile, alla fine: apri la trattoria galleggiante sui sette mari.", segreto: "Segreto: tutti i biscotti d'oro raccolti e fiuto delle spezie altissimo." } },
    { id: "pugno", t: "Per un pugno di rigori", e: "🤠", g: ["storico", "avventura"], mod: "__pugno", key: "ali-di-rondine.pugno", ch: 3, cover: "pr_titolo", d: "Polvere, speroni e duelli dal dischetto a mezzogiorno nel villaggio di El Paso del Rigore. Stangata: duelli di rigori con tamburo revolver a sei colpi, barra di tensione e quick-draw al rintocco della campana. E i Manifesti Wanted con le taglie in dollari.",
      hints: { sceriffo: "Serve aver difeso la legge nel Capitolo 2 e vinto la finale.", desperado: "Serve aver stretto il patto con Ramon e una taglia sopra i 300 $.", solitario: "Sempre possibile, alla fine: cavalca da solo verso il tramonto.", segreto: "Segreto: tutti i ferri di cavallo raccolti e sangue freddo altissimo." } },
    { id: "montagna", t: "Piccolo Borgo di Montagna", e: "🏔️", g: ["commedia", "satira"], mod: "__montagna", key: "ali-di-rondine.montagna", ch: 3, cover: "bm_titolo", d: "Un paesino innevato dove gli adulti vivono di tradizioni stravaganti e venerano un misterioso Pallone di Cartone. Tu sei il centravanti sceso dalla corriera delle 8:00. Ritagli: marionette di carta stop-motion a 12 fps, caricamento a molla e contrasti a forbice. E la Bacheca delle Emergenze del Comune.",
      hints: { scaldabagno: "Serve aver trovato l'archivio del boiler nel Capitolo 2 e vinto la finale.", politica: "Serve aver sfiduciato il Sindaco e una grande fiducia del borgo.", cartone: "Sempre possibile, alla fine: alza la Coppa di cartone.", segreto: "Segreto: tutti i ritagli di cartone raccolti e l'amicizia piena di Boris." } },
    { id: "cavallo", t: "Il Cavallo Star", e: "🐴", g: ["commedia", "dramma"], mod: "__cavallo", key: "ali-di-rondine.cavallo", ch: 3, cover: "cs_titolo", d: "Baldo Criniera, cavallo e vecchia star della sitcom sul calcio «Zoccoli d'Oro», vuole tornare in onda. Tu sei la sua spalla. Ciak! Si Gioca: ogni partita si gira a scene, segui il copione o improvvisi. E dopo ogni scelta, il giornale.",
      hints: { diretta: "Serve aver vinto la finale in diretta.", serie: "Serve aver giocato la finale secondo il copione.", biografia: "Serve aver detto la verità alla stampa.", puntata: "Segreto: tutte le cassette, almeno quattro stelle del regista in finale, nessuna ripresa interrotta." } },
    { id: "dungeon", t: "Dungeon di Fine Stagione", e: "🔥", g: ["fantasy", "avventura"], mod: "__dungeon", key: "ali-di-rondine.dungeon", ch: 3, cover: "dg_titolo", d: "Sotto lo Stadio Vecchio si gioca il Torneo di Fine Stagione, e ogni partita è una stanza di un dungeon. Prima di ogni stanza scegli una porta, dopo ogni stanza un dono su tre che vale solo per la discesa. Se cadi, ricominci dall'ingresso ma ricordi tutto. Le Stanze dell'Ipogeo: la partita originale, vista dall'alto, tra trappole e mitici in porta.",
      hints: { ultimo: "Serve decidere di chiudere il torneo, alla fine.", brace: "Serve decidere di restare, alla fine.", minuto: "Serve aver costruito fiducia con chi scende da più tempo di te.", senzafischio: "Segreto: tutte le rune di brace e almeno tre cadute alle spalle." } },
    { id: "razzo", t: "Razzopacco · Consegne dal Futuro", e: "🚀", g: ["commedia", "scifi"], mod: "__razzo", key: "ali-di-rondine.razzo", ch: 3, cover: "rz_titolo", d: "Ti risvegli nel 3011 e fai il corriere spaziale per una ditta sgangherata. Tubi pneumatici sopra la città, consegne a tempo, la rotta fra un pianeta di minestra e una luna di uffici. Consegna a Rete: razzetti, pacchi e pianeti che curvano i lanci.",
      hints: { libera: "Serve aver vinto la Coppa.", fusione: "Serve aver ascoltato la storia di Orsola.", ritorno: "Serve aver tenuto il pacco misterioso sigillato.", pacco: "Segreto: tutti i francobolli, tutte le consegne in orario, nessuna partita lasciata a metà." } },
    { id: "gp", t: "Gran Premio del Pallone", e: "🏁", g: ["commedia", "sport"], mod: "__gp", key: "ali-di-rondine.gp", ch: 3, cover: "gp_titolo", d: "A Palladoro il campionato unisce le gare e le partite: ogni giro finisce in area con un tiro. Guidi per l'Officina Bullone, una macchinina che salta i fossi anche fuori pista, un telecronista che urla e un Commissario fatto di nuvola. Giro e Gol: strada in pseudo-3D, e la velocità con cui entri in area è la potenza del tuo tiro.",
      hints: { scacchi: "Sempre possibile: vinci la finale.", condivisa: "Serve il rispetto di Rosalba e la scelta di dividere la Coppa.", voce: "Serve aver trovato gli indizi e aver parlato in privato col telecronista.", officina: "Serve aver rifiutato lo sponsor e aver costruito lo spirito dell'Officina.", giro: "Segreto: il Giardino dei Trofei, tutti gli indizi, niente sponsor, Rosalba e l'Officina dalla tua parte, la Coppa divisa." } },
    { id: "tempo", t: "Rondine 1938-2038", e: "⏳", g: ["avventura", "scifi"], mod: "__tempo", key: "ali-di-rondine.tempo", ch: 3, cover: "rt_titolo", d: "La sera prima del centenario dello Stadio delle Rondini, un sistema chiamato VAR Totale comincia ad annullare i gol del passato. Un pullman che va a trentotto all'ora ti porta nel 1938 in bianco e nero, nel 1978 degli anni '70 e nel 2038 al neon. La Palla del Tempo: una partita sola, giocata in tre epoche, dove ciò che fai nel passato cambia il campo del futuro.",
      hints: { gol: "Sempre possibile, alla fine: il gol resta.", cambia: "Serve aver piantato il seme e aver spento l'Occhio nel Capitolo 2.", centro: "Serve aver capito Vera, un po' alla volta.", forestiero: "Serve aver detto a Dorino chi sei.", rondine: "Segreto: tutte le tracce, la foto, il seme, il fischietto, la fascia e la fiducia del Club." } },
    { id: "quartiere", t: "Gli Straordinari di Quartiere", e: "🦸", g: ["commedia", "avventura"], mod: "__quartiere", key: "ali-di-rondine.quartiere", ch: 3, cover: "sq_titolo", d: "Cinque supereroi di serie B (una gelataia, un trombettista, un idraulico, una nonna calamita, un pizzaiolo) e tu, che copi i poteri degli altri. Combo di Squadra (i poteri si combinano e si scoprono giocando), il Copione che apre strade diverse nel quartiere, il Dottor Cemento e il suo parcheggio.",
      hints: { quartiere: "Serve aver giocato a faccia scoperta.", maschere: "Serve aver tenuto le maschere.", cemento: "Serve aver ascoltato la storia del Dottor Cemento.", fumetto: "Segreto: tutti i fumetti perduti, almeno dieci combo scoperte, nessuna partita lasciata a metà." } },
    { id: "titano", t: "Il Figlio del Titano", e: "🌠", g: ["scifi", "dramma"], mod: "__titano", key: "ali-di-rondine.titano", ch: 3, cover: "ft_titolo", d: "Scopri di avere i poteri di tuo padre, il Titano venuto da Elyon. Poi scopri perché è venuto sulla Terra. Volo a Tutto Campo (disegni col dito la traiettoria, gli avversari ti tagliano la strada), le scelte a tempo nei dialoghi, gli sfondi da animazione americana.",
      hints: { padre: "Serve che tuo padre abbia scelto di giocare con te.", agenzia: "Sempre possibile, alla fine.", stelle: "Serve la fiducia di Vega.", titani: "Segreto: tutti gli anelli di nuvola, tuo padre e Vega dalla tua parte, nessuna partita lasciata a metà." } },
    { id: "ducati", t: "La Guerra dei Tre Ducati", e: "⚖️", g: ["tattica", "storico"], mod: "__ducati", key: "ali-di-rondine.ducati", ch: 3, cover: "td_titolo", d: "Tre ducati su un altopiano di sale, una coppa che decide a chi vanno le saline. Il Calcio Tattico Isometrico (terrazze, iniziativa, contrasti alle spalle), la Bilancia delle Convinzioni dove i compagni votano e tu li convinci con gli argomenti trovati esplorando, il diorama.",
      hints: { corona: "Serve che nei voti abbia vinto più spesso la Morale.", patto: "Serve che nei voti abbia vinto più spesso l'Utile.", saline: "Serve che nei voti abbia vinto più spesso la Libertà.", pari: "Segreto: tre voti finiti in tre modi diversi, tutti i sigilli di sale e almeno tre compagni convinti." } },
    { id: "grigio", t: "Il Cavaliere della Notte", e: "🌃", g: ["mistero", "avventura"], mod: "__grigio", key: "ali-di-rondine.grigio", ch: 3, cover: "gr_titolo", d: "Porto Scuro, la pioggia, una lega truccata. Di giorno giochi nel Porto Scuro Calcio, di notte indossi il mantello dell'Airone: il furtivo con le guardie e i coni di vista, l'officina dei gadget, la partita a turni Ombre e Gadget, i tetti col rampino.",
      hints: { luce: "Serve aver dato una prova alla commissaria e vinto la finale.", ombra: "Serve aver tenuto una prova per te, o deciso di trasmetterla dal faro.", vela: "Serve l'alleanza con Vela Nera e la sua piena fiducia.", airone: "Segreto: tutte le piume d'airone, Gancio dalla tua parte e una domanda sulla foto dell'officina." } },
    { id: "colline", t: "Master League delle Colline", e: "📋", g: ["sport", "tattica"], mod: "__colline", key: "ali-di-rondine.colline", ch: 3, cover: "ml_titolo", d: "L'U.S. Colle Alto è ultima in classifica: tu sei il nuovo allenatore. La Lavagna Tattica (modulo, caselle, istruzioni che si battono a vicenda, cambi e pagelle), il Mercato con le figurine e i crediti, gli allenamenti, la classifica della Lega delle Colline.",
      hints: { promozione: "Sempre possibile, alla fine.", paese: "Serve vincere senza comprare quasi nessuno, con il paese dalla tua parte.", mago: "Serve una grande fiducia della presidente e aver ascoltato il Mago Pino.", triplete: "Segreto: battere tutte le squadre della Lega e trovare tutte le figurine rare." } },
    { id: "campetto", t: "Dal Campetto al Mondiale", e: "🏆", g: ["sport", "avventura"], mod: "__campetto", key: "ali-di-rondine.campetto", ch: 3, cover: "cm_titolo", d: "Un campetto di terra dietro la pescheria, un ex nazionale che ripara reti, un portiere mai battuto e un sogno grande come un Mondiale. Il Duello Cinematico: la partita a vignette manga, con la grinta e i tiri speciali da imparare in allenamento.",
      hints: { mondiale: "Sempre possibile, alla fine.", leone: "Serve aver chiamato Leone in Nazionale.", campetto: "Serve una grande amicizia con la squadra del campetto.", amico: "Segreto: tutti i tiri speciali, tutti i palloni firmati e nessuna partita lasciata a metà." } },
    { id: "trono", t: "Il Trono di Cuoio", e: "👑", g: ["fantasy", "dramma"], mod: "__trono", key: "ali-di-rondine.trono", ch: 3, cover: "tc_titolo", d: "Sette casate, un trono cucito con il primo pallone della storia. Sei il figlio senza nome di Casa Tasso: patti di cera, voti del Consiglio, corvi e tradimenti, e il Concilio, una partita in cui i patti valgono finché qualcuno non li rompe.",
      hints: { trono: "Sempre possibile, alla fine.", barriera: "Serve aver ascoltato davvero Casa Gelaneve.", repubblica: "Serve una credibilità altissima al Consiglio (7).", nessuno: "Segreto: non tradire mai un patto (né un segreto) e trovare tutti i sigilli di cera." } },
    { id: "mondi", t: "Il Torneo dei Mondi", e: "🌒", g: ["fantasy", "avventura"], mod: "__mondi", key: "ali-di-rondine.mondi", ch: 3, cover: "tm_titolo", d: "L'incontro tra le saghe: un'eclissi apre tredici porte, e i campioni di tutte le saghe che hai finito ti sfidano nel loro modo di giocare. Squadra mista con compagni di mondi diversi e finale a staffetta tra motori.",
      hints: { ritorno: "Sempre possibile, alla fine.", ponte: "Serve il sigillo di ogni porta che hai aperto (almeno cinque).", squadra: "Serve una squadra di tre compagni da tre mondi diversi.", tutti: "Segreto: tutte le tredici saghe finite e tutti i tredici sigilli." } },
    { id: "lampioni", t: "La Notte dei Lampioni", e: "🏮", g: ["fantasy", "dramma"], mod: "__lampioni", key: "ali-di-rondine.lampioni", ch: 3, cover: "nl_titolo", d: "Un paese di collina al buio, la notte della festa: dodici lampioni da accendere con la lanterna della nonna, le Ombre gentili dei giocatori di un tempo, e Luci, una partita a turni giocata al buio con le lanterne.",
      hints: { alba: "Sempre possibile, alla fine.", fiammetta: "Serve tanta luce nel paese.", ombre: "Serve la piena fiducia delle Ombre.", tredicesimo: "Segreto: tutti i fiammiferi antichi e tutti i lampioni accesi." } },
    { id: "stagione", t: "Stagione Infinita", e: "📼", g: ["dramma", "mistero"], mod: "__stagione", key: "ali-di-rondine.stagione", ch: 3, cover: "sf_titolo", d: "La stessa domenica, ancora e ancora: la finale al vecchio Lido che domani chiude. Giornata che si ripete con gli orari dei personaggi, ricordi che restano, e Il Nastro: la finale su videocassetta, con i fantasmi delle partite già giocate.",
      hints: { lunedi: "Sempre possibile, alla fine.", teo: "Serve l'amicizia piena di Teo.", ada: "Serve la fiducia piena di Ada.", gatto: "Segreto: trova il gatto in tutti e quattro i suoi posti, una domenica diversa ciascuno." } },
    { id: "mantello", t: "Il Mantello Granata", e: "🦸", g: ["commedia", "avventura"], mod: "__mantello", key: "ali-di-rondine.mantello", ch: 3, cover: "mg_titolo", d: "Un fumetto di supereroi comico: un mantello cucito da una sarta, tre forme in esplorazione (Volo, Mini, Gigante), cattivi ridicoli e Super-Bottoni, il calcio a bottoni a turni con la fionda e un superpotere diverso a ogni partita.",
      hints: { eroe: "Sempre possibile, alla fine.", lega: "Serve aver svelato la tua identità.", arbitro: "Serve tanta fama in città.", tilde: "Segreto: tutti i ritagli di stoffa della città e l'identità segreta custodita bene." } },
    { id: "cronache", t: "Le Cronache del Pallone di Cristallo", e: "💠", g: ["fantasy", "avventura"], mod: "__cronache", key: "ali-di-rondine.cronache", ch: 3, cover: "cc_titolo", d: "Un JRPG classico: quattro cristalli che tengono in moto le stagioni, un gruppo che ti segue in fila, la mappa del mondo, la nave, e partite a turni come battaglie (ATB) con fiato e magie.",
      hints: { stagioni: "Sempre possibile, alla fine.", cavaliera: "Serve un gruppo unitissimo.", silenzio: "Serve la luce piena nel cuore.", quinto: "Segreto: tutte le schegge del mondo e il gruppo unito fino in fondo." } },
    { id: "torneo", t: "Il Torneo delle Cento Scuole", e: "🏆", g: ["sport", "commedia"], mod: "__torneo", key: "ali-di-rondine.torneo", ch: 3, cover: "ts_porto", d: "Il panettiere, la postina, i gemelli bagnini e una vecchia maestra contro le scuole calcio della Riviera. Partite a fumetti (Vignette) con tecniche di squadra, una città viva e il Tabellone che cambia con le tue scelte.",
      hints: { festa: "Sempre possibile, alla fine.", amicizia: "Serve il pieno rispetto di Ettore Vela.", maestra: "Serve uno spirito di squadra fortissimo.", tutte: "Segreto: tutte le tecniche usate in finale e tutte le lettere di Alba consegnate." } },
    { id: "spazio", t: "Calcio Spaziale: Stazione Orbitale 7", e: "🚀", g: ["commedia", "scifi"], mod: "__spazio", key: "ali-di-rondine.spazio", ch: 3, cover: "so_stazione", d: "La stazione più noiosa della galassia organizza un torneo e scambia il Campione per «l'esperto di calcio vero». Gravità che cambia in ogni modulo, un robot arbitro che fischia fuorigioco alle porte, partite a gravità zero.",
      hints: { casa: "Sempre possibile, alla fine.", capitano: "Serve uno spirito di squadra fortissimo.", nonna: "Serve la piena fiducia di ARBI-9.", fuorigioco: "Segreto: tutte le cartoline dalla Terra e la fiducia piena di ARBI-9." } },
    { id: "dopo", t: "Dopo il Campione", e: "🕰️", g: ["dramma", "fantasy"], mod: "__dopo", key: "ali-di-rondine.dopo", ch: 3, cover: "ep_campo", d: "Il Capitano è morto. Ada, la sua portiera che non invecchia, ripercorre i luoghi delle loro vittorie. Echi del passato e partite rigiocate con la grafica della loro epoca.",
      hints: { ricordo: "Sempre possibile, alla fine.", squadra: "Serve un legame forte con Nino e Lia.", addio: "Serve la piena fiducia di Ada e tutti i ricordi del Capitano.", lettera: "Segreto: tutti gli echi di tutte le epoche e la fiducia piena di Ada." } },
    { id: "detective", t: "Detective di Campo", e: "🕵️", g: ["mistero", "dramma"], mod: "__detective", key: "ali-di-rondine.detective", ch: 3, cover: "dc_citta", d: "Partite truccate nella Lega delle Città. Infortunato, il Campione fa l'assistente di un'ispettrice eccentrica: prove, interrogatori e la Moviola.",
      hints: { chiuso: "Sempre possibile, alla fine.", pulita: "Servono tutte le prove e la piena fiducia di Agata.", vendetta: "Lascia che sia Agata a decidere, quando è più arrabbiata.", campo: "Segreto: tanto fiuto, nessuna accusa sbagliata e tutte le moviole risolte." } },
    { id: "vento", t: "La Valle del Vento Gentile", e: "🍃", g: ["avventura", "dramma"], mod: "__vento", key: "ali-di-rondine.vento", ch: 3, cover: "ve_valle", d: "Un villaggio di mulini, gli spiriti del prato e un vento che sta smettendo di soffiare. Case in cui si entra, folate che spingono e la partita Col Vento.",
      hints: { vento: "Sempre possibile, alla fine.", turbine: "Serve un patto forte con la Compagnia delle Turbine.", custode: "Resta, quando la valle te lo chiede.", soffio: "Segreto: tutti i Soffi, la piena fiducia di Selva e il Quaderno quasi completo." } },
    { id: "muro", t: "Il Muro", e: "🧱", g: ["dramma", "mistero"], mod: "__muro", key: "ali-di-rondine.muro", ch: 3, cover: "mu_muro", d: "L'ultima città, chiusa da un muro altissimo. Fuori, i Colossi di pietra. Ricognizioni furtive, la Partita sul Muro e un segreto vecchio di duecento anni.",
      hints: { aperto: "Sempre possibile, alla fine.", chiuso: "Serve il favore del Consiglio.", via: "Serve un legame forte con i Fuorimura.", tribuna: "Segreto: fiducia di Nives, Taccuino quasi completo, Colossi disegnati." } },
    { id: "cristalli", t: "Cristalli del Campo", e: "💎", g: ["fantasy", "avventura"], mod: "__cristalli", key: "ali-di-rondine.cristalli", ch: 3, cover: "cr_borgo", d: "Un JRPG a 16 bit: mestieri, aeronave in Mode 7, Battaglie ATB e quattro Cristalli che tengono in volo il regno.",
      hints: { luce: "Sempre possibile, alla fine.", terra: "Serve l'amicizia di Ferrogrigio.", corona: "Serve tanta sete di potere.", campo: "Segreto: la piena fiducia di Aira e il Diario quasi completo." } },
    { id: "doppio", t: "Doppio Turno", e: "🪞", g: ["mistero", "dramma"], mod: "__doppioTurno", key: "ali-di-rondine.doppio-turno", ch: 3, cover: "dt_atrio", d: "Due metà dello stesso Campione: il Dentro non ricorda il Fuori, e viceversa. Si parlano solo con i biglietti nell'Armadietto 7.",
      hints: { unito: "Le due metà devono fidarsi l'una dell'altra.", diviso: "A volte è meglio restare in due.", dentro: "Ascolta la Voce fino in fondo.", porto: "Segreto: il vecchio stadio del porto." } },
    { id: "libro", t: "Il Libro che Mangiava i Finali", e: "📖", g: ["fantasy", "commedia"], mod: "__libroFinali", key: "ali-di-rondine.libro-finali", ch: 4, cover: "lb_copertina", d: "Una fiaba meta-narrativa: entri in un libro che si sta mangiando i finali. Parole, inchiostro e la Partita Scritta.",
      hints: { fine: "Rimetti al loro posto tutti i finali.", fine_storta: "Chiudi il libro anche se qualcosa resta storto.", aperto: "Forse il libro non vuole finire…", narratore: "Prendi il posto di chi racconta.", penna: "Segreto: lettere e note a margine contano." } },
    { id: "abisso", t: "Abisso di Dunwich", e: "⚓", g: ["mistero"], mod: "__abissoStory", key: "ali-di-rondine.abisso-story", ch: 3, cover: "abi_molo", d: "Una saga oceanica cupa: un patto con le onde nere, un villaggio di pescatori e cose che non dovrebbero nuotare." },
    { id: "ragnarok", t: "Ragnarok Ball", e: "🔥", g: ["fantasy", "avventura"], mod: "__ragnarokStory", key: "ali-di-rondine.ragnarok", ch: 4, cover: "rag_fiordo", d: "Saga norrena tra ghiaccio e fiamme: fiordi, sale di guerrieri e il fuoco di Fimbulwinter." },
    { id: "belovodia", t: "Belovodia", e: "🌲", g: ["fantasy", "mistero"], mod: "__belovodiaStory", key: "ali-di-rondine.belovodia-story", ch: 4, cover: "bv_villaggio", d: "Il Bosco delle Maschere: una saga slava tra villaggi, laghi e spiriti." },
    { id: "bilancia", t: "La Bilancia delle Tre Corone", e: "⚖️", g: ["storico", "tattica"], mod: "__bilanciaFeudi", key: "ali-di-rondine.bilancia-feudi", ch: 4, cover: "feudi_consiglio", d: "Una saga feudale tattica: tre convinzioni da bilanciare, consigli di guerra e voti che pesano." },
    { id: "ombre", t: "Il Circuito delle Ombre", e: "🌃", g: ["mistero"], mod: "__campioneOmbre", key: "ali-di-rondine.campione-ombre", ch: 4, cover: "omb_darsena_notte", d: "Saga noir notturna: darsene, gabbie, cunicoli e un campionato che si gioca dove la legge non arriva." },
    { id: "shogun", t: "Shogun Eclipse", e: "⚔️", g: ["storico", "fantasy"], mod: "__shogunStory", key: "ali-di-rondine.shogun-story", ch: 4, cover: "sh_tempio", d: "Il Regno delle Sette Lame: templi, dojo e un'eclissi che cambia le regole." },
    { id: "phantom", t: "Phantom Genesis", e: "🎭", g: ["scifi", "mistero"], mod: "__phantomGenesis", key: "ali-di-rondine.phantom-genesis", cover: "pg_bassifondi", d: "Il Reattore delle Maschere: bassifondi, reattori e maschere che danno poteri." },
    { id: "pirati", t: "I Pirati della Tempesta Celeste", e: "🏴‍☠️", g: ["avventura", "fantasy"], mod: "__piratiStory", key: "ali-di-rondine.pirati-story", ch: 4, cover: "pi_porto_celeste", d: "Corsari del cielo, porti sospesi e arene sulle nuvole." },
    { id: "alchimia", t: "L'Alchimia d'Acciaio", e: "⚗️", g: ["fantasy", "dramma"], mod: "__alchimiaStory", key: "ali-di-rondine.alchimia-story", ch: 4, cover: "al_distretto", d: "Il Cerchio Proibito: laboratori, distretti di ferro e il prezzo di ogni trasmutazione." },
    { id: "kronenburg", t: "Kronenburg", e: "👑", g: ["storico", "mistero"], mod: "__kronenburgStory", key: "ali-di-rondine.kronenburg-story", ch: 4, cover: "kb_corte", d: "Il Patto delle Tre Corone: intrighi di corte, biblioteche e sotterranei." },
    { id: "chrono", t: "Chrono-Break", e: "⏳", g: ["scifi", "avventura"], mod: "__chronoStory", key: "ali-di-rondine.chrono-story", cover: "chr_alba", d: "Il Tempio dei Tre Tempi: alba, mezzogiorno e crepuscolo, e un portale tra le epoche." },
    { id: "vallombra", t: "Vallombra", e: "⛰️", g: ["avventura", "dramma"], mod: "__storiaCampione", key: "ali-di-rondine.storia-campione", ch: 8, cover: "vl_paese", d: "La Storia del Campione: un paese di montagna, una miniera e otto capitoli di vita.",
      hints: { fischio: "Servono prove consegnate, Fosco tornato su e Cornelio che parla.", resta: "Sempre possibile, alla fine: chi tiene accesa una luce.", squadra: "Sempre possibile, alla fine: scegli i vivi.", vendita: "Serve un patto con la Società, o una partita lasciata andare.", minuto: "Segreto: tutte le Lanterne, nessuna bugia e un fischio inatteso." } },
    { id: "noir", t: "Noir · Il Peschereccio Fantasma", e: "🕵️", g: ["mistero"], fn: "openNoirStoryMenu", key: "ali-di-rondine.noir-progress", cover: "night", d: "Saga investigativa con Lina nel golfo." },
    { id: "multiverso", t: "Multiverso · La Panda Quantistica", e: "🌌", g: ["commedia", "scifi"], fn: "openMultiverseMenu", key: "ali-di-rondine.multiverse-progress", cover: "night", d: "Saga demenziale con Nonna, tra universi paralleli." },
    { id: "faro", t: "La Notte del Faro", e: "⛵", g: ["dramma"], fn: "openFaroStoryMenu", key: "ali-di-rondine.notte-faro", cover: "night", d: "Il torneo notturno sulla scogliera di Punta Rondine." },
    { id: "traversata", t: "La Traversata d'Oro", e: "👑", g: ["avventura"], fn: "openTraversataMenu", key: "ali-di-rondine.traversata-oro", cover: "porto", d: "I Corsari del Tigullio e la Lanterna d'Oro." },
    { id: "westeros", t: "I Cinque Trabucchi", e: "🏰", g: ["storico", "tattica"], fn: "openThronesWarMenu", key: "ali-di-rondine.thrones-v3", cover: "stadium", d: "Mappa tattica a feudi, risorse e un inverno che arriva." },
    { id: "futurama", t: "Champions 3000", e: "🛸", g: ["scifi", "commedia"], fn: "openFuturamaLeagueMenu", key: "ali-di-rondine.futurama-v3", cover: "night", d: "Lega galattica: quattro pianeti a gravità variabile." },
    { id: "cittadella", t: "La Cittadella", e: "🧪", g: ["scifi", "commedia"], fn: "openCitadelStoryMenu", key: "ali-di-rondine.citadel-v3", cover: "night", d: "Squad builder con cinque varianti di Leo e un portale." },
    { id: "bluelock", t: "La Gabbia dell'Ego", e: "🔥", g: ["sport"], fn: "openBlueLockMode", key: "ali-di-rondine.bluelock-v2", cover: "locker", d: "Torneo dei Predatori: ego contro altruismo." },
    { id: "tsubasa", t: "Il Tiro Combinato", e: "⚡", g: ["sport"], fn: "openTsubasaMenu", key: "ali-di-rondine.tsubasa-v3", cover: "stadium", d: "Tiri a effetto, parate dal palo e un torneo da campioni." },
    { id: "jojo", t: "Stand Soccer Battle", e: "★", g: ["sport", "commedia"], mod: "__jojoSalone", ch: 5, fn: "openJoJoAdventure", key: "ali-di-rondine.jojo-stand-v1", cover: "stadium", d: "Le bizzarre avventure di Rondine." },
    { id: "emblem", t: "Rondine Emblem", e: "🛡️", g: ["tattica"], fn: "openTacticalEmblemMode", cover: "stadium", d: "RPG tattico a griglia: dieci capitoli con storia e ritratti." },
    { id: "leggenda", t: "La Leggenda del Tuo Campione", e: "⭐", g: ["avventura"], mod: "__heroStory", ch: 4, fn: "openHeroStoryMenu", key: "ali-di-rondine.hero-story", cover: "stadium", d: "La saga esclusiva del tuo Campione." },
    { id: "cala", t: "Cala Tramontana", e: "🌊", g: ["avventura"], fn: "openCalaTramontana", key: "ali-di-rondine.cala-tramontana", cover: "beach", d: "Esplora a piedi il borgo marino alternativo con il tuo Campione." },
    { id: "borgostorto", t: "Il Borgo Storto", e: "🌀", g: ["commedia", "tattica"], api: "openBorgoStorto", cover: "beach", d: "Lo spin-off GDR a turni del Borgo Marino." },
  ];
  const NEWEST = ["burattini", "tifosi", "falsari", "moviola", "sasso", "banda", "neve", "onde", "latta", "missione", "corriere", "compagnia", "diga", "vuota", "mondiale", "cavaliere", "gala", "circuiti", "replica", "officina", "figurine", "rotta", "fischietto", "capitani", "carte", "quattordici", "sigilli", "fortino", "cenere", "note", "spia", "fiume", "piramide", "treno", "alcatraz", "milano", "gp", "tempo", "dungeon", "roma", "regno", "naufraghi", "campana", "galletta", "pugno", "montagna", "cavallo", "razzo", "quartiere", "titano", "ducati", "grigio", "colline", "campetto", "trono", "mondi", "lampioni", "stagione", "mantello", "cronache", "torneo", "spazio", "dopo", "detective", "vento", "muro", "cristalli", "doppio", "libro"];
  const modOf = (s) => (s.mod ? window[s.mod] : null);
  const available = (s) => (s.mod ? !!window[s.mod] : s.fn ? typeof window[s.fn] === "function" : !!(api() && api()[s.api]));
  function state(s) {
    const m = modOf(s), inf = m && m.info ? safe(() => m.info(), null) : null, ends = m && m.endings ? safe(() => m.endings(), []) : [];
    const doneN = inf && inf.done ? Object.keys(inf.done).length : 0, started = !!(s.key && safe(() => localStorage.getItem(s.key), null)) || doneN > 0 || (inf && inf.ch > 1);
    const finished = !!(s.ch && doneN >= s.ch);
    const pct = s.ch ? Math.round((Math.min(doneN, s.ch) / s.ch) * 100) : finished ? 100 : started ? null : 0;
    return { inf, ends, endsFound: ends.filter((e) => e.found).length, doneN, started, finished, pct, ch: inf && inf.ch ? inf.ch : 1 };
  }
  function play(s, back) {
    const r = rec(); r.last = s.id; r.seen[s.id] = 1; recSave(r); close();
    const m = modOf(s);
    if (m && m.menuEntry) return m.menuEntry(back).fn();
    if (s.fn && window[s.fn]) return window[s.fn](back);
    if (s.api && api()[s.api]) return api()[s.api](back);
  }

  // ---------------------------------------------------------------- copertine: lo sfondo della saga, con tinta del genere
  const COVER = {};
  function cover(s) {
    if (COVER[s.id]) return COVER[s.id];
    const c = document.createElement("canvas"); c.width = 320; c.height = 200; const g = c.getContext("2d"), col = GEN[s.g[0]][1];
    let ok = false; try { ok = typeof window.renderDetailedBg === "function" && window.renderDetailedBg(s.cover, g, 320, 200, 140) === true; } catch (e) { ok = false; }
    if (!ok) { const gr = g.createLinearGradient(0, 0, 320, 200); gr.addColorStop(0, col); gr.addColorStop(1, "#0b1026"); g.fillStyle = gr; g.fillRect(0, 0, 320, 200); }
    // tinta del genere e velo in basso per il titolo
    g.globalCompositeOperation = "soft-light"; g.fillStyle = col; g.globalAlpha = 0.55; g.fillRect(0, 0, 320, 200); g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    const v = g.createLinearGradient(0, 90, 0, 200); v.addColorStop(0, "rgba(6,8,20,0)"); v.addColorStop(1, "rgba(6,8,20,.85)"); g.fillStyle = v; g.fillRect(0, 90, 320, 110);
    if (!ok) { g.font = "84px serif"; g.textAlign = "center"; g.globalAlpha = 0.9; g.fillText(s.e, 160, 120); g.globalAlpha = 1; g.textAlign = "left"; }
    COVER[s.id] = c.toDataURL("image/jpeg", 0.82); return COVER[s.id];
  }

  // ---------------------------------------------------------------- stile
  function css() {
    if (document.getElementById("salStyle")) return;
    const st = document.createElement("style"); st.id = "salStyle";
    st.textContent = `.salOv{position:fixed;inset:0;z-index:320;background:radial-gradient(ellipse at top,#1d2a55 0%,#0b1026 60%);color:#f2ead8;overflow:auto;-webkit-overflow-scrolling:touch;font-family:"M PLUS Rounded 1c",system-ui,sans-serif}
.salOv .wrap{max-width:720px;margin:0 auto;padding:12px 16px 40px}
.salOv .bar{display:flex;align-items:center;gap:10px;position:sticky;top:0;z-index:2;background:linear-gradient(#0b1026 70%,rgba(11,16,38,0));padding:6px 0 10px}
.salOv h2{margin:0;font-family:"Dela Gothic One",Impact,sans-serif;font-size:22px;letter-spacing:.5px;color:#ffd23f;text-shadow:0 2px 0 #000;flex:1}
.salOv .x{min-width:44px;min-height:44px;border-radius:12px;border:2px solid #ffffff44;background:#16294a;color:#fff;font-size:18px;cursor:pointer}
.salOv .sum{font-size:13px;color:#c9d2ea;margin:0 0 10px}
.salOv .row{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 10px}
.salOv .chip{min-height:36px;padding:6px 12px;border-radius:999px;border:1.5px solid #ffffff3a;background:#16294a;color:#e8ecf7;font:700 13px/1 "M PLUS Rounded 1c",sans-serif;cursor:pointer}
.salOv .chip.on{background:#ffd23f;color:#1a1400;border-color:#ffd23f}
.salOv .big{display:flex;gap:10px;margin:4px 0 12px}
.salOv .big button{flex:1;min-height:56px;border-radius:14px;border:2px solid #ffd23f88;background:linear-gradient(#24386b,#16294a);color:#fff;font:800 14px "M PLUS Rounded 1c",sans-serif;cursor:pointer;text-align:left;padding:8px 12px}
.salOv .big button small{display:block;font-weight:600;font-size:11.5px;color:#c9d2ea;margin-top:2px}
.salOv .cont{display:flex;gap:12px;align-items:center;border-radius:16px;overflow:hidden;border:2px solid #ffd23f;background:#16294a;margin:0 0 12px;cursor:pointer}
.salOv .cont img{width:120px;height:75px;object-fit:cover;display:block}.salOv .cont div{padding:6px 8px 6px 0;font-size:13px}.salOv .cont b{display:block;font-size:15px;color:#ffd23f}
.salOv .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.salOv .card{position:relative;border-radius:14px;overflow:hidden;background:#13213f;border:1.5px solid #ffffff22;cursor:pointer;box-shadow:0 4px 14px #0008;transition:transform .15s}
.salOv .card:active{transform:scale(.97)}
.salOv .card img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block}
.salOv .card .t{position:absolute;left:8px;right:38px;top:6px;font:800 14px/1.15 "M PLUS Rounded 1c",sans-serif;text-shadow:0 2px 3px #000,0 0 8px #000}
.salOv .card.isFav{border-color:#ffd23f88;box-shadow:0 0 10px #ffd23f22,0 4px 14px #0008}
.salOv .salFav{position:absolute;top:6px;right:6px;width:28px;height:28px;border-radius:50%;background:#0b1026bb;border:1.5px solid #ffffff44;color:#cbd5e1;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;z-index:2;line-height:1;padding:0;transition:transform .15s,background .15s,color .15s}
.salOv .salFav:active{transform:scale(1.25)}
.salOv .salFav.on{background:#ffd23f2f;border-color:#ffd23f;color:#ffd23f;box-shadow:0 0 8px #ffd23f66}
.salOv .card .e{font-size:18px;margin-right:4px}
.salOv .card .info{padding:7px 9px 9px;font-size:11.5px;color:#c9d2ea}
.salOv .badge{position:absolute;right:6px;top:calc(min(100%,1000px) * 0);padding:3px 7px;border-radius:999px;font:900 10px/1 sans-serif;letter-spacing:.5px}
.salOv .card .badge{top:auto;bottom:calc(100% - 62.5vw);}
.salOv .tag{display:inline-block;padding:2px 7px;border-radius:999px;font-size:10.5px;font-weight:800;margin:0 4px 4px 0;color:#fff}
.salOv .pbar{height:6px;border-radius:999px;background:#ffffff1f;overflow:hidden;margin-top:5px}.salOv .pbar i{display:block;height:100%;background:linear-gradient(90deg,#4fd1a5,#ffd23f)}
.salOv .new{background:#ff4d5a;color:#fff}.salOv .done{background:#4fd1a5;color:#05261b}.salOv .run{background:#ffd23f;color:#1a1400}
.salOv .stamp{position:absolute;right:8px;bottom:8px}
.salOv .sheet{position:fixed;inset:0;background:#000a;display:flex;align-items:flex-end;justify-content:center;z-index:3}
.salOv .sheet .box{width:min(720px,100%);max-height:88vh;overflow:auto;background:#13213f;border-radius:20px 20px 0 0;border-top:2px solid #ffd23f;padding:0 0 16px}
.salOv .sheet img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}
.salOv .sheet .in{padding:12px 16px}.salOv .sheet h3{margin:0 0 6px;font-family:"Dela Gothic One",Impact,sans-serif;font-size:22px;color:#ffd23f}
.salOv .sheet p{margin:6px 0;font-size:14.5px;line-height:1.45;color:#e8ecf7}
.salOv .sheet .act{display:flex;gap:10px;margin-top:12px}.salOv .sheet .act button{flex:1;min-height:52px;border-radius:14px;font:800 16px "M PLUS Rounded 1c",sans-serif;cursor:pointer;border:2px solid #ffd23f}
.salOv .play{background:linear-gradient(#ffd23f,#e8a33d);color:#1a1400}.salOv .ghost{background:#16294a;color:#fff;border-color:#ffffff44!important}
.salOv .ends{display:grid;gap:8px;margin-top:8px}.salOv .end{display:flex;gap:10px;align-items:center;padding:8px 10px;border-radius:12px;background:#0f1b36;border:1.5px dashed #ffffff33}
.salOv .end.f{border-style:solid;border-color:#ffd23f88;background:#1c2a52}
.salOv .seal{width:46px;height:46px;flex:none;border-radius:50%;display:grid;place-items:center;font-size:22px;border:3px double #ffffff44;color:#ffffff55;transform:rotate(-12deg)}
.salOv .end.f .seal{border-color:#ff4d5a;color:#ff4d5a;background:#ff4d5a14;font:900 9px/1.05 sans-serif;text-align:center;letter-spacing:.3px}
.salOv .end b{display:block;font-size:14px}.salOv .end span{font-size:12.5px;color:#c9d2ea}
.salOv .sec{margin:18px 0 6px;font:900 13px "M PLUS Rounded 1c",sans-serif;letter-spacing:1px;color:#ffd23f;text-transform:uppercase;display:flex;justify-content:space-between}
.salOv .prev{display:grid;grid-template-columns:150px 1fr;gap:12px;align-items:center;background:#13213f;border-radius:16px;padding:10px;border:1.5px solid #ffffff22}
.salOv .prev canvas{width:150px;height:150px;border-radius:12px;background:#0b1026}
.salOv .prev .w{font-size:13px;line-height:1.55}.salOv .prev .w b{color:#ffd23f}
.salOv .items{display:grid;grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:8px;margin-top:8px}
.salOv .it{position:relative;border-radius:12px;background:#13213f;border:1.5px solid #ffffff22;padding:8px 6px 7px;text-align:center;cursor:pointer;min-height:96px}
.salOv .it.lock{opacity:.5;filter:grayscale(.7)}.salOv .it.sel{border-color:#ffd23f;box-shadow:0 0 0 2px #ffd23f55}.salOv .it.on{border-color:#4fd1a5}
.salOv .it .sw{width:42px;height:42px;margin:0 auto 5px;border-radius:10px;display:grid;place-items:center;font-size:22px;border:2px solid #0006}
.salOv .it .n{font:700 11px/1.2 "M PLUS Rounded 1c",sans-serif}.salOv .it .k{position:absolute;right:5px;top:4px;font-size:11px}
.salOv .psec{display:grid;grid-template-columns:44px 1fr auto;gap:10px;align-items:center;padding:10px 12px;border-radius:14px;background:#13213f;border:1.5px solid #ffffff22;margin-bottom:8px;cursor:pointer}
.salOv .psec.gold{border-color:#ffd23f;background:linear-gradient(110deg,#2a2a1a,#3a3218 45%,#2a2a1a)}
.salOv .psec .pe{font-size:26px;text-align:center}.salOv .psec b{display:block;font-size:14px}.salOv .psec span{font-size:12px;color:#c9d2ea}.salOv .psec .n{font:900 13px sans-serif;color:#ffd23f}
.salOv .pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}
.salOv .pc{position:relative;border-radius:12px;overflow:hidden;background:#0f1b36;border:2px solid #ffffff2a;cursor:pointer;text-align:center;padding:0 0 6px;box-shadow:0 3px 10px #0007}
.salOv .pc img{width:100%;aspect-ratio:1;display:block;background:#0b1026}
.salOv .pc.miss{opacity:.8}
.salOv .pc .nm{font:800 11px/1.2 "M PLUS Rounded 1c",sans-serif;margin-top:5px;padding:0 4px;min-height:26px}
.salOv .pc .no{position:absolute;left:5px;top:4px;font:900 10px sans-serif;color:#fff;text-shadow:0 1px 2px #000}
.salOv .pc.gold{border-color:#ffd23f}
.salOv .pc.gold::after,.salOv .pbig.gold::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,rgba(255,240,170,.45) 45%,transparent 60%);background-size:250% 100%;animation:salFoil 3.2s linear infinite;pointer-events:none}
@keyframes salFoil{0%{background-position:120% 0}100%{background-position:-120% 0}}
.salOv .pbig{position:relative;width:min(260px,70vw);margin:12px auto 4px;border-radius:16px;overflow:hidden;border:3px solid #ffffff44;background:#0b1026}
.salOv .pbig.gold{border-color:#ffd23f}.salOv .pbig canvas{width:100%;display:block;aspect-ratio:1}
.salOv .modeSwitch{display:flex;background:#0d1a33;padding:4px;border-radius:14px;border:1.5px solid #ffffff2a;margin:0 0 10px;gap:6px}
.salOv .modeBtn{flex:1;min-height:42px;border:none;background:transparent;color:#94a3b8;font:800 13px "M PLUS Rounded 1c",sans-serif;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s}
.salOv .modeBtn.on{background:linear-gradient(135deg,#38bdf8,#0284c7);color:#041324;box-shadow:0 2px 10px rgba(56,189,248,.35)}
.salOv .modeBtn.on.gridTab{background:linear-gradient(135deg,#ffd23f,#e8a33d);color:#1a1400;box-shadow:0 2px 10px rgba(255,210,63,.35)}
.salOv .hubTools{display:flex;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:6px;margin-bottom:10px}
.salOv .hubToolBtn{flex:none;min-height:34px;padding:5px 11px;border-radius:10px;border:1.5px solid #ffffff22;background:#13213f;color:#e2e8f0;font:700 12px "M PLUS Rounded 1c",sans-serif;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:5px;transition:border-color .15s}
.salOv .hubToolBtn:hover{border-color:#ffd23f88}
.salOv .salSogniBig{display:flex;align-items:center;gap:12px;width:100%;margin:2px 0 10px;padding:12px 14px;border-radius:14px;border:2px solid #ffd23f;background:linear-gradient(135deg,#3b1d7a,#1b2a6b);color:#fff;font-family:"M PLUS Rounded 1c",sans-serif;text-align:left;cursor:pointer;box-shadow:0 0 14px #ffd23f33,0 4px 12px #0008}.salOv .salSogniBig:active{transform:scale(.985)}.salOv .salSogniBig .ic{font-size:30px}.salOv .salSogniBig .tx{flex:1;display:flex;flex-direction:column;gap:2px}.salOv .salSogniBig b{font-size:17px;font-weight:800;color:#ffd23f}.salOv .salSogniBig small{font-size:11.5px;opacity:.85;font-weight:600}.salOv .salSogniBig .go{font-size:22px;color:#ffd23f}
.salOv .mapWrap{position:relative;margin:4px 0 12px;border-radius:18px;overflow:hidden;border:2px solid #38bdf888;background:#060d1a;box-shadow:0 8px 30px rgba(0,0,0,0.6);aspect-ratio:16/9;max-height:380px}
.salOv .mapCanvas{width:100%;height:100%;display:block;cursor:pointer}
.salOv .mapOverlayHud{position:absolute;bottom:8px;left:8px;right:8px;display:flex;justify-content:space-between;align-items:center;pointer-events:none}
.salOv .mapPill{background:rgba(11,16,38,0.85);backdrop-filter:blur(6px);padding:4px 10px;border-radius:999px;border:1px solid rgba(255,255,255,0.25);font-size:11px;color:#f8fafc;font-weight:700;pointer-events:auto}
.salOv .mapSearchRow{display:flex;gap:8px;margin:8px 0 12px;align-items:stretch}
.salOv .mapSearchBox{position:relative;flex:1}
.salOv .mapSearch{width:100%;box-sizing:border-box;height:100%;min-height:42px;padding:9px 12px 9px 36px;border-radius:12px;background:#13213f;border:1.5px solid #38bdf888;color:#fff;font:700 13px "M PLUS Rounded 1c",sans-serif;outline:none}
.salOv .mapSearch:focus{border-color:#ffd23f;box-shadow:0 0 10px rgba(255,210,63,0.3)}
.salOv .mapSearchIcon{position:absolute;left:11px;top:50%;transform:translateY(-50%);font-size:15px;pointer-events:none}
.salOv .compassBtn{flex:none;padding:0 14px;min-height:42px;border-radius:12px;border:1.5px solid #ffd23f;background:linear-gradient(135deg,#24386b,#1a2d54);color:#ffd23f;font:800 12.5px "M PLUS Rounded 1c",sans-serif;cursor:pointer;display:flex;align-items:center;gap:6px;transition:transform .12s}
.salOv .compassBtn:active{transform:scale(.96)}
.salOv .terrGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:8px;margin:8px 0 12px}
.salOv .terrBtn{padding:9px 10px;border-radius:12px;border:1.5px solid #ffffff2a;background:#16294a;color:#fff;text-align:left;cursor:pointer;transition:transform .12s,border-color .15s}
.salOv .terrBtn:active{transform:scale(.97)}
.salOv .terrBtn.on{border-color:var(--tcol,#38bdf8);background:linear-gradient(135deg,rgba(56,189,248,0.22),#16294a);box-shadow:0 0 14px rgba(56,189,248,0.25)}
.salOv .terrBtn .te{font-size:20px;margin-bottom:2px}
.salOv .terrBtn b{display:block;font-size:12px;line-height:1.2;color:#f1f5f9}
.salOv .terrBtn span{font-size:10.5px;color:#94a3b8}
.salOv .hubPanel{padding:12px 14px;border-radius:16px;background:linear-gradient(145deg,#13213f,#0e1933);border:1.5px solid var(--tcol,#38bdf8);margin-bottom:12px;box-shadow:0 4px 16px rgba(0,0,0,0.35)}
.salOv .hubTop{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:6px}
.salOv .hubTitle{margin:0;font-family:"Dela Gothic One",Impact,sans-serif;font-size:17px;color:#ffd23f;display:flex;align-items:center;gap:7px}
.salOv .hubAtmo{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 8px}
.salOv .hubAtmoTag{padding:2px 7px;border-radius:6px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);font-size:11px;color:#cbd5e1;font-weight:600}
.salOv .hubQuote{font-size:12px;font-style:italic;color:#93c5fd;margin:4px 0 8px;line-height:1.35}
.salOv .hubDesc{margin:0 0 6px;font-size:12.5px;color:#e2e8f0;line-height:1.4}
.salOv .treeCard{background:#101a35;border:1.5px solid #233560;border-radius:14px;padding:12px;margin:10px 0 16px;box-shadow:0 4px 14px #0008}
.salOv .treeHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;border-bottom:1px solid #ffffff18;padding-bottom:6px}
.salOv .treeHead b{color:#ffd23f;font-size:14px}
.salOv .treeStem{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:10px;background:#18284e;border:1.5px solid #38bdf888;font-size:12.5px;font-weight:700}
.salOv .treeStem.done{border-color:#4fd1a5;color:#e8fbf3}
.salOv .treeBranch{margin:8px 0 8px 18px;padding-left:14px;border-left:2px dashed #38bdf866;display:flex;flex-direction:column;gap:8px}
.salOv .treeLeaf{position:relative;padding:9px 12px;border-radius:10px;background:#0c162e;border:1.5px dashed #ffffff2a;font-size:12px;transition:all .15s}
.salOv .treeLeaf.f{border-style:solid;border-color:#ffd23f88;background:linear-gradient(135deg,#1b2b52,#13203f)}
.salOv .treeLeaf::before{content:"";position:absolute;left:-16px;top:14px;width:12px;height:2px;background:#38bdf866}
.salOv .treeLeaf.f::before{background:#ffd23f}
.salOv .treeLeaf b{display:flex;align-items:center;gap:6px;font-size:13px;color:#fff}
.salOv .treeLeaf.f b{color:#ffd23f}
.salOv .treeLeaf span{display:block;font-size:11.5px;color:#c9d2ea;margin-top:3px}
.salOv .treeTag{display:inline-block;padding:2px 6px;border-radius:6px;font-size:10px;font-weight:800;text-transform:uppercase;margin-left:auto}
.salOv .treeTag.f{background:#ffd23f22;color:#ffd23f;border:1px solid #ffd23f88}
.salOv .treeTag.lock{background:#ffffff11;color:#ffffff66;border:1px dashed #ffffff33}
.salOv .treeLegend{display:flex;flex-wrap:wrap;gap:8px 14px;background:#0d1830;border:1px solid #1e3a66;border-radius:12px;padding:8px 12px;margin:8px 0 12px;font-size:11.5px;color:#93c5fd}
.salOv .treeActBox{margin-top:8px;padding-top:7px;border-top:1px dashed #ffffff22;display:flex;justify-content:space-between;align-items:center;gap:8px}
.salOv .treeActBtn{padding:4px 10px;border-radius:8px;border:1.5px solid #ffd23f;background:linear-gradient(#ffd23f,#e8a33d);color:#1a1400;font:800 11.5px "M PLUS Rounded 1c",sans-serif;cursor:pointer}
.salTreeCutIn{position:fixed;inset:0;z-index:9999;background:radial-gradient(ellipse at center,#0d2047 0%,#030712 85%);display:flex;align-items:center;justify-content:center;pointer-events:all;overflow:hidden;animation:salTreeCutIn .32s cubic-bezier(.16,1,.3,1)}
.salTreeCutStripe{position:absolute;width:180%;height:130px;background:linear-gradient(90deg,transparent,#38bdf888,#ffd23fcc,transparent);transform:rotate(-12deg);animation:salTreeStripe 1s ease-in-out infinite alternate}
.salTreeCutContent{position:relative;z-index:2;text-align:center;padding:24px 34px;border-top:2px solid #ffd23f;border-bottom:2px solid #38bdf8;background:rgba(6,13,31,.92);backdrop-filter:blur(8px);box-shadow:0 0 50px rgba(56,189,248,.35);border-radius:8px}
.salTreeCutIcon{font-size:44px;animation:salTreeBounce .9s ease infinite alternate}
.salTreeCutTitle{font-family:"Dela Gothic One",Impact,sans-serif;font-size:24px;letter-spacing:1px;color:#ffd23f;text-shadow:0 3px 0 #000,0 0 20px rgba(255,210,63,.6);margin:6px 0 4px}
.salTreeCutSub{font-family:"M PLUS Rounded 1c",system-ui,sans-serif;font-size:13px;font-weight:700;color:#e0f2fe;letter-spacing:.5px}
.salTreeCutOut{animation:salTreeCutOut .35s forwards ease-in}
@keyframes salTreeCutIn{0%{opacity:0;transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}
@keyframes salTreeCutOut{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.94)}}
@keyframes salTreeStripe{0%{transform:rotate(-12deg) translateY(-20px)}100%{transform:rotate(-12deg) translateY(20px)}}
@keyframes salTreeBounce{0%{transform:scale(.92)}100%{transform:scale(1.08)}}
@media (max-width:360px){.salOv .grid{grid-template-columns:1fr 1fr;gap:8px}.salOv .prev{grid-template-columns:110px 1fr}.salOv .prev canvas{width:110px;height:110px}}`;
    document.head.appendChild(st);
  }
  let OV = null, BACK = null; const BK = { sal: null, alb: null, gua: null, per: null, sg: null, cin: null, map: null }; // ogni schermata ricorda da dove si era entrati
  function shell(title) { css(); close(); OV = document.createElement("div"); OV.className = "salOv"; OV.innerHTML = `<div class="wrap"><div class="bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="body"></div></div>`; OV.querySelector(".x").onclick = () => { const b = BACK; close(); if (typeof b === "function") b(); }; document.body.appendChild(OV); return OV.querySelector(".body"); }
  function close() { if (OV) { OV.remove(); OV = null; } }

  // ---------------------------------------------------------------- SALA GIOCHI
  // I motori di partita originali delle saghe, da giocare liberi. Si sbloccano finendo il primo capitolo della saga;
  // finire la saga (almeno un finale) sblocca anche la sfida del suo «boss». Non danno premi: solo il record.
  const SGK = "ali-di-rondine.salagiochi";
  const sgRec = () => { const r = safe(() => JSON.parse(localStorage.getItem(SGK) || "null"), null) || {}; r.w = r.w || {}; r.p = r.p || {}; r.diff = r.diff || "normale"; return r; };
  const sgSave = (r) => safe(() => localStorage.setItem(SGK, JSON.stringify(r)), null);
  const heroLook = () => { const h = safe(() => JSON.parse(localStorage.getItem("ali-di-rondine.campione") || "null"), null) || {}; return { name: h.name || "Campione", skin: h.skin || "#e0ac7e", hair: h.hair || "#2b1d14", shirt: h.shirt || "#1f5fbf" }; };
  const P = (name, skin, hair, st) => ({ name, skin, hair, st });
  const MACHINES = [
    { id: "vignette", t: "Vignette", e: "🗯️", saga: "torneo", eng: "__vignette", d: "La partita a fumetti del Torneo delle Cento Scuole: vista di lato, ad azioni, con le tecniche di squadra.",
      opp: [{ name: "I Gabbiani del Porto", color: "#3a6ab8", style: "pressing", players: [P("Gil", "#d9a679", "#2a2a2a"), P("Moli", "#e8c4a0", "#5a3a1a"), P("Rete", "#c68642", "#1a1a1a")] }, { name: "Collegio San Biagio", color: "#6a3a8a", style: "difensiva", players: [P("Biagio", "#f0d0b0", "#3a2a1a"), P("Fra", "#e0b890", "#1a1a1a"), P("Dodo", "#d9a679", "#8a5a2a")] }],
      boss: { name: "Accademia del Faro", color: "#1a2a5a", style: "contropiede", players: [{ id: "ts_ettore", name: "Ettore", skin: "#e0b890", hair: "#1a1a2a" }, P("Marino", "#e8c4a0", "#2a1a1a"), P("Scotti", "#d9a679", "#3a2a1a")] },
      cup: ["I Gabbiani del Porto", "Ragazzi del Mercato", "Le Lanterne", "Collegio San Biagio", "Scuola dei Pescatori", "Real Ciabatta", "Accademia del Faro"],
      opts: (o, h, boss) => ({ title: `Vignette · contro ${o.name}`, us: h.name, actions: boss ? 10 : 8, opp: o, mates: [{ id: "ts_tito", name: "Tito", skin: "#e8b88a", hair: "#3a2a1a" }, { id: "ts_alba", name: "Alba", skin: "#f0d0b0", hair: "#c8642a" }], techniques: ["tiro3", "muro", "ombra"] }) },
    { id: "atb", t: "ATB", e: "💠", saga: "cronache", eng: "__atb", d: "La battaglia a turni delle Cronache del Pallone di Cristallo: barre del tempo attivo, comandi, magie e fiato.",
      opp: [{ name: "Guardiani di Rovo", color: "#5a3a2a", style: "difensiva", players: [P("Rovo", "#8a6a4a", "#2a4a1a", { tiro: 12, pass: 11, dif: 14, vel: 10 }), P("Spina", "#7a5a3a", "#3a5a1a"), P("Ortica", "#8a7a4a", "#4a6a2a"), P("Cardo", "#6a5a3a", "#5a3a6a")] }, { name: "I Silenti", color: "#3a3a4a", style: "equilibrata", players: [P("Il Muto", "#c8c8d0", "#3a3a4a", { tiro: 13, pass: 14, dif: 13, vel: 13 }), P("Quieto", "#c8c8d0", "#2a2a3a"), P("Zitto", "#c8c8d0", "#4a4a5a"), P("Sussurro", "#c8c8d0", "#5a5a6a")] }],
      boss: { name: "Il Re del Silenzio", color: "#2a2a5a", style: "difensiva", players: [P("Il Re", "#d8c8b8", "#c8c8d8", { tiro: 15, pass: 15, dif: 18, vel: 13 }), P("Il Muto", "#c8c8d0", "#3a3a4a", { tiro: 14, pass: 14, dif: 14, vel: 13 }), P("Quieto", "#c8c8d0", "#2a2a3a"), P("Zitto", "#c8c8d0", "#4a4a5a")] },
      opts: (o, h, boss) => ({ title: `ATB · contro ${o.name}`, us: "Il gruppo", half: boss ? 80 : 70, theme: boss ? "stelle" : "prato", items: 3, heroSt: { tiro: 16, pass: 14, dif: 12, vel: 15 }, heroSpells: ["luce"], heroMp: 18, opp: o,
        party: [{ id: "cc_lyra", name: "Lyra", skin: "#f0d0b0", hair: "#c8a040", st: { tiro: 12, pass: 13, dif: 19, vel: 13 }, spells: ["cura"], mp: 16 }, { id: "cc_fosco", name: "Fosco", skin: "#e8c4a0", hair: "#3a2a5a", st: { tiro: 10, pass: 16, dif: 9, vel: 11 }, spells: ["vento", "gelo", "fuoco"], mp: 34 }, { id: "cc_rubi", name: "Rubi", skin: "#c68642", hair: "#1a1a1a", st: { tiro: 14, pass: 13, dif: 15, vel: 19 }, spells: [], mp: 0 }] }) },
    { id: "bottoni", t: "Super-Bottoni", e: "🔘", saga: "mantello", eng: "__bottoni", d: "Il calcio a bottoni del Mantello Granata: la fionda, le carambole, i superpoteri e i contro-poteri dei cattivi.", power: true,
      opp: [{ name: "I Panchinari", color: "#3a6ab8", style: "contropiede", players: [P("Tonno", "#e0b890", "#3a2a1a"), P("Ciuffo", "#f0c8a0", "#e8c84a"), P("Mezzala", "#d9a679", "#1a1a1a"), P("Riserva", "#e8c4a0", "#5a3a2a")] }, { name: "Madame Colla", color: "#8aa83a", style: "difensiva", oppPower: "colla", players: [P("Colla", "#f0d8c0", "#e8e0a0"), P("Mastice", "#d9a679", "#5a4a3a"), P("Gomma", "#e8c4a0", "#3a2a1a"), P("Ventosa", "#c68642", "#1a1a1a")] }],
      boss: { name: "Il Dottor Fuorigioco", color: "#1a1a1a", style: "pressing", oppPower: "specchio", players: [P("Dottore", "#e8d0b8", "#e8e8e8"), P("Bandierina", "#d9a679", "#3a3a3a"), P("Linea", "#e8c4a0", "#1a1a1a"), P("Moviola", "#c68642", "#5a3a2a")] },
      opts: (o, h, boss, pw) => ({ title: `Super-Bottoni · contro ${o.name}`, us: h.name, usColor: "#8a1a2a", power: pw || "fulmine", oppPower: o.oppPower || "", shots: boss ? 8 : 6, opp: o, mates: [{ name: "Bullone", skin: "#b8c4d0", hair: "#8a9aa8" }, { name: "Gilda", skin: "#e8c4a0", hair: "#2a1a3a" }, { name: "Tilde", skin: "#f0d0b0", hair: "#e8e8f0" }] }) },
    { id: "nastro", t: "Il Nastro", e: "📼", saga: "stagione", eng: "__nastro", d: "La finale su videocassetta di Stagione Infinita: bivi, fantasmi e riavvolgimenti. Qui ogni partita è una cassetta nuova.",
      opp: [{ name: "I Pescatori", color: "#3a8a8a", style: "equilibrata" }, { name: "Real Lago", color: "#5a8ad8", style: "pressing" }],
      boss: { name: "La Domenica Infinita", color: "#ff5a7a", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Il Nastro · contro ${o.name}`, us: h.name, usColor: "#e8c84a", seed: "sala" + Date.now(), memory: {}, rewinds: boss ? 1 : 2, actions: boss ? 8 : 6, mates: [{ name: "Gigi" }, { name: "Vale" }], opp: o }) },
    { id: "luci", t: "Luci", e: "🏮", saga: "lampioni", eng: "__luci", d: "La partita al buio della Notte dei Lampioni: a turni, su un campo a caselle, con le lanterne e le ombre che si vedono solo nella luce.",
      opp: [{ name: "Il coro della chiesa", color: "#8a6a9a", style: "equilibrata" }, { name: "Le Ombre del '52", color: "#6a7ab8", style: "contropiede" }],
      boss: { name: "Le Ombre al completo", color: "#4a4a8a", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Luci · contro ${o.name}`, us: h.name, usColor: "#ffd27a", lanterns: boss ? 2 : 3, actions: boss ? 8 : 6, mates: [{ name: "Fiammetta" }, { name: "Tobia" }], opp: o }) },
    { id: "lavagna", t: "Lavagna Tattica", e: "📋", saga: "colline", eng: "__lavagna", d: "La partita dell'allenatore di Master League delle Colline: modulo, giocatori nelle caselle, istruzioni che si battono a vicenda, cambi, stamina e pagelle.",
      opp: [{ name: "Sporting Pietrafitta", color: "#5a5a8a", style: "equilibrata", ovr: 58, instr: "possesso" }, { name: "Real Monteroso", color: "#8a2a5a", style: "contropiede", ovr: 62, instr: "contropiede" }],
      boss: { name: "Atletico Valfonda", color: "#a83a2a", style: "pressing", ovr: 72, instr: "pressing" },
      opts: (o, h, boss) => ({ title: `Lavagna Tattica · contro ${o.name}`, us: "U.S. Colle Alto", usColor: "#2a6a3a", scout: true, opp: o, squad: [["Bepi Sasso", "P", 58], ["Toni Vigna", "D", 56], ["Gigio Ruota", "D", 57], ["Nane Campanile", "D", 54], ["Marta Fiore", "C", 60], ["Ciccio Botte", "C", 55], ["Ines Granaio", "C", 62], ["Rino Corriera", "A", 59], ["Dodo Lampo", "A", 56], [h.name || "Il Mister", "A", 64]].map(([name, role, ovr]) => ({ name, role, ovr: boss ? ovr + 4 : ovr })) }) },
    { id: "duello", t: "Duello Cinematico", e: "🏆", saga: "campetto", eng: "__duello", d: "La partita a vignette manga di Dal Campetto al Mondiale: duelli, grinta, e i tiri speciali (Aquila, Catapulta, Combinazione d'Oro).",
      opp: [{ name: "Collegio San Marco", color: "#c83a3a", style: "difensiva", players: [{ name: "Il Capitano", pow: 10 }, { name: "Il Libero", pow: 11 }], keeper: { name: "Saverio Muro", pow: 16 } }, { name: "Fiamme del Porto", color: "#e85a1a", style: "pressing", players: [{ name: "Brace", pow: 11 }, { name: "Leone Ruggeri", pow: 14 }], keeper: { name: "Il Fornaio", pow: 14 }, ace: { name: "Leone Ruggeri", special: "Tiro del Leone" } }],
      boss: { name: "Nordavia", color: "#e8e8f0", style: "pressing", players: [{ name: "Il Barone", pow: 15 }, { name: "Gelo", pow: 13 }], keeper: { name: "Il Muro di Nordavia", pow: 17 }, ace: { name: "Il Barone", special: "Fuoco del Nord" } },
      opts: (o, h, boss) => ({ title: `Duello Cinematico · contro ${o.name}`, us: h.name, usColor: "#1f5fbf", minutes: boss ? 90 : 60, guts: boss ? 120 : 100, hero: h, mates: [{ name: "Pio" }, { name: "Gino" }], opp: o, specials: [{ id: "aquila", name: "Tiro dell'Aquila", cost: 30, pow: 9, fx: "aquila" }, { id: "catapulta", name: "Catapulta dei Ponte", cost: 40, pow: 12, fx: "catapulta" }, { id: "oro", name: "Combinazione d'Oro", cost: 45, pow: 14, fx: "oro" }] }) },
    { id: "concilio", t: "Il Concilio", e: "🕯️", saga: "trono", eng: "__concilio", d: "La partita dei patti del Trono di Cuoio: al tavolo si firmano patti di cera, al campo si gioca su tre corsie, e si scopre chi li rispetta.",
      opp: [{ name: "Casa Pietrabruna", color: "#5a4a3a", sigil: "⛰️", honor: 0.85, style: "difensiva" }, { name: "Casa Salmastra", color: "#1a4a6a", sigil: "🐙", honor: 0.45, style: "contropiede" }],
      boss: { name: "La reggente Ferroquercia", color: "#8a6a1a", sigil: "🌳", honor: 0.3, style: "pressing" },
      opts: (o, h, boss) => ({ title: `Il Concilio · contro ${o.name}`, us: h.name, usSigil: "🦡", usColor: "#6a5a3a", cred: boss ? 6 : 5, ravens: 1, turns: boss ? 10 : 8, cards: ["centro", "sinistra", "destra", "tregua", "ostaggio"], opp: o }) },
    { id: "gadget", t: "Ombre e Gadget", e: "🌃", saga: "grigio", eng: "__gadget", d: "La partita di notte del Cavaliere della Notte: a turni, su caselle, i difensori annunciano dove entrano e tu li schivi con la cintura dei gadget.",
      opp: [{ name: "I Portuali di Gancio", color: "#a83a2a", style: "pressing", players: [{ name: "Gancio" }, { name: "Bitta" }, { name: "Cima" }], keeper: { name: "Saracinesca" } }, { name: "La banda di Vela Nera", color: "#1a1a24", style: "contropiede", players: [{ name: "Vela Nera" }, { name: "Grondaia" }, { name: "Lucernario" }], keeper: { name: "Il Comignolo" } }],
      boss: { name: "Nebbia Athletic", color: "#8a8a9a", style: "pressing", players: [{ name: "Il Capitano" }, { name: "Foschia" }, { name: "Caligine" }], keeper: { name: "Il Muro Grigio" } },
      opts: (o, h, boss) => ({ title: `Ombre e Gadget · contro ${o.name}`, us: h.name, usColor: "#5a6a8a", minutes: boss ? 90 : 60, hero: h, mates: [{ name: "Marisa" }, { name: "Gancio" }], opp: o, gadgets: ["visore", "fumo", "rampino", "scudo", "segnale", "bolas"], belt: ["visore", "fumo", "rampino", "scudo"] }) },
    { id: "iso", t: "Calcio Tattico", e: "⚖️", saga: "ducati", eng: "__iso", d: "La partita della Guerra dei Tre Ducati: campo isometrico a terrazze, iniziativa, contrasti alle spalle e tiri dall'alto.",
      opp: [{ name: "Esploratori di Ruggine", color: "#a83a2a", style: "pressing", players: [{ name: "Chiodo" }, { name: "Lima" }, { name: "Bullone" }], keeper: { name: "Incudine" } }, { name: "Vetrara", color: "#2a8a6a", style: "difensiva", players: [{ name: "Isotta" }, { name: "Cristallo" }, { name: "Smeriglio" }], keeper: { name: "Vetrocemento" } }],
      boss: { name: "Ruggine", color: "#a83a2a", style: "pressing", players: [{ name: "Il Duca Ferro" }, { name: "Chiodo" }, { name: "Lima" }], keeper: { name: "Incudine" } },
      opts: (o, h, boss) => ({ title: `Calcio Tattico · contro ${o.name}`, us: h.name, usColor: "#2a6ab8", minutes: boss ? 90 : 60, hero: h, mates: [{ name: "Corrado" }, { name: "Lia" }], opp: o, terrain: boss ? "ruggine" : o.name === "Vetrara" ? "vetro" : "saline" }) },
    { id: "volo", t: "Volo a Tutto Campo", e: "🌠", saga: "titano", eng: "__volo", d: "La partita in cielo del Figlio del Titano: a tempo fermo disegni la traiettoria col dito, poi si vola; gli avversari provano a tagliarti la strada.",
      opp: [{ name: "I Fulmini dell'Agenzia", color: "#3a6ac8", style: "pressing", players: [{ name: "Capitan Fulmine" }, { name: "Tuono" }], keeper: { name: "Parafulmine" } }, { name: "Vega di Elyon", color: "#7a5ad8", style: "contropiede", players: [{ name: "Vega" }, { name: "Lumen" }], keeper: { name: "La boa" } }],
      boss: { name: "Elyon", color: "#7a5ad8", style: "pressing", players: [{ name: "Orione" }, { name: "Atlante" }], keeper: { name: "La Stella Fissa" } },
      opts: (o, h, boss) => ({ title: `Volo a Tutto Campo · contro ${o.name}`, us: h.name, usColor: "#c83a2a", minutes: boss ? 90 : 60, hero: h, mates: [{ name: "Sam" }], opp: o }) },
    { id: "ciak", t: "Ciak! Si Gioca", e: "🎬", saga: "cavallo", eng: "__ciak", d: "La partita del Cavallo Star: si gioca a scene, segui il copione o improvvisi, poi il ciak a tempo. Il regista dà le stelle.",
      opp: [{ name: "Il Catering", color: "#e8d8a8", players: [{ name: "Tartina" }, { name: "Vol-au-vent" }] }, { name: "Le Comparse Vigili", color: "#5a6a9a", players: [{ name: "Vigile 1" }, { name: "Vigile 2" }] }],
      boss: { name: "Cuccioli in Campo", color: "#7ab8e8", players: [{ name: "Max Allegria" }, { name: "Briciola" }] },
      opts: (o, h, boss) => ({ title: `Ciak! Si Gioca · contro ${o.name}`, us: "Zoccoli d'Oro", usColor: "#f0a8c8", minutes: boss ? 90 : 60, takes: boss ? 1 : 2, hero: { name: h.name || "Tu" }, mates: [{ name: "Baldo" }, { name: "Ugo" }], opp: o }) },
    { id: "ipogeo", t: "Le Stanze dell'Ipogeo", e: "🔥", saga: "dungeon", eng: "__dungeon", d: "La partita del Dungeon di Fine Stagione: una discesa breve di stanze viste dall'alto, con trappole, cuori, scatto e un dono da scegliere tra una stanza e l'altra. L'ultima stanza è contro il mitico che scegli.",
      opp: [{ name: "Il Golem di Pietra Pomice", color: "#8a8478", style: "difensiva", kind: "golem" }, { name: "Le Arpie del Fischio", color: "#9a5ac8", style: "pressing", kind: "arpie" }, { name: "L'Idra dalle Mille Maglie", color: "#7ac84a", style: "contropiede", kind: "idra" }],
      boss: { name: "Cenere, la custode", color: "#ff7a1a", style: "pressing", kind: "cenere" },
      opts: (o, h, boss) => ({ title: `Le Stanze dell'Ipogeo · ${o.name}`, run: true, rooms: boss ? 3 : 2, kind: o.kind, us: "Il Campione", usColor: "#ff7a1a", hero: { name: h.name || "Tu" }, opp: o }) },
    { id: "consegna", t: "Consegna a Rete", e: "🚀", saga: "razzo", eng: "__consegna", d: "La partita di Razzopacco: guidi un razzetto col dito, il pallone è un pacco, i pianeti curvano i lanci, i tubi ti portano dall'altra parte.",
      opp: [{ name: "I Crostini", color: "#c8782a", style: "difensiva", players: [{ name: "Capitan Crostino" }, { name: "Grissino" }], keeper: { name: "Il Pane Raffermo" } }, { name: "Postini dell'Anello", color: "#3ab8c8", style: "contropiede", players: [{ name: "Saturnina" }, { name: "Rapido" }], keeper: { name: "L'Anulare" } }],
      boss: { name: "OmniPacco Galacticos", color: "#5a6ad8", style: "pressing", players: [{ name: "Orsola Monòpoli" }, { name: "Agente Zeta" }], keeper: { name: "Il Drone Omega" } },
      opts: (o, h, boss) => ({ title: `Consegna a Rete · contro ${o.name}`, us: "Razzopacco", usColor: "#ff8a3a", secs: boss ? 110 : 90, minutes: boss ? 90 : 60, hero: { name: h.name || "Tu" }, mate: { name: "Capitana Borea" }, opp: o, oppStyle: o.style }) },
    { id: "giroegol", t: "Giro e Gol", e: "🏁", saga: "gp", eng: "__giroegol", d: "La partita di Gran Premio del Pallone: strada in pseudo-3D, turbo e mirini, un rivale da superare. All'ingresso dell'area la velocità è la potenza del tiro; poi il mirino oscilla e il portiere legge.",
      opp: [{ name: "Scuderia Fiamma", color: "#d8302a", style: "equilibrata", players: [{ name: "Rosalba" }, { name: "Fiammetta" }], keeper: { name: "Il Palo Bionico" } }, { name: "I Bolidi Verdi", color: "#1a8a4a", style: "contropiede", players: [{ name: "Smeraldo" }, { name: "Lime" }], keeper: { name: "Il Guardrail" } }],
      boss: { name: "Gommalux Racing", color: "#c8a040", style: "pressing", players: [{ name: "Il Direttore" }, { name: "Pit Stop" }], keeper: { name: "Il Cancello" } },
      opts: (o, h, boss) => ({ title: `Giro e Gol · contro ${o.name}`, us: "Officina Bullone", usColor: "#2a6adf", laps: boss ? 4 : 3, hero: { name: h.name || "Tu", skin: h.skin, hair: h.hair }, mate: { name: "Tonino" }, opp: o, oppStyle: o.style }) },
    { id: "pallatempo", t: "Palla del Tempo", e: "⏳", saga: "tempo", eng: "__pallatempo", d: "La partita di Rondine 1938-2038: una sola partita giocata in tre epoche. Il pallone che passa sui segni del 1938 e del 1978 lascia tracce (alberi, statue, varchi, guasti) che cambiano il campo del 2038. Hai il comando TEMPO per fermare gli avversari.",
      opp: [{ name: "Il Mulino", color: "#c8782a", style: "difensiva", players: [{ name: "Baldo" }, { name: "Macina" }], keeper: { name: "Il Setaccio" } }, { name: "I Toast del 2038", color: "#e8a43a", style: "equilibrata", players: [{ name: "Crosta" }, { name: "Mollica" }], keeper: { name: "Il Tostapane" } }],
      boss: { name: "VAR Totale", color: "#46f0ff", style: "pressing", players: [{ name: "Vera Revisori" }, { name: "Drone Fischietto" }], keeper: { name: "Il Verbale" } },
      opts: (o, h, boss) => ({ title: `Palla del Tempo · contro ${o.name}`, us: "Rondinara", usColor: "#2a6adf", secs: boss ? 90 : 70, tempo: boss ? 3 : 2, fischio: boss ? 1 : 0, hero: { name: h.name || "Tu" }, mate: { name: "Dorino" }, opp: o }) },
    { id: "combo", t: "Combo di Squadra", e: "🦸", saga: "quartiere", eng: "__combo", d: "La partita degli Straordinari di Quartiere: scegli uno o due eroi a turno, i poteri si combinano, le combo si scoprono giocando.",
      opp: [{ name: "I Geometri", color: "#ffd23f", style: "difensiva", players: [{ name: "Il Capo" }, { name: "Squadra" }], keeper: { name: "Il Metro" } }, { name: "Le Ruspe", color: "#ffd23f", style: "pressing", players: [{ name: "Betoniera" }, { name: "Gru" }], keeper: { name: "Il Pilastro" } }],
      boss: { name: "Squadra Calcestruzzo", color: "#7a7a8a", style: "pressing", players: [{ name: "Il Dottor Cemento" }, { name: "Betoniera" }], keeper: { name: "Il Pilastro" } },
      opts: (o, h, boss) => ({ title: `Combo di Squadra · contro ${o.name}`, us: "Gli Straordinari", usColor: "#ff5a8a", minutes: boss ? 90 : 60, heroes: [{ name: h.name || "Il Copione", power: "scatto" }, { name: "Brina", power: "ghiaccio" }, { name: "Soffio", power: "vento" }, { name: "Scintilla", power: "fuoco" }], opp: o, known: ["bufera", "raffica"] }) },
    { id: "ritagli", t: "Ritagli di Cartone", e: "✂️", saga: "montagna", eng: "__ritagli", d: "La partita del Piccolo Borgo: marionette di cartone a molla stop-motion, contrasti a forbice e tiri a rimbalzo secco sulle sponde.",
      opp: [{ name: "Ragazzi del Coro", color: "#60a5fa", style: "equilibrata", players: [{ name: "Pancrazio" }, { name: "Anacleto" }] }, { name: "Boscaioli del Passo", color: "#b45309", style: "pressing", players: [{ name: "Tarcisio" }, { name: "Tronco" }] }],
      boss: { name: "Rappresentativa della Valle", color: "#dc2626", style: "pressing", players: [{ name: "Sindaco Valanga" }, { name: "Capitano Ghiaccio" }] },
      opts: (o, h, boss) => ({ title: `Ritagli · contro ${o.name}`, us: "Piccolo Borgo", usColor: "#0284c7", turns: boss ? 8 : 6, hero: { name: h.name || "Tu" }, mates: [{ name: "Boris" }, { name: "Wendy" }], opp: o }) },
    { id: "stangata", t: "Stangata", e: "🤠", saga: "pugno", eng: "__stangata", d: "La sfida dal dischetto di Per un pugno di rigori: tamburo revolver a sei colpi, mira a tensione oscillante e parate coi guanti di cuoio a mezzogiorno.",
      opp: [{ name: "I Vice dello Sceriffo", color: "#b45309", style: "equilibrata" }, { name: "I Fuorilegge del Saloon", color: "#78350f", style: "contropiede" }],
      boss: { name: "Ramon Sette Tiri", color: "#dc2626", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Stangata · contro ${o.name}`, us: "Il Gringo", usColor: "#ea580c", turns: boss ? 6 : 4, hero: { name: h.name || "Tu" }, opp: o }) },
    { id: "arrembaggio", t: "Arrembaggio sul Ponte", e: "🏴‍☠️", saga: "galletta", eng: "__arrembaggio", d: "La sfida sul ponte beccheggiante di S.O.S. Galletta: rollio dinamico del veliero, vento marino, bordate di cannone e scivolate di burro tra i barili di melassa.",
      opp: [{ name: "Corsari Sottaceto", color: "#1e3a8a", style: "equilibrata" }, { name: "Granatieri Reali", color: "#0284c7", style: "contropiede" }],
      boss: { name: "Commodoro Cracker", color: "#dc2626", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Arrembaggio · contro ${o.name}`, us: "I Bucanieri", usColor: "#d97706", turns: boss ? 7 : 5, hero: { name: h.name || "Tu" }, opp: o }) },
    { id: "corona", t: "Duello di Corona", e: "👑", saga: "regno", eng: "__corona", d: "Il duello sulla Piazza d'Armi di Castelalto: corri al portone, tira a tempo, difendi leggendo le finte e, tra un tempo e l'altro, tratta con le tre Casate per averne i poteri.",
      opp: [{ name: "I Corvi di Rocca Nera", color: "#3a2a40", style: "pressing" }, { name: "La Guardia dei Lupi", color: "#8b95ab", style: "equilibrata" }],
      boss: { name: "Il Campione della Corona", color: "#a82a3a", style: "contropiede" },
      opts: (o, h, boss) => ({ title: `Duello di Corona · contro ${o.name}`, us: "Il Campione senza Stendardo", usColor: "#b0303a", tempi: boss ? 4 : 3, hero: { name: h.name || "Tu" }, opp: o }) },
    { id: "rintocchi", t: "I Cento Rintocchi", e: "🔔", saga: "campana", eng: "__rintocchi", d: "La sfida notturna sul sagrato di Rocca Campanaria: tempismo del rintocco delle campane, tiri a scasso, finta del fiasco e il Rintoccometro del Maresciallo Cacace.",
      opp: [{ name: "I Carabinieri di Cacace", color: "#1e3a8a", style: "equilibrata" }, { name: "Contrada del Gufo", color: "#1e1b4b", style: "contropiede" }],
      boss: { name: "Campanari di San Pancrazio", color: "#ca8a04", style: "pressing" },
      opts: (o, h, boss) => ({ title: `I Cento Rintocchi · contro ${o.name}`, us: "I Soliti Ignoti", usColor: "#ca8a04", turns: boss ? 7 : 5, hero: { name: h.name || "Tu" }, opp: o }) },
    { id: "circo", t: "Circo Massimo", e: "🏛️", saga: "roma", eng: "__circo", d: "La sfida gladiatoria nell'arena dell'Antica Roma: campo ovale con spina centrale, scatti a biga, muri di scudi e catapulte sopra l'obelisco con il Favore di Cesare.",
      opp: [{ name: "I Legionari della Suburra", color: "#b45309", style: "equilibrata" }, { name: "I Gladiatori di Spartaco", color: "#dc2626", style: "pressing" }],
      boss: { name: "I Pretoriani Imperiali", color: "#854d0e", style: "contropiede" },
      opts: (o, h, boss) => ({ title: `Circo Massimo · contro ${o.name}`, us: "Legionari Alati", usColor: "#b91c1c", turns: boss ? 8 : 6, hero: { name: h.name || "Tu" }, opp: o }) },
    { id: "marea", t: "Marea", e: "🌊", saga: "naufraghi", eng: "__marea", d: "La partita dell'isola: un campo di celle che si allagano mentre si gioca. Passa, tira e alza pedane asciutte prima che sparisca la tua metà.",
      opp: [{ name: "Il Bar del Cocco", color: "#16a34a", style: "equilibrata", players: [{ name: "Cocco" }, { name: "Noce" }] }, { name: "I Granchi di Punta Cieca", color: "#dc2626", style: "pressing", players: [{ name: "Chela" }, { name: "Pinza" }] }],
      boss: { name: "Il Riflusso", color: "#0e7490", style: "contropiede", players: [{ name: "Risacca" }, { name: "Frangente" }] },
      opts: (o, h, boss) => ({ title: `Marea · contro ${o.name}`, us: "I Rondine", usColor: "#1d4ed8", duration: boss ? 110 : 100, hero: { name: h.name || "Tu" }, mates: [{ name: "Bora" }, { name: "Gaspare" }], opp: o }) },
    { id: "pedinamento", t: "Pedinamento Tattico '54", e: "🕵️", saga: "milano", eng: "__pedinamento", d: "Il calcio noir sotto i riflettori e nella nebbia dell'Arena Civica: resta nell'ombra, marca a uomo e intercetta le linee di passaggio.",
      opp: [{ name: "Banda dei Bastioni '54", color: "#475569", style: "pressing" }, { name: "Tirapiedi della Lucciola", color: "#581c87", style: "contropiede" }],
      boss: { name: "I Diavoli dell'Ombra '54", color: "#0f172a", style: "difensiva" },
      opts: (o, h, boss) => ({ title: `Pedinamento Tattico · contro ${o.name}`, us: "Il Campione del '54", usColor: "#334155", hero: { name: h.name || "Tu" }, opp: o }) },
    { id: "rebound", t: "Calcio a Parete · Rebound Heist", e: "⛓️", saga: "alcatraz", eng: "__alcatrazMatch", d: "3 contro 3 tra le sbarre e le sponde metalliche del penitenziario, con fari di ronda e tiri a rimbalzo.",
      opp: [{ name: "Detenuti del Braccio Est", color: "#f59e0b", style: "pressing" }, { name: "Squadra dei Magazzini", color: "#64748b", style: "contropiede" }],
      boss: { name: "I Custodi del Direttore", color: "#0f172a", style: "difensiva" },
      opts: (o, h, boss) => ({ title: `Calcio a Parete · contro ${o.name}`, teamA: "Braccio Ovest", opp: o.name, colA: "#38bdf8", colB: o.color }) },
    { id: "anello", t: "L'Anello di Pietra · Pok-ta-pok", e: "☀️", saga: "piramide", eng: "__anello", d: "Il rito della palla di caucciù: 2 contro 2 nel campo cerimoniale, colpi d'anca e di ginocchio per infilare la sfera nell'anello di pietra in alto.",
      opp: [{ name: "Guardiani del Sole", color: "#ef4444", style: "pressing" }, { name: "Mercenari di Vargas", color: "#57534e", style: "contropiede" }],
      boss: { name: "Kukulkan e il Gran Sacerdote", color: "#b45309", style: "difensiva" },
      opts: (o, h, boss) => ({ title: `Pok-ta-pok · contro ${o.name}`, oppNames: [o.name, "Sacerdote"], mate: "Ixchel" }) },
    { id: "corridoio", t: "Il Corridoio d'Acciaio", e: "🚂", saga: "treno", eng: "__corridoio", d: "La sfida diplomatica nel vagone del Nord-Sud Star: rimbalzi sulle porte degli scompartimenti, scossoni delle curve e tiri a rimbalzo cieco.",
      opp: [{ name: "Infiltrati del Valico", color: "#64748b", style: "equilibrata" }, { name: "Sabotatori del Bagagliaio", color: "#78350f", style: "pressing" }],
      boss: { name: "La Rete delle Ombre", color: "#0f172a", style: "contropiede" },
      opts: (o, h, boss) => ({ homeTeam: "Agenti di Bordo", awayTeam: o.name, targetGoals: boss ? 3 : 2 }) },
    { id: "corrente", t: "Corrente & Rinvio", e: "🌊", saga: "fiume", eng: "__corrente", d: "La sfida sul pontile galleggiante di La Carovana del Fiume d'Argento: spinta vettoriale del fiume, beccheggio dell'asse e rinvii a vortice.",
      opp: [{ name: "Portuali di Roccabruna", color: "#0284c7", style: "equilibrata" }, { name: "Guardia del Dazio", color: "#dc2626", style: "pressing" }],
      boss: { name: "Campioni del Delta", color: "#f59e0b", style: "contropiede" },
      opts: (o, h, boss) => ({ opp: o.name }) },
    { id: "rottami", t: "Campo di Rottami", e: "🔩", saga: "cenere", eng: "__rottami", d: "Cinque tiri a testa su un campo di lamiere: fionda a molla per tirare, scudo di latta per parare, lamiere mobili e vento di sabbia.",
      opp: [{ name: "Saccheggiatori di Lamiera", color: "#7f1d1d", style: "pressing" }, { name: "Fedeli della Torre", color: "#78350f", style: "difensiva" }],
      boss: { name: "Il Predicatore delle Dune", color: "#b45309", style: "difensiva" },
      opts: (o, h, boss) => ({ title: `Campo di Rottami · contro ${o.name}`, oppNames: [o.name, "Squadra"], mate: "Tamburo" }) },
    { id: "schiere", t: "Schiere di Compagnia", e: "⚔️", saga: "capitani", eng: "__schiere", d: "Lo scontro a turni dei Capitani di Ventura: a ogni turno il nemico lancia 1 o 2 assalti su tre corsie. Assegna cinque compagni a difendere o ad attaccare, e tieni la linea.",
      opp: [{ name: "Banda del Guado", color: "#78350f", style: "equilibrata" }, { name: "Lanzichenecchi di Roccaferrea", color: "#7f1d1d", style: "pressing" }],
      boss: { name: "Il Lupo Grigio e la sua Compagnia", color: "#374151", style: "pressing" },
      opts: (o, h, boss) => ({ members: [{ id: "g", n: "Gemma", icon: "🎯", s: { tiro: 4, ingegno: 2 } }, { id: "b", n: "Brenno", icon: "🛡️", s: { forza: 4, cuore: 2 } }, { id: "p", n: "Piccarda", icon: "🪙", s: { tiro: 2, ingegno: 2, forza: 1 } }, { id: "t", n: "Tancredi", icon: "🗡️", s: { forza: 3, tiro: 2 } }, { id: "d", n: "Dario", icon: "🎶", s: { cuore: 4, ingegno: 2 } }], enemy: { name: o.name, icon: boss ? "🐺" : "⚔️", atk: boss ? [6, 0.7] : [4, 0.5], def: boss ? [7, 0.6] : [5, 0.5] }, rounds: boss ? 7 : 6 }) },
    { id: "lotta", t: "Lotta di Figure", e: "🃏", saga: "figurine", eng: "__lotta", d: "Tre figure contro tre sul triangolo dei tipi: aria batte campo, campo batte ombra, ombra batte aria. Mosse, cambi e usi limitati. Chi mette KO tutte le figure avversarie vince.",
      opp: [{ name: "Cacciatori del Prato", color: "#16a34a", style: "equilibrata" }, { name: "Retieri della Fabbrica", color: "#334155", style: "pressing" }],
      boss: { name: "Cora, Campionessa della Lega", color: "#0f766e", style: "pressing" },
      opts: (o, h, boss) => { const g = (id, l) => ({ id, n: id, icon: "🃏", type: "campo", hp: 22 + (l - 1) * 3, atk: 7, def: 4, lv: l }); const L = (id, n, icon, type, hp, atk, def, sp, l) => ({ id, n, icon, type, hp: hp + (l - 1) * 3, atk, def, lv: l, moves: [["Colpo", 6, 0], type === "cuore" ? ["Abbraccio", 0, 0, "heal"] : [sp, 8, 1]] });
        const lv = boss ? 4 : 3;
        return { title: `Lotta di Figure · contro ${o.name}`, team: [L("a", "Zolla", "🌱", "campo", 22, 7, 5, "Zolla Piena", 3), L("b", "Svolazzo", "🪁", "aria", 20, 8, 3, "Folata", 3), L("c", "Notturno", "🦇", "ombra", 21, 8, 4, "Velo di Notte", 3)],
          foe: boss ? [L("d", "Eclisse", "🌘", "ombra", 29, 10, 6, "Oscuramento", lv), L("e", "Cometa", "☄️", "aria", 28, 10, 4, "Coda Infuocata", lv), L("f", "Zollone", "🪨", "campo", 30, 9, 7, "Frana", lv)] : [L("d", "Raffica", "🌪️", "aria", 21, 9, 3, "Tromba d'Aria", lv - 1), L("e", "Muraglia", "🧱", "campo", 26, 6, 7, "Sbarramento", lv - 1), L("f", "Sipario", "🎭", "ombra", 22, 7, 5, "Calata di Tela", lv - 1)] }; } },
    { id: "steam", t: "Steam Strikers", e: "♨️", saga: "officina", eng: "__steam", d: "Calcio a vapore a turni: ferma la barra nella zona verde per tirare, Getto, Salto o Sfiato per difendere. Quattro cariche in comune, sopra il rosso la caldaia va in stallo.",
      opp: [{ name: "Apprendisti dell'Acciaio", color: "#52525b", style: "equilibrata" }, { name: "Squadra di Ferro", color: "#3f3f46", style: "pressing" }],
      boss: { name: "Il Titano", color: "#111827", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Steam Strikers · contro ${o.name}`, level: boss ? 3 : 2, oppName: o.name, mate: "Brontolo" }) },
    { id: "pingpong", t: "Ping-Pong da Salone", e: "🏓", saga: "gala", eng: "__pingpong", d: "Duello su un tavolo: mira la direzione, scegli l'effetto e la forza, e rispondi ai colpi dell'avversario. Si gioca a sette punti; il gettone d'oro e gli oggetti di inventario aiutano.",
      opp: [{ name: "Zeno Bassi", color: "#1d4ed8", style: "equilibrata" }, { name: "Il Presidente", color: "#7c2d12", style: "pressing" }],
      boss: { name: "Campione dei Delmonte", color: "#d4a73a", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Ping-Pong · contro ${o.name}`, level: boss ? 3 : 2, oppName: o.name }) },
    { id: "interrogatorio", t: "Interrogatorio", e: "🕵️", saga: "cavaliere", eng: "__interrogatorio", d: "Un sospettato, tre umori. Leggi come si sente (spavaldo, spaventato, sarcastico) e rispondi con la corda giusta: Calmo, Duro o Ironico. Fai salire la Verità prima che i Nervi esplodano. Il Timore e gli oggetti aiutano.",
      opp: [{ name: "Zeppa", color: "#44403c", style: "equilibrata" }, { name: "Dottor Spillo", color: "#9ca3af", style: "equilibrata" }],
      boss: { name: "Il Pierrot Bianco", color: "#f8fafc", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Interrogatorio · ${o.name}`, level: boss ? 3 : 2, oppName: o.name }) },
    { id: "catena", t: "Catena d'attacco", e: "⛓️", saga: "mondiale", eng: "__catena", d: "Tre passaggi e un tiro, a tempo. Linea verde = passaggio libero: tocca il compagno, poi tira nell'angolo dove il portiere non è. Le sinergie di ruolo allargano la linea; senza intercetti la catena è perfetta.",
      opp: [{ name: "Squadra B", color: "#7c2d12", style: "equilibrata" }, { name: "Difesa a Quattro", color: "#111827", style: "pressing" }],
      boss: { name: "Giappone U16", color: "#dc2626", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Catena · contro ${o.name}`, level: boss ? 3 : 2, oppName: o.name, roles: { jolly: "⭐ Fantasista", regista: "🎯 Regista", ala: "💨 Ala", punta: "🔥 Punta" }, syn: (a, b) => (a === "jolly" || b === "jolly" ? 1 : ({ "regista>ala": 2, "ala>punta": 2, "regista>punta": 1 })[a + ">" + b] || 0), team: [{ id: "hero", n: "Campione", icon: "⭐", rk: "jolly" }, { id: "a", n: "Elio", icon: "🎯", rk: "regista" }, { id: "b", n: "Nina", icon: "💨", rk: "ala" }, { id: "c", n: "Bruno", icon: "🔥", rk: "punta" }] }) },
    { id: "inf", t: "Infiltrazione", e: "📦", saga: "vuota", eng: "__inf", d: "Rompicapo a turni sulla griglia: muovi, aspetta, infilati nella scatola o lancia una moneta. Le guardie girano a schema, il loro cono è lo schema: passa dove non guardano e raggiungi l'uscita. Meno turni, più stelle.",
      opp: [{ name: "Pattuglia del Molo", color: "#64748b", style: "equilibrata" }, { name: "Turno di Notte", color: "#1e293b", style: "pressing" }],
      boss: { name: "Il Bastione", color: "#facc15", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Infiltrazione · ${o.name}`, level: boss ? 8 : o.name === "Turno di Notte" ? 5 : 2, oppName: o.name }) },
    { id: "emp", t: "Circuito EMP", e: "⚡", saga: "circuiti", eng: "__emp", d: "Una sfera conduttrice su una pista a nodi: mira l'angolo, scegli la potenza, fai rimbalzare la sfera sui nodi per caricarla. A 60% scatta l'EMP che stordisce cyborg e portiere. Laser, polarità e cyborg sulla rotaia: segna i gol richiesti con i tiri che hai.",
      opp: [{ name: "Cyborg Clandestini", color: "#7c3aed", style: "equilibrata" }, { name: "Divisione Beta", color: "#0891b2", style: "pressing" }],
      boss: { name: "Z-Zero", color: "#38bdf8", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Circuito EMP · contro ${o.name}`, level: boss ? 3 : 2, oppName: o.name }) },
    { id: "sparring", t: "Sparring Volante", e: "🦸", saga: "replica", eng: "__sparring", d: "Duello nel cielo: la corsia rossa è dove colpisce l'avversario, spostati di corsia, accumuli carica a ogni schivata e poi scegli dove colpire. L'avversario può parare una corsia.",
      opp: [{ name: "Basalto", color: "#44403c", style: "equilibrata" }, { name: "Nube", color: "#6d28d9", style: "pressing" }],
      boss: { name: "Zenit", color: "#1d4ed8", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Sparring Volante · contro ${o.name}`, level: boss ? 3 : 2, oppName: o.name, hp: 0 }) },
    { id: "zonarossa", t: "Zona Rossa", e: "🔴", saga: "quattordici", eng: "__zonarossa", d: "Due contro due su un campo che si restringe: dopo dieci secondi le fasce rosse avanzano dai bordi e chi ci resta perde fiato fino al KO. Tre gol o un minuto; il pari è una sconfitta.",
      opp: [{ name: "Fenicotteri di Marina", color: "#db2777", style: "pressing" }, { name: "Gufi di Tesla", color: "#6366f1", style: "equilibrata" }],
      boss: { name: "Corvi di Rigel", color: "#18181b", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Zona Rossa · contro ${o.name}`, oppNames: [o.name, "Squadra"], mate: "Ilse" }) },
    { id: "roulette", t: "Tavolo da Gioco & Tiri a Effetto", e: "🎲", saga: "spia", eng: "__spiaMatch", d: "La sfida sul panno verde del Casinò Royale: difensori-fiches, gettoni rimbalzanti, raggi laser mobili di sorveglianza e tiri a effetto carambola.",
      opp: [{ name: "I Croupier di Montegol", color: "#10b981", style: "equilibrata" }, { name: "I Cecchini delle Nevi", color: "#0284c7", style: "contropiede" }],
      boss: { name: "I Sicari del Barone von Kalt", color: "#e11d48", style: "pressing" },
      opts: (o, h, boss) => ({ opp: o.name, us: h.name, turns: boss ? 7 : 6, targetGoals: boss ? 3 : 2 }) },
    { id: "caveau", t: "Laser & Rimbalzo", e: "🚨", saga: "fortino", eng: "__fortinoMatch", d: "La sfida nei sotterranei del Fortino Metropolitano: calibra l'angolo e la potenza di tiro, sfrutta i prismi a specchio rotanti ed evita i fasci laser per disattivare i nodi del caveau.",
      opp: [{ name: "Pattuglia Condotti B", color: "#38bdf8", style: "equilibrata" }, { name: "Sentinelle del Livello -2", color: "#facc15", style: "difensiva" }],
      boss: { name: "Guardia d'Élite del Presidente", color: "#ef4444", style: "pressing" },
      opts: (o, h, boss) => ({ opp: o.name, us: h.name, turns: boss ? 7 : 6, targetGoals: boss ? 3 : 2 }) },
    { id: "quaderno", t: "Tactics Note", e: "📓", saga: "note", eng: "__quaderno", d: "La sfida a mente aperta tra Raito ed Elle: lavagna di deduzione in tempo reale con contromosse a tempo in 40 secondi.",
      opp: [{ name: "I Rivali di Shibuya", color: "#3b82f6", style: "pressing" }, { name: "Squadra Speciale Investigativa", color: "#64748b", style: "contropiede" }],
      boss: { name: "Undici del Nuovo Mondo", color: "#ef4444", style: "difensiva" },
      opts: (o, h, boss) => ({ opp: o.name, us: h.name, hero: { name: h.name || "Tu" } }) },
    { id: "runa", t: "Traccia-Runa", e: "✨", saga: "sigilli", eng: "__runaMatch", d: "La sfida magica dell'Accademia dei Sigilli: traccia le antiche rune col dito o mouse entro il tempo limite per scatenare parabole d'effetto, barriere di specchi ed incantesimi balistici.",
      opp: [{ name: "Apprendisti del Vento", color: "#6366f1", style: "equilibrata" }, { name: "I Guardiani di Gesso", color: "#a855f7", style: "difensiva" }],
      boss: { name: "I Maestri della Congiunzione", color: "#fbbf24", style: "pressing" },
      opts: (o, h, boss) => ({ opp: o.name, us: h.name, turns: boss ? 6 : 5 }) },
    { id: "argine", t: "Argine", e: "🌊", saga: "diga", eng: "__argine", d: "L'acqua scende dalle falle e scivola lungo le file di sacchi che trascini con il dito: guidala via dalle case, tieni il tetto asciutto, ripara con la pompa. Meno danni, più stelle.",
      opp: [{ name: "Pioggia Battente", color: "#0e7490", style: "equilibrata" }, { name: "Piena Notturna", color: "#1e3a5f", style: "pressing" }],
      boss: { name: "La Notte della Cresta", color: "#38bdf8", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Argine · ${o.name}`, level: boss ? 6 : o.name === "Piena Notturna" ? 4 : 2, oppName: o.name }) },
    { id: "pausa", t: "Squadra in Pausa", e: "⏸", saga: "missione", eng: "__pausa", d: "Tempo reale con pausa tattica: tocchi un nemico per calciargli un pallone, tocchi il terreno per spostarti, e con «⏸ Ruota» fermi tutto e scegli il potere di un compagno. Difendi la barricata a ondate.",
      opp: [{ name: "Le bande di Omega", color: "#7c2d12", style: "pressing" }, { name: "Gli automi dell'Isola Bianca", color: "#6b7280", style: "difensiva" }],
      boss: { name: "Il Gigante del Passo", color: "#facc15", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Squadra in Pausa · ${o.name}`, arena: boss ? "tana" : o.name === "Le bande di Omega" ? "ponte" : "sale", bonus: 1,
        mates: [{ id: "ms_miranda", n: "Miranda", icon: "🕸️", pow: "rete" }, { id: "ms_zero", n: "Zero", icon: "💥", pow: "onda" }],
        waves: boss ? [[["base", 6]], [["lesto", 4], ["scudo", 2]], [["grosso", 2], ["base", 4]], [["boss", 1], ["lesto", 3]]] : o.name === "Le bande di Omega" ? [[["lesto", 4]], [["base", 4], ["scudo", 1]], [["grosso", 1], ["lesto", 3]]] : [[["base", 5]], [["scudo", 3], ["base", 2]], [["grosso", 2], ["base", 3]]] }) },
    { id: "scorri", t: "A scorrimento", e: "🏰", saga: "latta", eng: "__scorri", d: "Platform a scorrimento in pixel art: sei Ferro, l'armatura del 1527. Salti, calci il pallone di latta contro i nemici (di sponda fa doppio danno) e lo usi come molla. Mura, tetti, cripta buia e torre nella tempesta.",
      opp: [{ name: "Le Mura del Palio", lv: "mura", color: "#b45309", style: "pressing" }, { name: "I tetti del Borgo", lv: "tetti", color: "#6a3030", style: "contropiede" }, { name: "La cripta delle campane", lv: "cripta", color: "#4c1d95", style: "difensiva" }, { name: "La torre nella tempesta", lv: "torre", color: "#334155", style: "pressing" }],
      boss: { name: "Il Conestabile", lv: "spalti", color: "#111827", style: "pressing" },
      opts: (o, h, boss) => { const LV = window.__lattaLV || {}, id = o.lv || "mura"; return { title: `A scorrimento · ${o.name}`, level: Object.assign({ id }, LV[id] || {}), bonus: 1, tutorial: false }; } },
    { id: "guardiano", t: "Il Guardiano di Neve", e: "🧤", saga: "neve", eng: "__scorri", d: "Platform a scorrimento coi guanti da portiere: pari le palle di neve e le rimandi indietro, plani sui crepacci, scappi dalla valanga e sali in slitta con lo yeti fino alla vetta.",
      opp: [{ name: "Il canalone delle valanghe", lv: "canalone", color: "#7dd3fc", style: "pressing" }, { name: "La valanga", lv: "valanga", color: "#e0f2fe", style: "contropiede" }, { name: "I seracchi del ghiacciaio", lv: "seracchi", color: "#38bdf8", style: "difensiva" }, { name: "La slitta di Fiocco", lv: "slitta", color: "#d23a3a", style: "pressing" }],
      boss: { name: "La Regina del Gelo", lv: "vetta", color: "#f0abfc", style: "pressing" },
      opts: (o, h, boss) => { const LV = window.__neveLV || {}, id = o.lv || "canalone"; return { title: `Il Guardiano di Neve · ${o.name}`, level: Object.assign({ id, kit: "guanti" }, LV[id] || {}), bonus: 1, tutorial: false }; } },
    { id: "urto", t: "Onde d'Urto '77", e: "📻", saga: "onde", eng: "__urto", d: "Calcio ritmico-acustico su 3 bande MHz: cambia frequenza per bucare i coni di fruscio statico e calcia sul battito del 45 giri per scatenare l'Onda d'Urto.",
      opp: [{ name: "Guardiani del Cantiere", color: "#475569", style: "difensiva" }, { name: "G.S. Poste & Telegrafi", color: "#eab308", style: "equilibrata" }],
      boss: { name: "Specchio Sporting Club", color: "#38bdf8", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Onde d'Urto · ${o.name}`, opp: o.name, oppColor: o.color, oppStyle: o.style, us: (h && h.name) || "Radio 99.9", venue: boss ? "stadio" : o.name.includes("Poste") ? "cortile" : "carbone", track: boss ? "finale" : "rock", staticCount: boss ? 4 : o.name.includes("Poste") ? 3 : 2, halfSec: 22 }) },
    { id: "ritmo", t: "Ritmo", e: "🥁", saga: "banda", eng: "__ritmo", d: "Brani a tempo con la banda di Borgo Marino: tocchi grancassa, rullante, piatti e ottoni quando la nota arriva sul cerchio. Concerti, sfilate col passo e duelli contro l'altoparlante.",
      opp: [{ name: "La Marcia d'ingresso", song: "ingresso", venue: "sala", color: "#7f1d1d", style: "equilibrata" }, { name: "Sotto la pioggia", song: "pioggia", mode: "sfilata", venue: "pioggia", color: "#1e40af", style: "contropiede" }, { name: "Il derby contro la cassa", song: "derby", mode: "duello", venue: "stadio", color: "#0ea5e9", style: "pressing" }, { name: "La tarantella del molo", song: "tarantella", venue: "piazza", color: "#b45309", style: "pressing" }],
      boss: { name: "La Marcia della Rondine", song: "rondine", venue: "venezia", color: "#facc15", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Ritmo · ${o.name}`, song: o.song || "ingresso", mode: o.mode || "concerto", venue: o.venue, need: boss ? 0.7 : 0.6, bonus: 1, tutorial: false, mates: [{ id: "bp_rocco", n: "Rocco" }, { id: "bp_lilli", n: "Lilli" }, { id: "bp_ciro", n: "Zio Ciro" }] }) },
    { id: "notte", t: "La Porta del villaggio", e: "🏯", saga: "sasso", eng: "__notte", d: "L'Ultima Notte di Sasso Nero: quattro porte, un granaio e i predoni a ondate. Corri dove serve, il Campione calcia da solo; le porte reggono con palizzate, fossati, trappole e chi le difende.",
      opp: [{ name: "Gli esploratori", color: "#78716c", style: "equilibrata", waves: [[["base", 4, "n"], ["lesto", 2, "o"]], [["lesto", 3], ["base", 3]]] }, { name: "La notte dei cavalieri", color: "#a16207", style: "contropiede", waves: [[["lesto", 5]], [["lesto", 4], ["base", 4]], [["capo", 1], ["lesto", 4]]] }, { name: "Gli scudi al ponte", color: "#57534e", style: "difensiva", waves: [[["scudo", 3, "e"], ["base", 4]], [["scudo", 4], ["base", 5]], [["capo", 1], ["scudo", 3]]] }],
      boss: { name: "Corvo Rosso sotto la pioggia", color: "#991b1b", style: "pressing", rain: true, waves: [[["base", 6], ["lesto", 4]], [["scudo", 4], ["base", 5]], [["capo", 2], ["lesto", 4]], [["corvo", 1, "n"], ["base", 6], ["scudo", 3]]] },
      opts: (o, h, boss) => ({ title: `La Porta del villaggio · ${o.name}`, granaio: 24, rain: !!o.rain, boss, tutorial: false, waves: o.waves,
        gates: { n: { def: 1, tower: true, who: { id: "sn_kiku", n: "Kiku", pow: "arco" } }, e: { ditch: true, who: { id: "sn_okuma", n: "Okuma", pow: "muro" } }, s: { def: 1, who: { id: "sn_shino", n: "Shino", pow: "cura" } }, o: { trap: 1, who: { id: "sn_hayate", n: "Hayate", pow: "lama" } } } }) },
    { id: "assedio", t: "Notte in Curva", e: "🧟", saga: "tifosi", eng: "__assedio", d: "L'Assedio a ondate della Notte dei Tifosi Morti: corri, il Campione calcia da solo, a ogni livello scegli un potere fra tre. Resisti fino al capo, coi compagni del Gruppo e i loro poteri.",
      opp: [{ name: "Il campo nella nebbia", arena: "campo", mix: ["tifoso", "corridore"], boss: "tamburo", color: "#6d28d9", style: "equilibrata" }, { name: "La tribuna stampa", arena: "tribuna", mix: ["tifoso", "corridore", "lanciatore"], boss: "megafono", color: "#1f5fbf", style: "contropiede" }, { name: "La curva ospite", arena: "curva", mix: ["tifoso", "panzone", "tamburino", "lanciatore"], boss: "ringhio", color: "#facc15", style: "pressing" }],
      boss: { name: "L'alba nel parcheggio", arena: "parcheggio", mix: ["tifoso", "corridore", "panzone", "tamburino", "lanciatore"], boss: "mascotte", color: "#a16207", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Notte in Curva · ${o.name}`, arena: o.arena, time: boss ? 150 : 100, mix: o.mix, boss: o.boss, tutorial: false, bestKey: "sala_assedio",
        allies: [{ id: "zt_tonino", n: "Tonino", pow: "bomber" }, { id: "zt_nadia", n: "Nadia", pow: "cura" }, { id: "zt_gaspare", n: "Gaspare", pow: "scopa" }] }) },
    { id: "moviola", t: "Moviola '84", e: "📼", saga: "moviola", eng: "__moviolaArcade", d: "La moviola a tubo catodico di Tele-Rondine: scrubber, replay al rallentatore estremo e fermo immagine sul rigore fantasma del 94°.",
      opp: [{ name: "Rondine Primavera", level: 1, color: "#f97316", style: "equilibrata" }, { name: "Derby Regionale", level: 2, color: "#3b82f6", style: "pressing" }],
      boss: { name: "Coppa dei Campioni", level: 3, color: "#eab308", style: "pressing" },
      opts: (o, h, boss) => ({ level: boss ? 3 : o.level || 1, diff: boss ? 3 : o.level || 1, title: `Moviola '84 · ${o.name}` }) },
    { id: "banco", t: "Il Banco del Falsario", e: "⚖️", saga: "falsari", eng: "__falsariBanco", d: "La bottega d'orefice di Arturo e mastro Tullio: calco in cera, dosaggio della lega al milligrammo e bilanciatura per superare la prova del peso.",
      opp: [{ name: "Medaglia d'Argento 1950", level: 1, color: "#94a3b8", style: "equilibrata" }, { name: "Calice d'Ottone Navale", level: 2, color: "#d97706", style: "pressing" }],
      boss: { name: "La Coppa d'Oro 1934", level: 3, color: "#fbbf24", style: "pressing" },
      opts: (o, h, boss) => ({ mode: boss ? "bilancia" : "lega", targetPurezza: boss ? 85 : 75, targetPeso: boss ? 1840 : 1200, title: `Banco del Falsario · ${o.name}` }) },
    { id: "burattini", t: "Calcio a Fili '74", e: "🎭", saga: "burattini", eng: "__burattiniPartita", d: "La partita a fili della Giostra dei Burattini: inclina il bilancino col pad, colpisci di punta con A, stacca di testa o mura con B ed evita di annodare i refe.",
      opp: [{ name: "Gervaso lo Sghembo", color: "#b45309", style: "pressing" }, { name: "I Burattini dei Mercanti", color: "#15803d", style: "difensiva" }],
      boss: { name: "I Burattini Ducali d'Ebano", color: "#881337", style: "pressing" },
      opts: (o, h, boss) => ({ title: `Calcio a Fili · ${o.name}`, opp: o.name, half: boss ? 45 : 30, boss: !!boss }) },
  ];
  function sgState(m) { const s = SAGAS.find((x) => x.id === m.saga), x = s ? state(s) : null; return { s, open: !!(x && (x.doneN >= 1)), boss: !!(x && x.endsFound > 0) }; }
  function openSalaGiochi(back) {
    if (back) BK.sg = back; BACK = BK.sg; const body = shell("🕹️ Sala Giochi"), r = sgRec(), D = window.__sagaCore && window.__sagaCore.DIFFS;
    let html = `<p class="sum">I motori di partita originali delle saghe, da giocare liberi. Finisci il primo capitolo di una saga per accendere il suo cabinato; finisci la saga per sfidare il suo boss.</p>`;
    html += `<div class="row">${["storia", "normale", "sfida"].map((k) => `<button type="button" class="chip${r.diff === k ? " on" : ""}" data-diff="${k}">${D && D[k] ? D[k].label : k}</button>`).join("")}</div>`;
    html += MACHINES.map((m) => { const st = sgState(m), w = r.w[m.id] || 0, p = r.p[m.id] || 0;
      return `<div class="psec${st.boss ? " gold" : ""}" data-m="${m.id}"><div class="pe">${st.open ? m.e : "🔒"}</div><div><b>${esc(m.t)}</b><span>${st.open ? esc(m.d) : `Si accende finendo il primo capitolo di «${esc(st.s ? st.s.t : m.saga)}».`}</span></div><div class="n">${st.open ? `${w}/${p}` : ""}</div></div>`; }).join("");
    html += `<div class="sec">Sfide libere · i minigiochi delle saghe<span>solo record</span></div><p class="sum">Le prove a tempismo e i rompicapo di Vallombra, in versione breve e senza premi: contano solo i record. Si accendono quando incontri la prova nella saga.</p>`;
    html += SGC.map((c) => { const op = sgcSeen(c), b = ((r.c || {})[c.id] || {}).best;
      return `<div class="psec" data-c="${c.id}"><div class="pe">${op ? c.e : "🔒"}</div><div><b>${op ? esc(c.t) : "Prova di Vallombra"}</b><span>${op ? esc(c.d) : "Ancora da incontrare nella saga."}</span></div><div class="n">${op && b != null ? esc(c.unit(b)) : ""}</div></div>`; }).join("");
    body.innerHTML = html;
    body.querySelectorAll("[data-diff]").forEach((b) => (b.onclick = () => { const r2 = sgRec(); r2.diff = b.dataset.diff; sgSave(r2); openSalaGiochi(); }));
    body.querySelectorAll("[data-m]").forEach((b) => (b.onclick = () => { const m = MACHINES.find((x) => x.id === b.dataset.m); if (sgState(m).open) sgMachine(m); }));
    body.querySelectorAll("[data-c]").forEach((b) => (b.onclick = () => { const c = SGC.find((x) => x.id === b.dataset.c); if (c && sgcSeen(c)) sgcPlay(c); }));
  }
  function sgMachine(m) {
    const body = shell(`${m.e} ${m.t}`), st = sgState(m), list = m.opp.map((o, i) => ({ o, i, boss: false })).concat(st.boss ? [{ o: m.boss, i: 9, boss: true }] : []);
    let html = `<p class="sum">${esc(m.d)}</p><div class="sec">Scegli l'avversario</div>`;
    html += list.map(({ o, i, boss }) => `<div class="psec${boss ? " gold" : ""}" data-o="${i}"><div class="pe">${boss ? "👑" : "⚽"}</div><div><b>${esc(o.name)}</b><span>${boss ? "La sfida del boss della saga" : `Carattere: ${esc(o.style || "equilibrata")}`}${o.oppPower ? ` · contro-potere: ${esc(o.oppPower)}` : ""}</span></div><div class="n">▶</div></div>`).join("");
    if (!st.boss) html += `<p class="sum">👑 Il boss si sblocca finendo la saga «${esc(st.s ? st.s.t : "")}».</p>`;
    if (m.power) html += `<div class="sec">Il tuo potere</div><div class="row">${["fulmine", "gigante", "calamita", "gelo", "doppio"].map((k, j) => `<button type="button" class="chip${j === 0 ? " on" : ""}" data-pw="${k}">${k}</button>`).join("")}</div>`;
    const cups = (sgRec().cup || {})[m.id] || 0;
    html += `<div class="big"><button type="button" data-cup="1">🏆 Torneo a eliminazione<small>Quarti, semifinale e finale di fila · coppe vinte: ${cups}</small></button><button type="button" data-back="1">◂ Torna alla Sala Giochi<small>Tutti i cabinati</small></button></div>`;
    body.innerHTML = html; let pw = "fulmine";
    body.querySelector("[data-cup]").onclick = () => sgCup(m, pw);
    body.querySelectorAll("[data-pw]").forEach((b) => (b.onclick = () => { pw = b.dataset.pw; body.querySelectorAll("[data-pw]").forEach((x) => x.classList.toggle("on", x === b)); }));
    body.querySelector("[data-back]").onclick = () => openSalaGiochi();
    body.querySelectorAll("[data-o]").forEach((b) => (b.onclick = () => { const it = list.find((x) => String(x.i) === b.dataset.o); sgPlay(m, it.o, it.boss, pw); }));
  }
  function sgPlay(m, o, boss, pw, after) {
    const eng = window[m.eng], C = window.__sagaCore, r = sgRec(); if (!eng || !eng.start) return;
    close(); if (C && C.setCur) C.setCur(boss && r.diff === "storia" ? "normale" : r.diff, o.style);
    const opts = Object.assign(m.opts(o, heroLook(), boss, pw), { oppStyle: o.style, heroLook: heroLook(), winTitle: boss ? "BOSS SCONFITTO!" : "VITTORIA!", onDone: (res) => { const r2 = sgRec(); r2.p[m.id] = (r2.p[m.id] || 0) + 1; if (res.win) r2.w[m.id] = (r2.w[m.id] || 0) + 1; if (boss && res.win) r2.boss = Object.assign(r2.boss || {}, { [m.id]: 1 }); sgSave(r2); if (after) after(res); else sgMachine(m); } });
    const ok = safe(() => eng.start(opts), false); if (ok === false) { if (C && C.endMatch) C.endMatch(); sgMachine(m); }
  }
  // TORNEO A ELIMINAZIONE: otto squadre, tre turni. Le altre partite del tabellone si giocano «da sole» (a sorte).
  function sgCup(m, pw) {
    const st = sgState(m), pool = (m.cup || m.opp.map((o) => o.name).concat(["I Ragazzi del Molo", "La Banda del Faro", "Gli Ultimi Arrivati", "Le Riserve d'Oro"])).slice();
    const finalOpp = st.boss ? m.boss : Object.assign({}, m.opp[m.opp.length - 1], { style: "pressing" }), named = (n) => m.opp.find((o) => o.name === n) || (m.boss.name === n ? m.boss : null);
    const shuffle = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
    const others = shuffle(pool.filter((n) => n !== finalOpp.name)).slice(0, 6); while (others.length < 6) others.push(["La Squadra Misteriosa", "Gli Ultimi Arrivati", "Le Riserve d'Oro", "I Ragazzi del Molo", "La Banda del Faro", "Il Real Nebbia"][others.length]); const teams = ["Tu", ...others, finalOpp.name]; // il favorito sta dall'altra parte del tabellone
    const T = { m, pw, round: 0, teams, res: [[], [], []], alive: teams.slice() };
    const mk = (name, k) => { const base = named(name) || Object.assign({}, m.opp[k % m.opp.length]); return Object.assign({}, base, { name, style: k === 2 ? "pressing" : base.style || "equilibrata" }); };
    const step = () => {
      const r = T.round; if (r > 2) return;
      const pairs = []; for (let i = 0; i < T.alive.length; i += 2) pairs.push([T.alive[i], T.alive[i + 1]]);
      const mine = pairs.find((p) => p.includes("Tu")), opp = mine[0] === "Tu" ? mine[1] : mine[0];
      cupBoard(T, `${["Quarti di finale", "Semifinale", "FINALE"][r]}: Tu contro ${opp}`, "Gioca ▸", () => {
        sgPlay(m, mk(opp, r === 2 ? 2 : r), r === 2 && st.boss, pw, (res) => {
          const next = []; pairs.forEach(([a, b]) => { const w = [a, b].includes("Tu") ? (res.win ? "Tu" : (a === "Tu" ? b : a)) : a === finalOpp.name ? a : b === finalOpp.name ? b : Math.random() < 0.5 ? a : b; next.push(w); T.res[r].push([a, b, w]); });
          T.alive = next; T.round++;
          if (!res.win) return cupBoard(T, `Eliminato ${["ai quarti", "in semifinale", "in finale"][r]}. Il torneo continua senza di te: vince ${T.alive.length === 1 ? T.alive[0] : "chi lo merita"}.`, "◂ Torna al cabinato", () => sgMachine(m));
          if (T.round > 2) { const r2 = sgRec(); r2.cup = Object.assign(r2.cup || {}, { [m.id]: ((r2.cup || {})[m.id] || 0) + 1 }); sgSave(r2); return cupBoard(T, "🏆 HAI VINTO IL TORNEO!", "◂ Torna al cabinato", () => sgMachine(m)); }
          step();
        });
      });
    };
    step();
  }
  function cupBoard(T, title, btn, fn) {
    const body = shell(`🏆 Torneo · ${T.m.t}`), row = (a, b, w) => `<div style="display:flex;justify-content:space-between;gap:6px;padding:4px 8px;border-bottom:1px dashed #ffffff22"><span style="${w ? (w === a ? "color:#ffd23f;font-weight:800" : "opacity:.45;text-decoration:line-through") : ""}">${esc(a)}</span><span style="opacity:.5">vs</span><span style="${w ? (w === b ? "color:#ffd23f;font-weight:800" : "opacity:.45;text-decoration:line-through") : ""}">${esc(b)}</span></div>`;
    let html = `<p class="sum"><b>${esc(title)}</b></p>`;
    const qs = []; for (let i = 0; i < 8; i += 2) qs.push([T.teams[i], T.teams[i + 1]]);
    html += `<div class="sec">Quarti</div>` + qs.map(([a, b]) => { const r = T.res[0].find((x) => x[0] === a); return row(a, b, r && r[2]); }).join("");
    if (T.round >= 1) html += `<div class="sec">Semifinali</div>` + (T.res[1].length ? T.res[1].map((x) => row(...x)).join("") : [0, 2].map((i) => row(T.alive[i] || "?", T.alive[i + 1] || "?")).join(""));
    if (T.round >= 2) html += `<div class="sec">Finale</div>` + (T.res[2].length ? T.res[2].map((x) => row(...x)).join("") : row(T.alive[0] || "?", T.alive[1] || "?"));
    html += `<div class="big"><button type="button" data-go="1">${esc(btn)}<small>${esc(T.m.t)}</small></button></div>`;
    body.innerHTML = html; body.querySelector("[data-go]").onclick = fn;
  }
  // ---------------------------------------------------------------- SFIDE LIBERE (minigiochi delle saghe)
  // I minigiochi autonomi delle saghe, rigiocabili a piacere in versione breve: solo record personale, nessun premio e nessun bonus
  // alle partite. Si accendono quando la prova è stata incontrata nella saga (o il suo capitolo è concluso). Salvataggio: sgRec().c = { id: { best, n } }.
  const VLK = "ali-di-rondine.storia-campione";
  const sgcSeen = (c) => {
    const inf = safe(() => window.__storiaCampione.info(), null), dn = (inf && inf.done) || {};
    const fl = safe(() => JSON.parse(localStorage.getItem(VLK) || "{}").flags, null) || {};
    return !!dn[c.chap] || c.flags.some((k) => fl[k]);
  };
  function sgcCss() {
    if (document.getElementById("sgcStyle")) return;
    const st = document.createElement("style"); st.id = "sgcStyle";
    st.textContent = `.salOv .sgcTrack{position:relative;height:50px;border-radius:12px;background:#0b1026;border:2px solid #ffffff33;overflow:hidden;margin:14px 0}
.salOv .sgcZ{position:absolute;top:0;bottom:0;background:#2f9e55aa}.salOv .sgcP{position:absolute;top:0;bottom:0;background:#ffd23f}
.salOv .sgcM{position:absolute;top:5px;bottom:5px;width:6px;margin-left:-3px;border-radius:3px;background:#fff;box-shadow:0 0 10px #fff}
.salOv .sgcGo{width:100%;min-height:64px;border-radius:16px;border:2px solid #ffd23f;background:linear-gradient(#ffd23f,#e8a33d);color:#1a1400;font:900 20px "M PLUS Rounded 1c",sans-serif;cursor:pointer;touch-action:manipulation}
.salOv .sgcGo:disabled{opacity:.45}.salOv .sgcLine{min-height:44px;margin:12px 0;font-size:14px;line-height:1.4;color:#e8ecf7;text-align:center}
.salOv .sgcDots{display:flex;justify-content:center;gap:8px;font-size:22px;min-height:30px}
.salOv .sgcDial{display:block;margin:6px auto;width:min(240px,70vw);height:auto}
.salOv .sgcRow{display:flex;gap:10px;justify-content:center;margin:12px 0}
.salOv .sgcBtn{flex:1;min-height:64px;max-width:150px;border-radius:14px;border:2px solid #ffffff55;background:#16294a;color:#fff;font:800 14px "M PLUS Rounded 1c",sans-serif;cursor:pointer;padding:4px;touch-action:manipulation}
.salOv .sgcBtn.on{background:linear-gradient(#7af0ff,#2a9ac8);color:#06222c;border-color:#bff6ff;box-shadow:0 0 14px #5fe0f0}
.salOv .sgcBtn span{display:block;font-size:26px}
.salOv .sgcSeq{font:900 30px/1.3 sans-serif;letter-spacing:6px;text-align:center;min-height:40px;color:#ffd23f}
.salOv .sgcHist{font-size:13px;color:#c9d2ea;margin:8px 0;line-height:1.6}
.salOv .sgcBig{font:900 40px "Dela Gothic One",Impact,sans-serif;color:#ffd23f;text-align:center;margin:10px 0 0}`;
    document.head.appendChild(st);
  }
  const sgcBeep = (seq) => {
    try {
      const A = new (window.AudioContext || window.webkitAudioContext)(); let t = A.currentTime + 0.05;
      seq.forEach((v) => { const o = A.createOscillator(), g = A.createGain(); o.type = "triangle"; o.frequency.value = 1500; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.08, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + (v ? 0.38 : 0.14)); o.connect(g); g.connect(A.destination); o.start(t); o.stop(t + (v ? 0.4 : 0.16)); t += v ? 0.55 : 0.3; });
      setTimeout(() => safe(() => A.close(), 0), 3000);
    } catch (e) { /* senza audio si gioca lo stesso */ }
  };
  // Il tempismo: una barra (o una ghiera) con la zona verde e il centro oro. Come il tempismo di Vallombra: centro = 3, zona = 2, fuori = 1.
  function sgcTiming(body, o) {
    const pts = []; let i = 0, raf = 0, t0 = 0, stopped = false, Z = { lo: 0, w: 0.2 }, pos = 0;
    const root = document.createElement("div"); body.appendChild(root);
    const dial = o.kind === "dial", R = 52, C = 60;
    const arc = (a0, a1) => { const p = (a) => [C + R * Math.sin(a * 6.2832), C - R * Math.cos(a * 6.2832)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 ${a1 - a0 > 0.5 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
    function round() {
      stopped = false; const w = o.zone[i], lo = 0.08 + Math.random() * (0.84 - w); Z = { lo, w };
      const pz = o.pz || 0.025, dots = pts.map((n) => (n === 3 ? "⭐" : n === 2 ? "✔️" : "✖️")).join("") + "⚪".repeat(o.rounds - pts.length);
      root.innerHTML = `<div class="sgcDots">${dots}</div><p class="sum" style="text-align:center">${esc(o.label)} · prova ${i + 1} di ${o.rounds}</p>` + (dial
        ? `<svg class="sgcDial" viewBox="0 0 120 120"><circle cx="60" cy="60" r="${R + 6}" fill="#0b1026" stroke="#ffffff33" stroke-width="2"/><path d="${arc(lo, lo + w)}" fill="none" stroke="#2f9e55" stroke-width="12"/><path d="${arc(lo + w / 2 - pz, lo + w / 2 + pz)}" fill="none" stroke="#ffd23f" stroke-width="12"/><line class="nd" x1="60" y1="60" x2="60" y2="12" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="60" r="6" fill="#fff"/></svg>`
        : `<div class="sgcTrack"><i class="sgcZ" style="left:${lo * 100}%;width:${w * 100}%"></i><i class="sgcP" style="left:${(lo + w / 2 - pz) * 100}%;width:${pz * 200}%"></i><i class="sgcM"></i></div>`)
        + `<div class="sgcLine">${esc(o.hint)}</div><button type="button" class="sgcGo">${esc(o.btn || "ORA!")}</button>`;
      t0 = performance.now(); const m = root.querySelector(".sgcM"), nd = root.querySelector(".nd"), per = o.period[i] * 1000;
      const at = (now) => { const t = (now - t0) / per; return dial ? t % 1 : (t % 2 < 1 ? t % 2 : 2 - (t % 2)); };
      const frame = (now) => { if (!root.isConnected || stopped) return; pos = at(now); if (m) m.style.left = pos * 100 + "%"; if (nd) nd.setAttribute("transform", `rotate(${pos * 360} 60 60)`); raf = requestAnimationFrame(frame); };
      raf = requestAnimationFrame(frame);
      const go = root.querySelector(".sgcGo");
      const stop = () => {
        if (stopped || !root.isConnected) return; stopped = true; cancelAnimationFrame(raf); pos = at(performance.now());
        if (m) m.style.left = pos * 100 + "%"; if (nd) nd.setAttribute("transform", `rotate(${pos * 360} 60 60)`);
        let d = Math.abs(pos - (lo + w / 2)); if (dial) d = Math.min(d, 1 - d);
        const n = d <= pz ? 3 : d <= w / 2 ? 2 : 1; pts.push(n); go.disabled = true;
        root.querySelector(".sgcLine").innerHTML = `<b>${esc(o.line[n - 1])}</b>`;
        root.querySelector(".sgcDots").innerHTML = pts.map((q) => (q === 3 ? "⭐" : q === 2 ? "✔️" : "✖️")).join("") + "⚪".repeat(o.rounds - pts.length);
        setTimeout(() => { if (!root.isConnected) return; i++; if (i >= o.rounds) o.done(pts.reduce((a, b) => a + b, 0), pts); else round(); }, 1000);
      };
      go.onclick = stop;
    }
    round();
  }
  const SGC = [
    { id: "slalom", e: "🧀", t: "Lo slalom dei Camosci", chap: 5, flags: ["slalom_met", "slalom_ok", "slalom_f"], dir: "max", unit: (b) => `${b}/15`, rule: "punti su 15",
      d: "Cinque coni, nessuna pietà e una polenta che non è in palio: ferma la barra nella zona verde, il pallone fa il resto.",
      run: (body, end) => sgcTiming(body, { rounds: 5, label: "Slalom", kind: "bar", zone: [0.26, 0.23, 0.2, 0.17, 0.14], period: [1.1, 1.0, 0.9, 0.8, 0.7], hint: "Ferma la barra nella zona verde: il centro oro vale tre.", btn: "ORA! ⚽", line: ["Giù. Il cono rotola via con la dignità di un camoscio.", "Sfiorato. Il cono tossisce e si rimette dritto.", "Pulito! Il cono ondeggia ma resta in piedi."], done: (s) => end(s, s >= 13 ? "Cinque coni in piedi e nemmeno un cappello perso. Qualcuno ti offrirà una polenta, prima o poi." : s >= 9 ? "Una discesa onesta: due coni hanno protestato, ma sottovoce." : "I coni sono permalosi. Riprova: la seconda volta è la più educata.") }) },
    { id: "rigori", e: "🥅", t: "I rigori al portiere", chap: 3, flags: ["berto_f", "berto_ok"], dir: "max", unit: (b) => `${b}/15`, rule: "punti su 15",
      d: "Cinque rigori a tempismo contro un portiere che non si schioda dalla riga. Il centro oro è un gol da copertina; la zona verde, un gol discreto.",
      run: (body, end) => sgcTiming(body, { rounds: 5, label: "Rigore", kind: "bar", zone: [0.24, 0.21, 0.19, 0.16, 0.14], period: [1.0, 0.9, 0.8, 0.72, 0.65], hint: "Calcia quando il pallone passa sul verde.", btn: "TIRA! ⚽", line: ["Parato. Il portiere ti saluta con la mano, per cortesia.", "Palo! Il portiere sorride, il palo un po' meno.", "Gol! La rete di nebbia luminosa trema come un lenzuolo steso."], done: (s) => end(s, s >= 13 ? "Cinque rigori, quattro e mezzo da incorniciare. Il portiere chiede la rivincita per iscritto." : s >= 9 ? "Un rigorista da campetto di lusso." : "Il pallone, quando va, va bene. È il momento che ha una sua idea.") }) },
    { id: "freno", e: "⚙️", t: "Il freno del carrello", chap: 3, flags: ["cart_f", "cart_ok"], dir: "max", unit: (b) => `${b}/12`, rule: "punti su 12",
      d: "Un carrello da cinquecento chili e una ghiera con un punto verde: ferma la lancetta quando ci passa sopra, senza offendere il carrello.",
      run: (body, end) => sgcTiming(body, { rounds: 4, label: "Freno", kind: "dial", zone: [0.16, 0.14, 0.12, 0.1], period: [2.4, 2.1, 1.8, 1.6], pz: 0.02, hint: "La lancetta gira: bloccala sul verde.", btn: "FRENA!", line: ["Slitta. La ghiera gira a vuoto e il carrello fa un rutto di ferro.", "Quasi. Il carrello trema, poi si accontenta.", "Clac! La ghiera scatta nel punto esatto, senza un fiato."], done: (s) => end(s, s >= 11 ? "Il carrello si è fermato con la dignità di chi cede il posto." : s >= 7 ? "Si è fermato. Con aria di chi ha vinto ai punti." : "Il carrello ha un'idea sua sul freno. Riprova con più calma.") }) },
    { id: "cristalli", e: "💎", t: "I quattro cristalli in fase", chap: 3, flags: ["cr_seen", "p1_ok", "cr_n"], dir: "min", unit: (b) => `${b} mosse`, rule: "mosse (meno è meglio)",
      d: "Quattro cristalli in fila: se ne tocchi uno, cambiano anche i vicini. Devono brillare tutti insieme, con meno tocchi che puoi.",
      run: (body, end) => {
        const eff = (s, i) => { const t = s.slice(); [i - 1, i, i + 1].forEach((j) => { if (j >= 0 && j < 4) t[j] = !t[j]; }); return t; };
        let st; do { st = [true, true, true, true]; for (let i = 0; i < 4; i++) if (Math.random() < 0.5) st = eff(st, i); } while (st.every(Boolean));
        let par = 9; for (let m = 0; m < 16; m++) { let t = st; let n = 0; for (let i = 0; i < 4; i++) if (m & (1 << i)) { t = eff(t, i); n++; } if (t.every(Boolean)) par = Math.min(par, n); }
        let moves = 0; const draw = () => {
          body.innerHTML = `<p class="sum">${esc(SGC[3].d)}</p><div class="sgcRow">${st.map((on, i) => `<button type="button" class="sgcBtn${on ? " on" : ""}" data-i="${i}"><span>${on ? "💠" : "🔹"}</span>${i + 1}°</button>`).join("")}</div><div class="sgcLine">Mosse: <b>${moves}</b> · il minimo possibile è ${par}</div><div class="big"><button type="button" data-q="1">◂ Esci<small>Torna alla Sala Giochi</small></button></div>`;
          body.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => { st = eff(st, +b.dataset.i); moves++; if (st.every(Boolean)) { draw(); end(moves, moves <= par ? "Minimo possibile: una nota sola, bassa, che ti sale per le caviglie." : `Tutti accesi. Con ${par} mosse si poteva: la prossima volta ti viene più facile.`); } else draw(); }));
          body.querySelector("[data-q]").onclick = () => openSalaGiochi();
        };
        draw();
      } },
    { id: "archivio", e: "🗝️", t: "I quattro tasselli dell'archivio", chap: 4, flags: ["tw_seen", "cass_open", "disc"], dir: "min", unit: (b) => `${b} tentativi`, rule: "tentativi (meno è meglio)",
      d: "Quattro tasselli, quattro simboli, un ordine solo, nessuna ripetizione: il cassetto dice soltanto quanti tasselli sono al posto giusto.",
      run: (body, end) => {
        const SY = ["✒️ Pennino", "🔴 Timbro", "🏵️ Sigillo", "🛡️ Stemma"]; let sol; do { sol = [0, 1, 2, 3].sort(() => Math.random() - 0.5); } while (sol.every((v, i) => v === i));
        const cur = [0, 1, 2, 3], hist = []; const draw = () => {
          body.innerHTML = `<p class="sum">${esc(SGC[4].d)} Tocca un tassello per cambiare simbolo.</p><div class="sgcRow" style="flex-wrap:wrap">${cur.map((v, i) => `<button type="button" class="sgcBtn" data-i="${i}">${esc(SY[v])}</button>`).join("")}</div>`
            + `<div class="big"><button type="button" data-try="1">Prova il cassetto<small>Tentativo ${hist.length + 1}</small></button></div><div class="sgcHist">${hist.map((h, n) => `${n + 1}. ${h[0].map((v) => SY[v].split(" ")[0]).join(" ")} → <b>${h[1]} su 4</b>`).join("<br>")}</div><div class="big"><button type="button" data-q="1">◂ Esci<small>Torna alla Sala Giochi</small></button></div>`;
          body.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => { const i = +b.dataset.i; cur[i] = (cur[i] + 1) % 4; draw(); }));
          body.querySelector("[data-try]").onclick = () => { const k = cur.filter((v, i) => v === sol[i]).length; hist.push([cur.slice(), k]); if (k === 4) { draw(); end(hist.length, hist.length <= 4 ? "Il cassetto scivola fuori con un sospiro di legno: conoscevi la serratura meglio di lei." : "Il cassetto cede, finalmente, con un tintinnio di molle."); } else draw(); };
          body.querySelector("[data-q]").onclick = () => openSalaGiochi();
        };
        draw();
      } },
    { id: "fischi", e: "🎺", t: "Il baule a fischio", chap: 5, flags: ["fischi_ok", "fischi_f", "fischi_r"], dir: "min", unit: (b) => `${b} passi falsi`, rule: "passi falsi (errori e riascolti, meno è meglio)",
      d: "Un baule che si apre solo a fischio: corto ●, lungo ▬. Tre frasi del codice dei soccorsi, e ogni frase ti dà un indizio più magro della precedente.",
      run: (body, end) => {
        const FR = [{ n: "PERICOLO", p: [0, 1, 0], d: "un corto, un lungo, un corto" }, { n: "HO CAPITO", p: [0, 0, 1], d: "due corti e un lungo" }, { n: "VENGO", p: [1, 0, 0], d: "un lungo e due corti" }].sort(() => Math.random() - 0.5);
        const sym = (a) => a.map((v) => (v ? "▬" : "●")).join(" "); let r = 0, cur = [], falls = 0, shown = true;
        const draw = () => {
          const f = FR[r], look = r === 0 ? sym(f.p) : r === 1 ? f.d : "";
          body.innerHTML = `<p class="sum">${esc(SGC[5].d)}</p><div class="sec">Frase ${r + 1} di 3 · ${esc(f.n)}</div><div class="sgcSeq">${shown && look ? esc(look) : "·"}</div><div class="sgcSeq" style="color:#7af0ff">${esc(sym(cur)) || "&nbsp;"} <small style="font-size:13px;letter-spacing:0">${cur.length}/${f.p.length}</small></div>`
            + `<div class="sgcRow"><button type="button" class="sgcBtn" data-v="0"><span>●</span>Corto</button><button type="button" class="sgcBtn" data-v="1"><span>▬</span>Lungo</button></div><div class="sgcLine">Passi falsi: <b>${falls}</b></div>`
            + `<div class="big"><button type="button" data-re="1">🔊 Riascolta<small>${r === 0 ? "Gratis alla prima frase" : "Costa un passo falso"}</small></button><button type="button" data-q="1">◂ Esci<small>Torna alla Sala Giochi</small></button></div>`;
          body.querySelectorAll("[data-v]").forEach((b) => (b.onclick = () => {
            cur.push(+b.dataset.v); if (cur.length < f.p.length) return draw();
            if (cur.every((v, k) => v === f.p[k])) { cur = []; shown = true; r++; if (r >= 3) return end(falls, falls === 0 ? "Tre clic limpidi e il coperchio si alza da solo. Orecchio assoluto." : "Il terzo clic è il più grave: la serratura gira, i cardini sospirano.");  return draw(); }
            falls++; cur = []; draw();
          }));
          body.querySelector("[data-re]").onclick = () => { if (r > 0) falls++; sgcBeep(f.p); cur = []; shown = true; draw(); };
          body.querySelector("[data-q]").onclick = () => openSalaGiochi();
        };
        draw(); sgcBeep(FR[0].p);
      } },
  ];
  function sgcPlay(c) {
    const body = shell(`${c.e} ${c.t}`); sgcCss(); BACK = () => openSalaGiochi();
    const end = (score, txt) => {
      const r = sgRec(); r.c = r.c || {}; const o = r.c[c.id] || { best: null, n: 0 };
      const old = o.best, better = old == null || (c.dir === "min" ? score < old : score > old); o.n++; if (better) o.best = score; r.c[c.id] = o; sgSave(r);
      setTimeout(() => {
        if (!body.isConnected) return;
        body.innerHTML = `<div class="sgcBig">${esc(c.unit(score))}</div><p class="sum" style="text-align:center">${better ? (old == null ? "<b>Primo record!</b>" : "<b>NUOVO RECORD!</b> Il precedente era " + esc(c.unit(old)) + ".") : `Il tuo record resta ${esc(c.unit(o.best))}.`}</p><div class="sgcLine">${esc(txt)}</div>`
          + `<div class="big"><button type="button" data-again="1">↻ Ancora<small>Un'altra prova</small></button><button type="button" data-back="1">◂ Sala Giochi<small>Tutti i cabinati</small></button></div>`;
        body.querySelector("[data-again]").onclick = () => sgcPlay(c); body.querySelector("[data-back]").onclick = () => openSalaGiochi();
      }, 900);
    };
    body.innerHTML = `<p class="sum">${esc(c.d)}</p><p class="sum">Record: <b>${(sgRec().c || {})[c.id] && (sgRec().c || {})[c.id].best != null ? esc(c.unit(sgRec().c[c.id].best)) : "nessuno"}</b> · si misura in ${esc(c.rule)}. Nessun premio: solo l'onore.</p><div class="big"><button type="button" data-go="1">▶ Comincia<small>${esc(c.t)}</small></button><button type="button" data-back="1">◂ Sala Giochi<small>Indietro</small></button></div>`;
    body.querySelector("[data-back]").onclick = () => openSalaGiochi();
    body.querySelector("[data-go]").onclick = () => { body.innerHTML = ""; c.run(body, end); };
  }
  // ---------------------------------------------------------------- CINETECA
  // Rivedi i finali che hai trovato: lo sfondo animato della saga, la grana della pellicola e il racconto del finale.
  function openCineteca(back) {
    if (back) BK.cin = back; BACK = BK.cin; const body = shell("🎬 Cineteca");
    const list = SAGAS.filter(available).map((s) => ({ s, x: state(s) })).filter(({ x }) => x.ends && x.ends.length);
    const found = list.reduce((n, { x }) => n + x.endsFound, 0);
    let html = `<p class="sum">Le scene dei finali che hai trovato, da rivedere quando vuoi. ${found ? `${found} film in archivio.` : "Ancora nessun film: finisci una saga per riempire la Cineteca."}</p>`;
    list.forEach(({ s, x }) => { if (!x.endsFound) return; html += `<div class="sec">${s.e} ${esc(s.t)}<span>${x.endsFound}/${x.ends.length}</span></div>`; html += x.ends.map((e) => (e.found ? `<div class="psec" data-s="${s.id}" data-e="${esc(e.id)}"><div class="pe">🎞️</div><div><b>${esc(e.title)}</b><span>Guarda il film del finale</span></div><div class="n">▶</div></div>` : `<div class="psec" style="opacity:.5"><div class="pe">❔</div><div><b>Pellicola mancante</b><span>${esc(e.hint || "Un finale ancora da trovare.")}</span></div></div>`)).join(""); });
    body.innerHTML = html;
    body.querySelectorAll("[data-e]").forEach((b) => (b.onclick = () => { const s = SAGAS.find((x) => x.id === b.dataset.s), e = state(s).ends.find((x) => x.id === b.dataset.e); if (e) film(s, e, () => openCineteca()); }));
  }
  function film(s, e, back) {
    close(); const LBG = window.__lbBg && window.__lbBg.LB, pf = PFX[s.id], key = [`${pf}_finale`, `${pf}_fine`, s.cover].find((k) => LBG && LBG[k]) || s.cover;
    const ov = document.createElement("div"); ov.className = "salOv"; ov.style.cssText = "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:#050505;padding:12px";
    ov.innerHTML = `<canvas width="640" height="400" style="width:min(100%,560px);height:auto;flex:none;border-radius:6px;background:#000"></canvas><div class="txt" style="width:min(100%,560px);min-height:96px;font:15px/1.5 Georgia,serif;color:#f0e8d8;text-align:center"></div><button type="button" style="min-height:44px;padding:8px 18px;border-radius:10px;border:2px solid #ffd23f;background:#1a1a1a;color:#ffd23f;font:800 14px sans-serif">◂ Torna alla Cineteca</button>`;
    document.body.appendChild(ov); const cv = ov.querySelector("canvas"), g = cv.getContext("2d"), txt = ov.querySelector(".txt"); let f = 0, raf = 0, n = 0;
    const full = `${e.title}\n\n${e.desc}`;
    const loop = () => { if (!ov.isConnected) return; f++; g.setTransform(2, 0, 0, 2, 0, 0); g.fillStyle = "#000"; g.fillRect(0, 0, 320, 200);
      safe(() => LBG[key].draw(g, 320, 200, f), null);
      g.fillStyle = "rgba(40,30,10,.18)"; g.fillRect(0, 0, 320, 200); for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`; g.fillRect(Math.random() * 320, Math.random() * 200, 1, 1); } if (f % 47 < 2) { g.fillStyle = "rgba(255,255,255,.2)"; g.fillRect(Math.random() * 320, 0, 1, 200); }
      g.fillStyle = "#000"; g.fillRect(0, 0, 320, 14); g.fillRect(0, 186, 320, 14); for (let i = 0; i < 16; i++) { g.fillStyle = "#2a2a2a"; g.fillRect(6 + i * 20 - (f % 20), 4, 8, 6); g.fillRect(6 + i * 20 - (f % 20), 190, 8, 6); }
      if (f % 2 === 0 && n < full.length) { n++; txt.innerHTML = esc(full.slice(0, n)).replace(/\n/g, "<br>").replace(/^([^<]*)/, "<b style='color:#ffd23f;font:900 17px sans-serif;letter-spacing:1px'>$1</b>"); }
      raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    ov.querySelector("button").onclick = () => { cancelAnimationFrame(raf); ov.remove(); back(); };
    cv.onclick = () => { n = full.length; };
  }
  // ---------------------------------------------------------------- SALONE
  const FILT = { st: "tutte", g: "", sort: "recenti" };
  function totals() {
    const list = SAGAS.filter(available), st = list.map((s) => [s, state(s)]);
    let fe = 0, te = 0; st.forEach(([, x]) => { fe += x.endsFound; te += x.ends.length; });
    const story = safe(() => api().storyEndings(), []); fe += story.filter((e) => e.found).length; te += story.length;
    return { n: list.length, run: st.filter(([, x]) => x.started && !x.finished).length, fin: st.filter(([, x]) => x.finished).length, fe, te };
  }

  // ---------------------------------------------------------------- MAPPAMONDO DELLE SAGHE
  // ---------------------------------------------------------------- MAPPAMONDO & HUB DEL MONDO
  const MAP_REGIONS = [
    {
      id: "riviera",
      t: "Borgo Marino & Riviera",
      e: "⚓",
      color: "#38bdf8",
      accent: "#0284c7",
      x: 120, y: 88, r: 46,
      weather: "🍃 Tramontana · 🌊 Mare Calmo · ☀️ Costa Ligure",
      desc: "Il porto vecchio, la spiaggia dei ciottoli, la Trattoria Moretti, i caruggi e i paesi arrampicati sulle scogliere liguri.",
      quote: "«Il mare restituisce sempre quello che gli lanci con effetto.»",
      sagas: ["cala", "borgostorto", "torneo", "campetto", "stagione", "lampioni", "colline", "montagna", "vallombra", "diga", "faro", "rotta", "campana", "carte"],
      pins: [
        { id: "torneo", t: "Cento Scuole", e: "🏆", dx: 36, dy: -24 },
        { id: "campetto", t: "Campetto", e: "⚽", dx: -36, dy: 22 },
        { id: "lampioni", t: "Lampioni", e: "🏮", dx: 38, dy: 24 }
      ]
    },
    {
      id: "epoche",
      t: "Novecento & Epoche del Passato",
      e: "🏛️",
      color: "#f59e0b",
      accent: "#b45309",
      x: 320, y: 78, r: 44,
      weather: "📜 Zefiro Antico · 🏛️ 75 d.C. - 1998 · 🏺 Storia Viva",
      desc: "Dai ludi circensi dell'Antica Roma al 1427 dei capitani di ventura, fino al noir di Milano 1954 e al fischietto del 1998.",
      quote: "«Cambiano le scarpe e i palloni di cuoio, ma il coraggio resta uguale.»",
      sagas: ["onde", "roma", "capitani", "milano", "fischietto", "piramide", "tempo", "treno", "pugno", "kronenburg", "shogun"],
      pins: [
        { id: "roma", t: "Ave Calcio", e: "🏛️", dx: -36, dy: -22 },
        { id: "milano", t: "Milano Noir", e: "🕵️", dx: 36, dy: -18 },
        { id: "capitani", t: "Capitani 1427", e: "🏰", dx: 34, dy: 22 }
      ]
    },
    {
      id: "mari",
      t: "Mari Lontani, Isole & Frontiere",
      e: "⛵",
      color: "#06b6d4",
      accent: "#0891b2",
      x: 125, y: 240, r: 48,
      weather: "🌪️ Libeccio Furente · 🌊 Marea Alta · 🏴‍☠️ Frontiera",
      desc: "Fortezze carcerarie, atolli spazzati dalle maree, baie corsare dell'Oceano di Melassa e fiumi selvaggi.",
      quote: "«Nessun vento è contrario per chi sa tirare a giro controcorrente.»",
      sagas: ["alcatraz", "vuota", "naufraghi", "galletta", "fiume", "abisso", "traversata", "cenere"],
      pins: [
        { id: "alcatraz", t: "Alcatraz", e: "⛓️", dx: -36, dy: -22 },
        { id: "naufraghi", t: "Naufraghi", e: "🏝️", dx: 36, dy: -20 },
        { id: "galletta", t: "Bucanieri", e: "🏴‍☠️", dx: 32, dy: 24 }
      ]
    },
    {
      id: "arcano",
      t: "Regni Fantastici & Mitologia Arcana",
      e: "👑",
      color: "#a855f7",
      accent: "#7e22ce",
      x: 330, y: 245, r: 48,
      weather: "✨ Brezza Runica · 🔮 Nebbie di Mana · 👑 Regni Feudali",
      desc: "Accademie di magia runica, casate feudali in guerra, cristalli elementali in frantumi e cancelli dimensionali.",
      quote: "«Il destino del regno non si decide sulle pergamene, ma su un tiro all'incrocio al novantesimo.»",
      sagas: ["sigilli", "regno", "trono", "ducati", "bilancia", "cronache", "cristalli", "muro", "vento", "dungeon", "ragnarok", "belovodia", "alchimia", "libro", "mondi", "westeros"],
      pins: [
        { id: "sigilli", t: "Accademia", e: "📜", dx: -38, dy: -24 },
        { id: "trono", t: "Trono Cuoio", e: "👑", dx: 38, dy: -20 },
        { id: "cristalli", t: "Cristalli", e: "💎", dx: 34, dy: 24 }
      ]
    },
    {
      id: "cosmo",
      t: "Cyberpunk, Cosmo & Futuro",
      e: "⚡",
      color: "#10b981",
      accent: "#059669",
      x: 520, y: 82, r: 46,
      weather: "⚡ Pioggia Acida · 🚀 Gravità 0.8g · 🤖 Neon City",
      desc: "Grattacieli al neon sotto la pioggia acida della Vektor, stazioni orbitanti e corrieri interplanetari dell'anno 3000.",
      quote: "«Nell'iper-spazio l'effetto Magnus curva sia la luce che i gol.»",
      sagas: ["circuiti", "spazio", "razzo", "officina", "replica", "titano", "futurama", "cittadella", "chrono", "phantom", "multiverso"],
      pins: [
        { id: "circuiti", t: "Neo-Rondine", e: "⚡", dx: -36, dy: -22 },
        { id: "spazio", t: "Stazione 7", e: "🚀", dx: 36, dy: -20 },
        { id: "razzo", t: "Razzopacco", e: "📦", dx: 32, dy: 22 }
      ]
    },
    {
      id: "arene",
      t: "Arene Mondiali & Duelli Anime",
      e: "🌍",
      color: "#ef4444",
      accent: "#dc2626",
      x: 515, y: 245, r: 48,
      weather: "🔥 Foga dei Cori · 🏟️ Riflettori Accesi · 🏆 Mondiali",
      desc: "I grandi palcoscenici mondiali: Tokio, Rio, le gabbie di strada, i campi da liceo e i duelli cinematografici.",
      quote: "«Quando lo stadio intero trattiene il fiato, senti solo il rimbalzo.»",
      sagas: ["mondiale", "gala", "fortino", "quattordici", "spia", "gp", "figurine", "note", "bluelock", "tsubasa", "jojo", "emblem", "cavallo", "quartiere", "cavaliere", "grigio", "ombre", "detective", "mantello", "dopo", "doppio", "leggenda", "noir", "pirati"],
      pins: [
        { id: "mondiale", t: "Mondiale", e: "🌍", dx: -38, dy: -22 },
        { id: "gala", t: "Pallone d'Oro", e: "🏆", dx: 36, dy: -20 },
        { id: "cavaliere", t: "Cavaliere", e: "🦇", dx: 34, dy: 22 }
      ]
    }
  ];

  let SALONE_VIEW = "grid"; // default: "grid" (Catalogo Completo) oppure "hub" (Mappa del Mondo)
  let ACTIVE_MAP_REG = "riviera";
  let MAP_SEARCH_QUERY = "";
  let SWALLOW_TOKEN = { x: 120, y: 88, tx: 120, ty: 88, trail: [] };

  function renderSagaCards(sagasList) {
    const r = rec();
    return sagasList.map(({ s, x }) => {
      const isFav = r.favs.includes(s.id);
      const isNew = !r.seen[s.id] && !x.started && NEWEST.includes(s.id);
      const badge = x.finished ? `<span class="badge done">✓ CONCLUSA</span>` : x.started ? `<span class="badge run">IN CORSO</span>` : isNew ? `<span class="badge new">NUOVA</span>` : "";
      const prog = x.pct != null && (x.started || x.finished) ? `<div class="pbar"><i style="width:${Math.max(4, x.pct)}%"></i></div>` : "";
      const favBtn = `<button type="button" class="salFav${isFav ? " on" : ""}" data-fav="${s.id}" title="${isFav ? "Rimuovi dai preferiti" : "Fissa tra le saghe preferite in cima"}" aria-label="Preferita">${isFav ? "⭐" : "☆"}</button>`;
      return `<div class="card${isFav ? " isFav" : ""}" data-id="${s.id}"><img alt="" loading="lazy" src="${cover(s)}"><div class="t"><span class="e">${s.e}</span>${esc(s.t)}</div>${favBtn}<div class="info">${s.g.map((k) => `<span class="tag" style="background:${GEN[k][1]}">${GEN[k][0]}</span>`).join("")}<div style="display:flex;justify-content:space-between;align-items:center;gap:6px"><span>${x.finished ? "Conclusa" : x.started ? `Capitolo ${x.ch}${s.ch ? `/${s.ch}` : ""}` : "Da iniziare"}</span>${x.ends.length ? `<span>🏆 ${x.endsFound}/${x.ends.length}</span>` : ""}</div>${prog}</div>${badge ? `<div class="stamp">${badge}</div>` : ""}</div>`;
    }).join("");
  }

  function initWorldMapCanvas(cv, activeReg, regions, sagaList, onSelectRegion, onOpenSaga) {
    const g = cv.getContext("2d"); if (!g) return;
    let animId = 0, f = 0;

    SWALLOW_TOKEN.tx = activeReg.x;
    SWALLOW_TOKEN.ty = activeReg.y;

    const drawMap = () => {
      if (!cv.isConnected) { cancelAnimationFrame(animId); return; }
      f++;
      const W = cv.width, H = cv.height;

      // 1. Oceano profondo & gradiente nautico
      const oceanGrad = g.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, W / 1.4);
      oceanGrad.addColorStop(0, "#0e2040");
      oceanGrad.addColorStop(0.5, "#09152e");
      oceanGrad.addColorStop(1, "#040914");
      g.fillStyle = oceanGrad;
      g.fillRect(0, 0, W, H);

      // Griglia cartografica di latitudine e longitudine
      g.strokeStyle = "rgba(56, 189, 248, 0.07)";
      g.lineWidth = 1;
      for (let x = 40; x < W; x += 50) {
        g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke();
      }
      for (let y = 30; y < H; y += 45) {
        g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
      }

      // Onde marine animate
      g.strokeStyle = "rgba(148, 163, 184, 0.08)";
      for (let i = 0; i < 9; i++) {
        const wx = (i * 85 + f * 0.45) % (W + 60) - 30;
        const wy = 25 + (i * 38) % (H - 45);
        g.beginPath();
        g.arc(wx, wy, 14, Math.PI * 0.25, Math.PI * 0.75);
        g.stroke();
      }

      // Folate di vento (Tramontana)
      g.strokeStyle = "rgba(255, 255, 255, 0.09)";
      g.lineWidth = 1.2;
      for (let w = 0; w < 4; w++) {
        const sx = ((w * 170 + f * 1.2) % (W + 100)) - 50;
        const sy = 40 + w * 65 + Math.sin(f * 0.02 + w) * 12;
        g.beginPath();
        g.moveTo(sx, sy);
        g.quadraticCurveTo(sx + 35, sy - 10, sx + 70, sy + 4);
        g.stroke();
      }

      // Rotte di navigazione tra territori
      g.strokeStyle = "rgba(255, 210, 63, 0.18)";
      g.setLineDash([4, 6]);
      g.beginPath();
      // Anello principale
      g.moveTo(regions[0].x, regions[0].y);
      g.lineTo(regions[1].x, regions[1].y);
      g.lineTo(regions[4].x, regions[4].y);
      g.lineTo(regions[5].x, regions[5].y);
      g.lineTo(regions[3].x, regions[3].y);
      g.lineTo(regions[2].x, regions[2].y);
      g.closePath();
      // Diagonali interne
      g.moveTo(regions[1].x, regions[1].y); g.lineTo(regions[3].x, regions[3].y);
      g.moveTo(regions[0].x, regions[0].y); g.lineTo(regions[3].x, regions[3].y);
      g.stroke();
      g.setLineDash([]);

      // Vascello in navigazione sulla rotta Riviera-Mari
      const shipT = (f * 0.003) % 1;
      const shipX = regions[0].x + (regions[2].x - regions[0].x) * shipT;
      const shipY = regions[0].y + (regions[2].y - regions[0].y) * shipT;
      g.font = "14px serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("⛵", shipX + 12, shipY);

      // Rondini in volo nel cielo
      for (let r = 0; r < 3; r++) {
        const rx = ((r * 180 + f * 1.5) % (W + 80)) - 40;
        const ry = 30 + r * 35 + Math.sin(f * 0.05 + r) * 8;
        const wing = Math.sin(f * 0.2 + r * 2) * 3;
        g.fillStyle = "rgba(248, 250, 252, 0.4)";
        g.beginPath();
        g.moveTo(rx, ry);
        g.lineTo(rx - 5, ry - 3 + wing);
        g.lineTo(rx - 3, ry);
        g.lineTo(rx - 5, ry + 3 - wing);
        g.closePath();
        g.fill();
      }

      // Rosa dei Venti animata in alto a destra
      const bx = W - 44, by = 44;
      g.save();
      g.translate(bx, by);
      g.rotate(f * 0.002);
      g.strokeStyle = "rgba(255, 210, 63, 0.35)";
      g.beginPath(); g.arc(0, 0, 24, 0, Math.PI * 2); g.stroke();
      for (let a = 0; a < 4; a++) {
        g.rotate(Math.PI / 2);
        g.fillStyle = a === 0 ? "rgba(255, 77, 90, 0.75)" : "rgba(255, 210, 63, 0.5)";
        g.beginPath(); g.moveTo(0, 0); g.lineTo(-4, -8); g.lineTo(0, -22); g.lineTo(4, -8); g.closePath(); g.fill();
      }
      g.restore();
      g.fillStyle = "rgba(255,210,63,0.7)";
      g.font = "bold 9px sans-serif";
      g.textAlign = "center";
      g.fillText("N", bx, by - 26);

      // Faro della Riviera con fascio di luce rotante
      const riv = regions[0];
      const beamAngle = f * 0.03;
      const beamLen = 95;
      const lg = g.createRadialGradient(riv.x - 18, riv.y - 12, 0, riv.x - 18, riv.y - 12, beamLen);
      lg.addColorStop(0, "rgba(255, 230, 120, 0.55)");
      lg.addColorStop(1, "transparent");
      g.fillStyle = lg;
      g.beginPath();
      g.moveTo(riv.x - 18, riv.y - 12);
      g.arc(riv.x - 18, riv.y - 12, beamLen, beamAngle - 0.28, beamAngle + 0.28);
      g.closePath();
      g.fill();

      // 2. Disegno dei Territori (Isole, Coste e Fari)
      regions.forEach((reg) => {
        const isAct = reg.id === activeReg.id;
        const regSagas = sagaList.filter(({ s }) => reg.sagas.includes(s.id));
        const finCount = regSagas.filter(({ x }) => x.finished).length;
        const totCount = regSagas.length;
        const rad = reg.r;

        // Bordo costa e fondale sabbioso
        const shelfGrad = g.createRadialGradient(reg.x, reg.y, rad * 0.6, reg.x, reg.y, rad + 14);
        shelfGrad.addColorStop(0, reg.color + (isAct ? "55" : "20"));
        shelfGrad.addColorStop(1, "transparent");
        g.fillStyle = shelfGrad;
        g.beginPath(); g.arc(reg.x, reg.y, rad + 14, 0, Math.PI * 2); g.fill();

        // Terraferma poligonale organica
        g.fillStyle = isAct ? "#182c4d" : "#111f38";
        g.strokeStyle = isAct ? reg.color : "rgba(255,255,255,0.22)";
        g.lineWidth = isAct ? 3 : 1.5;
        g.beginPath();
        for (let a = 0; a < 8; a++) {
          const ang = (a / 8) * Math.PI * 2;
          const dist = rad * (0.86 + Math.sin(ang * 3 + reg.x * 0.1) * 0.14);
          const px = reg.x + Math.cos(ang) * dist;
          const py = reg.y + Math.sin(ang) * dist;
          if (a === 0) g.moveTo(px, py); else g.lineTo(px, py);
        }
        g.closePath();
        g.fill();
        g.stroke();

        // Anello pulsante per il territorio attivo
        if (isAct) {
          const pulse = (Math.sin(f / 10) + 1) * 4;
          g.strokeStyle = reg.color;
          g.lineWidth = 1.8;
          g.beginPath(); g.arc(reg.x, reg.y, rad + 5 + pulse, 0, Math.PI * 2); g.stroke();
        }

        // Icona del territorio
        g.font = "24px serif";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(reg.e, reg.x, reg.y - 8);

        // Badge di avanzamento (concluse / totali)
        g.font = "bold 10px sans-serif";
        const badgeTxt = `${finCount}/${totCount}`;
        const tw = g.measureText(badgeTxt).width + 10;
        g.fillStyle = finCount === totCount && totCount > 0 ? "#14532d" : "#0f172a";
        g.strokeStyle = isAct ? "#ffd23f" : "rgba(255,255,255,0.3)";
        g.lineWidth = 1;
        g.beginPath();
        if (g.roundRect) g.roundRect(reg.x - tw / 2, reg.y + 7, tw, 15, 5); else g.rect(reg.x - tw / 2, reg.y + 7, tw, 15);
        g.fill(); g.stroke();

        g.fillStyle = finCount === totCount && totCount > 0 ? "#4ade80" : "#fff";
        g.fillText(badgeTxt, reg.x, reg.y + 15);

        // Nome della regione
        g.fillStyle = isAct ? "#ffd23f" : "#cbd5e1";
        g.font = (isAct ? "bold 11px" : "10px") + " 'M PLUS Rounded 1c', sans-serif";
        g.fillText(reg.t.split(" & ")[0].split(" · ")[0], reg.x, reg.y + rad + 14);

        // Se la regione è attiva: disegna i mini pin delle saghe landmark
        if (isAct && reg.pins) {
          reg.pins.forEach((pin) => {
            const px = reg.x + pin.dx, py = reg.y + pin.dy;
            const targetSaga = sagaList.find(({ s }) => s.id === pin.id);
            const isFin = targetSaga && targetSaga.x.finished;

            // alone pin
            g.fillStyle = isFin ? "rgba(74, 222, 128, 0.3)" : "rgba(255, 210, 63, 0.3)";
            g.beginPath(); g.arc(px, py, 11, 0, Math.PI * 2); g.fill();

            // corpo pin
            g.fillStyle = "#1e293b";
            g.strokeStyle = isFin ? "#4ade80" : "#ffd23f";
            g.lineWidth = 1.5;
            g.beginPath(); g.arc(px, py, 9, 0, Math.PI * 2); g.fill(); g.stroke();

            g.font = "10px serif";
            g.textAlign = "center";
            g.textBaseline = "middle";
            g.fillText(pin.e, px, py);

            // etichetta pin
            g.font = "bold 9px 'M PLUS Rounded 1c', sans-serif";
            const ptw = g.measureText(pin.t).width + 6;
            g.fillStyle = "rgba(11, 16, 38, 0.85)";
            g.fillRect(px - ptw / 2, py + 10, ptw, 12);
            g.fillStyle = "#f8fafc";
            g.fillText(pin.t, px, py + 16);
          });
        }
      });

      // 3. Volo del Campione / Segnaposto Rondine
      SWALLOW_TOKEN.x += (SWALLOW_TOKEN.tx - SWALLOW_TOKEN.x) * 0.12;
      SWALLOW_TOKEN.y += (SWALLOW_TOKEN.ty - SWALLOW_TOKEN.y) * 0.12;

      // Scia di particelle del volo
      if (Math.hypot(SWALLOW_TOKEN.tx - SWALLOW_TOKEN.x, SWALLOW_TOKEN.ty - SWALLOW_TOKEN.y) > 2) {
        SWALLOW_TOKEN.trail.push({ x: SWALLOW_TOKEN.x, y: SWALLOW_TOKEN.y, a: 1 });
      }
      SWALLOW_TOKEN.trail.forEach((p, idx) => {
        p.a -= 0.06;
        if (p.a <= 0) { SWALLOW_TOKEN.trail.splice(idx, 1); return; }
        g.fillStyle = `rgba(255, 210, 63, ${p.a * 0.6})`;
        g.beginPath(); g.arc(p.x, p.y, 2.5 * p.a, 0, Math.PI * 2); g.fill();
      });

      // Token Campione volante
      const tokY = SWALLOW_TOKEN.y - 28 + Math.sin(f * 0.1) * 3;
      g.fillStyle = "rgba(0, 0, 0, 0.45)";
      g.beginPath(); g.ellipse(SWALLOW_TOKEN.x, SWALLOW_TOKEN.y + 4, 12, 4, 0, 0, Math.PI * 2); g.fill();

      // Emblema Rondine dorata
      g.fillStyle = "rgba(255, 210, 63, 0.25)";
      g.beginPath(); g.arc(SWALLOW_TOKEN.x, tokY, 15, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#ffd23f";
      g.font = "bold 15px serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("🕊️", SWALLOW_TOKEN.x, tokY);

      animId = requestAnimationFrame(drawMap);
    };

    drawMap();

    cv.onclick = (e) => {
      const rect = cv.getBoundingClientRect();
      const scaleX = cv.width / rect.width;
      const scaleY = cv.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      // Controlla prima se si tocca un pin landmark del territorio attivo
      if (activeReg.pins) {
        for (const pin of activeReg.pins) {
          const px = activeReg.x + pin.dx, py = activeReg.y + pin.dy;
          if (Math.hypot(mx - px, my - py) <= 16) {
            safe(() => window.sfx && window.sfx("kick"));
            if (typeof onOpenSaga === "function") onOpenSaga(pin.id);
            return;
          }
        }
      }

      // Controlla se si tocca una macro-regione
      for (const reg of regions) {
        const dx = mx - reg.x, dy = my - reg.y;
        if (Math.hypot(dx, dy) <= reg.r + 14) {
          SWALLOW_TOKEN.tx = reg.x;
          SWALLOW_TOKEN.ty = reg.y;
          safe(() => window.sfx && window.sfx("kick"));
          if (typeof onSelectRegion === "function") onSelectRegion(reg.id);
          return;
        }
      }
    };
  }

  function openMappamondo(back) {
    openSalone(back, "hub");
  }

  function openSalone(back, forceMode) {
    if (back) BK.sal = back; BACK = BK.sal;
    SALONE_VIEW = forceMode || "grid";
    const body = shell("🏛️ Salone delle Saghe & Hub del Mondo"), r = rec(), tt = totals();
    const list = SAGAS.filter(available).map((s) => ({ s, x: state(s) }));
    const lastS = list.find((o) => o.s.id === r.last);
    const pt = safe(() => perTotals(), null);

    const getRegStats = (reg) => {
      const regSagas = list.filter(({ s }) => reg.sagas.includes(s.id));
      const fin = regSagas.filter(({ x }) => x.finished).length;
      const run = regSagas.filter(({ x }) => x.started && !x.finished).length;
      const tot = regSagas.length;
      return { regSagas, fin, run, tot, pct: tot > 0 ? Math.round((fin / tot) * 100) : 0 };
    };

    const renderContent = () => {
      const activeReg = MAP_REGIONS.find((rg) => rg.id === ACTIVE_MAP_REG) || MAP_REGIONS[0];
      const curStats = getRegStats(activeReg);

      let html = `<p class="sum">${tt.n} saghe divise in 6 territori ed epoche · ${tt.run} in corso · ${tt.fin} concluse · finali ${tt.fe}/${tt.te}</p>`;

      // Selettore unificato delle modalità (Mappa Hub vs Catalogo Completo)
      html += `<div class="modeSwitch">
        <button type="button" class="modeBtn ${SALONE_VIEW === "hub" ? "on" : ""}" data-switch="hub">🗺️ Mappa & Hub del Mondo</button>
        <button type="button" class="modeBtn gridTab ${SALONE_VIEW === "grid" ? "on" : ""}" data-switch="grid">📜 Catalogo Completo (${tt.n})</button>
      </div>`;

      // Pulsante grande Squadra dei Sogni (prima era nascosto in fondo alla barra a scorrimento)
      if (window.__sogni) html += `<button type="button" class="salSogniBig" data-go="sogni"><span class="ic">🃏</span><span class="tx"><b>Squadra dei Sogni</b><small>Carte dei personaggi · Arena · Torneo · Stagione · Calcio</small></span><span class="go">▸</span></button>`;

      // Barra orizzontale degli strumenti del Salone
      html += `<div class="hubTools">
        ${window.__ricerca ? `<button type="button" class="hubToolBtn" data-go="ricerca">🔍 Cerca ovunque</button>` : ""}
        <button type="button" class="hubToolBtn" data-go="album">🏆 Album Finali (${tt.fe}/${tt.te})</button>
        <button type="button" class="hubToolBtn" data-go="albero">🌳 Albero Bivi (${tt.fe}/${tt.te})</button>
        <button type="button" class="hubToolBtn" data-go="guarda">👕 Guardaroba</button>
        <button type="button" class="hubToolBtn" data-go="diario">📖 Diario</button>
        <button type="button" class="hubToolBtn" data-go="sala">🕹️ Sala Giochi</button>
        <button type="button" class="hubToolBtn" data-go="cine">🎬 Cineteca</button>
        ${pt ? `<button type="button" class="hubToolBtn" data-go="per">👥 Personaggi (${pt.seen}/${pt.tot})</button>` : ""}
        ${window.__bar ? `<button type="button" class="hubToolBtn" data-go="bar">🍺 Bar del Borgo</button>` : ""}
        ${window.__carteDecks ? `<button type="button" class="hubToolBtn" data-go="carte">🎴 Carte del Destino</button>` : ""}
        ${window.__gabbia3d ? `<button type="button" class="hubToolBtn" data-go="gabbia3d">🏟️ Gabbia 3D · 7v7</button>` : ""}
        ${window.__portieri ? `<button type="button" class="hubToolBtn" data-go="portieri">🧤 Sfida di Portieri</button>` : ""}
        ${window.__tavolo ? `<button type="button" class="hubToolBtn" data-go="tavolo">🎭 Il Tavolo di Sotto</button>` : ""}
      </div>`;

      if (SALONE_VIEW === "hub") {
        // --- VISTA MAPPA & HUB ---
        html += `<div class="mapWrap">
          <canvas class="mapCanvas" id="worldMapCv" width="640" height="340" title="Tocca un territorio o un pin per esplorare"></canvas>
          <div class="mapOverlayHud">
            <span class="mapPill">🧭 ${activeReg.e} ${esc(activeReg.t.split(" & ")[0])}</span>
            <span class="mapPill">🕊️ Volo della Rondine</span>
          </div>
        </div>`;

        // Barra ricerca + Bussola della Fortuna
        html += `<div class="mapSearchRow">
          <div class="mapSearchBox">
            <span class="mapSearchIcon">🔍</span>
            <input type="text" class="mapSearch" id="mapSearchInput" placeholder="Cerca saga per nome, personaggio o atmosfera..." value="${esc(MAP_SEARCH_QUERY)}">
          </div>
          <button type="button" class="compassBtn" id="btnCompass" title="Suggerisci una saga consigliata o a sorpresa">🎲 Consigliami</button>
        </div>`;

        // Griglia macro-regioni
        html += `<div class="terrGrid">${MAP_REGIONS.map((reg) => {
          const st = getRegStats(reg);
          const isSel = reg.id === activeReg.id && !MAP_SEARCH_QUERY;
          return `<button type="button" class="terrBtn${isSel ? " on" : ""}" data-reg="${reg.id}" style="--tcol:${reg.color}">
            <div class="te">${reg.e}</div>
            <b>${esc(reg.t.split(" & ")[0])}</b>
            <span>${st.fin}/${st.tot} concluse · ${st.pct}%</span>
          </button>`;
        }).join("")}</div>`;

        if (MAP_SEARCH_QUERY.trim()) {
          const q = MAP_SEARCH_QUERY.trim().toLowerCase();
          const searchMatches = list.filter(({ s }) => s.t.toLowerCase().includes(q) || (s.d && s.d.toLowerCase().includes(q)) || s.e.includes(q) || s.g.some((g) => g.toLowerCase().includes(q)));
          html += `<div class="sec">Risultati ricerca (${searchMatches.length})</div>`;
          if (searchMatches.length === 0) {
            html += `<p class="sum" style="text-align:center;padding:16px 0;">Nessuna saga trovata per «${esc(MAP_SEARCH_QUERY)}».</p>`;
          } else {
            html += `<div class="grid">${renderSagaCards(searchMatches)}</div>`;
          }
        } else {
          // Scheda Hub del Territorio attivo
          html += `<div class="hubPanel" style="--tcol:${activeReg.color}">
            <div class="hubTop">
              <h3 class="hubTitle"><span>${activeReg.e}</span> ${esc(activeReg.t)}</h3>
              <span style="font-size:12px;font-weight:bold;color:#f8fafc;background:rgba(255,255,255,0.12);padding:3px 8px;border-radius:999px;">${curStats.fin}/${curStats.tot} concluse</span>
            </div>
            <div class="hubAtmo">
              ${activeReg.weather.split(" · ").map((tag) => `<span class="hubAtmoTag">${esc(tag)}</span>`).join("")}
            </div>
            <p class="hubDesc">${esc(activeReg.desc)}</p>
            <div class="hubQuote">${esc(activeReg.quote)}</div>
            <div class="pbar" style="margin-top:6px"><i style="width:${Math.max(4, curStats.pct)}%;background:${activeReg.color}"></i></div>
          </div>`;

          html += `<div class="sec"><span>Cronache del Territorio (${curStats.regSagas.length})</span><span>${curStats.fin} concluse</span></div>`;
          html += `<div class="grid">${renderSagaCards(curStats.regSagas)}</div>`;
        }
      } else {
        // --- VISTA CATALOGO SCHEDE CLASSICO ---
        if (lastS) html += `<div class="cont" data-id="${lastS.s.id}"><img alt="" src="${cover(lastS.s)}"><div><b>▸ Continua: ${esc(lastS.s.t)}</b>${lastS.x.finished ? "Conclusa · rigioca o cerca gli altri finali" : `Capitolo ${lastS.x.ch}${lastS.s.ch ? ` di ${lastS.s.ch}` : ""}`}</div></div>`;

        html += `<div class="row">${[["tutte", "Tutte"], ["fav", `⭐ Preferite (${r.favs.length})`], ["corso", "In corso"], ["nuove", "Da iniziare"], ["concluse", "Concluse"]].map(([k, l]) => `<button type="button" class="chip${FILT.st === k ? " on" : ""}" data-st="${k}">${l}</button>`).join("")}</div>`;
        html += `<div class="row">${[["", "Tutti i generi"], ...Object.entries(GEN).map(([k, v]) => [k, v[0]])].map(([k, l]) => `<button type="button" class="chip${FILT.g === k ? " on" : ""}" data-g="${k}">${l}</button>`).join("")}</div>`;
        html += `<div class="row" style="align-items:center;gap:6px"><span style="font-size:12px;color:#94a3b8;font-weight:700">Ordina:</span>${[["recenti", "✨ Recenti"], ["pct", "📈 Avanzamento %"], ["az", "🔤 Alfabetico A-Z"]].map(([k, l]) => `<button type="button" class="chip${FILT.sort === k ? " on" : ""}" data-sort="${k}" style="min-height:30px;padding:3px 10px;font-size:12px">${l}</button>`).join("")}</div>`;

        const shown = list.filter(({ s, x }) => s.id !== "carte" && (FILT.st === "tutte" || (FILT.st === "fav" && r.favs.includes(s.id)) || (FILT.st === "corso" && x.started && !x.finished) || (FILT.st === "nuove" && !x.started) || (FILT.st === "concluse" && x.finished)) && (!FILT.g || s.g.includes(FILT.g))).map((e, i) => [e, i]).sort((a, b) => {
          const fa = r.favs.includes(a[0].s.id) ? 1 : 0, fb = r.favs.includes(b[0].s.id) ? 1 : 0;
          if (fa !== fb) return fb - fa;
          if (FILT.sort === "pct") {
            const pa = a[0].x.pct != null ? a[0].x.pct : -1;
            const pb = b[0].x.pct != null ? b[0].x.pct : -1;
            if (pb !== pa) return pb - pa;
          } else if (FILT.sort === "az") {
            const c = a[0].s.t.localeCompare(b[0].s.t, "it");
            if (c !== 0) return c;
          }
          const ia = NEWEST.indexOf(a[0].s.id), ib = NEWEST.indexOf(b[0].s.id);
          return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a[1] - b[1];
        }).map((p) => p[0]);

        if (FILT.st === "fav" && shown.length === 0) {
          html += `<p class="sum" style="text-align:center;padding:24px 8px">Nessuna saga fissata nei preferiti.<br>Tocca la stellina <b>☆</b> su qualsiasi saga per tenerla sempre in cima al Salone.</p>`;
        } else {
          html += `<div class="grid">${renderSagaCards(shown)}</div>`;
        }
      }

      body.innerHTML = html;

      // Eventi pulsanti modalità
      body.querySelectorAll("[data-switch]").forEach((b) => {
        b.onclick = () => {
          SALONE_VIEW = b.dataset.switch;
          safe(() => window.sfx && window.sfx("kick"));
          renderContent();
        };
      });

      // Eventi pulsanti strumenti
      const bindTool = (sel, fn) => { const el = body.querySelector(sel); if (el) el.onclick = fn; };
      bindTool('[data-go="ricerca"]', () => window.__ricerca.open(() => openSalone()));
      bindTool('[data-go="album"]', () => openAlbum(() => openSalone()));
      bindTool('[data-go="albero"]', () => openAlbero(() => openSalone()));
      bindTool('[data-go="guarda"]', () => openGuardaroba(() => openSalone()));
      bindTool('[data-go="diario"]', () => openDiario(() => openSalone()));
      bindTool('[data-go="sala"]', () => openSalaGiochi(() => openSalone()));
      bindTool('[data-go="cine"]', () => openCineteca(() => openSalone()));
      bindTool('[data-go="per"]', () => openPersonaggi(() => openSalone()));
      bindTool('[data-go="bar"]', () => { close(); window.__bar.open(() => openSalone()); });
      bindTool('[data-go="carte"]', () => { close(); window.__carteDecks.openHub(() => openSalone()); });
      bindTool('[data-go="sogni"]', () => { close(); window.__sogni.open(() => openSalone()); });
      bindTool('[data-go="gabbia3d"]', () => { close(); window.__gabbia3d.open(() => openSalone()); });
      bindTool('[data-go="portieri"]', () => { close(); window.__portieri.open(() => openSalone()); });
      bindTool('[data-go="tavolo"]', () => { close(); window.__tavolo.open(() => openSalone()); });

      if (SALONE_VIEW === "hub") {
        const cv = body.querySelector("#worldMapCv");
        if (cv) {
          initWorldMapCanvas(cv, activeReg, MAP_REGIONS, list,
            (newRegId) => {
              ACTIVE_MAP_REG = newRegId;
              MAP_SEARCH_QUERY = "";
              renderContent();
            },
            (sagaId) => {
              const target = SAGAS.find((s) => s.id === sagaId);
              if (target) detail(target);
            }
          );
        }

        const searchInp = body.querySelector("#mapSearchInput");
        if (searchInp) {
          searchInp.oninput = (e) => {
            MAP_SEARCH_QUERY = e.target.value;
            renderContent();
            const inp = body.querySelector("#mapSearchInput");
            if (inp) { inp.focus(); inp.selectionStart = inp.selectionEnd = inp.value.length; }
          };
        }

        const compBtn = body.querySelector("#btnCompass");
        if (compBtn) {
          compBtn.onclick = () => {
            safe(() => window.sfx && window.sfx("jingle"));
            // Scegli una saga: preferisci una non ancora conclusa
            const unstarted = list.filter(({ x }) => !x.finished);
            const pool = unstarted.length ? unstarted : list;
            const picked = pool[Math.floor(Math.random() * pool.length)];
            if (picked) {
              const reg = MAP_REGIONS.find((rg) => rg.sagas.includes(picked.s.id));
              if (reg) {
                ACTIVE_MAP_REG = reg.id;
                SWALLOW_TOKEN.tx = reg.x;
                SWALLOW_TOKEN.ty = reg.y;
              }
              detail(picked.s);
            }
          };
        }

        body.querySelectorAll("[data-reg]").forEach((btn) => {
          btn.onclick = () => {
            ACTIVE_MAP_REG = btn.dataset.reg;
            MAP_SEARCH_QUERY = "";
            safe(() => window.sfx && window.sfx("kick"));
            renderContent();
          };
        });
      } else {
        body.querySelectorAll("[data-st]").forEach((b) => (b.onclick = () => { FILT.st = b.dataset.st; renderContent(); }));
        body.querySelectorAll("[data-g]").forEach((b) => (b.onclick = () => { FILT.g = b.dataset.g; renderContent(); }));
        body.querySelectorAll("[data-sort]").forEach((b) => (b.onclick = () => { FILT.sort = b.dataset.sort; renderContent(); }));
      }

      body.querySelectorAll(".salFav").forEach((b) => {
        b.onclick = (e) => {
          e.stopPropagation();
          const sid = b.dataset.fav;
          const curR = rec();
          const pos = curR.favs.indexOf(sid);
          if (pos >= 0) curR.favs.splice(pos, 1); else curR.favs.push(sid);
          recSave(curR);
          safe(() => window.sfx && window.sfx("ding"));
          renderContent();
        };
      });

      body.querySelectorAll(".card,.cont").forEach((b) => {
        b.onclick = (e) => {
          if (e.target.closest(".salFav")) return;
          detail(SAGAS.find((s) => s.id === b.dataset.id));
        };
      });
    };

    renderContent();
  }
  function detail(s) {
    if (!s || !OV) return; const x = state(s), r = rec(); r.seen[s.id] = 1; recSave(r);
    const sh = document.createElement("div"); sh.className = "sheet";
    const ends = x.ends.length ? `<div class="sec"><span>Finali</span><span>${x.endsFound}/${x.ends.length}</span></div><div class="ends">${x.ends.map((e) => endRow(e.found, e.title, e.found ? e.desc : (s.hints && s.hints[e.id]) || "Un finale ancora nascosto.")).join("")}</div>` : "";
    sh.innerHTML = `<div class="box"><img alt="" src="${cover(s)}"><div class="in"><h3>${s.e} ${esc(s.t)}</h3><div>${s.g.map((k) => `<span class="tag" style="background:${GEN[k][1]}">${GEN[k][0]}</span>`).join("")}</div><p>${esc(s.d)}</p><p style="color:#c9d2ea;font-size:13px">${x.finished ? "✓ Saga conclusa." : x.started ? `In corso · capitolo ${x.ch}${s.ch ? ` di ${s.ch}` : ""}${x.doneN ? ` · ${x.doneN} capitoli conclusi` : ""}.` : "Non l'hai ancora iniziata."}${s.ch ? ` ${s.ch} capitoli.` : ""}</p>${ends}<div class="act"><button type="button" class="ghost">◂ Indietro</button>${x.ends.length ? `<button type="button" class="ghost" data-tree="1">🌳 Albero Bivi</button>` : ""}<button type="button" class="play">${x.started ? "Continua ▸" : "Gioca ▸"}</button></div></div></div>`;
    sh.onclick = (e) => { if (e.target === sh) sh.remove(); };
    sh.querySelector(".ghost").onclick = () => sh.remove();
    const tb = sh.querySelector("[data-tree]"); if (tb) tb.onclick = () => { sh.remove(); openAlbero(() => detail(s), s.id); };
    sh.querySelector(".play").onclick = () => play(s, () => openSalone());
    OV.appendChild(sh);
  }
  const endRow = (found, title, sub) => `<div class="end${found ? " f" : ""}"><div class="seal">${found ? "FINALE<br>TROVATO" : "?"}</div><div><b>${found ? esc(title) : "???"}</b><span>${found ? esc(sub) : "Indizio: " + esc(sub)}</span></div></div>`;


  // ---------------------------------------------------------------- DIARIO
  // un libro unico: per ogni saga capitoli, finali e personaggi; in alto il completamento globale con i titoli a soglia
  const TITOLI = [[25, "Viaggiatore"], [50, "Cronista del Borgo"], [75, "Custode delle Saghe"], [100, "Leggenda Completa"]];
  function diarioData() {
    const secs = safe(() => perSections(), []), bySaga = {};
    secs.forEach((x) => { if (x.saga) bySaga[x.saga.id] = x; });
    const rows = SAGAS.filter(available).map((s) => {
      const x = state(s), p = bySaga[s.id], ch = s.ch || 0;
      const parts = [], add = (a, b) => { if (b > 0) parts.push(a / b); };
      if (ch) add(Math.min(x.doneN, ch), ch); else if (x.finished) parts.push(1);
      add(x.endsFound, x.ends.length); if (p) add(p.seen, p.ids.length);
      const pct = parts.length ? Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100) : 0;
      return { s, x, p, ch, pct: x.started || pct ? pct : 0 };
    });
    const tot = rows.length ? Math.round(rows.reduce((a, r) => a + r.pct, 0) / rows.length) : 0;
    return { rows, tot, titolo: TITOLI.filter((t) => tot >= t[0]).pop() || null };
  }
  function openDiario(back) {
    if (back) BK.dia = back; BACK = BK.dia; const body = shell("📖 Diario"), d = diarioData();
    const next = TITOLI.find((t) => d.tot < t[0]);
    let html = `<p class="sum">Il libro di tutto ciò che hai fatto. Completamento globale: <b>${d.tot}%</b>${d.titolo ? ` · titolo: <b style="color:#ffd23f">${esc(d.titolo[1])}</b>` : ""}${next ? ` · prossimo (${next[0]}%): ${esc(next[1])}` : ""}.</p><div class="pbar"><i style="width:${Math.max(2, d.tot)}%"></i></div>`;
    html += `<div class="row">${TITOLI.map((t) => `<span class="chip${d.tot >= t[0] ? " on" : ""}" style="cursor:default">${t[0]}% · ${esc(t[1])}</span>`).join("")}</div>`;
    html += d.rows.slice().sort((a, b) => (b.x.started - a.x.started) || (b.pct - a.pct)).map((r) => {
      const { s, x, p } = r, dim = x.started ? "" : "opacity:.55";
      return `<div class="psec${x.finished ? " gold" : ""}" data-id="${s.id}" style="${dim}"><div class="pe">${s.e}</div><div><b>${esc(s.t)}</b><span>${x.started ? `${r.ch ? `Capitoli ${Math.min(x.doneN, r.ch)}/${r.ch} · ` : ""}${x.ends.length ? `Finali ${x.endsFound}/${x.ends.length} · ` : ""}${p ? `Personaggi ${p.seen}/${p.ids.length}` : ""}` : "Non ancora iniziata"}</span><div class="pbar"><i style="width:${Math.max(2, r.pct)}%"></i></div></div><div class="n">${r.pct}%</div></div>`;
    }).join("");
    body.innerHTML = html;
    body.querySelectorAll("[data-id]").forEach((b) => (b.onclick = () => detail(SAGAS.find((s) => s.id === b.dataset.id))));
  }

  // ---------------------------------------------------------------- CUT-IN ALBERO & NAVIGATORE BIVI
  function cutInTree(title, subtitle, onComplete) {
    css();
    const c = document.createElement("div");
    c.className = "salTreeCutIn";
    c.innerHTML = `
      <div class="salTreeCutStripe"></div>
      <div class="salTreeCutContent">
        <div class="salTreeCutIcon">🌳</div>
        <div class="salTreeCutTitle">${esc(title || "ALBERO DEI BIVI")}</div>
        <div class="salTreeCutSub">${esc(subtitle || "Mappa Visuale del Destino & degli Snodi Narrativi")}</div>
      </div>
    `;
    document.body.appendChild(c);
    safe(() => window.sfx && window.sfx("special"));
    setTimeout(() => {
      c.classList.add("salTreeCutOut");
      setTimeout(() => {
        c.remove();
        if (typeof onComplete === "function") onComplete();
      }, 360);
    }, 950);
  }

  function openAlbero(back, focusId) {
    cutInTree("ALBERO DEI BIVI", "✦ Mappa degli Snodi Narrativi & Destini ✦", () => {
      openAlbum(back, "albero", focusId);
    });
  }

  // ---------------------------------------------------------------- ALBUM DEI FINALI & ALBERO DEI BIVI
  let ALB_TAB = "timbri";
  let TREE_FILTER = "tutte";
  let TREE_QUERY = "";

  function openAlbum(back, tab, focusId) {
    if (tab) ALB_TAB = tab;
    if (back) BK.alb = back; BACK = BK.alb; const body = shell(ALB_TAB === "albero" ? "🌳 Albero dei Bivi Narrativi" : "🏆 Album dei Finali"), tt = totals();
    let html = `<p class="sum">${ALB_TAB === "albero" ? "Mappa visuale degli snodi narrativi, percorsi e bivi che conducono ai differenti destini di ogni saga." : "Un timbro per ogni finale trovato. Quelli mancanti hanno un indizio, senza svelare troppo."} Totale: <b>${tt.fe}/${tt.te}</b>.</p>`;
    html += `<div class="row" style="margin-top:6px;margin-bottom:12px"><button type="button" class="chip${ALB_TAB === "timbri" ? " on" : ""}" data-atab="timbri">🏆 Timbri Finali</button><button type="button" class="chip${ALB_TAB === "albero" ? " on" : ""}" data-atab="albero">🌳 Albero dei Bivi</button></div>`;

    if (ALB_TAB === "timbri") {
      const story = safe(() => api().storyEndings(), []);
      if (story.length) {
        const groups = [...new Set(story.map((e) => e.group))];
        html += `<div class="sec"><span>⚽ Storia di Leo</span><span>${story.filter((e) => e.found).length}/${story.length}</span></div>`;
        groups.forEach((gname) => { const es = story.filter((e) => e.group === gname); html += `<div style="font-size:12.5px;color:#c9d2ea;margin:8px 0 2px">${esc(gname)}</div><div class="ends">${es.map((e) => endRow(e.found, e.title.replace(/^(Finale · |Stagione \d+ · )/, ""), e.found ? e.group : e.hint)).join("")}</div>`; });
      }
      SAGAS.filter(available).forEach((s) => { const x = state(s); if (!x.ends.length) return; html += `<div class="sec"><span>${s.e} ${esc(s.t)}</span><span>${x.endsFound}/${x.ends.length}</span></div><div class="ends">${x.ends.map((e) => endRow(e.found, e.title, e.found ? e.desc : (s.hints && s.hints[e.id]) || "Un finale ancora nascosto.")).join("")}</div>`; });
    } else {
      // Albero visuale dei bivi narrativi
      html += `<div class="treeLegend">
        <span>🌱 Radice & Prologo</span>
        <span>🔀 Snodo Narrativo</span>
        <span>🏆 Ramo Raggiunto</span>
        <span>🔒 Ramo Inesplorato</span>
        <span>🔮 Finale Segreto</span>
      </div>`;

      // Barra filtri dell'Albero
      html += `<div class="row" style="margin-bottom:10px;">
        ${[["tutte", "Tutte le saghe"], ["corso", "In corso"], ["mancano", "Bivi da scoprire"], ["complete", "100% Esplorate"]].map(([k, l]) => `<button type="button" class="chip${TREE_FILTER === k ? " on" : ""}" data-tfilt="${k}">${l}</button>`).join("")}
      </div>`;

      // Input di ricerca rapida nell'albero
      html += `<div style="margin-bottom:12px;">
        <input type="text" id="treeSearchInput" placeholder="Cerca saga, bivio o parole chiave..." value="${esc(TREE_QUERY)}" style="width:100%;box-sizing:border-box;padding:8px 12px;border-radius:10px;background:#0d1a33;border:1.5px solid #38bdf888;color:#fff;font:700 12.5px 'M PLUS Rounded 1c',sans-serif;outline:none;">
      </div>`;

      const q = TREE_QUERY.trim().toLowerCase();
      const story = safe(() => api().storyEndings(), []);
      let showStory = !q || "storia di leo il cammino del campione".includes(q) || story.some((e) => e.title.toLowerCase().includes(q) || e.group.toLowerCase().includes(q));

      if (TREE_FILTER === "corso") showStory = showStory && story.some((e) => e.found) && story.some((e) => !e.found);
      else if (TREE_FILTER === "mancano") showStory = showStory && story.some((e) => !e.found);
      else if (TREE_FILTER === "complete") showStory = showStory && story.length > 0 && story.every((e) => e.found);

      if (story.length && showStory) {
        const groups = [...new Set(story.map((e) => e.group))];
        const storyFound = story.filter((e) => e.found).length;
        html += `<div class="treeCard" id="tree_story"><div class="treeHead"><b>⚽ Storia di Leo · Il Cammino del Campione</b><span>${storyFound}/${story.length} finali</span></div>`
          + `<div class="treeStem ${storyFound > 0 ? "done" : ""}"><span>🌱</span><div>Atto I: Dalle spiagge di Borgo Marino alle prime sfide</div></div>`
          + `<div class="treeBranch">`
          + groups.map((gname) => {
              const es = story.filter((e) => e.group === gname);
              const gFound = es.filter((e) => e.found).length;
              return `<div style="font-size:11.5px;font-weight:700;color:#38bdf8;margin:4px 0 2px">🔀 Bivio: ${esc(gname)} (${gFound}/${es.length})</div>`
                + es.map((e) => `<div class="treeLeaf ${e.found ? "f" : ""}"><b><span>${e.found ? "🏆" : "🔒"}</span>${e.found ? esc(e.title.replace(/^(Finale · |Stagione \d+ · )/, "")) : "Destino da sbloccare"} <span class="treeTag ${e.found ? "f" : "lock"}">${e.found ? "Concluso" : "Inesplorato"}</span></b><span>${e.found ? esc(e.group) : "Indizio: " + esc(e.hint)}</span></div>`).join("");
            }).join("")
          + `</div></div>`;
      }

      const sagasWithEnds = SAGAS.filter(available).filter((s) => {
        const x = state(s);
        if (!x.ends.length) return false;
        if (TREE_FILTER === "corso" && (!x.started || x.finished)) return false;
        if (TREE_FILTER === "mancano" && x.endsFound >= x.ends.length) return false;
        if (TREE_FILTER === "complete" && x.endsFound < x.ends.length) return false;
        if (q) {
          const matchTitle = s.t.toLowerCase().includes(q) || (s.d && s.d.toLowerCase().includes(q));
          const matchEnds = x.ends.some((e) => e.title.toLowerCase().includes(q) || (e.desc && e.desc.toLowerCase().includes(q)));
          if (!matchTitle && !matchEnds) return false;
        }
        return true;
      });

      if (sagasWithEnds.length === 0 && !showStory) {
        html += `<p class="sum" style="text-align:center;padding:16px 0;">Nessun albero corrisponde ai filtri selezionati.</p>`;
      }

      sagasWithEnds.forEach((s) => {
        const x = state(s);
        const isFocused = focusId && focusId === s.id;
        html += `<div class="treeCard" id="tree_${s.id}" style="${isFocused ? "border-color:#ffd23f;box-shadow:0 0 16px rgba(255,210,63,0.3)" : ""}"><div class="treeHead"><b>${s.e} ${esc(s.t)}</b><span>${x.endsFound}/${x.ends.length} ${x.endsFound === x.ends.length ? "✨ Completo" : "finali"}</span></div>`
          + `<div class="treeStem ${x.started ? "done" : ""}"><span>🌱</span><div>Atto I & Prologo: ${x.started ? "Iniziata" : "Non ancora iniziata"} ${x.doneN ? `(${x.doneN} capitoli percorsi)` : ""}</div></div>`
          + `<div class="treeBranch">`
          + `<div style="font-size:11.5px;font-weight:700;color:#38bdf8;margin:4px 0 2px">🔀 Snodo Narrativo dei Bivi & Decisioni Cruciali</div>`
          + x.ends.map((e) => {
              const isSecret = e.id && (e.id.includes("segreto") || e.id.includes("arcano") || e.id.includes("calcio_puro") || e.id.includes("quarto") || (s.hints && s.hints[e.id] && s.hints[e.id].includes("Segreto")));
              return `<div class="treeLeaf ${e.found ? "f" : ""}"><b><span>${e.found ? (isSecret ? "🔮" : "🏆") : "🔒"}</span>${e.found ? esc(e.title) : (isSecret ? "Finale Segreto (??)" : "Ramo Inesplorato")} <span class="treeTag ${e.found ? "f" : "lock"}">${e.found ? (isSecret ? "Segreto Trovato" : "Ramo Trovato") : "Da Scoprire"}</span></b><span>${e.found ? esc(e.desc) : "Indizio: " + esc((s.hints && s.hints[e.id]) || "Esplora e compi scelte diverse per aprire questo ramo.")}</span></div>`;
            }).join("")
          + `</div>`
          + `<div class="treeActBox"><span style="font-size:11.5px;color:#94a3b8">${x.started ? `Capitolo attuale: ${x.ch}` : "Non ancora iniziata"}</span><button type="button" class="treeActBtn" data-play-tree="${s.id}">${x.started ? "Continua saga ▸" : "Inizia saga ▸"}</button></div>`
          + `</div>`;
      });
    }

    body.innerHTML = html;
    body.querySelectorAll("[data-atab]").forEach((b) => {
      b.onclick = () => { ALB_TAB = b.dataset.atab; openAlbum(back, ALB_TAB, focusId); };
    });
    body.querySelectorAll("[data-tfilt]").forEach((b) => {
      b.onclick = () => { TREE_FILTER = b.dataset.tfilt; openAlbum(back, "albero", focusId); };
    });
    const searchInp = body.querySelector("#treeSearchInput");
    if (searchInp) {
      searchInp.oninput = (e) => {
        TREE_QUERY = e.target.value;
        openAlbum(back, "albero", focusId);
        const inp = body.querySelector("#treeSearchInput");
        if (inp) { inp.focus(); inp.selectionStart = inp.selectionEnd = inp.value.length; }
      };
    }
    body.querySelectorAll("[data-play-tree]").forEach((btn) => {
      btn.onclick = () => {
        const s = SAGAS.find((item) => item.id === btn.dataset.playTree);
        if (s) play(s, () => openAlbum(back, "albero", s.id));
      };
    });
    if (focusId && ALB_TAB === "albero") {
      setTimeout(() => {
        const el = document.getElementById("tree_" + focusId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  }

  // ---------------------------------------------------------------- ALBUM DEI PERSONAGGI
  // ogni personaggio registrato nel gioco (window.__borgoApi.BIO) diventa una carta. Si «incontra» parlandoci (seeCard del gioco).
  // Le sezioni: la Storia e Borgo Marino, i tornei e le modalità del Borgo, e una sezione per saga (riconosciuta dal prefisso degli id).
  const PFX = { burattini: "bur", tifosi: "zt", falsari: "fc", sasso: "sn", banda: "bp", neve: "gn", onde: "rf", latta: "lt", missione: "ms", corriere: "cr", compagnia: "cp", diga: "vp", mondiale: "mg", cavaliere: "cf", gala: "pd", circuiti: "nr", vuota: "vs", replica: "rp", officina: "of", figurine: "fg", rotta: "ro", fischietto: "fi", capitani: "cv", carte: "cd", quattordici: "qt", sigilli: "sg", cenere: "ce", note: "qd", fortino: "fo", spia: "dz", fiume: "fa", piramide: "my", treno: "te", alcatraz: "alc", milano: "mn", gp: "gp", tempo: "rt", roma: "rm", regno: "re", naufraghi: "nf", campana: "cp", galletta: "gl", pugno: "pr", montagna: "bm", cavallo: "cs", dungeon: "dg", razzo: "rz", quartiere: "sq", titano: "ft", ducati: "td", grigio: "gr", colline: "ml", campetto: "cm", trono: "tc", mondi: "tm", lampioni: "nl", stagione: "sf", mantello: "mg", cronache: "cc", torneo: "ts", spazio: "so", dopo: "ep", detective: "dc", vento: "ve", muro: "mu", cristalli: "cr", doppio: "dt", libro: "lb", abisso: "abi", ragnarok: "rag", belovodia: "bv", bilancia: "fe", ombre: "omb", shogun: "sh", phantom: "pg", pirati: "pi", alchimia: "al", kronenburg: "kb", chrono: "chr", vallombra: "vl" };
  const BORGO_PFX = ["sv", "rb", "sb", "cg", "hd", "md", "ac"];
  function perSections() {
    const A = api(); if (!A || !A.BIO) return [];
    const ids = Object.keys(A.BIO).filter((id) => id !== "hero" && A.BIO[id]), seen = new Set(safe(() => A.cardsSeen(), [])), byP = {};
    Object.keys(PFX).forEach((k) => (byP[PFX[k]] = k));
    const secs = [{ id: "storia", t: "La Storia e Borgo Marino", e: "⚽", ids: [] }, { id: "borgo", t: "Tornei e modalità del Borgo", e: "🎮", ids: [] }];
    const sagaSec = {};
    SAGAS.filter((x) => PFX[x.id]).forEach((x) => { sagaSec[x.id] = { id: x.id, t: x.t, e: x.e, ids: [], saga: x }; });
    ids.forEach((id) => { const m = id.match(/^([a-z]+)_/), p = m ? m[1] : ""; if (p && byP[p] && sagaSec[byP[p]]) sagaSec[byP[p]].ids.push(id); else if (BORGO_PFX.includes(p)) secs[1].ids.push(id); else secs[0].ids.push(id); });
    const out = secs.concat(SAGAS.map((x) => sagaSec[x.id]).filter((x) => x && x.ids.length)).filter((x) => x.ids.length);
    out.forEach((x) => { x.seen = x.ids.filter((id) => seen.has(id)).length; x.gold = !!(x.saga && available(x.saga) && state(x.saga).finished); x.has = (id) => seen.has(id); });
    return out;
  }
  function perTotals() { const ss = perSections(); return { tot: ss.reduce((a, x) => a + x.ids.length, 0), seen: ss.reduce((a, x) => a + x.seen, 0), gold: ss.filter((x) => x.gold).length }; }
  const PF = { sec: null, f: "tutti" };
  const nameOf = (id) => safe(() => api().CAST[id].name, null) || id;
  // il ritratto della carta: sfondo del personaggio, volto su uno strato trasparente; chi non è incontrato resta una sagoma scura
  const PIMG = {};
  function perDraw(g, id, ok, W, sc, cy) {
    const A = api(), c0 = safe(() => A.CAST[id], null), bg = ok ? (c0 && c0.bg) || ["#24386b", "#0b1026"] : ["#1a2240", "#0b1026"];
    const gr = g.createLinearGradient(0, 0, 0, W); gr.addColorStop(0, bg[0]); gr.addColorStop(1, bg[1] || "#0b1026"); g.fillStyle = gr; g.fillRect(0, 0, W, W);
    const t = document.createElement("canvas"); t.width = W; t.height = W; const tg = t.getContext("2d");
    safe(() => A.portraitTo(tg, id, W / 2, cy, sc));
    if (!ok) { tg.globalCompositeOperation = "source-atop"; tg.fillStyle = "#04050c"; tg.fillRect(0, 0, W, W); }
    g.drawImage(t, 0, 0);
    if (!ok) { g.fillStyle = "rgba(122,138,184,.85)"; g.font = `bold ${Math.round(W / 4)}px sans-serif`; g.textAlign = "center"; g.fillText("?", W / 2, W * 0.62); g.textAlign = "left"; }
  }
  function perImg(id, ok) { const k = id + (ok ? "+" : "-"); if (PIMG[k]) return PIMG[k]; const c = document.createElement("canvas"); c.width = 96; c.height = 96; perDraw(c.getContext("2d"), id, ok, 96, 1.15, 38); return (PIMG[k] = c.toDataURL("image/png")); }
  function openPersonaggi(back) {
    if (back) BK.per = back; BACK = BK.per; const body = shell("👥 Album dei personaggi"), ss = perSections(), tt = { tot: 0, seen: 0 };
    ss.forEach((x) => { tt.tot += x.ids.length; tt.seen += x.seen; });
    const sec = ss.find((x) => x.id === PF.sec);
    let html = `<p class="sum">Una carta per ogni personaggio di Ali di Rondine. Le carte si sbloccano parlando con i personaggi; chi non hai ancora incontrato è una sagoma. Finisci una saga e le sue carte diventano <b style="color:#ffd23f">d'oro</b>.<br>Incontrati: <b>${tt.seen}/${tt.tot}</b></p><div class="pbar"><i style="width:${Math.max(2, Math.round((tt.seen / Math.max(1, tt.tot)) * 100))}%"></i></div>`;
    if (!sec) {
      html += `<div class="sec"><span>Sezioni</span><span>${ss.filter((x) => x.seen === x.ids.length).length}/${ss.length} complete</span></div>`;
      html += ss.map((x) => `<div class="psec${x.gold ? " gold" : ""}" data-sec="${x.id}"><div class="pe">${x.e}</div><div><b>${esc(x.t)}</b><span>${x.gold ? "✨ Carte d'oro · " : ""}${x.seen === x.ids.length ? "Sezione completa" : x.seen ? "Ancora " + (x.ids.length - x.seen) + " da incontrare" : "Nessuno incontrato, per ora"}</span><div class="pbar"><i style="width:${Math.max(2, Math.round((x.seen / x.ids.length) * 100))}%"></i></div></div><div class="n">${x.seen}/${x.ids.length}</div></div>`).join("");
      body.innerHTML = html;
      body.querySelectorAll("[data-sec]").forEach((b) => (b.onclick = () => { PF.sec = b.dataset.sec; PF.f = "tutti"; openPersonaggi(); OV.scrollTop = 0; }));
      return;
    }
    html += `<div class="row" style="margin-top:12px"><button type="button" class="chip" data-back>◂ Tutte le sezioni</button>${[["tutti", "Tutti"], ["visti", "Incontrati"], ["mancano", "Da incontrare"]].map(([k, l]) => `<button type="button" class="chip${PF.f === k ? " on" : ""}" data-f="${k}">${l}</button>`).join("")}</div>`;
    html += `<div class="sec"><span>${sec.e} ${esc(sec.t)}${sec.gold ? " · ✨ oro" : ""}</span><span>${sec.seen}/${sec.ids.length}</span></div>`;
    const list = sec.ids.map((id, i) => ({ id, n: i + 1, ok: sec.has(id) })).filter((c) => PF.f === "tutti" || (PF.f === "visti" ? c.ok : !c.ok));
    html += `<div class="pgrid">${list.map((c) => `<div class="pc${c.ok ? "" : " miss"}${c.ok && sec.gold ? " gold" : ""}" data-pid="${esc(c.id)}"><span class="no">n. ${String(c.n).padStart(3, "0")}</span><img alt="" data-img="${esc(c.id)}" data-ok="${c.ok ? 1 : 0}"><div class="nm">${c.ok ? esc(nameOf(c.id)) : "???"}</div></div>`).join("") || `<p class="sum">Niente qui.</p>`}</div>`;
    body.innerHTML = html;
    body.querySelector("[data-back]").onclick = () => { PF.sec = null; openPersonaggi(); };
    body.querySelectorAll("[data-f]").forEach((b) => (b.onclick = () => { PF.f = b.dataset.f; openPersonaggi(); }));
    body.querySelectorAll("[data-pid]").forEach((b) => (b.onclick = () => perCard(sec, b.dataset.pid)));
    // i ritratti si disegnano a gruppi, così la pagina si apre subito anche con cento carte
    const imgs = [...body.querySelectorAll("[data-img]")], mine = OV;
    (function fill(i) { if (OV !== mine) return; imgs.slice(i, i + 10).forEach((im) => { const u = safe(() => perImg(im.dataset.img, im.dataset.ok === "1"), null); if (u) im.src = u; }); if (i + 10 < imgs.length) setTimeout(() => fill(i + 10), 16); })(0);
  }
  function perCard(sec, id) {
    if (!OV) return; const A = api(), ok = sec.has(id), n = sec.ids.indexOf(id) + 1, saga = sec.saga;
    const sh = document.createElement("div"); sh.className = "sheet";
    const enc = ok && safe(() => A.encHas(id), false);
    sh.innerHTML = `<div class="box"><div class="pbig${ok && sec.gold ? " gold" : ""}"><span class="no">n. ${String(n).padStart(3, "0")}</span><canvas width="300" height="300"></canvas></div><div class="in"><h3>${ok ? esc(nameOf(id)) : "???"}</h3><div><span class="tag" style="background:${saga ? GEN[saga.g[0]][1] : "#2c5f8a"}">${sec.e} ${esc(sec.t)}</span>${ok && sec.gold ? '<span class="tag" style="background:#b8902a">✨ Carta d\'oro</span>' : ""}</div><p>${ok ? esc(A.BIO[id] || "") : "Non l'hai ancora incontrato. Quando ci parlerai, qui comparirà la sua storia."}</p><div class="act">${enc ? '<button type="button" class="ghost" data-enc>Enciclopedia</button>' : ""}${saga && available(saga) ? `<button type="button" class="play" data-play>${state(saga).started ? "Continua la saga" : "Gioca la saga"}</button>` : ""}<button type="button" class="ghost" data-x>Chiudi</button></div></div></div>`;
    OV.appendChild(sh);
    perDraw(sh.querySelector("canvas").getContext("2d"), id, ok, 300, 2.4, 118);
    sh.onclick = (e) => { if (e.target === sh) sh.remove(); };
    sh.querySelector("[data-x]").onclick = () => sh.remove();
    const pl = sh.querySelector("[data-play]"); if (pl) pl.onclick = () => play(saga, () => openPersonaggi());
    const en = sh.querySelector("[data-enc]"); if (en) en.onclick = () => { close(); if (!A.encOpen(id, () => openPersonaggi())) openPersonaggi(); };
  }

  // ---------------------------------------------------------------- GUARDAROBA
  const KIND = { shirt: ["Maglie", "shirt", "👕"], hairc: ["Colori capelli", "hair", "🎨"], style: ["Tagli", "style", "💇"], acc: ["Accessori", "acc", "🧢"], shot: ["Tiri speciali", "shot", "⚡"], other: ["Da collezione", null, "🏅"] };
  const SRC = [["rf_", "📻 Radio Fuorigioco"], ["lb_", "📖 Libro"], ["dt_", "🪞 Doppio Turno"], ["cr_", "💎 Cristalli"], ["mu_", "🧱 Il Muro"], ["vl_", "⛰️ Vallombra"], ["kb_", "👑 Kronenburg"], ["al_", "⚗️ Alchimia"], ["pi_", "🏴‍☠️ Pirati"], ["omb_", "🌃 Ombre"], ["sh_", "⚔️ Shogun"], ["feudi_", "⚖️ Bilancia"], ["bv_", "🌲 Belovodia"], ["rag_", "🔥 Ragnarok"]];
  const srcOf = (id) => { const s = SRC.find(([p]) => id.startsWith(p)); return s ? s[1] : "⚽ Borgo e Storia"; };
  const kindOf = (c) => (c && KIND[c.kind] ? c.kind : "other");
  const GF = { kind: "shirt", src: "", sel: null };
  function openGuardaroba(back) {
    if (back) BK.gua = back; BACK = BK.gua; const body = shell("👕 Guardaroba"), A = api(), C = A.COSM || {}, own = new Set(safe(() => A.cosOwned(), [])), h = hero();
    if (!h) { body.innerHTML = `<p class="sum">Il Guardaroba veste il tuo Campione. Prima crealo: nome, numero, look e tiro speciale.</p><div class="big"><button type="button" data-hero>⭐ Crea il tuo Campione<small>Ci vuole un minuto</small></button></div>`; body.querySelector("[data-hero]").onclick = () => { close(); if (window.heroEditor) window.heroEditor(() => openGuardaroba()); }; return; }
    const ids = Object.keys(C), order = safe(() => A.cosOrder(), []).filter((k) => C[k]);
    const recent = order.slice(-6).reverse();
    const inK = ids.filter((k) => kindOf(C[k]) === GF.kind && (!GF.src || srcOf(k) === GF.src));
    const ownedN = ids.filter((k) => own.has(k)).length;
    const sel = GF.sel && C[GF.sel] ? GF.sel : null;
    let html = `<div class="prev"><canvas width="300" height="300" aria-label="Anteprima del Campione"></canvas><div class="w"><b>${esc(h.name)}</b> · n. ${esc(h.num)}<br>${sel ? `In prova: <b>${esc(C[sel].label)}</b><br><span style="color:#c9d2ea">${own.has(sel) ? "È tuo: puoi indossarlo." : "Ancora da sbloccare: " + esc(C[sel].from || "")}</span>` : `Hai sbloccato <b>${ownedN}</b> cosmetici su ${ids.length}.<br><span style="color:#c9d2ea">Tocca un capo per provarlo sul Campione.</span>`}<div class="act" style="display:flex;gap:8px;margin-top:8px">${sel && own.has(sel) && KIND[kindOf(C[sel])][1] ? `<button type="button" class="chip on" data-wear>✓ Indossa</button>` : ""}${sel ? `<button type="button" class="chip" data-unsel>Togli la prova</button>` : ""}</div></div></div>`;
    if (recent.length && !sel) html += `<div class="sec"><span>Ultimi sblocchi</span></div><div class="items">${recent.map((k) => item(k, C[k], own.has(k), h)).join("")}</div>`;
    html += `<div class="row" style="margin-top:14px">${Object.entries(KIND).map(([k, v]) => { const n = ids.filter((i) => kindOf(C[i]) === k); return n.length ? `<button type="button" class="chip${GF.kind === k ? " on" : ""}" data-k="${k}">${v[2]} ${v[0]} ${n.filter((i) => own.has(i)).length}/${n.length}</button>` : ""; }).join("")}</div>`;
    const srcs = [...new Set(ids.filter((k) => kindOf(C[k]) === GF.kind).map(srcOf))];
    html += `<div class="row">${[["", "Tutte le provenienze"], ...srcs.map((x) => [x, x])].map(([k, l]) => `<button type="button" class="chip${GF.src === k ? " on" : ""}" data-src="${esc(k)}">${esc(l)}</button>`).join("")}</div>`;
    const sorted = inK.sort((a, b) => (own.has(b) - own.has(a)) || (C[a].label || "").localeCompare(C[b].label || ""));
    html += `<div class="items">${sorted.map((k) => item(k, C[k], own.has(k), h)).join("") || `<p class="sum">Niente qui.</p>`}</div>`;
    body.innerHTML = html;
    drawPreview(body.querySelector("canvas"), h, sel ? C[sel] : null);
    body.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => { GF.kind = b.dataset.k; GF.src = ""; openGuardaroba(); }));
    body.querySelectorAll("[data-src]").forEach((b) => (b.onclick = () => { GF.src = b.dataset.src; openGuardaroba(); }));
    body.querySelectorAll("[data-id]").forEach((b) => (b.onclick = () => { GF.sel = b.dataset.id; openGuardaroba(); OV.scrollTop = 0; }));
    const un = body.querySelector("[data-unsel]"); if (un) un.onclick = () => { GF.sel = null; openGuardaroba(); };
    const wr = body.querySelector("[data-wear]"); if (wr) wr.onclick = () => { const c = C[sel], f = KIND[kindOf(c)][1], nh = Object.assign({}, h, { [f]: c.val }); if (f === "acc") nh.accId = sel; A.heroSave(nh); GF.sel = null; if (window.toast) window.toast("Indossato: " + c.label, "success", "👕"); openGuardaroba(); };
  }
  function worn(h, c) { const f = KIND[kindOf(c)][1]; return !!(f && h[f] === c.val); }
  function item(k, c, owned, h) {
    const kind = kindOf(c), isCol = /^#[0-9a-f]{3,8}$/i.test(String(c.val || ""));
    const sw = isCol ? `<div class="sw" style="background:${c.val}">${kind === "shirt" ? "👕" : ""}</div>` : `<div class="sw" style="background:#0b1026">${KIND[kind][2]}</div>`;
    return `<div class="it${owned ? "" : " lock"}${GF.sel === k ? " sel" : ""}${owned && worn(h, c) ? " on" : ""}" data-id="${esc(k)}" title="${esc(c.from || "")}">${owned ? (worn(h, c) ? '<span class="k">✓</span>' : "") : '<span class="k">🔒</span>'}${sw}<div class="n">${esc(c.label || k)}</div></div>`;
  }
  function drawPreview(cv, h, c) {
    const A = api(), g = cv.getContext("2d"); if (!A || !A.portraitTo) return;
    const gr = g.createLinearGradient(0, 0, 0, 300); gr.addColorStop(0, "#24386b"); gr.addColorStop(1, "#0b1026"); g.fillStyle = gr; g.fillRect(0, 0, 300, 300);
    g.fillStyle = "rgba(255,210,63,.12)"; g.beginPath(); g.arc(150, 120, 110, 0, 7); g.fill();
    const look = Object.assign({}, h); if (c && KIND[kindOf(c)][1]) { look[KIND[kindOf(c)][1]] = c.val; if (KIND[kindOf(c)][1] === "acc") look.accId = GF.sel; }
    safe(() => { A.heroCast(look); A.portraitTo(g, "hero", 150, 112, 2.25); }); safe(() => A.heroCast(h));
    if (c && kindOf(c) === "shot") { g.fillStyle = "#ffd23f"; g.font = "bold 18px sans-serif"; g.textAlign = "center"; g.fillText("⚡ " + (c.label || ""), 150, 288); }
  }

  window.__salone = {
    open: (back) => openSalone(back), album: (back) => openAlbum(back), albero: (back, sagaId) => openAlbero(back, sagaId), diario: (back) => openDiario(back), diarioStato: () => safe(() => diarioData().tot, 0), salaGiochi: (back) => openSalaGiochi(back), machine: (id) => MACHINES.find((m) => m.id === id) || null, MACHINES, machineState: (id) => { const m = MACHINES.find((x) => x.id === id); return m ? sgState(m) : null; }, openMachine: (id, back) => { openSalaGiochi(back); const m = MACHINES.find((x) => x.id === id); if (m && sgState(m).open) sgMachine(m); }, heroLook: () => heroLook(), cineteca: (back) => openCineteca(back), guardaroba: (back) => openGuardaroba(back), openGuardarobaItem: (id, back) => { const A = api(), c = A && A.COSM && A.COSM[id]; if (c) { GF.kind = kindOf(c); GF.src = ""; GF.sel = id; } openGuardaroba(back); }, close, personaggi: (back) => openPersonaggi(back), openPersonaggioCard: (id, back) => { const ss = perSections(), sec = ss.find((x) => x.ids.includes(id)); if (sec) { PF.sec = sec.id; PF.f = "tutti"; openPersonaggi(back); perCard(sec, id); } else openPersonaggi(back); }, personaggiStato: () => safe(() => perTotals(), null),
    mappamondo: (back) => openMappamondo(back),
    summary: () => safe(() => { const t = totals(), A = api(), C = (A && A.COSM) || {}; return Object.assign(t, { cosOwned: safe(() => A.cosOwned().length, 0), cosTot: Object.keys(C).length }); }, { n: 0, run: 0, fin: 0, fe: 0, te: 0, cosOwned: 0, cosTot: 0 }),
    SAGAS,
    sagaStatus: (id) => { const s = SAGAS.find((x) => x.id === id); if (!s) return null; const avail = available(s); const st = avail ? state(s) : null; return { avail, started: !!(st && st.started), finished: !!(st && st.finished), ch: st ? st.ch : 0 }; },
    openSaga: (id, back) => { openSalone(back); const s = SAGAS.find((x) => x.id === id); if (s && available(s)) detail(s); },
    // ultima saga giocata, per «Riprendi» nella home
    lastSaga: () => safe(() => { const s = SAGAS.find((x) => x.id === rec().last); return s && available(s) ? { id: s.id, t: s.t, e: s.e, cover: cover(s) } : null; }, null),
    resume: (back) => safe(() => { const s = SAGAS.find((x) => x.id === rec().last); if (s) play(s, back); }),
    // saga conclusa (tutti i capitoli o almeno un finale trovato): serve ai mazzi di Carte del Destino
    concluded: (key) => safe(() => { const s = SAGAS.find((x) => x.key === key); if (!s) return false; const x = state(s); return !!(x.finished || x.endsFound > 0); }, false),
  };
  try { if (window.__titleRefresh) window.__titleRefresh(); } catch {}
})();
