// js/sasso-c2.js - «SETTE PER SASSO NERO» · Capitolo 2: Sette prezzi
// Sul passo del Corvo si cercano gli altri: un'arciera nel bosco di bambù, una monaca che custodisce una campana muta, un fabbro gigante che vuole
// la sabbia nera del fiume, un vecchio pescatore che getta la rete a occhi chiusi, e un ragazzo che giura di essere samurai. Ognuno ha il suo prezzo.
// Quando i sei sono al completo, al villaggio si gioca a kemari coi contadini: la prova di fiducia. Zone: villaggio (di giorno), il passo del Corvo
// (34x24: torii, bosco di bambù, sentiero del tempio, fiume Kuro), il tempio della campana (14x10), la fucina di Okuma (12x9).
(function () {
  "use strict";
  function boot() {
    const E = window.__sassoCore;
    if (!E || !E.api || !E.api.addChapter || !window.__sassoH || !window.__sassoZ || !E.api._has(1)) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__sassoH(K), Z = window.__sassoZ, { say, done, ask, wask } = H;
    const N = 2, S = () => K.stepOf(N);
    H.people();
    K.cos("sn_c2", { kind: "acc", label: "Cappello di paglia", val: "cappellino", from: "Capitolo 2 di Sette per Sasso Nero" });
    K.lore("l_passo", { t: "Il passo del Corvo", d: "Il valico sopra Sasso Nero: un torii rosso, un tempio con una campana di bronzo, un bosco di bambù e il fiume Kuro, nero di sabbia di ferro. Di là dal passo, le terre di nessuno, dove bivaccano i predoni." });
    K.lore("l_jiro", { t: "Jirō", d: "Il fratello di Kiku. Otto anni quando Corvo Rosso l'ha preso per tenere i cavalli. Sono passati quattro raccolti. Se è vivo, ne ha dodici." });

    const n = () => K.crew.count(), full = () => n() >= 6;
    const goal = (s) => ({
      0: "Al villaggio: Kanbei ti aspetta alla Porta Nord, verso il passo.",
      1: `Sul passo del Corvo (Porta Nord) cerca gli altri compagni: ${n()}/6. Il bosco di bambù, il tempio della campana, la fucina sul fiume, il pescatore. Sacchi di riso: ${K.stat("riso")}.`,
      2: "I Sette sono al completo. Al villaggio, sul campo da kemari: Gisaku ha organizzato una partita coi contadini.",
      3: "Il capitolo si chiude."
    }[s] || "Il capitolo 2 è concluso.");
    function check() { if (S() === 1 && full()) { setStep(N, 2); quest("sn_c2b", "La prova del kemari", "Torna al villaggio: sul campo da kemari, i contadini aspettano i Sette."); say("sn_kanbei", "[serio] Sei. Più te. Sette. Adesso il difficile: farci accettare da chi ci paga. Si torna al villaggio. Gisaku ha detto una parola sola: «kemari»."); } }
    const hire = (id, cost, txt) => { if (full()) { say("voce", "I Sette sono al completo."); return false; } if (!H.hire(id, cost, txt)) { say("voce", `Ti servono ${cost} sacchi di riso. Ne hai ${K.stat("riso")}.`); return false; } check(); return true; };

    function fin(win) {
      setStep(N, 3); F.set("sn_c2_done", true); if (win) F.set("sn_kemari_win", true);
      const m = K.reward("sn_c2", { coins: 100, cos: "sn_c2" });
      K.finishChapter(N, "ok");
      const ren = K.crew.has("sn_ren"), gon = K.crew.has("sn_gonta");
      K.scene(H.flush().concat([
        ["sn_gisaku", win ? "[felice] Hanno perso, i contadini. E ridevano. Non ridevano così da quattro raccolti." : "[ride] Avete perso coi contadini! Bene. Adesso si fidano: uno che perde a kemari non può essere un demonio."],
        ["sn_kanbei", "[serio] Domani si comincia: legno, fossati, porte. Ventinove giorni. Ognuno ha qualcosa da fare, e qualcosa da non dire."],
        ...(ren && gon ? [["sn_gonta", "[pensa] (Gonta guarda Ren da lontano, a lungo. Poi sputa per terra e va a dormire senza parlare.)"]] : []),
        ["voce", `<b>FINE DEL CAPITOLO 2 · «Sette prezzi»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 3 ti aspetta: palizzate, fossati, una soffitta che nessuno apre e la prima notte."]
      ]), () => K.openMain(), "sn_campo");
    }
    function kemari() {
      const sq = H.alive().slice(0, 3).map((id) => K.crew.members[id].n);
      K.say(H.flush(), () => K.playMatch({
        id: "sn_kemari", alt: "az,cage,hd", force: false, squad: sq, mate: sq[0] || "Kanbei", us: "I Sette", oppTeam: "Contadini di Sasso Nero", oppColor: "#a16207", homeKit: ["#7f1d1d", "#fef3c7"], oppPower: 0.85,
        oppNames: ["Rikichi", "Shinobu", "Yohei", "Mosuke"], intro: "Campo da kemari di Sasso Nero · I Sette contro i contadini. La palla non deve toccare terra: almeno, così dice la regola.",
        done: (r) => { say("voce", r.win ? "Vincete. I contadini protestano, poi ridono, poi vi offrono il sakè di Manzo senza dirglielo." : "Perdete. Shinobu fa un giro di campo con la palla in testa. Il villaggio intero applaude."); fin(!!r.win); }
      }));
    }

    const talk = {
      sn_kanbei() {
        if (K.rel.scene("sn_kanbei")) return;
        const s = S();
        if (s === 0) {
          say("sn_kanbei", `[serio] Contiamo. ${n()} lame, più la tua palla. Ne servono sei. Sul passo del Corvo, dicono, c'è un'arciera che caccia i cervi nel bambù, una monaca con una naginata, un fabbro che fa porte e un pescatore che prende quello che vuole.`);
          say("sn_kanbei", "Il riso è poco. Paga chi lo chiede, convinci chi non lo chiede. E sta' attento al ragazzo con la spada troppo lunga: ci segue da stamattina.");
          setStep(N, 1); quest("sn_c2", "Sette prezzi", "Sul passo del Corvo, oltre la Porta Nord, cerca gli altri compagni.");
          return done();
        }
        say("sn_kanbei", s === 1 ? `${n()} su sei. Il passo è grande: il bambù a ovest, il tempio in alto, il fiume e la fucina in basso.` : s === 2 ? "Kemari. Coi contadini. Tu sai tenere su la palla. Io so tenere su il morale. Speriamo bastino tutti e due." : "Domani, legno."); done();
      },
      sn_tetsu() {
        if (K.rel.scene("sn_tetsu")) return;
        if (K.crew.has("sn_tetsu")) { say("sn_tetsu", "[felice] Kikuchi Tetsunosuke, al vostro servizio! Nato nell'anno del cavallo! (Del topo.)"); return done(); }
        if (full()) { say("sn_tetsu", "[triste] Al completo? Senza Kikuchi Tetsunosuke? La storia vi giudicherà. Io vi giudicherò. Mia madre... no, lei no."); return done(); }
        say("sn_tetsu", "[furbo] Ehi, tu! Ronin col pallone! Io sono Kikuchi Tetsunosuke, samurai di nobile famiglia! Ecco il mio albero genealogico! (Te lo sventola davanti. È un rotolo con una macchia di salsa di soia.)");
        say("sn_kanbei", "[ride] Nato nell'anno del cavallo, dice qui. Avresti quattordici anni. Ne dimostri venti, e un carattere da tre.");
        say("sn_tetsu", "[arrabbiato] Io combatto! Ho una spada! È lunga! E so pescare con la rete, che è come combattere ma coi pesci!");
        return wask("Tetsu ha la spada più lunga di lui e la faccia di chi non ha mangiato da due giorni.", [
          { label: "🌾 «Vieni. Un samurai che pesca serve sempre.»", big: true, w: { pieta: 1 }, fn: () => { if (hire("sn_tetsu", 0, `Tetsu fa un inchino così profondo che la spada gli scivola dietro la schiena. ${H.count()}`)) K.rel.add("sn_tetsu", 3); done(); } },
          { label: "🗡️ «Un samurai non mente sul nome. Torna quando dirai il tuo.»", big: true, w: { onore: 1 }, fn: () => { F.set("sn_tetsu_nome", true); say("sn_tetsu", "[triste] Il mio... va bene. Il mio nome è Tetsu. Figlio di nessuno, di un villaggio come questo. Va bene così? È più corto."); say("sn_kanbei", "[pensa] È più vero. Vieni, Tetsu."); if (hire("sn_tetsu", 0, `Tetsu si mette in fila, in silenzio, per la prima volta. ${H.count()}`)) K.rel.add("sn_tetsu", 4); done(); } },
          { label: "◂ Non adesso", fn: () => { say("sn_tetsu", "Non adesso! Va bene! Vi seguo lo stesso! A distanza di sicurezza! Molto samurai!"); done(); } }
        ]);
      },
      sn_kiku() {
        if (K.rel.scene("sn_kiku")) return;
        if (K.crew.has("sn_kiku")) { say("sn_kiku", "[serio] Quarantadue frecce. Una per ogni predone, più due per sbagliare. Non sbaglio."); return done(); }
        if (full()) { say("sn_kiku", "Siete già sette. Va bene. Io caccio da sola, da sempre."); return done(); }
        say("voce", "Nel bambù una freccia ti sfiora il cappello e si pianta in una canna. Dietro, una ragazza con l'arco teso e un cervo appeso alla spalla.");
        say("sn_kiku", "[serio] Ti ho sentito da un miglio: pesti le foglie come un predone. Ma i predoni non palleggiano mentre camminano. Chi sei?");
        say("sn_kiku", "Sasso Nero. Corvo Rosso. Lo so. Ha preso mio fratello Jirō, quattro raccolti fa, per tenere i cavalli. Aveva otto anni.");
        K.learnLore("l_jiro");
        return wask("Kiku abbassa l'arco, ma solo un po'.", [
          { label: "🗡️ «Vieni con noi: Corvo Rosso pagherà.»", big: true, w: { onore: 2 }, fn: () => { F.set("sn_kiku_vendetta", true); say("sn_kiku", "[arrabbiato] Pagherà. Sì. È l'unica paga che voglio."); if (hire("sn_kiku", 0, `Kiku stacca la freccia dalla canna e la rimette nella faretra. ${H.count()}`)) K.rel.add("sn_kiku", 2); done(); } },
          { label: "🌾 «Vieni con noi: se Jirō è vivo, lo riportiamo a casa.»", big: true, w: { pieta: 2 }, fn: () => { F.set("sn_kiku_jiro", true); say("sn_kiku", "[sorpreso] A casa. Nessuno l'ha mai detto. Tutti dicono «vendicarlo». Lui non è morto. Credo."); if (hire("sn_kiku", 0, `Kiku ti segue fuori dal bambù, in silenzio. ${H.count()}`)) K.rel.add("sn_kiku", 4); done(); } }
        ]);
      },
      sn_shino() {
        if (K.rel.scene("sn_shino")) return;
        if (K.crew.has("sn_shino")) { say("sn_shino", "[serio] La campana è muta da un anno. Quando suonerà, vorrà dire che qualcuno è passato dall'altra parte. Spero di no. Spero tardi."); return done(); }
        if (F.is("sn_shino_no")) { say("sn_shino", "[serio] Ho detto di no, ronin. Ma ti ho dato la campanella. Quando suona da sola, ricordati di me."); return done(); }
        if (full()) { say("sn_shino", "Siete al completo. Pregherò per voi. Gratis, ma di nascosto."); return done(); }
        say("sn_shino", "[serio] Un ronin al tempio. Vieni per pregare o per reclutare? Lo chiedo perché i ronin di solito vengono per rubare le offerte, e le offerte sono tre chicchi di riso.");
        say("sn_shino", "Conosco Sasso Nero. L'anno scorso i predoni hanno ucciso un vecchio davanti al granaio. Ho sepolto io la sua cenere. Verrò, se mi giuri una cosa: chi scappa, non lo inseguiamo. Chi si arrende, vive.");
        return wask("Shino stringe la naginata come un bastone da pellegrino.", [
          { label: "🌾 «Lo giuro. Chi si arrende, vive.»", big: true, w: { pieta: 2 }, fn: () => { F.set("sn_giuramento", true); if (hire("sn_shino", 0, `Shino si inchina alla campana muta e ti segue giù per i gradini. ${H.count()}`)) K.rel.add("sn_shino", 4); done(); } },
          { label: "🗡️ «Non posso. Se lasciamo andare un predone, torna l'anno dopo.»", big: true, w: { onore: 2 }, fn: () => { F.set("sn_shino_no", true); K.inv.give("sn_campanella"); say("sn_shino", "[triste] Sei onesto. Mi dispiace. Allora resto qui. Prendi questa: è una campanella della grande campana. Suona da sola quando qualcuno ha paura. Nell'Ultima Notte, ti dirà dove correre."); say("voce", "Ottieni la Campanella del tempio."); done(); } }
        ]);
      },
      sn_okuma() {
        if (K.rel.scene("sn_okuma")) return;
        if (K.crew.has("sn_okuma")) { say("sn_okuma", "[felice] (Okuma canta una ninna nanna mentre batte il ferro. Ha una voce da usignolo e un braccio da bue.)"); return done(); }
        if (full()) { say("sn_okuma", "Al completo? Allora vi faccio una porta. Gratis. Le porte sono il mio modo di venire con voi."); return done(); }
        if (K.inv.has("sn_ferro")) {
          K.inv.take("sn_ferro");
          say("sn_okuma", "[felice] Sabbia del fiume Kuro! Questa è quella buona: nera, pesante, onesta. Con questa ti faccio una porta che respira, una lama che canta e una pentola per il riso.");
          say("sn_okuma", "Vengo. Due metri di fabbro per quaranta predoni. Mi sembra giusto: io sono grosso, loro sono tanti.");
          if (hire("sn_okuma", 0, `Okuma si carica l'incudine in spalla come uno zaino. ${H.count()}`)) K.rel.add("sn_okuma", 3); return done();
        }
        say("sn_okuma", "[serio] Un villaggio da difendere. Porte, palizzate, punte. Bello. Ma il mio ferro è finito, e il ferro della città è ferro da pentole.");
        say("sn_okuma", "Sul greto del fiume, dove l'acqua gira intorno al sasso nero, c'è la sabbia di ferro buona. Portamene un sacco e vengo. Ah: è pesante. Come una promessa.");
        F.set("sn_ferro_cerca", true); quest("sn_c2f", "La sabbia nera", "Sul greto del fiume Kuro, dove l'acqua gira intorno al sasso nero: la sabbia di ferro per Okuma."); return done();
      },
      sn_masa() {
        if (K.rel.scene("sn_masa")) return;
        if (K.crew.has("sn_masa")) { say("sn_masa", "[ride] Ho preso un pesce, un sandalo e un predone, una volta. Il predone l'ho ributtato: era piccolo."); return done(); }
        if (full()) { say("sn_masa", "Al completo? Allora pesco per voi. Un samurai che mangia pesce combatte meglio di uno che mangia orgoglio."); return done(); }
        say("sn_masa", "[pensa] Settant'anni di fiume, ragazzo. Getto la rete a occhi chiusi e prendo quello che voglio. I predoni li ho visti passare il guado: cavalli pesanti, uomini leggeri. La rete li ferma tutti e due.");
        return ask("Masa getta la rete senza guardare. La ritira piena.", [
          { label: "🍚 Gli offri un sacco di riso", sub: `Ne hai ${K.stat("riso")}`, disabled: K.stat("riso") < 1, fn: () => { if (hire("sn_masa", 1, `Masa annusa il riso, lo assaggia, annuisce. ${H.count()}`)) K.rel.add("sn_masa", 2); done(); } },
          { label: "🏐 Lo sfidi: un pesce col calcio contro uno con la rete", sub: "Se vinci, viene gratis", fn: () => { F.set("sn_masa_sfida", true); say("voce", "Calci la palla da kemari dentro il fiume. Rimbalza su un sasso, su un altro, e ti torna fra le mani insieme a una trota stordita. Masa ride fino a tossire."); say("sn_masa", "[ride] Un pesce col pallone! Settant'anni di fiume e non l'avevo mai visto. Vengo gratis. Voglio vedere cosa fai coi predoni."); if (hire("sn_masa", 0, `Masa arrotola la rete e ti segue. ${H.count()}`)) K.rel.add("sn_masa", 3); done(); } },
          { label: "◂ Un'altra volta", fn: done }
        ]);
      },
      sn_gisaku() {
        if (K.rel.scene("sn_gisaku")) return;
        const s = S();
        if (s === 2) {
          say("sn_gisaku", "[felice] I Sette! Bene. Adesso il villaggio vuole vedere se sapete giocare. Non a fare la guerra: a kemari. Chi tiene su la palla, tiene su il villaggio. Lo diceva mio nonno, e lui teneva su poco.");
          return ask("Sul campo da kemari, fra i quattro alberi, i contadini si sono già tolti i sandali.", [
            { label: "🏐 Kemari coi contadini", sub: "La prova di fiducia: vinci o perdi, conta come giochi", big: true, cls: "hot", fn: kemari },
            { label: "◂ Fra poco", fn: done }
          ]);
        }
        say("sn_gisaku", s <= 1 ? "Sul passo ci sono i migliori e i peggiori della provincia. A volte sono le stesse persone." : "Domani legno, dopodomani fossati. Io porto il tè. È il mio contributo alla guerra."); done();
      },
      sn_shinobu() {
        if (K.rel.scene("sn_shinobu")) return;
        const h = K.crew.has("sn_hayate");
        say("sn_shinobu", S() <= 1 ? (h ? "[furbo] Quel ragazzo con la spada, Hayate. Si allena sotto il ciliegio e quando passo sbaglia tutti i colpi. È carino. Non dirglielo. Non dirlo a mio padre. Non dirlo." : "[furbo] Ho dei capelli corti adesso, grazie a mio padre. Così corro meglio. Grazie, papà.") : "[felice] Kemari! Io gioco coi contadini. Non vi faccio sconti. Preparo gli onigiri per chi perde: così perdete contenti."); done();
      },
      sn_manzo() {
        if (K.rel.scene("sn_manzo")) return;
        say("sn_manzo", "[arrabbiato] Kemari! Coi samurai! E mia figlia gioca! Coi samurai! Gisaku vuole farmi morire prima dei predoni."); done();
      },
      sn_rikichi() {
        if (K.rel.scene("sn_rikichi")) return;
        say("sn_rikichi", S() <= 1 ? "[serio] Il passo è pericoloso. Fra il tempio e il bosco ci sono gli esploratori di Corvo. Se ne vedi uno, non lo seguire. Non torna nessuno da quella strada." : "[pensa] Kemari. Mia moglie era la più brava del villaggio. Non c'è bisogno che tu sappia altro."); done();
      },
      sn_gonta() { if (K.rel.scene("sn_gonta")) return; say("sn_gonta", K.crew.has("sn_ren") ? "[pensa] Quel Ren. Il faccino, i dadi, i coltelli. L'ho già visto. Non qui. Non lo dico ancora." : "Il passo lo conosco. Troppo bene. Da quella parte si va al campo di Corvo. Io da quella parte non ci torno."); done(); },
      sn_ren() { if (K.rel.scene("sn_ren")) return; say("sn_ren", "[furbo] Gonta mi guarda strano. Gli uomini grossi guardano sempre strano, è la prospettiva."); done(); },
      sn_yumi() { if (K.rel.scene("sn_yumi")) return; say("sn_yumi", "Erbe del passo: assenzio, piantaggine, una radice che fa dormire anche i cavalli. Le raccolgo tutte. Fra un mese ne avremo bisogno."); done(); },
      sn_hayate() { if (K.rel.scene("sn_hayate")) return; say("sn_hayate", "[pensa] La figlia del mugnaio... no, niente. Mi alleno. Sotto il ciliegio. Per caso."); done(); }
    };

    const zones = {
      sn_villaggio: Z.villaggio(H, (s) => {
        const L = [];
        if (s === 0) L.push({ id: "sn_kanbei", at: [17, 4] });
        if (!K.crew.has("sn_tetsu") && s <= 1) L.push({ id: "sn_tetsu", at: [14, 5] });
        if (s === 2) L.push({ id: "sn_gisaku", at: [16, 14] }, { id: "sn_shinobu", at: [13, 17] }, { id: "sn_rikichi", at: [20, 17] });
        else L.push({ id: "sn_shinobu", at: [20, 17] }, { id: "sn_manzo", at: [21, 5] }, { id: "sn_rikichi", at: [26, 11] });
        return L;
      }, {
        time: "giorno", start: [16, 13], doors: { "16,0": { to: "sn_passo", at: [16, 22] }, "17,0": { to: "sn_passo", at: [17, 22] } },
        items: [[6, 20], [26, 19], [12, 7], [29, 3]], itemCos: "sn_c2",
        extra: [[16, 0, "q"], [17, 0, "q"]],
        intro: [["voce", "Mattina a Sasso Nero. I contadini guardano i ronin come si guarda un temporale: da lontano, e con le mani sulla testa."], ["voce", "Verso nord, oltre la Porta, il sentiero sale al passo del Corvo."]]
      }),
      sn_passo: {
        region: "passo", name: "Il passo del Corvo", short: "Passo del Corvo", sub: "Un torii rosso, il bosco di bambù, il tempio della campana e il fiume nero", bg: "sn_passo", time: "giorno", w: 34, h: 24, base: "Q", start: [16, 21], travel: [16, 21],
        items: [[4, 4], [29, 6], [9, 20], [24, 14]], itemCos: "sn_c2",
        areas: [[0, 2, 11, 14, "Il bosco di bambù"], [13, 1, 21, 7, "Il tempio della campana"], [22, 9, 33, 17, "La fucina sul fiume"], [0, 16, 33, 23, "Il fiume Kuro"], [0, 0, 33, 23, "Il passo del Corvo"]],
        act: { q: "Entra", r: "Guarda la roccia", t: "Guarda l'albero", w: "Guarda il fiume", n: "Leggi la pietra", s: "Riposa un momento", l: "Guarda la lanterna", b: "Siediti" },
        flavor: { r: "Rocce scure, levigate dal vento del passo.", t: "Un pino storto dal vento. Le radici tengono la roccia come una mano tiene un sasso.", w: "Il fiume Kuro, nero di sabbia di ferro. L'acqua è gelida e dice cose che non si capiscono.", n: "Una pietra con un'iscrizione: «Di qui passano gli dèi, i monaci e i predoni. Gli dèi salutano.»", l: "Una lanterna di carta appesa a un ramo, spenta. Qualcuno l'ha lasciata per tornare." },
        doors: { "16,23": { to: "sn_villaggio", at: [16, 1] }, "17,23": { to: "sn_villaggio", at: [17, 1] } },
        npcs: (s) => {
          const L = [];
          if (!K.crew.has("sn_kiku")) L.push({ id: "sn_kiku", at: [5, 8] });
          if (!K.crew.has("sn_masa")) L.push({ id: "sn_masa", at: [8, 17] });
          if (!K.crew.has("sn_tetsu") && s >= 1) L.push({ id: "sn_tetsu", at: [19, 21] });
          return L;
        },
        intro: [["voce", "Il passo del Corvo. Un torii rosso sul sentiero di pietra, il tempio in alto, il bosco di bambù a ovest, il fiume nero che scende verso la fucina."], ["voce", "Il vento porta odore di fumo di bivacco. Non è il fumo del tempio."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "t"); lay(0, 0, 0, 23, "t"); lay(33, 0, 33, 23, "t"); lay(0, 23, 33, 23, "t"); put(16, 23, "q"); put(17, 23, "q");
          // il fiume Kuro in basso, col guado di pietre e il sasso nero
          lay(1, 18, 32, 19, "w"); lay(15, 18, 18, 19, "Z"); put(26, 18, "r"); put(27, 18, "r");
          // il sentiero di pietra che sale al tempio, col torii
          lay(16, 8, 17, 22, "Z"); lay(12, 10, 21, 11, "Z"); put(15, 14, "I"); put(18, 14, "I");
          // il bosco di bambù a ovest
          // (il bambù si vede sul bordo delle radure; dentro, il folto è pino scuro)
          const CL = [[3, 6, 8, 10], [9, 10, 11, 11], [4, 4, 5, 6], [1, 12, 4, 13], [3, 11, 4, 11]], inCl = (x, y) => x < 1 || x > 11 || y < 2 || y > 15 || CL.some(([a, b, c, e]) => x >= a && x <= c && y >= b && y <= e);
          for (let y = 2; y <= 15; y++) for (let x = 1; x <= 11; x++) put(x, y, inCl(x, y) ? "Q" : [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => inCl(x + dx, y + dy) && !(x + dx < 1 || y + dy < 2) ) ? "A" : "t");
          // il tempio in alto, con le lanterne di pietra
          house(13, 2, 8, 5, { door: [16, 6], roof: "#1c1917", wall: "#7f1d1d", chimney: false, enter: { to: "sn_tempio", at: [7, 8] } }); lay(16, 7, 17, 7, "Z");
          [[13, 8], [20, 8], [14, 12], [19, 12]].forEach(([x, y]) => put(x, y, "E"));
          // la fucina sul fiume, a est
          house(24, 10, 6, 4, { door: [26, 13], roof: "#292524", wall: "#57534e", chimney: true, enter: { to: "sn_fucina", at: [6, 7] } });
          lay(22, 14, 31, 15, "Q"); [[22, 9], [31, 9], [23, 16], [30, 16]].forEach(([x, y]) => put(x, y, "t"));
          [[25, 3], [28, 4], [30, 2], [23, 6], [31, 6], [3, 17], [12, 16], [29, 21], [4, 21], [10, 21], [24, 21]].forEach(([x, y]) => put(x, y, "r"));
          put(21, 21, "n"); put(14, 21, "s"); put(13, 5, "l"); put(20, 16, "b"); put(21, 16, "b");
          lay(22, 2, 32, 8, ";"); [[24, 4], [27, 7], [31, 3]].forEach(([x, y]) => put(x, y, "t"));
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow(); g.save();
          // nebbia del passo che scorre e il fumo della fucina
          for (let i = 0; i < 5; i++) { g.fillStyle = "rgba(255,255,255,.06)"; g.fillRect(d.X(0) + ((f * 0.3 + i * 140) % 600) - 100, d.Y(2 + i * 3), 160, 10); }
          for (let i = 0; i < 3; i++) { g.fillStyle = `rgba(120,113,108,${0.3 - i * 0.08})`; g.beginPath(); g.arc(d.X(28) + 4 + Math.sin(f / 25 + i) * 3, d.Y(10) - 6 - i * 7 - (f % 40) / 7, 3 + i, 0, 7); g.fill(); }
          // il sasso nero nel fiume, dove l'acqua gira
          g.strokeStyle = "rgba(255,255,255,.3)"; g.lineWidth = 1; g.beginPath(); g.arc(d.X(27), d.Y(18) + 8, 14 + Math.sin(f / 12) * 2, 0, 7); g.stroke();
          g.restore();
          H.plaque(g, "TEMPIO DELLA CAMPANA", d.X(17), d.Y(2) - 4, "#fca5a5"); H.plaque(g, "FUCINA", d.X(27), d.Y(10) - 4, "#fdba74"); H.plaque(g, "BAMBÙ", d.X(6), d.Y(3) - 4, "#86efac"); H.plaque(g, "▼ SASSO NERO", d.X(16) + 8, d.Y(22) - 2, "#fde68a");
        }
      },
      sn_tempio: {
        interior: true, region: "tempio", name: "Il tempio della campana", short: "Tempio", sub: "Una campana muta da un anno e una monaca che non dorme", bg: "sn_tempio", w: 14, h: 10, start: [7, 8], outside: ["sn_passo", 16, 7], base: "Z",
        items: [[1, 7]], itemCos: "sn_c2",
        act: { C: "Guarda la campana", E: "Guarda la lanterna", D: "Guarda l'altare", L: "Guarda i sutra", W: "Guarda la finestra" },
        flavor: { C: "La grande campana di bronzo. Muta da un anno: dal giorno in cui l'ultimo monaco è sceso al villaggio e non è più tornato.", E: "Una lanterna di pietra accesa per i morti dell'ultimo raccolto. Le fiammelle sono undici.", D: "L'altare, con un Buddha di legno consumato sul naso: i pellegrini lo toccano per fortuna.", L: "Rotoli di sutra in fila. Uno è aperto: «Chi salva una vita salva un mondo intero». Accanto, a carboncino: «e chi ne salva due?».", W: "La finestra sul passo. Si vede il sentiero, il torii e, molto lontano, un filo di fumo." },
        npcs: () => (K.crew.has("sn_shino") ? [] : [{ id: "sn_shino", at: [7, 5] }]),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "Z"); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          put(6, 2, "C"); put(7, 2, "C"); [[2, 3], [11, 2], [2, 6], [11, 6]].forEach(([x, y]) => put(x, y, "E")); put(6, 0, "D"); put(7, 0, "D"); lay(1, 1, 3, 1, "L"); put(11, 0, "W"); put(10, 0, "W");
        },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); g.save(); for (let i = 0; i < 3; i++) { g.fillStyle = `rgba(214,211,209,${0.12 - i * 0.03})`; g.beginPath(); g.arc(d.X(7) + Math.sin(f / 30 + i) * 6, d.Y(1) - ((f / 2 + i * 20) % 40), 4, 0, 7); g.fill(); } g.restore(); H.plaque(g, "CAMPANA DEL PASSO", d.X(7), d.Y(0) + 6, "#fca5a5"); }
      },
      sn_fucina: {
        interior: true, region: "casa", name: "La fucina di Okuma", short: "Fucina", sub: "Fuoco arrabbiato, un'incudine a forma di schiena e un fabbro che canta", bg: "sn_fucina", w: 12, h: 9, start: [6, 7], outside: ["sn_passo", 26, 14], base: "Q",
        act: { H: "Guarda la forgia", T: "Guarda l'incudine", G: "Guarda le lame", z: "Guarda i sacchi", D: "Guarda gli attrezzi" },
        flavor: { H: "La forgia. Il fuoco ha un umore: oggi è arrabbiato. Okuma dice che è colpa del vento del passo.", T: "L'incudine, con un incavo a forma di schiena: Okuma ci si è appoggiato per quarant'anni.", G: "Lame non finite appese al muro. Una non ha mai avuto il manico: «aspetta la mano giusta», dice Okuma.", z: "Sacchi vuoti per il carbone e per la sabbia di ferro.", D: "Martelli dal più piccolo al più grande. Il più grande non entra nella mano di nessuno, tranne una." },
        npcs: () => (K.crew.has("sn_okuma") ? [] : [{ id: "sn_okuma", at: [6, 4] }]),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 11, 8, "Q"); lay(0, 0, 11, 0, "a"); lay(0, 0, 0, 8, "a"); lay(11, 0, 11, 8, "a"); lay(0, 8, 11, 8, "a"); put(6, 8, "v");
          put(2, 1, "H"); put(3, 1, "H"); put(6, 2, "T"); lay(8, 0, 10, 0, "G"); put(1, 6, "z"); put(1, 7, "z"); put(10, 4, "D"); put(10, 5, "D");
        },
        decor(g, cx, cy, d) { const f = window.__sagaCore.util.frNow(); g.save(); g.fillStyle = `rgba(251,146,60,${0.16 + 0.06 * Math.sin(f / 3)})`; g.beginPath(); g.arc(d.X(3), d.Y(1) + 8, 44, 0, 7); g.fill(); g.restore(); H.plaque(g, "OKUMA · FABBRO", d.X(6), d.Y(0) + 6, "#fdba74"); }
      }
    };
    const obj = {
      // la sabbia di ferro: sul greto, dove l'acqua gira intorno al sasso nero
      "sn_passo:r:26,18": () => sabbia(), "sn_passo:r:27,18": () => sabbia()
    };
    function sabbia() {
      if (K.crew.has("sn_okuma") || K.inv.has("sn_ferro")) { say("voce", "Il sasso nero nel fiume. L'acqua ci gira intorno come intorno a un pensiero fisso."); return done(); }
      if (!F.is("sn_ferro_cerca")) { say("voce", "Un grosso sasso nero in mezzo al fiume. Intorno, la sabbia luccica di scuro."); return done(); }
      K.inv.give("sn_ferro"); say("voce", "Ti togli i sandali, entri nell'acqua gelida e riempi il sacco di sabbia nera, pesante come un rimorso. Ottieni la Sabbia di ferro."); done();
    }
    return {
      n: N, title: "Sette prezzi", sub: "Un bosco di bambù, una campana muta, un fabbro gigante e un ragazzo con un nome rubato",
      goal, start: "sn_villaggio", introBg: "sn_passo", zones, talk, obj,
      intro: [["voce", "Ventinove giorni al raccolto. A Sasso Nero i contadini hanno smesso di nascondersi, ma non hanno ancora cominciato a fidarsi."], ["voce", "Kanbei ha fatto i conti sulla terra con un bastoncino: servono altri compagni. Sul passo del Corvo, dicono, ce n'è qualcuno di buono."]]
    };
  }
  boot();
})();
