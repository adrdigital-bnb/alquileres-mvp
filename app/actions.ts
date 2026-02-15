'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';

// 🛠️ HELPER: Función para limpiar Slugs
function cleanSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita tildes
    .replace(/ñ/g, "n")
    .replace(/\s+/g, '-') // Espacios -> guiones
    .replace(/[^\w-]+/g, ''); // Borra caracteres raros
}

// --- 1. FUNCIÓN PARA CREAR (CREATE) ---
export async function createProperty(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Debes iniciar sesión para publicar una propiedad");
  }

  const clerkId = user.id;
  const email = user.emailAddresses[0]?.emailAddress || `user_${Date.now()}@no-email.com`;
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  let dbUser = await prisma.users.findUnique({
    where: { clerkId: clerkId }
  });

  if (!dbUser) {
    console.log("👤 Usuario nuevo detectado. Sincronizando Clerk con Neon...");
    dbUser = await prisma.users.create({
      data: {
        clerkId: clerkId,
        email: email,
        full_name: fullName,
      }
    });
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const address = formData.get('address') as string;
  const city = formData.get('city') as string;
  const province = (formData.get('province') as string) || "Buenos Aires"; 
  const zip_code = (formData.get('zip_code') as string) || "";

  const rawPrice = formData.get('price');
  const price = rawPrice ? parseFloat(rawPrice as string) : 0;
  
  let slug = formData.get('slug') as string;
  if (!slug || slug.trim() === '') {
     const cleanBase = cleanSlug(title || 'propiedad');
     slug = `${cleanBase}-${Date.now()}`;
  } else {
     slug = cleanSlug(slug);
  }

  const images: string[] = [];
  const img1 = formData.get('imagen1') as string;
  const img2 = formData.get('imagen2') as string;
  const img3 = formData.get('imagen3') as string;

  if (img1) images.push(img1);
  if (img2) images.push(img2);
  if (img3) images.push(img3);

  const amenities = formData.getAll('amenities') as string[];

  try {
    await prisma.properties.create({
      data: {
        owner: { connect: { id: dbUser.id } }, // 🟢 Mejor usar connect como hiciste en reservas
        title,
        slug, 
        description,
        price_per_night: price,
        address,
        city,
        province, 
        zip_code, 
        images, 
        amenities, 
        is_active: true,
      },
    });
  } catch (error) {
    console.error("❌ ERROR AL CREAR PROPIEDAD:", error);
    throw new Error("Error al guardar en la base de datos. Revisa la terminal."); 
  }

  revalidatePath('/');
  redirect('/'); 
}

// --- 2. FUNCIÓN PARA BORRAR (DELETE) ---
export async function deleteProperty(formData: FormData) {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) throw new Error("Debes iniciar sesión.");

  const dbUser = await prisma.users.findUnique({ where: { clerkId } });
  if (!dbUser) throw new Error("Usuario no encontrado en la DB local.");

  const propertyId = formData.get('propertyId') as string;

  const existingProperty = await prisma.properties.findUnique({ where: { id: propertyId } });

  if (!existingProperty || existingProperty.owner_id !== dbUser.id) {
    throw new Error("⛔ No tienes permiso para borrar esto.");
  }

  try {
    await prisma.properties.delete({ where: { id: propertyId } });
  } catch (error) {
    console.error("❌ ERROR AL BORRAR PROPIEDAD:", error);
    throw new Error("Error al eliminar la propiedad.");
  }

  revalidatePath('/');
}

