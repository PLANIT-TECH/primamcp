<div align="center">

<a href="https://mcp.planitprima.com">
  <img alt="PRIMAMCP — Verified, citable legal context for any AI assistant" src="../public/cover.png" />
</a>

# PRIMAMCP — German & EU Law for any AI Assistant

**Verified, citable legal context via the [Model Context Protocol](https://modelcontextprotocol.io).**
Claude · ChatGPT · Cursor · Copilot · any MCP-capable client.

[![Website](https://img.shields.io/badge/website-mcp.planitprima.com-0a7c3e?style=flat-square)](https://mcp.planitprima.com)
[![NPM](https://img.shields.io/npm/v/@planit-tech/primamcp?style=flat-square&logo=npm)](https://www.npmjs.com/package/@planit-tech/primamcp)
[![MCP](https://img.shields.io/badge/protocol-MCP-8a2be2?style=flat-square)](https://modelcontextprotocol.io)
[![GDPR](https://img.shields.io/badge/compliance-GDPR-005bbb?style=flat-square)](https://mcp.planitprima.com/datenschutz)
[![Made in Germany](https://img.shields.io/badge/hosting-Germany%20%F0%9F%87%A9%F0%9F%87%AA-000000?style=flat-square)](https://mcp.planitprima.com/datenschutz)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow?style=flat-square)](../LICENSE)
[![Listed on mcpservers.org](https://mcpservers.org/badge.svg)](https://mcpservers.org/servers/mcp-planitprima-com-docs)

[**Quickstart**](#-60-second-quickstart) · [**Tools**](#-tools) · [**Skills & Rules**](#-skills--rules) · [**Coverage**](#-what-primamcp-covers) · [**Deutsch**](../README.md)

</div>

---

## AI hallucinates on legal questions. PRIMAMCP delivers the facts.

**Without PRIMAMCP:**

> ❌ "§ 823a BGB governs damages for non-pecuniary loss …" *(this paragraph does not exist)*
> ❌ "Art. 9 GDPR allows processing with consent — as of 2023" *(training cutoff, possibly outdated)*
> ❌ "The BGH ruled in VI ZR 999/22 …" *(invented case number)*

**With PRIMAMCP:**

> ✅ `§ 253 (2) BGB` — full text, version 2024-10-01, direct URL to the official source
> ✅ `Art. 9 (2) (a) GDPR` — full text with hierarchy path
> ✅ `BGH VI ZR 175/22` of 2023-05-15 — operative part + cited norms

PRIMAMCP is a **production-grade MCP server** giving AI assistants verified access to German and European law — updated daily from official sources, searchable with three-stage hybrid search, every match with an exact reference. Current state: **MRR@10 = 0.676** on the public [GerLeRB benchmark](../docs/benchmarks.md).

---

## ⚡ 60-second quickstart

**Endpoint:** `https://mcp.planitprima.com/mcp` (Streamable HTTP, bearer auth or OAuth 2.1)

```bash
# Option 1 — npx setup (any client, easiest path)
npx -y @planit-tech/primamcp setup --client claude
# supported: claude | cursor | vscode | windsurf

# Option 2 — manual entry (see per-client sections below)
```

**Get an API key:** [mcp.planitprima.com](https://mcp.planitprima.com) → 5-day free trial, no credit card. The plain-text key is shown **exactly once** at creation — copy it straight into your client.

---

## 🔧 Per-client setup

<details>
<summary><b>Claude Desktop</b> (macOS / Windows / Linux)</summary>

**Config file:**

| Platform | Path |
| --- | --- |
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

**Entry:**

```json
{
  "mcpServers": {
    "primamcp": {
      "type": "http",
      "url": "https://mcp.planitprima.com/mcp",
      "headers": {
        "Authorization": "Bearer sk-legal-YOUR-API-KEY"
      }
    }
  }
}
```

**Fully quit** Claude Desktop (Quit, not just close the window) and reopen. The MCP icon now shows **PRIMAMCP** with nine tools.

**Test prompt:** *"What are the prerequisites for a non-pecuniary damages claim under § 253 BGB? Please cite sources."*

**Troubleshooting:**
- *PRIMAMCP doesn't appear* → Validate JSON with `python -m json.tool < claude_desktop_config.json`. Common mistake: missing comma between multiple servers.
- *401 Unauthorized* → Token prefix `sk-legal-` correct? Subscription active?
- *429 rate limit* → fair-use is 15–300 requests/minute per seat, depending on plan. Long research sessions can hit it — pause briefly, move to a larger plan or add a second seat.

</details>

<details>
<summary><b>Cursor</b> (Composer / Agent)</summary>

**One-click install:**

[**🖱️ Add PRIMAMCP to Cursor**](https://cursor.com/install-mcp?name=primamcp&config=eyJ1cmwiOiJodHRwczovL21jcC5wbGFuaXRwcmltYS5jb20vbWNwIiwiaGVhZGVycyI6eyJBdXRob3JpemF0aW9uIjoiQmVhcmVyIFlPVVJfUFJJTUFNQ1BfQVBJX0tFWSJ9fQ)

After clicking: replace `YOUR_PRIMAMCP_API_KEY` with your actual API key (`sk-legal-…`) in the Cursor config editor.

**Manual:** create `.cursor/mcp.json` in the project root or `~/.cursor/mcp.json` globally:

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

**Important:** never commit the token — add `.cursor/mcp.json` to `.gitignore`, or pull the token from an environment variable (snippet above).

**Use cases:**
- **Drafting T&Cs** with real BGB clauses (§§ 305–310, § 309 No. 7)
- **GDPR compliance check** while writing data-processing code (Art. 6, Art. 9 GDPR)
- **EU AI Act risk classification** while building ML pipelines

→ Recommended: copy the [Cursor rule](../rules/cursor.md) so Cursor uses PRIMAMCP automatically on legal questions.

</details>

<details>
<summary><b>ChatGPT</b> (Pro / Team / Enterprise) and <b>Claude.ai</b> (web)</summary>

Browser clients speak MCP natively via **OAuth 2.1** — no code, no plain-text token in browser storage.

**ChatGPT:**

1. **Settings** → **Connectors** → **Add custom connector**
2. **Name:** `PRIMAMCP`
3. **MCP Server URL:** `https://mcp.planitprima.com/mcp`
4. **Authentication:** *OAuth*
5. **Save** → browser tab opens → sign in to PRIMAMCP → **Allow**
6. In any chat: **Tools** dropdown → enable **PRIMAMCP**

**Claude.ai:**

1. **Settings** → **Connectors** → **Add custom**
2. **Name:** `PRIMAMCP`
3. **Remote MCP server URL:** `https://mcp.planitprima.com/mcp`
4. **Sign in** → sign in to PRIMAMCP → **Allow**
5. In any chat: **tools icon** → enable PRIMAMCP

> 💡 Claude.ai also supports **MCP resources** — `legal://rechtsrahmen` & friends appear as attachable references in the chat.

**Seats and OAuth:** each OAuth subject = **one seat** (same `subject_id`, even if you use it in both clients).

**Custom-GPT system prompt:** if you build a custom GPT with PRIMAMCP, copy the pre-built [system prompt](../prompts/chatgpt-custom-gpt.md) — it enforces tool use and citation discipline.

</details>

<details>
<summary><b>Copilot Studio</b> (Microsoft 365 / Power Platform / Teams)</summary>

Copilot Studio supports MCP servers as "custom connectors" and — unlike many other clients — also pulls **resources**, which is particularly valuable for PRIMAMCP (`legal://rechtsrahmen`, `legal://eu_celex_registry`).

**Path A — OAuth (recommended):**

1. **Tools** → **Add a tool** → **New tool** → **Model Context Protocol**
2. **Server URL:** `https://mcp.planitprima.com/mcp`
3. **Authentication:** *OAuth 2.0*. The exact endpoints (authorization URL, token URL, scopes) are provided by us — drop a line to `support@planitprima.com`, and we'll register your tenant's redirect URI in the same step.
4. **Save & Test** → sign in to PRIMAMCP → **Allow**

**Path B — API key (server-to-server bots):**

1. **Tools** → **New tool** → **Model Context Protocol**
2. **Server URL:** `https://mcp.planitprima.com/mcp`
3. **Authentication:** *Bearer*
4. **Token:** `sk-legal-…`

**Use cases:**
- **Compliance bot in Teams** — GDPR queries with cited articles
- **Contract review in Word** — highlighted clause → relevant BGB paragraphs
- **Power Apps for in-house counsel** — low-code app with the legal corpus

</details>

<details>
<summary><b>VS Code</b> (Copilot Chat) / <b>Windsurf</b> / <b>Zed</b> / <b>Cline</b> / generic HTTP MCP client</summary>

Any client with Streamable-HTTP MCP support works. Generic setup:

```jsonc
{
  "mcpServers": {
    "primamcp": {
      "type": "http",
      "url": "https://mcp.planitprima.com/mcp",
      "headers": {
        "Authorization": "Bearer sk-legal-YOUR-API-KEY"
      }
    }
  }
}
```

Config path per client:

| Client | Path |
| --- | --- |
| VS Code (Copilot Chat) | `.vscode/mcp.json` (workspace) or Settings UI |
| Windsurf | Settings → MCP Servers |
| Zed | `~/.config/zed/settings.json` → `context_servers` |
| Cline | VS Code Settings → Cline → MCP Servers |

**Custom app:** [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk) or [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk). Endpoint + bearer token, that's all you need.

**Test without a client:**

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

Nine tools, all batch-capable, all async, all citable. Discovery tools return compact responses (~4 k tokens), detail tools return full text. Standard pagination via `count` / `total` / `offset` / `has_more` / `next_offset` / `hint`.

| Tool | Purpose | Category |
| --- | --- | --- |
| [`legal_search`](../docs/tools-reference.md#legal_search) | Hybrid search with AI reranking + filters | Discovery |
| [`legal_lookup`](../docs/tools-reference.md#legal_lookup) | Full text of a norm by citation | Detail |
| [`legal_lookup_batch`](../docs/tools-reference.md#legal_lookup_batch) | Up to 20 lookups in one call | Detail |
| [`legal_get_context`](../docs/tools-reference.md#legal_get_context) | Surrounding norms of a reference | Detail |
| [`legal_find_citing_decisions`](../docs/tools-reference.md#legal_find_citing_decisions) | Federal court decisions citing a norm | Detail |
| [`legal_get_materials`](../docs/tools-reference.md#legal_get_materials) | Official legislative reasoning (Bundestag paper) for a norm | Detail |
| [`legal_list_laws`](../docs/tools-reference.md#legal_list_laws) | List available laws | Discovery |
| [`legal_get_toc`](../docs/tools-reference.md#legal_get_toc) | Table of contents of a law | Discovery |
| [`legal_get_stats`](../docs/tools-reference.md#legal_get_stats) | Index and database statistics | Discovery |

### Example — `legal_search`

```json
{
  "tool": "legal_search",
  "arguments": {
    "query": "non-pecuniary damages for personality-rights violation",
    "top_k": 5
  }
}
```

Returns §§ 823, 253 BGB plus relevant BGH decisions — mixed, ranked by relevance, not by source type.

### Example — `legal_lookup`

```json
{
  "tool": "legal_lookup",
  "arguments": { "citation": "Art. 6 (1) (a) GDPR" }
}
```

Returns the exact subparagraph with hierarchy path and version.

**Accepted citation forms:** `§ 823 BGB`, `§ 1 (1) GG`, `§ 280 (1) sentence 1 BGB`, `Art. 6 (1) (a) GDPR`, `Art. 5 (1) EU 2024/1689`, `C-311/18`, `BGH VI ZR 175/22`, `BVerfG 1 BvR 16/13`.

→ **[Full tool reference with all parameters, examples and response schemas](../docs/tools-reference.md)**

---

## 🧩 MCP resources & prompts

In addition to tools, PRIMAMCP ships six **resources** and three **prompts**.

### Resources

| URI | Purpose | Quota |
| --- | --- | --- |
| `legal://rechtsrahmen` | Domain → relevant laws (data protection → GDPR+BDSG+TTDSG; insurance → VVG, *not* BGB) | Free |
| `legal://filter_values` | Valid filter values for `legal_search` | Free |
| `legal://eu_celex_registry` | Curated CELEX IDs for EU acts | Free |
| `legal://norm/{norm_id}` | Single-norm full text as a resource | Per-seat |
| `legal://law/{source_type}/{abbreviation}` | Table of contents of a law | Per-seat |
| `legal://eu/celex/{celex}` | EU act by CELEX ID | Per-seat |

### Prompts (slash commands)

| Command | Purpose |
| --- | --- |
| `/legal_research` | Structured research with footnoted citations, mandatory tool use |
| `/citation_resolve` | Single citation → verified full text |
| `/compare_de_eu` | Contrast DE and EU rules + name the relationship (transposition / gold-plating / …) |

Available in Claude Desktop, Claude.ai, Copilot Studio.

---

## 🪄 Skills & Rules

Pre-built snippets that teach your AI client **when** and **how** to use PRIMAMCP. Copy-paste, done.

| Asset | Target system | Purpose |
| --- | --- | --- |
| [`rules/cursor.md`](../rules/cursor.md) | Cursor (`.cursor/rules/`) | Trigger rule: on §, BGB, GDPR, ruling → call PRIMAMCP, always cite, never hallucinate |
| [`skills/legal-research/`](../skills/legal-research/SKILL.md) | Claude Code | Skill with YAML frontmatter: 5-step workflow for clean legal research |
| [`prompts/chatgpt-custom-gpt.md`](../prompts/chatgpt-custom-gpt.md) | ChatGPT custom GPT | System prompt + citation discipline analogous to the skill |
| [`prompts/copilot-instructions.md`](../prompts/copilot-instructions.md) | GitHub Copilot (`.github/copilot-instructions.md`) | Repo-wide instruction: use PRIMAMCP for legal questions |

> The bundled **MCP prompts** (`/legal_research`, `/citation_resolve`, `/compare_de_eu`) cover the same workflow server-side — use them in MCP-aware clients (Claude Desktop, Claude.ai, Copilot Studio); the client-side skills/rules are for clients without native prompt support.

---

## 📚 What PRIMAMCP covers

| Source | Content | Updated |
| --- | --- | --- |
| **German federal law** | BGB, ZPO, HGB, AktG, GmbHG, StGB, StPO, AO, EStG, KStG, UStG, SGB I–XII, KSchG, ArbZG, MiLoG, AGG, BetrVG, TVG, BDSG, … — statutes **and** federal regulations | Daily |
| **State law (Länder)** | Bavaria (gesetze-bayern.de) and North Rhine-Westphalia (recht.nrw.de) — state statutes & regulations | Daily |
| **Federal administrative rules** | Application decrees, guidelines, implementing rules (e.g. TA Luft, AEAO) | Daily |
| **EU law** | GDPR, AI Act, MiCA, DORA, NIS2, DSA, DMA, Data Act, Data Governance Act, regulations, directives, decisions | Daily |
| **CJEU / GC case law** | Case numbers like `C-311/18`, `T-451/20` | Daily |
| **Federal courts (2010–)** | BGH, BVerwG, BFH, BAG, BSG, BVerfG, BPatG, GmSOGB | Daily |
| **Landmark decisions (pre-2010)** | BVerfGE (official reports, incl. Lüth/Elfes), BVerwG judgments | Closed historical set |
| **State courts** | Saxony Higher Administrative Court (Bautzen), NRW higher courts (OVG/OLG/LAG/FG/LSG/Constitutional Court NRW) | Continuous |
| **Data-protection guidance** | EDPB guidelines & DSK resolutions — soft law on GDPR/BDSG | Continuous |
| **Legislative materials** | Bundestag printed papers with official reasoning — the legislator's intent (`legal_get_materials` tool) | Daily |

**Complete German federal law · Bavaria & NRW state law · complete EU law · federal and state court decisions · data-protection guidance · every norm individually citable.** All content from official, freely accessible sources — no publisher licence, no third-party data, no opaque licence chain.

**Stable reverse index:** which norm has been cited by which decision? Powers the `legal_find_citing_decisions` tool.

**Free on the web:** Over 235,000 law pages covering German federal and EU law are browsable without login at [mcp.planitprima.com](https://mcp.planitprima.com) — each provision with linked relevant case-law and, where available, explanatory descriptions.

**Is my law covered?** A free-text search on the [landing page](https://mcp.planitprima.com) instantly tells you whether the laws relevant to you are indexed in PRIMAMCP.

---

## 🎯 Why PRIMAMCP?

**Versus LLM-only use:** no training cutoff. Exact paragraphs instead of guessed ones. Every answer with a reference. Cleanly separated between BGB / GDPR / BGH rulings. AI hallucinates on legal questions regularly — not with PRIMAMCP.

**Versus other legal MCP servers:** production-grade, not a hobby project. Hybrid search with AI reranking ([public benchmark](../docs/benchmarks.md)). Per-seat quota, OAuth + API key, commercial support, daily updates from official sources.

**Versus full-stack legal AI (Harvey, Noxtua):** PRIMAMCP is the **layer underneath** — the citable legal-context provider. Bring your own LLM, bring your own workflow.

---

## 🔒 Compliance & security

- **Hosted in Germany** — all data processed and stored exclusively on Hetzner servers in Germany
- **GDPR-compliant** — Art. 28 GDPR data processing agreement (DPA) included
- **No personal data** in normal operation — the index contains only public legal texts; tool-call payloads are not persisted
- **API keys SHA-256-hashed** — plain text shown only once at creation
- **Dual auth** — API key (`sk-legal-…`) for server-to-server, OAuth 2.1 with JWT for browser clients
- **Per-seat quota** with fair-use limit (15–300 req/min depending on plan)
- **Stripe** for payments under EU-US Data Privacy Framework (Art. 45 GDPR)

→ Binding terms in **[T&C](https://mcp.planitprima.com/agb)** and **[Privacy policy](https://mcp.planitprima.com/datenschutz)**.

---

## 💰 Pricing

All prices are **gross** (VAT included), per seat and month. Annual billing saves 16 %. The full legal corpus is included in every tier.

| Plan | Monthly | Yearly | Requests/month | Rate limit |
|---|---|---|---|---|
| **Free** | €0 | — | 150 (max. 15/day) | 15/min |
| **Lite** | €6.90 | €69 | 750 | 30/min |
| **Pro** | €19.90 | €199 | 5,000 | 60/min |
| **Pro Plus** | €69.90 | €699 | 25,000 | 300/min |

**Seat ladder** on Pro and Pro Plus: every seat from the 2nd, 6th and 11th onwards costs less — Pro €15.90 / €13.90 / €11.90, Pro Plus €55.90 / €48.90 / €41.90 per month. Billing is graduated: each seat is charged at its own tier's rate. On Lite every seat costs the same.

The first 5 days run with Pro features, no credit card. After that you simply continue on the Free tier — no automatic switch into a paid subscription, cancel any time.

→ [mcp.planitprima.com/pricing](https://mcp.planitprima.com/pricing)

---

## 📖 More documentation

- [Tool reference](../docs/tools-reference.md) — all 9 tools with parameters, examples, response schemas, error cases
- [Architecture & search pipeline](../docs/architecture.md) — hybrid search, reranking, filters
- [Benchmarks](../docs/benchmarks.md) — GerLeRB results, reproducibility
- [FAQ](../docs/faq.md) — frequently asked questions
- [Changelog](../CHANGELOG.md) — version history
- [Deutsches README](../README.md) — full German version

---

## 🤝 Contributing & support

Documentation pull requests are welcome — typo fixes, missing examples, new quickstart guides for further MCP clients. Code contributions to the npm wrapper package (`packages/primamcp/`) are equally welcome.

- **Bug or feature request:** [GitHub Issues](https://github.com/PLANIT-TECH/primamcp/issues)
- **Security disclosure:** see [SECURITY.md](../SECURITY.md)
- **Support:** `support@planitprima.com`

---

## 📜 License

Code and documentation in this repo: [MIT License](../LICENSE).

The **PRIMAMCP server source code** is not open source — PRIMAMCP is a managed SaaS service operated by **PLANIT // TECH GmbH** in Germany.

---

## ⚠️ Disclaimer

PRIMAMCP delivers **verified legal information**, not legal advice within the meaning of German legal-services law (RDG). For specific legal advice, consult a qualified lawyer. Matches from the PRIMAMCP index do not replace a case-by-case legal assessment.

---

<sub>© 2026 PLANIT // TECH GmbH · [Imprint](https://mcp.planitprima.com/impressum) · [Privacy](https://mcp.planitprima.com/datenschutz) · [T&C](https://mcp.planitprima.com/agb)</sub>
