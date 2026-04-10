//parametros
//showBoton, que sea dinamico el card 
/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 9 de Abril de 2026
 */

import Image from "next/image";
import { ListaDeDeseos } from "@/types/listadedeseos/ListaDeDeseos";

export default function ProductCard({ product, showToCart = true, }: { product?: ListaDeDeseos, showToCart?: boolean }) {
  return (
    // Quitamos alturas fijas del contenedor principal
    <div className="border border-gray-200 flex flex-col h-fit">
      
      <div className="aspect-square w-full flex items-center justify-center overflow-hidden">
         <Image
          src={product?.imagenes?.[0] || "/placeholder.png"}
          width={400}
          height={400}
          alt={product?.nombre || "Producto"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col">
        <h2 className="text-black font-semibold">{product?.marca}</h2>

        <p className="text-black font-regular mb-4">
          {product?.nombre}
        </p>

        <div className="mt-auto">
          <p className="text-black font-medium">
             ${Number(product?.precio).toLocaleString()}
          </p>
          
          {showToCart && (
            <button className="w-full mt-4 border border-gray-300 text-black py-2 rounded-lg hover:bg-black hover:text-white transition">
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
}