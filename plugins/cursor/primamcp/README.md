# PRIMAMCP Cursor Plugin

Installs PRIMAMCP — verified, citable German & EU law — into Cursor with a project-local MCP server entry and an always-applied research rule.

## Install

```
cd /path/to/your/project
mkdir -p .cursor && cp /path/to/this/plugin/mcp.json .cursor/mcp.json
mkdir -p .cursor/rules && cp /path/to/this/plugin/use-primamcp.mdc .cursor/rules/
```

Then either:
- Set `PRIMAMCP_API_KEY=sk-legal-…` in your shell (the `mcp.json` references `${env:PRIMAMCP_API_KEY}`), or
- Edit `mcp.json` and put the bearer token directly in the `Authorization` header.

Reload Cursor (`Cmd/Ctrl+Shift+P → Reload Window`). The MCP icon shows **PRIMAMCP** with nine tools, and the rule is active in every Composer/Agent session.

## What's inside

| Asset | Purpose |
| --- | --- |
| `mcp.json` | Cursor MCP-Server entry pointing at `https://mcp.planitprima.com/mcp` (Streamable HTTP, Bearer auth via `PRIMAMCP_API_KEY`). |
| `use-primamcp.mdc` | Always-applied Cursor rule with trigger heuristics, mandatory tool use, and citation discipline. |
| `plugin.json` | Plugin metadata for Cursor's plugin marketplace. |

## Get an API key

[mcp.planitprima.com](https://mcp.planitprima.com) — 5-day free trial, no credit card.

## License

MIT — see the [repo LICENSE](../../../LICENSE).
