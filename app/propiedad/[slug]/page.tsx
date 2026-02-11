import { prisma } from "@/lib/prisma";
import ImageCarousel from "@/app/components/ImageCarousel";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import DeleteButton from "@/app/components/DeleteButton";

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

  // Decodificamos la URL para que la "ñ" se lea bien
  const decodedSlug = decodeURIComponent(slug);

  // 1. Buscamos usando el slug arreglado
  const property = await prisma.properties.findUnique({
    where: { slug: decodedSlug },
  });

  if (!property) {
    return notFound();
  }

  // 2. Seguridad: Verificamos si eres el dueño
  const { userId } = await auth();
  const isOwner = userId && property.owner_id === userId;

  let amenitiesList: string[] = [];
  if (Array.isArray(property.amenities)) {
    amenitiesList = property.amenities as string[];
  }

  // --- 🟢 LOGICA WHATSAPP 🟢 ---
  // EDITAR AQUI EL NUMERO: Pon tu número personal aquí (Formato: 54911xxxxxxxx)
  const defaultPhone = "5491162397733"; 
  
  // Si la propiedad tiene un número específico en la BD, usa ese. Si no, usa el tuyo por defecto.
  const whatsappNumber = property.whatsapp || defaultPhone;
  
  const mensaje = `Hola! Vi tu propiedad "${property.title}" en AlquileresMVP y me interesa reservar.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
  // -----------------------------

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start">
      
      {/* CONTENEDOR CENTRAL COMPACTO */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">

        {/* Barra superior */}
        <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-white">
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 transition">
                ← Volver al inicio
            </Link>
            {isOwner && (
                <span className="text-xs bg-yellow-50 text-yellow-800 px-2 py-1 rounded border border-yellow-200 font-bold">
                    Tu Propiedad
                </span>
            )}
        </div>

        {/* IMAGEN: Altura controlada y fit="contain" para que se vea entera */}
        <div className="h-[250px] md:h-[320px] w-full relative bg-gray-100 flex items-center justify-center">
           <ImageCarousel
             images={property.images}
             title={property.title}
             fit="contain" 
           />
        </div>

        {/* CUERPO DE LA TARJETA */}
        <div className="p-6 md:p-8">
          
          {/* Encabezado: Título y Precio */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {property.title}
              </h1>
              
              <div className="flex flex-wrap gap-2 mt-2">
                 <span className="text-gray-500 text-sm flex items-center gap-1">
                   📍 {property.zip_code ? `CP: ${property.zip_code}` : property.address || "Ubicación"}
                 </span>
              </div>
            </div>

            {/* Precio */}
            <div className="text-right">
              <span className="block text-3xl font-bold text-rose-600">
                ${property.price_per_night.toString()}
              </span>
              <span className="text-gray-400 font-medium text-xs">ARS / noche</span>
            </div>
          </div>

          <hr className="my-6 border-gray-100" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Columna Izquierda: Detalles */}
            <div className="md:col-span-2 flex flex-col gap-6">
               <div>
                <h2 className="text-lg font-bold mb-2 text-gray-900">Sobre este lugar</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {property.description || "Sin descripción detallada."}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-3 text-gray-900">
                  Comodidades
                </h2>
                {amenitiesList.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {amenitiesList.map((amenity, index) => (
                      <div key={index} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-100">
                        <span className="text-base">
                          {amenityIcons[amenity.toLowerCase().replace(/\s/g, '_')] || "•"}
                        </span>
                        <span className="text-gray-700 text-sm font-medium capitalize">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-sm">No especificadas.</p>
                )}
              </div>
            </div>

            {/* Columna Derecha: Panel de Acción Compacto */}
            <div className="md:col-span-1">
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                 {isOwner ? (
                   /* VISTA DUEÑO */
                   <div className="flex flex-col gap-2">
                       <Link
                         href={`/propiedades/editar/${property.id}`}
                         className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-3 rounded-md font-bold text-center hover:bg-gray-100 text-sm transition"
                       >
                         ✏️ Editar
                       </Link>
                       <div className="w-full">
                           <DeleteButton propertyId={property.id} />
                       </div>
                   </div>
                 ) : (
                   /* VISTA VISITA (Ahora con botón de WhatsApp) */
                   <div className="flex flex-col gap-2">
                       <a 
                         href={whatsappUrl}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="w-full bg-green-600 text-white py-2.5 px-4 rounded-md font-bold text-sm hover:bg-green-700 transition shadow-sm flex items-center justify-center gap-2"
                       >
                         {/* Icono simple de WhatsApp */}
                         <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                           <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.694c.93.513 1.733.702 2.805.702 3.182 0 5.768-2.586 5.769-5.766.001-3.181-2.585-5.767-5.768-5.767zm6.768 5.767c-.001 3.756-3.029 6.781-6.768 6.781-1.221 0-2.358-.323-3.322-.882l-3.682.964 1.006-3.578c-.689-1.071-1.053-2.314-1.054-3.579.001-3.725 3.06-6.781 6.769-6.781 3.739 0 6.768 3.029 6.768 6.781z" />
                         </svg>
                         Consultar por WhatsApp
                       </a>
                       <p className="text-center text-xs text-gray-400">Te pondrás en contacto con el dueño.</p>
                   </div>
                 )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}