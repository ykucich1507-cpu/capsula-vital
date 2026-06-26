'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js'
    script.onload = () => {
      // @ts-ignore
      if (window.lucide) window.lucide.createIcons()
      document.querySelectorAll('.spot-thumb').forEach((thumb) => {
        thumb.addEventListener('click', () => {
          document.querySelectorAll('.spot-thumb').forEach((t) => t.classList.remove('active'))
          thumb.classList.add('active')
        })
      })
    }
    document.head.appendChild(script)
  }, [])

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
        .hdr { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.90); backdrop-filter: blur(16px); border-bottom: 1px solid var(--line); }
        .hdr-inner { display: flex; align-items: center; gap: 32px; padding: 16px 40px; max-width: 1200px; margin: 0 auto; }
        .wm { display: flex; align-items: center; font-weight: 700; font-size: 24px; letter-spacing: -0.03em; color: var(--carbon); text-decoration: none; }
        .wm-accent { color: var(--fucsia); }
        .wm-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--fucsia); display: inline-block; margin-left: 2px; margin-bottom: 1px; flex-shrink: 0; }
        .nav { display: flex; gap: 26px; }
        .nav a { text-decoration: none; font-size: 15px; font-weight: 500; color: var(--carbon); transition: color var(--dur); }
        .nav a:hover, .nav a.active { color: var(--fucsia); font-weight: 600; }
        .hdr-right { margin-left: auto; display: flex; align-items: center; gap: 14px; }
        .ico-btn { background: none; border: none; cursor: pointer; display: inline-flex; color: var(--carbon); padding: 4px; transition: color var(--dur); line-height: 0; }
        .ico-btn:hover { color: var(--fucsia); }
        .btn { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; border-radius: 999px; font-family: var(--font); font-weight: 600; transition: all var(--dur) var(--ease); text-decoration: none; border: none; white-space: nowrap; }
        .btn-primary { background: var(--fucsia); color: #fff; font-size: 16px; padding: 15px 32px; }
        .btn-primary:hover { background: var(--fucsia-hover); box-shadow: var(--shadow-fucsia); transform: translateY(-2px); }
        .btn-outline { background: transparent; color: var(--fucsia); font-size: 15px; padding: 13px 28px; border: 2px solid var(--fucsia); }
        .btn-outline:hover { background: var(--fucsia); color: #fff; }
        .btn-lg { font-size: 17px; padding: 17px 38px; }
        .btn-sm { font-size: 13px; padding: 9px 18px; }
        .eye { font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fucsia); }
        .imgph { background: var(--beige); border-radius: 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: var(--carbon-45); }
        .imgph-label { font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
        .sec-hdr { text-align: center; margin-bottom: 60px; }
        .sec-hdr h2 { font-size: 42px; font-weight: 700; letter-spacing: -0.025em; color: var(--carbon); margin: 12px 0 12px; line-height: 1.1; }
        .sec-hdr p { font-size: 17px; color: var(--carbon-70); max-width: 54ch; margin: 0 auto; line-height: 1.65; }
        .hero { padding: 84px 0 100px; }
        .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 64px; align-items: center; }
        .hero-eye { margin-bottom: 18px; }
        .hero-h1 { font-size: 60px; font-weight: 700; line-height: 1.03; letter-spacing: -0.03em; color: var(--carbon); margin: 0 0 24px; }
        .hero-h1 em { font-style: normal; color: var(--fucsia); }
        .hero-sub { font-size: 18px; line-height: 1.65; color: var(--carbon-70); margin: 0 0 38px; max-width: 44ch; }
        .hero-ctas { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
        .ghost-link { font-size: 15px; font-weight: 600; color: var(--carbon-70); text-decoration: none; display: inline-flex; align-items: center; gap: 7px; transition: color var(--dur); }
        .ghost-link:hover { color: var(--fucsia); }
        .hero-img { aspect-ratio: 4 / 5; min-height: 460px; }
        .trust { background: var(--beige); border-top: 1px solid var(--beige-deep); border-bottom: 1px solid var(--beige-deep); padding: 34px 0; }
        .trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .trust-item { display: flex; align-items: center; gap: 14px; }
        .trust-icon { width: 48px; height: 48px; min-width: 48px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); line-height: 0; }
        .trust-strong { display: block; font-size: 14px; font-weight: 700; color: var(--carbon); margin-bottom: 2px; }
        .trust-desc { font-size: 13px; color: var(--carbon-70); line-height: 1.4; }
        .steps { padding: 96px 0; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
        .step-card { background: #fff; border: 1px solid var(--line); border-radius: 22px; padding: 36px 30px 34px; box-shadow: var(--shadow-md); transition: box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease); }
        .step-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); }
        .step-num { font-size: 64px; font-weight: 700; color: var(--fucsia-soft); line-height: 1; letter-spacing: -0.04em; margin-bottom: 16px; }
        .step-icon { width: 56px; height: 56px; border-radius: 50%; background: var(--fucsia-soft); display: flex; align-items: center; justify-content: center; margin-bottom: 22px; line-height: 0; }
        .step-card h3 { font-size: 20px; font-weight: 700; color: var(--carbon); margin: 0 0 10px; }
        .step-card p { font-size: 15px; line-height: 1.65; color: var(--carbon-70); margin: 0; }
        .spotlight { background: var(--beige); border-top: 1px solid var(--beige-deep); border-bottom: 1px solid var(--beige-deep); padding: 96px 0; }
        .spot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
        .spot-imgs { display: flex; gap: 12px; }
        .spot-main { flex: 1; aspect-ratio: 3 / 4; min-height: 360px; }
        .spot-thumbs { display: flex; flex-direction: column; gap: 10px; }
        .spot-thumb { width: 80px; height: 106px; border-radius: 12px; background: #fff; border: 2px solid transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: border-color var(--dur); line-height: 0; }
        .spot-thumb.active, .spot-thumb:hover { border-color: var(--fucsia); }
        .badge-hot { display: inline-flex; align-items: center; gap: 7px; background: var(--fucsia); color: #fff; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 999px; margin-bottom: 14px; }
        .spot-title { font-size: 40px; font-weight: 700; letter-spacing: -0.025em; color: var(--carbon); margin: 0 0 8px; line-height: 1.08; }
        .spot-sub { font-size: 16px; color: var(--carbon-70); margin: 0 0 18px; }
        .spot-rating { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
        .rating-txt { font-size: 14px; color: var(--carbon-70); }
        .stars { color: var(--fucsia); font-size: 16px; letter-spacing: 1px; line-height: 1; }
        .price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; }
        .price-now { font-size: 44px; font-weight: 700; color: var(--fucsia); }
        .price-was { font-size: 22px; color: var(--carbon-45); text-decoration: line-through; }
        .price-save { background: var(--fucsia-soft); color: var(--fucsia); font-size: 13px; font-weight: 700; padding: 4px 10px; border-radius: 999px; }
        .spot-ctas { display: flex; flex-direction: column; gap: 12px; }
        .spot-ctas .btn { justify-content: center; }
        .spot-guarantee { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--carbon-70); margin-top: 16px; line-height: 0; }
        .spot-guarantee span { line-height: 1.4; }
        .testies { padding: 96px 0; }
        .testy-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .testy-card { background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 28px; box-shadow: var(--shadow-md); display: flex; flex-direction: column; }
        .testy-hdr { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .testy-avatar { width: 46px; height: 46px; min-width: 46px; border-radius: 50%; background: var(--beige); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 17px; color: var(--carbon); }
        .testy-name { font-weight: 700; font-size: 15px; color: var(--carbon); }
        .testy-city { font-size: 12px; color: var(--carbon-45); }
        .testy-stars { color: var(--fucsia); font-size: 14px; margin-bottom: 12px; }
        .testy-text { font-size: 15px; line-height: 1.65; color: var(--carbon-70); flex: 1; }
        .testy-tag { display: inline-flex; align-items: center; gap: 6px; margin-top: 16px; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 999px; line-height: 0; align-self: flex-start; }
        .testy-tag span { line-height: 1; }
        .tag-cod { background: var(--fucsia-soft); color: var(--fucsia); }
        .tag-std { background: var(--beige); color: var(--carbon-70); }
        .cta-ban { background: var(--beige); border-top: 1px solid var(--beige-deep); padding: 96px 0; }
        .cta-ban-inner { text-align: center; max-width: 620px; margin: 0 auto; }
        .cta-ban-inner h2 { font-size: 46px; font-weight: 700; letter-spacing: -0.025em; color: var(--carbon); margin: 12px 0 18px; line-height: 1.1; }
        .cta-ban-inner h2 em { font-style: normal; color: var(--fucsia); }
        .cta-ban-inner p { font-size: 18px; color: var(--carbon-70); margin: 0 0 36px; line-height: 1.65; }
        .footer { background: var(--carbon); color: #fff; }
        .footer-main { display: grid; grid-template-columns: 1.6fr repeat(3, 1fr); gap: 36px; max-width: 1200px; margin: 0 auto; padding: 64px 40px 48px; }
        .footer-brand p { font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.5); margin: 14px 0 0; max-width: 28ch; }
        .foot-logo { display: flex; align-items: center; font-weight: 700; font-size: 22px; letter-spacing: -0.03em; }
        .foot-logo-accent { color: var(--fucsia); margin-left: 4px; }
        .foot-logo-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--fucsia); display: inline-block; margin-left: 2px; margin-bottom: 1px; }
        .footer-col-hd { font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 16px; color: rgba(255,255,255,0.7); }
        .footer-col a { display: block; font-size: 14px; color: rgba(255,255,255,0.5); text-decoration: none; padding: 4px 0; transition: color var(--dur); }
        .footer-col a:hover { color: #fff; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); max-width: 1200px; margin: 0 auto; padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; }
        .footer-bottom p { font-size: 13px; color: rgba(255,255,255,0.38); margin: 0; }
        .social-links { display: flex; gap: 10px; }
        .social-ico { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.09); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.55); text-decoration: none; transition: all var(--dur); line-height: 0; }
        .social-ico:hover { background: var(--fucsia); color: #fff; }
      `}</style>

      <div className="ann">
        Envío gratis a todo el país
        <span className="sep">·</span>
        Pagá con Mercado Pago de forma segura
        <span className="sep">·</span>
        Compra protegida garantizada
      </div>

      <header className="hdr">
        <div className="hdr-inner">
          <a href="/" className="wm">Yani<span className="wm-accent"> Trend</span><span className="wm-dot"></span></a>
          <nav className="nav">
            <a href="/" className="active">Inicio</a>
            <a href="https://yanitrend.com/collections/all">Productos</a>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="https://yanitrend.com/pages/contact">Contacto</a>
          </nav>
          <div className="hdr-right">
            <button className="ico-btn" aria-label="Buscar"><i data-lucide="search" style={{width:20,height:20}}></i></button>
            <button className="ico-btn" aria-label="Carrito"><i data-lucide="shopping-bag" style={{width:20,height:20}}></i></button>
            <a href="https://yanitrend.com/collections/all" className="btn btn-primary btn-sm">Pedir ahora</a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <div className="eye hero-eye">Nueva colección · Envío gratis</div>
              <h1 className="hero-h1">Tu mejor versión,<br />entregada <em>en casa</em></h1>
              <p className="hero-sub">Elegís online, te lo enviamos gratis y pagás de forma segura con Mercado Pago. Compra protegida, envío rápido y garantía en cada pedido.</p>
              <div className="hero-ctas">
                <a href="https://yanitrend.com/collections/all" className="btn btn-primary btn-lg">
                  <i data-lucide="package" style={{width:19,height:19}}></i>
                  Pedir ahora
                </a>
                <a href="#como-funciona" className="ghost-link">
                  ¿Cómo funciona?
                  <i data-lucide="arrow-right" style={{width:16,height:16}}></i>
                </a>
              </div>
            </div>
            <div className="hero-img" style={{borderRadius:22,overflow:'hidden'}}>
              <img src="https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_17783404941774880653aspiradorarobot.jpg" alt="Aspiradora Robot Jessica" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:22}} />
            </div>
          </div>
        </div>
      </section>

      <div className="trust">
        <div className="wrap">
          <div className="trust-grid">
            {[
              { icon: 'credit-card', title: 'Mercado Pago', desc: 'Pagá en cuotas con tarjeta o débito' },
              { icon: 'truck', title: 'Envío express gratis', desc: 'A todo el país, sin cargo' },
              { icon: 'lock', title: 'Compra protegida', desc: 'Tu dinero seguro con Mercado Pago' },
              { icon: 'shield-check', title: 'Garantía 30 días', desc: 'Si no te convence, te ayudamos' },
            ].map((item) => (
              <div key={item.title} className="trust-item">
                <div className="trust-icon">
                  <i data-lucide={item.icon} style={{width:22,height:22,color:'var(--fucsia)'}}></i>
                </div>
                <div>
                  <strong className="trust-strong">{item.title}</strong>
                  <span className="trust-desc">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="steps" id="como-funciona">
        <div className="wrap">
          <div className="sec-hdr">
            <div className="eye">Sin complicaciones</div>
            <h2>Así de fácil es comprar con nosotros</h2>
            <p>Tres pasos simples. Elegís, pagás de forma segura con Mercado Pago y recibís en tu puerta.</p>
          </div>
          <div className="steps-grid">
            {[
              { num: '01', icon: 'mouse-pointer-click', title: 'Hacés tu pedido online', desc: 'Elegís el producto y completás tu dirección. Solo dos minutos, sin complicaciones.' },
              { num: '02', icon: 'credit-card', title: 'Pagás con Mercado Pago', desc: 'Pagá con tarjeta de crédito, débito o dinero en cuenta. Rápido, seguro y con compra protegida.' },
              { num: '03', icon: 'package', title: 'Te lo enviamos gratis', desc: 'Tu pedido sale en 24 horas hábiles y llega a tu puerta en 3 a 5 días. Te avisamos por WhatsApp.' },
            ].map((s) => (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <div className="step-icon"><i data-lucide={s.icon} style={{width:26,height:26,color:'var(--fucsia)'}}></i></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="spotlight">
        <div className="wrap">
          <div className="spot-grid">
            <div className="spot-imgs">
              <div className="spot-main" style={{borderRadius:22,overflow:'hidden'}}>
                <img id="spot-main-img" src="https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_17783404941774880653aspiradorarobot.jpg" alt="Aspiradora Robot Jessica" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:22}} />
              </div>
              <div className="spot-thumbs">
                {[
                  'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_17783404941774880653aspiradorarobot.jpg',
                  'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_8_177834049417696244411761071309ASPIRADOROBOTJESSICA_2.jpg',
                  'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/v2_aspiradora.jpg',
                ].map((src, i) => (
                  <div key={i} className={`spot-thumb${i===0?' active':''}`} onClick={() => { const el = document.getElementById('spot-main-img') as HTMLImageElement; if(el) el.src = src; }}>
                    <img src={src} alt="" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:10}} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="badge-hot">
                <i data-lucide="flame" style={{width:14,height:14}}></i>
                Más vendido esta semana
              </div>
              <div className="eye" style={{marginBottom:10}}>Producto estrella</div>
              <h2 className="spot-title">Aspiradora Robot<br />Jessica</h2>
              <p className="spot-sub">Limpieza automática sin mover un dedo · Envío a todo el país</p>
              <div className="spot-rating">
                <span className="stars">★★★★★</span>
                <span className="rating-txt">4.9 · 328 reseñas verificadas</span>
              </div>
              <div className="price-row">
                <span className="price-now">$38.630</span>
                <span className="price-was">$52.000</span>
                <span className="price-save">Ahorrás $13.370</span>
              </div>
              <div className="spot-ctas">
                <a href="https://yanitrend.com/products/aspiradora-robot-jessica" className="btn btn-primary btn-lg">
                  <i data-lucide="package" style={{width:19,height:19}}></i>
                  Quiero la mía · Pagar con Mercado Pago
                </a>
                <a href="https://yanitrend.com/products/aspiradora-robot-jessica" className="btn btn-outline">Ver todos los detalles</a>
              </div>
              <div className="spot-guarantee">
                <i data-lucide="shield-check" style={{width:15,height:15,color:'var(--fucsia)'}}></i>
                <span>Pago seguro · Compra protegida · Garantía 30 días</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testies">
        <div className="wrap">
          <div className="sec-hdr">
            <div className="eye">Lo que dicen nuestras clientas</div>
            <h2>Más de 2.000 pedidos entregados</h2>
            <p>Compraron de forma segura con Mercado Pago y recibieron en su puerta.</p>
          </div>
          <div className="testy-grid">
            {[
              { init: 'V', name: 'Valentina R.', city: 'Buenos Aires', text: '"Pagué con Mercado Pago y fue súper fácil. El producto llegó perfecto y en tiempo. Muy buena experiencia comprando por internet."', tag: 'std', tagText: 'Compra verificada', tagIcon: 'check-circle' },
              { init: 'S', name: 'Sara M.', city: 'Córdoba', text: '"Lo pedí el lunes y llegó el jueves. Pagué en cuotas sin interés con mi tarjeta y todo fue muy rápido. Así sí da confianza comprar online."', tag: 'std', tagText: 'Compra verificada', tagIcon: 'check-circle' },
              { init: 'C', name: 'Carolina P.', city: 'Rosario', text: '"Ya van 3 pedidos y siempre fue igual de fácil. Mercado Pago me da seguridad y los productos siempre llegan en perfectas condiciones."', tag: 'std', tagText: 'Clienta recurrente', tagIcon: 'repeat' },
            ].map((t) => (
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
                <div className={`testy-tag tag-${t.tag}`}>
                  <i data-lucide={t.tagIcon} style={{width:13,height:13}}></i>
                  <span>{t.tagText}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-ban">
        <div className="wrap">
          <div className="cta-ban-inner">
            <div className="eye">¿Lista para pedirlo?</div>
            <h2>Comprá con total<br /><em>confianza</em></h2>
            <p>Pagá de forma segura con Mercado Pago, recibí tu pedido en casa y disfrutá de nuestra garantía de 30 días.</p>
            <a href="https://yanitrend.com/collections/all" className="btn btn-primary btn-lg">
              <i data-lucide="package" style={{width:19,height:19}}></i>
              Hacer mi pedido ahora
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="foot-logo">Yani<span className="foot-logo-accent"> Trend</span><span className="foot-logo-dot"></span></div>
            <p>Moda y accesorios con entrega a domicilio. Pagá de forma segura con Mercado Pago.</p>
          </div>
          <div className="footer-col">
            <div className="footer-col-hd">Tienda</div>
            <a href="/">Inicio</a>
            <a href="https://yanitrend.com/collections/all">Productos</a>
            <a href="https://yanitrend.com/collections/hogar">Hogar</a>
            <a href="https://yanitrend.com/collections/cocina">Cocina</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-hd">Ayuda</div>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="https://yanitrend.com/pages/preguntas-frecuentes">Preguntas frecuentes</a>
            <a href="https://yanitrend.com/pages/contact">Contacto por WhatsApp</a>
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
          <div className="social-links">
            <a href="#" className="social-ico" aria-label="Instagram"><i data-lucide="instagram" style={{width:16,height:16}}></i></a>
            <a href="#" className="social-ico" aria-label="Facebook"><i data-lucide="facebook" style={{width:16,height:16}}></i></a>
            <a href="#" className="social-ico" aria-label="TikTok"><i data-lucide="music-2" style={{width:16,height:16}}></i></a>
          </div>
        </div>
      </footer>
    </>
  )
}
