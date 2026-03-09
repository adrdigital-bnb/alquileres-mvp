import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { prisma } from "@/lib/prisma"; // Importación corregida con llaves

// 1. Inicializamos el cliente con tu Access Token
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN as string 
});

export async function POST(request: Request) {
  console.log("🔥🔥🔥 EJECUTANDO EL CÓDIGO DE CHECKOUT 🔥🔥🔥");

  try {
    const body = await request.json();

    // 🔥 LOGS DE DEBUGGING 🔥
    console.log("🔍 Datos crudos recibidos del frontend:", body);
    
    // 🛡️ BARRERA 1: Extraemos los datos necesarios para validar disponibilidad
    const { propertyId, checkin, checkout } = body;

    if (!propertyId || !checkin || !checkout) {
      return NextResponse.json(
        { error: "Faltan datos de fechas o propiedad para validar la reserva." },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkin);
    const checkOutDate = new Date(checkout);

    // 🛡️ BARRERA 2: Validación de solapamiento en PostgreSQL con tu schema exacto
    const overlappingReservation = await prisma.bookings.findFirst({
      where: {
        property_id: propertyId,
        status: 'CONFIRMED', 
        check_in_date: {
          lt: checkOutDate, 
        },
        check_out_date: {
          gt: checkInDate,  
        },
      },
    });

    if (overlappingReservation) {
      console.log("⚠️ Intento de reserva bloqueado: Fechas solapadas.");
      return NextResponse.json(
        { error: "Las fechas seleccionadas acaban de ser reservadas por otro usuario." },
        { status: 409 } // 409 Conflict
      );
    }
    // Si pasamos este bloque, las fechas están libres en la base de datos.

    // 2. Definimos las URLs base
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://alquileres-mvp-xi.vercel.app";
    const webhookUrl = process.env.MP_WEBHOOK_URL || `${appUrl}/api/webhooks/mercadopago`;

    const preference = new Preference(client);
    
    // 3. Creamos la preferencia
    const result = await preference.create({
      body: {
        items: [
          {
            id: "reserva-001", 
            title: body.propiedad || "Reserva de Alojamiento temporario",
            quantity: 1,
            unit_price: Number(body.total) || 100, 
            currency_id: "ARS",
          },
        ],
        external_reference: body.reservaId ? String(body.reservaId) : "ID_NO_PROPORCIONADO", 
        
        back_urls: {
          success: `${appUrl}/reserva-exitosa?propiedad=${encodeURIComponent(body.propiedad || '')}&checkin=${encodeURIComponent(checkin)}&checkout=${encodeURIComponent(checkout)}&total=${body.total || ''}`, 
          failure: `${appUrl}/failure`,
          pending: `${appUrl}/pending`,
        }, 
        auto_return: "approved",
        notification_url: webhookUrl,
      },
    });

    // 4. Devolvemos la URL de Mercado Pago
    return NextResponse.json({ 
      url: result.init_point 
    });
    
  } catch (error) {
    console.error("❌ Error en el proceso de checkout:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la solicitud de pago" }, 
      { status: 500 }
    );
  }
}