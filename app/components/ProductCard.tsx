//parametros
//showBoton, que sea dinamico el card 
/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 9 de Abril de 2026
 */

import Image from "next/image";

export default function ProductCard({ showToCart = true }) {
  return (
    // Quitamos alturas fijas del contenedor principal
    <div className="border border-gray-200 flex flex-col h-fit">
      
      <div className="aspect-square w-full flex items-center justify-center overflow-hidden">
        <Image 
          src={"https://delvaux-media.imgix.net/products/Delvaux_handbag_Brillant-Tempo-Small-Allure-Calf-26-250-Orage-V4_AA0730CBN085OPA.jpg?w=1024&fm=webp&q=100"} 
          width={400} 
          height={400} 
          alt="product" 
          loading="lazy" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col">
        <h2 className="text-black font-semibold">Valentino</h2>

        <p className="text-black font-regular mb-4">
          Sudadera De Algodón Con Parche Le Chat De La Maison
        </p>

        <div className="mt-auto">
          <p className="text-black font-medium">$20,243.86</p>
          
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