import Image from "next/image";
import BreadCrumb from "./components/BreadCrumb";
import CatalogoCuerpo from "./components/CatalogoCuerpo";
import { getCatalogo } from "@/client/producto.client";
import { Loader } from "lucide-react";
import { breadCrumbs } from "./utils/producto";

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

  const titulos = breadCrumbs({
    id_categoria: categoria || 0,
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
      <BreadCrumb 
        categoria={categoria || 0}
        subcategoria={subcategoria}
        genero={genero}
      />

      {/* titulo y apartado de filtro */}
      <div className="flex w-full justify-between mb-4">
        <div className="text-3xl font-medium">
          <p>{(titulos.subcategoria ? titulos.subcategoria : titulos.categoria) + " " + (titulos.genero ? "para " + titulos.genero + " (" + productos.length + ")" : "(" + productos.length + ")")}</p>
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
