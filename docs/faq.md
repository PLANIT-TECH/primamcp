# FAQ

## Allgemein

### Welche Rechtstexte sind verfügbar?

PRIMAMCP indiziert deutsches Bundesrecht (BGB, StGB, HGB, AO, EStG, KSchG, AGG, …), das gesamte EU-Recht (DSGVO, KI-VO, MiCA, NIS2, …) und die Entscheidungen der Bundesgerichte (BGH, BVerfG, BAG, BSG, BPatG, BFH). Tägliche Aktualisierung aus amtlichen Quellen.

→ [Vollständige Coverage](architecture.md#datenquellen)

### Was ist MCP?

**Model Context Protocol** — ein offenes Protokoll, das KI-Assistenten standardisierten Zugriff auf externe Datenquellen und Tools gibt. Entwickelt von Anthropic, mittlerweile breit unterstützt: Claude Desktop, Claude.ai, ChatGPT, Cursor, Copilot Studio, plus offene SDKs in Python und TypeScript.

PRIMAMCP ist ein **MCP-Server** für Recht. Du musst MCP nicht selbst implementieren — wenn dein Client MCP unterstützt, kann er PRIMAMCP in zwei Minuten anbinden.

### Wie aktuell sind die Daten?

Tägliche Aktualisierung aus den amtlichen Quellen. Eine Gesetzesänderung von vorgestern ist heute im Index. **Kein Trainings-Cutoff** wie bei reinen LLM-Antworten.

### Ersetzt PRIMAMCP eine Rechtsberatung?

Nein. PRIMAMCP liefert verifizierte Rechtsinformation — keine Rechtsberatung im Sinne des RDG. Für eine konkrete Rechtsberatung wende dich an eine Rechtsanwältin oder einen Rechtsanwalt.

### Warum nicht einfach ChatGPT fragen?

ChatGPT (und jede andere KI) hat einen Trainings-Cutoff, kennt nicht jede Spezialnorm und halluziniert bei Rechtsfragen regelmäßig — Paragrafen, die es nicht gibt; Norm-Nummern, die nicht stimmen; Aussagen ohne Fundstelle. PRIMAMCP löst genau das: ChatGPT antwortet weiterhin in seinem gewohnten Stil, aber mit verifiziertem Rechtskontext.

## Setup & Nutzung

### Welche Clients werden unterstützt?

Alles, was MCP spricht. Direkt mit Anleitung dokumentiert: **Claude Desktop**, **ChatGPT** (Pro/Team/Enterprise), **Claude.ai** (Pro/Max/Team), **Cursor**, **Copilot Studio**. Eigene Apps via offizielle MCP-SDKs.

→ Setup-Anleitungen im [README](../README.md#-setup-pro-client).

### Brauchen meine Kollegen ein eigenes Konto?

Nein, ein eigenes **Seat** reicht. Pro Seat ist entweder eine Person oder ein eigenständiger API-Key abgerechnet. Mehrere Kollegen können unter einer gemeinsamen PRIMAMCP-Organisation arbeiten — jeder mit eigenem Login, jeder als eigenem Seat.

### Brauchen ChatGPT, Claude oder Copilot einen eigenen Plan?

Nein. Du brauchst dort dein normales Abo (z. B. ChatGPT Pro). PRIMAMCP ist eine **Custom Connector**-Quelle, die dort hinzugefügt wird. Die Quota von PRIMAMCP gilt unabhängig vom LLM-Anbieter.

### Was zählt als Seat?

Eine Person oder ein eigenständiger API-Key. Wenn ein API-Key einer Person zugeordnet ist, zählt er auf den Seat dieser Person — kein zusätzlicher Seat. Server-to-Server-API-Keys ohne Personenbindung sind eigene Seats.

### Wie funktioniert die 14-tägige Testphase?

Anmeldung im Portal, PRIMAMCP 5 Tage mit Pro-Funktionen und ohne Kreditkarte testen — kein automatischer Übergang in einen kostenpflichtigen Plan. Danach läuft der Account im Free-Tarif weiter (150 Anfragen/Monat, max. 15 pro Tag). Wenn du mehr brauchst, schließt du aktiv ein Abonnement ab.

### Kann ich jederzeit kündigen?

Ja, jederzeit. Die Kündigung wird zum Ende der laufenden Abrechnungsperiode wirksam — keine Mindestlaufzeit, keine Mindestbindung.

## Technik & Qualität

### Wie gut funktioniert die Suche?

MRR@10 = 0,676 auf dem öffentlichen GerLeRB-Benchmark. In der Praxis: die richtige Norm meist unter den ersten zwei oder drei Treffern bei natürlichsprachlicher Frage; 98,4 % Treffer-Genauigkeit beim Direkt-Lookup mit Zitat.

→ [Benchmarks](benchmarks.md)

### Halluziniert PRIMAMCP?

Nein. PRIMAMCP liefert nur, was im Index steht. Findet sich keine passende Norm, sagt das Tool das ehrlich — der KI-Assistent kann den Anwender informieren, statt etwas zu erfinden.

### Welche Sprachen werden unterstützt?

Index-Inhalte sind deutschsprachig (deutsches Bundesrecht, deutsche Fassung des EU-Rechts, deutsche Entscheidungen). Anfragen funktionieren auch auf Englisch.

### Gibt es ein Rate-Limit?

Fair-Use pro Seat, je nach Tarif: Free 15, Lite 30, Pro 60, Pro Plus 300 Anfragen pro Minute. Im normalen Betrieb erreichst du das nicht. Bei automatisierten Pipelines, die das Limit treffen: größeren Tarif oder zweiten Seat zubuchen.

## Compliance & Sicherheit

### Wo wird PRIMAMCP gehostet?

Bei Hetzner Online GmbH in Deutschland. Zahlungsabwicklung läuft über Stripe.

→ Verbindliches in [AGB](https://mcp.planitprima.com/agb) und [Datenschutzerklärung](https://mcp.planitprima.com/datenschutz).

### Welcher Vertrag liegt der Nutzung zugrunde?

Ein Auftragsverarbeitungsvertrag ist Teil der Vertragsbeziehung. Standardvorlage in der [Vertragslandschaft](https://mcp.planitprima.com/agb), individueller AVV auf Anfrage über `support@planitprima.com`.

### Was sieht PRIMAMCP von meinen Anfragen?

Technisch: die Tool-Call-Argumente plus Metadaten (Zeitstempel, Tool-Name, Latenz, Status, Quota-Hash). Konkrete Aufbewahrungsfristen und Löschkonzept stehen in der [Datenschutzerklärung](https://mcp.planitprima.com/datenschutz).

### Kann ich PRIMAMCP on-premise betreiben?

Aktuell nicht im Standardangebot. On-Premise- und Single-Tenant-Deployments sind für Enterprise-Kunden möglich — Kontakt: `support@planitprima.com`.

### Wie sieht der Datenfluss bei Mandantengesprächen aus?

Architektonisch: Der LLM-Anbieter (Claude, ChatGPT) ist die Schnittstelle zum Mandantengespräch. PRIMAMCP bekommt nur die Tool-Call-Argumente vom LLM, also typischerweise entkontextualisierte juristische Fragen — keinen Prompt-Klartext. Eine berufsrechtliche Beurteilung im Einzelfall ist jedoch Sache deiner Kammer und nicht etwas, das wir hier zusichern.

## Verträge & Pricing

### Was kostet PRIMAMCP?

Vier Tarife, alle Preise brutto pro Seat und Monat — Jahresabrechnung spart 16 %:

| Tarif | Monatlich | Jährlich | Anfragen/Monat | Rate-Limit |
|---|---|---|---|---|
| Free | 0 € | — | 150 (max. 15/Tag) | 15/min |
| Lite | 6,90 € | 69 € | 750 | 30/min |
| Pro | 19,90 € | 199 € | 5.000 | 60/min |
| Pro Plus | 69,90 € | 699 € | 25.000 | 300/min |

Vollständige Coverage und bevorzugter E-Mail-Support in jedem kostenpflichtigen Tarif. Die ersten 5 Tage laufen mit Pro-Funktionen, ohne Kreditkarte.

→ [Pricing](https://mcp.planitprima.com/pricing)

### Wird es bei mehreren Seats günstiger?

Ja, auf Pro und Pro Plus greift eine Sitzstaffel: ab dem 2., 6. und 11. Seat wird jeder weitere günstiger — Pro 15,90 / 13,90 / 11,90 €, Pro Plus 55,90 / 48,90 / 41,90 € pro Monat. Abgerechnet wird gestaffelt, jeder Seat zum Satz seiner Stufe. Auf Lite kostet jeder Seat gleich viel.

### Gibt es einen Custom-Plan für viele Seats?

Ab 50 Seats sprechen wir gern über individuelle Vertragsbedingungen — `support@planitprima.com`.

### Bekomme ich eine Rechnung mit USt-Ausweis?

Ja. Stripe Tax ermittelt automatisch die korrekte USt: 19 % für deutsche Kunden, 0 % Reverse-Charge für EU-B2B mit USt-IdNr., 0 % Export außerhalb der EU.

---

**Frage nicht beantwortet?** → `support@planitprima.com`
