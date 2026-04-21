import Image from "next/image";
import Link from "next/link";
import SearchOverlay from "./Search";
import { GeneroResponse } from "@/types/producto/Genero";
import { CategoriaPorGenero, CategoriasGeneroGeneral } from "@/types/producto/Categoria";


export default async function NavBarRol() {


  return (
    <>
    <div className="w-full h-28 bg-black text-white flex justify-between px-12">
      <Link href="/" className="flex items-center justify-center">
        <Image 
          src="/assets/logo/main-logo.svg" 
          alt="Logo" 
          loading="eager"
          width={174} 
          height={80} 
        />
      </Link>
        
      
      <div className="flex space-x-7 items-center">
        <SearchOverlay/>
        <div className="flex space-x-5">
          <Link href="/cuenta">
            <Image src="/assets/images/profile.svg" alt="User" width={30} height={30} />
          </Link>
          <Link href="/cuenta/listadedeseos">
            <Image src="/assets/images/wish.svg" alt="Wishlist" width={30} height={30} />
          </Link>
          <Link href="/carrito">
            <Image src="/assets/images/bag.svg" alt="Cart" width={30} height={30} />
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}