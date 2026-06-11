'use client'

import { useState, useEffect, useRef } from 'react'

const PRODUCT = {
  name: 'Vaso Térmico con Sensor de Temperatura',
  price: 35900,
  originalPrice: 52000,
  stock: 7,
  image: 'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_1758490472termocafe.jpg',
  url: 'https://yanitrend.com/products/termo-con-sensor-de-temperatura',
}

const WHATSAPP_NUMBER = '5491100000000' // reemplazar con número real

interface Message {
  role: 'bot' | 'user'
  text: string
}

interface LeadScore {
  score: number
  stage: 'inicio' | 'interes' | 'calificado' | 'capturado'
}

const BOT_FLOW = [
  { trigger: 'inicio', message: '¡Hola! 👋 Te cuento sobre el Vaso Térmico con Sensor. ¿Lo buscás para vos o para regalar?' },
  { trigger: 'uso', message: '¡Buenísimo! 😊 ¿Lo usarías más para mate, café o agua fría?' },
  { trigger: 'bebida', message: 'Perfecto — mantiene la temperatura exacta para eso. ¿Cuál es tu nombre?' },
  { trigger: 'nombre', message: '¿Y tu número de WhatsApp? Te coordino el envío sin cargo 🚚' },
  { trigger: 'telefono', message: '' },
]

function getBotReply(userMsg: string, step: number): { reply: string; nextStep: number; captured?: { name?: string; phone?: string } } {
  const msg = userMsg.toLowerCase().trim()

  if (step === 0) {
    return { reply: BOT_FLOW[1].message, nextStep: 1 }
  }
  if (step === 1) {
    return { reply: BOT_FLOW[2].message, nextStep: 2 }
  }
  if (step === 2) {
    const name = userMsg.trim()
    return { reply: BOT_FLOW[3].message, nextStep: 3, captured: { name } }
  }
  if (step === 3) {
    const phone = msg.replace(/\D/g, '')
    if (phone.length < 8) {
      return { reply: 'Necesito tu número de WhatsApp para coordinar el envío. ¿Podés mandármelo?', nextStep: 3 }
    }
    return {
      reply: `¡Genial! 🎉 Ya tenemos tu lugar reservado. Te va a llegar un mensaje de WhatsApp para coordinar la entrega. ¡Pagás cuando lo recibís!`,
      nextStep: 4,
      captured: { phone },
    }
  }
  return { reply: '¡Listo! En breve te contactamos por WhatsApp. 😊', nextStep: 4 }
}

function Countdown() {
  const [time, setTime] = useState({ h: 2, m: 47, s: 33 })

  useEffect(() => {
    const id = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev
        s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) return { h: 2, m: 59, s: 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
      {[{ v: time.h, l: 'hs' }, { v: time.m, l: 'min' }, { v: time.s, l: 'seg' }].map(({ v, l }, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            background: '#1a1a1a', color: '#fff', borderRadius: 8,
            padding: '8px 14px', fontSize: 28, fontWeight: 700, minWidth: 56, textAlign: 'center', letterSpacing: 2
          }}>{pad(v)}</div>
          <span style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{l}</span>
        </div>
      ))}
    </div>
  )
}

