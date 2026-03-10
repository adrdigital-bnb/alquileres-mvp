import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link' // 🟢 IMPORTANTE: Agregamos Link para la navegación
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Mantenemos tu Key de Clerk intacta
    <ClerkProvider publishableKey="pk_test_cHJvcGVyLXN0dWQtMjQuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <html lang="es">
        <body className="bg-gray-50 text-gray-900 font-sans min-h-screen">
          
          {/* 🟢 HEADER GLOBAL UNIFICADO */}
          <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            
            {/* LOGO */}
            <Link href="/" className="font-bold text-xl text-rose-500 hover:text-rose-600 transition flex items-center gap-2">
              🏡 Alquileres MVP
            </Link>

            {/* MENÚ CENTRAL Y BOTONES */}
            <div className="flex items-center gap-4 md:gap-6">
              
              {/* ENLACES PRIVADOS: Solo visibles si el usuario inició sesión */}
              <SignedIn>
                <nav className="hidden md:flex items-center gap-6 mr-2 border-r border-gray-200 pr-6">
                  <Link href="/mis-viajes" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                    Mis Viajes
                  </Link>
                  <Link href="/mis-huespedes" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                    Mis Huéspedes
                  </Link>
                  <Link href="/mis-propiedades" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                    Mis Propiedades
                  </Link>
                  <Link href="/mis-ingresos" className="text-sm font-bold text-green-600 hover:text-green-700 transition">
                    💰 Mis Ingresos
                  </Link>
                </nav>
              </SignedIn>

              {/* BOTONES DE ACCIÓN Y PERFIL */}
              <div className="flex items-center gap-4">
                <SignedIn>
                  <Link 
                    href="/admin/crear" 
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-700 transition shadow-sm hidden sm:block"
                  >
                    + Publicar
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>

                <SignedOut>
                  <SignInButton mode="modal">
                     <button className="bg-rose-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-rose-700 transition shadow-sm">
                       Iniciar Sesión
                     </button>
                  </SignInButton>
                </SignedOut>
              </div>

            </div>
          </header>

          {/* CONTENIDO DE LAS PÁGINAS */}
          <main>{children}</main>
          
        </body>
      </html>
    </ClerkProvider>
  )
}