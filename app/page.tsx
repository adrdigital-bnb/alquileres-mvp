import { prisma } from "@/lib/prisma";
import ImageCarousel from "./components/ImageCarousel"; // 👈 Asegúrate de que esta ruta sea correcta
import Link from "next/link";

// Forzamos a que la página se actualice siempre (para ver los cambios al instante)
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Obtenemos las propiedades ordenadas por fecha de creación (más nuevas primero)
  const properties = await prisma.properties.findMany({
    orderBy: { created_at: 'desc' }
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      
      {/* Encabezado */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          🏡 Alquileres MVP 
        </h1>
        {/* Botón para ir al panel de crear (opcional, por si lo quieres tener a mano) */}
        <Link 
            href="/propiedad/crear" 
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition"
        >
            + Publicar
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden flex flex-col h-full">
            
            {/* AQUÍ ESTÁ LA MAGIA: El Carrusel de Fotos 🎡 */}
            <ImageCarousel 
              images={property.images} 
              alt={property.title} 
            />

            <div className="p-4 flex flex-col flex-grow">
              
              {/* Título y Precio */}
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    {property.title}
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                    ${property.price_per_night}
                </span>
              </div>

              {/* Descripción corta */}
              <p className="text-gray-600 line-clamp-3 text-sm flex-grow mb-4">
                {property.description}
              </p>
              
              {/* Botones de acción */}
              <div className="mt-auto flex gap-2">
                <Link 
                  href={`/propiedad/${property.slug}`}
                  className="flex-1 bg-gray-900 text-white text-center py-2 rounded text-sm font-medium hover:bg-gray-700 transition"
                >
                  Ver Detalles
                </Link>
                
                {/* Botón rápido para editar (solo visible para ti en teoría) */}
                <Link 
                  href={`/propiedades/editar/${property.id}`}
                  className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded text-sm font-medium hover:bg-yellow-200 transition"
                  title="Editar Propiedad"
                >
                  ✏️
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Mensaje si no hay nada */}
        {properties.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-gray-400 mb-4">No hay propiedades publicadas aún.</p>
            <Link href="/propiedad/crear" className="text-blue-600 underline">
                ¡Sé el primero en publicar una!
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}