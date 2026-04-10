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
          width={174} 
          height={80} 
        />
      </Link>
      <div className="py-14">
        {
          <nav className="z-50">
            <ul className="flex justify-center space-x-9 text-sm">
              <li className="text-white group hover:underline" key={12312}>
                <Link href="#">
                  {"CATEGORÍAS"}
                </Link>

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
                <li className="text-white group hover:underline" key={genero.id}>
                  <Link href="#">
                    {genero.nombre.toUpperCase()}
                  </Link>

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
        }
      </div>
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