import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditForm from "./EditForm"; // 👈 Importamos el formulario que acabamos de crear

// 🚀 TRUCO 1: Forzamos a que esta página NUNCA use caché. 
export const dynamic = "force-dynamic";

export default async function EditarPropiedadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Buscamos los datos en la base de datos (Lado Servidor)
  const property = await prisma.properties.findUnique({
    where: { id: id },
  });

  if (!property) {
    redirect("/");
  }

  // 2. Le pasamos los datos al componente Cliente para que los muestre y permita editar
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <EditForm property={property} />
    </div>
  );
}