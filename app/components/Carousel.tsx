//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor : Diaz Antonio Luis Pedro*/
//* Fecha: 22/04/2026 */
//**********/
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carrusel({ productos }: { productos: any[] }) {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (productos.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % productos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [productos]);

  const siguiente = (e: any) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % productos.length);
  };

  const anterior = (e: any) => {
    e.stopPropagation();
    setIndex((prev) =>
      prev === 0 ? productos.length - 1 : prev - 1
    );
  };



  if (productos.length === 0) return null;

  const producto = productos[index];

  return (
    <div className="absolute inset-0 cursor-pointer">
      <img
        src={producto.imagen_url}
        className="w-full h-full object-cover"
      />

      {/* difunimar la parte de la imagen */}
      <div className="absolute inset-0 bg-black/40" />

      {/*  anterior */}
      <button onClick={anterior} className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full z-10 transition">
        <ChevronLeft size={40} />
      </button>

      {/*  siguiente */}
      <button onClick={siguiente} className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full z-10 transition">
        <ChevronRight size={40} />
      </button>
    </div>
  );
}