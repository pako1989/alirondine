// js/sogni.js - LA SQUADRA DEI SOGNI (Salone delle Saghe → 🃏 La Squadra dei Sogni)
// Un premio nuovo da collezionare: le CARTE DEI SOGNI, una per ogni personaggio importante delle saghe, con il ritratto,
// la rarità (comune, rara, epica, leggendaria), tre valori (attacco, difesa, tecnica) e l'effetto olografico.
//  - Le carte si sbloccano giocando: un capitolo concluso sblocca le comuni della saga, due le rare, la saga finita le
//    epiche, tutti i finali le leggendarie. Le BUSTINE (monete) danno una carta a sorpresa delle saghe che hai cominciato.
//  - La SQUADRA: cinque carte. L'INTESA sale con due personaggi della stessa saga (+1) e con i LEGAMI speciali tra
//    personaggi di saghe diverse (+3): maestri, rivali, chi sa tutto, chi ha visto il '52…
//  - Il TORNEO DEI SOGNI: otto sfide, ognuna nel motore originale di una saga (Vignette, ATB, Super-Bottoni, il Nastro,
//    Luci, il Concilio, il Duello Cinematico, la Lavagna Tattica). La squadra dà vantaggi diversi in ogni motore: grinta,
//    credibilità, tiri, lanterne, riavvolgimenti, giocatori in lavagna. Vincere tutto vale la carta del Campione dei Sogni.
//  - Vallombra e le saghe a capitoli (Kronenburg, Pirati, Alchimia, Chrono-Break, Ombre, Ragnarok, Belovodia, Bilancia, Shogun, Phantom, Abisso,
//    Muro, Cristalli, Doppio Turno, Libro): carte che si sbloccano a capitolo concluso (info() della saga) e non escono mai a sorpresa prima.
// Salvataggio proprio: ali-di-rondine.sogni { own:[id], team:[id×5], won:[sfida], packs }.
(function () {
  "use strict";
  if (window.__sogni) return;
  const KEY = "ali-di-rondine.sogni", PACK = 120;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  // le saghe da cui vengono le carte: chiave di salvataggio, nome, colore
  const SAGHE = {
    borgo: ["ali-di-rondine.stagione1", "Ali di Rondine · Borgo Marino", "#ff7a45", ""],
    sigilli: ["ali-di-rondine.sigilli", "L'Accademia dei Sigilli", "#6366f1", "__sigilli"],
    fortino: ["ali-di-rondine.fortino", "Colpo al Fortino", "#38bdf8", "__fortino"],
    note: ["ali-di-rondine.note", "Tactics Note · Il Quaderno del Giudizio", "#64748b", "__note"],
    cenere: ["ali-di-rondine.cenere", "Cenere e Gloria", "#d97706", "__cenere"],
    officina: ["ali-di-rondine.officina", "L'Officina dei Giganti di Ruggine", "#d97706", "__officina"],
    mondiale: ["ali-di-rondine.mondiale", "Ali di Rondine · Mondiale Giovanile", "#2563eb", "__mondiale"],
    cavaliere: ["ali-di-rondine.cavaliere", "Il Cavaliere del Fischio", "#facc15", "__cavaliere"],
    gala: ["ali-di-rondine.gala", "Il Rapimento del Pallone d'Oro", "#d4a73a", "__gala"],
    diga: ["ali-di-rondine.diga", "La Diga di Valpiana", "#38bdf8", "__diga"],
    vuota: ["ali-di-rondine.vuota", "Operazione Scatola Vuota", "#facc15", "__vuota"],
    circuiti: ["ali-di-rondine.circuiti", "Neo-Rondine 2099", "#22d3ee", "__circuiti"],
    replica: ["ali-di-rondine.replica", "Eroi in Replica", "#38bdf8", "__replica"],
    figurine: ["ali-di-rondine.figurine", "Cacciatori di Figurine", "#a855f7", "__figurine"],
    capitani: ["ali-di-rondine.capitani", "Capitani di Ventura", "#b45309", "__capitani"],
    fischietto: ["ali-di-rondine.fischietto", "Il Fischietto · Arbitro di Provincia", "#ca8a04", "__fischietto"],
    rotta: ["ali-di-rondine.rotta", "Rotta 66 · Il Gigante Stanco", "#f59e0b", "__rotta"],
    quattordici: ["ali-di-rondine.quattordici", "Il Torneo dei Quattordici", "#dc2626", "__quattordici"],
    spia: ["ali-di-rondine.spia", "Operazione Doppio Zero", "#10b981", "__spia"],
    fiume: ["ali-di-rondine.fiume", "La Carovana del Fiume d'Argento", "#0284c7", "__fiume"],
    milano: ["ali-di-rondine.milano", "Operazione Fuorigioco Noir", "#64748b", "__milano"],
    gp: ["ali-di-rondine.gp", "Gran Premio del Pallone", "#ffb02a", "__gp"],
    tempo: ["ali-di-rondine.tempo", "Rondine 1938-2038", "#ffb347", "__tempo"],
    dungeon: ["ali-di-rondine.dungeon", "Dungeon di Fine Stagione", "#ff7a1a", "__dungeon"],
    torneo: ["ali-di-rondine.torneo", "Il Torneo delle Cento Scuole", "#c83a3a"], cronache: ["ali-di-rondine.cronache", "Le Cronache del Pallone di Cristallo", "#7a4ab0"], mantello: ["ali-di-rondine.mantello", "Il Mantello Granata", "#8a1a2a"],
    stagione: ["ali-di-rondine.stagione", "Stagione Infinita", "#ff5a7a"], lampioni: ["ali-di-rondine.lampioni", "La Notte dei Lampioni", "#ffd27a"], trono: ["ali-di-rondine.trono", "Il Trono di Cuoio", "#8a5a2a"],
    campetto: ["ali-di-rondine.campetto", "Dal Campetto al Mondiale", "#1f5fbf"], colline: ["ali-di-rondine.colline", "Master League delle Colline", "#2a6a3a"], grigio: ["ali-di-rondine.grigio", "Il Cavaliere della Notte", "#2a3040"], ducati: ["ali-di-rondine.ducati", "La Guerra dei Tre Ducati", "#c8a040"], titano: ["ali-di-rondine.titano", "Il Figlio del Titano", "#c83a2a"], quartiere: ["ali-di-rondine.quartiere", "Gli Straordinari di Quartiere", "#ff5a8a"], razzo: ["ali-di-rondine.razzo", "Razzopacco · Consegne dal Futuro", "#ff8a3a"], cavallo: ["ali-di-rondine.cavallo", "Il Cavallo Star", "#ff7aa8"], detective: ["ali-di-rondine.detective", "Detective di Campo", "#3a4a5a"],
    spazio: ["ali-di-rondine.spazio", "Calcio Spaziale", "#2a6ac8"], vento: ["ali-di-rondine.vento", "La Valle del Vento Gentile", "#5a9a7a"], dopo: ["ali-di-rondine.dopo", "Dopo il Campione", "#a8622a"], mondi: ["ali-di-rondine.mondi", "Il Torneo dei Mondi", "#2a1a4a"],
    // saghe a capitoli: il 4° elemento è il modulo che espone info() (poi si ripiega sul salvataggio)
    montagna: ["ali-di-rondine.montagna", "Piccolo Borgo di Montagna", "#0284c7", "__montagna"],
    pugno: ["ali-di-rondine.pugno", "Per un pugno di rigori", "#ea580c", "__pugno"],
    roma: ["ali-di-rondine.roma", "Ave Calcio! · I Gladiatori del Pallone", "#b91c1c", "__roma"],
    galletta: ["ali-di-rondine.galletta", "S.O.S. Galletta: I Bucanieri del Biscotto", "#d97706", "__galletta"],
    naufraghi: ["ali-di-rondine.naufraghi", "Naufraghi del Pallone", "#0e9aa7", "__naufraghi"],
    piramide: ["ali-di-rondine.piramide", "La Piramide del Sole", "#f59e0b", "__piramide"],
    alcatraz: ["ali-di-rondine.alcatraz", "Fuga da Alcatraz FC", "#38bdf8", "__alcatraz"],
    treno: ["ali-di-rondine.treno", "L'Espresso delle Ombre", "#38bdf8", "__treno"],
    campana: ["ali-di-rondine.campana", "La Notte dei Cento Rintocchi", "#ca8a04", "__campana"],
    regno: ["ali-di-rondine.regno", "Cronache del Regno Ultimo", "#a82a3a", "__regno"],
    vallombra: ["ali-di-rondine.storia-campione", "Vallombra", "#6a8aa8", "__storiaCampione"], kronenburg: ["ali-di-rondine.kronenburg-story", "Kronenburg", "#8a1a2a", "__kronenburgStory"], pirati: ["ali-di-rondine.pirati-story", "I Pirati della Tempesta Celeste", "#2a8ac8", "__piratiStory"],
    alchimia: ["ali-di-rondine.alchimia-story", "L'Alchimia d'Acciaio", "#b0762a", "__alchimiaStory"], chrono: ["ali-di-rondine.chrono-story", "Chrono-Break", "#c8a22a", "__chronoStory"], ombre: ["ali-di-rondine.campione-ombre", "Il Circuito delle Ombre", "#1a3a5a", "__campioneOmbre"],
    ragnarok: ["ali-di-rondine.ragnarok", "Ragnarok Ball", "#9a3a1a", "__ragnarokStory"], belovodia: ["ali-di-rondine.belovodia-story", "Belovodia", "#4a7a8a", "__belovodiaStory"], bilancia: ["ali-di-rondine.bilancia-feudi", "La Bilancia delle Tre Corone", "#6a5a8a", "__bilanciaFeudi"],
    shogun: ["ali-di-rondine.shogun-story", "Shogun Eclipse", "#a02a3a", "__shogunStory"], phantom: ["ali-di-rondine.phantom-genesis", "Phantom Genesis", "#5a2a8a", "__phantomGenesis"], abisso: ["ali-di-rondine.abisso-story", "Abisso di Dunwich", "#1a4a5a", "__abissoStory"],
    muro: ["ali-di-rondine.muro", "Il Muro", "#6a6a5a", "__muro"], cristalli: ["ali-di-rondine.cristalli", "Cristalli del Campo", "#3a9ac8", "__cristalli"], doppio: ["ali-di-rondine.doppio-turno", "Doppio Turno", "#7a7a9a", "__doppioTurno"], libro: ["ali-di-rondine.libro-finali", "Il Libro che Mangiava i Finali", "#a8782a", "__libroFinali"],
  };
  const SG = (k) => SAGHE[k] || ["ali-di-rondine." + k, k, "#94a3b8", ""]; // una saga mancante nella tabella non deve rompere la Squadra dei Sogni
  // le carte delle saghe a capitoli (Vallombra e le altre): il 8° valore è il capitolo che le sblocca, una volta concluso.
  // Mai nelle bustine, nei premi a sorpresa e nel Draft finché non sono guadagnate: niente anticipazioni.
  const NEWC = [
    // Ali di Rondine · Borgo Marino (Storia Principale, Stagioni 1-5)
    ["leo", "borgo", "l", 88, 66, 90, "A", 1], ["nico", "borgo", "e", 50, 90, 74, "P", 1],
    ["tommy", "borgo", "r", 66, 64, 86, "C", 1], ["sara", "borgo", "r", 56, 70, 88, "C", 1],
    ["ruggeri", "borgo", "e", 64, 82, 86, "D", 1], ["papa", "borgo", "e", 84, 68, 80, "A", 1],
    ["kenji", "borgo", "e", 86, 62, 84, "A", 1], ["baciccia", "borgo", "c", 52, 80, 62, "P", 1],
    ["pina", "borgo", "c", 54, 62, 78, "C", 1], ["rocco", "borgo", "c", 74, 70, 58, "A", 1], ["mattia", "borgo", "c", 46, 82, 60, "P", 1],
    ["dario", "borgo", "l", 90, 68, 88, "A", 2], ["lina", "borgo", "r", 58, 86, 76, "D", 2],
    ["bruno", "borgo", "e", 84, 72, 78, "A", 2], ["kevin", "borgo", "r", 78, 58, 72, "A", 2],
    ["sho", "borgo", "e", 86, 64, 82, "A", 3], ["jojo", "borgo", "l", 92, 64, 90, "A", 3],
    ["marta", "borgo", "e", 62, 80, 88, "C", 3], ["saverio", "borgo", "r", 58, 86, 62, "D", 3],
    ["vitale", "borgo", "e", 70, 86, 78, "D", 4], ["ernesta", "borgo", "e", 52, 90, 80, "P", 4], ["nonna", "borgo", "r", 60, 76, 84, "D", 4],
    ["keller", "borgo", "l", 90, 72, 84, "A", 5],
    // Capitani di Ventura
    ["cv_gemma", "capitani", "e", 84, 58, 78, "A", 1], ["cv_brenno", "capitani", "r", 58, 88, 56, "D", 1],
    ["cv_isotta", "capitani", "c", 56, 62, 84, "C", 2], ["cv_conte", "capitani", "l", 80, 76, 82, "C", 4],
    // Il Fischietto
    ["fi_pino", "fischietto", "c", 50, 74, 62, "D", 1], ["fi_livia", "fischietto", "r", 58, 66, 88, "C", 1],
    ["fi_dante", "fischietto", "e", 82, 60, 70, "A", 2], ["fi_edvige", "fischietto", "l", 70, 72, 92, "C", 3],
    // Cacciatori di Figurine
    ["fg_ginestra", "figurine", "c", 54, 62, 78, "C", 1], ["fg_ottone", "figurine", "c", 58, 60, 66, "D", 1],
    ["fg_nives", "figurine", "e", 82, 66, 80, "A", 1], ["fg_rosa", "figurine", "r", 60, 70, 82, "C", 3],
    ["fg_cora", "figurine", "l", 86, 74, 88, "A", 4],
    // L'Officina dei Giganti di Ruggine
    ["of_gasparre", "officina", "c", 52, 60, 80, "D", 1], ["of_rina", "officina", "r", 66, 76, 72, "C", 1],
    ["of_volta", "officina", "c", 70, 58, 62, "A", 2], ["of_ferro", "officina", "r", 78, 70, 66, "B", 2],
    ["of_vanda", "officina", "e", 84, 72, 78, "C", 3], ["of_brontolo", "officina", "e", 74, 86, 70, "D", 1],
    ["of_titano", "officina", "l", 90, 84, 92, "B", 3], ["of_apprendista", "officina", "c", 56, 54, 60, "B", 1],
    // Il Rapimento del Pallone d'Oro
    ["pd_teresa", "gala", "c", 52, 66, 72, "D", 1], ["pd_arturo", "gala", "c", 50, 80, 58, "D", 1],
    ["pd_livia", "gala", "r", 62, 62, 82, "C", 1], ["pd_zeno", "gala", "r", 86, 54, 78, "B", 2],
    ["pd_clio", "gala", "c", 60, 56, 80, "C", 2], ["pd_gualtiero", "gala", "c", 56, 70, 62, "D", 2],
    ["pd_ospite", "gala", "e", 70, 76, 90, "B", 3], ["pd_delmonte", "gala", "l", 80, 88, 86, "B", 3],
    // Il Cavaliere del Fischio
    ["cf_fulgenzio", "cavaliere", "c", 50, 78, 60, "D", 1], ["cf_brandi", "cavaliere", "c", 58, 66, 70, "C", 1],
    ["cf_zeppa", "cavaliere", "c", 66, 60, 64, "C", 1], ["cf_micia", "cavaliere", "r", 90, 62, 74, "B", 2],
    ["cf_spillo", "cavaliere", "r", 60, 84, 70, "C", 2], ["cf_diva", "cavaliere", "r", 64, 76, 82, "C", 2],
    // Ali di Rondine · Mondiale Giovanile
    ["mg_gallo", "mondiale", "c", 52, 82, 66, "D", 1], ["mg_mara", "mondiale", "c", 56, 72, 74, "C", 1],
    ["mg_teo", "mondiale", "c", 60, 80, 62, "D", 1], ["mg_sandro", "mondiale", "c", 54, 84, 60, "D", 1],
    ["mg_elio", "mondiale", "r", 72, 62, 88, "C", 2], ["mg_nina", "mondiale", "r", 90, 60, 74, "B", 2],
    ["mg_bruno", "mondiale", "r", 86, 70, 66, "B", 2], ["mg_duarte", "mondiale", "r", 70, 66, 90, "C", 2],
    ["mg_lukas", "mondiale", "r", 66, 86, 68, "D", 2], ["mg_tico", "mondiale", "e", 92, 58, 84, "B", 3],
    ["mg_wolff", "mondiale", "e", 68, 88, 80, "C", 3], ["mg_ren", "mondiale", "l", 88, 80, 94, "B", 3],
    ["cf_lucre", "cavaliere", "e", 70, 80, 86, "B", 3], ["cf_pierrot", "cavaliere", "l", 82, 90, 88, "B", 3],
    // La Diga di Valpiana
    ["vp_tilde", "diga", "c", 54, 62, 78, "C", 1], ["vp_gino", "diga", "c", 60, 74, 66, "C", 1], ["vp_lorenza", "diga", "c", 50, 58, 80, "D", 1],
    ["vp_zattera", "diga", "r", 62, 80, 70, "C", 1], ["vp_valvola", "diga", "c", 46, 64, 74, "D", 2], ["vp_ermete", "diga", "r", 58, 92, 72, "B", 2],
    ["vp_capo", "diga", "r", 70, 84, 58, "C", 3], ["vp_zita", "diga", "e", 76, 70, 94, "B", 3],
    // Operazione Scatola Vuota
    ["vs_mira", "vuota", "c", 56, 64, 80, "C", 1], ["vs_ghiro", "vuota", "c", 44, 72, 58, "D", 1], ["vs_corvo", "vuota", "r", 66, 84, 62, "D", 1],
    ["vs_ottone", "vuota", "e", 74, 62, 86, "C", 2], ["vs_brace", "vuota", "r", 80, 56, 72, "A", 2], ["vs_pio", "vuota", "c", 40, 68, 52, "P", 2],
    ["vs_vulpe", "vuota", "r", 52, 60, 88, "C", 3], ["vs_lastra", "vuota", "r", 54, 90, 60, "P", 3],
    ["vs_eco", "vuota", "e", 78, 70, 90, "C", 4], ["vs_sipario", "vuota", "l", 72, 82, 94, "B", 4],
    // Neo-Rondine 2099
    ["nr_kira", "circuiti", "r", 70, 60, 84, "C", 1], ["nr_jax", "circuiti", "c", 66, 70, 60, "B", 1],
    ["nr_bolt", "circuiti", "c", 50, 62, 66, "D", 1], ["nr_volt", "circuiti", "c", 54, 58, 70, "D", 1],
    ["nr_nyx", "circuiti", "r", 60, 74, 82, "C", 2], ["nr_vance", "circuiti", "c", 52, 60, 76, "D", 2],
    ["nr_vektor", "circuiti", "e", 78, 82, 86, "B", 3], ["nr_zero", "circuiti", "l", 94, 92, 88, "B", 3],
    // Eroi in Replica
    ["rp_brezza", "replica", "r", 68, 64, 80, "C", 1], ["rp_marta", "replica", "c", 52, 66, 74, "D", 1],
    ["rp_basalto", "replica", "r", 76, 80, 58, "B", 1], ["rp_nube", "replica", "r", 80, 62, 70, "A", 2],
    ["rp_sabbioni", "replica", "e", 60, 70, 88, "C", 3], ["rp_ilario", "replica", "c", 50, 54, 72, "D", 2],
    ["rp_teodora", "replica", "c", 48, 60, 82, "D", 2], ["rp_zenit", "replica", "l", 92, 88, 90, "B", 3],
    // Rotta 66
    ["ro_tino", "rotta", "c", 78, 50, 60, "A", 1], ["ro_fiamma", "rotta", "e", 56, 90, 70, "D", 1],
    ["ro_osvaldo", "rotta", "r", 54, 72, 66, "C", 2], ["ro_ersilia", "rotta", "l", 66, 70, 90, "C", 3],
    // L'Accademia dei Sigilli · Esami di Magia del Pallone
    ["sg_preside", "sigilli", "l", 85, 72, 90, "C", 3], ["sg_miriel", "sigilli", "e", 88, 64, 84, "A", 1],
    ["sg_golem", "sigilli", "r", 55, 88, 60, "D", 2], ["sg_tobia", "sigilli", "c", 62, 58, 70, "C", 1],
    // Colpo al Fortino · La Notte del Trofeo Scomparso
    ["fo_lupin", "fortino", "e", 78, 62, 86, "A", 1], ["fo_turing", "fortino", "r", 60, 72, 82, "C", 1],
    ["fo_gargoyle", "fortino", "r", 52, 84, 68, "D", 2], ["fo_boss", "fortino", "l", 82, 70, 75, "C", 3],
    // Tactics Note · Il Quaderno del Giudizio
    ["qd_raito", "note", "e", 86, 68, 88, "A", 1], ["qd_ryu", "note", "l", 82, 70, 92, "C", 1],
    ["qd_misa", "note", "r", 78, 54, 76, "A", 2], ["qd_elle", "note", "l", 64, 88, 94, "C", 2],
    ["qd_soichiro", "note", "c", 52, 80, 60, "D", 3],
    // Cenere e Gloria
    ["ce_brace", "cenere", "r", 60, 76, 72, "D", 1], ["ce_tamburo", "cenere", "c", 66, 58, 82, "C", 1],
    ["ce_selce", "cenere", "r", 58, 70, 80, "C", 2], ["ce_dente", "cenere", "e", 80, 62, 66, "A", 2],
    ["ce_predicatore", "cenere", "l", 78, 84, 76, "D", 3],
    // Il Torneo dei Quattordici
    ["qt_ilse", "quattordici", "r", 52, 88, 70, "D", 1], ["qt_teo", "quattordici", "c", 72, 54, 66, "A", 1],
    ["qt_luce", "quattordici", "r", 48, 60, 92, "C", 2], ["qt_corvo", "quattordici", "e", 82, 70, 74, "A", 3],
    ["qt_sfinge", "quattordici", "l", 70, 80, 90, "C", 3],
    // Operazione Doppio Zero · Licenza di Cross
    ["dz_sterling", "spia", "e", 74, 70, 84, "C", 1], ["dz_croupier", "spia", "c", 55, 62, 72, "D", 1],
    ["dz_eva", "spia", "r", 62, 76, 80, "C", 2], ["dz_kalt", "spia", "l", 85, 78, 82, "A", 3],
    // La Carovana del Fiume d'Argento
    ["fa_roderico", "fiume", "r", 68, 74, 76, "C", 1], ["fa_mirella", "fiume", "e", 62, 70, 86, "C", 1], ["fa_vanni", "fiume", "c", 78, 65, 60, "A", 1],
    ["fa_silvia", "fiume", "r", 58, 80, 72, "D", 2], ["fa_malacarne", "fiume", "l", 70, 85, 78, "D", 2],
    // Operazione Fuorigioco Noir · Milano 1954
    ["mn_desantis", "milano", "e", 55, 82, 70, "D", 1], ["mn_oste", "milano", "c", 48, 65, 58, "C", 1], ["mn_mara", "milano", "r", 78, 52, 76, "C", 2], ["mn_carmine", "milano", "l", 72, 85, 80, "D", 3],
    // Gran Premio del Pallone
    ["gp_gridoni", "gp", "c", 44, 52, 80, "C", 1], ["gp_bullone", "gp", "r", 60, 78, 66, "D", 1], ["gp_rosalba", "gp", "e", 86, 60, 74, "A", 2], ["gp_nembo", "gp", "r", 50, 70, 84, "C", 3],
    // Rondine 1938-2038
    ["rt_tilly", "tempo", "c", 46, 62, 76, "C", 1], ["rt_baldo", "tempo", "c", 64, 70, 48, "D", 1],
    // Dungeon di Fine Stagione
    ["dg_asterio", "dungeon", "c", 52, 80, 48, "D", 1], ["dg_fiamma", "dungeon", "r", 78, 46, 66, "A", 1], ["dg_meda", "dungeon", "r", 56, 60, 82, "C", 2], ["dg_ruggine", "dungeon", "e", 48, 84, 72, "D", 3],
    // Vallombra
    ["vl_teodora", "vallombra", "c", 52, 68, 60, "D", 1], ["vl_fosco", "vallombra", "c", 44, 72, 56, "P", 1], ["vl_mirtilla", "vallombra", "c", 56, 60, 68, "C", 1], ["vl_bianca", "vallombra", "c", 58, 66, 64, "D", 1], ["vl_cornelio", "vallombra", "c", 50, 56, 70, "C", 1],
    ["vl_remo", "vallombra", "r", 76, 58, 66, "A", 2], ["vl_agata", "vallombra", "r", 54, 66, 76, "C", 2], ["vl_noemi", "vallombra", "c", 48, 56, 76, "C", 2], ["vl_tonio", "vallombra", "c", 40, 78, 58, "P", 2], ["vl_gisella", "vallombra", "c", 66, 62, 60, "C", 2],
    ["vl_ettore", "vallombra", "c", 56, 50, 66, "A", 2], ["vl_viola", "vallombra", "c", 52, 56, 68, "C", 2], ["vl_rosalba", "vallombra", "c", 70, 52, 58, "A", 2],
    ["vl_mirella", "vallombra", "c", 68, 50, 60, "A", 3], ["vl_pio", "vallombra", "c", 46, 76, 52, "D", 3], ["vl_duilio", "vallombra", "c", 52, 70, 58, "D", 3], ["vl_dina", "vallombra", "c", 58, 60, 66, "C", 3], ["vl_gedeone", "vallombra", "c", 54, 72, 56, "D", 3],
    ["vl_berto", "vallombra", "e", 48, 84, 72, "P", 3], ["vl_lampionaio", "vallombra", "e", 62, 66, 84, "C", 3],
    ["vl_corvi", "vallombra", "c", 40, 62, 72, "C", 4], ["vl_ottavia", "vallombra", "r", 56, 74, 70, "D", 4], ["vl_vermiglio", "vallombra", "r", 66, 70, 68, "C", 4], ["vl_sigillo", "vallombra", "r", 60, 64, 78, "C", 4],
    ["vl_vica", "vallombra", "e", 78, 62, 76, "A", 5], ["vl_neve", "vallombra", "r", 50, 66, 74, "C", 5], ["vl_zelo", "vallombra", "c", 56, 64, 60, "D", 5],
    ["vl_gaudenzio", "vallombra", "e", 60, 72, 80, "D", 5], ["vl_ombra_p", "vallombra", "e", 52, 86, 70, "P", 7], ["vl_sasso", "vallombra", "e", 74, 62, 70, "A", 7], ["vl_tullio", "vallombra", "e", 68, 58, 82, "C", 7],
    ["vl_aurelio", "vallombra", "l", 82, 72, 90, "C", 8], ["vl_ombra", "vallombra", "l", 80, 78, 84, "A", 8], ["vl_teodora_l", "vallombra", "l", 60, 80, 92, "D", 8],
    // Kronenburg
    ["kb_baelor", "kronenburg", "c", 44, 54, 78, "C", 1], ["kb_guardia", "kronenburg", "c", 50, 80, 44, "D", 1], ["kb_kaelen", "kronenburg", "c", 66, 56, 62, "A", 1], ["kb_rennick", "kronenburg", "c", 64, 52, 74, "A", 2], ["kb_brutus", "kronenburg", "c", 60, 78, 40, "P", 2],
    ["kb_gareth", "kronenburg", "r", 72, 74, 64, "D", 2], ["kb_vespera", "kronenburg", "r", 58, 66, 84, "C", 2], ["kb_lyanna", "kronenburg", "r", 60, 56, 80, "C", 3], ["kb_voss", "kronenburg", "c", 62, 74, 64, "D", 3], ["kb_merrick", "kronenburg", "c", 52, 70, 66, "D", 3],
    ["kb_malakar", "kronenburg", "e", 78, 70, 80, "A", 3], ["kb_celia", "kronenburg", "l", 68, 66, 90, "C", 4],
    // Pirati della Tempesta Celeste
    ["pi_kidd", "pirati", "c", 56, 60, 76, "C", 1], ["pi_anemona", "pirati", "c", 58, 52, 70, "C", 1], ["pi_drake", "pirati", "r", 66, 80, 68, "D", 2], ["pi_barbanube", "pirati", "e", 60, 72, 82, "C", 3], ["pi_corsaro_grigio", "pirati", "e", 74, 66, 76, "A", 3], ["pi_morgana", "pirati", "l", 84, 66, 80, "A", 4],
    // Alchimia d'Acciaio
    ["al_kira", "alchimia", "c", 54, 64, 76, "C", 1], ["al_armatura", "alchimia", "c", 58, 80, 50, "D", 1], ["al_knox", "alchimia", "c", 46, 56, 78, "C", 1], ["al_chimera", "alchimia", "c", 62, 64, 50, "D", 2], ["al_armstrong", "alchimia", "r", 74, 76, 52, "D", 2],
    ["al_olivier", "alchimia", "e", 70, 82, 68, "D", 3], ["al_envi", "alchimia", "e", 72, 60, 80, "A", 3], ["al_sloth", "alchimia", "c", 60, 84, 36, "D", 3], ["al_royden", "alchimia", "l", 82, 60, 80, "A", 4],
    // Chrono-Break
    ["chr_elias", "chrono", "c", 44, 58, 82, "C", 1], ["chr_guardiano_alba", "chrono", "c", 68, 66, 62, "A", 1], ["chr_re_aurelio", "chrono", "r", 60, 70, 76, "C", 2], ["chr_aria", "chrono", "e", 56, 72, 88, "C", 3],
    // Circuito delle Ombre
    ["omb_milo", "ombre", "c", 66, 52, 70, "A", 1], ["omb_zoran", "ombre", "c", 40, 84, 50, "P", 1], ["omb_maya", "ombre", "c", 52, 56, 80, "C", 1], ["omb_victor", "ombre", "c", 62, 74, 54, "D", 2], ["omb_madame_v", "ombre", "r", 60, 64, 86, "C", 2], ["omb_silvia", "ombre", "e", 54, 60, 92, "C", 3], ["omb_don_renzo", "ombre", "r", 58, 70, 76, "C", 3],
    // Ragnarok Ball
    ["rag_sigrid", "ragnarok", "c", 50, 56, 78, "C", 1], ["rag_guerriero", "ragnarok", "c", 60, 70, 48, "D", 1], ["rag_brokk", "ragnarok", "c", 64, 76, 66, "D", 2], ["rag_sindri", "ragnarok", "c", 50, 62, 78, "C", 2], ["rag_ragnar", "ragnarok", "r", 82, 74, 60, "A", 2],
    ["rag_kara", "ragnarok", "e", 74, 66, 82, "A", 3], ["rag_surtr_ombra", "ragnarok", "e", 78, 64, 70, "A", 3],
    // Belovodia
    ["bv_boris", "belovodia", "c", 44, 60, 80, "C", 1], ["bv_falco", "belovodia", "c", 66, 50, 76, "A", 1], ["bv_guardia", "belovodia", "c", 54, 80, 44, "D", 1], ["bv_dama", "belovodia", "c", 52, 62, 82, "C", 2], ["bv_nadia", "belovodia", "r", 70, 60, 76, "A", 2], ["bv_yakov", "belovodia", "r", 68, 78, 58, "D", 2],
    ["bv_araldo", "belovodia", "c", 56, 66, 72, "C", 3], ["bv_moroz", "belovodia", "l", 80, 82, 84, "D", 4],
    // Bilancia delle Tre Corone
    ["fe_roland", "bilancia", "c", 70, 56, 68, "A", 1], ["fe_frederica", "bilancia", "c", 54, 60, 78, "C", 1], ["fe_erador", "bilancia", "r", 58, 84, 56, "D", 2], ["fe_benedict", "bilancia", "e", 64, 66, 86, "C", 3], ["fe_avlora", "bilancia", "l", 84, 72, 78, "A", 4],
    // Shogun Eclipse
    ["sh_ronin_boss", "shogun", "c", 70, 58, 60, "A", 1], ["sh_hanzo", "shogun", "c", 72, 52, 78, "A", 2], ["sh_muramasa", "shogun", "c", 48, 60, 82, "C", 2], ["sh_benkei", "shogun", "c", 62, 86, 40, "D", 2], ["sh_tomoe", "shogun", "r", 74, 66, 76, "C", 2],
    ["sh_generale_kuro", "shogun", "r", 74, 78, 68, "D", 3], ["sh_hayato", "shogun", "e", 68, 72, 84, "C", 3], ["sh_kurogane", "shogun", "l", 86, 80, 78, "A", 4],
    // Phantom Genesis
    ["pg_kael", "phantom", "c", 66, 70, 58, "D", 1], ["pg_maya", "phantom", "c", 48, 56, 82, "C", 1], ["pg_rin", "phantom", "c", 60, 50, 70, "A", 1], ["pg_sachiel", "phantom", "r", 72, 80, 50, "D", 2], ["pg_kurogane", "phantom", "e", 82, 70, 72, "A", 3],
    // Abisso di Dunwich
    ["abi_silas", "abisso", "c", 52, 70, 58, "D", 1], ["abi_barnaby", "abisso", "c", 60, 66, 56, "C", 1], ["abi_armitage", "abisso", "c", 40, 52, 82, "C", 1], ["abi_jonah", "abisso", "c", 62, 58, 60, "A", 1], ["abi_corvo", "abisso", "c", 46, 62, 66, "D", 1],
    ["abi_nora", "abisso", "r", 56, 68, 78, "C", 2], ["abi_cormac", "abisso", "c", 54, 72, 64, "D", 2], ["abi_cordelia", "abisso", "r", 68, 56, 74, "A", 2], ["abi_eldon", "abisso", "e", 64, 70, 86, "C", 3], ["abi_titano", "abisso", "l", 62, 92, 60, "P", 3],
    // Il Muro
    ["mu_teo", "muro", "c", 66, 60, 60, "A", 1], ["mu_nives", "muro", "c", 58, 56, 76, "C", 1], ["mu_saverio", "muro", "c", 40, 50, 74, "C", 1], ["mu_ugolino", "muro", "c", 50, 72, 56, "D", 1], ["mu_orso", "muro", "c", 46, 66, 66, "C", 2],
    ["mu_ilse", "muro", "r", 62, 78, 66, "D", 2], ["mu_corvino", "muro", "r", 70, 60, 76, "A", 2], ["mu_grifo", "muro", "e", 60, 66, 86, "C", 3],
    // Cristalli del Campo
    ["cr_aira", "cristalli", "c", 64, 60, 72, "C", 1], ["cr_bram", "cristalli", "c", 50, 82, 50, "D", 1], ["cr_trillo", "cristalli", "c", 58, 56, 70, "A", 1], ["cr_ortensia", "cristalli", "c", 40, 70, 64, "P", 1],
    ["cr_libeccio", "cristalli", "c", 72, 52, 64, "A", 2], ["cr_maestrale", "cristalli", "c", 36, 84, 60, "P", 2], ["cr_brunoferro", "cristalli", "c", 58, 82, 40, "D", 2], ["cr_vela", "cristalli", "r", 74, 58, 70, "A", 2], ["cr_kael", "cristalli", "r", 70, 78, 64, "D", 2], ["cr_zefira", "cristalli", "e", 56, 68, 88, "C", 2],
    ["cr_gilda", "cristalli", "c", 48, 60, 68, "C", 3], ["cr_ondina", "cristalli", "r", 52, 66, 80, "C", 3], ["cr_aldeberto", "cristalli", "l", 70, 80, 84, "C", 3],
    // Doppio Turno
    ["dt_ofelia", "doppio", "c", 50, 56, 80, "C", 1], ["dt_nina", "doppio", "c", 56, 62, 72, "C", 1], ["dt_bruno", "doppio", "c", 60, 66, 56, "D", 1], ["dt_pio", "doppio", "c", 46, 72, 58, "D", 1], ["dt_scheggia", "doppio", "c", 72, 56, 64, "A", 2], ["dt_valtorre", "doppio", "r", 62, 66, 84, "C", 2], ["dt_cartografo", "doppio", "e", 58, 60, 90, "C", 3],
    // Il Libro che Mangiava i Finali
    ["lb_virgola", "libro", "c", 56, 60, 78, "C", 1], ["lb_lupo", "libro", "c", 68, 56, 64, "A", 1], ["lb_mattone", "libro", "c", 54, 76, 66, "D", 1], ["lb_nonna", "libro", "c", 44, 64, 72, "C", 1],
    ["lb_jolly", "libro", "c", 62, 50, 80, "C", 2], ["lb_gommapane", "libro", "c", 50, 54, 66, "C", 2], ["lb_regina", "libro", "r", 46, 88, 64, "P", 2], ["lb_fante", "libro", "r", 60, 78, 56, "D", 2],
    ["lb_didascalia", "libro", "c", 56, 56, 76, "C", 3], ["lb_balloon", "libro", "r", 70, 62, 70, "A", 3], ["lb_rilegatore", "libro", "e", 52, 66, 86, "C", 3], ["lb_narratore", "libro", "e", 60, 66, 90, "C", 3], ["lb_autrice", "libro", "l", 66, 70, 92, "C", 4],
    // S.O.S. Galletta: I Bucanieri del Biscotto
    ["gl_barbabiscotto", "galletta", "c", 54, 76, 58, "D", 1], ["gl_cannella", "galletta", "c", 60, 56, 76, "C", 1], ["gl_crusty", "galletta", "r", 74, 52, 70, "A", 1],
    ["gl_commodoro", "galletta", "r", 62, 78, 64, "D", 2], ["gl_calipso", "galletta", "e", 70, 68, 86, "C", 2],
    ["gl_lievito", "galletta", "e", 64, 74, 84, "C", 3], ["gl_kraken", "galletta", "l", 88, 76, 82, "A", 3],
    // Fuga da Alcatraz FC · La Grande Evasione
    ["alc_bruno", "alcatraz", "r", 68, 62, 82, "C", 1], ["alc_cardenas", "alcatraz", "c", 50, 78, 60, "D", 1], ["alc_sam", "alcatraz", "c", 76, 52, 70, "A", 1],
    ["alc_malick", "alcatraz", "e", 60, 88, 54, "D", 2], ["alc_tonelli", "alcatraz", "r", 62, 64, 76, "C", 2],
    // La Piramide del Sole · Il Segreto dei Maya del Pallone
    ["my_alvarez", "piramide", "r", 56, 66, 74, "C", 1], ["my_ixchel", "piramide", "r", 72, 60, 84, "A", 1], ["my_diego", "piramide", "c", 52, 58, 70, "C", 1],
    ["my_vargas", "piramide", "e", 78, 72, 62, "D", 2], ["my_kukulkan", "piramide", "l", 86, 84, 80, "D", 3],
    // L'Espresso delle Ombre · Intrigo sul Treno delle Nevi
    ["te_valenti", "treno", "l", 82, 86, 80, "D", 1], ["te_elena", "treno", "e", 84, 58, 86, "A", 1], ["te_klaus", "treno", "r", 62, 76, 72, "C", 1],
    ["te_boris", "treno", "c", 76, 82, 54, "D", 2], ["te_morozov", "treno", "r", 68, 64, 80, "C", 2],
    // La Notte dei Cento Rintocchi: Il Furto della Campana d'Oro
    ["cp_crispino", "campana", "c", 60, 72, 70, "C", 1], ["cp_cacace", "campana", "c", 48, 82, 54, "D", 1], ["cp_rosetta", "campana", "r", 68, 54, 76, "C", 1],
    ["cp_tito", "campana", "r", 74, 52, 78, "A", 2], ["cp_peppe", "campana", "e", 78, 80, 56, "D", 2],
    ["cp_sindaco", "campana", "c", 50, 70, 64, "D", 2], ["cp_mastro", "campana", "l", 84, 78, 86, "C", 3],
    // Naufraghi del Pallone
    ["nf_gaspare", "naufraghi", "c", 40, 78, 62, "P", 1], ["nf_bora", "naufraghi", "r", 62, 72, 80, "C", 1], ["nf_tobia", "naufraghi", "c", 70, 46, 68, "A", 2], ["nf_scoglio", "naufraghi", "e", 84, 66, 82, "A", 3],
    // Cronache del Regno Ultimo
    ["re_evaristo", "regno", "c", 44, 70, 76, "D", 1], ["re_oriele", "regno", "r", 62, 60, 82, "C", 1], ["re_brando", "regno", "r", 72, 82, 56, "D", 1],
    ["re_perla", "regno", "r", 52, 74, 78, "C", 2], ["re_ulderico", "regno", "e", 78, 66, 60, "A", 2], ["re_cedro", "regno", "r", 48, 72, 82, "D", 2],
    ["re_scilla", "regno", "r", 80, 54, 74, "A", 3], ["re_tullio", "regno", "e", 66, 70, 74, "C", 3], ["re_anselmo", "regno", "l", 56, 70, 92, "C", 3],
  ];
  // [id, saga, rarità (c r e l), attacco, difesa, tecnica, ruolo]
  const CARDS = [
    ["bm_boris", "montagna", "c", 50, 74, 68, "P"], ["bm_sbruffo", "montagna", "c", 46, 78, 54, "D"], ["bm_wendy", "montagna", "r", 62, 60, 80, "C"], ["bm_valanga", "montagna", "e", 76, 52, 70, "A"], ["bm_tarcisio", "montagna", "r", 82, 64, 58, "A"],
    ["pr_sceriffo", "pugno", "c", 52, 82, 60, "P"], ["pr_carmela", "pugno", "c", 60, 58, 74, "C"], ["pr_barnaba", "pugno", "c", 48, 76, 62, "D"], ["pr_doc", "pugno", "r", 64, 52, 82, "C"], ["pr_ramon", "pugno", "e", 86, 56, 78, "A"],
    ["rm_furbio", "roma", "c", 44, 76, 68, "D"], ["rm_spartaco", "roma", "r", 82, 80, 56, "D"], ["rm_augusta", "roma", "r", 56, 52, 84, "C"], ["rm_cesare", "roma", "e", 86, 70, 82, "A"],
    ["sq_brina", "quartiere", "c", 60, 64, 66, "C"], ["sq_gommo", "quartiere", "c", 56, 72, 60, "D"], ["sq_scintilla", "quartiere", "r", 78, 52, 62, "A"], ["sq_ines", "quartiere", "e", 54, 84, 74, "D"],
    ["rz_ferruccio", "razzo", "c", 52, 66, 64, "C"], ["rz_timbro", "razzo", "c", 44, 78, 66, "D"], ["rz_borea", "razzo", "r", 56, 82, 70, "D"], ["rz_orsola", "razzo", "e", 80, 60, 76, "A"],
    ["cs_ugo", "cavallo", "c", 58, 50, 62, "C"], ["cs_max", "cavallo", "c", 66, 58, 64, "A"], ["cs_lucilla", "cavallo", "r", 50, 76, 72, "D"], ["cs_baldo", "cavallo", "e", 84, 54, 80, "A"],
    ["ft_sam", "titano", "c", 58, 70, 60, "D"], ["ft_cecile", "titano", "r", 52, 66, 80, "C"], ["ft_vega", "titano", "e", 80, 60, 74, "A"], ["ft_atlante", "titano", "l", 90, 78, 80, "A"],
    ["td_lia", "ducati", "c", 70, 54, 62, "A"], ["td_ottone", "ducati", "c", 50, 62, 72, "C"], ["td_corrado", "ducati", "r", 58, 78, 66, "D"], ["td_isotta", "ducati", "e", 64, 58, 82, "C"],
    ["gr_marisa", "grigio", "c", 64, 58, 62, "C"], ["gr_gancio", "grigio", "c", 50, 78, 52, "D"], ["gr_vela", "grigio", "e", 72, 56, 76, "A"], ["gr_alfio", "grigio", "l", 60, 70, 86, "C"],
    ["ts_tito", "torneo", "c", 66, 52, 60, "A"], ["ts_alba", "torneo", "c", 58, 60, 64, "C"], ["ts_lume", "torneo", "r", 70, 58, 66, "A"], ["ts_iole", "torneo", "e", 50, 64, 76, "C"],
    ["cc_lyra", "cronache", "c", 58, 72, 60, "D"], ["cc_fosco", "cronache", "c", 52, 50, 74, "C"], ["cc_rubi", "cronache", "r", 72, 54, 66, "A"], ["cc_re", "cronache", "l", 74, 80, 78, "D"],
    ["mg_tilde", "mantello", "c", 46, 60, 70, "C"], ["mg_bullone", "mantello", "c", 54, 74, 58, "D"], ["mg_brace", "mantello", "r", 70, 64, 60, "A"], ["mg_dottore", "mantello", "e", 64, 70, 76, "C"],
    ["sf_ada", "stagione", "c", 54, 60, 70, "C"], ["sf_teo", "stagione", "c", 66, 56, 62, "A"], ["sf_mira", "stagione", "r", 60, 58, 72, "C"], ["sf_gatto", "stagione", "l", 78, 66, 82, "A"],
    ["nl_fiammetta", "lampioni", "c", 56, 62, 66, "C"], ["nl_tobia", "lampioni", "c", 52, 66, 56, "D"], ["nl_leandro", "lampioni", "e", 76, 60, 74, "A"], ["nl_lucia", "lampioni", "r", 48, 72, 74, "D"],
    ["tc_brunilde", "trono", "c", 62, 70, 60, "D"], ["tc_gualtiero", "trono", "c", 58, 68, 62, "D"], ["tc_ysolde", "trono", "e", 66, 62, 80, "C"], ["tc_ardo", "trono", "r", 56, 78, 60, "P"],
    ["cm_saverio", "campetto", "c", 40, 80, 60, "P"], ["cm_pio", "campetto", "c", 54, 56, 72, "C"], ["cm_leone", "campetto", "r", 80, 52, 64, "A"], ["cm_bastiano", "campetto", "l", 84, 64, 86, "A"],
    ["ml_marta", "colline", "c", 58, 62, 70, "C"], ["ml_rino", "colline", "c", 68, 50, 56, "A"], ["ml_bice", "colline", "r", 50, 70, 74, "D"], ["ml_pino", "colline", "e", 60, 66, 84, "C"],
    ["dc_agata", "detective", "c", 56, 70, 72, "P"], ["dc_nina", "detective", "c", 62, 56, 68, "C"], ["dc_vanni", "detective", "r", 54, 66, 72, "D"],
    ["so_blop", "spazio", "c", 60, 64, 62, "D"], ["so_mira", "spazio", "c", 58, 58, 74, "C"], ["so_zorgo", "spazio", "r", 74, 56, 66, "A"],
    ["ve_selva", "vento", "c", 60, 60, 66, "C"], ["ve_sbuffo", "vento", "c", 56, 66, 60, "D"], ["ve_mormorio", "vento", "r", 66, 58, 72, "A"],
    ["ep_ada", "dopo", "c", 54, 62, 70, "C"], ["ep_bruno", "dopo", "r", 72, 62, 70, "A"], ["ep_tecla", "dopo", "c", 56, 66, 64, "D"],
    ["tm_custode", "mondi", "e", 70, 70, 80, "C"], ["tm_eclisse", "mondi", "l", 80, 76, 76, "A"],
  ].concat(NEWC).map(([id, saga, rar, at, df, te, role, n]) => (n ? { id, saga, rar, at, df, te, role, n } : { id, saga, rar, at, df, te, role }));
  const BY = Object.fromEntries(CARDS.map((c) => [c.id, c]));
  // la frase speciale che la carta dice quando arriva a tre stelle
  const FRASI = {
    leo: "Contro il muro del porto ho imparato a tirare. Con voi ho imparato perché.",
    nico: "Gatto Volante pronto al decollo! (Sara, stai guardando vero?)",
    tommy: "Un passaggio fatto bene è meglio di un gol. Quasi.",
    sara: "Ho controllato statistiche, vento e bilanci: vinciamo di due.",
    ruggeri: "Testa bassa, calzettoni su, e niente scuse fino al novantesimo.",
    papa: "Dopo la partita tutti in trattoria: le acciughe le offro io.",
    kenji: "Finché il cuore tiene il tempo del pallone, io resto in campo.",
    baciccia: "Settant'anni di mare e quaranta di parate col nodo del pescatore.",
    pina: "Edizione straordinaria del Corriere: questo gol va in prima pagina!",
    rocco: "Punta Nera non molla mai! E stavolta il gelato alla menta lo paghi tu.",
    mattia: "La saracinesca è abbassata: ripassate pure domani mattina.",
    dario: "Ho sbagliato strada una volta, fratellino. Questa parabola invece è dritta.",
    lina: "Chewing gum, verbale pronto e marcatura stretta: qui non scappa nessuno.",
    bruno: "Non gioco per piacere a nessuno. Gioco per non perdere più.",
    kevin: "Giù dal pedalò e dritto in area: l'estate al Borgo non finisce mai!",
    sho: "Questo Volo dell'Aquila è per mio fratello Kenji, e per chi ci aspetta.",
    jojo: "Sorridi, amico! Il pallone pesa meno quando balla con te!",
    marta: "Due ginocchia rifatte e zero giri di parole: in campo si ragiona.",
    saverio: "Chi passa da qui paga dazio: parola di Saverio Cozza.",
    vitale: "Diciassette anni con la stessa fascia: il campo ti restituisce chi sei.",
    ernesta: "Nel '68 paravo senza guanti. Figurati adesso, ragazzo.",
    nonna: "Contratto chiuso, clausola firmata e teglia di lasagne già in forno.",
    keller: "Trenta gol pesano poco, quando torni a giocare libero.",
    sg_preside: "Il vero potere di un calciatore non è nei piedi, ma nei simboli che sa imprimere sul destino.",
    sg_miriel: "Una parabola di vento non è solo fisica... è pura armonia che supera la barriera.",
    sg_golem: "GROOOM... NESSUN... PALLONE... VARCA... IL... GRANITO.",
    sg_tobia: "Ho allineato gli inchiostri! Ora il nostro tiro saetta non sbaglia un colpo!",
    fo_lupin: "Nessun lucchetto resiste a un tocco di suola calibrato al millimetro.",
    fo_turing: "Firewall superato, frequenze allineate: palla nel sette a colpo sicuro!",
    fo_gargoyle: "Disciplina di ferro sul campo e nella camera blindata: qui non si passa.",
    fo_boss: "Un trofeo di cent'anni non si tocca: ma il talento vale più di quaranta milioni.",
    qd_raito: "Questo è il mio nuovo mondo: ogni contrasto è stato previsto esattamente al millimetro.",
    qd_elle: "La probabilità che questa parabola entri all'incrocio era del 99,4%. L'ho verificata.",
    qd_ryu: "Eh eh eh... Un gol magnifico in cambio di una bella mela rossa croccante!",
    qd_misa: "Per Raito farei qualsiasi cosa: persino volare sulla fascia all'ultimo minuto!",
    qt_ilse: "Fascia rossa tra tre secondi: spostati, io tengo la porta.", qt_teo: "Ti ricordi Rimini? Io sì. Anche il gol, anche l'ammonizione.", qt_luce: "Annotato. Anche questo gol finisce nel registro.", qt_corvo: "Non ti odio. Gioco solo dalla parte opposta del fischio.", qt_sfinge: "Un desiderio è un contratto: attento a chi paga.",
    ce_brace: "Un sorso a testa. E il pallone, un tocco a testa.", ce_tamburo: "Se si rompe lo riparo. Se si perde lo ritrovo. Dammi un cacciavite e un minuto.", ce_selce: "Traiettoria tracciata. Lamiera 2 si abbassa tra tre secondi: tira ora.", ce_dente: "Le cose abbandonate sono di chi arriva primo. Questo gol, per esempio.", ce_predicatore: "Il pallone non si gioca per vincere. Si gioca per ricordare.",
    dz_sterling: "Un Martini agitato, non mescolato: e un tiro all'incrocio, non telefonato.",
    dz_croupier: "Rien ne va plus: il pallone è già entrato nel sette.",
    dz_eva: "Codice decifrato: traiettoria balistica perfetta con il 99,8% di probabilità di gol.",
    dz_kalt: "Un brivido a novanta gradi sotto zero... questo è il vero tocco di classe.",
    nf_gaspare: "Parate registrate: tutte. Gol subiti: li ho messi alla voce «varie».", nf_bora: "Pensa, decidi, vai. In quest'ordine, e senza panico.", nf_tobia: "Ripeto il gol al rallentatore: sembra ancora più bello.", nf_scoglio: "La partita è lunga quanto serve. Io ho tempo.",
    dg_asterio: "Il pilastro sono io. E io non mi sposto, nemmeno per il pallone d'oro.", dg_fiamma: "Non brucio, io. Illumino. Ma se mi offendi, fumo.", dg_meda: "Non guardarmi negli occhi: passa e basta. Il pallone, intendo.", dg_ruggine: "Trent'anni di allenamento per un solo rigore. Questa volta entra.",
    gp_gridoni: "E IL PALLONE ENTRA! (Era già entrato. Ma l'emozione è in differita.)", gp_bullone: "Si stringe a mano. Anche il portiere, se serve.", gp_rosalba: "Il rosso non è un colore: è un modo di arrivare primi.", gp_nembo: "Fischio, sventolo, verbalizzo. Il gol è regolare, salvo nuvole.",
    of_gasparre: "Piano. La caldaia ha pazienza, a differenza di chi la guarda.", of_rina: "La chiave inglese non la uso. La tengo. Oggi, forse, la uso.", of_volta: "Un fulmine, un fischio e un gol. Nello stesso ordine.", of_ferro: "Gioco per la Corporazione. Ma il fischietto lo tengo nel taschino del cuore.", of_vanda: "Una penna nuova per un patto nuovo. L'inchiostro, quello, è sempre vecchio.", of_brontolo: "Fsss. Brrr. (Traduzione: palla a me.)", of_titano: "Clank. Clank. Clank.", of_apprendista: "Mi hanno insegnato a vincere. Non a farlo con gusto.",
    pd_teresa: "Il dolce non si fa da solo. Il silenzio, neanche.", pd_arturo: "Un maggiordomo non lascia la casa quando le luci si spengono.", pd_livia: "Il sorriso è una pratica quotidiana.", pd_zeno: "L'ho vinto io, il Pallone. Poi l'ho perso io.", pd_clio: "Chiedere «perché?» tutta la vita e farmi pagare.", pd_gualtiero: "Ho solo comprato il Pallone, dieci anni fa.", pd_ospite: "Un biglietto che nessuno ricorda di aver spedito.", pd_delmonte: "Ogni parola, qui dentro, ha un prezzo.",
    cf_fulgenzio: "Ho comprato corde più resistenti. Non ho mai chiesto il perché.", cf_brandi: "Non mi fido di chi veste di nero. Mi fido di lei.", cf_zeppa: "Dico sempre una cosa in più di quella che so.", cf_micia: "Miagola, se ti serve una mano sui tetti.", cf_spillo: "Se è per un rigore, lo calciamo all'alba.", cf_diva: "Canto piano, quando il pubblico è l'ultimo a crederci.", cf_lucre: "Ho un registro per ogni cosa.", cf_pierrot: "Ogni palloncino porta un indovinello. Ogni indovinello porta qui.",
    mg_gallo: "Venticinque anni di panchina. Passatevi la palla.", mg_mara: "Misuro i polpacci e leggo le partite come radiografie.", mg_teo: "Se non passi, non passi.", mg_sandro: "Parlo con i pali. Qualche volta rispondono.", mg_elio: "Passo a occhi chiusi: so dove sei.", mg_nina: "Corro per non pensare. Poi penso per correre.", mg_bruno: "Segno con qualunque parte del corpo.", mg_duarte: "Nessuna partita è una cosa seria. La si vince lo stesso.", mg_lukas: "Ripara biciclette di notte, anticipa attaccanti di giorno.", mg_tico: "Il pallone non si prende: si balla.", mg_wolff: "Gut. Quarantacinque minuti e un fischio.", mg_ren: "Si gioca con rispetto, e con un sorriso che non concede niente.",
    vp_tilde: "Ci penso io. Poi chiedo come.", vp_gino: "I sacchi non fermano l'acqua. La guidano.", vp_lorenza: "Se è vero, lo leggo vero. Se è bello, anche.", vp_zattera: "Il lago sale di notte, quando nessuno guarda.",
    vp_valvola: "Il modulo ce l'ho. Mi manca il coraggio, che è un altro modulo.", vp_ermete: "Il silenzio dopo una parata è il segnale che ha funzionato.", vp_capo: "Gioco in difesa anche a tavola.", vp_zita: "Il pallone era del prete, ed era troppo grande per tutti noi.",
    vs_mira: "Una vite storta racconta più di un manuale.", vs_ghiro: "Ascolta le tazze, non il mare. Il mare è bugiardo.", vs_corvo: "Sento anche i passi che non hai ancora fatto.",
    vs_ottone: "Cartone. Una sola parola, tre ore di discorso risparmiate.", vs_brace: "Io decido dove guarda il faro. È poco. È tutto.", vs_pio: "Non ho visto niente. Non sono neanche qui. Zzz.",
    vs_vulpe: "Ti vedo sul radar: un puntino che cammina bene.", vs_lastra: "Il freddo conserva. Non giudica.", vs_eco: "Dodici anni di attesa diventano un mestiere.", vs_sipario: "Per il bene del gioco. Ovviamente.",
    nr_kira: "Una riga di codice cambia una città. Due, un rapporto.", nr_jax: "La gamba cigola. Il tiro, quando riesce, no.", nr_bolt: "Bzzz. Il banco è aperto. Il cuore, meno.", nr_volt: "Il banco non esiste, ma i prezzi sì.", nr_nyx: "L'imparzialità è una scelta. Ho scelto.", nr_vance: "Il sigaro è spento, il fascicolo no.", nr_vektor: "Il talento muore. Il codice, no.", nr_zero: "Probabilità di parata: 99,96%. Il resto è tifo.",
    rp_brezza: "Volo piano, ma arrivo. Anche alla verità.", rp_marta: "A cena ci sei. Non è un'opinione, è un orario.", rp_basalto: "Cadere è metà del mestiere. L'altra metà è la pazienza.", rp_nube: "Sorrido anche quando dormo. Dicono sia un talento.", rp_sabbioni: "Questo comunicato è già in stampa. Anche questo.", rp_ilario: "Suggerisco battute. Alcune sono più lunghe delle altre.", rp_teodora: "Gli archivi non mentono: è il personale che ha la memoria corta.", rp_zenit: "Ti ho insegnato a volare. Ora imparo a cadere.",
    fg_ginestra: "Non si comprano le figure: si incontrano.", fg_ottone: "Un caffè, un consiglio, un tackle.", fg_nives: "Vincere è la mia lingua. Perdere la sto imparando.", fg_rosa: "Fischio una volta. Capito? Una.", fg_cora: "Tre Leghe vinte. La quarta è la tua.",
    cv_gemma: "Un dardo, un respiro, un punto. Come ai tempi del ponte.", cv_brenno: "Qui non si passa. Nemmeno col pallone.", cv_isotta: "Conti pagati, schemi in regola e un assist al momento giusto.", cv_conte: "Un feudo si difende. Un campo, ancora meglio.",
    fi_pino: "Contatto lieve. Gioco avanti. Il mio fischietto è la mia bandierina.", fi_livia: "Annotato. Anche questo tiro finisce in cronaca.", fi_dante: "Una scivolata pulita, per una volta. Segnatevelo.", fi_edvige: "Il regolamento ammette il talento. Articolo uno, comma gol.",
    ro_tino: "Ho fame, ma prima segno. Forse.", ro_fiamma: "Guanti in tasca e testa sul tiro: parato.", ro_osvaldo: "Dai, Gigante: ancora un tornante e arriviamo.", ro_ersilia: "Mio marito è in tribuna. Fate bella figura.",
    rt_tilly: "Il tabellone mi vuole bene. Gli altri, non so.", rt_baldo: "Un prato con le righe. E io sono la riga più dura.",
    sq_brina: "Gusto del giorno: vittoria. Molto fredda.", sq_gommo: "Mi allungo fino alla porta, se serve.", sq_scintilla: "Il forno sono io. E anche il tiro.", sq_ines: "Il ferro mi vuole bene. Anche il pallone, oggi.", rz_ferruccio: "E IL CORRIERE TIRA… CONSEGNATO!", rz_timbro: "Gol approvato. In triplice copia.", rz_borea: "Ho parato un asteroide. Un pallone è facile.", rz_orsola: "Come ai campetti: chi vince decide.", cs_ugo: "Idea: vinciamo. Questa funziona.", cs_max: "Che bella partita! Tutte le partite sono belle!", cs_lucilla: "Contratto firmato. Gol incluso.", cs_baldo: "Che zoccolata!",
    rm_furbio: "Un senatore non perde mai: al massimo rinvia il risultato al prossimo plebiscito.", rm_spartaco: "Gli scudi si spezzano, ma la difesa della Suburra non crolla mai!", rm_augusta: "Gli astri avevano previsto questo gol all'incrocio fin dal primo tempo.", rm_cesare: "Veni, vidi, vici: pollice verso l'alto per questo trionfo nell'arena!",
    re_evaristo: "Con tutto il rispetto: il pallone è in fuorigioco di protocollo.", re_oriele: "Una corona si porta con la schiena dritta. E con un buon paio di scarpe.", re_perla: "Un buon conto è come una buona partita: nessuno lo vede, finché non torna.", re_ulderico: "Avanti. E se non si può, avanti lo stesso.", re_scilla: "Corro più veloce della marea. Quasi sempre.", re_tullio: "Una guerra si vince con la penna. Quella di mio padre, in particolare.", re_anselmo: "Ho ottantadue anni e un gatto: governo per metà ciascuno.", re_cedro: "Secondo l'articolo tredici, il pallone è sempre in gioco.", re_brando: "La pace è una guerra che si è messa in ordine. Anche a pallone.",
    ft_sam: "Qualcuno deve restare coi piedi per terra. Ci penso io.", ft_cecile: "Vent'anni di domande. Questa è la risposta che preferisco.", ft_vega: "Su Elyon nessuno mi batte. Qui, a quanto pare, sì.", ft_atlante: "Il cielo è curvo, figliolo. Giralo tutto.",
    td_lia: "Il sale è di chi lo scava. E il gol è di chi lo segna.", td_ottone: "Ho calcolato tutto. Tranne quanto mi sarei divertito.", td_corrado: "Testa alta, scarpe rotte, cuore intero.", td_isotta: "Gioco per vincere, non per comprare.",
    gr_marisa: "Se smetto di giocare, hanno vinto loro. Quindi gioco.", gr_gancio: "Un armadio in difesa non si sposta. Provaci.", gr_vela: "Ti ho rubato la palla. Te la restituisco in rete, come sempre.", gr_alfio: "Quarant'anni fa ero più veloce. Oggi sono più furbo.",
    ts_tito: "Il pane si sforna all'alba, i gol al novantesimo.", ts_alba: "Consegno i palloni come le lettere: sempre all'indirizzo giusto.", ts_lume: "Una lanterna sola non illumina il campo. Undici, sì.", ts_iole: "Oggi la lezione è una sola: passate la palla.",
    cc_lyra: "Il mio scudo è la difesa. La mia spada è il contropiede.", cc_fosco: "Non vedo la porta, ma la sento. Di solito.", cc_rubi: "Ti ho rubato la palla. Te la restituisco in rete.", cc_re: "…",
    mg_tilde: "Ogni maglia che cucio porta un punto d'onore.", mg_bullone: "TOSTATURA COMPLETATA. TIRO CROCCANTE IN ARRIVO.", mg_brace: "Spengo gli incendi, accendo le curve.", mg_dottore: "Fuorigioco! …ah no, stavolta sono io in ritardo.",
    sf_ada: "Il Lido è aperto anche d'inverno, per chi gioca col cuore.", sf_teo: "Il Real Lago non molla. Mai. Neanche la domenica sera.", sf_mira: "Qui Radio Lago: gol, gol, GOL!", sf_gatto: "Miao. (Lo prende come un sì.)",
    nl_fiammetta: "Una luce accesa al momento giusto vale un gol.", nl_tobia: "Batto il tempo della partita a colpi di campana.", nl_leandro: "Un'ombra non segna. Ma sa sempre dov'è la palla.", nl_lucia: "Ho acceso lampioni per sessant'anni. Posso accendere anche voi.",
    tc_brunilde: "Il mio voto vale una casata. Il mio tackle, due.", tc_gualtiero: "La spada si impugna come il pallone: con rispetto.", tc_ysolde: "So già cosa farai. Lo sapevo ieri.", tc_ardo: "Pietra su pietra si alza un muro. E io sono il muro.",
    cm_saverio: "Da qui non passa nessuno. Neanche il vento.", cm_pio: "Corro io, tu pensa a segnare.", cm_leone: "Il fuoco del campetto non si spegne mai.", cm_bastiano: "Ho aspettato quarant'anni una squadra così.",
    ml_marta: "La fascia da capitana pesa poco, se la porti con tutti.", ml_rino: "Arrivo sempre in orario. Anche sul secondo palo.", ml_bice: "La contessa approva. Con riserva.", ml_pino: "Abracadabra: il pallone è sparito… in porta.",
    dc_agata: "Ho le prove: questa squadra è la migliore.", dc_nina: "Prima pagina: «Trionfo dei Sogni». Lo scrivo io.", dc_vanni: "Verbale firmato. Partita vinta, timbro e controfirma.",
    so_blop: "Blop! (Blop significa: passa la palla.)", so_mira: "Ho ricalcolato la traiettoria: è gol al 99,8%.", so_zorgo: "Tre occhi vedono tre passaggi in più.",
    ve_selva: "Il vento gentile soffia sempre verso la porta giusta.", ve_sbuffo: "Fffff! (Il pallone vola più leggero.)", ve_mormorio: "Ascolta: anche l'erba fa il tifo.",
    ep_ada: "In ogni epoca c'è un gol che aspetta di essere segnato.", ep_bruno: "Nel '28 si giocava col cuoio pesante. Il cuore era lo stesso.", ep_tecla: "La storia della famiglia la scriviamo in campo.",
    tm_custode: "Ogni porta si apre, prima o poi. Anche quella avversaria.", tm_eclisse: "Anche il buio ha bisogno di una squadra.",
    // Vallombra e le altre saghe a capitoli: frasi di tre stelle, senza anticipazioni
    vl_teodora: "L'orario è sacro. Il fuorigioco, un'opinione.", vl_fosco: "Non gioco mai. Per questo non sbaglio mai.", vl_mirtilla: "Tre tazze, un panino e il referto della partita: offro io.", vl_bianca: "Se si rompe, lo aggiusto. Se non si rompe, lo aggiusto lo stesso.", vl_cornelio: "Sarò breve. (Sette minuti dopo:) Sarò brevissimo.",
    vl_remo: "Gli occhiali restano. Il pallone, se riesci, no.", vl_agata: "I dati dicono che segni. A volte i dati hanno ragione.", vl_noemi: "Qui Radio Nebbia: si prevede un gol, con schiarite.", vl_tonio: "Sembro una porta più piccola. Funziona sempre.", vl_gisella: "Tifo Camosci anche quando passo il pallone agli altri.",
    vl_ettore: "Telecamere accese: oggi il mistero è la difesa.", vl_viola: "Ho filmato tutto. Soprattutto la cosa sbagliata.", vl_rosalba: "Svegliatemi al fischio d'inizio. E al gol.", vl_mirella: "Palla a me! …anzi, palla a chi sta meglio.", vl_pio: "Marco l'aria. Qualcuno deve.",
    vl_duilio: "Il sinistro pensa, il destro corre.", vl_dina: "A solitario bara. A pallone, pure: ma meno.", vl_gedeone: "Contati tre volte. Presenti. Pronti.", vl_berto: "Un nodo a farfalla sulle dita e di qui non passa nessuno.", vl_lampionaio: "Una luce accesa al momento giusto basta.",
    vl_corvi: "Lo sportello è chiuso. Per lei, apro.", vl_ottavia: "Quarant'anni di turni di notte: il buio mi fa compagnia.", vl_vermiglio: "Per principio, nessun principio. Firmi qui.", vl_sigillo: "Il mio cognome è la mia professione. Il suo, una clausola.", vl_vica: "Il panino c'è, la maglia anche. Tu sbrigati.",
    vl_neve: "Presidente, albergatore, allenatore. Il giovedì, anche parroco.", vl_zelo: "Livello quattro: fischio e non discuto.",
    vl_gaudenzio: "Un fischio dritto. Una volta sola, ma dritto.", vl_ombra_p: "Parata. Prego, non c'è di che.", vl_sasso: "Mi hanno aspettato. Adesso gioco.", vl_tullio: "Gentile signora, passo la palla.",
    vl_aurelio: "Il minuto è mio. Il fischio, di chi lo sente.", vl_ombra: "Ci vediamo al novantesimo. Puntuale, stavolta.", vl_teodora_l: "Alle 6:43 la cabina sale. La guido io.",
    kb_baelor: "Non vedo la pagina, ma ricordo la riga.", kb_guardia: "Incorruttibile. Con i denari. Con le barzellette, meno.", kb_kaelen: "La giustizia si rimette in gioco, un passaggio alla volta.", kb_rennick: "Una chiave, un'ombra, un contropiede.", kb_brutus: "Le chiavi sono mie. Il pallone, di chi lo prende.",
    kb_gareth: "Il voto d'onore vale più del cartellino.", kb_vespera: "Ogni alibi ha una crepa. Anche il tuo fuorigioco.", kb_lyanna: "Sorrido, e intanto prendo le misure.", kb_voss: "Cento campagne, un solo schema: avanzare.", kb_merrick: "Si forgia col fuoco e si tira col piede giusto.", kb_malakar: "Il potere è una partita lunga. La gioco da sempre.", kb_celia: "Ho visto secoli di partite. Questa è tra le più belle.",
    pi_kidd: "Un gancio di vento, un passaggio al volo.", pi_anemona: "Dall'alta coffa vedo tutto: anche dove passerai.", pi_drake: "La rotta si tiene. Anche in difesa.", pi_barbanube: "Le correnti non mentono. I portieri, a volte.", pi_corsaro_grigio: "Una vecchia ciurma conosce tutti i tuoi trucchi.", pi_morgana: "Vento in poppa e palla a me!",
    al_kira: "Una chiave inglese e una buona idea: basta.", al_armatura: "Vuoto dentro, pieno di buon senso.", al_knox: "Ho sbagliato tante formule. Il passaggio, mai.", al_chimera: "Più pezzi, più corsa.", al_armstrong: "I muscoli sono un linguaggio. E io parlo fluentemente.", al_olivier: "Il ghiaccio non si scioglie. Il tackle nemmeno.", al_envi: "Ti copio il tiro e lo faccio meglio.", al_sloth: "Piano piano, la porta si chiude.", al_royden: "Un guanto, una scintilla, e il pallone prende fuoco.",
    chr_elias: "Il tempo si ripara. Con pazienza e un cacciavite.", chr_guardiano_alba: "Al primo raggio, si parte.", chr_re_aurelio: "Un regno d'oro merita un gol d'oro.", chr_aria: "Aspetto da secoli. Una partita in più non mi pesa.",
    omb_milo: "Conosco ogni condotto. Anche quello verso la porta.", omb_zoran: "Mani come tenaglie. Provaci pure.", omb_maya: "Ho sentito tutto. Soprattutto quello che non si doveva dire.", omb_victor: "Il buio per me è un campo da gioco.", omb_madame_v: "Le scommesse si chiudono quando dico io.", omb_silvia: "Ho calcolato la traiettoria: è un sogno.", omb_don_renzo: "Qui comando io. Anche il fischio.",
    rag_sigrid: "Canto le saghe. E i gol, che sono saghe brevi.", rag_guerriero: "Uno scudo, un fiordo, nessun passo indietro.", rag_brokk: "Si batte il ferro finché è caldo.", rag_sindri: "Il dettaglio decide. Anche in area.", rag_ragnar: "Zanna di ferro, cuore di brace.", rag_kara: "Ali d'argento, giudizio imparziale.", rag_surtr_ombra: "Ceneri antiche, tiro nuovo.",
    bv_boris: "Leggo i nodi del legno. Leggo anche i tuoi movimenti.", bv_falco: "Vedo il bersaglio da lontano. Poi lo prendo.", bv_guardia: "Sentinella del gelo: da qui non si passa.", bv_dama: "Sotto il ghiaccio, l'acqua ricorda tutto.", bv_nadia: "Veloce sui pattini, veloce di testa.", bv_yakov: "Un lupo grigio non molla l'osso. Né il pallone.", bv_araldo: "Porto proclami. Anche gol.", bv_moroz: "Il gelo è paziente. Io di più.",
    fe_roland: "La moralità ha il piede caldo.", fe_frederica: "Libertà è un passaggio che non ti aspetti.", fe_erador: "Le mura tengono. Anch'io.", fe_benedict: "Ogni mossa ha un prezzo. Io lo conosco.", fe_avlora: "Imbattuta sul campo. Provaci.",
    sh_ronin_boss: "Un fendente d'aria e passa il pallone.", sh_hanzo: "Silenziosa come un battito d'ala.", sh_muramasa: "Ogni lama ha una voce. Ogni maschera, un prezzo.", sh_benkei: "Il ponte è mio. Il pallone, vedremo.", sh_tomoe: "La spada protegge il fuoco. Il piede, il gol.", sh_generale_kuro: "Due lame, nessuna esitazione.", sh_hayato: "Un tempo ero un campione. Oggi, un maestro.", sh_kurogane: "Il trono è una porta. Si segna.",
    pg_kael: "Difensore d'acciaio, ribelle di cuore.", pg_maya: "Il tuo tasso di sincronia è ottimo. Segna.", pg_rin: "Materia grezza e fiuto da mercante.", pg_sachiel: "Una risonanza a bassa frequenza. Ti arriva sul petto.", pg_kurogane: "Un'ala nera sul campo moderno.",
    abi_silas: "Immersioni lunghe, respiro corto: la tattica giusta.", abi_barnaby: "Pipa in bocca e rotta decisa.", abi_armitage: "Ho letto tutto sui balani. Ora leggo il gioco.", abi_jonah: "Conosco ogni secca. Anche quelle del centrocampo.", abi_corvo: "Rintocco ogni onda. E ogni fischio.", abi_nora: "Il faro non si spegne se qualcuno lo guarda.", abi_cormac: "Un chiodo di nave tiene una porta. E una difesa.", abi_cordelia: "Mi tuffo dove gli altri non guardano.", abi_eldon: "Le maree portano e portano via. Anche i rigori.", abi_titano: "La mia parata ferma le onde.",
    mu_teo: "Corro più forte di chiunque. Anche di me.", mu_nives: "Poche parole, molti passaggi.", mu_saverio: "Porto i proclami. E, ogni tanto, il pallone.", mu_ugolino: "Conosco ogni pietra per nome. E ogni avversario.", mu_orso: "Fischio piano e decido forte.", mu_ilse: "Una cicatrice per ogni partita vinta.", mu_corvino: "Pazienza finita, tiro pronto.", mu_grifo: "Mani pulite, passaggi puliti.",
    cr_aira: "Sono caduta dal cielo. Atterro sempre in piedi.", cr_bram: "Brontolo, sbuffo, e non passa nessuno.", cr_trillo: "Fiuu! (Il pallone vola più alto.)", cr_ortensia: "Ho arbitrato sessanta partite. Ne ho viste di tutti i colori.", cr_libeccio: "Spavaldo, rapido e simpatico. A volte.", cr_maestrale: "Ho parato rigori per cinquant'anni. I piccioni, meno.", cr_brunoferro: "Due metri di ferro e un debole per i dolci.", cr_vela: "Contrabbandiera di professione, funambola di vocazione.", cr_kael: "Cappotto di ferro, nessuna fretta.", cr_zefira: "Il vento porta voci. E tiri.", cr_gilda: "Stessa ricetta da quarant'anni: funziona ancora.", cr_ondina: "Le onde rispondono. Di solito.", cr_aldeberto: "Un re vecchio e un pallone nuovo.",
    dt_ofelia: "Conto i passi, i secondi e le porte.", dt_nina: "Dietro il bancone vedo tutto. Anche i fuorigioco.", dt_bruno: "Regole, sorrisi, e una difesa solida.", dt_pio: "Lavoro sul confine. Anche in campo.", dt_scheggia: "Gioco a piedi nudi, anche d'inverno.", dt_valtorre: "Sorriso perfetto, schema perfetto.", dt_cartografo: "Disegno mappe di posti che non ricordi.",
    lb_virgola: "Un nastro rosso e una pausa al momento giusto.", lb_lupo: "Un tè alla bergamotto e un tiro di classe.", lb_mattone: "Capitano, regista, geometra.", lb_nonna: "Ho un gomitolo per ogni partita.", lb_jolly: "Posso essere qualsiasi carta. Oggi, la migliore.", lb_gommapane: "Mangio refusi e passaggi sbagliati.", lb_regina: "Imbattuta. E dal vivo, di più.", lb_fante: "Leale fino all'ostinazione.", lb_didascalia: "«E in quel momento, il gol.» (L'ho scritto io.)", lb_balloon: "Nuvolette ben legate e un tiro a effetto.", lb_rilegatore: "Ho cucito ogni pagina con spago cerato.", lb_narratore: "E così, la partita finì come doveva.", lb_autrice: "Firmato: A.",
    gl_barbabiscotto: "Per mille forchette! Si salpa per il gol!", gl_cannella: "Impasto all'alba e tiro al novantesimo.", gl_crusty: "KRAAA! Briciole all'incrocio dei pali! KRAAA!", gl_commodoro: "Un gol conforme al rigido protocollo imperiale.", gl_calipso: "Il vento profuma di vittoria e vaniglia.", gl_lievito: "Cotto a puntino: nell'angolino basso!", gl_kraken: "I flutti si aprono al Re dei Bucanieri!",
    my_alvarez: "Il Pok-ta-pok? Fisica applicata, ragazzo mio.", my_ixchel: "Conosco ogni sentiero e ogni rimbalzo.", my_diego: "Qui Diego: messaggio ricevuto, palla in arrivo!", my_vargas: "Il tesoro è un pallone d'oro. Per me, almeno.", my_kukulkan: "Il sole guarda, l'anello decide.",
    alc_bruno: "Forbici salde, testa alta e cross al millimetro: così si evade dalla marcatura.", alc_cardenas: "Nessuno esce da qui senza il mio triplice fischio.", alc_sam: "Ho una chiave per ogni porta e un tunnel per ogni contropiede.", alc_malick: "Palla o uomo passano... ma mai insieme.", alc_tonelli: "Fischietto tra i denti e marcatura a uomo: la disciplina prima di tutto.",
    te_valenti: "Nel corridoio non c'è spazio per le finte: solo per la freddezza d'agente.", te_elena: "Il pallone è come un dispaccio cifrato: chi lo sa leggere vince la partita.", te_klaus: "Fischietto e orario: il convoglio fende la neve senza fermarsi mai.", te_boris: "Gettare carbone e tenere il muro: la locomotiva non arretra!", te_morozov: "Un passaggio dosato al millimetro è la miglior medicina contro il pressing.",
  };
  // le squadre inventate della Stagione dei Sogni e del Draft
  const TEAMS = [
    { name: "Atletico Nuvolari", color: "#3a8ad8", style: "pressing", f: 62, pl: ["Cirro", "Strato", "Nembo", "Cumulo"] },
    { name: "Sporting Lanternino", color: "#e8a83a", style: "equilibrata", f: 64, pl: ["Stoppino", "Cera", "Fiocco", "Miccia"] },
    { name: "Real Pentolino", color: "#c83a3a", style: "contropiede", f: 66, pl: ["Mestolo", "Coperchio", "Sugo", "Forchettone"] },
    { name: "Dinamo Girasole", color: "#e8d03a", style: "pressing", f: 68, pl: ["Petalo", "Seme", "Stelo", "Corolla"] },
    { name: "Olimpia Vecchio Molo", color: "#2a6a8a", style: "difensiva", f: 70, pl: ["Bitta", "Cima", "Ancora", "Gomena"] },
    { name: "Union Cometa", color: "#7a5ad8", style: "contropiede", f: 73, pl: ["Coda", "Chioma", "Nucleo", "Scia"] },
    { name: "I Leggendari del Faro", color: "#1a2a4a", style: "equilibrata", f: 76, pl: ["Lampo", "Vedetta", "Scoglio", "Fanale"] },
  ];
  const ENG = ["caveau", "rottami", "zonarossa", "roulette", "corrente", "marea", "vignette", "bottoni", "luci", "nastro", "concilio", "lavagna", "duello", "atb", "gadget", "iso", "volo", "combo", "consegna", "ciak", "ipogeo", "pallatempo", "giroegol", "rebound", "corridoio", "anello"];
  const RAR = { c: ["Comune", "#9aa5b1", 1], r: ["Rara", "#3a8ad8", 2], e: ["Epica", "#a85ad8", 3], l: ["Leggendaria", "#ffd23f", 4] };
  // i legami tra saghe diverse: +3 di intesa se entrambi in squadra
  const LINKS = [
    ["leo", "dario", "I Fratelli Moretti"], ["leo", "nico", "Dal Muro del Porto"], ["leo", "tommy", "Uno-Due del Campetto"],
    ["nico", "sara", "Cuore e Taccuino"], ["baciccia", "nonna", "Nodo del Pescatore"], ["kenji", "sho", "Il Volo degli Arata"],
    ["ruggeri", "cm_bastiano", "Panchine di Riviera"], ["lina", "mn_desantis", "Indagini in Divisa"],
    ["pina", "fi_livia", "Cronache di Provincia"], ["jojo", "mg_tico", "Samba d'Oro"],
    ["ernesta", "ro_fiamma", "Le Gatte tra i Pali"], ["papa", "pd_teresa", "Cucina & Pallone"],
    ["sara", "dc_nina", "Inchieste in Prima Pagina"], ["keller", "mg_wolff", "Bomber d'Acciaio"],
    ["vs_ottone", "fg_ottone", "Gli Ottoni (due scatole, un caffè)"], ["vp_ermete", "vs_ottone", "Custodi di dighe e di scatole"], ["vp_valvola", "dz_sterling", "Ingegneri e Osservatori"], ["vs_vulpe", "nr_kira", "Radio & Codici"], ["vs_corvo", "dz_sterling", "Sorveglianza & Servizi"], ["vs_eco", "qd_elle", "Dossier & Deduzioni"],
    ["sg_miriel", "cc_lyra", "Armonie di Cristallo & Sigilli"], ["sg_preside", "fo_lupin", "I Segreti dei Maestri"],
    ["fo_lupin", "dz_sterling", "Ombre & Servizi Segreti"], ["fo_turing", "te_valenti", "Crittografi del Binario"],
    ["qd_raito", "qd_elle", "Duello Mentale"], ["qd_ryu", "qd_misa", "Occhi dello Shinigami"], ["qd_elle", "dc_agata", "Deduzioni & Lavagna"],
    ["ce_selce", "dc_agata", "Mappe & Indagini"], ["ce_tamburo", "fa_mirella", "Meccanica & Rinvii"],
    ["dz_sterling", "mn_desantis", "Servizi Segreti & Questura"], ["dz_eva", "dc_agata", "Crittografia & Indagini"],
    ["fa_roderico", "gl_barbabiscotto", "Lupi di Fiume e di Mare"], ["fa_mirella", "my_alvarez", "Mappe e Glifi dell'Acqua"],
    ["te_valenti", "mn_desantis", "Intelligenza di Frontiera"], ["te_elena", "dc_agata", "Mistero & Eleganza"],
    ["my_ixchel", "alc_sam", "Sentieri e Chiavi"], ["my_alvarez", "dt_ofelia", "Appunti e Indizi"],
    ["alc_bruno", "mg_bullone", "Pezzi di Ricambio & Forbici"], ["alc_malick", "tc_ardo", "I Baluardi di Pietra"],
    ["mn_desantis", "dc_agata", "Fiuto Investigativo"],
    ["rt_baldo", "td_corrado", "Capitani di campo e di mulino"], ["gp_rosalba", "dg_fiamma", "Teste rosse e cuori caldi"], ["gp_bullone", "sq_ines", "Mani d'olio e di ferro"],
    ["dg_fiamma", "sq_scintilla", "Scintille gemelle"], ["dg_ruggine", "cm_bastiano", "Capitani che non smettono"],
    ["sq_ines", "mg_tilde", "Nonne d'acciaio"], ["rz_ferruccio", "mg_bullone", "Bulloni postali"], ["rz_orsola", "sq_ines", "Le capitane di quartiere"], ["cs_baldo", "ft_atlante", "Leggende che tornano in campo"], ["cs_max", "sq_brina", "Sorrisi d'estate"], ["sq_scintilla", "mg_brace", "Chi gioca col fuoco"], ["sq_brina", "ve_selva", "Fresco e gentile"],
    ["ft_atlante", "cm_bastiano", "Leggende che tornano"], ["ft_vega", "so_zorgo", "Venuti dalle stelle"], ["ft_sam", "cm_pio", "I piedi per terra"],
    ["td_corrado", "tc_gualtiero", "Vecchi capitani"], ["td_isotta", "tc_ysolde", "Eredi che non obbediscono"], ["td_lia", "gr_vela", "Ribelli dei tetti"],
    ["gr_vela", "nl_leandro", "Ombre sui tetti"], ["gr_marisa", "ml_marta", "Capitane sotto la pioggia"], ["gr_alfio", "cm_bastiano", "I vecchi che sanno"],
    ["cm_bastiano", "ml_pino", "Vecchi maestri"], ["cm_bastiano", "nl_leandro", "Il '52 e il '78"], ["tc_ysolde", "dc_agata", "Chi sa tutto"], ["cm_leone", "ts_lume", "Rivali di fuoco"],
    ["mg_bullone", "so_blop", "Ferraglia amica"], ["sf_gatto", "nl_lucia", "Le notti lunghe"], ["cc_re", "tm_eclisse", "Il silenzio e il buio"], ["ml_marta", "nl_fiammetta", "Fiori e lanterne"],
    ["tc_brunilde", "cc_lyra", "Cavaliere"], ["cm_saverio", "tc_ardo", "Muri di pietra"], ["sf_ada", "ep_ada", "Le due Ade"], ["ve_selva", "mg_tilde", "Mani gentili"], ["tm_custode", "cm_bastiano", "Chi aspetta"],
    ["vl_agata", "dc_agata", "Le due Agate"], ["vl_bianca", "mg_bullone", "Chiavi inglesi"], ["vl_noemi", "sf_mira", "Voci alla radio"], ["vl_lampionaio", "nl_lucia", "Custodi di lampioni"], ["vl_berto", "cm_saverio", "Portieri di ferro"], ["vl_remo", "cm_leone", "Capitani di fuoco"],
    ["vl_aurelio", "vl_teodora_l", "Fratello e sorella"], ["vl_ombra", "vl_aurelio", "Avversari al minuto"],
    ["vl_teodora", "chr_elias", "Custodi dell'orario"], ["vl_vica", "ts_alba", "Il paese in cucina"], ["kb_vespera", "dc_agata", "Menti deduttive"], ["kb_baelor", "tc_ysolde", "Chi sa tutto"], ["kb_gareth", "tc_gualtiero", "Cavalieri d'onore"], ["pi_anemona", "ve_selva", "Occhi sul vento"],
    ["al_kira", "vl_bianca", "Mani nell'officina"], ["al_armatura", "gr_gancio", "Armadi gentili"], ["chr_aria", "ep_ada", "Guardiane del tempo"], ["omb_maya", "dc_nina", "Penne d'inchiesta"], ["rag_sigrid", "bv_boris", "Voci dei vecchi tempi"], ["rag_brokk", "sh_muramasa", "Mastri fabbri"],
    ["bv_nadia", "sh_hanzo", "Volpi e ombre"], ["sh_hayato", "cm_bastiano", "Vecchi maestri"], ["fe_roland", "td_corrado", "Eredi di casate"], ["abi_nora", "nl_fiammetta", "Luci nella notte"], ["cr_aira", "ve_sbuffo", "Venute dal cielo"], ["mu_ugolino", "tc_ardo", "Muri di pietra"], ["lb_narratore", "pi_morgana", "Voci che comandano"],
    ["nf_bora", "nf_gaspare", "Capitana e Magazziniere"], ["cp_crispino", "cp_cacace", "Guardie e Tonache"], ["cp_tito", "cp_peppe", "I Soliti Ignoti"], ["cp_rosetta", "gl_cannella", "Salumi e Gallette"], ["re_brando", "mu_ugolino", "Muri di pietra"],
    ["rm_spartaco", "pr_sceriffo", "La Legge e la Sabbia"], ["rm_furbio", "tc_ysolde", "Senatori e Troni"],
  ];
  // le otto sfide del Torneo dei Sogni: cabinato della Sala Giochi (motore) e avversario
  const SFIDE = [
    { m: "vignette", saga: "torneo", opp: { name: "I Sogni delle Cento Scuole", color: "#c83a3a", style: "equilibrata" } },
    { m: "bottoni", saga: "mantello", opp: { name: "I Sogni di Metropolenta", color: "#8a1a2a", style: "contropiede", players: [{ name: "Tonno" }, { name: "Ciuffo" }, { name: "Colla" }, { name: "Mastice" }] } },
    { m: "luci", saga: "lampioni", opp: { name: "Le Ombre dei Sogni", color: "#6a7ab8", style: "equilibrata" } },
    { m: "nastro", saga: "stagione", opp: { name: "La Domenica dei Sogni", color: "#ff5a7a", style: "pressing" } },
    { m: "concilio", saga: "trono", opp: { name: "La Casata dei Sogni", color: "#8a6a1a", sigil: "🌳", honor: 0.4, style: "pressing" } },
    { m: "lavagna", saga: "colline", opp: { name: "La Lega dei Sogni", color: "#a83a2a", style: "pressing", ovr: 68, instr: "pressing" } },
    { m: "duello", saga: "campetto", opp: { name: "La Nazionale dei Sogni", color: "#e8e8f0", style: "pressing", players: [{ name: "Il Barone", pow: 14 }, { name: "Gelo", pow: 12 }], keeper: { name: "Il Muro dei Sogni", pow: 16 }, ace: { name: "Il Barone", special: "Fuoco del Nord" } } },
    { m: "atb", saga: "cronache", opp: null },
  ];
  // ---------------------------------------------------------------- moduli tattici
  const MODULI = {
    rombo: {
      id: "rombo",
      name: "Rombo 1-2-1",
      icon: "🔶",
      short: "1D · 2C · 1A",
      desc: "Fraseggio corto e tecnica sopraffina: bonus a Tecnica, ricarica abilità, lanterne e tempo.",
      matchBonusDesc: "+TEC e fraseggio: +1 lanterna, +1 riavvolgimento o tempo, passaggi e idee impeccabili",
      check: (roles) => roles.filter((r) => r === "D" || r === "P").length >= 1 && roles.filter((r) => r === "C").length >= 2 && roles.filter((r) => r === "A").length >= 1,
      hint: "1 Difensore (o P), 2 Centrocampisti, 1 Attaccante",
      bonus: { at: 0, df: 0, te: 1 },
      effects: {
        arena: "⚡ +20% Tecnica e velocità turni · Abilità pronte 1 turno prima all'avvio (con sintonia) · +12% Colpo Critico con tratto Mente",
        torneo: "💡 +1 Lanterna (Luci), +1 Riavvolgimento (Nastro), +1 Tempo (Pallatempo), +1 Ciak (Ciak d'Autore), +1 Slot Gadget",
        stagione: "🎯 +2 Forza globale e controllo del gioco nella simulazione · Idee e passaggi impeccabili nelle partite giocate",
        arcade: "🏃 Manovra fluida, assist millimetrici e ricarica rapida mosse speciali"
      }
    },
    catenaccio: {
      id: "catenaccio",
      name: "Catenaccio 2-1-1",
      icon: "🛡️",
      short: "2D · 1C · 1A",
      desc: "Muro difensivo d'acciaio e ripartenza: parate ermetiche, scudo protettivo e contrasti duri.",
      matchBonusDesc: "+DIF impenetrabile: turni extra in difesa, contrasti ferrei e scudo protettivo",
      check: (roles) => roles.filter((r) => r === "D" || r === "P").length >= 2 && roles.filter((r) => r === "C").length >= 1 && roles.filter((r) => r === "A").length >= 1,
      hint: "2 Difensori (o D+P), 1 Centrocampista, 1 Attaccante",
      bonus: { at: 0, df: 1, te: 0 },
      effects: {
        arena: "🛡️ +25% Difesa squadra · +40 Scudo iniziale a tutti al Round 1 · Danni subiti ridotti del 12%",
        torneo: "🧤 Turni extra difesa (Luci/Concilio), +1 Cuore (Ipogeo), +Fiches scudo (Roulette), +Parate Portiere",
        stagione: "🔒 −1 gol subito medio per partita nella simulazione · Muro difensivo invalicabile nelle partite giocate",
        arcade: "🧱 Scudo più resistente, recuperi palla fulminei e contrasti vincenti"
      }
    },
    tridente: {
      id: "tridente",
      name: "Tridente 1-1-2",
      icon: "⚡",
      short: "1D · 1C · 2A",
      desc: "Attacco travolgente a due punte: +1 azione/tiro offensivo, colpi critici devastanti e grinta.",
      matchBonusDesc: "+ATT arrembante: +1 azione o tiro in attacco, conclusioni esplosive e grinta alta",
      check: (roles) => roles.filter((r) => r === "D" || r === "P").length >= 1 && roles.filter((r) => r === "C").length >= 1 && roles.filter((r) => r === "A").length >= 2,
      hint: "1 Difensore (o P), 1 Centrocampista, 2 Attaccanti",
      bonus: { at: 1, df: 0, te: 0 },
      effects: {
        arena: "⚔️ +25% Attacco · Critici a 1.75× danno · Barra Colpo di Squadra si carica il 30% più in fretta",
        torneo: "🔥 +1 Azione offensiva (Vignette), +1 Tiro (Bottoni), +15 Grinta (Duello), +1 Turno d'attacco (Concilio)",
        stagione: "⚽ +3 Forza offensiva e media gol più alta nelle simulazioni · Conclusione letale nelle partite giocate",
        arcade: "💥 Tiri potenti, scatti brucianti e conclusioni a rete imparabili"
      }
    },
    quadrato: {
      id: "quadrato",
      name: "Quadrato 2-2",
      icon: "🟩",
      short: "2D · 2A / 2C",
      desc: "Assetto simmetrico e transizioni rapide: salute massima aumentata, barra speciale carica e costanza.",
      matchBonusDesc: "Equilibrio totale: +energia nei duelli e nel volo, tenuta costante su entrambi i fronti",
      check: (roles) => roles.filter((r) => r === "D" || r === "P").length >= 2 && (roles.filter((r) => r === "A").length >= 2 || roles.filter((r) => r === "C").length >= 2),
      hint: "2 Difensori (o P) e 2 Attaccanti (oppure 2 Centrocampisti)",
      bonus: { at: 0, df: 0, te: 0 },
      effects: {
        arena: "💚 +15% Salute massima · +8% ATT, DIF e TEC · Barra Colpo di Squadra già al 25% all'avvio · +18 Scudo in Difesa",
        torneo: "🔋 +15 Energia nel volo, +10 Grinta nei duelli, transizioni offensive e difensive continue",
        stagione: "⚖️ Equilibrio e costanza: tenuta atletica superiore nei finali di gara, rendimento stabile",
        arcade: "🔄 Recupero rapido stamina, ottima reattività e supporto costante su ambo le fasi"
      }
    },
    fortezza: {
      id: "fortezza",
      name: "Fortezza 3-1",
      icon: "🏰",
      short: "3D/C · 1A",
      desc: "Linee serrate e contropiede letale: salute e scudo alti, contrattacco spinato e massima credibilità.",
      matchBonusDesc: "Resistenza estrema: +credibilità nel concilio, salvataggi miracolosi e contrasti duri",
      check: (roles) => roles.filter((r) => r === "D" || r === "P" || r === "C").length >= 3 && roles.filter((r) => r === "A").length >= 1,
      hint: "3 tra Difensori e Centrocampisti, 1 Attaccante",
      bonus: { at: 0, df: 1, te: 0 },
      effects: {
        arena: "🏰 +20% Salute massima, +25% Difesa · +35 Scudo iniziale a tutti · Contrattacco (rimanda il 18% dei danni sotto scudo)",
        torneo: "👑 +Credibilità massima nel Concilio, turni prolungati di tenuta (Luci), contrasti rocciosi",
        stagione: "🛡️ Rigore tattico: subisce pochissimi gol sia nelle simulate che nelle giocate per blindare il risultato",
        arcade: "🪨 Resistenza agli urti, intercettazioni aeree e impenetrabilità difensiva"
      }
    }
  };
  function modSintonia(modKey, team) {
    const m = MODULI[modKey] || MODULI.rombo;
    const roles = team.map((id) => BY[id] && BY[id].role).filter(Boolean);
    return roles.length >= 5 && m.check(roles);
  }

  // ---------------------------------------------------------------- salvataggio
  const load = () => { const o = load0(); XPC = o.xp; return o; };
  const load0 = () => { const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {}; return { own: Array.isArray(r.own) ? r.own.filter((x) => BY[x]) : [], team: Array.isArray(r.team) ? r.team.filter((x) => BY[x]).slice(0, 5) : [], won: Array.isArray(r.won) ? r.won.filter((x) => typeof x === "number") : [], packs: r.packs | 0, hero: !!r.hero, xp: r.xp && typeof r.xp === "object" ? r.xp : {}, season: r.season && Array.isArray(r.season.sched) ? r.season : null, titles: r.titles | 0, draft: r.draft && Array.isArray(r.draft.picks) ? r.draft : null, cups: r.cups | 0, modulo: typeof r.modulo === "string" && MODULI[r.modulo] ? r.modulo : "rombo" }; };
  const save = (r) => { XPC = r.xp || {}; safe(() => localStorage.setItem(KEY, JSON.stringify(r)), 0); };
  const sagaMem = (k) => safe(() => JSON.parse(localStorage.getItem(SG(k)[0]) || "null"), null);
  function progress(k) {
    if (k === "borgo") {
      const done = {}, ends = [];
      for (let i = 1; i <= 12; i++) {
        const d = safe(() => JSON.parse(localStorage.getItem("ali-di-rondine.stagione" + i) || "null"), null);
        if (d && typeof d === "object") { done[i] = true; ends.push("s" + i); }
      }
      const cur = safe(() => JSON.parse(localStorage.getItem("ali-di-rondine.salvataggio") || "null"), null);
      if (cur && cur.season > 1) { for (let i = 1; i < cur.season; i++) done[i] = true; }
      return { ch: Object.keys(done).length, ends: ends.length, done };
    }
    let m = null; const mod = SG(k)[3];
    if (mod) m = safe(() => { const i = window[mod].info(); return i && i.done ? i : null; }, null);
    if (!m) m = sagaMem(k);
    if (!m) return { ch: 0, ends: 0, done: {} };
    return { ch: Object.keys(m.done || {}).length, ends: Array.isArray(m.ends) ? m.ends.length : 0, done: m.done || {} };
  }
  // le carte a capitoli (c.n) si sbloccano a capitolo concluso; le altre seguono la regola per rarità
  const earned = (c) => { const p = progress(c.saga); if (c.n) return !!p.done[c.n]; return c.rar === "c" ? p.ch >= 1 : c.rar === "r" ? p.ch >= 2 : c.rar === "e" ? p.ch >= 3 || p.ends >= 1 : p.ends >= 4; };
  const drop = (c) => !c.n || earned(c); // le carte a capitoli non escono a sorpresa prima di averle guadagnate
  function sync() { const r = load(); XPC = r.xp; let nw = []; CARDS.forEach((c) => { if (!r.own.includes(c.id) && earned(c)) { r.own.push(c.id); nw.push(c.id); } }); if (nw.length) save(r); return { r, nw }; }
  // ---------------------------------------------------------------- intesa e forza
  function intesa(team, modKey) {
    let n = 0; const why = [];
    const sagaCount = {};
    for (let i = 0; i < team.length; i++) {
      const a = BY[team[i]];
      if (a) sagaCount[a.saga] = (sagaCount[a.saga] || 0) + 1;
      for (let j = i + 1; j < team.length; j++) {
        const b = BY[team[j]]; if (!a || !b) continue;
        if (a.saga === b.saga) n += 1;
        const L = LINKS.find(([x, y]) => (x === a.id && y === b.id) || (x === b.id && y === a.id));
        if (L) { n += 3; why.push(L[2]); }
      }
    }
    // Blocco di Saga (se 3 o più giocatori sono della stessa saga: affinità naturale!)
    Object.entries(sagaCount).forEach(([sg, cnt]) => {
      if (cnt >= 3) {
        n += 2;
        why.push(`Blocco ${SG(sg)[1]} (x${cnt})`);
      }
    });
    // Sintonia Modulo
    const mKey = modKey || (safe(() => load().modulo, "rombo")) || "rombo";
    const m = MODULI[mKey] || MODULI.rombo;
    const sin = modSintonia(mKey, team);
    if (sin) {
      n += 2;
      why.push(`Sintonia ${m.name}`);
    }
    return { n: Math.min(20, n), why, sintonia: sin, modulo: m };
  }
  function intesaBadge(n) {
    if (n >= 15) return `<span class="sgIntTag leg">🌟 Leggendaria (${n}/20)</span>`;
    if (n >= 10) return `<span class="sgIntTag top">✨ Affiatata (${n}/20)</span>`;
    if (n >= 5) return `<span class="sgIntTag med">⚡ In sintonia (${n}/20)</span>`;
    return `<span class="sgIntTag base">In crescita (${n}/20)</span>`;
  }
  // le stelle: la carta cresce giocando (3, 8 e 15 punti esperienza); ogni stella dà +2 a tutte le statistiche, solo qui nella Squadra dei Sogni
  let XPC = {};
  const starsOf = (id) => { const x = XPC[id] | 0; return x >= 15 ? 3 : x >= 8 ? 2 : x >= 3 ? 1 : 0; };
  const eff = (c) => { const b = starsOf(c.id) * 2; return { at: c.at + b, df: c.df + b, te: c.te + b }; };
  const ovr = (c) => { const e = eff(c); return Math.round((e.at + e.df + e.te) / 3); };
  const roleOvr = (c) => { const e = eff(c); return Math.round(c.role === "A" ? (2 * e.at + e.te) / 3 : c.role === "C" ? (e.at + e.df + 2 * e.te) / 4 : (2 * e.df + e.te) / 3); }; // in lavagna ognuno pesa col suo ruolo: ATT per gli attaccanti, DIF per difesa e portiere, TEC per il centrocampo
  const forza = (team) => { const cs = team.map((id) => BY[id]).filter(Boolean); if (!cs.length) return 40; return Math.round(cs.reduce((s, c) => s + ovr(c), 0) / cs.length); };
  // le STATISTICHE pesano in ogni motore: la media di ATT/DIF/TEC delle carte in squadra (con le stelle e con il modulo) diventa un livello 0-3
  // (0 sotto ~57, 1 ~60, 2 ~66, 3 da ~72) che i motori trasformano in concreti bonus: tiri/azioni, parate/difesa, passaggi/tecnica
  const lvOf = (x) => Math.max(0, Math.min(3, Math.round((x - 54) / 6)));
  function tiers(team, modKey) {
    const cs = team.map((id) => BY[id]).filter(Boolean), n = cs.length || 1, sum = { at: 0, df: 0, te: 0 };
    cs.forEach((c) => { const e = eff(c); sum.at += e.at; sum.df += e.df; sum.te += e.te; });
    const mKey = modKey || (safe(() => load().modulo, "rombo")) || "rombo";
    const sin = modSintonia(mKey, team);
    const m = MODULI[mKey] || MODULI.rombo;
    const mb = sin ? m.bonus : { at: 0, df: 0, te: 0 };
    return cs.length ? {
      at: Math.min(3, lvOf(sum.at / n) + mb.at),
      df: Math.min(3, lvOf(sum.df / n) + mb.df),
      te: Math.min(3, lvOf(sum.te / n) + mb.te)
    } : { at: 0, df: 0, te: 0 };
  }
  const statLine = (team, modKey) => {
    const r = load(), mKey = modKey || r.modulo || "rombo", M_MOD = MODULI[mKey] || MODULI.rombo;
    const sin = modSintonia(mKey, team);
    const T = tiers(team, mKey);
    return `<p class="sum" style="font-size:12px;opacity:.9">⚔️ <b>ATT ${T.at}</b>: tiri e azioni · 🛡️ <b>DIF ${T.df}</b>: parate e difesa · 🎯 <b>TEC ${T.te}</b>: passaggi, dribbling e tecnica.<br><span style="color:#ffd23f">📋 Modulo <b>${M_MOD.name}</b>${sin ? " (✨ Sintonia Attiva: bonus applicati)" : ` (${M_MOD.hint})`}</span>. Le statistiche contano concretamente in ogni motore di gioco.</p>`;
  };
  function gainXp(team, win, sim) {
    const r = load(), ups = [];
    team.forEach((id) => { if (!r.own.includes(id)) return; const s0 = starsOf(id); r.xp[id] = Math.min(15, (r.xp[id] | 0) + (sim ? (win ? 1 : 0) : win ? 2 : 1)); XPC = r.xp; if (starsOf(id) > s0) ups.push([id, starsOf(id)]); });
    save(r); return ups;
  }
  // le carte salite di stella dopo una partita; a tre stelle si sblocca la frase speciale
  function levelUps(ups, then) {
    if (!ups.length) return then();
    const [id, st] = ups[0], body = shell(st >= 3 ? "⭐⭐⭐ Carta al massimo!" : "⭐ La carta cresce");
    body.innerHTML = `<div class="reveal">${cardHtml(id)}</div><p class="sum" style="text-align:center"><b>${esc(name(id))}</b> sale a ${"★".repeat(st)}${"☆".repeat(3 - st)} · +2 a tutte le statistiche</p>${st >= 3 ? `<p class="frase">«${esc(FRASI[id] || "Questa squadra è un sogno.")}»</p>` : ""}<div class="big"><button type="button" data-ok="1">Avanti ▸<small>${ups.length > 1 ? "Un'altra carta è cresciuta" : "Si continua"}</small></button></div>`;
    body.querySelector("[data-ok]").onclick = () => levelUps(ups.slice(1), then);
  }
  const name = (id) => { const C = window.__borgoApi && window.__borgoApi.CAST; return (C && C[id] && C[id].name) || id; };
  const port = (id) => safe(() => window.__borgoApi.portraitImg(id), null);
  // ---------------------------------------------------------------- la carta (HTML)
  function cardHtml(id, opts) {
    const c = BY[id], R = RAR[c.rar], own = !opts || opts.own !== false, img = own ? port(id) : null, S = SG(c.saga), st = own ? starsOf(id) : 0, e = own ? eff(c) : c;
    return `<div class="sgCard r${c.rar}${own ? "" : " lock"}${opts && opts.sel ? " sel" : ""}${st >= 3 ? " s3" : ""}" data-c="${id}" style="--rc:${R[1]};--sc:${S[2]}"${st >= 3 ? ` title="«${esc(FRASI[id] || "")}»"` : ""}>${own ? `<button type="button" class="sgLoreBtn" data-lore="${id}" title="📖 Lore e Dettagli" aria-label="Lore e dettagli">📖</button>` : ""}<div class="hd"><span>${R[0]}</span><b>${c.role}</b></div>${st ? `<div class="stars">${"★".repeat(st)}</div>` : ""}<div class="img">${img ? `<img alt="" src="${img}">` : `<span>?</span>`}</div><div class="nm">${own ? esc(name(id)) : "???"}</div><div class="st"><span>ATT <b>${own ? e.at : "–"}</b></span><span>DIF <b>${own ? e.df : "–"}</b></span><span>TEC <b>${own ? e.te : "–"}</b></span></div><div class="sg">${esc(S[1])}</div></div>`;
  }

  function getCardLore(c) {
    const api = window.__borgoApi;
    if (api && api.CAST && api.CAST[c.id] && api.CAST[c.id].bio) return api.CAST[c.id].bio;
    if (api && api.BIO && api.BIO[c.id]) return api.BIO[c.id];
    const borgoExtra = {
      mattia: "Portiere reclutato tra i moli di Borgo Marino: riflessi d'istinto e fama di saracinesca nei tornei estivi.",
      kevin: "Bagnino e ala imprendibile dello Scoglio: scende dal pedalò e brucia la fascia a piedi nudi sulla sabbia.",
      saverio: "Difensore ruvido del porto vecchio: poche parole, baffo d'ordinanza e anticipo secco su ogni pallone vagante.",
    };
    if (borgoExtra[c.id]) return borgoExtra[c.id];
    const sagaNames = {
      borgo: "Anima di Borgo Marino e della Rondine: cresciuto tra il sale del porto, i tavoli della trattoria e le notti di coppa.",
      campetto: "Cresciuto nei campetti di periferia tra pali arrugginiti e asfalto, sa che il vero talento nasce dalla passione e dal sudore.",
      note: "Custodisce segreti tattici e schemi indecifrabili. Ogni partita per lui è una partita a scacchi giocata con la mente.",
      fortino: "Esperto in infiltrazioni e colpi audaci. In campo si muove come un'ombra, capace di scassinare le difese più ermetiche.",
      sigilli: "Formatosi all'Accademia dei Sigilli, padroneggia le arti magiche del pallone tra parabole incantate e barriere arcane.",
      circuiti: "Pilota e atleta potenziato nella metropoli al neon del 2099. Riflessi cibernetici e scatti fulminei a frequenza quantistica.",
      vallombra: "Custode dei misteri di Vallombra e delle sue tradizioni secolari. Freddo nei momenti decisivi, gioca con cuore d'acciaio.",
      alcatraz: "Veterano della prigione più dura, sa cosa significa lottare per ogni centimetro di campo senza mai abbassare la guardia.",
      treno: "Viaggiatore dell'Espresso delle Ombre, abituato a muoversi nel fumo e a leggere i punti deboli di chiunque in un batter d'occhio.",
      gala: "Figura di spicco nei salotti e negli stadi più prestigiosi del mondo. Classe cristallina e visione di gioco da gran galà.",
      spia: "Agente sotto copertura con licenza di cross. Calcola ogni traiettoria al millimetro prima ancora che il pallone tocchi terra.",
    };
    return sagaNames[c.saga] || `Leggenda della saga «${SG(c.saga)[1]}». Scende in campo per portare la Squadra dei Sogni alla gloria.`;
  }

  function getSkillInfo(id, role) {
    const u = (window.__arena && window.__arena.UNIQUE_SKILLS && window.__arena.UNIQUE_SKILLS[id]);
    if (u) return { name: u.name, desc: u.desc, cd: u.cd || 3, special: true };
    const rNames = {
      A: { name: "Tiro di Fuoco", desc: "Conclusione potente da 2.2× sui pali avversari", cd: 3 },
      C: { name: "Regia Fulminea", desc: "Aumenta del +25% i danni di tutta la squadra per 2 round", cd: 2 },
      D: { name: "Muro Vivente", desc: "Attira i colpi avversari e guadagna uno scudo protettivo", cd: 3 },
      P: { name: "Parata Ermetica", desc: "Dona scudo a tutti i compagni e neutralizza i tiri a rete", cd: 3 },
      B: { name: "Battuta Jolly", desc: "Colpo jolly ad alta precisione con bonus critico", cd: 2 },
    };
    return rNames[role] || { name: "Azione di Classe", desc: "Manovra tattica decisiva per la squadra", cd: 3 };
  }

  function openCardLore(id, back) {
    const c = BY[id];
    if (!c) return;
    const r = load();
    const isOwn = r.own.includes(id);
    const R_RAR = RAR[c.rar];
    const S_SAG = SG(c.saga);
    const st = isOwn ? starsOf(id) : 0;
    const curXp = isOwn ? (r.xp[id] | 0) : 0;
    const nextXp = st === 0 ? 3 : st === 1 ? 8 : 15;
    const e = isOwn ? eff(c) : c;
    const img = isOwn ? port(id) : null;
    const inTeam = r.team.includes(id);
    const roleFull = { A: "Attaccante", C: "Centrocampista", D: "Difensore", P: "Portiere", B: "Battitore Jolly" }[c.role] || c.role;
    const roleIcon = { A: "⚔️", C: "🎯", D: "🛡️", P: "🧤", B: "⭐" }[c.role] || "⚽";

    const body = shell("📖 Scheda & Lore del Personaggio");
    const quote = FRASI[id] || "Questa squadra è un sogno.";
    const loreText = getCardLore(c);
    const skill = getSkillInfo(id, c.role);
    const charLinks = LINKS.filter(([a, b]) => a === id || b === id).map(([a, b, t]) => {
      const otherId = a === id ? b : a;
      return { title: t, other: otherId, otherName: name(otherId), active: r.own.includes(otherId) };
    });

    let flipped = false;

    function renderView() {
      body.innerHTML = `
        <div class="sgLoreWrap">
          <div class="sgFlipCardArea">
            <div class="sgFlipCardInner ${flipped ? "flipped" : ""}" style="--rc:${R_RAR[1]};--sc:${S_SAG[2]}">
              <!-- FRONTE CARTA -->
              <div class="sgFlipFace sgFlipFront r${c.rar}">
                <div class="sgCardHolo"></div>
                <div class="sgFlipHd">
                  <span class="rarBadge" style="background:${R_RAR[1]}">${R_RAR[0]}</span>
                  <span class="roleBadge">${roleIcon} ${roleFull}</span>
                </div>
                <div class="sgFlipImgWrap">
                  ${img ? `<img src="${img}" alt="${esc(name(id))}">` : `<span class="ph">?</span>`}
                  ${st > 0 ? `<div class="sgFlipStars">${"★".repeat(st)}${"☆".repeat(3 - st)}</div>` : ""}
                </div>
                <div class="sgFlipName">${esc(name(id))}</div>
                <div class="sgFlipSaga" style="color:${S_SAG[2]}">🏛️ ${esc(S_SAG[1])}</div>
                
                <div class="sgFlipStatsBox">
                  <div class="stRow">
                    <span>⚔️ ATT <b>${e.at}</b></span>
                    <div class="stBar"><div class="stFill att" style="width:${Math.min(100, (e.at / 99) * 100)}%"></div></div>
                    <small>base ${c.at}${st ? ` +${st * 2}` : ""}</small>
                  </div>
                  <div class="stRow">
                    <span>🛡️ DIF <b>${e.df}</b></span>
                    <div class="stBar"><div class="stFill dif" style="width:${Math.min(100, (e.df / 99) * 100)}%"></div></div>
                    <small>base ${c.df}${st ? ` +${st * 2}` : ""}</small>
                  </div>
                  <div class="stRow">
                    <span>🎯 TEC <b>${e.te}</b></span>
                    <div class="stBar"><div class="stFill tec" style="width:${Math.min(100, (e.te / 99) * 100)}%"></div></div>
                    <small>base ${c.te}${st ? ` +${st * 2}` : ""}</small>
                  </div>
                </div>

                <div class="sgFlipXpRow">
                  <span>⭐ Esperienza: <b>${curXp}/${nextXp} XP</b></span>
                  <div class="xpBar"><div class="xpFill" style="width:${Math.min(100, (curXp / nextXp) * 100)}%"></div></div>
                </div>

                <div class="sgTouchFlipHint">↻ Tocca la carta per girarla e leggere la Lore</div>
              </div>

              <!-- RETRO CARTA (LORE & CURIOSITÀ) -->
              <div class="sgFlipFace sgFlipBack r${c.rar}">
                <div class="sgCardHolo"></div>
                <div class="sgBackHd">
                  <div class="sagaTag" style="border-color:${S_SAG[2]};color:${S_SAG[2]}">📜 ${esc(S_SAG[1])}</div>
                  <span class="roleBadge">${roleIcon} ${c.role}</span>
                </div>

                <div class="sgQuoteBox">«${esc(quote)}»</div>

                <div class="sgLoreSec">
                  <div class="sgLoreSecTitle">📖 Biografia & Curiosità</div>
                  <div class="sgLoreSecText">${esc(loreText)}</div>
                </div>

                <div class="sgLoreSec">
                  <div class="sgLoreSecTitle">⚔️ Tecnica in Battaglia</div>
                  <div class="sgLoreSkill">
                    <b>✦ ${esc(skill.name)}</b> <span class="cdTag">(${skill.cd} turni)</span>
                    <p>${esc(skill.desc)}</p>
                  </div>
                </div>

                ${charLinks.length ? `
                  <div class="sgLoreSec">
                    <div class="sgLoreSecTitle">🤝 Legami (+3 Intesa)</div>
                    <div class="sgLoreLinksList">
                      ${charLinks.map((lk) => `<div class="lkItem ${lk.active ? "on" : "off"}"><b>${esc(lk.title)}</b> con ${esc(lk.otherName)} ${lk.active ? "✓" : "(da sbloccare)"}</div>`).join("")}
                    </div>
                  </div>
                ` : ""}

                <div class="sgTouchFlipHint">↻ Tocca la carta per tornare alle statistiche</div>
              </div>
            </div>
          </div>

          <!-- AZIONI RAPIDE SMARTPHONE -->
          <div class="sgLoreActions">
            <button type="button" class="sgActionBtn flipBtn">🔄 Gira Carta</button>
            <button type="button" class="sgActionBtn teamBtn ${inTeam ? "inTeam" : ""}">${inTeam ? "✕ Togli dalla Squadra" : "⚽ Schiera in Squadra"}</button>
          </div>
          <div class="big" style="margin-top:6px">
            <button type="button" data-close-lore="1">◂ Torna indietro<small>${back ? "alla schermata precedente" : "alla Squadra dei Sogni"}</small></button>
          </div>
        </div>
      `;

      const cardInner = body.querySelector(".sgFlipCardInner");
      if (cardInner) {
        cardInner.onclick = () => {
          flipped = !flipped;
          cardInner.classList.toggle("flipped", flipped);
        };
      }
      const flipBtn = body.querySelector(".flipBtn");
      if (flipBtn) {
        flipBtn.onclick = () => {
          flipped = !flipped;
          if (cardInner) cardInner.classList.toggle("flipped", flipped);
        };
      }
      const teamBtn = body.querySelector(".teamBtn");
      if (teamBtn) {
        teamBtn.onclick = () => {
          toggle(id);
          openCardLore(id, back);
        };
      }
      const closeBtn = body.querySelector("[data-close-lore]");
      if (closeBtn) {
        closeBtn.onclick = () => {
          if (typeof back === "function") back();
          else open();
        };
      }
    }

    renderView();
  }

  // ---------------------------------------------------------------- le schermate
  let OV = null, BACK = null;
  let COLL_FILT = { q: "", own: "all", rar: "all", role: "all" };
  const isFiltered = () => !!COLL_FILT.q || COLL_FILT.own !== "all" || COLL_FILT.rar !== "all" || COLL_FILT.role !== "all";
  function shell(title) { css(); if (OV) OV.remove(); OV = document.createElement("div"); OV.className = "sgOv"; OV.innerHTML = `<div class="wrap"><div class="bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="body"></div></div>`; OV.querySelector(".x").onclick = () => { const b = BACK; closeAll(); if (typeof b === "function") b(); }; document.body.appendChild(OV); return OV.querySelector(".body"); }
  function closeAll() { if (OV) { OV.remove(); OV = null; } }

  function matchCard(c, q, r) {
    if (COLL_FILT.own === "own" && !r.own.includes(c.id)) return false;
    if (COLL_FILT.own === "lock" && r.own.includes(c.id)) return false;
    if (COLL_FILT.rar !== "all" && c.rar !== COLL_FILT.rar) return false;
    if (COLL_FILT.role !== "all" && c.role !== COLL_FILT.role) return false;
    if (!q) return true;
    const n = (name(c.id) || "").toLowerCase();
    const sg = (SG(c.saga)[1] || "").toLowerCase();
    const rarName = (RAR[c.rar] ? RAR[c.rar][0] : "").toLowerCase();
    const roleName = c.role === "A" ? "attaccante attacco" : c.role === "C" ? "centrocampista centrocampo" : c.role === "D" ? "difensore difesa" : c.role === "P" ? "portiere" : c.role === "B" ? "battitore jolly" : "";
    const words = q.split(/\s+/).filter(Boolean);
    return words.every((w) => n.includes(w) || sg.includes(w) || rarName.includes(w) || roleName.includes(w) || c.id.toLowerCase().includes(w));
  }

  function renderColl(body, r) {
    const collEl = body.querySelector(".coll");
    const countEl = body.querySelector(".sgCount");
    const resetBtn = body.querySelector(".sgCollReset");
    const clearBtn = body.querySelector(".sgClearBtn");
    if (!collEl) return;
    if (clearBtn) clearBtn.style.display = COLL_FILT.q ? "" : "none";
    if (resetBtn) resetBtn.style.display = isFiltered() ? "" : "none";

    body.querySelectorAll(".sgFilterRow .sgChip").forEach((chip) => {
      const group = chip.parentElement.dataset.filtGroup;
      if (group && COLL_FILT[group] !== undefined) {
        chip.classList.toggle("active", COLL_FILT[group] === chip.dataset.val);
      }
    });

    const q = (COLL_FILT.q || "").trim().toLowerCase();
    const filtered = CARDS.filter((c) => matchCard(c, q, r));
    filtered.sort((a, b) => (r.own.includes(b.id) ? 1 : 0) - (r.own.includes(a.id) ? 1 : 0));

    if (countEl) {
      countEl.innerHTML = `Mostrate <b>${filtered.length}</b> di <b>${CARDS.length}</b> carte${r.own.length ? ` · <b>${filtered.filter((c) => r.own.includes(c.id)).length}</b> possedute` : ""}`;
    }

    if (!filtered.length) {
      collEl.innerHTML = `<div class="sgEmptyColl">Nessuna carta corrisponde ai filtri selezionati.<br><button type="button" class="sgChip" style="margin-top:10px;display:inline-block" data-reset="1">Azzera filtri</button></div>`;
      const rb = collEl.querySelector("[data-reset]");
      if (rb) rb.onclick = () => resetAllFilters(body, r);
      return;
    }

    collEl.innerHTML = filtered.map((c) => cardHtml(c.id, { own: r.own.includes(c.id), sel: r.team.includes(c.id) })).join("");
    collEl.querySelectorAll(".sgCard:not(.lock)").forEach((el) => {
      el.onclick = (e) => {
        if (e.target.closest(".sgLoreBtn")) return;
        toggle(el.dataset.c);
      };
    });
    collEl.querySelectorAll(".sgLoreBtn").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        openCardLore(btn.dataset.lore, () => open());
      };
    });
  }

  function resetAllFilters(body, r) {
    COLL_FILT.q = "";
    COLL_FILT.own = "all";
    COLL_FILT.rar = "all";
    COLL_FILT.role = "all";
    const inp = body.querySelector(".sgSearchInp");
    if (inp) inp.value = "";
    renderColl(body, r);
  }

  function modSelectorHtml(modKey, team) {
    const cur = modKey || "rombo";
    const M_MOD = MODULI[cur] || MODULI.rombo;
    const sin = modSintonia(cur, team);
    return `<div class="sgModBox">
      <div class="sgModHd">
        <span class="sgModTitle">📋 Modulo Tattico:</span>
        <div class="sgModChips">
          ${Object.values(MODULI).map((m) => `<button type="button" class="sgModChip${m.id === cur ? " active" : ""}" data-mod="${m.id}">${m.icon} ${esc(m.name)}</button>`).join("")}
        </div>
      </div>
      <div class="sgModDesc">
        <div class="sgModTxt"><b>${esc(M_MOD.short)}</b>: ${esc(M_MOD.desc)}</div>
        <div class="sgModStatusRow">
          <span class="sgModSin ${sin ? "ok" : "warn"}">
            ${sin ? `✨ <b>Sintonia Attiva!</b> (+2 Intesa · bonus operativi)` : `ℹ️ <b>Sintonia parziale:</b> serve ${esc(M_MOD.hint)}`}
          </span>
          <button type="button" class="sgModDetailBtn" data-mod-detail="${cur}">🔍 Dettagli effetti per modalità</button>
        </div>
      </div>
    </div>`;
  }

  function openModDetail(activeKey, back) {
    const r = load();
    let curKey = activeKey || r.modulo || "rombo";
    const body = shell("📋 Dettaglio Effetti per Modalità");
    function renderDetail() {
      const M = MODULI[curKey] || MODULI.rombo;
      const sin = modSintonia(curKey, r.team);
      const isCur = r.modulo === curKey;
      let h = `<p class="sum">Ogni modulo tattico incide concretamente sulle prestazioni della tua squadra attraverso tutte le modalità di gioco. Schierando i ruoli previsti attivi la <b>Sintonia Modulo</b> (+2 Intesa e massima efficacia dei bonus).</p>`;
      h += `<div class="sgModDetailTabs">
        ${Object.values(MODULI).map((m) => `<button type="button" class="sgModTabBtn${m.id === curKey ? " active" : ""}" data-tab="${m.id}">${m.icon} ${esc(m.name)}</button>`).join("")}
      </div>`;
      h += `<div class="sgModDetailCard">
        <div class="sgModDetailHead">
          <div class="sgModDetailTitle">
            <span class="ic">${M.icon}</span>
            <div>
              <h3>${esc(M.name)} <small>${esc(M.short)}</small></h3>
              <p>${esc(M.desc)}</p>
            </div>
          </div>
          <div class="sgModDetailAction">
            ${isCur ? `<span class="sgModActiveBadge">✓ Attualmente in uso</span>` : `<button type="button" class="sgModSetBtn" data-set-mod="${M.id}">Adotta questo modulo</button>`}
          </div>
        </div>
        <div class="sgModSinBox ${sin ? "ok" : "warn"}">
          <div class="sgModSinHd">${sin ? "✨ Sintonia Modulo Attiva sulla tua squadra" : "⚠️ Sintonia parziale sulla tua squadra"}</div>
          <div class="sgModSinBody">${sin ? `Requisiti soddisfatti! La tua formazione ottiene +2 Intesa e il pieno potenziamento in ogni partita.` : `Requisiti per la sintonia: schiera <b>${esc(M.hint)}</b> per sbloccare tutti i bonus al 100%.`}</div>
        </div>
        <div class="sgModModesGrid">
          <div class="sgModModeCol arena">
            <div class="sgModModeTitle">⚔️ Arena dei Sogni & Torre dei Duelli</div>
            <div class="sgModModeText">${esc(M.effects.arena)}</div>
          </div>
          <div class="sgModModeCol torneo">
            <div class="sgModModeTitle">🏆 Torneo dei Sogni (8 Sfide / Motori)</div>
            <div class="sgModModeText">${esc(M.effects.torneo)}</div>
          </div>
          <div class="sgModModeCol stagione">
            <div class="sgModModeTitle">📅 Stagione dei Sogni (Campionato)</div>
            <div class="sgModModeText">${esc(M.effects.stagione)}</div>
          </div>
          <div class="sgModModeCol arcade">
            <div class="sgModModeTitle">🎮 Minigiochi Cabinato & Giochi Eroi</div>
            <div class="sgModModeText">${esc(M.effects.arcade)}</div>
          </div>
        </div>
      </div>`;
      h += `<div class="big"><button type="button" data-close="1">◂ Torna indietro<small>${back ? "alla schermata precedente" : "alla Squadra dei Sogni"}</small></button></div>`;
      body.innerHTML = h;
      body.querySelectorAll(".sgModTabBtn").forEach((btn) => {
        btn.onclick = () => {
          curKey = btn.dataset.tab;
          renderDetail();
        };
      });
      const setBtn = body.querySelector("[data-set-mod]");
      if (setBtn) {
        setBtn.onclick = () => {
          const r2 = load();
          r2.modulo = curKey;
          save(r2);
          renderDetail();
        };
      }
      body.querySelector("[data-close]").onclick = () => {
        if (typeof back === "function") back();
        else open();
      };
    }
    renderDetail();
  }

  function bindModChips(body) {
    body.querySelectorAll(".sgModChip").forEach((chip) => {
      chip.onclick = () => {
        const mId = chip.dataset.mod;
        if (mId && MODULI[mId]) {
          const r = load();
          r.modulo = mId;
          save(r);
          refreshTeam(body, r);
        }
      };
    });
    body.querySelectorAll(".sgModDetailBtn").forEach((btn) => {
      btn.onclick = () => {
        const cur = btn.dataset.modDetail || (load().modulo) || "rombo";
        openModDetail(cur, () => open());
      };
    });
  }

  function refreshTeam(body, r) {
    const I = intesa(r.team, r.modulo);
    const secT = body.querySelector(".sec-team");
    if (secT) secT.innerHTML = `La tua squadra · forza <b>${forza(r.team)}</b> · intesa ${intesaBadge(I.n)}${I.why.length ? ` <span class="why">(${I.why.map(esc).join(", ")})</span>` : ""}`;
    const teamEl = body.querySelector(".team");
    if (teamEl) {
      teamEl.innerHTML = [0, 1, 2, 3, 4].map((k) => (r.team[k] ? cardHtml(r.team[k]) : `<div class="sgCard empty" data-slot="${k}"><span>+</span></div>`)).join("");
      teamEl.querySelectorAll(".sgCard[data-c]").forEach((el) => {
        el.onclick = (e) => {
          if (e.target.closest(".sgLoreBtn")) return;
          toggle(el.dataset.c);
        };
      });
      teamEl.querySelectorAll(".sgLoreBtn").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          openCardLore(btn.dataset.lore, () => open());
        };
      });
    }
    const modWrap = body.querySelector(".sgModWrap");
    if (modWrap) {
      modWrap.innerHTML = modSelectorHtml(r.modulo, r.team);
      bindModChips(body);
    }
    const statEl = body.querySelector(".team-stats");
    if (statEl) statEl.innerHTML = r.team.length ? statLine(r.team, r.modulo) : "";
    const comboEl = body.querySelector(".sgComboContainer");
    if (comboEl) {
      const activeCombo = getTeamCombo(r.team);
      comboEl.innerHTML = activeCombo
        ? `<div class="sgComboBanner"><div class="sgComboIcon">⚡</div><div class="sgComboInfo"><b>Attacco Combinato: «${esc(activeCombo.title)}»</b><span>Doppio colpo pronto nell'Arena dei Sogni e nel Torneo con <em>${esc(name(activeCombo.id1))}</em> &amp; <em>${esc(name(activeCombo.id2))}</em>.</span></div></div>`
        : `<div class="sgComboBanner none"><div class="sgComboIcon">💡</div><div class="sgComboInfo"><b>Attacco Combinato di Coppia</b><span>Schiera 2 giocatori con un legame speciale per attivare il Doppio Colpo d'Assalto.</span></div></div>`;
    }
    const linksEl = body.querySelector(".links");
    if (linksEl) {
      linksEl.innerHTML = LINKS.map(([a, b, t]) => `<span class="${r.own.includes(a) && r.own.includes(b) ? "ok" : ""}"><b>${esc(t)}</b> ${r.own.includes(a) ? esc(name(a)) : "???"} + ${r.own.includes(b) ? esc(name(b)) : "???"}</span>`).join("");
    }
    body.querySelectorAll(".coll .sgCard[data-c]").forEach((el) => {
      el.classList.toggle("sel", r.team.includes(el.dataset.c));
    });
  }

  function getTeamCombo(team) {
    const ids = (team || []).filter(Boolean);
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const id1 = ids[i], id2 = ids[j];
        const match = LINKS.find(([x, y]) => (x === id1 && y === id2) || (x === id2 && y === id1));
        if (match) {
          return { id1, id2, title: match[2] };
        }
      }
    }
    return null;
  }

  function open(back) {
    if (back) BACK = back; const { r, nw } = sync(); const body = shell("🃏 La Squadra dei Sogni");
    const I = intesa(r.team, r.modulo), coins = safe(() => window.__borgoApi.coins(), 0);
    const activeCombo = getTeamCombo(r.team);
    const comboHtml = activeCombo
      ? `<div class="sgComboBanner"><div class="sgComboIcon">⚡</div><div class="sgComboInfo"><b>Attacco Combinato: «${esc(activeCombo.title)}»</b><span>Doppio colpo pronto nell'Arena dei Sogni e nel Torneo con <em>${esc(name(activeCombo.id1))}</em> &amp; <em>${esc(name(activeCombo.id2))}</em>.</span></div></div>`
      : `<div class="sgComboBanner none"><div class="sgComboIcon">💡</div><div class="sgComboInfo"><b>Attacco Combinato di Coppia</b><span>Schiera 2 giocatori con un legame speciale per attivare il Doppio Colpo d'Assalto.</span></div></div>`;
    let h = `<p class="sum">Le carte dei personaggi di tutte le saghe. Si sbloccano giocando, o con le bustine. Carte: <b>${r.own.length}/${CARDS.length}</b> · monete: <b>${coins}</b>${nw.length ? ` · <b class="new">nuove: ${nw.length}</b>` : ""}</p>`;
    h += `<div class="sec sec-team">La tua squadra · forza <b>${forza(r.team)}</b> · intesa ${intesaBadge(I.n)}${I.why.length ? ` <span class="why">(${I.why.map(esc).join(", ")})</span>` : ""}</div><div class="team">${[0, 1, 2, 3, 4].map((k) => (r.team[k] ? cardHtml(r.team[k]) : `<div class="sgCard empty" data-slot="${k}"><span>+</span></div>`)).join("")}</div><div class="sgModWrap">${modSelectorHtml(r.modulo, r.team)}</div><div class="team-stats">${r.team.length ? statLine(r.team, r.modulo) : ""}</div><div class="sgComboContainer">${comboHtml}</div>`;
    h += `<div class="big"><button type="button" data-go="tour">🏆 Torneo dei Sogni<small>${r.won.length}/8 sfide vinte · ogni sfida in un motore diverso</small></button><button type="button" data-go="pack" ${coins < PACK ? "disabled" : ""}>🎴 Bustina<small>${PACK} monete · una carta a sorpresa</small></button><button type="button" data-go="season">📅 Stagione dei Sogni<small>${r.season ? `giornata ${Math.min(7, r.season.day + 1)}/7` : "campionato a 8 squadre"}${r.titles ? ` · scudetti ${r.titles}` : ""}</small></button>${window.__arena ? `<button type="button" data-go="arena">⚔️ Arena dei Sogni<small>Battaglie a turni · Torre dei Duelli</small></button>` : ""}<button type="button" data-go="draft">🎲 Draft<small>${r.draft ? (r.draft.picks.length < 5 ? `scelta ${r.draft.picks.length + 1}/5` : "coppa in corso") : "scegli 1 carta su 3 e gioca la coppa"}${r.cups ? ` · coppe ${r.cups}` : ""}</small></button></div><p class="sum">Le carte crescono giocando: ⭐ a 3 punti esperienza, ⭐⭐ a 8, ⭐⭐⭐ a 15 (+2 a ogni statistica per stella; a tre stelle la carta dice la sua frase).</p>`;
    h += `<div class="sec">Collezione · tocca una carta per metterla in squadra o toglierla</div>`;
    h += `<div class="sgCollControls">
      <div class="sgSearchBox">
        <span class="sgSearchIcon">🔍</span>
        <input type="search" class="sgSearchInp" placeholder="Cerca per nome, saga o ruolo..." value="${esc(COLL_FILT.q)}" aria-label="Cerca carte">
        <button type="button" class="sgClearBtn"${COLL_FILT.q ? "" : ' style="display:none"'} title="Cancella ricerca">✕</button>
      </div>
      <div class="sgFilterGroups">
        <div class="sgFilterRow" data-filt-group="own">
          <span class="sgFilterLabel">Stato:</span>
          <button type="button" class="sgChip${COLL_FILT.own === "all" ? " active" : ""}" data-val="all">Tutte (${CARDS.length})</button>
          <button type="button" class="sgChip${COLL_FILT.own === "own" ? " active" : ""}" data-val="own">Possedute (${r.own.length})</button>
          <button type="button" class="sgChip${COLL_FILT.own === "lock" ? " active" : ""}" data-val="lock">Da sbloccare (${CARDS.length - r.own.length})</button>
        </div>
        <div class="sgFilterRow" data-filt-group="role">
          <span class="sgFilterLabel">Ruolo:</span>
          <button type="button" class="sgChip${COLL_FILT.role === "all" ? " active" : ""}" data-val="all">Tutti</button>
          <button type="button" class="sgChip${COLL_FILT.role === "A" ? " active" : ""}" data-val="A">⚔️ Attacco (A)</button>
          <button type="button" class="sgChip${COLL_FILT.role === "C" ? " active" : ""}" data-val="C">🎯 Centrocampo (C)</button>
          <button type="button" class="sgChip${COLL_FILT.role === "D" ? " active" : ""}" data-val="D">🛡️ Difesa (D)</button>
          <button type="button" class="sgChip${COLL_FILT.role === "P" ? " active" : ""}" data-val="P">🧤 Portieri (P)</button>
          <button type="button" class="sgChip${COLL_FILT.role === "B" ? " active" : ""}" data-val="B">⭐ Battitori (B)</button>
        </div>
        <div class="sgFilterRow" data-filt-group="rar">
          <span class="sgFilterLabel">Rarità:</span>
          <button type="button" class="sgChip${COLL_FILT.rar === "all" ? " active" : ""}" data-val="all">Tutte</button>
          <button type="button" class="sgChip chip-c${COLL_FILT.rar === "c" ? " active" : ""}" data-val="c">Comuni</button>
          <button type="button" class="sgChip chip-r${COLL_FILT.rar === "r" ? " active" : ""}" data-val="r">Rare</button>
          <button type="button" class="sgChip chip-e${COLL_FILT.rar === "e" ? " active" : ""}" data-val="e">Epiche</button>
          <button type="button" class="sgChip chip-l${COLL_FILT.rar === "l" ? " active" : ""}" data-val="l">Leggendarie</button>
        </div>
      </div>
      <div class="sgCollInfo">
        <span class="sgCount"></span>
        <button type="button" class="sgCollReset"${isFiltered() ? "" : ' style="display:none"'}>Azzera filtri</button>
      </div>
    </div>`;
    h += `<div class="coll"></div>`;
    h += `<div class="sec">Legami tra saghe (+3 di intesa)</div><div class="links">${LINKS.map(([a, b, t]) => `<span class="${r.own.includes(a) && r.own.includes(b) ? "ok" : ""}"><b>${esc(t)}</b> ${r.own.includes(a) ? esc(name(a)) : "???"} + ${r.own.includes(b) ? esc(name(b)) : "???"}</span>`).join("")}</div>`;
    body.innerHTML = h;

    const inp = body.querySelector(".sgSearchInp");
    const clr = body.querySelector(".sgClearBtn");
    if (inp) {
      inp.oninput = () => {
        COLL_FILT.q = inp.value;
        renderColl(body, load());
      };
    }
    if (clr) {
      clr.onclick = () => {
        COLL_FILT.q = "";
        if (inp) inp.value = "";
        renderColl(body, load());
        if (inp) inp.focus();
      };
    }
    body.querySelectorAll(".sgFilterRow .sgChip").forEach((chip) => {
      chip.onclick = () => {
        const group = chip.parentElement.dataset.filtGroup;
        const val = chip.dataset.val;
        if (!group) return;
        COLL_FILT[group] = val;
        renderColl(body, load());
      };
    });
    const rst = body.querySelector(".sgCollReset");
    if (rst) {
      rst.onclick = () => resetAllFilters(body, load());
    }

    bindModChips(body);
    renderColl(body, r);
    body.querySelectorAll(".team .sgCard[data-c]").forEach((el) => {
      el.onclick = (e) => {
        if (e.target.closest(".sgLoreBtn")) return;
        toggle(el.dataset.c);
      };
    });
    body.querySelectorAll(".team .sgLoreBtn").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        openCardLore(btn.dataset.lore, () => open());
      };
    });
    body.querySelector('[data-go="tour"]').onclick = torneo;
    body.querySelector('[data-go="pack"]').onclick = pack;
    body.querySelector('[data-go="season"]').onclick = stagione;
    body.querySelector('[data-go="draft"]').onclick = draft;
    const arb = body.querySelector('[data-go="arena"]'); if (arb) arb.onclick = () => { closeAll(); window.__arena.open(() => open()); };
  }
  function toggle(id) {
    const r = load();
    if (r.team.includes(id)) r.team = r.team.filter((x) => x !== id);
    else if (r.team.length < 5 && r.own.includes(id)) r.team.push(id);
    save(r);
    if (OV && OV.querySelector(".team")) refreshTeam(OV, r);
    else open();
  }
  function pack() {
    const coins = safe(() => window.__borgoApi.coins(), 0); if (coins < PACK) return;
    const r = load(), started = Object.keys(SAGHE).filter((k) => progress(k).ch >= 1), pool = CARDS.filter((c) => drop(c) && !r.own.includes(c.id) && (started.includes(c.saga) || c.rar === "c"));
    if (!pool.length) return dupPack(r);
    safe(() => window.addCoins(-PACK), 0);
    const w = pool.flatMap((c) => Array(5 - RAR[c.rar][2]).fill(c)), got = w[Math.floor(Math.random() * w.length)];
    r.own.push(got.id); r.packs++; save(r); reveal(got.id, "Dalla bustina", open);
  }
  // nessuna carta nuova disponibile (le altre si sbloccano a capitoli): la bustina dà un doppione = +3 punti esperienza a una carta con stelle da crescere
  function dupPack(r) {
    const cand = r.own.filter((id) => BY[id] && (r.xp[id] | 0) < 15);
    if (!cand.length) { const b = shell("🎴 Bustina"); b.innerHTML = `<p class="sum">Nessuna carta nuova da trovare ora: le altre si sbloccano giocando i capitoli delle saghe. E tutte le tue carte sono già al massimo. Monete non spese.</p><div class="big"><button type="button" data-ok="1">◂ La squadra</button></div>`; b.querySelector("[data-ok]").onclick = () => open(); return; }
    safe(() => window.addCoins(-PACK), 0);
    const id = cand[Math.floor(Math.random() * cand.length)], s0 = starsOf(id);
    r.xp[id] = Math.min(15, (r.xp[id] | 0) + 3); r.packs++; save(r);
    const b = shell("🎴 Doppione!");
    b.innerHTML = `<p class="sum">Nessuna carta nuova disponibile ora (le altre si sbloccano a capitoli). Doppione di <b>${esc(name(id))}</b>: <b>+3 punti esperienza</b>${starsOf(id) > s0 ? ` · sale a ${"⭐".repeat(starsOf(id))}!` : ""}</p><div class="reveal">${cardHtml(id)}</div><div class="big"><button type="button" data-ok="1">Nella collezione ▸</button></div>`;
    b.querySelector("[data-ok]").onclick = () => open();
  }
  function packSfx(kind, rar) {
    try {
      const A = new (window.AudioContext || window.webkitAudioContext)();
      if (kind === "crinkle") {
        const o = A.createOscillator(), g = A.createGain();
        o.type = "triangle"; o.frequency.value = 320 + Math.random() * 260;
        g.gain.value = 0.018; g.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + 0.06);
        o.connect(g); g.connect(A.destination); o.start(); o.stop(A.currentTime + 0.065);
      } else {
        const notes = rar === "l" ? [523, 659, 784, 1046, 1318] : rar === "e" ? [440, 554, 659, 880] : rar === "r" ? [494, 622, 740, 988] : [523, 659, 784];
        notes.forEach((f, i) => {
          const o = A.createOscillator(), g = A.createGain();
          o.type = rar === "l" ? "triangle" : "sine";
          o.frequency.value = f; g.gain.value = 0.045;
          g.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + 0.24 + i * 0.09);
          o.connect(g); g.connect(A.destination); o.start(A.currentTime + i * 0.09); o.stop(A.currentTime + 0.34 + i * 0.09);
        });
      }
    } catch (e) {}
  }
  function reveal(id, title, then) {
    const body = shell("🎴 " + esc(title));
    const c = BY[id], R = RAR[c.rar], S_SAG = SG(c.saga);
    body.innerHTML = `<div class="sgPackStage r-${c.rar}" style="--rc:${R[1]};--sc:${S_SAG[2]};--tear:0">
      <div class="sgPackAura"></div>
      <div class="sgPackCardSlot">
        <div class="reveal">${cardHtml(id)}</div>
        <p class="sum sgPackMeta"><b>${esc(name(id))}</b> · <span style="color:${R[1]};font-weight:800">${R[0]}</span> · ${esc(S_SAG[1])}</p>
      </div>
      <div class="sgFoilWrap" role="button" tabindex="0" aria-label="Strappa la bustina">
        <div class="sgFoilTop">
          <span class="sgCutIcon">✂️</span>
          <span class="sgTearHint">Striscia col dito per strappare</span>
          <div class="sgTearProgress"><i></i></div>
        </div>
        <div class="sgFoilSeam"></div>
        <div class="sgFoilBody">
          <div class="sgFoilShine"></div>
          <div class="sgFoilCrest">🃏</div>
          <div class="sgFoilTitle">SQUADRA DEI SOGNI</div>
          <div class="sgFoilSub">${esc(title)}</div>
          <div class="sgFoilRarHint" style="color:${R[1]}">✦ Bagliore ${R[0]} ✦</div>
        </div>
        <div class="sgSparks"></div>
      </div>
    </div>
    <div class="big sgPackBtns">
      <button type="button" data-tear="1">✂️ Strappa bustina<small>Rivela la carta trovata</small></button>
      <button type="button" data-ok="1">Nella collezione ▸<small>Salta e vai alle carte</small></button>
    </div>`;

    const stage = body.querySelector(".sgPackStage");
    const foil = body.querySelector(".sgFoilWrap");
    const sparks = body.querySelector(".sgSparks");
    const okBtn = body.querySelector("[data-ok]");
    const tearBtn = body.querySelector("[data-tear]");
    let prog = 0, torn = false, down = false, startX = 0, lastSound = 0;

    const addSpark = (px, py) => {
      if (!sparks) return;
      const sp = document.createElement("i");
      sp.style.left = Math.max(6, Math.min(94, px)) + "%";
      sp.style.top = (py || 18) + "%";
      sp.style.setProperty("--dx", ((Math.random() - 0.5) * 70).toFixed(0) + "px");
      sp.style.setProperty("--dy", (-18 - Math.random() * 45).toFixed(0) + "px");
      sparks.appendChild(sp);
      setTimeout(() => sp.remove(), 520);
    };

    const setProg = (v) => {
      if (torn) return;
      prog = Math.max(0, Math.min(1, v));
      stage.style.setProperty("--tear", prog.toFixed(3));
      const now = Date.now();
      if (now - lastSound > 70 && prog > 0.04) {
        lastSound = now;
        packSfx("crinkle", c.rar);
        safe(() => window.hapticTrigger && window.hapticTrigger(8), 0);
      }
      if (prog >= 0.72) finishTear();
    };

    const finishTear = () => {
      if (torn) return;
      torn = true;
      stage.style.setProperty("--tear", "1");
      stage.classList.add("torn");
      packSfx("fanfare", c.rar);
      safe(() => window.hapticTrigger && window.hapticTrigger(c.rar === "l" ? [25, 40, 45] : 22), 0);
      for (let k = 0; k < 10; k++) addSpark(10 + k * 8, 18);
      if (tearBtn) {
        tearBtn.innerHTML = `📖 Dettagli &amp; Lore<small>Gira la carta in 3D</small>`;
        tearBtn.onclick = () => openCardLore(id, () => then());
      }
      if (okBtn) okBtn.innerHTML = `Nella collezione ▸<small>La trovi tra le carte</small>`;
      const loreB = stage.querySelector(".sgLoreBtn");
      if (loreB) loreB.onclick = (ev) => { ev.stopPropagation(); openCardLore(id, () => then()); };
    };

    if (foil) {
      foil.addEventListener("pointerdown", (e) => {
        if (torn) return;
        down = true;
        startX = e.clientX;
        safe(() => foil.setPointerCapture && foil.setPointerCapture(e.pointerId), 0);
        const rect = foil.getBoundingClientRect();
        addSpark(((e.clientX - rect.left) / Math.max(1, rect.width)) * 100, 18);
      });
      foil.addEventListener("pointermove", (e) => {
        if (!down || torn) return;
        const rect = foil.getBoundingClientRect();
        const w = Math.max(120, rect.width * 0.72);
        const delta = Math.abs(e.clientX - startX);
        addSpark(((e.clientX - rect.left) / Math.max(1, rect.width)) * 100, 18);
        setProg(Math.max(prog, delta / w));
      });
      const up = () => {
        if (!down || torn) return;
        down = false;
        if (prog >= 0.42) finishTear();
        else if (prog < 0.08) finishTear();
        else setProg(0);
      };
      foil.addEventListener("pointerup", up);
      foil.addEventListener("pointercancel", up);
      foil.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); finishTear(); } });
    }
    if (tearBtn) tearBtn.onclick = () => finishTear();
    if (okBtn) okBtn.onclick = then;
  }
  // ---------------------------------------------------------------- il Torneo dei Sogni
  function torneo() {
    const r = load(), body = shell("🏆 Torneo dei Sogni"), I = intesa(r.team, r.modulo), f = forza(r.team);
    let h = `<p class="sum">Otto sfide, otto motori. La tua squadra (forza ${f}, intesa ${intesaBadge(I.n)}) dà vantaggi diversi in ogni motore. ${r.team.length < 5 ? "<b>Servono cinque carte in squadra.</b>" : ""}</p>${r.team.length ? statLine(r.team, r.modulo) : ""}`;
    h += SFIDE.map((s, i) => { const M = safe(() => window.__salone.machine(s.m), null), won = r.won.includes(i); return `<div class="sf${won ? " won" : ""}" data-i="${i}"><div class="e">${M ? M.e : "⚽"}</div><div><b>${i + 1}. ${esc(M ? M.t : s.m)}</b><span>${esc(s.opp ? s.opp.name : "I Sogni del Cristallo")} · ${esc(bonusTxt(s.m, r.team))}</span></div><div class="n">${won ? "✓" : "▶"}</div></div>`; }).join("");
    if (r.won.length >= 8) h += `<div class="big"><button type="button" data-hero="1">${r.hero ? "✓ Il Campione dei Sogni è tuo" : "🌟 Ritira la carta del Campione dei Sogni"}<small>La carta leggendaria del tuo Campione · e la Maglia dei Sogni</small></button></div>`;
    h += `<div class="big"><button type="button" data-back="1">◂ La squadra<small>Carte e collezione</small></button></div>`;
    body.innerHTML = h;
    body.querySelectorAll("[data-i]").forEach((el) => (el.onclick = () => { if (load().team.length >= 5) play(+el.dataset.i); }));
    body.querySelector("[data-back]").onclick = () => open();
    const hb = body.querySelector("[data-hero]"); if (hb) hb.onclick = heroCard;
  }
  const count = (team, saga) => team.filter((id) => BY[id] && BY[id].saga === saga).length;
  function bonusTxt(m, team) {
    const r = load(), modKey = r.modulo || "rombo", M_MOD = MODULI[modKey] || MODULI.rombo, sin = modSintonia(modKey, team);
    const I = intesa(team, modKey).n, T = tiers(team, modKey), A = T.at >= 2 ? 1 : 0;
    const pre = `[${M_MOD.name}${sin ? " ✨" : ""}] `;
    const txt = {
      vignette: `azioni +${Math.floor(I / 4) + A + (sin && (modKey === "tridente" || modKey === "rombo") ? 1 : 0)} (ATT), parate +${T.df * 5}% (DIF), Spirito +${T.te * 10}% (TEC)`,
      bottoni: `tiri +${(I >= 5 ? 1 : 0) + A + (sin && modKey === "tridente" ? 1 : 0)} (ATT), avversari meno precisi (DIF), potere +${Math.round(T.te * 15)}% (TEC)${count(team, "mantello") ? ", superpoteri a turno" : ""}`,
      luci: `azioni +${A} (ATT), turni +${T.df + (sin && (modKey === "catenaccio" || modKey === "fortezza") ? 1 : 0)} (DIF), lanterne +${(I >= 7 ? 1 : 0) + (T.te >= 2 ? 1 : 0) + (sin && modKey === "rombo" ? 1 : 0)} (TEC)`,
      nastro: `azioni +${A + (sin && modKey === "tridente" ? 1 : 0)} (ATT), riavvolgimenti +${(I >= 7 ? 1 : 0) + Math.floor((T.te + T.df) / 3) + (sin && modKey === "rombo" ? 1 : 0)} (TEC+DIF)`,
      concilio: `turni +${A + (sin && modKey === "tridente" ? 1 : 0)} (ATT), credibilità ${Math.min(10, 5 + Math.floor(I / 3.5) + Math.ceil(T.df / 2) + (sin && (modKey === "catenaccio" || modKey === "fortezza") ? 1 : 0))} (DIF), corvi ${1 + count(team, "trono") + (T.te >= 2 ? 1 : 0)} (TEC)`,
      lavagna: `modulo ${M_MOD.name}${sin ? " in piena sintonia (+3 OVR)" : ""}, ogni carta pesa col suo ruolo: ATT, DIF, TEC`,
      duello: `grinta ${100 + I * 5 + T.at * 4 + (sin && modKey === "tridente" ? 15 : sin && modKey === "quadrato" ? 10 : 0)} (ATT), contrasti +${T.df * 1.5 + (sin && modKey === "catenaccio" ? 1 : 0)} (DIF), passaggi +${T.te * 1.5} (TEC)`,
      gadget: `tiri +${T.at * 4}% (ATT), difesa +${T.df * 6}% (DIF), cintura ${Math.min(6, 4 + (I >= 8 ? 1 : 0) + (T.te >= 2 ? 1 : 0) + (sin && modKey === "rombo" ? 1 : 0))} gadget (TEC)`,
      volo: `tiro +${T.at * 5}% (ATT), difesa +${T.df * 6}% (DIF), energia ${100 + I * 4 + T.te * 5 + (sin && modKey === "quadrato" ? 15 : 0)} (TEC)`,
      combo: "quattro poteri dalle tue carte, tiri (ATT), contrasti e difesa (DIF), pressing (TEC)",
      giroegol: `turbo ${2 + (T.te >= 2 ? 1 : 0)} (TEC), mirino fermo ${T.df >= 2 ? 1 : 0} (DIF), tiri più forti (ATT)`,
      pallatempo: `compagno dalle tue carte, comandi TEMPO ${2 + (T.te >= 2 ? 1 : 0) + (sin && modKey === "rombo" ? 1 : 0)} (TEC), FISCHIO ${T.df >= 2 ? 1 : 0} (DIF), tiri più forti (ATT)`,
      consegna: "il compagno di volo dalle tue carte, tiri (ATT), recuperi (DIF), tempo +" + (T.te * 4 + (sin && modKey === "rombo" ? 4 : 0)) + "s (TEC)",
      anello: `mira +${T.at * 5}% (ATT), rivali meno precisi -${T.df * 5}% (DIF), corsa +${T.te * 3}% (TEC)`,
      corrente: `velocità pontili +${T.at * 5}% (ATT), stabilità risacca +${T.df * 5}% (DIF), precisione rinvio +${T.te * 10}% (TEC)`,
      rebound: `tiri +${T.at * 6}% (ATT), portiere +${T.df * 7}% (DIF), corsa +${T.te * 3}% (TEC)`,
      marea: `pedane ${3 + (T.te >= 2 ? 1 : 0)} (TEC), portiere +${T.df * 2}% (DIF), tiri più precisi (ATT)`,
      ipogeo: `cuori ${4 + (T.df >= 2 ? 1 : 0) + (sin && modKey === "catenaccio" ? 1 : 0)} (DIF), tiro +${T.at * 3}% (ATT), tempo +${T.te * 3}s (TEC)`,
      ciak: `ciak di riserva ${2 + (I >= 7 ? 1 : 0) + (T.te >= 2 ? 1 : 0) + (sin && modKey === "rombo" ? 1 : 0)} (TEC), idee riuscite con ATT/DIF/TEC`,
      iso: `terreno ${["saline", "vetro", "ruggine"][I % 3]}, tiro +${T.at} (ATT), contrasto +${T.df} (DIF), passaggio +${T.te} (TEC)`,
      zonarossa: `tiro +${T.at * 5}% (ATT), fiato nelle fasce rosse +${T.df * 8}% (DIF), mira assistita +${T.te * 8}% (TEC)`,
      rottami: `anteprima del tiro più lunga +${T.at * 5} (ATT), scudo più alto +${T.df * 3 + (sin && modKey === "catenaccio" ? 2 : 0)} (DIF), vento di sabbia -${T.te * 10}% (TEC)`,
      roulette: `fiches scudo +${T.df + (sin && modKey === "catenaccio" ? 1 : 0)} (DIF), precisione carambola +${T.at * 5}% (ATT), gettoni turbo +${(I >= 7 ? 1 : 0) + (T.te >= 2 ? 1 : 0)} (TEC)`,
      atb: `statistiche +${Math.floor(I / 2.5) + (sin ? 2 : 0)}, tiro +${T.at} (ATT), difesa +${T.df} (DIF), passaggio +${T.te} (TEC)`,
    }[m] || "";
    return pre + txt;
  }
  function extraFor(m, base, team, I, f, h) {
    const r = load(), modKey = r.modulo || "rombo", M_MOD = MODULI[modKey] || MODULI.rombo, sin = modSintonia(modKey, team);
    const T = tiers(team, modKey);
    const names = team.map((id) => ({ name: String(name(id)).split(/[ ,]/)[0], skin: (window.__borgoApi.CAST[id] || {}).skin, hair: (window.__borgoApi.CAST[id] || {}).hair }));
    return {
      vignette: { actions: (base.actions || 8) + Math.floor(I / 4) + (T.at >= 2 ? 1 : 0) + (sin && (modKey === "tridente" || modKey === "rombo") ? 1 : 0) },
      bottoni: { shots: (base.shots || 6) + (I >= 5 ? 1 : 0) + (T.at >= 2 ? 1 : 0) + (sin && modKey === "tridente" ? 1 : 0), powers: count(team, "mantello") ? ["fulmine", "gigante", "calamita", "gelo", "doppio"] : undefined, mates: names.slice(0, 3) },
      luci: { lanterns: (base.lanterns || 3) + (I >= 7 ? 1 : 0) + (T.te >= 2 ? 1 : 0) + (sin && modKey === "rombo" ? 1 : 0), actions: (base.actions || 6) + (T.at >= 2 ? 1 : 0), turns: 8 + T.df + (sin && (modKey === "catenaccio" || modKey === "fortezza") ? 1 : 0), mates: names.slice(0, 2) },
      nastro: { rewinds: (base.rewinds || 2) + (I >= 7 ? 1 : 0) + Math.floor((T.te + T.df) / 3) + (sin && modKey === "rombo" ? 1 : 0), actions: (base.actions || 6) + (T.at >= 2 ? 1 : 0) + (sin && modKey === "tridente" ? 1 : 0), mates: names.slice(0, 2) },
      concilio: { cred: Math.min(10, 5 + Math.floor(I / 3.5) + Math.ceil(T.df / 2) + (sin && (modKey === "catenaccio" || modKey === "fortezza") ? 1 : 0)), ravens: 1 + count(team, "trono") + (T.te >= 2 ? 1 : 0), turns: (base.turns || 8) + (T.at >= 2 ? 1 : 0) + (sin && modKey === "tridente" ? 1 : 0), foresee: T.te >= 3, us: "La Squadra dei Sogni" },
      lavagna: { us: "La Squadra dei Sogni", squad: team.map((id) => ({ name: name(id), role: BY[id].role, ovr: Math.round(roleOvr(BY[id]) + I / 2.5 + (sin ? 3 : 0)) })).concat([{ name: h.name || "Il Campione", role: "A", ovr: f + 2 + (sin ? 2 : 0) }, { name: "Il Portiere dei Sogni", role: "P", ovr: f + (sin && modKey === "catenaccio" ? 3 : 0) }]) },
      duello: { guts: 100 + I * 5 + T.at * 4 + (sin && modKey === "tridente" ? 15 : sin && modKey === "quadrato" ? 10 : 0), mates: names.slice(0, 3), us: "La Squadra dei Sogni" },
      iso: { mates: names.slice(0, 2), us: "La Squadra dei Sogni", terrain: ["saline", "vetro", "ruggine"][I % 3] },
      combo: { heroes: team.slice(0, 4).map((id, k) => ({ name: String(name(id)).split(/[ ,]/)[0], power: ["scatto", "ghiaccio", "vento", "fuoco"][k] })), us: "La Squadra dei Sogni" },
      giroegol: { mate: names[0], us: "La Squadra dei Sogni", turbi: (base.turbi || 0) + (T.te >= 2 ? 1 : 0), mira: (base.mira || 0) + (T.df >= 2 ? 1 : 0) },
      pallatempo: { mate: names[0], us: "La Squadra dei Sogni", tempo: (base.tempo || 2) + (T.te >= 2 ? 1 : 0) + (sin && modKey === "rombo" ? 1 : 0), fischio: (base.fischio || 0) + (T.df >= 2 ? 1 : 0) },
      consegna: { mate: names[0], us: "La Squadra dei Sogni" },
      marea: { mates: names.slice(0, 2), us: "La Squadra dei Sogni" },
      rebound: { mates: names.slice(0, 2), us: "La Squadra dei Sogni" },
      anello: { mate: names[0], us: "La Squadra dei Sogni" },
      corrente: { mates: names.slice(0, 2), us: "La Squadra dei Sogni" },
      runa: { us: "La Squadra dei Sogni" },
      ipogeo: { us: "La Squadra dei Sogni" },
      ciak: { mates: names.slice(0, 2), us: "La Squadra dei Sogni", takes: 2 + (I >= 7 ? 1 : 0) + (T.te >= 2 ? 1 : 0) + (sin && modKey === "rombo" ? 1 : 0) },
      volo: { energy: 100 + I * 4 + T.te * 5 + (sin && modKey === "quadrato" ? 15 : 0), mates: names.slice(0, 1), us: "La Squadra dei Sogni" },
      gadget: { slots: Math.min(6, 4 + (I >= 8 ? 1 : 0) + (T.te >= 2 ? 1 : 0) + (sin && modKey === "rombo" ? 1 : 0)), mates: names.slice(0, 2), us: "La Squadra dei Sogni" },
      rottami: { mate: names[0], us: "La Squadra dei Sogni" },
      zonarossa: { mate: names[0], us: "La Squadra dei Sogni" },
      roulette: { mates: names.slice(0, 2), us: "La Squadra dei Sogni" },
      atb: { heroSt: { tiro: 16 + Math.floor(I / 2.5) + T.at + (sin ? 2 : 0), pass: 14 + Math.floor(I / 2.5) + T.te + (sin ? 2 : 0), dif: 12 + Math.floor(I / 2.5) + T.df + (sin ? 2 : 0), vel: 15 + Math.floor(I / 2.5) + Math.floor(T.te / 2) + (sin ? 2 : 0) } },
    }[m] || {};
  }
  // gioca una partita dei Sogni nel motore m; opp = avversario (se manca, quello della sfida del Torneo); onRes(res) alla fine
  function launch(m, opp, title, team, hard, onRes, back) {
    const M = safe(() => window.__salone.machine(m), null), eng = M && window[M.eng]; if (!M || !eng || !eng.start) return false;
    const r = load(), modKey = r.modulo || "rombo", I = intesa(team, modKey).n, f = forza(team), h = safe(() => window.__salone.heroLook(), { name: "Campione" });
    const o0 = opp || M.boss || M.opp[0], base = M.opts(o0, h, hard);
    closeAll(); const C = window.__sagaCore; if (C && C.setCur) C.setCur(hard ? "sfida" : "normale", o0 && o0.style);
    const o = Object.assign({}, base, extraFor(m, base, team, I, f, h), { bonus: tiers(team, modKey), title, heroLook: h, winTitle: "VITTORIA DEI SOGNI!", onDone: onRes });
    if (safe(() => eng.start(o), false) === false) { if (C && C.endMatch) C.endMatch(); back(); }
    return true;
  }
  // un avversario inventato vestito per il motore m (tiene i campi propri del motore dalla sfida del Torneo)
  function dress(m, T) {
    const sf = SFIDE.find((x) => x.m === m), M = safe(() => window.__salone.machine(m), null), b = (sf && sf.opp) || (M && (M.boss || M.opp[0])) || {};
    const o = Object.assign({}, b, { name: T.name, color: T.color, style: T.style });
    if (m === "bottoni") o.players = T.pl.map((n) => ({ name: n }));
    if (m === "duello") { o.players = [{ name: T.pl[0], pow: Math.round(T.f / 5) }, { name: T.pl[1], pow: Math.round(T.f / 6) }]; o.keeper = { name: T.pl[3], pow: Math.round(T.f / 4.5) }; o.ace = { name: T.pl[0], special: "Colpo dei Sogni" }; }
    if (m === "lavagna") o.ovr = T.f;
    if (m === "concilio") o.honor = Math.min(0.7, (T.f - 50) / 40);
    if (Array.isArray(b.players) && m !== "bottoni" && m !== "duello") o.players = b.players.map((p, k) => Object.assign({}, p, { id: undefined, name: T.pl[k % 4] }));
    return o;
  }
  const engName = (m) => safe(() => window.__salone.machine(m).t, m);
  const engIcon = (m) => safe(() => window.__salone.machine(m).e, "⚽");
  function play(i) {
    const s = SFIDE[i], r = load();
    launch(s.m, s.opp, `Torneo dei Sogni ${i + 1}/8 · ${engName(s.m)}`, r.team, i >= 6, (res) => {
      const ups = gainXp(r.team, res.win), r2 = load(); let msg = res.win ? "Sfida vinta!" : "Sfida persa: si può rigiocare.";
      if (res.win && !r2.won.includes(i)) { r2.won.push(i); safe(() => window.addCoins(40), 0); const pool = CARDS.filter((c) => drop(c) && !r2.own.includes(c.id)); if (pool.length) { const got = pool[Math.floor(Math.random() * pool.length)]; r2.own.push(got.id); save(r2); return levelUps(ups, () => reveal(got.id, "Premio della sfida · +40 monete", torneo)); } }
      save(r2); levelUps(ups, () => { torneo(); const sm = OV && OV.querySelector(".sum"); if (sm) sm.insertAdjacentHTML("afterbegin", `<b>${msg}</b> `); });
    }, torneo);
  }
  // ---------------------------------------------------------------- partite simulate (le altre della giornata, o «Simula»)
  function poisson(l) { let k = 0, p = Math.exp(-l), s = p; const u = Math.random(); while (u > s && k < 8) { k++; p *= l / k; s += p; } return k; }
  const simGoals = (fa, fb) => [poisson(Math.max(0.3, Math.min(3.2, 1.35 + (fa - fb) / 14))), poisson(Math.max(0.3, Math.min(3.2, 1.35 + (fb - fa) / 14)))];
  // ---------------------------------------------------------------- la Stagione dei Sogni: 8 squadre, 7 giornate, un motore diverso a giornata
  function newSeason() {
    const ids = [-1, 0, 1, 2, 3, 4, 5, 6], sched = [];
    for (let d = 0; d < 7; d++) { const rot = [ids[0]].concat(ids.slice(1).map((_, k) => ids[1 + ((k + d) % 7)])), day = []; for (let k = 0; k < 4; k++) day.push([rot[k], rot[7 - k]]); sched.push(day); }
    const eng = ENG.slice().sort(() => Math.random() - 0.5).slice(0, 7), tab = {}; ids.forEach((t) => (tab[t] = [0, 0, 0, 0, 0, 0])); // G V N P GF GS
    return { day: 0, sched, eng, tab, last: null };
  }
  const tName = (t) => (t < 0 ? "La Squadra dei Sogni" : TEAMS[t].name);
  function record(se, a, b, ga, gb) {
    [[a, ga, gb], [b, gb, ga]].forEach(([t, x, y]) => { const R = se.tab[t]; R[0]++; R[x > y ? 1 : x === y ? 2 : 3]++; R[4] += x; R[5] += y; });
  }
  const pts = (R) => R[1] * 3 + R[2];
  const ranking = (se) => Object.keys(se.tab).map(Number).sort((x, y) => pts(se.tab[y]) - pts(se.tab[x]) || (se.tab[y][4] - se.tab[y][5]) - (se.tab[x][4] - se.tab[x][5]) || se.tab[y][4] - se.tab[x][4] || x - y);
  function stagione() {
    const r = load(); if (!r.season) { r.season = newSeason(); save(r); }
    const se = r.season, body = shell("📅 Stagione dei Sogni"), rk = ranking(se), f = forza(r.team), I = intesa(r.team, r.modulo);
    let h = `<p class="sum">Otto squadre, sette giornate, ogni giornata in un motore diverso. Vittoria 3 punti, pareggio 1. Chi vince lo scudetto prende una <b>carta rara garantita</b> e 80 monete. ${r.team.length < 5 ? "<b>Servono cinque carte in squadra.</b>" : `La tua forza: <b>${f}</b> · intesa: <b>${I.n}</b>/20 ${intesaBadge(I.n)}.`}</p>`;
    if (se.last) h += `<p class="sum last">${se.last}</p>`;
    h += `<table class="tab"><tr><th></th><th>Squadra</th><th>G</th><th>V</th><th>N</th><th>P</th><th>Gol</th><th>Pt</th></tr>${rk.map((t, k) => { const R = se.tab[t]; return `<tr class="${t < 0 ? "me" : ""}"><td>${k + 1}</td><td>${esc(tName(t))}</td><td>${R[0]}</td><td>${R[1]}</td><td>${R[2]}</td><td>${R[3]}</td><td>${R[4]}:${R[5]}</td><td><b>${pts(R)}</b></td></tr>`; }).join("")}</table>`;
    if (se.day < 7) {
      const mine = se.sched[se.day].find((p) => p.includes(-1)), opp = mine[0] < 0 ? mine[1] : mine[0], T = TEAMS[opp], m = se.eng[se.day];
      h += `<div class="sec">Giornata ${se.day + 1}/7</div><div class="sf next"><div class="e">${engIcon(m)}</div><div><b>contro ${esc(T.name)}</b><span>${esc(engName(m))} · forza ${T.f} · ${esc(bonusTxt(m, r.team))}</span></div><div class="n">▶</div></div>`;
      h += `<div class="big"><button type="button" data-play="1" ${r.team.length < 5 ? "disabled" : ""}>⚽ Gioca<small>Esperienza piena alle carte</small></button><button type="button" data-sim="1" ${r.team.length < 5 ? "disabled" : ""}>⏩ Simula<small>Risultato dalla forza · meno esperienza</small></button></div>`;
    } else {
      const first = rk[0] === -1;
      h += `<div class="sec">Stagione finita · ${first ? "🏆 Scudetto dei Sogni!" : `${rk.indexOf(-1) + 1}° posto`}</div>`;
      h += `<div class="big"><button type="button" data-new="1">📅 Nuova stagione<small>Calendario e motori nuovi</small></button><span></span></div>`;
    }
    h += `<div class="big"><button type="button" data-back="1">◂ La squadra<small>Carte e collezione</small></button><span></span></div>`;
    body.innerHTML = h;
    body.querySelector("[data-back]").onclick = () => open();
    const bp = body.querySelector("[data-play]"); if (bp) bp.onclick = () => seasonMatch(false);
    const bs = body.querySelector("[data-sim]"); if (bs) bs.onclick = () => seasonMatch(true);
    const bn = body.querySelector("[data-new]"); if (bn) bn.onclick = () => { const r2 = load(); r2.season = newSeason(); save(r2); stagione(); };
  }
  function seasonMatch(sim) {
    const r = load(), se = r.season; if (!se || se.day >= 7 || r.team.length < 5) return;
    const mine = se.sched[se.day].find((p) => p.includes(-1)), opp = mine[0] < 0 ? mine[1] : mine[0], T = TEAMS[opp], m = se.eng[se.day], team = r.team.slice();
    const close = (ga, gb, isSim) => {
      const r2 = load(), s2 = r2.season; if (!s2 || s2.day !== se.day) return stagione();
      record(s2, -1, opp, ga, gb);
      const others = s2.sched[s2.day].filter((p) => !p.includes(-1)).map(([a, b]) => { const g = simGoals(TEAMS[a].f, TEAMS[b].f); record(s2, a, b, g[0], g[1]); return `${TEAMS[a].name} ${g[0]}-${g[1]} ${TEAMS[b].name}`; });
      const mName = MODULI[r.modulo] ? MODULI[r.modulo].name : r.modulo;
      const sin = modSintonia(r.modulo, team);
      s2.last = `<b>Giornata ${s2.day + 1}: Sogni ${ga}-${gb} ${esc(T.name)}</b>${isSim ? ` (simulata · Modulo ${esc(mName)}${sin ? " ✨" : ""})` : ""}. ${others.map(esc).join(" · ")}.`;
      s2.day++; let prize = null;
      if (s2.day >= 7 && ranking(s2)[0] === -1) { r2.titles++; safe(() => window.addCoins(80), 0); const pool = CARDS.filter((c) => drop(c) && !r2.own.includes(c.id)), rare = pool.filter((c) => c.rar !== "c"); const pick = (rare.length ? rare : pool); if (pick.length) { prize = pick[Math.floor(Math.random() * pick.length)].id; r2.own.push(prize); } else safe(() => window.addCoins(100), 0); s2.last += " <b>Scudetto dei Sogni! +80 monete.</b>"; }
      r2.season = s2; save(r2);
      const ups = gainXp(team, ga > gb, isSim);
      levelUps(ups, () => (prize ? reveal(prize, "Premio dello scudetto", stagione) : stagione()));
    };
    if (sim) {
      const sin = modSintonia(r.modulo, team);
      let advOff = 0, advDef = 0;
      if (sin) {
        if (r.modulo === "tridente") advOff = 3.5;
        else if (r.modulo === "catenaccio") advDef = 3.5;
        else if (r.modulo === "fortezza") advDef = 4.2;
        else if (r.modulo === "rombo") { advOff = 2.0; advDef = 2.0; }
        else if (r.modulo === "quadrato") { advOff = 2.0; advDef = 2.0; }
      } else {
        advOff = 0.8; advDef = 0.8;
      }
      const myPower = forza(team) + intesa(team, r.modulo).n / 2.5 + advOff;
      const oppPower = Math.max(20, T.f - advDef);
      const g = simGoals(myPower, oppPower);
      return close(g[0], g[1], true);
    }
    launch(m, dress(m, T), `Stagione dei Sogni · giornata ${se.day + 1}/7 · ${engName(m)}`, team, T.f >= 72, (res) => { if (res.quit) return stagione(); close(res.a | 0, res.b | 0, false); }, stagione);
  }
  // ---------------------------------------------------------------- il Draft: 1 carta su 3, cinque volte, poi la coppa a eliminazione
  const ROUNDS = ["Quarti di finale", "Semifinale", "Finale"];
  function offer(picks) {
    const pool = CARDS.filter((c) => drop(c) && !picks.includes(c.id)), w = pool.flatMap((c) => Array(5 - RAR[c.rar][2]).fill(c.id)), out = [];
    let n = 0; while (out.length < 3 && n++ < 200) { const id = w[Math.floor(Math.random() * w.length)]; if (!out.includes(id)) out.push(id); }
    return out;
  }
  function draft() {
    const r = load(); if (!r.draft) { r.draft = { picks: [], offer: offer([]), round: 0, opp: [], eng: [], over: null }; save(r); }
    const d = r.draft, body = shell("🎲 Draft dei Sogni"), I = intesa(d.picks);
    let h = `<p class="sum">Scegli una carta su tre, cinque volte: vale qualsiasi carta, anche quelle che non hai. Poi la coppa a eliminazione: ${ROUNDS.join(", ")}, ognuna in un motore a sorpresa. Ogni turno vinto +25 monete; chi vince la coppa <b>tiene una carta del draft</b>.</p>`;
    h += `<div class="sec">La squadra del draft · forza <b>${d.picks.length ? forza(d.picks) : "–"}</b> · intesa <b>${I.n}</b>/15</div><div class="team">${[0, 1, 2, 3, 4].map((k) => (d.picks[k] ? cardHtml(d.picks[k]) : `<div class="sgCard empty"><span>${k + 1}</span></div>`)).join("")}</div>${d.picks.length ? statLine(d.picks) : ""}`;
    if (d.picks.length < 5) {
      h += `<div class="sec">Scelta ${d.picks.length + 1}/5 · tocca una carta</div><div class="pick">${d.offer.map((id) => cardHtml(id)).join("")}</div>`;
    } else if (d.over) {
      h += `<div class="sec">${d.over === "win" ? "🏆 Coppa dei Sogni vinta!" : `Eliminati: ${ROUNDS[d.round]}`}</div>`;
      const keep = d.picks.filter((id) => !r.own.includes(id));
      if (d.over === "win" && !d.kept && keep.length) h += `<p class="sum">Scegli la carta da tenere:</p><div class="pick keep">${keep.map((id) => cardHtml(id)).join("")}</div>`;
      h += `<div class="big"><button type="button" data-new="1">🎲 Nuovo draft<small>Altre carte, altra coppa</small></button><span></span></div>`;
    } else {
      if (!d.opp.length) { const pool = TEAMS.map((_, k) => k).sort(() => Math.random() - 0.5); d.opp = [pool.slice(0, 3).sort((a, b) => TEAMS[a].f - TEAMS[b].f)].flat(); d.eng = ENG.slice().sort(() => Math.random() - 0.5).slice(0, 3); save(r); }
      const T = TEAMS[d.opp[d.round]], m = d.eng[d.round];
      h += `<div class="sec">${ROUNDS[d.round]}</div><div class="sf next"><div class="e">${engIcon(m)}</div><div><b>contro ${esc(T.name)}</b><span>${esc(engName(m))} · forza ${T.f} · ${esc(bonusTxt(m, d.picks))}</span></div><div class="n">▶</div></div>`;
      h += `<div class="big"><button type="button" data-play="1">⚽ Gioca<small>${d.round ? `${d.round} turni vinti` : "Si comincia"}</small></button><button type="button" data-quit="1">✕ Abbandona<small>Le monete vinte restano</small></button></div>`;
    }
    h += `<div class="big"><button type="button" data-back="1">◂ La squadra<small>Il draft resta salvato</small></button><span></span></div>`;
    body.innerHTML = h;
    body.querySelector("[data-back]").onclick = () => open();
    body.querySelectorAll(".pick:not(.keep) .sgCard").forEach((el) => (el.onclick = () => { const r2 = load(), d2 = r2.draft; if (!d2 || d2.picks.length >= 5 || !d2.offer.includes(el.dataset.c)) return; d2.picks.push(el.dataset.c); d2.offer = d2.picks.length < 5 ? offer(d2.picks) : []; save(r2); draft(); }));
    body.querySelectorAll(".pick.keep .sgCard").forEach((el) => (el.onclick = () => { const r2 = load(), d2 = r2.draft; if (!d2 || d2.kept || d2.over !== "win") return; d2.kept = el.dataset.c; if (!r2.own.includes(el.dataset.c)) r2.own.push(el.dataset.c); save(r2); reveal(el.dataset.c, "Dal Draft dei Sogni", draft); }));
    const bp = body.querySelector("[data-play]"); if (bp) bp.onclick = draftMatch;
    const bq = body.querySelector("[data-quit]"); if (bq) bq.onclick = () => { const r2 = load(); r2.draft = null; save(r2); open(); };
    const bn = body.querySelector("[data-new]"); if (bn) bn.onclick = () => { const r2 = load(); r2.draft = null; save(r2); draft(); };
  }
  function draftMatch() {
    const r = load(), d = r.draft; if (!d || d.picks.length < 5 || d.over) return;
    const T = TEAMS[d.opp[d.round]], m = d.eng[d.round], team = d.picks.slice(), rd = d.round;
    launch(m, dress(m, T), `Draft dei Sogni · ${ROUNDS[rd]} · ${engName(m)}`, team, rd === 2, (res) => {
      if (res.quit) return draft();
      const r2 = load(), d2 = r2.draft; if (!d2 || d2.round !== rd) return draft();
      if (res.win) { safe(() => window.addCoins(25), 0); d2.round++; if (d2.round >= 3) { d2.over = "win"; d2.round = 2; r2.cups++; } } else d2.over = "lose";
      if (!d2.picks.some((id) => !r2.own.includes(id)) && d2.over === "win") { d2.kept = "-"; safe(() => window.addCoins(80), 0); }
      save(r2); levelUps(gainXp(team, res.win), draft);
    }, draft);
  }
  function heroCard() {
    const r = load(); if (r.hero || r.won.length < 8) return; r.hero = true; save(r);
    safe(() => { const A = window.__borgoApi; A.bCos && A.bCos("sg_maglia"); }, 0);
    const body = shell("🌟 Il Campione dei Sogni"), img = port("hero");
    body.innerHTML = `<div class="reveal"><div class="sgCard rl hero" style="--rc:#ffd23f;--sc:#7a5ad8"><div class="hd"><span>Leggendaria</span><b>★</b></div><div class="img">${img ? `<img alt="" src="${img}">` : ""}</div><div class="nm">Il Campione dei Sogni</div><div class="st"><span>ATT <b>99</b></span><span>DIF <b>99</b></span><span>TEC <b>99</b></span></div><div class="sg">Tutte le saghe</div></div></div><p class="sum" style="text-align:center">Otto sfide, otto motori, una squadra di sogni. Questa carta è la tua. E nel Guardaroba c'è la <b>Maglia dei Sogni</b>.</p><div class="big"><button type="button" data-ok="1">◂ Torna al torneo<small></small></button></div>`;
    body.querySelector("[data-ok]").onclick = torneo;
  }
  function css() {
    if (document.getElementById("sgCss")) return; const st = document.createElement("style"); st.id = "sgCss";
    st.textContent = `.sgOv{position:fixed;inset:0;z-index:310;background:#120e1e;color:#f4f0e4;font-family:system-ui,sans-serif;overflow:auto}
.sgOv .wrap{max-width:560px;margin:0 auto;padding:10px 10px 30px}.sgOv .bar{display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#120e1e;padding:6px 0;z-index:2}.sgOv h2{margin:0;font:900 20px system-ui;color:#ffd23f}.sgOv .x{width:40px;height:40px;border-radius:8px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font-size:16px}
.sgOv .sum{font-size:13px;line-height:1.45;opacity:.9}.sgOv .sum .new{color:#7ad87a}.sgOv .sec{margin:12px 0 6px;font-weight:800;font-size:13px;color:#c8b8ff}.sgOv .why{font-weight:400;opacity:.8}
.sgCollControls{background:#181326;border:1px solid #3d2d60;border-radius:12px;padding:10px 12px;margin:8px 0 10px}
.sgSearchBox{display:flex;align-items:center;background:#100c1a;border:1px solid #4a3a6a;border-radius:8px;padding:5px 10px;gap:8px;transition:border-color .2s,box-shadow .2s}
.sgSearchBox:focus-within{border-color:#ffd23f;box-shadow:0 0 8px rgba(255,210,63,.25)}
.sgSearchIcon{font-size:13px;opacity:.7}
.sgSearchInp{flex:1;background:transparent;border:0;color:#f4f0e4;font:500 13px system-ui;outline:none;min-width:0}
.sgSearchInp::placeholder{color:#7d7098}
.sgClearBtn{background:transparent;border:0;color:#a89bc4;cursor:pointer;font-size:13px;padding:2px 6px;border-radius:4px;line-height:1}
.sgClearBtn:hover{color:#ffd23f;background:rgba(255,255,255,.08)}
.sgFilterGroups{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.sgFilterRow{display:flex;align-items:center;gap:4px;overflow-x:auto;padding-bottom:2px;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.sgFilterRow::-webkit-scrollbar{display:none}
.sgFilterLabel{font-size:10px;font-weight:800;color:#9b8cb8;text-transform:uppercase;letter-spacing:.5px;margin-right:2px;flex-shrink:0}
.sgChip{background:#221a36;border:1px solid #42345e;color:#c8b8ff;padding:4px 9px;border-radius:14px;font:600 11px system-ui;cursor:pointer;white-space:nowrap;transition:all .15s;flex-shrink:0}
.sgChip:hover{border-color:#ffd23f;color:#fff}
.sgChip.active{background:#ffd23f;border-color:#ffd23f;color:#120e1e;font-weight:800;box-shadow:0 1px 4px rgba(255,210,63,.3)}
.sgChip.chip-c.active{background:#9aa5b1;border-color:#9aa5b1;color:#120e1e}
.sgChip.chip-r.active{background:#3a8ad8;border-color:#3a8ad8;color:#fff}
.sgChip.chip-e.active{background:#a85ad8;border-color:#a85ad8;color:#fff}
.sgChip.chip-l.active{background:#ffd23f;border-color:#ffd23f;color:#120e1e}
.sgCollInfo{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#a89bc4;margin-top:8px;padding-top:6px;border-top:1px solid #281e42}
.sgCollInfo b{color:#ffd23f}
.sgCollReset{background:none;border:none;color:#ff5a7a;font-size:11px;cursor:pointer;padding:0;text-decoration:underline}
.sgEmptyColl{text-align:center;padding:26px 12px;background:#1a1428;border-radius:10px;border:1px dashed #4a3a6a;color:#c8b8ff;font-size:13px;grid-column:1/-1}
.sgModBox{background:#181326;border:1px solid #3d2d60;border-radius:10px;padding:8px 10px;margin:8px 0}
.sgModHd{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px}
.sgModTitle{font-size:11px;font-weight:800;color:#c8b8ff;text-transform:uppercase;letter-spacing:.5px}
.sgModChips{display:flex;gap:4px;overflow-x:auto;padding-bottom:2px;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.sgModChips::-webkit-scrollbar{display:none}
.sgModChip{background:#221a36;border:1px solid #42345e;color:#c8b8ff;padding:3px 8px;border-radius:12px;font:700 11px system-ui;cursor:pointer;white-space:nowrap;transition:all .15s}
.sgModChip:hover{border-color:#ffd23f;color:#fff}
.sgModChip.active{background:#7a5ad8;border-color:#ffd23f;color:#ffd23f;box-shadow:0 0 8px rgba(122,90,216,.5)}
.sgModDesc{margin-top:6px;font-size:11.5px;line-height:1.4}
.sgModTxt{margin:0 0 4px;color:#d8cde8}
.sgModStatusRow{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:4px}
.sgModSin{border-radius:6px;padding:3px 8px;font-size:10.5px;display:inline-block}
.sgModSin.ok{background:rgba(122,216,122,.15);border:1px solid #7ad87a;color:#7ad87a}
.sgModSin.warn{background:rgba(255,210,63,.1);border:1px solid rgba(255,210,63,.4);color:#ffd23f}
.sgModDetailBtn{background:#2a1e48;border:1px solid #7c3aed;color:#d8b4fe;font:700 11px system-ui;padding:4px 10px;border-radius:6px;cursor:pointer;transition:all .15s}
.sgModDetailBtn:hover{background:#7c3aed;color:#fff}
.sgModDetailTabs{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;margin:8px 0;scrollbar-width:none}
.sgModDetailTabs::-webkit-scrollbar{display:none}
.sgModTabBtn{background:#1f1834;border:1px solid #4a3a6a;color:#c8b8ff;padding:6px 12px;border-radius:10px;font:700 12px system-ui;cursor:pointer;white-space:nowrap;transition:all .15s;flex-shrink:0}
.sgModTabBtn:hover{border-color:#ffd23f;color:#fff}
.sgModTabBtn.active{background:#ffd23f;border-color:#ffd23f;color:#120e1e;font-weight:900;box-shadow:0 0 8px rgba(255,210,63,.4)}
.sgModDetailCard{background:#181326;border:1px solid #4a3a6a;border-radius:14px;padding:12px;margin:8px 0}
.sgModDetailHead{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;border-bottom:1px solid #2d2248;padding-bottom:10px}
.sgModDetailTitle{display:flex;align-items:center;gap:10px}
.sgModDetailTitle .ic{font-size:32px;line-height:1}
.sgModDetailTitle h3{margin:0;font:900 18px system-ui;color:#ffd23f}
.sgModDetailTitle h3 small{font-size:12px;font-weight:600;color:#c8b8ff;margin-left:6px}
.sgModDetailTitle p{margin:3px 0 0;font-size:12px;color:#d8cde8;line-height:1.35}
.sgModActiveBadge{display:inline-block;padding:4px 10px;border-radius:8px;background:rgba(122,216,122,.2);border:1px solid #7ad87a;color:#7ad87a;font:800 11.5px system-ui;white-space:nowrap}
.sgModSetBtn{background:#7c3aed;border:0;color:#fff;font:800 12px system-ui;padding:6px 12px;border-radius:8px;cursor:pointer;transition:transform .15s}
.sgModSetBtn:active{transform:scale(.96)}
.sgModSinBox{border-radius:10px;padding:8px 10px;margin:10px 0;font-size:12px;line-height:1.4}
.sgModSinBox.ok{background:rgba(122,216,122,.12);border:1px solid rgba(122,216,122,.4);color:#e2fbe2}
.sgModSinBox.warn{background:rgba(255,210,63,.1);border:1px solid rgba(255,210,63,.35);color:#fff2cc}
.sgModSinHd{font-weight:900;font-size:12.5px;margin-bottom:2px}
.sgModModesGrid{display:grid;grid-template-columns:1fr;gap:8px;margin-top:10px}
@media (min-width:480px){.sgModModesGrid{grid-template-columns:1fr 1fr}}
.sgModModeCol{background:#120c22;border:1px solid #3d2d60;border-radius:10px;padding:9px 11px}
.sgModModeTitle{font:800 12px system-ui;color:#c8b8ff;margin-bottom:4px;display:flex;align-items:center;gap:4px}
.sgModModeCol.arena .sgModModeTitle{color:#ffd23f}
.sgModModeCol.torneo .sgModModeTitle{color:#38bdf8}
.sgModModeCol.stagione .sgModModeTitle{color:#f472b6}
.sgModModeCol.arcade .sgModModeTitle{color:#4ade80}
.sgModModeText{font-size:11.5px;line-height:1.45;color:#e2daf0}
.sgIntTag{display:inline-block;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:800;margin-left:4px;vertical-align:middle}
.sgIntTag.leg{background:#ffd23f;color:#120e1e;box-shadow:0 0 6px rgba(255,210,63,.5)}
.sgIntTag.top{background:#7a5ad8;color:#fff}
.sgIntTag.med{background:#3a8ad8;color:#fff}
.sgIntTag.base{background:#4a3a6a;color:#c8b8ff}
.sgOv .team{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.sgOv .coll{display:grid;grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:8px}
.sgCard{position:relative;border-radius:10px;padding:5px;background:linear-gradient(160deg,var(--sc),#120e1e 75%);border:2px solid var(--rc);box-shadow:0 2px 0 rgba(0,0,0,.5);cursor:pointer;overflow:hidden;font-size:10px;min-height:92px}
.sgCard.empty{display:flex;align-items:center;justify-content:center;border-style:dashed;border-color:#4a3a6a;background:#1a1428;font-size:22px;color:#4a3a6a}
.sgCard .hd{display:flex;justify-content:space-between;font-weight:800;font-size:8.5px;color:var(--rc);text-transform:uppercase}.sgCard .img{aspect-ratio:1;border-radius:6px;background:#0a0814;overflow:hidden;margin:3px 0;display:flex;align-items:center;justify-content:center}.sgCard .img img{width:100%;height:100%;object-fit:cover}.sgCard .img span{font:900 26px system-ui;color:#4a3a6a}
.sgCard .nm{font-weight:800;font-size:10px;line-height:1.15;min-height:2.3em}.sgCard .st{display:flex;justify-content:space-between;font-size:8px;opacity:.9}.sgCard .st b{color:#ffd23f}.sgCard .sg{font-size:7.5px;opacity:.65;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sgCard.lock{filter:grayscale(1) brightness(.5);cursor:default}.sgCard.sel{outline:3px solid #7ad87a;outline-offset:1px}
.sgCard.re::after,.sgCard.rl::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.35) 45%,rgba(255,180,255,.25) 50%,transparent 62%);background-size:250% 100%;animation:sgHolo 3.2s linear infinite;pointer-events:none;mix-blend-mode:screen}
.sgCard.rl{box-shadow:0 0 12px rgba(255,210,63,.5)}@keyframes sgHolo{from{background-position:120% 0}to{background-position:-130% 0}}
@media (prefers-reduced-motion:reduce){.sgCard::after{animation:none!important}}
.sgOv .big{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}.sgOv .big button{min-height:56px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 14px system-ui;text-align:left;padding:8px 10px}.sgOv .big button small{display:block;font-weight:400;font-size:11px;opacity:.8;margin-top:3px}.sgOv .big button:disabled{opacity:.4}
.sgOv .links{display:grid;gap:4px;font-size:11.5px}.sgOv .links span{background:#1a1428;border-radius:6px;padding:5px 8px;opacity:.6}.sgOv .links span.ok{opacity:1;border-left:3px solid #7ad87a}.sgOv .links b{color:#c8b8ff}
.sgOv .sf{display:grid;grid-template-columns:40px 1fr 30px;gap:8px;align-items:center;background:#1a1428;border:1px solid #4a3a6a;border-radius:10px;padding:8px;margin:6px 0;cursor:pointer}.sgOv .sf .e{font-size:24px;text-align:center}.sgOv .sf b{display:block;font-size:13.5px}.sgOv .sf span{font-size:11.5px;opacity:.8}.sgOv .sf .n{font:900 18px system-ui;color:#ffd23f;text-align:center}.sgOv .sf.won{border-color:#7ad87a}.sgOv .sf.won .n{color:#7ad87a}
.sgCard .stars{position:absolute;top:22px;right:9px;color:#ffd23f;font-size:11px;text-shadow:0 1px 0 #000;z-index:1}.sgCard.s3{border-color:#ffd23f;box-shadow:0 0 0 2px #7a5a10,0 0 14px rgba(255,210,63,.6)}
.sgOv .frase{text-align:center;font:italic 700 15px Georgia,serif;color:#ffe9a8;margin:4px 16px 10px}.sgOv .last{background:#1a1428;border-radius:8px;padding:8px;border-left:3px solid #c8b8ff}
.sgOv .tab{width:100%;border-collapse:collapse;font-size:12px;margin:6px 0}.sgOv .tab th{font-size:10.5px;opacity:.7;text-align:left;padding:3px}.sgOv .tab td{padding:5px 3px;border-top:1px solid #2a2040}.sgOv .tab td:nth-child(n+3),.sgOv .tab th:nth-child(n+3){text-align:center}.sgOv .tab tr.me td{background:#2a2048;color:#ffd23f}
.sgCard .sgLoreBtn{position:absolute;top:2px;right:2px;width:19px;height:19px;line-height:17px;border-radius:5px;background:rgba(18,14,30,.88);border:1px solid rgba(255,255,255,.3);color:#ffd23f;font-size:10px;padding:0;z-index:4;cursor:pointer;text-align:center;transition:transform .12s,background .15s}
.sgCard .sgLoreBtn:hover,.sgCard .sgLoreBtn:active{transform:scale(1.15);background:#7a5ad8;color:#fff;border-color:#ffd23f}
.sgLoreWrap{max-width:380px;margin:0 auto;padding:4px}
.sgFlipCardArea{perspective:1000px;display:flex;justify-content:center;margin:6px 0 10px}
.sgFlipCardInner{position:relative;width:270px;min-height:430px;transition:transform .65s cubic-bezier(.4,0,.2,1);transform-style:preserve-3d;border-radius:14px;box-shadow:0 10px 28px rgba(0,0,0,.7);cursor:pointer}
.sgFlipCardInner.flipped{transform:rotateY(180deg)}
.sgFlipFace{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:14px;padding:12px;border:2.5px solid var(--rc);background:linear-gradient(165deg,var(--sc),#120e1e 72%);display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;box-sizing:border-box}
.sgFlipBack{transform:rotateY(180deg);background:linear-gradient(165deg,#23183c,#0d0818 75%);border-color:var(--rc)}
.sgCardHolo{position:absolute;inset:0;pointer-events:none;background:linear-gradient(125deg,transparent 25%,rgba(255,255,255,.2) 42%,rgba(255,210,63,.15) 50%,transparent 65%);opacity:.7;mix-blend-mode:screen}
.sgFlipHd,.sgBackHd{display:flex;justify-content:space-between;align-items:center;z-index:2}
.rarBadge{font-size:9.5px;font-weight:900;text-transform:uppercase;color:#120e1e;padding:2px 7px;border-radius:6px;box-shadow:0 1px 4px rgba(0,0,0,.4)}
.roleBadge{font-size:10.5px;font-weight:800;color:#c8b8ff;background:rgba(0,0,0,.4);padding:2px 7px;border-radius:6px;border:1px solid rgba(255,255,255,.15)}
.sgFlipImgWrap{position:relative;width:120px;height:120px;margin:6px auto 4px;border-radius:12px;background:#090612;border:2px solid var(--rc);overflow:hidden;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.5);z-index:2}
.sgFlipImgWrap img{width:100%;height:100%;object-fit:cover}
.sgFlipImgWrap .ph{font:900 48px system-ui;color:#4a3a6a}
.sgFlipStars{position:absolute;bottom:3px;left:0;right:0;text-align:center;font-size:12px;color:#ffd23f;text-shadow:0 1px 2px #000}
.sgFlipName{font:900 16px system-ui;color:#f4f0e4;text-align:center;margin:2px 0 0;z-index:2;line-height:1.2}
.sgFlipSaga{font:700 11px system-ui;text-align:center;margin-bottom:6px;z-index:2;opacity:.95}
.sgFlipStatsBox{background:rgba(12,8,22,.65);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:7px 9px;margin:4px 0;display:flex;flex-direction:column;gap:5px;z-index:2}
.stRow{display:flex;align-items:center;gap:6px;font-size:11px}
.stRow span{width:82px;font-weight:700}
.stRow span b{color:#ffd23f}
.stBar{flex:1;height:7px;background:#231a38;border-radius:4px;overflow:hidden}
.stFill{height:100%;border-radius:4px}
.stFill.att{background:#e8603a}
.stFill.dif{background:#3a8ad8}
.stFill.tec{background:#a85ad8}
.stRow small{font-size:9.5px;color:#9b8cb8;width:55px;text-align:right}
.sgFlipXpRow{display:flex;align-items:center;justify-content:space-between;font-size:10.5px;color:#c8b8ff;background:rgba(0,0,0,.35);padding:4px 8px;border-radius:6px;margin-top:4px;z-index:2}
.xpBar{width:70px;height:6px;background:#231a38;border-radius:3px;overflow:hidden}
.xpFill{height:100%;background:#ffd23f}
.sgTouchFlipHint{text-align:center;font-size:10px;color:#c8b8ff;opacity:.75;margin-top:4px;font-style:italic}
.sagaTag{font-size:11px;font-weight:800;padding:2px 8px;border-radius:6px;background:rgba(0,0,0,.45);border:1px solid}
.sgQuoteBox{font:italic 600 13px Georgia,serif;color:#ffe9a8;background:rgba(20,14,34,.6);border-left:3px solid #ffd23f;padding:7px 10px;border-radius:0 6px 6px 0;margin:6px 0;line-height:1.35;z-index:2}
.sgLoreSec{background:rgba(12,8,22,.6);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:6px 8px;margin:4px 0;z-index:2}
.sgLoreSecTitle{font:800 10.5px system-ui;color:#c8b8ff;text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px}
.sgLoreSecText{font-size:11.5px;line-height:1.4;color:#e8e0f5}
.sgLoreSkill b{color:#ffd23f;font-size:12px}
.cdTag{font-size:10px;color:#9ad8ff;margin-left:4px}
.sgLoreSkill p{margin:2px 0 0;font-size:11px;color:#d8cde8;line-height:1.35}
.sgLoreLinksList{display:flex;flex-direction:column;gap:3px}
.lkItem{font-size:10.5px;padding:3px 6px;border-radius:4px;background:#1a1428}
.lkItem.on{border-left:2px solid #7ad87a;color:#e2fbe2}
.lkItem.off{opacity:.6}
.sgLoreActions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}
.sgActionBtn{min-height:46px;border-radius:10px;border:1px solid #4a3a6a;font:800 13px system-ui;cursor:pointer;transition:transform .12s,background .15s;touch-action:manipulation}
.sgComboBanner{display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,#2c1a4d,#18102b);border:1.5px solid #a855f7;border-radius:10px;padding:8px 12px;margin:8px 0;box-shadow:0 3px 12px rgba(168,85,247,0.25)}
.sgComboBanner.none{background:#181226;border:1px dashed #4a3a6a;box-shadow:none;opacity:.8}
.sgComboIcon{font-size:22px;flex:none}
.sgComboInfo{flex:1;font-size:12px;line-height:1.35}
.sgComboInfo b{display:block;color:#ffd23f;font-size:13px}
.sgComboInfo span{color:#d8cde8;font-size:11.5px}
.sgComboInfo em{color:#38bdf8;font-style:normal;font-weight:700}
.sgActionBtn:active{transform:scale(.97)}
.flipBtn{background:#2a1e48;color:#ffd23f;border-color:#7a5ad8}
.teamBtn{background:#1f482a;color:#7ad87a;border-color:#48a05a}
.teamBtn.inTeam{background:#5a1f28;color:#ff9aa8;border-color:#a0485a}
.sgOv .reveal{display:flex;justify-content:center;margin:20px 0}.sgOv .reveal .sgCard{width:180px;font-size:13px;animation:sgFlip .7s ease-out}.sgOv .reveal .sgCard .nm{font-size:15px}.sgOv .reveal .sgCard .st{font-size:11px}.sgOv .reveal .sgCard .hd{font-size:11px}
.sgPackStage{position:relative;min-height:330px;display:flex;align-items:center;justify-content:center;margin:10px 0 8px;overflow:hidden;border-radius:16px;padding:12px 8px}
.sgPackAura{position:absolute;width:250px;height:250px;border-radius:50%;background:radial-gradient(circle,var(--rc) 0%,transparent 70%);opacity:calc(.18 + var(--tear) * .55);transform:scale(calc(.75 + var(--tear) * .55));transition:opacity .2s,transform .25s;pointer-events:none;filter:blur(8px)}
.sgPackStage.r-l .sgPackAura{box-shadow:0 0 42px rgba(255,210,63,.55)}
.sgPackCardSlot{position:relative;z-index:2;opacity:0;transform:translateY(26px) scale(.84);transition:opacity .42s ease,transform .5s cubic-bezier(.2,.9,.25,1);pointer-events:none}
.sgPackCardSlot .reveal{margin:8px 0 6px}
.sgPackMeta{text-align:center;margin:4px 0 0}
.sgPackStage.torn .sgPackCardSlot{opacity:1;transform:none;pointer-events:auto}
.sgFoilWrap{position:absolute;z-index:4;width:214px;height:286px;border-radius:14px;user-select:none;-webkit-user-select:none;touch-action:none;cursor:grab;display:flex;flex-direction:column;box-shadow:0 14px 32px rgba(0,0,0,.65),0 0 18px rgba(255,255,255,.08);transition:opacity .38s ease,transform .42s ease}
.sgFoilTop{height:54px;background:linear-gradient(135deg,#352852,#1d1530 60%,#433268);border:2px solid var(--rc);border-bottom:none;border-radius:14px 14px 4px 4px;padding:6px 10px;display:flex;flex-direction:column;justify-content:center;position:relative;transform-origin:100% 100%;transform:translateX(calc(var(--tear) * 36px)) translateY(calc(var(--tear) * -22px)) rotate(calc(var(--tear) * 14deg))}
.sgCutIcon{position:absolute;left:calc(8px + var(--tear) * 165px);top:6px;font-size:14px;filter:drop-shadow(0 1px 2px #000)}
.sgTearHint{font:800 10.5px system-ui;color:#f4f0e4;text-align:center;margin-top:8px;letter-spacing:.2px}
.sgTearProgress{height:4px;border-radius:3px;background:rgba(0,0,0,.45);margin-top:5px;overflow:hidden}
.sgTearProgress i{display:block;height:100%;width:calc(var(--tear) * 100%);background:linear-gradient(90deg,#fff,var(--rc))}
.sgFoilSeam{height:4px;background:repeating-linear-gradient(90deg,var(--rc) 0 6px,transparent 6px 11px);opacity:.9}
.sgFoilBody{flex:1;position:relative;overflow:hidden;background:linear-gradient(155deg,#2b1f47 0%,#150f26 48%,var(--sc) 135%);border:2px solid var(--rc);border-top:none;border-radius:4px 4px 14px 14px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px;text-align:center;transform:translateY(calc(var(--tear) * 16px))}
.sgFoilShine{position:absolute;inset:-30%;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.26) 47%,rgba(255,210,63,.2) 52%,transparent 64%);background-size:240% 100%;animation:sgHolo 2.8s linear infinite;pointer-events:none;mix-blend-mode:screen}
.sgFoilCrest{font-size:44px;line-height:1;margin-bottom:8px;filter:drop-shadow(0 3px 8px rgba(0,0,0,.6))}
.sgFoilTitle{font:900 14px system-ui;letter-spacing:1px;color:#ffd23f;text-shadow:0 2px 4px rgba(0,0,0,.8)}
.sgFoilSub{font:600 11px system-ui;color:#e4dcf5;margin-top:4px;opacity:.9}
.sgFoilRarHint{font:800 10.5px system-ui;margin-top:14px;padding:3px 9px;border-radius:10px;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.15)}
.sgPackStage.torn .sgFoilWrap{opacity:0;transform:scale(1.12) translateY(45px);pointer-events:none}
.sgSparks{position:absolute;inset:0;pointer-events:none;overflow:visible}
.sgSparks i{position:absolute;width:6px;height:6px;border-radius:50%;background:var(--rc);box-shadow:0 0 8px #fff,0 0 12px var(--rc);animation:sgSpark .5s ease-out forwards}
@keyframes sgSpark{to{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}}
@keyframes sgFlip{from{transform:perspective(600px) rotateY(180deg) scale(.6)}to{transform:none}}`;
    document.head.appendChild(st);
  }
  // la Maglia dei Sogni nel guardaroba (si registra all'avvio, così resta anche dopo aver ricaricato la pagina)
  (function reg() { const A = window.__borgoApi; if (!A || !A.COSM) return setTimeout(reg, 200); if (!A.COSM.sg_maglia) A.COSM.sg_maglia = { kind: "shirt", label: "Maglia dei Sogni", val: "#7a5ad8", from: "Vinci il Torneo dei Sogni (Salone delle Saghe)" }; })();
  window.__sogni = { SAGHE, BY, eff, name, port, _save: save, open, close: closeAll, _launch: launch, _tiers: tiers, CARDS, LINKS, SFIDE, TEAMS, FRASI, intesa, forza, sync, stagione, draft, stars: (id) => { XPC = load().xp; return starsOf(id); }, _load: load, MODULI, modSintonia, openModDetail, openCardLore, combo: getTeamCombo };
})();
