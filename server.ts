import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from "zod";

// Create MCP server instance

const server = new McpServer ( {
    name : 'Weather Data Fetcher',
    version: '1.0.0'    
});

// A helper function to simulate fetching weather data
async function getWeatherByCity(city: string) {
  if (city.toLowerCase() === 'new york') {
    return { temp: '22°C', forecast: 'Partly cloudy with a breeze' };
  }
    if (city.toLowerCase() === 'london') {
    return { temp: '16°C', forecast: 'Rainy and overcast' };
  }
  return { temp: null, error: 'Weather data not available for this city' };
}

// Define a tool
server.tool(
   'getWeatherDataByCityName',
  'Get weather data for New York or London',
  {
    city: z.string().describe('Name of the city to get weather for')
  },

  async ({city}) => {
    const weatherData = await getWeatherByCity(city);
      return{
      content: [
        {
          type: 'text',
          text: JSON.stringify(weatherData)
        }
      ]
    };
  }
);

// Registering a static resource on the MCP server
server.registerResource(
  'weather-cities',  // name
  'weather://cities', // uri
  {
    mimeType: "text/plain"
  },  
 
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: `Supported Cities:\n- London (UK)\n- New York (USA)`
    }]
  })
);

async function init() {
  const transport = new StdioServerTransport();
  server.connect(transport);
  console.error('🌤️  Weather MCP Server Started!');
  console.error('🛠️  Tool: getWeatherDataByCityName');
  console.error('📚  Resource: weather://cities');
  console.error('🏙️  Supported Cities: New York, London');
  console.error('✅  Server ready!');
}

init().catch(console.error);
