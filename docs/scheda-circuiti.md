# Scheda Saga: Neo-Rondine 2099 · Il Campionato dei Circuiti d'Oro

## 0 · Identità
- **id:** `circuiti`
- **titolo:** Neo-Rondine 2099 · Il Campionato dei Circuiti d'Oro
- **icona:** ⚡
- **tono:** Cyber-noir serio e tagliente, con momenti di lealtà tra reietti urbani.
- **ispirazione:** *Blade Runner*, *Ghost in the Shell*, *Akira*, anime sportivi sci-fi anni '80/'90.
- **Premessa:**
Anno 2099. Sotto la pioggia acida di Neo-Rondine, la Vektor Corporation controlla ogni aspetto della vita cittadina e i brevetti neurali dei calciatori.
Il campionato ufficiale è una messinscena per gli azionisti giocata da automi imbattibili, mentre nei vicoli allagati del Livello 01 resiste la lega clandestina dei Circuiti d'Oro.
Il Campione viene reclutato da K1-RA, una geniale hacker dei bassifondi, e da Rusty Jax, un ex centravanti con una gamba meccanica scheggiata.
Insieme devono violare le frequenze dei droni di sicurezza, vincere le sfide illegali nei sotterranei e guadagnare il pass per la monorotaia verso i grattacieli.
L'obiettivo è raggiungere l'arena della Cupola Olografica e sfidare il Barone Vektor per strappargli il codice sorgente del campionato.
- **3 finali (1 segreto):**
  - `libero`: *Il Codice Libero*. Sconfiggi Vektor rifiutando la sua corruzione e rilasciando il virus di K1-RA nella rete pubblica. Il firewall corporativo crolla e il calcio torna a essere un gioco libero per umani e cyborg di strada.
  - `corporativo`: *Il Patto d'Oro*. Accetti il contratto milionario di Vektor dopo la vittoria in finale. Il Campione diventa la stella dorata della lega commerciale di Neo-Rondine, con status da élite ma il rimorso di aver tradito i bassifondi.
  - `segreto`: *Protocollo Zero del Fondatore*. Raccogli tutti i 6 Datapad cifrati e inserisci la sequenza antica del 1900 nella consolle centrale. Viene riattivato il server storico delle Rondini originali, disattivando i microchip truccati e liberando la città senza caos.

---

## 1 · Regole di gioco
- **Statistiche della saga:**
  - `energia`: min 0, max 100, iniziale 25, etichetta "Carica Elettrica". Serve ad alimentare i circuiti del pallone, azionare montacarichi magnetici e resistere ai contrasti dei cyborg.
  - `hackeraggio`: min 0, max 100, iniziale 15, etichetta "Hacking Neurale". Serve a forzare terminali chiusi, disattivare droni e confrontare prove nel dossier.
  - `fama`: min 0, max 100, iniziale 10, etichetta "Reputazione nei Bassifondi". Serve a ottenere la fiducia dei mercanti neri, abbassare i costi degli scambi e sbloccare dialoghi esclusivi.
- **Funzioni del core riusate (5):**
  1. `K.guard`: droni corporativi con cono di vista visibile da aggirare con passo felpato nei vicoli.
  2. `K.clock`: fasce orarie della metropoli ("Pioggia Acida", "Blackout Programmato", "Allarme Rosso") che cambiano sentinelle e varchi aperti.
  3. `K.inv`: zaino con Datapad, chiavi neurali e batterie al litio che offrono bonus passivi (`match: {at, df, te}`) o alzano i rapporti se regalati.
  4. `K.rel`: affinità a cuori con K1-RA, Rusty Jax e Nyx-09, con scene a soglia che aprono opzioni nei bivi cruciali.
  5. `K.dossier`: fascicolo "Partite Truccate Vektor" in cui confrontare registri di scommesse e microfilm per incastrare il Barone.
