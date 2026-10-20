// js/circuiti-c4.js - «NEO-RONDINE 2099» · Capitolo 4: Il Cuore del Server Centrale
// La sala server con i laser e le piastre, la Sentinella Quantistica (hack o EMP) e il Nucleo con tre finali.
(function () {
  "use strict";
  function boot() {
    const E = window.__circuitiCore;
    if (!E || !E.api || !E.api.addChapter || !window.__circuitiH || !window.__emp) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__circuitiH(K), { say, done, ask } = H;
    const N = 4, S = () => K.stepOf(N);
    H.people();
    K.cos("nr_c4", { kind: "shirt", label: "Tuta del Nucleo", val: "#facc15", from: "Capitolo 4 di Neo-Rondine 2099" });
    K.lore("l_nucleo", { t: "Il Nucleo", d: "Il server centrale della Vektor: ogni luce, ogni treno, ogni risultato passano da lì. Chi scrive sul Nucleo scrive sulla città." });

    const goal = (s) => ({
      0: "Parla con Kira all'ingresso della sala server.",
      1: "Attraversa la sala (laser, piastre, droni) fino alla Sentinella Quantistica, a nord.",
      2: "La Sentinella è disattivata: entra nel Nucleo, porta nord.",
      3: "Usa la consolle master del Nucleo: scegli il destino di Neo-Rondine.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 4 è concluso.");

    const pads = () => K.inv.count("nr_datapad");
    function ending(id, lines, bg) {
      K.end(id);
      const msg = K.reward("nr_c4", { coins: 150, cos: "nr_c4" });
      K.finishChapter(N, id);
      K.scene(lines.concat([["voce", `<b>FINE DELLA STORIA.</b> ${msg.join(" · ")}<br>Hai trovato un finale. Gli altri ti aspettano nel Diario.`]]), () => K.openMain(), bg || "nr_penthouse");
    }
    function finale() {
      const doss = K.dossier.list("vektor").length;
      ask(`La consolle master è sbloccata. Quale codice carichi nel server centrale? Datapad ${pads()}/6 · Dossier ${doss}/4`, [
        { label: "💾 Carica il virus di K1-RA e libera il segnale", sub: "Finale «Il Codice Libero»", big: true, cls: "hot", fn: () => ending("libero", [
          ["hero", "Kira, il tuo virus. Il tuo nome nel codice."], ["nr_kira", "[felice] Sempre per un mio fratello, e per tutti gli altri."],
          ["voce", doss >= 3 ? "Dall'altra parte della città, l'Ispettore Vance riceve un file completo: bonifici, registri, microfilm. Per la prima volta in quindici anni, il sigaro si riaccende." : "Il firewall corporativo crolla in cascata: ogni schermo del Livello 01 mostra per un istante lo stesso messaggio, «gioca»."],
          ["voce", "Il calcio torna un gioco libero per umani e cyborg di strada. Qualcuno, da un balcone, applaude."]]) },
        { label: "✒️ Firma il contratto di Vektor sulla consolle", sub: "Finale «Il Patto d'Oro»", fn: () => ending("corporativo", [
          ["nr_vektor", "[furbo] Intelligente. Il rimorso è il prezzo di ogni giacca firmata."], ["hero", "Firmo. Per quello che vale, vale molto."],
          ["voce", "Stella della lega commerciale, status d'élite, un attico con vista sulla pioggia. I bassifondi, sotto, continuano a giocare senza di te. Qualcuno, ogni tanto, ti manda un chip d'oro con scritto «grazie»."]]) },
        { label: "📜 Inserisci la sequenza antica dei 6 Datapad", sub: pads() >= 6 ? "Finale segreto" : `Servono 6 Datapad (ne hai ${pads()})`, disabled: pads() < 6, fn: () => ending("segreto", [
          ["voce", "Sei datapad, sei date: 1900, 1912, 1926, 1939, 1950, 1960. La consolle tace, poi suona una melodia di valvole."],
          ["voce", "Il server storico delle Rondini originali si riattiva: i microchip truccati si spengono, i risultati tornano veri, e nessuna luce si spegne."],
          ["nr_nyx", "[felice] Annoto: imparzialità ripristinata. Annoto anche: mi è piaciuto."], ["voce", "Neo-Rondine si libera senza caos. La Cupola resta in piedi. Nessuno più la teme."]]) },
        { label: "📂 Presenta il Dossier (verdetto)", sub: `${doss} prove`, fn: () => K.dossier.verdict("vektor", () => finale(), false, (id, sol, trov) => { F.set("nr_verdict", id); say("voce", id === "diffondi" ? "Hai scelto di diffondere il dossier: Vance ha tutto. Il finale «libero» avrà un epilogo più nitido." : "Hai scelto di consegnarlo a Vance, con la procedura. Lento, ma ufficiale."); done(); }) },
        { label: "Non ancora", fn: done }
      ]);
    }
    function sentinel() {
      say("nr_zero", "[freddo] Sentinella Quantistica. Sono il custode del Nucleo. Il mio portiere non è più un portiere: è una funzione d'onda.");
      H.play(3, "Sentinella Quantistica", "Sovraccarico · Il Server", (r) => {
        if (r && r.win) { F.set("nr_sent_off", true); setStep(N, 2); say("nr_zero", "[pensa] Funzione d'onda collassata. Chiedo di essere archiviato come «sorpresa»."); K.bond("fama", 8); say("voce", "La Sentinella si spegne. La porta del Nucleo, a nord, ronza e si apre."); done(); }
        else { say("nr_zero", "[freddo] Ipotesi respinta. Riprova, oppure cerca un terminale: ci sono altre strade."); done(); }
      });
    }

    const talk = {
      nr_kira() {
        if (K.rel.scene("nr_kira")) return;
        const s = S();
        if (s === 0) {
          say("nr_kira", "[serio] Sala server. Tre file di rack, laser sui varchi, piastre sul pavimento e una sentinella al fondo. Ogni terminale ti dà una porta.");
          say("nr_kira", "Il laser lo spegni con un hack, le piastre con la polarità. Se ti prendono, torni all'inizio: io ti aspetto con una birra sintetica e un'ironia amara.");
          K.learnLore("l_nucleo"); setStep(N, 1); quest("nr_c4", "Il Codice Sorgente", "Attraversa la sala fino alla Sentinella Quantistica.");
          return done();
        }
        say("nr_kira", s === 1 ? "[serio] Nord. Sempre a nord. E non guardare i LED: ipnotizzano." : "[felice] Ti aspetto al Nucleo. Non scordare i datapad."); done();
      },
      nr_zero() {
        if (K.rel.scene("nr_zero")) return;
        const s = S();
        if (s === 1) return ask("La Sentinella Quantistica bloccala porta del Nucleo.", [
          { label: "⚔️ Sfida con il Sovraccarico", sub: "Partita EMP (Livello 3)", big: true, cls: "hot", fn: sentinel },
          { label: "💻 Disattiva dal terminale", sub: "Costa Hacking: usa il terminale della sala", fn: () => { say("voce", "Sulla parete ovest, un terminale con una K: nel menù c'è «Disattivare la Sentinella»."); done(); } },
          { label: "Non ancora", fn: done }
        ]);
        say("nr_zero", "[pensa] Sentinella a riposo. Il Nucleo ti aspetta."); done();
      },
      nr_vektor() {
        if (K.rel.scene("nr_vektor")) return;
        const s = S();
        if (s === 2) {
          say("nr_vektor", "[disperato] Senza il mio algoritmo la lega collasserà nel caos! Non puoi distruggere il progresso!");
          say("nr_vektor", "Un tempo giocavo anch'io. Poi ho capito che il talento muore, e il codice no. Tu sei un bellissimo errore: l'unico che non so correggere.");
          say("nr_kira", "[felice] La consolle master è sbloccata! A te l'ultima parola, Campione.");
          setStep(N, 3); quest("nr_c4b", "Il Bivio", "Usa la consolle master del Nucleo."); return done();
        }
        say("nr_vektor", s < 2 ? "[freddo] Non dovresti essere qui." : "[disperato] La consolle ti aspetta. Io, invece, ho solo rimpianti."); done();
      }
    };

    const hall = (zid) => ({
      "3,15": () => H.hackMenu("Terminale della sala server", [
        { id: "laser_" + zid, label: "Spegnere i laser dei varchi", sub: "Tutti i raggi della sala", cost: 12, run: () => { say("voce", "I raggi rossi si spengono in sequenza, come un coro che ha dimenticato la parte."); done(); } },
        { id: "pol_" + zid, label: "Invertire la polarità delle piastre", sub: "I varchi elettrificati sono liberi", cost: 8, run: () => { say("voce", "Le piastre si spengono con un sospiro stanco."); done(); } },
        { id: "dev_" + zid + "_0", label: "Deviare il drone della sala", sub: "Guarda un muro di rack", cost: 10, run: () => { say("voce", "Il drone si incanta a fissare un LED verde. Sarà felice a lungo."); done(); } },
        { id: "blackout", label: "Forzare un blackout", sub: "I droni si spengono", cost: 6, alert: true, once: false, run: () => { K.clock.set(K.clock.day(), 1); say("voce", "La sala server sprofonda nel buio. La rete ti ha segnato in rosso."); done(); } },
        { id: "ric", label: "Ricarica alla presa", sub: "+20 Carica, passa una fascia", once: false, run: () => { K.bond("energia", 20); K.clock.advance(1, done); } }
      ]),
      "18,10": () => H.hackMenu("Terminale della Sentinella", [
        { id: "sent_hk", label: "Disattivare la Sentinella Quantistica", sub: "Costa molto; l'Allarme sale", cost: 20, alert: true, run: () => { F.set("nr_sent_off", true); setStep(N, 2); say("voce", "La Sentinella cade in uno stato che i manuali chiamano «imbarazzo quantistico». La porta del Nucleo ronza e si apre."); done(); } },
        { id: "ric8", label: "Ricarica alla presa", sub: "+20 Carica, passa una fascia", once: false, run: () => { K.bond("energia", 20); K.clock.advance(1, done); } }
      ]),
      "11,2": () => { if (F.is("nr_sent_off")) return K.go("nr_nucleo", 8, 12); say("voce", "La porta del Nucleo è sigillata dalla Sentinella Quantistica."); done(); }
    });

    const zones = {
      nr_penthouse: {
        region: "penthouse", name: "Neo-Rondine 2099 · La Sala Server", short: "Sala server", sub: "Rack a perdita d'occhio, laser sui varchi e piastre sul pavimento", bg: "nr_penthouse", time: "notte", w: 22, h: 18, base: "k", start: [11, 15], sneakStart: [11, 15],
        itemCos: "nr_c4", items: [[3, 14], [18, 14], [19, 6], [3, 6]], hide: "h",
        areas: [[1, 13, 20, 16, "La sala d'ingresso"], [1, 9, 20, 11, "Il corridoio dei rack"], [1, 5, 20, 7, "Il corridoio nord"], [1, 3, 20, 3, "L'anticamera del Nucleo"], [0, 0, 21, 17, "La Sala Server"]],
        act: { K: "Usa il terminale", N: "Guarda la colonna olografica", F: "Guarda il laser", Q: "Guarda l'insegna", V: "Guarda il distributore", q: "Entra", n: "Leggi il cartello" },
        flavor: { L: "Rack di server: led a decine, una lingua di luce. Ogni lampeggio è una decisione presa da qualcuno che non c'è.", N: "Una colonna olografica: proietta l'organigramma della Vektor. Il Barone è in cima; il fondo è vuoto.", F: "Un laser a tre altezze: una barriera che ti ricorda ogni cosa che non puoi avere.", Q: "«NUCLEO · ACCESSO SOLO AUTORIZZATO · LE RECLAMAZIONI SONO UN ERRORE DI SISTEMA».", V: "Un distributore: «Caffè nero», «Caffè nero ristretto», «Nessuna speranza».", n: "Un cartello: «NON TOCCARE I CAVI. PRENDERESTI LA SCOSSA. SIAMO SERI»." },
        objects: hall("nr_penthouse"),
        onSeen: () => say([["voce", "Un faro ti inquadra: la rete ti riporta all'ingresso con un ringraziamento sarcastico. «Grazie della visita.»"]], done),
        npcs: (s) => {
          const l = [{ id: "nr_kira", at: [8, 15] }];
          if (!F.is("nr_sent_off")) l.push({ id: "nr_zero", at: [11, 5], face: "down" });
          if (!K.hack.on("dev_nr_penthouse_0") && K.clock.slot() !== 1) l.push({ id: "nr_drone", at: [3, 14], route: [[3, 14], [18, 14], [18, 15], [3, 15]], speed: 0.6, guard: { range: 5, cone: 0.55 } });
          else if (K.hack.on("dev_nr_penthouse_0")) l.push({ id: "nr_drone", at: [10, 14], face: "up", guard: { range: 3, cone: 0.3 } });
          if (K.clock.slot() === 2 || K.hack.heat() >= 2) l.push({ id: "nr_drone", at: [2, 10], route: [[2, 10], [19, 10], [19, 6], [2, 6]], speed: 0.65, guard: { range: 5, cone: 0.5 } });
          return l;
        },
        intro: [["voce", "Il penthouse del server centrale. Nessun lusso: solo rack, led e un silenzio ronzante che ha l'aria di un orecchio."], ["voce", "Il Barone è in fondo, al Nucleo. In mezzo, tre file di rack e una sentinella."]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 21, 17, "k"); lay(0, 0, 21, 2, "L"); lay(0, 0, 0, 17, "L"); lay(21, 0, 21, 17, "L"); lay(0, 17, 21, 17, "L"); put(11, 17, "q");
          const lz = K.hack.on("laser_nr_penthouse");
          lay(1, 12, 20, 12, "L"); lay(1, 8, 20, 8, "L"); lay(1, 4, 20, 4, "L");
          lay(4, 12, 5, 12, lz ? "k" : "F"); lay(16, 12, 17, 12, "k"); lay(10, 8, 11, 8, "e"); lay(2, 8, 2, 8, lz ? "k" : "F"); lay(18, 8, 19, 8, "k"); lay(10, 4, 12, 4, "k");
          put(11, 2, "q"); put(3, 15, "K"); put(18, 10, "K"); put(5, 10, "Q");
          [[2, 13], [19, 13], [10, 10], [12, 10], [7, 6], [14, 6]].forEach(([x, y]) => put(x, y, "N"));
          [[7, 14], [14, 14], [9, 11], [3, 11], [19, 11], [5, 5], [17, 5]].forEach(([x, y]) => put(x, y, "h")); put(1, 9, "V"); put(20, 9, "V"); put(8, 3, "n");
        },
        decor(g, cx, cy, d) { H.plaque(g, "SALA SERVER · CENTRALE", d.X(11) + 8, d.Y(2) - 4, "#22d3ee"); H.plaque(g, "NUCLEO ▲", d.X(11) + 8, d.Y(2) + 22, "#facc15"); H.plaque(g, "▼ ELIPORTO", d.X(11) + 8, d.Y(17) - 6, "#fbbf24"); }
      },
      nr_nucleo: {
        interior: true, region: "penthouse", name: "Neo-Rondine 2099 · Il Nucleo", short: "Nucleo", sub: "Un anello di colonne olografiche e una consolle al centro", bg: "nr_penthouse", w: 17, h: 15, start: [8, 12], outside: ["nr_penthouse", 11, 3],
        act: { K: "Usa la consolle master", N: "Guarda la colonna olografica", L: "Guarda i rack", Q: "Guarda l'insegna" },
        flavor: { N: "Una colonna olografica: tifosi, gol, bandiere. Sempre le stesse. Lo stesso gol, da trent'anni.", L: "Un rack antico: il primo server della Vektor. Ha un adesivo scolorito: «Le Rondini 1900».", Q: "«IL FUTURO È GIÀ SCRITTO». Qualcuno ha cancellato «scritto» e vi ha messo «da scrivere»." },
        objects: { "8,3": () => { if (S() < 3) { say("voce", "La consolle master, per ora, ti rifiuta. Parla con il Barone."); return done(); } finale(); } },
        npcs: (s) => [{ id: "nr_kira", at: [4, 9] }].concat(s < 4 ? [{ id: "nr_vektor", at: [8, 6] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 16, 14, "g"); lay(0, 0, 16, 1, "a"); lay(0, 0, 0, 14, "a"); lay(16, 0, 16, 14, "a"); lay(0, 14, 16, 14, "a"); put(8, 14, "v");
          [[3, 3], [13, 3], [3, 10], [13, 10], [8, 8], [6, 6], [10, 6]].forEach(([x, y]) => put(x, y, "N")); put(8, 3, "K"); put(2, 2, "L"); put(14, 2, "L"); put(4, 2, "L"); put(12, 2, "L"); put(8, 1, "Q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "IL NUCLEO", d.X(8) + 8, d.Y(1) + 4, "#facc15"); }
      }
    };
    return {
      n: N, title: "Il Cuore del Server Centrale", sub: "Il Codice Sorgente",
      goal, start: "nr_penthouse", introBg: "nr_penthouse", zones, talk, obj: {},
      intro: [["voce", "La porta della torre si chiude alle tue spalle. Silenzio, poi un ronzio sordo: la Vektor Corp ha un battito, e lo senti nel pavimento."]]
    };
  }
  boot();
})();
