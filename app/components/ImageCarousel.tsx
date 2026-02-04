"use client";

import { useState, useEffect } from "react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Lógica para cambiar la foto automáticamente
  useEffect(() => {
    // Si no hay imágenes o solo hay una, no hacemos nada
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Si llegamos al final, volvemos a la 0 (loop infinito)
        return (prevIndex + 1) % images.length;
      });
    }, 3000); // 👈 Cambia la foto cada 3000ms (3 segundos)

    // Limpieza: detener el reloj si el usuario sale de la página
    return () => clearInterval(interval);
  }, [images]);

  // Si no hay imágenes, mostramos un placeholder gris
  if (!images || images.length === 0) {
    return <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">Sin foto</div>;
  }

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-gray-100">
      {/* Imagen actual */}
      <img
        src={images[currentIndex]}
        alt={alt}
        className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
      />
      
      {/* (Opcional) Indicador de cuántas fotos hay: puntitos abajo */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 rounded-full shadow-sm ${
                idx === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}