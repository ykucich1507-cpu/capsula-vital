'use client'

import { useState, useEffect, useCallback } from 'react'

interface Lead {
  id: string
  name: string
  phone: string
  product: string
  score: number
  source: string
  status: 'nuevo' | 'contactado' | 'vendido' | 'perdido'
  createdAt: string
}

const STATUS_LABELS: Record<Lead['status'], string> = {
  nuevo: '🆕 Nuevo',
  contactado: '📞 Contactado',
  vendido: '✅ Vendido',
  perdido: '❌ Perdido',
}

const STATUS_COLORS: Record<Lead['status'], string> = {
  nuevo: '#3b82f6',
  contactado: '#f59e0b',
  vendido: '#10b981',
  perdido: '#ef4444',
}

function kpiCard(label: string, value: string | number, sub?: string, color = '#E6007E') {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', flex: 1, minWidth: 140,
    }}>
      <p style={{ margin: '0 0 4px', fontSize: 12, color: '#888' }}>{label}</p>
      <p style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 800, color }}>{value}</p>
      {sub && <p style={{ margin: 0, fontSize: 11, color: '#aaa' }}>{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selected, setSelected] = useState<Lead | null>(null)
  const [filter, setFilter] = useState<Lead['status'] | 'todos'>('todos')
  const [loading, setLoading] = useState(true)

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/funnel/leads')
      const data = await res.json()
      setLeads(data.leads || [])
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  async function updateStatus(id: string, status: Lead['status']) {
    await fetch('/api/funnel/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const today = new Date().toDateString()
  const leadsHoy = leads.filter(l => new Date(l.createdAt).toDateString() === today).length
  const calientes = leads.filter(l => l.score >= 70 && l.status === 'nuevo').length
  const vendidos = leads.filter(l => l.status === 'vendido').length
  const tasa = leads.length > 0 ? Math.round((vendidos / leads.length) * 100) : 0
  const ingresosEst = vendidos * 35900

  const filtered = filter === 'todos' ? leads : leads.filter(l => l.status === filter)

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#F3E9DF', minHeight: '100vh', color: '#2B2B2B' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #E6007E, #c0005f)', color: '#fff', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>📊 Dashboard Yani Trend</h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.85 }}>Leads & ventas en tiempo real</p>
          </div>
          <button
            onClick={fetchLeads}
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 10, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        {/* KPIs */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          {kpiCard('Leads hoy', leadsHoy, 'capturados hoy', '#3b82f6')}
          {kpiCard('Leads totales', leads.length, 'todos los tiempos')}
          {kpiCard('Calientes 🔥', calientes, 'score ≥70, sin contactar', '#f59e0b')}
          {kpiCard('Vendidos ✅', vendidos, `tasa ${tasa}%`, '#10b981')}
          {kpiCard('Ingresos est.', `$${ingresosEst.toLocaleString('es-AR')}`, 'por ventas cerradas', '#E6007E')}
        </div>

        {/* Embudo visual */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Embudo de conversión</h3>
          <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
            {(['nuevo', 'contactado', 'vendido', 'perdido'] as Lead['status'][]).map((s, i) => {
              const count = leads.filter(l => l.status === s).length
              const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0
              return (
                <div key={s} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                  {i > 0 && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: '#ddd', fontSize: 20 }}>›</div>}
                  <div style={{ background: `${STATUS_COLORS[s]}20`, borderRadius: 12, padding: '12px 8px', margin: '0 4px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: STATUS_COLORS[s] }}>{count}</p>
                    <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: STATUS_COLORS[s] }}>{pct}%</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#888' }}>{STATUS_LABELS[s].split(' ')[1]}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Lista leads */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flex: selected ? '0 0 55%' : 1 }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['todos', 'nuevo', 'contactado', 'vendido', 'perdido'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      background: filter === f ? '#E6007E' : '#f3f3f3',
                      color: filter === f ? '#fff' : '#555', border: 'none',
                    }}
                  >
                    {f === 'todos' ? `Todos (${leads.length})` : `${STATUS_LABELS[f]} (${leads.filter(l => l.status === f).length})`}
                  </button>
                ))}
              </div>

              {loading ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>Cargando leads...</div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center' }}>
                  <p style={{ fontSize: 32 }}>🎯</p>
                  <p style={{ color: '#888', fontSize: 14 }}>No hay leads aún. Compartí el link del embudo para empezar a capturar.</p>
                  <a href="/funnel" style={{ color: '#E6007E', fontWeight: 600, fontSize: 13 }}>Ver embudo →</a>
                </div>
              ) : (
                filtered.map(lead => (
                  <div
                    key={lead.id}
                    onClick={() => setSelected(selected?.id === lead.id ? null : lead)}
                    style={{
                      padding: '14px 20px', borderBottom: '1px solid #f8f8f8', cursor: 'pointer',
                      background: selected?.id === lead.id ? '#fff8fc' : '#fff',
                      display: 'flex', alignItems: 'center', gap: 12,
                      transition: 'background 0.15s',
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', background: `${STATUS_COLORS[lead.status]}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, flexShrink: 0,
                    }}>
                      {lead.status === 'vendido' ? '✅' : lead.status === 'perdido' ? '❌' : lead.score >= 70 ? '🔥' : '👤'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{lead.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.product}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ background: `${STATUS_COLORS[lead.status]}20`, color: STATUS_COLORS[lead.status], borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                        {STATUS_LABELS[lead.status]}
                      </div>
                      <p style={{ margin: 0, fontSize: 11, color: '#aaa' }}>Score: {lead.score}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Panel de detalle */}
          {selected && (
            <div style={{ flex: 1, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '20px', position: 'sticky', top: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Detalle del lead</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#aaa' }}>✕</button>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff0f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 12 }}>
                  {selected.score >= 70 ? '🔥' : '👤'}
                </div>
                <p style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700 }}>{selected.name}</p>
                <p style={{ margin: 0, fontSize: 13, color: '#888' }}>{selected.product}</p>
              </div>

              {[
                { label: 'WhatsApp', value: selected.phone },
                { label: 'Score', value: `${selected.score}/100` },
                { label: 'Fuente', value: selected.source },
                { label: 'Fecha', value: new Date(selected.createdAt).toLocaleString('es-AR') },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 13, color: '#888' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{value}</span>
                </div>
              ))}

              {/* Barra score */}
              <div style={{ marginTop: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#888' }}>Nivel de interés</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#E6007E' }}>{selected.score}%</span>
                </div>
                <div style={{ background: '#f0f0f0', borderRadius: 99, height: 8 }}>
                  <div style={{ background: 'linear-gradient(90deg, #E6007E, #ff6b6b)', width: `${selected.score}%`, height: '100%', borderRadius: 99, transition: 'width 0.5s' }} />
                </div>
              </div>

              {/* Acciones */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a
                  href={`https://wa.me/${selected.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${selected.name}! Te escribo de Yani Trend. ¿Seguís interesado en el ${selected.product}?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: '#25D366', color: '#fff', borderRadius: 10, padding: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}
                >
                  📲 Abrir WhatsApp
                </a>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['contactado', 'vendido', 'perdido'] as Lead['status'][]).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      style={{
                        flex: 1, background: selected.status === s ? STATUS_COLORS[s] : `${STATUS_COLORS[s]}20`,
                        color: selected.status === s ? '#fff' : STATUS_COLORS[s],
                        border: 'none', borderRadius: 8, padding: '8px 4px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
