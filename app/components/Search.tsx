'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Función que actualiza la URL cuando escribes
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    // Actualiza la URL sin recargar la página (ej: /?query=palermo)
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0 w-full max-w-md mx-auto mb-8">
      <label htmlFor="search" className="sr-only">
        Buscar
      </label>
      
      {/* INPUT CORREGIDO: Fondo blanco y letra oscura */}
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 text-gray-900 bg-white font-medium shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        placeholder="🔍 Buscar por ubicación o título..."
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}