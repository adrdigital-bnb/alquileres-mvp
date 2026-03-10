"use server"; 

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { enviarEmailCancelacion } from "@/lib/mail";

export async function cancelarReserva(bookingId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("No estás autorizado.");

  const dbUser = await prisma.users.findUnique({
    where: { clerkId: userId },
    select: { id: true }
  });

  if (!dbUser) throw new Error("Usuario no encontrado.");

  // 1. Buscamos la reserva PERO ahora incluimos los datos de la casa y del huésped
  const reserva = await prisma.bookings.findUnique({
    where: { id: bookingId },
    include: {
      property: true,
      guest: true, 
    }
  });

  if (!reserva) throw new Error("La reserva no existe.");
  if (reserva.guest_id !== dbUser.id) throw new Error("No tienes permiso para cancelar esta reserva.");

  // 2. Cancelamos en la base de datos
  await prisma.bookings.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" }
  });

  // 3. 🟢 DISPARAMOS EL EMAIL 
  // (Nota: Usamos .catch() para que si falla Resend, no rompa la aplicación)
  if (reserva.guest?.email) {
    enviarEmailCancelacion(
      reserva.guest.email, 
      reserva.guest.full_name || "Huésped", 
      reserva.property.title
    ).catch(console.error);
  }

  // 4. Refrescamos la pantalla
  revalidatePath("/mis-viajes");
  revalidatePath("/mis-huespedes");
  revalidatePath("/mis-propiedades");
  
  return { success: true };
}