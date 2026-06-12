# yanitrend-mcp — Instagram MCP Server

Servidor MCP para conectar Claude con la cuenta de Instagram **yani.trend**.

## Configuración en tu PC (C:\claude\yanitrend-mcp)

### 1. Instalar dependencias
```powershell
cd C:\claude\yanitrend-mcp
npm.cmd install
```

### 2. Crear archivo .env
```
INSTAGRAM_ACCESS_TOKEN=<tu_token>
INSTAGRAM_USER_ID=<tu_user_id>
```

### 3. Obtener el token (si aún no lo tienes)
```powershell
node get-token.js
```
Luego abrir http://localhost:3000 y hacer clic en "Conectar con Instagram".

### 4. Configurar Claude Desktop
Abrir `%APPDATA%\Claude\claude_desktop_config.json` y agregar:
```json
{
  "mcpServers": {
    "yanitrend-instagram": {
      "command": "node",
      "args": ["C:\\claude\\yanitrend-mcp\\index.js"]
    }
  }
}
```
Luego reiniciar Claude Desktop.

## Herramientas disponibles
- **get_profile** — Ver perfil de yani.trend
- **get_posts** — Ver últimas publicaciones
- **publish_photo** — Publicar una foto con caption
- **get_token_info** — Verificar estado del token
- **get_insights** — Ver métricas de una publicación
