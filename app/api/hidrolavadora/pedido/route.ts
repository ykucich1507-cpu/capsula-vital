import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { Resend } from 'resend'

const LEADS_FILE = '/tmp/yanitrend-leads.json'
const REPORT_EMAIL = 'ykucich1507@gmail.com'
const PRODUCT_NAME = 'Hidrolavadora Inalámbrica a Batería'

interface Pedido {
  nombre: string
  telefono: string
  direccion?: string
  ciudad?: string
  cp?: string
  cantidad?: string
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

async function saveLead(pedido: Pedido) {
  let leads: any[] = []
  try {
    leads = JSON.parse(await fs.readFile(LEADS_FILE, 'utf-8'))
  } catch {}
  leads.unshift({
    id: `lead_${Date.now()}`,
    name: pedido.nombre,
    phone: pedido.telefono,
    product: PRODUCT_NAME,
    score: 100,
    source: 'landing-hidrolavadora',
    status: 'nuevo',
    createdAt: new Date().toISOString(),
  })
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const raw = body as Pedido

    if (!raw.nombre || !raw.telefono) {
      return NextResponse.json({ error: 'nombre y telefono requeridos' }, { status: 400 })
    }

    const nombre = esc(String(raw.nombre))
    const telefono = esc(String(raw.telefono))
    const direccion = raw.direccion ? esc(String(raw.direccion)) : ''
    const ciudad = raw.ciudad ? esc(String(raw.ciudad)) : ''
    const cp = raw.cp ? esc(String(raw.cp)) : ''
    const cantidad = raw.cantidad ? esc(String(raw.cantidad)) : ''

    try {
      await saveLead({ nombre, telefono })
    } catch {}

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json({ ok: true, warning: 'RESEND_API_KEY no configurada — pedido guardado sin email' })
    }

    const waPhone = telefono.replace(/\D/g, '')
    const resend = new Resend(resendKey)
    const { error } = await resend.emails.send({
      from: 'Yani Trend <onboarding@resend.dev>',
      to: [REPORT_EMAIL],
      subject: `🛒 Nuevo pedido: ${nombre} — ${PRODUCT_NAME}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#E6007E,#c0005f);color:#fff;padding:24px;border-radius:12px 12px 0 0;text-align:center">
            <h2 style="margin:0">🛒 Nuevo Pedido — Landing Hidrolavadora</h2>
          </div>
          <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #eee">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#888;font-size:13px">Nombre</td><td style="padding:8px 0;font-weight:600">${nombre}</td></tr>
              <tr><td style="padding:8px 0;color:#888;font-size:13px">WhatsApp</td><td style="padding:8px 0;font-weight:600"><a href="https://wa.me/${waPhone}">${telefono}</a></td></tr>
              <tr><td style="padding:8px 0;color:#888;font-size:13px">Producto</td><td style="padding:8px 0;font-weight:600">${PRODUCT_NAME}</td></tr>
              <tr><td style="padding:8px 0;color:#888;font-size:13px">Cantidad</td><td style="padding:8px 0;font-weight:600">${cantidad || '1'}</td></tr>
              <tr><td style="padding:8px 0;color:#888;font-size:13px">Dirección</td><td style="padding:8px 0;font-weight:600">${direccion || '-'}</td></tr>
              <tr><td style="padding:8px 0;color:#888;font-size:13px">Ciudad</td><td style="padding:8px 0;font-weight:600">${ciudad || '-'}</td></tr>
              <tr><td style="padding:8px 0;color:#888;font-size:13px">Código Postal</td><td style="padding:8px 0;font-weight:600">${cp || '-'}</td></tr>
              <tr><td style="padding:8px 0;color:#888;font-size:13px">Fecha</td><td style="padding:8px 0;font-weight:600">${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</td></tr>
            </table>
            <div style="margin-top:20px;text-align:center">
              <a href="https://wa.me/${waPhone}" style="background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block">
                📲 Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json({ error: 'No pudimos registrar el pedido, probá de nuevo' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
