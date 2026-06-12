#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const USER_ID = process.env.INSTAGRAM_USER_ID;
const BASE_URL = "https://graph.instagram.com/v21.0";

const server = new Server(
  { name: "yanitrend-instagram", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_profile",
      description: "Obtiene el perfil de Instagram de yani.trend",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "get_posts",
      description: "Obtiene las últimas publicaciones de yani.trend",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Cantidad de posts a obtener (máximo 25)",
          },
        },
      },
    },
    {
      name: "publish_photo",
      description: "Publica una foto en Instagram con caption",
      inputSchema: {
        type: "object",
        required: ["image_url", "caption"],
        properties: {
          image_url: {
            type: "string",
            description: "URL pública de la imagen a publicar",
          },
          caption: {
            type: "string",
            description: "Texto del caption para la publicación",
          },
        },
      },
    },
    {
      name: "get_token_info",
      description: "Verifica la información y estado del token de acceso",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "get_insights",
      description: "Obtiene métricas e insights de una publicación",
      inputSchema: {
        type: "object",
        required: ["media_id"],
        properties: {
          media_id: {
            type: "string",
            description: "ID de la publicación",
          },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get_profile") {
      const response = await axios.get(`${BASE_URL}/${USER_ID}`, {
        params: {
          fields: "id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website",
          access_token: ACCESS_TOKEN,
        },
      });
      return {
        content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
      };
    }

    if (name === "get_posts") {
      const limit = args?.limit || 10;
      const response = await axios.get(`${BASE_URL}/${USER_ID}/media`, {
        params: {
          fields: "id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,permalink",
          limit,
          access_token: ACCESS_TOKEN,
        },
      });
      return {
        content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
      };
    }

    if (name === "publish_photo") {
      const { image_url, caption } = args;

      // Step 1: Create media container
      const containerResponse = await axios.post(
        `${BASE_URL}/${USER_ID}/media`,
        null,
        {
          params: {
            image_url,
            caption,
            access_token: ACCESS_TOKEN,
          },
        }
      );
      const containerId = containerResponse.data.id;

      // Step 2: Publish the container
      const publishResponse = await axios.post(
        `${BASE_URL}/${USER_ID}/media_publish`,
        null,
        {
          params: {
            creation_id: containerId,
            access_token: ACCESS_TOKEN,
          },
        }
      );

      return {
        content: [
          {
            type: "text",
            text: `✅ Publicación exitosa!\nID del post: ${publishResponse.data.id}\nURL del contenedor: ${containerId}`,
          },
        ],
      };
    }

    if (name === "get_token_info") {
      const response = await axios.get(`${BASE_URL}/me`, {
        params: {
          fields: "id,username",
          access_token: ACCESS_TOKEN,
        },
      });
      return {
        content: [
          {
            type: "text",
            text: `Token válido ✅\nUsuario: ${response.data.username}\nID: ${response.data.id}`,
          },
        ],
      };
    }

    if (name === "get_insights") {
      const { media_id } = args;
      const response = await axios.get(`${BASE_URL}/${media_id}/insights`, {
        params: {
          metric: "impressions,reach,likes,comments,shares,saved",
          access_token: ACCESS_TOKEN,
        },
      });
      return {
        content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
      };
    }

    return {
      content: [{ type: "text", text: `Herramienta desconocida: ${name}` }],
      isError: true,
    };
  } catch (error) {
    const msg = error.response?.data
      ? JSON.stringify(error.response.data, null, 2)
      : error.message;
    return {
      content: [{ type: "text", text: `❌ Error: ${msg}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
