// js/stagione-c3.js - STAGIONE INFINITA · Capitolo 3 «Lunedì»
// Teo, Lucio e Mira sono pronti. Stasera la finale va giocata fino in fondo: con i fantasmi di tutte le domeniche
// passate, e i riavvolgimenti che i ricordi regalano. Se vinci, al tramonto il nastro non si riavvolge più.
// Finali: ED È LUNEDÌ · LA SQUADRA A DISTANZA · IL CAMPO NEL PARCO · (segreto) LA DOMENICA DEL GATTO.
(function () {
  "use strict";
  function boot() { const D = window.__stagione; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, setStep, finishChapter } = K;
    const N = 3, S = () => K.stepOf(N), O = () => K.ora(), st = (k) => K.stat(k);
    K.cos("sf_c3", { kind: "acc", label: "Videocassetta d'oro «Lunedì»", val: "medaglia", from: "Completa Stagione Infinita" });
    K.cos("sf_lunedi", { kind: "shirt", label: "Maglia dell'alba di lunedì", val: "#f0b87a", from: "Finale «Ed è lunedì»" });
    K.cos("sf_teo", { kind: "acc", label: "Fascia di Teo", val: "fascia", from: "Finale «La squadra a distanza»" });
    K.cos("sf_ada", { kind: "acc", label: "Chiavi del Lido", val: "chiave", from: "Finale «Il campo nel parco»" });
    K.cos("sf_gatto", { kind: "hairc", label: "Capelli Gatto Rosso", val: "#e8963a", from: "Finale segreto «La domenica del gatto»" });
    const goal = (s) => ({
      0: `Stasera, alle 19, gioca la finale fino in fondo: il mister Bruno è al Lido. Sono le ${K.ORE[O()]}.`,
      1: "La finale è vinta, e il sole tramonta. Il nastro non si riavvolge. Ada ti aspetta al Lido.",
    }[s] || "La storia è conclusa. Dal menu puoi rigiocare i capitoli per gli altri finali.");
    const gattoAll = () => [0, 1, 2, 3].every((k) => F.is("mem_gatto_" + k));
    function finale3() {
      K.finale({ style: "pressing", intro: "<p>L'ultima finale. Hai i <b>fantasmi</b> di tutte le domeniche passate, e un riavvolgimento in più per ogni amico pronto per lunedì. Gioca fino in fondo.</p>", done: (r) => {
        if (!r.win) return K.scene([["voce", "Il Real Lago vince. Teo ti stringe la mano: «Domani riproviamo?». Non sa quanto ha ragione. Al tramonto, il fruscio."]], () => K.rewindDay(() => say([["voce", "Domenica. Otto del mattino. I fantasmi della finale, però, sono ancora con te. E anche loro."]])), "sf_stadio");
        setStep(N, 1);
        K.scene([["voce", "Fischio finale. Avete vinto la Coppa del Lago, l'ultima del Lido."], ["sf_mira", "[ride] (Dal tetto del bar, nel microfono del 1979) «Non è finita la partita, Lago Lungo. È finita la domenica. E la domenica… torna sempre!»"], ["sf_teo", F.is("mem_teo") ? "[felice] Ragazzi, ascoltate. Domani parto. Alle sei. Volevo dirvelo prima, ma dirlo voleva dire che era vero. (La squadra lo abbraccia tutta insieme. Anche quella avversaria.)" : "Bella partita, rivale. La più bella."], ["sf_lucio", "[felice] Ho registrato tutto. Stavolta senza svenire."], ["voce", "Il sole tramonta dietro il lago. Le luci del Lido si spengono, una dopo l'altra. Aspetti il fruscio. Le righe bianche. Il ronzio."], ["voce", "Non arriva. Arriva il buio vero, quello con le stelle. E un grillo, che ieri non c'era."]], () => K.enterZone("sf_stadio"), "sf_stadio");
      } });
    }
    function endingAsk() {
      const opts = [{ label: "«Andiamo a dormire. Domani è lunedì»", sub: "Ed è lunedì", big: true, fn: () => ending("lunedi") }];
      if (st("teo") >= 3) opts.push({ label: "«Accompagniamo Teo al treno. Tutti»", sub: "La squadra a distanza", big: true, fn: () => ending("teo") });
      if (st("ada") >= 6) opts.push({ label: "«Ada, il campo non deve sparire»", sub: "Il campo nel parco", big: true, fn: () => ending("ada") });
      if (gattoAll()) opts.unshift({ label: "Il gatto rosso ti si struscia sulle gambe…", sub: "Segreto: il gatto in tutti e quattro i suoi posti", cls: "hot", big: true, fn: () => ending("gatto") });
      ask("sf_ada", "(Chiude i cancelli del Lido, per l'ultima volta. Poi si ferma, con la chiave in mano.)\n\nQuarantadue domeniche, più le tue. E adesso, lunedì. Non so più com'è un lunedì. Tu te lo ricordi?", opts, "sf_lunedi");
    }
    function ending(kind) {
      const R2 = { lunedi: { coins: 120, cos: ["sf_c3", "sf_lunedi"] }, teo: { coins: 130, cos: ["sf_c3", "sf_teo"] }, ada: { coins: 130, cos: ["sf_c3", "sf_ada"] }, gatto: { coins: 200, cos: ["sf_c3", "sf_gatto"] } }[kind];
      const msg = K.reward("end:" + kind, R2); K.end(kind); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        lunedi: [["voce", "Torni a casa a piedi, lungo il lago. Le foglie cadono in un ordine nuovo. Una, con un buco a forma di cuore, cade per prima."], ["voce", "La sveglia suona. Lunedì, otto e un minuto. Il barista, giù in piazza: «Il solito?». E tu, per la prima volta da tante domeniche, non sai cosa rispondere. È bellissimo."], ["voce", "<b>FINALE · ED È LUNEDÌ.</b> Il Lido chiude, la stagione pure. Ma ne comincia un'altra."]],
        teo: [["voce", "Alle cinque e mezza, alla stazione, c'è tutta la squadra. Anche quella avversaria. Anche Bruno, in pigiama sotto il cappotto. Mira trasmette in diretta dal binario."], ["sf_teo", "[ride] Siete matti. (Sale sul treno, e dal finestrino:) Domenica prossima la giochiamo alla radio! Io da là, voi da qua. Mira fa la cronaca per tutti e due!"], ["voce", "<b>FINALE · LA SQUADRA A DISTANZA.</b> Ogni domenica, da città diverse, la stessa partita alla radio. Teo segna sempre al novantesimo. Dice."]],
        ada: [["voce", "Lunedì arrivano le ruspe. Ma arrivano anche Mira con il microfono, Lucio con la telecamera, Bruno con il fischietto, mezza Lago Lungo con i cartelli: «IL CAMPO RESTA»."], ["sf_ada", "[sorpreso] Il comune dice… che le tribune vanno giù. Ma il campo resta. Un prato, aperto a tutti, con due porte. E una panchina. (Guarda la targa.) Con il mio nome. Il mio nome!"], ["voce", "<b>FINALE · IL CAMPO NEL PARCO.</b> La domenica Ada va lì, apre un cancello che non c'è più, e fischia i fuorigioco ai bambini dei vicini e ai cani. Soprattutto ai cani."]],
        gatto: [["voce", "Il gatto rosso ti si struscia sulle gambe. Lo stesso gatto che hai trovato sul molo, in videoteca, in tribuna, sul lungolago: uno per ogni domenica diversa."], ["sf_ada", "[pensa] Lui… non faceva mai le stesse cose. Tutti ripetevano la domenica. Lui no. Lui cercava. (Ride piano.) Cercava qualcuno che se lo ricordasse."], ["voce", "Lo prendi in braccio. Fa le fusa, forte come un motore. E la domenica, finalmente, finisce."], ["voce", "<b>FINALE SEGRETO · LA DOMENICA DEL GATTO.</b> Lunedì mattina, sul tuo cuscino, c'è un gatto rosso che dorme. Non ti ricordi di avergli dato un nome. Lui sì: si chiama Domenica."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4. Dal menu «Capitoli» puoi rigiocare per scoprire gli altri.</span>`]], () => K.openMain(), "sf_lunedi");
    }
    const talk = {
      sf_bruno() { if (O() === 3 && S() === 0) return ask("sf_bruno", "L'ultima partita al Lido. Vi dirò quello che vi dico da vent'anni… (Si ferma.) No. Stasera vi dico una cosa nuova: giocatela come se domani ci fosse. Perché c'è.", [{ label: "Gioca la finale", sub: "Il Nastro · fino in fondo", cls: "hot", fn: finale3 }, { label: "Non ancora", fn: done }], "sf_stadio"); return K.PASS; },
      sf_ada() { if (S() === 1) return endingAsk(); return K.PASS; },
    };
    return { n: N, title: "Lunedì", sub: "La finale fino in fondo, e la domenica che finisce", goal, start: "sf_piazza", introBg: "sf_lunedi", talk,
      intro: () => [["voce", "<b>STAGIONE INFINITA</b>, capitolo 3. Domenica. Di nuovo. Ma stavolta Teo, Lucio e Mira sono pronti. E tu hai in tasca i fantasmi di tutte le finali che hai già giocato."]] };
  }
  boot();
})();
