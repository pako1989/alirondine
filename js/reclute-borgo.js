// js/reclute-borgo.js - "Reclute con una storia": chi entra in squadra (Gabbia del Molo, Matchday Director) ha una breve missione nel Borgo camminabile.
// Sette missioni (1 scena iniziale + una scelta che conta nel tono + un finale), ognuna ambientata nella mappa di trasferta più adatta al mestiero:
//   Brando (bagnino) -> I Trabucchi · Mimì (fattorina in bici) -> Genova · Zoe (gelati dello Scoglio) -> Scoglio della Sirena
//   Otello (scaricatore) -> Conservificio · Nina (ripara biciclette) -> Colle dei Mulini · Ester (guardiana del faro) -> Capo Ventoso
//   Ondina (portiera di Punta Nera) -> Punta Nera, dove la aspetta il fratello Teo.
// La missione compare solo con progresso GIÀ esistente: l'episodio del Director in cui la recluta si sblocca è aperto (si è arrivati all'avversario),
// oppure la recluta è già in squadra in una modalità. Nessuna soglia esistente cambia. Completarla arruola la recluta in ogni modalità in cui esiste
// (window.__directorHd.recruit / window.__cageHd.recruit); se era già arruolata, la missione resta fruibile come "storia di retroscena".
// Ricompensa: monete piccole UNA volta per missione, solo con window.addCoins (6 per un arruolamento, 3 per un retroscena). Niente bonus di gioco.
// Salvataggio additivo: "ali-di-rondine.reclute-borgo". API: window.__recluteBorgo (info, missions, chat, reset in ?debug).
// Va incluso DOPO game.js, borgo-expansions.js, street-cage-hd.js, match-director-hd.js, cage-borgo.js, director-borgo.js (e prima o dopo borgo-hub.js: non critico).
// Catena trTalkHook: la funzione assegnata gestisce SOLO i propri id e non chiama mai il getter (stessa regola di director-borgo.js).
(function () {
  "use strict";
  if (window.__recluteBorgoLoaded) return;
  window.__recluteBorgoLoaded = true;
  var tries = 0;
  var KEY = "ali-di-rondine.reclute-borgo";
  var DEBUG = /[?&]debug\b/.test(location.search || "");

  function mem() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (!o || typeof o !== "object") o = {};
      if (!o.done || typeof o.done !== "object") o.done = {};
      return o;
    } catch (e) { return { done: {} }; }
  }
  function memSet(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* ignora */ } }

  // ---------------------------------------------------------------- le missioni
  // lines: [chi, testo]. "voce" = narratore. opts[i].lines = scena dopo la scelta; out = chiusura comune.
  var MS = [
    {
      id: "brando", npc: "rb_brando", zone: "trabucchi", at: [12, 18], ep: "lanterne", dir: "brando", cage: "brando", who: "Brando",
      title: "Il cigno alla deriva", sub: "Sul molo, Brando fissa il bacino con il fischietto in bocca",
      hello: "«Leo! Brando, bagnino. Diciotto estati di torretta e zero salvataggi: un record che fa piangere il fischietto. Oggi, forse, cambia.»",
      intro: [
        ["voce", "Sulla passerella dei Trabucchi, Brando scruta il bacino con un binocolo, il fischietto in bocca e un salvagente arancione sotto il braccio. A venti metri dal molo, un pedalò a forma di cigno gira lentamente su se stesso. Dentro c'è un signore con il cappello di paglia, immobile come una statua."],
        ["rb_brando", "Quello è il Cavalier Gerolamo. Il motorino del pedalò si è spento. O l'ha spento lui: dice che «contempla». In diciotto estati non ho mai dovuto salvare nessuno, Mister. Nessuno. Il fischietto è ancora vergine."],
        ["leo", "Se contempla, forse non ha fretta."],
        ["rb_brando", "Il bacino ha corrente dalle due. Sono le due e dieci. Il gabbiano, laggiù, sa già come va a finire: guardalo."],
      ],
      q: "Brando ti passa il salvagente e abbassa la voce: «Dimmi tu come si fa, Mister. Davanti a un cigno vero ho la sindrome del fischietto.»",
      opts: [
        { label: "Fischietto e voce da torretta", sub: "Autorità, con un po' di scena", tone: 1, lines: [
          ["leo", "Fischia, Brando. Una volta. Forte. Con dignità."],
          ["voce", "Il fischio attraversa il bacino come un gabbiano ben pagato. Il Cavalier Gerolamo si volta, saluta col cappello e grida: «Sto contemplando!»"],
          ["rb_brando", "Contempli verso riva, Cavaliere!"],
          ["voce", "Il cigno vira, con comodo. Gerolamo pedala con la dignità di chi ha deciso di tornare da solo, e per puro caso era la sua idea fin dall'inizio."],
        ] },
        { label: "Salvagente vicino, voce piana", sub: "Lancia accanto, non addosso", tone: 2, lines: [
          ["leo", "Lancialo accanto a lui, non addosso. E parlagli piano: la voce lunga calma anche i cigni."],
          ["voce", "Il salvagente cade a un metro dal pedalò. Gerolamo lo guarda, poi guarda Brando, poi sospira: «Il motore non c'entra, ragazzo. Questo cigno è a due posti, e io pedalo sempre da solo. Mio fratello veniva con me, e adesso vive lontano.»"],
          ["rb_brando", "Allora la corrente non c'entra... Cavaliere, le va se salgo io? Non so pedalare piano, però so pedalare in due."],
          ["voce", "Brando si cala dal molo sul pedalò con un salto da torretta. Il cigno ricomincia a muoversi, un po' storto, in due."],
        ] },
        { label: "Chiedi consiglio a Gerolamo", sub: "Il Cavaliere sa dove sta la riva", tone: 3, lines: [
          ["leo", "Cavaliere! Come si fa a rientrare, da lì? Brando e io non l'abbiamo mai capito!"],
          ["voce", "Gerolamo si alza in piedi sul pedalò, solenne, e spiega a voce alta per dieci minuti come si rientra. Mentre parla, i pedali, dimenticati, lo portano a riva da soli."],
          ["rb_brando", "Mister, questo è il salvataggio più elegante della storia: ho salvato un uomo che stava salvando me."],
          ["voce", "Il Cavaliere sbarca, stringe la mano a Brando e dice: «Ottimo bagnino. Mi ha salvato proprio quando stavo per spiegare tutto.»"],
        ] },
      ],
      out: [
        ["rb_brando", "Sai cos'è strano, Mister? Ho tremato. Per tutto il tempo. Diciotto anni ad aspettare un salvataggio, e quando arriva scopro che non volevo salvare qualcuno: volevo essere chiamato."],
        ["leo", "In campo ti chiamano di continuo. Ti chiamo io."],
        ["rb_brando", "Allora d'inverno vengo in campo. D'estate fischio dalla torretta e voi fate finta di non sentire. Mi piace, come accordo."],
      ],
      after: ["«Il Cavaliere mi ha mandato una cartolina: «Contemplo ancora, ma stavolta in compagnia». Ho il fischietto più felice del Borgo.»", "«Quella volta del pedalò: ho il cuore che ancora pedala. Se vuoi un salvataggio, Mister, basta chiamare.»", "«Il Cavaliere dice a tutti che l'ho salvato io. Io lascio dire. È un lavoro di diplomazia, il bagnino.»"],
      pres: "«Brando ha restituito un cigno al suo legittimo proprietario, Mister. Io non riesco a fare lo stesso con le fatture.»",
      dina: "«Ho aperto la cartella 'Brando'. Dentro c'è solo un fischietto e una crema solare. Con il vento giusto, può diventare una pratica.»",
      ner: "Annuncio: sul molo dei Trabucchi un fischietto ha finalmente funzionato. Ripeto: ha funzionato. Il gabbiano, per rispetto, ha smesso di ridere.",
    },
    {
      id: "mimi", npc: "rb_mimi", zone: "caruggi", at: [14, 13], ep: "settimio", dir: "mimi", cage: "mimi", who: "Mimì",
      title: "Il pacco per il Mister", sub: "Una bici gialla e un tubo di cartone senza destinatario",
      hello: "«Mister! Mimì, fattorina in bici del molo. Ho un pacco senza destinatario e una bici con i freni offesi. Tu hai la faccia di uno che aspetta qualcosa.»",
      intro: [
        ["voce", "Nel caruggio più stretto, una bici gialla è appoggiata di traverso a un muro. Sul portapacchi, un tubo di cartone con un'etichetta: «Per il Mister, URGENTE. Non agitare. Non spiegare.»"],
        ["rb_mimi", "Lo manda il Presidente Spigola. Dentro c'è una lavagnetta magnetica con undici calamite: dieci sono giocatori, l'undicesima è un'acciuga. Ho chiesto perché: nessuno lo sa."],
        ["rb_mimi", "Io consegno da quando avevo dodici anni: so il numero civico di ogni portone e quale ha il gatto di guardia. Ma la tattica... se vedo una lavagna con le frecce, penso a un sistema di sensi unici."],
        ["leo", "È più o meno la stessa cosa."],
        ["rb_mimi", "Davvero? Allora insegnamela. Ma senza parole difficili: ho la terza media e un ottimo senso dell'orientamento."],
      ],
      q: "Mimì appoggia la lavagnetta sul sellino e ti guarda. Come le spieghi la tattica?",
      opts: [
        { label: "Come un giro di consegne", sub: "Il pallone è il pacco", tone: 3, lines: [
          ["leo", "Il pallone è il pacco. Il compagno è l'indirizzo. Non lo porti tu fino in fondo: lo dai a chi è già più vicino alla porta giusta."],
          ["voce", "Mimì dispone le calamite lungo il disegno come se fosse una mappa dei caruggi, e mette l'acciuga all'angolo del bar."],
          ["rb_mimi", "Questa è il bar: lì ci si ferma sempre, e chi non ci passa si perde l'azione. Visto? Ho capito il centrocampo."],
          ["voce", "Leo non ha il coraggio di correggerla. In effetti, il centrocampo è un bar."],
        ] },
        { label: "Con le calamite sulla lavagna", sub: "Linee, frecce e l'acciuga", tone: 1, lines: [
          ["leo", "Quattro dietro, tre in mezzo, tre davanti. L'acciuga fa il falso nueve."],
          ["rb_mimi", "Il falso nueve è una consegna che finge di essere un'altra? Lo adoro. È il pacco col nome sbagliato sopra, che arriva comunque."],
          ["voce", "Mimì sposta l'acciuga due volte, poi la lascia tra le linee: «Qui non si vede, ma serve». È, tecnicamente, una descrizione perfetta."],
        ] },
        { label: "Falla pedalare, senza spiegare", sub: "Tu guardi dove passa", tone: 2, lines: [
          ["leo", "Fai il tuo solito giro. Io guardo dove passi."],
          ["voce", "Mimì parte tra i caruggi: scansa i panni stesi, saluta le finestre, non sbaglia un portone. Dopo un quarto d'ora torna, con le guance rosse e il fiatone."],
          ["rb_mimi", "Ogni portone è un compagno. Sapevo già dove mandarli, solo che nessuno me l'aveva mai chiesto: mi hanno sempre chiesto dove consegnare, mai dove andare."],
        ] },
      ],
      out: [
        ["rb_mimi", "Dimmi dove sto, nel tuo schema, Mister."],
        ["leo", "In mezzo, dove passano tutti."],
        ["rb_mimi", "Il posto più trafficato. Perfetto: c'è sempre qualcuno che aspetta un pacco. Domani mi presento con la bici. Posso parcheggiarla in panchina?"],
      ],
      after: ["«Ho già mandato tre passaggi a tre indirizzi sbagliati, però tutti in porta. Segnati come consegne a domicilio.»", "«Quel giorno del giro l'ho tenuto per me. Era la prima volta che qualcuno guardava dove passavo, non dove arrivavo.»", "«Il falso nueve funziona: ora anche il postino fa finta di essere un altro.»"],
      pres: "«Mimì mi ha consegnato la lavagnetta. Undici calamite, di cui una acciuga: l'acciuga era mia. Firmo i bilanci con la calamita, per scaramanzia.»",
      dina: "«Mimì non porta un foglio senza chiedere la ricevuta. Sta imparando la tattica; io sto imparando a leggere la sua calligrafia da bicicletta.»",
      ner: "Annuncio: una bici gialla ha un posto in panchina. Ripeto: parcheggio libero, ma si prega di lasciare i freni a casa.",
    },
    {
      id: "zoe", npc: "rb_zoe", zone: "bescoglio", at: [9, 6], ep: "squali", dir: "zoe", cage: "zoe", who: "Zoe",
      title: "Salita, vento, fragola", sub: "Il chiosco dello Scoglio e una bici da consegne",
      hello: "«Ehi, Mister! Zoe, gelati dello Scoglio. Cinque minuti di strada, sei di salita e un gelato che ne dura quattro. Se vuoi essere utile, fai il cronometro.»",
      intro: [
        ["voce", "Sullo Scoglio della Sirena c'è un chiosco dal tetto a righe e una bici da consegne carica di scatole termiche. Zoe tiene la mano sul manubrio come un fantino sul collo del cavallo."],
        ["rb_zoe", "Regola del mestiere: una fragola in salita, controvento, deve arrivare intera a chi l'ha ordinata. L'ordine di oggi è per Don Tullio: limone, ma non lo ammette mai, quindi lo chiamiamo «gusto del custode»."],
        ["rb_zoe", "La Gabbia del Molo è tutta piana, e io ho le gambe da salita: mi annoio. Ma con te, forse, trovo una salita come si deve."],
        ["voce", "Sullo scoglio, il gabbiano Peppino ha preso il posto di cronometrista. Non ha un orologio, ma ha l'aria giusta."],
      ],
      q: "Zoe parte dalla rampa del chiosco: salita, controvento, un cono in mano. Come le dai il tempo?",
      opts: [
        { label: "Tifo a squarciagola", sub: "Il pubblico, di solito, aiuta", tone: 1, lines: [
          ["leo", "FORZA ZOE! PIÙ FORTE! IL LIMONE SI SCIOGLIE!"],
          ["rb_zoe", "(sul pedale, ansimando) Non urlare, il gelato si scioglie di vergogna!"],
          ["voce", "Zoe arriva in cima con le orecchie rosse e il cono quasi intatto. Il gabbiano, per sicurezza, gli ruba una pallina."],
        ] },
        { label: "Corri accanto a lei", sub: "Un pezzo di salita in due", tone: 2, lines: [
          ["voce", "Leo parte di corsa a fianco della bici. Dopo trenta metri ha già perso il fiato; Zoe, senza dire una parola, rallenta di un quarto di giro."],
          ["rb_zoe", "Sai quanto mi costa rallentare per qualcuno? Tanto. Io sono quella che arriva prima. Con te l'ho fatto due volte, e non è andata male."],
          ["voce", "In cima, il cono è un po' sciolto da una parte e perfetto dall'altra. Come le compagnie che valgono."],
        ] },
        { label: "Tieni il tempo e basta", sub: "Cronometro, silenzio, rispetto", tone: 3, lines: [
          ["leo", "Via. Zitto io."],
          ["voce", "Leo conta i secondi sul quadrante di un orologio che sembra un barattolo. Sei minuti e quattro secondi. Zoe lascia cadere la bici sul prato e alza il cono come un trofeo."],
          ["rb_zoe", "Il record era sei e dieci! Lo scriviamo sul chiosco. Con il pennarello indelebile: così il gelato non lo cancella."],
        ] },
      ],
      out: [
        ["rb_zoe", "Sai qual è il vero problema della salita, Mister? Che da soli si fa fatica e in due, di solito, ci si ferma a parlare. Io non mi sono mai fermata. Con te mi sono fermata a metà e non mi dispiace."],
        ["leo", "Alla Gabbia non ci sono salite, ma qualcuna la inventiamo."],
        ["rb_zoe", "Allora firmo. Tu mi dai una salita, io ti porto il gelato. E se vinciamo, il cono lo offre il Presidente."],
      ],
      after: ["«Il record sul chiosco è ancora lì. Il gabbiano ha provato a cancellarlo: ha capito che era indelebile e ha desistito.»", "«Mi sono fermata a metà e il limone si è sciolto lo stesso. Ne è valsa la pena. Non dirlo a Tullio.»", "«Il pubblico urla, il gelato si vergogna e io corro. Comodo, come sistema.»"],
      pres: "«Zoe consegna gelati in salita controvento. Io consegno bilanci in discesa e non arrivano lo stesso. Il confronto è impietoso.»",
      dina: "«Zoe ha pagato in anticipo il gelato della squadra. Non è mai successo. Sto controllando che non sia uno scherzo.»",
      ner: "Annuncio: una ragazza in bici ha battuto il vento sullo Scoglio. Il vento ha chiesto la rivincita. La ragazza ha detto: «Vediamoci in salita».",
    },
    {
      id: "otello", npc: "rb_otello", zone: "beconserve", at: [24, 13], ep: "cantiere", dir: "osvaldo", cage: "osvaldo", who: "Otello",
      title: "Una cassa per Otello", sub: "Sulla banchina, una torre di casse e un uomo che la regge",
      hello: "«Mister. Otello, scaricatore. Se cerchi Osvaldo, è sulla carta d'identità. Qui sono Otello da undici anni, per colpa di una cassa.»",
      intro: [
        ["voce", "Sulla banchina del Conservificio, una torre di casse di acciughe sale in perfetto equilibrio. Dietro la torre c'è un uomo grande quanto la torre che la regge con una mano, mentre con l'altra scrive su un quaderno."],
        ["rb_otello", "Mi chiamo Osvaldo. Ma undici anni fa è arrivata una cassa con scritto «PER OTELLO - 40 KG SARDINE». Il destinatario non si è mai fatto vivo. La cassa l'ho presa io, e il nome pure."],
        ["rb_otello", "Faccio il muro del molo da undici anni: qualunque cosa cada, cade contro di me. Per merito? No. Per ingombro."],
        ["leo", "In campo, il muro serve."],
        ["rb_otello", "Lo so. Ma c'è un problema: ho scaricato casse per undici anni e in tutto questo tempo nessuno mi ha mai chiesto di passare la palla. Nemmeno per sbaglio."],
      ],
      q: "La torre barcolla e Otello non può mollarla. Come lo aiuti?",
      opts: [
        { label: "Reggi la torre insieme a lui", sub: "Spalla contro cassa", tone: 2, lines: [
          ["voce", "Leo si mette sotto, spalla contro la cassa più bassa. La torre smette di barcollare. Per un momento, nessuno dei due dice niente."],
          ["rb_otello", "Un muro non è uno solo, Mister. Sono due che sanno dove sta l'altro. Era la prima volta che qualcuno reggeva con me: di solito reggono davanti a me."],
          ["voce", "Poco dopo arriva un carrello. Otello lascia la torre al carrello, e per un secondo la guarda come si guarda un compagno dimesso."],
        ] },
        { label: "Dai ordini da allenatore", sub: "Diagonali, scalate e sovrapposizioni", tone: 1, lines: [
          ["leo", "Casse di sinistra, scalate! Quelle in alto, restate corte! Quella nel mezzo, copri la diagonale!"],
          ["rb_otello", "Mister, sono casse. Non fanno la diagonale."],
          ["leo", "Fanno la diagonale meglio di certi difensori."],
          ["voce", "Otello ride, una risata così profonda che la torre vibra. Poi ha un ripensamento, e la torre si assesta da sola, per dispetto."],
        ] },
        { label: "Spostala di dieci centimetri", sub: "Un muro intelligente sposta, non solo regge", tone: 3, lines: [
          ["leo", "Dieci centimetri a sinistra. Così fa ombra sul tavolo e non sul tuo quaderno."],
          ["voce", "Otello sposta la torre di dieci centimetri con una spinta sola, come si sposta un tavolino. L'ombra scivola via dal quaderno. Lui rimane a bocca aperta."],
          ["rb_otello", "In undici anni nessuno mi aveva detto che il muro si può spostare. Credevo di essere piantato per contratto."],
        ] },
      ],
      out: [
        ["rb_otello", "Mister, se mi metti a fare muro, io faccio muro. Se mi metti a passare, passo. Ma le casse le lascio fuori dal campo, lo prometto."],
        ["leo", "E il nome? Osvaldo o Otello?"],
        ["rb_otello", "Otello. Osvaldo è uno che scarica casse. Otello è uno che gioca in difesa. Preferisco il secondo."],
      ],
      after: ["«La cassa PER OTELLO ce l'ho ancora, in garage. Ci tengo le scarpe. È la mia coppa personale.»", "«Mi sono accorto che reggere in due è meno faticoso. Però non dirlo ai colleghi: i sindacati mi vogliono reggere da solo.»", "«Il muro si sposta: lo dico a tutti. Nessuno mi crede. La torre, però, sì.»"],
      pres: "«Otello regge una torre di casse con una mano. Io reggo la società con un barattolo: a pari merito.»",
      dina: "«Alla voce Otello ho scritto anche Osvaldo, tra parentesi. È lo stesso uomo, ma in archivio ci piacciono i dettagli.»",
      ner: "Annuncio: lo scaricatore del Conservificio ha un nuovo nome sulla maglia. Ripeto: Otello. La cassa originale, dicono, è ancora in cerca del suo destinatario.",
    },
    {
      id: "nina", npc: "rb_nina", zone: "bemulini", at: [18, 10], ep: "vignaioli", dir: "nina", cage: "nina", who: "Nina",
      title: "La nota del raggio", sub: "Un banco di chiavi inglesi e due ruote storte",
      hello: "«Ciao! Nina: ripariamo biciclette qui al Colle, tra un mulino e nessuna fretta. Oggi ho due ruote storte e un problema di precedenze.»",
      intro: [
        ["voce", "All'ombra del mulino più alto c'è un banco da lavoro con chiavi inglesi appese in ordine di grandezza e due biciclette a testa in giù: una gialla, una rosa."],
        ["rb_nina", "La gialla è di Mimì, la rosa è di Zoe. Entrambe con la ruota storta, entrambe urgenti, entrambe «per stasera». Io posso fare un raggio alla volta."],
        ["rb_nina", "Sai cosa penso dei raggi? Che sono come i passaggi: ognuno deve tirare un po', né troppo né poco. Se uno tira più degli altri, la ruota si pente."],
        ["leo", "E come si sa quanto tirare?"],
        ["voce", "Nina batte la chiave su un raggio: dlin. Poi su un altro: dlon. Sorride come chi ha trovato una melodia in una cassetta degli attrezzi."],
        ["rb_nina", "Si suona. Quando tutti fanno la stessa nota, la ruota gira dritta."],
      ],
      q: "C'è tempo per una ruota sola prima di sera. Quale finisce per prima?",
      opts: [
        { label: "La gialla, di Mimì", sub: "I pacchi non aspettano", tone: 3, lines: [
          ["leo", "Mimì ha i pacchi da consegnare: quella prima."],
          ["rb_nina", "Pratico. Mi piace. Una ruota di Mimì consegna mezzo Borgo, e le lettere arrivano a chi aspetta."],
          ["voce", "Nina tende il primo raggio, e la bici gialla comincia a girare con un suono pulito come un cucchiaino su una tazza."],
        ] },
        { label: "La rosa, di Zoe", sub: "I gelati hanno un orologio dentro", tone: 1, lines: [
          ["leo", "Quella di Zoe: i gelati hanno l'orologio dentro."],
          ["rb_nina", "Ha ragione la fragola. Sta in coda con lo scioglimento: se perde la ruota, perde anche la forma."],
          ["voce", "La bici rosa torna a girare. Una pallina di fragola, in una scatola nascosta, fa un piccolo applauso di condensa."],
        ] },
        { label: "Tutte e due, un raggio alla volta", sub: "Reggi tu, accordi tu", tone: 2, lines: [
          ["leo", "Tutte e due. Io tengo ferma una e tu accordi l'altra."],
          ["voce", "Per un'ora Leo tiene le ruote ferme e Nina le accorda: dlin, dlon, dlin. Nessuna delle due biciclette finisce per prima, e nessuna resta indietro."],
          ["rb_nina", "Così ognuna aspetta, ma nessuna resta sola. Come in squadra. Una ruota storta non è rotta: è solo convinta di un'altra strada."],
        ] },
      ],
      out: [
        ["rb_nina", "Pensavo che il mio lavoro fosse raddrizzare ruote. Forse è trovare l'angolo giusto: una sponda è un raggio che rimbalza."],
        ["leo", "Se vuoi entrare in squadra, di angoli ne abbiamo molti."],
        ["rb_nina", "Allora vengo. Porto la chiave inglese: non per colpire, per accordare."],
      ],
      after: ["«Le due bici hanno fatto la stessa nota. Mimì dice che è un caso. Zoe dice che è merito suo. Io faccio finta di dormire.»", "«Dopo quel giorno ho smesso di accordare solo le ruote: ora accordo anche le sponde. Sono più difficili, ma dicono la stessa nota.»", "«Il mulino è alto: lo uso per misurare gli angoli. Non è scientifico, però ha una bella vista.»"],
      pres: "«Nina ha raddrizzato la bici di Mimì e quella di Zoe. A me ha raddrizzato il portachiavi, che è già qualcosa.»",
      dina: "«Nina dice che i passaggi sono raggi: se uno tira troppo, la ruota si pente. Ho appeso la frase in ufficio, sopra la cartella 'Varie'.»",
      ner: "Annuncio: dal Colle dei Mulini arriva una nota pulita. Ripeto: una nota. È una ruota che gira dritta, o forse è Nina che canticchia.",
    },
    {
      id: "ester", npc: "rb_ester", zone: "becapo", at: [23, 9], ep: "faro_est", dir: "ester", cage: null, who: "Ester",
      title: "Il registro del faro", sub: "Ester e un quaderno in tela con la matita legata a un filo",
      hello: "«Mister? Ester, guardiana del faro. Tu sei quello che cammina sempre di fretta e arriva sempre in tempo. Guardami pure: non sono io che salgo, sono i gradini che mi vengono incontro.»",
      intro: [
        ["voce", "Davanti al faro di Capo Ventoso, Ester tiene un quaderno rilegato in tela e una matita legata a un filo, perché la matita, da sola, scappa."],
        ["rb_ester", "Questo è il registro del faro. Ogni sera scrivo chi è passato davanti alla costa: pescherecci, gozzi, una volta un surfista che non so come sia arrivato fin qua. Centotredici gradini per salire, centotredici per scendere. Il registro sta in cima."],
        ["rb_ester", "Il faro, a volte, è un lavoro di silenzio. Dalla lanterna vedo tutta la costa, ma nessuno vede me. Non mi dispiace. Però ogni tanto lo dico ad alta voce, per sentire che suono fa."],
        ["leo", "Ha un suono. Un buon suono."],
        ["rb_ester", "Allora l'ho detto bene."],
      ],
      q: "Ester ha una riga libera nel registro, sotto la data di oggi. «Che ci scrivo, della Rondine?»",
      opts: [
        { label: "«Passati. Illesi. Quasi.»", sub: "Con la prudenza dei marinai", tone: 1, lines: [
          ["voce", "Ester scrive piano, a stampatello, con la lingua tra i denti. Rilegge: «Passati. Illesi. Quasi»."],
          ["rb_ester", "Il «quasi» è la parola più onesta che abbia mai scritto in un registro. Ci tengo. Resta."],
        ] },
        { label: "«Presenti.»", sub: "Una parola sola, per sentirsi visti", tone: 2, lines: [
          ["voce", "Ester ci pensa a lungo. Poi, sotto la data, con la sua calligrafia ordinata, scrive: «La Rondine. Presenti.»"],
          ["rb_ester", "Una parola sola. Nessuno qui ne ha mai scritta una per me: nei registri si scrive chi passa, non chi guarda. Stavolta qualcuno guardava, e ha scritto anche questo."],
        ] },
        { label: "«Difesa alta, luce accesa.»", sub: "Una frase da lavagna tattica", tone: 3, lines: [
          ["leo", "«Difesa alta, luce accesa». Così si capisce da lontano che c'è qualcuno di guardia."],
          ["voce", "Ester ride piano, poi aggiunge una freccia a margine come un'allenatrice: ↑ «Qui entro io»."],
          ["rb_ester", "Un faro sa essere una linea difensiva, quando fa luce. Non lo sapevo. Adesso lo scrivo anche in chiaro."],
        ] },
      ],
      out: [
        ["rb_ester", "Va bene. Registrato. In campo sono una che sale i gradini due alla volta: se mi metti in difesa, ti difendo come un faro. Ferma, e visibile."],
        ["leo", "E se ti serve tornare su?"],
        ["rb_ester", "Allora salgo. Centotredici gradini: il resto del campo, in confronto, è in piano."],
      ],
      after: ["«Il registro sta in cima. Se vuoi, la prossima volta salgo con te: due gradini alla volta, tu uno, io due, ci vediamo al centocinque.»", "«La riga della Rondine è ancora lì. A volte, la sera, la rileggo: è una cosa che fa luce anche senza lampada.»", "«Il faro è stato la mia prima squadra, in un certo senso: ci sono io, c'è la lampada, c'è il mare. Adesso siamo di più.»"],
      pres: "«Ester ha scritto la Rondine nel registro del faro. Siamo l'unica società con un posto fisso su una pagina di tela e una luce che ci guarda.»",
      dina: "«Ester sale centotredici gradini due volte al giorno. Io, al mattino, ne salgo quattro. Quando posso, mi appoggio alla ringhiera.»",
      ner: "Annuncio: la guardiana del faro di Capo Ventoso è in squadra. Ripeto: in squadra. La luce, dicono, resterà accesa per tutti gli altri.",
    },
    {
      id: "ondina", npc: "rb_teo", zone: "puntanera", at: [9, 12], ep: "bellavista", dir: "ondina", cage: null, who: "Ondina",
      title: "Il Catino è piccolo", sub: "Teo, il fratello di Ondina, e due pali fatti di secchi",
      hello: "«Ah, il Mister! Teo, fratello di Ondina e suo preparatore ufficiale e non pagato. Mia sorella è in porta dal mattino. Tu hai l'aria di uno che tira bene e perde col sorriso.»",
      intro: [
        ["voce", "Al Catino di Punta Nera, tra le righe di calce smorzate dal vento, Ondina saltella tra due pali fatti di secchi di vernice. Il fratello, più grande di quattro anni (giura), regge un pallone e un fischietto che non fischia."],
        ["rb_teo", "La regola del Catino: se sbaglia lei, è colpa sua. Se sbaglio io, è colpa sua. E se non sbaglia nessuno, è colpa del vento."],
        ["ondina", "Il vento. Obiettivamente è colpa del vento."],
        ["rb_teo", "Mister, ti dico una cosa che non dico in giro: lei para anche i miei compiti. Ma il Catino è piccolo. Se avesse una squadra come la tua, io... non la terrei qui. Però deve sentirselo dire da uno che non sono io."],
        ["ondina", "Sono qui, sai?"],
      ],
      q: "Teo ti passa il pallone: «Tre tiri. Dì dove vuoi tirare, e Ondina dirà dove andrà a finire.»",
      opts: [
        { label: "Angolo basso, a destra", sub: "Il classico, con un pizzico di scaramanzia", tone: 1, lines: [
          ["voce", "Leo tira. Ondina, che aveva già annunciato «angolo basso, a destra», è già lì ad aspettarlo con le mani giunte come in preghiera."],
          ["ondina", "Lo sapevo. Dalla tua scarpa sinistra si legge tutto."],
          ["voce", "Altri due tiri, altri due «lo sapevo». Teo sospira: «Ha ragione. È la cosa più fastidiosa del suo carattere.»"],
        ] },
        { label: "Dritto per dritto, al centro", sub: "Un tiro per dire «mi fido»", tone: 2, lines: [
          ["leo", "Tiro al centro. Se lo prendi, ti chiedo di venire in squadra."],
          ["voce", "Ondina non si muove di un millimetro. Il pallone le arriva in pancia, e lei lo stringe con un'aria offesa e felice insieme."],
          ["ondina", "Ho aspettato fermo per fiducia: una parata coraggiosa. Nessuno tira al centro, perché nessuno si fida. Tu sì. È una cosa che mi ricordo."],
        ] },
        { label: "Chiedi a lei dove tirare", sub: "Prima la domanda, poi il tiro", tone: 3, lines: [
          ["leo", "Ondina, dove vuoi che tiri?"],
          ["ondina", "...Nessuno me l'ha mai chiesto. Di solito tirano e basta."],
          ["voce", "Ondina indica l'angolo alto a sinistra: «Lì. Così ci arrivo in tuffo e faccio scena». Leo tira lì. Ondina vola, para, atterra con una capriola. Teo, in tribuna, applaude da solo."],
        ] },
      ],
      out: [
        ["rb_teo", "Il Catino è piccolo, ma lei no. Portala via, Mister. Se torna con un trofeo, lo metto sul tetto dei secchi."],
        ["ondina", "Se ti dico di sì, non è perché mi hai fatto gol: non l'hai fatto. È perché mi hai fatto una domanda. Entro. In porta, titolare. A Sandro lascio un biglietto: «Tieni i guanti caldi»."],
        ["leo", "E Nico?"],
        ["ondina", "Non dico niente a Nico. Se mi vede in squadra, gli prendo il posto in tutte le foto."],
      ],
      after: ["«Ondina mi ha scritto dalla Rondine: «Ho avuto ragione sul vento». Sono fiero di lei, e un po' invidioso del vento.»", "«Quando è partita, ho sistemato i secchi. Per dieci minuti ho avuto il Catino tutto per me, e non sapevo più cosa farne.»", "«Dice di averti battuto nel nostro ultimo tiro. Io ho visto tutto. Ha ragione. Non lo ammetto mai.»"],
      pres: "«Ondina in porta, Sandro in panchina con il biglietto. L'ho letto: dice «tieni i guanti caldi». Ho capito che parlava dei guanti.»",
      dina: "«Teo ha telefonato per chiedere se il Catino è piccolo. Gli ho risposto che dipende dal punto di vista e dal vento.»",
      ner: "Annuncio: dal Catino di Punta Nera è partita una portiera. Ripeto: una portiera. Il vento, dicono, ha chiesto di andare con lei.",
    },
  ];

  function byId(id) { for (var i = 0; i < MS.length; i++) if (MS[i].id === id) return MS[i]; return null; }
  function byNpc(id) { for (var i = 0; i < MS.length; i++) if (MS[i].npc === id) return MS[i]; return null; }

  // ---------------------------------------------------------------- stato in lettura (tutto protetto)
  function safe(fn, d) { try { var v = fn(); return v === undefined ? d : v; } catch (e) { return d; } }
  function recruited(m) {
    var dir = window.__directorHd, cg = window.__cageHd;
    if (m.dir && dir && typeof dir.recruited === "function" && safe(function () { return dir.recruited(m.dir); }, false)) return true;
    if (m.cage && cg && typeof cg.recruited === "function" && safe(function () { return cg.recruited(m.cage); }, false)) return true;
    return false;
  }
  var epCache = { t: 0, v: null };
  function epOpen(m) {
    var dir = window.__directorHd;
    if (!dir || typeof dir.episodes !== "function") return false;
    var t = Date.now();
    if (!epCache.v || t - epCache.t > 1200) { epCache.t = t; epCache.v = safe(function () { return dir.episodes(); }, []) || []; }
    for (var i = 0; i < epCache.v.length; i++) if (epCache.v[i].id === m.ep) return !!epCache.v[i].open;
    return false;
  }
  function available(m) { return !!mem().done[m.id] || recruited(m) || epOpen(m); }
  function newsFor(m) { return !mem().done[m.id] && available(m); }

  // ---------------------------------------------------------------- avvio
  function init() {
    var api = window.__borgoApi;
    if (!api || !api.TRZ || !api.CAST) { if (++tries < 200) setTimeout(init, 200); return; }
    var need = MS.filter(function (m) { return !api.TRZ[m.zone]; });
    if (need.length && ++tries < 120) { setTimeout(init, 200); return; }
    var TRZ = api.TRZ, CAST = api.CAST, L = api.L;

    // ------------------------------------------------------------ personaggi (id propri: nessun conflitto con "brando", "ester", "osvaldo"... del Borgo)
    function cast(id, base, over) { if (!CAST[id]) CAST[id] = Object.assign({}, base || {}, over || {}); }
    cast("rb_brando", CAST.brando || { tag: "blue", hair: "#e8d08a", style: "slick", skin: "#c98a5a", eye: "#1a1a1a", bg: ["#ff7a45", "#9be2ff"], shirt: "#ff4d5a" }, { name: "Brando il bagnino" });
    cast("rb_ester", CAST.ester || { tag: "blue", hair: "#3a2a1a", style: "long", skin: "#eec39c", eye: "#1f3a63", bg: ["#16325c", "#ffe7a0"], shirt: "#16325c" }, { name: "Ester" });
    cast("rb_mimi", null, { name: "Mimì", tag: "gold", hair: "#1f1a17", style: "codino", skin: "#e8b88c", eye: "#2a1a0a", bg: ["#eab308", "#fff4c2"], shirt: "#eab308" });
    cast("rb_zoe", null, { name: "Zoe", tag: "orange", hair: "#7c2d12", style: "long", skin: "#d9a679", eye: "#2a1a0a", bg: ["#ec4899", "#fdf2f8"], shirt: "#ec4899" });
    cast("rb_otello", null, { name: "Otello", tag: "gray", hair: "#111827", style: "buzz", skin: "#8d5524", eye: "#1a1208", bg: ["#334155", "#fb923c"], beard: true, cap: "#334155", shirt: "#334155" });
    cast("rb_nina", null, { name: "Nina", tag: "green", hair: "#3b2314", style: "bun", skin: "#e8b88c", eye: "#2a1a0a", bg: ["#16a34a", "#ecfccb"], shirt: "#16a34a" });
    cast("rb_teo", null, { name: "Teo, il fratello di Ondina", tag: "blue", hair: "#2b1d14", style: "messy", skin: "#f2c9a0", eye: "#1f3a63", bg: ["#0a3a4a", "#9be2ff"], shirt: "#19a0b8" });

    // ------------------------------------------------------------ carte dell'album (si sbloccano solo quando il PNG parla)
    // rb_brando e rb_ester sono le stesse persone di "brando" ed "ester" (carte già esistenti): si sblocca quella.
    var BIOX = {
      rb_mimi: "Fattorina in bici del molo, con una bici gialla dai freni offesi e un tubo di cartone per ogni sera. Conosce ogni indirizzo del Borgo, tranne quello di chi aspetta qualcosa.",
      rb_zoe: "Consegna i gelati dello Scoglio in bici, in salita, controvento, con un cono che dura quattro minuti e una strada che ne dura sei. Dice che la Gabbia è troppo piana.",
      rb_otello: "Scaricatore del molo, Osvaldo sulla carta d'identità e Otello da undici anni, per colpa di una cassa. Se c'è da fare muro, lo fa lui: non per merito, per ingombro.",
      rb_nina: "Ripara biciclette al Colle dei Mulini, tra un mulo e nessuna fretta. Conosce l'angolo di ogni raggio, quindi anche quello di ogni sponda, e ha un problema di precedenze con le ruote storte.",
      rb_teo: "Fratello di Ondina e suo preparatore ufficiale e non pagato. Ha costruito i pali del Catino con due pile di secchi e tira fuori consigli a ogni parata, anche quando non servono.",
    };
    if (api.BIO) Object.keys(BIOX).forEach(function (k) { if (!api.BIO[k]) api.BIO[k] = BIOX[k]; });
    var CARD_OF = { rb_brando: "brando", rb_ester: "ester" };
    function meet(npc) { try { if (api.seeCard) api.seeCard(CARD_OF[npc] || npc); } catch (e) { /* ignora */ } }

    // ------------------------------------------------------------ PNG sulle mappe (visibili solo con progresso esistente)
    MS.forEach(function (m) {
      var z = TRZ[m.zone]; if (!z) return;
      z.npcs = z.npcs || [];
      if (!z.npcs.some(function (n) { return n.id === m.npc; })) z.npcs.push({ id: m.npc, at: m.at.slice(), when: function () { return available(m); } });
    });

    // ------------------------------------------------------------ dialoghi
    function ln(arr) { return arr.map(function (r) { return L(r[0], r[1]); }); }
    function note(m) { var d = mem().done[m.id]; return d || null; }

    function talk(m) {
      var d = note(m);
      if (!d) {
        var already = recruited(m);
        return api.trAsk(m.npc, m.hello, [
          { label: m.title, sub: already ? "Storia di retroscena · " + m.who + " è già in squadra" : "Una breve storia · " + m.who + " potrebbe entrare in squadra", cls: "hot", fn: function () { start(m, false); } },
        ]);
      }
      var opts = [
        { label: "Rivivi la storia", sub: m.title + " · retroscena", fn: function () { start(m, true); } },
        { label: "Due parole", sub: "Cosa dice " + m.who + " adesso", fn: function () { chat(m); } },
      ];
      api.trAsk(m.npc, m.id === "ondina" ? "«Mister! Il Catino senza mia sorella è silenzioso. Per fortuna c'è il vento.»" : "«Mister, ben tornato. " + m.who + ": una storia che resta.»", opts);
    }
    function chat(m) {
      var d = note(m), a = m.after[d && d.c >= 0 && d.c < m.after.length ? d.c : 0];
      api.trSay([L(m.npc, a)], api.trResume);
    }
    function start(m, replay) {
      api.trSay(ln(m.intro), function () {
        api.trAsk(m.npc, m.q, m.opts.map(function (o, i) { return { label: o.label, sub: o.sub, cls: "hot", fn: function () { choose(m, i, replay); } }; }));
      });
    }
    function choose(m, i, replay) {
      var o = m.opts[i];
      api.trSay(ln(o.lines).concat(ln(m.out)), function () { finish(m, i, replay); });
    }
    function coins(n) { if (n > 0 && typeof window.addCoins === "function") { try { window.addCoins(n); return n; } catch (e) { return 0; } } return 0; }
    function finish(m, i, replay) {
      var s = mem(), d = s.done[m.id], msg;
      if (d) {
        api.trResume(); api.trToast(m.title + " · retroscena riletto");
        return;
      }
      var was = recruited(m), joined = false;
      if (!was) {
        if (m.dir && window.__directorHd && typeof window.__directorHd.recruit === "function") joined = !!safe(function () { return window.__directorHd.recruit(m.dir); }, false) || joined;
        if (m.cage && window.__cageHd && typeof window.__cageHd.recruit === "function") joined = !!safe(function () { return window.__cageHd.recruit(m.cage); }, false) || joined;
      }
      var gained = coins(was ? 3 : 6);
      s.done[m.id] = { c: i, was: was ? 1 : 0, j: joined ? 1 : 0, k: gained, t: Date.now() };
      memSet(s); epCache.v = null;
      msg = was ? "Retroscena di " + m.who + (gained ? " · +" + gained + " monete" : "") : m.who + " entra in squadra" + (gained ? " · +" + gained + " monete" : "");
      api.trResume(); api.trToast(msg);
    }

    // ------------------------------------------------------------ hook trTalkHook (solo i propri id; mai il getter dentro la funzione)
    var desc = Object.getOwnPropertyDescriptor(window, "trTalkHook");
    var chained = !(desc && desc.set); // con accessor (cage-borgo.js) la catena la fa il setter
    var prev = chained ? window.trTalkHook : null;
    window.trTalkHook = function (id) {
      var m = byNpc(id);
      if (m) { meet(m.npc); talk(m); return true; }
      return chained && typeof prev === "function" ? prev(id) : false;
    };
    // il "!" sopra il PNG: usato solo se game.js legge window.trNewsHook (patch proposta); altrimenti nessun effetto
    var prevNews = window.trNewsHook;
    window.trNewsHook = function (id) {
      var m = byNpc(id);
      if (m) return newsFor(m);
      return typeof prevNews === "function" ? prevNews(id) : null;
    };

    // ------------------------------------------------------------ API per le battute di Spigola / Dina / Nereo e per i test
    window.__recluteBorgo = {
      version: 1,
      missions: function () { return MS.map(function (m) { return { id: m.id, npc: m.npc, zone: m.zone, at: m.at.slice(), ep: m.ep, available: available(m), done: !!mem().done[m.id], recruited: recruited(m) }; }); },
      info: function () { var d = mem().done; return { done: Object.keys(d).length, total: MS.length, ready: MS.filter(function (m) { return newsFor(m); }).length }; },
      // battute da aggiungere alle chiacchiere: who = "pres" | "dina" | "nereo"; una per ogni missione completata
      chat: function (who) {
        var d = mem().done, k = who === "nereo" ? "ner" : who;
        return MS.filter(function (m) { return d[m.id] && m[k]; }).map(function (m) { return { need: function () { return true; }, t: [m[k]] }; });
      },
    };
    if (DEBUG) window.__recluteBorgo._reset = function () { memSet({ done: {} }); epCache.v = null; };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
