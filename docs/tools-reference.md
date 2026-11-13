# Tool-Referenz

Vollständige Referenz für alle neun PRIMAMCP-Tools — `legal_search`, `legal_lookup`, `legal_lookup_batch`, `legal_get_context`, `legal_find_citing_decisions`, `legal_get_materials`, `legal_list_laws`, `legal_get_toc`, `legal_get_stats`.

Alle Tools sind **batch-fähig**, **async** und liefern **typisierte Result-Objekte** mit Pagination-Feldern (`count`, `total`, `offset`, `has_more`, `next_offset`, `hint`).

## Discovery vs. Detail

Eine bewusste Designentscheidung: **Discovery-Tools** liefern kompakte Antworten (~4 k Token), damit das LLM viele davon in einer Session ausführen kann. **Detail-Tools** liefern vollen Text, weil sie dann wirklich gebraucht werden.

| Kategorie | Tools | Token-Budget |
| --- | --- | --- |
| **Discovery** | `legal_search`, `legal_list_laws`, `legal_get_toc`, `legal_get_stats` | ~4 k |
| **Detail** | `legal_lookup`, `legal_lookup_batch`, `legal_get_context`, `legal_find_citing_decisions`, `legal_get_materials` | Voller Text |

## Antwort-Konventionen

Alle Tools liefern ein frozen dataclass als JSON, mit folgenden Standardfeldern:

