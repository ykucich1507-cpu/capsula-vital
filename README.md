# Agente de organización y respuesta de email

Clasifica los emails no leídos de la bandeja, les pone un label según categoría
y, para consultas de negocio (YaniTrend / Freelance) o cualquier email de una
persona real que espera respuesta, deja un **borrador** listo para revisar y
enviar. **Nunca envía nada solo.**

Categorías: `Facturación y Pagos`, `Empleos`, `Marketing y Promociones`,
`Negocio - YaniTrend`, `Negocio - Freelance`, `Posible Phishing`, `Otros`.
Ver `email_agent/config.py` para editar categorías o prompts.

Hay dos formas de correr esto — elegí una o usá ambas:

## 1. Workflow en n8n (ya desplegado)

Se creó el workflow **"Agente Email — Organizar y Responder"** en tu instancia
de n8n (yanitrend.app.n8n.cloud), con trigger de Gmail que revisa la bandeja
cada 15 minutos. Los labels de Gmail (`Agente/...`) ya están creados.

Para activarlo:
1. Entrá al workflow en n8n y agregá una credencial de **Anthropic API**
   (falta cargar tu API key — no existía ninguna credencial de Anthropic en tu
   cuenta de n8n).
2. Revisá el nodo "Clasificar Email" y "Redactar Borrador" — el prompt de
   negocio asume YaniTrend + freelance; ajustalo si cambia el contexto.
3. Publicá/activá el workflow cuando estés conforme.

## 2. Script propio (este repo)

Alternativa versionada, para correr fuera de n8n (cron, GitHub Actions, etc.)

### Setup

```bash
pip install -r requirements.txt
cp .env.example .env  # completar ANTHROPIC_API_KEY
```

Necesitás credenciales OAuth de Gmail (Google Cloud Console → APIs & Services
→ Credentials → OAuth client ID → Desktop app) descargadas como
`client_secret.json` en la raíz del repo. La primera corrida abre el
navegador para autorizar; después queda guardado en `token.json`.

### Uso

```bash
python -m email_agent.main --dry-run       # solo clasifica y loguea, sin tocar nada
python -m email_agent.main                 # etiqueta + crea borradores
python -m email_agent.main --max-results 50
```

Pensado para correr en un cron cada 10-15 minutos.

## Estructura

```
email_agent/
  config.py       # categorías, labels, prompts del clasificador y redactor
  gmail_client.py # auth + listar no leídos + labels + crear borrador
  ai.py           # llamadas a Claude para clasificar y redactar
  main.py         # orquestación (entry point)
```
