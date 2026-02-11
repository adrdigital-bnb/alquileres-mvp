"use client"; // Es un componente que interactúa con el usuario

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Función que actualiza la URL cuando escribes
  // Ejemplo: Si escribes "Pinamar", la URL cambia a "/?query=Pinamar"
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    
    // Actualizamos la URL sin recargar toda la página
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto mb-8">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {/* Icono de Lupa */}
        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 sm:text-sm shadow-sm transition"
        placeholder="¿A dónde quieres ir? (Ej: Pinamar, Centro...)"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
}