'use client'

import { useState } from 'react'

const PRODUCTOS_RAPIDOS = [
  { nombre: 'Aspiradora Robot Jessica', precio: '38.630', categoria: 'hogar', emoji: '🤖' },
  { nombre: 'Vaso Térmico Sensor LED', precio: '24.500', categoria: 'cocina', emoji: '🌡️' },
  { nombre: 'Neocell Colágeno', precio: '19.900', categoria: 'bienestar', emoji: '✨' },
]

type Kit = {
  titular_principal: string
  titular_secundario: string
  descripcion_corta: string
  copy_ad_meta: string
  copy_ad_meta_corto: string
  asunto_email: string
  cuerpo_email: string
  caption_instagram: string
  hashtags: string
  whatsapp_mensaje: string
  puntos_clave: string[]
  objeciones: { objecion: string; respuesta: string }[]
}

export default function MarketingPage() {
  const [producto, setProducto] = useState('')
  const [precio, setPrecio] = useState('')
  const [detalle, setDetalle] = useState('')
  const [loading, setLoading] = useState(false)
  const [kit, setKit] = useState<Kit | null>(null)
  const [error, setError] = useState('')
  const [copiado, setCopiado] = useState('')
  const [tabActiva, setTabActiva] = useState<'ads' | 'email' | 'instagram' | 'whatsapp' | 'objeciones'>('ads')

  const cargarProducto = (p: typeof PRODUCTOS_RAPIDOS[0]) => {
    setProducto(p.nombre)
    setPrecio(p.precio)
    setDetalle('')
    setKit(null)
    setError('')
  }

  const copiar = (texto: string, id: string) => {
    navigator.clipboard.writeText(texto)
    setCopiado(id)
    setTimeout(() => setCopiado(''), 2000)
  }

  const generar = async () => {
    if (!producto.trim()) { setError('Escribí el nombre del producto'); return }
    setLoading(true)
    setKit(null)
    setError('')
    try {
      const res = await fetch('/api/marketing/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ producto, precio, detalle }),
      })
      if (!res.ok) throw new Error('Error al generar')
      const data = await res.json()
      setKit(data)
      setTabActiva('ads')
    } catch {
      setError('Algo salió mal. Revisá que ANTHROPIC_API_KEY esté configurada.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        :root {
          --fucsia: #E6007E; --fucsia-hover: #FF1A92; --fucsia-soft: #FBE0EF;
          --beige: #F3E9DF; --beige-deep: #E9DACB;
          --carbon: #2B2B2B; --carbon-70: #5C5C5C; --carbon-45: #8A8A8A;
          --line: #ECECEC; --font: 'Poppins', system-ui, sans-serif;
          --green: #108043; --green-soft: #E3F1EC;
          --blue: #006FBB; --blue-soft: #EBF5FA;
          --purple: #5C6AC4; --purple-soft: #EEF0FC;
          --orange: #C05717; --orange-soft: #FCF1E3;
        }
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; font-family: var(--font); background: #F7F7F8; color: var(--carbon); -webkit-font-smoothing: antialiased; }
        .topbar { background: var(--carbon); color: #fff; padding: 12px 32px; display: flex; align-items: center; gap: 16px; }
        .topbar-logo { font-weight: 700; font-size: 18px; letter-spacing: -0.02em; }
        .topbar-logo span { color: var(--fucsia); }
        .topbar-badge { background: var(--fucsia); color: #fff; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; letter-spacing: 0.05em; }
        .topbar-back { margin-left: auto; color: rgba(255,255,255,0.55); font-size: 13px; text-decoration: none; transition: color .2s; }
        .topbar-back:hover { color: #fff; }
        .main { max-width: 1100px; margin: 0 auto; padding: 40px 24px 80px; }
        .page-hdr { margin-bottom: 32px; }
        .page-hdr h1 { font-size: 32px; font-weight: 700; letter-spacing: -0.025em; margin: 0 0 6px; }
        .page-hdr h1 em { font-style: normal; color: var(--fucsia); }
        .page-hdr p { font-size: 15px; color: var(--carbon-70); margin: 0; }
        .grid { display: grid; grid-template-columns: 380px 1fr; gap: 28px; align-items: start; }
        .card { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 28px; }
        .card-title { font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--carbon-45); margin: 0 0 20px; }
        .quick-btns { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
        .quick-btn { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border: 2px solid var(--line); border-radius: 12px; cursor: pointer; background: #fff; font-family: var(--font); font-size: 14px; font-weight: 600; color: var(--carbon); transition: all .2s; text-align: left; }
        .quick-btn:hover { border-color: var(--fucsia); background: var(--fucsia-soft); }
        .quick-btn .emoji { font-size: 20px; line-height: 1; }
        .quick-btn-info { display: flex; flex-direction: column; }
        .quick-btn-sub { font-size: 11px; font-weight: 500; color: var(--carbon-45); margin-top: 1px; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: var(--carbon-45); font-size: 12px; font-weight: 600; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--line); }
        label { display: block; font-size: 13px; font-weight: 600; color: var(--carbon-70); margin-bottom: 6px; }
        input, textarea { width: 100%; border: 1.5px solid var(--line); border-radius: 10px; padding: 11px 14px; font-family: var(--font); font-size: 14px; color: var(--carbon); background: #fff; outline: none; transition: border-color .2s; resize: vertical; }
        input:focus, textarea:focus { border-color: var(--fucsia); }
        .field { margin-bottom: 16px; }
        .btn-generar { width: 100%; padding: 15px; background: var(--fucsia); color: #fff; border: none; border-radius: 12px; font-family: var(--font); font-size: 16px; font-weight: 700; cursor: pointer; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 8px; }
        .btn-generar:hover:not(:disabled) { background: var(--fucsia-hover); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(230,0,126,0.3); }
        .btn-generar:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .error { background: #FFF0F0; border: 1px solid #FFCDD2; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #C62828; margin-top: 12px; }
        .kit-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 400px; color: var(--carbon-45); gap: 12px; }
        .kit-empty-icon { font-size: 56px; }
        .kit-empty h3 { font-size: 18px; font-weight: 700; color: var(--carbon-70); margin: 0; }
        .kit-empty p { font-size: 14px; margin: 0; max-width: 28ch; line-height: 1.6; }
        .tabs { display: flex; gap: 4px; background: var(--beige); border-radius: 12px; padding: 4px; margin-bottom: 20px; flex-wrap: wrap; }
        .tab { flex: 1; padding: 9px 12px; border: none; border-radius: 9px; background: transparent; font-family: var(--font); font-size: 13px; font-weight: 600; color: var(--carbon-70); cursor: pointer; transition: all .2s; white-space: nowrap; }
        .tab.active { background: #fff; color: var(--carbon); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .kit-section { display: flex; flex-direction: column; gap: 16px; }
        .copy-block { background: #F7F7F8; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
        .copy-block-hdr { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--line); background: #fff; }
        .copy-block-label { font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--carbon-45); display: flex; align-items: center; gap: 8px; }
        .copy-block-label .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot-meta { background: var(--fucsia); }
        .dot-email { background: var(--green); }
        .dot-ig { background: var(--purple); }
        .dot-wa { background: #25D366; }
        .dot-obj { background: var(--orange); }
        .copy-btn { padding: 6px 14px; border: 1.5px solid var(--line); border-radius: 8px; background: #fff; font-family: var(--font); font-size: 12px; font-weight: 600; cursor: pointer; transition: all .2s; color: var(--carbon-70); }
        .copy-btn:hover { border-color: var(--fucsia); color: var(--fucsia); }
        .copy-btn.done { border-color: var(--green); color: var(--green); background: var(--green-soft); }
        .copy-block-body { padding: 16px; font-size: 14px; line-height: 1.7; color: var(--carbon); white-space: pre-wrap; }
        .highlight-box { background: var(--fucsia-soft); border: 1.5px solid rgba(230,0,126,0.2); border-radius: 12px; padding: 20px; }
        .highlight-box h2 { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: var(--carbon); margin: 0 0 4px; }
        .highlight-box p { font-size: 15px; color: var(--carbon-70); margin: 0; font-style: italic; }
        .puntos { display: flex; flex-direction: column; gap: 8px; }
        .punto { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; line-height: 1.5; color: var(--carbon); }
        .punto::before { content: '✓'; color: var(--fucsia); font-weight: 700; flex-shrink: 0; margin-top: 1px; }
        .objeciones-grid { display: flex; flex-direction: column; gap: 12px; }
        .objecion-card { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
        .objecion-q { background: var(--orange-soft); padding: 12px 16px; font-size: 13px; font-weight: 600; color: var(--orange); }
        .objecion-a { padding: 12px 16px; font-size: 14px; line-height: 1.6; color: var(--carbon); }
        @media (max-width: 768px) {
          .grid { grid-template-columns: 1fr; }
          .tabs { overflow-x: auto; }
        }
      `}</style>

      <div className="topbar">
        <div className="topbar-logo">Yani<span> Trend</span></div>
        <div className="topbar-badge">✦ Marketing AI</div>
        <a href="/" className="topbar-back">← Volver al sitio</a>
      </div>

      <div className="main">
        <div className="page-hdr">
          <h1>Kit de marketing <em>con IA</em></h1>
          <p>Ingresá un producto y generá en segundos: anuncios, emails, captions de Instagram, mensajes de WhatsApp y más.</p>
        </div>

        <div className="grid">
          {/* Panel izquierdo — formulario */}
          <div className="card">
            <div className="card-title">Producto</div>

            <div className="quick-btns">
              {PRODUCTOS_RAPIDOS.map((p) => (
                <button key={p.nombre} className="quick-btn" onClick={() => cargarProducto(p)}>
                  <span className="emoji">{p.emoji}</span>
                  <div className="quick-btn-info">
                    <span>{p.nombre}</span>
                    <span className="quick-btn-sub">ARS ${p.precio} · {p.categoria}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="divider">o escribí uno nuevo</div>

            <div className="field">
              <label>Nombre del producto *</label>
              <input
                value={producto}
                onChange={e => setProducto(e.target.value)}
                placeholder="ej: Freidora de aire 5L sin aceite"
              />
            </div>

            <div className="field">
              <label>Precio (ARS)</label>
              <input
                value={precio}
                onChange={e => setPrecio(e.target.value)}
                placeholder="ej: 29900"
                type="text"
              />
            </div>

            <div className="field">
              <label>Detalles extra (opcional)</label>
              <textarea
                value={detalle}
                onChange={e => setDetalle(e.target.value)}
                placeholder="características, público objetivo, beneficios clave..."
                rows={4}
              />
            </div>

            <button className="btn-generar" onClick={generar} disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner" />
                  Generando kit...
                </>
              ) : (
                <>✦ Generar kit de marketing</>
              )}
            </button>

            {error && <div className="error">{error}</div>}
          </div>

          {/* Panel derecho — resultado */}
          <div>
            {!kit ? (
              <div className="card kit-empty">
                <div className="kit-empty-icon">✦</div>
                <h3>Tu kit aparece acá</h3>
                <p>Elegí un producto o escribí uno nuevo y hacé clic en generar.</p>
              </div>
            ) : (
              <div className="card">
                {/* Titular destacado */}
                <div className="highlight-box" style={{ marginBottom: 24 }}>
                  <h2>{kit.titular_principal}</h2>
                  <p>{kit.titular_secundario}</p>
                </div>

                {/* Puntos clave */}
                {kit.puntos_clave?.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div className="card-title" style={{ marginBottom: 12 }}>Puntos clave del producto</div>
                    <div className="puntos">
                      {kit.puntos_clave.map((p, i) => (
                        <div key={i} className="punto">{p}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className="tabs">
                  {(['ads', 'email', 'instagram', 'whatsapp', 'objeciones'] as const).map(t => (
                    <button key={t} className={`tab${tabActiva === t ? ' active' : ''}`} onClick={() => setTabActiva(t)}>
                      {{ ads: '📱 Meta Ads', email: '📧 Email', instagram: '📸 Instagram', whatsapp: '💬 WhatsApp', objeciones: '🛡️ Objeciones' }[t]}
                    </button>
                  ))}
                </div>

                <div className="kit-section">
                  {tabActiva === 'ads' && (
                    <>
                      <CopyBlock label="Anuncio largo (primario)" dot="dot-meta" id="ad-largo" texto={kit.copy_ad_meta} copiado={copiado} copiar={copiar} />
                      <CopyBlock label="Anuncio corto (secundario)" dot="dot-meta" id="ad-corto" texto={kit.copy_ad_meta_corto} copiado={copiado} copiar={copiar} />
                    </>
                  )}

                  {tabActiva === 'email' && (
                    <>
                      <CopyBlock label="Asunto del email" dot="dot-email" id="email-asunto" texto={kit.asunto_email} copiado={copiado} copiar={copiar} />
                      <CopyBlock label="Cuerpo del email" dot="dot-email" id="email-cuerpo" texto={kit.cuerpo_email} copiado={copiado} copiar={copiar} />
                    </>
                  )}

                  {tabActiva === 'instagram' && (
                    <>
                      <CopyBlock label="Caption de Instagram" dot="dot-ig" id="ig-caption" texto={kit.caption_instagram} copiado={copiado} copiar={copiar} />
                      <CopyBlock label="Hashtags" dot="dot-ig" id="ig-hashtags" texto={kit.hashtags} copiado={copiado} copiar={copiar} />
                    </>
                  )}

                  {tabActiva === 'whatsapp' && (
                    <CopyBlock label="Mensaje de WhatsApp" dot="dot-wa" id="wa-msg" texto={kit.whatsapp_mensaje} copiado={copiado} copiar={copiar} />
                  )}

                  {tabActiva === 'objeciones' && (
                    <div className="objeciones-grid">
                      {kit.objeciones?.map((o, i) => (
                        <div key={i} className="objecion-card">
                          <div className="objecion-q">❓ {o.objecion}</div>
                          <div className="objecion-a">{o.respuesta}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function CopyBlock({ label, dot, id, texto, copiado, copiar }: {
  label: string; dot: string; id: string; texto: string;
  copiado: string; copiar: (t: string, id: string) => void;
}) {
  return (
    <div className="copy-block">
      <div className="copy-block-hdr">
        <div className="copy-block-label">
          <span className={`dot ${dot}`} />
          {label}
        </div>
        <button className={`copy-btn${copiado === id ? ' done' : ''}`} onClick={() => copiar(texto, id)}>
          {copiado === id ? '✓ Copiado' : 'Copiar'}
        </button>
      </div>
      <div className="copy-block-body">{texto}</div>
    </div>
  )
}
