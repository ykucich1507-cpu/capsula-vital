# ⚙️ Automatizaciones n8n Extra

Además de los 3 workflows principales ([[Workflow n8n — Embudo Completo]], [[Workflow n8n — Carritos Abandonados]], [[Workflow n8n — Instagram DM]]), Claude creó **17 workflows más** en dos ramas.

## Rama `claude/funny-pascal-n13ash` — 12 workflows

Carpeta `n8n-workflows/` + doc `YANITREND-PROYECTO.md` (archivo completo del proyecto con estado de automatizaciones):

| Workflow | Qué hace |
|---|---|
| `instagram-publicar-post` | Publica posts en Instagram automáticamente |
| `instagram-responder-comentarios` | Responde comentarios |
| `instagram-dm-nuevos-seguidores` | DM de bienvenida a seguidores nuevos |
| `instagram-reporte-metricas` | Reporte periódico de métricas de IG |
| `caption-automatico-producto-nuevo` | Genera caption cuando cargás un producto |
| `alerta-stock-bajo` | Avisa cuando un producto se queda sin stock |
| `alerta-orden-cancelada` | Avisa cuando se cancela una orden |
| `meta-ads-pausa-roas-bajo` | Pausa anuncios con ROAS bajo |
| *(+4 más de Instagram)* | Automatización de contenido |

También incluye `/marketing` en la app (`app/marketing/page.tsx` + API) para generar contenido.

## Rama `claude/mcp-facebook-rkhury` — 5 workflows de Google Ads

Carpeta `n8n/workflows/` + `SETUP.md` + `docker-compose.yml` para correr n8n propio:

1. `01_pausar_ads_sin_conversiones` — pausa anuncios que gastan sin convertir
2. `02_escalar_presupuesto_roas` — sube presupuesto cuando el ROAS es bueno
3. `03_reporte_diario` — resumen diario de performance
4. `04_sincronizar_shopify_stock` — sincroniza stock de Shopify
5. `05_alerta_gasto_diario` — alerta si el gasto supera el límite

> [!note] Estado
> Estos workflows están **exportados como JSON pero no importados** en tu n8n Cloud. Para activarlos: descargarlos de la rama e importarlos en https://yanitrend.app.n8n.cloud (y verificar credenciales).

Relacionado: [[Proyectos en la Nube]] · [[Solución de Problemas]]
