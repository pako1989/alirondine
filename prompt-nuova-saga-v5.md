# Prompt per nuova saga · Ali di Rondine (versione 5: partite a tema, carte dei Sogni, acconciature, stili dei volti)

Copia da qui sotto. Funziona con Claude e con altre intelligenze artificiali che possono leggere e modificare la repo.

---

Lavori sulla repo `pako1989/alirondine`: una PWA di calcio in stile JRPG, in JavaScript statico in `js/`, branch `main`, sito https://pako1989.github.io/alirondine/. Sono Pasquale e parlo italiano. Rispondimi sempre in italiano, in modo breve e chiaro.

## 0 · Regole fisse (valgono sempre)
- Saga di **3-4 capitoli** nel mondo camminabile, con storia profonda e **scelte che cambiano i finali**. I finali dipendono dalle scelte e almeno uno è segreto.
- **Niente persone reali, niente temi su minori in pericolo o sanitari.** Ispirarsi a opere esistenti va bene (anime, manga, JRPG, serie, film, libri, supereroi), ma nomi, personaggi e trame devono essere **inventati**.
- **Ricompense: solo monete e cosmetici.** Mai bonus che cambiano le statistiche delle partite base. Ogni saga aggiunge anche:
  - un **cabinato in Sala Giochi** (`MACHINES` in `js/salone.js`), per giocare il suo motore nuovo fuori dalla storia;
  - le **carte della Squadra dei Sogni** (`js/sogni.js`);
  - un'**acconciatura da sbloccare** (`HAIR_SAGA` in `js/game.js`);
  - un **ospite al Borgo** (`cfg.guest`).
  - I finali entrano da soli nella **Cineteca**.
