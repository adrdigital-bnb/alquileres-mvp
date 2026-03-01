import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN as string 
});

export async function POST(request: Request) {
  try {
    // 1. Obtenemos los parámetros de la URL o el body
    const body = await request.json();
    const url = new URL(request.url);
    const topic = url.searchParams.get("topic") || body.type;
    const paymentId = url.searchParams.get("id") || body.data?.id;

    // 2. Filtramos: Solo nos interesan las notificaciones de pagos
    if (topic === "payment" && paymentId) {
      console.log(`🔔 Notificación de pago recibida. ID: ${paymentId}`);

      // 3. Consultamos el estado real del pago a la API de Mercado Pago
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });

      // 4. Extraemos el external_reference (tu reservaId) y el estado
      const estadoPago = paymentData.status; // ej: "approved", "pending", "rejected"
      const reservaId = paymentData.external_reference;

      console.log(`Estado: ${estadoPago} | Reserva ID: ${reservaId}`);

      // 5. Lógica de actualización según el estado del pago
      if (estadoPago === "approved" && reservaId && reservaId !== "ID_NO_PROPORCIONADO") {
        
        // Verificamos el estado actual de la reserva
        const reservaActual = await prisma.bookings.findUnique({
          where: { id: reservaId },
          select: { status: true }
        });

        if (reservaActual && reservaActual.status !== "CONFIRMED") {
          // Actualizamos la reserva usando Prisma a CONFIRMED
          await prisma.bookings.update({
            where: { 
              id: reservaId 
            },
            data: { 
              status: "CONFIRMED", 
              payment_id: String(paymentId) 
            },
          });
          
          console.log(`✅ Reserva ${reservaId} actualizada a CONFIRMED con éxito.`);
        } else {
          console.log(`⚠️ La reserva ${reservaId} ya estaba pagada o no existe.`);
        }
        
      } else if ((estadoPago === "rejected" || estadoPago === "cancelled") && reservaId && reservaId !== "ID_NO_PROPORCIONADO") {
        
        // 🔥 NUEVO: Liberamos las fechas si el pago falla o el usuario cancela
        await prisma.bookings.update({
          where: { id: reservaId },
          data: { status: "CANCELLED" }, 
        });
        
        console.log(`❌ Pago rechazado o cancelado. Reserva ${reservaId} actualizada a CANCELLED para liberar fechas.`);
      }
    } 

    // 6. Respondemos a Mercado Pago con un 200 OK rápidamente
    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("❌ Error en el webhook de Mercado Pago:", error);
    // Devolvemos 500 para que MP sepa que hubo un fallo y reintente más tarde
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}