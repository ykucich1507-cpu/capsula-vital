import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'yanitrend2026'
const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || ''
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || ''
const REPORT_EMAIL = 'ykucich1507@gmail.com'

// Estado de conversación en memoria (se resetea al reiniciar, suficiente para Vercel)
const sessions = new Map<string, ConversationState>()

interface ConversationState {
  step: 'inicio' | 'eligiendo' | 'formulario' | 'confirmado'
  product?: string
  formData?: Partial<OrderForm>
  lastMessage?: number
}

interface OrderForm {
  nombre: string
  direccion: string
  ciudad: string
  cp: string
  telefono: string
  producto: string
  cantidad: string
}

// ── Mensajes ─────────────────────────────────────────────────────────────────

const MSG = {
  bienvenida: `Hola 👋 ¡Gracias por escribirnos a *Yani Trend*!

Tenemos ofertas especiales hoy con *pago contra entrega* 💵

🌡️ Vaso Térmico con Sensor 400ml → *$29.900*
🫙 Termo con Sensor 500ml → *$35.900*
🎵 Parlante Clip 5 Bluetooth → *$23.900*

¿Cuál te interesa? Respondé el número:
*1* - Vaso Térmico
*2* - Termo Sensor
*3* - Parlante Clip 5
*4* - Ver los 3`,

  precios: `🔥 *Ofertas especiales Yani Trend:*

🌡️ Vaso Térmico con Sensor 400ml → *$29.900*
🫙 Termo con Sensor 500ml → *$35.900*
🎵 Parlante Clip 5 Bluetooth → *$23.900*

Envío a todo el país · Pagás al recibir 🇦🇷
¿Cuál te interesa?`,

  envio: `🚚 El envío llega en *3 a 7 días hábiles* a todo el país.
*Pagás todo al recibir* — no adelantás nada 💵
¿Te hacemos el pedido?`,

  confianza: `¡Entiendo la duda! 😊 Yani Trend lleva más de 1 año enviando a todo el país.
Lo más importante: *no pagás nada hasta tener el paquete en tus manos* 💵
Si no llega o no te convence, no pagás.
¿Querés que te cuente cómo es el proceso?`,

  formulario: (producto: string) =>
    `¡Genial! 🎉 Para tu *${producto}* necesito estos datos:

📦 *FORMULARIO DE PEDIDO*
1️⃣ Nombre y apellido:
2️⃣ Dirección completa:
3️⃣ Ciudad y provincia:
4️⃣ Código postal:
5️⃣ Teléfono:
6️⃣ Cantidad:

Respondé con todos los datos juntos y listo 🚀`,

  confirmacion: (nombre: string, producto: string) =>
    `✅ *¡Pedido confirmado, ${nombre}!*

📦 Producto: ${producto}
🚚 Llega en 3 a 7 días hábiles
💵 Pagás al recibir — no adelantás nada

Te avisamos cuando salga con el número de seguimiento 📲
¡Gracias por elegirnos! 💕 — *Yani Trend*`,

  noEntendi: `No entendí bien 😊 Podés preguntarme sobre:
• *precio* — ver los precios
• *envio* — cómo llega el pedido
• *comprar* — hacer un pedido
• *1, 2 o 3* — elegir un producto

¿En qué te puedo ayudar?`,
}

