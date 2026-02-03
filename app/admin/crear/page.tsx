import { createProperty } from '@/app/actions';

export default function CreatePropertyPage() {
  return (
    // Fondo blanco con texto OSCURO para máxima legibilidad
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

        {/* --- NUEVA SECCIÓN: AMENITIES (Checkboxes) --- */}
        <div className="space-y-4 border-t border-gray-200 pt-4 mt-6 bg-blue-50 p-4 rounded-md border border-blue-100">
           <h3 className="text-lg font-medium text-gray-900">Comodidades</h3>
           <p className="text-xs text-gray-600 mb-2">Selecciona todo lo que incluye:</p>
           
           <div className="grid grid-cols-2 gap-3">
              {/* Opción 1: Wifi */}
              <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-white rounded transition">
                <input type="checkbox" name="amenities" value="wifi" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                <span className="text-gray-700 text-sm">📶 Wifi</span>
              </label>

              {/* Opción 2: Piscina */}
              <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-white rounded transition">
                <input type="checkbox" name="amenities" value="piscina" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                <span className="text-gray-700 text-sm">🏊 Piscina</span>
              </label>

              {/* Opción 3: Aire Acondicionado */}
              <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-white rounded transition">
                <input type="checkbox" name="amenities" value="aire" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                <span className="text-gray-700 text-sm">❄️ Aire Acond.</span>
              </label>

              {/* Opción 4: Pet Friendly */}
              <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-white rounded transition">
                <input type="checkbox" name="amenities" value="mascotas" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                <span className="text-gray-700 text-sm">🐶 Mascotas</span>
              </label>

               {/* Opción 5: Estacionamiento */}
               <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-white rounded transition">
                <input type="checkbox" name="amenities" value="parking" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                <span className="text-gray-700 text-sm">🚗 Parking</span>
              </label>

               {/* Opción 6: Gimnasio */}
               <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-white rounded transition">
                <input type="checkbox" name="amenities" value="gym" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                <span className="text-gray-700 text-sm">🏋️ Gimnasio</span>
              </label>
           </div>
        </div>

        {/* Imágenes */}
        <div className="space-y-4 border-t border-gray-200 pt-4 mt-6 bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900">Galería de Fotos</h3>
          <p className="text-xs text-gray-600 mb-2">
            Pega aquí las URLs de las fotos.
          </p>
          
          <div className="space-y-3">
            <input
              type="url"
              name="imagen1"
              placeholder="URL Foto Principal"
              className="w-full border border-gray-300 rounded p-2 text-sm text-gray-900 placeholder:text-gray-500 bg-white"
              required 
            />
            <input
              type="url"
              name="imagen2"
              placeholder="URL Foto 2 (Opcional)"
              className="w-full border border-gray-300 rounded p-2 text-sm text-gray-900 placeholder:text-gray-500 bg-white"
            />
            <input
              type="url"
              name="imagen3"
              placeholder="URL Foto 3 (Opcional)"
              className="w-full border border-gray-300 rounded p-2 text-sm text-gray-900 placeholder:text-gray-500 bg-white"
            />
          </div>
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