'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

interface ImageCarouselProps {
  images: string[];
  title: string;
  // Nueva propiedad opcional: 'cover' (recortar/rellenar) o 'contain' (ver entera)
  // Por defecto será 'cover' para que las tarjetas se vean bonitas
  fit?: 'cover' | 'contain'; 
}

export default function ImageCarousel({ images, title, fit = 'cover' }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (!images || images.length === 0) {
    return (
      <div className="h-full w-full bg-gray-200 flex items-center justify-center min-h-[200px]">
        <span className="text-gray-400">Sin imágenes</span>
      </div>
    )
  }

  return (
    <div className="relative group h-full w-full">
      <div className="overflow-hidden bg-gray-100 h-full" ref={emblaRef}>
        <div className="flex touch-pan-y h-full">
          {images.map((src, index) => (
            <div className="relative flex-[0_0_100%] min-w-0 h-full" key={index}>
              <div className="relative h-full w-full">
                <Image
                  src={src}
                  alt={`${title} - imagen ${index + 1}`}
                  fill
                  // AQUI ESTA EL CAMBIO: Usamos la prop 'fit'
                  className={fit === 'contain' ? "object-contain" : "object-cover"}
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button onClick={scrollPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">←</button>
          <button onClick={scrollNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">→</button>
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded z-10 font-mono">
             {selectedIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}