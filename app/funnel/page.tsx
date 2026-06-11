'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

const FUNNEL_CONFIG = {
  businessId: 'yani-trend',
  headline: '¡Nunca más limpies el piso tú mismo!',
  subheadline: 'La Aspiradora Robot Jessica trabaja sola mientras vos hacés lo que te gusta — pagás solo cuando la recibís.',
  cta: 'Quiero mi Robot Ahora',
  benefits: [
    '🤖 Limpia sola mientras dormís o trabajás',
    '🐾 Ideal para casas con mascotas',
    '💳 Pagás solo cuando la recibís',
    '🚚 Envío gratis a todo el país',
    '✅ 30 días de garantía sin preguntas',
  ],
  urgency: '⚡ Solo quedan 12 unidades disponibles hoy',
  price: '38.630',
  originalPrice: '52.000',
  discount: '26% OFF',
  socialProof: { count: 328, label: 'compradores felices este mes' },
  colors: { primary: '#E6007E', accent: '#FFF0F8' },
  greeting: '¡Hola! 👋 Soy la asistente de Yani Trend. ¿Te interesa la Aspiradora Robot Jessica? Contame un poco para ayudarte mejor 😊',
};

export default function FunnelPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [score, setScore] = useState(10);
  const [captured, setCaptured] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState({ h: 4, m: 23, s: 47 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: FUNNEL_CONFIG.greeting, timestamp: new Date().toISOString() }]);
    }
  }, [chatOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    const userChatMsg: ChatMessage = { role: 'user', content: userMsg, timestamp: new Date().toISOString() };
    const newHistory = [...messages, userChatMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch('/api/funnel/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ leadId, businessId: FUNNEL_CONFIG.businessId, message: userMsg, chatHistory: newHistory }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, timestamp: new Date().toISOString() }]);
      if (data.leadId) setLeadId(data.leadId);
      if (data.score) setScore(data.score);
      if (data.capturedPhone) setCaptured(true);
      if (data.whatsappUrl) setWhatsappUrl(data.whatsappUrl);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Disculpá, tuve un problema. ¿Podés escribirnos directo al WhatsApp? 😊', timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: '100vh', background: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .btn-primary { background: #E6007E; color: white; border: none; cursor: pointer; font-family: inherit; font-weight: 700; transition: all .2s; }
        .btn-primary:hover { background: #c2006b; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(230,0,126,.35); }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        .bounce { animation: bounce 1s ease infinite; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .chat-in { animation: fadeIn .3s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .star { color: #FFB800; }
      `}</style>

      {/* Announcement bar */}
      <div style={{ background: '#E6007E', color: 'white', textAlign: 'center', padding: '10px 16px', fontSize: 14, fontWeight: 600 }}>
        🚚 ENVÍO GRATIS a todo el país + PAGO CUANDO RECIBÍS
      </div>

      {/* Countdown bar */}
      <div style={{ background: '#1a1a2e', color: 'white', textAlign: 'center', padding: '10px 16px', fontSize: 13 }}>
        ⏰ Oferta termina en:&nbsp;
        <span style={{ fontWeight: 800, fontSize: 16, color: '#E6007E' }}>
          {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
        </span>
        &nbsp;— 26% OFF en Aspiradora Robot Jessica
      </div>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
        {/* Left */}
        <div>
          <div style={{ display: 'inline-block', background: '#FFF0F8', color: '#E6007E', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
            ⭐ {FUNNEL_CONFIG.socialProof.count} {FUNNEL_CONFIG.socialProof.label}
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800, lineHeight: 1.15, color: '#1a1a2e', marginBottom: 16 }}>
            {FUNNEL_CONFIG.headline}
          </h1>
          <p style={{ fontSize: 18, color: '#555', marginBottom: 28, lineHeight: 1.6 }}>
            {FUNNEL_CONFIG.subheadline}
          </p>

          <div style={{ marginBottom: 28 }}>
            {FUNNEL_CONFIG.benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 15 }}>
                <span style={{ fontSize: 20 }}>{b.split(' ')[0]}</span>
                <span style={{ color: '#333' }}>{b.slice(b.indexOf(' ') + 1)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 40, fontWeight: 800, color: '#E6007E' }}>$&nbsp;{FUNNEL_CONFIG.price}</span>
            <span style={{ fontSize: 18, color: '#999', textDecoration: 'line-through' }}>$&nbsp;{FUNNEL_CONFIG.originalPrice}</span>
            <span style={{ background: '#E6007E', color: '#fff', borderRadius: 8, padding: '2px 8px', fontSize: 13, fontWeight: 700 }}>{FUNNEL_CONFIG.discount}</span>
          </div>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>ARS · Precios en pesos argentinos</div>

          <button
            className="btn-primary pulse"
            onClick={() => setChatOpen(true)}
            style={{ width: '100%', padding: '18px 32px', borderRadius: 14, fontSize: 18, letterSpacing: .3 }}
          >
            {FUNNEL_CONFIG.cta} →
          </button>

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 20, fontSize: 12, color: '#888' }}>
            <span>🔒 Pago seguro</span>
            <span>📦 Sin riesgo</span>
            <span>✅ Garantía 30d</span>
          </div>
        </div>

        {/* Right — product visual */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', background: '#F3E9DF', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 120, textAlign: 'center' }}>🤖</div>
            <div style={{ position: 'absolute', top: 16, right: 16, background: '#E6007E', color: 'white', borderRadius: 20, padding: '6px 14px', fontWeight: 700, fontSize: 14 }}>
              {FUNNEL_CONFIG.discount}
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: '🚚', text: 'Envío gratis' },
              { icon: '💳', text: 'Pago al recibir' },
              { icon: '⭐', text: '4.9 / 5 estrellas' },
              { icon: '🔄', text: '30 días devolución' },
            ].map((b, i) => (
              <div key={i} style={{ background: '#F8F8F8', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500 }}>
                <span style={{ fontSize: 18 }}>{b.icon}</span> {b.text}
              </div>
            ))}
          </div>

          <div style={{ background: '#FFF0F8', borderRadius: 14, padding: 16, borderLeft: '4px solid #E6007E' }}>
            <p style={{ fontSize: 13, color: '#E6007E', fontWeight: 600, marginBottom: 4 }}>{FUNNEL_CONFIG.urgency}</p>
            <p style={{ fontSize: 12, color: '#888' }}>Última actualización de stock hace 2 horas</p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ background: '#F8F8F8', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 32 }}>
            Lo que dicen nuestros clientes
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              { name: 'Valentina M.', location: 'CABA', text: 'La tengo hace 3 meses y funciona re bien. Con mis dos gatos era un caos y ahora limpia sola dos veces por día. Vale cada peso 💕', stars: 5 },
              { name: 'Rodrigo G.', location: 'Córdoba', text: 'Llegó en 3 días, impecable. La caja re bien cuidada y el robot es silencioso. Lo que más me sorprendió es que sortea los muebles solo 🤖', stars: 5 },
              { name: 'Carolina F.', location: 'Rosario', text: 'Al principio dudé por el precio pero realmente vale la pena. El pago contra entrega me dio mucha confianza para animarme a comprarlo ✅', stars: 5 },
            ].map((r, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,.06)' }}>
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  {'⭐'.repeat(r.stars).split('').map((s, j) => <span key={j} className="star">{s}</span>)}
                </div>
                <p style={{ fontSize: 14, color: '#444', lineHeight: 1.6, marginBottom: 12 }}>"{r.text}"</p>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{r.name}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{r.location} · Compra verificada</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '56px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #E6007E 100%)' }}>
        <h2 style={{ color: 'white', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800, marginBottom: 16 }}>
          ¿Querés tener la tuya?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, marginBottom: 32 }}>
          Hablá con nuestra asistente — te ayuda a elegir y coordinar el envío en minutos.
        </p>
        <button
          className="btn-primary bounce"
          onClick={() => setChatOpen(true)}
          style={{ padding: '18px 48px', borderRadius: 14, fontSize: 18, border: '2px solid rgba(255,255,255,0.4)', background: 'white', color: '#E6007E' }}
        >
          💬 Hablar con la asistente
        </button>
      </section>

      {/* Chat Widget */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          style={{
            position: 'fixed', bottom: 24, right: 24, width: 60, height: 60,
            borderRadius: '50%', background: '#E6007E', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(230,0,126,.5)', zIndex: 999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
          }}
        >
          💬
        </button>
      )}

      {chatOpen && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, width: 'min(380px, calc(100vw - 32px))',
          height: 'min(520px, calc(100vh - 100px))',
          background: 'white', borderRadius: 20, boxShadow: '0 16px 64px rgba(0,0,0,.2)',
          zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ background: '#E6007E', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Asistente Yani Trend</div>
              <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 12 }}>● En línea ahora</div>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 20 }}>×</button>
          </div>

          {/* Score bar */}
          <div style={{ height: 4, background: '#F0F0F0' }}>
            <div style={{ height: '100%', width: `${score}%`, background: score >= 70 ? '#00C47D' : score >= 40 ? '#E6007E' : '#FFB800', transition: 'all .5s' }} />
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} className="chat-in" style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role === 'user' ? '#E6007E' : '#F4F4F4',
                  color: m.role === 'user' ? 'white' : '#333',
                  fontSize: 14, lineHeight: 1.5,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 4, padding: '10px 14px', background: '#F4F4F4', borderRadius: '16px 16px 16px 4px', width: 60 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#bbb', animation: `pulse ${0.6 + i * 0.2}s ease infinite` }} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp redirect if captured */}
          {captured && whatsappUrl && (
            <div style={{ padding: '8px 16px', background: '#FFF0F8', borderTop: '1px solid #FFD6EE' }}>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', background: '#25D366', color: 'white', textAlign: 'center', padding: '10px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                📱 Continuar en WhatsApp
              </a>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #F0F0F0', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Escribí tu mensaje..."
              style={{ flex: 1, border: '1.5px solid #E0E0E0', borderRadius: 24, padding: '10px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="btn-primary"
              style={{ width: 44, height: 44, borderRadius: '50%', fontSize: 18, padding: 0, opacity: input.trim() ? 1 : 0.4 }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
