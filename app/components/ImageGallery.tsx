"use client";

import { useState } from "react";

export default function ImageGallery({ images }: { images: string[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Si no hay imágenes, no mostramos el componente
  if (!images || images.length === 0) return null;

  // Funciones para el Modal
  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const nextImage = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  // Tomamos las primeras 5 imágenes para la grilla
  const displayImages = images.slice(0, 5);

  return (
    <>
      {/* 1. LA GRILLA ESTILO AIRBNB (Igual a tu captura) */}
      <div className="relative w-full h-[300px] md:h-[450px] flex gap-2">
        
        {/* CASO A: Tiene 5 fotos o más (El diseño ideal de tu captura) */}
        {displayImages.length >= 5 && (
          <>
            {/* Foto Principal (Izquierda) */}
            <div 
              className="w-full md:w-1/2 h-full relative rounded-l-xl overflow-hidden cursor-pointer group"
              onClick={() => openModal(0)}
            >
              <img src={displayImages[0]} alt="Principal" className="w-full h-full object-cover group-hover:brightness-90 transition duration-200" />
            </div>
            
            {/* Grilla de 4 fotos (Derecha) */}
            <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 w-1/2 h-full">
              <div className="relative overflow-hidden cursor-pointer group" onClick={() => openModal(1)}>
                <img src={displayImages[1]} className="w-full h-full object-cover group-hover:brightness-90 transition duration-200" alt="Foto 2" />
              </div>
              <div className="relative overflow-hidden rounded-tr-xl cursor-pointer group" onClick={() => openModal(2)}>
                <img src={displayImages[2]} className="w-full h-full object-cover group-hover:brightness-90 transition duration-200" alt="Foto 3" />
              </div>
              <div className="relative overflow-hidden cursor-pointer group" onClick={() => openModal(3)}>
                <img src={displayImages[3]} className="w-full h-full object-cover group-hover:brightness-90 transition duration-200" alt="Foto 4" />
              </div>
              <div className="relative overflow-hidden rounded-br-xl cursor-pointer group" onClick={() => openModal(4)}>
                <img src={displayImages[4]} className="w-full h-full object-cover group-hover:brightness-90 transition duration-200" alt="Foto 5" />
              </div>
            </div>
          </>
        )}

        {/* CASO B: Tiene solo 1 foto */}
        {displayImages.length === 1 && (
          <div className="w-full h-full relative rounded-xl overflow-hidden cursor-pointer group" onClick={() => openModal(0)}>
            <img src={displayImages[0]} alt="Principal" className="w-full h-full object-cover group-hover:brightness-90 transition duration-200" />
          </div>
        )}

        {/* CASO C: Tiene entre 2 y 4 fotos (Se adapta fluido) */}
        {displayImages.length > 1 && displayImages.length < 5 && (
          <>
            <div className="w-1/2 h-full relative rounded-l-xl overflow-hidden cursor-pointer group" onClick={() => openModal(0)}>
              <img src={displayImages[0]} alt="Principal" className="w-full h-full object-cover group-hover:brightness-90 transition duration-200" />
            </div>
            <div className="w-1/2 h-full flex flex-col gap-2">
              {displayImages.slice(1).map((img, idx) => (
                <div 
                  key={idx} 
                  className={`relative flex-1 overflow-hidden cursor-pointer group ${idx === 0 ? 'rounded-tr-xl' : ''} ${idx === displayImages.length - 2 ? 'rounded-br-xl' : ''}`}
                  onClick={() => openModal(idx + 1)}
                >
                  <img src={img} className="w-full h-full object-cover group-hover:brightness-90 transition duration-200" alt={`Foto complementaria`} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Botón flotante "Mostrar todas las fotos" */}
        <button
          onClick={() => openModal(0)}
          className="absolute bottom-4 right-4 bg-white text-gray-900 border border-gray-900 px-4 py-1.5 rounded-lg font-semibold shadow-sm hover:bg-gray-50 transition flex items-center gap-2 text-sm z-10"
        >
          {/* Icono de cuadraditos estilo Airbnb */}
          <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" className="block h-4 w-4 fill-current">
            <path d="M3 1a2 2 0 0 0-2 2v2h4V1H3zm2 6H1v2h4V7zm0 4H1v2a2 2 0 0 0 2 2h2v-4zM7 1v4h4V1H7zm0 6v2h4V7H7zm0 4v4h4v-4H7zm6-10v4h4V3a2 2 0 0 0-2-2h-2zm0 6v2h4V7h-4zm0 4v4h2a2 2 0 0 0 2-2v-2h-4z"></path>
          </svg>
          Mostrar todas las fotos
        </button>
      </div>

      {/* 2. EL MODAL A PANTALLA COMPLETA (Carrusel que se abre al hacer clic) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm">
          {/* Botón Cerrar */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-white hover:bg-white/20 p-2 rounded-full transition"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Contador superior izquierdo */}
          <div className="absolute top-6 left-6 text-white font-medium text-lg">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Flecha Anterior */}
          <button
            onClick={prevImage}
            className="absolute left-4 md:left-10 text-white hover:bg-white/20 p-3 rounded-full transition"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Imagen Actual (Centrada y adaptada a la pantalla) */}
          <div className="w-full max-w-6xl h-[85vh] px-12 md:px-24 flex justify-center items-center">
            <img
              src={images[currentIndex]}
              alt={`Foto de la propiedad ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Flecha Siguiente */}
          <button
            onClick={nextImage}
            className="absolute right-4 md:right-10 text-white hover:bg-white/20 p-3 rounded-full transition"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}