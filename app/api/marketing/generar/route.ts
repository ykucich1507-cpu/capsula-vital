import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { producto, precio, detalle } = await req.json()

  const prompt = `Sos un experto en marketing de e-commerce argentino. Generás kits de marketing para Yani Trend, una tienda de dropshipping argentina con pago contra entrega (COD). El tono es cercano, con voseo rioplatense, directo y persuasivo. Nunca mentís sobre el producto.

PRODUCTO: ${producto}
${precio ? `PRECIO: ARS $${precio}` : ''}
${detalle ? `DETALLES: ${detalle}` : ''}

CONTEXTO YANI TREND:
- Modelo: dropshipping, pago contra entrega (el cliente paga cuando recibe)
- País: Argentina
- Diferenciador clave: "Pagás cuando lo tenés en tus manos, sin tarjetas ni adelantos"
- Envío gratis a todo el país
- Garantía 30 días

Generá el siguiente kit en formato JSON válido (sin markdown, solo el JSON puro):

{
  "titular_principal": "titular impactante de máximo 8 palabras para el producto",
  "titular_secundario": "subtítulo complementario que refuerza el beneficio principal",
  "descripcion_corta": "descripción de 2 oraciones para usar en la ficha del producto",
  "copy_ad_meta": "anuncio largo para Meta Ads (Facebook/Instagram), 120-180 palabras, con gancho inicial, beneficios, prueba social implícita y llamada a la acción clara. Mencionar el pago contra entrega.",
  "copy_ad_meta_corto": "versión corta del anuncio para Meta Ads, 40-60 palabras, ideal para remarketing",
  "asunto_email": "asunto de email atractivo que invite a abrir, máximo 50 caracteres",
  "cuerpo_email": "cuerpo del email de entre 150-200 palabras, con saludo, presentación del producto, 3 beneficios clave, garantía COD y CTA final",
  "caption_instagram": "caption para Instagram de 100-130 palabras con emojis estratégicos, voz cercana y CTA al link de bio",
  "hashtags": "20 hashtags relevantes para Argentina separados por espacios, mezcla de populares y nicho",
  "whatsapp_mensaje": "mensaje de WhatsApp para seguimiento post-visita, 60-80 palabras, tono muy cercano y sin presión",
  "puntos_clave": ["beneficio 1", "beneficio 2", "beneficio 3", "beneficio 4", "beneficio 5"],
  "objeciones": [
    {"objecion": "¿Y si no me llega?", "respuesta": "respuesta convincente específica para esta objeción en el contexto COD argentino"},
    {"objecion": "¿Es seguro comprar sin tarjeta?", "respuesta": "respuesta convincente"},
    {"objecion": "¿Cuánto tarda en llegar?", "respuesta": "respuesta convincente"},
    {"objecion": "¿Qué pasa si no me gusta?", "respuesta": "respuesta convincente"}
  ]
}`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Respuesta inesperada')

  const text = content.text.trim()
  const jsonStart = text.indexOf('{')
  const jsonEnd = text.lastIndexOf('}') + 1
  const json = JSON.parse(text.slice(jsonStart, jsonEnd))

  return NextResponse.json(json)
}
