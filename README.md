# Claude Code Workshop — Startapp

En tom React + Vite + TypeScript-app med Tailwind CSS. Dette er lerretet ditt.

## Kom i gang

```bash
# 1. Installer avhengigheter
npm install

# 2. Start dev-serveren
npm run dev

# 3. Åpne et nytt terminalvindu og start Claude Code
claude
```

---

## Din oppgave

Bygg et **nettleserbasert spill som bruker et åpent API** — ved hjelp av **kun Claude Code**.

Du velger selv hvilket spill og hvilket API du vil bruke. Her er noen forslag til kombinasjoner som fungerer godt:

### 🎮 Høyere eller lavere — Pokémon
Bruk **PokeAPI** (`https://pokeapi.co`) — ingen API-nøkkel nødvendig.
- Vis to tilfeldige Pokémon med bilde og navn
- Spilleren gjetter hvilken som har høyest base stats totalt
- Vis fasiten etter hvert valg med poengsum

### 🌍 Gjett landet
Bruk **REST Countries** (`https://restcountries.com`) — ingen API-nøkkel nødvendig.
- Vis et flagg eller en silhuett
- Spilleren gjetter landet blant flere alternativer
- Hold styr på poengsum og antall runder

### 🍹 Cocktail-quiz
Bruk **TheCocktailDB** (`https://www.thecocktaildb.com/api.php`) — ingen API-nøkkel nødvendig.
- Vis ingrediensene til en tilfeldig cocktail
- Spilleren gjetter hva drinken heter
- Vis bilde og oppskrift når svaret avsløres

### 🚀 Vil du bruke et annet API?
Bare kjør på. Andre frie APIer uten nøkkel:
- **Open Meteo** — værdata
- **DiceBear** — genererte avatarer
- **NASA APOD** — astronomibilde fra NASA (krever gratis nøkkel)

---

## Slik prompter du effektivt

**Vær konkret, ikke generell.**

| Svak prompt | Sterk prompt |
|---|---|
| "Lag spillet" | "Hent to tilfeldige Pokémon fra PokeAPI og vis dem side om side med bilde og navn. Legg til en knapp for 'Høyere' og 'Lavere'." |
| "Gjør det penere" | "Gjør bakgrunnen mørkegrå og kortene hvite med avrundede hjørner og en subtil skygge" |
| "Det funker ikke" | "Bildene fra API-et lastes ikke. Konsollen viser CORS-feil på denne URL-en: [lim inn URL]" |

**Andre tips:**
- Lim inn feilmeldinger direkte fra terminalen eller nettleserkonsollen — ikke omformuler dem
- Bygg én ting av gangen. Få API-kallet til å fungere og vise data før du legger til spillogikk
- Vil du ha animasjoner, lyd, highscore eller en morsom personlighet? Bare spør — men få kjernen til å virke først

---

## Regler

- **Claude Code skriver koden — du skriver promptene.** Ikke rediger filer manuelt, det er hele poenget med øvelsen.
- **Ikke se på nettleseren underveis.** Du skal stole på at beskrivelsene dine er presise nok — det er det du trener på.
- **Ikke spør om du "har lov" til noe.** Lyd, animasjoner, fargetema, morsom personlighet — bare kjør på.

Dere har **1 time**. Suksess er ikke et ferdig spill — det er at du har lært å kommunisere presist med et AI-verktøy.

Lykke til. 🚀
