import BotonCancelarReserva from "@/app/components/BotonCancelarReserva";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MisViajesPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const dbUser = await prisma.users.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) redirect("/");

  // Buscamos las reservas donde TÚ sos el huésped, incluyendo los datos de la casa
  const misViajes = await prisma.bookings.findMany({
    where: { guest_id: dbUser.id },
    include: {
      property: true, 
    },
    orderBy: { check_in_date: "asc" },
  });

  const formatearDinero = (monto: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(monto);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Próximos Viajes</h1>

      {misViajes.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500 mb-4 text-lg">Aún no tenés ningún viaje programado.</p>
          <Link href="/" className="inline-block bg-rose-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-rose-700 transition-colors">
            Explorar alojamientos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {misViajes.map((viaje) => {
            
            // 🟢 Lógica visual para el estado de la reserva
            const isConfirmed = viaje.status === "CONFIRMED";
            const isCancelled = viaje.status === "CANCELLED";
            
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
              <div key={viaje.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all h-full flex flex-col group">
                
                {/* 🟢 LA PARTE CLICKEABLE (Foto y detalles) */}
                <Link href={`/propiedad/${viaje.property.slug}`} className="flex flex-col flex-grow relative">
                  
                  {/* Imagen de la propiedad */}
                  <div className="relative h-48 w-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {viaje.property.images && viaje.property.images.length > 0 ? (
                      <Image
                        src={viaje.property.images[0]}
                        alt={viaje.property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">Sin imagen</div>
                    )}
                    
                    {/* Etiqueta de estado mejorada */}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${statusColor}`}>
                      {statusText}
                    </div>
                  </div>

                  {/* Detalles del viaje */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                        {viaje.property.title}
                      </h2>
                      <p className="text-sm text-gray-500 mb-4">
                        {viaje.property.city}{viaje.property.province ? `, ${viaje.property.province}` : ''}
                      </p>

                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="text-gray-500">Check-in:</span>
                          <span className="font-bold text-gray-900">
                            {format(new Date(viaje.check_in_date), "dd MMM", { locale: es })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Check-out:</span>
                          <span className="font-bold text-gray-900">
                            {format(new Date(viaje.check_out_date), "dd MMM", { locale: es })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* 🟢 EL FOOTER (Precio y Botón - FUERA del Link para que el botón funcione) */}
                <div className="p-5 pt-0 mt-auto">
                  <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">Total pagado</span>
                      <span className="text-lg font-black text-rose-600">
                        {formatearDinero(Number(viaje.total_price))}
                      </span>
                    </div>

                    {/* Mostramos el botón SOLO si la reserva está confirmada */}
                    {isConfirmed && (
                      <div className="pb-1">
                        <BotonCancelarReserva reservaId={viaje.id} />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}