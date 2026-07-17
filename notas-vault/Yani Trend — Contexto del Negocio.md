# 🛍️ Yani Trend — Contexto del Negocio

**Yani Trend** es una tienda de e-commerce argentina que vende productos de hogar, tecnología y bienestar (incluyendo suplementos como Neocell Colágeno) usando el modelo de **dropshipping con pago contra entrega**.

## Datos de la tienda

| Dato | Valor |
|---|---|
| Nombre | Yani Trend |
| Dominio | yanitrend.com |
| Plataforma | Shopify (plan Basic) |
| Moneda | ARS (Pesos Argentinos) |
| País | Argentina |
| Email | ykucich1507@gmail.com |
| Instagram | @yani.trend |

## Stack técnico

- **Next.js 14** (App Router, TypeScript) — homepage y API routes → ver [[App Next.js — Arquitectura]]
- **Shopify Admin API** — gestión de productos, temas, menús e inventario → ver [[Temas de Shopify]]
- **Dropi API** (JWT Bearer token) — dropshipping desde app.dropi.ar
- **Meta Ads API** — creación y gestión de campañas → ver [[Cuentas Meta Ads]] y [[Campañas Activas]]
- **n8n Cloud** — automatizaciones de WhatsApp, email e Instagram → ver [[Workflow n8n — Embudo Completo]]
- **Resend** — envío de emails automáticos
- **Vercel** — hosting de la app y el bot

## Cómo funciona el sistema (resumen)

1. El cliente ve un anuncio de [[Campañas Activas|Meta Ads]]
2. Entra a la página de ofertas → ve los [[Productos y Precios]]
3. Chatea con el bot del funnel y deja sus datos
4. El [[Workflow n8n — Embudo Completo|embudo automático]] lo acompaña hasta la compra
5. Vos gestionás los leads desde el dashboard → ver [[Guía Operativa]]

## Antes de tocar cualquier cosa

Leé siempre las [[Reglas Críticas]] — hay temas en producción y campañas activas que no se tocan sin confirmación.
