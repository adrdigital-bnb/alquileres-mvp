"use client";

import { createProperty } from '@/app/actions';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';

export default function CreatePropertyPage() {
  // Estado para guardar las URLs de las fotos subidas
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Función que se ejecuta cuando Cloudinary termina de subir una foto
  const handleUploadSuccess = (result: any) => {
    // Verificamos que la carga fue exitosa y tenemos una URL segura
    if (result.info && result.info.secure_url) {
        console.log("✅ Foto subida con éxito:", result.info.secure_url);
        setUploadedImages((prev) => [...prev, result.info.secure_url]);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-gray-900">
      
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
        Publicar Propiedad
      </h1>

      <form action={createProperty} className="space-y-4">
        
        {/* Título */}
        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700">Título del anuncio</label>
          <input
            name="title"
            type="text"
            required
            placeholder="Ej: Cabaña en el bosque"
            className="w-full border border-gray-300 rounded p-2 text-gray-900 placeholder:text-gray-500 bg-white"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700">Slug (URL única)</label>
          <input
            name="slug"
            type="text"
            required
            placeholder="ej: cabana-bosque-99"
            className="w-full border border-gray-300 rounded p-2 text-gray-900 placeholder:text-gray-500 bg-white"
          />
          <p className="text-xs text-red-500 mt-1">* Debe ser único (sin espacios, usa guiones)</p>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700">Descripción</label>
          <textarea
            name="description"
            required
            placeholder="Descripción detallada..."
            className="w-full border border-gray-300 rounded p-2 h-24 text-gray-900 placeholder:text-gray-500 bg-white"
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700">Precio por noche (USD)</label>
          <input
            name="price"
            type="number"
            required
            placeholder="100"
            className="w-full border border-gray-300 rounded p-2 text-gray-900 placeholder:text-gray-500 bg-white"
          />
        </div>

        {/* --- SECCIÓN: AMENITIES --- */}
        <div className="space-y-4 border-t border-gray-200 pt-4 mt-6 bg-blue-50 p-4 rounded-md border border-blue-100">
           <h3 className="text-lg font-medium text-gray-900">Comodidades</h3>
           <div className="grid grid-cols-2 gap-3">
             <label className="flex items-center space-x-2 cursor-pointer">
               <input type="checkbox" name="amenities" value="wifi" className="w-4 h-4 text-blue-600 rounded" />
               <span className="text-gray-700 text-sm">📶 Wifi</span>
             </label>
             <label className="flex items-center space-x-2 cursor-pointer">
               <input type="checkbox" name="amenities" value="piscina" className="w-4 h-4 text-blue-600 rounded" />
               <span className="text-gray-700 text-sm">🏊 Piscina</span>
             </label>
             <label className="flex items-center space-x-2 cursor-pointer">
               <input type="checkbox" name="amenities" value="aire" className="w-4 h-4 text-blue-600 rounded" />
               <span className="text-gray-700 text-sm">❄️ Aire Acond.</span>
             </label>
             <label className="flex items-center space-x-2 cursor-pointer">
               <input type="checkbox" name="amenities" value="mascotas" className="w-4 h-4 text-blue-600 rounded" />
               <span className="text-gray-700 text-sm">🐶 Mascotas</span>
             </label>
             <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="amenities" value="parking" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-gray-700 text-sm">🚗 Parking</span>
             </label>
             <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="amenities" value="gym" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-gray-700 text-sm">🏋️ Gimnasio</span>
             </label>
           </div>
        </div>

        {/* --- SECCIÓN: IMÁGENES CLOUDINARY --- */}
        <div className="space-y-4 border-t border-gray-200 pt-4 mt-6 bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900">Galería de Fotos</h3>
          <p className="text-xs text-gray-600 mb-2">
            Las fotos se guardan en la nube automáticamente.
          </p>
          
          {/* Widget de Cloudinary */}
          <CldUploadWidget 
            uploadPreset="alquileres_cloud" 
            onSuccess={handleUploadSuccess}
          >
            {({ open }) => {
              return (
                <button 
                  type="button" 
                  onClick={() => open()}
                  className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 transition w-full mb-4"
                >
                  📸 Subir Nueva Foto
                </button>
              );
            }}
          </CldUploadWidget>

          {/* Previsualización */}
          <div className="grid grid-cols-3 gap-2">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <img src={url} alt="Uploaded" className="object-cover w-full h-full rounded border border-gray-300" />
              </div>
            ))}
          </div>

          {/* Inputs ocultos (Esenciales para enviar datos a la BD) */}
          <input type="hidden" name="imagen1" value={uploadedImages[0] || ""} />
          <input type="hidden" name="imagen2" value={uploadedImages[1] || ""} />
          <input type="hidden" name="imagen3" value={uploadedImages[2] || ""} />
          
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition mt-6"
        >
          Guardar Propiedad
        </button>
      </form>
    </div>
  );
}