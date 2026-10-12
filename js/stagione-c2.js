// js/stagione-c2.js - STAGIONE INFINITA · Capitolo 2 «Tre domeniche»
// Ada ricorda i giri come te. Tre persone non sono pronte per lunedì, e ognuna ha i suoi orari:
//  - Teo, all'alba sul molo, con un biglietto del treno in tasca che non ha mostrato a nessuno;
//  - Lucio, la cassetta della finale del 1986 rovinata sul gol: chi ha segnato? Lo sa Ada, al bar a mezzogiorno;
//  - Mira, che da vent'anni cerca la frase giusta per l'ultimo gol: è nella cassetta di Lucio, se te la presta.
// In una sola domenica non si fa tutto, a meno di conoscere bene gli orari. I RICORDI restano: le domeniche no.
(function () {
  "use strict";
  function boot() { const D = window.__stagione; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N), O = () => K.ora(), G = () => K.giro();

    K.cast("sf_pescatore", { acc: ["paglia"], name: "Nonno Remigio, pescatore", tag: "gray", hair: "#e8e8e8", style: "buzz", skin: "#c68642", eye: "#3a3a3a", bg: ["#1a2a3a", "#e8c84a"], shirt: "#3a5a7a", beard: true },
      "Pesca sul lungolago da sessant'anni e non ha mai preso un pesce, per scelta: «Li conosco tutti per nome». La domenica organizza la partitella dei pescatori, con le canne al posto delle porte.");
    K.cos("sf_c2", { kind: "acc", label: "Cuffie di Radio Lago", val: "cuffie", from: "Capitolo 2 di Stagione Infinita" });
    K.cos("sf_cassetta", { kind: "shirt", label: "Maglia «Finale 1986»", val: "#c8742a", from: "Ritrova il gol di Lucio" });
    K.lore("l_teo", { t: "Ricordo · Il biglietto di Teo", d: "Teo parte domani: un lavoro in un'altra città, un treno alle sei. Non l'ha detto alla squadra, perché dirlo voleva dire che era vero. Adesso l'ha detto." });
    K.lore("l_lucio", { t: "Ricordo · Il gol del 1986", d: "Il gol della finale del 1986 l'ha segnato Lucio, di testa, al novantesimo. Poi è svenuto per l'emozione, cadendo sulla telecamera: per questo la cassetta è rovinata proprio lì. Non se lo ricordava. Adesso sì." });
    K.lore("l_mira", { t: "Ricordo · La frase di Mira", d: "Nella cassetta del 1986, sotto il fruscio, c'è la voce del vecchio radiocronista di Radio Lago: «Non è finita la partita: è finita la domenica. E la domenica, ragazzi, torna sempre». Mira adesso ha la sua frase." });
    const MEMS = ["mem_teo", "mem_lucio", "mem_mira"], nMem = () => MEMS.filter((k) => F.is(k)).length;
    const check = () => { if (nMem() === 3 && S() === 0) { setStep(N, 1); questDone("sf_tre"); } };
    const goal = (s) => ({
      0: `Tre persone non sono pronte per lunedì (${nMem()}/3). Teo all'alba sul molo; Lucio in videoteca (chi ha segnato nel 1986? Ada lo sa, al bar a mezzogiorno); Mira sul lungolago il pomeriggio. Sono le ${K.ORE[O()]}.`,
      1: "Teo, Lucio e Mira sono pronti. Dillo ad Ada.",
    }[s] || "Il secondo capitolo è concluso. Puoi continuare con il Capitolo 3.");
    function rewindTo() { K.rewindDay(() => say([["voce", `Domenica. Otto del mattino. Giro ${G()}. ${nMem() ? `I ricordi ci sono ancora: ${nMem()} su 3.` : "Di nuovo."}`]])); }
    function pescatori() { // partita secondaria: scegli tu la modalità
      ask("sf_pescatore", "La partitella dei pescatori! Le canne per porte, i secchi per bandierine. Come la giochiamo, ragazzo?", [
        { label: "Con Il Nastro", sub: "Una partita breve su videocassetta", big: true, fn: () => K.ownMatch(window.__nastro.start, { title: "Il Nastro · la partitella dei pescatori", us: "Atletico Lago Lungo", usColor: "#e8c84a", seed: "pescatori", memory: {}, rewinds: 2, actions: 4, mates: [{ name: "Gigi" }, { name: "Vale" }], opp: { name: "I Pescatori", color: "#3a8a8a" }, done: pescDone }) },
        { label: "Un'altra partita", sub: "Scegli tu la modalità", big: true, fn: () => K.playMatch({ id: "sf_pescatori", alt: "az,cage,hd", force: false, oppTeam: "I Pescatori del Lago", oppColor: "#3a8a8a", mate: "Teo", us: "Atletico Lago Lungo", homeKit: ["#e8c84a", "#3a3a5a"], chap: "Stagione Infinita · La partitella dei pescatori", bg: "sf_piazza", oppNames: ["Remigio", "Lenza", "Amo", "Galleggiante", "Retino"], intro: "Sul lungolago, con le canne da pesca per porte: l'Atletico Lago Lungo contro i Pescatori.", done: pescDone }) },
        { label: "Un'altra volta", fn: done },
      ], "sf_piazza");
    }
    function pescDone(r) { const msg = K.reward("m:sf_pesc" + G() % 3, { coins: r.win ? 30 : 12 }); say([["sf_pescatore", r.win ? "Battuti! Bene così. I pesci hanno visto tutto, e tifavano per te." : "Abbiamo vinto noi! Ogni domenica vinciamo noi. Cioè, oggi. Che è ogni domenica."], ["voce", msg.join(" · ") || "Bella partitella."]]); }
    const talk = {
      sf_teo() {
        if (O() === 0 && !F.is("mem_teo")) return ask("sf_teo", "(Tira un sasso piatto: uno, due, tre rimbalzi, e giù.) …Tu lo sai, vero? Hai la faccia di chi lo sa. (Tira fuori dalla tasca un biglietto del treno.) Domani alle sei. Un lavoro, in un'altra città. Non l'ho detto a nessuno. Se non lo dico, non è vero.", [
          { label: "«Dillo alla squadra. Stasera, prima della finale»", sub: "Non si parte di nascosto", big: true, fn: () => teo(3) },
          { label: "«Allora resta. Il treno può aspettare»", sub: "Chiedigli di restare", big: true, fn: () => teo(1) },
        ], "sf_piazza");
        return K.PASS;
      },
      sf_lucio() {
        if (F.is("mem_lucio")) {
          if (!F.is("mem_mira") && !F.is("d_cassetta") && O() < 3) return say([["sf_lucio", "[felice] La cassetta del 1986! Prendila, portala a Mira. Sotto il fruscio, sul gol, c'è la voce del vecchio radiocronista. Lei la cerca da vent'anni, quella voce. Sul lungolago, il pomeriggio."]], () => { F.set("d_cassetta", true); done(); });
          return K.PASS;
        }
        if (F.is("d_ada86")) return K.scene([["voce", "Racconti a Lucio quello che ti ha detto Ada. Lui si toglie gli occhiali. Se li rimette. Se li toglie di nuovo."], ["sf_lucio", "[sorpreso] Io? Il gol? Di testa? (Infila la cassetta nel televisore, la riavvolge con la matita fino al fruscio.) …Per quarant'anni ho pensato di aver rovinato la cassetta più bella. Invece l'ho fatta io, la cosa più bella. E sono svenuto sopra la telecamera."], ["sf_lucio", "[ride] Svenuto! Che figura! (Ride, e piange, e ride.) Tieni. Porta la cassetta a Mira. Sul gol, sotto il fruscio, c'è una voce. Lei la cerca da sempre."]], () => { F.set("mem_lucio", true); F.set("d_cassetta", true); K.learnLore("l_lucio"); bond("ada", 1); check(); done(); }, "sf_1986");
        if (O() < 3) return say([["sf_lucio", "La finale del 1986. La più bella, dicono. Rovinata proprio sul gol: il nastro fa «zzzt» e quando torna l'immagine sono già tutti abbracciati. Nessuno si ricorda chi ha segnato. Che strano, eh? Una cosa così, e nessuno se la ricorda."], ["voce", "(Ada era al Lido nel 1986. Forse lei se lo ricorda: a mezzogiorno è al bar, con il suo tè.)"]], () => { F.set("d_lucio", true); done(); });
        return K.PASS;
      },
      sf_ada() {
        if (S() === 1) return ask("sf_ada", "(Ti guarda, e capisce prima che tu parli.) Teo, Lucio e Mira. Tutti e tre. Lo vedo da come camminano: come chi ha posato una valigia.\n\nAllora stasera succederà. O non succederà niente, e sarà lunedì. Fa paura lo stesso, sai? Anche le cose belle fanno paura, quando sono l'ultima volta.", [{ label: "«Stasera giochiamo fino in fondo»", sub: "Conclude il capitolo", big: true, fn: fine2 }], O() === 1 ? "sf_piazza" : "sf_stadio");
        if (O() === 1 && F.is("d_lucio") && !F.is("d_ada86") && !F.is("mem_lucio")) return say([["sf_ada", "[pensa] Il 1986? (Posa il tè.) Certo che me lo ricordo. Novantesimo, calcio d'angolo, e quel ragazzo con gli occhiali sale più in alto di tutti. Di testa. Gol."], ["sf_ada", "[ride] Poi è svenuto per l'emozione, ed è caduto sulla telecamera che stava registrando. Era Lucio. Il gol l'ha segnato Lucio. Non se lo ricorda perché ha sbattuto la testa, e nessuno gliel'ha mai detto: pensavamo lo sapesse."]], () => { F.set("d_ada86", true); bond("ada", 1); done(); });
        if (O() === 3) return ask("sf_ada", `Sera. La finale. ${nMem() < 3 ? `Ne mancano ${3 - nMem()}. Se vuoi, giochi lo stesso: i fantasmi della finale li ricorderai. Oppure lasci che il nastro si riavvolga, e ricominciamo dalle otto.` : "Sono pronti tutti e tre. Parla con me prima, però."}`, [
          { label: "Lascia che il nastro si riavvolga", sub: "Torna a domenica mattina, con i ricordi", big: true, fn: rewindTo },
          { label: "Resta ancora un po'", fn: done },
        ], "sf_stadio");
        return K.PASS;
      },
      sf_mira() {
        if (O() === 2 && F.is("d_cassetta") && !F.is("mem_mira")) return K.scene([["voce", "Mira infila la cassetta in un registratore portatile, sul lungolago. Fruscio. Il pubblico del 1986. Poi, sotto il fruscio, sul gol, una voce vecchia e calda."], ["voce", "«…Non è finita la partita, ragazzi. È finita la domenica. E la domenica, a Lago Lungo, torna sempre.»"], ["sf_mira", "[triste] Il mio maestro. Mi ha insegnato a fare la radio, poi un giorno ha smesso di trasmettere, e non ho mai saputo come si chiude una partita. Cercavo la frase da vent'anni. Era qui."], ["sf_mira", "[felice] Stasera la dico io. Per l'ultima al Lido. Grazie, {n}."]], () => { F.set("mem_mira", true); K.learnLore("l_mira"); bond("ada", 1); check(); done(); }, "sf_radio");
        if (O() === 2 && !F.is("mem_mira")) return say([["sf_mira", "(Guarda l'acqua) Vent'anni che cerco la frase giusta per l'ultimo gol. Il mio maestro ce l'aveva. Io no. (Se ci fosse una registrazione della sua voce, da qualche parte… Lucio ha tutte le finali del Lido.)"]]);
        return K.PASS;
      },
      sf_pescatore() { return pescatori(); },
      sf_bruno() {
        if (O() !== 3) return K.PASS;
        return ask("sf_bruno", "Ci siamo. L'ultima partita al Lido. Giocate semplice, passate la palla, e se il cuore vi batte forte… lasciatelo battere.", [{ label: "Gioca la finale", sub: "Il Nastro · i fantasmi dei giri precedenti ti aiutano", cls: "hot", fn: () => K.finale({ done: (r) => K.scene([["voce", r.win ? "Avete vinto. La Coppa, le luci, Mira che grida. Ma qualcuno, stasera, non è ancora pronto: al tramonto, il fruscio." : "Il Real Lago vince. E al tramonto, il fruscio."]], rewindTo, "sf_stadio") }) }, { label: "Non ancora", fn: done }], "sf_stadio");
      },
    };
    function teo(b) {
      F.set("mem_teo", true); bond("teo", b); K.learnLore("l_teo");
      K.scene(b === 3 ? [["sf_teo", "[pensa] Dirlo. Stasera. Davanti a tutti. (Respira.) Va bene. Se lo dico, è vero. Ma almeno è vero insieme."], ["voce", "Teo tira un ultimo sasso. Uno, due, tre, quattro, cinque, sei, sette rimbalzi. Il suo record."]]
        : [["sf_teo", "[triste] Restare? (Sorride, storto.) Magari. Ma il treno parte lo stesso, sai. Con me o senza. (Si rimette il biglietto in tasca.) Però grazie. Almeno qualcuno lo sa."]], () => { check(); done(); }, "sf_piazza");
    }
    function fine2() {
      const msg = K.reward("c2:sf", { coins: 70, cos: ["sf_c2", "sf_cassetta"] }); finishChapter(N, "pronti"); setStep(N, 5);
      say([["sf_ada", "Allora ci vediamo stasera. Al Lido. Io apro i cancelli alle otto, come sempre. Come ogni volta. Come l'ultima volta."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «Lunedì».`]], () => K.openMain());
    }
    const patch = {
      sf_piazza: { npcs: (st, list) => (K.ora() === 1 || K.ora() === 2 ? list.concat([{ id: "sf_pescatore", at: [31, 17] }]) : list) },
    };
    return { n: N, title: "Tre domeniche", sub: "Teo all'alba, Lucio e il 1986, la frase di Mira", goal, start: "sf_piazza", introBg: "sf_1986", talk, patch,
      intro: () => [["voce", `<b>STAGIONE INFINITA</b>, capitolo 2. Domenica, ${K.ORE[K.ora()]}. Ada ti ha detto tre nomi: Teo, Lucio, Mira. Ognuno ha i suoi orari. I ricordi restano; le domeniche no.`]] };
  }
  boot();
})();
