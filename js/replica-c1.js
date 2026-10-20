// js/replica-c1.js - «EROI IN REPLICA» · Capitolo 1: I Poteri
// Colazione di casa, primo volo (non voluto), Zenit al campo e il primo Sparring Volante con Basalto. Le scelte lasciano il Peso.
(function () {
  "use strict";
  function boot() {
    const E = window.__replicaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__replicaH) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__replicaH(K), { say, done } = H, W = K.weight;
    const N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("rp_c1", { kind: "shirt", label: "Maglia del Borgo", val: "#0369a1", from: "Capitolo 1 di Eroi in Replica" });
    K.lore("l_poteri", { t: "I Poteri", d: "A diciannove anni, i poteri arrivano di colpo: oggetti che galleggiano, salti da troppo in alto, un frigorifero a mezz'aria. Zenit dice che è una benedizione. Marta dice che è un'emergenza domestica." });
    K.lore("l_peso", { t: "Il Peso", d: "Ogni scelta lascia un segno: Fiducia, Colpa o Rabbia. Alcune strade si aprono solo se ne hai abbastanza." });

    const goal = (s) => ({
      0: "Entra in casa e parla con Marta.",
      1: "Esci sul campo e parla con tuo padre, Zenit.",
      2: "Parla con Basalto: il primo Sparring Volante.",
      3: "Il capitolo si chiude con la prima sera."
    }[s] || "Il capitolo 1 è concluso.");

    function fin() {
      F.set("rp_c1_done", true);
      K.reward("rp_c1", { coins: 70, cos: "rp_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([["voce", "Sera sul Borgo. Dal tetto di casa, due sagome contro il cielo: una vola, l'altra si fa cadere con stile."], ["voce", `<b>FINE DEL CAPITOLO 1.</b><br>${W.bar()} · Potere ${K.stat("potere")}.`], ["voce", "Il Capitolo 2, «L'Allenamento col Campione», ti aspetta."]]), () => K.openMain(), "rp_titolo");
    }
    function spar() {
      say("rp_basalto", "[serio] Regole semplici: schivi, poi colpisci. Io ho il vantaggio di avere sbagliato tutto per primo.");
      H.play(1, "Basalto", "Allenamento · Il Campo", (r) => {
        if (r && r.win) { setStep(N, 3); say("rp_basalto", "[felice] Ottimo. Hai la grazia di un frigorifero, ma almeno è una grazia."); K.inv.give("rp_diario"); K.bond("potere", 1); fin(); }
        else { say("rp_basalto", "[pensa] Rialzati. Cadere è metà del mestiere."); done(); }
      });
    }
    const talk = {
      rp_marta() {
        if (K.rel.scene("rp_marta")) return;
        const s = S();
        if (s === 0) {
          say("rp_marta", "[sorpreso] Buongiorno. Il frigorifero è a mezz'aria da cinque minuti, tu eri dietro. Non ti sgrido, ma è anche vero che il pavimento aveva un'opinione.");
          say("rp_marta", "[pensa] Succede ai figli degli eroi, a diciannove anni. Tuo padre non ti ha avvertito perché pensa che gli eroi imparino da soli. Io penso che gli eroi imparino male.");
          K.learnLore("l_poteri"); K.learnLore("l_peso"); K.inv.give("rp_medaglia"); setStep(N, 1);
          quest("rp_c1", "I Poteri", "Esci sul campo: tuo padre ti aspetta.");
          H.wask("Come rispondi a Marta?", [
            { label: "🤝 «Ho paura»", sub: "Dirle la verità", w: { fiducia: 1 }, fn: () => { say("rp_marta", "[triste] Anch'io. Per questo ti ho fatto la colazione."); done(); } },
            { label: "🔥 «Non è colpa mia»", sub: "Difendersi", w: { rabbia: 1 }, fn: () => { say("rp_marta", "[pensa] Mai detto che fosse colpa tua. Il frigorifero, forse."); done(); } },
            { label: "🕯️ «Scusa per il frigorifero»", sub: "Prendersi il peso", w: { colpa: 1 }, fn: () => { say("rp_marta", "Piantala. Mi basta che ti sieda."); done(); } }
          ]); return;
        }
        say("rp_marta", s < 3 ? "Mangia. Dopo, vola. Anzi no, dopo cammina." : "Bravo. A cena, mi racconti tutto."); done();
      },
      rp_zenit() {
        if (K.rel.scene("rp_zenit")) return;
        const s = S();
        if (s === 1) {
          say("rp_zenit", "[felice] Eccoti! L'ho sentito, sai? Quel frigorifero. Ha fatto un rumore da fine del mondo, ma gentile.");
          say("rp_zenit", "I poteri sono un dono. Io lo dico sempre in pubblico. In privato, sono un lavoro a tempo pieno senza ferie.");
          say("rp_zenit", "Ti presento Basalto, il più forte mio vecchio compagno. Allenati con lui. Io ho un'invasione aliena alle nove.");
          H.wask("Cosa gli dici?", [
            { label: "🤝 «Grazie per esserci»", sub: "Aprirsi", w: { fiducia: 1 }, fn: () => { say("rp_zenit", "[felice] Sempre. Salvo alieni, riunioni e invasioni alle nove."); setStep(N, 2); quest("rp_c1b", "Il primo allenamento", "Parla con Basalto sul campo."); done(); } },
            { label: "🔥 «Un'invasione alle nove?»", sub: "Notare l'orario", w: { rabbia: 1 }, fn: () => { say("rp_zenit", "[sorpreso] Sono sempre alle nove. Le invasioni sono puntuali."); setStep(N, 2); quest("rp_c1b", "Il primo allenamento", "Parla con Basalto sul campo."); done(); } },
            { label: "🕯️ «Non voglio deluderti»", sub: "Il peso delle aspettative", w: { colpa: 1 }, fn: () => { say("rp_zenit", "[pensa] Non puoi deludermi. Al massimo puoi sorprendermi, che è peggio."); setStep(N, 2); quest("rp_c1b", "Il primo allenamento", "Parla con Basalto sul campo."); done(); } }
          ]); return;
        }
        say("rp_zenit", s === 0 ? "Ti aspetto qui. Prima da tua madre: ha l'autorità." : s === 2 ? "Basalto ti aspetta. Non farlo aspettare: ha un orologio e pochi capelli." : "Ottimo lavoro. Oggi, sul serio."); done();
      },
      rp_basalto() {
        if (K.rel.scene("rp_basalto")) return;
        const s = S();
        if (s === 2) return spar();
        say("rp_basalto", s < 2 ? "Prima parla con tuo padre. Io non invecchio, mi stagiono." : "Allenati anche da solo. La mattina, il cielo è più educato."); done();
      }
    };
    const zones = {
      rp_borgo: {
        region: "borgo", name: "Il Borgo di Zenit", short: "Borgo", sub: "Casa, campo e un cielo troppo vicino", bg: "rp_borgo", time: "giorno",
        w: 28, h: 18, start: [4, 9], items: [[2, 13], [24, 14]],
        areas: [[0, 0, 27, 17, "Il Borgo: casette, un campo e tuo padre che atterra sulla siepe"]],
        npcs: () => [{ id: "rp_zenit", at: [14, 9] }, { id: "rp_basalto", at: [20, 9] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 0, "t"); lay(0, 17, 27, 17, "t"); lay(0, 0, 0, 17, "t"); lay(27, 0, 27, 17, "t");
          lay(1, 8, 26, 10, "+"); put(8, 14, "b"); put(19, 14, "b"); [[3, 3], [24, 3], [5, 15], [22, 15]].forEach(([x, y]) => put(x, y, "t"));
          house(5, 2, 6, 4, { door: [7, 5], roof: "#9a3412", enter: { room: "locanda", name: "Casa tua", who: ["rp_marta"] } });
        }
      }
    };
    return {
      n: N, title: "I Poteri", sub: "Un frigorifero, un volo e un allenamento",
      goal, start: "rp_borgo", introBg: "rp_titolo", zones, talk, obj: {},
      intro: [["voce", "Borgo di Zenit, mattina. Hai diciannove anni e un padre che è sulle copertine."], ["voce", "Poi il frigorifero si alza da solo, e capisci che non è colpa dell'elettricista."]]
    };
  }
  boot();
})();
