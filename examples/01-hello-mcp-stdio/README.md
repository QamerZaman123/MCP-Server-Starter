# 01 — Hello MCP with stdio

This is the first self-contained lesson in the **MCP for Starters** repository.

It contains everything needed to run a small local MCP server: source code, package configuration, TypeScript configuration, compiled output, and an MCP client configuration file.

From this directory, run:

```bash
npm install
npm run build
npm start
```

> A stdio MCP server waits for an MCP client; it will not print a normal application screen when started by itself.

---

The repository-level [README](../../README.md) introduces MCP, its parts, and transports. This lesson focuses on putting those ideas into practice with a local stdio server.

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Build the project

```bash
npm run build
```

### 3. Run the server in dev mode

```bash
npm run dev
```

### 4. Or run the compiled version

```bash
npm start
```

> A stdio MCP server may look like it is doing nothing. That is normal. It is waiting for a client to connect and send requests.

## Project structure

```text
.
├── src/
│   └── index.ts
├── dist/
│   └── index.js
├── mcp.json
├── package.json
├── tsconfig.json
├── README.md
```

## How the MCP response structure works

This part is easy to miss, but it matters a lot.

When your server returns content, it usually looks like this:

```ts
{
  content: [{ type: "text", text: "Hello" }]
}
```

The key idea is:

- **`content` is required:** The response wrapper must explicitly feature a `content` property assigned to an array.
- **Array of Objects:** Every item inside that array must be a structured object (a Content Block).
- **`type: "text"`:** This is the **System Label / Category**. It dictates the layout of the block so the system knows to look for a text string rather than an image or a resource file.
- **`text: "Hello, Ada!"`:** This is the **Actual Payload**. It is the real message data the AI client reads.

So this is the correct beginner pattern:

```ts
{
  content: [{ type: "text", text: "Hello, Ada!" }]
}
```

The `type` tells the client how to read the block, and the `text` holds the actual message content.

## What is `mcp.json`?

`mcp.json` is a configuration file that tells an MCP client how to start or connect to your server.

It is useful because it lets you:

- share your server setup with a team
- reuse the same profile across different AI clients
- keep environment variables and connection details organized
- make setup more portable

A simple example looks like this:

```json
{
  "servers": {
    "starter": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/dist/index.js"]
    }
  }
}
```

The key idea is that the config is not the server itself. It is just the launch profile that tells the client how to start it.

This is especially helpful when you want to share a setup with others or run the same server in different tools.

## The example tools

### `greet`

Input:

```json
{ "name": "Ada" }
```

Output:

```text
Hello, Ada!
```

### `getWeatherData`

Input:

```json
{ "city": "London" }
```

Output:

```text
The weather in London is sunny.
```

These are demo tools. In real projects, you would replace them with API calls, database queries, or business logic.

## Test with MCP Inspector

[MCP Inspector](https://github.com/modelcontextprotocol/inspector) is the easiest tool to test your server.

### Build first

```bash
npm run build
```

### Start Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

Then open the local URL in your browser.

In Inspector, you can:

- view available tools
- run `greet`
- run `getWeatherData`
- inspect the tool payload and response

Example:

```json
{ "name": "Ada" }
```

should produce:

```text
Hello, Ada!
```

## How to add your own tool

The main file is `src/index.ts`.

This is the pattern:

```ts
server.registerTool(
  "myTool",
  {
    description: "What this tool does",
    inputSchema: z.object({
      name: z.string(),
    }),
  },
  async ({ name }) => ({
    content: [{ type: "text", text: `Hello, ${name}!` }],
  }),
);
```

To create a new tool:

1. choose a clear name
2. define the input schema
3. write the function
4. return MCP content
5. rebuild and test it

## Simple learning path

If you want to learn MCP step by step, do this:

1. Understand the host → client → server flow
2. Add one new tool in `src/index.ts`
3. Test it in Inspector
4. Replace the mock logic with a real API call
5. Add validation and better error handling
6. Move to HTTP when you are ready

## Common beginner mistakes

- forgetting to rebuild after code changes
- starting the server without a client
- not validating tool inputs
- expecting logs like a normal app
- overthinking the protocol before understanding the basic flow

## Scripts

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run build` | Compile TypeScript |
| `npm run dev` | Run in dev mode |
| `npm start` | Run the built server |
| `npm run typecheck` | Check TypeScript types |


## Next step

Once this makes sense, the next natural move is to turn one of the demo tools into a real project feature, like:

- a database query tool
- a GitHub integration
- a docs search tool
- a ticketing workflow
- a CRM or internal system tool

That is where MCP becomes genuinely useful.
