'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- 1. FUNCIÓN PARA CREAR (CREATE) ---
export async function createProperty(formData: FormData) {
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

  // C. AMENITIES (Checkboxes) -> Array de strings
  const amenities = formData.getAll('amenities') as string[];

  // D. DUEÑO (Lógica temporal)
  let owner = await prisma.users.findFirst();
  if (!owner) {
    owner = await prisma.users.create({
      data: {
        email: "admin@test.com",
        full_name: "Admin Host",
        password_hash: "temp_pass_123",
        role: "HOST",
      }
    });
  }

  // E. GUARDAR EN BD
  await prisma.properties.create({
    data: {
      title,
      slug,
      description,
      price_per_night: price,
      address,
      images,
      owner_id: owner.id,
      
      // 🔥 CORRECCIÓN JSON: Pasamos el array directo
      amenities: amenities, 
    },
  });

  // F. REDIRECCIONAR
  revalidatePath('/');
  redirect('/');
}

// --- 2. FUNCIÓN PARA ACTUALIZAR (UPDATE / EDITAR) ---
export async function updateProperty(formData: FormData) {
  const id = formData.get('id') as string;
  const slug = formData.get('slug') as string;

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const address = (formData.get('address') as string) || title;

  const imagen1 = formData.get('imagen1') as string;
  const imagen2 = formData.get('imagen2') as string;
  const imagen3 = formData.get('imagen3') as string;
  const images = [imagen1, imagen2, imagen3].filter(Boolean);

  // C. CAPTURAR AMENITIES -> Array de strings
  const amenities = formData.getAll('amenities') as string[];

  // E. ACTUALIZAR EN BD
  await prisma.properties.update({
    where: { id },
    data: {
      title,
      description,
      price_per_night: price,
      address,
      images,
      
      // 🔥 CORRECCIÓN JSON: Pasamos el array directo
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
// Esta es la que te faltaba y causaba el error en el build
export async function deleteProperty(formData: FormData) {
  const propertyId = formData.get('propertyId') as string;

  await prisma.properties.delete({
    where: { id: propertyId }
  });

  revalidatePath('/');
}