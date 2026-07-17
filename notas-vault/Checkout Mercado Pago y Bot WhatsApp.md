# 💳 Checkout Mercado Pago y Bot WhatsApp

*Rama: `claude/eloquent-einstein-s0tghc` (+ `claude/yanitrend-payment-updates-u9dbye`)*

El sistema de cobro completo con **Mercado Pago**, integrado al bot de WhatsApp.

## Qué incluye

- **Checkout web** — `app/checkout/page.tsx` con selector de producto, más páginas de éxito (`/checkout/success`) y error (`/checkout/error`)
- **API de preferencias MP** — `app/api/mercadopago/preference/route.ts`: crea la preferencia de pago y devuelve el link
- **Bot de WhatsApp que cobra en el chat** (Opción B): cuando el cliente completa el formulario en WhatsApp, el bot llama a la API de MP, crea la preferencia y manda el link de pago directo en la conversación — el cliente paga sin salir de WhatsApp
- **4to producto**: Nebulizador Mesh Inalámbrico $49.900 (keywords "4", "nebulizador") con funnel propio en `/funnel/nebulizador` (copy respiratorio/asma)
- **Dashboard con PIN** de acceso
- En la rama `yanitrend-payment-updates`: reemplazo de "pago contra entrega" por Mercado Pago en homepage y bot

## Integración Chatwoot (rama aparte)

La rama `claude/optimistic-curie-tvexfo` agrega **Chatwoot** como bandeja de conversaciones: los WhatsApp entrantes se copian a Chatwoot para que los veas ahí mientras el bot sigue respondiendo (`lib/chatwoot.ts` + webhook propio). Requiere variables `CHATWOOT_*`.

## Relacionado

- [[Proyectos en la Nube]] — índice de todas las ramas
- [[App Next.js — Arquitectura]] — la app donde se integra
- [[Productos y Precios]]
