// js/mantello-c2.js - IL MANTELLO GRANATA · Capitolo 2 «Madame Colla»
// Una mattina tutti i palloni di Metropolenta sono incollati per terra. La colpa è di Madame Colla, che dalla sua fabbrica
// oltre il fiume di colla vuole che niente, in città, si muova più. Nonna Tilde cuce sul mantello un bottone nuovo:
// forma MINI, piccolo come un bottone, per passare tra le sbarre delle inferriate. Gilda si unisce al gruppo per lo scoop.
// Partita a Super-Bottoni con il potere Bottone Gigante, contro il contro-potere della Colla. Poi una scelta: Madame Colla
// voleva solo che le cose (e le persone) restassero attaccate a lei.
(function () {
  "use strict";
  function boot() { const D = window.__mantello; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);

    K.cast("mg_colla", { acc: ["guanti", "occhiali"], name: "Madame Colla", tag: "", hair: "#e8e0a0", style: "bun", skin: "#f0d8c0", eye: "#5a8a3a", bg: ["#2a3a1a", "#c8e05a"], shirt: "#c8e05a" },
      "Padrona della Fabbrica di Colla di Metropolenta. Ha inventato una colla che tiene tutto: carta, legno, palloni, promesse. Da quando le sue amiche si sono trasferite in un'altra città, ha deciso che niente, qui, se ne deve più andare.");
    K.cast("mg_mastice", { beard: "incolta", acc: ["casco"], name: "Mastice, operaio", tag: "", hair: "#5a4a3a", style: "buzz", skin: "#d9a679", eye: "#3a3a3a", bg: ["#2a3a1a", "#c8e05a"], shirt: "#8a9a4a" },
      "Operaio della fabbrica. Lavora alla colla da trent'anni, e ha le dita sempre un po' appiccicose. Saluta con il gomito, per sicurezza.");
    K.cos("mg_c2", { kind: "acc", label: "Guanti appiccicosi di Madame Colla", val: "guanti", from: "Capitolo 2 del Mantello Granata" });
    K.cos("mg_ritagli2", { kind: "hairc", label: "Capelli Verde Colla", val: "#c8e05a", from: "Trova tutti i ritagli di stoffa della fabbrica" });
    K.cos("mg_amica", { kind: "shirt", label: "Maglia della Colla Gentile", val: "#c8e05a", from: "Aiuta Madame Colla" });
    K.lore("l_mini", { t: "Forma · Mini", d: "Il bottone d'oro che Nonna Tilde ha cucito sul mantello: se lo giri, diventi piccolo come un bottone. Passi tra le sbarre delle inferriate. Le formiche ti salutano. Tu saluti le formiche." });
    K.lore("l_gigante", { t: "Potere · Bottone Gigante", d: "Nella partita a bottoni: il prossimo disco diventa enorme per tutto il tiro. Spinge tutto, para tutto. Per un tiro solo, ma che tiro." });
    K.lore("l_colla", { t: "Contro-potere · Colla", d: "Il trucco di Madame Colla: quando la sua barra è piena, il tuo prossimo tiro va a metà forza. Il bottone resta un po' attaccato al tavolo. Che appiccicume." });
    const goal = (s) => ({
      0: "Tutti i palloni di Metropolenta sono incollati per terra! Gilda, all'edicola, sa da dove arriva la colla.",
      1: "Nonna Tilde ha un'idea per il mantello: vai in sartoria.",
      2: "La Fabbrica di Colla è a est della piazza, oltre il canale (uscita a destra). Il fiume di colla si passa in volo, l'inferriata con la forma Mini.",
      3: "Hai battuto Madame Colla. Parlale: perché voleva incollare tutto?",
    }[s] || "Il secondo numero dell'albo è concluso. Puoi continuare con il Capitolo 3.");
    const zones = {
      mg_fabbrica: {
        region: "fabbrica", name: "Il Mantello Granata · La Fabbrica di Colla", short: "La Fabbrica di Colla", sub: "Un fiume di colla e un'inferriata fitta fitta", bg: "mg_fabbrica", time: "giorno", travel: [2, 11], caption: "INTANTO, ALLA FABBRICA DI COLLA…",
        w: 32, h: 22, start: [2, 11], itemCos: "mg_ritagli2", items: [[4, 3], [12, 19], [26, 14]],
        areas: [[8, 0, 9, 21, "Il fiume di colla"], [16, 4, 28, 16, "Il cortile della fabbrica"], [0, 0, 31, 21, "La Fabbrica di Colla"]],
        act: { "<": "Torna in piazza", z: "Guarda i barili", p: "Guarda la ciminiera" },
        flavor: { z: ["Barili di colla. Etichetta: «COLLA SUPER · Attacca tutto · Non staccare mai».", "Un barile con scritto «COLLA PER CUORI SPEZZATI · prova sperimentale». È vuoto."], p: "Una ciminiera che sbuffa bolle di colla. Le bolle salgono, si attaccano alle nuvole, e le nuvole non si muovono più." },
        intro: [["voce", "La Fabbrica di Colla: un fiume giallo-verde, denso come il miele, ciminiere che fanno bolle, e intorno al cortile un'inferriata così fitta che non ci passa nemmeno un'idea."], ["voce", "Da dentro, una voce cantilena: «Restate qui, restate qui, nessuno se ne va da qui…»."]],
        npcs: (s) => [{ id: "mg_mastice", at: [13, 9], route: [[13, 9], [13, 18], [14, 18], [14, 9]], speed: 0.3, pause: 70 }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 21, 31, 21, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); put(0, 11, "<");
          lay(8, 1, 9, 20, "w"); lay(1, 10, 7, 12, ":"); lay(10, 10, 15, 12, ":");
          lay(16, 4, 28, 4, "I"); lay(16, 16, 28, 16, "I"); lay(16, 4, 16, 16, "I"); lay(28, 4, 28, 16, "I"); lay(17, 5, 27, 15, "+");
          house(19, 6, 7, 5, { door: [22, 10], roof: "#6a7a3a", wall: "#d8d8c0", rr: 3, lit: true, enter: { to: "mg_laboratorio", at: [10, 10] } }); lay(22, 11, 22, 15, ":");
          [[3, 6], [4, 6], [3, 16], [11, 3], [12, 3], [30, 2], [30, 19]].forEach(([x, y]) => put(x, y, "z")); [[20, 2], [25, 18]].forEach(([x, y]) => put(x, y, "p"));
        },
        decor(g, cx, cy, d) { // le bolle di colla che salgono dal fiume
          for (let i = 0; i < 6; i++) { const y = d.Y(20) - ((d.fr * 0.5 + i * 47) % 300), x = d.X(8) + 8 + Math.sin(d.fr / 20 + i) * 8; g.strokeStyle = "rgba(255,255,220,.7)"; g.lineWidth = 1; g.beginPath(); g.arc(x, y, 3 + (i % 3), 0, 7); g.stroke(); }
        },
      },
      mg_laboratorio: {
        interior: true, region: "casa", name: "Il Mantello Granata · Il laboratorio di Madame Colla", short: "Il laboratorio", sub: "Alambicchi, pentoloni e una vecchia foto", bg: "mg_laboratorio", w: 20, h: 13, start: [10, 10], outside: ["mg_fabbrica", 22, 11], caption: "INTANTO, NEL LABORATORIO…",
        act: { T: "Guarda il banco di lavoro", L: "Guarda gli scaffali", W: "Guarda dalla finestra", D: "Guarda la foto sulla credenza", v: "Esci" },
        flavor: { T: "Pentoloni di colla che borbottano. Un quaderno di formule: «Colla per palloni», «Colla per biciclette», «Colla per amiche». L'ultima ha tre punti di domanda.", L: "Barattoli con le etichette scritte a mano: «Attacca carta», «Attacca legno», «Attacca ricordi (non funziona)».", W: "Dalla finestra si vede la stazione dei treni. Madame Colla tiene la tenda aperta, sempre, anche di notte.", D: "Una foto vecchia: quattro ragazze davanti alla fabbrica, abbracciate, che ridono. Una ha i capelli raccolti come Madame Colla. Dietro, scritto a penna: «Per sempre attaccate»." },
        intro: [["voce", "Il laboratorio: pentoloni che borbottano, alambicchi, e in mezzo una donna con i guanti gialli che mescola, mescola, mescola, e canticchia."]],
        npcs: () => [{ id: "mg_colla", at: [10, 4] }],
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(2, 1, 6, 1, "L"); put(14, 1, "W"); put(16, 7, "D"); lay(5, 6, 7, 6, "T"); put(13, 6, "T"); put(2, 10, "s"); },
      },
    };
    function match() {
      K.ownMatch(window.__bottoni.start, {
        oppStyle: "difensiva", title: "Super-Bottoni · contro Madame Colla", us: "Il Mantello e soci", usColor: "#8a1a2a", power: "gigante", oppPower: "colla", shots: 7,
        mates: [{ name: "Bullone", skin: "#b8c4d0", hair: "#8a9aa8" }, { name: "Gilda", skin: "#e8c4a0", hair: "#2a1a3a" }, { name: "Brace", skin: "#c68642", hair: "#c8642a" }],
        opp: { name: "Madame Colla", color: "#8aa83a", players: [{ name: "Colla", skin: "#f0d8c0", hair: "#e8e0a0" }, { name: "Mastice", skin: "#d9a679", hair: "#5a4a3a" }, { name: "Gomma", skin: "#e8c4a0", hair: "#3a2a1a" }, { name: "Ventosa", skin: "#c68642", hair: "#1a1a1a" }] },
        intro: "<p>Madame Colla gioca sul suo tavolo da laboratorio, appiccicoso. Il tuo potere: <b>Bottone Gigante</b>, per sfondare la sua difesa tutta chiusa. Attento alla sua <b>Colla</b>: quando la sua barra è piena, il tuo tiro dopo va a metà forza.</p>", winTitle: "SPLAT! VITTORIA!",
        done: (r) => {
          if (!r.win) return K.scene([["mg_colla", "Ah! Restate! Restate qui a giocare ancora! …Cioè, volevo dire: avete perso. Però potete rigiocare. Per favore."]], () => K.enterZone("mg_laboratorio"), "mg_laboratorio");
          setStep(N, 3); questDone("mg_palloni"); bond("fama", 2); K.learnLore("l_gigante"); K.learnLore("l_colla");
          K.scene([["voce", "BOOOM! Il Bottone Gigante spazza il tavolo come una ruspa gentile, e il pallone rotola in porta, attaccato a tre bottoni e a un barattolo."], ["voce", "In tutta Metropolenta, uno dopo l'altro, i palloni si staccano da terra con un «plop». Al campetto, i Panchinari esultano: hanno appena cominciato la loro prima partita da titolari."], ["mg_colla", "(si toglie i guanti gialli, piano) …Bravi. Avete vinto. Le cose possono muoversi di nuovo. (Guarda la foto sulla credenza.) Tutte."]], () => K.enterZone("mg_laboratorio"), "mg_laboratorio");
        },
      });
    }
    const talk = {
      mg_gilda() {
        const s = S();
        if (s === 0) return say([["mg_gilda", "Hai visto? Tutti i palloni della città sono incollati per terra! Al campetto i Panchinari piangono: oggi dovevano giocare da titolari."], ["mg_gilda", "La colla è giallo-verde, odora di mela. La fa una sola fabbrica: quella di Madame Colla, a est, oltre il fiume. Vengo con te. Non per te: per lo scoop. (Un po' anche per te.)"], ["voce", "<b>Gilda si unisce a te.</b>"]], () => { K.joinParty("mg_gilda"); setStep(N, 1); quest("mg_palloni", "I palloni incollati", "Tutti i palloni di Metropolenta sono incollati per terra. La colla viene dalla fabbrica a est."); done(); });
        return say([["mg_gilda", s >= 4 ? "Titolo di domani: «LA CITTÀ SI STACCA». Non male, eh? Ho fatto anche una foto a Madame Colla. Sorrideva." : "Un'inferriata fitta fitta e un fiume di colla. Per un servizio fotografico, è perfetto. Per entrare, un po' meno."]]);
      },
      mg_tilde() {
        const s = S();
        if (s <= 1) return say([["mg_tilde", "Madame Colla? La conosco. Andavamo a ballare insieme, quarant'anni fa. Era la più brava a stare attaccata al ritmo. (Sospira.) Ha un'inferriata che non ci passa nemmeno uno spillo."], ["voce", "Nonna Tilde prende un bottone d'oro, piccolo piccolo, e lo cuce sul bordo del mantello, a punto croce, in quattro secondi."], ["mg_tilde", "Ecco. Se lo giri, diventi piccolo come lui. Uno spillo no, ma un bottone ci passa. Non restare piccolo troppo a lungo: poi ti vengono le manie di grandezza."], ["voce", "<b>Nuova forma: MINI.</b> Passi tra le sbarre delle inferriate. Dal menu (🦸 Cambia forma) o nelle cabine telefoniche."]], () => { F.set("forma_mini", true); setStep(N, 2); K.learnLore("l_mini"); done(); });
        return say([["mg_tilde", "Saluta Madame Colla da parte mia. Dille che il valzer del giovedì c'è ancora. Lei sa."]]);
      },
      mg_mastice() { return say([["mg_mastice", S() >= 3 ? "Si è staccato tutto! Anche io! Avevo un piede attaccato al pavimento dal 2019. Che sollievo." : "(saluta con il gomito) La signora è dentro. Non vuole visite. Cioè: vuole visite che non se ne vanno più. È diverso."]]); },
      mg_colla() {
        const s = S();
        if (s === 2) return ask("mg_colla", "Un supereroe! Che bello, una visita! Resta, resta. Siediti. (La sedia è incollata, e anche il cuscino.) Vuoi staccare i palloni della città? Allora giochiamo: a bottoni, sul mio tavolo. Se vinci, si stacca tutto. Se vinco io… resti qui. Per sempre. A giocare.", [{ label: "Sfida a Super-Bottoni", sub: "Il tuo potere: Bottone Gigante · il suo: Colla", cls: "hot", fn: match }, { label: "Non ancora", fn: done }], "mg_laboratorio");
        if (s === 3) return ask("mg_colla", "Le mie amiche se ne sono andate tutte, una dopo l'altra. Treni, lavori, matrimoni. Ho pensato: se invento una colla abbastanza forte, almeno quello che resta non se ne va più. I palloni, le panchine, i lampioni. (Ride, e le trema la voce.) Sciocco, vero?", [
          { label: "«Non è sciocco. Ma la colla non serve: serve un invito»", sub: "Aiutala a ritrovare le amiche", big: true, fn: () => fin("amica") },
          { label: "«Hai bloccato una città intera. Ne parlerai con la Capitana Brace»", sub: "Consegnala ai vigili", big: true, fn: () => fin("vigili") },
        ], "mg_laboratorio");
        return say([["mg_colla", F.is("mg_colla_amica") ? "Ho scritto quattro lettere. Senza colla sulla busta: con un francobollo. Si chiude da solo, dicono. Che invenzione." : "La Capitana Brace mi ha dato una multa e una moka di caffè. Una cosa a testa. È giusta, quella donna."]]);
      },
    };
    function fin(kind) {
      if (kind === "amica") { F.set("mg_colla_amica", true); bond("fama", 2); } else { F.set("mg_colla_amica", false); bond("fama", 1); }
      const msg = K.reward("c2:mg", { coins: 70, cos: ["mg_c2"].concat(kind === "amica" ? ["mg_amica"] : []) });
      K.scene(kind === "amica" ? [["voce", "Gilda tira fuori il taccuino. Bullone stampa (con il tostapane) quattro inviti, un po' bruciacchiati agli angoli. «Valzer del giovedì, alla sartoria di Nonna Tilde. Tornate. Anche solo per un ballo.»"], ["mg_colla", "(stringe gli inviti) …E se non vengono?"], ["mg_gilda", "Allora ne scriviamo altri quattro. E poi altri. Gli inviti non si incollano: si mandano."]]
        : [["voce", "Arriva la Capitana Brace, con l'autopompa e una moka da quaranta tazze. Madame Colla si fa portare via senza fare storie. Prima di uscire, prende la foto dalla credenza."], ["mg_colla", "Posso tenerla? È l'unica cosa che voglio tenere attaccata."], ["mg_brace", "Può tenerla. E un caffè, se vuole. Poi parliamo della multa."]], () => { finishChapter(N, kind); setStep(N, 5); say([["voce", `<b>FINE DEL NUMERO 2.</b> ${msg.join(" · ")}<br>Continua nel prossimo numero: «Il Dottor Fuorigioco».`]], () => K.openMain()); }, "mg_laboratorio");
    }
    const obj = {
      "mg_piazza:>": () => go("mg_fabbrica", 2, 11), "mg_fabbrica:<": () => go("mg_piazza", 34, 11),
    };
    const patch = {
      mg_piazza: { build(L) { L.put(35, 11, ">"); }, npcs: (st, list) => list.filter((n) => !(n.id === "mg_gilda" && F.is("party_mg_gilda"))) },
    };
    return { n: N, title: "Madame Colla", sub: "I palloni incollati, la forma Mini, la fabbrica oltre il fiume", goal, start: "mg_piazza", introBg: "mg_fabbrica", zones, talk, obj, patch,
      intro: () => [["voce", "<b>IL MANTELLO GRANATA</b>, numero 2: «Madame Colla». Una mattina, a Metropolenta, tutti i palloni sono incollati per terra. Tutti. Anche quelli nei negozi. Anche quelli disegnati."]] };
  }
  boot();
})();
