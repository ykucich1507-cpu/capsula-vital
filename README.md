# Capsula Vital — Shopify Webhook Receiver

A Next.js 14 (App Router) application that receives and verifies Shopify webhooks.

## Setup

### 1. Set the Webhook Secret

Copy `.env.example` to `.env.local` and fill in your secret:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
SHOPIFY_WEBHOOK_SECRET=your_actual_secret_here
```

You can find or generate this secret in the Shopify Admin under **Settings → Notifications → Webhooks** (each webhook shows its signing secret), or in **Apps → Your App → Webhooks** if using the Partner API.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally

```bash
npm run dev
```

The webhook endpoint will be available at `http://localhost:3000/api/webhooks/shopify`.

To test locally with Shopify, use a tunnel like [ngrok](https://ngrok.com/):

```bash
ngrok http 3000
```

Then register the ngrok URL as your webhook endpoint in Shopify.

## Registering Webhooks in Shopify Admin

1. Go to **Shopify Admin → Settings → Notifications**
2. Scroll to the **Webhooks** section and click **Create webhook**
3. Choose the event (e.g., `Order creation`)
4. Set the URL to: `https://your-domain.com/api/webhooks/shopify`
5. Select format: **JSON**
6. Click **Save**

Repeat for each topic you want to handle:
- `orders/create`
- `orders/paid`
- `orders/cancelled`
- `products/update`

### Via Shopify CLI / API

```bash
shopify webhook trigger --topic=orders/create --address=https://your-domain.com/api/webhooks/shopify
```

## Deploying to Vercel

### One-click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deploy

1. Push this repository to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add the environment variable in the Vercel dashboard:
   - **Name**: `SHOPIFY_WEBHOOK_SECRET`
   - **Value**: your webhook signing secret
4. Deploy

After deployment, update your Shopify webhook URLs to point to your Vercel domain:

```
https://your-project.vercel.app/api/webhooks/shopify
```

## Handled Topics

| Topic | Handler |
|---|---|
| `orders/create` | Logs new order payload |
| `orders/paid` | Logs paid order payload |
| `orders/cancelled` | Logs cancelled order payload |
| `products/update` | Logs updated product payload |

All other topics are logged with an `[unhandled]` prefix.

## Security

Webhook authenticity is verified using HMAC-SHA256. Every incoming request must include the `X-Shopify-Hmac-Sha256` header. Requests with a missing or invalid signature receive a `401` response.
