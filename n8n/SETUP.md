# YaniTrend — Automatizaciones Google Ads con n8n

## Paso 1: Levantar n8n

```bash
# Desde la carpeta del proyecto
docker compose up -d

# Abrir en el navegador:
# http://localhost:5678
# Usuario: admin
# Contraseña: yanitrend2024
```

---

## Paso 2: Obtener credenciales de Google Ads

### 2.1 — Developer Token
1. Ir a https://ads.google.com → Herramientas → Centro de API de Google Ads
2. Copiar el **Token de desarrollador**

### 2.2 — OAuth2 (Client ID + Client Secret)
1. Ir a https://console.cloud.google.com
2. Crear proyecto o usar uno existente
3. Activar la API: **Google Ads API**
4. Ir a **Credenciales** → Crear credencial → **ID de cliente OAuth 2.0**
5. Tipo: Aplicación web
6. URI de redireccionamiento: `http://localhost:5678/rest/oauth2-credential/callback`
7. Copiar **Client ID** y **Client Secret**

### 2.3 — Customer ID
- Es el número de tu cuenta de Google Ads (sin guiones)
- Lo ves en la esquina superior derecha de Google Ads: `xxx-xxx-xxxx` → guardarlo como `xxxxxxxxxx`

---

## Paso 3: Configurar credenciales en n8n

### Google Ads OAuth2
1. En n8n ir a **Settings → Credentials → New**
2. Buscar "Google Ads OAuth2 API"
3. Ingresar: Client ID, Client Secret, Developer Token
4. Hacer clic en **Connect** y autorizar con tu cuenta de Google Ads

### Gmail
1. En n8n ir a **Settings → Credentials → New**
2. Buscar "Gmail OAuth2 API"
3. Usar el mismo Client ID y Client Secret del paso anterior
4. Autorizar con el email que quieras usar para recibir alertas

### Shopify (para Workflow 04)
1. En n8n ir a **Settings → Credentials → New**
2. Buscar "Shopify API"
3. Ingresar: Shop name `yanitrend`, API Key y Password (de Shopify Admin → Apps → Desarrollo)

---

## Paso 4: Configurar variables globales en n8n

Ir a **Settings → Variables** y crear estas variables:

| Variable | Valor |
|---|---|
| `GOOGLE_ADS_CUSTOMER_ID` | Tu Customer ID sin guiones (ej: `1234567890`) |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | Token del paso 2.1 |
| `EMAIL_ALERTAS` | Email donde recibir alertas (ej: `ykucich1507@gmail.com`) |

---

## Paso 5: Importar los workflows

1. En n8n ir a **Workflows → Import from file**
2. Importar cada archivo `.json` de la carpeta `/workflows`
3. En cada workflow:
   - Asignar las credenciales correctas a cada nodo
   - Revisar los umbrales/reglas según tu presupuesto
   - Activar el workflow con el toggle ▶️

---

## Workflows incluidos

| # | Archivo | Qué hace | Frecuencia |
|---|---|---|---|
| 01 | `01_pausar_ads_sin_conversiones.json` | Pausa campañas que gastan sin convertir | Diario 8am |
| 02 | `02_escalar_presupuesto_roas.json` | Sube presupuesto 20% si ROAS > 3x | Lunes 9am |
| 03 | `03_reporte_diario.json` | Reporte completo por email | Diario 7am |
| 04 | `04_sincronizar_shopify_stock.json` | Pausa/activa ads según stock Shopify | Cada 2 horas |
| 05 | `05_alerta_gasto_diario.json` | Alerta si el gasto supera el límite | 4 veces/día |

---

## Ajustar umbrales (importante)

En **Workflow 01** (`Filtrar sin conversiones`):
```js
if (costARS > 5000 && conversiones === 0)  // Cambiar 5000 por tu umbral
```

En **Workflow 02** (`Calcular ROAS y acción`):
```js
const ROAS_OBJETIVO = 3;       // Cambiar según tu objetivo
const AUMENTO_PORCENT = 0.20;  // 20% de aumento
const MAX_PRESUPUESTO = 50000; // Tope máximo en ARS
```

En **Workflow 05** (`Evaluar nivel de gasto`):
```js
const LIMITE_ALERTA = 10000;   // Alerta en ARS
const LIMITE_CRITICO = 20000;  // Crítico en ARS
```
