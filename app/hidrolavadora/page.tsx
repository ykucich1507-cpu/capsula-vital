'use client'

import { useEffect, useState } from 'react'

const PRODUCT = {
  name: 'Hidrolavadora Inalámbrica a Batería',
  price: 51500,
  originalPrice: 68000,
}

// TODO: reemplazar por el número real de WhatsApp de Yani Trend
const WHATSAPP_NUMBER = '5493400000000'
// Los CTAs internos scrollean al formulario de pedido
const CHECKOUT_URL = '#pedido'

function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

const PAIN_POINTS = [
  { icon: 'unplug', title: 'Manguera enredada', desc: 'Se traba, se enreda y no llega a donde la necesitás.' },
  { icon: 'droplet-off', title: 'Poca presión de la canilla', desc: 'El agua sale débil y tardás el doble en sacar la suciedad.' },
  { icon: 'clock-alarm-clock', title: 'Nunca tenés tiempo', desc: 'Terminás dejando el auto, la moto o el patio sucios para "otro día".' },
]

const STEPS = [
  { num: '01', icon: 'battery-charging', title: 'Cargás la batería', desc: 'Se carga como cualquier herramienta inalámbrica. Una carga te rinde para varios usos.' },
  { num: '02', icon: 'droplets', title: 'La conectás al agua', desc: 'A la canilla, a un balde o a un tanque. No necesita instalación ni enchufe.' },
  { num: '03', icon: 'zap', title: 'Apretás el gatillo', desc: 'Presión ajustable al instante. Auto, moto, patio, terraza o jardín, según lo que necesites.' },
]

const BENEFITS = [
  'Sin cables ni enchufes — 100% a batería recargable',
  'Liviana: solo 1.7 kg, se maneja con una sola mano',
  'Presión ajustable para cada superficie',
  'Incluye boquillas intercambiables',
  'Ideal para auto, moto, bici, patio, terraza y jardín',
  'Se usa en cualquier lugar, tenga canilla cerca o no',
]

// PLACEHOLDER — reemplazar con testimonios reales antes de publicar
const TESTIMONIALS = [
  { init: 'M', name: 'Marcos D.', city: 'Buenos Aires', text: '"Lavaba el auto con balde y esponja y tardaba una hora. Con esto termino en 15 minutos y queda mejor."' },
  { init: 'L', name: 'Lucía F.', city: 'Córdoba', text: '"La uso para el patio y para la moto. Es liviana y la batería aguanta bastante más de lo que pensé."' },
  { init: 'R', name: 'Rodrigo S.', city: 'Rosario', text: '"Pagué al recibir así que no arriesgué nada. Llegó bien embalada y anda perfecto."' },
]

// PLACEHOLDER — reemplazar por datos reales de ventas/rating antes de publicar
const SOCIAL_PROOF = { sold: '+500 vendidas', rating: 4.8, reviews: 214 }

const FAQ = [
  { q: '¿Tarda en llegar?', a: 'El envío es a todo el país y llega en 3 a 7 días hábiles según tu provincia. Te avisamos por WhatsApp en cada paso.' },
  { q: '¿Cómo pago?', a: 'Pagás en efectivo cuando el repartidor te entrega el paquete en la puerta de tu casa. No necesitás tarjeta ni adelantar nada.' },
  { q: '¿Qué pasa si no me gusta?', a: 'Tenés 30 días de garantía. Si no cumple lo que esperabas, te ayudamos con el cambio o la devolución.' },
  { q: '¿Funciona con cualquier canilla?', a: 'Sí, se conecta a cualquier canilla estándar, a un balde o a un tanque de agua. No necesita instalación.' },
  { q: '¿Cuánto dura la batería?', a: 'Una carga completa te alcanza para varios usos seguidos (auto, patio o moto en la misma sesión de limpieza).' },
]

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

