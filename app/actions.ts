'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server'; // 👈 1. Importamos la autenticación

// --- 1. FUNCIÓN PARA CREAR (CREATE) ---
export async function createProperty(formData: FormData) {
  // 🔐 SEGURIDAD: Obtenemos el usuario real de Clerk
  const { userId } = auth();

  if (!userId) {
    throw new Error("Debes iniciar sesión para publicar una propiedad");
  }

  // A. OBTENER DATOS
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const price = parseFloat(formData.get('price') as string);
  const description = formData.get('description') as string;
  const address = (formData.get('address') as string) || title || "Dirección a confirmar";

  // B. IMÁGENES
  const imagen1 = formData.get('imagen1') as string;
  const imagen2 = formData.get('imagen2') as string;
  const imagen3 = formData.get('imagen3') as string;
  const images = [imagen1, imagen2, imagen3].filter(Boolean);

  // C. AMENITIES
  const amenities = formData.getAll('amenities') as string[];

  // D. DUEÑO (Lógica REAL)
  // Ya no creamos usuarios falsos. Usamos tu ID de Clerk directamente.

  // E. GUARDAR EN BD
  await prisma.properties.create({
    data: {
      title,
      slug,
      description,
      price_per_night: price,
      address,
      images,
      owner_id: userId, // 👈 Aquí guardamos TU firma digital (ej: user_2b...)
      amenities: amenities, 
    },
  });

  // F. REDIRECCIONAR
  revalidatePath('/');
  redirect('/');
}

// --- 2. FUNCIÓN PARA ACTUALIZAR (UPDATE / EDITAR) ---
export async function updateProperty(formData: FormData) {
  const { userId } = auth(); // 🔐 Obtenemos quién intenta editar
  
  const id = formData.get('id') as string;
  const slug = formData.get('slug') as string;

  // 🛡️ VERIFICACIÓN DE PROPIEDAD
  // Antes de editar, buscamos la propiedad para ver de quién es
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
  const { userId } = auth(); // 🔐 Obtenemos quién intenta borrar
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