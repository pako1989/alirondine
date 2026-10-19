# Scheda saga: cosa far compilare all'altra IA (solo dati, niente codice)

L'IA compila questa scheda in testo semplice. Io la trasformo in codice, grafica e test. Per risparmiare token: una sezione per messaggio, risposte brevi, nessun commento fuori dalla scheda.

## 0 · Identità
- id (minuscolo, una parola), titolo, icona (emoji), tono (una riga), ispirazione.
- Premessa in 5 righe. 3 finali (nome, condizione, 2 righe) di cui uno segreto.

## 1 · Regole di gioco
- Statistiche della saga (2-4): chiave, minimo, massimo, valore iniziale, etichetta, a cosa servono.
- Funzioni del core riusate (almeno 4) e come.
- Novità: nome, come funziona in 6 righe, quando serve, quali scelte crea.
- Minigioco: nome, regole in 10 righe, input (tocco), cosa vince e cosa perde, 3 livelli di difficoltà.

## 2 · Personaggi (8-14)
Una riga ciascuno: `id | nome | ruolo | aspetto (capelli, colori, accessori, forma se non umano) | bio in una frase | capitolo in cui compare`.

## 3 · Luoghi (per capitolo, 2-3 zone)
Una riga ciascuno: `id | nome | regione/atmosfera | dimensioni (es. 30x22) | edifici con interno (nome) | chi sta dove | uscite`.
Più 4-5 sfondi da 320x200: `id | cosa si vede | 3 punti da toccare con la frase`.

## 4 · Capitoli (4)
Per ognuno:
- Titolo e sottotitolo. Obiettivo per ogni passo (0, 1, 2, …), una riga.
- Scene: `passo | luogo | chi parla | battute` (battute brevi, tono fisso, indicare l'umore tra parentesi quadre, es. `[serio]`).
- Scelte: `domanda | opzioni | effetto su statistiche, rapporti, oggetti, flag`.
- Come si chiude il capitolo e cosa passa al successivo.

## 5 · Oggetti, ricompense, extra
- Oggetti dello zaino (nome, icona, descrizione, a chi piace).
- Maglia/cosmetico per ogni capitolo, titolo del finale, 4 carte per la Squadra dei Sogni (nome, ruolo, frase), 1 ospite per le Carte del Destino.
- Frasi dei punti toccabili e dei personaggi se li incontri più volte.

## Regole
- Niente spoiler al giocatore: la scheda è per me.
- Nomi inventati. Niente minori in pericolo, niente gore.
- Rispetta le regole 13 e 14 del prompt: riuso del core + una novità + un minigioco col cabinato.
