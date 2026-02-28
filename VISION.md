# Waypoint — Visie & Architectuur

> Laatste update: 28 februari 2026

---

## De kern

Dit is geen productiviteitsapp. Dit is een **karakterontwikkelingssysteem** — een levenscompagnon die jou over jaren leert kennen en je helpt worden wie je wilt zijn.

**Doel over 5 jaar:** Een compleet ander persoon. Iemand die zichzelf beter kent, leeft naar zijn waarden en principes, disciplineerd is, afspraken nakomt en vaardig is.

Het verschil met bestaande tools:
- Alle huidige tools zijn **passief** — jij stopt data in, zij bewaren het
- Dit systeem is **actief** — het begrijpt jou, initieert, verrast, bouwt op zichzelf voort

---

## De drie lagen

```
Laag 3 — Intelligentie
         Proactief, conversationeel, schrijft terug naar data

Laag 2 — Geen aparte laag
         getUserContext() en tool handlers zijn onderdeel van Laag 3

Laag 1 — Data (alle bronnen)
         Alles wat data produceert over jouw leven
```

---

## Laag 1 — Data

### Status

| Module | Status |
|--------|--------|
| Tasks | ✓ gebouwd |
| Habits | ✓ gebouwd |
| Goals | ✓ gebouwd |
| Notes | ✓ gebouwd |
| Calendar | ✓ gebouwd |
| Journal + Mood | ✓ gebouwd |
| Finance (YNAB-stijl) | ✓ gebouwd |
| People (relatie-CRM) | ✓ gebouwd |
| Apple Health | ✗ nog te bouwen |

### Externe/automatische bronnen (later)
- Bankdata (koppeling aan Finance module)
- Weer API (correlatie met energie/productiviteit)
- Screen time
- GitHub activiteit

---

## Laag 3 — Intelligentie

### Model & interface

- **Model:** Claude Sonnet 4.6
- **Interface:** In-app chat (geen externe kanalen)
- **Proactief:** Cron job 2x/dag (ochtend + avond). De AI beslist zelf of er iets de moeite waard is om te zeggen — en zwijgt wanneer er niets is. Dat maakt het betekenisvol als het wél iets zegt.

### Geheugen — drie lagen

**1. Gebruikersprofiel** — door jou geschreven, zelden veranderd
> "Ik ben Dion, 28. Ik wil over 5 jaar X zijn. Mijn waarden zijn Y."
Wordt gecached via Anthropic prompt caching.

**2. AI-geheugen** — door de AI zelf bijgehouden, groeit organisch
Na gesprekken schrijft de AI observaties terug naar de database:
> "Dion worstelt met gymmen op maandagen. Voelt zich goed na contact met mensen. Heeft de neiging meer te beloven dan hij aankan."
Dit is wat het systeem *leert* over jou over tijd.

**3. Actuele signalen** — vers berekend per call, compact
Niet alle ruwe data, maar: `overdue taken: 3, mood trend: dalend, 2 mensen verwaarloost`.
Database rekent, AI interpreteert.

**Elke AI-call krijgt:** profiel (gecached) + AI-geheugen + actuele signalen + recente gesprekshistorie.

### Tools — wat de AI kan doen

De AI heeft schrijftoegang tot modules via tool use. MVP-scope: Tasks en Calendar. Later uitbreiden naar alle modules.

**MVP:**
| Tool | Actie |
|------|-------|
| `list_tasks` | taken ophalen |
| `create_task` | taak aanmaken |
| `update_task` | taak bijwerken |
| `complete_task` | taak afronden |
| `delete_task` | taak verwijderen |
| `list_events` | kalendergebeurtenissen ophalen |
| `create_event` | event aanmaken |
| `update_event` | event bijwerken |
| `delete_event` | event verwijderen |
| `save_memory` | observatie opslaan in AI-geheugen |

**Later:**
Habits loggen, journal aanmaken, notitie toevoegen, persoon interactie loggen, follow-up aanmaken, transactie toevoegen.

### Technische principes

- **Gestructureerde data** (habits, tasks, goals) → nooit samenvatten, altijd vers berekenen vanuit database
- **Ongestructureerde data** (journal, notes) → later: embeddings voor semantisch zoeken
- **Database is het geheugen**, niet het model

### Proactief — hoe het voelt

Niet een notificatiesysteem dat op elk event reageert. De AI kijkt 2x per dag naar alles, en spreekt alleen op als het iets heeft dat de moeite waard is:

> "Je bent de afgelopen twee weken veel bezig met mensen — Lisa, je moeder, die nieuwe collega. Maar je doelen staan stil. Is dat een bewuste keuze of ben je het uit het oog verloren?"

---

## Bouwvolgorde

```
✓ Stap 1   Journal + Mood
✓ Stap 2   Finance (YNAB-stijl)
✓ Stap 3   People (relatie-CRM)
  Stap 4   Apple Health
           → Laag 1 compleet

  Stap 5   AI — fundament
             - Prisma: AiMessage, AiMemory, UserProfile tabellen
             - getUserContext() (compacte signalen)
             - Tool definitions + handlers (Tasks + Calendar)
             - System prompt builder (profiel + geheugen + signalen)

  Stap 6   AI — chat interface
             - Chat API route (streaming + tool use)
             - Chat UI in de app
             - Profiel pagina (simpele textarea)

  Stap 7   AI — proactief
             - Cron endpoint 2x/dag
             - Proactieve berichten in chat UI

  Stap 8   AI — uitbreiden
             - Meer tools (habits, journal, people, finance)
             - Embeddings voor journal/notes
             - Meer patronen in getUserContext()
```

---

## Wat het systeem over 5 jaar zegt

Niet: *"Je hebt 847 tasks afgerond."*

Maar: *"In 2024 was je iemand die veel beloofde maar moeite had om het vol te houden. Begin 2025 begon er iets te verschuiven — je commitments werden kleiner maar consistenter. Eind 2025 was er een kantelpunt: je ging van iemand die discipline nastreefde naar iemand die het gewoon was."*

Dat is het product.
