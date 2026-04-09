import { getCategorias } from "@/client/categoria.client";
import { getGeneros } from "@/client/genero.client";
import { getColores } from "@/client/color.client";
import { getMarcas } from "@/client/marca.client";
import { getProveedoresBancarios } from "@/client/proveedor.client";
import Link from "next/link";
import Image from "next/image";

const asistencias = {
  data: [
    { id: 1, nombre: "Preguntas Frecuentes" },
    { id: 2, nombre: "Productos" },
    { id: 3, nombre: "Pedidos" },
    { id: 4, nombre: "Métodos de pago" },
    { id: 5, nombre: "Envíos" },
  ],
};

export default async function Footer() {
  const categorias = await getCategorias();
  const generos = await getGeneros();
  const colores = await getColores();
  const marcas = await getMarcas();
  const proveedoresBancarios = await getProveedoresBancarios();

  return (
    <>
      <div className="w-full h-164 bg-[#222] flex flex-col items-center justify-start p-14 space-y-10">
        
        {/* Arriba */}
        <div className="flex justify-start w-full">
          {/* Logo con redes */}
          <div className="flex flex-col items-start justify-start gap-7 py-12">
            <div className="w-56">
              <Image
                src="/assets/logo/snd-logo.svg"
                alt="Logo"
                width={154}
                height={80}
              />
            </div>

            <div className="w-full h-px bg-[#D4AF37]"></div>

            <div className="flex space-x-8">
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
          <div className="max-w-6xl mx-auto grid grid-cols-4 gap-16 px-8">
            <div className="flex flex-col text-white space-y-5">
              <p className="font-bold">{"PRODUCTOS"}</p>
              <ul className="flex flex-col space-y-2">
                {
                  generos.data?.map(
                    (genero) => (
                      <li key={genero.id} className="hover:underline">
                        <Link href={`#`}>
                          {genero.nombre}
                        </Link>
                      </li>
                    )
                  )
                }

                {
                  categorias.data?.map(
                    (categoria) => (
                      <li key={categoria.id} className="hover:underline">
                        <Link href={`#`}>
                          {categoria.name}
                        </Link>
                      </li>
                    )
                  )
                }
              </ul>
            </div>

            <div className="flex flex-col text-white space-y-5">
              <p className="font-bold">{"MARCAS"}</p>
              <ul className="flex flex-col space-y-2">
                {
                  marcas.data?.map(
                    (marca) => (
                      <li key={marca.id} className="hover:underline">
                        <Link href={`#`}>
                          {marca.nombre}
                        </Link>
                      </li>
                    )
                  )
                }
              </ul>
            </div>

            <div className="flex flex-col text-white space-y-5">
              <p className="font-bold">{"COLORES"}</p>
              <ul className="flex flex-col space-y-2">
                {
                  colores.data?.map(
                    (color) => (
                      <li key={color.id} className="hover:underline">
                        <Link href={`#`}>
                          {color.nombre}
                        </Link>
                      </li>
                    )
                  )
                }
              </ul>
            </div>

            <div className="flex flex-col text-white space-y-5">
              <p className="font-bold">{"ASISTENCIA"}</p>
              <ul className="flex flex-col space-y-2">
                {
                  asistencias.data?.map(
                    (asistencia) => (
                      <li key={asistencia.id} className="hover:underline">
                        <Link href={`#`}>
                          {asistencia.nombre}
                        </Link>
                      </li>
                    )
                  )
                }
              </ul>
            </div>
          </div>
        </div>
        

        <div className="w-full h-px bg-[#D4AF37]"></div>

        {/* Copy y metodos pago */}
        <div className="flex justify-between items-center w-full h-full">
          <div className="text-white">
            <p>© {new Date().getFullYear()} Luxury Clothes</p>
          </div>
          <div className="flex justify-center items-center space-x-2.5">
            {
              proveedoresBancarios.data?.map(
                (proveedor) => (
                  <div key={proveedor.id} className="flex items-center space-x-4">
                    {proveedor.id !== 5 &&(<div className="w-16 h-7 bg-white flex items-center justify-center rounded-lg">
                      <Image
                        src={proveedor.url}
                        alt={proveedor.nombre}
                        width={48}
                        height={27}
                        style={{
                          scale: 1.2,
                          objectFit: "cover",
                        }}
                      />
                    </div>)}
                  </div>
                )
              )
            }

          </div>
        </div>
      </div>
    </>
  );
}