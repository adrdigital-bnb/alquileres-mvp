"use client"; 

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useRef } from "react";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  // Función centralizada para actualizar la URL con ambos parámetros
  const handleUpdateUrl = (term: string, guests: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    // Solo agregamos el parámetro si es mayor a 0
    if (guests && guests !== "0") {
      params.set("guests", guests);
    } else {
      params.delete("guests");
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  // Manejador para el texto (con Debounce de 300ms)
  const onSearchChange = (term: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      const currentGuests = searchParams.get("guests") || "0";
      handleUpdateUrl(term, currentGuests);
    }, 300);
  };

  // Manejador para el selector de huéspedes (se actualiza al instante)
  const onGuestsChange = (guests: string) => {
    const currentTerm = searchParams.get("query") || "";
    handleUpdateUrl(currentTerm, guests);
  };

  return (
    <div className="flex flex-col md:flex-row items-center w-full max-w-3xl mx-auto mb-8 bg-white border border-gray-300 rounded-2xl md:rounded-full shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-transparent transition-all">
      
      {/* Input de Texto (Ubicación / Título) */}
      <div className="relative w-full md:w-3/5 flex items-center">
        <div className="absolute left-5 pointer-events-none">
          <span className="text-gray-400 text-lg">🔍</span>
        </div>
        <input
          type="text"
          className="w-full pl-12 pr-4 py-3.5 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none sm:text-sm font-medium"
          placeholder="¿A dónde vas? (Ej: Mendoza, Centro...)"
          onChange={(e) => onSearchChange(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>

      {/* Separador Visual (Solo en Desktop) */}
      <div className="hidden md:block w-px h-8 bg-gray-300"></div>
      <div className="md:hidden w-full h-px bg-gray-200"></div>

      {/* Selector de Huéspedes */}
      <div className="relative w-full md:w-2/5 flex items-center bg-gray-50 md:bg-transparent">
        <div className="absolute left-5 pointer-events-none z-10">
          <span className="text-gray-400 text-lg">👥</span>
        </div>
        <select
          className="w-full pl-12 pr-10 py-3.5 bg-transparent text-gray-700 focus:outline-none sm:text-sm font-medium appearance-none cursor-pointer relative z-0"
          onChange={(e) => onGuestsChange(e.target.value)}
          defaultValue={searchParams.get("guests")?.toString() || "0"}
        >
          <option value="0">Cualquier cantidad</option>
          <option value="1">1 persona</option>
          <option value="2">2 personas</option>
          <option value="3">3 personas</option>
          <option value="4">4 personas</option>
          <option value="5">5 personas</option>
          <option value="6">6+ personas</option>
        </select>
        {/* Flechita del select nativo */}
        <div className="absolute right-5 pointer-events-none">
          <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
    </div>
  );
}