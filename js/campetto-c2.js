// js/campetto-c2.js - DAL CAMPETTO AL MONDIALE · Capitolo 2 «Il Torneo delle Province»
// Il campetto di Riva Azzurra si iscrive al Torneo delle Province, con le maglie cucite da Rosa. Ci sono i gemelli Ponte,
// che giocano come un solo giocatore con quattro gambe, e c'è Leone Ruggeri delle Fiamme del Porto, che tira così forte
// che i portieri chiudono gli occhi. In finale, il Duello contro il Tiro del Leone.
(function () {
  "use strict";
  function boot() { const D = window.__campetto; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);
    K.cast("cm_ponte_a", { band: "#e74c3c", acc: ["fascia"], name: "Elio Ponte", tag: "", hair: "#e8c84a", style: "spiky", skin: "#f0d0b0", eye: "#3a6a3a", bg: ["#0e1628", "#3a8ad8"], shirt: "#3a8ad8" },
      "Uno dei gemelli Ponte, di Ponteruga. Fa il trampolino: si china, il fratello ci salta sopra e vola. Dice che non fa male. Ha sempre le ginocchia sbucciate.");
    K.cast("cm_ponte_b", { band: "#3fa7ff", acc: ["fascia"], name: "Ezio Ponte", tag: "", hair: "#e8c84a", style: "spiky", skin: "#f0d0b0", eye: "#3a6a3a", bg: ["#0e1628", "#3a8ad8"], shirt: "#3a8ad8" },
      "L'altro gemello Ponte. Quello che vola. Finiscono le frasi l'uno dell'altro, e nessuno, nemmeno la loro mamma, sa chi dei due sia Elio.");
    K.cast("cm_leone", { name: "Leone Ruggeri", tag: "", hair: "#1a1a1a", style: "messy", skin: "#a86a3a", eye: "#3a2a1a", bg: ["#2a0e06", "#e85a1a"], shirt: "#e85a1a", num: "9" },
      "Il centravanti delle Fiamme del Porto. Si allena tirando contro la saracinesca del magazzino del padre, finché la saracinesca non si è piegata. Non sorride mai in campo. Fuori, un po'. Pochissimo.");
    K.cos("cm_c2", { kind: "acc", label: "Fascia del Torneo delle Province", val: "fascia", from: "Capitolo 2 di Dal Campetto al Mondiale" });
    K.cos("cm_palloni2", { kind: "hairc", label: "Capelli Rosso Fiamma", val: "#e85a1a", from: "Trova tutti i palloni firmati del Torneo delle Province" });
    K.lore("l_catapulta", { t: "La Catapulta dei Ponte", d: "Un gemello si china, l'altro ci salta sopra, e tu tiri dal cielo. È il tiro speciale più faticoso: costa 40 di grinta, ma il portiere non lo vede nemmeno arrivare." });
    K.lore("l_leone", { t: "Il Tiro del Leone", d: "Il tiro di Leone Ruggeri: niente effetto, niente trucchi, solo forza. Quando lo carica, la terra sotto il piede si crepa. In difesa, quando lo vedi arrivare, contrasta prima che tiri." });
    const goal = (s) => ({
      0: "Il Torneo delle Province! Bastiano vi aspetta davanti allo stadio.",
      1: "I gemelli Ponte, di Ponteruga, vogliono sfidarvi nel campo d'allenamento.",
      2: "In finale, le Fiamme del Porto di Leone Ruggeri. Leone è a bordo campo.",
      3: "Hai battuto il Tiro del Leone. Leone vuole parlarti.",
    }[s] || "Il capitolo 2 è concluso. Puoi continuare con il Capitolo 3.");
    const zones = {
      cm_provincia: {
        region: "stadio", name: "Dal Campetto al Mondiale · Il Torneo delle Province", short: "Il Torneo delle Province", sub: "Lo stadio di provincia, i campi d'allenamento, le bancarelle", bg: "cm_provincia", time: "giorno", travel: [16, 19],
        w: 32, h: 22, start: [16, 19], itemCos: "cm_palloni2", items: [[2, 2], [29, 3], [2, 19]],
        areas: [[19, 12, 29, 18, "Il campo d'allenamento"], [0, 0, 31, 21, "Il Torneo delle Province"]],
        flavor: { t: "Un platano con la bandierina del torneo legata a un ramo. Sotto, una bancarella vende panini con la frittata." },
        intro: [["voce", "Il Torneo delle Province: sedici squadre, uno stadio vero con le tribune di cemento, e un campo d'allenamento dove le squadre si guardano storto. Il campetto di Riva Azzurra arriva con le maglie cucite da Rosa. Sono un po' larghe. Ma sono blu."]],
        npcs: (s) => [{ id: "cm_bastiano", at: [16, 9] }, { id: "cm_gino", at: [12, 16] }, { id: "cm_pio", at: [9, 16] },
          ...(s >= 1 && s <= 1 ? [{ id: "cm_ponte_a", at: [23, 14] }, { id: "cm_ponte_b", at: [25, 14] }] : s >= 2 ? [{ id: "cm_ponte_a", at: [14, 17] }, { id: "cm_ponte_b", at: [18, 17] }] : []),
          ...(s >= 2 && s <= 3 ? [{ id: "cm_leone", at: [26, 7] }] : []), ...(F.is("cm_rivale_saverio") ? [{ id: "cm_saverio", at: [6, 9] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "t"); lay(0, 21, 31, 21, "t"); lay(0, 0, 0, 21, "t"); lay(31, 0, 31, 21, "t");
          lay(1, 19, 30, 20, ":"); lay(16, 6, 16, 18, ":"); lay(4, 11, 15, 11, ":"); lay(17, 11, 28, 11, ":");
          house(11, 1, 11, 5, { door: [16, 5], roof: "#8a8a9a", wall: "#d8d8e0", rr: 3, enter: { to: "cm_spogliatoio", at: [10, 10] } });
          put(19, 15, "Q"); put(29, 15, "Q");
          house(3, 2, 5, 3, { door: [5, 4], roof: "#e85a1a", wall: "#f4f0e4", rr: 2, enter: "La bancarella dei panini con la frittata. Il signore dei panini conosce il risultato di tutte le partite del torneo dal 1974. Dice che Bastiano Loi, a quindici anni, ne mangiava tre per tempo." });
          [[2, 8], [29, 8], [8, 14], [2, 15], [29, 19]].forEach(([x, y]) => put(x, y, "t")); put(13, 19, "s");
        },
      },
      cm_spogliatoio: {
        interior: true, region: "casa", name: "Dal Campetto al Mondiale · Lo spogliatoio", short: "Lo spogliatoio", sub: "Panche, armadietti e la lavagna di Bastiano", bg: "cm_spogliatoio", w: 20, h: 13, start: [10, 10], outside: ["cm_provincia", 16, 6],
        act: { L: "Guarda la lavagna", T: "Guarda la panca", v: "Esci" },
        flavor: { L: "La lavagna: Bastiano ci ha disegnato un'aquila. Sotto, con un'altra calligrafia (Pio), un triangolo con le frecce. Sotto ancora (Gino): un'acciuga.", T: "La panca dello spogliatoio. Qualcuno ci ha inciso «L.R.» con un chiodo: Leone Ruggeri si è cambiato qui, l'anno scorso." },
        intro: [["voce", "Lo spogliatoio: odore di canfora, armadietti di ferro, una lavagna. Bastiano ci ha già disegnato qualcosa."]],
        npcs: () => [],
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(3, 1, 8, 1, "L"); lay(4, 6, 15, 6, "T"); put(2, 10, "s"); },
      },
    };
    function gemelli() { // la partita secondaria: la modalità la scegli tu
      K.playMatch({ id: "cm_ponte", alt: "az,cage,hd", force: false, oppTeam: "I Gemelli di Ponteruga", oppColor: "#3a8ad8", mate: "Pio", squad: ["Gino", "Pio", "Rosa"], us: "Il campetto di Riva Azzurra", homeKit: ["#1f5fbf", "#ffd23f"], chap: "Dal Campetto al Mondiale · La sfida dei gemelli Ponte", bg: "cm_provincia", oppNames: ["Il Portiere", "Elio Ponte", "Ezio Ponte", "Il Mediano", "La Punta"], intro: "Nel campo d'allenamento: i gemelli Ponte giocano come un solo giocatore con quattro gambe. Se li batti, ti insegnano il loro segreto.",
        done: (r) => {
          if (!r.win) return K.scene([["cm_ponte_a", "[ride] Quattro gambe—"], ["cm_ponte_b", "—battono due gambe. Riprova!"]], () => K.enterZone("cm_provincia"), "cm_provincia");
          K.scene([["cm_ponte_a", "[sorpreso] Ci hai battuti—"], ["cm_ponte_b", "—e allora ti insegniamo la Catapulta. Io mi chino—"], ["cm_ponte_a", "—io volo, e tu tiri dal cielo. Pronto?"]], () => K.allena({ title: "La Catapulta dei Ponte", sub: "Il gemello si china, l'altro vola: tu calci quando è in cima. Tre volte di fila.", hard: true }, (ok) => {
            if (!ok) return say([["cm_ponte_b", "Sei caduto—"], ["cm_ponte_a", "—succede. Torna quando vuoi."]]);
            F.set("cm_sp_catapulta", true); K.learnLore("l_catapulta"); bond("amicizia", 2); setStep(N, 2); K.refreshZone();
            K.scene([["voce", "Elio si china, Ezio ci salta sopra, vola, e a metà del volo il pallone parte dal tuo piede come da una fionda. La rete si gonfia, la traversa trema."], ["cm_ponte_b", "[felice] Perfetta—"], ["cm_ponte_a", "—e da oggi giochiamo con voi. Ponteruga è stata eliminata ieri, comunque."]], done, "cm_provincia");
          }), "cm_provincia");
        } });
    }
    function finale() {
      K.duello({ title: "Duello Cinematico · Finale contro le Fiamme del Porto", us: "Riva Azzurra", oppStyle: "pressing", minutes: 90,
        mates: [{ name: "Pio" }, { name: "Elio Ponte" }, { name: "Gino" }], opp: { name: "Fiamme del Porto", color: "#e85a1a", players: [{ name: "Brace", skin: "#c68642", hair: "#1a1a1a", pow: 11 }, { name: "Tizzone", skin: "#d9a679", hair: "#3a1a0a", pow: 12 }, { name: "Leone Ruggeri", skin: "#a86a3a", hair: "#1a1a1a", pow: 14 }], keeper: { name: "Il Fornaio", pow: 14 }, ace: { name: "Leone Ruggeri", special: "Tiro del Leone" } },
        intro: "<p>La finale del Torneo delle Province. Quando le Fiamme hanno palla, a volte la dà a Leone: il <b>Tiro del Leone</b> è fortissimo. Fermali prima. In attacco hai l'Aquila e, se l'hai imparata, la Catapulta dei Ponte.</p>", winTitle: "CAMPIONI DELLE PROVINCE!" }, (r) => {
        if (!r.win) return K.scene([["cm_leone", "[pensa] Bravi. Non abbastanza. (Si sistema il numero nove.) Si rigioca: il regolamento lo dice. E io voglio vincere contro di voi quando giocate al massimo."]], () => K.enterZone("cm_provincia"), "cm_provincia");
        setStep(N, 3); K.learnLore("l_leone"); bond("sogno", 2);
        K.scene([["voce", "Novantesimo minuto. Il campetto di Riva Azzurra, dietro una pescheria, ha vinto il Torneo delle Province. Rosa piange in tribuna, abbracciata alla bancarella dei panini."], ["cm_leone", "[sorpreso] (Resta in mezzo al campo, le mani sui fianchi.) …Nessuno aveva mai fermato il mio tiro due volte nella stessa partita."]], () => K.enterZone("cm_provincia"), "cm_provincia");
      });
    }
    const talk = {
      cm_bastiano() {
        if (S() === 0) return say([["cm_bastiano", "[pensa] Sedici squadre. Le più forti sono le Fiamme del Porto: hanno un centravanti, Leone Ruggeri, che tira come tiravo io. Più forte, forse."], ["cm_bastiano", "[furbo] Ma prima, nel campo d'allenamento, ci sono due gemelli che vi guardano da stamattina. Andate a vedere cosa vogliono."]], () => { setStep(N, 1); quest("cm_torneo", "Il Torneo delle Province", "I gemelli Ponte nel campo d'allenamento, poi la finale."); done(); });
        return say([["cm_bastiano", S() >= 3 ? "[ride] Campioni delle Province. Il campetto. (Si soffia il naso, rumorosamente.) È la sabbia, eh. C'è tanta sabbia." : "Testa alta. E il pallone è un amico."]]);
      },
      cm_ponte_a() { if (S() === 1) return ask("cm_ponte_a", "Siamo i gemelli Ponte—\n\n(L'altro, da dietro:) —e giochiamo come uno solo. Una partita, adesso, qui. Se vinci tu, ti insegniamo il nostro segreto.", [{ label: "Sfida i gemelli Ponte", sub: "Partita secondaria · scegli tu la modalità", big: true, fn: gemelli }, { label: "Non ancora", fn: done }], "cm_provincia"); return say([["cm_ponte_a", "Io mi chino—"], ["cm_ponte_b", "—io volo."]]); },
      cm_ponte_b() { return talk.cm_ponte_a(); },
      cm_leone() {
        if (S() === 2) return ask("cm_leone", "(Fa rimbalzare il pallone sulla testa, senza guardarlo.) Il campetto di Riva Azzurra. Ho sentito del tiro che sale. (Il pallone si ferma sul collo del piede.) Il mio non sale. Va dritto. Sempre.\n\nCi vediamo in finale. Adesso.", [{ label: "Gioca la finale contro le Fiamme del Porto", sub: "Duello Cinematico · il Tiro del Leone", cls: "hot", fn: finale }, { label: "Non ancora", fn: done }], "cm_provincia");
        if (S() === 3) return ask("cm_leone", "(Ti si avvicina. Non ti dà la mano: ti dà il pallone della finale.) Tienilo. Il prossimo anno c'è la Nazionale giovanile. Il Mondiale. Io ci vado.\n\nTu?", [
          { label: "«Andiamoci insieme, Leone»", sub: "Lo chiami in squadra", big: true, fn: () => fine2("insieme") },
          { label: "«Ci rivediamo là. Da avversari, se serve»", sub: "Il sogno prima di tutto", big: true, fn: () => fine2("rivali") },
        ], "cm_provincia");
        return say([["cm_leone", "Dritto. Sempre."]]);
      },
      cm_saverio() { return say([["cm_saverio", S() >= 3 ? "[ride] Avete vinto il torneo. Noi siamo usciti in semifinale. Ho preso un gol. Uno. (Lo dice come se fosse un vanto.) Il tuo era più bello." : "[furbo] Il Collegio è in semifinale. Io sono ancora imbattuto, qui. Ricordatelo."]]); },
      cm_gino() { return say([["cm_gino", "[ride] Rosa ha portato le acciughe sott'olio per tutta la squadra. Le Fiamme del Porto ci hanno chiesto la ricetta. Non gliela diamo."]]); },
      cm_pio() { return say([["cm_pio", "Ho rifatto il quaderno: con i Ponte i triangoli diventano quadrati. Il calcio è ancora geometria, ma più complicata."]]); },
    };
    function fine2(kind) {
      if (kind === "insieme") { F.set("cm_leone_amico", true); bond("amicizia", 2); } else bond("sogno", 1);
      const msg = K.reward("c2:cm", { coins: 70, cos: ["cm_c2"] }); finishChapter(N, kind); setStep(N, 5); questDone("cm_torneo");
      K.scene(kind === "insieme" ? [["cm_leone", "[sorpreso] Insieme. (Ci pensa. A lungo.) Il tuo tiro sale, il mio va dritto. Insieme fanno… un angolo. Pio sarà contento."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «Il Mondiale».`]]
        : [["cm_leone", "[ride] Da avversari. (Sorride, davvero, per mezzo secondo.) Così mi piace. Allenati, numero dieci."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «Il Mondiale».`]], () => K.openMain(), "cm_provincia");
    }
    return { n: N, title: "Il Torneo delle Province", sub: "I gemelli Ponte, la Catapulta, il Tiro del Leone", goal, start: "cm_provincia", introBg: "cm_provincia", zones, talk,
      intro: () => [["voce", "<b>DAL CAMPETTO AL MONDIALE</b>, puntata 2. La notizia ha fatto il giro della costa: il campetto di Riva Azzurra ha segnato a Saverio Muro. E adesso si iscrive al Torneo delle Province."]] };
  }
  boot();
})();
