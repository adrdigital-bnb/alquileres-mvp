import { createProperty } from '@/app/actions'; 
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/app/components/ImageUpload'; // Asegúrate de importar esto si ya lo usas, si no, usa el input normal

export default async function CreatePropertyPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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

        {/* TARJETA DEL FORMULARIO */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <form action={createProperty} className="p-8 space-y-8">
            
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
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition bg-white" 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL única)</label>
                        <input 
                            type="text" 
                            name="slug" 
                            placeholder="ej: cabana-lago-01" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-rose-500" 
                        />
                        <p className="text-xs text-gray-500 mt-1">Sin espacios, usa guiones.</p>
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
                                className="w-full pl-8 p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 outline-none transition bg-white" 
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Dirección completa</label>
                        <input 
                            type="text" 
                            name="address" 
                            required 
                            placeholder="Calle, Número, Ciudad" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 outline-none transition bg-white" 
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                        <textarea 
                            name="description" 
                            rows={5} 
                            placeholder="Describe lo que hace especial a este lugar..." 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 outline-none transition bg-white"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2: IMÁGENES */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">📸 Galería de Fotos</h2>
                <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-800">
                    💡 <strong>Tip:</strong> Pega las URLs de tus imágenes por ahora.
                </p>
                
                <div className="space-y-3">
                    <input 
                        type="url" 
                        name="imagen1" 
                        required 
                        placeholder="URL de la Foto Principal (Portada)" 
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 outline-none bg-white" 
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="url" 
                            name="imagen2" 
                            placeholder="URL Foto 2 (Opcional)" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 outline-none bg-white" 
                        />
                        <input 
                            type="url" 
                            name="imagen3" 
                            placeholder="URL Foto 3 (Opcional)" 
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 outline-none bg-white" 
                        />
                    </div>
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
                <button type="submit" 
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg">
                    🚀 Publicar Propiedad
                </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}