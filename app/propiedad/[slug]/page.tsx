import { prisma } from "@/lib/prisma";
import ImageCarousel from "@/app/components/ImageCarousel";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import DeleteButton from "@/app/components/DeleteButton";
import { Metadata } from "next";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const property = await prisma.properties.findUnique({
    where: { slug: decodedSlug },
    select: { title: true, description: true, images: true }
  });

  if (!property) return { title: "Propiedad no encontrada" };

  const mainImage = Array.isArray(property.images) && property.images.length > 0 
    ? (property.images[0] as string) 
    : "/placeholder.jpg";

  return {
    title: `${property.title} | AlquileresMVP`,
    description: property.description?.substring(0, 150) || "Detalles de la propiedad",
    openGraph: {
      images: [mainImage],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const property = await prisma.properties.findUnique({
    where: { slug: decodedSlug },
  });

  if (!property) {
    return notFound();
  }

  const { userId } = await auth();
  const isOwner = userId && property.owner_id === userId;

  // Normalización de Arrays
  const amenitiesList = Array.isArray(property.amenities) 
    ? (property.amenities as string[]) 
    : [];

  const imagesList = Array.isArray(property.images)
    ? (property.images as string[])
    : [];

  // --- LOGICA WHATSAPP ---
  const defaultPhone = "5491162397733"; 
  const whatsappNumber = property.whatsapp || defaultPhone;
  const mensaje = `Hola! Vi tu propiedad "${property.title}" en AlquileresMVP y me interesa reservar.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
  
  // --- LOGICA MAPA ---
  // Construimos la dirección para el mapa. Agregamos "Argentina" o la localidad para mayor precisión.
  const mapAddress = property.address 
    ? `${property.address}, ${property.zip_code || ''}, Argentina`
    : null;

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start">
      
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

        {/* IMAGEN: Carousel */}
        <div className="h-[250px] md:h-[320px] w-full relative bg-gray-100 flex items-center justify-center">
           <ImageCarousel
             images={imagesList}
             title={property.title}
             fit="contain" 
           />
        </div>

        {/* CUERPO DE LA TARJETA */}
        <div className="p-6 md:p-8">
          
          {/* Encabezado */}
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

            <div className="text-right">
              <span className="block text-3xl font-bold text-rose-600">
                ${property.price_per_night.toString()}
              </span>
              <span className="text-gray-400 font-medium text-xs">ARS / noche</span>
            </div>
          </div>

          <hr className="my-6 border-gray-100" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Columna Izquierda: Detalles + MAPA */}
            <div className="md:col-span-2 flex flex-col gap-8">
               
               {/* Descripción */}
               <div>
                <h2 className="text-lg font-bold mb-2 text-gray-900">Sobre este lugar</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {property.description || "Sin descripción detallada."}
                </p>
              </div>

              {/* Comodidades */}
              <div>
                <h2 className="text-lg font-bold mb-3 text-gray-900">Comodidades</h2>
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

              {/* 🟢 MAPA DE UBICACIÓN 🟢 */}
              <div>
                <h2 className="text-lg font-bold mb-3 text-gray-900">Ubicación</h2>
                <div className="w-full h-[250px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
                  {mapAddress ? (
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      title="Mapa de la propiedad"
                      // Usamos la API pública de Google Maps para embed simple
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      className="absolute inset-0"
                    ></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      📍 Dirección exacta no disponible para el mapa.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Columna Derecha: Panel de Acción */}
            <div className="md:col-span-1">
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 sticky top-4">
                 {isOwner ? (
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
                   <div className="flex flex-col gap-2">
                       <a 
                         href={whatsappUrl}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="w-full bg-green-600 text-white py-2.5 px-4 rounded-md font-bold text-sm hover:bg-green-700 transition shadow-sm flex items-center justify-center gap-2"
                       >
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