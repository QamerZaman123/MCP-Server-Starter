# MCP for Starters

This repo is a simple beginner project for learning Model Context Protocol (MCP).

The idea is simple: MCP gives AI apps a standard way to use tools and data.

Think of it like this:

- your AI app is the brain
- the MCP client is the connector
- the MCP server is the tool provider
- the tools are the real actions your app can call

If you understand that flow, you understand most of MCP.

## What is MCP?

MCP stands for Model Context Protocol.

It is a standard way for AI applications to discover tools and call them in a structured way.

Instead of building custom logic for every app, you build one MCP server and let clients talk to it in a standard way.

So an AI app can say:

- "What tools do you have?"
- "Can you call this tool with this input?"
- "Here is the result. Use it in your answer."

That is MCP.

### Why MCP exists

Large language models are powerful, but they do not have direct access to real-time data or your internal tools by default.

They also have context limits, so giving them huge amounts of raw data is not efficient.

MCP solves this by letting the model ask for only the relevant information and tool action it needs.

In simple terms:

- the model asks for a tool
- the MCP server runs that tool
- only the needed result comes back
- the model uses that result to answer the user

This is why MCP is sometimes described as a standard way to connect AI to the outside world.

## Official docs for deeper learning

If you want to go beyond this starter, start with the official documentation:

- Official MCP docs: https://modelcontextprotocol.io/
- The docs are the best place to understand details, protocol behavior, and the latest transport guidance.

This repo is intentionally simple. The official docs are the place for deep technical detail.

> If you are learning from YouTube videos, remember that some older tutorials still mention SSE. In current MCP discussions, the newer direction is generally Streamable HTTP, while SSE is an older transport style.

## The simple picture

```text
User asks a question
   ↓
AI app / host
   ↓
MCP client
   ↓
MCP server
   ↓
Tool logic (your code)
   ↓
Result goes back to the AI app
```

The server does not need to be an AI model. It just exposes tools in a standard format.

## What is a transport?

A transport is just the way the MCP client and MCP server talk to each other.

Think of it like this:

- stdio = local process communication
- streamable HTTP = network communication over HTTP

### stdio (current)

This is what we are using right now.

The MCP client starts your server as a local process and sends messages through standard input/output.

This is great for:

- local development
- desktop tools
- testing with MCP Inspector
- simple project setup

It is easy to understand and easy to debug.

### Streamable HTTP (next)

This is the next transport we will add.

Instead of the client running the server as a local process, the server runs separately and communicates over HTTP.

This is useful when:

- the server runs in a container or cloud
- multiple clients need to connect
- the server should stay running all the time
- you want a more production-style setup

Some older videos mention SSE, which was an earlier remote transport approach. In beginner terms, the idea is similar: the server is remote and the host connects over HTTP. The newer standard direction is Streamable HTTP, which is the version to focus on as you learn the modern workflow.

So the short version is:

- stdio = local and simple
- streamable HTTP = remote and scalable
- SSE = older remote pattern you may see in older tutorials

## Current repo status

Right now, this project uses `stdio`.

In the future, we will add `Streamable HTTP` so the server can run independently and clients can connect over HTTP instead of starting it locally.

This is the best order for beginners:

1. learn local MCP with stdio
2. understand the server and tool flow
3. add a remote transport later
4. move to real integrations and production patterns

## Who does what?

### Host
This is the app the user interacts with, like a chat app, editor, or AI workflow tool.

### Client
This connects the host to the MCP server and handles the protocol messages.

### Server
This is your project. It says, "Here are the tools I can do." and then executes them when called.

### Tool
A tool is just a function with a clear input and a result.

For example:

- greet someone
- fetch weather
- query a database
- search docs
- create a ticket

## Why this repo matters

Most beginner MCP tutorials are either too abstract or too advanced.

This repo keeps it practical:

- small TypeScript server
- one clear tool setup
- easy local testing
- simple examples you can extend
- transport explained in beginner-friendly terms

You are not learning a huge framework here. You are learning the core pattern.

## What is in this project?

This starter includes:

- a minimal MCP server in TypeScript
- stdio transport for local development
- two example tools:
  - `greet`
  - `getWeatherData`
- a test setup using MCP Inspector
- beginner-focused notes to help explain the bigger picture

This is intentionally simple so you can focus on understanding the flow instead of getting lost in complexity.

## The beginner takeaway

The easiest way to understand MCP is this:

- AI models need external capabilities
- MCP gives them a standard way to access those capabilities
- tools are functions exposed by a server
- transport decides how the client and server communicate

Once you understand that, everything else becomes much easier.

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

## How a request works

This is the real workflow:

1. The client connects to the server.
2. The client asks, "What tools do you have?"
3. The server responds with tool metadata.
4. The AI app chooses a tool.
5. The client calls that tool with JSON input.
6. The server runs the code and returns a result.
7. The AI app uses the result to answer the user.

That is the heart of MCP.

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

## The one sentence version

MCP is a standard way for AI apps to call tools safely and consistently.

This repo gives you the simplest possible example of that pattern.

## Next step

Once this makes sense, the next natural move is to turn one of the demo tools into a real project feature, like:

- a database query tool
- a GitHub integration
- a docs search tool
- a ticketing workflow
- a CRM or internal system tool

That is where MCP becomes genuinely useful.

## License

This project is meant for learning and experimentation.

