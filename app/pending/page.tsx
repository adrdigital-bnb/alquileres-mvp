import Link from 'next/link';

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center">
        
        {/* Ícono amarillo/naranja de reloj */}
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pago Pendiente</h1>
        <p className="text-gray-500 text-sm mb-6">
          Estamos procesando tu pago. Esto es normal si elegiste un medio de pago en efectivo. Te confirmaremos la reserva apenas ingrese.
        </p>

        <div className="space-y-3 w-full">
          <Link href="/mis-viajes" className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
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