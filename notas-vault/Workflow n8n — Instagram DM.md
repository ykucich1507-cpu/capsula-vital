# 📱 Workflow n8n — Instagram DM Automático

*Archivo: `n8n-instagram-dm-yanitrend.json` — importar en https://yanitrend.app.n8n.cloud*

Responde automáticamente los DMs y comentarios de Instagram (@yani.trend) según la **intención detectada**, captura leads calientes y hace follow-up.

## Flujo

Webhook: `/webhook/instagram-webhook`

1. **Webhook — Verificación Meta** + **Responder Challenge** — el handshake que exige Meta al configurar el webhook
2. **Webhook — DM / Comentario entrante** recibe el mensaje
3. **Responder OK a Meta**
4. **Parsear Mensaje y Detectar Intención** (código) — clasifica: precio, compra, envío, saludo, etc.
5. **¿Tiene sender válido?** y **¿Intención reconocida?** — filtros
6. **Generar Respuesta** (código) — arma el texto según la intención
7. **¿DM o Comentario?** → responde por la vía que corresponda:
   - **Instagram — Responder DM**
   - **Instagram — Responder Comentario**
8. **¿Intent = Compra?** → si la intención es de compra:
   - **Guardar Lead desde Instagram** (lo manda al sistema de leads)
   - **Email — Alerta Lead Caliente Instagram** → te avisa al toque
9. **Esperar 2hs sin respuesta** → **Instagram — Follow-up 2hs**

## Claves

- El lead caliente de Instagram entra al mismo pipeline del dashboard → [[App Next.js — Arquitectura]]
- El **Page Token** de Instagram vence — si deja de responder, renovarlo en developers.facebook.com → [[Solución de Problemas]]

## Relacionado

- [[Workflow n8n — Embudo Completo]]
- [[Guía Operativa]]
- [[Cuentas Meta Ads]] — la página vinculada es la `1140428232489961`
