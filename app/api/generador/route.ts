import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { producto, caracteristicas, precio, audiencia, objetivo, generar } = await req.json()

  const tiposSeleccionados = (generar as string[]).join(', ')

  const prompt = `Sos un experto en marketing digital para e-commerce argentino. Trabajás para Yani Trend, una tienda de hogar, tecnología y bienestar que vende con pago contra entrega en Argentina.

Producto: ${producto}
Características: ${caracteristicas}
Precio: $${precio} ARS
Audiencia objetivo: ${audiencia}
Objetivo de campaña: ${objetivo}

Generá el siguiente contenido de marketing (con voseo argentino, tono cercano y persuasivo):
${tiposSeleccionados}

Para cada tipo de contenido, usá un encabezado claro (ej: ## Página de Producto) y desarrollá el contenido completo y listo para usar. No pongas placeholders — escribí el contenido real.`

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claudeStream = client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }],
        })

        for await (const event of claudeStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido'
        controller.enqueue(encoder.encode(`\n\nError: ${msg}`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
