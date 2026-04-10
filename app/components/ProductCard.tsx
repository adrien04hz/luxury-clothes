//parametros
//showBoton, que sea dinamico el card 
import Image from "next/image";
export default function ProductCard() {
  return (
    <div className="border border-gray-200 ">
        <div className="w-145 h-145 flex items-center justify-center">
            <Image src={"https://delvaux-media.imgix.net/products/Delvaux_handbag_Brillant-Tempo-Small-Allure-Calf-26-250-Orage-V4_AA0730CBN085OPA.jpg?w=1024&fm=webp&q=100"} width={400} height={400} alt="product" loading="lazy" className="w-full h-full object-cover"/>
        </div>
        <div className="w-145 h-55 p-4">
            <h2 className="text-lg font-semibold mb-2">Valentino</h2>
            <p className="text-gray-600 mb-4">Sudadera De Algodón Con Parche Le Chat De La Maison</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Agregar al Carrito</button>
        </div>

        
    </div>
  );
}