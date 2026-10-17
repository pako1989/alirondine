// js/sigilli-c2.js - «L'ACCADEMIA DEI SIGILLI» · Capitolo 2
// Capitolo 2: I Sotterranei della Biblioteca
// Un'anomalia magica scuote le fondamenta dell'Accademia:
// il Campione si addentra tra le scansie sospese della Biblioteca Proibita e scende nella Cripta dei Sigilli.
(function () {
  "use strict";
  function boot() {
    const D = window.__sigilli;
    if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 100);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { setStep, quest } = K;
    const N = 2, S = () => K.stepOf(N);

    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    const fin = (ending) => {
      const msg = K.reward("sg_c2", { coins: 100, cos: "sg_c2" }), lines = flush();
      K.finishChapter(N, ending || "ok");
      if (ending) K.end(ending);
      lines.push(["voce", `<b>SEGRETO DELLA CRIPTA SVELATO.</b> ${msg.join(" · ")}<br>Hai protetto il Sigillo del Tuono. Continua nel Capitolo 3: La Notte dei Quattro Sigilli sulla Torre dell'Osservatorio.`]);
      K.scene(lines, () => K.openMain(), "sg_torre");
    };

    K.cos("sg_c2", { kind: "shirt", label: "Toga stellata di Mezzanotte", val: "#1e1b4b", from: "Capitolo 2 di Accademia dei Sigilli" });
    K.lore("l_cripta", { t: "La Cripta dei Quattro Elementi", d: "Santuario sotterraneo dove i primi maestri incisero i sigilli originari sulla roccia viva del colle." });

    const goal = (s) => ({
      0: "Parla con lo spirito Archimede nella Biblioteca Sospesa.",
      1: "Raggiungi Miriel vicino alla porta della Cripta (a est).",
      2: "Scendi nella Cripta dei Sigilli e affronta il rivale Valerian.",
      3: "Supera la prova del Golem di Pietra nella sfida Traccia-Runa."
    }[s] || "Il secondo capitolo è completato. Continua con il Capitolo 3.");

    const zones = {
      sg_biblioteca: {
        region: "biblioteca", name: "Biblioteca Sospesa · Archivi Proibiti", short: "Biblioteca",
        sub: "Scansie vertiginose in mogano, tomi rilegati in pelle e polvere d'astri", bg: "sg_biblioteca", time: "notte",
        w: 24, h: 18, start: [4, 9], items: [[6, 5], [16, 12]],
        areas: [[0, 0, 23, 17, "Migliaia di trattati di tattica ed esoterismo sportivo fluttuano tra le volte"]],
        flavor: {
          L: "Un antico trattato: 'Sulla rotazione impressa dal piede del taumaturgo'.",
          A: "Un astrolabio con quadranti d'argento che tracciano le costellazioni calcistiche."
        },
        intro: [
          ["voce", "La notte è calata sull'Accademia, ma le vetrate della Biblioteca Proibita brillano di una strana luminescenza cangiante."],
          ["voce", "Tra le scansie d'antiquariato, lo spirito-gufo Archimede volteggia tra i tomi agitato da un cattivo presagio."]
        ],
        build(L) {
          L.lay(0, 0, 23, 17, ".");
          L.lay(0, 0, 23, 1, "#");
          L.lay(0, 16, 23, 17, "#");
          L.lay(0, 0, 1, 17, "#");
          L.lay(22, 0, 23, 17, "#");

          // Scansie di libri
          L.lay(3, 3, 9, 3, "L");
          L.lay(13, 3, 19, 3, "L");
          L.lay(3, 13, 9, 13, "L");
          L.lay(13, 13, 19, 13, "L");

          // Astrolabio al centro nord
          L.put(11, 4, "A");

          // Passaggio verso la Cripta a est
          L.house(20, 8, 3, 3, { door: [20, 9], enter: { to: "sg_cripta", at: [5, 8] } });
        },
        npcs(s) {
          return [
            { id: "sg_archimede", at: [6, 9] },
            { id: "sg_miriel", at: [17, 9] },
            { id: "sg_tobia", at: [11, 11] }
          ];
        }
      },

      sg_cripta: {
        region: "accademia", name: "La Cripta dei Quattro Sigilli", short: "Cripta", interior: true, outside: ["sg_biblioteca", 19, 9],
        sub: "Santuario millenario in granito con i piedistalli degli elementi", bg: "sg_biblioteca", time: "notte",
        w: 22, h: 16, start: [5, 8], items: [[12, 4]],
        areas: [[0, 0, 21, 15, "Le antiche lastre dove riposano le matrici dei quattro sigilli balistici"]],
        flavor: {
          u: "Il pavimento vibra: la Runa del Tuono emana archi voltaici bluastri.",
          S: "Il piedistallo di granito del Golem protettore."
        },
        build(L) {
          L.lay(0, 0, 21, 15, ".");
          L.lay(0, 0, 21, 1, "#");
          L.lay(0, 14, 21, 15, "#");
          L.lay(0, 0, 1, 15, "#");
          L.lay(20, 0, 21, 15, "#");

          // Rune elementali sul pavimento
          L.put(7, 5, "u");
          L.put(14, 5, "u");
          L.put(7, 11, "u");
          L.put(14, 11, "u");

          // Statue guardiane
          L.put(18, 5, "S");
          L.put(18, 11, "S");

          // Uscita verso la biblioteca a ovest
          L.house(2, 7, 3, 3, { door: [4, 8], enter: { to: "sg_biblioteca", at: [19, 9] } });
        },
        npcs(s) {
          return [
            { id: "sg_valerian", at: [14, 8] },
            { id: "sg_golem", at: [17, 8] }
          ];
        }
      }
    };

    const talk = {
      sg_archimede(K) {
        const s = S();
        if (s === 0) {
          say("sg_archimede", "Uh-uh! Silenzio negli archivi! Ma chi c'è lì... il nuovo campione delle matricole!");
          say("sg_archimede", "Qualcuno ha violato i sigilli della Cripta sotterranea. Valerian della Casa d'Ombra vuole appropriarsi della Runa del Tuono per vincere a tutti i costi.");
          say("sg_archimede", "Prendi questo frammento antico della formula e raggiungi Miriel davanti al portone della Cripta!");
          K.sgFrammento("archimede_c2", "Frammento del Tomo Proibito");
          setStep(N, 1);
          K.sgMana(20);
          quest("Discesa nella Cripta", "Raggiungi Miriel", "Parla con Miriel davanti al portale est per scendere nella Cripta dei Sigilli.");
          done();
        } else {
          say("sg_archimede", "La Cripta custodisce energie instabili. Non toccare le rune con le scarpe bagnate!");
          done();
        }
      },

      sg_miriel(K) {
        const s = S();
        if (s <= 1) {
          say("sg_miriel", "Meno male che sei qui! Valerian è sceso giù con una squadra di veterani e ha risvegliato il Golem di Pietra.");
          say("sg_miriel", "Per sconfiggerli dobbiamo sincronizzare la Runa del Vento con la Runa del Tuono: una saetta improvvisa a zig-zag spezza qualsiasi difesa.");
          ask("Entriamo nella Cripta per affrontare Valerian?", [
            {
              t: "Varchiamo il portale e affrontiamo la sfida",
              big: true,
              fn() {
                say("hero", "Nessuno ruba i sigilli dell'Accademia finché siamo noi a difendere il campo.");
                say("sg_miriel", "Questo è lo spirito giusto! Ti copro le spalle.");
                setStep(N, 2);
                quest("Confronto nella Cripta", "Ferma Valerian", "Entra nel portale a est e affronta Valerian nella Cripta.");
                done();
              }
            },
            {
              t: "Pianifichiamo la tattica con calma",
              fn() {
                say("sg_miriel", "Ottima idea: il Golem ha riflessi lenti sui tiri bassi. Useremo le carambole contro le pareti di pietra!");
                setStep(N, 2);
                quest("Confronto nella Cripta", "Ferma Valerian", "Entra nel portale a est e affronta Valerian nella Cripta.");
                done();
              }
            }
          ]);
        } else {
          say("sg_miriel", "La Cripta è aperta: entra prima che Valerian sovraccarichi il piedistallo!");
          done();
        }
      },

      sg_tobia(K) {
        say("sg_tobia", "M-mi tremano le ginocchia... ho sentito il passo pesante del Golem persino da quassù.");
        say("sg_tobia", "Tieni quest'altro frammento che ho trovato tra i tomi di storia. Ti porterà fortuna!");
        K.sgFrammento("tobia_c2", "Frammento del Secondo Anno");
        done();
      },

      sg_valerian(K) {
        const s = S();
        if (s < 2) {
          say("sg_valerian", "Questo posto è riservato ai veri maestri dell'ombra. Torna ai tuoi banchi, matricola.");
          done();
        } else {
          say("sg_valerian", "Sei arrivato troppo tardi, Campione. Il Golem di Granito risponde solo alla mia voce e il Sigillo del Tuono è già sotto il mio controllo.");
          say("sg_valerian", "L'Accademia ha bisogno di un capitano implacabile, non di studiosi che esitano davanti alla linea dell'area!");
          ask("Come intendi fermare l'avanzata di Valerian?", [
            {
              t: "Sfida Valerian & il Golem nel Traccia-Runa",
              big: true,
              fn() {
                say("sg_valerian", "Vediamo se le tue parabole sanno scalfire la mia barriera di fulmini!");
                const l = flush();
                const runMatch = () => {
                  K.ownMatch(window.__runaMatch.start, {
                    opp: { name: "Valerian & il Golem Runic", style: "pressing" },
                    us: K.hero().name,
                    turns: 5,
                    winTitle: "IL GOLEM È PLACATO!",
                    done(res) {
                      setStep(N, 3);
                      say("sg_valerian", "Impossibile... hai sciolto il legame magico del Golem con un solo tocco a parabola...");
                      say("sg_miriel", "La Cripta è al sicuro! Ma Valerian dice che stanotte sulla Torre dell'Osservatorio si compirà la Prova dei Quattro Sigilli.");
                      fin("ok");
                    }
                  });
                };
                if (l.length) K.say(l, runMatch); else runMatch();
              }
            },
            {
              t: "Duello d'azione nella Cripta",
              fn() {
                say("sg_valerian", "Accetto il confronto a viso aperto!");
                const l = flush();
                const runMatch = () => {
                  K.playMatch({
                    alt: "az,cage",
                    oppNames: ["Valerian d'Ombra", "Costrutto Runic", "Golem di Pietra"],
                    done(res) {
                      setStep(N, 3);
                      say("sg_valerian", "La tua rapidità di piede è sbalorditiva...");
                      fin("ok");
                    }
                  });
                };
                if (l.length) K.say(l, runMatch); else runMatch();
              }
            }
          ]);
        }
      },

      sg_golem(K) {
        say("sg_golem", "GROOOM... RISONANZA... RUNICA... RICONOSCIUTA... CAMPIONE... AMICO.");
        done();
      }
    };

    return {
      n: N,
      title: "I Sotterranei della Biblioteca",
      sub: "Il Mistero della Runa Spezzata",
      goal,
      start: "sg_biblioteca",
      introBg: "sg_biblioteca",
      zones,
      talk,
      intro: [
        ["voce", "La mezzanotte risuona tra le volte gotiche dell'Accademia dei Sigilli."],
        ["voce", "I sotterranei celano archivi proibiti e la monumentale Cripta dove i primi maestri incisero i pilastri della magia balistica."],
        ["voce", "Mentre l'aria si carica di scintille bluastre, ti inoltri tra le scansie sospese per svelare l'origine dell'anomalia."]
      ]
    };
  }

  boot();
})();
