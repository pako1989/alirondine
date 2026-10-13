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
  const rec = () => { const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "{}"), {}); return { v: 1, seen: r.seen && typeof r.seen === "object" ? r.seen : {}, last: typeof r.last === "string" ? r.last : "" }; };
  const recSave = (r) => safe(() => localStorage.setItem(KEY, JSON.stringify(r)));
  const hero = () => safe(() => window.heroLoad && window.heroLoad(), null);

  // ---------------------------------------------------------------- il catalogo delle saghe
  const GEN = { fantasy: ["Fantasy", "#7a4ab0"], mistero: ["Mistero", "#2c6a9a"], scifi: ["Fantascienza", "#1f8a8a"], storico: ["Storico", "#a8622a"], commedia: ["Commedia", "#c9921a"], sport: ["Sport anime", "#c0392b"], avventura: ["Avventura", "#3f8a3f"], dramma: ["Drammatico", "#6a5a7a"], tattica: ["Tattica", "#5a6a3a"] };
  // mod: oggetto window con menuEntry/info · fn: funzione window da chiamare con (indietro) · ch: capitoli totali (se noti)
  const SAGAS = [
    { id: "razzo", t: "Razzopacco · Consegne dal Futuro", e: "🚀", g: ["commedia", "scifi"], mod: "__razzo", key: "ali-di-rondine.razzo", ch: 3, cover: "rz_titolo", d: "Ti risvegli nel 3011 e fai il corriere spaziale per una ditta sgangherata. Tubi pneumatici sopra la città, consegne a tempo, la rotta fra un pianeta di minestra e una luna di uffici. Consegna a Rete: razzetti, pacchi e pianeti che curvano i lanci.",
      hints: { libera: "Serve aver vinto la Coppa.", fusione: "Serve aver ascoltato la storia di Orsola.", ritorno: "Serve aver tenuto il pacco misterioso sigillato.", pacco: "Segreto: tutti i francobolli, tutte le consegne in orario, nessuna partita lasciata a metà." } },
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
    { id: "vallombra", t: "Vallombra", e: "⛰️", g: ["avventura", "dramma"], mod: "__storiaCampione", key: "ali-di-rondine.storia-campione", ch: 8, cover: "vl_paese", d: "La Storia del Campione: un paese di montagna, una miniera e otto capitoli di vita." },
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
  const NEWEST = ["razzo", "quartiere", "titano", "ducati", "grigio", "colline", "campetto", "trono", "mondi", "lampioni", "stagione", "mantello", "cronache", "torneo", "spazio", "dopo", "detective", "vento", "muro", "cristalli", "doppio", "libro"];
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
.salOv .card .t{position:absolute;left:8px;right:8px;top:6px;font:800 14px/1.15 "M PLUS Rounded 1c",sans-serif;text-shadow:0 2px 3px #000,0 0 8px #000}
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
.salOv .pbig .no{position:absolute;left:8px;top:6px;font:900 12px sans-serif;color:#fff;text-shadow:0 1px 3px #000}
@media (max-width:360px){.salOv .grid{grid-template-columns:1fr 1fr;gap:8px}.salOv .prev{grid-template-columns:110px 1fr}.salOv .prev canvas{width:110px;height:110px}}`;
    document.head.appendChild(st);
  }
  let OV = null, BACK = null; const BK = { sal: null, alb: null, gua: null, per: null, sg: null, cin: null }; // ogni schermata ricorda da dove si era entrati
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
    { id: "consegna", t: "Consegna a Rete", e: "🚀", saga: "razzo", eng: "__consegna", d: "La partita di Razzopacco: guidi un razzetto col dito, il pallone è un pacco, i pianeti curvano i lanci, i tubi ti portano dall'altra parte.",
      opp: [{ name: "I Crostini", color: "#c8782a", style: "difensiva", players: [{ name: "Capitan Crostino" }, { name: "Grissino" }], keeper: { name: "Il Pane Raffermo" } }, { name: "Postini dell'Anello", color: "#3ab8c8", style: "contropiede", players: [{ name: "Saturnina" }, { name: "Rapido" }], keeper: { name: "L'Anulare" } }],
      boss: { name: "OmniPacco Galacticos", color: "#5a6ad8", style: "pressing", players: [{ name: "Orsola Monòpoli" }, { name: "Agente Zeta" }], keeper: { name: "Il Drone Omega" } },
      opts: (o, h, boss) => ({ title: `Consegna a Rete · contro ${o.name}`, us: "Razzopacco", usColor: "#ff8a3a", secs: boss ? 110 : 90, minutes: boss ? 90 : 60, hero: { name: h.name || "Tu" }, mate: { name: "Capitana Borea" }, opp: o, oppStyle: o.style }) },
    { id: "combo", t: "Combo di Squadra", e: "🦸", saga: "quartiere", eng: "__combo", d: "La partita degli Straordinari di Quartiere: scegli uno o due eroi a turno, i poteri si combinano, le combo si scoprono giocando.",
      opp: [{ name: "I Geometri", color: "#ffd23f", style: "difensiva", players: [{ name: "Il Capo" }, { name: "Squadra" }], keeper: { name: "Il Metro" } }, { name: "Le Ruspe", color: "#ffd23f", style: "pressing", players: [{ name: "Betoniera" }, { name: "Gru" }], keeper: { name: "Il Pilastro" } }],
      boss: { name: "Squadra Calcestruzzo", color: "#7a7a8a", style: "pressing", players: [{ name: "Il Dottor Cemento" }, { name: "Betoniera" }], keeper: { name: "Il Pilastro" } },
      opts: (o, h, boss) => ({ title: `Combo di Squadra · contro ${o.name}`, us: "Gli Straordinari", usColor: "#ff5a8a", minutes: boss ? 90 : 60, heroes: [{ name: h.name || "Il Copione", power: "scatto" }, { name: "Brina", power: "ghiaccio" }, { name: "Soffio", power: "vento" }, { name: "Scintilla", power: "fuoco" }], opp: o, known: ["bufera", "raffica"] }) },
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
  const FILT = { st: "tutte", g: "" };
  function totals() {
    const list = SAGAS.filter(available), st = list.map((s) => [s, state(s)]);
    let fe = 0, te = 0; st.forEach(([, x]) => { fe += x.endsFound; te += x.ends.length; });
    const story = safe(() => api().storyEndings(), []); fe += story.filter((e) => e.found).length; te += story.length;
    return { n: list.length, run: st.filter(([, x]) => x.started && !x.finished).length, fin: st.filter(([, x]) => x.finished).length, fe, te };
  }
  function openSalone(back) {
    if (back) BK.sal = back; BACK = BK.sal; const body = shell("🏛️ Salone delle Saghe"), r = rec(), tt = totals();
    const list = SAGAS.filter(available).map((s) => ({ s, x: state(s) }));
    const lastS = list.find((o) => o.s.id === r.last);
    let html = `<p class="sum">${tt.n} saghe · ${tt.run} in corso · ${tt.fin} concluse · finali trovati ${tt.fe}/${tt.te}</p>`;
    if (lastS) html += `<div class="cont" data-id="${lastS.s.id}"><img alt="" src="${cover(lastS.s)}"><div><b>▸ Continua: ${esc(lastS.s.t)}</b>${lastS.x.finished ? "Conclusa · rigioca o cerca gli altri finali" : `Capitolo ${lastS.x.ch}${lastS.s.ch ? ` di ${lastS.s.ch}` : ""}`}</div></div>`;
    html += `<div class="big"><button type="button" data-go="album">🏆 Album dei finali<small>${tt.fe}/${tt.te} timbri</small></button><button type="button" data-go="guarda">👕 Guardaroba<small>Prova e indossa ciò che hai sbloccato</small></button></div>`;
    html += `<div class="big"><button type="button" data-go="sala">🕹️ Sala Giochi<small>I motori di partita delle saghe, liberi</small></button><button type="button" data-go="cine">🎬 Cineteca<small>Rivedi i finali trovati</small></button></div>`;
    { const pt = safe(() => perTotals(), null); if (pt) html += `<div class="big"><button type="button" data-go="per">👥 Album dei personaggi<small>${pt.seen}/${pt.tot} incontrati · carte d'oro per le saghe concluse</small></button>${window.__sogni ? `<button type="button" data-go="sogni">🃏 La Squadra dei Sogni<small>Carte da collezionare, intesa e il Torneo dei Sogni</small></button>` : ""}</div>`; }
    html += `<div class="row">${[["tutte", "Tutte"], ["corso", "In corso"], ["nuove", "Da iniziare"], ["concluse", "Concluse"]].map(([k, l]) => `<button type="button" class="chip${FILT.st === k ? " on" : ""}" data-st="${k}">${l}</button>`).join("")}</div>`;
    html += `<div class="row">${[["", "Tutti i generi"], ...Object.entries(GEN).map(([k, v]) => [k, v[0]])].map(([k, l]) => `<button type="button" class="chip${FILT.g === k ? " on" : ""}" data-g="${k}">${l}</button>`).join("")}</div>`;
    const shown = list.filter(({ s, x }) => (FILT.st === "tutte" || (FILT.st === "corso" && x.started && !x.finished) || (FILT.st === "nuove" && !x.started) || (FILT.st === "concluse" && x.finished)) && (!FILT.g || s.g.includes(FILT.g)));
    html += `<div class="grid">${shown.map(({ s, x }) => {
      const isNew = !r.seen[s.id] && !x.started && NEWEST.includes(s.id);
      const badge = x.finished ? `<span class="badge done">✓ CONCLUSA</span>` : x.started ? `<span class="badge run">IN CORSO</span>` : isNew ? `<span class="badge new">NUOVA</span>` : "";
      const prog = x.pct != null && (x.started || x.finished) ? `<div class="pbar"><i style="width:${Math.max(4, x.pct)}%"></i></div>` : "";
      return `<div class="card" data-id="${s.id}"><img alt="" loading="lazy" src="${cover(s)}"><div class="t"><span class="e">${s.e}</span>${esc(s.t)}</div><div class="info">${s.g.map((k) => `<span class="tag" style="background:${GEN[k][1]}">${GEN[k][0]}</span>`).join("")}<div style="display:flex;justify-content:space-between;align-items:center;gap:6px"><span>${x.finished ? "Conclusa" : x.started ? `Capitolo ${x.ch}${s.ch ? `/${s.ch}` : ""}` : "Da iniziare"}</span>${x.ends.length ? `<span>🏆 ${x.endsFound}/${x.ends.length}</span>` : ""}</div>${prog}</div>${badge ? `<div class="stamp">${badge}</div>` : ""}</div>`;
    }).join("") || `<p class="sum">Nessuna saga con questo filtro.</p>`}</div>`;
    body.innerHTML = html;
    body.querySelectorAll("[data-st]").forEach((b) => (b.onclick = () => { FILT.st = b.dataset.st; openSalone(); }));
    body.querySelectorAll("[data-g]").forEach((b) => (b.onclick = () => { FILT.g = b.dataset.g; openSalone(); }));
    body.querySelectorAll(".card,.cont").forEach((b) => (b.onclick = () => detail(SAGAS.find((s) => s.id === b.dataset.id))));
    body.querySelector('[data-go="album"]').onclick = () => openAlbum(() => openSalone());
    body.querySelector('[data-go="guarda"]').onclick = () => openGuardaroba(() => openSalone());
    const pg = body.querySelector('[data-go="per"]'); if (pg) pg.onclick = () => openPersonaggi(() => openSalone());
    const sgb = body.querySelector('[data-go="sogni"]'); if (sgb) sgb.onclick = () => { close(); window.__sogni.open(() => openSalone()); };
    body.querySelector('[data-go="sala"]').onclick = () => openSalaGiochi(() => openSalone());
    body.querySelector('[data-go="cine"]').onclick = () => openCineteca(() => openSalone());
  }
  function detail(s) {
    if (!s || !OV) return; const x = state(s), r = rec(); r.seen[s.id] = 1; recSave(r);
    const sh = document.createElement("div"); sh.className = "sheet";
    const ends = x.ends.length ? `<div class="sec"><span>Finali</span><span>${x.endsFound}/${x.ends.length}</span></div><div class="ends">${x.ends.map((e) => endRow(e.found, e.title, e.found ? e.desc : (s.hints && s.hints[e.id]) || "Un finale ancora nascosto.")).join("")}</div>` : "";
    sh.innerHTML = `<div class="box"><img alt="" src="${cover(s)}"><div class="in"><h3>${s.e} ${esc(s.t)}</h3><div>${s.g.map((k) => `<span class="tag" style="background:${GEN[k][1]}">${GEN[k][0]}</span>`).join("")}</div><p>${esc(s.d)}</p><p style="color:#c9d2ea;font-size:13px">${x.finished ? "✓ Saga conclusa." : x.started ? `In corso · capitolo ${x.ch}${s.ch ? ` di ${s.ch}` : ""}${x.doneN ? ` · ${x.doneN} capitoli conclusi` : ""}.` : "Non l'hai ancora iniziata."}${s.ch ? ` ${s.ch} capitoli.` : ""}</p>${ends}<div class="act"><button type="button" class="ghost">◂ Indietro</button><button type="button" class="play">${x.started ? "Continua ▸" : "Gioca ▸"}</button></div></div></div>`;
    sh.onclick = (e) => { if (e.target === sh) sh.remove(); };
    sh.querySelector(".ghost").onclick = () => sh.remove();
    sh.querySelector(".play").onclick = () => play(s, () => openSalone());
    OV.appendChild(sh);
  }
  const endRow = (found, title, sub) => `<div class="end${found ? " f" : ""}"><div class="seal">${found ? "FINALE<br>TROVATO" : "?"}</div><div><b>${found ? esc(title) : "???"}</b><span>${found ? esc(sub) : "Indizio: " + esc(sub)}</span></div></div>`;

  // ---------------------------------------------------------------- ALBUM DEI FINALI
  function openAlbum(back) {
    if (back) BK.alb = back; BACK = BK.alb; const body = shell("🏆 Album dei finali"), tt = totals();
    let html = `<p class="sum">Un timbro per ogni finale trovato. Quelli mancanti hanno un indizio, senza svelare troppo. Totale: <b>${tt.fe}/${tt.te}</b>.</p>`;
    const story = safe(() => api().storyEndings(), []);
    if (story.length) {
      const groups = [...new Set(story.map((e) => e.group))];
      html += `<div class="sec"><span>⚽ Storia di Leo</span><span>${story.filter((e) => e.found).length}/${story.length}</span></div>`;
      groups.forEach((gname) => { const es = story.filter((e) => e.group === gname); html += `<div style="font-size:12.5px;color:#c9d2ea;margin:8px 0 2px">${esc(gname)}</div><div class="ends">${es.map((e) => endRow(e.found, e.title.replace(/^(Finale · |Stagione \d+ · )/, ""), e.found ? e.group : e.hint)).join("")}</div>`; });
    }
    SAGAS.filter(available).forEach((s) => { const x = state(s); if (!x.ends.length) return; html += `<div class="sec"><span>${s.e} ${esc(s.t)}</span><span>${x.endsFound}/${x.ends.length}</span></div><div class="ends">${x.ends.map((e) => endRow(e.found, e.title, e.found ? e.desc : (s.hints && s.hints[e.id]) || "Un finale ancora nascosto.")).join("")}</div>`; });
    body.innerHTML = html;
  }

  // ---------------------------------------------------------------- ALBUM DEI PERSONAGGI
  // ogni personaggio registrato nel gioco (window.__borgoApi.BIO) diventa una carta. Si «incontra» parlandoci (seeCard del gioco).
  // Le sezioni: la Storia e Borgo Marino, i tornei e le modalità del Borgo, e una sezione per saga (riconosciuta dal prefisso degli id).
  const PFX = { razzo: "rz", quartiere: "sq", titano: "ft", ducati: "td", grigio: "gr", colline: "ml", campetto: "cm", trono: "tc", mondi: "tm", lampioni: "nl", stagione: "sf", mantello: "mg", cronache: "cc", torneo: "ts", spazio: "so", dopo: "ep", detective: "dc", vento: "ve", muro: "mu", cristalli: "cr", doppio: "dt", libro: "lb", abisso: "abi", ragnarok: "rag", belovodia: "bv", bilancia: "fe", ombre: "omb", shogun: "sh", phantom: "pg", pirati: "pi", alchimia: "al", kronenburg: "kb", chrono: "chr", vallombra: "vl" };
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
  const SRC = [["lb_", "📖 Libro"], ["dt_", "🪞 Doppio Turno"], ["cr_", "💎 Cristalli"], ["mu_", "🧱 Il Muro"], ["vl_", "⛰️ Vallombra"], ["kb_", "👑 Kronenburg"], ["al_", "⚗️ Alchimia"], ["pi_", "🏴‍☠️ Pirati"], ["omb_", "🌃 Ombre"], ["sh_", "⚔️ Shogun"], ["feudi_", "⚖️ Bilancia"], ["bv_", "🌲 Belovodia"], ["rag_", "🔥 Ragnarok"]];
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
    open: (back) => openSalone(back), album: (back) => openAlbum(back), salaGiochi: (back) => openSalaGiochi(back), machine: (id) => MACHINES.find((m) => m.id === id) || null, heroLook: () => heroLook(), cineteca: (back) => openCineteca(back), guardaroba: (back) => openGuardaroba(back), close, personaggi: (back) => openPersonaggi(back), personaggiStato: () => safe(() => perTotals(), null),
    summary: () => safe(() => { const t = totals(), A = api(), C = (A && A.COSM) || {}; return Object.assign(t, { cosOwned: safe(() => A.cosOwned().length, 0), cosTot: Object.keys(C).length }); }, { n: 0, run: 0, fin: 0, fe: 0, te: 0, cosOwned: 0, cosTot: 0 }),
    SAGAS,
  };
  try { if (window.__titleRefresh) window.__titleRefresh(); } catch {}
})();
