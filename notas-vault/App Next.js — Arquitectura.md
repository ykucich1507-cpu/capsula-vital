# ⚙️ App Next.js — Arquitectura

La app de este repositorio (`capsula-vital`) corre en **Vercel** y es Next.js 14 con App Router y TypeScript. Funciona como homepage pública, funnel de ventas, dashboard de leads y receptor de webhooks.

## Estructura

```
app/
├── page.tsx                        → Homepage pública
├── layout.tsx                      → Layout raíz y metadata
├── funnel/page.tsx                 → Bot del funnel (captura de leads)
├── dashboard/page.tsx              → Dashboard de gestión de leads
├── notas/                          → Este vault de notas (estilo Obsidian)
└── api/
    ├── funnel/leads/route.ts       → GET/POST/PATCH de leads
    ├── webhooks/shopify/route.ts   → Receptor de webhooks Shopify
    ├── webhooks/whatsapp/route.ts  → Webhook de WhatsApp (GET verify + POST)
    └── instagram/report/route.ts   → Reporte de Instagram
```

## Piezas principales

- **Funnel** (`/funnel`) — el bot que chatea con el cliente y guarda nombre, teléfono y producto de interés como lead
- **Dashboard** (`/dashboard`) — panel para gestionar leads: nuevo → contactado → vendido/perdido. Ver [[Guía Operativa]]
- **API de leads** — `GET` lista, `POST` crea, `PATCH` actualiza estado
- **Webhooks** — ver [[Webhooks Shopify]] para el detalle del receptor

> [!note] Persistencia en Vercel
> Los leads se guardan en `/tmp`, que **se resetea con cada deploy**. Es una limitación conocida — ver [[Solución de Problemas]].

## Dependencias

`next 14.2.30` · `react 18` · `mercadopago` · `resend`

## Relacionado

- [[Yani Trend — Contexto del Negocio]] — el negocio detrás de la app
- [[Workflow n8n — Embudo Completo]] — las automatizaciones que se disparan desde acá
