import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://yanitrend.com'

const PRODUCTOS: Record<string, { nombre: string; precio: number; imagen: string }> = {
  'vaso-termico': {
    nombre: 'Vaso Térmico con Sensor de Temperatura 400ml',
    precio: 29900,
    imagen: 'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_1758490472termocafe.jpg',
  },
  'termo-sensor': {
    nombre: 'Termo con Sensor de Temperatura 500ml',
    precio: 35900,
    imagen: 'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_1758490472termocafe.jpg',
  },
  'parlante-clip5': {
    nombre: 'Parlante Clip 5 Bluetooth',
    precio: 23900,
    imagen: 'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/imgi_6_1758490472termocafe.jpg',
  },
  'nebulizador-mesh': {
    nombre: 'Nebulizador Mesh Inalámbrico',
    precio: 49900,
    imagen: 'https://cdn.shopify.com/s/files/1/0794/4808/0616/files/nebulizador-mesh.jpg',
  },
}

export interface CheckoutBody {
  producto: string
  cantidad: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  dni: string
  direccion: string
  ciudad: string
  provincia: string
  cp: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutBody = await request.json()

    const producto = PRODUCTOS[body.producto]
    if (!producto) {
      return NextResponse.json({ error: 'Producto no válido' }, { status: 400 })
    }

    const cantidad = Math.max(1, Math.min(10, body.cantidad || 1))
    const total = producto.precio * cantidad

    const preference = new Preference(client)
    const result = await preference.create({
      body: {
        items: [
          {
            id: body.producto,
            title: producto.nombre,
            quantity: cantidad,
            unit_price: producto.precio,
            currency_id: 'ARS',
            picture_url: producto.imagen,
          },
        ],
        payer: {
          name: body.nombre,
          surname: body.apellido,
          email: body.email,
          phone: { number: body.telefono },
          identification: { type: 'DNI', number: body.dni },
          address: {
            street_name: body.direccion,
            zip_code: body.cp,
          },
        },
        back_urls: {
          success: `${BASE_URL}/checkout/success`,
          failure: `${BASE_URL}/checkout/error`,
          pending: `${BASE_URL}/checkout/success?pendiente=1`,
        },
        auto_return: 'approved',
        statement_descriptor: 'YANI TREND',
        external_reference: `YT-${Date.now()}`,
        metadata: {
          cliente: `${body.nombre} ${body.apellido}`,
          telefono: body.telefono,
          direccion: `${body.direccion}, ${body.ciudad}, ${body.provincia} (${body.cp})`,
          producto: producto.nombre,
          cantidad,
          total,
        },
      },
    })

    return NextResponse.json({
      ok: true,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      preference_id: result.id,
    })
  } catch (err) {
    console.error('MP error:', err)
    return NextResponse.json({ error: 'Error al crear preferencia de pago' }, { status: 500 })
  }
}
