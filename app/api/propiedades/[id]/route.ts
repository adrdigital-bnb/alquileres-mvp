import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma'; // Usa la ruta que ya te funcionaba sin línea roja

// GET: Obtener una propiedad
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // CAMBIO CLAVE: "Desempaquetamos" la promesa params con await
    const { id } = await params;
    
    const propiedad = await prisma.properties.findUnique({
      where: { id: id },
    });

    if (!propiedad) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
    }

    return NextResponse.json(propiedad);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// PUT: Actualizar una propiedad
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // CAMBIO CLAVE: Aquí también usamos await
    const { id } = await params;
    
    const data = await request.json();

    const propiedadActualizada = await prisma.properties.update({
      where: { id: id },
      data: {
        title: data.title,
        description: data.description,
        price_per_night: Number(data.price_per_night),
        address: data.address,
        images: data.images ? [data.images] : [], 
      },
    });

    return NextResponse.json(propiedadActualizada);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error actualizando' }, { status: 500 });
  }
}