export default function HidrolavadoraPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [form, setForm] = useState({ nombre: '', telefono: '', direccion: '', ciudad: '', cp: '', cantidad: '1' })
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function setField(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function submitPedido(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.telefono.trim() || formState === 'sending') return
    setFormState('sending')
    try {
      const res = await fetch('/api/hidrolavadora/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setFormState(res.ok ? 'sent' : 'error')
    } catch {
      setFormState('error')
    }
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js'
    script.onload = () => {
      // @ts-ignore
      if (window.lucide) window.lucide.createIcons()
    }
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  useEffect(() => {
    // @ts-ignore
    if (window.lucide) window.lucide.createIcons()
  }, [openFaq, formState])

  const discount = Math.round((1 - PRODUCT.price / PRODUCT.originalPrice) * 100)

  return (
    <>
      <style>{`
        :root {
          --fucsia: #E6007E; --fucsia-hover: #FF1A92; --fucsia-press: #C70070;
          --fucsia-soft: #FBE0EF; --beige: #F3E9DF; --beige-deep: #E9DACB;
          --carbon: #2B2B2B; --carbon-70: #5C5C5C; --carbon-45: #8A8A8A;
          --line: #ECECEC; --font: 'Poppins', system-ui, sans-serif;
          --shadow-sm: 0 1px 2px rgba(43,43,43,0.05), 0 2px 6px rgba(43,43,43,0.05);
          --shadow-md: 0 6px 18px rgba(43,43,43,0.07);
          --shadow-lg: 0 18px 50px rgba(43,43,43,0.11);
          --shadow-fucsia: 0 10px 28px rgba(230,0,126,0.28);
          --ease: cubic-bezier(0.22, 1, 0.36, 1); --dur: 220ms;
        }
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; font-family: var(--font); background: #fff; color: var(--carbon); -webkit-font-smoothing: antialiased; }
        .wrap { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
        .ann { background: var(--fucsia); color: #fff; text-align: center; padding: 11px 16px; font-size: 14px; font-weight: 600; letter-spacing: 0.01em; }
        .ann .sep { opacity: 0.45; margin: 0 14px; }
        .hdr { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.92); backdrop-filter: blur(16px); border-bottom: 1px solid var(--line); }
        .hdr-inner { display: flex; align-items: center; gap: 24px; padding: 16px 40px; max-width: 1200px; margin: 0 auto; }
        .wm { display: flex; align-items: center; font-weight: 700; font-size: 24px; letter-spacing: -0.03em; color: var(--carbon); text-decoration: none; }
        .wm-accent { color: var(--fucsia); }
        .wm-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--fucsia); display: inline-block; margin-left: 2px; margin-bottom: 1px; flex-shrink: 0; }
        .hdr-right { margin-left: auto; }
        .btn { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; border-radius: 999px; font-family: var(--font); font-weight: 600; transition: all var(--dur) var(--ease); text-decoration: none; border: none; white-space: nowrap; }
        .btn-primary { background: var(--fucsia); color: #fff; font-size: 16px; padding: 15px 32px; }
        .btn-primary:hover { background: var(--fucsia-hover); box-shadow: var(--shadow-fucsia); transform: translateY(-2px); }
        .btn-outline { background: transparent; color: var(--fucsia); font-size: 15px; padding: 13px 28px; border: 2px solid var(--fucsia); }
        .btn-outline:hover { background: var(--fucsia); color: #fff; }
        .btn-lg { font-size: 17px; padding: 17px 38px; }
        .btn-sm { font-size: 13px; padding: 9px 18px; }
        .eye { font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fucsia); }
        .imgph { background: var(--beige); border-radius: 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: var(--carbon-45); text-align: center; padding: 24px; }
        .imgph-label { font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; max-width: 22ch; }
        .sec-hdr { text-align: center; margin-bottom: 56px; }
        .sec-hdr h2 { font-size: 38px; font-weight: 700; letter-spacing: -0.025em; color: var(--carbon); margin: 12px 0 12px; line-height: 1.15; }
        .sec-hdr p { font-size: 17px; color: var(--carbon-70); max-width: 58ch; margin: 0 auto; line-height: 1.65; }

        .hero { padding: 64px 0 88px; }
        .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 64px; align-items: center; }
        .hero-eye { margin-bottom: 18px; }
        .hero-h1 { font-size: 54px; font-weight: 700; line-height: 1.08; letter-spacing: -0.03em; color: var(--carbon); margin: 0 0 22px; }
        .hero-h1 em { font-style: normal; color: var(--fucsia); }
        .hero-sub { font-size: 18px; line-height: 1.65; color: var(--carbon-70); margin: 0 0 32px; max-width: 46ch; }
        .hero-ctas { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; }
        .hero-price { display: flex; align-items: baseline; gap: 10px; margin-bottom: 4px; }
        .hero-price .now { font-size: 26px; font-weight: 700; color: var(--fucsia); }
        .hero-price .was { font-size: 16px; color: var(--carbon-45); text-decoration: line-through; }
        .ghost-link { font-size: 15px; font-weight: 600; color: var(--carbon-70); text-decoration: none; display: inline-flex; align-items: center; gap: 7px; transition: color var(--dur); }
        .ghost-link:hover { color: var(--fucsia); }
        .hero-img { aspect-ratio: 4 / 5; min-height: 380px; }
        .hero-trust { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 8px; }
        .hero-trust span { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--carbon-70); line-height: 0; }

        .problema { background: var(--beige); border-top: 1px solid var(--beige-deep); border-bottom: 1px solid var(--beige-deep); padding: 84px 0; }
        .pain-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .pain-card { background: #fff; border-radius: 20px; padding: 30px 26px; box-shadow: var(--shadow-sm); }
        .pain-icon { width: 48px; height: 48px; border-radius: 50%; background: var(--fucsia-soft); display: flex; align-items: center; justify-content: center; margin-bottom: 18px; line-height: 0; }
        .pain-card h3 { font-size: 17px; font-weight: 700; color: var(--carbon); margin: 0 0 8px; }
        .pain-card p { font-size: 14px; line-height: 1.6; color: var(--carbon-70); margin: 0; }

        .steps { padding: 88px 0; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 48px; }
        .step-card { background: #fff; border: 1px solid var(--line); border-radius: 22px; padding: 34px 28px 32px; box-shadow: var(--shadow-md); transition: box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease); }
        .step-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); }
        .step-num { font-size: 58px; font-weight: 700; color: var(--fucsia-soft); line-height: 1; letter-spacing: -0.04em; margin-bottom: 14px; }
        .step-icon { width: 52px; height: 52px; border-radius: 50%; background: var(--fucsia-soft); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; line-height: 0; }
        .step-card h3 { font-size: 19px; font-weight: 700; color: var(--carbon); margin: 0 0 10px; }
        .step-card p { font-size: 14px; line-height: 1.6; color: var(--carbon-70); margin: 0; }
        .steps-img { aspect-ratio: 21 / 9; min-height: 220px; }

        .beneficios { background: var(--beige); border-top: 1px solid var(--beige-deep); border-bottom: 1px solid var(--beige-deep); padding: 88px 0; }
        .benefit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 32px; max-width: 900px; margin: 0 auto; }
        .benefit-item { display: flex; align-items: flex-start; gap: 14px; background: #fff; border-radius: 16px; padding: 18px 20px; box-shadow: var(--shadow-sm); }
        .benefit-check { width: 26px; height: 26px; min-width: 26px; border-radius: 50%; background: var(--fucsia); display: flex; align-items: center; justify-content: center; line-height: 0; }
        .benefit-item p { margin: 0; font-size: 15px; font-weight: 600; color: var(--carbon); line-height: 1.4; }

        .testies { padding: 88px 0; }
        .social-proof-banner { display: flex; justify-content: center; align-items: center; gap: 28px; flex-wrap: wrap; margin-bottom: 48px; }
        .social-proof-banner .sp-item { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: var(--carbon); }
        .stars { color: var(--fucsia); font-size: 16px; letter-spacing: 1px; line-height: 1; }
        .testy-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .testy-card { background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 28px; box-shadow: var(--shadow-md); display: flex; flex-direction: column; }
        .testy-hdr { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .testy-avatar { width: 46px; height: 46px; min-width: 46px; border-radius: 50%; background: var(--beige); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 17px; color: var(--carbon); }
        .testy-name { font-weight: 700; font-size: 15px; color: var(--carbon); }
        .testy-city { font-size: 12px; color: var(--carbon-45); }
        .testy-stars { color: var(--fucsia); font-size: 14px; margin-bottom: 12px; }
        .testy-text { font-size: 15px; line-height: 1.65; color: var(--carbon-70); flex: 1; }

        .oferta { background: var(--beige); border-top: 1px solid var(--beige-deep); border-bottom: 1px solid var(--beige-deep); padding: 88px 0; }
        .oferta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .oferta-img { aspect-ratio: 4 / 5; min-height: 340px; }
        .badge-hot { display: inline-flex; align-items: center; gap: 7px; background: var(--fucsia); color: #fff; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 999px; margin-bottom: 14px; }
        .oferta-title { font-size: 36px; font-weight: 700; letter-spacing: -0.025em; color: var(--carbon); margin: 0 0 10px; line-height: 1.1; }
        .oferta-sub { font-size: 16px; color: var(--carbon-70); margin: 0 0 20px; }
        .price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 22px; flex-wrap: wrap; }
        .price-now { font-size: 42px; font-weight: 700; color: var(--fucsia); }
        .price-was { font-size: 21px; color: var(--carbon-45); text-decoration: line-through; }
        .price-save { background: var(--fucsia-soft); color: var(--fucsia); font-size: 13px; font-weight: 700; padding: 4px 10px; border-radius: 999px; }
        .oferta-includes { list-style: none; margin: 0 0 24px; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .oferta-includes li { display: flex; align-items: center; gap: 10px; font-size: 15px; color: var(--carbon); line-height: 0; }
        .oferta-includes li span { line-height: 1.4; }
        .oferta-ctas { display: flex; flex-direction: column; gap: 12px; }
        .oferta-ctas .btn { justify-content: center; }
        .oferta-guarantee { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--carbon-70); margin-top: 16px; line-height: 0; }
        .oferta-guarantee span { line-height: 1.4; }

        .pedido { padding: 88px 0; }
        .pedido-card { max-width: 560px; margin: 0 auto; background: #fff; border: 1px solid var(--line); border-radius: 24px; padding: 40px 36px; box-shadow: var(--shadow-lg); }
        .pedido-form { display: flex; flex-direction: column; gap: 16px; }
        .pedido-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .field label { display: block; font-size: 13px; font-weight: 600; color: var(--carbon); margin-bottom: 6px; }
        .field label .req { color: var(--fucsia); }
        .field input, .field select { width: 100%; font-family: var(--font); font-size: 15px; color: var(--carbon); background: #fff; border: 1.5px solid var(--line); border-radius: 12px; padding: 13px 16px; outline: none; transition: border-color var(--dur); }
        .field input:focus, .field select:focus { border-color: var(--fucsia); }
        .pedido-form .btn { justify-content: center; width: 100%; }
        .pedido-note { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; color: var(--carbon-70); line-height: 0; }
        .pedido-note span { line-height: 1.4; }
        .pedido-error { background: #FDECEC; color: #C0392B; font-size: 14px; font-weight: 600; border-radius: 12px; padding: 12px 16px; text-align: center; }
        .pedido-ok { text-align: center; padding: 24px 0; }
        .pedido-ok-icon { width: 64px; height: 64px; border-radius: 50%; background: var(--fucsia-soft); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; line-height: 0; }
        .pedido-ok h3 { font-size: 24px; font-weight: 700; color: var(--carbon); margin: 0 0 10px; }
        .pedido-ok p { font-size: 15px; line-height: 1.65; color: var(--carbon-70); margin: 0; }

        .faq { padding: 88px 0 110px; }
        .faq-list { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
        .faq-item { border: 1px solid var(--line); border-radius: 16px; overflow: hidden; background: #fff; }
        .faq-q { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; background: none; border: none; cursor: pointer; padding: 20px 24px; text-align: left; font-family: var(--font); font-size: 16px; font-weight: 600; color: var(--carbon); }
        .faq-q .chev { color: var(--fucsia); flex-shrink: 0; transition: transform var(--dur) var(--ease); line-height: 0; }
        .faq-item.open .faq-q .chev { transform: rotate(180deg); }
        .faq-a { max-height: 0; overflow: hidden; transition: max-height var(--dur) var(--ease); }
        .faq-item.open .faq-a { max-height: 240px; }
        .faq-a p { margin: 0; padding: 0 24px 22px; font-size: 15px; line-height: 1.65; color: var(--carbon-70); }

        .cta-ban { background: var(--carbon); color: #fff; padding: 88px 0; text-align: center; }
        .cta-ban-inner { max-width: 620px; margin: 0 auto; }
        .cta-ban-inner .eye { color: var(--fucsia-hover); }
        .cta-ban-inner h2 { font-size: 42px; font-weight: 700; letter-spacing: -0.025em; margin: 12px 0 16px; line-height: 1.1; color: #fff; }
        .cta-ban-inner h2 em { font-style: normal; color: var(--fucsia-hover); }
        .cta-ban-inner p { font-size: 17px; color: rgba(255,255,255,0.7); margin: 0 0 32px; line-height: 1.65; }
        .urgency { display: inline-flex; align-items: center; gap: 8px; background: rgba(230,0,126,0.18); color: #FF6FB9; font-size: 13px; font-weight: 700; padding: 7px 16px; border-radius: 999px; margin-bottom: 20px; line-height: 0; }
        .urgency span { line-height: 1.4; }

        .footer { background: var(--carbon); color: #fff; padding-bottom: 90px; }
        .footer-main { display: grid; grid-template-columns: 1.6fr repeat(3, 1fr); gap: 36px; max-width: 1200px; margin: 0 auto; padding: 56px 40px 40px; }
        .footer-brand p { font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.5); margin: 14px 0 0; max-width: 28ch; }
        .foot-logo { display: flex; align-items: center; font-weight: 700; font-size: 22px; letter-spacing: -0.03em; }
        .foot-logo-accent { color: var(--fucsia); margin-left: 4px; }
        .foot-logo-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--fucsia); display: inline-block; margin-left: 2px; margin-bottom: 1px; }
        .footer-col-hd { font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 16px; color: rgba(255,255,255,0.7); }
        .footer-col a { display: block; font-size: 14px; color: rgba(255,255,255,0.5); text-decoration: none; padding: 4px 0; transition: color var(--dur); }
        .footer-col a:hover { color: #fff; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); max-width: 1200px; margin: 0 auto; padding: 20px 40px; }
        .footer-bottom p { font-size: 13px; color: rgba(255,255,255,0.38); margin: 0; }

        .sticky-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 90; background: #fff; border-top: 1px solid var(--line); box-shadow: 0 -8px 24px rgba(43,43,43,0.10); }
        .sticky-bar-inner { max-width: 1200px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .sticky-price .now { font-size: 22px; font-weight: 700; color: var(--fucsia); }
        .sticky-price .was { font-size: 14px; color: var(--carbon-45); text-decoration: line-through; margin-left: 8px; }
        .sticky-actions { display: flex; gap: 10px; }
        .sticky-wsp { display: inline-flex; align-items: center; gap: 8px; background: #25D366; color: #fff; border-radius: 999px; padding: 13px 20px; font-family: var(--font); font-weight: 600; font-size: 14px; text-decoration: none; border: none; cursor: pointer; }

        @media (max-width: 900px) {
          .wrap { padding: 0 20px; }
          .hdr-inner { padding: 14px 20px; }
          .hero-grid, .oferta-grid { grid-template-columns: 1fr; gap: 32px; }
          .hero-img { order: -1; min-height: 280px; }
          .hero-h1 { font-size: 38px; }
          .sec-hdr h2 { font-size: 28px; }
          .pain-grid, .steps-grid { grid-template-columns: 1fr; }
          .benefit-grid { grid-template-columns: 1fr; }
          .testy-grid { grid-template-columns: 1fr; }
          .footer-main { grid-template-columns: 1fr 1fr; }
          .cta-ban-inner h2 { font-size: 30px; }
          .sticky-price .was { display: none; }
          .sticky-bar-inner { padding: 12px 16px; }
          .pedido-card { padding: 28px 20px; }
          .pedido-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ann">
        Pagás cuando lo recibís
        <span className="sep">·</span>
        Envío a todo el país
        <span className="sep">·</span>
        Garantía 30 días
      </div>

      <header className="hdr">
        <div className="hdr-inner">
          <a href="/" className="wm">Yani<span className="wm-accent"> Trend</span><span className="wm-dot"></span></a>
          <div className="hdr-right">
            <a href={CHECKOUT_URL} className="btn btn-primary btn-sm">Quiero el mío →</a>
          </div>
        </div>
      </header>

      {/* 1. HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <div className="eye hero-eye">Hidrolavadora inalámbrica a batería</div>
              <h1 className="hero-h1">Limpiá el auto, la moto y el patio <em>sin manguera y sin esperar</em></h1>
              <p className="hero-sub">Batería recargable + presión de agua ajustable. La cargás, la conectás a cualquier canilla o balde, y en segundos tenés la potencia de una hidrolavadora en la mano.</p>
              <div className="hero-ctas">
                <div className="hero-price">
                  <span className="now">{formatPrice(PRODUCT.price)}</span>
                  <span className="was">{formatPrice(PRODUCT.originalPrice)}</span>
                </div>
                <a href={CHECKOUT_URL} className="btn btn-primary btn-lg">
                  <i data-lucide="package" style={{ width: 19, height: 19 }}></i>
                  Quiero el mío →
                </a>
                <a href="#como-funciona" className="ghost-link">
                  ¿Cómo funciona?
                  <i data-lucide="arrow-right" style={{ width: 16, height: 16 }}></i>
                </a>
                <div className="hero-trust">
                  <span><i data-lucide="wallet" style={{ width: 15, height: 15, color: 'var(--fucsia)' }}></i> Pagás al recibir</span>
                  <span><i data-lucide="truck" style={{ width: 15, height: 15, color: 'var(--fucsia)' }}></i> Envío a todo el país</span>
                  <span><i data-lucide="shield-check" style={{ width: 15, height: 15, color: 'var(--fucsia)' }}></i> Garantía 30 días</span>
                </div>
              </div>
            </div>
            <div className="imgph hero-img">
              <i data-lucide="image" style={{ width: 32, height: 32 }}></i>
              <span className="imgph-label">TODO(imagen): foto real del producto — public/hidrolavadora/hero.jpg</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEMA */}
      <section className="problema">
        <div className="wrap">
          <div className="sec-hdr">
            <div className="eye">¿Te pasa esto?</div>
            <h2>¿Se te complica lavar el auto, la moto o el patio por falta de presión de agua?</h2>
            <p>Entre la manguera enredada, la canilla que tira poca presión y el tiempo que no te sobra, terminás dejando la limpieza para "otro día" — que nunca llega.</p>
          </div>
          <div className="pain-grid">
            {PAIN_POINTS.map((p) => (
              <div key={p.title} className="pain-card">
                <div className="pain-icon">
                  <i data-lucide={p.icon} style={{ width: 22, height: 22, color: 'var(--fucsia)' }}></i>
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SOLUCIÓN */}
      <section className="steps" id="como-funciona">
        <div className="wrap">
          <div className="sec-hdr">
            <div className="eye">La solución</div>
            <h2>Así de fácil es limpiar con potencia real, sin cables</h2>
            <p>Una hidrolavadora inalámbrica a batería: la cargás una vez y la usás donde quieras, sin depender de un enchufe cerca.</p>
          </div>
          <div className="steps-grid">
            {STEPS.map((s) => (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <div className="step-icon"><i data-lucide={s.icon} style={{ width: 24, height: 24, color: 'var(--fucsia)' }}></i></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="imgph steps-img">
            <i data-lucide="video" style={{ width: 28, height: 28 }}></i>
            <span className="imgph-label">TODO(imagen): foto o GIF de uso real — public/hidrolavadora/uso-1.jpg</span>
          </div>
        </div>
      </section>

      {/* 4. BENEFICIOS */}
      <section className="beneficios">
        <div className="wrap">
          <div className="sec-hdr">
            <div className="eye">Por qué te va a servir</div>
            <h2>Todo lo que ganás con la hidrolavadora inalámbrica</h2>
          </div>
          <div className="benefit-grid">
            {BENEFITS.map((b) => (
              <div key={b} className="benefit-item">
                <div className="benefit-check"><i data-lucide="check" style={{ width: 15, height: 15, color: '#fff' }}></i></div>
                <p>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRUEBA SOCIAL */}
      <section className="testies">
        <div className="wrap">
          <div className="sec-hdr">
            <div className="eye">Lo que dicen nuestros clientes</div>
            <h2>Ya la están usando en todo el país</h2>
          </div>
          <div className="social-proof-banner">
            <div className="sp-item"><i data-lucide="package-check" style={{ width: 18, height: 18, color: 'var(--fucsia)' }}></i> {SOCIAL_PROOF.sold}</div>
            <div className="sp-item"><span className="stars">★★★★★</span> {SOCIAL_PROOF.rating} · {SOCIAL_PROOF.reviews} reseñas</div>
          </div>
          <div className="testy-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testy-card">
                <div className="testy-hdr">
                  <div className="testy-avatar">{t.init}</div>
                  <div>
                    <div className="testy-name">{t.name}</div>
                    <div className="testy-city">{t.city}, Argentina</div>
                  </div>
                </div>
                <div className="testy-stars">★★★★★</div>
                <p className="testy-text">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OFERTA */}
      <section className="oferta">
        <div className="wrap">
          <div className="oferta-grid">
            <div className="imgph oferta-img">
              <i data-lucide="image" style={{ width: 30, height: 30 }}></i>
              <span className="imgph-label">TODO(imagen): galería de producto — public/hidrolavadora/galeria-1.jpg</span>
            </div>
            <div>
              <div className="badge-hot">
                <i data-lucide="flame" style={{ width: 14, height: 14 }}></i>
                Precio de lanzamiento
              </div>
              <h2 className="oferta-title">Hidrolavadora Inalámbrica a Batería</h2>
              <p className="oferta-sub">Presión ajustable · Batería recargable · Boquillas incluidas</p>
              <div className="price-row">
                <span className="price-now">{formatPrice(PRODUCT.price)}</span>
                <span className="price-was">{formatPrice(PRODUCT.originalPrice)}</span>
                <span className="price-save">Ahorrás {formatPrice(PRODUCT.originalPrice - PRODUCT.price)} ({discount}%)</span>
              </div>
              <ul className="oferta-includes">
                {[
                  '1 Hidrolavadora inalámbrica',
                  '1 Batería recargable + cargador',
                  '2 Boquillas intercambiables (TODO: confirmar combo real)',
                  'Envío a todo el país (costo de envío a cargo del comprador)',
                ].map((item) => (
                  <li key={item}>
                    <i data-lucide="check-circle" style={{ width: 16, height: 16, color: 'var(--fucsia)' }}></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="oferta-ctas">
                <a href={CHECKOUT_URL} className="btn btn-primary btn-lg">
                  <i data-lucide="package" style={{ width: 19, height: 19 }}></i>
                  Quiero el mío · Pago al recibir
                </a>
                <a href={whatsappLink(`Hola! Me interesa la ${PRODUCT.name} a ${formatPrice(PRODUCT.price)}. ¿Tienen stock disponible?`)} className="btn btn-outline">
                  Consultar por WhatsApp
                </a>
              </div>
              <div className="oferta-guarantee">
                <i data-lucide="shield-check" style={{ width: 15, height: 15, color: 'var(--fucsia)' }}></i>
                <span>Garantía 30 días · Revisás el paquete antes de pagar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO DE PEDIDO */}
      <section className="pedido" id="pedido">
        <div className="wrap">
          <div className="sec-hdr">
            <div className="eye">Pedila ahora</div>
            <h2>Completá tus datos y pagá al recibir</h2>
            <p>Sin tarjetas ni adelantos. Te contactamos por WhatsApp para confirmar la entrega.</p>
          </div>
          <div className="pedido-card">
            {formState === 'sent' ? (
              <div className="pedido-ok">
                <div className="pedido-ok-icon">
                  <i data-lucide="check-circle" style={{ width: 30, height: 30, color: 'var(--fucsia)' }}></i>
                </div>
                <h3>¡Pedido recibido!</h3>
                <p>Gracias {form.nombre.trim()}. En breve te escribimos por WhatsApp para confirmar tu dirección y coordinar la entrega. Recordá: pagás cuando recibís el paquete.</p>
              </div>
            ) : (
              <form className="pedido-form" onSubmit={submitPedido}>
                <div className="field">
                  <label>Nombre y apellido <span className="req">*</span></label>
                  <input type="text" required value={form.nombre} onChange={(e) => setField('nombre', e.target.value)} placeholder="Ej: María González" />
                </div>
                <div className="field">
                  <label>Teléfono / WhatsApp <span className="req">*</span></label>
                  <input type="tel" required value={form.telefono} onChange={(e) => setField('telefono', e.target.value)} placeholder="Ej: 11 1234 5678" />
                </div>
                <div className="field">
                  <label>Dirección de entrega</label>
                  <input type="text" value={form.direccion} onChange={(e) => setField('direccion', e.target.value)} placeholder="Calle y número" />
                </div>
                <div className="pedido-row">
                  <div className="field">
                    <label>Ciudad / Provincia</label>
                    <input type="text" value={form.ciudad} onChange={(e) => setField('ciudad', e.target.value)} placeholder="Ej: Rosario, Santa Fe" />
                  </div>
                  <div className="field">
                    <label>Código postal</label>
                    <input type="text" value={form.cp} onChange={(e) => setField('cp', e.target.value)} placeholder="Ej: 2000" />
                  </div>
                </div>
                <div className="field">
                  <label>Cantidad</label>
                  <select value={form.cantidad} onChange={(e) => setField('cantidad', e.target.value)}>
                    <option value="1">1 unidad — {formatPrice(PRODUCT.price)}</option>
                    <option value="2">2 unidades — {formatPrice(PRODUCT.price * 2)}</option>
                    <option value="3">3 unidades — {formatPrice(PRODUCT.price * 3)}</option>
                  </select>
                </div>
                {formState === 'error' && (
                  <div className="pedido-error">No pudimos registrar tu pedido. Probá de nuevo o escribinos por WhatsApp.</div>
                )}
                <button type="submit" className="btn btn-primary btn-lg" disabled={formState === 'sending'}>
                  {formState === 'sending' ? 'Enviando...' : 'Confirmar pedido · Pago al recibir'}
                </button>
                <div className="pedido-note">
                  <i data-lucide="lock" style={{ width: 14, height: 14, color: 'var(--fucsia)' }}></i>
                  <span>No te pedimos tarjeta ni ningún dato bancario</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 7. OBJECIONES / FAQ */}
      <section className="faq">
        <div className="wrap">
          <div className="sec-hdr">
            <div className="eye">Antes de pedirlo</div>
            <h2>Preguntas frecuentes</h2>
          </div>
          <div className="faq-list">
            {FAQ.map((item, i) => (
              <div key={item.q} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {item.q}
                  <span className="chev"><i data-lucide="chevron-down" style={{ width: 18, height: 18 }}></i></span>
                </button>
                <div className="faq-a"><p>{item.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA FINAL */}
      <section className="cta-ban">
        <div className="wrap">
          <div className="cta-ban-inner">
            <div className="urgency">
              <i data-lucide="flame" style={{ width: 14, height: 14 }}></i>
              <span>Últimas unidades disponibles (TODO: reflejar stock real)</span>
            </div>
            <div className="eye">¿Lista para pedirla?</div>
            <h2>Llevate la <em>tuya</em> antes de que se agote</h2>
            <p>Pagás cuando la recibís en la puerta de tu casa. Sin tarjetas, sin adelantos, sin riesgo.</p>
            <a href={CHECKOUT_URL} className="btn btn-primary btn-lg">
              <i data-lucide="package" style={{ width: 19, height: 19 }}></i>
              Quiero la mía ahora
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="foot-logo">Yani<span className="foot-logo-accent"> Trend</span><span className="foot-logo-dot"></span></div>
            <p>Hogar, tecnología y bienestar con entrega en casa. Pagás cuando lo recibís en la puerta.</p>
          </div>
          <div className="footer-col">
            <div className="footer-col-hd">Tienda</div>
            <a href="/">Inicio</a>
            <a href="https://yanitrend.com/collections/all">Productos</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-hd">Ayuda</div>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="https://yanitrend.com/pages/preguntas-frecuentes">Preguntas frecuentes</a>
            <a href={whatsappLink('Hola! Tengo una consulta sobre la Hidrolavadora Inalámbrica.')}>Contacto por WhatsApp</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-hd">Legal</div>
            <a href="https://yanitrend.com/pages/politica-de-privacidad">Política de privacidad</a>
            <a href="https://yanitrend.com/pages/terminos-y-condiciones">Términos y condiciones</a>
            <a href="https://yanitrend.com/pages/politica-de-devoluciones">Política de devoluciones</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Yani Trend · Todos los derechos reservados</p>
        </div>
      </footer>

      {/* 9. BARRA STICKY */}
      <div className="sticky-bar">
        <div className="sticky-bar-inner">
          <div className="sticky-price">
            <span className="now">{formatPrice(PRODUCT.price)}</span>
            <span className="was">{formatPrice(PRODUCT.originalPrice)}</span>
          </div>
          <div className="sticky-actions">
            <a href={whatsappLink(`Hola! Me interesa la ${PRODUCT.name} a ${formatPrice(PRODUCT.price)}. ¿Tienen stock disponible?`)} className="sticky-wsp">
              <i data-lucide="message-circle" style={{ width: 16, height: 16 }}></i>
              WhatsApp
            </a>
            <a href={CHECKOUT_URL} className="btn btn-primary">
              <i data-lucide="package" style={{ width: 17, height: 17 }}></i>
              Comprar ahora
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
