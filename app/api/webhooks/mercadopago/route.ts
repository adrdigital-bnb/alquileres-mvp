import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN as string 
});

export async function POST(request: Request) {
  try {
    // 1. Manejo robusto del body (MP a veces envía peticiones sin body)
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      console.log("Notificación sin JSON body. Leyendo parámetros de URL...");
    }

    const url = new URL(request.url);
    
    // Capturamos el tipo de evento venga por donde venga
    const topic = url.searchParams.get("topic") || url.searchParams.get("type") || body.type || body.action;
    
    // Capturamos el ID del pago (a veces viene anidado en data.id)
    const paymentId = url.searchParams.get("id") || url.searchParams.get("data.id") || body.data?.id;

    // 2. Filtramos: Solo nos interesan las notificaciones de pagos
    if ((topic === "payment" || topic === "payment.created" || topic === "payment.updated") && paymentId) {
      console.log(`🔔 Notificación de pago recibida. ID: ${paymentId}`);

      // 3. Consultamos el estado real del pago a la API de Mercado Pago (Seguridad antifraude)
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });

      // 4. Extraemos el external_reference y el estado
      const estadoPago = paymentData.status; 
      const reservaId = paymentData.external_reference;

      console.log(`Estado: ${estadoPago} | Reserva ID: ${reservaId}`);

      // Validamos que tengamos un ID válido que haya venido desde nuestro front-end
      if (reservaId && reservaId !== "ID_NO_PROPORCIONADO") {
        
        // 5. Verificamos que la reserva EXISTA en PostgreSQL antes de tocar nada
        const reservaActual = await prisma.bookings.findUnique({
          where: { id: reservaId },
          select: { status: true }
        });

        if (!reservaActual) {
          console.log(`⚠️ Alerta: La reserva ${reservaId} no existe en la base de datos.`);
          return new NextResponse("OK", { status: 200 }); // Retornamos 200 para que MP no reintente
        }

        // 6. Lógica de actualización según el estado del pago
        if (estadoPago === "approved") {
          
          if (reservaActual.status !== "CONFIRMED") {
            await prisma.bookings.update({
              where: { id: reservaId },
              data: { 
                status: "CONFIRMED", 
                payment_id: String(paymentId) 
              },
            });
            console.log(`✅ Reserva ${reservaId} actualizada a CONFIRMED con éxito. ¡Fechas bloqueadas!`);
          } else {
            console.log(`ℹ️ La reserva ${reservaId} ya estaba confirmada previamente.`);
          }
          
        } else if (estadoPago === "rejected" || estadoPago === "cancelled") {
          
          // Liberamos las fechas solo si no estaban ya canceladas
          if (reservaActual.status !== "CANCELLED") {
            await prisma.bookings.update({
              where: { id: reservaId },
              data: { status: "CANCELLED" }, 
            });
            console.log(`❌ Pago rechazado/cancelado. Reserva ${reservaId} actualizada a CANCELLED. Fechas liberadas.`);
          }
        }
      }
    } 

    // 7. Respondemos a Mercado Pago con un 200 OK rápidamente
    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("❌ Error grave en el webhook de Mercado Pago:", error);
    // Devolvemos 500 para que Mercado Pago sepa que hubo un fallo de nuestro lado y reintente más tarde
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}