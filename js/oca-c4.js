// js/oca-c4.js - «IL GIOCO DELL'OCA DEL CONTE» · Capitolo 4: Le Ultime Undici
// Mattina del quarto giorno. Lo studio chiuso del Conte si apre: la Busta 63 sulla scrivania, l'ultimo dado d'avorio nel cassetto, un tabellone in miniatura.
// Poi l'ultima tirata con tutti gli eredi, dalla Prigione (52) alla fine (63), con la Morte alla 58. Alla 63 si decide a chi va la villa: quattro finali.
// Finali: vivi «La Villa ai Vivi» · casella «Casella 63» · notaio «Tutto al Notaio» · bara «Il Conte Bara Ancora» (segreto: sette dadi e il notaio beccato due volte).
(function () {
  "use strict";
  function boot() {
    const E = window.__ocaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__ocaH || !window.__ocaZ || !window.__tabellone) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__ocaH(K), Z = window.__ocaZ, { say, done, ask } = H;
    const N = 4, S = () => K.stepOf(N);
    H.people();
    K.cos("oc_c4", { kind: "acc", label: "Coccarda della casella 63", val: "medaglia", from: "Capitolo 4 di Il Gioco dell'Oca del Conte" });
    K.lore("l_oc_studio", { t: "Lo studio del Conte", d: "Chiuso a chiave dal giorno del funerale. Una scrivania, un tabellone del gioco dell'oca in miniatura con sette pedine, e un calendario fermo al 14 marzo. Sulla scrivania, la Busta 63." });
    const segreto = () => H.dadi() >= 7 && H.beccato() >= 2;
    const pulito = () => F.is("oc_arrigo_sa") || F.is("oc_ricatto");
    const verita = () => F.is("oc_verita_ernestina") || (F.is("oc_lettera_tenuta") && K.inv.has("oc_lettera"));
    const viviOk = () => H.amici() >= 3 || K.stat("cuore") >= 5;
    const goal = (s) => ({
      0: "Lo studio del Conte è aperto (la porta piccola a sinistra, sulla facciata della villa). La Busta 63 è sulla scrivania.",
      1: "Gilda ti aspetta al tabellone: l'ultima tirata, dalla Prigione alla fine. Prima, se vuoi, salutare gli eredi.",
      2: "Casella 63. Si decide a chi va la villa.",
      3: "La partita è finita."
    }[s] || "La saga è conclusa.");

    const ENDS = {
      vivi: { coins: 500, bg: "oc_villa", lines: () => [
        ["voce", "Apri la Busta 63 davanti a tutti. Dentro c'è un foglio solo, scritto in grande: «A chi arriva primo: decidi tu. Io ho deciso male una volta, e ho pagato bene.»"],
        ["voce", "Guardi gli eredi. Arrigo coi suoi dadi in tasca, Ernestina col mestolo, Ofelia con le carte, Tonio con la ginocchiera, i gemelli fianco a fianco. E dici la cosa più semplice: «A tutti. Purché ci vivano insieme.»"],
        ["oc_gilda", "[sorpreso] È… ammissibile. Il testamento dice «a chi vince decidere». Non dice che non si può decidere tutti."],
        ["voce", "Un anno dopo. Ernestina in cucina, Tonio allena i pulcini della Rondinese sul prato, Ofelia legge le carte nella serra (ora a pagamento), i gemelli litigano a voce, ma a tavola. Arrigo tiene i conti. Gilda li controlla due volte."],
        ["oc_ernestina", "[ride] Il primo pranzo della domenica è finito senza morti. Il secondo, quasi. Ma il brodo è sempre sul fuoco."]
      ] },
      casella: { coins: 520, bg: "oc_63", lines: () => [
        ["voce", "Alla 63 apri la Busta davanti a tutti. Dentro ci sono due fogli. Il primo è il registro del '72, la pagina 63, con la riga a penna rossa. Il secondo è una riga sola: «La villa va a mia figlia. Lei sa cucinare, e sa perdere.»"],
        ["oc_ernestina", "[triste] …Lo sapevo. Non lo sapevo, ma lo sapevo."],
        ["oc_arrigo", "[serio] Mio padre. Il registro. Lo zio in galera per lui. …Firmo. Firmo tutto quello che c'è da firmare. Senza ritardo, per una volta."],
        ["voce", "Ernestina appende il ritratto del Conte in cucina, accanto a quello di sua madre. Li guarda insieme per la prima volta. Poi accende il brodo."],
        ["oc_ernestina", "[felice] Domenica pranzo. Tutti. Anche lei, notaio. Si siede a capotavola chi perde all'oca. Regola del Conte. Regola mia."]
      ] },
      notaio: { coins: 300, bg: "oc_notaio", lines: (r) => [
        ["voce", r && !r.win ? "Arrigo arriva alla 63 un tiro prima di te, con un dado che stavolta gira dalla parte giusta da solo. Forse. Apre la Busta 63 con le mani che tremano." : "Arrivi alla 63, prendi la Busta, e la metti in mano ad Arrigo. «Se la vuole, se la prenda.» Arrigo la guarda come si guarda un dado truccato."],
        ["oc_arrigo", "[furbo] Firmo, vendo, e al posto del parco sorge «Residenza Le Oche». Sessantatré bilocali. Con le oche nel logo."],
        ["voce", "Sei mesi dopo, il parco è un cantiere. La fontana dell'oca è nel giardino di un bilocale col nome «Casella 6». Ernestina ha aperto una trattoria in paese: «Da Lucia». C'è sempre il brodo sul fuoco."],
        ["voce", "Teo è sparito il giorno della firma. Le oche no: le hanno trasferite sulla circonvallazione, dove camminano sulle strisce e fanno rallentare tutti. Il Conte ne sarebbe contento."],
        ["oc_arrigo", "[pensa] A volte la notte sogno lo zio che mi chiede la rivincita. Io dico di no. Lui tira i dadi lo stesso."]
      ] },
      bara: { coins: 650, bg: "oc_bara", lines: () => [
        ["voce", "Alla 63 posi i sette dadi d'avorio sulla casella, uno accanto all'altro. Le oche si fermano tutte insieme. Dietro di te, una voce che conosci, ma più vecchia e più nobile:"],
        ["oc_teo", "[ride] Sette su sette. E il notaio beccato due volte. Nessuno ci era mai riuscito. Neanche io."],
        ["voce", "Teo si toglie il cappello. Poi la barba, che era finta. Sotto c'è un vecchio coi baffi e l'aria di chi ha appena barato a un funerale: il suo."],
        ["oc_conte", "[ride] Conte Ugolino Pastrocchi. Vivo, e piuttosto in forma. Il funerale era bellissimo: c'erano tutti, perfino Arrigo, con la cravatta giusta. Volevo vedere chi mi voleva bene. Adesso lo so. Qualcuno mi faccia un caffè."],
        ["voce", "Ernestina gli tira il mestolo. Lo prende in pieno. Poi lo abbraccia, e non lo lascia per un minuto intero, mentre lui le dice all'orecchio una cosa che aspettava di dire da cinquantatré anni."],
        ["oc_gilda", "[serio] Il testamento di un uomo vivo è nullo. Quindi si rigioca. Domenica. Stavolta gioca anche lui."],
        ["oc_arrigo", "[arrabbiato] E bara! Lo so che bara! Era lui che mi ha insegnato!"]
      ] }
    };
    function ending(id, r) {
      const E2 = ENDS[id];
      setStep(N, 3); F.set("oc_c4_done", true); F.set("oc_fine_" + id, true);
      K.reward("oc_c4" + id, { coins: E2.coins, cos: "oc_c4" });
      K.finishChapter(N, id); K.end(id);
      K.scene(H.flush().concat(E2.lines(r)).concat([
        ["voce", `<b>FINE DI IL GIOCO DELL'OCA DEL CONTE.</b><br>${H.stato()}`],
        ["voce", "Nella Sala Giochi del Salone si è acceso un cabinato nuovo: «Oca Express». E da oggi, al Borgo, c'è una cuoca che porta il tabellone al bar il giovedì."]
      ]), () => K.openMain(), E2.bg);
    }
    function finale(r) {
      setStep(N, 2);
      const o = [];
      if (segreto()) o.push({ label: "🎲 Posa i sette dadi d'avorio sulla 63", sub: "Segreto · sette dadi, il notaio beccato due volte", big: true, fn: () => ending("bara", r) });
      o.push({ label: "🏡 La villa a tutti", sub: viviOk() ? "Purché ci vivano insieme" : `Servono tre eredi amici (ora ${H.amici()}) o Cuore 5`, big: true, disabled: !viviOk(), fn: () => ending("vivi", r) });
      o.push({ label: "✉️ Apri la Busta e leggi la verità", sub: verita() ? "Il '72, la lettera, Lucia, Ernestina" : "Ti manca un pezzo: la verità va detta a chi riguarda", big: true, disabled: !verita(), fn: () => ending("casella", r) });
      o.push({ label: "🎩 Dai la Busta ad Arrigo", sub: "Che se la prenda lui", fn: () => ending("notaio", r) });
      if (!segreto()) say("voce", `<span style="opacity:.75">(Dadi d'avorio: ${H.dadi()}/7 · notaio beccato: ${H.beccato()}. Certi finali si guadagnano prima.)</span>`);
      ask("Casella 63. Il tabellone è finito. Sei eredi ti guardano, e la Busta ha l'oca di ceralacca intatta.", o);
    }
    function ultima() {
      const story = {
        55: { who: "oc_ofelia", t: "L'ultima previsione", text: "Ofelia ti prende la mano sopra la 55. «Vedo… vedo una casella nera, e qualcuno che ci cade. Non so se sei tu. Le mie previsioni sono sicure al cinquanta per cento.»", opts: [
          { label: "🔮 «E l'altro cinquanta?»", sub: "Ti fidi", eff: { give: "santino", flag: "oc_ofelia_ultima" }, after: "«L'altro cinquanta è un santino.» Te ne mette uno in mano. «Era del Conte. Ce l'aveva in tasca quando giocava. Diceva che non serviva a niente, e intanto lo teneva.»" },
          { label: "🦊 «La prossima volta tiri i dadi, non le carte.»", sub: "Avanti di 1", eff: { move: 1 }, after: "Ofelia ride per davvero, per la prima volta. «Il Conte diceva la stessa cosa. Con le stesse parole. Mi fa un po' impressione.»" }] },
        57: { who: "oc_tonio", t: "Scivolata sulla Morte", text: "Sei alla 57. La 58, la Morte, è lì davanti, dipinta con un teschio con la sciarpa della Rondinese. Tonio si fa il segno della croce, poi si toglie la giacca.", opts: [
          { label: "🦵 «Tonio, entra!»", sub: "Ti spinge oltre la 58: avanti di 2", eff: { move: 2, flag: "oc_scivolata" }, after: "Tonio entra in scivolata sul viale, ti prende la pedina e la porta alla 59. Si rialza con la ghiaia nei capelli. «Ventinove ammonizioni. Questa è la più bella.»" },
          { label: "❤️ «No. Ci arrivo da solo.»", sub: "Nessun aiuto", eff: { flag: "oc_da_solo" }, after: "Tonio annuisce, serio. «Come un terzino vero.» Si rimette la giacca." }] },
        61: F.is("oc_gemelli_pace") ? { who: "oc_damiano", t: "Il passaggio dei gemelli", text: "Alla 61 i gemelli ti aspettano. Cosimo ha una carta in mano, Damiano un'altra. «Ne abbiamo una a testa. Una la teniamo. Una te la diamo. Decidi tu quale.»", opts: [
          { label: "🧤 La carta di Cosimo", sub: "Una corda", eff: { give: "corda" }, after: "«Scambi il posto con chi ti sta davanti», dice Cosimo. «Ma non con me, eh.»" },
          { label: "👟 La carta di Damiano", sub: "Un'oca di carta", eff: { give: "ocacarta" }, after: "«Dopo una mossa rilanci», dice Damiano. «Tira basso, mi raccomando. Io tiravo alto.»" }] }
          : { who: "oc_cosimo", t: "Due gemelli, una casella", text: "Alla 61 i gemelli sono finiti sulla stessa casella. Nessuno dei due si sposta. «Spostati tu.» «No, tu.»", opts: [{ label: "❤️ «Spostatevi insieme.»", sub: "Una volta sola", eff: { flag: "oc_gemelli_ultima" }, after: "Si spostano insieme. Per un attimo, su una casella del gioco dell'oca, i gemelli Pastrocchi sono d'accordo." }] }
      };
      const riv = ["arrigo", "ofelia", "tonio", "ernestina", "cosimo", "damiano"].map((k) => (k === "arrigo" && pulito() ? Object.assign({}, H.RIV.arrigo, { ai: "base", n: "Arrigo (pulito)" }) : k));
      H.tirata({ title: "Ultima tirata · fino alla 63", from: 52, to: 63, rivals: riv, diff: 2, bg: "oc_63", story }, (r) => {
        if (r.flags.oc_scivolata) K.rel.add("oc_tonio", 2); if (r.flags.oc_da_solo) K.bond("cuore", 1); if (r.flags.oc_ofelia_ultima) K.rel.add("oc_ofelia", 2); if (r.flags.oc_gemelli_ultima) { K.rel.add("oc_cosimo", 1); K.rel.add("oc_damiano", 1); }
        if (!r.win) {
          say("voce", `Casella 63. ${H.esito(r)} Arrigo è già lì, con la mano tesa verso la Busta.`);
          say("oc_gilda", "[serio] Il testamento prevede una rivincita. Una. «Perché tutti meritano una seconda tirata. Io l'ho avuta.»");
          return ask("La Busta è sul tavolo di Gilda, ancora chiusa. Arrigo aspetta.", [
            { label: "🎲 Rivincita · l'ultima tirata da capo", sub: "Dalla 52 alla 63", big: true, fn: ultima },
            { label: "🎩 Lascia la Busta ad Arrigo", sub: "Finisce così", fn: () => ending("notaio", r) }
          ]);
        }
        say("voce", `Casella 63. ${H.esito(r)} Le oche si alzano in volo tutte insieme, poi si riposano sul tetto della villa, offese dal rumore che fanno gli eredi.`);
        say("oc_gilda", "[serio] Il giocatore neutrale arriva primo. Come da testamento, la Busta 63 è sua. E con lei, la decisione.");
        finale(r);
      });
    }

    const talk = {
      oc_gilda() {
        const s = S();
        if (s === 0) { say("oc_gilda", "[serio] Prima la Busta. È nello studio del Conte, la porta piccola a sinistra sulla facciata. Ho tolto io i sigilli stamattina. Poi l'ultima tirata."); return done(); }
        if (s === 1) {
          say("oc_gilda", "[serio] Ultima tirata. Tutti in campo. La Morte alla 58: chi ci cade torna alla 52. Chi arriva primo alla 63 apre la Busta.");
          if (pulito()) say("oc_gilda", "[pensa] Arrigo ha lasciato i suoi dadi sul mio tavolo. Tutti e sei. Ha detto «per una volta». Li ho chiusi in cassaforte, per sicurezza.");
          return ask("Sei pedine sulla 52, più la tua. Gli eredi si guardano. Nessuno parla. Teo ha smesso di potare.", [
            { label: "🎲 Si comincia · Ultima tirata", sub: "Dalla Prigione (52) alla fine (63), con tutti", big: true, fn: ultima },
            { label: "◂ Un momento", sub: "Prima saluta gli eredi", fn: done }
          ]);
        }
        say("oc_gilda", "La partita è finita. Il registro è chiuso. Il Conte sarebbe contento: è finita in modo irregolare."); done();
      },
      oc_ernestina() { if (K.rel.scene("oc_ernestina")) return; say("oc_ernestina", F.is("oc_verita_ernestina") ? "[pensa] Undici caselle. Comunque vada, io a pranzo faccio il ragù. Lui diceva che era buono. Non me l'ha mai detto, ma l'ha scritto sul muro." : "[serio] Undici caselle, e la lettera. Ho fatto il brodo stamattina. Mi tremavano le mani, ma il brodo è venuto lo stesso."); done(); },
      oc_arrigo() { if (K.rel.scene("oc_arrigo")) return; say("oc_arrigo", pulito() ? "[serio] Senza dadi miei mi sento un portiere senza guanti. Però gioco. Pulito. Mi guardi bene: non succederà più." : "[furbo] Ultima tirata. Ultima occasione. Io porto sempre una lente nel taschino: per le clausole scritte in piccolo, sa."); done(); },
      oc_ofelia() { if (K.rel.scene("oc_ofelia")) return; say("oc_ofelia", "[pensa] Le carte dicono che stamattina vince qualcuno. Ci ho messo un'ora a capirlo. Sono sicura al cento per cento, stavolta."); done(); },
      oc_tonio() { if (K.rel.scene("oc_tonio")) return; say("oc_tonio", "[serio] L'ultima partita della mia carriera l'ho giocata qui, sul prato, contro il Conte. Lui in porta. Ho segnato. Era il 1990. Gliel'ho sempre detto che si era buttato apposta. Lui rideva."); done(); },
      oc_cosimo() { if (K.rel.scene("oc_cosimo")) return; say("oc_cosimo", F.is("oc_gemelli_pace") ? "[ride] Damiano dice che stavolta tira basso. Io gli dico che basta tirare." : "Ultima tirata. Ultima occasione di non parlarsi per un'altra settimana."); done(); },
      oc_damiano() { if (K.rel.scene("oc_damiano")) return; say("oc_damiano", F.is("oc_gemelli_pace") ? "[pensa] Mio fratello ha detto che se vinco io mi lascia la stanza col balcone. Se vince lui, me la lascia lo stesso. È strano, essere fratelli." : "Undici caselle. Undici metri. Undici e venti."); done(); },
      oc_teo() { if (K.rel.scene("oc_teo")) return; say("oc_teo", segreto() ? "[ride] Sette dadi in tasca, eh? Pesano. Li porti alla 63. Vedrà che effetto fanno." : [`[pensa] Dadi d'avorio: ne hai ${H.dadi()}. Il settimo il Conte lo teneva nel cassetto della scrivania. Diceva che era il dado del finale.`, "[serio] Il Conte guardava le partite dalla finestra dello studio. Diceva che dall'alto si capisce chi bara. Dal basso si capisce chi soffre."][Math.floor(Math.random() * 2)]); done(); }
    };

    const studioDesk = (o, K2) => {
      if (S() !== 0) return K2.say([["voce", "La scrivania del Conte. Il calendario è fermo al 14 marzo. Qualcuno l'ha rimesso a posto dopo che l'hai toccato: lo stesso foglio, la stessa data."]], K2.done);
      K2.learnLore("l_oc_studio"); if (!K2.inv.has("oc_busta")) K2.inv.give("oc_busta");
      K2.say([["voce", "Sulla scrivania, in mezzo, la Busta 63: ceralacca rossa con un'oca stampata sopra. «Da aprire alla casella 63. Non prima. Ti vedo, Arrigo.» La metti nello Zaino (📨)."], ["voce", "Accanto, un biglietto per te, scritto più piccolo: «Al giocatore neutrale. Se è arrivato fin qui ha visto la cappella. Io non so cosa ha fatto di quello che ha trovato. Spero bene. Se no, pazienza: il gioco dell'oca è fatto anche per perdere.»"]], () => {
        setStep(N, 1); quest("oc_c4b", "L'ultima tirata", "Gilda ti aspetta al tabellone. Dalla 52 alla 63, con tutti."); K2.done();
      });
    };

    const zones = {
      oc_parco: Z.parco(H, (s) => {
        const L = [{ id: "oc_gilda", at: [22, 16] }];
        if (s <= 1) { L.push({ id: "oc_ernestina", at: [15, 7] }); L.push({ id: "oc_arrigo", at: [24, 8] }); L.push({ id: "oc_ofelia", at: [20, 20] }); L.push({ id: "oc_tonio", at: [27, 17] }); L.push({ id: "oc_cosimo", at: [17, 12] }); L.push({ id: "oc_damiano", at: [27, 12] }); L.push({ id: "oc_teo", at: [33, 28] }); }
        return L;
      }, {
        region: "alba", time: "alba", bg: "oc_parco_alba", itemCos: "oc_c4", items: [[1, 5], [42, 8], [10, 17], [31, 30]],
        extra: [[17, 5, "q"]], doors: { "17,5": { to: "oc_studio", at: [6, 7] } },
        cappella: { to: "oc_cappella4", at: [7, 9] },
        intro: [["voce", "Mattina del quarto giorno. Il parco è lavato dalla rugiada, le oche sono tutte sul tabellone come se aspettassero anche loro. Sulla facciata della villa, la porta piccola dello studio è socchiusa."]]
      }),
      oc_studio: {
        interior: true, region: "interno", name: "Lo studio del Conte", short: "Studio", sub: "Una scrivania, un tabellone in miniatura e un calendario fermo", bg: "oc_studio", w: 12, h: 9, start: [6, 7], outside: ["oc_parco", 17, 6], base: "A",
        act: { T: "Guarda la scrivania", U: "Guarda il tabellone in miniatura", L: "Guarda la libreria", Q: "Guarda il ritratto", x: "Apri il cassetto", W: "Guarda dalla finestra" },
        flavor: { U: "Un tabellone del gioco dell'oca in miniatura, con sette pedine. Sei hanno i nomi degli eredi su un'etichetta. La settima, bianca, dice solo «il neutrale». È già sulla 52.", L: "Annuari della Rondinese dal 1960 al 2025. Manca solo il 1972-73. Al suo posto, un libro di ricette: «Il ragù di Lucia».", Q: "Un ritratto a carboncino di una bambina con un mestolo più grande di lei. Firmato «U.P. 1979».", W: "Dalla finestra dello studio si vede tutto il tabellone. Il Conte diceva che dall'alto si capisce chi bara." },
        loot: { "10,6": { id: "oc_dado", text: "Nel cassetto della scrivania piccola, sopra una pila di schedine del Totocalcio mai giocate: un dado d'avorio. Il settimo. Il «dado del finale».", empty: "Solo schedine. Tutte con «1» sulla Rondinese." } },
        objects: { "5,2": studioDesk, "6,2": studioDesk },
        npcs: () => [],
        build(L) { const { lay, put } = L; lay(0, 0, 11, 8, "A"); lay(0, 0, 11, 0, "a"); lay(0, 0, 0, 8, "a"); lay(11, 0, 11, 8, "a"); lay(0, 8, 11, 8, "a"); put(6, 8, "v"); put(3, 0, "W"); put(8, 0, "W"); put(6, 0, "Q"); lay(5, 2, 6, 2, "T"); put(2, 5, "U"); put(1, 2, "L"); put(1, 3, "L"); put(10, 6, "x"); lay(4, 7, 4, 7, '"'); put(10, 2, "J"); },
        decor(g, cx, cy, d) { H.plaque(g, "14 MARZO", d.X(6) + 8, d.Y(1) + 4, "#f87171"); const f = window.__sagaCore.util.frNow(); g.fillStyle = `rgba(253,230,138,${0.06 + 0.03 * Math.sin(f / 25)})`; g.fillRect(d.X(2), d.Y(1), d.X(9) - d.X(2), d.Y(6) - d.Y(1)); }
      },
      oc_cappella4: {
        interior: true, region: "cappella", name: "La cappella di famiglia", short: "Cappella", sub: "Di giorno è solo una cappella", bg: "oc_cappella", w: 14, h: 11, start: [7, 9], outside: ["oc_parco", 35, 27], base: "A",
        act: { O: "Guarda l'altare", Q: "Guarda il ritratto", Z: "Guarda la parete", I: "Guarda l'inferriata" },
        flavor: { O: "L'altare è vuoto. Qualcuno ci ha lasciato un mazzo di rosmarino.", Q: "Il ritratto del Conte giovane. Di giorno sembra quasi sorridere.", Z: "Le tacche. Mille e novantasei. Alla luce del giorno sono più piccole di come le ricordavi.", I: "L'inferriata. La porticina è aperta, e il nastro rosso è sparito.", b: "Le panche. «U. + L.»", l: "Le candele sono spente. Per la prima volta." },
        npcs: () => [],
        build(L) { const { lay, put } = L; lay(0, 0, 13, 10, "A"); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 10, "a"); lay(13, 0, 13, 10, "a"); lay(0, 10, 13, 10, "a"); put(7, 10, "v"); put(6, 1, "O"); put(7, 1, "O"); put(3, 1, "Q"); put(5, 1, "l"); put(8, 1, "l"); lay(2, 4, 5, 4, "b"); lay(2, 6, 5, 6, "b"); put(9, 5, "I"); put(10, 5, "I"); put(12, 5, "I"); put(9, 6, "I"); put(9, 8, "I"); lay(13, 6, 13, 8, "Z"); put(12, 9, "l"); }
      },
      oc_cucina: Z.cucina(H, () => [], {}),
      oc_salone: Z.salone(H, () => [], {}),
      oc_serra: Z.serra(H, () => [], {}),
      oc_capanno: Z.capanno(H, () => [], {})
    };
    return {
      n: N, title: "Le Ultime Undici", sub: "La Busta 63, la Morte alla 58 e a chi va la villa",
      goal, start: "oc_parco", introBg: "oc_parco_alba", zones, talk, obj: {},
      intro: [["voce", "Ultimo giorno a Villa Pastrocchi. Undici caselle tra gli eredi e la villa. Gilda ha messo il cappello buono. Arrigo si è fatto la barba due volte."], ["voce", "Le oche, che di solito a quest'ora sono al ruscello, sono tutte sul tabellone. Teresa, la capa, si è piazzata sulla 63 e non si sposta."]]
    };
  }
  boot();
})();
