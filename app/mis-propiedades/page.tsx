import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteButton from "@/app/components/DeleteButton";
import Image from "next/image"; 
// 🟢 IMPORTAMOS DATE-FNS PARA FORMATEAR LAS FECHAS
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function MisPropiedadesPage() {
  const { userId } = await auth(); 

  if (!userId) {
    redirect("/");
  }

  const dbUser = await prisma.users.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    redirect("/");
  }

  // 🟢 AHORA LE PEDIMOS A PRISMA QUE TAMBIÉN TRAIGA LAS RESERVAS
  const properties = await prisma.properties.findMany({
    where: {
      owner_id: dbUser.id, 
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      bookings: {
        where: { status: { not: "CANCELLED" } }, // Solo traemos las que no estén canceladas
        orderBy: { check_in_date: "asc" } // Ordenadas por fecha más próxima
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white border-b px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-rose-500">
          🏡 Volver al Inicio
        </Link>
        <h1 className="text-gray-700 font-semibold">Panel de Control</h1>
      </nav>

      <main className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Propiedades</h1>
          <Link
            href="/admin/crear"
            className="bg-rose-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-rose-700 transition shadow-sm"
          >
            + Nueva Propiedad
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-200">
            <p className="text-gray-500 mb-4">Aún no tienes propiedades publicadas.</p>
            <Link
              href="/admin/crear"
              className="text-rose-600 font-bold hover:underline"
            >
              ¡Publica la primera!
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs">
                  <tr>
                    <th className="px-6 py-4">Propiedad</th>
                    <th className="px-6 py-4">Precio</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Fechas Reservadas</th> {/* 🟢 NUEVA COLUMNA */}
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50 transition">
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-16 relative rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                             {property.images[0] ? (
                               <Image 
                                 src={property.images[0]} 
                                 alt={property.title}
                                 fill
                                 className="object-cover"
                               />
                             ) : (
                               <div className="flex items-center justify-center h-full text-xs text-gray-400">Sin foto</div>
                             )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{property.title}</div>
                            <div className="text-xs text-gray-400">{property.city || "Buenos Aires"}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-900">
                        ${property.price_per_night.toString()} <span className="text-gray-400 font-normal">/noche</span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold border border-green-200">
                          Activa
                        </span>
                      </td>

                      {/* 🟢 NUEVA COLUMNA CON LAS FECHAS OCUPADAS */}
                      <td className="px-6 py-4">
                        {property.bookings.length === 0 ? (
                          <span className="text-gray-400 text-xs italic">Sin reservas aún</span>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            {property.bookings.map((booking) => (
                              <span key={booking.id} className="inline-flex items-center justify-center bg-rose-50 text-rose-700 px-2 py-1 rounded border border-rose-100 text-xs font-semibold whitespace-nowrap w-fit">
                                {format(new Date(booking.check_in_date), "dd/MM/yyyy")} al {format(new Date(booking.check_out_date), "dd/MM/yyyy")}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/propiedad/${property.slug}`}
                            className="text-gray-400 hover:text-gray-600 text-xs font-medium"
                            title="Ver como visitante"
                          >
                            👁️ Ver
                          </Link>
                          
                          <Link
                            href={`/propiedades/editar/${property.id}`}
                            className="text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-3 py-1.5 rounded-md text-xs transition"
                          >
                            Editar
                          </Link>
                          
                          <div className="scale-90 origin-right">
                             <DeleteButton propertyId={property.id} />
                          </div>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}