import { getCategoriasDefault } from "@/client/categoria.client";
import { getMarcas } from "@/client/marca.client";
import { getProveedoresBancarios } from "@/client/proveedor.client";
import Link from "next/link";
import Image from "next/image";
import { Categorias } from "@/types/producto/Categoria";
import { MarcaResponse } from "@/types/producto/Marca";
import { ProovedoresBancarios, Proveedor } from "@/types/metododepago/ProveedorBancario";

const asistencias = {
  data: [
    { id: 1, nombre: "Preguntas Frecuentes" },
    { id: 2, nombre: "Productos" },
    { id: 3, nombre: "Pedidos" },
    { id: 4, nombre: "Métodos de pago" },
    { id: 5, nombre: "Envíos" },
  ],
};

export default async function Footer({
  categorias,
  marcas,
  proveedoresBancarios,
} : {
  categorias: Categorias,
  marcas: MarcaResponse,
  proveedoresBancarios: ProovedoresBancarios,
}) {
  // const categorias = await getCategoriasDefault();
  // const marcas = await getMarcas();
  // const proveedoresBancarios = await getProveedoresBancarios();

  return (
    <>
      <div className="w-full h-fit bg-[#222] flex flex-col items-center justify-start p-14 space-y-7">
        
        {/* Arriba */}
        <div className="flex justify-start w-full h-fit space-x-32">
          {/* Logo con redes */}
          <div className="flex flex-col items-start justify-start gap-7 py-12">
            <div className="w-56">
              <Image
                src="/assets/logo/snd-logo.svg"
                alt="Logo"
                width={154}
                height={80}
                className="w-auto h-auto"
              />
            </div>

            <div className="w-full h-px bg-[#D4AF37]"></div>

            <div className="flex space-x-8">
              <a href="https://www.instagram.com/luxuryclothes.store.mx/" target="_blank" className="text-white hover:text-gray-300">
                <Image
                  src="/assets/images/facebook.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </a>
              <a href="https://www.instagram.com/luxuryclothes.store.mx/" target="_blank" className="text-white hover:text-gray-300">
                <Image
                  src="/assets/images/instagram.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                />
              </a>
              <a href="https://www.instagram.com/luxuryclothes.store.mx/" target="_blank" className="text-white hover:text-gray-300">
                <Image
                  src="/assets/images/tik-tok.svg"
                  alt="TikTok"
                  width={24}
                  height={24}
                />
              </a>

              <a href="https://www.instagram.com/luxuryclothes.store.mx/" className="text-white hover:text-gray-300">
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
          <div className="max-w-6xl grid grid-cols-4 gap-24 px-8">
            <div className="flex flex-col text-white space-y-5">
              <p className="font-bold">{"PRODUCTOS"}</p>
              <ul className="flex flex-col space-y-2">
                {
                  categorias.data?.map(
                    (categoria) => (
                      <li key={categoria.id} className="hover:underline">
                        <Link href={`productos?categoria=${categoria.id}`}>
                          {categoria.nombre}
                        </Link>
                      </li>
                    )
                  )
                }
              </ul>
            </div>

            <div className="flex flex-col text-white space-y-5">
              <p className="font-bold">{"MARCAS DESTACADAS"}</p>
              <ul className="flex flex-col space-y-2">
                {
                  marcas.data?.slice(0,16).map(
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
              <p className="font-bold">{"NOVEDADES"}</p>
              <ul className="flex flex-col space-y-2">
                {
                  marcas.data?.slice(16,28).map(
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
              <p className="font-bold">{"ASISTENCIA"}</p>
              <ul className="flex flex-col space-y-2">
                {
                  asistencias.data?.map(
                    (asistencia) => (
                      <li key={asistencia.id} className="hover:underline">
                        <Link href={`/asistencia/`}>
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
                    {proveedor.id !== 5 &&(<div className="w-16 h-8 bg-white flex items-center justify-center rounded-lg">
                      <Image
                        src={proveedor.url}
                        alt={proveedor.nombre}
                        width={48}
                        height={27}
                        style={{
                          objectFit: "cover",
                          width: "auto",
                          height: "auto",
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