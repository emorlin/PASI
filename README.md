# PASI-kalkylator

En webbapp där en sjuksköterska räknar ut PASI (Psoriasis Area and Severity Index).
All beräkning sker i webbläsaren. Inga uppgifter sparas eller skickas. Det enda undantaget
är nyckeln `pasi:lastSeenVersion` i localStorage, som styr nyhetsnotisen.

## Regioner

| Region | Omfattar | Andel av kroppsytan | 1 handflata |
| ------ | -------- | ------------------- | ----------- |
| Huvud | Huvud med nacke, hals | 10 % | 10 % |
| Bål | Bål med ljumskar, axiller, underliv | 30 % | 3,3 % |
| Armar | Armar (minus armhålor) | 20 % | 5 % |
| Ben | Ben med skinkor | 40 % | 2,5 % |

Utbredning (A) anges som poäng 0–6, där 0 betyder ingen utbredning.

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
