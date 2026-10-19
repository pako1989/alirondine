// js/capitani-c1.js - «CAPITANI DI VENTURA» · Capitolo 1: Il Ponte e il Contratto
// Accampamento → Pietrabianca (reclutare almeno 6 compagni in tutto) → Ponte contro la Compagnia del Lupo Grigio.
// Segue un capitolo 2 provvisorio («in arrivo»), così «Continua» non resta muto.
(function () {
  "use strict";
  function boot() {
    const E = window.__capitaniCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  const SHORT = { cv_isotta: "Isotta", cv_ambrogio: "Ambrogio", cv_brenno: "Brenno", cv_piccarda: "Piccarda", cv_tancredi: "Tancredi", cv_gemma: "Gemma", cv_dario: "Dario", cv_cunegonda: "Cunegonda", cv_letizia: "Letizia", cv_piero: "Piero", cv_zanna: "Zanna", cv_pellegrino: "Pellegrino" };

  function chapter1(K) {
    const { setStep, quest, F } = K;
    const N = 1, S = () => K.stepOf(N), CR = K.crew;
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    const gold = (n) => K.bond("scudi", n);
    const join = (id, txt) => { if (txt) say(id, txt); if (CR.recruit(id)) say("voce", `<b>${K.esc(CR.members[id].n)}</b> si unisce alla Rondine Scalza. (${CR.count()}/${CR.total})`); };

    const cast = (id, c, bio) => K.cast(id, c, bio);
    cast("cv_isotta", { name: "Isotta dei Conti", sub: "Tesoriera della Rondine Scalza", style: "bun", hair: "#4a2a1a", acc: ["occhiali", "taccuino"], skin: "#e0b890", eye: "#3a2a1a", shirt: "#7c2d12", bg: ["#78350f", "#fde68a"] }, "Tiene il libro cassa con la stessa cura con cui altri tengono un figlio. Il saldo, purtroppo, è un figlio problematico.");
    cast("cv_ambrogio", { name: "Frate Ambrogio", sub: "Cuoco e tattico", style: "bald", hair: "#8a8a8a", beard: "folta", acc: ["grembiule"], skin: "#d9a679", eye: "#3a3a2a", shirt: "#6b4f2a", bg: ["#78350f", "#fbbf24"] }, "Ha lasciato il convento per «motivi di pentola». Disegna le formazioni sul tavolo con la salsa.");
    cast("cv_brenno", { name: "Brenno il Gigante", sub: "Muro", style: "buzz", hair: "#3a2a1a", beard: "folta", acc: ["casco"], skin: "#c68642", eye: "#2a2a2a", shirt: "#475569", bg: ["#334155", "#cbd5e1"] }, "Due metri e un'enorme gentilezza. Chiede scusa agli avversari prima di fermarli.");
    cast("cv_piccarda", { name: "Piccarda la Gazza", sub: "Ala veloce", style: "ponytail", hair: "#1a1a1a", acc: ["bandana"], skin: "#d9a679", eye: "#3a2a1a", shirt: "#7c3aed", bg: ["#4c1d95", "#ddd6fe"] }, "Prende in prestito senza chiedere e restituisce senza dirlo.");
    cast("cv_tancredi", { name: "Ser Tancredi di Mezzaluna", sub: "Cavaliere decaduto", style: "slick", hair: "#5a3a1a", beard: "pizzetto", acc: ["fascia"], skin: "#e0b890", eye: "#2a4a6a", shirt: "#1e3a8a", bg: ["#1e3a8a", "#bfdbfe"] }, "Un nome di undici sillabe, un cavallo di tre gambe buone. Onore: intero.");
    cast("cv_gemma", { name: "Gemma la Balestriera", sub: "Tiratrice", style: "braids", hair: "#8a4a1a", acc: ["visiera"], skin: "#e0b890", eye: "#2a6a3a", shirt: "#166534", bg: ["#14532d", "#bbf7d0"] }, "Dice che il bersaglio sbaglia sempre posto. Nel frattempo lo centra.");
    cast("cv_dario", { name: "Dario il Cantastorie", sub: "Morale della truppa", style: "curly", hair: "#2a1a10", acc: ["berretto"], skin: "#d9a679", eye: "#3a2a1a", shirt: "#b91c1c", bg: ["#7f1d1d", "#fecaca"] }, "Canta le imprese prima che accadano. Per non mentire, poi tocca farle.");
    cast("cv_cunegonda", { name: "Cunegonda la Fabbra", sub: "Contrasto", style: "short", hair: "#2a2a2a", acc: ["grembiule"], skin: "#c68642", eye: "#2a2a2a", shirt: "#44403c", bg: ["#44403c", "#fdba74"] }, "Batte il ferro e le avversarie. Il ferro, per ora, con più risultati.");
    cast("cv_letizia", { name: "Madre Letizia", sub: "Cuoca del convento", style: "bob", hair: "#d8d8d8", acc: ["grembiule"], skin: "#e8c8a0", eye: "#3a3a2a", shirt: "#f1f5f9", bg: ["#475569", "#f1f5f9"] }, "Para con il mestolo. Benedice con lo stesso, ma con meno entusiasmo.");
    cast("cv_piero", { name: "Mastro Piero", sub: "Ingegnere", style: "spiky", hair: "#6b7280", acc: ["occhiali"], skin: "#d9a679", eye: "#3a3a2a", shirt: "#0f766e", bg: ["#134e4a", "#99f6e4"] }, "Costruisce macchine che funzionano quasi sempre. Il «quasi» è il suo marchio.");
    cast("cv_zanna", { name: "Zanna il Carrettiere", sub: "Corsa", style: "messy", hair: "#4a2a1a", beard: "folta", acc: ["paglia"], skin: "#c68642", eye: "#3a2a1a", shirt: "#92400e", bg: ["#78350f", "#fcd34d"] }, "Faccia da orso, anima da agnello. Il bue, al contrario.");
    cast("cv_pellegrino", { name: "Il Pellegrino", sub: "Viandante", style: "long", hair: "#9ca3af", beard: "folta", acc: ["sciarpa"], skin: "#d9a679", eye: "#4a5a7a", shirt: "#57534e", bg: ["#292524", "#d6d3d1"] }, "Cammina verso un posto che non ricorda. Ascolta molto e parla poco, e quando parla è meglio ascoltare.");
    cast("cv_oddone", { name: "Ser Oddone", sub: "Castellano del Conte Ruggero", style: "slick", hair: "#1a1a1a", beard: "pizzetto", acc: ["corona"], skin: "#e0b890", eye: "#2a2a2a", shirt: "#1d4ed8", bg: ["#1e3a8a", "#fde68a"] }, "Ama tre cose: il Conte, i contratti, e che gli altri firmino per primi.");
    cast("cv_lupo", { name: "Corvo, Capitano del Lupo Grigio", sub: "Compagnia rivale", style: "cresta", hair: "#374151", beard: "pizzetto", acc: ["fascia"], skin: "#c68642", eye: "#7f1d1d", shirt: "#374151", bg: ["#111827", "#9ca3af"] }, "Vince sempre. Nessuno sa se ci tenga davvero.");

    K.cos("cv_c1", { kind: "shirt", label: "Mantello della Rondine Scalza", val: "#7f1d1d", from: "Capitolo 1 di Capitani di Ventura" });
    K.lore("l_palla1427", { t: "La Palla di Cuoio", d: "Nel 1427 le guerre di confine si decidono con una partita: la palla decide, i morti no. Le compagnie di ventura la giocano per contratto, e il pallone costa più dell'avena." });
    K.lore("l_rondine_scalza", { t: "La Rondine Scalza", d: "Compagnia di ventura senza paga fissa e senza scarpe uguali. Tiene il conto delle imprese e dei debiti sullo stesso foglio, per equità." });

    const nrec = () => CR.count();
    const NEED = 6;
    const goal = (s) => ({
      0: "Parla con Isotta all'accampamento.",
      1: "Cerca Ser Oddone a Pietrabianca (porta a est dell'accampamento), vicino alla bacheca.",
      2: `Recluta compagni a Pietrabianca (${nrec()}/${NEED}). Tornare all'accampamento da Isotta.`,
      3: "Al ponte, a sud di Pietrabianca: Ser Oddone ti aspetta."
    }[s] || "Capitolo 1 concluso. Il capitolo 2 è in arrivo.");

    // -------------------------------------------------------------------- reclutamento
    function oneOffer(id, build) { // schermata di reclutamento: se già dentro, due parole
      if (CR.has(id)) { say(id, "Sono con voi. Dov'è il prossimo punto di ritrovo?"); return done(); }
      build();
    }
    const failTry = (id, txt) => { say(id, txt); done(); };

    const talk = {
      cv_isotta() {
        const s = S();
        if (s === 0) {
          say("cv_isotta", "[pensa] Capitano. Tre notizie. La buona: ho trovato un contratto. La media: pagano. La cattiva: pagano dopo.");
          say("cv_isotta", "Siamo in tre. Ambrogio cucina, Brenno regge il mondo, io tengo i conti. Per una partita serve altra gente.");
          say("cv_isotta", "Il Conte Ruggero ha bisogno di una Compagnia per difendere il Ponte di Pietrabianca. Vai al borgo, a est. E non firmare niente senza di me. O almeno, non senza guardarmi male.");
          join("cv_isotta"); join("cv_ambrogio"); join("cv_brenno");
          setStep(N, 1);
          quest("cv_c1_oddone", "Il contratto del Conte", "A Pietrabianca cerca Ser Oddone, vicino alla bacheca.");
          return done();
        }
        if (s === 1) { say("cv_isotta", "Pietrabianca è a est. Ser Oddone ha il contratto. Io ho una matita e la pazienza finita."); return done(); }
        if (s === 2) {
          if (nrec() < NEED) { say("cv_isotta", `In rosa siamo ${nrec()}. Ne servono almeno ${NEED}, o il Conte ci prende per una processione. In paese c'è gente in cerca di lavoro e sistemazione.`); return done(); }
          say("voce", "Il falò è acceso. La Rondine Scalza è quasi un gruppo.");
          say("cv_ambrogio", "[felice] Zuppa di fagioli. Il segreto è non dire a nessuno il segreto.");
          say("cv_dario", "[ride] Ho già scritto il ritornello della battaglia. Manca la battaglia, ma il ritornello è buono.");
          say("cv_isotta", "[pensa] Capitano. Prima dello scontro, una cosa. I conti dicono che siamo a rischio da ieri. Che cosa dico alla compagnia?");
          return ask("La sera prima della battaglia, la tesoriera ti guarda.", [
            { label: "«Vinceremo, e vi pagherò tutti»", sub: "Promessa. Onore +1, scudi -5", fn: () => { K.bond("onore", 1); gold(-5); say("cv_isotta", "[ride] Allora lo scrivo. A matita, per sicurezza."); setStep(N, 3); F.set("cv_prom", true); quest("cv_c1_ponte", "Il Ponte", "Scendi al Ponte di Pietrabianca, a sud del borgo."); done(); } },
            { label: "«Non so se vinceremo, ma siamo insieme»", sub: "Sincerità. Fama +1", fn: () => { K.bond("fama", 1); say("cv_ambrogio", "[felice] Questo sì, che si mette in pentola."); say("cv_isotta", "[pensa] La verità fa sempre un buon bilancio. Peccato che non sia mai in attivo."); setStep(N, 3); quest("cv_c1_ponte", "Il Ponte", "Scendi al Ponte di Pietrabianca, a sud del borgo."); done(); } },
            { label: "«Dormite. Parlo io col Conte»", sub: "Furbizia. Scudi +5", fn: () => { gold(5); say("cv_isotta", "[sorpreso] Un anticipo? Hai chiesto un anticipo? Capitano, hai un futuro."); setStep(N, 3); quest("cv_c1_ponte", "Il Ponte", "Scendi al Ponte di Pietrabianca, a sud del borgo."); done(); } }
          ]);
        }
        say("cv_isotta", "Il ponte è giù, a sud del borgo. Portate le scarpe. Quelle che avete.");
        done();
      },
      cv_ambrogio() {
        if (S() === 0) { say("cv_ambrogio", "Parla con Isotta. Io mi occupo della zuppa. È la mia unica certezza, a parte la fede."); return done(); }
        say("cv_ambrogio", "[felice] Una buona formazione è come una zuppa: pochi ingredienti, molta pazienza e uno che assaggia prima degli altri.");
        say("cv_ambrogio", "Se non hai ancora schierato la compagnia, siediti al falò o al tavolo. Decidi chi gioca, chi guarda e chi annusa la pentola.");
        done();
      },
      cv_brenno() {
        say("cv_brenno", "[felice] Scusa. Non volevo spaventarti. Sono fatto così: grosso.");
        if (S() >= 2) say("cv_brenno", "Al ponte starò davanti. Se qualcuno passa, mi scuserò prima. Poi non passerà.");
        done();
      },

      // ------------------------------------------------------------------ BORGO
      cv_oddone() {
        const s = S();
        if (K.inZone("cv_ponte")) {
          if (s < 3) { say("cv_oddone", "Il Conte vuole il ponte difeso. Ma voi non siete ancora pronti: tornate quando il vostro castellano avrà meno dubbi."); return done(); }
          if (s >= 4) { say("cv_oddone", "Il ponte è fermo. Il Conte è contento. Io sono quasi contento."); return done(); }
          say("cv_oddone", "[serio] La Compagnia del Lupo Grigio arriva da nord. Il Conte ha firmato: al primo fischio, partita. Chi passa il ponte con la palla, vince la contesa.");
          say("cv_oddone", `Avete ${CR.field().length} in campo. Contate bene: ${CR.field().map((id) => SHORT[id]).join(", ") || "nessuno"}. Cambiate formazione dal falò o dal registro, se serve.`);
          return ask("Siete pronti?", [
            { label: "⚔️ Schiera la compagnia", sub: "Chi gioca e chi guarda", cls: "hot", fn: () => CR.pick(K.done, true) },
            { label: "Sì, si gioca", big: true, fn: () => battle() },
            { label: "Un momento", fn: K.done }
          ]);
        }
        if (s === 0) { say("cv_oddone", "[serio] Non ho nulla da dire a gente che non è ancora una compagnia. Parlate con la vostra tesoriera."); return done(); }
        if (s === 1) {
          say("cv_oddone", "[serio] Compagnia della Rondine Scalza? Quella senza scarpe uguali? Hm. Il Conte accetta.");
          say("cv_oddone", "Contratto: difendere il Ponte di Pietrabianca dalla Compagnia del Lupo Grigio. Una partita, un pallone, un solo vincitore. Paga: centoventi scudi a vittoria, pasti inclusi, cavalli esclusi.");
          say("cv_oddone", `Servono almeno ${NEED} compagni, o il Conte fa di testa sua. Girate per il borgo: alla locanda, alla fucina, al tiro a segno, al convento. C'è chi cerca ingaggio, e chi lo cerca senza sapere di cercarlo.`);
          K.learnLore("l_palla1427");
          setStep(N, 2); K.questDone && K.questDone("cv_c1_oddone");
          quest("cv_c1_rec", "Almeno sei compagni", `Recluta gente a Pietrabianca (${NEED} in tutto). Poi torna da Isotta.`);
          return done();
        }
        if (s === 2) { say("cv_oddone", nrec() < NEED ? `Per ora ${nrec()}. Ne servono ${NEED}, castellano o non castellano.` : "Ora tornate all'accampamento a sistemare i conti. Poi al ponte."); return done(); }
        say("cv_oddone", "Il ponte è a sud. Fate presto, il Lupo non aspetta."); done();
      },

      cv_tancredi() {
        oneOffer("cv_tancredi", () => {
          say("cv_tancredi", "[serio] Ser Tancredi di Mezzaluna e di altri tre posti che non frequento più. Cerco una causa che meriti la mia spada.");
          say("cv_tancredi", "Dovrei essere pagato. Ma sono un cavaliere: non lo chiedo.");
          ask("Come lo convinci?", [
            { label: "Offri 20 scudi d'ingaggio", sub: `Hai ${K.stat("scudi")} scudi`, fn: () => { if (K.stat("scudi") < 20) return failTry("cv_tancredi", "[triste] Non ho abbastanza scudi e nemmeno cavalli. Siamo pari, ma non ci siamo."); gold(-20); join("cv_tancredi", "[felice] Accetto. Cavaliere sì, scemo no."); done(); } },
            { label: "Offri una causa", sub: "Difendere un ponte, a tue spese", fn: () => { K.bond("onore", 1); join("cv_tancredi", "[serio] Un ponte. Sì. Si difende un ponte, non si rimpiange un feudo."); done(); } },
            { label: "Sfida a morra", sub: "Mezz'ora per vincere o perdere", fn: () => { if (Math.random() < 0.5) join("cv_tancredi", "[ride] Persa. Mi unisco. Era previsto dal protocollo."); else { gold(-3); say("cv_tancredi", "[ride] Vinto io! Tre scudi. Ora però vediamo se ti piace perdere."); } done(); } }
          ]);
        });
      },
      cv_dario() {
        oneOffer("cv_dario", () => {
          say("cv_dario", "[ride] Dario, canto storie. Quella di stasera la sto ancora scrivendo.");
          ask("Dario ti guarda sperando in un pubblico.", [
            { label: "Ascolti la ballata fino in fondo", sub: "Sono quattordici strofe", fn: () => { K.bond("fama", 1); join("cv_dario", "[felice] Nessuno arriva mai in fondo! Sono tuo. Anche se non me l'hai chiesto."); done(); } },
            { label: "Gli chiedi di cantare per la truppa", sub: "Paga: pasti caldi", fn: () => { join("cv_dario", "[felice] Un pubblico fisso! Con le zuppe di Ambrogio, poi!"); done(); } },
            { label: "Gli dici che stona", sub: "Onestà brutale", fn: () => failTry("cv_dario", "[triste] ...Almeno sei sincero. Torna quando vuoi, imparerò.") }
          ]);
        });
      },
      cv_cunegonda() {
        oneOffer("cv_cunegonda", () => {
          say("cv_cunegonda", "[serio] Lavoro il ferro. Se hai da riparare qualcosa, parla. Se vuoi parlare e basta, vai fuori.");
          ask("Che offri?", [
            { label: "Porti il ferro dalla vecchia armatura", sub: "Scudi -8, mestiere", fn: () => { if (K.stat("scudi") < 8) return failTry("cv_cunegonda", "[triste] Il ferro costa. Quando avrai qualcosa, torna."); gold(-8); join("cv_cunegonda", "[felice] Ferro buono. Ci stai. La Compagnia ha bisogno di qualcuno che batta forte."); done(); } },
            { label: "La sfidi a braccio di ferro", sub: "Rischioso", fn: () => { if (K.stat("onore") >= 2 || Math.random() < 0.4) join("cv_cunegonda", "[ride] Tieni duro? Beh, direi di sì. Vengo con voi."); else failTry("cv_cunegonda", "[ride] Dopo di me, nessuno stringe più mani. Torna con rinforzi."); done(); } },
            { label: "Le dici di giocare, non di fare ferro", sub: "Pallone, non incudine", fn: () => { join("cv_cunegonda", "[pensa] Giocare... Una cosa che non faccio da bambina. Va bene, una partita."); done(); } }
          ]);
        });
      },
      cv_gemma() {
        oneOffer("cv_gemma", () => {
          say("cv_gemma", "[pensa] Tre colpi, un bersaglio. Se centri il mezzo, ti seguo.");
          ask("La balestra è carica.", [
            { label: "Tiri con calma (tiro)", sub: "Probabile", fn: () => { if (Math.random() < 0.65) join("cv_gemma", "[ride] Centro, o quasi. Vengo."); else failTry("cv_gemma", "[triste] Il bersaglio non c'entra. Provaci più tardi."); done(); } },
            { label: "Le lasci il vantaggio", sub: "Giochi di cortesia", fn: () => { join("cv_gemma", "[ride] Un capitano che mi lascia il tiro! Va bene, lavoro con voi."); done(); } },
            { label: "Non tiri", sub: "Non è il tuo mestiere", fn: () => failTry("cv_gemma", "[pensa] Sensato. Torna quando avrai qualcosa da dirmi.") }
          ]);
        });
      },
      cv_piccarda() {
        oneOffer("cv_piccarda", () => {
          say("cv_piccarda", "[furbo] Buongiorno, bella borsa. Oh, è tua? Che coincidenza.");
          if (F.get("cv_picc") === 1) say("cv_piccarda", "Ma la borsa te l'ho già restituita. Per metà.");
          ask("Piccarda ti ha preso la borsa.", [
            { label: "La fai restituire", sub: "Onore +1", fn: () => { K.bond("onore", 1); join("cv_piccarda", "[ride] Restituita. E per una volta, intera. Mi hai colpita: vengo."); done(); } },
            { label: "Le dici di tenerla", sub: "Scudi -4", fn: () => { gold(-4); join("cv_piccarda", "[felice] Un capitano che regala la borsa! Vengo, e ti restituisco metà."); done(); } },
            { label: "Chiami la guardia", sub: "Dura", fn: () => { K.bond("onore", 1); failTry("cv_piccarda", "[triste] Va bene, va bene, lasciata. Ora però non conto più su di te."); } }
          ]);
        });
      },
      cv_letizia() {
        oneOffer("cv_letizia", () => {
          say("cv_letizia", "[serio] La cucina è sacra, giovanotto. E i fagioli non si cuociono da soli.");
          say("cv_letizia", "Le sorelle dicono che con il mestolo ho una mano. Non so a cosa si riferiscano.");
          ask("Letizia ti guarda con sospetto cordiale.", [
            { label: "Aiuti in cucina", sub: "Un po' di tempo", fn: () => { join("cv_letizia", "[ride] Guarda un po': un capitano che sa pelare! Vengo. Qualcuno dovrà pur parare."); done(); } },
            { label: "Le dai due scudi per il convento", sub: "Scudi -2", fn: () => { if (K.stat("scudi") < 2) return failTry("cv_letizia", "[pensa] Basta il pensiero. Ma il pensiero non paga la legna."); gold(-2); K.bond("onore", 1); join("cv_letizia", "[felice] Che Dio benedica la tua generosità. Vengo con te."); done(); } },
            { label: "Le proponi di parare", sub: "Prova diretta", fn: () => { join("cv_letizia", "[ride] Parare? Con il mestolo? Sono nata per questo."); done(); } }
          ]);
        });
      },
      cv_piero() {
        oneOffer("cv_piero", () => {
          if (K.inZone("cv_ponte")) {
            say("cv_piero", "[pensa] Ecco la mia macchina per lanciare il pallone. Si chiama Ippogrifo. Funziona al sessanta per cento.");
          } else say("cv_piero", "Il ponte è pronto per una macchina. A voi manca la macchina.");
          ask("Piero ha un ingranaggio storto.", [
            { label: "Aiuti a sistemarlo", sub: "Un po' di fatica", fn: () => { join("cv_piero", "[felice] Perfetto! Funziona! No, aspetta. Sì. No. Va bene, vengo con voi."); done(); } },
            { label: "Gli chiedi di unirsi", sub: "Così com'è", fn: () => { join("cv_piero", "[ride] Con la mia officina! D'accordo, l'officina sta a Pietrabianca, io vengo."); done(); } }
          ]);
        });
      },
      cv_zanna() {
        oneOffer("cv_zanna", () => {
          say("cv_zanna", "[triste] Il bue non vuole muoversi. Il carretto sta per cedere. E io non so cosa fare.");
          ask("Il carro è bloccato sul ciglio.", [
            { label: "Spingi con lui", sub: "Fatica", fn: () => { join("cv_zanna", "[felice] Si è mosso! Il bue, dico. Vengo con voi, se vi serve uno che spinga."); done(); } },
            { label: "Offri un passaggio in compagnia", sub: "Il carro è già pieno", fn: () => { join("cv_zanna", "[ride] Il carro va con me, io con voi. Il bue va dove vuole."); done(); } }
          ]);
        });
      },
      cv_lupo() { say("cv_lupo", "[ride] Bel ponte. Peccato sia mio, tra una partita."); done(); },
      cv_pellegrino() {
        oneOffer("cv_pellegrino", () => {
          if (K.stat("onore") < 3 && !CR.has("cv_pellegrino")) { say("cv_pellegrino", "(Ti guarda a lungo e riprende il cammino.) Non è ancora il momento."); return done(); }
          say("cv_pellegrino", "[serio] Ho camminato molto. Non ricordo dove andavo. Ma accanto a voi il cammino sembra... meno lungo.");
          join("cv_pellegrino", "Se non vi dispiace, vengo con voi.");
          done();
        });
      }
    };

    // -------------------------------------------------------------------- oggetti
    const obj = {
      Y() { // bacheca di Pietrabianca
        say("voce", "Avvisi: «Cercasi carpentiere per ponte. Astenersi indecisi.» «Il bue di Zanna non si muove. Si offre mancia.» «Gemma vuole sfide. Astenersi vigliacchi.» «Madre Letizia ha bisogno di mani in cucina. Astenersi pigri.» «Piccarda: restituite la borsa. Grazie.»");
        done();
      },
      U() { say("voce", "Una fontana con un cavallo di pietra. Il cavallo è più grande di tutti quelli del Conte."); done(); },
      A() { say("voce", "Frecce, balestre, un bersaglio con la faccia di un barone. Qualcuno ci ha disegnato i baffi."); done(); }
    };

    // -------------------------------------------------------------------- battaglia
    function battle() {
      const field = CR.field(), names = field.filter((id) => id !== "cv_isotta").map((id) => SHORT[id]);
      const mate = names[0] || "Brenno";
      say("cv_oddone", "[serio] Fischio. Palla in campo.");
      K.say(flush(), () => K.playMatch({
        id: "cv_ponte", alt: "az", force: true, squad: names.slice(1, 4), mate, us: "La Rondine Scalza", oppTeam: "Il Lupo Grigio", oppColor: "#374151", homeKit: ["#7f1d1d", "#fbbf24"],
        oppNames: ["Corvo", "Rocco", "Ugo", "Falco"], intro: "Ponte di Pietrabianca · Rondine Scalza contro Lupo Grigio. Il perdente passa a piedi.",
        done: (r) => {
          if (!r.win) {
            return K.scene([["cv_lupo", "[ride] Passate pure. A piedi, come i veri rivali."], ["cv_oddone", "[triste] Riprovate. Il Conte è paziente. Più o meno."]], () => K.enterZone("cv_ponte"), "cv_ponte");
          }
          afterWin();
        }
      }));
    }
    function afterWin() {
      setStep(N, 4);
      K.bond("fama", 1);
      K.scene([
        ["cv_lupo", "[ride] Complimenti, Capitano. Il Conte non ha scelto male."],
        ["cv_lupo", "[pensa] Ma attenzione: il Conte non paga mai due volte la stessa persona."],
        ["cv_oddone", "[serio] Il Conte vi ringrazia. Ecco il pagamento: centoventi scudi. E il suo invito a servirlo anche in estate."]
      ], () => K.ask("voce", "Il Conte ha pagato. Ma il villaggio ha pagato di più, in paura. Che fai dei centoventi scudi?", [
        { label: "Tutti alla Compagnia", sub: "Scudi +120", big: true, fn: () => { gold(60); K.reward("cv_c1a", { coins: 120, cos: "cv_c1" }); fin("compagnia"); } },
        { label: "Metà al villaggio", sub: "Onore +2, scudi +60", big: true, fn: () => { K.bond("onore", 2); gold(30); K.reward("cv_c1b", { coins: 70, cos: "cv_c1" }); fin("villaggio"); } },
        { label: "Tutto al convento", sub: "Onore +3, nessuno scudo", big: true, fn: () => { K.bond("onore", 3); K.reward("cv_c1c", { coins: 30, cos: "cv_c1" }); fin("convento"); } }
      ]), "cv_ponte");
    }
    function fin(end) {
      K.finishChapter(N, end);
      K.scene([["voce", `<b>FINE DEL CAPITOLO 1.</b> Ponte salvo, Compagnia in campo (${CR.count()}/${CR.total} compagni). Il Conte vuole parlarvi ancora: nuove strade, nuovi contratti.`], ["voce", "Il Capitolo 2, «L'Estate dei Contratti», è in arrivo."]], () => K.openMain(), "cv_titolo");
    }

    // -------------------------------------------------------------------- zone
    const zones = {
      cv_campo: {
        region: "campo", name: "Accampamento della Rondine Scalza", short: "Accampamento", sub: "Tende rattoppate, un falò e una pentola che non si ferma mai", bg: "cv_campo", time: "giorno",
        w: 28, h: 18, start: [4, 9], items: [[3, 6], [22, 14]],
        areas: [[0, 0, 27, 17, "L'accampamento: quattro tende, un falò e un bilancio in rosso"]],
        flavor: { P: "Una tenda rattoppata in tre colori. Dentro, un pagliericcio e un debito.", t: "Un albero. Sul tronco, qualcuno ha inciso «NON PAGATO».", E: "Barili di zuppa, ceci e un'altra cosa che non vuoi sapere." },
        intro: [["voce", "1427. Il calcio si gioca con la Palla di Cuoio e le guerre si decidono con una partita: la palla decide, i morti no."], ["voce", "Tu sei il capitano della Compagnia della Rondine Scalza. Senza paga, con un mucchio di debiti e una tesoriera che ti guarda male."]],
        npcs: () => [{ id: "cv_isotta", at: [11, 9] }, { id: "cv_ambrogio", at: [15, 9] }, { id: "cv_brenno", at: [8, 8] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 17, 27, 17, "t"); lay(0, 0, 0, 17, "t"); lay(27, 0, 27, 17, "t");
          lay(1, 8, 26, 10, ":"); lay(12, 5, 13, 16, ":");
          put(4, 3, "P"); put(7, 3, "P"); put(4, 14, "P"); put(24, 14, "P");
          put(13, 9, "F"); put(13, 4, "V"); put(20, 5, "Z"); put(21, 5, "Z");
          put(22, 12, "A"); put(23, 12, "A"); put(5, 5, "C"); put(6, 5, "C"); put(9, 14, "E"); put(10, 14, "E");
          [[2, 2], [24, 3], [25, 6], [2, 15], [20, 15], [26, 8]].forEach(([x, y]) => put(x, y, "t"));
          house(27, 8, 1, 3, { door: [27, 9], enter: { to: "cv_borgo", at: [2, 11] } });
        }
      },
      cv_borgo: {
        region: "borgo", name: "Pietrabianca", short: "Pietrabianca", sub: "Un borgo con un ponte, un convento e poca pazienza", bg: "cv_borgo", time: "giorno",
        w: 32, h: 22, start: [2, 11], items: [[4, 15], [28, 6]],
        areas: [[0, 0, 31, 21, "Pietrabianca, il borgo del Conte Ruggero"]],
        flavor: { t: "Un albero. Più civile di quelli del campo: non ha niente di inciso." },
        npcs: () => [{ id: "cv_oddone", at: [12, 10] }, { id: "cv_gemma", at: [7, 15] }, { id: "cv_piccarda", at: [12, 15], route: [[12, 15], [20, 15], [20, 18], [12, 18]] },
          { id: "cv_pellegrino", at: [28, 9] }, { id: "cv_zanna", at: [26, 12] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "t"); lay(0, 21, 31, 21, "t"); lay(0, 0, 0, 21, "t"); lay(31, 0, 31, 21, "t");
          lay(1, 10, 30, 12, "+"); lay(14, 5, 16, 20, "+");
          put(15, 11, "U"); put(10, 9, "Y"); put(6, 14, "A"); put(7, 14, "A"); put(12, 4, "K");
          house(5, 3, 5, 4, { door: [7, 6], roof: "#6b3a2a", enter: { room: "bottega", name: "La Fucina di Cunegonda", who: ["cv_cunegonda"] } });
          house(19, 3, 6, 4, { door: [21, 6], roof: "#7c2d12", enter: { room: "locanda", name: "Il Cinghiale Zoppo", who: ["cv_tancredi", "cv_dario"] } });
          house(25, 14, 5, 4, { door: [27, 17], roof: "#9a8a6a", enter: { room: "casa", name: "Convento di Santa Rondine", who: ["cv_letizia"] } });
          house(0, 10, 1, 3, { door: [0, 11], enter: { to: "cv_campo", at: [25, 9] } });
          house(15, 21, 3, 1, { door: [16, 21], enter: { to: "cv_ponte", at: [14, 2] } });
          [[2, 3], [3, 17], [9, 18], [28, 4], [28, 20]].forEach(([x, y]) => put(x, y, "t"));
        }
      },
      cv_ponte: {
        region: "ponte", name: "Il Ponte di Pietrabianca", short: "Ponte", sub: "Un fiume, un ponte e un pallone che deciderà tutto", bg: "cv_ponte", time: "giorno",
        w: 28, h: 18, start: [14, 2], items: [[5, 5], [22, 4]],
        areas: [[0, 0, 27, 17, "Il ponte: l'unico passaggio per il castello del Conte"]],
        flavor: { w: "L'acqua scorre come se avesse fretta di non assistere." },
        npcs: (s) => [{ id: "cv_oddone", at: [14, 4] }, { id: "cv_piero", at: [7, 4] }].concat(s >= 3 ? [{ id: "cv_lupo", at: [14, 14] }] : []),
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 17, 27, 17, "t"); lay(0, 0, 0, 17, "t"); lay(27, 0, 27, 17, "t");
          lay(1, 7, 26, 10, "w"); lay(12, 7, 15, 10, "=");
          lay(14, 1, 14, 6, ":"); lay(14, 11, 14, 16, ":");
          put(20, 4, "C"); put(21, 4, "C"); put(3, 3, "t"); put(24, 3, "t"); put(3, 14, "t"); put(24, 14, "t");
          house(13, 0, 3, 1, { door: [14, 0], enter: { to: "cv_borgo", at: [16, 20] } });
        }
      }
    };

    return {
      n: N, title: "Il Ponte e il Contratto", sub: "Reclutare una compagnia, firmare un contratto e difendere un ponte",
      goal, start: "cv_campo", introBg: "cv_titolo", zones, talk, obj,
      intro: [["voce", "1427. Accampamento della Rondine Scalza."], ["voce", "Una compagnia di ventura. Un pallone di cuoio. Un contratto che non hai ancora."]]
    };
  }

  boot();
})();
