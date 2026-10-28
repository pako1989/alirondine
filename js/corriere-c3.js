// js/corriere-c3.js - «IL CORRIERE DEL PALLONE» · Capitolo 3: La Volpe
// Il pacco sparisce di notte. Indizi da due persone (ognuna c'è solo a certi orari), appostamento nei Sotterranei dopo le 22, inseguimento a piedi attraverso i quartieri, poi Don Ettore.
(function () {
  "use strict";
  if (!window.__corriereCh) return;
  window.__corriereCh(function (K, S) {
    const on = () => K.ch() === 3, st = () => K.step(3), D = (n) => K.flag("c3_" + n);
    const wrap = (obj, id, fn) => { const prev = obj[id]; obj[id] = function (a, b) { return on() ? fn(a, b) : prev ? prev(a, b) : undefined; }; };
    const clues = () => ["pina", "lia", "tito"].filter((n) => D(n)).length;
    const ROUTE = [["sotterranei", 60, 60], ["sotterranei", 0, 60], ["stadio", 60, 60], ["stadio", 30, 60], ["stadio", 0, 60], ["collina", 60, 60], ["collina", 30, 60], ["collina", 30, 0], ["porto", 30, 60], ["porto", 30, 30]];
    const prevGoal = S.goal, prevHas = S.hasTalk;
    S.goal = () => {
      if (!on()) return prevGoal();
      const s = st();
      if (s === 0) return { text: "Mattina. Zia Marta ti sta cercando in Stazione.", target: { npc: "marta" } };
      if (s === 1) { const nx = !D("pina") ? "pina" : !D("lia") ? "lia" : "tito"; return { text: `Indizi: ${clues()}/2. Chiedi a Pina (Mercato, fino alle 15), Lia (Porto, fino alle 13) o Tito (Mercato, 15-20).`, target: { npc: nx } }; }
      if (s === 2) return { text: "Appostamento: nei Sotterranei, dopo le 22. Aspetta la Volpe.", target: { d: "sotterranei", at: [45, 52] } };
      if (s === 3) return { text: "Don Ettore, al Colle delle Ville: la Volpe ha fatto il suo nome.", target: { npc: "ettore" } };
      if (s === 4) return { text: "Racconta tutto a Zia Marta, in Stazione.", target: { npc: "marta" } };
      return { text: "Il capitolo 3 è concluso. Il capitolo 4 arriva.", target: null };
    };
    S.hasTalk = (id) => { if (!on()) return prevHas(id); const s = st(); return (s === 0 && id === "marta") || (s === 1 && ["pina", "lia", "tito"].includes(id) && !D(id)) || (s === 3 && id === "ettore") || (s === 4 && id === "marta"); };
    wrap(S.talk, "marta", () => {
      const s = st();
      if (s === 0) return K.say([["marta", "[triste] Il pacco non c'è più. Lo scaffale è vuoto, la porta socchiusa e sul pavimento una impronta di scarpa piccola. E un pelo rosso."], ["marta", "Una Volpe, la chiamano. Ruba di notte e lascia un biglietto con un indovinello. Stavolta niente biglietto: ha fretta o è timida."], ["marta", "Chiedi in giro: Nonna Pina, Lia o Tito. Due indizi bastano. E poi, dopo le dieci di sera, aspettala dove si nasconde."]], () => { K.setStep(3, 1); });
      if (s === 4) return K.say([["marta", "[sorpreso] Nina? La mia nipote? Con la maschera da Volpe? Nina, che a sei anni rubava le caramelle e le restituiva con un biglietto di scuse."], ["marta", "[pensa] Ettore dietro tutto. Il Colle delle Ville ha sempre avuto un debole per le cose rotte. Il pacco è di nuovo qui. E non lo apro nemmeno stavolta."], ["voce", "<b>FINE DEL CAPITOLO 3.</b> Un pacco, un pallone, un vecchio portiere e una nipote con la maschera: il capitolo 4 chiude la storia."]], () => { K.coins(150); K.finishChapter(3, "ok"); K.setStep(3, 5); K.toast("✅ Capitolo 3 concluso"); });
      K.say([["marta", "Occhi aperti, corriere. La Volpe corre più di una bici."]]);
    });
    const clue = (id, text) => () => {
      if (st() !== 1) return K.say([[id, "Buongiorno. Oggi nessuna novità."]]);
      if (D(id)) return K.say([[id, "Ti ho già detto tutto quello che so. Compreso quello che non so."]]);
      K.say(text, () => { K.setFlag("c3_" + id, 1); K.toast(`🔎 Indizio ${clues()}/2`); if (clues() >= 2) { K.setStep(3, 2); K.toast("🕘 Appostamento: dopo le 22, ai Sotterranei"); } K.refresh(); });
    };
    wrap(S.talk, "pina", clue("pina", [["pina", "[pensa] Una ragazzina con una maschera da volpe. Ha comprato una pagnotta e ha pagato con una moneta d'oro vecchia di cent'anni. L'ho conservata: ha lo stemma del Colle."]]));
    wrap(S.talk, "lia", clue("lia", [["lia", "[furbo] All'alba una ragazza è scesa nei Sotterranei con un pacco sotto il braccio. Ha chiesto il passaggio in barca, ma non ha pagato: ha lasciato un biglietto «a presto, Colle»."]]));
    wrap(S.talk, "tito", clue("tito", [["tito", "[serio] Una volpe vera! Cioè, no, una ragazza. Parlava del Colle e di un portiere che non dorme mai. Dice che la sera si ritrova dove il neon è azzurro."]]));
    S.poi.tana = (K) => {
      K.say([["voce", "Nei Sotterranei, il neon azzurro tremola. Un'ombra sottile scivola fuori dalle tubature: una maschera da volpe, un pacco sotto il braccio. Scatta."]], () => {
        K.chase("volpe", ROUTE, 7.4, (r) => {
          if (r.caught) K.say([["volpe", "[sorpreso] Mi hai preso! Nessuno corre così con una bici zoppa. ...Va bene, mi arrendo. Mi chiamo Nina."], ["volpe", "Don Ettore mi ha mandata. Il pallone è suo: la finale del '98, il suo ultimo gol sbagliato. Lo vuole, non per tenerlo: per capire."], ["voce", "Nina ti restituisce il pacco. «Parlaci tu, a Ettore. Gentile, se puoi.»"]], () => { K.setStep(3, 3); K.toast("🦊 Nina catturata"); });
          else K.say([["voce", "La Volpe scompare tra i tubi. Il fiatone è tuo, il pacco è suo. Domani notte potrai riprovare: aspetta di nuovo dopo le 22."]]);
        });
      });
    };
    wrap(S.talk, "ettore", () => {
      const s = st();
      if (s !== 3) return K.say([["ettore", "[freddo] Il corriere. Ancora. Non si usa più il cavallo?"]]);
      K.say([["ettore", "[pensa] Nina ha parlato. Bene. Sono stato un portiere, sai? Poi un cattivo perdente. Il pallone della finale del '98 è crepato per colpa mia: ho parato un rigore con la rabbia, non con le mani."], ["ettore", "Lo volevo indietro per rimetterlo a posto. Non per tenerlo."]], () => {
        K.ask("Don Ettore ti guarda, per una volta senza cappello.", [
          { label: "⚖️ «Non si ruba, nemmeno per un ricordo»", sub: "Giustizia", fn: () => { K.setFlag("c3_ettore", "giustizia"); K.say([["ettore", "[triste] Hai ragione. Ti pagherò il disturbo e restituirò la moneta d'oro a Pina."]], () => { K.coins(60); K.setStep(3, 4); }); } },
          { label: "🤝 «Il pallone lo decide Marta»", sub: "Accordo", fn: () => { K.setFlag("c3_ettore", "accordo"); K.say([["ettore", "[felice] Un accordo. Che parola vecchia e bella. Marta lo decide. Io aspetto."]], () => { K.coins(40); K.setStep(3, 4); }); } },
          { label: "🕯️ «Raccontami la finale»", sub: "Memoria", fn: () => { K.setFlag("c3_ettore", "memoria"); K.say([["ettore", "[felice] Era il novantotto. Minuto ottantanove. Un rigore e un pubblico che non respirava. Ho deviato la palla con il gomito e ho vinto il cielo, e perso tutto il resto."]], () => { K.coins(30); K.setStep(3, 4); }); } }
        ]);
      });
    });
  });
})();
