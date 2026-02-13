import CreatePropertyForm from "@/app/components/CreatePropertyForm";

export default function CreatePropertyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Acá llamamos al componente que tiene la lógica nueva, 
        el campo 'Provincia' y la subida de imágenes ordenada.
      */}
      <CreatePropertyForm />
    </div>
  );
}