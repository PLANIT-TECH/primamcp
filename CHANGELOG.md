# Changelog

Strukturierter Überblick über die nennenswerten Änderungen seit dem Launch. Reine Bugfixes und Performance-Tunings sind hier nicht aufgelistet — die laufen kontinuierlich im Hintergrund.

Format orientiert an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

## 2026

### November 2026

**Neue Quellen**
- **Leitlinien und Mitteilungen der EU-Kommission** — die Auslegungshilfen der Kommission aus dem Amtsblatt (Reihe C), auf Deutsch und Englisch. Darunter die Leitlinien zu den Transparenzpflichten nach Art. 50 KI-VO, zu NIS-2 (Art. 3 und 4), zu Fahrzeugdaten unter dem Data Act und zum DSA, zum Produktrecht (Blue Guide, GPSR), zum Verbraucherrecht (UGP- und Verbraucherrechte-Leitfaden) sowie zum Kartellrecht (Vertikal- und Horizontal-Leitlinien, Marktabgrenzung, Art. 102 AEUV). Einzelne Randnummern sind direkt abrufbar, z. B. `legal_lookup` mit `Rn. 45 Vertikal-Leitlinien`.

**Konto**
- **Rechnungen im Kundenportal** — alle Rechnungen abrufbar, auf Wunsch zusätzlich per E-Mail.

### Oktober 2026

**Neue Quellen**
- **BGH und Bundespatentgericht 2000–2009** — rund 30.000 Entscheidungen des Bundesgerichtshofs und rund 18.000 des Bundespatentgerichts. Schließt die Lücke vor der ab 2010 verfügbaren Bundesrechtsprechung.
- **Historische EuGH-Rechtsprechung** — Urteile und Beschlüsse des Gerichtshofs vor 2013, zurück bis in die 1950er-Jahre (z. B. Costa/ENEL, C-6/64).
- **Tätigkeitsberichte der Datenschutzaufsicht** — die Tätigkeitsberichte der Datenschutzaufsichtsbehörden von Bund und Ländern seit 2018 (ohne Thüringen). Sie ergänzen die EDSA- und DSK-Papiere um die Aufsichtspraxis aus konkreten Fällen.

**Geändert**
- **Einheitliche Parameternamen** — `legal_search` nimmt `limit` statt `top_k`, `legal_get_materials` `citation` statt `norm`, `legal_list_laws` `query` statt `search`. Die alten Namen werden nicht mehr angenommen. MCP-Clients lesen die Parameter aus dem Tool-Schema und sind nicht betroffen; anpassen muss nur, wer die Tools aus eigenen Skripten mit festen Parameternamen aufruft.