- **Novità:**
  *Terminali di Hacking Neurale*: consolle interattive (`paint: T`) posizionate sulla mappa che aprono una schermata di comando rapida.
  Il giocatore spende punti `hackeraggio` per alterare la zona in tempo reale.
  Può deviare i coni di vista dei droni di sicurezza, invertire la polarità dei pavimenti elettrificati o sbloccare serrande stagne.
  Serve nei momenti di infiltrazione tra i vari livelli della città verticale.
  Crea la scelta costante se risparmiare risorse e muoversi a vista o forzare la rete allertando le sentinelle dei settori vicini.
- **Minigioco:**
  *Circuito EMP & Sovraccarico*:
  Si gioca su una griglia al neon 2D (380x220) con condensatori, nodi riflettenti e porta a barriera di frequenza.
  Il giocatore prende la mira con angolo e potenza e scaglia una sfera conduttrice metallica.
  Ogni rimbalzo sui nodi carica il condensatore della palla (+20-35% energia); due difensori cyborg intercettano la traiettoria e disperdono la carica.
  Raggiunto il 100% o premendo il tasto "⚡ EMP" (con carica ≥60%), si rilascia un impulso elettromagnetico che stordisce i cyborg per alcuni secondi e neutralizza il portiere.
  Vince chi segna il numero di reti richiesto (es. 2 o 3) entro i tiri a disposizione; perde chi finisce i tentativi senza violare la rete.
  Input: tocco/trascinamento per mirare, tasti ◀/▶ di regolazione fine, tasto SCARICA e tasto EMP.
  3 livelli di difficoltà:
  - *Livello 1 (Clandestino)*: 1 solo cyborg lento, nodi larghi, 6 tiri per 2 gol.
  - *Livello 2 (Divisione Beta)*: 2 cyborg mobili veloci, barriere laser intermittenti, 5 tiri per 3 gol.
  - *Livello 3 (Vektor Master)*: portiere olografico quantistico Z-Zero con schermatura reattiva, 5 tiri per 3 gol e nodi a polarità variabile.

---

