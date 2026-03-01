'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

interface ImageCarouselProps {
  images: string[];
  title: string;
  fit?: 'cover' | 'contain'; 
}

export default function ImageCarousel({ images, title, fit = 'cover' }: ImageCarouselProps) {
  // Activamos el loop infinito para que sea más fluido
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    // Obtenemos la cantidad de "paradas" para los puntitos
    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  // IMPORTANTE: Prevenir la propagación del clic
  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Estado de carga o sin imágenes mejorado visualmente
  if (!images || images.length === 0) {
    return (
      <div className="h-full w-full bg-gray-100 flex flex-col items-center justify-center min-h-[200px] rounded-xl border border-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-300 mb-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <span className="text-gray-400 text-sm font-medium">Sin imágenes</span>
      </div>
    )
  }

  return (
    // Agregamos rounded-xl al contenedor principal
    <div className="relative group h-full w-full rounded-xl overflow-hidden isolate bg-gray-200">
      <div className="h-full" ref={emblaRef}>
        <div className="flex touch-pan-y h-full">
          {images.map((src, index) => (
            // Usamos flex-[0_0_100%] para asegurar que cada slide ocupe todo el ancho
            <div className="relative flex-[0_0_100%] min-w-0 h-full" key={index}>
              <div className="relative h-full w-full">
                <Image
                  src={src}
                  alt={`${title} - foto ${index + 1}`}
                  fill
                  // Transición suave si cambiara el fit
                  className={`transition-all duration-300 ${fit === 'contain' ? "object-contain p-2" : "object-cover"}`}
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Solo mostramos controles si hay más de 1 imagen */}
      {images.length > 1 && (
        <>
          {/* Gradiente de protección en la parte inferior para los dots */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-10"></div>

          {/* Botón Anterior (Izquierda) */}
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 p-1.5 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 hover:scale-105 active:scale-95 cursor-pointer border border-gray-100 hidden md:block"
            aria-label="Imagen anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Botón Siguiente (Derecha) */}
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 p-1.5 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 hover:scale-105 active:scale-95 cursor-pointer border border-gray-100 hidden md:block"
             aria-label="Siguiente imagen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Paginación (Dots) */}
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-none">
            {scrollSnaps.map((_, index) => (
              <div
                key={index}
                // Lógica visual: el punto seleccionado es más grande y opaco
                className={`transition-all duration-300 rounded-full bg-white shadow-sm ${
                  index === selectedIndex
                    ? 'w-2 h-2 opacity-100 scale-105'
                    : 'w-1.5 h-1.5 opacity-60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}