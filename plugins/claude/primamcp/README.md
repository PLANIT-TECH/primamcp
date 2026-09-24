# PRIMAMCP Claude Code Plugin

Installs PRIMAMCP — verified, citable German & EU law — as a Claude Code plugin with the `legal-research` skill, the `/primamcp:research` slash command, and the `legal-researcher` agent.

## Install

From within Claude Code:

```
/plugin install PLANIT-TECH/primamcp
```

Then either authenticate via the OAuth flow Claude Code will prompt you for, or set `PRIMAMCP_API_KEY` (`sk-legal-…`) in your environment if you prefer Bearer auth. Get a key at [mcp.planitprima.com](https://mcp.planitprima.com) (5-day free trial, no credit card).

## What's inside

| Asset | Purpose |
| --- | --- |
| `.mcp.json` | Connects Claude Code to `https://mcp.planitprima.com/mcp` over Streamable HTTP. |
| `skills/legal-research/SKILL.md` | Skill telling Claude *when* and *how* to use PRIMAMCP — trigger heuristics, 5-step workflow, citation format, integrity rules. |
| `commands/research.md` | `/primamcp:research` slash command for structured legal research with footnoted citations. |
| `agents/legal-researcher.md` | Lightweight subagent for delegated legal lookups without cluttering the main conversation. |

## Tools provided by the underlying MCP server

`legal_search`, `legal_lookup`, `legal_lookup_batch`, `legal_get_context`, `legal_find_citing_decisions`, `legal_list_laws`, `legal_get_toc`, `legal_get_stats` — plus six MCP resources and three MCP prompts.

→ Full tool reference: [docs/tools-reference.md](../../../docs/tools-reference.md)

## Data coverage

German federal law (BGB, StGB, HGB, AO, EStG, KSchG, AGG, BetrVG, BDSG, …), EU law (GDPR, AI Act, MiCA, DORA, NIS2, DSA, DMA, Data Act, Data Governance Act), CJEU case law, federal court decisions (BGH, BVerfG, BAG, BSG, BPatG, BFH). Daily updates from official sources, hosted in Germany.

## License

MIT — see the [repo LICENSE](../../../LICENSE).
