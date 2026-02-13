"use client";

import { createProperty } from '@/app/actions'; 
import ImageUpload from '@/app/components/UploadWidget'; 
import { useState } from 'react';
import Link from 'next/link';

export default function CreatePropertyForm() {
  // Estados para guardar las URLs de las imágenes
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");

  // Lista de comodidades (Values en minúscula para coincidir con la BD)
  const amenitiesOptions = [
    { label: 'Wifi', value: 'wifi' },
    { label: 'Piscina', value: 'piscina' },
    { label: 'Aire Acondicionado', value: 'aire_acondicionado' },
    { label: 'Cocina', value: 'cocina' },
    { label: 'Estacionamiento', value: 'estacionamiento' },
    { label: 'TV', value: 'tv' },
    { label: 'Lavadora', value: 'lavadora' },
    { label: 'Mascotas', value: 'mascotas' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
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

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <form action={createProperty} className="p-8 space-y-8">
            
            {/* SECCIÓN 1: DETALLES GENERALES */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">📝 Información Principal</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Título del anuncio</label>
                        <input type="text" name="title" required placeholder="Ej: Cabaña rústica con vista al lago" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 outline-none transition" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL amigable)</label>
                        <input type="text" name="slug" placeholder="ej: cabana-lago-bariloche" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 outline-none" />
                        <p className="text-xs text-gray-400 mt-1">Déjalo vacío para generar uno automático.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Precio por noche (ARS)</label>
                        <input type="number" name="price" required step="0.01" placeholder="0.00" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 outline-none transition" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                        <textarea name="description" rows={4} placeholder="Describe lo que hace especial a este lugar..." 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 outline-none"></textarea>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2: UBICACIÓN (Clave para el Mapa) */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">📍 Ubicación</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                         <label className="block text-sm font-bold text-gray-700 mb-1">Dirección exacta</label>
                         <input type="text" name="address" required placeholder="Ej: Av. Libertador 2400" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-rose-500 outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Ciudad / Localidad</label>
                        <input type="text" name="city" required placeholder="Ej: Palermo" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-rose-500 outline-none" />
                    </div>

                    <div>
                        {/* ESTE ES EL CAMPO QUE FALTABA ANTES */}
                        <label className="block text-sm font-bold text-gray-700 mb-1">Provincia</label>
                        <input type="text" name="province" required placeholder="Ej: Buenos Aires" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-rose-500 outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Código Postal</label>
                        <input type="text" name="zip_code" placeholder="Ej: 1425" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-rose-500 outline-none" />
                    </div>
                </div>
            </div>

            {/* SECCIÓN 3: IMÁGENES */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">📸 Galería de Fotos</h2>
                
                <div className="space-y-4">
                    {/* FOTO 1 (Principal) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Foto Principal (Portada)</label>
                        <div className="h-[200px] border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition">
                            <ImageUpload value={img1} onChange={(url) => setImg1(url)} />
                        </div>
                        <input type="hidden" name="imagen1" value={img1} />
                    </div>
                    
                    {/* FOTOS SECUNDARIAS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Foto 2</label>
                            <div className="h-[150px] border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                <ImageUpload value={img2} onChange={(url) => setImg2(url)} />
                            </div>
                            <input type="hidden" name="imagen2" value={img2} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Foto 3</label>
                            <div className="h-[150px] border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                <ImageUpload value={img3} onChange={(url) => setImg3(url)} />
                            </div>
                            <input type="hidden" name="imagen3" value={img3} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 4: AMENITIES */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">✨ Comodidades</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {amenitiesOptions.map((item) => (
                        <label key={item.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                            <input type="checkbox" name="amenities" value={item.value} className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500" />
                            <span className="text-gray-700 text-sm font-medium">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t">
                <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg text-lg transition transform hover:scale-[1.01] active:scale-[0.99]">
                    🚀 Publicar Propiedad
                </button>
            </div>
          </form>
        </div>
    </div>
  );
}