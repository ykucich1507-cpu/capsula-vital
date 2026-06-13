# 🛍️ YANI TREND — Proyecto Completo de Automatización
**Generado:** 13 de junio de 2026  
**Dominio:** yanitrend.com | **Tienda:** bjusti-i6.myshopify.com  
**Email:** ykucich1507@gmail.com

---

## 📋 RESUMEN EJECUTIVO

Sistema completo de automatización para e-commerce dropshipping con pago contra entrega en Argentina. Incluye 14 workflows de n8n, app de marketing con IA, integración con Shopify, Meta Ads e Instagram.

---

## 🏗️ INFRAESTRUCTURA

| Componente | Plataforma | URL / ID |
|---|---|---|
| Tienda Shopify | Shopify Basic | bjusti-i6.myshopify.com |
| Automatizaciones | n8n Cloud | yanitrend.app.n8n.cloud |
| App web / Marketing AI | Vercel | capsula-vital-g11g.vercel.app |
| Repositorio código | GitHub | ykucich1507-cpu/capsula-vital |
| Cuenta Meta Ads principal | Meta Business | act_1309758261308011 |
| Página de Instagram | Instagram Business | yanitrend.ar |

---

## ⚙️ VARIABLES DE ENTORNO

### n8n (Settings → Credentials)
```
SHOPIFY_ACCESS_TOKEN     → [ver en Shopify Dev Dashboard → tu app → API credentials]
META_ACCESS_TOKEN        → pendiente (ver sección Estado)
INSTAGRAM_ACCOUNT_ID     → pendiente
INSTAGRAM_ACCESS_TOKEN   → pendiente
WHATSAPP_TOKEN           → pendiente
WHATSAPP_PHONE_ID        → pendiente
```

### Vercel (Settings → Environment Variables)
```
ANTHROPIC_API_KEY        → configurada ✅
```

---

## 🔗 WEBHOOKS SHOPIFY ACTIVOS

| Evento | URL n8n | Estado |
|---|---|---|
| Orden creada | https://yanitrend.app.n8n.cloud/webhook/36d8617e-7782-4e86-9c5c-f1974ca67037 | ✅ Activo |
| Orden cancelada | https://yanitrend.app.n8n.cloud/webhook/yanitrend-order-cancelled | ✅ Activo |
| Producto creado | https://yanitrend.app.n8n.cloud/webhook/yanitrend-product-created | ✅ Activo |

---

## 🤖 WORKFLOWS N8N — ESTADO COMPLETO

### ✅ FUNCIONANDO (operativos)

| # | Workflow | Trigger | Archivo |
|---|---|---|---|
| 1 | Orden Nueva → Email Gmail | Webhook Shopify | orden-nueva-notificacion.json |
| 2 | Reporte Diario de Ventas | Todos los días 8AM | reporte-diario-ventas.json |
| 3 | Alerta de Stock Bajo | Todos los días 8:30AM | alerta-stock-bajo.json |
| 4 | Alerta Orden Cancelada | Webhook Shopify | alerta-orden-cancelada.json |
| 5 | Caption Automático Producto Nuevo | Webhook Shopify | caption-automatico-producto-nuevo.json |

### 🟡 IMPORTADOS — Falta credencial Meta

| # | Workflow | Trigger | Falta |
|---|---|---|---|
| 6 | Meta Ads Reporte Diario | Todos los días 8AM | META_ACCESS_TOKEN |
| 7 | Meta Ads Pausa ROAS Bajo | 7AM y 7PM | META_ACCESS_TOKEN |
| 8 | Instagram Reporte Métricas | Todos los días 9AM | INSTAGRAM_ACCESS_TOKEN |
| 9 | Instagram Responder Comentarios IA | Cada 30 minutos | INSTAGRAM_ACCESS_TOKEN |
| 10 | Instagram Auto-Post | Lun/Mié/Vie 10AM · Mar/Jue 6PM | INSTAGRAM_ACCESS_TOKEN |
| 11 | Instagram DM Nuevos Seguidores | Cada 2 horas | INSTAGRAM_ACCESS_TOKEN |

### 🔴 IMPORTADOS — Falta WhatsApp API

| # | Workflow | Trigger | Falta |
|---|---|---|---|
| 12 | WhatsApp Confirmación de Pedido | Webhook Shopify | WHATSAPP_TOKEN + PHONE_ID |
| 13 | WhatsApp Seguimiento Post-Entrega | Todos los días 11AM | WHATSAPP_TOKEN + PHONE_ID |
| 14 | Recupero Carrito Abandonado | Cada hora | WHATSAPP_TOKEN + PHONE_ID |

---

## 🛠️ APP DE MARKETING AI

