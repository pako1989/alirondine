// js/carte-mazzi.js - mazzi extra per «Carte del Destino». Esempio di come si estende: window.__carteDecks.register({...}), vedi js/carte.js
(function () {
  "use strict";
  if (!window.__carteDecks) return;
  window.__carteDecks.register({
    id: "marea", t: "Mazzo della Marea", e: "🌊", d: "Storie di notte e d'acqua: due personaggi, due eventi e un twist nuovi.",
    lock: "Vinci 3 storie del Mazzo del Molo", unlock: (c) => c.wins >= 3,
    pg: {
      risacca: { id: "cd_risacca", n: "Nonna Risacca", i: "🧶", tr: "cuore", d: "Rammendatrice di reti. Ha visto tre generazioni di campioni partire e due tornare.",
        cast: { name: "Nonna Risacca", sub: "Rammendatrice di reti", style: "bun", hair: "#d1d5db", acc: ["occhiali"], skin: "#e0b890", eye: "#4a6a8a", shirt: "#0f766e", bg: ["#134e4a", "#99f6e4"] },
        greet: (a) => `Siediti, figliolo. In ${a} le reti si rammendano in compagnia. Le storie, pure.`, win: "Visto? Basta il filo giusto. E qualcuno che lo tiene.", lose: "Una maglia salta, la rete regge lo stesso. Come noi." },
      postino: { id: "cd_postino", n: "Il Postino del Molo", i: "📮", tr: "furbizia", d: "Consegna lettere che nessuno ha spedito. Dice che sono sempre giuste.",
        cast: { name: "Il Postino del Molo", sub: "Consegne dal nulla", style: "slick", hair: "#1f2937", acc: ["cappellino"], skin: "#d9a679", eye: "#3a3a2a", shirt: "#1e40af", bg: ["#1e3a8a", "#fde68a"] },
        greet: (a) => `Posta per ${a}! Mittente: nessuno. Destinatario: tu. Firma qui, o non firmare, è uguale.`, win: "Consegnata. Come sempre, all'indirizzo giusto.", lose: "Indirizzo sbagliato. O forse la lettera era già arrivata, un'altra volta." }
    },
    ev: {
      lanterne: { n: "Le Lanterne sull'Acqua", i: "🏮", d: "Una notte di lanterne galleggianti: ognuna porta un desiderio.",
        setup: (p, a) => [["voce", "A {a} si accendono le lanterne e si lasciano andare sull'acqua, una alla volta."], [p, "Ogni lanterna porta un desiderio. Quella dell'ultimo arrivato, di solito, è la più pesante."], [p, "Hai una lanterna in mano. Che ne fai?"]],
        ch: [
          { t: "Esprimi un desiderio per gli altri", k: "cuore", ask: "Il tuo può aspettare.", win: "La lanterna galleggia più lontano di tutte. Qualcuno, sulla riva, sorride senza sapere perché.", lose: "Il vento la spegne subito. Ma il desiderio era partito, e questo vale." },
          { t: "Inseguila in barca", k: "audacia", ask: "Un desiderio va accompagnato.", win: "La segui fin dove il mare diventa nero. Torni a riva bagnato e con la lanterna ancora accesa.", lose: "La barca gira in tondo, la lanterna se ne va. Ridi da solo, in mezzo al mare." },
          { t: "Leggi i biglietti legati", k: "furbizia", ask: "Qualcuno ha scritto qualcosa di interessante.", win: "Trovi un biglietto con un indirizzo, e una frase sola: «Il pallone è sotto la barca». Ci vai. C'è davvero.", lose: "I biglietti sono illeggibili, bagnati. Resta la curiosità, che è già un premio piccolo." }
        ] },
      rete: { n: "La Rete Impigliata", i: "🕸️", d: "Qualcosa si è impigliato nella rete: pesa troppo per essere pesce.",
        setup: (p, a) => [["voce", "Nella rete, al largo di {a}, c'è qualcosa che pesa. Troppo, per essere un pesce."], [p, "Non l'ho mai tirata su in tre. Ma tre non abbiamo. Abbiamo te."]],
        ch: [
          { t: "Tira insieme, piano", k: "cuore", ask: "La pazienza paga.", win: "Piano, passo dopo passo, la rete sale. Dentro, una vecchia targa del molo, di quelle che non si fanno più.", lose: "La corda scivola e il carico torna giù. Ma la targa, intravista, la ricorderai." },
          { t: "Dai uno strattone secco", k: "audacia", ask: "O tutto o niente.", win: "Uno strattone, un urlo, e la rete sale. Qualcosa di brillante rotola sul ponte. Ridete, esausti.", lose: "La corda si spezza. La rete se ne va con il suo segreto, e tu con le mani rosse." },
          { t: "Studia la rete prima", k: "furbizia", ask: "Capire dov'è il nodo.", win: "Trovi il nodo giusto, lo sciogli: la rete si apre e il suo contenuto scivola fuori senza strappi.", lose: "Il nodo era un altro. Perdi tempo e, nel frattempo, il carico si libera da solo." }
        ] }
    },
    tw: {
      alta: { n: "Marea Alta", i: "🌊", d: "La marea sale: il premio si gonfia, se vinci.", win: "La marea sale e porta in {a} qualcosa di più. Il premio si gonfia.", lose: "La marea sale e non aspetta nessuno. Il premio resta sulla riva.", fx: (c, win) => (win ? Math.round(c * 1.5) : c) }
    }
  });
})();
