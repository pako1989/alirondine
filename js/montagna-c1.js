// js/montagna-c1.js - PICCOLO BORGO DI MONTAGNA · Capitolo 1 «La corriera delle 8:00»
// Il paesino innevato, il vigile Sbruffo che minaccia multe per ogni orma fresca, il Barista Boris
// con la sua cioccolata calda da record, il Sindaco Valanga e la teca del Pallone di Cartone.
// La prima partita a «Ritagli» sul ghiaccio parrocchiale contro i Ragazzi del Coro.
(function () {
  "use strict";
  function boot() {
    const D = window.__montagna;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("bm_boris", { beard: "incolta", acc: ["colbacco"], name: "Boris il Barista", tag: "", hair: "#3a2a1a", style: "messy", skin: "#f0c8a0", eye: "#2a1a1a", bg: ["#e0f2fe", "#0284c7"], shirt: "#0284c7" },
      "Barista e capitano di riserva del borgo. Prepara cioccolate calde così dense che ci resta in piedi il cucchiaino. Ha tre cappotti uno sopra l'altro e un ottimismo incrollabile: «Se una cosa è di cartone, non può arrugginire».");

    K.cast("bm_sbruffo", { beard: "baffi", acc: ["fischietto", "berretto"], name: "Vigile Sbruffo", tag: "blue", hair: "#1a1a1a", style: "short", skin: "#f6c896", eye: "#1a1a1a", bg: ["#e0f2fe", "#334155"], shirt: "#334155" },
      "L'unico vigile del borgo. Ha compilato 1.400 verbali solo quest'anno, tra cui una multa a una renna per divieto di sosta e una al sole per abbagliamento illecito. Vuole ordine a tutti i costi.");

    K.cast("bm_valanga", { beard: "baffi", acc: ["sciarpa"], name: "Sindaco Valanga", tag: "gold", hair: "#c8c8c8", style: "pompadour", skin: "#ffd2a8", eye: "#334155", bg: ["#fef3c7", "#b91c1c"], shirt: "#b91c1c" },
      "Sindaco in carica da ventiquattro inverni. Indossa una pelliccia ecologica bianca e una fascia tricolore cucita a mano. Sostiene che il Pallone Sacro di cartone custodisca il destino economico della vallata.");

    K.cast("bm_wendy", { acc: ["cappellino"], name: "Wendy della Scuola", tag: "", hair: "#b45309", style: "bob", skin: "#fce7f3", eye: "#15803d", bg: ["#e0f2fe", "#10b981"], shirt: "#10b981" },
      "Maestra e allenatrice dei ragazzi del borgo. Conosce tutte le bugie del Sindaco e tutte le scappatoie del regolamento. Gioca a calcio con un paio di forbici sempre pronte nella tasca.");

    K.cos("bm_c1", { kind: "shirt", label: "Giaccone di flanella da montagna", val: "#dc2626", from: "Capitolo 1 di Piccolo Borgo di Montagna" });
    K.lore("l_ritagli", { t: "Ritagli · Il Calcio di Carta", d: "A Piccolo Borgo si gioca a Ritagli: marionette piatte di cartoncino animate a scatti (12 fps), molla posteriore per caricare i tiri, sponde di compensato e forbici per i contrasti secchi." });
    K.lore("l_bacheca", { t: "La Bacheca del Gelo", d: "I volantini e i bollettini del Comune di Montagna: ogni decisione del consiglio finisce stampata a grandi lettere sul muro del bar, cambiando la fiducia dei cittadini." });

    const goal = (s) => ({
      0: "Sei appena sceso dalla corriera delle 8:00. Il vigile Sbruffo ti sbarra la strada con un blocchetto di multe.",
      1: "Raggiungi il Bar di Boris per riscaldarti e bere la cioccolata calda di benvenuto.",
      2: "Il Sindaco Valanga ti aspetta davanti alla teca del Pallone Sacro in piazza.",
      3: "Sfida di prova sul campetto parrocchiale: dimostra il tuo valore contro i Ragazzi del Coro a Ritagli!",
    }[s] || "Il primo capitolo è concluso. Continua con il Capitolo 2.");

    const zones = {
      bm_piazza: {
        region: "borgo", name: "Piccolo Borgo · Piazza della Neve", short: "Piazza", sub: "La fermata della corriera, la teca, lo scuolabus arancione", bg: "bm_piazza", time: "giorno", travel: [4, 18],
        w: 32, h: 22, start: [4, 18], items: [[2, 5], [29, 6], [14, 19]],
        areas: [[10, 8, 22, 14, "Il centro della Piazza"], [0, 0, 31, 21, "Piccolo Borgo"]],
        flavor: {
          t: "La teca del Pallone Sacro: un cubo di vetro leggermente appannato.",
          l: "Un lampione di ghisa con una stalattite lunga un metro. Sembra una spada di ghiaccio.",
          P: "Un pupazzo di neve sbilenco. Sbruffo gli ha appeso una multa sul bottone."
        },
        intro: [
          ["voce", "Piccolo Borgo di Montagna: un paesino a milleduecento metri dove il termometro non supera mai i quattro gradi e la carta pressata costa meno dei mattoni."],
          ["voce", "Sei sceso dalla corriera delle 8:00 con il borsone da calcio. L'aria punge come aghi di pino e profuma di cioccolata calda."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "bm_sbruffo", at: [6, 18] }] : [{ id: "bm_sbruffo", at: [18, 14] }]),
          ...(s >= 2 ? [{ id: "bm_valanga", at: [15, 9] }] : []),
          { id: "bm_wendy", at: [23, 14] }
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 17, 30, 19, ":"); lay(15, 8, 15, 17, ":"); lay(4, 8, 27, 8, ":");
          house(2, 2, 7, 5, { door: [5, 6], roof: "#0284c7", wall: "#f8fafc", rr: 1, enter: { to: "bm_bar", at: [7, 9] } });
          house(19, 2, 8, 5, { door: [23, 6], roof: "#b91c1c", wall: "#fef3c7", rr: 2, enter: "Il Municipio del Piccolo Borgo: un cartello avverte: «Chiuso per consultazione straordinaria sul Pallone»." });
          house(2, 11, 6, 4, { door: [5, 14], roof: "#15803d", wall: "#f1f5f9", rr: 1, enter: "La Scuola Parrocchiale: nell'atrio ci sono trenta paia di doposci bagnati e un disegno di Wendy." });
          // Elementi del borgo: Teca del pallone, scuolabus, pupazzi, stufette, steccati
          put(16, 9, "T"); put(26, 17, "B");
          [[9, 8], [21, 8]].forEach(([x, y]) => put(x, y, "F"));
          [[11, 14], [25, 12], [8, 14]].forEach(([x, y]) => put(x, y, "P"));
          lay(7, 6, 18, 6, "S");
          [[1, 3], [17, 3], [30, 10], [28, 3]].forEach(([x, y]) => put(x, y, "A"));
          put(4, 17, "s");
        }
      },
      bm_bar: {
        interior: true, region: "interno", name: "Piccolo Borgo · Il Bar di Boris", short: "Bar di Boris", sub: "Stufa accesa, vapori di cacao e ritagli", bg: "bm_bar", w: 16, h: 12, start: [7, 9], outside: ["bm_piazza", 5, 7],
        act: { T: "Guarda il bancone", L: "Guarda la bacheca", F: "Scaldati alla stufa", v: "Esci" },
        flavor: {
          T: "Un pentolone di rame fumante: Boris gira la cioccolata con un mestolo di legno lungo un metro.",
          L: "La bacheca del bar: ritagli di giornale sulle partite epiche contro i paesi vicini e l'elenco dei debitori.",
          F: "La stufa scoppietta diffondendo un profumo di legna di betulla e zucchero tostato."
        },
        intro: [["voce", "Il Bar di Boris: il locale più caldo della regione. I vetri sono completamente appannati e i clienti sorseggiano tazze giganti di cioccolata."]],
        npcs: () => [{ id: "bm_boris", at: [7, 4] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(7, 11, "v");
          lay(2, 3, 13, 3, "L");
          lay(3, 7, 5, 7, "T"); lay(10, 7, 12, 7, "T");
          put(13, 9, "F");
        }
      }
    };

    function matchCoro() {
      K.ritagliMatch({
        title: "Partita Parrocchiale · contro i Ragazzi del Coro",
        intro: "Sul ghiaccio battuto dietro la chiesa: carica la molla delle sagome e tira in porta!",
        turns: 6,
        opp: {
          name: "I Ragazzi del Coro",
          color: "#38bdf8",
          players: [{ name: "Pancrazio" }, { name: "Anacleto" }]
        }
      }, (r) => {
        if (!r.win) {
          return K.scene([
            ["bm_boris", "[triste] Hanno parato con lo spartito dei canti natalizi! Bevi un goccio di cioccolata bollente e riproviamo: la molla va tesa col giusto scatto!"]
          ], () => K.enterZone("bm_piazza"), "bm_piazza");
        }
        fineCapitolo();
      });
    }

    function fineCapitolo() {
      questDone("bm_coro");
      setStep(N, 4);
      bond("boris", 3);
      bond("fiducia", 2);
      K.learnLore("l_ritagli");
      K.learnLore("l_bacheca");
      const msg = K.reward("c1:bm", { coins: 80, cos: ["bm_c1"] });
      finishChapter(N, "completato");

      K.emergenza("corriera", { fiducia: 2, assurdo: 1 }, () => {
        K.scene([
          ["bm_boris", "[felice] TAC! Che tiro secco! Hai piegato i pali di compensato della parrocchia! Il borgo ha trovato il suo nuovo centravanti."],
          ["bm_valanga", "[solenne] In qualità di Primo Cittadino, ti dichiaro Ufficiale del Pallone. Ma attento: i Boscaioli del Passo hanno visto tutto e non staranno a guardare."],
          ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «I Boscaioli del Passo».`]
        ], () => K.openMain(), "bm_piazza");
      });
    }

    const talk = {
      bm_sbruffo() {
        const s = S();
        if (s === 0) {
          return K.scene([
            ["bm_sbruffo", "[severo] Alt! Chi va là? Non si scende dalla corriera senza dichiarare l'equipaggiamento invernale! Hai la gomma termica alle scarpe da ginnastica?"],
            ["voce", "Mostri i tacchetti di gomma delle tue scarpe da calcio."],
            ["bm_sbruffo", "[sorpreso] Tacchetti da campo? Sei un calciatore? Mmh... il comma 4 del Codice Borghigiano prevede una sanzione di 40 sassi per chi non si presenta prima al Bar di Boris. Circolare!"]
          ], () => { setStep(N, 1); quest("bm_bar", "La Cioccolata di Boris", "Entra nel Bar di Boris in piazza per riscaldarti."); done(); }, "bm_piazza");
        }
        return say([["bm_sbruffo", "Circolare! E non lasciate impronte troppo profonde sulla neve fresca: il regolamento vieta buche superiori ai due centimetri!"]]);
      },
      bm_boris() {
        const s = S();
        if (s === 1) {
          return K.scene([
            ["bm_boris", "[felice] Benvenuto al Piccolo Borgo, giovanotto! Bevi questa prima che si congeli l'aria intorno alla tazza."],
            ["voce", "Bevi la cioccolata calda: densa, vellutata, con una punta di cannella. Ti rimette al mondo."],
            ["bm_boris", "Sbruffo fa il burbero, ma qui abbiamo un problema grosso: la Coppa della Montagna è alle porte e il Sindaco Valanga vuole schierare la statua del Pallone Sacro invece di una squadra vera. Vai a parlargli in piazza prima che faccia danni!"]
          ], () => { setStep(N, 2); questDone("bm_bar"); quest("bm_sindaco", "Il Pallone Sacro", "Parla con il Sindaco Valanga davanti alla teca in piazza."); done(); }, "bm_bar");
        }
        return say([["bm_boris", s >= 2 ? "Valanga è davanti alla teca. Trattalo bene: se si arrabbia, dichiara lo stato di calamità naturale e chiude la funivia." : "La cioccolata è sul fuoco!"]]);
      },
      bm_valanga() {
        const s = S();
        if (s === 2) {
          return ask("bm_valanga", "(Si pavoneggia con la fascia tricolore davanti alla teca.) Ecco a voi il Sacro Pallone di Cartone del Borgo! Custodito dal 1984. Dicono che chi lo calcia senza autorizzazione perda la cittadinanza. Tu saresti il forestiero della corriera? Dimostrami che sai calciare senza rovinare il cartone!", [
            { label: "«Mettimi alla prova sul campo parrocchiale!»", sub: "Partita a Ritagli", cls: "hot", fn: () => { setStep(N, 3); questDone("bm_sindaco"); quest("bm_coro", "La prova parrocchiale", "Gioca la sfida a Ritagli contro i Ragazzi del Coro."); matchCoro(); } },
            { label: "«Che cos'ha di speciale questo pallone?»", sub: "Indaga sul Pallone Sacro", fn: () => {
              say([
                ["bm_valanga", "[fiero] È fatto di cartoncino pressato a dodici strati, verniciato a gommalacca e benedetto dal consiglio comunale. Ha vinto tre tornei prima che vietassero le sponde di compensato!"],
                ["bm_wendy", "[sarcastico] Sì, e se lo tocchi troppo forte suona come una lamiera arrugginita. Chissà perché..."]
              ]);
            }}
          ], "bm_piazza");
        }
        if (s === 3) {
          return ask("bm_valanga", "I Ragazzi del Coro sono già schierati sul ghiaccio. Vuoi scendere in campo adesso?", [
            { label: "Gioca la Partita a Ritagli", sub: "Sfida sul ghiaccio", cls: "hot", fn: matchCoro },
            { label: "Aspetta un momento", fn: done }
          ], "bm_piazza");
        }
        return say([["bm_valanga", "La gloria del borgo splende finché la teca resta lucida!"]]);
      },
      bm_wendy() {
        return say([["bm_wendy", "Non ascoltare tutte le frottole del Sindaco. Qui la gente si è convinta che il cartone sia sacro solo perché costa meno. Ma sul campo conta chi sa tagliare e tirare a molla!"]]);
      }
    };

    return {
      n: N,
      title: "La corriera delle 8:00",
      sub: "L'arrivo al Piccolo Borgo, le multe del vigile Sbruffo, la cioccolata di Boris e il primo test",
      goal,
      start: "bm_piazza",
      introBg: "bm_titolo",
      zones,
      talk,
      intro: () => [
        ["voce", "<b>PICCOLO BORGO DI MONTAGNA</b> · Capitolo 1. Dove fa freddo tutto l'anno e gli adulti vivono di tradizioni stravaganti. Tu sei appena sceso dall'autobus con un paio di scarpini e tanta curiosità."]
      ]
    };
  }

  boot();
})();
