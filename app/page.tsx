import { getCategorias } from "@/client/categoria.client";
import { getGeneros } from "@/client/genero.client";
import { getColores } from "@/client/color.client";
import { getMarcas } from "@/client/marca.client";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const categorias = await getCategorias();
  const generos = await getGeneros();
  const colores = await getColores();
  const marcas = await getMarcas();
  
  return (
    <>
      <div className="w-full h-145 bg-[#222] flex flex-col items-center justify-center gap-8">
        
        {/* Arriba */}
        <div className="flex justify-start w-full">
          {/* Logo con redes */}
          <div>
            <div>
              <Image
                src="/assets/logo/snd-logo.svg"
                alt="Logo"
                width={124}
                height={56}
              />
            </div>

            <div className="w-full h-px bg-gray-600"></div>

            <div className="flex gap-2 my-4">
              <a href="#" className="text-white hover:text-gray-300">
                <Image
                  src="/assets/images/facebook.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <Image
                  src="/assets/images/instagram.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <Image
                  src="/assets/images/tik-tok.svg"
                  alt="TikTok"
                  width={24}
                  height={24}
                />
              </a>

              <a href="#" className="text-white hover:text-gray-300">
                <Image
                  src="/assets/images/gorjeo.svg"
                  alt="X"
                  width={24}
                  height={24}
                />
              </a>
            </div>

          </div>
          {/* Las columnas */}
          <div></div>
        </div>

        {/* Copy y metodos pago */}
        <div></div>
      </div>
    </>
  );
}
