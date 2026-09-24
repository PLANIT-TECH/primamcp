# @planit-tech/primamcp

Local MCP bridge for [PRIMAMCP](https://mcp.planitprima.com) — verified, citable German & EU law for any MCP-capable AI assistant.

This package is a thin **stdio↔HTTPS bridge**. It runs on your machine, exposes PRIMAMCP as a local stdio MCP server to your client, and forwards every JSON-RPC frame to the hosted endpoint at `https://mcp.planitprima.com/mcp` with your API key. Useful for clients that don't yet support remote HTTP MCP servers natively.

> Most modern clients (Claude Desktop, Cursor, ChatGPT, Claude.ai, Copilot Studio, VS Code) talk Streamable HTTP MCP directly and **don't need this wrapper** — point them at `https://mcp.planitprima.com/mcp` with a Bearer header instead. See the [main README](https://github.com/PLANIT-TECH/primamcp#readme) for direct-connect snippets.

## Install

No global install required — use `npx`:

```bash
npx -y @planit-tech/primamcp setup --client claude
```

Supported `--client` values: `claude` · `cursor` · `vscode` · `windsurf`

The `setup` command writes a properly-formatted MCP server entry into the right config file for the chosen client and prints the path it touched.

You'll be prompted for an API key — get one (5-day free trial, no credit card) at [mcp.planitprima.com](https://mcp.planitprima.com). Or pass it explicitly:

```bash
npx -y @planit-tech/primamcp setup --client cursor --api-key sk-legal-...
# or via env:
PRIMAMCP_API_KEY=sk-legal-... npx -y @planit-tech/primamcp setup --client cursor
```

## Run as a server

The default subcommand (`serve`) is what MCP clients invoke when they spawn this binary:

```bash
PRIMAMCP_API_KEY=sk-legal-... npx -y @planit-tech/primamcp
# equivalent to:
PRIMAMCP_API_KEY=sk-legal-... npx -y @planit-tech/primamcp serve
```

It reads JSON-RPC frames from stdin and writes them back on stdout, while shuttling everything over HTTPS to PRIMAMCP.

## Manual config (without `setup`)

If you'd rather edit the client config yourself, the entry looks like this:

```json
{
  "mcpServers": {
    "primamcp": {
      "command": "npx",
      "args": ["-y", "@planit-tech/primamcp"],
      "env": {
        "PRIMAMCP_API_KEY": "sk-legal-..."
      }
    }
  }
}
```

VS Code uses `servers` instead of `mcpServers` — otherwise identical.

## Options

| Flag / env var | Default | Purpose |
| --- | --- | --- |
| `--api-key` / `PRIMAMCP_API_KEY` | — (required) | PRIMAMCP API key (`sk-legal-…`) |
| `--endpoint` / `PRIMAMCP_MCP_URL` | `https://mcp.planitprima.com/mcp` | Override only for staging or self-hosted |
| `--scope` (setup only) | `global` | `global` (user config) or `project` (current dir, cursor/vscode only) |

## What the bridge does

The bridge does **not** parse, reinterpret, or rewrite MCP messages. It just connects two transports back-to-back:

```
client (Claude / Cursor / …)  ⇄  stdio  ⇄  this bridge  ⇄  HTTPS  ⇄  PRIMAMCP
```

That means any future MCP method (tools, resources, prompts, sampling, …) works without code changes here — PRIMAMCP server-side is the single source of truth for capabilities.

## Why use this instead of direct HTTP?

- **Older client versions** that only spawn stdio subprocesses
- **Air-gapped or proxied networks** where you want a single outbound endpoint and per-process auth
- **Fewer config knobs** for users who'd rather paste a binary name than a URL + Bearer header
- **Discovery via npm** — Awesome-MCP lists, Reddit threads, and the npm registry index it as `@planit-tech/primamcp`

If your client speaks Streamable HTTP MCP natively, prefer the direct connection — one fewer process, no Node.js install required.

## Source

- Repo: [github.com/PLANIT-TECH/primamcp](https://github.com/PLANIT-TECH/primamcp)
- License: MIT (see [LICENSE](https://github.com/PLANIT-TECH/primamcp/blob/main/LICENSE))
- Bug reports & feature requests: [GitHub Issues](https://github.com/PLANIT-TECH/primamcp/issues)
- Security disclosure: `support@planitprima.com`

The hosted PRIMAMCP service itself is closed-source SaaS operated by **PLANIT // TECH GmbH** in Germany.
