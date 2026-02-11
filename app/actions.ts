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

  // A. OBTENER DATOS
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const city = (formData.get('city') as string) || "Buenos Aires"; // 🟢 Agregamos Ciudad
  
  // Validación de Precio
  const rawPrice = formData.get('price');
  const price = rawPrice ? parseFloat(rawPrice as string) : 0;
  const safePrice = isNaN(price) ? 0 : price;

  // Validación de Dirección
  const address = (formData.get('address') as string) || "Ubicación por confirmar";

  // B. GENERACIÓN DE SLUG
  // Creamos el slug base desde el título + timestamp para que sea único
  const cleanBase = cleanSlug(title || 'propiedad');
  const slug = `${cleanBase}-${Date.now()}`;

  // C. IMÁGENES (🟢 CORREGIDO PARA CLOUDINARY)
  // El formulario nuevo envía "url1,url2,url3" en un string llamado 'images'
  const imagesString = formData.get('images') as string;
  const images = imagesString ? imagesString.split(',').filter(Boolean) : [];

  // D. GUARDAR EN BD
  try {
    await prisma.properties.create({
      data: {
        owner_id: userId,
        title,
        slug, 
        description,
        price_per_night: safePrice,
        address,
        city,
        images, // Guardamos el array de URLs
        is_active: true,
      },
    });
    
  } catch (error) {
    console.error("❌ ERROR AL CREAR:", error);
    throw new Error("Error al guardar en base de datos.");
  }

  // Revalidamos y redirigimos al Dashboard
  revalidatePath('/');
  revalidatePath('/mis-propiedades');
  redirect('/mis-propiedades');
}

// --- 2. FUNCIÓN PARA ACTUALIZAR (UPDATE) ---
export async function updateProperty(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
     throw new Error("Debes iniciar sesión para editar.");
  }

  const id = formData.get('id') as string;
  const currentSlug = formData.get('slug') as string;

  // 🛡️ VERIFICACIÓN
  const existingProperty = await prisma.properties.findUnique({
    where: { id }
  });

  if (!existingProperty || existingProperty.owner_id !== userId) {
    throw new Error("⛔ Acceso denegado.");
  }

  // DATOS
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const city = formData.get('city') as string; // 🟢 Agregamos Ciudad también aquí
  
  const rawPrice = formData.get('price');
  const price = rawPrice ? parseFloat(rawPrice as string) : 0;
  const safePrice = isNaN(price) ? 0 : price;

  const address = (formData.get('address') as string) || title; 

  // 🟢 IMÁGENES (Lógica del Edit Form)
  // El formulario de edición suele enviar JSON, así que mantenemos esa lógica si no la cambiaste
  const imagesJSON = formData.get('imagesJSON') as string;
  let images: string[] = [];
  
  try {
    if (imagesJSON) {
        images = JSON.parse(imagesJSON);
    } else {
        // Fallback por si acaso
        images = existingProperty.images as string[] || [];
    }
  } catch (error) {
    console.error("❌ Error al leer imágenes en Update:", error);
    images = existingProperty.images as string[] || [];
  }

  const amenities = formData.getAll('amenities') as string[];

  // UPDATE BD
  await prisma.properties.update({
    where: { id },
    data: {
      title,
      description,
      price_per_night: safePrice,
      address,
      city,
      images, 
      amenities, 
    },
  });

  revalidatePath('/');
  revalidatePath('/mis-propiedades');
  if (currentSlug) {
    revalidatePath(`/propiedad/${currentSlug}`);
  }
  
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
  revalidatePath('/mis-propiedades');
}