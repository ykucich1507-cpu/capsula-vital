'use client'

import { useState, useRef } from 'react'

const OPCIONES_GENERAR = [
  { id: 'investigacion', label: '🔍 Investigación', sub: 'competencia y mercado' },
  { id: 'pagina_producto', label: '🛍️ Página producto', sub: 'descripción Shopify' },
  { id: 'redes_sociales', label: '📱 Redes sociales', sub: 'posts IG/FB' },
  { id: 'publicidad', label: '📢 Publicidad', sub: 'copies para Meta Ads' },
  { id: 'seo', label: '🔎 SEO', sub: 'título y meta tags' },
  { id: 'ventas_wa', label: '💬 Ventas / WA', sub: 'scripts de cierre' },
  { id: 'emails_auto', label: '✉️ Emails auto', sub: 'secuencia de nurturing' },
  { id: 'diseno_creativo', label: '🎨 Diseño creativo', sub: 'brief para creativos' },
]

const OBJETIVOS = [
  { id: 'ventas', label: '💰 Ventas / Conversión' },
  { id: 'trafico', label: '🌐 Tráfico al sitio' },
  { id: 'reconocimiento', label: '📣 Reconocimiento de marca' },
  { id: 'leads', label: '🎯 Captación de leads' },
]

const EJEMPLOS = [
  {
    label: '🧴 Colágeno',
    data: {
      producto: 'Neocell Colágeno Hidrolizado',
      caracteristicas: 'Mejora piel, cabello y uñas. 200 tabletas. Sin gluten. Colágeno tipo 1 y 3.',
      precio: '18900',
      audiencia: 'Mujeres 30-55 años interesadas en belleza y bienestar',
    },
  },
  {
    label: '🌡️ Vaso Térmico',
    data: {
      producto: 'Vaso Térmico con Sensor de Temperatura',
      caracteristicas: 'Pantalla LED, acero inoxidable, 500ml, mantiene temperatura 12 hs.',
      precio: '14900',
      audiencia: 'Adultos 25-45 que trabajan o hacen deporte',
    },
  },
  {
    label: '🏠 Producto Hogar',
    data: {
      producto: 'Aspiradora Robot Inteligente',
      caracteristicas: 'Navegación láser, app Wi-Fi, 120 min autonomía, depósito 600ml.',
      precio: '89900',
      audiencia: 'Familias con mascotas o poco tiempo para limpieza',
    },
  },
]