## 2 · Personaggi (10)
- `nr_kira` | K1-RA "Kira" | Hacker ribelle | capelli undercut ciano (#06b6d4), visiera olografica, felpa oversize (#0f172a), ciocca viola | Genio dei cyberdeck, guida il Campione nei bassifondi per vendicare il fratello esiliato | Capitolo 1
- `nr_jax` | Rusty Jax | Ex bomber cyborg | capelli buzz grigi (#64748b), pelle abbronzata (#d5a57a), barba pizzetto, cicatrice, sciarpa consumata | Vecchia gloria della lega del 2070 con una gamba meccanica modificata nella sua officina | Capitolo 1
- `nr_bolt` | Bullone-7 | Droide magazziniere | forma tostapane/robot, corpo ottone e lamiere (#94a3b8), occhi led ambra | Ripara le sfere magnetiche clandestine e colleziona chip di memoria vintage | Capitolo 1
- `nr_guard` | Miliziano Vektor | Guardia corporativa | rasato, casco nero integrale (#020617), occhio a visore rosso (#ef4444), pettorina blindata | Sentinella ottusa armata di storditore elettrico assegnata ai cancelli della monorotaia | Capitolo 2
- `nr_nyx` | Nyx-09 | Arbitro-Androide | capelli slick argento (#94a3b8), pelle sintetica (#e2e8f0), fischietto d'acciaio, occhi fessura laser | Automa federale governativo programmato per l'imparzialità assoluta, tormentato da un glitch di coscienza | Capitolo 2
- `nr_volt` | Volt il Ricettatore | Mercante del mercato nero | cappellino da baseball logoro, occhiali tondi (#a855f7), giacca imbottita ciano | Vende batterie al litio, bypass di sicurezza e celle ad alto voltaggio sottobanco | Capitolo 2
- `nr_vektor` | Barone Vektor | Magnate della Vektor Corp | capelli slick neri (#0f172a), baffi curati, monocolo olografico, smoking viola (#581c87) | Dominatore miliardario di Neo-Rondine, convinto che il talento umano sia obsoleto rispetto agli algoritmi | Capitolo 3
- `nr_zero` | Z-Zero | Portiere Olografico | forma robot/ologramma, corpo energetico azzurro (#38bdf8), occhi bianchi, corona d'oro fluttuante | Costrutto di intelligenza artificiale quantistica imbattuto, programmato per parare qualsiasi traiettoria | Capitolo 3
- `nr_vance` | Ispettore Vance | Funzionario della Polizia Urbana | impermeabile beige (#d97706), cappello fedora, sigaro spento | Cerca da anni le prove definitive sui bonifici offshore della Vektor Corp | Capitolo 3
- `nr_borea` | Capitana Borea | Pilota cargo (Ospite) | capelli ponytail blu, giacca aviator con colletto di pelliccia (#ff8a3a) | Vecchia conoscenza dei cieli del 3011 atterrata per uno scambio di parti meccaniche | Capitolo 4

---

## 3 · Luoghi
- **Zone:**
  - `nr_vicoli` | I Bassifondi di Neo-Rondine | cyber/pioggia, notte | 32x22 | Bar Cyberpunk (aperto) | K1-RA vicino al tombino, Bullone-7 al banco, droni di ronda | a est verso l'officina, a nord verso la monorotaia
  - `nr_officina` | L'Officina Clandestina | cyber/officina, buio | 20x16 | Banco di Calibrazione | Rusty Jax davanti al tornio, Volt il Ricettatore all'angolo | uscita a ovest verso i vicoli
  - `nr_monorotaia` | La Banchina Monorotaia Sospesa | cupola/nebbia, notte | 32x20 | Cabina di Manovra (aperta) | Miliziano Vektor al tornello, Nyx-09 sulla banchina | a sud verso i vicoli, a est verso la cupola
  - `nr_cupola` | L'Arena della Cupola Olografica | cupola/luci, sera | 30x22 | Spogliatoio VIP | Z-Zero al centro del campo, ologrammi tifosi sugli spalti | a ovest verso la monorotaia, a nord verso il grattacielo
  - `nr_terrazza` | La Terrazza del Grattacielo Vektor | cupola/tempesta, notte | 32x22 | Eliporto Olografico | Barone Vektor al centro, Ispettore Vance al parapetto | a sud verso la cupola, a nord verso il penthouse
  - `nr_penthouse` | La Sala Server Centrale | cupola/chiuso, buio | 22x18 | Camera del Nucleo | K1-RA alla consolle principale, Z-Zero fluttuante sul server | uscita a sud verso la terrazza

- **Sfondi (320x200):**
  - `nr_titolo` | Skyline notturna cyberpunk con grattacieli al neon, monorotaia sfrecciante e pioggia | Insegna Vektor ("Il monopolio della luce elettrica sopra la nebbia"), Monorotaia ("Il treno a levitazione che unisce il fango ai cieli"), Schermo dei Bassifondi ("Torneo clandestino: iscrizioni aperte al Livello 01")
  - `nr_vicoli` | Vicolo scuro con pozzanghere riflettenti viola/ciano, cavi pendenti e insegne olografiche | Pozzanghera neon ("L'acqua piovana riflette l'insegna intermittente del Cyber-Bar"), Cassonetto dei chip ("Componenti scartate dai laboratori del piano superiore"), Cavi aerei ("Fili in fibra ottica allacciati abusivamente alla linea elettrica")
  - `nr_officina` | Interno dell'officina con monitor diagnostici a fosfori verdi, gambe robotiche e banchi da saldatura | Monitor diagnostico ("Grafici di telemetria e impulsi di tiro di Rusty Jax"), Torchio idraulico ("Un pistone rinforzato per calibrare sfere metalliche"), Cassetta delle batterie ("Celle al litio pronte per alimentare il trasmettitore EMP")
  - `nr_cupola` | L'immensa arena circolare a gradoni con pavimento a esagoni luminosi e folla olografica | Tribuna corporativa ("Poltrone in pelle sintetica per i consiglieri d'amministrazione"), Barriera di frequenza ("Una recinzione a luce laser che delimita il terreno di gioco"), Proiettore quantistico ("Il fascio di luce da cui prende forma il portiere Z-Zero")
  - `nr_penthouse` | La cupola di vetro all'ultimo piano con il pilastro del server centrale pulsante d'oro | Colonna dei dati ("Miliardi di stringhe binarie che controllano ogni risultato sportivo"), Parapetto panoramico ("A seicento metri d'altezza la pioggia sembra immobile"), Consolle master ("La tastiera quantistica che attende il codice di sblocco")

---

## 4 · Capitoli (4)

### Capitolo 1: I Bassifondi del Livello 01
- **Titolo & Sottotitolo:** *I Bassifondi del Livello 01 · La Frequenza Proibita*
- **Obiettivi:** 0: Raggiungi K1-RA al Cyber-Bar nei vicoli. 1: Evita i droni e porta la batteria all'officina di Rusty. 2: Calibra la sfera metallica e supera la prima sfida EMP contro i Cyborg Clandestini.
- **Scene:**
  - 0 | nr_vicoli | nr_kira | `[serio] Benvenuto nel fango, Campione. Se vuoi sfidare Vektor devi prima imparare a non farti friggere dai droni.`
  - 1 | nr_officina | nr_jax | `[felice] Quella gamba non tradisce mai, ma contro i loro schermaggi serve un impulso EMP calibrato a dovere!`
- **Scelte:** `Come aggiri il drone di blocco al vicolo est? | [Hackeraggio neurale del sensore, Scatto atletico sotto la pioggia] | Hack: +10 hackeraggio, -5 energia. Scatto: +10 energia, +5 fama.`
- **Chiusura:** Vittoria della prima sfida EMP; K1-RA decifra il pass magnetico per la monorotaia; si passa al Capitolo 2.

### Capitolo 2: Il Treno Magnetico verso la Cupola
- **Titolo & Sottotitolo:** *Il Treno Magnetico verso la Cupola · Il Giudizio Sintetico*
- **Obiettivi:** 0: Raggiungi la banchina della monorotaia. 1: Interroga Nyx-09 sul protocollo di gara. 2: Batti la Divisione Beta nella Cupola Olografica.
- **Scene:**
  - 0 | nr_monorotaia | nr_guard | `[arrabbiato] Documenti biometrici o indietro al Livello 01! La monorotaia non è per i relitti di strada!`
  - 1 | nr_monorotaia | nr_nyx | `[serio] Analisi parametri: battito regolare, nessun innesto proibito rilevato. Procedura autorizzata.`
  - 2 | nr_cupola | nr_zero | `[freddo] Probabilità di successo del Campione umano calcolata: 0.04%. Inizializzazione barriera.`
- **Scelte:** `Nyx mostra un'anomalia nel registro scommesse: cosa fai? | [Consegna il file al dossier di Vance, Tieni il chip per ricattare la sicurezza] | Dossier: +1 prova dossier, +15 stima Nyx. Chip: +50 monete, +10 hack.`
- **Chiusura:** Disattivata la barriera della Divisione Beta; apertura dell'ascensore panoramico per la torre corporativa.

### Capitolo 3: La Terrazza della Vektor Corp
- **Titolo & Sottotitolo:** *La Terrazza della Vektor Corp · Resa dei Conti a Seicento Metri*
- **Obiettivi:** 0: Sali sulla terrazza dell'eliporto. 1: Rifiuta l'offerta del Barone Vektor. 2: Sfida Z-Zero al massimo potenziale con il motore Sovraccarico.
- **Scene:**
  - 0 | nr_terrazza | nr_vektor | `[furbo] Ammiro la tua tenacia, Campione. Ma il calcio è un'industria da quaranta miliardi: unisciti a me o verrai cancellato dai registri.`
  - 1 | nr_terrazza | nr_kira | `[arrabbiato] Non ascoltarlo! Se firmi, i bassifondi rimarranno al buio per altri cinquant'anni!`
- **Scelte:** `Il Barone offre un assegno in bianco prima del fischio d'inizio: | [Rifiuta e dichiara guerra aperta, Esita studiando i suoi punti deboli] | Rifiuta: +15 fama, sblocca finale libero. Esita: +15 hack, sblocca dossier completo.`
- **Chiusura:** Sconfitta della squadra di Vektor sull'eliporto; fuga del Barone nella sala server; si accede al Capitolo 4.

### Capitolo 4: Il Cuore del Server Centrale
- **Titolo & Sottotitolo:** *Il Cuore del Server Centrale · Il Codice Sorgente*
- **Obiettivi:** 0: Entra nel penthouse del server. 1: Disattiva la sentinella quantistica finale. 2: Scegli il destino di Neo-Rondine tra i 3 finali.
- **Scene:**
  - 0 | nr_penthouse | nr_vektor | `[disperato] Senza il mio algoritmo la lega collasserà nel caos! Non puoi distruggere il progresso!`
  - 1 | nr_penthouse | nr_kira | `[felice] La consolle master è sbloccata! A te l'ultima parola, Campione.`
- **Scelte (Bivio finali):** `Quale codice carichi nel server centrale? | [Carica il virus di K1-RA e libera il segnale, Firma il contratto di Vektor sulla consolle, Inserisci la sequenza antica dei 6 Datapad] | Opzione 1: Finale libero. Opzione 2: Finale corporativo. Opzione 3: Finale segreto.`
- **Chiusura:** Epilogo, registrazione del finale in Cineteca e sblocco permanente del cabinato e delle ricompense.

---

## 5 · Oggetti, ricompense, extra
- **Oggetti dello zaino:**
  1. `Datapad Cifrato` (💾, "Frammento di memoria ottica con dati del campionato storico", piace a K1-RA: +15 stima).
  2. `Cella al Litio Sovraccaricata` (🔋, "Batteria ad alto amperaggio", bonus partita: `te: +2`, piace a Rusty: +10 stima).
  3. `Visiera Olografica di Scarto` (🕶️, "Visore da hacker con lenti a contrasto", bonus partita: `at: +1`, piace a Nyx: +10 stima).
  4. `Pillola di Liquido Refrigerante` (🧪, "Fiala criogenica per raffreddare i condensatori", bonus partita: `df: +2`).
- **Cosmetici e sblocchi:**
  - Cap 1: Maglia con disegno `sm_circuiti` ("Guscio in nanotubi di carbonio con inserti al neon ciano", colore base #06b6d4).
  - Cap 2: Acconciatura `hs_cyberundercut` ("Cresta Cyberpunk asimmetrica con riflessi neon").
  - Cap 3: Tiro speciale `sh_sovraccarico` ("Tiro a Impulso EMP", bias precisione con scia elettrica azzurra).
  - Cap 4 / Finale: Titolo "Architetto di Rete" / "Campione Cibernetico 2099".
- **4 Carte per la Squadra dei Sogni:**
  1. `nr_kira` | Centrocampista | "Una riga di codice pulita vale più di cento parate." | Rara
  2. `nr_jax` | Attaccante | "La gamba cigola ancora, ma il tiro spacca i tiranti." | Comune
  3. `nr_vektor` | Difensore | "Tutto ha un prezzo: persino l'incrocio dei pali." | Epica
  4. `nr_zero` | Portiere | "Traiettoria calcolata e archiviata a zero." | Leggendaria
- **Ospite al Borgo:** `nr_kira` (K1-RA si stabilisce al molo con il suo cyberdeck da hacking).
- **Cabinato Sala Giochi:** `emp` ("Circuito EMP & Sovraccarico", giocabile liberamente dopo il primo finale).
