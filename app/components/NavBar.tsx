import Image from "next/image";
import { getCategorias } from "@/client/categoria.client";
import { getGeneros } from "@/client/genero.client";
import Link from "next/link";
import SearchOverlay from "./Search";


export default async function NavBar() {
  const categorias = await getCategorias();
  const generos = await getGeneros();
  
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
        
      <nav className="z-50 *:h-full flex items-center">
        <ul className="h-full flex justify-center items-center text-sm space-x-9">
          <li className="h-full text-white group hover:underline" key={12312}>
            <div className="h-full w-auto flex items-center justify-center">
              <Link href="#">
                {"CATEGORÍAS"}
              </Link>
            </div>

            <div className="
              fixed left-0 top-28 w-full opacity-0 invisible
              group-hover:opacity-100 group-hover:visible
              transition-all duration-300
              bg-white text-black shadow-xl py-10
            ">
              <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8 px-8">

                {
                  categorias.data?.map( categoria =>
                    <div key={categoria.id}>
                      <p className="font-semibold mb-3"><Link href="#">{categoria.name.toUpperCase()}</Link></p>
                      <ul className="space-y-2 text-gray-600">
                        {
                          categoria.subcategories.map(
                            subcategoria => (
                              <li key={subcategoria.id} className="hover:underline cursor-pointer">
                                <Link href="#">{subcategoria.nombre}</Link>
                              </li>
                            )
                          )
                        }
                      </ul>
                    </div>
                  )
                }

              </div>
            </div>
          </li>

          {generos.data.slice(0, 3)?.map( genero => (
            <li className="h-full text-white group hover:underline flex justify-center items-center" key={genero.id}>
              <div className="h-full w-auto flex items-center justify-center">
                <Link href="#">
                  {genero.nombre.toUpperCase()}
                </Link>
              </div>

              <div className="
                fixed left-0 top-28 w-full opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
                transition-all duration-300
                bg-white text-black shadow-xl py-10
              ">
                <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8 px-8">

                  {
                    categorias.data?.map( categoria =>
                      <div key={categoria.id}>
                        <p className="font-semibold mb-3"><Link href="#">{categoria.name.toUpperCase()}</Link></p>
                        <ul className="space-y-2 text-gray-600">
                          {
                            categoria.subcategories.map(
                              subcategoria => (
                                <li key={subcategoria.id} className="hover:underline cursor-pointer">
                                  <Link href="#">{subcategoria.nombre}</Link>
                                </li>
                              )
                            )
                          }
                        </ul>
                      </div>
                    )
                  }

                </div>
              </div>
            </li>
          ))}
        </ul>
      </nav>
        
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