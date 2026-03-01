import Link from 'next/link'
import ImageCarousel from './ImageCarousel' // Asegurate de que la ruta sea correcta

// Definimos qué datos necesita recibir la tarjeta para renderizarse
export interface PropertyCardProps {
  id: string | number;
  title: string;
  location: string;
  images: string[];
  pricePerNight: number;
  maxGuests: number;
  bedrooms?: number;
}

export default function PropertyCard({ 
  id, 
  title, 
  location, 
  images, 
  pricePerNight, 
  maxGuests,
  bedrooms 
}: PropertyCardProps) {
  
  // Formateador para que los pesos se vean prolijos (ej: $ 50.000)
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(pricePerNight)

  return (
    // El Link envuelve toda la tarjeta para que sea clickeable
    <Link href={`/propiedad/${id}`} className="group flex flex-col gap-3 cursor-pointer">
      
      {/* Contenedor del Carrusel - Mantenemos una proporción 4:3 clásica para inmuebles */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
        <ImageCarousel 
          images={images} 
          title={title} 
          fit="cover" 
        />
      </div>

      {/* Contenedor de la Información */}
      <div className="flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 text-base truncate pr-4">
            {location}
          </h3>
          {/* Espacio para un futuro rating con estrellita si quisieras */}
          <span className="flex items-center gap-1 text-sm text-gray-800">
            ★ 4.9
          </span>
        </div>
        
        <p className="text-gray-500 text-sm truncate">
          {title}
        </p>
        
        <p className="text-gray-500 text-sm mt-0.5">
          {maxGuests} {maxGuests === 1 ? 'huésped' : 'huéspedes'} 
          {bedrooms ? ` · ${bedrooms} dorm.` : ''}
        </p>

        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-semibold text-gray-900">{formattedPrice}</span>
          <span className="text-gray-800 text-sm">noche</span>
        </div>
      </div>
    </Link>
  )
}