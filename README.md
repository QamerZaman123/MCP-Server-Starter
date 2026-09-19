# MCP for Starters

A progressive, hands-on repository for learning how to build Model Context Protocol (MCP) servers.

Each directory in [`examples/`](./examples) is a complete, standalone lesson. Enter the example you want to learn, install its dependencies, and run it without needing the other lessons.

## What is MCP?

MCP stands for Model Context Protocol. It is a standard way for AI applications to discover tools and call them in a structured way.

Instead of building custom logic for every app, you build one MCP server and let clients talk to it in a standard way. An AI app can ask what tools are available, call one with input, and use the result in its answer.

### Why MCP exists

Large language models do not have direct access to real-time data or your internal tools by default. MCP lets a model ask for the specific information or action it needs:

- the model asks for a tool
- the MCP server runs that tool
- the needed result comes back
- the model uses the result to answer the user

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

The server does not need to be an AI model. It exposes tools in a standard format.

## Who does what?

### Host

The app the user interacts with, such as a chat app, editor, or AI workflow tool.

### Client

The component that connects the host to the MCP server and handles protocol messages.

### Server

The project that exposes tools and executes them when called.

### Tool

A function with clear input and a result—for example, fetching weather, querying a database, or searching documentation.

## What is a transport?

A transport is how the MCP client and MCP server communicate.

- **stdio**: local process communication
- **Streamable HTTP**: network communication over HTTP

The first lesson uses stdio because it is easy to understand and test locally. Future lessons will introduce Streamable HTTP for independently running or remotely hosted servers.

> You may see older tutorials using SSE. It is an older remote pattern; Streamable HTTP is the newer transport direction to learn.

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

## Beginner takeaway

AI models need external capabilities; MCP gives them a standard way to access those capabilities. Tools are functions exposed by a server, and the transport determines how the client and server communicate.

## Official docs for deeper learning

For protocol details and current guidance, see the [official MCP documentation](https://modelcontextprotocol.io/).

## Learning path

| Example | What you learn |
| --- | --- |
| [`01-hello-mcp-stdio`](./examples/01-hello-mcp-stdio) | A minimal local MCP server using the stdio transport, plus two simple tools. |

More examples will build from this foundation while keeping every earlier lesson available in its original, runnable form.

## Run an example

```bash
cd examples/01-hello-mcp-stdio
npm install
npm run build
npm start
```

Read the README inside an example for its setup details, code walkthrough, and testing instructions.

## License

This project is meant for learning and experimentation.
