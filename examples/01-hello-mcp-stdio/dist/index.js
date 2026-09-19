"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@modelcontextprotocol/server");
const stdio_1 = require("@modelcontextprotocol/server/stdio");
const z = __importStar(require("zod/v4"));
const server = new server_1.McpServer({
    name: "starter",
    version: "1.0.0",
});
// Register a simple tool that greets someone by name
server.registerTool("greet", {
    description: "Greet someone by name",
    inputSchema: z.object({ name: z.string() }),
}, async ({ name }) => ({
    content: [{ type: "text", text: `Hello, ${name}!` }],
}));
// the getWeather function simulates fetching weather data for a given city. In a real-world scenario, you would replace this with an actual API call to a weather service.
const getWeather = async (city) => {
    return `The weather in ${city} is sunny.`;
};
// Register a tool that fetches weather data for a given city
server.registerTool("getWeatherData", {
    description: "Get the weather for a specific city",
    inputSchema: z.object({ city: z.string() }),
}, async ({ city }) => {
    const weather = await getWeather(city);
    return {
        content: [{ type: "text", text: weather }],
    };
});
// Start the server and listen for incoming requests
async function main() {
    const transport = new stdio_1.StdioServerTransport();
    await server.connect(transport);
}
main();
