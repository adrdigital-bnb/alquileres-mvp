"use client";

import { useState } from "react";

// Definimos las props que necesita el botón para armar el payload
interface BotonReservaProps {
  propertyId: string;
  nombrePropiedad: string;
  checkIn: string; // Formato esperado: YYYY-MM-DD
  checkOut: string; // Formato esperado: YYYY-MM-DD
  precioTotal: number;
  reservaId?: string; // Opcional: si ya creaste un registro PENDING en la BD
}

export default function BotonReserva({
  propertyId,
  nombrePropiedad,
  checkIn,
  checkOut,
  precioTotal,
  reservaId,
}: BotonReservaProps) {
  const [loading, setLoading] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  const procesarPago = async () => {
    setLoading(true);
    setErrorMensaje(null); // Limpiamos errores anteriores

    try {
      // 1. Armamos el payload exacto que espera nuestro route.ts
      const payload = {
        propertyId: propertyId,
        checkin: checkIn,
        checkout: checkOut,
        propiedad: nombrePropiedad,
        total: precioTotal,
        reservaId: reservaId,
      };

      // 2. Disparamos la petición al backend
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // 3. 🛡️ EL ESCUDO: Capturamos la validación de fechas de PostgreSQL
      if (response.status === 409) {
        setErrorMensaje(
          "Las fechas seleccionadas acaban de ser reservadas. Por favor, actualizá el calendario y elegí otros días."
        );
        setLoading(false);
        return; // Cortamos la ejecución acá, no hay redirección
      }

      // 4. Capturamos cualquier otro error genérico (ej. 400 o 500)
      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error inesperado al procesar el pago.");
      }

      // 5. ¡Camino despejado! Redirigimos al init_point de Mercado Pago
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error en el checkout desde el cliente:", error);
      setErrorMensaje("No pudimos conectar con la pasarela de pago. Intentá nuevamente en unos minutos.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <button
        onClick={procesarPago}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            {/* Un pequeño spinner de carga (SVG) */}
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </span>
        ) : (
          "Reservar con Mercado Pago"
        )}
      </button>

      {/* Renderizado condicional del mensaje de error para el usuario */}
      {errorMensaje && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
          {errorMensaje}
        </div>
      )}
    </div>
  );
}