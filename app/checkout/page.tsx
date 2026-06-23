'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const PRODUCTOS: Record<string, { nombre: string; precio: number; precioOriginal: number; imagen: string }> = {
  'vaso-termico': {
    nombre: 'Vaso Térmico con Sensor 400ml',
    precio: 29900,
    precioOriginal: 45000,
    imagen: 'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_1758490472termocafe.jpg',
  },
  'termo-sensor': {
    nombre: 'Termo con Sensor 500ml',
    precio: 35900,
    precioOriginal: 52000,
    imagen: 'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_1758490472termocafe.jpg',
  },
  'parlante-clip5': {
    nombre: 'Parlante Clip 5 Bluetooth',
    precio: 23900,
    precioOriginal: 36000,
    imagen: 'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_1758490472termocafe.jpg',
  },
  'nebulizador-mesh': {
    nombre: 'Nebulizador Mesh Inalámbrico',
    precio: 49900,
    precioOriginal: 79900,
    imagen: 'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/nebulizador-mesh.jpg',
  },
}

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
  'Tierra del Fuego', 'Tucumán',
]

interface FormData {
  nombre: string
  apellido: string
  email: string
  telefono: string
  dni: string
  direccion: string
  ciudad: string
  provincia: string
  cp: string
  cantidad: number
}

const FIELD_STYLE: React.CSSProperties = {
  width: '100%',
  border: '1.5px solid #e0e0e0',
  borderRadius: 10,
  padding: '12px 14px',
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  background: '#fafafa',
  transition: 'border-color 0.2s',
}

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#555',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

