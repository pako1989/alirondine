// js/ospiti-vecchie.js - OSPITI AL BORGO delle saghe nate prima di cfg.guest (motori vecchi e storie a parte).
// Ogni ospite passa a trovarti nel Borgo Marino quando la sua saga risulta conclusa nel Salone (window.__salone.concluded).
(function () {
  "use strict";
  const K = (k) => "ali-di-rondine." + k;
  const G = [
    ["muro", "mu_orso", ["[serio] {n}. Il Torneo della Cinta è in pausa e io pure. Sono venuto a vedere un campo senza muro. Mi gira la testa.", "Sul vostro molo ho visto tre falli e nessun vento. Non ho fischiato. In trasferta fischia solo il gabbiano."]],
    ["cristalli", "cr_ortensia", ["[felice] {n}! Sessanta Partite del Cristallo arbitrate e mai un rigore sbagliato. Dico io. Qui al mare posso finalmente sbagliarne uno.", "Il vostro pane è buono, ma quello di Gilda è migliore. Non diteglielo: lo sa già, e non serve incoraggiarla."]],
    ["doppio-turno", "dt_pio", ["[furbo] {n}. Guardiano Pio. Metà di me è in ferie, l'altra metà è rimasta al Valtorre a fare la guardia. Così nessuno si offende.", "Bella porta, la vostra chiesa. Ci starei sulla soglia per ore. Un piede dentro, uno fuori: è così che ci si riposa."]],
    ["libro-finali", "lb_gommapane", ["Gnam. <em>(Gommapane ha trovato un refuso sull'insegna del bar: «Foccacia». Lo mastica soddisfatto.)</em>", "Gnam-gnam. <em>(Ti guarda, poi guarda il cartello del molo. Ci sono altri tre errori. Ha l'aria di chi si fermerà a lungo.)</em>"]],
    ["dopo", "ep_ada", ["[felice] {n}. Il mare è uguale a quello del '28. Le barche no, la gente no, i palloni nemmeno. Il mare sì.", "Mi hanno detto che qui i portieri parano con le mani e con la testa. Io paravo anche con la pazienza. Quella, almeno, non invecchia."]],
    ["mondi", "tm_custode", ["[serio] {n}. Le porte tra i mondi sono chiuse per un giorno. Anche un custode merita di vedere una porta normale: quella del vostro campo.", "Ogni volta che segni, da qualche parte una porta si apre di un millimetro. Non è vero. Ma è bello pensarlo."]],
    ["storia-campione", "vl_mirtilla", ["[felice] {n}! Ho lasciato il Rifugio Tre Tazze agli Stambecchi. Torno e lo trovo in piedi, se va bene. Senza cioccolata, sicuro.", "Ho portato la cioccolata «Rigore al Novantesimo». Va bevuta in fretta, prima che qualcuno la pareggi."]],
    ["abisso-story", "abi_barnaby", ["[serio] {n}. Il vostro mare è troppo calmo. Diffido delle acque che non cantano. Però il pesce è buono.", "Se di notte senti un canto dal largo, non è niente. Quasi sempre. Accendi una lanterna lo stesso."]],
    ["ragnarok", "rag_sindri", ["[pensa] {n}. Questa sabbia è ovunque. Nelle scarpe, nella barba, nelle rune. Mio fratello direbbe che fa bene alla forgia.", "Ho cesellato un pallone d'oro per il vostro torneo. È troppo pesante per calciarlo. È un pallone da ammirare, non da tirare."]],
    ["belovodia-story", "bv_boris", ["[felice] {n}. Non vedo il vostro mare, ma lo sento. Ha la voce di un legno giovane: rumoroso, e pieno di nodi.", "Ho intagliato una piccola rondine per la vostra piazza. Toccala, la sera: dicono che porta vento buono alle punizioni."]],
    ["bilancia-feudi", "fe_roland", ["[felice] {n}, amico mio! Nessun consiglio di guerra, nessun voto da contare. Solo una focaccia e un tramonto. Quasi non so come comportarmi.", "Se un giorno dovrai scegliere tra la cosa giusta e quella utile, vieni a trovarmi. Io scelgo sempre la prima. Poi mi pento della seconda."]],
    ["campione-ombre", "omb_milo", ["[furbo] {n}! Ho già contato tutte le uscite del Borgo: sette, più il tombino dietro il bar. Abitudine.", "La Lanterna Nera è lontana. Qui l'unica scommessa è chi finisce l'ultima focaccia. Ho puntato su di te."]],
    ["shogun-story", "sh_benkei", ["[serio] {n}. Il vostro ponte è piccolo, ma onorevole. L'ho difeso per tutta la mattina. Nessuno ha provato a passare.", "Un pescatore mi ha offerto un'acciuga. L'ho accettata con onore. Il gatto del molo, invece, l'ha presa male."]],
    ["phantom-genesis", "pg_rin", ["[furbo] {n}! Niente androidi, niente pattuglie, niente Mako. Che noia. Vendo sfere di vetro lo stesso: sono biglie, ma nessuno lo sa.", "Il vostro canale di scolo è pulitissimo. Non so se fidarmi di un posto così."]],
    ["pirati-story", "pi_barbanube", ["[pensa] {n}. Il vostro faro è basso e onesto. Il mio volava sopra le nuvole. Preferisco il vostro: non ti fa venire il mal di mare.", "Le correnti qui girano a ponente dopo le cinque. Tiralo forte, il pallone, e il vento te lo riporta. Prova."]],
    ["alchimia-story", "al_armstrong", ["[felice] {n}! Ammira il vostro molo, restaurato con alchimia? No? Lo restauro io, ora, con i muscoli! Scherzo. Forse.", "Ho insegnato a tre pescatori la posa della famiglia Armstrong. Ora sollevano le reti con eleganza. Le reti sono rimaste uguali."]],
    ["kronenburg-story", "kb_merrick", ["[serio] {n}. La vostra fucina è un forno da pane. Va bene lo stesso: il fuoco è fuoco. La focaccia è meglio dell'ossidiana.", "Ti ho forgiato una chiave. Non apre niente. Ma suona bene, se la tiri contro un palo."]],
    ["chrono-story", "chr_elias", ["[pensa] {n}. Il campanile del vostro Borgo è in ritardo di quattro minuti. Non lo aggiusto: mi piace un tempo che si concede una pausa.", "Ho lasciato una clessidra sul muretto del molo. Si gira da sola, a mezzogiorno. Non chiedetemi come, è un segreto di bottega."]],
  ];
  function go(n) {
    if (!window.__borgoGuests || !window.__salone) { if (n < 80) setTimeout(() => go(n + 1), 250); return; }
    G.forEach(([key, id, lines]) => window.__borgoGuests.add({ id, lines: lines.map((t) => [id, t]), when: () => { try { return !!window.__salone.concluded(K(key)); } catch (e) { return false; } } }));
  }
  go(0);
})();
