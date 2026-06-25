import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { promises as fs } from 'fs'
import { searchContactByPhone, updateContactAttributes } from '@/lib/chatwoot'

const LEADS_FILE = '/tmp/yanitrend-leads.json'

async function updateLeadStatus(phone: string, status: 'vendido' | 'perdido') {
  try {
    const data = await fs.readFile(LEADS_FILE, 'utf-8')
    const leads = JSON.parse(data)
    const clean = (p: string) => p.replace(/\D/g, '').slice(-8)
    const idx = leads.findIndex((l: { phone: string }) => clean(l.phone) === clean(phone))
    if (idx !== -1) {
      leads[idx].status = status
      await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2))
    }
  } catch {}
}

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

async function syncOrderToChatwoot(
  phone: string,
  order: { id?: number; name?: string; total_price?: string }
): Promise<void> {
  const contact = await searchContactByPhone(phone)
  if (!contact) return
  await updateContactAttributes(contact.id, {
    shopify_order_id: String(order.name || order.id || ''),
    shopify_total: String(order.total_price || ''),
    shopify_status: 'paid',
  })
}

async function handleOrderPaid(payload: unknown): Promise<void> {
  const order = payload as {
    id?: number
    name?: string
    total_price?: string
    phone?: string
    billing_address?: { phone?: string }
    customer?: { phone?: string }
  }
  const phone = order.phone || order.billing_address?.phone || order.customer?.phone || ''
  if (phone) {
    await updateLeadStatus(phone, 'vendido')
    syncOrderToChatwoot(phone, order).catch(console.error)
    console.log('[shopify/orders/paid] lead marcado como vendido:', phone)
  }
}

async function handleOrderCancelled(payload: unknown): Promise<void> {
  const order = payload as { phone?: string; billing_address?: { phone?: string }; customer?: { phone?: string } }
  const phone = order.phone || order.billing_address?.phone || order.customer?.phone || ''
  if (phone) {
    await updateLeadStatus(phone, 'perdido')
  }
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
      await handleOrderPaid(payload)
      break
    case 'orders/cancelled':
      await handleOrderCancelled(payload)
      break
    case 'products/update':
      handleProductUpdate(payload)
      break
    default:
      console.log(`[shopify/unhandled] topic=${topic}`, JSON.stringify(payload))
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
