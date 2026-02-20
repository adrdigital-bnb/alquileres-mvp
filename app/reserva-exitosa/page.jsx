'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResumenViaje() {
  const searchParams = useSearchParams();
  
  // Leemos los datos de la URL que ya estás mandando perfecto
  const propiedad = searchParams.get('propiedad') || 'Tu alojamiento';
  const checkin = searchParams.get('checkin') || '-';
  const checkout = searchParams.get('checkout') || '-';
  const total = searchParams.get('total') || '-';

  return (
    <div className="border border-gray-200 rounded-lg p-4 text-sm text-left mb-6 w-full">
      <h3 className="font-semibold text-gray-800 mb-2">Resumen del viaje</h3>
      <hr className="mb-3 border-gray-200" />
      
      <div className="flex justify-between mb-2">
        <span className="text-gray-500">Propiedad:</span>
        <span className="font-medium text-gray-900 text-right">{propiedad}</span>
      </div>
      
      <div className="flex justify-between mb-2">
        <span className="text-gray-500">Check-in:</span>
        <span className="font-medium text-gray-900">{checkin}</span>
      </div>
      
      <div className="flex justify-between mb-2">
        <span className="text-gray-500">Check-out:</span>
        <span className="font-medium text-gray-900">{checkout}</span>
      </div>
      
      <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
        <span className="font-semibold text-gray-800">Total pagado:</span>
        <span className="font-bold text-blue-600">${total}</span>
      </div>
    </div>
  );
}

export default function ReservaExitosaPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center">
        
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h1>
        <p className="text-gray-500 text-sm mb-6">Tu estadía ya está registrada en nuestro sistema.</p>

        {/* Acá cargamos el componente que lee la URL */}
        <Suspense fallback={<div className="mb-6 h-32 w-full bg-gray-100 animate-pulse rounded-lg"></div>}>
          <ResumenViaje />
        </Suspense>

        <div className="space-y-3 w-full">
          <Link href="/mis-viajes" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
            Ver mis viajes
          </Link>
          <Link href="/" className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors border border-gray-200">
            Volver al inicio
          </Link>
        </div>
        
      </div>
    </div>
  );
}