export default function FunnelPage() {
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: BOT_FLOW[0].message }
  ])
  const [input, setInput] = useState('')
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const [leadData, setLeadData] = useState<{ name?: string; phone?: string }>({})
  const [leadCaptured, setLeadCaptured] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const scoreLabel = score < 30 ? 'Explorando' : score < 60 ? 'Interesado' : score < 90 ? '¡Muy interesado!' : '¡Listo para comprar!'
  const scoreColor = score < 30 ? '#888' : score < 60 ? '#f59e0b' : score < 90 ? '#10b981' : '#E6007E'

  async function sendMessage() {
    if (!input.trim() || sending) return
    const userText = input.trim()
    setInput('')
    setSending(true)

    const userMsg: Message = { role: 'user', text: userText }
    setMessages(prev => [...prev, userMsg])

    const { reply, nextStep, captured } = getBotReply(userText, step)

    const newLeadData = { ...leadData, ...captured }
    setLeadData(newLeadData)
    setStep(nextStep)

    const newScore = Math.min(100, score + [20, 25, 30, 25][Math.min(step, 3)])
    setScore(newScore)

    if (nextStep === 4 && newLeadData.phone && !leadCaptured) {
      setLeadCaptured(true)
      try {
        await fetch('/api/funnel/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newLeadData.name || 'Sin nombre',
            phone: newLeadData.phone,
            product: PRODUCT.name,
            score: newScore,
            source: 'funnel-chat',
          }),
        })
      } catch {}
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
      setSending(false)
    }, 600)
  }

  function openWhatsApp() {
    const text = encodeURIComponent(`Hola! Me interesa el ${PRODUCT.name} a $${PRODUCT.price.toLocaleString('es-AR')} ARS. ¿Tienen stock disponible?`)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
  }

  const discount = Math.round((1 - PRODUCT.price / PRODUCT.originalPrice) * 100)

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#F3E9DF', minHeight: '100vh', color: '#2B2B2B' }}>
      {/* Barra urgencia */}
      <div style={{ background: '#E6007E', color: '#fff', textAlign: 'center', padding: '10px 16px', fontSize: 14, fontWeight: 600 }}>
        🔥 ¡Solo quedan {PRODUCT.stock} unidades! · Precio especial termina en: <span style={{ fontWeight: 700 }}>hoy</span>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 120px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', padding: '28px 0 16px' }}>
          <img src="/logo.png" alt="Yani Trend" style={{ height: 36, marginBottom: 8 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <p style={{ fontSize: 12, color: '#888', margin: 0 }}>Pagás cuando lo recibís 🇦🇷</p>
        </div>

        {/* Imagen producto */}
        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', marginBottom: 20, position: 'relative' }}>
          <img src={PRODUCT.image} alt={PRODUCT.name} style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 12, right: 12, background: '#E6007E', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>
            -{discount}% OFF
          </div>
        </div>

        {/* Precio y título */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 20px 16px', marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>{PRODUCT.name}</h1>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#E6007E' }}>${PRODUCT.price.toLocaleString('es-AR')}</span>
            <span style={{ fontSize: 16, color: '#bbb', textDecoration: 'line-through' }}>${PRODUCT.originalPrice.toLocaleString('es-AR')}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['✅ Envío gratis', '🔥 Pagás al recibir', '⚡ Entrega rápida'].map(b => (
              <span key={b} style={{ background: '#F3E9DF', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500 }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Countdown */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 16, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: '#E6007E' }}>⏰ Precio especial termina en:</p>
          <Countdown />
        </div>

        {/* Stock */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>🔥 Disponibilidad</span>
            <span style={{ fontSize: 13, color: '#E6007E', fontWeight: 700 }}>{PRODUCT.stock} unidades</span>
          </div>
          <div style={{ background: '#f0f0f0', borderRadius: 99, height: 8, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(90deg, #E6007E, #ff6b6b)', width: `${(PRODUCT.stock / 20) * 100}%`, height: '100%', borderRadius: 99 }} />
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 11, color: '#888' }}>93% vendido — ¡se acaba rápido!</p>
        </div>

        {/* Beneficios */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>¿Por qué te va a encantar?</h3>
          {[
            { icon: '🌡️', title: 'Sensor LED de temperatura', desc: 'Ves exactamente a qué temperatura está tu bebida en tiempo real' },
            { icon: '⏱️', title: 'Mantiene la temperatura 8h', desc: 'Frío o caliente, lo que elijas se mantiene todo el día' },
            { icon: '💧', title: '500ml — tamaño perfecto', desc: 'Ideal para mate, café, té o agua fría' },
            { icon: '🛡️', title: 'Acero inoxidable 304', desc: 'Sin BPA, seguro para toda la familia' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{title}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#666' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonios */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Lo que dicen nuestros clientes ⭐</h3>
          {[
            { name: 'María L.', city: 'Buenos Aires', text: 'Me encanta! El sensor de temperatura es increíble, ya no me quemo con el café 😍', stars: 5 },
            { name: 'Jorge P.', city: 'Córdoba', text: 'Llegó súper rápido y la calidad es excelente. Lo recomiendo 100%', stars: 5 },
            { name: 'Valentina R.', city: 'Rosario', text: 'Perfecto para el mate. Lo llevo al trabajo todos los días', stars: 5 },
          ].map(({ name, city, text, stars }) => (
            <div key={name} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{name} · {city}</span>
                <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(stars)}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#555' }}>"{text}"</p>
            </div>
          ))}
        </div>

        {/* CTA fijo */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', padding: '12px 16px', boxShadow: '0 -4px 20px rgba(0,0,0,0.12)', zIndex: 100 }}>
          <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', gap: 10 }}>
            <button
              onClick={openWhatsApp}
              style={{
                flex: 1, background: '#25D366', color: '#fff', border: 'none',
                borderRadius: 12, padding: '14px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}
            >
              📲 WhatsApp
            </button>
            <button
              onClick={() => setChatOpen(true)}
              style={{
                flex: 2, background: 'linear-gradient(135deg, #E6007E, #c0005f)', color: '#fff', border: 'none',
                borderRadius: 12, padding: '14px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}
            >
              🛒 Quiero mi termo
            </button>
          </div>
        </div>
      </div>

      {/* Chat modal */}
      {chatOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 480,
            maxHeight: '80vh', display: 'flex', flexDirection: 'column',
          }}>
            {/* Header chat */}
            <div style={{
              background: 'linear-gradient(135deg, #E6007E, #c0005f)', color: '#fff',
              padding: '16px 20px', borderRadius: '20px 20px 0 0', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>🤖 Asistente Yani Trend</p>
                <p style={{ margin: 0, fontSize: 11, opacity: 0.85 }}>Te ayudo a reservar tu termo</p>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>

            {/* Score bar */}
            {score > 0 && (
              <div style={{ padding: '8px 20px', background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#888' }}>Tu interés</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor }}>{scoreLabel}</span>
                </div>
                <div style={{ background: '#eee', borderRadius: 99, height: 4 }}>
                  <div style={{ background: scoreColor, width: `${score}%`, height: '100%', borderRadius: 99, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            )}

            {/* Mensajes */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 10,
                }}>
                  <div style={{
                    maxWidth: '80%', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: m.role === 'user' ? '#E6007E' : '#f3f3f3',
                    color: m.role === 'user' ? '#fff' : '#2B2B2B',
                    fontSize: 14, lineHeight: 1.5,
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {sending && (
                <div style={{ display: 'flex', gap: 4, padding: '8px 12px', background: '#f3f3f3', borderRadius: 16, width: 56, marginBottom: 10 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#bbb', animation: `bounce 1s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {step < 4 ? (
              <div style={{ padding: '12px 16px', borderTop: '1px solid #eee', display: 'flex', gap: 8 }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder={step === 3 ? 'Ej: 11 1234 5678' : 'Escribí tu respuesta...'}
                  style={{
                    flex: 1, border: '1.5px solid #e0e0e0', borderRadius: 12, padding: '10px 14px',
                    fontSize: 14, outline: 'none', fontFamily: 'inherit',
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  style={{
                    background: '#E6007E', color: '#fff', border: 'none', borderRadius: 12,
                    padding: '10px 16px', fontSize: 18, cursor: 'pointer', opacity: !input.trim() ? 0.5 : 1,
                  }}
                >
                  ➤
                </button>
              </div>
            ) : (
              <div style={{ padding: '16px', borderTop: '1px solid #eee' }}>
                <button
                  onClick={openWhatsApp}
                  style={{
                    width: '100%', background: '#25D366', color: '#fff', border: 'none',
                    borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  📲 Ir a WhatsApp para confirmar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(-4px) }
        }
      `}</style>
    </div>
  )
}
