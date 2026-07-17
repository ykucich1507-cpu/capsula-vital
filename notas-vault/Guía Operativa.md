# 📖 Guía Operativa del Sistema de Ventas

*Versión 1.0 — Junio 2026. Fuente: `guia-yanitrend.html` (versión imprimible en el repo).*

Todo está automatizado. Una vez que un cliente ve tu anuncio, el sistema lo guía solo hasta la compra — vos solo intervenís cuando el cliente ya tiene **intención real de comprar**.

## 1. El flujo completo

1. 📱 **El cliente ve tu anuncio** en Meta Ads o Instagram → [[Campañas Activas]]
2. 🛍️ **Entra a la página de ofertas** — `yanitrend.com/pages/ofertas-especiales` — ve los 3 [[Productos y Precios|productos]], testimonios y FAQ
3. 🤖 **Chatea con el bot del funnel** — deja nombre y teléfono, el sistema lo guarda como lead
4. 📧 **Recibís email de alerta inmediata** con nombre, teléfono y producto de interés
5. 💬 **El cliente recibe WhatsApp automático** de bienvenida con producto y precio
6. ⏰ **Sin respuesta en 24hs** → recordatorio automático con urgencia de stock
7. ✅ **Venta confirmada** → WhatsApp de confirmación + seguimiento post-venta a los 3 días

Los detalles técnicos de cada paso están en [[Workflow n8n — Embudo Completo]].

## 2. Qué hace el sistema solo

| Evento | Cuándo | Acción automática |
|---|---|---|
| 🆕 Nuevo lead | Inmediato | Email a vos + WhatsApp al cliente |
| 😴 Sin respuesta | 24hs después | WhatsApp recordatorio |
| 🛒 Carrito abandonado | 1h después | Email + WhatsApp recordatorio |
| 🛒 Carrito abandonado | 24hs después | Email urgencia + WhatsApp "última oportunidad" |
| ✅ Venta confirmada | Inmediato | Email a vos + WhatsApp confirmación |
| 📦 Post-venta | 3 días después | WhatsApp preguntando cómo llegó + oferta 2ª compra |
| 📱 DM Instagram | Inmediato | Respuesta según intención + link WhatsApp |
| 💬 DM sin respuesta | 2hs después | Follow-up automático por Instagram |

Ver [[Workflow n8n — Carritos Abandonados]] y [[Workflow n8n — Instagram DM]].

## 3. URLs y accesos

**Tu tienda:**
- https://yanitrend.com
- https://yanitrend.com/pages/ofertas-especiales
- https://yanitrend.com/dashboard

**n8n (automatizaciones):** https://yanitrend.app.n8n.cloud

**Webhooks de n8n** (para configurar en Shopify y Meta):
- `/webhook/yanitrend-lead`
- `/webhook/shopify-order-paid`
- `/webhook/shopify-abandoned-cart`
- `/webhook/instagram-webhook`

**Plataformas:**

| Plataforma | URL | Para qué |
|---|---|---|
| Shopify Admin | admin.shopify.com | Pedidos, productos, stock |
| Meta Ads | adsmanager.facebook.com | Campañas publicitarias |
| Meta Developers | developers.facebook.com | WhatsApp y webhooks |
| Resend | resend.com | Emails automáticos |
| Vercel | vercel.com | Hosting del bot |

## 4. El dashboard de leads

Entrá a **yanitrend.com/dashboard** para gestionar los leads. Estados:

- 🆕 **Nuevo** — recién capturado, el sistema ya le mandó WhatsApp automático
- 📞 **Contactado** — ya hablaste con el cliente
- ✅ **Vendido** — compra confirmada (se actualiza solo cuando paga en Shopify)
- ❌ **Perdido** — no se interesó; marcalo para limpiar el pipeline

> [!tip] Cerrar una venta desde el dashboard
> Clic en el lead → panel derecho → botón "Contactar por WhatsApp" → se abre WhatsApp con el número del cliente.

## 5. Checklist semanal

- [ ] Revisé los leads nuevos de la semana en el dashboard
- [ ] Contacté manualmente a los leads con score mayor a 70
- [ ] Actualicé el estado de los leads (vendido / perdido)
- [ ] Revisé el rendimiento de campañas en Meta Ads
- [ ] Chequeé que los workflows de n8n estén Published
- [ ] Renové el token de WhatsApp si tiene más de 20 días
- [ ] Publiqué al menos 1 contenido en Instagram (@yani.trend)
- [ ] Revisé el stock en Shopify

Ver también: [[Rutina Diaria]] · [[Solución de Problemas]]
