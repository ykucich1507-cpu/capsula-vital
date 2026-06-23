# Yani Trend — Contexto del Proyecto

## 1. Qué es este proyecto

Yani Trend es una tienda de e-commerce argentina que vende productos de hogar, tecnología y bienestar (incluyendo suplementos como Neocell Colágeno) usando el modelo de dropshipping con pago contra entrega. Este repositorio contiene la app Next.js que funciona como homepage pública y receptor de webhooks de Shopify.

---

## 2. Datos de la tienda

- **Nombre:** Yani Trend
- **Dominio:** yanitrend.com
- **Plataforma:** Shopify (plan Basic)
- **Moneda:** ARS (Pesos Argentinos)
- **País:** Argentina
- **Email:** ykucich1507@gmail.com

---

## 3. Stack técnico

- **Next.js 14** (App Router, TypeScript) — homepage y API routes
- **Shopify Admin API** (MCP) — gestión de productos, temas, menús, inventario
- **Dropi API** (JWT Bearer token) — dropshipping desde app.dropi.ar
- **Meta Ads API** (MCP) — creación y gestión de campañas publicitarias
- **Mercado Pago SDK v3** — Checkout Pro (preferencias → init_point)
- **WhatsApp Business API** (Meta Graph v20.0) — bot de ventas con 4 pasos
- **Resend** — emails transaccionales de pedidos nuevos
- **Webhook receiver** — `app/api/webhooks/shopify/route.ts` — escucha orders/create, orders/paid, orders/cancelled, products/update
- **Rama activa:** `claude/eloquent-einstein-s0tghc`
- **Deploy:** `https://yanitrend-bot.vercel.app` (Vercel, proyecto `yanitrend-bot`)

---

## 4. Cuentas publicitarias de Meta Ads

| ID | Nombre | Estado | MCP |
|---|---|---|---|
| `1309758261308011` | Principal activa | ACTIVE ✅ | Habilitado |
| `769660002060931` | Secundaria | ACTIVE ✅ | Habilitado |
| `928420550064233` | Yani Trend (vieja) | PENDING_CLOSURE ⚠️ | Deshabilitado |
| `1533543578320210` | Colágeno (USD) | PENDING_CLOSURE ⚠️ | Sin acceso |

**Usar siempre la cuenta `1309758261308011` para campañas nuevas.**

---

## 5. Temas de Shopify

| Tema | ID | Estado |
|---|---|---|
| Dawn | `gid://shopify/OnlineStoreTheme/156704440552` | MAIN (activo) |
| Yani Trend — Branded | `gid://shopify/OnlineStoreTheme/156846063848` | UNPUBLISHED |

- El tema Branded tiene la homepage personalizada (`sections/yanitrend-homepage.liquid`)
- Para activar el diseño completo: publicar el tema Branded desde Shopify Admin

---

## 6. Campañas activas (última sesión)

- **YaniTrend 🌡️ ASC — Vaso Térmico Sensor [2026]** — `120248221437560270` — ACTIVE — Argentina completa
- **Neocell Colágeno — ASC Argentina [2026]** — `120248241097550270` — PAUSED (esperando imágenes reales)
- **Neocell Colágeno — Tráfico LP — JUN 2026** — `120247950289810270` — ACTIVE
- **Vitalidad Natural — ASC Colágeno [CBO]** — `120248230854020270` — ACTIVE

---

## 7. Cómo hablarme

- Siempre en **español con voseo** (decime, hacé, revisá, avisame)
- Explicame **cada paso** antes de ejecutarlo
- Si vas a tocar algo importante (temas en vivo, campañas activas, archivos de producción), **pedime confirmación primero**
- Cuando termines una tarea, **resumí en 2 líneas** qué hiciste y qué sigue

---

## 8. Estado del sistema de ventas (sesión 2026-06-23)

### ✅ Completado y deployado en producción

| Qué | Archivo | Estado |
|-----|---------|--------|
| Checkout web con formulario completo | `app/checkout/page.tsx` | ✅ Live |
| API de preferencias Mercado Pago | `app/api/mercadopago/preference/route.ts` | ✅ Live |
| Páginas post-pago (success / error) | `app/checkout/success/` y `error/` | ✅ Live |
| Bot WhatsApp genera link de MP en el chat | `app/api/webhooks/whatsapp/route.ts` | ✅ Live |
| Funnel `/funnel` con botón "Pagar ahora" | `app/funnel/page.tsx` | ✅ Live |
| Dashboard con PIN (`yani2026`) | `app/dashboard/page.tsx` | ✅ Live |
| Landing → botón CTA apunta a `/funnel` | `app/page.tsx` | ✅ Live |

### Variables de entorno en Vercel (proyecto `yanitrend-bot`)

```
MERCADOPAGO_ACCESS_TOKEN  → APP_USR-2483742573708598-... ✅
MERCADOPAGO_PUBLIC_KEY    → APP_USR-d615e43d-...         ✅
NEXT_PUBLIC_BASE_URL      → https://yanitrend-bot.vercel.app ✅
WHATSAPP_ACCESS_TOKEN     → pendiente configurar
WHATSAPP_PHONE_NUMBER_ID  → pendiente configurar
RESEND_API_KEY            → pendiente configurar
```

### Flujo de venta (opción B — WhatsApp nativo)

```
Meta Ads → /funnel (captura nombre+tel) → WhatsApp bot
→ bot pide producto + datos de envío
→ bot llama MP API → genera init_point
→ envía link de pago directo en el chat
→ cliente paga en MP → llega a /checkout/success
```

### ⏳ Pendiente para próxima sesión

1. **Crear anuncio en Meta Ads** para el Vaso Térmico con Sensor
   - Cuenta: `1309758261308011`
   - Campaña existente: `YaniTrend 🌡️ ASC — Vaso Térmico Sensor [2026]` (ID: `120248221437560270`)
   - Página Meta: `1140428232489961`
   - Destino del anuncio: `https://yanitrend-bot.vercel.app/funnel`
   - Imagen del producto disponible en Shopify CDN
   - Necesita: imagen creativa, copy del anuncio, configurar ad set

2. **WhatsApp Business API** — configurar número 5492996593402
   - Agregar `WHATSAPP_ACCESS_TOKEN` y `WHATSAPP_PHONE_NUMBER_ID` en Vercel

3. **Resend email** — verificar dominio yanitrend.com, agregar `RESEND_API_KEY`

4. **Actualizar Next.js** de 14.2.3 a versión sin vulnerabilidades (pendiente confirmación)

---

## 9. Cosas críticas antes de tocar algo

- **NUNCA usar `vitalidart.com`** — esa era la tienda anterior. Siempre `yanitrend.com`
- **NO modificar el tema Dawn (MAIN)** sin confirmación — es la tienda en vivo
- **NO activar campañas** sin que yo lo confirme explícitamente
- **NO pausar campañas activas** sin revisar primero si son las correctas
- La tienda puede tener **contraseña activa** (Shopify password protection) — verificar si el sitio da 403
- El webhook secret vive en `SHOPIFY_WEBHOOK_SECRET` (variable de entorno, nunca hardcodeada)
- La página de Meta `1140428232489961` es la única página vinculada a los creativos