const PRODUCTOS: Record<string, string> = {
  '1': 'Vaso Térmico con Sensor 400ml',
  'vaso': 'Vaso Térmico con Sensor 400ml',
  'termico': 'Vaso Térmico con Sensor 400ml',
  '2': 'Termo con Sensor 500ml',
  'termo': 'Termo con Sensor 500ml',
  '3': 'Parlante Clip 5 Bluetooth',
  'parlante': 'Parlante Clip 5 Bluetooth',
  'clip': 'Parlante Clip 5 Bluetooth',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function detectKeyword(text: string): string | null {
  const t = text.toLowerCase().trim()
  if (/\b(precio|cuanto|cuesta|vale|costo)\b/.test(t)) return 'precio'
  if (/\b(envio|envío|llega|demora|despacho|dias|días)\b/.test(t)) return 'envio'
  if (/\b(comprar|pedir|quiero|pedido|orden|llevar)\b/.test(t)) return 'comprar'
  if (/\b(seguro|confia|confiable|real|estafa|garantia)\b/.test(t)) return 'confianza'
  if (/\b(hola|buenos|buenas|buen dia|hi|hello)\b/.test(t)) return 'hola'
  for (const key of Object.keys(PRODUCTOS)) {
    if (t.includes(key)) return `producto:${key}`
  }
  return null
}

function parseFormulario(text: string): Partial<OrderForm> {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const data: Partial<OrderForm> = {}
  for (const line of lines) {
    const clean = line.replace(/^[\d️⃣\.\-\*]+\s*/, '').replace(/^[\w\s]+:\s*/, '')
    if (!data.nombre) { data.nombre = clean; continue }
    if (!data.direccion) { data.direccion = clean; continue }
    if (!data.ciudad) { data.ciudad = clean; continue }
    if (!data.cp) { data.cp = clean; continue }
    if (!data.telefono) { data.telefono = clean; continue }
    if (!data.cantidad) { data.cantidad = clean; continue }
  }
  return data
}

async function sendWhatsApp(to: string, message: string) {
  if (!WA_TOKEN || !PHONE_NUMBER_ID) return
  await fetch(
    `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WA_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      }),
    }
  )
}

async function notifyNewOrder(from: string, product: string, form: Partial<OrderForm>) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return
  const resend = new Resend(resendKey)
  await resend.emails.send({
    from: 'Yani Trend Bot <onboarding@resend.dev>',
    to: [REPORT_EMAIL],
    subject: `🛒 Nuevo pedido WhatsApp: ${form.nombre || from} — ${product}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#E6007E,#c0005f);color:#fff;padding:24px;border-radius:12px 12px 0 0;text-align:center">
          <h2 style="margin:0">🛒 Nuevo Pedido por WhatsApp</h2>
        </div>
        <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #eee">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#888;font-size:13px">Nombre</td><td style="padding:8px 0;font-weight:600">${form.nombre || '-'}</td></tr>
            <tr><td style="padding:8px 0;color:#888;font-size:13px">WhatsApp</td><td style="padding:8px 0;font-weight:600"><a href="https://wa.me/${from}">+${from}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888;font-size:13px">Producto</td><td style="padding:8px 0;font-weight:600">${product}</td></tr>
            <tr><td style="padding:8px 0;color:#888;font-size:13px">Cantidad</td><td style="padding:8px 0;font-weight:600">${form.cantidad || '1'}</td></tr>
            <tr><td style="padding:8px 0;color:#888;font-size:13px">Dirección</td><td style="padding:8px 0;font-weight:600">${form.direccion || '-'}</td></tr>
            <tr><td style="padding:8px 0;color:#888;font-size:13px">Ciudad</td><td style="padding:8px 0;font-weight:600">${form.ciudad || '-'}</td></tr>
            <tr><td style="padding:8px 0;color:#888;font-size:13px">Código Postal</td><td style="padding:8px 0;font-weight:600">${form.cp || '-'}</td></tr>
            <tr><td style="padding:8px 0;color:#888;font-size:13px">Teléfono</td><td style="padding:8px 0;font-weight:600">${form.telefono || '-'}</td></tr>
          </table>
          <div style="margin-top:20px;text-align:center">
            <a href="https://wa.me/${from}" style="background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block">
              📲 Responder por WhatsApp
            </a>
          </div>
        </div>
      </div>
    `,
  }).catch(() => {})
}

// ── Lógica de conversación ────────────────────────────────────────────────────

async function handleMessage(from: string, text: string) {
  const t = text.trim()
  let state = sessions.get(from) ?? { step: 'inicio' as const }

  // Sesión expirada (más de 24hs sin actividad)
  if (state.lastMessage && Date.now() - state.lastMessage > 86_400_000) {
    state = { step: 'inicio' }
  }
  state.lastMessage = Date.now()

  // En formulario — capturar datos
  if (state.step === 'formulario') {
    const form = parseFormulario(t)
    state.formData = { ...state.formData, ...form }

    const filled = Object.values(state.formData).filter(Boolean).length
    if (filled >= 4 && state.formData.nombre) {
      // Suficientes datos — confirmar pedido
      const product = state.product || 'Producto'
      state.step = 'confirmado'
      sessions.set(from, state)
      await sendWhatsApp(from, MSG.confirmacion(state.formData.nombre, product))
      await notifyNewOrder(from, product, state.formData)
      return
    }

    // Faltan datos
    await sendWhatsApp(from, `Gracias! Solo me falta completar algún dato. Mandame:\n\n${MSG.formulario(state.product || 'el producto')}`)
    sessions.set(from, state)
    return
  }

  // Detectar intención
  const keyword = detectKeyword(t)

  if (keyword === 'hola' || state.step === 'inicio') {
    state.step = 'eligiendo'
    sessions.set(from, state)
    await sendWhatsApp(from, MSG.bienvenida)
    return
  }

  if (keyword === 'precio') {
    await sendWhatsApp(from, MSG.precios)
    sessions.set(from, state)
    return
  }

  if (keyword === 'envio') {
    await sendWhatsApp(from, MSG.envio)
    sessions.set(from, state)
    return
  }

  if (keyword === 'confianza') {
    await sendWhatsApp(from, MSG.confianza)
    sessions.set(from, state)
    return
  }

  if (keyword?.startsWith('producto:')) {
    const key = keyword.split(':')[1]
    const product = PRODUCTOS[key]
    if (product) {
      state.product = product
      state.step = 'formulario'
      sessions.set(from, state)
      await sendWhatsApp(from, MSG.formulario(product))
      return
    }
  }

  if (keyword === 'comprar') {
    state.step = 'eligiendo'
    sessions.set(from, state)
    await sendWhatsApp(from, `¡Perfecto! ¿Qué producto querés?\n\n*1* - Vaso Térmico con Sensor → $29.900\n*2* - Termo con Sensor → $35.900\n*3* - Parlante Clip 5 → $23.900`)
    return
  }

  // No entendió
  await sendWhatsApp(from, MSG.noEntendi)
  sessions.set(from, state)
}

// ── Route handlers ────────────────────────────────────────────────────────────

// Meta verifica el webhook con GET
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }
  return new Response('Forbidden', { status: 403 })
}

// Meta manda los mensajes con POST
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const entry = body?.entry?.[0]
    const change = entry?.changes?.[0]
    const value = change?.value

    if (!value?.messages?.length) {
      return NextResponse.json({ ok: true })
    }

    const message = value.messages[0]
    const from: string = message.from
    const text: string = message.text?.body || ''

    if (!text) return NextResponse.json({ ok: true })

    // Procesar en background para responder a Meta rápido
    handleMessage(from, text).catch(console.error)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
