import { prisma } from "@/lib/prisma";
// 🟢 1. IMPORTAMOS LA NUEVA GALERÍA Y SACAMOS EL VIEJO CAROUSEL
import ImageGallery from "@/app/components/ImageGallery"; // (Asegurate de que esta ruta coincida con donde guardaste el componente)
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import DeleteButton from "@/app/components/DeleteButton";
import BookingCalendar from "@/app/components/BookingCalendar";
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

  const amenitiesList = Array.isArray(property.amenities) 
    ? (property.amenities as string[]) 
    : [];

  const imagesList = Array.isArray(property.images)
    ? (property.images as string[])
    : [];

  const mapAddress = property.address 
    ? `${property.address}, ${property.zip_code || ''}, Argentina`
    : null;

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start">
      
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">

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

        {/* 🟢 2. REEMPLAZAMOS EL DIV DEL CAROUSEL POR LA NUEVA GALERÍA ESTILO AIRBNB */}
        <div className="p-4 md:p-6 pb-0">
           <ImageGallery images={imagesList} />
        </div>

        {/* CUERPO DE LA TARJETA */}
        <div className="p-6 md:p-8">
          
          <div className="flex flex-col gap-2 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {property.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                 <span className="text-gray-500 text-sm flex items-center gap-1">
                   📍 {property.zip_code ? `${property.city}, CP ${property.zip_code}` : property.address || "Ubicación"}
                 </span>
              </div>
          </div>

          <hr className="my-6 border-gray-100" />

          <div className="flex flex-col lg:flex-row gap-12 relative items-start">

            {/* Columna Izquierda */}
            <div className="flex-1 flex flex-col gap-10">
               <div>
                <h2 className="text-xl font-bold mb-3 text-gray-900">Sobre este lugar</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                  {property.description || "Sin descripción detallada."}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-900">Lo que ofrece este lugar</h2>
                {amenitiesList.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {amenitiesList.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                        <span className="text-2xl">
                          {amenityIcons[amenity.toLowerCase().replace(/\s/g, '_')]?.split(' ')[0] || "•"}
                        </span>
                        <span className="text-gray-700 text-base font-medium capitalize">
                          {amenity.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-sm">No especificadas.</p>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-900">A dónde vas a ir</h2>
                <div className="w-full h-[400px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative shadow-sm">
                  {mapAddress ? (
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      title="Mapa de la propiedad"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      className="absolute inset-0"
                    ></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      📍 Dirección exacta no disponible para el mapa.
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-3 ml-1">{property.address}, {property.city}, {property.province}</p>
              </div>
            </div>

            {/* Columna Derecha (Calendario) */}
            <div className="w-full lg:w-[400px] shrink-0 relative">
               <div className="sticky top-8">
                 {isOwner ? (
                   <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 flex flex-col gap-3">
                       <h3 className="font-bold text-lg mb-2">Administrar Propiedad</h3>
                       <Link
                         href={`/propiedades/editar/${property.id}`}
                         className="w-full bg-white text-gray-700 border-2 border-gray-300 py-2.5 px-4 rounded-lg font-bold text-center hover:bg-gray-50 hover:border-gray-400 transition flex items-center justify-center gap-2"
                       >
                         ✏️ Editar detalles y fotos
                       </Link>
                       <div className="w-full mt-2">
                           <DeleteButton propertyId={property.id} />
                       </div>
                   </div>
                 ) : (
                   <BookingCalendar 
                     propertyId={property.id} 
                     pricePerNight={Number(property.price_per_night)} 
                     propertyTitle={property.title} 
                   />
                 )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}