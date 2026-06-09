import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { DropiClient } from "./dropi-client.js";

// ── Auth ──────────────────────────────────────────────────────────────────────
const token = process.env.DROPI_TOKEN;
if (!token) {
  console.error("Missing required env var: DROPI_TOKEN");
  process.exit(1);
}

const dropi = new DropiClient({ token });

// ── Server ────────────────────────────────────────────────────────────────────
const server = new McpServer({
  name: "mcp-dropi",
  version: "1.0.0",
});

// ── Resources ─────────────────────────────────────────────────────────────────

// dropi://products — catálogo paginado
server.resource(
  "products",
  new ResourceTemplate("dropi://products{?page,per_page,search}", {
    list: async () => ({
      resources: [{ name: "Catálogo de productos Dropi", uri: "dropi://products" }],
    }),
  }),
  async (uri) => {
    const params = Object.fromEntries(new URL(uri.href).searchParams);
    const result = await dropi.listProducts({
      page: params.page ? Number(params.page) : 1,
      per_page: params.per_page ? Number(params.per_page) : 20,
      search: params.search,
    });
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// dropi://products/:id — detalle de producto
server.resource(
  "product",
  new ResourceTemplate("dropi://products/{id}", {
    list: undefined,
  }),
  async (uri, { id }) => {
    const product = await dropi.getProduct(Number(id));
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(product, null, 2),
        },
      ],
    };
  }
);

// dropi://orders/:id — detalle de orden
server.resource(
  "order",
  new ResourceTemplate("dropi://orders/{id}", {
    list: undefined,
  }),
  async (uri, { id }) => {
    const order = await dropi.getOrder(Number(id));
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(order, null, 2),
        },
      ],
    };
  }
);

// dropi://account — perfil y saldo
server.resource(
  "account",
  new ResourceTemplate("dropi://account", {
    list: async () => ({
      resources: [{ name: "Cuenta Dropi", uri: "dropi://account" }],
    }),
  }),
  async (uri) => {
    const [profile, balance] = await Promise.all([
      dropi.getProfile(),
      dropi.getBalance(),
    ]);
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify({ profile, balance }, null, 2),
        },
      ],
    };
  }
);

// ── Tools ─────────────────────────────────────────────────────────────────────

server.tool(
  "dropi_list_products",
  "Lista productos del catálogo Dropi con filtros opcionales.",
  {
    page: z.number().int().min(1).default(1).describe("Número de página"),
    per_page: z.number().int().min(1).max(100).default(20).describe("Resultados por página"),
    search: z.string().optional().describe("Búsqueda por nombre o SKU"),
    category: z.string().optional().describe("Filtrar por categoría"),
  },
  async (params) => {
    const result = await dropi.listProducts(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "dropi_get_product",
  "Obtiene el detalle completo de un producto por ID, incluyendo variantes.",
  {
    product_id: z.number().int().describe("ID del producto en Dropi"),
  },
  async ({ product_id }) => {
    const product = await dropi.getProduct(product_id);
    return {
      content: [{ type: "text", text: JSON.stringify(product, null, 2) }],
    };
  }
);

server.tool(
  "dropi_get_product_stock",
  "Consulta el stock disponible de un producto y sus variantes.",
  {
    product_id: z.number().int().describe("ID del producto"),
  },
  async ({ product_id }) => {
    const stock = await dropi.getProductStock(product_id);
    return {
      content: [{ type: "text", text: JSON.stringify(stock, null, 2) }],
    };
  }
);

server.tool(
  "dropi_create_order",
  "Crea una nueva orden de dropshipping en Dropi.",
  {
    product_id: z.number().int().describe("ID del producto"),
    variant_id: z.number().int().optional().describe("ID de variante (si aplica)"),
    quantity: z.number().int().min(1).describe("Cantidad a ordenar"),
    customer_name: z.string().describe("Nombre completo del cliente"),
    customer_email: z.string().email().describe("Email del cliente"),
    customer_phone: z.string().describe("Teléfono del cliente"),
    shipping_address: z.string().describe("Dirección de envío"),
    shipping_city: z.string().describe("Ciudad"),
    shipping_province: z.string().describe("Provincia"),
    shipping_postal_code: z.string().describe("Código postal"),
  },
  async (params) => {
    const order = await dropi.createOrder(params);
    return {
      content: [{ type: "text", text: JSON.stringify(order, null, 2) }],
    };
  }
);

server.tool(
  "dropi_get_order",
  "Obtiene el detalle de una orden existente por ID.",
  {
    order_id: z.number().int().describe("ID de la orden en Dropi"),
  },
  async ({ order_id }) => {
    const order = await dropi.getOrder(order_id);
    return {
      content: [{ type: "text", text: JSON.stringify(order, null, 2) }],
    };
  }
);

server.tool(
  "dropi_list_orders",
  "Lista órdenes con filtros por estado y rango de fechas.",
  {
    page: z.number().int().min(1).default(1),
    per_page: z.number().int().min(1).max(100).default(20),
    status: z
      .enum(["pending", "processing", "shipped", "delivered", "cancelled"])
      .optional()
      .describe("Estado de la orden"),
    from: z.string().optional().describe("Fecha desde (YYYY-MM-DD)"),
    to: z.string().optional().describe("Fecha hasta (YYYY-MM-DD)"),
  },
  async (params) => {
    const result = await dropi.listOrders(params);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "dropi_cancel_order",
  "Cancela una orden existente.",
  {
    order_id: z.number().int().describe("ID de la orden a cancelar"),
    reason: z.string().optional().describe("Motivo de cancelación"),
  },
  async ({ order_id, reason }) => {
    const result = await dropi.cancelOrder(order_id, reason);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "dropi_get_tracking",
  "Obtiene el tracking y estado de envío de una orden.",
  {
    order_id: z.number().int().describe("ID de la orden"),
  },
  async ({ order_id }) => {
    const tracking = await dropi.getOrderTracking(order_id);
    return {
      content: [{ type: "text", text: JSON.stringify(tracking, null, 2) }],
    };
  }
);

server.tool(
  "dropi_get_balance",
  "Consulta el saldo disponible y pendiente de tu cuenta Dropi.",
  {},
  async () => {
    const balance = await dropi.getBalance();
    return {
      content: [{ type: "text", text: JSON.stringify(balance, null, 2) }],
    };
  }
);

// ── Transport ─────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("mcp-dropi running on stdio");
