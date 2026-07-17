# 🧠 Funnel Inteligente con IA

*Rama: `claude/intelligent-sales-funnel-sgjfu2`*

Versión avanzada del funnel de ventas: en vez de un bot de respuestas fijas, usa **IA conversacional** para guiar al cliente.

## Qué incluye

- **Motor de funnel** en `lib/funnel/` (`ai.ts`, `store.ts`, `types.ts`) — lógica de conversación, scoring y persistencia de leads
- **API completa**:
  - `app/api/funnel/chat/route.ts` — la conversación con IA
  - `app/api/funnel/config/route.ts` — configuración del funnel
  - `app/api/funnel/leads/route.ts` + `[id]` — CRUD de leads individual
  - `app/api/funnel/stats/route.ts` — estadísticas del embudo
- **Dashboard mejorado** con métricas
- **Flyer promocional descargable** en `/flyer`
- **Esqueleto del MCP de Dropi** (ver [[Servidores MCP Propios]])

## Diferencia con el funnel actual

El funnel que está corriendo hoy ([[App Next.js — Arquitectura]]) captura nombre + teléfono con un flujo fijo. Este agrega IA para responder preguntas del cliente, calificar el lead automáticamente y mostrar stats del embudo.

Relacionado: [[Proyectos en la Nube]] · [[Guía Operativa]]
