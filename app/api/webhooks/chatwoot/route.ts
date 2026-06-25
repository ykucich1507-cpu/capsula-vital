import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function verifySignature(body: string, signature: string, secret: string): boolean {
  try {
    const expected = crypto.createHmac('sha256', secret).update(body, 'utf8').digest('hex')
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

interface CWPayload {
  event: string
  conversation?: {
    id: number
    channel?: string
    meta?: { channel?: string }
    inbox_id?: number
  }
  contact?: {
    id: number
    name?: string
    phone_number?: string
  }
  messages?: Array<{ content: string; message_type: number }>
}

async function handleConversationCreated(payload: CWPayload) {
  const conv = payload.conversation
  const contact = payload.contact

  // Solo capturar leads de Instagram (Messenger tiene su propia lógica)
  const channel =
    (conv?.channel as string | undefined) ||
    (conv?.meta?.channel as string | undefined) ||
    ''
  if (!channel.toLowerCase().includes('instagram')) return

  const name = contact?.name || 'Cliente Instagram'
  const firstMessage = payload.messages?.[0]?.content || ''

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://yanitrend.com'

  await fetch(`${baseUrl}/api/funnel/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      phone: contact?.phone_number || '',
      product: firstMessage.slice(0, 80) || 'Instagram DM',
      score: 30,
      source: 'instagram-chatwoot',
    }),
  }).catch(console.error)
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  const secret = process.env.CHATWOOT_WEBHOOK_SECRET
  if (secret) {
    const sig = request.headers.get('x-chatwoot-signature') || ''
    if (!verifySignature(rawBody, sig, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  let payload: CWPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (payload.event === 'conversation_created') {
    await handleConversationCreated(payload)
  }

  return NextResponse.json({ ok: true })
}
