// ================= v21 · NOIR COSTIERO: IL PESCHERECCIO FANTASMA =================
// Saga narrativa investigativa (Stile True Detective & Breaking Bad ligure).
// Indagine notturna con il Maresciallo Lina Esposito sul "Sale Blu" del Golfo,
// chimica clandestina, bivi morali crudi e partite bagnate dalla pioggia.
(function () {
  const K_NOIR = "ali-di-rondine.saga-noir";

  function getNoirData() {
    try {
      return JSON.parse(localStorage.getItem(K_NOIR)) || { completed: 0, moralChoice: null };
    } catch {
      return { completed: 0, moralChoice: null };
    }
  }

  function saveNoirData(d) {
    try {
      localStorage.setItem(K_NOIR, JSON.stringify(d));
    } catch {}
  }

  function setChap(t) {
    const el = document.getElementById("chap");
    if (el) el.textContent = t;
  }

  function showText(who, html) {
    const el = document.getElementById("text");
    if (el) {
      el.innerHTML = `<span class="who" style="background:#14243d; border:1px solid #ffd23f; color:#ffd23f;">${who}</span><span class="t">${html}</span>`;
    }
  }

  function showButtons(list, one) {
    const c = document.getElementById("choices");
    if (!c) return;
    c.innerHTML = "";
    c.className = "choices" + (one ? " one" : "");
    list.forEach((o) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = o.label;
      if (o.cls) b.className = o.cls;
      if (o.sub) {
        const s = document.createElement("small");
        s.textContent = o.sub;
        b.appendChild(s);
      }
      b.onclick = () => {
        c.innerHTML = "";
        if (o.fn) o.fn();
      };
      c.appendChild(b);
    });
  }

  let onBackCb = null;

  function openNoirStoryMenu(onBack) {
    onBackCb = onBack;
    const data = getNoirData();
    setChap("Noir · Il Peschereccio Fantasma");

    showText(
      "lina",
      `
      «Moretti. Tira via il borsone e ascoltami. Il mare stanotte puzza di solvente chimico e bugie.<br>
      A Punta Nera c'è un vecchio peschereccio a secco. Dentro c'è un laboratorio clandestino. Sintetizzano una robaccia che chiamano <i>Sale Blu</i>: triplica i riflessi per novanta minuti, poi ti fa scoppiare il cuore.<br>
      E indovina un po' chi ha pagato i fusti di reagente? Qualcuno che ha in pugno il mutuo di tuo padre.»
    `
    );

    showButtons([
      {
        label: "Capitolo 1 · L'Infiltrazione a Punta Nera",
        sub: "Sotto la pioggia battente, tra le lamiere arrugginite",
        cls: "hot",
        fn: () => playEp1()
      },
      {
        label: "Capitolo 2 · La Faccia del Chimico",
        sub: data.completed >= 1 ? "Il dilemma nel laboratorio" : "Completa il Capitolo 1",
        disabled: data.completed < 1,
        fn: () => playEp2()
      },
      {
        label: "Capitolo 3 · La Sfida del Bacino di Carenaggio",
        sub: data.completed >= 2 ? "Partita clandestina contro i dopati" : "Completa il Capitolo 2",
        disabled: data.completed < 2,
        fn: () => playEp3()
      },
      {
        label: "◂ Torna al Menu",
        fn: () => {
          if (onBackCb) onBackCb();
        }
      }
    ], true);
  }

  function playEp1() {
    setChap("Noir · Ep. 1: Punta Nera");
    showText(
      "voce",
      `
      Mezzanotte passata. La pioggia d'ottobre sferza le scogliere nere. La Panda di servizio di Lina ha i fari spenti.<br>
      Camminate nel fango fino alla chiglia del peschereccio <i>Santa Chiara</i>. La porta della cabina è socchiusa: una luce al sodio illumina provette, becher e una bilancia di precisione.<br>
      Sul bancone c'è un registro con i nomi di due arbitri di Serie C e una busta gialla con la scritta: <b>Trattoria Moretti - Quietanza Saldata</b>.
    `
    );

    showButtons([
      {
        label: "Fotografa il registro contabile con Sara",
        sub: "Raccolta prove schiaccianti per i carabinieri",
        cls: "hot",
        fn: () => {
          const d = getNoirData();
          d.completed = Math.max(d.completed, 1);
          saveNoirData(d);
          if (window.toast) window.toast("Prova fotografata: Registro contabile!", "success", "📸");
          showText(
            "sara",
            `
            «Le foto sono nitide, Leo! Ci sono i bonifici verso una società di comodo registrata a Malta. Questa non è solo una combine calcistica: è riciclaggio su vasta scala.»
          `
          );
          showButtons([{ label: "Avanza al Capitolo 2 ▸", cls: "hot", fn: playEp2 }]);
        }
      },
      {
        label: "Prendi la busta della trattoria",
        sub: "Il dilemma: nascondere il debito di papà?",
        fn: () => {
          const d = getNoirData();
          d.completed = Math.max(d.completed, 1);
          saveNoirData(d);
          showText(
            "leo",
            `
            Stringi la busta in mano. Se la distruggi, tuo padre non rischierà mai di essere tirato in mezzo a questo fango. Ma Lina ti fissa con i suoi occhi d'acciaio. «Leo. Quella roba lasciala sul tavolo. Vinciamo puliti o non vinciamo.»
          `
          );
          showButtons([{ label: "Avanza al Capitolo 2 ▸", cls: "hot", fn: playEp2 }]);
        }
      }
    ]);
  }

  function playEp2() {
    setChap("Noir · Ep. 2: Il Chimico");
    showText(
      "voce",
      `
      Un cigolio metallico. Dall'ombra della stiva compare un uomo con un camice di gomma e gli occhiali incrostati di sale. Ha una fiala di Sale Blu stretta in pugno.<br>
      «Moretti. Il campioncino del borgo. Pensavi che il calcio vero funzionasse a trofie e sogni romantici? Il calcio professionistico è chimica e bilanci. Prendi questa fiala prima della finale di coppa e nessun portiere fermerà i tuoi tiri. O preferisci vedere tuo padre vendere le sedie della trattoria?»
    `
    );

    showButtons([
      {
        label: "Spezza la fiala a terra con una scarpata",
        sub: "Scelta morale: onore totale e rifiuto del compromesso",
        cls: "hot",
        fn: () => {
          const d = getNoirData();
          d.completed = Math.max(d.completed, 2);
          d.moralChoice = "rifiuto";
          saveNoirData(d);
          if (window.sfx) window.sfx("kick");
          showText(
            "leo",
            `
            <b>CRAC!</b> Il vetro si frantuma e la polvere bluastra si disperde nel fango.<br>
            «Mio padre mangia pane duro da vent'anni per stare a testa alta. Non rovinerò la sua dignità per un vostro barbatrucco chimico.»<br>
            Lina fa scattare le manette intorno ai polsi del chimico.
          `
          );
          showButtons([{ label: "Alla resa dei conti nel Bacino ▸", cls: "hot", fn: playEp3 }]);
        }
      },
      {
        label: "Fingi di accettare per scoprire i soci",
        sub: "Sotto copertura: strategia fredda da investigatore",
        fn: () => {
          const d = getNoirData();
          d.completed = Math.max(d.completed, 2);
          d.moralChoice = "infiltrato";
          saveNoirData(d);
          showText(
            "lina",
            `
            «Mossa rischiosa, calciatore. Ma ti ha dato l'indirizzo del bacino di carenaggio dove stasera si gioca la partita segreta per spartirsi le scommesse. Andiamo a fargli una visita con le scarpe coi tacchetti.»
          `
          );
          showButtons([{ label: "Alla resa dei conti nel Bacino ▸", cls: "hot", fn: playEp3 }]);
        }
      }
    ]);
  }

  function playEp3() {
    setChap("Noir · Ep. 3: Il Bacino di Carenaggio");
    showText(
      "voce",
      `
      Il Bacino di Carenaggio Vecchio: un rettangolo d'asfalto bagnato circondato da container e riflettori industriali arancioni.<br>
      I <i>Marinai della Notte</i> sono in campo: giocatori squalificati a vita che hanno assunto il Sale Blu. Occhi dilatati, respiro a mantice, zero paura del dolore.<br>
      Lina sale sul tetto di un container: «Moretti! Gioca questi trenta minuti e battili sul campo. Alle sirene ci penso io al momento giusto!»
    `
    );

    showButtons([
      {
        label: "Sfida decisiva: Tiro della Rondine contro i corrotti!",
        sub: "Metti tutta la grinta pulita del Borgo",
        cls: "hot",
        fn: () => resolveNoirMatch()
      }
    ], true);
  }

  function resolveNoirMatch() {
    if (window.triggerAnimeCutin) {
      window.triggerAnimeCutin(
        {
          who: "LEO MORETTI",
          shotName: "RONDINE DELLA VERITÀ",
          isEgo: false,
          sfxWord: "GIUSTIZIA!"
        },
        () => finishNoirEnding()
      );
    } else {
      finishNoirEnding();
    }
  }

  function finishNoirEnding() {
    const d = getNoirData();
    d.completed = 3;
    saveNoirData(d);

    if (window.sfx) window.sfx("goal");
    setChap("Noir · L'Alba della Giustizia");

    showText(
      "lina",
      `
      <b style="color:var(--gold); font-size:16px;">VITTORIA E RETATA A PUNTA NERA!</b><br>
      Il pallone scagliato da Leo sfonda la porta improvvisata proprio mentre le gazzelle dei carabinieri circondano il bacino a sirene spiegate.<br><br>
      Sequestrati tre quintali di sostanze, bloccate le scommesse e cancellati per sempre i debiti sporchi legati alla trattoria!<br>
      <i>Lina ti porge un caffè caldo dal thermos: «Ottimo lavoro, dieci. Ora torna ad allenarti... che domenica hai una partita vera da vincere!»</i>
    `
    );

    showButtons([
      {
        label: "Torna a Borgo Marino a testa alta ▸",
        cls: "hot",
        fn: () => {
          if (onBackCb) onBackCb();
        }
      }
    ], true);
  }

  window.openNoirStoryMenu = openNoirStoryMenu;
})();
