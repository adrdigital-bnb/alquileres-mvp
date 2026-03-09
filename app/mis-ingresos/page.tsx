import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic"; // Asegura que siempre traiga datos frescos de la BD

export default async function DashboardIngresos() {
  // 1. Autenticación: Verificamos quién es el usuario actual
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 2. LA LÓGICA CORE: Consulta a PostgreSQL con Prisma
  // Traemos las propiedades del usuario junto con sus reservas confirmadas
  const propiedadesConReservas = await prisma.properties.findMany({
    where: {
      owner_id: userId,
    },
    include: {
      bookings: {
        where: {
          status: "CONFIRMED", // Solo contamos lo que ya se pagó
        },
        orderBy: {
          check_in_date: "desc", // Las más recientes primero
        },
      },
    },
  });

  // 3. Procesamiento de datos (Matemática del Dashboard)
  let ingresosTotalesGlobales = 0;
  let reservasTotalesGlobales = 0;

  // Mapeamos los datos para armar un resumen por propiedad
  const resumenPropiedades = propiedadesConReservas.map((propiedad) => {
    const reservasConfirmadas = propiedad.bookings.length;
    
    // Prisma devuelve Decimal, lo pasamos a Number para sumar
    const ingresosPropiedad = propiedad.bookings.reduce((acumulador, reserva) => {
      return acumulador + Number(reserva.total_price);
    }, 0);

    // Sumamos a los totales globales
    ingresosTotalesGlobales += ingresosPropiedad;
    reservasTotalesGlobales += reservasConfirmadas;

    return {
      id: propiedad.id,
      titulo: propiedad.title,
      ingresos: ingresosPropiedad,
      cantidadReservas: reservasConfirmadas,
      ultimaReserva: propiedad.bookings[0]?.check_in_date || null,
    };
  });

  // Formateador de moneda argentina
  const formatearDinero = (monto: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(monto);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Mis Ingresos</h1>
            <p className="text-gray-500 mt-2">Resumen financiero de tus propiedades en el MVP</p>
          </div>
          <Link href="/" className="text-blue-600 hover:underline font-medium">
            Volver al inicio
          </Link>
        </div>

        {/* --- TARJETAS DE MÉTRICAS GLOBALES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Ingresos Totales</h3>
            <p className="text-3xl font-black text-gray-900">{formatearDinero(ingresosTotalesGlobales)}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Reservas Confirmadas</h3>
            <p className="text-3xl font-black text-gray-900">{reservasTotalesGlobales}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Propiedades Activas</h3>
            <p className="text-3xl font-black text-gray-900">{propiedadesConReservas.length}</p>
          </div>
        </div>

        {/* --- TABLA DE RENDIMIENTO POR PROPIEDAD --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Rendimiento por Propiedad</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-gray-500 text-sm">
                  <th className="px-6 py-4 font-semibold">Propiedad</th>
                  <th className="px-6 py-4 font-semibold text-center">Reservas (Pagadas)</th>
                  <th className="px-6 py-4 font-semibold text-right">Ingresos Generados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resumenPropiedades.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                      Todavía no tenés propiedades registradas o reservas confirmadas.
                    </td>
                  </tr>
                ) : (
                  resumenPropiedades.map((prop) => (
                    <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 block">{prop.titulo}</span>
                        {prop.ultimaReserva && (
                          <span className="text-xs text-gray-500">
                            Último check-in: {prop.ultimaReserva.toLocaleDateString("es-AR")}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gray-700">
                        {prop.cantidadReservas}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600 text-lg">
                        {formatearDinero(prop.ingresos)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}