- **Menu:** solo in Modalità → gruppo «Saghe e GDR». Aggiungi il titolo alla regex del gruppo in `js/game.js` (cerca `"Saghe e GDR"`) e una scheda nel Salone delle Saghe (`js/salone.js`: `SAGAS`, `NEWEST` e il prefisso in `PFX`). Non va in home, nella barra in alto o in Storia.
- **Salvataggio proprio:** `ali-di-rondine.<nome>`. Non toccare i salvataggi esistenti.
- **Non cambiare le modalità esistenti.** Non chiedermi conferme per cose piccole: scegli un default e dimmelo.
- **Tono:** alcune saghe sono serie, altre comiche (ironia stile «Borgo Marino»). Dichiaralo nella proposta.
- **Ogni saga deve portare novità:** almeno una **novità di gioco nelle zone**, una **modalità di partita originale** e un **miglioramento grafico**. Niente copia-incolla dalle saghe precedenti. Se la novità serve anche alle saghe future, mettila nel motore comune (`js/saga-core.js`), senza rompere le saghe che lo usano.
- **La partita originale deve essere un MOTORE NUOVO**, con regole e comandi davvero diversi, in un file suo (`js/<motore>.js`, sovrapposizione DOM a tutto schermo). **Non** basta rivestire il kit `__sagaCore.pitch` con un'altra grafica, e non si riusa un motore di un'altra saga come «nuovo». Motori già fatti, da NON ripetere:
  - Vignette (manga di lato, ad azioni);
  - ATB (JRPG a turni con magie);
  - Super-Bottoni (calcio a bottoni con la fionda e superpoteri);
  - Nastro (rewind del tempo);
  - Luci (lampioni e ombre);
  - Concilio (carte e voti al tavolo);
  - Duello Cinematico (vignette manga con grinta e tiri speciali);
  - Lavagna Tattica (modulo, caselle e istruzioni sasso-carta-forbice).
  - Ombre e Gadget (a turni, di notte, i difensori annunciano le caselle, cintura di gadget);
  - Calcio Tattico Isometrico (campo a rombi con dislivelli, iniziativa, contrasti alle spalle);
  - Volo a Tutto Campo (si disegna la traiettoria del volo a tempo fermo);
  - Combo di Squadra (coppie di eroi, poteri che si combinano);
  - Consegna a Rete (razzetto guidato col dito, il pallone è un pacco, i pianeti curvano i lanci);
  - Ciak! Si Gioca (la partita è un set cinematografico a scene con copione, ciak e voto del regista);
  - Ritagli (stop-motion di carta a scatti a 12 fps, carica a molla e contrasti a forbice);
  - Stangata (duelli western di rigori a mezzogiorno col tamburo a 6 colpi del revolver e quick-draw);
  - Arrembaggio sul Ponte (calcio d'azione sul ponte oscillante del galeone pirata tra onde e beccheggio).
- **Accessori sui personaggi:** in `K.cast(id, { acc: [...] })` metti oggetti addosso dove hanno senso per la storia (uno o più, non a tutti). Valori disponibili, tra gli altri (funzionano in tutti gli stili dei volti, anche Flat, 2D HD e Toon Head): `occhiali`, `cappellino`, `berretto`, `bandana`, `fascia`, `sciarpa`, `fischietto`, `grembiule`, `casco`, `visiera`, `chiave`, `cuffie`, `fiore`, `guanti`, `paglia`, `lente`, `taccuino`, `medaglia`, `corona`, `borsa`. Senza `acc`, il gioco li sceglie dalla descrizione; `acc: ""` = nessuno.
- **Personaggi non umani:** `K.cast(id, { shape: "robot" | "tostapane" | "blob" | "nuvola" | "fiamma" | "rovo" | "gatto" | "ombra", ... })` cambia sia il ritratto sia il personaggio che cammina (i colori vengono da `skin`, `shirt`, `eye`, `hair`). Se serve una sagoma nuova, aggiungila in `SHAPE_PORTRAIT` e `SHAPE_CHIBI` in `js/game.js`.
- **Acconciature (`style`):**
  - classiche: `slick`, `buzz`, `messy`, `long`, `bun`, `spiky`, `codino`, `cresta`, `bob`, `ponytail`, `twintails`, `braids`, `bald`, `curly`, `side`, `ordinato`, `bandana`, `hood`, `elmo`;
  - nuove (per i PNG si usano liberamente; per il Campione si sbloccano con le saghe): `afro`, `dread`, `undercut`, `pompadour`, `mullet`, `wavy`, `messybun`, `topknot`, `sidebraid`, `spacebuns`.
  - Se aggiungi un'acconciatura nuova, va disegnata in tutti gli stili dei volti (`portrait0`, figurina chibi, figura gx, e `hairOver` per gli stili di `portrait-styles*.js`) e sbloccata dalla saga con una voce `hs_<nome>` in `COSM` e in `HAIR_SAGA`.
- **Espressioni nei dialoghi:** una battuta può iniziare con `[felice]`, `[ride]`, `[triste]`, `[arrabbiato]`, `[sorpreso]`, `[furbo]` o `[pensa]` (il tag non si vede). Anche una didascalia iniziale tra parentesi, come «(ride)» o «(sospira)», cambia la faccia. Usale nelle battute importanti: la bocca si muove da sola mentre il personaggio parla.

## 1 · Prima di scrivere codice: studia e proponi
1. Leggi il **motore comune** `js/saga-core.js` (intestazione e funzione `create`) e le saghe costruite sopra.
2. Leggi `js/bg-scenarios.js`, cioè gli sfondi di scena animati con punti da toccare (blocco `LB`).
3. Poi **proponimi 3 idee** diverse tra loro per genere, grafica e gioco, senza scrivere codice. Per ognuna indica:
   - titolo, ambientazione, ispirazione e tono (serio o comico);
   - protagonista: il mio Campione creato;
   - 4-5 personaggi;
   - 2 colpi di scena, senza spoiler: solo il tipo;
   - la **partita originale**;
   - la **novità per il motore**;
   - la **novità grafica**;
   - quali partite forzi e perché;
   - come cambiano **grafica e gioco** delle partite secondarie nello stadio della saga (`cfg.stadium`).

   Io scelgo.

## 2 · Come si costruisce una saga sul motore comune
Struttura dei file: `js/<nome>.js` (configurazione) + `js/<nome>-c1.js` … `-c4.js` (un file per capitolo) + `js/<nome>-partita.js` (la partita originale, se serve).

## 3 · Gioco e grafica
- **Partite contestualizzate:** la storia decide la modalità. Le partite importanti usano il **motore nuovo** della saga, forzato; quelle secondarie fanno scegliere tra il motore nuovo e le altre modalità.
- **Interni:** alterna case solo da descrivere a case in cui si entra, con personaggi e missioni.
- **Grafica:** tessere 16×16 disegnate a mano per ogni ambiente, palette coerente, ritratti con colori credibili. Per ogni luogo uno **sfondo animato in `bg-scenarios.js`** con almeno 3 punti da toccare, ognuno con una frase o un'azione.
- **Musica:** un tema per la saga (`music`/`musicBg`).
- **Ospiti:** un cameo nella saga da un'altra saga (`cameos`).
- **Salone e Album:** nella scheda di `js/salone.js` il genere `g` deve usare le chiavi di `GEN`, con prefisso in `PFX`.
- **Sala Giochi:** aggiungi il cabinato del tuo motore in `MACHINES` (`js/salone.js`).
- **Squadra dei Sogni** (`js/sogni.js`): aggiungi saga in `SAGHE`, 4 carte in `CARDS`, 1-2 legami in `LINKS`.
- **Stili dei volti:** compatibilità con tutti gli stili (Flat e 2D HD prioritari).

## 4 · Errori già fatti da evitare / Controlli che hanno già fallito
1. Ogni dialogo e ogni pulsante finisce con `done()`, con un altro dialogo o con una partita. Mai `fn: () => {}`.
2. Oggetti da raccogliere, personaggi e uscite devono stare su tessere raggiungibili a piedi: niente acqua, tribune o case. Il test `reachAll` lo controlla.
3. Negli sfondi l'aiutante è `px(g, x, y, w, h, colore)`: senza `g` l'intero sfondo va in errore. Disegna ogni sfondo in un test e guarda la console.
4. Ogni chiave di sfondo usata (`bg: "..."`) deve esistere in `LB`, altrimenti il riquadro resta vuoto.
5. Una mappa d'epoca (`eras`) che rifà il campo può coprire tessere speciali: rimettile dopo.
6. Non usare nomi che non esistono: niente `window.TW` e niente `api.trLeave`. La zona attuale si legge con `K.api.trZone()`.
7. I salvataggi di prova nei test usano la chiave vera della saga.
8. Nei test premi anche le opzioni secondarie, non solo la prima.
9. Lettere di mappa: usa lettere non già prese dal motore, controllando `paint` e `solid` nelle saghe esistenti.
10. Negli sfondi leggi lo stato della saga con `window.__<nome>.info()`, mai con `_dbg` (in produzione non c'è).
11. Una porta che si apre con `house(..., { enter })` ha bisogno di `act: { q: "Entra" }` nella configurazione.
12. Nel canvas del motore di partita metti `height: auto; flex: none` (il CSS globale `canvas { height: 100% }` lo deforma).
13. Le due squadre devono avere colori ben diversi anche se il Campione ha la maglia del colore avversario.
14. Se un passaggio dipende da una forma o da un potere (`pass`), impedisci di tornare normali sopra le tessere attraversate (l'eroe resterebbe incastrato).
15. La tessera `+` per i campi da calcio viene grigia: per l'erba usa una tessera di prato o `:`.
16. Se scrivi file con la shell, non usare un heredoc senza virgolette: `${...}` dei template JavaScript verrebbe sostituito dalla shell. Usa `<<'EOF'` o uno script Python.
17. Nei test, una schermata che compare dopo una scena (classifica, mercato, risultato) va aspettata: premi «Continua» finché non appare, non darla per già aperta.
18. Le etichette dei nomi nei motori di partita non devono coprire le teste: controllalo negli screenshot a 320 px.
19. Lo stesso motore non deve far segnare troppi gol: prova qualche partita intera e tieni i risultati realistici.

### Novità del prompt «nuova saga»
- **Oggetti raggiungibili:** items, oggetti e PNG di ogni zona raggiungibili a piedi; start mai su tile solido; items = [colonna,riga] su tile libero. Test: `L.reachAll(page, zid)` vuoto.
- **Punti cliccabili visibili:** ogni scena con 3-4 punti (scintille + didascalia) in `window.__lbBg.LB` (esempio `gl_titolo`). Niente toast invisibili.
- **Niente API inventate:** solo funzioni vere del kit `K`. `K.teleport` non esiste: intro capitolo = `[["voce","testo"]]` + `start:"id_zona"`.
- **Zero errori in console:** gioca Inizia la storia → difficoltà → Continua prima di ogni push.
- **Pulsanti presenti su ogni schermata** (Continua, scelte).
- **Risparmio token:** test via script con output breve (✓/✗); screenshot solo di intro, menu e 1-2 zone per saga.
