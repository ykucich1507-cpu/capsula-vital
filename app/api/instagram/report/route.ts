import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const WINDSOR_API_KEY = process.env.WINDSOR_AI_API_KEY
const WINDSOR_BASE = 'https://connectors.windsor.ai/instagram'
const INSTAGRAM_ACCOUNT = '17841412903900880'
const REPORT_EMAIL = 'ykucich1507@gmail.com'

interface InstagramMetric {
  date?: string
  reach?: number
  total_interactions?: number
  likes?: number
  comments?: number
  shares?: number
  saves?: number
  views?: number
  follower_count_1d?: number
}

async function fetchInstagramMetrics(): Promise<InstagramMetric[]> {
  if (!WINDSOR_API_KEY) throw new Error('WINDSOR_AI_API_KEY no configurado')

  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 7)

  const dateFrom = sevenDaysAgo.toISOString().split('T')[0]
  const dateTo = today.toISOString().split('T')[0]

  const params = new URLSearchParams({
    api_key: WINDSOR_API_KEY,
    date_from: dateFrom,
    date_to: dateTo,
    fields: 'date,reach,total_interactions,likes,comments,shares,saves,views,follower_count_1d',
    account_id: INSTAGRAM_ACCOUNT,
  })

  const res = await fetch(`${WINDSOR_BASE}?${params}`)
  if (!res.ok) throw new Error(`Windsor AI error: ${res.status}`)
  const json = await res.json()
  return json.data ?? []
}

function buildEmailHtml(metrics: InstagramMetric[], weekOf: string): string {
  const total = metrics.reduce(
    (acc, m) => ({
      reach: acc.reach + (m.reach ?? 0),
      interactions: acc.interactions + (m.total_interactions ?? 0),
      likes: acc.likes + (m.likes ?? 0),
      comments: acc.comments + (m.comments ?? 0),
      shares: acc.shares + (m.shares ?? 0),
      saves: acc.saves + (m.saves ?? 0),
      views: acc.views + (m.views ?? 0),
      newFollowers: acc.newFollowers + (m.follower_count_1d ?? 0),
    }),
    { reach: 0, interactions: 0, likes: 0, comments: 0, shares: 0, saves: 0, views: 0, newFollowers: 0 }
  )

  const bestDay = metrics.reduce((best, m) =>
    (m.total_interactions ?? 0) > (best.total_interactions ?? 0) ? m : best,
    metrics[0] ?? {}
  )

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #e1306c, #833ab4); color: white; padding: 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 8px 0 0; opacity: 0.9; }
    .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
    .metric { padding: 20px 24px; border-bottom: 1px solid #f0f0f0; border-right: 1px solid #f0f0f0; }
    .metric:nth-child(even) { border-right: none; }
    .metric .value { font-size: 28px; font-weight: bold; color: #333; }
    .metric .label { font-size: 13px; color: #888; margin-top: 4px; }
    .metric .change { font-size: 12px; color: #e1306c; margin-top: 2px; }
    .highlight { background: #fff8f0; border-left: 4px solid #e1306c; padding: 16px 24px; margin: 0; }
    .footer { padding: 24px; text-align: center; color: #aaa; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Reporte Semanal @yani.trend</h1>
      <p>Semana del ${weekOf}</p>
    </div>

    <div class="metrics">
      <div class="metric">
        <div class="value">${total.reach.toLocaleString('es-AR')}</div>
        <div class="label">👁️ Alcance total</div>
      </div>
      <div class="metric">
        <div class="value">${total.views.toLocaleString('es-AR')}</div>
        <div class="label">▶️ Vistas totales</div>
      </div>
      <div class="metric">
        <div class="value">${total.interactions.toLocaleString('es-AR')}</div>
        <div class="label">💬 Interacciones</div>
      </div>
      <div class="metric">
        <div class="value">+${total.newFollowers}</div>
        <div class="label">➕ Seguidores nuevos</div>
      </div>
      <div class="metric">
        <div class="value">${total.likes}</div>
        <div class="label">❤️ Likes</div>
      </div>
      <div class="metric">
        <div class="value">${total.shares}</div>
        <div class="label">🔁 Compartidos</div>
      </div>
      <div class="metric">
        <div class="value">${total.saves}</div>
        <div class="label">🔖 Guardados</div>
      </div>
      <div class="metric">
        <div class="value">${total.comments}</div>
        <div class="label">💭 Comentarios</div>
      </div>
    </div>

    ${bestDay?.date ? `
    <div class="highlight">
      <strong>🏆 Mejor día de la semana:</strong> ${bestDay.date}<br>
      ${bestDay.total_interactions} interacciones · ${bestDay.reach ?? 0} alcance
    </div>
    ` : ''}

    <div class="footer">
      Reporte automático de Yani Trend · <a href="https://yanitrend.com" style="color: #e1306c;">yanitrend.com</a>
    </div>
  </div>
</body>
</html>
  `.trim()
}

export async function GET(request: NextRequest) {
  // Verificación de seguridad para el cron
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const metrics = await fetchInstagramMetrics()

    const weekOf = new Date()
    weekOf.setDate(weekOf.getDate() - 7)
    const weekLabel = weekOf.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      // Sin Resend configurado, devuelve el reporte en JSON
      return NextResponse.json({ metrics, summary: 'RESEND_API_KEY no configurado — reporte en JSON' })
    }

    const resend = new Resend(resendKey)
    const html = buildEmailHtml(metrics, weekLabel)

    const { data, error } = await resend.emails.send({
      from: 'Yani Trend <reportes@yanitrend.com>',
      to: [REPORT_EMAIL],
      subject: `📊 Reporte Instagram @yani.trend — semana del ${weekLabel}`,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ sent: true, emailId: data?.id, weekOf: weekLabel })
  } catch (err) {
    console.error('Report error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
