// app/components/BotonCancelarReserva.tsx
"use client";

import { useTransition } from "react";
import { cancelarReserva } from "@/app/actions/cancelarReserva";

export default function BotonCancelarReserva({ reservaId }: { reservaId: string }) {
  // useTransition nos permite manejar estados de carga en Server Actions
  const [isPending, startTransition] = useTransition();

  const manejarCancelacion = () => {
    // Pequeña alerta nativa para evitar cancelaciones por accidente
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas cancelar esta reserva? Esta acción liberará las fechas y no se puede deshacer."
    );

    if (confirmar) {
      startTransition(async () => {
        try {
          await cancelarReserva(reservaId);
          alert("Tu reserva ha sido cancelada con éxito.");
        } catch (error) {
          console.error(error);
          alert("Ocurrió un error al intentar cancelar la reserva.");
        }
      });
    }
  };

  return (
    <button
      onClick={manejarCancelacion}
      disabled={isPending}
      className={`text-sm font-semibold transition-colors ${
        isPending 
          ? "text-gray-400 cursor-not-allowed" 
          : "text-rose-600 hover:text-rose-800 hover:underline"
      }`}
    >
      {isPending ? "Cancelando..." : "Cancelar reserva"}
    </button>
  );
}