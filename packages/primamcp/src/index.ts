#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { Command } from "commander";
import { runBridge } from "./bridge.js";
import { runSetup, type SupportedClient } from "./setup.js";

// Single source of truth for the version: package.json (always shipped in the
// published tarball). Avoids the constant drifting away from package.json.
const PKG_VERSION: string = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
).version;
const SUPPORTED_CLIENTS: readonly SupportedClient[] = ["claude", "cursor", "vscode", "windsurf"];

const program = new Command();

program
  .name("primamcp")
  .description(
    "Local MCP bridge for PRIMAMCP — verified, citable German & EU law for any MCP-capable AI assistant. " +
    "Forwards stdio MCP traffic to https://mcp.planitprima.com/mcp.",
  )
  .version(PKG_VERSION);

program
  .command("serve", { isDefault: true })
  .description("Run the stdio↔HTTPS bridge (default). Used by MCP clients that spawn this binary.")
  .option(
    "--api-key <key>",
    "PRIMAMCP API key (sk-legal-…). Falls back to PRIMAMCP_API_KEY env var.",
  )
  .option(
    "--endpoint <url>",
    "MCP endpoint URL. Defaults to https://mcp.planitprima.com/mcp; override via PRIMAMCP_MCP_URL env.",
  )
  .action(async (opts: { apiKey?: string; endpoint?: string }) => {
    try {
      await runBridge({
        apiKey: opts.apiKey,
        endpoint: opts.endpoint,
      });
    } catch (err) {
      process.stderr.write(`primamcp: bridge failed to start: ${formatError(err)}\n`);
      process.exit(1);
    }
  });

program
  .command("setup")
  .description("Write a PRIMAMCP server entry into a client's config file.")
  .requiredOption(
    "--client <name>",
    `Target client. One of: ${SUPPORTED_CLIENTS.join(", ")}.`,
  )
  .option(
    "--api-key <key>",
    "PRIMAMCP API key (sk-legal-…). Falls back to PRIMAMCP_API_KEY env var.",
  )
  .option(
    "--endpoint <url>",
    "MCP endpoint URL. Defaults to https://mcp.planitprima.com/mcp.",
  )
  .option(
    "--scope <scope>",
    "Either 'global' (default — user-level config) or 'project' (writes into the current directory). " +
    "Only relevant for cursor/vscode; claude is always global, windsurf is always global.",
    "global",
  )
  .action((opts: {
    client: string;
    apiKey?: string;
    endpoint?: string;
    scope: string;
  }) => {
    if (!isSupportedClient(opts.client)) {
      process.stderr.write(
        `primamcp: unsupported --client '${opts.client}'. ` +
        `Use one of: ${SUPPORTED_CLIENTS.join(", ")}.\n`,
      );
      process.exit(2);
    }
    if (opts.scope !== "global" && opts.scope !== "project") {
      process.stderr.write(`primamcp: --scope must be 'global' or 'project'.\n`);
      process.exit(2);
    }

    const apiKey = opts.apiKey ?? process.env.PRIMAMCP_API_KEY;
    if (!apiKey) {
      process.stderr.write(
        "primamcp: missing API key. Pass --api-key sk-legal-… or set PRIMAMCP_API_KEY.\n" +
        "             Get a key at https://mcp.planitprima.com (5-day free trial).\n",
      );
      process.exit(2);
    }

    try {
      const result = runSetup({
        client: opts.client,
        apiKey,
        endpoint: opts.endpoint,
        scope: opts.scope,
      });
      const verb = result.created ? "Created" : "Updated";
      process.stdout.write(
        `${verb} ${result.client} config: ${result.configPath}\n` +
        `Server entry: '${result.serverName}'.\n` +
        nextStepHint(result.client),
      );
    } catch (err) {
      process.stderr.write(`primamcp: setup failed: ${formatError(err)}\n`);
      process.exit(1);
    }
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  process.stderr.write(`primamcp: ${formatError(err)}\n`);
  process.exit(1);
});

function isSupportedClient(value: string): value is SupportedClient {
  return (SUPPORTED_CLIENTS as readonly string[]).includes(value);
}

function nextStepHint(client: SupportedClient): string {
  switch (client) {
    case "claude":
      return "Restart Claude Desktop (Quit, not just close the window) to pick up the new server.\n";
    case "cursor":
      return "Reload Cursor (Cmd/Ctrl+Shift+P → Reload Window) to pick up the new server.\n";
    case "vscode":
      return "Reload VS Code (Cmd/Ctrl+Shift+P → Developer: Reload Window) to pick up the new server.\n";
    case "windsurf":
      return "Restart Windsurf to pick up the new server.\n";
  }
}

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
