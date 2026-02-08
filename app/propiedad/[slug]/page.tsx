import { prisma } from "@/lib/prisma";
import ImageCarousel from "@/app/components/ImageCarousel"; // 👈 CORREGIDO: Agregamos "/app"
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import DeleteButton from "@/app/components/DeleteButton";   // 👈 CORREGIDO: Agregamos "/app"

export const dynamic = "force-dynamic";

const amenityIcons: { [key: string]: string } = {
  wifi: "📶 Wifi",
  piscina: "🏊 Piscina",
  aire_acondicionado: "❄️ Aire Acondicionado",
  cocina: "🍳 Cocina",
  estacionamiento: "🚗 Estacionamiento",
  tv: "📺 TV",
  lavadora: "🧺 Lavadora",
  mascotas: "🐾 Mascotas permitidas",
  ca: "❄️ Aire Acondicionado",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Buscamos por SLUG (esto ya estaba arreglado, lo mantenemos)
  const property = await prisma.properties.findUnique({
    where: { slug: slug },
  });

  if (!property) {
    return notFound();
  }

  // 2. Seguridad: Verificamos si eres el dueño
  const { userId } = auth();
  const isOwner = userId && property.owner_id === userId;

  let amenitiesList: string[] = [];
  if (Array.isArray(property.amenities)) {
    amenitiesList = property.amenities as string[];
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        
        {/* Carrusel */}
        <div className="h-[350px] md:h-[550px] w-full relative bg-gray-200">
           <ImageCarousel 
             images={property.images} 
             title={property.title} 
             fit="contain" 
           />
        </div>

        {/* Contenido Principal */}
        <div className="p-6 md:p-10">
          
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                {property.title}
              </h1>
              
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    📍 {property.zip_code ? `CP: ${property.zip_code}` : "Ubicación privada"}
                </span>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                    🏠 Alojamiento entero
                </span>
                {/* Badge de Dueño */}
                {isOwner && (
                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold border border-yellow-200">
                        🔑 Tu Propiedad
                    </span>
                )}
              </div>
            </div>

            {/* Precio */}
            <div className="bg-green-50 p-5 rounded-xl border border-green-100 shadow-sm flex-shrink-0 text-center md:text-right">
              <span className="block text-4xl font-extrabold text-green-700">
                ${property.price_per_night.toString()}
              </span>
              <span className="text-green-800 font-medium">ARS / noche</span>
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Columna Izquierda: Detalles */}
            <div className="lg:col-span-2 flex flex-col gap-10">
               <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Sobre este lugar</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                  {property.description || "Sin descripción detallada."}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  ✨ Lo que ofrece
                </h2>
                {amenitiesList.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {amenitiesList.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <span className="text-3xl">
                          {amenityIcons[amenity.toLowerCase().replace(/\s/g, '_')] || "✔️"}
                        </span>
                        <span className="text-gray-800 font-bold capitalize text-lg">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No se han especificado comodidades.</p>
                )}
              </div>
            </div>

            {/* Columna Derecha: Panel de Acción */}
            <div className="lg:col-span-1">
               <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-8">
                  
                  {isOwner ? (
                    /* VISTA DUEÑO */
                    <>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Administrar Propiedad</h3>
                        <p className="text-gray-500 mb-6 text-sm">Eres el dueño de esta publicación.</p>
                        
                        <div className="flex flex-col gap-3">
                            <Link 
                              href={`/propiedades/editar/${property.id}`}
                              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-center hover:bg-blue-700 transition"
                            >
                              ✏️ Editar Propiedad
                            </Link>
                            
                            <div className="w-full">
                                <DeleteButton propertyId={property.id} />
                            </div>

                            <Link 
                                href="/" 
                                className="w-full text-center text-gray-600 py-3 mt-2 hover:underline"
                            >
                                Volver al inicio
                            </Link>
                        </div>
                    </>
                  ) : (
                    /* VISTA VISITA */
                    <>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen de reserva</h3>
                        <p className="text-gray-500 mb-6">Selecciona tus fechas.</p>
                        
                        <div className="flex flex-col gap-3">
                            <button className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold text-xl hover:bg-green-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                            📅 Solicitar Reserva
                            </button>
                            <Link 
                            href="/" 
                            className="w-full text-center text-gray-600 py-3 px-6 rounded-lg font-medium hover:bg-gray-100 border border-transparent hover:border-gray-200 transition"
                            >
                            Volver al inicio
                            </Link>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-4">No se te cobrará nada todavía.</p>
                    </>
                  )}

               </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}