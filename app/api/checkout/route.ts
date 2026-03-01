import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

// 1. Inicializamos el cliente con tu Access Token
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN as string 
});

export async function POST(request: Request) {
  console.log("🔥🔥🔥 EJECUTANDO EL CÓDIGO CON ID DE RESERVA 🔥🔥🔥");

  try {
    const body = await request.json();

    // 🔥 NUEVOS LOGS DE DEBUGGING 🔥
    // Esto nos dirá exactamente qué está enviando el frontend y por qué falla el Number()
    console.log("🔍 Datos crudos recibidos del frontend:", body);
    console.log("💵 Valor de body.total recibido:", body.total);
    console.log("🤔 Tipo de dato de body.total:", typeof body.total);

    // 2. Definimos las URLs base
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nonpursuant-cattily-frida.ngrok-free.dev";
    const webhookUrl = process.env.MP_WEBHOOK_URL || `${appUrl}/api/webhooks/mercadopago`;

    const preference = new Preference(client);
    
    // 3. Creamos la preferencia
    const result = await preference.create({
      body: {
        items: [
          {
            id: "reserva-001", // A futuro, esto podría ser dinámico
            title: body.propiedad || "Reserva de Alojamiento",
            quantity: 1,
            // Mantenemos el fallback temporal de 10000 para que no crashee,
            // pero los logs de arriba revelarán por qué está fallando la conversión.
            unit_price: Number(body.total) || 10000, 
            currency_id: "ARS",
          },
        ],
        // ACÁ LE PASAMOS EL ID DE LA RESERVA A MERCADO PAGO
        external_reference: body.reservaId ? String(body.reservaId) : "ID_NO_PROPORCIONADO", 
        
        // URLs a las que Mercado Pago redirigirá al usuario tras el pago
        back_urls: {
          success: `${appUrl}/reserva-exitosa?propiedad=${encodeURIComponent(body.propiedad || '')}&checkin=${encodeURIComponent(body.checkin || '')}&checkout=${encodeURIComponent(body.checkout || '')}&total=${body.total || ''}`, 
          failure: `${appUrl}/failure`,
          pending: `${appUrl}/pending`,
        }, 
        auto_return: "approved",
        notification_url: webhookUrl,
      },
    });

    // 4. Devolvemos la URL para redirigir al usuario
    return NextResponse.json({ 
      url: result.sandbox_init_point || result.init_point 
    });
    
  } catch (error) {
    console.error("❌ Error creando la preferencia de pago:", error);
    return NextResponse.json(
      { error: "Error al crear la preferencia de pago" }, 
      { status: 500 }
    );
  }
}