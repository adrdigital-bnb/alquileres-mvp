"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import "react-day-picker/dist/style.css"; 
import { createBooking } from "@/app/actions"; // 🟢 IMPORTAMOS TU FUNCIÓN DEL BACKEND

// 🟢 AGREGAMOS "propertyId" PARA SABER QUÉ CASA RESERVAR
export default function BookingCalendar({ propertyId, pricePerNight, propertyTitle }: { propertyId: string, pricePerNight: number, propertyTitle: string }) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(false); // 🟢 ESTADO PARA EL BOTÓN DE CARGA

  // Calculamos las noches y el total
  const totalNights = dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) 
    : 0;
    
  const totalPrice = totalNights > 0 ? totalNights * pricePerNight : 0;

  // 🟢 LA NUEVA FUNCIÓN QUE HABLA CON TU BASE DE DATOS
  const handleReserve = async () => {
    if (!dateRange?.from || !dateRange?.to) return;
    
    setIsLoading(true); // Arranca a girar la ruedita virtual

    try {
      const result = await createBooking(
        propertyId, 
        dateRange.from, 
        dateRange.to, 
        totalPrice
      );

      if (result.success) {
        alert("🎉 ¡Reserva guardada con éxito en la base de datos!");
        setDateRange(undefined); // Limpiamos el calendario para la próxima
      }
    } catch (error: any) {
      alert(error.message || "Ocurrió un error al intentar reservar. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false); // Frena la ruedita virtual
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 sticky top-4">
      <div className="mb-4">
        <span className="text-2xl font-bold text-gray-900">${pricePerNight}</span>
        <span className="text-gray-500 text-sm"> ARS / noche</span>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="p-4 flex justify-center bg-white text-gray-900">
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            locale={es}
            disabled={{ before: new Date() }} 
            className="font-sans m-0"
            classNames={{
              caption: "flex justify-center py-2 mb-4 relative items-center text-gray-900 font-extrabold capitalize text-lg",
              head_cell: "text-gray-500 font-bold text-xs uppercase w-10 pb-2",
              day: "h-10 w-10 p-0 font-medium hover:bg-gray-100 rounded-full text-gray-900 transition-colors cursor-pointer",
              day_disabled: "text-gray-300 cursor-not-allowed hover:bg-transparent",
              nav_button: "text-gray-600 hover:text-black transition-colors",
              nav_button_previous: "absolute left-2",
              nav_button_next: "absolute right-2",
            }}
            modifiersClassNames={{
              selected: "bg-rose-600 text-white font-bold hover:bg-rose-700 hover:text-white",
              range_middle: "bg-rose-50 text-rose-900 rounded-none hover:bg-rose-100 hover:text-rose-900",
              range_start: "bg-rose-600 text-white rounded-l-full font-bold hover:bg-rose-700 hover:text-white",
              range_end: "bg-rose-600 text-white rounded-r-full font-bold hover:bg-rose-700 hover:text-white",
            }}
          />
        </div>
        
        <div className="grid grid-cols-2 border-t border-gray-200 divide-x divide-gray-200 bg-gray-50">
          <div className="p-3">
            <label className="block text-xs font-bold text-gray-800 uppercase">Check-in</label>
            <span className="text-sm text-gray-600">
              {dateRange?.from ? format(dateRange.from, "dd MMM yyyy", { locale: es }) : "Agregar fecha"}
            </span>
          </div>
          <div className="p-3">
            <label className="block text-xs font-bold text-gray-800 uppercase">Check-out</label>
            <span className="text-sm text-gray-600">
              {dateRange?.to ? format(dateRange.to, "dd MMM yyyy", { locale: es }) : "Agregar fecha"}
            </span>
          </div>
        </div>
      </div>

      {totalNights > 0 && (
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-gray-600 text-sm">
            <span>${pricePerNight} x {totalNights} noches</span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Tarifa de servicio (MVP)</span>
            <span className="text-green-600 font-medium">¡Gratis!</span>
          </div>
          <hr className="my-2 border-gray-200" />
          <div className="flex justify-between font-bold text-gray-900 text-lg">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleReserve}
        disabled={!dateRange?.from || !dateRange?.to || isLoading}
        className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md flex justify-center items-center"
      >
        {isLoading 
          ? "Procesando reserva..." // 🟢 EL TEXTO CAMBIA MIENTRAS CARGA
          : (dateRange?.from && dateRange?.to ? "Reservar ahora" : "Seleccioná tus fechas")
        }
      </button>
      
      <p className="text-center text-gray-500 text-xs mt-3">
        Aún no se te cobrará ningún importe
      </p>
    </div>
  );
}