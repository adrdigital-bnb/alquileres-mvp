import { prisma } from "@/lib/prisma";
import { updateProperty } from "@/app/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

// 1. Definimos las opciones disponibles manualmente
// (Ya que no existen en una tabla de BD)
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

export default async function EditarPropiedadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 2. Buscamos la propiedad (SIN include, porque amenities es una columna normal aquí)
  const property = await prisma.properties.findUnique({
    where: { id: id },
  });

  if (!property) {
    redirect("/");
  }

  // 3. Convertimos el JSON de la BD a un array de strings usable
  // Si es null, usamos un array vacío. Forzamos el tipo a string[]
  const currentAmenities = (property.amenities as string[]) || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
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

          {/* ... Inputs de Título, Dirección, Precio, Descripción ... */}
          {/* (Pégalos tal cual los tenías antes, no cambian) */}
          
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input name="title" defaultValue={property.title} className="w-full p-2 border border-gray-300 rounded text-black" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input name="price" defaultValue={property.price_per_night.toString()} className="w-full p-2 border border-gray-300 rounded text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
             <textarea name="description" defaultValue={property.description || ""} className="w-full p-2 border border-gray-300 rounded text-black" />
          </div>


          {/* 🔥 SECCIÓN DE COMODIDADES CORREGIDA (JSON) 🔥 */}
          <div className="border-t border-b py-4 my-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comodidades</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_AMENITIES.map((item) => (
                <label key={item.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="amenities"
                    value={item.id}
                    // Verificamos si el array del JSON incluye este ID
                    defaultChecked={currentAmenities.includes(item.id)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-gray-700 text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen</label>
            <input name="imagen1" defaultValue={property.images[0] || ""} className="w-full p-2 border border-gray-300 rounded text-black" />
          </div>

          <button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded">
            Guardar Cambios 💾
          </button>

        </form>
      </div>
    </div>
  );
}