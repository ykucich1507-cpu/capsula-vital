#!/usr/bin/env node
/**
 * Helper para obtener el token de Instagram via OAuth.
 * Uso: node get-token.js
 * Luego abrir http://localhost:3000 en el navegador.
 */
import http from "http";
import { URL } from "url";

const APP_ID = process.env.INSTAGRAM_APP_ID || "1021991870395995";
const APP_SECRET = process.env.INSTAGRAM_APP_SECRET || "8623210e814376c827043c5b71411228";
const REDIRECT_URI = "http://localhost:3000/callback";

const authUrl =
  `https://api.instagram.com/oauth/authorize` +
  `?client_id=${APP_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish` +
  `&response_type=code`;

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, "http://localhost:3000");

  if (reqUrl.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <h2>Instagram MCP - Obtener Token</h2>
      <p>Haz clic para conectar la cuenta <strong>yani.trend</strong>:</p>
      <a href="${authUrl}" style="font-size:18px;padding:10px 20px;background:#E1306C;color:white;text-decoration:none;border-radius:5px;">
        Conectar con Instagram
      </a>
    `);
    return;
  }

  if (reqUrl.pathname === "/callback") {
    const code = reqUrl.searchParams.get("code");
    if (!code) {
      res.writeHead(400);
      res.end("Error: no se recibió código de autorización");
      return;
    }

    try {
      const { default: axios } = await import("axios");
      const tokenRes = await axios.post(
        "https://api.instagram.com/oauth/access_token",
        new URLSearchParams({
          client_id: APP_ID,
          client_secret: APP_SECRET,
          grant_type: "authorization_code",
          redirect_uri: REDIRECT_URI,
          code,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { access_token, user_id } = tokenRes.data;

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`
        <h2>✅ Token obtenido con éxito!</h2>
        <p><strong>Agrega esto a tu archivo .env en C:\\claude\\yanitrend-mcp\\.env:</strong></p>
        <pre style="background:#f0f0f0;padding:15px;font-size:14px">
INSTAGRAM_ACCESS_TOKEN=${access_token}
INSTAGRAM_USER_ID=${user_id}
        </pre>
        <p>Puedes cerrar esta ventana y detener el servidor (Ctrl+C).</p>
      `);

      console.log("\n✅ TOKEN OBTENIDO:");
      console.log(`INSTAGRAM_ACCESS_TOKEN=${access_token}`);
      console.log(`INSTAGRAM_USER_ID=${user_id}`);
      console.log("\nCopia estas líneas en C:\\claude\\yanitrend-mcp\\.env");
    } catch (err) {
      const errorMsg = err.response?.data
        ? JSON.stringify(err.response.data, null, 2)
        : err.message;
      res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<h2>❌ Error al obtener token</h2><pre>${errorMsg}</pre>`);
    }
  }
});

server.listen(3000, () => {
  console.log("Servidor iniciado en http://localhost:3000");
  console.log("Abre ese enlace en tu navegador para autorizar Instagram.");
});
