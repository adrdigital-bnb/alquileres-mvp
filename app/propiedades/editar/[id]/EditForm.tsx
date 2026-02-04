"use client";

import { updateProperty } from "@/app/actions";
import { CldUploadWidget } from 'next-cloudinary';
import Link from "next/link";
import { useState } from "react";

const AVAILABLE_AMENITIES = [
  { id: "wifi", label: "Wifi" },
  { id: "ac", label: "Aire Acondicionado" },
  { id: "tv", label: "TV / Cable" },
  { id: "kitchen", label: "Cocina Equipada" },
  { id: "pool", label: "Piscina" },
  { id: "parking", label: "Estacionamiento" },
  { id: "pets", label: "Apto Mascotas" },
  { id: "washer", label: "Lavarropas" }
];

export default function EditForm({ property }: { property: any }) {
  // Inicializamos el estado con las fotos que YA tiene la propiedad
  const [uploadedImages, setUploadedImages] = useState<string[]>(property.images || []);

  const handleUploadSuccess = (result: any) => {
    if (result.info && result.info.secure_url) {
      console.log("✅ Foto nueva:", result.info.secure_url);
      setUploadedImages((prev) => [...prev, result.info.secure_url]);
    }
  };

  // Función para borrar una foto de la lista visual (no de Cloudinary, solo del formulario)
  const removeImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Limpieza de amenities (igual que antes)
  let currentAmenities: string[] = [];
  if (Array.isArray(property.amenities)) {
    currentAmenities = property.amenities.map((item: any) => 
      (typeof item === "object" && item.id) ? item.id : String(item)
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">✏️ Editar Propiedad</h1>
        <Link href={`/propiedad/${property.slug}`} className="text-gray-500 hover:text-gray-700 text-sm">
          Cancelar
        </Link>
      </div>

      <form action={updateProperty} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={property.id} />
        <input type="hidden" name="slug" value={property.slug || ""} />

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input name="title" type="text" defaultValue={property.title} className="w-full p-2 border border-gray-300 rounded text-black font-medium" />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <input name="price" type="number" defaultValue={property.price_per_night} className="w-full p-2 border border-gray-300 rounded text-black font-medium" />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea name="description" rows={3} defaultValue={property.description || ""} className="w-full p-2 border border-gray-300 rounded text-black font-medium" />
        </div>

        {/* Amenities */}
        <div className="border-t border-b py-4 my-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Comodidades</label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_AMENITIES.map((item) => (
              <label key={item.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="amenities"
                  value={item.id}
                  defaultChecked={currentAmenities.includes(item.id)}
                  className="rounded text-blue-600 h-4 w-4"
                />
                <span className="text-gray-700 text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* --- SECCIÓN FOTOS MEJORADA --- */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Galería de Fotos</h3>
            
            {/* Botón de Subir */}
            <CldUploadWidget 
                uploadPreset="alquileres_cloud" 
                onSuccess={handleUploadSuccess}
            >
                {({ open }) => (
                    <button 
                        type="button" 
                        onClick={() => open()}
                        className="bg-gray-800 text-white px-4 py-2 rounded text-sm w-full mb-4 hover:bg-gray-700 transition"
                    >
                        📸 Agregar Nueva Foto
                    </button>
                )}
            </CldUploadWidget>

            {/* Lista de fotos */}
            <div className="grid grid-cols-3 gap-2 mb-2">
                {uploadedImages.map((url, index) => (
                    <div key={index} className="relative group aspect-square">
                        <img src={url} className="w-full h-full object-cover rounded border" />
                        {/* Botón X para borrar visualmente */}
                        <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
            
            {/* INPUTS OCULTOS (Esto es lo que se envía a la DB) */}
            <input type="hidden" name="imagen1" value={uploadedImages[0] || ""} />
            <input type="hidden" name="imagen2" value={uploadedImages[1] || ""} />
            <input type="hidden" name="imagen3" value={uploadedImages[2] || ""} />
        </div>

        <button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-all shadow-md">
          Guardar Cambios 💾
        </button>
      </form>
    </div>
  );
}