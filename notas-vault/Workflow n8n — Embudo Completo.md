# 🤖 Workflow n8n — Embudo Completo

*Archivo: `n8n-embudo-yanitrend.json` — importar en https://yanitrend.app.n8n.cloud*

Es el workflow central del sistema de ventas: recibe leads nuevos y órdenes pagadas, y acompaña al cliente por WhatsApp desde la bienvenida hasta el post-venta.

## Rama 1 — Nuevo lead

Webhook: `/webhook/yanitrend-lead`

1. **Webhook — Nuevo Lead** recibe los datos del funnel (nombre, teléfono, producto)
2. **Responder OK** al instante
3. **Email — Notificar Nuevo Lead** → te llega la alerta con los datos
4. **WhatsApp — Mensaje Bienvenida** → el cliente recibe producto y precio
5. **Esperar 24hs**
6. **WhatsApp — Recordatorio 24hs** → urgencia de stock si no respondió

## Rama 2 — Orden pagada

Webhook: `/webhook/shopify-order-paid`

1. **Webhook — Orden Pagada Shopify** recibe el evento de pago
2. **Responder OK Shopify**
3. **Email — Confirmar Venta** → alerta interna de venta cerrada
4. **WhatsApp — Confirmar al Cliente** → confirmación de compra
5. **Esperar 3 días post-venta**
6. **WhatsApp — Post-venta 3 días** → pregunta cómo llegó + oferta de segunda compra

## Notas técnicas

- Los mensajes de WhatsApp salen por la **API de Meta** (HTTP Request con token) — el token vence cada 24hs, ver [[Solución de Problemas]]
- Los emails salen por SMTP/Resend
- El flujo completo del cliente está explicado en la [[Guía Operativa]]

## Relacionado

- [[Workflow n8n — Carritos Abandonados]]
- [[Workflow n8n — Instagram DM]]
- [[App Next.js — Arquitectura]] — el funnel que dispara la rama 1
- [[Webhooks Shopify]] — el otro receptor de eventos de Shopify
