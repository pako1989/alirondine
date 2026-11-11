// js/foto58.js - «LA FOTO DEL '58» · configurazione della saga sul motore comune (js/saga-core.js). Giallo malinconico e adulto, a flashback (deduzione alla «chi è chi»).
// Oggi, all'Archivio del Borgo, in una scatola di latta: la foto di squadra dell'U.S. Rondine 1958. Undici titolari, due riserve, l'allenatore, il massaggiatore.
// Un volto è graffiato via. Sul retro, a matita: «Nessuno tornò uguale». Con la vecchia macchina a soffietto di Nando Brizzi, il massaggiatore-fotografo,
// i negativi si «aprono»: entri nei momenti congelati di quel viaggio (la partenza, la curva del Passo, l'albergo, la galleria, il ritorno) e ascolti l'ultima frase di ognuno.
// Tono: malinconico e maturo (morti, colpe vecchie di settant'anni, niente gore e niente minori in pericolo); ironia affettuosa nei ricordi di spogliatoio.
// Dal core: Rapporti (Viola, Ilario, Rina, Mauro), Inventario (fotogrammi, carte d'archivio, regali), Peso morale (Verità e Pietà), dialoghi a scelta, K.minigame, K.playMatch,
// interni a mano, finali multipli con un segreto, Registro (lore), ospite al Borgo.
// Novità del core portata da questa saga: IL TACCUINO (cfg.deduce): volti × attributi (chi è, che fine ha fatto), conferma solo a terne giuste. K.deduce.see/learn/note/set/open.
// Motore nuovo: LA CAMERA OSCURA (js/cameraoscura.js): sviluppare un negativo prima che si annerisca, dicendo chi è chi con gli indizi (anche cabinato in Sala Giochi).
// Scene ferme («Il Negativo»): spec.frozen = true → la zona è in seppia, i personaggi sono immobili a metà gesto, e il solo colore è il granata della Rondine (numeri di maglia, fiocchi).
// Tessere proprie: pavimenti C sampietrini · K neve · % ghiaia della galleria · m pavimento a scacchi · & campo innevato · A asfalto
//   solide U corriera · F fontana · N lapide della piazza · P pino · R roccia · V strapiombo · E edicola votiva · Z parete della galleria · Q frana · I tomba · Y cipresso
//   X bancone · J cavalletto della macchina · h porta del campo · S palina della fermata · k banco della camera oscura · c bacheca
(function () {
  "use strict";
  if (window.__foto58 || !window.__sagaCore) return;
  // ------------------------------------------------------------------------------------------------ i quindici della foto
  // n = nome che si vede finché il volto non è confermato · nome vero, ruolo, aspetto (K.cast) e tratti per la Camera Oscura
  const P58 = {
    f5_amedeo: { n: "L'uomo con gli occhiali", real: "Amedeo Laurenti", role: "L'allenatore («il Professore»)", c: { style: "ordinato", hair: "#57534e", shirt: "#44403c", skin: "#e8c4a0", eye: "#292524", acc: ["occhiali"], bg: ["#292524", "#d6c9ad"] }, look: { occhiali: true, coach: true, hair: 1 } },
    f5_carmine: { n: "Il capitano", real: "Carmine Abate", role: "Il 5, centromediano e capitano", c: { style: "curly", hair: "#1c1917", shirt: "#7f1d1d", skin: "#d9a679", eye: "#1c1917", acc: ["fascia"], bg: ["#450a0a", "#d6c9ad"] }, look: { fascia: true, hair: 0 } },
    f5_rocco: { n: "Quello coi baffi", real: "Rocco Danzi", role: "Il 4, mediano", c: { style: "buzz", hair: "#292524", shirt: "#7f1d1d", skin: "#c8956a", eye: "#1c1917", beard: "baffi", bg: ["#450a0a", "#d6c9ad"] }, look: { baffi: true, hair: 0, skin: 2 } },
    f5_guido: { n: "Il portiere col berretto", real: "Guido Ferri", role: "Il 1, portiere", c: { style: "side", hair: "#44403c", shirt: "#a8a29e", skin: "#e0b48a", eye: "#292524", acc: ["berretto", "guanti"], bg: ["#44403c", "#e7e5e4"] }, look: { hat: true, portiere: true, hair: 1 } },
    f5_ottavio: { n: "Il terzino con la barba", real: "Ottavio Mancuso", role: "Il 3, terzino", c: { style: "messy", hair: "#3f2a1a", shirt: "#7f1d1d", skin: "#d9a679", eye: "#292524", beard: "incolta", bg: ["#450a0a", "#d6c9ad"] }, look: { barba: true, hair: 1, skin: 1 } },
    f5_bepi: { n: "Quello con la cicatrice", real: "Bepi Cozzolino", role: "Il 2, terzino", c: { style: "slick", hair: "#1c1917", shirt: "#7f1d1d", skin: "#e0b48a", eye: "#1c1917", scar: true, bg: ["#450a0a", "#d6c9ad"] }, look: { hair: 0 } },
    f5_nando: { n: "L'uomo con la borsa", real: "Nando Brizzi", role: "Il massaggiatore (e fotografo)", c: { style: "bald", hair: "#a8a29e", shirt: "#57534e", skin: "#e8c4a0", eye: "#292524", acc: ["borsa", "sciarpa"], bg: ["#292524", "#d6c9ad"] }, look: { sciarpa: true, coach: true, hair: 3 } },
    f5_libero: { n: "Il ciuffo", real: "Libero Sanna", role: "Il 6, mediano", c: { style: "pompadour", hair: "#1c1917", shirt: "#7f1d1d", skin: "#e8c4a0", eye: "#292524", bg: ["#450a0a", "#d6c9ad"] }, look: { hair: 0 } },
    f5_tonino: { n: "Il ragazzo che ride", real: "Tonino Perrella", role: "Il 7, ala destra", c: { style: "messy", hair: "#57534e", shirt: "#7f1d1d", skin: "#d9a679", eye: "#292524", bg: ["#450a0a", "#d6c9ad"] }, look: { hair: 1, skin: 1 } },
    f5_gigi: { n: "Quello col pizzetto", real: "Gigi Valtorta", role: "L'8, mezzala («il milanese»)", c: { style: "side", hair: "#78716c", shirt: "#7f1d1d", skin: "#f1d1b0", eye: "#44403c", beard: "pizzetto", bg: ["#450a0a", "#d6c9ad"] }, look: { barba: true, hair: 2 } },
    f5_renzo: { n: "Il Nove", real: "Renzo Maffei", role: "Il 9, centravanti", c: { style: "wavy", hair: "#292524", shirt: "#7f1d1d", skin: "#d9a679", eye: "#1c1917", bg: ["#450a0a", "#d6c9ad"] }, look: { hair: 0, skin: 1 } },
    f5_dario: { n: "Quello con la medaglietta", real: "Dario Coletti", role: "Il 10, mezzala", c: { style: "ordinato", hair: "#57534e", shirt: "#7f1d1d", skin: "#e8c4a0", eye: "#292524", acc: ["medaglia"], bg: ["#450a0a", "#d6c9ad"] }, look: { hair: 1 } },
    f5_sante: { n: "Quello con la sciarpa", real: "Sante Mori", role: "L'11, ala sinistra", c: { style: "curly", hair: "#78716c", shirt: "#7f1d1d", skin: "#d9a679", eye: "#292524", acc: ["sciarpa"], bg: ["#450a0a", "#d6c9ad"] }, look: { sciarpa: true, hair: 2, skin: 1 } },
    f5_ilario58: { n: "Il ragazzo coi guanti", real: "Ilario Gentile", role: "Il 12, portiere di riserva", c: { style: "curly", hair: "#44403c", shirt: "#7f1d1d", skin: "#f1d1b0", eye: "#1c1917", acc: ["guanti"], bg: ["#450a0a", "#d6c9ad"] }, look: { hair: 1 } },
    f5_nicolino: { n: "Il più piccolo", real: "Nicola «Nicolino» Russo", role: "Il 13, riserva", c: { style: "buzz", hair: "#57534e", shirt: "#7f1d1d", skin: "#e0b48a", eye: "#292524", acc: ["cappellino"], bg: ["#450a0a", "#d6c9ad"] }, look: { hat: true, hair: 1 } }
  };
  // la foto: posizione dei volti (prima fila in piedi, seconda in ginocchio, due seduti per terra)
  const PHOTO = [
    ["f5_amedeo", "In piedi, 1° da sinistra · giacca e cravatta"], ["f5_carmine", "In piedi, 2° · la fascia al braccio"], ["f5_rocco", "In piedi, 3° · i baffi"],
    ["f5_guido", "In piedi, 4° · la maglia chiara e il berretto"], ["f5_ottavio", "In piedi, 5° · la barba di tre giorni"], ["f5_bepi", "In piedi, 6° · la cicatrice sul sopracciglio"],
    ["f5_nando", "In piedi, 7° · mosso: sta arrivando di corsa"], ["f5_libero", "In ginocchio, 1° · il ciuffo"], ["f5_tonino", "In ginocchio, 2° · ride"],
    ["f5_gigi", "In ginocchio, 3° · il pizzetto"], ["f5_renzo", "In ginocchio, 4° · il volto graffiato"], ["f5_dario", "In ginocchio, 5° · una medaglietta al collo"],
    ["f5_sante", "In ginocchio, 6° · la sciarpa"], ["f5_ilario58", "Seduto per terra, a sinistra · i guanti"], ["f5_nicolino", "Seduto per terra, a destra · il berretto"]
  ];
  const ANS = { f5_amedeo: "maestro", f5_carmine: "allenatore", f5_rocco: "belgio", f5_guido: "argentina", f5_ottavio: "galleria", f5_bepi: "sposato", f5_nando: "fotografo", f5_libero: "barbiere",
    f5_tonino: "torino", f5_gigi: "serieb", f5_renzo: "rosario", f5_dario: "prete", f5_sante: "svizzera", f5_ilario58: "vivo", f5_nicolino: "carabiniere" };
  const WHO = { f5_amedeo: "amedeo", f5_carmine: "carmine", f5_rocco: "rocco", f5_guido: "guido", f5_ottavio: "ottavio", f5_bepi: "bepi", f5_nando: "nando", f5_libero: "libero", f5_tonino: "tonino", f5_gigi: "gigi", f5_renzo: "renzo", f5_dario: "dario", f5_sante: "sante", f5_ilario58: "ilario", f5_nicolino: "nicolino" };
  const FATES = { maestro: "Maestro elementare", allenatore: "Allenatore della Rondine", belgio: "Emigrato in Belgio", argentina: "Emigrato in Argentina", galleria: "Morto nella galleria, 1958", sposato: "Sposò Rina Abate",
    fotografo: "Fotografo di matrimoni", barbiere: "Barbiere al Borgo", torino: "Operaio a Torino", serieb: "Professionista in Serie B", prete: "Prete", svizzera: "Morto in Svizzera, 1963", vivo: "Ancora vivo", carabiniere: "Carabiniere",
    rosario: "Visse a Rosario con un altro nome", sparito: "Sparito nella neve" };
  // ------------------------------------------------------------------------------------------------ IL NEGATIVO: chi c'è in ogni scena ferma e la sua ultima frase
  // [id, x, y, ultima frase, opzioni: { back: numero visto di spalle, d: didascalia di quello che sta facendo }]
  const FZ = {
    f5_piazza58: { t: "La partenza", list: [
      ["f5_amedeo", 13, 13, "Ragazzi, sorridete come se aveste già vinto. Poi, domenica, vinciamo davvero.", { d: "Gli occhiali sul naso, la mano sulla spalla del capitano." }],
      ["f5_carmine", 14, 13, "Nove, stai dritto. Sei il centravanti, non un attaccapanni.", { d: "La fascia al braccio. Guarda in basso, verso la prima fila." }],
      ["f5_rocco", 15, 13, "Professore, si sposti di un dito, che mi copre il baffo buono.", { d: "Si liscia i baffi con due dita." }],
      ["f5_guido", 16, 13, "Nando, il berretto non me lo tolgo. In porta fa freddo anche in fotografia.", { d: "Maglia chiara da portiere, berretto calcato." }],
      ["f5_ottavio", 17, 13, "Bepi, se mi pesti ancora il piede, domenica ti marco io.", { d: "Fa una smorfia: qualcuno gli sta sul piede." }],
      ["f5_bepi", 18, 13, "Ottavio, guarda di lato. La Rina mi guarda? Dimmi che mi guarda.", { d: "Sorride storto, ma non verso l'obiettivo." }],
      ["f5_nando", 19, 13, "Dieci secondi! Non respirate! Guido, il berretto! Ilario e Nicolino, per terra, che siete gli ultimi arrivati!", { d: "Mosso: corre a mettersi in posa, la borsa a tracolla." }],
      ["f5_libero", 13, 14, "Tonino, il ciuffo com'è? Mio padre fa il barbiere: non posso uscire spettinato.", { d: "In ginocchio, si tocca il ciuffo." }],
      ["f5_tonino", 14, 14, "Libero, il ciuffo è perfetto. Sembri Rodolfo Valentino dopo una rissa.", { d: "Ride. È l'unico che ride davvero." }],
      ["f5_gigi", 15, 14, "Ma che freddo fa, in questo paese. A Milano almeno c'è la nebbia, che scalda.", { d: "Il bavero alzato, il pizzetto curato." }],
      ["f5_renzo", 16, 14, "Sorridi, Renzo. Sorridi, che magari è l'ultima.", { d: "Il centravanti. Nella foto dell'archivio, qui, c'è solo un graffio." }],
      ["f5_dario", 17, 14, "Signore, fa' che domenica non piova. E se piove, fa' che piova su di loro.", { d: "Stringe la medaglietta della Madonna." }],
      ["f5_sante", 18, 14, "Dario, prega pure per me, che ho le scarpe rotte. Quando vado in Svizzera me ne compro tre paia.", { d: "La sciarpa di lana fatta in casa." }],
      ["f5_ilario58", 12, 15, "Mamma ha detto di non sporcarmi i calzoni. Sono gli unici.", { d: "Seduto per terra, i guanti da portiere in mano." }],
      ["f5_nicolino", 19, 15, "Ilario, scansati, che mi copri. Io in fotografia ci vengo una volta sola.", { d: "Il più piccolo, il berretto storto." }],
      ["f5_rina58", 23, 14, "Bepi Cozzolino, se guardi me invece della macchina rovini la foto. E poi la rovini a me.", { d: "Diciannove anni, il cappotto della madre." }],
      ["f5_peppino", 21, 12, "Si parte alle sette e mezza. Chi non c'è, resta. Chi resta, non vince.", { d: "L'autista della corriera, la cicca spenta in bocca." }]
    ] },
    f5_curva: { t: "La curva del Passo", list: [
      ["f5_renzo", 20, 10, "Io all'osservatore non ho chiesto niente! È lui che ha chiesto di me!", { d: "Il Nove. Il pugno chiuso, la giacca strappata." }],
      ["f5_carmine", 21, 10, "Qui si gioca in undici, Renzo. Non in uno e dieci comparse.", { d: "Il capitano. Lo ha appena spinto." }],
      ["f5_bepi", 19, 11, "Carmine, basta! Ottavio, tienilo tu che io tengo questo!", { d: "Si mette in mezzo." }],
      ["f5_ottavio", 22, 11, "Lo tengo, lo tengo. Ma chi tiene me?", { d: "Abbraccia il capitano da dietro, la barba piena di neve." }],
      ["f5_rocco", 17, 11, "Professore, li separo io o aspettiamo che si stanchino?", { d: "I baffi bianchi di brina." }],
      ["f5_amedeo", 14, 11, "Danzi, lasciali! Chi si picchia oggi, domenica sta in tribuna!", { d: "Il Professore, sulla porta della corriera." }],
      ["f5_tonino", 5, 6, "Non guardate! È un'emergenza nazionale!", { d: "Dietro un masso. Ride anche adesso." }],
      ["f5_ilario58", 15, 12, "…Mamma, siamo quasi arrivati. Scrivo domani.", { d: "Seduto sul predellino, scrive una cartolina." }],
      ["f5_dario", 27, 7, "Madonnina del Passo, tienili tu, che io non ci arrivo.", { d: "Davanti all'edicola votiva, il cappello in mano." }],
      ["f5_guido", 25, 12, "Da qui si vede il mare. O è la nebbia. Comunque è lontano.", { d: "Il portiere guarda la valle." }],
      ["f5_gigi", 9, 13, "Sante, questa neve è più bagnata di quella di Milano.", { d: "Prepara una palla di neve." }],
      ["f5_sante", 11, 14, "Gigi, a Milano non nevica: piove grigio.", { d: "Schiva. La sciarpa gli vola di lato." }],
      ["f5_nicolino", 8, 15, "Gigi, prendi me! Prendi me che sono piccolo!", { d: "Ha già la neve nel colletto." }],
      ["f5_peppino", 23, 9, "Gomma nuova, catene nuove, e a giugno la pensione. Se ci arrivo.", { d: "L'autista, inginocchiato vicino alla ruota." }]
    ] },
    f5_albergo: { t: "La semifinale nella neve", list: [
      ["f5_guido", 17, 15, "Tutti dietro! Questi tirano anche da metà campo!", { back: 1, d: "Tra i pali, le mani aperte." }],
      ["f5_bepi", 19, 12, "Il loro sette è veloce, ma inciampa nei suoi piedi.", { back: 2, d: "Di spalle: il numero 2 cucito storto." }],
      ["f5_ottavio", 19, 19, "Palla lunga, Carmine! Lunga!", { back: 3, d: "Di spalle: il 3, la neve fino alle caviglie." }],
      ["f5_rocco", 21, 15, "Ce l'ho! Ce l'ho! …Non ce l'ho.", { back: 4, d: "Di spalle: il 4." }],
      ["f5_carmine", 23, 17, "Su, Rondine! Su che il campo è uguale per tutti!", { back: 5, d: "Di spalle: il 5 e la fascia." }],
      ["f5_libero", 20, 17, "Non mi sporco. Non mi sporco. Mi sono sporcato.", { back: 6, d: "Di spalle: il 6. Il ciuffo resiste." }],
      ["f5_tonino", 23, 12, "Gigi! Gigi, all'incrocio! Come al bar!", { back: 7, d: "Di spalle: il 7, in corsa." }],
      ["f5_gigi", 25, 15, "Tonino, al bar si tira coi tappi. Qui coi piedi gelati.", { back: 8, d: "Di spalle: l'8." }],
      ["f5_renzo", 27, 14, "Palla a me. Palla a me e domani il Brianza mi compra.", { back: 9, d: "Di spalle: il 9. Davanti a lui, la porta." }],
      ["f5_dario", 25, 19, "Renzo, la tua, la tua! Il Signore te la manda!", { back: 10, d: "Di spalle: il 10." }],
      ["f5_sante", 22, 20, "Corro, corro. Ma le scarpe rotte bevono.", { back: 11, d: "Di spalle: l'11, sulla fascia." }],
      ["f5_amedeo", 14, 11, "Ilario, scaldati. Non si sa mai.", { d: "In panchina, il cappotto sulle spalle." }],
      ["f5_nando", 14, 13, "Il ginocchio di Danzi, la caviglia di Mori e la mia schiena: tre feriti e siamo al primo tempo.", { d: "La borsa aperta, la bottiglia di canfora." }],
      ["f5_ilario58", 14, 15, "Io? Io in porta? Professore, ho diciannove anni e due guanti spaiati.", { d: "In piedi davanti alla panchina." }],
      ["f5_nicolino", 14, 17, "Se segniamo io urlo. Se perdiamo io urlo lo stesso.", { d: "Le mani a coppa intorno alla bocca." }],
      ["f5_arbitro", 26, 17, "Si gioca. Finché vedo il pallone, si gioca.", { d: "L'arbitro, nero dalla testa ai piedi nella neve bianca." }]
    ] },
    f5_hall: { t: "La notte all'albergo", list: [
      ["f5_gatti", 12, 4, "Non è un furto, ragazzo. È un pronostico. Io scommetto, tu ti tuffi un attimo dopo.", { d: "Il cappotto di cammello, l'anello al mignolo. Spinge una busta sul tavolo." }],
      ["f5_ilario58", 13, 4, "Quanto? …Va bene. Ma solo se perdiamo lo stesso. Solo se perdiamo lo stesso.", { d: "Il ragazzo coi guanti. Non guarda la busta." }],
      ["f5_renzo", 15, 2, "Ragazzino. Ragazzino, no.", { d: "Il Nove, alla finestra. Ha visto tutto." }],
      ["f5_guido", 3, 3, "Il polso. Sento il polso fare crac come un grissino.", { d: "Sui primi gradini: è appena scivolato sul ghiaccio delle scale di fuori." }],
      ["f5_nando", 4, 4, "Fermo, Guido. Fermo. Domani in porta ci va il ragazzo.", { d: "In ginocchio vicino al portiere, la borsa aperta." }],
      ["f5_amedeo", 5, 1, "Pronto? Il dottore? …Allora mi passi l'ospedale di valle. Sì, aspetto.", { d: "Al telefono a muro, con la cornetta di bachelite." }],
      ["f5_carmine", 16, 7, "…zzz… palla lunga… zzz…", { d: "Addormentato in poltrona, la fascia ancora al braccio." }],
      ["f5_libero", 5, 7, "Scopa! E settebello! Il barbiere vince sempre.", { d: "Al tavolo delle carte." }],
      ["f5_tonino", 6, 8, "Libero, il settebello l'avevi nella manica. Lo dico da amico.", { d: "Al tavolo delle carte." }],
      ["f5_gigi", 4, 8, "Domani c'è l'osservatore del Brianza. Viene per Renzo. Ma vede anche me.", { d: "Le carte in mano, gli occhi alla porta." }],
      ["f5_sante", 1, 5, "Io domani corro scalzo. Tanto le scarpe ormai sono un'opinione.", { d: "Asciuga le scarpe vicino al camino." }],
      ["f5_dario", 1, 7, "…e liberaci dal male, e dalla neve, e dai loro terzini. Amen.", { d: "In ginocchio vicino al camino." }],
      ["f5_rocco", 10, 8, "Ottavio, mi presti venti lire? In Belgio, dicono, si guadagna tanto. Te le rendo da lì.", { d: "Scrive una lettera al tavolino." }],
      ["f5_ottavio", 11, 8, "Rocco, le venti lire tienile. Mandami una cartolina col carbone.", { d: "Fuma la pipa del padre." }],
      ["f5_nicolino", 16, 4, "Ilario? Chi è quel signore? È un osservatore anche lui?", { d: "In pigiama, sulla porta. Ha sete." }],
      ["f5_bepi", 9, 3, "Signorina, una cartolina per il Borgo. Per la Rina Abate. No, niente cuori: si vergogna.", { d: "Alla reception." }]
    ] },
    f5_galleria: { t: "La galleria", list: [
      ["f5_ottavio", 22, 5, "Via, ragazzino! Via di lì! La tengo io!", { d: "Sotto la trave che cede. La regge con le spalle." }],
      ["f5_ilario58", 21, 6, "Renzo, ridammela! Non è tua! Non è…", { d: "Il ragazzo coi guanti. Allunga la mano verso la busta." }],
      ["f5_renzo", 20, 4, "Adesso è mia. Hai capito? Adesso è mia. Corri.", { d: "Il Nove. Stringe la busta. Ha deciso qualcosa." }],
      ["f5_amedeo", 17, 8, "Russo, tieniti al collo. Non guardare indietro. Mai.", { d: "Porta Nicolino in braccio: si è storto la caviglia." }],
      ["f5_nicolino", 18, 8, "Professore, chi c'è rimasto dietro? Chi c'è rimasto?", { d: "In braccio al Professore." }],
      ["f5_peppino", 8, 7, "Fuori! Fuori tutti, la corriera la lascio qui! Che se la tenga la montagna!", { d: "La lanterna alzata, vicino alla corriera ferma." }],
      ["f5_rocco", 27, 5, "Ottavio! Ottavio, vieni!", { d: "Si è voltato. Sta per tornare indietro." }],
      ["f5_carmine", 33, 6, "Contateli! Contate quanti siamo!", { d: "Il capitano, vicino all'uscita." }],
      ["f5_bepi", 35, 7, "Tredici… quattordici… manca… mancano…", { d: "Conta sulle dita." }],
      ["f5_tonino", 31, 4, "Non ridete. Stavolta non ridete.", { d: "Senza fiato. Non ride." }],
      ["f5_gigi", 36, 5, "La luce! Di là c'è la luce!", { d: "Indica l'uscita." }],
      ["f5_libero", 32, 8, "Il ciuffo, chi se ne frega del ciuffo. Rocco, torna qui!", { d: "Tira Rocco per la giacca." }],
      ["f5_sante", 38, 6, "Fuori! Sono fuori! Sono fuori!", { d: "Il primo a uscire." }],
      ["f5_dario", 29, 7, "Signore, prendi me. Prendi me, ma lascia lui.", { d: "In ginocchio sulla ghiaia." }],
      ["f5_guido", 30, 8, "Col polso rotto non tiro su niente. Non tiro su niente!", { d: "Il braccio al collo." }]
    ] },
    f5_neve: { t: "Fuori dalla galleria", list: [
      ["f5_renzo", 26, 3, "Dite che sono stato io. Ditelo. Così è finita.", { d: "Il Nove, lontano, sul pendio. Si è voltato un'ultima volta." }],
      ["f5_carmine", 8, 10, "Renzo! Dove vai? Renzo, torna giù!", { d: "Le mani a coppa." }],
      ["f5_amedeo", 6, 12, "Lasciatelo andare. Prima contiamo i vivi.", { d: "Il Professore, Nicolino seduto sulla neve accanto." }],
      ["f5_ilario58", 10, 13, "…", { d: "Il ragazzo coi guanti. Non parla. Guarda la galleria." }],
      ["f5_rocco", 4, 9, "Torno dentro. Lasciatemi, torno dentro!", { d: "Lo tengono in due." }],
      ["f5_dario", 12, 11, "L'eterno riposo… no. No, non ancora. Non lo dico.", { d: "Il cappello in mano, la neve sulle spalle." }]
    ] },
    f5_ritorno: { t: "Il ritorno", list: [
      ["f5_presidente", 6, 9, "Il nove non è mai esistito. Nando, dammi la fotografia. E un temperino.", { d: "Il commendator Bassi, presidente della Rondine, sulla porta della Sede." }],
      ["f5_rina58", 14, 14, "Bepi. Bepi Cozzolino. Se mi lasci un'altra volta per una partita, ti sposo per vendetta.", { d: "Abbraccia uno con la cicatrice." }],
      ["f5_bepi", 15, 14, "Allora parto domani.", { d: "Piange e ride insieme." }],
      ["f5_assunta", 21, 13, "Dov'è Ottavio? Fatemi passare. Dov'è il mio Ottavio?", { d: "Una donna col fazzoletto nero, davanti alla porta della corriera." }],
      ["f5_ilario58", 20, 12, "Sono stato io. Sono stato io, e nessuno lo saprà mai.", { d: "L'ultimo a scendere. Gli occhi a terra." }],
      ["f5_carmine", 12, 13, "La coppa la vince chi torna. Noi siamo tornati in dodici.", { d: "La fascia in mano." }],
      ["f5_amedeo", 17, 14, "Domani c'è scuola. Domani c'è scuola lo stesso.", { d: "Si toglie gli occhiali, li pulisce, li rimette." }],
      ["f5_tonino", 10, 10, "Basta pallone. Vado a Torino, da mio cugino. Là le gallerie le fanno di cemento.", { d: "Seduto sul bordo della fontana." }],
      ["f5_gigi", 10, 15, "L'osservatore mi ha lasciato il biglietto. Il Brianza. Me. Non so se esserne contento.", { d: "Con la valigia di cartone." }],
      ["f5_libero", 4, 18, "Papà, la bottega. Me la insegni? Il pallone non lo voglio vedere più.", { d: "Davanti al barbiere, col padre." }],
      ["f5_dario", 19, 6, "Ho fatto una promessa, là sotto. Adesso devo mantenerla.", { d: "Sui gradini della chiesa." }],
      ["f5_sante", 24, 16, "In Svizzera fanno una diga. Cercano gente che non ha paura del buio.", { d: "Fuma, e trema." }],
      ["f5_guido", 22, 15, "Mio zio ha scritto da Buenos Aires. Dice che là i portieri li pagano.", { d: "Il braccio al collo." }],
      ["f5_rocco", 9, 13, "Charleroi. Si dice Sciarlruà. Ci vado anche se non so dirlo.", { d: "Gira e rigira una lettera col timbro del Belgio." }],
      ["f5_nicolino", 18, 16, "Da grande faccio il carabiniere. Così, se qualcuno sparisce, lo trovo io.", { d: "Con la stampella." }],
      ["f5_nando", 7, 10, "Commendatore, la foto è mia. Il negativo resta a me.", { d: "Stringe la macchina a soffietto." }]
    ] }
  };
  // note del Taccuino: per ogni volto, ciò che hai visto e sentito (per scena), mai il nome
  const NOTES = {}; Object.keys(FZ).forEach((z) => FZ[z].list.forEach(([id, , , l, o]) => { if (!P58[id]) return; (NOTES[id] = NOTES[id] || {})[z] = `${FZ[z].t}${o && o.back ? ` (di spalle: il ${o.back})` : ""}: «${l}»`; }));
  const faces = {}; PHOTO.forEach(([id, t]) => { faces[id] = { t, img: id, ans: { who: WHO[id], fate: ANS[id] }, notes: NOTES[id] || {}, hide: id === "f5_renzo" }; });
  const IMG = {};
  const imgOf = (id) => { if (IMG[id] !== undefined) return IMG[id]; const u = (() => { try { const a = window.__borgoApi; return a && a.portraitImg ? a.portraitImg(id) : null; } catch (e) { return null; } })(); if (!u) return null; const i = new Image(); i.src = u; return (IMG[id] = i); };
  // la foto in testa al Taccuino: seppia, la maglia granata, i volti veri; il quindicesimo graffiato finché non si scopre
  function photo(g, W, H, f, K, sel) {
    const hot = [];
    g.fillStyle = "#e9dfc8"; g.fillRect(0, 0, W, H); g.fillStyle = "#b9a37c"; g.fillRect(8, 8, W - 16, H - 16);
    const gr = g.createLinearGradient(0, 8, 0, H - 8); gr.addColorStop(0, "#c8b48e"); gr.addColorStop(0.5, "#a48e66"); gr.addColorStop(1, "#7d6a4b"); g.fillStyle = gr; g.fillRect(8, 8, W - 16, H - 16);
    // la corriera dietro la squadra
    g.fillStyle = "#6f5d42"; g.beginPath(); g.roundRect(30, 26, 260, 70, 16); g.fill(); g.fillStyle = "#8a7656"; g.fillRect(30, 60, 260, 12); for (let i = 0; i < 8; i++) { g.fillStyle = "#4a3d2b"; g.fillRect(42 + i * 31, 34, 24, 20); g.fillStyle = "rgba(255,240,210,.18)"; g.fillRect(44 + i * 31, 36, 8, 16); }
    g.fillStyle = "#7f1d1d"; g.fillRect(118, 18, 84, 10); g.fillStyle = "#f5ead6"; g.font = "800 7px Georgia"; g.textAlign = "center"; g.fillText("U.S. RONDINE 1958", 160, 26);
    const pos = (i) => (i < 7 ? [44 + i * 39, 104, 0] : i < 13 ? [64 + (i - 7) * 39, 140, 1] : [i === 13 ? 30 : 290, 168, 2]);
    PHOTO.forEach(([id], i) => {
      const [x, y, row] = pos(i), L = P58[id].look, K2 = K, scratched = id === "f5_renzo" && !(K2 && K2.F && K2.F.is("f5_volto"));
      g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(x, y + 30, 12, 3, 0, 0, 7); g.fill();
      const sh = L.portiere ? "#cfc6b4" : L.coach ? "#4a3b2b" : "#7f1d1d";
      if (row === 0) { g.fillStyle = "#efe6d2"; g.fillRect(x - 7, y + 12, 14, 7); g.fillStyle = "#3b2d1f"; g.fillRect(x - 6, y + 19, 4, 10); g.fillRect(x + 2, y + 19, 4, 10); }
      else { g.fillStyle = "#efe6d2"; g.fillRect(x - 8, y + 12, 16, 5); g.fillStyle = "#3b2d1f"; g.fillRect(x - 9, y + 16, 8, 4); }
      g.fillStyle = sh; g.beginPath(); g.roundRect(x - 10, y - 3, 20, 16, 4); g.fill();
      if (L.fascia) { g.fillStyle = "#f5ead6"; g.fillRect(x - 11, y + 2, 4, 4); }
      const im = imgOf(id), hy = y - 11, blur = id === "f5_nando";
      g.save(); g.beginPath(); g.arc(x, hy, 9, 0, 7); g.clip();
      if (im && im.complete && im.naturalWidth) { g.filter = `sepia(0.9) contrast(1.05)${blur ? " blur(1.2px)" : ""}`; g.drawImage(im, x - 9.5, hy - 10, 19, 19); g.filter = "none"; } else { g.fillStyle = "#d9b48a"; g.fillRect(x - 9, hy - 9, 18, 18); }
      if (scratched) { g.fillStyle = "#e9dfc8"; g.fillRect(x - 9, hy - 9, 18, 18); g.strokeStyle = "#5a4630"; g.lineWidth = 0.8; for (let k = 0; k < 14; k++) { g.beginPath(); g.moveTo(x - 9 + ((k * 37) % 18), hy - 9); g.lineTo(x - 9 + ((k * 53) % 18), hy + 9); g.stroke(); } }
      g.restore();
      const ok = K && K.deduce && K.deduce.ok(id);
      if (sel === id) { g.strokeStyle = "#fbbf24"; g.lineWidth = 2; g.beginPath(); g.arc(x, hy, 12, 0, 7); g.stroke(); }
      g.fillStyle = ok ? "#7f1d1d" : "rgba(245,234,214,.9)"; g.beginPath(); g.arc(x + 9, hy - 9, 5, 0, 7); g.fill(); g.fillStyle = ok ? "#fff" : "#1c1917"; g.font = "800 6px Georgia"; g.textAlign = "center"; g.fillText(ok ? "✔" : String(i + 1), x + 9, hy - 7);
      hot.push([id, x, hy, 14]);
    });
    // grana, graffi e bordo bianco della carta
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(40,28,16,${0.08 + (i % 3) * 0.04})`; g.fillRect((i * 97 + Math.floor(f / 6) * 13) % W, (i * 57) % H, 1, 1); }
    g.strokeStyle = "rgba(255,250,235,.25)"; g.beginPath(); g.moveTo(70, 8); g.lineTo(76, H - 8); g.stroke();
    g.fillStyle = "rgba(60,40,20,.55)"; g.font = "italic 7px Georgia"; g.textAlign = "right"; g.fillText("Foto Brizzi · aprile 1958", W - 14, H - 12);
    return hot;
  }
  // ------------------------------------------------------------------------------------------------ la saga
  const E = window.__sagaCore.create({
    id: "foto58", key: "ali-di-rondine.foto58", title: "La Foto del '58", icon: "📷", bg: "f5_titolo", chapters: 4, travel: true,
    menuSub: "Una scatola di latta all'Archivio del Borgo: la foto della Rondine 1958, un volto graffiato e una scritta sul retro. «Nessuno tornò uguale.» Apri i negativi e scopri chi era chi, e che fine ha fatto.",
    theme: { accent: "#fbbf24", ink: "#1c1917", paper: "rgba(245,234,214,.97)", font: "Georgia, serif", chipBg: "#e7dcc4", chipBorder: "#7f1d1d" },
    stats: { verita: [0, 12, 0, "Verità"], pieta: [0, 12, 0, "Pietà"] },
    weight: { name: "Quello che si dice", axes: { verita: ["Verità", "🔎"], pieta: ["Pietà", "🕊️"] } },
    item: ["Lampadina del flash", "Lampadine del flash"],
    drawItem(g, x, y, i, f) {
      g.save(); g.translate(x, y + Math.sin(f / 12 + i) * 1.5); g.globalCompositeOperation = "lighter"; const gr = g.createRadialGradient(0, 0, 1, 0, 0, 10); gr.addColorStop(0, `rgba(255,250,220,${0.5 + 0.2 * Math.sin(f / 8 + i)})`); gr.addColorStop(1, "rgba(255,250,220,0)"); g.fillStyle = gr; g.fillRect(-10, -10, 20, 20); g.restore();
      g.save(); g.translate(x, y + Math.sin(f / 12 + i) * 1.5); g.fillStyle = "#e0f2fe"; g.beginPath(); g.ellipse(0, -1, 3.4, 4.2, 0, 0, 7); g.fill(); g.fillStyle = "#a8a29e"; g.fillRect(-2, 3, 4, 3); g.fillStyle = "#fff"; g.fillRect(-1.5, -3, 1.2, 2); g.restore();
    },
    regions: {
      piazza: { grass: ["#5a7d3a", "#628543", "#557636"], path: ["#b9a888", "#b0a080"], stone: ["#b8b0a2", "#aea698"], wall: ["#d6b98a", "#ccae80"], water: ["#4b88a8", "#5290b0"], tree: ["#3f6a2a", "#4d7a34", "#355c24"], tint: "255,225,180", tintA: 0.06, fx: "", dark: 0.08 },
      sera: { grass: ["#46602f", "#4c6834", "#42592b"], path: ["#9a8a6e", "#928266"], stone: ["#9a9286", "#90887c"], wall: ["#b89a6e", "#ae9064"], water: ["#365f7a", "#3b6884"], tree: ["#2f4f22", "#3a5c2a", "#28441c"], tint: "255,170,110", tintA: 0.1, fx: "", dark: 0.14 },
      monte: { grass: ["#e8eef2", "#eef3f6", "#e2e9ee"], path: ["#8a7e6c", "#827664"], stone: ["#9a958c", "#908b82"], wall: ["#8a7a62", "#807058"], water: ["#c7d8e4", "#bccfdc"], tree: ["#2d4a34", "#36573d", "#26402c"], tint: "220,235,255", tintA: 0.08, fx: "snow", dark: 0.1 },
      galleria: { grass: ["#3a342c", "#352f28", "#3d372e"], path: ["#4a4236", "#433b30"], stone: ["#57504a", "#4f4842"], wall: ["#3a332c", "#332d27"], water: ["#1e2a33", "#22303a"], tint: "255,190,110", tintA: 0.05, fx: "dust", dark: 0.3 },
      interno: { grass: ["#7c5a3a", "#74533a", "#7a5838"], path: ["#9a7a52", "#92724a"], stone: ["#c8bca8", "#beb29e"], wall: ["#8a6a4a", "#7e6040"], water: ["#3b6a8a", "#41708f"], tint: "255,210,150", tintA: 0.1, fx: "dust", dark: 0.12 },
      cimitero: { grass: ["#4a6a34", "#52733a", "#45632f"], path: ["#c9bda4", "#c0b49a"], stone: ["#cfc8bc", "#c5beb2"], wall: ["#b8ae9c", "#aea492"], water: ["#4b7a98", "#5282a0"], tree: ["#1f3d22", "#26482a", "#1a361d"], tint: "230,230,255", tintA: 0.06, fx: "leaves", dark: 0.12 },
      notte: { grass: ["#2a3a26", "#2e402a", "#273623"], path: ["#5a5448", "#544e42"], stone: ["#6a645a", "#625c52"], wall: ["#6a5a46", "#625240"], water: ["#1e2c40", "#223248"], tree: ["#1a2a1a", "#1e301e", "#162616"], tint: "120,140,220", tintA: 0.05, fx: "", dark: 0.3 }
    },
    floors: "CK%m&A", solid: "UFNPRVEZQIYXJhSkco",
    floorPaint(K, f, sx, sy, tx, ty) {
      const g = K.g, h = (a, b) => K.hash(tx * a + ty * b) % 1000 / 1000;
      if (f === "C") { g.fillStyle = (tx + ty) % 2 ? "#a89e8c" : "#a0968a"; g.fillRect(sx, sy, 16, 16); for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const ox = (j % 2) * 2; g.fillStyle = h(i * 7 + j, 3) > 0.5 ? "#b8ae9a" : "#ada390"; g.fillRect(sx + i * 4 + ox - 1, sy + j * 4, 3.4, 3.4); } g.fillStyle = "rgba(0,0,0,.08)"; g.fillRect(sx, sy + 15, 16, 1); return true; }
      if (f === "A") { g.fillStyle = (tx + ty) % 2 ? "#5b5b5e" : "#57575a"; g.fillRect(sx, sy, 16, 16); for (let i = 0; i < 5; i++) { g.fillStyle = "rgba(255,255,255,.07)"; g.fillRect(sx + h(i, 5) * 15, sy + h(5, i) * 15, 1, 1); } if (ty % 6 === 0 && tx % 3 !== 0) { g.fillStyle = "#e7e5e4"; g.fillRect(sx, sy + 7, 10, 2); } return true; }
      if (f === "K") { g.fillStyle = (tx + ty) % 2 ? "#eef3f7" : "#e6edf2"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(148,170,190,.25)"; g.beginPath(); g.ellipse(sx + 4 + h(1, 2) * 8, sy + 10, 5, 1.6, 0, 0, 7); g.fill(); if (h(3, 7) > 0.7) { g.fillStyle = "#fff"; g.fillRect(sx + h(2, 9) * 14, sy + h(9, 2) * 14, 1.5, 1.5); } return true; }
      if (f === "%") { g.fillStyle = (tx + ty) % 2 ? "#4f473c" : "#4a4238"; g.fillRect(sx, sy, 16, 16); for (let i = 0; i < 7; i++) { g.fillStyle = i % 2 ? "rgba(120,108,90,.6)" : "rgba(30,26,20,.5)"; g.fillRect(sx + h(i, 11) * 15, sy + h(11, i) * 15, 2, 1.5); } if (ty % 4 === 2) { g.fillStyle = "#5a4a38"; g.fillRect(sx, sy + 6, 16, 3); g.fillStyle = "#6b6b6b"; g.fillRect(sx, sy + 5, 16, 1); g.fillRect(sx, sy + 9, 16, 1); } return true; }
      if (f === "m") { g.fillStyle = (tx + ty) % 2 ? "#d9c8a6" : "#9c8461"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.06)"; g.fillRect(sx + 1, sy + 1, 6, 2); return true; }
      if (f === "&") { const sn = h(4, 9); g.fillStyle = sn > 0.55 ? "#eef3f7" : sn > 0.25 ? "#d9e4ea" : "#7d9a6a"; g.fillRect(sx, sy, 16, 16); if (sn <= 0.25) { g.fillStyle = "#e6edf2"; g.fillRect(sx + 2, sy + 3, 6, 3); } const L = window.__f5Pitch; if (L) { g.fillStyle = "rgba(127,29,29,.55)"; if (tx === L[0] || tx === L[2]) g.fillRect(sx + 7, sy, 2, 16); if (ty === L[1] || ty === L[3]) g.fillRect(sx, sy + 7, 16, 2); if (tx === ((L[0] + L[2]) >> 1)) g.fillRect(sx + 7, sy, 2, 16); } return true; }
      return false;
    },
    paint: {
      // la corriera: la disegna la zona per intero (decor), qui solo l'ombra sul selciato
      U(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.g.fillStyle = "rgba(0,0,0,.28)"; K.g.fillRect(sx, sy + 10, 16, 6); },
      // fontana della piazza (2×2, il resto lo fa decor)
      F(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#9c968c"; g.fillRect(sx, sy + 2, 16, 14); g.fillStyle = "#4b88a8"; g.fillRect(sx + 2, sy + 4, 12, 9); g.fillStyle = `rgba(255,255,255,${0.25 + 0.15 * Math.sin(fr / 9 + tx)})`; g.fillRect(sx + 4 + (fr / 6 + tx * 4) % 8, sy + 7, 3, 1); },
      // lapide della piazza (ai caduti, e una targa della Rondine)
      N(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx + 2, sy + 13, 14, 3); g.fillStyle = "#a8a29e"; g.fillRect(sx + 3, sy + 1, 10, 13); g.fillStyle = "#d6d3d1"; g.fillRect(sx + 3, sy + 1, 10, 2); g.fillStyle = "#57534e"; for (let i = 0; i < 4; i++) g.fillRect(sx + 5, sy + 5 + i * 2, 6, 0.8); },
      // pino di montagna, con la neve sui rami
      P(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, sw = Math.sin(fr / 70 + tx) * 0.5; g.fillStyle = "rgba(0,0,0,.22)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 6, 2, 0, 0, 7); g.fill(); g.fillStyle = "#4a3426"; g.fillRect(sx + 7, sy + 10, 2, 5);
        [[14, 7], [10, 6], [6, 4.5], [2, 3]].forEach(([y, w], k) => { g.fillStyle = k % 2 ? "#2d4a34" : "#26402c"; g.beginPath(); g.moveTo(sx + 8 - w + sw, sy + y); g.lineTo(sx + 8 + sw * 1.5, sy + y - 7); g.lineTo(sx + 8 + w + sw, sy + y); g.fill(); g.fillStyle = "rgba(238,243,247,.85)"; g.fillRect(sx + 8 - w * 0.6 + sw, sy + y - 2, w * 0.7, 1.4); }); },
      // roccia della montagna
      R(K, sx, sy, tx, ty) { const g = K.g; g.fillStyle = (tx + ty) % 2 ? "#7a746a" : "#726c62"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#8f897f"; g.beginPath(); g.moveTo(sx, sy + 9); g.lineTo(sx + 6, sy + 3); g.lineTo(sx + 12, sy + 7); g.lineTo(sx + 16, sy + 2); g.lineTo(sx + 16, sy + 16); g.lineTo(sx, sy + 16); g.fill(); g.fillStyle = "rgba(0,0,0,.2)"; g.fillRect(sx + 3, sy + 11, 9, 1); g.fillStyle = "rgba(238,243,247,.8)"; g.fillRect(sx + 4, sy + 3, 5, 1.4); },
      // strapiombo sulla valle (nebbia che sale)
      V(K, sx, sy, tx, ty, fr) { const g = K.g, gr = g.createLinearGradient(0, sy, 0, sy + 16); gr.addColorStop(0, "#7d8b96"); gr.addColorStop(1, "#5d6b76"); g.fillStyle = gr; g.fillRect(sx, sy, 16, 16); g.fillStyle = `rgba(230,236,240,${0.25 + 0.1 * Math.sin(fr / 40 + tx * 0.5 + ty)})`; g.fillRect(sx, sy + ((fr / 8 + tx * 5) % 16), 16, 3); if (K.hash(tx * 9 + ty) % 5 === 0) { g.fillStyle = "#3d4f42"; g.beginPath(); g.moveTo(sx + 4, sy + 14); g.lineTo(sx + 7, sy + 6); g.lineTo(sx + 10, sy + 14); g.fill(); } },
      // edicola votiva con la Madonnina e un lumino
      E(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#c8bca8"; g.fillRect(sx + 2, sy + 1, 12, 15); g.fillStyle = "#7f1d1d"; g.beginPath(); g.moveTo(sx + 1, sy + 3); g.lineTo(sx + 8, sy - 3); g.lineTo(sx + 15, sy + 3); g.fill(); g.fillStyle = "#3b2d1f"; g.fillRect(sx + 4, sy + 4, 8, 8); g.fillStyle = "#93c5fd"; g.fillRect(sx + 6, sy + 5, 4, 6); g.fillStyle = "#fde68a"; g.fillRect(sx + 7, sy + 13, 2, 2); K.light(sx + 8, sy + 13, 14 + Math.sin(fr / 5) * 2, "255,200,120", 0.4); },
      // parete della galleria: roccia viva e volta di mattoni
      Z(K, sx, sy, tx, ty) { const g = K.g; g.fillStyle = "#2f2a24"; g.fillRect(sx, sy, 16, 16); for (let j = 0; j < 4; j++) for (let i = 0; i < 2; i++) { g.fillStyle = (i + j + tx) % 2 ? "#4a3a2c" : "#433528"; g.fillRect(sx + i * 8 + (j % 2) * 4 - 2, sy + j * 4, 7, 3); } g.fillStyle = "rgba(120,160,190,.14)"; if (K.hash(tx * 3 + ty * 5) % 4 === 0) g.fillRect(sx + 6, sy + 2, 1, 12); },
      // la frana: pietre, travi spezzate, polvere
      Q(K, sx, sy, tx, ty, fr) { const g = K.g; g.fillStyle = "#3a332c"; g.fillRect(sx, sy, 16, 16); for (let i = 0; i < 6; i++) { g.fillStyle = ["#6b6358", "#57504a", "#7a7266"][i % 3]; g.beginPath(); g.ellipse(sx + 2 + ((tx * 5 + i * 7) % 13), sy + 3 + ((ty * 3 + i * 5) % 11), 3 + (i % 2), 2.4, i, 0, 7); g.fill(); } if ((tx + ty) % 3 === 0) { g.save(); g.translate(sx + 8, sy + 8); g.rotate(0.6); g.fillStyle = "#5a4028"; g.fillRect(-9, -1.5, 18, 3); g.restore(); } },
      // tomba con la fotografia ovale (al cimitero)
      I(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx + 1, sy + 13, 15, 3); g.fillStyle = "#d6d3d1"; g.beginPath(); g.moveTo(sx + 3, sy + 15); g.lineTo(sx + 3, sy + 4); g.quadraticCurveTo(sx + 8, sy - 1, sx + 13, sy + 4); g.lineTo(sx + 13, sy + 15); g.fill(); g.fillStyle = "#a8a29e"; g.fillRect(sx + 3, sy + 14, 10, 2); g.fillStyle = "#c9a77a"; g.beginPath(); g.ellipse(sx + 8, sy + 6, 2.2, 2.8, 0, 0, 7); g.fill(); g.strokeStyle = "#a16207"; g.lineWidth = 0.6; g.stroke(); g.fillStyle = "#57534e"; g.fillRect(sx + 5, sy + 10, 6, 0.8); g.fillRect(sx + 5, sy + 12, 6, 0.8); g.fillStyle = "#dc2626"; if (K.hash(tx * 7 + ty) % 3 === 0) g.fillRect(sx + 12, sy + 12, 2, 2); },
      // cipresso
      Y(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, sw = Math.sin(fr / 70 + tx) * 0.6; g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 4, 1.6, 0, 0, 7); g.fill(); g.fillStyle = "#1f3d22"; g.beginPath(); g.moveTo(sx + 8 + sw, sy - 10); g.quadraticCurveTo(sx + 14, sy + 4, sx + 9, sy + 14); g.lineTo(sx + 7, sy + 14); g.quadraticCurveTo(sx + 2, sy + 4, sx + 8 + sw, sy - 10); g.fill(); g.fillStyle = "rgba(255,255,255,.06)"; g.fillRect(sx + 6, sy - 4, 1, 14); },
      // bancone (bar e archivio)
      X(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#5a3a22"; g.fillRect(sx, sy + 3, 16, 13); g.fillStyle = "#8a5a32"; g.fillRect(sx, sy + 2, 16, 3); g.fillStyle = "rgba(255,255,255,.14)"; g.fillRect(sx, sy + 2, 16, 1); g.fillStyle = "#3b2414"; g.fillRect(sx + 2, sy + 8, 12, 1); },
      // il cavalletto con la macchina a soffietto
      J(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.strokeStyle = "#3b2d1f"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(sx + 8, sy + 4); g.lineTo(sx + 3, sy + 15); g.moveTo(sx + 8, sy + 4); g.lineTo(sx + 13, sy + 15); g.moveTo(sx + 8, sy + 4); g.lineTo(sx + 8, sy + 15); g.stroke(); g.fillStyle = "#1c1917"; g.fillRect(sx + 4, sy - 2, 8, 6); g.fillStyle = "#57534e"; g.fillRect(sx + 9, sy - 1, 4, 4); g.fillStyle = "#93c5fd"; g.fillRect(sx + 11, sy, 1.5, 1.5); },
      // porta del campo (pali di legno)
      h(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#f5f5f4"; g.fillRect(sx + 6, sy, 3, 16); g.fillStyle = "rgba(255,255,255,.35)"; for (let i = 0; i < 16; i += 3) g.fillRect(sx + 9, sy + i, 6, 0.8); },
      // la palina della fermata della corriera
      S(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#57534e"; g.fillRect(sx + 7, sy + 2, 2, 14); g.fillStyle = "#1d4ed8"; g.beginPath(); g.arc(sx + 8, sy + 3, 4, 0, 7); g.fill(); g.fillStyle = "#fff"; g.font = "800 4px system-ui"; g.textAlign = "center"; g.fillText("BUS", sx + 8, sy + 4.5); },
      // banco della camera oscura: bacinelle e lampada rossa
      k(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#2a1410"; g.fillRect(sx, sy + 3, 16, 13); g.fillStyle = "#7f1d1d"; g.fillRect(sx + 2, sy + 4, 5, 3); g.fillStyle = "#57534e"; g.fillRect(sx + 9, sy + 4, 5, 3); g.fillStyle = "#dc2626"; g.fillRect(sx + 7, sy - 3, 2, 3); K.light(sx + 8, sy, 22, "220,38,38", 0.5 + 0.05 * Math.sin(fr / 6)); },
      // il pallone fermo (lo disegna la zona sopra la tessera)
      o(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); },
      // bacheca a vetri per la mostra
      c(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#5a3a22"; g.fillRect(sx + 1, sy + 4, 14, 12); g.fillStyle = "rgba(186,230,253,.4)"; g.fillRect(sx + 2, sy + 5, 12, 6); g.fillStyle = "#e7dcc4"; g.fillRect(sx + 4, sy + 6, 4, 4); g.fillRect(sx + 9, sy + 7, 3, 3); }
    },
    act: { F: "Guarda la fontana", N: "Leggi la lapide", E: "Guarda l'edicola", I: "Leggi la tomba", J: "Guarda nel mirino", k: "Usa la camera oscura", c: "Guarda la bacheca", S: "Leggi la palina", U: "Guarda la corriera", h: "Guarda la porta", X: "Guarda il bancone", Q: "Guarda la frana", L: "Guarda gli scaffali" },
    flavor: {
      F: "La fontana della piazza. Nel '58 c'era già, e nel '58 l'acqua era più fredda: lo dicono tutti quelli che c'erano, cioè quasi nessuno.", N: "La lapide della piazza: i nomi della Grande Guerra e, più in basso, una targa più piccola: «U.S. Rondine · ai suoi». Senza date.",
      P: "Un pino carico di neve. Ogni tanto un ramo si scarica con un tonfo morbido.", R: "Roccia viva, umida di neve sciolta.", V: "Lo strapiombo sulla valle. La nebbia sale piano, come se cercasse qualcuno.", E: "L'edicola della Madonnina del Passo. Un lumino acceso, sempre, da chissà chi.",
      Z: "La parete della galleria: mattoni anneriti e roccia che trasuda. Ci sono scritte a gesso: nomi, date, un cuore.", Q: "La frana. Pietre grosse come valigie, una trave spezzata in due.", Y: "Un cipresso. Al cimitero crescono dritti, come se stessero sull'attenti.",
      X: "Il bancone. Lucido di settant'anni di gomiti.", h: "Una porta di legno, i pali pitturati di bianco. La traversa è un po' storta: «dà carattere», dicevano.", S: "La palina della fermata: «Autolinee Mancuso · Borgo, Valle, Passo della Cavalla». Orari scritti a mano.",
      U: "La corriera. Verde e crema, il portapacchi pieno di valigie legate con lo spago.", c: "La bacheca della mostra «Un secolo di Rondine». Un posto, al centro, è ancora vuoto.", L: "Scaffali di faldoni: verbali, tessere, ricevute. La storia di una squadra di paese, carta su carta."
    },
    rest: { ch: "b", label: "Siediti su una panchina", text: "Ti siedi. Il Borgo ha lo stesso rumore di settant'anni fa, dice Viola: cambia solo chi lo fa. Il gioco salva da solo; dal menu puoi rigiocare i capitoli." },
    texts: { nothing: "Niente di speciale. Nella foto, magari, sì.", noHero: "L'Archivio del Borgo non apre a uno senza nome. Crea prima il tuo Campione.", seen: "" },
    journal: { name: "Il Registro dell'Archivio", sub: "Negativi, documenti, volti e destini" },
    bonds: {
      per: 4, talk: 2, max: 5, names: ["Sconosciuti", "Conoscenti", "Al tavolino", "Di fiducia", "Amici", "Famiglia"],
      scenes: {
        f5_viola: [
          { lv: 2, id: "vio2", prize: "+1 Verità", reward: (K) => K.bond("verita", 1), lines: [["f5_viola", "[pensa] Mio nonno Libero non parlava mai di quel viaggio. Mai. Tagliava i capelli a mezzo Borgo e di calcio parlava solo della Juve."], ["f5_viola", "[serio] Una volta gli ho chiesto della galleria. Mi ha fatto la frangia storta per un mese. Era la sua maniera di dire no."]] },
          { lv: 4, id: "vio4", prize: "Matita da archivio", reward: (K) => K.inv.give("f5_matita"), lines: [["f5_viola", "[felice] Sai perché faccio l'archivista? Perché le cose, se nessuno le scrive, spariscono. E io ho paura che le persone spariscano due volte."], ["f5_viola", "[ride] Tieni. Matita morbida, numero due. Con questa si scrivono i nomi sul retro delle foto. A matita, che se sbagli si cancella."]] }
        ],
        f5_ilario: [
          { lv: 2, id: "ila2", prize: "+1 Pietà", reward: (K) => K.bond("pieta", 1), lines: [["f5_ilario", "[pensa] Ottantanove anni. Sai cosa vuol dire? Che ai funerali ci vado io. Di tutti. A un certo punto ti viene il dubbio di essere tu, quello in ritardo."], ["f5_ilario", "[ride] Il solitario lo faccio perché non bara nessuno. Neanche io. Quasi."]] },
          { lv: 4, id: "ila4", prize: "Guanti spaiati", reward: (K) => K.inv.give("f5_guanti"), lines: [["f5_ilario", "[serio] Questi li tengo nel cassetto da settant'anni. Uno è di Guido, uno è mio. Spaiati. Non li ho mai lavati."], ["f5_ilario", "[triste] Tienili tu. Io ormai le mani non le apro più bene. E poi… non me li merito. Non chiedermi perché."]] }
        ],
        f5_rina: [
          { lv: 2, id: "rin2", prize: "+1 Pietà", reward: (K) => K.bond("pieta", 1), lines: [["f5_rina", "[ride] Bepi mi ha chiesto di sposarlo tre volte. La prima per scherzo, la seconda per paura, la terza in ginocchio sul ghiaccio. Alla terza ho detto sì, perché si stava bagnando i pantaloni."], ["f5_rina", "[pensa] Cinquantun anni insieme. Litigavamo sul sale nella minestra. Adesso la minestra la faccio sciapa, e non litigo con nessuno."]] }
        ],
        f5_mauro: [
          { lv: 2, id: "mau2", prize: "+1 Verità", reward: (K) => K.bond("verita", 1), lines: [["f5_mauro", "[serio] Mia nonna Assunta ha messo un piatto in più a tavola tutte le domeniche fino al 1990. Il piatto di Ottavio. Nessuno ci si sedeva. Io da bambino pensavo fosse per i fantasmi."], ["f5_mauro", "[pensa] Guido la corriera sulla strada del Passo da trentun anni. In quella galleria rallento sempre. Non ho mai capito se per rispetto o per paura."]] }
        ]
      }
    },
    inv: {
      items: {
        f5_frame: { n: "Fotogramma", icon: "🎞️", d: "Un fotogramma ritagliato dal rullino di Nando Brizzi. Sono otto, sparsi tra l'archivio e i negativi. Messi in fila, raccontano qualcosa che nella foto non c'è." },
        f5_registro: { n: "Registro delle partenze", icon: "📒", d: "Il registro del Comune, 1958-1965: chi è partito, per dove. Copia a carta carbone, timbrata." },
        f5_busta: { n: "Busta del Totocalcio Gatti", icon: "✉️", d: "Una busta vuota, ingiallita, col timbro «Totocalcio Gatti & C. · Valle». Era nella scatola di latta, sotto la foto." },
        f5_ritaglio: { n: "Ritaglio della Gazzetta", icon: "📰", d: "Gazzetta del Nord, 1962: «Valtorta, la mezzala del Brianza, in Serie B». La foto è sgranata, il pizzetto no." },
        f5_cartolina: { n: "Cartolina del Passo", icon: "🏔️", d: "Una cartolina del Passo della Cavalla, mai spedita: «Mamma, siamo quasi arrivati. Scrivo domani. I.»", gift: { f5_ilario: 2, f5_mauro: 4 }, giftAny: 1, react: { f5_mauro: "[pensa] Il Passo d'inverno. Ci passo due volte al giorno. Grazie.", f5_ilario: "[sorpreso] Questa… Dove l'hai… No. Niente. Grazie." } },
        f5_caffe: { n: "Caffè corretto", icon: "☕", d: "Un caffè corretto alla grappa, preso al bancone del Bar Sport. Il regalo che al Borgo non si rifiuta.", gift: { f5_ilario: 6, f5_mauro: 3 }, giftAny: 2, react: { f5_ilario: "[ride] Corretto. Come piace a me. Le cose giuste corrette un po'.", f5_mauro: "[ride] In servizio no. …Va be', mezzo." }, refuse: { f5_viola: "[ride] Alle dieci del mattino? In archivio? No, grazie: la carta sente l'odore." } },
        f5_lana: { n: "Gomitolo di lana granata", icon: "🧶", d: "Un gomitolo di lana del colore della Rondine, preso alla merceria della piazza.", gift: { f5_rina: 7, f5_viola: 2 }, giftAny: 1, react: { f5_rina: "[felice] Granata! Ci faccio una sciarpa per la mostra. Come quella di Sante, che gliela fece sua madre e lui la perdeva sempre." } },
        f5_matita: { n: "Matita da archivio", icon: "✏️", d: "Matita morbida numero due, quella di Viola. Con questa si scrivono i nomi sul retro delle foto." },
        f5_guanti: { n: "Guanti spaiati", icon: "🧤", d: "Due guanti da portiere di lana, spaiati: uno di Guido Ferri, uno di Ilario. Settant'anni in un cassetto." },
        f5_lettera: { n: "Lettera da Rosario", icon: "💌", d: "Una lettera dall'Argentina, mai aperta, indirizzata a «Ilario Gentile, Bar Sport, Borgo». Il timbro dice 1961." }
      }
    },
    endings: {
      bacheca: ["La Foto in Bacheca", "La foto va nella bacheca della mostra, con tutti i nomi scritti sotto a matita. Ilario li legge ad alta voce, uno per uno, davanti al Borgo. Al nove si ferma. Poi lo dice.", "Dai un nome e un destino a quasi tutti i volti, e convinci chi è rimasto a dire la verità."],
      scatola: ["La Scatola Chiusa", "Rimetti la foto nella scatola di latta e la scatola nel faldone. Ilario muore in primavera, con il suo segreto e il suo solitario. Al funerale ci sei tu, e Viola, e la Rina. Nessun altro sa perché piangi.", "Certe cose si lasciano dove stanno. Scegli la pietà fino in fondo."],
      lettera: ["Una Lettera ai Nipoti", "Non va in bacheca e non si chiude in una scatola: la verità la scrivi tu, a mano, a chi ne aveva diritto. Mauro la legge sulla corriera, fermo davanti alla galleria, col motore acceso.", "Racconta la verità a chi ha perso qualcuno, ma senza farne un processo."],
      volto: ["Il Quindicesimo Volto", "Segreto: l'ultimo fotogramma del rullino non viene dal '58. Viene da Rosario, Argentina, 1961: due uomini a un tavolino, uno col braccio rotto e uno col sorriso storto. Sul retro: «Non era colpa tua. R.». Il volto graffiato torna al suo posto.", "Otto fotogrammi, quattordici volti confermati, e una lettera mai aperta."]
    },
    // IL NEGATIVO: nelle scene ferme tutto in seppia; poi, sopra, il solo colore della foto: il granata (numeri visti di spalle, i «…» di chi non hai ancora ascoltato)
    mood(g, fr, K) {
      const z = K.api.trZone(), zr = K.zone(z); if (!zr || !zr.spec.frozen) return;
      K.filter(g, "seppia"); const cam = window.__f5Cam, L = FZ[z]; if (!cam || !L) return;
      g.save(); g.textAlign = "center";
      L.list.forEach(([id, x, y, , o]) => { const sx = x * 16 + 8 - cam[0], sy = y * 16 - cam[1] - 18; if (sx < -10 || sx > 330 || sy < -10 || sy > 210) return;
        if (o && o.back) { g.fillStyle = "#7f1d1d"; g.beginPath(); g.roundRect(sx - 5, sy - 5, 10, 9, 2); g.fill(); g.fillStyle = "#fef3c7"; g.font = "900 6px Georgia"; g.fillText(String(o.back), sx, sy + 1.6); }
        else if (!K.F.is("f5_h_" + z + "_" + id.slice(3))) { const b = Math.sin(fr / 10 + x) * 1; g.fillStyle = "rgba(127,29,29,.9)"; g.beginPath(); g.ellipse(sx, sy + b, 6, 3.6, 0, 0, 7); g.fill(); g.fillStyle = "#fef3c7"; g.font = "900 6px Georgia"; g.fillText("…", sx, sy + 1.4 + b); } });
      // il fiocco granata della Rondine, cucito sul bordo della foto
      g.fillStyle = "#7f1d1d"; g.fillRect(6, 6, 4, 14); g.beginPath(); g.moveTo(6, 20); g.lineTo(8, 17); g.lineTo(10, 20); g.fill();
      g.restore();
    },
    heroLook: () => ({ bg: ["#7f1d1d", "#e7dcc4"], shirt: "#7f1d1d" }),
    heroTitle: () => "chi guarda nel mirino",
    deduce: {
      name: "Il Taccuino", icon: "📓", group: 3, hintKey: "ali-di-rondine.taccuino-aiuto",
      attrs: { who: { n: "Chi è", opts: Object.assign({}, ...Object.keys(P58).map((id) => ({ [WHO[id]]: `${P58[id].real} · ${P58[id].role}` }))) }, fate: { n: "Che fine ha fatto", opts: FATES } },
      known: { who: Object.keys(P58).filter((id) => id !== "f5_renzo").map((id) => WHO[id]) },
      faces, photo,
      onConfirm(K, ids) { window.__f5Names && window.__f5Names(K); const H = window.__f5H && window.__f5H(K); if (H) H.confirmed(ids); }
    },
    stadium: { azPitch: "lago", cageField: 1, cageMut: "heavy", weather: "snow",
      venue: { ads: [["ALBERGO DEL PASSO", "#7f1d1d"], ["GRAPPA CAVALLA", "#a16207"], ["TOTOCALCIO GATTI & C.", "#57534e"], ["FORZA RONDINE 1958", "#7f1d1d"]], crowd: 0.45, ground: ["#dfe8ee", "#cfdbe3"], line: "rgba(127,29,29,.7)", tint: "rgba(160,120,70,.18)", sky: ["#8a96a2", "#c9d3db"], wall: ["#6b5a44", "#57493a"], fx: { fr: 0.92, spd: 0.94, wind: 0.2 } } },
    musicMain: "foto58",
    music: { foto58: { bpm: 76, chords: ["Am", "F", "C", "G", "Am", "Dm", "E", "Am"], lres: 2, lw: "triangle", lv: 0.03,
      lead: "A4 - - C5 - B4 | A4 - - - E4 - | F4 - A4 - C5 - | B4 - - - - - | A4 - C5 - E5 - | D5 - C5 - B4 - | C5 - B4 - G#4 - | A4 - - - - -",
      bass: "R . . . 5 . . . R . . . 3 . . .", bv: 0.08, arp: "1 5 8 5 3 5 8 5", aw: "sine", av: 0.012, drum: "k . . . h . . . k . . . h . . h", dv: 0.04 } },
    guide: () => [["🎞️ Il Negativo", "Nei momenti congelati tutto è fermo a metà gesto, in seppia: solo il granata della Rondine resta a colori. Parla con ognuno: senti la sua ultima frase prima dello scatto. Quello che dici e vedi finisce nel Taccuino."],
      ["📓 Il Taccuino", "Dal menu, Registro: per ogni volto della foto scegli chi è e che fine ha fatto. Il Taccuino conferma solo a gruppi di tre giusti insieme, così non si va a tentativi. I nomi li sai dal retro della foto, i destini li trovi nel presente (archivio, bar, chiesa, cimitero)."],
      ["🧪 La Camera Oscura", "Per aprire un negativo nuovo devi svilupparlo: tocca un volto, scegli il nome, leggi gli indizi. Tre giusti insieme e scatta il timbro granata. La luce rossa rivela un volto ma brucia tempo. Il tempo si spegne in Impostazioni."]],
    cameos: [],
    guest: { id: "f5_viola", lines: ["Viola Sanna, archivista. Sì, quella della foto del '58. Sto preparando la mostra «Un secolo di Rondine»: se hai foto vecchie in soffitta, portamele. Le rimetto in fila io.", "Lo sai che al Borgo tutti hanno una scatola di latta? Dentro ci sono le cose che non si buttano e non si guardano.", "Se passi dall'Archivio c'è sempre il caffè. Quello della macchinetta, non quello del bar: quello del bar è per chi ha qualcosa da confessare."] },
    onReady(K) { const H = window.__f5H(K); H.people(); window.__f5Names(K); }
  });
  // il nome vero compare (ritratto, dialoghi, album) solo quando il volto è confermato nel Taccuino
  window.__f5Names = (K) => { try { const C = K.api && K.api.CAST; if (!C) return; Object.keys(P58).forEach((id) => { if (!C[id]) return; const ok = K.deduce && K.deduce.ok(id) || (id === "f5_renzo" && K.F.is("f5_volto")); C[id].name = ok ? P58[id].real : P58[id].n; C[id].sub = ok ? P58[id].role : "U.S. Rondine 1958 · nella foto"; }); } catch (e) { /* niente */ } };
  // --------------------------------------------------------------------------------------------------------------- aiuti comuni dei capitoli
  window.__f5H = (K) => {
    let QL = [];
    const F = K.F;
    const H = {
      P58, FZ, PHOTO, WHO, ANS, FATES,
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      wask: (prompt, opts) => { const l = H.flush(), go = () => K.weight.ask("voce", prompt, opts); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#1c1917", skin: "#e0b48a" }, o), bio),
      plaque(g, txt, x, y, col) { g.save(); g.font = "800 6px Georgia, serif"; const w = g.measureText(txt).width + 8; g.fillStyle = "rgba(41,24,8,.86)"; g.fillRect(x - w / 2, y - 4, w, 9); g.strokeStyle = col || "#fbbf24"; g.lineWidth = 0.6; g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8); g.fillStyle = col || "#fbbf24"; g.textAlign = "center"; g.fillText(txt, x, y + 2.5); g.restore(); },
      frames: () => K.inv.count("f5_frame"),
      conf: () => (K.deduce ? K.deduce.count() : 0),
      stato: () => `📓 Volti confermati ${H.conf()}/14 · 🎞️ Fotogrammi ${H.frames()}/8 · 🔎 Verità ${K.stat("verita")} · 🕊️ Pietà ${K.stat("pieta")}`,
      // un volto confermato: il nome torna sotto la faccia, e a volte un ricordo
      confirmed(ids) { if (!K.api || !K.api.trToast) return; try { K.api.trToast(`📓 Confermati: ${ids.map((id) => P58[id] ? P58[id].real : id).join(", ")}`); } catch (e) { /* */ } },
      // IL NEGATIVO: il dialogo con una figura ferma (ultima frase), note nel Taccuino
      frozen(id) {
        const z = K.api.trZone(), Z = FZ[z]; if (!Z) return false; const e = Z.list.find((x) => x[0] === id); if (!e) return false;
        const o = e[4] || {}; if (P58[id] && K.deduce) { K.deduce.note(id, z, true); }
        F.set("f5_h_" + z + "_" + id.slice(3), true);
        K.say([["voce", `<em>(${o.d || "Fermo a metà gesto."}${o.back ? ` Di spalle si legge il numero <b>${o.back}</b>.` : ""})</em>`], [id, e[3]]], K.done);
        return true;
      },
      heard: (z) => FZ[z] ? FZ[z].list.filter((e) => F.is("f5_h_" + z + "_" + e[0].slice(3))).length : 0,
      // LA CAMERA OSCURA nella storia: sviluppa un negativo coi volti dati; se va male si riprova (o Viola accende la luce)
      develop(o, cb) {
        const l = H.flush(); const go = () => K.minigame(window.__cameraOscura.start, Object.assign({ title: o.title, people: o.ids.map((id) => ({ id, name: P58[id] ? P58[id].real.split(" ")[0].replace(/[«»]/g, "") : id, look: P58[id] ? P58[id].look : {} })), seed: o.seed, diff: o.diff || 0, intro: o.intro, bg: "f5_camera" }), (r) => {
          if (r.quit) return K.ask("voce", "Il negativo è ancora nella bacinella. Viola tiene la pinzetta sospesa.", [{ label: "🧪 Riprova a svilupparlo", sub: "Una carta nuova, stesso negativo", fn: go }, { label: "◂ Più tardi", fn: () => K.done() }]);
          if (!r.win) { F.set("f5_dev_fail_" + o.id, (F.get("f5_dev_fail_" + o.id, 0) | 0) + 1); return K.ask("voce", "La carta si è annerita. Viola sospira: «Succede. Nando sprecava mezzo rullino per una foto buona».", [{ label: "🧪 Riprova", sub: "Un'altra carta", fn: go }, { label: "💡 Fallo sviluppare a Viola", sub: "Ci mette un'ora, ma ci riesce", fn: () => { F.set("f5_dev_" + o.id, true); cb && cb({ win: false, viola: true }); } }]); }
          F.set("f5_dev_" + o.id, true); cb && cb(r);
        });
        if (l.length) K.say(l, go); else go();
      },
      people() {
        Object.keys(P58).forEach((id) => { const p = P58[id]; H.cast(id, p.n, "U.S. Rondine 1958 · nella foto", Object.assign({}, p.c), `${p.n}. Uno dei quindici della foto della Rondine, aprile 1958. Chi sia davvero, e che fine abbia fatto, lo dice il Taccuino.`); });
        H.cast("f5_rina58", "La ragazza col cappotto", "1958 · ai bordi della foto", { style: "ponytail", hair: "#3f2a1a", shirt: "#57534e", skin: "#f1d1b0", eye: "#292524", acc: ["sciarpa"], bg: ["#292524", "#d6c9ad"] }, "Diciannove anni, il cappotto della madre, ai bordi della foto della partenza. Guarda uno della squadra, e non è il fotografo.");
        H.cast("f5_peppino", "Peppino", "L'autista della corriera (1958)", { style: "bald", hair: "#a8a29e", shirt: "#3f6212", skin: "#c8956a", eye: "#292524", beard: "baffi", acc: ["cappellino"], bg: ["#365314", "#d6c9ad"] }, "Peppino, l'autista della corriera dell'U.S. Rondine. Trent'anni di curve, a giugno la pensione. La cicca spenta in bocca, sempre.");
        H.cast("f5_gatti", "Il signor Gatti", "Totocalcio Gatti & C.", { style: "slick", hair: "#1c1917", shirt: "#a16207", skin: "#f1c9a5", eye: "#44403c", beard: "baffi", acc: ["occhiali"], bg: ["#451a03", "#d6c9ad"] }, "Il signor Gatti, ricevitoria del Totocalcio a Valle. Cappotto di cammello, anello al mignolo. Dice di non scommettere mai: fa solo pronostici.");
        H.cast("f5_presidente", "Commendator Bassi", "Presidente dell'U.S. Rondine (1958)", { style: "ordinato", hair: "#e7e5e4", shirt: "#1c1917", skin: "#e8c4a0", eye: "#44403c", beard: "baffi", bg: ["#1c1917", "#d6c9ad"] }, "Il commendator Bassi, presidente dell'U.S. Rondine, padrone della fornace. Pagava le trasferte e decideva chi c'era nelle foto.");
        H.cast("f5_assunta", "Assunta Mancuso", "La madre del terzino (1958)", { style: "bun", hair: "#57534e", shirt: "#1c1917", skin: "#d9a679", eye: "#292524", acc: ["sciarpa"], bg: ["#1c1917", "#d6c9ad"] }, "Assunta Mancuso, vedova, due figli. Aspetta la corriera col fazzoletto in testa.");
        H.cast("f5_arbitro", "L'arbitro", "Semifinale del Passo, 1958", { style: "buzz", hair: "#292524", shirt: "#1c1917", skin: "#e0b48a", eye: "#292524", acc: ["fischietto"], bg: ["#1c1917", "#e7e5e4"] }, "L'arbitro della semifinale del Passo. Nero dalla testa ai piedi, nella neve bianca.");
        H.cast("f5_viola", "Viola Sanna", "Archivista del Borgo", { style: "messybun", hair: "#7c2d12", shirt: "#365314", skin: "#f1d1b0", eye: "#365314", acc: ["occhiali", "taccuino"], bg: ["#365314", "#e7dcc4"] }, "Viola Sanna, trentaquattro anni, archivista del Borgo. Prepara la mostra «Un secolo di Rondine». Beve troppi caffè e ha una matita dietro l'orecchio anche quando dorme. Suo nonno faceva il barbiere.");
        H.cast("f5_ilario", "Ilario Gentile", "Al Bar Sport, il tavolino vicino alla finestra", { style: "bald", hair: "#e7e5e4", shirt: "#57534e", skin: "#e0b48a", eye: "#44403c", beard: "incolta", acc: ["berretto"], bg: ["#44403c", "#e7dcc4"] }, "Ilario Gentile, ottantanove anni. Siede al Bar Sport sempre allo stesso tavolino, vicino alla finestra, e fa il solitario. Ha giocato nella Rondine. Dice di non ricordare niente.");
        H.cast("f5_rina", "Rina Abate", "Vedova Cozzolino", { style: "bun", hair: "#f5f5f4", shirt: "#7f1d1d", skin: "#efcfb0", eye: "#44403c", acc: ["sciarpa"], bg: ["#7f1d1d", "#fde2e2"] }, "Rina Abate, vedova Cozzolino, ottantasette anni. Sorella del capitano della Rondine, moglie di un terzino. Lavora a maglia sulla panchina della piazza e ricorda tutto, tranne quello che non vuole.");
        H.cast("f5_mauro", "Mauro Mancuso", "Autolinee Mancuso", { style: "buzz", hair: "#a8a29e", shirt: "#1d4ed8", skin: "#c8956a", eye: "#1c1917", beard: "folta", bg: ["#1e3a8a", "#dbeafe"] }, "Mauro Mancuso, sessantadue anni. Guida la corriera Borgo-Valle-Passo da trentun anni. Suo zio Ottavio è morto nel '58, e nessuno gli ha mai detto come.");
        H.cast("f5_nello", "Nello", "Il barista del Bar Sport", { style: "side", hair: "#44403c", shirt: "#f8fafc", skin: "#e0b48a", eye: "#292524", acc: ["grembiule"], bg: ["#44403c", "#f5f5f4"] }, "Nello, barista del Bar Sport da quarant'anni. Il caffè di Ilario lo prepara senza che lui lo chieda.");
      }
    };
    return H;
  };
  window.__foto58FZ = FZ;
  // il cavalletto (J) nelle scene ferme: ti stacchi dal mirino e torni all'Archivio
  window.__f5Back = (K) => { K.say([["voce", "Ti stacchi dal mirino. Il soffietto si richiude con un sospiro. L'Archivio, la lampada, Viola che ti guarda: è di nuovo oggi."]], () => K.go("f5_archivio", 11, 6)); };
  window.__foto58 = E.api; window.__foto58Core = E;
})();
