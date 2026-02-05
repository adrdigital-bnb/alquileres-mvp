import { prisma } from "@/lib/prisma";
import ImageCarousel from "../../components/ImageCarousel";
import Link from "next/link";
import { notFound } from "next/navigation";

// Forzamos dinamismo para ver cambios al instante
export const dynamic = "force-dynamic";

// Mapa de íconos para las comodidades (puedes agregar más aquí)
const amenityIcons: { [key: string]: string } = {
  wifi: "📶 Wifi",
  piscina: "🏊 Piscina",
  aire_acondicionado: "❄️ Aire Acondicionado",
  cocina: "🍳 Cocina",
  estacionamiento: "🚗 Estacionamiento",
  tv: "📺 TV",
  lavadora: "🧺 Lavadora",
  // Si la comodidad no está aquí, saldrá un ícono genérico
};

export default async function PropertyDetailPage({ params }: { params: { slug: string } }) {
  const property = await prisma.properties.findUnique({
    where: { slug: params.slug },
  });

  if (!property) {
    notFound();
  }

  // Convertimos comodidades: si es null, array vacío. Si es string, lo parseamos.
  let amenitiesList: string[] = [];
  if (Array.isArray(property.amenities)) {
    amenitiesList = property.amenities as string[];
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* 1. SECCIÓN CARRUSEL (Ahora más grande) */}
        <div className="h-[300px] md:h-[500px] w-full relative bg-gray-200">
           <ImageCarousel 
              images={property.images} 
              title={property.title} 
            />
        </div>

        {/* 2. CONTENIDO PRINCIPAL */}
        <div className="p-6 md:p-8">
          
          {/* Encabezado: Título y Precio */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
           <p className="text-gray-500 text-lg flex items-center gap-1">
  📍 {property.zip_code ? `Código Postal: ${property.zip_code}` : "Ubicación por consultar"}
</p>
            </div>
            <div className="text-right">
              <span className="block text-3xl font-bold text-green-600">
                ${property.price_per_night.toString()}
              </span>
              <span className="text-gray-500 text-sm">/ noche</span>
            </div>
          </div>

          <hr className="my-6 border-gray-100" />

          {/* Descripción */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Sobre este lugar</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* 3. COMODIDADES CON ÍCONOS (El Bonus) */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Lo que ofrece este lugar</h2>
            
            {amenitiesList.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenitiesList.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-xl">
                      {/* Usamos el mapa de íconos, o uno genérico si no existe */}
                      {amenityIcons[amenity.toLowerCase().replace(/\s/g, '_')] || "✨ " + amenity}
                    </span>
                    <span className="text-gray-700 capitalize">
                      {/* Si usamos el mapa mostramos solo el texto limpio, si no, el original */}
                      {amenityIcons[amenity.toLowerCase().replace(/\s/g, '_')] 
                        ? amenityIcons[amenity.toLowerCase().replace(/\s/g, '_')].split(" ").slice(1).join(" ") 
                        : amenity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No se han especificado comodidades.</p>
            )}
          </div>

          {/* Botones de acción (Reservar / Volver) */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t">
            <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transition shadow-md">
              📅 Reservar ahora
            </button>
            <Link 
              href="/" 
              className="flex-none text-center bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              ← Volver al inicio
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}