# Matte-Memory

Memory med matte för förskoleklass och lågstadiet. Barnet vänder kort och letar par: en siffra
och rätt antal frukter, en siffra och talordet, eller en addition och dess summa.

**Spela:** https://mattememory.skolappar.com · En del av [Skolappar](https://www.skolappar.com) – pedagogiska appar av föräldrar · öppen källkod (MIT)

Började som ett Lovable-projekt och körs nu fristående.

## Vad du kan göra

- **Tre spellägen**:
  - *Antal* – para ihop siffran med rätt antal frukter (aldrig fler än tio att räkna).
  - *Taltvilling* – para ihop siffran med ordet, till exempel 7 och "sju".
  - *Addition* – para ihop en addition som `3+4` med summan.
- **Tre nivåer**: Lätt (3 par, tal upp till 5), Medium (6 par, upp till 10) och Svår
  (8 par, upp till 20).
- **Stjärnor**: upp till tre per nivå beroende på hur få försök du behöver. Bästa resultatet
  sparas.
- **Temamärken** (Havet, Rymden, Regnbåge) låses upp med stjärnor och visas på startsidan.
- En räv som maskot peppar under spelet, konfetti när du vinner och ljud som går att stänga av.

## Kom igång

```bash
npm install
npm run dev        # utvecklingsserver
npm run build      # produktionsbygge till dist/
npm run build:dev  # bygge i utvecklingsläge
npm run preview    # förhandsgranska bygget
npm run lint       # eslint
```

Docker-bygget använder Node 22.

## Docker

```bash
docker build -t mattememory .
docker run --rm -p 8080:8080 mattememory
```

Servern ligger bakom nginx med `deploy/nginx.conf`.

## Integritet

- Ingen spårning, inga kakor, ingen analys, inget konto, ingen AI, inga nätverksanrop.
- Typsnittet Fredoka ligger i appen (`public/fonts/`).
- Det som sparas ligger i `localStorage`:
  - `matte-memory-progress` – stjärnor, bästa försök och upplåsta teman
  - `matte-memory-sound` – om ljudet är på eller av

  Rensa webbläsardata så är det borta.

## Struktur

```
src/
  pages/Index.tsx                 startsida: välj spelläge, se stjärnor och teman
  pages/GamePage.tsx              spelet på /spela/:mode
  lib/gameUtils.ts                kortpar, nivåer och stjärnregler
  hooks/useGameProgress.ts        progress i localStorage
  hooks/useSound.ts               ljudeffekter
  components/game/GameBoard.tsx   kortlek och vändlogik
  components/game/MemoryCard.tsx  ett kort
  components/game/Mascot.tsx      räven som peppar
  components/game/WinModal.tsx    vinstrutan med stjärnor
deploy/nginx.conf                 nginx-konfiguration för Docker
```

## Licens

MIT – se [LICENSE](LICENSE).
