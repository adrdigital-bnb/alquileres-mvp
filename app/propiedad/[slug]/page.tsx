import { prisma } from "@/lib/prisma";
import ImageCarousel from "../../components/ImageCarousel";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  params: { slug: string };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Buscamos por ID usando el slug de la URL
  const property = await prisma.properties.findUnique({
    where: { id: slug },
  });

  if (!property) {
    return notFound();
  }

  let amenitiesList: string[] = [];
  if (Array.isArray(property.amenities)) {
    amenitiesList = property.amenities as string[];
  }

  return (
    // 1. FONDO MÁS OSCURO (bg-gray-100) para contraste general
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6">
      
      {/* 2. TARJETA PRINCIPAL (Bordes redondeados y sombra) */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        
        {/* Contenedor del carrusel con fondo gris suave */}
        <div className="h-[350px] md:h-[550px] w-full relative bg-gray-200">
           {/* CORRECCIÓN FINAL:
              Agregamos fit="contain". 
              Esto le dice al carrusel: "Muestra la foto entera, no la recortes".
           */}
           <ImageCarousel 
             images={property.images} 
             title={property.title} 
             fit="contain" 
           />
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-6 md:p-10">
          
          {/* Encabezado: Título y Precio */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                {property.title}
              </h1>
              
              {/* Barra de detalles rápidos (Chips) */}
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                   📍 {property.zip_code ? `CP: ${property.zip_code}` : "Ubicación privada"}
                </span>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                   🏠 Tipo: Alojamiento entero
                </span>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                   👤 Anfitrión verificado
                </span>
              </div>
            </div>

            {/* Precio Destacado */}
            <div className="bg-green-50 p-5 rounded-xl border border-green-100 shadow-sm flex-shrink-0 text-center md:text-right">
              <span className="block text-4xl font-extrabold text-green-700">
                ${property.price_per_night.toString()}
              </span>
              <span className="text-green-800 font-medium">ARS / noche</span>
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Columna Izquierda: Descripción y Amenities */}
            <div className="lg:col-span-2 flex flex-col gap-10">
               
               {/* Descripción */}
               <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Sobre este lugar</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                  {property.description || "El anfitrión no ha proporcionado una descripción detallada."}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  ✨ Lo que ofrece este lugar
                </h2>
                {amenitiesList.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {amenitiesList.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <span className="text-3xl p-2 bg-gray-50 rounded-lg">
                          {amenityIcons[amenity.toLowerCase().replace(/\s/g, '_')] || "✔️"}
                        </span>
                        <span className="text-gray-800 font-bold capitalize text-lg">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg border">
                    No se han especificado comodidades.
                  </p>
                )}
              </div>
            </div>

            {/* Columna Derecha: Tarjeta de Reserva Sticky */}
            <div className="lg:col-span-1">
               <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen de reserva</h3>
                  <p className="text-gray-500 mb-6">Selecciona tus fechas para ver el precio final.</p>
                  
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
               </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}