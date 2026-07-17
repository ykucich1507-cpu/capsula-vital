# 🔗 Webhooks Shopify

El endpoint `app/api/webhooks/shopify/route.ts` recibe y verifica los webhooks de la tienda.

**URL en producción:** `https://<dominio-vercel>/api/webhooks/shopify`

## Topics manejados

| Topic | Qué hace |
|---|---|
| `orders/create` | Registra el pedido nuevo |
| `orders/paid` | Registra el pedido pagado |
| `orders/cancelled` | Registra la cancelación |
| `products/update` | Registra el producto actualizado |

Cualquier otro topic se loguea con prefijo `[unhandled]`.

## Seguridad

- La autenticidad se verifica con **HMAC-SHA256**
- Toda request debe traer el header `X-Shopify-Hmac-Sha256`
- Firma inválida o ausente → respuesta `401`
- El secreto vive en la variable de entorno `SHOPIFY_WEBHOOK_SECRET` — **nunca hardcodeada** (ver [[Reglas Críticas]])

## Cómo registrarlos en Shopify

1. Shopify Admin → **Settings → Notifications → Webhooks** → *Create webhook*
2. Elegir el evento (ej: `Order creation`), formato **JSON**
3. URL: la del endpoint en Vercel
4. Repetir para cada topic de la tabla

Para probar en local: `npm run dev` + túnel con ngrok (`ngrok http 3000`).

## Ojo: hay dos receptores

Además de esta app, **n8n también recibe webhooks de Shopify** (orden pagada y carrito abandonado) en sus propias URLs — ver [[Workflow n8n — Embudo Completo]] y [[Workflow n8n — Carritos Abandonados]].

Relacionado: [[App Next.js — Arquitectura]] · [[Temas de Shopify]]
