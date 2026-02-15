import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO O NOMBRE DE LA MARCA */}
        <Link href="/" className="text-xl font-bold tracking-tighter text-gray-900 hover:text-blue-600 transition">
          🏡 Alquileres<span className="text-blue-600">MVP</span>
        </Link>

        {/* MENÚ DERECHA */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* ENLACE PÚBLICO */}
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-600 hover:text-black transition hidden sm:block"
          >
            Explorar
          </Link>

          {/* 🟢 ENLACES PRIVADOS: Solo se ven si está logueado */}
          <SignedIn>
            <Link 
              href="/mis-viajes" 
              className="text-sm font-medium text-gray-600 hover:text-black transition hidden md:block"
            >
              Mis Viajes
            </Link>
            <Link 
              href="/mis-huespedes" 
              className="text-sm font-medium text-gray-600 hover:text-black transition hidden md:block"
            >
              Mis Huéspedes
            </Link>
          </SignedIn>
          
          {/* BOTÓN PUBLICAR */}
          <Link 
            href="/admin/crear" 
            className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hidden sm:block"
          >
            + Publicar
          </Link>

          {/* 🟢 MENÚ DE USUARIO: Foto de perfil de Clerk (Solo logueados) */}
          <SignedIn>
            <div className="ml-2 flex items-center border-l border-gray-200 pl-4 sm:pl-6">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          {/* 🔴 INICIAR SESIÓN: Solo se ve si NO está logueado */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-bold text-blue-600 hover:text-blue-800 transition ml-2">
                Iniciar sesión
              </button>
            </SignInButton>
          </SignedOut>

        </div>

      </div>
    </nav>
  )
}