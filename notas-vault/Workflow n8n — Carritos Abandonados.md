# 🛒 Workflow n8n — Carritos Abandonados

*Archivo: `n8n-carritos-abandonados-yanitrend.json` — importar en https://yanitrend.app.n8n.cloud*

Recupera ventas de clientes que llegaron al checkout de Shopify pero no compraron.

## Flujo

Webhook: `/webhook/shopify-abandoned-cart`

1. **Webhook — Carrito Abandonado Shopify** recibe el evento
2. **Responder OK a Shopify**
3. **Extraer Datos del Carrito** (código) — nombre, email, teléfono, productos, total
4. **¿Tiene email o teléfono?** — si no hay contacto, termina
5. **Esperar 1 hora**
6. **Email 1 — Recordatorio 1h** → "te quedó algo en el carrito"
7. **¿Tiene teléfono?** → **WhatsApp — Recordatorio Carrito 1h**
8. **Esperar 23hs más** (total 24hs)
9. **Email 2 — Urgencia 24hs** → "última oportunidad"
10. **WhatsApp — Urgencia 24hs**
11. **Email — Alerta Interna** → te avisa a vos del carrito abandonado

## Cadencia resumida

| Momento | Canal | Mensaje |
|---|---|---|
| +1 hora | Email + WhatsApp | Recordatorio amable |
| +24 horas | Email + WhatsApp | Urgencia / última oportunidad |

## Relacionado

- [[Workflow n8n — Embudo Completo]] — el flujo principal de leads
- [[Guía Operativa]] — tabla completa de automatizaciones
- [[Solución de Problemas]] — si los mensajes no salen
