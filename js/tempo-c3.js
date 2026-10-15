// js/tempo-c3.js - RONDINE 1938-2038 · Capitolo 3 «L'ultima Palla»
// Il centenario. Tre oggetti nello stesso armadietto, in tre anni diversi; la Revisione di Vera; la Palla del Tempo in tutte e tre le epoche.
// Cinque finali: il gol resta, la storia cambia, palla al centro, l'ultimo forestiero, e uno segreto.
(function () {
  "use strict";
  function boot() { const D = window.__tempo; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N), st = (k) => K.stat(k);

    K.cos("rt_c3", { kind: "shirt", label: "Maglia del Centenario", val: "#46f0ff", from: "Completa il Capitolo 3 di Rondine 1938-2038" });
    K.cos("rt_e_gol", { kind: "hairc", label: "Capelli Neon", val: "#46f0ff", from: "Finale «Il gol resta»" });
    K.cos("rt_e_cambia", { kind: "hairc", label: "Capelli di Platano", val: "#5aa83a", from: "Finale «La storia cambia»" });
    K.cos("rt_e_centro", { kind: "hairc", label: "Capelli d'Argento", val: "#c0c0d0", from: "Finale «Palla al centro»" });
    K.cos("rt_e_forestiero", { kind: "hairc", label: "Capelli Seppia", val: "#d8d0bc", from: "Finale «L'ultimo forestiero»" });
    K.cos("rt_e_rondine", { kind: "hairc", label: "Capelli d'Ambra", val: "#ffb347", from: "Finale segreto «La rondine torna»" });
    K.lore("l_fascia", { t: "La fascia di Dorino", d: "Il bracciale da capitano del 1938: stoffa, un bottone di madreperla, la scritta «RONDINARA» ricamata da una madre con troppo filo. Nell'armadietto 22 era sotto un panno, con un biglietto: «Per chi arriva da lontano»." });
    K.lore("l_fischio", { t: "Il fischietto del Mister", d: "Un fischietto di ottone che nel 1978 non ha mai fischiato un'ingiustizia. Nella Palla del Tempo ti dà un FISCHIO: annulla l'ultimo gol subìto, una volta. Vale solo dentro questa storia." });
    K.lore("l_orologio", { t: "L'orologio da taschino", d: "L'orologio del Professor Quarzo, fermo alle 22:04. Nell'armadietto del 2038 batte di nuovo, con un tic che somiglia a un respiro. Ti regala secondi in più nelle Palle del Tempo, qui e solo qui." });
    K.lore("l_vera", { t: "Vera Revisori", d: "Direttrice del VAR Totale. Non è cattiva: è precisa. Ha scelto un lavoro in cui nessuno può dire «ma allora io c'ero», e ci ha messo cinquantatré anni a capire perché le dispiace." });

    const goal = (s) => ({
      0: "Il Centenario è domani all'alba. Parla con Tilly, al piazzale.",
      1: "Nell'armadietto 22 dello spogliatoio c'è un oggetto per ogni epoca: la fascia (1938), il fischietto (1978), l'orologio (2038). Lo spogliatoio ha una porta nello stadio, in alto a sinistra.",
      2: "Hai i tre oggetti. Vera ti aspetta al campo, nel 2038: la Revisione sta per cominciare.",
      3: "La Revisione è finita. Vera aspetta la tua risposta.",
    }[s] || "Rondine 1938-2038 è completata. Il Taccuino del Tempo conserva i finali.");

    const houseCol = () => { const e = K.ZX.eraName; return e === "1938" ? { roof: "#5a4a3a", wall: "#9a9486" } : e === "1978" ? { roof: "#a8522a", wall: "#e8c89a" } : { roof: "#2a1a6a", wall: "#3a3a8a" }; };
    const OGG = { fascia: ["rt_fascia", "l_fascia", "1938"], fischio: ["rt_fischio", "l_fischio", "1978"], orologio: ["rt_orologio", "l_orologio", "2038"] };
    const tutti = () => Object.keys(OGG).every((k) => F.is(OGG[k][0]));

    const zones = {
      rt_spogliatoio: {
        interior: true, region: "officina", name: "Rondine 1938-2038 · Lo Spogliatoio", short: "Lo Spogliatoio", sub: "L'armadietto 22", bg: "rt_spogliatoio", w: 14, h: 10, start: [6, 8], outside: ["rt_campo", 4, 7], items: [[11, 8]],
        act: { x: "Apri l'armadietto 22", L: "Guarda gli armadietti", b: "Siediti", v: "Esci", M: "Guarda la lavagna" },
        flavor: { L: "Armadietti di tre epoche, uno accanto all'altro: legno, lamiera, luce. Tutti con un lucchetto. Tutti con un nome, tranne uno.", b: "Una panca lunga come una stagione. Qualcuno ha inciso, con un temperino: «chi si siede qui, gioca».", M: "La lavagna delle formazioni. Una frase, cancellata e riscritta mille volte: «giocate». Il resto è disegni di rondini." },
        intro: [["voce", "Lo Spogliatoio. L'odore è lo stesso in tutte le epoche: sapone, cuoio, e un poco di paura che si asciuga. In fondo, un armadietto senza nome: il numero 22."]],
        npcs: () => [{ id: "rt_tilly", at: [8, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "+"); lay(0, 0, 13, 1, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(6, 9, "v");
          lay(2, 2, 8, 2, "L"); put(11, 2, "x"); put(3, 5, "b"); put(4, 5, "b"); put(11, 6, "M");
        },
        eras: {
          1978: { label: "Lo Spogliatoio · 1978", region: "settanta", filter: "anni70", time: "tramonto", npcs: () => [{ id: "rt_rino", at: [8, 5] }] },
          1938: { label: "Lo Spogliatoio · 1938", region: "trenta", filter: "bn", time: "giorno", npcs: () => [{ id: "rt_baldo", at: [8, 5] }] },
        },
      },
    };

    // ------------------------------------------------------------ la Revisione e i finali
    function revisione() {
      const v = K.vantaggi(), tr = K.pre();
      K.palla({
        title: "Palla del Tempo · La Revisione", eras: [1938, 1978, 2038], bg: "rt_campo", oppStyle: "pressing", secs: 46,
        opp: { name: "VAR Totale", color: "#46f0ff", players: [{ name: "Drone Fischietto" }, { name: "Verbale" }], keeper: { name: "La Moviola" } },
        mate: { name: "Dorino", skin: "#e0b890", hair: "#2a1a10" },
        intro: `<p>La Revisione. Una partita sola, in <b>tre epoche</b>: 1938, 1978, 2038. Le tracce che hai lasciato (${Object.keys(tr).filter((k) => tr[k]).length} su 4) ti aspettano sul prato di luce. Hai ${v.tempo} <b>TEMPO</b>${v.fischio ? ` e un <b>FISCHIO</b> (il fischietto del Mister)` : ""}. Il VAR Totale rivede tutto: segna di più, e meglio.</p>`,
        done: (r) => {
          if (r.quit) return say([["rt_vera", "Il Verbale resta aperto. Come tutti quelli che non hai firmato."]]);
          F.set("rt_m3", r.win ? "vinta" : "persa"); F.set("rt_segni_n", ((r.data && r.data.segni) || []).length);
          if (!r.win) return K.scene([["voce", "Il fischio finale. Il VAR Totale annota, con cura, tutto. I droni fischietto volteggiano a riposo."], ["rt_vera", "[pensa] Non è definitivo. La Revisione può riaprirsi. Un'ora, un giorno… ma le procedure, a un certo punto, finiscono."]], () => K.enterZone("rt_campo"), "rt_campo");
          setStep(N, 3);
          K.scene([
            ["voce", "Il tabellone fa «clic», e per un attimo non scrive niente. Poi scrive: «REVISIONE CONCLUSA · ESITO: VALIDO»."],
            ["rt_vera", "[sorpreso] Valido. Un esito che non ricordavo. Dovrei ripassare il regolamento."],
            ["voce", "Vera Revisori si toglie i guanti bianchi, uno alla volta, come se fossero cent'anni. Sotto, ha le mani di una che ha paura di sbagliare."],
            ["rt_vera", "Ho una domanda, ed è fuori verbale. Il Club domani compie cent'anni, e io ho il potere di scegliere che cosa ricorda. Lei, signor Campione, che cosa vorrebbe che ricordasse?"],
          ], endingAsk, "rt_regia");
        },
      });
    }
    function endingAsk() {
      const tr = K.pre(), tutteTracce = tr.seme && tr.pietra && tr.cavo && tr.idrante;
      const o = [{ label: "«Che il gol c'è stato. Tutto qui»", sub: "Il gol resta, com'è giusto", big: true, fn: () => ending("gol") }];
      if (F.is("rt_pianta") && F.get("rt_occhio") === "spento") o.push({ label: "«Che il tempo si può correggere con un seme»", sub: "La storia cambia: quella che hai piantato", big: true, fn: () => ending("cambia") });
      if (st("vera") >= 2) o.push({ label: "«Che i gol si custodiscono, non si annullano»", sub: "Palla al centro, con Vera", big: true, fn: () => ending("centro") });
      if (F.is("rt_detto")) o.push({ label: "«Che un forestiero ha segnato. E poi è rimasto»", sub: "Tornare nel 1938, per sempre", big: true, fn: () => ending("forestiero") });
      if (tutteTracce && F.is("rt_foto") && F.is("rt_pianta") && F.is("rt_fischio") && F.is("rt_fascia") && st("club") >= 6) o.unshift({ label: "Sul tabellone c'è una rondine, piccola, che non c'era…", sub: "Segreto: tutte le tracce, la foto, il seme, il fischietto, la fascia e la fiducia del Club", cls: "hot", big: true, fn: () => ending("rondine") });
      ask("rt_vera", "Dunque. Che cosa ricorda, il Club?", o, "rt_regia");
    }
    function ending(kind) {
      const R2 = { gol: { coins: 150, cos: ["rt_c3", "rt_e_gol"] }, cambia: { coins: 170, cos: ["rt_c3", "rt_e_cambia"] }, centro: { coins: 170, cos: ["rt_c3", "rt_e_centro"] }, forestiero: { coins: 170, cos: ["rt_c3", "rt_e_forestiero"] }, rondine: { coins: 250, cos: ["rt_c3", "rt_e_rondine"] } }[kind];
      const msg = K.reward("end:" + kind, R2); K.end(kind); finishChapter(N); setStep(N, 5); questDone("rt_gol78");
      const L = {
        gol: [["rt_vera", "Il gol resta. Firmato, timbrato, e senza ripensamenti. Domani il Club avrà i suoi cent'anni, com'è giusto: sgangherato, e vivo."], ["voce", "Le foto del 1938 tornano nitide, una dopo l'altra, dai volti in primo piano a quelli sul fondo. In terza fila, un forestiero con le scarpe strane sorride all'obiettivo."], ["voce", "<b>FINALE · IL GOL RESTA.</b> Il centenario comincia all'alba, tra coriandoli e cartelli scritti a penna."]],
        cambia: [["rt_vera", "[sorpreso] Un seme e un cavo tagliato. Il passato era un verbale: lei ci ha piantato un albero."], ["voce", "All'alba il platano di piazza è immenso, e accanto al campo c'è un bosco che nessuno ricorda di aver visto crescere. La Coppa delle Rondini, quella del '78, è in vetrina. Nessuno l'ha mai rubata."], ["voce", "<b>FINALE · LA STORIA CAMBIA.</b> Non è la storia di prima. Sembra meglio."]],
        centro: [["rt_vera", "Custodire. Non annullare. …Sa che è la prima parola nuova che imparo in cinquantatré anni?"], ["voce", "Il VAR Totale ha un nuovo regolamento: ogni gol, anche quello sbagliato, ha una pagina. La Moviola dei Bei Gol diventa il museo più visitato di Rondinara; Vera ci va ogni domenica, a guardare un rigore parato nel 1961."], ["voce", "<b>FINALE · PALLA AL CENTRO.</b> Il tempo, finalmente, ha un archivio gentile."]],
        forestiero: [["rt_dorino", "[felice] Sei tornato! Ti avevo lasciato un posto in squadra, per ogni evenienza. E una camicia, che non ti sta."], ["voce", "Il Pullman parte da solo, verso il 2038, con la targa a tre date. Resti sul bordo del campo di terra, con la fascia in mano e un campanile che suona le tre."], ["voce", "<b>FINALE · L'ULTIMO FORESTIERO.</b> Il Club saprà per cent'anni che un forestiero ha segnato. Nessuno saprà chi eri: solo che aveva ragione."]],
        rondine: [["voce", "Sul tabellone c'è una rondine, piccola, bianca e azzurra. Vola dal 1938 al 1978, dal 1978 al 2038, e in ogni epoca lascia una piuma: una fascia, un fischietto, un orologio."], ["rt_vera", "…Non è nel regolamento. Non è nemmeno nei miei sistemi. È una rondine. E io, per la prima volta, non devo revisionarla."], ["voce", "All'alba, sotto la tribuna, una rondine torna al suo nido. Dentro, un orologio piccolissimo che funziona. Il tempo, finalmente, si ricorda di essere gentile."], ["voce", "<b>FINALE SEGRETO · LA RONDINE TORNA.</b>"]],
      }[kind];
      K.scene([...L, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${K.mem().ends.length} su 5. Dal menu «Capitoli» puoi rigiocare per scoprire gli altri.</span>`]], () => { if (kind === "forestiero") K.viaggia(1938); else K.viaggia(2038); K.openMain(); }, "rt_finale");
    }

    // ------------------------------------------------------------ dialoghi e oggetti
    const talk = {
      rt_tilly() {
        const s = S(), here = K.api.trZone();
        if (here === "rt_spogliatoio") return say([["rt_tilly", s < 2 ? "L'armadietto 22 è quello in fondo. Non ha il nome sopra: l'hanno cancellato così tante volte che ora si legge solo il vuoto." : "Tre oggetti, tre epoche, un armadietto solo. Adesso il campo: Vera ti sta aspettando."]]);
        if (s >= 4) return say([["rt_tilly", "Sul tabellone c'è un'altra data, adesso: domani. Per la prima volta da cent'anni, mi ricordo che cosa si scrive dopo «oggi»."]]);
        if (s >= 2) return say([["rt_tilly", "Vera è al campo. Le fa onore: non ha portato droni."]]);
        if (s >= 1) return say([["rt_tilly", "Lo spogliatoio è nello stadio, in alto a sinistra. Lì ci sono i tre oggetti: se ne manca uno, il Pullman ti riporta lì."]]);
        say([
          ["rt_tilly", "[triste] La Revisione è domani all'alba. Vera ha convocato tutti allo stadio. Dice che, in caso di dubbio, il Club annullerà il gol del '38 e ripartirà da zero."],
          ["rt_tilly", "Il Professore ha trovato una cosa, nell'Officina: un armadietto, il numero 22, nello spogliatoio. Dentro c'è qualcosa di tuo. Anzi: tre cose, una per ogni epoca."],
          ["rt_tilly", "Prendile tutte. E vai da Vera, al campo. Io resto qui a pregare il tabellone."],
        ], () => { setStep(N, 1); quest("rt_ult", "L'ultima Palla", "Nello spogliatoio, l'armadietto 22 ha un oggetto per ogni epoca: fascia (1938), fischietto (1978), orologio (2038)."); done(); });
      },
      rt_vera() {
        if (K.api.trZone() !== "rt_campo" || K.ep() !== 2038) return done();
        const s = S();
        if (s < 2) return say([["rt_vera", "La Revisione comincia quando ha i suoi tre oggetti. Il Verbale è molto preciso su questo."]]);
        if (s >= 3) return endingAsk();
        ask("rt_vera", F.get("rt_m3") === "persa" ? "Riaprire la Revisione? Non c'è fretta. C'è soltanto un'alba." : "Siamo qui. Il VAR Totale, io, e lei. Una Palla del Tempo, tre epoche, e un Verbale da firmare.", [
          { label: "Comincia la Revisione", sub: "Palla del Tempo · 1938, 1978 e 2038", cls: "hot", fn: revisione },
          { label: "Ancora un momento", fn: done },
        ], "rt_regia");
      },
      rt_nonna() {
        const s = S();
        if (s >= 4) return say([["rt_nonna", "Il Centenario. Per cent'anni ho avuto paura che l'ultima persona a ricordarsi fossi io. Invece, ci sei tu."]]);
        say([["rt_nonna", K.pick(["Un forestiero mi ha tenuto in braccio, e una nonna ha aspettato cent'anni per ringraziarlo. Ti sembra poco?", "Hai le scarpe di chi sa come va a finire e ha deciso di giocare lo stesso.", "Domani all'alba suoneranno le campane. Ho già scelto il vestito: quello con le rondini."])]]);
      },
    };
    function apri(k) {
      const [flag, lore, ep] = OGG[k], era = String(K.ep());
      if (era !== ep) return say([["voce", era === "2038" ? "L'armadietto 22, del 2038, è vuoto: ha il lucchetto di luce e un biglietto. «Qui c'è qualcosa, ma non adesso.»" : `L'armadietto 22, nel ${era}, ha dentro un biglietto: «${ep === "2038" ? "Il mio orologio batte nel 2038." : ep === "1978" ? "Il mio fischietto fischia nel 1978." : "La mia fascia ti aspetta nel 1938."}»`]]);
      if (F.is(flag)) return say([["voce", "L'armadietto 22 è aperto e vuoto: ha fatto il suo dovere."]]);
      F.set(flag, true); K.learnLore(lore, true); bond("club", 1);
      const m = { fascia: "Nell'armadietto c'è la fascia di Dorino, piegata in quattro, con un biglietto: «Per chi arriva da lontano».", fischio: "Nell'armadietto c'è un fischietto di ottone appeso a un cordino. Sul cordino, con la grafia del Mister: «Per quando serve».", orologio: "Nell'armadietto c'è l'orologio del Professor Quarzo. Batte. Per la prima volta in cent'anni: tic, tic, tic." }[k];
      if (tutti()) { setStep(N, 2); quest("rt_ult", "L'ultima Palla", "Hai tutti e tre gli oggetti. Vera ti aspetta al campo, nel 2038."); return say([["voce", m], ["voce", "Hai la fascia, il fischietto e l'orologio. Fuori, nello stadio, qualcuno ha acceso tutti i riflettori in una volta sola."]], done); }
      say([["voce", m]], done);
    }
    const obj = {
      "rt_spogliatoio:x": () => {
        const era = K.ep(), k = era === 1938 ? "fascia" : era === 1978 ? "fischio" : "orologio";
        apri(k);
      },
      "rt_spogliatoio:v": () => go("rt_campo", 4, 7),
    };
    const patch = {
      rt_campo: {
        build(L) {
          const C = houseCol();
          L.house(1, 2, 6, 5, { door: [4, 6], roof: C.roof, wall: C.wall, rr: 2, lit: true, enter: { to: "rt_spogliatoio", at: [6, 8] } });
        },
        npcs(s, list) {
          if (K.ep() === 2038 && K.mem().ch >= 3 && S() >= 2) return list.concat([{ id: "rt_vera", at: [14, 8] }]);
          return list;
        },
      },
    };
    K.viaggio = K.viaggio || [];
    return { n: N, title: "L'ultima Palla", sub: "Il Centenario, tre oggetti, una Revisione", goal, start: "rt_piazzale", introBg: "rt_piazza", zones, talk, obj, patch,
      intro: () => [["voce", "Rondinara, 15 ottobre 2038. Mancano poche ore all'alba, e il Centenario ha l'aria di una festa che non sa se può cominciare. Lo Stadio delle Rondini è tutto acceso, come un uovo di luce."], ["voce", "Vera Revisori ha scritto un nuovo Verbale: se il Club, domani all'alba, non avrà una ragione sola per esistere, il gol del 1938 sarà annullato per sempre."]] };
  }
  boot();
})();
