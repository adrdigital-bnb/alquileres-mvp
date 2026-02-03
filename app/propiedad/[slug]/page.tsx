import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

// Diccionario de iconos (opcional, para que se vea lindo)
const amenityIcons: Record<string, string> = {
  wifi: "📶 Wifi Alta Velocidad",
  piscina: "🏊 Piscina",
  aire: "❄️ Aire Acondicionado",
  cocina: "🍳 Cocina Equipada",
  estacionamiento: "🚗 Estacionamiento Gratis",
  tv: "📺 Smart TV",
  mascotas: "🐶 Apto Mascotas",
};

export default async function PropiedadPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. OBTENEMOS EL SLUG (No el ID)
  const { slug } = await params;
  
  // 2. Decodificamos por si tiene espacios o tildes
  const slugDecoded = decodeURIComponent(slug);

  // 3. BUSCAMOS POR SLUG EN LA BASE DE DATOS
  const property = await prisma.properties.findUnique({
    where: {
      slug: slugDecoded, // 👈 AQUÍ ESTABA EL ERROR (antes decía id: id)
    },
  });

  // Si no existe, error 404
  if (!property) {
    return notFound();
  }

  // Link de WhatsApp
  const mensajeWhatsapp = `Hola, estoy interesado en reservar "${property.title}" que vi en AlquileresMVP.`;
  const linkWhatsapp = `https://wa.me/5491112345678?text=${encodeURIComponent(mensajeWhatsapp)}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* IMAGEN PRINCIPAL */}
      <div className="w-full h-[60vh] relative bg-gray-200">
        {property.images[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto -mt-20 relative z-10 p-6">
        <div className="bg-white rounded-xl shadow-xl p-8">
          
          {/* TÍTULO Y BOTÓN EDITAR */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              <p className="text-gray-500 mt-1 flex items-center gap-1">
                📍 {property.address}
              </p>
            </div>

            <Link 
              href={`/propiedades/editar/${property.id}`}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors border border-gray-200"
            >
              ✏️ Editar
            </Link>
          </div>

          <hr className="my-6 border-gray-100" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* DESCRIPCIÓN Y AMENITIES */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Sobre este lugar</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Lo que ofrece este lugar</h3>
                <div className="grid grid-cols-2 gap-3">
          {/* PARCHE: Forzamos a que lo trate como lista (any[]) */}
              {Array.isArray(property.amenities) && (property.amenities as any[]).length > 0 ? (
                (property.amenities as any[]).map((item: any) => (
                  <div key={item} className="text-gray-600 flex items-center gap-2">
                    {amenityIcons[item] || item}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">No se especificaron comodidades.</p>
              )}
                  )
                </div>
              </div>
            </div>

            {/* PRECIO Y RESERVA */}
            <div className="md:col-span-1">
              <div className="border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-2xl font-bold">${property.price_per_night.toString()}</span>
                    <span className="text-gray-500"> / noche</span>
                  </div>
                </div>

                <a
                  href={linkWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg mb-3"
                >
                  Reservar por WhatsApp 💬
                </a>

                <p className="text-center text-xs text-gray-400">
                  No se te cobrará nada todavía.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}