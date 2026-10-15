// js/titano-c3.js - IL FIGLIO DEL TITANO · Capitolo 3 «La partita del cielo»
// La nave di Elyon si ferma sopra Altamira e apre un campo di nuvole fra le stelle. Orione, il Gran Maestro, propone
// la Partita del Cielo: se la Terra perde, i suoi migliori atleti partono per sempre. E Atlante deve scegliere una squadra.
(function () {
  "use strict";
  function boot() { const D = window.__titano; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone, go } = K;
    const N = 3, S = () => K.stepOf(N);
    K.cast("ft_orione", { beard: "folta", acc: ["corona"], name: "Orione, Gran Maestro di Elyon", tag: "gray", hair: "#e8e8f8", style: "long", skin: "#e8d8f0", eye: "#ffd23f", bg: ["#14183a", "#7a5ad8"], shirt: "#4a3a8a" },
      "Il Gran Maestro di Elyon. Ha giocato il Torneo Eterno per trecento anni e lo considera il regalo più bello dell'universo. Non è cattivo: è sicuro di avere ragione. Che a volte è peggio.");
    K.cos("ft_c3", { kind: "shirt", label: "Maglia della Partita del Cielo", val: "#7a5ad8", from: "Capitolo 3 di Il Figlio del Titano" });
    K.cos("ft_padre", { kind: "acc", label: "Il mantello piegato di Atlante", val: "sciarpa", from: "Finale «Il Titano resta»" });
    K.cos("ft_agenzia", { kind: "acc", label: "Tesserino dell'Agenzia Celeste", val: "medaglia", from: "Finale «Il guardiano del cielo»" });
    K.cos("ft_stelle", { kind: "acc", label: "Pallone di luce di Elyon", val: "fiore", from: "Finale «Verso le stelle»" });
    K.cos("ft_titani", { kind: "acc", label: "Corona dei due Titani", val: "corona", from: "Finale segreto «I due Titani»" });
    K.cos("ft_anelli3", { kind: "acc", label: "Anello di nuvola d'oro", val: "medaglia", from: "Trova l'anello di nuvola dell'arena" });
    const ITEMZ = ["ft_cielo", "ft_porto", "ft_arena"];
    function allRings() { try { const r = K.api.trRec(), Z = K.api.TRZ; return ITEMZ.every((z) => { const n = (Z[z] && Z[z].items || []).length; return !n || ((r.got && r.got[z]) || []).length >= n; }); } catch (e) { return false; } }
    const goal = (s) => ({
      0: "Il campo di nuvole sopra Altamira. Orione, il Gran Maestro di Elyon, vuole parlare con il figlio del Titano.",
      1: "Tuo padre deve scegliere una squadra. Parlagli, prima che lo faccia Orione.",
      2: "La Partita del Cielo. Orione aspetta a centrocampo.",
      3: "Fischio finale. Tua madre è salita fin quassù, non si sa come.",
    }[s] || "La saga è conclusa. Puoi rigiocarla per trovare gli altri finali.");
    const zones = {
      ft_arena: {
        region: "arena", name: "Il Figlio del Titano · Il campo del cielo", short: "Il campo del cielo", sub: "Nuvole, stelle, e la nave di Elyon sopra la testa", bg: "ft_arena", time: "notte", travel: [16, 19],
        w: 34, h: 23, start: [16, 19], itemCos: "ft_anelli3", items: [[2, 2]],
        areas: [[6, 5, 27, 14, "Il campo di nuvole"], [0, 0, 33, 22, "Il campo del cielo"]],
        intro: [["voce", "Sopra Altamira, più in alto degli aerei, la nave di Elyon ha aperto un campo di nuvole compatte fra le stelle. Le righe sono di luce. Le porte sono due anelli che girano piano."], ["voce", "Sotto, lontanissima, la città: tutte le finestre accese. Tutti guardano in su."]],
        npcs: (s) => [{ id: "ft_orione", at: s >= 2 ? [16, 9] : [16, 4] }, { id: "ft_atlante", at: [11, 17] }, { id: "ft_cecile", at: [24, 18] }, ...(F.is("ft_vega_fiducia") || F.is("ft_vega_agenzia") ? [{ id: "ft_vega", at: [21, 17] }] : []), { id: "ft_sam", at: [7, 19] }, ...(s >= 3 ? [{ id: "ft_nora", at: [14, 18] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 33, 22, "&"); lay(0, 0, 33, 0, "C"); lay(0, 0, 0, 22, "C"); lay(33, 0, 33, 22, "C"); lay(0, 22, 33, 22, "C");
          lay(6, 5, 27, 14, ":"); [[2, 6, 4, 8], [29, 6, 31, 8], [3, 15, 4, 16], [28, 15, 30, 16]].forEach(([a, b, c, d]) => lay(a, b, c, d, "C")); put(16, 21, "s");
        },
      },
    };
    function sceltaPadre() {
      ask("ft_atlante", "(Ha la maglia di Elyon in una mano e quella dell'Altamira nell'altra. Non ne indossa nessuna.) Orione aspetta. Ho giocato per Elyon cento partite. Per la Terra nessuna. (Ti guarda.) Dimmi tu.", [
        { label: "«Papà, gioca con noi»", fn: () => risposta("noi") },
        { label: "«Fai quello che devi»", fn: () => risposta("devi") },
        { label: "(…gli porgi la maglia dell'Altamira, senza parlare)", sub: "Se non rispondi in tempo, rispondi così", fn: () => risposta("silenzio") },
      ], "ft_arena", { secs: 8, def: 2 });
      function risposta(k) {
        F.set("ft_scelta", k);
        const fam = K.stat("famiglia"), con = (k === "noi" && (F.is("ft_madre_sa") || fam >= 5)) || (k === "silenzio" && F.is("ft_madre_sa"));
        if (con) F.set("ft_padre_con", true);
        if (F.is("ft_vega_fiducia")) F.set("ft_vega_con", true);
        setStep(N, 2);
        K.scene(con ? [["ft_atlante", "[felice] (Si infila la maglia dell'Altamira. Gli sta stretta: è di tre taglie fa.) Vent'anni fa ho scelto una squadra del cuore. Non ho mai cambiato idea."], ["ft_orione", "[sorpreso] Atlante Varo. Un Titano di Elyon con la maglia di un pianeta minore. (Sorride appena.) Sarà una partita interessante."]]
          : [["ft_atlante", "[triste] (Si infila la maglia viola di Elyon.) Elyon è casa mia. Ma giocherò pulito, figliolo. E se vinci tu… (si ferma) …sarò fiero di aver perso."], ["ft_orione", "[felice] Il Titano torna a casa. Bene. La Partita del Cielo può cominciare."]], () => K.enterZone("ft_arena"), "ft_arena");
      }
    }
    function finale() {
      const padre = F.is("ft_padre_con"), vega = F.is("ft_vega_con");
      K.volo({ title: "Volo a Tutto Campo · La Partita del Cielo contro Elyon", oppStyle: "pressing", minutes: 90, energy: padre ? 120 : 100,
        mates: [{ name: padre ? "Atlante" : vega ? "Vega" : "Sam" }], opp: { name: "Elyon", color: "#7a5ad8", players: [{ name: "Orione", skin: "#e8d8f0", hair: "#e8e8f8" }, { name: padre ? (vega ? "Lumen" : "Vega") : "Atlante", skin: "#d9a679", hair: "#2a1a14" }], keeper: { name: "La Stella Fissa" } },
        intro: `<p>La Partita del Cielo: se vince Elyon, i migliori atleti della Terra partono per il Torneo Eterno. ${padre ? "Tuo padre gioca con te: con lui avete <b>più energia</b>." : "Tuo padre gioca per Elyon: conosce le tue traiettorie."} Orione fa <b>pressing</b>.</p>`, winTitle: "LA TERRA RESTA DELLA TERRA!" }, (r) => {
        if (!r.win) return K.scene([["ft_orione", "[pensa] La Terra resiste. Non vince, ma resiste. (Alza una mano.) Su Elyon, una partita pari si rigioca. Si rigioca finché qualcuno non vince davvero."]], () => K.enterZone("ft_arena"), "ft_arena");
        setStep(N, 3); F.set("ft_vinta", true); bond("cielo", 2);
        K.scene([["voce", "L'ultimo volo attraversa il campo di nuvole come una cometa al contrario. L'anello di Elyon si illumina. Sotto, ad Altamira, si accendono i clacson di tutta la città."], ["ft_orione", "[sorpreso] (Guarda il punteggio a lungo.) La Terra vince la Partita del Cielo. (Abbassa la bandiera viola.) Elyon mantiene la parola. La Grande Raccolta, quest'anno, non ci sarà."]], () => K.enterZone("ft_arena"), "ft_arena");
      });
    }
    function endingAsk() {
      const opts = [{ label: "«Il cielo sopra Altamira lo guardo io»", sub: "Il guardiano del cielo", big: true, fn: () => ending("agenzia") }];
      if (F.is("ft_padre_con")) opts.unshift({ label: "«Papà, torniamo a casa»", sub: "Il Titano resta", big: true, fn: () => ending("padre") });
      if (F.is("ft_vega_fiducia")) opts.push({ label: "«Vega, portami su Elyon»", sub: "Verso le stelle", big: true, fn: () => ending("stelle") });
      if (allRings() && F.is("ft_padre_con") && F.is("ft_vega_fiducia") && !F.is("ft_lasciato")) opts.unshift({ label: "Prendi il pallone e guarda tuo padre: un'ultima partita, voi due", sub: "Segreto: tutti gli anelli, tuo padre e Vega dalla tua parte, nessuna partita lasciata", cls: "hot", big: true, fn: () => ending("titani") });
      ask("ft_nora", "(Salita fin quassù sulla scala d'emergenza del parco, con il cappotto e la torcia del negozio, perché «nessuno mi lascia a terra in una sera così».) Avete vinto. (Ti abbraccia, poi ti guarda.) E adesso, Titano?", opts, "ft_finale");
    }
    function ending(kind) {
      const R = { padre: { coins: 140, cos: ["ft_c3", "ft_padre"] }, agenzia: { coins: 140, cos: ["ft_c3", "ft_agenzia"] }, stelle: { coins: 160, cos: ["ft_c3", "ft_stelle"] }, titani: { coins: 260, cos: ["ft_c3", "ft_titani"] } }[kind];
      const msg = K.reward("end:" + kind, R); K.end(kind); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        padre: [["ft_atlante", "[felice] (Si toglie il mantello di Elyon e lo piega con cura, come una maglia vecchia.) Ho girato cento pianeti. Questo è l'unico dove qualcuno mi aspetta a cena."], ["voce", "<b>FINALE · IL TITANO RESTA.</b> Varo Sport riapre il lunedì dopo. In vetrina, accanto alla maglia numero 1, adesso ce n'è un'altra: la tua."]],
        agenzia: [["ft_cecile", "[felice] (Ti porge un tesserino nuovo, con la tua foto venuta malissimo.) Guardiano del cielo di Altamira. Da oggi, quando qualcosa cade dal cielo, è una faccenda sua."], ["voce", "<b>FINALE · IL GUARDIANO DEL CIELO.</b> Il telefono squilla ogni volta che passa una cometa. Sam ti fa da centralino. Dice che è il lavoro più bello del mondo, «senza volare»."]],
        stelle: [["ft_vega", "[felice] Elyon ti aspetta. Il Torneo Eterno ha bisogno di qualcuno che cambi le regole da dentro. (Sorride.) E io di qualcuno che mi spieghi cos'è una pizza."], ["voce", "<b>FINALE · VERSO LE STELLE.</b> Parti con Vega. Dal campo di Altamira, la sera, si vede una stella nuova che lampeggia due volte: è il tuo modo di dire buonanotte."]],
        titani: [["ft_atlante", "[ride] (Ti passa il pallone. Tu glielo ripassi. Lui ride ancora.) Due Titani. Su Elyon non s'è mai visto."], ["ft_orione", "[sorpreso] (Guarda padre e figlio giocare fra le nuvole, per niente, per divertimento.) Due Titani che giocano per amore. Non avevamo una regola, per questo. (Abbassa la bandiera.) Ne scriveremo una."], ["voce", "<b>FINALE SEGRETO · I DUE TITANI.</b> Elyon cancella la Grande Raccolta, per sempre. Al suo posto, ogni cento anni, una partita amichevole: Terra contro Elyon. Arbitra Nora Varo. Nessuno osa contestare."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4.</span>`]], () => K.openMain(), "ft_finale");
    }
    const talk = {
      ft_orione() {
        const s = S();
        if (s === 0) return K.scene([["ft_orione", "[pensa] (Alto come due uomini, il mantello di stelle, la voce calma come un lago.) Il figlio di Atlante. Ti ho visto volare dal ponte della nave. Hai il volo dei Titani, e il cuore di un pianeta piccolo."], ["ft_orione", "La Grande Raccolta non è una guerra, figliolo: è un invito. Il Torneo Eterno è il regalo più bello dell'universo. Ma Elyon è giusta: lo decideremo con la Partita del Cielo. Se vince la Terra, ce ne andiamo. (Guarda Atlante.) Tuo padre deve scegliere per chi giocare."]], () => { setStep(N, 1); quest("ft_partita", "La Partita del Cielo", "Parla con tuo padre prima della partita."); done(); }, "ft_arena");
        if (s === 2) return ask("ft_orione", "(A centrocampo, sotto la nave.) Le squadre sono pronte. Che vinca chi vola meglio.", [{ label: "Gioca la Partita del Cielo", sub: "Volo a Tutto Campo · la finale", cls: "hot", fn: finale }, { label: "Non ancora", fn: done }], "ft_arena");
        return say([["ft_orione", s >= 3 ? "[pensa] Un pianeta piccolo. Un cuore grande. Lo scriverò nelle cronache di Elyon." : "Tuo padre deve scegliere."]]);
      },
      ft_atlante() {
        const s = S();
        if (s === 1) return sceltaPadre();
        return say([["ft_atlante", s >= 3 ? "[felice] Il cielo è curvo, figliolo. E oggi l'hai girato tutto." : F.is("ft_padre_con") ? "[felice] La maglia è stretta. Non importa." : "[triste] Giocherò pulito. Te lo prometto."]]);
      },
      ft_vega() { return say([["ft_vega", F.is("ft_vega_fiducia") ? (S() >= 2 ? "[felice] Gioco con te, se serve. O contro Orione, almeno. Per me è la stessa cosa." : "[pensa] Orione non ha mai perso una Partita del Cielo. Mai.") : "[pensa] L'Agenzia mi ha lasciata venire. Ma gioco per Elyon. È casa mia, come per tuo padre."]]); },
      ft_cecile() { return say([["ft_cecile", "[pensa] (Guarda la nave sopra la testa, poi il tablet, poi di nuovo la nave.) Vent'anni di domande. Stasera, finalmente, le risposte."]]); },
      ft_sam() { return say([["ft_sam", "[ride] Io non volo, quindi faccio il tifo. A voce alta. Così Orione impara come si fa sulla Terra."]]); },
      ft_nora() { if (S() === 3) return endingAsk(); return say([["ft_nora", "Avete vinto."]]); },
    };
    return { n: N, title: "La partita del cielo", sub: "Orione di Elyon, la scelta di tuo padre, la Partita del Cielo", goal, start: "ft_arena", introBg: "ft_arena", zones, talk,
      intro: () => [["voce", "<b>IL FIGLIO DEL TITANO.</b> Episodio finale. Tre giorni dopo, alle nove di sera, una stella enorme si ferma sopra Altamira. Non è una stella."]] };
  }
  boot();
})();
