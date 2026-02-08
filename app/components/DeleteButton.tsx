'use client'; 

import { deleteProperty } from '@/app/actions';

export default function DeleteButton({ propertyId }: { propertyId: string }) {
  return (
    <form action={deleteProperty} onSubmit={(e) => {
      if (!confirm('¿Seguro que quieres borrar esta propiedad?')) {
        e.preventDefault();
      }
    }}>
      {/* Input invisible que lleva el ID al servidor */}
      <input type="hidden" name="propertyId" value={propertyId} />
      
      <button 
        type="submit" 
        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded text-sm font-medium transition-colors border border-transparent hover:border-red-200"
      >
        🗑️ Borrar
      </button>
    </form>
  );
}