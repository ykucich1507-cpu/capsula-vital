# 🚿 Landing Hidrolavadora

*Rama: `claude/landing-page-structure-0d0lol`*

Landing page de venta con estructura **AIDA** para la hidrolavadora inalámbrica, en la ruta `/hidrolavadora`.

## Qué incluye

- **9 secciones de conversión**: hero, problema, solución, beneficios, prueba social, oferta, FAQ, CTA final y barra sticky
- **Precio**: $51.500 (tachado $68.000) — el envío corre por cuenta del comprador
- **Formulario de pedido** (`#pedido`): nombre, teléfono, dirección, ciudad, CP y cantidad, con estados de envío/éxito/error
- **Endpoint** `app/api/hidrolavadora/pedido/route.ts`: manda cada pedido por email vía Resend y guarda el lead con source `landing-hidrolavadora` para el dashboard
- Todos los CTAs internos scrollean al formulario

## Seguridad agregada en la misma rama

- `GET`/`PATCH` de `/api/funnel/leads` protegidos con `Authorization: Bearer ADMIN_KEY`
- `/dashboard` pide clave de acceso (validación server-side)
- Next.js actualizado a 14.2.35 (parches de seguridad)

> [!warning] Antes de publicar
> Testimonios y foto de producto quedaron como placeholders — reemplazarlos con datos reales.

Relacionado: [[Proyectos en la Nube]] · [[Productos y Precios]] · [[App Next.js — Arquitectura]]