| Feld | Bedeutung |
| --- | --- |
| `count` | Anzahl Items in dieser Antwort |
| `total` | Gesamtanzahl (auch über Pagination hinaus) |
| `offset` | Aktuelles Offset |
| `has_more` | Boolean — gibt es weitere Seiten? |
| `next_offset` | Wert für den nächsten Call (wenn `has_more` true) |
| `hint` | Menschenlesbarer Tipp ans LLM („increase limit for broader results") |

Plus tool-spezifische Felder (`hits`, `norm`, `decisions`, `laws`, `toc`, `stats`).

## Fehler

PRIMAMCP liefert klar typisierte Fehler:

- **Ungültiges Zitat-Format** in `legal_lookup` / `legal_lookup_batch` → klare Fehlermeldung mit Hinweis auf akzeptierte Formate
- **Norm nicht im Index** → Tool gibt `{ "found": false, "citation": "..." }` zurück
- **Quota erreicht** → HTTP 429 mit `Retry-After`
- **Fair-Use-Limit (15–300 Anfragen/min je nach Tarif)** → HTTP 429 — kurz pausieren und neu probieren

---

## `legal_search`

**Hybrid-Suche** über alle Quellen — deutsches Bundes- und Landesrecht, EU-Recht, Bundes- und Landesgerichtsentscheidungen sowie Datenschutz-Guidance.

### Wann nutzen?

- Thematische Recherche („Welche Normen regeln Schmerzensgeld bei Persönlichkeitsverletzung?")
- Wenn die exakte Fundstelle unbekannt ist
- Als erster Schritt vor [`legal_lookup`](#legal_lookup), um die richtige Norm zu finden

Wenn du **bereits ein Zitat hast** (z. B. „§ 823 BGB"), nutze direkt [`legal_lookup`](#legal_lookup) — schneller, präziser, billiger.

→ [Wie PRIMAMCP sucht](architecture.md)

### Parameter

| Parameter | Typ | Default | Beschreibung |
| --- | --- | --- | --- |
| `query` | string | — | Natürlichsprachliche Suchanfrage |
| `limit` | int | 5 | Anzahl Treffer (1–50) |
| `source_type` | enum | — | Quelle, u. a. `gii` (Bundesrecht), `eurlex` (EU-Recht), `rechtsprechung` (Bundesgerichte), `bayern_gesetze` / `nrw_gesetze` (Landesrecht), `nrw_rechtsprechung` / `sachsen_rechtsprechung` (Landesgerichte), `bverfge` / `bverwg` (Leitentscheidungen bis 2009), `verwaltungsvorschriften`, `edsa` / `dsk` (Datenschutz-Guidance), `gesetzesmaterialien`. Volle Liste: `legal://filter_values` |
| `jurisdiction` | enum | — | `de` (gesamtes deutsches Recht), `eu`, `de_by` (Bayern), `de_sn` (Sachsen), `de_nw` (NRW) |
| `document_kind` | enum | — | `statute` / `regulation` / `directive` (Normtext — eine Filterklasse), `decision` (Rechtsprechung), `explanatory_memorandum` (Gesetzesmaterialien), `guidance` (Datenschutz-Guidance) |
| `law_abbreviation` | string | — | Abkürzung des Gesetzes (z. B. `bgb`, `dsgvo`) |
| `chapter` | string | — | Kapitel/Abschnitt innerhalb eines Gesetzes (selten nötig — kann Recall reduzieren) |
| `cited_norm` | string | — | Nur Entscheidungen, die diese Norm zitieren (z. B. `§ 573 BGB`, `Art. 6 DSGVO`) — mit fallspezifischer `query` kombinieren (siehe Tipps). Schränkt implizit auf Rechtsprechung ein |
| `court` | enum | — | Gericht, u. a. `BGH`, `BVerfG`, `BVerwG`, `BAG`, `BSG`, `BFH`, `BPatG`, `EuGH` / `EuG` sowie die Landesgerichte (`Sächsisches OVG`, `Oberverwaltungsgericht NRW`, OLG/LAG/FG/LSG/VerfGH NRW). Volle Liste: `legal://filter_values` |
| `decision_type` | enum | — | `Urteil` oder `Beschluss` |
| `language` | enum | `de` | `de` (gesamter Korpus) oder `en` (derzeit nur EDSA/EDPB-Guidance) |
| `date_from` | ISO date | — | Untergrenze (`YYYY-MM-DD`) |
| `date_to` | ISO date | — | Obergrenze |

Alle Filter sind **AND**-verknüpft.

### Beispiele

**Thematisch über alle Quellen:**

```json
{
  "tool": "legal_search",
  "arguments": {
    "query": "Schmerzensgeld bei Persönlichkeitsverletzung",
    "limit": 5
  }
}
```

Liefert wahrscheinlich §§ 823, 253 BGB plus einschlägige BGH-Entscheidungen — gemischter Treffer-Pool, gerankt nach Relevanz, nicht nach Quelltyp.

**Nur EU-Recht zur DSGVO-Drittlandübermittlung:**

```json
{
  "tool": "legal_search",
  "arguments": {
    "query": "Übermittlung personenbezogener Daten in Drittländer",
    "source_type": "eurlex",
    "limit": 10
  }
}
```

**Nur BGH-Urteile zu § 280 BGB seit 2022:**

```json
{
  "tool": "legal_search",
  "arguments": {
    "query": "Schadensersatz Pflichtverletzung 280 BGB",
    "source_type": "rechtsprechung",
    "court": "BGH",
    "decision_type": "Urteil",
    "date_from": "2022-01-01",
    "limit": 10
  }
}
```

### Antwort

```json
{
  "count": 5,
  "total": 142,
  "has_more": true,
  "hint": "Increase limit or apply filters to narrow results.",
  "hits": [
    {
      "norm_id": 123456,
      "citation": "§ 823 BGB",
      "title": "Schadensersatzpflicht",
      "snippet": "Wer vorsätzlich oder fahrlässig …",
      "law": {
        "abbreviation": "BGB",
        "title": "Bürgerliches Gesetzbuch"
      },
      "hierarchy": "Buch 2 — Recht der Schuldverhältnisse · Abschnitt 8 · Titel 27 — Unerlaubte Handlungen"
    }
  ]
}
```

`norm_id` ist stabil und kann direkt an [`legal_get_context`](#legal_get_context) übergeben werden. Für [`legal_lookup`](#legal_lookup) und [`legal_find_citing_decisions`](#legal_find_citing_decisions) wird stattdessen das Zitat aus `citation` verwendet.

### Tipps

- **Natürliche Sprache schlägt Keyword-Listen.** Schreib Sätze, keine Schlagwortketten. „Welche Pflichten hat ein Verkäufer bei Mängeln?" liefert bessere Treffer als „Mangelhaftung Verkäufer".
- **Nutze umgangssprachliche Synonyme.** PRIMAMCP kennt typische Confusions (`Cookie` → `Einwilligung Speicherung Informationen Endeinrichtung`, `Kündigung` → `Beendigung Arbeitsverhältnis`).
- **Filter zuerst.** Wenn du nur EU-Recht brauchst, setz `source_type=eurlex` — sauberere Treffer, schnellere Antwort.
- **Rechtsprechung zu einer konkreten Norm + Fallfrage: `cited_norm`.** `query="Eigenbedarfskündigung Härtefall hohes Alter"` + `cited_norm="§ 573 BGB"` liefert Entscheidungen, die die Norm anwenden *und* zum Sachverhalt passen — gerankt nach Relevanz. Für die reine Zitier-Liste einer Norm (neueste zuerst) ist [`legal_find_citing_decisions`](#legal_find_citing_decisions) der direkte Weg.

---

## `legal_lookup`

**Volltext einer einzelnen Norm per Zitat.** Direkter ID-basierter Lookup ohne Embedding/Reranking — schneller und präziser als [`legal_search`](#legal_search), wenn die Fundstelle bekannt ist.

### Wann nutzen?

- Zitat ist im Prompt bereits genannt: „Erkläre mir § 823 BGB"
- Aus einem `legal_search`-Hit das Volltext-Detail holen
- Aus einer Antwort eines anderen Tools (z. B. `legal_find_citing_decisions`) ein Zitat auflösen

### Akzeptierte Zitierformen

Der Citation-Parser von PRIMAMCP akzeptiert die in deutscher und EU-Rechtspraxis üblichen Formen:

| Form | Beispiel |
| --- | --- |
| Bundes-Paragraf | `§ 823 BGB`, `§ 1 Abs. 1 GG`, `§ 280 Abs. 1 Satz 1 BGB` |
| EU-Artikel | `Art. 6 DSGVO`, `Art. 6 Abs. 1 lit. a DSGVO`, `Art. 5 Abs. 1 EU 2024/1689` |
| EuGH-Verfahren | `C-311/18`, `T-451/20` |
| Bundes-Gerichts-Aktenzeichen | `BGH VI ZR 175/22`, `BVerfG 1 BvR 16/13` |

### Parameter

| Parameter | Typ | Default | Beschreibung |
| --- | --- | --- | --- |
| `citation` | string | — | Zitat in einer der oben genannten Formen |

Der Parameter `citation` ist der **einzige** Eingabeparameter — alles andere wird vom Parser inferiert.

### Beispiele

**Klassischer BGB-Lookup:**

```json
{
  "tool": "legal_lookup",
  "arguments": { "citation": "§ 823 BGB" }
}
```

**Bestimmter Absatz und Satz:**

```json
{
  "tool": "legal_lookup",
  "arguments": { "citation": "§ 280 Abs. 1 Satz 1 BGB" }
}
```

Liefert nur den genau zitierten Satz mit Hierarchie-Pfad — perfekt für präzise Zitation in einem LLM-Output.

**EU-Artikel mit Buchstabe:**

```json
{
  "tool": "legal_lookup",
  "arguments": { "citation": "Art. 6 Abs. 1 lit. a DSGVO" }
}
```

**EuGH-Entscheidung:**

```json
{
  "tool": "legal_lookup",
  "arguments": { "citation": "C-311/18" }
}
```

Schrems II. Liefert die Entscheidung im Volltext mit Randnummern und Tenor.

### Antwort

```json
{
  "norm": {
    "norm_id": 123456,
    "citation": "§ 823 BGB",
    "title": "Schadensersatzpflicht",
    "content": "(1) Wer vorsätzlich oder fahrlässig das Leben, den Körper, …",
    "law": {
      "abbreviation": "BGB",
      "title": "Bürgerliches Gesetzbuch",
      "jurisdiction": "de",
      "version_date": "2024-10-01",
      "is_current": true
    },
    "hierarchy": {
      "buch": "Buch 2 — Recht der Schuldverhältnisse",
      "abschnitt": "Abschnitt 8",
      "titel": "Titel 27 — Unerlaubte Handlungen"
    },
    "source_url": "https://...amtliche-quelle.../...",
    "last_changed": "2002-01-02"
  },
  "hint": "Use legal_get_context to retrieve neighbouring norms (§§ 821–826)."
}
```

### Fehlerfälle

| Fehler | Bedeutung | Reaktion |
| --- | --- | --- |
| `INVALID_CITATION` | Zitat nicht parsbar | Format prüfen — gültige Formen siehe oben |
| `NORM_NOT_FOUND` | Zitat parsbar, aber nicht im Index | Tippfehler? Mit `legal_search` alternative Formulierung versuchen |
| `LAW_NOT_FOUND` | Gesetz unbekannt | `legal_list_laws` aufrufen, um die korrekte Abkürzung zu finden |

### Tipps

- **Klartext statt Sonderzeichen.** Sowohl `§ 823 BGB` als auch `Paragraf 823 BGB` und `823 BGB` funktionieren — der Parser ist tolerant.
- **Bei mehreren Lookups: `legal_lookup_batch`.** Wenn das LLM 5+ Normen gleichzeitig braucht, ist der Batch-Endpoint deutlich effizienter (1 statt 5 Tool-Roundtrips).
- **Folgeaktion: `legal_get_context`.** Nach einem Lookup oft sinnvoll: die umgebenden Normen mitnehmen, um Auslegungs-Kontext zu liefern.
- **Folgeaktion: `legal_find_citing_decisions`.** Was sagt der BGH zu § 823? Ein zweiter Tool-Call genügt.

---

## `legal_lookup_batch`

**Bis zu 20 Lookups in einem Call.** Spart Tool-Use-Roundtrips, wenn das LLM mehrere Normen gleichzeitig braucht (z. B. „die fünf einschlägigen DSGVO-Artikel zur Drittlandübermittlung").

### Parameter

| Parameter | Typ | Default | Beschreibung |
| --- | --- | --- | --- |
| `citations` | string[] | — | Liste von 1–20 Zitaten (gleiche Formen wie `legal_lookup`) |

### Beispiel

```json
{
  "tool": "legal_lookup_batch",
  "arguments": {
    "citations": [
      "Art. 44 DSGVO",
      "Art. 45 DSGVO",
      "Art. 46 DSGVO",
      "Art. 49 DSGVO"
    ]
  }
}
```

### Antwort

Liste von Norm-Objekten in der gleichen Reihenfolge wie die Eingabe-Zitate. Nicht-gefundene Zitate sind als `{ "found": false, "citation": "..." }` markiert — der Batch bricht nicht ab.

---

## `legal_get_context`

**Liefert die Normen vor und nach einer Fundstelle.** Wichtig, weil Recht selten in Einzelnormen verstanden wird — Schadensersatz aus § 823 BGB ergibt sich erst im Kontext der §§ 821–826 (deliktische Haftung).

### Wann nutzen?

- Nach einem `legal_search` für interpretativen Kontext (die `norm_id` aus dem Treffer wiederverwenden)
- Wenn das LLM die Position einer Norm im Gesetz verstehen soll
- Bei Querverweisen („siehe § 280 BGB" → drei Normen davor und danach mitliefern)

### Parameter

| Parameter | Typ | Default | Beschreibung |
| --- | --- | --- | --- |
| `norm_id` | int | — | Stabile Norm-ID aus einem vorherigen `legal_search`-Treffer |
| `before` | int | 2 | Anzahl Normen vor der Fundstelle (0–10) |
| `after` | int | 2 | Anzahl Normen nach der Fundstelle (0–10) |

### Beispiel

```json
{
  "tool": "legal_get_context",
  "arguments": {
    "norm_id": 123456,
    "before": 2,
    "after": 3
  }
}
```

Liefert die zwei Normen vor und drei Normen nach der angegebenen Fundstelle, mit voller Hierarchie und Volltext.

### Tipps

- **Spar dir die einzelnen Lookups.** Statt fünf einzelne `legal_lookup`-Calls zu machen, ist `legal_get_context` mit `before=2, after=2` ein einzelner Call mit identischem Output.
- **Nutze für „siehe auch"-Bezüge.** Wenn ein Gesetzestext „siehe § 826" sagt, kann das LLM mit `legal_get_context` automatisch den Kontext einbinden.
- **Resource-Alternative.** `legal://norm/{norm_id}` liefert die Einzelnorm als Resource — sinnvoll bei Clients, die Resources besser einbinden als Tool-Outputs.

---

## `legal_find_citing_decisions`

**Reverse-Lookup**: Welche Bundesgerichtsentscheidungen zitieren eine konkrete Norm? Beantwortet die zentrale juristische Frage „Wie hat der BGH § 280 BGB ausgelegt?" — die `legal_search` allein nicht direkt beantwortet, weil sie ranking-, nicht zitierungs-orientiert sucht.

### Wann nutzen?

- Auslegungspraxis zu einer Norm einsehen
- Aktuelle Rechtsprechung zu einer Compliance-Frage finden
- Prüfen, ob eine Norm überhaupt jemals höchstrichterlich behandelt wurde

### Parameter

| Parameter | Typ | Default | Beschreibung |
| --- | --- | --- | --- |
| `cited_norm` | string | — | Zitat der Norm (z. B. `§ 823 BGB`, `Art. 6 DSGVO`) |
| `limit` | int | 10 | Maximalzahl der Treffer (1–100) |

### Beispiel

```json
{
  "tool": "legal_find_citing_decisions",
  "arguments": {
    "cited_norm": "§ 280 BGB",
    "limit": 5
  }
}
```

### Antwort

```json
{
  "count": 5,
  "decisions": [
    {
      "court": "BGH",
      "case_number": "VI ZR 175/22",
      "decision_date": "2023-05-15",
      "title": "Schadensersatzanspruch wegen Verletzung des allgemeinen Persönlichkeitsrechts",
      "snippet": "Die Pflichtverletzung im Sinne des § 280 Abs. 1 BGB …",
      "cited_norms": ["§ 280 BGB", "§ 823 BGB", "Art. 2 GG"]
    }
  ]
}
```

### Tipps

- **Kombiniere mit `legal_get_context`.** Erst die Norm + Kontext lesen (über `legal_search` + `legal_get_context`), dann die zitierende Rechtsprechung holen — das LLM kann so eine vollständige juristische Auswertung erstellen.

---

## `legal_get_materials`

**Amtliche Gesetzesbegründung zu einer Norm** — die Begründungsabschnitte aus der Bundestags-Drucksache, in der die Norm eingeführt oder geändert wurde. Quelle der **genetischen/historischen Auslegung**: *Was wollte der Gesetzgeber?*

### Wann nutzen?

- Wenn es auf den **Zweck** einer Norm ankommt (ratio legis — „warum gibt es diese Regel?")
- Bedeutung eines unklaren oder undefinierten Begriffs
- Ob eine Regelungslücke planwidrig ist (begründet eine Analogie) oder bewusstes Schweigen (begründet einen Umkehrschluss)
- Was eine konkrete Änderung bezwecken sollte

Komplementär zu [`legal_find_citing_decisions`](#legal_find_citing_decisions) (*wie Gerichte* eine Norm anwenden) — hier geht es um die *Absicht des Gesetzgebers* dahinter.

### Parameter

| Parameter | Typ | Default | Beschreibung |
| --- | --- | --- | --- |
| `citation` | string | — | Norm wie `§ 823 BGB`, `Art. 87a GG` |
| `limit` | int | 10 | Maximalzahl Begründungs-Abschnitte (1–50) |

### Beispiel

```json
{
  "tool": "legal_get_materials",
  "arguments": { "citation": "§ 823 BGB" }
}
```

### Antwort

Begründungs-Abschnitte, neueste zuerst — jeweils mit `BT-Drs.`-Fundstelle, dem Begründungstext und den weiteren Normen, die dieselbe Änderung betraf (`target_norm_keys`).

### Hinweise

- **Nur deutsches Bundesrecht** (`gesetze-im-internet`-Korpus), Änderungen seit 1949. Eine unbekannte oder nicht-deutsche Norm liefert keine Materialien.
- **Gewicht:** Die Begründung ist starkes Indiz für den gesetzgeberischen Willen, aber nicht bindend — der Wortlaut bleibt die äußere Grenze jeder Auslegung.
- **Opt-in:** Eine ungefilterte `legal_search` liefert nie Materialien; für eine konkrete Norm ist dies der direkte Weg.

---

## `legal_list_laws`

**Listet alle indizierten Gesetze.** Discovery-Tool für die Frage „Was ist überhaupt drin?" — z. B. wenn das LLM unsicher ist, ob die zitierte Spezialnorm Teil des PRIMAMCP-Index ist.

### Wann nutzen?

- Vor einem `legal_lookup`, wenn die Abkürzung unsicher ist
- Beim Onboarding eines Bots, um den verfügbaren Korpus zu kennen

### Parameter

| Parameter | Typ | Default | Beschreibung |
| --- | --- | --- | --- |
| `source_type` | enum | — | Quelle, u. a. `gii`, `eurlex`, `rechtsprechung`, `bayern_gesetze`, `nrw_gesetze`, `verwaltungsvorschriften` … — volle Liste: `legal://filter_values` |
| `query` | string | — | Case-insensitive Suche über Abkürzung und Titel (z. B. `bgb`, `datenschutz`) |
| `limit` | int | 50 | Maximalzahl Treffer pro Seite (1–500) |
| `offset` | int | 0 | Pagination-Offset |

> Mindestens `source_type` oder `search` setzen — der ungefilterte Abruf liefert tausende Einträge und ist für Tool-Use-Loops zu groß.

### Beispiele

**Alle EU-Verordnungen:**

```json
{
  "tool": "legal_list_laws",
  "arguments": {
    "source_type": "eurlex",
    "limit": 100
  }
}
```

**Suche nach „Daten":**

```json
{
  "tool": "legal_list_laws",
  "arguments": {
    "query": "Daten"
  }
}
```

Liefert DSGVO, BDSG, TTDSG und weitere.

### Antwort

```json
{
  "count": 50,
  "total": 11247,
  "has_more": true,
  "next_offset": 50,
  "laws": [
    {
      "abbreviation": "BGB",
      "title": "Bürgerliches Gesetzbuch",
      "source_type": "gii",
      "version_date": "2024-10-01"
    }
  ]
}
```

### Tipps

- **`offset` für Pagination.** Bei großen Treffermengen den `next_offset`-Wert übernehmen — `has_more` zeigt, ob noch Seiten kommen.
- **Resource-Alternative.** `legal://eu_celex_registry` liefert kuratierte EU-Rechtsakte mit CELEX-IDs als statische Resource (kein Quota-Verbrauch).

---

## `legal_get_toc`

**Liefert das Inhaltsverzeichnis eines Gesetzes** mit Norm-Schlüsseln (`§ 1`, `Art. 3`), Titeln und Kapitel-Überschriften in Dokumenten-Reihenfolge.

### Wann nutzen?

- Bevor das LLM den Volltext einzelner Normen lädt
- Wenn der Anwender sich „durch das Gesetz klicken" möchte
- Für strukturelle Recherche („Was steht alles in Buch 5 BGB — Erbrecht?")

### Parameter

| Parameter | Typ | Default | Beschreibung |
| --- | --- | --- | --- |
| `law_abbreviation` | string | — | Abkürzung des Gesetzes (z. B. `bgb`, `dsgvo`, `stgb`) |
| `source_type` | enum | — | Optional, volle Liste siehe `legal://filter_values`. Leer = Auto-Detect |
| `offset` | int | 0 | Pagination-Offset |
| `limit` | int | 100 | Maximalzahl Einträge pro Seite (1–500) |

### Beispiel

```json
{
  "tool": "legal_get_toc",
  "arguments": {
    "law_abbreviation": "bgb",
    "limit": 100
  }
}
```

Antwort enthält Norm-Schlüssel, Titel und Hierarchie pro Eintrag — das LLM kann mit der zurückgegebenen `norm_id` direkt `legal_get_context` aufrufen, um den Volltext einer ausgewählten Norm zu lesen.

### Tipps

- **Pagination nutzen.** Große Gesetze wie das BGB haben über 2000 Einträge — kombiniere `offset` und `limit` für saubere Slices.
- **Resource-Alternative.** `legal://law/{source_type}/{abbreviation}` liefert dasselbe als Resource Template (zählt aufs Quota wie ein Tool-Call).

---

## `legal_get_stats`

**Liefert Index- und Datenbankstatistiken** — Anzahl indexierter Gesetze, Normen, Bundesgerichts­entscheidungen und letzter Update-Zeitpunkt.

### Wann nutzen?

- Bots, die ihren Datenstand transparent machen wollen („Stand: PRIMAMCP 2026-04-29, X Gesetze")
- Coverage-Reports für Compliance-Audits
- Health-Checks in Monitoring-Pipelines

### Parameter

Keine — der Stats-Endpoint nimmt keine Argumente.

### Antwort (Beispiel)

```json
{
  "stats": {
    "law_count": 11247,
    "norm_count": 6234891,
    "decision_count": 142883,
    "last_ingest_run": "2026-04-29T01:32:14Z",
    "by_jurisdiction": {
      "de": 9874,
      "eu": 1186
    },
    "by_source_type": {
      "gii": 9874,
      "eurlex": 1186,
      "rechtsprechung": 142883
    }
  }
}
```

### Tipps

- **Cache es im Bot.** Der Datenstand ändert sich nur einmal pro Nacht — ein Bot kann den Stats-Wert für 24 h cachen, statt vor jedem Antwort-Render erneut abzufragen.