function CheckoutContent() {
  const params = useSearchParams()
  const [productoKey, setProductoKey] = useState(params.get('producto') || 'vaso-termico')
  const producto = PRODUCTOS[productoKey] || PRODUCTOS['vaso-termico']

  const [form, setForm] = useState<FormData>({
    nombre: params.get('nombre') || '',
    apellido: '',
    email: '',
    telefono: params.get('telefono') || '',
    dni: '',
    direccion: '',
    ciudad: '',
    provincia: 'Neuquén',
    cp: '',
    cantidad: 1,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = producto.precio * form.cantidad
  const descuento = Math.round((1 - producto.precio / producto.precioOriginal) * 100)

  function update(field: keyof FormData, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const required: (keyof FormData)[] = ['nombre', 'apellido', 'email', 'telefono', 'dni', 'direccion', 'ciudad', 'provincia', 'cp']
    for (const field of required) {
      if (!String(form[field]).trim()) {
        setError('Por favor completá todos los campos obligatorios.')
        return
      }
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('El email no parece válido.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/mercadopago/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, producto: productoKey }),
      })
      const data = await res.json()

      if (!res.ok || !data.init_point) {
        setError(data.error || 'Error al procesar el pago. Intentá de nuevo.')
        setLoading(false)
        return
      }

      window.location.href = data.init_point
    } catch {
      setError('Error de conexión. Verificá tu internet e intentá de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Poppins', Arial, sans-serif", background: '#F3E9DF', minHeight: '100vh', color: '#2B2B2B' }}>
      {/* Header */}
      <div style={{ background: '#E6007E', color: '#fff', textAlign: 'center', padding: '12px 16px' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
          🔒 Pago 100% seguro · Mercado Pago · SSL
        </p>
      </div>

      <div style={{ maxWidth: 540, margin: '0 auto', padding: '20px 16px 60px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#E6007E', letterSpacing: '-0.5px' }}>
            Yani Trend
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>Finalizá tu compra</p>
        </div>

        {/* Resumen del producto */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: 20, marginBottom: 20,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', gap: 14, alignItems: 'center',
        }}>
          <img
            src={producto.imagen}
            alt={producto.nombre}
            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{producto.nombre}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#E6007E' }}>
                ${producto.precio.toLocaleString('es-AR')}
              </span>
              <span style={{ fontSize: 13, color: '#bbb', textDecoration: 'line-through' }}>
                ${producto.precioOriginal.toLocaleString('es-AR')}
              </span>
              <span style={{ background: '#E6007E', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '2px 8px' }}>
                -{descuento}%
              </span>
            </div>
            {/* Selector cantidad */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
              <span style={{ fontSize: 12, color: '#888' }}>Cantidad:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => update('cantidad', Math.max(1, form.cantidad - 1))}
                  style={{ background: '#f5f5f5', border: 'none', padding: '4px 12px', fontSize: 16, cursor: 'pointer', fontWeight: 700 }}
                >−</button>
                <span style={{ padding: '4px 16px', fontSize: 14, fontWeight: 700 }}>{form.cantidad}</span>
                <button
                  type="button"
                  onClick={() => update('cantidad', Math.min(10, form.cantidad + 1))}
                  style={{ background: '#f5f5f5', border: 'none', padding: '4px 12px', fontSize: 16, cursor: 'pointer', fontWeight: 700 }}
                >+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Selector de producto */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#555' }}>CAMBIAR PRODUCTO</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(PRODUCTOS).map(([key, p]) => (
              <label key={key} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                border: `2px solid ${productoKey === key ? '#E6007E' : '#e0e0e0'}`,
                borderRadius: 10, cursor: 'pointer', background: productoKey === key ? '#fff0f7' : '#fff',
                transition: 'all 0.2s',
              }}>
                <input
                  type="radio"
                  name="producto"
                  value={key}
                  checked={productoKey === key}
                  onChange={() => setProductoKey(key)}
                  style={{ accentColor: '#E6007E' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{p.nombre}</p>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#E6007E' }}>
                  ${p.precio.toLocaleString('es-AR')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700 }}>👤 Datos personales</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={LABEL_STYLE}>Nombre *</label>
                <input
                  style={FIELD_STYLE}
                  value={form.nombre}
                  onChange={e => update('nombre', e.target.value)}
                  placeholder="María"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label style={LABEL_STYLE}>Apellido *</label>
                <input
                  style={FIELD_STYLE}
                  value={form.apellido}
                  onChange={e => update('apellido', e.target.value)}
                  placeholder="López"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={LABEL_STYLE}>Email *</label>
              <input
                style={FIELD_STYLE}
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="maria@ejemplo.com"
                autoComplete="email"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={LABEL_STYLE}>Teléfono / WhatsApp *</label>
                <input
                  style={FIELD_STYLE}
                  type="tel"
                  value={form.telefono}
                  onChange={e => update('telefono', e.target.value)}
                  placeholder="2996593402"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label style={LABEL_STYLE}>DNI *</label>
                <input
                  style={FIELD_STYLE}
                  value={form.dni}
                  onChange={e => update('dni', e.target.value.replace(/\D/g, ''))}
                  placeholder="12345678"
                  maxLength={8}
                />
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700 }}>📦 Dirección de entrega</p>

            <div style={{ marginBottom: 12 }}>
              <label style={LABEL_STYLE}>Calle y número *</label>
              <input
                style={FIELD_STYLE}
                value={form.direccion}
                onChange={e => update('direccion', e.target.value)}
                placeholder="San Martín 1234"
                autoComplete="street-address"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={LABEL_STYLE}>Ciudad *</label>
                <input
                  style={FIELD_STYLE}
                  value={form.ciudad}
                  onChange={e => update('ciudad', e.target.value)}
                  placeholder="Neuquén"
                  autoComplete="address-level2"
                />
              </div>
              <div>
                <label style={LABEL_STYLE}>Código postal *</label>
                <input
                  style={FIELD_STYLE}
                  value={form.cp}
                  onChange={e => update('cp', e.target.value.replace(/\D/g, ''))}
                  placeholder="8300"
                  maxLength={8}
                  autoComplete="postal-code"
                />
              </div>
            </div>

            <div>
              <label style={LABEL_STYLE}>Provincia *</label>
              <select
                style={{ ...FIELD_STYLE, cursor: 'pointer' }}
                value={form.provincia}
                onChange={e => update('provincia', e.target.value)}
              >
                {PROVINCIAS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Resumen total */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>🧾 Resumen del pedido</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#666' }}>{producto.nombre} × {form.cantidad}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>${total.toLocaleString('es-AR')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Envío</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>Gratis</span>
            </div>
            <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#E6007E' }}>${total.toLocaleString('es-AR')}</span>
            </div>
          </div>

          {/* Métodos de pago */}
          <div style={{ background: '#fff5f9', border: '2px solid #E6007E', borderRadius: 16, padding: 16, marginBottom: 16, textAlign: 'center' }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#E6007E' }}>
              💳 Pagá con Mercado Pago
            </p>
            <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
              Tarjeta de crédito · débito · transferencia · efectivo (Rapipago / Pago Fácil)
            </p>
          </div>

          {/* Garantías */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['🔒 Pago seguro', '🚚 Envío gratis', '✅ Compra protegida'].map(b => (
              <span key={b} style={{ background: '#fff', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 500, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                {b}
              </span>
            ))}
          </div>

          {error && (
            <div style={{ background: '#fff0f0', border: '1.5px solid #ffcccc', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#cc0000' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #009ee3, #0073c4)',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '18px',
              fontSize: 17,
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.3px',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(0,115,196,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? '⏳ Procesando...' : '💳 Ir a pagar con Mercado Pago →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#aaa', marginTop: 12 }}>
            Al continuar aceptás los términos y condiciones. Pago procesado por Mercado Pago.
          </p>
        </form>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'Arial' }}>Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
