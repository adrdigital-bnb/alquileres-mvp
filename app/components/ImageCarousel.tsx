'use client'

import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

// 1. Definimos la "forma" de los datos
interface ImageCarouselProps {
  images: string[]; // Un array de textos (las URLs)
  title: string;    // Un texto normal
}

// 2. Aplicamos el tipo aquí con ": ImageCarouselProps"
export default function ImageCarousel({ images, title }: ImageCarouselProps) {
  
  // El resto de tu código sigue igual...
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Validamos si no hay imágenes
  if (!images || images.length === 0) {
    return (
      <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-400">Sin imágenes</span>
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* Viewport */}
      <div className="overflow-hidden rounded-lg bg-gray-100" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {images.map((src, index) => (
            <div className="relative flex-[0_0_100%] min-w-0" key={index}>
              {/* Contenedor de aspecto para evitar saltos */}
              <div className="relative h-64 w-full sm:h-72 md:h-80">
                <Image
                  src={src}
                  alt={`${title} - imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flechas de navegación (solo si hay más de 1 imagen) */}
      {images.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            aria-label="Siguiente"
          >
            →
          </button>
          
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
             1 / {images.length}
          </div>
        </>
      )}
    </div>
  )
}