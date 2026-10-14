# Ali di Rondine · Prompt unico (nuova chat o nuova saga) · versione 6, ottobre 2026

Un solo file: contiene regole, stato del progetto, come costruire una saga, API del kit, test e checklist. Copialo in una chat nuova (Claude Code o un'altra IA che può leggere e modificare la repo, anche con un altro account).

**Come usarlo:** se Pasquale chiede di riprendere i lavori, leggi §A e §B e controlla `git log` e `ls js/`. Se chiede una saga nuova, leggi tutto e parti dal §1.

---

## A · Contesto e regole di pubblicazione
- Repo `pako1989/alirondine`: PWA di calcio in stile JRPG, JavaScript statico in `js/`, branch `main`, sito https://pako1989.github.io/alirondine/. Se l'ambiente ti assegna un branch di lavoro, pubblica anche lì.
- **Pasquale e altre IA pubblicano in parallelo:** prima di ogni push `git pull --rebase origin main`, modifica solo i file che hai toccato tu.
- Sono Pasquale. Rispondimi **sempre in italiano**, breve e chiaro. Non chiedermi conferme per cose piccole: scegli un default e dimmelo.
- Dopo ogni pubblicazione mandami una nota breve: cosa hai finito e cosa aggiunge (senza spoiler della trama).


## 0 · Regole fisse (valgono sempre)
- Saga di **3-4 capitoli** nel mondo camminabile, con storia profonda e **scelte che cambiano i finali**. I finali dipendono dalle scelte e almeno uno è segreto.
- **Persone reali:** sono ammessi riferimenti, omaggi e parodie affettuose di personaggi PUBBLICI (calciatori, allenatori, artisti, personaggi dello spettacolo e della storia), come strizzate d'occhio, battute o cameo: tono rispettoso o ironico bonario, mai offensivo, diffamatorio, sessuale, politico di parte o su fatti di cronaca/salute/lutti. Preferisci nomi trasformati ma riconoscibili (es. soprannome o gioco di parole) piuttosto che il nome completo. **Mai** persone private (amici, parenti, colleghi) senza che Pasquale le citi lui stesso e ne fissi i limiti. Chi è vivo non ha ruolo da protagonista né da cattivo.
- **Personaggi di opere esistenti ammessi** (anche con il loro nome originale, come ospiti, cameo, rivali o compagni), per uso personale di Pasquale. Si disegnano con i ritratti del gioco (`K.cast`), scegliendo colori, acconciatura (`style`), accessori (`acc`), `shape` e tratti in modo che **assomiglino all'originale** (capelli, colori, costume, segni distintivi), battute scritte da noi; mai copiare immagini, musiche o dialoghi veri dell'opera. Non vanno usati in modo offensivo né in contenuti sessuali o su minori.
- **Niente temi su minori in pericolo o sanitari.** Ispirarsi a opere esistenti va bene (anime, manga, JRPG, serie, film, libri, supereroi), ma personaggi, città, simboli e trame possono essere **molto vicini all'originale** (omaggio o parodia riconoscibile, uso personale di Pasquale): nomi e testi scritti da te, ritratti e grafica disegnati dal codice, **mai** copiare immagini, musiche o dialoghi dell'opera. Devono comunque essere diversi dalle saghe già nel gioco.
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
  - Consegna a Rete (razzetto guidato col dito, il pallone è un pacco, i pianeti curvano i lanci).
- **Accessori sui personaggi:** in `K.cast(id, { acc: [...] })` metti oggetti addosso dove hanno senso per la storia (uno o più, non a tutti). Valori disponibili, tra gli altri (funzionano in tutti gli stili dei volti, anche Flat, 2D HD e Toon Head): `occhiali`, `cappellino`, `berretto`, `bandana`, `fascia`, `sciarpa`, `fischietto`, `grembiule`, `casco`, `visiera`, `chiave`, `cuffie`, `fiore`, `guanti`, `paglia`, `lente`, `taccuino`, `medaglia`, `corona`, `borsa`. Senza `acc`, il gioco li sceglie dalla descrizione; `acc: ""` = nessuno.
- **Personaggi non umani:** `K.cast(id, { shape: "robot" | "tostapane" | "blob" | "nuvola" | "fiamma" | "rovo" | "gatto" | "ombra", ... })` cambia sia il ritratto sia il personaggio che cammina (i colori vengono da `skin`, `shirt`, `eye`, `hair`). Se serve una sagoma nuova, aggiungila in `SHAPE_PORTRAIT` e `SHAPE_CHIBI` in `js/game.js`.
- **Acconciature (`style`):**
  - classiche: `slick`, `buzz`, `messy`, `long`, `bun`, `spiky`, `codino`, `cresta`, `bob`, `ponytail`, `twintails`, `braids`, `bald`, `curly`, `side`, `ordinato`, `bandana`, `hood`, `elmo`;
  - nuove (per i PNG si usano liberamente; per il Campione si sbloccano con le saghe): `afro`, `dread`, `undercut`, `pompadour`, `mullet`, `wavy`, `messybun`, `topknot`, `sidebraid`, `spacebuns`.
  - Se aggiungi un'acconciatura nuova, va disegnata in tutti gli stili dei volti (`portrait0`, figurina chibi, figura gx, e `hairOver` per gli stili di `portrait-styles*.js`) e sbloccata dalla saga con una voce `hs_<nome>` in `COSM` e in `HAIR_SAGA`.
- **Espressioni nei dialoghi:** una battuta può iniziare con `[felice]`, `[ride]`, `[triste]`, `[arrabbiato]`, `[sorpreso]`, `[furbo]` o `[pensa]` (il tag non si vede). Anche una didascalia iniziale tra parentesi, come «(ride)» o «(sospira)», cambia la faccia. Usale nelle battute importanti: la bocca si muove da sola mentre il personaggio parla.

## Temi preferiti da Pasquale (guida per scegliere le idee)
- **Generi:** JRPG alla Suikoden (gruppo che cresce, reclutamento, scelte che pesano), supereroi, calcio anime stile Captain Tsubasa, giallo/indagine, avventura corsara o western, fantascienza comica.
- **Tono:** ironia di base con episodi seri e strappalacrime, e colpi di scena maturi. Più di una chiave: comica, amara, epica. Nessuno spoiler nella presentazione.
- **Meccaniche che gli piacciono:** scelte con conseguenze e più finali (uno segreto), minigiochi e motori di partita davvero diversi, collezionismo (carte, ricette, figurine, taccuini), modalità con contesto e storia, vittorie come meta.
- **Calcio:** ama eFootball e FC: rosa, mercato, tattiche, carte, squadre di sogno. Le partite devono avere regole e atmosfera della saga.
- **Idee da esplorare (se ne propongono 3, almeno una da qui):** parodia di talent show, serie TV medica **no**; mockumentary sul calcio di provincia; heist con colpo in stadio; supereroi di quartiere e mentori ex-campioni; viaggio nel tempo tra epoche del calcio; scuola di calcio magica; sopravvivenza in isola; torneo di mondi paralleli; calcio nella Roma antica/medioevo comico; spionaggio anni '60 con tattiche segrete; fantasy con draghi e arbitri; musical; tornei tra bar di paese.
- **Da evitare:** carriera da allenatore, Jukebox, imprevisti casuali, temi medici o di minori in pericolo, copiare saghe già nel gioco.

## 1 · Prima di scrivere codice: studia e proponi
1. Leggi il **motore comune** `js/saga-core.js` (intestazione e funzione `create`) e le saghe costruite sopra:
   - «La Valle del Vento Gentile»: `js/vento.js`, `vento-c1..c3.js`, partita `vento-partita.js`. Ha il vento, gli interni e la casa che cammina.
   - «Detective di Campo»: `js/detective.js`, `detective-c1..c3.js`, `moviola.js`. Ha prove, presentazioni e pedinamento.
   - «Dopo il Campione»: `js/dopo.js`, `dopo-c1..c3.js`, `epoche.js`. Ha le epoche delle zone, i filtri d'epoca e gli echi.
   - «Calcio Spaziale»: `js/spazio.js`, `spazio-c1..c3.js`. Ha le zone a gravità zero e capovolta (`gravity`).
   - «Il Torneo delle Cento Scuole»: `js/torneo.js`, `torneo-c1..c3.js`, motore `vignette.js`. Ha i personaggi che camminano (`route`) e il tabellone.
   - «Le Cronache del Pallone di Cristallo»: `js/cronache.js`, `cronache-c1..c3.js`, motore `atb.js`. Ha il gruppo che segue in fila (`party`), la mappa del mondo e il mare navigabile.
   - «Il Mantello Granata»: `js/mantello.js`, `mantello-c1..c3.js`, motore `bottoni.js`. Ha le forme dell'eroe (`pass`, `heroFx`), le cabine per trasformarsi e la grafica a fumetto (didascalie, «POW!»).
   - «Il Trono di Cuoio»: `js/trono.js`, `trono-c1..c3.js`, motore `concilio.js`. Ha le casate, la credibilità e il voto (`K.voto`).
   - «Dal Campetto al Mondiale»: `js/campetto.js`, `campetto-c1..c3.js`, motore `duello.js`. Ha l'allenamento a tempo per imparare i tiri (`K.allena`).
   - «Master League delle Colline»: `js/colline.js`, `colline-c1..c3.js`, motore `lavagna.js`. Ha la rosa nei flag, il mercato, la classifica e gli allenamenti (`K.mercato`, `K.classifica`).

   Come spunti di storia e grafica guarda anche le saghe più vecchie: `ragnarok-story.js`, `chrono-story.js`, `bilancia-feudi.js`, `kronenburg-story.js`, `storia-campione.js` (Vallombra). Sono scritte senza motore comune: prendi le idee, non il codice.
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

**Configurazione** (`window.__sagaCore.create({...})` restituisce `{ api, K }`; poi `window.__<nome> = E.api`):
- Dati base: `id`, `key` (salvataggio), `title`, `icon`, `bg`, `chapters`, `menuSub`, `theme`.
- `stats`: `{ k: [min, max, iniziale, "etichetta"] }`, per esempio fiducia o legami.
- `regions`: palette per ambiente (`grass`, `path`, `stone`, `wall`, `water`, `tree`, `tint`, `fx`: `leaves`/`snow`/`dust`…, `dark`).
- `paint`: tessere disegnate a mano, lettera → `fn(K, sx, sy, tx, ty, fr)`. `solid` elenca le lettere che bloccano il passo.
- `endings`, `journal`, `rest`, `texts`, `item`/`drawItem` (collezionabile), `plugins` (`zone`, `enter`, `tick`, `top`, `hud`, `obj`), `travel`, `music`, `cameos`, `mood` (atmosfera sopra tutta la zona).
- `party: (K) => [id, ...]`: i compagni che seguono in fila il Campione in ogni zona (non bloccano il passo).
- `pass: (K, zona) => "lettere"`: le tessere solide che l'eroe può attraversare **adesso** (forme, poteri, veicoli).
- `heroFx: (K, zona) => ({ s, dy, cape, aura })`: l'aspetto dell'eroe in esplorazione (scala, sospeso in volo, mantello, aura).
- `heroLook`, `heroTitle`, `zoneMenuExtra`, `mainExtra`: aspetto, titolo e voci di menu proprie.
- `guest: { id, lines }`: il personaggio che passa a trovarti al Borgo Marino dopo il primo finale.
- `stadium: { azPitch, cageField, cageMut, weather, venue }`: i valori di partenza di **tutte** le `playMatch` della saga (vedi §2 · Partite).

**Capitolo:** `D.addChapter(K => ({ n, title, sub, goal, start, introBg, zones, talk, obj, patch, intro }))`, aspettando con `D._has(n-1)` che il capitolo precedente sia caricato.

**Zone** (`zones.<id>`):
- Dati base: `region`, `name`, `short`, `sub`, `bg`, `time`, `w`, `h`, `start`, `items`, `areas`, `act` (etichette azioni), `flavor` (frasi), `intro`.
- `npcs(step)`: restituisce la lista dei personaggi con la loro posizione. Un personaggio può camminare: `{ id, at, route: [[x, y], …], speed, pause }` (si ferma quando il Campione è vicino).
- `gravity`: `"zero"`, `"flip"`, `"zeroflip"` o una funzione, per zone senza gravità o capovolte.
- `caption` (se la saga lo usa): la didascalia d'ingresso.
- `build(L)` costruisce la mappa con `L.lay(x0, y0, x1, y1, ch)`, `L.put(x, y, ch)` e `L.house(x, y, w, h, { door, enter })`. Il campo `enter` può essere:
  - una frase, per una casa solo da descrivere;
  - `{ room: "casa|bottega|mulino|locanda|ufficio|spogliatoio", name, who, chest }`, per una stanza automatica con personaggi;
  - `{ to: "<zona interna>", at: [x, y] }`, per un interno fatto a mano (`interior: true`, `outside: [zona, x, y]`).
- Altri campi: `eras` (la stessa mappa in un altro tempo, con `filter`: `bn`, `seppia`, `anni70`, `pixel`), `decor`, `top`, `hud`, `tick`.

**Kit `K`:**
- Dialoghi e spostamenti: `say`, `ask`, `done`, `go`, `enterZone`, `scene`.
- Avanzamento della storia: `setStep`/`stepOf`, `finishChapter`.
- Memoria e statistiche: `F` (flag), `stat`, `bond`. **I flag sono solo valori semplici** (numeri, vero/falso, testi fino a 40 caratteri), al massimo 400 per saga: niente oggetti o liste. Per una rosa o un inventario usa più flag (es. `ml_in_<id>`).
- Missioni e indagini: `quest`/`questDone`, `evidence`/`giveClue`/`present`.
- Epoche: `setEra`/`eraOf`.
- Contenuti e ricompense: `cast` (ritratti), `cos` (cosmetici), `lore`/`learnLore`, `reward`, `end`.
- Partite: `playMatch` (partite del gioco), `ownMatch` (partita originale).
- Disegno: `light`, `later`, `ground`.
- **Tubi pneumatici:** `spec.tubes = [{ at: [x, y] stazione (tessera solida, con un'etichetta in `act`), path: [[x, y], …], out: [x, y], when(K), shut, arrive(K) }]`. L'eroe vola in una capsula di vetro anche sopra acqua e case. Nei test: `K.tubeBusy()`.
- **Furtivo (guardie):** nelle `npcs` un personaggio con `guard: { range, cone, turn }` (più `route` o `face`) ha un cono di vista che si ferma sui muri. Se vede il Campione, lo riporta a `spec.sneakStart` e chiama `spec.onSeen(K, guardia)` (o mostra `texts.seen`). Le tessere in `spec.hide` nascondono; con `spec.buio` ti vedono solo da metà distanza fuori dalle luci. Nei test si spengono con `window.__noGuards = true` (e si prova una volta che funzionino).
- Si possono aggiungere funzioni proprie al kit nella configurazione della saga, come hanno fatto le ultime: `K.voto` (votazione), `K.allena` (minigioco a tempo), `K.mercato` e `K.classifica` (schermate di gestione). Ogni saga ne porta almeno una nuova.

**Partite:**
- `K.playMatch({ alt, oppNames, squad, venue, weather, azPitch, homeKit, mate, intro, done })`. Con un solo valore in `alt` la modalità è forzata.
- `K.ownMatch(startFn, o)` per la partita originale: `startFn(o)` è la funzione `start` del TUO motore. Il motore deve:
  - leggere difficoltà e carattere avversari da `window.__sagaCore.cur` (`opts`: `opp`, `steal`, `shot`, `gk0`, `gk1`; `style`: `equilibrata`/`pressing`/`difensiva`/`contropiede`);
  - avere una schermata di presentazione con le regole, comandi grandi per il telefono (tocco e trascinamento) e anche la tastiera;
  - chiamare `window.__sagaCore.endMatch()` e poi `o.onDone({ a, b, win, quit, data })` alla fine;
  - esporre `window.__<motore>.state` con `finish()` e lo stato, così i test possono chiudere la partita.
- **Stadio della saga (`cfg.stadium`)**: le partite secondarie devono sembrare **della saga**, non le partite normali:
  - `venue: { ads: [[testo, colore]], crowd, ground: [c1, c2], line, grid, tint, glow: "r,g,b", sky: [c1, c2], wall: [c1, c2], fx: { fr, spd, wind } }`.
    - Lo usano la partita a turni, Action Soccer HD (come tema: cielo, cartelloni, pubblico, prato) e La Gabbia (pavimento, muri, cielo, graffiti, scritta).
    - `fx` cambia **il gioco**: `fr` è l'attrito del pallone (neve, fango, ghiaccio), `spd` la velocità dei giocatori, `wind` il vento laterale.
  - `azPitch`: il campo del calcio d'azione 3v3 (`AZ_PIT` in `js/game.js`, tra cui `cortile`, `fondale`, `dojo`, `lizza`, `neon`, `lago`). Se ne aggiungi uno, disegnalo in `azBg15`.
  - `cageField` (0-3) e `cageMut`: le regole della Gabbia (`wet`, `rubber`, `narrow`, `wide`, `heavy`, `turbo`).
  - `weather`: pioggia, neve…
  - Ogni `playMatch` può comunque sovrascrivere questi valori.
- Il kit `window.__sagaCore.pitch({ ..., hooks })` resta per le partite secondarie a tema (hook: `setup`, `tick`, `speed`, `ballForce`, `act`, `ai`, `keeper`, `onGoal`, `second`, `bg`, `field`, `over`, `post`, `hud`, `result`). Ha già tiro caricato, a giro e pallonetto, dai e vai, controllo del compagno e contrasto.
- La difficoltà (Storia, Normale, Sfida) si sceglie al primo avvio della saga: non serve rifarla.
- La fine passa sempre da `done(r)` con `r.win`.

## 3 · Gioco e grafica
- **Partite contestualizzate:** la storia decide la modalità. Le partite importanti usano il **motore nuovo** della saga, forzato; quelle secondarie fanno scegliere tra il motore nuovo e le altre modalità (`ask` con due opzioni: `ownMatch` oppure `playMatch({ alt: "az,cage,hd", force: false })`). Duello serrato = calcio d'azione 3v3; scontro epico = 2D HD; momento riflessivo = a turni; tema duro = La Gabbia. Le partite importanti hanno la modalità **forzata**, quelle secondarie la fanno scegliere.
- **Una modalità di partita originale** legata alla storia, giocabile da telefono, con vittoria e sconfitta gestite.
- **Interni:** alterna case solo da descrivere a case in cui si entra, con personaggi e missioni.
- **Grafica:** tessere 16×16 disegnate a mano per ogni ambiente, palette coerente, ritratti con colori credibili. Per ogni luogo uno **sfondo animato in `bg-scenarios.js`** con almeno 3 punti da toccare, ognuno con una frase o un'azione (funzione prima di `const LB = {`, voce dentro `LB`; aiutanti `px(g, …)`, `circ`, `vgrad`, `glowB`, `since`).
- **Musica:** un tema per la saga (`music`/`musicBg`).
- **Ospiti:** un cameo nella saga da un'altra saga (`cameos`).
- **Salone e Album:** nella scheda di `js/salone.js` il genere `g` deve usare le chiavi di `GEN` (`fantasy`, `mistero`, `scifi`, `storico`, `commedia`, `sport`, `avventura`, `dramma`, `tattica`), altrimenti il Salone va in errore. Aggiungi il prefisso dei personaggi in `PFX` (es. `mantello: "mg"`), così compaiono nell'Album dei personaggi.
- **Sala Giochi:** aggiungi il cabinato del tuo motore in `MACHINES` (`js/salone.js`): `{ id, t, e, saga, eng, d, opp: [...], boss, cup }`. Si apre quando la saga ha un finale. Aggiorna l'elenco dei cabinati atteso in `tests/sala.cjs`.
- **Squadra dei Sogni** (`js/sogni.js`):
  - aggiungi la saga in `SAGHE` (`[chiave, nome, colore]`);
  - aggiungi 4 carte in `CARDS`: `[id personaggio, saga, rarità c/r/e/l, attacco, difesa, tecnica, ruolo A/C/D]`, con una comune, una rara, una epica o leggendaria;
  - aggiungi 1-2 legami con personaggi di altre saghe in `LINKS` (`[id1, id2, "nome del legame"]`).
- **Stili dei volti:** i ritratti devono funzionare in tutti gli stili scelti dal giocatore (classico, Flat, 2D HD, anime, pixel, manga, acquerello, Toon Head). Flat e 2D HD sono i preferiti: controlla lì accessori, forme e acconciature.

## 4 · Errori già fatti da evitare
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
20. **API inventate:** usa solo funzioni che esistono davvero nel kit `K` (cerca `const K =` in `js/saga-core.js`). `K.teleport` NON esiste. L'`intro` di un capitolo restituisce righe `[["voce","testo"]]` e il capitolo ha `start: "id_zona"`: è il motore a portarti lì.
21. **Errori a livello di modulo:** una variabile fuori scope in `bg-scenarios.js` (es. `W` dentro un array `hot` fuori dalla funzione di disegno) ferma il caricamento e svuota TUTTE le scene del gioco. Dopo ogni modifica agli sfondi: apri l'app, zero errori in console al caricamento.
22. **Punti cliccabili visibili:** ogni sfondo-scena (titolo, menu della saga, capitoli) ha 3-4 punti con scintille e didascalia, registrati in `LB` (o `window.__lbBg.LB`, esempio `gl_titolo`). Niente vecchi `toast` nel gestore click: restano invisibili.
23. **Dialoghi muti:** gli errori dentro i dialoghi dei PNG sono inghiottiti da `safe()`. Il test deve parlare con OGNI PNG (anche quelli con `K.alibi`, `K.ask`, ricompense) e proseguire fino al pulsante successivo, ascoltando `pageerror`. Dopo l'ultima battuta deve comparire un pulsante o una scheda.
24. **Oggetti raggiungibili:** `items` è `[colonna, riga]` su un tile libero, mai dentro edifici o muri; `start` mai su un tile solido. `L.reachAll(page, zid)` deve tornare vuoto su OGNI zona (non solo il BFS delle porte).
25. **`saga-core.js` è usato da ~30 saghe:** modificalo solo se la novità serve a più saghe, con una patch piccola e retrocompatibile (le saghe esistenti devono comportarsi come prima), poi rilancia `node tests/run.cjs saghe-vecchie` e 2-3 saghe a campione. Se la novità serve solo alla tua saga, resta nel file della tua saga.
26. **Percorso reale del giocatore:** dopo il push rifai, sul sito aggiornato, il percorso da nuova partita (Inizia la storia → difficoltà → Continua → primo PNG), non solo il salvataggio di prova.
27. **Risparmio token:** test via script con output breve (✓/✗ o poche righe); pochi screenshot (intro, menu, 1-2 zone per saga), non uno per zona; non giocare a mano i capitoli se uno script li attraversa.

## 4b · Evitare regressioni (obbligatorio a ogni push)
- `git pull --rebase origin main` prima di iniziare e prima di ogni commit. Lavora sempre sull'ultima versione dei file: mai rimettere una copia vecchia, mai riscrivere un file intero.
- Modifiche ai file condivisi (`game.js`, `bg-scenarios.js`, `salone.js`, `sogni.js`, `saga-core.js`, `index.html`, `sw.js`) solo con patch mirate. Prima di `git add`: `git diff` e controlla che non ci siano righe RIMOSSE che non hai scritto (altri thread correggono bug in quei file).
- `git add <file>` solo dei tuoi file, mai `git add -A`.
- Dopo il push: `git fetch && git diff origin/main` vuoto, e `grep` delle tue righe chiave nel file pubblicato.
- Bump `?v=` e cache `sw.js` DOPO il pull, leggendo il valore corrente.

## 5 · Test (non si consegna senza)
- Ogni saga ha `tests/<nome>.cjs` (aiuti in `tests/lib.cjs`: `setup`, `talk`, `goAct`, `advance`, `reachAll`, `info`, `shot`) e va aggiunta alla lista in `tests/run.cjs`. Devono continuare a passare anche `sala`, `sogni`, `volti` e `saghe-vecchie`.
- Gioca a piedi **tutti i capitoli e tutti i finali**, a **390 e 320 px** di larghezza, con **zero errori in console**. Le partite si chiudono dal test impostando il punteggio nello stato del motore e chiamando `finish()` (`window.__sagaCore.pitchState` per il kit, `window.__<motore>.state` per il motore nuovo). Prova anche **un comando vero** del motore (un tocco o un trascinamento) e controlla che cambi lo stato.
- Fai screenshot di ogni zona, di ogni sfondo e di ogni modalità di partita, e guardali: niente schermate vuote o grigie.
- Prova almeno una partita secondaria per modalità (a turni, 3v3, 2D HD, Gabbia) e guarda che lo stadio della saga si veda.
- Si lancia con `npm test` (tutta la suite dura circa 40 minuti). Gli stessi test girano su GitHub a ogni push su `main`: controlla che passino.

## 6 · Come lavori
- **Prima di pubblicare:** se la saga tocca solo i suoi file (più le liste in `salone.js`, `sogni.js`, `game.js`), bastano `node tests/run.cjs <saga>`, `sala`, `sogni` e `volti`. Se tocchi il motore comune o file condivisi, lancia anche la suite completa (`npm test`, circa 40 minuti, in background) e sistema subito eventuali errori. Concatena i comandi con `&&`, mai con `;`. Prima di ogni pubblicazione lancia `npm run bump`: aggiorna i `?v=` in `index.html` e la cache in `sw.js`.
- A ogni pubblicazione scrivimi una nota breve: cosa hai finito e cosa aggiunge.
- Se un'idea costa troppo, dimmelo prima.
- Alla fine di ogni capitolo controlla che non restino modifiche non pubblicate.

## 7 · API del kit `K` (cosa esiste davvero) e alternative
Il kit `K` è definito in `js/saga-core.js` (cerca `const K =`). **Usa solo ciò che c'è qui sotto.** Se ti serve qualcosa che non c'è, NON inventare il nome: scegli un'alternativa.

| Cosa ti serve | Funzione reale | Note |
|---|---|---|
| Dialogo | `K.say([[id,"testo"],…], then)` | `id` = personaggio o `"hero"`/`"voce"`; `then` chiamato alla fine |
| Scelta | `K.ask(domanda, [{label, fn}], opzioni)` | opzioni `{ secs, def }` per scelte a tempo |
| Chiudere un'interazione | `K.done()` | ogni dialogo/pulsante deve finire con `done`, un altro dialogo o una partita |
| Scena con sfondo | `K.scene(righe, then, bg)` | `bg` deve esistere in `LB` |
| Avanzare la storia | `K.setStep(n)`, `K.stepOf(cap)`, `K.finishChapter(...)` | |
| Memoria | `K.F.get/set` (flag semplici), `K.stat`, `K.bond` | solo numeri, vero/falso, testi ≤ 40 car., max 400 flag |
| Missioni | `K.quest("testo")`, `K.questDone()` | |
| Prove/indagini | `K.evidence`, `K.giveClue`, `K.hasClue`, `K.present` | |
| Spostarsi | `K.go(zona, x, y)`, `K.enterZone(zona)` | **`K.teleport` NON esiste** |
| Partite | `K.playMatch({...})`, `K.ownMatch(start, o)` | vedi §2 · Partite |
| Personaggi | `K.cast(id, {...}, bio)` | `acc`, `shape`, `style`, colori |
| Ricompense | `K.reward`, `K.coinsGive`, `K.cos(id, d)` | solo monete e cosmetici |
| Finali/lore | `K.end(id)`, `K.ending(id, d)`, `K.lore`, `K.learnLore` | |
| Altre saghe | `K.otherSaga(chiave)` | legge il salvataggio di un'altra saga |
| Epoche | `K.setEra`, `K.eraOf` | |
| Tubi/luce/disegno | `K.tubeRide`, `K.tubeBusy`, `K.light`, `K.later`, `K.ground`, `K.P`, `K.g` | |
| Tempo reale | `K.timedFire()` | solo test delle scelte a tempo |
| Suoni | `K.SFX`, `K.tone`, `K.noise` | |
| Stato | `K.mem()`, `K.save()`, `K.api.trZone()` | la zona attuale si legge con `K.api.trZone()` |

Funzioni di saghe singole (non sono del kit comune: non usarle in un'altra saga senza spostarle nel motore): `K.voto` (Trono), `K.allena` (Campetto), `K.mercato`/`K.classifica` (Colline), `K.alibi` (Campana).

**Se manca una funzione (alternative, in ordine):**
1. Componila con quelle del kit (per esempio un oggetto raccolto = `K.F.set` + `K.say`).
2. Aggiungila alla TUA saga nel file di configurazione (`K.<nome> = ...` come fa `K.alibi` in `campana.js`), con un nome nuovo e usandola solo lì.
3. Se serve a più saghe, aggiungila al motore comune (`saga-core.js`) con una patch piccola e retrocompatibile, poi rilancia `saghe-vecchie` e qualche saga a campione, e aggiorna questa tabella nello stesso commit.
Le funzioni dei **talk** ricevono `K` come parametro; l'`intro` di un capitolo restituisce righe `[["voce","testo"]]` e il capitolo ha `start: "id_zona"`.

## 8 · Ordine di lavoro (per ogni saga)
1. Proponi 3 idee, aspetta che Pasquale scelga.
2. **Scheletro prima di tutto:** configurazione, una zona, capitolo 1 giocabile da «Inizia la storia» a un PNG, un test che passa a zero errori. Poi gli altri capitoli e il motore di partita.
3. Un capitolo alla volta; a ogni capitolo: test, push, nota a Pasquale.
4. **Rilettura finale della propria saga:** cerca refusi, nomi sbagliati, spoiler nelle schede, battute fuori tono, personaggi che compaiono prima di essere presentati.
5. Un solo giro di screenshot alla fine (intro, menu difficoltà, 1-2 zone); durante il lavoro test via script con output breve.

## 9 · Checklist di fine saga (spunta ogni riga prima di dire «fatto»)
- [ ] Zero errori in console dal caricamento a fine capitolo 1 (e poi per tutti i capitoli).
- [ ] Percorso da nuova partita: Inizia la storia → difficoltà → Continua → primo PNG → ultima battuta → compare il pulsante/scheda successiva.
- [ ] Ogni PNG con `ask`/ricompense/funzioni proprie provato fino in fondo.
- [ ] `L.reachAll(page, zid)` vuoto su ogni zona; `start` non solido.
- [ ] Ogni sfondo-scena con 3-4 punti cliccabili visibili in `LB`.
- [ ] Menu «Saghe e GDR», `SAGAS`, `NEWEST`, `PFX`, `MACHINES`, `HAIR_SAGA`, `COSM`, `SAGHE`, `CARDS`, `LINKS`, `FRASI` aggiornati; test `sala`, `sogni`, `volti` passano.
- [ ] Stadio della saga e partite a tema provati almeno una per modalità.
- [ ] `git pull --rebase`, `git diff` senza righe rimosse non tue, `git add <file>`, bump `?v=`/`sw.js` dopo il pull.
- [ ] Dopo il push: `git fetch && git diff origin/main` vuoto e rifatto il percorso da nuova partita.


# Stato del progetto

## S1 · Cosa c'è già
- **Motore comune** `js/saga-core.js`:
  - capitoli, zone, interni, missioni, prove, epoche;
  - difficoltà e carattere degli avversari;
  - gravità, personaggi che camminano, gruppo che segue;
  - forme dell'eroe (`pass`, `heroFx`);
  - luce dinamica (`buio`, `luci`);
  - **guardie con il cono di vista** (`guard`, `hide`, `sneakStart`, `onSeen`; nei test `window.__noGuards = true`);
  - **effetto diorama** tilt-shift (`cfg.diorama` o `spec.diorama`);
  - **pagina «👥 Personaggi»** dentro ogni saga (si riempie da sola con i personaggi incontrati);
  - **scelte a tempo** (`ask(..., { secs, def })`, nei test `K.timedFire()`);
  - **tubi pneumatici** (`spec.tubes`: stazione `at`, `path`, uscita `out`, `when`, `shut`; `K.tubeRide`, `K.tubeBusy`);
  - stadio della saga (`stadium`);
  - ospiti, cameo, musiche.
- **Motori di partita propri (non ripeterli):**
  - Vignette, ATB, Super-Bottoni;
  - Nastro, Luci;
  - Concilio, Duello Cinematico, Lavagna Tattica;
  - **Ombre e Gadget** (`gadget.js`);
  - **Calcio Tattico Isometrico** (`iso.js`);
  - **Volo a Tutto Campo** (`volo.js`);
  - **Combo di Squadra** (`combo.js`);
  - **Consegna a Rete** (`consegna.js`: razzetto guidato col dito, pianeti che curvano i lanci).
  - Ogni motore espone `window.__<motore>.state` con `finish()` per i test.
- **Saghe sul motore comune:** Vento, Detective, Dopo il Campione, Calcio Spaziale, Torneo delle Cento Scuole, Cronache, Mantello Granata, Stagione Infinita, Notte dei Lampioni, Torneo dei Mondi, Trono di Cuoio, Dal Campetto al Mondiale, Master League delle Colline, Il Cavaliere della Notte (`grigio*`), La Guerra dei Tre Ducati (`ducati*`), Il Figlio del Titano (`titano*`), Gli Straordinari di Quartiere (`quartiere*`), **Razzopacco · Consegne dal Futuro** (`razzo*`), **Il Cavallo Star** (`cavallo*`, motore `ciak.js`), **Piccolo Borgo di Montagna** (`montagna*`, motore `ritagli.js`), **Per un pugno di rigori** (`pugno*`, motore `stangata.js`), **S.O.S. Galletta** (`galletta*`, motore `arrembaggio.js`), **La Notte dei Cento Rintocchi** (`campana*`, motore `I Cento Rintocchi`). Oltre alle saghe sul motore comune ci sono Vallombra (`storia-campione.js`, 8 capitoli) e le saghe vecchie.
- **Salone delle Saghe:**
  - Sala Giochi;
  - Cineteca;
  - Album dei personaggi;
  - Guardaroba;
  - **Squadra dei Sogni**: carte con le stelle, Torneo dei Sogni, Stagione dei Sogni, Draft.
- **Volti:**
  - stili classico, Flat, 2D HD, anime, pixel, manga, acquerello, Toon Head;
  - Flat e 2D HD sono i preferiti di Pasquale: i cosmetici devono vedersi lì;
  - 30 acconciature, alcune da sbloccare con le saghe (le ultime: `corona`, `ciuffo`, `cometa`, `scodella`, `antenne`). Una nuova va disegnata in `game.js` (ritratto, chibi, figura gx), `portrait-styles.js` (`HBASE` + disegno), `portrait-styles2.js` (`NB`), `portrait-dicebear.js` (`TH_FRONT`) e aggiunta in `tests/volti.cjs`.
- **Omini pixel:** in Impostazioni → «Omini» si sceglie tra classici e pixel (30 personaggi CC0 del pacchetto Ninja Adventure, `img/omini/`); l'omino del Campione prende il colore della sua maglia.
- **Storia principale** (in `js/game.js`):
  - le Stagioni 1-9 sono complete, con bivi, finali, Albero delle scelte, Diario di Leo e Borgo che evolve;
  - le Stagioni 10-12 sono scalette di 4 episodi senza bivi.
- **Prompt aggiornato per le saghe nuove:** `questo file` .

## S2 · Cosa resta da fare (in ordine)
Fatte e pubblicate: le saghe A, D, C, B, E, F (Cavallo Star), G (Piccolo Borgo di Montagna), Pugno, Galletta e Campana. Prima di cominciare controlla con `git log` e `ls js/` cosa è già presente.
1. **Nuova saga** solo su richiesta di Pasquale: proponi 3 idee (vedi §1) e aspetta che scelga.
2. **Controllo qualità delle saghe recenti** (offerto): ripassa Galletta, Pugno e Campana con la checklist §9 (oggetti raggiungibili, punti cliccabili visibili, dialoghi senza errori, zero errori in console).
3. **Carte della Storia principale** nella Squadra dei Sogni (Leo, Dario, Nico, Lina…), che si sbloccano con le stagioni.
4. **Storia principale**, da valutare con Pasquale (lui ha detto «per la saga di Leo valutiamo dopo»):
   - rifare le Stagioni 10-12 come stagioni complete (bivi, finali nell'Albero e nella Galleria, conseguenze tra una stagione e l'altra);
   - poi una Stagione 13.
5. **Piccole cose offerte:** la pagina «Personaggi» anche nelle saghe vecchie (Ragnarok, Chrono, Vallombra…); test più completi per Ombre e Gadget e per la Bilancia.

## S3 · Come lavorare
- Per la struttura dei file guarda il §2 e usa solo funzioni che esistono nel kit `K` (§7). Non copiare il contenuto di un'altra saga: la struttura sì, storia, motore e grafica devono essere nuovi.
- **Cosa toccare per ogni saga nuova:** `index.html` (gli script prima di `salone.js`), `sw.js` (la lista dei file), la regex «Saghe e GDR», `HAIR_SAGA` e `COSM` in `game.js`, `SAGAS` / `NEWEST` / `PFX` / `MACHINES` in `salone.js`, `SAGHE` / `CARDS` / `FRASI` / `ENG` / `LINKS` / `extraFor` / `bonusTxt` in `sogni.js`, gli sfondi in `bg-scenarios.js` (3 punti da toccare ciascuno), e nei test `run.cjs`, `sala.cjs` (elenco dei cabinati) e `volti.cjs`.
- **Bilanciamento:** prima di collegarlo alla saga, fai giocare al motore qualche partita intera con un pilota automatico e controlla che i risultati siano realistici (tipo 1-0, 2-1).
- **Prove veloci:** `python3 -m http.server 8821` nella cartella della repo, poi `TEST_URL=http://localhost:8821 node tests/<saga>.cjs`.
- **Errori già fatti, da evitare:**
  - heredoc della shell senza virgolette (sostituisce i `${}` dei template);
  - schermate che arrivano dopo una scena: nei test premi «Continua» finché non compaiono;
  - la tessera `+` all'aperto viene grigia;
  - etichette che coprono le teste;
  - motori che fanno troppi gol;
  - `px(` senza la tela `g` negli sfondi;
  - oggetti interattivi dentro blocchi spessi, che il test considera irraggiungibili;
  - personaggi o oggetti messi davanti alle porte o dentro le case;
  - zone collegate solo da tubi: per la raggiungibilità usa un controllo che segue i tubi (come `reachTubes` in `tests/razzo.cjs`);
  - `pkill -f` troppo generici, che chiudono anche i test in corso;
  - API inventate nel kit `K` (`K.teleport` non esiste): l'intro di un capitolo restituisce righe `[["voce","testo"]]`;
  - errori a livello di modulo in `bg-scenarios.js` (variabile fuori scope) che svuotano tutte le scene;
  - `items` fuori mappa o dentro edifici, `start` su tile solido;
  - sfondi senza punti cliccabili visibili (usa `LB` con `hot`);
  - dialoghi dei PNG che si bloccano: gli errori sono inghiottiti da `safe()`, il test deve parlare con ogni PNG e ascoltare `pageerror`;
  - regressioni sui file condivisi: `git pull --rebase`, patch mirate, `git diff` prima di `git add`.
