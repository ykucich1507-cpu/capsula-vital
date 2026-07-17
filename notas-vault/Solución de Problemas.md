# 🔧 Solución de Problemas Frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| No llegan emails | Token de Resend vencido o sin créditos | Revisá resend.com → API Keys |
| WhatsApp no responde | Token de Meta vencido (dura 24hs) | Generá nuevo token en developers.facebook.com |
| n8n no ejecuta | Workflow en pausa o credencial vencida | Entrá a n8n → verificá que estén **Published** |
| Leads no aparecen en dashboard | `/tmp` se resetea en Vercel | Normal — los leads viven hasta el próximo deploy |
| Instagram DM sin respuesta | Token de página vencido | Renovar Page Token en Meta for Developers |
| El sitio da 403 | Contraseña de Shopify activa | Revisar password protection → [[Temas de Shopify]] |

## Dónde mirar según el síntoma

- **Falla algo del embudo de leads** → [[Workflow n8n — Embudo Completo]]
- **No se recuperan carritos** → [[Workflow n8n — Carritos Abandonados]]
- **Instagram muerto** → [[Workflow n8n — Instagram DM]]
- **Webhooks de la tienda con 401** → [[Webhooks Shopify]] (revisar `SHOPIFY_WEBHOOK_SECRET`)
- **Dashboard o funnel rotos** → [[App Next.js — Arquitectura]] (logs en Vercel)

> [!tip] Mantenimiento preventivo
> El checklist semanal de la [[Guía Operativa]] evita la mayoría de estos problemas (sobre todo renovar el token de WhatsApp a tiempo).
