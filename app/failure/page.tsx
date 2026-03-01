import Link from 'next/link';

export default function FailurePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center">
        
        {/* Ícono rojo de error */}
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pago Rechazado</h1>
        <p className="text-gray-500 text-sm mb-6">
          Hubo un problema al procesar tu tarjeta o la operación fue cancelada. No se han realizado cargos en tu cuenta.
        </p>

        <div className="space-y-3 w-full">
          <Link href="/" className="block w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
            Volver a intentar
          </Link>
        </div>
        
      </div>
    </div>
  );
}