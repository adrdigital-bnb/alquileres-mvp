import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN as string 
});

export async function POST(request: Request) {
  console.log("🔥🔥🔥 EJECUTANDO EL CÓDIGO CON URLs DINÁMICAS 🔥🔥🔥");

  try {
    const body = await request.json();

    // 💡 LA MAGIA ESTÁ ACÁ: Definimos las URLs dinámicamente
    // Si process.env.NEXT_PUBLIC_APP_URL existe, usa esa. Si no, usa localhost.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000";
    const webhookUrl = process.env.MP_WEBHOOK_URL || "https://nonpursuant-cattily-frida.ngrok-free.dev/api/webhooks/mercadopago";

    const preference = new Preference(client);
    
    const result = await preference.create({
      body: {
        items: [
          {
            id: "reserva-001", 
            title: body.propiedad || "Reserva de Alojamiento",
            quantity: 1,
            unit_price: Number(body.total) || 10000, 
            currency_id: "ARS",
          },
        ],
        // Usamos la variable appUrl para que funcione en local y en Vercel
        back_urls: {
          success: `${appUrl}/reserva-exitosa`,
          failure: `${appUrl}/`,
          pending: `${appUrl}/`,
        },
        auto_return: "approved",
        // Usamos la variable webhookUrl
        notification_url: webhookUrl,
      },
    });

    return NextResponse.json({ url: result.sandbox_init_point });
    
  } catch (error) {
    console.error("❌ Error creando la preferencia de pago:", error);
    return NextResponse.json(
      { error: "Error al crear el pago" }, 
      { status: 500 }
    );
  }
}