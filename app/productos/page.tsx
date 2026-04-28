import BreadCrumb from "./components/BreadCrumb";
import CatalogoCuerpo from "./components/CatalogoCuerpo";
import { getCatalogo } from "@/client/producto.client";
import { breadCrumbs } from "./utils/producto";
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
    orden?: string;
  };
};


export default async function Productos({searchParams}: Props) {
  const { categoria, subcategoria, genero, marca, color, orden } = await searchParams;
  let data;
  let filterFlag = false;
  const params = {
    id_categoria: categoria,
    id_subcategoria: subcategoria,
    id_genero: genero,
    id_marca: marca,
    id_color: color,
    order: orden,
  };

  const res = await getCatalogo({
    id_categoria: categoria,
    id_subcategoria: subcategoria,
    id_genero: genero,
    id_marca: marca,
    id_color: color,
    order: orden,
  });


  const titulos = breadCrumbs({
    id_categoria: categoria || 0,
    id_subcategoria: subcategoria,
    id_genero: genero,
    id_marca: marca
  });

  const { productos } = res || {};

  // Respuesta para el filtro
  try {
    const filtroRes = await getFiltroV2(categoria || 0);
    data = filtroRes.data;
  } catch (err : any) {
    if (err.message === "El ID de categoría no puede ser 0") {
      filterFlag = true;
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
        marca={marca}
      />

      <div className="flex justify-between items-center w-full sticky top-0 bg-white z-5 mt-4 py-4">
        <FiltroV2 
          params={params}
          data={data}
          count={productos.length} 
          titulos={titulos}
          flag={filterFlag}
        />
        
      </div>

      {/* Contenedor principal para productos cards */}
      <CatalogoCuerpo items={productos} />
    </div>
  );
}