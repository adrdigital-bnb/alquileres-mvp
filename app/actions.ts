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

  // B. GENERACIÓN DE SLUG ROBUSTA (Fix para Vercel)
  let slug = formData.get('slug') as string;
  
  // Si el usuario escribió un slug, lo limpiamos. Si no, lo creamos desde el título.
  const baseForSlug = slug && slug.trim().length > 0 ? slug : title;
  const cleanBase = cleanSlug(baseForSlug || 'propiedad');
  
  // Agregamos timestamp para asegurar que sea único
  slug = `${cleanBase}-${Date.now()}`;

  // C. IMÁGENES (Recoge imagen1, 2 y 3)
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

  const address = (formData.get('address') as string) || title; // Fallback simple

  // 🚨 AQUÍ ES DONDE FALLABA LA EDICIÓN DE FOTOS
  // Filtramos estrictamente para que solo pasen strings con contenido real
  const images = [
    formData.get('imagen1'),
    formData.get('imagen2'),
    formData.get('imagen3')
  ].filter((img) => typeof img === 'string' && img.trim().length > 0) as string[];

  const amenities = formData.getAll('amenities') as string[];

  // ACTUALIZAMOS
  await prisma.properties.update({
    where: { id },
    data: {
      title,
      description,
      price_per_night: safePrice,
      address,
      images: images, // ¡Ahora sí guarda el array actualizado!
      amenities: amenities, 
    },
  });

  // Revalidamos caché
  revalidatePath('/');
  if (currentSlug) {
    revalidatePath(`/propiedad/${currentSlug}`);
  }
  
  // Redirigimos a la página de la propiedad
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