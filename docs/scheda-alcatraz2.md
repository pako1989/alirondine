# Scheda Saga: Fuga da Alcatraz FC 2 · L'Ultimo Rientro

## 0 · Identità
- **id:** `alcatraz2`
- **titolo:** Fuga da Alcatraz FC 2 · L'Ultimo Rientro
- **icona:** ⛓️
- **tono:** Ironico-avventuroso di base in stile commedia carceraria all'italiana (*I soliti ignoti* incontra *Fuga per la vittoria*), con 2 momenti ad alto impatto emotivo e drammatico (il sacrificio di una guardia nella camera di compensazione e la lettera d'addio di Bruno). Tematiche adulte (privatizzazione cinica dei penitenziari, riscatto morale, lealtà tra compagni), zero violenza gratuita o gore, colpi di scena serrati e scelte irreversibili.
- **ispirazione:** *Fuga da Alcatraz*, *The Rock*, commedie carcerarie storiche, i grandi film di rapina al contrario (heist d'infiltrazione), *Escape from New York*, la leggenda dei campioni dimenticati.
- **Premessa:**
Tre anni dopo la celebre fuga in barchino dall'isola dei fari, il Campione vive sotto falso nome a Marsiglia, lavorando come magazziniere navale e nascondendosi dalle autorità.
Un giorno, nascosto in una cassa di acciughe sotto sale del golfo, riceve un messaggio cifrato su carta oleata firmato da Bruno il Barbiere: il vecchio penitenziario di Alcatraz non è più statale, ma è stato svenduto al famigerato *Consorzio Cerbero*, una compagnia di sicurezza privata guidata dalla spietata Comandante Vane.
Vane ha trasformato i livelli sotterranei in una colonia di lavoro forzato per l'estrazione sottomarina, imprigionando le vecchie guardie recalcitranti (tra cui il pentito Tonelli) e i detenuti storici.
Per liberare i compagni rimasti indietro e impedire che il settore sommerso venga inondato per sempre per coprire le prove dell'illecito, il Campione non deve più scappare verso il mare: deve **compiere l'ultimo rientro**, infiltrandosi dall'esterno nelle viscere dell'isola insieme a una nuova alleata ribelle, la sommozzatrice Rebecca "Bullone".
Tra condotti allagati, valvole a pressione, fari a ultravioletti e partite di calcio a parete semisommerso nella grande cisterna spagnola, si deciderà il destino dell'isola.
- **4 finali (1 segreto):**
  - `marsiglia`: *La Rotta di Marsiglia*. Completi l'evacuazione sul motoscafo di Dario lasciando l'isola al suo destino. Il Consorzio viene travolto dallo scandalo mediatico internazionale; Bruno apre una celebre barberia sul porto vecchio di Marsiglia con vista sui bastioni francesi.
  - `guardia`: *La Nuova Guardia*. Sigilli l'alleanza tra detenuti ed ex guardie, ripristinando l'onore di Tonelli e dell'ex Direttore Corvo. Il penitenziario viene de-privatizzato e convertito in colonia agricola autogestita e scuola calcio federale per giovani del territorio.
  - `porto_franco`: *Il Bastione Libero*. Assecondi il piano anarchico di Rebecca "Bullone": le turbine industriali vengono sabotate e la fortezza diventa un'isola autonoma autogestita fuori dalle rotte doganali, rifugio sicuro per marinai e fuggiaschi.
  - `segreto`: *Il Faro di Rondine*. Con tutti i 6 grimaldelli di titanio, l'eredità del salvataggio originale e la fiducia al 100% di Bruno, Rebecca e Corvo, smascheri il Consorzio Cerbero senza far scattare allarmi. Ottieni la grazia presidenziale plenaria per tutti i detenuti, che tornano al Borgo di Rondine per una storica partita estiva sul molo.

---

## 1 · Regole di gioco
- **Statistiche della saga:**
  - `allerta`: min 0, max 100, iniziale 10, etichetta "Livello d'Allerta Cerbero (🚨)". Misura l'attenzione delle torrette e dei droni sonar: se supera quota 75, le pattuglie corazzate bloccano i varchi e costringono a deviazioni rischiose.
  - `pressione`: min 0, max 100, iniziale 30, etichetta "Pressione Idraulica Paratie (🚰)". Regolata azionando valvole nei sotterranei: serve a svuotare o inondare sezioni per sbloccare percorsi e modificare il galleggiamento della palla in partita.
  - `chiavi`: min 0, max 99, iniziale 2, etichetta "Grimaldelli in Titanio (🗝️)". Necessari per forzare le porte di sicurezza e le gabbie degli ostaggi senza fare rumore.
- **Funzioni del core riusate (5):**
  1. `K.allarme`: barra d'allerta che aumenta con scelte frettolose, tentativi di scasso falliti o esposizione ai fari, attivando sirene audio e perquisizioni.
  2. `K.scasso`: mini-sfida a bivi per forzare serrature blindate usando grimaldelli o rischiando la spallata rumorosa.
  3. `K.inv`: zaino con gestione di attrezzi, pezzi di ricambio, mappe nautiche e doni per aumentare la sintonia con i compagni.
  4. `K.rel`: affinità a cuori con Bruno il Barbiere, Rebecca Bullone, Smilzo Sam e Guardia Tonelli, fondamentale per sbloccare il finale segreto.
  5. `K.stadium`: ambientazione stadio con meteo pioggia, campo "cortile sommerso" e riflettori dinamici volumetrici.
- **Novità di Motore Comune:**
  *Matrice Idraulica / Water-Gate Matrix (`K.waterGate`)*:
  Sistema interattivo a 3 stadi di galleggiamento (`0: asciutto`, `1: pelo d'acqua`, `2: sommerso fino alle ginocchia`) che modifica in tempo reale la fisica del gioco:
  - Sul campo di calcio a parete, l'acqua riduce l'attrito del pallone, rendendo i tiri radenti velocissimi e scivolosi, mentre i rimbalzi bassi schizzano via a doppio effetto.
  - Negli ambienti d'esplorazione, alzare o abbassare le saracinesche fa galleggiare casse di legno utilizzabili come ponti o prosciuga condotti fognari prima inaccessibili.
  - Modulo esportabile e riusabile in altre saghe marittime, portuali o sotterranee del gioco.
- **Minigioco:**
  *Sub-Water Heist '95 (Cabinato Arcade in Sala Giochi)*:
  Simulatore arcade 16-bit a gettoni ambientato nei cunicoli allagati:
  - Visuale laterale a scorrimento con timer a conto alla rovescia (60 secondi).
  - Il giocatore guida il Campione che nuota tra le paratie d'acciaio, calcolando i getti di vapore bollente e azionando 3 manovelle colorate nell'ordine corretto.
  - Per disattivare le griglie laser finali, deve calciare una sfera d'acciaio galleggiante centrare i sensori a parete prima che la chiusa si chiuda.
  - 3 livelli di difficoltà (Canale Banchina, Fonderia a Vapore, Cisterna Spagnola).

---

## 2 · Personaggi (8)
- `alc2_campione` | Il Campione | Protagonista & Regista furtivo | Giacca cerata da marinaio blu petrolio (#0c4a6e), berretto di lana grigio topo (#475569), cicatrice leggera sul sopracciglio | Più maturo e cauto rispetto alla prima fuga, rifiuta la gloria personale e lotta solo per riportare a casa gli amici rimasti indietro | Capitolo 1
- `alc2_bruno` | Bruno il Barbiere | Capitano carismatico dei detenuti | Camicia a strisce consumata priva di colletto (#334155), bretelle nere, barba brizzolata lunga e folta ma curata al millimetro (#64748b) | Leader morale del settore sotterraneo, continua a dispensare consigli filosofici tra una rasatura clandestina e un salvataggio sulla linea | Capitolo 2
- `alc2_rebecca` | Rebecca "Bullone" | Sommozzatrice d'infiltrazione & Ala tornante | Muta da sub in neoprene nero con maniche tagliate, capelli corti tinti verde rame (#059669), stivali rinforzati e chiavi inglesi alla cintura | Ragazza sfrontata e anarchica del porto, maestra di immersioni notturne e tiri balistici d'effetto | Capitolo 1
- `alc2_sam` | Smilzo Sam | Elettricista & Scassinatore di squadra | Gilet multitasche da elettricista pieno di guarnizioni e tester (#d97706), corporatura allampanata, calzini a scacchi gialli e neri | Ansioso incurabile, ha sostituito le lime per unghie con schemi circuitali improvvisati | Capitolo 1
- `alc2_vane` | Comandante Vane (Vipera) | Direttrice del Consorzio Cerbero & Portiere d'élite | Uniforme militare bianca d'ordinanza con mostrine dorate (#f8fafc), guanti di pelle nera lucida, chignon impeccabile nero corvino (#0f172a) | Fredda, calcolatrice, priva di pietà: considera il calcio solo una branca della fisica applicata e difende i pali con posizionamento scientifico | Capitolo 3
- `alc2_gaetano` | Don Gaetano | Anziano detenuto contabile & Mediano metodista | Giacca di velluto a coste marrone rammendata (#78350f), occhialini tondi legati con spago, berretto da nostromo | Memoria storica dell'isola, conosce le gallerie spagnole del 1890 meglio di chiunque altro | Capitolo 2
- `alc2_tonelli` | Guardia Tonelli | Ex carceriere degradato & Terzino marcatore | Vecchia divisa grigio-azzurra sbiadita (#64748b) senza bottoni, fischietto d'ottone al collo, baffi spioventi | Pentito dei soprusi passati, desidera solo riscattarsi aiutando i detenuti a tornare alla luce del sole | Capitolo 2
- `alc2_dario` | Dario degli Aironi | Meccanico navale di supporto esterno | Salopette da lavoro blu mare sporca di grasso (#1e3a8a), walkie-talkie a tracolla, coppola ligure | Fornisce intelligence radio dal barchino d'appoggio al largo della scogliera | Capitolo 1

---

## 3 · Eredità dei Finali della Saga Originale
All'avvio del Capitolo 1, il gioco interroga il salvataggio di *Fuga da Alcatraz FC*:
- **Se finale «Evasione»:**
  - *Scenario*: Il Campione e Smilzo Sam sono ricercati internazionali con taglia affissa sui muri di Marsiglia.
  - *Variazione*: Sam inizia già in squadra dal primo minuto; la Comandante Vane ha fatto corazzare con titanio le vecchie condutture da cui eravate fuggiti.
  - *Dialogo speciale*: Sam: *«Tre anni passati a dormire con le scarpe per paura che bussassero alla porta... e ora mi chiedi di bussare io alla loro?»*.
- **Se finale «Patto»:**
  - *Scenario*: L'accordo stretto col vecchio Direttore Cardenas è stato calpestato dal Consorzio Cerbero, che ha fatto arrestare anche lui.
  - *Variazione*: Cardenas fa recapitare un messaggio cifrato con il codice della darsena blindata.
  - *Dialogo speciale*: Cardenas: *«Mi avevi avvertito che i miei superiori non avevano onore, ragazzo. Avevi ragione tu. Ora riprenditi la tua isola»*.
- **Se finale «Barbiere»:**
  - *Scenario*: La leggenda della barberia del Braccio Ovest è viva tra i marinai della costa.
  - *Variazione*: Nello zaino iniziale è già presente il *Rasoio d'Argento del 1948*, che garantisce un bonus di rispetto immediato con Bruno.
  - *Dialogo speciale*: Rebecca: *«Tutti sull'isola parlano ancora del taglio di capelli che hai fatto alla guardia prima di sparire nel condotto»*.
- **Se finale «Scatola» (Capitolo Ponte con Operazione Scatola Vuota):**
  - *Scenario*: Dario e Ottone sono i tuoi partner ufficiali d'infiltrazione con il battello stealth *Rondine III*.
  - *Variazione*: Dario offre supporto radio potenziato che abbassa di 15 punti l'allerta nemica nei momenti critici.
  - *Dialogo speciale*: Dario: *«La Scatola Vuota ci ha salvato la pelle una volta. Questa volta la riempiamo noi di galeotti liberi»*.
- **Finale di Base (senza salvataggio pregresso):**
  - Fuga rocambolesca avvenuta lasciando Bruno e i detenuti in attesa; esperienza narrativa perfettamente fruibile senza prerequisiti obbligatori.

---

## 4 · Struttura dei 4 Capitoli

### Capitolo 1: «La Notte del Rientro»
- **Titolo & Sottotitolo:** Capitolo 1: «La Notte del Rientro» · *Dalla nebbia di Marsiglia ai canali di scarico della Falesia Nord*
- **Obiettivo:** Salpare nella notte tempestosa, eludere le boe sonar del Consorzio e infiltrarsi nel vecchio condotto di scarico delle caldaie.
- **Passi (Step):**
  - *Step 0*: Incontro al molo clandestino di Marsiglia con Dario e Rebecca; caricamento equipaggiamento da sub.
  - *Step 1*: Navigazione a fari spenti; manovrare l'idrometro per evitare i fasci di luce delle motovedette Cerbero.
  - *Step 2*: Sbarco tra gli scogli aguzzi della Falesia Nord; scalata con rampino della parete viscida di salsedine.
  - *Step 3*: Prima sfida a Calcio a Parete 3v3 contro le sentinelle del pontile d'attracco per spegnere l'allarme generale.
- **Scelta Morale:** Tagliare l'alimentazione del settore nord causando un blackout nell'infermeria carceraria (infiltrazione facile ma cinica) oppure forzare la chiusa idraulica manualmente con Rebecca, rischiando che rimanga ferita ma tutelando i malati (difficile ma etica).
- **Incontri & Rivelazioni:** Rebecca "Bullone" rivela la sua identità; si scopre che i detenuti storici sono stati deportati nel Livello -3 per scavare gallerie sottomarine.
- **Finale Capitolo:** La pesante saracinesca d'acciaio si chiude con un boato alle spalle del gruppo: siete dentro Alcatraz, senza via di ritorno.

### Capitolo 2: «I Sotterranei della Fonderia»
- **Titolo & Sottotitolo:** Capitolo 2: «I Sotterranei della Fonderia» · *Tra fango, zolfo e specchi di vapore nel Livello -2*
- **Obiettivo:** Attraversare le gallerie industriali allagate, ritrovare Bruno e Don Gaetano e sabotare il generatore a vapore.
- **Passi (Step):**
  - *Step 0*: Esplorazione furtiva tra le cisterne d'epoca borbonica schivando i droni a infrarossi.
  - *Step 1*: Ricongiungimento commovente con Bruno il Barbiere nella sua nuova barberia di fortuna ricavata tra le condotte.
  - *Step 2*: Dialogo con l'anziano Don Gaetano per decifrare l'antico schema idraulico delle tre leve di compensazione.
  - *Step 3*: Sfida di Calcio a Parete con getti di vapore bollente contro la guardia speciale di sorveglianza interna.
- **Scelta Morale:** Liberare dalla cella d'isolamento la guardia Tonelli, che chiede perdono per il passato (rallenta il gruppo ma offre una guida interna), o lasciarlo rinchiuso per non compromettere la tabella di marcia.
- **Incontri & Rivelazioni:** Tonelli rivela il piano segreto della Comandante Vane: provocare una finta falla strutturale per inondare il Livello -3 e cancellare ogni prova del consorzio.
- **Finale Capitolo:** Risveglio drammatico: le sirene d'emergenza rosse urlano nel buio e l'acqua di mare comincia a salire dalle grate del pavimento.

### Capitolo 3: «La Partita nel Bastione Sommerso»
- **Titolo & Sottotitolo:** Capitolo 3: «La Partita nel Bastione Sommerso» · *Calcio a pelo d'acqua nella grande cisterna centrale*
- **Obiettivo:** Affrontare e sconfiggere i Corazzieri d'élite di Cerbero per conquistare il controllo della valvola maestra.
- **Passi (Step):**
  - *Step 0*: Ingresso nella monumentale cisterna ottagonale spagnola; l'acqua è alle caviglie.
  - *Step 1*: Regolazione della pressione idraulica: calibrare le paratie per creare varchi balistici a 45 gradi.
  - *Step 2*: Discorso motivazionale di Bruno negli spogliatoi di lamiera arrugginita; assegnazione dei ruoli tattici.
  - *Step 3*: La Partita Ufficiale del Bastione Sommerso: 3v3 con sponde mobili contro la Comandante Vane in porta. I tiri violenti contro i pulsanti a muro aprono e chiudono getti d'acqua che spazzano via la difesa avversaria.
- **Scelta Morale:** Usare la massima pressione idraulica per allagare la sala server della Vane (distruggendo per sempre i contratti d'appalto e incriminandola) o deviarla verso il canale di scarico per garantire un'evacuazione pulita e immediata a tutti i detenuti.
- **Incontri & Rivelazioni:** La Comandante Vane viene sconfitta sul campo, ammettendo che il Consorzio Cerbero agiva senza alcuna autorizzazione ministeriale.
- **Finale Capitolo:** Il muro maestro cede sotto la pressione dell'alta marea: l'acqua sale rapidamente e inizia la grande fuga verso la superficie.

### Capitolo 4: «L'Ultima Marea»
- **Titolo & Sottotitolo:** Capitolo 4: «L'Ultima Marea» · *Corsa contro il tempo verso il molo sotto i riflettori della Torre Faro*
- **Obiettivo:** Risalire le condotte montacarichi, raggiungere la scogliera e far salire tutti sul motoscafo di Dario.
- **Passi (Step):**
  - *Step 0*: Fuga attraverso il condotto di ventilazione invaso dalla schiuma marina.
  - *Step 1*: Salita a spirale alla Torre Faro per disattivare l'ultimo proiettore a ricerca ottica.
  - *Step 2*: Confronto verbale e sportivo finale sulla balconata del faro battuta dal vento e dalla pioggia.
  - *Step 3*: Il "Tiro della Salvezza": calciare il pallone legato alla cima d'ormeggio per agganciarlo alla bitta del barchino di Dario tra i flutti tempestosi.
- **Scelta Morale:** Accogliere a bordo del battello anche l'ex Direttore Corvo dandogli l'opportunità di testimoniare al processo, o lasciarlo sull'isola ad attendere i soccorsi federali.
- **Incontri & Rivelazioni:** Don Gaetano sceglie di restare come custode volontario del faro storico per spegnere per sempre l'allarme e accendere la luce per i marinai.
- **Finale Capitolo:** Il battello scivola veloce nella foschia mattutina mentre il sole sorge sul golfo di Rondine; epilogo dinamico basato sul finale conseguito.

---

## 5 · Luoghi Dettagliati

### 1. Falesia Nord & Canali di Scarico (Esterno grande, 32x24 caselle)
- *Descrizione visiva*: Scogliera a picco di basalto scuro bagnata da onde spumeggianti animate su 3 frame. Enormi tubature arrugginite riversano cascate di schiuma marina nel mare. Torrette di ronda in metallo zincato con riflettori rotanti gialli e telecamere a circuito chiuso dal bagliore rosso. Atmosfera cupa, piovigginosa, con sfumature dal blu di Prussia al grigio asfalto.
- *3 punti interattivi con didascalia fissa:*
  - `La Grata Divelta`: «I cardini mostrano ancora i segni della sega a corda di tre anni fa. La salsedine ha fatto il resto del lavoro».
  - `La Boa Sonar`: «Un bulbo di gomma e rame che emette un 'bip' sommesso ogni sei secondi. Rebecca ha oscurato la lente con grasso marino».
  - `La Scaletta dei Contrabbandieri`: «Gradini di roccia scavati nell'Ottocento, coperti di alghe viscide. Scivolare qui significa finire dritti nella risacca».

### 2. Dormitorio delle Cisterne (Interno 1)
- *Descrizione visiva*: Antico locale sotterraneo con volte a crociera in mattoni rossi e blocchi di tufo umido. Amache di tela grezza sospese tra tubature di rame che gocciolano ritmicamente. Una stufa improvvisata con un fusto di carburante diffonde un bagliore arancione caldo; un vecchio specchio da barbiere scheggiato poggia sopra un lavandino di pietra.
- *3 punti interattivi con didascalia fissa:*
  - `La Stufa a Nafta`: «Brucia rami galleggianti e trucioli di cartone. Scalda poco, ma il fumo allontana l'umidità delle ossa».
  - `Lo Specchio Scheggiato`: «Dietro la cornice di legno Bruno custodisce il taccuino con i turni delle ronde e una bottiglia di colonia alla lavanda».
  - `Il Quadro Idraulico`: «Sei rubinetti di bronzo e tre manometri a lancetta. Una targhetta d'ottone recita: 'Regia Marina - Bacino Sommergibili 1918'».

### 3. La Cisterna del Bastione Sommerso (Interno 2)
- *Descrizione visiva*: Imponente arena ottagonale in pietra scura, parzialmente allagata da 20 cm d'acqua marina limpida e riflettente. Fari subacquei d'emergenza proiettano fasci turchesi dal fondo. Alle pareti sorgono paratie di lamiera ondulata rinforzata, con pistoni pneumatici verticali che rilasciano sbuffi di vapore bianco ogni volta che il pallone vi rimbalza contro. Porte da calcio realizzate con tralicci d'acciaio e reti di corda navale.
- *3 punti interattivi con didascalia fissa:*
  - `La Valvola di Fondo`: «Un massiccio timone di ghisa con una freccia verniciata di bianco: 'SCARICO RAPIDO'. È sigillato da una catena d'acciaio».
  - `La Parete Elastica N° 3`: «Lamiera scanalata montata su molle industriali. Un tiro d'interno piede qui sopra schizza con traiettoria tesa verso l'incrocio opposto».
  - `La Tribuna di Guardia`: «Una passerella sopraelevata protetta da vetri blindati, da cui la Comandante Vane supervisiona ogni traiettoria».

---

## 6 · Carte & Integrazioni Obbligatorie

### 5 Carte per la Squadra dei Sogni
1. `alc2_bruno` | Bruno il Veterano | `D` (Difensore) | Att: 66, Dif: 86, Tec: 78 | *Muro di Spugna*: Intercetta ogni tiro rimbalzato a parete e riavvia l'azione con precisione chirurgica. (Sblocco: Cap. 2)
2. `alc2_rebecca` | Rebecca Bullone | `A` (Attaccante) | Att: 84, Dif: 58, Tec: 82 | *Parabola Idraulica*: Tiro a giro a pelo d'acqua con schizzi accecanti che disorientano il portiere. (Sblocco: Cap. 1)
3. `alc2_sam` | Smilzo Elettrico | `C` (Centrocampista) | Att: 74, Dif: 64, Tec: 84 | *Cortocircuito*: Scivolata fulminea che disattiva l'abilità speciale dell'avversario per 15 secondi. (Sblocco: Cap. 2)
4. `alc2_vane` | Comandante Vane | `P` (Portiere) | Att: 52, Dif: 90, Tec: 76 | *Barriera Cerbero*: Piazzamento geometrico impeccabile che annulla i tiri di prima intenzione dalle sponde. (Sblocco: Finale 1 o 4)
5. `alc2_gaetano` | Don Gaetano | `C` (Centrocampista) | Att: 68, Dif: 78, Tec: 80 | *Lancio del Nostromo*: Passaggio millimetrico a scavalcare la difesa che sfrutta le correnti d'aria. (Sblocco: Cap. 3)

### 10 Carte del Mazzo Destino
1. `dest_grimaldello_ti`: *Grimaldello di Titanio* · Ignora la difficoltà di una serratura senza generare allerta.
2. `dest_onda_reflusso`: *Onda di Riflusso* · Sposta di due metri indietro tutti i marcatori avversari per 1 turno.
3. `dest_fischietto_ton`: *Fischietto di Tonelli* · Ferma il gioco annullando un contrasto violento delle guardie.
4. `dest_vapore_cieco`: *Cortina di Vapore* · Rende invisibile il portatore di palla ai fari per 15 secondi.
5. `dest_paratia_molla`: *Paratia a Molla* · Raddoppia la velocità del pallone al prossimo rimbalzo a parete.
6. `dest_sigaro_bruno`: *Mezzo Sigaro di Bruno* · Ripristina immediatamente 25 punti Grinta a tutta la squadra.
7. `dest_chiave_14`: *Chiave a Brugola 14* · Apre istantaneamente una grata secondaria sul campo.
8. `dest_rete_canapa`: *Rete di Canapa Rinforzata* · Neutralizza un tiro speciale dell'attaccante rivale.
9. `dest_barchino_dario`: *Motore Ausiliario di Dario* · Riduce l'allerta nemica di 20 punti in caso d'emergenza.
10. `dest_occhio_vipera`: *Radar della Vipera* · Rivela in anticipo l'angolo scelto dal portiere sul tiro decisivo.

### Personaggio Ospite al Borgo
- `alc2_rebecca` (Rebecca Bullone al Molo dei Trabucchi):
  - *Battuta 1*: «Il mare qui a Borgo Marino è troppo calmo... quasi mi manca l'odore di nafta e allarme di Alcatraz».
  - *Battuta 2*: «Se qualcuno cerca una saldatura subacquea per il gozzo di Baciccia, sapete dove trovarmi: dove l'acqua è più profonda».

### Cabinato per la Sala Giochi
- *«Sub-Water Heist '95»*: Cabinato arcade a monete con simulazione di nuoto controcorrente tra paratie semoventi, disattivazione valvole a tempo e tiri a rimbalzo sull'acqua per centrare le chiuse prima del crollo.

---

## 7 · Oggetti per lo Zaino (6)
1. 🪛 **Grimaldello in Titanio Flessibile**: Strumento d'altissima precisione ricavato da un'antenna navale da Smilzo Sam. Regalo gradito da: *Smilzo Sam* (+15 legame).
2. 🪒 **Rasoio d'Argento del 1948**: Lama storica della bottega di famiglia di Bruno, custodita come una reliquia. Regalo gradito da: *Bruno il Barbiere* (+20 legame).
3. 🍬 **Liquirizia Pura dei Palombari**: Blocchetto compatto amarissimo masticato dai sommozzatori per combattere il freddo. Regalo gradito da: *Rebecca Bullone* (+15 legame).
4. 📜 **Mappa delle Gallerie Spagnole**: Pianta catastale del 1890 tracciata con inchiostro ferrogallico. Regalo gradito da: *Don Gaetano* (+20 legame).
5. 🔦 **Filtro Infrarosso per Torretta**: Lente al quarzo color rubino per rendere invisibile il fascio dei fari guida. Regalo gradito da: *Dario* (+15 legame).
6. ☕ **Thermos di Caffè alla Sambuca**: Miscela bollente e profumata preparata secondo la tradizione portuale. Regalo gradito da: *Guardia Tonelli* (+15 legame).

---

## 8 · Sblocco e Integrazione nel Salone delle Saghe
- **Requisiti di accesso:** La saga compare nella galleria del *Salone delle Saghe* con una cover dedicata (`alc2_titolo`) raffigurante la silhouette scura della fortezza illuminata da riflettori turchesi e sbarre bagnate. Si sblocca completando almeno un finale qualsiasi di *Fuga da Alcatraz FC*.
- **Opzione di fallback in Impostazioni:** Un selettore in menu Impostazioni permette di attivare il "Finale di Base per i Sequel" per i giocatori che desiderano iniziare direttamente dal sequel senza dover prima giocare il titolo originale.
- **Descrizione nel Salone (Zero Spoiler):**
*«Un messaggio in una bottiglia di nafta raggiunge il porto di Marsiglia: il penitenziario dei fari non ha ancora finito di raccontare la sua storia. Calcio a parete semisommerso, nuove paratie e la sfida definitiva al Consorzio Cerbero»*.
