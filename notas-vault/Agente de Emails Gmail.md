# 📧 Agente de Emails Gmail

*Rama: `claude/email-organization-agent-5g5y62`*

Agente que **organiza tu casilla de Gmail** y prepara respuestas, pensado para no perder consultas de clientes entre el ruido.

## Qué hace

1. **Clasifica** los mails no leídos en categorías de negocio/personal
2. **Etiqueta** cada mail en Gmail según su categoría
3. **Redacta borradores** de respuesta (nunca envía solo — siempre quedan como borrador para que revises) para consultas reales de negocio, con enfoque de ventas para leads de YaniTrend/freelance

## Cómo está hecho

- **Script Python** en `email_agent/` (`main.py`, `gmail_client.py`, `ai.py`, `config.py`) con `requirements.txt`
- **Workflow n8n** equivalente para correrlo automático
- Configuración por variables de entorno (`.env.example` incluido)
- README con instrucciones de instalación

> [!tip] Seguridad
> El agente **nunca manda emails automáticamente** — solo crea borradores. Vos decidís qué se envía.

Relacionado: [[Proyectos en la Nube]] · [[Rutina Diaria]] (revisar emails es parte de la rutina)
