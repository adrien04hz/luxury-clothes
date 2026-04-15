import Image from "next/image";
import BreadCrumb from "./components/BreadCrumb";
import CatalogoCuerpo from "./components/CatalogoCuerpo";
import { Producto } from "@/types/producto/Producto";
import { getCatalogo } from "@/client/producto.client";
import { Loader } from "lucide-react";

type Props = {
  searchParams: {
    categoria?: number;
    subcategoria?: number;
    genero?: number;
  };
};


export default async function Productos({searchParams}: Props) {
  const { categoria, subcategoria, genero } = await searchParams;

  const res = await getCatalogo({
    id_categoria: categoria,
    id_subcategoria: subcategoria,
    id_genero: genero
  });

  const { productos } = res || {};

  if (productos.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    // div principal
    <div className="flex flex-col justify-center items-start px-24 mb-24 w-full h-fit">
      {/* breadcrumb */}
      <BreadCrumb />

      {/* titulo y apartado de filtro */}
      <div className="flex w-full justify-between mb-4">
        <div className="text-3xl font-medium">
          <p>Chamarras para Hombre (10) </p>
        </div>

        <div className="flex items-center space-x-1">
          <div className="text-xl">
            <p>Mostrar Filtros</p>
          </div>

          <div>
            <Image
              src="/assets/images/filter.svg"
              alt="Filtros"
              width={27}
              height={27}
            />
          </div>
        </div>
      </div>

      {/* Contenedor principal para productos cards */}
      <CatalogoCuerpo items={productos} />
    </div>
  );
}