// --- 3. FUNCIÓN PARA ACTUALIZAR (UPDATE) ---
export async function updateProperty(formData: FormData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Debes iniciar sesión para editar.");

  const dbUser = await prisma.users.findUnique({ where: { clerkId } });
  if (!dbUser) throw new Error("Usuario no encontrado en la DB local.");

  const propertyId = (formData.get('id') as string) || (formData.get('propertyId') as string);

  if (!propertyId) {
    throw new Error("Falta el ID de la propiedad a actualizar.");
  }

  const existingProperty = await prisma.properties.findUnique({ where: { id: propertyId } });
  if (!existingProperty || existingProperty.owner_id !== dbUser.id) {
    throw new Error("⛔ No tienes permiso para editar esto.");
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const address = formData.get('address') as string;
  const city = formData.get('city') as string;
  const province = (formData.get('province') as string) || "Buenos Aires";
  const zip_code = formData.get('zip_code') as string;
  
  const rawPrice = formData.get('price');
  // 🟢 Aseguramos que el precio se maneje como número si Prisma devuelve un objeto Decimal
  const price = rawPrice ? parseFloat(rawPrice as string) : Number(existingProperty.price_per_night);

  const amenities = formData.getAll('amenities') as string[];
  
  const images: string[] = [];
  const img1 = formData.get('imagen1') as string;
  const img2 = formData.get('imagen2') as string;
  const img3 = formData.get('imagen3') as string;

  if (img1) images.push(img1);
  if (img2) images.push(img2);
  if (img3) images.push(img3);

  const hiddenImages = formData.getAll('images') as string[];
  hiddenImages.forEach(img => {
    if (!images.includes(img)) images.push(img);
  });

  const finalImages = images.length > 0 
    ? images 
    : (Array.isArray(existingProperty.images) ? existingProperty.images as string[] : []);

  const finalAmenities = amenities.length > 0 
    ? amenities 
    : (Array.isArray(existingProperty.amenities) ? existingProperty.amenities as string[] : []);

  try {
    await prisma.properties.update({
      where: { id: propertyId },
      data: {
        title,
        description,
        price_per_night: price,
        address,
        city,
        province,
        zip_code,
        images: finalImages,      
        amenities: finalAmenities 
      },
    });
  } catch (error) {
    console.error("❌ ERROR AL ACTUALIZAR PROPIEDAD:", error);
    throw new Error("Error al actualizar la base de datos.");
  }

  revalidatePath('/');
  revalidatePath(`/propiedad/${existingProperty.slug}`);
  redirect('/'); 
}

// --- 4. FUNCIÓN PARA RESERVAR (CREATE BOOKING) ---
export async function createBooking(
  propertyId: string, 
  checkIn: Date | string, 
  checkOut: Date | string, 
  totalPrice: number
) {
  const user = await currentUser(); 
  
  if (!user) {
    throw new Error("Debes iniciar sesión para realizar una reserva.");
  }

  const clerkId = user.id;
  const email = user.emailAddresses[0]?.emailAddress || `huesped_${Date.now()}@no-email.com`;
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  let dbUser = await prisma.users.findUnique({ 
    where: { clerkId } 
  });

  if (!dbUser) {
    console.log("👤 Huésped nuevo detectado. Creando perfil...");
    dbUser = await prisma.users.create({
      data: {
        clerkId: clerkId,
        email: email,
        full_name: fullName,
      }
    });
  }

  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const newBooking = await prisma.bookings.create({
      data: {
        property: { connect: { id: propertyId } },
        guest: { connect: { id: dbUser.id } },
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        total_price: totalPrice,
      }
    });

    revalidatePath(`/propiedad`); 
    
    return { success: true, bookingId: newBooking.id };

  } catch (error) {
    console.error("❌ ERROR AL CREAR RESERVA:", error);
    throw new Error("No se pudo completar la reserva en la base de datos.");
  }
}

// --- 5. 🟢 NUEVA FUNCIÓN: OBTENER FECHAS BLOQUEADAS ---
export async function getUnavailableDates(propertyId: string) {
  try {
    // 1. Buscamos las reservas que NO estén canceladas
    const activeBookings = await prisma.bookings.findMany({
      where: {
        property_id: propertyId,
        status: { not: "CANCELLED" },
      },
      select: { check_in_date: true, check_out_date: true },
    });

    // 2. Buscamos las fechas bloqueadas manualmente (para mantenimientos o uso propio)
    const blockedDates = await prisma.blocked_dates.findMany({
      where: { property_id: propertyId },
      select: { start_date: true, end_date: true },
    });

    // 3. Unificamos todo en el formato que lee react-day-picker
    const disabledRanges = [
      ...activeBookings.map((b) => ({
        from: b.check_in_date,
        to: b.check_out_date,
      })),
      ...blockedDates.map((b) => ({
        from: b.start_date,
        to: b.end_date,
      })),
    ];

    return { success: true, disabledRanges };
  } catch (error) {
    console.error("❌ ERROR OBTENIENDO FECHAS OCUPADAS:", error);
    return { success: false, disabledRanges: [] };
  }
}