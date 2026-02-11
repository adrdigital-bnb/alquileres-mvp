"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { createProperty } from "@/app/actions";
import Link from "next/link";

export default function CreatePropertyPage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Manejo del envío
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.set("images", images.join(","));

    try {
        await createProperty(formData);
    } catch (error) {
        console.error("Error al crear:", error);
        alert("Hubo un error al crear la propiedad. Revisa los datos.");
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Publicar tu espacio</h1>
                <p className="mt-2 text-gray-600">Completa la información para que los huéspedes te encuentren.</p>
            </div>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 font-medium bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm transition">
                ← Cancelar
            </Link>
        </div>

        {/* TARJETA DEL FORMULARIO */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* SECCIÓN 1: DETALLES BÁSICOS */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">📍 Información Principal</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Título del anuncio</label>
                        <input 
                            type="text" 
                            name="title" 
                            required 
                            placeholder="Ej: Cabaña rústica con vista al lago" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition bg-white text-gray-900 placeholder-gray-400" 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Ciudad</label>
                        <input 
                            type="text" 
                            name="city" 
                            placeholder="Ej: Mar del Plata" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition bg-white text-gray-900 placeholder-gray-400" 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Precio por noche (ARS)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <input 
                                type="number" 
                                name="price" 
                                required 
                                step="0.01" 
                                placeholder="0.00" 
                                className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition bg-white text-gray-900 placeholder-gray-400" 
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Dirección completa</label>
                        <input 
                            type="text" 
                            name="address" 
                            required 
                            placeholder="Calle, Número, Barrio" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition bg-white text-gray-900 placeholder-gray-400" 
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                        <textarea 
                            name="description" 
                            rows={5} 
                            placeholder="Describe lo que hace especial a este lugar..." 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition bg-white text-gray-900 placeholder-gray-400"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2: IMÁGENES (CON CLOUDINARY) */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">📸 Galería de Fotos</h2>
                
                <div className="space-y-4">
                    <CldUploadWidget
                        uploadPreset="alquileres_cloud" // ⚠️ Chequea que coincida con tu preset
                        onSuccess={(result: any) => {
                            setImages((prev) => [...prev, result.info.secure_url]);
                        }}
                        options={{ maxFiles: 5, sources: ['local', 'camera', 'url'] }}
                    >
                        {({ open }) => (
                            <button
                                type="button"
                                onClick={() => open()}
                                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition w-full justify-center border border-dashed border-gray-400"
                            >
                                📷 Subir Fotos (Cámara o Galería)
                            </button>
                        )}
                    </CldUploadWidget>

                    {/* Previsualización */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {images.map((url, index) => (
                                <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                    <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {images.length === 0 && (
                        <p className="text-sm text-gray-400 italic text-center">No has subido fotos todavía.</p>
                    )}
                </div>
            </div>

            {/* SECCIÓN 3: AMENITIES */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">✨ Comodidades</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Wifi', 'Piscina', 'Aire Acondicionado', 'Cocina', 'Estacionamiento', 'TV', 'Lavadora', 'Mascotas'].map((item) => (
                        <label key={item} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition bg-white">
                            <input type="checkbox" name="amenities" value={item} className="w-5 h-5 text-rose-500 border-gray-300 rounded focus:ring-rose-500" />
                            <span className="text-gray-700 font-medium">{item}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* BOTÓN FINAL */}
            <div className="pt-6 border-t">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Publicando..." : "🚀 Publicar Propiedad"}
                </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}