**URL:** yanitrend.com/marketing (una vez deployada en producción)  
**Archivo:** app/marketing/page.tsx  
**API:** app/api/marketing/generar/route.ts  
**Modelo IA:** claude-haiku-4-5-20251001

### Qué genera con un clic:
- 📱 Anuncio Meta Ads largo (120-180 palabras) + versión corta
- 📧 Asunto de email optimizado + cuerpo completo
- 📸 Caption Instagram con emojis + 20 hashtags para Argentina
- 💬 Mensaje de seguimiento WhatsApp
- 🛡️ 4 objeciones comunes con respuestas listas

### Productos preconfigurados:
- 🤖 Aspiradora Robot Jessica — ARS $38.630
- 🌡️ Vaso Térmico Sensor LED — ARS $24.500
- ✨ Neocell Colágeno — ARS $19.900

---

## 📊 ESTADO META ADS (al 13/06/2026)

| Campaña | Estado | Gasto 7d | Impresiones | Clicks |
|---|---|---|---|---|
| Neocell Colágeno — ASC Argentina | 🟢 ACTIVA | ARS $10.799 | 83.913 | 492 |
| YaniTrend 🌡️ ASC — Vaso Térmico Sensor | ⏸️ PAUSADA | ARS $12.661 | 14.529 | 564 |
| Promoción sitio web | 🟢 ACTIVA | ARS $2.079 | 1.644 | 69 |
| Neocell — Tráfico LP JUN 2026 | ⏸️ PAUSADA | ARS $7.805 | 7.887 | 229 |
| YaniTrend — Retargeting | ⏸️ PAUSADA | — | — | — |

**⚠️ Alerta:** El píxel no registra conversiones (ROAS sin datos) — revisar configuración del píxel en Events Manager.

---

## 📁 ESTRUCTURA DEL REPOSITORIO

```
capsula-vital/
├── app/
│   ├── page.tsx                    # Homepage Yani Trend
│   ├── layout.tsx                  # Layout principal
│   ├── dashboard/page.tsx          # Dashboard interno
│   ├── funnel/page.tsx             # Embudo de ventas
│   ├── marketing/page.tsx          # App Marketing AI ✨ NUEVO
│   └── api/
│       ├── marketing/generar/      # API generador IA ✨ NUEVO
│       └── webhooks/shopify/       # Receptor webhooks Shopify
├── n8n-workflows/                  # ✨ NUEVO — 14 workflows
│   ├── orden-nueva-notificacion.json
│   ├── reporte-diario-ventas.json
│   ├── alerta-stock-bajo.json
│   ├── alerta-orden-cancelada.json
│   ├── caption-automatico-producto-nuevo.json
│   ├── meta-ads-reporte-diario.json
│   ├── meta-ads-pausa-roas-bajo.json
│   ├── instagram-publicar-post.json
│   ├── instagram-responder-comentarios.json
│   ├── instagram-dm-nuevos-seguidores.json
│   ├── instagram-reporte-metricas.json
│   ├── whatsapp-confirmacion-pedido.json
│   ├── whatsapp-seguimiento-post-entrega.json
│   └── recupero-carrito-abandonado.json
├── .mcp.json                       # MCP n8n configurado
└── package.json
```

---

## 📅 PRÓXIMOS PASOS PRIORITARIOS

### Esta semana:
1. **Obtener META_ACCESS_TOKEN** — Graph API Explorer → app yanitrend-mcp → generar token con permisos ads_read + ads_management + instagram_basic
2. **Asignar token en n8n** — Credentials → Header Auth → "Meta Bearer Token"
3. **Configurar WhatsApp Business API** — developers.facebook.com → agregar producto WhatsApp → número de teléfono
4. **Verificar píxel de conversiones** — Events Manager → revisar que se registren compras

### Próxima sesión:
5. Activar workflows de Instagram con token obtenido
6. Crear tabla de contenidos en Airtable para el auto-post de Instagram
7. Revisar primer reporte de Meta Ads automático
8. Test completo de recupero de carrito abandonado

---

## 🔑 CREDENCIALES IMPORTANTES

| Servicio | Dato | Valor |
|---|---|---|
| Shopify | Shop subdomain | bjusti-i6 |
| Shopify | App ID Dev Dashboard | f6c79fd01926911ab58483855d1b7057 |
| n8n | URL instancia | https://yanitrend.app.n8n.cloud |
| Meta | Ad Account ID | 1309758261308011 |
| Meta | Página vinculada | 1140428232489961 |
| Vercel | Proyecto | capsula-vital-g11g |
| GitHub | Rama activa | claude/funny-pascal-n13ash |

---

*Documento generado automáticamente por Claude Code — Yani Trend Automation Suite*
