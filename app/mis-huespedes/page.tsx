import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

// 🔴 ESTO APAGA LA CACHÉ: Obliga a leer Neon en vivo cada vez que entrás
export const dynamic = "force-dynamic";

export default async function MisHuespedesPage() {
  const user = await currentUser();
  if (!user) {
    console.log("🔴 DEBUG: No hay sesión en Clerk.");
    redirect("/");
  }

  console.log("===================================");
  console.log("🟢 DEBUG 1 - CLERK ID:", user.id);

  // Buscamos tu usuario en la DB
  const dbUser = await prisma.users.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    console.log("🔴 DEBUG: El usuario logueado no existe en la tabla 'users' de Neon.");
    redirect("/");
  }

  console.log("🟢 DEBUG 2 - NEON USER ID:", dbUser.id);

  // Buscamos TUS propiedades
  const misPropiedades = await prisma.properties.findMany({
    where: { owner_id: dbUser.id },
    include: {
      bookings: {
        include: { guest: true },
        orderBy: { check_in_date: "asc" },
      },
    },
  });

  console.log("🟢 DEBUG 3 - PROPIEDADES ENCONTRADAS:", misPropiedades.length);
  console.log("===================================");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">{propiedad.title}</h2>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-600 border border-gray-200">
                  {propiedad.bookings.length} reservas
                </span>
              </div>

              {propiedad.bookings.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No hay reservas para esta propiedad todavía.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Huésped</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fechas</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {propiedad.bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">{booking.guest.full_name || "Sin nombre"}</div>
                            <div className="text-sm text-gray-500">{booking.guest.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(new Date(booking.check_in_date), "dd MMM", { locale: es })} - {format(new Date(booking.check_out_date), "dd MMM", { locale: es })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                            ${Number(booking.total_price).toLocaleString("es-AR")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800">
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
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