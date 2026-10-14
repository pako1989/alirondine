// js/dungeon-c1.js - DUNGEON DI FINE STAGIONE · Capitolo 1 «La discesa»
// Il Campo Base (un falò sotto lo Stadio Vecchio) e il Piano 1: le Gallerie dei Rimpianti. Il Mister spiega il torneo, Fiamma si unisce a te,
// Ruggine il Capitano ti guarda con sospetto. Per chiudere il capitolo bisogna sciogliere i tre sigilli e battere Asterio, il Terzino.
(function () {
  "use strict";
  function boot() { const D = window.__dungeon; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N), morti = () => F.get("dg_morti", 0) | 0;
    K.cast("dg_mister", { acc: ["occhiali"], name: "Il Mister", tag: "", hair: "#e8e4dc", style: "short", skin: "#d8a47a", eye: "#3a2a1a", bg: ["#241810", "#ff7a1a"], shirt: "#7a1a14", num: "1" },
      "Il custode del Campo Base. Allena la squadra del Torneo di Fine Stagione dal giorno in cui lo Stadio Vecchio ha chiuso. Parla piano, fa le battute con la faccia seria, e non ha mai detto quanti anni ha. Ha un fischietto che non suona più.");
    K.cast("dg_fiamma", { shape: "fiamma", name: "Fiamma", tag: "", skin: "#ff9a3a", eye: "#fff6c0", bg: ["#241810", "#ffd23f"], shirt: "#ff7a1a", num: "7" },
      "Una scintilla del falò del Campo Base che ha deciso di fare il tifo. Brilla quando è felice, fuma quando è offesa e sa tutte le scorciatoie dell'Ipogeo. Dice di non avere paura del buio: è più vero di quanto sembri.");
    K.cast("dg_ruggine", { acc: ["cappellino"], name: "Ruggine, il Capitano", tag: "", hair: "#8a8478", style: "messy", skin: "#a8744a", eye: "#2a2a2a", bg: ["#241810", "#8a8478"], shirt: "#5a5048", num: "5" },
      "Il capitano della squadra di trent'anni fa. Scende nell'Ipogeo ogni fine stagione da allora e non ha mai superato l'ultimo piano. Brontola, ma controlla sempre che tu abbia le scarpe allacciate.");
    K.cast("dg_asterio", { name: "Asterio, il Terzino", tag: "", hair: "#2a1a14", style: "messy", skin: "#a8503a", eye: "#fff0c0", bg: ["#241810", "#a8503a"], shirt: "#6a2a1a", num: "3" },
      "Il Minotauro del Primo Piano, terzino dai tempi del Labirinto. Si è sempre ritenuto un ottimo marcatore: gli attaccanti dicono che marca anche la loro ombra. Gentile con chi ha l'educazione di salutare.");
    K.cos("dg_c1", { kind: "shirt", label: "Maglia del Campo Base", val: "#c8501a", from: "Capitolo 1 di Dungeon di Fine Stagione" });
    K.cos("dg_runa", { kind: "acc", label: "Fascia di brace", val: "cappellino", from: "Trova le Rune di Brace del Piano 1" });
    K.lore("l_stanze", { t: "Le Stanze dell'Ipogeo", d: "Ogni partita è una stanza vista dall'alto. Muovi con la levetta (o le frecce), SCATTO per schivare, TIRO per calciare. Hai dei cuori: se i mitici ti toccano, ne perdi uno. Dopo ogni stanza scegli 1 dono su 3: vale solo per la discesa in corso." });
    K.lore("l_cadute", { t: "Cadere, qui sotto", d: "Se perdi, ricominci dall'ingresso del piano, senza i doni. Ricordi però tutto, e il Registro segna ogni caduta. Chi cade tre volte conosce un passaggio che gli altri non vedono." });
    const goal = (s) => ({
      0: "Il Campo Base, sotto lo Stadio Vecchio. Il Mister aspetta vicino al falò.",
      1: "Scendi dalla Scalinata: tre stanze nel Piano 1, poi la Porta Grande.",
      2: "Il Piano 1 è passato. Il Mister vuole sapere com'è andata.",
    }[s] || "Il primo capitolo è concluso. Puoi continuare con il Capitolo 2.");

    const campo = {
      region: "campo", name: "Dungeon di Fine Stagione · Il Campo Base", short: "Il Campo Base", sub: "Un falò, una scalinata, un muro di nomi", bg: "dg_campo", time: "notte", travel: [14, 15],
      w: 30, h: 20, start: [14, 15], itemCos: "dg_runa", items: [[3, 17], [26, 5], [27, 16]], buio: 0.3, heroLight: 3.8,
      luci: () => [[14, 11, 4.5, "255,150,60"], [14, 1, 3, "255,220,150"], [12, 1, 2.6, "255,150,60"], [16, 1, 2.6, "255,150,60"], [9, 10, 2.6, "255,140,50"], [19, 10, 2.6, "255,140,50"], [4, 1, 2.4, "255,230,170"], [21, 12, 2.4, "255,200,120"]],
      areas: [[10, 8, 18, 14, "Il falò"], [2, 1, 8, 4, "Il Muro dei Caduti"], [12, 1, 16, 7, "La Scalinata"], [0, 0, 29, 19, "Il Campo Base"]],
      flavor: { t: "Un tavolo di assi segnato da mille bicchieri. Qualcuno ci ha scritto con il coltello: «Si riparte».", l: "Una torcia in un anello di ferro. Nessuno ha mai provato a spegnerla: sembra una cosa da maleducati." },
      intro: [["voce", "Lo Stadio Vecchio ha chiuso trent'anni fa. Sotto, nel punto dove si faceva la finale, una scala porta all'Ipogeo: un campo sotterraneo di pietra, torce e porte. Il Campo Base è l'ultima stanza dove si può respirare."], ["voce", "Qui un falò non si spegne, un muro raccoglie i nomi e una scalinata scende nel buio. Ogni fine stagione, sotto, si gioca il Torneo. Per tutti. Compresi quelli che non lo sanno ancora."]],
      npcs: (s) => [{ id: "dg_mister", at: [12, 12] }, { id: "dg_ruggine", at: [22, 13] }, ...(s === 0 ? [{ id: "dg_fiamma", at: [15, 12] }] : [])],
      build(L) {
        const { lay, put } = L;
        lay(0, 0, 29, 0, "a"); lay(0, 19, 29, 19, "a"); lay(0, 0, 0, 19, "a"); lay(29, 0, 29, 19, "a");
        lay(14, 2, 14, 9, ":"); lay(11, 12, 17, 15, ":"); lay(13, 10, 15, 12, "="); put(14, 11, "s");
        put(14, 1, "E"); put(12, 1, "I"); put(16, 1, "I"); put(4, 1, "S"); put(5, 1, "S"); put(7, 1, "N"); put(22, 1, "N");
        [[24, 1], [25, 1], [26, 1]].forEach(([x, y]) => put(x, y, "J"));
        put(9, 10, "A"); put(19, 10, "A"); put(21, 12, "T"); put(22, 12, "T");
        [[4, 15], [5, 15], [26, 6]].forEach(([x, y]) => put(x, y, "M")); put(1, 9, "G"); put(28, 12, "G");
        [[6, 6], [23, 7], [8, 17], [21, 17]].forEach(([x, y]) => put(x, y, "P"));
      },
    };
    const p1 = K.pianoZone(1, { spec: { itemCos: "dg_runa", items: [[24, 3], [4, 16], [20, 15]], areas: [[1, 1, 26, 17, "Le Gallerie dei Rimpianti"]] } });
    const zones = { dg_campo: campo, dg_p1: p1 };

    // ---- la stanza di Asterio (partita importante): prima e dopo
    K.hooks[1] = {
      pre: (go) => K.scene([["dg_asterio", "[felice] (Fa una riverenza, con le corna che sfiorano il soffitto.) Benvenuto nell'area di rigore. Non c'è un'area di rigore, da queste parti: c'è un labirinto. Ma io ho sempre detto «rigore» e ci siamo capiti."], ["dg_fiamma", "[pensa] Asterio gioca a uomo, ma anche a muro. E a toro. Occhio alla carica: si vede arrivare, poi non si vede più."]], go, "dg_p1"),
      won: (r, d) => K.scene([["dg_asterio", "[triste] (È in ginocchio, con il pallone fra le corna.) Ecco. Ecco cosa succede a dare tutto. Trent'anni di marcatura, e un ragazzino mi passa in mezzo ai pilastri."]], () => ask("dg_asterio", "(Ti guarda dal basso. Non chiede niente. Lo chiede tutto.)", [
        { label: "Dagli la mano per rialzarsi", sub: "Pietà", big: true, fn: () => mercy(true) },
        { label: "Prendi il pallone e vai", sub: "Il torneo non aspetta", big: true, fn: () => mercy(false) },
      ], "dg_p1"), "dg_p1"),
      lost: () => [["dg_asterio", morti() > 1 ? "[ride] Di nuovo tu! Ormai ti riconosco dal passo. Quando sei pronto, io sono sempre qui. Non ho molte altre cose da fare." : "[felice] (Dietro la pietra.) Non mi muovo. Se mi serve un riposo, mi siedo."]],
    };
    function mercy(yes) {
      F.set("dg_pieta1", yes ? 1 : 2); bond("pieta", yes ? 1 : -1);
      K.scene(yes ? [["dg_asterio", "[felice] (Si rialza con una mano sul tuo braccio.) Nessuno, in trent'anni, mi aveva dato la mano. Di solito mi danno il pallone, e se ne vanno prima. (Si asciuga una lacrima da toro.) Ti dico un segreto: lassù c'è qualcuno che ti aspetta. Ed è più stanco di me."], ["dg_fiamma", "[felice] Ha detto che sei stanco. Lui. Con le corna!"]]
        : [["dg_asterio", "[triste] (Non si muove. Guarda il pallone che porti via.) …Va bene. È il gioco. Il gioco, a volte, è un tipo antipatico."], ["dg_fiamma", "[pensa] Il pallone era suo. Lo vorrà indietro. Un giorno. O forse non lo vorrà più. Non so cosa sia peggio."]],
      () => { if (S() < 2) setStep(N, 2); questDone("dg_primo"); K.pianoDone(1); }, "dg_p1");
    }

    // ---- allenamento con Ruggine: la partita secondaria sceglie il motore
    function sparring() {
      const after = (r) => { if (r && r.win) bond("ruggine", 1); K.scene([["dg_ruggine", r && r.win ? "[ride] Non male. (Si gratta il mento.) Hai le gambe. Ti manca ancora il fiato dei morti, ma quello vien da sé." : "[pensa] Hai perso, ma hai guardato dove mettere i piedi. Quello conta. Di solito chi perde guarda in aria."]], () => K.enterZone("dg_campo"), "dg_campo"); };
      ask("dg_ruggine", "(Posa il pallone sul tavolo.) Allenamento. Io, te e un'ombra a caso contro due scheletri del Terzo Anello. Se ci riesci, ti dico una cosa utile. Se non ci riesci, te la dico lo stesso, ma con meno entusiasmo. Come la giochiamo?", [
        { label: "Nelle Stanze dell'Ipogeo", sub: "La partita della saga: una stanza di allenamento", cls: "hot", fn: () => K.dungeonMatch({ kind: "scheletri", intro: "Una stanza di prova, con Ruggine che guarda dal bordo." }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "dg_spar", alt: "az,cage,hd", force: false, oppTeam: "Gli Scheletri del Terzo Anello", oppColor: "#cfc8b4", us: "Campo Base", homeKit: ["#c8501a", "#2a1c14"], mate: "Ruggine", squad: ["Ruggine", "Fiamma", "Il Mister"], chap: "Dungeon di Fine Stagione · L'allenamento", bg: "dg_campo", oppNames: ["Femore", "Tibia", "Perone", "Rotula", "Sterno"], intro: "Un allenamento nella sala del Campo Base.", done: after }) },
        { label: "Dopo", fn: done },
      ], "dg_campo");
    }

    const talk = {
      dg_mister() {
        const s = S();
        if (s === 0) return K.scene([["dg_mister", "(Ti guarda sopra gli occhiali. Poi sotto. Poi di nuovo sopra.) Eccoti. La lettera è arrivata. Non volevo scriverla, ma i corvi la spedivano da soli."], ["dg_mister", "Sono il Mister. Tengo il Campo Base. Ogni fine stagione qui sotto si gioca il Torneo: un dungeon in forma di stadio, con porte, mitici in porta e un buon tabellone. Si vince una partita per volta, e quasi sempre non si vince."], ["dg_mister", "Le regole sono quattro. Una: ogni partita è una stanza. Due: dopo ogni stanza ti do un dono, scegli tu uno tra tre. Tre: i doni valgono solo per questa discesa. Quattro: se cadi, ricominci dall'ingresso. Ma ricordi tutto. Questa è la parte che fa male."], ["dg_fiamma", "[felice] Posso venire? Posso venire! Conosco le scorciatoie. Anzi, non le conosco, ma so dove sono."], ["dg_mister", "Fiamma verrà con te. Scherzo: non l'ho scelta io. Lei sceglie sempre per prima."]], () => { setStep(N, 1); quest("dg_primo", "La prima discesa", "Scendi dalla Scalinata, supera le tre stanze del Piano 1 e la Porta Grande."); done(); }, "dg_campo");
        if (s === 1) {
          const n = morti(); return say([["dg_mister", n === 0 ? "La Scalinata è in fondo al corridoio, a nord. In basso trovi tre porte. Scegli quella che ti ispira. Tutte e tre ti ispireranno, a modo loro." : n < 3 ? "Sei ancora tutto intero. Questo conta più di quanto sembri. Torna giù, con calma." : "Hai già imparato a cadere. Non è una virtù. Ma aiuta."], ["dg_mister", "(Controlla il fischietto, lo ripone.) Quando l'ultima porta si apre, il Primo Piano si decide. Ha il nome di un toro, dice il custode. Io dico che ha un nome di terzino."]]);
        }
        if (s === 2) return finish();
        return say([["dg_mister", "Il fischietto è muto. Ma io lo tengo caldo. Non si sa mai."]]);
      },
      dg_fiamma() {
        const s = S();
        if (s === 0) return K.scene([["dg_fiamma", "[ride] Ciao! Sono Fiamma. Sì, sono una fiamma. No, non brucio. Ma fumo, se mi offendi."]], () => done(), "dg_campo");
        return say([["dg_fiamma", s === 1 ? ["[furbo] Le tre porte non sono uguali. Quella di brace dà i premi migliori. Quella di ferro ti dà lo scudo mentale. Quella di legno è la più educata.", "[pensa] Un dono su tre, ricordalo. L'altare nei piani, una volta a discesa, ne dà uno in più.", "[felice] Se cadi non dico niente. Dico solo «ci siamo». Che è un modo di dire niente."][morti() % 3] : "[felice] Tutta la salita! E il toro era gentile. Io dico sempre che i più grossi sono i più morbidi."]]);
      },
      dg_ruggine() {
        const s = S();
        if (s === 0) return say([["dg_ruggine", "(Non alza gli occhi dal pallone.) Un altro. Dicevo: l'ultimo che è sceso è tornato dopo tre giorni con i capelli bianchi. Poi ha scoperto che era caduto in un barile di farina."]]);
        if (s === 1) { if (!F.is("dg_rugg1")) { F.set("dg_rugg1", true); return K.scene([["dg_ruggine", "(Ti squadra. Si alza con il rumore di una vecchia porta.) Capitano di una squadra che non c'è più. Ruggine, per gli amici; Ruggine, anche per gli altri. Se vuoi sapere perché mi chiamano così, guarda le ginocchia."], ["dg_ruggine", "Scendo da trent'anni. Non ho mai passato l'ultimo piano. Se pensi di farcela, ti dico una cosa gratis: non scendere per vincere. Scendi per non smettere. Il resto, dopo."]], () => sparring(), "dg_campo"); }
          return sparring();
        }
        return say([["dg_ruggine", "(Annuisce.) Hai passato il Primo Piano. Anch'io, la prima volta. Poi l'ho dimenticato. Quello che mi manca è ricordarmi che sono stato bravo."]]);
      },
    };
    function finish() {
      questDone("dg_primo");
      const msg = K.reward("c1:dg", { coins: 70, cos: ["dg_c1"] }); finishChapter(N, F.get("dg_pieta1", 0) === 1 ? "pieta" : "dura"); setStep(N, 5);
      K.scene([["dg_mister", "(Ti ascolta senza interrompere. Poi si toglie gli occhiali.) Hai passato il Primo Piano. Non è nulla. È tutto. È la prima cosa che si impara, e anche l'ultima."], ["dg_mister", "Sotto, le cisterne. Dicono che l'acqua sia ferma. Io dico che non è ferma: sta aspettando. Riposati. Il falò non chiude."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Le Cisterne».`]], () => K.openMain(), "dg_campo");
    }
    return { n: N, title: "La discesa", sub: "Il Campo Base, il Mister, Fiamma, le Gallerie dei Rimpianti, il Terzino", goal, start: "dg_campo", introBg: "dg_titolo", zones, talk,
      intro: () => [["voce", "<b>DUNGEON DI FINE STAGIONE</b>. Sotto lo Stadio Vecchio c'è un campo che nessuno ha mai disegnato. Ci si arriva con una lettera, una scala e un po' di cattiva idea. Il Torneo di Fine Stagione comincia adesso."]] };
  }
  boot();
})();
