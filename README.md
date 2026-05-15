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

Velg én av følgende og bygg den ved hjelp av **kun Claude Code**:

### 🎮 Tre på rad
- 2 spillere, samme skjerm (ikke mot AI)
- Tydelig markering av hvem sin tur det er
- Detekterer vinner og uavgjort, og viser det tydelig
- Knapp for å starte ny runde uten å laste siden på nytt

### ✌️ Stein saks papir
- Spiller mot datamaskinen (tilfeldig valg)
- Viser hva begge valgte etter hvert runde
- Holder styr på poengsum over flere runder
- Knapp for å nullstille poengsummen

### 🃏 Memory kortspill
- Minst 8 kortpar (16 kort totalt)
- Kort skal ligge med baksiden opp og snus ved klikk
- Par som matches forblir snudd, feilmatch snus tilbake
- Viser antall forsøk og gir beskjed når alle par er funnet

---

## Slik prompter du effektivt

**Vær konkret, ikke generell.**

| Svak prompt | Sterk prompt |
|---|---|
| "Lag spillet" | "Lag et 4x4 grid med 16 kort. Hvert kort skal ha en emoji på fremsiden og være mørkeblå på baksiden." |
| "Gjør det penere" | "Gjør bakgrunnen mørkegrå og kortene hvite med avrundede hjørner og en subtil skygge" |
| "Det funker ikke" | "Når jeg klikker to kort som ikke matcher, forblir de snudd. De skal snus tilbake etter 1 sekund." |

**Andre tips:**
- Lim inn feilmeldinger direkte fra terminalen eller nettleserkonsollen — ikke omformuler dem
- Bygg én ting av gangen. Få brettet til å vises før du legger til logikk
- Vil du ha animasjoner, lyd eller en scoreboard? Bare spør — men få kjernen til å virke først

---

## Regler

- **Claude Code skriver koden — du skriver promptene.** Ikke rediger filer manuelt, det er hele poenget med øvelsen.
- **Ikke se på nettleseren underveis.** Du skal stole på at beskrivelsene dine er presise nok — det er det du trener på.
- **Ikke spør om du "har lov" til noe.** Lyd, animasjoner, fargetema, morsom personlighet — bare kjør på.

Dere har **1 time**. Suksess er ikke et ferdig spill — det er at du har lært å kommunisere presist med et AI-verktøy.

Lykke til. 🚀
