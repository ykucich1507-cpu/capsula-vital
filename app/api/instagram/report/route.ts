import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const REPORT_EMAIL = 'ykucich1507@gmail.com'

interface DayMetric {
  reach?: number
  total_interactions?: number
  likes?: number
  comments?: number
  shares?: number
  saves?: number
  views?: number
  follower_count_1d?: number
  date?: string
}

function buildEmailHtml(metrics: DayMetric[], weekLabel: string): string {
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

  const bestDay = metrics.reduce(
    (best, m) => ((m.total_interactions ?? 0) > (best.total_interactions ?? 0) ? m : best),
    metrics[0] ?? {}
  )

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #e1306c, #833ab4); color: white; padding: 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
    .metrics { display: grid; grid-template-columns: 1fr 1fr; }
    .metric { padding: 20px 24px; border-bottom: 1px solid #f0f0f0; border-right: 1px solid #f0f0f0; }
    .metric:nth-child(even) { border-right: none; }
    .metric .value { font-size: 28px; font-weight: bold; color: #333; }
    .metric .label { font-size: 13px; color: #888; margin-top: 4px; }
    .highlight { background: #fff8f0; border-left: 4px solid #e1306c; padding: 16px 24px; }
    .footer { padding: 24px; text-align: center; color: #aaa; font-size: 12px; }
    .footer a { color: #e1306c; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Reporte Semanal @yani.trend</h1>
      <p>Semana del ${weekLabel}</p>
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
      <strong>🏆 Mejor día:</strong> ${bestDay.date} —
      ${bestDay.total_interactions ?? 0} interacciones · ${bestDay.reach ?? 0} alcance
    </div>` : ''}
    <div class="footer">
      Reporte automático · <a href="https://yanitrend.com">yanitrend.com</a>
    </div>
  </div>
</body>
</html>`.trim()
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Los datos vienen como JSON en el body cuando se llama desde un cron interno
    // o se pueden pasar como query param ?data=[...]
    const dataParam = new URL(request.url).searchParams.get('data')
    let metrics: DayMetric[] = []

    if (dataParam) {
      metrics = JSON.parse(dataParam)
    } else {
      return NextResponse.json({
        error: 'Pasá los datos de Instagram como ?data=[...] o usá el endpoint /api/instagram/send-report',
        hint: 'Este endpoint recibe métricas pre-fetched desde Windsor AI vía MCP'
      }, { status: 400 })
    }

    const weekOf = new Date()
    weekOf.setDate(weekOf.getDate() - 7)
    const weekLabel = weekOf.toLocaleDateString('es-AR', {
      day: 'numeric', month: 'long', year: 'numeric'
    })

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json({ metrics, weekLabel, note: 'RESEND_API_KEY no configurado' })
    }

    const resend = new Resend(resendKey)
    const html = buildEmailHtml(metrics, weekLabel)

    const { data, error } = await resend.emails.send({
      from: 'Yani Trend <onboarding@resend.dev>',
      to: [REPORT_EMAIL],
      subject: `📊 Reporte Instagram @yani.trend — semana del ${weekLabel}`,
      html,
    })

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ sent: true, emailId: data?.id, weekLabel })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
