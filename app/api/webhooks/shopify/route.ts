import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function verifyShopifyWebhook(body: string, hmacHeader: string, secret: string): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64')
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmacHeader))
}

function handleOrderCreate(payload: unknown): void {
  console.log('[shopify/orders/create]', JSON.stringify(payload))
}

function handleOrderPaid(payload: unknown): void {
  console.log('[shopify/orders/paid]', JSON.stringify(payload))
}

function handleOrderCancelled(payload: unknown): void {
  console.log('[shopify/orders/cancelled]', JSON.stringify(payload))
}

function handleProductUpdate(payload: unknown): void {
  console.log('[shopify/products/update]', JSON.stringify(payload))
}

export async function POST(request: NextRequest) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET

  if (!secret) {
    console.error('SHOPIFY_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  const hmacHeader = request.headers.get('x-shopify-hmac-sha256')
  const topic = request.headers.get('x-shopify-topic')

  if (!hmacHeader) {
    return NextResponse.json({ error: 'Missing HMAC header' }, { status: 401 })
  }

  // Read raw body as text — required for HMAC verification
  const rawBody = await request.text()

  const isValid = verifyShopifyWebhook(rawBody, hmacHeader, secret)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  switch (topic) {
    case 'orders/create':
      handleOrderCreate(payload)
      break
    case 'orders/paid':
      handleOrderPaid(payload)
      break
    case 'orders/cancelled':
      handleOrderCancelled(payload)
      break
    case 'products/update':
      handleProductUpdate(payload)
      break
    default:
      console.log(`[shopify/unhandled] topic=${topic}`, JSON.stringify(payload))
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
