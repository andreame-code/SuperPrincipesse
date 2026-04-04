# Super Principesse

Super Principesse e un platform 2D fiabesco costruito con Phaser 3, TypeScript e Vite. Il gioco gira interamente offline nel browser, genera le proprie texture in runtime e propone una piccola avventura a scorrimento con selezione del personaggio, raccolta di lanterne, checkpoint, nemici e un boss finale.

## Panoramica

- Menu introduttivo con presentazione dell'avventura.
- Selezione eroe con 5 personaggi giocabili: Rapunzel, Phua, Mulan, Biancaneve e Aurora.
- 4 livelli consecutivi con layout dedicati.
- HUD con mondo corrente, punteggio e vite residue.
- Sistema di movimento rifinito con coyote time, jump buffer, jump cut e un doppio salto limitato.
- Livello finale acquatico con boss fight contro la Murena Regina.
- Test automatici su movimento, completamento livelli e coerenza dei layout.

## Stack

- `Phaser 3` per scene, fisica Arcade e rendering canvas
- `TypeScript` per logica di gioco e definizioni
- `Vite` per sviluppo locale e build
- `node:test` per la suite di test

## Requisiti

- `Node.js` 20 o superiore
- `npm`

## Avvio rapido

```bash
npm install
npm run dev
```

Il server di sviluppo Vite espone poi il progetto in locale, di default su `http://localhost:5173`.

## Script disponibili

```bash
npm run dev      # avvia il gioco in sviluppo
npm run build    # compila TypeScript e crea la build di produzione
npm run preview  # apre la build prod in locale
npm run test     # esegue i test in tests/*.test.ts
npm run check    # lancia test + build
```

## Come si gioca

- `Sinistra` / `Destra`: movimento
- `Invio`: avanza dal menu e conferma la selezione
- `1` `2` `3` `4`: avvio rapido dal livello scelto nella schermata di selezione
- `Su` / `Giu`: cambia il livello selezionato nella quick select
- `F1`: toggle debug hitbox indicato nell'HUD

Obiettivo di base:

- scegli una principessa
- raccogli le lanterne
- evita melme, pesci e pericoli ambientali
- raggiungi il vessillo finale di ogni livello

## Struttura del progetto

```text
src/
  gameplay/   definizioni livelli, layout e movimento
  scenes/     boot, menu, selezione, livelli, HUD, vittoria e game over
  main.ts     configurazione Phaser e bootstrap dell'app
  gameState.ts
  runtimeState.ts
  styles.css

tests/
  *.test.ts   test su movimento, layout e progressione
  helpers/    utilita di supporto per i test
```

## Architettura in breve

- [src/scenes/BootScene.ts](/D:/Andre/Documents/SuperPrincipesse/src/scenes/BootScene.ts) genera texture, spritesheet e animazioni direttamente via canvas.
- [src/scenes/CharacterSelectScene.ts](/D:/Andre/Documents/SuperPrincipesse/src/scenes/CharacterSelectScene.ts) gestisce selezione personaggio e quick start dei livelli.
- [src/scenes/HudScene.ts](/D:/Andre/Documents/SuperPrincipesse/src/scenes/HudScene.ts) aggiorna HUD, punteggio, vite e mondo corrente.
- [src/gameState.ts](/D:/Andre/Documents/SuperPrincipesse/src/gameState.ts) contiene roster personaggi e stato della run.
- [src/gameplay/levels.ts](/D:/Andre/Documents/SuperPrincipesse/src/gameplay/levels.ts) centralizza i 4 mondi e i relativi dati.

## Stato attuale

Il progetto e gia giocabile e contiene una pipeline volutamente leggera: non dipende da asset esterni per i personaggi principali, perche gran parte delle texture viene costruita a runtime. Questo rende il repository semplice da clonare, avviare e modificare.

## Qualita e verifica

Per controllare che tutto sia coerente prima di una release:

```bash
npm run check
```

Questo comando esegue i test e verifica anche la build di produzione.
