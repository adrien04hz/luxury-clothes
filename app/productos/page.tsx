import BreadCrumb from "./components/BreadCrumb";
import CatalogoCuerpo from "./components/CatalogoCuerpo";
import { getCatalogo } from "@/client/producto.client";
import { Loader } from "lucide-react";
import { breadCrumbs } from "./utils/producto";
import Filtros from "./components/Filtros";
import { getMarcas } from "@/client/marca.client";
import { getColores } from "@/client/color.client";
import { getGeneros } from "@/client/genero.client";
import { getTodasLasCategorias } from "@/client/categoria.client";

type Props = {
  searchParams: {
    categoria?: number;
    subcategoria?: number;
    genero?: number;
    marca?: number;
  };
};


export default async function Productos({searchParams}: Props) {
  const { categoria, subcategoria, genero, marca } = await searchParams;

  const categoriasRes = await getTodasLasCategorias();
  const generosRes = await getGeneros();
  const generos = generosRes.data;
  const coloresRes = await getColores();
  const colores = coloresRes.data;
  const marcasRes = await getMarcas();
  const marcas = marcasRes.data;

  const res = await getCatalogo({
    id_categoria: categoria,
    id_subcategoria: subcategoria,
    id_genero: genero,
    id_marca: marca,
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

      <div className="flex justify-between items-center w-full sticky top-0 bg-white z-5 mt-4 py-4">
        <Filtros categorias={categoriasRes} generos={generos} colores={colores} marcas={marcas}  count={productos.length} titulos={titulos}/>
      </div>

      {/* Contenedor principal para productos cards */}
      <CatalogoCuerpo items={productos} />
    </div>
  );
}
