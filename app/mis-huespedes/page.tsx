import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MisHuespedesPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  // Buscamos tu usuario en la DB
  const dbUser = await prisma.users.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    redirect("/");
  }

  // Buscamos TUS propiedades con sus reservas y datos del huésped
  const misPropiedades = await prisma.properties.findMany({
    where: { owner_id: dbUser.id },
    include: {
      bookings: {
        include: { guest: true },
        orderBy: { check_in_date: "asc" },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Propietario: Mis Reservas</h1>

      {misPropiedades.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500 mb-4">Aún no publicaste ninguna propiedad.</p>
          <Link href="/admin/crear" className="text-rose-600 font-bold hover:underline">
            Publicar mi primer alojamiento
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {misPropiedades.map((propiedad) => (
            <div key={propiedad.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* Cabecera de la Propiedad */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">{propiedad.title}</h2>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-600 border border-gray-200 shadow-sm">
                  {propiedad.bookings.length} reservas
                </span>
              </div>

              {/* Lista de Reservas de esa Propiedad */}
              {propiedad.bookings.length === 0 ? (
                <div className="p-8 text-center text-gray-400 font-medium">
                  No hay reservas confirmadas para este alojamiento todavía.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Huésped</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fechas de estadía</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total Generado</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {propiedad.bookings.map((booking) => {
                        
                        // Lógica visual del estado
                        const isConfirmed = booking.status === "CONFIRMED";
                        const isCancelled = booking.status === "CANCELLED";
                        
                        let statusText = "Pendiente";
                        let statusColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
                        
                        if (isConfirmed) {
                          statusText = "Confirmada";
                          statusColor = "bg-green-100 text-green-800 border-green-200";
                        } else if (isCancelled) {
                          statusText = "Cancelada";
                          statusColor = "bg-red-100 text-red-800 border-red-200";
                        }

                        return (
                          <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                            
                            {/* Columna Huésped */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold text-gray-900">
                                {booking.guest?.full_name || "Usuario Sin Nombre"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {booking.guest?.email || "Sin email"}
                              </div>
                            </td>
                            
                            {/* Columna Fechas */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="font-medium">
                                {format(new Date(booking.check_in_date), "dd MMM", { locale: es })}
                              </span> 
                              <span className="text-gray-400 mx-1">al</span>
                              <span className="font-medium">
                                {format(new Date(booking.check_out_date), "dd MMM", { locale: es })}
                              </span>
                            </td>

                            {/* Columna Estado */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${statusColor}`}>
                                {statusText}
                              </span>
                            </td>

                            {/* Columna Dinero */}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                              ${Number(booking.total_price).toLocaleString("es-AR")}
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}