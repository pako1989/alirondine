// js/leo-c4.js - «L'ESTATE DEL MURO» · Capitolo 4: Ferragosto
// La festa del porto: bancarelle, banda, un palco, la finale del torneo contro i Granchi di Gegè e i fuochi sul molo. Quaglia guarda dal fondo. Dopo la partita, papà e Dario litigano:
// non senti le parole, senti la porta. Poi una scelta: inseguire Dario o restare con papà. Zona: la piazza del porto (34x22, due versioni). Cameo: la banda di Rocco e l'araldo Pippo Trombetti.
(function () {
  "use strict";
  function boot() {
    const E = window.__leoCore;
    if (!E || !E.api || !E.api.addChapter || !window.__leoH || !E.api._has || !E.api._has(3)) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function buildPiazza(L, tell) {
    const { lay, put, house } = L;
    lay(0, 0, 33, 0, "t"); lay(0, 0, 0, 18, "t"); lay(33, 0, 33, 18, "t"); lay(0, 19, 33, 21, "w"); lay(1, 9, 32, 11, ":"); lay(0, 9, 0, 11, ":"); put(0, 10, "q"); put(0, 9, "q");
    house(12, 2, 9, 4, { door: [16, 5], roof: tell ? "#f59e0b" : "#b45309", wall: tell ? "#fde68a" : "#a8523a", timber: tell ? null : "#6a4a2a", lit: true, enter: tell ? "Il palco del Ferragosto: di marmo, d'oro, con un lampadario che quest'anno canta. Dietro c'è il magazzino delle sedie." : "Il palco del Ferragosto: assi di legno, due faretti e una scritta a pennarello: «ATTENZIONE: CHIODO»." });
    [[3, 7], [5, 7], [7, 7], [25, 7], [27, 7], [29, 7]].forEach(([x, y]) => put(x, y, "u")); [[2, 8], [10, 8], [22, 8], [31, 8]].forEach(([x, y]) => put(x, y, "l"));
    lay(8, 13, 25, 17, "-"); [14, 15, 16].forEach((y) => { put(7, y, "g"); put(26, y, "g"); }); put(30, 15, "N"); put(31, 15, "N"); put(3, 14, "O"); put(3, 17, "O");
    [[2, 3], [30, 3], [6, 3], [26, 3]].forEach(([x, y]) => put(x, y, "t")); put(14, 12, "T"); put(15, 12, "T");
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__leoH(K), { say, done, wask } = H, N = 4, S = () => K.stepOf(N);
    H.people();
    K.cos("lm_c4", { kind: "acc", label: "Medaglia di latta del torneo", val: "medaglia", from: "Capitolo 4 di L'Estate del Muro" });
    K.lore("l_ferragosto", { t: "Il Ferragosto del porto", d: "La festa più lunga dell'anno: banda, fritto, un torneo di calcio a tre e i fuochi dal molo. Si dice che ogni Ferragosto uno del Borgo prenda una decisione e un altro la scopra tre anni dopo." });
    const goal = (s) => ({ 0: "Cerca Nico, nervoso come prima di un esame, dalle parti del campo di sabbia.", 1: "Parla con Gegè: la finale è contro i suoi Granchi.", 2: "Ottavio fischia la finale: parlagli per entrare in campo.", 3: "I fuochi sul molo. Dario e papà sono davanti alla trattoria.", 4: "Il capitolo si chiude." }[s] || "Il capitolo 4 è concluso.");
    function fin() {
      setStep(N, 4); F.set("lm_c4_done", true);
      const m = K.reward("lm_c4", { coins: 120, cos: "lm_c4" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", F.is("lm_insegui") ? "Corri per il molo. Dario è seduto in fondo, con le gambe sull'acqua e il pallone in mano. Non dice niente. Neanche tu. Per un po' il mare fa il lavoro di entrambi." : "Resti sulla soglia della trattoria. Papà asciuga lo stesso bicchiere per un quarto d'ora. Poi lo posa e dice «Il fritto è finito. Tutto il resto no»."],
        ["voce", `<b>FINE DEL CAPITOLO 4 · «Ferragosto»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 5 ti aspetta: l'ultima notte, il muro, un biglietto da leggere."]
      ]), () => K.openMain(), "lm_piazza");
    }
    function finale() {
      const dario = F.is("lm_aiuto");
      say("lm_ottavio", H.v("Signore e signori, bestie di mare e di terra! La finale del torneo del porto! Moretti contro Spinola! Fischio io, che il mare non fischia!", "La finale. Moretti contro Spinola. Si gioca a tre, si gioca fino a cinque. Chi bara paga il fritto a tutti."));
      if (!dario) say("voce", "Dario non c'è ancora: ha le scarpe, ma non il coraggio. Giocherai con Nico e un ragazzino della banda. Dario arriverà, dicono, alla ripresa.");
      K.say(H.flush(), () => K.playMatch({
        id: "lm_finale", alt: "az,cage,hd", force: false, oppTeam: "I Granchi del porto (finale)", oppColor: "#dc2626", mate: dario ? "Dario" : "Nico", squad: dario ? ["Dario", "Nico", "Tonino"] : ["Nico", "Tonino", "Bimbo"], us: "La squadra dei Moretti", homeKit: ["#ff4d5a", "#ffd23f"],
        chap: "L'Estate del Muro · La finale del torneo", bg: "lm_piazza", oppNames: ["Gegè", "Chele", "Telina", "Il Cugino", "Il Bagnino"],
        intro: "La piazza è piena. Sulla sabbia le linee sono state disegnate con la farina. Il pubblico è mezzo Borgo e mezzo turisti di Torino.",
        done: (r) => {
          F.set("lm_finale_vinta", !!r.win); setStep(N, 3);
          K.say([r.win ? ["voce", H.v("Fischio finale. La coppa è d'oro. Il cielo si illumina. Le sirene del porto suonano a festa. E Nico, in lacrime, ringrazia sua madre.", "Fischio finale. 4 a 3. Nico ha parato un rigore a occhi chiusi, e giura di averlo visto.")] : ["voce", "Fischio finale. I Granchi vincono, ma Gegè ti stringe la mano più forte del dovuto. «Alla prossima. Io non mi stanco.»"]], () => scenaFuochi());
        }
      }));
    }
    function scenaFuochi() {
      K.scene([
        ["voce", H.v("Notte. I fuochi sul molo disegnano in cielo un pallone, poi un muro, poi una porta. Tutto il Borgo guarda su.", "Notte. I fuochi sul molo sono pochi e corti. Il Borgo guarda su comunque, con la faccia di chi non vuole mancare.")],
        ["voce", "Davanti alla trattoria, papà e Dario parlano. Poi smettono di parlare e cominciano a gridare. Non senti le parole: i botti le coprono. Senti la porta."],
        ["voce", "Dario esce. Papà resta. Il pallone, per terra, tra i due, rotola un poco e si ferma."]
      ], () => {
        wask("Il fuoco finale sale sul molo. Hai un solo piede libero.", [
          { label: "✨ Insegui Dario sul molo", sub: "Lo trovi; resta con te il ricordo bello", big: true, w: { leggenda: 1 }, fn: () => { F.set("lm_insegui", true); fin(); } },
          { label: "📓 Resti con papà sulla soglia", sub: "Non dici niente: è la verità più grande", big: true, w: { verita: 1 }, fn: () => { F.set("lm_insegui", false); fin(); } }
        ]);
      }, "lm_piazza");
    }
    const talk = {
      lm_nico() {
        if (K.rel.scene("lm_nico")) return;
        const s = S();
        if (s === 0) {
          say("lm_nico", H.v("Leo! Il Gatto Volante sta per spiccare il volo! Ho preparato un discorso. Comincia con «Cari gabbiani».", "Leo! Ho il rigore in gola. Letteralmente, ho mangiato troppo fritto. Se vinciamo, sono felice. Se perdiamo, mi nascondo sotto la barca."));
          say("hero", "Nico, sei un portiere fortissimo.");
          say("lm_nico", "[felice] …Dici davvero? Allora tu sei un attaccante fortissimo e Dario è un fratello fortissimo e io mi sento un po' meno stupido. Andiamo!");
          K.rel.add("lm_nico", 2); setStep(N, 1); quest("lm_c4", "Ferragosto", "Parla con Gegè prima della finale."); return H.done();
        }
        say("lm_nico", "Tre contro tre. In porta ci sono io. Se mi senti urlare, è tecnica."); H.done();
      },
      lm_gege() {
        if (K.rel.scene("lm_gege")) return;
        const s = S();
        if (s === 1) {
          say("lm_gege", H.v("Moretti! Il destino ci ha messo di nuovo uno contro l'altro. I Granchi sono pronti: abbiamo anche una mascotte, è mia cugina.", "Moretti. Rieccoci. Se perdo, ti pago il fritto. Se vinci, ti pago il doppio. Se pareggiamo, litighiamo."));
          say("lm_gege", "[furbo] E comunque quel signore in beige in fondo alla piazza non guarda me. Guarda voi. Non sai quanto mi dà fastidio.");
          setStep(N, 2); quest("lm_c4b", "La finale", "Ottavio fischia: parlagli per entrare in campo."); return H.done();
        }
        say("lm_gege", s < 3 ? "Fischio d'inizio tra poco. Mi scaldo guardandoti." : "Alla prossima. Io non mi stanco."); H.done();
      },
      lm_ottavio() {
        if (K.rel.scene("lm_ottavio")) return;
        const s = S();
        if (s === 2) return finale();
        say("lm_ottavio", s < 2 ? "Prima la squadra, poi il fischio. Il mare non ha fretta." : "Ho fischiato per quarant'anni. Il rigore di oggi lo ricorderò: giusto, per una volta."); H.done();
      },
      lm_dario() {
        if (K.rel.scene("lm_dario")) return;
        say("lm_dario", S() < 3 ? "Il torneo? Giochiamo. Poi si vede." : "Non adesso, piccolo. Non adesso."); H.done();
      },
      lm_quaglia() {
        say("lm_quaglia", "[pensa] Un bel torneo. Non scrivo quasi nulla: guardo. Si guarda meglio senza il taccuino in mano."); H.done();
      },
      lm_papa() {
        if (K.rel.scene("lm_papa")) return;
        say("lm_papa", H.v("Leo! Ho fritto mille acciughe oggi. La più grande frittura della storia d'Italia! Mangia, che stasera ti serve forza!", "Mangia. Il fritto è appena fatto. E non parlare con la bocca piena, anche se sei il capitano.")); H.done();
      },
      lm_rita() { say("lm_rita", "La banda ha sbagliato tre note su quattro. Ma con convinzione: è un talento."); H.done(); }
    };
    const zones = {
      lm_piazza: {
        region: "racconto", name: "La piazza del porto a Ferragosto", short: "Piazza del porto", sub: "Bancarelle, banda, un palco e un campo di sabbia con le righe di farina", bg: "lm_piazza", time: "sera", w: 34, h: 22, base: "Q", start: [2, 10], travel: [2, 10],
        areas: [[12, 2, 20, 5, "Il palco"], [8, 13, 25, 17, "Il campo del torneo"], [3, 7, 7, 7, "Le bancarelle di ponente"], [25, 7, 29, 7, "Le bancarelle di levante"], [0, 0, 33, 21, "La piazza del porto"]],
        act: { q: "Torna al Borgo", u: "Guarda la bancarella", l: "Guarda il lampione", t: "Guarda l'albero", g: "Guarda la porta", N: "Guarda la barca", O: "Guarda l'ombrellone", T: "Guarda la coppa", s: "Riposa un momento", w: "Guarda il mare" },
        flavor: { u: "Una bancarella: fritto di acciughe, granita al limone e una pila di palloncini che nessuno compra.", l: "Una fila di lampadine colorate. Una su tre è accesa: è un sistema.", T: (K) => (K.recall && K.recall.isTrue() ? "La coppa del torneo: latta, un po' ammaccata, con scritto «TORNEO DEL PORTO» e un errore di ortografia." : "La coppa del torneo: d'oro massiccio, alta come un bambino. Quattro uomini la devono portare."), N: "Una barca addobbata con bandierine. Dentro, i fuochi d'artificio e un signore che dice «non fumare».", O: "Un ombrellone aperto per la festa. Sotto, un cane, che ha capito tutto." },
        doors: { "0,9": { to: "lm_borgo", at: [21, 7] }, "0,10": { to: "lm_borgo", at: [21, 7] } },
        npcs: (s) => [{ id: "lm_nico", at: [10, 10] }, { id: "lm_gege", at: [22, 12] }, { id: "lm_ottavio", at: [18, 12] }, { id: "lm_papa", at: [4, 8] }, { id: "lm_rita", at: [8, 8] }, { id: "lm_dario", at: [14, 10] }, { id: "lm_quaglia", at: [28, 10] }],
        build(L) { buildPiazza(L, true); },
        eras: { vero: { label: "Com'è andata davvero", region: "vero", time: "sera", npcs: () => [{ id: "lm_nico", at: [10, 10] }, { id: "lm_gege", at: [22, 12] }, { id: "lm_ottavio", at: [18, 12] }, { id: "lm_papa", at: [4, 8] }, { id: "lm_rita", at: [8, 8] }, { id: "lm_dario", at: [14, 10] }, { id: "lm_quaglia", at: [28, 10] }], build(L) { buildPiazza(L, false); } } },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow(), vero = K.recall && K.recall.isTrue(); g.save();
          for (let i = 0; i < 12; i++) { const x = d.X(2 + i * 3) + 4, y = d.Y(8) + 2 + Math.sin(f / 10 + i) * 1.5; g.fillStyle = vero ? (i % 3 ? "#78716c" : "#facc15") : ["#ef4444", "#22c55e", "#3b82f6", "#facc15"][i % 4]; g.beginPath(); g.arc(x, y, 2.4, 0, 7); g.fill(); }
          if (!vero) { for (let i = 0; i < 8; i++) { const a = f / 12 + i; g.fillStyle = `rgba(${[255, 250, 120][i % 3]},${[200, 120, 255][i % 3]},${[80, 90, 130][i % 3]},.7)`; g.beginPath(); g.arc(d.X(28) + Math.cos(a) * 22, d.Y(14) + Math.sin(a) * 22 - 40, 2.5, 0, 7); g.fill(); } g.fillStyle = "rgba(255,200,60,.14)"; g.fillRect(d.X(0), d.Y(0), 34 * 16, 22 * 16); }
          g.restore(); H.plaque(g, vero ? "TORNEO DEL PORTO" : "TORNEO DEL MONDO", d.X(16), d.Y(2) - 4, "#fdba74"); H.plaque(g, "CAMPO", d.X(16), d.Y(13) - 2, "#bbf7d0");
        }
      }
    };
    return {
      n: N, title: "Ferragosto", sub: "Una banda stonata, una finale a tre e una porta che sbatte",
      goal, start: "lm_piazza", introBg: "lm_piazza", zones, talk, obj: {},
      patch: { lm_borgo: { build(Ls) { Ls.house(20, 3, 4, 4, { door: [21, 6], roof: "#e11d48", wall: "#fef3c7", enter: { to: "lm_piazza", at: [2, 10] } }); }, act: { q: "Entra" } } },
      intro: [["voce", "Quindici agosto. Il Borgo ha tirato fuori tutto: bandiere, fritto, un palco di assi, la banda."], ["voce", "Nel ricordo di Leo, la festa è il giorno più bello dell'anno. Nel ricordo vero, anche."]]
    };
  }
  boot();
})();
