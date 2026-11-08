# Dossier Incompiuti da DATI (lettore `js/dossier-dati.js`)

Un Dossier = 2 capitoli extra di una saga già presente, a punto di vista diverso. Si scrive come **file di soli dati**
`js/dossier/<saga>.js`; il lettore lo trasforma in capitoli, zone, dialoghi, scelte, finali. Esempio completo: `js/dossier/titano.js`.

```js
window.__dossierDati.add({ saga: "titano", after: 3, chapters: [ { n: 4, … }, { n: 5, … } ] });
```
`after` = numero dei capitoli base (3, o 5 se la saga è lunga: i Dossier diventano 6-7).

## Capitolo
`n, title, sub, avatar{name,num,cast{style,hair,eye,skin,shirt,acc}}, start (zona), introBg, intro[[chi,testo]], goal{step:"testo"}, goalDone,`
`cast{id:{name,desc,look{…}}}` (PNG NUOVI; quelli della saga si usano per id), `cos{}`, `lore{}`, `endings{id:[titolo,testo,come]}`,
`zones{}`, `talk{}`, `obj{}`, `blocks{}`.

## Zone
`region, name, short, sub, bg, time, w, h, start:[x,y], travel:[x,y], areas, flavor{char:testo}, intro, act{char:etichetta}, interior:true+outside:[zona,x,y] (interni),`
`npcs:[{id,at:[x,y],when}]`, `layout:[["lay",x1,y1,x2,y2,"c"],["put",x,y,"c"],["house",x,y,w,h,{door,roof,wall,rr,enter:{to,at}}]]`, `trees:[[x,y]…]`.
Le tessere sono quelle del core/della saga (a=muro, t=albero, ":"=sentiero, "+"=pavimento interno, v=uscita interno, s=panca, L/T/B…=oggetti con `act`/`flavor`).

## Dialoghi e oggetti
`talk: { idPNG: [ { when:{step:n|[da,a], flag:"x"|[..], notFlag:"y", is:"valore"}, do:[azioni] } ] }` — vale la prima voce con `when` vero.
`obj: { "zona:carattere": [ …stesso formato… ] }`. `blocks: { nome: [azioni] }` richiamabili con `{call:"nome"}`.

## Azioni (eseguite in ordine; `{done:true}` chiude il dialogo)
- `{say:[[chi,testo]…]}` · `{scene:[[chi,testo]…], bg, openMain:true | go:"zona" | then:[azioni]}` (`{reward}` nel testo = riga del premio)
- `{flag:{x:true}}` · `{step:n}` · `{bond:["stat",±n]}` · `{quest:[id,titolo,testo]}` · `{cred:±n}`
- `{ask:{who,prompt,secs,def,options:[{label,sub,big,cls,when,do:[azioni]}]}}` (`secs`+`def` = scelta a tempo)
- `{k:["nomeFunzione", …argomenti]}` funzione propria della saga, istantanea (es. `{k:["pacco","id",{n,secs}]}` / `{k:["consegnato","id"]}` in Razzopacco)
- `{if:{when…},then:[…],else:[…]}` (ATTENZIONE: dopo un `if` la lista NON prosegue: metti il seguito dentro i rami, o in un blocco con `call`) · `{call:"blocco"}` · `{go:"zona"}` · `{openMain:true}`
- `{reward:{key,give:{coins,cos}}}` · `{end:"idFinale"}` · `{finish:"idFinale"}` · `{unlock:"idCartaSogni"}`
- **MINIGIOCHI** (ogni Dossier ne porta almeno 1, nuovo o riusato dalla saga):
  - `{trial:{title,secs,need,rounds:[{prompt,options:[{label,ok:true}],good,bad}],win:[…],lose:[…]}}` prova a scelte a tempo (nuovo, generico)
  - `{play:{opts:{id,alt:"az,cage,hd",force:false,…},win:[…],lose:[…]}}` partita a scelta del giocatore
  - `{engine:{name:"volo"|"concilio"|…,opts:{…},win:[…],lose:[…]}}` motore proprio della saga (`K.<name>(opts,cb)`), con le stesse opzioni usate nei suoi capitoli

## Ospite al Borgo e mazzo del Destino (nei dati, facoltativi)
`guest: { id, saga, ends:[idFinali], lines:[[chi,testo]] }` → ospite al Borgo Marino quando trovi uno di quei finali.
`deck: { id, t, e, d, ends, lock, pg:{id,n,i,tr,d,greet:"…{a}…",win,lose}, ev:{n,i,d,setup:[…],ch:[[titolo,tratto,domanda,vinci,perdi]]}, tw:{n,i,d,win,lose,mulWin,mulLose} }` → mazzo delle Carte del Destino. Esempio: `js/dossier/razzo.js`.
I PNG della saga con voci nel Dossier parlano coi dati SOLO nelle zone del Dossier; altrove risponde il capitolo base.

## Da fare a mano (non nei dati)
Le carte Sogni vanno aggiunte in `js/sogni.js` (riga della carta + frase) prima di usare `{unlock:"id"}`; mazzo Destino e ospite si possono mettere nei dati (sopra).
Poi: `index.html` (script `dossier-dati.js` già presente + `js/dossier/<saga>.js` dopo la saga), `sw.js` (cache +1 e file nuovo), test in `tests/<saga>.cjs`.
