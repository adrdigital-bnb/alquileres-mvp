import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando el proceso de seed (sembrado)...');

  // 1. Limpiamos la base de datos (opcional, pero recomendado)
  await prisma.bookings.deleteMany();
  await prisma.properties.deleteMany();
  await prisma.users.deleteMany();

  // 2. Crear un USUARIO DUEÑO (Host)
  // Usamos un ID fijo o simulado para que sea fácil de identificar
  const hostUser = await prisma.users.create({
    data: {
      clerkId: "user_2rmEjemploClerkID123", // Simula un ID de Clerk
      email: "adrian@alquileresmvp.com",
      full_name: "Adrián Host",
      role: "HOST",
      phone: "5491162397733",
    },
  });

  console.log(`👤 Usuario creado: ${hostUser.full_name}`);

  // 3. Crear PROPIEDADES
  const prop1 = await prisma.properties.create({
    data: {
      owner_id: hostUser.id,
      title: "Departamento Moderno en Palermo Soho",
      slug: "depto-palermo-soho",
      description: "Hermoso departamento luminoso ideal para parejas. Cerca de bares y restaurantes.",
      address: "Honduras 4500",
      city: "Palermo",
      province: "Buenos Aires", // Fundamental para el mapa
      zip_code: "1414",
      price_per_night: 45000,
      max_guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["wifi", "aire_acondicionado", "cocina", "tv"], // Ahora es un Array de Strings directo
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
      ],
      whatsapp: "5491162397733",
    },
  });

  const prop2 = await prisma.properties.create({
    data: {
      owner_id: hostUser.id,
      title: "Cabaña Rústica en Bariloche",
      slug: "cabana-rustica-bariloche",
      description: "Desconecta en esta cabaña con vista al lago. Acceso directo a playa.",
      address: "Av. Exequiel Bustillo 1500",
      city: "San Carlos de Bariloche",
      province: "Río Negro",
      zip_code: "8400",
      price_per_night: 85000,
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: ["wifi", "estacionamiento", "cocina", "mascotas"],
      images: [
        "https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
      ],
      whatsapp: "5491162397733",
    },
  });

  console.log(`🏠 Propiedades creadas: 2`);
  console.log(`✅ Seed finalizado correctamente.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });