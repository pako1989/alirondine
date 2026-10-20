// js/replica-c4.js - «EROI IN REPLICA» · Capitolo 4: Il Cielo di Casa
// Lo stadio, il duello finale con Zenit (Sparring livello 3) e il Peso che decide come finisce. Finali: figlio, cielo, terza (segreto).
(function () {
  "use strict";
  function boot() {
    const E = window.__replicaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__replicaH) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__replicaH(K), { say, done } = H, W = K.weight, DS = K.dossier;
    const N = 4, S = () => K.stepOf(N);
    H.people();
    K.cos("rp_c4", { kind: "shirt", label: "Maglia del Cielo", val: "#7dd3fc", from: "Capitolo 4 di Eroi in Replica" });
    K.lore("l_duello", { t: "Il Duello del Cielo", d: "Si combatte per decidere chi racconta la storia: Zenit, con il suo copione, o suo figlio, con le prove in mano." });

    const goal = (s) => ({
      0: "Parla con Marta e Brezza in tribuna.",
      1: "Prepara il duello: parla con Brezza, poi con Zenit.",
      2: "Il duello con Zenit.",
      3: "Il finale."
    }[s] || "Il capitolo 4 è concluso.");

    function ending(win) {
      const f = K.stat("fiducia"), r = K.stat("rabbia"), c = K.stat("colpa");
      const secret = f >= 3 && r >= 3 && DS.found("verita") >= 2, end = secret ? "terza" : f >= r ? "figlio" : "cielo";
      K.reward("rp_c4" + end, { coins: 300, cos: "rp_c4" });
      setStep(N, 4);
      const tail = c >= 3 ? [["voce", "Resta un peso piccolo e preciso nel petto: quello delle cose che avresti voluto dire prima."]] : [];
      const txt = secret
        ? [["voce", "Fuori dallo stadio, in una sera di vento, Brezza e gli «invasori» in congedo firmano su un tovagliolo: Nuova Lega, nessun cielo finto."], ["rp_brezza", "[felice] Hai detto tutto, e abbiamo trovato chi ti ascoltasse. Non capita a tutti."], ["voce", `<b>FINE DELLA STORIA · La Terza Via</b><br>${W.bar()}.`]]
        : end === "figlio"
          ? [["voce", "Zenit si ferma a mezz'aria e, davanti a tutte le telecamere, dice: «Sono finte. Le invasioni. Ho sbagliato io, non lui.»"], ["rp_marta", "[felice] Cena. Tutti. Anche gli eroi, anche la stampa se proprio deve."], ["voce", `<b>FINE DELLA STORIA · Figlio e Campione</b><br>${W.bar()}.`]]
          : [["voce", "Dici tutto al mondo. Il padre resta in cielo, tu a terra: una distanza giusta, ma pesante."], ["rp_zenit", "[triste] Ti ho insegnato a volare. Ora mi insegni a cadere."], ["voce", `<b>FINE DELLA STORIA · Il Cielo Diviso</b><br>${W.bar()}.`]];
      K.finishChapter(N, end); K.end(end);
      K.scene(txt.concat(tail, [["voce", "Gli altri finali sono nel Registro."]]), () => K.openMain(), "rp_stadio");
    }
    function duel(extra, charge) {
      say("rp_zenit", "[serio] Niente comunicati, niente applausi. Solo noi due.");
      H.play(3, "Zenit", "Il Duello del Cielo", (r) => {
        if (r && r.win) { say("rp_zenit", "[felice] Hai vinto. E pensavo che mi sarebbe dispiaciuto di più."); ending(true); }
        else { say("rp_zenit", "[pensa] Rialzati. Ti aspetto, ma non farmi aspettare per sempre."); done(); }
      }, extra, charge);
    }
    const talk = {
      rp_marta() {
        if (K.rel.scene("rp_marta")) return;
        const s = S();
        if (s === 0) {
          say("rp_marta", "[serio] Io ho sempre saputo. Non tutto, ma abbastanza da non domandare. Se ti serve una scusa per perdonarmi, usa il frigorifero.");
          say("rp_marta", "Vai. Qualunque cosa decidi, a cena ci sei. È un orario, non un'opinione.");
          K.learnLore("l_duello"); setStep(N, 1); quest("rp_c4", "Il Cielo di Casa", "Prepara il duello: Brezza, poi Zenit."); return done();
        }
        say("rp_marta", "Mangia, prima. Il cielo aspetta."); done();
      },
      rp_brezza() {
        if (K.rel.scene("rp_brezza")) return;
        const s = S();
        if (s === 1) {
          say("rp_brezza", "[serio] Un'ultima cosa. Parlargli prima, o colpirlo per primo: se hai abbastanza Fiducia o Rabbia, te lo consente.");
          return H.wask("Come ti prepari?", [
            { label: "🤝 «Parlargli prima»", sub: "Più vita nel duello", big: true, cls: "hot", need: { fiducia: 3 }, w: {}, fn: () => { F.set("rp_prep", "parla"); say("rp_brezza", "[felice] Lui ascolterà. Poi sarà lui a colpire male."); setStep(N, 2); done(); } },
            { label: "🔥 «Colpirlo per primo»", sub: "Più carica", need: { rabbia: 3 }, fn: () => { F.set("rp_prep", "colpo"); say("rp_brezza", "[pensa] Sarà un colpo giusto. Ma poi bisogna reggere il resto."); setStep(N, 2); done(); } },
            { label: "Come viene", sub: "Nessuna preparazione", fn: () => { F.set("rp_prep", ""); setStep(N, 2); done(); } }
          ]);
        }
        say("rp_brezza", s === 0 ? "Parla con Marta. Poi vieni." : "Ti guardo da qui. Poi volo come posso."); done();
      },
      rp_zenit() {
        if (K.rel.scene("rp_zenit")) return;
        const s = S();
        if (s === 2) { const pr = F.get("rp_prep", ""); return duel(pr === "parla" ? 2 : 0, pr === "colpo" ? 3 : 0); }
        say("rp_zenit", s < 2 ? "Quando sei pronto. Io intanto mi allungo." : "Eccoci."); done();
      }
    };
    const zones = {
      rp_stadio: {
        region: "stadio", name: "Lo Stadio del Cielo", short: "Stadio", sub: "Tribune divise a metà e un cerchio di centro", bg: "rp_stadio", time: "sera",
        w: 28, h: 18, start: [4, 9], items: [[2, 13], [24, 14]],
        areas: [[0, 0, 27, 17, "Lo Stadio: tifosi, striscioni e un cerchio di centro che pesa"]],
        npcs: () => [{ id: "rp_marta", at: [8, 9] }, { id: "rp_brezza", at: [12, 9] }, { id: "rp_zenit", at: [20, 9] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 17, 27, 17, "t"); lay(0, 0, 0, 17, "t"); lay(27, 0, 27, 17, "t");
          lay(1, 8, 26, 10, "+"); put(8, 14, "b"); put(19, 14, "b"); [[3, 3], [24, 3], [5, 15], [22, 15], [12, 3], [16, 3]].forEach(([x, y]) => put(x, y, "t"));
        }
      }
    };
    return {
      n: N, title: "Il Cielo di Casa", sub: "Un duello, un Peso e tre modi di finire",
      goal, start: "rp_stadio", introBg: "rp_stadio", zones, talk, obj: {},
      intro: [["voce", "Lo Stadio del Cielo. Metà tribuna per Zenit, metà per te."], ["voce", "Al centro, un cerchio di calce fresca. Sotto, una vita intera."]]
    };
  }
  boot();
})();
