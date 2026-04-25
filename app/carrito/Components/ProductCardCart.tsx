import Image from "next/image";
import { Minus, LucideTrash2, Plus } from "lucide-react";
import Link from "next/link";

export default function ProductCardCart(
    { 
        name, 
        price, 
        image, 
        color, 
        talla, 
        genero, 
        id,
        cantidad,
        id_talla,
        onDecrease,
        onIncrease,
        onDelete,
    } : { 
        name: string; 
        price: number; 
        image: string; 
        color: string; 
        talla: string; 
        genero: string; 
        id: number;
        id_talla: number;
        cantidad: number;
        onDecrease: (id: number, cantidad: number, id_talla: number) => void;
        onIncrease: (id: number, cantidad: number, id_talla: number) => void;
        onDelete: (id: number, id_talla: number) => void;
    }) {
    return (
        <div className="relative h-fit w-180 flex flex-col space-y-7">
          {/* card de carrito */}
          <div className="relative h-fit w-full flex">
            {/* Imagen y botones */}
            <div className="flex flex-col items-center justify-start w-fit h-full space-y-3">
              <div className="h-42 w-42 overflow-hidden relative">
                <Link href={`/productos/${id}`}>
                    <Image
                      src={image}
                      alt={name}
                      fill
                      className=" object-cover"
                    />
                </Link>
              </div>
              <div className="w-full flex h-fit justify-around">
                {/* Boton para cantidades */}
                <div className="rounded-full border border-gray-200 flex justify-between items-center w-26 h-10">
                  <button 
                  onClick={() => onDecrease(id, cantidad, id_talla)}
                  className="h-10 w-10 flex hover:bg-gray-200 justify-center items-center rounded-full">
                    <Minus className="h-4.5 w-4.5" />
                  </button>
                  <p>{cantidad}</p>
          
                  <button 
                    onClick={() => onIncrease(id, cantidad, id_talla)}
                    className="h-10 w-10 hover:bg-gray-200 flex justify-center items-center rounded-full"
                  >
                    <Plus className="h-4.5 w-4.5" />
                  </button>
                </div>
                {/* Boton para favoritos */}
                <div className="rounded-full flex justify-center items-center w-10 h-10 border border-gray-200">
                  <button 
                    onClick={() => onDelete(id, id_talla)}
                    className="h-full w-full flex hover:bg-gray-200 justify-center items-center rounded-full"
                  >
                    <LucideTrash2 className="h-4.5 w-4.5" color="black"/>
                  </button>
                </div>
              </div>
            </div>
            {/* Información del producto */}
            <div className="flex justify-between h-full w-full">
              {/* Titulo y demas */}
              <div className="w-full text-md px-4 py-1 flex flex-col gap-0.5">
                <Link href={`/productos/${id}`} className="w-fit h-fit">
                    <p className="font-semibold hover:opacity-50">{name}</p>
                </Link>
                <p className="text-black font-medium opacity-50">{genero}</p>
                <p className="text-black font-medium opacity-50">{color}</p>
                <p className="text-black font-medium opacity-70 underline underline-offset-6">{'Talla: ' + talla}</p>
                <p className="text-black font-medium opacity-50 mt-3">{Number(price).toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })} / unidad</p>
              </div>
              {/* Precio */}
              <div className="py-1 h-full w-50 flex justify-end px-4">
                <p className="font-semibold">{Number(price * cantidad).toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })}</p>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 w-full"></div>
        </div>
    );
}