import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Search from "./components/Search";
import DeleteButton from "./components/DeleteButton";

// Esto asegura que la página siempre muestre datos frescos (no caché viejo)
export const dynamic = "force-dynamic"; 

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  
  const params = await searchParams;
  const query = params?.query || ""; 

  const properties = await prisma.properties.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <main className="container mx-auto p-4 min-h-screen pb-20">
      {/* 👇 AQUÍ ESTÁ EL CAMBIO: El cohete activará a Vercel */}
      <h1 className="text-4xl font-extrabold text-center mb-2 text-gray-800">Alquileres MVP 🚀</h1>
      <p className="text-center text-gray-500 mb-8">Encuentra tu próximo alojamiento temporal</p>
      
      <Search />

      <div className="text-center mb-10">
        <Link
          href="/admin/crear"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          + Publicar Propiedad
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* IMAGEN Y BOTÓN EDITAR */}
            <div className="h-56 w-full bg-gray-200 relative group">
              {property.images[0] ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                  📷 Sin imagen
                </div>
              )}
              
              <Link
                href={`/propiedades/editar/${property.id}`}
                className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm hover:bg-blue-50 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Editar propiedad"
              >
                ✏️
              </Link>
            </div>

            {/* CONTENIDO */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1 text-gray-900 leading-tight">
                  {property.title}
                </h2>
                <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                  📍 {property.address}
                </p>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {property.description}
                </p>
              </div>
              
              <div className="border-t pt-4 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    ${property.price_per_night.toString()}
                  </span>
                  <span className="text-xs text-gray-500 font-medium"> /noche</span>
                </div>
                
                <Link
                  href={`/propiedad/${property.slug}`}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"
                >
                  Ver Detalle
                </Link>
              </div>

              <DeleteButton id={property.id} />
              
            </div>
          </div>
        ))}
      </div>

      {/* MENSAJE VACÍO */}
      {properties.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-300 mb-4">🏚️</p>
          <p className="text-xl text-gray-500">No encontramos nada con "{query}"</p>
          <Link href="/" className="text-blue-500 font-medium hover:underline mt-2 inline-block">
            Limpiar búsqueda
          </Link>
        </div>
      )}
    </main>
  );
}