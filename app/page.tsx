import { prisma } from '@/lib/prisma';
import ImageCarousel from '@/app/components/ImageCarousel'; 
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs'; 
import DeleteButton from '@/app/components/DeleteButton';   

export const dynamic = "force-dynamic";

// 👇 1. Agregamos 'async' aquí
export default async function Home() {
  
  const properties = await prisma.properties.findMany({
    orderBy: { created_at: 'desc' },
  });

  // 👇 2. Agregamos 'await' aquí (esta es la corrección clave)
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* --- CABECERA --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-rose-500 text-white p-1.5 rounded-lg transform group-hover:rotate-12 transition-transform">
              🏡
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-800">
              Alquileres MVP
            </span>
          </Link>

          {/* MENÚ DERECHO INTELIGENTE */}
          <div className="flex items-center gap-4">
            
            {/* 🟢 SI ESTÁS LOGUEADO: Muestra Botón Publicar + Avatar */}
            <SignedIn>
                <Link 
                  href="/admin/crear" 
                  className="hidden md:flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full font-medium transition-all shadow-sm hover:shadow-md text-sm"
                >
                  <span>+</span> Publicar Propiedad
                </Link>
                
                {/* Botón Móvil */}
                <Link 
                  href="/admin/crear" 
                  className="md:hidden bg-rose-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-sm"
                >
                  +
                </Link>

                <div className="border-l pl-4 ml-2 border-gray-200">
                  <UserButton afterSignOutUrl="/"/>
                </div>
            </SignedIn>

            {/* 🔴 SI NO ESTÁS LOGUEADO: Muestra Botón Iniciar Sesión */}
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
      <main className="container mx-auto px-4 py-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Explora alojamientos únicos</h1>
          <p className="text-gray-500">Encuentra el lugar perfecto para tu próxima escapada.</p>
        </div>
      
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((prop) => {
              // Verificamos si el usuario actual es el dueño
              const isOwner = userId && prop.owner_id === userId;

              return (
                <div key={prop.id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
                  
                  <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
                        <ImageCarousel images={prop.images} title={prop.title} fit="cover" />
                    </div>
                    {isOwner && (
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-full shadow-sm border border-gray-200 z-10">
                          👑 Tu Propiedad
                        </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h2 className="font-bold text-gray-900 line-clamp-1 text-lg group-hover:text-rose-600 transition-colors">
                        {prop.title}
                      </h2>
                    </div>
                    
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                      {prop.description}
                    </p>
                    
                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                        <div>
                            <span className="text-lg font-bold text-gray-900">${prop.price_per_night.toString()}</span>
                            <span className="text-gray-400 text-sm font-normal"> / noche</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link href={`/propiedad/${prop.slug}`} className="text-sm font-semibold text-gray-900 hover:underline">
                            Ver
                          </Link>

                          {isOwner && (
                            <div className="flex items-center gap-1 pl-2 border-l ml-2">
                               <Link href={`/propiedades/editar/${prop.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition">✏️</Link>
                               <div className="scale-90">
                                 <DeleteButton propertyId={prop.id} />
                               </div>
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ESTADO VACÍO */
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🏡</div>
            <h3 className="text-xl font-bold text-gray-800">Aún no hay propiedades</h3>
            <p className="text-gray-500 mb-6">Sé el primero en publicar tu espacio.</p>
            
            {/* Botón también aquí, protegido con SignedIn */}
            <SignedIn>
              <Link href="/admin/crear" className="text-rose-600 font-bold hover:underline bg-rose-50 px-4 py-2 rounded-lg">
                Publicar ahora
              </Link>
            </SignedIn>
            <SignedOut>
                  <span className="text-gray-400">Inicia sesión para comenzar</span>
            </SignedOut>
          </div>
        )}
      </main>
    </div>
  );
}