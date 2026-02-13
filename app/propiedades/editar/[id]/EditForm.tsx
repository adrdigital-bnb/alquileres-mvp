"use client";

import { updateProperty } from "@/app/actions";
import { CldUploadWidget } from 'next-cloudinary';
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";

// 🌍 CORRECCIÓN DE RUTA: Subimos 4 niveles para encontrar 'components'
// app -> propiedades -> editar -> [id] -> (estamos aquí)
// ../../../../components/LocationMap
const LocationMap = dynamic(() => import("../../../components/LocationMap"), { 
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded flex items-center justify-center">Cargando Mapa...</div>
});

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
  const [uploadedImages, setUploadedImages] = useState<string[]>(property.images || []);
  
  // 📍 ESTADO PARA EL MAPA
  // Convertimos a Number por seguridad, manejando nulls
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(
    property.latitude && property.longitude 
      ? { lat: Number(property.latitude), lng: Number(property.longitude) } 
      : null
  );

  const handleUploadSuccess = (result: any) => {
    if (result.info && result.info.secure_url) {
      setUploadedImages((prev) => [...prev, result.info.secure_url]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setCoords({ lat, lng });
    console.log("📍 Nueva ubicación:", lat, lng);
  };

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

        {/* 📍 INPUTS OCULTOS */}
        <input type="hidden" name="latitude" value={coords?.lat || ""} />
        <input type="hidden" name="longitude" value={coords?.lng || ""} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input name="title" type="text" defaultValue={property.title} className="w-full p-2 border border-gray-300 rounded text-black font-medium" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio por noche</label>
          <input name="price" type="number" defaultValue={property.price_per_night} className="w-full p-2 border border-gray-300 rounded text-black font-medium" />
        </div>

        {/* 🟢 GRILLA DE UBICACIÓN ACTUALIZADA */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input name="city" type="text" defaultValue={property.city || ""} placeholder="Ej: Mar del Plata" className="w-full p-2 border border-gray-300 rounded text-black font-medium" />
          </div>
          <div>
            {/* 🟢 CAMPO NUEVO: PROVINCIA */}
            <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
            <input name="province" type="text" defaultValue={property.province || ""} placeholder="Ej: Buenos Aires" className="w-full p-2 border border-gray-300 rounded text-black font-medium" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
             <input name="address" type="text" defaultValue={property.address || ""} placeholder="Calle y Nro" className="w-full p-2 border border-gray-300 rounded text-black font-medium" />
          </div>
          <div>
            {/* 🟢 CAMPO NUEVO: CÓDIGO POSTAL */}
             <label className="block text-sm font-medium text-gray-700 mb-1">C. Postal</label>
             <input name="zip_code" type="text" defaultValue={property.zip_code || ""} placeholder="Ej: 7600" className="w-full p-2 border border-gray-300 rounded text-black font-medium" />
          </div>
        </div>

        {/* 🗺️ SECCIÓN MAPA */}
        <div className="my-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación en el Mapa</label>
            <LocationMap 
                lat={coords?.lat} 
                lng={coords?.lng} 
                onLocationSelect={handleLocationSelect} 
            />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea name="description" rows={3} defaultValue={property.description || ""} className="w-full p-2 border border-gray-300 rounded text-black font-medium" />
        </div>

        <div className="border-t border-b py-4 my-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Comodidades</label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_AMENITIES.map((item) => (
              <label key={item.id} className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="amenities" value={item.id} defaultChecked={currentAmenities.includes(item.id)} className="rounded text-blue-600 h-4 w-4" />
                <span className="text-gray-700 text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SECCIÓN FOTOS */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Galería de Fotos</h3>
            <CldUploadWidget uploadPreset="alquileres_cloud" onSuccess={handleUploadSuccess}>
                {({ open }) => (
                    <button type="button" onClick={() => open()} className="bg-gray-800 text-white px-4 py-2 rounded text-sm w-full mb-4 hover:bg-gray-700 transition">📸 Agregar Nueva Foto</button>
                )}
            </CldUploadWidget>

            <div className="grid grid-cols-3 gap-2 mb-2">
                {uploadedImages.map((url, index) => (
                    <div key={index} className="relative group aspect-square">
                        <img src={url} alt={`Foto ${index}`} className="w-full h-full object-cover rounded border" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
                    </div>
                ))}
            </div>
            <input type="hidden" name="imagesJSON" value={JSON.stringify(uploadedImages)} />
        </div>

        <button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-all shadow-md">
          Guardar Cambios 💾
        </button>
      </form>
    </div>
  );
}