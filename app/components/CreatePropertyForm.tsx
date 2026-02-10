"use client";

import { createProperty } from '@/app/actions'; 
import ImageUpload from '@/app/components/ImageUpload'; // Tu componente del widget
import { useState } from 'react';
import Link from 'next/link';

export default function CreatePropertyForm() {
  // Estados para guardar las URLs de las imágenes y mostrarlas
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");

  return (
    <div className="max-w-3xl mx-auto">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Publicar tu espacio</h1>
                <p className="mt-2 text-gray-600">Completa la información para que los huéspedes encuentren tu propiedad.</p>
            </div>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 font-medium bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm transition">
                ← Cancelar
            </Link>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <form action={createProperty} className="p-8 space-y-8">
            
            {/* SECCIÓN 1: DETALLES */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">📍 Información Principal</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Título del anuncio</label>
                        <input type="text" name="title" required placeholder="Ej: Cabaña rústica" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 outline-none transition bg-white" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Slug</label>
                        <input type="text" name="slug" placeholder="ej: cabana-lago-01" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-gray-50 outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Precio (ARS)</label>
                        <input type="number" name="price" required step="0.01" placeholder="0.00" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 outline-none transition bg-white" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Dirección</label>
                        <input type="text" name="address" required placeholder="Calle, Número, Ciudad" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 outline-none bg-white" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                        <textarea name="description" rows={5} placeholder="Describe tu lugar..." 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 outline-none bg-white"></textarea>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2: IMÁGENES (CON EL WIDGET REAL) */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">📸 Galería de Fotos</h2>
                <p className="text-sm text-gray-500 mb-4">Sube tus fotos usando el botón.</p>
                
                <div className="space-y-4">
                    {/* FOTO 1 (Principal) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Foto Principal (Portada)</label>
                        <div className="h-[200px]">
                            <ImageUpload value={img1} onChange={(url) => setImg1(url)} />
                        </div>
                        {/* INPUT OCULTO: Esto es lo que viaja al servidor */}
                        <input type="hidden" name="imagen1" value={img1} />
                    </div>
                    
                    {/* FOTOS SECUNDARIAS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Foto 2 (Opcional)</label>
                            <div className="h-[150px]">
                                <ImageUpload value={img2} onChange={(url) => setImg2(url)} />
                            </div>
                            <input type="hidden" name="imagen2" value={img2} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Foto 3 (Opcional)</label>
                            <div className="h-[150px]">
                                <ImageUpload value={img3} onChange={(url) => setImg3(url)} />
                            </div>
                            <input type="hidden" name="imagen3" value={img3} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 3: AMENITIES */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">✨ Comodidades</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Wifi', 'Piscina', 'Aire Acondicionado', 'Cocina', 'Estacionamiento', 'TV', 'Lavadora', 'Mascotas'].map((item) => (
                        <label key={item} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer bg-white">
                            <input type="checkbox" name="amenities" value={item} className="w-5 h-5 text-rose-500 rounded" />
                            <span className="text-gray-700 font-medium">{item}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t">
                <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg text-lg transition">
                    🚀 Publicar Propiedad
                </button>
            </div>
          </form>
        </div>
    </div>
  );
}