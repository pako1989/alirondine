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
  const NEWEST = ["cronache", "torneo", "spazio", "dopo", "detective", "vento", "muro", "cristalli", "doppio", "libro"];
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
  let OV = null, BACK = null; const BK = { sal: null, alb: null, gua: null, per: null }; // ogni schermata ricorda da dove si era entrati
  function shell(title) { css(); close(); OV = document.createElement("div"); OV.className = "salOv"; OV.innerHTML = `<div class="wrap"><div class="bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="body"></div></div>`; OV.querySelector(".x").onclick = () => { const b = BACK; close(); if (typeof b === "function") b(); }; document.body.appendChild(OV); return OV.querySelector(".body"); }
  function close() { if (OV) { OV.remove(); OV = null; } }

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
    { const pt = safe(() => perTotals(), null); if (pt) html += `<div class="big"><button type="button" data-go="per">👥 Album dei personaggi<small>${pt.seen}/${pt.tot} incontrati · carte d'oro per le saghe concluse</small></button></div>`; }
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
  const PFX = { cronache: "cc", torneo: "ts", spazio: "so", dopo: "ep", detective: "dc", vento: "ve", muro: "mu", cristalli: "cr", doppio: "dt", libro: "lb", abisso: "abi", ragnarok: "rag", belovodia: "bv", bilancia: "fe", ombre: "omb", shogun: "sh", phantom: "pg", pirati: "pi", alchimia: "al", kronenburg: "kb", chrono: "chr", vallombra: "vl" };
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
    open: (back) => openSalone(back), album: (back) => openAlbum(back), guardaroba: (back) => openGuardaroba(back), close, personaggi: (back) => openPersonaggi(back), personaggiStato: () => safe(() => perTotals(), null),
    summary: () => safe(() => { const t = totals(), A = api(), C = (A && A.COSM) || {}; return Object.assign(t, { cosOwned: safe(() => A.cosOwned().length, 0), cosTot: Object.keys(C).length }); }, { n: 0, run: 0, fin: 0, fe: 0, te: 0, cosOwned: 0, cosTot: 0 }),
    SAGAS,
  };
  try { if (window.__titleRefresh) window.__titleRefresh(); } catch {}
})();
