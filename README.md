# PASI-kalkylator

En webbapp där en sjuksköterska räknar ut PASI (Psoriasis Area and Severity Index).
All beräkning sker i webbläsaren. Inga uppgifter sparas eller skickas. Det enda undantaget
är nyckeln `pasi:lastSeenVersion` i localStorage, som styr nyhetsnotisen.

## Kom igång

```bash
npm install
npm run dev       # utvecklingsserver
npm test          # Vitest + Testing Library
npm run build     # typkontroll + statisk build i dist/
npm run preview   # förhandsgranska builden (med service worker)
```

## Struktur

- `src/pasi/` – datamodell och ren beräkningsfunktion (`calc.ts`)
- `src/state/` – formulärets state (bara i minnet, ligger ovanför routern)
- `src/components/`, `src/views/` – UI (CSS Modules + design tokens i `src/styles/global.css`)
- `src/updates/` – notis om ny version (service worker) och nyhetsnotis efter uppdatering
- `src/changelog.ts` – ändringsloggen

## Släppa en ny version

1. Höj `version` i `package.json` (semver).
2. Lägg till en post överst i `src/changelog.ts` med samma version. Ange användarvänliga
   punkter på svenska, eller en tom lista för en ren bugfix (då visas ingen nyhetsnotis).
3. Committa och pusha. Vercel bygger och deployar automatiskt.

## Deploy

Vercel identifierar Vite automatiskt (build: `npm run build`, output: `dist`).
Appen använder HashRouter och behöver därför inga omskrivningsregler.
