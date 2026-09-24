import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const DEFAULT_ENDPOINT = "https://mcp.planitprima.com/mcp";

export interface BridgeOptions {
  endpoint?: string;
  apiKey?: string;
}

export async function runBridge(options: BridgeOptions = {}): Promise<void> {
  const endpoint = options.endpoint ?? process.env.PRIMAMCP_MCP_URL ?? DEFAULT_ENDPOINT;
  const apiKey = options.apiKey ?? process.env.PRIMAMCP_API_KEY;

  if (!apiKey) {
    process.stderr.write(
      "primamcp: missing API key. Set PRIMAMCP_API_KEY (env) or pass --api-key.\n" +
      "             Get a key at https://mcp.planitprima.com (5-day free trial).\n"
    );
    process.exit(1);
  }

  const upstream = new StreamableHTTPClientTransport(new URL(endpoint), {
    requestInit: {
      headers: { Authorization: `Bearer ${apiKey}` },
    },
  });

  const local = new StdioServerTransport();

  // Bidirectional pipe: every JSON-RPC message on one transport is forwarded
  // verbatim to the other. The bridge does not parse or reinterpret the
  // protocol — it just shuttles frames, so any future MCP method works
  // without code changes here.
  local.onmessage = (msg) => {
    upstream.send(msg).catch((err: unknown) => {
      process.stderr.write(`primamcp: upstream send failed: ${formatError(err)}\n`);
    });
  };
  upstream.onmessage = (msg) => {
    local.send(msg).catch((err: unknown) => {
      process.stderr.write(`primamcp: local send failed: ${formatError(err)}\n`);
    });
  };

  const closeBoth = async (): Promise<void> => {
    await Promise.allSettled([local.close(), upstream.close()]);
  };
  local.onclose = () => {
    void closeBoth().finally(() => process.exit(0));
  };
  upstream.onclose = () => {
    void closeBoth().finally(() => process.exit(0));
  };
  local.onerror = (err) => {
    process.stderr.write(`primamcp: local transport error: ${formatError(err)}\n`);
  };
  upstream.onerror = (err) => {
    process.stderr.write(`primamcp: upstream transport error: ${formatError(err)}\n`);
  };

  process.on("SIGINT", () => {
    void closeBoth().finally(() => process.exit(0));
  });
  process.on("SIGTERM", () => {
    void closeBoth().finally(() => process.exit(0));
  });

  await upstream.start();
  await local.start();
}

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
