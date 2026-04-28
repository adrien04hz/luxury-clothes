/**
 * Carrusel de productos para la página principal
 * @author Diaz Antonio Luis Pedro
 * @author Hernandez Sanchez Adrien
 * @date 22/04/2026
 * Ultima modificacion: 27/04/2026
 */


"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { Producto } from "@/types/producto/Producto";
import Image from "next/image";

export default function Carrusel({ productos }: { productos: Producto[] }) {
  const [index, setIndex] = useState<number>(0);
  const [transition, setTransition] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (productos.length === 0) return;

    const interval = setInterval(() => {
      if (index === productos.length - 1) {
        setTransition(false);
        setIndex(0);

        setTimeout(() => {
          setTransition(true);
        }, 50);
      } else {
        setTransition(true);
        setIndex((prev) => prev + 1);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [index, productos.length]);


  const siguiente = (e: any) => {
    e.stopPropagation();

    if (index === productos.length - 1) {
      setTransition(false);
      setIndex(0);

      setTimeout(() => {
        setTransition(true);
      }, 50);
    } else {
      setTransition(true);
      setIndex((prev) => prev + 1);
    }
  };

  const anterior = (e: any) => {
    e.stopPropagation();

    if (index === 0) {
      setTransition(false);
      setIndex(productos.length - 1);

      setTimeout(() => {
        setTransition(true);
      }, 50);
    } else {
      setTransition(true);
      setIndex((prev) => prev - 1);
    }
  };

  if (productos.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-200 gap-2">
        <Loader size={48} className="animate-spin text-gray-500" />
        <p className="text-gray-500">Cargando productos...</p>
      </div>
    );
  };

  const producto = productos[index];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`
            flex h-full
            ${transition ? "transition-transform duration-700 ease-in-out" : ""}
          `}
          style={{
            width: `${productos.length * 100}%`,
            transform: `translateX(-${index * (100 / productos.length)}%)`,
          }}
        >
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="relative w-full h-full shrink-0"
              style={{ width: `${100 / productos.length}%` }}
            >
              <Image
                src={producto.imagen_url || "/assets/images/bag.svg"}
                alt={producto.nombre}
                fill
                className="object-contain object-center scale-95"
                priority={producto.id === productos[0].id}
                quality={100}
              />
            </div>
          ))}
        </div>
      </div>

      {/* difunimar la parte de la imagen */}
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />

      {/*  anterior */}
      <button onClick={anterior} className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full z-10 transition hover:cursor-pointer">
        <ChevronLeft size={25}/>
      </button>

      {/*  siguiente */}
      <button onClick={siguiente} className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full z-10 transition hover:cursor-pointer">
        <ChevronRight size={25} />
      </button>

      <div
        key={producto.id}
        className="
          absolute bottom-40 left-35
          flex flex-col items-start gap-10 z-10
          animate-fade-slide
        "
      >
        <div className="flex flex-col gap-2">
          <p className="text-white text-2xl z-10">
            {producto.marca}
          </p>
          <h2 className="text-white text-4xl font-bold z-10 max-w-240">{producto.nombre}</h2>
        </div>

        <button className="text-black bg-white py-2 px-4 rounded-[28px] hover:cursor-pointer" onClick={() => router.push(`/productos/${producto.id}`)}>
          Ver producto
        </button>
      </div>
    </div>
  );
}