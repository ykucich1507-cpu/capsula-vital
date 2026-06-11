import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Resend } from 'resend'

const LEADS_FILE = '/tmp/yanitrend-leads.json'
const REPORT_EMAIL = 'ykucich1507@gmail.com'

export interface Lead {
  id: string
  name: string
  phone: string
  product: string
  score: number
  source: string
  status: 'nuevo' | 'contactado' | 'vendido' | 'perdido'
  createdAt: string
}

async function readLeads(): Promise<Lead[]> {
  try {
    const data = await fs.readFile(LEADS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeLeads(leads: Lead[]): Promise<void> {
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2))
}

export async function GET() {
  const leads = await readLeads()
  return NextResponse.json({ leads, total: leads.length })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, product, score, source } = body

    if (!phone) {
      return NextResponse.json({ error: 'phone requerido' }, { status: 400 })
    }

    const lead: Lead = {
      id: `lead_${Date.now()}`,
      name: name || 'Sin nombre',
      phone,
      product: product || 'Producto',
      score: score || 0,
      source: source || 'directo',
      status: 'nuevo',
      createdAt: new Date().toISOString(),
    }

    const leads = await readLeads()
    leads.unshift(lead)
    await writeLeads(leads)

    // Notificación por email
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: 'Yani Trend <onboarding@resend.dev>',
        to: [REPORT_EMAIL],
        subject: `🔥 Nuevo lead: ${lead.name} — ${lead.product}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto">
            <div style="background:linear-gradient(135deg,#E6007E,#c0005f);color:#fff;padding:24px;border-radius:12px 12px 0 0;text-align:center">
              <h2 style="margin:0">🔥 Nuevo Lead Capturado</h2>
            </div>
            <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #eee">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;color:#888;font-size:13px">Nombre</td><td style="padding:8px 0;font-weight:600">${lead.name}</td></tr>
                <tr><td style="padding:8px 0;color:#888;font-size:13px">WhatsApp</td><td style="padding:8px 0;font-weight:600"><a href="https://wa.me/${lead.phone.replace(/\D/g,'')}">+${lead.phone}</a></td></tr>
                <tr><td style="padding:8px 0;color:#888;font-size:13px">Producto</td><td style="padding:8px 0;font-weight:600">${lead.product}</td></tr>
                <tr><td style="padding:8px 0;color:#888;font-size:13px">Score</td><td style="padding:8px 0;font-weight:600;color:#E6007E">${lead.score}/100</td></tr>
                <tr><td style="padding:8px 0;color:#888;font-size:13px">Fuente</td><td style="padding:8px 0;font-weight:600">${lead.source}</td></tr>
                <tr><td style="padding:8px 0;color:#888;font-size:13px">Fecha</td><td style="padding:8px 0;font-weight:600">${new Date(lead.createdAt).toLocaleString('es-AR')}</td></tr>
              </table>
              <div style="margin-top:20px;text-align:center">
                <a href="https://wa.me/${lead.phone.replace(/\D/g,'')}" style="background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block">
                  📲 Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        `,
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true, lead })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    const leads = await readLeads()
    const idx = leads.findIndex(l => l.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 })
    leads[idx].status = status
    await writeLeads(leads)
    return NextResponse.json({ ok: true, lead: leads[idx] })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
