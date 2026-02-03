import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO O NOMBRE DE LA MARCA */}
        <Link href="/" className="text-xl font-bold tracking-tighter text-gray-900 hover:text-blue-600 transition">
          🏡 Alquileres<span className="text-blue-600">MVP</span>
        </Link>

        {/* MENÚ DERECHA */}
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-600 hover:text-black transition hidden sm:block"
          >
            Explorar
          </Link>
          
          <Link 
            href="/admin/crear" 
            className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            + Publicar
          </Link>
        </div>

      </div>
    </nav>
  )
}