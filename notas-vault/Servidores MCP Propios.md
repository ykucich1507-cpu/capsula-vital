# 🔌 Servidores MCP Propios

Claude creó dos **servidores MCP** (Model Context Protocol) a medida — conectores para que Claude pueda operar directamente sobre tus plataformas.

## MCP de Dropi

*Ramas: `claude/happy-pascal-f97x4d` y `claude/intelligent-sales-funnel-sgjfu2` — carpeta `mcp-dropi/`*

Esqueleto de servidor MCP en TypeScript para **app.dropi.ar** (el proveedor de dropshipping):

- `src/dropi-client.ts` — cliente de la API de Dropi (JWT Bearer token)
- `src/index.ts` — el servidor MCP con sus herramientas
- `claude_mcp_config.json` — config lista para enchufar a Claude
- `.env.example` — variables necesarias (token de Dropi)

Con esto Claude podría consultar catálogo, stock y pedidos de Dropi directamente.

## MCP de Instagram

*Rama: `claude/dreamy-bell-rSmcn`*

Servidor MCP en JavaScript para **@yani.trend**:

- `index.js` — servidor con herramientas de Instagram (publicar, leer, métricas)
- `get-token.js` — script para obtener/renovar el token de Meta
- `claude_mcp_config.json` + `README.md` con la instalación

> [!note] Estado
> Ambos son esqueletos funcionales pero **no están instalados** — para usarlos hay que bajar la carpeta, poner los tokens en `.env` y agregar el server a la config de Claude.

Relacionado: [[Proyectos en la Nube]] · [[Yani Trend — Contexto del Negocio]] (stack técnico)
