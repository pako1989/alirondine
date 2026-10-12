// js/mantello-c4.js - IL MANTELLO GRANATA · Capitolo bonus 4 «La Lega»
// Dopo il Dottor Fuorigioco, a Metropolenta arriva una squadra senza nome e senza maglie: i Senzamaglia, quelli che
// nessuna squadra ha mai voluto. Sfidano il Mantello a Super-Bottoni. Per batterli serve una Lega: Brace, Tonno e Madame
// Colla (o il suo operaio Mastice) entrano in squadra, e ognuno porta il suo potere. In partita i poteri girano, a turno.
(function () {
  "use strict";
  function boot() { const D = window.__mantello; if (!D || !D.addChapter || !D._has(3)) return setTimeout(boot, 120); D.addChapter(chapter4); }
  function chapter4(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 4, S = () => K.stepOf(N);
    K.cast("mg_senza", { name: "Capitan Nessuno, dei Senzamaglia", tag: "", hair: "#5a5a5a", style: "messy", skin: "#d9a679", eye: "#3a3a3a", bg: ["#2a2a2a", "#c8c8c8"], shirt: "#c8c8c8" },
      "Il capitano dei Senzamaglia: giocatori che ai provini non sono mai stati scelti. Si allenano in un garage, con un pallone sgonfio e tanta rabbia. Sotto la rabbia, però, c'è solo una gran voglia di avere una maglia.");
    K.cos("mg_c4", { kind: "shirt", label: "Maglia della Lega dei Mantelli", val: "#6a1a4a", from: "Capitolo bonus «La Lega» del Mantello Granata" });
    K.lore("l_lega", { t: "La Lega", d: "Quando un eroe da solo non basta, ne servono tanti, diversi. Nella partita della Lega i poteri girano: ognuno porta il suo, e la barra riparte da metà dopo ogni potere." });
    const MEMBERS = [["mg_brace", "brace"], ["mg_tonno", "tonno"], ["mg_colla", "colla"], ["mg_mastice", "colla"]]; // dalla fabbrica viene Madame Colla (se l'hai aiutata) o Mastice
    const joined = () => ["brace", "tonno", "colla"].filter((k) => F.is("lega_" + k)).length;
    const goal = (s) => ({
      0: "Strani manifesti in tutta Metropolenta: «SFIDA AL MANTELLO». Nonna Tilde, in sartoria, sa già tutto.",
      1: `Forma la Lega (${joined()}/3): la Capitana Brace alla caserma, Tonno e ${F.is("mg_colla_amica") ? "Madame Colla" : "Mastice"} oltre il canale.`,
      2: "La Lega è pronta. Capitan Nessuno dei Senzamaglia aspetta in piazza.",
      3: "Hai battuto i Senzamaglia. Parla con Capitan Nessuno.",
    }[s] || "Il capitolo bonus è concluso.");
    function match() {
      K.ownMatch(window.__bottoni.start, {
        oppStyle: "pressing", title: "Super-Bottoni · la Lega contro i Senzamaglia", us: "La Lega dei Mantelli", usColor: "#6a1a4a", powers: ["fulmine", "gigante", "calamita", "gelo", "doppio"], oppPower: "vento", shots: 8,
        mates: [{ name: "Brace", skin: "#c68642", hair: "#c8642a" }, { name: "Tonno", skin: "#e0b890", hair: "#3a2a1a" }, { name: F.is("mg_colla_amica") ? "Colla" : "Mastice", skin: "#f0d8c0", hair: "#e8e0a0" }],
        opp: { name: "I Senzamaglia", color: "#8a8a8a", players: [{ name: "Nessuno", skin: "#d9a679", hair: "#5a5a5a" }, { name: "Scarto", skin: "#e8c4a0", hair: "#2a2a2a" }, { name: "Riserva", skin: "#c68642", hair: "#1a1a1a" }, { name: "Tribuna", skin: "#f0d0b0", hair: "#8a5a2a" }] },
        intro: "<p>La partita della Lega: i poteri girano, uno per ogni membro (Fulmine, Gigante, Calamita, Gelo, Doppio). I Senzamaglia giocano in pressing, e quando la loro barra è piena alzano il <b>Vento</b>.</p>", winTitle: "KABOOM! LA LEGA VINCE!",
        done: (r) => {
          if (!r.win) return K.scene([["mg_senza", "[furbo] Visto? Anche la Lega si può battere. Rigiochiamo, se hai coraggio. Noi ne abbiamo da vendere: è l'unica cosa che abbiamo."]], () => K.enterZone("mg_piazza"), "mg_piazza");
          setStep(N, 3); bond("fama", 2); K.learnLore("l_lega");
          K.scene([["voce", "POW! SBAM! KABOOM! L'ultimo tiro gira tra cinque poteri come una trottola e finisce in porta. I Senzamaglia restano fermi, a bocca aperta. Poi, piano, applaudono."], ["mg_senza", "[sorpreso] …Cinque eroi diversi, e giocavano come uno solo. (Si guarda la maglietta grigia, senza numero.) Noi non siamo mai stati scelti da nessuno."]], () => K.enterZone("mg_piazza"), "mg_piazza");
        },
      });
    }
    const talk = {
      mg_tilde() {
        if (S() === 0) return say([["mg_tilde", "[pensa] I manifesti? Li ho visti. «I Senzamaglia sfidano il Mantello». Brutto nome, bella idea. Da solo, stavolta, non basti: ti serve una Lega."], ["mg_tilde", "[furbo] Ho già cucito i mantelli. Tre. Uno per la Capitana Brace, uno per Tonno, e uno per chi vuoi tu della fabbrica di colla. Vai a chiederglielo."]], () => { setStep(N, 1); quest("mg_lega", "La Lega dei Mantelli", "Brace, Tonno e la fabbrica di colla."); done(); });
        return K.PASS;
      },
      mg_senza() {
        const s = S();
        if (s === 2) return ask("mg_senza", "Capitan Nessuno, dei Senzamaglia. Nessuno ci ha mai scelti, a nessun provino. Allora abbiamo deciso di scegliere noi: scegliamo di battere il Mantello Granata. A bottoni. Adesso.", [{ label: "Sfida con la Lega", sub: "Super-Bottoni · i poteri girano", cls: "hot", fn: match }, { label: "Non ancora", fn: done }], "mg_piazza");
        if (s === 3) return ask("mg_senza", "Avete vinto. Giusto. (Si toglie la maglietta grigia, la piega.) Torniamo nel nostro garage. Nessuno ci ha mai dato una maglia, e va bene così.", [
          { label: "«Nonna Tilde ve ne cuce una. Granata»", sub: "Una maglia per i Senzamaglia", big: true, fn: () => fine4("maglia") },
          { label: "«Entrate nella Lega»", sub: "Più eroi, più poteri", big: true, fn: () => fine4("lega") },
        ], "mg_piazza");
        return say([["mg_senza", s < 2 ? "La Lega non è ancora pronta? Aspettiamo. Siamo bravissimi ad aspettare: lo facciamo da sempre, in panchina." : "Grazie, Mantello."]]);
      },
    };
    MEMBERS.forEach(([id, k]) => { talk[id] = () => { if (S() !== 1 || F.is("lega_" + k) || (k === "colla" && id !== (F.is("mg_colla_amica") ? "mg_colla" : "mg_mastice"))) return K.PASS; return say([[id, { brace: "[ride] Una Lega? Con il mantello? Ci sto! Porto la moka da quaranta tazze: un eroe stanco non salva nessuno.", tonno: "[felice] Io? Nella Lega? Da titolare? (Si commuove.) Ragazzi, mi hanno scelto. MI HANNO SCELTO.", colla: "Una Lega… tutti insieme, attaccati. (Sorride.) Senza colla, stavolta. Ci sto." }[k]], ["voce", `<b>Entra nella Lega.</b> (${joined() + 1}/3)`]], () => { F.set("lega_" + k, true); if (joined() >= 3) { setStep(N, 2); questDone("mg_lega"); } done(); }); }; });
    function fine4(kind) {
      const msg = K.reward("c4:mg", { coins: 80, cos: ["mg_c4"] }); finishChapter(N, kind); setStep(N, 5);
      K.scene(kind === "maglia" ? [["voce", "Nonna Tilde cuce undici maglie granata in una notte, con Bullone che stira e Gilda che fotografa. Sulla schiena, al posto dei nomi, c'è scritto «SCELTI»."], ["mg_senza", "[sorpreso] Scelti… (La indossa. Gli sta un po' larga. Non se la toglie più.)"]]
        : [["mg_senza", "[felice] Nella Lega? Noi? (I Senzamaglia si guardano, poi esultano, tutti insieme, come dopo un gol.)"], ["voce", "La Lega dei Mantelli diventa di quindici eroi. Il giovedì si allenano tutti insieme, in piazza. Il Dottor Fuorigioco fa l'arbitro: fischia solo quando c'è."]], () => say([["voce", `<b>FINE DEL CAPITOLO BONUS.</b> ${msg.join(" · ")}`]], () => K.openMain()), "mg_piazza");
    }
    const patch = {
      mg_piazza: { npcs: (st, list) => list.concat(S() >= 1 && S() <= 3 ? [{ id: "mg_tonno", at: [27, 10] }, { id: F.is("mg_colla_amica") ? "mg_colla" : "mg_mastice", at: [24, 13] }] : [], S() >= 2 && S() <= 3 ? [{ id: "mg_senza", at: [12, 11] }] : []) },
    };
    return { n: N, title: "La Lega", sub: "Capitolo bonus: i Senzamaglia e i poteri che girano", goal, start: "mg_piazza", introBg: "mg_titolo", talk, patch,
      intro: () => [["voce", "<b>IL MANTELLO GRANATA</b>, numero speciale: «La Lega». Una mattina, tutti i muri di Metropolenta sono coperti di manifesti grigi: «I SENZAMAGLIA SFIDANO IL MANTELLO»."]] };
  }
  boot();
})();
