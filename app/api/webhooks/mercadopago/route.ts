import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Capturamos los datos que manda Mercado Pago (pueden venir por URL o por Body)
    const url = new URL(request.url);
    const topic = url.searchParams.get("topic") || url.searchParams.get("type");
    
    // Intentamos leer el body (si lo hay)
    const body = await request.json().catch(() => ({}));
    const type = topic || body.type;

    console.log("🔔 ¡MERCADO PAGO LLAMÓ AL WEBHOOK! 🔔");
    console.log("Tipo de evento:", type);

    // Si el evento es un pago, capturamos el ID para usarlo después
    if (type === "payment") {
      // Mercado pago a veces manda el ID en la URL y a veces en el body
      const paymentId = body.data?.id || url.searchParams.get("data.id");
      console.log("💰 ID del Pago recibido:", paymentId);
      
      // TODO: En el futuro, acá usaremos Prisma para cambiar el estado de la reserva
    }

    // Es vital responderle "200 OK" rápido a Mercado Pago para que no reintente
    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("❌ Error en el Webhook de MP:", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}