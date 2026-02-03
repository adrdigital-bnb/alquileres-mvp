'use client'; // 👈 Esto habilita los clicks

import { deleteProperty } from "@/app/actions";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deleteProperty} className="mt-4 pt-2 flex justify-end">
      <input type="hidden" name="propertyId" value={id} />
      <button 
         type="submit"
         className="text-red-400 text-xs hover:text-red-600 hover:underline transition-colors"
         onClick={(e) => {
           // Ahora sí podemos usar confirm porque estamos en un Client Component
           if(!confirm("¿Estás seguro de borrar esta propiedad?")) {
             e.preventDefault();
           }
         }}
      >
        Borrar 🗑️
      </button>
    </form>
  );
}