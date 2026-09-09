<div align="center">

<a href="https://mcp.planitprima.com">
  <img alt="PRIMAMCP — Verifizierter, zitierfähiger Rechtskontext für jeden KI-Assistenten" src="public/cover.png" />
</a>

# PRIMAMCP — Deutsches & EU-Recht für jeden KI-Assistenten

**Verifizierter, zitierfähiger Rechtskontext via [Model Context Protocol](https://modelcontextprotocol.io).**
Claude · ChatGPT · Cursor · Copilot · jeder MCP-fähige Client.

[![Website](https://img.shields.io/badge/website-mcp.planitprima.com-0a7c3e?style=flat-square)](https://mcp.planitprima.com)
[![NPM](https://img.shields.io/npm/v/@planit-tech/primamcp?style=flat-square&logo=npm)](https://www.npmjs.com/package/@planit-tech/primamcp)
[![MCP](https://img.shields.io/badge/protocol-MCP-8a2be2?style=flat-square)](https://modelcontextprotocol.io)
[![GDPR](https://img.shields.io/badge/compliance-GDPR-005bbb?style=flat-square)](https://mcp.planitprima.com/datenschutz)
[![Made in Germany](https://img.shields.io/badge/hosting-Germany%20%F0%9F%87%A9%F0%9F%87%AA-000000?style=flat-square)](https://mcp.planitprima.com/datenschutz)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow?style=flat-square)](LICENSE)
[![Listed on mcpservers.org](https://mcpservers.org/badge.svg)](https://mcpservers.org/servers/mcp-planitprima-com-docs)

[**Quickstart**](#-quickstart-in-60-sekunden) · [**Tools**](#-tools) · [**Skills & Rules**](#-skills--rules) · [**Coverage**](#-was-primamcp-abdeckt) · [**English**](i18n/README.en.md)

</div>

---

## KI halluziniert bei Rechtsfragen. PRIMAMCP liefert die Fakten.

**Ohne PRIMAMCP:**

> ❌ "§ 823a BGB regelt die Haftung bei Schmerzensgeld …" *(diesen Paragrafen gibt es nicht)*
> ❌ "Art. 9 DSGVO erlaubt die Verarbeitung mit Einwilligung — Stand 2023" *(Trainings-Cutoff, ggf. veraltet)*
> ❌ "Der BGH entschied in VI ZR 999/22 …" *(ausgedachtes Aktenzeichen)*

**Mit PRIMAMCP:**

> ✅ `§ 253 Abs. 2 BGB` — Volltext, Stand 2024-10-01, Direkt-URL zur amtlichen Quelle
> ✅ `Art. 9 Abs. 2 lit. a DSGVO` — Volltext mit Hierarchie-Pfad
> ✅ `BGH VI ZR 175/22` vom 2023-05-15 — Tenor + zitierte Normen

PRIMAMCP ist ein **produktionsreifer MCP-Server**, der KI-Assistenten verifizierten Zugriff auf das deutsche und europäische Recht gibt — täglich aktualisiert aus amtlichen Quellen, durchsuchbar mit dreistufiger Hybrid-Suche, jeder Treffer mit exakter Fundstelle. Stand: **MRR@10 = 0,676** auf dem öffentlichen [GerLeRB-Benchmark](docs/benchmarks.md).

---

## ⚡ Quickstart in 60 Sekunden

**Endpunkt:** `https://mcp.planitprima.com/mcp` (Streamable HTTP, Bearer-Auth oder OAuth 2.1)

```bash
# Variante 1 — npx-Setup (alle Clients, einfachster Weg)
npx -y @planit-tech/primamcp setup --client claude
# unterstützt: claude | cursor | vscode | windsurf

# Variante 2 — manueller Eintrag (siehe Client-Sektionen unten)
```

**API-Key holen:** [mcp.planitprima.com](https://mcp.planitprima.com) → 14 Tage kostenlos testen, keine Kreditkarte. Klartext erscheint **genau einmal** beim Erstellen — direkt in den Client kopieren.

---

## 🔧 Setup pro Client

<details>
<summary><b>Claude Desktop</b> (macOS / Windows / Linux)</summary>

**Config-Datei:**

| Plattform | Pfad |
| --- | --- |
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

**Eintrag:**

```json
{
  "mcpServers": {
    "primamcp": {
      "type": "http",
      "url": "https://mcp.planitprima.com/mcp",
      "headers": {
        "Authorization": "Bearer sk-legal-DEIN-API-KEY"
      }
    }
  }
}
```

Claude Desktop **vollständig beenden** (Quit, nicht nur Fenster schließen) und neu öffnen. Das MCP-Icon zeigt jetzt **PRIMAMCP** mit neun Tools.

**Test-Prompt:** *„Was sind die Voraussetzungen für eine Schmerzensgeldforderung nach § 253 BGB? Bitte mit Quellenangabe."*

**Troubleshooting:**
- *PRIMAMCP erscheint nicht* → JSON-Syntax prüfen mit `python -m json.tool < claude_desktop_config.json`. Häufiger Fehler: fehlendes Komma zwischen mehreren Servern.
- *401 Unauthorized* → Token-Prefix `sk-legal-` korrekt? Subscription aktiv?
- *429 Rate-Limit* → 15–300 Anfragen/Minute pro Seat, je nach Tarif. Lange Recherche-Sessions können das treffen — kurz pausieren, größeren Tarif oder zweiten Seat zubuchen.

</details>

<details>
<summary><b>Cursor</b> (Composer / Agent)</summary>

**Ein-Klick-Install:**

[**🖱️ Add PRIMAMCP to Cursor**](https://cursor.com/install-mcp?name=primamcp&config=eyJ1cmwiOiJodHRwczovL21jcC5wbGFuaXRwcmltYS5jb20vbWNwIiwiaGVhZGVycyI6eyJBdXRob3JpemF0aW9uIjoiQmVhcmVyIFlPVVJfUFJJTUFNQ1BfQVBJX0tFWSJ9fQ)

Nach Klick: API-Key (`sk-legal-…`) im Cursor-Config-Editor anstelle von `YOUR_PRIMAMCP_API_KEY` eintragen.

**Manuell:** `.cursor/mcp.json` im Projekt-Root oder `~/.cursor/mcp.json` global:

```json
{
  "mcpServers": {
    "primamcp": {
      "type": "http",
      "url": "https://mcp.planitprima.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:PRIMAMCP_TOKEN}"
      }
    }
  }
}
```

**Wichtig:** Token nie ins Repo committen — `.cursor/mcp.json` in `.gitignore`, oder Token via Umgebungsvariable beziehen (siehe Snippet oben).

**Anwendungsfälle:**
- **AGB-Generierung** mit echten BGB-Klauseln (§§ 305–310, § 309 Nr. 7)
- **DSGVO-Compliance-Check** beim Schreiben von Datenverarbeitungs-Code (Art. 6, Art. 9 DSGVO)
- **KI-VO-Risikoklassifikation** beim Bau von ML-Pipelines

→ Empfohlen: [Cursor-Rule kopieren](rules/cursor.md), damit Cursor PRIMAMCP automatisch bei rechtlichen Fragen nutzt.

</details>

<details>
<summary><b>ChatGPT</b> (Pro / Team / Enterprise) und <b>Claude.ai</b> (Web)</summary>

Browser-Clients sprechen MCP nativ über **OAuth 2.1** — kein Code, kein Klartext-Token im Browser-Storage.

**ChatGPT:**

1. **Settings** → **Connectors** → **Add custom connector**
2. **Name:** `PRIMAMCP`
3. **MCP Server URL:** `https://mcp.planitprima.com/mcp`
4. **Authentication:** *OAuth*
5. **Save** → Browser-Tab → PRIMAMCP-Login → **Allow**
6. Im Chat: **Tools**-Dropdown → **PRIMAMCP** aktivieren

**Claude.ai:**

1. **Settings** → **Connectors** → **Add custom**
2. **Name:** `PRIMAMCP`
3. **Remote MCP server URL:** `https://mcp.planitprima.com/mcp`
4. **Sign in** → PRIMAMCP-Login → **Allow**
5. Im Chat: **Tools-Icon** → PRIMAMCP aktivieren

> 💡 Claude.ai unterstützt auch **MCP Resources** — `legal://rechtsrahmen` und Co. erscheinen als attachable references im Chat.

**Seats und OAuth:** Jedes OAuth-Subject = **ein Seat** (selbe `subject_id`, auch wenn du es in beiden Clients nutzt).

**Custom-GPT-System-Prompt:** Wenn du einen Custom-GPT mit PRIMAMCP baust, kopiere den vorgefertigten [System-Prompt](prompts/chatgpt-custom-gpt.md) — er erzwingt Tool-Nutzung und Citation-Pflicht.

</details>

<details>
<summary><b>Copilot Studio</b> (Microsoft 365 / Power Platform / Teams)</summary>

Copilot Studio unterstützt MCP-Server als „Custom Connectors" und zieht — anders als viele andere Clients — **auch Resources**, was für PRIMAMCP (`legal://rechtsrahmen`, `legal://eu_celex_registry`) besonders wertvoll ist.

**Pfad A — OAuth (empfohlen):**

1. **Tools** → **Add a tool** → **New tool** → **Model Context Protocol**
2. **Server URL:** `https://mcp.planitprima.com/mcp`
3. **Authentication:** *OAuth 2.0*. Endpoints (Authorization-URL, Token-URL, Scopes) bekommst du von uns — Mail an `support@planitprima.com`, wir tragen die Redirect-URI deines Tenants nach.
4. **Save & Test** → PRIMAMCP-Login → **Allow**

**Pfad B — API-Key (Server-to-Server-Bots):**

1. **Tools** → **New tool** → **Model Context Protocol**
2. **Server URL:** `https://mcp.planitprima.com/mcp`
3. **Authentication:** *Bearer*
4. **Token:** `sk-legal-…`

**Anwendungsfälle:**
- **Compliance-Bot in Teams** — DSGVO-Anfragen mit zitierten Artikeln
- **Vertragsprüfung in Word** — markierte Klausel → einschlägige BGB-Paragrafen
- **Power Apps für Inhouse-Counsel** — Low-Code-App mit Rechtskorpus

</details>

<details>
<summary><b>VS Code</b> (Copilot Chat) / <b>Windsurf</b> / <b>Zed</b> / <b>Cline</b> / generischer HTTP-MCP-Client</summary>

Jeder Client mit Streamable-HTTP-MCP-Support funktioniert. Allgemeines Setup:

```jsonc
{
  "mcpServers": {
    "primamcp": {
      "type": "http",
      "url": "https://mcp.planitprima.com/mcp",
      "headers": {
        "Authorization": "Bearer sk-legal-DEIN-API-KEY"
      }
    }
  }
}
```

Konfig-Pfad pro Client:

| Client | Pfad |
| --- | --- |
| VS Code (Copilot Chat) | `.vscode/mcp.json` (workspace) oder Settings UI |
| Windsurf | Settings → MCP Servers |
| Zed | `~/.config/zed/settings.json` → `context_servers` |
| Cline | VS Code Settings → Cline → MCP Servers |

**Eigene App:** [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk) oder [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk). Endpunkt + Bearer-Token, mehr braucht es nicht.

**Test ohne Client:**

```bash
curl -X POST https://mcp.planitprima.com/mcp \
  -H "Authorization: Bearer sk-legal-..." \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

</details>

---

## 🛠️ Tools

Neun Tools, alle batch-fähig, alle async, alle zitierfähig. Discovery-Tools liefern kompakte Antworten (~4 k Token), Detail-Tools volle Texte. Standard-Pagination via `count` / `total` / `offset` / `has_more` / `next_offset` / `hint`.

| Tool | Zweck | Kategorie |
| --- | --- | --- |
| [`legal_search`](docs/tools-reference.md#legal_search) | Hybrid-Suche mit AI-Reranking + Filter | Discovery |
| [`legal_lookup`](docs/tools-reference.md#legal_lookup) | Volltext einer Norm per Zitat | Detail |
| [`legal_lookup_batch`](docs/tools-reference.md#legal_lookup_batch) | Bis zu 20 Lookups in einem Call | Detail |
| [`legal_get_context`](docs/tools-reference.md#legal_get_context) | Umgebende Normen einer Fundstelle | Detail |
| [`legal_find_citing_decisions`](docs/tools-reference.md#legal_find_citing_decisions) | Bundesgerichtsentscheidungen zu einer Norm | Detail |
| [`legal_get_materials`](docs/tools-reference.md#legal_get_materials) | Amtliche Gesetzesbegründung (BT-Drucksache) zu einer Norm | Detail |
| [`legal_list_laws`](docs/tools-reference.md#legal_list_laws) | Verfügbare Gesetze auflisten | Discovery |
| [`legal_get_toc`](docs/tools-reference.md#legal_get_toc) | Inhaltsverzeichnis eines Gesetzes | Discovery |
| [`legal_get_stats`](docs/tools-reference.md#legal_get_stats) | Index- und Datenbankstatistiken | Discovery |

### Beispiel — `legal_search`

```json
{
  "tool": "legal_search",
  "arguments": {
    "query": "Schmerzensgeld bei Persönlichkeitsverletzung",
    "top_k": 5
  }
}
```

Liefert §§ 823, 253 BGB plus einschlägige BGH-Entscheidungen — gemischt, gerankt nach Relevanz, nicht nach Quelltyp.

### Beispiel — `legal_lookup`

```json
{
  "tool": "legal_lookup",
  "arguments": { "citation": "Art. 6 Abs. 1 lit. a DSGVO" }
}
```

Liefert den exakten Buchstaben mit Hierarchie-Pfad und Stand.

**Akzeptierte Zitierformen:** `§ 823 BGB`, `§ 1 Abs. 1 GG`, `§ 280 Abs. 1 Satz 1 BGB`, `Art. 6 Abs. 1 lit. a DSGVO`, `Art. 5 Abs. 1 EU 2024/1689`, `C-311/18`, `BGH VI ZR 175/22`, `BVerfG 1 BvR 16/13`.

→ **[Vollständige Tool-Referenz mit allen Parametern, Beispielen und Response-Schemas](docs/tools-reference.md)**

---

## 🧩 MCP Resources & Prompts

Neben Tools liefert PRIMAMCP sechs **Resources** und drei **Prompts**.

### Resources

| URI | Zweck | Quota |
| --- | --- | --- |
| `legal://rechtsrahmen` | Domain → einschlägige Gesetze (Datenschutz → DSGVO+BDSG+TTDSG; Versicherung → VVG, *nicht* BGB) | Frei |
| `legal://filter_values` | Gültige Filter-Werte für `legal_search` | Frei |
| `legal://eu_celex_registry` | Kuratierte CELEX-IDs für EU-Rechtsakte | Frei |
| `legal://norm/{norm_id}` | Volltext einer Einzelnorm als Resource | Pro-Seat |
| `legal://law/{source_type}/{abbreviation}` | Inhaltsverzeichnis eines Gesetzes | Pro-Seat |
| `legal://eu/celex/{celex}` | EU-Rechtsakt per CELEX-ID | Pro-Seat |

### Prompts (Slash-Commands)

| Command | Zweck |
| --- | --- |
| `/legal_research` | Strukturierte Recherche mit Fußnoten-Zitaten, Pflicht zur Tool-Nutzung |
| `/citation_resolve` | Einzelnes Zitat → verifizierter Volltext |
| `/compare_de_eu` | DE- und EU-Regelung gegenüberstellen + Verhältnis benennen (Umsetzung/Goldplating/…) |

Verfügbar in Claude Desktop, Claude.ai, Copilot Studio.

---

## 🪄 Skills & Rules

Vorgefertigte Snippets, die deinem KI-Client beibringen, **wann** und **wie** er PRIMAMCP nutzen soll. Copy-paste, fertig.

| Asset | Zielsystem | Zweck |
| --- | --- | --- |
| [`rules/cursor.md`](rules/cursor.md) | Cursor (`.cursor/rules/`) | Trigger-Rule: bei §, BGB, DSGVO, Urteil → PRIMAMCP aufrufen, immer Citation, nie halluzinieren |
| [`skills/legal-research/`](skills/legal-research/SKILL.md) | Claude Code | Skill mit YAML-Frontmatter: 5-Schritt-Workflow für saubere Rechtsrecherche |
| [`prompts/chatgpt-custom-gpt.md`](prompts/chatgpt-custom-gpt.md) | ChatGPT Custom-GPT | System-Prompt + Citation-Pflicht analog Skill |
| [`prompts/copilot-instructions.md`](prompts/copilot-instructions.md) | GitHub Copilot (`.github/copilot-instructions.md`) | Repo-weite Anweisung: PRIMAMCP für rechtliche Fragen verwenden |

> Die mitgelieferten **MCP-Prompts** (`/legal_research`, `/citation_resolve`, `/compare_de_eu`) decken denselben Workflow server-seitig ab — nutze sie in MCP-fähigen Clients (Claude Desktop, Claude.ai, Copilot Studio); die client-seitigen Skills/Rules sind die Variante für Clients ohne native Prompt-Unterstützung.

---

## 📚 Was PRIMAMCP abdeckt

| Quelle | Inhalt | Aktualität |
| --- | --- | --- |
| **Bundesrecht** | BGB, ZPO, HGB, AktG, GmbHG, StGB, StPO, AO, EStG, KStG, UStG, SGB I–XII, KSchG, ArbZG, MiLoG, AGG, BetrVG, TVG, BDSG, … — Gesetze **und** Rechtsverordnungen des Bundes | Täglich |
| **Landesrecht** | Bayern (gesetze-bayern.de) und Nordrhein-Westfalen (recht.nrw.de) — Landesgesetze & Verordnungen | Täglich |
| **Bundes-Verwaltungsvorschriften** | Anwendungserlasse, Richtlinien, Durchführungsvorschriften des Bundes (z. B. TA Luft, AEAO) | Täglich |
| **EU-Recht** | DSGVO, KI-VO, MiCA, DORA, NIS2, DSA, DMA, Data Act, Data Governance Act, Verordnungen, Richtlinien, Beschlüsse | Täglich |
| **EuGH-/EuG-Rechtsprechung** | Verfahrensnummern wie `C-311/18`, `T-451/20` | Täglich |
| **Bundesgerichte (ab 2010)** | BGH, BVerwG, BFH, BAG, BSG, BVerfG, BPatG, GmSOGB | Täglich |
| **Leitentscheidungen (bis 2009)** | BVerfGE (amtliche Sammlung, inkl. Lüth/Elfes), BVerwG-Urteile | Abgeschlossener Bestand |
| **Landes-Rechtsprechung** | Sächsisches OVG (Bautzen), NRW-Obergerichte (OVG/OLG/LAG/FG/LSG/VerfGH NRW) | Laufend |
| **Datenschutz-Guidance** | EDSA/EDPB-Leitlinien & DSK-Beschlüsse — Soft Law zu DSGVO/BDSG | Laufend |
| **Gesetzesmaterialien** | BT-Drucksachen mit amtlicher Begründung — der „Wille des Gesetzgebers" (Tool `legal_get_materials`) | Täglich |

**Vollständiges deutsches Bundesrecht · Landesrecht Bayern & NRW · vollständiges EU-Recht · Bundes- und Landesgerichtsentscheidungen · Datenschutz-Guidance · jede Norm einzeln zitierbar.** Alle Inhalte aus amtlichen, frei zugänglichen Quellen — keine Verlagslizenz, keine Drittanbieter-Daten, keine intransparente Lizenzkette.

**Stabiler Reverse-Index:** Welche Norm wurde von welcher Entscheidung zitiert? Treibt das Tool `legal_find_citing_decisions`.

**Kostenlos im Web:** Über 235.000 Gesetzes-Seiten zu Bundes- und EU-Recht sind frei und ohne Login auf [mcp.planitprima.com](https://mcp.planitprima.com) durchstöberbar — jede Norm mit verlinkter einschlägiger Rechtsprechung und, wo vorhanden, erläuternden Beschreibungen.

**Ist mein Gesetz dabei?** Eine Freitextsuche auf der [Startseite](https://mcp.planitprima.com) prüft sofort, ob die für dich relevanten Gesetze in PRIMAMCP indexiert sind.

---

## 🎯 Warum PRIMAMCP?

**Gegenüber LLM-Direktnutzung:** Kein Trainings-Cutoff. Exakte Paragrafen statt geraten. Jede Antwort mit Fundstelle. Sauber getrennt zwischen BGB / DSGVO / BGH-Urteilen. KI halluziniert bei Rechtsfragen regelmäßig — mit PRIMAMCP nicht mehr.

**Gegenüber anderen Legal-MCP-Servern:** Produktionsreif statt Hobby-Projekt. Hybrid-Suche mit AI-Reranking ([öffentlicher Benchmark](docs/benchmarks.md)). Pro-Seat-Quota, OAuth + API-Key, kommerzieller Support, tägliche Aktualisierung aus amtlichen Quellen.

**Gegenüber Komplett-KI-Lösungen (Harvey, Noxtua):** PRIMAMCP ist die **darunterliegende Schicht** — der zitierfähige Rechtskontext-Provider. Eigenes LLM, eigener Workflow.

---

## 🔒 Compliance & Sicherheit

- **Hosting in Deutschland** — alle Daten ausschließlich auf Hetzner-Servern in Deutschland verarbeitet und gespeichert
- **DSGVO-konform** — Auftragsverarbeitungsvertrag (AVV) nach Art. 28 DSGVO inklusive
- **Keine personenbezogenen Daten** im Regelbetrieb — der Index enthält nur öffentliche Rechtstexte; Tool-Call-Inhalte werden nicht persistiert
- **API-Keys SHA-256-gehasht** — Klartext nur einmal beim Erstellen sichtbar
- **Dual-Auth** — API-Key (`sk-legal-…`) für Server-to-Server, OAuth 2.1 mit JWT für Web-Clients
- **Pro-Seat-Quota** mit Fair-Use-Limit (15–300 Anfragen/min je nach Tarif)
- **Stripe für Zahlungsabwicklung** unter EU-US Data Privacy Framework (Art. 45 DSGVO)

→ Verbindliches in **[AGB](https://mcp.planitprima.com/agb)** und **[Datenschutzerklärung](https://mcp.planitprima.com/datenschutz)**.

---

## 💰 Pricing

Alle Preise **brutto** (inkl. USt.), pro Seat und Monat. Jahresabrechnung spart 16 %. Vollständiger Rechtskorpus in jedem Tarif.

| Tarif | Monatlich | Jährlich | Anfragen/Monat | Rate-Limit |
|---|---|---|---|---|
| **Free** | 0 € | — | 150 (max. 15/Tag) | 15/min |
| **Lite** | 6,90 € | 69 € | 750 | 30/min |
| **Pro** | 19,90 € | 199 € | 5.000 | 60/min |
| **Pro Plus** | 69,90 € | 699 € | 25.000 | 300/min |

**Sitzstaffel** auf Pro und Pro Plus: ab dem 2., 6. und 11. Seat wird jeder weitere günstiger — Pro 15,90 / 13,90 / 11,90 €, Pro Plus 55,90 / 48,90 / 41,90 € pro Monat. Gestaffelte Abrechnung: jeder Seat zum Satz seiner Stufe. Lite kostet jeden Seat gleich viel.

Die ersten 14 Tage laufen mit Pro-Funktionen, ohne Kreditkarte. Danach geht es ohne Zutun im Free-Tarif weiter — kein automatischer Wechsel in ein kostenpflichtiges Abo, jederzeit kündbar.

→ [mcp.planitprima.com/pricing](https://mcp.planitprima.com/pricing)

---

## 📖 Weitere Doku

- [Tool-Referenz](docs/tools-reference.md) — alle 8 Tools mit Parametern, Beispielen, Response-Schemas, Fehlerfällen
- [Architektur & Suchpipeline](docs/architecture.md) — Hybrid-Suche, Reranking, Filter
- [Benchmarks](docs/benchmarks.md) — GerLeRB-Resultate, Reproduzierbarkeit
- [FAQ](docs/faq.md) — häufige Fragen
- [Changelog](CHANGELOG.md) — Versionshistorie
- [English README](i18n/README.en.md) — full English translation

---

## 🤝 Beitrag & Support

Pull Requests an die Doku sind willkommen — Tippfehler, fehlende Beispiele, neue Quickstart-Guides für weitere MCP-Clients. Code-Contributions am npm-Wrapper-Paket (`packages/primamcp/`) ebenfalls.

- **Bug oder Feature-Wunsch:** [GitHub Issues](https://github.com/PLANIT-TECH/primamcp/issues)
- **Sicherheits-Hinweis:** siehe [SECURITY.md](SECURITY.md)
- **Support:** `support@planitprima.com`

---

## 📜 License

Code und Dokumentation in diesem Repo: [MIT License](LICENSE).

Der **PRIMAMCP-Server-Quellcode** ist nicht Open Source — PRIMAMCP ist ein gemanagter SaaS-Dienst, betrieben von **PLANIT // TECH GmbH** in Deutschland.

---

## ⚠️ Disclaimer

PRIMAMCP liefert **verifizierte Rechtsinformation**, keine Rechtsberatung im Sinne des RDG. Für eine konkrete Rechtsberatung wende dich an eine Rechtsanwältin oder einen Rechtsanwalt. Treffer aus dem PRIMAMCP-Index ersetzen keine juristische Auswertung im Einzelfall.

---

<sub>© 2026 PLANIT // TECH GmbH · [Impressum](https://mcp.planitprima.com/impressum) · [Datenschutz](https://mcp.planitprima.com/datenschutz) · [AGB](https://mcp.planitprima.com/agb)</sub>
