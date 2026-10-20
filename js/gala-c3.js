// js/gala-c3.js - «IL RAPIMENTO DEL PALLONE D'ORO» · Capitolo 3: L'Alba
// Tutti nel salone. Si può ancora interrogare e rileggere il Registro; poi il verdetto, con quattro finali.
(function () {
  "use strict";
  function boot() {
    const E = window.__galaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__galaH || !window.__galaIv) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, F } = K, H = window.__galaH(K), { say, done, ask } = H;
    const N = 3;
    H.people();
    K.cos("pd_c3", { kind: "shirt", label: "Smoking dell'Alba", val: "#0f172a", from: "Capitolo 3 di Il Rapimento del Pallone d'Oro" });
    const found = () => K.alibi.found(), nd = () => K.dossier.list("pallone").length;
    const goal = () => F.is("pd_c3_done") ? "La storia è conclusa." : `Alba nel salone: tutti ascoltano. Registro ${found()}/6 · Dossier ${nd()}/5. Quando sei pronto, parla col Presidente per il verdetto.`;
    function ending(id, lines) {
      F.set("pd_c3_done", true);
      K.end(id);
      const msg = K.reward("pd_c3", { coins: 160, cos: "pd_c3" });
      K.finishChapter(N, id);
      K.scene(lines.concat([["voce", `<b>FINE DELLA STORIA.</b> ${msg.join(" · ")}<br>Hai trovato un finale. Gli altri ti aspettano nel Taccuino.`]]), () => K.openMain(), "pd_salone");
    }
    const giust = () => found() >= 4 && nd() >= 3, segr = () => found() >= 6 && F.is("pd_pp_won") && F.is("pd_livia_conf") && nd() >= 5;
    const eGiust = () => ending("giustizia", [
      ["pd_delmonte", "[arrabbiato] Una polizza è una polizza. Un pallone è un pallone. Non ho rubato niente: l'ho venduto."],
      ["hero", "Lei l'ha venduto, poi l'ha fatto sparire, poi ha incassato l'assicurazione. Nell'ordine."],
      ["voce", "Le prove vanno in fila sul tavolo da pranzo: la polizza, la ricevuta, la replica, la lettera, la chiave. Il silenzio è lungo e ha l'odore del caffè freddo."],
      ["pd_livia", "[serio] Quella lettera è mia. L'ho scritta io, e per la prima volta non la strappo."],
      ["voce", "Il ponte viene riparato a mezzogiorno. La polizia arriva con un caffè e un taccuino. Il Pallone vero, a quanto pare, è in una vetrina in un'altra città: lo riporteranno a casa con un verbale e un sospiro."]]);
    const eSegr = () => ending("segreto", [
      ["voce", "Parli per un'ora. Mostri il Registro, riga per riga: chi diceva dov'era, chi era davvero. Il Presidente ascolta, poi smette di ascoltare, poi smette di respirare."],
      ["hero", "E c'è un altro invitato che non figura da nessuna parte. L'Ospite. Il biglietto non l'ha spedito nessuno: se l'è procurato lui, perché stasera il Pallone cambiava mano."],
      ["pd_ospite", "[felice] Bellissimo. Sono il collezionista. Ho comprato un oggetto, non una vetrina, e stavo per ritirare la consegna."],
      ["voce", "Giù in cantina, dietro la botte con il doppio fondo, la cassa vera: dentro il Pallone d'Oro, con il suo autentico odore di cuoio e di anni. L'Ospite sorride, e allunga i polsi senza che nessuno glielo chieda."],
      ["pd_livia", "[felice] Quando tutto finisce, qualcuno deve ricordarsi di ringraziare chi ha ascoltato davvero."]]);
    const eCapro = () => ending("capro", [
      ["hero", "È stato Gualtiero. Voleva vendicarsi di tutti: la causa persa, il pallone, il nome sulla targa."],
      ["pd_gualtiero", "[arrabbiato] Io? Mi dica che scherza. Io ho solo comprato il Pallone, dieci anni fa, e nessuno me lo ha mai restituito!"],
      ["voce", "La polizia arriva a ponte riparato. Gualtiero non ha un alibi, ha una storia e un'espressione di chi se l'aspettava. Lo portano via mentre il Presidente gli stringe la mano."],
      ["voce", "Il vero colpevole offre da bere a tutti. Il caffè, quella mattina, ha un sapore più amaro del solito."]]);
    const eSil = () => ending("silenzio", [
      ["pd_livia", "[serio] Un patto. Il Pallone torna, mio marito si dimette per «motivi di salute», e nessuno finisce sui giornali. Questa è la mia offerta."],
      ["hero", "Una verità in cambio di un silenzio."],
      ["pd_livia", "[triste] Una vita in cambio di una cena. Grazie, e scusi."],
      ["voce", "Il Pallone, una settimana dopo, ricompare nella vetrina. Il Presidente si dimette. Il Borgo dorme tranquillo, tranne chi la vetrina l'aveva guardata davvero."]]);
    const ext = {
      pd_livia: () => [{ label: "🤝 Accetta il patto di Livia", sub: F.is("pd_livia_conf") ? "Finale «Il Silenzio di Livia»" : "Livia deve prima confessare", disabled: !F.is("pd_livia_conf"), fn: eSil }],
      pd_gualtiero: () => [{ label: "👉 «È stato lui»", sub: "Finale «Il Capro Espiatorio»", fn: eCapro }]
    };
    const iv = window.__galaIv(K, H, ext), talk = {};
    ["pd_livia", "pd_zeno", "pd_teresa", "pd_arturo", "pd_clio", "pd_gualtiero", "pd_ospite"].forEach((id) => { talk[id] = () => iv(id); });
    talk.pd_delmonte = () => {
      if (K.rel.scene("pd_delmonte")) return;
      ask(`Il Presidente aspetta, immobile come davanti a un rigore. Registro ${found()}/6 · Dossier ${nd()}/5.`, [
        { label: "⚖️ Accusalo: il furto era una messinscena", sub: giust() ? "Finale «La Verità sul Tavolo»" : `Servono 4 contraddizioni (${found()}) e 3 prove (${nd()})`, disabled: !giust(), big: giust(), cls: giust() ? "hot" : "", fn: eGiust },
        { label: "🕵️ Svela tutto, anche l'Ospite", sub: segr() ? "Finale segreto" : `Servono 6 contraddizioni (${found()}), 5 prove (${nd()}), la confessione di Livia e Zeno battuto a ping-pong`, disabled: !segr(), big: segr(), cls: segr() ? "hot" : "", fn: eSegr },
        { label: "📒 Apri il Registro delle Presenze", fn: () => K.alibi.open(() => done(), true) },
        { label: "Non ancora", fn: done }
      ]);
    };
    return {
      n: N, title: "L'Alba", sub: "Il verdetto",
      goal, start: "pd_salone", introBg: "pd_salone", zones: {}, talk, obj: {},
      intro: [["voce", "Alba. Il ponte è ancora crollato e la tempesta se n'è andata. Otto persone riunite nel salone, con le facce di chi ha dormito poco e mentito parecchio."], ["pd_delmonte", "[serio] Eccoci. Parli quando vuole. E si ricordi: ogni parola, qui dentro, ha un prezzo."]]
    };
  }
  boot();
})();