**Konto & Website**
- **Kontingent-Benachrichtigung** — eine E-Mail, bevor das Kontingent aufgebraucht ist, und eine, wenn es aufgebraucht ist.
- **Einrichtungsanleitungen** für [Claude](https://mcp.planitprima.com/claude) und [ChatGPT](https://mcp.planitprima.com/chatgpt) mit aktuellen Screenshots.

### August 2026

**Umbenennung: Lawbster heißt jetzt PRIMAMCP**
- **Neue Adresse** — der Dienst läuft ab sofort unter [mcp.planitprima.com](https://mcp.planitprima.com); die bisherige Adresse `lawbster.planitprima.com` wird abgelöst. API-Keys, Abos und Kontingente bleiben unverändert.
- **Neues npm-Paket** `@planit-tech/primamcp` (Binary `primamcp`) ersetzt `@planit-lawbster/lawbster-mcp`. Einrichtung: `npx -y @planit-tech/primamcp setup --client <claude|cursor|vscode|windsurf>`.
- **Neue Umgebungsvariablen** `PRIMAMCP_API_KEY` und `PRIMAMCP_MCP_URL` ersetzen `LAWBSTER_API_KEY` / `LAWBSTER_MCP_URL` — **ohne Fallback**. Bestehende Konfigurationen müssen einmalig angepasst werden.
- **Neuer Server-Eintragsname** in MCP-Client-Konfigurationen: `primamcp` statt `lawbster`. Der alte Eintrag kann nach dem Setup entfernt werden.

### Juni 2026

**Neue Quellen**
- **Historische Leitentscheidungen** — Leitentscheidungen des Bundesverfassungsgerichts aus der amtlichen Sammlung (inkl. Klassiker wie Lüth und Elfes) sowie Urteile des Bundesverwaltungsgerichts, jeweils der Bestand bis 2009. Schließt die Lücke unterhalb der ab 2010 verfügbaren Bundesrechtsprechung.
- **Bundes-Verwaltungsvorschriften** — allgemeine Verwaltungsvorschriften des Bundes (z. B. TA Luft, Anwendungserlasse).
- **Datenschutz-Guidance** — Leitlinien, Empfehlungen und Beschlüsse des Europäischen Datenschutzausschusses (EDSA/EDPB) und der deutschen Datenschutzkonferenz (DSK): die maßgebliche behördliche Auslegung zu DSGVO und BDSG.
- **NRW-Rechtsprechung** — Entscheidungen der nordrhein-westfälischen Obergerichte (OVG, OLG/LAG/FG Düsseldorf·Hamm·Köln·Münster, LSG NRW, Verfassungsgerichtshof NRW).
- **Gesetzesmaterialien** — amtliche Gesetzesbegründungen aus den BT-Drucksachen des Deutschen Bundestages.

**Neue Funktionen**
- **Neues Tool `legal_get_materials`** — die amtliche Begründung zu einer Norm direkt abrufbar (Grundlage der historischen Auslegung, „Wille des Gesetzgebers"). Damit jetzt neun Tools.
- **Neuer Filter `cited_norm` für `legal_search`** — findet gezielt Entscheidungen, die eine konkrete Norm zitieren; mit einer fallspezifischen Frage kombiniert liefert das die passende Rechtsprechung zu einem Sachverhalt.
- **Öffentlicher Gesetzes-Browser** — rund 235.000 frei zugängliche Norm-Seiten zu deutschem Bundesrecht und EU-Recht auf [mcp.planitprima.com](https://mcp.planitprima.com), jeweils mit verlinkter einschlägiger Rechtsprechung und — wo vorhanden — erläuternden Beschreibungen. Kein Login, voll indexierbar.
- **Abdeckungs-Suche auf der Startseite** („Ist mein Gesetz dabei?") — eine Freitextsuche, die über alle Gesetzes-Quellen sofort beantwortet, ob die für dich relevanten Gesetze in PRIMAMCP indexiert sind.

### Mai 2026

**Neue Quellen**
- **Landesrecht Bayern und Nordrhein-Westfalen** — Landesgesetze und Verordnungen beider Länder.
- **Sächsische Rechtsprechung** — Urteile und Beschlüsse des Sächsischen Oberverwaltungsgerichts (Bautzen).

**Neue Funktionen**
- **Erweiterte Filter** — Filter nach Gericht (`court`) und nach Jurisdiktion (`de` umfasst jetzt Bund **und** Länder). Die neue Resource `legal://filter_values` dokumentiert alle gültigen Filterwerte samt Abgrenzungen.
- **Mehrsprachigkeit** — sprach-bewusste Suche per `language`-Filter und ein englischsprachiger Korpus (EUR-Lex, Datenschutz-Guidance) zusätzlich zum deutschen.
- **Confidence-Scores & Hinweise** — Such- und Lookup-Antworten enthalten eine Vertrauenseinstufung und Hinweise zur nächsten sinnvollen Aktion; geführter Setup-Assistent für die MCP-Client-Einrichtung.

**Verteilung & Integration**
- **npm-Wrapper-Paket** `@planit-tech/primamcp` — stdio↔HTTPS-Bridge für lokale MCP-Clients; Einrichtung per `npx -y @planit-tech/primamcp setup --client <claude|cursor|vscode|windsurf>`.
- **Fertige Integrations-Snippets** für Cursor, Claude Code, ChatGPT (Custom GPT) und GitHub Copilot.
- **README-first-Dokumentation** in Deutsch und Englisch; die frühere separate Doku-Website wurde abgelöst.

### 29. April 2026
- **Öffentliche GitHub-Pages-Doku** unter [planit-tech.github.io/primamcp](https://planit-tech.github.io/primamcp/) live — DE und EN.

### 23. April 2026
- **Public Launch.** PRIMAMCP wird öffentlich verfügbar.
- Initialer Funktionsumfang: deutsches Bundesrecht, EU-Recht und Bundesgerichtsentscheidungen, Hybrid-Suche mit AI-Reranking, acht MCP-Tools, drei Prompts, Resources, OAuth + API-Key, Pro-Seat-Quota, AVV inklusive.

---

**Bug oder Feature-Wunsch?** → `support@planitprima.com` oder [GitHub Issues](https://github.com/PLANIT-TECH/primamcp/issues).
