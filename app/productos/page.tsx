import BreadCrumb from "./components/BreadCrumb";
import CatalogoCuerpo from "./components/CatalogoCuerpo";
import { getCatalogo } from "@/client/producto.client";
import { breadCrumbs } from "./utils/producto";
// import Filtros from "./components/Filtros";
import { getFiltroV2 } from "@/client/filtro_v2.client";
import FiltroV2 from "./components/FiltroV2";
import EmppyRedirect from "./components/EmpyRedirect";

type Props = {
  searchParams: {
    categoria?: number;
    subcategoria?: number;
    genero?: number;
    marca?: number;
    color?: number;
  };
};


export default async function Productos({searchParams}: Props) {
  const { categoria, subcategoria, genero, marca, color } = await searchParams;
  let data;
  const params = {
    id_categoria: categoria,
    id_subcategoria: subcategoria,
    id_genero: genero,
    id_marca: marca,
    id_color: color
  };

  const res = await getCatalogo({
    id_categoria: categoria,
    id_subcategoria: subcategoria,
    id_genero: genero,
    id_marca: marca,
    id_color: color
  });

  const titulos = breadCrumbs({
    id_categoria: categoria || 0,
    id_subcategoria: subcategoria,
    id_genero: genero
  });

  const { productos } = res || {};

  // Respuesta para el filtro
  try {
    const filtroRes = await getFiltroV2(categoria || 0);
    data = filtroRes.data;
  } catch (err : any) {
    if (err.message === "El ID de categoría no puede ser 0") {
      console.error("Error al obtener el filtro v2:", err.message);
    }    
  }

  if (productos.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <EmppyRedirect />
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
        {/* <Filtros categorias={categoriasRes} generos={generos} colores={colores} marcas={marcas}  count={productos.length} titulos={titulos}/> */}
        <FiltroV2 
          params={params}
          data={data}
          count={productos.length} 
          titulos={titulos}
        />
        
      </div>

      {/* Contenedor principal para productos cards */}
      <CatalogoCuerpo items={productos} />
    </div>
  );
}
function timeout(arg0: () => void, arg1: number) {
  throw new Error("Function not implemented.");
}

