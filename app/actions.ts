'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

// --- 1. FUNCIÓN PARA CREAR (CREATE) ---
export async function createProperty(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Debes iniciar sesión para publicar una propiedad");
  }

  // A. OBTENER Y VALIDAR DATOS
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  
  // Validación de Precio: Si falla, usamos 0
  const rawPrice = formData.get('price');
  const price = rawPrice ? parseFloat(rawPrice as string) : 0;

  // Validación de Dirección
  const address = (formData.get('address') as string) || title || "Dirección a confirmar";

  // Validación de Slug (Crucial para que no explote la BD por duplicados o vacíos)
  let slug = formData.get('slug') as string;
  if (!slug) {
    // Genera algo como: "departamento-centro-1707590000000"
    const slugBase = title 
      ? title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
      : 'propiedad';
    slug = `${slugBase}-${Date.now()}`;
  }

  // B. IMÁGENES
  const imagen1 = formData.get('imagen1') as string;
  const imagen2 = formData.get('imagen2') as string;
  const imagen3 = formData.get('imagen3') as string;
  const images = [imagen1, imagen2, imagen3].filter(Boolean);

  // C. AMENITIES
  const amenities = formData.getAll('amenities') as string[];

  // D. INTENTAR GUARDAR EN BD
  try {
    await prisma.properties.create({
      data: {
        title,
        slug, // Ahora garantizamos que nunca es null ni vacío
        description,
        price_per_night: price,
        address,
        images,
        owner_id: userId,
        amenities: amenities,
      },
    });
    
  } catch (error) {
    console.error("❌ ERROR AL CREAR PROPIEDAD:", error);
    // Lanzamos el error para verlo en pantalla si estamos en desarrollo
    throw new Error("No se pudo guardar la propiedad. Revisa la consola del servidor.");
  }

  // E. REDIRECCIONAR (Siempre fuera del try/catch)
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
  const slug = formData.get('slug') as string;

  // 🛡️ VERIFICACIÓN DE PROPIEDAD
  const existingProperty = await prisma.properties.findUnique({
    where: { id }
  });

  if (!existingProperty || existingProperty.owner_id !== userId) {
    throw new Error("⛔ Acceso denegado: No eres el dueño de esta propiedad.");
  }

  // Si pasa la verificación, procedemos:
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const address = (formData.get('address') as string) || title;

  const imagen1 = formData.get('imagen1') as string;
  const imagen2 = formData.get('imagen2') as string;
  const imagen3 = formData.get('imagen3') as string;
  const images = [imagen1, imagen2, imagen3].filter(Boolean);

  const amenities = formData.getAll('amenities') as string[];

  await prisma.properties.update({
    where: { id },
    data: {
      title,
      description,
      price_per_night: price,
      address,
      images,
      amenities: amenities, 
    },
  });

  revalidatePath('/');
  if (slug) {
    revalidatePath(`/propiedad/${slug}`);
  }
  
  redirect('/');
}

// --- 3. FUNCIÓN PARA BORRAR (DELETE) ---
export async function deleteProperty(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
     throw new Error("Debes iniciar sesión para borrar.");
  }

  const propertyId = formData.get('propertyId') as string;

  // 🛡️ VERIFICACIÓN DE PROPIEDAD
  const existingProperty = await prisma.properties.findUnique({
    where: { id: propertyId }
  });

  if (!existingProperty || existingProperty.owner_id !== userId) {
    throw new Error("⛔ Acceso denegado: No puedes borrar una propiedad ajena.");
  }

  // Si es el dueño, procedemos a borrar
  await prisma.properties.delete({
    where: { id: propertyId }
  });

  revalidatePath('/');
}