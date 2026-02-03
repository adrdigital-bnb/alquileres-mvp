import { prisma } from "@/lib/prisma";
import { updateProperty } from "@/app/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

// 🚀 TRUCO 1: Forzamos a que esta página NUNCA use caché. 
// Siempre buscará los datos frescos de la BD.
export const dynamic = "force-dynamic";

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

  const property = await prisma.properties.findUnique({
    where: { id: id },
  });

  if (!property) {
    redirect("/");
  }

  // 🚀 TRUCO 2: Limpieza de datos "Blindada"
  // Esto arregla el problema si en la BD quedaron datos viejos con formato raro.
  let currentAmenities: string[] = [];
  
  if (Array.isArray(property.amenities)) {
    // Recorremos lo que haya en la base de datos
    currentAmenities = property.amenities.map((item: any) => {
      // Si por error se guardó como objeto { id: "wifi" }, sacamos el ID
      if (typeof item === "object" && item !== null && item.id) {
        return item.id;
      }
      // Si ya es texto "wifi", lo dejamos así
      return String(item);
    });
  }

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

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input name="title" type="text" defaultValue={property.title} className="w-full p-2 border border-gray-300 rounded text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio por noche (US$)</label>
            <input name="price" type="number" defaultValue={property.price_per_night.toString()} className="w-full p-2 border border-gray-300 rounded text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea name="description" rows={3} defaultValue={property.description || ""} className="w-full p-2 border border-gray-300 rounded text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {/* COMODIDADES */}
          <div className="border-t border-b py-4 my-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comodidades</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_AMENITIES.map((item) => (
                <label key={item.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="amenities"
                    value={item.id}
                    // Ahora comparamos contra la lista limpia
                    defaultChecked={currentAmenities.includes(item.id)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-gray-700 text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Imágenes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen Principal</label>
            <input name="imagen1" type="text" defaultValue={property.images[0] || ""} className="w-full p-2 border border-gray-300 rounded text-black font-medium text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-all shadow-md">
            Guardar Cambios 💾
          </button>

        </form>
      </div>
    </div>
  );
}