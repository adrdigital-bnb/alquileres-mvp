import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs'; 
import SearchBar from '@/app/components/SearchBar'; 
import PropertyCard from '@/app/components/PropertyCard'; 

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  // 1. Le avisamos a TypeScript que esperamos los dos parámetros de búsqueda
  searchParams?: Promise<{ query?: string; guests?: string }>;
}) {
  
  // 2. Leemos la búsqueda de la URL
  const params = await searchParams;
  const query = params?.query || "";
  
  // 3. Capturamos los huéspedes y los pasamos a número
  const guestsParam = params?.guests || "0";
  const guestsCount = parseInt(guestsParam, 10);

  // 4. Filtramos la base de datos
  const properties = await prisma.properties.findMany({
    where: {
      is_active: true,
      
      // Filtro de huéspedes: mayor o igual a lo buscado
      max_guests: guestsCount > 0 ? { gte: guestsCount } : undefined,
      
      // Filtro de texto: busca en título, ciudad o barrio
      OR: query
        ? [
            { title: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
            { neighborhood: { contains: query, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { created_at: 'desc' },
  });

  // Obtenemos el ID de Clerk
  const { userId: clerkId } = await auth();
  
  // Buscamos tu ID real en la base de datos para saber si sos el dueño de alguna propiedad
  let dbUserId = null;
  if (clerkId) {
    const dbUser = await prisma.users.findUnique({
      where: { clerkId: clerkId },
      select: { id: true } 
    });
    dbUserId = dbUser?.id;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* --- CABECERA --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-rose-500 text-white p-1.5 rounded-lg transform group-hover:rotate-12 transition-transform">
              🏡
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-800 hidden md:block">
              Alquileres MVP
            </span>
          </Link>

          {/* MENÚ DERECHO */}
          <div className="flex items-center gap-3">
            
            <SignedIn>
                <Link 
                  href="/mis-propiedades" 
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium px-4 py-2 rounded-full transition-all text-sm flex items-center gap-2"
                >
                  💼 <span className="hidden md:inline">Mis Propiedades</span>
                </Link>

                <Link 
                  href="/admin/crear" 
                  className="hidden md:flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full font-medium transition-all shadow-sm hover:shadow-md text-sm"
                >
                  <span>+</span> Publicar
                </Link>
                
                <Link 
                  href="/admin/crear" 
                  className="md:hidden bg-rose-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-sm"
                >
                  +
                </Link>

                <div className="border-l pl-3 ml-1 border-gray-200">
                  <UserButton />
                </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-gray-600 hover:text-gray-900 font-medium text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  Iniciar Sesión
                </button>
              </SignInButton>
            </SignedOut>

          </div>
        </div>
      </nav>

      {/* --- CONTENIDO --- */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* SECCIÓN HERO + BUSCADOR */}
        <div className="mb-10 text-center md:text-left md:flex md:items-end md:justify-between gap-4">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Explora alojamientos únicos</h1>
            <p className="text-gray-500">
              {query || guestsCount > 0
                ? `Resultados para: ${query ? `"${query}"` : "Cualquier destino"}${guestsCount > 0 ? ` • ${guestsCount} o más personas` : ""}` 
                : "Encuentra el lugar perfecto para tu próxima escapada."}
            </p>
          </div>
          
          <div className="w-full md:w-auto md:min-w-[400px]">
             <SearchBar />
          </div>
        </div>
      
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((prop) => {
              
              // Verificamos si es el dueño
              const isOwner = dbUserId && prop.owner_id === dbUserId;
              
              // Normalizamos las imágenes
              const imagesList = Array.isArray(prop.images) ? (prop.images as string[]) : [];

              return (
                <div key={prop.id} className="relative group">
                  <PropertyCard
                    id={prop.slug || prop.id} 
                    title={prop.title}
                    location={`${prop.city || ''} ${prop.neighborhood ? `, ${prop.neighborhood}` : ''}`}
                    pricePerNight={Number(prop.price_per_night)} 
                    maxGuests={prop.max_guests} 
                    bedrooms={prop.bedrooms ?? undefined}
                    images={imagesList}
                  />

                  {/* 👑 Badge de Dueño Flotante */}
                  {isOwner && (
                    <div className="absolute top-3 left-3 z-20">
                      <span className="bg-white/90 backdrop-blur text-xs font-bold px-2.5 py-1.5 rounded-md shadow-md border border-gray-200">
                        👑 Tu Propiedad
                      </span>
                    </div>
                  )}

                  {/* ✏️ Opciones de edición (Flotantes al hacer hover si es el dueño) */}
                  {isOwner && (
                    <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur rounded-md shadow-md border border-gray-200 p-1 flex items-center gap-1">
                       <Link href={`/propiedades/editar/${prop.id}`} className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                         ✏️
                       </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800">
              {query || guestsCount > 0 ? "No encontramos propiedades con esos filtros" : "Aún no hay propiedades"}
            </h3>
            <p className="text-gray-500 mb-6">
              {query || guestsCount > 0 ? "Intenta buscando otra ciudad o cambiando la cantidad de huéspedes." : "Sé el primero en publicar tu espacio."}
            </p>
            
            <div className="flex justify-center gap-4">
                {(query || guestsCount > 0) && (
                    <Link href="/" className="text-gray-600 font-medium hover:underline px-4 py-2 border rounded-lg">
                        Borrar filtros
                    </Link>
                )}
                <SignedIn>
                  <Link href="/admin/crear" className="text-rose-600 font-bold hover:underline bg-rose-50 px-4 py-2 rounded-lg">
                    Publicar ahora
                  </Link>
                </SignedIn>
            </div>
            
            <SignedOut>
                <div className="mt-4">
                  <span className="text-gray-400">Inicia sesión para comenzar</span>
                </div>
            </SignedOut>
          </div>
        )}
      </main>
    </div>
  );
}