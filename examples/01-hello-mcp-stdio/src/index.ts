import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

const server = new McpServer({
  name: "starter",
  version: "1.0.0",
});

// Register a simple tool that greets someone by name
server.registerTool(
  "greet",
  {
    description: "Greet someone by name",
    inputSchema: z.object({ name: z.string() }),
  },
  async ({ name }) => ({
    content: [{ type: "text", text: `Hello, ${name}!` }],
  }),
);

// the getWeather function simulates fetching weather data for a given city. In a real-world scenario, you would replace this with an actual API call to a weather service.
const getWeather = async (city: string) => {
  return `The weather in ${city} is sunny.`;
}

// Register a tool that fetches weather data for a given city
server.registerTool(
  "getWeatherData",
  {
    description: "Get the weather for a specific city",
    inputSchema: z.object({ city: z.string() }),
  },
  async ({ city }) => {
    const weather = await getWeather(city);
    return {
      content: [{ type: "text", text: weather }],
    };
  },
);

// Start the server and listen for incoming requests
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main();