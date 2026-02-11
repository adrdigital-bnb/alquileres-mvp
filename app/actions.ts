'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

// 🛠️ HELPER: Función para limpiar Slugs (Adiós Ñ y tildes)
function cleanSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita tildes (á -> a)
    .replace(/ñ/g, "n") // Cambia ñ -> n
    .replace(/\s+/g, '-') // Espacios -> guiones
    .replace(/[^\w-]+/g, ''); // Borra caracteres raros
}

// --- 1. FUNCIÓN PARA CREAR (CREATE) ---
export async function createProperty(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Debes iniciar sesión para publicar una propiedad");
  }

  // A. OBTENER Y VALIDAR DATOS
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  
  // Validación de Precio: Si falla o es NaN, usamos 0
  const rawPrice = formData.get('price');
  const price = rawPrice ? parseFloat(rawPrice as string) : 0;
  const safePrice = isNaN(price) ? 0 : price;

  // Validación de Dirección
  const address = (formData.get('address') as string) || "Ubicación por confirmar";

  // B. GENERACIÓN DE SLUG ROBUSTA
  let slug = formData.get('slug') as string;
  
  // Si el usuario escribió un slug, lo limpiamos. Si no, lo creamos desde el título.
  const baseForSlug = slug && slug.trim().length > 0 ? slug : title;
  const cleanBase = cleanSlug(baseForSlug || 'propiedad');
  
  // Agregamos timestamp para asegurar que sea único
  slug = `${cleanBase}-${Date.now()}`;

  // C. IMÁGENES (CREATE sigue usando inputs individuales por ahora)
  // Si quisieras usar JSON aquí también, tendrías que actualizar el CreateForm
  const images = [
    formData.get('imagen1'),
    formData.get('imagen2'),
    formData.get('imagen3')
  ].filter((img) => typeof img === 'string' && img.trim().length > 0) as string[];

  // D. AMENITIES
  const amenities = formData.getAll('amenities') as string[];

  // E. GUARDAR EN BD
  try {
    await prisma.properties.create({
      data: {
        title,
        slug, 
        description,
        price_per_night: safePrice,
        address,
        images,
        owner_id: userId,
        amenities: amenities,
      },
    });
    
  } catch (error) {
    console.error("❌ ERROR AL CREAR:", error);
    throw new Error("Error al guardar en base de datos.");
  }

  revalidatePath('/');
  redirect('/');
}

// --- 2. FUNCIÓN PARA ACTUALIZAR (UPDATE) ---
export async function updateProperty(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
     throw new Error("Debes iniciar sesión para editar.");
  }

  const id = formData.get('id') as string;
  
  // Recuperamos el slug original para poder redirigir bien al final
  const currentSlug = formData.get('slug') as string;

  // 🛡️ VERIFICACIÓN DE PROPIEDAD
  const existingProperty = await prisma.properties.findUnique({
    where: { id }
  });

  if (!existingProperty || existingProperty.owner_id !== userId) {
    throw new Error("⛔ Acceso denegado.");
  }

  // DATOS A ACTUALIZAR
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  
  const rawPrice = formData.get('price');
  const price = rawPrice ? parseFloat(rawPrice as string) : 0;
  const safePrice = isNaN(price) ? 0 : price;

  const address = (formData.get('address') as string) || title; 

  // 🚨 CORRECCIÓN CLAVE: RECIBIR EL PAQUETE JSON DE IMÁGENES
  // Esto captura el array completo que envía el EditForm nuevo
  const imagesJSON = formData.get('imagesJSON') as string;
  let images: string[] = [];
  
  try {
    if (imagesJSON) {
        // Convertimos el texto "[url1, url2]" de vuelta a un Array real
        images = JSON.parse(imagesJSON);
    }
  } catch (error) {
    console.error("❌ Error al leer el JSON de imágenes:", error);
    // Si falla, mantenemos las imágenes viejas para no borrar nada por accidente
    images = existingProperty.images as string[] || [];
  }

  const amenities = formData.getAll('amenities') as string[];

  // ACTUALIZAMOS EN LA BD
  await prisma.properties.update({
    where: { id },
    data: {
      title,
      description,
      price_per_night: safePrice,
      address,
      images: images, // ✅ Guardamos la lista limpia y ordenada
      amenities: amenities, 
    },
  });

  // Revalidamos caché
  revalidatePath('/');
  if (currentSlug) {
    revalidatePath(`/propiedad/${currentSlug}`);
  }
  
  // Redirigimos
  redirect(`/propiedad/${currentSlug}`);
}

// --- 3. FUNCIÓN PARA BORRAR (DELETE) ---
export async function deleteProperty(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
     throw new Error("Debes iniciar sesión.");
  }

  const propertyId = formData.get('propertyId') as string;

  const existingProperty = await prisma.properties.findUnique({
    where: { id: propertyId }
  });

  if (!existingProperty || existingProperty.owner_id !== userId) {
    throw new Error("⛔ No puedes borrar esto.");
  }

  await prisma.properties.delete({
    where: { id: propertyId }
  });

  revalidatePath('/');
}