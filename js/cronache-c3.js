// js/cronache-c3.js - LE CRONACHE DEL PALLONE DI CRISTALLO · Capitolo 3 «Le Stelle e il Fuoco»
// La Montagna di Fuoco: il Cristallo del Fuoco si riaccende solo con un rigore, e Lyra, che ha giurato di non tirare più,
// deve scegliere. Poi il ponte di luce verso lo Stadio delle Stelle, dove il Re del Silenzio — un vecchio portiere che
// nessuno ha mai applaudito — difende l'ultimo cristallo. Partita ATB finale con il gruppo al completo.
// Finali: LE STAGIONI RITORNANO · LA CAVALIERA DEL PRATO · LA VOCE DEL SILENZIO · (segreto) IL QUINTO CRISTALLO.
(function () {
  "use strict";
  function boot() { const D = window.__cronache; if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N), st = (k) => K.stat(k);

    K.cast("cc_re", { acc: ["corona", "guanti"], name: "Il Re del Silenzio", tag: "gray", hair: "#c8c8d8", style: "slick", skin: "#d8c8b8", eye: "#5a5a8a", bg: ["#0a0a2a", "#c8a8ff"], shirt: "#2a2a5a", beard: true },
      "Un tempo era il portiere più forte del mondo. Parò tutto, per quarant'anni, e nessuno esultò mai per una sua parata: si esulta per i gol, non per chi li evita. Un giorno smise di aspettare un applauso, e decise che nessuno ne avrebbe più avuti.");
    K.cast("cc_fabbra", { acc: ["grembiule", "chiave"], name: "Brunilde, fabbra del vulcano", tag: "", hair: "#c84a1a", style: "bun", skin: "#c68642", eye: "#3a2a1a", bg: ["#3a1a10", "#ff8a5a"], shirt: "#5a3a2a" },
      "Forgia palloni di metallo per le porte del vulcano. Custodisce il Cristallo del Fuoco da quando era bambina. Ride forte come il suo martello, e piange forte uguale.");
    K.cos("cc_c3", { kind: "acc", label: "Corona dei quattro cristalli", val: "corona", from: "Completa Le Cronache del Pallone di Cristallo" });
    K.cos("cc_stagioni", { kind: "shirt", label: "Maglia delle quattro stagioni", val: "#7ab860", from: "Finale «Le stagioni ritornano»" });
    K.cos("cc_cavaliera", { kind: "acc", label: "Scudo di Lyra", val: "#8a9aaa", from: "Finale «La cavaliera del Prato»" });
    K.cos("cc_silenzio", { kind: "acc", label: "Guanti del Re del Silenzio", val: "guanti", from: "Finale «La voce del silenzio»" });
    K.cos("cc_quinto", { kind: "acc", label: "Aura del quinto cristallo", val: "#e8e8ff", from: "Finale segreto «Il quinto cristallo»" });
    K.cos("cc_fuoco", { kind: "hairc", label: "Capelli Cristallo di Fuoco", val: "#ff8a5a", from: "Trova tutte le schegge del vulcano e delle stelle" });
    K.lore("l_fuoco", { t: "Il Cristallo del Fuoco", d: "Si riaccende solo con un rigore tirato da chi ha paura di sbagliarlo. Brunilde dice che è il cristallo più giusto: il coraggio vero è tirare quando tremi." });
    K.lore("l_stelle", { t: "Lo Stadio delle Stelle", d: "Uno stadio sospeso nel cielo, sopra il mondo, dove le tribune sono costellazioni. Lì il Re del Silenzio ha portato l'ultimo cristallo, perché nessuno potesse più esultare vicino a lui." });

    const goal = (s) => ({
      0: "Due cristalli brillano. Il Cristallo del Fuoco è nella Montagna di Fuoco, a nord-est della mappa del mondo.",
      1: "Nella Montagna di Fuoco, Brunilde la fabbra custodisce il cristallo.",
      2: "Il ponte di luce porta allo Stadio delle Stelle: sulla mappa del mondo, il castello tra le nuvole a nord.",
      3: "Hai battuto il Re del Silenzio. Parlagli.",
    }[s] || "La storia è conclusa. Dal menu puoi rigiocare i capitoli per gli altri finali.");
    const ITEMZ = ["cc_mondo", "cc_prato", "cc_bosco", "cc_porto", "cc_isola", "cc_vulcano", "cc_stelle"];
    function allShards() { // il segreto: tutte le schegge del mondo (gli oggetti raccolti in ogni zona della saga)
      try { const r = K.api.trRec(), Z = K.api.TRZ; return ITEMZ.every((z) => { const n = (Z[z] && Z[z].items || []).length; return !n || ((r.got && r.got[z]) || []).length >= n; }); } catch (e) { return false; }
    }
    const zones = {
      cc_vulcano: {
        region: "fuoco", name: "Le Cronache · La Montagna di Fuoco", short: "La Montagna di Fuoco", sub: "Lava, forge e un rigore da tirare", bg: "cc_vulcano", time: "tramonto", travel: [15, 18],
        w: 30, h: 20, start: [15, 18], items: [[3, 3], [26, 3], [3, 16]],
        areas: [[9, 4, 21, 12, "Il campo di brace"], [0, 0, 29, 19, "La Montagna di Fuoco"]], act: { v: "Torna sulla mappa del mondo", Y: "Guarda il cristallo" },
        intro: [["voce", "La Montagna di Fuoco: rivoli di lava che scorrono piano come miele, forge accese, e in cima un campo di pietra nera con una sola porta. Davanti alla porta, sul dischetto, un cristallo arancione, spento."], ["voce", "Una donna con le braccia nere di fuliggine batte il martello su un pallone di ferro. Si ferma quando vi vede. «Finalmente», dice."]],
        npcs: (s) => [{ id: "cc_fabbra", at: [12, 14] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 0, 0, 19, "a"); lay(29, 0, 29, 19, "a"); lay(0, 19, 29, 19, "a");
          lay(1, 6, 6, 8, "~"); lay(23, 10, 28, 12, "~"); lay(9, 4, 21, 12, "+"); put(15, 4, "Y"); lay(14, 13, 16, 18, ":"); put(15, 19, "v"); lay(2, 2, 4, 4, ":"); lay(25, 2, 27, 4, ":"); lay(2, 15, 4, 17, ":");
          lay(4, 4, 8, 4, ":"); lay(21, 4, 25, 4, ":"); lay(4, 9, 4, 15, ":"); lay(5, 14, 13, 14, ":");
        },
        decor(g, cx, cy, d) { // la porta di pietra nera e il dischetto
          g.strokeStyle = "#ffd23f"; g.lineWidth = 2; g.strokeRect(d.X(13), d.Y(3) + 6, 48, 12); g.fillStyle = "rgba(255,210,63,.6)"; g.beginPath(); g.arc(d.X(15) + 8, d.Y(8), 3, 0, 7); g.fill();
        },
      },
      cc_stelle: {
        region: "stelle", name: "Le Cronache · Lo Stadio delle Stelle", short: "Lo Stadio delle Stelle", sub: "Le tribune sono costellazioni", bg: "cc_stelle", time: "notte", travel: [15, 18],
        w: 30, h: 20, start: [15, 18], items: [[2, 2], [27, 2]],
        areas: [[6, 4, 23, 13, "Il campo delle stelle"], [0, 0, 29, 19, "Lo Stadio delle Stelle"]], act: { v: "Torna sulla mappa del mondo", Y: "Guarda il cristallo" },
        intro: [["voce", "Lo Stadio delle Stelle: un campo sospeso nel cielo, così in alto che il mondo sotto sembra un pallone. Le tribune sono costellazioni: l'Orsa, il Cigno, il Pallone (una costellazione che non conosci, ma che c'è sempre stata)."], ["voce", "In porta, un vecchio con la corona e i guanti consumati. Non si muove. Vi guarda arrivare come si guarda la pioggia."]],
        npcs: (s) => [{ id: "cc_re", at: [15, 6] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 19, "~"); lay(2, 2, 27, 17, ","); lay(6, 4, 23, 13, "+"); put(15, 3, "Y"); lay(14, 14, 16, 17, ":"); put(15, 18, "v"); lay(15, 18, 15, 18, "v");
        },
        decor(g, cx, cy, d) { // le linee del campo fatte di stelle
          for (let i = 0; i < 40; i++) { const t = i / 40, x = d.X(6) + t * 18 * 16, a = 0.5 + 0.4 * Math.sin(d.fr / 15 + i); g.fillStyle = `rgba(220,220,255,${a})`; g.fillRect(x, d.Y(4), 2, 2); g.fillRect(x, d.Y(14) - 2, 2, 2); }
          g.strokeStyle = "rgba(200,180,255,.4)"; g.lineWidth = 1; g.beginPath(); g.arc(d.X(15), d.Y(9), 22, 0, 7); g.stroke();
        },
      },
    };
    function finale() {
      const tira = F.is("cc_lyra_tira");
      K.ownMatch(window.__atb.start, {
        oppStyle: "difensiva", title: "Lo Stadio delle Stelle · contro il Re del Silenzio", us: "Il gruppo", half: 80, theme: "stelle", items: 4,
        heroSt: { tiro: 17, pass: 15, dif: 13, vel: 16 }, heroSpells: ["luce"], heroMp: 20,
        party: [{ id: "cc_lyra", name: "Lyra", skin: "#f0d0b0", hair: "#c8a040", st: { tiro: tira ? 16 : 9, pass: 13, dif: 19, vel: 13 }, spells: tira ? ["cura", "luce"] : ["cura"], mp: 18 }, { id: "cc_fosco", name: "Fosco", skin: "#e8c4a0", hair: "#3a2a5a", st: { tiro: 10, pass: 16, dif: 9, vel: 11 }, spells: ["vento", "gelo", "fuoco"], mp: 36 }, { id: "cc_rubi", name: "Rubi", skin: "#c68642", hair: "#1a1a1a", st: { tiro: 14, pass: 13, dif: 15, vel: 19 }, spells: [], mp: 0 }],
        opp: { name: "Il Re del Silenzio", color: "#2a2a5a", players: [{ name: "Il Re", skin: "#d8c8b8", hair: "#c8c8d8", st: { tiro: 15, pass: 15, dif: 18, vel: 13 } }, { name: "Il Muto", skin: "#c8c8d0", hair: "#3a3a4a", st: { tiro: 14, pass: 14, dif: 14, vel: 13 } }, { name: "Quieto", skin: "#c8c8d0", hair: "#2a2a3a", st: { tiro: 13, pass: 13, dif: 14, vel: 12 } }, { name: "Zitto", skin: "#c8c8d0", hair: "#4a4a5a", st: { tiro: 12, pass: 13, dif: 15, vel: 12 } }] },
        intro: `<p>L'ultima partita, tra le stelle. Il Re del Silenzio para tutto: avvicinati il più possibile prima di tirare, e usa <b>Luce</b>. ${tira ? "Lyra, adesso, tira anche lei." : "Lyra difende come una muraglia."}</p>`, winTitle: "LE STELLE CANTANO!",
        done: (r) => {
          if (!r.win) return K.scene([["cc_re", "(per la prima volta, parla) …Ancora. Giocate ancora. Non so perché lo dico. Ma ancora."]], () => K.enterZone("cc_stelle"), "cc_stelle");
          F.set("cristallo_cc_stelle", true); F.set("cristallo_cc_vulcano", true); setStep(N, 3); bond("gruppo", 2); K.learnLore("l_stelle");
          K.scene([["voce", "Fischio finale. Il quarto cristallo si accende sopra lo stadio, e nello stesso istante, in tutto il mondo, le stagioni ripartono: nevica sulla Montagna di Fuoco, fioriscono i rovi, il vento gonfia le vele a Sale Antico, a Prato Lungo l'erba canta così forte che Ermete si commuove."], ["voce", "Il Re del Silenzio è in ginocchio davanti alla sua porta. Ha parato tutto, fino all'ultimo minuto. Poi un gol. Uno solo. Ma vero."], ["cc_re", "(si toglie i guanti, lentamente) …Ditemi una cosa. Una sola. Avete visto le mie parate?"]], () => K.enterZone("cc_stelle"), "cc_stelle");
        },
      });
    }
    function endingAsk() {
      const opts = [{ label: "«Le stagioni ripartono. Torniamo a casa»", sub: "Il gruppo si saluta", big: true, fn: () => ending("stagioni") }];
      if (st("gruppo") >= 10) opts.push({ label: "«Lyra, resta. Il Prato ha bisogno di una cavaliera»", sub: "La cavaliera del Prato", big: true, fn: () => ending("cavaliera") });
      if (st("luce") >= 5) opts.push({ label: "«Le abbiamo viste tutte. Adesso esultiamo per te»", sub: "La voce del Silenzio", big: true, fn: () => ending("silenzio") });
      if (allShards() && st("gruppo") >= 8) opts.unshift({ label: "Le schegge che hai raccolto cominciano a brillare…", sub: "Segreto: tutte le schegge del mondo e il gruppo unito", cls: "hot", big: true, fn: () => ending("quinto") });
      ask("cc_re", "Le mie parate. Quarant'anni. Nessuno le ha mai guardate. Nemmeno io: guardavo sempre il pallone che se ne andava, mai le mani che l'avevano fermato.\n\nAvete riacceso i cristalli. Il mondo riparte. E adesso?", opts, "cc_finale");
    }
    function ending(kind) {
      const R2 = { stagioni: { coins: 120, cos: ["cc_c3", "cc_stagioni"] }, cavaliera: { coins: 130, cos: ["cc_c3", "cc_cavaliera"] }, silenzio: { coins: 130, cos: ["cc_c3", "cc_silenzio"] }, quinto: { coins: 200, cos: ["cc_c3", "cc_quinto"] } }[kind];
      const msg = K.reward("end:" + kind, R2); K.end(kind); finishChapter(N, kind); setStep(N, 5);
      const lines = {
        stagioni: [["voce", "Il gruppo torna a Prato Lungo con la nave, il vento in poppa. Sulla collina, al primo giorno di primavera vera, si salutano: Fosco torna alla torre (con due paia di occhiali), Rubi riparte a «restituire cose», Lyra al castello."], ["cc_lyra", "Ci rivediamo. Alla prossima stagione. Adesso le stagioni passano: ce ne saranno tante."], ["voce", "<b>FINALE · LE STAGIONI RITORNANO.</b> A ogni partita, nel mondo, una stagione cambia un po'."]],
        cavaliera: [["cc_lyra", "Restare? (Guarda il campo di Prato Lungo, verde, che canta.) Il castello ha molti cavalieri. Il Prato non ne ha nessuno. …Resto. E apro una scuola: lo scudo diventa una porta, la spada un fischietto."], ["voce", "<b>FINALE · LA CAVALIERA DEL PRATO.</b> La prima allieva di Lyra tira un rigore il primo giorno. Lo sbaglia. Lyra la abbraccia: «Benissimo. Adesso sai che si sopravvive»."]],
        silenzio: [["voce", "Il gruppo si guarda. Poi, insieme, alza le braccia e grida: «CHE PARATA!». Rubi fa un salto mortale. Fosco lancia un Vento di coriandoli. Lyra batte lo scudo come un tamburo."], ["cc_re", "(la corona gli cade, e non la raccoglie) …Così si sente? Così? Per quarant'anni… (ride, e piange, e ride) Il prossimo gol che subisco, esulterò per chi l'ha segnato. E per me, che ci ho provato."], ["voce", "<b>FINALE · LA VOCE DEL SILENZIO.</b> Il Re del Silenzio torna a giocare. In porta. E ogni volta che para, lo stadio delle stelle esulta per lui."]],
        quinto: [["voce", "Le schegge che hai raccolto in tutto il mondo si sollevano da sole dalla tua tasca. Girano intorno al gruppo, più veloci, più veloci, e si fondono in un quinto cristallo: trasparente, senza colore, caldo come una mano."], ["cc_fosco", "Il quinto cristallo! Nei libri c'era scritto «non sta sotto nessun campo». Pensavo fosse un errore di stampa. Era… noi."], ["voce", "<b>FINALE SEGRETO · IL QUINTO CRISTALLO.</b> Brilla ogni volta che i quattro si passano la palla senza guardare. Cioè sempre."]],
      }[kind];
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 4. Dal menu «Capitoli» puoi rigiocare per scoprire gli altri.</span>`]], () => K.openMain(), "cc_finale");
    }
    const talk = {
      cc_ermete() {
        if (S() === 0) return say([["cc_ermete", "Due cristalli accesi. La primavera è arrivata e il vento è tornato. Ma l'estate non viene, e l'inverno nemmeno. Mancano il Fuoco e le Stelle."], ["cc_ermete", "Il Cristallo del Fuoco è nella Montagna di Fuoco, a nord-est. Lo custodisce una fabbra, Brunilde. Dicono che per riaccenderlo serva un rigore. Uno solo. Ma tirato da chi ha paura."], ["cc_lyra", "(da dietro di te, piano) …Chi ha paura."]], () => { setStep(N, 1); quest("cc_fuoco", "Il Cristallo del Fuoco", "Nella Montagna di Fuoco, a nord-est della mappa del mondo."); done(); });
        return say([["cc_ermete", "Vai, vai. Le stagioni aspettano. Io aspetto con loro, da qui."]]);
      },
      cc_fabbra() {
        const s = S();
        if (s === 1) return ask("cc_fabbra", "Brunilde, fabbra. Il cristallo è sul dischetto da cent'anni. Si riaccende con un rigore, ma non uno qualunque: lo deve tirare chi ha più paura di sbagliarlo. Il cristallo lo sente. Chi di voi trema di più?\n\n(Lyra fa un passo indietro. Poi, piano, un passo avanti.)", [
          { label: "«Lyra. Tiralo tu. Noi siamo qui»", sub: "Lyra affronta il suo giuramento", big: true, fn: () => rigore(true) },
          { label: "«Lo tiro io. Non devi farlo per forza»", sub: "Proteggi Lyra dalla sua paura", big: true, fn: () => rigore(false) },
        ], "cc_vulcano");
        return say([["cc_fabbra", s >= 2 ? "Il cristallo brilla. E la vostra cavaliera… (si soffia il naso, rumorosamente) …scusate. La fuliggine." : "Un pallone di ferro? Pesa come un'incudine. Lo uso per allenare le porte, non i giocatori."]]);
      },
      cc_re() {
        const s = S();
        if (s === 2) return ask("cc_re", "(Il Re del Silenzio non parla. Indica il cristallo spento sopra la sua porta, poi le sue mani, poi voi. Il Muto, accanto, scrive su un foglio: «Il re accetta. Partita a turni. Chi vince, decide il silenzio o il canto».)", [{ label: "Gioca la partita finale", sub: "ATB tra le stelle, con il gruppo al completo", cls: "hot", fn: finale }, { label: "Non ancora", fn: done }], "cc_stelle");
        if (s === 3) return endingAsk();
        return say([["cc_re", "(Il Re ti guarda in silenzio. Poi, quasi impercettibilmente, alza un pollice.)"]]);
      },
      cc_lyra() { return say([["cc_lyra", F.is("cc_lyra_tira") ? "Ho tirato. Ho tremato. È entrato. …Lo rifarei. Tremando di nuovo, ma lo rifarei." : S() <= 1 ? "Un rigore tirato da chi ha paura… Lo so cosa pensi. Non dirlo. Non ancora." : "Grazie per averlo tirato tu. Un giorno, forse… Un giorno."]]); },
    };
    function rigore(lyra) {
      F.set("cristallo_cc_vulcano", true); setStep(N, 2); questDone("cc_fuoco"); quest("cc_stelle", "Lo Stadio delle Stelle", "Sulla mappa del mondo, il castello tra le nuvole a nord.");
      if (lyra) { F.set("cc_lyra_tira", true); bond("luce", 2); bond("gruppo", 2); } else bond("gruppo", 1);
      K.learnLore("l_fuoco");
      K.scene(lyra ? [["voce", "Lyra posa lo scudo. Posa la spada. Va sul dischetto con il pallone tra le mani, e le tremano. Tutti lo vedono. Nessuno dice niente."], ["voce", "Rincorsa. Tiro. Il pallone vola, alto, altissimo… sbatte sulla traversa, torna giù, rimbalza sulla schiena del portiere di pietra, ed entra."], ["cc_lyra", "(in ginocchio, ride e piange insieme) È entrato. Male. Malissimo. Ma è entrato. (Si rialza.) Il giuramento è sciolto. Da oggi, se serve, tiro."], ["voce", "Il Cristallo del Fuoco si accende, arancione come un tramonto d'estate. Sulla cima della montagna appare un ponte di luce, verso le nuvole."]]
        : [["voce", "Vai tu sul dischetto. Il pallone pesa come ferro, il cristallo ti guarda. Hai paura? Un po'. Abbastanza."], ["voce", "Tiri. Gol. Il Cristallo del Fuoco si accende, arancione come un tramonto d'estate. Sulla cima della montagna appare un ponte di luce, verso le nuvole."], ["cc_lyra", "(piano) Grazie. …Un giorno lo tirerò io. Un giorno."]], () => { K.refreshZone(); done(); }, "cc_vulcano");
    }
    const obj = {
      "cc_mondo:F": () => go("cc_vulcano", 15, 18), "cc_vulcano:v": () => go("cc_mondo", 40, 6),
      "cc_mondo:C": () => (F.is("cristallo_cc_vulcano") ? go("cc_stelle", 15, 17) : say([["voce", "Un castello tra le nuvole. Non c'è modo di arrivarci: nessuna scala, nessun ponte. Non ancora."]])), "cc_stelle:v": () => go("cc_mondo", 22, 4),
      "cc_vulcano:Y": () => say([["voce", F.is("cristallo_cc_vulcano") ? "Il Cristallo del Fuoco brilla, caldo, arancione. Dentro, un pallone che rotola su una traversa, per sempre." : "Il cristallo è spento, nero come carbone. Sul dischetto. Aspetta un rigore."]]),
      "cc_stelle:Y": () => say([["voce", F.is("cristallo_cc_stelle") ? "Il Cristallo delle Stelle brilla, e con lui tutte le costellazioni delle tribune." : "Il cristallo sopra la porta del Re è spento. Le stelle intorno aspettano."]]),
    };
    const patch = {
      cc_mondo: { build(L) { L.put(40, 5, "F"); L.lay(37, 6, 40, 6, ":"); L.lay(37, 7, 37, 15, ":"); L.put(22, 3, "C"); L.lay(22, 4, 22, 14, ":"); } },
    };
    return { n: N, title: "Le Stelle e il Fuoco", sub: "La Montagna di Fuoco, il rigore di Lyra, lo Stadio delle Stelle", goal, start: "cc_prato", introBg: "cc_vulcano", zones, talk, obj, patch,
      intro: () => [["voce", "Due cristalli brillano, e il mondo si è mosso un poco: primavera e vento. Ma l'estate non arriva. L'inverno nemmeno."], ["voce", "Il gruppo torna a Prato Lungo per un consiglio. Ermete ha la mappa sul tavolo, e due cerchi rossi: la Montagna di Fuoco, e un castello che sulla mappa non c'era mai stato."]] };
  }
  boot();
})();
