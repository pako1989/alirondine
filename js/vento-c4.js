// js/vento-c4.js - LA VALLE DEL VENTO GENTILE · Capitolo 4 (Dossier Incompiuto)
// Prospettiva ribaltata: nei panni di Mara, custode dell'Antico Mulino di Pietra.
// Mentre il Campione saliva controvento sul Colle nel Capitolo 3,
// a valle una tormenta minaccia di spezzare per sempre le pale storiche di Mulinella.
(function () {
  "use strict";
  function boot() {
    const V = window.__vento;
    if (!V || !V.addChapter) return setTimeout(boot, 100);
    V.addChapter(chapter4);
  }

  function chapter4(K) {
    const N = 4, S = () => K.stepOf(N);
    const { setStep, F } = K;

    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };

    K.cast("ve_mara", {
      name: "Mara",
      sub: "Custode dell'Antico Mulino",
      style: "ponytail",
      hair: "#78350f",
      eye: "#15803d",
      skin: "#fed7aa",
      shirt: "#166534",
      acc: ["sciarpa_foglia"],
      bg: ["#14532d", "#86efac"]
    }, "Figlia dei vecchi mugnai di Mulinella. Riconosce la voce di ogni Soffio e accorda le pale di legno come corde di violino.");

    K.cast("ve_eliseo", {
      name: "Campanaro Eliseo",
      sub: "Anziano della Torre",
      style: "buzz",
      hair: "#e2e8f0",
      eye: "#334155",
      skin: "#d97706",
      shirt: "#334155",
      beard: "barba_lunga",
      bg: ["#1e293b", "#fde047"]
    }, "Da sessant'anni custodisce il campanile della valle. Sa che quando il vento si ferma, solo il rintocco del bronzo può svegliare l'eco tra le vette.");

    K.lore("l_mara_mulino", {
      t: "L'Antico Mulino di Pietra",
      d: "Costruito prima ancora che il Borgo marino nascesse. Le sue macine non macinano solo grano, ma lasciano scivolare una farina leggera come polvere di nuvola che nutre i piccoli Soffi."
    });

    const goal = (s) => ({
      0: "Parla con Mastro Gualdo nella piazza dei mulini per valutare i danni della raffica.",
      1: "Raggiungi la torre campanaria (a nord) e consulta il Campanaro Eliseo.",
      2: "Raccogli i tre Soffi dispersi tra le pale di Mulinella e portali al sicuro.",
      3: "Prepara la Grande Campana d'Oro per chiamare a raccolta la valle nel Capitolo 5."
    }[s] || "Dossier avviato. Procedi verso il Capitolo 5!");

    const zones = {
      ve_mulini: {
        region: "valle",
        name: "Mulinella Bassa · Piazza delle Pale",
        short: "Piazza Pale",
        sub: "Pale di legno cigolanti e raffiche impetuose che sollevano foglie",
        bg: "ve_valle",
        time: "pomeriggio",
        w: 30, h: 22, start: [5, 11], items: [[12, 5], [24, 16]],
        areas: [[0, 0, 29, 21, "La piazza dove tutti i mulini della valle convergono"]],
        flavor: {
          M: "L'Antico Mulino di Mara: l'asse centrale vibra sotto la spinta del vento.",
          O: "Il grande olmo centenario piegato dalla tormenta.",
          "*": "Fiori di tarassaco strappati via dal vento."
        },
        intro: [
          ["ve_mara", "Le pale girano troppo forte! Se l'asse di quercia cede, il mulino di famiglia crollerà."],
          ["ve_gualdo", "Mara! La tramontana sta scendendo dal colle a salti di venti metri. Dobbiamo frenare le ruote!"]
        ],
        npcs: (s) => [
          { id: "ve_gualdo", at: [8, 11] },
          { id: "ve_eliseo", at: [18, 11] },
          { id: "ve_sbuffo", at: [12, 7] }
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 29, 0, "o"); lay(0, 0, 0, 21, "o"); lay(29, 0, 29, 21, "o"); lay(0, 21, 29, 21, "o");
          lay(1, 1, 28, 20, ".");
          lay(4, 11, 26, 11, ":");
          lay(6, 4, 10, 6, "M"); lay(20, 4, 24, 6, "M");
          lay(6, 16, 10, 18, "M"); lay(20, 16, 24, 18, "O");
          house(29, 10, 1, 3, { door: [29, 11], enter: { to: "ve_campanile", at: [3, 10] } });
        }
      },

      ve_campanile: {
        region: "valle",
        name: "Torre Campanaria di Mulinella",
        short: "Campanile",
        sub: "Pietra viva antica, campane di bronzo e nido di rondini",
        bg: "ve_colle",
        time: "tramonto",
        w: 26, h: 20, start: [3, 10], items: [[18, 6]],
        areas: [[0, 0, 25, 19, "La cima della torre: da qui si scorgono tutti i tetti della valle"]],
        flavor: {
          M: "La campana di bronzo che chiama la festa.",
          O: "Il davanzale dove i falchi si fermano a dormire."
        },
        intro: [
          ["ve_mara", "Eliseo! La campana è bloccata dalla ruggine o dal gelo?"],
          ["ve_eliseo", "Né l'uno né l'altro, ragazza mia. La campana aspetta una mano ferma e un cuore che non abbia paura di farsi sentire."]
        ],
        npcs: (s) => [
          { id: "ve_eliseo", at: [12, 10] }
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 25, 0, "o"); lay(0, 0, 0, 19, "o"); lay(25, 0, 25, 19, "o"); lay(0, 19, 25, 19, "o");
          lay(1, 1, 24, 18, ".");
          lay(3, 10, 23, 10, ":");
          lay(10, 5, 14, 7, "M");
          house(1, 9, 1, 3, { door: [1, 10], enter: { to: "ve_mulini", at: [27, 11] } });
        }
      }
    };

    const talk = {
      ve_gualdo(K) {
        if (S() === 0) {
          say("ve_gualdo", "Mara, tuo padre diceva sempre: «Non si combatte il vento di fronte, lo si fa entrare nelle vele con un quarto di giro».");
          say("ve_mara", "Lo so, Mastro Gualdo. Ma se non allineiamo le pale, la raffica farà saltare i giunti.");
          ask("La decisione di Mara:", [
            {
              t: "«Serro i freni di canapa e salgo al campanile da Eliseo!»",
              big: true,
              fn: () => {
                setStep(N, 1);
                say("ve_gualdo", "Saggia ragazza! Va' da Eliseo: solo il rintocco della campana può sincronizzare i mulini di tutta la vallata!");
                done();
              }
            }
          ]);
          return;
        }
        say("ve_gualdo", "Le funi tengono ancora, ma la burrasca sta montando!");
        done();
      },

      ve_eliseo(K) {
        if (S() === 1) {
          say("ve_eliseo", "Mara... guarda giù verso il prato. Il Campione e Selva stanno sfidando il colle, ma qui sotto siamo noi a dover tenere in piedi le radici.");
          say("ve_mara", "Vedo tre Soffi intrappolati tra i rami dell'olmo e le pale del mulino basso. Hanno paura.");
          say("ve_eliseo", "Portali qui alla torre. I Soffi conoscono il linguaggio della campana: quando suoneremo, voleranno insieme al bronzo.");
          setStep(N, 2);
          done();
          return;
        }
        if (S() === 2) {
          say("ve_eliseo", "Trova i Soffi spaventati giù nella piazza: ascolta il loro sussurro tra le foglie!");
          done();
          return;
        }
        say("ve_eliseo", "Tutto è pronto. Al mio segnale faremo rintoccare il bronzo nel Capitolo 5!");
        done();
      },

      ve_sbuffo(K) {
        if (S() === 2) {
          say("ve_sbuffo", "Fffff-shhh! (Lo spirito trema e si rannicchia nel grembiule di Mara, ringraziandola con una folata tiepida.)");
          say("ve_mara", "Tranquillo piccolo. Sei al sicuro. Ora saliamo alla campana!");
          setStep(N, 3);
          K.bond("gioia", 15);
          ask("La scelta di Mara prima del gran finale:", [
            {
              t: "«Accordo le pale al canto antico del mulino solenne!»",
              big: true,
              fn: () => {
                K.finishChapter(N, "dossier_v4_custode");
                K.reward("ve_c4_dossier", { coins: 180 });
                say("ve_mara", "«L'Antico Mulino è pronto a cantare. Andiamo a svegliare la vallata!»");
                K.scene(flush(), () => K.openMain(), "ve_valle");
              }
            },
            {
              t: "«Unisco tutta la rete di Mulinella in un coro di campane e pale!»",
              big: true,
              fn: () => {
                K.finishChapter(N, "dossier_v4_rinascita");
                K.reward("ve_c4_dossier", { coins: 180 });
                say("ve_mara", "«Nessun mulino resterà solo stanotte: chiamiamo ogni artigiano e ogni ragazzo!»");
                K.scene(flush(), () => K.openMain(), "ve_valle");
              }
            }
          ]);
          return;
        }
        say("ve_sbuffo", "Fff! (Sbuffo ti vola intorno felice)");
        done();
      }
    };

    const chapterDef = {
      n: N,
      title: "L'Occhio del Ciclone",
      sub: "Dossier Incompiuto: Mara protegge i mulini storici di Mulinella",
      avatar: {
        name: "Mara",
        num: 7,
        cast: {
          name: "Mara",
          sub: "Custode dell'Antico Mulino",
          style: "ponytail",
          hair: "#78350f",
          eye: "#15803d",
          skin: "#fed7aa",
          shirt: "#166534"
        }
      },
      start: "ve_mulini",
      zones,
      talk,
      goal,
      introBg: "ve_valle",
      intro: () => [
        ["ve_mara", "Ho passato tutta la vita ad ascoltare il respiro dei legni di questo mulino."],
        ["ve_mara", "Oggi il cielo si è fatto scuro, e mentre gli eroi salgono sul monte, tocca a chi resta a valle salvare le case."],
        ["ve_mara", "Io sono Mara. E finché avrò voce, nessun vento spezzerà le nostre pale."]
      ]
    };

    return chapterDef;
  }

  boot();
})();
