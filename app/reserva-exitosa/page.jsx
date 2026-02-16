import Link from 'next/link';

export default function ReservaExitosa({ searchParams }) {
  // Capturamos los datos que vienen por la URL
  const propiedad = searchParams.propiedad || "Tu alojamiento";
  const checkin = searchParams.checkin;
  const checkout = searchParams.checkout;
  const total = searchParams.total;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
        
        {/* Ícono de Éxito animado (Tailwind) */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Reserva Confirmada!</h1>
        <p className="text-gray-600 mb-6">Tu estadía ya está registrada en nuestro sistema.</p>

        {/* Tarjeta de Resumen Dinámica */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left border border-gray-200">
          <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">Resumen del viaje</h3>
          
          {propiedad && (
            <p className="text-sm text-gray-600 mb-1 flex justify-between">
              <span className="font-medium">Propiedad:</span> 
              <span>{propiedad}</span>
            </p>
          )}
          {checkin && (
            <p className="text-sm text-gray-600 mb-1 flex justify-between">
              <span className="font-medium">Check-in:</span> 
              <span>{checkin}</span>
            </p>
          )}
          {checkout && (
            <p className="text-sm text-gray-600 mb-1 flex justify-between">
              <span className="font-medium">Check-out:</span> 
              <span>{checkout}</span>
            </p>
          )}
          {total && (
            <p className="text-base text-gray-800 font-bold mt-3 pt-3 border-t flex justify-between">
              <span>Total:</span> 
              <span>${total}</span>
            </p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-3">
          <Link href="/mis-viajes" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
            Ver mis viajes
          </Link>
          <Link href="/" className="w-full bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-200">
            Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
}