export default function Generador() {
  const [form, setForm] = useState({
    producto: '',
    caracteristicas: '',
    precio: '',
    audiencia: '',
    objetivo: 'ventas',
    generar: ['pagina_producto', 'publicidad'],
  })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  function toggleGenerar(id: string) {
    setForm(f => ({
      ...f,
      generar: f.generar.includes(id)
        ? f.generar.filter(g => g !== id)
        : [...f.generar, id],
    }))
  }

  function aplicarEjemplo(data: typeof EJEMPLOS[0]['data']) {
    setForm(f => ({ ...f, ...data }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.producto || form.generar.length === 0) return
    setLoading(true)
    setOutput('')

    const generarLabels = form.generar.map(id => {
      const op = OPCIONES_GENERAR.find(o => o.id === id)
      return op ? op.label : id
    })

    const res = await fetch('/api/generador', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, generar: generarLabels }),
    })

    if (!res.body) { setLoading(false); return }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let text = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      text += decoder.decode(value, { stream: true })
      setOutput(text)
      setTimeout(() => outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' }), 0)
    }

    setLoading(false)
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#0f0f0f', minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #E6007E, #c0005f)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>✨ Generador de Marketing</h1>
            <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.85 }}>Yani Trend — powered by Claude AI</p>
          </div>
          <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, textDecoration: 'none' }}>← Dashboard</a>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ flex: '0 0 420px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Ejemplos rápidos */}
          <div style={{ background: '#1a1a1a', borderRadius: 14, padding: 16 }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Ejemplos rápidos</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {EJEMPLOS.map(ej => (
                <button
                  key={ej.label}
                  type="button"
                  onClick={() => aplicarEjemplo(ej.data)}
                  style={{ background: '#2a2a2a', color: '#ccc', border: '1px solid #333', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}
                >
                  {ej.label}
                </button>
              ))}
            </div>
          </div>

          {/* Datos del producto */}
          <div style={{ background: '#1a1a1a', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: '0 0 4px', fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Producto</p>
            <div>
              <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>Nombre del producto *</label>
              <input
                value={form.producto}
                onChange={e => setForm(f => ({ ...f, producto: e.target.value }))}
                placeholder="Ej: Neocell Colágeno Hidrolizado"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>Características principales</label>
              <textarea
                value={form.caracteristicas}
                onChange={e => setForm(f => ({ ...f, caracteristicas: e.target.value }))}
                placeholder="Beneficios, ingredientes, formato, diferencial..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>Precio (ARS)</label>
                <input
                  value={form.precio}
                  onChange={e => setForm(f => ({ ...f, precio: e.target.value }))}
                  placeholder="18900"
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 2 }}>
                <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>Audiencia objetivo</label>
                <input
                  value={form.audiencia}
                  onChange={e => setForm(f => ({ ...f, audiencia: e.target.value }))}
                  placeholder="Ej: Mujeres 30-50, interesadas en salud"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Objetivo */}
          <div style={{ background: '#1a1a1a', borderRadius: 14, padding: 16 }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Objetivo de campaña</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {OBJETIVOS.map(obj => (
                <label key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 10px', borderRadius: 8, background: form.objetivo === obj.id ? '#2d0015' : 'transparent', border: `1px solid ${form.objetivo === obj.id ? '#E6007E' : 'transparent'}`, transition: 'all 0.15s' }}>
                  <input
                    type="radio"
                    name="objetivo"
                    value={obj.id}
                    checked={form.objetivo === obj.id}
                    onChange={() => setForm(f => ({ ...f, objetivo: obj.id }))}
                    style={{ accentColor: '#E6007E' }}
                  />
                  <span style={{ fontSize: 13, color: form.objetivo === obj.id ? '#fff' : '#aaa' }}>{obj.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Qué generar */}
          <div style={{ background: '#1a1a1a', borderRadius: 14, padding: 16 }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>¿Qué querés generar?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {OPCIONES_GENERAR.map(op => {
                const checked = form.generar.includes(op.id)
                return (
                  <label
                    key={op.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer',
                      padding: '8px 10px', borderRadius: 8,
                      background: checked ? '#2d0015' : '#222',
                      border: `1px solid ${checked ? '#E6007E' : '#333'}`,
                      transition: 'all 0.15s',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleGenerar(op.id)}
                      style={{ accentColor: '#E6007E', marginTop: 2 }}
                    />
                    <div>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: checked ? '#fff' : '#ccc' }}>{op.label}</p>
                      <p style={{ margin: 0, fontSize: 10, color: '#666' }}>{op.sub}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !form.producto || form.generar.length === 0}
            style={{
              background: loading ? '#555' : 'linear-gradient(135deg, #E6007E, #c0005f)',
              color: '#fff', border: 'none', borderRadius: 12, padding: '14px',
              fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? '⏳ Generando...' : '✨ Generar con AI'}
          </button>
        </form>

        {/* Output */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            ref={outputRef}
            style={{
              background: '#1a1a1a', borderRadius: 14, padding: 20,
              minHeight: 500, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto',
              border: '1px solid #2a2a2a',
              position: 'sticky', top: 20,
            }}
          >
            {!output && !loading && (
              <div style={{ textAlign: 'center', paddingTop: 80, color: '#555' }}>
                <p style={{ fontSize: 40 }}>✨</p>
                <p style={{ fontSize: 15, color: '#666' }}>Completá el formulario y hacé clic en <strong style={{ color: '#E6007E' }}>Generar con AI</strong></p>
                <p style={{ fontSize: 13, color: '#555' }}>El contenido generado aparecerá acá en tiempo real</p>
              </div>
            )}
            {loading && !output && (
              <div style={{ textAlign: 'center', paddingTop: 80, color: '#666' }}>
                <p style={{ fontSize: 30 }}>🤖</p>
                <p>Pensando...</p>
              </div>
            )}
            {output && (
              <pre style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: 13, lineHeight: 1.7, color: '#ddd', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {output}
              </pre>
            )}
          </div>

          {output && (
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                style={{ background: '#2a2a2a', color: '#ccc', border: '1px solid #333', borderRadius: 8, padding: '8px 16px', fontSize: 12, cursor: 'pointer' }}
              >
                📋 Copiar todo
              </button>
              <button
                onClick={() => setOutput('')}
                style={{ background: '#2a2a2a', color: '#ccc', border: '1px solid #333', borderRadius: 8, padding: '8px 16px', fontSize: 12, cursor: 'pointer' }}
              >
                🗑️ Limpiar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#111',
  border: '1px solid #333',
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 13,
  color: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
}
